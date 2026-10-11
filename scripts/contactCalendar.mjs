// Progressive enhancement: native date pickers remain available without JavaScript.
const fields = [...document.querySelectorAll('.contact-timeline input[type="date"]')];
const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const parse = value => new Date(`${value}T12:00:00`);
const today = iso(new Date());
const arrow = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const dialog = document.createElement('dialog');
dialog.className = 'contact-calendar';
dialog.setAttribute('aria-labelledby', 'contact-calendar-title');
document.body.append(dialog);
let active, month, focusDate;
const minimum = () => active?.id === 'contact-ready' ? document.querySelector('#contact-begin').value : '';
const allowed = date => !minimum() || date >= minimum();

function draw() {
    const year = month.getFullYear(), m = month.getMonth();
    const count = new Date(year,m+1,0).getDate();
    const offset = new Date(year,m,1).getDay();
    if (parse(focusDate).getMonth() !== m || parse(focusDate).getFullYear() !== year || !allowed(focusDate)) {
        const firstAllowed = Array.from({length:count},(_,i)=>iso(new Date(year,m,i+1))).find(allowed);
        if (firstAllowed) focusDate = firstAllowed;
    }
    const name = month.toLocaleDateString('en-US',{month:'long',year:'numeric'});
    const firstYear = Math.min(new Date().getFullYear()-1, year);
    const lastYear = Math.max(new Date().getFullYear()+20, year);
    dialog.innerHTML = `<div class="contact-calendar-top"><span id="contact-calendar-title">${active.id === 'contact-begin' ? 'Planned kick off' : 'Target launch'}</span><button type="button" data-close aria-label="Close calendar">Close <span aria-hidden="true">×</span></button></div>
      <div class="contact-calendar-nav"><button type="button" data-month="-1" aria-label="Previous month">${arrow}</button><div class="contact-calendar-jump"><select data-jump="month" aria-label="Month">${Array.from({length:12},(_,i)=>`<option value="${i}" ${i===m?'selected':''}>${new Date(2026,i,1).toLocaleDateString('en-US',{month:'long'})}</option>`).join('')}</select><select data-jump="year" aria-label="Year">${Array.from({length:lastYear-firstYear+1},(_,i)=>`<option ${firstYear+i===year?'selected':''}>${firstYear+i}</option>`).join('')}</select></div><button type="button" data-month="1" aria-label="Next month">${arrow}</button></div>
      <div class="contact-calendar-week" aria-hidden="true">${['S','M','T','W','T','F','S'].map(d=>`<span>${d}</span>`).join('')}</div>
      <div class="contact-calendar-grid" role="group" aria-label="${name}">${Array.from({length:count},(_,i)=>{
        const date = new Date(year,m,i+1), value=iso(date), selected=value===active.value;
        return `<button type="button" data-date="${value}" ${i===0?`style="grid-column-start:${offset+1}"`:''} ${allowed(value)?'':'disabled'} tabindex="${value===focusDate?'0':'-1'}" aria-label="${date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}" aria-pressed="${selected}" ${value===today?'aria-current="date"':''}>${i+1}</button>`;
      }).join('')}</div><div class="contact-calendar-bottom"><button type="button" data-today ${allowed(today)?'':'disabled'}>Today</button><button type="button" data-clear>Clear date</button></div>`;
}
function position() {
    if (!active || !dialog.open) return;
    const r=active.getBoundingClientRect(), width=dialog.offsetWidth, height=dialog.offsetHeight;
    const below=innerHeight-r.bottom-12;
    const above=below<height && r.top>=height+12;
    const left=Math.max(12,Math.min(r.left,innerWidth-width-12));
    dialog.style.left = `${left}px`;
    dialog.style.top = `${window.scrollY + (above?r.top-height-12:r.bottom+12)}px`;
    dialog.dataset.side=above?'above':'below';
    dialog.style.setProperty('--calendar-pointer-x',`${Math.max(24,Math.min(width-24,r.left+r.width/2-left))}px`);
}
function close() { dialog.close(); active?.focus(); }
function choose(value) {
    active.value=value;
    active.dispatchEvent(new Event('input',{bubbles:true}));
    active.dispatchEvent(new Event('change',{bubbles:true}));
    close();
}
function focusDay() { dialog.querySelector(`[data-date="${focusDate}"]`)?.focus(); }
function open(field) {
    active=field;
    focusDate=field.value || minimum() || today;
    if (!allowed(focusDate)) focusDate=minimum();
    month=parse(focusDate); month.setDate(1);
    draw(); dialog.show(); position(); focusDay();
}
for (const field of fields) {
    field.readOnly=true;
    field.classList.add('has-custom-calendar');
    field.setAttribute('aria-haspopup','dialog');
    field.addEventListener('click',()=>open(field));
    field.addEventListener('keydown',event=>{
        if (['Enter',' ','ArrowDown'].includes(event.key)) { event.preventDefault(); open(field); }
    });
}
dialog.addEventListener('click',event=>{
    if (event.target===dialog) {
        const r=dialog.getBoundingClientRect();
        if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) close();
        return;
    }
    const button=event.target.closest('button'); if(!button || button.disabled)return;
    if(button.hasAttribute('data-close'))close();
    else if(button.dataset.date)choose(button.dataset.date);
    else if(button.hasAttribute('data-clear'))choose('');
    else if(button.hasAttribute('data-today'))choose(today);
    else if(button.dataset.month){
        const direction=button.dataset.month;
        month.setMonth(month.getMonth()+Number(direction));
        focusDate=iso(month); draw(); position();
        dialog.querySelector(`[data-month="${direction}"]`).focus();
    }
});
dialog.addEventListener('change', event=>{
    const control = event.target;
    if (!control.matches('[data-jump]')) return;
    const kind = control.dataset.jump;
    month.setDate(1);
    if (kind === 'month') month.setMonth(Number(control.value));
    else month.setFullYear(Number(control.value));
    focusDate = iso(month);
    draw(); position();
    dialog.querySelector(`[data-jump="${kind}"]`).focus();
});
dialog.addEventListener('keydown',event=>{
    if(event.key==='Escape') { event.preventDefault(); close(); return; }
    if(!event.target.matches('[data-date]'))return;
    const date=parse(event.target.dataset.date);
    const shifts={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
    if(event.key in shifts)date.setDate(date.getDate()+shifts[event.key]);
    else if(event.key==='Home')date.setDate(date.getDate()-date.getDay());
    else if(event.key==='End')date.setDate(date.getDate()+6-date.getDay());
    else if(event.key==='PageUp'||event.key==='PageDown'){
        const day=date.getDate(); date.setDate(1); date.setMonth(date.getMonth()+(event.key==='PageUp'?-1:1));
        date.setDate(Math.min(day,new Date(date.getFullYear(),date.getMonth()+1,0).getDate()));
    } else return;
    event.preventDefault(); focusDate=iso(date);
    if(!allowed(focusDate))focusDate=minimum();
    month=parse(focusDate);month.setDate(1);draw();focusDay();
});
dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
window.addEventListener('resize',position);
document.addEventListener('pointerdown',event=>{
    if(dialog.open && !dialog.contains(event.target) && !fields.includes(event.target)) dialog.close();
});

// Preserve the native select for validation/submission and progressive fallback.
const budget = document.querySelector('#contact-budget');
if (budget) {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'contact-input contact-select contact-budget-trigger';
    trigger.setAttribute('aria-label', 'Budget');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-describedby', 'contact-budget-error');
    budget.after(trigger);
    budget.classList.add('contact-budget-native');
    budget.tabIndex = -1;
    budget.setAttribute('aria-hidden', 'true');
    const popup = document.createElement('div');
    popup.className = 'contact-calendar contact-budget-menu';
    popup.id = 'contact-budget-options';
    popup.setAttribute('role', 'listbox');
    popup.setAttribute('aria-label', 'Budget');
    popup.hidden = true;
    trigger.setAttribute('aria-controls', popup.id);
    document.body.append(popup);
    const options = [...budget.options].filter(option => !option.disabled);
    options.forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option.text;
        button.setAttribute('role', 'option');
        button.tabIndex = -1;
        button.addEventListener('click', () => {
            budget.value = option.value;
            budget.dispatchEvent(new Event('input', {bubbles:true}));
            budget.dispatchEvent(new Event('change', {bubbles:true}));
            sync(); closeBudget();
        });
        popup.append(button);
    });
    const buttons = [...popup.children];
    function sync() {
        trigger.textContent = budget.selectedOptions[0].text;
        trigger.dataset.empty = String(!budget.value);
        trigger.setAttribute('aria-invalid', budget.getAttribute('aria-invalid') || 'false');
        buttons.forEach((button, i) => button.setAttribute('aria-selected', String(options[i].value === budget.value)));
    }
    function closeBudget(returnFocus = true) {
        popup.hidden = true; trigger.setAttribute('aria-expanded', 'false');
        if (returnFocus) trigger.focus();
    }
    function positionBudget() {
        const r = trigger.getBoundingClientRect(), width = popup.offsetWidth, height = popup.offsetHeight;
        const left = Math.max(12, Math.min(r.left, innerWidth-width-12));
        const above = innerHeight-r.bottom-12 < height && r.top >= height+12;
        popup.style.left = `${left}px`;
        popup.style.top = `${scrollY+(above?r.top-height-12:r.bottom+12)}px`;
        popup.dataset.side = above?'above':'below';
        popup.style.setProperty('--calendar-pointer-x', `${Math.max(24,Math.min(width-24,r.left+r.width/2-left))}px`);
    }
    function openBudget() {
        dialog.close(); sync(); popup.hidden = false;
        trigger.setAttribute('aria-expanded', 'true'); positionBudget();
        (buttons.find(button=>button.getAttribute('aria-selected')==='true') || buttons[0]).focus();
    }
    trigger.addEventListener('click', ()=>popup.hidden?openBudget():closeBudget());
    trigger.addEventListener('keydown', event=>{
        if (['ArrowDown','ArrowUp'].includes(event.key)) { event.preventDefault(); openBudget(); }
    });
    popup.addEventListener('keydown', event=>{
        const i = buttons.indexOf(document.activeElement);
        if (event.key === 'Escape') { event.preventDefault(); closeBudget(); }
        else if (event.key === 'Tab') closeBudget();
        else if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
            event.preventDefault();
            const next = event.key==='Home'?0:event.key==='End'?buttons.length-1:Math.max(0,Math.min(buttons.length-1,i+(event.key==='ArrowDown'?1:-1)));
            buttons[next].focus();
        }
    });
    document.addEventListener('pointerdown', event=>{
        if (!popup.hidden && !popup.contains(event.target) && !trigger.contains(event.target)) closeBudget(false);
    });
    budget.addEventListener('focus', ()=>trigger.focus());
    budget.addEventListener('change', sync);
    budget.form.addEventListener('reset', ()=>requestAnimationFrame(sync));
    new MutationObserver(sync).observe(budget,{attributes:true,attributeFilter:['aria-invalid']});
    window.addEventListener('resize', ()=>{if(!popup.hidden) positionBudget();});
    sync();
}
