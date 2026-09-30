// Use the browser's live local backdrop, never a rasterized copy of the page.
// Chromium supports SVG backdrop filters; other engines retain the CSS glass.
export const initializeLiquidGlassNavigation = () => {
    const header = document.querySelector('.header');
    const filter = document.getElementById('nav-local-refraction');
    const map = filter?.querySelector('feImage');
    if (!header || !filter || !map) return;
    [header.querySelector('.nav-controls'), header.querySelector('.nav-panel')].filter(Boolean).forEach((controls, surfaceIndex) => {
    const isMenu = controls.classList.contains('nav-panel');

    let activeFilter;
    let revision = 0;
    let lastBounds = '';
    let frame = 0;
    // Give each new tray size a fresh filter resource and backdrop reference.
    // Mutating the existing SVG alone can leave Chromium's compositor stale.
    const syncLensBounds = () => {
        const glass = controls.querySelector(isMenu ? '.menu-glass' : '.dock-glass');
        if (!glass) return;
        const surface = getComputedStyle(glass);
        const width = parseFloat(surface.width);
        const height = parseFloat(surface.height);
        if (!(width > 0 && height > 0)) return;
        const bounds = `${width.toFixed(2)}:${height.toFixed(2)}`;
        if (bounds === lastBounds) return;
        lastBounds = bounds;
        const nextFilter = filter.cloneNode(true);
        nextFilter.id = `nav-local-refraction-${surfaceIndex}-${++revision}`;
        // Lighten only the dock's interior tint by 20%; preserve the menu and bevel.
        if (!isMenu) {
            nextFilter.querySelector('[result="interior-tint"]').setAttribute('flood-opacity', '0.64');
        }
        // Keep the filter region and map in the same local pixel coordinate
        // system across vertical/horizontal layouts and fractional CSS sizes.
        nextFilter.setAttribute('filterUnits', 'userSpaceOnUse');
        nextFilter.setAttribute('primitiveUnits', 'userSpaceOnUse');
        for (const node of [nextFilter, ...nextFilter.children]) {
            node.setAttribute('x', '0');
            node.setAttribute('y', '0');
            node.setAttribute('width', String(width));
            node.setAttribute('height', String(height));
        }
        // A self-contained pixel map avoids nested external SVG image filters.
        // Neutral center; rounded perimeter bends the backdrop inward.
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(width);
        canvas.height = Math.ceil(height);
        const context = canvas.getContext('2d');
        if (!context) return;
        const pixels = context.createImageData(canvas.width, canvas.height);
        const interiorPixels = context.createImageData(canvas.width, canvas.height);
        const radius = Math.min(21, width / 2, height / 2);
        // Narrow the existing bevel by 1px: displacement 9→8, interior 6→5.
        // Both maps share the rounded contour, including the corners.
        const bevelWidth = isMenu ? 4 : 8;
        const interiorInset = isMenu ? 2.5 : 5;
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const px = x - width / 2;
                const py = y - height / 2;
                const qx = Math.abs(px) - (width / 2 - radius);
                const qy = Math.abs(py) - (height / 2 - radius);
                const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
                const length = Math.hypot(ox, oy);
                const distance = length + Math.min(Math.max(qx, qy), 0) - radius;
                const strength = Math.pow(Math.max(0, 1 + distance / bevelWidth), 1.5);
                const nx = length ? Math.sign(px) * ox / length : qx > qy ? Math.sign(px) : 0;
                const ny = length ? Math.sign(py) * oy / length : qy >= qx ? Math.sign(py) : 0;
                const i = (y * canvas.width + x) * 4;
                pixels.data[i] = 128 - nx * strength * 110;
                pixels.data[i + 1] = 128 - ny * strength * 110;
                pixels.data[i + 2] = 128;
                pixels.data[i + 3] = 255;
                interiorPixels.data[i] = 255;
                interiorPixels.data[i + 1] = 255;
                interiorPixels.data[i + 2] = 255;
                interiorPixels.data[i + 3] = Math.min(1, Math.max(0, -distance - interiorInset + .5)) * 255;
            }
        }
        context.putImageData(pixels, 0, 0);
        nextFilter.querySelector('feImage').setAttribute('href', canvas.toDataURL());
        context.putImageData(interiorPixels, 0, 0);
        nextFilter.querySelector('[data-interior-mask]').setAttribute('href', canvas.toDataURL());
        filter.parentNode.append(nextFilter);
        const nextGlass = glass.cloneNode(false);
        nextGlass.style.setProperty('--dock-refraction-filter', `url("#${nextFilter.id}")`);
        glass.replaceWith(nextGlass);
        const previousFilter = activeFilter;
        activeFilter = nextFilter;
        requestAnimationFrame(() => previousFilter?.remove());
    };
    const queueLensBounds = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(syncLensBounds);
    };
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const chromium = /chrome|chromium|edg\//i.test(navigator.userAgent);
    const sync = () => {
        header?.classList.toggle('has-orb-lenses',
            chromium && !reducedMotion.matches
            && CSS.supports('backdrop-filter', 'url("#nav-local-refraction")'));
        syncLensBounds();
    };
    const resizeObserver = new ResizeObserver(queueLensBounds);
    resizeObserver.observe(controls);
    const stateObserver = new MutationObserver(queueLensBounds);
    stateObserver.observe(controls, { attributes: true, attributeFilter: ['class'] });
    controls.addEventListener('transitionend', queueLensBounds);
    reducedMotion.addEventListener('change', sync);
    sync();
    });
};
