/* Presentation and optional detail views; works from file:// and GitHub Pages. */
'use strict';
const slides = [...document.querySelectorAll('section.slide')];
const tabs = [...document.querySelectorAll('[data-slide]')];
const label = document.querySelector('#page-label');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const dialog = document.querySelector('#detail-dialog');
const stage = document.querySelector('#detail-stage');
const detailName = document.querySelector('#detail-section-name');
const detailPage = document.querySelector('#detail-page');
const detailPrev = document.querySelector('#detail-prev');
const detailNext = document.querySelector('#detail-next');
let active = 0, detailIndex = 0, detailKind = '', opener = null;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function showSlide(i, focus = false) {
  active = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach((slide, n) => {
    slide.classList.toggle('active', n === active);
    slide.hidden = n !== active;
    if (n === active) slide.scrollTop = 0;
  });
  tabs.forEach((tab, n) => { tab.setAttribute('aria-selected', String(n === active)); tab.tabIndex = n === active ? 0 : -1; });
  label.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  prev.disabled = active === 0; next.disabled = active === slides.length - 1;
  history.replaceState(null, '', `#${slides[active].id}`);
  if (focus) { const h = slides[active].querySelector('h1,h2'); h.tabIndex = -1; h.focus({preventScroll:true}); }
}
prev.addEventListener('click', () => showSlide(active - 1, true));
next.addEventListener('click', () => showSlide(active + 1, true));
tabs.forEach((tab, n) => tab.addEventListener('click', () => showSlide(n, true)));

const details = { irrigation: ['irrigation-1','irrigation-2'], menu: ['menu-1','menu-2'] };
function openDetails(kind, button) {
  if (!details[kind]) return;
  opener = button; detailKind = kind; detailIndex = 0;
  dialog.showModal(); renderDetail(); dialog.querySelector('.detail-close').focus();
}
function renderDetail() {
  const ids = details[detailKind];
  const template = document.getElementById(ids[detailIndex]);
  stage.replaceChildren(template.content.cloneNode(true)); stage.scrollTop = 0;
  detailName.textContent = detailKind === 'menu' ? 'CHAMBIT MENU · PROJECT DETAILS' : 'SMART IRRIGATION · PROJECT DETAILS';
  detailPage.textContent = `${String(detailIndex + 1).padStart(2,'0')} / ${String(ids.length).padStart(2,'0')}`;
  detailPrev.disabled = detailIndex === 0; detailNext.disabled = detailIndex === ids.length - 1;
  if (detailKind === 'menu' && detailIndex === 1) renderAnalytics();
}
function moveDetail(n) { const limit = details[detailKind].length; detailIndex = Math.max(0, Math.min(limit-1, detailIndex+n)); renderDetail(); }
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openDetails(button.dataset.open, button)));
dialog.querySelector('.detail-close').addEventListener('click', () => dialog.close());
detailPrev.addEventListener('click', () => moveDetail(-1));
detailNext.addEventListener('click', () => moveDetail(1));
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => opener?.focus());
document.addEventListener('keydown', event => {
  if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
  if (dialog.open) {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); moveDetail(1); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); moveDetail(-1); }
    return;
  }
  if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); showSlide(active + 1, true); }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); showSlide(active - 1, true); }
  if (event.key === 'Home') { event.preventDefault(); showSlide(0, true); }
  if (event.key === 'End') { event.preventDefault(); showSlide(slides.length-1, true); }
});
function countTo(node, target, delay = 0) {
  if (reduced.matches) { node.textContent = String(target); return; }
  const start = performance.now() + delay, duration = 780;
  function frame(now) {
    const t = Math.max(0, Math.min(1, (now - start)/duration));
    node.textContent = String(Math.round(target * (1 - Math.pow(1-t,3))));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function validDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0,10) === s;
}
function renderAnalytics() {
  const a = window.ANALYTICS || {}, chart = document.querySelector('#chart');
  const rows = document.querySelector('#chart-table tbody');
  const msg = document.querySelector('#chart-message');
  const snapshot = a.historicalSnapshot;
  document.querySelector('#chart-name').textContent = a.metric || 'Daily users';
  document.querySelector('#chart-unit').textContent = a.unit || 'users / day';
  const points = Array.isArray(a.dailyUsers) ? a.dailyUsers : [];
  const seen = new Set();
  const data = points.filter(p => {
    if (!p || !validDate(p.date) || seen.has(p.date) || !Number.isSafeInteger(p.value) || p.value < 0) return false;
    seen.add(p.date); return true;
  }).sort((x,y) => x.date.localeCompare(y.date));
  if (snapshot && Number.isSafeInteger(snapshot.value) && snapshot.value >= 0) {
    document.querySelector('#metric-title').textContent = 'Historical dashboard snapshot';
    countTo(document.querySelector('#snapshot-number'), snapshot.value);
    document.querySelector('#snapshot-note').textContent = `${snapshot.label || ''} · ${snapshot.source || ''}`;
  }
  chart.replaceChildren(); rows.replaceChildren(); chart.classList.remove('animate');

    if (Array.isArray(a.weeklyAverages) && a.weeklyAverages.length) {
    const weeks = a.weeklyAverages.filter(w =>
      w && typeof w.label === 'string' &&
      typeof w.dates === 'string' &&
      Number.isFinite(w.average) && w.average >= 0
    );

    const max = Math.max(1, ...weeks.map(w => w.average));

    document.querySelector('#chart-name').textContent =
      'Average daily users by academic week';
    document.querySelector('#chart-unit').textContent =
      'Monday–Friday · users/day';
    document.querySelector('#chart-table caption').textContent =
      'Self-calculated weekday averages';
    document.querySelector('#chart-table thead').innerHTML =
      '<tr><th scope="col">Week (Mon–Fri)</th><th scope="col">Average users/day</th></tr>';

    msg.textContent =
      'Self-calculated averages for five academic weeks; weekdays only (Monday–Friday).';
    chart.setAttribute('aria-label',
      weeks.map(w => `${w.label}, ${w.dates}: ${w.average} average users per weekday`).join('; ')
    );

    weeks.forEach((w, i) => {
      const slot = document.createElement('div');
      slot.className = 'bar-slot';
      slot.tabIndex = 0;
      slot.title = `${w.label} (${w.dates}): ${w.average} average users/day`;
      slot.setAttribute('aria-label', slot.title);

      const count = document.createElement('span');
      count.className = 'bar-number';
      count.textContent = '0';

      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.setProperty('--height',
        `${Math.max(2, Math.round(145 * w.average / max))}px`);
      bar.style.setProperty('--delay', `${100 + i * 105}ms`);

      const label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = w.label;

      slot.append(count, bar, label);
      chart.append(slot);
      countTo(count, w.average, 120 + i * 105);

      const tr = document.createElement('tr');
      const weekCell = document.createElement('td');
      const valueCell = document.createElement('td');
      weekCell.textContent = `${w.label} (${w.dates})`;
      valueCell.textContent = String(w.average);
      tr.append(weekCell, valueCell);
      rows.append(tr);
    });

    requestAnimationFrame(() =>
      requestAnimationFrame(() => chart.classList.add('animate'))
    );

    const latest = weeks[weeks.length - 1];
    document.querySelector('#average-number').textContent = '—';
    countTo(document.querySelector('#average-number'), latest.average, 230);
    document.querySelector('#average-note').textContent =
      `${latest.label} (${latest.dates}): average users per weekday, calculated from Monday–Friday usage.`;
    document.querySelector('#average-ring')
      .style.setProperty('--progress', '360deg');
    return;
  }

  
  if (!data.length) {
    const empty = document.createElement('p'); empty.className='chart-empty';
    empty.textContent='Add verified daily figures to analytics.js to display animated bars.';
    chart.append(empty); msg.textContent='No dated daily figures have been entered. The 390 screenshot is not treated as daily data.';
    const tr = document.createElement('tr'); const td = document.createElement('td'); td.colSpan=2; td.textContent='No daily data available'; tr.append(td); rows.append(tr);
  } else {
    const visible = data.slice(-10), max = Math.max(1, ...visible.map(p=>p.value));
    msg.textContent = `${data.length} verified date${data.length===1?'':'s'} in analytics.js; chart shows the latest ${visible.length}. Bars start at zero.`;
    chart.setAttribute('aria-label', `${a.metric || 'Daily users'}: ${visible.map(p=>`${p.date} ${p.value}`).join(', ')}`);
    visible.forEach((p,i) => {
      const slot = document.createElement('div'); slot.className='bar-slot'; slot.tabIndex=0;
      slot.title=`${p.date}: ${p.value} ${a.unit || 'users / day'}`;
      slot.setAttribute('aria-label',slot.title);
      const count=document.createElement('span'); count.className='bar-number'; count.textContent='0';
      const bar=document.createElement('div'); bar.className='bar';
      bar.style.setProperty('--height', `${Math.max(2,Math.round(145*p.value/max))}px`);
      bar.style.setProperty('--delay',`${100+i*105}ms`);
      const date=document.createElement('span'); date.className='bar-label'; date.textContent=p.date.slice(5);
      slot.append(count,bar,date); chart.append(slot);
      countTo(count,p.value,120+i*105);
    });
    requestAnimationFrame(()=>requestAnimationFrame(()=>chart.classList.add('animate')));
    data.forEach(p=> { const tr=document.createElement('tr'); const day=document.createElement('td'); day.textContent=p.date; const value=document.createElement('td'); value.textContent=String(p.value); tr.append(day,value); rows.append(tr); });
  }
  const lastSeven = data.slice(-7), ring = document.querySelector('#average-ring');
  const avgNumber = document.querySelector('#average-number'), avgNote = document.querySelector('#average-note');
  const consecutive = lastSeven.length === 7 && lastSeven.every((p,i)=> i===0 || (Date.parse(p.date+'T00:00:00Z')-Date.parse(lastSeven[i-1].date+'T00:00:00Z') === 86400000));
  ring.style.setProperty('--progress','0deg');
  if (consecutive) {
    const avg=Math.round(lastSeven.reduce((sum,p)=>sum+p.value,0)/7);
    countTo(avgNumber,avg,230);
    avgNote.textContent=`Daily average for ${lastSeven[0].date} to ${lastSeven[6].date}. Based on seven consecutive, verified daily values.`;
    if (reduced.matches) ring.style.setProperty('--progress','360deg');
    else {
      const ringStart=performance.now();
      function drawRing(now) {
        if (!ring.isConnected) return;
        const fraction=Math.min(1,Math.max(0,(now-ringStart)/850));
        ring.style.setProperty('--progress',`${Math.round(fraction*360)}deg`);
        if (fraction<1) requestAnimationFrame(drawRing);
      }
      requestAnimationFrame(drawRing);
    }
  } else {
    avgNumber.textContent='—';avgNote.textContent='Needs seven consecutive, verified daily values for the same metric. Not calculated from an older screenshot.';
  }
}
const hashIndex = slides.findIndex(s => '#'+s.id === location.hash);
showSlide(hashIndex < 0 ? 0 : hashIndex);
