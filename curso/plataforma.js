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
      nome: 'Primeiro comando',
      desc: 'As primeiras teclas da linha de referência e da fileira de cima, uma lição de cada vez.',
      imagem: '',        // imagem do card do módulo (sugestão: 1000 × 1250)
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
    // próximos módulos: aparecem como "Em breve" até receberem as lições
    { nome: 'Formando palavras', desc: 'Juntando as teclas aprendidas para escrever as primeiras palavras.', imagem: '', nivel: 'Nível iniciante', totalNiveis: 170, licoes: [] },
    { nome: 'Mais veloz que nunca', desc: 'Exercícios de ritmo e velocidade para ganhar palavras por minuto.', imagem: '', nivel: 'Nível intermediário', totalNiveis: 230, licoes: [] },
    { nome: 'Digitando sem parar', desc: 'Textos mais longos para digitar com fluidez, sem olhar para o teclado.', imagem: '', nivel: 'Nível intermediário', totalNiveis: 230, licoes: [] },
    { nome: 'Regiões do teclado', desc: 'Números, símbolos e as teclas de cada região do teclado ABNT2.', imagem: '', nivel: 'Nível avançado', totalNiveis: 150, licoes: [] },
  ],
};

/* as lições só rodam no computador (teclado físico e tela grande); no celular e no tablet o aluno vê o progresso */
window.HC_isComputer = () => innerWidth >= 760 && matchMedia('(any-pointer: fine)').matches;

(() => {
  let mod = 0; // módulo do aluno (banner e "Seu curso")
  // módulo aberto (expandido) na lista; fica guardado enquanto a aba estiver aberta, para voltar da lição com ele aberto
  let openMod = (() => { try { const v = sessionStorage.getItem('hc:pf:open'); return v === null ? null : +v; } catch { return null; } })();
  const saveOpen = () => { try { openMod === null ? sessionStorage.removeItem('hc:pf:open') : sessionStorage.setItem('hc:pf:open', String(openMod)); } catch {} };
  const ICO = {
    next: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    prev: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    keys: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
    level: '<path d="M4 20V14M10 20V9M16 20V4M22 20H2"/>',
    stack: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    chart: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  };
  /* lições criadas pelo administrador (botão "Nova lição"): ficam no banco, junto do conteúdo do site,
     e entram no fim do módulo até serem configuradas aqui no código */
  const BASE = HC_CURSO.modulos.map((m) => m.licoes.slice());
  const extras = () => (typeof cursoExtra !== 'undefined' && Array.isArray(cursoExtra) ? cursoExtra : []);
  const mergeExtras = () => HC_CURSO.modulos.forEach((m, i) => { m.licoes = BASE[i].concat(extras().filter((x) => x.mod === i).map((x) => ({ ...x, extra: true }))); });
  const canOpen = (m) => m.licoes.some((l) => l.arquivo) || isAdmin(); // o administrador abre até módulo vazio, para criar lições
  const PER_PAGE = 5; // lições por página; da 6ª em diante continuam para o lado
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
    try { await Promise.all([load('curso/licao.css'), load('curso/teclado.js'), load('curso/licao.js'), load(l.arquivo)]); }
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

  const MTINTS = ['22, 60, 48', '36, 40, 110', '86, 30, 110', '120, 50, 24', '24, 80, 96'];

  /* módulo expandido: as lições do módulo e o próximo passo */
  function modBody(mi) {
    const m = HC_CURSO.modulos[mi]; if (!m) return '';
    const first = HC_CURSO.modulos.slice(0, mi).reduce((a, x) => a + x.licoes.length, 0); // nº da 1ª lição do módulo - 1
    const nextM = HC_CURSO.modulos[mi + 1];
    const pages = []; for (let k = 0; k < m.licoes.length; k += PER_PAGE) pages.push(m.licoes.slice(k, k + PER_PAGE));
    return `
      <section>
        <h2 class="shelf-title"><span class="ap-grad">${esc(m.secao || m.nome + '.')}</span><span> ${esc(m.secaoComplemento || '')}</span></h2>
        ${m.texto ? `<p class="shelf-sub pf-sub">${esc(m.texto)}</p>` : ''}
        ${window.HC_isComputer() ? '' : `<div class="pf-pc-note"><span>${svg('keys')}</span><p><b>As lições são feitas no computador.</b> Por aqui você acompanha o seu progresso; para praticar, use os computadores da instituição nos dias de aula.</p></div>`}
        <div class="pf-lpages" id="pf-lpages">${pages.map((pg, pi) => `
        <ol class="pf-lessons" aria-label="Lições ${pi * PER_PAGE + 1} a ${pi * PER_PAGE + pg.length}">
          ${pg.map((l, k) => {
            const i = pi * PER_PAGE + k;
            const n = first + i + 1, p = progress(n), num = String(n).padStart(2, '0');
            const state = !l.arquivo ? 'Em breve' : p?.done ? 'Concluída' : p ? `Nível ${Math.min(p.lvl + 1, p.total)} de ${p.total}` : `${HC_NIVEIS[n] || ''}`;
            const go = !l.arquivo ? 'Em breve' : !window.HC_isComputer() ? 'Ver' : p?.done ? 'Refazer' : p && p.lvl > 0 ? 'Continuar' : 'Acessar';
            return `
          <li class="pf-lesson${l.arquivo ? '' : ' soon'}" style="--i:${k};--tint:${TINTS[i % TINTS.length]}" data-lesson="${n}" tabindex="0" aria-label="Lição ${num}: ${esc(l.titulo)}">
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
            ${l.extra && isAdmin() ? `<button class="pf-lesson-del" type="button" data-dellesson="${esc(l.id)}" aria-label="Apagar este card">×</button>` : ''}
            ${p ? `<b class="pf-lesson-prog" style="--w:${((p.done ? p.total : p.lvl) / p.total) * 100}%"></b>` : ''}
          </li>`;
          }).join('')}
        </ol>`).join('')}</div>
        ${pages.length > 1 ? `<div class="ap-paddles pf-lpaddles">
          <button class="ap-paddle" type="button" data-ldir="-1" aria-label="Lições anteriores" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button class="ap-paddle" type="button" data-ldir="1" aria-label="Próximas lições"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>` : ''}
      </section>
      <section style="--n:${pages[0]?.length || 0}">
        <div class="pf-step-head">
          <h2 class="shelf-title"><span class="ap-grad">Próximo passo.</span><span> Terminou as lições? Siga para o próximo módulo.</span></h2>
          ${isAdmin() ? `<button class="pf-add-lesson" type="button" data-addlesson="${mi}" title="Só administradores veem este botão"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Nova lição</button>` : ''}
        </div>
        <div class="pf-next-card">
          <div class="pf-next-text">
            <small>${nextM ? esc(nextM.nivel) : 'Em breve'}</small>
            <strong>Módulo ${mi + 2}${nextM ? ` · ${esc(nextM.nome)}` : ''}</strong>
            <div class="pf-next-actions">
              <button class="btn-dark inf-shine" type="button" data-gomod="${mi + 1}">Continuar para o módulo ${mi + 2} ${svg('next')}</button>
            </div>
          </div>
          <div class="pf-mascot">${slot(HC_CURSO.mascote, 'Mascote', 'PNG sem fundo', 2)}</div>
        </div>
      </section>`;
  }

  function render(view, sub = '') {
    const ln = /^licao-(\d+)$/.exec(sub);
    mergeExtras();
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

      <section class="pf-mods">
        <h2 class="shelf-title"><span class="ap-grad">Módulos.</span><span> Escolha um módulo para ver as lições.</span></h2>
        <div class="pf-mod-row" id="pf-mod-row">
          ${HC_CURSO.modulos.map((mm, i) => {
            const ok = canOpen(mm), num = String(i + 1).padStart(2, '0');
            return `
          <article class="pf-lesson pf-modcard${ok ? '' : ' soon'}${openMod === i ? ' open' : ''}" style="--i:${i};--tint:${MTINTS[i % MTINTS.length]}" data-modcard="${i}" tabindex="0" role="button" aria-expanded="${openMod === i}" aria-label="Módulo ${i + 1}: ${esc(mm.nome)}">
            <div class="pf-lesson-img">${slot(mm.imagem, 'Imagem do módulo', '1000 × 1250', i + 2)}</div>
            <div class="pf-lesson-app">
              <div class="pf-lesson-text">
                <span class="pf-lesson-tag">Módulo ${i + 1} · ${esc(mm.nivel.replace(/^Nível\s+/i, ''))}</span>
                <h3>${esc(mm.nome)}</h3>
                <p>${esc(mm.desc)}</p>
              </div>
              <div class="pf-lesson-bar">
                <span class="pf-lesson-av">${num}</span>
                <span class="pf-lesson-who"><strong>${mm.totalNiveis} níveis</strong><small>${ok ? `${mm.licoes.length} lições` : 'Em breve'}</small></span>
                <span class="pf-lesson-go">${!ok ? 'Em breve' : openMod === i ? 'Fechar' : 'Abrir'}</span>
              </div>
            </div>
          </article>`;
          }).join('')}
        </div>
        <div class="ap-paddles pf-mod-paddles">
          <button class="ap-paddle" data-mdir="-1" aria-label="Módulos anteriores"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button class="ap-paddle" data-mdir="1" aria-label="Próximos módulos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>
        <div class="pf-mod-open${openMod !== null ? ' show' : ''}" id="pf-mod-open"><div class="pf-mod-inner" id="pf-mod-inner">${openMod !== null ? modBody(openMod) : ''}</div></div>
      </section>
    </div>`;

    bindLessons(view, view);
    view.querySelector('.slide-cta[data-lesson]')?.addEventListener('click', (e) => openN(+e.currentTarget.dataset.lesson));

    /* cards dos módulos: abrir/fechar revela as lições logo abaixo, com animação */
    const row = view.querySelector('#pf-mod-row');
    view.querySelectorAll('[data-modcard]').forEach((c) => {
      const act = () => toggleMod(view, +c.dataset.modcard);
      c.addEventListener('click', act);
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    });
    view.querySelectorAll('[data-mdir]').forEach((b) => b.addEventListener('click', () => row.scrollBy({ left: +b.dataset.mdir * row.clientWidth * .8, behavior: 'smooth' })));
    const paddles = () => { const [p, n] = view.querySelectorAll('[data-mdir]'); if (!p) return; p.disabled = row.scrollLeft < 4; n.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4; };
    row.addEventListener('scroll', paddles, { passive: true }); paddles();
    view.querySelector('.pf-mods').classList.toggle('has-open', openMod !== null);
  }

  const openN = (n) => { if (!lessonAt(n)?.arquivo) return toast('Esta lição será montada em breve.'); location.hash = `#informatica/licao-${n}`; };
  function bindLessons(view, root) {
    root.querySelectorAll('.pf-lesson[data-lesson]').forEach((b) => {
      b.addEventListener('click', () => openN(+b.dataset.lesson));
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openN(+b.dataset.lesson); } });
    });
    const pagesEl = root.querySelector('#pf-lpages');
    if (pagesEl) {
      const pads = root.querySelectorAll('[data-ldir]');
      const upd = () => { if (!pads.length) return; pads[0].disabled = pagesEl.scrollLeft < 4; pads[1].disabled = pagesEl.scrollLeft + pagesEl.clientWidth >= pagesEl.scrollWidth - 4; };
      pads.forEach((b) => b.addEventListener('click', () => pagesEl.scrollBy({ left: +b.dataset.ldir * pagesEl.clientWidth, behavior: 'smooth' })));
      pagesEl.addEventListener('scroll', upd, { passive: true }); upd();
    }
    root.querySelectorAll('[data-addlesson]').forEach((b) => b.addEventListener('click', () => addLesson(view, +b.dataset.addlesson)));
    root.querySelectorAll('[data-dellesson]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); delLesson(view, b.dataset.dellesson); }));
    root.querySelectorAll('[data-gomod]').forEach((b) => b.addEventListener('click', () => {
      const i = +b.dataset.gomod;
      if (!HC_CURSO.modulos[i] || !canOpen(HC_CURSO.modulos[i])) return toast(`O módulo ${i + 1} será liberado em breve.`);
      toggleMod(view, i); view.querySelector(`[data-modcard="${i}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }));
  }

  /* administrador: cria um card de lição provisório no fim do módulo (configurado depois no código) */
  function refillMod(view, mi, toEnd) {
    const inner = view.querySelector('#pf-mod-inner'); if (!inner || openMod !== mi) return;
    mergeExtras();
    const keep = view.querySelector('#pf-lpages')?.scrollLeft || 0;
    inner.classList.remove('enter'); inner.innerHTML = modBody(mi); bindLessons(view, inner);
    const pg = inner.querySelector('#pf-lpages');
    if (pg) { pg.scrollLeft = keep; if (toEnd) requestAnimationFrame(() => pg.scrollTo({ left: pg.scrollWidth, behavior: 'smooth' })); }
    const card = view.querySelector(`[data-modcard="${mi}"] .pf-lesson-who small`); if (card) card.textContent = `${HC_CURSO.modulos[mi].licoes.length} lições`;
  }
  function addLesson(view, mi) {
    if (!isAdmin() || typeof saveCursoExtra !== 'function') return;
    const first = HC_CURSO.modulos.slice(0, mi).reduce((a, x) => a + x.licoes.length, 0);
    const num = String(first + HC_CURSO.modulos[mi].licoes.length + 1).padStart(2, '0');
    cursoExtra = [...extras(), { id: 'l' + Date.now().toString(36), mod: mi, tag: 'Nova lição', titulo: `Lição ${num}`, desc: 'Card criado pelo administrador. O conteúdo desta lição ainda será configurado.', imagem: '' }];
    saveCursoExtra(); refillMod(view, mi, true);
    toast('Card da nova lição criado. Agora é só configurar o conteúdo.');
  }
  /* apagar um card pede confirmação e a senha mestra (só a impressão digital SHA-256 dela fica no código).
     É uma trava contra cliques sem querer; quem pode gravar no banco continua sendo só o administrador. */
  const MASTER_SHA = '618a865ecfa5327507b402d6a4d9bdfa52745e6da3296eb5ffcb5ec3add5d563';
  const sha256 = async (t) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))].map((b) => b.toString(16).padStart(2, '0')).join('');
  function delLesson(view, id) {
    if (!isAdmin() || document.querySelector('.lk')) return;
    const l = extras().find((x) => x.id === id); if (!l) return;
    const wrap = document.createElement('div');
    wrap.className = 'lk au';
    wrap.innerHTML = `<div class="lk-backdrop"></div>
      <form class="lk-card au-card" role="dialog" aria-modal="true" aria-labelledby="dl-t" novalidate>
        <span class="lk-icon au-ico pf-del-ico"><i data-icon="trash"></i></span>
        <h2 id="dl-t">Apagar “${esc(l.titulo)}”?</h2>
        <p class="lk-sub">O card sai do módulo para todos os alunos e não dá para desfazer. Para confirmar, digite a senha mestra.</p>
        <label class="au-label" for="dl-pw">Senha mestra</label>
        <div class="lk-field"><input type="password" id="dl-pw" autocomplete="off" autocapitalize="off" spellcheck="false" required></div>
        <p class="lk-msg" role="alert"></p>
        <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark btn-danger lk-go">Apagar</button></div>
      </form>`;
    document.body.appendChild(wrap); if (typeof paintIcons === 'function') paintIcons(wrap);
    const close = () => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 300); };
    wrap.querySelector('.lk-backdrop').addEventListener('click', close);
    wrap.querySelector('.lk-cancel').addEventListener('click', close);
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    const pw = wrap.querySelector('#dl-pw'), msg = wrap.querySelector('.lk-msg');
    wrap.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!pw.value) { msg.textContent = 'Digite a senha mestra.'; return pw.focus(); }
      if (await sha256(pw.value) !== MASTER_SHA) { msg.textContent = 'Senha mestra incorreta.'; pw.select(); return; }
      cursoExtra = extras().filter((x) => x.id !== id);
      saveCursoExtra(); close(); refillMod(view, openMod, false);
      toast('Card da lição apagado.');
    });
    requestAnimationFrame(() => { wrap.classList.add('in'); pw.focus(); });
  }

  /* abre um módulo (ou fecha, se já estiver aberto): a área cresce suavemente e as lições entram */
  function toggleMod(view, i) {
    const mm = HC_CURSO.modulos[i];
    if (!canOpen(mm)) return toast(`O módulo ${i + 1} será liberado em breve.`);
    const box = view.querySelector('#pf-mod-open'), inner = view.querySelector('#pf-mod-inner');
    const cards = view.querySelectorAll('[data-modcard]');
    const setCards = () => cards.forEach((c) => {
      const on = +c.dataset.modcard === openMod;
      c.classList.toggle('open', on); c.setAttribute('aria-expanded', on);
      const go = c.querySelector('.pf-lesson-go'); if (!c.classList.contains('soon')) go.textContent = on ? 'Fechar' : 'Abrir';
    });
    view.querySelector('.pf-mods').classList.toggle('has-open', openMod !== i);
    if (openMod === i) { // fechar
      openMod = null; saveOpen(); setCards();
      box.classList.remove('show');
      setTimeout(() => { if (openMod === null) inner.innerHTML = ''; }, 850);
      return;
    }
    const swap = openMod !== null; // trocando de um módulo para outro
    openMod = i; saveOpen(); setCards();
    const fill = () => { inner.innerHTML = modBody(i); bindLessons(view, inner); inner.classList.remove('enter'); void inner.offsetWidth; inner.classList.add('enter'); };
    if (swap) { box.classList.remove('show'); setTimeout(() => { fill(); box.classList.add('show'); }, 650); }
    else { fill(); box.classList.add('show'); }
    // rola até o painel, mas para logo abaixo da barra de cima (que fica fixa), sem esconder o título
    setTimeout(() => {
      const bar = document.querySelector('.topbar-wrap, .topbar');
      const gap = (bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0) + 20;
      window.scrollTo({ top: Math.max(0, box.getBoundingClientRect().top + scrollY - gap), behavior: 'smooth' });
    }, swap ? 900 : 300);
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
