// Figma 40000010:290: reconstructed Vega dashboard.
// All interactions are illustrative and local to this page. No API or storage.
const base = new URL('../', import.meta.url);
const url = path => new URL(path, base).href;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(n);
const png = new Set(['payment','estimate','payments','invoices','schedule','navpayments','partners','jobs','calls','services','products','events','memberships','visits','leads','marketing']);
const icon = name => `<img class="icon" src="${url(`images/ui/vega/figma/${name}.${png.has(name)?'png':'svg'}`)}" alt="">`;
const btn = (action, label, cls='link') => `<button type="button" class="${cls}" data-action="${action}">${label}</button>`;
const arrow = () => icon('right');
const nav = [['Dashboard','dashboard'],['Payments and Estimates','navpayments'],['Customers','customers'],['Partners','partners'],['Jobs','jobs'],['Service Calls','calls'],['Services','services'],['Products','products'],['Events','events'],['Memberships','memberships'],['Visits','visits'],['Leads and Estimates','leads'],['Marketing','marketing']];
const actions = [['payment','Take a payment'],['estimate','Estimate a job'],['payments','View and manage payments'],['invoices','View and manage invoices'],['schedule','Schedule appointment']];
const products = ['Watering Can','Gardening Gloves','Wheelbarrow','Shovel','Rake'];
const services = ['Lawn care','Cleaning Services','Landscaping','Pruning and Planting','Power Washing'];
const state = {payments:[{name:'Sample customer 01',amount:318.75,status:'Failed'},{name:'James Wilson',amount:2258,status:'Paid'},{name:'Morgan Taylor',amount:480,status:'Paid'}],tasks:[],appointments:[]};
const views = new Set();
const cursor = matchMedia('(any-hover: hover) and (any-pointer: fine)');
const widths = {laptop:1280,tablet:800,phone:400,landscape:850};
const heights = {laptop:880,tablet:1226,phone:828,landscape:435};

class VegaDemo {
  constructor(host, device) {
    this.host=host; this.device=device; this.page='Dashboard';
    this.embedded=host.parentElement.hasAttribute('data-vega-embedded');
    this.period='7'; this.branch='Hillview Branch'; this.hiddenActions=new Set();
    this.root=host.attachShadow({mode:'open'});
    this.root.innerHTML=`<link rel="stylesheet" href="${url('styles/vega-demo.css')}"><div class="stage ${device}"></div>`;
    this.stage=this.root.querySelector('.stage');
    this.root.addEventListener('click',e=>this.click(e));
    this.root.addEventListener('submit',e=>this.submit(e));
    this.root.addEventListener('change',e=>this.change(e));
    this.root.addEventListener('keydown',e=>this.keydown(e));
    this.observer=new ResizeObserver(()=>this.fit()); this.observer.observe(host);
    views.add(this); this.render(); this.fit(); this.access();
  }
  fit() {
    if(this.embedded) {
      const width=this.host.clientWidth;
      this.stage.className='stage embedded '+(width<760?'phone':width<1050?'tablet':'laptop');
      this.stage.style.width='100%';
      this.stage.style.height='100%';
      this.stage.style.transform='none';
      return;
    }
    const w=widths[this.device], scale=this.host.clientWidth/w;
    this.stage.style.width=`${w}px`;
    this.stage.style.height=`${this.host.clientHeight / Math.max(scale,.001)}px`;
    this.stage.style.transform=`scale(${scale})`;
  }
  access() { this.stage.inert=!this.embedded&&!cursor.matches; this.host.closest('.project-screen-inset')?.classList.toggle('is-interactive',cursor.matches); }
  render() {
    const previous=this.root.activeElement?.dataset;
    const scroll=this.root.querySelector('.app')?.scrollTop||0;
    this.stage.innerHTML=`<div class="app" aria-label="Vega interactive sample dashboard">
      <header class="app-header"><strong>Jack Miller &amp; Sons Co., LLC</strong><div class="header-tools">
        ${btn('branch',`${icon('branch')}<span>${this.branch}</span><span class="chevron">⌄</span>`,'branch')}
        ${btn('help',`${icon('help')}<span class="sr">About this demo</span>`,'round desktop-tool')}
        ${btn('notifications',`${icon('bell')}<span class="sr">Notifications</span>`,'round desktop-tool')}
        ${btn('menu',`${icon('apps')}<span class="sr">Application menu</span>`,'round')}
        ${btn('profile','<span class="avatar">MS</span><span class="chevron">⌄</span><span class="sr">Profile</span>','profile desktop-tool')}
      </div></header>
      <div class="workspace"><aside><nav class="card navigation" aria-label="Business navigation"><h2>My business</h2>${this.navigation()}</nav>${this.tasks()}</aside>
      <main>${this.page==='Dashboard'?this.dashboard():this.listPage()}</main></div>
      <footer><p class="demo-note">Portfolio reconstruction · Sample data · No real transactions</p></footer>
      </div><div class="modal-layer" hidden></div><div class="toast" role="status" aria-live="polite"></div>`;
    // An embedded application must not introduce a second document main or h1.
    if(this.embedded) {
      const main=this.root.querySelector('main');
      if(main){main.setAttribute('role','region');main.setAttribute('aria-label','Dashboard workspace');}
      this.root.querySelectorAll('h1').forEach(heading=>{
        const replacement=document.createElement('h3');
        replacement.className='embedded-page-title';
        replacement.innerHTML=heading.innerHTML;
        heading.replaceWith(replacement);
      });
    }
    this.root.querySelector('.app').scrollTop=scroll;
    if(previous?.action)this.root.querySelector(`[data-action="${CSS.escape(previous.action)}"]`)?.focus({preventScroll:true});
    else if(previous?.period)this.root.querySelector(`[data-period="${CSS.escape(previous.period)}"]`)?.focus({preventScroll:true});
    this.access();
  }
  navigation() {return nav.map(([name,ico])=>`<button class="nav-item" data-page="${name}" aria-current="${this.page===name?'page':'false'}">${icon(ico)}<span>${name}</span></button>`).join('');}
  cardHead(title,action='edit',label='Edit'){return `<div class="card-head"><h2>${title}</h2>${btn(action,label+arrow())}</div>`;}
  periods(){return `<div class="periods" role="group" aria-label="Reporting period">${['7','30'].map(n=>`<button data-period="${n}" aria-pressed="${this.period===n}">Last ${n} days</button>`).join('')}${btn('custom',`${icon('calendar')}Custom${icon('down')}`,'custom')}</div>`;}
  dashboard(){return `<section class="card greeting">${btn('greeting','Edit'+arrow())}<h1>Good afternoon, Mike!</h1><p>You’ve got ${btn('jobs','15 jobs')} scheduled for <b>today</b>.</p></section>
    <section class="card quick">${this.cardHead(`AI quick actions ${icon('sparkle')}`,'manage','Manage')}<div class="quick-list">${actions.filter(([id])=>!this.hiddenActions.has(id)).map(([id,label])=>btn(id,`<span class="action-icon ${id}">${icon(id)}</span><span>${label}</span>`,'quick-action')).join('')}</div></section>
    <div class="chart-grid">${this.chart(false)}${this.chart(true)}</div><div class="trend-grid">${this.trending(false)}${this.trending(true)}</div><div class="mobile-tasks">${this.tasks()}</div>`;}
  chart(distribution){
    const factor=this.period==='30'?3.4:this.period==='custom'?1.7:1;
    const rows=distribution?[['Total Revenue',15425.05,'teal','100%'],['Subscription Revenue',3645,'gold','No change'],['Total Past Due Payments',9834.87,'gold','No change']]:[['ACH',318.75,'red','93%'],['Cash',12848.30,'teal','30%'],['Credit',2258,'gold','No change']];
    return `<section class="card chart-card">${this.cardHead(distribution?'Gross Sales Distribution':'Gross Sales by Method')}${this.periods()}<div class="bar-chart ${distribution?'distribution':''}" role="img" aria-label="${distribution?'Revenue distribution':'Sales by payment method'} for ${this.period==='custom'?'selected dates':`last ${this.period} days`}">${rows.map(([name,value,color,change])=>`<button class="bar-row" data-detail="${name}" data-value="${money(value*factor)}"><span class="bar-label">${name}<small class="${change==='No change'?'unchanged':color}">${change==='No change'?'':icon(color==='red'?'trend-down':'trend-up')}${change}</small></span><span class="bar-track"><span class="bar ${color}" style="width:${Math.max(4,value/16000*100)}%"></span><span class="bar-value ${color}" style="left:${Math.min(69,Math.max(6,value/16000*100+2))}%">${money(value*factor)}</span></span></button>`).join('')}<div class="axis"><span>$0.00</span><span>${money(8000*factor)}</span><span>${money(16000*factor)}</span></div></div></section>`;
  }
  trending(product){return `<section class="card trending">${this.cardHead(product?'Trending Products':'Trending Services',product?'products':'services','View All')}${this.periods()}<ol>${(product?products:services).map((name,i)=>`<li><button data-detail="${name}" data-value="${product?[200,172,166,52,25][i]+' units sold':'Rank '+(i+1)+' service'}"><span>${i+1}</span><b>${name}</b>${product?`<span class="units">${[200,172,166,52,25][i]}</span>`:''}<small class="change ${i===2?'red':'teal'}">${icon(i===2?'trend-down':'trend-up')}${i===2?'1':'2'}</small></button></li>`).join('')}</ol></section>`;}
  tasks(){return `<section class="card tasks">${this.cardHead('Today’s Tasks','tasks','View all')}<div class="task-content"><h3>${icon('attention')}Needs Your Attention</h3><div class="task-alert"><b>You have transactions you need to review</b><p>There are <strong>10 failed payments</strong> to review</p>${btn('failed','Take action'+arrow())}</div><img class="divider" src="${url('images/ui/vega/figma/divider.svg')}" alt=""><h3>${icon('next')}What’s Next</h3><div class="task-next"><b>Sample customer 01 is now ready to bill!</b><p>This customer had <strong>2 jobs completed.</strong></p>${btn('invoices','View invoice'+arrow())}</div><img class="divider" src="${url('images/ui/vega/figma/divider.svg')}" alt=""><h3>${icon('checklist')}Your Checklist</h3>${state.tasks.length?`<ul class="checklist">${state.tasks.map((t,i)=>`<li><label><input type="checkbox" data-task="${i}" ${t.done?'checked':''}><span>${esc(t.title)}</span></label></li>`).join('')}</ul>`:`<img class="completed" src="${url('images/ui/vega/figma/completed.svg')}" alt=""><div class="all-done"><b>Congrats! You’re all done!</b><p>You’ve completed all of your personal tasks for <u>today</u>. Feel free to add more, or take a break.</p><small>Taking a break sounds good, doesn’t it?</small></div>`}${btn('add-task','Add new task'+arrow(),'add-task')}</div></section>`;}
  listPage(){
    const payment=this.page==='Payments and Estimates';
    const list=this.page==='Products'?products:this.page==='Services'?services:this.page==='Customers'?[...new Set(state.payments.map(p=>p.name))]:[...state.appointments,'Sample customer 01 — Lawn care','James Wilson — Landscaping','Morgan Taylor — Cleaning Services'];
    return `<section class="card list-page"><div class="page-heading"><h1>${esc(this.page)}</h1>${btn('dashboard','Back to dashboard'+arrow())}</div><p class="muted">Illustrative demo records — explore without changing real data.</p>${payment?`${btn('payment','Take a payment','primary')}<div class="record-list">${state.payments.map(p=>`<button class="record" data-detail="${esc(p.name)}" data-value="${money(p.amount)} · ${p.status}"><b>${esc(p.name)}</b><span>${money(p.amount)}</span><small class="${p.status==='Failed'?'red':'teal'}">${p.status}</small>${arrow()}</button>`).join('')}</div>`:`<div class="record-list">${list.map((name,i)=>`<button class="record" data-detail="${esc(name)}" data-value="Sample ${this.page.toLowerCase()} record ${i+1}"><b>${esc(name)}</b>${arrow()}</button>`).join('')}</div>`}</section>`;
  }
  navigate(page){this.page=page;this.render();this.root.querySelector('.app').scrollTop=0;}
  click(event){
    const el=event.target.closest('button');if(!el)return;
    if(el.dataset.period){this.period=el.dataset.period;this.render();return;}
    if(el.dataset.page){this.close();this.navigate(el.dataset.page);return;}
    if(el.dataset.detail){this.modal(el.dataset.detail,`<p class="detail-value">${esc(el.dataset.value)}</p><p class="muted">Illustrative sample data for this portfolio demo.</p>`);return;}
    const a=el.dataset.action;
    // Native submit buttons must reach the form handler without replacing it.
    if(!a)return;
    if(a==='close'){this.close();return;}
    if(a==='dashboard'){this.navigate('Dashboard');return;}
    const pages={payments:'Payments and Estimates',failed:'Payments and Estimates',products:'Products',services:'Services',jobs:'Jobs',invoices:'Payments and Estimates'};
    if(pages[a]){this.navigate(pages[a]);return;}
    if(a==='menu'){this.modal('My business',`<nav class="navigation">${this.navigation()}</nav>`);return;}
    if(a==='branch'){this.modal('Choose a branch',`<p class="muted">Sample locations</p>${['Hillview Branch','Downtown Branch'].map(b=>`<label class="choice"><input type="radio" name="branch" value="${b}" ${this.branch===b?'checked':''}>${b}</label>`).join('')}`);return;}
    if(a==='manage'){this.modal('Manage quick actions',actions.map(([id,label])=>`<label class="choice"><input type="checkbox" data-quick="${id}" ${this.hiddenActions.has(id)?'':'checked'}>${label}</label>`).join(''));return;}
    if(a==='payment'||a==='estimate'||a==='schedule'){
      const title={payment:'Take a payment',estimate:'Estimate a Job',schedule:'Schedule Appointment'}[a];
      this.modal(title,`<p class="muted">Demo only. Please use the sample customer; no information is sent.</p><form data-form="${a}"><label>Customer<select name="customer"><option>Sample customer 01</option><option>James Wilson</option><option>Morgan Taylor</option></select></label>${a==='schedule'?'<label>Date<input type="date" name="date" required></label><label>Service<select name="service"><option>Lawn care</option><option>Cleaning Services</option><option>Landscaping</option></select></label>':'<label>Amount ($)<input type="number" name="amount" min="0.01" max="99999" step="0.01" value="125.00" required></label>'}<button class="primary" type="submit">${a==='payment'?'Simulate payment':a==='estimate'?'Create sample estimate':'Schedule sample appointment'}</button></form>`);return;
    }
    if(a==='custom'){this.modal('Custom reporting period','<form data-form="custom"><label>Start date<input type="date" name="start" required></label><label>End date<input type="date" name="end" required></label><button type="submit" class="primary">Apply dates</button></form>');return;}
    if(a==='add-task'){this.modal('Add a personal task','<form data-form="task"><label>Task<input name="task" maxlength="80" value="Review this week’s invoices" required></label><button class="primary" type="submit">Add task</button></form>');return;}
    if(a==='tasks'||a==='notifications'){this.modal('Today’s tasks',this.tasks());return;}
    if(a==='greeting'){this.modal('Dashboard greeting','<p>Good afternoon, Mike!</p><p class="muted">The greeting and job count reflect the original Figma design. This is a sample account.</p>');return;}
    if(a==='edit'){this.modal('Reporting options',`<p class="muted">Choose a period to update the sample charts.</p>${this.periods()}`);return;}
    this.modal(a==='profile'?'Mike’s demo account':'About this demo','<p>An interactive dashboard built with Vega components.</p><p class="muted">Try quick actions, reporting periods, and tasks. Changes live only in memory and reset when the page reloads. No payments, emails, or appointments are sent.</p>');
  }
  modal(title,body){
    this.returnFocus=this.root.activeElement;
    const layer=this.root.querySelector('.modal-layer');
    const tag=this.embedded?'dialog':'section';
    layer.innerHTML=`<${tag} class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><h2>${esc(title)}</h2>${btn('close','<span aria-hidden="true">×</span><span class="sr">Close dialog</span>','close')}</header>${body}</${tag}>`;
    layer.hidden=false;this.root.querySelector('.app').inert=true;
    if(this.embedded){
      this.previousOverflow=document.body.style.overflow;
      document.body.style.overflow='hidden';
      const dialog=layer.querySelector('dialog');
      dialog.addEventListener('cancel',event=>{event.preventDefault();this.close();});
      dialog.showModal();
    }
    layer.querySelector('input,select,button')?.focus();
  }
  close(){const layer=this.root.querySelector('.modal-layer');const dialog=layer.querySelector('dialog');if(dialog){dialog.close();document.body.style.overflow=this.previousOverflow||'';}layer.hidden=true;layer.innerHTML='';this.root.querySelector('.app').inert=false;this.returnFocus?.focus({preventScroll:true});if(this.actionsChanged){this.actionsChanged=false;this.render();}}
  keydown(e){
    const layer=this.root.querySelector('.modal-layer');if(layer.hidden)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();this.close();}
    if(e.key==='Tab'){const items=[...layer.querySelectorAll('button,input,select')].filter(el=>!el.disabled);const first=items[0],last=items.at(-1);if(e.shiftKey&&this.root.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&this.root.activeElement===last){e.preventDefault();first.focus();}}
  }
  change(e){
    const el=e.target;
    if(el.name==='branch'){this.branch=el.value;this.close();this.render();}
    if(el.dataset.quick){el.checked?this.hiddenActions.delete(el.dataset.quick):this.hiddenActions.add(el.dataset.quick);this.actionsChanged=true;}
    if(el.dataset.task!==undefined){state.tasks[Number(el.dataset.task)].done=el.checked;views.forEach(v=>{if(v!==this)v.render();});}
  }
  submit(e){
    e.preventDefault();const data=new FormData(e.target), kind=e.target.dataset.form;
    if(kind==='custom'){if(data.get('end')<data.get('start')){e.target.elements.end.setCustomValidity('End date must be after the start date.');e.target.elements.end.reportValidity();e.target.elements.end.oninput=()=>e.target.elements.end.setCustomValidity('');return;}this.period='custom';}
    if(kind==='payment')state.payments.unshift({name:data.get('customer'),amount:Number(data.get('amount')),status:'Paid'});
    if(kind==='estimate')state.payments.unshift({name:data.get('customer'),amount:Number(data.get('amount')),status:'Estimate'});
    if(kind==='schedule')state.appointments.unshift(`${data.get('customer')} — ${data.get('service')} · ${data.get('date')}`);
    if(kind==='task')state.tasks.push({title:data.get('task'),done:false});
    this.close();views.forEach(v=>v.render());this.toast(kind==='payment'?'Sample payment recorded. No money was moved.':kind==='custom'?'Sample report updated.':'Saved in this demo only.');
  }
  toast(message){this.root.querySelector('.toast').textContent=message;clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>{this.root.querySelector('.toast').textContent='';},4500);}
  destroy(){this.observer.disconnect();clearTimeout(this.toastTimer);views.delete(this);}
}


const hosts=[...document.querySelectorAll('[data-vega-device]')];
async function initialize(host){
  if(host.dataset.ready)return;host.dataset.ready='true';
  const live=document.createElement('span');live.className='vega-live-screen';host.append(live);
  const view=new VegaDemo(live,host.dataset.vegaDevice);
  const sheet=view.root.querySelector('link');
  const ready=()=>{host.querySelector('.vega-demo-fallback')?.remove();host.classList.add('is-ready');};
  sheet.addEventListener('load',ready,{once:true});if(sheet.sheet)ready();
  sheet.addEventListener('error',()=>{view.destroy();live.remove();delete host.dataset.ready;},{once:true});
}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){initialize(entry.target);observer.unobserve(entry.target);}}),{rootMargin:'500px'});
hosts.forEach(host=>observer.observe(host));
cursor.addEventListener('change',()=>views.forEach(v=>v.access()));
