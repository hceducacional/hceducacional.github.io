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
        { tag: 'Introdução', titulo: 'Conhecendo J, F e Espaço', desc: 'Os primeiros toques: os indicadores nas teclas F e J e os polegares na barra de espaço.', imagem: '', arquivo: 'curso/licao-01.js' },
        { tag: 'Introdução', titulo: 'Teclas U, R e K', desc: 'Os indicadores sobem para U e R, e o dedo médio direito chega ao K.', imagem: '' },
        { tag: 'Introdução', titulo: 'Teclas D, E e I', desc: 'O dedo médio esquerdo no D e no E, e o médio direito no I.', imagem: '' },
        { tag: 'Introdução', titulo: 'Teclas C, G e N', desc: 'O médio esquerdo desce ao C, e os indicadores alcançam o G e o N.', imagem: '' },
        { tag: 'Revisão', titulo: 'Revisão Geral 1', desc: 'Uma revisão completa de todas as teclas aprendidas no módulo.', imagem: '' },
      ],
    },
  ],
};

/* as lições só rodam no computador (teclado físico e tela grande); no celular e no tablet o aluno vê o progresso */
window.HC_isComputer = () => innerWidth >= 760 && matchMedia('(any-pointer: fine)').matches;

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

  /* fundo do banner do módulo: a imagem própria do módulo ou, se não houver, a do banner
     da Plataforma de Informática da tela de início (com a versão de celular dele) */
  function heroBg(m) {
    if (m.banner) return slot(m.banner, '', '');
    const b = [...(typeof banners !== 'undefined' ? banners : []), ...(typeof exclusive !== 'undefined' ? exclusive : [])].find((x) => x.lockInfo && (x.image || x.imageMobile));
    if (!b) return slot('', 'Banner do módulo', '1600 × 420');
    const pos = b.imageMobile && /^\d{1,3}% \d{1,3}%$/.test(b.focusMobile || '') ? `;--pos-m:${b.focusMobile}` : '';
    return `<span class="pf-hero-img" style="--img:url('${esc(imgUrl(b.image || b.imageMobile))}')${b.imageMobile ? `;--img-m:url('${esc(imgUrl(b.imageMobile))}')` : ''}${pos}"></span>`;
  }

  /* cor de fundo dos cards (degradê embaixo), como nos cards de "Mantenha-se conectado" */
  const TINTS = ['22, 60, 48', '24, 46, 110', '70, 32, 120', '120, 40, 30', '30, 70, 90'];
  const HC_NIVEIS = { 1: '30 níveis' }; // quantos níveis cada lição tem (mostrado antes de começar)

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
        <div class="pf-hero-bg">${heroBg(m)}</div>
        <div class="pf-hero-text">
          <img class="pf-hero-logo" src="assets/plataforma-informatica.webp" width="900" height="184" alt="Plataforma de Informática" />
          <span class="pill">${esc(m.nivel)} · Módulo ${mod + 1}</span>
          <h2>${esc(m.titulo)}</h2>
          <p>${esc(m.subtitulo)}</p>
          <button class="slide-cta" type="button" data-lesson="${first + 1}">${window.HC_isComputer() ? `Começar a lição ${String(first + 1).padStart(2, '0')}` : 'Ver meu progresso'} ${svg('next')}</button>
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
        ${window.HC_isComputer() ? '' : `<div class="pf-pc-note"><span>${svg('keys')}</span><p><b>As lições são feitas no computador.</b> Por aqui você acompanha o seu progresso; para praticar, use os computadores da instituição nos dias de aula.</p></div>`}
        <ol class="pf-lessons">
          ${m.licoes.map((l, i) => {
            const n = first + i + 1, p = progress(n), num = String(n).padStart(2, '0');
            const state = !l.arquivo ? 'Em breve' : p?.done ? 'Concluída' : p ? `Nível ${Math.min(p.lvl + 1, p.total)} de ${p.total}` : `${HC_NIVEIS[n] || ''}`;
            const go = !l.arquivo ? 'Em breve' : !window.HC_isComputer() ? 'Ver' : p?.done ? 'Refazer' : p && p.lvl > 0 ? 'Continuar' : 'Acessar';
            return `
          <li class="pf-lesson${l.arquivo ? '' : ' soon'}" style="--i:${i};--tint:${TINTS[i % TINTS.length]}" data-lesson="${n}" tabindex="0" aria-label="Lição ${num}: ${esc(l.titulo)}">
            <div class="pf-lesson-img">${slot(l.imagem, 'Imagem da lição', '1000 × 1000', i)}</div>
            <div class="pf-lesson-app">
              <div class="pf-lesson-text">
                <span class="pf-lesson-tag">${esc(l.tag)}</span>
                <h3>${esc(l.titulo)}</h3>
                ${l.desc ? `<p>${esc(l.desc)}</p>` : ''}
              </div>
              <div class="pf-lesson-bar">
                <span class="pf-lesson-av">${num}</span>
                <span class="pf-lesson-who"><strong>Lição ${num}</strong><small>${esc(state)}</small></span>
                <span class="pf-lesson-go">${go}</span>
              </div>
            </div>
            ${p ? `<b class="pf-lesson-prog" style="--w:${((p.done ? p.total : p.lvl) / p.total) * 100}%"></b>` : ''}
          </li>`;
          }).join('')}
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
    const openN = (n) => { if (!lessonAt(n)?.arquivo) return toast('Esta lição será montada em breve.'); location.hash = `#informatica/licao-${n}`; };
    view.querySelectorAll('[data-lesson]').forEach((b) => {
      b.addEventListener('click', () => openN(+b.dataset.lesson));
      if (b.tagName === 'LI') b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openN(+b.dataset.lesson); } });
    });
  }

  /* traz da conta o progresso das lições (para aparecer igual no celular e em qualquer computador) */
  let synced = false;
  async function sync(view) {
    if (synced || !auth?.user || typeof sb === 'undefined' || !sb) return;
    synced = true;
    const { data, error } = await sb.from('informatica_progresso').select('licao, dados').eq('user_id', auth.user.id);
    if (error || !data?.length) return;
    let changed = false;
    data.forEach(({ licao, dados }) => {
      const key = `hc:info:${auth.user.id}:${licao}`;
      let local = null; try { local = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
      if (!local || (dados?.savedAt || 0) > (local.savedAt || 0)) { try { localStorage.setItem(key, JSON.stringify(dados)); changed = true; } catch {} }
    });
    if (changed && view.isConnected && location.hash === '#informatica') render(view);
  }

  window.HC_platform = { render: (view, sub) => { render(view, sub); if (!sub) sync(view); } };
})();
