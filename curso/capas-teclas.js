/* Capas ilustradas das lições de digitação (Módulo 1 · Primeiro comando), em SVG, sem imagem para baixar.
   Ficam paradas e só se animam com o mouse em cima do card (estilos em curso/capas.css).
   Cada capa: um teclado com as teclas da lição em branco; com o mouse em cima, o dedo sai da tecla
   de descanso (F e J), vai até a tecla nova e ela afunda e acende no mesmo momento. */
(() => {
  const W = '#fff', G = 'rgba(255,255,255,.1)', G2 = 'rgba(255,255,255,.28)', AM = '#fcd34d';
  const FONT = 'font-family="Inter,system-ui,sans-serif"';
  const ROWS = ['qwertyuiop', 'asdfghjklç', 'zxcvbnm,.;'], OFF = [0, 7, 16];
  const K = 24, S = 27, X0 = 8, Y0 = 6;
  /* centro de uma tecla */
  const pos = (ch) => { for (let r = 0; r < 3; r++) { const c = ROWS[r].indexOf(ch); if (c >= 0) return [X0 + OFF[r] + c * S + K / 2, Y0 + r * S + K / 2]; } return [150, Y0 + 3 * S + 9]; };

  const svgWrap = (body) => `<svg class="cv" viewBox="0 0 300 112" preserveAspectRatio="xMidYMid meet" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <defs><radialGradient id="cvg"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="cvk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e5e7eb"/></linearGradient></defs>
    <ellipse class="cv-glow" cx="150" cy="56" rx="150" ry="62" fill="url(#cvg)"/>
    <rect x="0" y="0" width="300" height="112" rx="14" fill="rgba(0,0,0,.18)" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
    ${body}</svg>`;

  /* teclado com as letras: as teclas da lição em branco (sobem e acendem na sua vez),
     as já aprendidas um pouco acesas e o resto transparente */
  const tecla = (x, y, w, ch, d, vista) => {
    const nova = d !== undefined, txt = ch === ' ' ? '' : ch.toUpperCase();
    const casa = ch === 'f' || ch === 'j' ? `<path d="M${x + w / 2 - 4} ${y + K - 5} h8" stroke="${nova ? '#111' : W}" stroke-width="2" opacity=".7"/>` : '';
    return nova
      ? `<g class="cv-kp" style="--d:${d}s"><rect x="${x}" y="${y + 2}" width="${w}" height="${K - 2}" rx="6" fill="rgba(0,0,0,.35)"/>
          <rect class="cv-kl" style="--d:${d}s" x="${x}" y="${y}" width="${w}" height="${K - 2}" rx="6" fill="url(#cvk)"/>
          <text x="${x + w / 2}" y="${y + 16}" fill="#111" font-size="13" font-weight="800" text-anchor="middle" ${FONT}>${txt}</text>${casa}</g>`
      : `<rect x="${x}" y="${y}" width="${w}" height="${K}" rx="6" fill="${vista ? G2 : G}" stroke="rgba(255,255,255,${vista ? .55 : .3})" stroke-width="1.2"/>
          <text x="${x + w / 2}" y="${y + 16}" fill="${W}" opacity="${vista ? .9 : .45}" font-size="10" font-weight="700" text-anchor="middle" ${FONT}>${txt}</text>${casa}`;
  };
  const teclado = (novas = {}, vistas = '') => ROWS.map((row, r) => [...row].map((ch, c) =>
    tecla(X0 + OFF[r] + c * S, Y0 + r * S, K, ch, novas[ch], vistas.includes(ch))).join('')).join('')
    + tecla(86, Y0 + 3 * S, 128, ' ', novas[' '], vistas.includes(' '));

  /* dedo: sai da tecla de descanso, vai até a tecla nova e volta */
  const dedo = (de, para, d) => { const [x, y] = pos(de), [x2, y2] = pos(para);
    return `<g class="cv-fg" style="--d:${d}s;--fx:${x2 - x}px;--fy:${y2 - y}px"><circle cx="${x}" cy="${y + 3}" r="8" fill="rgba(255,255,255,.3)" stroke="${AM}" stroke-width="2.5"/></g>`; };

  /* lição com três teclas novas: [tecla, de onde sai o dedo] */
  const licao = (teclas, vistas) => {
    const novas = Object.fromEntries(teclas.map(([k], i) => [k, i * .7]));
    return svgWrap(teclado(novas, vistas) + teclas.map(([k, de], i) => dedo(de, k, i * .7)).join(''));
  };

  const C = {};
  C['dg-2'] = licao([['u', 'j'], ['r', 'f'], ['k', 'k']], 'fj ');
  C['dg-3'] = licao([['d', 'd'], ['e', 'd'], ['i', 'k']], 'fj urk');
  C['dg-4'] = licao([['c', 'd'], ['g', 'f'], ['n', 'j']], 'fj urkdei');

  /* Revisão geral 1: todas as teclas do módulo acendendo em onda, da esquerda para a direita, e o selo de concluído no canto */
  const todas = 'fjurkdeicgn ';
  C['dg-5'] = svgWrap(teclado(Object.fromEntries([...todas].map((k) => [k, +(pos(k)[0] / 300 * .9).toFixed(2)]))) + `
    <g class="cv-medal"><circle cx="282" cy="96" r="17" fill="${AM}" stroke="${W}" stroke-width="3"/>
      <path class="cv-check" d="M274 96 l6 6 10 -11" stroke="#78350f" stroke-width="3.5" pathLength="1" stroke-dasharray="1"/></g>
    ${[[268, 76, '#f9a8d4', 0], [296, 112, '#67e8f9', .6]].map(([x, y, c, d]) => `<path class="cv-spark" style="--d:${d}s" d="M${x} ${y - 7} q1.5 5.5 7 7 q-5.5 1.5 -7 7 q-1.5 -5.5 -7 -7 q5.5 -1.5 7 -7z" fill="${c}"/>`).join('')}`);

  /* cada lição com a sua cor e o seu fundo: [cor do card (r, g, b), cor clara, cor escura, desenho do fundo] */
  const COR = {
    'dg-1': ['74, 30, 8', '#fbbf24', '#9a3412', 'dots'],
    'dg-2': ['22, 52, 120', '#38bdf8', '#1e3a8a', 'grid'],
    'dg-3': ['76, 29, 149', '#c084fc', '#4c1d95', 'rings'],
    'dg-4': ['127, 29, 29', '#fb7185', '#7f1d1d', 'diag'],
    'dg-5': ['6, 78, 59', '#34d399', '#064e3b', 'confetti'],
  };
  window.HC_CAPAS_DG_FUNDO = (id) => { const c = COR[id]; return c ? `<i class="cvb cvb-${c[3]}" style="--a:${c[1]};--b:${c[2]}"></i>` : ''; };
  Object.keys(C).forEach((id) => { C[id] = window.HC_CAPAS_DG_FUNDO(id) + C[id]; });
  window.HC_CAPAS_DG = C;
  window.HC_CAPAS_DG_TINT = Object.fromEntries(Object.entries(COR).map(([id, [t]]) => [id, t]));
})();
