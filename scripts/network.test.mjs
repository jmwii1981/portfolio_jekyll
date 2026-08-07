import {
    createRetryableRequest,
    fetchJsonWithTimeout,
    fetchWithTimeout,
    RequestTimeoutError
} from './network.mjs';

const assert = {
    equal(actual, expected) {
        if (actual !== expected) {
            throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
        }
    },
    async rejects(promise, expectation) {
        try {
            await promise;
        } catch (error) {
            if (typeof expectation === 'function' && error instanceof expectation) return;
            if (expectation instanceof RegExp && expectation.test(error?.message || '')) return;
            throw new Error(`The rejection did not match the expectation: ${error?.message || error}`);
        }

        throw new Error('Expected the promise to reject.');
    }
};

if (typeof globalThis.AbortController !== 'function') {
    class TestAbortSignal {
        constructor() {
            this.aborted = false;
            this.reason = undefined;
            this.listeners = [];
        }

        addEventListener(type, listener) {
            if (type === 'abort') this.listeners.push(listener);
        }

        dispatchAbort() {
            this.listeners.forEach((listener) => listener());
            this.listeners = [];
        }
    }

    globalThis.AbortController = class TestAbortController {
        constructor() {
            this.signal = new TestAbortSignal();
        }

        abort(reason) {
            if (this.signal.aborted) return;
            this.signal.aborted = true;
            this.signal.reason = reason;
            this.signal.dispatchAbort();
        }
    };
}

const tests = [];
const test = (name, callback) => tests.push({ callback, name });

test('fetchWithTimeout returns successful responses', async () => {
    const response = { ok: true };
    const result = await fetchWithTimeout('/resource', {}, {
        fetchImpl: async () => response,
        timeoutMs: 50
    });

    assert.equal(result, response);
});

test('fetchWithTimeout aborts stalled requests', async () => {
    const stalledFetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    });

    await assert.rejects(
        fetchWithTimeout('/stalled', {}, { fetchImpl: stalledFetch, timeoutMs: 10 }),
        RequestTimeoutError
    );
});

test('fetchJsonWithTimeout bounds response-body parsing', async () => {
    const stalledJsonFetch = async (_url, { signal }) => ({
        json: async () => new Promise((_resolve, reject) => {
            signal.addEventListener('abort', () => reject(signal.reason), { once: true });
        })
    });

    await assert.rejects(
        fetchJsonWithTimeout('/stalled-json', {}, { fetchImpl: stalledJsonFetch, timeoutMs: 10 }),
        RequestTimeoutError
    );
});

test('createRetryableRequest retries after a transient failure', async () => {
    let attempts = 0;
    const load = createRetryableRequest(async () => {
        attempts += 1;
        if (attempts === 1) throw new Error('temporary failure');
        return 'loaded';
    });

    await assert.rejects(load(), /temporary failure/);
    assert.equal(await load(), 'loaded');
    assert.equal(attempts, 2);
});

test('createRetryableRequest shares a successful in-flight request', async () => {
    let attempts = 0;
    const load = createRetryableRequest(async () => {
        attempts += 1;
        return 'loaded';
    });

    const [first, second] = await Promise.all([load(), load()]);

    assert.equal(first, 'loaded');
    assert.equal(second, 'loaded');
    assert.equal(attempts, 1);
});

for (const { callback, name } of tests) {
    try {
        await callback();
        console.log(`✓ ${name}`);
    } catch (error) {
        console.error(`✗ ${name}`);
        throw error;
    }
}

console.log(`Network tests passed: ${tests.length} cases.`);
