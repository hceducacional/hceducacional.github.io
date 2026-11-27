/* =========================================================
   PLATAFORMA DE INFORMÁTICA — tela inicial do curso (só alunos e administradores)
   Este arquivo e o plataforma.css só são baixados quando um aluno abre a plataforma
   (quem carrega é o informatica.js), então não pesam para os demais visitantes.

   Segue a mesma hierarquia da tela de início do site: banner no topo e, abaixo,
   seções com título ("Título. Complemento.") e seus cards.

   Para trocar textos e imagens, edite HC_CURSO abaixo. Imagem vazia ('') mostra um
   espaço reservado: o administrador vê a etiqueta com o tamanho sugerido.
   ========================================================= */
const HC_CURSO = {
  mascote: '', // personagem no card do próximo módulo (sugestão: PNG sem fundo, 600 × 600)
  modulos: [
    {
      nome: 'Primeiro comando',
      desc: 'As primeiras teclas da linha de referência e da fileira de cima, uma lição de cada vez.',
      imagem: '',        // imagem do card do módulo (sugestão: 1000 × 1250)
      banner: '',        // imagem do banner do módulo (sugestão: 1920 × 1080; para trocar, use o lápis do banner)
      nivel: 'Nível iniciante',
      titulo: 'Vamos começar.',
      subtitulo: 'Bem-vindo ao primeiro módulo de digitação.',
      secao: 'Primeiro comando.',
      secaoComplemento: 'As teclas básicas, uma lição de cada vez.',
      texto: 'Nesta etapa, você encontrará atividades elaboradas especialmente para introduzir os conceitos iniciais do teclado. É essencial compreender o funcionamento de cada tecla; por isso, cada seção é projetada com atenção para facilitar a aprendizagem e a memorização dos diferentes grupos de teclas a seguir.',
      totalNiveis: 170,
      licoes: [
        { tag: 'Introdução', titulo: 'Conhecendo J, F e Espaço', desc: 'Os primeiros toques: os indicadores nas teclas F e J e os polegares na barra de espaço.', imagem: '', arquivo: 'curso/licao-01.js', capa: 'dg-1', teclas: 'F J Espaço' },
        { tag: 'Introdução', titulo: 'Teclas U, R e K', desc: 'Os indicadores sobem para U e R, e o dedo médio direito chega ao K.', imagem: '', arquivo: 'curso/licao-02.js', capa: 'dg-2', teclas: 'U R K' },
        { tag: 'Introdução', titulo: 'Teclas D, E e I', desc: 'O dedo médio esquerdo no D e no E, e o médio direito no I.', imagem: '', capa: 'dg-3', teclas: 'D E I' },
        { tag: 'Introdução', titulo: 'Teclas C, G e N', desc: 'O médio esquerdo desce ao C, e os indicadores alcançam o G e o N.', imagem: '', capa: 'dg-4', teclas: 'C G N' },
        { tag: 'Revisão', titulo: 'Revisão Geral 1', desc: 'Uma revisão completa de todas as teclas aprendidas no módulo.', imagem: '', capa: 'dg-5' },
      ],
    },
    // próximos módulos: aparecem como "Em breve" até receberem as lições
    { nome: 'Formando palavras', desc: 'Juntando as teclas aprendidas para escrever as primeiras palavras.', imagem: '', nivel: 'Nível iniciante', totalNiveis: 170, licoes: [] },
    { nome: 'Mais veloz que nunca', desc: 'Exercícios de ritmo e velocidade para ganhar palavras por minuto.', imagem: '', nivel: 'Nível intermediário', totalNiveis: 230, licoes: [] },
    { nome: 'Digitando sem parar', desc: 'Textos mais longos para digitar com fluidez, sem olhar para o teclado.', imagem: '', nivel: 'Nível intermediário', totalNiveis: 230, licoes: [] },
    { nome: 'Regiões do teclado', desc: 'Números, símbolos e as teclas de cada região do teclado ABNT2.', imagem: '', nivel: 'Nível avançado', totalNiveis: 150, licoes: [] },
  ],
};

/* as lições só rodam no computador (teclado físico e tela grande); no celular e no tablet o aluno vê o progresso */
window.HC_isComputer = () => innerWidth >= 760 && matchMedia('(any-pointer: fine)').matches;

/* =========================================================
   XP GERAL E NÍVEL DO ALUNO
   Todo XP ganho (ou perdido) em qualquer lição soma num total geral do aluno, inclusive ao refazer
   a lição ou repetir só alguns níveis. O total vira o nível geral: 1.000 XP para chegar ao nível 1,
   1.150 para o 2, 1.300 para o 3… (cada nível pede 150 XP a mais que o anterior).
   Fica salvo no aparelho e na conta (tabela informatica_progresso, linha "xp-geral").
   ========================================================= */
window.HC_xp = (() => {
  const ID = 'xp-geral';
  const BASE = 1000, STEP = 150; // XP para o nível 1 e quanto cada nível seguinte pede a mais
  const uid = () => auth?.user?.id || 'anon';
  const key = () => `hc:info:${uid()}:${ID}`;
  const need = (n) => BASE + STEP * n; // XP para ir do nível n para o n + 1
  const levelOf = (xp) => {
    let n = 0, rest = xp;
    while (rest >= need(n)) { rest -= need(n); n++; }
    return { nivel: n, rest, falta: need(n) - rest, proximo: need(n), pct: (rest / need(n)) * 100 };
  };
  const read = () => { try { return JSON.parse(localStorage.getItem(key()) || 'null'); } catch { return null; } };
  const write = (d) => { try { localStorage.setItem(key(), JSON.stringify(d)); } catch {} };
  /* primeira vez neste aparelho: começa com o XP das lições que o aluno já fez */
  const seed = () => {
    let xp = 0;
    try {
      const pre = `hc:info:${uid()}:licao-`;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(pre)) xp += Math.max(0, +JSON.parse(localStorage.getItem(k) || 'null')?.xp || 0);
      }
    } catch {}
    return { xp, savedAt: 0 };
  };
  const cur = () => read() || seed();
  const online = () => auth?.user && typeof sb !== 'undefined' && sb;

  let timer = 0;
  const push = () => {
    clearTimeout(timer); timer = 0;
    const d = read(); if (!d || !online()) return;
    // o banco nunca deixa o total diminuir (script 21) e devolve o que ficou valendo: junta com o daqui
    sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao: ID, dados: d, updated_at: new Date().toISOString() }).select('dados').maybeSingle()
      .then(({ data, error }) => { if (error) console.info('XP geral salvo só neste aparelho:', error.message); else if (data?.dados) merge(data.dados); });
  };
  /* soma (ou tira) XP; grava no aparelho na hora e na conta a cada poucos segundos */
  const add = (n) => {
    n = Math.round(n || 0); if (!n) return;
    const d = cur();
    d.xp = Math.max(0, d.xp + n); d.savedAt = Date.now();
    write(d);
    if (!timer) timer = setTimeout(push, 4000);
  };
  /* junta com o que está na conta: fica o maior total (assim nenhum aparelho apaga XP de outro) */
  const merge = (remote) => {
    if (!remote || typeof remote.xp !== 'number') return false;
    const local = read();
    if (local && local.xp >= remote.xp) { if (local.xp > remote.xp && online()) push(); return false; }
    write({ xp: remote.xp, savedAt: Math.max(remote.savedAt || 0, Date.now()) });
    return true;
  };
  const pull = async () => {
    if (!online()) return false;
    const { data } = await sb.from('informatica_progresso').select('dados').eq('user_id', auth.user.id).eq('licao', ID).maybeSingle();
    if (data?.dados) return merge(data.dados);
    if (!read()) { write(seed()); push(); } // ainda não existe na conta: começa com o XP das lições
    return false;
  };
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && timer) push(); });
  addEventListener('pagehide', () => { if (timer) push(); });
  /* PATENTES: dependem só do XP total do aluno (não do nível). Cada uma pede um total de XP.
     O curso inteiro feito uma vez, bem feito, dá por volta de Diamante; Mestre em diante pede refazer
     lições para buscar pontuações maiores. Cada patente tem a sua medalha com a logo do HC
     (assets/patentes/patente-01.webp … patente-25.webp, na ordem da lista abaixo). */
  const MEDALHA = (i) => `assets/patentes/patente-${String(i + 1).padStart(2, '0')}.webp`;
  const FAM = {
    bronze: { nome: 'Bronze', c1: '#9a4a1f', c2: '#f0975a', tf: 'sepia(.55) hue-rotate(-20deg) saturate(1.15) brightness(.86)' },
    prata: { nome: 'Prata', c1: '#5b6676', c2: '#c9d3df', tf: 'grayscale(1) brightness(1.2) contrast(1.05)' },
    ouro: { nome: 'Ouro', c1: '#c26a06', c2: '#fcd34d', tf: 'saturate(1.1)' },
    platina: { nome: 'Platina', c1: '#0f766e', c2: '#5eead4', tf: 'hue-rotate(120deg) saturate(.8) brightness(1.08)' },
    diamante: { nome: 'Diamante', c1: '#1d4ed8', c2: '#67e8f9', tf: 'hue-rotate(165deg) saturate(1.2) brightness(1.1)' },
    mestre: { nome: 'Mestre', c1: '#5b21b6', c2: '#c4b5fd', tf: 'hue-rotate(225deg) saturate(.95)' },
    mestreHonra: { nome: 'Mestre de Honra', c1: '#86198f', c2: '#f0abfc', tf: 'hue-rotate(265deg) saturate(1.1)' },
    elite: { nome: 'Elite', c1: '#be123c', c2: '#fb7185', tf: 'hue-rotate(300deg) saturate(1.2)' },
    eliteHonra: { nome: 'Elite de Honra', c1: '#7f1d1d', c2: '#fbbf24', tf: 'hue-rotate(330deg) saturate(1.4) brightness(.95)' },
    desafiante: { nome: 'Desafiante', c1: '#6d28d9', c2: '#f472b6', tf: 'saturate(1.35) brightness(1.08)' },
  };
  const RANKS = [
    ['bronze', 'Bronze I', 0], ['bronze', 'Bronze II', 2000], ['bronze', 'Bronze III', 4500],
    ['prata', 'Prata I', 7500], ['prata', 'Prata II', 11000], ['prata', 'Prata III', 15000],
    ['ouro', 'Ouro I', 20000], ['ouro', 'Ouro II', 25500], ['ouro', 'Ouro III', 31500], ['ouro', 'Ouro IV', 38000],
    ['platina', 'Platina I', 45000], ['platina', 'Platina II', 52500], ['platina', 'Platina III', 60500], ['platina', 'Platina IV', 69000], ['platina', 'Platina V', 78000],
    ['diamante', 'Diamante I', 88000], ['diamante', 'Diamante II', 99000], ['diamante', 'Diamante III', 111000], ['diamante', 'Diamante IV', 124000], ['diamante', 'Diamante V', 138000],
    ['mestre', 'Mestre', 155000], ['mestreHonra', 'Mestre de Honra', 180000], ['elite', 'Elite', 210000],
    ['eliteHonra', 'Elite de Honra', 250000], ['desafiante', 'Desafiante', 300000],
  ].map(([fam, nome, xp], i) => ({ ...FAM[fam], tf: 'none', i, fam, nome, xp, img: MEDALHA(i), familia: FAM[fam].nome })); // as medalhas já vêm coloridas (sem tingir)
  const rankOf = (xp) => {
    let i = 0;
    while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
    const r = RANKS[i], next = RANKS[i + 1] || null;
    const pct = next ? ((xp - r.xp) / (next.xp - r.xp)) * 100 : 100;
    return { ...r, next, falta: next ? next.xp - xp : 0, pct };
  };
  return { ID, get: () => { const d = cur(); return { xp: d.xp, ...levelOf(d.xp) }; }, add, merge, pull, flush: () => { if (timer) push(); }, levelOf, need, RANKS, FAMILIAS: FAM, rankOf };
})();

/* =========================================================
   SALDO HC (moeda do jogo)
   Cada lição concluída rende moedas pelas conquistas da pontuação: 35,27 por estrela, +87,76 ao chegar no Superstar
   e mais +97,43 ao chegar no Megastar (quem chega no Megastar passou pelo Superstar: 176,35 + 87,76 + 97,43 = 361,54 no máximo).
   Valores com centavos: sempre arredondados para 2 casas. Rende toda vez que a lição é concluída, inclusive ao refazer.
   Guardado como dois totais que só crescem — "ganho" e "gasto" — e saldo = ganho − gasto; assim, ao juntar
   aparelho e conta, fica o maior de cada um e nenhum aparelho apaga moedas (nem compras) de outro.
   Fica salvo no aparelho e na conta (tabela informatica_progresso, linha "saldo-hc").
   ========================================================= */
window.HC_cash = (() => {
  const ID = 'saldo-hc';
  const POR_ESTRELA = 35.27, SUPERSTAR = 87.76, MEGASTAR = 97.43; // valores quebrados: o saldo fica mais realista
  const c2 = (v) => Math.round((+v || 0) * 100) / 100; // centavos
  const uid = () => auth?.user?.id || 'anon';
  const key = () => `hc:info:${uid()}:${ID}`;
  const read = () => { try { return JSON.parse(localStorage.getItem(key()) || 'null'); } catch { return null; } };
  const write = (d) => { try { localStorage.setItem(key(), JSON.stringify(d)); } catch {} };
  const cur = () => ({ ganho: 0, gasto: 0, hist: [], savedAt: 0, ...(read() || {}) });
  const online = () => auth?.user && typeof sb !== 'undefined' && sb;
  /* quanto uma lição rende: estrelas (0–5) e o título (''/'super'/'mega'); o Megastar soma também o bônus do Superstar */
  const ganhoDe = (estrelas, rank) => c2(estrelas * POR_ESTRELA + (rank === 'mega' ? SUPERSTAR + MEGASTAR : rank === 'super' ? SUPERSTAR : 0));

  let timer = 0;
  const push = () => {
    clearTimeout(timer); timer = 0;
    const d = read(); if (!d || !online()) return;
    // o banco nunca deixa ganho nem gasto diminuírem (script 21) e devolve o que ficou valendo
    sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao: ID, dados: d, updated_at: new Date().toISOString() }).select('dados').maybeSingle()
      .then(({ data, error }) => { if (error) console.info('Saldo HC salvo só neste aparelho:', error.message); else if (data?.dados) merge(data.dados); });
  };
  /* credita moedas (motivo: id da lição etc.); grava no aparelho na hora e na conta logo depois */
  const add = (n, motivo = '') => {
    n = c2(n); if (n <= 0) return cur();
    const d = cur();
    d.ganho = c2(d.ganho + n); d.savedAt = Date.now();
    d.hist = [{ v: n, m: motivo, em: d.savedAt }, ...(d.hist || [])].slice(0, 40); // últimos ganhos (para um extrato no futuro)
    write(d);
    if (!timer) timer = setTimeout(push, 1500);
    return d;
  };
  /* gasta moedas (ex.: reviver num minijogo). Só gasta se houver saldo; devolve true se deu certo */
  const spend = (n, motivo = '') => {
    n = c2(n); if (n <= 0) return true;
    const d = cur();
    if (c2(d.ganho - (d.gasto || 0)) < n) return false;
    d.gasto = c2((d.gasto || 0) + n); d.savedAt = Date.now();
    d.hist = [{ v: -n, m: motivo, em: d.savedAt }, ...(d.hist || [])].slice(0, 40);
    write(d);
    if (!timer) timer = setTimeout(push, 1500);
    return true;
  };
  const merge = (remote) => {
    if (!remote || typeof remote.ganho !== 'number') return false;
    const local = read();
    const g = Math.max(local?.ganho || 0, remote.ganho), s = Math.max(local?.gasto || 0, remote.gasto || 0);
    const changed = !local || g !== local.ganho || s !== (local.gasto || 0);
    const hist = (local?.ganho || 0) >= remote.ganho ? local?.hist : remote.hist;
    write({ ganho: g, gasto: s, hist: hist || [], savedAt: Math.max(local?.savedAt || 0, remote.savedAt || 0) });
    if (online() && (g > remote.ganho || s > (remote.gasto || 0))) push(); // este aparelho tinha mais: manda para a conta
    return changed;
  };
  const pull = async () => {
    if (!online()) return false;
    const { data } = await sb.from('informatica_progresso').select('dados').eq('user_id', auth.user.id).eq('licao', ID).maybeSingle();
    if (data?.dados) return merge(data.dados);
    if (read()) push();
    return false;
  };
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && timer) push(); });
  addEventListener('pagehide', () => { if (timer) push(); });
  const get = () => { const d = cur(); return { saldo: Math.max(0, c2(d.ganho - (d.gasto || 0))), ganho: d.ganho, gasto: d.gasto || 0, hist: d.hist || [] }; };
  return { ID, get, add, spend, merge, pull, ganhoDe, POR_ESTRELA, SUPERSTAR, MEGASTAR, flush: () => { if (timer) push(); } };
})();
window.HC_levelColor = (() => {
  /* cor do miolo do anel conforme o nível: uma cor a cada faixa de 10 níveis (0–10, 11–20, 21–30…).
     São 25 cores e, depois, as mesmas 25 numa versão mais intensa (50 faixas); a partir do nível 501 tudo recomeça.
     Cada cor = [brilho, meio, borda] do degradê. */
  const LV_COLORS = [
    ['#8ec5ff', '#2f7fe0', '#163f99'], ['#8ee59a', '#2fae5f', '#14713d'], ['#c9a7ff', '#7c4ddb', '#3f1f8f'], ['#ffc48a', '#f07a22', '#a3420a'],
    ['#ffa8cf', '#e0458c', '#8f1650'], ['#8af0f5', '#17b3c2', '#0b6470'], ['#ff9a9a', '#e03b3b', '#8f1414'], ['#ffe58a', '#e6b10f', '#946a00'],
    ['#a9b4ff', '#4a55d6', '#232a85'], ['#d4f58a', '#84c21a', '#466e06'], ['#f5a3ff', '#c23fd6', '#6c1480'], ['#8af5d2', '#14b88a', '#0a6b4f'],
    ['#ffb3a0', '#f2674a', '#9c2e17'], ['#a6e3ff', '#2aa6e0', '#0f5f8a'], ['#f0a0b8', '#b8325e', '#650f30'], ['#b8f5c8', '#3ccf76', '#16733c'],
    ['#e0c8ff', '#a07ae6', '#5a3a9c'], ['#ffd59a', '#f59e0b', '#8a5200'], ['#8ad0d8', '#1f7f8c', '#0b3f47'], ['#ff9ec0', '#e8285f', '#8a0a32'],
    ['#c8ccd6', '#5b6475', '#262b36'], ['#9ff0c0', '#0f9f58', '#045230'], ['#9ab8ff', '#2456d6', '#0c2a80'], ['#f0c79a', '#b9732e', '#6b3a0f'],
    ['#ffa6f5', '#a21fd6', '#4d0870'],
  ];
  const mixHex = (h, to, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * (1 - k) + to * k).toString(16).padStart(2, '0')).join('');
  const LV_BANDS = 50; // 50 faixas de 10 níveis = 500 níveis por volta
  function levelColor(n) {
    const band = (n <= 10 ? 0 : Math.floor((n - 1) / 10)) % LV_BANDS;
    const [a, b, c] = LV_COLORS[band % LV_COLORS.length];
    if (band < LV_COLORS.length) return [a, b, c];
    return [mixHex(a, 255, .25), mixHex(b, 0, .18), mixHex(c, 0, .35)]; // 2ª volta: brilho mais claro e fundo mais profundo
  }
  return levelColor;
})();
/* valor em moedas no formato do jogo: 1.250,00 */
window.HC_cashFmt = (v) => (Math.round(v * 100) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

(() => {
  let mod = 0; // módulo do aluno (banner e "Seu curso")
  // módulo aberto (expandido) na lista; fica guardado enquanto a aba estiver aberta, para voltar da lição com ele aberto
  let openMod = (() => { try { const v = sessionStorage.getItem('hc:pf:open'); return v === null ? null : +v; } catch { return null; } })();
  const saveOpen = () => { try { openMod === null ? sessionStorage.removeItem('hc:pf:open') : sessionStorage.setItem('hc:pf:open', String(openMod)); } catch {} };
  const ICO = {
    bag: '<path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/>',
    kbd: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
    flag: '<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
    seed: '<path d="M12 21v-7M12 14c0-4 3-7 8-7 0 5-3 8-8 7ZM12 14c0-3-2-6-7-6 0 4 2 7 7 6Z"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M12 15l-3-3M9 12c2-6 6-9 12-9 0 6-3 10-9 12l-3-3Z"/><circle cx="15" cy="9" r="1.5"/>',
    medal: '<circle cx="12" cy="15" r="6"/><path d="M8 3h8l-2 6h-4L8 3ZM12 12.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3.9-1.8Z"/>',
    crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8Z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    next: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    prev: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    keys: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
    level: '<path d="M4 20V14M10 20V9M16 20V4M22 20H2"/>',
    stack: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    chart: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 8"/>',
    texto: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/><path d="M12 11v6m-3-3 3 3 3-3"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.3-2.5 3.9M12 17h.01"/>',
    prova: '<path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z"/><path d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v13A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17.5 5H16"/><path d="m9 13 2 2 4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5"/>',
    cpu: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    win: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M8.5 12l1.5 5 2-4 2 4 1.5-5"/>',
    sheet: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.8A8 8 0 1 1 21 12Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  };
  /* "Conteúdos para aprender": cards criados pelo administrador (chave cursoConteudo no banco).
     Cada um é um texto, um PDF, um questionário ou uma prova; só os marcados como visíveis aparecem para os alunos. */
  const CT = {
    texto: { nome: 'Texto', tint: '28, 64, 120', sub: 'Leitura' },
    pdf: { nome: 'PDF', tint: '128, 32, 40', sub: 'Material em PDF' },
    quiz: { nome: 'Questionário', tint: '82, 38, 130', sub: 'Perguntas para treinar' },
    prova: { nome: 'Prova', tint: '150, 70, 18', sub: 'Avaliação com nota' },
  };
  const saved = () => (typeof cursoConteudo !== 'undefined' && Array.isArray(cursoConteudo) ? cursoConteudo : []);
  /* conteúdos prontos, escritos no código (texto em curso/conteudos/<id>.js). O administrador pode trocar capa e textos
     do card pelo lápis (fica em cursoConteudo com o mesmo id) ou tirá-lo da tela (oculto: true). */
  /* disciplinas do curso "Informática do zero" (material em PDF): cada uma tem as Aulas 01 a 09 (texto + questionário
     de 10 perguntas) e a Aula 10, a avaliação, com 30 perguntas tiradas das aulas. O texto de cada disciplina fica em
     curso/conteudos/<disciplina>.js. As aulas abrem em ordem: a próxima só é liberada com nota 7 ou mais na anterior. */
  const CURSO_DISC = [
    ['d1', 'Introdução à Informática', 'O que é informática, a história do computador, hardware e software, os tipos de computador e as peças que fazem tudo funcionar.', 'cpu', [
      ['O que é Informática?', 'O que significa a palavra, onde a informática está no seu dia a dia e por que aprender abre portas.'],
      ['Breve história da informática', 'Do ábaco aos smartphones: as máquinas e as pessoas que criaram o computador que usamos hoje.'],
      ['Hardware e software', 'A parte que você toca e a parte que dá as ordens: como as duas trabalham juntas.'],
      ['Tipos de computadores', 'Computador de mesa, notebook, tablet, celular, servidor: para que serve cada um.'],
      ['Componentes básicos do computador', 'Processador, memória RAM, armazenamento, placa-mãe e fonte: o que existe dentro do gabinete.'],
      ['Dispositivos de entrada e saída', 'Teclado, mouse, monitor, impressora e outros: como a informação entra e sai do computador.'],
      ['Ligando, desligando e cuidando do computador', 'O jeito certo de ligar, desligar, reiniciar e manter o computador limpo e funcionando bem.'],
      ['Usando o mouse', 'Clique, clique duplo, botão direito, arrastar e a rodinha: os movimentos que você vai usar todos os dias.'],
      ['Conhecendo o teclado', 'Letras, números, Enter, Backspace, Shift, acentos e as teclas especiais de um teclado ABNT2.'],
    ]],
    ['d2', 'Sistema Operacional Windows', 'Área de trabalho, menu Iniciar, janelas, pastas e arquivos, atalhos e personalização: o Windows sem mistério.', 'win', [
      ['O que é um sistema operacional?', 'O programa que comanda o computador: o que ele faz e quais são os mais usados.'],
      ['Conhecendo a área de trabalho', 'Ícones, papel de parede, barra de tarefas e área de notificação: a primeira tela do Windows.'],
      ['Menu Iniciar e barra de tarefas', 'Como encontrar e abrir programas, fixar atalhos e usar a pesquisa do Windows.'],
      ['Trabalhando com janelas', 'Abrir, minimizar, maximizar, fechar, redimensionar e alternar entre as janelas.'],
      ['Arquivos e pastas', 'O que é um arquivo, o que é uma pasta, nomes, extensões e tipos de arquivo.'],
      ['Explorador de Arquivos', 'Navegar pelas pastas, criar pastas novas e organizar os seus arquivos.'],
      ['Copiar, mover, renomear e excluir', 'As operações com arquivos, a Lixeira e como usar um pendrive.'],
      ['Atalhos de teclado no Windows', 'As combinações de teclas que fazem tudo mais rápido no Windows.'],
      ['Personalizando o sistema', 'Papel de parede, tema escuro, tamanho do texto, som e outras configurações.'],
    ]],
    ['d3', 'Editor de Textos: Word', 'Do primeiro documento à impressão: digitar, formatar, inserir imagens e tabelas, salvar e usar os atalhos do Word.', 'doc', [
      ['O que é um editor de texto?', 'Para que serve um editor de texto e quais são os mais usados, como o Word e o Google Docs.'],
      ['Conhecendo a tela do Word', 'Faixa de Opções, guias, régua, barra de status e zoom: onde fica cada coisa.'],
      ['Digitando e editando o texto', 'Cursor, seleção, copiar, colar, desfazer e localizar: como escrever e corrigir.'],
      ['Formatando a fonte', 'Tipo de letra, tamanho, negrito, itálico, sublinhado e cor do texto.'],
      ['Formatando parágrafos', 'Alinhamento, espaçamento entre linhas, recuos, listas com marcadores e numeradas.'],
      ['Estilos e organização do documento', 'Títulos, estilos prontos, quebra de página, cabeçalho, rodapé e número de página.'],
      ['Inserindo imagens, tabelas e formas', 'Como deixar o documento mais visual com figuras, tabelas e formas.'],
      ['Salvando, exportando e imprimindo', 'Salvar, Salvar como, gerar PDF e imprimir o documento do jeito certo.'],
      ['Revisão e atalhos úteis no Word', 'Corretor ortográfico, contar palavras e os atalhos que mais ajudam no dia a dia.'],
    ]],
    ['d4', 'Planilhas Eletrônicas: Excel', 'Células, fórmulas, funções e gráficos: organize números e faça contas automáticas com o Excel.', 'sheet', [
      ['O que é uma planilha?', 'Para que servem as planilhas e quais são os programas mais usados.'],
      ['Primeiros passos no Excel', 'Pasta de trabalho, planilhas, linhas, colunas, células e a barra de fórmulas.'],
      ['Digitando e formatando dados', 'Texto, números, datas e moedas: como digitar, ajustar colunas e formatar.'],
      ['Fórmulas básicas', 'Somar, subtrair, multiplicar e dividir: toda fórmula começa com o sinal de igual.'],
      ['Funções essenciais', 'SOMA, MÉDIA, MÁXIMO, MÍNIMO e CONT.NÚM: as funções que resolvem quase tudo.'],
      ['Referências e preenchimento automático', 'A alça de preenchimento, sequências automáticas e o cifrão nas referências.'],
      ['Organizando os dados', 'Classificar, filtrar, congelar painéis e formatar como tabela.'],
      ['Criando gráficos simples', 'Colunas, pizza e linhas: transforme números em gráficos fáceis de entender.'],
      ['Salvando e imprimindo planilhas', 'Salvar, área de impressão, orientação da página e exportar em PDF.'],
    ]],
    ['d5', 'Internet e Navegadores', 'Como a internet funciona, os navegadores, pesquisas no Google, e-mail e os cuidados para navegar com segurança.', 'globe', [
      ['O que é a Internet?', 'A rede que liga o mundo: o que é, de onde veio e o que dá para fazer nela.'],
      ['Como a internet chega até você', 'Provedor, Wi-Fi, dados móveis, endereços de sites e o que é uma URL.'],
      ['Principais navegadores', 'Chrome, Edge, Firefox e Safari: o que é um navegador e as partes da tela.'],
      ['Navegando com abas, favoritos e histórico', 'Abas, favoritos, histórico, downloads e navegação anônima.'],
      ['Pesquisas no Google', 'Como pesquisar bem: palavras-chave, resultados e as pesquisas de imagens e mapas.'],
      ['Pesquisa avançada e informação confiável', 'Aspas, sinal de menos, filtros e como saber se uma informação é verdadeira.'],
      ['Criando uma conta de e-mail', 'O que é um e-mail, como é um endereço e como criar uma conta no Gmail.'],
      ['Usando o e-mail no dia a dia', 'Escrever, responder, encaminhar, anexar arquivos e organizar a caixa de entrada.'],
      ['Cuidados de segurança na internet', 'Golpes comuns, downloads, Wi-Fi público e como proteger os seus dados.'],
    ]],
    ['d6', 'Redes Sociais e Comunicação Digital', 'WhatsApp, Facebook e Instagram com responsabilidade: publicar, conversar e proteger a sua privacidade.', 'chat', [
      ['O que são redes sociais?', 'Como as redes sociais funcionam, as mais usadas e para que cada uma serve.'],
      ['Comunicação digital e boas maneiras', 'Netiqueta: como escrever, responder e se comportar bem no mundo digital.'],
      ['WhatsApp: primeiros passos', 'Instalar, criar o perfil, conversar, mandar áudio, foto e fazer chamadas.'],
      ['WhatsApp: grupos, status e WhatsApp Web', 'Participar de grupos, usar o status e abrir o WhatsApp no computador.'],
      ['Facebook', 'Perfil, feed, amigos, páginas, grupos e o Marketplace.'],
      ['Instagram', 'Perfil, feed, stories, reels, seguir, curtir e comentar.'],
      ['Publicações responsáveis', 'O que postar, o que evitar e o que é a sua pegada digital.'],
      ['Configurações de privacidade', 'Quem vê o que você publica: perfil privado, bloqueio e denúncia.'],
      ['Bem-estar e cidadania digital', 'Cyberbullying, notícias falsas, tempo de tela e respeito na internet.'],
    ]],
    ['d7', 'Segurança Digital', 'Antivírus, atualizações, senhas fortes, golpes e sites seguros: proteja o seu computador e os seus dados.', 'shield', [
      ['Por que se preocupar com segurança?', 'Os riscos do mundo digital e o que os criminosos procuram.'],
      ['Vírus e outras ameaças', 'Vírus, cavalo de Troia, ransomware, spyware: o que são e como chegam até você.'],
      ['A importância do antivírus', 'Como o antivírus funciona, o Windows Defender e a verificação de arquivos.'],
      ['Atualizações e proteção de dados', 'Por que atualizar o sistema e os aplicativos e como proteger os seus dados pessoais.'],
      ['Senhas fortes', 'Como criar senhas difíceis de adivinhar e fáceis de lembrar, e o gerenciador de senhas.'],
      ['Verificação em duas etapas', 'Uma segunda tranca para as suas contas: códigos, aplicativos e como ativar.'],
      ['Golpes e engenharia social', 'Phishing, golpe do falso parente, Pix, boletos falsos: como reconhecer e não cair.'],
      ['Como identificar sites seguros', 'O cadeado, o https, o endereço certo e os sinais de um site falso.'],
      ['Boas práticas e cópias de segurança', 'Backup, nuvem, Wi-Fi público e uma rotina de cuidados para o dia a dia.'],
    ]],
    ['d8', 'Atalhos, Produtividade e Acessibilidade', 'Os atalhos que poupam tempo, dicas para usar o computador mais rápido, recursos de acessibilidade e o glossário.', 'zap', [
      ['Por que usar atalhos de teclado?', 'As teclas Ctrl, Alt, Shift e Windows e como ler uma combinação de teclas.'],
      ['Atalhos de edição', 'Copiar, recortar, colar, desfazer, refazer, selecionar tudo, salvar e imprimir.'],
      ['Atalhos do Windows', 'Área de trabalho, Explorador, alternar janelas, bloquear o computador e mais.'],
      ['Atalhos do navegador', 'Abas, endereço, atualizar, localizar na página e zoom.'],
      ['Ganhando velocidade no computador', 'Organização de pastas, nomes de arquivos, área de transferência e captura de tela.'],
      ['Organizando o seu tempo e a sua rotina digital', 'Notificações, foco, área de trabalho limpa e ferramentas que ajudam a produzir.'],
      ['Ferramentas de acessibilidade', 'Lupa, narrador, legendas, contraste e ditado: o computador para todas as pessoas.'],
      ['Glossário de informática', 'As palavras mais usadas no mundo da informática, explicadas de um jeito simples.'],
      ['Checklist de habilidades', 'Revisão final: tudo o que você aprendeu no curso e o que praticar a seguir.'],
    ]],
  ];
  const pad2 = (n) => String(n).padStart(2, '0');
  const CONTS_BASE = CURSO_DISC.flatMap(([did, , , , aulas], di) => [
    ...aulas.map(([titulo, desc], k) => ({ id: `${did}-a${pad2(k + 1)}`, disc: did, tipo: 'texto', rotulo: `Aula ${pad2(k + 1)}`, ordem: k + 1, seq: true,
      titulo, desc, meta: '120 min · 10 perguntas · nota 7', image: '', visivel: true, arquivo: `curso/conteudos/${did}.js`, fixo: true })),
    { id: `${did}-av`, disc: did, tipo: 'prova', rotulo: 'Aula 10 · Avaliação', ordem: 10, seq: true, titulo: 'Avaliação da disciplina',
      desc: '30 perguntas sobre as Aulas 01 a 09, sem o material: mostre o que você aprendeu.', meta: '5 horas · 30 perguntas · nota 7', image: '', visivel: true, arquivo: `curso/conteudos/${did}.js`, fixo: true },
  ]);
  /* disciplinas: os cards da seção abaixo dos módulos. Cada uma abre a sua página (#informatica/disciplina-<id>)
     com os conteúdos dela (textos, PDFs, questionários e provas). Ficam em cursoConteudo com kind: 'disc';
     os conteúdos apontam para a disciplina pelo campo disc. */
  const DTINTS = ['28, 64, 120', '82, 38, 130', '6, 95, 70', '150, 70, 18', '128, 32, 40', '14, 90, 120', '150, 40, 100', '60, 60, 140'];
  const DISCS_BASE = CURSO_DISC.map(([id, titulo, desc, ico], i) => ({ id, kind: 'disc', titulo, desc, ico, image: '', cor: i % DTINTS.length, visivel: true, fixo: true }));
  const LEGACY = new Set(['disc-01', 'texto-01']); // a disciplina de teste (Digitação) e o texto dela saíram do curso
  const isDisc = (x) => x?.kind === 'disc';
  const discs = () => {
    const s = saved().filter((x) => !LEGACY.has(x.id)), ids = new Set(DISCS_BASE.map((b) => b.id));
    return DISCS_BASE.map((b) => ({ ...b, ...(s.find((x) => x.id === b.id) || {}), kind: 'disc', fixo: true }))
      .concat(s.filter((x) => isDisc(x) && !ids.has(x.id))).filter((d) => !d.oculto);
  };
  const visDiscs = () => discs().filter((d) => isAdmin() || d.visivel);
  const discTint = (d) => DTINTS[(+d?.cor || 0) % DTINTS.length];
  const conts = () => {
    const s = saved().filter((x) => !isDisc(x) && !LEGACY.has(x.id)), ids = new Set(CONTS_BASE.map((b) => b.id));
    return CONTS_BASE.map((b) => ({ ...b, ...(s.find((x) => x.id === b.id) || {}), arquivo: b.arquivo, rotulo: b.rotulo, ordem: b.ordem, seq: true, disc: b.disc, fixo: true }))
      .concat(s.filter((x) => !ids.has(x.id))).filter((c) => !c.oculto)
      .map((c) => ({ ...c, disc: c.disc || DISCS_BASE[0].id }));
  };
  const discItems = (did) => conts().filter((c) => c.disc === did && (isAdmin() || c.visivel));
  const bestOf = (id) => { const h = contProg(id)?.hist; return Array.isArray(h) && h.length ? Math.max(...h.map((x) => +x.nota || 0)) : null; };
  const contDone = (id) => (bestOf(id) ?? -1) >= 7; // concluído = aprovado (nota 7 ou mais)
  const contProg = (id) => { try { return JSON.parse(localStorage.getItem(`hc:info:${auth?.user?.id || 'anon'}:cont-${id}`) || 'null'); } catch { return null; } };
  /* aulas em ordem: a aula fica trancada até o aluno passar (nota 7+) na anterior da mesma disciplina.
     O administrador abre todas. Devolve a aula que falta passar, ou null. */
  const prevOf = (c) => (c?.seq ? conts().filter((x) => x.disc === c.disc && x.seq && x.ordem < c.ordem).sort((a, b) => b.ordem - a.ordem)[0] || null : null);
  const lockOf = (c) => {
    if (isAdmin()) return null;
    const dl = c?.seq ? discLockOf(discs().find((d) => d.id === c.disc)) : null;
    if (dl) return { rotulo: `disciplina ${dl.titulo}`, disc: dl };
    const p = prevOf(c); return p && !contDone(p.id) ? p : null;
  };
  const nextOf = (c) => (c?.seq ? conts().filter((x) => x.disc === c.disc && x.seq && x.ordem > c.ordem).sort((a, b) => a.ordem - b.ordem)[0] || null : null);
  /* lições criadas pelo administrador (botão "Nova lição"): ficam no banco, junto do conteúdo do site,
     e entram no fim do módulo até serem configuradas aqui no código */
  /* capas e textos trocados pelo administrador (botão de lápis): ficam no banco (chave cursoEdit) e
     valem por cima do que está escrito em HC_CURSO; campo vazio volta ao texto original */
  const BASE_M = HC_CURSO.modulos.map((m) => ({ ...m, licoes: m.licoes.map((l) => ({ ...l })) }));
  const extras = () => (typeof cursoExtra !== 'undefined' && Array.isArray(cursoExtra) ? cursoExtra : []);
  const edits = () => (typeof cursoEdit !== 'undefined' && Array.isArray(cursoEdit) ? cursoEdit : []);
  const M_FIELDS = ['nome', 'nivel', 'desc', 'secao', 'secaoComplemento', 'texto'], L_FIELDS = ['tag', 'titulo', 'desc'];
  const over = (base, o, fields) => {
    const r = { ...base }; if (!o) return r;
    fields.forEach((f) => { if (typeof o[f] === 'string' && o[f].trim()) r[f] = o[f].trim(); });
    if (typeof o.image === 'string') r.imagem = o.image;
    return r;
  };
  const mergeExtras = () => HC_CURSO.modulos.forEach((m, i) => {
    const b = BASE_M[i], ed = edits();
    Object.assign(m, over(b, ed.find((x) => x.id === 'm' + i), M_FIELDS));
    m.licoes = b.licoes.map((l, k) => over(l, ed.find((x) => x.id === `l${i}-${k}`), L_FIELDS))
      .concat(extras().filter((x) => x.mod === i).map((x) => ({ ...x, imagem: x.image ?? x.imagem ?? '', extra: true })));
  });
  const canOpen = (m) => m.licoes.some((l) => l.arquivo) || isAdmin(); // o administrador abre até módulo vazio, para criar lições
  const PER_PAGE = 1000; // todas as lições numa fileira só (no computador passa para o lado com as setas)
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;

  /* imagem, ou espaço reservado (com etiqueta para o administrador) */
  const slot = (src, label, size, k = 0) => src
    ? `<img class="pf-img" src="${esc(imgUrl(src))}" alt="" loading="lazy" />`
    : `<span class="pf-ph" style="--k:${k}">${svg('keys')}${isAdmin() ? `<em>${label}<small>${size}</small></em>` : ''}</span>`;

  /* seção "Conteúdos para aprender", logo abaixo dos módulos: cards no mesmo estilo dos módulos */
  const progTxt = (c) => {
    const p = contProg(c.id); if (!p?.savedAt) return '';
    const h = Array.isArray(p.hist) ? p.hist : [], n = Object.keys(p.ans || {}).length, r = (p.read || []).length;
    /* tentativa aberta: quanto tempo ainda resta (aula 120 min, avaliação 5 h) */
    if (!p.fechada && p.ini) {
      const left = p.ini + (c.tipo === 'prova' ? 300 : 120) * 60000 - Date.now(), m = Math.ceil(left / 60000);
      if (left <= 0) return 'Tempo esgotado · abra para ver a nota';
      return `Resta ${m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}min` : ''}` : `${m} min`} · ${n ? `${n}/${c.tipo === 'prova' ? 30 : 10} respostas` : `${r} ${r === 1 ? 'parte lida' : 'partes lidas'}`}`;
    }
    if (h.length) { const best = Math.max(...h.map((x) => x.nota)); return `Nota ${best.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}${best < 7 ? ' · recuperação' : ''}`; }
    return n ? `${n} ${n === 1 ? 'resposta' : 'respostas'} · ${r} ${r === 1 ? 'parte lida' : 'partes lidas'}` : `${r} ${r === 1 ? 'parte lida' : 'partes lidas'}`;
  };
  /* barra de progresso da aula no card: metade pela leitura das partes, metade pelas perguntas respondidas;
     depois de enviar o questionário fica cheia. Aprovado (nota 7+) mostra o selo com a nota.
     O total de partes e perguntas vem do arquivo da aula (baixado na página da disciplina) */
  function cprog(c) {
    if (lockOf(c)) return '';
    const best = bestOf(c.id), fmt = (n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    if (best !== null && best >= 7) return `<div class="pf-cprog ok"><span class="pf-cprog-trk"><i style="--p:1"></i></span><b class="pf-aprov">${svg('check')} Aprovado · nota ${fmt(best)}</b></div>`;
    const p = contProg(c.id) || {}, A = window.HC_CONTEUDOS?.[c.id];
    const nP = A?.partes?.length || (A?.avaliacao ? Math.ceil(A.avaliacao.aulas.length / 3) : 0);
    const nQ = A?.perguntas?.length || (A?.avaliacao ? A.avaliacao.aulas.length / 3 * 10 : 0) || +(c.meta || '').match(/(\d+) perguntas/)?.[1] || 0;
    const r = (p.read || []).length, n = Object.keys(p.ans || {}).length;
    const parts = [...(nP ? [Math.min(1, r / nP)] : []), ...(nQ ? [Math.min(1, n / nQ)] : [])];
    const pct = Math.round((best !== null ? 1 : parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0) * 100);
    return `<div class="pf-cprog${best !== null ? ' rec' : ''}" role="progressbar" aria-label="Progresso da aula" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span class="pf-cprog-trk"><i style="--p:${pct / 100}"></i></span><b>${pct}%</b></div>`;
  }
  /* card de um conteúdo (dentro da página da disciplina) */
  /* capa ilustrada e animada da aula (curso/capas.js); sem ela, o ícone do tipo. A imagem enviada pelo administrador vale mais */
  const capaPh = (c, i, ico, adm) => window.HC_CAPAS?.[c.id] ? `<span class="pf-ph pf-capa" style="--k:${i}">${window.HC_CAPAS[c.id]}</span>`
    : `<span class="pf-ph" style="--k:${i}">${svg(ico)}${adm ? '<em>Imagem do conteúdo<small>1000 × 1250</small></em>' : ''}</span>`;
  /* as capas ficam num arquivo à parte, baixado só na página da disciplina; quando chega, troca os ícones pelas capas */
  function paintCapas(root) {
    /* arquivos das aulas desta página: dão o total de partes e perguntas para a barra de progresso */
    const arqs = [...new Set([...root.querySelectorAll('[data-cont]')].map((el) => conts().find((x) => x.id === el.dataset.cont)?.arquivo).filter(Boolean))];
    Promise.all(arqs.map(load)).then(() => root.querySelectorAll('[data-cont]').forEach((el) => {
      const c = conts().find((x) => x.id === el.dataset.cont), slot = el.querySelector('.pf-cprog-slot');
      if (c && slot) slot.innerHTML = cprog(c);
    }), () => {});
    Promise.all([load('curso/capas.css'), load('curso/capas.js')]).then(() => {
      root.querySelectorAll('[data-cont]').forEach((el) => {
        const c = conts().find((x) => x.id === el.dataset.cont), ph = el.querySelector('.pf-lesson-img > .pf-ph:not(.pf-capa)');
        if (c && !c.image && ph && window.HC_CAPAS?.[c.id]) { ph.outerHTML = capaPh(c, +getComputedStyle(ph).getPropertyValue('--k') || 0); if (window.HC_CAPAS_TINT?.[c.id]) el.style.setProperty('--tint', HC_CAPAS_TINT[c.id]); }
      });
    }, () => {});
  }
  function contCard(c, i) {
    const adm = isAdmin(), t = CT[c.tipo] || CT.texto, ico = CT[c.tipo] ? c.tipo : 'texto', lk = lockOf(c), ok = contDone(c.id);
    const nome = c.seq ? (c.tipo === 'prova' ? 'Avaliação' : 'Aula') : t.nome;
    const go = lk ? svg('lock') : ok ? 'Revisar' : contProg(c.id)?.savedAt ? 'Continuar' : 'Abrir';
    return `
      <article class="pf-lesson pf-modcard pf-ccard${c.visivel ? '' : ' draft'}${ok ? ' done' : ''}${lk ? ' locked' : ''}" style="--i:${i};--tint:${(!c.image && window.HC_CAPAS_TINT?.[c.id]) || t.tint}" data-cont="${esc(c.id)}" tabindex="0" role="button" aria-label="${esc(c.rotulo || t.nome)}: ${esc(c.titulo)}${lk ? ' (trancada)' : ''}">
        <div class="pf-lesson-img">${c.image ? `<img class="pf-img" src="${esc(imgUrl(c.image))}" alt="" loading="lazy" />` : capaPh(c, i, ico, adm)}
          ${c.seq ? `<span class="pf-cnum">${c.tipo === 'prova' ? svg('prova') : pad2(c.ordem)}</span>` : ''}
          ${lk ? `<span class="pf-clock">${svg('lock')}<small>Passe na ${esc(lk.rotulo?.split(' · ')[0] || 'aula anterior')} com nota 7</small></span>` : ''}
          ${ok ? `<span class="pf-cok">${svg('shield')}</span>` : ''}</div>
        <div class="pf-lesson-app">
          <div class="pf-lesson-text">
            <span class="pf-lesson-tag">${esc(c.rotulo || t.nome)}${adm && !c.visivel ? ' · Rascunho' : ''}</span>
            <h3>${esc(c.titulo || 'Sem título')}</h3>
            <p>${esc(c.desc || '')}</p>
            ${c.seq ? `<div class="pf-cprog-slot">${cprog(c)}</div>` : ''}
          </div>
          <div class="pf-lesson-bar">
            <span class="pf-lesson-av">${svg(ico)}</span>
            <span class="pf-lesson-who"><strong>${esc(nome)}</strong><small>${esc(progTxt(c) || c.meta || t.sub)}</small></span>
            <span class="pf-lesson-go">${go}</span>
          </div>
        </div>
        ${adm ? `<div class="pf-adm"><button class="pf-adm-btn" type="button" data-editcont="${esc(c.id)}" aria-label="Editar o conteúdo" title="Editar conteúdo">${svg('pen')}</button><button class="pf-adm-btn" type="button" data-delcont="${esc(c.id)}" aria-label="Apagar o conteúdo" title="Apagar conteúdo">${svg('trash')}</button></div>` : ''}
      </article>`;
  }
  /* disciplinas em ordem: a próxima só abre quando o aluno concluir a anterior (todas as aulas aprovadas).
     O administrador abre todas. Devolve a disciplina que falta concluir, ou null. */
  const discLockOf = (d) => {
    if (!d || isAdmin()) return null;
    const list = visDiscs(), i = list.findIndex((x) => x.id === d.id);
    for (let k = i - 1; k >= 0; k--) { const p = discProg(list[k]); if (p.n && p.ok < p.n) return list[k]; }
    return null;
  };
  const discProg = (d) => { const it = discItems(d.id).filter((c) => c.visivel || !isAdmin()); const all = it.length ? it : discItems(d.id); return { n: all.length, ok: all.filter((c) => contDone(c.id)).length, began: all.some((c) => contProg(c.id)?.savedAt) }; };
  /* celular: barrinha embaixo da fileira de cards (um ponto por card, o atual vira um traço); tocar num ponto leva ao card */
  function rowDots(row) {
    row.nextElementSibling?.classList.contains('pf-rowdots') && row.nextElementSibling.remove();
    const cards = [...row.children]; if (cards.length < 2) return;
    const bar = document.createElement('div'); bar.className = 'pf-rowdots'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = cards.map(() => '<i></i>').join(''); row.after(bar);
    const dots = [...bar.children]; let cur = -1;
    const upd = () => {
      if (!row.isConnected) return row.removeEventListener('scroll', upd);
      const step = cards[1].offsetLeft - cards[0].offsetLeft || 1;
      const end = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      const i = end ? cards.length - 1 : Math.min(cards.length - 1, Math.round(row.scrollLeft / step));
      if (i !== cur) { dots[cur]?.classList.remove('on'); dots[i].classList.add('on'); cur = i; }
    };
    dots.forEach((d, i) => d.addEventListener('click', () => row.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' })));
    row.addEventListener('scroll', upd, { passive: true }); upd();
  }
  /* barra da disciplina no card: sobe a cada aula aprovada (nota 7+); com todas aprovadas, vira o selo de concluída */
  const discBar = (p) => p.ok >= p.n
    ? `<div class="pf-cprog ok"><span class="pf-cprog-trk"><i style="--p:1"></i></span><b class="pf-aprov">${svg('check')} Concluída</b></div>`
    : `<div class="pf-cprog" role="progressbar" aria-label="Aulas aprovadas" aria-valuemin="0" aria-valuemax="${p.n}" aria-valuenow="${p.ok}"><span class="pf-cprog-trk"><i style="--p:${p.ok / p.n}"></i></span><b>${p.ok}/${p.n}</b></div>`;
  /* seção "Disciplinas", logo abaixo dos módulos: cada card abre a página da disciplina */
  function contsSection() {
    const list = visDiscs(), adm = isAdmin();
    const card = (d, i) => {
      const p = discProg(d), lk = discLockOf(d);
      const small = lk ? 'Trancada' : !p.n ? 'Em breve' : p.ok ? `${p.ok} de ${p.n} ${p.n === 1 ? 'concluído' : 'concluídos'}` : p.began ? 'Em andamento' : 'Comece agora';
      return `
      <article class="pf-lesson pf-modcard pf-ccard pf-dcard${d.visivel ? '' : ' draft'}${lk ? ' locked' : ''}" style="--i:${i};--tint:${discTint(d)}" data-disc="${esc(d.id)}" tabindex="0" role="button" aria-label="Disciplina: ${esc(d.titulo)}">
        <div class="pf-lesson-img">${d.image ? `<img class="pf-img" src="${esc(imgUrl(d.image))}" alt="" loading="lazy" />`
          : `<span class="pf-ph" style="--k:${i}">${svg(d.ico || 'book')}${adm ? '<em>Imagem da disciplina<small>1000 × 1250</small></em>' : ''}</span>`}
          ${lk ? `<span class="pf-clock">${svg('lock')}<small>Conclua ${esc(lk.titulo)} para liberar</small></span>` : ''}</div>
        <div class="pf-lesson-app">
          <div class="pf-lesson-text">
            <span class="pf-lesson-tag">Disciplina${adm && !d.visivel ? ' · Rascunho' : ''}</span>
            <h3>${esc(d.titulo || 'Sem título')}</h3>
            <p>${esc(d.desc || '')}</p>
            ${p.n ? discBar(p) : ''}
          </div>
          <div class="pf-lesson-bar">
            <span class="pf-lesson-av">${svg(d.ico || 'book')}</span>
            <span class="pf-lesson-who"><strong>${p.n} ${p.n === 1 ? 'aula' : 'aulas'}</strong><small>${small}</small></span>
            <span class="pf-lesson-go">${lk ? svg('lock') : p.began ? 'Continuar' : 'Abrir'}</span>
          </div>
        </div>
        ${adm ? `<div class="pf-adm"><button class="pf-adm-btn" type="button" data-editdisc="${esc(d.id)}" aria-label="Editar a disciplina" title="Editar disciplina">${svg('pen')}</button><button class="pf-adm-btn" type="button" data-deldisc="${esc(d.id)}" aria-label="Apagar a disciplina" title="Apagar disciplina">${svg('trash')}</button></div>` : ''}
      </article>`;
    };
    const empty = `
      <div class="pf-cempty">
        <div class="pf-cempty-icos">${['texto', 'pdf', 'quiz', 'prova'].map((k, i) => `<span style="--tint:${CT[k].tint};--i:${i}">${svg(k)}</span>`).join('')}</div>
        <h3>${adm ? 'Crie a primeira disciplina' : 'Em breve, novas disciplinas'}</h3>
        <p>${adm ? 'Cada disciplina reúne textos, PDFs, questionários e provas. Ela aparece aqui, logo abaixo dos módulos.' : 'As disciplinas com textos, PDFs, questionários e provas preparados pelo seu professor vão aparecer aqui.'}</p>
        ${adm ? `<button class="pf-cnew-btn" type="button" data-newdisc>${svg('plus')} Nova disciplina</button>` : ''}
      </div>`;
    return `
    <section class="pf-conts" aria-label="Disciplinas">
      <div class="pf-mods-head">
        <h2 class="pf-st-title">Disciplinas <span>Informática do zero: aulas, questionários e avaliações</span></h2>
        ${list.length ? `<div class="ap-paddles pf-mod-paddles">
          <button class="ap-paddle" data-cdir="-1" aria-label="Disciplinas anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button class="ap-paddle" data-cdir="1" aria-label="Próximas disciplinas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>` : ''}
      </div>
      ${list.length ? `<div class="pf-mod-row pf-cont-row" id="pf-cont-row">${list.map(card).join('')}
        ${adm ? `<button class="pf-cnew" type="button" data-newdisc><span>${svg('plus')}</span><b>Nova disciplina</b><small>Para reunir textos, PDFs, questionários e provas</small></button>` : ''}
      </div>` : empty}
    </section>`;
  }
  const onDiscPage = () => /^#informatica\/disciplina-/.test(location.hash);
  /* depois de criar, editar ou apagar: redesenha a seção (tela do curso) ou a página da disciplina */
  function refreshAfter(view, toEnd) {
    if (onDiscPage()) return discPage(view, location.hash.slice('#informatica/disciplina-'.length), true);
    refreshConts(view, toEnd);
  }
  /* cliques dos cards (disciplinas e conteúdos), em qualquer uma das duas telas */
  function bindCards(root, view, onCont) {
    const press = (sel, fn) => root.querySelectorAll(sel).forEach((c) => {
      c.addEventListener('click', () => fn(c));
      c.addEventListener('keydown', (e) => { if (e.target !== c) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(c); } });
    });
    press('[data-disc]', (c) => {
      const lk = discLockOf(discs().find((d) => d.id === c.dataset.disc));
      if (lk) return toast(`Esta disciplina ainda está trancada. Conclua ${lk.titulo} (todas as aulas com nota 7 ou mais) para liberar.`);
      location.hash = `#informatica/disciplina-${c.dataset.disc}`;
    });
    press('[data-cont]', (c) => (onCont || openCont)(c.dataset.cont));
    root.querySelectorAll('[data-newdisc]').forEach((b) => b.addEventListener('click', () => editDisc(view, null)));
    root.querySelectorAll('[data-editdisc]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); editDisc(view, b.dataset.editdisc); }));
    root.querySelectorAll('[data-deldisc]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const d = discs().find((x) => x.id === b.dataset.deldisc); if (!d) return;
      const its = conts().filter((c) => c.disc === d.id);
      confirmDel(`Apagar a disciplina “${d.titulo || 'sem título'}”?`, `A disciplina${its.length ? ` e ${its.length === 1 ? 'o conteúdo dela' : `os ${its.length} conteúdos dela`}` : ''} saem da Plataforma de Informática para todos os alunos e não dá para desfazer. Para confirmar, digite a senha mestra.`, () => {
        const gone = new Set([d.id, ...its.map((c) => c.id)]);
        cursoConteudo = [...saved().filter((x) => !gone.has(x.id)), ...[d, ...its].filter((x) => x.fixo).map((x) => ({ id: x.id, ...(isDisc(x) ? { kind: 'disc' } : {}), oculto: true }))];
        saveCursoConteudo(); toast('Disciplina apagada.');
        if (onDiscPage()) location.hash = '#informatica/cursos'; else refreshConts(view);
      });
    }));
    root.querySelectorAll('[data-newcont]').forEach((b) => b.addEventListener('click', () => editCont(view, null, b.dataset.newcont)));
    root.querySelectorAll('[data-editcont]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); editCont(view, b.dataset.editcont); }));
    root.querySelectorAll('[data-delcont]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const c = conts().find((x) => x.id === b.dataset.delcont); if (!c) return;
      confirmDel(`Apagar “${c.titulo || 'conteúdo'}”?`, 'O conteúdo sai da disciplina para todos os alunos e não dá para desfazer. Para confirmar, digite a senha mestra.', () => {
        cursoConteudo = c.fixo ? [...saved().filter((x) => x.id !== c.id), { id: c.id, oculto: true }] : saved().filter((x) => x.id !== c.id);
        saveCursoConteudo(); refreshAfter(view); toast('Conteúdo apagado.');
      });
    }));
  }
  let contsResize = null, lessonsResize = null, discResize = null;
  const discRowX = {}; // onde a fileira de aulas de cada disciplina estava (para voltar no mesmo lugar)
  function bindConts(view) {
    const sec = view.querySelector('.pf-conts'); if (!sec) return;
    bindCards(sec, view);
    const row = sec.querySelector('#pf-cont-row'); if (!row) return;
    const pads = sec.querySelectorAll('[data-cdir]');
    pads.forEach((b) => b.addEventListener('click', () => row.scrollBy({ left: +b.dataset.cdir * row.clientWidth * .8, behavior: 'smooth' })));
    const upd = () => { if (!pads.length) return; pads[0].disabled = row.scrollLeft < 4; pads[1].disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4; pads[0].parentNode.classList.toggle('none', pads[0].disabled && pads[1].disabled); };
    row.addEventListener('scroll', upd, { passive: true });
    // um só ouvinte de redimensionar por vez: a cada redesenho da página o anterior sai (antes eles se acumulavam)
    if (contsResize) removeEventListener('resize', contsResize);
    contsResize = upd; addEventListener('resize', upd, { passive: true }); upd(); rowDots(row);
  }
  function refreshConts(view, toEnd) {
    const sec = view.querySelector('.pf-conts'); if (!sec) return;
    sec.outerHTML = contsSection(); bindConts(view);
    const row = view.querySelector('#pf-cont-row');
    if (row && toEnd) requestAnimationFrame(() => row.scrollTo({ left: row.scrollWidth, behavior: 'smooth' }));
  }
  /* página da disciplina: capa e nome em cima, progresso e, embaixo, os conteúdos dela em grade */
  function discPage(view, id, keepScroll) {
    const d = discs().find((x) => x.id === id);
    if (!d || (!d.visivel && !isAdmin())) { location.hash = '#informatica/cursos'; return toast('Esta disciplina não está disponível.'); }
    const dl = discLockOf(d);
    if (dl) { location.hash = '#informatica/cursos'; return toast(`Esta disciplina ainda está trancada. Conclua ${dl.titulo} para liberar.`); }
    const adm = isAdmin(), items = discItems(d.id), p = discProg(d), y = scrollY;
    const notas = items.map((c) => contProg(c.id)?.hist).filter((h) => Array.isArray(h) && h.length).map((h) => Math.max(...h.map((x) => x.nota)));
    const media = notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : '–';
    view.innerHTML = `
    <div class="wrap pfd" style="--tint:${discTint(d)}">
      <button class="pfd-back" type="button">${svg('prev')} Plataforma de Informática</button>
      <header class="pfd-hero">
        <div class="pfd-hero-img">${d.image ? `<img src="${esc(imgUrl(d.image))}" alt="">` : `<span class="pfd-hero-ph">${svg(d.ico || 'book')}</span>`}</div>
        <div class="pfd-hero-txt">
          <span class="pfd-tag">Disciplina${adm && !d.visivel ? ' · Rascunho' : ''}</span>
          <h1>${esc(d.titulo || 'Sem título')}</h1>
          ${d.desc ? `<p>${esc(d.desc)}</p>` : ''}
          <div class="pfd-stats">
            <span><b>${p.n}</b>${p.n === 1 ? 'aula' : 'aulas'}</span>
            <span><b>${p.ok}</b>${p.ok === 1 ? 'aprovada' : 'aprovadas'}</span>
            <span><b>${media}</b>nota média</span>
          </div>
          <div class="pfd-bar" role="progressbar" aria-label="Aulas aprovadas" aria-valuemin="0" aria-valuemax="${p.n}" aria-valuenow="${p.ok}"><i style="--p:${p.n ? p.ok / p.n : 0}"></i></div>
        </div>
        ${adm ? `<div class="pf-adm"><button class="pf-adm-btn" type="button" data-editdisc="${esc(d.id)}" aria-label="Editar a disciplina" title="Editar disciplina">${svg('pen')}</button><button class="pf-adm-btn" type="button" data-deldisc="${esc(d.id)}" aria-label="Apagar a disciplina" title="Apagar disciplina">${svg('trash')}</button></div>` : ''}
      </header>
      <section class="pfd-list" aria-label="Conteúdos da disciplina">
        <div class="pf-mods-head">
          <h2 class="pf-st-title">Aulas <span>Uma de cada vez: passe com nota 7 ou mais para liberar a próxima</span></h2>
          ${items.length || adm ? `<div class="ap-paddles pf-mod-paddles">
            <button class="ap-paddle" data-adir="-1" aria-label="Aulas anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
            <button class="ap-paddle" data-adir="1" aria-label="Próximas aulas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>` : ''}
        </div>
        ${items.length || adm ? `<div class="pf-mod-row pfd-row" id="pfd-row">${items.map(contCard).join('')}
          ${adm ? `<button class="pf-cnew" type="button" data-newcont="${esc(d.id)}"><span>${svg('plus')}</span><b>Novo conteúdo</b><small>Texto, PDF, questionário ou prova</small></button>` : ''}
        </div>
        <div class="pf-mod-open pfd-open" id="pfd-open"><div class="pf-mod-inner pfd-inner" id="pfd-inner"></div></div>` : `<div class="pf-cempty"><div class="pf-cempty-icos">${['texto', 'pdf', 'quiz', 'prova'].map((k, i) => `<span style="--tint:${CT[k].tint};--i:${i}">${svg(k)}</span>`).join('')}</div>
          <h3>Em breve, novos conteúdos</h3><p>Os textos, PDFs, questionários e provas desta disciplina vão aparecer aqui.</p></div>`}
      </section>
    </div>`;
    view.querySelector('.pfd-back').addEventListener('click', () => { location.hash = '#informatica/cursos'; });
    bindCards(view.querySelector('.pfd'), view, (cid) => toggleAula(view, cid)); paintCapas(view);
    openAula = null;
    /* aulas numa fileira só, com as setas em cima à direita (e as barrinhas embaixo no celular);
       abre já mostrando a aula em que o aluno está (a primeira ainda não aprovada) */
    const row = view.querySelector('#pfd-row');
    if (row) {
      const pads = view.querySelectorAll('[data-adir]');
      pads.forEach((b) => b.addEventListener('click', () => row.scrollBy({ left: +b.dataset.adir * row.clientWidth * .8, behavior: 'smooth' })));
      const upd = () => { if (!pads.length || !row.isConnected) return; pads[0].disabled = row.scrollLeft < 4; pads[1].disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4; pads[0].parentNode.classList.toggle('none', pads[0].disabled && pads[1].disabled); };
      row.addEventListener('scroll', upd, { passive: true });
      if (discResize) removeEventListener('resize', discResize);
      discResize = upd; addEventListener('resize', upd, { passive: true });
      const curIdx = items.findIndex((c) => !contDone(c.id));
      const curCard = curIdx > 0 ? row.children[curIdx] : null;
      if (keepScroll && discRowX[d.id] != null) row.scrollLeft = discRowX[d.id];
      else if (curCard) row.scrollLeft = Math.max(0, curCard.offsetLeft - row.offsetLeft - 2);
      row.addEventListener('scroll', () => { discRowX[d.id] = row.scrollLeft; }, { passive: true });
      upd(); rowDots(row);
    }
    if (keepScroll) scrollTo(0, y); else scrollTo(0, 0);
    // vindo de uma aula (endereço direto, fim da leitura, "Ir para o questionário"): já abre a aula expandida e desce até ela
    const want = window.HC_aulaOpen;
    if (want && row && items.some((c) => c.id === want.id)) {
      window.HC_aulaOpen = null;
      const el = row.querySelector(`[data-cont="${want.id}"]`);
      if (el) row.scrollLeft = Math.max(0, el.offsetLeft - row.offsetLeft - 2);
      toggleAula(view, want.id, !!want.test);
      setTimeout(() => { const top = row.getBoundingClientRect().top + scrollY - 110; window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' }); }, 400);
    }
    sync(view); // notas feitas em outro aparelho destrancam as aulas aqui também
  }
  /* página da disciplina: tocar numa aula abre embaixo da fileira a pré-tela dela (o que tem, o caminho das partes,
     a situação do aluno e as regras), crescendo para baixo como os módulos; tocar de novo fecha. Os botões de dentro
     levam à tela da aula já no modo escolhido. Aula trancada só avisa. */
  let openAula = null;
  async function toggleAula(view, id, test = false) {
    const c = conts().find((x) => x.id === id); if (!c) return;
    if (!c.arquivo || lockOf(c)) return openCont(id); // trancada ou ainda sem texto: o mesmo aviso de antes
    const box = view.querySelector('#pfd-open'), inner = view.querySelector('#pfd-inner'); if (!box) return;
    const cards = view.querySelectorAll('#pfd-row [data-cont]');
    const setCards = () => cards.forEach((el) => {
      const on = el.dataset.cont === openAula; el.classList.toggle('open', on); el.setAttribute('aria-expanded', on);
      const go = el.querySelector('.pf-lesson-go');
      if (go) { go.dataset.txt ||= go.textContent; go.textContent = on ? 'Fechar' : go.dataset.txt; }
    });
    view.querySelector('#pfd-row').classList.toggle('has-open', openAula !== id);
    if (openAula === id) { // fechar
      openAula = null; setCards(); box.classList.remove('show');
      setTimeout(() => { if (openAula === null) inner.innerHTML = ''; }, 850);
      return;
    }
    const swap = openAula !== null;
    openAula = id; setCards();
    try { await Promise.all([load('curso/conteudo.css'), load('curso/conteudo.js'), load(c.arquivo)]); }
    catch { openAula = null; setCards(); return toast('Não foi possível abrir a aula. Verifique a internet e tente de novo.'); }
    if (openAula !== id || !view.isConnected) return;
    const d = discs().find((x) => x.id === c.disc), nx = nextOf(c);
    const fill = () => {
      window.HC_conteudo.open(inner, window.HC_CONTEUDOS[id], { id, embed: true, test, image: c.image ? imgUrl(c.image) : '', tint: c.seq && d ? discTint(d) : (CT[c.tipo] || CT.texto).tint, admin: isAdmin(),
        back: d ? `#informatica/disciplina-${d.id}` : '#informatica/cursos', backLabel: d?.titulo || 'Disciplinas', rotulo: c.rotulo || '', disciplina: d?.titulo || '',
        next: nx ? { hash: `#informatica/conteudo-${nx.id}`, nome: nx.rotulo?.split(' · ')[0] || 'próxima aula', titulo: nx.titulo } : null });
      inner.classList.remove('enter'); void inner.offsetWidth; inner.classList.add('enter');
    };
    if (swap) { box.classList.remove('show'); setTimeout(() => { if (openAula === id) { fill(); box.classList.add('show'); } }, 650); }
    else { fill(); box.classList.add('show'); }
    // sobe a página um pouco para o aluno ver que abriu algo embaixo (sem esconder o painel atrás da barra de cima)
    setTimeout(() => {
      const bar = document.querySelector('.topbar-wrap, .topbar');
      const limit = (bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0) + 20;
      const top = box.getBoundingClientRect().top;
      const step = Math.min(Math.round(innerHeight * .3), 300, top - limit);
      if (step > 24) window.scrollBy({ top: step, behavior: 'smooth' });
    }, swap ? 900 : 300);
  }
  /* abrir um conteúdo: os prontos (com arquivo) abrem a tela de leitura; os outros ainda serão montados */
  function openCont(id) {
    const c = conts().find((x) => x.id === id); if (!c) return;
    const lk = lockOf(c);
    if (lk) return toast(lk.disc ? `Esta disciplina ainda está trancada. Conclua ${lk.disc.titulo} para liberar.` : `Esta aula ainda está trancada. Passe na ${lk.rotulo?.split(' · ')[0] || 'aula anterior'} com nota 7 ou mais para liberar.`);
    if (c.arquivo) { location.hash = `#informatica/conteudo-${c.id}`; return; }
    toast(`${(CT[c.tipo] || CT.texto).nome} “${c.titulo || 'Sem título'}”: o conteúdo será liberado em breve.`);
  }
  async function openContPage(view, id) {
    const c = conts().find((x) => x.id === id);
    const d = c && discs().find((x) => x.id === c.disc);
    if (!c?.arquivo || (!isAdmin() && (!c.visivel || !d?.visivel))) { location.hash = '#informatica/cursos'; return toast('Este conteúdo não está disponível.'); }
    if (lockOf(c)) { const lk = lockOf(c); location.hash = lk.disc ? '#informatica/cursos' : `#informatica/disciplina-${c.disc}`; return toast(lk.disc ? `Esta disciplina ainda está trancada. Conclua ${lk.disc.titulo} para liberar.` : 'Esta aula ainda está trancada. Passe na anterior com nota 7 ou mais.'); }
    view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando o conteúdo…</p></div>';
    try { await Promise.all([load('curso/conteudo.css'), load('curso/figuras.js'), load('curso/conteudo.js'), load(c.arquivo), load('curso/capas.css'), load('curso/capas.js').catch(() => {})]); }
    catch { view.innerHTML = '<div class="wrap"><p class="me-loading">Não foi possível abrir o conteúdo. Verifique a internet e tente de novo.</p></div>'; return; }
    if (location.hash !== `#informatica/conteudo-${id}`) return;
    const nx = nextOf(c);
    const go = window.HC_conteudoGo?.id === id ? window.HC_conteudoGo : null; window.HC_conteudoGo = null; // vindo da pré-tela aberta na página da disciplina
    window.HC_conteudo.open(view, window.HC_CONTEUDOS[id], { ...(go ? { modo: go.modo, verRes: go.verRes, test: go.test, loading: true } : {}), id, image: c.image ? imgUrl(c.image) : '', tint: c.seq && d ? discTint(d) : (CT[c.tipo] || CT.texto).tint, admin: isAdmin(),
      back: d ? `#informatica/disciplina-${d.id}` : '#informatica/cursos', backLabel: d?.titulo || 'Disciplinas',
      rotulo: c.rotulo || '', disciplina: d?.titulo || '', next: nx ? { hash: `#informatica/conteudo-${nx.id}`, nome: nx.rotulo?.split(' · ')[0] || 'próxima aula', titulo: nx.titulo } : null });
  }
  /* administrador: criar (id null) ou editar um card de conteúdo */
  function editCont(view, id, discId) {
    if (!isAdmin() || document.querySelector('.lk') || typeof saveCursoConteudo !== 'function') return;
    const old = id ? conts().find((x) => x.id === id) : null; if (id && !old) return;
    const cur = old ? { ...old } : { tipo: 'texto', titulo: '', desc: '', image: '', visivel: false, disc: discId || DISCS_BASE[0].id };
    const dName = discs().find((x) => x.id === cur.disc)?.titulo || 'Disciplina';
    let img; // undefined = sem troca; '' = remover; 'idb:…' = nova foto
    const wrap = document.createElement('div');
    wrap.className = 'lk au';
    wrap.innerHTML = `<div class="lk-backdrop"></div>
      <form class="lk-card au-card pf-ed" role="dialog" aria-modal="true" aria-labelledby="ec-t" novalidate>
        <h2 id="ec-t">${old ? 'Editar conteúdo' : 'Novo conteúdo'}</h2>
        <p class="lk-sub">Disciplina ${esc(dName)} · aparece na página da disciplina.</p>
        <span class="au-label">Tipo</span>
        <div class="pf-ed-types" role="radiogroup" aria-label="Tipo do conteúdo">${Object.entries(CT).map(([k, t]) => `
          <button type="button" role="radio" class="pf-ed-type" data-tipo="${k}" style="--tint:${t.tint}" aria-checked="${cur.tipo === k}">${svg(k)}<span>${t.nome}</span></button>`).join('')}
        </div>
        <div class="pf-ed-covers"><div class="pf-ed-one">
          <div class="pf-ed-cover" style="aspect-ratio:4 / 5"><div class="pf-ed-prev"></div>
            <div class="pf-ed-acts"><button type="button" class="pf-ed-btn" data-ed="pick">${svg('photo')}Trocar foto</button><button type="button" class="pf-ed-btn" data-ed="clear">Remover</button></div>
          </div>
          <small class="pf-ed-hint">Tamanho sugerido: 1000 × 1250 (JPG, PNG ou WebP)</small>
          <input type="file" accept="image/*" hidden>
        </div></div>
        <label class="au-label" for="ec-titulo">Título</label>
        <div class="lk-field"><input id="ec-titulo" value="${esc(cur.titulo || '')}" autocomplete="off" placeholder="Ex.: Partes do computador"></div>
        <label class="au-label" for="ec-desc">Descrição no card</label>
        <div class="lk-field"><textarea id="ec-desc" rows="3" placeholder="Uma frase sobre o que o aluno vai aprender">${esc(cur.desc || '')}</textarea></div>
        <label class="au-label" for="ec-meta">Linha de baixo (opcional)</label>
        <div class="lk-field"><input id="ec-meta" value="${esc(cur.meta || '')}" autocomplete="off" placeholder="Ex.: 10 questões · 5 min de leitura"></div>
        <label class="pf-ed-check"><input type="checkbox" id="ec-vis"${cur.visivel ? ' checked' : ''}><span><b>Visível para os alunos</b><small>Desligado, só os administradores veem o card (rascunho).</small></span></label>
        <p class="lk-msg" role="alert"></p>
        <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">${old ? 'Salvar' : 'Criar'}</button></div>
      </form>`;
    document.body.appendChild(wrap);
    const msg = wrap.querySelector('.lk-msg'), prev = wrap.querySelector('.pf-ed-prev'), file = wrap.querySelector('input[type=file]');
    let tipo = cur.tipo in CT ? cur.tipo : 'texto';
    const show = () => {
      const src = img === undefined ? cur.image : img;
      prev.innerHTML = src ? `<img src="${esc(imgUrl(src))}" alt="">` : `<span>${svg(tipo)}Sem foto de capa</span>`;
      wrap.querySelector('[data-ed="clear"]').hidden = !src;
    };
    show();
    wrap.querySelectorAll('.pf-ed-type').forEach((b) => b.addEventListener('click', () => {
      tipo = b.dataset.tipo; wrap.querySelectorAll('.pf-ed-type').forEach((x) => x.setAttribute('aria-checked', x === b)); show();
    }));
    wrap.querySelector('[data-ed="pick"]').addEventListener('click', () => file.click());
    wrap.querySelector('[data-ed="clear"]').addEventListener('click', () => { img = ''; show(); });
    file.addEventListener('change', async () => {
      const f = file.files[0]; file.value = ''; if (!f) return;
      msg.textContent = '';
      try { prev.classList.add('busy'); img = await storeImage(f, 'curso'); show(); }
      catch { msg.textContent = 'Não foi possível usar essa imagem. Tente outra.'; }
      finally { prev.classList.remove('busy'); }
    });
    const close = () => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 300); };
    wrap.querySelector('.lk-backdrop').addEventListener('click', close);
    wrap.querySelector('.lk-cancel').addEventListener('click', close);
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    const tIn = wrap.querySelector('#ec-titulo');
    wrap.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const titulo = tIn.value.trim();
      if (!titulo) { msg.textContent = 'Dê um título ao conteúdo.'; return tIn.focus(); }
      const next = { ...cur, id: old?.id || 'c' + Date.now().toString(36), tipo, titulo,
        desc: wrap.querySelector('#ec-desc').value.trim(), meta: wrap.querySelector('#ec-meta').value.trim(),
        visivel: wrap.querySelector('#ec-vis').checked, image: img === undefined ? cur.image || '' : img };
      if (!next.meta) delete next.meta;
      delete next.arquivo; delete next.fixo;
      cursoConteudo = old && saved().some((x) => x.id === old.id) ? saved().map((x) => (x.id === old.id ? next : x)) : [...saved(), next];
      saveCursoConteudo(); close(); refreshAfter(view, !old);
      toast(old ? 'Conteúdo salvo.' : 'Conteúdo criado.');
    });
    requestAnimationFrame(() => { wrap.classList.add('in'); if (!old) tIn.focus(); });
  }

  /* administrador: criar (id null) ou editar uma disciplina */
  function editDisc(view, id) {
    if (!isAdmin() || document.querySelector('.lk') || typeof saveCursoConteudo !== 'function') return;
    const old = id ? discs().find((x) => x.id === id) : null; if (id && !old) return;
    const cur = old ? { ...old } : { kind: 'disc', titulo: '', desc: '', image: '', cor: discs().length % DTINTS.length, visivel: false };
    let img, cor = +cur.cor || 0; // img: undefined = sem troca; '' = remover; 'idb:…' = nova foto
    const wrap = document.createElement('div');
    wrap.className = 'lk au';
    wrap.innerHTML = `<div class="lk-backdrop"></div>
      <form class="lk-card au-card pf-ed" role="dialog" aria-modal="true" aria-labelledby="ed-dt" novalidate>
        <h2 id="ed-dt">${old ? 'Editar disciplina' : 'Nova disciplina'}</h2>
        <p class="lk-sub">Disciplinas · o card fica abaixo dos módulos e abre a página com os conteúdos dela.</p>
        <div class="pf-ed-covers"><div class="pf-ed-one">
          <div class="pf-ed-cover" style="aspect-ratio:4 / 5"><div class="pf-ed-prev"></div>
            <div class="pf-ed-acts"><button type="button" class="pf-ed-btn" data-ed="pick">${svg('photo')}Trocar foto</button><button type="button" class="pf-ed-btn" data-ed="clear">Remover</button></div>
          </div>
          <small class="pf-ed-hint">Tamanho sugerido: 1000 × 1250 (JPG, PNG ou WebP)</small>
          <input type="file" accept="image/*" hidden>
        </div></div>
        <span class="au-label">Cor do card</span>
        <div class="pf-ed-cores" role="radiogroup" aria-label="Cor do card">${DTINTS.map((t, k) => `<button type="button" role="radio" class="pf-ed-cor" data-cor="${k}" style="--tint:${t}" aria-checked="${k === cor}" aria-label="Cor ${k + 1}"></button>`).join('')}</div>
        <label class="au-label" for="ed-dtit">Nome da disciplina</label>
        <div class="lk-field"><input id="ed-dtit" value="${esc(cur.titulo || '')}" autocomplete="off" placeholder="Ex.: Digitação, Windows, Internet"></div>
        <label class="au-label" for="ed-ddesc">Descrição no card</label>
        <div class="lk-field"><textarea id="ed-ddesc" rows="3" placeholder="Uma frase sobre o que o aluno vai aprender nela">${esc(cur.desc || '')}</textarea></div>
        <label class="pf-ed-check"><input type="checkbox" id="ed-dvis"${cur.visivel ? ' checked' : ''}><span><b>Visível para os alunos</b><small>Desligado, só os administradores veem a disciplina (rascunho).</small></span></label>
        <p class="lk-msg" role="alert"></p>
        <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">${old ? 'Salvar' : 'Criar'}</button></div>
      </form>`;
    document.body.appendChild(wrap);
    const msg = wrap.querySelector('.lk-msg'), prev = wrap.querySelector('.pf-ed-prev'), file = wrap.querySelector('input[type=file]');
    const show = () => {
      const src = img === undefined ? cur.image : img;
      prev.style.setProperty('--tint', DTINTS[cor]);
      prev.innerHTML = src ? `<img src="${esc(imgUrl(src))}" alt="">` : `<span>${svg('book')}Sem foto de capa</span>`;
      wrap.querySelector('[data-ed="clear"]').hidden = !src;
    };
    show();
    wrap.querySelectorAll('.pf-ed-cor').forEach((b) => b.addEventListener('click', () => {
      cor = +b.dataset.cor; wrap.querySelectorAll('.pf-ed-cor').forEach((x) => x.setAttribute('aria-checked', x === b)); show();
    }));
    wrap.querySelector('[data-ed="pick"]').addEventListener('click', () => file.click());
    wrap.querySelector('[data-ed="clear"]').addEventListener('click', () => { img = ''; show(); });
    file.addEventListener('change', async () => {
      const f = file.files[0]; file.value = ''; if (!f) return;
      msg.textContent = '';
      try { prev.classList.add('busy'); img = await storeImage(f, 'curso'); show(); }
      catch { msg.textContent = 'Não foi possível usar essa imagem. Tente outra.'; }
      finally { prev.classList.remove('busy'); }
    });
    const close = () => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 300); };
    wrap.querySelector('.lk-backdrop').addEventListener('click', close);
    wrap.querySelector('.lk-cancel').addEventListener('click', close);
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    const tIn = wrap.querySelector('#ed-dtit');
    wrap.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const titulo = tIn.value.trim();
      if (!titulo) { msg.textContent = 'Dê um nome à disciplina.'; return tIn.focus(); }
      const next = { ...cur, kind: 'disc', id: old?.id || 'd' + Date.now().toString(36), titulo, cor,
        desc: wrap.querySelector('#ed-ddesc').value.trim(), visivel: wrap.querySelector('#ed-dvis').checked, image: img === undefined ? cur.image || '' : img };
      delete next.fixo;
      cursoConteudo = old && saved().some((x) => x.id === old.id) ? saved().map((x) => (x.id === old.id ? next : x)) : [...saved(), next];
      saveCursoConteudo(); close(); refreshAfter(view, !old);
      toast(old ? 'Disciplina salva.' : 'Disciplina criada.');
    });
    requestAnimationFrame(() => { wrap.classList.add('in'); if (!old) tIn.focus(); });
  }

  /* lições: o motor (licao.js/.css) e os dados de cada lição só são baixados quando o aluno abre uma */
  const loaded = {};
  const load = (file) => loaded[file] ||= new Promise((ok, fail) => {
    const src = `${file}?v=${window.HC_V || ''}`; // versão nova a cada publicação: o navegador não usa a cópia antiga
    if (file.endsWith('.css')) { const l = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: src }); l.onload = ok; l.onerror = ok; document.head.append(l); return; }
    const sc = Object.assign(document.createElement('script'), { src }); sc.onload = ok; sc.onerror = () => { delete loaded[file]; fail(); }; document.body.append(sc);
  });
  const lessonAt = (n) => HC_CURSO.modulos.flatMap((m) => m.licoes)[n - 1];
  async function openLesson(view, n) {
    const l = lessonAt(n);
    if (!l?.arquivo) { introEnd(); location.hash = '#informatica/cursos'; return toast('Esta lição será montada em breve.'); }
    view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando a lição…</p></div>';
    try { await Promise.all([load('curso/licao.css'), load('curso/teclado.js'), load('curso/licao.js'), load(l.arquivo), load('curso/capas.css'), load('curso/capas-teclas.js').catch(() => {})]); }
    catch { view.innerHTML = '<div class="wrap"><p class="me-loading">Não foi possível abrir a lição. Verifique a internet e tente de novo.</p></div>'; return introEnd(); }
    if (location.hash !== `#informatica/licao-${n}`) return introEnd();
    window.HC_licao.open(view, window.HC_LICOES[`licao-${n}`], lessonMeta(n));
    introEnd();
  }
  /* o que a tela da lição herda do card: etiqueta, texto, foto de capa, cor e estrelas */
  function lessonMeta(n) {
    let c = 0;
    for (const m of HC_CURSO.modulos) {
      if (n - 1 < c + m.licoes.length) {
        const i = n - 1 - c, l = m.licoes[i];
        return { tag: l.tag || '', desc: l.desc || '', imagem: l.imagem ? imgUrl(l.imagem) : '', tint: TINTS[i % TINTS.length], capa: l.capa || '', k: i, stars: (p) => cardStars(p) };
      }
      c += m.licoes.length;
    }
    return {};
  }

  /* ---------- Abertura da lição ----------
     Ao começar ou continuar uma lição, faixas brancas diagonais cobrem a área da plataforma
     (a barra de cima e a lateral continuam por cima), o logo da Plataforma de Informática
     aparece com um brilho e um selo mostra a lição. Com a tela branca, a lição carrega por
     trás; depois as faixas saem varrendo para a esquerda e revelam a lição.
     Só transform e opacity, para rodar leve; quem pede "reduzir movimento" não vê. */
  const INTRO_PEAK = 1900, INTRO_MIN = 6900; // ms: quando a tela fica branca / tempo mínimo na tela
  const LOAD_AT = 2100, LOAD_MS = 4500; // barrinha de carregamento: quando começa e quanto dura
  /* ritmos da barrinha (momento, quanto já encheu): cada abertura sorteia um e varia um pouco,
     para parecer um carregamento de verdade e não sempre a mesma animação */
  const LOAD_PROFILES = [
    [[0, 0], [.22, .46], [.55, .74], [.82, .9], [1, 1]],                         // começa rápido e vai reduzindo
    [[0, 0], [.35, .12], [.62, .33], [.84, .7], [1, 1]],                         // começa devagar e acelera no fim
    [[0, 0], [.18, .3], [.42, .37], [.54, .63], [.8, .82], [1, 1]],              // para um pouco no meio e dá um salto
    [[0, 0], [.14, .2], [.3, .23], [.48, .55], [.62, .58], [.86, .94], [1, 1]],  // em etapas, como arquivos baixando
    [[0, 0], [.1, .06], [.4, .58], [.7, .66], [.9, .97], [1, 1]],                // arranque, pausa longa e final rápido
  ];
  const LOAD_EASES = ['cubic-bezier(.2, .7, .3, 1)', 'cubic-bezier(.6, 0, .8, .4)', 'cubic-bezier(.45, 0, .2, 1)', 'linear', 'cubic-bezier(.3, .1, .3, 1)'];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function loadFrames() {
    let last = 0;
    return pick(LOAD_PROFILES).map(([t, p], i, arr) => {
      const end = i === arr.length - 1;
      const v = end ? 1 : i === 0 ? 0 : Math.min(.97, Math.max(last + .02, p + (Math.random() - .5) * .1));
      last = v;
      return { offset: t, transform: `scaleX(${v.toFixed(3)})`, easing: pick(LOAD_EASES) };
    });
  }
  let intro = null;
  function introStart(n, l, opt = {}) {
    introEnd(true);
    const p = progress(n), num = String(n).padStart(2, '0');
    const what = opt.sub || (p?.done ? 'Refazer a lição' : p && p.lvl > 0 ? `Continuando · Nível ${Math.min(p.lvl + 1, p.total)} de ${p.total}` : 'Começando agora');
    const sb = document.querySelector('.sidebar');
    const left = sb && getComputedStyle(sb).display !== 'none' ? Math.max(0, Math.round(sb.getBoundingClientRect().right)) : 0;
    const el = document.createElement('div');
    el.className = 'pfi'; el.style.left = left + 'px'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="pfi-bands">${[0, 1, 2, 3, 4, 5, 6].map((k) => `<i style="--k:${k}"></i>`).join('')}</div>
      <div class="pfi-white"></div>
      <div class="pfi-halo"></div>
      <div class="pfi-logo"><img src="assets/plataforma-informatica.webp" width="900" height="184" alt=""><span class="pfi-shine"></span>
        <div class="pfi-load"><div class="pfi-track"><i class="pfi-fill"></i></div><span class="pfi-load-txt"><em>${esc(opt.label || 'Carregando a atividade')}</em><b>0%</b></span></div>
      </div>
      <div class="pfi-chip"><b>${num}</b><span><strong>${esc(l.titulo)}</strong><small>Lição ${num} · ${esc(what)}</small></span></div>`;
    document.body.append(el);
    intro = { el, t0: performance.now(), done: false };
    intro.safety = setTimeout(() => introEnd(), 12000); // nunca fica presa na tela
    requestAnimationFrame(() => el.classList.add('in'));
    // barrinha de carregamento: enche em LOAD_MS com um ritmo sorteado; a porcentagem acompanha
    const fill = el.querySelector('.pfi-fill'), pct = el.querySelector('.pfi-load-txt b');
    const anim = fill.animate(loadFrames(), { duration: LOAD_MS, delay: LOAD_AT, fill: 'both' });
    const tick = () => {
      if (!el.isConnected) return;
      const m = /matrix\(([^,]+)/.exec(getComputedStyle(fill).transform);
      pct.textContent = Math.round((m ? +m[1] : 0) * 100) + '%';
      if (anim.playState !== 'finished') requestAnimationFrame(tick);
      else { pct.textContent = '100%'; el.querySelector('.pfi-load').classList.add('done'); }
    };
    requestAnimationFrame(tick);
  }
  function introEnd(now = false) {
    const it = intro; if (!it || it.done) return;
    it.done = true; intro = null; clearTimeout(it.safety);
    if (now) return it.el.remove();
    const wait = Math.max(0, INTRO_MIN - (performance.now() - it.t0));
    setTimeout(() => { it.el.classList.add('out'); setTimeout(() => it.el.remove(), 2300); }, wait);
  }
  // a mesma abertura, usada também na saída da tela de resultado ("Retornando à plataforma")
  window.HC_intro = { play: (n, l, opt) => introStart(n, l, opt), end: () => introEnd(), PEAK: INTRO_PEAK };
  // progresso salvo de cada lição (para mostrar no card); antes de abrir a 1ª lição ainda não há nada
  // estrelas do card (mesmas metas da tela de resultado): quantas o aluno pegou e se são amarelas, Superstar ou Megastar
  const PTS_MAX = 13000, STAR_AT = [2000, 4000, 6000, 8000, 10000], SUPER_AT = 11000, MEGA_AT = 12000;
  function cardStars(p) {
    if (!p) return '';
    const pts = Math.min(PTS_MAX, (p.levelPts || []).reduce((t, x) => t + (x || 0), 0));
    const n = STAR_AT.filter((t) => pts >= t).length;
    if (!n && !p.done) return '';
    const kind = pts >= MEGA_AT ? 'megastar' : pts >= SUPER_AT ? 'superstar' : 'amarela';
    const label = `${n} de 5 estrelas${kind === 'megastar' ? ' · Megastar' : kind === 'superstar' ? ' · Superstar' : ''}`;
    return `<span class="pf-lesson-stars" role="img" aria-label="${label}" title="${label}">${STAR_AT.map((_, i) => `<img src="assets/estrelas/estrela-${i < n ? kind : 'vazia'}.png" alt="" draggable="false"${i < n ? '' : ' class="off"'}>`).join('')}</span>`;
  }
  const progress = (n) => { try { return JSON.parse(localStorage.getItem(`hc:info:${auth?.user?.id || 'anon'}:licao-${n}`) || 'null'); } catch { return null; } };

  /* =========================================================
     BANNERS DINÂMICOS (carrossel do topo da plataforma)
     1º: o banner do módulo (fixo). 2º: Saldo HC. 3º: nível e XP. Os dinâmicos mostram o progresso
     do aluno e animam as informações (na área escura da esquerda) só na primeira vez que o banner entra.
     Imagem de fundo: o administrador troca pelo lápis (fica em cursoEdit, ids "bsaldo" e "bnivel");
     sem imagem, cada um tem um fundo próprio desenhado aqui.
     ========================================================= */
  const PF_SLIDE_MS = 9000;
  const PF_BANNERS = { bmod: 'Banner do módulo', bsaldo: 'Banner do saldo', bnivel: 'Banner do nível', bpatente: 'Banner das patentes' };
  const bannerImg = (id) => edits().find((x) => x.id === id)?.image || '';
  /* imagem do banner como fundo: a do computador e, se houver, a própria do celular */
  const bannerSpan = (id) => {
    const e = edits().find((x) => x.id === id) || {};
    if (!e.image && !e.imageMobile) return '';
    return `<span class="pf-hero-img" style="--img:url('${esc(imgUrl(e.image || e.imageMobile))}')${e.imageMobile ? `;--img-m:url('${esc(imgUrl(e.imageMobile))}')` : ''}"></span>`;
  };
  const nf = (v) => v.toLocaleString('pt-BR');
  const bannerBg = (id, deco) => {
    return `<div class="pf-hero-bg pfb-bg pfb-bg-${id}">${bannerSpan(id) || deco}</div>`;
  };
  const admPen = (id) => (isAdmin() ? `<div class="pf-adm pfb-adm"><button class="pf-adm-btn" type="button" data-editbanner="${id}" aria-label="Trocar a imagem de fundo do ${PF_BANNERS[id].toLowerCase()}" title="Trocar imagem de fundo">${svg('pen')}</button></div>` : '');
  function cashBanner() {
    if (!window.HC_cash) return '';
    const c = window.HC_cash.get(), C = window.HC_cash, last = c.hist.find((h) => h.v > 0); // o histórico também guarda gastos (negativos)
    const lastTxt = last ? `Último ganho <b>+${window.HC_cashFmt(last.v)}</b>${/^licao-\d+$/.test(last.m || '') ? ` · Lição ${String(last.m.split('-')[1]).padStart(2, '0')}` : ''}` : 'Conclua lições e ganhe moedas pelas estrelas';
    return `
          <div class="pf-slide pfb pfb-cash" data-b="saldo" aria-roledescription="slide" aria-label="2 de 4: Saldo HC ${window.HC_cashFmt(c.saldo)}">
            ${bannerBg('bsaldo', `<img class="pfb-deco-coin" src="assets/moeda/p2.webp" alt="" draggable="false"><img class="pfb-deco-coin d2" src="assets/moeda/p5.webp" alt="" draggable="false"><img class="pfb-deco-coin d3" src="assets/moeda/p9.webp" alt="" draggable="false">`)}
            <div class="pfb-body">
              <div class="pfb-coin" aria-hidden="true"><i class="pfb-glow"></i><span class="pfb-radar"><i></i><i></i><i></i></span><img src="assets/moeda/moeda.webp" alt="" draggable="false"></div>
              <div class="pfb-info">
                <span class="pill">Saldo HC</span>
                <strong class="pfb-cash-val" data-cash="${Math.round(c.saldo * 100)}" aria-hidden="true"></strong>
                <p class="pfb-sub">${lastTxt}</p>
                <div class="pfb-rates"><span><img src="assets/estrelas/estrela-amarela.png" alt="">${window.HC_cashFmt(C.POR_ESTRELA)}</span><span><img src="assets/estrelas/estrela-superstar.png" alt="">+${window.HC_cashFmt(C.SUPERSTAR)}</span><span><img src="assets/estrelas/estrela-megastar.png" alt="">+${window.HC_cashFmt(C.MEGASTAR)}</span></div>
              </div>
            </div>
            ${admPen('bsaldo')}
          </div>`;
  }
  function levelBanner() {
    const X = window.HC_xp; if (!X) return '';
    const x = X.get();
    return `
          <div class="pf-slide pfb pfb-lvl" data-b="nivel" aria-roledescription="slide" aria-label="3 de 4: nível ${x.nivel}, ${nf(x.xp)} XP">
            ${bannerBg('bnivel', `<svg class="pfb-deco-ring" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="80"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="40"/></svg>`)}
            <div class="pfb-body">
              <div class="pfb-ring" aria-hidden="true" style="--p:${(x.pct / 100).toFixed(4)}">
                <span class="pfb-ring-glow"></span>
                <svg viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="pfbRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f05a5a"/><stop offset="1" stop-color="#c81e3c"/></linearGradient>
                    <linearGradient id="pfbGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a2e"/><stop offset="1" stop-color="#ffd84a"/></linearGradient>
                    <radialGradient id="pfbCore" cx=".42" cy=".3" r=".8">${window.HC_levelColor(x.nivel).map((c, i) => `<stop offset="${[0, .45, 1][i]}" stop-color="${c}"/>`).join('')}</radialGradient>
                  </defs>
                  <circle class="pr-disc" cx="100" cy="100" r="97" fill="url(#pfbRed)"/>
                  <circle class="pr-track" cx="100" cy="100" r="79" fill="none" stroke="rgba(0,0,0,.14)" stroke-width="26" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 100 100)"/>
                  <circle class="pr-arc" cx="100" cy="100" r="79" fill="none" stroke="url(#pfbGold)" stroke-width="26" stroke-linecap="butt" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 100 100)"/>
                  <circle class="pr-border" cx="100" cy="100" r="97" fill="none" stroke="#fff" stroke-width="2.5" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 100 100)"/>
                  <circle class="pr-white" cx="100" cy="100" r="63" fill="#fff"/>
                  <circle class="pr-core" cx="100" cy="100" r="56" fill="url(#pfbCore)"/>
                  <path class="pr-shine" d="M60 78 Q100 40 140 78 L140 70 Q100 30 60 70 Z" fill="rgba(255,255,255,.16)"/>
                </svg>
                <b class="pfb-ring-num" data-count="${x.nivel}" data-pad="2">00</b>
              </div>
              <div class="pfb-info">
                <span class="pill">Seu nível</span>
                <strong class="pfb-xp"><span data-count="${x.xp}">0</span><small> XP</small></strong>
                <p class="pfb-sub">Faltam <b>${nf(x.falta)} XP</b> para o nível ${String(x.nivel + 1).padStart(2, '0')}</p>
                <p class="pfb-sub pfb-sub2">${nf(x.rest)} de ${nf(x.proximo)} XP neste nível · todo XP das lições soma aqui</p>
              </div>
            </div>
            ${admPen('bnivel')}
          </div>`;
  }
  /* banner das patentes: troféu da patente atual, família, quanto falta para a próxima e o botão para ver todas */
  function rankBanner() {
    const X = window.HC_xp; if (!X) return '';
    const xp = X.get().xp, r = X.rankOf(xp), pos = r.i + 1, total = X.RANKS.length;
    return `
          <div class="pf-slide pfb pfb-pat" data-b="patente" style="--rc1:${r.c1};--rc2:${r.c2}" aria-roledescription="slide" aria-label="4 de 4: patente ${esc(r.nome)}">
            ${bannerBg('bpatente', `<span class="pfb-deco-rays"></span><img class="pfb-deco-trophy" src="${esc(r.img)}" alt="" draggable="false" style="filter:${r.tf} drop-shadow(0 30px 40px rgba(0,0,0,.5))">`)}
            <div class="pfb-body">
              <div class="pfb-trophy" aria-hidden="true"><i class="pfb-tglow"></i><img src="${esc(r.img)}" alt="" draggable="false" style="filter:${r.tf}"><i class="pfb-shine" style="--m:url('${esc(new URL(r.img, location.href).href)}')"></i></div>
              <div class="pfb-info">
                <span class="pill">Sua patente · ${pos} de ${total}</span>
                <strong class="pfb-rname">${esc(r.nome)}</strong>
                <div class="pfb-pnext">
                  ${r.next ? `<span>Faltam <b><span data-count="${r.falta}">0</span> XP</b> para <b>${esc(r.next.nome)}</b></span>` : '<span><b>Patente máxima!</b> Você chegou ao topo.</span>'}
                  <div class="pfb-pbar"><i data-p="${(r.pct / 100).toFixed(4)}"></i></div>
                </div>
                <button class="slide-cta pfb-cta" type="button" data-ranks>Ver patentes ${svg('next')}</button>
              </div>
            </div>
            ${admPen('bpatente')}
          </div>`;
  }
  /* janela com todas as patentes: em cima a medalha atual grande (com brilho na cor da família), o XP
     e a barra até a próxima; embaixo as famílias em grade de medalhas: conquistadas (coloridas, com ✓),
     a atual (com anel e "Atual") e as próximas (apagadas, com cadeado e quanto XP falta) */
  function ranksSheet(onClose) {
    const X = window.HC_xp; if (!X || document.querySelector('.lk')) return;
    const xp = X.get().xp, cur = X.rankOf(xp), F = X.FAMILIAS, total = X.RANKS.length;
    const fams = [...new Set(X.RANKS.map((r) => r.fam))];
    const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
    const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>';
    const wrap = document.createElement('div');
    wrap.className = 'lk pfr';
    wrap.innerHTML = `<div class="lk-backdrop"></div>
      <div class="lk-card pfr-card" role="dialog" aria-modal="true" aria-labelledby="pfr-t" style="--rc1:${cur.c1};--rc2:${cur.c2}">
        <button type="button" class="pfr-x" aria-label="Fechar">×</button>
        <div class="pfr-head">
          <div class="pfr-hero" aria-hidden="true"><i class="rays"></i><i class="glow"></i><img src="${esc(cur.img)}" alt="" draggable="false"></div>
          <small>Sua patente · ${cur.i + 1} de ${total}</small>
          <h2 id="pfr-t">${esc(cur.nome)}</h2>
          <p><b>${nf(xp)} XP</b>${cur.next ? ` · faltam <b>${nf(cur.falta)} XP</b> para ${esc(cur.next.nome)}` : ' · patente máxima!'}</p>
          ${cur.next ? `<div class="pfr-prog"><div class="bar"><i style="--p:${(cur.pct / 100).toFixed(4)}"></i></div><img src="${esc(cur.next.img)}" alt="" title="${esc(cur.next.nome)}" draggable="false"></div>` : ''}
          <div class="pfr-dots" aria-hidden="true">${X.RANKS.map((r) => `<i class="${r.i < cur.i ? 'ok' : r.i === cur.i ? 'cur' : ''}" style="--c:${r.c2}"></i>`).join('')}</div>
        </div>
        <div class="pfr-list">
          ${fams.map((f) => {
            const rs = X.RANKS.filter((r) => r.fam === f), got = rs.filter((r) => r.i <= cur.i).length;
            return `
          <section class="pfr-fam" style="--c1:${F[f].c1};--c2:${F[f].c2}">
            <h3><span>${esc(F[f].nome)}</span><small>${got}/${rs.length}</small></h3>
            <div class="pfr-grid">
            ${rs.map((r) => {
              const st = r.i < cur.i ? 'ok' : r.i === cur.i ? 'cur' : 'lock';
              const tag = st === 'ok' ? `${CHECK}Conquistada` : st === 'cur' ? 'Atual' : `${LOCK}${nf(r.xp - xp)} XP`;
              return `<div class="pfr-m ${st}"${st === 'cur' ? ' data-cur' : ''} style="--d:${r.i * 30}ms"><span class="pic"><img src="${esc(r.img)}" alt="" loading="lazy" draggable="false"></span><b>${esc(r.nome)}</b><small>${nf(r.xp)} XP</small><em>${tag}</em></div>`;
            }).join('')}
            </div>
          </section>`;
          }).join('')}
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const close = () => { wrap.classList.remove('in'); setTimeout(() => { wrap.remove(); onClose?.(); }, 300); };
    wrap.querySelector('.lk-backdrop').addEventListener('click', close);
    wrap.querySelector('.pfr-x').addEventListener('click', close);
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    requestAnimationFrame(() => {
      wrap.classList.add('in'); wrap.querySelector('.pfr-x').focus({ preventScroll: true });
      const list = wrap.querySelector('.pfr-list'), c = wrap.querySelector('[data-cur]');
      if (c) list.scrollTop = Math.max(0, c.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop - list.clientHeight / 2 + c.offsetHeight / 2);
    });
  }
  /* saldo em odômetro (centavos): cada casa é uma fita 0–9 que rola; casas da frente ainda zero ficam recolhidas */
  function odometer(el, finalC) {
    const n = Math.max(3, String(finalC).length);
    let html = '';
    for (let k = n - 1; k >= 0; k--) {
      html += `<span class="od-c${k < 2 ? ' cent' : ''}" data-k="${k}"><span class="od-s">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<i>${d}</i>`).join('')}</span></span>`;
      if (k === 2) html += '<span class="od-sep cent">,</span>';
      else if (k > 2 && (k - 2) % 3 === 0) html += `<span class="od-sep" data-k="${k}">.</span>`;
    }
    el.innerHTML = `<span class="od">${html}</span>`;
    const cols = [...el.querySelectorAll('.od-c')].map((c) => [+c.dataset.k, c, c.firstElementChild]);
    const seps = [...el.querySelectorAll('.od-sep[data-k]')].map((c) => [+c.dataset.k, c]);
    return (v) => {
      cols.forEach(([k, c, strip]) => {
        const p = 10 ** k;
        let o = Math.floor(v / p) % 10;
        if (k === 0) o = v % 10; else { const r = v % p; if (r > p - 1) o += r - (p - 1); }
        strip.style.transform = `translateY(${(-o).toFixed(3)}em)`;
        c.classList.toggle('lead', k > 2 && v < p - .001);
      });
      seps.forEach(([k, s]) => s.classList.toggle('lead', v < 10 ** k - .001));
    };
  }
  /* anima as informações do banner que entrou (o verdadeiro e a cópia usada na volta do carrossel) */
  const tween = (ms, delay, fn, done) => {
    const t0 = performance.now() + delay;
    const step = (now) => {
      const t = Math.min(1, Math.max(0, (now - t0) / ms));
      fn(1 - Math.pow(1 - t, 4)); // começa rápido e assenta devagar
      if (t < 1) requestAnimationFrame(step); else done?.();
    };
    requestAnimationFrame(step);
  };
  function playBanner(slide, reduce) {
    const b = slide.dataset.b;
    slide._run = (slide._run || 0) + 1; const run = slide._run, alive = () => slide._run === run && slide.isConnected;
    if (b === 'saldo') {
      const el = slide.querySelector('.pfb-cash-val'), fin = +el.dataset.cash, draw = el._draw ||= odometer(el, fin), coin = slide.querySelector('.pfb-coin');
      coin.classList.remove('fin');
      if (reduce) return draw(fin);
      draw(0);
      tween(2200, 900, (e) => alive() && draw(fin * e), () => { if (alive()) { coin.classList.remove('fin'); void coin.offsetWidth; coin.classList.add('fin'); } });
    } else if (b === 'patente') {
      const bar = slide.querySelector('.pfb-pbar i'), fin = +bar.dataset.p;
      if (reduce) { bar.style.transform = `scaleX(${fin})`; return; }
      bar.style.transform = 'scaleX(0)';
      tween(1800, 900, (e) => alive() && (bar.style.transform = `scaleX(${(fin * e).toFixed(4)})`));
      slide.querySelectorAll('[data-count]').forEach((n) => { const v = +n.dataset.count; n.textContent = '0'; tween(1800, 900, (e) => alive() && (n.textContent = nf(Math.round(v * e)))); });
    } else if (b === 'nivel') {
      const arc = slide.querySelector('.pr-arc'), pct = +slide.querySelector('.pfb-ring').style.getPropertyValue('--p') || 0;
      if (arc) {
        const put = (v) => { arc.style.strokeDashoffset = (100 - v * 100).toFixed(2); };
        if (reduce) put(pct);
        else { put(0); setTimeout(() => { // depois que o aro termina de montar, o arco dourado desenha até o progresso
          const t0 = performance.now(), D = 1600;
          const step = (now) => { if (!alive()) return; const t = Math.min(1, (now - t0) / D), e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; put(pct * e); if (t < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        }, 1500); }
      }
      slide.querySelectorAll('[data-count]').forEach((n) => {
        const fin = +n.dataset.count, pad = +n.dataset.pad || 0;
        const put = (v) => { n.textContent = pad ? String(Math.round(v)).padStart(pad, '0') : nf(Math.round(v)); };
        if (reduce) return put(fin);
        put(0); tween(1800, 700, (e) => alive() && put(fin * e));
      });
    }
  }
  /* carrossel do topo: os banners trocam com um fade (um some enquanto o outro aparece, só opacidade,
     leve para placas fracas) e as informações do banner que entra surgem junto, toda vez que ele aparece */
  function heroCarousel(view) {
    const box = view.querySelector('.pf-car'), track = box?.querySelector('.pf-track');
    if (!track) return;
    const slides = [...track.querySelectorAll('.pf-slide')], n = slides.length;
    const dotsBox = box.querySelector('.dots'), dots = [...dotsBox.querySelectorAll('.dot')], car = box.querySelector('.pf-hero');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = -1;
    const go = (i) => {
      i = ((i % n) + n) % n;
      if (i === cur) return;
      const prev = slides[cur];
      if (prev) { prev.classList.remove('active'); prev.classList.add('leaving'); setTimeout(() => prev.classList.remove('leaving'), 1200); }
      const sl = slides[i]; cur = i;
      sl.classList.remove('leaving', 'seen'); void sl.offsetWidth; // reinicia as animações das informações
      sl.classList.add('active', 'seen');
      slides.forEach((x, k) => { x.toggleAttribute('inert', k !== i); x.setAttribute('aria-hidden', k !== i); });
      playBanner(sl, reduce);
      dots.forEach((d, k) => { d.classList.remove('active'); if (k === i) { void d.offsetWidth; d.classList.add('active'); } });
    };
    dotsBox.addEventListener('animationend', (e) => { if (e.target.classList.contains('dot-fill') && box.isConnected) go(cur + 1); });
    dotsBox.addEventListener('click', (e) => { const d = e.target.closest('.dot'); if (d) go(+d.dataset.i); });
    car.addEventListener('mouseenter', () => box.classList.add('paused'));
    car.addEventListener('mouseleave', () => box.classList.remove('paused'));
    let x0 = null;
    car.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    car.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); });
    track.querySelectorAll('[data-ranks]').forEach((btn) => btn.addEventListener('click', (e) => { e.stopPropagation(); box.classList.add('paused'); ranksSheet(() => box.classList.remove('paused')); }));
    track.querySelectorAll('[data-editbanner]').forEach((btn) => btn.addEventListener('click', (e) => { e.stopPropagation(); editCard(view, btn.dataset.editbanner); }));
    go(0);
  }

  /* fundo do banner do módulo: a imagem própria do módulo ou, se não houver, a do banner
     da Plataforma de Informática da tela de início (com a versão de celular dele) */
  function heroBg(m) {
    const own = bannerSpan('bmod'); if (own) return own; // imagem própria, trocada pelo lápis do banner
    if (m.banner) return slot(m.banner, '', '');
    const b = [...(typeof banners !== 'undefined' ? banners : []), ...(typeof exclusive !== 'undefined' ? exclusive : [])].find((x) => x.lockInfo && (x.image || x.imageMobile));
    if (!b) return slot('', 'Banner do módulo', '1920 × 1080');
    const pos = b.imageMobile && /^\d{1,3}% \d{1,3}%$/.test(b.focusMobile || '') ? `;--pos-m:${b.focusMobile}` : '';
    return `<span class="pf-hero-img" style="--img:url('${esc(imgUrl(b.image || b.imageMobile))}')${b.imageMobile ? `;--img-m:url('${esc(imgUrl(b.imageMobile))}')` : ''}${pos}"></span>`;
  }

  /* cor de fundo dos cards (degradê embaixo), como nos cards de "Mantenha-se conectado" */
  const TINTS = ['22, 60, 48', '24, 46, 110', '70, 32, 120', '120, 40, 30', '30, 70, 90'];
  /* cor do card das lições prontas, a mesma da capa (curso/capas-teclas.js, que chega depois) */
  const DG_TINT = { 'dg-1': '74, 30, 8', 'dg-2': '22, 52, 120', 'dg-3': '76, 29, 149', 'dg-4': '127, 29, 29', 'dg-5': '6, 78, 59' };
  const HC_NIVEIS = { 1: '30 níveis', 2: '30 níveis' }; // quantos níveis cada lição tem (mostrado antes de começar)

  const MTINTS = ['22, 60, 48', '36, 40, 110', '86, 30, 110', '120, 50, 24', '24, 80, 96'];

  /* módulo expandido: as lições do módulo e o próximo passo */
  /* barrinha de progresso da lição, embaixo do texto (como nas aulas e disciplinas): níveis feitos; no fim, o selo "Concluída" */
  const lprog = (p) => p?.done
    ? `<div class="pf-cprog ok"><span class="pf-cprog-trk"><i style="--p:1"></i></span><b class="pf-aprov">${svg('check')} Concluída</b></div>`
    : `<div class="pf-cprog" role="progressbar" aria-label="Níveis feitos" aria-valuemin="0" aria-valuemax="${p?.total || 0}" aria-valuenow="${p?.lvl || 0}"><span class="pf-cprog-trk"><i style="--p:${p ? p.lvl / p.total : 0}"></i></span><b>${p ? `${p.lvl}/${p.total}` : '0%'}</b></div>`;
  function modBody(mi) {
    const m = HC_CURSO.modulos[mi]; if (!m) return '';
    const first = HC_CURSO.modulos.slice(0, mi).reduce((a, x) => a + x.licoes.length, 0); // nº da 1ª lição do módulo - 1
    const nextM = HC_CURSO.modulos[mi + 1];
    const pages = []; for (let k = 0; k < m.licoes.length; k += PER_PAGE) pages.push(m.licoes.slice(k, k + PER_PAGE));
    /* cabeçalho do módulo: o que é (prática de digitação), as teclas que entram em cada lição, o progresso e como funciona */
    const nums = m.licoes.map((_, i) => first + i + 1), feitas = nums.filter((n) => progress(n)?.done).length;
    const grupos = m.licoes.map((l, i) => ({ l, n: nums[i] })).filter((g) => g.l.teclas);
    const kbd = (k) => `<kbd${k.length > 1 ? ' class="w"' : ''}>${esc(k)}</kbd>`;
    const passos = [
      ['hand', 'Dedos na posição', 'Indicadores no F e no J, polegares no Espaço.'],
      ['type', 'Digite o que aparecer', 'Níveis curtos, do mais fácil ao mais difícil.'],
      ['star', 'Ganhe estrelas e XP', 'Quanto mais preciso, mais estrelas você leva.'],
    ];
    const PI = {
      hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0V12"/><path d="M14 10.5a1.5 1.5 0 0 1 3 0V12"/><path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L4.3 15a1.6 1.6 0 0 1 2.6-1.9L8 14.5"/>',
      type: '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
      star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    };
    return `
      <section>
        <header class="pf-mh">
          <div class="pf-mh-main">
            <span class="pf-mh-eyebrow">${svg('keys')}<span>Prática de digitação</span><i></i><span>Módulo ${mi + 1}</span>${m.nivel ? `<i class="pf-mh-lv"></i><span class="pf-mh-lv">${esc(m.nivel)}</span>` : ''}</span>
            <h2 class="pf-mh-title"><span class="ap-grad">${esc(m.secao || m.nome + '.')}</span> ${m.secaoComplemento ? `<span class="pf-mh-sub">${esc(m.secaoComplemento)}</span>` : ''}</h2>
            ${m.texto ? `<p class="pf-mh-text">${esc(m.texto)}</p>` : ''}
            <ol class="pf-mh-steps" aria-label="Como funciona">${passos.map(([ic, t, d], i) => `
              <li><span class="pf-mh-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PI[ic]}</svg><b>${i + 1}</b></span><span><strong>${t}</strong><small>${d}</small></span></li>`).join('')}
            </ol>
          </div>
          <aside class="pf-mh-panel" aria-label="Resumo do módulo">
            <span class="pf-mh-label">Teclas que você vai praticar</span>
            ${grupos.length ? `<ol class="pf-mh-keys">${grupos.map((g) => `
              <li class="${progress(g.n)?.done ? 'ok' : ''}"><span class="pf-mh-kk">${g.l.teclas.split(' ').map(kbd).join('')}</span><small>Lição ${String(g.n).padStart(2, '0')}${progress(g.n)?.done ? ' ✓' : ''}</small></li>`).join('')}
            </ol>` : ''}
            <div class="pf-mh-prog">
              <div class="pf-mh-prog-top"><strong>${feitas} de ${m.licoes.length}</strong><span>lições concluídas</span></div>
              <div class="pf-mh-bar"><i style="--w:${m.licoes.length ? feitas / m.licoes.length : 0}"></i></div>
            </div>
            <div class="pf-mh-stats">
              <span><b>${m.licoes.length}</b>lições</span>
              <span><b>${m.totalNiveis}</b>níveis</span>
              <span><b>${svg('keys')}</b>no computador</span>
            </div>
          </aside>
        </header>
        ${window.HC_isComputer() ? '' : `<div class="pf-pc-note"><span>${svg('keys')}</span><p><b>As lições são feitas no computador.</b> Por aqui você acompanha o seu progresso; para praticar, use os computadores da instituição nos dias de aula.</p></div>`}
        <div class="pf-lhead">
          <h3>Lições do módulo <span>${m.licoes.length}</span></h3>
          ${pages.length ? `<div class="ap-paddles pf-lpaddles">
            <button class="ap-paddle" type="button" data-ldir="-1" aria-label="Lições anteriores" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
            <button class="ap-paddle" type="button" data-ldir="1" aria-label="Próximas lições"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>` : ''}
        </div>
        <div class="pf-lpages" id="pf-lpages">${pages.map((pg, pi) => `
        <ol class="pf-lessons" aria-label="Lições ${pi * PER_PAGE + 1} a ${pi * PER_PAGE + pg.length}">
          ${pg.map((l, k) => {
            const i = pi * PER_PAGE + k;
            const n = first + i + 1, p = progress(n), num = String(n).padStart(2, '0');
            const state = !l.arquivo ? 'Em breve' : p?.done ? 'Concluída' : p ? `Nível ${Math.min(p.lvl + 1, p.total)} de ${p.total}` : `${HC_NIVEIS[n] || ''}`;
            const go = !l.arquivo ? 'Em breve' : !window.HC_isComputer() ? 'Ver' : p?.done ? 'Refazer' : p && p.lvl > 0 ? 'Continuar' : 'Acessar';
            return `
          <li class="pf-lesson${l.arquivo ? '' : ' soon'}" style="--i:${k};--tint:${l.arquivo ? (DG_TINT[l.capa] || DG_TINT['dg-1']) : TINTS[i % TINTS.length]}" data-lesson="${n}" tabindex="0" aria-label="Lição ${num}: ${esc(l.titulo)}">
            ${l.arquivo ? `<div class="pf-lesson-img pf-lcover" data-cover="${esc(l.arquivo)}" data-n="${n}" data-capa="${esc(l.capa || 'dg-1')}" aria-hidden="true"></div>` : l.capa ? `<div class="pf-lesson-img pf-dgcover" data-capa="${esc(l.capa)}" aria-hidden="true"></div>` : `<div class="pf-lesson-img">${slot(l.imagem, 'Imagem da lição', '1000 × 1000', i)}</div>`}
            <div class="pf-lesson-app">
              <div class="pf-lesson-text">
                <span class="pf-lesson-tag">${esc(l.tag)}</span>
                <h3>${esc(l.titulo)}</h3>
                ${l.desc ? `<p>${esc(l.desc)}</p>` : ''}
                ${l.arquivo ? lprog(p) : ''}
              </div>
              <div class="pf-lesson-bar">
                <span class="pf-lesson-av">${num}</span>
                <span class="pf-lesson-who"><strong>Lição ${num}</strong><small>${esc(state)}</small></span>
                ${l.arquivo ? cardStars(p) : ''}
                <span class="pf-lesson-go">${go}</span>
              </div>
            </div>
            ${isAdmin() ? `<div class="pf-adm"><button class="pf-adm-btn" type="button" data-editlesson="${l.extra ? 'x:' + esc(l.id) : `l${mi}-${i}`}" aria-label="Editar a capa da lição" title="Editar capa">${svg('pen')}</button>${l.extra ? `<button class="pf-adm-btn pf-lesson-del" type="button" data-dellesson="${esc(l.id)}" aria-label="Apagar este card" title="Apagar card">×</button>` : ''}</div>` : ''}
          </li>`;
          }).join('')}
        </ol>`).join('')}</div>
      </section>
      <section style="--n:${pages[0]?.length || 0}">
        <div class="pf-step-head">
          <h2 class="shelf-title"><span class="ap-grad">Próximo passo.</span><span> Terminou as lições? Siga para o próximo módulo.</span></h2>
          ${isAdmin() ? `<button class="pf-add-lesson" type="button" data-addlesson="${mi}" title="Só administradores veem este botão"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Nova lição</button>` : ''}
        </div>
        <div class="pf-next-card">
          <div class="pf-next-text">
            <small>${nextM ? esc(nextM.nivel) : 'Em breve'}</small>
            <strong>Módulo ${mi + 2}${nextM ? ` · ${esc(nextM.nome)}` : ''}</strong>
            <div class="pf-next-actions">
              <button class="btn-dark inf-shine" type="button" data-gomod="${mi + 1}">Continuar para o módulo ${mi + 2} ${svg('next')}</button>
            </div>
          </div>
          <div class="pf-mascot">${slot(HC_CURSO.mascote, 'Mascote', 'PNG sem fundo', 2)}</div>
        </div>
      </section>`;
  }

  /* "SEU CURSO": resumo rápido do aluno. O estágio (Iniciante → Intermediário → Especialista → Avançado) vem do
     quanto ele já fez de TUDO o que existe na plataforma hoje: lições de digitação e aulas/avaliações das disciplinas.
     Lição concluída conta 1 (começada conta o quanto andou); aula aprovada conta 1 (tentada, 0,4). Com conteúdo novo
     entrando na plataforma, a porcentagem se ajusta sozinha. XP e Saldo HC ficam só nos banners. */
  const STAGES = [
    { nome: 'Iniciante', ico: 'seed', de: 0, cor: '#34d399', cor2: '#059669' },
    { nome: 'Intermediário', ico: 'rocket', de: 25, cor: '#60a5fa', cor2: '#2563eb' },
    { nome: 'Especialista', ico: 'medal', de: 50, cor: '#c084fc', cor2: '#7c3aed' },
    { nome: 'Avançado', ico: 'crown', de: 75, cor: '#fbbf24', cor2: '#ea580c' },
  ];
  function journeyData() {
    const lessons = HC_CURSO.modulos.flatMap((m) => m.licoes).map((l, i) => ({ l, n: i + 1 })).filter((x) => x.l.arquivo);
    const aulas = visDiscs().flatMap((d) => conts().filter((c) => c.disc === d.id && c.arquivo && (c.visivel || isAdmin())).sort((a, b) => a.ordem - b.ordem));
    let soma = 0, licFeitas = 0, aulasFeitas = 0;
    lessons.forEach(({ n }) => { const p = progress(n); if (p?.done) { soma += 1; licFeitas++; } else if (p?.lvl) soma += Math.min(.9, p.lvl / 30); });
    aulas.forEach((c) => { if (contDone(c.id)) { soma += 1; aulasFeitas++; } else if ((contProg(c.id)?.hist || []).length) soma += .4; });
    const total = lessons.length + aulas.length, pct = total ? Math.round((soma / total) * 100) : 0;
    const k = STAGES.reduce((a, st, i) => (pct >= st.de ? i : a), 0), nx = STAGES[k + 1];
    // próximo passo: no computador, a próxima lição de digitação; senão (ou se já fez todas), a próxima aula liberada
    const nextLic = window.HC_isComputer() ? lessons.find(({ n }) => !progress(n)?.done) : null;
    const nextAula = aulas.find((c) => !contDone(c.id) && !(c.seq && discLockOf(discs().find((d) => d.id === c.disc))) && !(c.seq && (() => { const p = conts().filter((x) => x.disc === c.disc && x.seq && x.ordem < c.ordem).sort((a, b) => b.ordem - a.ordem)[0]; return p && !contDone(p.id); })()));
    const passo = nextLic ? { href: `#informatica/licao-${nextLic.n}`, ico: 'kbd', txt: `Lição ${String(nextLic.n).padStart(2, '0')}`, sub: nextLic.l.titulo, tag: progress(nextLic.n)?.lvl ? 'Continuar' : 'Começar' }
      : nextAula ? { href: `#informatica/conteudo-${nextAula.id}`, ico: nextAula.tipo === 'prova' ? 'prova' : 'texto', txt: nextAula.rotulo?.split(' · ')[0] || 'Próxima aula', sub: nextAula.titulo, tag: contProg(nextAula.id)?.savedAt ? 'Continuar' : 'Começar' }
      : null;
    return { pct, k, st: STAGES[k], nx, faltam: nx ? Math.max(1, nx.de - pct) : 0, lic: { f: licFeitas, t: lessons.length }, aulas: { f: aulasFeitas, t: aulas.length }, passo };
  }
  /* card "Seu estágio" (também aparece na tela de progresso, curso/progresso.js) */
  function stageCardHTML(j) {
    const track = STAGES.map((st, i) => `<li class="${i < j.k ? 'done' : i === j.k ? 'cur' : ''}" style="--c:${st.cor};--c2:${st.cor2}"><span class="pf-jr-dot">${svg(i < j.k ? 'check' : st.ico)}</span><b>${st.nome}</b><small>${st.de}%</small></li>`).join('');
    return `
            <div class="pf-jr" style="--c:${j.st.cor};--c2:${j.st.cor2};--x:${(12.5 + (Math.min(j.pct, 75) / 75) * 75).toFixed(1)}%">
              <div class="pf-jr-head">
                <span class="pf-jr-badge">${svg(j.st.ico)}</span>
                <div class="pf-jr-t"><small>Seu estágio</small><strong>${j.st.nome}</strong></div>
                <div class="pf-jr-pct"><b>${j.pct}<small>%</small></b><small>do conteúdo da plataforma</small></div>
              </div>
              <ol class="pf-jr-track">${track}<i class="pf-jr-fill" aria-hidden="true"></i></ol>
              <p class="pf-jr-msg">${j.nx ? `Faltam <b>${j.faltam}%</b> para chegar a <b>${j.nx.nome}</b>. Conclua lições e passe nas aulas para avançar.` : 'Você chegou ao estágio mais alto. Continue praticando para manter o ritmo!'}</p>
            </div>`;
  }
  /* celular: a tela de seleção (progresso · curso · loja) é só do computador, então o card do estágio
     vira uma fileira deslizável (um card por vez, bolinhas embaixo) com mais dois cards no mesmo estilo, que levam ao progresso e à loja.
     No computador esses dois ficam escondidos e o card do estágio continua sozinho. */
  function extraCardsHTML(j) {
    const x = window.HC_xp.get(), rk = window.HC_xp.rankOf(x.xp), L = window.HC_loja;
    const meus = L ? L.get().itens.length : 0, tot = L ? L.ALL.length : 0;
    const card = (href, c, c2, ico, small, strong, msg, stats, go) => `
            <a class="pf-jr pf-jr-x" href="${href}" style="--c:${c};--c2:${c2}">
              <div class="pf-jr-head">
                <span class="pf-jr-badge">${svg(ico)}</span>
                <div class="pf-jr-t"><small>${small}</small><strong>${strong}</strong></div>
              </div>
              <p class="pf-jx-msg">${msg}</p>
              <div class="pf-jx-stats">${stats.map(([v, l]) => `<span><b>${v}</b><small>${l}</small></span>`).join('')}</div>
              <span class="pf-jx-go">${go} ${svg('next')}</span>
            </a>`;
    return card('#informatica/progresso', '#fbbf24', '#ea580c', 'chart', 'Seu progresso', `Nível ${String(x.nivel).padStart(2, '0')}`,
      `Faltam <b>${x.falta.toLocaleString('pt-BR')} XP</b> para o nível ${String(x.nivel + 1).padStart(2, '0')}`,
      [[Math.round(x.xp).toLocaleString('pt-BR'), 'XP'], [esc(rk.nome), 'patente'], [`${j.aulas.f}/${j.aulas.t}`, 'aulas aprovadas']], 'Ver progresso')
      + card('#informatica/loja', '#38bdf8', '#2563eb', 'bag', 'Loja de itens', 'Personalize',
      'Troque suas moedas por personagens, avatares e efeitos',
      [[window.HC_cashFmt(window.HC_cash.get().saldo), 'Saldo HC'], [`${meus}/${tot}`, 'itens seus'], [L ? `${Object.values(L.get().eq).filter(Boolean).length}/${Object.keys(L.get().eq).length}` : '0', 'equipados']], 'Abrir a loja');
  }
  // bolinhas do card deslizável: acompanham a rolagem e levam ao card tocado
  document.addEventListener('scroll', (e) => {
    const r = e.target; if (!r.classList?.contains('pf-jr-rail')) return;
    const w = r.firstElementChild.offsetWidth + parseFloat(getComputedStyle(r).columnGap || 0), i = Math.round(r.scrollLeft / w);
    r.nextElementSibling?.querySelectorAll('button').forEach((d, k) => d.classList.toggle('on', k === i));
  }, { capture: true, passive: true });
  document.addEventListener('click', (e) => {
    const d = e.target.closest?.('[data-jr]'); if (!d) return;
    const r = d.parentElement.previousElementSibling, w = r.firstElementChild.offsetWidth + parseFloat(getComputedStyle(r).columnGap || 0);
    r.scrollTo({ left: w * +d.dataset.jr, behavior: 'smooth' });
  });
  function journeyHTML() {
    const j = journeyData(), m = HC_CURSO.modulos[mod];
    const quick = [
      ['stack', 'Módulo atual', `${mod + 1} de ${HC_CURSO.modulos.length}`, m.titulo, '#2563eb', '#38bdf8'],
      ['kbd', 'Lições de digitação', `${j.lic.f} de ${j.lic.t}`, j.lic.t ? `${Math.round((j.lic.f / j.lic.t) * 100)}% concluídas` : 'Em breve', '#7c3aed', '#a78bfa'],
      ['texto', 'Aulas aprovadas', `${j.aulas.f} de ${j.aulas.t}`, j.aulas.t ? 'com nota 7 ou mais' : 'Em breve', '#059669', '#34d399'],
    ];
    return `
            <div class="pf-jr-slider">
              <div class="pf-jr-rail">${stageCardHTML(j)}${extraCardsHTML(j)}</div>
              <div class="pf-jr-dots" aria-hidden="true">${[0, 1, 2].map((i) => `<button type="button" tabindex="-1" class="${i ? '' : 'on'}" data-jr="${i}"></button>`).join('')}</div>
            </div>
            <div class="pf-qs">
              ${quick.map(([ico, label, val, sub, c1, c2]) => `
              <div class="pf-q" style="--c1:${c1};--c2:${c2}">
                <span class="pf-q-ico">${svg(ico)}</span>
                <span class="pf-q-txt"><small>${label}</small><strong>${esc(val)}</strong><em>${esc(sub)}</em></span>
              </div>`).join('')}
              ${j.passo ? `<a class="pf-q pf-q-go" href="${j.passo.href}" style="--c1:#ea580c;--c2:#fbbf24">
                <span class="pf-q-ico">${svg(j.passo.ico)}</span>
                <span class="pf-q-txt"><small>Próximo passo</small><strong>${esc(j.passo.txt)}</strong><em>${esc(j.passo.sub)}</em></span>
                <span class="pf-q-btn">${j.passo.tag} ${svg('next')}</span>
              </a>` : `<div class="pf-q" style="--c1:#ea580c;--c2:#fbbf24"><span class="pf-q-ico">${svg('flag')}</span><span class="pf-q-txt"><small>Próximo passo</small><strong>Tudo em dia</strong><em>Novos conteúdos aparecem aqui</em></span></div>`}
            </div>`;
  }
  /* palco do topo: decide a altura da imagem (--ih) e onde começam os cards (--sp).
     A imagem tem a proporção do banner (16:9 no computador, 9:16 no celular) e só cresce além disso
     quando o texto do banner e os cards não cabem. Os cards dos módulos ficam metade sobre a imagem
     e metade sobre o fundo do site. Recalcula só quando o tamanho muda (nada fica animando). */
  let stageRO = null, stageFit = null;
  function fitStage(view, after) {
    const stage = view.querySelector('.pf-stage'); if (!stage) return;
    const shelf = stage.querySelector('.pf-shelf'), spacer = stage.querySelector('.pf-spacer');
    let last = '';
    const fit = () => {
      if (!stage.isConnected) { stageRO?.disconnect(); removeEventListener('resize', fit); return; }
      const W = stage.clientWidth, mob = innerWidth <= 860, cs = getComputedStyle(stage);
      const top0 = parseFloat(cs.paddingTop) || 0, dotsH = mob ? 44 : 60; // o palco sobe por trás da barra de cima e devolve essa altura no padding
      const th = Math.max(0, ...[...stage.querySelectorAll('.pf-slide:not(.clone) .pf-hero-text, .pf-slide:not(.clone) .pfb-body')].map((e) => e.offsetHeight));
      const card = stage.querySelector('.pf-modcard'), row = stage.querySelector('.pf-mod-row');
      const hang = card ? card.offsetHeight * .55 + parseFloat(getComputedStyle(row).paddingBottom || 0) : 0; // parte dos cards que fica fora da imagem
      const onImg = shelf.offsetHeight - hang;
      const imgh = Math.round(W * (mob ? 16 / 9 : 9 / 16)); // a imagem fica sempre nessa proporção, sem cortar as laterais
      /* computador: a fileira de módulos começa perto do pé da janela (só a pontinha aparece) e o texto do banner
         desce junto, longe da barra de cima; no celular fica como estava */
      let fold = 0;
      if (!mob && row) {
        const rowTop = row.getBoundingClientRect().top - shelf.getBoundingClientRect().top;
        const stageTop = stage.getBoundingClientRect().top + scrollY;
        fold = Math.round(innerHeight - 130 - rowTop - stageTop + onImg);
      }
      const ih = Math.max(imgh, Math.round(top0 + 12 + th + dotsH + onImg), fold);
      const key = `${ih}|${ih - onImg}|${th}|${imgh}`; if (key === last) return; last = key;
      // quando o conteúdo pede mais altura que a imagem, ela termina num degradê escuro que segue até os cards
      stage.style.setProperty('--imgh', `${imgh}px`);
      stage.classList.toggle('tall', ih > imgh + 8);
      stage.style.setProperty('--ih', `${ih}px`);
      stage.style.setProperty('--sp', `${Math.round(ih - onImg)}px`);
      stage.style.setProperty('--th', `${th}px`);
      spacer.style.height = `${Math.round(ih - onImg - top0)}px`;
      after?.();
    };
    stageRO?.disconnect();
    stageRO = new ResizeObserver(() => fit());
    stageRO.observe(shelf);
    stage.querySelectorAll('.pf-slide:not(.clone) .pf-hero-text, .pf-slide:not(.clone) .pfb-body').forEach((e) => stageRO.observe(e));
    if (stageFit) removeEventListener('resize', stageFit);
    stageFit = fit; addEventListener('resize', fit, { passive: true });
    fit();
  }

  function render(view, sub = '') {
    const ln = /^licao-(\d+)$/.exec(sub), cn = /^conteudo-([\w-]+)$/.exec(sub), dn = /^disciplina-([\w-]+)$/.exec(sub);
    mergeExtras();
    if (ln) return openLesson(view, +ln[1]);
    if (cn) return openContPage(view, cn[1]);
    if (dn) return discPage(view, dn[1]);
    const m = HC_CURSO.modulos[mod];
    const first = HC_CURSO.modulos.slice(0, mod).reduce((a, x) => a + x.licoes.length, 0); // nº da 1ª lição do módulo - 1
    const nextM = HC_CURSO.modulos[mod + 1];
    const n = m.licoes.length;
    // topo no estilo dos apps de streaming: a imagem do banner ocupa a largura toda (passa por trás da barra de cima),
    // com as informações do banner por cima e, na parte de baixo da imagem, "Seu curso" e os módulos.
    // A imagem rola junto com a página; abaixo dela o fundo é o do site.
    view.innerHTML = `
    <div class="pf-car pf-stage">
      <section class="pf-hero" aria-roledescription="carrossel">
        <div class="carousel-track pf-track">
          <div class="pf-slide" data-b="mod" aria-roledescription="slide" aria-label="1 de 4">
            <div class="pf-hero-bg">${heroBg(m)}</div>
            ${admPen('bmod')}
            <div class="pf-hero-text">
              <img class="pf-hero-logo" src="assets/plataforma-informatica.webp" width="900" height="184" alt="Plataforma de Informática" />
              <span class="pill">${esc(m.nivel)} · Módulo ${mod + 1}</span>
              <h2>${esc(m.titulo)}</h2>
              <p>${esc(m.subtitulo)}</p>
              <button class="slide-cta" type="button" data-lesson="${first + 1}">${window.HC_isComputer() ? `Começar a lição ${String(first + 1).padStart(2, '0')}` : 'Ver meu progresso'} ${svg('next')}</button>
            </div>
          </div>
          ${cashBanner()}
          ${levelBanner()}
          ${rankBanner()}
        </div>
      </section>
      <div class="pf-stage-in">
        <div class="pf-spacer"><div class="dots">${[0, 1, 2, 3].map((i) => `<button class="dot" data-i="${i}" style="--slide-ms:${PF_SLIDE_MS}ms" aria-label="Banner ${i + 1}"><span class="dot-fill"></span></button>`).join('')}</div></div>
        <div class="pf-shelf">
          <section class="pf-course" aria-label="Seu curso">
            <h2 class="pf-st-title">Seu curso <span>Um resumo rápido de onde você está</span></h2>
            <div class="pf-course-grid pf-jr-grid">${journeyHTML()}</div>
          </section>
          <section class="pf-mods" aria-label="Módulos">
            <div class="pf-mods-head">
              <h2 class="pf-st-title">Módulos <span>Escolha um módulo para ver as lições</span></h2>
              <div class="ap-paddles pf-mod-paddles">
                <button class="ap-paddle" data-mdir="-1" aria-label="Módulos anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
                <button class="ap-paddle" data-mdir="1" aria-label="Próximos módulos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
              </div>
            </div>
            <div class="pf-mod-row" id="pf-mod-row">
              ${HC_CURSO.modulos.map((mm, i) => {
                const ok = canOpen(mm), num = String(i + 1).padStart(2, '0');
                return `
              <article class="pf-lesson pf-modcard${ok ? '' : ' soon'}${openMod === i ? ' open' : ''}" style="--i:${i};--tint:${MTINTS[i % MTINTS.length]}" data-modcard="${i}" tabindex="0" role="button" aria-expanded="${openMod === i}" aria-label="Módulo ${i + 1}: ${esc(mm.nome)}">
                <div class="pf-lesson-img">${slot(mm.imagem, 'Imagem do módulo', '1000 × 1250', i + 2)}</div>
                <div class="pf-lesson-app">
                  <div class="pf-lesson-text">
                    <span class="pf-lesson-tag">Módulo ${i + 1} · ${esc(mm.nivel.replace(/^Nível\s+/i, ''))}</span>
                    <h3>${esc(mm.nome)}</h3>
                    <p>${esc(mm.desc)}</p>
                  </div>
                  <div class="pf-lesson-bar">
                    <span class="pf-lesson-av">${num}</span>
                    <span class="pf-lesson-who"><strong>${mm.totalNiveis} níveis</strong><small>${ok ? `${mm.licoes.length} lições` : 'Em breve'}</small></span>
                    <span class="pf-lesson-go">${!ok ? 'Em breve' : openMod === i ? 'Fechar' : 'Abrir'}</span>
                  </div>
                </div>
                ${isAdmin() ? `<div class="pf-adm"><button class="pf-adm-btn" type="button" data-editmod="${i}" aria-label="Editar o módulo ${i + 1}" title="Editar módulo">${svg('pen')}</button></div>` : ''}
              </article>`;
              }).join('')}
            </div>
          </section>
        </div>
      </div>
    </div>
    <div class="wrap pf">
      <div class="pf-mod-open${openMod !== null ? ' show' : ''}" id="pf-mod-open"><div class="pf-mod-inner" id="pf-mod-inner">${openMod !== null ? modBody(openMod) : ''}</div></div>
      ${contsSection()}
    </div>`;

    bindLessons(view, view);
    bindConts(view);
    heroCarousel(view);
    view.querySelector('.slide-cta[data-lesson]')?.addEventListener('click', (e) => openN(+e.currentTarget.dataset.lesson));

    /* cards dos módulos: abrir/fechar revela as lições logo abaixo, com animação */
    const row = view.querySelector('#pf-mod-row');
    view.querySelectorAll('[data-modcard]').forEach((c) => {
      const act = () => toggleMod(view, +c.dataset.modcard);
      c.addEventListener('click', act);
      c.addEventListener('keydown', (e) => { if (e.target !== c) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    });
    view.querySelectorAll('[data-editmod]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); editCard(view, 'm' + b.dataset.editmod); }));
    view.querySelectorAll('[data-mdir]').forEach((b) => b.addEventListener('click', () => row.scrollBy({ left: +b.dataset.mdir * row.clientWidth * .8, behavior: 'smooth' })));
    const paddles = () => { const [p, n] = view.querySelectorAll('[data-mdir]'); if (!p) return; p.disabled = row.scrollLeft < 4; n.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4; p.parentNode.classList.toggle('none', p.disabled && n.disabled); };
    row.addEventListener('scroll', paddles, { passive: true }); paddles(); rowDots(row);
    view.querySelector('.pf-mods').classList.toggle('has-open', openMod !== null);
    fitStage(view, paddles);
  }

  const openN = (n) => {
    const l = lessonAt(n);
    if (!l?.arquivo) return toast('Esta lição será montada em breve.');
    const go = () => { location.hash = `#informatica/licao-${n}`; };
    if (intro || !window.HC_isComputer() || matchMedia('(prefers-reduced-motion: reduce)').matches) return go();
    introStart(n, l);
    // já vai baixando a lição enquanto a animação roda
    Promise.all([load('curso/licao.css'), load('curso/teclado.js'), load('curso/licao.js'), load(l.arquivo)]).catch(() => {});
    setTimeout(go, INTRO_PEAK);
  };
  /* capa das lições prontas (a mesma do acervo do professor): as teclas da lição e uma barrinha por nível.
     As barrinhas dos níveis que o aluno já fez ficam acesas; a do nível atual pulsa.
     Os dados da lição (arquivo pequeno) são baixados só para desenhar a capa. */
  function lessonCovers(root) {
    /* capas ilustradas das lições de digitação (curso/capas-teclas.js): valem por cima da foto enviada pelo lápis */
    Promise.all([load('curso/capas.css'), load('curso/capas-teclas.js')]).then(() => {
      root.querySelectorAll('.pf-dgcover[data-capa]').forEach((box) => {
        const id = box.dataset.capa; if (!window.HC_CAPAS_DG?.[id]) return;
        box.innerHTML = HC_CAPAS_DG[id];
        const t = window.HC_CAPAS_DG_TINT?.[id]; if (t) box.closest('.pf-lesson')?.style.setProperty('--tint', t);
      });
      root.querySelectorAll('.pf-lcover[data-cover]').forEach((box) => { if (!box.querySelector('.cvb')) box.insertAdjacentHTML('afterbegin', HC_CAPAS_DG_FUNDO(box.dataset.capa)); });
    }).catch(() => {});
    root.querySelectorAll('.pf-lcover[data-cover]').forEach((box) => {
      const n = +box.dataset.n;
      load(box.dataset.cover).then(() => {
        const L = window.HC_LICOES?.[`licao-${n}`]; if (!L || !box.isConnected) return;
        const p = progress(n), done = p?.done ? L.niveis.length : p?.lvl || 0;
        box.innerHTML = (window.HC_CAPAS_DG_FUNDO?.(box.dataset.capa) || '') + `<div class="pf-lc"><div class="pf-lc-keys">${(L.novas || L.teclas).map((k, i) => `<kbd style="--i:${i}">${k === ' ' ? 'Espaço' : esc(k.toUpperCase())}</kbd>`).join('')}</div>
          <div class="pf-lc-segs${done ? ' has' : ''}">${L.niveis.map((lv, i) => `<i class="${lv.tipo === 'typing' ? 'd' : 'm'}${i < done ? ' on' : ''}${p && !p.done && i === done ? ' cur' : ''}" style="--i:${i}"></i>`).join('')}</div></div>`;
      }).catch(() => {});
    });
  }
  function bindLessons(view, root) {
    lessonCovers(root);
    root.querySelectorAll('.pf-lesson[data-lesson]').forEach((b) => {
      b.addEventListener('click', () => openN(+b.dataset.lesson));
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openN(+b.dataset.lesson); } });
    });
    const pagesEl = root.querySelector('#pf-lpages > .pf-lessons'); // a fileira de lições (passa para o lado)
    if (pagesEl) {
      const pads = root.querySelectorAll('[data-ldir]');
      /* setas só aparecem quando as lições não cabem na fileira */
      const upd = () => { if (!pads.length || !pagesEl.isConnected) return; pads[0].disabled = pagesEl.scrollLeft < 4; pads[1].disabled = pagesEl.scrollLeft + pagesEl.clientWidth >= pagesEl.scrollWidth - 4; pads[0].parentNode.classList.toggle('none', pads[0].disabled && pads[1].disabled); };
      pads.forEach((b) => b.addEventListener('click', () => pagesEl.scrollBy({ left: +b.dataset.ldir * pagesEl.clientWidth * .8, behavior: 'smooth' })));
      pagesEl.addEventListener('scroll', upd, { passive: true });
      if (lessonsResize) removeEventListener('resize', lessonsResize);
      lessonsResize = upd; addEventListener('resize', upd, { passive: true }); upd(); setTimeout(upd, 1200);
      rowDots(pagesEl); // celular: barrinhas embaixo, como nas disciplinas
    }
    root.querySelectorAll('[data-addlesson]').forEach((b) => b.addEventListener('click', () => addLesson(view, +b.dataset.addlesson)));
    root.querySelectorAll('[data-editlesson]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); editCard(view, b.dataset.editlesson); }));
    root.querySelectorAll('[data-dellesson]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); delLesson(view, b.dataset.dellesson); }));
    root.querySelectorAll('[data-gomod]').forEach((b) => b.addEventListener('click', () => {
      const i = +b.dataset.gomod;
      if (!HC_CURSO.modulos[i] || !canOpen(HC_CURSO.modulos[i])) return toast(`O módulo ${i + 1} será liberado em breve.`);
      toggleMod(view, i); view.querySelector(`[data-modcard="${i}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }));
  }

  /* administrador: cria um card de lição provisório no fim do módulo (configurado depois no código) */
  function refillMod(view, mi, toEnd) {
    const inner = view.querySelector('#pf-mod-inner'); if (!inner || openMod !== mi) return;
    mergeExtras();
    const keep = view.querySelector('#pf-lpages')?.scrollLeft || 0;
    inner.classList.remove('enter'); inner.innerHTML = modBody(mi); bindLessons(view, inner);
    const pg = inner.querySelector('#pf-lpages');
    if (pg) { pg.scrollLeft = keep; if (toEnd) requestAnimationFrame(() => pg.scrollTo({ left: pg.scrollWidth, behavior: 'smooth' })); }
    const card = view.querySelector(`[data-modcard="${mi}"] .pf-lesson-who small`); if (card) card.textContent = `${HC_CURSO.modulos[mi].licoes.length} lições`;
  }
  function addLesson(view, mi) {
    if (!isAdmin() || typeof saveCursoExtra !== 'function') return;
    const first = HC_CURSO.modulos.slice(0, mi).reduce((a, x) => a + x.licoes.length, 0);
    const num = String(first + HC_CURSO.modulos[mi].licoes.length + 1).padStart(2, '0');
    cursoExtra = [...extras(), { id: 'l' + Date.now().toString(36), mod: mi, tag: 'Nova lição', titulo: `Lição ${num}`, desc: 'Card criado pelo administrador. O conteúdo desta lição ainda será configurado.', imagem: '' }];
    saveCursoExtra(); refillMod(view, mi, true);
    toast('Card da nova lição criado. Agora é só configurar o conteúdo.');
  }
  /* administrador: janela para trocar a foto de capa e os textos de um módulo ('m0') ou lição ('l0-2' ou 'x:<id>') */
  function editCard(view, target) {
    if (!isAdmin() || document.querySelector('.lk')) return;
    const isMod = target[0] === 'm', isBanner = target in PF_BANNERS;
    let cur, title, fields, size, ratio;
    if (isBanner) {
      const e = edits().find((x) => x.id === target) || {};
      cur = { imagem: e.image || '', imagemM: e.imageMobile || '' }; title = PF_BANNERS[target]; fields = [];
    } else if (isMod) {
      const mi = +target.slice(1); cur = HC_CURSO.modulos[mi]; title = `Módulo ${mi + 1}`; size = '1000 × 1250'; ratio = '4 / 5';
      fields = [['nome', 'Nome do módulo'], ['nivel', 'Nível (ex.: Nível iniciante)'], ['desc', 'Descrição no card', 1], ['secao', 'Título ao abrir (ex.: Primeiro comando.)'], ['secaoComplemento', 'Complemento do título'], ['texto', 'Texto de apresentação', 1]];
    } else {
      if (target.startsWith('x:')) { const x = extras().find((e) => e.id === target.slice(2)); if (!x) return; cur = { ...x, imagem: x.image ?? x.imagem ?? '' }; }
      else { const [, mi, k] = /^l(\d+)-(\d+)$/.exec(target) || []; cur = HC_CURSO.modulos[+mi]?.licoes[+k]; }
      if (!cur) return;
      title = cur.titulo || 'Lição'; size = '1000 × 1000'; ratio = '1 / 1';
      fields = [['tag', 'Etiqueta (ex.: Introdução)'], ['titulo', 'Título da lição'], ['desc', 'Descrição', 1]];
    }
    // banners: uma imagem para o computador (16:9) e outra para o celular (9:16); os outros cards têm uma só
    const covers = isBanner
      ? [['image', 'imagem', 'Computador', '1920 × 1080 px · área segura: metade direita, de 110 a 600 de altura', '16 / 9'], ['imageMobile', 'imagemM', 'Celular', '1080 × 1920 px · área segura: centro, de 250 a 600 de altura', '9 / 16']]
      : [['image', 'imagem', '', size, ratio]];
    const imgs = {}; // undefined = sem troca; '' = remover; 'idb:…' = nova foto
    const wrap = document.createElement('div');
    wrap.className = 'lk au';
    wrap.innerHTML = `<div class="lk-backdrop"></div>
      <form class="lk-card au-card pf-ed" role="dialog" aria-modal="true" aria-labelledby="ed-t" novalidate>
        <h2 id="ed-t">Editar ${isBanner ? 'banner' : isMod ? 'módulo' : 'lição'}</h2>
        <p class="lk-sub">${esc(title)} · as mudanças aparecem para todos os alunos.</p>
        <div class="pf-ed-covers${isBanner ? ' two' : ''}">${covers.map(([k, , label, sz, r]) => `
          <div class="pf-ed-one" data-k="${k}">
            ${label ? `<b class="pf-ed-lbl">${label}</b>` : ''}
            <div class="pf-ed-cover" style="aspect-ratio:${r}"><div class="pf-ed-prev"></div>
              <div class="pf-ed-acts"><button type="button" class="pf-ed-btn" data-ed="pick">${svg('photo')}${isBanner ? 'Trocar' : 'Trocar foto'}</button><button type="button" class="pf-ed-btn" data-ed="clear">Remover</button></div>
            </div>
            <small class="pf-ed-hint">${isBanner ? sz : `Tamanho sugerido: ${sz}`} (JPG, PNG ou WebP)</small>
            <input type="file" accept="image/*" hidden>
          </div>`).join('')}
        </div>
        ${isBanner ? '<small class="pf-ed-hint pf-ed-note">O título e os cards ficam por cima da parte de baixo e da esquerda da imagem. Sem imagem do celular, o celular usa a do computador.</small>' : ''}
        ${fields.map(([k, label, area]) => `<label class="au-label" for="ed-${k}">${label}</label><div class="lk-field">${area ? `<textarea id="ed-${k}" rows="3">${esc(cur[k] || '')}</textarea>` : `<input id="ed-${k}" value="${esc(cur[k] || '')}" autocomplete="off">`}</div>`).join('')}
        <p class="lk-msg" role="alert"></p>
        <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">Salvar</button></div>
      </form>`;
    document.body.appendChild(wrap);
    const msg = wrap.querySelector('.lk-msg');
    covers.forEach(([k, ck]) => {
      const box = wrap.querySelector(`.pf-ed-one[data-k="${k}"]`), prev = box.querySelector('.pf-ed-prev'), file = box.querySelector('input[type=file]');
      const show = () => { const src = imgs[k] === undefined ? cur[ck] : imgs[k]; prev.innerHTML = src ? `<img src="${esc(imgUrl(src))}" alt="">` : `<span>${svg('photo')}${isBanner ? (k === 'imageMobile' ? 'Usa a do computador' : 'Fundo padrão') : 'Sem foto de capa'}</span>`; box.querySelector('[data-ed="clear"]').hidden = !src; };
      show();
      box.querySelector('[data-ed="pick"]').addEventListener('click', () => file.click());
      box.querySelector('[data-ed="clear"]').addEventListener('click', () => { imgs[k] = ''; show(); });
      file.addEventListener('change', async () => {
        const f = file.files[0]; file.value = ''; if (!f) return;
        msg.textContent = '';
        try { prev.classList.add('busy'); imgs[k] = await storeImage(f, isBanner ? 'banner' : 'curso'); show(); }
        catch { msg.textContent = 'Não foi possível usar essa imagem. Tente outra.'; }
        finally { prev.classList.remove('busy'); }
      });
    });
    const close = () => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 300); };
    wrap.querySelector('.lk-backdrop').addEventListener('click', close);
    wrap.querySelector('.lk-cancel').addEventListener('click', close);
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    wrap.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const vals = Object.fromEntries(fields.map(([k]) => [k, wrap.querySelector('#ed-' + k).value.trim()]));
      const img = imgs.image, imgSet = Object.fromEntries(Object.entries(imgs).filter(([, v]) => v !== undefined));
      if (target.startsWith('x:')) {
        cursoExtra = extras().map((x) => (x.id === target.slice(2) ? { ...x, ...Object.fromEntries(Object.entries(vals).filter(([, v]) => v)), ...(img !== undefined ? { image: img } : {}) } : x));
        saveCursoExtra();
      } else {
        const prevEd = edits().find((x) => x.id === target) || {};
        const next = { ...prevEd, id: target, ...vals, ...imgSet };
        if (next.imageMobile === '') delete next.imageMobile;
        cursoEdit = [...edits().filter((x) => x.id !== target), next];
        saveCursoEdit();
      }
      close(); render(view);
      toast('Alterações salvas.');
    });
    requestAnimationFrame(() => wrap.classList.add('in'));
  }

  /* apagar um card pede confirmação e a senha mestra (só a impressão digital SHA-256 dela fica no código).
     É uma trava contra cliques sem querer; quem pode gravar no banco continua sendo só o administrador. */
  const MASTER_SHA = '618a865ecfa5327507b402d6a4d9bdfa52745e6da3296eb5ffcb5ec3add5d563';
  const sha256 = async (t) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))].map((b) => b.toString(16).padStart(2, '0')).join('');
  function delLesson(view, id) {
    const l = extras().find((x) => x.id === id); if (!l) return;
    confirmDel(`Apagar “${l.titulo}”?`, 'O card sai do módulo para todos os alunos e não dá para desfazer. Para confirmar, digite a senha mestra.', () => {
      cursoExtra = extras().filter((x) => x.id !== id);
      saveCursoExtra(); refillMod(view, openMod, false);
      toast('Card da lição apagado.');
    });
  }
  function confirmDel(title, sub, onOk) {
    if (!isAdmin() || document.querySelector('.lk')) return;
    const wrap = document.createElement('div');
    wrap.className = 'lk au';
    wrap.innerHTML = `<div class="lk-backdrop"></div>
      <form class="lk-card au-card" role="dialog" aria-modal="true" aria-labelledby="dl-t" novalidate>
        <span class="lk-icon au-ico pf-del-ico"><i data-icon="trash"></i></span>
        <h2 id="dl-t">${esc(title)}</h2>
        <p class="lk-sub">${esc(sub)}</p>
        <label class="au-label" for="dl-pw">Senha mestra</label>
        <div class="lk-field"><input type="password" id="dl-pw" autocomplete="off" autocapitalize="off" spellcheck="false" required></div>
        <p class="lk-msg" role="alert"></p>
        <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark btn-danger lk-go">Apagar</button></div>
      </form>`;
    document.body.appendChild(wrap); if (typeof paintIcons === 'function') paintIcons(wrap);
    const close = () => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 300); };
    wrap.querySelector('.lk-backdrop').addEventListener('click', close);
    wrap.querySelector('.lk-cancel').addEventListener('click', close);
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    const pw = wrap.querySelector('#dl-pw'), msg = wrap.querySelector('.lk-msg');
    wrap.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!pw.value) { msg.textContent = 'Digite a senha mestra.'; return pw.focus(); }
      if (await sha256(pw.value) !== MASTER_SHA) { msg.textContent = 'Senha mestra incorreta.'; pw.select(); return; }
      close(); onOk();
    });
    requestAnimationFrame(() => { wrap.classList.add('in'); pw.focus(); });
  }

  /* abre um módulo (ou fecha, se já estiver aberto): a área cresce suavemente e as lições entram */
  function toggleMod(view, i) {
    const mm = HC_CURSO.modulos[i];
    if (!canOpen(mm)) return toast(`O módulo ${i + 1} será liberado em breve.`);
    const box = view.querySelector('#pf-mod-open'), inner = view.querySelector('#pf-mod-inner');
    const cards = view.querySelectorAll('[data-modcard]');
    const setCards = () => cards.forEach((c) => {
      const on = +c.dataset.modcard === openMod;
      c.classList.toggle('open', on); c.setAttribute('aria-expanded', on);
      const go = c.querySelector('.pf-lesson-go'); if (!c.classList.contains('soon')) go.textContent = on ? 'Fechar' : 'Abrir';
    });
    view.querySelector('.pf-mods').classList.toggle('has-open', openMod !== i);
    if (openMod === i) { // fechar
      openMod = null; saveOpen(); setCards();
      box.classList.remove('show');
      setTimeout(() => { if (openMod === null) inner.innerHTML = ''; }, 850);
      return;
    }
    const swap = openMod !== null; // trocando de um módulo para outro
    openMod = i; saveOpen(); setCards();
    const fill = () => { inner.innerHTML = modBody(i); bindLessons(view, inner); inner.classList.remove('enter'); void inner.offsetWidth; inner.classList.add('enter'); };
    if (swap) { box.classList.remove('show'); setTimeout(() => { fill(); box.classList.add('show'); }, 650); }
    else { fill(); box.classList.add('show'); }
    // sobe a página só um pouco, para o aluno perceber que abriu algo embaixo; o resto ele rola se quiser.
    // Nunca passa do ponto em que o painel ficaria escondido atrás da barra de cima.
    setTimeout(() => {
      const bar = document.querySelector('.topbar-wrap, .topbar');
      const limit = (bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0) + 20;
      const top = box.getBoundingClientRect().top;
      const step = Math.min(Math.round(innerHeight * .22), 220, top - limit);
      if (step > 24) window.scrollBy({ top: step, behavior: 'smooth' });
    }, swap ? 900 : 300);
  }

  /* traz da conta o progresso das lições (para aparecer igual no celular e em qualquer computador) */
  let synced = false;
  async function sync(view) {
    if (synced || !auth?.user || typeof sb === 'undefined' || !sb) return;
    synced = true;
    const { data, error } = await sb.from('informatica_progresso').select('licao, dados').eq('user_id', auth.user.id);
    if (error) { // sem internet ou falha: tenta de novo daqui a pouco (e quando a internet voltar)
      synced = false;
      clearTimeout(sync.retry); sync.retry = setTimeout(() => { if (view.isConnected) sync(view); }, 8000);
      if (!sync.onl) { sync.onl = true; addEventListener('online', () => { if (!synced && view.isConnected) sync(view); }); }
      return false;
    }
    let changed = false;
    const xpRow = data.find((r) => r.licao === window.HC_xp.ID);
    if (xpRow ? window.HC_xp.merge(xpRow.dados) : (window.HC_xp.pull(), false)) changed = true;
    const cashRow = data.find((r) => r.licao === window.HC_cash.ID);
    if (cashRow ? window.HC_cash.merge(cashRow.dados) : (window.HC_cash.pull(), false)) changed = true;
    const lojaId = window.HC_loja?.ID, lojaRow = lojaId && data.find((r) => r.licao === lojaId); // itens da loja: junta os comprados nos dois lados
    if (lojaRow && window.HC_loja.merge(lojaRow.dados)) changed = true;
    else if (!lojaRow && lojaId) window.HC_loja.send();
    data.forEach(({ licao, dados }) => {
      if (licao === window.HC_xp.ID || licao === window.HC_cash.ID || licao === lojaId) return;
      const key = `hc:info:${auth.user.id}:${licao}`;
      let local = null; try { local = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
      if (!local || (dados?.savedAt || 0) > (local.savedAt || 0)) { try { localStorage.setItem(key, JSON.stringify(dados)); changed = true; } catch {} }
    });
    // lições e conteúdos feitos neste aparelho que não chegaram à conta (sem internet na hora): manda agora.
    // O banco só aceita se for avanço (script 21), então nada do que está na conta é perdido.
    const pre = `hc:info:${auth.user.id}:`, remote = new Map(data.map((r) => [r.licao, r.dados]));
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i); if (!k?.startsWith(pre)) continue;
      const licao = k.slice(pre.length); if (!/^(licao|cont)-/.test(licao)) continue;
      let local = null; try { local = JSON.parse(localStorage.getItem(k) || 'null'); } catch {}
      if (!local || (remote.has(licao) && (local.savedAt || 0) <= (remote.get(licao)?.savedAt || 0))) continue;
      sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao, dados: local, updated_at: new Date().toISOString() })
        .then(({ error: e }) => { if (e) console.info('Progresso ainda só neste aparelho:', e.message); });
    }
    if (!changed || !view.isConnected) return changed;
    if (location.hash === '#informatica/progresso' || location.hash === '#informatica/loja') return true; // a tela de progresso e a loja se redesenham sozinhas
    if (onDiscPage()) return discPage(view, location.hash.slice('#informatica/disciplina-'.length), true);
    if (location.hash === '#informatica/cursos' || (location.hash === '#informatica' && !window.HC_isComputer())) render(view);
    return true;
  }

  /* ---------- números da tela de progresso (curso/progresso.js) ----------
     Tudo é contado na hora a partir do que já está salvo: quando entram lições, aulas ou provas novas,
     os totais crescem sozinhos (ex.: os níveis do curso vêm do número de níveis de cada lição pronta). */
  async function progressData() {
    const lessons = HC_CURSO.modulos.flatMap((m) => m.licoes).map((l, i) => ({ l, n: i + 1 })).filter((x) => x.l.arquivo);
    await Promise.all(lessons.map((x) => load(x.l.arquivo).catch(() => {})));
    let estrelas = 0, superstar = 0, megastar = 0, nivTot = 0, nivFeitos = 0, licoesFeitas = 0;
    lessons.forEach(({ n }) => {
      const L = window.HC_LICOES?.[`licao-${n}`], p = progress(n), tot = L?.niveis.length || 30;
      nivTot += tot; nivFeitos += p?.done ? tot : Math.min(p?.lvl || 0, tot);
      if (p?.done) licoesFeitas++;
      const pts = Math.min(PTS_MAX, (p?.levelPts || []).reduce((t, x) => t + (x || 0), 0));
      if (p?.done || pts) { estrelas += STAR_AT.filter((t) => pts >= t).length; if (pts >= MEGA_AT) megastar++; else if (pts >= SUPER_AT) superstar++; }
    });
    const all = conts(), aulas = all.filter((c) => c.tipo !== 'prova'), provas = all.filter((c) => c.tipo === 'prova');
    const tentou = (c) => (contProg(c.id)?.hist || []).length > 0;
    const x = window.HC_xp.get();
    return {
      nome: meName(), perfil: auth.profile, xp: x, patente: window.HC_xp.rankOf(x.xp), saldo: window.HC_cash.get().saldo,
      estrelas, estrelasMax: lessons.length * 5, superstar, megastar,
      aulas: { feitas: aulas.filter((c) => contDone(c.id)).length, total: aulas.length },
      questionarios: { feitos: aulas.filter(tentou).length, tentativas: aulas.reduce((t, c) => t + (contProg(c.id)?.hist || []).length, 0), total: aulas.length },
      provas: { feitas: provas.filter(tentou).length, aprovadas: provas.filter((c) => contDone(c.id)).length, total: provas.length },
      niveis: { total: nivTot, feitos: nivFeitos, faltam: nivTot - nivFeitos }, licoes: { feitas: licoesFeitas, total: lessons.length },
      estagio: stageCardHTML(journeyData()),
    };
  }
  async function progressPage(view) {
    view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando o seu progresso…</p></div>';
    try { await Promise.all([load('curso/progresso.css'), load('curso/progresso.js')]); }
    catch { view.innerHTML = '<div class="wrap"><p class="me-loading">Não foi possível abrir o progresso. Verifique a internet e tente de novo.</p></div>'; return; }
    const draw = async () => { const d = await progressData(); if (location.hash === '#informatica/progresso' && view.isConnected) window.HC_progresso.render(view, d); };
    await draw();
    if (await sync(view)) draw(); // chegou progresso de outro aparelho: atualiza os números
  }

  /* ---------- loja de itens (curso/loja.js; catálogo e inventário em curso/loja-itens.js) ---------- */
  async function shopPage(view) {
    view.innerHTML = '<div class="wrap"><p class="me-loading">Abrindo a loja de itens…</p></div>';
    try { await Promise.all([load('curso/loja.css'), load('curso/loja.js'), window.HC_loja ? null : load('curso/loja-itens.js')]); }
    catch { view.innerHTML = '<div class="wrap"><p class="me-loading">Não foi possível abrir a loja. Verifique a internet e tente de novo.</p></div>'; return; }
    const draw = () => { if (location.hash === '#informatica/loja' && view.isConnected) window.HC_loja_tela.render(view, { perfil: auth.profile }); };
    draw();
    if (await sync(view)) draw(); // chegou saldo ou itens de outro aparelho
  }

  window.HC_platform = { render: (view, sub) => {
    if (!sub && window.HC_menu && window.HC_isComputer()) return window.HC_menu.render(view); // #informatica: tela de seleção (curso/menu.js), só no computador
    if (sub === 'cursos') sub = ''; // #informatica/cursos: módulos e lições
    if (sub === 'progresso') return progressPage(view); // #informatica/progresso: a tela de progresso do aluno
    if (sub === 'loja') return shopPage(view); // #informatica/loja: a loja de itens
    render(view, sub); if (!sub) sync(view);
  } };
})();
