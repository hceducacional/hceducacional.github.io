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
  const STAR_XP = 833;              // XP para encher cada uma das 3 estrelas
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

  /* =========================================================
     Celular e tablet: as lições são feitas só no computador.
     Mostra uma animação (o celular dá lugar ao computador) e o progresso do aluno.
     ========================================================= */
  function computerOnly(view, L, p) {
    const N = L.niveis.length;
    const t = p ? p.hits + p.errors : 0;
    const acc = t ? Math.round((p.hits / t) * 100) : null;
    const lvl = p ? (p.done ? N : Math.min(p.lvl, N)) : 0;
    const first = (meName() || '').split(' ')[0];
    view.innerHTML = `
    <div class="wrap lc">
      <div class="lc-top">
        <a class="lc-back" href="#informatica">${svg('back')}Lições</a>
        <div class="lc-head"><small>Lição ${L.numero}</small><h1>${esc(L.titulo)}</h1></div>
      </div>
      <section class="lc-card lc-pc">
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
    </div>`;
  }

  /* =========================================================
     Abrir uma lição
     ========================================================= */
  async function open(view, L) {
    view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando a lição…</p></div>';
    const saved = await loadProgress(L.id);
    if (!view.isConnected) return;
    const N = L.niveis.length;
    if (!window.HC_isComputer()) return computerOnly(view, L, saved);
    const fresh = () => ({ lvl: 0, xp: 0, time: 0, hits: 0, errors: 0, levelTimes: [], done: false, total: N });
    let st = saved && !saved.done ? { ...fresh(), ...saved } : fresh();
    let alive = true, busy = false, phase = 'welcome', tick = null, lvlStart = 0;
    let game = {}; // estado do nível atual (minijogos)

    view.innerHTML = `
    <div class="wrap lc">
      <div class="lc-top">
        <a class="lc-back" href="#informatica">${svg('back')}Lições</a>
        <div class="lc-head"><small>Lição ${L.numero}</small><h1>${esc(L.titulo)}</h1></div>
        <div class="lc-prog" aria-label="Progresso da lição"><span id="lc-prog-txt"></span><b><i id="lc-prog-bar"></i></b></div>
      </div>
      <div id="lc-body"></div>
    </div>`;
    const body = view.querySelector('#lc-body');
    const $q = (s) => view.querySelector(s);

    const accuracy = () => { const t = st.hits + st.errors; return t ? Math.max(0, (st.hits / t) * 100) : 100; };
    function paintProgress() {
      const done = phase === 'results' ? N : st.lvl;
      $q('#lc-prog-txt').textContent = phase === 'results' ? 'Lição concluída' : `Nível ${Math.min(st.lvl + 1, N)} de ${N}`;
      $q('#lc-prog-bar').style.width = `${(done / N) * 100}%`;
    }

    /* ---------- tela de boas-vindas ---------- */
    function welcome() {
      phase = 'welcome'; paintProgress();
      const resume = saved && !saved.done && st.lvl > 0;
      const finished = saved?.done;
      body.innerHTML = `
      <section class="lc-card lc-welcome">
        <span class="lc-welcome-ico">${svg('play', true)}</span>
        <h2>${resume ? 'Continue de onde parou.' : finished ? 'Lição concluída!' : 'Vamos começar.'}</h2>
        <p>${esc(L.intro)}</p>
        <div class="lc-intro-grid">
          ${L.cards.map(([t, d], i) => `<div class="lc-intro" style="--i:${i}"><b>${String.fromCharCode(65 + i)}</b><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}
        </div>
        <div class="lc-cta">
          ${resume ? `<button class="btn-dark inf-shine" type="button" data-go="resume">Continuar do nível ${st.lvl + 1}</button><button class="btn-soft" type="button" data-go="restart">Recomeçar a lição</button>`
            : finished ? `<button class="btn-dark inf-shine" type="button" data-go="restart">Refazer a lição</button><button class="btn-soft" type="button" data-go="last">Ver o último resultado</button>`
            : `<button class="btn-dark inf-shine" type="button" data-go="restart">Iniciar atividade</button>`}
        </div>
        <p class="lc-note">Use as teclas <b>F</b>, <b>J</b> e a <b>barra de espaço</b>. No celular, toque nas teclas da tela.</p>
      </section>`;
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
        <section class="lc-card lc-main" id="lc-main"></section>
        <aside class="lc-side">
          <div class="lc-stat lc-xp">
            <div class="lc-stars">${[2, 1, 0].map((i) => `<span class="lc-star" data-star="${i}"><span class="lc-star-fill">${svg('star', true)}</span>${svg('star')}</span>`).join('')}</div>
            <strong id="lc-xp">0</strong><small>XP</small>
            <div class="lc-sparks" id="lc-sparks"></div>
          </div>
          <div class="lc-stat"><span class="lc-stat-ico">${svg('clock')}</span><strong id="lc-time" class="lc-mono">00:00</strong><small>Tempo</small></div>
          <div class="lc-stat lc-acc"><div class="lc-tank"><i id="lc-tank"></i><strong id="lc-acc">100%</strong></div><small>Precisão</small></div>
          <div class="lc-stat"><span class="lc-stat-ico">${svg('level')}</span><strong id="lc-grade">01</strong><small>Grau de experiência</small><b class="lc-mini"><i id="lc-grade-bar"></i></b></div>
          ${isAdmin() ? `<label class="lc-admin"><small>Administrador: ir para</small><select id="lc-jump"><option value="">Escolha…</option>${L.niveis.map((n, i) => `<option value="${i}">Nível ${i + 1}</option>`).join('')}<option value="r">Resultado</option></select></label>` : ''}
        </aside>
      </div>`;
      $q('#lc-jump')?.addEventListener('change', (e) => {
        const v = e.target.value; e.target.value = '';
        if (v === 'r') return results();
        if (v !== '') { busy = false; st.lvl = +v; level(); }
      });
      paintStats();
      level();
      clearInterval(tick);
      tick = setInterval(() => {
        if (!view.isConnected || !alive) return stop();
        if (phase === 'play' && !busy && document.visibilityState === 'visible' && !game.paused) { st.time++; $q('#lc-time') && ($q('#lc-time').textContent = fmt(st.time)); }
      }, 1000);
    }

    function paintStats() {
      const x = $q('#lc-xp'); if (!x) return;
      x.textContent = st.xp.toLocaleString('pt-BR');
      view.querySelectorAll('[data-star]').forEach((s) => {
        const i = +s.dataset.star; const pct = Math.min(100, Math.max(0, ((st.xp - i * STAR_XP) / STAR_XP) * 100));
        s.style.setProperty('--fill', pct + '%'); s.classList.toggle('on', pct > 0);
      });
      $q('#lc-time').textContent = fmt(st.time);
      const a = accuracy();
      $q('#lc-acc').textContent = Math.round(a) + '%';
      const tank = $q('#lc-tank'); tank.style.height = a + '%';
      tank.style.background = a >= 88 ? 'linear-gradient(0deg, #059669, #34d399)' : a >= 70 ? 'linear-gradient(0deg, #d97706, #fbbf24)' : 'linear-gradient(0deg, #dc2626, #fb7185)';
      const g = grade(st.xp);
      $q('#lc-grade').textContent = String(g.g).padStart(2, '0');
      $q('#lc-grade-bar').style.width = g.pct + '%';
    }

    /* acerto e erro valem para todos os tipos de nível */
    function hit(k) {
      st.hits++; st.xp += 5; paintStats(); spark(); drop(k, true);
    }
    function miss(k) {
      st.errors++; st.xp = Math.max(0, st.xp - (1 + Math.floor(Math.random() * 6))); paintStats(); if (k) drop(k, false);
    }
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
    function flashPad(k, cls = 'press') {
      const b = view.querySelector(`.lc-pad [data-k="${k === ' ' ? 'space' : k}"]`); if (!b) return;
      b.classList.remove(cls); void b.offsetWidth; b.classList.add(cls); setTimeout(() => b.classList.remove(cls), 220);
    }
    const padHTML = () => `
      <div class="lc-pad" role="group" aria-label="Teclas">
        ${L.teclas.map((k) => `<button type="button" class="lc-key${k === ' ' ? ' space' : ''}" data-k="${k === ' ' ? 'space' : k}"><b>${keyLabel(k)}</b><small>${finger[k] || ''}</small></button>`).join('')}
      </div>`;

    /* ---------- um nível ---------- */
    function level() {
      if (st.lvl >= N) return results();
      busy = false; game = {}; lvlStart = st.time;
      const lv = L.niveis[st.lvl];
      const isGame = lv.tipo !== 'typing';
      const main = $q('#lc-main');
      main.innerHTML = `
        <div class="lc-lv-head">
          <span class="lc-kind${isGame ? ' game' : ''}">${isGame ? 'Minijogo' : 'Digitação'}</span>
          <span class="lc-lv-n">Nível ${st.lvl + 1} de ${N}</span>
        </div>
        <h2 class="lc-lv-title">${esc(lv.titulo)}</h2>
        <p class="lc-tip"><b>Dica</b>${esc(lv.dica)}</p>
        ${isGame ? `<div class="lc-goal"><span id="lc-goal-txt"></span><b><i id="lc-goal-bar"></i></b></div>` : ''}
        <div class="lc-stage" id="lc-stage"></div>
        ${padHTML()}
        <div class="lc-over" id="lc-over" hidden></div>`;
      main.querySelectorAll('.lc-key').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); press(b.dataset.k === 'space' ? ' ' : b.dataset.k); }));
      paintProgress();
      ({ typing: typingInit, hacker: hackerInit, fila: filaInit, memoria: memoInit })[lv.tipo](lv);
    }
    function goal(n, total) {
      const t = $q('#lc-goal-txt'), b = $q('#lc-goal-bar'); if (!t) return;
      t.textContent = `Progresso: ${n}/${total}`; b.style.width = `${Math.min(100, (n / total) * 100)}%`;
    }

    /* nível concluído: "Parabéns!" → "Nível X concluído" → próximo */
    async function complete() {
      if (busy) return; busy = true;
      clearInterval(game.timer); game.timer = null;
      st.levelTimes[st.lvl] = Math.max(1, st.time - lvlStart);
      const over = $q('#lc-over'); const n = st.lvl + 1;
      st.lvl++;
      saveProgress(L.id, { ...st, done: false });
      over.hidden = false; over.innerHTML = '<h3 class="lc-pop">Parabéns!</h3>';
      await sleep(900); if (!alive || !over.isConnected) return;
      over.innerHTML = `<h3 class="lc-pop sub">Nível ${n} concluído</h3>`;
      await sleep(1100); if (!alive || !over.isConnected) return;
      level();
    }

    /* ---------- DIGITAÇÃO ---------- */
    function typingInit(lv) {
      game.pos = 0; game.text = lv.texto;
      $q('#lc-stage').innerHTML = `<div class="lc-typing">${[...lv.texto].map((c, i) => `<span class="lc-ch${c === ' ' ? ' sp' : ''}" data-i="${i}">${c === ' ' ? '<small>Esp</small>' : c.toUpperCase()}</span>`).join('')}</div>`;
      typingPaint();
    }
    function typingPaint() {
      view.querySelectorAll('.lc-ch').forEach((el, i) => { el.classList.toggle('ok', i < game.pos); el.classList.toggle('cur', i === game.pos); });
      const next = game.text[game.pos];
      view.querySelectorAll('.lc-key').forEach((b) => b.classList.toggle('next', next !== undefined && (b.dataset.k === 'space' ? ' ' : b.dataset.k) === next));
    }
    function typingKey(k) {
      const want = game.text[game.pos];
      if (k === want) {
        hit(k); game.pos++; typingPaint();
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
        const b = memoKey(k); b?.classList.add('lit'); await sleep(520); b?.classList.remove('lit'); await sleep(300);
      }
      game.state = 'play'; memoMsg('Sua vez! Repita a sequência.', 'play');
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
      flashPad(k);
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
      if (L.teclas.includes(k)) { e.preventDefault(); return press(k); }
      // outra letra durante a digitação conta como erro (como no treino original)
      if (lv?.tipo === 'typing' && k.length === 1 && /\S/.test(k) && !busy) { miss(k); shake(`.lc-ch[data-i="${game.pos}"]`); }
    }
    document.addEventListener('keydown', onKey);
    function stop() { alive = false; clearInterval(tick); clearInterval(game.timer); document.removeEventListener('keydown', onKey); }
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
      body.innerHTML = `
      <section class="lc-results">
        <span class="lc-res-ico">${svg('trophy')}</span>
        <h2>Atividade concluída!</h2>
        <p>Você superou os ${N} níveis da lição${first ? `, <b>${esc(first)}</b>` : ''}.</p>
        <div class="lc-res-grid">
          <div class="lc-res big"><small>Desempenho de precisão</small><strong>${rating} · ${a.toFixed(1)}%</strong></div>
          <div class="lc-res xp"><small>XP conquistado</small><strong>${st.xp.toLocaleString('pt-BR')} XP</strong></div>
          <div class="lc-res"><small>Tempo total</small><strong>${dur(st.time)}</strong></div>
          <div class="lc-res"><span class="lc-res-i">${svg('zap')}</span><small>Mais rápido · nível ${fast[1] + 1}</small><strong>${dur(fast[0])}</strong></div>
          <div class="lc-res"><span class="lc-res-i slow">${svg('snail')}</span><small>Mais demorado · nível ${slow[1] + 1}</small><strong>${dur(slow[0])}</strong></div>
          <div class="lc-res"><small>Grau de experiência</small><strong>Grau ${g.g}</strong><b class="lc-mini"><i style="width:${g.pct}%"></i></b></div>
        </div>
        <div class="lc-cta">
          <a class="btn-dark" href="#informatica">Voltar às lições</a>
          <button class="btn-soft" type="button" data-r="report">${svg('download')}Baixar relatório</button>
          <button class="btn-soft" type="button" data-r="again">${svg('refresh')}Refazer a lição</button>
        </div>
      </section>`;
      body.querySelector('[data-r="again"]').addEventListener('click', () => { st = fresh(); play(); });
      body.querySelector('[data-r="report"]').addEventListener('click', () => report(a, rating, fast, slow, g));
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
