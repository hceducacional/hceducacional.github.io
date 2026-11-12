/* =========================================================
   HC Instituto Educacional — app
   ========================================================= */

/* ---------- Ícones (estilo Lucide) ---------- */
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  report: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 18v-2M12 18v-4M16 18v-6"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  up: '<path d="m15 18-6-6 6-6"/>',
  down: '<path d="m9 18 6-6-6-6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  news: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  focus: '<circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>',
  star: '<path d="M11.52 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.91l5.16-.75a2.12 2.12 0 0 0 1.6-1.16z"/>',
  grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c4.84 0 8.66 3.08 9.94 6.65a1 1 0 0 1 0 .7 10.75 10.75 0 0 1-1.44 2.49M14.08 14.16a3 3 0 0 1-4.24-4.24M17.48 17.5a10.75 10.75 0 0 1-15.42-5.15 1 1 0 0 1 0-.7 10.75 10.75 0 0 1 4.45-5.14M2 2l20 20"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
function paintIcons(root = document) {
  root.querySelectorAll('i[data-icon]').forEach((el) => { if (!el.firstChild) el.innerHTML = icon(el.dataset.icon); });
}

/* ---------- Armazenamento ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('favenihc:' + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('favenihc:' + key, JSON.stringify(value)); return true; }
    catch { toast('Sem espaço para salvar — tente imagens menores.'); return false; }
  },
};

const MAX_BANNERS = 5;
const SLIDE_MS = 10000;
const RECENT_MS = 16000; // tempo de cada notícia recente na tela inicial
const RECENT_AUTO = 5;   // quantas notícias recentes se abrem sozinhas, em sequência
const DEFAULT_BANNERS = [
  { id: 'b1', image: 'assets/banner-1.svg', pill: 'Notícias do Polo', title: 'Bem-vindo ao Semipresencial FAVENIHC', desc: 'Centralize chamadas, alunos e relatórios do seu polo em um só lugar.' },
  { id: 'b2', image: 'assets/banner-2.svg', pill: 'ConsultaEDU', title: 'Novas atividades regularmente', desc: 'Mantenha os links das disciplinas atualizados através do ConsultaEDU' },
];
/* Conteúdo publicado (content.js) tem prioridade sobre os exemplos embutidos */
const PUBLISHED = window.HC_CONTENT || {};
let banners = store.get('banners', PUBLISHED.banners || DEFAULT_BANNERS);
const saveBanners = () => { cleanupImages(); return store.set('banners', banners); };

/* Botões de acesso rápido (instituições) */
const MAX_LINKS = 12;
const DEFAULT_LINKS = [
  { id: 'l1', name: 'UNIFAVENI',   url: '', image: '', c1: '#34d6ae', c2: '#0e9f7e' },
  { id: 'l2', name: 'UNIABEU',     url: '', image: '', c1: '#0b7a9a', c2: '#070f3d' },
  { id: 'l3', name: 'UNISBA',      url: '', image: '', c1: '#0a3a96', c2: '#1d9bf0' },
  { id: 'l4', name: 'DOM ALBERTO', url: '', image: '', c1: '#f0163a', c2: '#8a0618' },
  { id: 'l5', name: 'FUTURA',      url: '', image: '', c1: '#08a8f5', c2: '#06237e' },
  { id: 'l6', name: 'EDUCA NEXUS', url: '', image: '', c1: '#ffe27a', c2: '#f5b51f' },
];
let links = store.get('links', PUBLISHED.links || DEFAULT_LINKS);
const saveLinks = () => { cleanupImages(); return store.set('links', links); };
const normalizeUrl = (u = '') => {
  u = u.trim(); if (!u) return '';
  return /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : 'https://' + u;
};
const isSafeUrl = (u) => /^(https?:|mailto:)/i.test(u);
/* Fundo do botão: imagem (com véu escuro p/ leitura) ou degradê das cores */
function linkBg(l) {
  return l.image
    ? `linear-gradient(135deg, rgba(4,10,24,.55), rgba(4,10,24,.25)), url('${esc(imgUrl(l.image))}') center/cover`
    : `radial-gradient(120% 140% at 15% 0%, rgba(255,255,255,.28), transparent 55%), linear-gradient(135deg, ${l.c1}, ${l.c2})`;
}
/* Cor do texto: escura em fundos claros (ex.: amarelo), branca nos demais */
function linkInk(l) {
  if (l.image) return '#fff';
  const lum = (hex) => {
    const n = parseInt((hex || '#000').slice(1), 16);
    return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255;
  };
  return (lum(l.c1) + lum(l.c2)) / 2 > 0.68 ? '#3b2a00' : '#fff';
}

let prefs = store.get('prefs', { hideSensitive: false });

/* Logo da barra lateral (lista de 1 item para usar o mesmo fluxo de imagens/exportação) */
let brandList = store.get('brand', PUBLISHED.brand || [{ id: 'logo', image: '' }]);
const saveBrand = () => { cleanupImages(); return store.set('brand', brandList); };
const LOGO_DEFAULT = '<span class="h">H</span><span class="c">C</span>';
function paintLogo() {
  const el = document.getElementById('sb-logo'); if (!el) return;
  const img = brandList[0]?.image;
  el.classList.toggle('has-img', !!img);
  el.innerHTML = img ? `<img src="${esc(imgUrl(img))}" alt="Logo">` : LOGO_DEFAULT;
}

/* ---------- Utilidades ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.innerHTML = `<span class="toast-icon">${icon('check')}</span>${esc(msg)}`; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* =========================================================
   IMAGENS (IndexedDB)
   As imagens enviadas ficam no IndexedDB do navegador, que comporta
   centenas de MB. Os itens guardam só uma referência "idb:<chave>".
   ========================================================= */
const IMG_MAX_W = { banner: 2560, news: 1920, link: 1000, logo: 512 }; // largura máxima por tipo
const IMG_QUALITY = 0.92;
const imgCache = new Map(); // referência -> URL temporária para exibir
const imgUrl = (ref = '') => imgCache.get(ref) || ref;
const pendingKeys = new Set(); // imagens recém-enviadas ainda não ligadas a um item

let imgDBPromise;
const imgDB = () => imgDBPromise || (imgDBPromise = new Promise((res, rej) => {
  const r = indexedDB.open('hc-imagens', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('imgs');
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
}));
async function idb(mode, fn) {
  const db = await imgDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('imgs', mode);
    const req = fn(tx.objectStore('imgs'));
    tx.oncomplete = () => res(req && req.result);
    tx.onerror = () => rej(tx.error);
  });
}
const idbGet = (k) => idb('readonly', (st) => st.get(k));
const idbPut = (k, v) => idb('readwrite', (st) => st.put(v, k));
const idbDel = (k) => idb('readwrite', (st) => st.delete(k));
const idbKeys = () => idb('readonly', (st) => st.getAllKeys());

/* Mantém o arquivo original quando ele já é leve e cabe no limite;
   senão reduz para a largura máxima em WebP de alta qualidade. */
function prepareImage(file, maxW) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const keep = ['image/jpeg', 'image/webp', 'image/png'].includes(file.type) && img.width <= maxW && file.size <= 1.5e6;
      if (keep) return resolve(file);
      const scale = Math.min(1, maxW / img.width);
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      const ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((webp) => {
        if (webp && webp.type === 'image/webp') return resolve(webp);
        c.toBlob((jpg) => (jpg ? resolve(jpg) : reject(new Error('falha ao converter imagem'))), 'image/jpeg', IMG_QUALITY);
      }, 'image/webp', IMG_QUALITY);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('arquivo de imagem inválido')); };
    img.src = url;
  });
}

async function storeImage(file, kind) {
  const blob = await prepareImage(file, IMG_MAX_W[kind] || 1920);
  const key = 'img-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  pendingKeys.add(key);
  setTimeout(() => pendingKeys.delete(key), 10000);
  await idbPut(key, blob);
  const ref = 'idb:' + key;
  imgCache.set(ref, URL.createObjectURL(blob));
  return ref;
}

const allImageRefs = () => [...banners, ...links, ...news, ...brandList].flatMap((x) => [x.image, ...(x.gallery || [])]).filter(Boolean);
async function loadImages() {
  for (const ref of allImageRefs()) {
    if (!ref.startsWith('idb:') || imgCache.has(ref)) continue;
    const blob = await idbGet(ref.slice(4));
    if (blob) imgCache.set(ref, URL.createObjectURL(blob));
  }
}
/* Apaga do IndexedDB as imagens que nenhum item usa mais */
let cleanupTimer;
function cleanupImages() {
  clearTimeout(cleanupTimer);
  cleanupTimer = setTimeout(async () => {
    try {
      const used = new Set(allImageRefs().filter((r) => r.startsWith('idb:')).map((r) => r.slice(4)));
      for (const k of await idbKeys()) {
        if (used.has(k) || pendingKeys.has(k)) continue;
        await idbDel(k);
        const ref = 'idb:' + k;
        if (imgCache.has(ref)) { URL.revokeObjectURL(imgCache.get(ref)); imgCache.delete(ref); }
      }
    } catch (e) { console.warn('Limpeza de imagens:', e); }
  }, 800);
}
/* Move imagens antigas (guardadas em texto/base64) para o IndexedDB e libera espaço */
async function migrateDataUrls() {
  for (const [list, save] of [[banners, saveBanners], [links, saveLinks], [news, saveNews], [brandList, saveBrand]]) {
    let changed = false;
    for (const it of list) {
      if (!it.image || !it.image.startsWith('data:')) continue;
      const blob = await (await fetch(it.image)).blob();
      const key = 'img-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      await idbPut(key, blob);
      it.image = 'idb:' + key;
      imgCache.set(it.image, URL.createObjectURL(blob));
      changed = true;
    }
    if (changed) save();
  }
}
/* Usado na publicação: devolve o conteúdo com as imagens em base64 */
async function exportContent() {
  const toDataUrl = (blob) => new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
  const one = async (ref) => {
    if (!ref || !ref.startsWith('idb:')) return ref;
    const blob = await idbGet(ref.slice(4));
    return blob ? await toDataUrl(blob) : '';
  };
  const conv = (list) => Promise.all(list.map(async (it) => {
    const out = { ...it, image: await one(it.image) };
    if (Array.isArray(it.gallery)) out.gallery = (await Promise.all(it.gallery.map(one))).filter(Boolean);
    return out;
  }));
  return { banners: await conv(banners), links: await conv(links), news: await conv(news), brand: await conv(brandList) };
}
window.HC_exportContent = exportContent;

/* =========================================================
   DASHBOARD
   ========================================================= */
let slideIndex = 0;

function renderDashboard(view) {
  view.innerHTML = `
  <div class="wrap">
    <section class="carousel" id="carousel" aria-roledescription="carrossel">
      ${banners.length ? `
        <div class="carousel-track" id="track">
          ${banners.map((b, i) => `
            <div class="slide" aria-roledescription="slide" aria-label="${i + 1} de ${banners.length}">
              <div class="slide-bg" style="background-image:url('${esc(imgUrl(b.image))}')"></div>
              <div class="slide-text">
                ${b.pill ? `<span class="pill">${esc(b.pill)}</span>` : ''}
                <h2>${esc(b.title)}</h2>
                <p>${esc(b.desc)}</p>
                ${bannerLink(b) ? `<a class="slide-cta" href="${esc(bannerLink(b))}" target="_blank" rel="noopener noreferrer">Acessar ${CHEV_SVG}</a>` : ''}
              </div>
            </div>`).join('')}
        </div>
        ${banners.length > 1 ? `
          <button class="car-arrow prev" data-dir="-1" aria-label="Banner anterior"><i data-icon="left"></i></button>
          <button class="car-arrow next" data-dir="1" aria-label="Próximo banner"><i data-icon="right"></i></button>` : ''}
      ` : `<div class="carousel-empty"><div><i data-icon="image"></i><strong>Nenhum banner cadastrado</strong><a href="#config">Adicionar banners em Configurações</a></div></div>`}
    </section>
    <div class="dots" id="dots">
      ${banners.length > 1 ? banners.map((_, i) => `<button class="dot" data-i="${i}" aria-label="Banner ${i + 1}"><span class="dot-fill"></span></button>`).join('') : ''}
    </div>

    ${links.length ? `<h2 class="shelf-title">Acesso rápido.<span> Portais das instituições parceiras, a um clique.</span></h2>` : ''}
    ${links.length ? `
    <nav class="quick-links" id="quick-links" aria-label="Acesso rápido">
      ${links.map((l, i) => `
        <a class="ql ${l.image ? 'has-img' : ''}" data-ql="${i}"
           ${isSafeUrl(normalizeUrl(l.url)) ? `href="${esc(normalizeUrl(l.url))}" target="_blank" rel="noopener noreferrer"` : 'href="#" data-empty="1"'}
           style="background:${linkBg(l)};color:${linkInk(l)}">
          <span class="ql-name">${esc(l.name)}</span>
          <span class="ql-go"><i data-icon="external"></i></span>
        </a>`).join('')}
    </nav>` : ''}

    ${recentNews().length ? `
    <section class="rn" aria-label="Notícias recentes">
      <h2 class="shelf-title">Notícias recentes.<span> Fique por dentro dos últimos acontecimentos.</span></h2>
      <div class="rn-row" id="rn-row">${recentNews().map(recentCard).join('')}</div>
      <div class="ap-paddles rn-paddles">
        <button class="ap-paddle" data-dir="-1" aria-label="Anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <button class="ap-paddle" data-dir="1" aria-label="Próximas">${CHEV_SVG}</button>
      </div>
    </section>` : ''}
  </div>`;

  paintIcons(view);
  initCarousel();
  initRecentNews();
  $('#quick-links')?.addEventListener('click', (e) => {
    const a = e.target.closest('[data-empty]'); if (!a) return;
    e.preventDefault();
    toast('Link ainda não configurado — defina em Configurações.');
  });
}

/* Cartão recolhido (só a imagem) que se abre ao passar o mouse */
function recentCard(n, i) {
  return `
  <article class="nc rn-card ${i === 0 ? 'on' : ''}" data-news="${n.id}" tabindex="0" role="button" aria-label="Abrir notícia: ${esc(n.title)}">
    <div class="nc-media rn-media"><img src="${esc(imgUrl(n.image))}" alt="" loading="lazy"${objPos(coverPos(n))}></div>
    <span class="rn-prog" aria-hidden="true"><span class="rn-prog-fill"></span></span>
    <div class="rn-text">
      ${eyebrow(n, 'light')}
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.excerpt)}</p>
    </div>
    <span class="rn-plus" aria-hidden="true">${PLUS_SVG}</span>
  </article>`;
}

function initRecentNews() {
  const row = $('#rn-row'); if (!row) return;
  const cards = [...row.children];
  const sec = row.closest('.rn');
  sec.style.setProperty('--rn-ms', RECENT_MS + 'ms');
  // só as primeiras RECENT_AUTO notícias se abrem sozinhas; as demais só ao passar o mouse
  const auto = cards.slice(0, RECENT_AUTO);
  cards.slice(RECENT_AUTO).forEach((c) => c.classList.add('manual'));
  let lastAuto = auto[0];
  const activate = (c) => {
    if (auto.includes(c)) lastAuto = c;
    if (!c.classList.contains('on')) cards.forEach((x) => x.classList.toggle('on', x === c));
  };
  // rola só a fileira (sem mexer na página) para o cartão ficar visível
  const reveal = (c) => {
    const left = c.offsetLeft - row.offsetLeft - 24;
    row.scrollTo({ left: c === cards[0] ? 0 : Math.max(0, left - row.clientWidth * 0.25), behavior: 'smooth' });
  };

  // troca automática: quando a barrinha do cartão aberto termina, abre o próximo (entre os primeiros)
  row.addEventListener('animationend', (e) => {
    if (!e.target.classList.contains('rn-prog-fill') || auto.length < 2) return;
    const cur = e.target.closest('.rn-card');
    const next = auto[(auto.indexOf(cur) + 1) % auto.length];
    activate(next);
    reveal(next);
  });
  // pausa enquanto o mouse está sobre as notícias
  row.addEventListener('mouseenter', () => sec.classList.add('paused'));
  row.addEventListener('mouseleave', () => {
    sec.classList.remove('paused');
    // saiu de uma notícia que não faz parte da troca automática: volta para a sequência
    const cur = cards.find((c) => c.classList.contains('on'));
    if (cur && !auto.includes(cur) && lastAuto) { activate(lastAuto); reveal(lastAuto); }
  });
  row.addEventListener('mouseover', (e) => { const c = e.target.closest('.rn-card'); if (c) activate(c); });
  row.addEventListener('focusin', (e) => { const c = e.target.closest('.rn-card'); if (c) activate(c); });
  row.addEventListener('click', (e) => {
    const c = e.target.closest('.rn-card'); if (!c) return;
    if (!c.classList.contains('on')) return activate(c); // no toque: 1º toque abre o cartão, o 2º abre a notícia
    openNews(news.find((n) => n.id === c.dataset.news), c);
  });
  row.addEventListener('keydown', (e) => {
    const c = e.target.closest('.rn-card');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); activate(c); openNews(news.find((n) => n.id === c.dataset.news), c); }
  });

  // setas
  const box = row.parentElement.querySelector('.rn-paddles');
  const paddles = box.querySelectorAll('.ap-paddle');
  const update = () => {
    paddles[0].disabled = row.scrollLeft <= 4;
    paddles[1].disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    box.hidden = row.scrollWidth <= row.clientWidth + 4;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ap-paddle'); if (!b) return;
    row.scrollBy({ left: row.clientWidth * 0.6 * +b.dataset.dir, behavior: 'smooth' });
  });
  row.addEventListener('scroll', update, { passive: true });
  row.addEventListener('transitionend', update);
  new ResizeObserver(update).observe(row);
  update();
}

/* Link do botão "Acessar" do banner (vazio se desativado ou inválido) */
function bannerLink(b) {
  if (!b.linkOn) return '';
  const u = normalizeUrl(b.url || '');
  return isSafeUrl(u) ? u : '';
}

/* Trilho em loop contínuo (banners e imagens das notícias).
   Há uma cópia do último item no início e do primeiro no fim: do último para o primeiro o trilho
   anda para a esquerda até a cópia e depois "salta" sem animação para o item verdadeiro. */
function loopTrack(track, onChange) {
  const slides = [...track.children];
  const n = slides.length;
  const all = [...slides];
  if (n > 1) {
    const mkClone = (el) => {
      const c = el.cloneNode(true);
      c.classList.add('clone'); c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('a, button').forEach((a) => a.setAttribute('tabindex', '-1'));
      return c;
    };
    const head = mkClone(slides[n - 1]), tail = mkClone(slides[0]);
    track.prepend(head); track.append(tail);
    all.unshift(head); all.push(tail);
  }
  const off = n > 1 ? 1 : 0;
  let index = 0, pending = null, snapTimer = 0;
  const setPos = (p) => { track.style.transform = `translateX(-${p * 100}%)`; };
  const activate = (el) => all.forEach((sl) => sl.classList.toggle('active', sl === el));
  const instant = (fn) => { track.classList.add('jump'); fn(); void track.offsetWidth; track.classList.remove('jump'); };
  const snap = () => {
    clearTimeout(snapTimer);
    if (pending === null) return;
    const p = pending; pending = null;
    instant(() => { setPos(p); activate(all[p]); });
  };
  track.addEventListener('transitionend', (e) => { if (e.target === track && e.propertyName === 'transform') snap(); });
  return {
    get index() { return index; },
    go(i, first = false) {
      snap();
      let p;
      if (i >= n) { index = 0; p = n + off; pending = off; }
      else if (i < 0) { index = n - 1; p = 0; pending = n - 1 + off; }
      else { index = i; p = i + off; }
      if (first) instant(() => setPos(p)); else setPos(p);
      activate(all[p]);
      if (pending !== null) snapTimer = setTimeout(snap, 1300); // garantia caso o transitionend não chegue
      onChange?.(index);
    },
  };
}

function initCarousel() {
  slideIndex = Math.min(slideIndex, Math.max(banners.length - 1, 0));
  const track = $('#track');
  if (!track) return;
  const car = $('#carousel');
  const slides = [...track.children];
  const dots = [...document.querySelectorAll('.dot')];
  document.documentElement.style.setProperty('--slide-ms', SLIDE_MS + 'ms');

  const loop = loopTrack(track, (i) => {
    slideIndex = i;
    dots.forEach((d, k) => {
      d.classList.remove('active');
      if (k === i) { void d.offsetWidth; d.classList.add('active'); } // reinicia a barra de progresso
    });
  });
  const go = (i, first) => loop.go(i, first);

  // O avanço automático acontece quando a barra de progresso do ponto ativo termina (pausa ao passar o mouse).
  $('#dots').addEventListener('animationend', (e) => {
    if (e.target.classList.contains('dot-fill')) go(slideIndex + 1);
  });
  $('#dots').addEventListener('click', (e) => {
    const b = e.target.closest('.dot'); if (b) go(+b.dataset.i);
  });
  car.addEventListener('click', (e) => {
    const b = e.target.closest('.car-arrow'); if (b) go(slideIndex + +b.dataset.dir);
  });
  car.addEventListener('mouseenter', () => car.parentElement.classList.add('paused'));
  car.addEventListener('mouseleave', () => car.parentElement.classList.remove('paused'));

  // deslizar no toque
  let x0 = null;
  car.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  car.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(slideIndex + (dx < 0 ? 1 : -1));
  });

  go(slideIndex, true);
}

/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */
function renderConfig(view) {
  view.innerHTML = `
  <div class="wrap">
    ${pageHead('Configurações', 'Personalize o seu polo.', 'Banners, atalhos, notícias e preferências, tudo em um só lugar.')}

    <div class="acc-list" id="acc-list">
      ${accSection('prefs', 'shield', 'Preferências', 'Exibição e privacidade dos dados', '', `
        <p class="desc">Ajustes de exibição aplicados neste navegador.</p>
        <div class="pref">
          <span class="pref-icon"><i data-icon="shield"></i></span>
          <div class="pref-text"><strong>Ocultar dados sensíveis</strong><span>CPF e telefone aparecem mascarados</span></div>
          <label class="switch"><input type="checkbox" id="pref-hide" ${prefs.hideSensitive ? 'checked' : ''}><span></span></label>
        </div>`)}
      ${accSection('brand', 'image', 'Logo do painel', 'Imagem exibida no topo da barra lateral', '', '<div id="brand-panel"></div>')}
      ${accSection('banners', 'image', 'Banners do Dashboard', 'Imagens e textos do carrossel da tela inicial', 'count-banners', '<div id="banners-panel"></div>')}
      ${accSection('links', 'link', 'Botões de Acesso Rápido', 'Atalhos para os sites das instituições', 'count-links', '<div id="links-panel"></div>')}
      <section class="panel acc" data-acc="news">
        <a class="acc-head acc-go" href="#config/noticias">
          <span class="acc-icon"><i data-icon="news"></i></span>
          <span class="acc-text"><strong>Notícias</strong><span>Publicações e notícias recentes da tela inicial</span></span>
          <span class="count-badge">${news.length}</span>
          <span class="acc-chev go"><i data-icon="right"></i></span>
        </a>
      </section>
    </div>
    <input type="file" id="file-add" accept="image/*" multiple hidden>
    <input type="file" id="file-replace" accept="image/*" hidden>
    <input type="file" id="file-link" accept="image/*" hidden>
    <input type="file" id="file-logo" accept="image/*" hidden>
  </div>`;
  paintIcons(view);
  initAccordion();

  $('#pref-hide').addEventListener('change', (e) => {
    prefs.hideSensitive = e.target.checked; store.set('prefs', prefs);
    toast('Preferência salva');
  });

  drawBannerPanel();
  initLinksPanel();
  initBrandPanel();

  const panel = $('#banners-panel');
  let replaceIdx = -1;

  panel.addEventListener('click', (e) => {
    const del = e.target.closest('[data-del]');
    const thumb = e.target.closest('[data-thumb]');
    const add = e.target.closest('#btn-add');
    if (del) {
      const i = +del.dataset.del;
      if (!confirm(`Remover o Banner ${i + 1}?`)) return;
      banners.splice(i, 1); saveBanners(); drawBannerPanel(); toast('Banner removido');
    } else if (thumb) {
      replaceIdx = +thumb.dataset.thumb; $('#file-replace').click();
    } else if (add) {
      $('#file-add').click();
    }
  });

  // edição de textos (salva automaticamente)
  panel.addEventListener('input', (e) => {
    const f = e.target.closest('[data-field]'); if (!f) return;
    const i = +f.dataset.i;
    if (f.type === 'checkbox') {
      banners[i][f.dataset.field] = f.checked;
      const box = f.closest('.bi-link');
      box.classList.toggle('on', f.checked);
      const url = box.querySelector('[data-field="url"]');
      if (f.checked) { url.removeAttribute('tabindex'); setTimeout(() => url.focus(), 250); } else url.setAttribute('tabindex', '-1');
      saveBanners(); return;
    }
    banners[i][f.dataset.field] = f.value;
    if (f.dataset.field === 'title') panel.querySelector(`[data-sub="${i}"]`).textContent = f.value;
    clearTimeout(panel._t); panel._t = setTimeout(saveBanners, 300);
  });

  $('#file-add').addEventListener('change', async (e) => {
    const files = [...e.target.files].slice(0, MAX_BANNERS - banners.length);
    e.target.value = '';
    if (!files.length) return;
    for (const file of files) {
      const image = await storeImage(file, 'banner');
      banners.push({ id: 'b' + Date.now() + Math.random().toString(36).slice(2, 6), image, pill: 'Novidade', title: 'Novo banner', desc: 'Descrição do banner' });
    }
    if (saveBanners()) toast(files.length > 1 ? `${files.length} banners adicionados` : 'Banner adicionado');
    else banners.splice(banners.length - files.length, files.length);
    drawBannerPanel();
  });

  $('#file-replace').addEventListener('change', async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    if (!file || replaceIdx < 0) return;
    const old = banners[replaceIdx].image;
    banners[replaceIdx].image = await storeImage(file, 'banner');
    if (saveBanners()) toast('Imagem atualizada'); else banners[replaceIdx].image = old;
    drawBannerPanel();
  });
}

function drawBannerPanel() {
  const panel = $('#banners-panel');
  $('#count-banners').textContent = `${banners.length}/${MAX_BANNERS}`;
  panel.innerHTML = `
    <p class="desc">Imagens que se alternam a cada 10 segundos no topo da tela inicial. Os textos aparecem sobre a imagem.</p>

    ${banners.map((b, i) => `
      <div class="banner-item">
        <div class="bi-head">
          <button class="bi-thumb" data-thumb="${i}" title="Trocar imagem" style="background-image:url('${esc(imgUrl(b.image))}')"></button>
          <div class="bi-meta">
            <span class="bi-badge">BANNER ${i + 1}</span>
            <p data-sub="${i}">${esc(b.title)}</p>
          </div>
          <button class="icon-btn" data-del="${i}" title="Remover banner"><i data-icon="trash"></i></button>
        </div>
        <div class="bi-fields">
          <div class="field"><label>Texto da pílula</label><input data-i="${i}" data-field="pill" value="${esc(b.pill)}"></div>
          <div class="field"><label>Título</label><input data-i="${i}" data-field="title" value="${esc(b.title)}"></div>
          <div class="field"><label>Descrição</label><input data-i="${i}" data-field="desc" value="${esc(b.desc)}"></div>
          <div class="field full bi-link ${b.linkOn ? 'on' : ''}">
            <div class="bi-link-row">
              <div class="pref-text"><strong>Botão “Acessar”</strong><span>Mostra um botão no banner que abre o link em uma nova guia</span></div>
              <label class="switch"><input type="checkbox" data-i="${i}" data-field="linkOn" ${b.linkOn ? 'checked' : ''}><span></span></label>
            </div>
            <div class="bi-link-url"><div>
              <label>Link de acesso</label>
              <input data-i="${i}" data-field="url" value="${esc(b.url || '')}" placeholder="https://www.exemplo.com.br" inputmode="url" ${b.linkOn ? '' : 'tabindex="-1"'}>
            </div></div>
          </div>
        </div>
      </div>`).join('')}

    <div class="panel-foot">
      <span>Tamanho recomendado: <b>2560 × 673 px</b> — até ${MAX_BANNERS} imagens.</span>
      <button class="btn-dark" id="btn-add" ${banners.length >= MAX_BANNERS ? 'disabled' : ''}><i data-icon="plus"></i>Adicionar banners</button>
    </div>`;
  paintIcons(panel);
}


/* =========================================================
   NOTÍCIAS
   ========================================================= */
const DEFAULT_NEWS = [
  {
    id: 'n1', cat: 'Conquistas', date: '2026-11-08', read: 4, author: 'Comunicação HC',
    image: 'assets/news/formatura.svg',
    title: 'HC Instituto Educacional celebra formatura de 120 alunos em noite especial',
    excerpt: 'Cerimônia reuniu formandos, familiares e professores para celebrar a conclusão de cursos de graduação e pós-graduação.',
    body: [
      'Na última sexta-feira, o HC Instituto Educacional realizou a cerimônia de colação de grau de 120 alunos dos cursos de graduação e pós-graduação semipresenciais. O evento aconteceu no auditório do polo e reuniu mais de 400 convidados entre familiares, amigos e professores.',
      'Durante a cerimônia, a coordenação destacou a dedicação dos formandos, que conciliaram trabalho, família e estudos ao longo da jornada. "Cada diploma entregue hoje representa uma história de persistência", afirmou a coordenadora do polo em seu discurso.',
      'Os alunos com melhor desempenho acadêmico receberam menção honrosa, e a turma de Pedagogia foi homenageada por alcançar 100% de aprovação no trabalho de conclusão de curso.',
      'As fotos oficiais da formatura estarão disponíveis na secretaria do polo a partir da próxima semana.',
    ],
  },
  {
    id: 'n2', cat: 'Infraestrutura', date: '2026-11-05', read: 3, author: 'Coordenação do Polo',
    image: 'assets/news/laboratorio.svg',
    title: 'Laboratório de informática ganha 30 novos computadores',
    excerpt: 'Equipamentos modernos e internet mais rápida chegam para apoiar aulas, provas e atividades on-line.',
    body: [
      'O laboratório de informática do polo foi totalmente renovado e agora conta com 30 novos computadores, monitores maiores e uma conexão de internet três vezes mais rápida.',
      'A modernização atende a uma demanda antiga dos alunos, que utilizam o espaço para acessar o ambiente virtual de aprendizagem, realizar avaliações e participar de aulas ao vivo.',
      'O laboratório funciona de segunda a sexta, das 8h às 22h, e aos sábados, das 8h às 12h. Para utilizar os equipamentos fora do horário de aula, basta apresentar a carteirinha de estudante na recepção.',
    ],
  },
  {
    id: 'n3', cat: 'Acadêmico', date: '2026-10-30', read: 3, author: 'Comunicação HC',
    image: 'assets/news/mec.svg',
    title: 'Cursos parceiros alcançam nota máxima na avaliação do MEC',
    excerpt: 'Resultado reforça a qualidade do ensino oferecido no polo e valoriza o diploma dos nossos alunos.',
    body: [
      'Três cursos oferecidos pelo polo em parceria com instituições credenciadas receberam conceito 5, a nota máxima na avaliação do Ministério da Educação.',
      'A avaliação considera critérios como organização didático-pedagógica, corpo docente e infraestrutura. O resultado coloca os cursos entre os mais bem avaliados do país na modalidade semipresencial.',
      'Para a coordenação, a conquista é resultado do trabalho conjunto entre professores, tutores e alunos. A lista completa de cursos e notas pode ser consultada na secretaria.',
    ],
  },
  {
    id: 'n4', cat: 'Eventos', date: '2026-10-27', read: 2, author: 'Coordenação Acadêmica',
    image: 'assets/news/semana.svg',
    title: 'Semana Acadêmica 2026 terá palestras gratuitas com certificado',
    excerpt: 'Programação inclui palestras, oficinas práticas e rodas de conversa sobre carreira e mercado de trabalho.',
    body: [
      'Entre os dias 23 e 27 de novembro, o polo promove a Semana Acadêmica 2026, com programação gratuita e aberta a todos os alunos matriculados.',
      'Serão mais de 15 atividades entre palestras, oficinas práticas e rodas de conversa sobre empreendedorismo, tecnologia na educação, saúde mental e preparação para o mercado de trabalho.',
      'Os participantes receberão certificado de horas complementares. As inscrições podem ser feitas na recepção do polo ou com os tutores de cada curso. As vagas são limitadas.',
    ],
  },
  {
    id: 'n5', cat: 'Comunicados', date: '2026-10-20', read: 2, author: 'Secretaria',
    image: 'assets/news/inscricoes.svg',
    title: 'Inscrições abertas para o processo seletivo 2027.1',
    excerpt: 'Novos alunos podem se inscrever em cursos de graduação, segunda licenciatura e pós-graduação.',
    body: [
      'Estão abertas as inscrições para o processo seletivo 2027.1. Os interessados podem escolher entre cursos de graduação, segunda licenciatura, formação pedagógica e pós-graduação.',
      'O ingresso pode ser feito por prova on-line, nota do ENEM ou aproveitamento de diploma. Alunos indicados por estudantes atuais do polo têm condições especiais na matrícula.',
      'Para mais informações, procure a secretaria do polo ou entre em contato pelos canais oficiais da instituição.',
    ],
  },
];
let news = store.get('news', PUBLISHED.news || DEFAULT_NEWS);
/* Notícias recentes da tela inicial: itens marcados com estrela (star), na ordem de "rank". */
const MAX_RECENT = 10;
if (!news.some((n) => 'star' in n)) { // conteúdo antigo: destaca as mais recentes
  [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_RECENT).forEach((n, i) => { n.star = true; n.rank = i; });
}
const recentNews = () => news.filter((n) => n.star).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
const renumberRecent = (list = recentNews()) => list.forEach((n, i) => { n.rank = i; });
/* Marca/desmarca a estrela; devolve false se o limite foi atingido */
function toggleStar(n) {
  if (n.star) { n.star = false; delete n.rank; renumberRecent(); return true; }
  if (recentNews().length >= MAX_RECENT) { toast(`Limite de ${MAX_RECENT} notícias na tela inicial. Remova uma estrela antes.`); return false; }
  n.star = true; n.rank = MAX_RECENT; renumberRecent(); return true;
}
let newsFilter = 'Todas';

const MESES_LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
function fmtDate(iso, long = false) {
  const [y, m, d] = iso.split('-').map(Number);
  return long ? `${d} de ${MESES_LONG[m - 1]} de ${y}` : `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}
const NEWS_CATS = ['Conquistas', 'Infraestrutura', 'Acadêmico', 'Eventos', 'Comunicados'];
const NEWS_DEFAULT_IMG = 'assets/news/padrao.svg';
const saveNews = () => { cleanupImages(); return store.set('news', news); };
const MAX_NEWS_IMGS = 5;      // capa + até 4 imagens extras
const NEWS_SLIDE_MS = 10000;  // troca das imagens ao abrir a notícia
/* Imagens reais da notícia, com a capa primeiro (n.image é sempre a capa) */
const newsImages = (n) => [n.image, ...(n.gallery || [])].filter((src) => src && src !== NEWS_DEFAULT_IMG);
const setNewsImages = (n, imgs) => { n.image = imgs[0] || NEWS_DEFAULT_IMG; n.gallery = imgs.slice(1, MAX_NEWS_IMGS); };
/* Enquadramento: n.focus guarda, na mesma ordem das imagens, o ponto que deve ficar visível ("x% y%") */
const newsItems = (n) => newsImages(n).map((src, k) => ({ src, pos: (n.focus || [])[k] || '' }));
const setNewsItems = (n, items) => {
  setNewsImages(n, items.map((it) => it.src));
  const f = items.slice(0, MAX_NEWS_IMGS).map((it) => it.pos || '');
  if (f.some(Boolean)) n.focus = f; else delete n.focus;
};
const coverPos = (n) => (newsImages(n).length && n.focus?.[0]) || '';
const VALID_POS = /^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/;
const objPos = (pos) => (pos && VALID_POS.test(pos) ? ` style="object-position:${pos}"` : '');
const bgPos = (pos) => (pos && VALID_POS.test(pos) ? `background-position:${pos};` : '');
/* Tempo de leitura estimado (≈ 200 palavras por minuto) */
const readTime = (n) => Math.max(1, Math.round([n.excerpt, ...n.body].join(' ').split(/\s+/).filter(Boolean).length / 200));
const CAT_CLASS = { Conquistas: 'c-gold', Infraestrutura: 'c-teal', 'Acadêmico': 'c-green', Eventos: 'c-purple', Comunicados: 'c-blue' };
const catBadge = (c) => `<span class="cat ${CAT_CLASS[c] || 'c-green'}">${esc(c)}</span>`;
const MESES_ABBR = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
const fmtShort = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MESES_ABBR[m - 1]} ${y}`; };
const eyebrow = (n, cls = '') => `<span class="ap-eyebrow ${cls}">${esc(n.cat)}<span class="ap-sep">·</span>${fmtShort(n.date)}</span>`;
const PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

/* Cartão da vitrine (estilo loja) */
function newsCard(n) {
  return `
  <article class="nc ap-card" data-news="${n.id}" tabindex="0" role="button" aria-label="Abrir notícia: ${esc(n.title)}">
    <div class="ap-card-text">
      ${eyebrow(n)}
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.excerpt)}</p>
    </div>
    <div class="nc-media ap-card-media"><img src="${esc(imgUrl(n.image))}" alt="" loading="lazy"${objPos(coverPos(n))}></div>
    <span class="ap-plus" aria-hidden="true">${PLUS_SVG}</span>
  </article>`;
}

/* Destaque grande com texto centralizado sobre a imagem */
function featureCard(n) {
  return `
  <article class="nc ap-feature" data-news="${n.id}" tabindex="0" role="button" aria-label="Abrir notícia: ${esc(n.title)}">
    <div class="nc-media ap-feature-media"><img src="${esc(imgUrl(n.image))}" alt=""${objPos(coverPos(n))}></div>
    <div class="ap-feature-text">
      ${eyebrow(n, 'light')}
      <h2>${esc(n.title)}</h2>
      <p>${esc(n.excerpt)}</p>
      <span class="ap-link light">Ler a notícia ${CHEV_SVG}</span>
    </div>
  </article>`;
}

/* Conteúdo abaixo do seletor (destaque + vitrine) para a categoria atual */
function newsBodyHTML() {
  const list = sortedNews();
  const filtered = newsFilter === 'Todas' ? list : list.filter((n) => n.cat === newsFilter);
  const [feat, ...rest] = filtered;
  if (!feat) return `<p class="ap-empty">Nenhuma notícia publicada ainda.</p>`;
  return `
    <section class="reveal">${featureCard(feat)}</section>
    ${rest.length ? `
    <section class="ap-shelf reveal">
      <div class="ap-shelf-head">
        <h2>${newsFilter === 'Todas' ? 'Mais notícias.' : `Mais em ${esc(newsFilter)}.`}<span> Fique por dentro de tudo o que acontece no polo.</span></h2>
      </div>
      <div class="ap-scroller">${rest.map(newsCard).join('')}</div>
      <div class="ap-paddles">
        <button class="ap-paddle" data-dir="-1" aria-label="Anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <button class="ap-paddle" data-dir="1" aria-label="Próximas">${CHEV_SVG}</button>
      </div>
    </section>` : ''}`;
}

function renderNews(view) {
  const cats = ['Todas', ...NEWS_CATS.filter((c) => news.some((n) => n.cat === c))];
  if (!cats.includes(newsFilter)) newsFilter = 'Todas';

  view.innerHTML = `
  <div class="wrap news-page">
    <header class="ap-hero reveal">
      <p class="ap-kicker">Notícias</p>
      <h1>Acontece no <span class="ap-grad">HC</span>.</h1>
      <p class="ap-sub">Conquistas, eventos e comunicados do HC Instituto Educacional, reunidos em um só lugar.</p>
      <div class="ap-seg" role="tablist" aria-label="Categorias">
        <span class="ap-seg-ind" aria-hidden="true"></span>
        ${cats.map((c) => `<button class="${c === newsFilter ? 'on' : ''}" data-cat="${esc(c)}" role="tab" aria-selected="${c === newsFilter}">${esc(c)}</button>`).join('')}
      </div>
    </header>
    <div class="news-body" id="news-body">${newsBodyHTML()}</div>
  </div>`;

  const page = view.querySelector('.news-page');
  const body = page.querySelector('#news-body');
  const seg = page.querySelector('.ap-seg');
  const ind = seg.querySelector('.ap-seg-ind');

  // indicador que desliza até a categoria escolhida
  const moveIndicator = (instant) => {
    const on = seg.querySelector('button.on'); if (!on) return;
    if (instant) ind.style.transition = 'none';
    ind.style.width = on.offsetWidth + 'px';
    ind.style.height = on.offsetHeight + 'px';
    ind.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
    if (instant) { void ind.offsetWidth; ind.style.transition = ''; }
  };
  moveIndicator(true);
  new ResizeObserver(() => moveIndicator(true)).observe(seg);
  document.fonts?.ready.then(() => moveIndicator(true));

  // troca de categoria: só o conteúdo abaixo muda, com transição suave
  let swapping = null;
  seg.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b || b.dataset.cat === newsFilter) return;
    newsFilter = b.dataset.cat;
    seg.querySelectorAll('button').forEach((x) => {
      const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on);
    });
    moveIndicator();
    swapBody();
  });

  const swapBody = async () => {
    const token = {}; swapping = token;
    if (reduceMotion()) { body.innerHTML = newsBodyHTML(); setupBody(true); return; }
    body.style.minHeight = body.offsetHeight + 'px'; // evita "pulo" da página durante a troca
    const out = body.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px)' }],
      { duration: 180, easing: 'ease-in', fill: 'forwards' });
    // segue mesmo se o navegador atrasar a animação (aba em segundo plano, por exemplo)
    await Promise.race([out.finished, new Promise((r) => setTimeout(r, 220))]);
    if (swapping !== token) return; // outro clique chegou antes
    body.innerHTML = newsBodyHTML();
    setupBody(true);
    body.getAnimations().forEach((an) => an.cancel());
    const sections = [...body.children];
    sections.forEach((el, i) => el.animate(
      [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
      { duration: 520, delay: i * 70, easing: 'cubic-bezier(.28, .11, .32, 1)', fill: 'backwards' }));
    body.style.minHeight = '';
  };

  // abrir notícia (clique ou teclado)
  const openFrom = (el) => openNews(news.find((n) => n.id === el.dataset.news), el);
  page.addEventListener('click', (e) => { const c = e.target.closest('[data-news]'); if (c) openFrom(c); });
  page.addEventListener('keydown', (e) => {
    const c = e.target.closest('[data-news]');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openFrom(c); }
  });

  // revela as seções conforme aparecem na tela
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  page.querySelectorAll('.ap-hero.reveal').forEach((el) => io.observe(el));

  // prepara a vitrine (setas) e as animações de entrada do conteúdo
  function setupBody(shown) {
    body.querySelectorAll('.reveal').forEach((el) => (shown ? el.classList.add('in') : io.observe(el)));
    const sc = body.querySelector('.ap-scroller'); if (!sc) return;
    const paddles = body.querySelectorAll('.ap-paddle');
    const box = body.querySelector('.ap-paddles');
    const update = () => {
      paddles[0].disabled = sc.scrollLeft <= 4;
      paddles[1].disabled = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4;
      box.hidden = sc.scrollWidth <= sc.clientWidth + 4;
    };
    box.addEventListener('click', (e) => {
      const b = e.target.closest('.ap-paddle'); if (!b) return;
      sc.scrollBy({ left: (sc.querySelector('.ap-card').offsetWidth + 20) * +b.dataset.dir, behavior: 'smooth' });
    });
    sc.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(sc);
    update();
  }
  setupBody(false);
}

/* ---------- Pop-up com animação de expansão ----------
   A imagem do cartão "voa" até o topo do pop-up enquanto ele aparece,
   e o texto completo é revelado em seguida. */
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_OUT = 'cubic-bezier(.2, .8, .2, 1)';

function openNews(n, card) {
  if (!n || document.querySelector('.nm')) return;
  const cardImg = card.querySelector('.nc-media img');
  const cardMedia = card.querySelector('.nc-media');
  const from = cardMedia.getBoundingClientRect();
  const fromRadius = getComputedStyle(card.querySelector('.nc-media')).borderTopLeftRadius;
  const others = news.filter((x) => x.id !== n.id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
  const items = newsItems(n);
  if (!items.length) items.push({ src: n.image, pos: '' });
  const imgs = items.map((it) => it.src);
  const multi = items.length > 1;

  const wrap = document.createElement('div');
  wrap.className = 'nm';
  wrap.innerHTML = `
    <div class="nm-backdrop"></div>
    <div class="nm-scroll">
      <article class="nm-panel" role="dialog" aria-modal="true" aria-labelledby="nm-title">
        <div class="nm-top">
        <button class="nm-close" aria-label="Fechar notícia"><i data-icon="x"></i></button>
        <div class="nm-media ${multi ? 'multi' : ''}">
          ${multi ? `
            <div class="nm-track">${items.map((it) => `<img src="${esc(imgUrl(it.src))}" alt=""${objPos(it.pos)}>`).join('')}</div>
            <button class="nm-arrow prev" data-dir="-1" aria-label="Imagem anterior"><i data-icon="left"></i></button>
            <button class="nm-arrow next" data-dir="1" aria-label="Próxima imagem"><i data-icon="right"></i></button>
            <div class="nm-dots">${imgs.map((_, k) => `<button class="nm-dot" data-k="${k}" aria-label="Imagem ${k + 1} de ${imgs.length}"><span class="dot-fill"></span></button>`).join('')}</div>
          ` : `<img src="${esc(imgUrl(items[0].src))}" alt=""${objPos(items[0].pos)}>`}
        </div>
        </div>
        <div class="nm-body">
        <div class="nm-content">
          ${eyebrow(n)}
          <h2 id="nm-title">${esc(n.title)}</h2>
          <p class="nm-lead">${esc(n.excerpt)}</p>
          <p class="nm-byline">Por <strong>${esc(n.author)}</strong><span class="ap-sep">·</span>${fmtDate(n.date, true)}<span class="ap-sep">·</span>${readTime(n)} min de leitura</p>
          <div class="nm-text">${n.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
          ${others.length ? `
          <div class="nm-related">
            <h4>Leia também.</h4>
            <div class="nm-rel-list">
              ${others.map((o) => `
                <button class="nm-rel" data-rel="${o.id}">
                  <span class="nm-rel-img"><img src="${esc(imgUrl(o.image))}" alt=""${objPos(coverPos(o))}></span>
                  <span class="nm-rel-txt"><strong>${esc(o.title)}.</strong> ${esc(o.excerpt)}</span>
                </button>`).join('')}
            </div>
          </div>` : ''}
        </div>
        </div>
      </article>
    </div>`;
  document.body.appendChild(wrap);
  paintIcons(wrap);
  document.body.classList.add('modal-open');

  const panel = wrap.querySelector('.nm-panel');
  const media = wrap.querySelector('.nm-media');
  const content = wrap.querySelector('.nm-content');
  const backdrop = wrap.querySelector('.nm-backdrop');
  const lastFocus = document.activeElement;

  // apresentação das imagens (só quando a notícia tem mais de uma)
  let slider = null;
  if (multi) {
    media.style.setProperty('--nm-ms', NEWS_SLIDE_MS + 'ms');
    const dots = [...media.querySelectorAll('.nm-dot')];
    slider = loopTrack(media.querySelector('.nm-track'), (i) => dots.forEach((d, k) => {
      d.classList.remove('active');
      if (k === i) { void d.offsetWidth; d.classList.add('active'); }
    }));
    slider.go(0, true);
    media.addEventListener('animationend', (e) => { if (e.target.classList.contains('dot-fill')) slider.go(slider.index + 1); });
    media.addEventListener('click', (e) => {
      const d = e.target.closest('.nm-dot'); if (d) slider.go(+d.dataset.k);
      const a = e.target.closest('.nm-arrow'); if (a) slider.go(slider.index + +a.dataset.dir);
    });
    media.addEventListener('mouseenter', () => media.classList.add('paused'));
    media.addEventListener('mouseleave', () => media.classList.remove('paused'));
    let x0 = null;
    media.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    media.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) slider.go(slider.index + (dx < 0 ? 1 : -1));
    });
  }
  const currentItem = () => items[slider ? slider.index : 0];
  // ao rolar o texto, as imagens ficam fixas no topo e o texto passa por baixo delas
  const body = wrap.querySelector('.nm-body');
  body.addEventListener('scroll', () => panel.classList.toggle('scrolled', body.scrollTop > 4), { passive: true });

  let closing = false;
  const close = (then) => {
    if (closing) return; closing = true;
    document.removeEventListener('keydown', onKey);
    const finish = () => {
      wrap.remove(); cardImg.style.visibility = '';
      document.body.classList.remove('modal-open');
      if (then) then(); else lastFocus?.focus?.({ preventScroll: true });
    };
    if (reduceMotion()) return finish();
    const to = cardMedia.getBoundingClientRect();
    const start = media.getBoundingClientRect();
    const onScreen = to.bottom > 0 && to.top < innerHeight && to.right > 0 && to.left < innerWidth && !then;
    content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, fill: 'forwards' });
    if (onScreen) {
      const ghost = flyImage(imgUrl(currentItem().src), start, to, getComputedStyle(media).borderTopLeftRadius, fromRadius, 420, currentItem().pos);
      media.style.visibility = 'hidden';
      panel.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.97)' }], { duration: 260, easing: 'ease', fill: 'forwards' });
      ghost.onfinish = () => { finish(); ghost.effect.target.remove(); };
    } else {
      panel.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(20px) scale(.97)' }], { duration: 280, easing: 'ease', fill: 'forwards' })
        .onfinish = finish;
    }
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (slider && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) slider.go(slider.index + (e.key === 'ArrowRight' ? 1 : -1));
    if (e.key === 'Tab') { // mantém o foco dentro do pop-up
      const f = [...panel.querySelectorAll('button')];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  wrap.querySelector('.nm-close').addEventListener('click', () => close());
  wrap.querySelector('.nm-scroll').addEventListener('click', (e) => { if (e.target.classList.contains('nm-scroll')) close(); });
  wrap.querySelectorAll('[data-rel]').forEach((b) => b.addEventListener('click', () => {
    const target = document.querySelector(`[data-news="${b.dataset.rel}"]`);
    close(() => { if (target) { target.scrollIntoView({ block: 'center', inline: 'center' }); openNews(news.find((x) => x.id === b.dataset.rel), target); } });
  }));

  wrap.querySelector('.nm-close').focus({ preventScroll: true });
  if (reduceMotion()) return;

  // --- animação de abertura ---
  const to = media.getBoundingClientRect();
  cardImg.style.visibility = 'hidden';
  media.style.visibility = 'hidden';
  backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease', fill: 'backwards' });
  panel.animate(
    [{ opacity: 0, transform: 'translateY(24px) scale(.96)' }, { opacity: 1, transform: 'none' }],
    { duration: 520, easing: EASE_OUT, fill: 'backwards', delay: 60 });
  [...content.children].forEach((el, i) => el.animate(
    [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
    { duration: 500, easing: EASE_OUT, fill: 'backwards', delay: 300 + i * 70 }));
  const ghost = flyImage(imgUrl(items[0].src), from, to, fromRadius, getComputedStyle(media).borderTopLeftRadius, 620, items[0].pos);
  ghost.onfinish = () => { media.style.visibility = ''; ghost.effect.target.remove(); };
}

/* Cria uma cópia da imagem que se move/escala entre dois retângulos da tela */
function flyImage(src, a, b, r1, r2, duration, pos = '') {
  const el = document.createElement('div');
  el.className = 'nm-ghost';
  el.style.backgroundImage = `url('${src}')`;
  if (pos && VALID_POS.test(pos)) el.style.backgroundPosition = pos;
  document.body.appendChild(el);
  return el.animate([
    { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', borderRadius: r1 },
    { left: b.left + 'px', top: b.top + 'px', width: b.width + 'px', height: b.height + 'px', borderRadius: r2 },
  ], { duration, easing: 'cubic-bezier(.3, .9, .2, 1)', fill: 'forwards' });
}

/* ---------- Seções expansíveis (acordeão) ---------- */
let openSection = null; // apenas uma seção aberta por vez
function accSection(key, ico, title, sub, countId, body) {
  const open = openSection === key;
  return `
  <section class="panel acc ${open ? 'open' : ''}" data-acc="${key}">
    <button class="acc-head" type="button" aria-expanded="${open}" aria-controls="acc-${key}">
      <span class="acc-icon"><i data-icon="${ico}"></i></span>
      <span class="acc-text"><strong>${title}</strong><span>${sub}</span></span>
      ${countId ? `<span class="count-badge" id="${countId}"></span>` : ''}
      <span class="acc-chev"><i data-icon="chevron"></i></span>
    </button>
    <div class="acc-body" id="acc-${key}" role="region">
      <div class="acc-inner"><div class="acc-content">${body}</div></div>
    </div>
  </section>`;
}
function initAccordion() {
  const list = $('#acc-list');
  const sync = () => list.querySelectorAll('.acc').forEach((sec) => {
    const open = sec.dataset.acc === openSection;
    sec.classList.toggle('open', open);
    const body = sec.querySelector('.acc-body'); if (!body) return;
    sec.querySelector('.acc-head').setAttribute('aria-expanded', open);
    body.inert = !open;
  });
  list.addEventListener('click', (e) => {
    const head = e.target.closest('.acc-head'); if (!head || head.classList.contains('acc-go')) return;
    const key = head.closest('.acc').dataset.acc;
    openSection = openSection === key ? null : key;
    sync();
  });
  sync();
}

/* ---------- Logo do painel ---------- */
function initBrandPanel() {
  const panel = $('#brand-panel');
  drawBrandPanel();
  panel.addEventListener('click', (e) => {
    const t = e.target.closest('[data-bact]'); if (!t) return;
    if (t.dataset.bact === 'img') $('#file-logo').click();
    if (t.dataset.bact === 'rm') { brandList[0].image = ''; saveBrand(); paintLogo(); drawBrandPanel(); toast('Logo padrão restaurado'); }
  });
  $('#file-logo').addEventListener('change', async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    if (!file) return;
    const old = brandList[0].image;
    brandList[0].image = await storeImage(file, 'logo');
    if (saveBrand()) toast('Logo atualizado'); else brandList[0].image = old;
    paintLogo(); drawBrandPanel();
  });
}
function drawBrandPanel() {
  const panel = $('#brand-panel');
  const img = brandList[0].image;
  panel.innerHTML = `
    <p class="desc">A imagem aparece no quadrado do topo da barra lateral, em todas as páginas. Prefira uma imagem quadrada.</p>
    <div class="brand-row">
      <button class="sb-logo brand-preview ${img ? 'has-img' : ''}" data-bact="img" title="Trocar logo">${img ? `<img src="${esc(imgUrl(img))}" alt="">` : LOGO_DEFAULT}</button>
      <div class="img-row">
        <button class="btn-soft" data-bact="img"><i data-icon="image"></i>${img ? 'Trocar imagem' : 'Escolher imagem'}</button>
        ${img ? `<button class="btn-soft danger" data-bact="rm"><i data-icon="x"></i>Voltar ao padrão</button>` : ''}
      </div>
    </div>
    <div class="panel-foot"><span>Tamanho recomendado: <b>512 × 512 px</b>.</span></div>`;
  paintIcons(panel);
}

/* ---------- Botões de acesso rápido ---------- */
function initLinksPanel() {
  const panel = $('#links-panel');
  let imgIdx = -1;
  drawLinksPanel();

  panel.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]'); if (!t) return;
    const i = +t.dataset.i;
    const act = t.dataset.act;
    if (act === 'img') { imgIdx = i; $('#file-link').click(); }
    if (act === 'rmimg') { links[i].image = ''; saveLinks(); drawLinksPanel(); toast('Imagem removida'); }
    if (act === 'del') {
      if (!confirm(`Remover o botão "${links[i].name}"?`)) return;
      links.splice(i, 1); saveLinks(); drawLinksPanel(); toast('Botão removido');
    }
    if (act === 'up' || act === 'down') {
      const j = act === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= links.length) return;
      [links[i], links[j]] = [links[j], links[i]]; saveLinks(); drawLinksPanel();
    }
    if (act === 'add') {
      links.push({ id: 'l' + Date.now(), name: 'NOVO BOTÃO', url: '', image: '', c1: '#22c55e', c2: '#0e7490' });
      saveLinks(); drawLinksPanel();
      panel.querySelector(`[data-field="name"][data-i="${links.length - 1}"]`)?.select();
    }
  });

  panel.addEventListener('input', (e) => {
    const f = e.target.closest('[data-field]'); if (!f) return;
    const i = +f.dataset.i;
    links[i][f.dataset.field] = f.value;
    const prev = panel.querySelector(`[data-preview="${i}"]`);
    prev.style.background = linkBg(links[i]);
    prev.style.color = linkInk(links[i]);
    prev.querySelector('.ql-name').textContent = links[i].name;
    panel.querySelector(`[data-sub="l${i}"]`).textContent = normalizeUrl(links[i].url) || 'Sem link configurado';
    clearTimeout(panel._t); panel._t = setTimeout(saveLinks, 300);
  });

  $('#file-link').addEventListener('change', async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    if (!file || imgIdx < 0) return;
    const old = links[imgIdx].image;
    links[imgIdx].image = await storeImage(file, 'link');
    if (saveLinks()) toast('Imagem de fundo aplicada'); else links[imgIdx].image = old;
    drawLinksPanel();
  });
}

function drawLinksPanel() {
  const panel = $('#links-panel');
  $('#count-links').textContent = `${links.length}/${MAX_LINKS}`;
  panel.innerHTML = `
    <p class="desc">Atalhos exibidos logo abaixo do banner. Cada botão abre o site configurado em uma nova aba. Use uma imagem de fundo ou um degradê de cores.</p>

    ${links.map((l, i) => `
      <div class="banner-item">
        <div class="bi-head">
          <button class="ql ql-preview ${l.image ? 'has-img' : ''}" data-act="img" data-i="${i}" data-preview="${i}" title="Trocar imagem de fundo"
                  style="background:${linkBg(l)};color:${linkInk(l)}">
            <span class="ql-name">${esc(l.name)}</span>
          </button>
          <div class="bi-meta">
            <span class="bi-badge">BOTÃO ${i + 1}</span>
            <p data-sub="l${i}">${esc(normalizeUrl(l.url)) || 'Sem link configurado'}</p>
          </div>
          <div class="bi-actions">
            <button class="icon-btn neutral" data-act="up" data-i="${i}" title="Mover para a esquerda" ${i === 0 ? 'disabled' : ''}><i data-icon="up"></i></button>
            <button class="icon-btn neutral" data-act="down" data-i="${i}" title="Mover para a direita" ${i === links.length - 1 ? 'disabled' : ''}><i data-icon="down"></i></button>
            <button class="icon-btn" data-act="del" data-i="${i}" title="Remover botão"><i data-icon="trash"></i></button>
          </div>
        </div>
        <div class="bi-fields">
          <div class="field"><label>Nome</label><input data-i="${i}" data-field="name" value="${esc(l.name)}" maxlength="24"></div>
          <div class="field"><label>Link (site)</label><input data-i="${i}" data-field="url" value="${esc(l.url)}" placeholder="https://www.exemplo.com.br" inputmode="url"></div>
          <div class="field">
            <label>Imagem de fundo</label>
            <div class="img-row">
              <button class="btn-soft" data-act="img" data-i="${i}"><i data-icon="image"></i>${l.image ? 'Trocar imagem' : 'Escolher imagem'}</button>
              ${l.image ? `<button class="btn-soft danger" data-act="rmimg" data-i="${i}"><i data-icon="x"></i>Remover</button>` : ''}
            </div>
          </div>
          <div class="field">
            <label>Cores do degradê ${l.image ? '<em>(usadas sem imagem)</em>' : ''}</label>
            <div class="color-row">
              <input type="color" data-i="${i}" data-field="c1" value="${esc(l.c1)}" title="Cor inicial">
              <input type="color" data-i="${i}" data-field="c2" value="${esc(l.c2)}" title="Cor final">
            </div>
          </div>
        </div>
      </div>`).join('')}

    <div class="panel-foot">
      <span>Imagem recomendada: <b>800 × 320 px</b> — até ${MAX_LINKS} botões.</span>
      <button class="btn-dark" data-act="add" ${links.length >= MAX_LINKS ? 'disabled' : ''}><i data-icon="plus"></i>Adicionar botão</button>
    </div>`;
  paintIcons(panel);
}


/* ---------- Notícias (configurações) ---------- */
let openNewsId = null; // notícia aberta para edição
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const sortedNews = () => [...news].sort((a, b) => b.date.localeCompare(a.date));

function initNewsPanel() {
  const panel = $('#news-panel');
  let imgId = null;
  drawNewsPanel();

  panel.addEventListener('click', (e) => {
    const t = e.target.closest('[data-nact]'); if (!t) return;
    const id = t.dataset.id;
    const n = news.find((x) => x.id === id);
    const act = t.dataset.nact;
    if (act === 'star') {
      if (toggleStar(n)) { saveNews(); drawNewsPanel(); drawRecentPanel(); toast(n.star ? 'Notícia exibida na tela inicial' : 'Notícia removida da tela inicial'); }
    }
    if (act === 'toggle') { openNewsId = openNewsId === id ? null : id; drawNewsPanel(); }
    if (act === 'img') { imgId = id; $('#file-news').click(); }
    if (act === 'addimg') { imgId = id; $('#file-news-add').click(); }
    if (act === 'cover' || act === 'rmg') {
      const items = newsItems(n);
      const [pick] = items.splice(+t.dataset.k, 1);
      if (act === 'cover') items.unshift(pick);
      setNewsItems(n, items); saveNews(); drawNewsPanel(); drawRecentPanel();
      toast(act === 'cover' ? 'Capa da notícia atualizada' : 'Imagem removida');
    }
    if (act === 'focus') {
      const k = +t.dataset.k;
      const it = newsItems(n)[k]; if (!it) return;
      focusEditor(it).then((pos) => {
        if (pos === null || !news.includes(n)) return;
        const items = newsItems(n);
        if (!items[k] || items[k].src !== it.src) return;
        items[k].pos = pos;
        setNewsItems(n, items); saveNews(); drawNewsPanel(); drawRecentPanel();
        toast('Enquadramento salvo');
      });
    }
    if (act === 'del') {
      confirmDialog({
        title: 'Excluir esta notícia?',
        sub: `"${n.title || 'Sem título'}" será removida do site${n.star ? ' e da tela inicial' : ''}. Essa ação não pode ser desfeita.`,
        image: newsImages(n).length ? imgUrl(n.image) : '',
        ok: 'Excluir notícia',
      }).then((yes) => {
        if (!yes || !news.includes(n)) return;
        news = news.filter((x) => x.id !== id); renumberRecent(); saveNews(); drawNewsPanel(); drawRecentPanel(); toast('Notícia excluída');
      });
    }
    if (act === 'add') {
      const fresh = {
        id: 'n' + Date.now(), cat: 'Comunicados', date: todayIso(), author: 'Comunicação HC',
        image: NEWS_DEFAULT_IMG, title: 'Nova notícia', excerpt: 'Escreva aqui um resumo curto da notícia.',
        body: ['Escreva aqui o texto completo da notícia.'],
      };
      news.push(fresh); openNewsId = fresh.id; saveNews(); drawNewsPanel();
      const ti = panel.querySelector(`[data-nfield="title"][data-id="${fresh.id}"]`);
      ti?.scrollIntoView({ block: 'center', behavior: 'smooth' }); ti?.select();
      toast('Notícia criada. Marque a estrela para exibi-la na tela inicial.');
    }
  });

  panel.addEventListener('input', (e) => {
    const f = e.target.closest('[data-nfield]'); if (!f) return;
    const n = news.find((x) => x.id === f.dataset.id); if (!n) return;
    const field = f.dataset.nfield;
    if (field === 'body') n.body = f.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    else n[field] = f.value;
    // atualiza o resumo do cabeçalho do item
    const row = panel.querySelector(`.news-item[data-id="${n.id}"]`);
    row.querySelector('.ni-title').textContent = n.title || 'Sem título';
    row.querySelector('.ni-sub').innerHTML = `${catBadge(n.cat)}<span>${n.date ? fmtDate(n.date) : '—'} · ${readTime(n)} min de leitura</span>`;
    clearTimeout(panel._t); panel._t = setTimeout(() => { saveNews(); if (n.star) drawRecentPanel(); }, 300);
  });

  $('#file-news').addEventListener('change', async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    const n = news.find((x) => x.id === imgId);
    if (!file || !n) return;
    const old = n.image, oldFocus = n.focus;
    n.image = await storeImage(file, 'news');
    if (n.focus) { n.focus = [...n.focus]; n.focus[0] = ''; if (!n.focus.some(Boolean)) delete n.focus; } // imagem nova: enquadramento padrão
    if (saveNews()) toast('Imagem da notícia atualizada'); else { n.image = old; n.focus = oldFocus; }
    drawNewsPanel(); drawRecentPanel();
  });

  $('#file-news-add').addEventListener('change', async (e) => {
    const files = [...e.target.files]; e.target.value = '';
    const n = news.find((x) => x.id === imgId);
    if (!files.length || !n) return;
    const before = { image: n.image, gallery: n.gallery, focus: n.focus };
    const items = newsItems(n);
    const room = MAX_NEWS_IMGS - items.length;
    for (const f of files.slice(0, room)) items.push({ src: await storeImage(f, 'news'), pos: '' });
    setNewsItems(n, items);
    if (!saveNews()) { Object.assign(n, before); return; }
    const added = Math.min(files.length, room);
    toast(files.length > room
      ? `Limite de ${MAX_NEWS_IMGS} imagens por notícia: ${added ? added + ' adicionada' + (added > 1 ? 's' : '') : 'nenhuma adicionada'}`
      : added > 1 ? `${added} imagens adicionadas` : 'Imagem adicionada');
    drawNewsPanel(); drawRecentPanel();
  });
}

function newsImagesField(n) {
  const items = newsItems(n);
  const imgs = items.map((it) => it.src);
  const hint = imgs.length > 1
    ? 'A capa aparece nos cartões. Ao abrir a notícia, todas passam a cada 10 segundos. Use o botão de enquadrar para manter os rostos sempre visíveis.'
    : 'Adicione mais imagens para elas passarem como no banner ao abrir a notícia. Use o botão de enquadrar para manter os rostos sempre visíveis.';
  return `
          <div class="field full ni-images"><label>Imagens <em>(${imgs.length} de ${MAX_NEWS_IMGS})</em></label>
            <div class="ng-grid">
              ${items.map(({ src, pos }, k) => `
                <div class="ng-item ${k === 0 ? 'is-cover' : ''}" style="background-image:url('${esc(imgUrl(src))}');${bgPos(pos)}">
                  ${k === 0 && imgs.length > 1 ? '<span class="ng-badge"><i data-icon="star"></i>Capa</span>' : ''}
                  <button class="ng-btn ng-focus ${pos ? 'set' : ''}" data-nact="focus" data-id="${n.id}" data-k="${k}" title="Enquadrar imagem" aria-label="Enquadrar imagem"><i data-icon="focus"></i></button>
                  <div class="ng-actions">
                    ${k > 0 ? `<button class="ng-btn" data-nact="cover" data-id="${n.id}" data-k="${k}"><i data-icon="star"></i>Usar como capa</button>` : ''}
                    <button class="ng-btn ng-rm" data-nact="rmg" data-id="${n.id}" data-k="${k}" title="Remover imagem" aria-label="Remover imagem"><i data-icon="x"></i></button>
                  </div>
                </div>`).join('')}
              ${imgs.length < MAX_NEWS_IMGS ? `
                <button class="ng-add" data-nact="addimg" data-id="${n.id}"><i data-icon="plus"></i><span>${imgs.length ? 'Adicionar imagem' : 'Escolher imagem'}</span></button>` : ''}
            </div>
            <p class="ng-hint">${hint}</p>
          </div>`;
}

function drawNewsPanel() {
  const panel = $('#news-panel');
  $('#count-news').textContent = news.length;
  panel.innerHTML = `
    <p class="desc">Na página de Notícias, a publicação com a data mais recente aparece em destaque. Clique em uma notícia para editar; no texto completo, deixe uma linha em branco entre os parágrafos. A estrela exibe a notícia na tela inicial.</p>

    ${news.length ? sortedNews().map((n) => {
      const open = n.id === openNewsId;
      return `
      <div class="banner-item news-item ${open ? 'open' : ''}" data-id="${n.id}">
        <div class="bi-head">
          <button class="ni-thumb" data-nact="img" data-id="${n.id}" title="Trocar imagem" style="background-image:url('${esc(imgUrl(n.image))}');${bgPos(coverPos(n))}"></button>
          <button class="ni-main" data-nact="toggle" data-id="${n.id}" aria-expanded="${open}">
            <span class="ni-title">${esc(n.title) || 'Sem título'}</span>
            <span class="ni-sub">${catBadge(n.cat)}<span>${fmtDate(n.date)} · ${readTime(n)} min de leitura</span></span>
          </button>
          <div class="bi-actions">
            <button class="icon-btn star-btn ${n.star ? 'on' : ''}" data-nact="star" data-id="${n.id}" aria-pressed="${!!n.star}" title="${n.star ? 'Remover da tela inicial' : 'Exibir na tela inicial'}"><i data-icon="star"></i></button>
            <button class="icon-btn neutral ni-chev" data-nact="toggle" data-id="${n.id}" title="${open ? 'Fechar edição' : 'Editar notícia'}"><i data-icon="chevron"></i></button>
            <button class="icon-btn" data-nact="del" data-id="${n.id}" title="Excluir notícia"><i data-icon="trash"></i></button>
          </div>
        </div>
        ${open ? `
        <div class="bi-fields ni-fields">
          <div class="field full"><label>Título</label><input data-id="${n.id}" data-nfield="title" value="${esc(n.title)}" maxlength="140"></div>
          <div class="field"><label>Categoria</label>
            <select data-id="${n.id}" data-nfield="cat">${NEWS_CATS.map((c) => `<option ${c === n.cat ? 'selected' : ''}>${c}</option>`).join('')}</select>
          </div>
          <div class="field"><label>Data de publicação</label><input type="date" data-id="${n.id}" data-nfield="date" value="${esc(n.date)}"></div>
          <div class="field"><label>Autor</label><input data-id="${n.id}" data-nfield="author" value="${esc(n.author)}" maxlength="60"></div>
          ${newsImagesField(n)}
          <div class="field full"><label>Resumo <em>(aparece no cartão)</em></label><textarea rows="2" data-id="${n.id}" data-nfield="excerpt" maxlength="260">${esc(n.excerpt)}</textarea></div>
          <div class="field full"><label>Texto completo <em>(aparece ao abrir a notícia)</em></label><textarea rows="9" data-id="${n.id}" data-nfield="body">${esc(n.body.join('\n\n'))}</textarea></div>
          <div class="ni-foot full"><a class="btn-soft" href="#noticias"><i data-icon="external"></i>Ver na página de Notícias</a></div>
        </div>` : ''}
      </div>`;
    }).join('') : '<p class="desc">Nenhuma notícia cadastrada.</p>'}

    <div class="panel-foot">
      <span>Imagem recomendada: <b>1920 × 1200 px</b>.</span>
      <button class="btn-dark" data-nact="add"><i data-icon="plus"></i>Adicionar notícia</button>
    </div>`;
  paintIcons(panel);
}

/* ---------- Página dedicada: Configurações › Notícias ---------- */
function renderNewsAdmin(view) {
  view.innerHTML = `
  <div class="wrap news-admin">
    <a class="back-link" href="#config"><i data-icon="left"></i>Configurações</a>
    ${pageHead('Configurações', 'Notícias.', 'Publique e edite as notícias do polo e escolha quais aparecem na tela inicial.')}

    <section class="panel ad-panel">
      <header class="ad-head">
        <span class="acc-icon ad-star"><i data-icon="star"></i></span>
        <span class="acc-text"><strong>Notícias recentes da tela inicial</strong><span>Exibidas abaixo do Acesso rápido, nesta ordem</span></span>
        <span class="count-badge" id="count-recent"></span>
      </header>
      <div class="ad-body" id="recent-panel"></div>
    </section>

    <section class="panel ad-panel">
      <header class="ad-head">
        <span class="acc-icon ad-news"><i data-icon="news"></i></span>
        <span class="acc-text"><strong>Todas as notícias</strong><span>Publicações da página de Notícias</span></span>
        <span class="count-badge" id="count-news"></span>
      </header>
      <div class="ad-body" id="news-panel"></div>
    </section>
    <input type="file" id="file-news" accept="image/*" hidden>
    <input type="file" id="file-news-add" accept="image/*" multiple hidden>
  </div>`;
  paintIcons(view);
  initRecentPanel();
  initNewsPanel();
}

function initRecentPanel() {
  const panel = $('#recent-panel');
  drawRecentPanel();

  // anima a troca de posição dos itens (FLIP)
  const flip = (list, change) => {
    const items = [...list.children];
    const before = new Map(items.map((el) => [el, el.getBoundingClientRect().top]));
    change();
    if (reduceMotion()) return;
    items.forEach((el) => {
      const d = before.get(el) - el.getBoundingClientRect().top;
      if (d) el.animate([{ transform: `translateY(${d}px)` }, { transform: 'none' }], { duration: 280, easing: EASE_OUT });
    });
  };
  const commitOrder = (list) => {
    const order = [...list.children].map((el) => news.find((n) => n.id === el.dataset.id));
    renumberRecent(order); saveNews();
    list.querySelectorAll('.rk-num').forEach((el, i) => { el.textContent = i + 1; });
    list.querySelectorAll('.rk-item').forEach((el, i, all) => {
      el.querySelector('[data-ract="up"]').disabled = i === 0;
      el.querySelector('[data-ract="down"]').disabled = i === all.length - 1;
    });
  };

  panel.addEventListener('click', (e) => {
    const t = e.target.closest('[data-ract]'); if (!t) return;
    const item = t.closest('.rk-item');
    const list = item.parentElement;
    const n = news.find((x) => x.id === item.dataset.id);
    const act = t.dataset.ract;
    if (act === 'up' || act === 'down') {
      const sib = act === 'up' ? item.previousElementSibling : item.nextElementSibling;
      if (!sib) return;
      flip(list, () => (act === 'up' ? sib.before(item) : sib.after(item)));
      commitOrder(list);
      t.focus();
    }
    if (act === 'unstar') {
      toggleStar(n); saveNews(); drawRecentPanel(); drawNewsPanel();
      toast('Notícia removida da tela inicial');
    }
  });

  // arrastar e soltar
  let dragging = null;
  panel.addEventListener('dragstart', (e) => {
    dragging = e.target.closest('.rk-item'); if (!dragging) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragging.dataset.id);
    requestAnimationFrame(() => dragging?.classList.add('dragging'));
  });
  panel.addEventListener('dragover', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const over = e.target.closest('.rk-item');
    if (!over || over === dragging) return;
    const r = over.getBoundingClientRect();
    const after = e.clientY > r.top + r.height / 2;
    if ((after && over.nextElementSibling === dragging) || (!after && over.previousElementSibling === dragging)) return;
    flip(over.parentElement, () => (after ? over.after(dragging) : over.before(dragging)));
  });
  panel.addEventListener('drop', (e) => { if (dragging) e.preventDefault(); });
  panel.addEventListener('dragend', () => {
    if (!dragging) return;
    dragging.classList.remove('dragging');
    commitOrder(dragging.parentElement);
    dragging = null;
  });
}

function drawRecentPanel() {
  const panel = $('#recent-panel'); if (!panel) return;
  const list = recentNews();
  $('#count-recent').textContent = `${list.length}/${MAX_RECENT}`;
  panel.innerHTML = `
    <p class="desc">Marque uma notícia com <span class="star-inline"><i data-icon="star"></i></span> na lista abaixo para exibi-la na tela inicial. Arraste os itens, ou use as setas, para mudar a ordem.</p>
    ${list.length ? `
    <ol class="rk-list">
      ${list.map((n, i) => `
      <li class="rk-item" draggable="true" data-id="${n.id}">
        <span class="rk-grip" title="Arraste para reordenar"><i data-icon="grip"></i></span>
        <span class="rk-num">${i + 1}</span>
        <span class="rk-thumb" style="background-image:url('${esc(imgUrl(n.image))}');${bgPos(coverPos(n))}"></span>
        <span class="rk-text"><strong>${esc(n.title) || 'Sem título'}</strong><small>${esc(n.cat)} · ${fmtDate(n.date)}</small></span>
        <span class="bi-actions">
          <button class="icon-btn neutral rk-up" data-ract="up" title="Mover para cima" ${i === 0 ? 'disabled' : ''}><i data-icon="chevron"></i></button>
          <button class="icon-btn neutral" data-ract="down" title="Mover para baixo" ${i === list.length - 1 ? 'disabled' : ''}><i data-icon="chevron"></i></button>
          <button class="icon-btn star-btn on" data-ract="unstar" title="Remover da tela inicial"><i data-icon="star"></i></button>
        </span>
      </li>`).join('')}
    </ol>` : `<div class="rk-empty"><i data-icon="star"></i><strong>Nenhuma notícia na tela inicial</strong><span>Marque notícias com a estrela na lista abaixo.</span></div>`}
    <div class="panel-foot">
      <span>Até <b>${MAX_RECENT} notícias</b>. A primeira aparece aberta.</span>
      <a class="btn-soft" href="#dashboard"><i data-icon="external"></i>Ver na tela inicial</a>
    </div>`;
  paintIcons(panel);
}

/* =========================================================
   ACESSO RESTRITO (senha antes de abrir um sistema)
   O endereço de destino fica criptografado com a própria senha (AES-GCM,
   chave derivada por PBKDF2): sem a senha certa não é possível descobri-lo.
   Para trocar senha ou link, gere um novo bloco com HC_lockLink(url, senha).
   ========================================================= */
const LOCKED_LINKS = {
  semipresencial: {
    title: 'Sistema Semipresencial',
    salt: 'wAQLLGsqFsD+BVg1T/Kf/g==', iv: 'IE3/lY3FB/J56sKA',
    data: '84SrvteffUlK0qls1NGAv0E23ShnamX1cJvecZqLe9Kur1gYuQkHZOqlwrHK',
  },
  // Configurações: o conteúdo cifrado é só uma confirmação ("hc-config-ok")
  config: {
    title: 'Configurações',
    sub: 'Área restrita à equipe do polo. Digite a senha para continuar.',
    salt: 'uPiwFtLM7Gqma51QN/H2xQ==', iv: 'ZJXH826ONPxbj/Mt',
    data: '0auLW64GLet+bn0wWjFywQuGUHMjxjq7WfbmRA==',
  },
};
const LOCK_ITER = 250000;
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
async function lockKey(pass, salt, usage) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: LOCK_ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, [usage]);
}
async function unlockLink(item, pass) {
  try {
    const key = await lockKey(pass, fromB64(item.salt), 'decrypt');
    const out = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(item.iv) }, key, fromB64(item.data));
    return new TextDecoder().decode(out);
  } catch { return null; } // senha errada
}
window.HC_lockLink = async (url, pass) => {
  const b64 = (u) => btoa(String.fromCharCode(...new Uint8Array(u)));
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await lockKey(pass, salt, 'encrypt'), new TextEncoder().encode(url));
  return { salt: b64(salt), iv: b64(iv), data: b64(ct) };
};

/* Pop-up de senha. onOk recebe o conteúdo decifrado; onCancel é chamado ao fechar sem entrar. */
function openLock(id, onOk = (url) => openUnlocked(url), onCancel) {
  const item = LOCKED_LINKS[id];
  if (!item || document.querySelector('.lk')) return;
  const wrap = document.createElement('div');
  wrap.className = 'lk';
  wrap.innerHTML = `
    <div class="lk-backdrop"></div>
    <form class="lk-card" role="dialog" aria-modal="true" aria-labelledby="lk-title" autocomplete="off">
      <span class="lk-icon"><i data-icon="lock"></i></span>
      <h2 id="lk-title">${esc(item.title)}</h2>
      <p class="lk-sub">${esc(item.sub || 'Acesso restrito a pessoas autorizadas. Digite a senha para continuar.')}</p>
      <div class="lk-field">
        <input type="password" id="lk-pass" placeholder="Senha de acesso" aria-label="Senha de acesso" autocomplete="off" spellcheck="false">
        <button type="button" class="lk-eye" aria-label="Mostrar senha"><i data-icon="eye"></i></button>
      </div>
      <p class="lk-msg" role="alert"></p>
      <div class="lk-actions">
        <button type="button" class="btn-soft lk-cancel">Cancelar</button>
        <button type="submit" class="btn-dark lk-go">Entrar</button>
      </div>
    </form>`;
  document.body.appendChild(wrap);
  paintIcons(wrap);
  const card = wrap.querySelector('.lk-card');
  const input = wrap.querySelector('#lk-pass');
  const msg = wrap.querySelector('.lk-msg');
  const go = wrap.querySelector('.lk-go');
  const eye = wrap.querySelector('.lk-eye');
  const lastFocus = document.activeElement;
  requestAnimationFrame(() => wrap.classList.add('in'));
  setTimeout(() => input.focus(), 60);

  let done = false;
  const close = () => {
    if (!done) onCancel?.();
    document.removeEventListener('keydown', onKey);
    wrap.classList.remove('in');
    setTimeout(() => wrap.remove(), 300);
    lastFocus?.focus?.({ preventScroll: true });
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = [...card.querySelectorAll('input, button')];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  wrap.querySelector('.lk-backdrop').addEventListener('click', close);
  wrap.querySelector('.lk-cancel').addEventListener('click', close);
  eye.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    eye.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    eye.innerHTML = `<i data-icon="${show ? 'eyeoff' : 'eye'}"></i>`; paintIcons(eye);
    input.focus();
  });
  input.addEventListener('input', () => { msg.textContent = ''; card.classList.remove('error'); });

  card.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input.value) { input.focus(); return; }
    go.disabled = true; go.textContent = 'Verificando…';
    const url = await unlockLink(item, input.value);
    go.disabled = false; go.textContent = 'Entrar';
    if (!url) {
      msg.textContent = 'Senha incorreta. Tente novamente.';
      card.classList.remove('error'); void card.offsetWidth; card.classList.add('error');
      input.select();
      return;
    }
    done = true;
    if (onOk(url, msg, close) !== false) close();
  });
}
/* Editor de enquadramento: escolhe o ponto da foto que deve ficar sempre visível.
   Resolve com "x% y%" (ou '' para o padrão) ao salvar, ou null ao cancelar. */
function focusEditor({ src, pos }) {
  return new Promise((resolve) => {
    if (document.querySelector('.lk')) return resolve(null);
    const url = imgUrl(src);
    const m = /^([\d.]+)% ([\d.]+)%$/.exec(pos || '');
    let x = m ? +m[1] : 50, y = m ? +m[2] : 35;
    const wrap = document.createElement('div');
    wrap.className = 'lk fe';
    wrap.innerHTML = `
      <div class="lk-backdrop"></div>
      <div class="lk-card fe-card" role="dialog" aria-modal="true" aria-labelledby="fe-title">
        <h2 id="fe-title">Enquadrar imagem</h2>
        <p class="lk-sub">Clique ou arraste o ponto até o rosto ou a parte mais importante da foto. Ela continua visível em todos os tamanhos.</p>
        <div class="fe-grid">
          <div class="fe-stage-wrap">
            <div class="fe-stage" tabindex="0" role="slider" aria-label="Ponto de enquadramento (use as setas)">
              <img src="${esc(url)}" alt="" draggable="false">
              <span class="fe-dot" aria-hidden="true"></span>
            </div>
          </div>
          <div class="fe-previews">
            <figure><div class="fe-pv fe-wide" style="background-image:url('${esc(url)}')"></div><figcaption>Notícia aberta</figcaption></figure>
            <figure><div class="fe-pv fe-tall" style="background-image:url('${esc(url)}')"></div><figcaption>Cartão</figcaption></figure>
          </div>
        </div>
        <div class="fe-actions">
          <button type="button" class="btn-soft fe-reset"><i data-icon="focus"></i>Centralizar</button>
          <span class="fe-space"></span>
          <button type="button" class="btn-soft fe-cancel">Cancelar</button>
          <button type="button" class="btn-dark fe-save">Salvar</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    paintIcons(wrap);
    const card = wrap.querySelector('.lk-card');
    const stage = wrap.querySelector('.fe-stage');
    const dot = wrap.querySelector('.fe-dot');
    const pvs = wrap.querySelectorAll('.fe-pv');
    const lastFocus = document.activeElement;
    const paint = () => {
      const p = `${Math.round(x)}% ${Math.round(y)}%`;
      dot.style.left = x + '%'; dot.style.top = y + '%';
      pvs.forEach((el) => { el.style.backgroundPosition = p; });
      stage.setAttribute('aria-valuetext', `horizontal ${Math.round(x)}%, vertical ${Math.round(y)}%`);
    };
    const setFrom = (e) => {
      const r = stage.getBoundingClientRect();
      x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
      y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
      paint();
    };
    paint();
    requestAnimationFrame(() => wrap.classList.add('in'));
    setTimeout(() => stage.focus({ preventScroll: true }), 60);

    stage.addEventListener('pointerdown', (e) => {
      e.preventDefault(); stage.focus({ preventScroll: true });
      stage.setPointerCapture(e.pointerId); stage.classList.add('dragging'); setFrom(e);
    });
    stage.addEventListener('pointermove', (e) => { if (stage.hasPointerCapture(e.pointerId)) setFrom(e); });
    const stop = (e) => { if (stage.hasPointerCapture?.(e.pointerId)) stage.releasePointerCapture(e.pointerId); stage.classList.remove('dragging'); };
    stage.addEventListener('pointerup', stop);
    stage.addEventListener('pointercancel', stop);
    stage.addEventListener('keydown', (e) => {
      const d = e.shiftKey ? 10 : 2;
      const mv = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] }[e.key];
      if (!mv) return;
      e.preventDefault();
      x = Math.min(100, Math.max(0, x + mv[0])); y = Math.min(100, Math.max(0, y + mv[1])); paint();
    });

    const close = (result) => {
      document.removeEventListener('keydown', onKey);
      wrap.classList.remove('in');
      setTimeout(() => wrap.remove(), 300);
      lastFocus?.focus?.({ preventScroll: true });
      resolve(result);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close(null);
      if (e.key === 'Tab') {
        const f = [stage, ...card.querySelectorAll('button')];
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    wrap.querySelector('.lk-backdrop').addEventListener('click', () => close(null));
    wrap.querySelector('.fe-cancel').addEventListener('click', () => close(null));
    wrap.querySelector('.fe-reset').addEventListener('click', () => { x = 50; y = 50; paint(); });
    wrap.querySelector('.fe-save').addEventListener('click', () => close(`${Math.round(x)}% ${Math.round(y)}%`));
  });
}

/* Pop-up de confirmação (mesmo visual do pop-up de senha). Resolve true se confirmado. */
function confirmDialog({ title, sub = '', image = '', ok = 'Excluir', icon = 'trash' }) {
  return new Promise((resolve) => {
    if (document.querySelector('.lk')) return resolve(false);
    const wrap = document.createElement('div');
    wrap.className = 'lk lk-confirm';
    wrap.innerHTML = `
      <div class="lk-backdrop"></div>
      <div class="lk-card" role="alertdialog" aria-modal="true" aria-labelledby="cf-title" aria-describedby="cf-sub">
        ${image
          ? `<span class="cf-thumb" style="background-image:url('${esc(image)}')"><span class="cf-badge"><i data-icon="${icon}"></i></span></span>`
          : `<span class="lk-icon cf-icon"><i data-icon="${icon}"></i></span>`}
        <h2 id="cf-title">${esc(title)}</h2>
        <p class="lk-sub" id="cf-sub">${esc(sub)}</p>
        <div class="lk-actions">
          <button type="button" class="btn-soft cf-cancel">Cancelar</button>
          <button type="button" class="btn-dark btn-danger cf-ok">${esc(ok)}</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    paintIcons(wrap);
    const card = wrap.querySelector('.lk-card');
    const cancel = wrap.querySelector('.cf-cancel');
    const lastFocus = document.activeElement;
    requestAnimationFrame(() => wrap.classList.add('in'));
    setTimeout(() => cancel.focus(), 60); // foco no "Cancelar": Enter não exclui por engano

    const close = (result) => {
      document.removeEventListener('keydown', onKey);
      wrap.classList.remove('in');
      setTimeout(() => wrap.remove(), 300);
      lastFocus?.focus?.({ preventScroll: true });
      resolve(result);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close(false);
      if (e.key === 'Tab') {
        const f = [...card.querySelectorAll('button')];
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    wrap.querySelector('.lk-backdrop').addEventListener('click', () => close(false));
    cancel.addEventListener('click', () => close(false));
    wrap.querySelector('.cf-ok').addEventListener('click', () => close(true));
  });
}

/* Abre o sistema liberado em nova guia (com alternativa se o navegador bloquear) */
function openUnlocked(url, msg, close) {
  const win = window.open(url, '_blank', 'noopener');
  if (win === null && !document.hidden) {
    msg.innerHTML = `<a class="lk-open" href="${esc(url)}" target="_blank" rel="noopener">Abrir o sistema</a>`;
    msg.classList.add('ok');
    msg.querySelector('a').addEventListener('click', () => setTimeout(close, 100));
    return false;
  }
}

/* Configurações: liberadas só nesta guia, até ela ser fechada ou a sessão ser encerrada */
const CONFIG_FLAG = 'hc:config-ok';
const configUnlocked = () => { try { return sessionStorage.getItem(CONFIG_FLAG) === '1'; } catch { return false; } };
const setConfigUnlocked = (on) => { try { on ? sessionStorage.setItem(CONFIG_FLAG, '1') : sessionStorage.removeItem(CONFIG_FLAG); } catch {} };
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-locked]'); if (!a) return;
  e.preventDefault();
  openLock(a.dataset.locked);
});

/* =========================================================
   Páginas ainda não construídas
   ========================================================= */
const TITLES = {
  relatorio: 'Relatório Mensal', seguranca: 'Segurança', ajuda: 'Ajuda / Suporte',
};
/* Cabeçalho editorial: rótulo pequeno, título grande e uma linha de apoio */
function pageHead(kicker, title, sub) {
  return `
    <header class="page-head">
      <p class="page-kicker">${kicker}</p>
      <h1 class="page-title">${title}</h1>
      ${sub ? `<p class="page-sub">${sub}</p>` : ''}
    </header>`;
}
function renderPlaceholder(view, route) {
  view.innerHTML = `
  <div class="wrap">
    <section class="soon">
      ${pageHead(TITLES[route], 'Em breve.', 'Estamos preparando esta área com cuidado. Enquanto isso, você pode voltar ao início.')}
      <a class="btn-dark" href="#dashboard">Voltar ao Dashboard</a>
    </section>
  </div>`;
}

/* =========================================================
   Roteador
   ========================================================= */
let lastRoute = 'dashboard';
function route() {
  const r = (location.hash || '#dashboard').slice(1);
  if (r === 'sair') { setConfigUnlocked(false); toast('Sessão encerrada'); history.replaceState(null, '', '#dashboard'); return route(); }
  // Configurações pedem senha: fica na página atual até a senha certa ser digitada
  if (r.split('/')[0] === 'config' && !configUnlocked()) {
    history.replaceState(null, '', '#' + lastRoute);
    if (!document.querySelector('.lk')) {
      if (!$('#view').childElementCount) route(); // primeira carga direto em #config
      openLock('config', (ok) => {
        if (ok !== 'hc-config-ok') return;
        setConfigUnlocked(true);
        location.hash = '#' + r;
      });
    }
    return;
  }
  lastRoute = r;
  const view = $('#view');
  document.querySelectorAll('.nm, .nm-ghost').forEach((el) => el.remove());
  document.body.classList.remove('modal-open');
  document.querySelectorAll('.sb-item[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === r.split('/')[0]));
  if (r === 'config') renderConfig(view);
  else if (r === 'config/noticias') renderNewsAdmin(view);
  else if (r === 'noticias') renderNews(view);
  else if (TITLES[r]) renderPlaceholder(view, r);
  else renderDashboard(view);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);

/* sombra um pouco mais forte na barra superior ao rolar a página */
(() => {
  const wrap = document.getElementById('topbar-wrap');
  if (!wrap) return;
  let ticking = false;
  const update = () => { ticking = false; wrap.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
// Atalho Ctrl/⌘ + K para a busca
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#search').focus(); }
});
paintIcons();
(async () => {
  try {
    await migrateDataUrls();
    await loadImages();
    cleanupImages();
    navigator.storage?.persist?.(); // pede ao navegador para não apagar as imagens
  } catch (e) { console.warn('Imagens:', e); }
  paintLogo();
  route();
})();
