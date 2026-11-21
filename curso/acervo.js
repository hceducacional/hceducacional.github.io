/* =========================================================
   CONTEÚDO DE INFORMÁTICA — acervo do professor
   Catálogo de tudo o que as lições usam: os estilos de nível de digitação,
   os minijogos e as peças que aparecem em toda lição.

   Cada item tem um código (DG-01, MJ-01, PC-01…). Para mudar algo,
   basta pedir pelo código: o comportamento mora no motor (curso/licao.js),
   então a mudança vale em todos os módulos e lições onde o item aparece.
   Para montar lições novas, os itens daqui são as peças disponíveis.

   "Onde aparece" é calculado na hora, lendo os arquivos das lições.
   Só é baixado quando o card "Conteúdo de Informática" é aberto em Configurações.
   ========================================================= */
(() => {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* arquivos das lições prontas (se a plataforma já estiver carregada, a lista vem dela) */
  const LICOES_ARQ = ['curso/licao-01.js'];

  /* prévias desenhadas em HTML (leves, sem imagem) */
  const PREV = {
    typing: '<div class="av-pv av-pv-paper"><span class="ok">f</span><span class="ok">j</span><i></i><span class="ok">j</span><span class="cur">f</span><i></i><span>f</span><span>f</span><i></i><span>j</span><span>j</span><b class="av-pv-bar"><em></em></b></div>',
    nova: '<div class="av-pv av-pv-new"><small>É hora de aprender uma nova tecla!</small><strong>Pressione a tecla <kbd>F</kbd></strong></div>',
    apresenta: '<div class="av-pv av-pv-apr"><small>Novo desafio</small><strong>A sombra das palavras</strong><span>Pressione <kbd>Enter</kbd> para começar</span></div>',
    sombra: '<div class="av-pv av-pv-paper av-pv-ghost">' + [['b', 'f'], ['o', 'j'], ['m', 'j'], [' ', ' '], ['d', 'f'], ['i', 'j'], ['a', 'f']].map(([g, k], i) => (g === ' ' ? '<i></i>' : `<span class="${k === 'f' ? 'l' : 'r'}${i < 2 ? ' ok' : i === 2 ? ' cur' : ''}"><u>${g}</u>${k}</span>`)).join('') + '</div>',
    hacker: '<div class="av-pv av-pv-term"><em>Terminal de segurança</em><div><span>F</span><span class="on"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/></svg>␣</span><span>J</span></div></div>',
    fila: '<div class="av-pv av-pv-fila"><div><i style="--c:#34d399"></i><i style="--c:#a78bfa"></i><i style="--c:#fbbf24"></i></div><b style="--c:#34d399;--x:0;--y:2">F</b><b style="--c:#fbbf24;--x:2;--y:1">J</b><b style="--c:#a78bfa;--x:1;--y:0" class="on">␣</b></div>',
    estrelas: '<div class="av-pv av-pv-est"><i class="l"></i><span class="s1" style="--c:#7dd3fc"><b>sol</b></span><span class="s2" style="--c:#fde047"><b><u>pl</u>ano</b></span><span class="s3" style="--c:#f0abfc"><b>cometa</b></span><em>+60</em></div>',
    corrida: '<div class="av-pv av-pv-run"><i class="g"></i><span class="bot"><i></i><i></i></span><i class="laser"></i><b style="--lc:#a78bfa">␣</b><b style="--lc:#fbbf24;--x:1">J</b><em>Perfeito!</em></div>',
  };

  /* ---------- o acervo ---------- */
  const GRUPOS = [
    {
      id: 'dg', titulo: 'Níveis de digitação', sub: 'O aluno digita um texto; cada tecla certa avança e a errada não avança (com Backspace para voltar e corrigir).',
      itens: [
        {
          cod: 'DG-01', nome: 'Digitação simples', prev: 'typing',
          desc: 'O texto aparece numa folha clara com até 3 linhas visíveis, que sobem conforme o aluno avança. Letras certas ficam verdes, as que tiveram erro ficam laranja e a barra embaixo mostra o progresso.',
          como: ['Cada palavra fica inteira na mesma linha', 'Erro: a letra treme em vermelho e não avança', 'Backspace volta letra por letra (redigitar não dá pontos de novo)', 'Textos curtos (uma linha) ficam centralizados'],
          campos: [['texto', 'O que o aluno digita, ex.: "ff jj fj jf"'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !n.nova && !n.apresenta && !n.sombra,
          teste: { pick: 'longest' }, // o texto mais longo, para ver as linhas subindo
          info: (n) => `${n.texto.length} teclas`,
        },
        {
          cod: 'DG-02', nome: 'Tecla nova', prev: 'nova',
          desc: 'Antes de digitar, um painel colorido pede "Pressione a tecla F" com a tecla pulando. Ao achar, aparece "Você a encontrou!" e o aluno aperta Enter para começar o texto.',
          como: ['Usado na primeira vez que uma tecla aparece', 'Na apresentação, erros não contam', 'O teclado virtual (se aberto) acende a tecla nova'],
          campos: [['nova', 'A tecla apresentada (uma letra, ou " " para o espaço)'], ['texto', 'O texto de prática que vem depois']],
          match: (n) => n.tipo === 'typing' && n.nova != null,
          info: (n) => `tecla ${n.nova === ' ' ? 'Espaço' : n.nova.toUpperCase()}`,
        },
        {
          cod: 'DG-03', nome: 'Apresentação de desafio', prev: 'apresenta',
          desc: 'Um cartão explica um jeito novo de treinar antes do nível começar (por exemplo, "A sombra das palavras"), com um exemplo animado. O aluno aperta Enter para começar.',
          como: ['Aparece uma vez, no primeiro nível do desafio novo', 'Pode mostrar um exemplo com as letras e as mãos'],
          campos: [['apresenta.tag', 'Etiqueta pequena (ex.: "Novo desafio")'], ['apresenta.titulo', 'Título do cartão'], ['apresenta.texto', 'Explicação'], ['apresenta.exemplo', 'Exemplo animado (opcional)']],
          match: (n) => n.tipo === 'typing' && !!n.apresenta,
          info: (n) => n.apresenta.titulo,
        },
        {
          cod: 'DG-04', nome: 'Sombra das palavras', prev: 'sombra',
          desc: 'Com poucas teclas não dá para escrever palavras, mas dá para digitar o ritmo delas: cada letra de uma frase real vira F (mão esquerda) ou J (mão direita). A frase aparece em cima de cada tecla.',
          como: ['A letra da frase em amarelo = mão esquerda, em azul = mão direita', 'Já ensina de que lado fica cada letra (prepara as próximas lições)', 'Frases crescem até virar textos longos'],
          campos: [['frase', 'A frase de verdade (o texto F/J é gerado sozinho)'], ['dica', 'A frase da faixa "Dica"']],
          match: (n) => n.tipo === 'typing' && !!n.sombra,
          teste: { pick: (n) => !n.apresenta },
          info: (n) => `“${n.frase.length > 34 ? n.frase.slice(0, 32) + '…' : n.frase}”`,
        },
      ],
    },
    {
      id: 'mj', titulo: 'Minijogos', sub: 'Desafios entre os níveis de texto: reflexo, ritmo e precisão com as teclas da lição.',
      itens: [
        {
          cod: 'MJ-01', nome: 'Varredura Hacker', prev: 'hacker',
          desc: 'Um terminal de radar mostra as teclas da lição como nós; uma delas acende com um anel de tempo em volta. O aluno tecla a tecla acesa antes de o anel acabar. Tem vidas, ameaças com tempos diferentes e, se as vidas acabarem, dá para reviver com o Saldo HC e continuar de onde parou.',
          como: [
            'Ameaças Normal, ⚡ Rápida (0,6× o tempo) e Lenta (1,45×); numa sequência de acertos as rápidas aparecem mais',
            'Vidas (padrão 3): o tempo acabar custa uma vida; tecla errada só encurta o tempo da ameaça',
            'Depois de perder uma vida vêm duas ameaças lentas, para respirar',
            'Sem vidas: “Sistema invadido!” → reviver com o Saldo HC (15,00, e o dobro a cada nova vez no mesmo nível) ou recomeçar do zero',
            'Ao reviver, uma animação transfere as moedas do saldo para o sistema e recarrega as vidas',
            'É o primeiro lugar onde o aluno gasta as moedas do Saldo HC (também no Testar: o saldo é descontado de verdade)',
          ],
          campos: [['meta', 'Quantos acertos para vencer'], ['velocidade', 'Ritmo do desafio (1,6 = calmo … 3,2 = muito rápido)'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'hacker',
          info: (n) => `meta ${n.meta} · vel. ${String(n.velocidade).replace('.', ',')}`,
        },
        {
          cod: 'MJ-02', nome: 'Fila de Ancoragem', prev: 'fila',
          desc: 'Um porto à noite: contêineres coloridos caem pelas colunas (uma por tecla) rumo à doca. O de baixo é o primeiro da fila e o aluno tecla a tecla dele para ancorá-lo. Se um contêiner bater na doca, ela sofre um dano e o aluno perde uma vida.',
          como: [
            'A queda acelera conforme a fila avança (de 4,2 s até 2,3 s da entrada à doca); o selo no topo mostra a velocidade',
            'De vez em quando chega uma rajada de 3 contêineres colados',
            'Combo: acertos seguidos acendem o contador (amarelo a partir de 3, rosa a partir de 10); tecla errada zera o combo, mas não tira vida',
            'O primeiro da fila tem uma seta e fica vermelho perto da doca',
            'Vidas (padrão 3); depois de um dano, 2,5 s em câmera lenta',
            'Sem vidas: “Doca danificada!” → reviver com o Saldo HC (mesma regra e animação do MJ-01) ou recomeçar do zero',
          ],
          campos: [['meta', 'Quantos contêineres o aluno precisa ancorar'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'fila',
          info: (n) => `meta ${n.meta}`,
        },
        {
          cod: 'MJ-03', nome: 'Corrida das Teclas', prev: 'corrida',
          desc: 'Um robozinho corre por uma pista à noite e vírus de computador, cada um com uma tecla, vêm na direção dele. Quando o vírus entra na faixa verde em frente ao robô, o aluno tecla a tecla do vírus e o robô o elimina com um laser. Quanto mais perto do robô, melhor a nota. Substituiu o antigo Eco da Memória.',
          como: [
            'Acertou: o robô dispara o laser e o vírus estoura em luz; notas Perfeito, Ótimo ou Bom e combo nos acertos seguidos',
            'Teclar antes da faixa é “Cedo demais” e a tecla errada zera o combo (nenhum dos dois tira vida)',
            'Se o vírus chegar ao robô, ele é infectado e perde uma vida; depois vêm 2,5 s mais devagar',
            'A corrida acelera com o progresso (de 4,0 s até 2,2 s para o vírus cruzar a pista) e às vezes vêm vírus em dupla',
            'O contador mostra os metros percorridos',
            'Sem vidas: “Robô infectado!” → reviver com o Saldo HC (mesma regra e animação do MJ-01 e MJ-02) ou recomeçar do zero',
          ],
          campos: [['meta', 'Quantos vírus o aluno precisa eliminar'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'corrida',
          info: (n) => `meta ${n.meta}`,
        },
        {
          cod: 'MJ-04', nome: 'Palavras das Estrelas', prev: 'estrelas',
          desc: 'Um céu noturno com nebulosas: estrelas surgem, cada uma com uma palavra e um anel de tempo em volta. O aluno digita a palavra antes de o anel acabar; a estrela explode em faíscas, um cometa leva os pontos ao placar e fica um ponto de luz no céu, ligado aos anteriores, formando a constelação do aluno. Palavras mais longas valem mais.',
          como: [
            'A primeira letra escolhe a estrela (se duas começarem igual, vai a que tem menos tempo, e a letra seguinte troca para a outra se for dela); as letras certas ficam verdes',
            'Backspace solta a estrela escolhida para trocar de palavra; letra errada zera o combo, mas não tira vida',
            'Três tipos pelo tamanho: azul (até 4 letras), dourada (5–6) e Supernova (7 ou mais, maior e com 8 pontas)',
            'Pontos: 10 por letra × o combo (+10% a cada estrela seguida, até ×2) e +50% (“Rápido!”) se pegar com mais da metade do tempo',
            'O céu enche com o progresso (de 2 até 4 estrelas ao mesmo tempo), o tempo de cada estrela encurta e as palavras ficam mais longas',
            'Se o anel acabar, a estrela cai apagada e o aluno perde uma vida; depois vêm 2,5 s mais calmos',
            'Sem vidas: “O céu escureceu!” → reviver com o Saldo HC (mesma regra e animação dos outros minijogos) ou recomeçar do zero',
            'Só usa palavras escritas com as teclas que a lição já ensinou; com poucas teclas (ex.: só F e J), as palavras viram sequências como “fjf” e “jjff”',
          ],
          campos: [['meta', 'Quantas estrelas o aluno precisa capturar'], ['palavras', 'Lista de palavras (opcional; sem ela, usa o banco do jogo)'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'estrelas',
          // ainda não está em nenhuma lição: o teste usa o alfabeto inteiro e um nível de exemplo
          teste: { teclas: 'abcdefghijklmnopqrstuvwxyz'.split(''), nivel: { tipo: 'estrelas', titulo: 'Minijogo: Palavras das Estrelas', dica: 'Digite a palavra de uma estrela antes que o anel acabe. Palavras longas valem mais, e Backspace troca de estrela.', meta: 15 } },
          info: (n) => `meta ${n.meta}`,
        },
      ],
    },
    {
      id: 'pc', titulo: 'Peças de toda lição', sub: 'Aparecem em todas as lições, em volta dos níveis. Mudou aqui, muda em todas.',
      itens: [
        { cod: 'PC-01', nome: 'Barra de estrelas', icon: 'star', desc: 'A barra vertical à esquerda que enche com os pontos do nível. Tem 5 estrelas e as conquistas Superstar (azul) e Megastar (roxa), com feixes subindo na reta final.' },
        { cod: 'PC-02', nome: 'Medidor de velocidade', icon: 'clock', desc: 'Embaixo do cartão: a tecla com a logo do HC cresce e muda de cor (branca → amarela → laranja → vermelha), a barra enche com a cor do estágio e, a partir de Rápido, um reflexo corre por ela. Estágios: Velocidade, Aquecendo (10 PPM), Rápido (22) e Pegando fogo (35). Versão leve: só efeitos que a placa de vídeo faz sozinha, sem pesar na digitação.' },
        { cod: 'PC-03', nome: 'Teclado virtual', icon: 'monitor', desc: 'Janela suspensa embaixo da tela que só abre pelo botão "Ver teclado virtual". Cores por dedo, a próxima tecla acesa, o dedo certo escrito em cima e fecha sozinha em 10 s (barrinha de tempo, × ou Esc).' },
        { cod: 'PC-04', nome: 'Nível concluído', icon: 'check', desc: 'A medalha com o número do nível é "apertada" e solta ondas de radar; frase de comemoração letra por letra, pontos contando, tempo no nível e o quadro "A seguir" com a barra da lição.' },
        { cod: 'PC-05', nome: 'Tela de XP e patentes', icon: 'trophy', teste: { auto: 'xp' }, desc: 'No fim da lição: "Você está subindo de nível!", o aro de XP enchendo, a patente atual (25 patentes) e a próxima.' },
        { cod: 'PC-06', nome: 'Resultado e Saldo HC', icon: 'party', teste: { auto: 'moedas' }, desc: 'A tela final com estrelas, pontuação e recorde. As moedas voam das estrelas para o Saldo HC: 35,27 por estrela, +87,76 no Superstar e +97,43 no Megastar. O saldo pode ser gasto para reviver nos minijogos com vidas (MJ-01 a MJ-04).' },
        { cod: 'PC-07', nome: 'Cenários de cor', icon: 'sun', desc: 'Cada vez que a lição começa, um cenário é sorteado (Aurora boreal, Oceano profundo, Pôr do sol, Galáxia, Lavanda, Coral, Meia-noite) e pinta o cartão, as formas flutuantes, a folha e o teclado.' },
        { cod: 'PC-08', nome: 'Suporte (pular nível)', icon: 'lock', desc: 'O cadeado no topo do nível: com a senha do suporte, o professor escolhe "Ir para…" qualquer nível ou o resultado. Administradores já entram liberados.' },
      ],
    },
  ];

  /* ---------- lê as lições para saber onde cada item aparece ---------- */
  const loaded = {};
  const load = (file) => loaded[file] ||= new Promise((ok) => {
    const sc = Object.assign(document.createElement('script'), { src: `${file}?v=${window.HC_V || ''}` });
    sc.onload = ok; sc.onerror = ok; document.body.append(sc);
  });
  async function lessons() {
    let arq = LICOES_ARQ, nomes = {};
    try { // a lista oficial, se a plataforma já foi aberta nesta visita
      // eslint-disable-next-line no-undef
      const mods = typeof HC_CURSO !== 'undefined' ? HC_CURSO.modulos : null;
      if (mods) { arq = []; mods.forEach((m) => m.licoes.forEach((l) => { if (l.arquivo) { arq.push(l.arquivo); nomes[l.arquivo] = m.nome; } })); }
    } catch {}
    await Promise.all(arq.map(load));
    return Object.values(window.HC_LICOES || {}).sort((a, b) => a.numero.localeCompare(b.numero));
  }

  /* código do acervo de cada nível de uma lição (para o mapa das lições) */
  const ALL = GRUPOS.flatMap((g) => g.itens.map((it) => Object.assign(it, { g: g.id })));
  const codesOf = (n) => ALL.filter((it) => it.match && it.match(n)).map((it) => it.cod);
  const countOf = (item, list) => (item.match ? list.reduce((s, L) => s + L.niveis.filter(item.match).length, 0) : null);
  const prevOf = (it) => (it.prev ? PREV[it.prev] : `<span class="av-ico"><i data-icon="${it.icon}"></i></span>`);

  /* "onde aparece": uma linha por lição, um chip por nível */
  function usage(item, list) {
    if (!item.match) return '<p class="av-note">Aparece em todas as lições, em volta dos níveis.</p>';
    const rows = list.map((L) => {
      const hits = L.niveis.map((n, i) => [n, i]).filter(([n]) => item.match(n));
      if (!hits.length) return '';
      return `<div class="av-use-row"><b>Lição ${esc(L.numero)}<small>${esc(L.titulo)}</small></b><span>${hits.map(([n, i]) => `<em title="${esc(n.titulo)}"><strong>Nível ${i + 1}</strong>${item.info ? esc(item.info(n)) : ''}</em>`).join('')}</span></div>`;
    }).join('');
    return rows || '<p class="av-note">Ainda não usado em nenhuma lição.</p>';
  }

  /* cartão pequeno da lista (esquerda) */
  const cardHTML = (it, list, on) => {
    const c = countOf(it, list);
    return `<button type="button" class="av-card${on ? ' on' : ''}" data-it="${it.cod}" aria-pressed="${on}">
      <span class="av-card-prev">${prevOf(it)}</span>
      <span class="av-card-txt"><span class="av-cod">${it.cod}</span><strong>${esc(it.nome)}</strong><small>${c == null ? 'Em todas as lições' : `${c} ${c === 1 ? 'nível' : 'níveis'}`}</small></span>
    </button>`;
  };

  /* card grande da lista (como os de "Mantenha-se conectado"): capa animada, resumo e "Acessar" */
  const KICK = { dg: 'Nível de digitação', mj: 'Minijogo', pc: 'Peça de toda lição' };
  const resumo = (t) => { const i = t.indexOf('. '); return i > 0 && i < 170 ? t.slice(0, i + 1) : t.length > 170 ? t.slice(0, 168) + '…' : t; };
  const tileHTML = (it, list) => {
    const c = countOf(it, list);
    return `
      <a class="av-tile" data-g="${it.g}" href="#config/informatica/${it.cod}" aria-label="${esc(it.nome)}: acessar">
        <span class="av-tile-cover" aria-hidden="true"><span class="av-tile-art">${prevOf(it)}</span></span>
        <span class="av-tile-txt">
          <small>${KICK[it.g]} · ${it.cod}</small>
          <strong>${esc(it.nome)}</strong>
          <span>${esc(resumo(it.desc))}</span>
        </span>
        <span class="av-tile-bar">
          <span class="av-tile-ico">${it.cod.slice(0, 2)}</span>
          <span class="av-tile-who"><b>${esc(it.nome)}</b><small>${c == null ? 'Em todas as lições' : `${c} ${c === 1 ? 'nível' : 'níveis'} nas lições`}</small></span>
          <span class="av-tile-go">Acessar</span>
        </span>
      </a>`;
  };

  /* lições: capa (as teclas da lição + uma barrinha por nível) e card no mesmo estilo dos itens */
  const lessonStats = (L) => { const g = L.niveis.filter((n) => n.tipo !== 'typing').length; return { tot: L.niveis.length, games: g, typing: L.niveis.length - g }; };
  const lessonCover = (L) => `<div class="av-pv av-pv-lesson"><div class="keys">${L.teclas.map((k) => `<kbd>${k === ' ' ? 'Espaço' : esc(k.toUpperCase())}</kbd>`).join('')}</div><div class="segs">${L.niveis.map((n, i) => `<i class="${n.tipo === 'typing' ? 'd' : 'm'}" style="--i:${i}"></i>`).join('')}</div></div>`;
  const lessonTile = (L) => {
    const st = lessonStats(L);
    return `
      <a class="av-tile" data-g="ls" href="#config/informatica/${esc(L.id)}" aria-label="Lição ${esc(L.numero)}: acessar">
        <span class="av-tile-cover" aria-hidden="true"><span class="av-tile-art">${lessonCover(L)}</span></span>
        <span class="av-tile-txt">
          <small>Lição ${esc(L.numero)} · ${st.tot} níveis</small>
          <strong>${esc(L.titulo)}</strong>
          <span>${esc(resumo(L.intro || ''))}</span>
        </span>
        <span class="av-tile-bar">
          <span class="av-tile-ico">${esc(L.numero)}</span>
          <span class="av-tile-who"><b>Lição ${esc(L.numero)}</b><small>${st.typing} de digitação · ${st.games} minijogos</small></span>
          <span class="av-tile-go">Acessar</span>
        </span>
      </a>`;
  };

  /* detalhes do item escolhido (direita), em blocos separados */
  function detailHTML(it, list) {
    const c = countOf(it, list);
    return `
      <div class="av-det-top">
        <div class="av-det-prev">${prevOf(it)}</div>
        <div class="av-det-head">
          <div class="av-det-tags"><span class="av-cod">${it.cod}</span>${c != null ? `<span class="av-count">${c} ${c === 1 ? 'nível' : 'níveis'}</span>` : '<span class="av-count">Todas as lições</span>'}</div>
          <h3>${esc(it.nome)}</h3>
          <p>${esc(it.desc)}</p>
          <div class="av-det-act">
            <a class="av-test" href="#config/informatica/teste/${it.cod}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>Testar</a>
            <p class="av-ask">Para mudar: peça <b>“no ${it.cod}, …”</b></p>
          </div>
          ${it.teste?.auto ? `<p class="av-test-note">O teste abre um nível curto e já mostra ${it.teste.auto === 'xp' ? 'a tela de XP' : 'a tela final com as moedas'} (nada é salvo).</p>` : ''}
        </div>
      </div>
      <div class="av-blocks">
        ${it.como ? `<section class="av-block"><h4><i data-icon="check"></i>Como funciona</h4><ul class="av-how">${it.como.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}
        ${it.campos ? `<section class="av-block"><h4><i data-icon="settings"></i>Ajustes de cada nível</h4><dl class="av-fields">${it.campos.map(([k, v]) => `<dt><code>${esc(k)}</code></dt><dd>${esc(v)}</dd>`).join('')}</dl></section>` : ''}
        <section class="av-block wide"><h4><i data-icon="grid"></i>Onde aparece</h4>${usage(it, list)}</section>
      </div>`;
  }

  const TABS = [...GRUPOS.map((g) => ({ id: g.id, nome: g.titulo, n: g.itens.length })), { id: 'mapa', nome: 'Mapa das lições', n: null }];
  const mem = { get: (k, d) => { try { return localStorage.getItem('hc-av-' + k) || d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem('hc-av-' + k, v); } catch {} } };

  async function render(box, paint = () => {}) {
    box.innerHTML = '<p class="av-loading">Carregando o acervo…</p>';
    const list = await lessons();
    const tot = list.reduce((s, L) => s + L.niveis.length, 0);
    const games = list.reduce((s, L) => s + L.niveis.filter((n) => n.tipo !== 'typing').length, 0);
    let tab = mem.get('tab', 'dg'); if (!TABS.some((t) => t.id === tab)) tab = 'dg';

    box.innerHTML = `
      <div class="av">
        <div class="av-hero">
          <div>
            <strong>Acervo do professor</strong>
            <p>Tudo o que as lições usam, num lugar só. Para mudar um minijogo ou um estilo de nível, peça pelo código (ex.: <b>“mude o MJ-01”</b>): a mudança vale em todas as lições e módulos onde ele aparece. Para montar lições novas, escolha as peças daqui.</p>
          </div>
          <div class="av-stats">
            <span><b>${list.length}</b>${list.length === 1 ? 'lição pronta' : 'lições prontas'}</span>
            <span><b>${tot}</b>níveis</span>
            <span><b>${tot - games}</b>de digitação</span>
            <span><b>${games}</b>minijogos</span>
          </div>
        </div>
        <nav class="av-tabs" role="tablist" aria-label="Seções do acervo">${TABS.map((t) => `<button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id === tab}">${esc(t.nome)}${t.n != null ? `<i>${t.n}</i>` : ''}</button>`).join('')}</nav>
        <div class="av-pane" id="av-pane"></div>
      </div>`;
    const pane = box.querySelector('#av-pane');

    function show() {
      box.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab));
      if (tab === 'mapa') {
        pane.className = 'av-pane';
        pane.dataset.g = 'ls';
        pane.innerHTML = `<p class="av-pane-sub">As lições prontas. Abra uma para ver cada nível com o código do acervo; as próximas lições aparecem aqui assim que forem montadas.</p>
          ${list.length ? `<div class="av-tiles">${list.map(lessonTile).join('')}</div>` : '<p class="av-note">Nenhuma lição pronta ainda.</p>'}`;
      } else {
        const g = GRUPOS.find((x) => x.id === tab);
        pane.className = 'av-pane';
        pane.dataset.g = g.id;
        pane.innerHTML = `
          <p class="av-pane-sub">${esc(g.sub)}</p>
          <div class="av-tiles">${g.itens.map((x) => tileHTML(x, list)).join('')}</div>`;
      }
      paint(pane);
    }
    const go = (cod) => { if (ALL.some((x) => x.cod === cod)) location.hash = `#config/informatica/${cod}`; };
    box.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]');
      if (t) { tab = t.dataset.tab; mem.set('tab', tab); return show(); }
      const m = e.target.closest('[data-go]'); if (m) go(m.dataset.go);
    });
    show();
  }

  /* ---------- página de um item (Configurações › Conteúdo de Informática › MJ-03) ---------- */
  async function renderItem(box, cod, paint = () => {}) {
    box.innerHTML = '<p class="av-loading">Carregando…</p>';
    const list = await lessons();
    const L = list.find((x) => x.id === cod);
    if (L) return lessonPage(box, L, list, paint);
    const it = ALL.find((x) => x.cod === cod);
    if (!it) { box.innerHTML = '<p class="av-note">Item não encontrado no acervo.</p>'; return false; }
    const g = GRUPOS.find((x) => x.id === it.g), irmaos = g.itens.filter((x) => x !== it);
    try { localStorage.setItem('hc-av-tab', it.g); } catch {}
    box.innerHTML = `
      <div class="av av-item-page" data-g="${it.g}">
        <section class="av-ip-hero">
          <div class="av-ip-cover" aria-hidden="true"><span class="av-tile-art">${prevOf(it)}</span></div>
          <div class="av-ip-head">
            <small class="av-ip-kick">${KICK[it.g]}</small>
            <h2>${esc(it.nome)}</h2>
            <div class="av-det-tags"><span class="av-cod">${it.cod}</span>${countOf(it, list) != null ? `<span class="av-count">${countOf(it, list)} ${countOf(it, list) === 1 ? 'nível' : 'níveis'}</span>` : '<span class="av-count">Todas as lições</span>'}</div>
            <p class="av-ip-desc">${esc(it.desc)}</p>
            <div class="av-det-act">
              <a class="av-test" href="#config/informatica/teste/${it.cod}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>Testar</a>
              <p class="av-ask">Para mudar: peça <b>“no ${it.cod}, …”</b></p>
            </div>
            ${it.teste?.auto ? `<p class="av-test-note">O teste abre um nível curto e já mostra ${it.teste.auto === 'xp' ? 'a tela de XP' : 'a tela final com as moedas'} (nada é salvo).</p>` : ''}
          </div>
        </section>
        <div class="av-blocks">
          ${it.como ? `<section class="av-block"><h4><i data-icon="check"></i>Como funciona</h4><ul class="av-how">${it.como.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}
          ${it.campos ? `<section class="av-block"><h4><i data-icon="settings"></i>Ajustes de cada nível</h4><dl class="av-fields">${it.campos.map(([k, v]) => `<dt><code>${esc(k)}</code></dt><dd>${esc(v)}</dd>`).join('')}</dl></section>` : ''}
          <section class="av-block wide"><h4><i data-icon="grid"></i>Onde aparece</h4>${usage(it, list)}</section>
        </div>
        ${irmaos.length ? `<section class="av-more"><h3>Outros: ${esc(g.titulo.toLowerCase())}</h3><div class="av-tiles">${irmaos.map((x) => tileHTML(x, list)).join('')}</div></section>` : ''}
      </div>`;
    paint(box);
    return it;
  }

  /* página de uma lição: resumo, composição (quantos níveis de cada código) e o mapa dos níveis */
  function lessonPage(box, L, list, paint) {
    const st = lessonStats(L);
    const comp = {}; L.niveis.forEach((n) => codesOf(n).forEach((c) => { comp[c] = (comp[c] || 0) + 1; }));
    try { localStorage.setItem('hc-av-tab', 'mapa'); } catch {}
    box.innerHTML = `
      <div class="av av-item-page" data-g="ls">
        <section class="av-ip-hero">
          <div class="av-ip-cover" aria-hidden="true"><span class="av-tile-art">${lessonCover(L)}</span></div>
          <div class="av-ip-head">
            <small class="av-ip-kick">Lição ${esc(L.numero)}</small>
            <h2>${esc(L.titulo)}</h2>
            <div class="av-det-tags"><span class="av-cod">${st.tot} níveis</span><span class="av-count">${st.typing} de digitação</span><span class="av-count">${st.games} minijogos</span></div>
            <p class="av-ip-desc">${esc(L.intro || '')}</p>
            <div class="av-det-act">
              <a class="av-test" href="#informatica/${esc(L.id)}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>Abrir a lição</a>
              <p class="av-ask">A lição de verdade, como o aluno vê (o progresso é salvo)</p>
            </div>
          </div>
        </section>
        <div class="av-blocks">
          <section class="av-block wide"><h4><i data-icon="grid"></i>Composição da lição</h4>
            <div class="av-comp">${Object.entries(comp).sort((a, b) => a[0].localeCompare(b[0])).map(([c, n]) => { const it = ALL.find((x) => x.cod === c); return `<a class="av-comp-i g-${it.g}" href="#config/informatica/${c}"><span class="av-cod">${c}</span><b>${esc(it.nome)}</b><em>×${n}</em></a>`; }).join('')}</div>
          </section>
          <section class="av-block wide"><h4><i data-icon="check"></i>Os ${st.tot} níveis, em ordem</h4>
            <ol class="av-map-list">${L.niveis.map((n, i) => {
              const cs = codesOf(n), g = cs[0]?.slice(0, 2).toLowerCase();
              return `<li class="g-${g}"><span class="av-map-n">${i + 1}</span><span class="av-map-t">${esc(n.titulo)}</span><span class="av-map-c">${cs.map((x) => `<a href="#config/informatica/${x}">${x}</a>`).join('')}</span></li>`;
            }).join('')}</ol>
          </section>
        </div>
        ${list.length > 1 ? `<section class="av-more"><h3>Outras lições</h3><div class="av-tiles">${list.filter((x) => x !== L).map(lessonTile).join('')}</div></section>` : ''}
      </div>`;
    paint(box);
    return L;
  }

  /* ---------- teste: monta uma lição curta só com o item escolhido ---------- */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const CURTO = { tipo: 'typing', titulo: 'Nível de teste', dica: 'Um nível curto só para ver as peças da lição funcionando.', texto: 'ff jj fj jf ffj jjf fjf jfj' };
  async function testLesson(cod) {
    const it = ALL.find((x) => x.cod === cod); if (!it) return null;
    const list = await lessons();
    const base = list[0];
    let niveis;
    if (it.match) {
      let hits = list.flatMap((L) => L.niveis).filter(it.match);
      const p = it.teste?.pick;
      if (typeof p === 'function' && hits.some(p)) hits = hits.filter(p);
      const lv = p === 'longest' ? hits.reduce((a, b) => ((b.texto || '').length > (a.texto || '').length ? b : a), hits[0]) : hits[0];
      niveis = lv ? [clone(lv)] : [clone(it.teste?.nivel || CURTO)];
    } else niveis = [clone(CURTO)];
    const L = { id: `teste-${cod}`, numero: '00', titulo: `${cod} · ${it.nome}`, teclas: it.teste?.teclas || base?.teclas || ['f', ' ', 'j'], intro: '', cards: [], niveis };
    return { L, meta: { teste: { cod, nome: it.nome, voltar: `#config/informatica/${cod}`, auto: it.teste?.auto } } };
  }

  window.HC_acervo = { render, renderItem, testLesson, GRUPOS, has: (cod) => ALL.some((x) => x.cod === cod) };
})();
