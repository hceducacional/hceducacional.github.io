/* =========================================================
   ILUSTRAÇÕES E ÍCONES ANIMADOS DAS AULAS (curso/conteudo.js)
   - window.HC_ICO(nome, grande): ícone de linha (24×24) com uma animação leve, para usar no meio do texto
     ([[nome]] no texto da aula) ou nos cartões/fluxos.
   - window.HC_FIGS[nome](): cena desenhada em SVG (640×320) com animação, para o bloco { fig: 'nome' }.
   As cores seguem a cor da disciplina (--tint); quem pede "reduzir movimento" vê tudo parado.
   ========================================================= */
(() => {
  /* ---------- ícones: [desenho, animação do grupo] ---------- */
  const IC = {
    monitor: ['<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><g class="a-blink"><path d="M7 10h4"/></g>', ''],
    mouse: ['<rect x="6" y="3" width="12" height="18" rx="6"/><g class="a-bob"><path d="M12 7v3"/></g>', ''],
    teclado: ['<rect x="2" y="6" width="20" height="12" rx="2"/><g class="a-blink"><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01"/></g><path d="M8 14h8"/>', ''],
    cpu: ['<rect x="6" y="6" width="12" height="12" rx="2"/><g class="a-pulse"><rect x="9.5" y="9.5" width="5" height="5" rx="1"/></g><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>', ''],
    memoria: ['<rect x="2" y="7" width="20" height="9" rx="1.5"/><path d="M5 16v3M9 16v3M15 16v3M19 16v3"/><g class="a-blink"><path d="M6 10.5h2M11 10.5h2M16 10.5h2"/></g>', ''],
    hd: ['<rect x="3" y="4" width="18" height="16" rx="2.5"/><g class="a-spin"><circle cx="12" cy="11" r="4"/><path d="M12 11h.01"/></g><path d="M7 17h3"/>', ''],
    pasta: ['<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><g class="a-bob"><path d="M9 13h6"/></g>', ''],
    arquivo: ['<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/><g class="a-blink"><path d="M9 13h6M9 17h4"/></g>', ''],
    nuvem: ['<g class="a-bob"><path d="M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.5 1.5A3.8 3.8 0 0 1 17.5 18H7Z"/></g>', ''],
    globo: ['<circle cx="12" cy="12" r="9"/><g class="a-spin"><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></g>', ''],
    wifi: ['<path d="M12 19h.01"/><g class="a-blink"><path d="M8.5 15.5a5 5 0 0 1 7 0"/></g><path d="M5 12a10 10 0 0 1 14 0M2 8.5a15 15 0 0 1 20 0"/>', ''],
    email: ['<rect x="3" y="5" width="18" height="14" rx="2"/><g class="a-bob"><path d="m3 7 9 6 9-6"/></g>', ''],
    arroba: ['<g class="a-spin"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></g>', ''],
    cadeado: ['<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><g class="a-bob"><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></g><path d="M12 14.5v2.5"/>', ''],
    escudo: ['<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Z"/><g class="a-pulse"><path d="m9 12 2 2 4-4"/></g>', ''],
    chave: ['<g class="a-wig"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/></g>', ''],
    alerta: ['<path d="M12 4 2.5 20h19L12 4Z"/><g class="a-blink"><path d="M12 10v4M12 17h.01"/></g>', ''],
    lixeira: ['<g class="a-wig"><path d="M4 7h16M9 7V4h6v3"/></g><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M10 11v6M14 11v6"/>', ''],
    impressora: ['<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><g class="a-bob"><path d="M7 14h10v7H7z"/></g>', ''],
    camera: ['<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"/><g class="a-pulse"><circle cx="12" cy="13" r="4"/></g>', ''],
    chat: ['<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.8A8 8 0 1 1 21 12Z"/><g class="a-blink"><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></g>', ''],
    usuario: ['<g class="a-bob"><circle cx="12" cy="8" r="4"/></g><path d="M4 21a8 8 0 0 1 16 0"/>', ''],
    grupo: ['<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><g class="a-bob"><circle cx="17" cy="9" r="2.8"/><path d="M17 14a5 5 0 0 1 5 5"/></g>', ''],
    estrela: ['<g class="a-pulse"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/></g>', ''],
    raio: ['<g class="a-pulse"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></g>', ''],
    relogio: ['<circle cx="12" cy="12" r="9"/><g class="a-spin"><path d="M12 12V7"/></g><path d="M12 12h4"/>', ''],
    lupa: ['<g class="a-wig"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/></g>', ''],
    engrenagem: ['<g class="a-spin"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></g>', ''],
    janela: ['<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><g class="a-blink"><path d="M6 6.5h.01M8.5 6.5h.01M11 6.5h.01"/></g>', ''],
    celular: ['<rect x="7" y="2" width="10" height="20" rx="2.5"/><g class="a-blink"><path d="M11 18h2"/></g>', ''],
    notebook: ['<rect x="5" y="4" width="14" height="10" rx="1.5"/><path d="M2 18h20l-2-4H4l-2 4Z"/><g class="a-blink"><path d="M8 9h4"/></g>', ''],
    tablet: ['<rect x="4" y="2" width="16" height="20" rx="2.5"/><g class="a-pulse"><path d="M12 18h.01"/></g>', ''],
    servidor: ['<rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="14" width="16" height="7" rx="1.5"/><g class="a-blink"><path d="M8 6.5h.01M8 17.5h.01"/></g>', ''],
    link: ['<g class="a-wig"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></g>', ''],
    download: ['<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><g class="a-bob"><path d="M12 3v12M7 10l5 5 5-5"/></g>', ''],
    upload: ['<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><g class="a-bob"><path d="M12 15V3M7 8l5-5 5 5"/></g>', ''],
    coracao: ['<g class="a-pulse"><path d="M12 20s-7.5-4.6-9-9.5C2 6.9 4.5 4 7.5 4c2 0 3.5 1.2 4.5 2.8C13 5.2 14.5 4 16.5 4c3 0 5.5 2.9 4.5 6.5-1.5 4.9-9 9.5-9 9.5Z"/></g>', ''],
    olho: ['<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><g class="a-pulse"><circle cx="12" cy="12" r="3"/></g>', ''],
    virus: ['<g class="a-spin"><circle cx="12" cy="12" r="5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5 19 19M5 19l3.5-3.5M15.5 8.5 19 5"/></g>', ''],
    anzol: ['<g class="a-wig"><path d="M12 2v12a4 4 0 0 1-8 0v-2l3 3"/><circle cx="12" cy="3" r="1"/></g>', ''],
    grafico: ['<path d="M4 20h16"/><g class="a-bob"><path d="M7 16v-4M12 16V8M17 16v-7"/></g>', ''],
    tabela: ['<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/><g class="a-blink"><path d="M13 12.5h4"/></g>', ''],
    texto: ['<path d="M5 6h14M5 10h14M5 14h10"/><g class="a-blink"><path d="M5 18h6"/></g>', ''],
    imagem: ['<rect x="3" y="5" width="18" height="14" rx="2.5"/><g class="a-bob"><circle cx="9" cy="10" r="1.8"/></g><path d="m21 16-5-5-9 8"/>', ''],
    som: ['<path d="M4 9h4l5-4v14l-5-4H4V9Z"/><g class="a-blink"><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></g>', ''],
    microfone: ['<g class="a-pulse"><rect x="9" y="3" width="6" height="11" rx="3"/></g><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>', ''],
    acessivel: ['<circle cx="12" cy="4" r="2"/><g class="a-bob"><path d="M5 8l7 2 7-2M12 10v5l-3 6M12 15l3 6"/></g>', ''],
    lampada: ['<g class="a-pulse"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3Z"/></g>', ''],
    foguete: ['<g class="a-bob"><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3 6-8c3-3 7-3 9-3 0 2 0 6-3 9l-8 6Z"/><circle cx="15" cy="9" r="1.5"/></g>', ''],
    check: ['<circle cx="12" cy="12" r="9"/><g class="a-pulse"><path d="m8 12.5 3 3 5-6"/></g>', ''],
    x: ['<circle cx="12" cy="12" r="9"/><g class="a-pulse"><path d="M15 9l-6 6M9 9l6 6"/></g>', ''],
    cursor: ['<g class="a-bob"><path d="M5 3l14 7-6 2-2 6L5 3Z"/></g>', ''],
    clique: ['<path d="M9 9l11 4-5 1.5L13.5 20 9 9Z"/><g class="a-blink"><path d="M5 5l1.5 1.5M9 2.5V5M2.5 9H5M5 13l1.5-1.5M13 5l-1.5 1.5"/></g>', ''],
    calculadora: ['<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8"/><g class="a-blink"><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h.01M12 18.5h.01"/></g>', ''],
    calendario: ['<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><g class="a-pulse"><path d="M12 14.5h.01"/></g>', ''],
    livro: ['<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><g class="a-bob"><path d="M9 8h6"/></g><path d="M4 19a2 2 0 0 1 2-2h13"/>', ''],
    casa: ['<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><g class="a-blink"><path d="M10 20v-5h4v5"/></g>', ''],
    dinheiro: ['<rect x="2" y="6" width="20" height="12" rx="2"/><g class="a-pulse"><circle cx="12" cy="12" r="3"/></g>', ''],
    video: ['<rect x="3" y="6" width="13" height="12" rx="2"/><g class="a-pulse"><path d="m16 10 5-3v10l-5-3"/></g>', ''],
    play: ['<circle cx="12" cy="12" r="9"/><g class="a-pulse"><path d="m10 8 6 4-6 4V8Z"/></g>', ''],
    power: ['<g class="a-pulse"><path d="M12 3v8"/></g><path d="M6.3 7a8 8 0 1 0 11.4 0"/>', ''],
    atualizar: ['<g class="a-spin"><path d="M20 11a8 8 0 0 0-14.6-4M4 13a8 8 0 0 0 14.6 4"/><path d="M5 3v4h4M19 21v-4h-4"/></g>', ''],
    salvar: ['<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 3v5h7V3"/><g class="a-bob"><rect x="7" y="13" width="10" height="6" rx="1"/></g>', ''],
    copiar: ['<rect x="8" y="8" width="12" height="12" rx="2"/><g class="a-bob"><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></g>', ''],
    colar: ['<path d="M9 4h6v3H9z"/><path d="M9 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-3"/><g class="a-blink"><path d="M9 12h6M9 16h4"/></g>', ''],
    tesoura: ['<g class="a-wig"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5 20 18M8.5 16.5 20 6"/></g>', ''],
    desfazer: ['<g class="a-wig"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></g>', ''],
    filtro: ['<g class="a-bob"><path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/></g>', ''],
    ordenar: ['<path d="M7 4v16M4 17l3 3 3-3"/><g class="a-bob"><path d="M14 6h7M14 11h5M14 16h3"/></g>', ''],
    soma: ['<g class="a-pulse"><path d="M18 5H6l6 7-6 7h12"/></g>', ''],
    lapis: ['<g class="a-wig"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></g>', ''],
    fonte: ['<path d="M4 19 9 5l5 14M6 14h6"/><g class="a-bob"><path d="M15 19v-6a2.5 2.5 0 0 1 5 0v6M15 16h5"/></g>', ''],
    alinhar: ['<path d="M4 6h16M4 10h10M4 14h16"/><g class="a-blink"><path d="M4 18h10"/></g>', ''],
    lista: ['<path d="M9 6h11M9 12h11M9 18h11"/><g class="a-pulse"><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></g>', ''],
    telefone: ['<g class="a-wig"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></g>', ''],
    bateria: ['<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/><g class="a-blink"><path d="M6 10v4M10 10v4M14 10v4"/></g>', ''],
    sol: ['<circle cx="12" cy="12" r="4"/><g class="a-spin"><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></g>', ''],
    lua: ['<g class="a-wig"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></g>', ''],
    trofeu: ['<g class="a-bob"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/></g>', ''],
    sino: ['<g class="a-wig"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z"/><path d="M10 20a2 2 0 0 0 4 0"/></g>', ''],
    curtir: ['<g class="a-wig"><path d="M7 11v9H4v-9h3ZM7 11l4-7a2 2 0 0 1 3 2l-1 4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7"/></g>', ''],
    compartilhar: ['<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><g class="a-blink"><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></g>', ''],
    local: ['<g class="a-bob"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></g>', ''],
    cartao: ['<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><g class="a-blink"><path d="M6 15h4"/></g>', ''],
    robo: ['<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 19v2M15 19v2"/><g class="a-blink"><path d="M9.5 13h.01M14.5 13h.01"/></g><circle cx="12" cy="3.5" r="1"/>', ''],
    mao: ['<g class="a-wig"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 10.5V5.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 4 16l-1-3a1.5 1.5 0 0 1 2.6-1.3L8 14"/></g>', ''],
    seta: ['<g class="a-bob"><path d="M5 12h14M13 6l6 6-6 6"/></g>', ''],
    pendrive: ['<rect x="7" y="9" width="10" height="13" rx="2"/><path d="M9 9V3h6v6"/><g class="a-blink"><path d="M11 5.5h.01M13 5.5h.01"/></g>', ''],
    codigo: ['<path d="m8 8-5 4 5 4M16 8l5 4-5 4"/><g class="a-blink"><path d="m13 5-2 14"/></g>', ''],
    bandeira: ['<path d="M5 21V4"/><g class="a-wig"><path d="M5 4h12l-2 4 2 4H5"/></g>', ''],
    planeta: ['<circle cx="12" cy="12" r="6"/><g class="a-spin"><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-20 12 12)"/></g>', ''],
    luz: ['<g class="a-blink"><circle cx="12" cy="12" r="3"/></g><circle cx="12" cy="12" r="8"/>', ''],
    contraste: ['<circle cx="12" cy="12" r="9"/><g class="a-pulse"><path d="M12 3a9 9 0 0 1 0 18V3Z" fill="currentColor"/></g>', ''],
    win: ['<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><g class="a-pulse"><rect x="13" y="13" width="8" height="8" rx="1"/></g>', ''],
    sacola: ['<path d="M5 8h14l-1 13H6L5 8Z"/><g class="a-bob"><path d="M9 8V6a3 3 0 0 1 6 0v2"/></g>', ''],
    pincel: ['<g class="a-wig"><path d="M18 3l3 3-9 9-3-3 9-9Z"/><path d="M9 12c-3 0-5 2-5 5 0 1-1 2-2 2 2 2 6 2 8 0 2-2 2-4 2-4"/></g>', ''],
    legenda: ['<rect x="3" y="5" width="18" height="14" rx="2"/><g class="a-blink"><path d="M7 13h4M13 13h4M7 16h8"/></g>', ''],
  };
  window.HC_ICO = (n, big) => {
    const ic = IC[n]; if (!ic) return '';
    return `<span class="ct-i${big ? ' big' : ''}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic[0]}</svg></span>`;
  };

  /* ---------- peças das cenas ---------- */
  const S = (inner, label) => `<svg viewBox="0 0 640 320" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const T = (x, y, s, a = 'middle', c = '') => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}">${s}</text>`;
  const tag = (x, y, s, d = 0) => `<g class="fg-pop" style="--d:${d}s"><rect class="w fg-sh fg-tag" x="${x - s.length * 4.4 - 12}" y="${y - 16}" width="${s.length * 8.8 + 24}" height="29" rx="14.5"/>${T(x, y + 4, s, 'middle', 'tg')}</g>`;
  const win = (x, y, w, h, title, bar = 't') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="w fg-sh"/><path d="M${x} ${y + 12}a12 12 0 0 1 12-12h${w - 24}a12 12 0 0 1 12 12v18H${x}Z" class="${bar}"/>`
    + `<circle cx="${x + w - 16}" cy="${y + 15}" r="4.5" class="w op5"/><circle cx="${x + w - 32}" cy="${y + 15}" r="4.5" class="w op5"/><circle cx="${x + w - 48}" cy="${y + 15}" r="4.5" class="w op5"/>`
    + `<text x="${x + 14}" y="${y + 20}" class="fg-wt">${title}</text>`;
  const lines = (x, y, w, n, gap = 14, d = 0) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * gap}" width="${i === n - 1 ? w * .6 : w}" height="6" rx="3" class="g fg-type" style="--d:${d + i * .35}s"/>`).join('');

  const F = {};
  /* computador completo */
  F.computador = () => S(`
    <rect x="150" y="36" width="290" height="186" rx="14" class="d"/>
    <rect x="162" y="48" width="266" height="152" rx="6" class="t"/>
    ${lines(182, 70, 150, 4, 18)}<rect x="182" y="70" width="0" height="0"/>
    <rect x="300" y="124" width="3" height="16" class="w fg-blink"/>
    <path d="M270 222h50l8 30h-66Z" class="g2"/><rect x="240" y="250" width="110" height="8" rx="4" class="g2"/>
    <rect x="470" y="70" width="88" height="190" rx="12" class="d"/><rect x="484" y="88" width="60" height="8" rx="4" class="g2 op5"/><rect x="484" y="104" width="60" height="8" rx="4" class="g2 op5"/>
    <circle cx="514" cy="230" r="9" class="g2 op5"/><circle cx="514" cy="230" r="4" class="gr fg-pulse"/>
    <rect x="150" y="270" width="230" height="30" rx="8" class="g2"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${158 + i * 18.2}" y="277" width="14" height="7" rx="2" class="w ${i === 5 ? 'fg-key' : ''}"/>`).join('')}<rect x="200" y="288" width="130" height="6" rx="2" class="w"/>
    <rect x="404" y="268" width="26" height="38" rx="13" class="g2"/><path d="M417 270v12" class="fg-st d-s"/>
    ${tag(110, 100, 'Monitor', .2)}${tag(600, 160, 'Gabinete', .5)}${tag(96, 286, 'Teclado', .8)}${tag(470, 300, 'Mouse', 1.1)}`, 'Computador de mesa com monitor, gabinete, teclado e mouse');

  /* por dentro do gabinete */
  F.placa = () => S(`
    <rect x="60" y="24" width="520" height="272" rx="16" class="d"/>
    <path d="M140 160H250M390 160h60v-70h40M320 200v60M250 110V70h-60" class="fg-trace"/>
    <rect x="250" y="100" width="140" height="120" rx="12" class="t fg-glow"/><rect x="275" y="125" width="90" height="70" rx="8" class="w op2"/>${T(320, 166, 'CPU', 'middle', 'fg-wt big')}
    <rect x="440" y="50" width="18" height="110" rx="3" class="bl"/><rect x="466" y="50" width="18" height="110" rx="3" class="bl"/>${Array.from({ length: 6 }, (_, i) => `<rect x="444" y="${58 + i * 17}" width="10" height="10" rx="2" class="w op5 fg-blink" style="--d:${i * .2}s"/>`).join('')}
    <rect x="96" y="56" width="110" height="64" rx="8" class="g2"/>${T(151, 93, 'SSD', 'middle', 'fg-dt')}
    <circle cx="150" cy="226" r="46" class="g2 op2"/><g class="fg-spin" style="transform-origin:150px 226px">${[0, 72, 144, 216, 288].map((a) => `<path d="M150 226 q 10 -38 30 -30 q -8 22 -30 30" class="g2" transform="rotate(${a} 150 226)"/>`).join('')}</g><circle cx="150" cy="226" r="8" class="d"/>
    <rect x="420" y="200" width="130" height="76" rx="10" class="g2 op5"/>${T(485, 243, 'Fonte', 'middle', 'fg-dt')}
    ${tag(320, 254, 'Processador', .2)}${tag(462, 182, 'Memória RAM', .5)}${tag(151, 140, 'Armazenamento', .8)}${tag(150, 288, 'Ventoinha', 1.1)}${tag(485, 292, 'Fonte de energia', 1.4)}`, 'Placa-mãe com processador, memória, armazenamento, ventoinha e fonte');

  /* mouse */
  F.mouse = () => S(`
    <path d="M320 40c-60 0-100 46-100 110v40c0 64 40 110 100 110s100-46 100-110v-40c0-64-40-110-100-110Z" class="g2"/>
    <path d="M320 40c-60 0-100 46-100 110h100Z" class="t fg-click"/><path d="M320 40c60 0 100 46 100 110H320Z" class="g"/>
    <rect x="310" y="78" width="20" height="44" rx="10" class="d"/><g class="fg-wheel"><rect x="316" y="86" width="8" height="10" rx="3" class="w"/><rect x="316" y="104" width="8" height="10" rx="3" class="w"/></g>
    <circle cx="270" cy="110" r="10" class="t fg-ring"/>
    <path d="M140 92h80" class="fg-ln"/><path d="M500 92h-80" class="fg-ln"/><path d="M520 150H330" class="fg-ln"/>
    ${tag(110, 92, 'Botão esquerdo', .2)}${tag(540, 70, 'Botão direito', .5)}${tag(540, 150, 'Rodinha', .8)}
    ${T(320, 230, 'clique!', 'middle', 'fg-dt fg-blink')}`, 'Mouse com botão esquerdo, botão direito e rodinha de rolagem');

  /* área de trabalho do Windows */
  F.desktop = () => S(`
    <rect x="70" y="20" width="500" height="280" rx="14" class="d"/>
    <rect x="80" y="30" width="480" height="232" rx="6" class="t"/><circle cx="460" cy="90" r="120" class="w op1"/><circle cx="160" cy="250" r="140" class="w op1"/>
    ${[['Lixeira', 46], ['Documentos', 102], ['Navegador', 158]].map(([n, y], i) => `<g class="${i === 1 ? 'fg-sel' : ''}"><rect x="96" y="${y}" width="40" height="34" rx="6" class="w op8"/>${T(116, y + 48, n, 'middle', 'fg-wt sm')}</g>`).join('')}
    <rect x="80" y="262" width="480" height="28" class="w op8"/>
    <rect x="290" y="267" width="18" height="18" rx="4" class="t"/>${[318, 344, 370].map((x) => `<rect x="${x}" y="267" width="18" height="18" rx="4" class="g2"/>`).join('')}
    <rect x="92" y="268" width="150" height="16" rx="8" class="g"/>${T(100, 280, 'Pesquisar', 'start', 'sm')}
    ${T(548, 280, '10:49', 'end', 'sm')}
    <g class="fg-cursor"><path d="M0 0l14 34 5-13 13-4Z" class="w" stroke="#111" stroke-width="2"/></g>
    ${tag(196, 60, 'Ícones', .2)}${tag(170, 246, 'Barra de tarefas', .5)}${tag(310, 228, 'Botão Iniciar', .8)}${tag(530, 246, 'Relógio', 1.1)}`, 'Área de trabalho do Windows com ícones, barra de tarefas, botão Iniciar e relógio');

  /* janela com os três botões */
  F.janela = () => S(`
    <rect x="100" y="40" width="440" height="250" rx="14" class="w fg-sh"/>
    <path d="M100 54a14 14 0 0 1 14-14h412a14 14 0 0 1 14 14v26H100Z" class="t"/>
    ${T(120, 66, 'Documentos', 'start', 'fg-wt')}
    <g class="fg-hl" style="--d:0s"><rect x="440" y="44" width="30" height="30" rx="6" class="w op2"/><path d="M448 60h14" class="fg-st w-s"/></g>
    <g class="fg-hl" style="--d:1s"><rect x="474" y="44" width="30" height="30" rx="6" class="w op2"/><rect x="482" y="52" width="14" height="14" rx="2" class="fg-st w-s" fill="none"/></g>
    <g class="fg-hl" style="--d:2s"><rect x="508" y="44" width="30" height="30" rx="6" class="rd op8"/><path d="M517 53l12 12M529 53l-12 12" class="fg-st w-s"/></g>
    <rect x="100" y="80" width="120" height="210" class="g op5"/>${lines(116, 100, 80, 6, 22)}
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${246 + (i % 3) * 96}" y="${104 + Math.floor(i / 3) * 90}" width="60" height="48" rx="8" class="tl"/>`).join('')}
    ${tag(455, 22, 'Minimizar', .2)}${tag(490, 110, 'Maximizar', .6)}${tag(560, 22, 'Fechar', 1)}`, 'Janela com os botões minimizar, maximizar e fechar');

  /* pastas e arquivos */
  const folder = (x, y, c = 'yl') => `<path d="M${x} ${y + 6}a6 6 0 0 1 6-6h16l6 6h24a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H${x + 6}a6 6 0 0 1-6-6Z" class="${c}"/>`;
  F.pastas = () => S(`
    <rect x="40" y="30" width="560" height="260" rx="14" class="w fg-sh"/>
    <path d="M82 92v150M82 140h40M82 196h40M152 196v0" class="fg-ln"/>
    ${folder(60, 50, 't')}${T(140, 76, 'Este Computador', 'start')}
    ${folder(122, 118)}${T(200, 144, 'Documentos', 'start')}
    ${folder(122, 174)}${T(200, 200, 'Escola', 'start')}
    <path d="M152 218v40h40" class="fg-ln"/>
    <g class="fg-pop" style="--d:.4s"><path d="M198 240h28l10 10v28h-38Z" class="bl"/>${T(246, 266, 'trabalho.docx', 'start')}</g>
    <g class="fg-drop"><path d="M440 60h34l12 12v38h-46Z" class="gr"/>${T(463, 100, 'xlsx', 'middle', 'fg-wt sm')}</g>
    ${folder(420, 180, 'yl')}${T(460, 250, 'Contas da casa', 'middle')}
    ${tag(520, 150, 'arraste para a pasta', .2)}`, 'Pastas dentro de pastas e um arquivo sendo colocado numa pasta');

  /* Word */
  F.word = () => S(`
    ${win(60, 20, 520, 284, 'Documento1 - Word', 'bl')}
    <rect x="60" y="50" width="520" height="58" class="g op5"/>
    ${['Arquivo', 'Página Inicial', 'Inserir', 'Layout', 'Revisão'].map((n, i) => T(84 + i * 92, 66, n, 'start', i === 1 ? 'fg-bt sm' : 'sm')).join('')}
    <rect x="174" y="70" width="86" height="3" class="bl"/>
    ${['N', 'I', 'S'].map((n, i) => `<rect x="${84 + i * 30}" y="78" width="24" height="24" rx="5" class="w"/>${T(96 + i * 30, 95, n, 'middle', i === 0 ? 'fg-b' : i === 1 ? 'fg-it' : 'fg-u')}`).join('')}
    <rect x="186" y="78" width="96" height="24" rx="5" class="w"/>${T(194, 95, 'Calibri 11', 'start', 'sm')}
    ${[0, 1, 2].map((i) => `<rect x="${300 + i * 30}" y="84" width="20" height="3" class="g2"/><rect x="${300 + i * 30}" y="90" width="${i === 1 ? 14 : 20}" height="3" class="g2"/><rect x="${300 + i * 30}" y="96" width="20" height="3" class="g2"/>`).join('')}
    <rect x="200" y="118" width="240" height="186" class="w fg-sh"/>
    <rect x="222" y="136" width="120" height="10" rx="3" class="bl fg-type" style="--d:0s"/>
    ${lines(222, 160, 196, 7, 16, .5)}
    <rect x="350" y="252" width="2.5" height="14" class="d fg-blink"/>
    ${tag(500, 92, 'Faixa de Opções', .3)}${tag(510, 200, 'Página', .7)}`, 'Tela do Word com a Faixa de Opções e uma página sendo digitada');

  /* Excel */
  F.excel = () => S(`
    ${win(50, 16, 540, 290, 'Pasta1 - Excel', 'gr')}
    <rect x="50" y="46" width="540" height="34" class="g op5"/><rect x="62" y="53" width="46" height="20" rx="4" class="w"/>${T(85, 68, 'B5', 'middle', 'sm')}
    ${T(124, 68, 'fx', 'start', 'fg-it')}<rect x="146" y="53" width="430" height="20" rx="4" class="w"/>${T(156, 68, '=SOMA(B2:B4)', 'start', 'fg-mono')}
    ${['', 'A', 'B', 'C', 'D'].map((c, i) => `<rect x="${50 + (i ? 40 + (i - 1) * 125 : 0)}" y="82" width="${i ? 125 : 40}" height="24" class="g"/>${T(i ? 152 + (i - 1) * 125 : 70, 99, c, 'middle', 'sm')}`).join('')}
    ${[['Produto', 'Valor'], ['Arroz', '25,90'], ['Feijão', '9,50'], ['Café', '18,00'], ['Total', '53,40']].map((r, k) => `<rect x="50" y="${106 + k * 38}" width="40" height="38" class="g"/>${T(70, 130 + k * 38, k + 1, 'middle', 'sm')}`
      + r.map((v, j) => `<rect x="${90 + j * 125}" y="${106 + k * 38}" width="125" height="38" class="w fg-cell"/>${T(100 + j * 125 + (j ? 105 : 0), 130 + k * 38, v, j ? 'end' : 'start', k === 4 ? (j ? 'fg-res' : 'fg-b') : k === 0 ? 'fg-b' : '')}`).join('')).join('')}
    <rect x="215" y="258" width="125" height="38" rx="2" class="fg-selbox"/>
    ${tag(470, 64, 'Barra de fórmulas', .3)}${tag(470, 278, 'Célula B5', .7)}`, 'Planilha do Excel com uma soma na célula B5');

  /* gráficos */
  F.grafico = () => S(`
    <rect x="40" y="30" width="330" height="260" rx="16" class="w fg-sh"/>
    <path d="M80 250h260M80 250V60" class="fg-ln"/>
    ${[[110, 120, 't'], [170, 80, 'bl'], [230, 160, 'gr'], [290, 110, 'yl']].map(([x, h, c], i) => `<rect x="${x}" y="${250 - h}" width="40" height="${h}" rx="6" class="${c} fg-grow" style="--d:${i * .2}s"/>`).join('')}
    ${['Jan', 'Fev', 'Mar', 'Abr'].map((m, i) => T(130 + i * 60, 272, m, 'middle', 'sm')).join('')}
    <rect x="390" y="30" width="210" height="260" rx="16" class="w fg-sh"/>
    <g class="fg-spinslow" style="transform-origin:495px 150px"><circle cx="495" cy="150" r="70" class="t"/><path d="M495 150V80a70 70 0 0 1 66 92Z" class="yl"/><path d="M495 150l66 22a70 70 0 0 1-90 44Z" class="gr"/></g>
    ${T(495, 260, 'Gastos do mês', 'middle')}${T(205, 54, 'Vendas por mês', 'middle')}`, 'Gráfico de colunas e gráfico de pizza');

  /* navegador */
  F.navegador = () => S(`
    <rect x="40" y="20" width="560" height="280" rx="14" class="w fg-sh"/>
    <path d="M40 34a14 14 0 0 1 14-14h532a14 14 0 0 1 14 14v34H40Z" class="g"/>
    <path d="M60 68V44a8 8 0 0 1 8-8h150a8 8 0 0 1 8 8v24Z" class="w"/>${T(78, 58, 'HC Educacional', 'start', 'sm')}<path d="M210 48l8 8M218 48l-8 8" class="fg-st g-s"/>
    ${T(244, 58, '+', 'middle', 'fg-b')}
    <rect x="40" y="68" width="560" height="40" class="w"/><path d="M40 108h560" class="fg-ln"/>
    <path d="M66 88h-10l5-5M56 88l5 5" class="fg-st g-s"/><path d="M84 88h10l-5-5M94 88l-5 5" class="fg-st g-s"/>
    <g class="fg-spin" style="transform-origin:118px 88px"><path d="M126 88a8 8 0 1 1-3-6" class="fg-st g-s" fill="none"/></g>
    <rect x="142" y="76" width="400" height="24" rx="12" class="g op5"/>
    <g class="fg-pulse"><rect x="156" y="86" width="12" height="9" rx="2" class="gr"/><path d="M158.5 86v-3a3.5 3.5 0 0 1 7 0v3" class="fg-st gr-s" fill="none"/></g>
    ${T(176, 93, 'https://www.hceducacional.app.br', 'start', 'sm fg-mono')}
    <path d="M562 80l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1Z" class="yl fg-pulse"/>
    <rect x="70" y="128" width="500" height="70" rx="10" class="tl"/>${lines(90, 214, 300, 4, 18)}
    <rect x="420" y="214" width="150" height="64" rx="10" class="t op5"/>
    ${tag(110, 312, 'Abas', .2)}${tag(340, 124, 'Barra de endereço', .5)}${tag(590, 124, 'Favoritos', .8)}${tag(110, 124, 'Voltar e atualizar', 1.1)}`, 'Navegador com abas, botões, barra de endereço e favoritos');

  /* a internet ligando o mundo */
  F.internet = () => {
    const pts = [[90, 70], [80, 230], [550, 60], [560, 240], [320, 290], [320, 30]];
    return S(`
    ${pts.map(([x, y], i) => `<path id="fgp${i}" d="M${x} ${y}L320 160" class="fg-ln"/>`).join('')}
    <circle cx="320" cy="160" r="84" class="t"/><g class="fg-spinslow" style="transform-origin:320px 160px"><ellipse cx="320" cy="160" rx="38" ry="84" class="fg-st w-s op5" fill="none"/><ellipse cx="320" cy="160" rx="70" ry="84" class="fg-st w-s op2" fill="none"/></g>
    <path d="M236 160h168M248 118h144M248 202h144" class="fg-st w-s op5"/>
    ${pts.map(([x, y], i) => `<circle r="6" class="yl"><animateMotion dur="${2 + i * .3}s" repeatCount="indefinite" path="M${x} ${y}L320 160"/></circle><circle r="5" class="gr"><animateMotion dur="${2.4 + i * .2}s" begin="1s" repeatCount="indefinite" path="M320 160L${x} ${y}"/></circle>`).join('')}
    ${pts.map(([x, y], i) => `<g class="fg-pop" style="--d:${i * .15}s"><circle cx="${x}" cy="${y}" r="26" class="w fg-sh"/><g transform="translate(${x - 12} ${y - 12})" class="fg-icon">${['<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>', '<rect x="7" y="2" width="10" height="20" rx="2.5"/>', '<rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="14" width="16" height="7" rx="1.5"/>', '<rect x="5" y="4" width="14" height="10" rx="1.5"/><path d="M2 18h20l-2-4H4l-2 4Z"/>', '<rect x="4" y="2" width="16" height="20" rx="2.5"/>', '<path d="M3 11 12 4l9 7M5 10v10h14V10"/>'][i]}</g></g>`).join('')}`, 'A internet: computadores, celulares e servidores do mundo todo trocando informação');
  };

  /* e-mail voando */
  F.email = () => S(`
    <circle cx="110" cy="160" r="60" class="tl"/><circle cx="110" cy="140" r="20" class="t"/><path d="M75 195a35 35 0 0 1 70 0" class="t"/>
    <circle cx="530" cy="160" r="60" class="tl"/><circle cx="530" cy="140" r="20" class="bl"/><path d="M495 195a35 35 0 0 1 70 0" class="bl"/>
    <path d="M180 160C260 60 380 60 460 160" class="fg-ln fg-dash"/>
    <g><rect x="-30" y="-20" width="60" height="40" rx="6" class="w fg-sh"/><path d="M-30 -16l30 20 30-20" class="fg-st t-s" fill="none"/><animateMotion dur="3s" repeatCount="indefinite" path="M180 160C260 60 380 60 460 160"/></g>
    ${T(110, 250, 'maria@email.com', 'middle', 'fg-mono sm')}${T(530, 250, 'joao@email.com', 'middle', 'fg-mono sm')}
    ${tag(320, 270, 'a mensagem chega em segundos', .3)}`, 'Um e-mail saindo de uma pessoa e chegando em outra');

  /* celular com conversa */
  F.conversa = () => S(`
    <rect x="230" y="12" width="180" height="300" rx="28" class="d"/><rect x="240" y="40" width="160" height="244" rx="8" class="g op5"/>
    <rect x="240" y="40" width="160" height="34" class="t"/><circle cx="260" cy="57" r="10" class="w op5"/>${T(278, 62, 'Turma HC', 'start', 'fg-wt sm')}
    ${[[250, 88, 110, 'w', 0], [290, 124, 100, 'gr2', .8], [250, 160, 90, 'w', 1.6], [280, 196, 110, 'gr2', 2.4]].map(([x, y, w, c, d]) => `<rect x="${x}" y="${y}" width="${w}" height="28" rx="12" class="${c} fg-bub" style="--d:${d}s"/><rect x="${x + 10}" y="${y + 11}" width="${w - 30}" height="6" rx="3" class="g2 fg-bub" style="--d:${d}s"/>`).join('')}
    <g class="fg-bub" style="--d:3.2s"><rect x="250" y="232" width="56" height="26" rx="12" class="w"/>${[264, 278, 292].map((x, i) => `<circle cx="${x}" cy="245" r="3.5" class="g2 fg-blink" style="--d:${i * .2}s"/>`).join('')}</g>
    <rect x="248" y="262" width="120" height="16" rx="8" class="w"/><circle cx="384" cy="270" r="9" class="t"/>
    ${tag(120, 100, 'mensagens', .2)}${tag(520, 140, 'respostas', .5)}${tag(120, 246, 'digitando…', .8)}`, 'Celular com uma conversa de mensagens');

  /* escudo do antivírus */
  F.escudo = () => S(`
    <path d="M320 30 220 70v80c0 70 44 120 100 140 56-20 100-70 100-140V70Z" class="t"/>
    <path d="M320 60 250 88v62c0 50 30 88 70 102 40-14 70-52 70-102V88Z" class="w op2"/>
    <path d="m285 160 25 25 50-55" class="fg-st w-s fg-draw" fill="none" stroke-width="12"/>
    <rect x="220" y="60" width="200" height="6" rx="3" class="gr fg-scan"/>
    ${[[110, 90, 0], [530, 110, .7], [120, 240, 1.4], [520, 250, 2.1]].map(([x, y, d]) => `<g class="fg-bug" style="--d:${d}s;--x:${x < 320 ? 60 : -60}px"><g transform="translate(${x - 16} ${y - 16}) scale(1.35)" class="fg-icon rd-s"><circle cx="12" cy="12" r="5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5 19 19M5 19l3.5-3.5M15.5 8.5 19 5"/></g></g>`).join('')}
    ${tag(320, 312, 'o antivírus barra as ameaças', .3)}`, 'Escudo do antivírus bloqueando vírus');

  /* força da senha */
  F.senha = () => S(`
    ${[['123456', 'Fraca', 'rd', 1, 60], ['maria1990', 'Média', 'yl', 2, 150], ['Gato!Azul#Chuva27', 'Forte', 'gr', 4, 240]].map(([pw, l, c, n, y], k) => `
      <rect x="70" y="${y - 30}" width="340" height="56" rx="14" class="w fg-sh"/>
      <g transform="translate(86 ${y - 14})" class="fg-icon g-s"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></g>
      ${T(124, y + 4, pw, 'start', 'fg-mono')}
      ${[0, 1, 2, 3].map((i) => `<rect x="${430 + i * 36}" y="${y - 6}" width="30" height="10" rx="5" class="${i < n ? c : 'g'} ${i < n ? 'fg-fill' : ''}" style="--d:${k * .6 + i * .15}s"/>`).join('')}
      ${T(590, y + 3, l, 'start', 'fg-b')}`).join('')}`, 'Três senhas: uma fraca, uma média e uma forte');

  /* phishing */
  F.phishing = () => S(`
    <rect x="150" y="80" width="340" height="210" rx="16" class="w fg-sh"/>
    <rect x="150" y="80" width="340" height="44" rx="16" class="g"/><rect x="150" y="108" width="340" height="16" class="g"/>
    ${T(172, 108, 'De: Banco Seguro &lt;premio@banco-premio.xyz&gt;', 'start', 'sm')}
    ${T(172, 154, 'Parabéns! Você ganhou R$ 5.000!', 'start', 'fg-b')}
    ${lines(172, 172, 280, 3, 16)}
    <rect x="172" y="230" width="170" height="38" rx="19" class="rd"/>${T(257, 254, 'CLIQUE AQUI', 'middle', 'fg-wt')}
    <g class="fg-hook"><path d="M420 -10v190a26 26 0 0 1-52 0v-12l14 14" class="fg-st d-s" fill="none" stroke-width="6"/></g>
    <g class="fg-pop" style="--d:.6s"><circle cx="540" cy="90" r="30" class="yl"/><path d="M540 74v20M540 104v.5" class="fg-st w-s" stroke-width="6"/></g>
    ${tag(110, 50, 'remetente estranho', .4)}${tag(560, 260, 'pressa e prêmio = golpe', .9)}`, 'E-mail falso de prêmio com um anzol: o golpe do phishing');

  /* site seguro x site falso */
  F.cadeado = () => S(`
    <rect x="40" y="60" width="560" height="70" rx="35" class="w fg-sh"/>
    <circle cx="86" cy="95" r="22" class="gr op2"/><g transform="translate(74 83)" class="fg-icon gr-s"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></g>
    ${T(120, 102, 'https://www.meubanco.com.br', 'start', 'fg-mono big')}
    <rect x="120" y="112" width="68" height="4" rx="2" class="gr fg-type"/>
    <rect x="40" y="190" width="560" height="70" rx="35" class="w fg-sh"/>
    <circle cx="86" cy="225" r="22" class="rd op2"/><g transform="translate(74 213)" class="fg-icon rd-s"><path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17h.01"/></g>
    ${T(120, 232, 'http://meubanco-premio.xyz', 'start', 'fg-mono big')}
    <g class="fg-pop" style="--d:.5s"><circle cx="560" cy="95" r="20" class="gr"/><path d="m551 95 6 6 12-12" class="fg-st w-s" fill="none" stroke-width="4"/></g>
    <g class="fg-pop" style="--d:.9s"><circle cx="560" cy="225" r="20" class="rd"/><path d="M552 217l16 16M568 217l-16 16" class="fg-st w-s" stroke-width="4"/></g>
    ${tag(320, 160, 'confira o cadeado e o endereço', .3)}${tag(320, 292, 'endereço esquisito: saia do site', .7)}`, 'Endereço de site seguro com cadeado comparado com um endereço falso');

  /* backup */
  F.backup = () => S(`
    <rect x="70" y="110" width="170" height="120" rx="12" class="d"/><rect x="82" y="122" width="146" height="90" rx="5" class="t"/><path d="M130 230h50l6 24h-62Z" class="g2"/>
    <path d="M440 170a50 50 0 0 1 8-99 70 70 0 0 1 134 18 44 44 0 0 1-2 81Z" class="tl"/><path d="M440 170a50 50 0 0 1 8-99 70 70 0 0 1 134 18 44 44 0 0 1-2 81Z" class="fg-st t-s" fill="none"/>
    <path d="M250 150C320 100 360 100 420 120" class="fg-ln fg-dash"/><path d="M420 160C360 200 320 200 250 180" class="fg-ln fg-dash"/>
    ${[0, 1, 2].map((i) => `<g><rect x="-10" y="-12" width="20" height="24" rx="3" class="w fg-sh"/><animateMotion dur="2.4s" begin="${i * .8}s" repeatCount="indefinite" path="M250 150C320 100 360 100 420 120"/></g>`).join('')}
    <rect x="460" y="230" width="46" height="70" rx="8" class="bl"/><rect x="470" y="210" width="26" height="22" rx="3" class="g2"/>
    ${tag(155, 280, 'seu computador', .2)}${tag(510, 60, 'nuvem', .5)}${tag(580, 280, 'pendrive / HD externo', .8)}`, 'Cópia de segurança indo do computador para a nuvem e para um pendrive');

  /* verificação em duas etapas */
  F.duasetapas = () => S(`
    <rect x="40" y="90" width="200" height="140" rx="16" class="w fg-sh"/>${T(140, 128, 'Senha', 'middle', 'fg-b')}
    <rect x="62" y="146" width="156" height="34" rx="10" class="g op5"/>${T(140, 169, '• • • • • • • •', 'middle', 'fg-b')}
    <rect x="62" y="190" width="156" height="26" rx="13" class="t"/>${T(140, 208, 'Entrar', 'middle', 'fg-wt sm')}
    <path d="M250 160h60" class="fg-ln fg-dash"/>
    <rect x="320" y="40" width="130" height="240" rx="24" class="d"/><rect x="330" y="64" width="110" height="192" rx="8" class="g"/>
    ${T(385, 120, 'Seu código', 'middle', 'sm')}<rect x="342" y="134" width="86" height="40" rx="10" class="w"/>${T(385, 161, '482 913', 'middle', 'fg-b fg-mono fg-blink')}
    <path d="M460 160h50" class="fg-ln fg-dash"/>
    <g class="fg-pop" style="--d:1s"><circle cx="560" cy="160" r="44" class="gr"/><path d="m540 160 14 14 26-28" class="fg-st w-s fg-draw" fill="none" stroke-width="8"/></g>
    ${tag(140, 60, '1ª etapa: a senha', .2)}${tag(385, 300, '2ª etapa: o código', .6)}${tag(560, 230, 'acesso liberado', 1)}`, 'Verificação em duas etapas: senha e código no celular');

  /* camadas do sistema operacional */
  F.camadas = () => S(`
    ${[['Você (usuário)', 'tl', 40], ['Programas e aplicativos', 'tl2', 104], ['Sistema operacional', 't', 168], ['Hardware (as peças)', 'd', 232]].map(([n, c, y], i) => `
      <g class="fg-pop" style="--d:${i * .25}s"><rect x="${120 + i * 0}" y="${y}" width="400" height="52" rx="14" class="${c}"/>${T(320, y + 32, n, 'middle', i > 1 ? 'fg-wt big' : 'big')}</g>`).join('')}
    <path d="M560 60v220" class="fg-ln fg-dash"/><path d="M80 280V60" class="fg-ln fg-dash"/>
    ${T(590, 170, 'ordens', 'middle', 'sm')}${T(50, 170, 'respostas', 'middle', 'sm')}`, 'Camadas: usuário, programas, sistema operacional e hardware');

  /* tipos de computador */
  F.dispositivos = () => S(`
    <g class="fg-float" style="--d:0s"><rect x="30" y="80" width="130" height="90" rx="8" class="d"/><rect x="38" y="88" width="114" height="70" rx="4" class="t"/><path d="M80 170h30l5 26h-40Z" class="g2"/></g>
    <g class="fg-float" style="--d:.4s"><rect x="190" y="100" width="120" height="78" rx="6" class="d"/><rect x="198" y="108" width="104" height="62" rx="3" class="t"/><path d="M178 178h144l-10 14H188Z" class="g2"/></g>
    <g class="fg-float" style="--d:.8s"><rect x="345" y="86" width="84" height="116" rx="10" class="d"/><rect x="352" y="94" width="70" height="98" rx="4" class="t"/></g>
    <g class="fg-float" style="--d:1.2s"><rect x="460" y="104" width="50" height="94" rx="10" class="d"/><rect x="465" y="114" width="40" height="74" rx="4" class="t"/></g>
    <g class="fg-float" style="--d:1.6s"><rect x="540" y="60" width="74" height="150" rx="8" class="d"/>${[0, 1, 2, 3].map((i) => `<rect x="550" y="${72 + i * 34}" width="54" height="24" rx="4" class="g2 op5"/><circle cx="560" cy="${84 + i * 34}" r="3" class="gr fg-blink" style="--d:${i * .3}s"/>`).join('')}</g>
    ${T(95, 236, 'Desktop', 'middle')}${T(250, 236, 'Notebook', 'middle')}${T(387, 236, 'Tablet', 'middle')}${T(485, 236, 'Celular', 'middle')}${T(577, 236, 'Servidor', 'middle')}`, 'Tipos de computador: desktop, notebook, tablet, celular e servidor');

  /* pesquisa */
  F.pesquisa = () => S(`
    <rect x="60" y="30" width="520" height="56" rx="28" class="w fg-sh"/>
    <g transform="translate(84 46)" class="fg-icon g-s"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/></g>
    <g class="fg-typing">${T(122, 65, 'receita de bolo de cenoura', 'start', 'big')}</g><rect x="440" y="48" width="2.5" height="22" class="d fg-blink"/>
    ${[0, 1, 2].map((i) => `<g class="fg-pop" style="--d:${1.2 + i * .3}s"><rect x="60" y="${108 + i * 68}" width="520" height="58" rx="12" class="w fg-sh"/>
      <rect x="80" y="${120 + i * 68}" width="200" height="6" rx="3" class="gr op5"/><rect x="80" y="${134 + i * 68}" width="${300 - i * 40}" height="9" rx="4" class="bl"/><rect x="80" y="${150 + i * 68}" width="440" height="5" rx="2.5" class="g"/></g>`).join('')}
    ${tag(520, 102, 'resultados', 1.2)}`, 'Caixa de pesquisa e a lista de resultados');

  /* redes sociais */
  F.redes = () => {
    const P = [[320, 160, 40, 't'], [170, 80, 26, 'bl'], [470, 80, 26, 'gr'], [150, 240, 26, 'yl'], [490, 240, 26, 'rd'], [320, 290, 20, 'bl']];
    return S(`
    ${P.slice(1).map(([x, y]) => `<path d="M320 160L${x} ${y}" class="fg-ln fg-dash"/>`).join('')}<path d="M170 80L470 80M150 240L320 290" class="fg-ln"/>
    ${P.map(([x, y, r, c], i) => `<g class="fg-pop" style="--d:${i * .15}s"><circle cx="${x}" cy="${y}" r="${r}" class="${c}"/><circle cx="${x}" cy="${y - r * .2}" r="${r * .32}" class="w op8"/><path d="M${x - r * .55} ${y + r * .6}a${r * .55} ${r * .5} 0 0 1 ${r * 1.1} 0" class="w op8"/></g>`).join('')}
    ${[[250, 120, 0], [400, 110, .9], [230, 220, 1.8], [420, 230, 2.6]].map(([x, y, d]) => `<g class="fg-heart" style="--d:${d}s"><path transform="translate(${x} ${y}) scale(1.1)" d="M12 20s-7.5-4.6-9-9.5C2 6.9 4.5 4 7.5 4c2 0 3.5 1.2 4.5 2.8C13 5.2 14.5 4 16.5 4c3 0 5.5 2.9 4.5 6.5-1.5 4.9-9 9.5-9 9.5Z" class="rd"/></g>`).join('')}`, 'Pessoas conectadas numa rede social, trocando curtidas');
  };

  /* lixeira */
  F.lixeira = () => S(`
    <rect x="80" y="60" width="200" height="200" rx="16" class="w fg-sh"/>${T(180, 92, 'Documentos', 'middle', 'fg-b')}
    <g class="fg-trash"><path d="M150 120h40l12 12v48h-52Z" class="bl"/>${T(176, 200, 'rascunho.docx', 'middle', 'sm')}</g>
    <g transform="translate(400 70)"><path d="M10 50h140l-12 160a14 14 0 0 1-14 12H36a14 14 0 0 1-14-12Z" class="g2"/><path d="M0 40h160" class="fg-st d-s" stroke-width="8"/><path d="M60 40V24h40v16" class="fg-st d-s" fill="none" stroke-width="6"/>
      <path d="M55 80v110M80 80v110M105 80v110" class="fg-st w-s op5" stroke-width="6"/></g>
    ${tag(480, 312, 'Lixeira: dá para restaurar', .3)}${tag(180, 290, 'arraste ou aperte Delete', .7)}`, 'Arquivo sendo levado para a Lixeira');

  /* liga e desliga */
  F.energia = () => S(`
    <circle cx="320" cy="160" r="100" class="tl fg-ring2"/><circle cx="320" cy="160" r="70" class="t"/>
    <path d="M320 112v44" class="fg-st w-s" stroke-width="12"/><path d="M290 130a44 44 0 1 0 60 0" class="fg-st w-s" fill="none" stroke-width="12"/>
    ${[['Desligar', 'rd', 110], ['Reiniciar', 'yl', 320], ['Suspender', 'bl', 530]].map(([n, c, x], i) => `<g class="fg-pop" style="--d:${.3 + i * .3}s"><rect x="${x - 70}" y="276" width="140" height="34" rx="17" class="${c}"/>${T(x, 298, n, 'middle', 'fg-wt')}</g>`).join('')}`, 'Botão de ligar e as opções desligar, reiniciar e suspender');

  /* lupa de acessibilidade */
  F.lupa = () => S(`
    <rect x="60" y="40" width="520" height="240" rx="16" class="w fg-sh"/>
    ${lines(90, 80, 460, 8, 22)}
    <g class="fg-mag"><circle cx="0" cy="0" r="62" class="w fg-sh"/><circle cx="0" cy="0" r="62" class="fg-st t-s" fill="none" stroke-width="8"/>
      <text x="0" y="12" text-anchor="middle" class="fg-huge">Aa</text><path d="M44 44l40 40" class="fg-st t-s" stroke-width="14"/></g>
    ${tag(320, 304, 'a Lupa aumenta o que está na tela', .3)}`, 'Lupa do Windows aumentando o texto da tela');

  window.HC_FIGS = F;
})();
