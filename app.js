'use strict';

/* ---------- constants & helpers ---------- */
const GRID = 26, ROOT_R = 64, CHAP_R = 46;
const ACCENT = '#1B1B1E';
const PALETTE = [
  { key: 'black',  hex: '#1A1A1C' },
  { key: 'yellow', hex: '#D9B36B' },
  { key: 'lime',   hex: '#9DBB7F' },
  { key: 'orange', hex: '#D99368' },
  { key: 'pink',   hex: '#D38FA6' },
  { key: 'blue',   hex: '#A6A0AA' },
];
const LEGACY_COLORS = { purple: 'blue', mint: 'lime' };
const KEY = 'studymap.v1', VIEWKEY = 'studymap.view.v1', STORE_KEY = 'sm.store.v2';
const SVGNS = 'http://www.w3.org/2000/svg';

const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = () => 'n' + Math.random().toString(36).slice(2, 9);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hexOf = key => (PALETTE.find(p => p.key === key) || PALETTE[0]).hex;

const ICONS = {
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
  link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  snap: '<svg viewBox="0 0 24 24"><circle cx="5" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="19" cy="5" r="1.7"/><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/><circle cx="5" cy="19" r="1.7"/><circle cx="12" cy="19" r="1.7"/><circle cx="19" cy="19" r="1.7"/></svg>',
  fit: '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
  pencil: '<svg viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 8l5-5 5 5M12 3v12"/></svg>',
  reset: '<svg viewBox="0 0 24 24"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  nodeadd: '<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="3"/><circle cx="17" cy="6" r="3"/><path d="M8.6 10.6l5.8-3.2M17 14v6M14 17h6"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M3 9.5 12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22v-9h6v9"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  user: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  graph: '<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M8.2 15.8 15.8 8.2"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1.2 3.6-.6 5.2-2 7-1.5 1.9-2.5 3.4-2.5 5.5A6.5 6.5 0 0 0 12 21a6.5 6.5 0 0 0 6.5-6.5c0-4.5-3.2-7.2-4.9-9.4-.6 1.7-1.1 3.4-2.6 4.4C10.6 7.6 11.4 4.6 12 2z"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
};
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = (ICONS[el.dataset.icon] || '') + el.innerHTML; });

/* ---------- elements ---------- */
const canvas = $('#canvas'), world = $('#world'), edgeLayer = $('#edgeLayer'),
  nodesEl = $('#nodes'), tempLink = $('#tempLink'), ntb = $('#ntb'),
  renameWrap = $('#renameWrap'), renameInput = $('#renameInput'),
  subjectInput = $('#subjectInput'), savedTag = $('#savedTag');

/* ---------- state ---------- */
function defaultState() {
  const root = { id: 'root', label: 'Data Structures', x: 0, y: 0, isRoot: true, color: 'black', done: false };
  const mk = (label, x, y, color, done = false) => ({ id: uid(), label, x, y, color, done });
  const a  = mk('Arrays', -286, -156, 'lime', true);
  const ll = mk('Linked Lists', -494, 0, 'blue');
  const sq = mk('Stacks & Queues', -442, 208, 'orange');
  const tr = mk('Trees', 286, -156, 'pink');
  const gr = mk('Graphs', 494, 26, 'yellow');
  const hs = mk('Hashing', 182, 234, 'black');
  const L = (p, q) => ({ id: uid(), from: p.id, to: q.id });
  return {
    nodes: [root, a, ll, sq, tr, gr, hs],
    links: [L(root, a), L(a, ll), L(ll, sq), L(root, tr), L(tr, gr), L(root, hs)],
  };
}

function normalizeState(d) {
  d.nodes.forEach(n => {
    n.x = +n.x || 0; n.y = +n.y || 0;
    if (!n.isRoot && !PALETTE.some(p => p.key === n.color)) n.color = LEGACY_COLORS[n.color] || 'black';
  });
  return d;
}
function algebraSample() {
  const root = { id: 'root', label: 'Linear Algebra', x: 0, y: 0, isRoot: true, color: 'black', done: false };
  const mk = (label, x, y, color, done = false) => ({ id: uid(), label, x, y, color, done });
  const v = mk('Vectors', -312, -104, 'lime', true);
  const m = mk('Matrices', 0, -260, 'blue');
  const e = mk('Eigenvalues', 312, -78, 'pink');
  const L = (p, q) => ({ id: uid(), from: p.id, to: q.id });
  return { nodes: [root, v, m, e], links: [L(root, v), L(v, m), L(m, e)] };
}
const validState = d => d && Array.isArray(d.nodes) && Array.isArray(d.links) && d.nodes.some(n => n.isRoot);
function loadStore() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && Array.isArray(s.subjects) && s.subjects.length && s.subjects.every(x => x.id && validState(x.state))) {
      s.subjects.forEach(x => normalizeState(x.state));
      return s;
    }
  } catch { /* fall through */ }
  try { // migrate the old single-map format
    const old = JSON.parse(localStorage.getItem(KEY));
    if (validState(old)) {
      const id = uid();
      return { subjects: [{ id, state: normalizeState(old) }], currentId: id };
    }
  } catch { /* fall through */ }
  return null;
}
function loadView() {
  try { return JSON.parse(localStorage.getItem(VIEWKEY)); } catch { return null; }
}

let store = loadStore();
if (!store) {
  const a = { id: uid(), state: defaultState() }, b = { id: uid(), state: algebraSample() };
  store = { subjects: [a, b], currentId: a.id };
}
const currentSubject = () => store.subjects.find(s => s.id === store.currentId) || store.subjects[0];
store.currentId = currentSubject().id;
let state = currentSubject().state;
let view = { x: 0, y: 0, z: 1 };
let sel = { type: null, id: null };          // 'node' | 'link'
let linkMode = false, pendingFrom = null, snapOn = true;
let renamingId = null, dragRec = null, lastAdded = null;
const edgeEls = new Map();

const byId = id => state.nodes.find(n => n.id === id);
const rootNode = () => state.nodes.find(n => n.isRoot);
const rOf = n => n.isRoot ? ROOT_R : CHAP_R;
const cOf = n => n.isRoot ? ACCENT : hexOf(n.color);
const keyOf = n => n.isRoot ? 'black' : (n.color || 'black');

/* ---------- persistence ---------- */
let saveT = null, flashT = null, viewT = null;
function persist() {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    savedTag.classList.add('on');
    clearTimeout(flashT);
    flashT = setTimeout(() => savedTag.classList.remove('on'), 1000);
  }, 250);
}
function persistView() {
  clearTimeout(viewT);
  viewT = setTimeout(() => {
    localStorage.setItem(VIEWKEY, JSON.stringify({ x: view.x, y: view.y, z: view.z, snap: snapOn }));
  }, 300);
}

/* ---------- geometry / view ---------- */
const rect = () => canvas.getBoundingClientRect();
const w2s = (x, y) => ({ x: x * view.z + view.x, y: y * view.z + view.y });
const s2w = (x, y) => ({ x: (x - view.x) / view.z, y: (y - view.y) / view.z });
function evtW(e) { const r = rect(); return s2w(e.clientX - r.left, e.clientY - r.top); }
const snapPt = (x, y) => snapOn ? { x: Math.round(x / GRID) * GRID, y: Math.round(y / GRID) * GRID } : { x, y };

function applyView() {
  world.style.transform = `translate(${view.x}px,${view.y}px) scale(${view.z})`;
  $('#zoomLabel').textContent = Math.round(view.z * 100) + '%';
  positionToolbar(); positionRename(); persistView();
}
function zoomAt(f, clientX, clientY) {
  const r = rect(), cx = clientX - r.left, cy = clientY - r.top;
  const nz = clamp(view.z * f, 0.35, 2.5);
  const wx = (cx - view.x) / view.z, wy = (cy - view.y) / view.z;
  view.x = cx - wx * nz; view.y = cy - wy * nz; view.z = nz;
  applyView();
}
function fitView() {
  if (!state.nodes.length) return;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of state.nodes) {
    const r = rOf(n);
    minX = Math.min(minX, n.x - r); maxX = Math.max(maxX, n.x + r);
    minY = Math.min(minY, n.y - r); maxY = Math.max(maxY, n.y + r);
  }
  const pad = 110, r0 = rect();
  const bw = maxX - minX + pad * 2, bh = maxY - minY + pad * 2;
  const z = clamp(Math.min(r0.width / bw, r0.height / bh), 0.35, 1.3);
  view = { x: r0.width / 2 - (minX + maxX) / 2 * z, y: r0.height / 2 - (minY + maxY) / 2 * z, z };
  applyView();
}
function focusNode(id) {
  const n = byId(id); if (!n) return;
  const r0 = rect();
  view.x = r0.width / 2 - n.x * view.z;
  view.y = r0.height / 2 - n.y * view.z;
  applyView();
}

/* ---------- rendering ---------- */
function renderAll() { renderEdges(); renderNodes(); renderHUD(); refreshToolbar(); positionToolbar(); }

function shadowFor(n, selected) {
  const hex = cOf(n);
  if (n.isRoot) {
    return selected
      ? '0 0 0 3px rgba(27,27,30,.22), 0 18px 40px -12px rgba(27,27,30,.55)'
      : '0 1px 2px rgba(27,27,30,.15), 0 16px 36px -14px rgba(27,27,30,.45)';
  }
  return selected
    ? `0 0 0 2px ${hex}, 0 14px 30px -12px ${hex}AA`
    : `0 1px 2px rgba(27,27,30,.05), 0 12px 26px -14px ${hex}99`;
}

function renderNodes() {
  nodesEl.innerHTML = '';
  for (const n of state.nodes) nodesEl.appendChild(makeNode(n));
}

function makeNode(n) {
  const el = document.createElement('div');
  const selected = sel.type === 'node' && sel.id === n.id;
  el.className = 'node' + (n.isRoot ? ' root' : '') + (selected ? ' selected' : '')
    + (pendingFrom === n.id ? ' pending' : '') + (n.done && !n.isRoot ? ' done' : '');
  el.dataset.id = n.id;
  const r = rOf(n);
  el.style.left = n.x + 'px';
  el.style.top = n.y + 'px';
  el.style.width = el.style.height = r * 2 + 'px';
  if (!n.isRoot) el.style.borderColor = cOf(n);
  el.style.boxShadow = shadowFor(n, selected);
  el.innerHTML = (n.isRoot ? '<span class="roottag">SUBJECT</span>' : '')
    + `<span class="label">${esc(n.label)}</span>`
    + (n.done && !n.isRoot ? `<span class="badge">${ICONS.check}</span>` : '');
  if (n.id === lastAdded) {
    el.classList.add('pop'); lastAdded = null;
    setTimeout(() => el.classList.remove('pop'), 350);
  }
  bindNode(el, n);
  return el;
}

function renderEdges() {
  edgeEls.clear();
  edgeLayer.innerHTML = '';
  for (const l of state.links) {
    const a = byId(l.from), b = byId(l.to);
    if (!a || !b) continue;
    const g = document.createElementNS(SVGNS, 'g');
    g.classList.add('edge'); g.dataset.id = l.id;
    const selected = sel.type === 'link' && sel.id === l.id;
    if (selected) g.classList.add('sel');
    const hit = document.createElementNS(SVGNS, 'path');
    hit.setAttribute('class', 'edge-hit');
    const vis = document.createElementNS(SVGNS, 'path');
    vis.setAttribute('class', 'edge-vis');
    vis.setAttribute('stroke', cOf(a));
    vis.setAttribute('marker-end', `url(#arr-${keyOf(a)})`);
    g.append(hit, vis);
    let xg = null;
    if (selected) {
      xg = document.createElementNS(SVGNS, 'g');
      xg.setAttribute('class', 'edge-x');
      xg.innerHTML = '<circle r="11"/><path d="M-4 -4L4 4M4 -4L-4 4"/>';
      xg.addEventListener('click', e => { e.stopPropagation(); deleteLink(l.id); });
      g.append(xg);
    }
    g.addEventListener('click', e => { e.stopPropagation(); select('link', l.id); });
    edgeLayer.append(g);
    edgeEls.set(l.id, { g, hit, vis, xg, l });
    updateEdge(l.id);
  }
}

function updateEdge(id) {
  const ed = edgeEls.get(id); if (!ed) return;
  const a = byId(ed.l.from), b = byId(ed.l.to);
  if (!a || !b) return;
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const sx = a.x + ux * (rOf(a) + 3), sy = a.y + uy * (rOf(a) + 3);
  const ex = b.x - ux * (rOf(b) + 8), ey = b.y - uy * (rOf(b) + 8);
  const bow = Math.min(34, len * 0.1);
  const cx = (sx + ex) / 2 - uy * bow, cy = (sy + ey) / 2 + ux * bow;
  const d = `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
  ed.hit.setAttribute('d', d); ed.vis.setAttribute('d', d);
  if (ed.xg) {
    const mx = (sx + 2 * cx + ex) / 4, my = (sy + 2 * cy + ey) / 4;
    ed.xg.setAttribute('transform', `translate(${mx},${my})`);
  }
}
function updateEdgesFor(nodeId) {
  for (const [id, ed] of edgeEls) if (ed.l.from === nodeId || ed.l.to === nodeId) updateEdge(id);
}

function renderHUD() {
  const chapters = state.nodes.filter(n => !n.isRoot);
  const done = chapters.filter(c => c.done).length;
  const pct = chapters.length ? Math.round(done / chapters.length * 100) : 0;
  $('#pct').textContent = pct + '%';
  $('#bar').style.width = pct + '%';
  $('#statsSub').textContent = `${done}/${chapters.length} done · ${state.links.length} links`;
  $('#chapCount').textContent = chapters.length;

  const root = rootNode();
  if (document.activeElement !== subjectInput) subjectInput.value = root.label;
  sizeSubject();

  const list = $('#chapList');
  list.innerHTML = '';
  const nextOf = n => state.links.filter(l => l.from === n.id).map(l => byId(l.to)?.label).filter(Boolean);
  const mkRow = (n, isRoot) => {
    const row = document.createElement('div');
    row.className = 'row' + (isRoot ? ' rootrow' : '');
    const nexts = nextOf(n);
    row.innerHTML = `<span class="dot" style="background:${cOf(n)}"></span>
      <div class="meta">
        <div class="name">${esc(n.label)}</div>
        ${nexts.length ? `<div class="next">→ ${esc(nexts.join(', '))}</div>` : ''}
      </div>`
      + (isRoot ? '' : `<button class="donebtn${n.done ? ' on' : ''}" title="Mark as done">${ICONS.check}</button>`);
    row.addEventListener('click', e => {
      if (e.target.closest('.donebtn')) { toggleDone(n.id); return; }
      focusNode(n.id); select('node', n.id);
    });
    return row;
  };
  list.appendChild(mkRow(root, true));
  chapters.forEach(c => list.appendChild(mkRow(c, false)));
  if (!chapters.length) {
    const note = document.createElement('div');
    note.className = 'empty-note';
    note.textContent = 'No chapters yet — double-click the canvas or hit “Add chapter”.';
    list.appendChild(note);
  }
  renderDashboard();
}

/* ---------- floating toolbar ---------- */
function buildToolbarDots() {
  const wrap = $('#tbColors');
  wrap.innerHTML = '';
  for (const p of PALETTE) {
    const b = document.createElement('button');
    b.className = 'tb-dot'; b.dataset.key = p.key;
    b.style.background = p.hex; b.title = p.key;
    b.addEventListener('click', () => {
      const n = sel.type === 'node' && byId(sel.id);
      if (n && !n.isRoot) { n.color = p.key; persist(); renderAll(); }
    });
    wrap.appendChild(b);
  }
}
function refreshToolbar() {
  const n = sel.type === 'node' ? byId(sel.id) : null;
  if (!n) return;
  const isRoot = !!n.isRoot;
  $('#tbColors').style.display = isRoot ? 'none' : 'flex';
  $('#tbSep').style.display = isRoot ? 'none' : 'block';
  $('#tbDone').style.display = isRoot ? 'none' : 'flex';
  $('#tbDelete').style.display = isRoot ? 'none' : 'flex';
  $('#tbDone').classList.toggle('active', !!n.done);
  document.querySelectorAll('.tb-dot').forEach(d => d.classList.toggle('on', d.dataset.key === n.color));
}
function positionToolbar() {
  const n = sel.type === 'node' ? byId(sel.id) : null;
  if (!n || renamingId) { ntb.classList.add('hidden'); return; }
  const s = w2s(n.x, n.y);
  ntb.style.left = s.x + 'px';
  ntb.style.top = (s.y - rOf(n) * view.z - 12) + 'px';
  ntb.classList.remove('hidden');
}

/* ---------- selection ---------- */
function select(type, id) { sel = { type, id }; renderAll(); }
function clearSel() { if (sel.type) { sel = { type: null, id: null }; renderAll(); } }

/* ---------- actions ---------- */
function findFreeSpot(x, y) {
  let px = x, py = y, i = 0;
  while (state.nodes.some(n => Math.hypot(n.x - px, n.y - py) < 115) && i < 60) {
    const ang = i * (Math.PI / 5), rad = 95 + 13 * i;
    px = x + Math.cos(ang) * rad; py = y + Math.sin(ang) * rad; i++;
  }
  return { x: px, y: py };
}

function createNodeAt(x, y, opts = {}) {
  const p = snapPt(x, y);
  const chapCount = state.nodes.filter(n => !n.isRoot).length;
  const n = {
    id: uid(), label: 'New chapter',
    x: clamp(p.x, -9200, 9200), y: clamp(p.y, -9200, 9200),
    color: PALETTE[chapCount % PALETTE.length].key, done: false,
  };
  state.nodes.push(n);
  if (opts.from) state.links.push({ id: uid(), from: opts.from, to: n.id });
  lastAdded = n.id;
  select('node', n.id);
  persist();
  openRename(n.id);
}

function addChapterCenter() {
  const r0 = rect();
  const c = s2w(r0.width / 2, r0.height / 2);
  const spot = findFreeSpot(c.x, c.y);
  createNodeAt(spot.x, spot.y);
}

function addLinkedChapter() {
  const n = sel.type === 'node' ? byId(sel.id) : null;
  if (!n) return;
  const root = rootNode();
  let dx = n.x - root.x, dy = n.y - root.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) { dx = 1; dy = 0; } else { dx /= len; dy /= len; }
  const base = { x: n.x + dx * (rOf(n) + CHAP_R + 110), y: n.y + dy * (rOf(n) + CHAP_R + 110) };
  const spot = findFreeSpot(base.x, base.y);
  createNodeAt(spot.x, spot.y, { from: n.id });
}

function addLink(from, to) {
  if (!from || !to || from === to) return;
  if (!byId(from) || !byId(to)) return;
  const dup = state.links.some(l => (l.from === from && l.to === to) || (l.from === to && l.to === from));
  if (dup) { toast('These chapters are already linked'); return; }
  state.links.push({ id: uid(), from, to });
  persist(); renderAll();
}

function deleteLink(id) {
  state.links = state.links.filter(l => l.id !== id);
  if (sel.type === 'link' && sel.id === id) sel = { type: null, id: null };
  persist(); renderAll();
}

function deleteNode(id) {
  const n = byId(id);
  if (!n || n.isRoot) return;
  if (renamingId === id) cancelRename();
  state.nodes = state.nodes.filter(x => x.id !== id);
  state.links = state.links.filter(l => l.from !== id && l.to !== id);
  if (pendingFrom === id) pendingFrom = null;
  if (sel.type === 'node' && sel.id === id) sel = { type: null, id: null };
  persist(); renderAll();
  toast('Chapter removed');
}

function toggleDone(id) {
  const n = byId(id);
  if (!n || n.isRoot) return;
  n.done = !n.done;
  persist(); renderAll();
}

/* ---------- rename ---------- */
function openRename(id) {
  const n = byId(id); if (!n) return;
  renamingId = id;
  renameInput.value = n.label;
  positionRename();
  renameWrap.classList.remove('hidden');
  positionToolbar();
  renameInput.focus(); renameInput.select();
}
function positionRename() {
  if (!renamingId) return;
  const n = byId(renamingId); if (!n) return;
  const s = w2s(n.x, n.y);
  renameWrap.style.left = s.x + 'px';
  renameWrap.style.top = s.y + 'px';
  renameInput.style.width = Math.max(150, rOf(n) * 2 * view.z) + 'px';
  renameInput.style.fontSize = clamp(14 * view.z, 12, 18) + 'px';
}
function updateNodeLabel(n) {
  const span = nodesEl.querySelector(`[data-id="${n.id}"] .label`);
  if (span) span.textContent = n.label;
}
function commitRename() {
  if (!renamingId) return;
  const n = byId(renamingId);
  renamingId = null;
  renameWrap.classList.add('hidden');
  if (n) {
    const v = renameInput.value.trim();
    if (v) n.label = v;
    if (n.isRoot) document.title = n.label;
    updateNodeLabel(n);
    renderHUD();
    persist();
  }
  positionToolbar();
}
function cancelRename() {
  renamingId = null;
  renameWrap.classList.add('hidden');
  positionToolbar();
}
renameInput.addEventListener('keydown', e => {
  e.stopPropagation();
  if (e.key === 'Enter') commitRename();
  else if (e.key === 'Escape') cancelRename();
});
renameInput.addEventListener('blur', () => commitRename());
renameWrap.addEventListener('pointerdown', e => e.stopPropagation());

/* ---------- node gestures ---------- */
function updateTemp(n, w) {
  const dx = w.x - n.x, dy = w.y - n.y;
  const len = Math.hypot(dx, dy);
  if (len < rOf(n) + 12) { tempLink.setAttribute('d', ''); return; }
  const ux = dx / len, uy = dy / len;
  const sx = n.x + ux * (rOf(n) + 3), sy = n.y + uy * (rOf(n) + 3);
  tempLink.setAttribute('d', `M ${sx} ${sy} L ${w.x} ${w.y}`);
}
function clearDropMarks() {
  document.querySelectorAll('.node.drop').forEach(x => x.classList.remove('drop'));
}
function nodeAtWorld(w, excludeId) {
  for (let i = state.nodes.length - 1; i >= 0; i--) {
    const n = state.nodes[i];
    if (n.id !== excludeId && Math.hypot(w.x - n.x, w.y - n.y) <= rOf(n)) return n;
  }
  return null;
}
function insideCanvas(e) {
  const r = rect();
  return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
}
function endLinkGesture() {
  document.body.classList.remove('linking');
  tempLink.classList.remove('on');
  tempLink.setAttribute('d', '');
  clearDropMarks();
}

function bindNode(el, n) {
  el.addEventListener('mousemove', e => {
    if (dragRec) return;
    if (linkMode) { el.style.cursor = 'crosshair'; return; }
    const w = evtW(e);
    const d = Math.hypot(w.x - n.x, w.y - n.y);
    el.style.cursor = d > rOf(n) * 0.72 ? 'crosshair' : 'grab';
  });

  el.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (renamingId) commitRename();
    const w = evtW(e);
    const d = Math.hypot(w.x - n.x, w.y - n.y);
    const mode = linkMode ? 'click' : (d > rOf(n) * 0.72 ? 'link' : 'move');
    dragRec = {
      kind: 'node', mode, n, el,
      startX: e.clientX, startY: e.clientY,
      offX: w.x - n.x, offY: w.y - n.y, moved: false,
    };
    el.setPointerCapture(e.pointerId);
    if (mode === 'link') {
      tempLink.classList.add('on');
      updateTemp(n, w);
      document.body.classList.add('linking');
    }
  });

  el.addEventListener('pointermove', e => {
    if (!dragRec || dragRec.el !== el) return;
    if (!dragRec.moved && Math.hypot(e.clientX - dragRec.startX, e.clientY - dragRec.startY) > 4) {
      dragRec.moved = true;
      if (dragRec.mode === 'click') dragRec.mode = 'move';
    }
    if (!dragRec.moved) return;
    const w = evtW(e);
    if (dragRec.mode === 'move') {
      const p = snapPt(w.x - dragRec.offX, w.y - dragRec.offY);
      n.x = clamp(p.x, -9200, 9200);
      n.y = clamp(p.y, -9200, 9200);
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      updateEdgesFor(n.id);
      if (sel.type === 'node' && sel.id === n.id) positionToolbar();
    } else if (dragRec.mode === 'link') {
      updateTemp(n, w);
      clearDropMarks();
      const t = nodeAtWorld(w, n.id);
      if (t) nodesEl.querySelector(`[data-id="${t.id}"]`)?.classList.add('drop');
    }
  });

  const finish = e => {
    if (!dragRec || dragRec.el !== el) return;
    const rec = dragRec; dragRec = null;
    endLinkGesture();
    if (rec.mode === 'link') {
      const w = evtW(e);
      const target = nodeAtWorld(w, n.id);
      if (target) {
        addLink(n.id, target.id);
      } else if (insideCanvas(e) && Math.hypot(w.x - n.x, w.y - n.y) > rOf(n) + CHAP_R) {
        createNodeAt(w.x, w.y, { from: n.id });
      }
    } else if (!rec.moved) {
      if (linkMode) {
        if (!pendingFrom) { pendingFrom = n.id; renderAll(); }
        else if (pendingFrom !== n.id) { const f = pendingFrom; pendingFrom = null; addLink(f, n.id); }
        else { pendingFrom = null; renderAll(); }
      } else {
        select('node', n.id);
      }
    } else {
      persist();
    }
  };
  el.addEventListener('pointerup', finish);
  el.addEventListener('pointercancel', () => {
    if (dragRec?.el === el) { dragRec = null; endLinkGesture(); }
  });

  el.addEventListener('dblclick', e => { e.stopPropagation(); openRename(n.id); });
}

/* ---------- canvas gestures (pan / zoom / add) ---------- */
canvas.addEventListener('pointerdown', e => {
  if (e.button !== 0 && e.button !== 1) return;
  if (e.target.closest('.node') || e.target.closest('.edge') || e.target.closest('.ntb') || e.target.closest('#renameWrap')) return;
  if (renamingId) commitRename();
  dragRec = { kind: 'pan', startX: e.clientX, startY: e.clientY, vx: view.x, vy: view.y, moved: false };
  canvas.setPointerCapture(e.pointerId);
  canvas.classList.add('panning');
});
canvas.addEventListener('pointermove', e => {
  if (dragRec?.kind !== 'pan') return;
  if (!dragRec.moved && Math.hypot(e.clientX - dragRec.startX, e.clientY - dragRec.startY) > 3) dragRec.moved = true;
  if (!dragRec.moved) return;
  view.x = dragRec.vx + (e.clientX - dragRec.startX);
  view.y = dragRec.vy + (e.clientY - dragRec.startY);
  applyView();
});
canvas.addEventListener('pointerup', e => {
  if (dragRec?.kind !== 'pan') return;
  const moved = dragRec.moved;
  dragRec = null;
  canvas.classList.remove('panning');
  if (!moved) {
    if (pendingFrom) { pendingFrom = null; renderAll(); }
    else clearSel();
  }
});
canvas.addEventListener('pointercancel', () => {
  if (dragRec?.kind === 'pan') { dragRec = null; canvas.classList.remove('panning'); }
});

canvas.addEventListener('dblclick', e => {
  if (e.target.closest('.node') || e.target.closest('.edge') || e.target.closest('.ntb') || e.target.closest('#renameWrap')) return;
  const w = evtW(e);
  createNodeAt(w.x, w.y);
});

canvas.addEventListener('wheel', e => {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey) {
    zoomAt(Math.exp(-e.deltaY * 0.0028), e.clientX, e.clientY);
  } else {
    view.x -= e.deltaX; view.y -= e.deltaY;
    applyView();
  }
}, { passive: false });

/* ---------- topbar / toolbar wiring ---------- */
function sizeSubject() {
  subjectInput.style.width = Math.max(8, subjectInput.value.length + 1) + 'ch';
}
subjectInput.addEventListener('input', () => {
  const root = rootNode();
  root.label = subjectInput.value || 'Untitled subject';
  sizeSubject();
  updateNodeLabel(root);
  document.title = root.label;
  renderDashboard();
  persist();
});
subjectInput.addEventListener('blur', () => renderHUD());

function toggleLinkMode(force) {
  linkMode = force ?? !linkMode;
  if (!linkMode) pendingFrom = null;
  $('#linkBtn').classList.toggle('active', linkMode);
  document.body.classList.toggle('linkmode', linkMode);
  renderAll();
  if (linkMode) toast('Link mode — click two circles to connect them');
}
$('#linkBtn').addEventListener('click', () => toggleLinkMode());

$('#snapBtn').addEventListener('click', () => {
  snapOn = !snapOn;
  $('#snapBtn').classList.toggle('active', snapOn);
  persistView();
});
$('#fitBtn').addEventListener('click', fitView);
$('#zoomIn').addEventListener('click', () => { const r0 = rect(); zoomAt(1.25, r0.left + r0.width / 2, r0.top + r0.height / 2); });
$('#zoomOut').addEventListener('click', () => { const r0 = rect(); zoomAt(0.8, r0.left + r0.width / 2, r0.top + r0.height / 2); });
$('#addBtn').addEventListener('click', addChapterCenter);

ntb.addEventListener('pointerdown', e => e.stopPropagation());
$('#tbAdd').addEventListener('click', addLinkedChapter);
$('#tbDone').addEventListener('click', () => { if (sel.type === 'node') toggleDone(sel.id); });
$('#tbRename').addEventListener('click', () => { if (sel.type === 'node') openRename(sel.id); });
$('#tbDelete').addEventListener('click', () => { if (sel.type === 'node') deleteNode(sel.id); });

/* ---------- keyboard ---------- */
window.addEventListener('keydown', e => {
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (sel.type === 'node' && !byId(sel.id)?.isRoot) deleteNode(sel.id);
    else if (sel.type === 'link') deleteLink(sel.id);
    e.preventDefault();
  } else if (e.key.toLowerCase() === 'l' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    toggleLinkMode();
  } else if (e.key === 'Escape') {
    if (linkMode) toggleLinkMode(false);
    else if (sel.type) clearSel();
  }
});

/* ---------- import / export / reset ---------- */
$('#exportBtn').addEventListener('click', () => {
  const slug = rootNode().label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'studymap';
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${slug}-studymap.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Exported map as JSON');
});
$('#importBtn').addEventListener('click', () => $('#fileInput').click());
$('#fileInput').addEventListener('change', e => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const d = JSON.parse(reader.result);
      if (!validState(d)) throw new Error('bad shape');
      state = normalizeState(d);
      currentSubject().state = state;
      sel = { type: null, id: null }; pendingFrom = null;
      renderAll(); fitView(); persist();
      toast('Map imported');
    } catch {
      toast('Could not import that file');
    }
  };
  reader.readAsText(f);
});
$('#resetBtn').addEventListener('click', () => {
  const name = rootNode().label;
  if (!confirm(`Clear all chapters of “${name}”?`)) return;
  state = { nodes: [{ id: 'root', label: name, x: 0, y: 0, isRoot: true, color: 'black', done: false }], links: [] };
  currentSubject().state = state;
  sel = { type: null, id: null }; pendingFrom = null;
  renderAll(); fitView(); persist();
});

/* ================= dashboard ================= */

/* --- views --- */
let pendingFit = false;
function showView(name) {
  $('#viewHome').classList.toggle('hidden', name !== 'home');
  $('#viewMap').classList.toggle('hidden', name !== 'map');
  document.querySelectorAll('.rail-btn[data-view]').forEach(b =>
    b.classList.toggle('active', b.dataset.view === name));
  if (name === 'map' && pendingFit) {
    pendingFit = false;
    requestAnimationFrame(fitView);
  }
  if (name === 'home') renderDashboard();
}
document.querySelectorAll('.rail-btn[data-view]').forEach(b =>
  b.addEventListener('click', () => showView(b.dataset.view)));
document.querySelectorAll('.rail-btn[data-demo]').forEach(b =>
  b.addEventListener('click', () => toast(`${b.dataset.demo} isn't part of this demo yet`)));
$('#openMapBtn').addEventListener('click', () => showView('map'));
$('#heroMap').addEventListener('click', () => showView('map'));

/* --- subjects --- */
function switchSubject(id) {
  const subj = store.subjects.find(s => s.id === id);
  if (!subj || id === store.currentId) return;
  store.currentId = id;
  state = subj.state;
  sel = { type: null, id: null }; pendingFrom = null;
  if (renamingId) cancelRename();
  localStorage.removeItem(VIEWKEY);
  pendingFit = true;
  document.title = rootNode().label;
  renderAll();
  persist();
}
function newSubject() {
  const id = uid();
  store.subjects.push({ id, state: { nodes: [{ id: 'root', label: 'New subject', x: 0, y: 0, isRoot: true, color: 'black', done: false }], links: [] } });
  store.currentId = id;
  state = currentSubject().state;
  sel = { type: null, id: null }; pendingFrom = null;
  localStorage.removeItem(VIEWKEY);
  pendingFit = true;
  renderAll();
  persist();
  showView('map');
  openRename('root');
}
function deleteSubject(id) {
  const subj = store.subjects.find(s => s.id === id);
  if (!subj || store.subjects.length < 2) return;
  const name = subj.state.nodes.find(n => n.isRoot)?.label || 'this subject';
  if (!confirm(`Delete “${name}” and its map?`)) return;
  store.subjects = store.subjects.filter(s => s.id !== id);
  if (store.currentId === id) {
    store.currentId = store.subjects[0].id;
    state = currentSubject().state;
    sel = { type: null, id: null }; pendingFrom = null;
    localStorage.removeItem(VIEWKEY);
    pendingFit = true;
    document.title = rootNode().label;
  }
  renderAll();
  persist();
}
$('#subjectPills').addEventListener('click', e => {
  const del = e.target.closest('[data-del]');
  if (del) { deleteSubject(del.dataset.del); return; }
  if (e.target.closest('#spillAdd')) { newSubject(); return; }
  const pill = e.target.closest('[data-sid]');
  if (pill) switchSubject(pill.dataset.sid);
});

/* --- study-time tracking (real, accumulated while the app is open) --- */
const USAGE_KEY = 'studymap.usage.v1';
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function loadUsage() {
  try { return JSON.parse(localStorage.getItem(USAGE_KEY)) || null; } catch { return null; }
}
let usage = loadUsage();
if (!usage) {
  // first run: seed a believable week so the dashboard isn't empty
  usage = {};
  const seedMin = [45, 70, 25, 90, 40, 65];
  for (let i = 6; i >= 1; i--) {
    usage[dayKey(new Date(Date.now() - i * 864e5))] = seedMin[6 - i] * 60;
  }
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}
function bumpUsage(seconds) {
  const k = dayKey(new Date());
  usage[k] = (usage[k] || 0) + seconds;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}
bumpUsage(10);
setInterval(() => { if (!document.hidden) { bumpUsage(30); if (!$('#viewHome').classList.contains('hidden')) renderHours(); } }, 30000);

function lastDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    out.push({ date: d, sec: usage[dayKey(d)] || 0 });
  }
  return out;
}
function weekHours() { return lastDays(7).reduce((s, d) => s + d.sec, 0) / 3600; }
function streakDays() {
  let s = 0;
  for (let i = 0; ; i++) {
    const k = dayKey(new Date(Date.now() - i * 864e5));
    if (usage[k] > 0) s++; else break;
  }
  return s;
}

/* --- friends / leaderboard / invites --- */
const FRIENDS = [
  { name: 'Alex Kim',   ini: 'AK', color: 'blue',   hours: 9.6, chapters: 14 },
  { name: 'Sara López', ini: 'SL', color: 'pink',   hours: 7.2, chapters: 11 },
  { name: 'Mehdi N.',   ini: 'MN', color: 'orange', hours: 5.8, chapters: 9 },
  { name: 'Jonas W.',   ini: 'JW', color: 'lime',   hours: 3.1, chapters: 4 },
];
const INV_KEY = 'studymap.invites.v1';
let invites = [];
try { invites = JSON.parse(localStorage.getItem(INV_KEY)) || []; } catch { invites = []; }

const avaGrad = key => {
  const h = hexOf(key);
  return `linear-gradient(140deg, ${h}, ${h}CC)`;
};

function renderLeaderboard() {
  const list = $('#lbList'); if (!list) return;
  const doneCount = state.nodes.filter(n => !n.isRoot && n.done).length;
  const rows = [
    { name: 'You', ini: 'ME', color: 'black', hours: weekHours(), chapters: doneCount, you: true },
    ...FRIENDS,
  ].sort((a, b) => b.hours - a.hours);
  list.innerHTML = rows.map((r, i) => `
    <div class="lb-row${r.you ? ' you' : ''}">
      <span class="lb-rank">${i + 1}</span>
      <span class="lb-ava" style="background:${r.you ? 'linear-gradient(140deg,#1A1A1C,#4A4A50)' : avaGrad(r.color)}">${r.ini}</span>
      <div class="lb-meta">
        <div class="lb-name">${esc(r.name)}</div>
        <div class="lb-sub">${r.chapters} ch done</div>
      </div>
      <span class="lb-hours">${r.hours.toFixed(1)}h</span>
    </div>`).join('');
  const fc = $('#friendCount');
  if (fc) fc.textContent = `${FRIENDS.length + invites.length} friends`;
}

function sendInvite() {
  const input = $('#inviteEmail');
  const email = input.value.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) { toast('Enter a valid email address'); input.focus(); return; }
  if (invites.includes(email)) { toast('You already invited them'); return; }
  invites.push(email);
  localStorage.setItem(INV_KEY, JSON.stringify(invites));
  input.value = '';
  renderLeaderboard();
  toast(`Invite sent to ${email}`);
}
$('#inviteBtn').addEventListener('click', sendInvite);
$('#inviteEmail').addEventListener('keydown', e => { if (e.key === 'Enter') sendInvite(); });

/* --- calendar --- */
const DEMO_EVENTS = [
  { offset: 1, label: 'Review “Trees”', color: 'blue' },
  { offset: 3, label: 'Group session', color: 'pink' },
  { offset: 7, label: 'Mock exam', color: 'orange' },
];
function renderCalendar() {
  const grid = $('#calGrid'); if (!grid) return;
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  $('#calMonth').textContent = now.toLocaleString('en', { month: 'long', year: 'numeric' });
  const startDow = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const evByDay = new Map();
  for (const e of DEMO_EVENTS) {
    const d = new Date(y, m, now.getDate() + e.offset);
    if (d.getMonth() === m) evByDay.set(d.getDate(), e);
  }
  let h = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => `<span class="dow">${d}</span>`).join('');
  for (let i = 0; i < startDow; i++) h += '<span class="day"></span>';
  for (let d = 1; d <= days; d++) {
    const ev = evByDay.get(d);
    h += `<span class="day${d === now.getDate() ? ' today' : ''}"${ev ? ` title="${esc(ev.label)}"` : ''}>
      <i>${d}</i>${ev ? `<b style="background:${hexOf(ev.color)}"></b>` : ''}</span>`;
  }
  grid.innerHTML = h;
  $('#calEvents').innerHTML = DEMO_EVENTS.map(e => {
    const d = new Date(y, m, now.getDate() + e.offset);
    const chip = e.offset === 0 ? 'Today' : e.offset === 1 ? 'Tomorrow' : d.toLocaleString('en', { month: 'short', day: 'numeric' });
    return `<div class="ev">
      <span class="ev-dot" style="background:${hexOf(e.color)}"></span>
      <span class="ev-name">${esc(e.label)}</span>
      <span class="ev-chip${e.offset < 2 ? ' soon' : ''}">${chip}</span>
    </div>`;
  }).join('');
}

/* --- stat chips (streak / hours sparkline / done) --- */
function renderHours() {
  const spark = $('#hoursSpark'); if (!spark) return;
  $('#chipHoursVal').textContent = weekHours().toFixed(1) + 'h';
  const s = streakDays();
  $('#chipStreakVal').textContent = `${s} day${s === 1 ? '' : 's'}`;
  const days = lastDays(7);
  const W = 52, H = 20, P = 3;
  const max = Math.max(...days.map(d => d.sec), 600);
  const pts = days.map((d, i) => ({
    x: P + i * (W - 2 * P) / 6,
    y: H - P - (d.sec / max) * (H - 2 * P),
  }));
  let line = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
    line += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  line += ` L ${pts[6].x.toFixed(1)} ${pts[6].y.toFixed(1)}`;
  spark.innerHTML = `
    <path d="${line}" fill="none" stroke="#7E9C5F" stroke-width="2" stroke-linecap="round"/>
    <circle cx="${pts[6].x.toFixed(1)}" cy="${pts[6].y.toFixed(1)}" r="2.4" fill="#7E9C5F"/>`;
}

/* --- mini map preview --- */
function renderMiniMap() {
  const svg = $('#miniMap'); if (!svg) return;
  const W = 560, H = 280, P = 40;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of state.nodes) {
    const r = rOf(n);
    minX = Math.min(minX, n.x - r); maxX = Math.max(maxX, n.x + r);
    minY = Math.min(minY, n.y - r); maxY = Math.max(maxY, n.y + r);
  }
  if (!isFinite(minX)) { svg.innerHTML = ''; return; }
  const s = Math.min((W - 2 * P) / Math.max(maxX - minX, 1), (H - 2 * P) / Math.max(maxY - minY, 1), 0.6);
  const ox = W / 2 - (minX + maxX) / 2 * s, oy = H / 2 - (minY + maxY) / 2 * s;
  const X = x => (x * s + ox).toFixed(1), Y = y => (y * s + oy).toFixed(1);
  let h = '';
  for (const l of state.links) {
    const a = byId(l.from), b = byId(l.to);
    if (!a || !b) continue;
    h += `<line x1="${X(a.x)}" y1="${Y(a.y)}" x2="${X(b.x)}" y2="${Y(b.y)}" stroke="${cOf(a)}" stroke-opacity=".5" stroke-width="1.5"/>`;
  }
  for (const n of state.nodes) {
    const R = Math.max(n.isRoot ? 11 : 7.5, rOf(n) * s);
    h += n.isRoot
      ? `<circle cx="${X(n.x)}" cy="${Y(n.y)}" r="${R}" fill="#101114"/>`
      : `<circle cx="${X(n.x)}" cy="${Y(n.y)}" r="${R}" fill="#fff" stroke="${cOf(n)}" stroke-width="2.5"/>`;
  }
  svg.innerHTML = h;
}

function renderDashboard() {
  if (!$('#subjectPills')) return;
  const chapters = state.nodes.filter(n => !n.isRoot);
  const done = chapters.filter(c => c.done).length;
  $('#chipDoneVal').textContent = `${done}/${chapters.length}`;
  $('#chipLeftVal').textContent = chapters.length - done;

  $('#subjectPills').innerHTML = store.subjects.map(s => {
    const r = s.state.nodes.find(n => n.isRoot);
    const on = s.id === store.currentId;
    const x = store.subjects.length > 1 ? `<span class="spx" data-del="${s.id}" title="Delete subject">×</span>` : '';
    return `<button class="spill${on ? ' on' : ''}" data-sid="${s.id}"><em>${esc(r?.label || 'Untitled')}</em>${x}</button>`;
  }).join('') + `<button class="spill add" id="spillAdd" title="New subject">+</button>`;

  renderMiniMap();
  renderCalendar();
  renderHours();
  renderLeaderboard();
}

/* ---------- toast ---------- */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  $('#toasts').append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 250); }, 1900);
}

/* ---------- init ---------- */
buildToolbarDots();
renderAll();
document.title = rootNode().label;
const savedView = loadView();
if (savedView && typeof savedView.x === 'number' && savedView.z > 0) {
  view = { x: savedView.x, y: savedView.y, z: clamp(savedView.z || 1, 0.35, 2.5) };
  snapOn = savedView.snap ?? true;
  applyView();
} else {
  pendingFit = true; // canvas starts hidden behind the dashboard; fit on first open
}
$('#snapBtn').classList.toggle('active', snapOn);
showView('home');
