/* =========================================================
   PLATAFORMA DE INFORMÁTICA — motor das lições (curso/licao.js + licao.css)
   Roda qualquer lição definida em window.HC_LICOES (ex.: curso/licao-01.js):
   digitação, minijogos (Varredura Hacker, Fila de Ancoragem, Eco da Memória),
   XP com estrelas, tempo, precisão, resultado final e relatório.

   Progresso: salvo por aluno no aparelho (localStorage) e no Supabase
   (tabela informatica_progresso — supabase/08-progresso-informatica.sql).
   Ao voltar, o aluno continua do nível em que parou.
   ========================================================= */
(() => {
  /* pontuação de cada nível, no estilo do Just Dance: até 13.000 pontos sem errar nada.
     5 estrelas a cada 2.000 pontos; 11.000 = Superstar (azul-claro); 12.000 = Megastar (roxo). */
  const PTS_MAX = 13000;
  const STAR_AT = [2000, 4000, 6000, 8000, 10000];
  const SUPER_AT = 11000, MEGA_AT = 12000;
  const rankOf = (pts) => (pts >= MEGA_AT ? 'mega' : pts >= SUPER_AT ? 'super' : '');
  const starsOf = (pts) => STAR_AT.filter((t) => pts >= t).length;
  const RANK_NAME = { super: 'Superstar', mega: 'Megastar' };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const keyLabel = (k) => (k === ' ' ? 'Espaço' : k.toUpperCase());
  const keyGlyph = (k) => (k === ' ' ? '␣' : k.toUpperCase());
  const finger = { f: 'Indicador esquerdo', j: 'Indicador direito', ' ': 'Polegar' };
  const ICO = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    star: '<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    play: '<path d="M7 5v14l11-7z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    snail: '<circle cx="14" cy="12" r="6"/><path d="M14 9a3 3 0 1 1-3 3M2 18h14M4 18c0-3 1-5 4-6"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>',
    level: '<path d="M4 20V14M10 20V9M16 20V4M22 20H2"/>',
  };
  const svg = (k, fill) => `<svg viewBox="0 0 24 24" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;

  /* grau de experiência: grau 1 precisa de 100 XP, cada grau seguinte +10 */
  function grade(xp) {
    let g = 1, rest = xp, need = 100;
    while (rest >= need) { rest -= need; g++; need = 100 + (g - 1) * 10; }
    return { g, pct: (rest / need) * 100 };
  }
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const dur = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);

  /* ---------- progresso salvo ---------- */
  const uid = () => auth?.user?.id || 'anon';
  const lsKey = (id) => `hc:info:${uid()}:${id}`;
  const readLocal = (id) => { try { return JSON.parse(localStorage.getItem(lsKey(id)) || 'null'); } catch { return null; } };
  function saveProgress(id, data) {
    data.savedAt = Date.now();
    try { localStorage.setItem(lsKey(id), JSON.stringify(data)); } catch {}
    if (auth?.user && typeof sb !== 'undefined' && sb) {
      sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao: id, dados: data, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) console.info('Progresso salvo só neste aparelho:', error.message); });
    }
  }
  async function loadProgress(id) {
    const local = readLocal(id);
    if (!auth?.user || typeof sb === 'undefined' || !sb) return local;
    try {
      const res = await Promise.race([
        sb.from('informatica_progresso').select('dados').eq('user_id', auth.user.id).eq('licao', id).maybeSingle(),
        sleep(2500).then(() => ({ data: null })),
      ]);
      const remote = res?.data?.dados;
      if (remote && (!local || (remote.savedAt || 0) > (local.savedAt || 0))) {
        try { localStorage.setItem(lsKey(id), JSON.stringify(remote)); } catch {}
        return remote;
      }
    } catch {}
    return local;
  }
  /* resumo para os cards da tela inicial */
  window.HC_progressoLicao = (id) => readLocal(id);

  /* ---------- visual escuro, herdado dos cards das lições ---------- */
  const TINT0 = '22, 60, 48';
  /* cor do cartão de cada tipo de nível (a de digitação é a do card da lição) */
  const KIND_TINT = { hacker: '24, 46, 110', fila: '30, 70, 90', memoria: '70, 32, 120' };
  const CARD_TINTS = ['24, 46, 110', '70, 32, 120', '120, 40, 30', '30, 70, 90'];
  const topHTML = (L, prog) => `
      <div class="lc-top">
        <a class="lc-back" href="#informatica">${svg('back')}Lições</a>
        <h1 class="lc-head"><span class="lc-grad">Lição ${L.numero}.</span> <span>${esc(L.titulo)}</span></h1>
        ${prog ? `<div class="lc-prog" aria-label="Progresso da lição"><span id="lc-prog-txt"></span><div class="lc-segs" id="lc-segs">${L.niveis.map((n) => `<i class="${n.tipo === 'typing' ? '' : 'g'}"></i>`).join('')}</div></div>` : ''}
      </div>`;

  /* =========================================================
     Celular e tablet: as lições são feitas só no computador.
     Mostra uma animação (o celular dá lugar ao computador) e o progresso do aluno.
     ========================================================= */
  function computerOnly(view, L, p, meta = {}) {
    const N = L.niveis.length;
    const t = p ? p.hits + p.errors : 0;
    const acc = t ? Math.round((p.hits / t) * 100) : null;
    const lvl = p ? (p.done ? N : Math.min(p.lvl, N)) : 0;
    const first = (meName() || '').split(' ')[0];
    view.innerHTML = `
    <div class="wrap lc" style="--tint:${meta.tint || TINT0}">
     <div class="lc-shell">
      ${topHTML(L)}
      <section class="lc-pc">
        <div class="lc-pc-scene" aria-hidden="true">
          <div class="lc-pc-phone"><span></span><i></i></div>
          <div class="lc-pc-laptop">
            <div class="lc-pc-screen"><div class="lc-pc-keys"><b>F</b><b class="sp">Espaço</b><b>J</b></div><div class="lc-pc-line"><span>f j f j ff jj</span><i></i></div></div>
            <div class="lc-pc-base"></div>
          </div>
          <span class="lc-pc-spark s1"></span><span class="lc-pc-spark s2"></span><span class="lc-pc-spark s3"></span>
        </div>
        <h2>${first ? `${esc(first)}, esta` : 'Esta'} lição é feita no computador.</h2>
        <p>As atividades de digitação precisam de um teclado de verdade e de uma tela maior. Continue nos computadores do HC Instituto Educacional nos dias de aula: o seu progresso fica salvo na sua conta e você retoma de onde parou.</p>
        <div class="lc-pc-prog">
          <div class="lc-pc-prog-head"><b>Seu progresso nesta lição</b><span>${p?.done ? 'Concluída' : p ? `Nível ${lvl + 1} de ${N}` : 'Ainda não iniciada'}</span></div>
          <b class="lc-pc-bar"><i style="--w:${(lvl / N) * 100}%"></i></b>
          <div class="lc-pc-stats">
            <div><strong>${lvl}/${N}</strong><small>Níveis concluídos</small></div>
            <div><strong>${p ? p.xp.toLocaleString('pt-BR') : 0}</strong><small>XP</small></div>
            <div><strong>${acc === null ? '—' : acc + '%'}</strong><small>Precisão</small></div>
            <div><strong>${p ? dur(p.time) : '—'}</strong><small>Tempo</small></div>
          </div>
        </div>
        <div class="lc-cta"><a class="btn-dark" href="#informatica">Voltar às lições</a></div>
      </section>
     </div>
    </div>`;
  }

  /* =========================================================
     Abrir uma lição
     ========================================================= */
  async function open(view, L, meta = {}) {
    view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando a lição…</p></div>';
    const saved = await loadProgress(L.id);
    if (!view.isConnected) return;
    const N = L.niveis.length;
    if (!window.HC_isComputer()) return computerOnly(view, L, saved, meta);
    const fresh = () => ({ lvl: 0, xp: 0, time: 0, hits: 0, errors: 0, levelTimes: [], levelPts: [], done: false, total: N });
    // progresso salvo antes da pontuação ser dividida entre os níveis: pontos de nível acima da parte de cada um são descartados
    if (saved?.levelPts?.some((x) => x > PTS_MAX / N + 1)) saved.levelPts = [];
    let st = saved && !saved.done ? { ...fresh(), ...saved } : fresh();
    let alive = true, busy = false, phase = 'welcome', tick = null, lvlStart = 0;
    let game = {}; // estado do nível atual (minijogos)

    const tint = meta.tint || TINT0;
    view.innerHTML = `
    <div class="wrap lc" style="--tint:${tint}">
      <div class="lc-shell">
        ${topHTML(L, true)}
        <div id="lc-body"></div>
      </div>
    </div>`;
    const body = view.querySelector('#lc-body');
    const $q = (s) => view.querySelector(s);

    const accuracy = () => { const t = st.hits + st.errors; return t ? Math.max(0, (st.hits / t) * 100) : 100; };
    function paintProgress() {
      const over = phase === 'results' || (phase === 'welcome' && saved?.done); // na abertura de uma lição já concluída, tudo cheio
      const done = over ? N : st.lvl;
      $q('#lc-prog-txt').textContent = over ? 'Lição concluída' : `Nível ${Math.min(st.lvl + 1, N)} de ${N}`;
      // uma barrinha por nível: feitos em verde, o atual pulsando (os minijogos ficam num tom próprio)
      $q('#lc-segs')?.querySelectorAll('i').forEach((el, i) => { el.classList.toggle('on', i < done); el.classList.toggle('cur', phase === 'play' && i === st.lvl); });
    }

    /* ---------- tela de boas-vindas ---------- */
    function welcome() {
      phase = 'welcome'; paintProgress();
      const resume = saved && !saved.done && st.lvl > 0;
      const finished = saved?.done;
      const p = saved || null, tot = p ? p.hits + p.errors : 0;
      const doneN = p ? (p.done ? N : Math.min(p.lvl, N)) : 0;
      const status = finished ? 'Concluída' : resume ? `Nível ${st.lvl + 1} de ${N}` : `${N} níveis`;
      const stars = p && meta.stars ? meta.stars(p) : '';
      body.innerHTML = `
      <div class="lc-wel">
        <article class="lc-hero">
          <div class="lc-hero-img">${meta.imagem ? `<img src="${esc(meta.imagem)}" alt="">` : `<span class="lc-hero-ph" style="--k:${meta.k || 0}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg></span>`}</div>
          <div class="lc-hero-app">
            <div class="lc-hero-text">
              ${meta.tag ? `<span class="lc-hero-tag">${esc(meta.tag)}</span>` : ''}
              <h2>${esc(L.titulo)}</h2>
              <p>${esc(meta.desc || L.intro)}</p>
            </div>
            <div class="lc-hero-bar">
              <span class="lc-hero-av">${L.numero}</span>
              <span class="lc-hero-who"><strong>Lição ${L.numero}</strong><small>${esc(status)}</small></span>
              ${stars}
            </div>
          </div>
          ${p ? `<b class="lc-hero-prog" style="--w:${(doneN / N) * 100}%"></b>` : ''}
        </article>
        <div class="lc-wel-side">
          <h2 class="lc-wel-title"><span class="lc-grad">${resume ? 'Continue de onde parou.' : finished ? 'Lição concluída!' : 'Vamos começar.'}</span></h2>
          <p class="lc-wel-intro">${esc(L.intro)}</p>
          <div class="lc-intro-grid">
            ${L.cards.map(([t, d], i) => `<div class="lc-intro" style="--i:${i};--tint:${CARD_TINTS[i % CARD_TINTS.length]}"><b>${String.fromCharCode(65 + i)}</b><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}
          </div>
          ${p ? `<div class="lc-wel-stats">
            <div><strong>${doneN}/${N}</strong><small>Níveis</small></div>
            <div><strong>${(p.xp || 0).toLocaleString('pt-BR')}</strong><small>XP</small></div>
            <div><strong>${tot ? Math.round((p.hits / tot) * 100) + '%' : '—'}</strong><small>Precisão</small></div>
            <div><strong>${p.time ? dur(p.time) : '—'}</strong><small>Tempo</small></div>
          </div>` : ''}
          <div class="lc-cta">
            ${resume ? `<button class="btn-dark inf-shine" type="button" data-go="resume">${svg('play', true)}Continuar do nível ${st.lvl + 1}</button><button class="btn-soft" type="button" data-go="restart">Recomeçar a lição</button>`
              : finished ? `<button class="btn-dark inf-shine" type="button" data-go="restart">${svg('refresh')}Refazer a lição</button><button class="btn-soft" type="button" data-go="last">Ver o último resultado</button>`
              : `<button class="btn-dark inf-shine" type="button" data-go="restart">${svg('play', true)}Iniciar atividade</button>`}
          </div>
          <p class="lc-note">Use as teclas ${L.teclas.map((k) => `<kbd>${esc(keyLabel(k))}</kbd>`).join('')} com os dedos na posição inicial.</p>
        </div>
      </div>`;
      body.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
        if (b.dataset.go === 'restart') st = fresh();
        if (b.dataset.go === 'last') { st = { ...fresh(), ...saved }; return results(); }
        play();
      }));
    }

    /* ---------- área de jogo (coluna principal + lateral) ---------- */
    function play() {
      phase = 'play';
      body.innerHTML = `
      <div class="lc-grid">
        <aside class="lc-gauge" id="lc-gauge" aria-label="Pontuação do nível"></aside>
        <section class="lc-card lc-main" id="lc-main"></section>
        <aside class="lc-side">
          <div class="lc-stat lc-w" style="--wc:#ff9f0a">
            <span class="lc-w-label">${svg('zap')}XP</span>
            <strong id="lc-xp">0</strong><small>Pontos de experiência</small>
            <div class="lc-sparks" id="lc-sparks"></div>
          </div>
          <div class="lc-stat lc-w" style="--wc:#0a84ff"><span class="lc-w-label">${svg('clock')}Tempo</span><strong id="lc-time">00:00</strong><small>Tempo nesta lição</small></div>
          <div class="lc-stat lc-w lc-w-ring" id="lc-acc-card" style="--wc:#30d158">
            <div><span class="lc-w-label">${svg('target')}Precisão</span><strong id="lc-acc">100%</strong><small id="lc-acc-txt">Excelente</small></div>
            <svg class="lc-ring2" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" pathLength="100"/><circle class="v" id="lc-acc-ring" cx="22" cy="22" r="18" pathLength="100"/></svg>
          </div>
          <div class="lc-stat lc-w" style="--wc:#bf5af2"><span class="lc-w-label">${svg('level')}Grau de experiência</span><strong id="lc-grade">01</strong><b class="lc-mini"><i id="lc-grade-bar"></i></b><small id="lc-grade-txt"></small></div>
        </aside>
      </div>`;
      paintStats();
      gaugeBuild();
      // só ao começar do nível 1 o teclado aparece por 5 s (para o aluno ver que ele existe);
      // ao continuar a lição, já começa recolhido
      kbOpen = st.lvl === 0;
      presses = []; speedShown = 0; speedRun();
      level();
      if (kbOpen) kbTimer = setTimeout(() => kbShow(false), 5000);
      clearInterval(tick);
      tick = setInterval(() => {
        if (!view.isConnected || !alive) return stop();
        if (phase === 'play' && !busy && document.visibilityState === 'visible' && !game.paused) { st.time++; $q('#lc-time') && ($q('#lc-time').textContent = fmt(st.time)); }
      }, 1000);
    }

    function paintStats() {
      const x = $q('#lc-xp'); if (!x) return;
      x.textContent = st.xp.toLocaleString('pt-BR');
      $q('#lc-time').textContent = fmt(st.time);
      const a = accuracy();
      $q('#lc-acc').textContent = Math.round(a) + '%';
      // anel de precisão (como os anéis de atividade): verde, amarelo ou vermelho
      $q('#lc-acc-ring').style.setProperty('--p', a.toFixed(1));
      $q('#lc-acc-card').style.setProperty('--wc', a >= 88 ? '#30d158' : a >= 70 ? '#ffd60a' : '#ff453a');
      $q('#lc-acc-txt').textContent = a >= 88 ? 'Excelente' : a >= 70 ? 'Bom' : 'Atenção aos erros';
      const g = grade(st.xp);
      $q('#lc-grade').textContent = String(g.g).padStart(2, '0');
      $q('#lc-grade-bar').style.width = g.pct + '%';
      $q('#lc-grade-txt').textContent = `${Math.max(1, Math.round(100 - g.pct))}% para o grau ${g.g + 1}`;
    }

    /* acerto e erro valem para todos os tipos de nível */
    function hit(k) {
      presses.push(performance.now());
      st.hits++; st.xp += 5; paintStats(); spark(); drop(k, true); kb?.flash(k, true);
      score(true);
    }
    function miss(k) {
      st.errors++; st.xp = Math.max(0, st.xp - (1 + Math.floor(Math.random() * 6))); paintStats(); if (k) { drop(k, false); kb?.flash(k, false); }
      score(false);
    }

    /* ---------- pontuação da lição e medidor de estrelas (à esquerda) ----------
       Os 13.000 pontos são divididos entre todos os níveis da lição (13.000 ÷ nº de níveis cada).
       Em cada nível: parte do nível já feita × precisão no nível × a parte dele nos 13.000.
       Sem errar nada em nenhum nível, a lição termina com 13.000. O medidor nunca desce. */
    const needOf = (lv) => (lv.tipo === 'typing' ? lv.texto.length : lv.tipo === 'memoria' ? lv.rodadas.reduce((a, b) => a + b, 0) : lv.meta);
    const PER = PTS_MAX / N; // pontos que cada nível vale
    const gs = { stars: 0, rank: '' }; // o que o medidor já mostrou (para animar só o que é novo)
    const totalPts = () => Math.min(PTS_MAX, (st.levelPts || []).reduce((a, x, i) => a + (i === st.lvl && phase === 'play' ? 0 : (x || 0)), 0) + (phase === 'play' ? (game.lp || 0) : 0));
    /* medidor no estilo da barra de estrelas do Just Dance: a moldura cresce para cima até a
       próxima meta (com a estrela vazia esperando lá), a estrela conquistada "explode" de brilho,
       e no Superstar/Megastar vem o clarão, as estrelas grandes e o nome escrito na vertical. */
    const G_TOP = MEGA_AT; // o topo da barra é o Megastar (12.000)
    const GOALS = [...STAR_AT, SUPER_AT, MEGA_AT];
    const BAR_COLORS = ['#ffc400', '#ff4f9a', '#22d3ee', '#a3e635', '#ff8a00', '#a78bfa', '#34d399', '#f43f5e']; // sorteada a cada vez que a lição começa
    const gPct = (v) => Math.min(100, (v / G_TOP) * 100);
    function gaugeBuild() {
      Object.assign(gs, { stars: 0, rank: '', ready: false });
      const g = $q('#lc-gauge'); if (!g) return;
      g.className = 'lc-gauge';
      g.style.setProperty('--bar', BAR_COLORS[Math.floor(Math.random() * BAR_COLORS.length)]);
      g.innerHTML = `
        <div class="lc-g-code" aria-hidden="true">${typeof infoBgRows === 'function' ? infoBgRows(16) : ''}</div>
        <div class="lc-g-area">
          <div class="lc-g-frame" id="lc-gframe"></div>
          <div class="lc-g-bar" id="lc-gbar"><i class="lc-g-shine"></i><b class="lc-g-beam" id="lc-gbeam"></b></div>
          ${STAR_AT.map((t, i) => `<span class="lc-g-star" data-gs="${i}" style="--at:${gPct(t)}%;--i:${i}"><img class="lc-g-edge" src="assets/estrelas/estrela-amarela.png" alt="" draggable="false">${['vazia', 'amarela', 'superstar', 'megastar'].map((k) => `<img class="s-${k}" src="assets/estrelas/estrela-${k}.png" alt="" draggable="false">`).join('')}</span>`).join('')}
          <div class="lc-g-word" id="lc-gword"></div>
          <div class="lc-g-flash" id="lc-gflash"></div>
        </div>
        <strong class="lc-gauge-pts" id="lc-gpts">0</strong>`;
      // a cada 5 s, um pulsar suave com brilho no contorno passa pelas estrelas conquistadas,
      // de baixo para cima, uma depois da outra (quanto mais estrelas, mais longa a onda)
      clearInterval(gs.glint);
      gs.glint = setInterval(() => {
        if (!g.isConnected) return clearInterval(gs.glint);
        g.querySelectorAll('.lc-g-star.on:not(.pop)').forEach((el, i) => setTimeout(() => {
          el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
        }, i * 280));
      }, 5000);
    }
    function gaugeLevel(lv) { game.need = needOf(lv); game.ph = 0; game.pe = 0; game.lp = 0; paintGauge(); }
    function score(ok) {
      if (!game.need || busy) return;
      if (ok) game.ph++;
      else { game.pe++; const g = $q('#lc-gauge'); g?.classList.remove('hurt'); void g?.offsetWidth; g?.classList.add('hurt'); }
      const prog = Math.min(1, game.ph / game.need), acc = game.ph / Math.max(1, game.ph + game.pe);
      game.lp = Math.min(PER, Math.max(game.lp, PER * prog * acc));
      paintGauge();
    }
    function paintGauge() {
      const g = $q('#lc-gauge'); if (!g) return;
      const pts = Math.round(totalPts()), quiet = !gs.ready; // ao abrir/retomar, mostra o estado sem animar
      $q('#lc-gbar').style.height = `${gPct(pts)}%`;
      $q('#lc-gpts').textContent = pts.toLocaleString('pt-BR');
      const next = GOALS.find((t) => t > pts);
      $q('#lc-gframe').style.height = `${next ? gPct(next) : 100}%`; // a moldura cresce até a próxima meta
      const stars = starsOf(pts);
      g.querySelectorAll('.lc-g-star').forEach((el, i) => {
        el.classList.toggle('on', i < stars);
        el.classList.toggle('next', i === stars); // estrela vazia esperando na próxima meta
        if (!quiet && i >= gs.stars && i < stars) { // estrela nova: surge com raios, cresce branca de brilho e assenta
          el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
          const bar = $q('#lc-gbar'); bar.classList.remove('flash'); void bar.offsetWidth; bar.classList.add('flash');
          const beam = $q('#lc-gbeam'); beam.classList.remove('go'); void beam.offsetWidth; beam.classList.add('go'); // feixe branco subindo pela barra
          setTimeout(() => el.classList.remove('pop'), 1100);
        }
      });
      gs.stars = stars;
      const rank = rankOf(pts);
      if (rank !== gs.rank) {
        gs.rank = rank;
        if (quiet) { g.classList.toggle('super', rank === 'super'); g.classList.toggle('mega', rank === 'mega'); wordSet(rank, true); }
        else rankShow(g, rank);
      }
      gs.ready = true;
    }
    function wordSet(rank, instant) {
      const w = $q('#lc-gword'); if (!w) return;
      const name = (RANK_NAME[rank] || '').toUpperCase();
      w.className = 'lc-g-word ' + rank;
      w.innerHTML = [...name].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('');
      w.classList.toggle('instant', !!instant);
    }
    /* Superstar / Megastar: clarão → estrelas grandes na cor nova → nome letra por letra → faíscas → assenta */
    function rankShow(g, rank) {
      const fl = $q('#lc-gflash');
      fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
      setTimeout(() => {
        g.classList.toggle('super', rank === 'super'); g.classList.toggle('mega', rank === 'mega');
        g.classList.remove('big'); void g.offsetWidth; g.classList.add('big');
        wordSet(rank);
      }, 380);
      setTimeout(() => {
        g.classList.remove('big');
        g.querySelectorAll('.lc-g-star.on').forEach((el, i) => setTimeout(() => { el.classList.remove('pulse', 'burst'); void el.offsetWidth; el.classList.add('burst'); }, i * 70));
      }, 1500);
    }
    const starsHTML = (pts, cls = '') => {
      const n = starsOf(pts), rk = rankOf(pts);
      return `<span class="lc-stars5 ${rk} ${cls}">${STAR_AT.map((_, i) => `<i class="${i < n ? 'on' : ''}" style="--i:${i}">${svg('star', true)}</i>`).join('')}</span>`;
    };
    function spark() {
      const box = $q('#lc-sparks'); if (!box) return;
      for (let i = 0; i < 3; i++) setTimeout(() => {
        const s = document.createElement('i');
        s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px'); s.style.setProperty('--dy', -(110 + Math.random() * 90) + 'px');
        box.appendChild(s); setTimeout(() => s.remove(), 1600);
      }, i * 140);
    }
    function drop(k, ok) { // tecla que cai ao fundo do cartão principal
      const main = $q('#lc-main'); if (!main || main.querySelectorAll('.lc-drop').length > 14) return;
      const d = document.createElement('span');
      d.className = 'lc-drop' + (ok ? '' : ' bad'); d.textContent = keyGlyph(k);
      d.style.left = (6 + Math.random() * 88) + '%'; d.style.setProperty('--r', (Math.random() * 40 - 20) + 'deg');
      main.appendChild(d); setTimeout(() => d.remove(), 2600);
    }
    /* teclado virtual ABNT2 (curso/teclado.js); a preferência de mostrar ou não fica guardada no aparelho */
    let kb = null;
    let kbOpen = false, kbTimer = null;
    /* medidor de velocidade (pílula ao lado do botão do teclado): conta as teclas certas dos
       últimos 3 segundos; enche quando o aluno digita rápido e vai esvaziando quando ele para.
       Cor de azul (devagar) a vermelho (bem rápido); PPM = (teclas por minuto) ÷ 5. */
    const SPEED_WIN = 3000, SPEED_MAX = 60; // PPM em que a pílula fica cheia
    let presses = [], speedShown = 0, speedTick = null;
    function speedRun() {
      clearInterval(speedTick);
      speedTick = setInterval(() => {
        if (!view.isConnected || !alive) return clearInterval(speedTick);
        const now = performance.now();
        while (presses.length && now - presses[0] > SPEED_WIN) presses.shift();
        const target = presses.length ? (presses.length / (SPEED_WIN / 1000)) * 60 / 5 : 0;
        speedShown += (target - speedShown) * .18; // anda devagar até o valor, sem saltos
        if (speedShown < .4) speedShown = 0;
        const fill = $q('#lc-speed-fill'), num = $q('#lc-ppm'); if (!fill || !num) return;
        const t = Math.min(1, speedShown / SPEED_MAX);
        fill.style.width = `${(t * 100).toFixed(1)}%`;
        fill.style.setProperty('--h', Math.round(215 - 215 * t)); // 215 = azul … 0 = vermelho
        num.textContent = Math.round(speedShown);
      }, 80);
    }
    const KB_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>';
    const kbHTML = () => `
      <div class="lc-kbar">
        <span class="lc-speed" role="img" aria-label="Velocidade de digitação"><span class="lc-speed-pill"><i id="lc-speed-fill"></i></span><b id="lc-ppm">0</b><small>PPM</small></span>
        <button type="button" class="lc-kbtn${kbOpen ? ' open' : ''}" id="lc-kbtn" aria-expanded="${kbOpen}" aria-controls="lc-kbwrap">${KB_ICO}<span>${kbOpen ? 'Ocultar teclado' : 'Ver teclado virtual'}</span><b aria-hidden="true">⌄</b></button>
      </div>
      <div class="lc-kbwrap${kbOpen ? ' open' : ''}" id="lc-kbwrap"><div class="lc-kb" id="lc-kb"></div></div>`;
    function kbShow(open) {
      kbOpen = open; clearTimeout(kbTimer);
      const w = $q('#lc-kbwrap'), b = $q('#lc-kbtn'); if (!w || !b) return;
      w.classList.toggle('open', open); b.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open); b.querySelector('span').textContent = open ? 'Ocultar teclado' : 'Ver teclado virtual';
    }
    function kbMount() {
      kb?.destroy(); kb = null;
      const box = $q('#lc-kb'); if (!box || !window.HC_teclado) return;
      kb = window.HC_teclado(box);
      $q('#lc-kbtn')?.addEventListener('click', (e) => { kbShow(!kbOpen); e.currentTarget.blur(); }); // a barra de espaço volta a digitar, e não a apertar o botão
    }
    const kbTarget = (k) => kb?.target(k);

    /* troca o conteúdo do cartão animando a mudança de altura; a barra de estrelas e o resto
       da linha acompanham, porque a altura da linha segue a do cartão */
    function smoothResize(fn) {
      const main = $q('#lc-main');
      if (!main || matchMedia('(prefers-reduced-motion: reduce)').matches) return fn();
      const h0 = main.getBoundingClientRect().height;
      main.style.transition = 'none'; main.style.height = '';
      fn();
      main.style.alignSelf = 'start'; const natural = main.getBoundingClientRect().height; main.style.alignSelf = '';
      const side = view.querySelector('.lc-side');
      const h1 = Math.max(natural, side && getComputedStyle(side).order === '0' ? side.getBoundingClientRect().height : 0);
      if (!h0 || Math.abs(h1 - h0) < 2) return;
      main.style.height = h0 + 'px'; void main.offsetHeight;
      main.style.transition = 'height .55s cubic-bezier(.4, 0, .2, 1)'; main.style.height = h1 + 'px';
      clearTimeout(main._rs);
      main._rs = setTimeout(() => { main.style.transition = ''; main.style.height = ''; }, 600);
    }

    /* ---------- um nível ---------- */
    function level() {
      if (st.lvl >= N) return results();
      smoothResize(levelRender);
    }
    function levelRender() {
      busy = false; game = {}; lvlStart = st.time;
      const lv = L.niveis[st.lvl];
      const isGame = lv.tipo !== 'typing';
      const main = $q('#lc-main');
      const t = (KIND_TINT[lv.tipo] || tint).split(',').map(Number);
      main.style.setProperty('--c1', `rgb(${t.join(' ')})`); // a cor do cartão desliza de um nível para o outro
      main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter');
      const nn = String(st.lvl + 1).padStart(2, '0');
      main.innerHTML = `
        <span class="lc-lv-mark" aria-hidden="true">${nn}</span>
        <div class="lc-lv-head">
          <span class="lc-lv-av">${nn}</span>
          <span class="lc-lv-who"><strong>Nível ${nn}</strong><small>de ${N} · Lição ${L.numero}</small></span>
          <div class="lc-sup" id="lc-sup"></div>
          <span class="lc-kind${isGame ? ' game' : ''}">${isGame ? 'Minijogo' : 'Digitação'}</span>
        </div>
        <h2 class="lc-lv-title">${esc(lv.titulo)}</h2>
        <p class="lc-tip"><b>Dica</b>${esc(lv.dica)}</p>
        ${isGame ? `<div class="lc-goal"><span id="lc-goal-txt"></span><b><i id="lc-goal-bar"></i></b></div>` : ''}
        <div class="lc-stage" id="lc-stage"></div>
        ${kbHTML()}
        <div class="lc-over" id="lc-over" hidden></div>`;
      kbMount(); supRender();
      paintProgress(); paintStats(); gaugeLevel(lv);
      ({ typing: typingInit, hacker: hackerInit, fila: filaInit, memoria: memoInit })[lv.tipo](lv);
    }
    function goal(n, total) {
      const t = $q('#lc-goal-txt'), b = $q('#lc-goal-bar'); if (!t) return;
      t.textContent = `Progresso: ${n}/${total}`; b.style.width = `${Math.min(100, (n / total) * 100)}%`;
    }

    /* ---------- pílula de suporte (no cabeçalho do nível) ----------
       Se o aluno travar num nível por algum erro, quem dá suporte digita a senha e pula para
       qualquer nível ou para o resultado. O administrador já entra liberado e define a senha.
       A senha não fica salva: só o resumo SHA-256 dela, junto das edições da plataforma (cursoEdit). */
    const SUP_ID = 'suporteNivel';
    const supHash = () => (typeof cursoEdit !== 'undefined' && Array.isArray(cursoEdit) ? cursoEdit.find((x) => x?.id === SUP_ID)?.hash : '') || '';
    const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('hc-suporte:' + t)))].map((x) => x.toString(16).padStart(2, '0')).join('');
    const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
    const UNLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>';
    let supOk = isAdmin(), supMode = supOk ? 'go' : 'idle', supTries = 0, supWait = 0;
    function supRender(focus) {
      const box = $q('#lc-sup'); if (!box) return;
      if (!supOk && !supHash()) { box.hidden = true; return; } // sem senha definida, o aluno não vê a pílula
      box.hidden = false; box.className = 'lc-sup ' + supMode;
      if (supMode === 'idle') {
        box.innerHTML = `<button type="button" class="lc-sup-btn" data-sup="open" title="Suporte: pular de nível com a senha">${LOCK}<span>Suporte</span></button>`;
      } else if (supMode === 'ask' || supMode === 'set') {
        box.innerHTML = `<form class="lc-sup-form">${LOCK}<input type="password" autocomplete="off" enterkeyhint="go" aria-label="${supMode === 'set' ? 'Nova senha do suporte' : 'Senha do suporte'}" placeholder="${supMode === 'set' ? 'Nova senha (4+ caracteres)' : 'Senha do suporte'}"><button type="submit" class="lc-sup-ok" aria-label="Confirmar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button><button type="button" class="lc-sup-x" data-sup="close" aria-label="Fechar">×</button></form>`;
      } else {
        box.innerHTML = `<label class="lc-sup-go">${UNLOCK}<select id="lc-jump" aria-label="Ir para o nível"><option value="">Ir para…</option>${L.niveis.map((n, i) => `<option value="${i}">Nível ${i + 1}${n.tipo === 'typing' ? '' : ' · minijogo'}</option>`).join('')}<option value="r">Resultado</option>${isAdmin() ? `<option value="pin">${supHash() ? 'Trocar' : 'Definir'} a senha do suporte…</option>` : ''}</select></label>${isAdmin() ? '' : '<button type="button" class="lc-sup-x" data-sup="lock" aria-label="Bloquear de novo">×</button>'}`;
      }
      box.querySelector('[data-sup="open"]')?.addEventListener('click', () => { supMode = 'ask'; supRender(true); });
      box.querySelector('[data-sup="close"]')?.addEventListener('click', () => { supMode = supOk ? 'go' : 'idle'; supRender(); });
      box.querySelector('[data-sup="lock"]')?.addEventListener('click', () => { supOk = false; supMode = 'idle'; supRender(); });
      box.querySelector('#lc-jump')?.addEventListener('change', (e) => {
        const v = e.target.value; e.target.value = ''; e.target.blur();
        if (v === 'pin') { supMode = 'set'; return supRender(true); }
        if (v === 'r') return results();
        if (v !== '') { busy = false; st.lvl = +v; level(); }
      });
      const form = box.querySelector('form'), inp = form?.querySelector('input');
      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const val = inp.value.trim();
        if (supMode === 'set') {
          if (val.length < 4) return supBad(box, inp);
          const next = [...(cursoEdit || []).filter((x) => x?.id !== SUP_ID), { id: SUP_ID, hash: await sha(val) }];
          cursoEdit = next;
          try { await saveCursoEdit(); toast?.('Senha do suporte salva.'); } catch { toast?.('Não foi possível salvar a senha. Tente de novo.'); }
          supMode = 'go'; return supRender();
        }
        if (Date.now() < supWait) return supBad(box, inp);
        if (val && (await sha(val)) === supHash()) { supOk = true; supTries = 0; supMode = 'go'; supRender(); return $q('#lc-jump')?.focus(); }
        if (++supTries >= 5) { supTries = 0; supWait = Date.now() + 30000; inp.placeholder = 'Aguarde 30 segundos'; } // muitas tentativas: espera um pouco
        supBad(box, inp);
      });
      if (focus) setTimeout(() => inp?.focus(), 80);
    }
    function supBad(box, inp) { inp.value = ''; box.classList.remove('bad'); void box.offsetWidth; box.classList.add('bad'); }

    /* nível concluído: "Parabéns!" → "Nível X concluído" → próximo */
    async function complete() {
      if (busy) return; busy = true;
      clearInterval(game.timer); game.timer = null;
      st.levelTimes[st.lvl] = Math.max(1, st.time - lvlStart);
      const pts = Math.round((game.lp || 0) * 100) / 100; // com centavos: 30 × 433,33 fecha nos 13.000
      st.levelPts = st.levelPts || [];
      st.levelPts[st.lvl] = Math.max(st.levelPts[st.lvl] || 0, pts); // guarda a melhor pontuação do nível
      const over = $q('#lc-over'); const n = st.lvl + 1;
      st.lvl++;
      saveProgress(L.id, { ...st, done: false });
      over.hidden = false; over.innerHTML = `<div class="lc-done"><h3 class="lc-pop">Parabéns!</h3><p>+${Math.round(pts).toLocaleString('pt-BR')} pontos</p></div>`;
      await sleep(1100); if (!alive || !over.isConnected) return;
      over.innerHTML = `<h3 class="lc-pop sub">Nível ${n} concluído</h3>`;
      await sleep(1100); if (!alive || !over.isConnected) return;
      level();
    }

    /* ---------- DIGITAÇÃO ---------- */
    /* tecla nova: "Pressione a tecla F" → "Você a encontrou!" → Enter para começar */
    function introInit(lv) {
      game.intro = 'find'; game.nova = lv.nova;
      const kbd = `<kbd>${esc(keyLabel(lv.nova))}</kbd>`;
      $q('#lc-stage').innerHTML = `
        <div class="lc-new" id="lc-new">
          <p>É hora de aprender uma nova tecla!</p>
          <h3>Pressione a tecla ${kbd}</h3>
        </div>`;
      kbTarget(lv.nova);
      game.introFound = () => {
        game.intro = 'found';
        $q('#lc-new').outerHTML = `
          <div class="lc-new ok">
            <h3>Você a encontrou!</h3>
            <p>Lembre-se de onde fica a tecla ${kbd}, pois vamos praticá-la agora!</p>
            <p class="lc-new-go">Pressione <kbd>Enter</kbd> para começar</p>
          </div>`;
        kbTarget('enter');
      };
    }
    function typingInit(lv) {
      if (lv.nova && !game.introDone) return introInit(lv);
      game.intro = null; game.t0 = 0;
      game.pos = 0; game.text = lv.texto;
      // o texto numa linha só; o cursor avança a cada tecla certa
      $q('#lc-stage').innerHTML = `
        <div class="lc-line">
          <div class="lc-line-text">${[...lv.texto].map((c, i) => `<span class="lc-ch${c === ' ' ? ' sp' : ''}" data-i="${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</div>
          <span class="lc-start-tip" id="lc-start-tip">Comece a digitar</span>
        </div>
        <p class="lc-home">Volte os dedos para a posição inicial <kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><kbd>F</kbd> – <kbd>J</kbd><kbd>K</kbd><kbd>L</kbd><kbd>Ç</kbd> depois de cada tecla</p>`;
      typingPaint();
    }
    function typingPaint() {
      view.querySelectorAll('.lc-ch').forEach((el, i) => { el.classList.toggle('ok', i < game.pos); el.classList.toggle('cur', i === game.pos); });
      if (game.pos > 0) $q('#lc-start-tip')?.remove();
      kbTarget(game.text[game.pos] ?? null);
    }
    function typingKey(k) {
      const want = game.text[game.pos];
      if (k === want) {
        if (!game.t0) game.t0 = performance.now();
        hit(k); game.pos++; typingPaint();
        const min = (performance.now() - game.t0) / 60000;
        if (game.pos >= game.text.length) setTimeout(complete, 250);
      } else {
        miss(k);
        const cur = view.querySelector(`.lc-ch[data-i="${game.pos}"]`);
        cur?.classList.remove('bad'); void cur?.offsetWidth; cur?.classList.add('bad'); setTimeout(() => cur?.classList.remove('bad'), 450);
      }
    }

    /* ---------- MINIJOGO: VARREDURA HACKER ---------- */
    function hackerInit(lv) {
      game.score = 0; game.meta = lv.meta; game.limit = Math.max(2.2, 5 * (1.6 / (lv.velocidade || 1.6))); // fica mais curto nos níveis mais rápidos
      game.left = game.limit; game.target = L.teclas[Math.floor(Math.random() * L.teclas.length)]; game.paused = true;
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-hacker">
          <div class="lc-term-bar"><span>Terminal de segurança</span><span id="lc-left">Tempo: ${game.limit.toFixed(1)}s</span></div>
          <div class="lc-hk-keys">${L.teclas.map((k) => `<div class="lc-hk" data-hk="${k === ' ' ? 'space' : k}"><svg class="lc-ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/><circle class="lc-ring-v" cx="18" cy="18" r="15"/></svg><b>${keyGlyph(k)}</b><small>${keyLabel(k)}</small></div>`).join('')}</div>
          <p class="lc-term-foot">Tecle a tecla destacada antes que o tempo acabe</p>
          ${startOverlay('Varredura Hacker')}
        </div>`;
      goal(0, game.meta); hackerPaint(); bindStart();
    }
    function hackerPaint() {
      const pct = Math.max(0, game.left / game.limit);
      const col = pct > .55 ? '#34d399' : pct > .28 ? '#fbbf24' : '#f43f5e';
      view.querySelectorAll('.lc-hk').forEach((el) => {
        const on = (el.dataset.hk === 'space' ? ' ' : el.dataset.hk) === game.target;
        el.classList.toggle('on', on); el.style.setProperty('--c', col); el.style.setProperty('--p', on ? pct : 0);
      });
      const l = $q('#lc-left'); if (l) l.textContent = `Tempo: ${game.left.toFixed(1)}s`;
      kbTarget(game.target);
    }
    function hackerNext() { const pool = L.teclas.filter((k) => k !== game.target); game.target = pool[Math.floor(Math.random() * pool.length)]; game.left = game.limit; }
    function hackerBurst(k, ok) {
      const el = view.querySelector(`.lc-hk[data-hk="${k === ' ' ? 'space' : k}"]`); if (!el) return;
      const b = document.createElement('i'); b.className = 'lc-burst' + (ok ? '' : ' bad'); el.appendChild(b); setTimeout(() => b.remove(), 700);
    }
    function hackerRun() {
      game.timer = setInterval(() => {
        if (!alive || busy || document.visibilityState !== 'visible') return;
        game.left -= .05;
        if (game.left <= 0) { hackerBurst(game.target, false); miss(null); hackerNext(); }
        hackerPaint();
      }, 50);
    }
    function hackerKey(k) {
      if (k === game.target) {
        hit(k); hackerBurst(k, true); game.score++; goal(game.score, game.meta);
        if (game.score >= game.meta) return setTimeout(complete, 400);
        hackerNext(); hackerPaint();
      } else { miss(k); shake(`.lc-hk[data-hk="${game.target === ' ' ? 'space' : game.target}"]`); }
    }

    /* ---------- MINIJOGO: FILA DE ANCORAGEM ---------- */
    function filaInit(lv) {
      game.score = 0; game.meta = lv.meta;
      game.queue = Array.from({ length: lv.meta }, (_, i) => ({ id: i, k: L.teclas[Math.floor(Math.random() * L.teclas.length)] }));
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-fila">
          <div class="lc-lanes">${L.teclas.map(() => '<span></span>').join('')}</div>
          <div class="lc-dock">${L.teclas.map((k) => `<span>${keyLabel(k)}</span>`).join('')}</div>
          <div class="lc-fila-items" id="lc-fila"></div>
        </div>`;
      goal(0, game.meta); filaPaint();
    }
    function filaPaint() {
      const box = $q('#lc-fila'); if (!box) return;
      const lane = (k) => (L.teclas.indexOf(k) + .5) / L.teclas.length * 100;
      const show = game.queue.slice(0, 5);
      // reaproveita os blocos que já estão na tela, para eles deslizarem até o alvo
      [...box.children].forEach((el) => { if (!show.some((q) => String(q.id) === el.dataset.id)) el.remove(); });
      show.forEach((q, i) => {
        let el = box.querySelector(`[data-id="${q.id}"]`);
        if (!el) { el = document.createElement('span'); el.className = 'lc-fk'; el.dataset.id = q.id; el.textContent = keyGlyph(q.k); el.style.left = lane(q.k) + '%'; el.style.bottom = (18 + 5 * 52) + 'px'; box.appendChild(el); void el.offsetWidth; }
        el.style.bottom = (18 + i * 52) + 'px'; el.classList.toggle('on', i === 0);
      });
      kbTarget(game.queue[0]?.k ?? null);
    }
    function filaKey(k) {
      const first = game.queue[0]; if (!first) return;
      if (k === first.k) {
        hit(k); game.queue.shift(); game.score++; goal(game.score, game.meta); filaPaint();
        if (game.score >= game.meta) setTimeout(complete, 300);
      } else { miss(k); shake('.lc-fk.on'); }
    }

    /* ---------- MINIJOGO: ECO DA MEMÓRIA ---------- */
    function memoInit(lv) {
      game.rounds = lv.rodadas; game.round = 0; game.state = 'idle';
      $q('#lc-stage').innerHTML = `
        <div class="lc-memo">
          <p class="lc-memo-msg" id="lc-memo-msg"></p>
          <div class="lc-memo-keys">${L.teclas.map((k) => `<button type="button" class="lc-mk${k === ' ' ? ' space' : ''}" data-mk="${k === ' ' ? 'space' : k}">${keyLabel(k)}</button>`).join('')}</div>
        </div>`;
      view.querySelectorAll('.lc-mk').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); press(b.dataset.mk === 'space' ? ' ' : b.dataset.mk); }));
      goal(0, game.rounds.length);
      setTimeout(memoShow, 600);
    }
    const memoMsg = (t, cls = '') => { const m = $q('#lc-memo-msg'); if (m) { m.textContent = t; m.className = 'lc-memo-msg ' + cls; } };
    const memoKey = (k) => view.querySelector(`.lc-mk[data-mk="${k === ' ' ? 'space' : k}"]`);
    async function memoShow() {
      if (!alive || busy || !$q('#lc-memo-msg')) return;
      const len = game.rounds[game.round];
      game.seq = Array.from({ length: len }, () => L.teclas[Math.floor(Math.random() * L.teclas.length)]);
      game.input = 0; game.state = 'show';
      memoMsg(`Memorize a sequência de ${len} teclas…`, 'show');
      await sleep(700);
      for (const k of game.seq) {
        if (!alive || !$q('#lc-memo-msg')) return;
        const b = memoKey(k); b?.classList.add('lit'); kbTarget(k); await sleep(520); b?.classList.remove('lit'); kbTarget(null); await sleep(300);
      }
      game.state = 'play'; memoMsg('Sua vez! Repita a sequência.', 'play'); // na sua vez, o teclado não entrega a resposta
    }
    function memoPress(k) {
      if (game.state !== 'play') return;
      const b = memoKey(k);
      if (k === game.seq[game.input]) {
        hit(k); game.input++; b?.classList.remove('good'); void b?.offsetWidth; b?.classList.add('good'); setTimeout(() => b?.classList.remove('good'), 300);
        if (game.input === game.seq.length) {
          game.state = 'idle'; game.round++; goal(game.round, game.rounds.length);
          if (game.round >= game.rounds.length) { memoMsg('Sequência correta!', 'ok'); return setTimeout(complete, 700); }
          memoMsg('Sequência correta! Agora uma maior…', 'ok'); setTimeout(memoShow, 1200);
        }
      } else {
        miss(k); game.state = 'idle'; b?.classList.add('wrong'); setTimeout(() => b?.classList.remove('wrong'), 450);
        memoMsg('Tecla errada. Vamos de novo!', 'err'); setTimeout(memoShow, 1400);
      }
    }

    /* ---------- início dos minijogos de tempo (botão + 3, 2, 1) ---------- */
    const startOverlay = (name) => `<div class="lc-start" id="lc-start"><span>${svg('play', true)}</span><h4>${name}</h4><button type="button" class="lc-start-btn">Iniciar minijogo</button><small>ou aperte Enter</small></div>`;
    function bindStart() { $q('.lc-start-btn')?.addEventListener('click', countdown); }
    async function countdown() {
      const ov = $q('#lc-start'); if (!ov || game.counting) return; game.counting = true;
      for (const n of [3, 2, 1]) { if (!ov.isConnected) return; ov.innerHTML = `<b class="lc-count">${n}</b>`; await sleep(800); }
      if (!ov.isConnected) return;
      ov.remove(); game.paused = false; hackerRun();
    }
    function shake(sel) { const el = view.querySelector(sel); if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

    /* ---------- teclado (físico e da tela) ---------- */
    function press(k) {
      if (phase !== 'play' || busy) return;
      const lv = L.niveis[st.lvl]; if (!lv) return;
      if (game.intro) { // apresentação da tecla nova: sem pontos nem erros
        if (game.intro === 'find' && k === game.nova) { kb?.flash(k, true); return game.introFound(); }
        kb?.flash(k, false); return shake('.lc-new h3 kbd');
      }
      if (lv.tipo === 'typing') return typingKey(k);
      if (lv.tipo === 'memoria') return memoPress(k);
      if (lv.tipo === 'fila') return filaKey(k);
      if (lv.tipo === 'hacker') { if (game.paused) return; return hackerKey(k); }
    }
    function onKey(e) {
      if (!view.isConnected || !$q('.lc')) return stop();
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.target.closest?.('input, textarea, select')) return;
      const k = e.key === ' ' || e.key === 'Spacebar' ? ' ' : (e.key || '').toLowerCase();
      if (phase !== 'play') return;
      const lv = L.niveis[st.lvl];
      if (k === 'enter' && lv?.tipo === 'hacker' && game.paused) { e.preventDefault(); return countdown(); }
      if (game.intro === 'found' && k === 'enter') { e.preventDefault(); kb?.flash('enter', true); game.introDone = true; return smoothResize(() => typingInit(lv)); }
      if (game.intro && k.length === 1) { e.preventDefault(); return press(k); }
      if (L.teclas.includes(k)) { e.preventDefault(); return press(k); }
      // outra letra durante a digitação conta como erro (como no treino original)
      if (lv?.tipo === 'typing' && k.length === 1 && /\S/.test(k) && !busy) { miss(k); shake(`.lc-ch[data-i="${game.pos}"]`); }
    }
    document.addEventListener('keydown', onKey);
    function stop() { alive = false; clearTimeout(kbTimer); clearInterval(speedTick); clearInterval(tick); clearInterval(game.timer); clearInterval(gs.glint); kb?.destroy(); document.removeEventListener('keydown', onKey); }
    window.addEventListener('hashchange', stop, { once: true });

    /* ---------- resultado ---------- */
    function results() {
      phase = 'results'; clearInterval(game.timer); paintProgress();
      st.done = true; st.lvl = N;
      saveProgress(L.id, { ...st });
      const a = accuracy();
      const rating = a >= 88 ? 'Excelente' : a >= 70 ? 'Bom' : 'Regular';
      const times = st.levelTimes.map((t, i) => [t || 0, i]).filter(([t]) => t > 0);
      const fast = times.length ? times.reduce((m, x) => (x[0] < m[0] ? x : m)) : [st.time, 0];
      const slow = times.length ? times.reduce((m, x) => (x[0] > m[0] ? x : m)) : [st.time, 0];
      const g = grade(st.xp);
      const first = (meName() || '').split(' ')[0];
      // todas as informações ficam só na tela final animada; por baixo fica apenas um espaço vazio
      body.innerHTML = '<section class="lc-results-blank" aria-hidden="true"></section>';
      showFinale({ a, rating, fast, slow, g });
    }

    /* ---------- tela final animada (por cima da área da plataforma) ----------
       Faixas brancas → fundo de cor vibrante sorteada → "Parabéns!" e a faixa com a foto e o nome →
       a barra de pontos enche, as estrelas acendem e, se der, explode o Superstar/Megastar →
       o "carregando" vira o botão Continuar e os outros resultados aparecem embaixo. */
    const LR_COLORS = [
      ['#e11d48', '#7f1028'], ['#db2777', '#6b0f4a'], ['#7c3aed', '#2e1065'], ['#2563eb', '#172554'],
      ['#0891b2', '#083344'], ['#ea580c', '#7c2d12'], ['#16a34a', '#14532d'], ['#c026d3', '#4a044e'],
    ];
    /* "Parabéns!" entra decifrando: cada letra troca por letras e símbolos até achar a certa (da esquerda para a direita) */
    function decode(h, delay) {
      if (!h) return;
      const word = h.textContent.trim(), POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#$%&*+=?;:_';
      h.setAttribute('aria-label', word);
      h.innerHTML = [...word].map((c) => `<span class="lr-ch" aria-hidden="true">${esc(c)}</span>`).join('');
      const spans = [...h.children];
      spans.forEach((s) => { s.style.width = `${s.getBoundingClientRect().width}px`; }); // trava a largura de cada letra para nada pular
      const rnd = () => POOL[Math.floor(Math.random() * POOL.length)];
      spans.forEach((s) => { s.classList.add('scr'); s.textContent = rnd(); });
      const at = spans.map((_, i) => 350 + i * 120 + Math.random() * 90); // quando cada letra se acerta
      let t0 = 0, last = 0;
      const tick = (now) => {
        if (!h.isConnected) return;
        if (!t0) t0 = now;
        const t = now - t0, swap = now - last > 55;
        if (swap) last = now;
        let left = 0;
        spans.forEach((s, i) => {
          if (!s.classList.contains('scr')) return;
          if (t >= at[i]) { s.classList.remove('scr'); s.classList.add('ok'); s.textContent = word[i]; }
          else { left++; if (swap) s.textContent = rnd(); }
        });
        if (left) requestAnimationFrame(tick);
      };
      setTimeout(() => requestAnimationFrame(tick), delay);
    }
    function showFinale({ a, rating, fast, slow, g }) {
      document.querySelector('.lr')?.remove();
      const pts = Math.min(PTS_MAX, Math.round((st.levelPts || []).reduce((t, x) => t + (x || 0), 0)));
      const rk = rankOf(pts);
      let ci; try { const last = +sessionStorage.getItem('hc:lr:c'); do { ci = Math.floor(Math.random() * LR_COLORS.length); } while (ci === last && LR_COLORS.length > 1); sessionStorage.setItem('hc:lr:c', ci); } catch { ci = Math.floor(Math.random() * LR_COLORS.length); }
      const [c1, c2] = LR_COLORS[ci];
      const sb = document.querySelector('.sidebar');
      const left = sb && getComputedStyle(sb).display !== 'none' ? Math.max(0, Math.round(sb.getBoundingClientRect().right)) : 0;
      const name = meName() || 'Aluno';
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const el = document.createElement('div');
      el.className = 'lr'; el.style.cssText = `left:${left}px;--c1:${c1};--c2:${c2}`;
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Resultado da lição');
      el.innerHTML = `
        <div class="lr-bg"></div>
        <div class="lr-panel"><div class="lr-code" aria-hidden="true">${typeof infoBgRows === 'function' ? infoBgRows(14) : ''}</div><div class="lr-rays">${[0, 1, 2, 3, 4, 5].map((k) => `<i style="--k:${k}"></i>`).join('')}</div></div>
        <div class="lr-scroll">
          <div class="lr-stage">
            <h2 class="lr-congrats">Parabéns!</h2>
            <div class="lr-ribbon">
              <span class="lr-tab"></span>
              ${userAvatar(auth.profile || { name }, 'lr-av')}
              <div class="lr-who"><strong>${esc(name)}</strong><small>Lição ${L.numero} · ${esc(L.titulo)}</small><div class="lr-track"><div class="lr-bar"><i class="lr-fill"><b class="lr-beam"></b></i></div><div class="lr-rstars">${STAR_AT.map((_, i) => `<span class="lr-rstar" style="--i:${i}">${['amarela', 'superstar', 'megastar'].map((k) => `<img class="s-${k}" src="assets/estrelas/estrela-${k}.png" alt="" draggable="false">`).join('')}</span>`).join('')}</div><b class="lr-rnum">0</b></div></div>
              <div class="lr-score">
                <div class="lr-stars">${STAR_AT.map((_, i) => `<span class="lr-star" style="--i:${i}">${['vazia', 'amarela', 'superstar', 'megastar'].map((k) => `<img class="s-${k}" src="assets/estrelas/estrela-${k}.png" alt="" draggable="false">`).join('')}</span>`).join('')}</div>
                <b class="lr-num">0</b>
                <span class="lr-badge">${rk ? `<img src="assets/estrelas/titulo-${rk === 'mega' ? 'megastar' : 'superstar'}.png" alt="${RANK_NAME[rk]}">` : `${starsOf(pts)} ${starsOf(pts) === 1 ? 'estrela' : 'estrelas'}`}</span>
              </div>
              <div class="lr-burst" aria-hidden="true"><i class="lr-ring"></i><i class="lr-ring r2"></i>${Array.from({ length: 10 }, (_, k) => `<i class="lr-spark" style="--a:${k * 36}deg"></i>`).join('')}<span class="lr-word"></span></div>
            </div>
            <div class="lr-more">
              <div class="lr-cards">
                <div class="lr-card wide" style="--w1:#10b981;--w2:#047857"><span class="lr-ci">${svg('target')}</span><small>Desempenho de precisão</small><strong>${rating} · ${a.toFixed(1)}%</strong><b class="lr-mini"><i style="width:${Math.min(100, a)}%"></i></b></div>
                <div class="lr-card" style="--w1:#fbbf24;--w2:#d97706"><span class="lr-ci">${svg('star', true)}</span><small>Pontuação</small><strong>${pts.toLocaleString('pt-BR')}<em> de ${PTS_MAX.toLocaleString('pt-BR')}</em></strong></div>
                <div class="lr-card" style="--w1:#a78bfa;--w2:#6d28d9"><span class="lr-ci">${svg('trophy')}</span><small>XP conquistado</small><strong>${st.xp.toLocaleString('pt-BR')} XP</strong></div>
                <div class="lr-card" style="--w1:#38bdf8;--w2:#0369a1"><span class="lr-ci">${svg('clock')}</span><small>Tempo total</small><strong>${dur(st.time)}</strong></div>
                <div class="lr-card" style="--w1:#fb923c;--w2:#c2410c"><span class="lr-ci">${svg('zap')}</span><small>Mais rápido · nível ${fast[1] + 1}</small><strong>${dur(fast[0])}</strong></div>
                <div class="lr-card" style="--w1:#f472b6;--w2:#be185d"><span class="lr-ci">${svg('snail')}</span><small>Mais demorado · nível ${slow[1] + 1}</small><strong>${dur(slow[0])}</strong></div>
                <div class="lr-card" style="--w1:#2dd4bf;--w2:#0f766e"><span class="lr-ci">${svg('level')}</span><small>Grau de experiência</small><strong>Grau ${g.g}</strong><b class="lr-mini"><i style="width:${g.pct}%"></i></b></div>
              </div>
              <div class="lr-acts">
                <button type="button" class="lr-btn" data-lr="report">${svg('download')}Baixar relatório</button>
                <button type="button" class="lr-btn" data-lr="again">${svg('refresh')}Refazer a lição</button>
              </div>
            </div>
          </div>
        </div>
        <div class="lr-foot"><span class="lr-wait" role="status"><em>Aguarde, registrando seus dados</em><span class="lr-spin" aria-hidden="true"></span></span><button type="button" class="lr-go" data-lr="go">Continuar ${svg('play', true)}</button></div>
        <div class="lr-bands">${[0, 1, 2, 3, 4, 5, 6].map((k) => `<i style="--k:${k}"></i>`).join('')}</div>`;
      document.body.append(el);
      requestAnimationFrame(() => el.classList.add('in'));
      if (!reduce) decode(el.querySelector('.lr-congrats'), 2000);
      ['superstar', 'megastar'].forEach((k) => { new Image().src = `assets/estrelas/titulo-${k}.png`; }); // já deixa as imagens prontas

      const num = el.querySelector('.lr-num'), fill = el.querySelector('.lr-fill'), stars = el.querySelectorAll('.lr-star');
      const track = el.querySelector('.lr-track'), rnum = el.querySelector('.lr-rnum'), rstars = el.querySelectorAll('.lr-rstar'), beam = el.querySelector('.lr-beam');
      const burst = el.querySelector('.lr-burst'), word = el.querySelector('.lr-word');
      const showRank = (r) => {
        el.classList.remove('super', 'mega'); el.classList.add(r);
        word.innerHTML = `<img src="assets/estrelas/titulo-${r === 'mega' ? 'megastar' : 'superstar'}.png" alt="${RANK_NAME[r]}">`; burst.classList.remove('go'); void burst.offsetWidth; burst.classList.add('go');
      };
      const paint = (v) => {
        num.textContent = rnum.textContent = Math.round(v).toLocaleString('pt-BR');
        track.style.setProperty('--p', (v / PTS_MAX).toFixed(4)); // estrelas e pontos andam junto com a ponta da barra
        fill.style.transform = `scaleX(${(v / PTS_MAX).toFixed(4)})`;
        // cada estrela nova surge na ponta da barra (as antigas vão ficando atrás) e um feixe de brilho corre pela parte cheia
        rstars.forEach((s, i) => { if (v >= STAR_AT[i] && !s.classList.contains('on')) { s.classList.add('on'); beam.classList.remove('go'); void beam.offsetWidth; beam.classList.add('go'); } });
        if (v >= MEGA_AT && !el.classList.contains('mega')) showRank('mega');
        else if (v >= SUPER_AT && v < MEGA_AT && !el.classList.contains('super')) showRank('super');
      };
      // no fim: as estrelas da barra dão um pulinho e somem encolhendo para trás; só então aparecem no lugar delas, ao lado dos pontos
      const land = () => { el.classList.add('land'); stars.forEach((s, i) => s.classList.toggle('on', pts >= STAR_AT[i])); };
      const finish = () => {
        paint(pts);
        if (reduce) { land(); el.classList.add('done'); return; }
        const n = starsOf(pts);
        el.classList.add('leave');
        const wait = 650 + n * 110;
        setTimeout(() => { if (!el.isConnected) return; land(); setTimeout(() => { el.classList.add('done'); setTimeout(() => confetti(el), 500); }, n ? 500 + n * 140 : 0); }, wait);
      };
      const D = 15000, START = reduce ? 0 : 3200; // a barra leva 15 s para encher, com as estrelas acendendo no caminho
      setTimeout(() => {
        if (!el.isConnected) return;
        if (reduce || !pts) return finish();
        el.classList.add('counting');
        const t0 = performance.now();
        const step = (now) => {
          if (!el.isConnected) return;
          const p = Math.min(1, (now - t0) / D);
          paint(pts * (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)); // começa devagar, acelera e assenta
          if (p < 1) requestAnimationFrame(step); else setTimeout(finish, rk ? 1500 : 600);
        };
        requestAnimationFrame(step);
      }, START);

      const close = (then) => {
        if (el.classList.contains('out')) return;
        el.classList.add('out');
        setTimeout(() => { then?.(); el.classList.add('gone'); setTimeout(() => el.remove(), 700); }, reduce ? 0 : 1100);
      };
      // Continuar: a mesma abertura do início da lição, com "Retornando à plataforma" embaixo do logo
      el.querySelector('[data-lr="go"]').addEventListener('click', () => {
        const I = window.HC_intro;
        if (reduce || !I) return close(() => { location.hash = '#informatica'; });
        if (el.dataset.leaving) return;
        el.dataset.leaving = '1'; // as faixas da abertura passam por cima da tela de resultado
        const n = parseInt(String(L.id).split('-')[1], 10) || 1;
        I.play(n, L, { label: 'Retornando à plataforma', sub: 'Lição concluída' });
        setTimeout(() => { el.remove(); location.hash = '#informatica'; I.end(); }, I.PEAK + 200);
      });
      el.querySelector('[data-lr="again"]').addEventListener('click', () => close(() => { st = fresh(); play(); }));
      el.querySelector('[data-lr="report"]').addEventListener('click', () => report(a, rating, fast, slow, g));
      const onHash = () => { if (!el.classList.contains('out')) el.remove(); }; // saiu por outro caminho (menu, voltar)
      window.addEventListener('hashchange', onHash, { once: true });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' && el.classList.contains('done') && e.target === el) el.querySelector('[data-lr="go"]').click(); });
    }
    /* confetes: papeizinhos coloridos caindo de cima, num <canvas> leve; param sozinhos depois de alguns segundos */
    function confetti(host) {
      if (!host.isConnected) return;
      const cv = document.createElement('canvas'); cv.className = 'lr-confetti'; host.append(cv);
      const ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
      const size = () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; };
      size(); addEventListener('resize', size);
      const COLORS = ['#ffd60a', '#ff4d8d', '#38bdf8', '#a855f7', '#34d399', '#fb923c', '#ffffff', '#f472b6'];
      const W = () => cv.width, H = () => cv.height, rnd = (a, b) => a + Math.random() * (b - a);
      const make = (y) => ({ x: rnd(0, W()), y, w: rnd(6, 11) * dpr, h: rnd(3, 6) * dpr, vy: rnd(1.6, 3.4) * dpr, vx: rnd(-.6, .6) * dpr,
        r: rnd(0, 6.28), vr: rnd(-.12, .12), sw: rnd(0, 6.28), c: COLORS[Math.floor(Math.random() * COLORS.length)], round: Math.random() < .25 });
      let parts = Array.from({ length: 90 }, () => make(rnd(-H() * .9, -10)));
      const SPAWN_MS = 4200, t0 = performance.now(); let last = t0;
      const frame = (now) => {
        if (!cv.isConnected) return removeEventListener('resize', size);
        const dt = Math.min(3, (now - last) / 16.7); last = now;
        if (now - t0 < SPAWN_MS && parts.length < 220) for (let k = 0; k < 2; k++) parts.push(make(rnd(-40, -10) * dpr));
        ctx.clearRect(0, 0, W(), H());
        parts = parts.filter((q) => q.y < H() + 30 * dpr);
        for (const q of parts) {
          q.sw += .05 * dt; q.y += q.vy * dt; q.x += (q.vx + Math.sin(q.sw) * .9 * dpr) * dt; q.r += q.vr * dt;
          ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.r); ctx.scale(1, Math.cos(q.sw * 1.6)); ctx.fillStyle = q.c;
          if (q.round) { ctx.beginPath(); ctx.arc(0, 0, q.h, 0, 6.28); ctx.fill(); } else ctx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h);
          ctx.restore();
        }
        if (parts.length || now - t0 < SPAWN_MS) requestAnimationFrame(frame); else { cv.remove(); removeEventListener('resize', size); }
      };
      requestAnimationFrame(frame);
    }
    function report(a, rating, fast, slow, g) {
      const name = meName() || 'Aluno';
      const txt = `RELATÓRIO DE DESEMPENHO — LIÇÃO ${L.numero}: ${L.titulo.toUpperCase()} (${N} NÍVEIS)
---------------------------------------------------
Aluno: ${name}
Atividade: Plataforma de Informática — HC Instituto Educacional
Data: ${new Date().toLocaleDateString('pt-BR')}

RESULTADOS
- Tempo total: ${fmt(st.time)}
- Precisão: ${a.toFixed(1)}%
- Toques certos: ${st.hits}
- Toques errados: ${st.errors}
- Experiência: grau ${g.g} (${st.xp} XP)
- Nível mais rápido: nível ${fast[1] + 1} (${dur(fast[0])})
- Nível mais demorado: nível ${slow[1] + 1} (${dur(slow[0])})
- Desempenho geral: ${rating.toUpperCase()}
---------------------------------------------------
`;
      const url = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
      const link = Object.assign(document.createElement('a'), { href: url, download: `Relatorio_Licao_${L.numero}_${name.replace(/\s+/g, '_')}.txt` });
      document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    welcome();
  }

  window.HC_licao = { open };
})();
