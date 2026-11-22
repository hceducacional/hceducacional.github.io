/* =========================================================
   DISCIPLINA 1 — INTRODUÇÃO À INFORMÁTICA (curso "Informática do zero")
   Aulas 01 a 09 (texto em partes + questionário de 10 perguntas) e a Aula 10 (avaliação: 30 perguntas
   tiradas dos questionários). Aberto pela tela de leitura (curso/conteudo.js).
   Blocos: p, h, lista, passos, checklist, destaque{tom,titulo,texto}, tabela{cab,linhas}, fig, cards[{ico,t,d}],
   atalhos[[teclas,descrição]], linha[[ano,texto]], compara{a,b}, fluxo[{ico,t,d}], exemplo{titulo,linhas}, teclado.
   No texto: **negrito**, [[icone]] e {{Ctrl+C}}.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
(() => {
  const C = window.HC_CONTEUDOS;
  const Q = (parte, q, op, certa, exp) => ({ parte, q, op, certa, exp });

  C['d1-a01'] = {
    titulo: 'O que é Informática?',
    subtitulo: 'O que significa a palavra, onde a informática aparece no seu dia a dia e por que aprender a usar o computador abre portas.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Seja bem-vindo!', blocos: [
        { p: 'Você está começando o curso **Informática do Zero**. Aqui ninguém precisa saber nada antes: vamos aprender passo a passo, no seu ritmo, com uma linguagem simples e muitos exemplos do dia a dia.' },
        { p: 'Ao longo das disciplinas você vai aprender a usar o computador [[monitor]], organizar arquivos e pastas [[pasta]], escrever textos e montar planilhas, navegar na internet [[globo]] com segurança e criar o seu e-mail [[email]].' },
        { cards: [
          { ico: 'livro', t: 'Leia com calma', d: 'Cada aula é dividida em partes curtas. Leia uma de cada vez.' },
          { ico: 'chat', t: 'Responda as perguntas', d: 'Ao lado do texto (ou no botão “Perguntas”, no celular) ficam as perguntas da parte aberta.' },
          { ico: 'trofeu', t: 'Tire 7 ou mais', d: 'Com nota 7 ou mais a próxima aula é liberada.' },
        ] },
        { destaque: { tom: 'dica', titulo: 'Tenha um caderno por perto', texto: 'Anotar com as suas palavras ajuda a guardar o que você aprendeu. Escreva as dúvidas também: elas costumam ser respondidas nas próximas aulas.' } },
      ] },
      { id: 'p2', titulo: 'De onde vem a palavra', blocos: [
        { p: 'A palavra **informática** junta duas outras: **informação** + **automática**. Ou seja, é a área que estuda como guardar, organizar, processar e transmitir informações **de forma automática**, usando máquinas como o computador.' },
        { fluxo: [
          { ico: 'texto', t: 'Informação', d: 'textos, números, fotos, sons' },
          { ico: 'engrenagem', t: 'Automática', d: 'feita por uma máquina' },
          { ico: 'monitor', t: 'Informática', d: 'o computador trabalhando para nós' },
        ] },
        { p: 'Informação é tudo aquilo que tem algum significado para nós: o nome de uma pessoa, o preço de um produto, uma foto da família, uma música, o endereço de uma loja. O computador recebe essas informações, faz alguma coisa com elas e nos devolve um resultado.' },
        { destaque: { tom: 'saiba', titulo: 'Dado ou informação?', texto: 'O número **37** sozinho é só um **dado**. Quando sabemos que é a temperatura de uma pessoa em graus, ele vira **informação**: agora tem um sentido.' } },
      ] },
      { id: 'p3', titulo: 'A informática no seu dia a dia', blocos: [
        { p: 'Mesmo quem nunca sentou na frente de um computador já usa informática todos os dias, muitas vezes sem perceber:' },
        { cards: [
          { ico: 'celular', t: 'No celular', d: 'Mensagens, fotos, mapas e vídeos: o celular é um computador de bolso.' },
          { ico: 'cartao', t: 'No banco', d: 'Caixa eletrônico, Pix e aplicativo do banco funcionam com computadores.' },
          { ico: 'sacola', t: 'No mercado', d: 'O leitor de código de barras consulta o preço num sistema.' },
          { ico: 'calendario', t: 'Na saúde', d: 'Agendamento de consultas e exames ficam guardados em sistemas.' },
          { ico: 'livro', t: 'Na escola', d: 'Notas, trabalhos e aulas on-line passam pelo computador.' },
          { ico: 'casa', t: 'Em casa', d: 'Televisão inteligente, streaming de filmes e jogos.' },
        ] },
        { p: 'Por isso dizemos que a informática está **em todo lugar**. Aprender a usá-la deixa você mais independente para resolver coisas sozinho, sem precisar pedir ajuda a cada passo.' },
      ] },
      { id: 'p4', titulo: 'Por que aprender informática', blocos: [
        { p: 'Saber usar o computador hoje é tão importante quanto saber ler e escrever. Veja o que muda na vida de quem aprende:' },
        { checklist: [
          '**Trabalho:** a maioria das vagas pede conhecimentos básicos de informática, de recepcionista a vendedor.',
          '**Estudos:** pesquisar, fazer trabalhos e assistir aulas on-line fica muito mais fácil.',
          '**Autonomia:** marcar consultas, emitir documentos e pagar contas sem sair de casa.',
          '**Comunicação:** falar com a família e os amigos por mensagem, e-mail e chamada de vídeo.',
          '**Segurança:** quem entende como as coisas funcionam cai menos em golpes.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Errar faz parte', texto: 'Muita gente tem medo de “estragar” o computador. Fique tranquilo: clicar no lugar errado quase nunca causa problema sério. Explorar é a melhor forma de aprender.' } },
      ] },
      { id: 'p5', titulo: 'Como este curso funciona', blocos: [
        { p: 'O curso é dividido em **disciplinas**, cada uma sobre um assunto. Cada disciplina tem **9 aulas** e uma **avaliação final**:' },
        { passos: [
          'Leia a aula parte por parte, usando os botões **Anterior** e **Próxima** [[seta]].',
          'Responda as **10 perguntas** do questionário. A nota vai de 0 a 10.',
          'Com **nota 7 ou mais**, a próxima aula é liberada [[cadeado]].',
          'Abaixo de 7 é **recuperação**: revise o texto e libere uma nova tentativa com moedas do Saldo HC.',
          'No fim, a **Aula 10** é a avaliação da disciplina, com 30 perguntas das aulas anteriores.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Vale a maior nota', texto: 'Se você fizer uma nova tentativa, fica valendo a sua maior nota. Então não tenha pressa: leia com atenção antes de responder.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que o curso “Informática do Zero” espera que você já saiba antes de começar?', ['Saber programar', 'Nada: o curso começa do básico', 'Saber montar computadores', 'Ter feito outro curso antes'], 1, 'O curso foi feito para quem está começando do zero, sem precisar saber nada antes.'),
      Q('p1', 'No celular, onde ficam as perguntas da aula?', ['No final do curso', 'No botão “Perguntas”', 'Num caderno separado', 'Não existem perguntas no celular'], 1, 'No computador as perguntas ficam ao lado do texto; no celular, ficam no botão “Perguntas”.'),
      Q('p2', 'A palavra “informática” vem da junção de quais palavras?', ['Informação + automática', 'Informar + prática', 'Internet + matemática', 'Informação + máquina'], 0, 'Informática = informação + automática: tratar informações de forma automática, com máquinas.'),
      Q('p2', 'O número 37 só vira informação quando:', ['É escrito em vermelho', 'Ganha um sentido, como “37 graus de temperatura”', 'É digitado no computador', 'É muito grande'], 1, 'Um dado sozinho não diz muito. Quando ganha significado, vira informação.'),
      Q('p3', 'Qual destes exemplos usa informática?', ['Pagar com Pix', 'Ler um livro de papel', 'Varrer a casa', 'Plantar uma árvore'], 0, 'O Pix funciona com sistemas de computador do banco. Os outros exemplos não precisam de informática.'),
      Q('p3', 'Segundo o texto, o celular é:', ['Apenas um telefone', 'Um computador de bolso', 'Um tipo de televisão', 'Uma impressora'], 1, 'O celular faz quase tudo o que um computador faz: por isso é chamado de computador de bolso.'),
      Q('p4', 'Qual é uma vantagem de aprender informática?', ['Nunca mais precisar estudar', 'Ter mais autonomia para resolver tarefas', 'Não usar mais o celular', 'Ganhar um computador'], 1, 'Quem sabe usar o computador resolve mais coisas sozinho: consultas, documentos, contas.'),
      Q('p4', 'O que acontece quando você clica no lugar errado, na maioria das vezes?', ['O computador quebra', 'Nada de sério: é só voltar ou fechar', 'A internet acaba', 'Os arquivos somem para sempre'], 1, 'Errar faz parte. Quase sempre dá para voltar, fechar ou desfazer.'),
      Q('p5', 'Qual a nota mínima para liberar a próxima aula?', ['5', '6', '7', '10'], 2, 'Com nota 7 ou mais a próxima aula é liberada. Abaixo de 7 é recuperação.'),
      Q('p5', 'O que é a Aula 10 de cada disciplina?', ['Uma aula de revisão em vídeo', 'A avaliação final, com 30 perguntas', 'Uma aula opcional', 'Um jogo de digitação'], 1, 'A Aula 10 é a avaliação da disciplina, com 30 perguntas tiradas das Aulas 01 a 09.'),
    ],
  };

  C['d1-a02'] = {
    titulo: 'Breve história da informática',
    subtitulo: 'Do ábaco ao smartphone: como as pessoas inventaram máquinas para calcular e chegaram ao computador que usamos hoje.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Antes dos computadores', blocos: [
        { p: 'Desde sempre as pessoas precisaram **contar e calcular**: rebanhos, colheitas, dinheiro. Primeiro usavam os dedos, pedrinhas e marcas em ossos. Depois vieram as primeiras ferramentas de cálculo.' },
        { linha: [
          ['3.000 a.C.', 'O **ábaco** surge na Mesopotâmia e se espalha pela China e pelo Oriente: bolinhas em varetas que ajudam a fazer contas.'],
          ['1642', 'O francês **Blaise Pascal** cria a **Pascalina**, uma máquina de engrenagens que somava e subtraía.'],
          ['1801', 'O tear de **Jacquard** usa **cartões perfurados** para “programar” os desenhos dos tecidos.'],
          ['1837', '**Charles Babbage** projeta a Máquina Analítica, considerada a avó do computador.'],
        ] },
        { destaque: { tom: 'saiba', titulo: 'A primeira programadora', texto: '**Ada Lovelace**, matemática inglesa, escreveu por volta de 1843 instruções para a máquina de Babbage. Por isso é lembrada como a **primeira programadora** da história.' } },
      ] },
      { id: 'p2', titulo: 'Os primeiros computadores', blocos: [
        { p: 'Os computadores eletrônicos surgiram durante e logo depois da Segunda Guerra Mundial, nos anos 1940. Eram enormes, caros e usados por governos e universidades.' },
        { linha: [
          ['1946', 'O **ENIAC**, nos Estados Unidos, pesava cerca de **30 toneladas** e ocupava uma sala inteira. Funcionava com milhares de **válvulas**.'],
          ['1947', 'É inventado o **transistor**, peça bem menor que a válvula, que esquenta menos e quebra menos.'],
          ['1958', 'Surge o **circuito integrado** (o chip), que junta muitos transistores numa pecinha só.'],
        ] },
        { p: 'Repare na tendência: a cada invenção, o computador ficava **menor, mais rápido e mais barato**. Essa é a grande história da informática.' },
        { destaque: { tom: 'dica', titulo: 'Para comparar', texto: 'O celular que cabe no seu bolso é milhões de vezes mais rápido que o ENIAC, que precisava de uma sala do tamanho de uma quadra.' } },
      ] },
      { id: 'p3', titulo: 'O computador chega às casas', blocos: [
        { p: 'Nos anos 1970 foi criado o **microprocessador**: um único chip que fazia o trabalho de “cérebro” do computador. Com ele nasceram os **computadores pessoais**, os famosos **PCs** (do inglês *personal computer*).' },
        { linha: [
          ['1971', 'A Intel lança o **4004**, o primeiro microprocessador vendido comercialmente.'],
          ['1977', 'Computadores como o **Apple II** começam a ser vendidos para usar em casa.'],
          ['1981', 'A IBM lança o **IBM PC**, que vira o modelo para os computadores de mesa.'],
          ['1985', 'Surge o **Windows**, que troca os comandos digitados por janelas e ícones clicáveis.'],
        ] },
        { p: 'Com o **mouse** [[mouse]] e as **janelas** [[janela]], qualquer pessoa passou a conseguir usar um computador, sem decorar comandos difíceis.' },
      ] },
      { id: 'p4', titulo: 'Internet e celulares', blocos: [
        { p: 'Nos anos 1990 a **internet** [[globo]] chegou às casas e mudou tudo: os computadores passaram a conversar entre si no mundo inteiro. No Brasil, o acesso comercial começou em **1995**.' },
        { linha: [
          ['1991', 'Nasce a **World Wide Web** (o “www”), criada por Tim Berners-Lee: as páginas com links que usamos até hoje.'],
          ['1998', 'Surge o **Google**, que facilita encontrar informações na internet.'],
          ['2007', 'Chegam os **smartphones** com tela sensível ao toque, como o iPhone. Logo depois vêm os celulares com Android.'],
          ['Hoje', '**Inteligência artificial**, computação em nuvem e aparelhos conectados em todo lugar.'],
        ] },
        { fig: 'dispositivos', legenda: 'Hoje há computadores de muitos tamanhos: do servidor gigante ao celular de bolso.' },
      ] },
      { id: 'p5', titulo: 'O que aprendemos com a história', blocos: [
        { p: 'Olhando a linha do tempo inteira, dá para tirar três lições importantes:' },
        { cards: [
          { ico: 'grafico', t: 'Cada vez menores', d: 'De uma sala inteira para a palma da mão.' },
          { ico: 'raio', t: 'Cada vez mais rápidos', d: 'Fazem bilhões de contas por segundo.' },
          { ico: 'grupo', t: 'Cada vez para mais gente', d: 'Antes só governos; hoje quase todo mundo.' },
        ] },
        { p: 'E a história não parou: a tecnologia continua mudando. Por isso, mais importante do que decorar datas é **aprender a aprender**: entender a lógica de como as coisas funcionam para se adaptar às novidades.' },
        { destaque: { tom: 'dica', titulo: 'Para guardar', texto: 'Ábaco → máquinas de engrenagens → ENIAC → transistor e chip → computador pessoal → internet → smartphone.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual destas é uma das ferramentas de cálculo mais antigas?', ['O ábaco', 'A calculadora de bolso', 'O teclado', 'O mouse'], 0, 'O ábaco, com bolinhas em varetas, é usado há milhares de anos para fazer contas.'),
      Q('p1', 'Quem é lembrada como a primeira programadora da história?', ['Marie Curie', 'Ada Lovelace', 'Anita Garibaldi', 'Grace Kelly'], 1, 'Ada Lovelace escreveu instruções para a máquina de Charles Babbage por volta de 1843.'),
      Q('p2', 'Como era o ENIAC, um dos primeiros computadores eletrônicos?', ['Do tamanho de um celular', 'Pesava cerca de 30 toneladas e ocupava uma sala', 'Cabia numa mesa', 'Era feito de papel'], 1, 'O ENIAC, de 1946, era enorme: cerca de 30 toneladas, com milhares de válvulas.'),
      Q('p2', 'Qual invenção substituiu as válvulas e ajudou a diminuir os computadores?', ['O transistor', 'A impressora', 'O monitor', 'O mouse'], 0, 'O transistor, de 1947, era menor, esquentava menos e quebrava menos que as válvulas.'),
      Q('p3', 'O que significa a sigla PC?', ['Programa de Computador', 'Computador Pessoal', 'Placa Central', 'Painel de Controle'], 1, 'PC vem do inglês personal computer: computador pessoal.'),
      Q('p3', 'O que o Windows trouxe de novo em 1985?', ['A internet', 'Janelas e ícones clicáveis no lugar de comandos digitados', 'O primeiro celular', 'O ábaco eletrônico'], 1, 'Com janelas, ícones e o mouse, ficou muito mais fácil usar o computador.'),
      Q('p4', 'Em que ano começou o acesso comercial à internet no Brasil?', ['1965', '1985', '1995', '2015'], 2, 'O acesso comercial à internet no Brasil começou em 1995.'),
      Q('p4', 'O que chegou em 2007 e mudou o jeito de usar a tecnologia?', ['O ábaco', 'O smartphone com tela sensível ao toque', 'O ENIAC', 'O disquete'], 1, 'Em 2007 chegaram os smartphones com tela de toque, como o iPhone.'),
      Q('p5', 'Qual a grande tendência na história dos computadores?', ['Ficar maiores e mais caros', 'Ficar menores, mais rápidos e mais baratos', 'Ficar mais lentos', 'Ser usados só por governos'], 1, 'A cada invenção, o computador ficou menor, mais rápido, mais barato e chegou a mais gente.'),
      Q('p5', 'Segundo o texto, o que é mais importante do que decorar datas?', ['Comprar o computador mais caro', 'Aprender a aprender e entender a lógica das coisas', 'Saber o nome de todos os inventores', 'Evitar as novidades'], 1, 'A tecnologia muda sempre: entender a lógica ajuda a se adaptar às novidades.'),
    ],
  };

  C['d1-a03'] = {
    titulo: 'Hardware e software',
    subtitulo: 'O computador tem uma parte que você pode tocar e outra que dá as ordens. Entenda a diferença e como as duas trabalham juntas.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'As duas partes do computador', blocos: [
        { p: 'Todo computador é formado por duas partes que só funcionam juntas: o **hardware** e o **software**. São palavras em inglês, mas fáceis de lembrar.' },
        { compara: {
          a: { t: 'Hardware', ico: 'cpu', itens: ['A parte **física**', 'Você pode **tocar**', 'Monitor, teclado, mouse, peças de dentro', 'Se estraga, é preciso **consertar ou trocar** a peça'] },
          b: { t: 'Software', ico: 'codigo', itens: ['A parte **lógica**', 'Você **não pode tocar**', 'Programas, aplicativos, jogos, Windows', 'Se dá problema, é preciso **reinstalar ou atualizar**'] },
        } },
        { destaque: { tom: 'dica', titulo: 'Um jeito fácil de lembrar', texto: '**Hard** em inglês quer dizer “duro”: é a parte dura, que você chuta (mas não chute!). **Soft** quer dizer “macio”: é a parte que você só xinga.' } },
      ] },
      { id: 'p2', titulo: 'Hardware: a parte física', blocos: [
        { p: 'Hardware é todo equipamento físico do computador: as peças de dentro do gabinete e os aparelhos ligados a ele.' },
        { fig: 'computador', legenda: 'Monitor, gabinete, teclado e mouse: tudo isso é hardware.' },
        { cards: [
          { ico: 'monitor', t: 'Monitor', d: 'A tela onde você vê as imagens.' },
          { ico: 'teclado', t: 'Teclado', d: 'Para digitar letras, números e comandos.' },
          { ico: 'mouse', t: 'Mouse', d: 'Para apontar e clicar na tela.' },
          { ico: 'cpu', t: 'Processador', d: 'O “cérebro” que faz as contas, dentro do gabinete.' },
        ] },
      ] },
      { id: 'p3', titulo: 'Software: a parte lógica', blocos: [
        { p: 'Software é o conjunto de **instruções** que diz ao hardware o que fazer. Você não pega um software com a mão: ele fica guardado no computador e aparece na tela quando é aberto.' },
        { tabela: { cab: ['Tipo de software', 'Para que serve', 'Exemplos'], linhas: [
          ['Sistema operacional', 'Comanda o computador inteiro e deixa os outros programas funcionarem', 'Windows, Android, iOS, Linux'],
          ['Aplicativos', 'Fazem tarefas para o usuário', 'Word, Excel, navegador, WhatsApp'],
          ['Utilitários', 'Cuidam e protegem o computador', 'Antivírus, programas de limpeza'],
          ['Jogos', 'Entretenimento', 'Jogos de celular e de computador'],
        ] } },
        { destaque: { tom: 'saiba', titulo: 'Programa ou aplicativo?', texto: 'É a mesma coisa! No computador costumamos dizer **programa**; no celular, **aplicativo** ou **app**.' } },
      ] },
      { id: 'p4', titulo: 'Os dois trabalhando juntos', blocos: [
        { p: 'Um não vive sem o outro. Um computador sem software é só um monte de peças paradas. E um software sem hardware não tem onde rodar.' },
        { fluxo: [
          { ico: 'mao', t: 'Você', d: 'aperta uma tecla' },
          { ico: 'teclado', t: 'Hardware', d: 'o teclado envia o sinal' },
          { ico: 'codigo', t: 'Software', d: 'o programa entende a letra' },
          { ico: 'monitor', t: 'Hardware', d: 'o monitor mostra a letra' },
        ] },
        { p: 'Pense num **violão** [[som]]: o violão é o hardware, e a música é o software. O violão sozinho não toca nada; a música precisa do violão para ser ouvida.' },
      ] },
      { id: 'p5', titulo: 'Quando dá problema', blocos: [
        { p: 'Saber a diferença ajuda muito na hora de resolver problemas ou explicar para um técnico o que está acontecendo:' },
        { tabela: { cab: ['Situação', 'Provável origem'], linhas: [
          ['A tela trincou', 'Hardware'],
          ['Um programa fecha sozinho', 'Software'],
          ['O teclado não acende nem digita', 'Hardware (ou o cabo)'],
          ['Aparece mensagem de erro ao abrir um aplicativo', 'Software'],
          ['O computador não liga de jeito nenhum', 'Hardware (fonte, tomada, cabo)'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Primeiro, o mais simples', texto: 'Antes de chamar ajuda, confira se o cabo está bem encaixado e tente **reiniciar** o computador. Muitos problemas de software se resolvem assim.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é hardware?', ['A parte física do computador, que podemos tocar', 'Os programas do computador', 'A internet', 'As senhas'], 0, 'Hardware é a parte física: peças e equipamentos que podemos tocar.'),
      Q('p1', 'O que é software?', ['O gabinete', 'A parte lógica: programas e instruções', 'O cabo de energia', 'A mesa do computador'], 1, 'Software é a parte lógica, que não podemos tocar: programas, aplicativos e o sistema.'),
      Q('p2', 'Qual destes é um exemplo de hardware?', ['WhatsApp', 'Windows', 'Teclado', 'Antivírus'], 2, 'O teclado é uma peça física. Os outros são programas (software).'),
      Q('p2', 'Qual peça é conhecida como o “cérebro” do computador?', ['O mouse', 'O processador', 'O monitor', 'A caixa de som'], 1, 'O processador faz as contas e comanda o trabalho, por isso é chamado de cérebro.'),
      Q('p3', 'O Windows é um exemplo de:', ['Hardware', 'Sistema operacional', 'Periférico', 'Cabo'], 1, 'O Windows é o sistema operacional: o software que comanda o computador.'),
      Q('p3', 'Qual a diferença entre programa e aplicativo?', ['Programa é hardware e aplicativo é software', 'Nenhuma: são nomes diferentes para software', 'Aplicativo só existe no computador', 'Programa só existe no celular'], 1, 'São a mesma coisa: no computador dizemos programa; no celular, aplicativo ou app.'),
      Q('p4', 'Na comparação com o violão, o que representa o software?', ['O violão', 'As cordas', 'A música', 'A capa do violão'], 2, 'O violão é o hardware e a música é o software: um precisa do outro.'),
      Q('p4', 'Um computador sem nenhum software:', ['Funciona normalmente', 'Fica só com peças paradas, sem fazer nada', 'Fica mais rápido', 'Acessa a internet sozinho'], 1, 'Sem software, o hardware não sabe o que fazer.'),
      Q('p5', 'Um programa que fecha sozinho provavelmente tem um problema de:', ['Hardware', 'Software', 'Tomada', 'Monitor'], 1, 'Programas fechando sozinhos costumam ser problemas de software.'),
      Q('p5', 'Qual a primeira coisa a tentar quando um programa trava?', ['Jogar o computador fora', 'Reiniciar o computador', 'Trocar o monitor', 'Desligar da tomada com ele ligado'], 1, 'Reiniciar resolve muitos problemas de software. Sempre comece pelo mais simples.'),
    ],
  };

  C['d1-a04'] = {
    titulo: 'Tipos de computadores',
    subtitulo: 'Computador de mesa, notebook, tablet, celular e servidor: cada um tem o seu jeito e a sua utilidade.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Computadores de todos os tamanhos', blocos: [
        { p: 'Quando falamos “computador”, muita gente pensa na tela com o teclado em cima da mesa. Mas hoje existem computadores de vários formatos, e todos fazem a mesma coisa básica: **recebem informações, processam e mostram um resultado**.' },
        { fig: 'dispositivos', legenda: 'Desktop, notebook, tablet, celular e servidor: todos são computadores.' },
        { p: 'O que muda é o **tamanho**, a **potência**, a **facilidade de carregar** e o **preço**. Vamos conhecer cada um.' },
      ] },
      { id: 'p2', titulo: 'Desktop: o computador de mesa', blocos: [
        { p: 'O **desktop** [[monitor]] (em português, “em cima da mesa”) é o computador formado por **gabinete**, **monitor**, **teclado** e **mouse** separados. Ele fica sempre no mesmo lugar e precisa estar ligado na tomada.' },
        { compara: {
          a: { t: 'Vantagens', ico: 'check', itens: ['Costuma ser mais **potente** pelo mesmo preço', 'Fácil de **consertar** e trocar peças', 'Tela e teclado grandes e confortáveis'] },
          b: { t: 'Desvantagens', ico: 'x', itens: ['**Não dá para levar** para outro lugar', 'Ocupa **mais espaço**', 'Desliga se faltar energia'] },
        } },
        { p: 'Existe também o **All-in-One** (tudo em um): o gabinete fica escondido atrás do monitor, ocupando menos espaço.' },
      ] },
      { id: 'p3', titulo: 'Notebook: o computador portátil', blocos: [
        { p: 'O **notebook** [[notebook]] (ou laptop) junta tela, teclado e um mouse de toque (o **touchpad**) numa peça só, que abre e fecha como um caderno. Tem **bateria** [[bateria]], então funciona longe da tomada por algumas horas.' },
        { lista: [
          '**Ótimo para:** estudar, trabalhar em lugares diferentes, viajar.',
          '**Atenção:** a bateria precisa ser carregada e o conserto costuma ser mais caro.',
          '**Touchpad:** o retângulo abaixo do teclado. Deslize o dedo para mover a setinha e toque para clicar.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Cuidado com o notebook', texto: 'Não feche a tampa com objetos sobre o teclado, não use em cima da cama ou de almofadas (ele esquenta) e segure sempre pela base, não pela tela.' } },
      ] },
      { id: 'p4', titulo: 'Tablet e celular', blocos: [
        { p: 'O **tablet** [[tablet]] e o **smartphone** [[celular]] são computadores com **tela sensível ao toque**: você usa os dedos no lugar do mouse e do teclado.' },
        { tabela: { cab: ['', 'Tablet', 'Smartphone'], linhas: [
          ['Tamanho da tela', 'Grande (7 a 13 polegadas)', 'Pequena (5 a 7 polegadas)'],
          ['Faz ligação?', 'Alguns modelos', 'Sim'],
          ['Bom para', 'Ler, assistir vídeos, estudar', 'Comunicação, fotos, levar no bolso'],
          ['Sistemas', 'Android, iPadOS', 'Android, iOS'],
        ] } },
        { p: 'Muita coisa que você vai aprender neste curso também vale para o celular: pastas, aplicativos, internet, e-mail e segurança.' },
      ] },
      { id: 'p5', titulo: 'Servidores e outros computadores', blocos: [
        { p: 'Existem computadores que você nunca vê, mas usa todos os dias. Os **servidores** [[servidor]] são computadores potentes que ficam ligados o tempo todo, guardando sites, e-mails, vídeos e fotos para milhões de pessoas.' },
        { p: 'Quando você assiste a um vídeo na internet, ele está guardado num servidor, às vezes do outro lado do mundo. Grandes empresas juntam milhares de servidores em prédios chamados **data centers**.' },
        { cards: [
          { ico: 'servidor', t: 'Servidores', d: 'Guardam sites, e-mails e arquivos na nuvem.' },
          { ico: 'cartao', t: 'Caixas eletrônicos', d: 'Computadores especiais dos bancos.' },
          { ico: 'video', t: 'TVs e videogames', d: 'Também têm processador e software.' },
          { ico: 'relogio', t: 'Relógios inteligentes', d: 'Pequenos computadores no pulso.' },
        ] },
        { destaque: { tom: 'saiba', titulo: 'Qual escolher?', texto: 'Não existe o melhor para todos. Pense no uso: para trabalhar em casa, um desktop; para levar para a escola, um notebook; para o dia a dia, o celular.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que todos os tipos de computador fazem?', ['Só fazem ligações', 'Recebem informações, processam e mostram um resultado', 'Só imprimem', 'Só acessam a internet'], 1, 'Todos os computadores recebem dados, processam e devolvem um resultado.'),
      Q('p1', 'O que muda de um tipo de computador para outro?', ['Nada', 'Tamanho, potência, facilidade de carregar e preço', 'Apenas a cor', 'Só o nome'], 1, 'Os tipos mudam no tamanho, na potência, na portabilidade e no preço.'),
      Q('p2', 'O que significa “desktop”?', ['Em cima da mesa', 'Computador de bolso', 'Tela de toque', 'Sem fio'], 0, 'Desktop quer dizer “em cima da mesa”: o computador que fica sempre no mesmo lugar.'),
      Q('p2', 'Qual é uma desvantagem do desktop?', ['É fraco', 'Não dá para levar para outro lugar', 'Não tem teclado', 'Não liga na tomada'], 1, 'O desktop é ótimo, mas fica preso à mesa e à tomada.'),
      Q('p3', 'Como se chama o “mouse de toque” do notebook?', ['Touchpad', 'Joystick', 'Scanner', 'Webcam'], 0, 'O touchpad é o retângulo abaixo do teclado: deslize o dedo para mover a setinha.'),
      Q('p3', 'Qual destes é um cuidado certo com o notebook?', ['Usar em cima de almofadas', 'Segurar pela tela', 'Não fechar a tampa com objetos sobre o teclado', 'Deixar a bateria sempre vazia'], 2, 'Objetos sobre o teclado podem quebrar a tela ao fechar a tampa.'),
      Q('p4', 'O que tablets e smartphones têm em comum?', ['Teclado físico grande', 'Tela sensível ao toque', 'Gabinete separado', 'Não usam sistema operacional'], 1, 'Os dois usam tela sensível ao toque: os dedos substituem o mouse e o teclado.'),
      Q('p4', 'Qual sistema operacional é usado em celulares?', ['Android', 'Excel', 'Word', 'Chrome'], 0, 'Android e iOS são sistemas de celular. Excel e Word são aplicativos; Chrome é um navegador.'),
      Q('p5', 'O que é um servidor?', ['Uma pessoa que serve café', 'Um computador potente que guarda sites, e-mails e arquivos', 'Um tipo de mouse', 'Um celular antigo'], 1, 'Servidores ficam ligados o tempo todo e guardam informações para muitas pessoas.'),
      Q('p5', 'Como se chamam os prédios com milhares de servidores?', ['Data centers', 'Shopping centers', 'Lan houses', 'Cybercafés'], 0, 'Data centers são prédios cheios de servidores, onde fica guardado muito do que usamos na internet.'),
    ],
  };

  C['d1-a05'] = {
    titulo: 'Componentes básicos do computador',
    subtitulo: 'Abra o gabinete (com a imaginação!) e conheça o processador, a memória, o armazenamento, a placa-mãe e a fonte.',
    leitura: 12,
    partes: [
      { id: 'p1', titulo: 'Por dentro do gabinete', blocos: [
        { p: 'O **gabinete** é a caixa onde ficam as principais peças do computador. No notebook, celular e tablet, essas mesmas peças existem, só que bem menores e coladas umas nas outras.' },
        { fig: 'placa', legenda: 'As principais peças: processador, memória RAM, armazenamento, ventoinha e fonte, todas ligadas à placa-mãe.' },
        { destaque: { tom: 'atencao', titulo: 'Não abra sozinho', texto: 'Abrir o gabinete com o computador ligado na tomada é perigoso. Deixe a troca de peças para um técnico ou para alguém com experiência.' } },
      ] },
      { id: 'p2', titulo: 'Processador e placa-mãe', blocos: [
        { p: 'O **processador** [[cpu]] (ou **CPU**, Unidade Central de Processamento) é o “cérebro” do computador. É ele que faz as contas e executa as instruções dos programas, **bilhões de vezes por segundo**.' },
        { p: 'A velocidade do processador é medida em **gigahertz (GHz)**, e os modernos têm vários **núcleos**, como se fossem vários cérebros trabalhando juntos.' },
        { p: 'A **placa-mãe** é a placa grande onde todas as peças se encaixam. Ela liga o processador à memória, ao armazenamento, ao teclado, ao monitor: é como as **ruas de uma cidade**, por onde as informações circulam.' },
        { destaque: { tom: 'saiba', titulo: 'Esquenta!', texto: 'O processador trabalha tanto que esquenta. Por isso ele tem um **cooler** (ventoinha) [[engrenagem]] em cima. Se o computador fica muito quente, ele fica lento ou desliga sozinho.' } },
      ] },
      { id: 'p3', titulo: 'Memória RAM', blocos: [
        { p: 'A **memória RAM** [[memoria]] é a memória de **trabalho**: guarda o que está sendo usado **agora**, como os programas abertos e o texto que você está digitando.' },
        { p: 'Ela é muito rápida, mas é **temporária**: quando o computador desliga, tudo que estava só na RAM **se apaga**. Por isso é tão importante **salvar** os arquivos!' },
        { compara: {
          a: { t: 'Memória RAM', ico: 'memoria', itens: ['Guarda o que está em uso agora', '**Apaga** quando desliga', 'Muito rápida', 'Exemplo: 8 GB'] },
          b: { t: 'Armazenamento', ico: 'hd', itens: ['Guarda os arquivos para sempre', '**Não apaga** quando desliga', 'Mais lento que a RAM', 'Exemplo: 512 GB'] },
        } },
        { destaque: { tom: 'dica', titulo: 'A mesa e o armário', texto: 'Pense na RAM como a **mesa** onde você trabalha e no armazenamento como o **armário**. Quanto maior a mesa, mais coisas você abre ao mesmo tempo. No fim do dia, o que não foi guardado no armário se perde.' } },
      ] },
      { id: 'p4', titulo: 'Armazenamento: HD e SSD', blocos: [
        { p: 'O **armazenamento** é onde ficam guardados, de forma permanente, o sistema, os programas, as fotos, os documentos e as músicas. Existem dois tipos principais:' },
        { tabela: { cab: ['', 'HD (disco rígido)', 'SSD'], linhas: [
          ['Como funciona', 'Disco que gira, com uma agulha que lê', 'Chips, sem partes móveis'],
          ['Velocidade', 'Mais lento', 'Muito mais rápido'],
          ['Preço', 'Mais barato por GB', 'Mais caro por GB'],
          ['Barulho', 'Faz um pouco de barulho', 'Silencioso'],
        ] } },
        { h: 'As medidas: bytes' },
        { p: 'O tamanho dos arquivos e da memória é medido em **bytes**. Como os números ficam grandes, usamos múltiplos:' },
        { tabela: { cab: ['Medida', 'Equivale a', 'Exemplo'], linhas: [
          ['1 KB (kilobyte)', 'cerca de mil bytes', 'um texto curto'],
          ['1 MB (megabyte)', 'cerca de mil KB', 'uma foto de celular (2 a 5 MB)'],
          ['1 GB (gigabyte)', 'cerca de mil MB', 'um filme (1 a 4 GB)'],
          ['1 TB (terabyte)', 'cerca de mil GB', 'centenas de filmes'],
        ] } },
      ] },
      { id: 'p5', titulo: 'Fonte, placas e conexões', blocos: [
        { p: 'Ainda faltam algumas peças importantes:' },
        { cards: [
          { ico: 'raio', t: 'Fonte', d: 'Recebe a energia da tomada e distribui para todas as peças.' },
          { ico: 'video', t: 'Placa de vídeo', d: 'Cria as imagens que aparecem no monitor. Importante para jogos e vídeos.' },
          { ico: 'som', t: 'Placa de som', d: 'Cuida do áudio das caixinhas e fones.' },
          { ico: 'wifi', t: 'Placa de rede', d: 'Conecta o computador à internet, por cabo ou Wi-Fi.' },
        ] },
        { p: 'Na parte de trás do gabinete (e nas laterais do notebook) ficam as **portas de conexão**, como as **USB**, onde ligamos pendrive [[pendrive]], mouse, teclado e impressora, e a **HDMI**, para ligar uma TV ou monitor.' },
        { destaque: { tom: 'saiba', titulo: 'Na hora de comprar', texto: 'Os três números que mais importam numa propaganda de computador são: o **processador**, a quantidade de **RAM** (8 GB é um bom começo) e o **armazenamento** (de preferência SSD).' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Onde ficam as principais peças de um computador de mesa?', ['No monitor', 'No gabinete', 'No mouse', 'No teclado'], 1, 'O gabinete é a caixa que guarda as peças principais.'),
      Q('p1', 'O que NÃO se deve fazer?', ['Chamar um técnico para trocar peças', 'Abrir o gabinete com o computador ligado na tomada', 'Manter o computador limpo', 'Desligar pelo menu Iniciar'], 1, 'Abrir o gabinete ligado na tomada é perigoso.'),
      Q('p2', 'Qual peça faz as contas e executa as instruções dos programas?', ['A fonte', 'O processador (CPU)', 'O pendrive', 'A placa de som'], 1, 'O processador é o “cérebro”: executa bilhões de instruções por segundo.'),
      Q('p2', 'Para que serve a placa-mãe?', ['Para imprimir', 'Para ligar todas as peças entre si', 'Para guardar fotos', 'Para resfriar o computador'], 1, 'A placa-mãe é onde as peças se encaixam e conversam, como as ruas de uma cidade.'),
      Q('p3', 'O que acontece com o que está só na memória RAM quando o computador desliga?', ['Fica guardado para sempre', 'Vai para a internet', 'Se apaga', 'Vira um arquivo PDF'], 2, 'A RAM é temporária: tudo que não foi salvo se perde ao desligar.'),
      Q('p3', 'Na comparação do texto, a memória RAM é como:', ['O armário', 'A mesa de trabalho', 'A porta', 'O telhado'], 1, 'A RAM é a mesa onde você trabalha; o armazenamento é o armário onde guarda.'),
      Q('p4', 'Qual a vantagem do SSD em relação ao HD?', ['É muito mais rápido e silencioso', 'É mais barato por GB', 'Tem um disco que gira', 'Apaga ao desligar'], 0, 'O SSD não tem partes móveis: é bem mais rápido e silencioso.'),
      Q('p4', 'Qual medida é maior?', ['1 KB', '1 MB', '1 GB', '1 TB'], 3, 'Do menor para o maior: KB, MB, GB e TB. Cada um vale cerca de mil do anterior.'),
      Q('p5', 'Qual peça recebe a energia da tomada e distribui para as outras?', ['A fonte', 'A placa de vídeo', 'O SSD', 'A memória RAM'], 0, 'A fonte transforma e distribui a energia para todas as peças.'),
      Q('p5', 'Em qual porta costumamos ligar um pendrive?', ['HDMI', 'USB', 'Tomada', 'Fone'], 1, 'Pendrive, mouse, teclado e impressora costumam ser ligados nas portas USB.'),
    ],
  };

  C['d1-a06'] = {
    titulo: 'Dispositivos de entrada e saída',
    subtitulo: 'Como a informação entra no computador, é processada e sai para você ver, ouvir ou imprimir.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Entrada, processamento e saída', blocos: [
        { p: 'Todo computador trabalha num ciclo simples de três etapas. Entender esse ciclo ajuda a entender qualquer aparelho:' },
        { fluxo: [
          { ico: 'teclado', t: 'Entrada', d: 'a informação entra' },
          { ico: 'cpu', t: 'Processamento', d: 'o computador trabalha' },
          { ico: 'monitor', t: 'Saída', d: 'o resultado aparece' },
        ] },
        { p: 'Por exemplo: você digita **2 + 2** no teclado (entrada), o processador faz a conta (processamento) e o **4** aparece na tela (saída).' },
        { p: 'Os aparelhos ligados ao computador, como teclado, mouse e impressora, são chamados de **periféricos**: ficam “na periferia”, ao redor do computador.' },
      ] },
      { id: 'p2', titulo: 'Dispositivos de entrada', blocos: [
        { p: 'São os que **enviam** informações **para dentro** do computador:' },
        { cards: [
          { ico: 'teclado', t: 'Teclado', d: 'Letras, números e comandos.' },
          { ico: 'mouse', t: 'Mouse', d: 'Aponta, clica e arrasta.' },
          { ico: 'microfone', t: 'Microfone', d: 'Capta a sua voz.' },
          { ico: 'camera', t: 'Webcam', d: 'Captura imagem para chamadas de vídeo.' },
          { ico: 'imagem', t: 'Scanner', d: 'Transforma papel em imagem digital.' },
          { ico: 'olho', t: 'Leitor biométrico', d: 'Lê a sua digital ou o seu rosto.' },
        ] },
      ] },
      { id: 'p3', titulo: 'Dispositivos de saída', blocos: [
        { p: 'São os que **mostram** ou **entregam** o resultado do trabalho do computador:' },
        { cards: [
          { ico: 'monitor', t: 'Monitor', d: 'Mostra imagens, textos e vídeos.' },
          { ico: 'impressora', t: 'Impressora', d: 'Coloca o documento no papel.' },
          { ico: 'som', t: 'Caixas de som e fones', d: 'Tocam músicas, vídeos e alertas.' },
          { ico: 'video', t: 'Projetor', d: 'Mostra a tela numa parede, bem grande.' },
        ] },
        { destaque: { tom: 'dica', titulo: 'Como lembrar', texto: 'Pergunte: “a informação **entra** ou **sai** por este aparelho?”. O microfone ouve a sua voz (entra). A caixa de som fala com você (sai).' } },
      ] },
      { id: 'p4', titulo: 'Os que fazem as duas coisas', blocos: [
        { p: 'Alguns aparelhos são de **entrada e saída** ao mesmo tempo:' },
        { tabela: { cab: ['Dispositivo', 'Entrada', 'Saída'], linhas: [
          ['Tela de toque (celular, tablet)', 'Você toca na tela', 'A tela mostra a imagem'],
          ['Impressora multifuncional', 'Digitaliza (scanner)', 'Imprime'],
          ['Headset (fone com microfone)', 'Microfone', 'Fone de ouvido'],
          ['Pendrive e HD externo', 'Levam arquivos para o computador', 'Recebem arquivos do computador'],
        ] } },
        { p: 'Os dispositivos que guardam arquivos, como o pendrive [[pendrive]], também são chamados de **dispositivos de armazenamento**.' },
      ] },
      { id: 'p5', titulo: 'Conectando os periféricos', blocos: [
        { p: 'Os periféricos podem ser ligados por **cabo** ou **sem fio**:' },
        { lista: [
          '**USB:** a conexão mais comum, para mouse, teclado, pendrive e impressora.',
          '**HDMI:** leva imagem e som para monitores, TVs e projetores.',
          '**Bluetooth:** conexão sem fio de curta distância, para fones, mouses e caixinhas de som.',
          '**Wi-Fi:** sem fio, usado por impressoras modernas e, claro, para a internet.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Ligar e usar', texto: 'A maioria dos periféricos USB funciona assim que é ligada: o Windows instala sozinho o que precisa. Isso se chama **Plug and Play** (ligue e use).' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Quais são as três etapas do trabalho do computador?', ['Ligar, usar e desligar', 'Entrada, processamento e saída', 'Abrir, salvar e fechar', 'Copiar, colar e apagar'], 1, 'A informação entra, é processada e o resultado sai.'),
      Q('p1', 'Como são chamados os aparelhos ligados ao computador, como teclado e impressora?', ['Periféricos', 'Softwares', 'Aplicativos', 'Servidores'], 0, 'Periféricos ficam ao redor do computador e se conectam a ele.'),
      Q('p2', 'Qual destes é um dispositivo de entrada?', ['Impressora', 'Microfone', 'Caixa de som', 'Projetor'], 1, 'O microfone leva a sua voz para dentro do computador: é entrada.'),
      Q('p2', 'Para que serve o scanner?', ['Imprimir', 'Transformar papel em imagem digital', 'Tocar música', 'Carregar a bateria'], 1, 'O scanner digitaliza documentos e fotos de papel.'),
      Q('p3', 'Qual destes é um dispositivo de saída?', ['Teclado', 'Mouse', 'Monitor', 'Webcam'], 2, 'O monitor mostra o resultado: é saída.'),
      Q('p3', 'A caixa de som é um dispositivo de:', ['Entrada', 'Saída', 'Processamento', 'Armazenamento'], 1, 'A caixa de som entrega o som para você: é saída.'),
      Q('p4', 'Por que a tela de toque é de entrada e saída?', ['Porque é colorida', 'Porque recebe o toque e mostra a imagem', 'Porque é grande', 'Porque usa bateria'], 1, 'Ela recebe o seu toque (entrada) e mostra a imagem (saída).'),
      Q('p4', 'Uma impressora multifuncional com scanner é:', ['Só de entrada', 'Só de saída', 'De entrada e saída', 'Um processador'], 2, 'Ela digitaliza (entrada) e imprime (saída).'),
      Q('p5', 'Qual conexão leva imagem e som para uma TV?', ['USB', 'HDMI', 'Tomada', 'Bluetooth'], 1, 'O cabo HDMI leva imagem e som para TVs, monitores e projetores.'),
      Q('p5', 'O que significa Plug and Play?', ['Ligue e use', 'Jogue e ganhe', 'Desligue e ligue', 'Pague e use'], 0, 'Plug and Play: o aparelho funciona logo que é ligado.'),
    ],
  };

  C['d1-a07'] = {
    titulo: 'Ligando, desligando e cuidando do computador',
    subtitulo: 'O jeito certo de ligar, desligar, reiniciar e manter o computador limpo, seguro e funcionando bem por muitos anos.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Ligando o computador', blocos: [
        { p: 'Parece simples, mas fazer na ordem certa evita problemas:' },
        { passos: [
          'Confira se o computador está **ligado na tomada** (ou se o notebook tem bateria).',
          'Ligue primeiro o **monitor**, se for um computador de mesa.',
          'Aperte o **botão de ligar** [[power]] do gabinete ou do notebook, uma vez só, sem segurar.',
          'Espere o sistema carregar. Se pedir, digite a sua **senha** e aperte {{Enter}}.',
        ] },
        { fig: 'energia', legenda: 'O símbolo de ligar é um círculo com um tracinho em cima.' },
        { destaque: { tom: 'dica', titulo: 'Tenha paciência', texto: 'Logo depois de ligar, o computador ainda está abrindo programas por trás. Espere um pouquinho antes de sair clicando em tudo.' } },
      ] },
      { id: 'p2', titulo: 'Desligando do jeito certo', blocos: [
        { p: 'Nunca desligue o computador tirando da tomada ou segurando o botão, a não ser que ele esteja completamente travado. O jeito certo é pelo sistema:' },
        { passos: [
          '**Salve** os seus arquivos e feche os programas.',
          'Clique no botão **Iniciar** [[win]] (o símbolo do Windows, no canto da tela).',
          'Clique no ícone de **Energia** [[power]].',
          'Escolha **Desligar** e espere a tela apagar.',
        ] },
        { tabela: { cab: ['Opção', 'O que faz', 'Quando usar'], linhas: [
          ['Desligar', 'Fecha tudo e desliga', 'No fim do dia'],
          ['Reiniciar', 'Desliga e liga de novo', 'Quando algo está lento ou travando, ou depois de atualizar'],
          ['Suspender', 'Pausa com pouco consumo de energia', 'Pausas curtas: volta rápido de onde parou'],
        ] } },
        { destaque: { tom: 'atencao', titulo: 'Por que não puxar da tomada?', texto: 'Desligar de repente pode **perder o que não foi salvo** e até corromper arquivos do sistema, que estavam sendo gravados naquele momento.' } },
      ] },
      { id: 'p3', titulo: 'Quando o computador trava', blocos: [
        { p: 'Às vezes um programa para de responder. Antes de desligar tudo, tente nesta ordem:' },
        { passos: [
          'Espere alguns segundos: às vezes ele só está ocupado.',
          'Feche o programa travado no **X** da janela.',
          'Use {{Ctrl+Shift+Esc}} para abrir o **Gerenciador de Tarefas**, clique no programa travado e em **Finalizar tarefa**.',
          'Se nada funcionar, **reinicie** o computador pelo menu Iniciar.',
          'Só em último caso, segure o botão de ligar por alguns segundos.',
        ] },
      ] },
      { id: 'p4', titulo: 'Cuidados com o equipamento', blocos: [
        { p: 'Com alguns cuidados simples, o computador dura muito mais:' },
        { checklist: [
          '**Comida e bebida longe** do teclado: um copo derramado pode estragar tudo.',
          '**Ventilação:** não tape as saídas de ar. O computador precisa “respirar”.',
          '**Energia:** use um **filtro de linha** ou estabilizador para proteger contra picos de energia.',
          '**Tempestades:** em dia de raios, desligue e tire da tomada.',
          '**Limpeza:** desligado, passe um pano seco e macio na tela e no teclado. Nada de produtos fortes ou água direto.',
          '**Sol e umidade:** deixe o computador longe da janela e de lugares úmidos.',
        ] },
      ] },
      { id: 'p5', titulo: 'Cuidados com você', blocos: [
        { p: 'Cuidar do computador inclui cuidar de quem usa! Uma boa postura evita dores nas costas, no pescoço e nos punhos.' },
        { cards: [
          { ico: 'usuario', t: 'Costas apoiadas', d: 'Sente-se com as costas no encosto e os pés no chão.' },
          { ico: 'monitor', t: 'Tela na altura dos olhos', d: 'A um braço de distância.' },
          { ico: 'mao', t: 'Punhos retos', d: 'Mãos leves sobre o teclado e o mouse.' },
          { ico: 'relogio', t: 'Pausas', d: 'A cada 50 minutos, levante e se alongue.' },
        ] },
        { destaque: { tom: 'dica', titulo: 'Regra 20-20-20', texto: 'A cada 20 minutos, olhe por 20 segundos para algo a uns 6 metros de distância. Seus olhos agradecem.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Num computador de mesa, o que se liga primeiro?', ['O mouse', 'O monitor', 'A impressora', 'O pendrive'], 1, 'Ligue o monitor e depois aperte o botão do gabinete.'),
      Q('p1', 'Como se aperta o botão de ligar?', ['Uma vez, sem segurar', 'Segurando por 30 segundos', 'Várias vezes seguidas', 'Com o computador fora da tomada'], 0, 'Basta um toque. Segurar o botão é só para forçar o desligamento.'),
      Q('p2', 'Qual o jeito certo de desligar o computador?', ['Tirar da tomada', 'Pelo menu Iniciar > Energia > Desligar', 'Fechar a tampa com força', 'Apertar várias teclas'], 1, 'Pelo menu Iniciar o sistema fecha tudo com segurança antes de desligar.'),
      Q('p2', 'Qual opção desliga e liga de novo o computador?', ['Suspender', 'Desligar', 'Reiniciar', 'Bloquear'], 2, 'Reiniciar desliga e liga de novo. É útil quando algo está lento ou travado.'),
      Q('p3', 'Quais teclas abrem o Gerenciador de Tarefas?', ['Ctrl + C', 'Ctrl + Shift + Esc', 'Alt + F4', 'Shift + Enter'], 1, 'Ctrl + Shift + Esc abre o Gerenciador de Tarefas, onde dá para finalizar um programa travado.'),
      Q('p3', 'Quando segurar o botão de ligar para desligar?', ['Sempre', 'Só em último caso, se nada mais funcionar', 'Todo fim de dia', 'Antes de salvar'], 1, 'Forçar o desligamento pode perder dados. É o último recurso.'),
      Q('p4', 'Para que serve um filtro de linha ou estabilizador?', ['Deixar a internet mais rápida', 'Proteger contra picos de energia', 'Limpar a tela', 'Aumentar a memória'], 1, 'Eles protegem o computador de variações e picos na energia elétrica.'),
      Q('p4', 'Como limpar a tela do computador?', ['Com água direto na tela', 'Com um pano seco e macio, com o computador desligado', 'Com álcool e esponja de aço', 'Com ele ligado e produto forte'], 1, 'Use pano seco e macio, sempre com o computador desligado.'),
      Q('p5', 'Onde deve ficar a tela do monitor?', ['Bem abaixo da mesa', 'Na altura dos olhos, a um braço de distância', 'Colada no rosto', 'Atrás de você'], 1, 'Na altura dos olhos e a um braço de distância, o pescoço fica reto.'),
      Q('p5', 'De quanto em quanto tempo é bom fazer uma pausa para se alongar?', ['A cada 50 minutos, mais ou menos', 'Só no fim do dia', 'Nunca', 'A cada 5 horas'], 0, 'Pausas a cada 50 minutos evitam cansaço e dores.'),
    ],
  };

  C['d1-a08'] = {
    titulo: 'Usando o mouse',
    subtitulo: 'Apontar, clicar, clicar duas vezes, usar o botão direito, arrastar e rolar: os movimentos que você vai usar todos os dias.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Conhecendo o mouse', blocos: [
        { p: 'O **mouse** [[mouse]] (rato, em inglês, por causa do formato e do fio que parecia um rabinho) controla a **setinha** na tela, chamada de **ponteiro** ou **cursor** [[cursor]]. Quando você move o mouse na mesa, a setinha se move na tela.' },
        { fig: 'mouse', legenda: 'Botão esquerdo, botão direito e a rodinha no meio.' },
        { destaque: { tom: 'dica', titulo: 'Como segurar', texto: 'Apoie a palma da mão sobre o mouse, com o **indicador** no botão esquerdo e o **dedo médio** no botão direito. Mova com o braço relaxado, sem apertar.' } },
      ] },
      { id: 'p2', titulo: 'Clique e clique duplo', blocos: [
        { p: 'O **clique** é apertar e soltar o **botão esquerdo** uma vez, rapidinho. Ele serve para **selecionar** coisas, apertar botões e abrir links na internet.' },
        { p: 'O **clique duplo** são **dois cliques rápidos** no botão esquerdo, sem mexer o mouse. Na área de trabalho e nas pastas, ele **abre** arquivos, pastas e programas.' },
        { tabela: { cab: ['Movimento', 'Como fazer', 'Para que serve'], linhas: [
          ['Clique', '1 toque no botão esquerdo', 'Selecionar, apertar botões, abrir links'],
          ['Clique duplo', '2 toques rápidos no esquerdo', 'Abrir pastas, arquivos e programas'],
          ['Clique com o botão direito', '1 toque no botão direito', 'Abrir o menu de opções'],
        ] } },
        { destaque: { tom: 'atencao', titulo: 'O mouse não pode andar', texto: 'No clique duplo, se o mouse se mexer entre os dois cliques, o computador entende como dois cliques separados. Segure o mouse firme.' } },
      ] },
      { id: 'p3', titulo: 'O botão direito', blocos: [
        { p: 'O clique com o **botão direito** abre o **menu de contexto**: uma lista com as ações que dá para fazer naquele lugar. É como perguntar ao computador “o que posso fazer aqui?”.' },
        { exemplo: { titulo: 'Botão direito sobre um arquivo', linhas: ['Abrir', 'Copiar', 'Recortar', 'Renomear', 'Excluir', 'Propriedades'] } },
        { p: 'O menu muda conforme o lugar: sobre a área de trabalho aparecem opções como **Personalizar** e **Novo**; sobre um texto, **Copiar** e **Colar**.' },
      ] },
      { id: 'p4', titulo: 'Arrastar e soltar', blocos: [
        { p: '**Arrastar** é mover algo de um lugar para outro com o mouse:' },
        { passos: [
          'Coloque a setinha em cima do item (um ícone, por exemplo).',
          '**Aperte e segure** o botão esquerdo.',
          'Com o botão ainda apertado, **mova o mouse** até o lugar desejado.',
          '**Solte** o botão.',
        ] },
        { fig: 'pastas', legenda: 'Arrastar e soltar um arquivo dentro de uma pasta.' },
        { p: 'Arrastando você move arquivos para pastas, leva para a Lixeira [[lixeira]], muda as janelas de lugar e **seleciona textos** (passando por cima das palavras com o botão apertado).' },
      ] },
      { id: 'p5', titulo: 'A rodinha e o formato da setinha', blocos: [
        { p: 'A **rodinha** (scroll) no meio do mouse serve para **rolar** a página para cima e para baixo, sem precisar usar as barras de rolagem. Segurando {{Ctrl}} e girando a rodinha, você aumenta ou diminui o **zoom**.' },
        { p: 'Repare que a setinha muda de formato conforme o que ela está apontando:' },
        { tabela: { cab: ['Formato', 'O que significa'], linhas: [
          ['Seta', 'Normal: pronto para clicar'],
          ['Mãozinha', 'Está sobre um link ou botão clicável'],
          ['Barra vertical ( I )', 'Está sobre um texto: clique para escrever ali'],
          ['Círculo girando', 'O computador está ocupado: espere'],
          ['Setas duplas', 'Dá para redimensionar a janela arrastando'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'No notebook', texto: 'No **touchpad**: um toque é um clique, dois toques é clique duplo, toque com **dois dedos** é o botão direito e deslizar **dois dedos** rola a página.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Como se chama a setinha que o mouse controla na tela?', ['Ícone', 'Ponteiro ou cursor', 'Janela', 'Atalho'], 1, 'A setinha é o ponteiro (ou cursor) do mouse.'),
      Q('p1', 'Qual dedo fica no botão esquerdo?', ['O polegar', 'O indicador', 'O mindinho', 'O anelar'], 1, 'O indicador fica no botão esquerdo e o médio no direito.'),
      Q('p2', 'Para abrir uma pasta na área de trabalho, normalmente usamos:', ['Clique duplo', 'Botão direito', 'A rodinha', 'Arrastar'], 0, 'Na área de trabalho e nas pastas, o clique duplo abre arquivos e programas.'),
      Q('p2', 'O que acontece se o mouse se mexer entre os dois cliques do clique duplo?', ['Abre mais rápido', 'O computador entende como dois cliques separados', 'O mouse quebra', 'A tela desliga'], 1, 'O mouse precisa ficar parado para os dois cliques contarem como clique duplo.'),
      Q('p3', 'O que abre o clique com o botão direito?', ['O menu de contexto, com opções', 'A internet', 'O Word', 'A Lixeira sempre'], 0, 'O botão direito abre um menu com as ações possíveis naquele lugar.'),
      Q('p3', 'O menu do botão direito:', ['É sempre igual', 'Muda conforme o lugar em que você clica', 'Só aparece na internet', 'Apaga o arquivo'], 1, 'As opções dependem de onde você clicou: arquivo, texto, área de trabalho.'),
      Q('p4', 'Como arrastar um ícone?', ['Clicar duas vezes', 'Apertar e segurar o botão esquerdo, mover e soltar', 'Girar a rodinha', 'Apertar o botão direito e soltar'], 1, 'Aperte, segure, mova até o lugar e solte.'),
      Q('p4', 'Qual destas ações usa o arrastar?', ['Selecionar um texto passando por cima das palavras', 'Ligar o computador', 'Aumentar o volume', 'Digitar uma senha'], 0, 'Com o botão apertado, passar por cima do texto seleciona as palavras.'),
      Q('p5', 'Para que serve a rodinha do mouse?', ['Desligar o computador', 'Rolar a página para cima e para baixo', 'Apagar arquivos', 'Imprimir'], 1, 'A rodinha rola a página; com Ctrl, muda o zoom.'),
      Q('p5', 'Quando a setinha vira uma mãozinha, significa que:', ['O computador travou', 'Ela está sobre um link ou botão clicável', 'É hora de desligar', 'O mouse está sem pilha'], 1, 'A mãozinha indica que ali dá para clicar, como num link.'),
    ],
  };

  C['d1-a09'] = {
    titulo: 'Conhecendo o teclado',
    subtitulo: 'Letras, números, Enter, Backspace, Shift, acentos e as teclas especiais do teclado brasileiro ABNT2.',
    leitura: 12,
    partes: [
      { id: 'p1', titulo: 'As partes do teclado', blocos: [
        { p: 'O teclado [[teclado]] tem por volta de 105 teclas, organizadas em grupos. Conhecer os grupos ajuda a se localizar sem precisar procurar:' },
        { tabela: { cab: ['Grupo', 'Onde fica', 'Para que serve'], linhas: [
          ['Alfanumérico', 'No centro', 'Letras, números, acentos e pontuação'],
          ['Teclas de função', 'Fileira de cima (F1 a F12)', 'Atalhos dos programas'],
          ['Navegação', 'À direita das letras', 'Setas, Home, End, Page Up, Page Down'],
          ['Teclado numérico', 'Bloco da direita', 'Números como numa calculadora'],
          ['Modificadoras', 'Cantos de baixo', 'Shift, Ctrl, Alt e a tecla do Windows'],
        ] } },
        { teclado: 'dedos' },
        { p: 'No Brasil o padrão é o **ABNT2**: ele tem a tecla **Ç** ao lado do **L** e teclas próprias para os acentos.' },
      ] },
      { id: 'p2', titulo: 'As teclas que você mais vai usar', blocos: [
        { atalhos: [
          ['Enter', 'Pula para a linha de baixo ou **confirma** uma ação.'],
          ['Backspace', 'Apaga a letra que está **à esquerda** do cursor.'],
          ['Delete', 'Apaga a letra que está **à direita** do cursor, ou o arquivo selecionado.'],
          ['Barra de espaço', 'Coloca um espaço entre as palavras.'],
          ['Tab', 'Faz um recuo no texto ou pula para o próximo campo de um formulário.'],
          ['Esc', 'Cancela ou fecha uma janela de aviso.'],
        ] },
        { destaque: { tom: 'dica', titulo: 'O cursor do texto', texto: 'Quando você escreve, aparece uma barrinha piscando: é o **cursor de texto**. As letras aparecem onde ele está. Use as **setas** do teclado para movê-lo.' } },
      ] },
      { id: 'p3', titulo: 'Letras maiúsculas e símbolos', blocos: [
        { p: 'Existem dois jeitos de escrever letras maiúsculas:' },
        { compara: {
          a: { t: 'Shift', ico: 'seta', itens: ['**Segure** o Shift e aperte a letra', 'Só aquela letra fica maiúscula', 'Ideal para o começo das frases e nomes'] },
          b: { t: 'Caps Lock', ico: 'cadeado', itens: ['**Aperte uma vez** para ligar', 'Todas as letras ficam maiúsculas', 'Aperte de novo para desligar (a luzinha apaga)'] },
        } },
        { p: 'O **Shift** também serve para os **símbolos** que ficam na parte de cima das teclas. Por exemplo, {{Shift+1}} faz o **!** e {{Shift+2}} faz o **@**.' },
        { p: 'Alguns símbolos ficam no canto de baixo à direita da tecla e precisam do **AltGr**. Por exemplo: {{AltGr+Q}} faz a **/** em alguns teclados e {{AltGr+E}} faz o **€**.' },
        { destaque: { tom: 'atencao', titulo: 'Senha com Caps Lock', texto: 'Senhas diferenciam maiúsculas de minúsculas. Se a senha “não entra”, confira se a luz do **Caps Lock** está acesa.' } },
      ] },
      { id: 'p4', titulo: 'Acentos e cedilha', blocos: [
        { p: 'No teclado ABNT2, as teclas de acento são **teclas mortas**: ao apertar, nada aparece. O acento só surge quando você aperta a vogal **depois**.' },
        { tabela: { cab: ['Para escrever', 'Aperte', 'Exemplo'], linhas: [
          ['á é í ó ú', '´ e depois a vogal', 'café, avó'],
          ['ã õ', '~ e depois a vogal', 'mão, limões'],
          ['â ê ô', 'Shift + ~ e depois a vogal', 'você, avô'],
          ['à', 'Shift + ´ e depois a', 'vou à escola'],
          ['ç', 'a tecla Ç', 'açúcar, coração'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Treine agora', texto: 'Abra o Bloco de Notas e escreva: **“Não há coração sem emoção, você sabe?”**. Repare em cada acento.' } },
      ] },
      { id: 'p5', titulo: 'Teclas especiais e combinações', blocos: [
        { p: 'Algumas teclas sozinhas não escrevem nada, mas combinadas com outras fazem ações rápidas, os **atalhos**:' },
        { atalhos: [
          ['Ctrl+C', 'Copiar'],
          ['Ctrl+V', 'Colar'],
          ['Ctrl+Z', 'Desfazer a última ação'],
          ['Alt+Tab', 'Trocar de janela'],
          ['Win', 'Abrir o menu Iniciar'],
          ['Print Screen', 'Copiar uma imagem da tela'],
        ] },
        { p: 'O **teclado numérico** (à direita) funciona quando a luz do **Num Lock** está acesa. É ótimo para digitar muitos números, como valores e telefones.' },
        { destaque: { tom: 'saiba', titulo: 'Para ir além', texto: 'Na **Plataforma de Informática** você tem os módulos de digitação, com lições para treinar o teclado com os dez dedos. E na disciplina de Atalhos você vai conhecer muitas outras combinações.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual o padrão de teclado usado no Brasil, que tem a tecla Ç?', ['QWERTY americano', 'ABNT2', 'AZERTY', 'Numérico'], 1, 'O ABNT2 foi feito para o português: tem o Ç e as teclas de acento.'),
      Q('p1', 'Como se chamam as teclas F1 a F12?', ['Teclas de função', 'Teclas de navegação', 'Teclas mortas', 'Teclado numérico'], 0, 'F1 a F12 são as teclas de função, usadas como atalhos.'),
      Q('p2', 'Qual tecla apaga a letra à esquerda do cursor?', ['Delete', 'Backspace', 'Enter', 'Tab'], 1, 'O Backspace apaga para trás (à esquerda); o Delete, para a frente (à direita).'),
      Q('p2', 'Para pular para a linha de baixo num texto, aperte:', ['Esc', 'Shift', 'Enter', 'Alt'], 2, 'O Enter quebra a linha e também confirma ações.'),
      Q('p3', 'Para fazer só uma letra maiúscula, o mais prático é:', ['Ligar o Caps Lock', 'Segurar o Shift e apertar a letra', 'Apertar Enter', 'Usar o Ctrl'], 1, 'Segurando o Shift, só aquela letra fica maiúscula.'),
      Q('p3', 'Se a senha não entra, o que vale conferir?', ['Se o Caps Lock está ligado', 'Se o monitor está limpo', 'Se o mouse tem pilha', 'Se a impressora está ligada'], 0, 'Com o Caps Lock ligado, as letras saem maiúsculas e a senha fica errada.'),
      Q('p4', 'Como escrever “ã” no teclado ABNT2?', ['a e depois ~', '~ e depois a', 'Ctrl + a', 'Shift + a'], 1, 'Primeiro a tecla do acento (~), depois a vogal.'),
      Q('p4', 'Por que as teclas de acento são chamadas de teclas mortas?', ['Porque estão quebradas', 'Porque nada aparece até você apertar a vogal', 'Porque apagam o texto', 'Porque ficam escondidas'], 1, 'Ao apertar o acento nada aparece: ele espera a vogal.'),
      Q('p5', 'Qual atalho desfaz a última ação?', ['Ctrl + Z', 'Ctrl + C', 'Ctrl + V', 'Alt + Tab'], 0, 'Ctrl + Z desfaz. É um dos atalhos mais úteis!'),
      Q('p5', 'Para o teclado numérico funcionar, qual luz deve estar acesa?', ['Caps Lock', 'Num Lock', 'Scroll Lock', 'Nenhuma'], 1, 'O teclado numérico funciona com o Num Lock ligado.'),
    ],
  };

  C['d1-av'] = {
    titulo: 'Avaliação: Introdução à Informática',
    subtitulo: '30 perguntas sobre as Aulas 01 a 09. Não há material para consultar: responda com o que você aprendeu.',
    avaliacao: { aulas: ['d1-a01', 'd1-a02', 'd1-a03', 'd1-a04', 'd1-a05', 'd1-a06', 'd1-a07', 'd1-a08', 'd1-a09'] },
  };
})();
