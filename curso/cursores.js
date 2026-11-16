/* =========================================================
   CURSORES DA PLATAFORMA DE INFORMÁTICA
   Seta, mãozinha de clicar, texto, carregando etc. desenhados no verde do curso.
   Só vale no computador (mouse) e só enquanto o aluno está na área de Informática
   (#informatica…), inclusive na abertura da lição e na tela de resultado.

   Como funciona: ao passar o mouse sobre um elemento, vemos qual cursor o site
   pediria ali (pointer, text, wait…) e trocamos pelo desenho equivalente.
   "Carregando" e "Em andamento" giram, então são desenhados pela própria página
   (o navegador não anima cursores de imagem).
   ========================================================= */
(() => {
  if (window.HC_cursors || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const W = '#ffffff', D = '#0b1f18';
  const grad = (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6ee7b7"/><stop offset="1" stop-color="#059669"/></linearGradient></defs>`;
  const AP = 'M6 3.5v20.2l5.1-4.6 3.3 7.9 3.4-1.4-3.3-7.8 7-.3z';
  const arrow = (fill, stroke) => `<path d="${AP}" fill="none" stroke="${W}" stroke-width="4" stroke-linejoin="round"/><path d="${AP}" fill="${fill}" stroke="${stroke}" stroke-width="1.7" stroke-linejoin="round"/>`;
  const spin = (id, cx, cy, r, sw) => `<circle cx="${cx}" cy="${cy}" r="${r + sw / 2 + 1.4}" fill="${D}" stroke="${W}" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#34d399" stroke-opacity=".18" stroke-width="${sw}"/><g><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur=".9s" repeatCount="indefinite"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${(2 * Math.PI * r * 0.62).toFixed(1)} 999" transform="rotate(-90 ${cx} ${cy})"/></g>`;
  const dots = (cx, cy) => [-1, 0, 1].map((k, i) => `<circle cx="${cx + k * 3.4}" cy="${cy}" r="1.25" fill="#a7f3d0"><animate attributeName="opacity" values=".25;1;.25" dur="1.1s" begin="${i * 0.18}s" repeatCount="indefinite"/></circle>`).join('');

  // nome: [ponto do clique x, y, desenho, animado?]
  const C = {
    normal: [6, 4, (id) => grad(id) + arrow(D, `url(#${id})`) + '<path d="M8.4 9v9.4" stroke="#34d399" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>'],
    pointer: [6, 4, (id) => grad(id) + arrow(`url(#${id})`, D) + `<g stroke-linecap="round"><path d="M17.5 6 18.6 2.6M21 9.2 24.2 7.2" stroke="${W}" stroke-width="4"/><path d="M17.5 6 18.6 2.6M21 9.2 24.2 7.2" stroke="#10b981" stroke-width="2"/></g>`],
    text: [16, 16, (id) => { const p = 'M12 5c2.6 0 4 .8 4 3 0-2.2 1.4-3 4-3M16 8v16M12 27c2.6 0 4-.8 4-3 0 2.2 1.4 3 4 3'; return grad(id) + `<path d="${p}" fill="none" stroke="${W}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/><path d="${p}" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10v12" stroke="url(#${id})" stroke-width="1.2" stroke-linecap="round"/>`; }],
    wait: [16, 16, (id) => grad(id) + spin(id, 16, 16, 10, 3.2) + dots(16, 16), true],
    progress: [6, 4, (id) => grad(id) + arrow(D, `url(#${id})`) + spin(id, 24.5, 24.5, 4.2, 2), true],
    nope: [6, 4, (id) => grad(id) + arrow(D, `url(#${id})`) + `<circle cx="24" cy="24" r="6.4" fill="#ef4444" stroke="${W}" stroke-width="1.6"/><path d="M20.2 27.8 27.8 20.2" stroke="${W}" stroke-width="2" stroke-linecap="round"/>`],
    cross: [16, 16, (id) => { const p = 'M16 3v6M16 23v6M3 16h6M23 16h6'; return grad(id) + `<circle cx="16" cy="16" r="9" fill="none" stroke="${W}" stroke-width="4"/><path d="${p}" stroke="${W}" stroke-width="4.4" stroke-linecap="round"/><circle cx="16" cy="16" r="9" fill="none" stroke="url(#${id})" stroke-width="2"/><path d="${p}" stroke="${D}" stroke-width="2.2" stroke-linecap="round"/><circle cx="16" cy="16" r="2.2" fill="#10b981" stroke="${W}" stroke-width="1.2"/>`; }],
    grab: [16, 16, (id) => { const p = 'M16 4l-3.6 4h7.2zM16 28l-3.6-4h7.2zM4 16l4-3.6v7.2zM28 16l-4-3.6v7.2z'; return grad(id) + `<path d="${p}" fill="${W}" stroke="${W}" stroke-width="3.4" stroke-linejoin="round"/><path d="${p}" fill="url(#${id})" stroke="${D}" stroke-width="1.2" stroke-linejoin="round"/><circle cx="16" cy="16" r="4.2" fill="${D}" stroke="${W}" stroke-width="1.6"/><circle cx="16" cy="16" r="1.6" fill="#34d399"/>`; }],
    grabbing: [16, 16, (id) => { const p = 'M16 8l-3 3.2h6zM16 24l-3-3.2h6zM8 16l3.2-3v6zM24 16l-3.2-3v6z'; return grad(id) + `<circle cx="16" cy="16" r="11" fill="none" stroke="${W}" stroke-width="4"/><circle cx="16" cy="16" r="11" fill="none" stroke="url(#${id})" stroke-width="1.8" stroke-dasharray="3 3"/><path d="${p}" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/><path d="${p}" fill="url(#${id})" stroke="${D}" stroke-width="1" stroke-linejoin="round"/><circle cx="16" cy="16" r="3.4" fill="#10b981" stroke="${W}" stroke-width="1.4"/>`; }],
  };
  const svg = (k) => `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${C[k][2]('hcg-' + k)}</svg>`;

  // o cursor que o site pediria → o nosso desenho
  const MAP = { default: 'normal', auto: 'normal', pointer: 'pointer', text: 'text', 'vertical-text': 'text', wait: 'wait', progress: 'progress',
    'not-allowed': 'nope', 'no-drop': 'nope', crosshair: 'cross', cell: 'cross', grab: 'grab', move: 'grab', 'all-scroll': 'grab', grabbing: 'grabbing' };
  const isText = (el) => el.isContentEditable || (el.tagName === 'TEXTAREA') || (el.tagName === 'INPUT' && /^(text|search|email|password|tel|url|number|)$/.test(el.type));

  let css = '';
  for (const k in C) {
    const [x, y, , anim] = C[k];
    css += anim
      ? `html.hc-cur [data-hcc="${k}"]{cursor:none!important}`
      : `html.hc-cur [data-hcc="${k}"]{cursor:url("data:image/svg+xml,${encodeURIComponent(svg(k))}") ${x} ${y},${k === 'normal' ? 'default' : k === 'nope' ? 'not-allowed' : k === 'cross' ? 'crosshair' : k}!important}`;
  }
  css += '.hc-cur-fol{position:fixed;left:0;top:0;width:32px;height:32px;z-index:2147483647;pointer-events:none;display:none;will-change:transform}html.hc-cur .hc-cur-fol.on{display:block}';
  const st = document.createElement('style'); st.textContent = css; document.head.append(st);

  // seguidor para os cursores que giram
  const fol = document.createElement('div'); fol.className = 'hc-cur-fol'; fol.setAttribute('aria-hidden', 'true');
  document.body.append(fol);
  let folKind = '', mx = -99, my = -99, raf = 0;
  const place = () => { raf = 0; const c = C[folKind]; if (c) fol.style.transform = `translate3d(${mx - c[0]}px,${my - c[1]}px,0)`; };
  const showFol = (k) => {
    if (k !== folKind) { folKind = k; if (k) fol.innerHTML = svg(k); }
    fol.classList.toggle('on', !!k); if (k && !raf) raf = requestAnimationFrame(place);
  };

  let on = false, last = null;
  const apply = (el) => {
    if (!on || !(el instanceof Element)) return;
    el.removeAttribute('data-hcc');
    let c = getComputedStyle(el).cursor.split(',').pop().trim();
    let k = MAP[c];
    if (c === 'auto' && isText(el)) k = 'text';
    if (k) el.setAttribute('data-hcc', k);
    last = el;
    showFol(k && C[k][3] ? k : '');
  };
  addEventListener('mouseover', (e) => apply(e.target), true);
  addEventListener('mousedown', (e) => setTimeout(() => apply(e.target)), true); // :active (segurando)
  addEventListener('mouseup', (e) => setTimeout(() => apply(e.target)), true);
  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; if (folKind && !raf) raf = requestAnimationFrame(place); }, { passive: true, capture: true });
  document.addEventListener('mouseleave', () => showFol(''));
  // quando a tela muda sozinha embaixo do mouse (ex.: a contagem de estrelas termina), confere de novo
  setInterval(() => { if (on && last && document.hasFocus()) { const el = document.elementFromPoint(mx, my); if (el) apply(el); } }, 400);

  const update = () => {
    on = (typeof infoAllowed !== 'function' || infoAllowed()) && (location.hash.startsWith('#informatica') || !!document.querySelector('.lr, .pfi'));
    document.documentElement.classList.toggle('hc-cur', on);
    if (!on) showFol('');
  };
  addEventListener('hashchange', update);
  update();
  window.HC_cursors = { update };
})();
