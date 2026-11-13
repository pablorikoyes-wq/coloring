/* Bo'yash — мини-приложение раскраски по номерам. Без библиотек. */
(() => {
  'use strict';

  const tg = window.Telegram && window.Telegram.WebApp;
  const qs = new URLSearchParams(location.search);
  const API = (qs.get('api') || '').replace(/\/$/, '');
  const INIT = (tg && tg.initData) || qs.get('init') || '';
  const USER = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || { id: 0, first_name: '' };
  const PIC_VERSION = '1';

  // ---------------------------------------------------------------- тексты (узбекский)
  const T = {
    pictures: 'Rasmlar', profile: 'Profil',
    all: 'Hammasi',
    themes: { meva: 'Taomlar', hayvon: 'Hayvonlar', buyum: 'Buyumlar', tabiat: 'Tabiat', dino: 'Dinozavrlar', uzbek: "O'zbekiston" },
    nothing: "Bu yerda hozircha rasm yo'q",
    congrats: 'Tabriklaymiz!',
    forPic: (n) => `«${n}» rasmi uchun`,
    already: "Bu rasm uchun pul avval berilgan",
    limit: "Bu rasm uchun pul berilmadi: limit tugadi",
    great: 'Ajoyib!',
    resetQ: "Rasmni qaytadan boshlaysizmi?",
    resetSub: "Barcha ranglar o'chiriladi",
    yes: 'Ha', no: "Yo'q",
    earned: 'Ishlagan pulim', colored: "Bo'yalgan rasmlar",
    nextRank: (name, left) => `Keyingi unvon: ${name} — yana ${left} ta rasm`,
    maxRank: 'Eng yuqori unvon!',
    untilPayout: 'Pul yechishgacha',
    days: 'kun',
    payoutOpen: 'Pul yechish ochiq',
    withdraw: 'Pulni yechish',
    opensOn: 'Pul yechish 15-dekabrda ochiladi',
    requestSent: "So'rov yuborildi",
    paid: "Pul to'landi",
    noMoney: "Hozircha yechiladigan pul yo'q",
    takeOut: 'Yechish',
    chooseCard: 'Karta turini tanlang',
    cardNumber: 'Karta raqami',
    badCard: "Karta raqami noto'g'ri",
    cardSaved: 'Karta saqlandi',
    sentSub: "Pul tez orada kartangizga o'tkaziladi",
    ok: 'Yaxshi',
    balance: 'Balans',
    myPics: 'Mening rasmlarim',
    noPics: "Hali bo'yalgan rasm yo'q. Birinchi rasmni bo'yang!",
    sendTg: 'Telegramga yuborish',
    sentTg: 'Yuborildi! Telegramni tekshiring',
    subTitle: "Kanallarga obuna bo'ling",
    subText: "Davom etish uchun kanallarga obuna bo'ling",
    check: 'Tekshirish',
    notYet: "Hali hamma kanallarga obuna bo'lmadingiz",
    netErr: 'Internet bilan muammo',
    netErrSub: "Internetni tekshirib, qayta urinib ko'ring",
    retry: 'Qayta urinish',
    openBot: 'Ilovani bot orqali oching',
    openBotSub: "Telegramdagi botga kirib, «O'ynash» tugmasini bosing",
    blocked: 'Kirish yopiq',
    saving: 'Saqlanmoqda…',
    done: "Bo'yalgan",
    som: "so'm",
  };

  // ---------------------------------------------------------------- свои иконки (без эмодзи)
  const ICONS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    zoomIn: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6M11 8v6M8 11h6"/>',
    zoomOut: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6M8 11h6"/>',
    fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>',
    send: '<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 6-3 8-3 8h18s-3-2-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    alert: '<path d="M12 8v5M12 16.5v.5"/><path d="M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    medal: '<path d="M8 3h8l-2.2 6h-3.6z"/><circle cx="12" cy="15" r="6"/><path d="M12 12.2l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2-1.45-1.4 2-.3z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5.5a2.5 2.5 0 0 0 2.8 4M16 6h2.5a2.5 2.5 0 0 1-2.8 4M12 13v4M8.5 21h7M10 17h4v4h-4z"/>',
    wallet: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v3"/><rect x="3" y="7.5" width="18" height="12" rx="3"/><path d="M16.5 13.5h1.5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    palette: '<path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2s-.8-1.6-.8-2.5c0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    apple: '<path d="M12 7.5c-1.8-1.6-6-1.4-6.6 3.2C4.9 15 7.8 20.4 12 19.2c4.2 1.2 7.1-4.2 6.6-8.5C18 6.1 13.8 5.9 12 7.5z"/><path d="M12 7.5c0-2 1-3.6 3-4.5"/>',
    paw: '<path d="M12 13c-3 0-5.2 3-5.2 4.8C6.8 19.6 8.6 20.2 12 19.4c3.4.8 5.2.2 5.2-1.6S15 13 12 13z"/><circle cx="6" cy="10" r="1.7"/><circle cx="9.5" cy="6.2" r="1.7"/><circle cx="14.5" cy="6.2" r="1.7"/><circle cx="18" cy="10" r="1.7"/>',
    box: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5L12 12l8-4.5M12 12v9"/>',
    tree: '<path d="M3 20l6-11 4 6.5 2.5-3.5L21 20z"/><circle cx="17" cy="6" r="2"/>',
    dino: '<path d="M4 18c0-4 2-7 6-7h3c1 0 1.5-1 1.5-2V6.5C14.5 5 15.5 4 17 4h1.5a1.5 1.5 0 0 1 0 3H17v3c0 4-1.5 8-6 8"/><path d="M7 18v2.5M11 18v2.5M4 18l-1.5 1"/>',
    dome: '<path d="M4 20h16M6 20v-6h12v6"/><path d="M12 5c-3 1.5-5 3.5-5 9h10c0-5.5-2-7.5-5-9z"/><path d="M12 3v2M10.5 20v-3a1.5 1.5 0 0 1 3 0v3"/>',
  };
  const STAR = '<svg class="i" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z"/></svg>';
  const icon = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  const THEME_ICON = { meva: 'apple', hayvon: 'paw', buyum: 'box', tabiat: 'tree', dino: 'dino', uzbek: 'dome' };

  // ---------------------------------------------------------------- утилиты
  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app');
  const money = (n) => `${Math.round(n || 0).toLocaleString('ru-RU').replace(/ |,/g, ' ')} ${T.som}`;
  const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const stars = (n) => `<span class="stars-s">${[1, 2, 3].map((i) => STAR.replace('class="i"', `class="i${i > n ? ' off' : ''}"`)).join('')}</span>`;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* нет места — не страшно */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
  };
  const haptic = (kind) => {
    try {
      if (!tg || !tg.HapticFeedback) return;
      if (kind === 'ok') tg.HapticFeedback.impactOccurred('light');
      else if (kind === 'err') tg.HapticFeedback.notificationOccurred('error');
      else if (kind === 'win') tg.HapticFeedback.notificationOccurred('success');
    } catch (e) { /* ignore */ }
  };
  let toastTimer;
  function toast(text) {
    const el = $('#toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  async function api(path, data = {}, { timeout = 15000, retries = 1, keepalive = false } = {}) {
    for (let attempt = 0; ; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeout);
      try {
        const r = await fetch(`${API}/api/${path}`, {
          method: 'POST', signal: ctrl.signal, keepalive,
          headers: { 'Content-Type': 'application/json', 'X-Init-Data': INIT },
          body: JSON.stringify(data),
        });
        clearTimeout(timer);
        let j = {};
        try { j = await r.json(); } catch (e) { /* пустой ответ */ }
        if (!r.ok) { const err = new Error(j.error || 'http'); err.code = j.error || 'http'; err.status = r.status; err.data = j; throw err; }
        return j;
      } catch (e) {
        clearTimeout(timer);
        if (e.status && e.status < 500) throw e;            // ошибки «по делу» не повторяем
        if (attempt >= retries) { e.code = e.code || 'network'; throw e; }
        await new Promise((res) => setTimeout(res, 800 * (attempt + 1)));
      }
    }
  }

  // ---------------------------------------------------------------- картинки (SVG с ключом ответов)
  const picCache = new Map();
  async function loadPic(slug) {
    if (picCache.has(slug)) return picCache.get(slug);
    const p = (async () => {
      const r = await fetch(`pictures/${slug}.svg?v=${PIC_VERSION}`);
      if (!r.ok) throw new Error('pic');
      const text = await r.text();
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      const meta = JSON.parse(doc.querySelector('metadata').textContent);
      const items = [...doc.querySelectorAll('#regions path')].map((el) => (el.dataset.fixed
        ? { fixed: true, d: el.getAttribute('d'), fill: el.dataset.fixed }
        : { id: el.id, d: el.getAttribute('d'), n: +el.dataset.n, fill: el.dataset.fill,
          lx: +el.dataset.lx, ly: +el.dataset.ly, fs: +el.dataset.fs }));
      return { slug, meta, items, regions: items.filter((r) => !r.fixed), palette: meta.palette };
    })();
    picCache.set(slug, p);
    p.catch(() => picCache.delete(slug));
    return p;
  }

  function picSvg(pic, colors, { size = 300, stroke = 2.6, bg = '#FFFFFF' } = {}) {
    const paths = pic.items.map((r) => {
      const c = (r.fixed || colors === true) ? r.fill : (colors && colors[r.id] ? r.fill : '#FFFFFF');
      return `<path d="${r.d}" fill="${c}"/>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="${size}" height="${size}">` +
      `<rect width="600" height="600" fill="${bg}"/><g stroke="#2A2838" stroke-width="${stroke}" stroke-linejoin="round">${paths}</g></svg>`;
  }
  const thumbUrls = new Map();
  function thumbUrl(pic, colors, key) {
    const k = `${pic.slug}|${key}`;
    if (thumbUrls.has(k)) return thumbUrls.get(k);
    const url = URL.createObjectURL(new Blob([picSvg(pic, colors, { stroke: 3.2, bg: '#FAFAFD' })], { type: 'image/svg+xml' }));
    thumbUrls.set(k, url);
    return url;
  }
  function renderPng(pic, size = 1080) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(new Blob([picSvg(pic, true, { size, stroke: 2.4 })], { type: 'image/svg+xml' }));
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = c.height = size;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          resolve(c.toDataURL('image/png'));
        } catch (e) { resolve(null); }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  // ---------------------------------------------------------------- состояние
  const S = {
    data: null, offset: 0, tab: 'home', theme: 'all', diff: 0,
    stack: [], // открытые слои (редактор, окна) — для кнопки «назад»
  };
  const localKey = (slug) => `c:${USER.id}:${slug}`;

  async function loadState() {
    const j = await api('state', {}, { retries: 2 });
    S.data = j;
    S.offset = j.server_time - Date.now();
    // локальный кеш прогресса: если что-то не успело уйти на сервер — добавим
    for (const p of j.pictures) {
      if (p.status === 'done') { store.del(localKey(p.slug)); continue; }
      const loc = store.get(localKey(p.slug));
      if (loc && Object.keys(loc).length) p.localColors = loc;
    }
    return true;
  }

  // ---------------------------------------------------------------- навигация (кнопка «назад» Telegram)
  function pushLayer(close) {
    S.stack.push(close);
    if (tg && tg.BackButton) tg.BackButton.show();
  }
  function popLayer() {
    S.stack.pop();
    if (!S.stack.length && tg && tg.BackButton) tg.BackButton.hide();
  }
  function goBack() {
    const close = S.stack[S.stack.length - 1];
    if (close) close();
  }

  // ---------------------------------------------------------------- главный экран
  function renderShell() {
    if (S.tab === 'home') renderHome(); else renderProfile();
  }

  function tabsHtml() {
    return `<nav class="tabs">
      <button class="tab ${S.tab === 'home' ? 'on' : ''}" data-tab="home" aria-label="${T.pictures}">${icon('grid')}</button>
      <button class="tab ${S.tab === 'profile' ? 'on' : ''}" data-tab="profile" aria-label="${T.profile}">${icon('user')}</button>
    </nav>`;
  }
  function bindTabs() {
    app.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
      if (S.tab === b.dataset.tab) return;
      S.tab = b.dataset.tab;
      clearInterval(timerInt);
      renderShell();
      window.scrollTo(0, 0);
    }));
  }

  function renderHome() {
    const d = S.data;
    const themes = ['all', ...Object.keys(T.themes).filter((t) => d.pictures.some((p) => p.theme === t))];
    app.innerHTML = `<div class="screen">
      <div class="top">
        <div class="logo"><span class="badge">${icon('palette')}</span>Bo'yash</div>
        <button class="chip-money" data-tab="profile">${money(d.player.earned)}</button>
      </div>
      <div class="filters">${themes.map((t) => `<button class="f ${S.theme === t ? 'on' : ''}" data-theme="${t}">
        ${t === 'all' ? icon('sparkle') : icon(THEME_ICON[t])}${t === 'all' ? T.all : T.themes[t]}</button>`).join('')}</div>
      <div class="filters">
        <button class="f ${S.diff === 0 ? 'on' : ''}" data-diff="0">${T.all}</button>
        ${[1, 2, 3].map((n) => `<button class="f stars ${S.diff === n ? 'on' : ''}" data-diff="${n}">${STAR.repeat(n)}</button>`).join('')}
      </div>
      <div class="grid" id="grid"></div>
    </div>${tabsHtml()}`;
    app.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => { S.theme = b.dataset.theme; renderHome(); }));
    app.querySelectorAll('[data-diff]').forEach((b) => b.addEventListener('click', () => { S.diff = +b.dataset.diff; renderHome(); }));
    bindTabs();
    const list = d.pictures.filter((p) => (S.theme === 'all' || p.theme === S.theme) && (!S.diff || p.stars === S.diff));
    const grid = $('#grid');
    if (!list.length) { grid.outerHTML = `<div class="empty">${T.nothing}</div>`; return; }
    grid.innerHTML = list.map((p) => `<button class="card ${p.status === 'done' ? 'is-done' : ''}" data-slug="${p.slug}">
      <div class="thumb"><img alt="" data-thumb="${p.slug}">
        ${p.status === 'done' ? `<span class="done-badge">${icon('check')}</span>` : ''}
        ${p.status === 'started' ? `<span class="bar"><i style="width:${p.percent}%"></i></span>` : ''}
      </div>
      <div class="meta"><div class="name">${esc(p.name)}</div>
        <div class="row2"><span class="price">${money(p.price)}</span>${stars(p.stars)}</div>
      </div></button>`).join('');
    grid.querySelectorAll('.card').forEach((c) => c.addEventListener('click', () => openEditor(c.dataset.slug)));
    // превью грузим только когда карточка видна
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const p = d.pictures.find((x) => x.slug === e.target.dataset.thumb);
        loadPic(p.slug).then((pic) => {
          const colors = p.status === 'done' ? true : { ...(p.colors || {}), ...(p.localColors || {}) };
          const key = p.status === 'done' ? 'done' : Object.keys(colors).length;
          e.target.src = thumbUrl(pic, colors, key);
        }).catch(() => {});
      });
    }, { rootMargin: '200px' });
    grid.querySelectorAll('img[data-thumb]').forEach((img) => io.observe(img));
  }

  // ---------------------------------------------------------------- профиль
  let timerInt;
  function fmtCountdown(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400);
    const pad = (x) => String(x).padStart(2, '0');
    return `${d} ${T.days} ${pad(Math.floor(s % 86400 / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;
  }

  function renderProfile() {
    const d = S.data;
    const pl = d.player;
    const r = pl.rank;
    const total = d.pictures.length;
    const pct = r.next_at ? Math.round((pl.completed - r.prev_at) * 100 / (r.next_at - r.prev_at)) : 100;
    const initial = (USER.first_name || 'B').trim().charAt(0).toUpperCase();
    app.innerHTML = `<div class="screen">
      <div class="p-head">
        <div class="avatar">${esc(initial)}</div>
        <div style="flex:1;min-width:0">
          <div class="p-name">${esc(USER.first_name || '')}</div>
          <span class="rank">${icon('medal')}${esc(r.name)}</span>
          <div class="rank-bar"><div class="track"><i style="width:${pct}%"></i></div>
            <small>${r.next_at ? T.nextRank(r.next_name, r.next_at - pl.completed) : T.maxRank}</small></div>
        </div>
      </div>
      <div class="tiles">
        <button class="tile tap" id="bal"><div class="ic" style="background:var(--gold-soft);color:#C98A00">${icon('wallet')}</div>
          <div class="big">${money(pl.earned)}</div><div class="lbl">${T.earned}</div>
          <div class="take">${T.takeOut}${icon('chev')}</div></button>
        <div class="tile"><div class="ic" style="background:var(--accent-soft);color:var(--accent)">${icon('image')}</div>
          <div class="big">${pl.completed} / ${total}</div><div class="lbl">${T.colored}</div></div>
      </div>
      <h2>${T.myPics}</h2>
      <div id="gal"></div>
    </div>${tabsHtml()}`;
    bindTabs();
    $('#bal').addEventListener('click', openWithdraw);
    renderGallery();
  }

  // ---------------------------------------------------------------- вывод денег (окно по нажатию на баланс)
  const CARDS = {
    humo: { name: 'HUMO', hint: '9860 0000 0000 0000', prefix: ['9860'] },
    uzcard: { name: 'UZCARD', hint: '8600 0000 0000 0000', prefix: ['8600', '5614'] },
  };
  const fmtCard = (digits) => digits.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

  function openWithdraw() {
    const el = document.createElement('div');
    el.className = 'gate wd';
    document.body.appendChild(el);
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true; clearInterval(timerInt); el.remove(); popLayer();
      if (S.tab === 'profile') renderProfile();
    };
    pushLayer(close);
    const pl = S.data.player;
    const w = S.data.withdraw;
    let type = pl.card_type || 'humo';
    let number = pl.card_number || '';

    const head = `<div class="wd-top"><button class="icon-btn" id="wdx">${icon('back')}</button><b>${T.withdraw}</b><span style="width:48px"></span></div>
      <div class="wd-bal"><div class="lbl">${T.balance}</div><div class="big">${money(pl.earned)}</div></div>`;

    const showTimer = () => {
      el.innerHTML = `${head}<div class="pay">
          <div class="lbl">${icon('clock')}${T.untilPayout}:</div>
          <div class="timer" id="cd">${fmtCountdown(S.data.payout_at - (Date.now() + S.offset))}</div>
          <div class="note">${T.opensOn}</div>
          <div class="card-saved">${icon('check')}${T.cardSaved}: ${CARDS[type].name} •••• ${number.slice(-4)}</div>
          <button class="btn" id="okb" style="margin-top:16px">${T.ok}</button></div>`;
      $('#wdx', el).addEventListener('click', close);
      $('#okb', el).addEventListener('click', close);
      clearInterval(timerInt);
      timerInt = setInterval(() => {
        const left = S.data.payout_at - (Date.now() + S.offset);
        const c = $('#cd', el);
        if (!c) { clearInterval(timerInt); return; }
        c.textContent = fmtCountdown(left);
        if (left <= 0) { clearInterval(timerInt); refresh().then(() => { S.data.withdraw.open = true; draw(); }); }
      }, 1000);
    };
    const showSent = () => {
      el.innerHTML = `${head}<div class="pay">
          <div class="hero" style="margin:0 auto 10px;background:var(--green-soft);color:var(--green)">${icon('check')}</div>
          <div class="sent-t">${T.requestSent}</div><div class="note">${T.sentSub}</div>
          <button class="btn" id="okb" style="margin-top:16px">${T.ok}</button></div>`;
      $('#wdx', el).addEventListener('click', close);
      $('#okb', el).addEventListener('click', close);
    };
    const draw = () => {
      if (S.data.withdraw.pending) { showSent(); return; }
      const nothing = pl.earned <= 0 || ((S.data.withdraw.open) && S.data.withdraw.available <= 0);
      el.innerHTML = `${head}
        <div class="pay" style="text-align:left">
          <div class="lbl" style="justify-content:flex-start">${T.chooseCard}</div>
          <div class="ctype">${Object.entries(CARDS).map(([k, c]) => `<button data-t="${k}" class="${k === type ? 'on' : ''} ${k}">${c.name}</button>`).join('')}</div>
          <div class="lbl" style="justify-content:flex-start;margin-top:16px">${T.cardNumber}</div>
          <input id="cnum" class="cnum" inputmode="numeric" autocomplete="off" maxlength="19" placeholder="${CARDS[type].hint}" value="${fmtCard(number)}">
          <button class="btn green" id="go" style="margin-top:18px" ${nothing ? 'disabled' : ''}>${icon('wallet')}${T.withdraw}</button>
          ${nothing ? `<div class="note" style="text-align:center">${T.noMoney}</div>` : ''}
        </div>`;
      $('#wdx', el).addEventListener('click', close);
      const inp = $('#cnum', el);
      inp.addEventListener('input', () => { inp.value = fmtCard(inp.value); number = inp.value.replace(/\D/g, ''); inp.classList.remove('bad'); });
      el.querySelectorAll('.ctype button').forEach((b) => b.addEventListener('click', () => {
        type = b.dataset.t; number = inp.value.replace(/\D/g, ''); draw(); haptic('ok');
      }));
      $('#go', el).addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const d = inp.value.replace(/\D/g, '');
        if (d.length !== 16 || !CARDS[type].prefix.some((p) => d.startsWith(p))) {
          inp.classList.add('bad'); haptic('err'); toast(T.badCard); return;
        }
        btn.disabled = true;
        try {
          const r = await api('card', { card_type: type, card_number: d });
          pl.card_type = type; pl.card_number = d; number = d;
          if (!r.open) { haptic('ok'); showTimer(); return; }
          const res = await api('withdraw');
          S.data.withdraw.pending = true; S.data.withdraw.last_amount = res.amount;
          haptic('win'); showSent();
        } catch (err) {
          btn.disabled = false;
          if (err.code === 'bad_card') { inp.classList.add('bad'); toast(T.badCard); }
          else if (err.code === 'too_early') showTimer();
          else if (err.code === 'nothing') toast(T.noMoney);
          else toast(T.netErr);
        }
      });
    };
    draw();
  }

  async function renderGallery() {
    const box = $('#gal');
    const done = S.data.pictures.filter((p) => p.status === 'done');
    if (!done.length) { box.innerHTML = `<div class="empty" style="padding:20px 0">${T.noPics}</div>`; return; }
    box.innerHTML = `<div class="gal">${done.map((p) => `<button data-slug="${p.slug}"><img alt="" data-g="${p.slug}"></button>`).join('')}</div>`;
    box.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => openViewer(b.dataset.slug)));
    for (const p of done) {
      loadPic(p.slug).then((pic) => { const img = box.querySelector(`[data-g="${p.slug}"]`); if (img) img.src = thumbUrl(pic, true, 'done'); }).catch(() => {});
    }
  }

  async function openViewer(slug) {
    const p = S.data.pictures.find((x) => x.slug === slug);
    const pic = await loadPic(slug);
    const m = modal(`<img class="big" src="${thumbUrl(pic, true, 'done')}" alt="">
      <h1 style="font-size:22px">${esc(p.name)}</h1>
      <div class="btns" style="margin-top:14px"><button class="btn" id="sendtg">${icon('send')}${T.sendTg}</button></div>`);
    const b = m.el.querySelector('#sendtg');
    b.addEventListener('click', async () => {
      b.disabled = true;
      try { await api('send', { slug }); haptic('win'); toast(T.sentTg); m.close(); } catch (e) { b.disabled = false; toast(T.netErr); }
    });
  }

  // ---------------------------------------------------------------- окна
  function modal(html, { onClose } = {}) {
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal">${html}</div>`;
    document.body.appendChild(bg);
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      bg.remove();
      popLayer();
      if (onClose) onClose();
    };
    bg.addEventListener('click', (e) => { if (e.target === bg) close(); });
    pushLayer(close);
    return { el: bg, close };
  }

  // ---------------------------------------------------------------- подписка / ошибки
  // экран подписки — появляется, только когда ребёнок открывает картинку
  function showGate(channels, onOk, onCancel) {
    const el = document.createElement('div');
    el.className = 'gate';
    document.body.appendChild(el);
    let closed = false;
    let passed = false;
    const close = () => { if (closed) return; closed = true; el.remove(); popLayer(); if (!passed && onCancel) onCancel(); };
    pushLayer(close);
    const draw = (list) => {
      el.innerHTML = `<div class="center">
        <div class="hero">${icon('bell')}</div>
        <h1>${T.subTitle}</h1><p>${T.subText}</p>
        <div class="ch-list">${list.map((c, i) => `<button class="ch" data-i="${i}">
          <span class="ic">${icon("send")}</span><span class="nm">${esc(c.title)}</span><span class="go">${icon('chev')}</span></button>`).join('')}</div>
        <button class="btn" id="chk">${icon('check')}${T.check}</button>
      </div>`;
      el.querySelectorAll('.ch').forEach((b) => b.addEventListener('click', () => {
        const link = list[+b.dataset.i].link;
        if (tg && tg.openTelegramLink && /^https:\/\/t\.me\//.test(link)) tg.openTelegramLink(link); else window.open(link, '_blank');
      }));
      el.querySelector('#chk').addEventListener('click', async (e) => {
        const b = e.currentTarget;
        b.disabled = true;
        try {
          const r = await api('check_sub');
          if (r.ok) { passed = true; close(); onOk(); } else { haptic('err'); toast(T.notYet); draw(r.channels && r.channels.length ? r.channels : list); }
        } catch (err) { toast(T.netErr); b.disabled = false; }
      });
    };
    draw(channels);
  }

  function renderMessage(kind) {
    const map = {
      network: [icon('alert'), T.netErr, T.netErrSub, true],
      auth: [icon('send'), T.openBot, T.openBotSub, false],
      blocked: [icon('lock'), T.blocked, '', false],
    };
    const [ic, title, sub, retry] = map[kind] || map.network;
    app.innerHTML = `<div class="center"><div class="hero">${ic}</div><h1>${title}</h1><p>${sub}</p>
      ${retry ? `<button class="btn" id="retry">${icon('reset')}${T.retry}</button>` : ''}</div>`;
    if (retry) $('#retry').addEventListener('click', start);
  }

  function handleFatal(e) {
    if (e.code === 'subscribe') return renderShell();
    if (e.code === 'auth') return renderMessage('auth');
    if (e.code === 'blocked') return renderMessage('blocked');
    renderMessage('network');
  }

  // ---------------------------------------------------------------- редактор
  let ED = null;

  async function openEditor(slug) {
    const p = S.data.pictures.find((x) => x.slug === slug);
    const root = document.createElement('div');
    root.className = 'ed';
    root.innerHTML = `<div class="center" style="min-height:100%"><div class="loader"></div></div>`;
    document.body.appendChild(root);
    document.body.style.overflow = 'hidden';
    let opened;
    let pic;
    try {
      [pic, opened] = await Promise.all([loadPic(slug), api('open', { slug }, { retries: 2 })]);
    } catch (e) {
      root.remove();
      document.body.style.overflow = '';
      if (['auth', 'blocked'].includes(e.code)) return handleFatal(e);
      toast(T.netErr);
      return;
    }
    const done = opened.done || p.status === 'done';
    const colors = {};
    const byId = new Map(pic.regions.map((r) => [r.id, r]));
    const merge = (src) => { for (const [k, v] of Object.entries(src || {})) { const r = byId.get(k); if (r && r.n === +v) colors[k] = r.n; } };
    if (done) pic.regions.forEach((r) => { colors[r.id] = r.n; });
    else { merge(opened.colors); merge(store.get(localKey(slug))); }

    ED = { slug, p, pic, root, colors, byId, done, sel: 0, recent: [], dirty: false, saveT: 0,
      active: performance.now(), visible: true, dtAcc: 0, finishing: false };
    pushLayer(closeEditor);
    buildEditor();
  }

  function editorDt() {
    if (!ED) return 0;
    const now = performance.now();
    if (ED.visible) ED.dtAcc += (now - ED.active) / 1000;
    ED.active = now;
    const dt = Math.min(ED.dtAcc, 300);
    ED.dtAcc = 0;
    return dt;
  }

  function buildEditor() {
    const { pic, colors, done, p, root } = ED;
    const counts = {};
    pic.regions.forEach((r) => { counts[r.n] = (counts[r.n] || 0) + 1; });
    ED.counts = counts;
    const paths = pic.items.map((r) => (r.fixed ? `<path d="${r.d}" style="fill:${r.fill}"/>`
      : `<path id="${r.id}" d="${r.d}" data-n="${r.n}"${colors[r.id] ? ` style="fill:${r.fill}"` : ''}/>`)).join('');
    const labels = pic.regions.map((r) => `<text x="${r.lx}" y="${r.ly}" font-size="${r.fs}" data-for="${r.id}" class="${colors[r.id] ? 'off' : ''}">${r.n}</text>`).join('');
    root.innerHTML = `
      <div class="ed-top">
        <button class="icon-btn" id="eback" aria-label="back">${icon('back')}</button>
        <div class="prog"><div class="t"><b>${esc(p.name)}</b><span class="price">${money(p.price)}</span></div>
          <div class="track"><i id="pbar"></i></div></div>
        ${done ? '' : `<button class="icon-btn" id="ereset" aria-label="reset">${icon('reset')}</button>`}
      </div>
      <div class="stage" id="stage">
        <svg class="art" id="art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <rect x="-3000" y="-3000" width="6600" height="6600" fill="#fff"/>
          <g class="rg">${paths}</g><g class="lb">${labels}</g>
        </svg>
        <div class="zoom">
          <button class="icon-btn" data-z="in">${icon('zoomIn')}</button>
          <button class="icon-btn" data-z="out">${icon('zoomOut')}</button>
          <button class="icon-btn" data-z="fit">${icon('fit')}</button>
        </div>
      </div>
      ${done ? `<div class="view-bar"><button class="btn" id="vsend">${icon('send')}${T.sendTg}</button></div>`
        : `<div class="pal-wrap"><div class="pal" id="pal"></div></div>`}`;
    $('#eback', root).addEventListener('click', goBack);
    if (!done) $('#ereset', root).addEventListener('click', askReset);
    else $('#vsend', root).addEventListener('click', async (e) => {
      const b = e.currentTarget; b.disabled = true;
      try { await api('send', { slug: ED.slug }); haptic('win'); toast(T.sentTg); } catch (err) { toast(T.netErr); }
      b.disabled = false;
    });
    setupZoom();
    if (!done) {
      renderPalette();
      selectColor(firstOpenColor());
    }
    updateProgress();
    // всё уже закрашено, но сервер не успел засчитать (например, не было интернета) — засчитываем
    if (!done && Object.keys(colors).length === pic.regions.length) setTimeout(finish, 300);
  }

  function firstOpenColor(after = 0) {
    const nums = ED.pic.palette.map((_, i) => i + 1);
    const open = nums.filter((n) => remaining(n) > 0);
    return open.find((n) => n > after) || open[0] || 0;
  }
  function remaining(n) {
    let c = 0;
    for (const r of ED.pic.regions) if (r.n === n && !ED.colors[r.id]) c++;
    return c;
  }

  function swHtml(n, small) {
    const col = ED.pic.palette[n - 1];
    const fin = remaining(n) === 0;
    const light = isLight(col);
    return `<button class="sw ${small ? 'small' : ''} ${ED.sel === n ? 'on' : ''} ${fin ? 'fin' : ''}" data-n="${n}"
      style="background:${col};color:${light ? '#2A2838' : '#fff'}"><span class="num">${n}</span>${fin ? icon('check') : ''}</button>`;
  }
  function isLight(hex) {
    const v = parseInt(hex.slice(1), 16);
    const r = v >> 16, g = (v >> 8) & 255, b = v & 255;
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  }

  function renderPalette() {
    const pal = $('#pal', ED.root);
    if (!pal) return;
    const scroll = pal.scrollLeft;
    const nums = ED.pic.palette.map((_, i) => i + 1);
    const rec = ED.recent.filter((n) => remaining(n) > 0 && n !== ED.sel).slice(0, 3);
    pal.innerHTML = (rec.length ? rec.map((n) => swHtml(n, true)).join('') + '<span class="sep"></span>' : '') +
      nums.map((n) => swHtml(n)).join('');
    pal.scrollLeft = scroll;
    pal.querySelectorAll('.sw').forEach((b) => b.addEventListener('click', () => {
      selectColor(+b.dataset.n);
      haptic('ok');
    }));
  }

  function selectColor(n) {
    if (!ED) return;
    if (ED.sel && ED.sel !== n) ED.recent = [ED.sel, ...ED.recent.filter((x) => x !== ED.sel)].slice(0, 6);
    ED.sel = n;
    const art = $('#art', ED.root);
    art.querySelectorAll('.rg path[data-n]').forEach((el) => {
      el.classList.toggle('hl', +el.dataset.n === n && !ED.colors[el.id]);
    });
    art.querySelectorAll('.lb text').forEach((el) => {
      const r = ED.byId.get(el.dataset.for);
      el.classList.toggle('hl', r.n === n);
    });
    renderPalette();
    const on = $(`#pal .sw.on:not(.small)`, ED.root);
    if (on) on.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  function tapRegion(el) {
    if (!ED || ED.done || ED.finishing) return;
    const r = ED.byId.get(el.id);
    if (!r || ED.colors[r.id]) return;
    if (!ED.sel) return;
    if (r.n !== ED.sel) {
      el.classList.remove('wrong');
      void el.getBoundingClientRect();
      el.classList.add('wrong');
      const sw = $(`#pal .sw.on:not(.small)`, ED.root);
      if (sw) { sw.classList.remove('shake'); void sw.offsetWidth; sw.classList.add('shake'); }
      haptic('err');
      return;
    }
    ED.colors[r.id] = r.n;
    el.classList.remove('hl');
    el.style.fill = r.fill;
    const lab = ED.root.querySelector(`.lb text[data-for="${r.id}"]`);
    if (lab) lab.classList.add('off');
    haptic('ok');
    store.set(localKey(ED.slug), ED.colors);
    ED.dirty = true;
    scheduleSave();
    updateProgress();
    if (remaining(r.n) === 0) {
      const next = firstOpenColor(r.n);
      if (next) selectColor(next); else renderPalette();
    }
    if (Object.keys(ED.colors).length === ED.pic.regions.length) finish();
  }

  function updateProgress() {
    const pct = Math.floor(Object.keys(ED.colors).length * 100 / ED.pic.regions.length);
    const bar = $('#pbar', ED.root);
    if (bar) bar.style.width = `${pct}%`;
    const t = $('.prog .t b', ED.root);
    if (t) t.textContent = `${ED.p.name} · ${pct}%`;
    ED.p.percent = pct;
  }

  function scheduleSave() {
    clearTimeout(ED.saveT);
    ED.saveT = setTimeout(() => saveNow(), 1500);
  }
  async function saveNow(keepalive = false) {
    if (!ED || !ED.dirty || ED.done) return;
    const ed = ED;
    ed.dirty = false;
    const colors = { ...ed.colors };
    try {
      await api('progress', { slug: ed.slug, colors, dt: editorDt() }, { keepalive, retries: 1 });
    } catch (e) {
      ed.dirty = true; // попробуем ещё раз при следующем изменении / выходе
      if (['auth', 'blocked'].includes(e.code)) { closeEditor(true); handleFatal(e); }
    }
  }

  function askReset() {
    const m = modal(`<div class="hero">${icon('reset')}</div><h1 style="font-size:22px">${T.resetQ}</h1><p>${T.resetSub}</p>
      <div class="btns" style="margin-top:16px"><button class="btn light" id="rn">${T.no}</button><button class="btn" id="ry">${T.yes}</button></div>`);
    m.el.querySelector('#rn').addEventListener('click', m.close);
    m.el.querySelector('#ry').addEventListener('click', async () => {
      m.close();
      try {
        await api('reset', { slug: ED.slug });
        Object.keys(ED.colors).forEach((k) => delete ED.colors[k]);
        store.del(localKey(ED.slug));
        ED.p.colors = null; ED.p.localColors = null; ED.p.status = 'new';
        ED.recent = []; ED.dirty = false;
        const keepVb = ED.vb;
        buildEditor();
        if (keepVb) { ED.vb = keepVb; applyVb(); }
      } catch (e) { toast(T.netErr); }
    });
  }

  function closeEditor(silent) {
    if (!ED) return;
    const ed = ED;
    clearTimeout(ed.saveT);
    if (ed.dirty) saveNow(true);
    if (!ed.done) {
      ed.p.localColors = { ...ed.colors };
      const n = Object.keys(ed.colors).length;
      if (ed.p.status !== 'done') ed.p.status = n ? 'started' : 'new';
    }
    ed.root.remove();
    document.body.style.overflow = '';
    ED = null;
    popLayer();
    if (silent !== true && S.data) renderShell();
  }

  // ---------------------------------------------------------------- зум и перемещение (через viewBox — всегда чётко)
  function setupZoom() {
    const stage = $('#stage', ED.root);
    const svg = $('#art', ED.root);
    const ed = ED;
    const size = () => stage.getBoundingClientRect();
    function fitVb() {
      const r = size();
      const asp = r.width / r.height;
      const m = 600 * 1.04;
      return asp >= 1 ? { w: m * asp, h: m, x: 300 - m * asp / 2, y: 300 - m / 2 }
        : { w: m, h: m / asp, x: 300 - m / 2, y: 300 - m / asp / 2 };
    }
    ed.fit = fitVb();
    ed.vb = { ...ed.fit };
    applyVb();
    const clamp = (vb) => {
      const minW = ed.fit.w / 10;
      if (vb.w < minW) { const k = minW / vb.w; vb.x -= (vb.w * k - vb.w) / 2; vb.y -= (vb.h * k - vb.h) / 2; vb.w *= k; vb.h *= k; }
      if (vb.w > ed.fit.w) return { ...ed.fit };
      const cx = Math.min(600, Math.max(0, vb.x + vb.w / 2));
      const cy = Math.min(600, Math.max(0, vb.y + vb.h / 2));
      vb.x = cx - vb.w / 2; vb.y = cy - vb.h / 2;
      return vb;
    };
    let raf = 0;
    const setVb = (vb) => { ed.vb = clamp(vb); if (!raf) raf = requestAnimationFrame(() => { raf = 0; applyVb(); }); };
    const toSvg = (px, py, vb = ed.vb) => { const r = size(); return { x: vb.x + (px - r.left) * vb.w / r.width, y: vb.y + (py - r.top) * vb.h / r.height }; };

    const pts = new Map();
    let g = null; // текущий жест
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.zoom')) return;
      stage.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) g = { moved: false, multi: false, sx: e.clientX, sy: e.clientY, vb0: { ...ed.vb }, target: e.target };
      else if (pts.size === 2) startPinch();
    });
    function startPinch() {
      const [a, b] = [...pts.values()];
      g.multi = true;
      g.d0 = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      g.vb0 = { ...ed.vb };
      g.m0 = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2, g.vb0);
    }
    stage.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId) || !g) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const r = size();
      if (pts.size >= 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const w = g.vb0.w * g.d0 / d;
        const h = g.vb0.h * g.d0 / d;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        setVb({ w, h, x: g.m0.x - (mx - r.left) * w / r.width, y: g.m0.y - (my - r.top) * h / r.height });
        g.moved = true;
      } else {
        const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
        if (!g.moved && Math.hypot(dx, dy) > 9) { g.moved = true; g.sx = e.clientX; g.sy = e.clientY; g.vb0 = { ...ed.vb }; return; }
        if (g.moved && !g.multi) setVb({ ...g.vb0, x: g.vb0.x - dx * g.vb0.w / r.width, y: g.vb0.y - dy * g.vb0.h / r.height });
      }
    });
    const end = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (!g) return;
      if (pts.size === 1 && g.multi) {
        // остался один палец после щипка — продолжаем двигать от него
        const [a] = [...pts.values()];
        g.sx = a.x; g.sy = a.y; g.vb0 = { ...ed.vb }; g.multi = false; g.moved = true;
        return;
      }
      if (pts.size === 0) {
        if (!g.moved && !g.multi && e.type === 'pointerup') {
          const el = document.elementFromPoint(e.clientX, e.clientY);
          if (el && el.tagName === 'path' && el.closest('.rg')) tapRegion(el);
        }
        g = null;
      }
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const k = Math.exp(e.deltaY * 0.0015);
      const p = toSvg(e.clientX, e.clientY);
      const vb = ed.vb;
      setVb({ w: vb.w * k, h: vb.h * k, x: p.x - (p.x - vb.x) * k, y: p.y - (p.y - vb.y) * k });
    }, { passive: false });

    const animate = (target) => {
      const from = { ...ed.vb };
      const t0 = performance.now();
      const step = (t) => {
        const q = Math.min(1, (t - t0) / 220);
        const e2 = 1 - Math.pow(1 - q, 3);
        ed.vb = { x: from.x + (target.x - from.x) * e2, y: from.y + (target.y - from.y) * e2,
          w: from.w + (target.w - from.w) * e2, h: from.h + (target.h - from.h) * e2 };
        applyVb();
        if (q < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    ED.root.querySelectorAll('[data-z]').forEach((b) => b.addEventListener('click', () => {
      const vb = ed.vb;
      const z = b.dataset.z;
      if (z === 'fit') { animate(ed.fit); return; }
      const k = z === 'in' ? 1 / 1.6 : 1.6;
      const cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2;
      animate(clamp({ w: vb.w * k, h: vb.h * k, x: cx - vb.w * k / 2, y: cy - vb.h * k / 2 }));
    }));
    const onResize = () => {
      if (!ED || ED !== ed) { window.removeEventListener('resize', onResize); return; }
      const zoomed = ed.vb.w < ed.fit.w * 0.99;
      ed.fit = fitVb();
      ed.vb = zoomed ? clamp({ ...ed.vb, h: ed.vb.w * ed.fit.h / ed.fit.w }) : { ...ed.fit };
      applyVb();
    };
    window.addEventListener('resize', onResize);
  }
  function applyVb() {
    if (!ED) return;
    const v = ED.vb;
    const svg = $('#art', ED.root);
    if (svg) svg.setAttribute('viewBox', `${v.x.toFixed(2)} ${v.y.toFixed(2)} ${v.w.toFixed(2)} ${v.h.toFixed(2)}`);
  }

  // ---------------------------------------------------------------- завершение картинки
  async function finish() {
    const ed = ED;
    ed.finishing = true;
    clearTimeout(ed.saveT);
    const png = await renderPng(ed.pic);
    let res;
    for (let i = 0; i < 3 && !res; i++) {
      try {
        res = await api('complete', { slug: ed.slug, colors: ed.colors, png, dt: editorDt() }, { timeout: 30000, retries: 1 });
      } catch (e) {
        if (e.code === 'subscribe') {
          // картинка готова, но нет подписки: просим подписаться, потом засчитываем
          ed.finishing = false;
          store.set(localKey(ed.slug), ed.colors);
          showGate((e.data && e.data.channels) || [], () => finish(), () => { if (ED === ed) closeEditor(); });
          return;
        }
        if (['auth', 'blocked'].includes(e.code)) { closeEditor(true); handleFatal(e); return; }
        if (e.code === 'not_finished') break;
        if (i === 2) {
          const m = modal(`<div class="hero">${icon('alert')}</div><h1 style="font-size:22px">${T.netErr}</h1><p>${T.netErrSub}</p>
            <div class="btns" style="margin-top:16px"><button class="btn" id="again">${icon('reset')}${T.retry}</button></div>`);
          m.el.querySelector('#again').addEventListener('click', () => { m.close(); finish(); });
          ed.finishing = false;
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    if (!res) { ed.finishing = false; return; }
    playWin();
    confetti();
    haptic('win');
    ed.done = true;
    ed.dirty = false;
    store.del(localKey(ed.slug));
    ed.p.status = 'done';
    ed.p.percent = 100;
    if (!res.already) {
      S.data.player.earned = res.earned != null ? res.earned : S.data.player.earned + res.amount;
      S.data.player.completed = res.completed != null ? res.completed : S.data.player.completed + 1;
    }
    const amountLine = res.already ? `<p>${T.already}</p>`
      : res.amount > 0 ? `<div class="plus">+${money(res.amount)}</div>`
        : `<p>${T.limit}</p>`;
    const m = modal(`<div class="hero trophy">${icon('trophy')}</div>
      <h1>${T.congrats}</h1><p>${T.forPic(esc(res.name || ed.p.name))}</p>${amountLine}
      <button class="btn" id="great">${T.great}</button>`, {
      onClose: () => { if (ED === ed) closeEditor(true); refresh().then(renderShell); },
    });
    m.el.querySelector('#great').addEventListener('click', m.close);
  }

  async function refresh() {
    try { await loadState(); } catch (e) { /* покажем то, что есть */ }
  }

  // ---------------------------------------------------------------- конфетти и звук
  function confetti() {
    const c = $('#confetti');
    const ctx = c.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ['#6C5CE7', '#FFB800', '#FF5A5F', '#1FBF73', '#4D96FF', '#FF8C42', '#A78BFA'];
    const parts = Array.from({ length: 160 }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .45,
      vx: (Math.random() - .5) * 14, vy: -Math.random() * 16 - 6,
      s: 6 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4,
      c: colors[(Math.random() * colors.length) | 0], round: Math.random() < .3,
    }));
    const t0 = performance.now();
    const step = (t) => {
      const age = t - t0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of parts) {
        p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - age / 2800);
        ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 7); ctx.fill(); } else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      if (age < 2900) requestAnimationFrame(step); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    requestAnimationFrame(step);
  }
  let actx;
  function playWin() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((f, i) => {
        const o = actx.createOscillator();
        const gn = actx.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        const t = actx.currentTime + i * .11;
        gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.22, t + .02); gn.gain.exponentialRampToValueAtTime(.001, t + .45);
        o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + .5);
      });
    } catch (e) { /* без звука */ }
  }

  // ---------------------------------------------------------------- запуск
  document.addEventListener('visibilitychange', () => {
    if (!ED) return;
    if (document.hidden) { editorDt(); ED.visible = false; if (ED.dirty) saveNow(true); }
    else { ED.visible = true; ED.active = performance.now(); }
  });

  async function start() {
    app.innerHTML = '<div class="center"><div class="loader"></div></div>';
    if (!API || !INIT) { renderMessage('auth'); return; }
    try {
      if (await loadState()) renderShell();
    } catch (e) { handleFatal(e); }
  }

  if (tg) {
    try {
      tg.ready(); tg.expand();
      if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
      if (tg.setHeaderColor) tg.setHeaderColor('#F5F4FA');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#F5F4FA');
      if (tg.BackButton) tg.BackButton.onClick(goBack);
    } catch (e) { /* старый Telegram */ }
  }
  start();
})();
