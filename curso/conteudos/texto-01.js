/* =========================================================
   CONTEÚDO 01 — texto "O teclado e a digitação correta" + questionário
   Aberto pela tela de leitura (curso/conteudo.js), em #informatica/conteudo-texto-01.
   Blocos de cada parte:
     { p: 'parágrafo' }              texto corrido (**negrito** permitido)
     { h: 'subtítulo' }
     { lista: ['…', '…'] }           lista com marcadores
     { passos: ['…', '…'] }          lista numerada
     { checklist: ['…', '…'] }       lista com ✓
     { destaque: { titulo, texto, tom } }   caixa de destaque (tom: dica | atencao | saiba)
     { teclado: 'referencia' | 'dedos' }    desenho do teclado
     { tabela: { cab: [...], linhas: [[...], ...] } }
   Perguntas: parte = id da parte onde está a resposta; certa = índice da opção correta.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
window.HC_CONTEUDOS['texto-01'] = {
  tag: 'Texto · Módulo 1',
  titulo: 'O teclado e a digitação correta',
  subtitulo: 'Tudo o que você precisa saber antes de começar as lições: as partes do teclado, onde fica cada dedo, a postura certa e como ganhar velocidade sem perder a precisão.',
  leitura: 15,
  partes: [
    {
      id: 'p1', titulo: 'Por que aprender a digitar bem',
      blocos: [
        { p: 'Hoje quase tudo passa por um teclado: um trabalho da escola, um currículo, uma mensagem para um cliente, um cadastro no sistema da empresa. Quem digita bem termina essas tarefas mais rápido, erra menos e se cansa menos. Quem digita mal perde tempo procurando as teclas e volta o tempo todo para corrigir o que escreveu.' },
        { p: 'Muita gente aprende sozinha, do jeito que dá, usando dois ou três dedos e olhando para o teclado a cada letra. É o famoso **“catar milho”**. Funciona, mas tem um limite: a velocidade para de crescer, o pescoço vive abaixado e a atenção fica dividida entre a tela e as teclas.' },
        { h: 'Digitação por toque' },
        { p: 'Neste curso você vai aprender a **digitação por toque**: escrever **sem olhar para o teclado**, usando **os dez dedos**, cada um responsável por um grupo de teclas. No começo parece mais lento, mas em poucas semanas os dedos passam a “saber” onde cada letra está, e você olha só para a tela.' },
        { lista: [
          '**Mais rapidez:** cada dedo faz um caminho curto, sem a mão inteira atravessar o teclado.',
          '**Menos erros:** você vê na tela o que está escrevendo e corrige na hora.',
          '**Menos cansaço:** pescoço erguido, mãos paradas no lugar e movimentos pequenos.',
          '**Mais oportunidades:** digitação é pedida em vagas de escritório, atendimento, recepção e tecnologia.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Como este texto está organizado', texto: 'São nove partes curtas. Ao lado (ou no botão “Questionário”, no celular) estão as perguntas sobre cada parte. Você pode ler tudo e depois responder, ou responder conforme avança.' } },
      ],
    },
    {
      id: 'p2', titulo: 'Conhecendo o teclado',
      blocos: [
        { p: 'Um teclado de computador comum tem por volta de **105 teclas**. Elas parecem muitas, mas estão divididas em grupos, e cada grupo tem uma função. Conhecer esses grupos ajuda a se localizar sem precisar procurar.' },
        { h: 'Os grupos de teclas' },
        { tabela: { cab: ['Grupo', 'Onde fica', 'Para que serve'], linhas: [
          ['Alfanumérico', 'Centro do teclado', 'Letras, números da fileira de cima, acentos e sinais de pontuação. É onde você passa a maior parte do tempo.'],
          ['Teclas de função', 'Fileira do alto (F1 a F12)', 'Atalhos dos programas. Exemplo: F1 costuma abrir a ajuda e F5 atualiza a página no navegador.'],
          ['Navegação e edição', 'À direita das letras', 'Setas, Home, End, Page Up, Page Down, Insert e Delete: movem o cursor e editam o texto.'],
          ['Teclado numérico', 'Bloco da direita', 'Números como os de uma calculadora. Funciona com a luz do Num Lock acesa.'],
          ['Modificadoras', 'Cantos de baixo', 'Shift, Ctrl, Alt, AltGr e a tecla do Windows. Sozinhas não escrevem nada: mudam o que as outras fazem.'],
        ] } },
        { h: 'O padrão brasileiro: ABNT2' },
        { p: 'Existem vários modelos de teclado no mundo. No Brasil, o padrão é o **ABNT2**, criado para a língua portuguesa. Você reconhece um teclado ABNT2 por três detalhes:' },
        { checklist: [
          'Tem a tecla **Ç** própria, logo à direita do **L**.',
          'Tem teclas de **acento** (´ ` ~ ^) ao lado do **P** e do **Ç**.',
          'Tem a tecla **AltGr** à direita da barra de espaço, usada para símbolos extras como o **°** e o **§**.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Teclado sem Ç?', texto: 'Se o seu teclado não tem a tecla Ç, provavelmente ele é do padrão americano. Dá para usar, mas os acentos ficam em lugares diferentes. As lições deste curso seguem o ABNT2.' } },
      ],
    },
    {
      id: 'p3', titulo: 'A fileira de referência',
      blocos: [
        { p: 'Toda a digitação por toque parte de um lugar só: a **fileira de referência**, também chamada de fileira base ou fileira do meio. É nela que os dedos descansam e é para ela que eles voltam depois de cada tecla.' },
        { teclado: 'referencia' },
        { lista: [
          '**Mão esquerda:** mindinho no **A**, anelar no **S**, médio no **D** e indicador no **F**.',
          '**Mão direita:** indicador no **J**, médio no **K**, anelar no **L** e mindinho no **Ç**.',
          '**Polegares:** os dois descansam sobre a **barra de espaço**.',
        ] },
        { h: 'As saliências do F e do J' },
        { p: 'Passe o dedo nas teclas **F** e **J** do seu teclado: elas têm um pequeno **relevo**, um tracinho ou um pontinho. Ele existe para que os indicadores encontrem a posição certa **sem olhar**. Sentiu o relevo nos dois indicadores, os outros dedos se acomodam ao lado, e as mãos estão prontas.' },
        { destaque: { tom: 'dica', titulo: 'Volte sempre para casa', texto: 'Depois de apertar uma tecla de outra fileira, o dedo volta para a fileira de referência. Esse “voltar para casa” é o que permite achar todas as outras teclas pela distância, sem olhar.' } },
      ],
    },
    {
      id: 'p4', titulo: 'Cada dedo em sua tecla',
      blocos: [
        { p: 'A partir da fileira de referência, cada dedo cuida de uma **coluna** de teclas, subindo e descendo na diagonal. Os indicadores são os dedos mais fortes e por isso cuidam de **duas colunas** cada um. No desenho, cada cor é um dedo:' },
        { teclado: 'dedos' },
        { tabela: { cab: ['Dedo', 'Mão esquerda', 'Mão direita'], linhas: [
          ['Mindinho', 'Q, A, Z, além de Tab, Caps Lock e Shift esquerdo', 'P, Ç, ponto e vírgula, os acentos, Enter, Backspace e Shift direito'],
          ['Anelar', 'W, S, X', 'O, L, ponto final'],
          ['Médio', 'E, D, C', 'I, K, vírgula'],
          ['Indicador', 'R, F, V e também T, G, B', 'U, J, M e também Y, H, N'],
          ['Polegar', 'Barra de espaço', 'Barra de espaço'],
        ] } },
        { p: 'Repare que a divisão entre as mãos fica entre o **G** e o **H**, no meio das letras **T/Y** e **B/N**. Quem aprendeu “catando milho” costuma apertar o **B** com a mão direita: no começo, preste atenção nessa tecla.' },
        { h: 'Os números' },
        { p: 'A fileira dos números segue a mesma lógica, um pouco mais para cima: o mindinho esquerdo faz o **1**, o anelar o **2**, o médio o **3**, o indicador o **4** e o **5**; na mão direita, o indicador faz o **6** e o **7**, o médio o **8**, o anelar o **9** e o mindinho o **0**.' },
      ],
    },
    {
      id: 'p5', titulo: 'A postura correta',
      blocos: [
        { p: 'Digitar é um trabalho do corpo inteiro. Uma postura ruim não atrapalha só a velocidade: com o tempo, causa dor nas costas, no pescoço e nos punhos. Antes de cada prática, confira estes pontos:' },
        { checklist: [
          '**Costas** apoiadas no encosto da cadeira, sem curvar para a frente.',
          '**Pés** apoiados no chão (ou num apoio), com os joelhos mais ou menos em ângulo reto.',
          '**Cotovelos** junto ao corpo, dobrados em cerca de 90 graus.',
          '**Punhos** retos, na mesma linha do antebraço: nem dobrados para cima, nem caídos para baixo.',
          '**Dedos** levemente curvados sobre a fileira de referência, tocando as teclas com as pontas.',
          '**Monitor** à distância de um braço esticado (50 a 70 cm), com o topo da tela na altura dos olhos.',
          '**Luz** vindo de lado, sem reflexo na tela.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Não apoie o peso nos punhos', texto: 'Descansar os punhos na mesa enquanto digita faz a mão dobrar para cima e força os tendões. Deixe as mãos “flutuando” levemente sobre o teclado; o apoio de punho serve só para as pausas.' } },
        { p: 'No começo, manter tudo isso parece estranho. Em poucos dias vira hábito, e você vai notar que consegue praticar por mais tempo sem se cansar.' },
      ],
    },
    {
      id: 'p6', titulo: 'Teclas especiais e acentos',
      blocos: [
        { h: 'As teclas que você vai usar o tempo todo' },
        { lista: [
          '**Barra de espaço:** separa as palavras. Aperte com o polegar, sem tirar os outros dedos do lugar.',
          '**Enter:** quebra a linha ou confirma uma ação. Fica com o mindinho direito.',
          '**Backspace:** apaga o caractere **à esquerda** do cursor. Também com o mindinho direito.',
          '**Delete:** apaga o caractere **à direita** do cursor.',
          '**Tab:** cria um recuo no texto ou pula para o próximo campo de um formulário.',
          '**Caps Lock:** liga as letras maiúsculas até ser desligado. Cuidado com ela ao digitar senhas!',
        ] },
        { h: 'Maiúsculas com o Shift' },
        { p: 'Para uma letra maiúscula, segure o **Shift** e aperte a letra. A regra da digitação por toque é usar o Shift da **mão oposta**: para o **A** (mão esquerda), use o Shift **direito**; para o **J** (mão direita), use o Shift **esquerdo**. Assim uma mão segura e a outra digita, sem esticar os dedos.' },
        { h: 'Acentos no teclado ABNT2' },
        { p: 'As teclas de acento são **teclas mortas**: ao apertar, nada aparece na hora. O acento só surge quando você aperta a vogal em seguida.' },
        { tabela: { cab: ['Para escrever', 'Aperte', 'Exemplo'], linhas: [
          ['á é í ó ú', '´ e depois a vogal', 'café, você'],
          ['à', 'Shift + ´ e depois a', 'à noite'],
          ['ã õ', '~ e depois a vogal', 'mão, lições'],
          ['â ê ô', 'Shift + ~ e depois a vogal', 'você, avô'],
          ['ç', 'a tecla Ç (mindinho direito)', 'ação, começo'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Só quer o sinal?', texto: 'Para escrever o próprio sinal (por exemplo, o ~ sozinho), aperte a tecla de acento e depois a barra de espaço.' } },
      ],
    },
    {
      id: 'p7', titulo: 'Precisão antes da velocidade',
      blocos: [
        { p: 'A velocidade de digitação é medida em **PPM, palavras por minuto**. Para a conta ficar justa, considera-se que cada “palavra” tem cinco caracteres, contando os espaços. Ao lado da velocidade, mede-se a **precisão**: a porcentagem de teclas digitadas sem erro.' },
        { tabela: { cab: ['Nível', 'Velocidade aproximada'], linhas: [
          ['Começando', '10 a 20 PPM'],
          ['Iniciante com prática', '20 a 30 PPM'],
          ['Intermediário', '30 a 45 PPM'],
          ['Bom digitador', '45 a 60 PPM'],
          ['Avançado', 'acima de 60 PPM'],
        ] } },
        { h: 'Por que a precisão vem primeiro' },
        { p: 'Cada erro custa caro: você precisa perceber, apagar e digitar de novo. Por isso, quem digita devagar e certo termina antes de quem digita rápido e errado. E tem mais: os dedos aprendem pela repetição. Se você repete o movimento errado, é o erro que fica gravado.' },
        { passos: [
          'Digite **devagar**, sem olhar para o teclado, até acertar quase tudo (95% ou mais).',
          'Mantenha um **ritmo constante**, como as batidas de um relógio, em vez de rajadas rápidas seguidas de pausas.',
          'Só então tente **acelerar** um pouco. Se os erros voltarem, diminua de novo.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'A velocidade vem sozinha', texto: 'Com prática diária de 15 a 20 minutos, é comum dobrar a velocidade em poucas semanas, sem fazer força para isso. O segredo é a constância, não a pressa.' } },
      ],
    },
    {
      id: 'p8', titulo: 'Cuidando da saúde',
      blocos: [
        { p: 'Ficar muito tempo no computador sem pausas pode causar problemas sérios. Os mais conhecidos são as **LER/DORT** (lesões por esforço repetitivo e distúrbios ligados ao trabalho), que afetam punhos, mãos, braços e ombros. A boa notícia é que dá para prevenir com hábitos simples.' },
        { lista: [
          '**Faça pausas:** a cada 50 minutos, levante e caminhe um pouco por 5 a 10 minutos.',
          '**Alongue:** abra e feche as mãos, gire os punhos devagar e estique os braços à frente.',
          '**Digite com leveza:** não precisa bater forte nas teclas; um toque leve é suficiente.',
          '**Descanse os olhos:** pisque com frequência e use a regra 20-20-20.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Regra 20-20-20', texto: 'A cada 20 minutos, olhe por 20 segundos para algo a uns 6 metros de distância (20 pés). Isso relaxa os músculos dos olhos, que se cansam de focar sempre na mesma distância da tela.' } },
        { p: 'Se sentir dor, formigamento ou dormência nas mãos que não passa com o descanso, pare a prática e procure um profissional de saúde.' },
      ],
    },
    {
      id: 'p9', titulo: 'Resumo e próximos passos',
      blocos: [
        { p: 'Você chegou ao fim da leitura. Antes de seguir, relembre o mais importante:' },
        { checklist: [
          'Digitação por toque é escrever **sem olhar**, com **os dez dedos**.',
          'O padrão brasileiro é o **ABNT2**, que tem a tecla **Ç**.',
          'Os dedos descansam na fileira de referência: **ASDF** e **JKLÇ**, com os polegares no espaço.',
          'As saliências do **F** e do **J** ajudam a achar a posição sem olhar.',
          'Cada dedo cuida de uma coluna; os indicadores cuidam de duas.',
          'Costas apoiadas, punhos retos e monitor na altura dos olhos.',
          'Use o **Shift da mão oposta** para as maiúsculas; os acentos vêm antes da vogal.',
          '**Precisão primeiro**, velocidade depois.',
          'Faça **pausas** e cuide das mãos e dos olhos.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'E agora?', texto: 'Responda o questionário para fixar o conteúdo e ganhar XP. Depois, abra a Lição 01 do Módulo 1 e coloque tudo isso em prática no teclado.' } },
      ],
    },
  ],
  perguntas: [
    { parte: 'p1', q: 'O que é a digitação por toque?', op: ['Digitar usando só os dois indicadores, bem rápido', 'Digitar sem olhar para o teclado, usando os dez dedos', 'Digitar tocando na tela do celular', 'Digitar olhando cada tecla para não errar'], certa: 1, exp: 'Na digitação por toque cada um dos dez dedos cuida de um grupo de teclas, e você olha só para a tela.' },
    { parte: 'p1', q: 'Qual destes NÃO é um benefício de digitar bem, segundo o texto?', op: ['Mais rapidez', 'Menos erros', 'Dispensar o uso do mouse', 'Menos cansaço'], certa: 2, exp: 'O texto cita rapidez, menos erros, menos cansaço e mais oportunidades. Deixar de usar o mouse não é um deles.' },
    { parte: 'p2', q: 'Como se chama o padrão de teclado usado no Brasil, que tem a tecla Ç?', op: ['QWERTY americano', 'ABNT2', 'AZERTY', 'Teclado numérico'], certa: 1, exp: 'O ABNT2 foi criado para a língua portuguesa: tem o Ç ao lado do L, as teclas de acento e a tecla AltGr.' },
    { parte: 'p2', q: 'As teclas de F1 a F12, na fileira do alto, são chamadas de:', op: ['Teclas modificadoras', 'Teclas de navegação', 'Teclas de função', 'Teclado numérico'], certa: 2, exp: 'São as teclas de função, usadas como atalhos nos programas (F5, por exemplo, atualiza a página).' },
    { parte: 'p3', q: 'Quais teclas formam a fileira de referência?', op: ['Q W E R e U I O P', 'A S D F e J K L Ç', 'Z X C V e B N M', '1 2 3 4 e 7 8 9 0'], certa: 1, exp: 'Os dedos descansam em A S D F (mão esquerda) e J K L Ç (mão direita), e voltam para elas depois de cada tecla.' },
    { parte: 'p3', q: 'Para que servem os pequenos relevos nas teclas F e J?', op: ['Mostrar que essas teclas são as mais usadas', 'Indicar onde o teclado foi fabricado', 'Ajudar os indicadores a achar a posição sem olhar', 'Impedir que o dedo escorregue para o lado'], certa: 2, exp: 'Sentindo o relevo com os indicadores, você sabe que as mãos estão na posição certa sem precisar olhar.' },
    { parte: 'p4', q: 'Qual dedo aperta a barra de espaço?', op: ['O indicador', 'O polegar', 'O mindinho', 'Qualquer dedo livre'], certa: 1, exp: 'Os polegares descansam sobre a barra de espaço e a apertam sem tirar os outros dedos do lugar.' },
    { parte: 'p4', q: 'Qual dedo é responsável pelas teclas R, F, V, T, G e B?', op: ['Médio esquerdo', 'Indicador direito', 'Indicador esquerdo', 'Anelar esquerdo'], certa: 2, exp: 'Os indicadores cuidam de duas colunas cada um. O esquerdo fica com R F V e T G B.' },
    { parte: 'p5', q: 'Na postura correta, como devem ficar os punhos?', op: ['Apoiados com força na mesa', 'Dobrados para cima', 'Retos, na mesma linha do antebraço', 'Caídos abaixo do teclado'], certa: 2, exp: 'Punhos retos evitam forçar os tendões. Apoiar o peso na mesa faz a mão dobrar para cima.' },
    { parte: 'p5', q: 'Onde deve ficar o monitor?', op: ['Bem perto do rosto, para enxergar melhor', 'A um braço de distância, com o topo na altura dos olhos', 'Abaixo da mesa', 'De frente para uma janela, com a luz batendo na tela'], certa: 1, exp: 'A uns 50 a 70 cm, com o topo da tela na altura dos olhos, o pescoço fica reto e os olhos se cansam menos.' },
    { parte: 'p6', q: 'Para escrever “ã” num teclado ABNT2, você:', op: ['Aperta a e depois ~', 'Aperta ~ e depois a', 'Segura Ctrl e aperta a', 'Aperta AltGr e depois a'], certa: 1, exp: 'As teclas de acento são teclas mortas: primeiro o acento (~) e depois a vogal (a).' },
    { parte: 'p6', q: 'Para escrever um A maiúsculo (letra da mão esquerda), qual Shift usar?', op: ['O Shift esquerdo', 'O Shift direito', 'Tanto faz', 'Nenhum: basta apertar Caps Lock a cada letra'], certa: 1, exp: 'Use o Shift da mão oposta: a mão direita segura o Shift enquanto a esquerda aperta o A.' },
    { parte: 'p7', q: 'O que significa PPM?', op: ['Palavras por minuto', 'Pontos por mês', 'Pressões por milímetro', 'Página por minuto'], certa: 0, exp: 'PPM é palavras por minuto, contando cada “palavra” como cinco caracteres, com os espaços.' },
    { parte: 'p7', q: 'Segundo o texto, o que deve vir primeiro ao aprender a digitar?', op: ['A velocidade', 'A precisão', 'Os atalhos de teclado', 'O teclado numérico'], certa: 1, exp: 'Primeiro a precisão: os dedos aprendem pela repetição, e a velocidade vem com a prática.' },
    { parte: 'p8', q: 'O que diz a regra 20-20-20?', op: ['Digite 20 minutos e descanse 20 minutos', 'A cada 20 minutos, olhe por 20 segundos para algo a uns 6 metros', 'Faça 20 alongamentos a cada 20 palavras', 'Pisque 20 vezes a cada 20 segundos'], certa: 1, exp: 'Olhar para longe por 20 segundos a cada 20 minutos relaxa os músculos dos olhos.' },
  ],
};
