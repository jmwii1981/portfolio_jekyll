/** Scroll-scrubbed entrances and exits, measured in stable document coordinates. */
export function scrollExit(scroll, bottom, viewport, interactive = false) {
    // Controls stay fully visible until they have actually left the viewport.
    const distance = Math.min(120, viewport * .14);
    const start = interactive ? bottom : Math.max(0, bottom - distance);
    const progress = Math.max(0, Math.min(1, (scroll - start) / distance));
    return progress * progress * (3 - 2 * progress);
}

export function initializeContentScroll() {
    const selector = [
        'main [data-reveal]', '.page-hero-title', '.page-hero .page-intro-eyebrow',
        '.page-hero-lead', '.hero .hero-intro', '.hero .h3',
        '.hero .about-me-statement', '.hero .button-group', '.hero .image-wrapper',
        '.contact-avatar img', '.contact-form', '.contact-direct-pill',
        '.vitae-intro-artwork', '.vitae-intro-title', '.vitae-intro-statement',
        '.vitae-intro-eyebrow'
    ].join(',');
    const candidates = [...document.querySelectorAll(selector)].filter(element =>
        !element.closest('.vitae-collection, .vitae-contact'));
    // Do not multiply opacity or displacement through nested reveal wrappers.
    const targets = candidates.filter(element => !candidates.some(parent =>
        parent !== element && parent.contains(element)));
    candidates.forEach(element => element.classList.add('scroll-entrance-owned'));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let measurements = [];
    let frame = 0;
    const clamp = value => Math.max(0, Math.min(1, value));
    const render = () => {
        frame = 0;
        const scroll = window.scrollY;
        measurements.forEach(({element, start, distance, x, bottom, interactive}) => {
            const bypass = reduced.matches || element.matches(':focus-within');
            const progress = bypass
                ? 1 : clamp((scroll - start) / distance);
            const eased = progress * progress * (3 - 2 * progress);
            const exit = bypass ? 0 : scrollExit(scroll, bottom, window.innerHeight, interactive);
            element.style.setProperty('--entrance-opacity', eased * (1 - exit));
            element.style.setProperty('--entrance-x', `${x * (1 - eased - exit * .5)}px`);
            element.style.setProperty('--entrance-y', `${(x ? 0 : 16) * (1 - eased) - 10 * exit}px`);
        });
    };
    const measure = () => {
        // Remove only our translation before reading positions; preserve artwork transforms.
        targets.forEach(element => {
            element.style.setProperty('--entrance-x', '0px');
            element.style.setProperty('--entrance-y', '0px');
        });
        const viewport = window.innerHeight;
        measurements = targets.map(element => {
            const top = element.getBoundingClientRect().top + window.scrollY;
            const interactive = element.matches('a, button, input, select, textarea')
                ? element : element.querySelector('a, button, input, select, textarea');
            const distance = Math.min(180, viewport * .22);
            // Settle before controls cross the viewport edge. Initial-viewport content
            // is already settled, including when returning via browser history.
            const deadline = interactive
                ? interactive.getBoundingClientRect().top + window.scrollY - viewport - 16
                : Infinity;
            const end = top < viewport ? 0 : Math.min(top - viewport * .78, deadline);
            const direction = element.dataset.reveal;
            const x = direction === 'left' || element.matches('.main.contact .page-hero-title')
                ? -20 : direction === 'right' || element.matches('.contact-avatar img') ? 20 : 0;
            return {element, start: end - distance, distance, x,
                bottom: element.getBoundingClientRect().bottom + window.scrollY,
                interactive: Boolean(interactive)};
        });
        render();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', measure, {passive: true});
    window.addEventListener('load', measure, {once: true});
    window.addEventListener('pageshow', measure);
    document.addEventListener('focusin', render);
    document.addEventListener('focusout', schedule);
    reduced.addEventListener('change', measure);
    document.fonts?.ready.then(measure);
    if (document.querySelector('main')) new ResizeObserver(measure).observe(document.querySelector('main'));
    measure();
}
