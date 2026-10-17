/* Apply the site preference before styles paint; project demos own their own themes. */
(() => {
    const root = document.documentElement;
    const key = 'site-appearance';
    const system = matchMedia('(prefers-color-scheme: dark)');
    const valid = value => ['light', 'dark', 'system'].includes(value);
    let preference = 'system';
    try { const saved = localStorage.getItem(key); if (valid(saved)) preference = saved; } catch (_) {}
    const apply = () => {
        root.dataset.theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
        root.dataset.themePreference = preference;
        document.querySelectorAll('source[data-theme-source]').forEach(source => {
            source.media = root.dataset.theme === 'dark' ? 'all' : 'not all';
        });
        document.querySelectorAll('input[name="site-appearance"]').forEach(input => { input.checked = input.value === preference; });
    };
    apply();
    const observer = new MutationObserver(() => {
        document.querySelectorAll('source[data-theme-source]').forEach(source => {
            const media = root.dataset.theme === 'dark' ? 'all' : 'not all';
            if (source.media !== media) source.media = media;
        });
    });
    observer.observe(root, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', () => {
        observer.disconnect();
        apply();
        document.querySelectorAll('.theme-choice').forEach(control => {
            control.hidden = false;
            control.addEventListener('change', event => {
                if (!event.target.matches('input[name="site-appearance"]') || !valid(event.target.value)) return;
                preference = event.target.value;
                try { localStorage.setItem(key, preference); } catch (_) {}
                apply();
            });
        });
    }, { once: true });
    system.addEventListener('change', () => { if (preference === 'system') apply(); });
    window.addEventListener('storage', event => {
        if (event.key === key || event.key === null) { preference = valid(event.newValue) ? event.newValue : 'system'; apply(); }
    });
})();
