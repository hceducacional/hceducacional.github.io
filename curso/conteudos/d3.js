/* =========================================================
   DISCIPLINA 3 — EDITOR DE TEXTOS: WORD (curso "Informática do zero")
   Aulas 01 a 09 + Aula 10 (avaliação). Formato dos blocos: veja curso/conteudos/d1.js.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
(() => {
  const C = window.HC_CONTEUDOS;
  const Q = (parte, q, op, certa, exp) => ({ parte, q, op, certa, exp });

  C['d3-a01'] = {
    titulo: 'O que é um editor de texto?',
    subtitulo: 'Para que serve um editor de texto, quais são os mais usados e por que ele é muito mais do que uma máquina de escrever.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'Da máquina de escrever ao computador', blocos: [
        { p: 'Antigamente, os documentos eram escritos à mão ou na **máquina de escrever**. Se você errasse uma letra, precisava apagar com corretivo ou datilografar a folha inteira de novo.' },
        { p: 'Um **editor de texto** [[texto]] é um programa para **escrever, corrigir, formatar e imprimir** textos no computador. Você pode mudar qualquer coisa quantas vezes quiser antes de imprimir.' },
        { compara: {
          a: { t: 'Máquina de escrever', ico: 'x', itens: ['Errou, tem que refazer', 'Uma letra só, de um tamanho só', 'Sem imagens', 'Para ter outra cópia, datilografar de novo'] },
          b: { t: 'Editor de texto', ico: 'check', itens: ['Corrige com o Backspace', 'Muitas letras, tamanhos e cores', 'Imagens, tabelas e formas', 'Salva e imprime quantas cópias quiser'] },
        } },
      ] },
      { id: 'p2', titulo: 'Para que serve', blocos: [
        { cards: [
          { ico: 'usuario', t: 'Currículo', d: 'Para procurar emprego.' },
          { ico: 'livro', t: 'Trabalhos escolares', d: 'Com capa, títulos e páginas numeradas.' },
          { ico: 'email', t: 'Cartas e ofícios', d: 'Documentos formais.' },
          { ico: 'lista', t: 'Listas e receitas', d: 'Organizar o dia a dia.' },
          { ico: 'bandeira', t: 'Cartazes e avisos', d: 'Com letras grandes e imagens.' },
          { ico: 'cartao', t: 'Contratos e recibos', d: 'Documentos do trabalho.' },
        ] },
      ] },
      { id: 'p3', titulo: 'Os editores mais usados', blocos: [
        { tabela: { cab: ['Programa', 'Como é', 'Preço'], linhas: [
          ['Microsoft Word', 'O mais usado em empresas e escolas', 'Pago (Microsoft 365), com versão on-line gratuita'],
          ['Google Docs', 'Funciona no navegador e salva na nuvem', 'Gratuito, com uma conta Google'],
          ['LibreOffice Writer', 'Programa instalado, parecido com o Word', 'Gratuito'],
          ['Bloco de Notas', 'Texto simples, sem formatação', 'Vem com o Windows'],
        ] } },
        { p: 'Neste curso usamos o **Word** [[texto]], mas quase tudo funciona igual no Google Docs e no LibreOffice: os botões têm os mesmos desenhos.' },
      ] },
      { id: 'p4', titulo: 'Texto simples x texto formatado', blocos: [
        { p: 'O **Bloco de Notas** guarda só as letras, sem negrito, cores ou imagens: é o **texto simples** (.txt). O **Word** guarda o texto **formatado**, com tudo o que deixa o documento bonito (.docx).' },
        { tabela: { cab: ['Extensão', 'Programa', 'Tem formatação?'], linhas: [
          ['.txt', 'Bloco de Notas', 'Não'],
          ['.docx', 'Word', 'Sim'],
          ['.odt', 'LibreOffice Writer', 'Sim'],
          ['.pdf', 'Qualquer leitor de PDF', 'Sim, mas é para ler e imprimir, não para editar'],
        ] } },
      ] },
      { id: 'p5', titulo: 'Abrindo o Word', blocos: [
        { passos: [
          'Abra o menu Iniciar e digite **word**.',
          'Clique em **Word** para abrir.',
          'Na tela inicial, clique em **Documento em branco**.',
          'Pronto: o cursor está piscando na página. É só começar a digitar!',
        ] },
        { destaque: { tom: 'dica', titulo: 'Não tem o Word?', texto: 'Acesse **office.com** pelo navegador e entre com uma conta Microsoft gratuita: dá para usar o Word on-line. Ou use o **Google Docs**, em docs.google.com.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é um editor de texto?', ['Um programa para escrever, corrigir, formatar e imprimir textos', 'Uma impressora', 'Um tipo de teclado', 'Um site de notícias'], 0, 'O editor de texto serve para criar e editar documentos.'),
      Q('p1', 'Qual vantagem o editor de texto tem sobre a máquina de escrever?', ['Corrigir erros facilmente', 'Ser mais barulhento', 'Usar fita de tinta', 'Precisar de papel carbono'], 0, 'No editor, basta apagar e escrever de novo, quantas vezes quiser.'),
      Q('p2', 'Qual destes documentos você pode fazer num editor de texto?', ['Um currículo', 'Uma planilha de cálculos complexa', 'Um vídeo', 'Uma música'], 0, 'Currículos, cartas e trabalhos são feitos no editor de texto.'),
      Q('p2', 'Para fazer um cartaz com letras grandes e imagens, o editor de texto:', ['Serve', 'Não serve', 'Só imprime em preto', 'Só funciona no celular'], 0, 'O editor de texto permite letras grandes, cores e imagens.'),
      Q('p3', 'Qual editor de texto funciona no navegador e é gratuito com uma conta Google?', ['Google Docs', 'Paint', 'Excel', 'Calculadora'], 0, 'O Google Docs funciona no navegador e salva na nuvem.'),
      Q('p3', 'Qual destes é um editor de texto gratuito para instalar?', ['LibreOffice Writer', 'Photoshop', 'Windows Update', 'Chrome'], 0, 'O LibreOffice Writer é gratuito e parecido com o Word.'),
      Q('p4', 'Qual a extensão dos documentos do Word?', ['.docx', '.txt', '.mp3', '.xlsx'], 0, 'Documentos do Word são salvos como .docx.'),
      Q('p4', 'O Bloco de Notas guarda:', ['Texto simples, sem formatação', 'Texto com imagens e cores', 'Planilhas', 'Vídeos'], 0, 'O Bloco de Notas salva apenas o texto, em .txt.'),
      Q('p5', 'Na tela inicial do Word, o que clicar para começar um documento novo?', ['Documento em branco', 'Fechar', 'Imprimir', 'Excluir'], 0, 'Clique em Documento em branco para começar.'),
      Q('p5', 'Como usar o Word sem instalar?', ['Pelo navegador, em office.com', 'Não é possível', 'Pelo Bloco de Notas', 'Pela Lixeira'], 0, 'O Word on-line funciona no navegador com uma conta Microsoft.'),
    ],
  };

  C['d3-a02'] = {
    titulo: 'Conhecendo a tela do Word',
    subtitulo: 'Faixa de Opções, guias, régua, barra de status e zoom: onde fica cada coisa.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Visão geral', blocos: [
        { fig: 'word', legenda: 'A tela do Word: a Faixa de Opções no alto e a página no centro.' },
        { p: 'A tela do Word é dividida em partes. A maior delas é a **página** branca, onde você escreve. Em cima ficam os botões, organizados na **Faixa de Opções**.' },
      ] },
      { id: 'p2', titulo: 'A Faixa de Opções e as guias', blocos: [
        { p: 'A **Faixa de Opções** é a área com os botões no alto da tela. Ela é dividida em **guias** (abas), cada uma com um tipo de ferramenta:' },
        { tabela: { cab: ['Guia', 'O que tem'], linhas: [
          ['Arquivo', 'Salvar, abrir, imprimir, exportar em PDF'],
          ['Página Inicial', 'Fonte, negrito, cor, alinhamento, listas, estilos: as mais usadas'],
          ['Inserir', 'Imagens, tabelas, formas, número de página'],
          ['Layout', 'Margens, orientação da folha, colunas'],
          ['Revisão', 'Ortografia, contar palavras, comentários'],
          ['Exibir', 'Régua, zoom, modo de leitura'],
        ] } },
        { p: 'Dentro de cada guia, os botões ficam em **grupos** com nome embaixo, como **Fonte** e **Parágrafo**.' },
      ] },
      { id: 'p3', titulo: 'A página e o cursor', blocos: [
        { p: 'A barrinha piscando na página é o **cursor de texto** (ou ponto de inserção). As letras aparecem onde ele está. Para mudar de lugar, clique em outro ponto do texto ou use as **setas** do teclado.' },
        { p: 'Quando o texto chega no fim da linha, ele **pula sozinho** para a linha de baixo. Só aperte {{Enter}} quando quiser começar um **novo parágrafo**.' },
        { destaque: { tom: 'atencao', titulo: 'Não use Enter no fim de cada linha', texto: 'Esse é um erro muito comum de quem vem da máquina de escrever. Deixe o Word quebrar as linhas sozinho: assim o texto se ajusta quando você muda o tamanho da letra.' } },
      ] },
      { id: 'p4', titulo: 'Barra de status e zoom', blocos: [
        { p: 'Na parte de baixo da janela fica a **barra de status**, com informações sobre o documento:' },
        { lista: [
          '**Página 1 de 3:** em qual página você está e quantas existem.',
          '**Palavras:** quantas palavras o texto tem.',
          '**Idioma:** o idioma usado pelo corretor (Português, Brasil).',
          '**Zoom:** a barrinha no canto direito aumenta ou diminui a visualização [[lupa]].',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Zoom não muda a letra', texto: 'O zoom só aproxima ou afasta a **visualização**. O tamanho real das letras, que sai na impressão, continua o mesmo.' } },
      ] },
      { id: 'p5', titulo: 'Régua e barra de acesso rápido', blocos: [
        { p: 'A **régua** (guia **Exibir** > **Régua**) mostra as margens e os recuos do parágrafo. Ela ajuda a alinhar o texto.' },
        { p: 'No canto de cima, à esquerda, fica a **barra de ferramentas de acesso rápido**, com botões que estão sempre à vista: **Salvar** [[salvar]], **Desfazer** [[desfazer]] e **Refazer**.' },
        { destaque: { tom: 'dica', titulo: 'Esconder a faixa', texto: 'Precisa de mais espaço para escrever? Aperte {{Ctrl+F1}} para esconder ou mostrar a Faixa de Opções.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Onde você escreve o texto no Word?', ['Na página branca no centro', 'Na barra de status', 'Na régua', 'No título da janela'], 0, 'A página branca é onde o texto é digitado.'),
      Q('p1', 'Onde ficam os botões do Word?', ['Na Faixa de Opções, no alto', 'Dentro da página', 'Na Lixeira', 'No relógio'], 0, 'Os botões ficam organizados na Faixa de Opções.'),
      Q('p2', 'Em qual guia ficam os botões de negrito, fonte e alinhamento?', ['Página Inicial', 'Revisão', 'Exibir', 'Arquivo'], 0, 'A guia Página Inicial tem as ferramentas mais usadas.'),
      Q('p2', 'Em qual guia ficam as opções de imagem e tabela?', ['Inserir', 'Layout', 'Revisão', 'Página Inicial'], 0, 'Imagens, tabelas e formas ficam na guia Inserir.'),
      Q('p3', 'Para que serve a barrinha piscando na página?', ['Mostrar onde as letras vão aparecer', 'Mostrar a hora', 'Indicar erro', 'Desligar o Word'], 0, 'É o cursor de texto: as letras aparecem onde ele está.'),
      Q('p3', 'Quando apertar Enter no Word?', ['No fim de cada linha', 'Para começar um novo parágrafo', 'Depois de cada palavra', 'Nunca'], 1, 'O Word quebra as linhas sozinho; Enter é para novo parágrafo.'),
      Q('p4', 'Onde aparece quantas palavras o texto tem?', ['Na barra de status, embaixo', 'Na guia Inserir', 'No título da janela', 'Na régua'], 0, 'A barra de status mostra páginas e palavras.'),
      Q('p4', 'O zoom do Word:', ['Muda o tamanho real da letra na impressão', 'Só aproxima ou afasta a visualização', 'Apaga o texto', 'Muda a cor da página'], 1, 'O zoom muda só a visualização, não a impressão.'),
      Q('p5', 'Onde ficam os botões Salvar e Desfazer sempre à vista?', ['Na barra de acesso rápido, no canto de cima', 'Na barra de status', 'Na régua', 'Dentro da página'], 0, 'A barra de acesso rápido fica no canto superior esquerdo.'),
      Q('p5', 'Qual atalho esconde ou mostra a Faixa de Opções?', ['Ctrl + F1', 'Ctrl + P', 'Alt + F4', 'Win + D'], 0, 'Ctrl + F1 esconde ou mostra a faixa.'),
    ],
  };

  C['d3-a03'] = {
    titulo: 'Digitando e editando o texto',
    subtitulo: 'Selecionar, apagar, copiar, colar, desfazer e localizar palavras: as ferramentas para escrever e corrigir.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Movendo o cursor', blocos: [
        { p: 'Para corrigir uma palavra lá no começo, você não precisa apagar tudo: leve o cursor até ela.' },
        { atalhos: [
          ['← →', 'Uma letra para a esquerda ou direita'],
          ['↑ ↓', 'Uma linha para cima ou para baixo'],
          ['Ctrl+← / Ctrl+→', 'Pula uma palavra inteira'],
          ['Home / End', 'Vai para o começo ou o fim da linha'],
          ['Ctrl+Home / Ctrl+End', 'Vai para o começo ou o fim do documento'],
        ] },
        { p: 'Ou simplesmente **clique** com o mouse no ponto do texto onde quer escrever.' },
      ] },
      { id: 'p2', titulo: 'Selecionando texto', blocos: [
        { p: 'Para mudar algo no texto (apagar, copiar, colocar em negrito), primeiro você **seleciona**: o trecho fica com fundo destacado.' },
        { tabela: { cab: ['Para selecionar', 'Faça'], linhas: [
          ['Um trecho', 'Clique antes da primeira letra e **arraste** até a última'],
          ['Uma palavra', '**Clique duplo** na palavra'],
          ['Um parágrafo', '**Três cliques** no parágrafo'],
          ['Tudo', '{{Ctrl+T}} (no Word em português)'],
          ['Com o teclado', 'Segure {{Shift}} e use as setas'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Clique fora para tirar', texto: 'Para desfazer a seleção, clique em qualquer outro lugar do texto.' } },
      ] },
      { id: 'p3', titulo: 'Apagar, copiar e mover', blocos: [
        { atalhos: [
          ['Backspace', 'Apaga a letra antes do cursor (ou o trecho selecionado)'],
          ['Delete', 'Apaga a letra depois do cursor (ou o trecho selecionado)'],
          ['Ctrl+C', 'Copia o trecho selecionado'],
          ['Ctrl+X', 'Recorta (para mover)'],
          ['Ctrl+V', 'Cola onde está o cursor'],
        ] },
        { p: 'Também dá para **arrastar** um trecho selecionado para outro lugar do texto com o mouse.' },
        { destaque: { tom: 'saiba', titulo: 'Escrever por cima', texto: 'Se você seleciona uma palavra e começa a digitar, o que você escreve **substitui** a seleção. É um jeito rápido de trocar uma palavra.' } },
      ] },
      { id: 'p4', titulo: 'Desfazer e refazer', blocos: [
        { p: 'Errou? Calma! O Word guarda as suas últimas ações.' },
        { atalhos: [
          ['Ctrl+Z', 'Desfaz a última ação. Aperte várias vezes para voltar mais.'],
          ['Ctrl+R', 'Refaz o que foi desfeito (no Word em português; em outros programas, Ctrl+Y).'],
        ] },
        { p: 'Os mesmos comandos estão nos botões de **setinha curva** [[desfazer]] na barra de acesso rápido.' },
      ] },
      { id: 'p5', titulo: 'Localizar e substituir', blocos: [
        { p: 'Num texto grande, procurar uma palavra com os olhos dá trabalho. Use o **Localizar** [[lupa]]:' },
        { passos: [
          'Aperte {{Ctrl+L}} (no Word em português).',
          'Digite a palavra no painel que abre à esquerda.',
          'O Word destaca todas as vezes em que ela aparece.',
        ] },
        { p: 'Para trocar uma palavra por outra no texto todo, use **Substituir** ({{Ctrl+U}}): escreva a palavra antiga, a nova e clique em **Substituir tudo**.' },
        { destaque: { tom: 'atencao', titulo: 'Confira antes', texto: '“Substituir tudo” troca em todos os lugares de uma vez. Se a palavra também aparece dentro de outras, pode trocar onde não devia. Na dúvida, use **Substituir** um por um.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual tecla leva o cursor para o fim da linha?', ['End', 'Home', 'Esc', 'Tab'], 0, 'End vai para o fim da linha; Home, para o começo.'),
      Q('p1', 'Qual atalho leva o cursor para o começo do documento?', ['Ctrl + Home', 'Ctrl + End', 'Alt + Home', 'Shift + Tab'], 0, 'Ctrl + Home vai para o início do documento.'),
      Q('p2', 'Como selecionar uma palavra inteira com o mouse?', ['Clique duplo na palavra', 'Um clique', 'Botão direito', 'Rodinha'], 0, 'O clique duplo seleciona a palavra.'),
      Q('p2', 'Três cliques num parágrafo:', ['Selecionam o parágrafo inteiro', 'Apagam o parágrafo', 'Imprimem', 'Salvam'], 0, 'Três cliques selecionam o parágrafo todo.'),
      Q('p3', 'O que acontece se você seleciona uma palavra e começa a digitar?', ['O que você digita substitui a seleção', 'Nada', 'O Word fecha', 'A palavra fica em negrito'], 0, 'O texto digitado substitui o trecho selecionado.'),
      Q('p3', 'Para mover um trecho de lugar no texto, use:', ['Ctrl + X e depois Ctrl + V', 'Ctrl + Z', 'Ctrl + A', 'Ctrl + S'], 0, 'Recortar (Ctrl + X) e colar (Ctrl + V) move o trecho.'),
      Q('p4', 'No Word em português, qual atalho refaz algo que foi desfeito?', ['Ctrl + R', 'Ctrl + Z', 'Ctrl + D', 'Ctrl + Q'], 0, 'No Word em português, Ctrl + R refaz. Em muitos outros programas é Ctrl + Y.'),
      Q('p4', 'Dá para desfazer várias ações seguidas?', ['Sim, apertando Ctrl + Z várias vezes', 'Não, só a última', 'Só fechando o Word', 'Só no Bloco de Notas'], 0, 'Cada Ctrl + Z volta mais um passo.'),
      Q('p5', 'No Word em português, qual atalho abre o Localizar?', ['Ctrl + L', 'Ctrl + F4', 'Ctrl + P', 'Ctrl + N'], 0, 'No Word em português, Ctrl + L localiza.'),
      Q('p5', 'Para trocar uma palavra por outra no texto todo, use:', ['Substituir', 'Imprimir', 'Zoom', 'Régua'], 0, 'Substituir troca uma palavra por outra.'),
    ],
  };

  C['d3-a04'] = {
    titulo: 'Formatando a fonte',
    subtitulo: 'Tipo de letra, tamanho, negrito, itálico, sublinhado e cores: deixe o texto bonito e fácil de ler.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é fonte', blocos: [
        { p: '**Fonte** é o **tipo de letra** [[fonte]]. Cada fonte tem um desenho diferente. O Word começa com a fonte **Calibri** (ou **Aptos**, nas versões novas), tamanho **11**.' },
        { tabela: { cab: ['Fonte', 'Estilo', 'Boa para'], linhas: [
          ['Arial', 'Sem serifa, limpa', 'Trabalhos, currículos'],
          ['Calibri', 'Sem serifa, moderna', 'Documentos do dia a dia'],
          ['Times New Roman', 'Com serifa (com “pezinhos”)', 'Trabalhos acadêmicos'],
          ['Comic Sans', 'Informal, divertida', 'Convites infantis (evite em documentos sérios)'],
        ] } },
        { destaque: { tom: 'saiba', titulo: 'Normas da escola', texto: 'Muitos trabalhos escolares pedem as normas da **ABNT**: fonte **Arial** ou **Times New Roman**, tamanho **12**.' } },
      ] },
      { id: 'p2', titulo: 'Trocando a fonte e o tamanho', blocos: [
        { passos: [
          '**Selecione** o texto que você quer mudar.',
          'Na guia **Página Inicial**, grupo **Fonte**, clique na caixa com o nome da fonte e escolha outra.',
          'Ao lado, na caixa com o número, escolha o **tamanho**.',
        ] },
        { atalhos: [
          ['Ctrl+Shift+>', 'Aumenta o tamanho'],
          ['Ctrl+Shift+<', 'Diminui o tamanho'],
        ] },
        { destaque: { tom: 'dica', titulo: 'Antes ou depois', texto: 'Você pode escolher a fonte **antes** de começar a digitar (vale dali para a frente) ou **depois**, selecionando o texto.' } },
      ] },
      { id: 'p3', titulo: 'Negrito, itálico e sublinhado', blocos: [
        { atalhos: [
          ['Ctrl+N', '**Negrito**: letra mais grossa, para destacar'],
          ['Ctrl+I', 'Itálico: letra inclinada, para títulos de livros e palavras estrangeiras'],
          ['Ctrl+S', 'Sublinhado: linha embaixo do texto'],
        ] },
        { destaque: { tom: 'atencao', titulo: 'Atalhos do Word em português', texto: 'No Word em português, {{Ctrl+N}} é negrito e {{Ctrl+S}} é sublinhado. Para **salvar**, use {{Ctrl+B}}. Em outros programas o salvar costuma ser {{Ctrl+S}}.' } },
        { p: 'Os botões **N**, ***I*** e **S** ficam no grupo **Fonte**. Clique de novo para tirar a formatação.' },
      ] },
      { id: 'p4', titulo: 'Cores e destaque', blocos: [
        { lista: [
          '**Cor da fonte:** o botão com a letra **A** e uma barra colorida embaixo. Muda a cor das letras.',
          '**Realce:** o botão com o **marca-texto**. Pinta o fundo, como uma caneta marca-texto.',
          '**Maiúsculas e minúsculas:** o botão **Aa** troca para TUDO MAIÚSCULO, tudo minúsculo ou Primeira Letra Maiúscula.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Menos é mais', texto: 'Use no máximo **duas fontes** e **poucas cores** por documento. Muitas cores e letras diferentes deixam o texto cansativo de ler.' } },
      ] },
      { id: 'p5', titulo: 'Pincel e limpar formatação', blocos: [
        { p: 'O **Pincel de Formatação** [[pincel]] copia a **aparência** de um trecho para outro:' },
        { passos: [
          'Clique no texto que já está com a formatação que você quer.',
          'Clique no botão **Pincel** (grupo Área de Transferência).',
          'Passe o pincel (arraste) sobre o texto que deve ficar igual.',
        ] },
        { p: 'O botão **Limpar toda a formatação** (a letra A com uma borracha) volta o trecho selecionado ao estilo normal.' },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é fonte no Word?', ['O tipo de letra', 'A cor da página', 'O tamanho da folha', 'A impressora'], 0, 'Fonte é o tipo (desenho) da letra.'),
      Q('p1', 'Quais fontes costumam ser pedidas nas normas da ABNT?', ['Arial ou Times New Roman', 'Comic Sans', 'Qualquer uma colorida', 'Só fontes à mão'], 0, 'Arial ou Times New Roman, tamanho 12.'),
      Q('p2', 'Antes de trocar a fonte de um texto já escrito, você precisa:', ['Selecionar o texto', 'Salvar', 'Imprimir', 'Fechar o Word'], 0, 'Primeiro selecione; depois escolha a fonte.'),
      Q('p2', 'Qual atalho aumenta o tamanho da letra?', ['Ctrl + Shift + >', 'Ctrl + Z', 'Ctrl + P', 'Alt + F4'], 0, 'Ctrl + Shift + > aumenta o tamanho.'),
      Q('p3', 'No Word em português, qual atalho deixa o texto em negrito?', ['Ctrl + N', 'Ctrl + B', 'Ctrl + I', 'Ctrl + U'], 0, 'No Word em português, Ctrl + N é negrito.'),
      Q('p3', 'Para que costuma ser usado o itálico?', ['Títulos de livros e palavras estrangeiras', 'Apagar texto', 'Numerar páginas', 'Salvar'], 0, 'O itálico, letra inclinada, destaca títulos e palavras estrangeiras.'),
      Q('p4', 'Qual ferramenta pinta o fundo do texto como uma caneta marca-texto?', ['Realce', 'Negrito', 'Zoom', 'Régua'], 0, 'O Realce funciona como um marca-texto.'),
      Q('p4', 'Qual a dica para um documento fácil de ler?', ['Usar no máximo duas fontes e poucas cores', 'Usar uma fonte por linha', 'Tudo em vermelho', 'Tudo maiúsculo'], 0, 'Poucas fontes e cores deixam a leitura mais agradável.'),
      Q('p5', 'Para que serve o Pincel de Formatação?', ['Copiar a aparência de um trecho para outro', 'Desenhar na página', 'Apagar imagens', 'Pintar a tela'], 0, 'O pincel copia só a formatação, não o texto.'),
      Q('p5', 'Qual botão volta o texto ao estilo normal?', ['Limpar toda a formatação', 'Salvar', 'Imprimir', 'Inserir tabela'], 0, 'Limpar formatação tira negrito, cores e tamanhos do trecho.'),
    ],
  };

  C['d3-a05'] = {
    titulo: 'Formatando parágrafos',
    subtitulo: 'Alinhamento, espaçamento entre linhas, recuos e listas com marcadores e números.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é um parágrafo no Word', blocos: [
        { p: 'Para o Word, **parágrafo** é tudo o que você escreve até apertar {{Enter}}. Uma linha só, como um título, também é um parágrafo.' },
        { p: 'A formatação de parágrafo vale para o parágrafo **inteiro**: basta o cursor estar dentro dele, não precisa selecionar.' },
        { destaque: { tom: 'saiba', titulo: 'Mostrar marcas', texto: 'O botão **¶** (Mostrar tudo), na Página Inicial, mostra onde você apertou Enter (¶) e os espaços (·). Ajuda a entender a formatação. Clique de novo para esconder.' } },
      ] },
      { id: 'p2', titulo: 'Alinhamento', blocos: [
        { tabela: { cab: ['Alinhamento', 'Atalho', 'Quando usar'], linhas: [
          ['À esquerda', '{{Ctrl+Q}}', 'O padrão: a maioria dos textos'],
          ['Centralizado', '{{Ctrl+E}}', 'Títulos, capas, convites'],
          ['À direita', '{{Ctrl+G}}', 'Datas e assinaturas no fim de cartas'],
          ['Justificado', '{{Ctrl+J}}', 'Trabalhos e textos longos: as linhas ficam retinhas dos dois lados'],
        ] } },
        { p: 'Os quatro botões de alinhamento [[alinhar]] ficam no grupo **Parágrafo** da Página Inicial.' },
      ] },
      { id: 'p3', titulo: 'Espaçamento entre linhas', blocos: [
        { p: 'O **espaçamento entre linhas** é a distância entre uma linha e outra. Fica no botão de **setinhas para cima e para baixo** do grupo Parágrafo.' },
        { lista: [
          '**1,0 (simples):** linhas próximas.',
          '**1,15:** o padrão do Word.',
          '**1,5:** pedido nas normas da ABNT para trabalhos.',
          '**2,0 (duplo):** bem espaçado.',
        ] },
        { p: 'Ali também dá para adicionar **espaço antes** ou **depois** do parágrafo, para separar um do outro sem apertar Enter duas vezes.' },
      ] },
      { id: 'p4', titulo: 'Recuos', blocos: [
        { p: 'O **recuo** é a distância entre o texto e a margem. O mais comum é o **recuo da primeira linha**, aquele espaço no começo dos parágrafos.' },
        { passos: [
          'Coloque o cursor no parágrafo.',
          'Na **régua**, arraste o triângulo de cima para a direita; ou',
          'Abra **Parágrafo** (setinha no canto do grupo) > **Especial** > **Primeira linha**, e defina **1,25 cm**.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Não use espaços', texto: 'Evite apertar a barra de espaço várias vezes para afastar o texto. Use o recuo ou o {{Tab}}: assim fica tudo alinhado.' } },
      ] },
      { id: 'p5', titulo: 'Listas', blocos: [
        { p: 'Para organizar itens, use **listas** [[lista]]:' },
        { compara: {
          a: { t: 'Marcadores', ico: 'lista', itens: ['Bolinhas, quadradinhos ou setas', 'Quando a ordem **não** importa', 'Ex.: lista de compras'] },
          b: { t: 'Numeração', ico: 'ordenar', itens: ['1, 2, 3 ou a, b, c', 'Quando a ordem **importa**', 'Ex.: passo a passo de uma receita'] },
        } },
        { p: 'Clique no botão de **Marcadores** ou de **Numeração** e comece a digitar. Cada {{Enter}} cria um novo item. Para terminar a lista, aperte {{Enter}} duas vezes.' },
        { destaque: { tom: 'dica', titulo: 'Subitens', texto: 'Dentro de uma lista, aperte {{Tab}} para criar um subitem (mais para dentro) e {{Shift+Tab}} para voltar.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Para o Word, o que é um parágrafo?', ['Tudo o que você escreve até apertar Enter', 'Uma página inteira', 'Só textos com mais de 3 linhas', 'Uma palavra'], 0, 'Parágrafo vai até o Enter; um título também é um parágrafo.'),
      Q('p1', 'Para mudar o alinhamento de um parágrafo, é preciso selecionar tudo?', ['Não, basta o cursor estar dentro dele', 'Sim, sempre', 'Só no fim do documento', 'Só com o mouse'], 0, 'Formatações de parágrafo valem para o parágrafo onde está o cursor.'),
      Q('p2', 'Qual alinhamento deixa as linhas retas dos dois lados?', ['Justificado', 'À esquerda', 'Centralizado', 'À direita'], 0, 'O justificado alinha o texto nas duas margens.'),
      Q('p2', 'Qual alinhamento é bom para títulos e capas?', ['Centralizado', 'Justificado', 'À direita', 'Nenhum'], 0, 'Títulos e capas costumam ser centralizados.'),
      Q('p3', 'Qual espaçamento entre linhas a ABNT pede para trabalhos?', ['1,5', '3,0', '0,5', '1,15'], 0, 'As normas da ABNT pedem espaçamento 1,5.'),
      Q('p3', 'Como separar parágrafos sem apertar Enter duas vezes?', ['Usando espaço antes ou depois do parágrafo', 'Com a barra de espaço', 'Com o zoom', 'Com o negrito'], 0, 'O espaço antes/depois separa os parágrafos de forma organizada.'),
      Q('p4', 'O que é o recuo da primeira linha?', ['O espaço no começo do parágrafo', 'A margem de baixo', 'O número da página', 'A cor da fonte'], 0, 'É o afastamento no começo da primeira linha do parágrafo.'),
      Q('p4', 'Qual é a forma errada de afastar o começo do parágrafo?', ['Apertar a barra de espaço várias vezes', 'Usar a régua', 'Usar a janela Parágrafo', 'Usar o Tab'], 0, 'Espaços seguidos desalinham o texto. Use recuo ou Tab.'),
      Q('p5', 'Quando usar lista numerada?', ['Quando a ordem dos itens importa', 'Sempre', 'Nunca', 'Só em títulos'], 0, 'Numeração é para quando a ordem importa, como um passo a passo.'),
      Q('p5', 'Como criar um subitem dentro de uma lista?', ['Apertando Tab', 'Apertando Esc', 'Apertando Delete', 'Apertando F5'], 0, 'O Tab empurra o item para dentro; Shift + Tab volta.'),
    ],
  };

  C['d3-a06'] = {
    titulo: 'Estilos e organização do documento',
    subtitulo: 'Títulos, estilos prontos, quebra de página, cabeçalho, rodapé, número de página e sumário automático.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Estilos prontos', blocos: [
        { p: 'Na Página Inicial, o grupo **Estilos** tem formatações prontas: **Normal**, **Título**, **Título 1**, **Título 2**... Com um clique, o parágrafo ganha fonte, tamanho e cor combinando.' },
        { passos: [
          'Coloque o cursor na linha do título.',
          'Clique em **Título 1** no grupo Estilos.',
          'Faça o mesmo com os outros títulos do documento.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Por que usar estilos?', texto: 'Se você quiser mudar a cor de todos os títulos, basta mudar o estilo uma vez. E os estilos ainda permitem criar o **sumário automático**.' } },
      ] },
      { id: 'p2', titulo: 'Quebra de página', blocos: [
        { p: 'Para começar um capítulo numa **página nova**, não aperte {{Enter}} várias vezes até a página acabar. Use a **quebra de página**:' },
        { atalhos: [['Ctrl+Enter', 'Insere uma quebra de página (ou guia Inserir > Quebra de Página)']] },
        { p: 'Assim, mesmo que você acrescente texto antes, o capítulo continua começando no topo da página.' },
      ] },
      { id: 'p3', titulo: 'Cabeçalho e rodapé', blocos: [
        { p: 'O **cabeçalho** é a área no alto de todas as páginas; o **rodapé**, a área embaixo. O que você escreve ali se **repete em todas as páginas**.' },
        { passos: [
          'Guia **Inserir** > **Cabeçalho** (ou **Rodapé**) > escolha um modelo.',
          'Digite o texto, como o nome da escola ou da empresa.',
          'Clique em **Fechar Cabeçalho e Rodapé** (ou dê clique duplo na página) para voltar ao texto.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Atalho com o mouse', texto: 'Um **clique duplo** na parte de cima ou de baixo da página abre o cabeçalho ou o rodapé.' } },
      ] },
      { id: 'p4', titulo: 'Número de página', blocos: [
        { passos: [
          'Guia **Inserir** > **Número de Página**.',
          'Escolha a posição: **Início da Página** ou **Fim da Página**, à direita, centro ou esquerda.',
          'O Word numera todas as páginas sozinho e atualiza quando você acrescenta páginas.',
        ] },
        { p: 'Para não mostrar o número na capa, marque **Primeira Página Diferente** nas opções de cabeçalho e rodapé.' },
      ] },
      { id: 'p5', titulo: 'Margens, orientação e sumário', blocos: [
        { p: 'Na guia **Layout** você ajusta a folha:' },
        { lista: [
          '**Margens:** o espaço em branco nas bordas. A ABNT pede 3 cm em cima e à esquerda e 2 cm embaixo e à direita.',
          '**Orientação:** **Retrato** (em pé, o padrão) ou **Paisagem** (deitada, boa para tabelas largas e cartazes).',
          '**Tamanho:** quase sempre **A4**.',
        ] },
        { h: 'Sumário automático' },
        { p: 'Se os títulos usam os estilos **Título 1** e **Título 2**, vá em **Referências** > **Sumário** e escolha um modelo. O Word monta a lista com os números das páginas. Se o texto mudar, clique em **Atualizar Sumário**.' },
      ] },
    ],
    perguntas: [
      Q('p1', 'Onde ficam os estilos prontos, como Título 1?', ['No grupo Estilos da Página Inicial', 'Na guia Exibir', 'Na barra de status', 'No menu Iniciar'], 0, 'Os estilos ficam na Página Inicial, grupo Estilos.'),
      Q('p1', 'Qual vantagem de usar estilos nos títulos?', ['Mudar todos os títulos de uma vez e criar sumário automático', 'Deixar o documento mais pesado', 'Impedir a impressão', 'Nenhuma'], 0, 'Estilos padronizam os títulos e permitem o sumário automático.'),
      Q('p2', 'Qual atalho insere uma quebra de página?', ['Ctrl + Enter', 'Shift + Enter', 'Alt + Enter', 'Enter várias vezes'], 0, 'Ctrl + Enter começa uma nova página.'),
      Q('p2', 'Por que usar a quebra de página em vez de vários Enter?', ['O capítulo continua no topo da página mesmo se o texto mudar', 'É mais bonito', 'Gasta menos tinta', 'Não há diferença'], 0, 'Com vários Enter, o texto se desloca quando você acrescenta algo antes.'),
      Q('p3', 'O que é escrito no cabeçalho aparece:', ['Em todas as páginas', 'Só na primeira página', 'Só na última página', 'Só na tela'], 0, 'Cabeçalho e rodapé se repetem em todas as páginas.'),
      Q('p3', 'Como abrir o cabeçalho rapidamente?', ['Clique duplo no alto da página', 'Ctrl + Z', 'Win + D', 'Botão Imprimir'], 0, 'O clique duplo no alto da página abre o cabeçalho.'),
      Q('p4', 'Onde inserir o número de página?', ['Inserir > Número de Página', 'Revisão > Ortografia', 'Exibir > Zoom', 'Arquivo > Fechar'], 0, 'A guia Inserir tem a opção Número de Página.'),
      Q('p4', 'Para não mostrar o número na capa, marque:', ['Primeira Página Diferente', 'Paisagem', 'Negrito', 'Justificado'], 0, 'Primeira Página Diferente esconde o cabeçalho e rodapé da primeira página.'),
      Q('p5', 'Qual orientação deixa a folha deitada?', ['Paisagem', 'Retrato', 'A4', 'Margem'], 0, 'Paisagem é a folha deitada; Retrato, em pé.'),
      Q('p5', 'Para o sumário automático funcionar, os títulos devem usar:', ['Os estilos de Título', 'Cor vermelha', 'Letras maiúsculas', 'Sublinhado'], 0, 'O sumário é montado a partir dos estilos Título 1, Título 2...'),
    ],
  };

  C['d3-a07'] = {
    titulo: 'Inserindo imagens, tabelas e formas',
    subtitulo: 'Deixe o documento mais visual e organizado com figuras, tabelas e formas.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Inserindo imagens', blocos: [
        { passos: [
          'Coloque o cursor onde a imagem vai ficar.',
          'Guia **Inserir** > **Imagens** [[imagem]].',
          'Escolha **Este Dispositivo** (uma foto do computador) ou **Imagens Online**.',
          'Selecione a imagem e clique em **Inserir**.',
        ] },
        { p: 'Para mudar o tamanho, clique na imagem e arraste as **bolinhas dos cantos**. Pelos cantos, a imagem não fica distorcida.' },
        { destaque: { tom: 'dica', titulo: 'Copiar e colar também vale', texto: 'Você pode copiar uma imagem ({{Ctrl+C}}) de outro lugar e colar ({{Ctrl+V}}) direto no Word.' } },
      ] },
      { id: 'p2', titulo: 'Posição da imagem no texto', blocos: [
        { p: 'Ao clicar na imagem, aparece o botão **Opções de Layout** ao lado dela. Ele define como o texto fica em volta:' },
        { tabela: { cab: ['Opção', 'Como fica'], linhas: [
          ['Alinhado com o texto', 'A imagem se comporta como uma letra grande (o padrão)'],
          ['Quadrado', 'O texto contorna a imagem pelos lados'],
          ['Atrás do texto', 'A imagem vira fundo, com o texto por cima'],
          ['Na frente do texto', 'A imagem fica por cima, tapando o texto'],
        ] } },
        { p: 'Com **Quadrado**, você pode arrastar a imagem livremente pela página.' },
      ] },
      { id: 'p3', titulo: 'Criando tabelas', blocos: [
        { p: 'Tabelas [[tabela]] organizam informações em **linhas** e **colunas**, como horários, listas de preços e cronogramas.' },
        { passos: [
          'Guia **Inserir** > **Tabela**.',
          'Passe o mouse sobre os quadradinhos para escolher quantas colunas e linhas (por exemplo, 3 x 4) e clique.',
          'Clique numa célula e digite. Use {{Tab}} para ir para a próxima célula.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Tab na última célula', texto: 'Apertar {{Tab}} na última célula da tabela cria uma **linha nova** automaticamente.' } },
      ] },
      { id: 'p4', titulo: 'Formatando tabelas', blocos: [
        { p: 'Com o cursor dentro da tabela, aparecem as guias **Design da Tabela** e **Layout**:' },
        { lista: [
          '**Estilos de Tabela:** modelos prontos com cores e bordas.',
          '**Inserir acima / abaixo / à esquerda / à direita:** acrescenta linhas e colunas.',
          '**Excluir:** remove linhas, colunas ou a tabela inteira.',
          '**Mesclar células:** junta várias células numa só, bom para títulos.',
        ] },
        { p: 'Para ajustar a largura das colunas, arraste as linhas divisórias com o mouse.' },
      ] },
      { id: 'p5', titulo: 'Formas, ícones e WordArt', blocos: [
        { cards: [
          { ico: 'estrela', t: 'Formas', d: 'Inserir > Formas: setas, círculos, balões. Clique e arraste na página para desenhar.' },
          { ico: 'coracao', t: 'Ícones', d: 'Inserir > Ícones: desenhos simples, prontos para usar.' },
          { ico: 'fonte', t: 'WordArt', d: 'Inserir > WordArt: títulos com efeitos de cor e sombra.' },
          { ico: 'grafico', t: 'Gráficos', d: 'Inserir > Gráfico: colunas e pizza dentro do texto.' },
        ] },
        { destaque: { tom: 'dica', titulo: 'Para cartazes', texto: 'Use a orientação **Paisagem**, um título em **WordArt**, uma imagem grande e pouco texto, com letras grandes.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Em qual guia fica a opção de inserir imagens?', ['Inserir', 'Revisão', 'Exibir', 'Página Inicial'], 0, 'Imagens, tabelas e formas ficam na guia Inserir.'),
      Q('p1', 'Como mudar o tamanho da imagem sem distorcer?', ['Arrastando as bolinhas dos cantos', 'Arrastando as bolinhas do meio dos lados', 'Apertando Delete', 'Mudando a fonte'], 0, 'Pelos cantos, a imagem mantém a proporção.'),
      Q('p2', 'Qual opção faz o texto contornar a imagem pelos lados?', ['Quadrado', 'Atrás do texto', 'Na frente do texto', 'Alinhado com o texto'], 0, 'Com Quadrado, o texto contorna a imagem.'),
      Q('p2', 'Qual opção transforma a imagem em fundo, com o texto por cima?', ['Atrás do texto', 'Quadrado', 'Alinhado com o texto', 'Na frente do texto'], 0, 'Atrás do texto deixa a imagem como fundo.'),
      Q('p3', 'Tabelas organizam informações em:', ['Linhas e colunas', 'Páginas e capítulos', 'Cores e fontes', 'Pastas e arquivos'], 0, 'Tabelas têm linhas e colunas.'),
      Q('p3', 'O que acontece ao apertar Tab na última célula da tabela?', ['Cria uma linha nova', 'Apaga a tabela', 'Fecha o Word', 'Imprime'], 0, 'Tab na última célula cria uma nova linha.'),
      Q('p4', 'Para juntar várias células numa só, use:', ['Mesclar células', 'Excluir tabela', 'Negrito', 'Zoom'], 0, 'Mesclar células junta as células selecionadas.'),
      Q('p4', 'Onde ficam os modelos prontos de cores para a tabela?', ['Estilos de Tabela, na guia Design da Tabela', 'Na barra de status', 'No menu Iniciar', 'Na guia Exibir'], 0, 'Os Estilos de Tabela ficam na guia Design da Tabela.'),
      Q('p5', 'Como desenhar uma seta ou um círculo no documento?', ['Inserir > Formas', 'Página Inicial > Negrito', 'Revisão > Ortografia', 'Layout > Margens'], 0, 'Em Inserir > Formas você desenha setas, círculos e balões.'),
      Q('p5', 'O WordArt serve para:', ['Títulos com efeitos de cor e sombra', 'Corrigir ortografia', 'Salvar em PDF', 'Contar palavras'], 0, 'WordArt cria títulos com efeitos.'),
    ],
  };

  C['d3-a08'] = {
    titulo: 'Salvando, exportando e imprimindo',
    subtitulo: 'Salvar, Salvar como, gerar PDF e imprimir o documento do jeito certo, sem perder nada.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Por que salvar', blocos: [
        { p: 'Enquanto você escreve, o texto está só na **memória RAM**. Se faltar energia ou o computador travar, o que não foi salvo **se perde**. **Salvar** [[salvar]] guarda o documento como um arquivo no armazenamento.' },
        { destaque: { tom: 'atencao', titulo: 'Salve cedo, salve sempre', texto: 'Salve logo no começo, dando um nome ao arquivo, e depois aperte {{Ctrl+B}} de tempos em tempos (no Word em português).' } },
      ] },
      { id: 'p2', titulo: 'Salvando pela primeira vez', blocos: [
        { passos: [
          'Clique em **Arquivo** > **Salvar como** (ou aperte {{Ctrl+B}} num documento novo).',
          'Clique em **Procurar** e escolha a pasta, por exemplo **Documentos**.',
          'Em **Nome do arquivo**, escreva um nome que diga o que é: **curriculo-joao**.',
          'Clique em **Salvar**.',
        ] },
        { p: 'Depois disso, o nome aparece na barra de título. As próximas vezes, {{Ctrl+B}} só **atualiza** o mesmo arquivo, sem perguntar nada.' },
      ] },
      { id: 'p3', titulo: 'Salvar x Salvar como', blocos: [
        { compara: {
          a: { t: 'Salvar', ico: 'salvar', itens: ['Atualiza o **mesmo arquivo**', 'Não pergunta nada (depois da primeira vez)', 'Use o tempo todo'] },
          b: { t: 'Salvar como', ico: 'copiar', itens: ['Cria um **novo arquivo**', 'Pergunta o nome e a pasta', 'Use para fazer uma cópia com outro nome ou outro formato'] },
        } },
        { destaque: { tom: 'saiba', titulo: 'Salvamento automático', texto: 'Se o arquivo estiver no **OneDrive** (a nuvem da Microsoft), o Word pode salvar sozinho a cada alteração: é o botão **Salvamento Automático** no canto de cima.' } },
      ] },
      { id: 'p4', titulo: 'Gerando um PDF', blocos: [
        { p: 'O **PDF** é o formato ideal para **enviar** documentos: abre igual em qualquer computador ou celular, e ninguém altera sem querer. Currículos, por exemplo, devem ser enviados em PDF.' },
        { passos: [
          '**Arquivo** > **Salvar como** (ou **Exportar** > **Criar PDF**).',
          'Em **Tipo**, escolha **PDF (*.pdf)**.',
          'Escolha a pasta e clique em **Salvar**.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Guarde o .docx também', texto: 'O PDF é para enviar. Guarde também o arquivo .docx original, para poder editar depois.' } },
      ] },
      { id: 'p5', titulo: 'Imprimindo', blocos: [
        { passos: [
          'Aperte {{Ctrl+P}} (ou **Arquivo** > **Imprimir**) [[impressora]].',
          'Confira a **visualização** do lado direito: é assim que vai sair no papel.',
          'Escolha a **impressora**, o número de **cópias** e quais **páginas** (todas, a atual ou, por exemplo, **1-3**).',
          'Clique em **Imprimir**.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Economize papel', texto: 'Antes de imprimir, sempre confira a visualização. Uma linha sobrando pode virar uma página inteira quase em branco.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Por que é importante salvar o documento?', ['Porque o que não foi salvo pode se perder se o computador desligar', 'Para deixar o texto colorido', 'Para imprimir mais rápido', 'Não é importante'], 0, 'O texto não salvo está só na RAM e se perde ao desligar.'),
      Q('p1', 'No Word em português, qual atalho salva o documento?', ['Ctrl + B', 'Ctrl + S', 'Ctrl + N', 'Ctrl + P'], 0, 'No Word em português, Ctrl + B salva.'),
      Q('p2', 'Ao salvar pela primeira vez, o que você escolhe?', ['O nome do arquivo e a pasta', 'A cor da fonte', 'O papel de parede', 'A impressora'], 0, 'Na primeira vez, o Word pergunta o nome e o local.'),
      Q('p2', 'Depois de salvo uma vez, o Ctrl + B:', ['Atualiza o mesmo arquivo', 'Cria outro arquivo', 'Apaga o arquivo', 'Imprime'], 0, 'Ele só atualiza o arquivo, sem perguntar.'),
      Q('p3', 'Quando usar “Salvar como”?', ['Para criar uma cópia com outro nome ou formato', 'Sempre que digitar uma letra', 'Para fechar o Word', 'Para mudar a fonte'], 0, 'Salvar como cria um novo arquivo.'),
      Q('p3', 'Onde o Word pode salvar automaticamente a cada alteração?', ['Quando o arquivo está no OneDrive', 'No pendrive sempre', 'Na Lixeira', 'Em lugar nenhum'], 0, 'Com o arquivo no OneDrive, o Salvamento Automático funciona.'),
      Q('p4', 'Por que enviar currículos em PDF?', ['Abre igual em qualquer aparelho e não é alterado sem querer', 'É mais colorido', 'Ocupa mais espaço', 'Só abre no Word'], 0, 'O PDF mantém a aparência e é ideal para enviar.'),
      Q('p4', 'Como gerar um PDF no Word?', ['Salvar como > Tipo: PDF', 'Ctrl + Z', 'Inserir > Tabela', 'Revisão > Ortografia'], 0, 'Em Salvar como, escolha o tipo PDF.'),
      Q('p5', 'Qual atalho abre a tela de impressão?', ['Ctrl + P', 'Ctrl + I', 'Ctrl + B', 'Ctrl + E'], 0, 'Ctrl + P abre a impressão (P de print).'),
      Q('p5', 'Para imprimir só as páginas de 1 a 3, você escreve:', ['1-3', '1+3', '1x3', '13'], 0, 'O hífen indica um intervalo: 1-3 imprime as páginas 1, 2 e 3.'),
    ],
  };

  C['d3-a09'] = {
    titulo: 'Revisão e atalhos úteis no Word',
    subtitulo: 'Corretor ortográfico, contar palavras, sinônimos e os atalhos que mais ajudam no dia a dia.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Os sublinhados coloridos', blocos: [
        { p: 'Enquanto você digita, o Word revisa o texto e marca possíveis problemas:' },
        { tabela: { cab: ['Marca', 'O que significa'], linhas: [
          ['Ondinha **vermelha**', 'Possível erro de **ortografia** (palavra escrita errada ou desconhecida)'],
          ['Linha dupla **azul**', 'Possível erro de **gramática** ou de concordância'],
        ] } },
        { p: 'Clique com o **botão direito** na palavra marcada para ver as **sugestões** e escolher a correta.' },
        { destaque: { tom: 'atencao', titulo: 'O corretor também erra', texto: 'Nomes próprios e palavras novas aparecem sublinhados mesmo estando certos. E palavras certas no lugar errado (“mas” e “mais”) podem passar. Releia sempre.' } },
      ] },
      { id: 'p2', titulo: 'Revisão completa', blocos: [
        { p: 'Na guia **Revisão**, o botão **Editor** (ou **Ortografia e Gramática**, tecla {{F7}}) passa por todo o texto, mostrando um problema de cada vez.' },
        { lista: [
          '**Alterar:** troca pela sugestão.',
          '**Ignorar:** deixa como está desta vez.',
          '**Adicionar ao dicionário:** o Word aprende a palavra e para de marcar (bom para nomes).',
        ] },
        { p: 'Confira se o idioma do texto está como **Português (Brasil)**, na barra de status.' },
      ] },
      { id: 'p3', titulo: 'Contar palavras e sinônimos', blocos: [
        { p: 'Trabalhos às vezes pedem um número mínimo de palavras. Em **Revisão** > **Contar Palavras**, o Word mostra palavras, caracteres, parágrafos e páginas.' },
        { p: 'Usou a mesma palavra muitas vezes? Clique nela com o botão direito > **Sinônimos** e escolha outra com o mesmo sentido.' },
        { destaque: { tom: 'dica', titulo: 'Ler em voz alta', texto: 'Em **Revisão** > **Ler em Voz Alta** [[som]], o Word lê o texto para você. Ouvir ajuda a perceber frases confusas e palavras faltando.' } },
      ] },
      { id: 'p4', titulo: 'Os atalhos mais úteis', blocos: [
        { p: 'Atalhos do **Word em português**:' },
        { atalhos: [
          ['Ctrl+B', 'Salvar'],
          ['Ctrl+P', 'Imprimir'],
          ['Ctrl+O', 'Novo documento'],
          ['Ctrl+A', 'Abrir um documento'],
          ['Ctrl+T', 'Selecionar tudo'],
          ['Ctrl+N / Ctrl+I / Ctrl+S', 'Negrito / Itálico / Sublinhado'],
          ['Ctrl+Z / Ctrl+R', 'Desfazer / Refazer'],
          ['Ctrl+Enter', 'Quebra de página'],
        ] },
        { destaque: { tom: 'saiba', titulo: 'Word em inglês ou on-line', texto: 'Em outras versões, alguns atalhos mudam: {{Ctrl+S}} salva, {{Ctrl+B}} é negrito e {{Ctrl+A}} seleciona tudo. Passe o mouse sobre um botão: o Word mostra o atalho dele.' } },
      ] },
      { id: 'p5', titulo: 'Montando um currículo', blocos: [
        { p: 'Vamos juntar tudo o que você aprendeu nesta disciplina numa tarefa real: um **currículo** simples.' },
        { passos: [
          'Seu **nome** no topo, centralizado, em negrito e tamanho 18.',
          '**Contatos**: telefone, e-mail e cidade, tamanho 11.',
          'Títulos com o estilo **Título 1**: Objetivo, Formação, Experiência, Cursos.',
          'Itens em **lista com marcadores**.',
          'Revise a **ortografia** com {{F7}}.',
          'Salve como **.docx** e gere um **PDF** para enviar.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Coloque este curso', texto: 'Na parte de Cursos, você já pode colocar: **Informática Básica — HC Instituto Educacional**.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que significa a ondinha vermelha embaixo de uma palavra?', ['Possível erro de ortografia', 'Que a palavra está em negrito', 'Que é um link', 'Que a palavra foi salva'], 0, 'A ondinha vermelha indica possível erro de ortografia.'),
      Q('p1', 'Como ver as sugestões de correção de uma palavra?', ['Clicando nela com o botão direito', 'Apertando Delete', 'Fechando o Word', 'Mudando a fonte'], 0, 'O botão direito mostra as sugestões.'),
      Q('p2', 'Qual tecla abre a revisão de ortografia e gramática?', ['F7', 'F2', 'F5', 'F12'], 0, 'F7 abre a revisão do texto.'),
      Q('p2', 'Para o Word parar de marcar um nome próprio, use:', ['Adicionar ao dicionário', 'Alterar', 'Excluir', 'Imprimir'], 0, 'Adicionar ao dicionário faz o Word aprender a palavra.'),
      Q('p3', 'Onde ver quantas palavras o texto tem, com detalhes?', ['Revisão > Contar Palavras', 'Inserir > Imagens', 'Layout > Margens', 'Arquivo > Fechar'], 0, 'Contar Palavras mostra palavras, caracteres e páginas.'),
      Q('p3', 'Para trocar uma palavra repetida por outra com o mesmo sentido, use:', ['Sinônimos', 'Substituir tudo', 'Negrito', 'Zoom'], 0, 'Os sinônimos sugerem palavras com o mesmo sentido.'),
      Q('p4', 'No Word em português, qual atalho cria um documento novo?', ['Ctrl + O', 'Ctrl + N', 'Ctrl + B', 'Ctrl + T'], 0, 'No Word em português, Ctrl + O cria um novo documento.'),
      Q('p4', 'No Word em português, qual atalho seleciona tudo?', ['Ctrl + T', 'Ctrl + A', 'Ctrl + S', 'Ctrl + Z'], 0, 'No Word em português, Ctrl + T seleciona tudo.'),
      Q('p5', 'Em que formato enviar o currículo?', ['PDF', '.txt', '.exe', '.mp3'], 0, 'O PDF mantém a aparência do currículo em qualquer aparelho.'),
      Q('p5', 'Como organizar os títulos do currículo (Objetivo, Formação...)?', ['Com o estilo Título 1', 'Com vários espaços', 'Tudo em vermelho', 'Com a tecla Caps Lock'], 0, 'O estilo Título 1 padroniza os títulos.'),
    ],
  };

  C['d3-av'] = {
    titulo: 'Avaliação: Editor de Textos (Word)',
    subtitulo: '30 perguntas sobre as Aulas 01 a 09. Não há material para consultar: responda com o que você aprendeu.',
    avaliacao: { aulas: ['d3-a01', 'd3-a02', 'd3-a03', 'd3-a04', 'd3-a05', 'd3-a06', 'd3-a07', 'd3-a08', 'd3-a09'] },
  };
})();
