export class RequestTimeoutError extends Error {
    constructor(timeoutMs) {
        super(`The request exceeded the ${timeoutMs}ms timeout.`);
        this.name = 'RequestTimeoutError';
    }
}

const requestWithTimeout = async (
    url,
    options,
    { timeoutMs, fetchImpl },
    consumeResponse
) => {
    if (typeof fetchImpl !== 'function') {
        throw new TypeError('A fetch implementation is required.');
    }

    const controller = new AbortController();
    const timeoutError = new RequestTimeoutError(timeoutMs);
    const timeoutId = globalThis.setTimeout(() => controller.abort(timeoutError), timeoutMs);

    try {
        const response = await fetchImpl(url, {
            ...options,
            signal: controller.signal
        });

        return await consumeResponse(response);
    } catch (error) {
        if (controller.signal.aborted) throw timeoutError;
        throw error;
    } finally {
        globalThis.clearTimeout(timeoutId);
    }
};

export const fetchWithTimeout = (
    url,
    options = {},
    { timeoutMs = 10000, fetchImpl = globalThis.fetch } = {}
) => requestWithTimeout(url, options, { timeoutMs, fetchImpl }, (response) => response);

export const fetchJsonWithTimeout = (
    url,
    options = {},
    { timeoutMs = 10000, fetchImpl = globalThis.fetch } = {}
) => requestWithTimeout(url, options, { timeoutMs, fetchImpl }, async (response) => ({
    data: await response.json(),
    response
}));

export const createRetryableRequest = (requestFactory) => {
    let request;

    return () => {
        if (!request) {
            request = Promise.resolve()
                .then(requestFactory)
                .catch((error) => {
                    request = undefined;
                    throw error;
                });
        }

        return request;
    };
};
