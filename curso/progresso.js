/* =========================================================
   PLATAFORMA DE INFORMÁTICA — tela de progresso (#informatica/progresso)
   Aberta pelo botão "progresso" da tela de seleção (curso/menu.js). Mesmo visual do menu:
   fundo escuro com luzes de aurora e malha de pontinhos, e a faixa branca na diagonal,
   aqui cobrindo mais da metade da tela.
   - Na faixa branca: foto, nome e patente; o nível e o XP; aulas, questionários e provas.
   - No lado escuro: estrelas, Saldo HC e quantos níveis faltam nos módulos.
   Os números vêm prontos de progressData() (curso/plataforma.js), contados na hora a partir do que
   está salvo: quando entram lições, aulas ou provas novas, os totais crescem sozinhos.
   Esc (ou o botão Voltar) volta para a tela de seleção.
   ========================================================= */
(() => {
  const n = (v) => Math.round(v).toLocaleString('pt-BR');
  const pad = (v) => String(v).padStart(2, '0');
  const ICO = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M8 7h7M8 11h5"/>',
    quiz: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    exam: '<path d="M9 12l2 2 4-4"/><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[k]}</svg>`;
  /* número que conta do zero até o valor (data-to); data-dec = casas decimais */
  const num = (v, dec = 0) => `<b class="pg-num" data-to="${v}" data-dec="${dec}">${dec ? (window.HC_cashFmt?.(v) || v) : n(v)}</b>`;

  let run = 0;
  function render(view, d) {
    const id = ++run;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const S = window.HC_menu?.SCENES || [{ b: '16 20 38', a1: '56 189 248', a2: '167 139 250', a3: '244 114 182' }];
    const sc = S[Math.floor(Math.random() * S.length)];
    const x = d.xp, pt = d.patente, nv = d.niveis;
    const pctNiv = nv.total ? nv.feitos / nv.total : 0;
    const R = 52, C = 2 * Math.PI * R; // anel dos níveis
    const card = (cls, ico, title, val, tot, sub, i) => `
          <article class="pg-card ${cls}" style="--i:${i}">
            <span class="pg-card-ico">${svg(ico)}</span>
            <p class="pg-card-t">${title}</p>
            <p class="pg-card-v">${num(val)}<small>de ${n(tot)}</small></p>
            <span class="pg-card-bar"><i style="--p:${tot ? Math.min(1, val / tot) : 0}"></i></span>
            <p class="pg-card-s">${sub}</p>
          </article>`;

    view.innerHTML = `
    <section class="pg${reduce ? ' still' : ''}" aria-label="Seu progresso na Plataforma de Informática">
      <div class="pg-bg" aria-hidden="true"><div class="ifm-sky on" style="--b:${sc.b};--a1:${sc.a1};--a2:${sc.a2};--a3:${sc.a3}"></div><div class="ifm-dots"></div></div>
      <div class="pg-white" aria-hidden="true"></div>

      <div class="pg-main">
        <a class="pg-back" href="#informatica">${svg('back')}Voltar</a>
        <header class="pg-hero" style="--i:0">
          <div class="pg-photo">${window.HC_loja ? window.HC_loja.avatar(d.perfil, 'pg-avatar') : typeof userAvatar === 'function' ? userAvatar(d.perfil, 'pg-avatar') : ''}<img class="pg-medal" src="${pt.img}" alt="" draggable="false"></div>
          <div class="pg-who">
            <h1 class="pg-title">progresso</h1>
            <p class="pg-name">${esc(d.nome || 'Aluno')}</p>
            <p class="pg-rank" style="--c1:${pt.c1};--c2:${pt.c2}"><b>${esc(pt.nome)}</b>${pt.next ? `<span>faltam ${n(pt.falta)} XP para ${esc(pt.next.nome)}</span>` : '<span>patente máxima</span>'}</p>
          </div>
        </header>

        <section class="pg-level" style="--i:1" aria-label="Nível ${x.nivel}, ${n(x.xp)} XP">
          <div class="pg-lv-badge"><small>Nível</small><b>${pad(x.nivel)}</b></div>
          <div class="pg-lv-main">
            <div class="pg-lv-top"><span class="pg-lv-xp">${num(x.xp)} <em>XP</em></span><span class="pg-lv-next">Faltam <b>${n(x.falta)} XP</b> para o nível ${pad(x.nivel + 1)}</span></div>
            <span class="pg-lv-bar"><i style="--p:${(x.pct / 100).toFixed(4)}"></i></span>
            <small class="pg-lv-sub">${n(x.rest)} de ${n(x.proximo)} XP neste nível · ${d.licoes.feitas} de ${d.licoes.total} ${d.licoes.total === 1 ? 'lição concluída' : 'lições concluídas'}</small>
          </div>
        </section>

        <div class="pg-cards">
          ${card('c-aula', 'book', 'Aulas concluídas', d.aulas.feitas, d.aulas.total, 'aprovadas com nota 7 ou mais', 2)}
          ${card('c-quiz', 'quiz', 'Questionários', d.questionarios.feitos, d.questionarios.total, `${n(d.questionarios.tentativas)} ${d.questionarios.tentativas === 1 ? 'tentativa enviada' : 'tentativas enviadas'}`, 3)}
          ${card('c-prova', 'exam', 'Provas feitas', d.provas.feitas, d.provas.total, `${d.provas.aprovadas} ${d.provas.aprovadas === 1 ? 'aprovada' : 'aprovadas'}`, 4)}
        </div>
      </div>

      <aside class="pg-side" aria-label="Conquistas">
        <article class="pg-tile t-star" style="--i:2">
          <img class="pg-tile-img" src="assets/estrelas/estrela-${d.megastar ? 'megastar' : d.superstar ? 'superstar' : 'amarela'}.png" alt="" draggable="false">
          <p class="pg-tile-t">Estrelas</p>
          <p class="pg-tile-v">${num(d.estrelas)}<small>de ${n(d.estrelasMax)}</small></p>
          <p class="pg-tile-s">${[d.megastar && `${d.megastar} Megastar`, d.superstar && `${d.superstar} Superstar`].filter(Boolean).join(' · ') || 'Conclua lições para ganhar estrelas'}</p>
        </article>
        <article class="pg-tile t-cash" style="--i:3">
          <img class="pg-tile-img" src="assets/moeda/moeda.webp" alt="" draggable="false">
          <p class="pg-tile-t">Saldo HC</p>
          <p class="pg-tile-v pg-cash">${num(d.saldo, 2)}</p>
          <p class="pg-tile-s">Ganhe moedas com as estrelas das lições</p>
        </article>
        <article class="pg-tile t-niv" style="--i:4">
          <svg class="pg-ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="${R}"/><circle class="v" cx="60" cy="60" r="${R}" style="--c:${C.toFixed(1)};--p:${pctNiv.toFixed(4)}"/></svg>
          <span class="pg-ring-pct">${Math.round(pctNiv * 100)}%</span>
          <p class="pg-tile-t">Níveis dos módulos</p>
          <p class="pg-tile-v">${nv.faltam ? `${num(nv.faltam)}<small>${nv.faltam === 1 ? 'falta' : 'faltam'}</small>` : '<b class="pg-done">Tudo feito</b>'}</p>
          <p class="pg-tile-s">${n(nv.feitos)} de ${n(nv.total)} níveis feitos</p>
        </article>
      </aside>

      <p class="pg-hint"><kbd>Esc</kbd> para voltar à plataforma</p>
    </section>`;

    const stage = view.querySelector('.pg');
    const alive = () => id === run && stage.isConnected;
    const onKey = (e) => {
      if (!alive()) return document.removeEventListener('keydown', onKey);
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); location.hash = '#informatica'; }
    };
    document.addEventListener('keydown', onKey);

    /* entrada: a faixa branca desliza, os blocos sobem e os números contam */
    const count = () => stage.querySelectorAll('.pg-num').forEach((el) => {
      const to = +el.dataset.to, dec = +el.dataset.dec, fmt = (v) => (dec ? window.HC_cashFmt(v) : n(v));
      if (reduce || !to) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), dur = 1100;
      const step = (t) => { if (!alive()) return; const k = Math.min(1, (t - t0) / dur); el.textContent = fmt(to * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(step); };
      el.textContent = fmt(0); requestAnimationFrame(step);
    });
    if (reduce) { stage.classList.add('in'); return count(); }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!alive()) return;
      stage.classList.add('in');
      setTimeout(() => { if (alive()) { count(); stage.classList.add('go'); } }, 450);
      setTimeout(() => { if (alive()) stage.classList.add('settled'); }, 1100);
    }));
  }

  window.HC_progresso = { render };
})();
