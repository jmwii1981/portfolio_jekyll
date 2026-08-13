const DESKTOP_QUERY = '(min-width: 26rem)';
const FINE_POINTER_QUERY = '(pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const LIQUID_GLASS_OPACITY_PROPERTY = '--liquid-glass-opacity';

const LIQUID_GLASS_OPTIONS = Object.freeze({
    snapshot: 'body',
    resolution: 0.75,
    refraction: 0,
    aberration: 0,
    bevelDepth: 0.052,
    bevelWidth: 0.211,
    frost: 4,
    shadow: false,
    specular: true,
    edgeOnly: true,
    reveal: 'none',
    tilt: false,
    magnify: 1
});

const isSafari = () => {
    const userAgent = navigator.userAgent;

    return /safari/i.test(userAgent)
        && !/(chrome|chromium|crios|android|fxios|edgios)/i.test(userAgent);
};

const hasWebGL = () => {
    try {
        const canvas = document.createElement('canvas');

        return Boolean(
            canvas.getContext('webgl2')
            || canvas.getContext('webgl')
            || canvas.getContext('experimental-webgl')
        );
    } catch (_error) {
        return false;
    }
};

const canEnhanceNavigation = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    return window.matchMedia(DESKTOP_QUERY).matches
        && window.matchMedia(FINE_POINTER_QUERY).matches
        && !window.matchMedia(REDUCED_MOTION_QUERY).matches
        && !connection?.saveData
        && !isSafari()
        && hasWebGL();
};

let libraryPromise;

const loadLiquidGL = async () => {
    if (!libraryPromise) {
        const moduleVersion = new URL(import.meta.url).search;
        libraryPromise = import(`../third-party/liquidGL.js${moduleVersion}`);
    }

    await libraryPromise;

    if (typeof window.liquidGL !== 'function') {
        throw new TypeError('liquidGL did not expose its browser initializer.');
    }
};

const initializeLensWhenActive = ({ container, targetSelector, activeClass, label }) => {
    const target = container?.querySelector(targetSelector);

    if (!container || !target) return;

    let initialized = false;
    let initializing = false;

    const observer = new MutationObserver(() => {
        void initialize();
    });

    const showCssFallback = (error) => {
        initialized = true;
        initializing = false;
        observer.disconnect();
        container.classList.remove('is-liquid-glass-loading', 'has-liquid-glass');
        container.classList.add('is-liquid-glass-unavailable');
        console.warn(`Unable to initialize liquid glass for the ${label}; using the CSS fallback:`, error);
    };

    const initialize = async () => {
        const isActive = !activeClass || container.classList.contains(activeClass);

        if (initialized || initializing || !isActive) return;

        initializing = true;
        container.classList.add('is-liquid-glass-loading');

        try {
            if (document.fonts?.ready) await document.fonts.ready;
            await loadLiquidGL();

            const lens = window.liquidGL({
                ...LIQUID_GLASS_OPTIONS,
                target: targetSelector,
                on: {
                    init: (instance) => {
                        const opacity = window.getComputedStyle(target)
                            .getPropertyValue(LIQUID_GLASS_OPACITY_PROPERTY)
                            .trim();

                        instance.renderer.canvas.style.opacity = opacity || '0.65';
                        initialized = true;
                        initializing = false;
                        observer.disconnect();
                        container.classList.remove('is-liquid-glass-loading');
                        container.classList.add('has-liquid-glass');
                    }
                }
            });

            if (!lens) {
                throw new Error(`The ${label} liquid-glass target could not be created.`);
            }
        } catch (error) {
            showCssFallback(error);
        }
    };

    if (activeClass) {
        observer.observe(container, { attributes: true, attributeFilter: ['class'] });
    }
    void initialize();
};

export const initializeLiquidGlassNavigation = () => {
    if (!canEnhanceNavigation()) return;

    initializeLensWhenActive({
        container: document.querySelector('.header'),
        targetSelector: '.site-liquid-glass-lens--header',
        label: 'site header'
    });

    initializeLensWhenActive({
        container: document.querySelector('.work-project-index'),
        targetSelector: '.site-liquid-glass-lens--work',
        activeClass: 'is-stuck',
        label: 'Work project index'
    });
};
