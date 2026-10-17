// Each enhancement preserves its authored native-control fallback.
const wall = document.querySelector('[data-vega-playground]');
if (wall) {
    const find = (selector) => wall.querySelector(selector);
    const all = (selector) => [...wall.querySelectorAll(selector)];
    const button = find('[data-vega-try]');
    const label = find('#vega-label-input');
    const range = find('#vega-range');
    const receipt = find('[data-vega-receipts]');
    const currency = find('#vega-currency');
    const filter = find('[data-vega-filter]');
    const steps = all('[data-vega-step]');
    const stepNames = ['Customer', 'Items', 'Review'];
    const write = (element, text) => { if (element.textContent !== text) element.textContent = text; };
    let step = 1;
    const sync = () => {
        button.textContent = label.value.trim() || 'Try me';
        find('[data-vega-value]').value = range.value;
        range.style.setProperty('--vega-range-value', `${range.value}%`);
        find('[data-vega-density]').style.setProperty('--sample-gap', `${4 + Number(range.value) / 5}px`);
        find('[data-vega-receipt-preview]').textContent = receipt.checked ? 'Email receipts are on' : 'Receipts are off';
        const recurring = find('[name="vega-cadence"]:checked').value === 'Monthly';
        find('[data-vega-cadence-note]').textContent = recurring ? 'A repeating invoice, each month.' : 'One invoice, one due date.';
        const formatter = new Intl.NumberFormat('en', {style: 'currency', currency: currency.value});
        all('[data-vega-amount]').forEach((cell) => { cell.textContent = formatter.format(Number(cell.dataset.vegaAmount)); });
        all('[data-vega-column]').forEach((choice) => {
            all(`[data-vega-col="${choice.dataset.vegaColumn}"]`).forEach((cell) => { cell.hidden = !choice.checked; });
        });
        let count = 0;
        all('[data-vega-row]').forEach((row) => {
            row.hidden = filter.value !== 'all' && row.dataset.status !== filter.value;
            if (!row.hidden) count += 1;
        });
        write(find('[data-vega-table-note]'), `${count} sample invoice${count === 1 ? '' : 's'} shown · ${currency.value}.`);
        steps.forEach((item) => {
            if (Number(item.dataset.vegaStep) === step) item.setAttribute('aria-current', 'step');
            else item.removeAttribute('aria-current');
            item.classList.toggle('is-complete', Number(item.dataset.vegaStep) < step);
        });
        find('[data-vega-step-back]').disabled = step === 1;
        find('[data-vega-step-next]').disabled = step === steps.length;
        write(find('[data-vega-step-note]'), `Step ${step} of ${steps.length} · ${stepNames[step - 1]}`);
    };
    button.addEventListener('click', () => {
        const feedback = find('[data-vega-feedback]');
        feedback.textContent = feedback.textContent === 'Button activated.' ? 'Activated again.' : 'Button activated.';
    });
    wall.addEventListener('input', sync);
    wall.addEventListener('change', sync);
    find('[data-vega-step-back]').addEventListener('click', () => { step = Math.max(1, step - 1); sync(); });
    find('[data-vega-step-next]').addEventListener('click', () => { step = Math.min(steps.length, step + 1); sync(); });
    sync();
    find('[data-vega-button-fallback]').hidden = true;
    button.hidden = false;
    ['[data-vega-value]', '[data-vega-step-controls]', '[data-vega-filter-control]'].forEach((selector) => { find(selector).hidden = false; });
    all('[data-vega-enhanced], [data-vega-receipt-preview]').forEach((element) => { element.hidden = false; });
    wall.classList.add('is-ready');
}

// A theme switch belongs to one visual; toggling never rebuilds its controls.
document.querySelectorAll('[data-vega-visual]').forEach((visual) => {
    const toggle = visual.querySelector('[data-vega-theme-switch]');
    if (!toggle) return;
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
        const dark = visual.dataset.vegaTheme !== 'dark';
        visual.dataset.vegaTheme = dark ? 'dark' : 'light';
        toggle.setAttribute('aria-checked', String(dark));
        toggle.textContent = dark ? 'Dark mode: On' : 'Dark mode: Off';
    });
});
