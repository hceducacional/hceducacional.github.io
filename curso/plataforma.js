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
        { tag: 'Introdução', titulo: 'Conhecendo J, F e Espaço', desc: 'Os primeiros toques: os indicadores nas teclas F e J e os polegares na barra de espaço.', imagem: '', arquivo: 'curso/licao-01.js' },
        { tag: 'Introdução', titulo: 'Teclas U, R e K', desc: 'Os indicadores sobem para U e R, e o dedo médio direito chega ao K.', imagem: '' },
        { tag: 'Introdução', titulo: 'Teclas D, E e I', desc: 'O dedo médio esquerdo no D e no E, e o médio direito no I.', imagem: '' },
        { tag: 'Introdução', titulo: 'Teclas C, G e N', desc: 'O médio esquerdo desce ao C, e os indicadores alcançam o G e o N.', imagem: '' },
        { tag: 'Revisão', titulo: 'Revisão Geral 1', desc: 'Uma revisão completa de todas as teclas aprendidas no módulo.', imagem: '' },
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
    sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao: ID, dados: d, updated_at: new Date().toISOString() })
      .then(({ error }) => { if (error) console.info('XP geral salvo só neste aparelho:', error.message); });
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
    sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao: ID, dados: d, updated_at: new Date().toISOString() })
      .then(({ error }) => { if (error) console.info('Saldo HC salvo só neste aparelho:', error.message); });
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
  const CONTS_BASE = [
    { id: 'texto-01', tipo: 'texto', titulo: 'O teclado e a digitação correta', desc: 'As partes do teclado, onde fica cada dedo, a postura certa e como ganhar velocidade sem perder a precisão.',
      meta: '15 min · 15 perguntas', image: '', visivel: true, arquivo: 'curso/conteudos/texto-01.js', fixo: true },
  ];
  const conts = () => {
    const s = saved(), ids = new Set(CONTS_BASE.map((b) => b.id));
    return CONTS_BASE.map((b) => ({ ...b, ...(s.find((x) => x.id === b.id) || {}), arquivo: b.arquivo, fixo: true }))
      .concat(s.filter((x) => !ids.has(x.id))).filter((c) => !c.oculto);
  };
  const visConts = () => conts().filter((c) => isAdmin() || c.visivel);
  const contProg = (id) => { try { return JSON.parse(localStorage.getItem(`hc:info:${auth?.user?.id || 'anon'}:cont-${id}`) || 'null'); } catch { return null; } };
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
  const PER_PAGE = 5; // lições por página; da 6ª em diante continuam para o lado
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;

  /* imagem, ou espaço reservado (com etiqueta para o administrador) */
  const slot = (src, label, size, k = 0) => src
    ? `<img class="pf-img" src="${esc(imgUrl(src))}" alt="" loading="lazy" />`
    : `<span class="pf-ph" style="--k:${k}">${svg('keys')}${isAdmin() ? `<em>${label}<small>${size}</small></em>` : ''}</span>`;

  /* seção "Conteúdos para aprender", logo abaixo dos módulos: cards no mesmo estilo dos módulos */
  const progTxt = (c) => {
    const p = contProg(c.id); if (!p?.savedAt) return '';
    const n = Object.keys(p.ans || {}).length, r = (p.read || []).length;
    return n ? `${n} ${n === 1 ? 'resposta' : 'respostas'} · ${p.readXp ? 'leitura concluída' : `${r} partes lidas`}` : p.readXp ? 'Leitura concluída' : `${r} ${r === 1 ? 'parte lida' : 'partes lidas'}`;
  };
  function contsSection() {
    const list = visConts(), adm = isAdmin();
    const card = (c, i) => {
      const t = CT[c.tipo] || CT.texto, ico = CT[c.tipo] ? c.tipo : 'texto';
      return `
      <article class="pf-lesson pf-modcard pf-ccard${c.visivel ? '' : ' draft'}" style="--i:${i};--tint:${t.tint}" data-cont="${esc(c.id)}" tabindex="0" role="button" aria-label="${esc(t.nome)}: ${esc(c.titulo)}">
        <div class="pf-lesson-img">${c.image ? `<img class="pf-img" src="${esc(imgUrl(c.image))}" alt="" loading="lazy" />`
          : `<span class="pf-ph" style="--k:${i}">${svg(ico)}${adm ? '<em>Imagem do conteúdo<small>1000 × 1250</small></em>' : ''}</span>`}</div>
        <div class="pf-lesson-app">
          <div class="pf-lesson-text">
            <span class="pf-lesson-tag">${esc(t.nome)}${adm && !c.visivel ? ' · Rascunho' : ''}</span>
            <h3>${esc(c.titulo || 'Sem título')}</h3>
            <p>${esc(c.desc || '')}</p>
          </div>
          <div class="pf-lesson-bar">
            <span class="pf-lesson-av">${svg(ico)}</span>
            <span class="pf-lesson-who"><strong>${esc(t.nome)}</strong><small>${esc(progTxt(c) || c.meta || t.sub)}</small></span>
            <span class="pf-lesson-go">${contProg(c.id)?.savedAt ? 'Continuar' : 'Abrir'}</span>
          </div>
        </div>
        ${adm ? `<div class="pf-adm"><button class="pf-adm-btn" type="button" data-editcont="${esc(c.id)}" aria-label="Editar o conteúdo" title="Editar conteúdo">${svg('pen')}</button><button class="pf-adm-btn" type="button" data-delcont="${esc(c.id)}" aria-label="Apagar o conteúdo" title="Apagar conteúdo">${svg('trash')}</button></div>` : ''}
      </article>`;
    };
    const empty = `
      <div class="pf-cempty">
        <div class="pf-cempty-icos">${['texto', 'pdf', 'quiz', 'prova'].map((k, i) => `<span style="--tint:${CT[k].tint};--i:${i}">${svg(k)}</span>`).join('')}</div>
        <h3>${adm ? 'Crie o primeiro conteúdo' : 'Em breve, novos conteúdos'}</h3>
        <p>${adm ? 'Textos para ler, PDFs, questionários e provas para os alunos responderem. Eles aparecem aqui, logo abaixo dos módulos.' : 'Textos, PDFs, questionários e provas preparados pelo seu professor vão aparecer aqui.'}</p>
        ${adm ? `<button class="pf-cnew-btn" type="button" data-newcont>${svg('plus')} Novo conteúdo</button>` : ''}
      </div>`;
    return `
    <section class="pf-conts" aria-label="Conteúdos para aprender">
      <div class="pf-mods-head">
        <h2 class="pf-st-title">Conteúdos para aprender <span>Textos, PDFs, questionários e provas</span></h2>
        ${list.length ? `<div class="ap-paddles pf-mod-paddles">
          <button class="ap-paddle" data-cdir="-1" aria-label="Conteúdos anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button class="ap-paddle" data-cdir="1" aria-label="Próximos conteúdos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>` : ''}
      </div>
      ${list.length ? `<div class="pf-mod-row pf-cont-row" id="pf-cont-row">${list.map(card).join('')}
        ${adm ? `<button class="pf-cnew" type="button" data-newcont><span>${svg('plus')}</span><b>Novo conteúdo</b><small>Texto, PDF, questionário ou prova</small></button>` : ''}
      </div>` : empty}
    </section>`;
  }
  function bindConts(view) {
    const sec = view.querySelector('.pf-conts'); if (!sec) return;
    sec.querySelectorAll('[data-cont]').forEach((c) => {
      const act = () => openCont(c.dataset.cont);
      c.addEventListener('click', act);
      c.addEventListener('keydown', (e) => { if (e.target !== c) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    });
    sec.querySelectorAll('[data-newcont]').forEach((b) => b.addEventListener('click', () => editCont(view, null)));
    sec.querySelectorAll('[data-editcont]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); editCont(view, b.dataset.editcont); }));
    sec.querySelectorAll('[data-delcont]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const c = conts().find((x) => x.id === b.dataset.delcont); if (!c) return;
      confirmDel(`Apagar “${c.titulo || 'conteúdo'}”?`, 'O card sai da Plataforma de Informática para todos os alunos e não dá para desfazer. Para confirmar, digite a senha mestra.', () => {
        cursoConteudo = c.fixo ? [...saved().filter((x) => x.id !== c.id), { id: c.id, oculto: true }] : saved().filter((x) => x.id !== c.id);
        saveCursoConteudo(); refreshConts(view); toast('Conteúdo apagado.');
      });
    }));
    const row = sec.querySelector('#pf-cont-row'); if (!row) return;
    const pads = sec.querySelectorAll('[data-cdir]');
    pads.forEach((b) => b.addEventListener('click', () => row.scrollBy({ left: +b.dataset.cdir * row.clientWidth * .8, behavior: 'smooth' })));
    const upd = () => { if (!pads.length) return; pads[0].disabled = row.scrollLeft < 4; pads[1].disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4; pads[0].parentNode.classList.toggle('none', pads[0].disabled && pads[1].disabled); };
    row.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd, { passive: true }); upd();
  }
  function refreshConts(view, toEnd) {
    const sec = view.querySelector('.pf-conts'); if (!sec) return;
    sec.outerHTML = contsSection(); bindConts(view);
    const row = view.querySelector('#pf-cont-row');
    if (row && toEnd) requestAnimationFrame(() => row.scrollTo({ left: row.scrollWidth, behavior: 'smooth' }));
  }
  /* abrir um conteúdo: os prontos (com arquivo) abrem a tela de leitura; os outros ainda serão montados */
  function openCont(id) {
    const c = conts().find((x) => x.id === id); if (!c) return;
    if (c.arquivo) { location.hash = `#informatica/conteudo-${c.id}`; return; }
    toast(`${(CT[c.tipo] || CT.texto).nome} “${c.titulo || 'Sem título'}”: o conteúdo será liberado em breve.`);
  }
  async function openContPage(view, id) {
    const c = conts().find((x) => x.id === id);
    if (!c?.arquivo || (!c.visivel && !isAdmin())) { location.hash = '#informatica/cursos'; return toast('Este conteúdo não está disponível.'); }
    view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando o conteúdo…</p></div>';
    try { await Promise.all([load('curso/conteudo.css'), load('curso/conteudo.js'), load(c.arquivo)]); }
    catch { view.innerHTML = '<div class="wrap"><p class="me-loading">Não foi possível abrir o conteúdo. Verifique a internet e tente de novo.</p></div>'; return; }
    if (location.hash !== `#informatica/conteudo-${id}`) return;
    window.HC_conteudo.open(view, window.HC_CONTEUDOS[id], { id, image: c.image ? imgUrl(c.image) : '', tint: (CT[c.tipo] || CT.texto).tint });
  }
  /* administrador: criar (id null) ou editar um card de conteúdo */
  function editCont(view, id) {
    if (!isAdmin() || document.querySelector('.lk') || typeof saveCursoConteudo !== 'function') return;
    const old = id ? conts().find((x) => x.id === id) : null; if (id && !old) return;
    const cur = old ? { ...old } : { tipo: 'texto', titulo: '', desc: '', image: '', visivel: false };
    let img; // undefined = sem troca; '' = remover; 'idb:…' = nova foto
    const wrap = document.createElement('div');
    wrap.className = 'lk au';
    wrap.innerHTML = `<div class="lk-backdrop"></div>
      <form class="lk-card au-card pf-ed" role="dialog" aria-modal="true" aria-labelledby="ec-t" novalidate>
        <h2 id="ec-t">${old ? 'Editar conteúdo' : 'Novo conteúdo'}</h2>
        <p class="lk-sub">Conteúdos para aprender · aparece abaixo dos módulos.</p>
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
      saveCursoConteudo(); close(); refreshConts(view, !old);
      toast(old ? 'Conteúdo salvo.' : 'Conteúdo criado.');
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
    try { await Promise.all([load('curso/licao.css'), load('curso/teclado.js'), load('curso/licao.js'), load(l.arquivo)]); }
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
        return { tag: l.tag || '', desc: l.desc || '', imagem: l.imagem ? imgUrl(l.imagem) : '', tint: TINTS[i % TINTS.length], k: i, stars: (p) => cardStars(p) };
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
  const HC_NIVEIS = { 1: '30 níveis' }; // quantos níveis cada lição tem (mostrado antes de começar)

  const MTINTS = ['22, 60, 48', '36, 40, 110', '86, 30, 110', '120, 50, 24', '24, 80, 96'];

  /* módulo expandido: as lições do módulo e o próximo passo */
  function modBody(mi) {
    const m = HC_CURSO.modulos[mi]; if (!m) return '';
    const first = HC_CURSO.modulos.slice(0, mi).reduce((a, x) => a + x.licoes.length, 0); // nº da 1ª lição do módulo - 1
    const nextM = HC_CURSO.modulos[mi + 1];
    const pages = []; for (let k = 0; k < m.licoes.length; k += PER_PAGE) pages.push(m.licoes.slice(k, k + PER_PAGE));
    return `
      <section>
        <h2 class="shelf-title"><span class="ap-grad">${esc(m.secao || m.nome + '.')}</span><span> ${esc(m.secaoComplemento || '')}</span></h2>
        ${m.texto ? `<p class="shelf-sub pf-sub">${esc(m.texto)}</p>` : ''}
        ${window.HC_isComputer() ? '' : `<div class="pf-pc-note"><span>${svg('keys')}</span><p><b>As lições são feitas no computador.</b> Por aqui você acompanha o seu progresso; para praticar, use os computadores da instituição nos dias de aula.</p></div>`}
        <div class="pf-lpages" id="pf-lpages">${pages.map((pg, pi) => `
        <ol class="pf-lessons" aria-label="Lições ${pi * PER_PAGE + 1} a ${pi * PER_PAGE + pg.length}">
          ${pg.map((l, k) => {
            const i = pi * PER_PAGE + k;
            const n = first + i + 1, p = progress(n), num = String(n).padStart(2, '0');
            const state = !l.arquivo ? 'Em breve' : p?.done ? 'Concluída' : p ? `Nível ${Math.min(p.lvl + 1, p.total)} de ${p.total}` : `${HC_NIVEIS[n] || ''}`;
            const go = !l.arquivo ? 'Em breve' : !window.HC_isComputer() ? 'Ver' : p?.done ? 'Refazer' : p && p.lvl > 0 ? 'Continuar' : 'Acessar';
            return `
          <li class="pf-lesson${l.arquivo ? '' : ' soon'}" style="--i:${k};--tint:${l.arquivo ? '74, 30, 8' : TINTS[i % TINTS.length]}" data-lesson="${n}" tabindex="0" aria-label="Lição ${num}: ${esc(l.titulo)}">
            ${l.arquivo ? `<div class="pf-lesson-img pf-lcover" data-cover="${esc(l.arquivo)}" data-n="${n}" aria-hidden="true"></div>` : `<div class="pf-lesson-img">${slot(l.imagem, 'Imagem da lição', '1000 × 1000', i)}</div>`}
            <div class="pf-lesson-app">
              <div class="pf-lesson-text">
                <span class="pf-lesson-tag">${esc(l.tag)}</span>
                <h3>${esc(l.titulo)}</h3>
                ${l.desc ? `<p>${esc(l.desc)}</p>` : ''}
              </div>
              <div class="pf-lesson-bar">
                <span class="pf-lesson-av">${num}</span>
                <span class="pf-lesson-who"><strong>Lição ${num}</strong><small>${esc(state)}</small></span>
                ${l.arquivo ? cardStars(p) : ''}
                <span class="pf-lesson-go">${go}</span>
              </div>
            </div>
            ${isAdmin() ? `<div class="pf-adm"><button class="pf-adm-btn" type="button" data-editlesson="${l.extra ? 'x:' + esc(l.id) : `l${mi}-${i}`}" aria-label="Editar a capa da lição" title="Editar capa">${svg('pen')}</button>${l.extra ? `<button class="pf-adm-btn pf-lesson-del" type="button" data-dellesson="${esc(l.id)}" aria-label="Apagar este card" title="Apagar card">×</button>` : ''}</div>` : ''}
            ${p ? `<b class="pf-lesson-prog" style="--w:${((p.done ? p.total : p.lvl) / p.total) * 100}%"></b>` : ''}
          </li>`;
          }).join('')}
        </ol>`).join('')}</div>
        ${pages.length > 1 ? `<div class="ap-paddles pf-lpaddles">
          <button class="ap-paddle" type="button" data-ldir="-1" aria-label="Lições anteriores" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button class="ap-paddle" type="button" data-ldir="1" aria-label="Próximas lições"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>` : ''}
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

  /* widget do XP geral e do nível do aluno (em "Seu curso") */
  function xpWidget() {
    const x = window.HC_xp.get(), nv = String(x.nivel).padStart(2, '0'), n = (v) => v.toLocaleString('pt-BR');
    return `
        <div class="pf-xp" role="group" aria-label="Nível ${x.nivel}, ${n(x.xp)} XP">
          <span class="pf-xp-lvl"><small>Nível</small><b>${nv}</b></span>
          <div class="pf-xp-main">
            <div class="pf-xp-top">
              <span class="pf-xp-total"><strong>${n(x.xp)}</strong> XP</span>
              <span class="pf-xp-next">Faltam <b>${n(x.falta)} XP</b> para o nível ${String(x.nivel + 1).padStart(2, '0')}</span>
            </div>
            <div class="pf-xp-bar"><i style="--w:${(x.pct / 100).toFixed(4)}"></i></div>
            <small class="pf-xp-sub">${n(x.rest)} de ${n(x.proximo)} XP neste nível · todo XP das lições soma aqui, inclusive ao refazer</small>
          </div>
          ${window.HC_cash ? `<span class="pf-cash" title="Saldo HC: cada estrela rende 35,27, o Superstar +87,76 e o Megastar +97,43"><span class="pf-cash-txt"><small>Saldo HC</small><b>${cashParts(window.HC_cash.get().saldo)}</b></span><img src="assets/moeda/moeda.webp" alt="" draggable="false"></span>` : ''}
        </div>`;
  }
  /* "1.250,00" com os centavos menores */
  function cashParts(v) {
    const [a, b] = window.HC_cashFmt(v).split(',');
    return `${a}<small>,${b}</small>`;
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
      const ih = Math.max(imgh, Math.round(top0 + 12 + th + dotsH + onImg));
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
    const ln = /^licao-(\d+)$/.exec(sub), cn = /^conteudo-([\w-]+)$/.exec(sub);
    mergeExtras();
    if (ln) return openLesson(view, +ln[1]);
    if (cn) return openContPage(view, cn[1]);
    const m = HC_CURSO.modulos[mod];
    const first = HC_CURSO.modulos.slice(0, mod).reduce((a, x) => a + x.licoes.length, 0); // nº da 1ª lição do módulo - 1
    const nextM = HC_CURSO.modulos[mod + 1];
    const n = m.licoes.length;
    const stats = [
      ['level', 'Nível', m.nivel.replace(/^Nível\s+/i, ''), '#059669', '#34d399'],
      ['stack', 'Módulo', `${mod + 1} de ${HC_CURSO.modulos.length}`, '#2563eb', '#38bdf8'],
      ['book', 'Lições do módulo', String(n), '#7c3aed', '#a78bfa'],
      ['chart', 'Níveis no curso', String(m.totalNiveis), '#ea580c', '#fbbf24'],
    ];
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
            <h2 class="pf-st-title">Seu curso <span>Onde você está na Plataforma de Informática</span></h2>
            <div class="pf-course-grid">
              ${xpWidget()}
              <div class="pf-stats">
                ${stats.map(([ico, label, val, c1, c2], k) => `
                <div class="pf-stat" style="--c1:${c1};--c2:${c2};--k:${k}">
                  <span class="pf-stat-ico">${svg(ico)}</span>
                  <span class="pf-stat-txt"><small>${label}</small><strong>${esc(val)}</strong></span>
                </div>`).join('')}
              </div>
            </div>
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
    row.addEventListener('scroll', paddles, { passive: true }); paddles();
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
    root.querySelectorAll('.pf-lcover[data-cover]').forEach((box) => {
      const n = +box.dataset.n;
      load(box.dataset.cover).then(() => {
        const L = window.HC_LICOES?.[`licao-${n}`]; if (!L || !box.isConnected) return;
        const p = progress(n), done = p?.done ? L.niveis.length : p?.lvl || 0;
        box.innerHTML = `<div class="pf-lc"><div class="pf-lc-keys">${L.teclas.map((k, i) => `<kbd style="--i:${i}">${k === ' ' ? 'Espaço' : esc(k.toUpperCase())}</kbd>`).join('')}</div>
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
    const pagesEl = root.querySelector('#pf-lpages');
    if (pagesEl) {
      const pads = root.querySelectorAll('[data-ldir]');
      const upd = () => { if (!pads.length) return; pads[0].disabled = pagesEl.scrollLeft < 4; pads[1].disabled = pagesEl.scrollLeft + pagesEl.clientWidth >= pagesEl.scrollWidth - 4; };
      pads.forEach((b) => b.addEventListener('click', () => pagesEl.scrollBy({ left: +b.dataset.ldir * pagesEl.clientWidth, behavior: 'smooth' })));
      pagesEl.addEventListener('scroll', upd, { passive: true }); upd();
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
        try { prev.classList.add('busy'); imgs[k] = await storeImage(f, 'curso'); show(); }
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
    if (error) return;
    let changed = false;
    const xpRow = data.find((r) => r.licao === window.HC_xp.ID);
    if (xpRow ? window.HC_xp.merge(xpRow.dados) : (window.HC_xp.pull(), false)) changed = true;
    const cashRow = data.find((r) => r.licao === window.HC_cash.ID);
    if (cashRow ? window.HC_cash.merge(cashRow.dados) : (window.HC_cash.pull(), false)) changed = true;
    data.forEach(({ licao, dados }) => {
      if (licao === window.HC_xp.ID || licao === window.HC_cash.ID) return;
      const key = `hc:info:${auth.user.id}:${licao}`;
      let local = null; try { local = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
      if (!local || (dados?.savedAt || 0) > (local.savedAt || 0)) { try { localStorage.setItem(key, JSON.stringify(dados)); changed = true; } catch {} }
    });
    if (changed && view.isConnected && (location.hash === '#informatica/cursos' || (location.hash === '#informatica' && !window.HC_isComputer()))) render(view);
  }

  window.HC_platform = { render: (view, sub) => {
    if (!sub && window.HC_menu && window.HC_isComputer()) return window.HC_menu.render(view); // #informatica: tela de seleção (curso/menu.js), só no computador
    if (sub === 'cursos') sub = ''; // #informatica/cursos: módulos e lições
    render(view, sub); if (!sub) sync(view);
  } };
})();
