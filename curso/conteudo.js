/* =========================================================
   TELA DE LEITURA DOS "CONTEÚDOS PARA APRENDER" (#informatica/conteudo-<id>)
   Texto dividido em partes, com sumário e barra de leitura; ao lado, o questionário
   sobre o texto (no celular, ele abre numa folha que sobe de baixo).
   Dados de cada conteúdo: curso/conteudos/<id>.js (window.HC_CONTEUDOS[id]).
   Progresso do aluno (partes lidas e respostas) fica no aparelho e na conta
   (tabela informatica_progresso, linha "cont-<id>"), como as lições.
   Os conteúdos não dão XP nem moedas. O questionário vale NOTA de 0 a 10 (acertos ÷ perguntas × 10, com uma casa);
   abaixo de 7 é recuperação. Cada tentativa nova custa 500 do Saldo HC nas aulas e 1.250 na avaliação; fica valendo a maior nota.
   O administrador tem o "Testar como aluno": nada é salvo e o saldo é fictício (para ver a compra e a animação das moedas).
   Baixado só quando o aluno abre um conteúdo.
   ========================================================= */
(() => {
  const PRICE_AULA = 500, PRICE_PROVA = 1250, PASS = 7, TEST_SALDO = 5000; // preço da nova tentativa (aula / avaliação), nota mínima, saldo fictício do teste
  const nota = (ok, n) => Math.round((ok / Math.max(1, n)) * 100) / 10; // 0 a 10, uma casa
  const fmtN = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 1 : 0, maximumFractionDigits: 1 });
  const fmtC = (v) => (window.HC_cashFmt ? window.HC_cashFmt(v) : (Math.round(v * 100) / 100).toFixed(2));
  const COIN = 'assets/moeda/moeda.webp';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* texto: **negrito**, [[icone]] (ícone animado no meio da frase, curso/figuras.js) e {{Ctrl}} (tecla desenhada) */
  const kbd = (k) => `<kbd class="ct-kbd">${k}</kbd>`;
  /* "Ctrl+Shift+Esc", "Win++" (a própria tecla +), "Home / End" (duas opções) */
  const keys = (k) => k.split(' / ').map((c) => c.split(/\+(?=.)/).map((x) => kbd(x.trim())).join('<i class="ct-plus">+</i>')).join('<i class="ct-plus">/</i>');
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[\[([\w-]+)\]\]/g, (m, n) => (window.HC_ICO ? window.HC_ICO(n) : ''))
    .replace(/\{\{(.+?)\}\}/g, (m, k) => keys(k));
  const say = (t) => (typeof toast === 'function' ? toast(t) : null);
  const I = {
    back: '<path d="m15 18-6-6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.3-2.5 3.9M12 17h.01"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    next: '<path d="m9 18 6-6-6-6"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    redo: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.2 1.6M9.5 3h5M12 3v3"/>',
    lockc: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M12 14.5v2.5"/>',
    shackle: '<path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3Z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.5c-.5-.8-1.4-1.2-2.5-1.2-1.5 0-2.5.8-2.5 1.9 0 2.6 5 1.4 5 4 0 1.1-1 1.9-2.5 1.9-1.1 0-2-.4-2.5-1.2M12 7v1.3M12 15.7V17"/>',
    warn: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;

  /* ---------- desenho do teclado (ABNT2, só a parte das letras) ---------- */
  const FINGER = { m: ['Mindinho', '#ec4899'], a: ['Anelar', '#f59e0b'], d: ['Médio', '#10b981'], i: ['Indicador', '#3b82f6'], p: ['Polegar', '#8e8e93'] };
  const ROWS = [
    ['1234567890', 'madiiiidam', 0],
    ['QWERTYUIOP´[', 'madiiiidammm', .5],
    ['ASDFGHJKLÇ~]', 'madiiiidammm', .75],
    ['ZXCVBNM,.;', 'madiiiidam', 1.25],
  ];
  function keyboard(kind) {
    const home = 'ASDFJKLÇ';
    const rows = (kind === 'referencia' ? ROWS.slice(1, 4) : ROWS).map(([keys, f, off]) => `
      <div class="ct-kb-row" style="--off:${off}">${[...keys].map((k, j) => {
        const fi = f[j], on = kind === 'dedos' || home.includes(k);
        const cls = ['ct-key', on ? 'on' : '', (k === 'F' || k === 'J') ? 'bump' : ''].filter(Boolean).join(' ');
        return `<span class="${cls}" style="--c:${FINGER[fi][1]}">${esc(k)}</span>`;
      }).join('')}</div>`).join('');
    const legend = `<div class="ct-kb-legend">${Object.values(FINGER).map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join('')}</div>`;
    return `<figure class="ct-kb ${kind}" aria-label="${kind === 'dedos' ? 'Mapa de dedos do teclado ABNT2' : 'Fileira de referência do teclado'}">
      <div class="ct-kb-in">${rows}<div class="ct-kb-row" style="--off:3.2"><span class="ct-key space on" style="--c:${FINGER.p[1]}">espaço</span></div></div>
      ${kind === 'dedos' ? legend : '<figcaption>Os oito dedos descansam nas teclas coloridas; os relevos do <b>F</b> e do <b>J</b> guiam os indicadores e os polegares ficam no espaço.</figcaption>'}
    </figure>`;
  }

  const TOM = { dica: ['bulb', 'Dica'], atencao: ['warn', 'Atenção'], saiba: ['info', 'Saiba mais'] };
  function block(b) {
    if (b.p) return `<p>${md(b.p)}</p>`;
    if (b.h) return `<h3>${md(b.h)}</h3>`;
    if (b.lista) return `<ul class="ct-ul">${b.lista.map((x) => `<li>${md(x)}</li>`).join('')}</ul>`;
    if (b.passos) return `<ol class="ct-ol">${b.passos.map((x, i) => `<li><span>${i + 1}</span><div>${md(x)}</div></li>`).join('')}</ol>`;
    if (b.checklist) return `<ul class="ct-check">${b.checklist.map((x) => `<li>${svg('check')}<div>${md(x)}</div></li>`).join('')}</ul>`;
    if (b.destaque) { const [ico, lbl] = TOM[b.destaque.tom] || TOM.saiba; return `<aside class="ct-note ${b.destaque.tom || 'saiba'}"><span class="ct-note-ico">${svg(ico)}</span><div><b>${esc(b.destaque.titulo || lbl)}</b><p>${md(b.destaque.texto)}</p></div></aside>`; }
    if (b.teclado) return keyboard(b.teclado);
    if (b.tabela) return `<div class="ct-table"><table><thead><tr>${b.tabela.cab.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.tabela.linhas.map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    /* ilustração animada (curso/figuras.js), com legenda opcional */
    if (b.fig) { const f = window.HC_FIGS?.[b.fig]; return f ? `<figure class="ct-fig" data-fig="${esc(b.fig)}">${f()}${b.legenda ? `<figcaption>${md(b.legenda)}</figcaption>` : ''}</figure>` : ''; }
    /* cartões com ícone: [{ ico, t, d }] */
    if (b.cards) return `<div class="ct-cards">${b.cards.map((c, i) => `<div class="ct-card" style="--i:${i}"><span class="ct-card-ico">${window.HC_ICO ? window.HC_ICO(c.ico, true) : ''}</span><b>${md(c.t)}</b>${c.d ? `<p>${md(c.d)}</p>` : ''}</div>`).join('')}</div>`;
    /* atalhos: [['Ctrl+C', 'Copiar'], …] */
    if (b.atalhos) return `<div class="ct-keys">${b.atalhos.map(([k, d], i) => `<div class="ct-keyrow" style="--i:${i}"><span class="ct-keycombo">${keys(esc(k))}</span><span>${md(d)}</span></div>`).join('')}</div>`;
    /* linha do tempo: [['1946', 'texto'], …] */
    if (b.linha) return `<ol class="ct-time">${b.linha.map(([y, t], i) => `<li style="--i:${i}"><span class="ct-time-y">${esc(y)}</span><div>${md(t)}</div></li>`).join('')}</ol>`;
    /* comparação lado a lado: { a: { t, ico, itens }, b: { t, ico, itens } } */
    if (b.compara) return `<div class="ct-vs">${['a', 'b'].map((k) => { const x = b.compara[k]; return `<div class="ct-vs-col ${k}"><div class="ct-vs-h">${x.ico && window.HC_ICO ? window.HC_ICO(x.ico, true) : ''}<b>${md(x.t)}</b></div><ul>${x.itens.map((it) => `<li>${md(it)}</li>`).join('')}</ul></div>`; }).join('<span class="ct-vs-x">×</span>')}</div>`;
    /* fluxo em etapas com setas animadas: [{ ico, t, d }] */
    if (b.fluxo) return `<div class="ct-flow">${b.fluxo.map((x, i) => `${i ? '<span class="ct-flow-arr" aria-hidden="true"><i></i></span>' : ''}<div class="ct-flow-step" style="--i:${i}"><span class="ct-flow-ico">${window.HC_ICO ? window.HC_ICO(x.ico, true) : ''}</span><b>${md(x.t)}</b>${x.d ? `<small>${md(x.d)}</small>` : ''}</div>`).join('')}</div>`;
    /* exemplo: uma "tela" com o resultado (texto livre) */
    if (b.exemplo) return `<div class="ct-ex"><span class="ct-ex-t">${esc(b.exemplo.titulo || 'Exemplo')}</span><div class="ct-ex-b">${b.exemplo.linhas.map((l) => `<p>${md(l)}</p>`).join('')}</div></div>`;
    return '';
  }

  /* ---------- progresso do aluno ---------- */
  const testStores = {}; // modo de teste: guarda as respostas só enquanto a página está aberta
  function store(id, test) {
    const row = `cont-${id}`;
    if (test && testStores[id]) return testStores[id];
    if (test) { let st = { ans: {}, tried: [], read: [], hist: [], tent: 1, savedAt: 0 }; return testStores[id] = { get: () => st, save: () => {}, pull: async () => false, flush: () => {}, reset: () => { st = { ...st, ans: {}, hist: [], tent: 1, fechada: false }; } }; }
    const key = () => `hc:info:${auth?.user?.id || 'anon'}:${row}`;
    const online = () => auth?.user && typeof sb !== 'undefined' && sb;
    const blank = () => ({ ans: {}, tried: [], read: [], hist: [], tent: 1, savedAt: 0 });
    let st; try { st = { ...blank(), ...JSON.parse(localStorage.getItem(key()) || 'null') }; } catch { st = blank(); }
    let t = 0;
    // o banco não deixa tentativas, notas e respostas voltarem para trás (script 21): se ele guardou outro, é o que vale aqui
    const push = () => {
      clearTimeout(t); t = 0; if (!online()) return;
      const sent = st.savedAt;
      sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao: row, dados: st, updated_at: new Date().toISOString() }).select('dados').maybeSingle()
        .then(({ data, error }) => {
          if (error) return console.info('Conteúdo salvo só neste aparelho:', error.message);
          if (data?.dados && data.dados.savedAt !== sent && st.savedAt === sent) { st = { ...blank(), ...data.dados }; try { localStorage.setItem(key(), JSON.stringify(st)); } catch {} }
        });
    };
    const save = () => { st.savedAt = Date.now(); try { localStorage.setItem(key(), JSON.stringify(st)); } catch {} if (!t) t = setTimeout(push, 3000); };
    const pull = async () => {
      if (!online()) return false;
      const { data } = await sb.from('informatica_progresso').select('dados').eq('user_id', auth.user.id).eq('licao', row).maybeSingle();
      if (data?.dados && (data.dados.savedAt || 0) > st.savedAt) { st = { ...blank(), ...data.dados }; try { localStorage.setItem(key(), JSON.stringify(st)); } catch {} return true; }
      return false;
    };
    const flush = () => { if (t) push(); };
    return { get: () => st, save, pull, flush };
  }

  /* ---------- tela ----------
     O texto aparece uma parte (seção) por vez, com a trilha de partes no alto e os botões
     Anterior/Próxima embaixo. O questionário acompanha: mostra só as perguntas da parte aberta,
     e ao terminar as perguntas da parte ele oferece seguir para a próxima. */
  /* tempo limite de cada tentativa: aula 120 min, avaliação 5 h (o conteúdo pode mudar com "tempo" em minutos).
     O relógio começa quando a tentativa abre e corre mesmo com a aula fechada; ao zerar, a tentativa é enviada como está */
  const LIMITE = (C, exam) => (+C.tempo || (exam ? 300 : 120)) * 60000;
  const fmtT = (ms) => { const t = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, x = t % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`; };
  const fmtDur = (min) => (min <= 120 || min % 60 ? `${min} min` : `${min / 60} horas`); // aula: 120 min; avaliação: 5 horas
  const VERIFY_MS = 1300; // "Verificando resposta…" antes de mostrar se acertou
  /* avaliação da disciplina: { avaliacao: { aulas: [ids] } } vira 30 perguntas tiradas dos questionários das aulas,
     em 3 blocos de 10 (Aulas 01–03, 04–06, 07–09). A 1ª aula de cada bloco dá 4 perguntas e as outras duas, 3. */
  const two = (n) => String(n).padStart(2, '0');
  function buildExam(C) {
    const ids = C.avaliacao.aulas || [], P = [], Q = [];
    for (let b = 0; b * 3 < ids.length; b++) P.push({ id: `b${b + 1}`, titulo: `Aulas ${two(b * 3 + 1)} a ${two(Math.min(ids.length, b * 3 + 3))}`, blocos: [] });
    ids.forEach((aid, i) => {
      const A = window.HC_CONTEUDOS?.[aid]; if (!A?.perguntas?.length) return;
      const picks = i % 3 === 0 ? [0, 3, 6, 9] : i % 3 === 1 ? [1, 4, 8] : [2, 5, 7];
      picks.forEach((k) => { const q = A.perguntas[k % A.perguntas.length]; Q.push({ ...q, parte: P[Math.floor(i / 3)].id, de: `Aula ${two(i + 1)}: ${A.titulo}` }); });
    });
    return { ...C, partes: P, perguntas: Q, prova: true };
  }
  /* alternativas embaralhadas, sempre na mesma ordem para a mesma pergunta (a resposta certa não fica sempre na mesma letra) */
  const seeded = (str) => { let h = 2166136261; for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); h = h || 1; return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; }; };
  const mix = (q, key) => { const r = seeded(key), ix = q.op.map((_, k) => k); for (let k = ix.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [ix[k], ix[j]] = [ix[j], ix[k]]; } return { ...q, op: ix.map((k) => q.op[k]), certa: ix.indexOf(q.certa) }; };
  /* ANIMAÇÃO DE CARREGAMENTO ao abrir o material, o questionário ou a avaliação: uma folha sendo "escrita"
     (linhas surgindo), e no questionário um cartão de perguntas com as alternativas aparecendo; frases de status
     e uma barra que enche. Só dá a sensação de que as informações estão sendo buscadas: a tela já está pronta
     por baixo e aparece quando a animação termina (de 4 a 6 s, com a última frase parada no fim; mais curta com "menos movimento"). */
  const LOAD = {
    ler: { t: 'Abrindo o material', ms: 3200, steps: ['Buscando o texto da aula…', 'Organizando as partes…', 'Preparando as ilustrações…', 'Tudo pronto!'] },
    quiz: { t: 'Preparando o questionário', ms: 4000, steps: ['Buscando o texto da aula…', 'Separando as perguntas de cada parte…', 'Embaralhando as alternativas…', 'Tudo pronto. Boa sorte!'] },
    res: { t: 'Buscando o seu resultado', ms: 2800, steps: ['Conferindo as suas respostas…', 'Calculando a nota…', 'Pronto!'] },
    prova: { t: 'Montando a avaliação', ms: 4800, steps: ['Reunindo as aulas 01 a 09…', 'Sorteando as perguntas…', 'Embaralhando as alternativas…', 'Conferindo o tempo da prova…', 'Tudo pronto. Boa prova!'] },
  };
  function loader(kind, id, tint) {
    const L = LOAD[kind]; if (!L) return;
    if (document.querySelector('.cl-load:not(.out)')) return; // já está na tela (aberta no clique)
    // com "menos movimento" no aparelho fica mais curta; no modo leve continua igual (é uma tela só, leve)
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = calm ? 1400 : L.ms, HOLD = 1600; // HOLD: a última frase ("Tudo pronto. Boa sorte!") fica parada para dar tempo de ler
    const cor = window.HC_CAPAS_COR?.[id], a = cor?.[1] || `rgb(${tint || '56, 189, 248'})`, b = cor?.[2] || `color-mix(in srgb, rgb(${tint || '28, 64, 120'}) 55%, #000)`;
    const lines = (n) => Array.from({ length: n }, (_, i) => `<i style="--i:${i}"></i>`).join('');
    const el = document.createElement('div');
    el.className = `cl-load k-${kind}`; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
    el.style.cssText = `--a:${a};--b:${b};--ms:${ms}ms`;
    el.innerHTML = `
      <div class="cl-box">
        <div class="cl-stage" aria-hidden="true">
          <div class="cl-doc"><span class="cl-doc-h"></span><span class="cl-doc-img"></span><span class="cl-doc-l">${lines(6)}</span><span class="cl-scan"></span></div>
          ${kind === 'ler' ? '' : `<div class="cl-quiz"><span class="cl-quiz-q"></span>${[0, 1, 2].map((k) => `<span class="cl-opt" style="--k:${k}"><em></em><i></i></span>`).join('')}${kind === 'prova' ? '<b class="cl-quiz-n">30</b>' : ''}</div>`}
        </div>
        <b class="cl-title">${L.t}</b>
        <small class="cl-step">${L.steps[0]}</small>
        <div class="cl-bar"><i></i></div>
      </div>`;
    document.body.append(el); // já entra cobrindo tudo (sem esmaecer), para nada da aula aparecer antes
    const stepEl = el.querySelector('.cl-step');
    const timers = L.steps.slice(1).map((txt, k) => setTimeout(() => {
      stepEl.classList.remove('swap'); void stepEl.offsetWidth; stepEl.textContent = txt; stepEl.classList.add('swap');
    }, ((k + 1) * ms) / L.steps.length));
    const onHash = () => { if (!location.hash.startsWith(`#informatica/conteudo-${id}`)) done(); }; // saiu da aula no meio: some na hora
    const done = () => { timers.forEach(clearTimeout); el.classList.add('out'); setTimeout(() => el.remove(), 450); removeEventListener('hashchange', onHash); };
    // só sai quando a tela da aula (leitura ou questionário) já está montada por baixo; na internet lenta espera mais (até 10 s)
    const t0 = Date.now();
    const finish = () => { if (document.querySelector('#view > .ct:not(.cx-wrap)') || Date.now() - t0 > ms + 10000) done(); else timers.push(setTimeout(finish, 200)); };
    timers.push(setTimeout(finish, ms + HOLD));
    addEventListener('hashchange', onHash);
  }
  let cleanup = null;
  function open(view, C0, meta = {}) {
    cleanup?.();
    const C = C0.avaliacao ? buildExam(C0) : C0, exam = !!C.prova, nx = meta.next;
    const id = meta.id, test = !!meta.test, S = store(id, test), P = C.partes || [], PRICE = exam ? PRICE_PROVA : PRICE_AULA;
    const modo = meta.modo || 'intro', ler = modo === 'ler'; // pré-tela, leitura do material ou questionário
    const Q = (C.perguntas || []).map((q, i) => (C.embaralhar === false ? q : mix(q, `${id}:${q.q}`)));
    const PART = exam ? 'Bloco' : 'Parte', tagTxt = meta.rotulo ? `${meta.rotulo}${meta.disciplina ? ` · ${meta.disciplina}` : ''}` : (C.tag || 'Texto');
    /* carteira: a de verdade (Saldo HC) ou, no teste do administrador, uma fictícia */
    let fake = TEST_SALDO;
    const wallet = test ? { saldo: () => fake, spend: (n) => (fake >= n ? ((fake -= n), true) : false) }
      : { saldo: () => window.HC_cash?.get().saldo || 0, spend: (n) => !!window.HC_cash?.spend(n, `conteudo:${id}`) };
    const partIdx = Object.fromEntries(P.map((p, i) => [p.id, i]));
    const st = () => S.get();
    const qsOf = (pi) => Q.map((q, i) => (q.parte === P[pi].id ? i : -1)).filter((i) => i >= 0);
    /* avanço em ordem: só passa para a parte seguinte depois de responder todas as perguntas da parte atual.
       gateOf(n) devolve a primeira parte antes de n que ainda tem pergunta sem resposta (ou -1 se pode ir) */
    const gateOf = (n) => { if (ler || st().fechada) return -1; const a = st().ans; for (let k = 0; k < Math.min(n, P.length); k++) if (qsOf(k).some((i) => a[i] === undefined)) return k; return -1; };
    const maxPart = () => { if (ler || st().fechada) return P.length - 1; const g = gateOf(P.length); return g < 0 ? P.length - 1 : g; };
    const LIM = LIMITE(C, exam), LIMmin = LIM / 60000;
    const resta = () => (st().ini || Date.now()) + LIM - Date.now();
    const finished = () => !!st().fechada || Object.keys(st().ans).length === Q.length;
    if (modo === 'intro') {
      // a pré-tela agora mora na página da disciplina (a aula se expande embaixo da fileira): quem chega aqui
      // sem escolher ler ou responder (endereço direto, "Ir para o questionário", fim da leitura, testar) vai para lá com a aula aberta
      if (!meta.embed && /^#informatica\/disciplina-/.test(meta.back || '')) {
        cleanup?.(); window.HC_aulaOpen = { id, test }; location.hash = meta.back; return;
      }
      return intro();
    }
    let part = Math.max(0, Math.min(P.length - 1, +st().part || 0)); // parte aberta (volta onde parou)
    let cur = -1, showResult = false, checking = null; // pergunta aberta; resultado geral; resposta em verificação {q, k}

    view.innerHTML = `
    <div class="ct${test ? ' testing' : ''}${exam ? ' exam' : ''}${ler ? ' reading' : ''}" style="--tint:${meta.tint || '28, 64, 120'}">
      <div class="ct-readbar" aria-hidden="true"><i></i></div>
      ${ler ? `<div class="ct-readmode"><span class="ct-readmode-ico">${svg('book')}</span><div><b>Lendo o material</b><small>Estude à vontade: aqui não tem tempo nem perguntas.</small></div>
        <button type="button" class="ct-tb-btn dark" data-intro>${finishedTxt()}</button></div>` : ''}
      ${test ? `<div class="ct-testbar"><span class="ct-testbar-ico">${svg('flask')}</span><div><b>Modo de teste</b><small>Nada é salvo e o saldo é fictício (${fmtC(TEST_SALDO)}).</small></div>
        <button type="button" class="ct-tb-btn" data-fill>Responder tudo</button><button type="button" class="ct-tb-btn dark" data-exittest>Sair do teste</button></div>` : ''}
      <div class="ct-grid">
        <article class="ct-doc">
          <div class="ct-top">
            <button class="ct-back" type="button">${svg('back')} ${esc(meta.backLabel || 'Disciplinas')}</button>
            <span class="ct-top-t">${esc(C.titulo)}</span>
            ${meta.admin && !test ? `<button class="ct-testbtn" type="button" data-test>${svg('flask')} Testar como aluno</button>` : ''}
          </div>
          <header class="ct-head">
            ${meta.image ? `<div class="ct-cover"><img src="${esc(meta.image)}" alt=""></div>` : ''}
            <span class="ct-tag">${esc(tagTxt)}</span>
            <h1>${esc(C.titulo)}</h1>
            <p class="ct-sub">${esc(C.subtitulo || '')}</p>
            <div class="ct-meta">
              ${exam ? `<span class="ct-meta-lim">${svg('timer')} ${fmtDur(LIMmin)} para concluir</span><span>${svg('quiz')} ${Q.length} perguntas</span><span>${svg('list')} ${P.length} blocos</span><span>${svg('check')} nota mínima 7</span>`
                : `<span class="ct-meta-lim">${svg('timer')} ${fmtDur(LIMmin)} para concluir</span><span>${svg('clock')} ${C.leitura || 10} min de leitura</span><span>${svg('list')} ${P.length} partes</span><span>${svg('quiz')} ${Q.length} perguntas</span>`}
            </div>
            ${exam ? `<div class="ct-examinfo">${svg('info')}<p>Sem o material: responda com o que aprendeu nas aulas. Cada pergunta mostra de qual aula ela veio. Com <b>nota 7 ou mais</b>, você conclui a disciplina.</p></div>` : ''}
            <nav class="ct-toc" aria-label="Partes do texto">
              <div class="ct-toc-top"><b>Nesta leitura</b><small class="ct-toc-n"></small></div>
              <ol>${P.map((p, i) => `<li><a href="#" data-part="${i}"><span class="ct-toc-num">${i + 1}</span><span class="ct-toc-t">${esc(p.titulo)}</span><span class="ct-toc-ok">${svg('check')}</span></a></li>`).join('')}</ol>
            </nav>
          </header>
          <nav class="ct-steps" aria-label="Navegar entre as partes">
            <div class="ct-steps-txt"><b class="ct-steps-n"></b><span class="ct-steps-t"></span></div>
            <div class="ct-steps-bar">${P.map((p, i) => `<button type="button" class="ct-step" data-part="${i}" aria-label="Parte ${i + 1}: ${esc(p.titulo)}" title="${i + 1}. ${esc(p.titulo)}"><i></i></button>`).join('')}</div>
          </nav>
          <div class="ct-parts">${P.map((p, i) => `
            <section class="ct-part" id="ct-${p.id}" data-pi="${i}" hidden>
              <span class="ct-num">${PART} ${i + 1} de ${P.length}</span>
              <h2>${esc(p.titulo)}</h2>
              ${p.blocos.map(block).join('')}
              ${i === P.length - 1 ? `<footer class="ct-foot"><span class="ct-foot-ico">${svg('check')}</span><b>Fim da leitura</b><p>${nx ? `Agora é com você: termine o questionário. Com nota 7 ou mais, a ${esc(nx.nome)} é liberada.` : 'Agora é com você: termine o questionário para receber a sua nota.'}</p></footer>` : ''}
              <i class="ct-mark" data-mark="${p.id}"></i>
            </section>`).join('')}
          </div>
          <div class="ct-pager">
            <button type="button" class="ct-pg prev" data-pstep="-1"><small>${svg('back')} Anterior</small><b></b></button>
            <button type="button" class="ct-pg next" data-pstep="1"><small>Próxima ${svg('next')}</small><b></b></button>
          </div>
        </article>
        <aside class="ct-quiz" aria-label="Questionário">
          <div class="ctq">
            <div class="ctq-grab" aria-hidden="true"></div>
            <div class="ctq-head">
              <div class="ctq-ring" title="Perguntas respondidas no conteúdo todo"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="ctq-ring-v" cx="22" cy="22" r="19"/></svg><b class="ctq-ring-n"></b></div>
              <div class="ctq-ht"><small>${exam ? 'Avaliação' : 'Questionário'}</small><b class="ctq-pt"></b><span class="ctq-sum"></span></div>
              <button class="ctq-close" type="button" aria-label="Fechar o questionário">${svg('x')}</button>
            </div>
            <div class="ct-clock" role="timer" aria-live="off">${svg('timer')}<span>Tempo restante</span><b class="ct-clk">${fmtT(LIM)}</b><i class="ct-clock-bar"><i></i></i></div>
            <div class="ctq-dots" role="tablist" aria-label="Perguntas desta parte"></div>
            <div class="ctq-body" aria-live="polite"></div>
          </div>
        </aside>
      </div>
      <button class="ct-fab" type="button" data-openq>${svg('quiz')}<span>Perguntas<small class="ct-fab-clk ct-clk"></small></span><b class="ct-fab-n"></b></button>
      <div class="ct-scrim"></div>
    </div>`;

    const root = view.querySelector('.ct'), body = root.querySelector('.ctq-body'), dots = root.querySelector('.ctq-dots');
    const mob = () => matchMedia('(max-width: 1023px)').matches;
    const setSheet = (on) => { if (exam) return; root.classList.toggle('q-open', on); document.documentElement.classList.toggle('ct-lock', on && mob()); };
    const toTop = (el, smooth = true) => {
      const bar = document.querySelector('.topbar-wrap, .topbar'), off = (bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0) + 16;
      const y = el.getBoundingClientRect().top + scrollY - off;
      if (Math.abs(y - scrollY) > 4 && (y < scrollY || el.getBoundingClientRect().top > innerHeight * .5)) window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' });
    };

    function finishedTxt() { return exam ? 'Ir para a avaliação' : 'Ir para o questionário'; }
    /* ---- pré-tela: explica o questionário (perguntas, tempo, regras) antes de começar ---- */
    function intro() {
      const s0 = st(), h = s0.hist || [], best = h.length ? Math.max(...h.map((x) => x.nota)) : null;
      const inProg = !s0.fechada && !!s0.ini, left = inProg ? s0.ini + LIM - Date.now() : LIM, esgot = inProg && left <= 0;
      const lidas = (s0.read || []).length, resp = Object.keys(s0.ans || {}).length;
      const go = s0.fechada ? (exam ? 'Ver resultado da avaliação' : 'Ver resultado do questionário') : esgot ? 'Ver a nota' : inProg ? (exam ? 'Continuar avaliação' : 'Continuar questionário') : (exam ? 'Iniciar avaliação' : 'Iniciar questionário');
      const fmtLeft = (ms) => { const m = Math.max(0, Math.ceil(ms / 60000)); return m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}min` : ''}` : `${m} min`; };
      /* cores da aula (as mesmas da capa); sem capa, a cor da disciplina */
      const cor = window.HC_CAPAS_COR?.[id], tint = cor?.[0] || meta.tint || '28, 64, 120';
      const cvars = cor ? `--tint:${tint};--a:${cor[1]};--b:${cor[2]}` : `--tint:${tint};--a:rgb(${tint});--b:color-mix(in srgb, rgb(${tint}) 55%, #000)`;
      /* o caminho da aula: cada parte (ou bloco) com quantas perguntas tem e como o aluno está nela */
      const ans = s0.ans || {}, read = s0.read || [];
      const steps = P.map((pt, k) => {
        const qs = qsOf(k), feitas = qs.filter((i) => ans[i] !== undefined).length;
        const lida = read.includes(pt.id);
        const est = s0.fechada || (qs.length && feitas === qs.length) ? 'ok' : feitas || lida ? 'meio' : '';
        return `<li class="cx-step ${est}" style="--k:${k}">
            <span class="cx-step-n">${est === 'ok' ? svg('check') : String(k + 1).padStart(2, '0')}</span>
            <div class="cx-step-t"><b>${esc(pt.titulo || `${PART} ${k + 1}`)}</b>
              <small>${qs.length ? `${qs.length} ${qs.length === 1 ? 'pergunta' : 'perguntas'}` : 'Só leitura'}${!exam && lida ? ' · lida' : ''}${feitas && !s0.fechada && feitas < qs.length ? ` · ${feitas} de ${qs.length} respondidas` : ''}</small></div>
          </li>`;
      }).join('');
      const pRead = P.length ? Math.round((exam ? 0 : lidas / P.length) * 100) : 0, pResp = Q.length ? Math.round((resp / Q.length) * 100) : 0;
      const sit = s0.fechada
        ? { t: best >= PASS ? 'ok' : 'rec', ico: best >= PASS ? 'check' : 'warn', b: best >= PASS ? `Aprovado · nota ${fmtN(best)}` : `Recuperação · nota ${fmtN(best)}`,
          s: best >= PASS ? (exam ? 'Você concluiu a disciplina. Pode rever o resultado quando quiser.' : 'Você já passou nesta aula. Pode rever o material e o resultado quando quiser.') : `Abaixo de 7. Revise o material e faça uma nova tentativa (${fmtC(PRICE)} do Saldo HC).` }
        : esgot ? { t: 'rec', ico: 'timer', b: 'O tempo acabou', s: `O questionário será enviado com as ${resp} ${resp === 1 ? 'resposta' : 'respostas'} que você deu.` }
        : inProg ? { t: 'run', ico: 'timer', b: `Em andamento · resta ${fmtLeft(left)}`, s: `${resp} de ${Q.length} perguntas respondidas. O tempo continua correndo.` }
        : { t: 'new', ico: 'bulb', b: exam ? 'Pronto para a avaliação?' : 'Pronto para começar?', s: exam ? 'Revise as aulas antes: na avaliação o material fica fechado.' : `Leia com calma (uns ${C.leitura || 10} min) e responda as perguntas de cada parte.` };
      const RULES = [
        ['timer', `${fmtDur(LIMmin)} de prova`, `O tempo começa em <b>${exam ? 'Iniciar avaliação' : 'Iniciar questionário'}</b> e corre mesmo fora da página.`],
        ['lockc', 'Em ordem', exam ? 'Responda um bloco para abrir o próximo.' : 'Responda as perguntas de uma parte para abrir a próxima.'],
        ['warn', 'Se o tempo acabar', 'Envia o que você respondeu; em branco conta como errada.'],
        ['coin', 'Nota 7 para passar', `Nova tentativa: <b>${fmtC(PRICE)}</b> do Saldo HC. Vale a maior nota.`],
        exam ? ['book', 'Sem material', 'As perguntas vêm das Aulas 01 a 09.'] : ['book', 'Material sempre aberto', 'Em <b>Ler material</b>, sem tempo, antes e depois.'],
      ];
      view.innerHTML = `
      <div class="ct cx-wrap${meta.embed ? ' cx-embed' : ''}${test ? ' testing' : ''}${exam ? ' exam' : ''}" style="${cvars}">
        ${test ? `<div class="ct-testbar"><span class="ct-testbar-ico">${svg('flask')}</span><div><b>Modo de teste</b><small>Nada é salvo e o saldo é fictício (${fmtC(TEST_SALDO)}).</small></div>
          <button type="button" class="ct-tb-btn dark" data-exittest>Sair do teste</button></div>` : ''}
        <div class="cx-slide">
        <div class="cx-scroller${meta.card ? ' has-card' : ''}">
        <div class="cx-track">
        ${meta.card ? `<div class="cx-card">${meta.card}</div>` : ''}
        <section class="cx">
          <div class="cx-top">
            ${meta.embed ? `<span class="cx-embed-tag">${svg('book')} Sobre esta aula</span>` : `<button class="ct-back cx-back" type="button">${svg('back')} ${esc(meta.backLabel || 'Disciplinas')}</button>`}
            ${meta.admin && !test ? `<button class="ct-testbtn cx-testbtn" type="button" data-test>${svg('flask')} Testar como aluno</button>` : ''}
          </div>
          <div class="cx-main">
            <div class="cx-intro">
              <div class="cx-head">
                <div class="cx-head-t">
                  <span class="cx-tag">${esc(tagTxt)}</span>
                  <h1>${esc(C.titulo)}</h1>
                  ${C.subtitulo ? `<p class="cx-sub">${esc(C.subtitulo)}</p>` : ''}
                </div>
              </div>
              <div class="cx-chips">
                <span>${svg('quiz')}<b>${Q.length}</b> perguntas</span>
                <span>${svg('timer')}<b>${fmtDur(LIMmin)}</b> para responder</span>
                ${exam ? '' : `<span>${svg('clock')}<b>${C.leitura || 10} min</b> de leitura</span>`}
                <span>${svg('check')}nota <b>7</b> para passar</span>
              </div>
              <div class="cx-sit ${sit.t}">
                <span class="cx-sit-ico">${svg(sit.ico)}</span>
                <div class="cx-sit-t"><b>${sit.b}</b><small>${sit.s}</small></div>
                ${h.length ? `<div class="cx-tries" title="Suas tentativas">${h.map((x, i) => `<span class="${x.nota >= PASS ? 'ok' : 'bad'}"><small>${i + 1}ª</small>${fmtN(x.nota)}</span>`).join('')}</div>` : ''}
              </div>
              <div class="cx-bars">
                ${exam ? '' : `<div><span>Leitura</span><b>${lidas} de ${P.length} partes</b><i style="--p:${pRead}%"></i></div>`}
                <div><span>Perguntas</span><b>${s0.fechada ? `${h[h.length - 1]?.ok ?? resp} de ${Q.length} certas` : `${resp} de ${Q.length} respondidas`}</b><i style="--p:${s0.fechada ? Math.round(((h[h.length - 1]?.ok ?? resp) / Math.max(1, Q.length)) * 100) : pResp}%"></i></div>
              </div>
              <div class="cx-acts">
                <button type="button" class="cx-btn" data-modo="quiz">${go} ${svg('next')}</button>
                ${exam ? '' : `<button type="button" class="cx-btn soft" data-modo="ler">${svg('book')} Ler material</button>`}
              </div>
            </div>
            <aside class="cx-path">
              <div class="cx-path-h"><b>O que você vai encontrar</b><small>${P.length} ${exam ? (P.length === 1 ? 'bloco' : 'blocos') : (P.length === 1 ? 'parte' : 'partes')} · ${Q.length} perguntas</small></div>
              <ol class="cx-steps">${steps}</ol>
              ${!exam && nx ? `<div class="cx-next">${svg('lock')}<span>Com nota 7 você libera a <b>${esc(nx.nome)}</b>: ${esc(nx.titulo)}</span></div>` : ''}
            </aside>
          </div>
          <div class="cx-rules-h">Como funciona</div>
          <ul class="cx-rules">
            ${RULES.map(([ic, t, d], i) => `<li style="--i:${i}"><div class="cx-rule-top"><span class="cx-rule-ico">${svg(ic)}</span><em>${String(i + 1).padStart(2, '0')}</em></div><b>${t}</b><small>${d}</small></li>`).join('')}
          </ul>
        </section>
        </div>
        </div>
        <div class="cx-nav" hidden>
          <button type="button" class="cx-nav-btn" data-nav="-1" aria-label="Voltar para a esquerda">${svg('back')}</button>
          <input type="range" class="cx-range" min="0" max="1000" value="0" step="1" aria-label="Deslizar a tela para os lados">
          <button type="button" class="cx-nav-btn nx" data-nav="1" aria-label="Ir para a direita">${svg('next')}</button>
        </div>
        </div>
      </div>`;
      const w = view.querySelector('.cx-wrap');
      /* card da aula ao lado (o mesmo da página da disciplina): sem os botões de administrador; tocar nele faz o mesmo que o botão principal */
      const card = w.querySelector('.cx-card .pf-ccard');
      if (card) {
        card.querySelectorAll('.pf-adm').forEach((x) => x.remove());
        card.removeAttribute('tabindex'); card.setAttribute('role', 'presentation');
        card.addEventListener('click', () => w.querySelector('.cx-btn[data-modo="quiz"]')?.click());
      }
      /* se o card e a pré-tela não cabem lado a lado, a faixa desliza: arrastando com o mouse, pelas setas ou pelo controle deslizante */
      const sc = w.querySelector('.cx-scroller'), nav = w.querySelector('.cx-nav'), rg = nav.querySelector('.cx-range');
      const maxX = () => sc.scrollWidth - sc.clientWidth;
      const navUpd = () => {
        if (!sc.isConnected) return removeEventListener('resize', navUpd);
        const m = maxX(); nav.hidden = m < 8; sc.classList.toggle('can-drag', m >= 8);
        rg.value = m > 0 ? Math.round((sc.scrollLeft / m) * 1000) : 0;
        rg.style.setProperty('--v', `${rg.value / 10}%`);
        nav.querySelector('[data-nav="-1"]').disabled = sc.scrollLeft < 4;
        nav.querySelector('[data-nav="1"]').disabled = sc.scrollLeft > m - 4;
      };
      sc.addEventListener('scroll', navUpd, { passive: true });
      addEventListener('resize', navUpd, { passive: true });
      rg.addEventListener('input', () => { sc.scrollLeft = (rg.value / 1000) * maxX(); });
      nav.addEventListener('click', (e) => { const b = e.target.closest('[data-nav]'); if (b) sc.scrollBy({ left: +b.dataset.nav * sc.clientWidth * .6, behavior: 'smooth' }); });
      let drag = null;
      sc.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button !== 0 || maxX() < 8 || e.target.closest('button, a, input')) return; drag = { x: e.clientX, l: sc.scrollLeft, moved: false }; });
      // os ouvintes da janela saem sozinhos quando a pré-tela sai da página (não se acumulam)
      const onMove = (e) => {
        if (!sc.isConnected) return removeEventListener('pointermove', onMove);
        if (!drag) return; const dx = e.clientX - drag.x;
        if (!drag.moved && Math.abs(dx) < 6) return;
        drag.moved = true; sc.classList.add('dragging'); sc.scrollLeft = drag.l - dx;
      };
      const eat = (e) => { e.stopPropagation(); e.preventDefault(); }; // o clique que termina o arrasto não abre nada
      const onUp = () => {
        if (!sc.isConnected) return removeEventListener('pointerup', onUp);
        if (!drag) return; const was = drag.moved; drag = null; sc.classList.remove('dragging');
        if (was) { sc.addEventListener('click', eat, { capture: true, once: true }); setTimeout(() => sc.removeEventListener('click', eat, { capture: true }), 0); }
      };
      addEventListener('pointermove', onMove); addEventListener('pointerup', onUp);
      requestAnimationFrame(navUpd);
      w.addEventListener('click', (e) => {
        const t = e.target.closest('button'); if (!t) return;
        if (t.classList.contains('ct-back')) { location.hash = meta.back || '#informatica/cursos'; return; }
        if (t.hasAttribute('data-test')) { delete testStores[id]; return open(view, C0, { ...meta, test: true, modo: 'intro' }); }
        if (t.hasAttribute('data-exittest')) { delete testStores[id]; return open(view, C0, { ...meta, test: false, modo: 'intro' }); }
        if (t.dataset.modo) {
          loader(t.dataset.modo === 'ler' ? 'ler' : s0.fechada ? 'res' : exam ? 'prova' : 'quiz', id, meta.tint);
          window.scrollTo(0, 0);
          // aberta dentro da página da disciplina: vai para a tela da aula já no modo escolhido (plataforma.js lê HC_conteudoGo)
          if (meta.embed) { window.HC_conteudoGo = { id, modo: t.dataset.modo, verRes: !!s0.fechada, test }; location.hash = `#informatica/conteudo-${id}`; return; }
          return open(view, C0, { ...meta, modo: t.dataset.modo, verRes: !!s0.fechada, loading: true });
        }
      });
      if (!meta.embed) window.scrollTo(0, 0);
      S.pull().then((changed) => { if (changed && w.isConnected) intro(); });
    }
    /* aviso quando tenta pular uma parte sem responder: aparece embaixo, com o atalho para as perguntas */
    let gateT = 0;
    const gateNote = (k) => {
      const a = st().ans, falta = qsOf(k).filter((i) => a[i] === undefined).length;
      let el = root.querySelector('.ct-gate');
      if (!el) { el = document.createElement('div'); el.className = 'ct-gate'; el.setAttribute('role', 'status'); root.append(el); }
      el.innerHTML = `<span class="ct-gate-ico">${svg('lockc')}</span>
        <div class="ct-gate-t"><b>Responda para continuar</b><small>${falta === 1 ? 'Falta 1 pergunta' : `Faltam ${falta} perguntas`} ${exam ? 'do bloco' : 'da parte'} ${k + 1}: ${esc(P[k].titulo)}</small></div>
        <button type="button" class="ct-gate-go" data-gatego="${k}">Responder</button>`;
      el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
      clearTimeout(gateT); gateT = setTimeout(() => el.classList.remove('in'), 5200);
    };
    /* ir para uma parte pelo aluno (botões, trilha, sumário, setas): respeita a ordem */
    const goPart = (n, opt) => {
      const g = gateOf(n);
      if (g >= 0 && n > g) { gateNote(g); if (g !== part) showPart(g, opt); return false; }
      showPart(n, opt); return true;
    };

    /* ---- texto: mostra uma parte ---- */
    const showPart = (i, { scroll = true, syncQ = true } = {}) => {
      part = Math.max(0, Math.min(P.length - 1, i));
      root.querySelectorAll('.ct-part').forEach((s) => { s.hidden = +s.dataset.pi !== part; });
      root.classList.toggle('first', part === 0);
      const sec = root.querySelector(`.ct-part[data-pi="${part}"]`);
      sec.classList.remove('enter'); void sec.offsetWidth; sec.classList.add('enter');
      root.querySelector('.ct-steps-n').textContent = `${PART} ${part + 1} de ${P.length}`;
      root.querySelector('.ct-steps-t').textContent = P[part].titulo;
      const [pv, nxb] = root.querySelectorAll('.ct-pg');
      pv.hidden = part === 0; pv.querySelector('b').textContent = P[part - 1]?.titulo || '';
      const nb = nxb; // botão "Próxima" do rodapé do texto
      nb.classList.toggle('last', part === P.length - 1);
      nb.querySelector('small').innerHTML = part === P.length - 1 ? `Concluir ${svg('check')}` : `Próxima ${svg('next')}`;
      nb.querySelector('b').textContent = part === P.length - 1 ? (ler ? 'Fim do material' : 'Ver o resultado do questionário') : P[part + 1].titulo;
      if (ler && part === P.length - 1) nb.querySelector('small').innerHTML = `${finishedTxt()} ${svg('next')}`;
      root.querySelector('.ct-gate')?.classList.remove('in');
      const s = st(); if (s.part !== part) { s.part = part; S.save(); }
      const mk = sec.querySelector('[data-mark]'); if (!s.read.includes(mk.dataset.mark)) io.observe(mk);
      if (syncQ) { showResult = false; const qs = qsOf(part); cur = qs.find((k) => s.ans[k] === undefined) ?? qs[0] ?? -1; }
      paint(); drawQ();
      if (scroll) toTop(exam ? root.querySelector('.ct-quiz') : part === 0 ? root.querySelector('.ct-doc') : root.querySelector('.ct-steps'));
      onScroll();
    };

    /* ---- placar, bolinhas da parte, sumário e trilha ---- */
    const paint = () => {
      const a = st().ans, n = Q.length, done = Object.keys(a).length, ok = Q.filter((q, i) => a[i] === q.certa).length, qs = qsOf(part);
      root.querySelector('.ctq-ring-n').textContent = `${done}/${n}`;
      root.querySelector('.ctq-ring-v').style.strokeDasharray = `${(done / n) * 119.4} 200`;
      root.querySelector('.ctq-pt').textContent = `${PART} ${part + 1}: ${P[part].titulo}`;
      const best = bestNota();
      root.querySelector('.ctq-sum').textContent = `${qs.length ? `${qs.length} ${qs.length === 1 ? 'pergunta' : 'perguntas'} ${exam ? 'neste bloco' : 'nesta parte'} · ` : ''}${best !== null ? `Nota ${fmtN(best)}` : `Tentativa ${st().tent || 1} · nota de 0 a 10`}`;
      const pend = qs.filter((k) => a[k] === undefined).length;
      root.querySelector('.ct-fab-n').textContent = qs.length ? (pend ? `${qs.length - pend}/${qs.length}` : '✓') : `${done}/${n}`;
      dots.hidden = !qs.length || showResult;
      dots.innerHTML = qs.map((i, j) => { const s = a[i] === undefined ? '' : a[i] === Q[i].certa ? ' ok' : ' bad'; return `<button type="button" role="tab" class="ctq-dot${s}${i === cur ? ' cur' : ''}" data-q="${i}" aria-selected="${i === cur}" aria-label="Pergunta ${j + 1} desta parte">${j + 1}</button>`; }).join('');
      const read = st().read;
      const lim = maxPart(), nxb = root.querySelector('.ct-pg.next');
      root.querySelectorAll('.ct-toc a').forEach((x) => { x.classList.toggle('read', read.includes(P[+x.dataset.part].id)); x.classList.toggle('locked', +x.dataset.part > lim); });
      const trava = part < P.length - 1 && part + 1 > lim;
      nxb.classList.toggle('locked', trava);
      if (part < P.length - 1) nxb.querySelector('small').innerHTML = trava ? `${svg('lockc')} Responda ${exam ? 'o bloco' : 'as perguntas'} para avançar` : `Próxima ${svg('next')}`;
      root.querySelector('.ct-toc-n').textContent = `${read.length} de ${P.length} lidas`;
      root.querySelectorAll('.ct-step').forEach((b, i) => {
        const pq = qsOf(i), allA = pq.length && pq.every((k) => a[k] !== undefined);
        b.classList.toggle('cur', i === part); b.classList.toggle('read', read.includes(P[i].id)); b.classList.toggle('qdone', !!allA); b.classList.toggle('locked', i > lim);
        b.setAttribute('aria-current', i === part ? 'step' : 'false');
      });
    };

    /* ---- questionário ---- */
    const drawQ = () => {
      const a = st().ans, allDone = finished(), closed = !!st().fechada;
      if (showResult) return drawResult();
      const qs = qsOf(part);
      if (cur < 0 || !qs.includes(cur)) return drawNone(allDone);
      const q = Q[cur], j = qs.indexOf(cur), ans = a[cur], answered = ans !== undefined, chk = checking?.q === cur ? checking.k : null;
      const secDone = qs.every((k) => a[k] !== undefined), lastQ = j === qs.length - 1;
      const nextBtn = allDone ? `<button type="button" class="ctq-btn" data-result>Ver resultado</button>`
        : answered && (lastQ || secDone) && part < P.length - 1 ? `<button type="button" class="ctq-btn" data-pstep="1">${exam ? 'Próximo bloco' : 'Próxima parte'} ${svg('next')}</button>`
        : `<button type="button" class="ctq-btn${answered ? '' : ' soft'}" data-step="1"${lastQ ? ' disabled' : ''}>${answered ? 'Próxima' : 'Pular'} ${svg('next')}</button>`;
      body.innerHTML = `
        <div class="ctq-card">
          <span class="ctq-where">Pergunta ${j + 1} de ${qs.length} ${exam ? 'deste bloco' : 'desta parte'}${q.de ? `<em class="ctq-de">${esc(q.de)}</em>` : ''}</span>
          <h3>${md(q.q)}</h3>
          <div class="ctq-ops">${q.op.map((o, k) => {
            const s = chk !== null ? (k === chk ? ' checking' : ' dim') : !answered ? (closed ? (k === q.certa ? ' right' : ' dim') : '') : k === q.certa ? ' right' : k === ans ? ' wrong' : ' dim';
            return `<button type="button" class="ctq-op${s}" data-op="${k}"${answered || closed || chk !== null ? ' disabled' : ''}><span class="ctq-l">${chk === k ? '<i class="ctq-spin"></i>' : 'ABCDEF'[k]}</span><span class="ctq-t">${md(o)}</span>${answered && (k === q.certa || k === ans) ? `<span class="ctq-st">${svg(k === q.certa ? 'check' : 'x')}</span>` : ''}</button>`;
          }).join('')}</div>
          ${chk !== null ? `<div class="ctq-fb wait"><b><i class="ctq-dots3"><i></i><i></i><i></i></i> Verificando resposta…</b><span class="ctq-wbar"><i style="animation-duration:${VERIFY_MS}ms"></i></span></div>` : ''}
          ${answered || closed ? `<div class="ctq-fb ${ans === q.certa ? 'ok' : 'bad'}">
            <b>${!answered ? 'Sem resposta: o tempo acabou.' : ans === q.certa ? 'Resposta certa!' : 'Não foi dessa vez.'}</b>
            <p>${md(q.exp)}</p>
            ${exam ? '' : `<button type="button" class="ctq-link" data-seetext>${svg('eye')} Ver no texto</button>`}
          </div>` : ''}
          <div class="ctq-nav">
            <button type="button" class="ctq-btn soft" data-step="-1"${j === 0 ? ' disabled' : ''}>Anterior</button>
            ${nextBtn}
          </div>
        </div>`;
    };
    /* parte sem perguntas (o resumo, por exemplo): mostra o que falta no conteúdo todo */
    const drawNone = (allDone) => {
      allDone = allDone || finished();
      const a = st().ans;
      const miss = P.map((p, i) => ({ i, p, n: qsOf(i).filter((k) => a[k] === undefined).length })).filter((x) => x.n);
      body.innerHTML = `
        <div class="ctq-card ctq-none">
          <span class="ctq-none-ico">${svg(allDone ? 'check' : 'list')}</span>
          <h3>${allDone ? 'Questionário completo!' : `Est${exam ? 'e bloco' : 'a parte'} não tem perguntas`}</h3>
          <p>${allDone ? 'Você respondeu todas as perguntas. Veja como foi.' : miss.length ? 'Ainda faltam perguntas nestas partes:' : ''}</p>
          ${!allDone ? `<div class="ctq-miss">${miss.map((x) => `<button type="button" class="ctq-missi" data-part="${x.i}"><span>${x.i + 1}</span><b>${esc(x.p.titulo)}</b><small>${x.n} ${x.n === 1 ? 'pergunta' : 'perguntas'}</small>${svg('next')}</button>`).join('')}</div>` : ''}
          ${allDone ? '<div class="ctq-nav"><button type="button" class="ctq-btn" data-result>Ver resultado</button></div>' : ''}
        </div>`;
    };
    const bestNota = () => { const h = st().hist || []; return h.length ? Math.max(...h.map((x) => x.nota)) : null; };
    const drawResult = () => {
      const s0 = st(), a = s0.ans, ok = Q.filter((q, i) => a[i] === q.certa).length, n = nota(ok, Q.length), pass = n >= PASS;
      const best = bestNota() ?? n, hist = s0.hist || [];
      const wrong = Q.map((q, i) => (a[i] !== q.certa ? i : -1)).filter((i) => i >= 0);
      dots.hidden = true;
      body.innerHTML = `
        <div class="ctq-card ctq-res ${pass ? 'pass' : 'rec'}">
          <div class="ctq-big" style="--p:${n * 10}"><b>${fmtN(n)}</b><small>de 10</small></div>
          <span class="ctq-badge">${pass ? `${svg('check')} Aprovado` : `${svg('warn')} Recuperação`}</span>
          ${hist[hist.length - 1]?.tempo ? `<p class="ctq-tout">${svg('timer')} O tempo acabou: as perguntas sem resposta contaram como erradas.</p>` : ''}
          <h3>${pass ? (n >= 9 ? 'Excelente!' : 'Muito bem!') : 'Ainda não foi desta vez'}</h3>
          <p>${pass ? (exam ? 'Você atingiu a nota mínima (7) e concluiu a disciplina. Parabéns!' : nx ? `Você atingiu a nota mínima (7). A ${esc(nx.nome)} foi liberada.` : 'Você atingiu a nota mínima (7).')
            : `A nota mínima é 7. ${exam ? 'Revise as aulas das perguntas indicadas' : 'Releia as partes indicadas'} e, quando estiver pronto, libere uma nova tentativa com ${fmtC(PRICE)} do Saldo HC.`}</p>
          ${pass && nx && !test ? `<button type="button" class="ctq-btn ctq-nextaula" data-nextaula>${esc(nx.nome)}: ${esc(nx.titulo)} ${svg('next')}</button>` : ''}
          ${pass && exam ? `<button type="button" class="ctq-btn ctq-nextaula" data-back>Voltar para a disciplina ${svg('next')}</button>` : ''}
          <div class="ctq-stats"><span><b>${ok}/${Q.length}</b><small>acertos</small></span><span><b>${hist.length > 1 ? fmtN(best) : `${s0.tent || 1}ª`}</b><small>${hist.length > 1 ? 'maior nota (vale esta)' : 'tentativa'}</small></span></div>
          ${hist.length > 1 ? `<div class="ctq-hist"><small>Tentativas</small>${hist.map((h, i) => `<span class="${h.nota >= PASS ? 'ok' : 'bad'}"><b>${i + 1}ª</b>${fmtN(h.nota)}</span>`).join('')}</div>` : ''}
          ${wrong.length ? `<div class="ctq-rev"><small>Para revisar</small>${wrong.map((i) => `<button type="button" class="ctq-revi" data-q="${i}"><span>${partIdx[Q[i].parte] + 1}</span>${md(Q[i].q)}</button>`).join('')}</div>` : ''}
          <div class="ctq-nav"><button type="button" class="ctq-btn soft" data-q="${qsOf(part)[0] ?? 0}">Revisar</button><button type="button" class="ctq-btn ${pass ? 'soft' : 'buy'}" data-redo>Nova tentativa <span class="ctq-price"><img src="${COIN}" alt="">${fmtC(PRICE)}</span></button></div>
          <small class="ctq-note">${test ? 'Modo de teste: as moedas gastas aqui são fictícias.' : 'Cada nova tentativa custa ' + fmtC(PRICE) + ' do Saldo HC.'}</small>
        </div>`;
    };
    /* fecha a tentativa quando todas as perguntas foram respondidas: guarda a nota */
    const closeAttempt = (tempo = false) => {
      const s0 = st(); if (s0.fechada || (!tempo && Object.keys(s0.ans).length < Q.length)) return;
      const ok = Q.filter((q, i) => s0.ans[i] === q.certa).length;
      s0.hist = [...(s0.hist || []), { nota: nota(ok, Q.length), ok, em: Date.now(), ...(tempo ? { tempo: true } : {}) }]; s0.fechada = true; S.save();
    };
    /* relógio da tentativa: começa ao abrir; com 10 e 1 minuto avisa; ao zerar, envia o que foi respondido */
    let clockT = 0, avisou = 0;
    const startClock = () => { const s0 = st(); if (!s0.fechada && !s0.ini) { s0.ini = Date.now(); S.save(); } };
    const tick = () => {
      if (!root.isConnected) return clearInterval(clockT);
      const s0 = st(), left = resta(), box = root.querySelector('.ct-clock');
      root.classList.toggle('timed-out', !!s0.fechada);
      if (s0.fechada) { box.hidden = true; root.querySelectorAll('.ct-fab-clk').forEach((x) => { x.textContent = ''; }); return; }
      box.hidden = false;
      root.querySelectorAll('.ct-clk').forEach((x) => { x.textContent = fmtT(left); });
      box.querySelector('.ct-clock-bar i').style.transform = `scaleX(${Math.max(0, left / LIM)})`;
      box.classList.toggle('warn', left <= 10 * 60000); box.classList.toggle('end', left <= 60000);
      root.querySelector('.ct-fab')?.classList.toggle('warn', left <= 10 * 60000);
      if (left <= 10 * 60000 && left > 60000 && avisou < 1) { avisou = 1; say('Faltam 10 minutos para acabar o tempo desta tentativa.'); }
      if (left <= 60000 && left > 0 && avisou < 2) { avisou = 2; say('Falta 1 minuto! Responda o que puder: ao zerar, o questionário é enviado.'); }
      if (left <= 0) { closeAttempt(true); showResult = true; paint(); drawQ(); setSheet(true); tick(); say('O tempo acabou. O questionário foi enviado com as respostas que você deu.'); }
    };
    /* nova tentativa: janela com a carteira; ao pagar, as moedas voam até o cadeado, que se abre */
    const buyAttempt = () => {
      if (document.querySelector('.ctb')) return;
      const saldo = wallet.saldo(), can = saldo >= PRICE, n = bestNota();
      const w = document.createElement('div');
      w.className = 'ctb'; w.style.setProperty('--tint', meta.tint || '28, 64, 120');
      w.innerHTML = `<div class="ctb-back"></div>
        <div class="ctb-card" role="dialog" aria-modal="true" aria-labelledby="ctb-t">
          <div class="ctb-lock"><i class="ctb-glow"></i><span class="ctb-ring"></span><svg class="ctb-shk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${I.shackle}</svg><svg class="ctb-body" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${I.lock}</svg></div>
          <h2 id="ctb-t">Nova tentativa</h2>
          <p class="ctb-sub">${n !== null ? `Sua nota agora é <b>${fmtN(n)}</b>${n < PASS ? ' (recuperação)' : ''}. ` : ''}Para responder o questionário de novo, libere uma nova chance. Fica valendo a maior nota.</p>
          <div class="ctb-wallet"><img class="ctb-coin" src="${COIN}" alt=""><span><small>${test ? 'Saldo fictício' : 'Seu Saldo HC'}</small><b class="ctb-saldo">${fmtC(saldo)}</b></span><span class="ctb-price"><small>Custa</small><b>− ${fmtC(PRICE)}</b></span></div>
          ${can ? '' : `<p class="ctb-miss">Faltam <b>${fmtC(PRICE - saldo)}</b>. Ganhe moedas concluindo as lições do curso.</p>`}
          <div class="ctb-acts"><button type="button" class="ctq-btn soft" data-ctb="no">Cancelar</button><button type="button" class="ctq-btn buy" data-ctb="yes"${can ? '' : ' disabled'}>Liberar <span class="ctq-price"><img src="${COIN}" alt="">${fmtC(PRICE)}</span></button></div>
        </div>`;
      document.body.appendChild(w);
      const close = () => { w.classList.remove('in'); setTimeout(() => w.remove(), 350); };
      w.querySelector('.ctb-back').addEventListener('click', () => { if (!w.classList.contains('paying')) close(); });
      w.querySelector('[data-ctb="no"]').addEventListener('click', close);
      w.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !w.classList.contains('paying')) close(); });
      w.querySelector('[data-ctb="yes"]').addEventListener('click', () => {
        if (w.classList.contains('paying') || !wallet.spend(PRICE)) return;
        w.classList.add('paying');
        payAnim(w, saldo, saldo - PRICE).then(() => {
          const s0 = st(); s0.ans = {}; s0.fechada = false; s0.tent = (s0.tent || 1) + 1; s0.ini = Date.now(); avisou = 0; S.save(); tick();
          setTimeout(() => { close(); showResult = false; showPart(0); if (mob()) setSheet(true); say('Nova tentativa liberada. Boa sorte!'); }, 900);
        });
      });
      requestAnimationFrame(() => { w.classList.add('in'); w.querySelector('[data-ctb="yes"]').focus(); });
    };
    /* animação: moedas saem da carteira em arco até o cadeado; o saldo desce; o cadeado se abre */
    const payAnim = (w, from, to) => new Promise((done) => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const src = w.querySelector('.ctb-coin').getBoundingClientRect(), lock = w.querySelector('.ctb-lock').getBoundingClientRect(), out = w.querySelector('.ctb-saldo');
      const N = reduce ? 0 : 12, T = 620, GAP = 75, sx = src.left + src.width / 2, sy = src.top + src.height / 2, tx = lock.left + lock.width / 2, ty = lock.top + lock.height / 2;
      for (let i = 0; i < N; i++) {
        const c = document.createElement('img'); c.src = COIN; c.className = 'ctb-fly'; c.alt = '';
        c.style.left = `${sx - 14}px`; c.style.top = `${sy - 14}px`; document.body.appendChild(c);
        const dx = tx - sx, dy = ty - sy, side = (i % 2 ? 1 : -1) * (30 + (i % 4) * 18);
        const an = c.animate([
          { transform: 'translate(0,0) scale(.6) rotate(0deg)', opacity: 0 },
          { transform: `translate(${dx * .35 + side}px, ${dy * .35 - 70}px) scale(1.15) rotate(${side * 3}deg)`, opacity: 1, offset: .4 },
          { transform: `translate(${dx}px, ${dy}px) scale(.45) rotate(${side * 6}deg)`, opacity: .9 },
        ], { duration: T, delay: i * GAP, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' });
        an.onfinish = () => { c.remove(); const L = w.querySelector('.ctb-lock'); L.classList.remove('hit'); void L.offsetWidth; L.classList.add('hit'); };
      }
      const total = reduce ? 200 : (N - 1) * GAP + T, t0 = performance.now();
      const tick = (now) => { const k = Math.min(1, (now - t0) / total), e = 1 - (1 - k) ** 3; out.textContent = fmtC(from + (to - from) * e); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      setTimeout(() => { w.classList.add('open'); w.querySelector('#ctb-t').textContent = 'Chance liberada!'; done(); }, total + 120);
    });

    /* responder: primeiro "Verificando resposta…", depois o resultado */
    let vt = 0;
    const answer = (k) => {
      const s = st(); if (s.ans[cur] !== undefined || checking || s.fechada) return;
      checking = { q: cur, k }; drawQ();
      vt = setTimeout(() => {
        const { q } = checking; checking = null;
        s.ans[q] = k;
        if (!s.tried.includes(q)) s.tried.push(q);
        closeAttempt(); S.save(); paint(); drawQ();
        body.querySelector('.ctq-fb')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        if (Object.keys(s.ans).length === Q.length) setTimeout(() => { if (!root.isConnected) return; showResult = true; paint(); drawQ(); }, 1400);
      }, VERIFY_MS);
    };
    /* abrir uma pergunta (se for de outra parte, o texto vai junto) */
    const goQ = (i) => {
      if (checking) return;
      showResult = false; cur = Math.max(0, Math.min(Q.length - 1, i));
      const pi = partIdx[Q[cur].parte];
      if (pi > maxPart()) { const g = maxPart(); gateNote(g); cur = qsOf(g).find((k) => st().ans[k] === undefined) ?? cur; if (g !== part) return showPart(g, { syncQ: false }); paint(); return drawQ(); }
      if (pi !== part) return showPart(pi, { syncQ: false });
      paint(); drawQ();
    };

    root.addEventListener('click', (e) => {
      if (e.target.classList.contains('ct-scrim')) return setSheet(false);
      const t = e.target.closest('button, a'); if (!t || !root.contains(t)) return;
      if (t.classList.contains('ct-back') || t.hasAttribute('data-back')) { location.hash = meta.back || '#informatica/cursos'; return; }
      if (t.hasAttribute('data-nextaula') && nx) { location.hash = nx.hash; return; }
      if (t.dataset.gatego !== undefined) { const k = +t.dataset.gatego, m = qsOf(k).find((i) => st().ans[i] === undefined); t.closest('.ct-gate')?.classList.remove('in'); if (k !== part) showPart(k, { scroll: false }); if (m !== undefined) goQ(m); setSheet(true); if (!mob()) root.querySelector('.ct-quiz')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
      if (t.dataset.part !== undefined) { e.preventDefault(); if (t.closest('.ctq')) setSheet(false); return goPart(+t.dataset.part); }
      if (t.dataset.pstep) {
        if (checking) return;
        const n = part + +t.dataset.pstep;
        if (n >= P.length && ler) { cleanup?.(); return open(view, C0, { ...meta, modo: 'intro' }); }
        if (n >= P.length) { showResult = Object.keys(st().ans).length === Q.length; if (!showResult) { const m = Q.findIndex((_, k) => st().ans[k] === undefined); if (m >= 0) goQ(m); } else { paint(); drawQ(); } return setSheet(true); }
        const inQuiz = !!t.closest('.ctq'); if (goPart(n) && inQuiz && mob()) setSheet(true); return;
      }
      if (t.dataset.op !== undefined) return answer(+t.dataset.op);
      if (t.dataset.step) { const qs = qsOf(part), j = qs.indexOf(cur) + +t.dataset.step; if (qs[j] !== undefined) goQ(qs[j]); return; }
      if (t.dataset.q !== undefined) return goQ(+t.dataset.q);
      if (t.hasAttribute('data-result')) { showResult = true; paint(); return drawQ(); }
      if (t.hasAttribute('data-redo')) return buyAttempt();
      if (t.hasAttribute('data-test')) { cleanup?.(); delete testStores[id]; return open(view, C0, { ...meta, test: true, modo: 'intro' }); }
      if (t.hasAttribute('data-exittest')) { cleanup?.(); delete testStores[id]; return open(view, C0, { ...meta, test: false, modo: 'intro' }); }
      if (t.hasAttribute('data-intro')) { cleanup?.(); return open(view, C0, { ...meta, modo: 'intro' }); }
      if (t.hasAttribute('data-fill')) { // teste: responde as que faltam ao acaso (mais ou menos metade certa), para chegar logo na nota
        const s0 = st(); Q.forEach((q, i) => { if (s0.ans[i] === undefined) s0.ans[i] = Math.random() < .5 ? q.certa : (q.certa + 1) % q.op.length; });
        closeAttempt(); showResult = true; paint(); drawQ(); if (mob()) setSheet(true); return;
      }
      if (t.hasAttribute('data-seetext')) { setSheet(false); return toTop(root.querySelector(part === 0 ? '.ct-doc' : '.ct-steps')); }
      if (t.hasAttribute('data-openq')) return setSheet(true);
      if (t.classList.contains('ctq-close')) setSheet(false);
    });
    const onKey = (e) => {
      if (e.key === 'Escape' && root.classList.contains('q-open')) return setSheet(false);
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '') || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight' && part < P.length - 1) goPart(part + 1);
      if (e.key === 'ArrowLeft' && part > 0) showPart(part - 1);
    };
    addEventListener('keydown', onKey);

    /* parte lida: quando o fim dela aparece na tela */
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const s = st(), pid = en.target.dataset.mark; io.unobserve(en.target);
      if (s.read.includes(pid)) return;
      s.read.push(pid);
      S.save(); paint();
    }), { rootMargin: '0px 0px -10% 0px' });

    /* barra fininha no alto: quanto do conteúdo todo já passou (partes anteriores + o quanto rolou desta) */
    const fill = root.querySelector('.ct-readbar i'), doc = root.querySelector('.ct-doc');
    let raf = 0;
    function onScroll() { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const r = doc.getBoundingClientRect(), f = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))); fill.style.transform = `scaleX(${(part + f) / P.length})`; }); }
    addEventListener('scroll', onScroll, { passive: true });

    closeAttempt(); if (!ler) startClock();
    showPart(Math.min(part, maxPart()), { scroll: false });
    if (!ler) { tick(); clockT = setInterval(tick, 1000); if (meta.verRes && finished()) { showResult = true; paint(); drawQ(); } }
    window.scrollTo(0, 0);
    if (meta.loading) loader(ler ? 'ler' : meta.verRes && finished() ? 'res' : exam ? 'prova' : 'quiz', id, meta.tint);
    S.pull().then((changed) => { if (!changed || !root.isConnected) return; closeAttempt(); if (!ler) startClock(); showPart(Math.min(P.length - 1, +st().part || 0, maxPart()), { scroll: false }); if (!ler) tick(); });

    const onHash = () => { if (!root.isConnected || !location.hash.startsWith('#informatica/conteudo-')) cleanup?.(); };
    addEventListener('hashchange', onHash);
    cleanup = () => { clearTimeout(vt); clearTimeout(gateT); clearInterval(clockT); io.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('keydown', onKey); removeEventListener('hashchange', onHash); document.documentElement.classList.remove('ct-lock'); S.flush(); cleanup = null; };
  }

  window.HC_conteudo = { open };
})();
