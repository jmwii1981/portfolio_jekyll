const MAX_RESULTS = 7;

const normalizeText = (value = '') => value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9@.+#'\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const createHighlightedText = (text, query) => {
    const fragment = document.createDocumentFragment();
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
        fragment.append(text);
        return fragment;
    }

    const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(${escapedQuery})`, 'ig');
    const parts = text.split(pattern);

    parts.forEach((part) => {
        if (part.toLowerCase() === normalizedQuery.toLowerCase()) {
            const mark = document.createElement('mark');
            mark.textContent = part;
            fragment.append(mark);
        } else {
            fragment.append(part);
        }
    });

    return fragment;
};

const scoreRecord = (record, query) => {
    const normalizedQuery = normalizeText(query);
    const tokens = normalizedQuery.split(' ').filter(Boolean);
    const title = normalizeText(record.title);
    const keywords = normalizeText(record.keywords);
    const summary = normalizeText(record.summary);
    const content = normalizeText(record.content);
    const haystack = `${title} ${keywords} ${summary} ${content}`;

    if (!tokens.length || !tokens.every((token) => haystack.includes(token))) return -1;

    let score = Number(record.priority) || 0;

    if (title === normalizedQuery) score += 160;
    if (title.startsWith(normalizedQuery)) score += 110;
    if (title.includes(normalizedQuery)) score += 80;
    if (keywords.includes(normalizedQuery)) score += 56;
    if (summary.includes(normalizedQuery)) score += 34;
    if (content.includes(normalizedQuery)) score += 16;

    tokens.forEach((token) => {
        if (title.startsWith(token)) score += 38;
        else if (title.includes(token)) score += 28;
        if (keywords.includes(token)) score += 8;
        if (summary.includes(token)) score += 4;
    });

    return score;
};

export const rankSearchRecords = (records, query, limit = MAX_RESULTS) => records
    .map((record) => ({ record, score: scoreRecord(record, query) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
    .slice(0, limit)
    .map(({ record }) => record);

export const initializeSiteSearch = () => {
    const search = document.querySelector('[data-site-search]');

    if (!search) return;

    const navContainer = search.closest('.nav-container');
    const toggle = search.querySelector('[data-search-toggle]');
    const panel = search.querySelector('[data-search-panel]');
    const field = search.querySelector('[data-search-field]');
    const input = search.querySelector('[data-search-input]');
    const closeButton = search.querySelector('[data-search-close]');
    const dropdown = search.querySelector('[data-search-dropdown]');
    const resultsList = search.querySelector('[data-search-results]');
    const emptyState = search.querySelector('[data-search-empty]');
    const status = search.querySelector('[data-search-status]');
    const navToggle = navContainer?.querySelector('.nav-toggle');
    const indexUrl = search.dataset.searchIndexUrl;

    const supportsModalDialog = typeof panel?.showModal === 'function' && typeof panel?.close === 'function';

    if (!navContainer || !toggle || !panel || !field || !input || !closeButton || !dropdown || !resultsList || !emptyState || !status || !indexUrl || !supportsModalDialog) return;

    let records = [];
    let indexRequest;
    let activeIndex = -1;
    let visibleResults = [];
    let isOpen = false;

    const loadIndex = () => {
        if (!indexRequest) {
            indexRequest = fetch(indexUrl, { credentials: 'same-origin' })
                .then((response) => {
                    if (!response.ok) throw new Error(`Search index request failed with ${response.status}`);
                    return response.json();
                })
                .then((data) => {
                    records = Array.isArray(data?.records) ? data.records : [];
                    return records;
                });
        }

        return indexRequest;
    };

    const setExpanded = (expanded) => {
        input.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-expanded', String(isOpen));
    };

    const clearResults = () => {
        activeIndex = -1;
        visibleResults = [];
        resultsList.replaceChildren();
        input.removeAttribute('aria-activedescendant');
        dropdown.hidden = true;
        emptyState.hidden = true;
        status.textContent = '';
        setExpanded(false);
    };

    const closeSearch = ({ restoreFocus = false } = {}) => {
        if (!isOpen) return;

        isOpen = false;
        if (panel.open) panel.close();
        navContainer.classList.remove('is-search-open');
        document.documentElement.classList.remove('is-search-open');
        document.body.classList.remove('is-search-open');
        input.value = '';
        clearResults();
        setExpanded(false);

        if (restoreFocus) toggle.focus();
    };

    const openSearch = async () => {
        if (isOpen) return;

        if (navContainer.classList.contains('is-open')) navToggle?.click();

        isOpen = true;
        panel.showModal();
        navContainer.classList.add('is-search-open');
        document.documentElement.classList.add('is-search-open');
        document.body.classList.add('is-search-open');
        setExpanded(false);
        window.requestAnimationFrame(() => input.focus());

        try {
            await loadIndex();
            if (isOpen && input.value.trim()) renderResults(input.value);
        } catch (error) {
            console.error('Site search could not load:', error);
            dropdown.hidden = false;
            emptyState.hidden = false;
            emptyState.querySelector('.site-search-empty-title').textContent = 'Search is temporarily unavailable';
            status.textContent = 'Search is temporarily unavailable.';
        }
    };

    const setActiveResult = (index) => {
        const options = Array.from(resultsList.querySelectorAll('[role="option"]'));

        if (!options.length) return;

        activeIndex = ((index % options.length) + options.length) % options.length;
        options.forEach((option, optionIndex) => {
            option.setAttribute('aria-selected', String(optionIndex === activeIndex));
        });

        const activeOption = options[activeIndex];
        input.setAttribute('aria-activedescendant', activeOption.id);
        activeOption.scrollIntoView({ block: 'nearest' });
    };

    const renderResults = (query) => {
        const normalizedQuery = normalizeText(query);

        if (!normalizedQuery) {
            clearResults();
            return;
        }

        visibleResults = rankSearchRecords(records, query);

        activeIndex = -1;
        resultsList.replaceChildren();
        input.removeAttribute('aria-activedescendant');
        dropdown.hidden = false;
        emptyState.hidden = visibleResults.length > 0;

        visibleResults.forEach((record, index) => {
            const item = document.createElement('li');
            const option = document.createElement('a');
            const heading = document.createElement('span');
            const title = document.createElement('span');
            const category = document.createElement('span');
            const summary = document.createElement('span');

            item.className = 'site-search-result';
            option.className = 'site-search-option';
            option.id = `site-search-option-${index}`;
            option.href = record.url;
            option.role = 'option';
            option.setAttribute('aria-selected', 'false');
            heading.className = 'site-search-result-heading';
            title.className = 'site-search-result-title';
            category.className = 'site-search-result-category';
            summary.className = 'site-search-result-summary';

            title.append(createHighlightedText(record.title, query));
            category.textContent = record.category;
            summary.textContent = record.summary;
            heading.append(title, category);
            option.append(heading, summary);
            item.append(option);
            resultsList.append(item);

            option.addEventListener('pointermove', () => setActiveResult(index));
            option.addEventListener('click', () => closeSearch());
        });

        const count = visibleResults.length;
        status.textContent = count
            ? `${count} search suggestion${count === 1 ? '' : 's'} available.`
            : `No site content matches ${query}.`;
        setExpanded(count > 0);
    };

    toggle.addEventListener('click', openSearch);
    closeButton.addEventListener('click', () => closeSearch({ restoreFocus: true }));
    field.addEventListener('pointerdown', (event) => {
        if (event.target === input || closeButton.contains(event.target)) return;

        event.preventDefault();
        input.focus({ preventScroll: true });
    });
    panel.addEventListener('cancel', (event) => {
        event.preventDefault();
        closeSearch({ restoreFocus: true });
    });
    panel.addEventListener('pointerdown', (event) => {
        if (event.target !== panel) return;

        const bounds = panel.getBoundingClientRect();
        const isWithinDialog = event.clientX >= bounds.left
            && event.clientX <= bounds.right
            && event.clientY >= bounds.top
            && event.clientY <= bounds.bottom;

        if (!isWithinDialog) closeSearch({ restoreFocus: true });
    });
    navToggle?.addEventListener('click', () => {
        if (isOpen) closeSearch();
    });

    input.addEventListener('input', () => renderResults(input.value));
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeSearch({ restoreFocus: true });
            return;
        }

        if (!visibleResults.length) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveResult(activeIndex + 1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveResult(activeIndex - 1);
        } else if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault();
            window.location.assign(visibleResults[activeIndex].url);
        }
    });

    window.addEventListener('pageshow', () => {
        if (isOpen) closeSearch();
    });

    // Reveal the control only after every required element and listener is ready.
    search.classList.add('is-ready');
};
