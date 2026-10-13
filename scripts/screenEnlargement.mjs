// Inspect existing screens at readable size without replacing the device composition.
export function initializeScreenEnlargement() {
    const small = matchMedia('(max-width: 63.999rem)');
    let dialog, restore;
    const close = () => { restore?.(); restore = null; };
    const open = (title, source, device) => {
        if (!small.matches) return;
        if (!dialog) {
            dialog = document.createElement('dialog');
            dialog.className = 'screen-viewer';
            dialog.setAttribute('aria-labelledby', 'screen-viewer-title');
            dialog.innerHTML = '<div class="screen-viewer-bar"><h2 id="screen-viewer-title"></h2><button class="screen-enlarge" type="button">Close ×</button></div><p>Scroll across or down to inspect the screen.</p><div class="screen-viewer-pan" tabindex="0" role="region" aria-label="Enlarged screen"></div>';
            document.body.append(dialog);
            dialog.querySelector('button').addEventListener('click', () => dialog.close());
            dialog.addEventListener('close', close);
            dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
        }
        const pan = dialog.querySelector('.screen-viewer-pan');
        pan.replaceChildren();
        dialog.querySelector('h2').textContent = title;
        if (device) {
            const marker = document.createComment('Screen original position');
            const style = source.getAttribute('style');
            source.before(marker);
            pan.append(source);
            const width = { laptop: 1240, tablet: 760, phone: 390, landscape: 780 }[device];
            source.style.cssText = `position:relative;inset:auto;width:${width}px;height:${device === 'phone' ? 780 : 800}px;display:block;`;
            restore = () => {
                marker.replaceWith(source);
                if (style === null) source.removeAttribute('style'); else source.setAttribute('style', style);
            };
        } else {
            const img = document.createElement('img');
            img.src = source.currentSrc || source.src;
            img.alt = source.alt;
            pan.append(img);
        }
        dialog.showModal();
        pan.scrollTo(0, 0);
    };
    const add = (parent, label, title, source, device) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'screen-enlarge';
        button.textContent = label;
        button.setAttribute('aria-label', `Enlarge ${title}`);
        button.addEventListener('click', () => open(title, source, device));
        parent.append(button);
    };
    document.querySelectorAll('.project-screen').forEach(figure => {
        const img = figure.querySelector('.project-screen-image img');
        if (img) add(figure.querySelector('figcaption'), 'Enlarge screen', img.alt, img);
    });
    document.querySelectorAll('.vitae-device-lineup').forEach(figure => {
        const screens = figure.querySelectorAll('[data-vega-device], [data-ledger-device]');
        if (!screens.length) return;
        const tools = document.createElement('div'); tools.className = 'screen-tools';
        screens.forEach(source => {
            const device = source.dataset.vegaDevice || source.dataset.ledgerDevice;
            const name = source.closest('[aria-label]')?.getAttribute('aria-label') || device;
            add(tools, `Enlarge ${device}`, name, source, device);
        });
        figure.after(tools);
    });
    small.addEventListener('change', () => { if (!small.matches && dialog?.open) dialog.close(); });
}
