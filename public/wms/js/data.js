/* =====================================================================
   Hariyo Waste, Data Layer
   Mock data + localStorage persistence (Vanilla JS, no frameworks)
   ===================================================================== */

(function (global) {
  'use strict';

  const STORE_KEY = 'hariyo_wms_v1';
  const SESSION_KEY = 'hariyo_wms_session';

  /* ---------- Seed data ---------- */
  function seed() {
    const now = new Date();
    const iso = (d) => new Date(d).toISOString();
    const daysAgo = (n) => new Date(Date.now() - n * 86400000);
    const hoursAgo = (n) => new Date(Date.now() - n * 3600000);

    const businesses = [
      { id: 'BZ-1001', name: 'Hotel Annapurna Kitchen', type: 'hotel', address: 'Itahari', phone: '01-4221711', email: 'kitchen@annapurna.example', contactPerson: 'Ramesh Shrestha', createdAt: iso(daysAgo(120)) },
      { id: 'BZ-1002', name: 'OR2K Vegetarian Café', type: 'cafe', address: 'Itahari', phone: '01-5524733', email: 'hello@or2k.example', contactPerson: 'Sunita Maharjan', createdAt: iso(daysAgo(95)) },
      { id: 'BZ-1003', name: 'Itahari House Restaurant', type: 'restaurant', address: 'Itahari', phone: '01-4700832', email: 'ops@itaharihouse.example', contactPerson: 'Bikash Tamang', createdAt: iso(daysAgo(80)) },
      { id: 'BZ-1004', name: 'Himalayan Java Coffee', type: 'cafe', address: 'Itahari', phone: '01-6610890', email: 'itahari@hjcoffee.example', contactPerson: 'Priya Karki', createdAt: iso(daysAgo(60)) },
      { id: 'BZ-1005', name: 'Itahari Guest House Dining', type: 'hotel', address: 'Itahari', phone: '01-4144144', email: 'dining@kgh.example', contactPerson: 'Anjana Rai', createdAt: iso(daysAgo(40)) },
      { id: 'BZ-1006', name: 'Newa Chhen Restaurant', type: 'restaurant', address: 'Itahari', phone: '01-5531200', email: 'newa@example', contactPerson: 'Saroj Prajapati', createdAt: iso(daysAgo(25)) },
    ];

    const workers = [
      { id: 'WK-201', name: 'Dipendra Gurung', phone: '9801010101', role: 'collector', areas: 'Itahari Central', status: 'active', createdAt: iso(daysAgo(110)) },
      { id: 'WK-202', name: 'Maya Tamang', phone: '9802020202', role: 'collector', areas: 'Itahari', status: 'active', createdAt: iso(daysAgo(100)) },
      { id: 'WK-203', name: 'Hari Bahadur Magar', phone: '9803030303', role: 'collector', areas: 'Itahari', status: 'active', createdAt: iso(daysAgo(90)) },
      { id: 'WK-204', name: 'Sita Karki', phone: '9804040404', role: 'sorter', areas: 'Sorting Facility - Itahari', status: 'active', createdAt: iso(daysAgo(85)) },
      { id: 'WK-205', name: 'Nabin Shrestha', phone: '9805050505', role: 'sorter', areas: 'Sorting Facility - Itahari', status: 'active', createdAt: iso(daysAgo(70)) },
      { id: 'WK-206', name: 'Kamal Thapa', phone: '9806060606', role: 'compost_operator', areas: 'Compost Plant - Itahari', status: 'active', createdAt: iso(daysAgo(65)) },
      { id: 'WK-207', name: 'Rojina Maharjan', phone: '9807070707', role: 'driver', areas: 'Farm Deliveries', status: 'active', createdAt: iso(daysAgo(50)) },
    ];

    const farms = [
      { id: 'FR-301', name: 'Sundar Krishi Farm', location: 'Itahari', contact: '9801111111', owner: 'Sundar Adhikari', compostReceived: 0 },
      { id: 'FR-302', name: 'Green Valley Vegetables', location: 'Itahari', contact: '9802222222', owner: 'Goma Tamang', compostReceived: 0 },
      { id: 'FR-303', name: 'Hilltop Organic Farm', location: 'Itahari', contact: '9803333333', owner: 'Dhan Bahadur Lama', compostReceived: 0 },
    ];

    const recyclingPartners = [
      { id: 'RP-401', name: 'Nepal Recyclers Pvt Ltd', material: 'Plastic / Paper / Metal', location: 'Itahari' },
      { id: 'RP-402', name: 'Himalayan Glass Works', material: 'Glass', location: 'Itahari' },
      { id: 'RP-403', name: 'GreenCycle E-waste', material: 'E-waste', location: 'Itahari' },
    ];

    const bookings = [
      { id: 'BK-5001', businessId: 'BZ-1001', wasteType: 'organic', quantityKg: 45, preferredDate: iso(daysAgo(2)), address: 'Itahari', status: 'collected', workerId: 'WK-201', createdAt: iso(daysAgo(3)) },
      { id: 'BK-5002', businessId: 'BZ-1002', wasteType: 'mixed', quantityKg: 22, preferredDate: iso(daysAgo(1)), address: 'Itahari', status: 'collected', workerId: 'WK-202', createdAt: iso(daysAgo(2)) },
      { id: 'BK-5003', businessId: 'BZ-1003', wasteType: 'recyclable', quantityKg: 18, preferredDate: iso(hoursAgo(6)), address: 'Itahari', status: 'scheduled', workerId: 'WK-201', createdAt: iso(daysAgo(1)) },
      { id: 'BK-5004', businessId: 'BZ-1004', wasteType: 'organic', quantityKg: 30, preferredDate: iso(daysAgo(0)), address: 'Itahari', status: 'pending', workerId: null, createdAt: iso(hoursAgo(8)) },
      { id: 'BK-5005', businessId: 'BZ-1005', wasteType: 'mixed', quantityKg: 50, preferredDate: iso(daysAgo(0)), address: 'Itahari', status: 'pending', workerId: null, createdAt: iso(hoursAgo(4)) },
    ];

    // Central tracking entity, the BATCH
    // Each batch follows: Business -> Worker -> Collection -> Sorting -> Processing -> Farm
    const batches = [
      {
        id: 'WM-2026-004279',
        businessId: 'BZ-1001',
        workerId: 'WK-201',
        bookingId: 'BK-5001',
        wasteType: 'organic',
        weightKg: 45,
        status: 'delivered',
        timeline: [
          { stage: 'collection', status: 'done', at: iso(hoursAgo(48)), workerId: 'WK-201', note: 'Collected from kitchen dock - 45kg organic' },
          { stage: 'sorting', status: 'done', at: iso(hoursAgo(40)), workerId: 'WK-204', note: 'Sorted: 42kg organic, 3kg recyclable packaging' },
          { stage: 'composting', status: 'done', at: iso(hoursAgo(30)), workerId: 'WK-206', note: 'Loaded into windrow #3, 14-day cycle' },
          { stage: 'farm_delivery', status: 'done', at: iso(hoursAgo(2)), workerId: 'WK-207', note: '28kg matured compost delivered to FR-301' },
        ],
        notifications: [
          { stage: 'collection', status: 'sent', at: iso(hoursAgo(48)) },
          { stage: 'farm_delivery', status: 'sent', at: iso(hoursAgo(2)) },
        ],
        farmId: 'FR-301',
        deliveredKg: 28,
        createdAt: iso(hoursAgo(48)),
      },
      {
        id: 'WM-2026-004280',
        businessId: 'BZ-1002',
        workerId: 'WK-202',
        bookingId: 'BK-5002',
        wasteType: 'mixed',
        weightKg: 22,
        status: 'composting',
        timeline: [
          { stage: 'collection', status: 'done', at: iso(hoursAgo(28)), workerId: 'WK-202', note: 'Collected 22kg mixed waste' },
          { stage: 'sorting', status: 'done', at: iso(hoursAgo(22)), workerId: 'WK-205', note: 'Sorted: 14kg organic + 8kg recyclables' },
          { stage: 'composting', status: 'in_progress', at: iso(hoursAgo(18)), workerId: 'WK-206', note: '14kg organic in windrow #5' },
        ],
        notifications: [
          { stage: 'collection', status: 'sent', at: iso(hoursAgo(28)) },
          { stage: 'sorting', status: 'sent', at: iso(hoursAgo(22)) },
        ],
        farmId: null,
        deliveredKg: 0,
        createdAt: iso(hoursAgo(28)),
      },
      {
        id: 'WM-2026-004281',
        businessId: 'BZ-1003',
        workerId: 'WK-201',
        bookingId: 'BK-5003',
        wasteType: 'recyclable',
        weightKg: 18,
        status: 'sorting',
        timeline: [
          { stage: 'collection', status: 'done', at: iso(hoursAgo(5)), workerId: 'WK-201', note: 'Collected 18kg recyclable waste' },
          { stage: 'sorting', status: 'in_progress', at: iso(hoursAgo(1)), workerId: 'WK-204', note: 'Segregating plastic, glass, paper' },
        ],
        notifications: [
          { stage: 'collection', status: 'sent', at: iso(hoursAgo(5)) },
        ],
        farmId: null,
        deliveredKg: 0,
        createdAt: iso(hoursAgo(5)),
      },
      {
        id: 'WM-2026-004282',
        businessId: 'BZ-1005',
        workerId: 'WK-201',
        bookingId: 'BK-5005',
        wasteType: 'mixed',
        weightKg: 50,
        status: 'collected',
        timeline: [
          { stage: 'collection', status: 'done', at: iso(hoursAgo(2)), workerId: 'WK-201', note: 'Collected 50kg mixed waste' },
        ],
        notifications: [
          { stage: 'collection', status: 'sent', at: iso(hoursAgo(2)) },
        ],
        farmId: null,
        deliveredKg: 0,
        createdAt: iso(hoursAgo(2)),
      },
    ];

    // Update farm compost received
    farms[0].compostReceived = 28;

    return {
      businesses,
      workers,
      farms,
      recyclingPartners,
      bookings,
      batches,
      meta: { seq: 4282, createdAt: new Date().toISOString() },
    };
  }

  /* ---------- Persistence ---------- */
  let cache = null;

  function load() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        cache = JSON.parse(raw);
        return cache;
      }
    } catch (e) {
      console.warn('WMS: failed to read store, reseeding.', e);
    }
    cache = seed();
    save();
    return cache;
  }

  function save() {
    if (!cache) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.error('WMS: save failed', e);
    }
  }

  function reset() {
    cache = seed();
    save();
    return cache;
  }

  /* ---------- ID generation ---------- */
  function nextBatchId() {
    const d = load();
    d.meta.seq = (d.meta.seq || 4280) + 1;
    const year = new Date().getFullYear();
    const id = `WM-${year}-${String(d.meta.seq).padStart(6, '0')}`;
    save();
    return id;
  }

  function nextId(prefix, collection) {
    const d = load();
    const nums = (d[collection] || [])
      .map(x => parseInt(String(x.id).replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 1000) + 1;
    return `${prefix}-${next}`;
  }

  /* ---------- Generic CRUD ---------- */
  const db = {
    reset,
    raw: load,

    /* businesses */
    businesses: {
      all: () => load().businesses,
      get: (id) => load().businesses.find(b => b.id === id) || null,
      add: (obj) => {
        const d = load();
        const item = { ...obj, id: obj.id || nextId('BZ', 'businesses'), createdAt: new Date().toISOString() };
        d.businesses.push(item); save();
        return item;
      },
      update: (id, patch) => {
        const d = load();
        const i = d.businesses.findIndex(b => b.id === id);
        if (i < 0) return null;
        d.businesses[i] = { ...d.businesses[i], ...patch }; save();
        return d.businesses[i];
      },
      remove: (id) => {
        const d = load();
        d.businesses = d.businesses.filter(b => b.id !== id); save();
      },
    },

    /* workers */
    workers: {
      all: () => load().workers,
      get: (id) => load().workers.find(w => w.id === id) || null,
      add: (obj) => {
        const d = load();
        const item = { ...obj, id: obj.id || nextId('WK', 'workers'), createdAt: new Date().toISOString(), status: obj.status || 'active' };
        d.workers.push(item); save();
        return item;
      },
      update: (id, patch) => {
        const d = load();
        const i = d.workers.findIndex(w => w.id === id);
        if (i < 0) return null;
        d.workers[i] = { ...d.workers[i], ...patch }; save();
        return d.workers[i];
      },
      remove: (id) => {
        const d = load();
        d.workers = d.workers.filter(w => w.id !== id); save();
      },
    },

    /* farms */
    farms: {
      all: () => load().farms,
      get: (id) => load().farms.find(f => f.id === id) || null,
      add: (obj) => {
        const d = load();
        const item = { ...obj, id: obj.id || nextId('FR', 'farms'), compostReceived: 0 };
        d.farms.push(item); save();
        return item;
      },
      update: (id, patch) => {
        const d = load();
        const i = d.farms.findIndex(f => f.id === id);
        if (i < 0) return null;
        d.farms[i] = { ...d.farms[i], ...patch }; save();
        return d.farms[i];
      },
      remove: (id) => {
        const d = load();
        d.farms = d.farms.filter(f => f.id !== id); save();
      },
    },

    recyclingPartners: {
      all: () => load().recyclingPartners,
      get: (id) => load().recyclingPartners.find(r => r.id === id) || null,
    },

    /* bookings */
    bookings: {
      all: () => load().bookings,
      get: (id) => load().bookings.find(b => b.id === id) || null,
      byBusiness: (bid) => load().bookings.filter(b => b.businessId === bid),
      add: (obj) => {
        const d = load();
        const item = {
          ...obj,
          id: obj.id || nextId('BK', 'bookings'),
          status: obj.status || 'pending',
          workerId: obj.workerId || null,
          createdAt: new Date().toISOString(),
        };
        d.bookings.push(item); save();
        return item;
      },
      update: (id, patch) => {
        const d = load();
        const i = d.bookings.findIndex(b => b.id === id);
        if (i < 0) return null;
        d.bookings[i] = { ...d.bookings[i], ...patch }; save();
        return d.bookings[i];
      },
      remove: (id) => {
        const d = load();
        d.bookings = d.bookings.filter(b => b.id !== id); save();
      },
    },

    /* batches, central tracking entity */
    batches: {
      all: () => load().batches,
      get: (id) => load().batches.find(b => b.id === id) || null,
      byBusiness: (bid) => load().batches.filter(b => b.businessId === bid),
      byWorker: (wid) => load().batches.filter(b => b.workerId === wid),
      add: (obj) => {
        const d = load();
        const item = {
          ...obj,
          id: obj.id || nextBatchId(),
          status: obj.status || 'collected',
          timeline: obj.timeline || [],
          notifications: obj.notifications || [],
          farmId: obj.farmId || null,
          deliveredKg: obj.deliveredKg || 0,
          createdAt: new Date().toISOString(),
        };
        d.batches.push(item); save();
        return item;
      },
      update: (id, patch) => {
        const d = load();
        const i = d.batches.findIndex(b => b.id === id);
        if (i < 0) return null;
        d.batches[i] = { ...d.batches[i], ...patch }; save();
        return d.batches[i];
      },
      remove: (id) => {
        const d = load();
        d.batches = d.batches.filter(b => b.id !== id); save();
      },
      // Append a stage event to a batch timeline
      pushStage: (id, stageEvent) => {
        const d = load();
        const i = d.batches.findIndex(b => b.id === id);
        if (i < 0) return null;
        d.batches[i].timeline.push({ ...stageEvent, at: stageEvent.at || new Date().toISOString() });
        save();
        return d.batches[i];
      },
      // Upsert a notification for a stage
      setNotification: (id, stage, status) => {
        const d = load();
        const i = d.batches.findIndex(b => b.id === id);
        if (i < 0) return null;
        const arr = d.batches[i].notifications || [];
        const j = arr.findIndex(n => n.stage === stage);
        const entry = { stage, status, at: new Date().toISOString() };
        if (j < 0) arr.push(entry); else arr[j] = { ...arr[j], ...entry };
        d.batches[i].notifications = arr; save();
        return d.batches[i];
      },
    },
  };

  /* ---------- Session (staff/worker login) ---------- */
  const session = {
    get() {
      try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
      catch { return null; }
    },
    set(user) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); },
    clear() { sessionStorage.removeItem(SESSION_KEY); },
  };

  /* ---------- Expose ---------- */
  global.WMS = { db, session, nextBatchId, reset: () => { reset(); } };
})(window);
