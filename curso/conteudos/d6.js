/* =========================================================
   DISCIPLINA 6 — REDES SOCIAIS E COMUNICAÇÃO DIGITAL (curso "Informática do zero")
   Aulas 01 a 09 + Aula 10 (avaliação). Formato dos blocos: veja curso/conteudos/d1.js.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
(() => {
  const C = window.HC_CONTEUDOS;
  const Q = (parte, q, op, certa, exp) => ({ parte, q, op, certa, exp });

  C['d6-a01'] = {
    titulo: 'O que são redes sociais?',
    subtitulo: 'Como as redes sociais funcionam, as mais usadas no Brasil e para que cada uma serve.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'Pessoas conectadas', blocos: [
        { p: '**Redes sociais** [[grupo]] são sites e aplicativos onde as pessoas criam um **perfil**, se conectam com amigos, família e empresas, e compartilham mensagens, fotos, vídeos e opiniões.' },
        { fig: 'redes', legenda: 'Cada pessoa é um ponto da rede, ligada a muitas outras.' },
        { p: 'O nome vem da ideia de uma **rede**: cada pessoa se liga a outras, que se ligam a outras, e uma publicação pode chegar muito longe.' },
      ] },
      { id: 'p2', titulo: 'As mais usadas', blocos: [
        { tabela: { cab: ['Rede', 'Para que serve mais'], linhas: [
          ['WhatsApp', 'Mensagens, áudios, chamadas e grupos'],
          ['Instagram', 'Fotos, vídeos curtos (reels) e stories'],
          ['Facebook', 'Amigos, grupos, páginas e Marketplace'],
          ['YouTube', 'Vídeos de todos os tipos'],
          ['TikTok', 'Vídeos curtos e virais'],
          ['LinkedIn', 'Rede profissional: currículo e vagas'],
        ] } },
        { destaque: { tom: 'saiba', titulo: 'Gratuitas?', texto: 'As redes sociais são gratuitas para usar porque ganham dinheiro com **propaganda**. Por isso elas observam o que você curte, para mostrar anúncios do seu interesse.' } },
      ] },
      { id: 'p3', titulo: 'As palavras das redes', blocos: [
        { tabela: { cab: ['Palavra', 'Significado'], linhas: [
          ['Perfil', 'A sua página, com foto e informações'],
          ['Feed', 'A lista de publicações que aparece ao abrir o aplicativo'],
          ['Postar / publicar', 'Colocar uma foto, vídeo ou texto na rede'],
          ['Curtir', 'Mostrar que gostou ([[coracao]] ou [[curtir]])'],
          ['Comentar', 'Escrever uma resposta numa publicação'],
          ['Compartilhar', 'Espalhar a publicação de outra pessoa'],
          ['Seguidor', 'Quem acompanha as suas publicações'],
          ['Hashtag (#)', 'Uma palavra com # que agrupa publicações do mesmo assunto'],
        ] } },
      ] },
      { id: 'p4', titulo: 'Coisas boas das redes', blocos: [
        { cards: [
          { ico: 'coracao', t: 'Aproximar', d: 'Falar com quem mora longe.' },
          { ico: 'livro', t: 'Aprender', d: 'Vídeos e perfis educativos.' },
          { ico: 'sacola', t: 'Negócios', d: 'Divulgar e vender produtos e serviços.' },
          { ico: 'usuario', t: 'Emprego', d: 'Encontrar vagas e mostrar o seu trabalho.' },
        ] },
      ] },
      { id: 'p5', titulo: 'E os cuidados', blocos: [
        { p: 'As redes também trazem riscos. Nas próximas aulas vamos aprender a lidar com cada um:' },
        { checklist: [
          '**Privacidade:** quem vê o que você publica.',
          '**Golpes:** perfis falsos e mensagens enganosas.',
          '**Notícias falsas:** informações mentirosas que se espalham rápido.',
          '**Tempo de tela:** usar demais e esquecer o mundo fora da tela.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Idade mínima', texto: 'A maioria das redes exige **13 anos** ou mais. Crianças devem usar com acompanhamento de um adulto.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que são redes sociais?', ['Sites e aplicativos onde as pessoas se conectam e compartilham conteúdos', 'Cabos de internet', 'Programas de planilha', 'Antivírus'], 0, 'Redes sociais conectam pessoas para compartilhar conteúdos.'),
      Q('p1', 'Por que uma publicação pode chegar muito longe?', ['Porque cada pessoa se liga a outras, que se ligam a outras', 'Porque é impressa', 'Porque vai pelo correio', 'Não pode'], 0, 'A rede espalha a publicação de pessoa em pessoa.'),
      Q('p2', 'Qual rede social é focada em vida profissional, currículo e vagas?', ['LinkedIn', 'TikTok', 'Instagram', 'YouTube'], 0, 'O LinkedIn é a rede profissional.'),
      Q('p2', 'Como as redes sociais ganham dinheiro, sendo gratuitas?', ['Com propaganda', 'Cobrando de cada curtida', 'Vendendo celulares', 'Não ganham'], 0, 'As redes vivem de anúncios.'),
      Q('p3', 'O que é o feed?', ['A lista de publicações que aparece ao abrir o aplicativo', 'A senha', 'O perfil de uma empresa', 'Um vírus'], 0, 'O feed é a sequência de publicações.'),
      Q('p3', 'Para que serve uma hashtag (#)?', ['Agrupar publicações do mesmo assunto', 'Apagar uma publicação', 'Bloquear alguém', 'Mudar a senha'], 0, 'A hashtag reúne publicações de um tema.'),
      Q('p4', 'Qual é um ponto positivo das redes sociais?', ['Aproximar pessoas que moram longe', 'Substituir o sono', 'Dispensar o estudo', 'Divulgar senhas'], 0, 'As redes ajudam a manter contato com quem está longe.'),
      Q('p4', 'Como as redes podem ajudar no trabalho?', ['Divulgando produtos e encontrando vagas', 'Pagando salários', 'Imprimindo documentos', 'Não ajudam'], 0, 'Muitos negócios e vagas estão nas redes.'),
      Q('p5', 'Qual a idade mínima mais comum para usar as redes sociais?', ['13 anos', '5 anos', '30 anos', 'Não existe'], 0, 'A maioria das redes exige 13 anos ou mais.'),
      Q('p5', 'Qual destes é um risco das redes sociais?', ['Notícias falsas', 'Aprender coisas novas', 'Falar com a família', 'Encontrar vagas'], 0, 'Notícias falsas se espalham rápido nas redes.'),
    ],
  };

  C['d6-a02'] = {
    titulo: 'Comunicação digital e boas maneiras',
    subtitulo: 'Netiqueta: como escrever, responder e se comportar bem no mundo digital, em mensagens pessoais e profissionais.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'O que é netiqueta', blocos: [
        { p: '**Netiqueta** é a junção de **net** (rede) com **etiqueta** (boas maneiras): são as regras de **educação** na internet. Do outro lado da tela sempre há uma **pessoa** de verdade.' },
        { destaque: { tom: 'dica', titulo: 'A regra principal', texto: 'Antes de enviar, pergunte: “Eu diria isso olhando nos olhos da pessoa?”. Se a resposta for não, não envie.' } },
      ] },
      { id: 'p2', titulo: 'O tom da escrita', blocos: [
        { p: 'Na mensagem escrita, a pessoa não vê o seu rosto nem ouve o seu tom de voz. Por isso, algumas coisas mudam:' },
        { tabela: { cab: ['Na escrita', 'Pode parecer'], linhas: [
          ['TUDO EM MAIÚSCULAS', 'Que você está **gritando**'],
          ['“Ok.” seco', 'Que você está chateado'],
          ['Muitos !!!!!', 'Exagero ou irritação'],
          ['Emojis 🙂', 'Ajudam a mostrar o tom, em conversas informais'],
        ] } },
      ] },
      { id: 'p3', titulo: 'Mensagens pessoais e profissionais', blocos: [
        { compara: {
          a: { t: 'Com amigos e família', ico: 'chat', itens: ['Linguagem informal', 'Emojis e figurinhas', 'Áudios à vontade'] },
          b: { t: 'Com trabalho, escola e empresas', ico: 'usuario', itens: ['Cumprimente: “Bom dia, tudo bem?”', 'Escreva completo, sem abreviações (“vc”, “tb”)', 'Revise antes de enviar', 'Respeite o horário: evite mensagens tarde da noite'] },
        } },
      ] },
      { id: 'p4', titulo: 'Áudios, grupos e horários', blocos: [
        { checklist: [
          '**Áudios longos:** prefira mensagens curtas ou divida o assunto. Nem todo mundo pode ouvir na hora.',
          '**Grupos:** fale do assunto do grupo e evite correntes e propagandas.',
          '**Horários:** mensagens de trabalho em horário comercial.',
          '**Visualizou e não respondeu?** A pessoa pode estar ocupada. Tenha paciência.',
          '**Ligações:** em contato profissional, mande uma mensagem antes perguntando se pode ligar.',
        ] },
      ] },
      { id: 'p5', titulo: 'Respeito e empatia', blocos: [
        { p: 'Discordar é normal; ofender, não. Nas discussões on-line:' },
        { lista: [
          'Critique **ideias**, não **pessoas**.',
          'Não espalhe fotos ou conversas de outras pessoas sem permissão.',
          'Evite comentar quando estiver com raiva: respire e volte depois.',
          'Lembre que o que é escrito pode ser **printado** e guardado para sempre.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Ofensa na internet é crime', texto: 'Calúnia, injúria, ameaça e discriminação continuam sendo crimes quando feitos pela internet.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é netiqueta?', ['As regras de boas maneiras na internet', 'Um tipo de rede Wi-Fi', 'Uma etiqueta de preço', 'Um aplicativo'], 0, 'Netiqueta = net (rede) + etiqueta (boas maneiras).'),
      Q('p1', 'Qual a pergunta a fazer antes de enviar uma mensagem?', ['Eu diria isso olhando nos olhos da pessoa?', 'Quantas curtidas vai ter?', 'Está em maiúsculas?', 'Tem emoji?'], 0, 'Do outro lado há uma pessoa de verdade.'),
      Q('p2', 'Escrever TUDO EM MAIÚSCULAS pode parecer:', ['Que você está gritando', 'Educado', 'Profissional', 'Engraçado'], 0, 'Maiúsculas na internet passam a ideia de grito.'),
      Q('p2', 'Por que a mensagem escrita pode ser mal entendida?', ['Porque a pessoa não vê o seu rosto nem ouve o tom de voz', 'Porque o celular traduz', 'Porque some sozinha', 'Não pode ser mal entendida'], 0, 'Sem tom de voz, a interpretação fica mais difícil.'),
      Q('p3', 'Numa mensagem para uma empresa, é adequado:', ['Cumprimentar e escrever sem abreviações', 'Usar “vc” e “tb”', 'Mandar só figurinhas', 'Escrever tudo em maiúsculas'], 0, 'Mensagens profissionais pedem linguagem completa e educada.'),
      Q('p3', 'Qual o melhor horário para mensagens de trabalho?', ['Horário comercial', 'Madrugada', 'Qualquer hora', 'Domingo à noite'], 0, 'Respeite o horário de descanso das pessoas.'),
      Q('p4', 'O que evitar nos grupos?', ['Correntes e propagandas fora do assunto', 'Falar do assunto do grupo', 'Cumprimentar', 'Responder perguntas'], 0, 'Grupos funcionam melhor quando se fala do assunto deles.'),
      Q('p4', 'Antes de ligar para um contato profissional, é educado:', ['Mandar uma mensagem perguntando se pode ligar', 'Ligar várias vezes seguidas', 'Mandar áudio de 10 minutos', 'Ligar de madrugada'], 0, 'Perguntar antes respeita o tempo da pessoa.'),
      Q('p5', 'Numa discussão on-line, o certo é:', ['Criticar ideias, não pessoas', 'Ofender quem discorda', 'Espalhar prints', 'Escrever em maiúsculas'], 0, 'Discordar com respeito é o caminho.'),
      Q('p5', 'Ofensas e ameaças feitas pela internet:', ['Continuam sendo crimes', 'São permitidas', 'Somem sozinhas', 'Não têm consequência'], 0, 'Crimes como injúria e ameaça valem também on-line.'),
    ],
  };

  C['d6-a03'] = {
    titulo: 'WhatsApp: primeiros passos',
    subtitulo: 'Instalar, criar o perfil, conversar, mandar áudio e foto e fazer chamadas de voz e de vídeo.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Instalando o WhatsApp', blocos: [
        { p: 'O **WhatsApp** [[chat]] é o aplicativo de mensagens mais usado no Brasil. Ele usa a **internet** para enviar mensagens, áudios, fotos e fazer ligações.' },
        { passos: [
          'Abra a **Play Store** (Android) ou a **App Store** (iPhone).',
          'Pesquise **WhatsApp** e confira se o desenvolvedor é **WhatsApp LLC**.',
          'Toque em **Instalar** e depois em **Abrir**.',
          'Informe o seu **número de celular** e digite o **código** que chega por SMS.',
          'Coloque o seu **nome** e uma **foto de perfil**.',
        ] },
      ] },
      { id: 'p2', titulo: 'A tela do WhatsApp', blocos: [
        { fig: 'conversa', legenda: 'Uma conversa: as suas mensagens de um lado, as respostas do outro.' },
        { tabela: { cab: ['Aba', 'O que tem'], linhas: [
          ['Conversas', 'A lista de conversas, as mais recentes em cima'],
          ['Atualizações', 'Os status e canais'],
          ['Comunidades', 'Grupos reunidos por assunto'],
          ['Ligações', 'O histórico de chamadas'],
        ] } },
      ] },
      { id: 'p3', titulo: 'Conversando', blocos: [
        { passos: [
          'Toque no botão de **nova conversa** (o balãozinho com +).',
          'Escolha o contato da sua agenda.',
          'Escreva na caixa de texto e toque na **setinha** para enviar.',
        ] },
        { tabela: { cab: ['Sinal', 'Significa'], linhas: [
          ['✓ (um tique cinza)', 'Mensagem enviada'],
          ['✓✓ (dois tiques cinza)', 'Mensagem entregue no celular da pessoa'],
          ['✓✓ (dois tiques azuis)', 'Mensagem lida'],
        ] } },
      ] },
      { id: 'p4', titulo: 'Áudios, fotos e documentos', blocos: [
        { lista: [
          '**Áudio** [[microfone]]: segure o botão do microfone, fale e solte para enviar. Deslize para cima para gravar sem segurar.',
          '**Foto** [[camera]]: toque na câmera para tirar na hora, ou no clipe [[link]] > **Galeria** para escolher uma.',
          '**Documento:** clipe > **Documento** para mandar um PDF, como um currículo.',
          '**Localização** [[local]]: clipe > **Localização** para mostrar onde você está.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Fotos em alta qualidade', texto: 'Para mandar a foto de um documento legível, use a opção **HD** antes de enviar, ou envie como **Documento**.' } },
      ] },
      { id: 'p5', titulo: 'Chamadas de voz e vídeo', blocos: [
        { p: 'Dentro da conversa, no alto da tela, ficam os ícones do **telefone** [[telefone]] (chamada de voz) e da **câmera** [[video]] (chamada de vídeo).' },
        { lista: [
          'As chamadas usam a **internet**: no Wi-Fi não gastam os seus dados móveis.',
          'Dá para fazer chamadas em **grupo**, com várias pessoas.',
          'Durante a chamada de vídeo, toque no ícone de virar para trocar entre a câmera da frente e a de trás.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Código de verificação', texto: 'O código de 6 números que o WhatsApp manda por SMS **nunca** deve ser passado para ninguém. Com ele, o golpista rouba a sua conta.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O WhatsApp usa o quê para enviar mensagens e fazer ligações?', ['A internet', 'O correio', 'O rádio AM', 'O cabo da TV'], 0, 'O WhatsApp funciona pela internet.'),
      Q('p1', 'Onde instalar o WhatsApp com segurança?', ['Na Play Store ou na App Store', 'Em qualquer link de mensagem', 'Num site desconhecido', 'Num anúncio piscando'], 0, 'Use sempre a loja oficial de aplicativos.'),
      Q('p2', 'Na aba Conversas, onde ficam as conversas mais recentes?', ['Em cima', 'Embaixo', 'Escondidas', 'Na aba Ligações'], 0, 'As conversas mais recentes aparecem no topo.'),
      Q('p2', 'Em qual aba fica o histórico de chamadas?', ['Ligações', 'Comunidades', 'Atualizações', 'Configurações'], 0, 'A aba Ligações mostra as chamadas.'),
      Q('p3', 'O que significam dois tiques azuis?', ['Que a mensagem foi lida', 'Que não foi enviada', 'Que deu erro', 'Que é um áudio'], 0, 'Tiques azuis indicam mensagem lida.'),
      Q('p3', 'Um tique cinza significa:', ['Mensagem enviada', 'Mensagem lida', 'Mensagem apagada', 'Chamada perdida'], 0, 'Um tique: enviada; dois cinza: entregue; dois azuis: lida.'),
      Q('p4', 'Como mandar um currículo em PDF pelo WhatsApp?', ['Clipe > Documento', 'Pelo microfone', 'Pelo status', 'Não é possível'], 0, 'O clipe permite enviar documentos.'),
      Q('p4', 'Como gravar um áudio sem precisar segurar o botão?', ['Deslizando o microfone para cima', 'Apertando a câmera', 'Pelo clipe', 'Não é possível'], 0, 'Deslizar para cima trava a gravação.'),
      Q('p5', 'Chamadas de WhatsApp no Wi-Fi:', ['Não gastam os dados móveis', 'Custam como ligação normal', 'Não funcionam', 'Só funcionam de dia'], 0, 'No Wi-Fi, as chamadas usam a internet da casa.'),
      Q('p5', 'Alguém pede o código de 6 números do seu WhatsApp. O que fazer?', ['Nunca passar o código', 'Passar se for conhecido', 'Passar por áudio', 'Postar no status'], 0, 'Com esse código, golpistas roubam a conta.'),
    ],
  };

  C['d6-a04'] = {
    titulo: 'WhatsApp: grupos, status e WhatsApp Web',
    subtitulo: 'Participar de grupos, usar o status, configurações úteis e abrir o WhatsApp no computador.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Grupos', blocos: [
        { p: 'Os **grupos** [[grupo]] reúnem várias pessoas na mesma conversa: família, turma, trabalho, condomínio.' },
        { passos: [
          'Toque em **nova conversa** > **Novo grupo**.',
          'Escolha os participantes e toque na setinha.',
          'Dê um **nome** e uma **foto** ao grupo.',
        ] },
        { p: 'Quem cria o grupo é **administrador**: pode adicionar e remover pessoas e mudar as regras.' },
      ] },
      { id: 'p2', titulo: 'Silenciar e sair', blocos: [
        { p: 'Grupo agitado demais? Você não precisa sair:' },
        { lista: [
          '**Silenciar:** abra o grupo, toque no nome dele > **Silenciar notificações** [[sino]]. As mensagens chegam, mas sem barulho.',
          '**Arquivar:** esconde a conversa da lista principal.',
          '**Sair do grupo:** no nome do grupo, role até o fim > **Sair do grupo**.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Quem pode me adicionar', texto: 'Em **Configurações** > **Privacidade** > **Grupos**, escolha **Meus contatos**. Assim desconhecidos não podem colocar você em grupos.' } },
      ] },
      { id: 'p3', titulo: 'Status', blocos: [
        { p: 'O **status** é uma foto, vídeo ou texto que fica visível para os seus contatos por **24 horas** e depois some.' },
        { lista: [
          'Para postar: aba **Atualizações** > ícone da câmera ou do lápis.',
          'Para ver o status de alguém: toque na bolinha com a foto da pessoa.',
          'Em **Privacidade do status**, escolha quem pode ver.',
        ] },
      ] },
      { id: 'p4', titulo: 'Configurações úteis', blocos: [
        { tabela: { cab: ['Configuração', 'Para que serve'], linhas: [
          ['Confirmação de leitura', 'Liga ou desliga os tiques azuis'],
          ['Visto por último', 'Mostra ou esconde a hora em que você usou o app'],
          ['Foto do perfil', 'Escolha quem pode ver: todos, contatos ou ninguém'],
          ['Mensagens temporárias', 'Mensagens que somem depois de um tempo'],
          ['Bloquear', 'Impede um contato de falar com você'],
          ['Backup', 'Guarda as conversas na nuvem, para não perder ao trocar de celular'],
        ] } },
        { destaque: { tom: 'saiba', titulo: 'Bloquear e denunciar', texto: 'Recebeu mensagem de golpe? Toque no nome do contato > **Bloquear** e **Denunciar**. Isso ajuda o WhatsApp a derrubar contas de golpistas.' } },
      ] },
      { id: 'p5', titulo: 'WhatsApp no computador', blocos: [
        { p: 'O **WhatsApp Web** mostra as suas conversas no computador, para digitar com o teclado grande.' },
        { passos: [
          'No computador, abra **web.whatsapp.com** no navegador (ou o aplicativo WhatsApp para Windows).',
          'Aparece um **QR Code** (um quadrado de pontinhos).',
          'No celular: **Configurações** (ou os três pontinhos) > **Dispositivos conectados** > **Conectar um dispositivo**.',
          'Aponte a câmera do celular para o QR Code. Pronto!',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Computador de outra pessoa', texto: 'Ao terminar, desconecte: no WhatsApp Web, menu > **Desconectar**. No celular, em **Dispositivos conectados**, você vê e desconecta todos os aparelhos.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'Quem cria um grupo no WhatsApp é:', ['Administrador', 'Visitante', 'Moderador da Meta', 'Ninguém'], 0, 'O criador do grupo é administrador.'),
      Q('p1', 'O que um administrador de grupo pode fazer?', ['Adicionar e remover pessoas', 'Ler as conversas privadas dos participantes', 'Mudar o número de alguém', 'Nada'], 0, 'Administradores controlam os participantes e as regras.'),
      Q('p2', 'Como parar de receber o barulho de um grupo sem sair dele?', ['Silenciar notificações', 'Bloquear o grupo', 'Desinstalar o WhatsApp', 'Trocar de número'], 0, 'Silenciar mantém as mensagens, sem notificar.'),
      Q('p2', 'Como impedir que desconhecidos coloquem você em grupos?', ['Privacidade > Grupos > Meus contatos', 'Apagando o WhatsApp', 'Desligando o Wi-Fi', 'Não é possível'], 0, 'Assim, só os seus contatos podem adicionar você.'),
      Q('p3', 'Por quanto tempo o status fica visível?', ['24 horas', '1 hora', '1 semana', 'Para sempre'], 0, 'O status some depois de 24 horas.'),
      Q('p3', 'Onde fica o status no WhatsApp?', ['Na aba Atualizações', 'Na aba Ligações', 'No clipe', 'Nas Configurações de conta'], 0, 'Os status ficam na aba Atualizações.'),
      Q('p4', 'Para que serve o backup do WhatsApp?', ['Guardar as conversas para não perder ao trocar de celular', 'Deixar o app mais rápido', 'Bloquear contatos', 'Mandar mensagens anônimas'], 0, 'O backup salva as conversas na nuvem.'),
      Q('p4', 'Recebeu mensagem de golpe. O que fazer?', ['Bloquear e denunciar o contato', 'Responder com xingamentos', 'Mandar o código pedido', 'Encaminhar para todos'], 0, 'Bloquear e denunciar ajuda a derrubar golpistas.'),
      Q('p5', 'O que é preciso para abrir o WhatsApp Web?', ['Ler o QR Code com o celular', 'Comprar uma licença', 'Ter o Word', 'Um pendrive'], 0, 'O QR Code liga o computador ao seu celular.'),
      Q('p5', 'Usou o WhatsApp Web num computador de outra pessoa. O que fazer ao terminar?', ['Desconectar', 'Deixar aberto', 'Desligar só o monitor', 'Trocar o papel de parede'], 0, 'Desconecte para ninguém ler as suas conversas.'),
    ],
  };

  C['d6-a05'] = {
    titulo: 'Facebook',
    subtitulo: 'Perfil, feed, amigos, páginas, grupos e o Marketplace: como usar a rede social com segurança.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é o Facebook', blocos: [
        { p: 'O **Facebook** é uma das redes sociais mais antigas e populares. Nele você tem um **perfil**, adiciona **amigos**, publica fotos e textos, participa de **grupos** e segue **páginas** de empresas e artistas.' },
        { p: 'Ele pertence à empresa **Meta**, a mesma do WhatsApp e do Instagram.' },
      ] },
      { id: 'p2', titulo: 'Perfil e amigos', blocos: [
        { lista: [
          '**Perfil:** foto, foto de capa, nome e informações como cidade e trabalho. Você escolhe o que mostrar.',
          '**Adicionar amigo:** pesquise o nome da pessoa e toque em **Adicionar amigo**. Ela precisa **aceitar**.',
          '**Solicitações:** os pedidos de amizade que você recebe. Aceite só de quem você conhece.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Perfil falso', texto: 'Desconfie de pedidos de amizade de perfis sem fotos, com poucos amigos ou recém-criados, principalmente se logo pedirem dinheiro ou favores.' } },
      ] },
      { id: 'p3', titulo: 'Feed e publicações', blocos: [
        { p: 'O **feed** mostra as publicações dos amigos, grupos e páginas. Em cada publicação você pode:' },
        { tabela: { cab: ['Ação', 'O que faz'], linhas: [
          ['Curtir 👍', 'Mostra que gostou. Segure para escolher outras reações'],
          ['Comentar', 'Escreve uma resposta'],
          ['Compartilhar', 'Mostra a publicação no seu perfil ou envia para alguém'],
        ] } },
        { p: 'Para publicar, toque em **No que você está pensando?**, escreva, adicione fotos e escolha **quem pode ver** antes de tocar em **Publicar**.' },
      ] },
      { id: 'p4', titulo: 'Páginas e grupos', blocos: [
        { compara: {
          a: { t: 'Páginas', ico: 'bandeira', itens: ['De empresas, artistas, órgãos públicos', 'Você **segue** para ver as novidades', 'Ex.: página da prefeitura'] },
          b: { t: 'Grupos', ico: 'grupo', itens: ['Pessoas com um interesse em comum', 'Você **participa** e conversa', 'Ex.: grupo de vagas da cidade'] },
        } },
        { destaque: { tom: 'dica', titulo: 'Grupos de vagas', texto: 'Pesquise “vagas de emprego” + o nome da sua cidade nos grupos. Mas cuidado: vaga que cobra taxa para contratar é golpe.' } },
      ] },
      { id: 'p5', titulo: 'Marketplace e Messenger', blocos: [
        { p: 'O **Marketplace** [[sacola]] é a área de compra e venda entre pessoas da sua região.' },
        { checklist: [
          'Combine a entrega em **lugar público** e movimentado.',
          '**Veja o produto** antes de pagar.',
          'Desconfie de preços muito baixos e de pressa para fechar.',
          'Nunca pague “sinal” para reservar algo de um desconhecido.',
        ] },
        { p: 'O **Messenger** é o aplicativo de mensagens do Facebook, para conversar com os amigos da rede.' },
      ] },
    ],
    perguntas: [
      Q('p1', 'A qual empresa pertence o Facebook?', ['Meta', 'Google', 'Microsoft', 'Apple'], 0, 'O Facebook, o Instagram e o WhatsApp são da Meta.'),
      Q('p1', 'O que dá para fazer no Facebook?', ['Adicionar amigos, publicar e participar de grupos', 'Editar planilhas', 'Formatar o computador', 'Imprimir documentos'], 0, 'O Facebook é uma rede social de amigos, grupos e páginas.'),
      Q('p2', 'O que acontece depois que você envia um pedido de amizade?', ['A pessoa precisa aceitar', 'Ela vira sua amiga na hora', 'O perfil dela é apagado', 'Nada'], 0, 'A amizade só acontece se a pessoa aceitar.'),
      Q('p2', 'Qual é um sinal de perfil falso?', ['Sem fotos, poucos amigos e pedindo dinheiro', 'Muitos anos de publicações', 'Amigos em comum que você conhece', 'Foto e nome reais'], 0, 'Perfis novos, vazios e que pedem dinheiro são suspeitos.'),
      Q('p3', 'O que faz o botão Compartilhar?', ['Mostra a publicação no seu perfil ou envia para alguém', 'Apaga a publicação', 'Bloqueia o autor', 'Denuncia'], 0, 'Compartilhar espalha a publicação.'),
      Q('p3', 'O que escolher antes de publicar?', ['Quem pode ver a publicação', 'A cor do celular', 'A operadora', 'A bateria'], 0, 'Defina o público de cada publicação.'),
      Q('p4', 'Qual a diferença entre página e grupo?', ['Página é de empresas e artistas; grupo reúne pessoas com um interesse em comum', 'São a mesma coisa', 'Grupo é pago', 'Página é só para fotos'], 0, 'Você segue páginas e participa de grupos.'),
      Q('p4', 'Uma “vaga” num grupo cobra taxa para contratar. Isso é:', ['Golpe', 'Normal', 'Obrigatório por lei', 'Um bom sinal'], 0, 'Empresas sérias não cobram para contratar.'),
      Q('p5', 'Para que serve o Marketplace?', ['Compra e venda entre pessoas da região', 'Fazer ligações', 'Editar fotos', 'Estudar'], 0, 'O Marketplace é a área de compra e venda.'),
      Q('p5', 'Ao comprar no Marketplace, o mais seguro é:', ['Ver o produto em lugar público antes de pagar', 'Pagar um sinal adiantado', 'Mandar o dinheiro sem ver', 'Ir sozinho a um lugar isolado'], 0, 'Veja o produto antes e combine em local público.'),
    ],
  };

  C['d6-a06'] = {
    titulo: 'Instagram',
    subtitulo: 'Perfil, feed, stories, reels, seguir, curtir e comentar na rede das fotos e vídeos.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é o Instagram', blocos: [
        { p: 'O **Instagram** [[camera]] é uma rede social de **fotos e vídeos**. Muito usada por pessoas, artistas, lojas e pequenos negócios para mostrar o seu dia a dia e os seus produtos.' },
        { p: 'Nele você **segue** perfis (sem precisar que eles sigam de volta) e tem **seguidores**.' },
      ] },
      { id: 'p2', titulo: 'Os tipos de publicação', blocos: [
        { tabela: { cab: ['Tipo', 'Como é', 'Quanto tempo fica'], linhas: [
          ['Post (feed)', 'Fotos e vídeos no seu perfil, com legenda', 'Para sempre (até você apagar)'],
          ['Stories', 'Fotos e vídeos rápidos, na bolinha da foto de perfil', '24 horas'],
          ['Reels', 'Vídeos curtos, na vertical, com música e efeitos', 'Para sempre'],
          ['Direct', 'Mensagens privadas', 'Até apagar'],
        ] } },
      ] },
      { id: 'p3', titulo: 'Navegando pelo aplicativo', blocos: [
        { p: 'Na parte de baixo da tela ficam os ícones principais:' },
        { cards: [
          { ico: 'casa', t: 'Início', d: 'O feed com os perfis que você segue.' },
          { ico: 'lupa', t: 'Pesquisa', d: 'Encontre pessoas, lugares e hashtags.' },
          { ico: 'video', t: 'Reels', d: 'Vídeos curtos, um atrás do outro.' },
          { ico: 'usuario', t: 'Perfil', d: 'As suas publicações e configurações.' },
        ] },
        { p: 'O botão **+** cria uma publicação nova: post, story ou reel.' },
      ] },
      { id: 'p4', titulo: 'Interagindo', blocos: [
        { lista: [
          '**Curtir:** toque no coração [[coracao]] ou dê dois toques na foto.',
          '**Comentar:** o balãozinho embaixo da publicação.',
          '**Enviar:** o aviãozinho manda a publicação por Direct.',
          '**Salvar:** a bandeirinha guarda a publicação para ver depois.',
          '**Marcar:** escreva **@** + o nome do perfil para chamar alguém num comentário.',
        ] },
      ] },
      { id: 'p5', titulo: 'Perfil comercial e cuidados', blocos: [
        { p: 'Pequenos negócios podem transformar o perfil em **conta profissional**: aparecem botões de contato, endereço e estatísticas de quantas pessoas viram as publicações.' },
        { checklist: [
          'Desconfie de perfis que prometem **seguidores grátis** ou **dinheiro fácil**.',
          'Golpistas copiam perfis de lojas famosas: confira o **selo** e o número de seguidores.',
          'Nunca informe códigos recebidos por SMS ou e-mail.',
          'Pense antes de mostrar a **localização em tempo real** nos stories.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'O Instagram é uma rede social focada em:', ['Fotos e vídeos', 'Planilhas', 'E-mails', 'Documentos de texto'], 0, 'O Instagram é a rede das fotos e vídeos.'),
      Q('p1', 'No Instagram, para seguir alguém é preciso que a pessoa siga de volta?', ['Não', 'Sim, sempre', 'Só se for empresa', 'Só no computador'], 0, 'Você pode seguir sem ser seguido de volta (perfis privados precisam aprovar).'),
      Q('p2', 'Quanto tempo um story fica no ar?', ['24 horas', '1 hora', 'Para sempre', '1 mês'], 0, 'Stories somem depois de 24 horas.'),
      Q('p2', 'O que são reels?', ['Vídeos curtos na vertical, com música e efeitos', 'Mensagens de texto', 'Fotos de perfil', 'Configurações'], 0, 'Reels são vídeos curtos.'),
      Q('p3', 'Para que serve o botão + no Instagram?', ['Criar uma publicação nova', 'Apagar a conta', 'Bloquear alguém', 'Sair do app'], 0, 'O + cria posts, stories e reels.'),
      Q('p3', 'Onde você encontra pessoas, lugares e hashtags?', ['Na Pesquisa (lupa)', 'No Perfil', 'No Direct', 'Nas Configurações'], 0, 'A lupa abre a pesquisa.'),
      Q('p4', 'Como curtir uma foto rapidamente?', ['Dando dois toques na foto', 'Apertando o botão de volume', 'Pelo Direct', 'Pela câmera'], 0, 'Dois toques na foto curtem a publicação.'),
      Q('p4', 'Como chamar alguém num comentário?', ['Escrevendo @ e o nome do perfil', 'Escrevendo #', 'Mandando e-mail', 'Ligando'], 0, 'O @ marca o perfil da pessoa.'),
      Q('p5', 'O que a conta profissional oferece?', ['Botões de contato e estatísticas das publicações', 'Seguidores grátis', 'Dinheiro automático', 'Nada'], 0, 'A conta profissional ajuda pequenos negócios.'),
      Q('p5', 'Um perfil promete seguidores grátis em troca da sua senha. Isso é:', ['Golpe', 'Uma promoção oficial', 'Normal', 'Seguro'], 0, 'Nunca entregue a sua senha.'),
    ],
  };

  C['d6-a07'] = {
    titulo: 'Publicações responsáveis',
    subtitulo: 'O que postar, o que evitar, direito de imagem e o que é a sua pegada digital.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'A internet não esquece', blocos: [
        { p: 'Tudo o que você publica deixa um rastro: é a sua **pegada digital** [[mao]]. Mesmo depois de apagar, alguém pode ter **printado**, compartilhado ou salvado.' },
        { p: 'Empresas costumam olhar as redes sociais dos candidatos antes de contratar. Uma publicação de anos atrás pode influenciar uma vaga hoje.' },
        { destaque: { tom: 'dica', titulo: 'Antes de postar', texto: 'Pergunte: “Eu ficaria bem se a minha família, o meu chefe ou um desconhecido vissem isso daqui a 5 anos?”.' } },
      ] },
      { id: 'p2', titulo: 'O que evitar publicar', blocos: [
        { checklist: [
          '**Documentos, cartões e boletos:** podem ser usados em golpes.',
          '**Endereço e rotina:** “saindo de casa agora” avisa que a casa ficou vazia.',
          '**Localização em tempo real**, principalmente de crianças.',
          '**Fotos de crianças** com uniforme da escola.',
          '**Ofensas, preconceito e brigas.**',
          '**Viagens** enquanto ainda estão acontecendo: prefira postar na volta.',
        ] },
      ] },
      { id: 'p3', titulo: 'Direito de imagem', blocos: [
        { p: 'Cada pessoa tem direito sobre a própria imagem. Antes de postar a foto de alguém, **peça permissão**.' },
        { lista: [
          'Fotos de crianças: só com autorização dos pais ou responsáveis.',
          'Fotos de pessoas em situação constrangedora: **não publique**.',
          'Prints de conversas privadas: espalhar pode causar problemas e até processos.',
        ] },
      ] },
      { id: 'p4', titulo: 'Direitos autorais', blocos: [
        { p: 'Fotos, músicas, vídeos e textos têm **autor**. Usar o trabalho de outra pessoa como se fosse seu, ou para vender, pode violar os **direitos autorais**.' },
        { lista: [
          'Compartilhe pelo botão da própria rede, que mostra o autor original.',
          'Dê o **crédito**: cite quem criou.',
          'Para trabalhos, use bancos de imagens gratuitos e com licença livre.',
        ] },
      ] },
      { id: 'p5', titulo: 'Construindo uma boa imagem', blocos: [
        { p: 'As redes também podem ajudar você! Use-as para mostrar o seu melhor:' },
        { cards: [
          { ico: 'trofeu', t: 'Conquistas', d: 'Cursos concluídos, como este.' },
          { ico: 'lampada', t: 'Talentos', d: 'O seu trabalho, artesanato, culinária.' },
          { ico: 'usuario', t: 'Perfil profissional', d: 'LinkedIn atualizado com experiências.' },
          { ico: 'coracao', t: 'Gentileza', d: 'Comentários respeitosos e úteis.' },
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é a pegada digital?', ['O rastro de tudo o que você publica e faz na internet', 'Uma impressão digital no celular', 'Um aplicativo', 'Um tipo de mouse'], 0, 'A pegada digital é o rastro que deixamos on-line.'),
      Q('p1', 'Por que pensar antes de postar?', ['Porque mesmo apagado, alguém pode ter salvado ou printado', 'Porque o celular quebra', 'Porque gasta bateria', 'Não precisa pensar'], 0, 'O que foi publicado pode continuar circulando.'),
      Q('p2', 'Por que evitar postar “saindo de casa agora”?', ['Avisa que a casa ficou vazia', 'Gasta internet', 'É proibido', 'Não tem problema'], 0, 'Divulgar a rotina pode ajudar criminosos.'),
      Q('p2', 'Qual destes NÃO deve ser publicado?', ['Foto do cartão de crédito', 'Foto de um pôr do sol', 'Uma receita', 'Um parabéns'], 0, 'Dados de cartões podem ser usados em golpes.'),
      Q('p3', 'Antes de postar a foto de outra pessoa, você deve:', ['Pedir permissão', 'Postar sem avisar', 'Colocar filtro', 'Marcar todo mundo'], 0, 'Cada pessoa tem direito sobre a própria imagem.'),
      Q('p3', 'Fotos de crianças só devem ser publicadas:', ['Com autorização dos responsáveis', 'Sempre', 'Com o uniforme da escola', 'Com a localização'], 0, 'É preciso autorização dos pais ou responsáveis.'),
      Q('p4', 'O que são direitos autorais?', ['Os direitos de quem criou uma obra', 'A senha da rede social', 'O nome do perfil', 'Uma propaganda'], 0, 'O autor tem direitos sobre o que criou.'),
      Q('p4', 'Como compartilhar o trabalho de alguém do jeito certo?', ['Pelo botão da rede e dando o crédito', 'Dizendo que é seu', 'Tirando a assinatura', 'Vendendo'], 0, 'Dê sempre o crédito ao autor.'),
      Q('p5', 'Como usar as redes a seu favor?', ['Mostrando conquistas e talentos', 'Brigando nos comentários', 'Publicando documentos', 'Ofendendo pessoas'], 0, 'As redes podem divulgar o seu melhor.'),
      Q('p5', 'Qual rede é a mais indicada para um perfil profissional?', ['LinkedIn', 'TikTok', 'Jogos on-line', 'Nenhuma'], 0, 'O LinkedIn é a rede profissional.'),
    ],
  };

  C['d6-a08'] = {
    titulo: 'Configurações de privacidade',
    subtitulo: 'Quem vê o que você publica: perfil privado, bloquear, denunciar e proteger a sua conta.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é privacidade nas redes', blocos: [
        { p: '**Privacidade** é decidir **quem pode ver** as suas informações e publicações [[cadeado]]. Cada rede social tem uma área de **Configurações de privacidade**, e vale a pena visitar.' },
        { tabela: { cab: ['Opção', 'Quem vê'], linhas: [
          ['Público', 'Qualquer pessoa, até quem não tem conta'],
          ['Amigos / seguidores', 'Só quem você aceitou'],
          ['Amigos próximos', 'Uma lista escolhida por você'],
          ['Somente eu', 'Só você'],
        ] } },
      ] },
      { id: 'p2', titulo: 'Perfil privado', blocos: [
        { p: 'No **Instagram** e no **TikTok**, dá para deixar a conta **privada**: só os seguidores que você aprovar veem as suas publicações.' },
        { passos: [
          'Abra o seu **perfil** > menu (☰) > **Configurações e privacidade**.',
          'Toque em **Privacidade da conta**.',
          'Ative **Conta privada**.',
        ] },
        { p: 'No **Facebook**, use a **Verificação de privacidade** nas configurações: ela mostra, passo a passo, quem vê cada informação.' },
      ] },
      { id: 'p3', titulo: 'Bloquear, restringir e denunciar', blocos: [
        { compara: {
          a: { t: 'Bloquear', ico: 'x', itens: ['A pessoa não vê mais o seu perfil', 'Não consegue mandar mensagens', 'Ela não é avisada'] },
          b: { t: 'Denunciar', ico: 'bandeira', itens: ['Avisa a rede social sobre um perfil ou publicação', 'Para golpes, ofensas, perfis falsos', 'É anônimo'] },
        } },
        { p: 'Também existem **Silenciar** (parar de ver as publicações sem deixar de seguir) e **Restringir** (os comentários da pessoa só aparecem para ela).' },
      ] },
      { id: 'p4', titulo: 'Informações do perfil', blocos: [
        { p: 'Revise o que aparece no seu perfil:' },
        { checklist: [
          'Telefone e e-mail: deixe como **Somente eu**.',
          'Data de nascimento completa: esconda o ano, se preferir.',
          'Cidade e trabalho: mostre só se quiser.',
          'Lista de amigos: pode ser escondida.',
          'Marcações: ative a **revisão de marcações**, para aprovar antes de aparecer no seu perfil.',
        ] },
      ] },
      { id: 'p5', titulo: 'Protegendo a conta', blocos: [
        { checklist: [
          'Use uma **senha forte** e diferente das outras contas.',
          'Ative a **autenticação de dois fatores** (verificação em duas etapas).',
          'Confira em **Onde você está conectado** se há aparelhos desconhecidos.',
          'Desconfie de mensagens dizendo que a sua conta será **excluída** se você não clicar num link.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Conta roubada?', texto: 'Se não conseguir entrar, use o **“Esqueceu a senha?”** e as opções de recuperação da própria rede. Avise os amigos por outro meio: o golpista pode pedir dinheiro em seu nome.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que significa uma publicação “Pública”?', ['Qualquer pessoa pode ver', 'Só você vê', 'Só a família vê', 'Ninguém vê'], 0, 'Público: qualquer pessoa, até sem conta.'),
      Q('p1', 'O que é privacidade nas redes sociais?', ['Decidir quem pode ver as suas informações', 'Apagar a conta', 'Ter muitos seguidores', 'Postar todo dia'], 0, 'Privacidade é controlar quem vê o quê.'),
      Q('p2', 'Numa conta privada do Instagram:', ['Só seguidores aprovados veem as publicações', 'Ninguém consegue seguir', 'Tudo fica público', 'As fotos somem'], 0, 'Você aprova quem pode seguir.'),
      Q('p2', 'No Facebook, qual ferramenta revisa passo a passo a privacidade?', ['Verificação de privacidade', 'Marketplace', 'Stories', 'Messenger'], 0, 'A Verificação de privacidade guia as configurações.'),
      Q('p3', 'O que acontece quando você bloqueia alguém?', ['A pessoa não vê o seu perfil nem manda mensagens', 'A pessoa é presa', 'A sua conta é apagada', 'A pessoa recebe um aviso público'], 0, 'O bloqueio corta o contato; a pessoa não é avisada.'),
      Q('p3', 'Para avisar a rede sobre um perfil de golpe, use:', ['Denunciar', 'Curtir', 'Compartilhar', 'Seguir'], 0, 'A denúncia é anônima e ajuda a remover golpistas.'),
      Q('p4', 'Como deixar o telefone e o e-mail visíveis só para você?', ['Escolhendo “Somente eu”', 'Deixando Público', 'Postando no feed', 'Não é possível'], 0, '“Somente eu” esconde a informação dos outros.'),
      Q('p4', 'Para que serve a revisão de marcações?', ['Aprovar antes de aparecer no seu perfil', 'Marcar todo mundo', 'Apagar fotos dos outros', 'Ganhar seguidores'], 0, 'Você decide o que aparece no seu perfil.'),
      Q('p5', 'Qual cuidado protege a conta da rede social?', ['Ativar a autenticação de dois fatores', 'Usar a mesma senha em tudo', 'Compartilhar a senha com amigos', 'Clicar em todos os links'], 0, 'A verificação em duas etapas adiciona uma segunda tranca.'),
      Q('p5', 'Mensagem diz que a sua conta será excluída se você não clicar num link. É:', ['Provável golpe', 'Aviso oficial certo', 'Normal', 'Obrigatório clicar'], 0, 'Ameaças e pressa são táticas de golpe.'),
    ],
  };

  C['d6-a09'] = {
    titulo: 'Bem-estar e cidadania digital',
    subtitulo: 'Cyberbullying, notícias falsas, tempo de tela e como ser uma boa pessoa também na internet.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Cidadania digital', blocos: [
        { p: '**Cidadania digital** é usar a tecnologia com **responsabilidade**, **respeito** e **segurança**, conhecendo os seus direitos e deveres na internet.' },
        { cards: [
          { ico: 'coracao', t: 'Respeito', d: 'Tratar bem as pessoas, on-line e off-line.' },
          { ico: 'escudo', t: 'Segurança', d: 'Proteger os seus dados e os dos outros.' },
          { ico: 'check', t: 'Responsabilidade', d: 'Pensar antes de publicar e compartilhar.' },
          { ico: 'livro', t: 'Informação', d: 'Buscar fontes confiáveis.' },
        ] },
      ] },
      { id: 'p2', titulo: 'Cyberbullying', blocos: [
        { p: '**Cyberbullying** é a perseguição, humilhação ou ameaça feita pela internet: comentários maldosos, montagens, exclusão proposital de grupos, divulgação de fotos íntimas.' },
        { h: 'Se acontecer com você ou com alguém próximo' },
        { passos: [
          '**Não responda** com agressão.',
          '**Guarde provas:** faça prints com data e o endereço do perfil.',
          '**Bloqueie** e **denuncie** na plataforma.',
          '**Converse** com alguém de confiança: família, escola, coordenação do curso.',
          'Em casos graves, procure a **delegacia** (há delegacias de crimes digitais).',
        ] },
        { destaque: { tom: 'saiba', titulo: 'É lei', texto: 'No Brasil, a intimidação sistemática (bullying), inclusive a virtual, tem lei própria, e divulgar imagens íntimas sem consentimento é crime.' } },
      ] },
      { id: 'p3', titulo: 'Notícias falsas nas redes', blocos: [
        { p: 'As notícias falsas se espalham rápido porque mexem com as emoções. Antes de compartilhar uma mensagem que chegou no grupo:' },
        { checklist: [
          'Leia **além do título**.',
          'Veja **quem** publicou e **quando**.',
          'Pesquise se **jornais e sites oficiais** falam do mesmo assunto.',
          'Desconfie de áudios e vídeos “vazados” sem fonte.',
          'Na dúvida, **não compartilhe**.',
        ] },
      ] },
      { id: 'p4', titulo: 'Tempo de tela', blocos: [
        { p: 'As redes são feitas para prender a atenção: o vídeo seguinte começa sozinho, o feed não acaba. Isso pode roubar horas de sono, estudo e convivência.' },
        { lista: [
          '**Bem-estar digital** (Android) ou **Tempo de Uso** (iPhone): mostram quanto tempo você passa em cada aplicativo.',
          'Defina **limites diários** para as redes.',
          'Desative **notificações** que não são importantes [[sino]].',
          'Deixe o celular **longe da cama** à noite.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Desafio', texto: 'Experimente uma refeição por dia sem celular na mesa. Conversar olhando nos olhos também é tecnologia de ponta!' } },
      ] },
      { id: 'p5', titulo: 'Para fechar a disciplina', blocos: [
        { p: 'Você aprendeu a usar o WhatsApp, o Facebook e o Instagram, a se comunicar com educação e a proteger a sua privacidade. Lembre-se:' },
        { checklist: [
          'Do outro lado da tela há uma pessoa real.',
          'O que vai para a internet pode ficar para sempre.',
          'Privacidade se configura: revise de tempos em tempos.',
          'Nunca passe códigos e senhas para ninguém.',
          'Use as redes a seu favor, com equilíbrio.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é cidadania digital?', ['Usar a tecnologia com responsabilidade, respeito e segurança', 'Ter muitos seguidores', 'Ter o celular mais novo', 'Usar a internet o dia todo'], 0, 'Cidadania digital envolve direitos e deveres on-line.'),
      Q('p1', 'Qual destas atitudes faz parte da cidadania digital?', ['Pensar antes de compartilhar', 'Espalhar boatos', 'Ofender nos comentários', 'Publicar dados dos outros'], 0, 'Responsabilidade ao compartilhar é essencial.'),
      Q('p2', 'O que é cyberbullying?', ['Perseguição, humilhação ou ameaça pela internet', 'Um jogo on-line', 'Um antivírus', 'Uma rede social'], 0, 'Cyberbullying é a violência praticada pela internet.'),
      Q('p2', 'Qual o primeiro cuidado ao sofrer cyberbullying?', ['Guardar provas e não responder com agressão', 'Responder com ofensas', 'Apagar tudo sem guardar', 'Ficar calado sem contar a ninguém'], 0, 'Prints são provas; depois bloqueie, denuncie e peça ajuda.'),
      Q('p3', 'Por que as notícias falsas se espalham rápido?', ['Porque mexem com as emoções', 'Porque são verdadeiras', 'Porque são oficiais', 'Porque são antigas'], 0, 'Medo e raiva fazem as pessoas compartilharem sem pensar.'),
      Q('p3', 'Chegou um áudio “vazado”, sem fonte, no grupo. O que fazer?', ['Desconfiar e não compartilhar sem confirmar', 'Encaminhar para todos', 'Acreditar', 'Mandar para a imprensa'], 0, 'Sem fonte, desconfie.'),
      Q('p4', 'Qual ferramenta do Android mostra o tempo em cada aplicativo?', ['Bem-estar digital', 'Play Store', 'Galeria', 'Calculadora'], 0, 'O Bem-estar digital mostra o tempo de uso.'),
      Q('p4', 'Uma dica para dormir melhor é:', ['Deixar o celular longe da cama', 'Ver vídeos até tarde', 'Deixar todas as notificações ligadas', 'Dormir com o celular na mão'], 0, 'Longe da cama, o celular atrapalha menos o sono.'),
      Q('p5', 'O que fazer com as configurações de privacidade?', ['Revisar de tempos em tempos', 'Nunca mexer', 'Deixar tudo público', 'Apagar a conta'], 0, 'As redes mudam: revise de tempos em tempos.'),
      Q('p5', 'Qual lição vale para todas as redes sociais?', ['Nunca passar códigos e senhas para ninguém', 'Compartilhar tudo', 'Aceitar todos os pedidos de amizade', 'Clicar em todos os links'], 0, 'Códigos e senhas são só seus.'),
    ],
  };

  C['d6-av'] = {
    titulo: 'Avaliação: Redes Sociais e Comunicação Digital',
    subtitulo: '30 perguntas sobre as Aulas 01 a 09. Não há material para consultar: responda com o que você aprendeu.',
    avaliacao: { aulas: ['d6-a01', 'd6-a02', 'd6-a03', 'd6-a04', 'd6-a05', 'd6-a06', 'd6-a07', 'd6-a08', 'd6-a09'] },
  };
})();
