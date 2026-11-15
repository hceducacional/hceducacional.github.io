/* =========================================================
   LIÇÃO 01 — Conhecendo J, F e Espaço (30 níveis)
   Recriada a partir do treino feito no Lovable. Só os dados ficam aqui;
   quem desenha e roda os níveis é o curso/licao.js (o mesmo para todas as lições).

   Tipos de nível:
   - typing:  digitar o texto (cada tecla certa avança; a errada não avança)
   - hacker:  "Varredura Hacker" — tecle o alvo antes do tempo acabar (meta = acertos)
   - fila:    "Fila de Ancoragem" — tecle a tecla que chega no alvo (meta = teclas)
   - memoria: "Eco da Memória" — repita a sequência que acende (uma rodada por tamanho)
   ========================================================= */
(window.HC_LICOES ||= {})['licao-1'] = {
  id: 'licao-1',
  numero: '01',
  titulo: 'Conhecendo J, F e Espaço',
  teclas: ['f', ' ', 'j'],
  intro: 'Aprenda a digitar sem olhar para o teclado começando pelas três teclas da linha de referência: F, J e a barra de espaço.',
  cards: [
    ['Mão esquerda (F)', 'Níveis graduais para firmar o toque e a independência do indicador esquerdo.'],
    ['Mão direita (J)', 'O relevo da tecla J como ponto de apoio e a agilidade do indicador direito.'],
    ['Minijogos', 'Desafios de reflexo, ritmo e memória: Varredura Hacker, Fila de Ancoragem e Eco da Memória.'],
  ],
  niveis: [
    { tipo: 'typing', titulo: 'Introdução à tecla F (indicador esquerdo)', dica: 'Sinta a pequena saliência na tecla F. Posicione o seu dedo indicador esquerdo nela.', texto: 'f f f f f f f f f f f f' },
    { tipo: 'typing', titulo: 'Introdução à tecla J (indicador direito)', dica: 'Sinta o relevo na tecla J. Posicione o seu dedo indicador direito nela.', texto: 'j j j j j j j j j j j j' },
    { tipo: 'typing', titulo: 'Alternância inicial F e J', dica: 'Mantenha os dois dedos apoiados e alterne com ritmo entre a esquerda e a direita.', texto: 'f j f j f j f j f j f j' },
    { tipo: 'typing', titulo: 'Ativação da barra de espaço (polegares)', dica: 'Use o polegar (direito ou esquerdo) para pressionar suavemente a barra de espaço.', texto: 'f j f j f j f j f j f j' },
    { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker inicial', dica: 'Destrua as ameaças virtuais! Tecle a tecla destacada na tela antes que o tempo acabe.', meta: 10, velocidade: 1.6 },
    { tipo: 'typing', titulo: 'Agrupamentos e cadência', dica: 'Dois toques rápidos com cada indicador antes de trocar de lado.', texto: 'ff jj ff jj ff jj ff jj' },
    { tipo: 'typing', titulo: 'O toque triplo de fixação', dica: 'Pratique o ritmo de três toques seguidos, mantendo os pulsos relaxados.', texto: 'fff jjj fff jjj fff jjj' },
    { tipo: 'fila', titulo: 'Minijogo: Fila de Ancoragem', dica: 'Siga as colunas! Tecle cada tecla quando ela chegar ao alvo. Meta: 50 acertos.', meta: 50 },
    { tipo: 'typing', titulo: 'Cadência assimétrica simples', dica: 'Atenção à proporção: dois toques à esquerda e um à direita.', texto: 'ff j ff j ff j ff j ff j' },
    { tipo: 'memoria', titulo: 'Minijogo: Eco da Memória', dica: 'Preste atenção à ordem em que as teclas acendem e repita exatamente igual.', rodadas: [3, 4] },
    { tipo: 'typing', titulo: 'Espaçamentos de pausa curta', dica: 'Sincronize a pausa do polegar com os indicadores.', texto: 'f j f j ff jj f j f j' },
    { tipo: 'typing', titulo: 'Simetria invertida dos dedos', dica: 'Comece pelo indicador direito para equilibrar o costume das mãos.', texto: 'jj ff jj ff jj ff jj ff' },
    { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker intermediária', dica: 'Intercepte os pacotes de dados alternando a digitação rápida dentro do tempo.', meta: 15, velocidade: 1.8 },
    { tipo: 'typing', titulo: 'Progressão em pirâmide cruzada', dica: 'Exercício de aumentar e diminuir a quantidade de toques.', texto: 'f ff f j jj j f ff f j jj j' },
    { tipo: 'typing', titulo: 'Controle de espaços duplos', dica: 'Firme a barra de espaço para cadenciar tempos mais lentos de digitação.', texto: 'f  j  f  j  ff  jj  ff  jj' },
    { tipo: 'fila', titulo: 'Minijogo: Fila de Ancoragem veloz', dica: 'A fila acelerou e aumentou! Tecle com ritmo e precisão as 65 teclas.', meta: 65 },
    { tipo: 'typing', titulo: 'Maratona do indicador esquerdo', dica: 'Série longa para criar resistência no dedo da tecla F.', texto: 'ffff ffff ffff ffff ffff' },
    { tipo: 'typing', titulo: 'Maratona do indicador direito', dica: 'A mesma série de resistência, agora só na tecla J.', texto: 'jjjj jjjj jjjj jjjj jjjj' },
    { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker acelerada', dica: 'Uma tempestade de pacotes está cruzando os servidores! Limpe o tráfego de dados.', meta: 18, velocidade: 2.5 },
    { tipo: 'typing', titulo: 'Alternância ágil de pares', dica: 'Troque de lado rapidamente, alternando duplas de letras sem parar.', texto: 'ff jj ff jj ff jj ff jj ff jj' },
    { tipo: 'typing', titulo: 'Controle de intervalo longo', dica: 'Acione a barra de espaço alternando os polegares.', texto: 'f   j   f   j   f   j   f   j' },
    { tipo: 'typing', titulo: 'Sequências invertidas em cadência', dica: 'Padrões espelhados para dar autonomia a cada mão.', texto: 'j f j f j f j f j f j f j f' },
    { tipo: 'hacker', titulo: 'Minijogo: Varredura Hacker profissional', dica: 'Os dados estão criptografados. Decodifique os sinais com máxima sincronia.', meta: 20, velocidade: 2.7 },
    { tipo: 'typing', titulo: 'Cadências assimétricas complexas', dica: 'Ritmos que imitam a digitação de frases de verdade.', texto: 'fff j fff j fff j fff j' },
    { tipo: 'typing', titulo: 'Padrão em onda crescente', dica: 'Aceleração gradual, aumentando os toques aos poucos.', texto: 'f j ff jj fff jjj f j fj' },
    { tipo: 'fila', titulo: 'Minijogo: Fila de Ancoragem de precisão extrema', dica: 'O desafio final da fila! Tecle 80 teclas com velocidade e coordenação.', meta: 80 },
    { tipo: 'typing', titulo: 'Concentração alternada sob pressão', dica: 'Foco nos intervalos e nas trocas difíceis entre toques.', texto: 'f j f j   j f j f   f j f j' },
    { tipo: 'memoria', titulo: 'Minijogo: Memória suprema', dica: 'Sequências de até 6 teclas para fixar de vez a linha de referência.', rodadas: [4, 5, 6] },
    { tipo: 'typing', titulo: 'A grande sinfonia de F, J e Espaço', dica: 'A consolidação de tudo: o texto mais longo e completo da lição.', texto: 'f j ff jj fff jjj f j fj fj f j fj f j' },
    { tipo: 'hacker', titulo: 'Desafio final: Varredura Hacker suprema', dica: 'Defesa total! Responda rápido aos fluxos alternados.', meta: 25, velocidade: 3.2 },
  ],
};
