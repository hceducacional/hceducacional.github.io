/* =========================================================
   LIÇÃO 02 — Teclas U, R e K (30 níveis)
   Só os dados ficam aqui; quem desenha e roda os níveis é o curso/licao.js (o mesmo para todas as lições).
   Tudo usa só as teclas já aprendidas (F, J e Espaço) mais as novas (U, R e K).

   Curva de aprendizagem:
   1. Descoberta (1–4) ......... U (indicador direito sobe), R (indicador esquerdo sobe) e K (médio direito),
                                 cada uma num estilo do acervo; depois duplas que vão e voltam da casa.
   2. Ritmo (6–8) .............. "palavras-treino" de 3 a 5 letras (fur, juk, ruf…) em cartões e numa torre.
   3. A sombra ganha letras (10 em diante)
      A sombra das palavras da Lição 01 continua, agora com as letras novas de verdade:
      U, R e K aparecem como elas mesmas; as outras letras seguem a regra antiga
      (mão esquerda → F, mão direita → J). Ex.: "uma rua" → "ujf ruf".
   4. Consolidação: textos mais longos, sprint, a ponte para a Lição 03 e o desafio final.
   Minijogos do acervo (MJ) entre os níveis: Varredura Hacker, Travessia dos Balões, Fila de Ancoragem,
   Corrida das Teclas, Resgate das Teclinhas, Palavras das Estrelas, Duelo no Penhasco, Saltos na Rede,
   Grande Prêmio das Teclas e Patrulha das Palavras — todos sorteando só F, J, U, R, K e Espaço.
   ========================================================= */
(() => {
  const ESQ = 'qwertasdfgzxcvbáàâãäéèêë';
  const DIR = 'yiophjlçnmíìîóòôõöúùûü';
  const NOVAS = 'urk'; // estas aparecem como elas mesmas na sombra
  /* "Uma rua curta" → sombra "uma rua curta" e texto "ujf ruf furuf" */
  function sombra(frase) {
    const s = frase.toLowerCase().replace(/[^a-zà-üç ]/g, '').replace(/\s+/g, ' ').trim();
    const t = [...s].map((c) => (c === ' ' ? ' ' : NOVAS.includes(c) ? c : ESQ.includes(c) ? 'f' : DIR.includes(c) ? 'j' : '')).join('');
    return { sombra: s, texto: t };
  }
  const F = (o) => Object.assign(o, sombra(o.frase), { tipo: 'typing' });
  // palavras-treino (só com F, J, U, R e K) para os minijogos de palavras
  const PALAVRAS = ['fur', 'juk', 'ruf', 'kuf', 'uru', 'fuk', 'juru', 'kufu', 'rufu', 'jurk', 'fruk', 'kruf', 'ruju', 'fuku', 'kuju', 'furu', 'jukur', 'rukuf', 'frufu', 'kujuf', 'fujur', 'rurfu'];

  (window.HC_LICOES ||= {})['licao-2'] = {
    id: 'licao-2',
    numero: '02',
    titulo: 'Teclas U, R e K',
    teclas: ['r', 'f', ' ', 'j', 'u', 'k'],
    novas: ['u', 'r', 'k'], // as teclas que aparecem na capa da lição
    intro: 'Os indicadores saem de casa pela primeira vez: o direito sobe para o U, o esquerdo sobe para o R, e o dedo médio direito entra em cena no K. Depois de cada toque, os dedos voltam para F e J.',
    cards: [
      ['U, R e K', 'Os indicadores sobem uma fileira e o médio direito chega ao K, sempre voltando para F e J (teclas do fundo, jardim, trilha e outras cenas).'],
      ['A sombra ganha letras', 'A sombra das palavras continua: agora o U, o R e o K aparecem de verdade nas frases.'],
      ['Minijogos', 'Varredura Hacker, Balões, Fila, Corrida, Resgate, Estrelas, Duelo, Saltos, Grande Prêmio e Patrulha.'],
    ],
    niveis: [
      /* 1 · DESCOBERTA */
      { tipo: 'typing', titulo: 'Introdução à tecla U (indicador direito)', nova: 'u', esteira: true, dica: 'O indicador direito sai do J, sobe um pouquinho para a esquerda até o U e volta para casa.', texto: 'u u u u ju ju uj uj juj uju' },
      { tipo: 'typing', titulo: 'Introdução à tecla R (indicador esquerdo)', nova: 'r', jardim: true, dica: 'Agora o indicador esquerdo: sai do F, sobe um pouquinho para a esquerda até o R e volta. Cada toque, uma flor!', texto: 'r r r r fr fr rf rf frf rfr' },
      { tipo: 'typing', titulo: 'Introdução à tecla K (médio direito)', nova: 'k', trilha: true, dica: 'O dedo médio direito descansa no K, ao lado do J. As folhas são os espaços: um toque leve do polegar.', texto: 'k k k k jk jk kj kj jkj kjk' },
      { tipo: 'typing', titulo: 'Subir e voltar para casa', partitura: true, dica: 'Cada dupla sai de casa e volta. Escute: cada tecla nova toca a sua própria nota.', texto: 'fr ju jk rf uj kj fr ju jk ur ru uk ku' },
      { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker', dica: 'Tecle a tecla destacada antes que o tempo acabe. Agora são seis teclas: olhe a letra e confie nos dedos!', meta: 10, velocidade: 1.6 },

      /* 2 · RITMO: palavras-treino */
      { tipo: 'typing', titulo: 'Palavras-treino de três letras', cartoes: true, dica: 'Não são palavras de verdade, mas têm o ritmo delas: digite o cartão inteiro e só então o Espaço.', texto: 'fur juk ruf kuf uru fuk juk ruf' },
      { tipo: 'baloes', titulo: 'Minijogo: Travessia dos Balões', dica: 'Tecle a letra do balão que brilha. O seu balão vai descendo: tecle a próxima antes que ele chegue às nuvens!', meta: 20 },
      { tipo: 'typing', titulo: 'Palavras de tamanhos diferentes', torre: true, dica: 'Cada palavra vira um andar da torre. Curta ou longa, o ritmo é o mesmo.', texto: 'u fur juru k rufu jk fruk ur kufu jurk' },
      { tipo: 'fila', titulo: 'Minijogo: Fila de Ancoragem', dica: 'Seis colunas agora! Tecle cada tecla quando ela chegar ao alvo. Meta: 50 acertos.', meta: 50 },

      /* 3 · A SOMBRA GANHA LETRAS */
      F({
        titulo: 'A sombra ganha letras', frase: 'Uma rua curta',
        dica: 'U, R e K você digita como são. As outras letras seguem a regra da Lição 01: esquerda → F, direita → J.',
        apresenta: {
          tag: 'Novo desafio', titulo: 'A sombra ganha letras',
          texto: 'Lembra da sombra das palavras? Agora ela fica mais parecida com a frase de verdade: o U, o R e o K aparecem como eles mesmos. As outras letras continuam virando F (mão esquerda) ou J (mão direita).',
          exemplo: sombra('uma rua'),
        },
      }),
      { tipo: 'corrida', titulo: 'Minijogo: Corrida das Teclas', dica: 'Quando um vírus entrar na faixa verde, tecle a tecla dele e o robô dispara o laser. Quanto mais perto, melhor!', meta: 25 },
      F({ titulo: 'Sombra: o carro na rua', frase: 'O carro roda pela rua', dica: 'Repare quantos R e U essa frase tem: eles aparecem de verdade na sombra.' }),
      { tipo: 'resgate', titulo: 'Minijogo: Resgate das Teclinhas', dica: 'Digite a letra de cada teclinha antes que a nave-vírus a puxe para cima. Salve todas!', meta: 20 },
      { tipo: 'typing', titulo: 'Fila de dominós', domino: true, dica: 'Cada letra certa derruba uma peça. Mantenha os dedos perto de casa para não perder o ritmo.', texto: 'ruk kur fur juk uru kuk ruf fuk' },
      F({ titulo: 'Sombra: o kart na pista', frase: 'O kart corre rápido na pista curva', dica: 'Um K de verdade! O dedo médio direito vai e volta sem tirar o indicador do J.' }),
      { tipo: 'estrelas', titulo: 'Minijogo: Palavras das Estrelas', dica: 'Digite a palavra de uma estrela antes que o anel acabe. Palavras longas valem mais, e Backspace troca de estrela.', meta: 12, palavras: PALAVRAS },
      { tipo: 'typing', titulo: 'Cofre de senhas', cofre: true, dica: 'Cada palavra é uma senha: digite certinho e aperte Espaço para abrir o cofre.', texto: 'kuf ruju fruk jurk kufu rufu' },
      F({ titulo: 'Sombra: o primeiro toque', frase: 'Tudo começa com um primeiro toque', dica: 'Precisão antes de velocidade: um toque certo vale mais do que três apressados.' }),
      { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker intermediária', dica: 'Os pacotes chegam mais rápido. Alterne entre as seis teclas sem olhar para baixo.', meta: 15, velocidade: 1.9 },
      { tipo: 'typing', titulo: 'Roda-gigante', roda: true, dica: 'A cabine de baixo é a da vez: cada letra certa embarca e a roda gira.', texto: 'fur ruf juk kuj uru rur kuk fuf' },
      F({ titulo: 'Sombra: um pouco por dia', frase: 'Quem pratica um pouco por dia aprende muito', dica: 'A frase já passa da tela e corre como numa máquina de escrever. Olhe só para o cursor.' }),
      { tipo: 'duelo', titulo: 'Minijogo: Duelo no Penhasco', dica: 'Digite a palavra de cima: cada letra certa arremessa um orbe que empurra o monstro. Derrube-o do penhasco!', meta: 6, palavras: PALAVRAS },
      { tipo: 'typing', titulo: 'Ligue os pontos', pontos: true, dica: 'Cada letra certa liga o próximo ponto. Que desenho será?', texto: 'fur juk ruf kuf uru jurk' },
      F({ titulo: 'Sombra: o mundo no teclado', frase: 'Uma rua, um bairro, uma cidade: o mundo cabe no teclado', dica: 'Um texto mais longo: relaxe os ombros e mantenha o mesmo ritmo do começo ao fim.' }),
      { tipo: 'saltos', titulo: 'Minijogo: Saltos na Rede', dica: 'Digite a palavra em cima de cada obstáculo antes de o robô chegar nele: assim ele pula por cima!', meta: 10, palavras: PALAVRAS },

      /* 4 · CONSOLIDAÇÃO */
      { tipo: 'typing', titulo: 'Sprint de ritmo', fogos: true, dica: 'Um pouco de velocidade: cada bloco é um foguete e o Espaço solta os fogos!', texto: 'fur fur juk juk ruf ruf kuf kuf uru uru jurk' },
      F({ titulo: 'Sombra: o que vem por aí', frase: 'Na próxima lição chegam o D, o E e o I', dica: 'Olhe a letra pequena do D, do E e do I: você já sabe de que lado cada uma vai ficar.' }),
      { tipo: 'gp', titulo: 'Minijogo: Grande Prêmio das Teclas', dica: 'Digite a frase para o seu robô correr. Cada letra certa é um passo rumo à linha de chegada!', ppm: 14, frases: ['fur juk ruf kuf uru juru fruk', 'kufu rufu jurk fur juk ruf', 'uru kruf ruju fuku jukur fur'] },
      F({ titulo: 'O grande texto final', frase: 'Parabéns! Seus dedos já sabem subir para o U e o R e chegar ao K sem perder o caminho de casa. Cada tecla nova deixa o seu texto mais rápido e mais certo', dica: 'A consolidação de tudo: o texto mais longo da lição, com as letras novas de verdade.' }),
      { tipo: 'nave', titulo: 'Desafio final: Patrulha das Palavras', dica: 'Digite a palavra de um asteroide antes que ele bata na nave. O dourado vale 4× os pontos, e Backspace troca de alvo.', meta: 15, palavras: PALAVRAS },
    ],
  };
})();
