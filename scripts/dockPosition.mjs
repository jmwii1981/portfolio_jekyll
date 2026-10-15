/** A local, persistent vertical placement preference shared by every page. */
export function initializeDockPosition() {
    const header = document.querySelector('.header');
    const controls = header?.querySelector('.nav-controls');
    const island = controls?.querySelector('.dock-dots');
    if (!controls || !island) return;
    const mobile = matchMedia('(max-width: 47.999rem)');
    const key = 'portfolio-dock-position-v1';
    let position = .5;
    try {
        const saved = localStorage.getItem(key);
        if (saved !== null && Number.isFinite(Number(saved))) position = Math.max(0, Math.min(1, Number(saved)));
    } catch { /* Storage may be unavailable; dragging still works this visit. */ }
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'dock-drag-handle';
    handle.setAttribute('aria-label', 'Move navigation up or down');
    handle.title = 'Drag to move · Arrow keys to adjust · Home to reset';
    handle.innerHTML = '<svg viewBox="0 0 27 4" aria-hidden="true"><path d="M1 0h25M1 3h25"/></svg>';
    const surface = () => mobile.matches ? island : controls;
    const bounds = () => {
        const half = surface().getBoundingClientRect().height / 2;
        const min = Math.min(innerHeight / 2, half + 18);
        return { min, max: Math.max(min, innerHeight - half - 18) };
    };
    const render = () => {
        handle.style.marginTop = `${2 - (parseFloat(getComputedStyle(surface()).rowGap) || 0)}px`;
        const { min, max } = bounds();
        const y = Math.max(min, Math.min(max, position * innerHeight));
        if (mobile.matches) {
            header.style.removeProperty('top');
            island.style.top = `${y}px`;
        } else {
            island.style.removeProperty('top');
            header.style.top = `${y}px`;
        }
    };
    const save = () => { try { localStorage.setItem(key, String(position)); } catch {} };
    const move = y => {
        const { min, max } = bounds();
        position = Math.max(min, Math.min(max, y)) / innerHeight;
        render();
    };
    let drag = null;
    handle.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        const rect = surface().getBoundingClientRect();
        drag = { id: event.pointerId, offset: event.clientY - (rect.top + rect.height / 2) };
        handle.setPointerCapture(event.pointerId);
        handle.classList.add('is-dragging');
    });
    handle.addEventListener('pointermove', event => {
        if (!drag || event.pointerId !== drag.id) return;
        move(event.clientY - drag.offset);
    });
    const finish = event => {
        if (!drag || event.pointerId !== drag.id) return;
        drag = null;
        handle.classList.remove('is-dragging');
        if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
        save();
    };
    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);
    handle.addEventListener('lostpointercapture', finish);
    handle.addEventListener('click', event => event.preventDefault());
    handle.addEventListener('keydown', event => {
        if (!['ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') { position = .5; render(); }
        else {
            const rect = surface().getBoundingClientRect();
            move(rect.top + rect.height / 2 + (event.key === 'ArrowUp' ? -1 : 1) * (event.shiftKey ? 30 : 10));
        }
        save();
    });
    const arrange = () => {
        surface().append(handle);
        render();
    };
    mobile.addEventListener('change', arrange);
    window.addEventListener('resize', render, { passive: true });
    window.addEventListener('pageshow', render);
    const observer = new ResizeObserver(render);
    observer.observe(controls);
    observer.observe(island);
    arrange();
}
