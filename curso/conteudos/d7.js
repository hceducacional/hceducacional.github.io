/* =========================================================
   DISCIPLINA 7 — SEGURANÇA DIGITAL (curso "Informática do zero")
   Aulas 01 a 09 + Aula 10 (avaliação). Formato dos blocos: veja curso/conteudos/d1.js.
   ========================================================= */
window.HC_CONTEUDOS = window.HC_CONTEUDOS || {};
(() => {
  const C = window.HC_CONTEUDOS;
  const Q = (parte, q, op, certa, exp) => ({ parte, q, op, certa, exp });

  C['d7-a01'] = {
    titulo: 'Por que se preocupar com segurança?',
    subtitulo: 'Os riscos do mundo digital, o que os criminosos procuram e por que qualquer pessoa pode ser um alvo.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'A sua vida está no digital', blocos: [
        { p: 'Hoje guardamos no celular e no computador coisas muito valiosas: fotos da família, conversas, documentos, o aplicativo do banco, o e-mail. Proteger tudo isso é a **segurança digital** [[escudo]].' },
        { cards: [
          { ico: 'dinheiro', t: 'Dinheiro', d: 'Banco, Pix, cartões.' },
          { ico: 'usuario', t: 'Identidade', d: 'CPF, RG, contas de e-mail e redes sociais.' },
          { ico: 'imagem', t: 'Memórias', d: 'Fotos e vídeos pessoais.' },
          { ico: 'chat', t: 'Conversas', d: 'Mensagens privadas e contatos.' },
        ] },
      ] },
      { id: 'p2', titulo: 'O que os criminosos querem', blocos: [
        { lista: [
          '**Dinheiro:** transferências, compras com o seu cartão, empréstimos no seu nome.',
          '**Dados:** CPF, senhas e documentos para abrir contas e aplicar outros golpes.',
          '**Contas:** usar o seu WhatsApp ou rede social para pedir dinheiro aos seus contatos.',
          '**Resgate:** sequestrar os seus arquivos e cobrar para devolver.',
        ] },
        { destaque: { tom: 'atencao', titulo: '“Eu não tenho nada de valor”', texto: 'Não existe pessoa “sem importância” para golpistas. Os seus contatos, o seu CPF e o seu número de celular já valem dinheiro para eles.' } },
      ] },
      { id: 'p3', titulo: 'Os três pilares', blocos: [
        { p: 'A segurança da informação se apoia em três ideias:' },
        { tabela: { cab: ['Pilar', 'Significa', 'Exemplo'], linhas: [
          ['Confidencialidade', 'Só quem deve pode ver', 'Só você lê as suas mensagens'],
          ['Integridade', 'A informação não é alterada sem permissão', 'O boleto não teve o código trocado'],
          ['Disponibilidade', 'A informação está lá quando você precisa', 'Suas fotos não somem nem são sequestradas'],
        ] } },
      ] },
      { id: 'p4', titulo: 'O elo mais fraco', blocos: [
        { p: 'A maioria dos ataques não “quebra” o computador: ela **engana a pessoa**. Por isso dizemos que o ser humano é o **elo mais fraco** da segurança, e também a melhor defesa.' },
        { fluxo: [
          { ico: 'email', t: 'Isca', d: 'mensagem, ligação, anúncio' },
          { ico: 'alerta', t: 'Pressão', d: 'urgência, medo, prêmio' },
          { ico: 'mao', t: 'Ação', d: 'clicar, pagar, passar código' },
        ] },
        { p: 'Se você quebra qualquer um desses passos (desconfia da isca, não cede à pressão, não faz a ação), o golpe falha.' },
      ] },
      { id: 'p5', titulo: 'O que vamos aprender', blocos: [
        { checklist: [
          'Os tipos de vírus e ameaças.',
          'Como funciona o antivírus.',
          'Por que atualizar o sistema e os aplicativos.',
          'Como criar senhas fortes.',
          'A verificação em duas etapas.',
          'Os golpes mais comuns e como reconhecer.',
          'Como saber se um site é seguro.',
          'Backup e boas práticas do dia a dia.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Segurança é hábito', texto: 'Não existe proteção 100%. Mas pequenos hábitos, repetidos todo dia, deixam você muito mais difícil de enganar do que a maioria das pessoas.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é segurança digital?', ['Proteger as suas informações, contas e aparelhos', 'Comprar o celular mais caro', 'Ter internet rápida', 'Usar só o computador'], 0, 'Segurança digital protege o que é valioso no mundo digital.'),
      Q('p1', 'Qual destes é um bem valioso guardado no celular?', ['O aplicativo do banco', 'A capinha', 'O carregador', 'A película'], 0, 'O acesso ao banco é um dos alvos principais.'),
      Q('p2', 'Por que golpistas querem usar o seu WhatsApp?', ['Para pedir dinheiro aos seus contatos', 'Para melhorar o seu perfil', 'Para apagar spam', 'Para atualizar o app'], 0, 'Com a sua conta, eles enganam os seus contatos.'),
      Q('p2', 'É verdade que quem “não tem nada de valor” não corre risco?', ['Não: CPF, contatos e número já valem para golpistas', 'Sim', 'Só se for rico', 'Só no computador'], 0, 'Qualquer pessoa pode ser alvo.'),
      Q('p3', 'O pilar “confidencialidade” significa:', ['Só quem deve pode ver a informação', 'A informação nunca muda', 'A informação está sempre disponível', 'A informação é pública'], 0, 'Confidencialidade: só pessoas autorizadas têm acesso.'),
      Q('p3', 'Um boleto com o código trocado fere qual pilar?', ['Integridade', 'Disponibilidade', 'Confidencialidade', 'Nenhum'], 0, 'A integridade garante que a informação não foi alterada.'),
      Q('p4', 'Por que o ser humano é chamado de “elo mais fraco”?', ['Porque a maioria dos ataques engana a pessoa', 'Porque esquece o carregador', 'Porque digita devagar', 'Porque usa óculos'], 0, 'Golpes exploram a confiança e a pressa das pessoas.'),
      Q('p4', 'Como fazer um golpe falhar?', ['Desconfiando da isca e não fazendo a ação pedida', 'Clicando rápido', 'Pagando logo', 'Passando o código'], 0, 'Basta quebrar um passo do golpe.'),
      Q('p5', 'Existe proteção 100% garantida?', ['Não, mas bons hábitos reduzem muito o risco', 'Sim, com antivírus pago', 'Sim, desligando o Wi-Fi', 'Sim, com capinha'], 0, 'Não existe proteção total; hábitos fazem a diferença.'),
      Q('p5', 'Segundo o texto, segurança digital é principalmente:', ['Um hábito', 'Um aparelho', 'Uma loja', 'Um site'], 0, 'Pequenos hábitos diários protegem muito.'),
    ],
  };

  C['d7-a02'] = {
    titulo: 'Vírus e outras ameaças',
    subtitulo: 'Vírus, cavalo de Troia, ransomware, spyware e adware: o que são e como chegam até você.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é malware', blocos: [
        { p: '**Malware** (do inglês *malicious software*, programa malicioso) [[virus]] é qualquer programa feito para **causar dano**: roubar dados, espionar, estragar arquivos ou controlar o aparelho.' },
        { p: 'Muita gente chama todos de “vírus”, mas o vírus é só um tipo de malware. Vamos conhecer os principais.' },
      ] },
      { id: 'p2', titulo: 'Os tipos principais', blocos: [
        { tabela: { cab: ['Tipo', 'O que faz'], linhas: [
          ['Vírus', 'Se espalha grudado em outros arquivos e programas, como uma doença'],
          ['Cavalo de Troia (trojan)', 'Parece um programa útil (jogo, aplicativo grátis), mas esconde algo malicioso'],
          ['Ransomware', 'Sequestra os arquivos (criptografa) e cobra resgate para devolver'],
          ['Spyware', 'Espiona: registra o que você digita, senhas e sites visitados'],
          ['Adware', 'Enche o aparelho de propagandas e janelas indesejadas'],
          ['Worm (verme)', 'Se espalha sozinho pela rede, de computador em computador'],
        ] } },
        { destaque: { tom: 'saiba', titulo: 'Cavalo de Troia', texto: 'O nome vem da história grega: os soldados se esconderam dentro de um cavalo de madeira “de presente” para invadir a cidade de Troia.' } },
      ] },
      { id: 'p3', titulo: 'Como eles chegam', blocos: [
        { cards: [
          { ico: 'email', t: 'Anexos', d: 'Arquivos em e-mails e mensagens inesperadas.' },
          { ico: 'download', t: 'Downloads', d: 'Programas piratas, “crackeados” ou de sites estranhos.' },
          { ico: 'link', t: 'Links', d: 'Sites falsos que pedem para instalar algo.' },
          { ico: 'pendrive', t: 'Pendrives', d: 'Pendrives de origem desconhecida.' },
          { ico: 'celular', t: 'Apps falsos', d: 'Aplicativos fora da loja oficial.' },
        ] },
      ] },
      { id: 'p4', titulo: 'Sinais de infecção', blocos: [
        { checklist: [
          'O aparelho ficou **lento** de repente, sem motivo.',
          'Aparecem **propagandas** e janelas sem você abrir nada.',
          'A **página inicial** do navegador mudou sozinha.',
          'Programas que você **não instalou** apareceram.',
          'A **bateria** e os **dados móveis** acabam muito rápido.',
          'Amigos recebem mensagens **que você não mandou**.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Notou algo assim?', texto: 'Faça uma **verificação completa** com o antivírus, desinstale programas desconhecidos e troque as senhas a partir de outro aparelho seguro.' } },
      ] },
      { id: 'p5', titulo: 'Ransomware: o sequestro de arquivos', blocos: [
        { p: 'O **ransomware** é um dos ataques mais graves. Ele embaralha todos os arquivos e mostra uma mensagem pedindo pagamento (geralmente em criptomoeda) para devolver.' },
        { lista: [
          '**Pagar não garante** que os arquivos voltem.',
          'A melhor defesa é ter **cópias de segurança (backup)** fora do computador.',
          'Manter o sistema **atualizado** e não abrir anexos suspeitos evita a maioria dos casos.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é malware?', ['Qualquer programa feito para causar dano', 'Um tipo de mouse', 'Um antivírus', 'Uma atualização'], 0, 'Malware é o programa malicioso.'),
      Q('p1', 'O vírus é:', ['Um dos tipos de malware', 'O único tipo de ameaça', 'Um programa de proteção', 'Uma peça do computador'], 0, 'Existem vários tipos de malware; o vírus é um deles.'),
      Q('p2', 'Qual ameaça sequestra os arquivos e cobra resgate?', ['Ransomware', 'Adware', 'Worm', 'Spyware'], 0, 'Ransomware cobra resgate pelos arquivos.'),
      Q('p2', 'Um jogo grátis que esconde um programa malicioso é um:', ['Cavalo de Troia', 'Antivírus', 'Navegador', 'Backup'], 0, 'O cavalo de Troia se disfarça de algo útil.'),
      Q('p3', 'Qual é uma forma comum de pegar vírus?', ['Baixar programas piratas', 'Ler um livro de papel', 'Desligar o computador', 'Limpar a tela'], 0, 'Programas piratas costumam vir com malware.'),
      Q('p3', 'Encontrou um pendrive na rua. O mais seguro é:', ['Não ligar no seu computador', 'Ligar para ver o que tem', 'Formatar no computador do trabalho', 'Emprestar para um amigo'], 0, 'Pendrives desconhecidos podem trazer malware.'),
      Q('p4', 'Qual destes é sinal de infecção?', ['Propagandas aparecendo sem você abrir nada', 'O relógio certo', 'A bateria carregando', 'O Wi-Fi conectado'], 0, 'Janelas e propagandas inesperadas indicam adware ou vírus.'),
      Q('p4', 'Amigos recebem mensagens que você não mandou. Isso pode indicar:', ['Conta ou aparelho comprometido', 'Que o celular é novo', 'Que a internet é rápida', 'Nada'], 0, 'Pode ser sinal de invasão.'),
      Q('p5', 'Pagar o resgate do ransomware garante a volta dos arquivos?', ['Não', 'Sim, sempre', 'Só no domingo', 'Só com cartão'], 0, 'Pagar não garante nada e ainda financia o crime.'),
      Q('p5', 'Qual a melhor defesa contra o ransomware?', ['Ter backup fora do computador', 'Desligar o monitor', 'Usar fonte grande', 'Trocar o papel de parede'], 0, 'Com backup, você recupera os arquivos sem pagar.'),
    ],
  };

  C['d7-a03'] = {
    titulo: 'A importância do antivírus',
    subtitulo: 'Como o antivírus funciona, o Microsoft Defender que já vem no Windows e como fazer uma verificação.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'O que o antivírus faz', blocos: [
        { p: 'O **antivírus** [[escudo]] é um programa que **detecta, bloqueia e remove** malware. Ele funciona como um segurança na porta: confere o que entra e o que está rodando.' },
        { fig: 'escudo', legenda: 'O antivírus barra as ameaças antes que causem estrago.' },
      ] },
      { id: 'p2', titulo: 'Como ele reconhece as ameaças', blocos: [
        { lista: [
          '**Lista de ameaças conhecidas:** compara os arquivos com um banco de “impressões digitais” de vírus. Por isso precisa ser **atualizado** sempre.',
          '**Comportamento:** percebe quando um programa faz algo suspeito, como embaralhar muitos arquivos de uma vez.',
          '**Proteção em tempo real:** examina cada arquivo no momento em que é aberto ou baixado.',
        ] },
      ] },
      { id: 'p3', titulo: 'O Microsoft Defender', blocos: [
        { p: 'O Windows 10 e o 11 já vêm com um antivírus gratuito e muito bom: o **Microsoft Defender**, que fica no aplicativo **Segurança do Windows**.' },
        { passos: [
          'Abra o Iniciar e digite **Segurança do Windows**.',
          'Clique em **Proteção contra vírus e ameaças**.',
          'Confira se aparece **Nenhuma ação necessária** (tudo certo, com o tique verde).',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Um antivírus só', texto: 'Não instale dois antivírus ao mesmo tempo: eles brigam entre si e deixam o computador lento. Se instalar outro, o Defender se desliga sozinho.' } },
      ] },
      { id: 'p4', titulo: 'Fazendo uma verificação', blocos: [
        { tabela: { cab: ['Tipo de verificação', 'Quando usar'], linhas: [
          ['Rápida', 'No dia a dia: olha os lugares onde as ameaças costumam ficar'],
          ['Completa', 'Quando desconfia de infecção: olha todos os arquivos (demora mais)'],
          ['Personalizada', 'Para verificar um pendrive ou uma pasta específica'],
          ['Offline', 'Para ameaças difíceis de remover: reinicia o computador e verifica antes do Windows abrir'],
        ] } },
        { p: 'Para verificar um arquivo ou pendrive, clique nele com o **botão direito** > **Verificar com o Microsoft Defender**.' },
      ] },
      { id: 'p5', titulo: 'No celular e cuidados extras', blocos: [
        { p: 'No **Android**, o **Google Play Protect** verifica os aplicativos instalados. No **iPhone**, o sistema já é bastante fechado e só aceita apps da App Store.' },
        { checklist: [
          'Mantenha o antivírus **ligado** e **atualizado**.',
          'Desconfie de anúncios dizendo “**Seu celular está infectado! Baixe agora**”: costumam ser golpes.',
          'O antivírus ajuda muito, mas **não substitui** o cuidado com links, anexos e downloads.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que o antivírus faz?', ['Detecta, bloqueia e remove malware', 'Deixa a internet mais rápida', 'Cria senhas', 'Imprime documentos'], 0, 'O antivírus protege contra programas maliciosos.'),
      Q('p1', 'Na comparação do texto, o antivírus é como:', ['Um segurança na porta', 'Um carteiro', 'Um cozinheiro', 'Um pintor'], 0, 'Ele confere o que entra e o que roda no computador.'),
      Q('p2', 'Por que o antivírus precisa ser atualizado?', ['Para conhecer as ameaças novas', 'Para mudar de cor', 'Para ocupar menos espaço', 'Não precisa'], 0, 'A lista de ameaças conhecidas cresce todo dia.'),
      Q('p2', 'O que é a proteção em tempo real?', ['Examinar cada arquivo no momento em que é aberto ou baixado', 'Mostrar a hora certa', 'Verificar uma vez por ano', 'Desligar a internet'], 0, 'Ela age na hora em que o arquivo é usado.'),
      Q('p3', 'Qual antivírus já vem no Windows?', ['Microsoft Defender', 'Paint', 'Excel', 'Edge'], 0, 'O Microsoft Defender vem no Windows 10 e 11.'),
      Q('p3', 'Por que não instalar dois antivírus juntos?', ['Eles brigam entre si e deixam o computador lento', 'Porque é proibido', 'Porque apagam as fotos', 'Não há problema'], 0, 'Dois antivírus ao mesmo tempo conflitam.'),
      Q('p4', 'Quando fazer a verificação completa?', ['Quando desconfiar de infecção', 'Todo minuto', 'Nunca', 'Só no Natal'], 0, 'A completa olha todos os arquivos e demora mais.'),
      Q('p4', 'Como verificar um pendrive?', ['Botão direito > Verificar com o Microsoft Defender', 'Abrindo todos os arquivos', 'Formatando sem olhar', 'Não é possível'], 0, 'O botão direito permite verificar itens específicos.'),
      Q('p5', 'O que protege os aplicativos no Android?', ['Google Play Protect', 'Microsoft Word', 'Bluetooth', 'Lanterna'], 0, 'O Play Protect verifica os apps.'),
      Q('p5', 'Um anúncio diz “Seu celular está infectado! Baixe agora”. Isso costuma ser:', ['Golpe', 'Aviso oficial', 'Atualização do sistema', 'Normal'], 0, 'Anúncios alarmistas costumam ser golpes.'),
    ],
  };

  C['d7-a04'] = {
    titulo: 'Atualizações e proteção de dados',
    subtitulo: 'Por que atualizar o sistema e os aplicativos e como proteger os seus dados pessoais.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'Por que atualizar', blocos: [
        { p: 'Todo programa tem **falhas**. Quando os fabricantes descobrem uma, lançam uma **atualização** [[atualizar]] que fecha a “porta” antes que criminosos a usem.' },
        { compara: {
          a: { t: 'Aparelho desatualizado', ico: 'x', itens: ['Portas abertas para ataques', 'Falhas já conhecidas pelos criminosos', 'Aplicativos param de funcionar'] },
          b: { t: 'Aparelho atualizado', ico: 'check', itens: ['Falhas corrigidas', 'Recursos novos', 'Mais estabilidade'] },
        } },
      ] },
      { id: 'p2', titulo: 'Atualizando o Windows e o celular', blocos: [
        { lista: [
          '**Windows:** Configurações > **Windows Update** > **Verificar se há atualizações**. Reinicie quando pedir.',
          '**Android:** Configurações > **Sistema** > **Atualização de software**.',
          '**iPhone:** Ajustes > **Geral** > **Atualização de Software**.',
          '**Aplicativos:** pela Play Store ou App Store, em **Gerenciar apps** > **Atualizar tudo**.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Deixe automático', texto: 'Ative as atualizações automáticas e deixe o aparelho carregando e no Wi-Fi à noite: ele se atualiza enquanto você dorme.' } },
      ] },
      { id: 'p3', titulo: 'Aparelhos sem suporte', blocos: [
        { p: 'Depois de alguns anos, os fabricantes **param de lançar atualizações** para modelos antigos. Esses aparelhos ficam cada vez mais vulneráveis.' },
        { destaque: { tom: 'atencao', titulo: 'Celular muito antigo', texto: 'Se o seu celular não recebe mais atualizações, evite usar nele o aplicativo do banco. Prefira um aparelho atualizado para as coisas importantes.' } },
      ] },
      { id: 'p4', titulo: 'Seus dados pessoais', blocos: [
        { p: '**Dados pessoais** são informações que identificam você. Alguns são **sensíveis** e precisam de cuidado redobrado.' },
        { tabela: { cab: ['Tipo', 'Exemplos'], linhas: [
          ['Dados pessoais', 'Nome, CPF, RG, endereço, telefone, e-mail'],
          ['Dados sensíveis', 'Saúde, religião, biometria, origem racial, opinião política'],
          ['Dados financeiros', 'Número do cartão, senha do banco, chave Pix'],
        ] } },
        { p: 'A **LGPD** (Lei Geral de Proteção de Dados) dá a você o direito de saber o que as empresas fazem com os seus dados e pedir a correção ou exclusão.' },
      ] },
      { id: 'p5', titulo: 'Protegendo os dados no dia a dia', blocos: [
        { checklist: [
          'Use **bloqueio de tela** (senha, PIN, digital ou rosto) no celular.',
          'Não deixe o celular desbloqueado com estranhos.',
          'Não forneça o CPF em cadastros sem necessidade ("CPF na nota" é opcional).',
          'Desconfie de pesquisas e sorteios que pedem muitos dados.',
          'Rasgue documentos e boletos antes de jogar fora.',
          'Revise as **permissões** dos aplicativos: uma lanterna não precisa acessar os seus contatos.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'Por que atualizar o sistema e os aplicativos?', ['Para corrigir falhas de segurança', 'Para gastar internet', 'Para mudar o papel de parede', 'Não precisa'], 0, 'Atualizações fecham as “portas” usadas por criminosos.'),
      Q('p1', 'Um aparelho desatualizado:', ['Tem falhas já conhecidas pelos criminosos', 'É mais seguro', 'Nunca pega vírus', 'É mais rápido sempre'], 0, 'As falhas conhecidas ficam abertas.'),
      Q('p2', 'Onde atualizar o Windows?', ['Configurações > Windows Update', 'Lixeira', 'Paint', 'Barra de status do Word'], 0, 'O Windows Update baixa e instala as atualizações.'),
      Q('p2', 'Qual a dica para não esquecer de atualizar?', ['Ativar as atualizações automáticas', 'Desligar a internet', 'Não usar o aparelho', 'Atualizar uma vez por década'], 0, 'O automático cuida disso para você.'),
      Q('p3', 'O que acontece com aparelhos muito antigos?', ['Param de receber atualizações e ficam vulneráveis', 'Ficam mais seguros', 'Ganham atualizações extras', 'Nada'], 0, 'Sem suporte, as falhas não são mais corrigidas.'),
      Q('p3', 'Num celular sem atualizações, o que evitar?', ['Usar o aplicativo do banco', 'Tirar fotos', 'Ouvir música', 'Ver as horas'], 0, 'Para coisas importantes, use um aparelho atualizado.'),
      Q('p4', 'Qual destes é um dado sensível?', ['Informação de saúde', 'A cor favorita', 'O nome do bairro', 'O time de futebol'], 0, 'Saúde, religião e biometria são dados sensíveis.'),
      Q('p4', 'O que a LGPD garante?', ['Saber o que as empresas fazem com os seus dados', 'Internet grátis', 'Celular novo', 'Senha automática'], 0, 'A LGPD protege os seus dados pessoais.'),
      Q('p5', 'Um aplicativo de lanterna pede acesso aos seus contatos. Isso é:', ['Suspeito: ele não precisa disso', 'Normal', 'Obrigatório', 'Um bônus'], 0, 'Revise as permissões dos aplicativos.'),
      Q('p5', 'O que fazer antes de jogar fora documentos e boletos?', ['Rasgar', 'Fotografar e postar', 'Guardar na rua', 'Nada'], 0, 'Rasgar evita que alguém use os seus dados.'),
    ],
  };

  C['d7-a05'] = {
    titulo: 'Senhas fortes',
    subtitulo: 'Como criar senhas difíceis de adivinhar e fáceis de lembrar, e como guardar todas com segurança.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'Senhas fracas', blocos: [
        { p: 'Golpistas usam programas que testam **milhões de senhas por segundo**, começando pelas mais comuns. Senhas fracas caem em instantes.' },
        { fig: 'senha', legenda: 'Quanto maior e mais variada, mais forte a senha.' },
        { tabela: { cab: ['Evite', 'Por quê'], linhas: [
          ['123456, 12345678, senha', 'Estão no topo das listas de senhas mais usadas'],
          ['Data de nascimento', 'Fácil de descobrir nas redes sociais'],
          ['Nome do filho, do pet, do time', 'Também aparece nas redes'],
          ['A mesma senha em tudo', 'Se uma vazar, todas as contas ficam expostas'],
        ] } },
      ] },
      { id: 'p2', titulo: 'O que faz uma senha forte', blocos: [
        { checklist: [
          '**Tamanho:** pelo menos **12 caracteres**. Tamanho é o que mais importa.',
          '**Variedade:** letras maiúsculas e minúsculas, números e símbolos (! @ # $).',
          '**Nada pessoal:** sem nomes, datas e números de documentos.',
          '**Única:** uma senha diferente para cada conta importante.',
        ] },
      ] },
      { id: 'p3', titulo: 'A técnica da frase-senha', blocos: [
        { p: 'Uma senha longa não precisa ser difícil de lembrar. Use uma **frase-senha**: várias palavras que formam uma imagem engraçada na sua cabeça.' },
        { exemplo: { titulo: 'Exemplos de frase-senha', linhas: ['Gato!Azul#Chuva27', 'Bolo-De-Pipoca-Na-Lua-9', 'CafeQuente@Amanha!42'] } },
        { p: 'Outra técnica: pegue as **primeiras letras** de uma frase que você sabe de cor. “Minha avó fazia o melhor bolo de milho em 1998!” vira **MafomBdme1998!**' },
        { destaque: { tom: 'atencao', titulo: 'Não use os exemplos', texto: 'As senhas acima são só exemplos: crie as suas próprias.' } },
      ] },
      { id: 'p4', titulo: 'Gerenciador de senhas', blocos: [
        { p: 'Ninguém consegue lembrar dezenas de senhas diferentes. Um **gerenciador de senhas** [[chave]] guarda todas num cofre protegido por **uma única senha mestra**.' },
        { lista: [
          'O **Google** (Chrome e Android) e a **Apple** (iPhone) já têm gerenciadores gratuitos.',
          'Eles **criam senhas fortes** automaticamente e **preenchem** sozinhos nos sites certos.',
          'Avisam quando uma senha sua apareceu em algum **vazamento**.',
        ] },
        { destaque: { tom: 'dica', titulo: 'A senha mestra', texto: 'Capriche na senha mestra (use uma frase-senha) e ative a verificação em duas etapas na conta do gerenciador.' } },
      ] },
      { id: 'p5', titulo: 'Cuidados com as senhas', blocos: [
        { checklist: [
          '**Nunca** passe a sua senha para ninguém, nem para quem diz ser do banco ou da empresa.',
          'Não anote senhas em papel colado no monitor.',
          'Não salve senhas em computadores públicos ou de outras pessoas.',
          'Troque a senha **imediatamente** se desconfiar de vazamento.',
          'Cuidado com quem olha por cima do ombro enquanto você digita.',
        ] },
      ] },
    ],
    perguntas: [
      Q('p1', 'Por que 123456 é uma senha ruim?', ['Está no topo das senhas mais usadas e cai em instantes', 'Porque é longa demais', 'Porque tem letras', 'Ela é ótima'], 0, 'Senhas comuns são as primeiras testadas.'),
      Q('p1', 'Por que não usar a mesma senha em tudo?', ['Se uma vazar, todas as contas ficam expostas', 'Porque o computador não deixa', 'Porque gasta memória', 'Não há problema'], 0, 'Uma senha vazada abriria todas as contas.'),
      Q('p2', 'O que mais deixa uma senha forte?', ['O tamanho', 'Ser o seu nome', 'Ser a sua data de nascimento', 'Ser curta'], 0, 'Tamanho é o fator mais importante.'),
      Q('p2', 'Qual o tamanho mínimo recomendado no texto?', ['12 caracteres', '4 caracteres', '6 caracteres', '2 caracteres'], 0, 'Recomenda-se pelo menos 12 caracteres.'),
      Q('p3', 'O que é uma frase-senha?', ['Várias palavras formando uma senha longa e fácil de lembrar', 'Uma senha de uma letra', 'O seu nome completo', 'Uma senha só de números'], 0, 'Frases-senha são longas e memoráveis.'),
      Q('p3', 'Qual destas é a senha mais forte?', ['Bolo-De-Pipoca-Na-Lua-9', '123456', 'maria1990', 'senha'], 0, 'É longa, variada e não tem dados pessoais.'),
      Q('p4', 'O que faz um gerenciador de senhas?', ['Guarda todas as senhas num cofre protegido por uma senha mestra', 'Apaga as senhas', 'Publica as senhas', 'Deixa a internet mais rápida'], 0, 'O gerenciador guarda e preenche as senhas com segurança.'),
      Q('p4', 'Uma vantagem do gerenciador de senhas é:', ['Avisar quando uma senha apareceu num vazamento', 'Dispensar a senha mestra', 'Postar as senhas', 'Desligar o antivírus'], 0, 'Ele avisa sobre senhas vazadas.'),
      Q('p5', 'Alguém dizendo ser do banco pede a sua senha. O que fazer?', ['Nunca passar a senha', 'Passar, se for educado', 'Passar por mensagem', 'Passar metade'], 0, 'Bancos nunca pedem a senha.'),
      Q('p5', 'Desconfiou que a senha vazou. O que fazer?', ['Trocar a senha imediatamente', 'Esperar um mês', 'Ignorar', 'Contar para todos'], 0, 'Troque na hora.'),
    ],
  };

  C['d7-a06'] = {
    titulo: 'Verificação em duas etapas',
    subtitulo: 'Uma segunda tranca para as suas contas: códigos por SMS, aplicativos autenticadores e como ativar.',
    leitura: 9,
    partes: [
      { id: 'p1', titulo: 'Uma segunda tranca', blocos: [
        { p: 'A **verificação em duas etapas** (ou **autenticação de dois fatores**, **2FA**) pede **duas provas** de que é você: a **senha** e mais alguma coisa, geralmente um **código** no celular.' },
        { fig: 'duasetapas', legenda: 'Mesmo que alguém descubra a senha, sem o código não entra.' },
        { p: 'É como uma porta com **duas fechaduras**: quem tiver só uma chave não abre.' },
      ] },
      { id: 'p2', titulo: 'Os tipos de segunda etapa', blocos: [
        { tabela: { cab: ['Tipo', 'Como funciona', 'Segurança'], linhas: [
          ['Código por SMS', 'Chega uma mensagem com números', 'Boa'],
          ['Aplicativo autenticador', 'Um app (Google Authenticator, Microsoft Authenticator) gera códigos que mudam a cada 30 segundos', 'Muito boa'],
          ['Confirmação no celular', 'Aparece “É você tentando entrar?” e você toca em Sim', 'Muito boa'],
          ['Chave de acesso (passkey)', 'Usa a digital ou o rosto do seu aparelho', 'Excelente'],
        ] } },
      ] },
      { id: 'p3', titulo: 'Ativando nas contas importantes', blocos: [
        { lista: [
          '**Google:** myaccount.google.com > **Segurança** > **Verificação em duas etapas**.',
          '**WhatsApp:** Configurações > **Conta** > **Confirmação em duas etapas** > crie um **PIN de 6 dígitos**.',
          '**Instagram e Facebook:** Central de Contas > **Senha e segurança** > **Autenticação de dois fatores**.',
          '**Gov.br e bancos:** costumam ter a opção nas configurações de segurança do aplicativo.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Comece pelo e-mail e pelo WhatsApp', texto: 'O e-mail recupera quase todas as outras contas, e o WhatsApp é o alvo preferido de golpistas. Ative primeiro nesses dois.' } },
      ] },
      { id: 'p4', titulo: 'Códigos de backup', blocos: [
        { p: 'E se você perder o celular? Ao ativar a verificação, o serviço oferece **códigos de backup**: códigos de uso único para entrar sem o celular.' },
        { checklist: [
          'Anote ou imprima os códigos de backup.',
          'Guarde num lugar seguro, **longe do celular** (numa gaveta em casa, por exemplo).',
          'Mantenha o **telefone e o e-mail de recuperação** atualizados.',
        ] },
      ] },
      { id: 'p5', titulo: 'O código é só seu', blocos: [
        { p: 'Golpistas sabem da verificação em duas etapas. Por isso inventam histórias para que **você** entregue o código:' },
        { lista: [
          '“Mandei um código para você por engano, pode me passar?”',
          '“Sou do suporte, preciso do código para confirmar o seu cadastro.”',
          '“Para receber o prêmio, informe o código que chegou.”',
        ] },
        { destaque: { tom: 'atencao', titulo: 'Regra de ouro', texto: 'Código de verificação **não se passa para ninguém**. Nunca. Se chegou um código que você não pediu, alguém está tentando entrar na sua conta: troque a senha.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é a verificação em duas etapas?', ['Pedir duas provas de que é você: a senha e mais algo, como um código', 'Digitar a senha duas vezes', 'Ter duas contas', 'Usar dois celulares'], 0, 'São duas provas diferentes de identidade.'),
      Q('p1', 'Se alguém descobre a sua senha, mas você tem duas etapas ativada:', ['Sem o código, a pessoa não entra', 'A pessoa entra normalmente', 'A conta é apagada', 'Nada muda'], 0, 'A segunda etapa barra o invasor.'),
      Q('p2', 'O que faz um aplicativo autenticador?', ['Gera códigos que mudam a cada 30 segundos', 'Apaga vírus', 'Guarda fotos', 'Faz ligações'], 0, 'Autenticadores geram códigos temporários.'),
      Q('p2', 'Qual tipo usa a digital ou o rosto do aparelho?', ['Chave de acesso (passkey)', 'SMS', 'E-mail', 'Carta'], 0, 'As passkeys usam a biometria do aparelho.'),
      Q('p3', 'No WhatsApp, a confirmação em duas etapas pede:', ['Um PIN de 6 dígitos', 'Uma foto', 'O CPF', 'O endereço'], 0, 'O WhatsApp pede um PIN de 6 dígitos.'),
      Q('p3', 'Por que começar pelo e-mail?', ['Porque o e-mail recupera quase todas as outras contas', 'Porque é o mais bonito', 'Porque é pago', 'Não importa'], 0, 'Quem controla o e-mail controla as recuperações de senha.'),
      Q('p4', 'Para que servem os códigos de backup?', ['Entrar na conta sem o celular', 'Apagar a conta', 'Pagar contas', 'Mudar a foto'], 0, 'São códigos de uso único para emergências.'),
      Q('p4', 'Onde guardar os códigos de backup?', ['Num lugar seguro, longe do celular', 'No status do WhatsApp', 'Num post público', 'Colados no celular'], 0, 'Guarde longe do celular, num lugar seguro.'),
      Q('p5', 'Alguém diz que mandou um código para você por engano e pede para repassar. É:', ['Golpe', 'Normal', 'Educado', 'Obrigatório'], 0, 'É um golpe clássico para roubar contas.'),
      Q('p5', 'Chegou um código que você não pediu. O que fazer?', ['Não passar para ninguém e trocar a senha', 'Repassar para quem pedir', 'Ignorar e postar', 'Desligar o celular para sempre'], 0, 'Alguém tentou entrar: troque a senha.'),
    ],
  };

  C['d7-a07'] = {
    titulo: 'Golpes e engenharia social',
    subtitulo: 'Phishing, falso parente, falsa central do banco, Pix e boletos falsos: como reconhecer e não cair.',
    leitura: 11,
    partes: [
      { id: 'p1', titulo: 'Engenharia social', blocos: [
        { p: '**Engenharia social** é a arte de **enganar pessoas** para que elas mesmas entreguem dados, dinheiro ou acesso. O golpista não invade: ele **convence**.' },
        { tabela: { cab: ['Tática', 'Como aparece'], linhas: [
          ['Urgência', '“Sua conta será bloqueada em 1 hora!”'],
          ['Medo', '“Detectamos uma compra suspeita de R$ 3.000.”'],
          ['Ganância', '“Você ganhou um prêmio!”'],
          ['Autoridade', '“Aqui é da central de segurança do banco.”'],
          ['Afeto', '“Mãe, troquei de número, me ajuda?”'],
        ] } },
      ] },
      { id: 'p2', titulo: 'Phishing', blocos: [
        { fig: 'phishing', legenda: 'A isca: uma mensagem bonita, com pressa e um link.' },
        { p: 'No **phishing** [[anzol]], o golpista manda uma mensagem que imita uma empresa conhecida (banco, loja, correios, governo) com um **link** para um site falso, igualzinho ao verdadeiro. Ali você digita senha e dados do cartão... direto para o golpista.' },
        { checklist: [
          'Remetente estranho ou endereço com erros (banco-seguro.xyz).',
          'Erros de português e saudações genéricas (“Prezado cliente”).',
          'Pressa e ameaças.',
          'Links encurtados ou esquisitos.',
        ] },
      ] },
      { id: 'p3', titulo: 'Golpes no WhatsApp e por telefone', blocos: [
        { lista: [
          '**Falso parente:** “Oi, mãe, troquei de número. Preciso pagar uma conta urgente, me faz um Pix?” → **Ligue para o número antigo** da pessoa e confirme.',
          '**Falsa central do banco:** ligam dizendo que há uma compra suspeita e pedem senha, código ou que você faça um Pix “de teste” → **Desligue** e ligue você para o número do cartão.',
          '**Clonagem do WhatsApp:** pedem o código de 6 dígitos com uma desculpa → **Nunca passe**.',
          '**Falso emprego:** vaga ótima que cobra taxa ou pede para você fazer “tarefas” pagas → **Golpe**.',
        ] },
        { destaque: { tom: 'atencao', titulo: 'O banco nunca', texto: 'Nenhum banco liga pedindo senha, código, para você fazer transferência de teste, instalar aplicativo ou entregar o cartão a um motoboy.' } },
      ] },
      { id: 'p4', titulo: 'Pix e boletos', blocos: [
        { lista: [
          'Antes de confirmar um Pix, **leia o nome** de quem vai receber. Se não for quem você espera, cancele.',
          'O Pix é **instantâneo**: depois de enviado, é difícil de reverter.',
          'Em **boletos**, confira o **nome do beneficiário** e o **valor** na tela do banco antes de pagar.',
          'Prefira gerar a segunda via do boleto **no site oficial** da empresa.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Caí no golpe do Pix. E agora?', texto: 'Avise o seu banco **imediatamente** e peça o **MED** (Mecanismo Especial de Devolução). Depois registre um boletim de ocorrência. Quanto mais rápido, maior a chance de recuperar.' } },
      ] },
      { id: 'p5', titulo: 'O método das 3 perguntas', blocos: [
        { p: 'Antes de clicar, pagar ou passar qualquer informação, pare e pergunte:' },
        { passos: [
          '**Eu esperava esse contato?** Mensagem inesperada já é sinal de alerta.',
          '**Estão me apressando ou mexendo com a minha emoção?** Golpistas não deixam você pensar.',
          '**Consigo confirmar por outro caminho?** Ligue para o número oficial, abra o aplicativo você mesmo, fale com a pessoa pessoalmente.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Combine uma palavra-segredo', texto: 'Combine com a família uma **palavra-segredo**. Se alguém pedir dinheiro em nome de um parente, pergunte a palavra.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é engenharia social?', ['Enganar pessoas para que elas entreguem dados, dinheiro ou acesso', 'Construir prédios', 'Programar computadores', 'Estudar redes Wi-Fi'], 0, 'O golpista convence a vítima.'),
      Q('p1', '“Sua conta será bloqueada em 1 hora!” usa qual tática?', ['Urgência', 'Afeto', 'Gentileza', 'Nenhuma'], 0, 'A pressa impede você de pensar.'),
      Q('p2', 'O que é phishing?', ['Mensagem que imita uma empresa e leva a um site falso para roubar dados', 'Um antivírus', 'Uma rede social', 'Um tipo de backup'], 0, 'Phishing é a pescaria de dados.'),
      Q('p2', 'Qual é um sinal de mensagem de phishing?', ['Remetente estranho, erros de português e pressa', 'Mensagem que você esperava, sem links', 'Carta do correio', 'Ligação de um amigo conhecido'], 0, 'Esses são sinais clássicos de golpe.'),
      Q('p3', '“Oi, mãe, troquei de número, me faz um Pix?” O que fazer?', ['Ligar para o número antigo e confirmar', 'Fazer o Pix logo', 'Mandar a senha do banco', 'Passar o código do WhatsApp'], 0, 'Confirme por outro caminho antes de qualquer pagamento.'),
      Q('p3', 'Ligaram do “banco” pedindo um Pix de teste. O que fazer?', ['Desligar e ligar para o número do cartão', 'Fazer o Pix', 'Passar a senha', 'Instalar o aplicativo indicado'], 0, 'O banco nunca pede isso.'),
      Q('p4', 'O que conferir antes de confirmar um Pix?', ['O nome de quem vai receber', 'A cor do aplicativo', 'A hora', 'A bateria'], 0, 'Leia o nome do recebedor.'),
      Q('p4', 'Caiu no golpe do Pix. Qual o primeiro passo?', ['Avisar o banco imediatamente e pedir o MED', 'Esperar uma semana', 'Fazer outro Pix', 'Apagar o aplicativo'], 0, 'Quanto mais rápido, maior a chance de devolução.'),
      Q('p5', 'Qual destas é uma das 3 perguntas antes de agir?', ['Consigo confirmar por outro caminho?', 'Quantas curtidas vou ganhar?', 'Qual a cor do link?', 'Está chovendo?'], 0, 'Confirmar por outro caminho desmonta o golpe.'),
      Q('p5', 'Para que serve uma palavra-segredo combinada com a família?', ['Confirmar que é mesmo o parente pedindo ajuda', 'Abrir o banco', 'Ligar o Wi-Fi', 'Entrar no e-mail'], 0, 'Golpistas não sabem a palavra combinada.'),
    ],
  };

  C['d7-a08'] = {
    titulo: 'Como identificar sites seguros',
    subtitulo: 'O cadeado, o https, o endereço certo e os sinais de um site falso antes de digitar seus dados.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O cadeado e o https', blocos: [
        { p: 'Na barra de endereço, sites que usam **https** mostram um **cadeado** [[cadeado]] (ou um ícone de configurações). Isso quer dizer que a **conexão é criptografada**: o que você digita viaja embaralhado.' },
        { fig: 'cadeado', legenda: 'Endereço certo com cadeado x endereço esquisito.' },
        { destaque: { tom: 'atencao', titulo: 'Cadeado não é tudo', texto: 'O cadeado garante que a conexão é protegida, **não** que o site é honesto. Muitos sites falsos também têm cadeado. Por isso, confira **sempre o endereço**.' } },
      ] },
      { id: 'p2', titulo: 'Lendo o endereço', blocos: [
        { p: 'O mais importante é o **nome do site** que vem logo antes do **.com.br** (ou .gov.br, .com). Golpistas criam nomes **parecidos**:' },
        { tabela: { cab: ['Endereço', 'É confiável?'], linhas: [
          ['www.meubanco.com.br', 'Sim, se for o endereço oficial do seu banco'],
          ['www.meubanco.com.br.promocao.xyz', 'Não! O site de verdade é “promocao.xyz”'],
          ['www.meu-banco-seguro.com', 'Desconfie: nome diferente do oficial'],
          ['www.rneubanco.com.br', 'Golpe: “rn” imita a letra “m”'],
        ] } },
        { destaque: { tom: 'dica', titulo: 'Leia de trás para frente', texto: 'Ache a primeira barra ( / ) depois do endereço e leia para trás: o que vem logo antes do final (.com.br, .xyz) é o site de verdade.' } },
      ] },
      { id: 'p3', titulo: 'Sinais de site falso', blocos: [
        { checklist: [
          'Preços **muito abaixo** do mercado.',
          'Pagamento **só por Pix** ou transferência.',
          'Site **novo**, sem informações de contato, CNPJ ou endereço.',
          'Erros de português e imagens de baixa qualidade.',
          'Contagem regressiva e pressão: “Só hoje! Últimas unidades!”.',
          'Você chegou por um **link de mensagem** ou anúncio, não digitando o endereço.',
        ] },
      ] },
      { id: 'p4', titulo: 'Como verificar uma loja', blocos: [
        { passos: [
          'Pesquise o **nome da loja + reclamação** no buscador.',
          'Veja a reputação em sites de reclamação de consumidores.',
          'Confira se o site mostra **CNPJ**; pesquise o CNPJ para ver se a empresa existe e há quanto tempo.',
          'Procure as **redes sociais** oficiais da loja e veja comentários de clientes.',
        ] },
        { destaque: { tom: 'saiba', titulo: 'Bancos e governo', texto: 'Para banco, use o **aplicativo oficial** ou digite o endereço. Serviços do governo brasileiro terminam em **.gov.br**.' } },
      ] },
      { id: 'p5', titulo: 'Avisos do navegador', blocos: [
        { p: 'Os navegadores conhecem muitos sites perigosos. Se aparecer uma tela **vermelha** dizendo “**Site enganoso à frente**” ou “**Sua conexão não é particular**”:' },
        { lista: [
          'Clique em **Voltar para a segurança**.',
          'Não clique em “Avançado” > “Continuar mesmo assim”.',
          'Se era um site que você precisa muito, digite o endereço oficial de novo, com calma.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Use os favoritos', texto: 'Salve nos **favoritos** os sites que você usa para pagar e comprar. Assim você não depende de links nem de anúncios.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que significa o cadeado na barra de endereço?', ['Que a conexão é criptografada', 'Que o site é honesto com certeza', 'Que o site é do governo', 'Que é grátis'], 0, 'O cadeado protege a conexão, mas não garante a honestidade.'),
      Q('p1', 'Sites falsos podem ter cadeado?', ['Sim, por isso é preciso conferir o endereço', 'Não, nunca', 'Só os do governo', 'Só no celular'], 0, 'Muitos golpes têm cadeado.'),
      Q('p2', 'Em www.meubanco.com.br.promocao.xyz, qual é o site de verdade?', ['promocao.xyz', 'meubanco.com.br', 'www', 'banco'], 0, 'O que vem logo antes do final (.xyz) é o site real.'),
      Q('p2', 'O endereço www.rneubanco.com.br tenta enganar como?', ['Usando “rn” para imitar a letra “m”', 'Usando cadeado', 'Usando https', 'Não engana'], 0, 'Letras parecidas imitam nomes oficiais.'),
      Q('p3', 'Qual destes é sinal de loja falsa?', ['Pagamento só por Pix e preço muito abaixo do mercado', 'CNPJ e endereço visíveis', 'Anos de avaliações positivas', 'Várias formas de pagamento'], 0, 'Preço baixo demais e só Pix são sinais de golpe.'),
      Q('p3', 'Chegou numa loja por um link de mensagem. Isso:', ['Pede mais atenção: confira o endereço', 'É sempre seguro', 'É obrigatório', 'Dá desconto'], 0, 'Links de mensagem são o caminho preferido dos golpes.'),
      Q('p4', 'Como verificar a reputação de uma loja?', ['Pesquisar o nome da loja + reclamação', 'Comprar e ver o que acontece', 'Perguntar à própria loja', 'Não é possível'], 0, 'Reclamações de outros clientes revelam problemas.'),
      Q('p4', 'Como terminam os sites do governo brasileiro?', ['.gov.br', '.xyz', '.loja', '.net'], 0, 'Sites oficiais do governo terminam em .gov.br.'),
      Q('p5', 'O navegador mostra “Site enganoso à frente”. O que fazer?', ['Voltar para a segurança', 'Continuar mesmo assim', 'Desligar o antivírus', 'Mandar o link para amigos'], 0, 'Siga o aviso e volte.'),
      Q('p5', 'Qual dica evita cair em sites falsos ao pagar?', ['Usar os favoritos para os sites que você usa', 'Clicar em anúncios', 'Usar links de mensagens', 'Pesquisar só pelo preço'], 0, 'Favoritos levam sempre ao endereço certo.'),
    ],
  };

  C['d7-a09'] = {
    titulo: 'Boas práticas e cópias de segurança',
    subtitulo: 'Backup, nuvem, Wi-Fi público, celular perdido e uma rotina de cuidados para o dia a dia.',
    leitura: 10,
    partes: [
      { id: 'p1', titulo: 'O que é backup', blocos: [
        { p: '**Backup** [[nuvem]] é uma **cópia de segurança** dos seus arquivos guardada em **outro lugar**. Se o computador quebrar, for roubado ou pegar ransomware, você não perde nada.' },
        { fig: 'backup', legenda: 'Os arquivos copiados para a nuvem e para um pendrive.' },
      ] },
      { id: 'p2', titulo: 'Onde fazer backup', blocos: [
        { tabela: { cab: ['Onde', 'Vantagem', 'Atenção'], linhas: [
          ['Nuvem (Google Drive, OneDrive, iCloud)', 'Automático e acessível de qualquer lugar', 'Espaço grátis limitado'],
          ['HD externo ou pendrive', 'Não depende de internet', 'Pode ser perdido ou estragar'],
          ['Google Fotos / Fotos do iCloud', 'Salva as fotos do celular sozinho', 'Ative o backup nas configurações'],
        ] } },
        { destaque: { tom: 'saiba', titulo: 'A regra 3-2-1', texto: 'Tenha **3** cópias dos arquivos importantes, em **2** lugares diferentes, sendo **1** fora de casa (como a nuvem).' } },
      ] },
      { id: 'p3', titulo: 'Wi-Fi e computadores públicos', blocos: [
        { checklist: [
          'Em Wi-Fi público, evite banco e compras. Prefira os **dados móveis**.',
          'Desconfie de redes com nomes genéricos como “Wi-Fi Grátis”.',
          'Em computadores públicos, use a **janela anônima** e clique em **Sair** de todas as contas.',
          'Nunca marque “**Lembrar senha**” em computador que não é seu.',
          'Desligue o **Bluetooth** quando não estiver usando.',
        ] },
      ] },
      { id: 'p4', titulo: 'Celular perdido ou roubado', blocos: [
        { p: 'Prepare-se **antes** de acontecer:' },
        { lista: [
          'Ative o **Encontre meu dispositivo** (Android) ou o **Buscar** (iPhone): mostra no mapa, toca alarme e apaga o celular à distância.',
          'Anote o **IMEI** do celular (digite {{*#06#}} no discador) e guarde num lugar seguro.',
          'Use bloqueio de tela e não deixe senhas anotadas no celular.',
        ] },
        { p: 'Se acontecer: bloqueie a linha com a operadora, avise o banco, troque as senhas a partir de outro aparelho, registre um boletim de ocorrência e use o **Celular Seguro**, serviço do governo para bloquear aparelhos roubados.' },
      ] },
      { id: 'p5', titulo: 'Checklist de segurança', blocos: [
        { p: 'Para fechar a disciplina, uma rotina simples:' },
        { checklist: [
          '**Toda semana:** atualize os aplicativos.',
          '**Todo mês:** confira os aparelhos conectados nas suas contas.',
          '**Sempre:** desconfie de pressa, prêmios e pedidos de código.',
          '**Senhas:** fortes, diferentes e num gerenciador.',
          '**Duas etapas:** ativas no e-mail, WhatsApp, redes e banco.',
          '**Backup:** automático das fotos e dos documentos.',
        ] },
        { destaque: { tom: 'dica', titulo: 'Ensine alguém', texto: 'Compartilhe o que aprendeu com a família, principalmente com os mais velhos e os mais novos: eles são os alvos preferidos dos golpistas.' } },
      ] },
    ],
    perguntas: [
      Q('p1', 'O que é backup?', ['Uma cópia de segurança dos arquivos em outro lugar', 'Um vírus', 'Um tipo de senha', 'Um navegador'], 0, 'Backup é uma cópia guardada em outro lugar.'),
      Q('p1', 'Para que serve o backup?', ['Não perder os arquivos se o aparelho quebrar ou for roubado', 'Deixar o computador mais rápido', 'Mudar o papel de parede', 'Apagar vírus'], 0, 'Com backup, os arquivos estão a salvo.'),
      Q('p2', 'O que diz a regra 3-2-1?', ['3 cópias, em 2 lugares, sendo 1 fora de casa', '3 senhas, 2 e-mails, 1 celular', '3 antivírus, 2 navegadores, 1 PC', 'Nada'], 0, 'A regra 3-2-1 garante cópias seguras.'),
      Q('p2', 'Qual é um exemplo de backup na nuvem?', ['Google Drive', 'Um papel na gaveta', 'A Lixeira', 'O Bloco de Notas'], 0, 'Drive, OneDrive e iCloud são nuvens.'),
      Q('p3', 'No Wi-Fi público, o que evitar?', ['Acessar o banco e fazer compras', 'Ver a previsão do tempo', 'Ler notícias', 'Ver mapas'], 0, 'Para dados importantes, prefira os dados móveis.'),
      Q('p3', 'Em computador público, nunca marque:', ['Lembrar senha', 'Janela anônima', 'Sair', 'Fechar'], 0, 'A senha ficaria salva para o próximo usuário.'),
      Q('p4', 'Como descobrir o IMEI do celular?', ['Digitando *#06# no discador', 'Olhando o papel de parede', 'Pela calculadora', 'Não é possível'], 0, 'O *#06# mostra o IMEI.'),
      Q('p4', 'O que o “Encontre meu dispositivo” permite?', ['Ver no mapa, tocar alarme e apagar o celular à distância', 'Carregar a bateria', 'Ligar de graça', 'Aumentar a memória'], 0, 'Ele ajuda a localizar e proteger o aparelho perdido.'),
      Q('p5', 'Com que frequência atualizar os aplicativos, segundo o checklist?', ['Toda semana', 'Uma vez por ano', 'Nunca', 'Só quando quebrar'], 0, 'Atualizações frequentes fecham falhas.'),
      Q('p5', 'Por que ensinar a família sobre segurança?', ['Idosos e crianças são alvos preferidos de golpistas', 'Para ganhar dinheiro', 'Porque é obrigatório', 'Não precisa'], 0, 'Compartilhar o conhecimento protege quem você ama.'),
    ],
  };

  C['d7-av'] = {
    titulo: 'Avaliação: Segurança Digital',
    subtitulo: '30 perguntas sobre as Aulas 01 a 09. Não há material para consultar: responda com o que você aprendeu.',
    avaliacao: { aulas: ['d7-a01', 'd7-a02', 'd7-a03', 'd7-a04', 'd7-a05', 'd7-a06', 'd7-a07', 'd7-a08', 'd7-a09'] },
  };
})();
