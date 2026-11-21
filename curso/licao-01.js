/* =========================================================
   LIÇÃO 01 — Conhecendo J, F e Espaço (30 níveis)
   Só os dados ficam aqui; quem desenha e roda os níveis é o curso/licao.js (o mesmo para todas as lições).

   Curva de aprendizagem (cada fase prepara a seguinte):
   1. Descoberta (1–4) ......... onde ficam F, J e Espaço; textos curtos, sem cansar
   2. Ritmo (6–7) .............. duplas, trios e "palavras" de F e J com tamanhos variados
   3. A sombra das palavras (9 em diante)
      Com só duas letras não dá para escrever palavras de verdade, mas dá para digitar o RITMO delas:
      cada letra de uma frase real é batida pela mão que a digitaria no teclado completo
      (mão esquerda → F, mão direita → J). O aluno lê a frase de verdade em cima de cada tecla,
      já vai aprendendo de que lado fica cada letra (o que adianta as próximas lições)
      e as frases crescem até virar um texto que corre como numa máquina de escrever.
   4. Consolidação: frases mais longas, espelhos, sprint e a ponte para a Lição 02.

   Tipos de nível:
   - typing:  digitar o texto (cada tecla certa avança; a errada não avança).
              nova: 'x'   → o nível começa apresentando a tecla nova ("Pressione a tecla X").
              frase: '…'  → o texto vira o ritmo das mãos daquela frase (a frase aparece em cima de cada tecla).
              apresenta   → um cartão explicando o desafio novo antes de começar.
   - hacker:  "Varredura Hacker" — tecle o alvo antes do tempo acabar (meta = acertos)
   - fila:    "Fila de Ancoragem" — tecle a tecla que chega no alvo (meta = teclas)
   - corrida: "Corrida das Teclas" — tecle a tecla de cada vírus quando ele entrar na faixa; o robô o elimina com um laser (meta = vírus)
   ========================================================= */
(() => {
  // teclado ABNT2: o que cada mão digita com a técnica de dez dedos
  const ESQ = 'qwertasdfgzxcvbáàâãäéèêë';
  const DIR = 'yuiophjklçnmíìîóòôõöúùûü';
  /* "Bom dia, turma!" → sombra "bom dia turma" e texto "ffj fjf fjffj" */
  function sombra(frase) {
    const s = frase.toLowerCase().replace(/[^a-zà-üç ]/g, '').replace(/\s+/g, ' ').trim();
    const t = [...s].map((c) => (c === ' ' ? ' ' : ESQ.includes(c) ? 'f' : DIR.includes(c) ? 'j' : '')).join('');
    return { sombra: s, texto: t };
  }
  const F = (o) => Object.assign(o, sombra(o.frase), { tipo: 'typing' });

  (window.HC_LICOES ||= {})['licao-1'] = {
    id: 'licao-1',
    numero: '01',
    titulo: 'Conhecendo J, F e Espaço',
    teclas: ['f', ' ', 'j'],
    intro: 'Aprenda a digitar sem olhar para o teclado começando pelas três teclas da linha de referência: F, J e a barra de espaço. Depois, use só essas três teclas para digitar o ritmo de frases de verdade.',
    cards: [
      ['F, J e Espaço', 'Os dois relevos da linha de referência e os polegares: a base de toda a digitação.'],
      ['A sombra das palavras', 'Digite o ritmo de frases reais: cada letra vira F ou J conforme a mão que a digitaria.'],
      ['Minijogos', 'Desafios de reflexo e ritmo: Varredura Hacker, Fila de Ancoragem e Corrida das Teclas.'],
    ],
    niveis: [
      /* 1 · DESCOBERTA */
      { tipo: 'typing', titulo: 'Introdução à tecla F (indicador esquerdo)', nova: 'f', dica: 'Sinta a pequena saliência na tecla F. Posicione o seu dedo indicador esquerdo nela.', texto: 'f f f f f f f f' },
      { tipo: 'typing', titulo: 'Introdução à tecla J (indicador direito)', nova: 'j', dica: 'Sinta o relevo na tecla J. Posicione o seu dedo indicador direito nela.', texto: 'j j j j j j j j' },
      { tipo: 'typing', titulo: 'Os polegares na barra de espaço', nova: ' ', dica: 'Indicadores em F e J, polegares descansando na barra. Um toque leve, sem tirar os outros dedos do lugar.', texto: 'f j f j f j f j' },
      { tipo: 'typing', titulo: 'Duplas e trocas de lado', dica: 'Dois toques de cada lado, depois trocas rápidas. Não olhe para o teclado: o relevo mostra o caminho.', texto: 'ff jj ff jj fj fj jf jf' },
      { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker inicial', dica: 'Destrua as ameaças virtuais! Tecle a tecla destacada na tela antes que o tempo acabe.', meta: 10, velocidade: 1.6 },

      /* 2 · RITMO: blocos que já têm cara de palavra */
      { tipo: 'typing', titulo: 'Primeiras palavras de duas e três letras', dica: 'Pense em cada bloco como uma palavra: digite o bloco inteiro e só então o espaço.', texto: 'fj jf ff jj fjf jfj ffj jjf fjf jfj' },
      { tipo: 'typing', titulo: 'Palavras de tamanhos diferentes', dica: 'Textos de verdade têm palavras curtas e longas. Mantenha o mesmo ritmo em todas.', texto: 'f jff fjjf j ffjj jf fjfj jjf f fjjff' },
      { tipo: 'fila', titulo: 'Minijogo: Fila de Ancoragem', dica: 'Siga as colunas! Tecle cada tecla quando ela chegar ao alvo. Meta: 50 acertos.', meta: 50 },

      /* 3 · A SOMBRA DAS PALAVRAS */
      F({
        titulo: 'A sombra das palavras', frase: 'oi tudo bem',
        dica: 'Leia a letra pequena: se ela fica do lado esquerdo do teclado, tecle F; se fica do lado direito, tecle J.',
        apresenta: {
          tag: 'Novo desafio', titulo: 'A sombra das palavras',
          texto: 'Toda palavra é digitada pelas duas mãos. A partir de agora, você vai digitar o ritmo de frases de verdade: cada letra vira F (mão esquerda) ou J (mão direita).',
          exemplo: sombra('bom dia'),
        },
      }),
      { tipo: 'corrida', titulo: 'Minijogo: Corrida das Teclas', dica: 'Vírus à vista! Quando um vírus entrar na faixa verde, tecle a tecla dele e o robô dispara o laser. Quanto mais perto, melhor a nota!', meta: 25 },
      F({ titulo: 'Sombra: bom dia, turma', frase: 'Bom dia, turma!', dica: 'Repare: o B, o D e o T são da mão esquerda; o O, o M e o I, da direita.' }),
      F({ titulo: 'Sombra: cada mão tem o seu lado', frase: 'A mão esquerda faz o F e a direita faz o J', dica: 'Uma frase sobre você mesmo! Siga a cor da letra pequena: amarelo é esquerda, azul é direita.' }),
      { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker intermediária', dica: 'Intercepte os pacotes de dados alternando a digitação rápida dentro do tempo.', meta: 15, velocidade: 1.8 },
      F({ titulo: 'Sombra: a casa dos dedos', frase: 'Cada dedo tem a sua casa no teclado', dica: 'A frase já passa da tela: ela corre para o lado como numa máquina de escrever. Olhe só para o cursor.' }),
      { tipo: 'typing', titulo: 'Espelhos: palavras que se leem dos dois lados', dica: 'Cada bloco é igual de trás para frente. Sinta a simetria entre as mãos.', texto: 'fjjf jffj ffjjff jjffjj fjfjf jfjfj fjf jfj' },
      { tipo: 'fila', titulo: 'Minijogo: Fila de Ancoragem veloz', dica: 'A fila acelerou e aumentou! Tecle com ritmo e precisão as 65 teclas.', meta: 65 },
      F({ titulo: 'Sombra: sem olhar para baixo', frase: 'Quem digita sem olhar para o teclado ganha tempo', dica: 'Desafio: não olhe para o teclado do começo ao fim. Se errar, a tecla certa acende embaixo.' }),
      F({ titulo: 'Sombra: um provérbio', frase: 'Devagar se vai ao longe', dica: 'Precisão antes de velocidade. Um toque certo vale mais do que três apressados.' }),
      { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker acelerada', dica: 'Uma tempestade de pacotes está cruzando os servidores! Limpe o tráfego de dados.', meta: 18, velocidade: 2.5 },

      /* 4 · CONSOLIDAÇÃO */
      F({ titulo: 'Sombra: o segredo da digitação', frase: 'O segredo da digitação é a constância e não a pressa', dica: 'Um texto mais longo: deixe o papel correr e mantenha o mesmo ritmo do começo ao fim.' }),
      { tipo: 'typing', titulo: 'Sprint de ritmo', dica: 'Agora sim, um pouco de velocidade: blocos curtos, toques firmes, sem parar entre eles.', texto: 'fj fj fj jf jf jf ff jj ff jj fjf jfj fjf jfj' },
      F({ titulo: 'Sombra: uma letra de cada vez', frase: 'Aprender é como digitar: uma letra de cada vez', dica: 'Repare como algumas palavras quase só usam uma mão. "Aprender" é quase toda da esquerda!' }),
      { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker profissional', dica: 'Os dados estão criptografados. Decodifique os sinais com máxima sincronia.', meta: 20, velocidade: 2.7 },
      F({ titulo: 'Sombra: conhecendo o Brasil', frase: 'O Brasil tem vinte e seis estados e um distrito federal', dica: 'A frase mais longa até aqui. Respire, relaxe os ombros e deixe a máquina correr.' }),
      F({ titulo: 'Sombra: o que vem por aí', frase: 'Na próxima lição as letras U, R e K entram em cena', dica: 'Olhe a letra pequena do U, do R e do K: você já sabe de que lado cada uma vai ficar.' }),
      { tipo: 'fila', titulo: 'Minijogo: Fila de Ancoragem de precisão extrema', dica: 'O desafio final da fila! Tecle 80 teclas com velocidade e coordenação.', meta: 80 },
      F({ titulo: 'Sombra: o dia a dia no computador', frase: 'Escrever um e-mail, fazer um trabalho, buscar uma vaga: tudo começa no teclado', dica: 'Digitar bem abre portas. Este é o tipo de texto que você vai escrever de verdade.' }),
      { tipo: 'corrida', titulo: 'Minijogo: Corrida das Teclas turbo', dica: 'A pista mais longa da lição: vírus em dupla e o robô cada vez mais rápido. Busque o Perfeito!', meta: 40 },
      F({ titulo: 'O grande texto final', frase: 'Parabéns! Você chegou ao fim da primeira lição. Seus indicadores já sabem o caminho de casa e seus polegares cuidam dos espaços. Agora é seguir em frente', dica: 'A consolidação de tudo: o texto mais longo da lição, correndo como numa máquina de escrever.' }),
      { tipo: 'hacker', titulo: 'Desafio final: Varredura Hacker suprema', dica: 'Defesa total! Responda rápido aos fluxos alternados.', meta: 25, velocidade: 3.2 },
    ],
  };
})();
