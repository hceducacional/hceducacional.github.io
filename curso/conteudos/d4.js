/* =========================================================
   DISCIPLINA 4 — PLANILHAS ELETRÔNICAS: EXCEL (curso "Informática do zero")
   Aulas 01 a 09 + Aula 10 (avaliação). Formato dos blocos: veja curso/conteudos/d1.js.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
(() => {
  const C = window.HC_CONTEUDOS;
  const Q = (parte, q, op, certa, exp) => ({ parte, q, op, certa, exp });

  C['d4-a01'] = {
    titulo: 'O que é uma planilha?',
    subtitulo: 'Para que servem as planilhas eletrônicas, onde elas aparecem no dia a dia e quais são os programas mais usados.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'Do caderno de contas ao computador', blocos: [
        { p: 'Muita gente anota as contas da casa num caderno, em colunas: o que foi comprado, quanto custou, a data. No fim do mês, soma tudo na calculadora. Uma **planilha eletrônica** [[tabela]] faz isso no computador, só que **as contas são automáticas**.' },
        { p: 'Se você muda um valor, o total **se atualiza sozinho**. Nada de apagar e somar tudo de novo.' },
        { fig: 'excel', legenda: 'Uma planilha: linhas, colunas e uma soma automática.' },
      ] },
      { id: 'p2', titulo: 'Para que serve', blocos: [
        { cards: [
          { ico: 'dinheiro', t: 'Orçamento da casa', d: 'Entradas, gastos e quanto sobra no mês.' },
          { ico: 'sacola', t: 'Controle de estoque', d: 'Produtos que entraram e saíram de uma loja.' },
          { ico: 'livro', t: 'Notas da escola', d: 'Médias dos alunos calculadas na hora.' },
          { ico: 'calendario', t: 'Escalas e agendas', d: 'Horários de trabalho e de plantão.' },
          { ico: 'grupo', t: 'Listas de contatos', d: 'Nomes, telefones e e-mails organizados.' },
          { ico: 'grafico', t: 'Gráficos', d: 'Transformar números em desenhos fáceis de entender.' },
        ] },
        { destaque: { tom: 'saiba', titulo: 'Muito pedido no trabalho', texto: 'Saber o básico de planilhas é uma das habilidades mais pedidas em vagas de escritório, comércio e administração.' } },
      ] },
      { id: 'p3', titulo: 'Os programas mais usados', blocos: [
        { tabela: { cab: ['Programa', 'Como é', 'Preço'], linhas: [
          ['Microsoft Excel', 'O mais usado em empresas', 'Pago, com versão on-line gratuita'],
          ['Google Planilhas', 'Funciona no navegador e salva na nuvem', 'Gratuito com conta Google'],
          ['LibreOffice Calc', 'Programa instalado, parecido com o Excel', 'Gratuito'],
        ] } },
        { p: 'As fórmulas e os botões são muito parecidos nos três. O que você aprender aqui vale para todos.' },
      ] },
      { id: 'p4', titulo: 'Linhas, colunas e células', blocos: [
        { p: 'Uma planilha é uma grande **grade**:' },
        { lista: [
          '**Colunas** são verticais (em pé) e têm **letras**: A, B, C...',
          '**Linhas** são horizontais (deitadas) e têm **números**: 1, 2, 3...',
          'Cada quadradinho é uma **célula**. O nome da célula junta a letra da coluna e o número da linha: **B3** é a célula da coluna B com a linha 3.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Como no jogo de batalha naval', texto: 'Para achar a célula **C5**, vá até a coluna **C** e desça até a linha **5**. É igual a achar um navio no jogo de batalha naval.' } },
      ] },
      { id: 'p5', titulo: 'Abrindo o Excel', blocos: [
        { passos: [
          'Abra o menu Iniciar e digite **excel**.',
          'Clique em **Excel** e depois em **Pasta de trabalho em branco**.',
          'Clique em uma célula e digite. Aperte {{Enter}} para confirmar e descer.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Sem o Excel?', texto: 'Use o Excel on-line em **office.com** ou o **Google Planilhas** em **sheets.google.com**. Os dois são gratuitos.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual a grande vantagem da planilha eletrônica sobre o caderno de contas?', ['As contas são automáticas e se atualizam sozinhas', 'Ela é de papel', 'Não precisa de computador', 'Só aceita texto'], 0, 'Mudando um valor, o total se atualiza sozinho.'),
      Q('p1', 'O que acontece com o total quando você muda um valor na planilha?', ['Atualiza sozinho', 'Fica errado para sempre', 'A planilha apaga', 'Precisa somar na calculadora'], 0, 'As fórmulas recalculam automaticamente.'),
      Q('p2', 'Qual destes é um uso comum de planilha?', ['Orçamento da casa', 'Editar fotos', 'Gravar vídeos', 'Fazer ligações'], 0, 'Controlar gastos é um dos usos mais comuns.'),
      Q('p2', 'Por que é bom saber usar planilhas?', ['É uma habilidade muito pedida no trabalho', 'Porque deixa o computador mais rápido', 'Para jogar', 'Não é útil'], 0, 'Planilhas são muito pedidas em vagas de emprego.'),
      Q('p3', 'Qual programa de planilhas funciona no navegador e é gratuito com conta Google?', ['Google Planilhas', 'Paint', 'Bloco de Notas', 'Word'], 0, 'O Google Planilhas funciona no navegador.'),
      Q('p3', 'Qual programa de planilhas é gratuito e instalado no computador?', ['LibreOffice Calc', 'PowerPoint', 'Fotos', 'Edge'], 0, 'O LibreOffice Calc é gratuito.'),
      Q('p4', 'Como são identificadas as colunas?', ['Por letras', 'Por números', 'Por cores', 'Por nomes de pessoas'], 0, 'Colunas têm letras (A, B, C); linhas têm números.'),
      Q('p4', 'O que é a célula B3?', ['A célula da coluna B com a linha 3', 'A terceira planilha', 'A coluna 3 com a linha B', 'Um tipo de gráfico'], 0, 'O nome junta a letra da coluna e o número da linha.'),
      Q('p5', 'Para começar uma planilha nova no Excel, clique em:', ['Pasta de trabalho em branco', 'Documento em branco', 'Imprimir', 'Fechar'], 0, 'No Excel, o arquivo novo se chama Pasta de trabalho em branco.'),
      Q('p5', 'Depois de digitar numa célula, como confirmar?', ['Apertando Enter', 'Apertando Esc', 'Desligando', 'Apertando F1'], 0, 'O Enter confirma e desce para a célula de baixo.'),
    ],
  };

  C['d4-a02'] = {
    titulo: 'Primeiros passos no Excel',
    subtitulo: 'Pasta de trabalho, planilhas, a caixa de nome, a barra de fórmulas e como se mover pela grade.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Pasta de trabalho e planilhas', blocos: [
        { p: 'No Excel, o **arquivo** se chama **pasta de trabalho** (extensão **.xlsx**). Dentro dela podem existir várias **planilhas**, as abas que ficam embaixo da tela: **Planilha1**, **Planilha2**...' },
        { p: 'É como um **fichário** com várias folhas: você pode ter uma aba para cada mês, por exemplo.' },
        { lista: [
          '**Criar** uma aba nova: clique no **+** ao lado das abas.',
          '**Renomear:** clique duplo no nome da aba, digite e aperte {{Enter}}.',
          '**Mudar a cor ou excluir:** botão direito na aba.',
        ] },
      ] },
      { id: 'p2', titulo: 'As partes da tela', blocos: [
        { fig: 'excel', legenda: 'Caixa de nome, barra de fórmulas, cabeçalhos das colunas e das linhas.' },
        { tabela: { cab: ['Parte', 'Para que serve'], linhas: [
          ['Faixa de Opções', 'Os botões, organizados em guias, como no Word'],
          ['Caixa de nome', 'Mostra o nome da célula selecionada (ex.: B5)'],
          ['Barra de fórmulas', 'Mostra o conteúdo ou a fórmula da célula selecionada'],
          ['Cabeçalhos', 'As letras das colunas e os números das linhas'],
          ['Abas das planilhas', 'Embaixo, para trocar de planilha'],
        ] } },
      ] },
      { id: 'p3', titulo: 'Selecionando células', blocos: [
        { p: 'A célula selecionada (a **célula ativa**) fica com uma **borda verde**. O que você digitar vai para ela.' },
        { tabela: { cab: ['Para selecionar', 'Faça'], linhas: [
          ['Uma célula', 'Clique nela'],
          ['Um intervalo (bloco)', 'Clique na primeira e arraste até a última'],
          ['Uma coluna inteira', 'Clique na letra da coluna'],
          ['Uma linha inteira', 'Clique no número da linha'],
          ['A planilha toda', '{{Ctrl+T}} (Excel em português) ou o triângulo no canto'],
        ] } },
        { p: 'Um **intervalo** é escrito com dois-pontos: **A1:A5** quer dizer “de A1 até A5”.' },
      ] },
      { id: 'p4', titulo: 'Movendo-se pela planilha', blocos: [
        { atalhos: [
          ['Enter', 'Desce uma célula'],
          ['Tab', 'Vai para a célula da direita'],
          ['Setas', 'Andam em qualquer direção'],
          ['Ctrl+Home', 'Volta para a célula A1'],
          ['Ctrl+↓', 'Pula para o fim dos dados da coluna'],
        ] },
        { destaque: { tom: 'dica', titulo: 'Digitando uma tabela', texto: 'Para preencher uma linha, use {{Tab}} entre as células e {{Enter}} no fim: o Excel volta para o começo da próxima linha.' } },
      ] },
      { id: 'p5', titulo: 'Editando e apagando', blocos: [
        { lista: [
          'Para **substituir** o conteúdo, clique na célula e digite por cima.',
          'Para **corrigir** só um pedaço, dê **clique duplo** na célula (ou aperte {{F2}}) e edite.',
          'Para **apagar**, selecione e aperte {{Delete}}.',
          'Para **cancelar** o que está digitando, aperte {{Esc}}.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Linhas e colunas novas', texto: 'Botão direito no número da linha (ou na letra da coluna) > **Inserir** cria uma linha ou coluna nova. **Excluir** remove.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Como se chama o arquivo do Excel?', ['Pasta de trabalho', 'Documento', 'Apresentação', 'Atalho'], 0, 'O arquivo do Excel é a pasta de trabalho (.xlsx).'),
      Q('p1', 'Como renomear uma aba de planilha?', ['Clique duplo no nome da aba', 'Apertando Delete', 'Pela Lixeira', 'Pelo zoom'], 0, 'Um clique duplo no nome da aba permite renomear.'),
      Q('p2', 'O que mostra a caixa de nome?', ['O nome da célula selecionada', 'O nome do usuário', 'A hora', 'O nome da impressora'], 0, 'A caixa de nome mostra a célula selecionada, como B5.'),
      Q('p2', 'Onde aparece a fórmula da célula selecionada?', ['Na barra de fórmulas', 'Na aba da planilha', 'No título da janela', 'Na barra de tarefas'], 0, 'A barra de fórmulas mostra o conteúdo real da célula.'),
      Q('p3', 'Como selecionar uma coluna inteira?', ['Clicando na letra da coluna', 'Clicando no número da linha', 'Apertando Enter', 'Com clique duplo numa célula'], 0, 'Clique na letra no topo da coluna.'),
      Q('p3', 'O que significa A1:A5?', ['De A1 até A5', 'A1 dividido por A5', 'A1 vezes A5', 'Só A1 e A5'], 0, 'Os dois-pontos indicam um intervalo: de A1 até A5.'),
      Q('p4', 'Qual tecla leva para a célula da direita?', ['Tab', 'Enter', 'Esc', 'Delete'], 0, 'O Tab vai para a direita; o Enter desce.'),
      Q('p4', 'Qual atalho volta para a célula A1?', ['Ctrl + Home', 'Ctrl + End', 'Alt + A', 'Shift + 1'], 0, 'Ctrl + Home volta para A1.'),
      Q('p5', 'Como corrigir só um pedaço do que está numa célula?', ['Clique duplo na célula ou F2', 'Delete', 'Esc', 'Ctrl + P'], 0, 'O clique duplo ou o F2 entram no modo de edição.'),
      Q('p5', 'Como inserir uma linha nova?', ['Botão direito no número da linha > Inserir', 'Apertando Esc', 'Fechando o Excel', 'Clicando na aba'], 0, 'Com o botão direito no número da linha, escolha Inserir.'),
    ],
  };

  C['d4-a03'] = {
    titulo: 'Digitando e formatando dados',
    subtitulo: 'Texto, números, datas e dinheiro: como digitar cada tipo, ajustar as colunas e deixar a planilha bonita.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Tipos de dados', blocos: [
        { p: 'O Excel reconhece o que você digita:' },
        { tabela: { cab: ['Tipo', 'Exemplo', 'Como aparece'], linhas: [
          ['Texto', 'Arroz', 'Alinhado à esquerda'],
          ['Número', '25,90', 'Alinhado à direita'],
          ['Data', '15/03/2026', 'Alinhada à direita'],
          ['Fórmula', '=B2+B3', 'Mostra o resultado'],
        ] } },
        { destaque: { tom: 'atencao', titulo: 'Vírgula, não ponto', texto: 'No Excel em português, os decimais usam **vírgula**: escreva **25,90**, não 25.90. E não digite “R$” nem pontos de milhar: deixe isso para a formatação.' } },
      ] },
      { id: 'p2', titulo: 'Ajustando colunas e linhas', blocos: [
        { p: 'Se aparecer **#####** na célula, não é erro: a coluna está **estreita demais** para mostrar o número.' },
        { lista: [
          '**Arraste** a divisória entre as letras das colunas para alargar.',
          '**Clique duplo** na divisória: a coluna se ajusta sozinha ao maior conteúdo.',
          'Para a altura das linhas, faça o mesmo na divisória entre os números.',
        ] },
      ] },
      { id: 'p3', titulo: 'Formatos de número', blocos: [
        { p: 'Na guia **Página Inicial**, grupo **Número**, você escolhe como os números aparecem, **sem mudar o valor**:' },
        { tabela: { cab: ['Formato', 'Valor digitado', 'Como aparece'], linhas: [
          ['Geral', '1250,5', '1250,5'],
          ['Moeda', '1250,5', 'R$ 1.250,50'],
          ['Porcentagem', '0,15', '15%'],
          ['Data abreviada', '15/03/2026', '15/03/2026'],
          ['Número com 2 casas', '3', '3,00'],
        ] } },
        { p: 'Os botões **Aumentar** e **Diminuir casas decimais** ajustam quantos números aparecem depois da vírgula.' },
      ] },
      { id: 'p4', titulo: 'Deixando a planilha bonita', blocos: [
        { p: 'A mesma Página Inicial tem os botões que você já conhece do Word: **fonte**, **tamanho**, **negrito**, **cor da letra** e **cor de preenchimento** (o baldinho de tinta) [[pincel]].' },
        { lista: [
          '**Bordas:** o botão de bordas desenha linhas em volta das células. Escolha **Todas as Bordas** para fazer uma tabela.',
          '**Mesclar e Centralizar:** junta várias células numa só, ótimo para o título da planilha.',
          '**Quebrar Texto Automaticamente:** faz o texto longo ocupar várias linhas dentro da mesma célula.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Cabeçalho destacado', texto: 'Deixe a primeira linha (os títulos das colunas) em **negrito** e com uma **cor de fundo**. Fica muito mais fácil de ler.' } },
      ] },
      { id: 'p5', titulo: 'Exemplo: lista de compras', blocos: [
        { p: 'Monte esta planilha para praticar:' },
        { tabela: { cab: ['', 'A', 'B', 'C'], linhas: [
          ['1', '**Produto**', '**Quantidade**', '**Preço**'],
          ['2', 'Arroz 5 kg', '1', 'R$ 25,90'],
          ['3', 'Feijão 1 kg', '2', 'R$ 9,50'],
          ['4', 'Café 500 g', '1', 'R$ 18,00'],
        ] } },
        { passos: [
          'Digite os títulos na linha 1 e deixe em negrito.',
          'Digite os produtos, as quantidades e os preços (só o número: **25,9**).',
          'Selecione os preços e aplique o formato **Moeda**.',
          'Selecione tudo e aplique **Todas as Bordas**.',
          'Ajuste a largura das colunas com clique duplo nas divisórias.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'Como o Excel alinha um número digitado?', ['À direita', 'À esquerda', 'No centro', 'Em diagonal'], 0, 'Números ficam à direita; textos, à esquerda.'),
      Q('p1', 'Como digitar vinte e cinco reais e noventa centavos no Excel em português?', ['25,90', '25.90', 'R$25.90', 'vinte e cinco'], 0, 'Use vírgula para os decimais e deixe o R$ para a formatação.'),
      Q('p2', 'O que significa ##### numa célula?', ['A coluna está estreita demais para mostrar o número', 'Um vírus', 'Um erro na fórmula', 'Que a célula está vazia'], 0, 'É só alargar a coluna.'),
      Q('p2', 'Como ajustar a coluna automaticamente ao conteúdo?', ['Clique duplo na divisória entre as letras', 'Apertando Delete', 'Pelo zoom', 'Mudando a fonte'], 0, 'O clique duplo na divisória ajusta a largura.'),
      Q('p3', 'Qual formato mostra 1250,5 como R$ 1.250,50?', ['Moeda', 'Porcentagem', 'Data', 'Texto'], 0, 'O formato Moeda coloca o R$ e as casas decimais.'),
      Q('p3', 'O valor 0,15 no formato Porcentagem aparece como:', ['15%', '0,15%', '1,5%', '150%'], 0, '0,15 equivale a 15%.'),
      Q('p4', 'Para desenhar linhas em volta das células, use:', ['Bordas', 'Negrito', 'Zoom', 'Ordenar'], 0, 'O botão Bordas desenha as linhas da tabela.'),
      Q('p4', 'Para que serve “Mesclar e Centralizar”?', ['Juntar várias células numa só, bom para títulos', 'Apagar a planilha', 'Somar valores', 'Imprimir'], 0, 'Junta células e centraliza o conteúdo.'),
      Q('p5', 'No exemplo da lista de compras, o que fica na linha 1?', ['Os títulos das colunas', 'O total', 'Nada', 'A data'], 0, 'A linha 1 traz os títulos: Produto, Quantidade e Preço.'),
      Q('p5', 'Por que digitar só o número no preço, sem o R$?', ['Para o Excel entender como número e poder calcular', 'Porque o R$ é proibido', 'Para economizar tinta', 'Não há motivo'], 0, 'Digitando só o número, o Excel consegue fazer contas; o R$ vem da formatação.'),
    ],
  };

  C['d4-a04'] = {
    titulo: 'Fórmulas básicas',
    subtitulo: 'Somar, subtrair, multiplicar e dividir: toda fórmula começa com o sinal de igual.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Tudo começa com =', blocos: [
        { p: 'Uma **fórmula** é uma conta que o Excel faz para você. Toda fórmula começa com o sinal de **igual (=)**. Sem ele, o Excel acha que é só um texto.' },
        { exemplo: { titulo: 'Digite na célula', linhas: ['=10+5', '→ a célula mostra 15'] } },
        { p: 'A célula mostra o **resultado**; a **barra de fórmulas** mostra a **conta** que está por trás.' },
      ] },
      { id: 'p2', titulo: 'Os operadores', blocos: [
        { tabela: { cab: ['Conta', 'Sinal', 'Exemplo', 'Resultado'], linhas: [
          ['Somar', '+', '=8+2', '10'],
          ['Subtrair', '-', '=8-2', '6'],
          ['Multiplicar', '* (asterisco)', '=8*2', '16'],
          ['Dividir', '/ (barra)', '=8/2', '4'],
          ['Potência', '^', '=8^2', '64'],
        ] } },
        { destaque: { tom: 'atencao', titulo: 'Não é x nem ÷', texto: 'No computador, a multiplicação usa o **asterisco** (*) e a divisão usa a **barra** (/). O asterisco fica no {{Shift+8}} ou no teclado numérico.' } },
      ] },
      { id: 'p3', titulo: 'Usando as células na conta', blocos: [
        { p: 'O poder da planilha está em usar o **nome das células** no lugar dos números. Assim, se o valor mudar, o resultado muda junto.' },
        { exemplo: { titulo: 'Quantidade em B2, preço em C2. Em D2:', linhas: ['=B2*C2', '→ quantidade vezes preço'] } },
        { passos: [
          'Clique na célula do resultado (D2) e digite **=**.',
          'Clique na célula **B2** (o Excel escreve o nome sozinho).',
          'Digite *****.',
          'Clique na célula **C2** e aperte {{Enter}}.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Teste mudando', texto: 'Troque a quantidade em B2 e veja D2 mudar sozinho. Essa é a mágica da planilha [[raio]].' } },
      ] },
      { id: 'p4', titulo: 'A ordem das contas', blocos: [
        { p: 'O Excel segue a mesma regra da matemática da escola: primeiro **multiplicação e divisão**, depois **soma e subtração**. Para mudar a ordem, use **parênteses**.' },
        { tabela: { cab: ['Fórmula', 'Resultado', 'Por quê'], linhas: [
          ['=2+3*4', '14', 'Primeiro 3*4=12, depois 2+12'],
          ['=(2+3)*4', '20', 'Primeiro o parêntese: 5, depois 5*4'],
        ] } },
        { p: 'Exemplo prático: a média de duas notas é **=(B2+C2)/2**. Sem os parênteses, o Excel dividiria só a segunda nota.' },
      ] },
      { id: 'p5', titulo: 'Erros comuns', blocos: [
        { tabela: { cab: ['Erro', 'O que significa'], linhas: [
          ['#DIV/0!', 'Divisão por zero (ou por uma célula vazia)'],
          ['#NOME?', 'Nome de função escrito errado'],
          ['#VALOR!', 'Conta com texto no lugar de número'],
          ['#REF!', 'A fórmula usa uma célula que foi apagada'],
          ['#####', 'Não é erro: a coluna está estreita'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Confira na barra de fórmulas', texto: 'Quando um resultado parece estranho, clique na célula e leia a fórmula na barra de fórmulas. Quase sempre é uma célula errada ou um parêntese faltando.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Com qual sinal toda fórmula começa?', ['=', '+', '#', '@'], 0, 'Toda fórmula começa com o sinal de igual.'),
      Q('p1', 'Onde aparece a conta que está por trás do resultado?', ['Na barra de fórmulas', 'Na aba da planilha', 'Na barra de tarefas', 'No título'], 0, 'A célula mostra o resultado; a barra de fórmulas mostra a conta.'),
      Q('p2', 'Qual sinal faz multiplicação no Excel?', ['* (asterisco)', 'x', '÷', '#'], 0, 'A multiplicação usa o asterisco.'),
      Q('p2', 'Qual o resultado de =8/2?', ['4', '16', '10', '6'], 0, 'A barra (/) é divisão: 8 dividido por 2 é 4.'),
      Q('p3', 'Por que usar o nome das células (como B2) na fórmula?', ['Para o resultado mudar sozinho quando o valor mudar', 'Para a planilha ficar colorida', 'Porque números são proibidos', 'Para imprimir'], 0, 'Com referências, a fórmula acompanha as mudanças.'),
      Q('p3', 'Quantidade em B2 e preço em C2. Qual fórmula dá o total?', ['=B2*C2', '=B2+C2', 'B2xC2', '=B2/C2'], 0, 'Total = quantidade vezes preço.'),
      Q('p4', 'Qual o resultado de =2+3*4?', ['14', '20', '24', '9'], 0, 'Primeiro a multiplicação (12), depois a soma: 14.'),
      Q('p4', 'Qual fórmula calcula a média das notas em B2 e C2?', ['=(B2+C2)/2', '=B2+C2/2', '=B2*C2', '=B2-C2'], 0, 'Os parênteses fazem a soma acontecer antes da divisão.'),
      Q('p5', 'O que significa o erro #DIV/0!?', ['Divisão por zero ou por célula vazia', 'Coluna estreita', 'Nome de função errado', 'Falta de internet'], 0, '#DIV/0! aparece quando se divide por zero.'),
      Q('p5', 'O que significa o erro #NOME?', ['Nome de função escrito errado', 'Divisão por zero', 'Célula apagada', 'Data inválida'], 0, '#NOME? indica que o Excel não reconheceu o nome da função.'),
    ],
  };

  C['d4-a05'] = {
    titulo: 'Funções essenciais',
    subtitulo: 'SOMA, MÉDIA, MÁXIMO, MÍNIMO e CONT.NÚM: fórmulas prontas que resolvem quase tudo.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'O que é uma função', blocos: [
        { p: 'Uma **função** é uma **fórmula pronta** do Excel. Em vez de escrever =B2+B3+B4+B5+B6..., você escreve **=SOMA(B2:B6)**.' },
        { exemplo: { titulo: 'Como se escreve uma função', linhas: ['=NOME(intervalo)', '=SOMA(B2:B6)'] } },
        { lista: [
          'Começa com **=**.',
          'Depois o **nome** da função (em português, no Excel em português).',
          'Entre **parênteses**, as células que entram na conta.',
        ] },
      ] },
      { id: 'p2', titulo: 'SOMA e AutoSoma', blocos: [
        { p: 'A função **SOMA** [[soma]] soma todos os números de um intervalo.' },
        { exemplo: { titulo: 'Total dos preços de C2 até C10', linhas: ['=SOMA(C2:C10)'] } },
        { p: 'O jeito mais rápido é o botão **AutoSoma** (o símbolo **Σ**), na Página Inicial:' },
        { passos: [
          'Clique na célula logo **abaixo** dos números.',
          'Clique em **Σ AutoSoma** (ou aperte {{Alt+=}}).',
          'O Excel sugere o intervalo. Se estiver certo, aperte {{Enter}}.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Olhe a barra de status', texto: 'Selecione alguns números e olhe a barra de status, embaixo: o Excel já mostra a **Soma**, a **Média** e a **Contagem**, sem precisar de fórmula.' } },
      ] },
      { id: 'p3', titulo: 'MÉDIA, MÁXIMO e MÍNIMO', blocos: [
        { tabela: { cab: ['Função', 'O que faz', 'Exemplo'], linhas: [
          ['MÉDIA', 'Calcula a média', '=MÉDIA(B2:B5)'],
          ['MÁXIMO', 'Mostra o maior valor', '=MÁXIMO(B2:B5)'],
          ['MÍNIMO', 'Mostra o menor valor', '=MÍNIMO(B2:B5)'],
        ] } },
        { exemplo: { titulo: 'Notas de um aluno em B2:B5: 7, 8, 6 e 9', linhas: ['=MÉDIA(B2:B5) → 7,5', '=MÁXIMO(B2:B5) → 9', '=MÍNIMO(B2:B5) → 6'] } },
      ] },
      { id: 'p4', titulo: 'Contando células', blocos: [
        { tabela: { cab: ['Função', 'O que conta'], linhas: [
          ['CONT.NÚM', 'Células com **números**'],
          ['CONT.VALORES', 'Células **não vazias** (texto ou número)'],
          ['CONTAR.VAZIO', 'Células **vazias**'],
        ] } },
        { p: 'Exemplo: numa lista de presença, **=CONT.VALORES(A2:A40)** mostra quantos alunos foram cadastrados.' },
        { destaque: { tom: 'saiba', titulo: 'Ponto e vírgula', texto: 'Para usar duas áreas separadas, o Excel em português usa **ponto e vírgula**: =SOMA(B2:B5;D2:D5).' } },
      ] },
      { id: 'p5', titulo: 'A função SE (bônus)', blocos: [
        { p: 'A função **SE** faz uma **pergunta** e dá uma resposta para “sim” e outra para “não”.' },
        { exemplo: { titulo: 'Média em C2. Em D2:', linhas: ['=SE(C2>=7;"Aprovado";"Recuperação")'] } },
        { p: 'Lê-se: “**se** C2 for maior ou igual a 7, escreva Aprovado; **senão**, escreva Recuperação”. É exatamente a regra das notas deste curso!' },
        { destaque: { tom: 'dica', titulo: 'Inserir função', texto: 'Não lembra o nome? Clique no botão **fx**, ao lado da barra de fórmulas, e procure a função pela descrição.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é uma função no Excel?', ['Uma fórmula pronta', 'Uma aba nova', 'Um tipo de gráfico', 'Uma cor de célula'], 0, 'Funções são fórmulas prontas, como SOMA e MÉDIA.'),
      Q('p1', 'Como se escreve a soma de B2 até B6 com função?', ['=SOMA(B2:B6)', 'SOMA B2-B6', '=B2:B6', '=SOMA[B2,B6]'], 0, '=SOMA(B2:B6) soma todo o intervalo.'),
      Q('p2', 'Qual símbolo representa o botão AutoSoma?', ['Σ', '%', '@', '&'], 0, 'O AutoSoma tem o símbolo Σ (sigma).'),
      Q('p2', 'Qual atalho faz a AutoSoma?', ['Alt + =', 'Ctrl + S', 'Shift + Enter', 'Ctrl + P'], 0, 'Alt + = insere a AutoSoma.'),
      Q('p3', 'Qual função mostra o maior valor de uma lista?', ['MÁXIMO', 'MÍNIMO', 'SOMA', 'MÉDIA'], 0, 'MÁXIMO retorna o maior valor.'),
      Q('p3', 'As notas são 7, 8, 6 e 9. Qual a média?', ['7,5', '30', '9', '6'], 0, '(7+8+6+9)/4 = 30/4 = 7,5.'),
      Q('p4', 'Qual função conta as células com números?', ['CONT.NÚM', 'SOMA', 'MÉDIA', 'MÁXIMO'], 0, 'CONT.NÚM conta células com números.'),
      Q('p4', 'No Excel em português, o que separa duas áreas numa função?', ['Ponto e vírgula', 'Vírgula', 'Ponto', 'Barra'], 0, 'O Excel em português usa ponto e vírgula: =SOMA(B2:B5;D2:D5).'),
      Q('p5', 'O que faz a função SE?', ['Faz uma pergunta e dá uma resposta para sim e outra para não', 'Soma valores', 'Cria gráficos', 'Imprime'], 0, 'SE testa uma condição e escolhe a resposta.'),
      Q('p5', 'Para procurar uma função pela descrição, clique em:', ['fx, ao lado da barra de fórmulas', 'Σ', 'Imprimir', 'Mesclar'], 0, 'O botão fx abre a janela Inserir Função.'),
    ],
  };

  C['d4-a06'] = {
    titulo: 'Referências e preenchimento automático',
    subtitulo: 'A alça de preenchimento, sequências automáticas e o cifrão que “trava” uma célula na fórmula.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'A alça de preenchimento', blocos: [
        { p: 'Repare no **quadradinho** no canto de baixo à direita da célula selecionada: é a **alça de preenchimento**. Quando a setinha vira uma **cruz preta fina** (+), você pode arrastar.' },
        { p: 'Arrastar a alça **copia** o conteúdo para as células vizinhas, ou **continua uma sequência**.' },
      ] },
      { id: 'p2', titulo: 'Sequências automáticas', blocos: [
        { tabela: { cab: ['Digite', 'Arraste e o Excel continua'], linhas: [
          ['Janeiro', 'Fevereiro, Março, Abril...'],
          ['seg', 'ter, qua, qui...'],
          ['1 e 2 (em duas células, selecionadas juntas)', '3, 4, 5, 6...'],
          ['5 e 10', '15, 20, 25...'],
          ['01/03/2026', '02/03/2026, 03/03/2026...'],
          ['Produto 1', 'Produto 2, Produto 3...'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Clique duplo na alça', texto: 'Se a coluna ao lado já tem dados, dê **clique duplo** na alça: o Excel preenche até o fim da lista sozinho.' } },
      ] },
      { id: 'p3', titulo: 'Copiando fórmulas', blocos: [
        { p: 'A maior utilidade da alça é **copiar fórmulas**. Se em **D2** está **=B2*C2** e você arrasta até D5, o Excel ajusta sozinho:' },
        { exemplo: { titulo: 'Fórmulas criadas pelo arrastar', linhas: ['D2: =B2*C2', 'D3: =B3*C3', 'D4: =B4*C4', 'D5: =B5*C5'] } },
        { p: 'Isso é a **referência relativa**: a fórmula “anda” junto com a célula. Escreve uma vez, usa em mil linhas [[raio]].' },
      ] },
      { id: 'p4', titulo: 'O cifrão: referência absoluta', blocos: [
        { p: 'Às vezes uma célula **não pode andar**. Por exemplo: todos os preços precisam ser multiplicados pela **taxa de desconto** que está só em **F1**.' },
        { p: 'Para “trancar” uma célula, coloque o **cifrão ($)**: **$F$1**. Ela não muda quando a fórmula é copiada.' },
        { exemplo: { titulo: 'Preço em C2, desconto em F1', linhas: ['D2: =C2*$F$1', 'D3: =C3*$F$1  (o C mudou, o F1 ficou)'] } },
        { destaque: { tom: 'dica', titulo: 'Tecla F4', texto: 'Ao escrever a fórmula, clique na célula e aperte {{F4}}: o Excel coloca os cifrões sozinho.' } },
      ] },
      { id: 'p5', titulo: 'Copiar e colar no Excel', blocos: [
        { lista: [
          '{{Ctrl+C}} e {{Ctrl+V}} funcionam como no resto do Windows. A célula copiada fica com uma **borda piscando**.',
          'Aperte {{Esc}} para tirar a borda piscando.',
          '**Colar Especial** (botão direito > Colar Especial > **Valores**) cola só o **resultado**, sem a fórmula.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Quando colar só valores?', texto: 'Quando você quer enviar os números para outra planilha sem levar as fórmulas junto, ou “congelar” um resultado.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Onde fica a alça de preenchimento?', ['No canto de baixo à direita da célula selecionada', 'Na aba da planilha', 'Na barra de fórmulas', 'No título'], 0, 'É o quadradinho no canto inferior direito da célula.'),
      Q('p1', 'Que formato a setinha tem quando está sobre a alça?', ['Uma cruz preta fina (+)', 'Uma mãozinha', 'Uma ampulheta', 'Uma seta dupla'], 0, 'A cruz preta fina indica que dá para arrastar.'),
      Q('p2', 'Digitando “Janeiro” e arrastando a alça, o Excel:', ['Continua com Fevereiro, Março...', 'Repete Janeiro', 'Apaga a célula', 'Dá erro'], 0, 'O Excel reconhece meses e continua a sequência.'),
      Q('p2', 'Para criar a sequência 5, 10, 15, 20, você:', ['Digita 5 e 10, seleciona as duas e arrasta', 'Digita só 5 e arrasta', 'Digita 20 e arrasta para trás', 'Não é possível'], 0, 'Com dois valores, o Excel entende o intervalo.'),
      Q('p3', 'Se D2 tem =B2*C2 e você arrasta até D3, a fórmula em D3 fica:', ['=B3*C3', '=B2*C2', '=B4*C4', '=D2*D3'], 0, 'A referência relativa anda junto com a célula.'),
      Q('p3', 'Como se chama a referência que muda ao copiar a fórmula?', ['Relativa', 'Absoluta', 'Fixa', 'Trancada'], 0, 'A referência relativa se ajusta ao ser copiada.'),
      Q('p4', 'Para que serve o cifrão em $F$1?', ['Trancar a célula para ela não mudar ao copiar', 'Mostrar em reais', 'Somar', 'Apagar'], 0, 'O $ cria uma referência absoluta.'),
      Q('p4', 'Qual tecla coloca os cifrões automaticamente?', ['F4', 'F1', 'F7', 'F12'], 0, 'F4 alterna entre os tipos de referência.'),
      Q('p5', 'Qual opção cola só o resultado, sem a fórmula?', ['Colar Especial > Valores', 'Colar normal', 'Recortar', 'Desfazer'], 0, 'Colar Valores cola apenas os resultados.'),
      Q('p5', 'Como tirar a borda piscando da célula copiada?', ['Apertando Esc', 'Apertando Delete', 'Fechando o Excel', 'Com F4'], 0, 'O Esc cancela a seleção de cópia.'),
    ],
  };

  C['d4-a07'] = {
    titulo: 'Organizando os dados',
    subtitulo: 'Classificar em ordem, filtrar o que interessa, congelar o cabeçalho e formatar como tabela.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Classificar (ordenar)', blocos: [
        { p: '**Classificar** [[ordenar]] coloca os dados em ordem: de A a Z, do menor para o maior, por data...' },
        { passos: [
          'Clique numa célula da coluna que vai ditar a ordem (por exemplo, Nome).',
          'Guia **Dados** > **Classificar de A a Z** (crescente) ou **de Z a A** (decrescente).',
          'O Excel move as **linhas inteiras**, mantendo cada nome com os seus dados.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Não selecione só uma coluna', texto: 'Se você selecionar só a coluna e classificar, os nomes podem ficar separados dos seus valores. Clique em **uma célula** e deixe o Excel perceber a tabela toda.' } },
      ] },
      { id: 'p2', titulo: 'Filtrar', blocos: [
        { p: 'O **filtro** [[filtro]] esconde temporariamente as linhas que não interessam, sem apagar nada.' },
        { passos: [
          'Clique dentro da tabela.',
          'Guia **Dados** > **Filtro** (ou {{Ctrl+Shift+L}}). Aparecem **setinhas** nos títulos das colunas.',
          'Clique na setinha de uma coluna e marque só o que quer ver (por exemplo, só o mês de março).',
          'Para mostrar tudo de novo, clique na setinha e em **Limpar Filtro**.',
        ] },
      ] },
      { id: 'p3', titulo: 'Congelar painéis', blocos: [
        { p: 'Em listas grandes, ao rolar para baixo, os títulos das colunas somem. **Congelar** deixa a primeira linha sempre à vista.' },
        { lista: [
          'Guia **Exibir** > **Congelar Painéis** > **Congelar Linha Superior**.',
          'Para a primeira coluna: **Congelar Primeira Coluna**.',
          'Para desfazer: **Descongelar Painéis**.',
        ] },
      ] },
      { id: 'p4', titulo: 'Formatar como tabela', blocos: [
        { p: 'Na Página Inicial, **Formatar como Tabela** transforma um intervalo numa **tabela inteligente**, com um clique:' },
        { checklist: [
          'Cores alternadas nas linhas, fáceis de ler.',
          'Filtros nos títulos automaticamente.',
          'Linhas novas já entram na tabela com a mesma formatação.',
          'Opção de **Linha de Totais** pronta, na guia Design da Tabela.',
        ] },
      ] },
      { id: 'p5', titulo: 'Formatação condicional', blocos: [
        { p: 'A **formatação condicional** pinta as células **automaticamente** conforme o valor. Fica em **Página Inicial** > **Formatação Condicional**.' },
        { lista: [
          '**Realçar regras:** pinta de vermelho as notas **menores que 7**.',
          '**Barras de dados:** desenha uma barrinha dentro da célula, proporcional ao valor.',
          '**Escalas de cor:** do verde (alto) ao vermelho (baixo).',
        ] },
        { destaque: { tom: 'dica', titulo: 'Controle de gastos', texto: 'Use formatação condicional para destacar em vermelho os gastos acima de um valor. Os exageros saltam aos olhos!' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que faz “Classificar de A a Z”?', ['Coloca os dados em ordem crescente', 'Apaga os dados', 'Cria um gráfico', 'Soma os valores'], 0, 'Classificar de A a Z ordena em ordem crescente.'),
      Q('p1', 'Ao classificar, o Excel move:', ['As linhas inteiras, mantendo os dados juntos', 'Só a coluna clicada', 'Só os títulos', 'Nada'], 0, 'Cada linha se move inteira, com todos os seus dados.'),
      Q('p2', 'O filtro:', ['Esconde temporariamente as linhas que não interessam', 'Apaga as linhas', 'Muda as cores', 'Imprime'], 0, 'O filtro só esconde; nada é apagado.'),
      Q('p2', 'Qual atalho liga o filtro?', ['Ctrl + Shift + L', 'Ctrl + F', 'Alt + F4', 'Ctrl + Z'], 0, 'Ctrl + Shift + L liga e desliga o filtro.'),
      Q('p3', 'Para os títulos das colunas não sumirem ao rolar, use:', ['Congelar Linha Superior', 'Filtro', 'Mesclar', 'AutoSoma'], 0, 'Congelar painéis mantém a linha de títulos visível.'),
      Q('p3', 'Em qual guia fica “Congelar Painéis”?', ['Exibir', 'Inserir', 'Fórmulas', 'Arquivo'], 0, 'Congelar Painéis fica na guia Exibir.'),
      Q('p4', 'Qual vantagem do “Formatar como Tabela”?', ['Cores alternadas e filtros automáticos', 'Apagar dados repetidos', 'Deixar a planilha sem bordas', 'Nenhuma'], 0, 'A tabela ganha cores, filtros e linha de totais.'),
      Q('p4', 'Numa tabela formatada, linhas novas:', ['Já entram com a mesma formatação', 'Ficam sem formatação sempre', 'Apagam a tabela', 'Não podem ser criadas'], 0, 'A tabela se expande com as novas linhas.'),
      Q('p5', 'O que faz a formatação condicional?', ['Pinta as células automaticamente conforme o valor', 'Soma os valores', 'Ordena', 'Salva'], 0, 'Ela muda a aparência de acordo com uma regra.'),
      Q('p5', 'Como destacar as notas menores que 7?', ['Formatação Condicional > Realçar regras > É Menor do que', 'Classificar de Z a A', 'Congelar painéis', 'Mesclar células'], 0, 'A regra “É Menor do que” pinta os valores abaixo de 7.'),
    ],
  };

  C['d4-a08'] = {
    titulo: 'Criando gráficos simples',
    subtitulo: 'Colunas, pizza e linhas: transforme números em desenhos que qualquer pessoa entende.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Por que fazer gráficos', blocos: [
        { p: 'Uma tabela cheia de números é difícil de entender de relance. Um **gráfico** [[grafico]] mostra a mesma informação como um desenho: dá para ver na hora o que é maior, o que cresceu, o que caiu.' },
        { fig: 'grafico', legenda: 'Gráfico de colunas e gráfico de pizza.' },
      ] },
      { id: 'p2', titulo: 'Os tipos principais', blocos: [
        { tabela: { cab: ['Tipo', 'Bom para', 'Exemplo'], linhas: [
          ['Colunas', 'Comparar quantidades', 'Vendas de cada mês'],
          ['Barras', 'Comparar, quando os nomes são longos', 'Produtos mais vendidos'],
          ['Pizza', 'Mostrar partes de um todo (100%)', 'Para onde vai o salário'],
          ['Linhas', 'Mostrar a evolução ao longo do tempo', 'Temperatura durante a semana'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Pizza com poucas fatias', texto: 'Use o gráfico de pizza só com **poucas categorias** (até 5 ou 6). Com muitas fatias, fica impossível de ler.' } },
      ] },
      { id: 'p3', titulo: 'Criando o gráfico', blocos: [
        { exemplo: { titulo: 'Dados de exemplo', linhas: ['Mês   | Vendas', 'Jan   | 120', 'Fev   | 80', 'Mar   | 160', 'Abr   | 110'] } },
        { passos: [
          '**Selecione** os dados, **incluindo os títulos** (Mês e Vendas).',
          'Guia **Inserir** > grupo **Gráficos** > escolha **Colunas**.',
          'O gráfico aparece por cima da planilha. Arraste para posicionar.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Gráficos Recomendados', texto: 'Na dúvida, clique em **Gráficos Recomendados**: o Excel sugere os tipos que combinam com os seus dados.' } },
      ] },
      { id: 'p4', titulo: 'Deixando o gráfico claro', blocos: [
        { p: 'Clique no gráfico para aparecerem os botões ao lado dele e as guias **Design do Gráfico** e **Formatar**:' },
        { lista: [
          '**Título do gráfico:** clique e escreva algo que explique, como “Vendas do 1º trimestre”.',
          '**Elementos (+):** liga a **legenda** e os **rótulos de dados** (os números em cima das colunas).',
          '**Estilos (pincel):** cores e aparências prontas.',
          '**Alterar Tipo de Gráfico:** troca colunas por linhas, por exemplo, sem refazer.',
        ] },
      ] },
      { id: 'p5', titulo: 'O gráfico acompanha os dados', blocos: [
        { p: 'O gráfico é **ligado** à tabela: se você mudar um número, as colunas **mudam sozinhas** [[raio]].' },
        { p: 'Para mover o gráfico para uma aba só dele, clique com o botão direito > **Mover Gráfico** > **Nova planilha**.' },
        { destaque: { tom: 'dica', titulo: 'Copie para o Word', texto: 'Selecione o gráfico, {{Ctrl+C}}, e cole com {{Ctrl+V}} no Word. Ótimo para trabalhos e relatórios.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual a vantagem do gráfico sobre a tabela de números?', ['Mostra a informação como desenho, fácil de entender de relance', 'Ocupa menos memória', 'Não precisa de dados', 'É mais difícil de ler'], 0, 'O gráfico deixa comparações e tendências visíveis na hora.'),
      Q('p1', 'Em qual guia ficam os gráficos?', ['Inserir', 'Exibir', 'Dados', 'Revisão'], 0, 'Os gráficos ficam na guia Inserir.'),
      Q('p2', 'Qual gráfico é melhor para mostrar partes de um todo?', ['Pizza', 'Linhas', 'Colunas', 'Nenhum'], 0, 'A pizza mostra como o todo (100%) se divide.'),
      Q('p2', 'Qual gráfico mostra a evolução ao longo do tempo?', ['Linhas', 'Pizza', 'Rosca', 'Nenhum'], 0, 'O gráfico de linhas mostra tendências no tempo.'),
      Q('p3', 'O que selecionar antes de criar o gráfico?', ['Os dados, incluindo os títulos', 'Só o título da planilha', 'Uma célula vazia', 'A aba'], 0, 'Selecione os dados com os títulos das colunas.'),
      Q('p3', 'Não sabe qual gráfico usar? Clique em:', ['Gráficos Recomendados', 'Congelar Painéis', 'AutoSoma', 'Mesclar'], 0, 'O Excel sugere tipos que combinam com os dados.'),
      Q('p4', 'Como mostrar os números em cima das colunas?', ['Ligando os rótulos de dados', 'Apertando Delete', 'Mudando a fonte da planilha', 'Com F4'], 0, 'Os rótulos de dados mostram os valores no gráfico.'),
      Q('p4', 'Para trocar colunas por linhas sem refazer o gráfico, use:', ['Alterar Tipo de Gráfico', 'Excluir', 'Filtro', 'Classificar'], 0, 'Alterar Tipo de Gráfico troca o modelo.'),
      Q('p5', 'O que acontece com o gráfico quando você muda um número da tabela?', ['Muda sozinho', 'Fica igual', 'É apagado', 'Vira pizza'], 0, 'O gráfico é ligado aos dados e se atualiza.'),
      Q('p5', 'Como levar o gráfico para o Word?', ['Copiar (Ctrl + C) e colar (Ctrl + V)', 'Imprimir e escanear', 'Não é possível', 'Pela Lixeira'], 0, 'Basta copiar e colar.'),
    ],
  };

  C['d4-a09'] = {
    titulo: 'Salvando e imprimindo planilhas',
    subtitulo: 'Salvar, escolher a área de impressão, ajustar a página e exportar em PDF sem cortar colunas.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Salvando a pasta de trabalho', blocos: [
        { p: 'Assim como no Word: **Arquivo** > **Salvar como** na primeira vez, escolhendo a pasta e um bom nome, como **orcamento-2026.xlsx**. Depois, é só usar o atalho de salvar de tempos em tempos [[salvar]].' },
        { tabela: { cab: ['Formato', 'Para que serve'], linhas: [
          ['.xlsx', 'O formato normal do Excel'],
          ['.csv', 'Texto simples separado por ponto e vírgula, aceito por muitos sistemas'],
          ['.pdf', 'Para enviar e imprimir, sem que alterem'],
          ['.ods', 'Formato do LibreOffice Calc'],
        ] } },
      ] },
      { id: 'p2', titulo: 'Visualizando a impressão', blocos: [
        { p: 'Planilhas costumam ser **largas**. Antes de imprimir, sempre confira como vai ficar: **Arquivo** > **Imprimir** (ou {{Ctrl+P}}) [[impressora]].' },
        { p: 'Na tela de impressão, embaixo, aparece “**1 de 3**”: quer dizer que vão sair 3 folhas. Use as setinhas para ver cada uma.' },
        { destaque: { tom: 'atencao', titulo: 'A coluna sozinha', texto: 'O problema mais comum: as primeiras colunas saem numa folha e a última coluna sai sozinha em outra. Veja a seguir como resolver.' } },
      ] },
      { id: 'p3', titulo: 'Ajustando a página', blocos: [
        { p: 'Na própria tela de impressão (ou na guia **Layout da Página**):' },
        { lista: [
          '**Orientação Paisagem:** a folha deitada cabe mais colunas.',
          '**Dimensionamento** > **Ajustar Todas as Colunas em Uma Página:** o Excel diminui um pouco tudo para caber.',
          '**Margens Estreitas:** ganha mais espaço útil.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Linhas de grade', texto: 'As linhas cinza da planilha **não** saem na impressão. Se quiser as linhas no papel, aplique **Bordas** nas células.' } },
      ] },
      { id: 'p4', titulo: 'Área de impressão e títulos', blocos: [
        { h: 'Imprimir só uma parte' },
        { passos: [
          'Selecione as células que você quer imprimir.',
          '**Layout da Página** > **Área de Impressão** > **Definir Área de Impressão**.',
        ] },
        { h: 'Repetir o cabeçalho' },
        { p: 'Em listas que ocupam várias folhas, use **Layout da Página** > **Imprimir Títulos** > **Linhas a repetir na parte superior**: a linha de títulos aparece em todas as folhas.' },
      ] },
      { id: 'p5', titulo: 'Projeto final: orçamento da casa', blocos: [
        { p: 'Junte tudo o que aprendeu nesta disciplina:' },
        { passos: [
          'Colunas: **Data**, **Descrição**, **Categoria**, **Valor**.',
          'Formate os valores como **Moeda** e a primeira linha em negrito.',
          'No fim, um **Total** com **=SOMA()** e a **média** dos gastos com **=MÉDIA()**.',
          '**Formate como Tabela** e use o **filtro** para ver só uma categoria.',
          'Crie um **gráfico de pizza** com os gastos por categoria.',
          'Ajuste em **Paisagem**, em uma página, e salve em **.xlsx** e **PDF**.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Parabéns!', texto: 'Com isso você já domina o essencial de planilhas: o suficiente para organizar a vida pessoal e para muitas vagas de emprego.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual a extensão normal de um arquivo do Excel?', ['.xlsx', '.docx', '.mp4', '.exe'], 0, 'O formato normal do Excel é .xlsx.'),
      Q('p1', 'Qual formato é texto simples aceito por muitos sistemas?', ['.csv', '.jpg', '.mp3', '.exe'], 0, 'O .csv guarda os dados como texto separado por ponto e vírgula.'),
      Q('p2', 'O que significa “1 de 3” na tela de impressão?', ['Que vão sair 3 folhas', 'Que vai imprimir 3 cópias', 'Que falta tinta', 'Que há 3 impressoras'], 0, 'Indica o número de folhas da impressão.'),
      Q('p2', 'Por que visualizar antes de imprimir uma planilha?', ['Porque planilhas largas podem ser cortadas em várias folhas', 'Porque é obrigatório', 'Para mudar a senha', 'Não precisa'], 0, 'Planilhas largas costumam sair divididas em várias folhas.'),
      Q('p3', 'Qual orientação ajuda a caber mais colunas?', ['Paisagem', 'Retrato', 'Vertical', 'Nenhuma'], 0, 'A folha deitada (Paisagem) tem mais largura.'),
      Q('p3', 'As linhas cinza da planilha saem na impressão?', ['Não; para isso use Bordas', 'Sim, sempre', 'Só em cores', 'Só no PDF'], 0, 'As linhas de grade não são impressas; as bordas, sim.'),
      Q('p4', 'Como imprimir só uma parte da planilha?', ['Definindo a Área de Impressão', 'Apagando o resto', 'Usando o zoom', 'Mudando a fonte'], 0, 'Selecione e defina a Área de Impressão.'),
      Q('p4', 'Para repetir a linha de títulos em todas as folhas, use:', ['Imprimir Títulos', 'Congelar Painéis', 'Mesclar', 'AutoSoma'], 0, 'Imprimir Títulos repete a linha nas folhas impressas.'),
      Q('p5', 'No projeto de orçamento, qual função calcula o total?', ['SOMA', 'MÁXIMO', 'SE', 'CONT.VALORES'], 0, 'A função SOMA calcula o total dos gastos.'),
      Q('p5', 'Qual gráfico mostra os gastos por categoria como partes do todo?', ['Pizza', 'Linhas', 'Nenhum', 'Dispersão'], 0, 'A pizza mostra como o total se divide entre as categorias.'),
    ],
  };

  C['d4-av'] = {
    titulo: 'Avaliação: Planilhas Eletrônicas (Excel)',
    subtitulo: '30 perguntas sobre as Aulas 01 a 09. Não há material para consultar: responda com o que você aprendeu.',
    avaliacao: { aulas: ['d4-a01', 'd4-a02', 'd4-a03', 'd4-a04', 'd4-a05', 'd4-a06', 'd4-a07', 'd4-a08', 'd4-a09'] },
  };
})();
