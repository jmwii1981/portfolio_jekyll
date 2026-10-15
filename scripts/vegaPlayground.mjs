// Small, independent enhancement: native fields remain usable if this module fails.
const playground = document.querySelector('[data-vega-playground]');
if (playground) {
    const button = playground.querySelector('[data-vega-try]');
    const fallback = playground.querySelector('[data-vega-button-fallback]');
    const label = playground.querySelector('#vega-label-input');
    const range = playground.querySelector('#vega-range');
    const value = playground.querySelector('[data-vega-value]');
    const feedback = playground.querySelector('[data-vega-feedback]');
    const reset = playground.querySelector('[data-vega-reset]');
    const sync = () => {
        button.textContent = label.value.trim() || 'Try me';
        value.value = range.value;
        range.style.setProperty('--vega-range-value', `${range.value}%`);
    };
    button.addEventListener('click', () => {
        feedback.textContent = feedback.textContent === 'Button activated.' ? 'Activated again.' : 'Button activated.';
    });
    label.addEventListener('input', sync);
    range.addEventListener('input', sync);
    reset.addEventListener('click', () => {
        label.value = label.defaultValue;
        range.value = range.defaultValue;
        playground.querySelector('[role="switch"]').checked = false;
        sync();
        feedback.textContent = 'A clear starting point.';
    });
    sync();
    fallback.hidden = true;
    button.hidden = false;
    value.hidden = false;
    reset.hidden = false;
    playground.classList.add('is-ready');
}
