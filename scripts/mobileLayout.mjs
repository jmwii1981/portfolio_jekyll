const mobile = matchMedia('(max-width: 47.999rem)');
const header = document.querySelector('.mobile-site-header');
const menu = header?.querySelector('details');

if (header && menu) {
    const summary = menu.querySelector('summary');
    const locked = new Map();
    let previousOverflow = null;
    let lockedOpen = false;
    const close = (restoreFocus = true) => {
        menu.open = false;
        syncMenu();
        if (restoreFocus && mobile.matches) summary.focus({ preventScroll: true });
    };
    const syncMenu = () => {
        const open = mobile.matches && menu.open;
        summary.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (open === lockedOpen) return;
        lockedOpen = open;
        if (open) {
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            for (const sibling of header.parentElement.children) {
                if (sibling === header) continue;
                locked.set(sibling, sibling.inert);
                sibling.inert = true;
            }
            menu.querySelector('nav a')?.focus({ preventScroll: true });
        } else {
            locked.forEach((inert, element) => { element.inert = inert; });
            locked.clear();
            if (previousOverflow !== null) document.body.style.overflow = previousOverflow;
            previousOverflow = null;
        }
    };
    menu.addEventListener('toggle', syncMenu);
    menu.addEventListener('click', event => {
        if (mobile.matches && event.target.closest('a')) close(false);
    });
    header.addEventListener('keydown', event => {
        if (!mobile.matches || !menu.open) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
        } else if (event.key === 'Tab') {
            const targets = [summary, ...menu.querySelectorAll('a[href], input:checked')]
                .filter(element => element.getClientRects().length && !element.closest('[hidden]'));
            const index = targets.indexOf(document.activeElement);
            if (event.shiftKey && index <= 0) {
                event.preventDefault();
                targets.at(-1)?.focus();
            } else if (!event.shiftKey && index === targets.length - 1) {
                event.preventDefault();
                summary.focus();
            }
        }
    });

    const portrait = document.querySelector('.contact-portrait-composition');
    const portraitParent = portrait?.parentElement;
    const portraitNext = portrait?.nextSibling;
    const contactMain = document.querySelector('main.contact');
    const syncLayout = () => {
        if (!mobile.matches) close(false);
        if (portrait) {
            if (mobile.matches) contactMain.append(portrait);
            else if (portrait.parentElement !== portraitParent) portraitParent.insertBefore(portrait, portraitNext);
        }
    };
    mobile.addEventListener('change', syncLayout);
    syncLayout();
    if (mobile.matches) syncMenu();
    document.querySelector('.mobile-chapter-index')?.addEventListener('click', event => {
        if (mobile.matches && event.target.closest('a')) event.currentTarget.open = false;
    });

    const theme = header.querySelector('.mobile-theme-choice');
    if (theme) {
        const syncTheme = () => {
            const preference = document.documentElement.dataset.themePreference || 'system';
            theme.querySelectorAll('input').forEach(input => { input.checked = input.value === preference; });
        };
        theme.hidden = false;
        syncTheme();
        theme.addEventListener('change', event => {
            if (!mobile.matches || !event.target.matches('input')) return;
            const original = document.querySelector(`input[name="site-appearance"][value="${event.target.value}"]`);
            if (!original) return;
            original.checked = true;
            original.dispatchEvent(new Event('change', { bubbles: true }));
        });
        new MutationObserver(syncTheme).observe(document.documentElement, {
            attributes: true, attributeFilter: ['data-theme-preference']
        });
    }
}
