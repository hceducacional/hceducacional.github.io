/* =========================================================
   PLATAFORMA DE INFORMÁTICA — motor das lições (curso/licao.js + licao.css)
   Roda qualquer lição definida em window.HC_LICOES (ex.: curso/licao-01.js):
   digitação, minijogos (Varredura Hacker, Fila de Ancoragem, Corrida das Teclas, Palavras das Estrelas),
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
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  };
  const svg = (k, fill) => `<svg viewBox="0 0 24 24" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;

  /* grau de experiência: grau 1 precisa de 100 XP, cada grau seguinte +10 */
  function grade(xp) {
    let g = 1, rest = xp, need = 100;
    while (rest >= need) { rest -= need; g++; need = 100 + (g - 1) * 10; }
    return { g, pct: (rest / need) * 100 };
  }
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  // reinicia uma animação de classe sem forçar o recálculo da página (dois quadros em vez de ler offsetWidth)
  const replay = (el, cls, extra = []) => { if (!el) return; el.classList.remove(cls, ...extra); requestAnimationFrame(() => requestAnimationFrame(() => el.isConnected && el.classList.add(cls))); };
  const dur = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);

  /* ---------- progresso salvo ---------- */
  const uid = () => auth?.user?.id || 'anon';
  const lsKey = (id) => `hc:info:${uid()}:${id}`;
  const readLocal = (id) => { try { return JSON.parse(localStorage.getItem(lsKey(id)) || 'null'); } catch { return null; } };
  function saveProgress(id, data) {
    window.HC_xp?.flush(); // o XP geral vai para a conta junto com o progresso da lição
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
  const KIND_TINT = { hacker: '24, 46, 110', fila: '30, 70, 90', corrida: '70, 32, 120', estrelas: '30, 28, 92', nave: '14, 26, 70', gp: '40, 20, 90' };
  const CARD_TINTS = ['24, 46, 110', '70, 32, 120', '120, 40, 30', '30, 70, 90'];
  /* cenários do cartão do nível: um sorteado a cada vez que a lição começa (nunca o mesmo da vez anterior).
     base = cor escura do fundo; a1, a2, a3 = as três luzes de aurora que flutuam devagar por trás */
  const SCENES = [
    { nome: 'Aurora boreal', base: '14, 32, 46', a1: '45 212 191', a2: '139 92 246', a3: '34 211 238' },
    { nome: 'Oceano profundo', base: '12, 26, 60', a1: '59 130 246', a2: '6 182 212', a3: '99 102 241' },
    { nome: 'Pôr do sol', base: '50, 18, 42', a1: '244 63 94', a2: '245 158 11', a3: '168 85 247' },
    { nome: 'Galáxia', base: '26, 16, 62', a1: '168 85 247', a2: '236 72 153', a3: '59 130 246' },
    { nome: 'Lavanda', base: '34, 24, 58', a1: '192 132 252', a2: '129 140 248', a3: '240 171 252' },
    { nome: 'Coral', base: '46, 20, 26', a1: '251 113 133', a2: '251 146 60', a3: '250 204 21' },
    { nome: 'Meia-noite', base: '16, 20, 38', a1: '56 189 248', a2: '167 139 250', a3: '244 114 182' },
  ];
  function pickScene() {
    let last = -1;
    try { last = +localStorage.getItem('hc-lc-scene'); } catch {}
    let i = Math.floor(Math.random() * (SCENES.length - 1));
    if (i >= last && last >= 0) i++;
    try { localStorage.setItem('hc-lc-scene', String(i)); } catch {}
    return SCENES[i] || SCENES[0];
  }
  const topHTML = (L, prog, T) => `
      <div class="lc-top">
        <a class="lc-back" href="${T ? esc(T.voltar) : '#informatica/cursos'}">${svg('back')}${T ? 'Acervo' : 'Lições'}</a>
        <h1 class="lc-head"><span class="lc-grad">${T ? 'Teste' : `Lição ${L.numero}`}.</span> <span>${esc(L.titulo)}</span>${T ? '<em class="lc-test-tag">Modo de teste · nada é salvo</em>' : ''}</h1>
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
        <div class="lc-cta"><a class="btn-dark" href="#informatica/cursos">Voltar às lições</a></div>
      </section>
     </div>
    </div>`;
  }

  /* =========================================================
     Abrir uma lição
     ========================================================= */
  /* =========================================================
     TELA DE XP ("Você está subindo de nível!")
     Aparece depois do Continuar da tela final. Fundo e faixa branca iguais aos da tela de
     seleção da plataforma (classes .ifm-* do curso/menu.css). O anel mostra quanto falta para o
     próximo nível: ele enche com o XP ganho na lição e, a cada nível conquistado, completa,
     o número troca com um estouro de brilho e o anel recomeça.
     test = prévia do administrador (XP de mentira, nada é salvo).
     ========================================================= */
  /* cor do miolo do anel conforme o nível: fica em curso/plataforma.js (window.HC_levelColor), usada também no banner do nível */
  const levelColor = (n) => window.HC_levelColor(n);

  function xpScreen({ gained = 0, test = false, onDone }) {
    const X = window.HC_xp; if (!X) return onDone?.();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const now = X.get().xp;
    const before = test ? now : Math.max(0, now - gained);
    const after = before + gained;
    const L0 = X.levelOf(before), L1 = X.levelOf(after);
    const SC = window.HC_menu?.SCENES || [{ b: '46 20 26', a1: '251 113 133', a2: '251 146 60', a3: '250 204 21' }];
    const s = SC[Math.floor(Math.random() * SC.length)];
    const nn = (n) => String(n).padStart(2, '0');
    const fmtN = (v) => Math.round(v).toLocaleString('pt-BR');
    const up = L1.nivel - L0.nivel;
    /* patente (pelo XP total): a cor da faixa e o tom do troféu vêm da família */
    const R0 = X.rankOf ? X.rankOf(before) : null;
    const rVars = (r) => `--rc1:${r.c1};--rc2:${r.c2};--tf:${r.tf}`;
    const el = document.createElement('section');
    el.className = 'ifm xpn';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Seu nível');
    el.innerHTML = `
      <div class="ifm-bg" aria-hidden="true"><div class="ifm-sky on" style="--b:${s.b};--a1:${s.a1};--a2:${s.a2};--a3:${s.a3}"></div><div class="ifm-dots"></div></div>
      <div class="ifm-white" aria-hidden="true"></div>
      <div class="xpn-text">
        <div class="xpn-up" aria-live="polite"><span class="xpn-arrows" aria-hidden="true">${'<i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 15 7-7 7 7"/></svg></i>'.repeat(3)}</span><b>Experiência aumentada</b></div>
        <h2 class="xpn-title"><span>Você está</span> <span>subindo de nível!</span></h2>
        <p class="xpn-gain"><b class="xpn-plus">${gained >= 0 ? '+' : '−'}<span id="xpn-plus">0</span> XP</b> nesta lição</p>
        <p class="xpn-need" id="xpn-need">Faltam <b>${fmtN(L0.falta)} XP</b> para o nível ${nn(L0.nivel + 1)}</p>
        ${R0 ? `
        <div class="xpr" id="xpr" style="${rVars(R0)}">
          <div class="xpr-band">
            <span class="xpr-shine" aria-hidden="true"></span>
            <div class="xpr-info">
              <span class="xpr-kicker">Sua patente <i class="xpr-new" id="xpr-new">Nova patente!</i></span>
              <strong class="xpr-name" id="xpr-name"><span>${esc(R0.nome)}</span></strong>
              <b class="xpr-bar"><i id="xpr-fill"></i></b>
              <p class="xpr-xp" id="xpr-xp"></p>
            </div>
          </div>
          <div class="xpr-cur" aria-hidden="true">
            <span class="xpr-disc"></span>
            <img class="xpr-tro first" id="xpr-tro" src="${R0.img}" alt="" draggable="false">
            <span class="xpr-sparks">${Array.from({ length: 10 }, (_, k) => `<i style="--a:${k * 36}deg"></i>`).join('')}</span>
          </div>
          <div class="xpr-next" id="xpr-next"></div>
        </div>
        <div class="xpr-trail" id="xpr-trail" aria-hidden="true">${Object.keys(X.FAMILIAS).map((f) => `<i data-f="${f}" style="--c1:${X.FAMILIAS[f].c1};--c2:${X.FAMILIAS[f].c2}"></i>`).join('')}</div>` : ''}
      </div>
      <div class="xpn-badge" aria-live="polite">
        <span class="xpn-glow"></span>
        <svg class="xpn-ring" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <linearGradient id="xpnRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f05a5a"/><stop offset="1" stop-color="#c81e3c"/></linearGradient>
            <linearGradient id="xpnGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a2e"/><stop offset="1" stop-color="#ffd84a"/></linearGradient>
            <radialGradient id="xpnGreen" cx=".42" cy=".3" r=".8">${levelColor(L0.nivel).map((c, i) => `<stop class="xr-stop" offset="${[0, .45, 1][i]}" style="stop-color:${c}"/>`).join('')}</radialGradient>
          </defs>
          <circle class="xr-disc" cx="100" cy="100" r="97" fill="url(#xpnRed)"/>
          <circle class="xr-track" cx="100" cy="100" r="79" fill="none" stroke="rgba(0,0,0,.14)" stroke-width="26" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 100 100)"/>
          <circle class="xpn-arc" cx="100" cy="100" r="79" fill="none" stroke="url(#xpnGold)" stroke-width="26" stroke-linecap="butt" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" transform="rotate(-90 100 100)"/>
          <circle class="xr-border" cx="100" cy="100" r="97" fill="none" stroke="#fff" stroke-width="2.5" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 100 100)"/>
          <circle class="xr-white" cx="100" cy="100" r="63" fill="#fff"/>
          <circle class="xr-green" cx="100" cy="100" r="56" fill="url(#xpnGreen)"/>
          <path class="xr-shine" d="M60 78 Q100 40 140 78 L140 70 Q100 30 60 70 Z" fill="rgba(255,255,255,.16)"/>
        </svg>
        <span class="xpn-num" id="xpn-num"><b>${nn(L0.nivel)}</b></span>
        <span class="xpn-burst"><i class="xpn-ring2"></i>${Array.from({ length: 12 }, (_, k) => `<i class="xpn-spark" style="--a:${k * 30}deg"></i>`).join('')}</span>
      </div>
      <p class="ifm-wait xpn-wait" role="status"><em>Aguarde, registrando seus dados</em><span class="ifm-spin" aria-hidden="true"></span></p>
      <button type="button" class="xpn-go">Continuar <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg></button>`;
    document.body.append(el);
    const arc = el.querySelector('.xpn-arc'), numBox = el.querySelector('#xpn-num'), plus = el.querySelector('#xpn-plus');
    const need = el.querySelector('#xpn-need'), badge = el.querySelector('.xpn-badge');
    let arcOn = false; // o arco só aparece depois que o anel está montado (antes, a ponta dele ficava visível)
    const setArc = (pct) => {
      pct = Math.max(0, Math.min(100, pct));
      arc.setAttribute('stroke-dashoffset', (100 - pct).toFixed(2));
      arc.style.opacity = arcOn && pct > .4 ? '' : '0'; // vazio, nem a pontinha aparece
    };
    setArc(0);
    // o arco dourado aparece desenhando até onde o aluno estava, depois que as peças do anel entram
    arc.classList.add('intro');
    setTimeout(() => { if (el.isConnected) { arcOn = true; setArc(L0.pct); } }, reduce ? 0 : 2050);
    setTimeout(() => arc.classList.remove('intro'), reduce ? 0 : 3300);
    let lvShown = L0.nivel;
    /* troca do número: o antigo sobe e some, o novo cai girando com um estouro de brilho */
    const stops = el.querySelectorAll('.xr-stop'), upEl = el.querySelector('.xpn-up');
    /* troca do número em sequência: o antigo encolhe e some primeiro; só então o novo entra, junto com a
       cor nova do miolo (se a faixa de níveis mudou) e o estouro de brilho. Nunca um por cima do outro. */
    let flipT = 0;
    const flip = (n) => {
      clearTimeout(flipT);
      numBox.querySelectorAll('b.out').forEach((x) => x.remove()); // troca anterior ainda saindo: some na hora
      const old = numBox.querySelector('b');
      if (old) { old.className = 'out'; setTimeout(() => old.remove(), 320); }
      flipT = setTimeout(() => {
        if (!el.isConnected) return;
        numBox.querySelectorAll('b:not(.out)').forEach((x) => x.remove());
        const b = document.createElement('b'); b.textContent = nn(n); b.className = 'in'; numBox.append(b);
        levelColor(n).forEach((c, i) => { if (stops[i]) stops[i].style.stopColor = c; });
        badge.classList.remove('boom'); void badge.offsetWidth; badge.classList.add('boom');
        // "Experiência aumentada" surge da esquerda para a direita a cada nível conquistado
        upEl.classList.remove('show', 'rest'); void upEl.offsetWidth; upEl.classList.add('show'); // revela de novo a cada nível
      }, old ? 300 : 0);
    };
    /* ---------- patente ---------- */
    const xpr = el.querySelector('#xpr');
    let rShown = R0 ? R0.i : -1, rTxt = '';
    const nextHTML = (r) => r.next
      ? `<span class="xpr-disc"></span><img class="xpr-tro" src="${r.next.img}" alt="" draggable="false" style="--tf:${r.next.tf}"><span class="xpr-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span><small>Próxima</small><em>${esc(r.next.nome)}</em>`
      : `<span class="xpr-disc max"></span><small>Topo</small><em>Patente máxima</em>`;
    const trail = (r) => el.querySelectorAll('#xpr-trail i').forEach((t) => {
      const fi = X.RANKS.findIndex((k) => k.fam === t.dataset.f);
      t.className = t.dataset.f === r.fam ? 'cur' : fi < r.i ? 'on' : '';
    });
    const rankUp = (r) => {
      xpr.setAttribute('style', rVars(r));
      const nm = el.querySelector('#xpr-name');
      nm.querySelectorAll('span.out').forEach((x) => x.remove());
      const old = nm.querySelector('span'); if (old) { old.className = 'out'; setTimeout(() => old.remove(), 380); }
      const sp = document.createElement('span'); sp.className = 'in'; sp.textContent = r.nome; nm.append(sp);
      const tro = el.querySelector('#xpr-tro'); tro.src = r.img;
      tro.classList.remove('first', 'earn'); void tro.offsetWidth; tro.classList.add('earn');
      const nx = el.querySelector('#xpr-next'); nx.classList.remove('swap'); void nx.offsetWidth; nx.innerHTML = nextHTML(r); nx.classList.add('swap');
      xpr.classList.remove('up'); void xpr.offsetWidth; xpr.classList.add('up');
      trail(r);
    };
    const paintRank = (xp) => {
      const r = X.rankOf(xp);
      if (r.i !== rShown) { rShown = r.i; rankUp(r); }
      el.querySelector('#xpr-fill').style.transform = `scaleX(${(r.pct / 100).toFixed(4)})`;
      const t = r.next ? `<b>${fmtN(xp)}</b> / ${fmtN(r.next.xp)} XP<br>Faltam <b>${fmtN(r.falta)}</b> para ${esc(r.next.nome)}` : `<b>${fmtN(xp)} XP</b> · você está no topo!`;
      if (t !== rTxt) { rTxt = t; el.querySelector('#xpr-xp').innerHTML = t; }
    };
    if (R0) { el.querySelector('#xpr-next').innerHTML = nextHTML(R0); trail(R0); paintRank(before); }
    const paint = (xp) => {
      const l = X.levelOf(xp);
      if (l.nivel !== lvShown) { lvShown = l.nivel; flip(l.nivel); setArc(0); }
      else setArc(l.pct);
      plus.textContent = fmtN(Math.abs(xp - before));
      need.innerHTML = `Faltam <b>${fmtN(l.falta)} XP</b> para o nível ${nn(l.nivel + 1)}`;
      if (R0) paintRank(xp);
    };
    const finish = () => {
      paint(after);
      if (!test) X.flush();
      // as setas param de forma suave: cada uma termina a volta em que está e só então fica a seta parada no centro
      setTimeout(() => {
        if (!upEl.classList.contains('show')) return upEl.classList.add('rest');
        const anims = [...upEl.querySelectorAll('.xpn-arrows i')].flatMap((i) => i.getAnimations());
        anims.forEach((an) => { const it = an.effect.getComputedTiming().currentIteration || 0; an.effect.updateTiming({ iterations: it + 1 }); });
        Promise.all(anims.map((an) => an.finished.catch(() => {}))).then(() => el.isConnected && upEl.classList.add('rest'));
      }, 400);
      setTimeout(() => el.classList.add('done'), reduce ? 0 : 900);
    };
    requestAnimationFrame(() => el.classList.add('in'));
    if (reduce || !gained) { setTimeout(finish, reduce ? 0 : 3400); }
    else {
      /* o anel começa a encher depois da entrada; leva mais tempo quando há níveis a subir */
      const D = Math.min(14000, 4800 + up * 2200); // contagem calma; mais tempo a cada nível conquistado
      setTimeout(() => {
        const t0 = performance.now();
        const step = (t) => {
          if (!el.isConnected) return;
          const p = Math.min(1, (t - t0) / D), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // começa e termina devagar
          paint(before + gained * e);
          if (p < 1) requestAnimationFrame(step); else finish();
        };
        requestAnimationFrame(step);
      }, 3500);
    }
    const go = () => {
      if (el.dataset.leaving) return; el.dataset.leaving = '1';
      if (onDone) return onDone(el);
      el.classList.add('leave'); setTimeout(() => el.remove(), 700);
    };
    el.querySelector('.xpn-go').addEventListener('click', go);
    const onKey = (e) => {
      if (!el.isConnected) return removeEventListener('keydown', onKey, true);
      if (e.key === 'Enter' && el.classList.contains('done')) { e.preventDefault(); e.stopPropagation(); go(); }
      else if (e.key === 'Escape' && test) go();
    };
    addEventListener('keydown', onKey, true);
    addEventListener('hashchange', () => { if (!el.dataset.leaving) el.remove(); }, { once: true });
    return el;
  }

  async function open(view, L, meta = {}) {
    // modo de teste (acervo do professor): roda os níveis de verdade, mas não salva progresso, XP nem moedas
    const TEST = meta.teste || null;
    if (!TEST) window.HC_xp?.pull().catch(() => {}); // traz o XP geral da conta antes de somar o desta lição
    view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando a lição…</p></div>';
    const saved = TEST ? null : await loadProgress(L.id);
    if (!view.isConnected) return;
    const N = L.niveis.length;
    if (!(window.HC_isComputer?.() ?? true)) return computerOnly(view, L, saved, meta);
    const fresh = () => ({ lvl: 0, xp: 0, time: 0, hits: 0, errors: 0, levelTimes: [], levelPts: [], done: false, total: N });
    // progresso salvo antes da pontuação ser dividida entre os níveis: pontos de nível acima da parte de cada um são descartados
    if (saved?.levelPts?.some((x) => x > PTS_MAX / N + 1)) saved.levelPts = [];
    let st = saved && !saved.done ? { ...fresh(), ...saved } : fresh();
    let runXp = 0; // XP ganho (ou perdido) desde que a lição foi aberta, para a tela de XP
    const gain = (n) => { if (!n) return; runXp += n; if (!TEST) window.HC_xp?.add(n); };
    // lição já concluída: o resultado salvo é o recorde do aluno. Refazer não apaga nada;
    // só uma pontuação maior substitui o recorde (no fim da lição)
    let best = saved?.done ? saved : null;
    const ptsOf = (s) => Math.min(PTS_MAX, Math.round((s?.levelPts || []).reduce((t, x) => t + (x || 0), 0)));
    let alive = true, busy = false, phase = 'welcome', tick = null, lvlStart = 0;
    let game = {}; // estado do nível atual (minijogos)

    const tint = meta.tint || TINT0;
    let scene = pickScene();
    view.innerHTML = `
    <div class="wrap lc lc-full" style="--tint:${tint}">
      <div class="lc-shell" style="--b:${scene.base};--a1:${scene.a1};--a2:${scene.a2};--a3:${scene.a3}" data-cena="${scene.nome}">
        ${topHTML(L, true, TEST)}
        <div id="lc-body"></div>
      </div>
    </div>`;
    const body = view.querySelector('#lc-body');
    // classes no lugar de seletores :has() — com :has() o navegador reavaliava a lição inteira a cada tecla
    const shell = view.querySelector('.lc-shell');
    const content = view.closest('.content'); content?.classList.add('lc-page');
    // fundo da página inteira no mesmo cenário sorteado do cartão do nível (no lugar do branco do site)
    document.getElementById('lc-bgfx')?.remove();
    const bgfx = document.createElement('div');
    bgfx.id = 'lc-bgfx'; bgfx.setAttribute('aria-hidden', 'true');
    const paintBg = () => { bgfx.style.setProperty('--b', scene.base); bgfx.style.setProperty('--a1', scene.a1); bgfx.style.setProperty('--a2', scene.a2); bgfx.style.setProperty('--a3', scene.a3); };
    paintBg(); document.body.appendChild(bgfx); document.body.classList.add('lc-bg-on');
    const dropBg = () => { bgfx.remove(); if (!document.getElementById('lc-bgfx')) document.body.classList.remove('lc-bg-on'); };
    // some assim que a lição sai da tela (trocar de página), sem esperar a próxima tecla ou o relógio
    const bgWatch = new MutationObserver(() => { if (!shell.isConnected) { bgWatch.disconnect(); dropBg(); } });
    bgWatch.observe(view, { childList: true });
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
      phase = 'welcome'; paintProgress(); shell.classList.add('is-wel'); kbPopDrop();
      const resume = saved && !saved.done && st.lvl > 0;
      const finished = saved?.done;
      const p = saved || null, tot = p ? p.hits + p.errors : 0;
      const doneN = p ? (p.done ? N : Math.min(p.lvl, N)) : 0;
      const status = finished ? 'Concluída' : resume ? `Nível ${st.lvl + 1} de ${N}` : `${N} níveis`;
      const stars = p && meta.stars ? meta.stars(p) : '';
      // lição concluída: o recorde em destaque acima do título, como no fim da tela de resultado
      // (estrelas com o brilho passando de uma para a outra, pontuação e, se tiver, Superstar ou Megastar)
      let bestHTML = '';
      if (finished) {
        const bp = ptsOf(p), bn = starsOf(bp), br = rankOf(bp), kind = br === 'mega' ? 'megastar' : br === 'super' ? 'superstar' : 'amarela';
        const label = `Seu recorde: ${bp.toLocaleString('pt-BR')} pontos, ${bn} ${bn === 1 ? 'estrela' : 'estrelas'}${br ? ' · ' + RANK_NAME[br] : ''}`;
        bestHTML = `<div class="lc-best ${br}" role="img" aria-label="${label}">
          ${bn ? `<span class="lc-best-stars">${Array.from({ length: bn }, (_, i) => `<img src="assets/estrelas/estrela-${kind}.png" alt="" draggable="false" style="--i:${i}">`).join('')}</span>` : ''}
          <span class="lc-best-txt"><span class="lc-best-num"><b data-to="${bp}">${bp.toLocaleString('pt-BR')}</b><em>pontos</em></span>${br ? `<img src="assets/estrelas/titulo-${kind}.png" alt="" draggable="false">` : ''}</span>
        </div>`;
      }
      body.innerHTML = `
      <div class="lc-wel">
        <article class="lc-hero" style="--tint:74, 30, 8">
          <div class="lc-hero-img lc-hero-cover" aria-hidden="true">
            <div class="pf-lc"><div class="pf-lc-keys">${L.teclas.map((k, i) => `<kbd style="--i:${i}">${k === ' ' ? 'Espaço' : esc(k.toUpperCase())}</kbd>`).join('')}</div>
            <div class="pf-lc-segs${doneN ? ' has' : ''}">${L.niveis.map((lv, i) => `<i class="${lv.tipo === 'typing' ? 'd' : 'm'}${i < doneN ? ' on' : ''}${resume && i === doneN ? ' cur' : ''}" style="--i:${i}"></i>`).join('')}</div></div>
          </div>
          <div class="lc-hero-app">
            <div class="lc-hero-text">
              ${meta.tag ? `<span class="lc-hero-tag">${esc(meta.tag)}</span>` : ''}
              <h2>${esc(L.titulo)}</h2>
              <p>${esc(meta.desc || L.intro)}</p>
            </div>
            <div class="lc-hero-bar${stars ? ' has-stars' : ''}">
              <span class="lc-hero-av">${L.numero}</span>
              <span class="lc-hero-who"><strong>Lição ${L.numero}</strong><small>${esc(status)}</small></span>
              ${stars}
            </div>
          </div>
          ${p ? `<b class="lc-hero-prog" style="--w:${(doneN / N) * 100}%"></b>` : ''}
        </article>
        <div class="lc-wel-side">
          ${bestHTML}
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
              : finished ? `<button class="btn-dark inf-shine" type="button" data-go="restart">${svg('refresh')}Refazer a lição</button><button class="btn-soft" type="button" data-go="last">Ver o melhor resultado</button>`
              : `<button class="btn-dark inf-shine" type="button" data-go="restart">${svg('play', true)}Iniciar atividade</button>`}
          </div>
          <p class="lc-note">Use as teclas ${L.teclas.map((k) => `<kbd>${esc(keyLabel(k))}</kbd>`).join('')} com os dedos na posição inicial.</p>
        </div>
      </div>`;
      // o recorde só entra (estrelas, contagem e Megastar/Superstar) depois que a tela de carregamento da lição sai
      const bestBox = body.querySelector('.lc-best');
      if (bestBox) {
        const reduceM = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const bnum = bestBox.querySelector('.lc-best-num b');
        const go = () => {
          if (!bestBox.isConnected || bestBox.classList.contains('go')) return;
          bestBox.classList.add('go');
          if (reduceM || !bnum) return;
          // a pontuação sobe contando enquanto as estrelas entram
          const to = +bnum.dataset.to, D0 = 450, D = 1500, t0 = performance.now();
          const run = (now) => {
            if (!bnum.isConnected) return;
            const t = Math.min(1, Math.max(0, (now - t0 - D0) / D));
            bnum.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))).toLocaleString('pt-BR');
            if (t < 1) requestAnimationFrame(run); else bnum.classList.add('hit');
          };
          requestAnimationFrame(run);
        };
        if (bnum && !reduceM) bnum.textContent = '0';
        const pfi = document.querySelector('body > .pfi');
        if (reduceM || !pfi) go();
        else {
          // a abertura ganha a classe "out" quando começa a sair; a página aparece cerca de 1 s depois
          let later = 0;
          const check = () => { if (later) return; if (!pfi.isConnected || pfi.classList.contains('out')) { mo.disconnect(); later = setTimeout(go, pfi.isConnected ? 1000 : 0); } };
          const mo = new MutationObserver(check);
          mo.observe(pfi, { attributes: true, attributeFilter: ['class'] });
          mo.observe(document.body, { childList: true });
          setTimeout(() => { mo.disconnect(); go(); }, 15000); // nunca fica escondido
          check();
        }
      }
      body.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
        if (b.dataset.go === 'restart') st = fresh();
        if (b.dataset.go === 'last') { st = { ...fresh(), ...saved }; return results(true); }
        play();
      }));
    }

    /* ---------- área de jogo (coluna principal + lateral) ---------- */
    function play() {
      phase = 'play'; shell.classList.remove('is-wel');
      if (play.ran) { scene = pickScene(); shell.style.setProperty('--b', scene.base); shell.style.setProperty('--a1', scene.a1); shell.style.setProperty('--a2', scene.a2); shell.style.setProperty('--a3', scene.a3); shell.dataset.cena = scene.nome; paintBg(); }
      play.ran = true; // cada vez que a lição (re)começa, um cenário novo
      body.innerHTML = `
      <div class="lc-grid">
        <aside class="lc-gauge" id="lc-gauge" aria-label="Pontuação do nível"></aside>
        <section class="lc-card lc-main" id="lc-main"></section>
        <aside class="lc-side">
          <div class="lc-stat lc-w" style="--wc:#ffb020;--wd:#ff4d1f">
            <i class="lc-w-deco" aria-hidden="true">${svg('zap')}</i>
            <span class="lc-w-label">${svg('zap')}XP</span>
            <strong id="lc-xp">0</strong><small>Pontos de experiência</small>
            <div class="lc-sparks" id="lc-sparks"></div>
          </div>
          <div class="lc-stat lc-w" style="--wc:#38bdf8;--wd:#4f46e5"><i class="lc-w-deco" aria-hidden="true">${svg('clock')}</i><span class="lc-w-label">${svg('clock')}Tempo</span><strong id="lc-time">00:00</strong><small>Tempo nesta lição</small></div>
          <div class="lc-stat lc-w lc-w-ring" id="lc-acc-card" style="--wc:#34d399;--wd:#0d9488">
            <i class="lc-w-deco" aria-hidden="true">${svg('target')}</i>
            <div><span class="lc-w-label">${svg('target')}Precisão</span><strong id="lc-acc">100%</strong><small id="lc-acc-txt">Excelente</small></div>
            <svg class="lc-ring2" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" pathLength="100"/><circle class="v" id="lc-acc-ring" cx="22" cy="22" r="18" pathLength="100"/></svg>
          </div>
          <div class="lc-stat lc-w" style="--wc:#c084fc;--wd:#db2777"><i class="lc-w-deco" aria-hidden="true">${svg('level')}</i><span class="lc-w-label">${svg('level')}Grau de experiência</span><strong id="lc-grade">01</strong><b class="lc-mini"><i id="lc-grade-bar"></i></b><small id="lc-grade-txt"></small></div>
        </aside>
      </div>`;
      paintStats();
      gaugeBuild();
      // o teclado virtual começa fechado: só aparece quando o aluno clica em "Ver teclado virtual"
      kbOpen = false;
      presses = []; speedShown = 0; speedRun();
      level();
      clearInterval(tick);
      tick = setInterval(() => {
        if (!view.isConnected || !alive) return stop();
        if (phase === 'play' && !busy && document.visibilityState === 'visible' && !game.paused) { st.time++; $q('#lc-time') && ($q('#lc-time').textContent = fmt(st.time)); }
      }, 1000);
    }

    /* painel da direita: só reescreve o que mudou (cada tecla mexe aqui, então nada de trabalho à toa) */
    const statSet = (id, kind, v, prop) => {
      const el = $q('#' + id); if (!el) return;
      const memo = (el._hcv ||= {}), k = kind + (prop || ''); // guardado no próprio elemento: se o painel for redesenhado, começa do zero
      if (memo[k] === v) return;
      memo[k] = v;
      if (kind === 'txt') el.textContent = v; else if (kind === 'var') el.style.setProperty(prop, v); else el.style[prop] = v;
    };
    function paintStats() {
      if (!$q('#lc-xp')) return;
      statSet('lc-xp', 'txt', st.xp.toLocaleString('pt-BR'));
      statSet('lc-time', 'txt', fmt(st.time));
      const a = accuracy();
      statSet('lc-acc', 'txt', Math.round(a) + '%');
      // anel de precisão (como os anéis de atividade): verde, amarelo ou vermelho
      statSet('lc-acc-ring', 'var', a.toFixed(1), '--p');
      // a cor do card acompanha a precisão: verde (excelente), âmbar (bom) ou vermelho (atenção)
      statSet('lc-acc-card', 'var', a >= 88 ? '#34d399' : a >= 70 ? '#fbbf24' : '#fb7185', '--wc');
      statSet('lc-acc-card', 'var', a >= 88 ? '#0d9488' : a >= 70 ? '#ea580c' : '#e11d48', '--wd');
      statSet('lc-acc-txt', 'txt', a >= 88 ? 'Excelente' : a >= 70 ? 'Bom' : 'Atenção aos erros');
      const g = grade(st.xp);
      statSet('lc-grade', 'txt', String(g.g).padStart(2, '0'));
      statSet('lc-grade-bar', 'css', g.pct.toFixed(1) + '%', 'width');
      statSet('lc-grade-txt', 'txt', `${Math.max(1, Math.round(100 - g.pct))}% para o grau ${g.g + 1}`);
    }

    /* acerto e erro valem para todos os tipos de nível */
    function hit(k) {
      presses.push(performance.now()); speedWake();
      st.hits++; st.xp += 5; gain(5); paintStats(); spark(); kb?.flash(k, true);
      score(true);
    }
    function miss(k) {
      st.errors++; { const was = st.xp; st.xp = Math.max(0, st.xp - (1 + Math.floor(Math.random() * 6))); gain(st.xp - was); } paintStats(); if (k) kb?.flash(k, false);
      score(false);
    }

    /* ---------- pontuação da lição e medidor de estrelas (à esquerda) ----------
       Os 13.000 pontos são divididos entre todos os níveis da lição (13.000 ÷ nº de níveis cada).
       Em cada nível: parte do nível já feita × precisão no nível × a parte dele nos 13.000.
       Sem errar nada em nenhum nível, a lição termina com 13.000. O medidor nunca desce. */
    const needOf = (lv) => (lv.tipo === 'typing' ? lv.texto.length : lv.meta);
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
    /* feixes da reta final: depois da 5ª estrela, feixes finos sobem pela barra rumo ao Superstar
       (e depois ao Megastar). Cada um tem a sua velocidade, então uns passam pelos outros; quanto mais
       perto da meta, mais feixes aparecem e mais rápido todos sobem. Só transform/opacity, animados pela
       placa de vídeo (Web Animations); a velocidade muda com playbackRate, que não faz o feixe pular. */
    const STREAKS = [ // x/w em px; h = comprimento do feixe em % da barra; d = segundos por volta; f = onde começa; o = brilho
      { x: 6, w: 2, h: 16, d: 2.6, f: 0.1, o: 0.9 }, { x: 33, w: 3, h: 10, d: 1.9, f: 0.55, o: 0.8 },
      { x: 19, w: 2, h: 20, d: 3.2, f: 0.8, o: 0.95 }, { x: 40, w: 2, h: 13, d: 2.2, f: 0.3, o: 0.75 },
      { x: 12, w: 3, h: 9, d: 1.6, f: 0.65, o: 0.9 }, { x: 26, w: 4, h: 18, d: 2.9, f: 0.2, o: 0.7 },
      { x: 3, w: 2, h: 12, d: 2.0, f: 0.9, o: 0.85 }, { x: 37, w: 3, h: 15, d: 2.4, f: 0.45, o: 0.9 },
    ];
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function chargeOf(pts) {
      if (pts >= MEGA_AT) return null;
      if (pts >= SUPER_AT) return { to: 'mega', t: (pts - SUPER_AT) / (MEGA_AT - SUPER_AT) };
      const five = STAR_AT[STAR_AT.length - 1];
      if (pts >= five) return { to: 'super', t: (pts - five) / (SUPER_AT - five) };
      return null;
    }
    function streaksRun(t, quiet) {
      const box = $q('#lc-gstreaks'); if (!box || reduceMotion) return;
      const els = [...box.children];
      if (!gs.anims) gs.anims = els.map((el, i) => {
        const k = STREAKS[i];
        return el.animate([{ transform: `translate3d(0,${k.h}%,0)` }, { transform: 'translate3d(0,-100%,0)' }],
          { duration: k.d * 1000, delay: -k.d * 1000 * k.f, iterations: Infinity, easing: 'linear' });
      });
      box.classList.add('run');
      const e = t * t * (3 - 2 * t); // sobe devagar no começo e acelera de forma lisa
      const rate = 1 + e * 3.6; // até ~4,6× mais rápido perto da meta
      gs.anims.forEach((a) => (a.updatePlaybackRate ? a.updatePlaybackRate(rate) : (a.playbackRate = rate)));
      const show = 2 + Math.round(e * (els.length - 2)); // de 2 a 8 feixes
      els.forEach((el, i) => el.classList.toggle('on', i < show));
    }
    function streaksStop(final) {
      const box = $q('#lc-gstreaks'); if (!box || !gs.anims) return;
      if (final) { gs.anims.forEach((a) => (a.updatePlaybackRate ? a.updatePlaybackRate(7) : (a.playbackRate = 7))); [...box.children].forEach((el) => el.classList.add('on')); }
      clearTimeout(gs.stopT);
      gs.stopT = setTimeout(() => {
        box.classList.remove('run');
        setTimeout(() => { if (box.classList.contains('run')) return; gs.anims?.forEach((a) => a.cancel()); gs.anims = null; }, 600);
      }, final ? 650 : 0);
    }
    /* a barra vai ganhando a cor da próxima conquista; ao chegar, ela se enche num brilho e o brilho assenta */
    function gaugeCharge(pts, quiet) {
      const c = chargeOf(pts), rank = rankOf(pts);
      const ts = $q('#lc-gtint-s'), tm = $q('#lc-gtint-m'); if (!ts) return;
      ts.style.opacity = rank ? 1 : c ? (c.t * 0.5).toFixed(3) : 0;
      if (!gs.megaLock) tm.style.opacity = rank === 'mega' ? 1 : c?.to === 'mega' ? (c.t * 0.5).toFixed(3) : 0;
      if (!c) return;
      if (performance.now() < (gs.hold || 0)) return; // logo depois de chegar no Superstar, os feixes descansam um pouco
      streaksRun(c.t, quiet);
    }
    function gaugeArrive(g, rank) {
      g.classList.remove('arrive-super', 'arrive-mega'); void g.offsetWidth; g.classList.add('arrive-' + rank);
      setTimeout(() => g.classList.remove('arrive-' + rank), 2200);
    }
    function gaugeBuild() {
      Object.assign(gs, { stars: 0, rank: '', ready: false, anims: null, hold: 0, megaLock: false });
      const g = $q('#lc-gauge'); if (!g) return;
      g.className = 'lc-gauge';
      g.style.setProperty('--bar', BAR_COLORS[Math.floor(Math.random() * BAR_COLORS.length)]);
      g.innerHTML = `
        <div class="lc-g-sky" aria-hidden="true"></div>
        <div class="lc-g-area">
          <div class="lc-g-frame" id="lc-gframe"></div>
          <div class="lc-g-halo" id="lc-ghalo"></div>
          <div class="lc-g-bar" id="lc-gbar"><i class="lc-g-tint s" id="lc-gtint-s"></i><i class="lc-g-tint m" id="lc-gtint-m"></i><i class="lc-g-shine"></i><b class="lc-g-beam" id="lc-gbeam"></b><div class="lc-g-streaks" id="lc-gstreaks">${STREAKS.map((k) => `<i style="left:${k.x}px;width:${k.w}px;--sh:${k.h}%;--so:${k.o}"></i>`).join('')}</div><i class="lc-g-glow" id="lc-gglow"></i></div>
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
          replay(el, 'pulse');
        }, i * 280));
      }, 5000);
    }
    function gaugeLevel(lv) { game.need = needOf(lv); game.ph = 0; game.pe = 0; game.lp = 0; paintGauge(); }
    function score(ok) {
      if (!game.need || busy) return;
      if (ok) game.ph++;
      else game.pe++; // (o tremor da moldura no erro foi tirado: a moldura nem aparece mais)
      const prog = Math.min(1, game.ph / game.need), acc = game.ph / Math.max(1, game.ph + game.pe);
      game.lp = Math.min(PER, Math.max(game.lp, PER * prog * acc));
      paintGauge();
    }
    function paintGauge() {
      const g = $q('#lc-gauge'); if (!g) return;
      const pts = Math.round(totalPts()), quiet = !gs.ready; // ao abrir/retomar, mostra o estado sem animar
      // a barra tem a altura toda e sobe deslizando (transform): sem recalcular a página a cada tecla
      const up = `translateY(${(100 - gPct(pts)).toFixed(2)}%)`;
      const gb = $q('#lc-gbar'); if (gb._up !== up) { gb._up = up; gb.style.transform = up; $q('#lc-ghalo').style.transform = up; }
      $q('#lc-gpts').textContent = pts.toLocaleString('pt-BR');
      const next = GOALS.find((t) => t > pts);
      $q('#lc-gframe').style.height = `${next ? gPct(next) : 100}%`; // a moldura cresce até a próxima meta
      const stars = starsOf(pts);
      g.querySelectorAll('.lc-g-star').forEach((el, i) => {
        el.classList.toggle('on', i < stars);
        el.classList.toggle('next', i === stars); // estrela vazia esperando na próxima meta
        if (!quiet && i >= gs.stars && i < stars) { // estrela nova: surge com raios, cresce branca de brilho e assenta
          replay(el, 'pop');
          replay($q('#lc-gbar'), 'flash');
          replay($q('#lc-gbeam'), 'go'); // feixe branco subindo pela barra
          setTimeout(() => el.classList.remove('pop'), 1100);
        }
      });
      g.classList.toggle('starred', stars > 0); // o número ganha a cor da conquista: branco → dourado → Superstar → Megastar
      if (!quiet && stars > gs.stars) replay($q('#lc-gpts'), 'hit');
      gs.stars = stars;
      const rank = rankOf(pts);
      if (rank !== gs.rank) {
        gs.rank = rank;
        if (quiet) { g.classList.toggle('super', rank === 'super'); g.classList.toggle('mega', rank === 'mega'); wordSet(rank, true); }
        else if (rank === 'super') { // chegou: os feixes somem, a barra se enche de brilho e só depois a corrida recomeça rumo ao Megastar
          streaksStop(); gs.hold = performance.now() + 2200; rankShow(g, rank); gaugeArrive(g, rank);
          setTimeout(() => { if (g.isConnected) gaugeCharge(Math.round(totalPts())); }, 2250);
        } else if (rank === 'mega') { // a última corrida dispara, termina, e então vem o brilho do Megastar
          gs.megaLock = true; streaksStop(true);
          setTimeout(() => { gs.megaLock = false; if (!g.isConnected) return; $q('#lc-gtint-m').style.opacity = 1; rankShow(g, rank); gaugeArrive(g, rank); }, 650);
        } else rankShow(g, rank);
      }
      gaugeCharge(pts, quiet);
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
      // uma faísca por tecla e no máximo 8 no ar (antes eram 3 por tecla: ~50 animando ao digitar rápido)
      const box = $q('#lc-sparks'); if (!box || box.childElementCount >= 8) return;
      const s = document.createElement('i');
      s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px'); s.style.setProperty('--dy', -(110 + Math.random() * 90) + 'px');
      box.appendChild(s); setTimeout(() => s.remove(), 1600);
    }
    /* teclado virtual ABNT2 (curso/teclado.js); a preferência de mostrar ou não fica guardada no aparelho */
    let kb = null;
    let kbOpen = false, kbTimer = null;
    /* medidor de velocidade (pílula ao lado do botão do teclado): conta as teclas certas dos
       últimos 3 segundos; enche quando o aluno digita rápido e vai esvaziando quando ele para.
       PPM = (teclas por minuto) ÷ 5.
       Versão leve: a barra anda só com transform (sem mexer no layout do cartão), as cores e o
       tamanho da tecla da logo mudam em 4 degraus (data-heat), sem faíscas criadas a cada quadro,
       e nada é reescrito na página se o valor não mudou. */
    const SPEED_WIN = 3000, SPEED_MAX = 60; // PPM em que a pílula fica cheia
    let presses = [], speedShown = 0, speedTick = null, spdFill = '', spdNum = '';
    // roda só enquanto há algo para mostrar: começa na tecla certa (speedWake) e para sozinho quando a pílula zera
    function speedRun() {
      clearInterval(speedTick); speedTick = null; spdFill = ''; spdNum = '';
      const fill = $q('#lc-speed-fill'); if (fill) { fill.style.transform = 'translateX(-100%)'; fill.classList.add('zero'); }
      const num = $q('#lc-ppm'); if (num) num.textContent = '0';
      speedHeat(0);
    }
    /* calor do medidor: 0 parado · 1 aquecendo · 2 rápido · 3 pegando fogo */
    const HEAT_AT = [10, 22, 35], HEAT_TXT = ['Velocidade', 'Aquecendo…', 'Rápido!', 'Pegando fogo!'];
    function speedHeat(h) {
      const box = $q('#lc-speed'); if (!box || box.dataset.heat === String(h)) return;
      const up = h > +box.dataset.heat;
      box.dataset.heat = h;
      const lbl = $q('#lc-spd-lbl'); if (lbl) lbl.textContent = HEAT_TXT[h];
      if (up && h >= 2) replay(box, 'boost');
    }
    function speedWake() {
      if (speedTick) return;
      const fill0 = $q('#lc-speed-fill'), num0 = $q('#lc-ppm');
      fill0?.classList.remove('zero');
      speedTick = setInterval(() => {
        if (!view.isConnected || !alive) { clearInterval(speedTick); speedTick = null; return; }
        const now = performance.now();
        while (presses.length && now - presses[0] > SPEED_WIN) presses.shift();
        const target = presses.length ? (presses.length / (SPEED_WIN / 1000)) * 60 / 5 : 0;
        speedShown += (target - speedShown) * .22; // anda devagar até o valor, sem saltos
        if (speedShown < .4) speedShown = 0;
        const fill = fill0?.isConnected ? fill0 : $q('#lc-speed-fill'), num = num0?.isConnected ? num0 : $q('#lc-ppm');
        if (fill && num) {
          const t = Math.min(1, speedShown / SPEED_MAX);
          const tf = `translateX(${(t * 100 - 100).toFixed(0)}%)`;
          if (tf !== spdFill) { spdFill = tf; fill.style.transform = tf; }
          const n = String(Math.round(speedShown));
          if (n !== spdNum) { spdNum = n; num.textContent = n; }
          speedHeat(speedShown >= HEAT_AT[2] ? 3 : speedShown >= HEAT_AT[1] ? 2 : speedShown >= HEAT_AT[0] ? 1 : 0);
        }
        if (!speedShown && !presses.length) { clearInterval(speedTick); speedTick = null; fill?.classList.add('zero'); }
      }, 100);
    }
    const KB_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>';
    const kbHTML = () => `
      <div class="lc-kbar">
        <span class="lc-speed" id="lc-speed" data-heat="0" role="img" aria-label="Velocidade de digitação">
          <span class="lc-spd-key" aria-hidden="true"><b><img src="assets/icons/logo-hc.webp" alt="" draggable="false"></b></span>
          <span class="lc-spd-body">
            <span class="lc-spd-top"><em id="lc-spd-lbl">${HEAT_TXT[0]}</em><span class="lc-spd-num"><b id="lc-ppm">0</b><small>PPM</small></span></span>
            <span class="lc-spd-track"><span class="lc-speed-pill"><i id="lc-speed-fill" class="zero"></i></span></span>
          </span>
        </span>
        <button type="button" class="lc-kbtn${kbOpen ? ' open' : ''}" id="lc-kbtn" aria-expanded="${kbOpen}" aria-controls="lc-kbpop">${KB_ICO}<span>${kbOpen ? 'Ocultar teclado' : 'Ver teclado virtual'}</span><b aria-hidden="true">⌄</b></button>
      </div>`;
    /* teclado virtual numa janela suspensa, presa embaixo da tela (fora do cartão, para não mexer no layout);
       fica no <body> e recebe as cores do cenário */
    let kbPop = null;
    function kbPopEl() {
      if (kbPop?.isConnected) return kbPop;
      kbPop = document.createElement('div');
      kbPop.className = 'lc-kbpop'; kbPop.id = 'lc-kbpop';
      kbPop.setAttribute('role', 'dialog'); kbPop.setAttribute('aria-label', 'Teclado virtual');
      kbPop.innerHTML = `<div class="lc-kbpop-head"><span>${KB_ICO}Teclado virtual</span><b class="lc-kbpop-time" title="Fecha sozinho em 10 segundos"><i></i></b><button type="button" class="lc-kbpop-x" aria-label="Fechar o teclado virtual">×</button></div><div class="lc-kb"></div>`;
      kbPop.querySelector('.lc-kbpop-x').addEventListener('click', (e) => { e.currentTarget.blur(); kbShow(false); });
      document.body.appendChild(kbPop);
      return kbPop;
    }
    function kbPopDrop() { kb?.destroy(); kb = null; kbPop?.remove(); kbPop = null; }
    const KB_AUTO = 10000; // o teclado fecha sozinho depois de 10 s (a barrinha do topo mostra o tempo)
    function kbShow(open, restart = true) {
      kbOpen = open;
      if (restart) {
        clearTimeout(kbTimer);
        if (open) kbTimer = setTimeout(() => kbShow(false), KB_AUTO);
        const bar = kbPop?.querySelector('.lc-kbpop-time i');
        if (bar) { bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)'; void bar.offsetWidth; if (open) { bar.style.transition = `transform ${KB_AUTO}ms linear`; bar.style.transform = 'scaleX(0)'; } }
      }
      if (kbPop) { ['--a1', '--a2', '--a3'].forEach((v) => kbPop.style.setProperty(v, shell.style.getPropertyValue(v))); kbPop.classList.toggle('open', open); }
      const b = $q('#lc-kbtn'); if (!b) return;
      b.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open); b.querySelector('span').textContent = open ? 'Ocultar teclado' : 'Ver teclado virtual';
    }
    function kbMount() {
      kb?.destroy(); kb = null;
      if (!window.HC_teclado) return;
      const box = kbPopEl().querySelector('.lc-kb'); box.innerHTML = '';
      kb = window.HC_teclado(box);
      kbShow(kbOpen, false); // trocar de nível não reinicia a contagem
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
      if (st.lvl >= N) return TEST ? testDone() : results();
      smoothResize(levelRender);
    }
    function levelRender() {
      busy = false; game = {}; lvlStart = st.time;
      const lv = L.niveis[st.lvl];
      const isGame = lv.tipo !== 'typing';
      const main = $q('#lc-main');
      const t = (KIND_TINT[lv.tipo] || scene.base).split(',').map(Number);
      main.style.setProperty('--c1', `rgb(${t.join(' ')})`); // a cor do cartão desliza de um nível para o outro
      main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter');
      const nn = String(st.lvl + 1).padStart(2, '0');
      main.classList.remove('is-typing');
      main.innerHTML = `
        <div class="lc-fun" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="o1"></i><i class="o2"></i><i class="x1">+</i><i class="x2">+</i><i class="x3">✦</i><i class="x4">✦</i><i class="q1"></i></div>
        <span class="lc-lv-mark" aria-hidden="true">${nn}</span>
        <div class="lc-lv-head">
          <span class="lc-lv-av">${nn}</span>
          <span class="lc-lv-who"><strong>Nível ${nn}</strong><small>de ${N} · ${TEST ? 'Teste' : `Lição ${L.numero}`}</small></span>
          <div class="lc-sup" id="lc-sup"></div>
          ${isAdmin() ? '<button type="button" class="lc-xptest" id="lc-xptest" title="Só administradores veem este botão">Testar tela de XP</button><button type="button" class="lc-xptest" id="lc-lrtest" title="Só administradores veem este botão (nada é salvo)">Testar moedas</button>' : ''}
          <span class="lc-kind${isGame ? ' game' : ''}">${isGame ? 'Minijogo' : 'Digitação'}</span>
        </div>
        <h2 class="lc-lv-title">${esc(lv.titulo)}</h2>
        <p class="lc-tip"><b>Dica</b>${esc(lv.dica)}</p>
        ${isGame ? `<div class="lc-goal"><span id="lc-goal-txt"></span><b><i id="lc-goal-bar"></i></b></div>` : ''}
        <div class="lc-stage" id="lc-stage"></div>
        ${kbHTML()}
        <div class="lc-over" id="lc-over" hidden></div>`;
      kbMount(); supRender();
      $q('#lc-xptest')?.addEventListener('click', (e) => { e.currentTarget.blur(); const rf = window.HC_xp?.rankOf?.(window.HC_xp.get().xp)?.falta || 0; xpScreen({ test: true, gained: Math.max(600 + Math.round(Math.random() * 2400), rf && rf < 8000 ? rf + 250 : 0) }); });
      // prévia da tela final com as moedas (pontuação de mentira; o saldo não muda)
      $q('#lc-lrtest')?.addEventListener('click', (e) => {
        e.currentTarget.blur();
        const p = [7400, 10600, 11500, 12700][Math.floor(Math.random() * 4)], C = window.HC_cash;
        showFinale({ a: accuracy(), rating: 'Excelente', fast: [st.time || 6, 0], slow: [st.time || 40, 0], g: grade(st.xp), record: '', test: true, ptsTest: p,
          cash: C ? { from: C.get().saldo, gain: C.ganhoDe(starsOf(p), rankOf(p)), review: false } : null });
      });
      paintProgress(); paintStats(); gaugeLevel(lv);
      ({ typing: typingInit, hacker: hackerInit, fila: filaInit, corrida: corridaInit, estrelas: estrelasInit, nave: naveInit, gp: gpInit })[lv.tipo](lv);
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
        if (v === 'r') return TEST ? testDone() : results();
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
    function supBad(box, inp) { inp.value = ''; replay(box, 'bad'); }

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
      if (!best && !TEST) saveProgress(L.id, { ...st, done: false }); // refazendo: o recorde salvo fica intacto até o fim
      await celebrate(over, n, pts, st.levelTimes[n - 1]);
      if (!alive || !over.isConnected) return;
      level();
    }

    /* ---------- nível concluído ----------
       Medalha com o número do nível: o anel se desenha, o check aparece, raios giram atrás e faíscas estouram;
       a frase de parabéns sobe letra por letra, os pontos contam e a barra da lição avança até o próximo nível. */
    const CHEERS = ['Parabéns!', 'Mandou bem!', 'Excelente!', 'Isso aí!', 'Arrasou!', 'Muito bem!'];
    async function celebrate(over, n, pts, secs) {
      const nn = String(n).padStart(2, '0');
      const next = L.niveis[n];
      const cheer = CHEERS[(n * 7 + Math.floor(Math.random() * 3)) % CHEERS.length];
      const nextTxt = next ? esc(next.titulo) : 'Resultado da lição';
      const nextTag = !next ? 'Você chegou ao fim' : next.tipo === 'typing' ? 'A seguir' : 'A seguir · minijogo';
      over.hidden = false;
      over.innerHTML = `
        <div class="lc-cel" role="status" aria-live="polite">
          <div class="lc-cel-radar" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="lc-cel-badge" aria-hidden="true">
            <svg viewBox="0 0 120 120"><circle class="trk" cx="60" cy="60" r="52"/><circle class="arc" cx="60" cy="60" r="52" pathLength="100"/></svg>
            <span class="lc-cel-num">${nn}</span>
            <span class="lc-cel-check"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" pathLength="100"/></svg></span>
            ${Array.from({ length: 14 }, (_, i) => `<i class="lc-cel-spark" style="--a:${i * (360 / 14) + (i % 2) * 8}deg;--r:${i % 2 ? 92 : 118}px;--s:${i % 3 ? 6 : 9}px"></i>`).join('')}
          </div>
          <h3 class="lc-cel-title">${[...cheer].map((c, i) => `<span style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</h3>
          <p class="lc-cel-sub">Nível ${nn} concluído</p>
          <div class="lc-cel-chips">
            <span class="pts"><b id="lc-cel-pts">+0</b> pontos</span>
            ${secs ? `<span>${fmt(secs)} no nível</span>` : ''}
          </div>
          <div class="lc-cel-next">
            <small>${nextTag}</small>
            <strong>${nextTxt}</strong>
            <i class="lc-cel-bar" style="--from:${((n - 1) / N) * 100}%;--to:${(n / N) * 100}%"><b></b></i>
            <span class="lc-cel-of">${n} de ${N}</span>
          </div>
        </div>`;
      // os pontos contam até o total do nível
      const el = $q('#lc-cel-pts'), total = Math.round(pts), t0 = performance.now() + 450;
      const run = (t) => {
        if (!el.isConnected) return;
        const k = Math.min(1, Math.max(0, (t - t0) / 800)), e = 1 - (1 - k) ** 3;
        el.textContent = `+${Math.round(total * e).toLocaleString('pt-BR')}`;
        if (k < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      await sleep(2500); if (!alive || !over.isConnected) return;
      over.querySelector('.lc-cel')?.classList.add('out'); over.classList.add('out');
      await sleep(380);
      over.classList.remove('out');
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
    /* apresentação de um jeito novo de treinar (ex.: "A sombra das palavras") → Enter para começar */
    function apresentaInit(lv) {
      const a = lv.apresenta;
      game.intro = 'found';
      $q('#lc-stage').innerHTML = `
        <div class="lc-new ok lc-apr">
          <p class="lc-apr-tag">${esc(a.tag || 'Novo desafio')}</p>
          <h3>${esc(a.titulo)}</h3>
          <p>${esc(a.texto)}</p>
          ${a.exemplo ? `<div class="lc-apr-ex" aria-hidden="true">${[...a.exemplo.sombra].map((c, i) => c === ' ' ? '<i class="sp"></i>' : `<span class="${a.exemplo.texto[i] === 'f' ? 'l' : 'r'}" style="--d:${i * 70}ms"><small>${esc(c)}</small>${a.exemplo.texto[i]}</span>`).join('')}</div>
          <p class="lc-apr-key"><span class="l">Mão esquerda → <kbd>F</kbd></span><span class="r">Mão direita → <kbd>J</kbd></span></p>` : ''}
          <p class="lc-new-go">Pressione <kbd>Enter</kbd> para começar</p>
        </div>`;
      kbTarget('enter');
    }
    function typingInit(lv) {
      if (lv.nova && !game.introDone) return introInit(lv);
      if (lv.apresenta && !game.introDone) return apresentaInit(lv);
      game.intro = null; game.t0 = 0;
      game.pos = 0; game.text = lv.texto;
      const g = lv.sombra || ''; // a frase de verdade por trás do ritmo (uma letra por tecla)
      // folha de papel com várias linhas: cada palavra (com o espaço depois dela) fica inteira na mesma linha
      const ch = (c, i) => `<span class="lc-ch${c === ' ' ? ' sp' : g ? (c === 'f' ? ' l' : ' r') : ''}" data-i="${i}"${g && c !== ' ' ? ` data-g="${esc(g[i])}"` : ''}>${c === ' ' ? '&nbsp;' : esc(c)}</span>`;
      const words = [...lv.texto.matchAll(/\S+\s*|\s+/g)].map((m) => `<span class="lc-wd">${[...m[0]].map((c, j) => ch(c, m.index + j)).join('')}</span>`).join('');
      $q('#lc-main').classList.add('is-typing');
      $q('#lc-stage').innerHTML = `
        <div class="lc-paper${g ? ' ghost' : ''}" id="lc-line">
          <div class="lc-paper-win" id="lc-win"><div class="lc-line-text" id="lc-line-text">${words}</div></div>
          <span class="lc-start-tip" id="lc-start-tip">Comece a digitar</span>
          <div class="lc-paper-foot"><b class="lc-pbar"><i id="lc-pbar"></i></b><span class="lc-pcount" id="lc-pcount">0 / ${lv.texto.length}</span></div>
        </div>
        <p class="lc-home">${g ? 'Letra da <b class="l">mão esquerda</b> → <kbd>F</kbd> · letra da <b class="r">mão direita</b> → <kbd>J</kbd> · entre as palavras, <kbd>Espaço</kbd>' : 'Volte os dedos para a posição inicial <kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><kbd>F</kbd> – <kbd>J</kbd><kbd>K</kbd><kbd>L</kbd><kbd>Ç</kbd> depois de cada tecla'}</p>`;
      game.chs = [...view.querySelectorAll('#lc-line-text .lc-ch')];
      game.chs[0]?.classList.add('cur');
      typeMeasure();
      kbTarget(game.text[0] ?? null);
      if (!game.onResize) {
        const mine = game, fn = () => { if (game !== mine || !mine.chs?.[0]?.isConnected) return removeEventListener('resize', fn); typeMeasure(); };
        game.onResize = fn; addEventListener('resize', fn);
      }
    }
    /* mede em que linha cada letra caiu; a janela mostra 3 linhas e sobe quando o cursor chega na terceira */
    const TYPE_ROWS = 3;
    function typeMeasure() {
      const paper = $q('#lc-line'), win = $q('#lc-win'), strip = $q('#lc-line-text'); if (!paper || !strip || !game.chs) return;
      strip.style.transition = 'none'; strip.style.transform = ''; paper.classList.remove('one');
      const top0 = strip.getBoundingClientRect().top, tops = [], bots = [];
      game.lineOf = game.chs.map((el) => {
        const r = el.getBoundingClientRect(), t = Math.round(r.top - top0);
        let k = tops.findIndex((v) => Math.abs(v - t) < 6);
        if (k < 0) { tops.push(t); bots.push(0); k = tops.length - 1; }
        bots[k] = Math.max(bots[k], Math.ceil(r.bottom - top0));
        return k;
      });
      game.tops = tops;
      paper.classList.toggle('one', tops.length === 1); // texto curto: uma linha centralizada
      win.style.height = `${bots[Math.min(TYPE_ROWS, tops.length) - 1] + 4}px`;
      game.off = -1;
      typeScroll(true);
      const tip = $q('#lc-start-tip'), c0 = game.chs[0];
      if (tip && c0) { const pr = paper.getBoundingClientRect(), r = c0.getBoundingClientRect(); const half = tip.offsetWidth / 2 + 10; tip.style.left = `${Math.min(Math.max(r.left - pr.left + r.width / 2, half), pr.width - half)}px`; tip.style.setProperty('--ax', `${r.left - pr.left + r.width / 2 - Math.min(Math.max(r.left - pr.left + r.width / 2, half), pr.width - half)}px`); tip.style.top = `${r.top - pr.top}px`; }
    }
    function typeScroll(instant) {
      const strip = $q('#lc-line-text'); if (!strip || !game.tops) return;
      const line = game.lineOf[Math.min(game.pos, game.chs.length - 1)] || 0;
      const off = Math.max(0, Math.min(line - 1, game.tops.length - TYPE_ROWS));
      if (off === game.off) return;
      game.off = off;
      strip.style.transition = instant ? 'none' : '';
      strip.style.transform = `translate3d(0,${-game.tops[off]}px,0)`;
    }
    function typingPaint() {
      const prev = game.chs[game.pos - 1], cur = game.chs[game.pos];
      prev?.classList.remove('cur'); prev?.classList.add('ok');
      cur?.classList.add('cur');
      if (prev && prev.parentElement !== cur?.parentElement) replay(prev.parentElement, 'pop'); // palavra terminada: um pulinho
      if (game.pos === 1) $q('#lc-start-tip')?.classList.add('gone');
      const bar = $q('#lc-pbar'), cnt = $q('#lc-pcount');
      if (bar) bar.style.width = `${(game.pos / game.text.length) * 100}%`;
      if (cnt) cnt.textContent = `${game.pos} / ${game.text.length}`;
      typeScroll();
      kbTarget(game.text[game.pos] ?? null);
    }
    function typingKey(k) {
      const want = game.text[game.pos];
      if (k === want) {
        if (!game.t0) game.t0 = performance.now();
        // letra redigitada depois do Backspace: avança e fica verde, mas não conta pontos de novo
        if (game.pos < (game.max || 0)) { kb?.flash(k, true); game.chs[game.pos]?.classList.remove('had'); }
        else hit(k);
        game.pos++; game.max = Math.max(game.max || 0, game.pos); typingPaint();
        if (game.pos >= game.text.length) setTimeout(complete, 250);
      } else {
        miss(k);
        const cur = view.querySelector(`.lc-ch[data-i="${game.pos}"]`);
        cur?.classList.add('had'); // a letra que teve erro fica marcada depois de acertada
        replay(cur, 'bad'); setTimeout(() => cur?.classList.remove('bad'), 480);
      }
    }
    /* Backspace: volta uma letra para o aluno apagar e corrigir */
    function typingBack() {
      if (!game.chs || game.pos <= 0 || game.pos >= game.text.length) return;
      game.chs[game.pos]?.classList.remove('cur', 'bad');
      game.pos--;
      const el = game.chs[game.pos];
      el.classList.remove('ok'); el.classList.add('cur');
      replay(el, 'back');
      const bar = $q('#lc-pbar'), cnt = $q('#lc-pcount');
      if (bar) bar.style.width = `${(game.pos / game.text.length) * 100}%`;
      if (cnt) cnt.textContent = `${game.pos} / ${game.text.length}`;
      kb?.flash('backspace', true);
      typeScroll(); kbTarget(game.text[game.pos] ?? null);
    }

    /* ---------- MINIJOGO: VARREDURA HACKER ---------- */
    /* ---------- MINIJOGO: VARREDURA HACKER (MJ-01) ----------
       Uma tecla do terminal acende com um anel de tempo; o aluno a tecla antes de o anel acabar.
       - Tempo variável: cada ameaça é Normal, Rápida (0,6× o tempo) ou Lenta (1,45×). Numa sequência
         de acertos as rápidas aparecem mais; depois de perder uma vida vêm duas lentas, para respirar.
       - Vidas (padrão 3, campo "vidas" do nível): o tempo acabar custa uma vida; tecla errada só come
         um quarto do tempo da ameaça.
       - Sem vidas, o sistema é "invadido": o aluno pode reviver com o Saldo HC (15,00 e o dobro a cada
         nova vez no mesmo nível) e continua de onde parou, ou recomeçar o minijogo do zero. */
    const HK_KIND = { normal: { f: 1, nome: 'Normal' }, fast: { f: .6, nome: 'Rápida' }, slow: { f: 1.45, nome: 'Lenta' } };
    const HK_REVIVE = 15;
    const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.4-4.5-9.5-9C1 8.2 3.1 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.6 0 5.7 3.7 4.2 7-2.1 4.5-9.5 9-9.5 9Z"/></svg>';
    const hkSel = (k) => `.lc-hk[data-hk="${k === ' ' ? 'space' : k}"]`;
    const hkRevCost = () => HK_REVIVE * 2 ** (game.revives || 0);
    function hackerInit(lv) {
      game.score = 0; game.meta = lv.meta; game.paused = true;
      game.base = Math.max(2.2, 5 * (1.6 / (lv.velocidade || 1.6))); // fica mais curto nos níveis mais rápidos
      game.maxLives = lv.vidas || 3; game.lives = game.maxLives; game.revives = 0; game.streak = 0; game.grace = 0;
      game.target = null; hackerNext(true);
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-hacker" id="lc-hkt">
          <div class="lc-hk-fx" aria-hidden="true"><i class="lc-hk-sweep"></i></div>
          <div class="lc-hk-bar">
            <span class="lc-hk-title"><i></i>Varredura Hacker</span>
            <span class="lc-hk-lives" id="lc-hk-lives" aria-label="Vidas">${Array.from({ length: game.maxLives }, () => `<b>${HEART}</b>`).join('')}</span>
            <span class="lc-hk-kind" id="lc-hk-kind" data-k="normal">Ameaça normal</span>
            <span class="lc-hk-time" id="lc-left">${game.limit.toFixed(1)}s</span>
          </div>
          <div class="lc-hk-keys">${L.teclas.map((k) => `<div class="lc-hk" data-hk="${k === ' ' ? 'space' : k}"><svg class="lc-hk-ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="55"/><circle class="v" cx="60" cy="60" r="55" pathLength="100"/></svg><b>${keyGlyph(k)}</b><small>${keyLabel(k)}</small></div>`).join('')}</div>
          <p class="lc-hk-log" id="lc-hk-log"><span>&gt;</span> <em>Aguardando a varredura…</em></p>
          ${startOverlay('Varredura Hacker')}
        </div>`;
      game.hk = null;
      goal(0, game.meta); hackerPaint(); bindStart();
    }
    function hackerKindPick() {
      if (game.grace > 0) { game.grace--; return 'slow'; }
      const r = Math.random(), fast = game.streak >= 5 ? .45 : game.streak >= 2 ? .28 : .15;
      return r < fast ? 'fast' : r < fast + .2 ? 'slow' : 'normal';
    }
    function hackerNext(first) {
      const pool = L.teclas.filter((k) => k !== game.target);
      game.target = pool[Math.floor(Math.random() * pool.length)];
      game.kind = first ? 'normal' : hackerKindPick();
      game.limit = Math.max(1, game.base * HK_KIND[game.kind].f); game.left = game.limit;
      const kd = $q('#lc-hk-kind');
      if (kd && kd.dataset.k !== game.kind) { kd.dataset.k = game.kind; kd.textContent = `Ameaça ${HK_KIND[game.kind].nome.toLowerCase()}`; replay(kd, 'pop'); }
    }
    function hackerPaint() {
      const pct = Math.max(0, game.left / game.limit);
      const col = pct > .55 ? '#34d399' : pct > .28 ? '#fbbf24' : '#f43f5e';
      // 20 vezes por segundo: as teclas ficam guardadas e só o que mudou é tocado
      if (!game.hk || !game.hk[0]?.isConnected) game.hk = [...view.querySelectorAll('.lc-hk')];
      game.hk.forEach((el) => {
        const on = (el.dataset.hk === 'space' ? ' ' : el.dataset.hk) === game.target;
        if (el.classList.contains('on') !== on) { el.classList.toggle('on', on); if (on) replay(el, 'arm'); }
        if (on && el.dataset.k !== game.kind) el.dataset.k = game.kind;
        if (el._c !== col) { el._c = col; el.style.setProperty('--c', col); }
        const p = on ? (pct * 100).toFixed(1) : '0';
        if (el._p !== p) { el._p = p; el.style.setProperty('--p', p); }
      });
      const l = $q('#lc-left'); if (l) { const t = `${game.left.toFixed(1)}s`; if (l.textContent !== t) l.textContent = t; l.classList.toggle('low', pct <= .28); }
      kbTarget(game.target);
    }
    function hackerBurst(k, ok) {
      const el = view.querySelector(hkSel(k)); if (!el) return;
      const b = document.createElement('i'); b.className = 'lc-burst' + (ok ? '' : ' bad'); el.appendChild(b); setTimeout(() => b.remove(), 700);
      if (ok) { const f = document.createElement('span'); f.className = 'lc-hk-plus'; f.textContent = '+1'; el.appendChild(f); setTimeout(() => f.remove(), 800); }
    }
    function hackerRun() {
      clearInterval(game.timer);
      game.timer = setInterval(() => {
        if (!alive || busy || game.paused || document.visibilityState !== 'visible') return;
        game.left -= .05;
        if (game.left <= 0) {
          hackerBurst(game.target, false); miss(null); game.streak = 0;
          if (!hackerHurt('Falha: a ameaça passou pelo firewall')) return;
          hackerNext();
        }
        hackerPaint();
      }, 50);
    }
    /* perde uma vida; devolve false se acabaram */
    function hackerHurt(msg) {
      game.lives = Math.max(0, game.lives - 1); mjLives(game.lives);
      replay($q('#lc-hkt'), 'hurt');
      game.grace = 2;
      if (game.lives <= 0) { hackerDown(); return false; }
      mjLog(`${msg} · ${game.lives} ${game.lives === 1 ? 'vida restante' : 'vidas restantes'}`, 'err');
      return true;
    }
    function hackerKey(k) {
      if (k === game.target) {
        hit(k); hackerBurst(k, true); game.score++; game.streak++; goal(game.score, game.meta);
        mjLog(game.streak >= 3 ? `Ameaça neutralizada · sequência de ${game.streak}` : 'Ameaça neutralizada', 'ok');
        if (game.score >= game.meta) { game.paused = true; mjLog('Sistema protegido!', 'ok'); return setTimeout(complete, 400); }
        hackerNext(); hackerPaint();
      } else {
        miss(k); game.streak = 0; shake(hkSel(game.target));
        game.left = Math.max(.35, game.left - game.limit * .25); // tecla errada: perde um quarto do tempo
        mjLog('Tecla errada: o tempo encurtou', 'warn'); hackerPaint();
      }
    }
    /* sem vidas (MJ-01): reviver com o Saldo HC ou recomeçar */
    function hackerDown() {
      mjDown({
        term: $q('#lc-hkt'), titulo: 'Sistema invadido!', texto: `Você neutralizou <b>${game.score} de ${game.meta}</b> ameaças.`,
        onResume: () => { hackerNext(); hackerPaint(); },
        onRestart: (term) => {
          game.score = 0; game.streak = 0; game.grace = 0; hackerNext(true); hackerPaint();
          term.insertAdjacentHTML('beforeend', startOverlay('Varredura Hacker')); bindStart();
          mjLog('Aguardando a varredura…');
        },
      });
    }

    /* ---------- vidas e reviver (todos os minijogos com vidas) ----------
       Sem vidas, a tela do minijogo mostra o saldo e duas saídas: reviver com o Saldo HC
       (15,00, e o dobro a cada nova vez no mesmo nível; desconta de verdade, também no Testar)
       ou recomeçar do zero. Usa os ids #lc-hk-lives e #lc-hk-log, que todo minijogo com vidas tem. */
    function mjLog(t, cls = '') { const l = $q('#lc-hk-log'); if (l) { l.className = 'lc-hk-log ' + cls; l.innerHTML = `<span>&gt;</span> <em>${esc(t)}</em>`; } }
    function mjLives(lostAt) {
      const box = $q('#lc-hk-lives'); if (!box) return;
      [...box.children].forEach((h, i) => { h.classList.toggle('off', i >= game.lives); if (i === lostAt) replay(h, 'break'); });
    }
    const livesHTML = () => `<span class="lc-hk-lives" id="lc-hk-lives" aria-label="Vidas">${Array.from({ length: game.maxLives }, () => `<b>${HEART}</b>`).join('')}</span>`;
    function mjDown(o) {
      game.paused = true; game.mj = o;
      const C = window.HC_cash, cost = hkRevCost(), saldo = C ? C.get().saldo : 0, can = !!C && saldo >= cost;
      const fmtC = (v) => (window.HC_cashFmt ? window.HC_cashFmt(v) : v.toFixed(2).replace('.', ','));
      mjLog(o.titulo, 'err');
      const term = o.term; if (!term) return;
      term.insertAdjacentHTML('beforeend', `
        <div class="lc-hk-over" id="lc-hk-over" role="dialog" aria-label="${esc(o.titulo)}">
          <span class="lc-hk-over-ico">${HEART}</span>
          <h4>${esc(o.titulo)}</h4>
          <p>${o.texto} ${C ? 'Use o seu Saldo HC para reviver e continuar daqui, sem voltar ao começo.' : 'Recomece o minijogo para tentar de novo.'}</p>
          ${C ? `<div class="lc-hk-wallet"><img src="assets/moeda/moeda.webp" alt="" draggable="false"><span>Seu saldo</span><b>${fmtC(saldo)}</b></div>
          <button type="button" class="lc-hk-revive" ${can ? '' : 'disabled'}>${o.revTxt || `Reviver com ${game.maxLives} vidas`}<span><img src="assets/moeda/moeda.webp" alt="" draggable="false">${fmtC(cost)}</span></button>
          ${!can ? '<small class="lc-hk-poor">Saldo insuficiente. Ganhe moedas com as estrelas das lições.</small>' : ''}` : ''}
          <button type="button" class="lc-hk-restart">${svg('refresh')}Recomeçar o minijogo</button>
        </div>`);
      const ov = $q('#lc-hk-over');
      ov.querySelector('.lc-hk-revive')?.addEventListener('click', (e) => {
        e.currentTarget.blur();
        if (!C.spend(cost, `${L.id}:reviver`)) return; // o saldo mudou em outro lugar
        game.revives++;
        mjTransfer(ov, saldo, saldo - cost, cost, fmtC);
      });
      ov.querySelector('.lc-hk-restart').addEventListener('click', (e) => {
        e.currentTarget.blur();
        game.lives = game.maxLives; game.revives = 0; mjLives(-1); goal(0, game.meta);
        ov.remove(); o.onRestart(term);
      });
    }
    /* reviver: animação do Saldo HC sendo transferido para o sistema do jogo.
       As moedas saem da carteira e correm pelo cabo até as vidas; o saldo desce contando, a barra
       enche e cada coração acende quando um terço das moedas chega. Depois vem o 3, 2, 1. */
    async function mjTransfer(ov, from, to, cost, fmtC) {
      const COIN = '<img src="assets/moeda/moeda.webp" alt="" draggable="false">';
      ov.classList.add('xfer');
      ov.innerHTML = `
        <div class="lc-hk-xfer">
          <p class="lc-hk-xfer-tag">Transferência do Saldo HC</p>
          <div class="lc-hk-xfer-row">
            <div class="lc-hk-xfer-box from">${COIN}<small>Seu saldo</small><b id="lc-xf-saldo">${fmtC(from)}</b><em>−${fmtC(cost)}</em></div>
            <div class="lc-hk-xfer-pipe" aria-hidden="true"><i class="flow"></i>${Array.from({ length: 9 }, (_, i) => `<span style="--d:${i * 120}ms">${COIN}</span>`).join('')}</div>
            <div class="lc-hk-xfer-box to"><span class="lc-hk-xfer-hearts">${Array.from({ length: game.maxLives }, () => `<b>${HEART}</b>`).join('')}</span><small>Sistema</small><b id="lc-xf-st">Recarregando…</b></div>
          </div>
          <b class="lc-hk-xfer-bar"><i></i></b>
          <p class="lc-hk-xfer-txt" id="lc-xf-txt">Transferindo ${fmtC(cost)} HC para o sistema…</p>
        </div>`;
      const DUR = 1800, t0 = performance.now(), num = ov.querySelector('#lc-xf-saldo'), hearts = [...ov.querySelectorAll('.lc-hk-xfer-hearts b')];
      await new Promise((done) => {
        const step = (t) => {
          if (!ov.isConnected) return done();
          const k = Math.min(1, (t - t0) / DUR), e = 1 - (1 - k) ** 2;
          num.textContent = fmtC(from - (from - to) * e);
          hearts.forEach((h, i) => { if (k >= (i + 1) / hearts.length * .92 && !h.classList.contains('on')) h.classList.add('on'); });
          if (k < 1) requestAnimationFrame(step); else done();
        };
        requestAnimationFrame(step);
      });
      if (!ov.isConnected) return;
      game.lives = game.maxLives; mjLives(-1);
      ov.classList.add('done');
      ov.querySelector('#lc-xf-st').textContent = `${game.maxLives} vidas`;
      ov.querySelector('#lc-xf-txt').textContent = 'Sistema restaurado!';
      mjLog(`Sistema restaurado · −${fmtC(cost)} HC`, 'ok');
      await sleep(900);
      mjResume(ov);
    }
    async function mjResume(ov) {
      ov.classList.remove('xfer', 'done');
      for (const n of [3, 2, 1]) { if (!ov.isConnected) return; ov.innerHTML = `<b class="lc-count">${n}</b>`; await sleep(700); }
      if (!ov.isConnected) return;
      ov.remove(); game.mj?.onResume(); game.paused = false;
    }


    /* ---------- MINIJOGO: FILA DE ANCORAGEM (MJ-02) ----------
       Contêineres caem pelas colunas (uma cor por tecla) rumo à doca. O de baixo é o primeiro da fila:
       o aluno tecla a tecla dele para ancorá-lo. Se ele bater na doca, a doca sofre um dano (perde uma vida).
       - Dinâmico: a queda acelera conforme a fila avança (de 4,2 s até 2,3 s da entrada à doca) e às vezes
         chega uma "rajada" de 3 contêineres colados. Depois de um dano, 2,5 s em câmera lenta.
       - Combo: acertos seguidos acendem o contador e a coluna; tecla errada zera o combo (não tira vida).
       - Vidas (padrão 3, campo "vidas") e reviver com o Saldo HC, iguais aos do MJ-01. */
    const FILA_CORES = ['#34d399', '#a78bfa', '#fbbf24', '#f472b6', '#38bdf8', '#fb923c'];
    const filaCor = (k) => FILA_CORES[Math.max(0, L.teclas.indexOf(k)) % FILA_CORES.length];
    const laneOf = (k) => Math.max(0, L.teclas.indexOf(k));
    function filaInit(lv) {
      game.score = 0; game.meta = lv.meta; game.paused = true; game.run = filaRun;
      game.maxLives = lv.vidas || 3; game.lives = game.maxLives; game.revives = 0; game.combo = 0; game.best = 0;
      game.items = []; game.spawned = 0; game.uid = 0; game.burst = 0; game.slowUntil = 0;
      const n = L.teclas.length;
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-fila2" id="lc-fl" style="--n:${n}">
          <div class="lc-hk-bar">
            <span class="lc-hk-title lc-fl-title"><i></i>Fila de Ancoragem</span>
            ${livesHTML()}
            <span class="lc-fl-combo" id="lc-fl-combo" data-on="0">Combo <b>×0</b></span>
            <span class="lc-hk-time lc-fl-spd" id="lc-fl-spd">1,0×</span>
          </div>
          <div class="lc-fl-field" id="lc-fl-field">
            ${L.teclas.map((k, i) => `<span class="lc-fl-lane" style="--i:${i};--lc:${filaCor(k)}"></span>`).join('')}
            <div class="lc-fl-items" id="lc-fila"></div>
            <div class="lc-fl-dock">${L.teclas.map((k, i) => `<span class="lc-fl-slot" data-fk="${k === ' ' ? 'space' : k}" style="--i:${i};--lc:${filaCor(k)}"><b>${keyGlyph(k)}</b><small>${keyLabel(k)}</small></span>`).join('')}</div>
          </div>
          <p class="lc-hk-log" id="lc-hk-log"><span>&gt;</span> <em>Doca pronta. Aguardando os contêineres…</em></p>
          ${startOverlay('Fila de Ancoragem')}
        </div>`;
      goal(0, game.meta); bindStart(); kbTarget(null);
    }
    /* tempo de queda (s, da entrada até a doca): acelera com o progresso; câmera lenta depois de um dano */
    const filaFall = () => {
      const t = 4.2 - (4.2 - 2.3) * Math.min(1, game.score / Math.max(1, game.meta));
      return performance.now() < game.slowUntil ? t * 1.7 : t;
    };
    function filaSpawn() {
      if (game.score + game.items.length >= game.meta) return;
      const prev = game.items[game.items.length - 1]?.k;
      let k = L.teclas[Math.floor(Math.random() * L.teclas.length)];
      if (k === prev && Math.random() < .5) k = L.teclas[Math.floor(Math.random() * L.teclas.length)]; // menos repetição seguida
      const it = { id: game.uid++, k, y: 0, el: document.createElement('span') };
      it.el.className = 'lc-fl-box'; it.el.style.setProperty('--lc', filaCor(k)); it.el.style.setProperty('--i', laneOf(k));
      it.el.innerHTML = `<b>${keyGlyph(k)}</b>`;
      $q('#lc-fila')?.appendChild(it.el);
      game.items.push(it); game.spawned++;
      // a próxima entrada: rajadas (3 coladas) de vez em quando; o espaço entre elas encolhe com o progresso
      if (game.burst > 0) game.burst--; else if (game.score > 4 && Math.random() < .16) { game.burst = 2; mjLog('Rajada de contêineres!', 'warn'); }
      const p = Math.min(1, game.score / Math.max(1, game.meta));
      game.gap = game.burst > 0 ? .1 : .3 - .1 * p + Math.random() * .08;
    }
    function filaRun() {
      cancelAnimationFrame(game.raf);
      let last = performance.now();
      const field = $q('#lc-fl-field');
      const frame = (t) => {
        if (!alive || !field?.isConnected) return;
        game.raf = requestAnimationFrame(frame);
        const dt = Math.min(.05, (t - last) / 1000); last = t;
        if (busy || game.paused || document.visibilityState !== 'visible') return;
        const v = 1 / filaFall();
        const top = game.items[game.items.length - 1];
        if (!top || top.y >= game.gap) filaSpawn();
        const H = field.clientHeight - 74; // a doca ocupa a parte de baixo
        game.items.forEach((it, i) => {
          it.y += v * dt;
          it.el.style.transform = `translate3d(-50%, ${(it.y * H).toFixed(1)}px, 0)`;
          if (i === 0 && !it.el.classList.contains('on')) { it.el.classList.add('on'); kbTarget(it.k); }
          it.el.classList.toggle('warn', i === 0 && it.y > .78);
        });
        const first = game.items[0];
        if (first && first.y >= 1) filaCrash(first);
        const spd = $q('#lc-fl-spd'); if (spd) { const x = `${(4.2 / filaFall()).toFixed(1).replace('.', ',')}×`; if (spd.textContent !== x) spd.textContent = x; }
      };
      game.raf = requestAnimationFrame(frame);
    }
    function filaCombo() {
      const c = $q('#lc-fl-combo'); if (!c) return;
      c.dataset.on = game.combo >= 3 ? (game.combo >= 10 ? '2' : '1') : '0';
      c.querySelector('b').textContent = `×${game.combo}`;
      if (game.combo >= 3) replay(c, 'pop');
    }
    function filaSlot(k) { return view.querySelector(`.lc-fl-slot[data-fk="${k === ' ' ? 'space' : k}"]`); }
    /* contêiner bateu na doca: dano */
    function filaCrash(it) {
      game.items.shift(); it.el.classList.add('crash'); it.el.style.transform += ' scale(1.2, .4)'; setTimeout(() => it.el.remove(), 450);
      miss(null); game.combo = 0; filaCombo();
      replay(filaSlot(it.k), 'hurt'); replay($q('#lc-fl'), 'hurt');
      game.lives = Math.max(0, game.lives - 1); mjLives(game.lives);
      game.slowUntil = performance.now() + 2500;
      if (game.lives <= 0) return filaDown();
      mjLog(`Um contêiner bateu na doca · ${game.lives} ${game.lives === 1 ? 'vida restante' : 'vidas restantes'}`, 'err');
      kbTarget(game.items[0]?.k ?? null);
    }
    function filaDown() {
      cancelAnimationFrame(game.raf);
      mjDown({
        term: $q('#lc-fl'), titulo: 'Doca danificada!', texto: `Você ancorou <b>${game.score} de ${game.meta}</b> contêineres.`,
        onResume: () => { game.items.forEach((x) => x.el.remove()); game.items = []; game.slowUntil = performance.now() + 2500; filaRun(); },
        onRestart: (term) => {
          game.items.forEach((x) => x.el.remove()); game.items = []; game.score = 0; game.combo = 0; game.burst = 0; filaCombo();
          term.insertAdjacentHTML('beforeend', startOverlay('Fila de Ancoragem')); bindStart();
          mjLog('Doca pronta. Aguardando os contêineres…');
        },
      });
    }
    function filaKey(k) {
      if (game.paused) return;
      const first = game.items[0]; if (!first) return;
      if (k === first.k) {
        hit(k); game.items.shift(); game.score++; game.combo++; game.best = Math.max(game.best, game.combo); goal(game.score, game.meta); filaCombo();
        first.el.classList.remove('on', 'warn'); first.el.classList.add('dock');
        first.el.style.transform += ' scale(1.25)'; // a escala junto com a posição: o contêiner cresce no lugar, sem escorregar
        setTimeout(() => first.el.remove(), 420);
        const slot = filaSlot(k); replay(slot, 'hit');
        if (slot) { const f = document.createElement('i'); f.className = 'lc-fl-plus'; f.textContent = game.combo >= 3 ? `×${game.combo}` : '+1'; slot.appendChild(f); setTimeout(() => f.remove(), 800); }
        mjLog(game.combo >= 5 ? `Ancorado! Combo de ${game.combo}` : 'Contêiner ancorado', 'ok');
        if (game.score >= game.meta) { game.paused = true; cancelAnimationFrame(game.raf); mjLog('Fila completa: doca organizada!', 'ok'); kbTarget(null); return setTimeout(complete, 450); }
        kbTarget(game.items[0]?.k ?? null);
      } else {
        miss(k); game.combo = 0; filaCombo(); replay(first.el, 'shake');
        mjLog('Tecla errada: o combo zerou', 'warn');
      }
    }

    /* ---------- MINIJOGO: CORRIDA DAS TECLAS (MJ-03) ----------
       Um robozinho corre por uma pista à noite; vírus de computador com uma tecla vêm na direção dele.
       Na faixa de acerto (em frente ao corredor), o aluno tecla a tecla do vírus e o robô o elimina com um laser:
       quanto mais perto do corredor, melhor a nota (Perfeito / Ótimo / Bom). Teclar antes da faixa
       é "Cedo demais" e conta como erro (zera o combo, sem tirar vida). Se o vírus chegar ao corredor,
       ele é atingido e perde uma vida.
       - A corrida acelera com o progresso (o vírus leva de 4,0 s até 2,2 s para cruzar a pista);
         às vezes vêm portais em dupla. Depois de um tropeço, 2,5 s mais devagar.
       - Vidas (padrão 3, campo "vidas") e reviver com o Saldo HC, iguais aos do MJ-01 e MJ-02. */
    const RUN_X = .2, RUN_ZONE = .3; // posição do corredor e tamanho da faixa de acerto (fração da pista)
    function corridaInit(lv) {
      game.score = 0; game.meta = lv.meta; game.paused = true; game.run = corridaRun;
      game.maxLives = lv.vidas || 3; game.lives = game.maxLives; game.revives = 0; game.combo = 0;
      game.gates = []; game.uid = 0; game.dist = 0; game.slowUntil = 0; game.pair = 0; game.nextGap = .45;
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-run" id="lc-run">
          <div class="lc-hk-bar">
            <span class="lc-hk-title lc-run-title"><i></i>Corrida das Teclas</span>
            ${livesHTML()}
            <span class="lc-fl-combo" id="lc-fl-combo" data-on="0">Combo <b>×0</b></span>
            <span class="lc-hk-time" id="lc-run-m">0 m</span>
          </div>
          <div class="lc-run-world" id="lc-run-world">
            <div class="lc-run-sky" aria-hidden="true"><i class="moon"></i></div>
            <div class="lc-run-par far" aria-hidden="true"><div></div></div>
            <div class="lc-run-par near" aria-hidden="true"><div></div></div>
            <div class="lc-run-ground" aria-hidden="true"><div></div></div>
            <div class="lc-run-zone" aria-hidden="true"><span>Faixa de acerto</span></div>
            <div class="lc-run-gates" id="lc-run-gates"></div>
            <i class="lc-laser" id="lc-laser"></i>
            <div class="lc-runner" id="lc-runner" aria-hidden="true">
              <span class="lc-runner-body"><i class="eye"></i><i class="eye"></i></span>
              <span class="lc-runner-gun"></span>
              <span class="lc-runner-legs"><i></i><i></i></span>
              <span class="lc-runner-shadow"></span>
            </div>
            <b class="lc-run-rate" id="lc-run-rate"></b>
          </div>
          <p class="lc-hk-log" id="lc-hk-log"><span>&gt;</span> <em>Vírus à vista! Tecle a tecla de cada vírus quando ele entrar na faixa.</em></p>
          ${startOverlay('Corrida das Teclas')}
        </div>`;
      goal(0, game.meta); bindStart(); kbTarget(null);
    }
    const runTravel = () => {
      const t = 4 - 1.8 * Math.min(1, game.score / Math.max(1, game.meta));
      return performance.now() < game.slowUntil ? t * 1.6 : t;
    };
    function corridaSpawn() {
      if (game.score + game.gates.length >= game.meta) return;
      const prev = game.gates[game.gates.length - 1]?.k;
      let k = L.teclas[Math.floor(Math.random() * L.teclas.length)];
      if (k === prev && Math.random() < .5) k = L.teclas[Math.floor(Math.random() * L.teclas.length)];
      const g = { id: game.uid++, k, x: 1.08, el: document.createElement('span') };
      g.el.className = 'lc-gate lc-virus'; g.el.style.setProperty('--lc', filaCor(k)); g.el.style.setProperty('--r', `${Math.random() * 360}deg`);
      g.el.innerHTML = `<span class="vbody"><i class="spikes"></i><i class="core"><u></u><u></u></i></span><b>${keyGlyph(k)}</b>`;
      $q('#lc-run-gates')?.appendChild(g.el);
      game.gates.push(g);
      // distância até o próximo vírus: duplas de vez em quando; encolhe com o progresso
      const p = Math.min(1, game.score / Math.max(1, game.meta));
      if (game.pair > 0) { game.pair--; game.nextGap = .2; }
      else if (game.score > 3 && Math.random() < .18) { game.pair = 1; game.nextGap = .2; }
      else game.nextGap = .5 - .14 * p + Math.random() * .12;
    }
    function corridaRun() {
      cancelAnimationFrame(game.raf);
      let last = performance.now();
      const world = $q('#lc-run-world'), far = world?.querySelector('.far > div'), near = world?.querySelector('.near > div'), ground = world?.querySelector('.lc-run-ground > div');
      $q('#lc-runner')?.classList.add('go');
      const frame = (t) => {
        if (!alive || !world?.isConnected) return;
        game.raf = requestAnimationFrame(frame);
        const dt = Math.min(.05, (t - last) / 1000); last = t;
        if (busy || game.paused || document.visibilityState !== 'visible') return;
        const v = 1 / runTravel(), W = world.clientWidth;
        game.dist += v * dt;
        // cenário em camadas (só transform): longe devagar, perto rápido
        far.style.transform = `translate3d(${-((game.dist * W * .15) % (W * .5))}px,0,0)`;
        near.style.transform = `translate3d(${-((game.dist * W * .45) % (W * .5))}px,0,0)`;
        ground.style.transform = `translate3d(${-((game.dist * W) % 80)}px,0,0)`;
        const lastG = game.gates[game.gates.length - 1];
        if (!lastG || lastG.x <= 1.08 - game.nextGap) corridaSpawn();
        game.gates.forEach((g, i) => {
          g.x -= v * dt;
          g.el.style.transform = `translate3d(${(g.x * W).toFixed(1)}px,0,0)`;
          const inZone = g.x - RUN_X <= RUN_ZONE;
          if (i === 0) { if (!g.el.classList.contains('on')) { g.el.classList.add('on'); kbTarget(g.k); } g.el.classList.toggle('zone', inZone); }
        });
        const first = game.gates[0];
        if (first && first.x <= RUN_X - .015) corridaCrash(first);
        const m = $q('#lc-run-m'); if (m) { const txt = `${Math.round(game.dist * 40)} m`; if (m.textContent !== txt) m.textContent = txt; }
      };
      game.raf = requestAnimationFrame(frame);
    }
    /* laser: sai do canhão do robô até o vírus (largura medida na hora) */
    function corridaLaser(g) {
      const las = $q('#lc-laser'), world = $q('#lc-run-world'); if (!las || !world) return;
      const W = world.clientWidth, x0 = RUN_X * W + 36, x1 = g.x * W - 20;
      las.style.left = `${x0}px`; las.style.width = `${Math.max(10, x1 - x0)}px`; las.style.setProperty('--lc', g.el.style.getPropertyValue('--lc'));
      replay(las, 'fire');
    }
    function corridaRate(txt, cls) { const r = $q('#lc-run-rate'); if (r) { r.textContent = txt; r.className = 'lc-run-rate ' + cls; replay(r, 'show'); } }
    function corridaCrash(g) {
      game.gates.shift(); g.el.classList.add('crash'); setTimeout(() => g.el.remove(), 450);
      miss(null); game.combo = 0; filaCombo();
      replay($q('#lc-runner'), 'trip'); replay($q('#lc-run'), 'hurt'); corridaRate('Infectado!', 'bad');
      game.lives = Math.max(0, game.lives - 1); mjLives(game.lives);
      game.slowUntil = performance.now() + 2500;
      if (game.lives <= 0) return corridaDown();
      mjLog(`Um vírus atingiu o robô · ${game.lives} ${game.lives === 1 ? 'vida restante' : 'vidas restantes'}`, 'err');
      kbTarget(game.gates[0]?.k ?? null);
    }
    function corridaDown() {
      cancelAnimationFrame(game.raf); $q('#lc-runner')?.classList.remove('go');
      mjDown({
        term: $q('#lc-run'), titulo: 'Robô infectado!', texto: `Você eliminou <b>${game.score} de ${game.meta}</b> vírus.`,
        onResume: () => { game.gates.forEach((x) => x.el.remove()); game.gates = []; game.nextGap = .45; game.slowUntil = performance.now() + 2500; corridaRun(); },
        onRestart: (term) => {
          game.gates.forEach((x) => x.el.remove()); game.gates = []; game.score = 0; game.combo = 0; game.dist = 0; game.pair = 0; game.nextGap = .45; filaCombo();
          term.insertAdjacentHTML('beforeend', startOverlay('Corrida das Teclas')); bindStart();
          mjLog('Vírus à vista! Tecle a tecla de cada vírus quando ele entrar na faixa.');
        },
      });
    }
    function corridaKey(k) {
      if (game.paused) return;
      const g = game.gates[0]; if (!g) return;
      const d = g.x - RUN_X;
      if (k === g.k && d <= RUN_ZONE) {
        hit(k); game.gates.shift(); game.score++; game.combo++; goal(game.score, game.meta); filaCombo();
        const [txt, cls] = d <= .07 ? ['Perfeito!', 'perfect'] : d <= .17 ? ['Ótimo!', 'great'] : ['Bom', 'good'];
        corridaRate(game.combo >= 3 ? `${txt} ×${game.combo}` : txt, cls);
        g.el.classList.remove('on', 'zone'); g.el.classList.add('zap'); setTimeout(() => g.el.remove(), 520);
        corridaLaser(g); replay($q('#lc-runner'), 'shoot');
        mjLog(game.combo >= 5 ? `Vírus eliminado · combo de ${game.combo}` : 'Vírus eliminado', 'ok');
        if (game.score >= game.meta) { game.paused = true; cancelAnimationFrame(game.raf); $q('#lc-runner')?.classList.remove('go'); mjLog('Pista limpa: todos os vírus eliminados!', 'ok'); kbTarget(null); return setTimeout(complete, 500); }
        kbTarget(game.gates[0]?.k ?? null);
      } else {
        miss(k); game.combo = 0; filaCombo(); replay(g.el, 'shake');
        const early = k === g.k;
        corridaRate(early ? 'Cedo demais' : 'Tecla errada', 'bad');
        mjLog(early ? 'Cedo demais: espere o vírus entrar na faixa' : 'Tecla errada: o combo zerou', 'warn');
      }
    }

    /* ---------- MINIJOGO: PALAVRAS DAS ESTRELAS (MJ-04) ----------
       Um céu noturno com nebulosas; estrelas surgem com uma palavra e um anel de tempo em volta.
       O aluno digita a palavra de uma estrela: a primeira letra escolhe a estrela (a que tem menos
       tempo, se duas começarem igual; a letra seguinte troca para a outra, se for dela). Ao completar, a estrela
       explode em faíscas, um cometa voa até o placar e fica um ponto de luz no céu, ligado aos anteriores
       (a constelação do aluno). Backspace solta a estrela escolhida para trocar de palavra.
       - Pontos: 10 por letra × o combo (+10% a cada estrela seguida, até ×2) e +50% se pegar rápido.
       - Cores pelo tamanho: azul (até 4 letras), dourada (5–6) e Supernova (7+), maior e com 8 pontas.
       - O céu enche com o progresso (de 2 até 4 estrelas ao mesmo tempo) e o tempo de cada uma encurta.
       - Se o anel acabar, a estrela cai apagada e o aluno perde uma vida; depois vêm 2,5 s mais calmos.
       - Palavras: as do campo "palavras" do nível ou o banco abaixo, só as que usam as teclas da lição.
         Com poucas teclas (ex.: só F e J), as palavras viram sequências com as teclas da lição.
       - Vidas (padrão 3) e reviver com o Saldo HC, iguais aos do MJ-01, MJ-02 e MJ-03. */
    const EST_BANCO = ('sol lua mar ceu rio luz cor paz voz mel flor casa bola gato pato vida nuvem terra '
      + 'tempo livro mundo festa sonho verde amigo plano chuva campo praia ponte barco carta noite '
      + 'piano vento folha fruta areia fogo neve onda bolo bota cair nave doce leite janela escola '
      + 'cometa planeta galaxia estrela foguete teclado tela mouse janela brilho caneta caderno '
      + 'ciencia viagem musica jardim cidade montanha floresta horizonte computador internet '
      + 'universo amizade alegria desenho palavra pergunta resposta lanterna cachorro borboleta').split(' ');
    const EST_TIER = (n) => (n <= 4 ? { c: 'azul', cor: '#7dd3fc' } : n <= 6 ? { c: 'ouro', cor: '#fde047' } : { c: 'nova', cor: '#f0abfc' });
    const EST_SLOTS = [[12, 30], [31, 26], [50, 32], [69, 26], [88, 30], [14, 74], [33, 70], [52, 76], [71, 70], [89, 74]];
    function estPath(pts, ro, ri) { // estrela de "pts" pontas num quadro de 100 × 100
      let d = '';
      for (let i = 0; i < pts * 2; i++) {
        const r = i % 2 ? ri : ro, a = (Math.PI / pts) * i - Math.PI / 2;
        d += `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
      }
      return d + 'Z';
    }
    const EST_SHAPE = { 5: estPath(5, 46, 21), 8: estPath(8, 47, 27) };
    function estFila(lv, n) {
      const ok = (w) => w && [...w].every((c) => L.teclas.includes(c));
      let pool = [...new Set((lv.palavras || EST_BANCO).map((w) => String(w).toLowerCase().trim()))].filter(ok);
      if (pool.length < 6) { // poucas teclas: sequências de 3 a 6 com as teclas da lição
        const ks = L.teclas.filter((k) => k !== ' ');
        pool = Array.from({ length: 30 }, (_, i) => Array.from({ length: 3 + (i % 4) }, () => ks[Math.floor(Math.random() * ks.length)]).join(''));
      }
      const out = []; let bag = [];
      for (let i = 0; i < n; i++) {
        if (!bag.length) bag = pool.slice().sort(() => Math.random() - .5);
        out.push(bag.pop());
      }
      // as palavras crescem com o progresso (com um pouco de mistura)
      return out.map((w) => [w, w.length + Math.random() * 3.5]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
    }
    function estrelasInit(lv) {
      game.score = 0; game.meta = lv.meta; game.paused = true; game.run = estrelasRun;
      game.maxLives = lv.vidas || 3; game.lives = game.maxLives; game.revives = 0; game.combo = 0;
      estReset(lv);
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-est" id="lc-est">
          <div class="lc-hk-bar">
            <span class="lc-hk-title lc-est-title"><i></i>Palavras das Estrelas</span>
            ${livesHTML()}
            <span class="lc-fl-combo" id="lc-fl-combo" data-on="0">Combo <b>×0</b></span>
            <span class="lc-hk-time lc-est-pts" id="lc-est-pts"><b>0</b> pts</span>
          </div>
          <div class="lc-est-world" id="lc-est-world">
            <div class="lc-est-sky" aria-hidden="true"><i class="neb n1"></i><i class="neb n2"></i><i class="neb n3"></i><i class="dots d1"></i><i class="dots d2"></i><i class="shoot s1"></i><i class="shoot s2"></i></div>
            <svg class="lc-est-lines" id="lc-est-lines" aria-hidden="true"></svg>
            <div class="lc-est-const" id="lc-est-const" aria-hidden="true"></div>
            <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
              <radialGradient id="lc-est-g-azul" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#f0f9ff"/><stop offset=".55" stop-color="#7dd3fc"/><stop offset="1" stop-color="#0ea5e9"/></radialGradient>
              <radialGradient id="lc-est-g-ouro" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fffbeb"/><stop offset=".55" stop-color="#fde047"/><stop offset="1" stop-color="#f59e0b"/></radialGradient>
              <radialGradient id="lc-est-g-nova" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fdf4ff"/><stop offset=".5" stop-color="#f0abfc"/><stop offset="1" stop-color="#a855f7"/></radialGradient>
            </defs></svg>
            <div class="lc-est-stars" id="lc-est-stars"></div>
          </div>
          <p class="lc-hk-log" id="lc-hk-log"><span>&gt;</span> <em>Digite a palavra de uma estrela antes que o anel de tempo acabe.</em></p>
          ${startOverlay('Palavras das Estrelas')}
        </div>`;
      goal(0, game.meta); bindStart(); kbTarget(null);
    }
    function estReset(lv) {
      game.stars = []; game.lock = null; game.uid = 0; game.pts = 0; game.slowUntil = 0; game.nextIn = 0; game.lastPt = null;
      game.queue = estFila(lv, game.meta + 12);
      game.need = game.queue.slice(0, game.meta).reduce((s, w) => s + w.length, 0); // a barra de estrelas conta letras
      game.ph = 0; game.pe = 0;
    }
    const estProg = () => Math.min(1, game.score / Math.max(1, game.meta));
    function estSpawn() {
      const used = new Set(game.stars.map((s) => s.slot));
      const free = EST_SLOTS.map((_, i) => i).filter((i) => !used.has(i) && i !== game.lastSlot);
      if (!free.length || !game.queue.length) return;
      // de preferência uma palavra cuja 1ª letra não está no céu (a escolha da estrela fica clara)
      const firsts = new Set(game.stars.map((s) => s.w[0]));
      let qi = game.queue.slice(0, 5).findIndex((w) => !firsts.has(w[0]));
      if (qi < 0) qi = 0;
      const w = game.queue.splice(qi, 1)[0];
      if (game.queue.length < 4) game.queue.push(...estFila(L.niveis[st.lvl], 8));
      const slot = free[Math.floor(Math.random() * free.length)]; game.lastSlot = slot;
      const [sx, sy] = EST_SLOTS[slot], x = sx + (Math.random() - .5) * 5, y = sy + (Math.random() - .5) * 6;
      const t = EST_TIER(w.length), p = estProg();
      const life = (6.6 - 2.4 * p + .5 * w.length) * (performance.now() < game.slowUntil ? 1.4 : 1);
      const s = { id: game.uid++, w, slot, x, y, typed: 0, life, left: life, pts: w.length * 10, el: document.createElement('div') };
      s.el.className = `lc-est-star t-${t.c}`;
      s.el.style.cssText = `left:clamp(60px, ${x.toFixed(1)}%, calc(100% - 60px));top:clamp(58px, ${y.toFixed(1)}%, calc(100% - 58px));--sc:${t.cor};--r:${Math.round(Math.random() * 40 - 20)}deg;--fd:${(2.6 + Math.random() * 1.6).toFixed(2)}s`;
      s.el.innerHTML = `
        <div class="lc-est-in">
          <svg class="ring" viewBox="0 0 120 120"><circle class="trk" cx="60" cy="60" r="55"/><circle class="arc" cx="60" cy="60" r="55" pathLength="100"/></svg>
          <svg class="shape" viewBox="0 0 100 100"><path d="${EST_SHAPE[t.c === 'nova' ? 8 : 5]}" fill="url(#lc-est-g-${t.c})"/></svg>
          <span class="word">${[...w].map((c) => `<i>${esc(c)}</i>`).join('')}</span>
          <small class="val">${s.pts}</small>
        </div>`;
      s.arc = s.el.querySelector('.arc');
      $q('#lc-est-stars')?.appendChild(s.el);
      game.stars.push(s);
      const n = game.stars.length;
      game.nextIn = (1.9 - .9 * p) * (n >= 2 ? 1.35 : 1) + Math.random() * .5;
    }
    function estrelasRun() {
      cancelAnimationFrame(game.raf);
      let last = performance.now();
      const world = $q('#lc-est-world');
      world?.classList.add('go');
      const frame = (t) => {
        if (!alive || !world?.isConnected) return;
        game.raf = requestAnimationFrame(frame);
        const dt = Math.min(.05, (t - last) / 1000); last = t;
        if (busy || game.paused || document.visibilityState !== 'visible') return;
        const p = estProg(), maxOn = 2 + Math.round(p * 2);
        game.nextIn -= dt;
        if (game.score + game.stars.length < game.meta && (!game.stars.length || (game.nextIn <= 0 && game.stars.length < maxOn))) estSpawn();
        for (const s of [...game.stars]) {
          s.left -= dt * (performance.now() < game.slowUntil ? .7 : 1);
          const f = Math.max(0, s.left / s.life);
          s.arc.style.strokeDashoffset = (100 * (1 - f)).toFixed(2);
          if (f < .3 && !s.low) { s.low = true; s.el.classList.add('low'); }
          if (s.left <= 0) estLose(s);
        }
      };
      game.raf = requestAnimationFrame(frame);
    }
    function estPaintPts(bump) {
      const el = $q('#lc-est-pts'); if (!el) return;
      el.querySelector('b').textContent = Math.round(game.pts).toLocaleString('pt-BR');
      if (bump) replay(el, 'pop');
    }
    function estDrop(s = game.lock) { // solta a estrela escolhida (Backspace ou quando ela se apaga)
      if (!s) return;
      s.typed = 0; s.el.classList.remove('lock');
      s.el.querySelectorAll('.word i').forEach((i) => i.classList.remove('ok'));
      if (game.lock === s) { game.lock = null; kbTarget(null); }
    }
    function estLose(s) {
      game.stars = game.stars.filter((x) => x !== s);
      estDrop(s);
      s.el.classList.add('gone'); setTimeout(() => s.el.remove(), 900);
      miss(null); game.combo = 0; filaCombo();
      replay($q('#lc-est'), 'hurt');
      game.lives = Math.max(0, game.lives - 1); mjLives(game.lives);
      game.slowUntil = performance.now() + 2500;
      if (game.lives <= 0) return estDown();
      mjLog(`A estrela “${s.w}” se apagou · ${game.lives} ${game.lives === 1 ? 'vida restante' : 'vidas restantes'}`, 'err');
    }
    function estDown() {
      cancelAnimationFrame(game.raf); $q('#lc-est-world')?.classList.remove('go');
      mjDown({
        term: $q('#lc-est'), titulo: 'O céu escureceu!', texto: `Você capturou <b>${game.score} de ${game.meta}</b> estrelas.`,
        onResume: () => { game.stars.forEach((x) => x.el.remove()); game.stars = []; game.lock = null; game.nextIn = .6; game.slowUntil = performance.now() + 2500; estrelasRun(); },
        onRestart: (term) => {
          game.stars.forEach((x) => x.el.remove()); game.score = 0; game.combo = 0; filaCombo();
          estReset(L.niveis[st.lvl]); estPaintPts();
          $q('#lc-est-lines') && ($q('#lc-est-lines').innerHTML = ''); $q('#lc-est-const') && ($q('#lc-est-const').innerHTML = '');
          term.insertAdjacentHTML('beforeend', startOverlay('Palavras das Estrelas')); bindStart();
          mjLog('Digite a palavra de uma estrela antes que o anel de tempo acabe.');
        },
      });
    }
    /* captura: a estrela explode em faíscas, um cometa leva os pontos ao placar
       e fica um ponto de luz no céu, ligado ao anterior (a constelação) */
    function estCatch(s) {
      game.stars = game.stars.filter((x) => x !== s); game.lock = null; kbTarget(null);
      { // posição real (a estrela pode ter sido empurrada para dentro nas bordas)
        const wr = $q('#lc-est-world')?.getBoundingClientRect(), r = s.el.getBoundingClientRect();
        if (wr?.width) { s.x = ((r.left + r.width / 2 - wr.left) / wr.width) * 100; s.y = ((r.top + r.height / 2 - wr.top) / wr.height) * 100; }
      }
      game.score++; game.combo++; goal(game.score, game.meta); filaCombo();
      const fast = s.left / s.life > .55, mult = 1 + Math.min(10, game.combo - 1) * .1;
      const got = Math.round(s.pts * mult * (fast ? 1.5 : 1));
      game.pts += got;
      s.el.classList.remove('lock', 'low'); s.el.classList.add('got');
      const inn = s.el.querySelector('.lc-est-in');
      inn.insertAdjacentHTML('beforeend', `<i class="flash"></i>${Array.from({ length: 12 }, (_, i) => `<i class="spark" style="--a:${i * 30 + Math.random() * 14}deg;--d:${48 + Math.random() * 34}px"></i>`).join('')}<b class="plus">+${got}${fast ? '<em>Rápido!</em>' : ''}</b>`);
      setTimeout(() => s.el.remove(), 1000);
      estComet(s); estConst(s);
      const tag = game.combo >= 3 ? ` · combo ×${game.combo}` : '';
      mjLog(`Estrela capturada: “${s.w}”${tag}`, 'ok');
      if (game.score >= game.meta) {
        game.paused = true; cancelAnimationFrame(game.raf);
        game.stars.forEach((x) => { x.el.classList.add('fade'); setTimeout(() => x.el.remove(), 600); }); game.stars = [];
        $q('#lc-est-world')?.classList.add('done');
        mjLog('Constelação completa!', 'ok');
        return setTimeout(complete, 1300);
      }
    }
    function estComet(s) {
      const term = $q('#lc-est'), pill = $q('#lc-est-pts'), world = $q('#lc-est-world'); if (!term || !pill || !world) return;
      const tr = term.getBoundingClientRect(), wr = world.getBoundingClientRect(), pr = pill.getBoundingClientRect();
      const x0 = wr.left - tr.left + (s.x / 100) * wr.width, y0 = wr.top - tr.top + (s.y / 100) * wr.height;
      const x1 = pr.left - tr.left + pr.width / 2, y1 = pr.top - tr.top + pr.height / 2;
      const c = document.createElement('i'); c.className = 'lc-est-comet'; c.style.setProperty('--sc', s.el.style.getPropertyValue('--sc'));
      c.style.left = `${x0}px`; c.style.top = `${y0}px`;
      const ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
      c.style.setProperty('--ang', `${ang}deg`);
      term.appendChild(c);
      const a = c.animate([
        { transform: `translate(-50%,-50%) rotate(${ang}deg) scale(.4)`, opacity: 0 },
        { offset: .15, transform: `translate(-50%,-50%) rotate(${ang}deg) scale(1)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${x1 - x0}px), calc(-50% + ${y1 - y0}px)) rotate(${ang}deg) scale(.6)`, opacity: .9 },
      ], { duration: 650, delay: 120, easing: 'cubic-bezier(.5, 0, .75, .4)', fill: 'both' });
      a.onfinish = () => { c.remove(); estPaintPts(true); };
    }
    function estConst(s) {
      const box = $q('#lc-est-const'), lines = $q('#lc-est-lines'); if (!box || !lines) return;
      box.insertAdjacentHTML('beforeend', `<i style="left:${s.x}%;top:${s.y}%;--sc:${s.el.style.getPropertyValue('--sc')}"></i>`);
      if (game.lastPt) {
        const [ax, ay] = game.lastPt;
        lines.insertAdjacentHTML('beforeend', `<line x1="${ax}%" y1="${ay}%" x2="${s.x}%" y2="${s.y}%" pathLength="1"/>`);
      }
      game.lastPt = [s.x, s.y];
    }
    function estKey(k) {
      if (game.paused) return;
      let s = game.lock;
      if (!s) {
        const cand = game.stars.filter((x) => x.w[0] === k).sort((a, b) => a.left - b.left);
        if (!cand.length) {
          miss(k); game.combo = 0; filaCombo(); replay($q('#lc-est-world'), 'nope');
          return mjLog(game.stars.length ? `Nenhuma estrela começa com “${k.toUpperCase()}”` : 'Espere a próxima estrela aparecer', 'warn');
        }
        s = game.lock = cand[0]; s.el.classList.add('lock');
      }
      if (s.w[s.typed] !== k) { // duas estrelas com o mesmo começo: a letra seguinte decide qual é
        const pre = s.w.slice(0, s.typed) + k, alt = game.stars.find((x) => x !== s && x.w.startsWith(pre));
        if (alt) {
          estDrop(s); s = game.lock = alt; alt.typed = pre.length - 1; alt.el.classList.add('lock');
          alt.el.querySelectorAll('.word i').forEach((i, n) => i.classList.toggle('ok', n < alt.typed));
        }
      }
      if (s.w[s.typed] === k) {
        hit(k);
        s.el.querySelectorAll('.word i')[s.typed]?.classList.add('ok');
        s.typed++;
        replay(s.el.querySelector('.shape'), 'tap');
        if (s.typed >= s.w.length) return estCatch(s);
        kbTarget(s.w[s.typed]);
      } else {
        miss(k); game.combo = 0; filaCombo(); replay(s.el.querySelector('.word'), 'shake');
        mjLog(`Tecla errada: a próxima letra de “${s.w}” é “${s.w[s.typed].toUpperCase()}” · Backspace troca de estrela`, 'warn');
      }
    }

    /* ---------- MINIJOGO: PATRULHA DAS PALAVRAS (MJ-05) ----------
       Espaço profundo com estrelas passando; a nave do aluno fica embaixo, no meio.
       Asteroides com uma palavra descem na direção da nave. O aluno digita a palavra:
       a primeira letra escolhe o asteroide (o mais perto da nave, se dois começarem igual;
       a letra seguinte troca para o outro, se for dele). A nave gira para mirar e cada letra
       certa dispara um laser que empurra o asteroide um pouquinho para trás; na última letra
       ele explode em pedaços. Backspace solta o asteroide escolhido para trocar de palavra.
       - Pontos: 10 por letra × o combo (+10% a cada asteroide seguido, até ×2);
         de vez em quando vem um asteroide dourado que vale 4× os pontos.
       - O placar tem 8 dígitos (00000068), com os zeros da frente apagados.
       - Com o progresso descem mais asteroides ao mesmo tempo (de 2 até 5), mais rápido e com palavras mais longas.
       - Se um asteroide bater na nave, o escudo pisca e o aluno perde uma vida; depois vêm 2,5 s mais devagar.
       - Palavras: as do campo "palavras" do nível ou o banco do MJ-04, só as que usam as teclas da lição.
       - Vidas (padrão 3) e reviver com o Saldo HC, iguais aos outros minijogos. */
    const NAVE_SHIP = `<svg class="lc-nv-svg" viewBox="0 0 64 84" aria-hidden="true"><defs>
        <linearGradient id="lc-nv-hull" x1="0" x2="1"><stop offset="0" stop-color="#94a3b8"/><stop offset=".45" stop-color="#f8fafc"/><stop offset="1" stop-color="#64748b"/></linearGradient>
        <linearGradient id="lc-nv-wing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#1e3a8a"/></linearGradient>
        <linearGradient id="lc-nv-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cffafe"/><stop offset=".5" stop-color="#22d3ee"/><stop offset="1" stop-color="#0e7490"/></linearGradient>
        <linearGradient id="lc-nv-fire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#67e8f9"/><stop offset="1" stop-color="#6366f1" stop-opacity="0"/></linearGradient>
      </defs>
      <path class="fire" d="M25 60 Q32 90 39 60Z" fill="url(#lc-nv-fire)"/>
      <path d="M32 20 L61 52 L60 60 L39 55 L25 55 L4 60 L3 52Z" fill="url(#lc-nv-wing)" stroke="#0c1a3a" stroke-width="1.2" stroke-linejoin="round"/>
      <rect x="12" y="40" width="3.4" height="13" rx="1.5" fill="#cbd5e1"/><rect x="48.6" y="40" width="3.4" height="13" rx="1.5" fill="#cbd5e1"/>
      <path d="M32 2 C38 14 40.5 30 40.5 46 L38.5 61 L25.5 61 L23.5 46 C23.5 30 26 14 32 2Z" fill="url(#lc-nv-hull)" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M32 40 L36 58 L28 58Z" fill="#38bdf8" opacity=".55"/>
      <ellipse cx="32" cy="25" rx="4.6" ry="9.5" fill="url(#lc-nv-glass)" stroke="#0e7490" stroke-width="1"/>
      <circle class="tip l" cx="5.5" cy="55" r="2"/><circle class="tip r" cx="58.5" cy="55" r="2"/>
    </svg>`;
    const naveDig = (n) => { const s = String(Math.max(0, Math.round(n))).padStart(8, '0').slice(-8), i = s.search(/[1-9]/); return i < 0 ? `<i>${s}</i>` : `<i>${s.slice(0, i)}</i>${s.slice(i)}`; };
    function naveInit(lv) {
      game.score = 0; game.meta = lv.meta; game.paused = true; game.run = naveRun;
      game.maxLives = lv.vidas || 3; game.lives = game.maxLives; game.revives = 0; game.combo = 0;
      naveReset(lv);
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-nv" id="lc-nv">
          <div class="lc-hk-bar">
            <span class="lc-hk-title lc-nv-title"><i></i>Patrulha das Palavras</span>
            ${livesHTML()}
            <span class="lc-fl-combo" id="lc-fl-combo" data-on="0">Combo <b>×0</b></span>
            <span class="lc-hk-time lc-nv-pts" id="lc-nv-pts" aria-label="Pontos">${naveDig(0)}</span>
          </div>
          <div class="lc-nv-world" id="lc-nv-world">
            <div class="lc-nv-sky" aria-hidden="true"><i class="neb"></i><i class="dots d1"></i><i class="dots d2"></i><i class="dots d3"></i><i class="planet"></i></div>
            <div class="lc-nv-rocks" id="lc-nv-rocks"></div>
            <div class="lc-nv-fx" id="lc-nv-fx" aria-hidden="true"></div>
            <div class="lc-nv-ship" id="lc-nv-ship"><i class="shield"></i><div class="lc-nv-aim" id="lc-nv-aim">${NAVE_SHIP}</div></div>
          </div>
          <p class="lc-hk-log" id="lc-hk-log"><span>&gt;</span> <em>Digite a palavra de um asteroide antes que ele bata na nave.</em></p>
          ${startOverlay('Patrulha das Palavras')}
        </div>`;
      goal(0, game.meta); bindStart(); kbTarget(null);
    }
    function naveReset(lv) {
      game.rocks = []; game.lock = null; game.uid = 0; game.pts = 0; game.slowUntil = 0; game.nextIn = 0; game.lastLane = -1; game.gold = 0;
      game.queue = estFila(lv, game.meta + 12);
      game.need = game.queue.slice(0, game.meta).reduce((s, w) => s + w.length, 0); // a barra de estrelas conta letras
      game.ph = 0; game.pe = 0;
    }
    const naveProg = () => Math.min(1, game.score / Math.max(1, game.meta));
    function naveGeo() { // tamanho do espaço e posição da nave (centro)
      const w = $q('#lc-nv-world'); const W = w?.clientWidth || 600, H = w?.clientHeight || 360;
      return { W, H, sx: W / 2, sy: H - 46 };
    }
    function naveSpawn(g) {
      if (!game.queue.length) return;
      const firsts = new Set(game.rocks.map((r) => r.w[0]));
      let qi = game.queue.slice(0, 5).findIndex((w) => !firsts.has(w[0]));
      if (qi < 0) qi = 0;
      const w = game.queue.splice(qi, 1)[0];
      if (game.queue.length < 4) game.queue.push(...estFila(L.niveis[st.lvl], 8));
      const lanes = 5, free = Array.from({ length: lanes }, (_, i) => i).filter((i) => i !== game.lastLane);
      const lane = free[Math.floor(Math.random() * free.length)]; game.lastLane = lane;
      const pad = Math.min(80, g.W * .14), x0 = pad + ((lane + .2 + Math.random() * .6) / lanes) * (g.W - pad * 2), y0 = -24;
      const p = naveProg();
      game.gold++;
      const gold = game.score > 1 && game.gold >= 6 && Math.random() < .35; if (gold) game.gold = 0;
      const T = (10.5 - 4.5 * p + .3 * w.length) * (gold ? .9 : 1); // segundos até a nave
      const r = { id: game.uid++, w, typed: 0, gold, x0, y0, d: 0, v: 0, T, el: document.createElement('div') };
      r.el.className = `lc-nv-rock${gold ? ' gold' : ''}`;
      r.el.innerHTML = `<div class="in" style="--rr:${Math.round(Math.random() * 10 - 5)}deg">${gold ? '<small class="x4">4× pontos</small>' : ''}<span class="word">${[...w].map((c) => `<i>${esc(c)}</i>`).join('')}</span></div>`;
      r.letters = r.el.querySelectorAll('.word i');
      $q('#lc-nv-rocks')?.appendChild(r.el);
      game.rocks.push(r);
      navePlace(r, g);
      game.nextIn = (2.4 - 1.2 * p) * (game.rocks.length >= 2 ? 1.25 : 1) + Math.random() * .6;
    }
    function navePath(r, g) { // reta do ponto de saída até a nave
      const dx = g.sx - r.x0, dy = g.sy - r.y0, D = Math.hypot(dx, dy) || 1;
      return { dx, dy, D };
    }
    function navePlace(r, g) {
      const P = navePath(r, g), f = Math.min(1, r.d / P.D);
      r.x = r.x0 + P.dx * f; r.y = r.y0 + P.dy * f; r.D = P.D;
      r.el.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0)`;
    }
    function naveRun() {
      cancelAnimationFrame(game.raf);
      let last = performance.now();
      const world = $q('#lc-nv-world');
      world?.classList.add('go');
      const frame = (t) => {
        if (!alive || !world?.isConnected) return;
        game.raf = requestAnimationFrame(frame);
        const dt = Math.min(.05, (t - last) / 1000); last = t;
        if (busy || game.paused || document.visibilityState !== 'visible') return;
        const g = naveGeo(), p = naveProg(), maxOn = 2 + Math.round(p * 3);
        game.nextIn -= dt;
        if (game.score + game.rocks.length < game.meta && (!game.rocks.length || (game.nextIn <= 0 && game.rocks.length < maxOn))) naveSpawn(g);
        const slow = performance.now() < game.slowUntil ? .55 : 1;
        for (const r of [...game.rocks]) {
          const D = navePath(r, g).D;
          r.d += (D / r.T) * dt * slow;
          navePlace(r, g);
          const left = D - r.d;
          if (left < D * .28 && !r.low) { r.low = true; r.el.classList.add('low'); }
          if (left <= 40) naveCrash(r, g);
        }
        if (game.lock && game.rocks.includes(game.lock)) naveAim(game.lock, g);
      };
      game.raf = requestAnimationFrame(frame);
    }
    function naveAim(r, g) { // a nave gira para o alvo
      const a = Math.atan2(r.y - g.sy, r.x - g.sx) * 180 / Math.PI + 90;
      const aim = $q('#lc-nv-aim'); if (aim) aim.style.transform = `rotate(${Math.max(-70, Math.min(70, a)).toFixed(1)}deg)`;
      return a;
    }
    function naveShot(r) { // laser do canhão até o asteroide
      const fx = $q('#lc-nv-fx'); if (!fx) return;
      const g = naveGeo(), a = (naveAim(r, g) - 90) * Math.PI / 180;
      const nx = g.sx + Math.cos(a) * 30, ny = g.sy + Math.sin(a) * 30;
      const len = Math.max(0, Math.hypot(r.x - nx, r.y - ny) - 6);
      const b = document.createElement('i'); b.className = `lc-nv-beam${r.gold ? ' gold' : ''}`;
      b.style.cssText = `left:${nx.toFixed(1)}px;top:${ny.toFixed(1)}px;width:${len.toFixed(1)}px;transform:rotate(${(a * 180 / Math.PI).toFixed(1)}deg)`;
      fx.appendChild(b); setTimeout(() => b.remove(), 220);
      const h = document.createElement('i'); h.className = 'lc-nv-zap'; h.style.cssText = `left:${r.x.toFixed(1)}px;top:${r.y.toFixed(1)}px`;
      fx.appendChild(h); setTimeout(() => h.remove(), 300);
      replay($q('#lc-nv-ship'), 'kick');
    }
    function navePaintPts(bump) {
      const el = $q('#lc-nv-pts'); if (!el) return;
      el.innerHTML = naveDig(game.pts);
      if (bump) replay(el, 'pop');
    }
    function naveDrop(r = game.lock) { // solta o asteroide escolhido (Backspace ou quando ele bate)
      if (!r) return;
      r.typed = 0; r.el.classList.remove('lock');
      r.letters.forEach((i) => i.classList.remove('ok'));
      if (game.lock === r) { game.lock = null; kbTarget(null); const aim = $q('#lc-nv-aim'); if (aim) aim.style.transform = ''; }
    }
    function naveBoom(x, y, gold, big) { // explosão com pedaços de rocha
      const fx = $q('#lc-nv-fx'); if (!fx) return;
      const n = big ? 12 : 9;
      fx.insertAdjacentHTML('beforeend', `<span class="lc-nv-boom${gold ? ' gold' : ''}${big ? ' big' : ''}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px"><i class="flash"></i><i class="ring"></i>${Array.from({ length: n }, (_, i) => `<i class="bit" style="--a:${(i * 360 / n + Math.random() * 20).toFixed(0)}deg;--d:${(36 + Math.random() * 40).toFixed(0)}px;--s:${(4 + Math.random() * 6).toFixed(1)}px;--r:${Math.round(Math.random() * 300)}deg"></i>`).join('')}</span>`);
      const el = fx.lastElementChild; setTimeout(() => el.remove(), 900);
    }
    function naveCrash(r, g) {
      game.rocks = game.rocks.filter((x) => x !== r);
      naveDrop(r);
      r.el.remove(); naveBoom(r.x, r.y, false, true);
      miss(null); game.combo = 0; filaCombo();
      replay($q('#lc-nv-ship'), 'hit'); replay($q('#lc-nv'), 'hurt');
      game.lives = Math.max(0, game.lives - 1); mjLives(game.lives);
      game.slowUntil = performance.now() + 2500;
      // os outros asteroides são empurrados um pouco para trás (a onda do escudo)
      game.rocks.forEach((x) => { x.d = Math.max(0, x.d - 60); });
      if (game.lives <= 0) return naveDown();
      mjLog(`O asteroide “${r.w}” bateu na nave · ${game.lives} ${game.lives === 1 ? 'vida restante' : 'vidas restantes'}`, 'err');
    }
    function naveClear() { game.rocks.forEach((x) => x.el.remove()); game.rocks = []; game.lock = null; const aim = $q('#lc-nv-aim'); if (aim) aim.style.transform = ''; kbTarget(null); }
    function naveDown() {
      cancelAnimationFrame(game.raf); $q('#lc-nv-world')?.classList.remove('go');
      mjDown({
        term: $q('#lc-nv'), titulo: 'Nave atingida!', texto: `Você destruiu <b>${game.score} de ${game.meta}</b> asteroides.`,
        onResume: () => { naveClear(); game.nextIn = .6; game.slowUntil = performance.now() + 2500; naveRun(); },
        onRestart: (term) => {
          naveClear(); game.score = 0; game.combo = 0; filaCombo();
          naveReset(L.niveis[st.lvl]); navePaintPts();
          term.insertAdjacentHTML('beforeend', startOverlay('Patrulha das Palavras')); bindStart();
          mjLog('Digite a palavra de um asteroide antes que ele bata na nave.');
        },
      });
    }
    function naveKill(r) {
      game.rocks = game.rocks.filter((x) => x !== r); game.lock = null; kbTarget(null);
      game.score++; game.combo++; goal(game.score, game.meta); filaCombo();
      const mult = 1 + Math.min(10, game.combo - 1) * .1;
      const got = Math.round(r.w.length * 10 * mult * (r.gold ? 4 : 1));
      game.pts += got;
      r.el.remove(); naveBoom(r.x, r.y, r.gold, r.gold || r.w.length >= 7);
      $q('#lc-nv-fx')?.insertAdjacentHTML('beforeend', `<b class="lc-nv-plus${r.gold ? ' gold' : ''}" style="left:${r.x.toFixed(1)}px;top:${r.y.toFixed(1)}px">+${got}${r.gold ? '<em>4× pontos</em>' : ''}</b>`);
      { const p = $q('#lc-nv-fx')?.lastElementChild; setTimeout(() => p?.remove(), 1000); }
      navePaintPts(true);
      const tag = game.combo >= 3 ? ` · combo ×${game.combo}` : '';
      mjLog(`Asteroide destruído: “${r.w}”${r.gold ? ' · 4× pontos!' : ''}${tag}`, 'ok');
      if (game.score >= game.meta) {
        game.paused = true; cancelAnimationFrame(game.raf);
        game.rocks.forEach((x) => { x.el.classList.add('fade'); setTimeout(() => x.el.remove(), 600); }); game.rocks = [];
        const aim = $q('#lc-nv-aim'); if (aim) aim.style.transform = '';
        $q('#lc-nv-world')?.classList.add('done');
        mjLog('Setor limpo! A nave seguiu viagem.', 'ok');
        return setTimeout(complete, 1500);
      }
      const aim = $q('#lc-nv-aim'); if (aim) aim.style.transform = '';
    }
    function naveKey(k) {
      if (game.paused) return;
      let r = game.lock;
      if (!r) {
        const cand = game.rocks.filter((x) => x.w[0] === k).sort((a, b) => (b.d / b.D) - (a.d / a.D));
        if (!cand.length) {
          miss(k); game.combo = 0; filaCombo(); replay($q('#lc-nv-world'), 'nope');
          return mjLog(game.rocks.length ? `Nenhum asteroide começa com “${k.toUpperCase()}”` : 'Espere o próximo asteroide aparecer', 'warn');
        }
        r = game.lock = cand[0]; r.el.classList.add('lock');
      }
      if (r.w[r.typed] !== k) { // dois asteroides com o mesmo começo: a letra seguinte decide qual é
        const pre = r.w.slice(0, r.typed) + k, alt = game.rocks.find((x) => x !== r && x.w.startsWith(pre));
        if (alt) {
          naveDrop(r); r = game.lock = alt; alt.typed = pre.length - 1; alt.el.classList.add('lock');
          alt.letters.forEach((i, n) => i.classList.toggle('ok', n < alt.typed));
        }
      }
      if (r.w[r.typed] === k) {
        hit(k);
        r.letters[r.typed]?.classList.add('ok');
        r.typed++;
        naveShot(r);
        r.d = Math.max(0, r.d - 7); // o tiro empurra o asteroide para trás
        replay(r.el.querySelector('.in'), 'tap');
        if (r.typed >= r.w.length) return naveKill(r);
        kbTarget(r.w[r.typed]);
      } else {
        miss(k); game.combo = 0; filaCombo(); replay(r.el.querySelector('.word'), 'shake');
        mjLog(`Tecla errada: a próxima letra de “${r.w}” é “${r.w[r.typed].toUpperCase()}” · Backspace troca de asteroide`, 'warn');
      }
    }

    /* ---------- MINIJOGO: GRANDE PRÊMIO DAS TECLAS (MJ-06) ----------
       Uma pista neon à noite com 5 faixas; em cada uma corre um robozinho. O do aluno ("Você") fica
       na faixa da frente e os outros quatro (Byte, Pixel, Chip e Turbo) correm sozinhos.
       Embaixo fica a frase: cada letra certa faz o robô do aluno avançar; a letra errada fica marcada
       em vermelho e não avança (é preciso teclar a certa). A frase anda sozinha, sempre com a letra
       atual à vista. Acentos e maiúsculas não precisam ser exatos (é = e, A = a, ç = c).
       - Os rivais correm perto do ritmo do campo "ppm" (padrão 20 palavras por minuto): um mais
         lento, dois parecidos e um mais rápido, com arrancadas e tropeços de vez em quando.
       - O placar mostra a posição ao vivo (1º a 5º) e as palavras por minuto do aluno.
       - Na chegada vem o pódio com a colocação, PPM, precisão e tempo. Não tem vidas: o aluno
         sempre termina a corrida, em qualquer posição.
       - Frase: a do campo "frase" do nível, uma das "frases" ou do banco abaixo, só as que dá para
         escrever com as teclas da lição; com poucas teclas vira uma sequência de palavras da lição. */
    const GP_BANCO = [
      'A lua não tem luz própria e reflete a luz do sol.',
      'O beija-flor bate as asas muito rápido para ficar parado no ar.',
      'Quem treina digitação todo dia fica cada vez mais rápido.',
      'As abelhas fazem o mel com o néctar das flores do campo.',
      'O teclado tem letras, números e símbolos para escrever.',
      'A internet liga pessoas do mundo inteiro em poucos segundos.',
      'A tartaruga marinha nada milhares de quilômetros pelo oceano.',
      'O cérebro continua aprendendo coisas novas durante toda a vida.',
      'O computador guarda fotos, músicas, textos e jogos na memória.',
      'Uma boa postura na cadeira ajuda a digitar sem cansar as mãos.',
      'O sol nasce no leste e se põe no oeste todos os dias.',
      'A girafa é o animal mais alto e dorme poucas horas por noite.',
    ];
    const GP_RIVAIS = [['Byte', '167, 139, 250'], ['Pixel', '244, 114, 182'], ['Chip', '251, 191, 36'], ['Turbo', '52, 211, 153']];
    const gpNorm = (c) => String(c).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    function gpFrase(lv) {
      const ok = (f) => [...gpNorm(f)].every((c) => L.teclas.includes(c));
      const pool = [lv.frase, ...(lv.frases || []), ...(lv.frase || lv.frases ? [] : GP_BANCO)].filter(Boolean).filter(ok);
      if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
      const sp = L.teclas.includes(' ') ? ' ' : '';
      let out = '';
      for (const w of estFila(lv, 30)) { if ((out + sp + w).length > 48) break; out += (out ? sp : '') + w; }
      return out;
    }
    const gpOrd = (n) => `${n}º`;
    function gpInit(lv) {
      game.paused = true; game.run = gpRun; game.meta = 0; game.pos5 = 0;
      game.maxLives = lv.erros || 10; game.lives = game.maxLives; game.revives = 0; // chances: cada tecla errada gasta uma
      game.text = gpFrase(lv); game.pos = 0; game.need = game.text.length; game.ph = 0; game.pe = 0; game.errs = 0; game.t0 = 0; game.done = false;
      const base = (lv.ppm || 20) * 5 / 60; // letras por segundo
      const mult = [.72, .9, 1.02, 1.16].sort(() => Math.random() - .5);
      game.racers = [
        ...GP_RIVAIS.map(([nome, cor], i) => ({ nome, cor, me: false, p: 0, v: base * mult[i], f: 1, next: 0, fin: 0 })),
        { nome: 'Você', cor: '56, 189, 248', me: true, p: 0, fin: 0 },
      ];
      game.order = 0; game.cam = 0; game.racers[4].dp = 0;
      const lane = (r, i) => `
        <div class="lc-gp-lane" style="--i:${i};--bc:${r.cor}"><i class="dash"></i></div>`;
      const bot = (r, i) => `
        <div class="lc-gp-racer${r.me ? ' me' : ''}" data-r="${i}" style="--i:${i};--bc:${r.cor}">
          <span class="tag"><b>${i + 1}</b>${esc(r.nome)}</span>
          <span class="bot"><i class="trail"></i><span class="body"><i class="eye"></i><i class="eye"></i></span><span class="legs"><i></i><i></i></span><i class="shadow"></i></span>
          <span class="flag">🏁</span>
        </div>`;
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-gp" id="lc-gp">
          <div class="lc-hk-bar">
            <span class="lc-hk-title lc-gp-title"><i></i>Grande Prêmio das Teclas</span>
            <span class="lc-gp-chances" title="Chances: cada tecla errada gasta uma"><small>Chances</small>${livesHTML()}</span>
            <span class="lc-gp-pos" id="lc-gp-pos">Posição <b>5º</b><small>/5</small></span>
            <span class="lc-hk-time lc-gp-ppm" id="lc-gp-ppm"><b>0</b> PPM</span>
          </div>
          <div class="lc-gp-world" id="lc-gp-world">
            <div class="lc-gp-sky" aria-hidden="true"><i class="glow"></i><i class="city far"></i><i class="city"></i><i class="lights"></i></div>
            <div class="lc-gp-posts" aria-hidden="true"></div>
            <div class="lc-gp-track" aria-hidden="true">${game.racers.map(lane).join('')}<span class="lc-gp-startl" id="lc-gp-startl"><em>Largada</em></span><span class="lc-gp-finl" id="lc-gp-finl"><em>Chegada</em><i></i></span></div>
            <div class="lc-gp-racers" id="lc-gp-racers">${game.racers.map(bot).join('')}</div>
          </div>
          <div class="lc-gp-type" id="lc-gp-type">
            <span class="lc-gp-hint" id="lc-gp-hint">Comece a digitar</span>
            <div class="lc-gp-line"><div class="lc-gp-txt" id="lc-gp-txt">${[...game.text].map((c, i) => `<i data-i="${i}"${c === ' ' ? ' class="sp"' : ''}>${c === ' ' ? '&nbsp;' : esc(c)}</i>`).join('')}</div></div>
            <div class="lc-gp-bar"><i id="lc-gp-bar"></i><span class="chk"></span></div>
          </div>
          ${startOverlay('Grande Prêmio das Teclas')}
        </div>`;
      game.chs = [...$q('#lc-gp-txt').children];
      game.els = [...$q('#lc-gp-racers').children];
      game.lay = { dash: [...$q('#lc-gp').querySelectorAll('.lc-gp-lane .dash')], city: [...$q('#lc-gp').querySelectorAll('.lc-gp-sky .city')], posts: $q('#lc-gp .lc-gp-posts'), start: $q('#lc-gp-startl'), fin: $q('#lc-gp-finl') };
      goal(0, game.text.length); bindStart(); gpCaret(); gpPlace();
    }
    function gpCaret() {
      const c = game.chs?.[game.pos]; if (!c) return;
      game.chs.forEach((x) => x.classList.remove('cur'));
      c.classList.add('cur');
      const line = $q('#lc-gp-txt'); if (!line) return;
      line.style.transform = `translateX(${(-Math.max(0, c.offsetLeft - line.parentElement.clientWidth * .3)).toFixed(0)}px)`;
      kbTarget(gpNorm(game.text[game.pos]));
    }
    /* a pista é bem mais longa que a tela: a câmera segue o robô do aluno (que fica a ~32% da largura),
       o cenário anda em camadas (faixas, cidade perto e longe) e a chegada só aparece no fim.
       Quem fica fora da tela vira uma etiqueta presa na borda, com seta. Tudo com transform. */
    const GP_X0 = 120;
    const gpLen = (W) => Math.max(W * 2.6, game.text.length * 26); // comprimento da pista em px
    function gpPlace(dt = 1) {
      const W = $q('#lc-gp-world')?.clientWidth || 600, len = game.text.length, TL = gpLen(W);
      const me = game.racers[4];
      me.dp += (me.p - me.dp) * Math.min(1, dt * 12); // o robô do aluno desliza até a letra digitada
      const X = (r) => GP_X0 + TL * Math.min(1, (r.me ? r.dp : r.p) / len);
      const finX = GP_X0 + TL;
      const want = Math.max(0, Math.min(finX + 150 - W, X(me) - W * .32));
      game.cam += (want - game.cam) * Math.min(1, dt * 5);
      const cam = game.cam;
      game.racers.forEach((r, i) => {
        const el = game.els[i]; if (!el) return;
        let x = X(r) - cam, side = '';
        if (x > W - 14) { x = W - 14; side = 'ahead'; } else if (x < 14) { x = 14; side = 'behind'; }
        const tx = `translateX(${x.toFixed(1)}px)`;
        if (el._tx !== tx) { el._tx = tx; el.style.transform = tx; }
        if (el._side !== side) { el._side = side; el.classList.toggle('ahead', side === 'ahead'); el.classList.toggle('behind', side === 'behind'); }
        const flip = !side && x < 110; // perto da borda esquerda: a etiqueta vai para a direita do robô
        if (el._flip !== flip) { el._flip = flip; el.classList.toggle('tagr', flip); }
      });
      const L = game.lay; if (L) {
        const mv = (el, v) => { const t = `translateX(${v.toFixed(1)}px)`; if (el && el._tx !== t) { el._tx = t; el.style.transform = t; } };
        L.dash.forEach((d, i) => mv(d, -(cam % 36))); // traços das faixas
        mv(L.city[0], -((cam * .12) % 160)); mv(L.city[1], -((cam * .3) % 117)); // cidade longe e perto
        mv(L.posts, -(cam % 180)); // postes de luz na beira da pista
        mv(L.start, GP_X0 - 30 - cam); mv(L.fin, finX - cam);
      }
      const ahead = game.racers.filter((r) => !r.me && (r.fin ? (!me.fin || r.fin < me.fin) : r.p > me.p)).length;
      const pos = ahead + 1;
      if (pos !== game.pos5) {
        game.pos5 = pos;
        const el = $q('#lc-gp-pos'); if (el) { el.querySelector('b').textContent = gpOrd(pos); el.dataset.p = pos; replay(el, 'pop'); }
      }
      // número de cada um na etiqueta (colocação ao vivo)
      const rank = game.racers.map((r, i) => [i, r.fin || 1e9, -r.p]).sort((a, b) => a[1] - b[1] || a[2] - b[2]);
      rank.forEach(([i], n) => { const b = game.els[i]?.querySelector('.tag b'); if (b && b.textContent !== String(n + 1)) b.textContent = n + 1; });
    }
    function gpRun() {
      cancelAnimationFrame(game.raf);
      let last = performance.now();
      if (!game.t0) game.t0 = last;
      $q('#lc-gp-world')?.classList.add('go');
      $q('#lc-gp-type')?.classList.add('go');
      const frame = (t) => {
        if (!alive || !$q('#lc-gp')) return;
        game.raf = requestAnimationFrame(frame);
        const dt = Math.min(.05, (t - last) / 1000); last = t;
        if (busy || game.paused || document.visibilityState !== 'visible') return;
        const len = game.text.length;
        game.racers.forEach((r, i) => {
          if (r.me || r.fin) return;
          r.next -= dt;
          if (r.next <= 0) { // muda o ritmo: arrancada, ritmo normal ou um tropeço
            const x = Math.random();
            r.f = x < .12 ? 0 : x < .3 ? 1.35 : .75 + Math.random() * .45;
            r.next = r.f === 0 ? .45 + Math.random() * .4 : .7 + Math.random() * .9;
          }
          const warm = Math.min(1, (t - game.t0) / 1500); // largada suave
          r.p = Math.min(len, r.p + r.v * r.f * warm * dt);
          game.els[i].classList.toggle('run', r.f > 0);
          if (r.p >= len) { r.fin = ++game.order; game.els[i].classList.add('fin'); game.els[i].classList.remove('run'); }
        });
        gpPlace(dt);
        if (!game.lastPpm || t - game.lastPpm > 500) { game.lastPpm = t; gpPpm(t); }
      };
      game.raf = requestAnimationFrame(frame);
    }
    function gpPpm(t = performance.now()) {
      const min = Math.max(1 / 60, (t - game.t0) / 60000), v = Math.round(game.pos / 5 / min);
      const el = $q('#lc-gp-ppm b'); if (el && el.textContent !== String(v)) el.textContent = v;
      return v;
    }
    function gpKey(k) {
      if (game.paused || game.done) return;
      const want = game.text[game.pos]; if (want == null) return;
      const c = game.chs[game.pos], me = game.els[4];
      $q('#lc-gp-hint')?.classList.add('gone');
      if (gpNorm(k) === gpNorm(want)) {
        hit(gpNorm(want));
        c.classList.add('ok');
        game.pos++; game.racers[4].p = game.pos;
        me.classList.add('run'); clearTimeout(game.runT); game.runT = setTimeout(() => me.classList.remove('run'), 450);
        goal(game.pos, game.text.length);
        const bar = $q('#lc-gp-bar'); if (bar) bar.style.transform = `scaleX(${(game.pos / game.text.length).toFixed(4)})`;
        if (game.pos >= game.text.length) return gpFinish();
        gpCaret();
      } else {
        miss(want === ' ' ? null : gpNorm(want)); game.errs++;
        c.classList.add('bad'); replay(c, 'shake'); replay(me, 'trip');
        game.lives = Math.max(0, game.lives - 1); mjLives(game.lives);
        if (game.lives <= 0) gpDown();
      }
    }
    /* sem chances: reviver com o Saldo HC (volta com todas as chances e continua dali) ou recomeçar a corrida */
    function gpDown() {
      const left = game.text.length - game.pos, t = performance.now();
      $q('#lc-gp-world')?.classList.remove('go');
      game.els[4]?.classList.remove('run');
      mjDown({
        term: $q('#lc-gp'), titulo: 'Sem chances!', revTxt: `Continuar com ${game.maxLives} chances`,
        texto: `Você errou ${game.maxLives} teclas. Faltavam <b>${left} ${left === 1 ? 'letra' : 'letras'}</b> para a linha de chegada.`,
        onResume: () => { game.t0 += performance.now() - t; $q('#lc-gp-world')?.classList.add('go'); }, // o tempo parado não conta no PPM
        onRestart: () => { cancelAnimationFrame(game.raf); gpInit(L.niveis[st.lvl]); },
      });
    }
    function gpFinish() {
      game.done = true; // a pista ainda anda meio segundo (a câmera chega e os rivais continuam) antes do pódio
      const me = game.racers[4]; me.fin = ++game.order;
      const pos = game.pos5, ppm = gpPpm(), acc = Math.round((game.ph / Math.max(1, game.ph + game.pe)) * 100);
      const secs = Math.round((performance.now() - game.t0) / 1000);
      game.els[4].classList.add('fin'); game.els[4].classList.remove('run');
      $q('#lc-gp-world')?.classList.add('done'); kbTarget(null);
      const medal = pos <= 3 ? ['ouro', 'prata', 'bronze'][pos - 1] : 'outro';
      const msg = pos === 1 ? 'Você venceu a corrida!' : pos <= 3 ? `Você chegou em ${gpOrd(pos)} lugar!` : `Você completou a corrida em ${gpOrd(pos)}!`;
      setTimeout(() => {
        game.paused = true; cancelAnimationFrame(game.raf);
        $q('#lc-gp')?.insertAdjacentHTML('beforeend', `
          <div class="lc-gp-end m-${medal}">
            <div class="in">
              <span class="medal"><i></i><b>${gpOrd(pos)}</b></span>
              <h4>${msg}</h4>
              <div class="stats"><span><b>${ppm}</b>PPM</span><span><b>${acc}%</b>Precisão</span><span><b>${secs}s</b>Tempo</span></div>
            </div>
            ${pos === 1 ? Array.from({ length: 18 }, (_, i) => `<i class="conf" style="--x:${(Math.random() * 100).toFixed(0)}%;--d:${(Math.random() * .6).toFixed(2)}s;--c:${['#fde047', '#38bdf8', '#f472b6', '#34d399', '#a78bfa'][i % 5]};--r:${Math.round(Math.random() * 360)}deg"></i>`).join('') : ''}
          </div>`);
      }, 900);
      setTimeout(complete, 3800);
    }

    /* ---------- início dos minijogos de tempo (botão + 3, 2, 1) ---------- */
    /* tela de início: cada minijogo com a sua cor, ícone, missão, meta e vidas */
    const MJ_START = {
      'Varredura Hacker': { c: '52, 211, 153', c2: '16, 185, 129', un: 'ameaças', txt: 'Tecle a tecla acesa antes que o anel de tempo acabe.',
        ico: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>' },
      'Fila de Ancoragem': { c: '56, 189, 248', c2: '37, 99, 235', un: 'contêineres', txt: 'Ancore cada contêiner antes que ele bata na doca.',
        ico: '<rect x="3" y="7" width="18" height="12" rx="1.5"/><path d="M7 7v12M11 7v12M15 7v12M19 7v12M8 4h8"/>' },
      'Corrida das Teclas': { c: '244, 114, 182', c2: '168, 85, 247', un: 'vírus', txt: 'Elimine os vírus quando eles entrarem na faixa verde.',
        ico: '<circle cx="12" cy="12" r="5"/><path d="M12 2.5V7M12 17v4.5M2.5 12H7M17 12h4.5M5.3 5.3l3.2 3.2M15.5 15.5l3.2 3.2M5.3 18.7l3.2-3.2M15.5 8.5l3.2-3.2"/>' },
      'Palavras das Estrelas': { c: '253, 224, 71', c2: '245, 158, 11', un: 'estrelas', txt: 'Digite a palavra de cada estrela antes que o anel acabe.',
        ico: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>' },
      'Grande Prêmio das Teclas': { c: '96, 165, 250', c2: '168, 85, 247', txt: 'Digite a frase para o seu robô chegar primeiro na linha de chegada.', chip: () => `<span class="chip"><svg viewBox="0 0 24 24"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>Frase de <b>${game.text.length} letras</b></span><span class="chip"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg><b>4</b> rivais</span><span class="chip lives">${HEART}<b>${game.maxLives}</b> chances</span>`,
        ico: '<path d="M5 21V4"/><path d="M5 4h14v9H5"/><path d="M9 4v9M13 4v9M17 4v9M5 8.5h14"/>' },
      'Patrulha das Palavras': { c: '34, 211, 238', c2: '99, 102, 241', un: 'asteroides', txt: 'Destrua os asteroides antes que eles batam na nave.',
        ico: '<path d="M12 2.5c3 2.6 4.3 6.3 4.3 10.2v3.8H7.7v-3.8c0-3.9 1.3-7.6 4.3-10.2Z"/><circle cx="12" cy="9.5" r="1.8"/><path d="M7.7 12.5 4.5 16v3l3.2-1.5M16.3 12.5l3.2 3.5v3l-3.2-1.5M10 19.5l2 2.5 2-2.5"/>' },
    };
    const startOverlay = (name) => {
      const m = MJ_START[name] || MJ_START['Varredura Hacker'];
      const meta = game.meta ? `<span class="chip"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>Meta <b>${game.meta} ${m.un}</b></span>` : '';
      const lives = game.maxLives ? `<span class="chip lives">${HEART}<b>${game.maxLives}</b> ${game.maxLives === 1 ? 'vida' : 'vidas'}</span>` : '';
      return `<div class="lc-start" id="lc-start" style="--sc:${m.c};--sc2:${m.c2}">
        <div class="lc-start-in">
          <span class="lc-start-ico"><i></i><i></i><svg viewBox="0 0 24 24" aria-hidden="true">${m.ico}</svg></span>
          <small class="lc-start-tag">Minijogo</small>
          <h4>${name}</h4>
          <p>${m.txt}</p>
          ${m.chip ? `<div class="lc-start-chips">${m.chip()}</div>` : meta || lives ? `<div class="lc-start-chips">${meta}${lives}</div>` : ''}
          <button type="button" class="lc-start-btn"><span>${svg('play', true)}</span>Iniciar minijogo</button>
          <small class="lc-start-key">ou aperte <kbd>Enter</kbd></small>
        </div>
      </div>`;
    };
    function bindStart() { $q('.lc-start-btn')?.addEventListener('click', countdown); }
    async function countdown() {
      const ov = $q('#lc-start'); if (!ov || game.counting) return; game.counting = true;
      const g = game; // "Recomeçar o minijogo" mostra o botão de novo: a contagem precisa poder rodar outra vez
      try {
        ov.classList.add('counting');
        for (const n of [3, 2, 1]) { if (!ov.isConnected) return; ov.innerHTML = `<div class="lc-count"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="trk" cx="50" cy="50" r="44"/><circle class="arc" cx="50" cy="50" r="44" pathLength="100"/></svg><b>${n}</b><small>${n === 3 ? 'Prepare-se' : n === 2 ? 'Mãos no teclado' : 'Já!'}</small></div>`; await sleep(800); }
        if (!ov.isConnected) return;
        ov.remove(); game.paused = false; (game.run || hackerRun)();
      } finally { g.counting = false; }
    }
    function shake(sel) { replay(view.querySelector(sel), 'shake'); }

    /* ---------- teclado (físico e da tela) ---------- */
    function press(k) {
      if (phase !== 'play' || busy) return;
      const lv = L.niveis[st.lvl]; if (!lv) return;
      if (game.intro) { // apresentação da tecla nova: sem pontos nem erros
        if (game.intro === 'find' && k === game.nova) { kb?.flash(k, true); return game.introFound(); }
        kb?.flash(k, false); return shake('.lc-new h3 kbd');
      }
      if (lv.tipo === 'typing') return typingKey(k);
      if (lv.tipo === 'corrida') return corridaKey(k);
      if (lv.tipo === 'estrelas') return estKey(k);
      if (lv.tipo === 'nave') return naveKey(k);
      if (lv.tipo === 'gp') return gpKey(k);
      if (lv.tipo === 'fila') return filaKey(k);
      if (lv.tipo === 'hacker') { if (game.paused) return; return hackerKey(k); }
    }
    function onKey(e) {
      if (!view.isConnected || !$q('.lc')) return stop();
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.target.closest?.('input, textarea, select')) return;
      const k = e.key === ' ' || e.key === 'Spacebar' ? ' ' : (e.key || '').toLowerCase();
      if (phase !== 'play') return;
      if (k === 'escape' && kbOpen) { e.preventDefault(); return kbShow(false); }
      const lv = L.niveis[st.lvl];
      if (k === 'backspace' && lv?.tipo === 'typing' && !game.intro && !busy) { e.preventDefault(); return typingBack(); }
      if (k === 'enter' && (lv?.tipo === 'hacker' || lv?.tipo === 'fila' || lv?.tipo === 'corrida' || lv?.tipo === 'estrelas' || lv?.tipo === 'nave' || lv?.tipo === 'gp') && game.paused) { e.preventDefault(); return countdown(); }
      if (lv?.tipo === 'gp') { // corrida: qualquer letra, número ou sinal conta (Backspace não volta)
        if (k === 'backspace' || k.length === 1) { e.preventDefault(); if (k.length === 1) press(k); }
        return;
      }
      if ((lv?.tipo === 'estrelas' || lv?.tipo === 'nave') && !game.intro) { // palavras: todas as letras contam, Backspace troca de estrela/asteroide
        if (k === 'backspace') { e.preventDefault(); if (!busy && !game.paused) (lv.tipo === 'nave' ? naveDrop : estDrop)(); return; }
        if (k === ' ') { e.preventDefault(); return; }
        if (/^[a-zç]$/.test(k)) { e.preventDefault(); return press(k); }
      }
      if (game.intro === 'found' && k === 'enter') { e.preventDefault(); kb?.flash('enter', true); game.introDone = true; return smoothResize(() => typingInit(lv)); }
      if (game.intro && k.length === 1) { e.preventDefault(); return press(k); }
      if (L.teclas.includes(k)) { e.preventDefault(); return press(k); }
      // outra letra durante a digitação conta como erro (como no treino original)
      if (lv?.tipo === 'typing' && k.length === 1 && /\S/.test(k) && !busy) { miss(k); game.chs?.[game.pos]?.classList.add('had'); shake(`.lc-ch[data-i="${game.pos}"]`); }
    }
    document.addEventListener('keydown', onKey);
    function stop() { content?.classList.remove('lc-page'); bgWatch.disconnect(); dropBg(); alive = false; clearTimeout(kbTimer); clearInterval(speedTick); clearInterval(tick); clearInterval(game.timer); clearInterval(gs.glint); kbPopDrop(); document.removeEventListener('keydown', onKey); }
    window.addEventListener('hashchange', stop, { once: true });

    /* ---------- fim do teste (acervo do professor) ---------- */
    function testDone() {
      phase = 'test'; paintProgress();
      const main = $q('#lc-main'); if (!main) return;
      main.classList.remove('is-typing');
      main.innerHTML = `
        <div class="lc-test-end">
          <span class="lc-test-ok">${svg('check')}</span>
          <h2>Teste concluído</h2>
          <p>${esc(TEST.nome || L.titulo)}: precisão de ${Math.round(accuracy())}% em ${fmt(st.time)}. Nada foi salvo na conta.</p>
          <p class="lc-test-hint">Quer mudar algo? Peça pelo código <b>${esc(TEST.cod || '')}</b>, por exemplo “no ${esc(TEST.cod || '')}, …”.</p>
          <div class="lc-test-btns"><button type="button" class="btn-dark" data-t="again">${svg('refresh')}Testar de novo</button><a class="btn-soft" href="${esc(TEST.voltar)}">Voltar ao acervo</a></div>
        </div>`;
      main.querySelector('[data-t="again"]').addEventListener('click', () => { st = fresh(); play(); });
    }

    /* ---------- resultado ---------- */
    function results(review = false) {
      phase = 'results'; clearInterval(game.timer); paintProgress(); shell.classList.remove('is-wel'); kbPopDrop();
      st.done = true; st.lvl = N;
      // refazendo: só salva se superou o recorde; senão o recorde anterior continua valendo
      let record = '';
      if (review) record = '';
      else if (!best) { saveProgress(L.id, { ...st }); best = { ...st }; }
      else if (ptsOf(st) > ptsOf(best)) { saveProgress(L.id, { ...st }); best = { ...st }; record = 'new'; }
      else record = 'kept';
      const a = accuracy();
      const rating = a >= 88 ? 'Excelente' : a >= 70 ? 'Bom' : 'Regular';
      const times = st.levelTimes.map((t, i) => [t || 0, i]).filter(([t]) => t > 0);
      const fast = times.length ? times.reduce((m, x) => (x[0] < m[0] ? x : m)) : [st.time, 0];
      const slow = times.length ? times.reduce((m, x) => (x[0] > m[0] ? x : m)) : [st.time, 0];
      const g = grade(st.xp);
      const first = (meName() || '').split(' ')[0];
      // saldo HC: a lição concluída rende moedas pelas estrelas, Superstar e Megastar (revendo o resultado não rende)
      let cash = null;
      if (window.HC_cash) {
        const p = ptsOf(st), from = window.HC_cash.get().saldo;
        const gain = review ? 0 : window.HC_cash.ganhoDe(starsOf(p), rankOf(p));
        if (gain) window.HC_cash.add(gain, L.id);
        cash = { from, gain, review };
      }
      // todas as informações ficam só na tela final animada; por baixo fica apenas um espaço vazio
      body.innerHTML = '<section class="lc-results-blank" aria-hidden="true"></section>';
      showFinale({ a, rating, fast, slow, g, record, cash });
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
      // trava também a altura: as letras embaralhadas (fonte monoespaçada) deixavam a linha mais alta e, ao se acertarem,
      // o título e a faixa de baixo davam uma "descidinha"
      h.style.height = `${h.getBoundingClientRect().height}px`;
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
    function showFinale({ a, rating, fast, slow, g, record, cash = null, test = false, ptsTest = null }) {
      document.querySelector('.lr')?.remove();
      const pts = ptsTest ?? Math.min(PTS_MAX, Math.round((st.levelPts || []).reduce((t, x) => t + (x || 0), 0)));
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
              <span class="lr-tab"></span><i class="lr-flash" aria-hidden="true"></i>
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
                ${record === 'new' ? `<span class="lr-rec new">${svg('star', true)}Novo recorde! Sua melhor pontuação foi atualizada.</span>`
                  : record === 'kept' ? `<span class="lr-rec">Seu recorde continua: ${ptsOf(best).toLocaleString('pt-BR')} pontos.</span>` : ''}
              </div>
            </div>
          </div>
        </div>
        ${cash ? `<div class="lr-cash">
          <div class="lr-cash-box" role="status" aria-label="Saldo HC: ${window.HC_cashFmt(cash.from + cash.gain)}"><div class="lr-cash-pill"><span class="lr-cash-val" aria-hidden="true"></span></div><span class="lr-cash-coin" aria-hidden="true"><i class="lr-cash-glow"></i><i class="lr-cash-wave"></i><span class="lr-cash-radar"><i></i><i></i><i></i></span><img src="assets/moeda/moeda.webp" alt="" draggable="false"></span></div>
          <span class="lr-cash-note">${cash.review ? 'Seu saldo HC' : cash.gain ? `<b>+${window.HC_cashFmt(cash.gain)}</b> moedas nesta lição` : 'Conquiste estrelas para ganhar moedas'}</span>
        </div>` : ''}
        <div class="lr-foot"><span class="lr-wait" role="status"><em>Aguarde, registrando seus dados</em><span class="lr-spin" aria-hidden="true"></span></span><button type="button" class="lr-go" data-lr="go">Continuar ${svg('play', true)}</button></div>
        <div class="lr-bands">${[0, 1, 2, 3, 4, 5, 6].map((k) => `<i style="--k:${k}"></i>`).join('')}</div>`;
      document.body.append(el);
      requestAnimationFrame(() => el.classList.add('in'));
      const money = cash ? cashFx(el, cash, reduce) : null;
      if (!reduce) decode(el.querySelector('.lr-congrats'), 2000);
      ['superstar', 'megastar'].forEach((k) => { new Image().src = `assets/estrelas/titulo-${k}.png`; }); // já deixa as imagens prontas

      const num = el.querySelector('.lr-num'), fill = el.querySelector('.lr-fill'), stars = el.querySelectorAll('.lr-star');
      const track = el.querySelector('.lr-track'), rnum = el.querySelector('.lr-rnum'), rstars = el.querySelectorAll('.lr-rstar'), beam = el.querySelector('.lr-beam');
      const burst = el.querySelector('.lr-burst'), word = el.querySelector('.lr-word');
      /* brilho na faixa do nome: uma luz suave atravessa a faixa da esquerda para a direita, por trás das
         informações; no Superstar/Megastar ele dura um pouco mais */
      const flash = el.querySelector('.lr-flash');
      const flashFx = (r) => {
        if (reduce) return;
        flash.getAnimations().forEach((a) => a.cancel());
        flash.animate([
          { opacity: 0, backgroundPosition: '100% 0' },
          { opacity: 1, backgroundPosition: '85% 0', offset: .15 },
          { opacity: 1, backgroundPosition: '12% 0', offset: .85 },
          { opacity: 0, backgroundPosition: '0% 0' },
        ], { duration: r ? 1300 : 900, easing: 'cubic-bezier(.4, 0, .2, 1)' });
      };
      const showRank = (r) => {
        flashFx(r); money?.earn(r === 'mega' ? window.HC_cash.MEGASTAR : window.HC_cash.SUPERSTAR, burst, r === 'mega' ? 9 : 7);
        el.classList.remove('super', 'mega'); el.classList.add(r);
        word.innerHTML = `<img src="assets/estrelas/titulo-${r === 'mega' ? 'megastar' : 'superstar'}.png" alt="${RANK_NAME[r]}">`; burst.classList.remove('go'); void burst.offsetWidth; burst.classList.add('go');
      };
      /* desempenho: estrelas e pontos andam com transform (sem recalcular a página a cada quadro); o número só é
         reescrito quando muda; o número grande (escondido durante a contagem) só recebe o valor no fim */
      let tw = track.clientWidth, shown = '';
      const onResize = () => { if (!el.isConnected) return removeEventListener('resize', onResize); tw = track.clientWidth; };
      addEventListener('resize', onResize);
      const paint = (v) => {
        const txt = Math.round(v).toLocaleString('pt-BR');
        if (txt !== shown) { shown = txt; rnum.textContent = txt; }
        const p = v / PTS_MAX;
        track.style.setProperty('--x', `${(p * tw).toFixed(1)}px`); // estrelas e pontos andam junto com a ponta da barra
        fill.style.transform = `scaleX(${p.toFixed(4)})`;
        if (v >= STAR_AT[0] && !el.classList.contains('starred')) el.classList.add('starred'); // o número sai do branco na 1ª estrela
        // cada estrela nova surge na ponta da barra (as antigas vão ficando atrás) e um feixe de brilho corre pela parte cheia
        rstars.forEach((s, i) => { if (v >= STAR_AT[i] && !s.classList.contains('on')) { s.classList.add('on'); flashFx(); money?.earn(window.HC_cash.POR_ESTRELA, s, 4); beam.classList.remove('go'); void beam.offsetWidth; beam.classList.add('go'); } });
        if (v >= MEGA_AT && !el.classList.contains('mega')) showRank('mega');
        else if (v >= SUPER_AT && v < MEGA_AT && !el.classList.contains('super')) showRank('super');
      };
      // no fim: as estrelas da barra dão um pulinho e somem encolhendo para trás; só então aparecem no lugar delas, ao lado dos pontos
      const land = () => { el.classList.add('land'); stars.forEach((s, i) => s.classList.toggle('on', pts >= STAR_AT[i])); };
      const finish = () => {
        paint(pts); num.textContent = shown; money?.settle();
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
        if (el.dataset.xp) return;
        el.dataset.xp = '1';
        if (test) return close();
        // primeiro a tela de XP; o Continuar dela faz a volta à plataforma
        const xs = !reduce && window.HC_xp ? xpScreen({ gained: runXp, onDone: () => backHome(xs) }) : null;
        if (!xs) backHome(null);
      });
      const backHome = (xs) => {
        const I = window.HC_intro;
        if (reduce || !I) { xs?.remove(); return close(() => { location.hash = '#informatica/cursos'; }); }
        if (el.dataset.leaving) return;
        el.dataset.leaving = '1'; // as faixas da abertura passam por cima da tela de resultado
        const n = parseInt(String(L.id).split('-')[1], 10) || 1;
        I.play(n, L, { label: 'Retornando à plataforma', sub: 'Lição concluída' });
        setTimeout(() => { el.remove(); xs?.remove(); location.hash = '#informatica/cursos'; I.end(); }, I.PEAK + 200);
      };
      el.querySelector('[data-lr="again"]').addEventListener('click', () => close(() => { st = fresh(); runXp = 0; play(); }));
      el.querySelector('[data-lr="report"]').addEventListener('click', () => report(a, rating, fast, slow, g));
      const onHash = () => { if (!el.classList.contains('out')) el.remove(); }; // saiu por outro caminho (menu, voltar)
      window.addEventListener('hashchange', onHash, { once: true });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' && el.classList.contains('done') && e.target === el) el.querySelector('[data-lr="go"]').click(); });
    }
    /* ---------- saldo HC na tela final ----------
       Entrada: a moeda vem de perto do aluno, girando pelas perspectivas, e "cai" para o fundo até parar no
       canto de cima; aí a barrinha branca abre por trás dela e o saldo atual aparece.
       Depois, a cada estrela que acende (e no Superstar/Megastar) saem moedas da conquista, girando e voando
       em arco até a moeda da barrinha; cada uma que chega faz a moeda dar um pulso rápido (seguidas, viram um pulsar), sobe o "+35,27" e o saldo rola
       como um odômetro (com centavos), liso. Enquanto ganha, o número fica amarelo; no fim, verde, e a moeda brilha
       soltando círculos de radar. */
    // perspectivas da moeda em sequência de giro/tombo (p1 frente, p2 três quartos, p3 quase de perfil, p7 perfil, p4 verso…)
    const COIN_FR = [1, 2, 3, 7, 6, 5, 8, 9, 11, 12, 10, 4].map((k) => `assets/moeda/p${k}.webp`);
    // um giro completo da moeda de frente (o segundo número espelha a imagem; p4 é o verso)
    const COIN_SPIN = [[1, 1], [2, 1], [3, 1], [7, 1], [3, -1], [4, 1], [3, 1], [7, 1], [3, -1], [2, -1], [1, 1]];
    function cashFx(el, { from, gain }, reduce) {
      COIN_FR.concat('assets/moeda/moeda.webp').forEach((src) => { new Image().src = src; });
      const box = el.querySelector('.lr-cash'), pill = el.querySelector('.lr-cash-pill'), val = el.querySelector('.lr-cash-val');
      const coin = el.querySelector('.lr-cash-coin'), coinImg = coin.querySelector('img');
      const C = (v) => Math.round(v * 100); // tudo em centavos por dentro (sem erro de arredondamento)
      const fromC = C(from), finalC = C(from + gain);
      /* odômetro em centavos: casas 0 e 1 são os centavos (menores), depois a vírgula e as casas inteiras com ponto de milhar */
      const n = Math.max(3, String(finalC).length);
      const cols = [], seps = [];
      let html = '';
      for (let k = n - 1; k >= 0; k--) {
        html += `<span class="od-c${k < 2 ? ' cent' : ''}" data-k="${k}"><span class="od-s">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<i>${d}</i>`).join('')}</span></span>`;
        if (k === 2) html += '<span class="od-sep cent">,</span>';
        else if (k > 2 && (k - 2) % 3 === 0) html += `<span class="od-sep" data-k="${k}">.</span>`;
      }
      val.innerHTML = `<span class="od">${html}</span>`;
      val.querySelectorAll('.od-c').forEach((c) => cols.push([+c.dataset.k, c, c.firstElementChild]));
      val.querySelectorAll('.od-sep[data-k]').forEach((c) => seps.push([+c.dataset.k, c]));
      const draw = (v) => { // v em centavos (pode ter fração enquanto rola)
        cols.forEach(([k, c, strip]) => {
          const p = 10 ** k;
          // a casa só rola quando a de baixo vira de 9 para 0 (como num odômetro de verdade)
          let o = Math.floor(v / p) % 10;
          if (k === 0) o = v % 10; else { const r = v % p; if (r > p - 1) o += r - (p - 1); }
          strip.style.transform = `translateY(${(-o).toFixed(3)}em)`;
          c.classList.toggle('lead', k > 2 && v < p - .001);
        });
        seps.forEach(([k, s]) => s.classList.toggle('lead', v < 10 ** k - .001));
      };
      let shown = fromC, target = fromC, raf = 0, last = 0, ended = false;
      const tone = () => { // amarelo enquanto ganha; verde quando terminou tudo
        if (ended && shown === finalC && !flying.length) { pill.classList.remove('rise'); if (gain > 0 && !pill.classList.contains('win')) replay(coin, 'fin'); // terminou: a moeda brilha e solta círculos de radar
           pill.classList.toggle('win', gain > 0); }
      };
      const loop = (now) => {
        raf = 0; if (!el.isConnected) return;
        const dt = Math.min(64, now - (last || now)); last = now;
        shown += (target - shown) * (1 - Math.exp(-dt / 280)); // chega devagarinho no valor novo
        if (Math.abs(target - shown) < .5) shown = target;
        draw(shown);
        if (shown !== target) raf = requestAnimationFrame(loop); else { last = 0; tone(); }
      };
      const credit = (c) => { target += c; pill.classList.add('rise'); if (!raf) raf = requestAnimationFrame(loop); };
      draw(fromC);
      const flying = [];
      if (reduce) { box.classList.add('c1', 'c2', 'c3'); target = shown = finalC; draw(finalC); ended = true; tone(); return { earn() {}, settle() {} }; }

      /* giro da moeda pelas perspectivas: frames = quantas trocas, cada uma um pouco mais lenta (ms0 → ms1) */
      let spinT = 0;
      const spin = (frames = COIN_SPIN.length, ms0 = 55, ms1 = 55) => {
        clearTimeout(spinT); let i = 0;
        const next = () => {
          const [k, m] = COIN_SPIN[i % COIN_SPIN.length], endNow = i >= frames - 1;
          coinImg.src = endNow ? 'assets/moeda/moeda.webp' : `assets/moeda/p${k}.webp`;
          coinImg.style.transform = !endNow && m < 0 ? 'scaleX(-1)' : '';
          if (!endNow) { i++; spinT = setTimeout(next, ms0 + (ms1 - ms0) * (i / frames) ** 2); }
        };
        next();
      };

      /* ENTRADA: moeda caindo de perto do aluno para o fundo → barrinha abre → saldo aparece */
      let ready = false; const queue = [];
      const T0 = 2400;
      setTimeout(() => {
        if (!el.isConnected) return;
        box.classList.add('c1');
        const r = coin.getBoundingClientRect(), host = el.getBoundingClientRect();
        // começa grande e desfocada, perto do centro da tela, como se estivesse na frente do rosto do aluno
        const dx = host.left + host.width * .5 - (r.left + r.width / 2), dy = host.top + host.height * .52 - (r.top + r.height / 2);
        coin.animate([
          { transform: `translate(${dx}px, ${dy}px) translateY(-50%) scale(6) rotate(-24deg)`, opacity: 0, filter: 'blur(14px)' },
          { opacity: 1, offset: .14 },
          { transform: `translate(${dx * .18}px, ${dy * .12}px) translateY(-50%) scale(1.5) rotate(6deg)`, filter: 'blur(1px)', offset: .62 },
          { transform: 'translateY(-50%) scale(.9) rotate(-2deg)', filter: 'blur(0)', offset: .84 },
          { transform: 'translateY(-50%) scale(1.06)', offset: .93 },
          { transform: 'translateY(-50%) scale(1)', opacity: 1, filter: 'blur(0)' },
        ], { duration: 1500, easing: 'cubic-bezier(.3, .55, .35, 1)', fill: 'backwards' });
        spin(30, 34, 120); // gira rápido no ar e vai desacelerando até parar de frente
        setTimeout(() => { if (el.isConnected) { replay(coin, 'land'); } }, 1350);
        setTimeout(() => { if (el.isConnected) box.classList.add('c2'); }, 1450); // a barrinha abre por trás da moeda
        setTimeout(() => { if (!el.isConnected) return; box.classList.add('c3'); setTimeout(() => { ready = true; queue.splice(0).forEach((f) => f()); }, 650); }, 2050);
      }, T0);

      /* "+35,27" subindo da barrinha */
      const plus = (c) => {
        const b = document.createElement('b'); b.className = 'lr-cash-plus'; b.textContent = `+${window.HC_cashFmt(c / 100)}`;
        box.append(b);
        b.addEventListener('animationend', () => b.remove());
      };
      /* cada moeda que chega: a moeda dá um pulso rápido (cresce e volta). Se outra chega enquanto ela ainda está
         voltando, o pulso recomeça na hora do tamanho em que ela estava — com várias moedas seguidas fica um pulsar rápido */
      let pulseA = null;
      const hit = () => {
        let s0 = 1;
        try { const m = new DOMMatrixReadOnly(getComputedStyle(coinImg).transform); s0 = m.a || 1; } catch {}
        pulseA?.cancel();
        pulseA = coinImg.animate([{ transform: `scale(${s0})` }, { transform: 'scale(1.2)', offset: .28 }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(.3, .7, .4, 1)' });
        pill.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.035)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' });
        replay(coin, 'hit');
      };

      /* moedas voando: um único laço de quadros cuida de todas */
      let fRaf = 0;
      const fly = (now) => {
        fRaf = 0; if (!el.isConnected) return;
        for (let j = flying.length - 1; j >= 0; j--) {
          const c = flying[j], t = (now - c.t0) / c.d;
          if (t < 0) continue;
          if (t >= 1) { c.node.remove(); flying.splice(j, 1); c.land(); continue; }
          const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // sai devagar, acelera no meio e entra na barrinha
          const x = (1 - e) * (1 - e) * c.x0 + 2 * (1 - e) * e * c.cx + e * e * c.x1;
          const y = (1 - e) * (1 - e) * c.y0 + 2 * (1 - e) * e * c.cy + e * e * c.y1;
          const s = t < .18 ? .3 + (t / .18) * .9 : 1.2 - (t - .18) / .82 * .62; // nasce pequena, cresce e encolhe ao entrar
          c.node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
          c.node.style.opacity = t < .08 ? t / .08 : 1;
          const fi = (c.f0 + Math.floor((now - c.t0) / c.fd)) % COIN_FR.length;
          if (fi !== c.fi) { c.fi = fi; c.img.src = COIN_FR[fi]; }
        }
        if (flying.length) fRaf = requestAnimationFrame(fly);
      };
      const launch = (amountC, x0, y0, count) => {
        const host = el.getBoundingClientRect(), b = coin.getBoundingClientRect();
        const x1 = b.left + b.width / 2 - host.left, y1 = b.top + b.height / 2 - host.top;
        const share = Math.floor(amountC / count);
        let landed = 0;
        for (let i = 0; i < count; i++) {
          const node = document.createElement('i'); node.className = 'lr-fcoin';
          const img = document.createElement('img'); img.alt = ''; img.draggable = false; node.append(img); el.append(node);
          const jx = (Math.random() - .5) * 60, jy = (Math.random() - .5) * 40;
          flying.push({
            node, img, fi: -1, f0: Math.floor(Math.random() * COIN_FR.length), fd: 50 + Math.random() * 35,
            x0: x0 + jx, y0: y0 + jy, x1, y1, cx: (x0 + x1) / 2 + (Math.random() - .5) * 220, cy: Math.min(y0, y1) - 90 - Math.random() * 140,
            t0: performance.now() + i * 85, d: 950 + Math.random() * 350,
            land: () => { landed++; if (landed === 1) plus(amountC); credit(i === count - 1 ? amountC - share * (count - 1) : share); hit(); },
          });
        }
        if (!fRaf) fRaf = requestAnimationFrame(fly);
      };
      const earn = (amount, srcEl, count = 4) => {
        if (!el.isConnected || !srcEl) return;
        // a posição de saída é a da conquista agora; se a barrinha ainda estiver entrando, as moedas esperam
        const host = el.getBoundingClientRect(), a = srcEl.getBoundingClientRect();
        const x0 = a.left + a.width / 2 - host.left, y0 = a.top + a.height / 2 - host.top;
        const go = () => launch(C(amount), x0, y0, count);
        if (ready) go(); else queue.push(go);
      };
      // terminada a contagem: o saldo mostrado é exatamente o novo saldo e o número fica verde
      const settle = () => {
        const check = () => {
          if (!el.isConnected) return;
          if (!ready || flying.length) return setTimeout(check, 300);
          ended = true;
          if (target !== finalC) credit(finalC - target); else tone();
        };
        setTimeout(check, 600);
      };
      return { earn, settle };
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

    if (TEST) { play(); if (TEST.auto) setTimeout(() => $q(TEST.auto === 'xp' ? '#lc-xptest' : '#lc-lrtest')?.click(), 900); }
    else welcome();
  }

  window.HC_licao = { open };
})();
