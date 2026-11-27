/* =========================================================
   PLATAFORMA DE INFORMÁTICA — tela de seleção (como a de um jogo)
   É a primeira tela de #informatica. Os três botões entram recolhidos (personagens
   dentro da forma); 1 s depois o do meio se expande e os personagens saem da forma.
   Passar o mouse ou usar ← → escolhe outro botão; Enter (ou clique) entra.
   O botão do meio leva aos módulos (#informatica/cursos), o da esquerda ao progresso (#informatica/progresso, curso/progresso.js)
   e o da direita à loja de itens (#informatica/loja, curso/loja.js).
   Fundo: o mesmo das lições (degradê escuro + luzes de aurora + malha de pontinhos),
   trocando de cor devagar, com a faixa branca na diagonal por cima.
   ========================================================= */
(() => {
  const IMG = 'assets/menu-info/';
  /* para trocar os personagens, substitua os arquivos em assets/menu-info (PNG/WebP sem fundo).
     progresso e loja têm duas poses: "base" com o botão recolhido e "alt" (…-sel.webp) quando ele se expande.
     deco: ícones 3D que surgem em volta do personagem, um a um, quando o botão se expande:
     [arquivo, x, y (centro, em frações do lado da forma), largura (fração do lado), giro em graus, giro da animação (1 = normal, 0 = sem girar)] */
  const OPTS = [
    { id: 'progresso', label: 'progresso', hint: 'para ver o seu progresso', g1: '#ffd65c', g2: '#ff8a3d', t1: '#fbbf24', t2: '#fb7a3c',
      art: [['progresso.webp', 'solo base'], ['progresso-sel.webp', 'solo alt']],
      deco: [['ico-pasta.webp', -.04, .06, .36, -14], ['ico-social.webp', 1.0, -.14, .44, 6], ['ico-estrela.webp', .98, .54, .36, 10], ['ico-pizza.webp', -.02, .8, .38, -8]] },
    { id: 'curso', logo: true, hint: 'para começar', g1: '#f7154c', g2: '#ff8f4e',
      art: [['aluno-celular.webp', 'l'], ['aluno-notebook.webp', 'r'], ['aluna-cabelo.webp', 'c']] },
    { id: 'loja', label: 'loja de itens', hint: 'para abrir a loja de itens', g1: '#2fd6ec', g2: '#1d56d6', t1: '#18b4d4', t2: '#2563eb',
      art: [['perfil.webp', 'solo base'], ['perfil-sel.webp', 'solo alt']],
      deco: [['ico-moeda.webp', -.04, .1, .36, -10], ['ico-coracoes.webp', .98, -.04, .58, 4], ['ico-raio.webp', .06, .74, .34, 0, 0], ['ico-botoes.webp', .9, .7, .66, -6]] },
  ];
  /* as mesmas cores dos cenários das lições: b = fundo escuro; a1, a2, a3 = luzes de aurora */
  const SCENES = [
    { b: '14 32 46', a1: '45 212 191', a2: '139 92 246', a3: '34 211 238' },
    { b: '12 26 60', a1: '59 130 246', a2: '6 182 212', a3: '99 102 241' },
    { b: '50 18 42', a1: '244 63 94', a2: '245 158 11', a3: '168 85 247' },
    { b: '26 16 62', a1: '168 85 247', a2: '236 72 153', a3: '59 130 246' },
    { b: '34 24 58', a1: '192 132 252', a2: '129 140 248', a3: '240 171 252' },
    { b: '46 20 26', a1: '251 113 133', a2: '251 146 60', a3: '250 204 21' },
    { b: '16 20 38', a1: '56 189 248', a2: '167 139 250', a3: '244 114 182' },
  ];
  const SCENE_MS = 9000; // tempo de cada cor do fundo
  const START = 1;       // botão que se expande sozinho na entrada (o do meio)

  const ENTER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4v7a4 4 0 0 1-4 4H4"/><path d="m9 10-5 5 5 5"/></svg>';
  const BELL_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a6 6 0 0 0-6 6v3.6l-1.7 3.1A1 1 0 0 0 5.2 16h13.6a1 1 0 0 0 .9-1.3L18 11.6V8a6 6 0 0 0-6-6Z"/><path d="M9.5 18a2.5 2.5 0 0 0 5 0Z"/></svg>';

  /* NOVIDADES: o aviso no alto, à esquerda, alterna entre estes itens (o sino mostra quantos são).
     Para anunciar algo novo, acrescente uma linha: tag (etiqueta), t (título), d (detalhe), go (para onde leva) e as cores c1/c2. */
  const NEWS = [
    { tag: 'Novo curso', t: 'Informática do Zero', d: '8 disciplinas, do básico ao avançado', go: '#informatica/cursos', c1: '#f7154c', c2: '#ff8f4e' },
    { tag: 'Nova disciplina', t: 'Introdução à Informática', d: '9 aulas e uma avaliação para começar', go: '#informatica/disciplina-d1', c1: '#2563eb', c2: '#38bdf8' },
    { tag: 'Nova disciplina', t: 'Sistema Operacional Windows', d: 'Pastas, arquivos, janelas e atalhos', go: '#informatica/disciplina-d2', c1: '#0ea5e9', c2: '#22d3ee' },
    { tag: 'Nova disciplina', t: 'Word e Excel', d: 'Textos formatados e planilhas com fórmulas', go: '#informatica/disciplina-d3', c1: '#059669', c2: '#34d399' },
    { tag: 'Nova disciplina', t: 'Internet e Segurança Digital', d: 'Navegue, pesquise e se proteja de golpes', go: '#informatica/disciplina-d5', c1: '#7c3aed', c2: '#c084fc' },
    { tag: 'Novos níveis', t: 'Digitação: Primeiro comando', d: 'Treine com os dez dedos e ganhe XP', go: '#informatica/cursos', c1: '#f59e0b', c2: '#fb7a3c' },
    { tag: 'Novidade', t: 'Loja de itens', d: 'Troque seu Saldo HC por avatares e molduras', go: '#informatica/loja', c1: '#1d56d6', c2: '#2fd6ec' },
  ];
  const NEWS_MS = 5000; // tempo de cada novidade no aviso

  let run = 0; // cada abertura da tela ganha um número; timers antigos se calam

  /* faixa de boas-vindas no pé da tela: a faixa laranja entra da esquerda, a foto do aluno sobe de trás dela
     e as mensagens aparecem em seguida (entra depois que o botão do meio se expande) */
  const HI_TITLE = 'BEM-VINDO', HI_SUB = 'Pronto para se tornar mestre da informática?';
  function welcome() {
    const p = typeof auth !== 'undefined' ? (auth.profile || (auth.user ? { email: auth.user.email, name: typeof meName === 'function' ? meName() : '' } : null)) : null;
    const foto = window.HC_loja ? window.HC_loja.avatar(p || { name: '?' }, 'ifm-hi-av') : typeof userAvatar === 'function' ? userAvatar(p || { name: '?' }, 'ifm-hi-av') : ''; // avatar da loja, se equipado
    return `<div class="ifm-hi" role="note" aria-label="${HI_TITLE[0] + HI_TITLE.slice(1).toLowerCase()}! ${HI_SUB}">
        <i class="ifm-hi-bar" aria-hidden="true"></i>
        <span class="ifm-hi-ph" aria-hidden="true"><i class="ifm-hi-l ifm-hi-l1"></i><i class="ifm-hi-l ifm-hi-l2"></i><span class="ifm-hi-img">${foto}</span></span>
        <strong class="ifm-hi-t" aria-hidden="true">${[...HI_TITLE].map((c, d) => `<i style="--d:${d}">${c === ' ' ? '&nbsp;' : c}</i>`).join('')}</strong>
        <span class="ifm-hi-sub" aria-hidden="true">${HI_SUB.split(' ').map((w, d) => `<i style="--d:${d}">${w}</i>`).join(' ')}</span>
      </div>`;
  }

  function render(view) {
    const id = ++run;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let si = Math.floor(Math.random() * SCENES.length);
    const sky = (s, on) => `<div class="ifm-sky${on ? ' on' : ''}" style="--b:${s.b};--a1:${s.a1};--a2:${s.a2};--a3:${s.a3}"></div>`;

    view.innerHTML = `
    <section class="ifm${reduce ? ' still' : ''}" aria-label="Plataforma de Informática">
      <div class="ifm-bg" aria-hidden="true">${sky(SCENES[si], true)}${sky(SCENES[si], false)}<div class="ifm-dots"></div></div>
      <div class="ifm-white" aria-hidden="true"></div>
      <div class="ifm-row" role="listbox" aria-label="Escolha uma opção">
        ${OPTS.map((o, k) => `
        <button class="ifm-opt ifm-${o.id}" type="button" role="option" aria-selected="false" data-k="${k}"
          style="--i:${k};--g1:${o.g1};--g2:${o.g2}${o.t1 ? `;--t1:${o.t1};--t2:${o.t2}` : ''}"
          aria-label="${o.logo ? 'Plataforma de Informática: módulos e lições' : o.label[0].toUpperCase() + o.label.slice(1)}">
          <span class="ifm-in">
            <span class="ifm-card">
              <span class="ifm-glow"></span>
              <span class="ifm-shape"><i class="ifm-shine"></i></span>
              <span class="ifm-ring"></span>
              <span class="ifm-art"><span class="ifm-cut"><span class="ifm-float">${o.art.map(([src, c]) => `<img class="${c}" src="${IMG}${src}?v=${window.HC_V || ''}" alt="" draggable="false" decoding="async">`).join('')}</span></span></span>
              ${o.deco ? `<span class="ifm-deco" aria-hidden="true">${o.deco.map(([src, x, y, w, r, sp = 1], n) => `<i class="ifm-dc" style="--x:${x};--y:${y};--w:${w};--r0:${r}deg;--sp:${sp};--n:${n}"><img src="${IMG}${src}?v=${window.HC_V || ''}" alt="" draggable="false" decoding="async"></i>`).join('')}</span>` : ''}
            </span>
            <span class="ifm-name">${o.logo
              ? '<img class="ifm-logo" src="assets/plataforma-informatica.webp" width="900" height="184" alt="" draggable="false">'
              : `<b>${o.label}</b>`}</span>
          </span>
        </button>`).join('')}
      </div>
      <div class="ifm-news" role="region" aria-label="Novidades da plataforma">
        <span class="ifm-bell" aria-hidden="true">${BELL_SVG}<i>${NEWS.length}</i></span>
        <button class="ifm-news-card" type="button">
          <span class="ifm-news-top"><b class="ifm-news-tag"></b><em class="ifm-news-n"></em></span>
          <span class="ifm-news-txt" aria-live="polite"></span>
          <span class="ifm-news-go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></span>
          <span class="ifm-news-bars" aria-hidden="true">${NEWS.map(() => '<i><b></b></i>').join('')}</span>
        </button>
      </div>
      ${welcome()}
      <p class="ifm-wait" role="status"><em>Aguarde, preparando</em><span class="ifm-spin" aria-hidden="true"></span></p>
      <p class="ifm-enter" aria-live="polite"><span class="ifm-enter-ico">${ENTER_SVG}</span><span>Pressione enter <em><span>${OPTS[START].hint}</span></em></span></p>
    </section>`;

    const stage = view.querySelector('.ifm');
    const opts = [...stage.querySelectorAll('.ifm-opt')];
    const hint = stage.querySelector('.ifm-enter em');
    const alive = () => id === run && stage.isConnected;
    /* troca o texto do aviso: o antigo sobe e some, o novo entra letra por letra */
    const swapHint = (txt) => {
      const old = hint.querySelector('span:not(.out)');
      if (old?.textContent === txt) return;
      old?.classList.add('out'); setTimeout(() => old?.remove(), 300);
      const nw = document.createElement('span');
      nw.innerHTML = [...txt].map((c, d) => `<i style="--d:${d}">${c === ' ' ? '&nbsp;' : c}</i>`).join('');
      hint.appendChild(nw);
      const box = hint.parentElement.parentElement;
      box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap');
    };
    let sel = -1, ready = false, leaving = false, auto = 0;

    /* escolhe um botão: ele se expande e o anterior se recolhe; os vizinhos abrem espaço */
    const select = (k, focus) => {
      if (leaving || k === sel || k < 0 || k >= opts.length) return;
      clearTimeout(auto);
      sel = k;
      opts.forEach((b, j) => {
        b.classList.toggle('sel', j === k);
        b.setAttribute('aria-selected', j === k);
        b.style.setProperty('--push', j === k ? 0 : j < k ? -1 : 1);
      });
      if (!stage.classList.contains('has-sel')) setTimeout(() => { if (alive()) stage.classList.add('hi'); }, reduce ? 0 : 850); // boas-vindas depois que o botão se expande
      stage.classList.add('has-sel');
      swapHint(OPTS[k].hint);
      if (focus) opts[k].focus({ preventScroll: true });
    };

    /* entra no botão escolhido */
    const go = (k) => {
      if (leaving) return;
      const o = OPTS[k];
      leaving = true; select(k);
      stage.classList.add('leave');
      setTimeout(() => { if (alive()) location.hash = o.id === 'curso' ? '#informatica/cursos' : `#informatica/${o.id}`; }, reduce ? 0 : 620);
    };

    opts.forEach((b, k) => {
      b.addEventListener('pointerenter', (e) => { if (ready && e.pointerType === 'mouse') select(k); });
      b.addEventListener('focus', () => { if (ready) select(k); });
      b.addEventListener('click', () => {
        if (!ready) { ready = true; }
        go(k);
      });
    });
    /* aviso de novidades: alterna sozinho a cada NEWS_MS (pausa com o mouse em cima); clicar abre a novidade da vez */
    const news = stage.querySelector('.ifm-news'), nCard = news.querySelector('.ifm-news-card');
    const nTxt = news.querySelector('.ifm-news-txt'), nTag = news.querySelector('.ifm-news-tag'), nNum = news.querySelector('.ifm-news-n');
    const nBars = [...news.querySelectorAll('.ifm-news-bars i')];
    let ni = -1, nTimer = 0;
    const showNews = (k) => {
      if (!alive()) return;
      ni = (k + NEWS.length) % NEWS.length;
      const n = NEWS[ni];
      nTag.textContent = n.tag; nNum.textContent = `${ni + 1} de ${NEWS.length}`;
      news.style.setProperty('--c1', n.c1); news.style.setProperty('--c2', n.c2);
      nTxt.querySelector('span:not(.out)')?.classList.add('out');
      setTimeout(() => nTxt.querySelector('.out')?.remove(), 380);
      const el = document.createElement('span');
      el.innerHTML = `<strong>${n.t}</strong><small>${n.d}</small>`;
      nTxt.appendChild(el);
      nCard.setAttribute('aria-label', `Novidade: ${n.t}. ${n.d}`);
      nBars.forEach((b, j) => { b.className = j < ni ? 'done' : ''; });
      void nBars[ni].offsetWidth; nBars[ni].className = 'on';
      clearTimeout(nTimer);
      if (!reduce) nTimer = setTimeout(() => { if (alive() && !news.matches(':hover')) showNews(ni + 1); }, NEWS_MS);
    };
    news.addEventListener('mouseleave', () => { if (alive() && !reduce) { clearTimeout(nTimer); nTimer = setTimeout(() => showNews(ni + 1), 1200); } });
    showNews(0);
    nCard.addEventListener('click', () => {
      if (leaving) return;
      const to = NEWS[ni].go;
      if (to === '#informatica/cursos') return go(1);
      leaving = true; stage.classList.add('leave');
      setTimeout(() => { if (alive()) location.hash = to; }, reduce ? 0 : 620);
    });

    const onKey = (e) => {
      if (!alive()) return document.removeEventListener('keydown', onKey);
      if (e.target.closest?.('input, textarea, select, [contenteditable]') || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); ready = true;
        select(Math.max(0, Math.min(opts.length - 1, (sel < 0 ? START : sel) + (e.key === 'ArrowLeft' ? -1 : 1))), true);
      } else if (e.key === 'Enter' && !e.target.closest?.('button:not(.ifm-opt), a')) {
        e.preventDefault(); go(sel < 0 ? START : sel);
      }
    };
    document.addEventListener('keydown', onKey);

    /* fundo: troca de cor devagar (duas camadas que se cruzam só pela opacidade) */
    if (!reduce) {
      const skies = stage.querySelectorAll('.ifm-sky');
      let cur = 0;
      const tick = () => {
        if (!alive()) return;
        si = (si + 1) % SCENES.length;
        const s = SCENES[si], nx = skies[1 - cur];
        nx.style.cssText = `--b:${s.b};--a1:${s.a1};--a2:${s.a2};--a3:${s.a3}`;
        nx.classList.add('on'); skies[cur].classList.remove('on'); cur = 1 - cur;
        setTimeout(tick, SCENE_MS);
      };
      setTimeout(tick, SCENE_MS);
    }

    /* entrada: espera as imagens (no máx. 1,2 s), os botões entram recolhidos e,
       1 s depois, o do meio se expande */
    if (reduce) { ready = true; stage.classList.add('in'); select(START); return; }
    const imgs = [...stage.querySelectorAll('img')];
    const wait = Promise.race([
      Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : null))),
      new Promise((r) => setTimeout(r, 1200)),
    ]);
    wait.then(() => {
      if (!alive()) return;
      stage.classList.add('in');
      setTimeout(() => { if (alive()) stage.classList.add('settled'); }, 1100); // a faixa branca já entrou: libera a camada
      const inMs = 350 + (opts.length - 1) * 110 + 800; // última entrada terminando
      setTimeout(() => { if (alive()) ready = true; }, inMs - 300);
      auto = setTimeout(() => { if (alive() && sel < 0) select(START); }, inMs + 1000);
    });
  }

  window.HC_menu = { render, SCENES };
})();
