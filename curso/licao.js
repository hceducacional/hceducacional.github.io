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
  const KIND_TINT = { hacker: '24, 46, 110', fila: '30, 70, 90', memoria: '70, 32, 120' };
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
        <article class="lc-hero">
          <div class="lc-hero-img">${meta.imagem ? `<img src="${esc(meta.imagem)}" alt="">` : `<span class="lc-hero-ph" style="--k:${meta.k || 0}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg></span>`}</div>
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
      $q('#lc-gbar').style.height = `${gPct(pts)}%`;
      $q('#lc-ghalo').style.height = `${gPct(pts)}%`;
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
      const box = $q('#lc-sparks'); if (!box) return;
      for (let i = 0; i < 3; i++) setTimeout(() => {
        const s = document.createElement('i');
        s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px'); s.style.setProperty('--dy', -(110 + Math.random() * 90) + 'px');
        box.appendChild(s); setTimeout(() => s.remove(), 1600);
      }, i * 140);
    }
    /* teclado virtual ABNT2 (curso/teclado.js); a preferência de mostrar ou não fica guardada no aparelho */
    let kb = null;
    let kbOpen = false, kbTimer = null;
    /* medidor de velocidade (pílula ao lado do botão do teclado): conta as teclas certas dos
       últimos 3 segundos; enche quando o aluno digita rápido e vai esvaziando quando ele para.
       Cor de azul (devagar) a vermelho (bem rápido); PPM = (teclas por minuto) ÷ 5. */
    const SPEED_WIN = 3000, SPEED_MAX = 60; // PPM em que a pílula fica cheia
    const reduceFx = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let presses = [], speedShown = 0, speedTick = null;
    // roda só enquanto há algo para mostrar: começa na tecla certa (speedWake) e para sozinho quando a pílula zera
    function speedRun() {
      clearInterval(speedTick); speedTick = null;
      const fill = $q('#lc-speed-fill'); if (fill) { fill.style.width = '0%'; fill.classList.add('zero'); fill._sc = '1'; }
      $q('#lc-speed')?.style.setProperty('--sc', 1);
      const num = $q('#lc-ppm'); if (num) num.textContent = '0';
      speedHeat(0);
    }
    /* calor do medidor: 0 parado · 1 aquecendo · 2 rápido (chamas pequenas e faíscas) · 3 pegando fogo */
    const HEAT_AT = [10, 22, 35], HEAT_TXT = ['Velocidade', 'Aquecendo…', 'Rápido!', 'Pegando fogo!'];
    function speedHeat(h) {
      const box = $q('#lc-speed'); if (!box || box.dataset.heat === String(h)) return;
      const up = h > +box.dataset.heat;
      box.dataset.heat = h;
      const lbl = $q('#lc-spd-lbl'); if (lbl) lbl.textContent = HEAT_TXT[h];
      if (up && h >= 2) replay(box, 'boost');
    }
    /* faíscas saindo da ponta da barra */
    function speedSparks(h, t) {
      const fx = $q('#lc-spd-fx'); if (!fx || h < 2 || fx.childElementCount > 14) return;
      const n = h === 3 ? 3 : Math.random() < .6 ? 1 : 0;
      for (let i = 0; i < n; i++) {
        const sp = document.createElement('i');
        const a = (-150 + Math.random() * 120) * Math.PI / 180, d = 16 + Math.random() * (h === 3 ? 34 : 20);
        sp.style.cssText = `left:${(t * 100).toFixed(1)}%;--dx:${(Math.cos(a) * d).toFixed(1)}px;--dy:${(Math.sin(a) * d).toFixed(1)}px;--s:${(.6 + Math.random() * .8).toFixed(2)};--d:${Math.round(420 + Math.random() * 380)}ms`;
        sp.addEventListener('animationend', () => sp.remove(), { once: true });
        fx.appendChild(sp);
      }
    }
    function speedWake() {
      if (speedTick) return;
      $q('#lc-speed-fill')?.classList.remove('zero');
      speedTick = setInterval(() => {
        if (!view.isConnected || !alive) { clearInterval(speedTick); speedTick = null; return; }
        const now = performance.now();
        while (presses.length && now - presses[0] > SPEED_WIN) presses.shift();
        const target = presses.length ? (presses.length / (SPEED_WIN / 1000)) * 60 / 5 : 0;
        speedShown += (target - speedShown) * .18; // anda devagar até o valor, sem saltos
        if (speedShown < .4) speedShown = 0;
        const fill = $q('#lc-speed-fill'), num = $q('#lc-ppm');
        if (fill && num) {
          const t = Math.min(1, speedShown / SPEED_MAX);
          fill.style.width = `${(t * 100).toFixed(1)}%`;
          fill.style.setProperty('--h', Math.round(215 - 215 * Math.min(1, speedShown / HEAT_AT[2]))); // 215 = azul … 0 = vermelho (vermelho quando pega fogo)
          num.textContent = Math.round(speedShown);
          const sc = (1 + .3 * Math.min(1, speedShown / HEAT_AT[2])).toFixed(2); // a tecla da logo cresce com a velocidade
          if (fill._sc !== sc) { fill._sc = sc; $q('#lc-speed')?.style.setProperty('--sc', sc); }
          const h = speedShown >= HEAT_AT[2] ? 3 : speedShown >= HEAT_AT[1] ? 2 : speedShown >= HEAT_AT[0] ? 1 : 0;
          speedHeat(h); if (!reduceFx) speedSparks(h, t);
        }
        if (!speedShown && !presses.length) { clearInterval(speedTick); speedTick = null; fill?.classList.add('zero'); }
      }, 80);
    }
    const KB_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>';
    const kbHTML = () => `
      <div class="lc-kbar">
        <span class="lc-speed" id="lc-speed" data-heat="0" role="img" aria-label="Velocidade de digitação">
          <span class="lc-spd-key" aria-hidden="true"><b><img src="assets/icons/logo-hc.webp" alt="" draggable="false"></b></span>
          <span class="lc-spd-body">
            <span class="lc-spd-top"><em id="lc-spd-lbl">${HEAT_TXT[0]}</em><span class="lc-spd-num"><b id="lc-ppm">0</b><small>PPM</small></span></span>
            <span class="lc-spd-track"><span class="lc-speed-pill"><i id="lc-speed-fill"></i></span><span class="lc-spd-fx" id="lc-spd-fx"></span></span>
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
    function hackerLog(t, cls = '') { const l = $q('#lc-hk-log'); if (l) { l.className = 'lc-hk-log ' + cls; l.innerHTML = `<span>&gt;</span> <em>${esc(t)}</em>`; } }
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
    function hackerLives(lostAt) {
      const box = $q('#lc-hk-lives'); if (!box) return;
      [...box.children].forEach((h, i) => { h.classList.toggle('off', i >= game.lives); if (i === lostAt) replay(h, 'break'); });
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
      game.lives = Math.max(0, game.lives - 1); hackerLives(game.lives);
      replay($q('#lc-hkt'), 'hurt');
      game.grace = 2;
      if (game.lives <= 0) { hackerDown(); return false; }
      hackerLog(`${msg} · ${game.lives} ${game.lives === 1 ? 'vida restante' : 'vidas restantes'}`, 'err');
      return true;
    }
    function hackerKey(k) {
      if (k === game.target) {
        hit(k); hackerBurst(k, true); game.score++; game.streak++; goal(game.score, game.meta);
        hackerLog(game.streak >= 3 ? `Ameaça neutralizada · sequência de ${game.streak}` : 'Ameaça neutralizada', 'ok');
        if (game.score >= game.meta) { game.paused = true; hackerLog('Sistema protegido!', 'ok'); return setTimeout(complete, 400); }
        hackerNext(); hackerPaint();
      } else {
        miss(k); game.streak = 0; shake(hkSel(game.target));
        game.left = Math.max(.35, game.left - game.limit * .25); // tecla errada: perde um quarto do tempo
        hackerLog('Tecla errada: o tempo encurtou', 'warn'); hackerPaint();
      }
    }
    /* sem vidas: reviver com o Saldo HC ou recomeçar */
    function hackerDown() {
      game.paused = true;
      const C = window.HC_cash, cost = hkRevCost(), saldo = C ? C.get().saldo : 0, can = !!C && saldo >= cost; // vale também no modo de teste: o saldo é descontado de verdade
      const fmtC = (v) => (window.HC_cashFmt ? window.HC_cashFmt(v) : v.toFixed(2).replace('.', ','));
      hackerLog('Sistema invadido!', 'err');
      const term = $q('#lc-hkt'); if (!term) return;
      term.insertAdjacentHTML('beforeend', `
        <div class="lc-hk-over" id="lc-hk-over" role="dialog" aria-label="Sistema invadido">
          <span class="lc-hk-over-ico">${HEART}</span>
          <h4>Sistema invadido!</h4>
          <p>Você neutralizou <b>${game.score} de ${game.meta}</b> ameaças. ${C ? 'Use o seu Saldo HC para reviver e continuar daqui, sem voltar ao começo.' : 'Recomece o minijogo para tentar de novo.'}</p>
          ${C ? `<div class="lc-hk-wallet"><img src="assets/moeda/moeda.webp" alt="" draggable="false"><span>Seu saldo</span><b>${fmtC(saldo)}</b></div>
          <button type="button" class="lc-hk-revive" ${can ? '' : 'disabled'}>Reviver com ${game.maxLives} vidas<span><img src="assets/moeda/moeda.webp" alt="" draggable="false">${fmtC(cost)}</span></button>
          ${!can ? '<small class="lc-hk-poor">Saldo insuficiente. Ganhe moedas com as estrelas das lições.</small>' : ''}` : ''}
          <button type="button" class="lc-hk-restart">${svg('refresh')}Recomeçar o minijogo</button>
        </div>`);
      const ov = $q('#lc-hk-over');
      ov.querySelector('.lc-hk-revive')?.addEventListener('click', (e) => {
        e.currentTarget.blur();
        if (!C.spend(cost, `${L.id}:reviver`)) return; // o saldo mudou em outro lugar
        game.revives++;
        hackerTransfer(ov, saldo, saldo - cost, cost, fmtC);
      });
      ov.querySelector('.lc-hk-restart').addEventListener('click', (e) => {
        e.currentTarget.blur();
        game.score = 0; game.streak = 0; game.grace = 0; game.lives = game.maxLives; game.revives = 0; hackerLives(-1);
        goal(0, game.meta); hackerNext(true); hackerPaint();
        ov.remove(); term.insertAdjacentHTML('beforeend', startOverlay('Varredura Hacker')); bindStart();
        hackerLog('Aguardando a varredura…');
      });
    }
    /* reviver: animação do Saldo HC sendo transferido para o sistema do jogo.
       As moedas saem da carteira e correm pelo cabo até as vidas; o saldo desce contando, a barra
       enche e cada coração acende quando um terço das moedas chega. Depois vem o 3, 2, 1. */
    async function hackerTransfer(ov, from, to, cost, fmtC) {
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
      game.lives = game.maxLives; hackerLives(-1);
      ov.classList.add('done');
      ov.querySelector('#lc-xf-st').textContent = `${game.maxLives} vidas`;
      ov.querySelector('#lc-xf-txt').textContent = 'Sistema restaurado!';
      hackerLog(`Sistema restaurado · −${fmtC(cost)} HC`, 'ok');
      await sleep(900);
      hackerResume(ov);
    }
    async function hackerResume(ov) {
      ov.classList.remove('xfer', 'done');
      for (const n of [3, 2, 1]) { if (!ov.isConnected) return; ov.innerHTML = `<b class="lc-count">${n}</b>`; await sleep(700); }
      if (!ov.isConnected) return;
      ov.remove(); hackerNext(); hackerPaint(); game.paused = false;
    }

    /* ---------- MINIJOGO: FILA DE ANCORAGEM ---------- */
    // Fila de Ancoragem: cada coluna (e as teclas dela) com uma cor
    const FILA_CORES = ['#34d399', '#a78bfa', '#fbbf24', '#f472b6', '#38bdf8', '#fb923c'];
    const filaCor = (k) => FILA_CORES[Math.max(0, L.teclas.indexOf(k)) % FILA_CORES.length];
    function filaInit(lv) {
      game.score = 0; game.meta = lv.meta;
      game.queue = Array.from({ length: lv.meta }, (_, i) => ({ id: i, k: L.teclas[Math.floor(Math.random() * L.teclas.length)] }));
      $q('#lc-stage').innerHTML = `
        <div class="lc-term lc-fila">
          <div class="lc-lanes" style="grid-template-columns:repeat(${L.teclas.length},1fr)">${L.teclas.map((k) => `<span style="--lc:${filaCor(k)}"></span>`).join('')}</div>
          <div class="lc-dock" style="grid-template-columns:repeat(${L.teclas.length},1fr)">${L.teclas.map((k) => `<span style="--lc:${filaCor(k)}">${keyLabel(k)}</span>`).join('')}</div>
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
        if (!el) { el = document.createElement('span'); el.className = 'lc-fk'; el.style.setProperty('--lc', filaCor(q.k)); el.dataset.id = q.id; el.textContent = keyGlyph(q.k); el.style.left = lane(q.k) + '%'; el.style.bottom = (18 + 5 * 52) + 'px'; box.appendChild(el); void el.offsetWidth; }
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
        hit(k); game.input++; replay(b, 'good'); setTimeout(() => b?.classList.remove('good'), 330);
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
      if (k === 'escape' && kbOpen) { e.preventDefault(); return kbShow(false); }
      const lv = L.niveis[st.lvl];
      if (k === 'backspace' && lv?.tipo === 'typing' && !game.intro && !busy) { e.preventDefault(); return typingBack(); }
      if (k === 'enter' && lv?.tipo === 'hacker' && game.paused) { e.preventDefault(); return countdown(); }
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
