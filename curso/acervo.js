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
  const LICOES_ARQ = ['curso/licao-01.js', 'curso/licao-02.js'];

  /* prévias desenhadas em HTML (leves, sem imagem) */
  const PREV = {
    typing: '<div class="av-pv av-pv-paper"><span class="ok">f</span><span class="ok">j</span><i></i><span class="ok">j</span><span class="cur">f</span><i></i><span>f</span><span>f</span><i></i><span>j</span><span>j</span><b class="av-pv-bar"><em></em></b></div>',
    nova: '<div class="av-pv av-pv-new"><small>É hora de aprender uma nova tecla!</small><strong>Pressione a tecla <kbd>F</kbd></strong></div>',
    sombra: '<div class="av-pv av-pv-paper av-pv-ghost">' + [['b', 'f'], ['o', 'j'], ['m', 'j'], [' ', ' '], ['d', 'f'], ['i', 'j'], ['a', 'f']].map(([g, k], i) => (g === ' ' ? '<i></i>' : `<span class="${k === 'f' ? 'l' : 'r'}${i < 2 ? ' ok' : i === 2 ? ' cur' : ''}"><u>${g}</u>${k}</span>`)).join('') + '</div>',
    hacker: '<div class="av-pv av-pv-term"><em>Terminal de segurança</em><div><span>F</span><span class="on"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/></svg>␣</span><span>J</span></div></div>',
    fila: '<div class="av-pv av-pv-fila"><div><i style="--c:#34d399"></i><i style="--c:#a78bfa"></i><i style="--c:#fbbf24"></i></div><b style="--c:#34d399;--x:0;--y:2">F</b><b style="--c:#fbbf24;--x:2;--y:1">J</b><b style="--c:#a78bfa;--x:1;--y:0" class="on">␣</b></div>',
    estrelas: '<div class="av-pv av-pv-est"><i class="l"></i><span class="s1" style="--c:#7dd3fc"><b>sol</b></span><span class="s2" style="--c:#fde047"><b><u>pl</u>ano</b></span><span class="s3" style="--c:#f0abfc"><b>cometa</b></span><em>+60</em></div>',
    nave: '<div class="av-pv av-pv-nv"><i class="st"></i><span class="r1"><b><u>pl</u>ano</b></span><span class="r2 g"><small>4×</small><b>cliente</b></span><span class="r3"><b>jogo</b></span><i class="beam"></i><i class="ship"></i><em>00000068</em></div>',
    gp: '<div class="av-pv av-pv-gp">' + [['Byte', '167, 139, 250', 58], ['Pixel', '244, 114, 182', 40], ['Você', '56, 189, 248', 66]].map(([n, c, x], i) => `<span class="ln" style="--i:${i};--bc:${c}"><b style="--x:${x}%"><u>${i === 2 ? 1 : i + 2}</u>${n}</b></span>`).join('') + '<p><s>O beija-</s><i>f</i>lor bate as asas</p></div>',
    baloes: '<div class="av-pv av-pv-bl">' + [['f', '#f43f5e', 18, 30], ['d', '#f59e0b', 42, 24], ['j', '#a855f7', 66, 32], ['k', '#3b82f6', 90, 26]].map(([k, c, x, y], i) => `<span class="b${i === 1 ? ' nx' : ''}" style="--bc:${c};left:${x}%;top:${y}%"><b>${k}</b></span>`).join('') + '<span class="bot"></span><i class="sea"></i></div>',
    mouse: '<div class="av-pv av-pv-ms"><i class="bar"></i><span class="it v" style="left:22%;top:34%"><i></i><small>Clique</small></span><span class="it f" style="left:52%;top:26%"><i></i><small>Botão direito</small></span><span class="it d" style="left:40%;top:66%"><i></i><small>Arraste</small></span><i class="fd"></i><i class="cur"></i></div>',
    saltos: '<div class="av-pv av-pv-sr"><i class="city"></i><i class="gr"></i><span class="hero"></span><i class="fw"></i><p>' + [...'rede'].map((c, i) => `<i class="${i < 2 ? 'ok' : i === 2 ? 'at' : ''}">${c}</i>`).join('') + '</p></div>',
    resgate: '<div class="av-pv av-pv-rs"><i class="gr"></i><span class="ship"><i class="beam"></i></span>' + [['f', '#34d399', 26, 'up'], ['j', '#a78bfa', 56, ''], ['k', '#fbbf24', 80, '']].map(([k, c, x, cl]) => `<b class="${cl}" style="--kc:${c};left:${x}%">${k}</b>`).join('') + '<i class="portal"></i></div>',
    duelo: '<div class="av-pv av-pv-du"><p>' + [...'efeitos'].map((c, i) => `<i class="${i < 2 ? 'ok' : i === 2 ? 'cur' : ''}">${c}</i>`).join('') + '</p><i class="plat"></i><span class="hero"></span><i class="orb"></i><span class="mon"><b></b></span></div>',
    esteira: '<div class="av-pv av-pv-kf">' + [[0, ' ', 0, 6], [1, 'j', 1.5, 1, '#fef08a'], [2, 'f', -1.5, 1, '#a5f3fc'], [3, 'k', 2.5, 1, '#fbcfe8'], [4, 'd', -2.5, 1, '#fecdd3']].map(([k, c, x, w, bg]) => `<i class="ln" style="--k:${k}"></i><b style="--k:${k};--x:${x};--w:${w}${bg ? `;--bg:${bg}` : ''}"${k === 0 ? ' class="cur"' : ''}>${c === ' ' ? '' : c}</b>`).join('') + '</div>',
    cartoes: '<div class="av-pv av-pv-cd"><span class="c p">asa<b>✓</b></span><span class="c on"><u>fa</u><i>l</i>a<em>␣</em></span><span class="c n">sala</span></div>',
    quadro: '<div class="av-pv av-pv-qd"><div class="pic">' + Array.from({ length: 24 }, (_, i) => `<i class="${[0, 3, 4, 8, 9, 10, 14, 15, 19, 21].includes(i) ? '' : 'off'}" style="--d:${(i * 97) % 2000}ms"></i>`).join('') + '</div><p><u>fala a</u><i>s</i>ala</p></div>',
    trilha: '<div class="av-pv av-pv-tr"><i class="bank"></i>' + [...'fala da'].map((c, i) => `<span class="${c === ' ' ? 'ly' : ''}${i < 2 ? ' ok' : i === 2 ? ' cur' : ''}" style="left:${18 + i * 11}%;--y:${Math.round(Math.sin(i * .9) * 12)}px">${c === ' ' ? '' : c}</span>`).join('') + '<b class="bot"></b></div>',
    torre: '<div class="av-pv av-pv-to"><i class="arm"></i><span class="hk"><b style="--h:94">d</b></span><div>' + [[0, 'sala', 0], [1, 'fala', 47]].map(([f, w, h]) => [...w].map((c, j) => `<b style="--h:${h};--f:${f};--x:${j - 1.5}">${c}</b>`).join('')).join('') + '<i class="slab"></i></div><i class="gr"></i></div>',
    varal: '<div class="av-pv av-pv-vr"><svg viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 8Q100 60 200 8"/></svg>' + [...'fala da'].map((c, i) => { const t = (i + .5) / 7; return `<span class="${i < 3 ? 'on' : i === 3 ? 'cur' : ''}${c === ' ' ? ' sp' : ''}" style="left:${8 + i * 12.5}%;top:${(10 + 4 * t * (1 - t) * 24).toFixed(0)}px;--c:${['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'][i]}"><b>${c === ' ' ? '✦' : c}</b></span>`; }).join('') + '</div>',
    maquina: '<div class="av-pv av-pv-mq"><div class="sh"><p><u>fala</u> <i>d</i>a sala</p><em></em></div><div class="bd">' + ['qwertyuiop', 'asdfghjkl'].map((r) => `<p>${[...r].map((k) => `<b${k === 'd' ? ' class="nx"' : ''}></b>`).join('')}</p>`).join('') + '</div></div>',
    pontos: '<div class="av-pv av-pv-lp"><svg viewBox="0 0 120 70"><polyline points="60,8 66.5,27 86.6,27 70.5,39 76.5,59 60,47 43.5,59 49.5,39 33.4,27"/>' + [[60, 8, 's'], [66.5, 27, 'a'], [86.6, 27, 'l'], [70.5, 39, 'a'], [76.5, 59, 'f'], [60, 47, 'a'], [43.5, 59, 'l'], [49.5, 39, 'a'], [33.4, 27, 'd'], [53.5, 27, 'a']].map(([x, y, c], i) => `<circle cx="${x}" cy="${y}" r="${i === 8 ? 3.4 : 2.4}" class="${i < 8 ? 'ok' : i === 8 ? 'cur' : ''}"/><text x="${(x + (x - 60) * .3).toFixed(1)}" y="${(y + (y - 36) * .35 + 2).toFixed(1)}">${c}</text>`).join('') + '</svg></div>',
    domino: '<div class="av-pv av-pv-dm">' + [...'fala'].map((c, i) => `<b class="${i === 0 ? 'd' : i === 1 ? 'l' : i === 2 ? 'cur' : ''}" style="left:${18 + i * 14}%">${c}</b>`).join('') + '<i></i></div>',
    partitura: '<div class="av-pv av-pv-pt"><div class="st"><i></i><i></i><i></i><i></i><i></i></div><em class="rd"></em>' + [...'fala da'].map((c, i) => `<span class="${i < 3 ? 'ok' : i === 3 ? 'cur' : ''}${c === ' ' ? ' r' : ''}" style="left:${10 + i * 12}%;--p:${c === ' ' ? 4 : 'fjdkslaçghrueiwoqptyvbncmxz'.indexOf(c) % 9};--c:${['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f97316']['fjdkslaçghrueiwoqptyvbncmxz'.indexOf(c) % 9 % 8]}"><i></i><b>${c === ' ' ? '' : c}</b></span>`).join('') + '</div>',
    lanterna: '<div class="av-pv av-pv-ln"><p><u>fala</u> <i>d</i>a sala<br>asa da fala</p><em></em></div>',
    roda: '<div class="av-pv av-pv-rg"><i class="ring"></i>' + [...'falasal'].map((c, j) => `<span style="--a:${90 + j * 51.4}deg"><b class="${j === 0 ? 'cur' : j > 4 ? 'ok' : ''}" style="--c:${['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'][j]}">${c}</b></span>`).join('') + '<i class="dock"></i></div>',
    painel: '<div class="av-pv av-pv-pn"><small>✈ EMBARQUE</small><div>' + [...'fala da sala'].map((c, i) => `<b class="${i < 6 ? 'ok' : i === 6 ? 'cur' : ''}">${c === ' ' ? '' : c}</b>`).join('') + '</div></div>',
    fogos: '<div class="av-pv av-pv-fg"><span class="bm" style="left:30%;top:34%;--c:#f472b6">' + Array.from({ length: 12 }, (_, k) => `<i style="--a:${k * 30}deg"></i>`).join('') + '<b>sala</b></span><span class="rk" style="left:72%;--c:#38bdf8"></span><i class="city"></i></div>',
    pipoca: '<div class="av-pv av-pv-pp"><div class="pan">' + [...'fala'].map((c, i) => `<b class="${i === 0 ? 'cur' : ''}" style="left:${12 + i * 24}%">${c}</b>`).join('') + '</div><i class="corn" style="left:52%;top:20%"></i><i class="corn" style="left:68%;top:12%"></i><div class="bk"><i></i></div></div>',
    jardim: '<div class="av-pv av-pv-jd">' + [...'fala d'].map((c, i) => `<span class="${i < 4 ? 'ok' : i === 5 ? 'cur' : ''}${c === ' ' ? ' sp' : ''}" style="left:${12 + i * 15}%;--c:${['#f43f5e', '#a855f7', '#f59e0b', '#ec4899', '#000', '#3b82f6'][i]};--jh:${[30, 44, 36, 48, 0, 0][i]}px">${i < 4 ? '<i></i>' : ''}<b>${c === ' ' ? '' : c}</b></span>`).join('') + '<i class="soil"></i></div>',
    cofre: '<div class="av-pv av-pv-cf"><div class="dr"><i class="dl"></i><div class="rs">' + [...'sala␣'].map((c, i) => `<b class="${i < 2 ? 'ok' : i === 2 ? 'cur' : ''}">${c}</b>`).join('') + '</div><i class="hd"></i></div></div>',
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
          match: (n) => n.tipo === 'typing' && !n.nova && !n.apresenta && !n.sombra && !['esteira', 'cartoes', 'quadro', 'trilha', 'torre', 'varal', 'maquina', 'pontos', 'domino', 'partitura', 'lanterna', 'roda', 'painel', 'fogos', 'pipoca', 'jardim', 'cofre'].some((k) => n[k]),
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
          cod: 'DG-03', nome: 'Sombra das palavras', prev: 'sombra',
          desc: 'Com poucas teclas não dá para escrever palavras, mas dá para digitar o ritmo delas: cada letra de uma frase real vira F (mão esquerda) ou J (mão direita). A frase aparece em cima de cada tecla. No primeiro nível, um cartão de apresentação (“Novo desafio · A sombra das palavras”) explica a ideia com um exemplo animado antes de começar.',
          como: [
            'A letra da frase em amarelo = mão esquerda, em azul = mão direita',
            'Já ensina de que lado fica cada letra (prepara as próximas lições)',
            'Frases crescem até virar textos longos',
            'Apresentação: aparece uma vez, no primeiro nível da sombra, com a explicação e um exemplo (“bom dia”) com as letras e as mãos; o aluno aperta Enter para começar',
          ],
          campos: [['frase', 'A frase de verdade (o texto F/J é gerado sozinho)'], ['dica', 'A frase da faixa "Dica"'], ['apresenta', 'Só no primeiro nível: o cartão de apresentação (tag, título, texto e exemplo)']],
          match: (n) => n.tipo === 'typing' && !!n.sombra,
          teste: { pick: (n) => !!n.apresenta }, // abre pelo nível com a apresentação, para ver o cartão e depois a sombra
          info: (n) => `“${n.frase.length > 34 ? n.frase.slice(0, 32) + '…' : n.frase}”`,
        },
        {
          cod: 'DG-04', nome: 'Teclas do fundo', prev: 'esteira',
          desc: 'O texto vira uma fila de teclas que vem do fundo, como um teclado visto em perspectiva: a tecla da frente é a da vez e as próximas esperam atrás, em fileiras que vão ficando menores. Cada tecla aparece no lugar dela no teclado e com a cor do dedo que a digita.',
          como: [
            'A tecla da vez tem contorno escuro e uma “base” de tecla; o espaço é a barra larga no meio',
            'Acertou: a tecla afunda, fica verde e some, e a fila anda uma fileira para a frente',
            'Errou: a tecla da frente treme em vermelho e ganha um pontinho (não avança)',
            'Mostra 5 teclas por vez (a da vez + 4 seguintes), com as mesmas cores de dedo do teclado virtual',
            'Ajuda a ligar cada letra ao lugar dela no teclado, sem ler o texto inteiro; bom para sequências de teclas e palavras curtas',
          ],
          campos: [['texto', 'O que o aluno digita, ex.: "fj jf ff jj"'], ['esteira', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.esteira,
          // ainda não está em nenhuma lição: o teste usa as teclas da linha de base e um texto de exemplo
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', esteira: true, titulo: 'Teclas do fundo', dica: 'A tecla da frente é a da vez. As próximas vêm do fundo, cada uma no lugar dela no teclado.', texto: 'fj jf dk kd sl ls fjf jfj asd jkl dfj kjf sal das lad fala' } },
          info: (n) => `${n.texto.length} teclas`,
        },
        {
          cod: 'DG-05', nome: 'Cartões de palavras', prev: 'cartoes',
          desc: 'Uma palavra por vez num cartão grande no meio da folha, com o espaço depois dela como uma teclinha “␣”. Ao terminar a palavra e apertar Espaço, o cartão ganha um ✓ e vai para a esquerda, e o próximo, que esperava à direita, cresce para o meio.',
          como: [
            'A letra da vez fica sublinhada em azul; as certas ficam verdes e as que tiveram erro, laranja',
            'Erro: a letra pisca em vermelho e o cartão treme (não avança)',
            'Mostra o cartão anterior (com ✓) e os dois próximos, menores, para o aluno se preparar',
            'Ajuda a ler e digitar palavra por palavra, sem se perder num texto longo',
          ],
          campos: [['texto', 'O que o aluno digita (as palavras viram cartões)'], ['cartoes', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.cartoes,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', cartoes: true, titulo: 'Cartões de palavras', dica: 'Uma palavra de cada vez: termine a palavra e aperte Espaço para o próximo cartão.', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.split(' ').length} palavras`,
        },
        {
          cod: 'DG-06', nome: 'Quadro revelado', prev: 'quadro',
          desc: 'Em cima, um quadro desenhado (praia ao pôr do sol, cidade à noite ou montanhas com lago) coberto de peças coloridas. Cada letra certa vira peças, em ordem sorteada; no fim do texto a imagem aparece inteira, com um brilho e o selo “Quadro completo!”. O texto fica numa linha embaixo, que anda sozinha.',
          como: [
            'A letra da vez fica fixa a cerca de 30% da linha, sublinhada em azul; as certas ficam verdes',
            'O número de peças acompanha o tamanho do texto: a última letra revela a última peça',
            'Erro: a letra pisca em vermelho (não avança)',
            'Os desenhos mudam um pouco a cada vez (estrelas, janelas e árvores sorteadas)',
            'Campo "quadro": praia, cidade ou montanha; com true, sorteia um',
          ],
          campos: [['texto', 'O que o aluno digita'], ['quadro', 'praia, cidade, montanha ou true (sorteia)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.quadro,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', quadro: true, titulo: 'Quadro revelado', dica: 'Cada letra certa revela um pedaço do quadro. Termine o texto para ver a imagem inteira!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} teclas`,
        },
        {
          cod: 'DG-07', nome: 'Trilha das pedras', prev: 'trilha',
          desc: 'Um rio com pedras em zigue-zague, cada uma com uma letra; os espaços são folhas de vitória-régia. A cada letra certa o robozinho pula para a pedra dela e a câmera acompanha; no fim ele chega à outra margem, onde está a bandeira.',
          como: [
            'A pedra da vez brilha com um contorno branco; as já pisadas ficam com a letra verde (laranja se tiveram erro)',
            'Errou: a pedra treme em vermelho e o robô se desequilibra (não avança)',
            'O pulo é rápido: dá para digitar no ritmo sem esperar a animação',
            'Mostra o caminho à frente, para o aluno ler as próximas letras',
          ],
          campos: [['texto', 'O que o aluno digita (cada letra vira uma pedra)'], ['trilha', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.trilha,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', trilha: true, titulo: 'Trilha das pedras', dica: 'Cada letra certa é um pulo para a próxima pedra. As folhas são os espaços.', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} pedras`,
        },
        {
          cod: 'DG-08', nome: 'Torre de blocos', prev: 'torre',
          desc: 'Um guindaste segura a letra da vez num bloco colorido. Cada letra certa solta o bloco, que cai no andar da palavra; o Espaço põe a laje e começa o andar de cima. A câmera sobe com a torre e, no fim do texto, uma bandeira é fincada no topo.',
          como: [
            'Cada palavra vira um andar (com uma cor por andar), centralizado na torre',
            'O gancho anda até o lugar do próximo bloco; no Espaço ele mostra a laje',
            'Errou: o bloco do gancho balança em vermelho e não cai (a letra da linha embaixo pisca)',
            'O texto também fica numa linha embaixo da cena, que anda sozinha',
          ],
          campos: [['texto', 'O que o aluno digita (cada palavra vira um andar)'], ['torre', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.torre,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', torre: true, titulo: 'Torre de blocos', dica: 'Cada letra certa é um bloco a mais na torre. O Espaço fecha o andar!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.split(' ').length} andares`,
        },
        {
          cod: 'DG-09', nome: 'Varal de luzes', prev: 'varal',
          desc: 'À noite, um fio de luzes vai de poste em poste sobre a cidade, e cada lâmpada tem uma letra (o espaço é uma estrelinha). Cada letra certa acende a lâmpada na sua cor; no fim do texto o varal inteiro pisca em festa.',
          como: [
            'A lâmpada da vez tem um contorno branco brilhante; a câmera acompanha o varal',
            'As lâmpadas que tiveram erro acendem com um pontinho laranja',
            'Errou: a lâmpada pisca em vermelho e não acende',
            'Bom para textos longos: o aluno vê as próximas letras à frente',
          ],
          campos: [['texto', 'O que o aluno digita (cada letra vira uma lâmpada)'], ['varal', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.varal,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', varal: true, titulo: 'Varal de luzes', dica: 'Cada letra certa acende uma lâmpada. Acenda o varal inteiro!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} lâmpadas`,
        },
        {
          cod: 'DG-10', nome: 'Máquina de escrever', prev: 'maquina',
          desc: 'Uma máquina de escrever antiga: o texto aparece clarinho no papel, como um molde, e cada letra certa é carimbada em tinta enquanto o carro anda para a esquerda. O teclado redondo da máquina acende em amarelo a tecla da vez e afunda a tecla batida. No fim: “ding!”.',
          como: [
            'A letra da vez fica sempre na marca vermelha, no meio do papel',
            'As letras carimbadas ficam levemente tortas, como numa máquina de verdade; as que tiveram erro ficam marrons',
            'Errou: a letra pisca em vermelho e o papel treme (não avança)',
            'O teclado da máquina ajuda a achar a tecla sem olhar para o teclado de verdade',
          ],
          campos: [['texto', 'O que o aluno digita'], ['maquina', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.maquina,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', maquina: true, titulo: 'Máquina de escrever', dica: 'Cada letra certa é carimbada no papel. Olhe a marca vermelha!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} teclas`,
        },
        {
          cod: 'DG-11', nome: 'Ligue os pontos', prev: 'pontos',
          desc: 'Os pontos de um desenho escondido (estrela, coração, casa ou peixe) estão na folha, cada um com uma letra. Cada letra certa puxa um traço até o ponto dela; na última letra o desenho fecha, se pinta com um degradê e aparece o selo “Desenho completo!”.',
          como: [
            'O ponto da vez pulsa em azul e a letra dele fica maior',
            'Os espaços são pontinhos menores, sem letra',
            'Errou: o ponto e a letra piscam em vermelho (não avança)',
            'O texto também fica numa linha embaixo, para ler as palavras inteiras',
            'Campo "pontos": estrela, coracao, casa ou peixe; com true, sorteia um',
          ],
          campos: [['texto', 'O que o aluno digita (cada letra vira um ponto)'], ['pontos', 'estrela, coracao, casa, peixe ou true (sorteia)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.pontos,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', pontos: true, titulo: 'Ligue os pontos', dica: 'Cada letra certa liga o próximo ponto. Que desenho será?', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} pontos`,
        },
        {
          cod: 'DG-12', nome: 'Fila de dominós', prev: 'domino',
          desc: 'Cada letra é uma peça de dominó em pé sobre a mesa, e as palavras ficam separadas por um vão. Cada letra certa derruba a peça, que se apoia na próxima; a última peça de cada palavra deita de vez. No fim, a bandeira de chegada comemora.',
          como: [
            'A peça da vez tem contorno azul; cada palavra tem uma cor de peça',
            'Errou: a peça balança em vermelho e continua em pé',
            'O vão “␣” entre as palavras é o Espaço',
            'A câmera acompanha a fila conforme as peças caem',
          ],
          campos: [['texto', 'O que o aluno digita (cada letra vira uma peça)'], ['domino', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.domino,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', domino: true, titulo: 'Fila de dominós', dica: 'Cada letra certa derruba uma peça. Derrube a fila inteira!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.replace(/ /g, '').length} peças`,
        },
        {
          cod: 'DG-13', nome: 'Partitura das letras', prev: 'partitura',
          desc: 'O texto vira uma música: cada letra é uma nota na pauta (a altura muda conforme a letra) e aparece embaixo, como a letra de uma canção; o espaço é uma pausa. Cada letra certa toca a nota e ela fica colorida. No fim, a melodia termina com um acorde.',
          como: [
            'A nota da vez fica na faixa azul de leitura; a partitura anda sozinha',
            'O som é baixinho e pode ser desligado no botão “♪ Som ligado” da cena (fica lembrado no aparelho)',
            'Errou: a nota treme em vermelho e não toca',
            'A mesma letra sempre toca a mesma nota: palavras repetidas viram refrões',
          ],
          campos: [['texto', 'O que o aluno digita (cada letra vira uma nota)'], ['partitura', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.partitura,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', partitura: true, titulo: 'Partitura das letras', dica: 'Cada letra é uma nota: digite certinho para tocar a música!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} notas`,
        },
        {
          cod: 'DG-14', nome: 'Lanterna no escuro', prev: 'lanterna',
          desc: 'O texto está numa sala escura e só aparece o pedaço que a lanterna ilumina, em volta da letra da vez e um pouco à frente. As letras já digitadas ficam brilhando em amarelo no escuro; no fim do texto a luz da sala acende e tudo aparece.',
          como: [
            'A luz acompanha a letra da vez, também quando o texto muda de linha',
            'Treina a atenção: o aluno lê só o que vem logo a seguir',
            'Errou: a letra pisca em vermelho (não avança); as que tiveram erro brilham em laranja',
            'Texto em várias linhas, que sobem conforme o aluno avança',
          ],
          campos: [['texto', 'O que o aluno digita'], ['lanterna', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.lanterna,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', lanterna: true, titulo: 'Lanterna no escuro', dica: 'Siga a luz da lanterna, letra por letra.', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} teclas`,
        },
        {
          cod: 'DG-15', nome: 'Roda-gigante', prev: 'roda',
          desc: 'Uma roda-gigante ao entardecer com 12 cabines, cada uma com uma letra. A cabine de baixo, na plataforma, é a da vez: cada letra certa embarca nela (a cabine fica colorida) e a roda gira uma posição. As cabines que passam pelo alto recebem as próximas letras, então a roda dá quantas voltas o texto pedir. No fim, as luzes da roda piscam.',
          como: [
            'A cabine da vez tem contorno azul e fica parada na plataforma amarela',
            'As cabines continuam em pé enquanto a roda gira, como numa roda de verdade',
            'Errou: a cabine balança em vermelho (não gira); as que tiveram erro ficam com contorno laranja',
            'Mostra as 7 próximas letras subindo pelo lado da roda; o texto também fica numa linha embaixo',
          ],
          campos: [['texto', 'O que o aluno digita'], ['roda', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.roda,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', roda: true, titulo: 'Roda-gigante', dica: 'A cabine de baixo é a da vez: cada letra certa embarca e a roda gira!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} cabines`,
        },
        {
          cod: 'DG-16', nome: 'Painel do aeroporto', prev: 'painel',
          desc: 'Um painel de embarque com plaquinhas que viram, como nos aeroportos. O texto aparece apagado nas plaquinhas, em linhas de até 14 letras, 3 linhas por página. Cada letra certa vira a plaquinha e acende a letra em amarelo; ao terminar a página, o painel inteiro vira para a próxima.',
          como: [
            'A plaquinha da vez tem borda amarela; no espaço aparece o “␣”',
            'As palavras nunca são divididas entre duas linhas',
            'Errou: a plaquinha pisca em vermelho (não vira); as que tiveram erro acendem em laranja',
            'No topo, “página 1 de 3” mostra quanto falta; no fim, as letras piscam em verde',
          ],
          campos: [['texto', 'O que o aluno digita'], ['painel', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.painel,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', painel: true, titulo: 'Painel do aeroporto', dica: 'Cada letra certa vira uma plaquinha. Termine a página para o painel virar!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.length} plaquinhas`,
        },
        {
          cod: 'DG-17', nome: 'Fogos de artifício', prev: 'fogos',
          desc: 'Cada palavra é um foguete no céu da cidade, à noite. Cada letra certa faz o foguete subir um pouco, e no fim da palavra ele está lá no alto; o Espaço acende o pavio: o foguete explode em faíscas da cor dele, com a palavra brilhando no céu, e o próximo foguete aparece. A última palavra solta o fogo maior.',
          como: [
            'A altura do foguete mostra quanto falta da palavra',
            'Errou: o foguete balança em vermelho (não sobe)',
            'Cada foguete sai de um ponto diferente da cidade e tem uma cor',
            'O texto fica numa linha embaixo da cena, que anda sozinha',
          ],
          campos: [['texto', 'O que o aluno digita'], ['fogos', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.fogos,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', fogos: true, titulo: 'Fogos de artifício', dica: 'Cada letra certa faz o foguete subir; o Espaço solta os fogos com a palavra!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.split(' ').length} foguetes`,
        },
        {
          cod: 'DG-18', nome: 'Pipoca na panela', prev: 'pipoca',
          desc: 'Os milhos estão em fila numa panela no fogo, cada um com uma letra; o da frente é o da vez e fica chiando. Cada letra certa estoura o milho, que vira pipoca e voa para o balde listrado, que vai enchendo com o progresso. O espaço é um grãozinho cinza que só some.',
          como: [
            'O milho da vez tem contorno branco e treme de leve, chiando',
            'A fila anda sozinha: o próximo milho vem para a frente',
            'Errou: o milho treme em vermelho e não estoura',
            'O balde cheio é o fim do texto e ele pula de alegria',
          ],
          campos: [['texto', 'O que o aluno digita'], ['pipoca', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.pipoca,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', pipoca: true, titulo: 'Pipoca na panela', dica: 'O milho da frente é o da vez: cada letra certa estoura uma pipoca. Encha o balde!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.replace(/ /g, '').length} pipocas`,
        },
        {
          cod: 'DG-19', nome: 'Jardim que floresce', prev: 'jardim',
          desc: 'Uma fileira de plaquinhas fincadas na terra, cada uma com uma letra (o espaço é uma pedrinha). Cada letra certa faz brotar uma flor naquela plaquinha: margarida, tulipa ou flor redonda, em cores e alturas variadas. No fim, borboletas visitam o jardim.',
          como: [
            'A plaquinha da vez tem contorno azul; a câmera acompanha a fileira',
            'A flor cresce com o caule, a folha e depois o botão abrindo',
            'Errou: a plaquinha balança em vermelho e nada brota',
            'Bom para os primeiros níveis: calmo e colorido',
          ],
          campos: [['texto', 'O que o aluno digita'], ['jardim', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.jardim,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', jardim: true, titulo: 'Jardim que floresce', dica: 'Cada letra certa faz uma flor brotar. Plante o jardim inteiro!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.replace(/ /g, '').length} flores`,
        },
        {
          cod: 'DG-20', nome: 'Cofre de senhas', prev: 'cofre',
          desc: 'Cada palavra é a senha de um cofre. A porta de aço mostra um rolo por letra, com a letra apagada na janelinha; cada letra certa gira o rolo, que para na letra e acende em dourado, e o disco do cofre dá um clique. O Espaço destrava: a manivela gira, a porta abre mostrando o ouro e o próximo cofre entra.',
          como: [
            'O rolo da vez tem contorno azul; o último rolo de cada cofre é o Espaço (␣)',
            'No topo, “Cofre 3 de 9” mostra quantas senhas faltam; embaixo aparecem as próximas senhas',
            'Errou: o rolo pisca em vermelho e a porta treme (não avança); os rolos que tiveram erro ficam com contorno laranja',
            'Ajuda a pensar palavra por palavra, terminando cada uma com o Espaço',
          ],
          campos: [['texto', 'O que o aluno digita (cada palavra vira um cofre)'], ['cofre', 'true (liga este estilo)'], ['dica', 'A frase da faixa amarela "Dica"'], ['titulo', 'O título do nível']],
          match: (n) => n.tipo === 'typing' && !!n.cofre,
          teste: { teclas: 'asdfjklç '.split(''), nivel: { tipo: 'typing', cofre: true, titulo: 'Cofre de senhas', dica: 'Cada palavra é uma senha: digite e aperte Espaço para abrir o cofre!', texto: 'sala fala asa da ja falas salsa dada asas' } },
          info: (n) => `${n.texto.split(' ').length} cofres`,
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
        {
          cod: 'MJ-05', nome: 'Patrulha das Palavras', prev: 'nave',
          desc: 'Uma nave espacial embaixo da tela e asteroides com palavras descendo na direção dela. O aluno digita a palavra: a nave gira para mirar e cada letra certa dispara um laser; na última letra o asteroide explode em pedaços. Se um asteroide bater na nave, o escudo pisca e o aluno perde uma vida.',
          como: [
            'A primeira letra escolhe o asteroide (o mais perto da nave, se dois começarem igual; a letra seguinte troca para o outro se for dele); as letras certas ficam azuis',
            'Cada tiro empurra o asteroide um pouquinho para trás; o escolhido ganha a mira e fica vermelho quando está perto da nave',
            'Backspace solta o asteroide escolhido para trocar de palavra; letra errada zera o combo, mas não tira vida',
            'Pontos: 10 por letra × o combo (+10% a cada asteroide seguido, até ×2); de vez em quando vem um asteroide dourado que vale 4× os pontos',
            'Placar de 8 dígitos (00000068) e estrelas passando ao fundo, como se a nave avançasse',
            'Com o progresso descem mais asteroides ao mesmo tempo (de 2 até 5), mais rápido e com palavras mais longas',
            'Se um asteroide bater, a onda do escudo empurra os outros para trás e vêm 2,5 s mais devagar',
            'Sem vidas: “Nave atingida!” → reviver com o Saldo HC (mesma regra e animação dos outros minijogos) ou recomeçar do zero',
            'Só usa palavras escritas com as teclas que a lição já ensinou (mesmo banco do MJ-04)',
            'No fim, a nave acelera e sai voando pelo topo',
          ],
          campos: [['meta', 'Quantos asteroides o aluno precisa destruir'], ['palavras', 'Lista de palavras (opcional; sem ela, usa o banco do jogo)'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'nave',
          // ainda não está em nenhuma lição: o teste usa o alfabeto inteiro e um nível de exemplo
          teste: { teclas: 'abcdefghijklmnopqrstuvwxyzç'.split(''), nivel: { tipo: 'nave', titulo: 'Minijogo: Patrulha das Palavras', dica: 'Digite a palavra de um asteroide antes que ele bata na nave. O dourado vale 4× os pontos, e Backspace troca de alvo.', meta: 20 } },
          info: (n) => `meta ${n.meta}`,
        },
        {
          cod: 'MJ-06', nome: 'Grande Prêmio das Teclas', prev: 'gp',
          desc: 'Uma corrida numa pista neon à noite: cinco robozinhos, um em cada faixa. O do aluno (“Você”) corre na faixa da frente e só anda quando ele digita a frase que fica embaixo da pista; os outros quatro (Byte, Pixel, Chip e Turbo) correm sozinhos. Quem digitar a frase inteira primeiro cruza a linha de chegada.',
          como: [
            'Cada letra certa faz o robô avançar; a errada fica vermelha e não avança (é preciso teclar a certa). Acentos e maiúsculas não precisam ser exatos (é = e, A = a, ç = c)',
            'A pista é bem mais longa que a tela: a câmera segue o robô do aluno e o cenário vem avançando (faixas, postes de luz e a cidade ao fundo em velocidades diferentes); a chegada quadriculada só aparece no fim. Rival fora da tela vira uma etiqueta presa na borda, com seta',
            'A frase anda sozinha e a letra atual fica sempre à vista, com um sublinhado azul piscando; a barra embaixo mostra quanto falta até a chegada',
            'Os rivais correm perto do ritmo do campo “ppm”: um mais lento, dois parecidos e um mais rápido, com arrancadas e tropeços',
            'Placar com a posição ao vivo (1º a 5º, dourado no 1º) e as palavras por minuto do aluno; as etiquetas dos robôs mostram a colocação de cada um',
            'Na chegada vem o pódio: medalha de ouro, prata ou bronze (ou azul do 4º em diante), PPM, precisão e tempo; no 1º lugar cai confete',
            'Chances (padrão 10, como corações no placar): cada tecla errada gasta uma',
            'Sem chances: “Sem chances!” → continuar com as chances cheias pagando com o Saldo HC (mesma regra e animação dos outros minijogos; o tempo parado não conta no PPM) ou recomeçar a corrida com uma frase nova',
            'Chegando ao fim, o aluno termina a corrida em qualquer posição',
            'Só usa frases que dá para escrever com as teclas da lição; com poucas teclas vira uma sequência de palavras da lição',
          ],
          campos: [['frase', 'A frase da corrida (opcional)'], ['frases', 'Lista de frases para sortear (opcional; sem frase nem frases, usa o banco do jogo)'], ['ppm', 'Ritmo dos rivais em palavras por minuto (opcional; padrão 20)'], ['erros', 'Quantas teclas erradas o aluno pode errar antes de precisar das moedas (opcional; padrão 10)']],
          match: (n) => n.tipo === 'gp',
          // ainda não está em nenhuma lição: o teste usa o teclado inteiro e um nível de exemplo
          teste: { teclas: 'abcdefghijklmnopqrstuvwxyzç .,-'.split(''), nivel: { tipo: 'gp', titulo: 'Minijogo: Grande Prêmio das Teclas', dica: 'Digite a frase para o seu robô correr. Cada letra certa é um passo rumo à linha de chegada!', ppm: 20 } },
          info: (n) => `${n.ppm || 20} ppm`,
        },
        {
          cod: 'MJ-07', nome: 'Travessia dos Balões', prev: 'baloes',
          desc: 'Um céu de entardecer com montanhas e um mar de nuvens embaixo. Uma fila de balões, cada um com uma tecla, atravessa o céu. O aluno tecla a letra do balão que brilha e o robozinho pula e se pendura nele; o balão começa a descer e, antes de chegar às nuvens, é preciso teclar a letra do próximo balão para o robô pular para ele.',
          como: [
            'O robô começa numa ilha flutuante (sem pressa); a partir do primeiro balão, cada balão desce até o mar de nuvens',
            'Notas pelo quanto o balão ainda estava alto ao pular: Perfeito, Ótimo ou Bom, e combo nos pulos seguidos',
            'Perto das nuvens o balão fica vermelho e o robô se assusta',
            'Tecla errada zera o combo, mas não tira vida',
            'Se o balão chegar às nuvens, ele estoura, o robô cai e perde uma vida; ele reaparece numa ilha antes do próximo balão e vêm 2,5 s mais devagar',
            'Os balões descem mais rápido com o progresso (de 4,6 s até 2,2 s); a câmera segue o robô e o cenário anda em camadas',
            'O contador mostra quantos balões faltam; no último, o robô pula para a ilha da chegada com a bandeira',
            'Sem vidas: “O robô caiu!” → reviver com o Saldo HC (mesma regra e animação dos outros minijogos) ou recomeçar do zero',
          ],
          campos: [['meta', 'Quantos balões o aluno precisa atravessar'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'baloes',
          // ainda não está em nenhuma lição: o teste usa as teclas da linha de base e um nível de exemplo
          teste: { teclas: 'asdfjklç'.split(''), nivel: { tipo: 'baloes', titulo: 'Minijogo: Travessia dos Balões', dica: 'Tecle a letra do balão que brilha. O seu balão vai descendo: tecle a próxima antes que ele chegue às nuvens!', meta: 30 } },
          info: (n) => `meta ${n.meta}`,
        },
        {
          cod: 'MJ-08', nome: 'Duelo no Penhasco', prev: 'duelo',
          desc: 'Noite com aurora e uma plataforma flutuante. O robozinho fica numa ponta e monstrinhos caem do céu na outra, andando na direção dele. Em cima aparece uma palavra em letras: cada letra certa faz o robô arremessar um orbe de energia que empurra o monstro para trás, até ele cair do penhasco.',
          como: [
            'A letra atual fica branca e maior; as digitadas apagam; ao terminar a palavra, a próxima entra na hora',
            'Cada orbe empurra o monstro um pouco (o combo deixa o orbe mais forte); a barra em cima dele mostra quanto falta para cair',
            'Tecla errada faz o monstro dar um passo à frente (e rir) e zera o combo, mas não tira vida',
            'Se o monstro chegar no robô, dá uma cabeçada: o robô perde uma vida, o monstro é jogado de volta e vêm 2,5 s mais devagar',
            'Três monstros: comum (verde), ligeiro (rosa, mais rápido) e pesadão (roxo, maior, recua menos); com o progresso eles andam mais rápido e os pesadões aparecem mais',
            'O contador mostra quantos monstros já caíram',
            'Sem vidas: “O robô foi derrubado!” → reviver com o Saldo HC (mesma regra e animação dos outros minijogos) ou recomeçar do zero',
            'Palavras: só as que dá para escrever com as teclas da lição (mesmo banco do MJ-04); com poucas teclas viram sequências com as teclas da lição',
          ],
          campos: [['meta', 'Quantos monstros o aluno precisa derrubar'], ['palavras', 'Lista de palavras (opcional; sem ela, usa o banco do jogo)'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'duelo',
          // ainda não está em nenhuma lição: o teste usa o alfabeto inteiro e um nível de exemplo
          teste: { teclas: 'abcdefghijklmnopqrstuvwxyzç'.split(''), nivel: { tipo: 'duelo', titulo: 'Minijogo: Duelo no Penhasco', dica: 'Digite a palavra de cima: cada letra certa arremessa um orbe que empurra o monstro. Derrube-o do penhasco!', meta: 8 } },
          info: (n) => `meta ${n.meta}`,
        },
        {
          cod: 'MJ-09', nome: 'Resgate das Teclinhas', prev: 'resgate',
          desc: 'Um vale de circuitos ao entardecer. Teclinhas (teclas com olhinhos e perninhas, na cor do dedo) saem do portal HC e atravessam o vale. À esquerda, a nave-vírus espera: quando uma teclinha chega embaixo dela, o raio começa a puxá-la para cima. Digitar a letra da teclinha a salva, e ela volta correndo para o portal, que vai carregando: cheio, o Espaço dispara o pulso HC e deixa a nave tonta.',
          como: [
            'Várias teclinhas na tela ao mesmo tempo, em três faixas; duas nunca têm a mesma letra (quando a lição tem teclas suficientes)',
            'Dá para salvar andando ou já flutuando no raio (“Ufa!”); a tecla certa salva primeiro a que está no raio, depois a mais perto da nave',
            'O teclado da tela destaca a teclinha mais perto da nave',
            'Portal HC: as teclinhas saem dele e as salvas entram nele; cada uma salva carrega 1 de 6. Cheio, aparece “Espaço”: o pulso HC atinge a nave, que fica tonta por 4 s (raio desligado, quem estava sendo puxada cai de volta no chão e as outras esperam na beira do raio)',
            'Tecla errada zera o combo e a nave ri, mas não tira vida',
            'Se o raio puxar a teclinha até a nave, perde uma vida e vêm 2,5 s mais devagar',
            'Com o progresso, as teclinhas andam mais rápido, chegam mais seguidas, aparecem as ligeiras e o raio puxa mais depressa (de 2,4 s até 1,4 s)',
            'O contador mostra quantas teclinhas já foram salvas; no fim, a nave-vírus foge',
            'Sem vidas: “A nave levou as teclinhas!” → reviver com o Saldo HC (mesma regra e animação dos outros minijogos) ou recomeçar do zero',
          ],
          campos: [['meta', 'Quantas teclinhas o aluno precisa salvar'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'resgate',
          // ainda não está em nenhuma lição: o teste usa as teclas da linha de base e um nível de exemplo
          teste: { teclas: 'asdfjklç'.split(''), nivel: { tipo: 'resgate', titulo: 'Minijogo: Resgate das Teclinhas', dica: 'Digite a letra de cada teclinha antes que a nave-vírus a puxe para cima!', meta: 25 } },
          info: (n) => `meta ${n.meta}`,
        },
        {
          cod: 'MJ-10', nome: 'Saltos na Rede', prev: 'saltos',
          desc: 'O robozinho corre sozinho por uma cidade de dados à noite, com prédios em neon passando ao fundo. No caminho aparecem obstáculos com uma palavra em cima: firewall (espinhos de laser), buraco com o fluxo de dados e vírus que vêm andando. Digitando a palavra inteira antes de chegar, o robô pula por cima na hora certa. Depois do último obstáculo, o portal HC de chegada.',
          como: [
            'Só a palavra do próximo obstáculo vale (as seguintes aparecem apagadas); ao terminar, ela fica verde e já dá para digitar a próxima',
            'O robô pula sozinho na hora certa: o aluno só precisa terminar a palavra antes de chegar ao obstáculo',
            'Tecla errada zera o combo, mas não tira vida',
            'Se não der tempo, o robô bate, perde uma vida e vêm 2,5 s mais devagar; o obstáculo não conta e outro aparece no lugar',
            'Os vírus andam na direção do robô, então chegam mais rápido que os outros obstáculos',
            'Com o progresso, o robô corre mais rápido, os obstáculos ficam mais próximos e as palavras crescem',
            'O contador mostra quantos obstáculos já foram pulados; na meta, o robô entra no portal HC',
            'Sem vidas: “O robô travou na rede!” → reviver com o Saldo HC (os próximos obstáculos se afastam para dar tempo) ou recomeçar do zero',
            'Palavras: só as que dá para escrever com as teclas da lição (mesmo banco do MJ-04); com poucas teclas viram sequências com as teclas da lição',
          ],
          campos: [['meta', 'Quantos obstáculos o aluno precisa pular'], ['palavras', 'Lista de palavras (opcional; sem ela, usa o banco do jogo)'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'saltos',
          // ainda não está em nenhuma lição: o teste usa o alfabeto inteiro e um nível de exemplo
          teste: { teclas: 'abcdefghijklmnopqrstuvwxyzç'.split(''), nivel: { tipo: 'saltos', titulo: 'Minijogo: Saltos na Rede', dica: 'Digite a palavra em cima de cada obstáculo antes de o robô chegar nele: assim ele pula por cima!', meta: 12 } },
          info: (n) => `meta ${n.meta}`,
        },
        {
          cod: 'MJ-11', nome: 'Missão Mouse', prev: 'mouse',
          desc: 'O primeiro minijogo de mouse (não usa o teclado). A tela vira a área de trabalho do “HC OS”, com papel de parede, barra de tarefas e a Pasta HC. Vão aparecendo itens com um anel de tempo e uma etiqueta que mostra o que fazer e qual botão do mouse usar: vírus (clique), arquivo suspeito (botão direito, que abre um menu de contexto onde o aluno escolhe “Escanear com HC”), pacote dourado (clique duplo) e documento (arrastar até a Pasta HC).',
          como: [
            'As ações entram aos poucos: só clique no começo; botão direito a partir do 4º item, clique duplo a partir do 9º e arrastar a partir do 14º (com metas pequenas, entram antes)',
            'Na primeira vez de cada ação aparece a faixa “Nova ação!” explicando como fazer',
            'Cada etiqueta tem um mouse desenhado com o botão certo pintado (esquerdo azul, direito rosa, duplo amarelo, arrastar verde)',
            'Botão errado zera o combo e conta como erro na precisão, mas não tira vida; clique no espaço vazio não conta',
            'Botão direito: abre o menu com “Abrir”, “Escanear com HC” e “Excluir”; o aluno precisa clicar em “Escanear com HC” (o anel para enquanto o menu está aberto). “Abrir” ou “Excluir” fecham o menu e contam como erro; clicar fora fecha o menu sem erro',
            'Clique duplo: dois cliques com o botão esquerdo em menos de meio segundo',
            'Arrastar: segurar o botão esquerdo no documento, levar até a Pasta HC e soltar (o anel para enquanto ele é arrastado); solto fora da pasta, ele volta ao lugar',
            'Se o anel acabar, o item “infecta” o computador (a tela pisca): perde uma vida e vêm 2,5 s mais devagar',
            'Tempo pensado para quem está começando: o anel dura 6,5 s no clique, 7,5 s no botão direito e no clique duplo e 10 s no arrastar; com o progresso fica só um pouco mais curto (até 20% menos), os itens aparecem um pouco mais seguidos e ficam até 3 na tela (no começo, 1 por vez)',
            'Sem vidas: “O computador travou!” → reviver com o Saldo HC (os anéis recomeçam) ou recomeçar do zero',
          ],
          campos: [['meta', 'Quantos itens o aluno precisa resolver'], ['vidas', 'Quantas vidas (opcional; padrão 3)']],
          match: (n) => n.tipo === 'mouse',
          // ainda não está em nenhuma lição: o teste usa um nível de exemplo (o teclado não é usado)
          teste: { teclas: 'asdfjklç'.split(''), nivel: { tipo: 'mouse', titulo: 'Minijogo: Missão Mouse', dica: 'Use o mouse! Faça o que cada item pede (clique, botão direito, clique duplo ou arrastar) antes que o anel acabe.', meta: 20 } },
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
        { cod: 'PC-06', nome: 'Resultado e Saldo HC', icon: 'party', teste: { auto: 'moedas' }, desc: 'A tela final com estrelas, pontuação e recorde. As moedas voam das estrelas para o Saldo HC: 35,27 por estrela, +87,76 no Superstar e +97,43 no Megastar. O saldo pode ser gasto para reviver nos minijogos com vidas (MJ-01 a MJ-11).' },
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
