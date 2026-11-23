/* =========================================================
   PLATAFORMA DE INFORMÁTICA — LOJA DE ITENS: catálogo, inventário e poderes
   ---------------------------------------------------------
   PARA EDITAR A LOJA, MEXA SÓ NO "CATÁLOGO" LOGO ABAIXO:
   - personagens: imagem (PNG/WebP sem fundo), nome, preço, cores do cartão e o poder
     (um dos PODERES), quanto tempo ele dura (dur, em segundos) e quanto tempo leva para recarregar (recarga).
   - avatares: nome, preço e o desenho. Por enquanto são desenhos gerados (av: cor do fundo, pele, cabelo…);
     para trocar por uma imagem pronta, troque "av" por img: 'assets/…/arquivo.webp'.
   - parabens: estilos da palavra "Parabéns!" da tela final das lições. O visual de cada um está em
     curso/parabens.css (classe hcpb-<estilo>).
   Preços em moedas HC (Saldo HC). Um item novo só precisa de um id que ainda não exista.
   A tela da loja fica em curso/loja.js e loja.css; os poderes são ligados no motor das lições (curso/licao.js).

   O que o aluno comprou e o que está equipado fica salvo no aparelho e na conta
   (tabela informatica_progresso, linha "loja-itens"). Comprar usa HC_cash.spend (curso/plataforma.js).
   ========================================================= */
(() => {
  const P = 'assets/menu-info/';

  /* poderes que os personagens podem ter (o que cada um faz está no motor das lições, curso/licao.js: powerOn) */
  const PODERES = {
    escudo: { nome: 'Escudo Firewall', desc: 'Você não perde vidas nem chances enquanto o escudo estiver ligado.', ico: 'shield' },
    magico: { nome: 'Teclado Mágico', desc: 'Qualquer tecla digitada conta como certa. Nos minijogos, os erros não contam.', ico: 'wand' },
    xp2: { nome: 'XP em Dobro', desc: 'Cada acerto vale o dobro de XP.', ico: 'bolt' },
    xp3: { nome: 'Tempestade de XP', desc: 'Cada acerto vale o triplo de XP.', ico: 'storm' },
    relogio: { nome: 'Relógio Parado', desc: 'O cronômetro da lição para de contar: o seu tempo final fica menor.', ico: 'clock' },
    cura: { nome: 'Cura Total', desc: 'Recupera na hora todas as vidas de um minijogo.', ico: 'heart' },
    ima: { nome: 'Ímã de Moedas', desc: 'Cada acerto rende 0,25 moeda HC no seu saldo.', ico: 'magnet' },
  };

  /* ---------------------------- CATÁLOGO ---------------------------- */
  const CATALOGO = {
    personagens: [
      { id: 'p-nova', nome: 'Nova Pixel', img: P + 'aluna-cabelo.webp', preco: 1200, cores: ['#d8b4fe', '#7c3aed'], poder: 'magico', dur: 20, recarga: 75,
        frase: 'Hacker das cores: transforma qualquer tecla na tecla certa.' },
      { id: 'p-leo', nome: 'Léo Turbo', img: P + 'aluno-celular.webp', preco: 800, cores: ['#7dd3fc', '#1d4ed8'], poder: 'xp2', dur: 30, recarga: 60,
        frase: 'Sempre conectado, acelera tudo o que você aprende.' },
      { id: 'p-davi', nome: 'Davi Código', img: P + 'aluno-notebook.webp', preco: 1000, cores: ['#6ee7b7', '#0f766e'], poder: 'escudo', dur: 30, recarga: 60,
        frase: 'Programador de firewalls: nenhum vírus passa por ele.' },
      { id: 'p-bia', nome: 'Bia Wi-Fi', img: P + 'perfil.webp', preco: 600, cores: ['#67e8f9', '#1d56d6'], poder: 'relogio', dur: 30, recarga: 60,
        frase: 'Controla o tempo com um toque na tela.' },
      { id: 'p-bia-amor', nome: 'Bia Coração', img: P + 'perfil-sel.webp', preco: 700, cores: ['#fda4af', '#e11d48'], poder: 'cura', dur: 0, recarga: 120,
        frase: 'Um aceno dela e todos os corações voltam a bater.' },
      { id: 'p-kai', nome: 'Kai Fone', img: P + 'progresso.webp', preco: 900, cores: ['#fde68a', '#f97316'], poder: 'ima', dur: 25, recarga: 90,
        frase: 'Escuta o barulhinho das moedas de longe.' },
      { id: 'p-kai-lenda', nome: 'Kai Lendário', img: P + 'progresso-sel.webp', preco: 1500, cores: ['#f9a8d4', '#9333ea'], poder: 'xp3', dur: 15, recarga: 90,
        frase: 'A versão lendária do Kai: uma tempestade de experiência.' },
    ],
    /* av: bg (fundo 0–7), pele (0–5), cabelo (curto, longo, cacheado, espetado, coque, raspado), cor (do cabelo 0–9),
       roupa (0–7), olhos (pontos, feliz, grandes), boca (sorriso, aberto, o), extra (oculos, fone, bone, estrela ou nada) */
    avatares: [
      { id: 'av-gamer', nome: 'Gamer Azul', preco: 180, av: { bg: 0, pele: 1, cabelo: 'espetado', cor: 0, roupa: 3, olhos: 'pontos', boca: 'aberto', extra: 'fone' } },
      { id: 'av-estrela', nome: 'Estrelinha', preco: 150, av: { bg: 1, pele: 0, cabelo: 'longo', cor: 4, roupa: 4, olhos: 'grandes', boca: 'sorriso', extra: 'estrela' } },
      { id: 'av-crespo', nome: 'Crespo Neon', preco: 200, av: { bg: 2, pele: 4, cabelo: 'cacheado', cor: 0, roupa: 0, olhos: 'feliz', boca: 'aberto', extra: 'oculos' } },
      { id: 'av-sol', nome: 'Raio de Sol', preco: 160, av: { bg: 3, pele: 2, cabelo: 'coque', cor: 2, roupa: 6, olhos: 'pontos', boca: 'sorriso', extra: '' } },
      { id: 'av-roxo', nome: 'Mago Roxo', preco: 240, av: { bg: 4, pele: 3, cabelo: 'curto', cor: 6, roupa: 5, olhos: 'grandes', boca: 'o', extra: 'oculos' } },
      { id: 'av-surf', nome: 'Surfista Ciano', preco: 170, av: { bg: 5, pele: 1, cabelo: 'longo', cor: 3, roupa: 1, olhos: 'feliz', boca: 'sorriso', extra: 'bone' } },
      { id: 'av-rubi', nome: 'Rubi', preco: 220, av: { bg: 6, pele: 5, cabelo: 'cacheado', cor: 5, roupa: 7, olhos: 'grandes', boca: 'aberto', extra: 'estrela' } },
      { id: 'av-limao', nome: 'Hacker Limão', preco: 260, av: { bg: 7, pele: 2, cabelo: 'raspado', cor: 1, roupa: 2, olhos: 'pontos', boca: 'sorriso', extra: 'fone' } },
      { id: 'av-gelo', nome: 'Gelo Azul', preco: 200, av: { bg: 5, pele: 0, cabelo: 'espetado', cor: 9, roupa: 4, olhos: 'grandes', boca: 'aberto', extra: 'oculos' } },
      { id: 'av-cereja', nome: 'Cereja', preco: 190, av: { bg: 1, pele: 3, cabelo: 'coque', cor: 7, roupa: 0, olhos: 'feliz', boca: 'sorriso', extra: 'bone' } },
    ],
    /* estilo: classe hcpb-<estilo> em curso/parabens.css; fundo: cores da prévia na loja */
    parabens: [
      { id: 'pb-neon', nome: 'Neon Elétrico', preco: 350, estilo: 'neon', fundo: ['#1e1b4b', '#0f172a'], frase: 'Letras de neon que piscam como um letreiro.' },
      { id: 'pb-ouro', nome: 'Ouro Real', preco: 500, estilo: 'ouro', fundo: ['#7c2d12', '#431407'], frase: 'Ouro maciço com brilho correndo pelas letras.' },
      { id: 'pb-arco', nome: 'Arco-íris', preco: 300, estilo: 'arco', fundo: ['#2e1065', '#0c4a6e'], frase: 'Cada letra de uma cor, em onda.' },
      { id: 'pb-fogo', nome: 'Em Chamas', preco: 450, estilo: 'fogo', fundo: ['#450a0a', '#1c1917'], frase: 'A palavra pega fogo de tanta pontuação.' },
      { id: 'pb-glitch', nome: 'Glitch Hacker', preco: 400, estilo: 'glitch', fundo: ['#022c22', '#020617'], frase: 'Treme e se divide como uma tela invadida.' },
      { id: 'pb-chiclete', nome: 'Chiclete 3D', preco: 250, estilo: 'chiclete', fundo: ['#831843', '#3b0764'], frase: 'Letras gordinhas que pulam uma por uma.' },
      { id: 'pb-contorno', nome: 'Contorno', preco: 200, estilo: 'contorno', fundo: ['#0f172a', '#1e293b'], frase: 'Só o contorno, que se enche de luz.' },
    ],
  };
  /* --------------------------------------------------------------- */

  const SLOTS = { personagens: 'personagem', avatares: 'avatar', parabens: 'parabens' };
  const ALL = Object.entries(CATALOGO).flatMap(([cat, list]) => list.map((it) => ({ ...it, cat, slot: SLOTS[cat] })));
  const find = (id) => ALL.find((it) => it.id === id) || null;

  /* ---------- avatares desenhados (SVG) ---------- */
  const BG = [['#60a5fa', '#2563eb'], ['#f9a8d4', '#db2777'], ['#6ee7b7', '#059669'], ['#fcd34d', '#f97316'], ['#c4b5fd', '#7c3aed'], ['#67e8f9', '#0891b2'], ['#fda4af', '#e11d48'], ['#d9f99d', '#16a34a']];
  const PELE = ['#ffe0c2', '#f5c08a', '#e0a370', '#c68642', '#8d5524', '#5c3a21'];
  const CABELO = ['#1f1300', '#3b2314', '#7a4520', '#c2701f', '#f2c14e', '#e0475f', '#8b5cf6', '#2563eb', '#10b981', '#eef2ff'];
  const ROUPA = ['#2563eb', '#f97316', '#e11d48', '#10b981', '#7c3aed', '#facc15', '#0ea5e9', '#ec4899'];
  const shade = (h, k) => '#' + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * (1 + k))))).map((v) => v.toString(16).padStart(2, '0')).join('');
  const HAIR = {
    curto: { f: 'M28 47C26 27 38 18 51 18c14 0 24 9 21 29-2-8-6-13-12-15-6 4-18 5-27 3-3 3-4 7-5 12Z' },
    longo: { b: 'M27 45C25 22 39 14 50 14c12 0 26 7 24 31l3 34c-6 2-11-2-13-8H36c-2 6-7 10-13 8Z', f: 'M28 45c0-18 12-26 23-26s22 8 21 26c-6-8-14-14-22-15-6 4-14 8-22 15Z' },
    cacheado: { circ: [[30, 36, 10], [38, 25, 11], [50, 21, 12], [62, 25, 11], [70, 36, 10], [26, 49, 8], [74, 49, 8], [29, 60, 7], [71, 60, 7]], f: 'M30 42c4-9 12-13 20-13s16 4 20 13c-6-4-13-5-20-5s-14 1-20 5Z' },
    espetado: { f: 'M27 46l3-22 7 6 4-14 7 10 6-12 4 12 8-8v12l8-4-2 20c-6-8-14-12-22-12s-17 4-23 12Z' },
    coque: { circ: [[33, 21, 8], [67, 21, 8]], f: 'M28 46C26 27 38 19 51 19c14 0 24 9 21 27-4-9-12-15-22-15s-18 6-22 15Z' },
    raspado: { f: 'M29 41c1-14 11-20 21-20s20 6 21 20c-7-6-35-6-42 0Z' },
  };
  function avatarSVG(it) {
    if (!it) return '';
    if (it.img) return `<img src="${it.img}" alt="" draggable="false">`;
    const a = it.av || {};
    const [b1, b2] = BG[(a.bg || 0) % BG.length], sk = PELE[a.pele || 0], hc = CABELO[a.cor || 0], sh = ROUPA[(a.roupa || 0) % ROUPA.length];
    const H = HAIR[a.cabelo] || HAIR.curto, g = `ljav-${it.id}`;
    const eyes = a.olhos === 'feliz'
      ? `<path d="M38 49q4-5 8 0M54 49q4-5 8 0" fill="none" stroke="#1e1b2e" stroke-width="2.6" stroke-linecap="round"/>`
      : a.olhos === 'grandes'
        ? `<ellipse cx="42" cy="48" rx="4.6" ry="5.4" fill="#fff"/><ellipse cx="58" cy="48" rx="4.6" ry="5.4" fill="#fff"/><circle cx="42.6" cy="49" r="3" fill="#1e1b2e"/><circle cx="58.6" cy="49" r="3" fill="#1e1b2e"/><circle cx="43.6" cy="47.6" r="1" fill="#fff"/><circle cx="59.6" cy="47.6" r="1" fill="#fff"/>`
        : `<circle cx="42" cy="48" r="3.2" fill="#1e1b2e"/><circle cx="58" cy="48" r="3.2" fill="#1e1b2e"/><circle cx="43" cy="47" r="1" fill="#fff"/><circle cx="59" cy="47" r="1" fill="#fff"/>`;
    const mouth = a.boca === 'aberto'
      ? `<path d="M42 57q8 10 16 0Z" fill="#7f1d1d"/><path d="M45 60.5q5 3.5 10 0" fill="#fb7185"/>`
      : a.boca === 'o' ? `<ellipse cx="50" cy="59" rx="3" ry="3.6" fill="#7f1d1d"/>`
        : `<path d="M43 57q7 7 14 0" fill="none" stroke="#7f1d1d" stroke-width="2.6" stroke-linecap="round"/>`;
    const extra = {
      oculos: `<g fill="rgba(255,255,255,.28)" stroke="#111827" stroke-width="2.2"><rect x="34" y="42" width="14" height="11" rx="4"/><rect x="52" y="42" width="14" height="11" rx="4"/></g><path d="M48 46h4" stroke="#111827" stroke-width="2.2"/>`,
      fone: `<path d="M26 50c0-20 10-31 24-31s24 11 24 31" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/><rect x="22" y="44" width="9" height="15" rx="4" fill="${sh}" stroke="#111827" stroke-width="2"/><rect x="69" y="44" width="9" height="15" rx="4" fill="${sh}" stroke="#111827" stroke-width="2"/>`,
      bone: `<path d="M28 38c1-13 11-20 22-20s21 7 22 20Z" fill="${sh}"/><path d="M50 37h30c1 3-2 5-6 5H50Z" fill="${shade(sh, -.25)}"/><circle cx="50" cy="19" r="2.4" fill="${shade(sh, -.25)}"/>`,
      estrela: `<path d="M66 58l1.6 3.4 3.7.4-2.8 2.5.8 3.7-3.3-1.9-3.3 1.9.8-3.7-2.8-2.5 3.7-.4Z" fill="#facc15" stroke="#fff" stroke-width=".8"/>`,
    }[a.extra] || '';
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${g})"/><circle cx="80" cy="18" r="28" fill="#fff" opacity=".16"/><circle cx="14" cy="90" r="20" fill="#fff" opacity=".1"/>
      ${H.b ? `<path d="${H.b}" fill="${hc}"/>` : ''}${(H.circ || []).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hc}"/>`).join('')}
      <path d="M15 101c2-20 16-29 35-29s33 9 35 29Z" fill="${sh}"/><path d="M40 73q10 9 20 0" fill="none" stroke="${shade(sh, -.3)}" stroke-width="3"/>
      <path d="M43 64h14v8q-7 5-14 0Z" fill="${shade(sk, -.14)}"/>
      <circle cx="29" cy="50" r="5" fill="${shade(sk, -.06)}"/><circle cx="71" cy="50" r="5" fill="${shade(sk, -.06)}"/>
      <ellipse cx="50" cy="47" rx="21" ry="23" fill="${sk}"/>
      ${H.f ? `<path d="${H.f}" fill="${hc}"/>` : ''}
      <path d="M37 41.5q5-3 9 0M54 41.5q5-3 9 0" fill="none" stroke="${shade(hc === '#eef2ff' ? '#94a3b8' : hc, -.1)}" stroke-width="2.2" stroke-linecap="round"/>
      ${eyes}<circle cx="36" cy="56" r="4" fill="#fb7185" opacity=".3"/><circle cx="64" cy="56" r="4" fill="#fb7185" opacity=".3"/>${mouth}${extra}</svg>`;
  }

  /* ---------- inventário salvo ---------- */
  const ID = 'loja-itens';
  const uid = () => auth?.user?.id || 'anon';
  const key = () => `hc:info:${uid()}:${ID}`;
  const read = () => { try { return JSON.parse(localStorage.getItem(key()) || 'null'); } catch { return null; } };
  const write = (d) => { try { localStorage.setItem(key(), JSON.stringify(d)); } catch {} };
  const cur = () => { const d = read() || {}; return { itens: d.itens || [], eq: { personagem: null, avatar: null, parabens: null, ...(d.eq || {}) }, eqAt: d.eqAt || 0, savedAt: d.savedAt || 0 }; };
  const online = () => auth?.user && typeof sb !== 'undefined' && sb;
  let timer = 0;
  const push = () => {
    clearTimeout(timer); timer = 0;
    const d = read(); if (!d || !online()) return;
    // o banco soma os itens comprados com os que já estavam na conta (script 21) e devolve a lista certa
    sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao: ID, dados: d, updated_at: new Date().toISOString() }).select('dados').maybeSingle()
      .then(({ data, error }) => { if (error) console.info('Loja de itens salva só neste aparelho:', error.message); else if (data?.dados) merge(data.dados); });
  };
  const save = (d) => { d.savedAt = Date.now(); write(d); if (!timer) timer = setTimeout(push, 1200); listeners.forEach((f) => f()); };
  const listeners = new Set();

  const owns = (id) => cur().itens.includes(id);
  /* compra: confere o saldo, gasta as moedas (HC_cash.spend) e guarda o item */
  function buy(id) {
    const it = find(id); if (!it) return { ok: false, motivo: 'item' };
    if (owns(id)) return { ok: true, ja: true };
    const saldo = window.HC_cash?.get().saldo || 0;
    if (saldo < it.preco) return { ok: false, motivo: 'saldo', falta: Math.round((it.preco - saldo) * 100) / 100 };
    if (!window.HC_cash.spend(it.preco, `loja:${id}`)) return { ok: false, motivo: 'saldo', falta: it.preco - saldo };
    const d = cur(); d.itens = [...d.itens, id]; save(d);
    return { ok: true };
  }
  /* equipa (ou, com id null, volta para o padrão daquele espaço) */
  function equip(slot, id) {
    if (id && (!owns(id) || find(id)?.slot !== slot)) return false;
    const d = cur(); d.eq[slot] = id || null; d.eqAt = Date.now(); save(d);
    return true;
  }
  const equipped = (slot) => { const id = cur().eq[slot]; return id && owns(id) ? find(id) : null; };

  /* junta com o que está na conta: os itens comprados somam (nenhum aparelho perde compra) e o equipado é o mais recente */
  function merge(remote) {
    if (!remote || !Array.isArray(remote.itens)) return false;
    const local = cur();
    const itens = [...new Set([...local.itens, ...remote.itens])];
    const useRemoteEq = (remote.eqAt || 0) > local.eqAt;
    const d = { itens, eq: useRemoteEq ? { ...local.eq, ...remote.eq } : local.eq, eqAt: Math.max(local.eqAt, remote.eqAt || 0), savedAt: Math.max(local.savedAt, remote.savedAt || 0) };
    const changed = itens.length !== local.itens.length || useRemoteEq;
    write(d);
    if (online() && (itens.length > remote.itens.length || local.eqAt > (remote.eqAt || 0))) push();
    if (changed) listeners.forEach((f) => f());
    return changed;
  }
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && timer) push(); });
  addEventListener('pagehide', () => { if (timer) push(); });

  /* ---------- o que as outras telas usam ---------- */
  /* foto do aluno dentro da Plataforma de Informática: o avatar equipado ou, sem ele, a foto do perfil */
  function avatar(p, cls = '') {
    const it = equipped('avatar');
    if (it) return `<span class="avatar hc-av-loja ${cls}" aria-hidden="true">${avatarSVG(it)}</span>`;
    return typeof userAvatar === 'function' ? userAvatar(p, cls) : '';
  }
  /* classes do "Parabéns!" da tela final ('' = estilo padrão) */
  const parabensClass = () => { const it = equipped('parabens'); return it ? `hcpb hcpb-${it.estilo}` : ''; };
  /* personagem equipado com o poder (para o motor das lições) */
  const power = () => {
    const it = equipped('personagem'); if (!it) return null;
    const pd = PODERES[it.poder]; if (!pd) return null;
    return { item: it, poder: { id: it.poder, ...pd, dur: it.dur || 0, recarga: it.recarga || 60 } };
  };

  /* estilos do "Parabéns!" (usados na loja e na tela final das lições) */
  if (!document.querySelector('link[data-hc-parabens]')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = `curso/parabens.css?v=${window.HC_V || ''}`; l.dataset.hcParabens = '';
    document.head.append(l);
  }
  /* o avatar da loja tem o mesmo formato da foto (classe .avatar); o desenho ocupa tudo */
  if (!document.getElementById('hc-av-loja-css')) {
    const s = document.createElement('style'); s.id = 'hc-av-loja-css';
    s.textContent = '.avatar.hc-av-loja{overflow:hidden;background:#e2e8f0;padding:0}.avatar.hc-av-loja>svg,.avatar.hc-av-loja>img{display:block;width:100%;height:100%;object-fit:cover}';
    document.head.append(s);
  }

  window.HC_loja = {
    ID, CATALOGO, PODERES, ALL, find, owns, buy, equip, equipped, merge, avatar, avatarSVG, parabensClass, power,
    get: cur, onChange: (f) => { listeners.add(f); return () => listeners.delete(f); }, flush: () => { if (timer) push(); },
    send: () => { if (read()) push(); }, // manda o inventário deste aparelho para a conta (quando a conta ainda não tem)
  };
})();
