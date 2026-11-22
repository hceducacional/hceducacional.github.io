/* Capas ilustradas das aulas (desenho em SVG, sem imagem para baixar).
   Ficam paradas e só se animam com o mouse em cima do card (estilos em curso/capas.css).
   Se o administrador enviar uma imagem para a aula, a imagem enviada aparece no lugar da capa.
   Disciplina 01 · Introdução à Informática: aulas 01 a 09 e a avaliação. */
(() => {
  const W = '#fff', G = 'rgba(255,255,255,.14)', G2 = 'rgba(255,255,255,.26)';
  const CY = '#67e8f9', AM = '#fcd34d', PK = '#f9a8d4', GR = '#86efac';
  const cv = (body) => `<svg class="cv" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <ellipse class="cv-glow" cx="180" cy="104" rx="150" ry="88" fill="url(#cvg)"/>
    <defs><radialGradient id="cvg"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    ${body}</svg>`;
  /* monitor reaproveitado em várias capas */
  const monitor = (x, y, w, h, tela = '') => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${G}" stroke="${W}" stroke-width="3"/>
    <rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" rx="5" fill="rgba(0,0,0,.22)"/>
    ${tela}
    <path d="M${x + w / 2 - 10} ${y + h} l-5 16 h30 l-5 -16" fill="${G}" stroke="${W}" stroke-width="3"/>
    <path d="M${x + w / 2 - 26} ${y + h + 16} h52" stroke="${W}" stroke-width="3"/>`;

  const C = {};

  /* Aula 01 · O que é Informática? Dados entram, o computador trata e sai informação */
  C['d1-a01'] = cv(`
    <g class="cv-in">
      <g class="cv-d" style="--d:0s"><rect x="22" y="52" width="34" height="26" rx="7" fill="${G2}" stroke="${CY}" stroke-width="2.5"/><text x="39" y="70" fill="${W}" font-size="14" font-weight="700" text-anchor="middle" font-family="Inter,system-ui,sans-serif">01</text></g>
      <g class="cv-d" style="--d:.35s"><rect x="36" y="92" width="34" height="26" rx="7" fill="${G2}" stroke="${AM}" stroke-width="2.5"/><text x="53" y="110" fill="${W}" font-size="14" font-weight="700" text-anchor="middle" font-family="Inter,system-ui,sans-serif">37</text></g>
      <g class="cv-d" style="--d:.7s"><rect x="18" y="132" width="34" height="26" rx="7" fill="${G2}" stroke="${PK}" stroke-width="2.5"/><text x="35" y="150" fill="${W}" font-size="14" font-weight="700" text-anchor="middle" font-family="Inter,system-ui,sans-serif">Aa</text></g>
    </g>
    <path class="cv-dash" d="M82 104 h34" stroke="${W}" stroke-width="3" stroke-dasharray="4 8" opacity=".7"/>
    ${monitor(122, 46, 116, 84, `
      <circle class="cv-pulse" cx="180" cy="88" r="22" fill="${AM}"/>
      <path d="M180 79 v1 M180 87 v13" stroke="#1f2937" stroke-width="5"/>`)}
    <path class="cv-dash" d="M246 104 h30" stroke="${W}" stroke-width="3" stroke-dasharray="4 8" opacity=".7"/>
    <g>
      <rect x="282" y="58" width="64" height="88" rx="9" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect class="cv-bar" style="--d:0s" x="294" y="104" width="10" height="30" rx="3" fill="${CY}"/>
      <rect class="cv-bar" style="--d:.2s" x="309" y="88" width="10" height="46" rx="3" fill="${GR}"/>
      <rect class="cv-bar" style="--d:.4s" x="324" y="74" width="10" height="60" rx="3" fill="${AM}"/>
    </g>`);

  /* Aula 02 · Breve história: do ábaco ao celular, numa linha do tempo */
  C['d1-a02'] = cv(`
    <path d="M24 170 H336" stroke="${W}" stroke-width="3" opacity=".55"/>
    <path class="cv-line" d="M24 170 H336" stroke="${AM}" stroke-width="4"/>
    ${[40, 135, 230, 320].map((x, i) => `<circle class="cv-dot" style="--d:${i * .5}s" cx="${x}" cy="170" r="7" fill="${W}"/>`).join('')}
    <g>
      <rect x="12" y="62" width="58" height="82" rx="6" fill="${G}" stroke="${W}" stroke-width="3"/>
      ${[82, 103, 124].map((y) => `<path d="M14 ${y} H68" stroke="${W}" stroke-width="2" opacity=".7"/>`).join('')}
      ${[82, 103, 124].map((y, r) => [0, 1, 2].map((b) => `<circle class="cv-bead" style="--d:${r * .25 + b * .08}s;--x:${r % 2 ? 14 : 22}px" cx="${24 + b * 11}" cy="${y}" r="5.5" fill="${[AM, PK, CY][r]}"/>`).join('')).join('')}
    </g>
    <g>
      <rect x="96" y="54" width="78" height="92" rx="6" fill="${G}" stroke="${W}" stroke-width="3"/>
      <g class="cv-spin" style="--o:117px 80px"><circle cx="117" cy="80" r="13" stroke="${W}" stroke-width="3"/><path d="M117 67 v26 M104 80 h26" stroke="${W}" stroke-width="2"/></g>
      <g class="cv-spin" style="--o:153px 80px"><circle cx="153" cy="80" r="13" stroke="${W}" stroke-width="3"/><path d="M153 67 v26 M140 80 h26" stroke="${W}" stroke-width="2"/></g>
      ${[0, 1, 2, 3, 4].map((k) => `<circle class="cv-blink" style="--d:${k * .18}s" cx="${110 + k * 12.5}" cy="114" r="3.5" fill="${[GR, AM, PK, CY, GR][k]}"/>`).join('')}
      <rect x="106" y="126" width="58" height="8" rx="3" fill="${G2}"/>
    </g>
    <g>
      <rect x="196" y="70" width="76" height="54" rx="6" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect x="204" y="78" width="60" height="38" rx="3" fill="rgba(0,0,0,.22)"/>
      <path class="cv-type" d="M210 90 h30 M210 100 h44 M210 108 h22" stroke="${GR}" stroke-width="3"/>
      <path d="M190 124 h88 l-6 14 h-76 z" fill="${G}" stroke="${W}" stroke-width="3"/>
    </g>
    <g class="cv-float">
      <rect x="298" y="52" width="44" height="88" rx="10" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect class="cv-screen" x="304" y="62" width="32" height="64" rx="4" fill="${CY}" opacity=".55"/>
      <circle cx="320" cy="133" r="2.5" fill="${W}"/>
    </g>`);

  /* Aula 03 · Hardware e software: a peça que você toca e o programa que dá as ordens */
  C['d1-a03'] = cv(`
    <g>
      <rect x="34" y="44" width="104" height="112" rx="14" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect x="62" y="72" width="48" height="48" rx="6" fill="${G2}" stroke="${CY}" stroke-width="3"/>
      <rect x="74" y="84" width="24" height="24" rx="3" fill="${CY}" opacity=".8"/>
      ${[0, 1, 2].map((k) => `<path d="M${72 + k * 14} 72 v-12 M${72 + k * 14} 120 v12 M62 ${82 + k * 14} h-12 M110 ${82 + k * 14} h12" stroke="${W}" stroke-width="3"/>`).join('')}
      <circle class="cv-blink" style="--d:0s" cx="52" cy="142" r="4" fill="${GR}"/>
      <circle class="cv-blink" style="--d:.4s" cx="66" cy="142" r="4" fill="${AM}"/>
    </g>
    <g class="cv-spin" style="--o:180px 100px">
      <path d="M180 82 l5 0 2 7 6 3 6-4 4 4-4 6 3 6 7 2 0 5-7 2-3 6 4 6-4 4-6-4-6 3-2 7-5 0-2-7-6-3-6 4-4-4 4-6-3-6-7-2 0-5 7-2 3-6-4-6 4-4 6 4 6-3z" fill="${AM}" stroke="${W}" stroke-width="2" transform="translate(-2 0)"/>
      <circle cx="180" cy="100" r="7" fill="#1f2937"/>
    </g>
    <g>
      <rect x="222" y="44" width="110" height="112" rx="12" fill="${G}" stroke="${W}" stroke-width="3"/>
      <path d="M222 66 h110" stroke="${W}" stroke-width="3"/>
      <circle cx="236" cy="55" r="3.5" fill="${PK}"/><circle cx="248" cy="55" r="3.5" fill="${AM}"/><circle cx="260" cy="55" r="3.5" fill="${GR}"/>
      <path class="cv-type" style="--d:0s" d="M236 84 h46" stroke="${PK}" stroke-width="4"/>
      <path class="cv-type" style="--d:.3s" d="M246 100 h64" stroke="${CY}" stroke-width="4"/>
      <path class="cv-type" style="--d:.6s" d="M246 116 h40" stroke="${GR}" stroke-width="4"/>
      <path class="cv-type" style="--d:.9s" d="M236 132 h30" stroke="${AM}" stroke-width="4"/>
      <rect class="cv-caret" x="270" y="126" width="3" height="12" fill="${W}"/>
    </g>`);

  /* Aula 04 · Tipos de computadores: mesa, notebook, tablet e celular */
  C['d1-a04'] = cv(`
    <path d="M14 168 H346" stroke="${W}" stroke-width="3" opacity=".4"/>
    <g class="cv-hop" style="--d:0s">${monitor(14, 54, 104, 74, `<rect class="cv-screen" x="22" y="62" width="88" height="58" rx="5" fill="${CY}" opacity=".45"/>`)}</g>
    <g class="cv-hop" style="--d:.18s">
      <rect x="140" y="88" width="84" height="56" rx="6" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect class="cv-screen" x="147" y="95" width="70" height="42" rx="3" fill="${GR}" opacity=".45"/>
      <path d="M130 144 h104 l-7 12 h-90 z" fill="${G}" stroke="${W}" stroke-width="3"/>
    </g>
    <g class="cv-hop" style="--d:.36s">
      <rect x="248" y="86" width="56" height="74" rx="9" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect class="cv-screen" x="255" y="93" width="42" height="56" rx="3" fill="${AM}" opacity=".5"/>
      <circle cx="276" cy="154" r="2" fill="${W}"/>
    </g>
    <g class="cv-hop" style="--d:.54s">
      <rect x="314" y="110" width="32" height="54" rx="7" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect class="cv-screen" x="319" y="117" width="22" height="36" rx="3" fill="${PK}" opacity=".6"/>
    </g>`);

  /* Aula 05 · Componentes básicos: processador, memória, ventoinha e as trilhas da placa-mãe */
  C['d1-a05'] = cv(`
    <rect x="20" y="30" width="320" height="146" rx="14" fill="${G}" stroke="${W}" stroke-width="3"/>
    <path class="cv-trace" d="M150 92 H96 V58 H46" stroke="${GR}" stroke-width="3"/>
    <path class="cv-trace" style="--d:.3s" d="M150 116 H92 V150 H46" stroke="${AM}" stroke-width="3"/>
    <path class="cv-trace" style="--d:.6s" d="M210 92 H244" stroke="${CY}" stroke-width="3"/>
    <path class="cv-trace" style="--d:.9s" d="M210 116 H236 V150 H300" stroke="${PK}" stroke-width="3"/>
    <rect x="150" y="72" width="60" height="64" rx="8" fill="${G2}" stroke="${W}" stroke-width="3"/>
    <rect class="cv-pulse" x="164" y="87" width="32" height="34" rx="4" fill="${CY}"/>
    ${[0, 1, 2, 3].map((k) => `<path d="M${160 + k * 13} 72 v-8 M${160 + k * 13} 136 v8" stroke="${W}" stroke-width="2.5"/>`).join('')}
    ${[0, 1, 2].map((k) => `<g><rect x="${252 + k * 16}" y="48" width="10" height="66" rx="3" fill="${G2}" stroke="${W}" stroke-width="2.5"/><rect class="cv-blink" style="--d:${k * .2}s" x="${254 + k * 16}" y="60" width="6" height="10" rx="1.5" fill="${GR}"/></g>`).join('')}
    <g>
      <circle cx="68" cy="104" r="26" fill="${G2}" stroke="${W}" stroke-width="3"/>
      <g class="cv-spin cv-fast" style="--o:68px 104px">${[0, 72, 144, 216, 288].map((a) => `<path d="M68 104 q8 -6 4 -20 q-12 2 -4 20" fill="${W}" opacity=".85" transform="rotate(${a} 68 104)"/>`).join('')}</g>
      <circle cx="68" cy="104" r="5" fill="#1f2937"/>
    </g>`);

  /* Aula 06 · Entrada e saída: teclado e mouse mandam, monitor e impressora mostram */
  C['d1-a06'] = cv(`
    <g>
      <rect x="10" y="110" width="104" height="44" rx="8" fill="${G}" stroke="${W}" stroke-width="3"/>
      ${[0, 1, 2, 3, 4, 5].map((k) => `<rect class="cv-key" style="--d:${k * .15}s" x="${18 + k * 15.5}" y="118" width="11" height="10" rx="2" fill="${W}" opacity=".8"/>`).join('')}
      ${[0, 1, 2, 3, 4].map((k) => `<rect class="cv-key" style="--d:${.9 + k * .15}s" x="${24 + k * 15.5}" y="134" width="11" height="10" rx="2" fill="${W}" opacity=".8"/>`).join('')}
      <rect x="48" y="54" width="36" height="50" rx="18" fill="${G}" stroke="${W}" stroke-width="3"/>
      <path d="M66 54 v18" stroke="${W}" stroke-width="2.5"/>
      <path class="cv-blink" d="M51 70 a15 15 0 0 1 15 -15 v17 h-15z" fill="${AM}" opacity=".9"/>
      <text x="62" y="40" fill="${CY}" font-size="12" font-weight="800" text-anchor="middle" font-family="Inter,system-ui,sans-serif">ENTRADA</text>
    </g>
    <path class="cv-dash" d="M122 106 H150" stroke="${CY}" stroke-width="4" stroke-dasharray="5 7"/>
    <path d="M146 98 l8 8 -8 8" stroke="${CY}" stroke-width="4"/>
    <rect x="158" y="68" width="44" height="80" rx="8" fill="${G2}" stroke="${W}" stroke-width="3"/>
    <circle class="cv-pulse" cx="180" cy="86" r="6" fill="${GR}"/>
    <path d="M168 104 h24 M168 114 h24 M168 124 h24" stroke="${W}" stroke-width="2.5" opacity=".6"/>
    <path class="cv-dash" d="M210 106 H238" stroke="${PK}" stroke-width="4" stroke-dasharray="5 7"/>
    <path d="M234 98 l8 8 -8 8" stroke="${PK}" stroke-width="4"/>
    <g>
      ${monitor(250, 46, 92, 58, `<rect class="cv-screen" x="258" y="54" width="76" height="42" rx="3" fill="${PK}" opacity=".45"/>`)}
      <rect x="262" y="132" width="68" height="28" rx="6" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect class="cv-paper" x="274" y="150" width="44" height="24" rx="2" fill="${W}"/>
      <text x="296" y="196" fill="${PK}" font-size="12" font-weight="800" text-anchor="middle" font-family="Inter,system-ui,sans-serif">SAÍDA</text>
    </g>`);

  /* Aula 07 · Ligando, desligando e cuidando: o botão de ligar e o computador brilhando de limpo */
  C['d1-a07'] = cv(`
    <circle cx="180" cy="100" r="66" fill="${G}" stroke="${W}" stroke-width="3" opacity=".9"/>
    <circle class="cv-ring" cx="180" cy="100" r="54" stroke="${GR}" stroke-width="8" pathLength="100" stroke-dasharray="100" transform="rotate(-90 180 100)"/>
    <g class="cv-pulse">
      <path d="M164 82 a26 26 0 1 0 32 0" stroke="${W}" stroke-width="7"/>
      <path d="M180 70 v32" stroke="${W}" stroke-width="7"/>
    </g>
    ${[[66, 54, AM, 0], [300, 62, CY, .4], [86, 150, PK, .8], [284, 146, GR, 1.2], [118, 34, W, .6]].map(([x, y, c, d]) => `<path class="cv-spark" style="--d:${d}s" d="M${x} ${y - 12} q2 10 12 12 q-10 2 -12 12 q-2 -10 -12 -12 q10 -2 12 -12z" fill="${c}"/>`).join('')}`);

  /* Aula 08 · Usando o mouse: o cursor vai até a pasta e clica */
  C['d1-a08'] = cv(`
    <g>
      <rect x="40" y="36" width="78" height="128" rx="39" fill="${G}" stroke="${W}" stroke-width="3"/>
      <path d="M79 36 v50 M40 86 h78" stroke="${W}" stroke-width="3"/>
      <path class="cv-click" d="M43 84 v-10 a36 36 0 0 1 34 -36 v46z" fill="${AM}"/>
      <rect x="73" y="52" width="12" height="22" rx="6" fill="${G2}" stroke="${W}" stroke-width="2.5"/>
      <path class="cv-wheel" d="M79 57 v12" stroke="${CY}" stroke-width="3"/>
    </g>
    <g>
      <path d="M218 76 h30 l8 9 h44 a6 6 0 0 1 6 6 v52 a6 6 0 0 1 -6 6 h-82 a6 6 0 0 1 -6 -6 v-61 a6 6 0 0 1 6 -6z" fill="${AM}" stroke="${W}" stroke-width="3"/>
      <path d="M212 100 h94" stroke="${W}" stroke-width="2.5" opacity=".6"/>
      <circle class="cv-ripple" cx="262" cy="122" r="12" stroke="${W}" stroke-width="3"/>
      <circle class="cv-ripple" style="--d:.15s" cx="262" cy="122" r="12" stroke="${W}" stroke-width="2"/>
    </g>
    <g class="cv-cursor">
      <path d="M262 122 l0 34 9 -8 7 16 8 -4 -7 -15 12 -1z" fill="${W}" stroke="#1f2937" stroke-width="2.5"/>
    </g>`);

  /* Aula 09 · Conhecendo o teclado: as teclas descem uma por uma */
  const key = (x, y, w, t, d, c = W) => `<g class="cv-press" style="--d:${d}s">
      <rect x="${x}" y="${y + 6}" width="${w}" height="40" rx="9" fill="rgba(0,0,0,.25)"/>
      <rect class="cv-cap" x="${x}" y="${y}" width="${w}" height="40" rx="9" fill="${G2}" stroke="${c}" stroke-width="3"/>
      <text class="cv-cap" x="${x + w / 2}" y="${y + 26}" fill="${c}" font-size="${t.length > 2 ? 12 : 17}" font-weight="800" text-anchor="middle" font-family="Inter,system-ui,sans-serif">${t}</text></g>`;
  C['d1-a09'] = cv(`
    <rect x="14" y="40" width="332" height="132" rx="16" fill="${G}" stroke="${W}" stroke-width="3"/>
    ${key(28, 52, 44, 'Q', 0)}${key(78, 52, 44, 'W', .1)}${key(128, 52, 44, 'E', .2)}${key(178, 52, 44, 'R', .3)}${key(228, 52, 44, 'T', .4)}
    ${key(278, 52, 54, 'Enter', .5, AM)}
    ${key(28, 100, 64, 'Shift', .7, CY)}${key(98, 100, 44, 'A', .8)}${key(148, 100, 44, 'Ç', .9, PK)}${key(198, 100, 44, '~', 1)}${key(248, 100, 84, '⌫', 1.1, GR)}
    <rect class="cv-cap" x="98" y="148" width="148" height="16" rx="6" fill="${G2}" stroke="${W}" stroke-width="2.5"/>`);

  /* Aula 10 · Avaliação: a prancheta ganha os visto e a medalha brilha */
  C['d1-av'] = cv(`
    <g>
      <rect x="92" y="34" width="128" height="150" rx="12" fill="${G}" stroke="${W}" stroke-width="3"/>
      <rect x="128" y="26" width="56" height="18" rx="6" fill="${G2}" stroke="${W}" stroke-width="3"/>
      ${[0, 1, 2, 3].map((k) => `<rect x="108" y="${62 + k * 28}" width="16" height="16" rx="4" stroke="${W}" stroke-width="2.5"/>
        <path class="cv-check" style="--d:${k * .3}s" d="M111 ${70 + k * 28} l4 4 7 -8" stroke="${GR}" stroke-width="3.5" pathLength="1" stroke-dasharray="1"/>
        <path d="M134 ${70 + k * 28} h${[66, 50, 72, 44][k]}" stroke="${W}" stroke-width="3" opacity=".7"/>`).join('')}
    </g>
    <g class="cv-medal">
      <path d="M262 92 l-14 -44 h22 l10 30 M298 92 l14 -44 h-22 l-10 30" fill="${PK}" stroke="${W}" stroke-width="3"/>
      <circle cx="280" cy="118" r="34" fill="${AM}" stroke="${W}" stroke-width="3"/>
      <circle cx="280" cy="118" r="24" stroke="#92400e" stroke-width="2.5" opacity=".5"/>
      <text x="280" y="127" fill="#78350f" font-size="24" font-weight="900" text-anchor="middle" font-family="Inter,system-ui,sans-serif">7+</text>
      <path class="cv-shine" d="M258 96 l40 40" stroke="${W}" stroke-width="6" opacity=".0"/>
    </g>
    ${[[48, 64, CY, 0], [54, 150, PK, .5], [330, 60, GR, .9]].map(([x, y, c, d]) => `<path class="cv-spark" style="--d:${d}s" d="M${x} ${y - 10} q2 8 10 10 q-8 2 -10 10 q-2 -8 -10 -10 q8 -2 10 -10z" fill="${c}"/>`).join('')}`);

  /* cada aula com a sua cor e o seu fundo: [cor do card (r, g, b), cor clara, cor escura, desenho do fundo] */
  const COR = {
    'd1-a01': ['15, 118, 110', '#2dd4bf', '#0f5f6e', 'dots'],
    'd1-a02': ['154, 62, 18', '#fb923c', '#7c2d12', 'stripes'],
    'd1-a03': ['67, 56, 202', '#a78bfa', '#312e81', 'grid'],
    'd1-a04': ['29, 78, 216', '#38bdf8', '#1e3a8a', 'rings'],
    'd1-a05': ['21, 128, 61', '#4ade80', '#14532d', 'circuit'],
    'd1-a06': ['190, 24, 93', '#f472b6', '#831843', 'diag'],
    'd1-a07': ['185, 28, 28', '#fb7185', '#7f1d1d', 'rays'],
    'd1-a08': ['77, 124, 15', '#a3e635', '#365314', 'waves'],
    'd1-a09': ['126, 34, 206', '#e879f9', '#4c1d95', 'grid'],
    'd1-av': ['30, 41, 99', '#60a5fa', '#1e1b4b', 'confetti'],
  };
  Object.entries(COR).forEach(([id, [, a, b, f]]) => { if (C[id]) C[id] = `<i class="cvb cvb-${f}" style="--a:${a};--b:${b}"></i>` + C[id]; });
  window.HC_CAPAS_COR = Object.assign(window.HC_CAPAS_COR || {}, COR); // usadas também na pré-tela da aula
  window.HC_CAPAS_TINT = Object.assign(window.HC_CAPAS_TINT || {}, Object.fromEntries(Object.entries(COR).map(([id, [t]]) => [id, t])));
  window.HC_CAPAS = Object.assign(window.HC_CAPAS || {}, C);
})();
