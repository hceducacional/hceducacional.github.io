/* =========================================================
   DISCIPLINA 8 — ATALHOS, PRODUTIVIDADE E ACESSIBILIDADE (curso "Informática do zero")
   Aulas 01 a 09 + Aula 10 (avaliação). Inclui o glossário e o checklist de habilidades do material.
   Formato dos blocos: veja curso/conteudos/d1.js.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
(() => {
  const C = window.HC_CONTEUDOS;
  const Q = (parte, q, op, certa, exp) => ({ parte, q, op, certa, exp });

  C['d8-a01'] = {
    titulo: 'Por que usar atalhos de teclado?',
    subtitulo: 'As teclas Ctrl, Alt, Shift e Windows, como ler uma combinação de teclas e por que os atalhos poupam tempo.',
    leitura: 8,
    partes: [
      { id: 'p1', titulo: 'Tempo é precioso', blocos: [
        { p: 'Copiar um texto com o mouse leva vários passos: selecionar, botão direito, procurar **Copiar**, ir até o destino, botão direito, **Colar**. Com o teclado: {{Ctrl+C}} e {{Ctrl+V}}. Um segundo [[raio]].' },
        { compara: {
          a: { t: 'Só com o mouse', ico: 'mouse', itens: ['Procurar o botão no menu', 'Mão vai e volta entre mouse e teclado', 'Mais cliques, mais tempo'] },
          b: { t: 'Com atalhos', ico: 'teclado', itens: ['A ação acontece na hora', 'As mãos ficam no teclado', 'Menos esforço repetitivo'] },
        } },
      ] },
      { id: 'p2', titulo: 'As teclas modificadoras', blocos: [
        { p: 'Os atalhos quase sempre usam uma destas teclas, chamadas **modificadoras**. Sozinhas, elas não fazem nada:' },
        { atalhos: [
          ['Ctrl', 'Control: a mais usada nos atalhos (copiar, colar, salvar)'],
          ['Alt', 'Alternativa: usada para menus e trocar de janela'],
          ['Shift', 'Maiúsculas e seleção; também muda o sentido de atalhos'],
          ['Win', 'A tecla com o símbolo do Windows: atalhos do sistema'],
          ['AltGr', 'Símbolos extras, como ° e €'],
        ] },
        { teclado: 'dedos' },
      ] },
      { id: 'p3', titulo: 'Lendo uma combinação', blocos: [
        { p: 'Quando você vê **Ctrl + Shift + Esc**, faça assim:' },
        { passos: [
          '**Segure** a primeira tecla ({{Ctrl}}).',
          'Sem soltar, **segure** a segunda ({{Shift}}).',
          '**Aperte e solte** a última ({{Esc}}).',
          'Solte as outras.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Sem pressa', texto: 'Não precisa apertar tudo ao mesmo tempo. A ordem é: segure as modificadoras e, por último, toque a tecla final.' } },
      ] },
      { id: 'p4', titulo: 'Atalhos mudam de programa para programa', blocos: [
        { p: 'Muitos atalhos são **universais** ({{Ctrl+C}} copia em quase tudo). Mas alguns mudam conforme o programa e o idioma:' },
        { tabela: { cab: ['Ação', 'Word em português', 'Na maioria dos outros programas'], linhas: [
          ['Salvar', '{{Ctrl+B}}', '{{Ctrl+S}}'],
          ['Negrito', '{{Ctrl+N}}', '{{Ctrl+B}}'],
          ['Selecionar tudo', '{{Ctrl+T}}', '{{Ctrl+A}}'],
          ['Novo', '{{Ctrl+O}}', '{{Ctrl+N}}'],
        ] } },
        { destaque: { tom: 'saiba', titulo: 'Descubra o atalho', texto: 'Passe o mouse sobre um botão e espere: a dica que aparece costuma mostrar o atalho. Nos menus, o atalho aparece escrito ao lado de cada opção.' } },
      ] },
      { id: 'p5', titulo: 'Como aprender sem decorar', blocos: [
        { passos: [
          'Escolha **3 atalhos** desta semana (por exemplo: copiar, colar e desfazer).',
          'Cole um papelzinho perto do monitor com eles.',
          'Toda vez que for usar o mouse para essas ações, **pare** e use o atalho.',
          'Na semana seguinte, acrescente mais 3.',
        ] },
        { p: 'Em um mês, você vai usar uns 12 atalhos sem pensar. É a mesma lógica da digitação: **repetição** vira hábito.' },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual a principal vantagem dos atalhos de teclado?', ['Fazer as ações mais rápido', 'Deixar o computador colorido', 'Gastar menos energia elétrica', 'Desligar o mouse'], 0, 'Atalhos economizam tempo e cliques.'),
      Q('p1', 'Com atalhos, as mãos:', ['Ficam no teclado', 'Vão e voltam ao mouse o tempo todo', 'Não são usadas', 'Ficam no monitor'], 0, 'Menos idas ao mouse, menos esforço.'),
      Q('p2', 'O que as teclas modificadoras fazem sozinhas?', ['Nada: elas mudam a função de outras teclas', 'Escrevem letras', 'Desligam o PC', 'Abrem o Word'], 0, 'Ctrl, Alt, Shift e Win funcionam em combinação.'),
      Q('p2', 'Qual é a tecla modificadora mais usada nos atalhos?', ['Ctrl', 'Enter', 'Espaço', 'Esc'], 0, 'O Ctrl está na maioria dos atalhos.'),
      Q('p3', 'Em Ctrl + Shift + Esc, qual tecla se aperta por último?', ['Esc', 'Ctrl', 'Shift', 'Tanto faz'], 0, 'Segure as modificadoras e toque a última tecla.'),
      Q('p3', 'É preciso apertar todas as teclas do atalho exatamente ao mesmo tempo?', ['Não: segure as modificadoras e depois toque a última', 'Sim, sempre', 'Só no celular', 'Só no Word'], 0, 'Não precisa pressa.'),
      Q('p4', 'No Word em português, qual atalho salva?', ['Ctrl + B', 'Ctrl + S', 'Ctrl + N', 'Ctrl + A'], 0, 'No Word em português, Ctrl + B salva.'),
      Q('p4', 'Como descobrir o atalho de um botão?', ['Passando o mouse sobre ele e esperando a dica', 'Desligando o computador', 'Apertando todas as teclas', 'Não é possível'], 0, 'A dica do botão costuma mostrar o atalho.'),
      Q('p5', 'Qual a melhor forma de aprender atalhos?', ['Poucos por semana, praticando sempre', 'Decorar 100 num dia', 'Nunca usar', 'Só ler uma vez'], 0, 'A repetição transforma o atalho em hábito.'),
      Q('p5', 'Segundo o texto, a lógica de aprender atalhos é igual à da:', ['Digitação: repetição vira hábito', 'Culinária', 'Pintura', 'Natação'], 0, 'Com repetição, os dedos aprendem.'),
    ],
  };

  C['d8-a02'] = {
    titulo: 'Atalhos de edição',
    subtitulo: 'Copiar, recortar, colar, desfazer, refazer, selecionar tudo, salvar, imprimir e localizar.',
    leitura: 8,
    partes: [
      { id: 'p1', titulo: 'O trio de ouro', blocos: [
        { atalhos: [
          ['Ctrl+C', 'Copiar: faz uma cópia do que está selecionado [[copiar]]'],
          ['Ctrl+X', 'Recortar: tira do lugar para colar em outro [[tesoura]]'],
          ['Ctrl+V', 'Colar: coloca onde está o cursor [[colar]]'],
        ] },
        { p: 'Funcionam com **textos**, **imagens**, **arquivos** e **pastas**, no Word, no navegador, no Explorador de Arquivos e na maioria dos programas.' },
        { destaque: { tom: 'dica', titulo: 'Para lembrar', texto: 'As teclas **X**, **C** e **V** ficam lado a lado, bem pertinho do {{Ctrl}}. O X parece uma tesoura aberta.' } },
      ] },
      { id: 'p2', titulo: 'Desfazer e refazer', blocos: [
        { atalhos: [
          ['Ctrl+Z', 'Desfaz a última ação'],
          ['Ctrl+Y', 'Refaz o que foi desfeito (no Word em português, Ctrl+R)'],
        ] },
        { p: 'O {{Ctrl+Z}} funciona até no Explorador de Arquivos: apagou ou moveu uma pasta sem querer? Aperte logo em seguida e ela volta.' },
      ] },
      { id: 'p3', titulo: 'Selecionar', blocos: [
        { atalhos: [
          ['Ctrl+A', 'Seleciona tudo (no Word em português, Ctrl+T)'],
          ['Shift+setas', 'Seleciona letra por letra'],
          ['Ctrl+Shift+setas', 'Seleciona palavra por palavra'],
          ['Shift+Home / Shift+End', 'Seleciona até o começo ou o fim da linha'],
        ] },
      ] },
      { id: 'p4', titulo: 'Salvar, abrir e imprimir', blocos: [
        { atalhos: [
          ['Ctrl+S', 'Salvar (no Word em português, Ctrl+B)'],
          ['Ctrl+O', 'Abrir um arquivo (no Word em português, Ctrl+A)'],
          ['Ctrl+N', 'Novo arquivo ou nova janela (no Word em português, Ctrl+O)'],
          ['Ctrl+P', 'Imprimir'],
          ['Ctrl+W', 'Fechar o arquivo ou a aba'],
        ] },
        { destaque: { tom: 'atencao', titulo: 'O hábito que salva', texto: 'Crie o costume de salvar a cada poucos minutos. Um apagão não avisa antes!' } },
      ] },
      { id: 'p5', titulo: 'Localizar e substituir', blocos: [
        { atalhos: [
          ['Ctrl+F', 'Localizar uma palavra na página (navegador, PDF e a maioria dos programas)'],
          ['Ctrl+L', 'Localizar no Word em português'],
          ['Ctrl+U', 'Substituir no Word em português (em outros, Ctrl+H)'],
        ] },
        { destaque: { tom: 'dica', titulo: 'Use no navegador', texto: 'Numa página enorme, como um edital de concurso, aperte {{Ctrl+F}} e digite a palavra que procura. O navegador destaca todas as vezes em que ela aparece.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual atalho recorta o que está selecionado?', ['Ctrl + X', 'Ctrl + C', 'Ctrl + V', 'Ctrl + Z'], 0, 'Ctrl + X recorta.'),
      Q('p1', 'Os atalhos de copiar e colar funcionam com:', ['Textos, imagens, arquivos e pastas', 'Só textos', 'Só imagens', 'Só no Word'], 0, 'Eles funcionam em quase tudo.'),
      Q('p2', 'Moveu uma pasta sem querer no Explorador. Como desfazer?', ['Ctrl + Z logo em seguida', 'Ctrl + P', 'Alt + F4', 'Win + L'], 0, 'O Ctrl + Z também desfaz ações com arquivos.'),
      Q('p2', 'Na maioria dos programas, qual atalho refaz?', ['Ctrl + Y', 'Ctrl + Z', 'Ctrl + P', 'Ctrl + W'], 0, 'Ctrl + Y refaz (no Word em português, Ctrl + R).'),
      Q('p3', 'Qual atalho seleciona palavra por palavra?', ['Ctrl + Shift + setas', 'Alt + setas', 'Win + setas', 'Só as setas'], 0, 'Ctrl + Shift + setas seleciona palavras inteiras.'),
      Q('p3', 'Na maioria dos programas, qual atalho seleciona tudo?', ['Ctrl + A', 'Ctrl + T', 'Ctrl + S', 'Ctrl + E'], 0, 'Ctrl + A (no Word em português, Ctrl + T).'),
      Q('p4', 'Qual atalho imprime?', ['Ctrl + P', 'Ctrl + I', 'Ctrl + M', 'Ctrl + D'], 0, 'Ctrl + P imprime.'),
      Q('p4', 'Qual atalho fecha a aba do navegador?', ['Ctrl + W', 'Ctrl + Q', 'Ctrl + E', 'Ctrl + R'], 0, 'Ctrl + W fecha a aba ou o arquivo.'),
      Q('p5', 'Para achar uma palavra numa página do navegador, use:', ['Ctrl + F', 'Ctrl + V', 'Ctrl + Z', 'Ctrl + N'], 0, 'Ctrl + F localiza na página.'),
      Q('p5', 'No Word em português, qual atalho abre o Localizar?', ['Ctrl + L', 'Ctrl + F', 'Ctrl + B', 'Ctrl + P'], 0, 'No Word em português, Ctrl + L localiza.'),
    ],
  };

  C['d8-a03'] = {
    titulo: 'Atalhos do Windows',
    subtitulo: 'Área de trabalho, Explorador, alternar janelas, prints, bloquear o computador e mais.',
    leitura: 8,
    partes: [
      { id: 'p1', titulo: 'A tecla Windows', blocos: [
        { atalhos: [
          ['Win', 'Abre o menu Iniciar'],
          ['Win+D', 'Mostra a área de trabalho'],
          ['Win+E', 'Abre o Explorador de Arquivos'],
          ['Win+I', 'Abre as Configurações'],
          ['Win+L', 'Bloqueia o computador'],
          ['Win+S', 'Abre a pesquisa'],
        ] },
        { destaque: { tom: 'dica', titulo: 'Saindo de perto?', texto: '{{Win+L}} deve virar reflexo: levantou da cadeira, bloqueou.' } },
      ] },
      { id: 'p2', titulo: 'Janelas', blocos: [
        { atalhos: [
          ['Alt+Tab', 'Alterna entre as janelas abertas'],
          ['Win+Tab', 'Mostra todas as janelas lado a lado'],
          ['Win+← / Win+→', 'Encaixa a janela na metade esquerda ou direita da tela'],
          ['Win+↑', 'Maximiza'],
          ['Win+M', 'Minimiza todas as janelas'],
          ['Alt+F4', 'Fecha a janela ativa'],
        ] },
      ] },
      { id: 'p3', titulo: 'Capturas de tela', blocos: [
        { p: 'Tirar um **print** (foto da tela) é útil para mostrar um erro ao suporte ou guardar um comprovante.' },
        { atalhos: [
          ['Print Screen', 'Copia a tela inteira (cole com Ctrl+V)'],
          ['Win+Shift+S', 'Escolhe um pedaço da tela para capturar'],
          ['Win+Print Screen', 'Salva a tela inteira na pasta Imagens > Capturas de Tela'],
          ['Alt+Print Screen', 'Copia só a janela ativa'],
        ] },
      ] },
      { id: 'p4', titulo: 'Sistema e emergências', blocos: [
        { atalhos: [
          ['Ctrl+Shift+Esc', 'Abre o Gerenciador de Tarefas (para fechar um programa travado)'],
          ['Ctrl+Alt+Delete', 'Tela de opções: bloquear, trocar usuário, sair, Gerenciador de Tarefas'],
          ['Win+V', 'Histórico da área de transferência'],
          ['Win+.', 'Painel de emojis e símbolos 😀'],
          ['Win+H', 'Ditado: escreve o que você fala'],
        ] },
      ] },
      { id: 'p5', titulo: 'No Explorador de Arquivos', blocos: [
        { atalhos: [
          ['F2', 'Renomear'],
          ['Ctrl+Shift+N', 'Nova pasta'],
          ['Alt+←', 'Voltar'],
          ['Alt+↑', 'Subir para a pasta de cima'],
          ['Delete / Shift+Delete', 'Para a Lixeira / apagar de vez'],
          ['Alt+Enter', 'Propriedades do arquivo (tamanho, data, local)'],
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual atalho bloqueia o computador?', ['Win + L', 'Win + D', 'Win + E', 'Win + I'], 0, 'Win + L bloqueia a tela.'),
      Q('p1', 'Qual atalho abre as Configurações?', ['Win + I', 'Win + S', 'Win + M', 'Win + V'], 0, 'Win + I abre as Configurações.'),
      Q('p2', 'Qual atalho minimiza todas as janelas?', ['Win + M', 'Alt + F4', 'Win + ↑', 'Ctrl + W'], 0, 'Win + M minimiza todas.'),
      Q('p2', 'Qual atalho alterna entre as janelas abertas?', ['Alt + Tab', 'Ctrl + Tab', 'Shift + Tab', 'Win + L'], 0, 'Alt + Tab troca de janela.'),
      Q('p3', 'Qual atalho permite escolher um pedaço da tela para capturar?', ['Win + Shift + S', 'Print Screen', 'Ctrl + P', 'Alt + Tab'], 0, 'Win + Shift + S abre a captura de um pedaço.'),
      Q('p3', 'Onde fica salva a captura feita com Win + Print Screen?', ['Imagens > Capturas de Tela', 'Lixeira', 'Downloads', 'Área de trabalho do vizinho'], 0, 'Ela vai para a pasta Capturas de Tela.'),
      Q('p4', 'Qual atalho abre o painel de emojis?', ['Win + .', 'Win + E', 'Ctrl + E', 'Alt + E'], 0, 'Win + ponto abre os emojis.'),
      Q('p4', 'Qual atalho ativa o ditado, que escreve o que você fala?', ['Win + H', 'Win + D', 'Ctrl + H', 'Alt + H'], 0, 'Win + H abre o ditado.'),
      Q('p5', 'No Explorador, qual atalho sobe para a pasta de cima?', ['Alt + ↑', 'Alt + ←', 'Ctrl + ↑', 'Win + ↑'], 0, 'Alt + seta para cima sobe um nível.'),
      Q('p5', 'Qual atalho mostra as propriedades de um arquivo?', ['Alt + Enter', 'Ctrl + Enter', 'Shift + Enter', 'Win + Enter'], 0, 'Alt + Enter abre as Propriedades.'),
    ],
  };

  C['d8-a04'] = {
    titulo: 'Atalhos do navegador',
    subtitulo: 'Abas, barra de endereço, atualizar, localizar, zoom e navegação: a internet na ponta dos dedos.',
    leitura: 8,
    partes: [
      { id: 'p1', titulo: 'Abas', blocos: [
        { atalhos: [
          ['Ctrl+T', 'Nova aba'],
          ['Ctrl+W', 'Fecha a aba'],
          ['Ctrl+Shift+T', 'Reabre a aba fechada'],
          ['Ctrl+Tab', 'Próxima aba'],
          ['Ctrl+1 / Ctrl+8', 'Vai direto para a aba 1, 2, 3... até a 8'],
        ] },
      ] },
      { id: 'p2', titulo: 'Endereço e navegação', blocos: [
        { atalhos: [
          ['Ctrl+L', 'Seleciona a barra de endereço (no navegador)'],
          ['Alt+←', 'Volta para a página anterior'],
          ['Alt+→', 'Avança'],
          ['F5', 'Atualiza a página'],
          ['Ctrl+F5', 'Atualiza ignorando a cópia guardada (quando a página não muda)'],
          ['Espaço', 'Desce a página'],
        ] },
        { destaque: { tom: 'saiba', titulo: 'Ctrl + L em todo lugar?', texto: 'No navegador, {{Ctrl+L}} vai para a barra de endereço. No Word em português, ele localiza. O mesmo atalho pode fazer coisas diferentes em programas diferentes.' } },
      ] },
      { id: 'p3', titulo: 'Zoom e leitura', blocos: [
        { atalhos: [
          ['Ctrl++', 'Aumenta o zoom (letras maiores)'],
          ['Ctrl+-', 'Diminui o zoom'],
          ['Ctrl+0', 'Volta ao zoom normal (100%)'],
          ['F11', 'Tela cheia'],
        ] },
        { destaque: { tom: 'dica', titulo: 'Letra pequena?', texto: 'Segure {{Ctrl}} e gire a **rodinha do mouse** para aumentar ou diminuir o zoom. Funciona também no Word e no Explorador.' } },
      ] },
      { id: 'p4', titulo: 'Favoritos, histórico e downloads', blocos: [
        { atalhos: [
          ['Ctrl+D', 'Salva a página nos favoritos'],
          ['Ctrl+H', 'Histórico'],
          ['Ctrl+J', 'Downloads'],
          ['Ctrl+Shift+Delete', 'Limpar dados de navegação'],
          ['Ctrl+Shift+N', 'Janela anônima (Chrome)'],
        ] },
      ] },
      { id: 'p5', titulo: 'Links e formulários', blocos: [
        { lista: [
          '{{Ctrl}} + clique num link: abre o link numa **aba nova**, sem sair da página.',
          'Clique com a **rodinha** do mouse num link: também abre numa aba nova.',
          '{{Tab}}: pula para o próximo campo de um formulário; {{Shift+Tab}} volta.',
          '{{Enter}}: envia o formulário ou a pesquisa.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Formulários rápidos', texto: 'Ao preencher um cadastro, use {{Tab}} para ir de um campo ao outro sem pegar no mouse.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual atalho abre uma nova aba?', ['Ctrl + T', 'Ctrl + N', 'Ctrl + A', 'Ctrl + B'], 0, 'Ctrl + T abre uma nova aba.'),
      Q('p1', 'Como ir direto para a terceira aba?', ['Ctrl + 3', 'Alt + 3', 'Win + 3', 'Shift + 3'], 0, 'Ctrl + número vai para a aba correspondente.'),
      Q('p2', 'No navegador, qual atalho seleciona a barra de endereço?', ['Ctrl + L', 'Ctrl + E', 'Ctrl + B', 'Ctrl + M'], 0, 'Ctrl + L vai para a barra de endereço.'),
      Q('p2', 'Qual atalho volta para a página anterior?', ['Alt + ←', 'Ctrl + ←', 'Shift + ←', 'Win + ←'], 0, 'Alt + seta para a esquerda volta.'),
      Q('p3', 'Qual atalho volta o zoom ao normal?', ['Ctrl + 0', 'Ctrl + 1', 'Ctrl + 9', 'Ctrl + Z'], 0, 'Ctrl + 0 volta a 100%.'),
      Q('p3', 'Como aumentar o zoom com o mouse?', ['Segurando Ctrl e girando a rodinha', 'Clicando duas vezes', 'Pelo botão direito', 'Não é possível'], 0, 'Ctrl + rodinha muda o zoom.'),
      Q('p4', 'Qual atalho mostra os downloads?', ['Ctrl + J', 'Ctrl + H', 'Ctrl + D', 'Ctrl + K'], 0, 'Ctrl + J abre os downloads.'),
      Q('p4', 'Qual atalho salva a página nos favoritos?', ['Ctrl + D', 'Ctrl + F', 'Ctrl + S', 'Ctrl + P'], 0, 'Ctrl + D adiciona aos favoritos.'),
      Q('p5', 'Como abrir um link numa aba nova sem sair da página?', ['Ctrl + clique no link', 'Clique duplo', 'Alt + clique', 'Arrastar para a Lixeira'], 0, 'Ctrl + clique (ou a rodinha) abre em nova aba.'),
      Q('p5', 'Num formulário, qual tecla pula para o próximo campo?', ['Tab', 'Esc', 'Delete', 'F5'], 0, 'O Tab vai para o próximo campo.'),
    ],
  };

  C['d8-a05'] = {
    titulo: 'Ganhando velocidade no computador',
    subtitulo: 'Organização de pastas, nomes de arquivos, área de transferência, captura de tela e pesquisa: dicas para render mais.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'Um lugar para cada coisa', blocos: [
        { p: 'A maior perda de tempo no computador é **procurar arquivos**. Uma boa estrutura de pastas resolve:' },
        { exemplo: { titulo: 'Exemplo de organização em Documentos', linhas: ['📁 Documentos', '   📁 Pessoal (RG, comprovantes, contas)', '   📁 Trabalho', '   📁 Estudos', '       📁 Curso de Informática', '       📁 Escola', '   📁 Finanças (planilhas, boletos pagos)'] } },
        { destaque: { tom: 'dica', titulo: 'A regra dos 5 minutos', texto: 'Uma vez por semana, gaste 5 minutos movendo os arquivos soltos da área de trabalho e dos Downloads para as pastas certas.' } },
      ] },
      { id: 'p2', titulo: 'Nomes que se encontram', blocos: [
        { p: 'Um padrão de nome ajuda o computador a **ordenar** e você a **achar**:' },
        { compara: {
          a: { t: 'Difícil de achar', ico: 'x', itens: ['documento (3).docx', 'foto.jpg', 'planilha nova.xlsx'] },
          b: { t: 'Fácil de achar', ico: 'check', itens: ['2026-03-contas-casa.xlsx', '2026-03-15-recibo-aluguel.pdf', 'curriculo-joao-2026.docx'] },
        } },
        { p: 'Começar com a data no formato **ano-mês-dia** faz os arquivos ficarem em ordem cronológica automaticamente.' },
      ] },
      { id: 'p3', titulo: 'Histórico da área de transferência', blocos: [
        { p: 'Normalmente, o {{Ctrl+V}} cola só a **última** coisa copiada. Com o **histórico da área de transferência**, você escolhe entre as últimas coisas copiadas:' },
        { passos: [
          'Aperte {{Win+V}}. Na primeira vez, clique em **Ativar**.',
          'Copie várias coisas normalmente com {{Ctrl+C}}.',
          'Quando for colar, aperte {{Win+V}} e clique no item que quer.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Fixar', texto: 'Itens usados toda hora (como o seu endereço ou CPF) podem ser **fixados** no histórico. Cuidado em computadores compartilhados!' } },
      ] },
      { id: 'p4', titulo: 'Pesquisar em vez de procurar', blocos: [
        { p: 'Em vez de abrir pasta por pasta, **pesquise** [[lupa]]:' },
        { lista: [
          '{{Win}} e digite: encontra programas, configurações e arquivos.',
          'No Explorador, digite na **caixa de pesquisa** da pasta.',
          'No navegador, {{Ctrl+F}} encontra palavras na página.',
          'No e-mail, a caixa de pesquisa encontra mensagens antigas.',
        ] },
      ] },
      { id: 'p5', titulo: 'Fixar, arrastar e outros truques', blocos: [
        { checklist: [
          '**Fixe** na barra de tarefas os programas que usa todo dia.',
          '**Fixe** no Explorador (Acesso rápido) as pastas mais usadas: botão direito > **Fixar no Acesso rápido**.',
          '**Arraste** arquivos direto para o e-mail ou para o WhatsApp Web para anexar.',
          'Use **janelas lado a lado** ({{Win+←}} e {{Win+→}}) para copiar de um documento para outro.',
          'Use o **ditado** ({{Win+H}}) para escrever textos longos falando.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual a maior perda de tempo no computador, segundo o texto?', ['Procurar arquivos', 'Ligar o monitor', 'Escolher o papel de parede', 'Ajustar o volume'], 0, 'Uma boa organização evita procurar arquivos.'),
      Q('p1', 'O que propõe a regra dos 5 minutos?', ['Organizar os arquivos soltos uma vez por semana', 'Desligar o computador a cada 5 minutos', 'Salvar a cada 5 horas', 'Nada'], 0, 'Cinco minutos semanais mantêm tudo organizado.'),
      Q('p2', 'Qual destes nomes de arquivo é mais fácil de encontrar?', ['2026-03-contas-casa.xlsx', 'planilha nova.xlsx', 'documento (3).docx', 'foto.jpg'], 0, 'Data e descrição deixam o arquivo fácil de achar.'),
      Q('p2', 'Por que começar o nome com ano-mês-dia?', ['Os arquivos ficam em ordem cronológica automaticamente', 'Porque é obrigatório', 'Para ocupar menos espaço', 'Não há motivo'], 0, 'O formato ano-mês-dia ordena por data.'),
      Q('p3', 'Qual atalho abre o histórico da área de transferência?', ['Win + V', 'Ctrl + V', 'Alt + V', 'Shift + V'], 0, 'Win + V mostra o histórico.'),
      Q('p3', 'O que o histórico da área de transferência permite?', ['Escolher entre as últimas coisas copiadas', 'Apagar arquivos', 'Imprimir', 'Mudar a senha'], 0, 'Você escolhe o que colar entre os itens copiados.'),
      Q('p4', 'Qual o jeito mais rápido de abrir um programa?', ['Apertar Win e digitar o nome', 'Procurar pasta por pasta', 'Reiniciar o computador', 'Pedir para alguém'], 0, 'A pesquisa do Windows é a forma mais rápida.'),
      Q('p4', 'Como achar uma palavra numa página da internet?', ['Ctrl + F', 'Win + L', 'Alt + F4', 'Ctrl + P'], 0, 'Ctrl + F localiza na página.'),
      Q('p5', 'Como deixar uma pasta sempre à mão no Explorador?', ['Fixar no Acesso rápido', 'Apagar as outras', 'Mudar a cor', 'Renomear para A'], 0, 'O Acesso rápido guarda as pastas mais usadas.'),
      Q('p5', 'Qual atalho ativa o ditado do Windows?', ['Win + H', 'Win + D', 'Ctrl + H', 'Alt + D'], 0, 'Win + H escreve o que você fala.'),
    ],
  };

  C['d8-a06'] = {
    titulo: 'Organizando o seu tempo e a sua rotina digital',
    subtitulo: 'Notificações, foco, agenda, lembretes e ferramentas que ajudam a estudar e trabalhar melhor.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'As distrações', blocos: [
        { p: 'Cada notificação [[sino]] interrompe o que você está fazendo. Depois de uma interrupção, o cérebro leva vários minutos para se concentrar de novo. Por isso, controlar as notificações é o primeiro passo para render mais.' },
        { lista: [
          'Desative as notificações de aplicativos que não são importantes.',
          'Deixe ligadas só as de pessoas e serviços essenciais.',
          'Silencie grupos barulhentos.',
        ] },
      ] },
      { id: 'p2', titulo: 'Modo foco', blocos: [
        { p: 'O Windows e os celulares têm modos que **silenciam tudo** por um tempo:' },
        { tabela: { cab: ['Onde', 'Nome', 'Como achar'], linhas: [
          ['Windows 11', 'Sessão de foco / Não incomodar', 'Clique no relógio > Foco'],
          ['Android', 'Não perturbe / Modo foco', 'Puxe a barra de cima'],
          ['iPhone', 'Foco', 'Central de Controle'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Técnica Pomodoro', texto: '**25 minutos** de foco total, **5 minutos** de pausa. A cada 4 rodadas, uma pausa maior. Funciona muito bem para estudar este curso!' } },
      ] },
      { id: 'p3', titulo: 'Agenda e lembretes', blocos: [
        { p: 'Não confie tudo à memória. Use as ferramentas que já vêm com o celular e o computador:' },
        { cards: [
          { ico: 'calendario', t: 'Agenda', d: 'Google Agenda ou Calendário do Outlook: compromissos com alerta.' },
          { ico: 'sino', t: 'Lembretes', d: '“Pagar conta de luz dia 10” com aviso no celular.' },
          { ico: 'lista', t: 'Listas de tarefas', d: 'Google Tasks, Microsoft To Do: marque o que já fez.' },
          { ico: 'microfone', t: 'Assistente de voz', d: '“Me lembre amanhã às 8 de levar o documento.”' },
        ] },
      ] },
      { id: 'p4', titulo: 'Nuvem: seus arquivos em todo lugar', blocos: [
        { p: 'Guardar arquivos na **nuvem** [[nuvem]] (Google Drive, OneDrive) permite abrir o mesmo documento no computador de casa, no celular e no trabalho, e ainda funciona como backup.' },
        { lista: [
          'Compartilhe uma pasta com a família ou com colegas de trabalho.',
          'Edite o mesmo documento com outras pessoas ao mesmo tempo (Google Docs, Word on-line).',
          'Fotografe documentos com o celular e eles vão direto para a nuvem.',
        ] },
      ] },
      { id: 'p5', titulo: 'Equilíbrio', blocos: [
        { p: 'Produtividade não é ficar o dia inteiro no computador. É fazer o que precisa **em menos tempo**, para sobrar tempo para o resto da vida.' },
        { checklist: [
          'Defina um horário para começar e terminar.',
          'Faça pausas: levante, beba água, olhe para longe.',
          'Uma tarefa de cada vez rende mais que várias ao mesmo tempo.',
          'Arrume a área de trabalho (a do computador e a da mesa) no fim do dia.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'Por que as notificações atrapalham a produtividade?', ['Interrompem e o cérebro leva minutos para se concentrar de novo', 'Gastam muita energia elétrica', 'Apagam arquivos', 'Não atrapalham'], 0, 'Cada interrupção custa concentração.'),
      Q('p1', 'Qual o primeiro passo para ter mais foco?', ['Desativar notificações que não são importantes', 'Comprar outro celular', 'Abrir mais abas', 'Aumentar o volume'], 0, 'Menos notificações, menos interrupções.'),
      Q('p2', 'O que faz o modo Não perturbe / Foco?', ['Silencia as notificações por um tempo', 'Desliga o aparelho', 'Apaga as mensagens', 'Bloqueia a internet para sempre'], 0, 'Ele silencia avisos durante o período escolhido.'),
      Q('p2', 'Na técnica Pomodoro, qual o tempo de foco?', ['25 minutos', '2 minutos', '3 horas', '1 dia'], 0, '25 minutos de foco e 5 de pausa.'),
      Q('p3', 'Para não esquecer de pagar uma conta, use:', ['Um lembrete com aviso no celular', 'Só a memória', 'Um post nas redes', 'Nada'], 0, 'Lembretes avisam na hora certa.'),
      Q('p3', 'Para que servem as listas de tarefas?', ['Organizar o que precisa ser feito e marcar o que já foi', 'Guardar senhas', 'Editar fotos', 'Fazer ligações'], 0, 'Listas ajudam a não esquecer nada.'),
      Q('p4', 'Uma vantagem de guardar arquivos na nuvem é:', ['Abrir o mesmo arquivo em vários aparelhos', 'Ocupar o pendrive', 'Não precisar de internet nunca', 'Apagar sozinho'], 0, 'A nuvem deixa os arquivos acessíveis de qualquer lugar.'),
      Q('p4', 'Qual destes é um serviço de nuvem?', ['Google Drive', 'Bloco de Notas', 'Calculadora', 'Paint'], 0, 'Google Drive e OneDrive são nuvens.'),
      Q('p5', 'O que é produtividade, segundo o texto?', ['Fazer o que precisa em menos tempo, sobrando tempo para a vida', 'Ficar o dia inteiro no computador', 'Abrir muitas janelas', 'Nunca fazer pausas'], 0, 'Produtividade é eficiência, não excesso.'),
      Q('p5', 'Fazer uma tarefa de cada vez:', ['Rende mais que várias ao mesmo tempo', 'É perda de tempo', 'É proibido', 'Não faz diferença'], 0, 'O foco numa tarefa aumenta o rendimento.'),
    ],
  };

  C['d8-a07'] = {
    titulo: 'Ferramentas de acessibilidade',
    subtitulo: 'Lupa, narrador, legendas, contraste, teclado virtual e ditado: o computador para todas as pessoas.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é acessibilidade', blocos: [
        { p: '**Acessibilidade** [[acessivel]] é garantir que **todas as pessoas** consigam usar o computador: quem enxerga pouco, quem não ouve, quem tem dificuldade de movimentar as mãos, idosos, pessoas com dislexia.' },
        { p: 'O Windows e os celulares têm muitas ferramentas gratuitas para isso. Elas ficam em **Configurações** > **Acessibilidade** (no Windows, {{Win+U}}).' },
        { destaque: { tom: 'saiba', titulo: 'Serve para todo mundo', texto: 'Muitos recursos de acessibilidade ajudam qualquer pessoa: aumentar a letra quando a vista cansa, usar legendas num lugar barulhento, ditar um texto quando está com pressa.' } },
      ] },
      { id: 'p2', titulo: 'Para quem enxerga pouco', blocos: [
        { fig: 'lupa', legenda: 'A Lupa aumenta a parte da tela onde está o mouse.' },
        { atalhos: [
          ['Win++', 'Liga a **Lupa** e aumenta o zoom'],
          ['Win+-', 'Diminui o zoom da Lupa'],
          ['Win+Esc', 'Desliga a Lupa'],
          ['Ctrl+Win+Enter', 'Liga ou desliga o **Narrador**'],
        ] },
        { lista: [
          '**Tamanho do texto:** aumenta só as letras.',
          '**Ponteiro do mouse:** maior e mais colorido, fácil de achar.',
          '**Temas de contraste:** cores fortes, como letras amarelas em fundo preto [[contraste]].',
          '**Narrador:** lê em voz alta tudo o que aparece na tela [[som]].',
        ] },
      ] },
      { id: 'p3', titulo: 'Para quem ouve pouco', blocos: [
        { lista: [
          '**Legendas ao vivo** (Windows 11, {{Win+Ctrl+L}}): cria legendas para qualquer áudio do computador, até de vídeos e chamadas [[legenda]].',
          '**Alertas visuais:** a tela pisca quando há um som de aviso.',
          '**Áudio mono:** junta os dois lados do som, para quem ouve só de um ouvido.',
          'Nas chamadas de vídeo, ative a **legenda** do aplicativo.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Libras', texto: 'Existem aplicativos gratuitos que traduzem texto e voz em português para **Libras**, com um intérprete virtual em 3D.' } },
      ] },
      { id: 'p4', titulo: 'Para quem tem dificuldade com as mãos', blocos: [
        { lista: [
          '**Ditado** ({{Win+H}}): escreve o que você fala [[microfone]].',
          '**Teclado virtual:** um teclado na tela, usado com o mouse.',
          '**Teclas de aderência:** permite apertar os atalhos uma tecla por vez (aperte o Shift 5 vezes para ativar).',
          '**Acesso por voz** (Windows 11): controla o computador inteiro falando.',
          '**Velocidade do ponteiro e do clique duplo:** ajustáveis nas configurações do mouse.',
        ] },
      ] },
      { id: 'p5', titulo: 'No celular e na internet', blocos: [
        { lista: [
          '**TalkBack** (Android) e **VoiceOver** (iPhone): leitores de tela.',
          '**Tamanho da fonte** e **zoom** nas configurações de tela.',
          '**Leitura em voz alta** de páginas no navegador (Edge: “Ler em voz alta”).',
          '**Legendas automáticas** em vídeos.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Crie conteúdo acessível', texto: 'Ao postar fotos, escreva uma **descrição da imagem** (texto alternativo). Em vídeos, use legendas. Assim todos podem acompanhar o que você compartilha.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é acessibilidade?', ['Garantir que todas as pessoas consigam usar o computador', 'Ter internet rápida', 'Comprar o computador mais caro', 'Usar só o mouse'], 0, 'Acessibilidade é tecnologia para todos.'),
      Q('p1', 'Qual atalho abre as configurações de acessibilidade do Windows?', ['Win + U', 'Win + A', 'Win + L', 'Win + D'], 0, 'Win + U abre a Acessibilidade.'),
      Q('p2', 'Qual atalho liga a Lupa do Windows?', ['Win + +', 'Win + L', 'Ctrl + L', 'Alt + +'], 0, 'Win + sinal de mais liga a Lupa.'),
      Q('p2', 'O que faz o Narrador?', ['Lê em voz alta o que aparece na tela', 'Grava vídeos', 'Desliga a tela', 'Traduz para inglês'], 0, 'O Narrador é o leitor de tela do Windows.'),
      Q('p3', 'O que fazem as Legendas ao vivo do Windows 11?', ['Criam legendas para qualquer áudio do computador', 'Desligam o som', 'Aumentam o volume', 'Gravam a tela'], 0, 'Elas transformam o áudio em texto na tela.'),
      Q('p3', 'Para quem ouve só de um ouvido, qual recurso ajuda?', ['Áudio mono', 'Tema escuro', 'Lupa', 'Teclado virtual'], 0, 'O áudio mono junta os dois lados do som.'),
      Q('p4', 'O que são as teclas de aderência?', ['Permitem apertar os atalhos uma tecla por vez', 'Teclas grudentas e sujas', 'Um tipo de mouse', 'Um antivírus'], 0, 'Elas ajudam quem não consegue apertar várias teclas juntas.'),
      Q('p4', 'Qual recurso permite controlar o computador falando?', ['Acesso por voz', 'Lupa', 'Contraste', 'Papel de parede'], 0, 'O Acesso por voz controla o Windows pela fala.'),
      Q('p5', 'Qual é o leitor de tela do Android?', ['TalkBack', 'VoiceOver', 'Narrador', 'Paint'], 0, 'TalkBack no Android; VoiceOver no iPhone.'),
      Q('p5', 'Como deixar as suas fotos acessíveis nas redes?', ['Escrevendo uma descrição da imagem', 'Postando sem legenda', 'Usando muitos filtros', 'Postando em preto e branco'], 0, 'A descrição permite que leitores de tela expliquem a imagem.'),
    ],
  };

  C['d8-a08'] = {
    titulo: 'Glossário de informática',
    subtitulo: 'As palavras mais usadas no mundo da informática, explicadas de um jeito simples, para consultar sempre que precisar.',
    leitura: 12,
    partes: [
      { id: 'p1', titulo: 'Computador e peças', blocos: [
        { tabela: { cab: ['Termo', 'Significado'], linhas: [
          ['Hardware', 'A parte física do computador'],
          ['Software', 'Os programas e aplicativos'],
          ['CPU / Processador', 'O “cérebro” que faz as contas'],
          ['Memória RAM', 'A memória de trabalho, temporária'],
          ['HD / SSD', 'Onde os arquivos ficam guardados'],
          ['Periférico', 'Aparelho ligado ao computador: mouse, teclado, impressora'],
          ['USB', 'A porta mais usada para ligar periféricos e pendrives'],
          ['Driver', 'Programa que ensina o sistema a usar um aparelho'],
        ] } },
      ] },
      { id: 'p2', titulo: 'Sistema e arquivos', blocos: [
        { tabela: { cab: ['Termo', 'Significado'], linhas: [
          ['Sistema operacional', 'O programa que comanda o computador (Windows, Android)'],
          ['Arquivo', 'Qualquer coisa guardada: texto, foto, música'],
          ['Pasta', 'Lugar para organizar arquivos'],
          ['Extensão', 'As letras depois do ponto que dizem o tipo do arquivo (.docx)'],
          ['Atalho', 'Ícone que leva a um programa ou arquivo; ou uma combinação de teclas'],
          ['Área de transferência', 'Memória que guarda o que você copiou'],
          ['Backup', 'Cópia de segurança'],
          ['Formatar', 'Apagar tudo de um disco para começar do zero; ou mudar a aparência de um texto'],
        ] } },
      ] },
      { id: 'p3', titulo: 'Internet', blocos: [
        { tabela: { cab: ['Termo', 'Significado'], linhas: [
          ['Navegador', 'Programa que abre sites (Chrome, Edge)'],
          ['URL', 'O endereço de uma página'],
          ['Link', 'Texto ou imagem que leva para outra página'],
          ['Download / Upload', 'Baixar / enviar arquivos'],
          ['Wi-Fi', 'Internet sem fio'],
          ['Nuvem', 'Servidores na internet onde guardamos arquivos'],
          ['Cookies', 'Pequenos arquivos que os sites guardam para lembrar de você'],
          ['Login', 'Entrar numa conta com usuário e senha'],
          ['Streaming', 'Assistir ou ouvir pela internet sem baixar (filmes, músicas)'],
        ] } },
      ] },
      { id: 'p4', titulo: 'Segurança', blocos: [
        { tabela: { cab: ['Termo', 'Significado'], linhas: [
          ['Malware', 'Qualquer programa malicioso'],
          ['Vírus', 'Malware que se espalha grudado em arquivos'],
          ['Phishing', 'Golpe com mensagem falsa para roubar dados'],
          ['Antivírus', 'Programa que protege contra malware'],
          ['Firewall', 'Barreira que controla o que entra e sai pela rede'],
          ['2FA', 'Verificação em duas etapas'],
          ['Criptografia', 'Embaralhar a informação para só quem tem a chave ler'],
          ['Spam', 'Mensagens em massa não desejadas'],
        ] } },
      ] },
      { id: 'p5', titulo: 'Palavras do dia a dia digital', blocos: [
        { tabela: { cab: ['Termo', 'Significado'], linhas: [
          ['App', 'Aplicativo'],
          ['Print', 'Foto da tela'],
          ['Feed', 'A lista de publicações de uma rede social'],
          ['Hashtag', 'Palavra com # que agrupa publicações'],
          ['Inteligência artificial (IA)', 'Programas que aprendem com exemplos e conversam, criam textos e imagens'],
          ['QR Code', 'Quadrado de pontinhos que o celular lê para abrir um link ou pagar'],
          ['Bug', 'Um erro num programa'],
          ['Offline / Online', 'Desconectado / conectado'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Volte aqui', texto: 'Este glossário é para consultar sempre que aparecer uma palavra estranha. Salve esta aula nos seus favoritos!' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é um driver?', ['Programa que ensina o sistema a usar um aparelho', 'Um motorista de aplicativo', 'Um tipo de vírus', 'Um cabo'], 0, 'O driver faz o sistema conversar com o aparelho.'),
      Q('p1', 'O que é um periférico?', ['Aparelho ligado ao computador, como mouse e impressora', 'Um programa', 'Um site', 'Uma senha'], 0, 'Periféricos ficam ao redor do computador.'),
      Q('p2', 'O que é a extensão de um arquivo?', ['As letras depois do ponto que dizem o tipo do arquivo', 'O tamanho do arquivo', 'A pasta onde ele está', 'A data de criação'], 0, 'Em curriculo.docx, a extensão é .docx.'),
      Q('p2', 'Formatar um disco significa:', ['Apagar tudo para começar do zero', 'Deixar o texto em negrito', 'Copiar arquivos', 'Ligar o computador'], 0, 'Formatar um disco apaga todo o conteúdo.'),
      Q('p3', 'O que são cookies?', ['Pequenos arquivos que os sites guardam para lembrar de você', 'Biscoitos virtuais grátis', 'Vírus', 'Senhas'], 0, 'Cookies guardam preferências e logins.'),
      Q('p3', 'O que é streaming?', ['Assistir ou ouvir pela internet sem baixar', 'Um tipo de cabo', 'Uma impressora', 'Um antivírus'], 0, 'Filmes e músicas on-line são streaming.'),
      Q('p4', 'O que é um firewall?', ['Barreira que controla o que entra e sai pela rede', 'Um extintor', 'Uma rede social', 'Um navegador'], 0, 'O firewall filtra as conexões.'),
      Q('p4', 'O que é criptografia?', ['Embaralhar a informação para só quem tem a chave ler', 'Apagar arquivos', 'Imprimir', 'Uma moeda'], 0, 'A criptografia protege a informação.'),
      Q('p5', 'O que é um QR Code?', ['Um quadrado de pontinhos que o celular lê para abrir um link ou pagar', 'Um tipo de teclado', 'Um vírus', 'Uma senha'], 0, 'O QR Code é lido pela câmera.'),
      Q('p5', 'O que é um bug?', ['Um erro num programa', 'Um inseto no teclado', 'Um antivírus', 'Uma rede'], 0, 'Bug é o nome dado a erros em programas.'),
    ],
  };

  C['d8-a09'] = {
    titulo: 'Checklist de habilidades',
    subtitulo: 'Revisão final do curso: confira tudo o que você aprendeu e veja o que praticar a seguir.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Usando o computador', blocos: [
        { p: 'Chegou a hora de olhar para trás e ver o quanto você aprendeu. Leia cada item e pense: “eu sei fazer isso?” [[trofeu]]' },
        { checklist: [
          'Explicar a diferença entre **hardware** e **software**.',
          'Reconhecer as peças: processador, memória, armazenamento, periféricos.',
          'Ligar, desligar e reiniciar do jeito certo.',
          'Usar o mouse: clique, clique duplo, botão direito, arrastar e rolar.',
          'Usar o teclado: maiúsculas, acentos, Enter, Backspace e Delete.',
        ] },
      ] },
      { id: 'p2', titulo: 'Windows e arquivos', blocos: [
        { checklist: [
          'Abrir programas pelo menu Iniciar e pela pesquisa.',
          'Minimizar, maximizar, fechar e alternar janelas.',
          'Criar pastas e organizar arquivos com bons nomes.',
          'Copiar, mover, renomear, excluir e restaurar da Lixeira.',
          'Usar um pendrive e ejetar com segurança.',
          'Personalizar o Windows e manter atualizado.',
        ] },
      ] },
      { id: 'p3', titulo: 'Word e Excel', blocos: [
        { checklist: [
          'Criar um documento, formatar fonte e parágrafos.',
          'Inserir imagens, tabelas e número de página.',
          'Salvar em .docx e gerar PDF.',
          'Montar uma planilha com formatação de moeda.',
          'Usar fórmulas e as funções SOMA e MÉDIA.',
          'Criar um gráfico simples.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Projeto para o portfólio', texto: 'Monte o seu **currículo** no Word e uma **planilha de orçamento** no Excel. São dois arquivos que mostram, na prática, que você sabe usar os dois programas.' } },
      ] },
      { id: 'p4', titulo: 'Internet, comunicação e segurança', blocos: [
        { checklist: [
          'Pesquisar no Google e avaliar se uma informação é confiável.',
          'Criar e usar um e-mail, com anexos.',
          'Usar WhatsApp, Facebook e Instagram com privacidade.',
          'Criar senhas fortes e ativar a verificação em duas etapas.',
          'Reconhecer golpes: phishing, falso parente, falsa central.',
          'Conferir se um site é seguro antes de digitar dados.',
          'Fazer backup dos arquivos importantes.',
        ] },
      ] },
      { id: 'p5', titulo: 'Próximos passos', blocos: [
        { p: 'Aprender informática é um caminho que não termina, e isso é bom! Algumas sugestões para continuar:' },
        { cards: [
          { ico: 'teclado', t: 'Digitação', d: 'Pratique nos módulos de digitação da Plataforma de Informática.' },
          { ico: 'tabela', t: 'Excel avançado', d: 'PROCV, tabelas dinâmicas e gráficos mais elaborados.' },
          { ico: 'imagem', t: 'Apresentações', d: 'PowerPoint ou Canva para slides e posts.' },
          { ico: 'robo', t: 'Inteligência artificial', d: 'Usar assistentes de IA de forma crítica e segura.' },
        ] },
        { destaque: { tom: 'saiba', titulo: 'Parabéns!', texto: 'Você chegou ao fim das aulas do curso **Informática do Zero**. Falta só a avaliação desta disciplina. Você tem **autonomia** para usar o computador no dia a dia, resolver tarefas sem depender de ninguém e está preparado para estudos, trabalho e comunicação digital.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual o jeito certo de desligar o computador?', ['Pelo menu Iniciar > Energia > Desligar', 'Puxando da tomada', 'Fechando a tampa com força', 'Segurando o botão sempre'], 0, 'Desligar pelo sistema evita perder dados.'),
      Q('p1', 'Para abrir uma pasta na área de trabalho, usamos:', ['Clique duplo', 'Botão direito', 'Rodinha', 'Tecla Esc'], 0, 'O clique duplo abre pastas e arquivos.'),
      Q('p2', 'Para onde vai um arquivo apagado com a tecla Delete?', ['Para a Lixeira', 'Para a internet', 'Para o pendrive', 'Some para sempre'], 0, 'Ele vai para a Lixeira e pode ser restaurado.'),
      Q('p2', 'O que fazer antes de tirar o pendrive?', ['Ejetar com segurança', 'Desligar o monitor', 'Formatar', 'Nada'], 0, 'Ejetar garante que a gravação terminou.'),
      Q('p3', 'Em que formato enviar um currículo?', ['PDF', '.exe', '.mp3', '.zip'], 0, 'O PDF mantém a aparência em qualquer aparelho.'),
      Q('p3', 'Qual função do Excel calcula o total de uma coluna?', ['SOMA', 'MÉDIA', 'SE', 'MÍNIMO'], 0, 'SOMA calcula o total.'),
      Q('p4', 'Alguém pede o código que chegou por SMS. O que fazer?', ['Nunca passar', 'Passar se for conhecido', 'Postar no status', 'Mandar por e-mail'], 0, 'Códigos de verificação são só seus.'),
      Q('p4', 'O que conferir antes de digitar dados num site?', ['O cadeado e o endereço do site', 'A cor do site', 'A quantidade de anúncios', 'Nada'], 0, 'O endereço certo é a principal verificação.'),
      Q('p5', 'Onde praticar a digitação?', ['Nos módulos de digitação da Plataforma de Informática', 'Na Lixeira', 'No Paint', 'Em lugar nenhum'], 0, 'A plataforma tem lições de digitação.'),
      Q('p5', 'Segundo o material, ao fim do curso você terá:', ['Autonomia para usar o computador no dia a dia', 'Um computador novo', 'Um diploma de engenharia', 'Nenhuma mudança'], 0, 'O objetivo do curso é a sua autonomia digital.'),
    ],
  };

  C['d8-av'] = {
    titulo: 'Avaliação: Atalhos, Produtividade e Acessibilidade',
    subtitulo: '30 perguntas sobre as Aulas 01 a 09. Não há material para consultar: responda com o que você aprendeu.',
    avaliacao: { aulas: ['d8-a01', 'd8-a02', 'd8-a03', 'd8-a04', 'd8-a05', 'd8-a06', 'd8-a07', 'd8-a08', 'd8-a09'] },
  };
})();
