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
      banner: '',        // imagem do banner do módulo (sugestão: 1600 × 420; no celular é cortada pelo centro)
      nivel: 'Nível iniciante',
      titulo: 'Vamos começar.',
      subtitulo: 'Bem-vindo ao primeiro módulo de digitação.',
      secao: 'Primeiro comando.',
      secaoComplemento: 'As teclas básicas, uma lição de cada vez.',
      texto: 'Nesta etapa, você encontrará atividades elaboradas especialmente para introduzir os conceitos iniciais do teclado. É essencial compreender o funcionamento de cada tecla; por isso, cada seção é projetada com atenção para facilitar a aprendizagem e a memorização dos diferentes grupos de teclas a seguir.',
      totalNiveis: 170,
      licoes: [
        { tag: 'Introdução', titulo: 'Conhecendo J, F e Espaço', imagem: '', arquivo: 'curso/licao-01.js' },
        { tag: 'Introdução', titulo: 'Teclas U, R e K', imagem: '' },
        { tag: 'Introdução', titulo: 'Teclas D, E e I', imagem: '' },
        { tag: 'Introdução', titulo: 'Teclas C, G e N', imagem: '' },
        { tag: 'Revisão', titulo: 'Revisão Geral 1', imagem: '' },
      ],
    },
  ],
};

(() => {
  let mod = 0; // módulo aberto
  const ICO = {
    next: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    prev: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    keys: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
    level: '<path d="M4 20V14M10 20V9M16 20V4M22 20H2"/>',
    stack: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    chart: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;

  /* imagem, ou espaço reservado (com etiqueta para o administrador) */
  const slot = (src, label, size, k = 0) => src
    ? `<img class="pf-img" src="${esc(src)}" alt="" loading="lazy" />`
    : `<span class="pf-ph" style="--k:${k}">${svg('keys')}${isAdmin() ? `<em>${label}<small>${size}</small></em>` : ''}</span>`;

  /* lições: o motor (licao.js/.css) e os dados de cada lição só são baixados quando o aluno abre uma */
  const loaded = {};
  const load = (src) => loaded[src] ||= new Promise((ok, fail) => {
    if (src.endsWith('.css')) { const l = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: src }); l.onload = ok; l.onerror = ok; document.head.append(l); return; }
    const sc = Object.assign(document.createElement('script'), { src }); sc.onload = ok; sc.onerror = () => { delete loaded[src]; fail(); }; document.body.append(sc);
  });
  const lessonAt = (n) => HC_CURSO.modulos.flatMap((m) => m.licoes)[n - 1];
  async function openLesson(view, n) {
    const l = lessonAt(n);
    if (!l?.arquivo) { location.hash = '#informatica'; return toast('Esta lição será montada em breve.'); }
    view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando a lição…</p></div>';
    try { await Promise.all([load('curso/licao.css'), load('curso/licao.js'), load(l.arquivo)]); }
    catch { view.innerHTML = '<div class="wrap"><p class="me-loading">Não foi possível abrir a lição. Verifique a internet e tente de novo.</p></div>'; return; }
    if (location.hash !== `#informatica/licao-${n}`) return;
    window.HC_licao.open(view, window.HC_LICOES[`licao-${n}`]);
  }
  // progresso salvo de cada lição (para mostrar no card); antes de abrir a 1ª lição ainda não há nada
  const progress = (n) => { try { return JSON.parse(localStorage.getItem(`hc:info:${auth?.user?.id || 'anon'}:licao-${n}`) || 'null'); } catch { return null; } };

  function render(view, sub = '') {
    const ln = /^licao-(\d+)$/.exec(sub);
    if (ln) return openLesson(view, +ln[1]);
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
    view.innerHTML = `
    <div class="wrap pf">
      <section class="pf-hero">
        <div class="pf-hero-bg">${slot(m.banner, 'Banner do módulo', '1600 × 420')}</div>
        <div class="pf-hero-text">
          <img class="pf-hero-logo" src="assets/plataforma-informatica.webp" width="900" height="184" alt="Plataforma de Informática" />
          <span class="pill">${esc(m.nivel)} · Módulo ${mod + 1}</span>
          <h2>${esc(m.titulo)}</h2>
          <p>${esc(m.subtitulo)}</p>
          <button class="slide-cta" type="button" data-lesson="${first + 1}">Começar a lição ${String(first + 1).padStart(2, '0')} ${svg('next')}</button>
        </div>
      </section>

      <section>
        <h2 class="shelf-title"><span class="ap-grad">Seu curso.</span><span> Onde você está na Plataforma de Informática.</span></h2>
        <div class="pf-stats">
          ${stats.map(([ico, label, val, c1, c2], k) => `
          <div class="pf-stat" style="--c1:${c1};--c2:${c2};--k:${k}">
            <span class="pf-stat-ico">${svg(ico)}</span>
            <span class="pf-stat-txt"><small>${label}</small><strong>${esc(val)}</strong></span>
          </div>`).join('')}
        </div>
      </section>

      <section>
        <h2 class="shelf-title"><span class="ap-grad">${esc(m.secao)}</span><span> ${esc(m.secaoComplemento)}</span></h2>
        <p class="shelf-sub pf-sub">${esc(m.texto)}</p>
        <ol class="pf-lessons">
          ${m.licoes.map((l, i) => `
          <li class="pf-lesson" style="--i:${i}">
            <div class="pf-lesson-img">${slot(l.imagem, 'Imagem da lição', '900 × 600', i)}<span class="pf-num">${String(i + 1).padStart(2, '0')}</span></div>
            <div class="pf-lesson-body">
              <span class="pf-tag">${esc(l.tag)}</span>${(() => { const p = progress(first + i + 1); return p ? `<span class="pf-state${p.done ? ' done' : ''}">${p.done ? 'Concluída' : `Nível ${Math.min(p.lvl + 1, p.total)} de ${p.total}`}</span>` : ''; })()}
              <h3>${esc(l.titulo)}</h3>
              <button class="pf-go" type="button" data-lesson="${first + i + 1}">${(() => { const p = progress(first + i + 1); return p?.done ? 'Refazer' : p && p.lvl > 0 ? 'Continuar' : 'Acessar'; })()} ${svg('next')}</button>
            </div>
          </li>`).join('')}
        </ol>
      </section>

      <section>
        <h2 class="shelf-title"><span class="ap-grad">Próximo passo.</span><span> Terminou as lições? Siga para o próximo módulo.</span></h2>
        <div class="pf-next-card">
          <div class="pf-next-text">
            <small>${nextM ? esc(nextM.nivel) : 'Em breve'}</small>
            <strong>Módulo ${mod + 2}${nextM ? ` · ${esc(nextM.titulo)}` : ''}</strong>
            <div class="pf-next-actions">
              ${mod > 0 ? `<button class="btn-soft" type="button" data-mod="${mod - 1}">${svg('prev')}Voltar ao módulo ${mod}</button>` : ''}
              <button class="btn-dark inf-shine" type="button" ${nextM ? `data-mod="${mod + 1}"` : 'data-soon'}>Continuar para o módulo ${mod + 2} ${svg('next')}</button>
            </div>
          </div>
          <div class="pf-mascot">${slot(HC_CURSO.mascote, 'Mascote', 'PNG sem fundo', 2)}</div>
        </div>
      </section>
    </div>`;

    view.querySelectorAll('[data-mod]').forEach((b) => b.addEventListener('click', () => { mod = +b.dataset.mod; render(view); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
    view.querySelector('[data-soon]')?.addEventListener('click', () => toast(`O módulo ${mod + 2} será liberado em breve.`));
    view.querySelectorAll('[data-lesson]').forEach((b) => b.addEventListener('click', () => {
      const n = +b.dataset.lesson;
      if (!lessonAt(n)?.arquivo) return toast('Esta lição será montada em breve.');
      location.hash = `#informatica/licao-${n}`;
    }));
  }

  window.HC_platform = { render };
})();
