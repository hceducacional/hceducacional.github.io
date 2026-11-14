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
  plusCircle: '<circle cx="12" cy="12" r="9.5"/><path d="M12 8v8M8 12h8"/>',
  userPlus: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2.5 2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  shieldOff: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 1.6-.25 3-.9 4.2-1.85M19.6 15.4c.27-1.1.4-2.2.4-3.4V6l-8-3-3.6 1.35"/><path d="m3 3 18 18"/>',
  alert: '<path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17.2v.1"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20.5h7M10 17h4l.5 3.5h-5Z"/>',
  building: '<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6M3 21h18M9 10h.01M15 10h.01"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  party: '<path d="M4 20 9 6l9 9Z"/><path d="M13 3v2M19 9h2M16.5 5.5 18 4M15 2.5l.5.5M21 13l.5.5"/>',
  smartphone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l8 5V5L7 10H4a1 1 0 0 0-1 1Z"/><path d="M18.5 9a4 4 0 0 1 0 6M7 14l1 6h3l-1-5.5"/>',
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
  more: '<circle cx="5" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="19" cy="12" r="1.7" fill="currentColor"/>',
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

/* Conteúdo do site (banners, notícias...): salvo neste navegador e, quando quem edita é
   administrador, enviado ao Supabase para aparecer para todos (veja auth.js) */
function saveShared(key, value) {
  cleanupImages();
  const ok = store.set(key, value);
  if (ok) window.HC_queuePush?.(key);
  return ok;
}

const MAX_BANNERS = 5;
const SLIDE_MS = 10000;
const RECENT_MS = 16000; // tempo de cada notícia recente na tela inicial
const RECENT_AUTO = 5;   // quantas notícias recentes se abrem sozinhas, em sequência
const PHONE = () => matchMedia("(max-width: 860px)").matches; // celular (barra de abas embaixo)
const DEFAULT_BANNERS = [
  { id: 'b1', image: 'assets/banner-1.svg', pill: 'Notícias do Polo', title: 'Bem-vindo ao Semipresencial FAVENIHC', desc: 'Centralize chamadas, alunos e relatórios do seu polo em um só lugar.' },
  { id: 'b2', image: 'assets/banner-2.svg', pill: 'ConsultaEDU', title: 'Novas atividades regularmente', desc: 'Mantenha os links das disciplinas atualizados através do ConsultaEDU' },
];
/* Conteúdo publicado (content.js) tem prioridade sobre os exemplos embutidos */
const PUBLISHED = window.HC_CONTENT || {};
let banners = store.get('banners', PUBLISHED.banners || DEFAULT_BANNERS);
const saveBanners = () => saveShared('banners', banners);

/* Somente no HC Instituto Educacional: segundo carrossel (jogos, materiais de estudo...) */
const DEFAULT_EXCLUSIVE = [
  { id: 'x1', image: 'assets/hc-exclusivo.svg', pill: 'Exclusivo HC', title: 'Criado aqui, pensado para você',
    desc: 'Jogos, materiais de estudo e projetos feitos pela nossa equipe para turbinar o seu aprendizado.' },
];
let exclusive = store.get('exclusive', PUBLISHED.exclusive || DEFAULT_EXCLUSIVE);
const saveExclusive = () => saveShared('exclusive', exclusive);

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
const saveLinks = () => saveShared('links', links);
/* Mantenha-se conectado: 4 blocos fixos (1 grande, 1 largo e 2 menores) */
const DEFAULT_CONNECT = [
  { id: 'c1', title: 'Siga o HC no Instagram', desc: 'Novidades, eventos e bastidores do polo em @hceducacional.', url: 'https://www.instagram.com/hceducacional/', image: '', whatsapp: '' },
  { id: 'c2', title: 'FAVENI no Instagram', desc: 'Formaturas, entrevistas e promoções em @favenihc.', url: 'https://www.instagram.com/favenihc/', image: '' },
  { id: 'c3', title: 'Agende seu atendimento', desc: 'Escolha o melhor horário para ser atendido no polo.', url: 'https://prova-facil-favenihc.lovable.app/', image: '' },
  { id: 'c4', title: 'Fale conosco', desc: 'Tire dúvidas sobre matrículas, documentos e prazos.', url: '', image: '' },
];
const CONNECT_DESC_MAX = [320, 140, 140, 140]; // o bloco grande comporta um texto maior
/* WhatsApp do bloco grande: aceita qualquer formatação; DDD + número (o 55 do Brasil é opcional) */
const waDigits = (v = '') => {
  let d = String(v).replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) d = '55' + d;
  return /^55\d{10,11}$/.test(d) ? d : '';
};
const waDisplay = (d) => {
  const n = d.slice(2);
  return n.length === 11 ? `(${n.slice(0, 2)}) ${n[2]} ${n.slice(3, 7)}-${n.slice(7)}` : `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
};
const WA_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 8 19.6Z"/><path d="M9.2 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.7l-.5.6c.4.9 1.2 1.7 2.1 2.1l.6-.5c.2-.2.5-.2.7-.1l1.4.6c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.4-3.2-.5a8 8 0 0 1-2.8-2.8c-.9-1.6-.8-2.6-.5-3.2Z" fill="currentColor" stroke="none"/></svg>';
/* Instagram: aceita "@conta", "conta" ou o link do perfil; até 3 contas, separadas por espaço ou vírgula */
const igHandles = (v = '') => String(v).split(/[\s,;]+/)
  .map((h) => h.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '').replace(/^@/, ''))
  .filter((h) => /^[A-Za-z0-9._]{1,30}$/.test(h)).slice(0, 3);
const IG_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>';
/* letras que sobem em cascata (número do WhatsApp e @ do Instagram) */
const cascade = (text, start = 0) => [...text].map((ch, k) => `<span style="--d:${start + k}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
const CONNECT_SLOTS = [
  { name: 'Bloco grande', size: '1440 × 1080 px' },
  { name: 'Bloco largo', size: '2000 × 440 px' },
  { name: 'Bloco médio', size: '1200 × 600 px' },
  { name: 'Bloco pequeno', size: '800 × 640 px' },
];
let connect = store.get('connect', PUBLISHED.connect || DEFAULT_CONNECT);
connect = DEFAULT_CONNECT.map((d, i) => ({ ...d, ...(connect[i] || {}) })); // sempre 4 blocos
const saveConnect = () => saveShared('connect', connect);

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
const saveBrand = () => saveShared('brand', brandList);
const LOGO_DEFAULT = '<span class="h">H</span><span class="c">C</span>';
function paintLogo() { // barra lateral e (no celular) barra de cima
  const img = brandList[0]?.image;
  ['sb-logo', 'tb-logo'].forEach((id) => {
    const el = document.getElementById(id); if (!el) return;
    el.classList.toggle('has-img', !!img);
    el.innerHTML = img ? `<img src="${esc(imgUrl(img))}" alt="Logo">` : LOGO_DEFAULT;
  });
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
const IMG_MAX_W = { banner: 2560, news: 1920, link: 1000, logo: 512, connect: 2000, author: 400 }; // largura máxima por tipo
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

const allImageRefs = () => [...banners, ...exclusive, ...links, ...news, ...brandList, ...connect, ...authors, ...radar].flatMap((x) => [x.image, x.imageMobile, ...(x.gallery || [])]).filter(Boolean);
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
  for (const [list, save] of [[banners, saveBanners], [exclusive, saveExclusive], [links, saveLinks], [news, saveNews], [brandList, saveBrand], [connect, saveConnect], [authors, saveAuthors]]) {
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
    if (it.imageMobile) out.imageMobile = await one(it.imageMobile);
    if (Array.isArray(it.gallery)) out.gallery = (await Promise.all(it.gallery.map(one))).filter(Boolean);
    return out;
  }));
  return { banners: await conv(banners), exclusive: await conv(exclusive), links: await conv(links), news: await conv(news), brand: await conv(brandList), connect: await conv(connect), authors: await conv(authors), radar: await conv(radar) };
}
window.HC_exportContent = exportContent;

/* =========================================================
   DASHBOARD
   ========================================================= */
const carIndex = { top: 0, hc: 0 }; // banner atual de cada carrossel (mantido ao voltar para a tela inicial)

/* Carrossel de banners (usado no topo e em "Somente no HC") */
function carouselHTML(list, key) {
  return `
    <div class="car-box" data-car="${key}">
    <section class="carousel" aria-roledescription="carrossel">
      ${list.length ? `
        <div class="carousel-track">
          ${list.map((b, i) => `
            <div class="slide" aria-roledescription="slide" aria-label="${i + 1} de ${list.length}">
              <div class="slide-bg" style="--img:url('${esc(imgUrl(b.image))}')${b.imageMobile ? `;--img-m:url('${esc(imgUrl(b.imageMobile))}')` : ''}${b.imageMobile && VALID_POS.test(b.focusMobile || '') ? `;--pos-m:${b.focusMobile}` : ''}"></div>
              <div class="slide-text">
                ${b.pill ? `<span class="pill">${esc(b.pill)}</span>` : ''}
                <h2>${esc(b.title)}</h2>
                <p>${esc(b.desc)}</p>
                ${bannerLink(b) ? `<a class="slide-cta" href="${esc(bannerLink(b))}" target="_blank" rel="noopener noreferrer">Acessar ${CHEV_SVG}</a>` : ''}
              </div>
            </div>`).join('')}
        </div>
        ${list.length > 1 ? `
          <button class="car-arrow prev" data-dir="-1" aria-label="Banner anterior"><i data-icon="left"></i></button>
          <button class="car-arrow next" data-dir="1" aria-label="Próximo banner"><i data-icon="right"></i></button>` : ''}
      ` : `<div class="carousel-empty"><div><i data-icon="image"></i><strong>Nenhum banner cadastrado</strong><a href="#config">Adicionar banners em Configurações</a></div></div>`}
    </section>
    <div class="dots">
      ${list.length > 1 ? list.map((_, i) => `<button class="dot" data-i="${i}" aria-label="Banner ${i + 1}"><span class="dot-fill"></span></button>`).join('') : ''}
    </div>
    </div>`;
}

function renderDashboard(view) {
  view.innerHTML = `
  <div class="wrap">
    ${carouselHTML(banners, 'top')}

    ${links.length ? `<h2 class="shelf-title"><span class="ap-grad">Acesso rápido.</span><span> Portais das instituições parceiras, a um clique.</span></h2>` : ''}
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
      <h2 class="shelf-title"><span class="ap-grad">Notícias recentes.</span><span> Fique por dentro dos últimos acontecimentos.</span></h2>
      <div class="rn-row" id="rn-row">${recentNews().map(recentCard).join('')}</div>
      <div class="ap-paddles rn-paddles">
        <button class="ap-paddle" data-dir="-1" aria-label="Anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <button class="ap-paddle" data-dir="1" aria-label="Próximas">${CHEV_SVG}</button>
      </div>
    </section>` : ''}

    ${connectSection()}

    <section class="hcx" aria-label="Somente no HC Instituto Educacional">
      <h2 class="shelf-title"><span class="ap-grad">Somente no HC Instituto Educacional.</span></h2>
      <p class="shelf-sub">Jogos, materiais de estudo e projetos criados pela nossa equipe para deixar o seu aprendizado mais leve, criativo e divertido. Conteúdos que você só encontra aqui.</p>
      ${carouselHTML(exclusive, 'hc')}
    </section>
  </div>`;

  paintIcons(view);
  view.querySelectorAll('.car-box').forEach((box) => initCarousel(box, box.dataset.car === 'hc' ? exclusive : banners, box.dataset.car));
  initRecentNews();
  view.querySelector('.cx-grid')?.addEventListener('click', (e) => {
    const tile = e.target.closest('.cx-tile');
    if (!tile || e.target.closest('a')) return; // botões, número e @ abrem o próprio link
    // com mouse, a faixa já está visível: um clique abre o link
    if (matchMedia('(hover: hover)').matches) { tile.querySelector('.cx-go')?.click(); return; }
    // no toque, cada toque mostra/esconde a faixa (deslizar o dedo por cima não faz nada)
    const show = !tile.classList.contains('shown');
    view.querySelectorAll('.cx-tile.shown').forEach((t) => t.classList.remove('shown'));
    tile.classList.toggle('shown', show);
    if (!show) tile.blur();
  });
  // no toque, tocar fora dos blocos fecha a faixa aberta
  const closeCx = (e) => {
    if (!document.body.contains(view.querySelector('.cx-grid'))) return document.removeEventListener('click', closeCx);
    if (!e.target.closest('.cx-tile')) view.querySelectorAll('.cx-tile.shown').forEach((t) => t.classList.remove('shown'));
  };
  document.addEventListener('click', closeCx);
  // no toque (celular), a faixa sobe sozinha quando o bloco passa pelo centro da tela e recolhe quando ele sai
  if (matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
    const grid = view.querySelector('.cx-grid');
    const cxIO = new IntersectionObserver((entries) => {
      if (!document.body.contains(grid)) return cxIO.disconnect();
      entries.forEach((en) => en.target.classList.toggle('shown', en.isIntersecting));
    }, { rootMargin: '-45% 0px -45% 0px' }); // faixa de 10% no meio da tela
    grid?.querySelectorAll('.cx-tile').forEach((t) => cxIO.observe(t));
  }
  view.querySelector('.cx-grid')?.addEventListener('keydown', (e) => {
    const tile = e.target.closest('.cx-tile');
    if (tile && e.target === tile && e.key === 'Enter') tile.querySelector('.cx-go')?.click();
  });
  $('#quick-links')?.addEventListener('click', (e) => {
    const a = e.target.closest('[data-empty]'); if (!a) return;
    e.preventDefault();
    toast('Link ainda não configurado — defina em Configurações.');
  });
}

/* Mantenha-se conectado: blocos que revelam uma faixa de vidro fosco ao passar o mouse */
function connectSection() {
  return `
    <section class="cx" aria-label="Mantenha-se conectado com a instituição">
      <h2 class="shelf-title"><span class="ap-grad">Mantenha-se conectado</span><span> com a instituição.</span></h2>
      <div class="cx-grid">
        ${connect.map((c, i) => {
          const wa = waDigits(c.whatsapp);
          const url = wa ? `https://wa.me/${wa}` : normalizeUrl(c.url || '');
          const ok = isSafeUrl(url);
          const num = wa ? waDisplay(wa) : '';
          const ig = igHandles(c.instagram);
          return `
          <article class="cx-tile cx-${i + 1} ${ok ? 'has-link' : ''}" tabindex="0" aria-label="${esc(c.title)}">
            <div class="cx-bg" ${c.image ? `style="background-image:url('${esc(imgUrl(c.image))}')"` : ''}></div>
            <div class="cx-glass">
              <div class="cx-text">
                <h3>${esc(c.title)}</h3>
                ${c.desc ? `<p>${esc(c.desc)}</p>` : ''}
              </div>
              ${wa ? `
              <div class="cx-wa">
                <a class="cx-wa-num" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${esc(num)}">
                  <span class="cx-wa-ico">${WA_SVG}</span>
                  <span class="cx-wa-digits" aria-hidden="true">${cascade(num)}</span>
                </a>
                <a class="cx-go cx-wa-go" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${WA_SVG}Conecte-se no WhatsApp</a>
              </div>` : ig.length ? '' : ok ? `<a class="cx-go" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Acessar ${CHEV_SVG}</a>` : ''}
              ${ig.length ? `
              <div class="cx-ig">
                ${ig.map((h, k) => `
                <a class="cx-wa-num cx-ig-num" href="https://www.instagram.com/${esc(h)}/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @${esc(h)}" style="--row:${k}">
                  <span class="cx-wa-ico cx-ig-ico">${IG_SVG}</span>
                  <span class="cx-wa-digits" aria-hidden="true">${cascade('@' + h, k * 6)}</span>
                </a>`).join('')}
              </div>` : ''}
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>`;
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
    // no celular os cartões já mostram o texto: um toque abre a notícia
    if (!c.classList.contains('on') && !PHONE()) return activate(c); // no toque em telas maiores: 1º toque abre o cartão, o 2º abre a notícia
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
  // O item que sai mantém o zoom onde estava (classe "leaving") até terminar de sair da tela;
  // só depois, já fora de vista, ele volta ao início para repetir o efeito na próxima vez.
  const leaveTimers = new Map();
  const activate = (el) => all.forEach((sl) => {
    const on = sl === el;
    if (!on && sl.classList.contains('active')) {
      sl.classList.add('leaving');
      clearTimeout(leaveTimers.get(sl));
      leaveTimers.set(sl, setTimeout(() => sl.classList.remove('leaving'), 1400));
    }
    if (on) { clearTimeout(leaveTimers.get(sl)); sl.classList.remove('leaving'); }
    sl.classList.toggle('active', on);
  });
  // no salto da cópia para o item verdadeiro, o zoom continua exatamente do mesmo ponto
  const animTimes = (el) => new Map(el.getAnimations({ subtree: true }).map((a) => [a.animationName, a.currentTime]));
  const applyTimes = (el, t) => el.getAnimations({ subtree: true }).forEach((a) => {
    if (t.get(a.animationName) != null) a.currentTime = t.get(a.animationName);
  });
  const instant = (fn) => { track.classList.add('jump'); fn(); void track.offsetWidth; track.classList.remove('jump'); };
  const snap = () => {
    clearTimeout(snapTimer);
    if (pending === null) return;
    const p = pending; pending = null;
    const from = all.find((sl) => sl.classList.contains('active'));
    const times = from ? animTimes(from) : new Map();
    instant(() => {
      setPos(p); activate(all[p]);
      if (from) from.classList.remove('leaving');
      applyTimes(all[p], times);
    });
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

function initCarousel(box, list, key) {
  carIndex[key] = Math.min(carIndex[key] || 0, Math.max(list.length - 1, 0));
  const track = box.querySelector('.carousel-track');
  if (!track) return;
  const car = box.querySelector('.carousel');
  const dotsBox = box.querySelector('.dots');
  const dots = [...dotsBox.querySelectorAll('.dot')];
  document.documentElement.style.setProperty('--slide-ms', SLIDE_MS + 'ms');

  const loop = loopTrack(track, (i) => {
    carIndex[key] = i;
    dots.forEach((d, k) => {
      d.classList.remove('active');
      if (k === i) { void d.offsetWidth; d.classList.add('active'); } // reinicia a barra de progresso
    });
  });
  const go = (i, first) => loop.go(i, first);

  // O avanço automático acontece quando a barra de progresso do ponto ativo termina (pausa ao passar o mouse).
  dotsBox.addEventListener('animationend', (e) => {
    if (e.target.classList.contains('dot-fill')) go(carIndex[key] + 1);
  });
  dotsBox.addEventListener('click', (e) => {
    const b = e.target.closest('.dot'); if (b) go(+b.dataset.i);
  });
  car.addEventListener('click', (e) => {
    const b = e.target.closest('.car-arrow'); if (b) go(carIndex[key] + +b.dataset.dir);
  });
  car.addEventListener('mouseenter', () => box.classList.add('paused'));
  car.addEventListener('mouseleave', () => box.classList.remove('paused'));

  // deslizar no toque
  let x0 = null;
  car.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  car.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(carIndex[key] + (dx < 0 ? 1 : -1));
  });

  go(carIndex[key], true);
}

/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */
function renderConfig(view) {
  view.innerHTML = `
  <div class="wrap">
    ${pageHead('Configurações', 'Personalize o seu polo.', 'Escolha o que deseja editar. Cada ajuste abre em uma janela, é salvo automaticamente e aparece para todos que acessam o site.')}

    <div class="cfg-grid" id="acc-list">
      ${accSection('banners', 'image', 'Banners do topo', 'O carrossel de destaque da tela inicial: imagens, textos e botão “Acessar”.', 'count-banners', '<div id="banners-panel"></div>')}
      <a class="cfg-w" data-acc="news" href="#config/noticias">
        <span class="cfg-top"><span class="acc-icon cfg-ico"><i data-icon="news"></i></span><span class="count-badge">${news.length}</span></span>
        <strong class="cfg-title">Notícias</strong>
        <span class="cfg-sub">Publique e edite notícias e escolha quais aparecem na tela inicial.</span>
        <span class="cfg-open">Abrir página ${CHEV_SVG}</span>
      </a>
      ${accSection('exclusive', 'star', 'Somente no HC', 'Banners com as criações do instituto: jogos, materiais de estudo e muito mais.', 'count-exclusive', '<div id="exclusive-panel"></div>')}
      ${accSection('connect', 'monitor', 'Mantenha-se conectado', 'Os blocos de vidro fosco com WhatsApp, Instagram e links de atendimento.', 'count-connect', '<div id="connect-panel"></div>')}
      ${accSection('links', 'link', 'Acesso rápido', 'Atalhos para os portais das instituições parceiras, com imagem ou degradê.', 'count-links', '<div id="links-panel"></div>')}
      ${accSection('brand', 'image', 'Logo do painel', 'A imagem exibida no topo da barra lateral, em todas as páginas.', '', '<div id="brand-panel"></div>')}
      ${accSection('prefs', 'shield', 'Preferências', 'Ajustes de exibição e privacidade, e as fotos do radar da página de Notícias.', '', `
        <p class="desc">Ajustes de exibição aplicados neste navegador.</p>
        <div class="pref">
          <span class="pref-icon"><i data-icon="shield"></i></span>
          <div class="pref-text"><strong>Ocultar dados sensíveis</strong><span>CPF e telefone aparecem mascarados</span></div>
          <label class="switch"><input type="checkbox" id="pref-hide" ${prefs.hideSensitive ? 'checked' : ''}><span></span></label>
        </div>
        <h4 class="pref-h">Radar da página de Notícias</h4>
        <p class="desc">As 5 bolinhas que giram em volta do título "Acontece no HC". Toque na foto para trocar; sem foto, aparecem as iniciais do nome.</p>
        <div id="radar-panel"></div>`)}
    </div>
    <input type="file" id="file-link" accept="image/*" hidden>
    <input type="file" id="file-logo" accept="image/*" hidden>
    <input type="file" id="file-connect" accept="image/*" hidden>
    <input type="file" id="file-radar" accept="image/*" hidden>
  </div>`;
  paintIcons(view);
  initAccordion();

  $('#pref-hide').addEventListener('change', (e) => {
    prefs.hideSensitive = e.target.checked; store.set('prefs', prefs);
    toast('Preferência salva');
  });

  initBannerEditor('top');
  initBannerEditor('hc');
  initLinksPanel();
  initBrandPanel();
  initConnectPanel();
  initRadarPanel();
}

/* Preferências: pessoas do radar de Notícias (foto, enquadramento e nome) */
function drawRadarPanel() {
  const panel = $('#radar-panel'); if (!panel) return;
  panel.innerHTML = `<div class="au-list">${radar.map((r, k) => `
    <div class="au-item">
      <button class="au-photo" type="button" data-ract="photo" data-id="${esc(r.id)}" title="Trocar foto" style="--a:${RADAR_COLORS[k][0]};--b:${RADAR_COLORS[k][1]}">
        ${avatarHTML(r, 'au-avatar rd-avatar')}
        <span class="au-cam"><i data-icon="image"></i></span>
      </button>
      <div class="au-main">
        <input data-rfield="name" data-id="${esc(r.id)}" value="${esc(r.name)}" maxlength="40" aria-label="Nome da pessoa ${k + 1} do radar" placeholder="Nome">
        <span class="au-sub">${r.image ? 'Com foto' : 'Mostrando as iniciais'}</span>
      </div>
      <div class="au-actions">
        ${r.image ? `<button class="icon-btn neutral ${r.focus ? 'au-focus-set' : ''}" type="button" data-ract="focus" data-id="${esc(r.id)}" title="Enquadrar foto"><i data-icon="focus"></i></button>
        <button class="icon-btn" type="button" data-ract="rmphoto" data-id="${esc(r.id)}" title="Remover foto"><i data-icon="x"></i></button>` : ''}
      </div>
    </div>`).join('')}</div>`;
  paintIcons(panel);
}
function initRadarPanel() {
  const panel = $('#radar-panel'); if (!panel) return;
  let photoId = null;
  drawRadarPanel();
  panel.addEventListener('click', (e) => {
    const t = e.target.closest('[data-ract]'); if (!t) return;
    const r = radar.find((x) => x.id === t.dataset.id); if (!r) return;
    if (t.dataset.ract === 'photo') { photoId = r.id; $('#file-radar').click(); }
    if (t.dataset.ract === 'rmphoto') { r.image = ''; delete r.focus; saveRadar(); drawRadarPanel(); toast('Foto removida'); }
    if (t.dataset.ract === 'focus') {
      focusEditor({ src: r.image, pos: r.focus, round: true }).then((pos) => {
        if (pos === null) return;
        r.focus = pos; saveRadar(); drawRadarPanel(); toast('Enquadramento salvo');
      });
    }
  });
  panel.addEventListener('input', (e) => {
    const f = e.target.closest('[data-rfield]'); if (!f) return;
    const r = radar.find((x) => x.id === f.dataset.id); if (!r) return;
    r.name = f.value;
    const av = panel.querySelector(`[data-ract="photo"][data-id="${r.id}"] .avatar`);
    if (av && !r.image) av.innerHTML = `<span>${esc(initials(r.name))}</span>`;
    clearTimeout(panel._t); panel._t = setTimeout(saveRadar, 400);
  });
  $('#file-radar').addEventListener('change', async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    const r = radar.find((x) => x.id === photoId);
    if (!file || !r) return;
    const old = r.image, oldFocus = r.focus;
    r.image = await storeImage(file, 'author'); delete r.focus;
    if (saveRadar()) toast('Foto atualizada. Use o botão de enquadrar para centralizar o rosto.'); else { r.image = old; r.focus = oldFocus; }
    drawRadarPanel();
  });
}

/* Os dois carrosséis usam o mesmo editor */
const BANNER_SETS = {
  top: { list: () => banners, save: () => saveBanners(), panel: 'banners-panel', count: 'count-banners',
    intro: 'Imagens que se alternam a cada 10 segundos no topo da tela inicial. Os textos aparecem sobre a imagem.',
    fresh: { pill: 'Novidade', title: 'Novo banner', desc: 'Descrição do banner' } },
  hc: { list: () => exclusive, save: () => saveExclusive(), panel: 'exclusive-panel', count: 'count-exclusive',
    intro: 'Banners da seção “Somente no HC Instituto Educacional”, no fim da tela inicial: jogos, materiais de estudo e outras criações do instituto. Funcionam como os banners do topo.',
    fresh: { pill: 'Exclusivo HC', title: 'Nova criação do HC', desc: 'Descreva aqui o jogo, material ou projeto.' } },
};

function initBannerEditor(key) {
  const set = BANNER_SETS[key];
  const panel = $('#' + set.panel);
  // cada editor tem seus próprios seletores de arquivo
  const fileAdd = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*', multiple: true, hidden: true });
  const fileReplace = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*', hidden: true });
  const fileMobile = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*', hidden: true });
  panel.after(fileAdd, fileReplace, fileMobile);
  let replaceIdx = -1, mobileIdx = -1;
  drawBannerPanel(key);

  panel.addEventListener('click', (e) => {
    const list = set.list();
    const del = e.target.closest('[data-del]');
    const thumb = e.target.closest('[data-thumb]');
    const add = e.target.closest('[data-badd]');
    const mthumb = e.target.closest('[data-mthumb]'), mdel = e.target.closest('[data-mdel]'), mfocus = e.target.closest('[data-mfocus]');
    if (mthumb) { mobileIdx = +mthumb.dataset.mthumb; fileMobile.click(); return; }
    if (mdel) {
      const b = list[+mdel.dataset.mdel]; delete b.imageMobile; delete b.focusMobile;
      set.save(); drawBannerPanel(key); toast('No celular, este banner volta a usar a imagem do computador'); return;
    }
    if (mfocus) {
      const b = list[+mfocus.dataset.mfocus];
      focusEditor({ src: b.imageMobile, pos: b.focusMobile }).then((pos) => {
        if (pos === null || !list.includes(b)) return;
        b.focusMobile = pos; set.save(); drawBannerPanel(key); toast('Enquadramento salvo');
      });
      return;
    }
    if (del) {
      const i = +del.dataset.del;
      confirmDialog({
        title: 'Remover este banner?',
        sub: `"${list[i].title || 'Sem título'}" sairá do carrossel. Essa ação não pode ser desfeita.`,
        image: imgUrl(list[i].image), ok: 'Remover banner',
      }).then((yes) => {
        if (!yes || !list[i]) return;
        list.splice(i, 1); set.save(); drawBannerPanel(key); toast('Banner removido');
      });
    } else if (thumb) {
      replaceIdx = +thumb.dataset.thumb; fileReplace.click();
    } else if (add) {
      fileAdd.click();
    }
  });

  // edição de textos (salva automaticamente)
  panel.addEventListener('input', (e) => {
    const list = set.list();
    const f = e.target.closest('[data-field]'); if (!f) return;
    const i = +f.dataset.i;
    if (f.type === 'checkbox') {
      list[i][f.dataset.field] = f.checked;
      const box = f.closest('.bi-link');
      box.classList.toggle('on', f.checked);
      const url = box.querySelector('[data-field="url"]');
      if (f.checked) { url.removeAttribute('tabindex'); setTimeout(() => url.focus(), 250); } else url.setAttribute('tabindex', '-1');
      set.save(); return;
    }
    list[i][f.dataset.field] = f.value;
    if (f.dataset.field === 'title') panel.querySelector(`[data-sub="${i}"]`).textContent = f.value;
    clearTimeout(panel._t); panel._t = setTimeout(set.save, 300);
  });

  fileAdd.addEventListener('change', async (e) => {
    const list = set.list();
    const files = [...e.target.files].slice(0, MAX_BANNERS - list.length);
    e.target.value = '';
    if (!files.length) return;
    for (const file of files) {
      const image = await storeImage(file, 'banner');
      list.push({ id: key[0] + Date.now() + Math.random().toString(36).slice(2, 6), image, ...set.fresh });
    }
    if (set.save()) toast(files.length > 1 ? `${files.length} banners adicionados` : 'Banner adicionado');
    else list.splice(list.length - files.length, files.length);
    drawBannerPanel(key);
  });

  fileMobile.addEventListener('change', async (e) => {
    const list = set.list();
    const file = e.target.files[0]; e.target.value = '';
    const b = list[mobileIdx];
    if (!file || !b) return;
    const old = b.imageMobile, oldFocus = b.focusMobile;
    b.imageMobile = await storeImage(file, 'banner'); delete b.focusMobile;
    if (set.save()) toast('Imagem do celular salva'); else { b.imageMobile = old; b.focusMobile = oldFocus; }
    drawBannerPanel(key);
  });

  fileReplace.addEventListener('change', async (e) => {
    const list = set.list();
    const file = e.target.files[0]; e.target.value = '';
    if (!file || replaceIdx < 0 || !list[replaceIdx]) return;
    const old = list[replaceIdx].image;
    list[replaceIdx].image = await storeImage(file, 'banner');
    if (set.save()) toast('Imagem atualizada'); else list[replaceIdx].image = old;
    drawBannerPanel(key);
  });
}

function initConnectPanel() {
  const panel = $('#connect-panel');
  let imgIdx = -1;
  drawConnectPanel();
  panel.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cact]'); if (!t) return;
    const i = +t.dataset.i;
    if (t.dataset.cact === 'img') { imgIdx = i; $('#file-connect').click(); }
    if (t.dataset.cact === 'rmimg') { connect[i].image = ''; saveConnect(); drawConnectPanel(); toast('Imagem removida'); }
  });
  panel.addEventListener('input', (e) => {
    const f = e.target.closest('[data-cfield]'); if (!f) return;
    const i = +f.dataset.i;
    connect[i][f.dataset.cfield] = f.value;
    if (f.dataset.cfield === 'whatsapp') f.classList.toggle('invalid', !!f.value.trim() && !waDigits(f.value));
    if (f.dataset.cfield === 'instagram') f.classList.toggle('invalid', !!f.value.trim() && !igHandles(f.value).length);
    if (f.dataset.cfield === 'title') panel.querySelector(`[data-csub="${i}"]`).textContent = f.value || 'Sem título';
    clearTimeout(panel._t); panel._t = setTimeout(saveConnect, 300);
  });
  $('#file-connect').addEventListener('change', async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    if (!file || imgIdx < 0) return;
    const old = connect[imgIdx].image;
    connect[imgIdx].image = await storeImage(file, 'connect');
    if (saveConnect()) toast('Imagem aplicada'); else connect[imgIdx].image = old;
    drawConnectPanel();
  });
}

function drawConnectPanel() {
  const panel = $('#connect-panel');
  $('#count-connect').textContent = connect.length;
  panel.innerHTML = `
    <p class="desc">Quatro blocos exibidos abaixo das Notícias recentes. Ao passar o mouse, uma faixa de vidro fosco revela o título, a descrição e o botão “Acessar” (o botão só aparece se houver link). Sem imagem, o bloco usa um degradê.</p>
    ${connect.map((c, i) => `
      <div class="banner-item">
        <div class="bi-head">
          <button class="bi-thumb cx-thumb cx-${i + 1}" data-cact="img" data-i="${i}" title="Trocar imagem" ${c.image ? `style="background-image:url('${esc(imgUrl(c.image))}')"` : ''}></button>
          <div class="bi-meta">
            <span class="bi-badge">${CONNECT_SLOTS[i].name.toUpperCase()} · ${CONNECT_SLOTS[i].size}</span>
            <p data-csub="${i}">${esc(c.title) || 'Sem título'}</p>
          </div>
          <button class="btn-soft" data-cact="img" data-i="${i}"><i data-icon="image"></i>${c.image ? 'Trocar' : 'Imagem'}</button>
          ${c.image ? `<button class="icon-btn" data-cact="rmimg" data-i="${i}" title="Remover imagem (volta ao degradê)"><i data-icon="x"></i></button>` : ''}
        </div>
        <div class="bi-fields">
          <div class="field"><label>Título</label><input data-i="${i}" data-cfield="title" value="${esc(c.title)}" maxlength="60"></div>
          <div class="field"><label>Número do WhatsApp <em>(com DDD, opcional)</em></label><input data-i="${i}" data-cfield="whatsapp" value="${esc(c.whatsapp || '')}" placeholder="(98) 9 8765-4321" inputmode="tel" maxlength="20"></div>
          <div class="field full"><label>Contas do Instagram <em>(opcional, até 3, separadas por espaço)</em></label><input data-i="${i}" data-cfield="instagram" value="${esc(c.instagram || '')}" placeholder="@hceducacional @favenihc" maxlength="100" autocapitalize="off" spellcheck="false"></div>
          ${i === 0
            ? `<div class="field full"><label>Descrição <em>(até ${CONNECT_DESC_MAX[i]} caracteres)</em></label><textarea rows="3" data-i="${i}" data-cfield="desc" maxlength="${CONNECT_DESC_MAX[i]}">${esc(c.desc)}</textarea></div>`
            : `<div class="field full"><label>Descrição</label><input data-i="${i}" data-cfield="desc" value="${esc(c.desc)}" maxlength="${CONNECT_DESC_MAX[i]}"></div>`}
          <p class="cx-hint full">O número do WhatsApp e as contas do Instagram aparecem em destaque, com animação, e abrem direto a conversa ou o perfil. Com WhatsApp, o botão vira “Conecte-se no WhatsApp”; com Instagram, cada @ já é o link. Sem nenhum dos dois, o bloco usa o link abaixo.</p>
          <div class="field full"><label>Link do botão “Acessar” <em>(usado só sem WhatsApp)</em></label><input data-i="${i}" data-cfield="url" value="${esc(c.url || '')}" placeholder="https://www.exemplo.com.br" inputmode="url"></div>
        </div>
      </div>`).join('')}`;
  paintIcons(panel);
}

function drawBannerPanel(key = 'top') {
  const set = BANNER_SETS[key];
  const banners = set.list();
  const panel = $('#' + set.panel);
  $('#' + set.count).textContent = `${banners.length}/${MAX_BANNERS}`;
  panel.innerHTML = `
    <p class="desc">${set.intro}</p>

    ${banners.map((b, i) => `
      <div class="banner-item">
        <div class="bi-head">
          <button class="bi-thumb" data-thumb="${i}" title="Trocar imagem do computador" style="background-image:url('${esc(imgUrl(b.image))}')"><span class="bi-tag">Computador</span></button>
          <button class="bi-mthumb ${b.imageMobile ? 'has' : ''}" data-mthumb="${i}" title="${b.imageMobile ? 'Trocar imagem do celular' : 'Adicionar imagem só para celular (opcional)'}" ${b.imageMobile ? `style="background-image:url('${esc(imgUrl(b.imageMobile))}');${bgPos(b.focusMobile)}"` : ''}>${b.imageMobile ? '' : '<i data-icon="smartphone"></i>'}<span class="bi-tag">Celular</span></button>
          ${b.imageMobile ? `<span class="bi-mtools"><button class="icon-btn neutral" data-mfocus="${i}" title="Enquadrar imagem do celular"><i data-icon="focus"></i></button><button class="icon-btn" data-mdel="${i}" title="Remover imagem do celular (volta a usar a do computador)"><i data-icon="x"></i></button></span>` : ''}
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
      <span>Computador: <b>2560 × 673 px</b> · Celular (opcional): <b>1080 × 1350 px</b> — até ${MAX_BANNERS} banners.</span>
      <button class="btn-dark" data-badd="1" ${banners.length >= MAX_BANNERS ? 'disabled' : ''}><i data-icon="plus"></i>Adicionar banners</button>
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
/* mais recente primeiro; na mesma data, a cadastrada por último vem antes */
const byNewest = (a, b) => b.date.localeCompare(a.date) || (Number(b.id.slice(1)) || 0) - (Number(a.id.slice(1)) || 0);
const MAX_RECENT = 10;
if (!news.some((n) => 'star' in n)) { // conteúdo antigo: destaca as mais recentes
  [...news].sort(byNewest).slice(0, MAX_RECENT).forEach((n, i) => { n.star = true; n.rank = i; });
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
const saveNews = () => saveShared('news', news);

/* Autores das notícias: foto de perfil e nome; cada notícia escolhe quem a publicou */
/* Pessoas do radar da página de Notícias (as bolinhas que giram em volta do título) */
const RADAR_COLORS = [['#a78bfa', '#7c3aed'], ['#fbbf24', '#f97316'], ['#38bdf8', '#2563eb'], ['#f472b6', '#db2777'], ['#34d399', '#059669']];
const DEFAULT_RADAR = [
  { id: 'r1', name: 'Ana Lima', image: '' }, { id: 'r2', name: 'Maria Clara', image: '' }, { id: 'r3', name: 'João Pedro', image: '' },
  { id: 'r4', name: 'Rita Sousa', image: '' }, { id: 'r5', name: 'Bruno Ferreira', image: '' },
];
let radar = store.get('radar', PUBLISHED.radar || DEFAULT_RADAR);
const saveRadar = () => saveShared('radar', radar);
const DEFAULT_AUTHORS = [{ id: 'a1', name: 'Comunicação HC', image: '' }];
let authors = store.get('authors', PUBLISHED.authors || DEFAULT_AUTHORS);
const saveAuthors = () => saveShared('authors', authors);
// notícias antigas guardavam só o nome: liga ao autor com o mesmo nome
news.forEach((n) => { if (!n.authorId) { const a = authors.find((x) => x.name === n.author); if (a) n.authorId = a.id; } });
const newsAuthor = (n) => authors.find((a) => a.id === n.authorId) || { name: n.author || 'Comunicação HC', image: '' };
const initials = (name = '') => { // "Comunicação HC" → "CH" (ignora "de", "da", "do"...)
  const w = name.trim().split(/\s+/).filter(Boolean);
  const main = w.filter((x) => !/^(de|da|do|das|dos|e)$/i.test(x));
  return ((main.length ? main : w).slice(0, 2).map((x) => x[0]).join('') || '?').toUpperCase();
};
const avatarHTML = (a, cls = '') => `<span class="avatar ${cls}" aria-hidden="true">${a.image ? `<img src="${esc(imgUrl(a.image))}" alt=""${objPos(a.focus)}>` : `<span>${esc(initials(a.name))}</span>`}</span>`;
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
/* Um parágrafo só com "[imagem 2]" mostra essa imagem da notícia inteira (sem cortes) no meio do texto */
const BODY_IMG = /^\[imagem(?:\s+(\d+))?\]$/i;
const readTime = (n) => Math.max(1, Math.round([n.excerpt, ...n.body.filter((p) => !BODY_IMG.test(p.trim()))].join(' ').split(/\s+/).filter(Boolean).length / 200));
const CAT_CLASS = { Conquistas: 'c-gold', Infraestrutura: 'c-teal', 'Acadêmico': 'c-green', Eventos: 'c-purple', Comunicados: 'c-blue' };
// ícone e cores de cada categoria nos cartões de escolha (estilo Apple Store)
const CAT_TILE = {
  Todas: ['grid', '#3a3a3c', '#1d1d1f'],
  Conquistas: ['trophy', '#fbbf24', '#f59e0b'],
  Infraestrutura: ['building', '#2dd4bf', '#0d9488'],
  'Acadêmico': ['cap', '#34d399', '#059669'],
  Eventos: ['party', '#a78bfa', '#7c3aed'],
  Comunicados: ['megaphone', '#60a5fa', '#2563eb'],
};
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
        <h2><span class="ap-grad">${newsFilter === 'Todas' ? 'Mais notícias.' : `Mais em ${esc(newsFilter)}.`}</span><span> Fique por dentro de tudo o que acontece no polo.</span></h2>
      </div>
      <div class="ap-scroller">${rest.map(newsCard).join('')}</div>
      <div class="ap-paddles">
        <button class="ap-paddle" data-dir="-1" aria-label="Anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <button class="ap-paddle" data-dir="1" aria-label="Próximas">${CHEV_SVG}</button>
      </div>
    </section>` : ''}`;
}

/* Radar decorativo atrás do título de Notícias: ondas que pulsam e "usuários conectados" em órbita */
function newsRadar() {
  const people = radar.slice(0, 5).map((r, k) => [r, RADAR_COLORS[k][0], RADAR_COLORS[k][1], 1, k * 72]);
  // nas órbitas de dentro só pontinhos de luz, para não atrapalhar a leitura do título
  const sparks = [[2, 40], [2, 220], [3, 120], [3, 300]];
  return `
  <div class="nr" aria-hidden="true">
    <span class="nr-glow"></span>
    <span class="nr-ring"></span><span class="nr-ring"></span><span class="nr-ring"></span>
    <span class="nr-wave"></span><span class="nr-wave"></span><span class="nr-wave"></span>
    ${[1, 2, 3].map((o) => `<span class="nr-orbit o${o}">${people.filter((p) => p[3] === o).map(([t, a, b, , deg]) =>
      `<span class="nr-arm" style="--deg:${deg}deg"><span class="nr-user" style="--a:${a};--b:${b}">${t.image ? `<img src="${esc(imgUrl(t.image))}" alt=""${objPos(t.focus)}>` : esc(initials(t.name))}<i></i></span></span>`).join('')}${
      sparks.filter((p) => p[0] === o).map(([, deg]) => `<span class="nr-arm" style="--deg:${deg}deg"><span class="nr-spark"></span></span>`).join('')}</span>`).join('')}
  </div>`;
}

function renderNews(view) {
  const cats = ['Todas', ...NEWS_CATS.filter((c) => news.some((n) => n.cat === c))];
  if (!cats.includes(newsFilter)) newsFilter = 'Todas';

  view.innerHTML = `
  <div class="wrap news-page">
    <header class="ap-hero reveal">
      ${newsRadar()}
      <p class="ap-kicker">Notícias</p>
      <h1>Acontece no <span class="ap-grad">HC</span>.</h1>
      <p class="ap-sub">Conquistas, eventos e comunicados do HC Instituto Educacional, reunidos em um só lugar.</p>
    </header>
    <nav class="ap-pills reveal" role="tablist" aria-label="Categorias">
      <span class="ap-pill-ind" aria-hidden="true"></span>
      ${cats.map((c, k) => {
        const n = c === 'Todas' ? news.length : news.filter((x) => x.cat === c).length;
        const m = CAT_TILE[c] || CAT_TILE.Todas;
        return `<button class="ap-pill ${c === newsFilter ? 'on' : ''}" data-cat="${esc(c)}" role="tab" aria-selected="${c === newsFilter}" style="--a:${m[1]};--b:${m[2]};--k:${k}">
          <i data-icon="${m[0]}"></i><span>${esc(c)}</span><small>${n}</small>
        </button>`;
      }).join('')}
    </nav>
    <div class="news-body" id="news-body">${newsBodyHTML()}</div>
  </div>`;

  const page = view.querySelector('.news-page');
  const body = page.querySelector('#news-body');
  const seg = page.querySelector('.ap-pills');
  const ind = seg.querySelector('.ap-pill-ind');
  paintIcons(seg);
  // pílula colorida que desliza até a categoria escolhida (na cor dela)
  const moveInd = (instant) => {
    const on = seg.querySelector('.ap-pill.on'); if (!on) return;
    if (instant) ind.style.transition = 'none';
    ind.style.width = on.offsetWidth + 'px';
    ind.style.transform = `translateX(${on.offsetLeft}px)`;
    ind.style.setProperty('--a', on.style.getPropertyValue('--a'));
    ind.style.setProperty('--b', on.style.getPropertyValue('--b'));
    if (instant) { void ind.offsetWidth; ind.style.transition = ''; }
  };
  moveInd(true);
  new ResizeObserver(() => moveInd(true)).observe(seg);
  document.fonts?.ready.then(() => moveInd(true));
  // no celular a fileira rola de lado: mantém a categoria escolhida à vista
  const showOn = (smooth) => {
    const on = seg.querySelector('.on'); if (!on || seg.scrollWidth <= seg.clientWidth) return;
    seg.scrollTo({ left: on.offsetLeft - (seg.clientWidth - on.offsetWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
  };
  showOn(false);

  // troca de categoria: só o conteúdo abaixo muda, com transição suave
  let swapping = null;
  seg.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b || b.dataset.cat === newsFilter) return;
    newsFilter = b.dataset.cat;
    seg.querySelectorAll('button').forEach((x) => {
      const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on);
    });
    moveInd();
    showOn(true);
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
  page.querySelectorAll('.ap-hero.reveal, .ap-pills.reveal').forEach((el) => io.observe(el));

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
  const others = news.filter((x) => x.id !== n.id).sort(byNewest).slice(0, 2);
  const allItems = newsItems(n);
  if (!allItems.length) allItems.push({ src: n.image, pos: '' });
  // imagens usadas no meio do texto ([imagem N]) não entram na troca do topo (a capa sempre entra)
  const inText = new Set(n.body.map((p) => BODY_IMG.exec(p.trim())).filter(Boolean).map((m) => (+m[1] || 1) - 1));
  const items = allItems.filter((_, k) => k === 0 || !inText.has(k));
  const imgs = items.map((it) => it.src);
  const multi = items.length > 1;

  const wrap = document.createElement('div');
  wrap.className = 'nm';
  wrap.innerHTML = `
    <div class="nm-backdrop"></div>
    <div class="nm-scroll">
      <article class="nm-panel" role="dialog" aria-modal="true" aria-labelledby="nm-title">
        <div class="nm-top">
        <button class="nm-close" aria-label="Fechar notícia"><i data-icon="x"></i><span>Fechar</span></button>
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
          <div class="nm-byline">
            ${avatarHTML(newsAuthor(n), 'nm-avatar')}
            <span class="nm-by"><span>Por <strong>${esc(newsAuthor(n).name)}</strong></span><span>${fmtDate(n.date, true)}<span class="ap-sep">·</span>${readTime(n)} min de leitura</span></span>
          </div>
          <div class="nm-text">${n.body.map((p) => {
            const m = BODY_IMG.exec(p.trim());
            if (!m) return `<p>${esc(p)}</p>`;
            const it = allItems[(+m[1] || 1) - 1];
            return it ? `<figure class="nm-fig"><img src="${esc(imgUrl(it.src))}" alt="" loading="lazy"></figure>` : '';
          }).join('')}</div>
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

/* ---------- Configurações: widgets que abrem a edição em um pop-up ---------- */
let openSection = null; // seção com a janela de edição aberta
function accSection(key, ico, title, sub, countId, body) {
  return `
  <button class="cfg-w" type="button" data-acc="${key}" aria-haspopup="dialog">
    <span class="cfg-top">
      <span class="acc-icon cfg-ico"><i data-icon="${ico}"></i></span>
      ${countId ? `<span class="count-badge" id="${countId}"></span>` : ''}
    </span>
    <strong class="cfg-title">${title}</strong>
    <span class="cfg-sub">${sub}</span>
    <span class="cfg-open">Editar ${CHEV_SVG}</span>
  </button>
  <div class="cfg-modal" data-acc="${key}" data-modal="${key}" hidden>
    <div class="cfg-backdrop"></div>
    <div class="cfg-dialog panel" role="dialog" aria-modal="true" aria-labelledby="cfg-t-${key}">
      <header class="cfg-head">
        <span class="acc-icon cfg-ico"><i data-icon="${ico}"></i></span>
        <span class="acc-text"><strong id="cfg-t-${key}">${title}</strong><span>${sub}</span></span>
        <button class="cfg-close" type="button" aria-label="Fechar"><i data-icon="x"></i></button>
      </header>
      <div class="cfg-body">${body}</div>
    </div>
  </div>`;
}
function initAccordion() {
  const grid = $('#acc-list');
  // as janelas vão para o <body>: assim cobrem a tela toda (a página tem animação de entrada com transform)
  const modals = [...grid.querySelectorAll('.cfg-modal')];
  document.querySelectorAll('body > .cfg-modal').forEach((m) => m.remove());
  modals.forEach((m) => document.body.appendChild(m));
  let current = null, lastFocus = null;
  const onKey = (e) => {
    if (!current || document.querySelector('.lk')) return; // pop-ups de confirmação ficam por cima
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // mantém o foco dentro da janela
      const f = [...current.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')]
        .filter((el) => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  };
  function open(key, instant = false) {
    const m = modals.find((x) => x.dataset.modal === key); if (!m || m === current) return;
    if (current) close();
    current = m; openSection = key;
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.classList.add('modal-open');
    if (instant) m.classList.add('in'); else requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('in')));
    m.querySelector('.cfg-body').scrollTop = 0;
    setTimeout(() => m.querySelector('.cfg-close').focus({ preventScroll: true }), 60);
    document.addEventListener('keydown', onKey);
  }
  function close() {
    const m = current; if (!m) return;
    current = null; openSection = null;
    document.removeEventListener('keydown', onKey);
    m.classList.remove('in');
    document.body.classList.remove('modal-open');
    setTimeout(() => { if (!m.classList.contains('in')) m.hidden = true; }, 320);
    lastFocus?.focus?.({ preventScroll: true });
  }
  grid.addEventListener('click', (e) => {
    const w = e.target.closest('button.cfg-w'); if (w) open(w.dataset.acc);
  });
  modals.forEach((m) => m.addEventListener('click', (e) => {
    if (e.target.closest('.cfg-close') || e.target.classList.contains('cfg-backdrop')) close();
  }));
  // ao sair de Configurações, as janelas são removidas e a rolagem da página volta ao normal
  window.addEventListener('hashchange', () => {
    document.removeEventListener('keydown', onKey);
    if (current) document.body.classList.remove('modal-open');
    current = null;
    modals.forEach((m) => m.remove());
  }, { once: true });
  openSection = null;
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
const sortedNews = () => [...news].sort(byNewest);

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
    if (act === 'bodyimg') { // insere "[imagem 1]" como parágrafo próprio, onde está o cursor
      const ta = panel.querySelector(`[data-nfield="body"][data-id="${id}"]`); if (!ta) return;
      // nunca corta um parágrafo ao meio: insere depois do parágrafo onde está o cursor
      const cur = ta.selectionEnd ?? ta.value.length;
      const brk = ta.value.slice(cur).search(/\n\s*\n/);
      const at = brk < 0 ? ta.value.length : cur + brk;
      const before = ta.value.slice(0, at).replace(/\s*$/, ''), after = ta.value.slice(at).replace(/^\s*/, '');
      const tag = `[imagem ${Math.max(1, newsImages(n).length)}]`; // por padrão, a última imagem adicionada
      ta.value = [before, tag, after].filter(Boolean).join('\n\n');
      const pos = (before ? before.length + 2 : 0) + tag.length;
      ta.focus(); ta.setSelectionRange(pos - 2, pos - 1); // seleciona o número para trocar, se quiser
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
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
        id: 'n' + Date.now(), cat: 'Comunicados', date: todayIso(), author: authors[0]?.name || 'Comunicação HC', authorId: authors[0]?.id,
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
    else if (field === 'authorId') { // guarda também o nome (compatível com o conteúdo antigo)
      const a = authors.find((x) => x.id === f.value);
      if (a) { n.authorId = a.id; n.author = a.name; }
      const av = f.closest('.ni-author')?.querySelector('.avatar');
      if (av && a) av.outerHTML = avatarHTML(a, 'ni-avatar');
      if ($('#authors-panel')) setTimeout(drawAuthorsPanel, 350); // atualiza a contagem de notícias de cada autor
    } else n[field] = f.value;
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
          <div class="field"><label>Autor <em>(cadastre em “Autores”, acima)</em></label>
            <div class="ni-author">
              ${avatarHTML(newsAuthor(n), 'ni-avatar')}
              <select data-id="${n.id}" data-nfield="authorId">
                ${authors.map((a) => `<option value="${esc(a.id)}" ${a.id === newsAuthor(n).id ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}
                ${!authors.some((a) => a.id === n.authorId) ? `<option value="" selected>${esc(n.author || 'Escolha um autor')}</option>` : ''}
              </select>
            </div>
          </div>
          ${newsImagesField(n)}
          <div class="field full"><label>Resumo <em>(aparece no cartão)</em></label><textarea rows="2" data-id="${n.id}" data-nfield="excerpt" maxlength="260">${esc(n.excerpt)}</textarea></div>
          <div class="field full"><label>Texto completo <em>(aparece ao abrir a notícia)</em></label><textarea rows="9" data-id="${n.id}" data-nfield="body">${esc(n.body.join('\n\n'))}</textarea>
            <div class="ni-bodytools">
              <button class="btn-soft" type="button" data-nact="bodyimg" data-id="${n.id}"><i data-icon="image"></i>Inserir imagem inteira no texto</button>
              <span>Escreva <b>[imagem 2]</b> sozinho em um parágrafo para mostrar a imagem completa, sem cortes. O número é a ordem da imagem (1 = capa). Imagens usadas no texto não entram na troca de imagens do topo.</span>
            </div>
          </div>
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
        <span class="acc-icon ad-authors"><i data-icon="users"></i></span>
        <span class="acc-text"><strong>Autores</strong><span>Quem assina as notícias: foto de perfil e nome</span></span>
        <span class="count-badge" id="count-authors"></span>
      </header>
      <div class="ad-body" id="authors-panel"></div>
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
    <input type="file" id="file-author" accept="image/*" hidden>
  </div>`;
  paintIcons(view);
  initRecentPanel();
  initAuthorsPanel();
  initNewsPanel();
}

function initAuthorsPanel() {
  const panel = $('#authors-panel');
  let photoId = null;
  drawAuthorsPanel();
  const refresh = () => { drawAuthorsPanel(); if ($('#news-panel')?.childElementCount) drawNewsPanel(); };

  panel.addEventListener('click', (e) => {
    const t = e.target.closest('[data-aact]'); if (!t) return;
    const a = authors.find((x) => x.id === t.dataset.id);
    const act = t.dataset.aact;
    if (act === 'photo') { photoId = a.id; $('#file-author').click(); }
    if (act === 'rmphoto') { a.image = ''; delete a.focus; saveAuthors(); refresh(); toast('Foto removida'); }
    if (act === 'focus') {
      focusEditor({ src: a.image, pos: a.focus, round: true }).then((pos) => {
        if (pos === null || !authors.includes(a)) return;
        a.focus = pos; saveAuthors(); refresh(); toast('Enquadramento salvo');
      });
    }
    if (act === 'add') {
      const fresh = { id: 'a' + Date.now().toString(36), name: 'Novo autor', image: '' };
      authors.push(fresh); saveAuthors(); refresh();
      const inp = panel.querySelector(`[data-afield="name"][data-id="${fresh.id}"]`);
      inp?.focus(); inp?.select();
      toast('Autor adicionado. Escreva o nome e escolha uma foto.');
    }
    if (act === 'del') {
      if (authors.length <= 1) { toast('Mantenha pelo menos um autor'); return; }
      const used = news.filter((n) => n.authorId === a.id);
      const other = authors.find((x) => x.id !== a.id);
      confirmDialog({
        title: 'Remover este autor?',
        sub: used.length
          ? `${used.length} notícia${used.length > 1 ? 's' : ''} de “${a.name}” passa${used.length > 1 ? 'm' : ''} a ser assinada${used.length > 1 ? 's' : ''} por “${other.name}”.`
          : `“${a.name}” não assina nenhuma notícia.`,
        image: a.image ? imgUrl(a.image) : '', ok: 'Remover autor',
      }).then((yes) => {
        if (!yes || !authors.includes(a)) return;
        used.forEach((n) => { n.authorId = other.id; n.author = other.name; });
        authors = authors.filter((x) => x !== a);
        saveAuthors(); saveNews(); refresh(); toast('Autor removido');
      });
    }
  });

  panel.addEventListener('input', (e) => {
    const f = e.target.closest('[data-afield]'); if (!f) return;
    const a = authors.find((x) => x.id === f.dataset.id); if (!a) return;
    a.name = f.value;
    news.forEach((n) => { if (n.authorId === a.id) n.author = a.name; });
    const av = panel.querySelector(`[data-aact="photo"][data-id="${a.id}"] .avatar`);
    if (av && !a.image) av.innerHTML = `<span>${esc(initials(a.name))}</span>`;
    clearTimeout(panel._t);
    panel._t = setTimeout(() => {
      saveAuthors(); saveNews();
      if ($('#news-panel')?.childElementCount) drawNewsPanel();
    }, 400);
  });

  $('#file-author').addEventListener('change', async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    const a = authors.find((x) => x.id === photoId);
    if (!file || !a) return;
    const old = a.image;
    const oldFocus = a.focus;
    a.image = await storeImage(file, 'author'); delete a.focus;
    if (saveAuthors()) toast('Foto de perfil atualizada. Use o botão de enquadrar para centralizar o rosto.'); else { a.image = old; a.focus = oldFocus; }
    refresh();
  });
}

function drawAuthorsPanel() {
  const panel = $('#authors-panel');
  $('#count-authors').textContent = authors.length;
  panel.innerHTML = `
    <p class="desc">Cadastre quem publica as notícias. Na edição de cada notícia, escolha o autor: o nome e a foto aparecem, em um círculo, quando a notícia é aberta.</p>
    <div class="au-list">
      ${authors.map((a) => {
        const count = news.filter((n) => n.authorId === a.id).length;
        return `
        <div class="au-item">
          <button class="au-photo" type="button" data-aact="photo" data-id="${esc(a.id)}" title="Trocar foto de perfil">
            ${avatarHTML(a, 'au-avatar')}
            <span class="au-cam"><i data-icon="image"></i></span>
          </button>
          <div class="au-main">
            <input data-afield="name" data-id="${esc(a.id)}" value="${esc(a.name)}" maxlength="60" aria-label="Nome do autor" placeholder="Nome do autor">
            <span class="au-sub">${count ? `${count} notícia${count > 1 ? 's' : ''}` : 'Nenhuma notícia ainda'}</span>
          </div>
          <div class="au-actions">
            ${a.image ? `<button class="icon-btn ${a.focus ? 'au-focus-set' : ''}" type="button" data-aact="focus" data-id="${esc(a.id)}" title="Enquadrar foto"><i data-icon="focus"></i></button>
            <button class="icon-btn" type="button" data-aact="rmphoto" data-id="${esc(a.id)}" title="Remover foto"><i data-icon="x"></i></button>` : ''}
            <button class="icon-btn" type="button" data-aact="del" data-id="${esc(a.id)}" title="Remover autor" ${authors.length <= 1 ? 'disabled' : ''}><i data-icon="trash"></i></button>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="panel-foot">
      <span>Foto recomendada: <b>quadrada</b>, a partir de <b>400 × 400 px</b>.</span>
      <button class="btn-dark" type="button" data-aact="add"><i data-icon="plus"></i>Adicionar autor</button>
    </div>`;
  paintIcons(panel);
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

/* Editor de enquadramento: escolhe o ponto da foto que deve ficar sempre visível.
   Resolve com "x% y%" (ou '' para o padrão) ao salvar, ou null ao cancelar. */
function focusEditor({ src, pos, round = false }) { // round: prévias em círculo (foto de perfil)
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
            ${round ? `
            <figure><div class="fe-pv fe-round" style="background-image:url('${esc(url)}')"></div><figcaption>Foto de perfil</figcaption></figure>
            <figure><div class="fe-pv fe-round fe-round-sm" style="background-image:url('${esc(url)}')"></div><figcaption>Na notícia</figcaption></figure>` : `
            <figure><div class="fe-pv fe-wide" style="background-image:url('${esc(url)}')"></div><figcaption>Notícia aberta</figcaption></figure>
            <figure><div class="fe-pv fe-tall" style="background-image:url('${esc(url)}')"></div><figcaption>Cartão</figcaption></figure>`}
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

/* =========================================================
   INDICAR (em breve): alunos indicam amigos e ganham desconto
   ========================================================= */
function renderReferral(view) {
  const steps = [
    ['userPlus', 'Convide', 'Indique amigos, familiares e colegas que querem estudar. É só informar o nome e o contato de quem você conhece.'],
    ['users', 'Estudem juntos', 'Quando a pessoa indicada faz a matrícula, a secretaria do polo confirma a indicação.'],
    ['star', 'Ganhe desconto', 'Cada indicação válida vira desconto nas mensalidades do seu curso. Quanto mais amigos, mais você economiza.'],
  ];
  view.innerHTML = `
  <div class="wrap ref">
    <section class="ref-hero">
      <div class="ref-glow" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="ref-orb" aria-hidden="true">
        <span class="ref-ring r1"></span><span class="ref-ring r2"></span><span class="ref-ring r3"></span>
        <span class="ref-core"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg></span>
        <span class="ref-av a1">${initials('Ana Lima')}</span><span class="ref-av a2">${initials('João Pedro')}</span><span class="ref-av a3">${initials('Maria Clara')}</span>
      </div>
      <p class="ref-badge"><span class="ref-dot"></span>Em breve</p>
      <h1 class="ref-title"><span>Indique.</span> <span>Estudem juntos.</span> <span class="ap-grad">Ganhe desconto.</span></h1>
      <p class="ref-sub">Em breve, um espaço só seu para convidar quem você conhece a estudar no HC Instituto Educacional. A cada indicação válida, você ganha desconto na mensalidade do seu curso.</p>
    </section>
    <section class="ref-steps">
      ${steps.map(([ico, t, d], k) => `
      <article class="ref-step" style="--k:${k}">
        <span class="ref-num">0${k + 1}</span>
        <span class="ref-ico"><i data-icon="${ico}"></i></span>
        <h3>${t}</h3>
        <p>${d}</p>
      </article>`).join('')}
    </section>
    <p class="ref-note">Estamos preparando tudo com cuidado. Assim que estiver no ar, avisamos por aqui.</p>
  </div>`;
  paintIcons(view);
}

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
  if (r === 'sair') { if (window.HC_signOut) window.HC_signOut(); else toast('Sessão encerrada'); history.replaceState(null, '', '#dashboard'); return route(); }
  lastRoute = r;
  const view = $('#view');
  document.querySelectorAll('.nm, .nm-ghost').forEach((el) => el.remove());
  document.body.classList.remove('modal-open');
  document.querySelectorAll('.sb-item[data-route], .tab[data-route], .more-item[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === r.split('/')[0]));
  // "Mais" fica destacado quando a página atual está dentro dele
  document.getElementById('tab-more')?.classList.toggle('active', !!document.querySelector('.more-item.active'));
  // Configurações: só para administradores (conta do site, verificada pelo banco)
  if (r.split('/')[0] === 'config' && !window.HC_isAdmin?.()) window.HC_adminOnly?.(view, 'Configurações');
  else if (r === 'config') renderConfig(view);
  else if (r === 'config/noticias') renderNewsAdmin(view);
  else if (r === 'noticias') renderNews(view);
  else if (r === 'indicar') renderReferral(view);
  else if (window.HC_ROUTES?.[r]) window.HC_ROUTES[r](view);
  else if (TITLES[r]) renderPlaceholder(view, r);
  else renderDashboard(view);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);

/* Celular: folha "Mais" da barra de abas */
(() => {
  const more = document.getElementById('more'), btn = document.getElementById('tab-more');
  if (!more || !btn) return;
  const bar = document.getElementById('tabbar');
  const open = () => {
    bar?.classList.remove('compact'); bar?.classList.add('menu-open');
    more.hidden = false; btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => more.classList.add('in')));
  };
  const close = () => {
    if (more.hidden) return;
    more.classList.remove('in'); btn.setAttribute('aria-expanded', 'false');
    // a barra recupera o próprio fundo antes de o cartão sumir, sem piscar
    setTimeout(() => {
      if (more.classList.contains('in')) return;
      bar?.classList.remove('menu-open');
      setTimeout(() => { if (!more.classList.contains('in')) more.hidden = true; }, 320);
    }, 450);
  };
  btn.addEventListener('click', () => (more.hidden ? open() : close()));
  more.addEventListener('click', (e) => { if (e.target.closest('[data-more-close], .more-item')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !document.querySelector('.lk')) close(); });
  window.addEventListener('hashchange', close);
})();

/* Celular: barra de abas encolhe (só ícones) ao descer a página e volta com as legendas ao subir */
(() => {
  const bar = document.getElementById('tabbar');
  if (!bar) return;
  let last = window.scrollY, ticking = false;
  const update = () => {
    ticking = false;
    const y = Math.max(0, window.scrollY), dy = y - last;
    if (bar.classList.contains('menu-open')) { last = y; return; } // menu "Mais" aberto: não mexe
    if (y < 60) bar.classList.remove('compact');            // perto do topo: sempre aberta
    else if (dy > 6) bar.classList.add('compact');          // descendo
    else if (dy < -6) bar.classList.remove('compact');      // subindo
    else return;                                            // movimento pequeno: espera acumular
    last = y;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('hashchange', () => { bar.classList.remove('compact'); last = 0; });
})();

/* Celular: escolher a aba arrastando o dedo pela barra, como nos apps da Apple.
   Uma lente de vidro segue o dedo; ao soltar, abre a aba que estiver embaixo dele. */
(() => {
  const bar = document.getElementById('tabbar');
  if (!bar) return;
  const lens = document.createElement('span');
  lens.className = 'tab-lens'; lens.setAttribute('aria-hidden', 'true');
  bar.append(lens); // no fim, para não mudar a ordem das abas (cada aba tem sua cor pela posição)
  const tabs = () => [...bar.querySelectorAll('.tab')];
  let drag = null;
  const tabAt = (x) => tabs().find((t) => { const r = t.getBoundingClientRect(); return x >= r.left && x <= r.right; });
  const place = (x, snap) => {
    const br = bar.getBoundingClientRect();
    const t = tabAt(x) || drag.cur;
    const tr = t.getBoundingClientRect();
    const w = tr.width + 8;
    const left = snap ? tr.left - br.left - 4 : Math.min(Math.max(x - br.left - w / 2, 2), br.width - w - 2);
    lens.style.width = w + 'px';
    lens.style.transform = `translateX(${left}px)`;
    if (t !== drag.cur) { drag.cur?.classList.remove('pressing'); t.classList.add('pressing'); drag.cur = t; drag.moved = true; navigator.vibrate?.(8); }
  };
  bar.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || bar.classList.contains('menu-open')) return;
    const t = e.target.closest('.tab'); if (!t) return;
    drag = { id: e.pointerId, start: t, cur: null, moved: false, x0: e.clientX };
    try { bar.setPointerCapture(e.pointerId); } catch {}
    bar.classList.add('dragging');
    lens.style.transition = 'none';
    place(e.clientX, true);
    drag.moved = false;
    void lens.offsetWidth; lens.style.transition = '';
  });
  bar.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (Math.abs(e.clientX - drag.x0) > 6) drag.slid = true;
    if (drag.slid) place(e.clientX, false);
  });
  let suppressUntil = 0, synthetic = false;
  const end = (e, cancel) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { cur } = drag;
    if (cur) place(cur.getBoundingClientRect().left + 1, true); // a lente assenta sobre a aba escolhida e some
    drag = null;
    bar.classList.remove('dragging');
    tabs().forEach((t) => t.classList.remove('pressing'));
    if (cancel || !cur) return;
    // abre a aba que está embaixo do dedo ao soltar (toque simples ou arrastando)
    suppressUntil = Date.now() + 600; // o clique automático do navegador que vem depois é ignorado
    synthetic = true; cur.click(); synthetic = false;
  };
  bar.addEventListener('pointerup', (e) => end(e, false));
  bar.addEventListener('pointercancel', (e) => end(e, true));
  bar.addEventListener('click', (e) => {
    if (!synthetic && Date.now() < suppressUntil) { e.preventDefault(); e.stopPropagation(); }
  }, true);
})();

/* iPhone: o Safari ignora o "sem zoom" do cabeçalho; aqui o gesto de pinça é cancelado */
['gesturestart', 'gesturechange'].forEach((t) => document.addEventListener(t, (e) => e.preventDefault(), { passive: false }));
// (o toque duplo já não dá zoom por causa do touch-action no CSS)

/* sombra um pouco mais forte na barra superior ao rolar a página */
(() => {
  const wrap = document.getElementById('topbar-wrap');
  if (!wrap) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    wrap.classList.toggle('scrolled', window.scrollY > 8);
    // celular: longe do topo, a barra se recolhe (só pesquisa e foto); no topo, volta inteira
    wrap.classList.toggle('mini', PHONE() && window.scrollY > 40);
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
/* =========================================================
   HORÁRIO DE ATENDIMENTO (widget da barra de cima)
   Segunda a sexta: 8h30–11h30 e 14h30–17h30 · Sábado: 8h30–11h30 · Domingo: fechado
   ========================================================= */
const HOURS = { 0: [], 1: [[510, 690], [870, 1050]], 2: [[510, 690], [870, 1050]], 3: [[510, 690], [870, 1050]],
  4: [[510, 690], [870, 1050]], 5: [[510, 690], [870, 1050]], 6: [[510, 690]] }; // minutos desde 0h
// À noite (segunda a sexta, 18h–21h) há aulas dos cursos técnicos e de Informática, sem atendimento ao público
const CLASSES = { 1: [1080, 1260], 2: [1080, 1260], 3: [1080, 1260], 4: [1080, 1260], 5: [1080, 1260] };
const DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const DIAS_CURTO = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const hFala = (m) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`; // 510 → "8h30"
const dur = (m) => { m = Math.max(0, Math.round(m)); const h = Math.floor(m / 60), r = m % 60; return h ? `${h}h${r ? String(r).padStart(2, '0') : ''}` : `${r} min`; };

/* Situação do atendimento em um instante */
function hoursState(now = new Date()) {
  const dow = now.getDay();
  const min = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const today = HOURS[dow];
  const cur = today.find(([a, b]) => min >= a && min < b);
  // próximo turno a começar (hoje ou nos próximos dias)
  let next = null;
  for (let d = 0; d < 8 && !next; d++) {
    const day = (dow + d) % 7;
    const sh = HOURS[day].find(([a]) => d > 0 || a > min);
    if (sh) next = { d, day, start: sh[0], end: sh[1], at: d * 1440 + sh[0] };
  }
  // último encerramento (hoje ou nos dias anteriores), para medir o avanço até a reabertura
  let prev = null;
  for (let d = 0; d < 8 && !prev; d++) {
    const day = (dow - d + 7) % 7;
    const sh = [...HOURS[day]].reverse().find(([, b]) => d > 0 || b <= min);
    if (sh) prev = { at: -d * 1440 + sh[1] };
  }
  const hour = now.getHours();
  const night = hour >= 18 || hour < 6;
  const cls = CLASSES[dow];
  const backMsg = next ? `Voltamos ${!next ? '' : next.d === 0 ? 'hoje' : next.d === 1 ? 'amanhã' : `na ${DIAS[next.day].toLowerCase()}`} às ${hFala(next.start)}.` : '';
  if (cls && min >= cls[0] && min < cls[1]) {
    return {
      mode: 'classes', tone: 'evening', icon: 'moon',
      progress: (min - cls[0]) / (cls[1] - cls[0]), endLabel: hhmm(cls[1]), endSmall: 'aulas até',
      status: 'Aulas em andamento', statusTone: 'class',
      remaining: `Atendimento ao público encerrado`,
      message: `Agora estamos no horário das aulas dos cursos técnicos e de Informática, das ${hFala(cls[0])} às ${hFala(cls[1])}. Neste período não há atendimento ao público. ${backMsg}`,
    };
  }
  const when = !next ? '' : next.d === 0 ? 'hoje' : next.d === 1 ? 'amanhã' : `na ${DIAS[next.day].toLowerCase()}`;
  const whenShort = !next ? '' : next.d === 0 ? '' : next.d === 1 ? 'amanhã' : DIAS_CURTO[next.day].toLowerCase();
  if (cur) {
    const [a, b] = cur;
    const morning = a < 720;
    const saturday = dow === 6;
    const afterLunch = today.find(([x]) => x > b);
    return {
      mode: 'open', tone: morning ? 'morning' : 'afternoon', icon: 'sun',
      progress: (min - a) / (b - a), endLabel: hhmm(b), endSmall: 'até',
      status: 'Aberto agora', statusTone: 'ok',
      remaining: `Faltam ${dur(b - min)} para encerrar este turno`,
      message: morning
        ? (afterLunch ? `Pela manhã, nosso atendimento vai até as ${hFala(b)}. Retornamos às ${hFala(afterLunch[0])} e ficamos até as ${hFala(afterLunch[1])}.`
          : saturday ? `Aos sábados atendemos só pela manhã, até as ${hFala(b)}. Venha nos visitar!` : `Atendimento pela manhã até as ${hFala(b)}.`)
        : `À tarde, nosso atendimento vai até as ${hFala(b)}. Aproveite para tirar suas dúvidas com a nossa equipe!`,
    };
  }
  const span = next && prev ? next.at - prev.at : 1;
  const progress = next && prev ? (min - prev.at) / span : 0;
  const lunch = next && next.d === 0 && today.some(([, b]) => b <= min);
  if (lunch) {
    return {
      mode: 'break', tone: 'break', icon: 'sun', progress, endLabel: hhmm(next.start), endSmall: 'volta',
      status: 'Intervalo de almoço', statusTone: 'wait',
      remaining: `Retornamos em ${dur(next.start - min)}`,
      message: `Estamos no intervalo do almoço. Retornamos às ${hFala(next.start)} e ficamos até as ${hFala(next.end)}.`,
    };
  }
  const tone = night ? 'night' : hour < 9 ? 'dawn' : 'closed';
  return {
    mode: 'closed', tone, icon: night ? 'moon' : 'sun', progress, endLabel: next ? hhmm(next.start) : '--:--', endSmall: whenShort || 'abre',
    status: next && next.d === 0 ? 'Ainda não abrimos' : 'Fechado agora', statusTone: next && next.d === 0 ? 'wait' : 'off',
    remaining: next ? (next.d === 0 ? `Abrimos em ${dur(next.start - min)}` : `Voltamos ${when} às ${hFala(next.start)}`) : '',
    message: !next ? 'Atendimento indisponível no momento.'
      : !today.length ? `Hoje, ${DIAS[dow].toLowerCase()}, não temos atendimento. Voltamos ${when} às ${hFala(next.start)}. Bom descanso!`
      : next.d === 0 ? `${hour >= 5 ? 'Bom dia! ' : ''}Abrimos hoje às ${hFala(next.start)}. Estamos esperando por você.`
      : cls && min < cls[0] ? `Encerramos o atendimento ao público de hoje. Às ${hFala(cls[0])} começam as aulas da noite (cursos técnicos e Informática). Voltamos ${when} às ${hFala(next.start)}.`
      : next.day === 6 ? `Encerramos o atendimento de hoje. Voltamos ${when} às ${hFala(next.start)}, apenas pela manhã, até as ${hFala(next.end)}.`
      : `Encerramos o atendimento de hoje. Voltamos ${when} às ${hFala(next.start)}. Até lá!`,
  };
}

(() => {
  const el = $('#hours'); if (!el) return;
  const SUN = `<svg class="hw-sun" viewBox="0 0 32 32" aria-hidden="true"><g class="hw-rays">${Array.from({ length: 8 }, (_, i) => `<rect x="15" y="2" width="2" height="6" rx="1" transform="rotate(${i * 45} 16 16)"/>`).join('')}</g><circle class="hw-core" cx="16" cy="16" r="6.5"/></svg>`;
  const MOON = `<svg class="hw-moon" viewBox="0 0 32 32" aria-hidden="true"><path class="hw-crescent" d="M20.5 5.5a11 11 0 1 0 6 18.8A9.5 9.5 0 0 1 20.5 5.5z"/><circle class="hw-star s1" cx="9" cy="8" r="1.1"/><circle class="hw-star s2" cx="6" cy="15" r=".8"/></svg>`;
  const card = el.querySelector('.hw-card');
  let lastIcon = '';

  function paint() {
    const now = new Date();
    const st = hoursState(now);
    el.dataset.tone = st.tone; el.dataset.mode = st.mode;
    el.querySelector('.hw-wd').textContent = DIAS_CURTO[now.getDay()];
    el.querySelector('.hw-day').textContent = now.getDate();
    el.querySelector('.hw-time').textContent = hhmm(now.getHours() * 60 + now.getMinutes());
    // no celular o espaço é curto: rótulos longos ("amanhã", "aulas até") viram "abre"/"até"
    el.querySelector('.hw-end small').textContent = PHONE() && st.endSmall.length > 5 ? (st.mode === 'closed' ? 'abre' : 'até') : st.endSmall;
    el.querySelector('.hw-end b').textContent = st.endLabel;
    el.style.setProperty('--p', Math.min(1, Math.max(0, st.progress)).toFixed(4));
    if (st.icon !== lastIcon) { el.querySelector('.hw-ico').innerHTML = st.icon === 'moon' ? MOON : SUN; lastIcon = st.icon; }
    el.setAttribute('aria-label', `Horário de atendimento: ${st.status}. ${st.remaining}`);

    // linha do dia: 7h às 19h, com os turnos de hoje e o "agora"
    const min = now.getHours() * 60 + now.getMinutes();
    const from = 420, to = 1320, pos = (m) => ((Math.min(Math.max(m, from), to) - from) / (to - from)) * 100;
    const today = HOURS[now.getDay()];
    card.innerHTML = `
      <div class="hwc-top">
        <div class="hwc-cal"><span>${DIAS_CURTO[now.getDay()]}</span><b>${now.getDate()}</b></div>
        <div class="hwc-date"><strong>${DIAS[now.getDay()]}</strong><span>${now.getDate()} de ${MESES[now.getMonth()]} de ${now.getFullYear()}</span></div>
      </div>
      <div class="hwc-status ${st.statusTone}"><i></i>${st.status}${st.remaining ? `<span>· ${st.remaining}</span>` : ''}</div>
      <p class="hwc-msg">${st.message}</p>
      <div class="hwc-line" aria-hidden="true">
        <div class="hwc-bar">
          ${today.map(([a, b]) => `<span class="hwc-seg ${min >= b ? 'past' : min >= a ? 'now' : ''}" style="left:${pos(a)}%;width:${pos(b) - pos(a)}%"></span>`).join('')}
          ${CLASSES[now.getDay()] ? (([a, b]) => `<span class="hwc-seg cls ${min >= b ? 'past' : min >= a ? 'now' : ''}" style="left:${pos(a)}%;width:${pos(b) - pos(a)}%" title="Aulas da noite"></span>`)(CLASSES[now.getDay()]) : ''}
          ${min >= from && min <= to ? `<span class="hwc-dot" style="left:${pos(min)}%"></span>` : ''}
        </div>
        <div class="hwc-ticks"><span>7h</span><span>12h</span><span>17h</span><span>22h</span></div>
        <div class="hwc-legend"><span><i class="lg-att"></i>Atendimento</span><span><i class="lg-cls"></i>Aulas da noite</span></div>
      </div>
      <ul class="hwc-week">
        <li class="${[1, 2, 3, 4, 5].includes(now.getDay()) ? 'today' : ''}"><span>Segunda a sexta</span><b>8h30–11h30 · 14h30–17h30</b></li>
        <li class="cls ${[1, 2, 3, 4, 5].includes(now.getDay()) && (now.getHours() >= 18 && now.getHours() < 21) ? 'today' : ''}"><span>Noite <em>(seg. a sex.)</em></span><b>18h–21h · só aulas</b></li>
        <li class="${now.getDay() === 6 ? 'today' : ''}"><span>Sábado</span><b>8h30–11h30</b></li>
        <li class="${now.getDay() === 0 ? 'today' : ''}"><span>Domingo</span><b>Fechado</b></li>
      </ul>`;
  }
  paint();
  setInterval(paint, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) paint(); });

  // toque/clique abre e fecha o cartão (no computador, ele abre ao passar o mouse)
  el.addEventListener('click', (e) => { if (!e.target.closest('.hw-card')) el.classList.toggle('open'); });
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') { el.classList.remove('open'); el.blur(); } });
  document.addEventListener('pointerdown', (e) => { if (!el.contains(e.target)) el.classList.remove('open'); });
  // celular: ao abrir o site, o nome do instituto fica 3 s e depois dá lugar ao relógio
  const bar = el.closest('.topbar');
  const showClock = () => {
    bar.classList.add('hw-out');
    setTimeout(() => { bar.classList.remove('hw-out'); bar.classList.add('hw-in'); }, 380);
  };
  let seen = false;
  try { seen = sessionStorage.getItem('hc-hw-intro') === '1'; sessionStorage.setItem('hc-hw-intro', '1'); } catch (e) {}
  if (seen) bar.classList.add('hw-in'); else setTimeout(showClock, 3000);
  window.HC_hoursPreview = (h, m = 0, dow) => { // para testar outros horários pelo console
    const d = new Date(); d.setHours(h, m, 0, 0); if (dow != null) d.setDate(d.getDate() + ((dow - d.getDay() + 7) % 7));
    return hoursState(d);
  };
})();

/* =========================================================
   PESQUISA DE NOTÍCIAS (barra de cima)
   ========================================================= */
(() => {
  const input = $('#search'), box = $('#search-results'), wrap = $('#search-wrap'), topbar = document.querySelector('.topbar');
  if (!input || !box) return;
  // compara sem acentos e sem maiúsculas ("noticia" encontra "Notícia")
  const fold = (str = '') => [...String(str)].map((ch) => ch.normalize('NFD')[0].toLowerCase()).join('');
  let results = [], active = -1;

  const highlight = (text, terms) => { // destaca os termos sem perder os acentos do texto original
    const f = fold(text), marks = new Array(text.length).fill(false);
    terms.forEach((t) => { let i = f.indexOf(t); while (t && i >= 0) { for (let k = i; k < i + t.length; k++) marks[k] = true; i = f.indexOf(t, i + t.length); } });
    let out = '', on = false;
    [...text].forEach((ch, k) => {
      if (marks[k] && !on) { out += '<mark>'; on = true; }
      if (!marks[k] && on) { out += '</mark>'; on = false; }
      out += esc(ch);
    });
    return out + (on ? '</mark>' : '');
  };

  function search(q) {
    const terms = fold(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return { terms, list: [...news].sort(byNewest).slice(0, 4), recent: true };
    const scored = news.map((n) => {
      const fields = [[n.title, 5], [n.excerpt, 3], [n.cat, 3], [newsAuthor(n).name, 2], [n.body.join(' '), 1]].map(([v, w]) => [fold(v), w]);
      let score = 0;
      for (const t of terms) {
        const hit = fields.filter(([v]) => v.includes(t));
        if (!hit.length) return null; // todas as palavras precisam aparecer
        score += hit.reduce((a, [, w]) => a + w, 0);
      }
      return { n, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score || byNewest(a.n, b.n));
    return { terms, list: scored.slice(0, 6).map((x) => x.n), total: scored.length };
  }

  function render() {
    const q = input.value.trim();
    const { terms, list, recent, total } = search(q);
    results = list; active = list.length ? 0 : -1;
    box.innerHTML = `
      <div class="sr-head">${recent ? 'Notícias mais recentes' : list.length ? `${total} resultado${total > 1 ? 's' : ''} para “${esc(q)}”` : ''}</div>
      ${list.length ? `<div class="sr-list">${list.map((n, i) => `
        <button class="sr-item nc ${i === active ? 'on' : ''}" type="button" role="option" data-i="${i}" data-news="${esc(n.id)}" aria-selected="${i === active}">
          <span class="nc-media sr-thumb"><img src="${esc(imgUrl(n.image))}" alt=""${objPos(coverPos(n))}></span>
          <span class="sr-text">
            <span class="sr-meta">${esc(n.cat)}<span class="ap-sep">·</span>${fmtDate(n.date)}</span>
            <span class="sr-title">${highlight(n.title, terms)}</span>
            <span class="sr-excerpt">${highlight(n.excerpt, terms)}</span>
          </span>
          <span class="sr-go">${CHEV_SVG}</span>
        </button>`).join('')}</div>` : `
        <div class="sr-empty"><i data-icon="search"></i><strong>Nenhuma notícia encontrada</strong><span>Tente outra palavra, como o nome de um curso ou evento.</span></div>`}
      <a class="sr-all" href="#noticias">Ver todas as notícias ${CHEV_SVG}</a>`;
    paintIcons(box);
    open();
  }
  function setActive(i) {
    if (!results.length) return;
    active = (i + results.length) % results.length;
    box.querySelectorAll('.sr-item').forEach((el, k) => { el.classList.toggle('on', k === active); el.setAttribute('aria-selected', k === active); });
    box.querySelector('.sr-item.on')?.scrollIntoView({ block: 'nearest' });
  }
  function open() {
    if (!box.hidden) return;
    box.hidden = false; input.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => box.classList.add('in'));
  }
  function close() {
    if (box.hidden) return;
    box.classList.remove('in'); input.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!box.classList.contains('in')) box.hidden = true; }, 220);
  }
  function choose(i) {
    const n = results[i]; if (!n) return;
    const el = box.querySelector(`.sr-item[data-i="${i}"]`);
    openNews(n, el);
    setTimeout(() => { close(); input.blur(); topbar.classList.remove('searching'); }, 30);
  }

  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 90); });
  input.addEventListener('focus', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0) choose(active); }
    else if (e.key === 'Escape') { if (input.value) { input.value = ''; render(); } else { close(); input.blur(); topbar.classList.remove('searching'); } }
  });
  box.addEventListener('mousedown', (e) => { if (e.target.closest('.sr-item, .sr-all')) e.preventDefault(); }); // não perde o foco antes do clique
  box.addEventListener('mousemove', (e) => { const it = e.target.closest('.sr-item'); if (it && +it.dataset.i !== active) setActive(+it.dataset.i); });
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.sr-item'); if (it) return choose(+it.dataset.i);
    if (e.target.closest('.sr-all')) { close(); input.blur(); topbar.classList.remove('searching'); }
  });
  document.addEventListener('pointerdown', (e) => {
    if (!wrap.contains(e.target) && !e.target.closest('#search-btn')) { close(); if (!input.value) topbar.classList.remove('searching'); }
  });
  window.addEventListener('hashchange', close);

  // celular: o botão de lupa abre o campo de pesquisa na própria barra
  $('#search-btn')?.addEventListener('click', () => {
    const on = !topbar.classList.contains('searching');
    topbar.classList.toggle('searching', on);
    if (on) setTimeout(() => input.focus(), 50); else { close(); input.blur(); }
  });

  // Atalho Ctrl/⌘ + K para a pesquisa
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (PHONE()) topbar.classList.add('searching');
      input.focus(); input.select();
    }
  });
})();
paintIcons();
(async () => {
  try {
    await migrateDataUrls();
    // espera o auth.js (carregado depois deste arquivo) e busca o conteúdo publicado pelos administradores
    if (document.readyState === 'loading') await new Promise((r) => document.addEventListener('DOMContentLoaded', r, { once: true }));
    await window.HC_loadRemote?.();
    await loadImages();
    cleanupImages();
    // celular, primeira vez que a pessoa abre o site: o banner do topo desce com uma animação
    let heroSeen = false;
    try { heroSeen = sessionStorage.getItem('hc-hero-intro') === '1'; sessionStorage.setItem('hc-hero-intro', '1'); } catch {}
    if (!heroSeen && PHONE()) { document.body.classList.add('hero-intro'); setTimeout(() => document.body.classList.remove('hero-intro'), 2200); }
    navigator.storage?.persist?.(); // pede ao navegador para não apagar as imagens
  } catch (e) { console.warn('Imagens:', e); }
  paintLogo();
  route();
})();
