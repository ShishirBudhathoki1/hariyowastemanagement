/* =====================================================================
   Hariyo Waste — Shared Utilities
   Icons (inline SVG), formatting, toasts, batch journey helpers
   ===================================================================== */

(function (global) {
  'use strict';

  /* ---------- Icon set (Lucide-inspired inline SVG, no deps) ---------- */
  const ICONS = {
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-1"/><circle cx="8" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    recycle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11.197 9.5 14.965 6.3a2.005 2.005 0 0 0-.25-3.309L13.4 2"/><path d="m14 2 3 6"/><path d="m5 17-3-6"/><path d="m16.965 22h2.833a1.94 1.94 0 0 0 1.585-.876 1.825 1.825 0 0 0 0-1.838l-1.7-2.936"/><path d="M16.5 16.5h5"/><path d="m11.5 20 1.5-6"/></svg>',
    sprout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3.3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.7.4-4.9-.6a3 3 0 0 1 2.6-3.1Z"/><path d="M5 8.4c.9-2 2.5-3.4 4-3.5 1.5 0 2.5 1 2.5 2.4"/></svg>',
    buildings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.442a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15V11a8.738 8.738 0 0 1 17.476 0v4a2 2 0 0 0 .474 1.293L22 18H2l.788-1.707A2 2 0 0 0 3.262 15Z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937 0l3.072-7.45a.5.5 0 0 0-.123-.536l-5.001-5a.5.5 0 0 0-.536-.123l-7.45 3.071a.5.5 0 0 0 0 .937z"/><path d="m21 3-7.75 7.75"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    wheat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M15.47 15.53 17 14l1.53 1.53a3.5 3.5 0 0 1 0 4.94L17 22l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M19.47 11.53 21 10l1.53 1.53a3.5 3.5 0 0 1 0 4.94L21 18l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  };

  function icon(name, cls) {
    const svg = ICONS[name] || '';
    const c = cls ? ` class="${cls}"` : '';
    return `<span ${c} style="display:inline-flex;width:1em;height:1em">${svg}</span>`;
  }
  function iconSvg(name) { return ICONS[name] || ''; }

  /* ---------- Formatting ---------- */
  function fmtDate(d) {
    if (!d) return '—';
    const dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
  function fmtDateShort(d) {
    if (!d) return '—';
    const dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function fmtTime(d) {
    if (!d) return '—';
    const dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  function fmtKg(n) { return `${(n || 0)} kg`; }

  /* ---------- Initials ---------- */
  function initials(name) {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /* ---------- Toasts ---------- */
  function ensureToastWrap() {
    let w = document.querySelector('.toast-wrap');
    if (!w) {
      w = document.createElement('div');
      w.className = 'toast-wrap';
      document.body.appendChild(w);
    }
    return w;
  }
  function toast(message, opts) {
    opts = opts || {};
    const w = ensureToastWrap();
    const el = document.createElement('div');
    el.className = 'toast' + (opts.type === 'error' ? ' error' : opts.type === 'info' ? ' info' : '');
    el.innerHTML = `
      <div style="flex:1">
        <div class="title">${escapeHtml(opts.title || (opts.type === 'error' ? 'Error' : 'Success'))}</div>
        <div class="msg">${escapeHtml(message)}</div>
      </div>
      <button class="modal-close" aria-label="Close" style="font-size:1rem;padding:0 4px">×</button>
    `;
    w.appendChild(el);
    const close = () => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; setTimeout(() => el.remove(), 220); };
    el.querySelector('button').addEventListener('click', close);
    setTimeout(close, opts.duration || 3800);
  }

  /* ---------- Escape ---------- */
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ---------- Status helpers ---------- */
  const STAGE_ORDER = ['collection', 'sorting', 'composting', 'farm_delivery'];
  const STAGE_META = {
    collection:     { label: 'Waste Collected',    short: 'Collection',  n: 1, icon: 'truck' },
    sorting:        { label: 'Sorting & Segregation', short: 'Sorting',  n: 2, icon: 'layers' },
    composting:     { label: 'Compost Processing',  short: 'Composting', n: 3, icon: 'sprout' },
    farm_delivery:  { label: 'Farm Delivery',      short: 'Delivered',  n: 4, icon: 'wheat' },
  };

  function stageStatus(batch, stage) {
    const ev = (batch.timeline || []).find(t => t.stage === stage);
    if (!ev) return 'pending';
    return ev.status; // done | in_progress | pending
  }
  function batchCurrentStage(batch) {
    for (const s of STAGE_ORDER) {
      const st = stageStatus(batch, s);
      if (st === 'in_progress') return s;
      if (st === 'pending') return s;
    }
    return 'farm_delivery'; // all done
  }
  function nextStage(stage) {
    const i = STAGE_ORDER.indexOf(stage);
    if (i < 0 || i >= STAGE_ORDER.length - 1) return null;
    return STAGE_ORDER[i + 1];
  }
  function notifStatus(batch, stage) {
    const n = (batch.notifications || []).find(x => x.stage === stage);
    return n ? n.status : 'not_sent'; // sent | not_sent | failed
  }
  // Human label for the overall batch status
  function statusLabel(status) {
    const map = {
      collected: { label: 'Collected', cls: 'badge-blue' },
      sorting:   { label: 'Sorting',   cls: 'badge-amber' },
      composting:{ label: 'Composting', cls: 'badge-amber' },
      ready_for_delivery: { label: 'Ready for Delivery', cls: 'badge-purple' },
      delivered: { label: 'Delivered to Farm', cls: 'badge-green' },
      recycled:  { label: 'Recycled', cls: 'badge-green' },
      pending:   { label: 'Pending', cls: 'badge-gray' },
      scheduled: { label: 'Scheduled', cls: 'badge-blue' },
      active:    { label: 'Active', cls: 'badge-green' },
    };
    return map[status] || { label: status, cls: 'badge-gray' };
  }

  /* ---------- Notification message templates ---------- */
  const NOTIF_TEMPLATES = {
    collection: (b) => `Namaste! Your segregated waste (${b.weightKg}kg) has been collected by our field team. Batch ID: ${b.id}. Thank you for choosing Hariyo Waste.`,
    sorting: (b) => `Update on ${b.id}: Your waste has reached our sorting facility and is being segregated into organic and recyclable streams.`,
    composting: (b) => `Update on ${b.id}: Your organic waste is now being processed into nutrient-rich compost at our Bhaktapur facility.`,
    farm_delivery: (b) => `🌱 Great news! The compost from your batch ${b.id} (${b.deliveredKg}kg) has been delivered to a partner farm. Thank you for closing the loop!`,
    recycled: (b) => `Update on ${b.id}: Your recyclable waste has been sent to our certified recycling partner. Thank you for keeping Nepal clean!`,
  };
  function notifMessage(batch, stage) {
    const fn = NOTIF_TEMPLATES[stage];
    return fn ? fn(batch) : `Update on ${batch.id} for stage: ${STAGE_META[stage]?.label || stage}.`;
  }

  /* ---------- DOM helpers ---------- */
  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') n.className = v;
        else if (k === 'html') n.innerHTML = v;
        else if (k === 'text') n.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
        else if (k === 'dataset') Object.assign(n.dataset, v);
        else n.setAttribute(k, v);
      }
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return n;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  /* ---------- Modals ---------- */
  let modalRoot = null;
  function modalRootEl() {
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.className = 'modal-backdrop';
      modalRoot.addEventListener('click', (e) => { if (e.target === modalRoot) closeAllModals(); });
      document.body.appendChild(modalRoot);
    }
    return modalRoot;
  }
  function openModal({ title, body, footer, size }) {
    const root = modalRootEl();
    clear(root);
    const m = el('div', { class: 'modal' + (size === 'lg' ? ' modal-lg' : '') });
    const head = el('div', { class: 'modal-head' }, [
      el('h3', { text: title }),
      el('button', { class: 'modal-close', 'aria-label': 'Close', onclick: closeAllModals }, '×')
    ]);
    const bd = el('div', { class: 'modal-body' });
    if (typeof body === 'string') bd.innerHTML = body; else if (body instanceof Node) bd.appendChild(body);
    m.appendChild(head); m.appendChild(bd);
    if (footer) {
      const ft = el('div', { class: 'modal-foot' });
      if (typeof footer === 'string') ft.innerHTML = footer; else if (Array.isArray(footer)) footer.forEach(x => ft.appendChild(x));
      m.appendChild(ft);
    }
    root.appendChild(m);
    root.classList.add('open');
    document.body.style.overflow = 'hidden';
    return { root, m, body: bd };
  }
  function closeAllModals() {
    if (!modalRoot) return;
    modalRoot.classList.remove('open');
    clear(modalRoot);
    document.body.style.overflow = '';
  }

  /* ---------- Confirm dialog ---------- */
  function confirmDialog({ title, message, confirmText, cancelText, danger }) {
    return new Promise((resolve) => {
      const ok = el('button', {
        class: 'btn ' + (danger ? 'btn-dark' : 'btn-primary'),
        onclick: () => { closeAllModals(); resolve(true); }
      }, confirmText || 'Confirm');
      const cancel = el('button', {
        class: 'btn btn-ghost',
        onclick: () => { closeAllModals(); resolve(false); }
      }, cancelText || 'Cancel');
      openModal({
        title: title || 'Please confirm',
        body: `<p style="margin:0;color:var(--ink-600)">${escapeHtml(message || 'Are you sure?')}</p>`,
        footer: [cancel, ok]
      });
    });
  }

  /* ---------- Expose ---------- */
  global.UI = {
    ICONS, icon, iconSvg, escapeHtml,
    fmtDate, fmtDateShort, fmtTime, fmtKg, initials,
    toast, el, clear, qs, qa,
    openModal, closeAllModals, confirmDialog,
    STAGE_ORDER, STAGE_META, stageStatus, batchCurrentStage, nextStage,
    notifStatus, statusLabel, notifMessage,
  };
})(window);
