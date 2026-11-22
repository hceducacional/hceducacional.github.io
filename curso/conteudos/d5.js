/* =========================================================
   DISCIPLINA 5 — INTERNET E NAVEGADORES (curso "Informática do zero")
   Aulas 01 a 09 + Aula 10 (avaliação). Formato dos blocos: veja curso/conteudos/d1.js.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
(() => {
  const C = window.HC_CONTEUDOS;
  const Q = (parte, q, op, certa, exp) => ({ parte, q, op, certa, exp });

  C['d5-a01'] = {
    titulo: 'O que é a Internet?',
    subtitulo: 'A rede que liga computadores e celulares do mundo inteiro: de onde ela veio e o que dá para fazer nela.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'Uma rede de redes', blocos: [
        { p: 'A **internet** [[globo]] é uma enorme **rede** que liga bilhões de computadores, celulares e servidores no mundo inteiro. Ela permite que esses aparelhos **troquem informações** em segundos, mesmo estando em países diferentes.' },
        { fig: 'internet', legenda: 'Aparelhos do mundo todo trocando informações pela internet.' },
        { p: 'Por isso dizemos que a internet é uma **rede de redes**: a rede da sua casa se liga à do seu provedor, que se liga a outras, até cobrir o planeta.' },
      ] },
      { id: 'p2', titulo: 'Um pouco de história', blocos: [
        { linha: [
          ['1969', 'Nasce a **ARPANET**, nos Estados Unidos: uma rede militar e universitária que ligava poucos computadores.'],
          ['1991', 'Tim Berners-Lee cria a **World Wide Web** (www): as páginas com links.'],
          ['1995', 'A internet começa a ser oferecida para as casas e empresas no **Brasil**.'],
          ['2000+', 'Chegam a banda larga, o Wi-Fi e, depois, a internet no celular (3G, 4G, 5G).'],
        ] },
        { destaque: { tom: 'saiba', titulo: 'Internet e web são a mesma coisa?', texto: 'Quase. A **internet** é a rede (os cabos, antenas e computadores ligados). A **web** é o conjunto de **sites** que usamos por cima dela. E-mail e WhatsApp também usam a internet, mas não são a web.' } },
      ] },
      { id: 'p3', titulo: 'O que dá para fazer', blocos: [
        { cards: [
          { ico: 'lupa', t: 'Pesquisar', d: 'Encontrar informações sobre qualquer assunto.' },
          { ico: 'email', t: 'Comunicar', d: 'E-mail, mensagens, chamadas de vídeo.' },
          { ico: 'livro', t: 'Estudar', d: 'Cursos, aulas e livros on-line.' },
          { ico: 'cartao', t: 'Serviços', d: 'Banco, compras, documentos do governo.' },
          { ico: 'video', t: 'Entretenimento', d: 'Filmes, músicas, jogos e notícias.' },
          { ico: 'usuario', t: 'Trabalho', d: 'Procurar vagas e trabalhar de casa.' },
        ] },
      ] },
      { id: 'p4', titulo: 'Serviços do governo e do dia a dia', blocos: [
        { p: 'Muitos serviços públicos hoje são feitos pela internet. Alguns exemplos:' },
        { lista: [
          '**gov.br:** a conta única para acessar serviços do governo federal, como Carteira de Trabalho Digital e INSS.',
          '**Aplicativos de saúde:** consultar vacinas e exames.',
          '**Bancos:** pagar contas, fazer Pix e ver o extrato.',
          '**Escolas e cursos:** matrículas, notas e aulas.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Sites oficiais', texto: 'Sites do governo brasileiro terminam em **.gov.br**. Desconfie de sites com nomes parecidos que pedem pagamento para “liberar” serviços gratuitos.' } },
      ] },
      { id: 'p5', titulo: 'Online e offline', blocos: [
        { tabela: { cab: ['Palavra', 'Significado'], linhas: [
          ['Online (on-line)', 'Conectado à internet'],
          ['Offline', 'Desconectado'],
          ['Navegar', 'Visitar páginas da internet'],
          ['Site', 'Um conjunto de páginas de uma empresa, pessoa ou órgão'],
          ['Link', 'Um texto ou imagem que, ao clicar, leva para outra página'],
          ['Baixar (download)', 'Trazer um arquivo da internet para o seu aparelho'],
          ['Enviar (upload)', 'Mandar um arquivo do seu aparelho para a internet'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Links', texto: 'Na internet, a setinha do mouse vira uma **mãozinha** [[mao]] sobre os links. É o sinal de que ali dá para clicar.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é a internet?', ['Uma rede que liga computadores e celulares do mundo inteiro', 'Um programa do Windows', 'Um tipo de cabo de energia', 'Uma empresa'], 0, 'A internet é uma rede mundial de aparelhos conectados.'),
      Q('p1', 'Por que a internet é chamada de “rede de redes”?', ['Porque liga várias redes menores até cobrir o planeta', 'Porque é feita de redes de pesca', 'Porque só funciona em rede de casa', 'Não tem motivo'], 0, 'A rede de casa liga à do provedor, que liga a outras.'),
      Q('p2', 'Em que ano a internet começou a ser oferecida nas casas do Brasil?', ['1995', '1969', '2010', '1980'], 0, 'O acesso comercial no Brasil começou em 1995.'),
      Q('p2', 'Qual a diferença entre internet e web?', ['A internet é a rede; a web é o conjunto de sites que usamos por cima dela', 'São nomes de empresas', 'A web é mais antiga', 'Não há diferença nenhuma'], 0, 'A web roda sobre a internet, junto com e-mail e mensagens.'),
      Q('p3', 'Qual destes NÃO precisa de internet?', ['Ler um livro de papel', 'Fazer um Pix', 'Mandar um e-mail', 'Assistir a um vídeo on-line'], 0, 'Os outros dependem da internet.'),
      Q('p3', 'Chamadas de vídeo e mensagens são exemplos de:', ['Comunicação pela internet', 'Impressão', 'Hardware', 'Planilhas'], 0, 'A internet permite se comunicar com pessoas em qualquer lugar.'),
      Q('p4', 'Como terminam os endereços dos sites do governo brasileiro?', ['.gov.br', '.com', '.xyz', '.net'], 0, 'Sites oficiais do governo terminam em .gov.br.'),
      Q('p4', 'Um site pede pagamento para “liberar” um serviço público gratuito. O que fazer?', ['Desconfiar: pode ser golpe', 'Pagar logo', 'Mandar os dados do cartão', 'Compartilhar com amigos'], 0, 'Serviços gratuitos não cobram “taxa de liberação”: é sinal de golpe.'),
      Q('p5', 'O que significa baixar (download) um arquivo?', ['Trazer da internet para o seu aparelho', 'Apagar o arquivo', 'Mandar para a internet', 'Imprimir'], 0, 'Download é trazer da internet; upload é enviar.'),
      Q('p5', 'O que é um link?', ['Um texto ou imagem que leva para outra página ao clicar', 'Um tipo de vírus', 'Um cabo de rede', 'Uma senha'], 0, 'Links ligam as páginas entre si.'),
    ],
  };

  C['d5-a02'] = {
    titulo: 'Como a internet chega até você',
    subtitulo: 'Provedor, modem, roteador, Wi-Fi, dados móveis e os endereços dos sites (URL).',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O caminho da internet', blocos: [
        { fluxo: [
          { ico: 'servidor', t: 'Provedor', d: 'a empresa que vende a internet' },
          { ico: 'link', t: 'Cabo ou fibra', d: 'chega até a sua casa' },
          { ico: 'wifi', t: 'Modem e roteador', d: 'distribuem o sinal' },
          { ico: 'celular', t: 'Seus aparelhos', d: 'por cabo ou Wi-Fi' },
        ] },
        { p: 'O **provedor** é a empresa que você contrata. O sinal chega por **fibra óptica**, cabo, rádio ou satélite até um aparelho na sua casa.' },
      ] },
      { id: 'p2', titulo: 'Modem, roteador e Wi-Fi', blocos: [
        { lista: [
          '**Modem:** recebe a internet do provedor.',
          '**Roteador:** distribui a internet para vários aparelhos da casa, por cabo ou sem fio.',
          'Hoje muitos aparelhos são **as duas coisas juntas**.',
        ] },
        { p: 'O **Wi-Fi** [[wifi]] é a internet **sem fio** criada pelo roteador. Cada rede tem um **nome** e uma **senha**, que costumam estar numa etiqueta embaixo do aparelho.' },
        { destaque: { tom: 'dica', titulo: 'Internet lenta ou caiu?', texto: 'Primeiro, tire o roteador da tomada, espere 30 segundos e ligue de novo. Esse “reiniciar” resolve muitos problemas. Se continuar, ligue para o provedor.' } },
      ] },
      { id: 'p3', titulo: 'Conectando ao Wi-Fi', blocos: [
        { passos: [
          'Clique no ícone de **rede** na área de notificação do Windows (ou abra as configurações de Wi-Fi do celular).',
          'Escolha o **nome** da sua rede.',
          'Clique em **Conectar** e digite a **senha**.',
          'Marque **Conectar automaticamente** para não precisar digitar de novo.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Wi-Fi público', texto: 'Redes abertas de praças, rodoviárias e shoppings são práticas, mas menos seguras. Evite acessar o banco ou digitar senhas importantes nelas.' } },
      ] },
      { id: 'p4', titulo: 'Dados móveis e velocidade', blocos: [
        { p: 'No celular, quando não há Wi-Fi, a internet vem pela operadora: são os **dados móveis** (4G, 5G). Eles são vendidos em **pacotes** de GB: quando acabam, a internet fica lenta ou para.' },
        { tabela: { cab: ['Termo', 'O que é'], linhas: [
          ['Mbps', 'Megabits por segundo: a velocidade da internet. Quanto maior, mais rápida.'],
          ['Franquia (GB)', 'Quanto de dados móveis você pode usar no mês'],
          ['4G / 5G', 'As gerações da internet do celular. O 5G é a mais nova e rápida.'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Economize dados', texto: 'Vídeos gastam muitos dados. Prefira assistir e baixar atualizações quando estiver no Wi-Fi.' } },
      ] },
      { id: 'p5', titulo: 'Endereços: a URL', blocos: [
        { p: 'Cada página da internet tem um **endereço** único, chamado **URL**. Veja as partes de um endereço:' },
        { tabela: { cab: ['Parte', 'Exemplo', 'Significa'], linhas: [
          ['Protocolo', 'https://', 'Como a conexão é feita; o **s** quer dizer **seguro**'],
          ['www', 'www.', 'World Wide Web (muitos sites não usam mais)'],
          ['Nome do site (domínio)', 'hceducacional', 'O nome do site'],
          ['Final', '.app.br, .com.br, .gov.br', 'O tipo e o país do site (br = Brasil)'],
          ['Caminho', '/cursos', 'Uma página dentro do site'],
        ] } },
        { fig: 'navegador', legenda: 'O endereço fica na barra de endereço do navegador.' },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é o provedor de internet?', ['A empresa que vende o acesso à internet', 'O navegador', 'O roteador', 'Um site'], 0, 'O provedor é a empresa contratada para fornecer a internet.'),
      Q('p1', 'Por qual destes meios a internet pode chegar até a casa?', ['Fibra óptica', 'Cano de água', 'Fio de varal', 'Papel'], 0, 'Fibra óptica, cabo, rádio ou satélite levam a internet.'),
      Q('p2', 'Qual aparelho distribui a internet para vários aparelhos da casa?', ['Roteador', 'Impressora', 'Monitor', 'Mouse'], 0, 'O roteador distribui por cabo e por Wi-Fi.'),
      Q('p2', 'A internet caiu. O que tentar primeiro?', ['Reiniciar o roteador: tirar da tomada, esperar 30 segundos e ligar', 'Comprar outro computador', 'Formatar o celular', 'Trocar de casa'], 0, 'Reiniciar o roteador resolve muitos problemas.'),
      Q('p3', 'Onde costumam estar o nome e a senha do Wi-Fi?', ['Numa etiqueta embaixo do roteador', 'No papel de parede', 'Na Lixeira', 'No mouse'], 0, 'O nome e a senha de fábrica ficam na etiqueta do aparelho.'),
      Q('p3', 'O que evitar numa rede Wi-Fi pública?', ['Acessar o banco e digitar senhas importantes', 'Ler notícias', 'Ver o mapa', 'Ver a previsão do tempo'], 0, 'Redes abertas são menos seguras para dados sensíveis.'),
      Q('p4', 'O que são dados móveis?', ['A internet do celular, vinda da operadora', 'O Wi-Fi de casa', 'Os arquivos do pendrive', 'As fotos da galeria'], 0, 'Dados móveis são a internet 4G/5G da operadora.'),
      Q('p4', 'O que indica a medida Mbps?', ['A velocidade da internet', 'O tamanho da tela', 'A bateria', 'O preço do celular'], 0, 'Mbps mede a velocidade da conexão.'),
      Q('p5', 'Como se chama o endereço de uma página na internet?', ['URL', 'PDF', 'USB', 'CPU'], 0, 'URL é o endereço de uma página.'),
      Q('p5', 'O que significa o “s” em https?', ['Seguro', 'Site', 'Servidor', 'Super'], 0, 'O s indica uma conexão segura, criptografada.'),
    ],
  };

  C['d5-a03'] = {
    titulo: 'Principais navegadores',
    subtitulo: 'O que é um navegador, quais são os mais usados e as partes da tela que você vai usar sempre.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'O que é um navegador', blocos: [
        { p: 'O **navegador** (ou *browser*) é o programa que **abre os sites** da internet. É por ele que você pesquisa, lê notícias, acessa o banco e entra neste curso.' },
        { destaque: { tom: 'saiba', titulo: 'Navegador não é a internet', texto: 'Muita gente chama o navegador de “internet”. Mas ele é só a **janela** para a internet. Você pode ter vários navegadores no mesmo computador.' } },
      ] },
      { id: 'p2', titulo: 'Os mais usados', blocos: [
        { tabela: { cab: ['Navegador', 'Quem faz', 'Onde vem instalado'], linhas: [
          ['Google Chrome', 'Google', 'Celulares Android; no computador, é baixado'],
          ['Microsoft Edge', 'Microsoft', 'Vem com o Windows'],
          ['Mozilla Firefox', 'Mozilla (sem fins lucrativos)', 'Baixado no site oficial'],
          ['Safari', 'Apple', 'iPhone, iPad e Mac'],
          ['Samsung Internet', 'Samsung', 'Celulares Samsung'],
        ] } },
        { p: 'Todos são **gratuitos** e funcionam de um jeito muito parecido. Escolha o que for mais confortável para você.' },
      ] },
      { id: 'p3', titulo: 'As partes da tela', blocos: [
        { fig: 'navegador', legenda: 'Abas, botões, barra de endereço e favoritos.' },
        { tabela: { cab: ['Parte', 'Para que serve'], linhas: [
          ['Abas', 'Várias páginas abertas na mesma janela'],
          ['Voltar e Avançar ( ← → )', 'Volta para a página anterior ou avança de novo'],
          ['Atualizar ( ⟳ )', 'Recarrega a página'],
          ['Barra de endereço', 'Onde você digita o endereço do site ou o que quer pesquisar'],
          ['Estrela ( ☆ )', 'Salva a página nos favoritos'],
          ['Menu ( ⋮ ou … )', 'Configurações, histórico, downloads'],
        ] } },
      ] },
      { id: 'p4', titulo: 'Abrindo um site', blocos: [
        { passos: [
          'Abra o navegador (ícone na barra de tarefas ou na tela do celular).',
          'Clique na **barra de endereço** lá no alto.',
          'Digite o endereço, por exemplo **hceducacional.app.br**, e aperte {{Enter}}.',
        ] },
        { p: 'Não precisa digitar **https://** nem **www**: o navegador completa sozinho.' },
        { destaque: { tom: 'dica', titulo: 'Endereço ou pesquisa', texto: 'Se você digitar algo que não é um endereço, como “previsão do tempo”, o navegador faz uma **pesquisa** automaticamente.' } },
      ] },
      { id: 'p5', titulo: 'Página inicial e atualização', blocos: [
        { p: 'A **página inicial** é a que abre quando você liga o navegador. Dá para mudar nas **Configurações** do navegador.' },
        { p: 'Navegadores recebem **atualizações** [[atualizar]] frequentes, com correções de segurança. Quando aparecer o aviso **Atualizar** ou **Reiniciar para atualizar**, aceite.' },
        { destaque: { tom: 'atencao', titulo: 'Só do site oficial', texto: 'Baixe navegadores só do site oficial ou da loja de aplicativos. Versões “turbinadas” de sites estranhos costumam vir com vírus.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é um navegador?', ['O programa que abre os sites da internet', 'O cabo da internet', 'Um vírus', 'O provedor'], 0, 'O navegador é a janela para a internet.'),
      Q('p1', 'Dá para ter mais de um navegador no mesmo computador?', ['Sim', 'Não, nunca', 'Só no celular', 'Só pagando'], 0, 'Você pode instalar vários navegadores.'),
      Q('p2', 'Qual navegador já vem com o Windows?', ['Microsoft Edge', 'Safari', 'Samsung Internet', 'Nenhum'], 0, 'O Edge é o navegador da Microsoft, que vem no Windows.'),
      Q('p2', 'O Safari é o navegador de qual empresa?', ['Apple', 'Google', 'Microsoft', 'Samsung'], 0, 'O Safari vem nos aparelhos da Apple.'),
      Q('p3', 'Para que serve o botão ⟳?', ['Recarregar (atualizar) a página', 'Fechar o navegador', 'Imprimir', 'Salvar nos favoritos'], 0, 'O botão de atualizar recarrega a página.'),
      Q('p3', 'Para que serve a estrela na barra de endereço?', ['Salvar a página nos favoritos', 'Avaliar o site', 'Apagar o histórico', 'Abrir uma aba'], 0, 'A estrela adiciona a página aos favoritos.'),
      Q('p4', 'Onde digitar o endereço de um site?', ['Na barra de endereço, no alto', 'No meio da página', 'Na barra de tarefas', 'No relógio'], 0, 'O endereço é digitado na barra de endereço.'),
      Q('p4', 'O que acontece se você digita “previsão do tempo” na barra de endereço?', ['O navegador faz uma pesquisa', 'Dá erro', 'O computador desliga', 'Abre o Word'], 0, 'Texto que não é endereço vira pesquisa.'),
      Q('p5', 'O que é a página inicial do navegador?', ['A página que abre quando o navegador é aberto', 'O primeiro site do mundo', 'A página do governo', 'A Lixeira'], 0, 'É a página que abre ao ligar o navegador.'),
      Q('p5', 'De onde baixar um navegador com segurança?', ['Do site oficial ou da loja de aplicativos', 'De qualquer link recebido', 'De um anúncio piscando', 'De um e-mail desconhecido'], 0, 'Fontes oficiais evitam versões com vírus.'),
    ],
  };

  C['d5-a04'] = {
    titulo: 'Navegando com abas, favoritos e histórico',
    subtitulo: 'Várias páginas ao mesmo tempo, os sites preferidos à mão, o que você já visitou, downloads e navegação anônima.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Abas', blocos: [
        { p: 'As **abas** permitem ter várias páginas abertas na **mesma janela**, como as divisórias de um fichário.' },
        { atalhos: [
          ['Ctrl+T', 'Abre uma aba nova'],
          ['Ctrl+W', 'Fecha a aba atual'],
          ['Ctrl+Tab', 'Vai para a próxima aba'],
          ['Ctrl+Shift+T', 'Reabre a aba que você fechou sem querer'],
        ] },
        { p: 'Para abrir um link numa aba nova, clique nele com o **botão do meio** (a rodinha) ou com o botão direito > **Abrir link em nova guia**.' },
      ] },
      { id: 'p2', titulo: 'Favoritos', blocos: [
        { p: 'Os **favoritos** [[estrela]] guardam os endereços dos sites que você mais usa, para não precisar digitar de novo.' },
        { passos: [
          'Abra o site que você quer guardar.',
          'Clique na **estrela** na barra de endereço (ou {{Ctrl+D}}).',
          'Dê um nome e escolha a pasta (por exemplo, **Barra de favoritos**).',
        ] },
        { destaque: { tom: 'dica', titulo: 'Barra de favoritos', texto: 'Aperte {{Ctrl+Shift+B}} para mostrar a barra de favoritos logo abaixo do endereço. Os sites ficam sempre a um clique.' } },
      ] },
      { id: 'p3', titulo: 'Histórico', blocos: [
        { p: 'O **histórico** [[relogio]] é a lista de todas as páginas que você visitou, com data e hora. Ótimo para achar aquele site que você viu ontem e esqueceu o nome.' },
        { lista: [
          'Abra com {{Ctrl+H}}.',
          'Use a caixa de **pesquisa** do histórico.',
          'Para apagar, use **Limpar dados de navegação** ({{Ctrl+Shift+Delete}}).',
        ] },
      ] },
      { id: 'p4', titulo: 'Downloads', blocos: [
        { p: 'Ao baixar um arquivo [[download]], o navegador mostra o progresso no canto da tela. Quando termina, clique para abrir.' },
        { lista: [
          'A lista de downloads abre com {{Ctrl+J}}.',
          'Os arquivos vão para a pasta **Downloads** do computador.',
          'Clique em **Mostrar na pasta** para ver onde o arquivo ficou.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Desconfie', texto: 'Se o navegador avisar que o arquivo **pode ser perigoso**, não abra. Arquivos .exe de sites desconhecidos são a forma mais comum de pegar vírus.' } },
      ] },
      { id: 'p5', titulo: 'Navegação anônima', blocos: [
        { p: 'A **janela anônima** (Chrome) ou **InPrivate** (Edge) não guarda histórico, senhas nem cookies **no computador**. Abra com {{Ctrl+Shift+N}} (Chrome) ou {{Ctrl+Shift+P}} (Edge e Firefox).' },
        { compara: {
          a: { t: 'Serve para', ico: 'check', itens: ['Usar o computador de outra pessoa', 'Entrar no e-mail numa lan house ou biblioteca', 'Não deixar rastros no aparelho'] },
          b: { t: 'Não serve para', ico: 'x', itens: ['Ficar invisível na internet', 'Esconder do provedor ou do trabalho', 'Proteger de vírus'] },
        } },
        { destaque: { tom: 'dica', titulo: 'Computador público', texto: 'Num computador público, use a janela anônima, saia da sua conta (**Sair**) e feche a janela ao terminar.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual atalho abre uma aba nova no navegador?', ['Ctrl + T', 'Ctrl + W', 'Ctrl + H', 'Ctrl + J'], 0, 'Ctrl + T abre uma nova aba.'),
      Q('p1', 'Fechou uma aba sem querer. Como reabrir?', ['Ctrl + Shift + T', 'Ctrl + Z', 'Alt + F4', 'F5'], 0, 'Ctrl + Shift + T reabre a última aba fechada.'),
      Q('p2', 'Para que servem os favoritos?', ['Guardar os endereços dos sites que você mais usa', 'Apagar o histórico', 'Baixar arquivos', 'Bloquear sites'], 0, 'Favoritos guardam os sites preferidos.'),
      Q('p2', 'Qual atalho adiciona a página aos favoritos?', ['Ctrl + D', 'Ctrl + F', 'Ctrl + P', 'Ctrl + N'], 0, 'Ctrl + D salva nos favoritos.'),
      Q('p3', 'O que é o histórico do navegador?', ['A lista das páginas visitadas', 'A lista de senhas', 'A pasta Downloads', 'O papel de parede'], 0, 'O histórico guarda as páginas visitadas com data e hora.'),
      Q('p3', 'Qual atalho abre o histórico?', ['Ctrl + H', 'Ctrl + J', 'Ctrl + T', 'Ctrl + D'], 0, 'Ctrl + H abre o histórico.'),
      Q('p4', 'Para onde vão os arquivos baixados?', ['Para a pasta Downloads', 'Para a Lixeira', 'Para a área de trabalho sempre', 'Para o histórico'], 0, 'Os downloads vão para a pasta Downloads.'),
      Q('p4', 'O navegador avisa que um arquivo pode ser perigoso. O que fazer?', ['Não abrir', 'Abrir rápido', 'Mandar para os amigos', 'Desligar o antivírus'], 0, 'Siga o aviso e não abra o arquivo.'),
      Q('p5', 'A janela anônima:', ['Não guarda histórico nem senhas no computador', 'Deixa você invisível na internet', 'Protege contra vírus', 'Deixa a internet mais rápida'], 0, 'Ela só não deixa rastros no aparelho.'),
      Q('p5', 'Quando a janela anônima é útil?', ['Ao usar o computador de outra pessoa ou um computador público', 'Para ver vídeos mais rápido', 'Para baixar programas', 'Nunca'], 0, 'Ela evita deixar a sua conta e o histórico no computador.'),
    ],
  };

  C['d5-a05'] = {
    titulo: 'Pesquisas no Google',
    subtitulo: 'Como pesquisar bem: escolher palavras-chave, entender os resultados e pesquisar imagens, mapas e notícias.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é um buscador', blocos: [
        { p: 'Um **buscador** (ou mecanismo de pesquisa) [[lupa]] procura páginas na internet sobre o que você digitar. O mais usado é o **Google**; outros são o **Bing** e o **DuckDuckGo**.' },
        { fig: 'pesquisa', legenda: 'Digite o que procura e veja a lista de resultados.' },
      ] },
      { id: 'p2', titulo: 'Palavras-chave', blocos: [
        { p: 'Você não precisa escrever uma frase inteira. Use as **palavras-chave**: as palavras mais importantes do que você procura.' },
        { compara: {
          a: { t: 'Menos eficiente', ico: 'x', itens: ['“eu queria saber como eu faço para fazer um bolo de cenoura com cobertura de chocolate”'] },
          b: { t: 'Mais eficiente', ico: 'check', itens: ['“bolo de cenoura cobertura chocolate receita”'] },
        } },
        { lista: [
          'Maiúsculas e minúsculas **não importam**.',
          'O Google entende erros de digitação e sugere: “**Você quis dizer...**”.',
          'Seja específico: “horário ônibus centro Fortaleza” é melhor que “ônibus”.',
        ] },
      ] },
      { id: 'p3', titulo: 'Entendendo os resultados', blocos: [
        { p: 'Cada resultado mostra o **título** (em azul, clicável), o **endereço do site** (em verde ou cinza) e um **resumo**.' },
        { lista: [
          '**Patrocinado** ou **Anúncio:** é propaganda paga. Nem sempre é o melhor resultado.',
          '**Caixas de resposta:** para perguntas simples (“quanto é 15% de 200”), o Google mostra a resposta no topo.',
          '**As pessoas também perguntam:** perguntas parecidas com a sua.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Cuidado com anúncios', texto: 'Golpistas pagam anúncios que imitam sites de bancos e lojas. Antes de clicar, confira o **endereço** do site, especialmente para fazer login ou pagar.' } },
      ] },
      { id: 'p4', titulo: 'Imagens, mapas, notícias e vídeos', blocos: [
        { p: 'Abaixo da caixa de pesquisa ficam as **abas** que filtram o tipo de resultado:' },
        { cards: [
          { ico: 'imagem', t: 'Imagens', d: 'Fotos e figuras sobre o assunto.' },
          { ico: 'local', t: 'Maps', d: 'Endereços, rotas e horários de lojas.' },
          { ico: 'texto', t: 'Notícias', d: 'Reportagens recentes.' },
          { ico: 'video', t: 'Vídeos', d: 'Vídeos sobre o assunto.' },
        ] },
        { p: 'Com o **Google Lens** (o ícone de câmera na caixa de pesquisa), você pesquisa a partir de uma **foto**: descobre o nome de uma planta, traduz uma placa ou encontra um produto.' },
      ] },
      { id: 'p5', titulo: 'Pesquisas úteis do dia a dia', blocos: [
        { tabela: { cab: ['Digite', 'O Google mostra'], linhas: [
          ['tempo Recife', 'A previsão do tempo'],
          ['dólar hoje', 'A cotação da moeda'],
          ['125 * 4', 'O resultado da conta'],
          ['farmácia perto de mim', 'Farmácias no mapa'],
          ['traduzir obrigado para inglês', 'A tradução'],
          ['1 xícara em gramas', 'A conversão de medidas'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Pesquisa por voz', texto: 'No celular, toque no **microfone** [[microfone]] e fale o que procura. É ótimo para quem ainda está pegando prática com o teclado.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Qual o buscador mais usado?', ['Google', 'Excel', 'Word', 'Paint'], 0, 'O Google é o buscador mais usado.'),
      Q('p1', 'O que faz um buscador?', ['Procura páginas sobre o que você digitar', 'Apaga vírus', 'Imprime páginas', 'Faz ligações'], 0, 'O buscador encontra páginas na internet.'),
      Q('p2', 'O que são palavras-chave?', ['As palavras mais importantes do que você procura', 'Senhas', 'Palavras em inglês', 'Palavras com maiúscula'], 0, 'Palavras-chave resumem a pesquisa.'),
      Q('p2', 'Maiúsculas e minúsculas fazem diferença na pesquisa do Google?', ['Não', 'Sim, sempre', 'Só nos nomes', 'Só no celular'], 0, 'O Google não diferencia maiúsculas de minúsculas.'),
      Q('p3', 'O que significa “Patrocinado” num resultado?', ['Que é um anúncio pago', 'Que é o site oficial', 'Que é seguro', 'Que é do governo'], 0, 'Patrocinado é propaganda paga.'),
      Q('p3', 'Por que conferir o endereço antes de clicar num anúncio de banco?', ['Golpistas fazem anúncios que imitam bancos', 'Para economizar internet', 'Porque anúncios são sempre do governo', 'Não precisa conferir'], 0, 'Anúncios falsos imitam sites oficiais.'),
      Q('p4', 'Para encontrar o endereço e a rota até uma loja, use a aba:', ['Maps', 'Imagens', 'Notícias', 'Vídeos'], 0, 'O Maps mostra endereços e rotas.'),
      Q('p4', 'O que faz o Google Lens?', ['Pesquisa a partir de uma foto', 'Aumenta o zoom', 'Grava vídeos', 'Bloqueia anúncios'], 0, 'O Lens identifica o que aparece numa foto.'),
      Q('p5', 'O que aparece ao pesquisar “tempo Recife”?', ['A previsão do tempo de Recife', 'O horário dos ônibus', 'A história da cidade', 'Nada'], 0, 'O Google mostra a previsão do tempo.'),
      Q('p5', 'Como pesquisar no celular sem digitar?', ['Tocando no microfone e falando', 'Desligando a tela', 'Pelo Bluetooth', 'Não é possível'], 0, 'A pesquisa por voz entende o que você fala.'),
    ],
  };

  C['d5-a06'] = {
    titulo: 'Pesquisa avançada e informação confiável',
    subtitulo: 'Aspas, sinal de menos, filtros de data e, principalmente, como saber se uma informação é verdadeira.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Os truques de pesquisa', blocos: [
        { tabela: { cab: ['Truque', 'Exemplo', 'O que faz'], linhas: [
          ['Aspas " "', '"bolo de fubá cremoso"', 'Procura a frase exata, nessa ordem'],
          ['Sinal de menos -', 'jaguar -carro', 'Tira resultados com essa palavra (aqui, o animal, não o carro)'],
          ['site:', 'matrícula site:gov.br', 'Pesquisa só dentro de um site ou tipo de site'],
          ['filetype:', 'currículo modelo filetype:pdf', 'Procura um tipo de arquivo'],
          ['OR', 'emprego OR vaga', 'Uma palavra ou outra'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Combine', texto: 'Dá para juntar truques: **"edital" concurso site:gov.br** procura a palavra exata edital, sobre concurso, só em sites do governo.' } },
      ] },
      { id: 'p2', titulo: 'Filtros de data e Ferramentas', blocos: [
        { p: 'Abaixo da caixa de pesquisa, clique em **Ferramentas**:' },
        { lista: [
          '**Qualquer data:** troque para **Última semana**, **Último mês** ou **Último ano**, para ver só o que é recente.',
          '**Nas Imagens:** filtre por tamanho, cor e tipo.',
          '**Direitos de uso:** mostra imagens que podem ser reutilizadas.',
        ] },
        { p: 'Isso é importante para notícias, preços e leis, que mudam com o tempo.' },
      ] },
      { id: 'p3', titulo: 'Nem tudo na internet é verdade', blocos: [
        { p: 'Qualquer pessoa pode publicar na internet. Por isso circulam muitas **notícias falsas** (*fake news*) [[alerta]], boatos e golpes. Antes de acreditar ou compartilhar, verifique.' },
        { checklist: [
          '**Quem publicou?** É um site conhecido, um órgão oficial, um jornal?',
          '**Quando?** A notícia é recente ou é antiga, sendo espalhada de novo?',
          '**Outras fontes** dizem o mesmo? Pesquise o assunto em outros sites.',
          '**O título é exagerado?** “URGENTE”, “COMPARTILHE ANTES QUE APAGUEM” são sinais de alerta.',
          '**Mexe muito com a emoção?** Notícias falsas querem que você fique com raiva ou medo.',
        ] },
      ] },
      { id: 'p4', titulo: 'Fontes confiáveis', blocos: [
        { tabela: { cab: ['Tipo de informação', 'Onde confirmar'], linhas: [
          ['Saúde', 'Ministério da Saúde, secretarias de saúde, profissionais de saúde'],
          ['Serviços públicos', 'Sites terminados em **.gov.br**'],
          ['Notícias', 'Jornais e portais conhecidos; compare mais de um'],
          ['Boatos', 'Agências de checagem de fatos (fact-checking)'],
        ] } },
        { destaque: { tom: 'saiba', titulo: 'Agências de checagem', texto: 'Existem sites especializados em verificar boatos. Pesquise o título da notícia junto com a palavra **checagem** ou **fake**.' } },
      ] },
      { id: 'p5', titulo: 'Inteligência artificial e pesquisa', blocos: [
        { p: 'Hoje existem **assistentes de inteligência artificial** [[robo]] que respondem perguntas conversando, e o próprio Google às vezes mostra um resumo feito por IA.' },
        { lista: [
          'Eles ajudam a **entender** um assunto e a **resumir** textos.',
          'Mas podem **errar** com muita confiança.',
          'Para saúde, dinheiro e leis, **confirme** sempre em fontes oficiais.',
          'Não coloque dados pessoais sensíveis (senhas, documentos) nessas ferramentas.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Regra de ouro', texto: 'Na dúvida, **não compartilhe**. Uma informação falsa espalhada pode prejudicar muita gente.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Para procurar uma frase exata, coloque-a entre:', ['Aspas', 'Parênteses', 'Asteriscos', 'Colchetes'], 0, 'As aspas procuram a frase exata.'),
      Q('p1', 'Para pesquisar só em sites do governo, use:', ['site:gov.br', '-gov', '"gov"', 'filetype:gov'], 0, 'O site: limita a pesquisa a um site ou tipo de site.'),
      Q('p2', 'Onde ficam os filtros de data no Google?', ['Em Ferramentas, abaixo da caixa de pesquisa', 'No menu Iniciar', 'Nos favoritos', 'No histórico'], 0, 'Clique em Ferramentas para filtrar por data.'),
      Q('p2', 'Por que filtrar por data?', ['Para ver só informações recentes', 'Para apagar resultados', 'Para pesquisar mais devagar', 'Não serve para nada'], 0, 'Notícias, preços e leis mudam com o tempo.'),
      Q('p3', 'Qual é um sinal de alerta de notícia falsa?', ['Título exagerado, como “COMPARTILHE ANTES QUE APAGUEM”', 'Data e autor claros', 'Publicada em jornal conhecido', 'Confirmada por outras fontes'], 0, 'Títulos exagerados e apelos emocionais são sinais de alerta.'),
      Q('p3', 'Antes de compartilhar uma notícia, você deve:', ['Verificar quem publicou e se outras fontes confirmam', 'Compartilhar rápido', 'Mudar o título', 'Acrescentar emojis'], 0, 'Verificar evita espalhar boatos.'),
      Q('p4', 'Onde confirmar uma informação sobre saúde?', ['Em órgãos oficiais e profissionais de saúde', 'Em correntes de mensagens', 'Em comentários de vídeos', 'Em qualquer site'], 0, 'Fontes oficiais de saúde são as mais confiáveis.'),
      Q('p4', 'O que fazem as agências de checagem?', ['Verificam se boatos e notícias são verdadeiros', 'Vendem internet', 'Fazem propaganda', 'Criam vírus'], 0, 'Elas investigam e explicam se a informação é verdadeira.'),
      Q('p5', 'Sobre os assistentes de inteligência artificial, é correto dizer:', ['Ajudam, mas podem errar; confirme o que é importante', 'Nunca erram', 'Substituem os médicos', 'São sempre fontes oficiais'], 0, 'A IA pode errar com confiança: confirme em fontes oficiais.'),
      Q('p5', 'Qual a regra de ouro na dúvida sobre uma informação?', ['Não compartilhar', 'Compartilhar com todos', 'Apagar o celular', 'Acreditar'], 0, 'Na dúvida, não compartilhe.'),
    ],
  };

  C['d5-a07'] = {
    titulo: 'Criando uma conta de e-mail',
    subtitulo: 'O que é e-mail, como é um endereço e o passo a passo para criar uma conta no Gmail.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é e-mail', blocos: [
        { p: '**E-mail** (correio eletrônico) [[email]] é uma carta digital: você escreve, envia e ela chega em segundos na caixa de entrada da outra pessoa, em qualquer lugar do mundo.' },
        { fig: 'email', legenda: 'A mensagem sai de um endereço e chega em outro.' },
        { p: 'Mesmo com o WhatsApp, o e-mail continua essencial: **cadastros**, **vagas de emprego**, **bancos**, **escolas** e serviços do governo pedem um e-mail.' },
      ] },
      { id: 'p2', titulo: 'Como é um endereço de e-mail', blocos: [
        { exemplo: { titulo: 'Endereço de e-mail', linhas: ['maria.silva@gmail.com'] } },
        { tabela: { cab: ['Parte', 'Exemplo', 'Significa'], linhas: [
          ['Nome de usuário', 'maria.silva', 'Escolhido por você'],
          ['Arroba', '@', 'Separa o usuário do provedor; lê-se “arroba”'],
          ['Provedor', 'gmail.com', 'A empresa do e-mail'],
        ] } },
        { lista: [
          'Não tem **espaço** nem **acento**.',
          'Costuma ser escrito em **minúsculas**.',
          'O **@** fica no {{Shift+2}} do teclado [[arroba]].',
        ] },
      ] },
      { id: 'p3', titulo: 'Os serviços de e-mail', blocos: [
        { tabela: { cab: ['Serviço', 'Endereço termina em', 'Vantagem'], linhas: [
          ['Gmail (Google)', '@gmail.com', 'A mesma conta serve para o Android, YouTube e Google Drive'],
          ['Outlook (Microsoft)', '@outlook.com ou @hotmail.com', 'A mesma conta serve para o Windows e o Word on-line'],
          ['iCloud (Apple)', '@icloud.com', 'Integrado ao iPhone'],
        ] } },
        { p: 'Todos são **gratuitos**. Se você tem um celular Android, provavelmente já tem uma conta Google, ou seja, já tem um Gmail!' },
      ] },
      { id: 'p4', titulo: 'Criando uma conta no Gmail', blocos: [
        { passos: [
          'Acesse **gmail.com** e clique em **Criar conta** > **Para uso pessoal**.',
          'Digite seu **nome** e **sobrenome**.',
          'Informe a **data de nascimento** e o **gênero**.',
          'Escolha um **endereço**: o Google sugere alguns ou você cria o seu.',
          'Crie uma **senha forte** e confirme.',
          'Adicione um **telefone** e um **e-mail de recuperação** (para recuperar a conta se esquecer a senha).',
          'Leia e aceite os **termos**. Pronto!',
        ] },
        { destaque: { tom: 'dica', titulo: 'Um endereço profissional', texto: 'Use o seu nome: **joao.santos**, **mariasouza.ce**. Evite apelidos como “gatinha_linda22”: este endereço vai num currículo.' } },
      ] },
      { id: 'p5', titulo: 'Cuidando da sua conta', blocos: [
        { checklist: [
          '**Anote** o endereço e guarde a senha num lugar seguro.',
          'Mantenha o **telefone de recuperação** atualizado.',
          'Ative a **verificação em duas etapas** (você vai aprender na disciplina de Segurança).',
          'Num computador que não é seu, clique em **Sair** quando terminar.',
          'Nunca informe a sua senha para ninguém, nem para quem diz ser do Google.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'O Google não pede sua senha', texto: 'Nenhuma empresa séria pede a sua senha por e-mail, mensagem ou telefone. Quem pede é golpista.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é e-mail?', ['Uma carta digital enviada pela internet', 'Um site de vídeos', 'Um tipo de vírus', 'Uma rede Wi-Fi'], 0, 'E-mail é o correio eletrônico.'),
      Q('p1', 'Por que o e-mail ainda é importante?', ['Cadastros, vagas, bancos e serviços pedem um e-mail', 'Porque substitui o computador', 'Porque é pago', 'Não é mais importante'], 0, 'Muitos serviços exigem um endereço de e-mail.'),
      Q('p2', 'Em maria.silva@gmail.com, qual parte é o provedor?', ['gmail.com', 'maria.silva', '@', 'silva'], 0, 'Depois do @ vem o provedor.'),
      Q('p2', 'Como fazer o @ no teclado ABNT2?', ['Shift + 2', 'Ctrl + A', 'Alt + 2', 'Shift + A'], 0, 'O arroba fica no Shift + 2.'),
      Q('p3', 'Um endereço que termina em @hotmail.com é de qual empresa?', ['Microsoft', 'Google', 'Apple', 'Samsung'], 0, 'Hotmail e Outlook são da Microsoft.'),
      Q('p3', 'Quem tem celular Android provavelmente já tem:', ['Uma conta Google (Gmail)', 'Uma conta de banco', 'O Word', 'Um site'], 0, 'O Android usa uma conta Google, que inclui o Gmail.'),
      Q('p4', 'Para que serve o telefone de recuperação?', ['Recuperar a conta se você esquecer a senha', 'Receber propagandas', 'Fazer ligações grátis', 'Deixar o e-mail mais rápido'], 0, 'Ele ajuda a provar que a conta é sua.'),
      Q('p4', 'Qual destes é um bom endereço para usar num currículo?', ['joao.santos@gmail.com', 'gatinha_linda22@gmail.com', 'reidafesta@gmail.com', 'xyz123@gmail.com'], 0, 'Use o seu nome: fica profissional.'),
      Q('p5', 'Alguém dizendo ser do Google pede a sua senha. O que fazer?', ['Não informar: é golpe', 'Informar rápido', 'Mandar por e-mail', 'Postar nas redes'], 0, 'Empresas sérias nunca pedem a sua senha.'),
      Q('p5', 'O que fazer ao terminar de usar o e-mail num computador que não é seu?', ['Clicar em Sair', 'Deixar aberto', 'Desligar o monitor', 'Trocar o papel de parede'], 0, 'Sair da conta impede que outra pessoa use o seu e-mail.'),
    ],
  };

  C['d5-a08'] = {
    titulo: 'Usando o e-mail no dia a dia',
    subtitulo: 'Escrever, responder, encaminhar, anexar arquivos e manter a caixa de entrada organizada.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'A caixa de entrada', blocos: [
        { p: 'Ao abrir o e-mail, você vê a **Caixa de entrada**: a lista de mensagens recebidas. As **não lidas** aparecem em **negrito**.' },
        { tabela: { cab: ['Pasta', 'O que guarda'], linhas: [
          ['Caixa de entrada', 'As mensagens recebidas'],
          ['Enviados', 'As mensagens que você mandou'],
          ['Rascunhos', 'Mensagens começadas e não enviadas'],
          ['Spam', 'Mensagens suspeitas ou propaganda indesejada'],
          ['Lixeira', 'Mensagens apagadas (somem depois de 30 dias)'],
        ] } },
      ] },
      { id: 'p2', titulo: 'Escrevendo uma mensagem', blocos: [
        { passos: [
          'Clique em **Escrever** (ou **Nova mensagem**).',
          'Em **Para**, digite o endereço de quem vai receber.',
          'Em **Assunto**, escreva um resumo curto: “Currículo — Vaga de Recepcionista”.',
          'No **corpo**, escreva a mensagem.',
          'Clique em **Enviar** [[seta]].',
        ] },
        { lista: [
          '**Cc** (com cópia): outras pessoas que devem ver a mensagem.',
          '**Cco** (com cópia oculta): recebem, mas os outros não veem que elas receberam. Bom para mandar para muita gente sem mostrar os endereços.',
        ] },
      ] },
      { id: 'p3', titulo: 'Responder e encaminhar', blocos: [
        { tabela: { cab: ['Botão', 'O que faz'], linhas: [
          ['Responder', 'Responde só para quem mandou'],
          ['Responder a todos', 'Responde para quem mandou e para todos que receberam'],
          ['Encaminhar', 'Manda a mensagem para outra pessoa'],
        ] } },
        { destaque: { tom: 'atencao', titulo: 'Cuidado com o “Responder a todos”', texto: 'Numa mensagem enviada para a turma inteira, “Responder a todos” manda a sua resposta para todo mundo. Use só quando todos precisam ler.' } },
      ] },
      { id: 'p4', titulo: 'Anexos', blocos: [
        { p: '**Anexo** é um arquivo que vai junto com a mensagem: um currículo, uma foto, um documento. O botão tem o desenho de um **clipe de papel** [[link]].' },
        { passos: [
          'Na mensagem nova, clique no **clipe**.',
          'Escolha o arquivo no computador (por exemplo, **curriculo.pdf**) e clique em **Abrir**.',
          'Espere a barrinha de envio terminar e clique em **Enviar**.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Arquivos grandes', texto: 'O Gmail aceita anexos de até **25 MB**. Para arquivos maiores, ele envia um **link do Google Drive** automaticamente.' } },
        { destaque: { tom: 'atencao', titulo: 'Anexos suspeitos', texto: 'Não abra anexos inesperados, mesmo de conhecidos, principalmente **.exe**, **.zip** ou arquivos que pedem para “ativar macros”.' } },
      ] },
      { id: 'p5', titulo: 'Organização e boas maneiras', blocos: [
        { lista: [
          '**Arquivar:** tira da caixa de entrada sem apagar.',
          '**Estrela:** marca mensagens importantes.',
          '**Marcadores ou pastas:** organizam por assunto (Trabalho, Curso, Contas).',
          '**Pesquisar:** a caixa de busca no alto encontra qualquer mensagem.',
          '**Denunciar spam:** manda propagandas e golpes para a pasta Spam.',
        ] },
        { exemplo: { titulo: 'Modelo de e-mail formal', linhas: ['Assunto: Currículo — Vaga de Auxiliar Administrativo', 'Prezados, bom dia.', 'Envio em anexo o meu currículo para a vaga de Auxiliar Administrativo.', 'Fico à disposição para uma entrevista.', 'Atenciosamente,', 'João Santos — (85) 9 9999-9999'] } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Como aparecem as mensagens não lidas na caixa de entrada?', ['Em negrito', 'Em vermelho', 'Riscadas', 'Escondidas'], 0, 'Mensagens não lidas ficam em negrito.'),
      Q('p1', 'Qual pasta guarda as mensagens suspeitas e propagandas indesejadas?', ['Spam', 'Enviados', 'Rascunhos', 'Caixa de entrada'], 0, 'A pasta Spam recebe mensagens suspeitas.'),
      Q('p2', 'O que escrever no campo Assunto?', ['Um resumo curto da mensagem', 'A senha', 'O endereço de quem recebe', 'Nada'], 0, 'O assunto resume do que se trata a mensagem.'),
      Q('p2', 'O que faz o campo Cco?', ['Envia uma cópia sem que os outros vejam quem recebeu', 'Apaga a mensagem', 'Anexa arquivos', 'Corrige a ortografia'], 0, 'Cco é a cópia oculta.'),
      Q('p3', 'O que faz o botão Encaminhar?', ['Manda a mensagem recebida para outra pessoa', 'Responde a quem mandou', 'Apaga a mensagem', 'Marca como lida'], 0, 'Encaminhar envia a mensagem para outra pessoa.'),
      Q('p3', 'Quando usar “Responder a todos”?', ['Quando todos que receberam precisam ler a resposta', 'Sempre', 'Nunca', 'Só para spam'], 0, 'Use só quando a resposta interessa a todos.'),
      Q('p4', 'Qual o desenho do botão de anexar?', ['Um clipe de papel', 'Uma lixeira', 'Uma estrela', 'Uma lupa'], 0, 'O clipe anexa arquivos.'),
      Q('p4', 'Qual o limite de anexo no Gmail?', ['25 MB', '1 MB', '1 TB', 'Não tem limite'], 0, 'Até 25 MB; acima disso, o Gmail usa o Google Drive.'),
      Q('p5', 'O que faz “Arquivar” uma mensagem?', ['Tira da caixa de entrada sem apagar', 'Apaga para sempre', 'Envia de novo', 'Imprime'], 0, 'Arquivar guarda a mensagem fora da caixa de entrada.'),
      Q('p5', 'Como encontrar uma mensagem antiga?', ['Usando a caixa de pesquisa do e-mail', 'Esvaziando a lixeira', 'Criando outra conta', 'Não é possível'], 0, 'A pesquisa encontra mensagens por palavras, nomes ou datas.'),
    ],
  };

  C['d5-a09'] = {
    titulo: 'Cuidados de segurança na internet',
    subtitulo: 'Golpes comuns, downloads, compras on-line, Wi-Fi público e como proteger os seus dados.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'A internet tem riscos', blocos: [
        { p: 'Assim como na rua, na internet existem pessoas mal-intencionadas. A boa notícia: com alguns cuidados, você evita a maioria dos problemas [[escudo]].' },
        { cards: [
          { ico: 'anzol', t: 'Golpes', d: 'Mensagens falsas para roubar dados e dinheiro.' },
          { ico: 'virus', t: 'Vírus', d: 'Programas que estragam ou espionam o aparelho.' },
          { ico: 'olho', t: 'Exposição', d: 'Dados pessoais que caem em mãos erradas.' },
        ] },
      ] },
      { id: 'p2', titulo: 'Golpes mais comuns', blocos: [
        { fig: 'phishing', legenda: 'O phishing: uma isca para você clicar e entregar os seus dados.' },
        { lista: [
          '**Phishing:** e-mail ou mensagem que imita banco ou loja e pede para clicar num link e “atualizar dados”.',
          '**Prêmio falso:** “Você ganhou! Pague a taxa para receber.”',
          '**Falsa central do banco:** ligação pedindo senha, código ou para instalar um aplicativo.',
          '**Boleto falso:** boleto com dados trocados, que manda o dinheiro para o golpista.',
          '**Loja falsa:** preços bons demais para ser verdade, só com pagamento via Pix.',
        ] },
      ] },
      { id: 'p3', titulo: 'Como se proteger', blocos: [
        { checklist: [
          '**Desconfie da pressa:** golpes sempre dizem que é urgente.',
          '**Não clique** em links de mensagens inesperadas. Digite você mesmo o endereço do site.',
          '**Nunca informe** senhas, códigos recebidos por SMS ou dados do cartão.',
          '**Confira** o cadeado e o endereço do site antes de digitar dados.',
          '**Na dúvida**, ligue para o número oficial que está no seu cartão ou no site da empresa.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Código por SMS', texto: 'O código de 6 números que chega por SMS é como uma chave da sua conta. **Ninguém** de verdade vai pedir esse código para você.' } },
      ] },
      { id: 'p4', titulo: 'Compras e downloads seguros', blocos: [
        { h: 'Compras' },
        { lista: [
          'Prefira lojas conhecidas e confira as avaliações em sites de reclamação.',
          'Desconfie de preços muito abaixo do normal.',
          'Prefira cartão (ou cartão virtual) a Pix em lojas desconhecidas.',
        ] },
        { h: 'Downloads' },
        { lista: [
          'Baixe programas só de sites oficiais e lojas de aplicativos.',
          'Evite programas “crackeados” ou piratas: são a porta de entrada de vírus.',
          'Mantenha o antivírus ligado [[escudo]].',
        ] },
      ] },
      { id: 'p5', titulo: 'Seus dados pessoais', blocos: [
        { p: 'Seus **dados pessoais** (CPF, RG, endereço, telefone, fotos de documentos) valem muito para golpistas. No Brasil, a **LGPD** (Lei Geral de Proteção de Dados) obriga empresas a cuidar deles, mas o primeiro cuidado é seu.' },
        { checklist: [
          'Não publique fotos de documentos, cartões ou boletos.',
          'Pense antes de preencher cadastros em sites desconhecidos.',
          'Não use a mesma senha em todos os lugares.',
          'Mantenha o celular com senha ou digital.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Para aprofundar', texto: 'A disciplina **Segurança Digital** vai falar de antivírus, senhas fortes, verificação em duas etapas e muito mais.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Com alguns cuidados na internet, é possível:', ['Evitar a maioria dos problemas', 'Nunca mais precisar de senha', 'Ficar invisível', 'Desligar os vírus do mundo'], 0, 'Bons hábitos evitam a maioria dos golpes.'),
      Q('p1', 'Mensagens falsas para roubar dados e dinheiro são:', ['Golpes', 'Atualizações', 'Favoritos', 'Downloads'], 0, 'Golpes usam mensagens falsas.'),
      Q('p2', 'O que é phishing?', ['Mensagem que imita uma empresa para roubar seus dados', 'Um tipo de pesca esportiva', 'Um navegador', 'Um antivírus'], 0, 'Phishing é a “pescaria” de dados com mensagens falsas.'),
      Q('p2', '“Você ganhou um prêmio! Pague a taxa para receber.” Isso é:', ['Um golpe', 'Um prêmio de verdade', 'Uma atualização', 'Um e-mail do governo'], 0, 'Prêmios de verdade não cobram taxa para entregar.'),
      Q('p3', 'Qual atitude protege contra golpes?', ['Digitar você mesmo o endereço do site, em vez de clicar no link', 'Clicar rápido para não perder a oferta', 'Informar o código do SMS', 'Mandar foto do cartão'], 0, 'Digitar o endereço evita sites falsos.'),
      Q('p3', 'Alguém pede o código de 6 números que chegou no seu SMS. O que fazer?', ['Não informar', 'Informar', 'Postar nas redes', 'Mandar por e-mail'], 0, 'Esse código é uma chave da sua conta: nunca informe.'),
      Q('p4', 'Uma loja desconhecida vende um celular pela metade do preço, só no Pix. Isso é:', ['Sinal de golpe', 'Uma ótima oportunidade', 'Normal', 'Obrigatório'], 0, 'Preço bom demais e só Pix são sinais de golpe.'),
      Q('p4', 'Por que evitar programas piratas?', ['Costumam trazer vírus', 'São mais rápidos', 'São do governo', 'Não ocupam espaço'], 0, 'Programas piratas são porta de entrada de vírus.'),
      Q('p5', 'Qual lei protege os dados pessoais no Brasil?', ['LGPD', 'CLT', 'ECA', 'CNH'], 0, 'A LGPD é a Lei Geral de Proteção de Dados.'),
      Q('p5', 'O que NÃO se deve publicar nas redes?', ['Fotos de documentos e cartões', 'Foto de uma paisagem', 'Uma receita', 'Uma mensagem de bom dia'], 0, 'Documentos e cartões podem ser usados em golpes.'),
    ],
  };

  C['d5-av'] = {
    titulo: 'Avaliação: Internet e Navegadores',
    subtitulo: '30 perguntas sobre as Aulas 01 a 09. Não há material para consultar: responda com o que você aprendeu.',
    avaliacao: { aulas: ['d5-a01', 'd5-a02', 'd5-a03', 'd5-a04', 'd5-a05', 'd5-a06', 'd5-a07', 'd5-a08', 'd5-a09'] },
  };
})();
