// Use the browser's live local backdrop, never a rasterized copy of the page.
// Chromium supports SVG backdrop filters; other engines retain the CSS glass.
export const initializeLiquidGlassNavigation = () => {
    const header = document.querySelector('.header');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const chromium = /chrome|chromium|edg\//i.test(navigator.userAgent);
    const sync = () => {
        header?.classList.toggle('has-orb-lenses',
            chromium && !reducedMotion.matches
            && CSS.supports('backdrop-filter', 'url("#nav-local-refraction")'));
    };
    reducedMotion.addEventListener('change', sync);
    sync();
};
