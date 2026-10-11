export function initializeProfilePreview() {
    const link = document.querySelector('.hero-profile-link');
    if (!link) return;
    const preview = document.createElement('a');
    preview.className = 'profile-preview';
    preview.id = 'hero-profile-preview';
    preview.href = link.href;
    preview.target = '_blank';
    preview.rel = 'noopener noreferrer';
    preview.setAttribute('aria-label', 'View Jan Michael’s LinkedIn profile (opens in a new tab)');
    preview.setAttribute('popover', 'manual');
    const image = document.createElement('img');
    image.src = link.dataset.previewImage;
    image.width = 1112;
    image.height = 784;
    image.alt = 'LinkedIn profile preview: Jan Michael Wallace II, He/Him. Leader and Entrepreneur, Product Development. Focal Signum, LLC. United States. 500+ connections.';
    const caption = document.createElement('span');
    caption.textContent = 'Opens in a new tab';
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('viewBox', '0 0 20 20');
    arrow.setAttribute('aria-hidden', 'true');
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowPath.setAttribute('d', 'M5 15 15 5M8 5h7v7');
    arrow.append(arrowPath);
    caption.append(arrow);
    const surface = document.createElement('div');
    surface.className = 'profile-preview-surface';
    surface.append(image, caption);
    preview.append(surface);
    // Keep the preview immediately after its trigger in keyboard tab order.
    link.after(preview);
    link.setAttribute('aria-details', preview.id);
    let opened = false;
    let holdTimer;
    let leaveTimer;
    let touchStart;
    let suppressClickUntil = 0;
    const position = () => {
        const anchor = link.getBoundingClientRect();
        const availableAbove = Math.max(0, anchor.top - 28);
        const availableBelow = Math.max(0, window.innerHeight - anchor.bottom - 28);
        const availableHeight = Math.max(availableAbove, availableBelow);
        // Keep the card clear of its trigger so hover cannot oscillate as
        // the preview covers the name and takes the pointer away from it.
        const previousWidth = Math.min(460, window.innerWidth - 32, Math.max(240, (availableHeight - 42) * 1112 / 784));
        // Reduce desktop by one third; retain a readable thumbnail on phones.
        const width = Math.min(window.innerWidth - 32, window.innerWidth < 768 ? 280 : previousWidth * 2 / 3);
        preview.style.width = `${width}px`;
        surface.style.maxHeight = `${Math.max(80, availableHeight - 12)}px`;
        let height = preview.getBoundingClientRect().height;
        const below = anchor.bottom + 12;
        // Prefer above the name; use below only when the card cannot fit above.
        const isBelow = height > availableAbove;
        if (isBelow) {
            surface.style.maxHeight = `${Math.max(0, availableBelow - 12)}px`;
            height = preview.getBoundingClientRect().height;
        }
        const top = isBelow ? below : anchor.top - height - 12;
        const left = Math.max(16, Math.min(anchor.left, window.innerWidth - width - 16));
        preview.style.left = `${left}px`;
        preview.style.top = `${top}px`;
        preview.dataset.side = isBelow ? 'below' : 'above';
        preview.style.setProperty('--preview-pointer-x', `${Math.max(20, Math.min(width - 20, anchor.left + anchor.width / 2 - left))}px`);
    };
    const close = () => {
        clearTimeout(holdTimer);
        clearTimeout(leaveTimer);
        if (opened && preview.hidePopover) preview.hidePopover();
        preview.classList.remove('is-visible');
        opened = false;
    };
    const open = () => {
        clearTimeout(leaveTimer);
        if (!opened) {
            preview.classList.add('is-visible');
            if (preview.showPopover) preview.showPopover();
            opened = true;
        }
        position();
    };
    image.addEventListener('load', () => { if (opened) position(); });
    const scheduleClose = () => {
        leaveTimer = setTimeout(() => {
            if (!preview.matches(':focus-visible') && !link.matches(':focus-visible')) close();
        }, 150);
    };
    link.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') open(); });
    link.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') scheduleClose(); });
    preview.addEventListener('pointerenter', () => clearTimeout(leaveTimer));
    preview.addEventListener('pointerleave', scheduleClose);
    link.addEventListener('focus', () => { if (link.matches(':focus-visible')) open(); });
    link.addEventListener('blur', event => {
        if (!preview.contains(event.relatedTarget)) close();
    });
    preview.addEventListener('blur', event => {
        if (event.relatedTarget !== link) close();
    });
    link.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'touch') return;
        touchStart = { x: event.clientX, y: event.clientY };
        holdTimer = setTimeout(() => {
            suppressClickUntil = Infinity;
            open();
        }, 450);
    });
    link.addEventListener('pointermove', event => {
        if (touchStart && Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y) > 10) {
            clearTimeout(holdTimer);
        }
    });
    const endTouch = () => {
        clearTimeout(holdTimer);
        touchStart = null;
        if (suppressClickUntil === Infinity) suppressClickUntil = performance.now() + 800;
    };
    link.addEventListener('pointerup', endTouch);
    link.addEventListener('pointercancel', () => { endTouch(); close(); });
    link.addEventListener('contextmenu', event => {
        if (event.pointerType === 'touch' || touchStart) {
            event.preventDefault();
            suppressClickUntil = performance.now() + 800;
            open();
        }
    });
    link.addEventListener('webkitmouseforcewillbegin', event => {
        event.preventDefault();
        open();
    }, { passive: false });
    link.addEventListener('click', event => {
        if (performance.now() < suppressClickUntil) event.preventDefault();
        else close();
    });
    document.addEventListener('pointerdown', event => {
        if (!link.contains(event.target) && !preview.contains(event.target)) close();
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);
}
