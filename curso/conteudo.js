/* =========================================================
   TELA DE LEITURA DOS "CONTEÚDOS PARA APRENDER" (#informatica/conteudo-<id>)
   Texto dividido em partes, com sumário e barra de leitura; ao lado, o questionário
   sobre o texto (no celular, ele abre numa folha que sobe de baixo).
   Dados de cada conteúdo: curso/conteudos/<id>.js (window.HC_CONTEUDOS[id]).
   Progresso do aluno (partes lidas e respostas) fica no aparelho e na conta
   (tabela informatica_progresso, linha "cont-<id>"), como as lições.
   XP: +20 por pergunta acertada na primeira tentativa e +60 ao terminar a leitura (uma vez só).
   Baixado só quando o aluno abre um conteúdo.
   ========================================================= */
(() => {
  const XP_Q = 20, XP_READ = 60;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
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
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3Z"/>',
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
    return '';
  }

  /* ---------- progresso do aluno ---------- */
  function store(id) {
    const row = `cont-${id}`;
    const key = () => `hc:info:${auth?.user?.id || 'anon'}:${row}`;
    const online = () => auth?.user && typeof sb !== 'undefined' && sb;
    const blank = () => ({ ans: {}, tried: [], read: [], readXp: false, savedAt: 0 });
    let st; try { st = { ...blank(), ...JSON.parse(localStorage.getItem(key()) || 'null') }; } catch { st = blank(); }
    let t = 0;
    const push = () => { clearTimeout(t); t = 0; if (online()) sb.from('informatica_progresso').upsert({ user_id: auth.user.id, licao: row, dados: st, updated_at: new Date().toISOString() }).then(({ error }) => { if (error) console.info('Conteúdo salvo só neste aparelho:', error.message); }); };
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

  /* ---------- tela ---------- */
  let cleanup = null;
  function open(view, C, meta = {}) {
    cleanup?.();
    const id = meta.id, S = store(id), Q = C.perguntas || [], P = C.partes || [];
    const partIdx = Object.fromEntries(P.map((p, i) => [p.id, i]));
    let cur = 0; // pergunta aberta
    const st = () => S.get();
    const firstOpen = () => { const i = Q.findIndex((_, k) => st().ans[k] === undefined); return i < 0 ? 0 : i; };
    cur = firstOpen();

    view.innerHTML = `
    <div class="ct" style="--tint:${meta.tint || '28, 64, 120'}">
      <div class="ct-readbar" aria-hidden="true"><i></i></div>
      <div class="ct-grid">
        <article class="ct-doc">
          <header class="ct-head">
            <button class="ct-back" type="button">${svg('back')} Conteúdos</button>
            ${meta.image ? `<div class="ct-cover"><img src="${esc(meta.image)}" alt=""></div>` : ''}
            <span class="ct-tag">${esc(C.tag || 'Texto')}</span>
            <h1>${esc(C.titulo)}</h1>
            <p class="ct-sub">${esc(C.subtitulo || '')}</p>
            <div class="ct-meta">
              <span>${svg('clock')} ${C.leitura || 10} min de leitura</span>
              <span>${svg('list')} ${P.length} partes</span>
              <span>${svg('quiz')} ${Q.length} perguntas</span>
            </div>
          </header>
          <nav class="ct-toc" aria-label="Partes do texto">
            <div class="ct-toc-top"><b>Nesta leitura</b><small class="ct-toc-n"></small></div>
            <ol>${P.map((p, i) => `<li><a href="#" data-go="${p.id}"><span class="ct-toc-num">${i + 1}</span><span class="ct-toc-t">${esc(p.titulo)}</span><span class="ct-toc-ok">${svg('check')}</span></a></li>`).join('')}</ol>
          </nav>
          ${P.map((p, i) => `
          <section class="ct-part" id="ct-${p.id}" data-part="${p.id}">
            <span class="ct-num">Parte ${i + 1} de ${P.length}</span>
            <h2>${esc(p.titulo)}</h2>
            ${p.blocos.map(block).join('')}
            <div class="ct-part-q">${Q.some((q) => q.parte === p.id) ? `<button type="button" class="ct-part-btn" data-qpart="${p.id}">${svg('quiz')} Responder as perguntas desta parte</button>` : ''}</div>
            <i class="ct-mark" data-mark="${p.id}"></i>
          </section>`).join('')}
          <footer class="ct-foot"><span class="ct-foot-ico">${svg('check')}</span><b>Fim da leitura</b><p>Agora é com você: responda o questionário e depois pratique na Lição 01.</p>
            <button class="ct-foot-btn" type="button" data-openq>${svg('quiz')} Ir para o questionário</button></footer>
        </article>
        <aside class="ct-quiz" aria-label="Questionário">
          <div class="ctq">
            <div class="ctq-grab" aria-hidden="true"></div>
            <div class="ctq-head">
              <div class="ctq-ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="ctq-ring-v" cx="22" cy="22" r="19"/></svg><b class="ctq-ring-n"></b></div>
              <div class="ctq-ht"><small>Questionário</small><b>Perguntas sobre o texto</b><span class="ctq-sum"></span></div>
              <button class="ctq-close" type="button" aria-label="Fechar o questionário">${svg('x')}</button>
            </div>
            <div class="ctq-dots" role="tablist" aria-label="Perguntas"></div>
            <div class="ctq-body" aria-live="polite"></div>
          </div>
        </aside>
      </div>
      <button class="ct-fab" type="button" data-openq>${svg('quiz')}<span>Questionário</span><b class="ct-fab-n"></b></button>
      <div class="ct-scrim"></div>
    </div>`;

    const root = view.querySelector('.ct'), body = root.querySelector('.ctq-body'), dots = root.querySelector('.ctq-dots');
    const mob = () => matchMedia('(max-width: 1023px)').matches;
    const setSheet = (on) => { root.classList.toggle('q-open', on); document.documentElement.classList.toggle('ct-lock', on && mob()); };
    const goPart = (pid) => {
      setSheet(false);
      const el = root.querySelector(`#ct-${pid}`); if (!el) return;
      const bar = document.querySelector('.topbar-wrap, .topbar'), off = (bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0) + 18;
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - off, behavior: 'smooth' });
    };

    /* placar, bolinhas, sumário */
    const paint = () => {
      const a = st().ans, n = Q.length, done = Object.keys(a).length, ok = Q.filter((q, i) => a[i] === q.certa).length;
      root.querySelector('.ctq-ring-n').textContent = `${done}/${n}`;
      root.querySelector('.ctq-ring-v').style.strokeDasharray = `${(done / n) * 119.4} 200`;
      root.querySelector('.ctq-sum').textContent = done ? `${ok} ${ok === 1 ? 'acerto' : 'acertos'} até agora` : 'Responda conforme lê';
      root.querySelector('.ct-fab-n').textContent = `${done}/${n}`;
      dots.innerHTML = Q.map((q, i) => { const s = a[i] === undefined ? '' : a[i] === q.certa ? ' ok' : ' bad'; return `<button type="button" role="tab" class="ctq-dot${s}${i === cur ? ' cur' : ''}" data-q="${i}" aria-selected="${i === cur}" aria-label="Pergunta ${i + 1}">${i + 1}</button>`; }).join('');
      const read = st().read;
      root.querySelectorAll('.ct-toc a').forEach((x) => x.classList.toggle('read', read.includes(x.dataset.go)));
      root.querySelector('.ct-toc-n').textContent = `${read.length} de ${P.length} lidas`;
    };

    /* pergunta atual, ou o resultado quando todas foram respondidas e ele pediu */
    let showResult = false;
    const drawQ = (focus) => {
      const a = st().ans;
      if (showResult) return drawResult();
      const q = Q[cur], pi = partIdx[q.parte], ans = a[cur], answered = ans !== undefined;
      const allDone = Object.keys(a).length === Q.length;
      body.innerHTML = `
        <div class="ctq-card" style="--i:0">
          <span class="ctq-where">Pergunta ${cur + 1} de ${Q.length}${pi !== undefined ? ` · <button type="button" class="ctq-link" data-go="${q.parte}">Parte ${pi + 1}: ${esc(P[pi].titulo)}</button>` : ''}</span>
          <h3>${md(q.q)}</h3>
          <div class="ctq-ops">${q.op.map((o, k) => {
            const s = !answered ? '' : k === q.certa ? ' right' : k === ans ? ' wrong' : ' dim';
            return `<button type="button" class="ctq-op${s}" data-op="${k}"${answered ? ' disabled' : ''}><span class="ctq-l">${'ABCDEF'[k]}</span><span class="ctq-t">${md(o)}</span>${answered && (k === q.certa || k === ans) ? `<span class="ctq-st">${svg(k === q.certa ? 'check' : 'x')}</span>` : ''}</button>`;
          }).join('')}</div>
          ${answered ? `<div class="ctq-fb ${ans === q.certa ? 'ok' : 'bad'}">
            <b>${ans === q.certa ? 'Resposta certa!' : 'Não foi dessa vez.'}${ans === q.certa && st().gain?.[cur] ? ` <em>+${XP_Q} XP</em>` : ''}</b>
            <p>${md(q.exp)}</p>
            <button type="button" class="ctq-link" data-go="${q.parte}">${svg('eye')} Ver no texto</button>
          </div>` : ''}
          <div class="ctq-nav">
            <button type="button" class="ctq-btn soft" data-step="-1"${cur === 0 ? ' disabled' : ''}>Anterior</button>
            ${allDone ? `<button type="button" class="ctq-btn" data-result>Ver resultado</button>`
              : `<button type="button" class="ctq-btn${answered ? '' : ' soft'}" data-step="1"${cur === Q.length - 1 ? ' disabled' : ''}>${answered ? 'Próxima' : 'Pular'} ${svg('next')}</button>`}
          </div>
        </div>`;
      if (focus) body.querySelector('.ctq-op:not([disabled])')?.focus({ preventScroll: true });
    };
    const drawResult = () => {
      const a = st().ans, ok = Q.filter((q, i) => a[i] === q.certa).length, pct = Math.round((ok / Q.length) * 100);
      const msg = pct >= 90 ? ['Excelente!', 'Você dominou o conteúdo. Hora de praticar na Lição 01.'] : pct >= 70 ? ['Muito bem!', 'Você entendeu a maior parte. Revise as perguntas que errou.'] : pct >= 50 ? ['Bom começo', 'Releia as partes marcadas e tente de novo.'] : ['Vale reler', 'Volte ao texto com calma e refaça o questionário.'];
      const wrong = Q.map((q, i) => (a[i] !== q.certa ? i : -1)).filter((i) => i >= 0);
      const xp = Object.keys(st().gain || {}).length * XP_Q + (st().readXp ? XP_READ : 0);
      body.innerHTML = `
        <div class="ctq-card ctq-res">
          <div class="ctq-big" style="--p:${pct}"><b>${ok}</b><small>de ${Q.length}</small></div>
          <h3>${msg[0]}</h3><p>${msg[1]}</p>
          <div class="ctq-stats"><span><b>${pct}%</b><small>de acertos</small></span><span><b>+${xp}</b><small>XP neste conteúdo</small></span></div>
          ${wrong.length ? `<div class="ctq-rev"><small>Para revisar</small>${wrong.map((i) => `<button type="button" class="ctq-revi" data-q="${i}"><span>${i + 1}</span>${md(Q[i].q)}</button>`).join('')}</div>` : ''}
          <div class="ctq-nav"><button type="button" class="ctq-btn soft" data-q="0">Revisar respostas</button><button type="button" class="ctq-btn" data-redo>${svg('redo')} Refazer</button></div>
          <small class="ctq-note">O XP vale só na primeira tentativa de cada pergunta.</small>
        </div>`;
    };

    /* responder */
    const answer = (k) => {
      const s = st(); if (s.ans[cur] !== undefined) return;
      s.ans[cur] = k;
      const first = !s.tried.includes(cur);
      if (first) s.tried.push(cur);
      if (first && k === Q[cur].certa) { s.gain = { ...(s.gain || {}), [cur]: 1 }; window.HC_xp?.add(XP_Q); }
      S.save(); paint(); drawQ();
      body.querySelector('.ctq-fb')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      if (Object.keys(s.ans).length === Q.length) setTimeout(() => { showResult = true; drawQ(); }, 900);
    };
    const goQ = (i) => { showResult = false; cur = Math.max(0, Math.min(Q.length - 1, i)); paint(); drawQ(true); };

    root.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t || !root.contains(t)) { if (e.target.classList.contains('ct-scrim')) setSheet(false); return; }
      if (t.classList.contains('ct-back')) { location.hash = '#informatica/cursos'; return; }
      if (t.dataset.go) { e.preventDefault(); return goPart(t.dataset.go); }
      if (t.dataset.op !== undefined) return answer(+t.dataset.op);
      if (t.dataset.step) return goQ(cur + +t.dataset.step);
      if (t.dataset.q !== undefined) return goQ(+t.dataset.q);
      if (t.hasAttribute('data-result')) { showResult = true; return drawQ(); }
      if (t.hasAttribute('data-redo')) { st().ans = {}; S.save(); return goQ(0); }
      if (t.dataset.qpart) { const i = Q.findIndex((q, k) => q.parte === t.dataset.qpart && st().ans[k] === undefined); goQ(i >= 0 ? i : Q.findIndex((q) => q.parte === t.dataset.qpart)); setSheet(true); return; }
      if (t.hasAttribute('data-openq')) { setSheet(true); return; }
      if (t.classList.contains('ctq-close')) setSheet(false);
    });
    const onKey = (e) => { if (e.key === 'Escape' && root.classList.contains('q-open')) setSheet(false); };
    addEventListener('keydown', onKey);

    /* partes lidas: quando o fim da parte aparece na tela */
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const s = st(), pid = en.target.dataset.mark; io.unobserve(en.target);
      if (s.read.includes(pid)) return;
      s.read.push(pid);
      if (!s.readXp && s.read.length >= P.length) { s.readXp = true; window.HC_xp?.add(XP_READ); say(`Leitura concluída! +${XP_READ} XP`); }
      S.save(); paint();
    }), { rootMargin: '0px 0px -10% 0px' });
    root.querySelectorAll('[data-mark]').forEach((m) => { if (!st().read.includes(m.dataset.mark)) io.observe(m); });

    /* barra fininha de leitura no alto */
    const fill = root.querySelector('.ct-readbar i'), doc = root.querySelector('.ct-doc');
    let raf = 0;
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const r = doc.getBoundingClientRect(), tot = r.height - innerHeight * .6; fill.style.transform = `scaleX(${Math.max(0, Math.min(1, -r.top / Math.max(1, tot)))})`; }); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    paint(); drawQ();
    window.scrollTo(0, 0);
    S.pull().then((changed) => { if (changed && root.isConnected) { cur = firstOpen(); paint(); drawQ(); } });

    const onHash = () => { if (!root.isConnected || !location.hash.startsWith('#informatica/conteudo-')) cleanup?.(); };
    addEventListener('hashchange', onHash);
    cleanup = () => { io.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('keydown', onKey); removeEventListener('hashchange', onHash); document.documentElement.classList.remove('ct-lock'); S.flush(); cleanup = null; };
  }

  window.HC_conteudo = { open };
})();
