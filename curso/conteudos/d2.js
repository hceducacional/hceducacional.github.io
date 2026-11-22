/* =========================================================
   DISCIPLINA 2 — SISTEMA OPERACIONAL WINDOWS (curso "Informática do zero")
   Aulas 01 a 09 + Aula 10 (avaliação). Formato dos blocos: veja curso/conteudos/d1.js.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
(() => {
  const C = window.HC_CONTEUDOS;
  const Q = (parte, q, op, certa, exp) => ({ parte, q, op, certa, exp });

  C['d2-a01'] = {
    titulo: 'O que é um sistema operacional?',
    subtitulo: 'O programa mais importante do computador: o que ele faz, por que precisamos dele e quais são os mais usados.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O “gerente” do computador', blocos: [
        { p: 'O **sistema operacional** (ou **SO**) é o programa que **comanda o computador inteiro**. Ele é o primeiro a ser carregado quando você liga a máquina e o último a fechar quando você desliga.' },
        { p: 'Pense num restaurante: os clientes (você) fazem os pedidos, a cozinha (o hardware) prepara a comida e o **gerente** organiza tudo para dar certo. O sistema operacional é esse gerente [[engrenagem]].' },
        { fig: 'camadas', legenda: 'O sistema operacional fica entre os programas e as peças do computador.' },
      ] },
      { id: 'p2', titulo: 'O que o sistema operacional faz', blocos: [
        { cards: [
          { ico: 'janela', t: 'Mostra a tela', d: 'Desenha as janelas, os ícones e a setinha do mouse.' },
          { ico: 'cpu', t: 'Divide o trabalho', d: 'Decide quanto do processador e da memória cada programa usa.' },
          { ico: 'pasta', t: 'Organiza os arquivos', d: 'Guarda e encontra os seus documentos nas pastas.' },
          { ico: 'impressora', t: 'Conversa com os aparelhos', d: 'Faz o teclado, o mouse, a impressora e o Wi-Fi funcionarem.' },
          { ico: 'cadeado', t: 'Protege', d: 'Controla senhas, contas de usuário e atualizações de segurança.' },
          { ico: 'codigo', t: 'Roda os programas', d: 'Abre e fecha os aplicativos que você usa.' },
        ] },
        { destaque: { tom: 'saiba', titulo: 'Sem ele, nada funciona', texto: 'Um computador sem sistema operacional liga, mas mostra só uma tela preta com uma mensagem de erro. Os programas como Word e navegador precisam do sistema para funcionar.' } },
      ] },
      { id: 'p3', titulo: 'Os sistemas mais usados', blocos: [
        { tabela: { cab: ['Sistema', 'Onde é usado', 'Quem faz'], linhas: [
          ['Windows', 'A maioria dos computadores e notebooks', 'Microsoft'],
          ['macOS', 'Computadores da Apple (Mac)', 'Apple'],
          ['Linux', 'Servidores, computadores de escolas e de quem gosta de software livre', 'Comunidade (gratuito)'],
          ['Android', 'A maioria dos celulares e tablets', 'Google'],
          ['iOS e iPadOS', 'iPhone e iPad', 'Apple'],
        ] } },
        { p: 'Neste curso vamos estudar o **Windows** [[win]], que é o mais usado nos computadores do Brasil, em casa e nas empresas.' },
      ] },
      { id: 'p4', titulo: 'As versões do Windows', blocos: [
        { p: 'O Windows existe desde 1985 e ganhou várias versões. As mais comuns hoje são o **Windows 10** e o **Windows 11**.' },
        { linha: [
          ['1985', 'Windows 1.0: as primeiras janelas.'],
          ['1995', 'Windows 95: estreia do botão **Iniciar** e da barra de tarefas.'],
          ['2001', 'Windows XP: muito popular por muitos anos.'],
          ['2015', 'Windows 10: usado até hoje em muitos computadores.'],
          ['2021', 'Windows 11: visual mais moderno, com o menu Iniciar no centro.'],
        ] },
        { destaque: { tom: 'dica', titulo: '10 ou 11?', texto: 'As duas versões funcionam de um jeito parecido. A diferença mais visível é que no Windows 11 o botão Iniciar fica no **centro** da barra de tarefas; no 10, fica no **canto esquerdo**.' } },
      ] },
      { id: 'p5', titulo: 'Contas de usuário e senha', blocos: [
        { p: 'Um mesmo computador pode ser usado por várias pessoas. Para cada uma, o Windows cria uma **conta de usuário** [[usuario]], com seus arquivos, papel de parede e configurações.' },
        { lista: [
          '**Administrador:** pode instalar programas e mudar configurações importantes.',
          '**Usuário padrão:** usa o computador normalmente, mas precisa de permissão para mudanças grandes.',
        ] },
        { p: 'Ao ligar, aparece a **tela de bloqueio**. Clique ou aperte uma tecla, escolha o seu usuário e digite a **senha** ou o **PIN** (uma senha só de números).' },
        { destaque: { tom: 'atencao', titulo: 'Saindo de perto?', texto: 'Aperte {{Win+L}} para **bloquear** o computador. Tudo continua aberto, mas ninguém mexe sem a sua senha.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é o sistema operacional?', ['Um jogo', 'O programa que comanda o computador inteiro', 'Uma peça dentro do gabinete', 'Um tipo de mouse'], 1, 'O sistema operacional é o programa principal, que organiza todo o funcionamento.'),
      Q('p1', 'Na comparação do texto, o sistema operacional é como:', ['O cliente do restaurante', 'O gerente que organiza tudo', 'A comida', 'A mesa'], 1, 'Ele é o gerente: recebe os pedidos e organiza o trabalho do hardware.'),
      Q('p2', 'Qual destas é uma função do sistema operacional?', ['Fazer café', 'Organizar os arquivos nas pastas', 'Trocar a tela quebrada', 'Ligar a energia elétrica da casa'], 1, 'O sistema guarda e encontra os arquivos nas pastas.'),
      Q('p2', 'O que acontece com um computador sem sistema operacional?', ['Funciona normalmente', 'Mostra só uma tela preta com erro', 'Fica mais rápido', 'Abre o Word sozinho'], 1, 'Sem sistema, os programas não funcionam.'),
      Q('p3', 'Qual sistema operacional é o mais usado nos computadores do Brasil?', ['Android', 'Windows', 'iOS', 'Excel'], 1, 'O Windows é o mais usado nos computadores e notebooks.'),
      Q('p3', 'Android e iOS são sistemas usados principalmente em:', ['Celulares e tablets', 'Impressoras', 'Televisões antigas', 'Calculadoras'], 0, 'Android e iOS são os sistemas dos celulares e tablets.'),
      Q('p4', 'Em qual versão estreou o botão Iniciar?', ['Windows 1.0', 'Windows 95', 'Windows 11', 'Windows XP'], 1, 'O Windows 95 trouxe o botão Iniciar e a barra de tarefas.'),
      Q('p4', 'No Windows 11, onde fica o botão Iniciar?', ['No canto superior direito', 'No centro da barra de tarefas', 'Escondido no teclado', 'Na Lixeira'], 1, 'No Windows 11 o Iniciar fica no centro; no Windows 10, no canto esquerdo.'),
      Q('p5', 'Qual conta pode instalar programas e mudar configurações importantes?', ['Usuário padrão', 'Administrador', 'Visitante', 'Qualquer conta'], 1, 'A conta de administrador tem permissão para mudanças grandes.'),
      Q('p5', 'Qual atalho bloqueia o computador quando você sai de perto?', ['Win + L', 'Ctrl + C', 'Alt + F4', 'Shift + Enter'], 0, 'Win + L bloqueia a tela: tudo continua aberto, mas protegido pela senha.'),
    ],
  };

  C['d2-a02'] = {
    titulo: 'Conhecendo a área de trabalho',
    subtitulo: 'A primeira tela do Windows: ícones, papel de parede, barra de tarefas e área de notificação.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'A tela principal', blocos: [
        { p: 'Depois de entrar com a sua senha, aparece a **área de trabalho** (em inglês, *desktop*). Ela é como a **mesa** onde você espalha o que está usando.' },
        { fig: 'desktop', legenda: 'As partes da área de trabalho do Windows.' },
        { p: 'Ela tem três partes principais: os **ícones**, o **papel de parede** (a imagem de fundo) e a **barra de tarefas**, a faixa na parte de baixo.' },
      ] },
      { id: 'p2', titulo: 'Os ícones', blocos: [
        { p: '**Ícones** são as figurinhas com um nome embaixo. Cada um representa um programa, uma pasta ou um arquivo. Para abrir, dê um **clique duplo** [[clique]].' },
        { cards: [
          { ico: 'lixeira', t: 'Lixeira', d: 'Guarda os arquivos apagados, até você esvaziar.' },
          { ico: 'monitor', t: 'Este Computador', d: 'Mostra os discos e pendrives conectados.' },
          { ico: 'pasta', t: 'Pastas', d: 'Guardam arquivos dentro delas.' },
          { ico: 'link', t: 'Atalhos', d: 'Ícones com uma setinha no canto: abrem algo que está guardado em outro lugar.' },
        ] },
        { destaque: { tom: 'saiba', titulo: 'Atalho não é o arquivo', texto: 'Apagar um **atalho** (o ícone com a setinha) não apaga o programa nem o arquivo de verdade. Ele é só um caminho rápido até lá.' } },
      ] },
      { id: 'p3', titulo: 'A barra de tarefas', blocos: [
        { p: 'A **barra de tarefas** é a faixa na parte de baixo da tela. Ela fica sempre visível e mostra:' },
        { lista: [
          'O botão **Iniciar** [[win]], que abre o menu com todos os programas.',
          'A caixa ou o botão de **Pesquisa** [[lupa]], para procurar programas e arquivos.',
          'Os **programas fixados** e os que estão **abertos** (com um tracinho embaixo).',
          'A **área de notificação**, no canto direito.',
        ] },
        { p: 'Para trocar de programa, basta clicar no ícone dele na barra de tarefas.' },
      ] },
      { id: 'p4', titulo: 'A área de notificação', blocos: [
        { p: 'No canto direito da barra de tarefas ficam ícones pequenos com informações importantes:' },
        { tabela: { cab: ['Ícone', 'O que mostra'], linhas: [
          ['Relógio e data', 'A hora certa. Clique para ver o calendário.'],
          ['Wi-Fi ou rede', 'Se a internet está conectada.'],
          ['Volume', 'O som. Clique para aumentar ou diminuir.'],
          ['Bateria', 'No notebook, quanto de carga resta.'],
          ['Notificações', 'Avisos dos programas e do sistema.'],
          ['Setinha para cima ( ^ )', 'Mostra os ícones escondidos.'],
        ] } },
      ] },
      { id: 'p5', titulo: 'Organizando a área de trabalho', blocos: [
        { p: 'Clique com o **botão direito** num espaço vazio da área de trabalho para ver as opções:' },
        { checklist: [
          '**Exibir:** muda o tamanho dos ícones (grandes, médios ou pequenos).',
          '**Classificar por:** organiza os ícones por nome, tamanho ou data.',
          '**Atualizar:** recarrega a tela.',
          '**Novo:** cria uma pasta ou um atalho ali mesmo.',
          '**Personalizar:** troca o papel de parede e as cores.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Mesa limpa, mente tranquila', texto: 'Evite encher a área de trabalho de arquivos. Guarde-os em pastas, como **Documentos** e **Imagens**, e deixe ali só os atalhos que você usa todo dia.' } },
        { destaque: { tom: 'saiba', titulo: 'Ver a área de trabalho', texto: 'Com várias janelas abertas, aperte {{Win+D}} para escondê-las e ver a área de trabalho. Aperte de novo para voltar.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Como se chama a primeira tela do Windows depois de entrar com a senha?', ['Área de trabalho', 'Painel de fórmulas', 'Página inicial do Word', 'Tela de impressão'], 0, 'É a área de trabalho, também chamada de desktop.'),
      Q('p1', 'Como se chama a imagem de fundo da área de trabalho?', ['Barra de tarefas', 'Papel de parede', 'Ícone', 'Menu'], 1, 'A imagem de fundo é o papel de parede.'),
      Q('p2', 'Como abrir um ícone da área de trabalho?', ['Com um clique duplo', 'Com a rodinha do mouse', 'Apertando Esc', 'Arrastando para a Lixeira'], 0, 'Na área de trabalho, o clique duplo abre o ícone.'),
      Q('p2', 'O que acontece se você apagar um atalho?', ['O programa é desinstalado', 'Só o caminho rápido some; o programa continua', 'O computador desliga', 'A internet cai'], 1, 'O atalho é só um caminho. O programa ou arquivo de verdade continua guardado.'),
      Q('p3', 'Onde fica a barra de tarefas?', ['Na parte de baixo da tela', 'Dentro da Lixeira', 'No teclado', 'Só no celular'], 0, 'A barra de tarefas é a faixa na parte de baixo da tela.'),
      Q('p3', 'Como trocar de um programa aberto para outro?', ['Desligando o computador', 'Clicando no ícone dele na barra de tarefas', 'Apagando o outro programa', 'Trocando o papel de parede'], 1, 'Os programas abertos aparecem na barra de tarefas; basta clicar.'),
      Q('p4', 'Onde você vê se a internet está conectada?', ['Na área de notificação, no ícone de Wi-Fi ou rede', 'No papel de parede', 'Na Lixeira', 'No botão Iniciar'], 0, 'O ícone de rede fica na área de notificação, no canto direito.'),
      Q('p4', 'Para que serve a setinha para cima ( ^ ) na área de notificação?', ['Desligar', 'Mostrar os ícones escondidos', 'Aumentar o volume', 'Abrir o Word'], 1, 'Ela mostra os ícones que não cabem na barra.'),
      Q('p5', 'Como mudar o tamanho dos ícones da área de trabalho?', ['Botão direito > Exibir', 'Apertando Enter', 'Desligando o monitor', 'Pela Lixeira'], 0, 'No botão direito, a opção Exibir muda o tamanho dos ícones.'),
      Q('p5', 'Qual atalho mostra a área de trabalho, escondendo as janelas?', ['Win + D', 'Ctrl + Z', 'Ctrl + P', 'Alt + Enter'], 0, 'Win + D mostra a área de trabalho; apertando de novo, as janelas voltam.'),
    ],
  };

  C['d2-a03'] = {
    titulo: 'Menu Iniciar e barra de tarefas',
    subtitulo: 'Como encontrar e abrir qualquer programa, fixar os favoritos e usar a pesquisa do Windows.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O botão Iniciar', blocos: [
        { p: 'O **botão Iniciar** [[win]] tem o símbolo do Windows (quatro quadradinhos). É o ponto de partida para quase tudo: abrir programas, configurações e desligar o computador.' },
        { p: 'Para abrir o menu Iniciar, **clique no botão** ou aperte a tecla {{Win}} do teclado.' },
        { cards: [
          { ico: 'estrela', t: 'Fixados', d: 'Os programas que você mais usa, sempre à mão.' },
          { ico: 'lista', t: 'Todos os aplicativos', d: 'A lista completa, em ordem alfabética.' },
          { ico: 'relogio', t: 'Recomendados', d: 'Arquivos e programas usados recentemente.' },
          { ico: 'power', t: 'Energia', d: 'Desligar, reiniciar ou suspender.' },
        ] },
      ] },
      { id: 'p2', titulo: 'Pesquisando no Windows', blocos: [
        { p: 'O jeito mais rápido de abrir qualquer coisa é **pesquisar**. Abra o menu Iniciar e já comece a digitar o nome do que procura: o Windows mostra os resultados na hora [[lupa]].' },
        { passos: [
          'Aperte {{Win}}.',
          'Digite, por exemplo, **calc**.',
          'A **Calculadora** aparece no topo. Aperte {{Enter}} para abrir.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Não precisa digitar tudo', texto: 'Poucas letras já bastam: “word”, “calc”, “bloco” (Bloco de Notas), “config” (Configurações). A pesquisa também encontra **arquivos** e **configurações**.' } },
      ] },
      { id: 'p3', titulo: 'Fixando programas', blocos: [
        { p: 'Os programas que você usa todo dia podem ficar **fixados**, sempre a um clique de distância:' },
        { passos: [
          'Encontre o programa no menu Iniciar (ou pela pesquisa).',
          'Clique nele com o **botão direito**.',
          'Escolha **Fixar em Iniciar** ou **Fixar na barra de tarefas**.',
        ] },
        { p: 'Para tirar, faça o mesmo caminho e escolha **Desafixar**. Desafixar não apaga o programa: ele só sai daquele lugar.' },
      ] },
      { id: 'p4', titulo: 'Usando a barra de tarefas', blocos: [
        { p: 'Na barra de tarefas, os programas **abertos** ganham um **tracinho embaixo** do ícone. O programa que você está usando agora tem o tracinho mais destacado.' },
        { lista: [
          '**Um clique** no ícone: mostra ou esconde a janela do programa.',
          '**Passar o mouse** sobre o ícone: aparece uma miniatura da janela.',
          '**Botão direito** no ícone: mostra os arquivos recentes e a opção de fechar a janela.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Visão de tarefas', texto: 'O botão **Visão de Tarefas** (ou {{Win+Tab}}) mostra todas as janelas abertas lado a lado. Clique na que você quer.' } },
      ] },
      { id: 'p5', titulo: 'Programas que vêm com o Windows', blocos: [
        { p: 'O Windows já vem com vários programas úteis. Experimente abrir cada um pela pesquisa:' },
        { tabela: { cab: ['Programa', 'Para que serve'], linhas: [
          ['Calculadora', 'Fazer contas, como uma calculadora de mesa'],
          ['Bloco de Notas', 'Escrever textos simples, sem formatação'],
          ['Paint', 'Fazer desenhos simples e editar imagens'],
          ['Ferramenta de Captura', 'Tirar foto (print) de um pedaço da tela'],
          ['Fotos', 'Ver as suas fotos e vídeos'],
          ['Microsoft Edge', 'Navegar na internet'],
          ['Configurações', 'Mudar as opções do computador'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Tarefa prática', texto: 'Fixe a **Calculadora** e o **Bloco de Notas** na barra de tarefas. Depois abra os dois e alterne entre eles clicando nos ícones.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual tecla abre o menu Iniciar?', ['Enter', 'Windows (Win)', 'Esc', 'Shift'], 1, 'A tecla com o símbolo do Windows abre o menu Iniciar.'),
      Q('p1', 'Onde encontramos a lista completa de programas?', ['Em Todos os aplicativos', 'Na Lixeira', 'No relógio', 'No papel de parede'], 0, 'No menu Iniciar, “Todos os aplicativos” mostra a lista completa.'),
      Q('p2', 'Qual o jeito mais rápido de abrir um programa?', ['Procurar em todas as pastas', 'Abrir o Iniciar e digitar o nome dele', 'Reiniciar o computador', 'Pedir ajuda'], 1, 'Abra o Iniciar e digite: o Windows mostra os resultados na hora.'),
      Q('p2', 'A pesquisa do Windows encontra:', ['Só programas', 'Programas, arquivos e configurações', 'Só fotos', 'Apenas sites'], 1, 'A pesquisa encontra programas, arquivos e configurações.'),
      Q('p3', 'Como fixar um programa na barra de tarefas?', ['Clique duplo nele', 'Botão direito > Fixar na barra de tarefas', 'Apertar Delete', 'Arrastar para a Lixeira'], 1, 'Com o botão direito, escolha “Fixar na barra de tarefas”.'),
      Q('p3', 'Desafixar um programa:', ['Apaga o programa', 'Só tira o ícone daquele lugar', 'Desliga o computador', 'Formata o computador'], 1, 'O programa continua instalado; só sai daquele lugar.'),
      Q('p4', 'Como saber que um programa está aberto, pela barra de tarefas?', ['O ícone fica vermelho', 'Aparece um tracinho embaixo do ícone', 'O ícone some', 'O relógio para'], 1, 'Programas abertos ganham um tracinho embaixo do ícone.'),
      Q('p4', 'Qual atalho mostra todas as janelas abertas lado a lado?', ['Win + Tab', 'Ctrl + C', 'Win + L', 'Ctrl + S'], 0, 'Win + Tab abre a Visão de Tarefas.'),
      Q('p5', 'Qual programa do Windows serve para tirar foto de um pedaço da tela?', ['Paint', 'Ferramenta de Captura', 'Calculadora', 'Bloco de Notas'], 1, 'A Ferramenta de Captura tira prints de partes da tela.'),
      Q('p5', 'Para escrever um texto simples, sem formatação, usamos:', ['Bloco de Notas', 'Calculadora', 'Fotos', 'Configurações'], 0, 'O Bloco de Notas é um editor de textos simples.'),
    ],
  };

  C['d2-a04'] = {
    titulo: 'Trabalhando com janelas',
    subtitulo: 'Abrir, minimizar, maximizar, fechar, mudar de tamanho e alternar entre as janelas como um profissional.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é uma janela', blocos: [
        { p: 'Todo programa ou pasta que você abre aparece dentro de uma **janela** [[janela]]: um retângulo com o conteúdo. Por isso o sistema se chama **Windows**, que quer dizer “janelas” em inglês.' },
        { fig: 'janela', legenda: 'Os três botões no canto de cima à direita de toda janela.' },
        { p: 'Na parte de cima fica a **barra de título**, com o nome do programa ou do arquivo, e os três botões de controle.' },
      ] },
      { id: 'p2', titulo: 'Os três botões', blocos: [
        { tabela: { cab: ['Botão', 'Nome', 'O que faz'], linhas: [
          ['—', 'Minimizar', 'Esconde a janela na barra de tarefas, sem fechar. Clique no ícone da barra para ela voltar.'],
          ['☐', 'Maximizar', 'Faz a janela ocupar a tela inteira.'],
          ['❐', 'Restaurar', 'Aparece no lugar do Maximizar: volta a janela ao tamanho anterior.'],
          ['✕', 'Fechar', 'Fecha o programa ou a pasta.'],
        ] } },
        { destaque: { tom: 'atencao', titulo: 'Minimizar não é fechar', texto: 'Minimizar só esconde: o programa continua aberto e gastando memória. Quando não for usar mais, **feche** no **X**.' } },
        { destaque: { tom: 'dica', titulo: 'Clique duplo no título', texto: 'Dar um clique duplo na barra de título também maximiza ou restaura a janela.' } },
      ] },
      { id: 'p3', titulo: 'Movendo e mudando o tamanho', blocos: [
        { h: 'Para mover' },
        { p: '**Arraste** a janela pela **barra de título**: aperte e segure o botão esquerdo sobre o título, mova o mouse e solte.' },
        { h: 'Para mudar o tamanho' },
        { p: 'Leve a setinha até a **borda** ou o **canto** da janela. Quando ela virar uma **seta dupla** ( ↔ ), arraste para aumentar ou diminuir.' },
        { destaque: { tom: 'saiba', titulo: 'Janela que não muda', texto: 'Se a janela está maximizada, ela não pode ser movida nem redimensionada. Clique em **Restaurar** antes.' } },
      ] },
      { id: 'p4', titulo: 'Várias janelas ao mesmo tempo', blocos: [
        { p: 'Você pode ter muitas janelas abertas. A que está **na frente** e recebe o que você digita é a **janela ativa**.' },
        { atalhos: [
          ['Alt+Tab', 'Troca de janela. Segure Alt e aperte Tab várias vezes para escolher.'],
          ['Win+Tab', 'Mostra todas as janelas lado a lado.'],
          ['Win+D', 'Mostra a área de trabalho.'],
          ['Alt+F4', 'Fecha a janela ativa.'],
        ] },
        { destaque: { tom: 'dica', titulo: 'Clique na janela', texto: 'Clicar em qualquer parte de uma janela que está atrás traz ela para a frente.' } },
      ] },
      { id: 'p5', titulo: 'Janelas lado a lado', blocos: [
        { p: 'Para comparar dois documentos ou copiar algo de um para o outro, coloque as janelas **lado a lado**:' },
        { passos: [
          'Arraste uma janela pela barra de título até a **borda esquerda** da tela e solte: ela ocupa a metade esquerda.',
          'O Windows mostra as outras janelas abertas. Clique na que vai ocupar a **metade direita**.',
        ] },
        { atalhos: [
          ['Win+←', 'Encaixa a janela na metade esquerda'],
          ['Win+→', 'Encaixa a janela na metade direita'],
          ['Win+↑', 'Maximiza'],
          ['Win+↓', 'Restaura ou minimiza'],
        ] },
        { p: 'No Windows 11, passe o mouse sobre o botão **Maximizar** para ver os **layouts de encaixe**: modelos prontos para dividir a tela em 2, 3 ou 4 partes.' },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que quer dizer “Windows” em português?', ['Portas', 'Janelas', 'Mesas', 'Telas'], 1, 'Windows quer dizer janelas: cada programa abre numa janela.'),
      Q('p1', 'Onde fica o nome do programa numa janela?', ['Na barra de título, em cima', 'Na Lixeira', 'No relógio', 'Embaixo do teclado'], 0, 'A barra de título fica no alto da janela e mostra o nome.'),
      Q('p2', 'O que o botão Minimizar faz?', ['Fecha o programa', 'Esconde a janela na barra de tarefas, sem fechar', 'Apaga o arquivo', 'Deixa a janela em tela cheia'], 1, 'Minimizar só esconde; o programa continua aberto.'),
      Q('p2', 'Qual botão fecha a janela?', ['O X', 'O tracinho', 'O quadrado', 'O título'], 0, 'O X fecha a janela.'),
      Q('p3', 'Como mover uma janela?', ['Arrastando pela barra de título', 'Clicando no X', 'Apertando Delete', 'Pela rodinha do mouse'], 0, 'Aperte e segure na barra de título, mova e solte.'),
      Q('p3', 'Que formato a setinha tem quando dá para mudar o tamanho da janela?', ['Mãozinha', 'Seta dupla', 'Círculo girando', 'Barra vertical'], 1, 'Na borda da janela a setinha vira uma seta dupla.'),
      Q('p4', 'Qual atalho troca de uma janela para outra?', ['Alt + Tab', 'Ctrl + V', 'Win + L', 'Shift + Esc'], 0, 'Alt + Tab alterna entre as janelas abertas.'),
      Q('p4', 'Qual atalho fecha a janela ativa?', ['Alt + F4', 'Ctrl + Z', 'Win + D', 'Ctrl + A'], 0, 'Alt + F4 fecha a janela que está na frente.'),
      Q('p5', 'Como encaixar uma janela na metade esquerda da tela?', ['Win + seta para a esquerda', 'Ctrl + E', 'Alt + Tab', 'Esc'], 0, 'Win + ← encaixa na metade esquerda.'),
      Q('p5', 'Para que serve colocar janelas lado a lado?', ['Desligar o computador', 'Comparar ou copiar coisas de uma para outra', 'Apagar arquivos', 'Trocar a senha'], 1, 'Lado a lado fica fácil comparar ou copiar de um documento para outro.'),
    ],
  };

  C['d2-a05'] = {
    titulo: 'Arquivos e pastas',
    subtitulo: 'O que é um arquivo, o que é uma pasta, como dar bons nomes e como reconhecer o tipo de cada arquivo.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'O que é um arquivo', blocos: [
        { p: 'Tudo o que fica guardado no computador está dentro de um **arquivo** [[arquivo]]: um texto, uma foto, uma música, um vídeo, uma planilha. Cada arquivo tem um **nome** e um **tipo**.' },
        { p: 'Pense nos arquivos como as **folhas de papel** de um escritório: cada uma com o seu conteúdo.' },
        { cards: [
          { ico: 'texto', t: 'Documentos', d: 'Textos, currículos, trabalhos.' },
          { ico: 'imagem', t: 'Imagens', d: 'Fotos e figuras.' },
          { ico: 'som', t: 'Áudios', d: 'Músicas e gravações.' },
          { ico: 'video', t: 'Vídeos', d: 'Filmes e gravações de câmera.' },
        ] },
      ] },
      { id: 'p2', titulo: 'O que é uma pasta', blocos: [
        { p: 'Uma **pasta** [[pasta]] é um lugar para **guardar e organizar** arquivos, como as pastas de papelão de um arquivo de escritório. Uma pasta pode ter arquivos e também **outras pastas dentro**, as **subpastas**.' },
        { fig: 'pastas', legenda: 'Pastas dentro de pastas formam um caminho até o arquivo.' },
        { p: 'O caminho até um arquivo mostra as pastas uma dentro da outra, separadas por uma barra: **Documentos \\ Escola \\ trabalho.docx**.' },
      ] },
      { id: 'p3', titulo: 'As pastas do Windows', blocos: [
        { p: 'Cada usuário do Windows já tem algumas pastas prontas, cada uma para um tipo de arquivo:' },
        { tabela: { cab: ['Pasta', 'O que guardar'], linhas: [
          ['Documentos', 'Textos, planilhas, PDFs e trabalhos'],
          ['Imagens', 'Fotos e figuras'],
          ['Músicas', 'Arquivos de áudio'],
          ['Vídeos', 'Filmes e gravações'],
          ['Downloads', 'Tudo o que você baixa da internet vem parar aqui'],
          ['Área de Trabalho', 'O que aparece na tela principal'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Olhe os Downloads', texto: 'Não encontrou o arquivo que baixou? Ele quase sempre está na pasta **Downloads** [[download]].' } },
      ] },
      { id: 'p4', titulo: 'A extensão: o tipo do arquivo', blocos: [
        { p: 'No fim do nome do arquivo, depois de um ponto, vem a **extensão**: algumas letras que dizem o **tipo** do arquivo e qual programa abre ele. Em **curriculo.docx**, a extensão é **.docx**.' },
        { tabela: { cab: ['Extensão', 'Tipo', 'Abre com'], linhas: [
          ['.docx', 'Documento de texto', 'Word'],
          ['.xlsx', 'Planilha', 'Excel'],
          ['.pdf', 'Documento PDF', 'Navegador ou leitor de PDF'],
          ['.jpg / .png', 'Imagem', 'Fotos, Paint'],
          ['.mp3', 'Música', 'Media Player'],
          ['.mp4', 'Vídeo', 'Filmes e TV, Media Player'],
          ['.zip', 'Arquivo compactado', 'Explorador de Arquivos'],
          ['.exe', 'Programa (instalador)', 'Abre sozinho: cuidado!'],
        ] } },
        { destaque: { tom: 'atencao', titulo: 'Cuidado com o .exe', texto: 'Arquivos **.exe** são programas que rodam no computador. Nunca abra um .exe que chegou por e-mail ou mensagem de alguém que você não conhece: pode ser vírus.' } },
      ] },
      { id: 'p5', titulo: 'Dando bons nomes', blocos: [
        { p: 'Um bom nome ajuda a encontrar o arquivo meses depois. Compare:' },
        { compara: {
          a: { t: 'Nomes ruins', ico: 'x', itens: ['documento1.docx', 'asdfg.xlsx', 'novo novo final 2.docx', 'IMG_0384.jpg'] },
          b: { t: 'Nomes bons', ico: 'check', itens: ['curriculo-maria-2026.docx', 'contas-casa-marco.xlsx', 'trabalho-historia-final.docx', 'aniversario-vovo.jpg'] },
        } },
        { p: 'O Windows **não aceita** estes caracteres em nomes de arquivos e pastas: **\\ / : * ? " < > |**. Evite também nomes longos demais.' },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é um arquivo?', ['Uma peça do computador', 'Algo guardado no computador, como um texto, foto ou música', 'Um cabo', 'Um tipo de mouse'], 1, 'Tudo o que fica guardado no computador está dentro de arquivos.'),
      Q('p1', 'Na comparação do texto, os arquivos são como:', ['As folhas de papel de um escritório', 'As cadeiras', 'As janelas', 'As lâmpadas'], 0, 'Cada arquivo é como uma folha com o seu conteúdo.'),
      Q('p2', 'Para que serve uma pasta?', ['Guardar e organizar arquivos', 'Desligar o computador', 'Imprimir', 'Navegar na internet'], 0, 'Pastas guardam e organizam arquivos.'),
      Q('p2', 'Como se chama uma pasta dentro de outra pasta?', ['Subpasta', 'Atalho', 'Extensão', 'Lixeira'], 0, 'Uma pasta dentro de outra é chamada de subpasta.'),
      Q('p3', 'Para onde vão os arquivos baixados da internet?', ['Para a Lixeira', 'Para a pasta Downloads', 'Para a pasta Músicas', 'Para o papel de parede'], 1, 'Os arquivos baixados vão, normalmente, para a pasta Downloads.'),
      Q('p3', 'Onde é melhor guardar um trabalho escrito?', ['Na pasta Documentos', 'Na pasta Vídeos', 'Na Lixeira', 'Na pasta Músicas'], 0, 'Textos, planilhas e trabalhos vão na pasta Documentos.'),
      Q('p4', 'Em “curriculo.docx”, qual é a extensão?', ['curriculo', '.docx', 'docx.curriculo', 'Não tem extensão'], 1, 'A extensão vem depois do ponto: .docx.'),
      Q('p4', 'Qual extensão indica uma planilha do Excel?', ['.mp3', '.xlsx', '.jpg', '.exe'], 1, '.xlsx é a extensão das planilhas do Excel.'),
      Q('p5', 'Qual destes é um bom nome de arquivo?', ['documento1.docx', 'contas-casa-marco.xlsx', 'asdfg.xlsx', 'novo novo final 2.docx'], 1, 'Um bom nome diz o que tem dentro: contas da casa de março.'),
      Q('p5', 'Qual caractere NÃO pode ser usado no nome de um arquivo?', ['Hífen (-)', 'Ponto de interrogação (?)', 'Letra a', 'Número 1'], 1, 'O Windows não aceita \\ / : * ? " < > | em nomes.'),
    ],
  };

  C['d2-a06'] = {
    titulo: 'Explorador de Arquivos',
    subtitulo: 'O programa que mostra tudo o que está guardado no computador: navegue pelas pastas e organize os seus arquivos.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Abrindo o Explorador', blocos: [
        { p: 'O **Explorador de Arquivos** é o programa que mostra as pastas e arquivos do computador. O ícone é uma **pastinha amarela** [[pasta]] na barra de tarefas.' },
        { lista: [
          'Clique no ícone da pastinha na barra de tarefas; ou',
          'Aperte {{Win+E}}; ou',
          'Abra o Iniciar e digite **explorador**.',
        ] },
      ] },
      { id: 'p2', titulo: 'As partes da janela', blocos: [
        { tabela: { cab: ['Parte', 'Onde fica', 'Para que serve'], linhas: [
          ['Painel de navegação', 'Coluna da esquerda', 'Atalhos para as pastas principais, discos e pendrives'],
          ['Barra de endereço', 'No alto', 'Mostra o caminho da pasta aberta'],
          ['Caixa de pesquisa', 'No alto, à direita', 'Procura arquivos dentro da pasta aberta'],
          ['Área de conteúdo', 'No centro', 'Os arquivos e pastas da pasta aberta'],
          ['Botões Voltar e Avançar', 'No canto de cima, à esquerda', 'Voltam para a pasta anterior'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Este Computador', texto: 'No painel da esquerda, clique em **Este Computador** para ver o disco **C:** (onde fica o Windows) e os pendrives e HDs externos que estiverem conectados.' } },
      ] },
      { id: 'p3', titulo: 'Navegando pelas pastas', blocos: [
        { passos: [
          'No painel da esquerda, clique em **Documentos**.',
          'Dê um **clique duplo** numa pasta para entrar nela.',
          'Para voltar, clique na seta **Voltar** [[desfazer]] ou aperte {{Alt+←}}.',
          'Na barra de endereço, clique no nome de uma pasta do caminho para pular direto para ela.',
        ] },
        { p: 'A **barra de endereço** mostra onde você está, por exemplo: **Este Computador > Documentos > Escola**.' },
      ] },
      { id: 'p4', titulo: 'Criando pastas e vendo os arquivos', blocos: [
        { h: 'Criar uma pasta' },
        { passos: [
          'Abra o lugar onde a pasta vai ficar (por exemplo, Documentos).',
          'Clique em **Novo** > **Pasta** (ou botão direito num espaço vazio > **Novo** > **Pasta**). O atalho é {{Ctrl+Shift+N}}.',
          'Digite o nome da pasta e aperte {{Enter}}.',
        ] },
        { h: 'Modos de exibição' },
        { p: 'No menu **Exibir**, escolha como ver os arquivos: **ícones grandes** (bom para fotos), **lista** ou **detalhes** (mostra data, tipo e tamanho).' },
        { destaque: { tom: 'saiba', titulo: 'Mostrar as extensões', texto: 'Em **Exibir** > **Mostrar** > **Extensões de nomes de arquivos**, o Windows passa a mostrar o .docx, .pdf e .jpg no fim dos nomes. Ajuda muito a saber o tipo de cada arquivo.' } },
      ] },
      { id: 'p5', titulo: 'Pesquisando e organizando', blocos: [
        { p: 'Esqueceu onde guardou um arquivo? Abra a pasta **Este Computador** (ou Documentos) e digite parte do nome na **caixa de pesquisa** [[lupa]].' },
        { p: 'Na exibição **Detalhes**, clique no título de uma coluna (Nome, Data de modificação, Tamanho) para **ordenar** os arquivos [[ordenar]].' },
        { destaque: { tom: 'dica', titulo: 'Exercício', texto: 'Dentro de Documentos, crie uma pasta chamada **Curso de Informática** e, dentro dela, uma pasta para cada disciplina. Use essas pastas para guardar os seus exercícios.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual o ícone do Explorador de Arquivos?', ['Uma pastinha amarela', 'Uma lixeira', 'Um globo', 'Um envelope'], 0, 'O Explorador tem o ícone de uma pastinha amarela.'),
      Q('p1', 'Qual atalho abre o Explorador de Arquivos?', ['Win + E', 'Win + L', 'Ctrl + P', 'Alt + F4'], 0, 'Win + E abre o Explorador (E de Explorador).'),
      Q('p2', 'O que mostra a barra de endereço do Explorador?', ['A hora', 'O caminho da pasta aberta', 'A bateria', 'O papel de parede'], 1, 'A barra de endereço mostra onde você está.'),
      Q('p2', 'O que é o disco C:?', ['Um pendrive', 'O disco onde fica o Windows', 'A Lixeira', 'Uma pasta de músicas'], 1, 'O C: é o disco principal do computador, onde fica o Windows.'),
      Q('p3', 'Como entrar numa pasta no Explorador?', ['Clique duplo nela', 'Botão direito > Excluir', 'Apertar Esc', 'Arrastar para a Lixeira'], 0, 'O clique duplo abre a pasta.'),
      Q('p3', 'Como voltar para a pasta anterior?', ['Botão Voltar ou Alt + ←', 'Ctrl + Z', 'Desligar', 'Win + D'], 0, 'A seta Voltar (ou Alt + seta esquerda) volta para a pasta anterior.'),
      Q('p4', 'Qual atalho cria uma pasta nova no Explorador?', ['Ctrl + Shift + N', 'Ctrl + C', 'Alt + Tab', 'Win + E'], 0, 'Ctrl + Shift + N cria uma nova pasta.'),
      Q('p4', 'Qual modo de exibição mostra data, tipo e tamanho dos arquivos?', ['Detalhes', 'Ícones grandes', 'Tela cheia', 'Papel de parede'], 0, 'O modo Detalhes mostra colunas com data, tipo e tamanho.'),
      Q('p5', 'Como encontrar um arquivo esquecido?', ['Digitar parte do nome na caixa de pesquisa do Explorador', 'Reiniciar o computador', 'Abrir a Lixeira e esvaziar', 'Trocar o papel de parede'], 0, 'A caixa de pesquisa procura dentro da pasta aberta.'),
      Q('p5', 'Como ordenar os arquivos por data na exibição Detalhes?', ['Clicando no título da coluna Data', 'Apagando os antigos', 'Renomeando todos', 'Pela tecla Enter'], 0, 'Clicar no título de uma coluna ordena os arquivos por ela.'),
    ],
  };

  C['d2-a07'] = {
    titulo: 'Copiar, mover, renomear e excluir',
    subtitulo: 'As operações do dia a dia com arquivos, a Lixeira e como levar arquivos no pendrive.',
    leitura: 12,
    partes: [
      { id: 'p1', titulo: 'Selecionando arquivos', blocos: [
        { p: 'Antes de copiar, mover ou apagar, você precisa **selecionar** o arquivo: um **clique** em cima dele (ele fica destacado em azul).' },
        { tabela: { cab: ['Para selecionar', 'Como fazer'], linhas: [
          ['Um arquivo', 'Um clique nele'],
          ['Vários arquivos soltos', 'Segure {{Ctrl}} e clique em cada um'],
          ['Uma sequência', 'Clique no primeiro, segure {{Shift}} e clique no último'],
          ['Todos da pasta', '{{Ctrl+A}}'],
        ] } },
      ] },
      { id: 'p2', titulo: 'Copiar e colar', blocos: [
        { p: '**Copiar** cria um **novo arquivo igual** em outro lugar. O original continua onde estava.' },
        { passos: [
          'Selecione o arquivo e aperte {{Ctrl+C}} [[copiar]] (ou botão direito > **Copiar**).',
          'Abra a pasta de destino.',
          'Aperte {{Ctrl+V}} [[colar]] (ou botão direito num espaço vazio > **Colar**).',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Área de transferência', texto: 'Quando você copia, o Windows guarda o item numa memória temporária chamada **área de transferência**. Ele fica lá até você copiar outra coisa.' } },
      ] },
      { id: 'p3', titulo: 'Recortar (mover) e renomear', blocos: [
        { p: '**Recortar** [[tesoura]] tira o arquivo de um lugar e leva para outro: é **mover**. O arquivo **não fica duplicado**.' },
        { atalhos: [
          ['Ctrl+X', 'Recortar'],
          ['Ctrl+V', 'Colar no destino'],
        ] },
        { p: 'Também dá para **arrastar** o arquivo até outra pasta: na mesma unidade ele é **movido**; para um pendrive, ele é **copiado**.' },
        { h: 'Renomear' },
        { p: 'Selecione o arquivo e aperte {{F2}} (ou botão direito > **Renomear**). Digite o novo nome e aperte {{Enter}}. Cuidado para **não apagar a extensão** (.docx, .jpg).' },
      ] },
      { id: 'p4', titulo: 'Excluir e a Lixeira', blocos: [
        { p: 'Para apagar, selecione e aperte {{Delete}} (ou botão direito > **Excluir**). O arquivo vai para a **Lixeira** [[lixeira]], onde ainda dá para recuperar.' },
        { fig: 'lixeira', legenda: 'Arquivos excluídos vão para a Lixeira.' },
        { passos: [
          'Para **recuperar:** abra a Lixeira, clique no arquivo com o botão direito e escolha **Restaurar**. Ele volta para o lugar de onde saiu.',
          'Para **apagar de vez:** clique em **Esvaziar Lixeira**. Depois disso, não dá mais para recuperar.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Sem volta', texto: '{{Shift+Delete}} apaga **sem passar pela Lixeira**. Arquivos apagados de **pendrives** também não vão para a Lixeira. Use com cuidado!' } },
      ] },
      { id: 'p5', titulo: 'Usando um pendrive', blocos: [
        { p: 'O **pendrive** [[pendrive]] é um pequeno dispositivo para levar arquivos de um computador para outro.' },
        { passos: [
          'Encaixe o pendrive numa porta **USB**.',
          'Abra o Explorador de Arquivos: ele aparece em **Este Computador** (com um nome como “PENDRIVE (E:)”).',
          'Copie os arquivos para ele com {{Ctrl+C}} e {{Ctrl+V}}, ou arrastando.',
          'Antes de tirar, clique no ícone do pendrive na área de notificação e escolha **Ejetar**. Espere a mensagem de que é seguro remover.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Por que ejetar?', texto: 'Se o computador ainda estiver gravando quando você puxar o pendrive, o arquivo pode estragar. Ejetar garante que a gravação terminou.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Como selecionar vários arquivos soltos, um de cada vez?', ['Segurando Ctrl e clicando em cada um', 'Apertando Enter', 'Clique duplo em todos', 'Segurando Alt'], 0, 'Com Ctrl apertado, cada clique adiciona um arquivo à seleção.'),
      Q('p1', 'Qual atalho seleciona todos os arquivos da pasta?', ['Ctrl + A', 'Ctrl + T', 'Alt + A', 'Win + A'], 0, 'Ctrl + A seleciona tudo (A de “all”, todos em inglês).'),
      Q('p2', 'O que acontece com o original quando você copia um arquivo?', ['Some', 'Continua onde estava', 'Vai para a Lixeira', 'Muda de nome'], 1, 'Copiar cria um novo arquivo igual; o original continua lá.'),
      Q('p2', 'Onde o Windows guarda o que você copiou, até colar?', ['Na Lixeira', 'Na área de transferência', 'No papel de parede', 'Na pasta Músicas'], 1, 'A área de transferência guarda o item copiado temporariamente.'),
      Q('p3', 'Qual atalho recorta um arquivo para movê-lo?', ['Ctrl + X', 'Ctrl + C', 'Ctrl + Z', 'Ctrl + P'], 0, 'Ctrl + X recorta; depois, Ctrl + V cola no destino.'),
      Q('p3', 'Qual tecla renomeia o arquivo selecionado?', ['F2', 'F5', 'Esc', 'Tab'], 0, 'F2 permite renomear o arquivo.'),
      Q('p4', 'Para onde vai um arquivo excluído com a tecla Delete?', ['Para a Lixeira', 'Para a internet', 'Para o pendrive', 'Para a pasta Downloads'], 0, 'Ele vai para a Lixeira, de onde ainda pode ser restaurado.'),
      Q('p4', 'Como recuperar um arquivo da Lixeira?', ['Botão direito > Restaurar', 'Esvaziar a Lixeira', 'Apertar Shift + Delete', 'Reiniciar'], 0, 'Restaurar devolve o arquivo ao lugar de onde saiu.'),
      Q('p5', 'Onde o pendrive aparece no Explorador?', ['Em Este Computador', 'Na Lixeira', 'Na pasta Imagens', 'No menu Iniciar'], 0, 'Pendrives aparecem em Este Computador.'),
      Q('p5', 'O que fazer antes de tirar o pendrive do computador?', ['Ejetar pelo ícone na área de notificação', 'Desligar o monitor', 'Apagar tudo', 'Nada'], 0, 'Ejetar garante que a gravação terminou e evita estragar arquivos.'),
    ],
  };

  C['d2-a08'] = {
    titulo: 'Atalhos de teclado no Windows',
    subtitulo: 'Combinações de teclas que fazem em um segundo o que levaria vários cliques.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'O que é um atalho de teclado', blocos: [
        { p: 'Um **atalho de teclado** é uma combinação de teclas que faz uma ação rápida. Você **segura** a primeira tecla (como {{Ctrl}}) e **aperta** a segunda (como {{C}}). O sinal **+** quer dizer “junto com”.' },
        { destaque: { tom: 'dica', titulo: 'Como apertar', texto: 'Em {{Ctrl+C}}: segure o Ctrl, aperte e solte o C, e só então solte o Ctrl. Não precisa ser rápido.' } },
        { p: 'Você não precisa decorar todos de uma vez. Comece com os mais usados e, aos poucos, eles viram hábito [[raio]].' },
      ] },
      { id: 'p2', titulo: 'Os atalhos de edição', blocos: [
        { p: 'Funcionam em quase todos os programas: no Word, no navegador, no Explorador de Arquivos.' },
        { atalhos: [
          ['Ctrl+C', 'Copiar'],
          ['Ctrl+X', 'Recortar'],
          ['Ctrl+V', 'Colar'],
          ['Ctrl+Z', 'Desfazer a última ação'],
          ['Ctrl+Y', 'Refazer'],
          ['Ctrl+A', 'Selecionar tudo'],
        ] },
        { destaque: { tom: 'saiba', titulo: 'O salva-vidas', texto: 'Apagou algo sem querer? {{Ctrl+Z}} desfaz. Dá para apertar várias vezes para voltar vários passos.' } },
      ] },
      { id: 'p3', titulo: 'Atalhos com a tecla Windows', blocos: [
        { atalhos: [
          ['Win', 'Abre o menu Iniciar'],
          ['Win+D', 'Mostra a área de trabalho'],
          ['Win+E', 'Abre o Explorador de Arquivos'],
          ['Win+L', 'Bloqueia o computador'],
          ['Win+I', 'Abre as Configurações'],
          ['Win+V', 'Histórico da área de transferência'],
          ['Win+Shift+S', 'Tira um print de um pedaço da tela'],
        ] },
      ] },
      { id: 'p4', titulo: 'Atalhos de janelas', blocos: [
        { atalhos: [
          ['Alt+Tab', 'Troca de janela'],
          ['Alt+F4', 'Fecha a janela ativa'],
          ['Win+←', 'Encaixa a janela na esquerda'],
          ['Win+→', 'Encaixa a janela na direita'],
          ['Win+↑', 'Maximiza a janela'],
          ['Ctrl+Shift+Esc', 'Abre o Gerenciador de Tarefas'],
        ] },
        { destaque: { tom: 'atencao', titulo: 'Alt + F4 na área de trabalho', texto: 'Se não houver nenhuma janela aberta, {{Alt+F4}} abre a caixa de **desligar** o computador. Basta apertar Esc se não quiser.' } },
      ] },
      { id: 'p5', titulo: 'Atalhos para arquivos', blocos: [
        { atalhos: [
          ['F2', 'Renomeia o arquivo selecionado'],
          ['Delete', 'Manda para a Lixeira'],
          ['Shift+Delete', 'Apaga sem passar pela Lixeira'],
          ['Ctrl+Shift+N', 'Cria uma nova pasta'],
          ['Enter', 'Abre o arquivo selecionado'],
          ['F5', 'Atualiza a pasta'],
        ] },
        { destaque: { tom: 'dica', titulo: 'Desafio', texto: 'Tente passar um dia inteiro usando {{Ctrl+C}}, {{Ctrl+V}} e {{Alt+Tab}} em vez do mouse. No fim da semana, você vai fazer isso sem pensar.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Em um atalho como Ctrl + C, o sinal “+” significa:', ['Somar os números', 'Apertar as teclas juntas: segurar uma e apertar a outra', 'Apertar uma depois de soltar a outra, bem rápido', 'Digitar o sinal de mais'], 1, 'O + indica que as teclas são apertadas juntas: segure a primeira e aperte a segunda.'),
      Q('p1', 'Qual a melhor forma de aprender os atalhos?', ['Decorar todos num dia', 'Começar pelos mais usados e praticar aos poucos', 'Não usar nunca', 'Só usar o mouse'], 1, 'Com a prática, os atalhos mais usados viram hábito.'),
      Q('p2', 'Qual atalho desfaz a última ação?', ['Ctrl + Z', 'Ctrl + Y', 'Ctrl + A', 'Ctrl + X'], 0, 'Ctrl + Z desfaz; Ctrl + Y refaz.'),
      Q('p2', 'Qual atalho cola o que foi copiado?', ['Ctrl + V', 'Ctrl + C', 'Ctrl + P', 'Ctrl + S'], 0, 'Ctrl + V cola.'),
      Q('p3', 'Qual atalho abre as Configurações do Windows?', ['Win + I', 'Win + D', 'Win + L', 'Win + E'], 0, 'Win + I abre as Configurações.'),
      Q('p3', 'Qual atalho tira um print de um pedaço da tela?', ['Win + Shift + S', 'Ctrl + P', 'Alt + Tab', 'Win + D'], 0, 'Win + Shift + S abre a ferramenta de captura.'),
      Q('p4', 'Qual atalho fecha a janela ativa?', ['Alt + F4', 'Ctrl + F4', 'Win + F4', 'Shift + F4'], 0, 'Alt + F4 fecha a janela que está na frente.'),
      Q('p4', 'O que Alt + F4 faz quando não há nenhuma janela aberta?', ['Nada', 'Abre a caixa de desligar o computador', 'Apaga a área de trabalho', 'Abre o Word'], 1, 'Sem janelas abertas, Alt + F4 abre a caixa de desligar.'),
      Q('p5', 'Qual atalho apaga um arquivo sem passar pela Lixeira?', ['Shift + Delete', 'Delete', 'Ctrl + Z', 'F2'], 0, 'Shift + Delete apaga de vez. Cuidado!'),
      Q('p5', 'Qual tecla atualiza a pasta no Explorador?', ['F5', 'F2', 'Esc', 'Tab'], 0, 'F5 atualiza a pasta (e a página, no navegador).'),
    ],
  };

  C['d2-a09'] = {
    titulo: 'Personalizando o sistema',
    subtitulo: 'Deixe o Windows do seu jeito: papel de parede, tema escuro, tamanho do texto, som, data e hora.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'As Configurações', blocos: [
        { p: 'Quase tudo no Windows pode ser ajustado nas **Configurações** [[engrenagem]]. Para abrir: menu Iniciar > ícone da **engrenagem**, ou {{Win+I}}.' },
        { cards: [
          { ico: 'monitor', t: 'Sistema', d: 'Tela, som, notificações e energia.' },
          { ico: 'wifi', t: 'Rede e Internet', d: 'Wi-Fi e conexões.' },
          { ico: 'imagem', t: 'Personalização', d: 'Papel de parede, cores e temas.' },
          { ico: 'usuario', t: 'Contas', d: 'Usuário, senha e PIN.' },
          { ico: 'relogio', t: 'Hora e idioma', d: 'Data, hora e teclado.' },
          { ico: 'acessivel', t: 'Acessibilidade', d: 'Lupa, contraste e narrador.' },
        ] },
        { destaque: { tom: 'dica', titulo: 'Use a busca', texto: 'As Configurações também têm uma caixa de pesquisa. Digite “papel de parede” ou “som” e vá direto ao ponto.' } },
      ] },
      { id: 'p2', titulo: 'Papel de parede e cores', blocos: [
        { passos: [
          'Clique com o **botão direito** num espaço vazio da área de trabalho.',
          'Escolha **Personalizar**.',
          'Em **Plano de fundo**, escolha uma imagem da lista ou clique em **Procurar fotos** para usar uma foto sua.',
          'Em **Cores**, escolha o **modo claro** ou o **modo escuro** [[lua]] e uma cor de destaque.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Modo escuro', texto: 'O modo escuro deixa os fundos pretos e cansa menos a vista à noite. É só uma questão de gosto: escolha o que for mais confortável para você.' } },
      ] },
      { id: 'p3', titulo: 'Tela e tamanho do texto', blocos: [
        { p: 'Se as letras parecem pequenas demais, dá para aumentar tudo:' },
        { passos: [
          'Abra **Configurações** > **Sistema** > **Tela**.',
          'Em **Escala**, escolha um valor maior, como **125%** ou **150%**.',
          'Em **Brilho**, ajuste a claridade da tela (no notebook) [[sol]].',
        ] },
        { p: 'Em **Acessibilidade** > **Tamanho do texto**, você aumenta só as letras, sem mudar o resto.' },
        { destaque: { tom: 'dica', titulo: 'Luz noturna', texto: 'A **Luz noturna** deixa a tela mais amarelada à noite, o que cansa menos os olhos e ajuda a dormir melhor.' } },
      ] },
      { id: 'p4', titulo: 'Som, data e hora', blocos: [
        { p: 'Para ajustar o **volume** [[som]], clique no ícone do alto-falante na área de notificação e arraste a barrinha.' },
        { p: 'Em **Configurações** > **Hora e idioma**, você confere se a **data**, a **hora** e o **fuso horário** estão certos. Deixe ligada a opção **Definir hora automaticamente**.' },
        { p: 'Em **Idioma e região** > **Teclado**, confira se o teclado está como **Português (Brasil ABNT2)**. Se o Ç ou os acentos saírem errados, é aqui que se corrige.' },
      ] },
      { id: 'p5', titulo: 'Programas e manutenção', blocos: [
        { h: 'Instalar e desinstalar' },
        { p: 'Prefira instalar programas pela **Microsoft Store** ou pelo **site oficial** de quem fez o programa. Para remover: **Configurações** > **Aplicativos** > **Aplicativos instalados** > clique nos três pontinhos do programa > **Desinstalar**.' },
        { h: 'Windows Update' },
        { p: 'Em **Configurações** > **Windows Update**, o sistema baixa as **atualizações** [[atualizar]]: correções de segurança e novidades. Deixe sempre em dia e reinicie quando ele pedir.' },
        { destaque: { tom: 'atencao', titulo: 'Fontes desconhecidas', texto: 'Evite baixar programas de sites estranhos ou de links recebidos por mensagem. Eles podem trazer vírus junto.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual atalho abre as Configurações do Windows?', ['Win + I', 'Win + C', 'Ctrl + I', 'Alt + I'], 0, 'Win + I abre as Configurações.'),
      Q('p1', 'Em qual parte das Configurações ficam o papel de parede e as cores?', ['Personalização', 'Contas', 'Rede e Internet', 'Windows Update'], 0, 'Em Personalização ficam o plano de fundo, as cores e os temas.'),
      Q('p2', 'Como chegar rápido às opções de papel de parede?', ['Botão direito na área de trabalho > Personalizar', 'Clicar no relógio', 'Abrir a Lixeira', 'Apertar Delete'], 0, 'O botão direito na área de trabalho mostra a opção Personalizar.'),
      Q('p2', 'O que faz o modo escuro?', ['Desliga a tela', 'Deixa os fundos escuros, cansando menos a vista à noite', 'Apaga os arquivos', 'Deixa o computador mais rápido'], 1, 'O modo escuro troca os fundos claros por escuros.'),
      Q('p3', 'Para deixar tudo maior na tela, você muda:', ['A escala da tela', 'O papel de parede', 'O volume', 'A senha'], 0, 'Em Sistema > Tela > Escala, escolha 125% ou 150%.'),
      Q('p3', 'O que faz a Luz noturna?', ['Deixa a tela mais amarelada à noite', 'Liga uma lâmpada', 'Desliga o Wi-Fi', 'Aumenta o volume'], 0, 'A Luz noturna reduz a luz azul e cansa menos os olhos.'),
      Q('p4', 'Onde ajustar o volume rapidamente?', ['No ícone do alto-falante, na área de notificação', 'No menu Arquivo do Word', 'Na Lixeira', 'No Explorador'], 0, 'Clique no alto-falante e arraste a barrinha.'),
      Q('p4', 'Se o Ç e os acentos saem errados, o que conferir?', ['Se o teclado está como Português (Brasil ABNT2)', 'O papel de parede', 'A bateria', 'O brilho'], 0, 'O layout do teclado precisa ser ABNT2.'),
      Q('p5', 'Onde é mais seguro baixar programas?', ['Na Microsoft Store ou no site oficial', 'Em links recebidos por mensagem', 'Em qualquer site', 'Em e-mails de desconhecidos'], 0, 'Lojas oficiais e sites oficiais são mais seguros.'),
      Q('p5', 'Para que serve o Windows Update?', ['Trocar o papel de parede', 'Baixar atualizações e correções de segurança', 'Apagar arquivos', 'Criar pastas'], 1, 'O Windows Update mantém o sistema atualizado e seguro.'),
    ],
  };

  C['d2-av'] = {
    titulo: 'Avaliação: Sistema Operacional Windows',
    subtitulo: '30 perguntas sobre as Aulas 01 a 09. Não há material para consultar: responda com o que você aprendeu.',
    avaliacao: { aulas: ['d2-a01', 'd2-a02', 'd2-a03', 'd2-a04', 'd2-a05', 'd2-a06', 'd2-a07', 'd2-a08', 'd2-a09'] },
  };
})();
