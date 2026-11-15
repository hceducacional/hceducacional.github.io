/* =========================================================
   PLATAFORMA DE INFORMÁTICA — pré-acesso
   O banner marcado como "Só para alunos de Informática" só abre o link para
   quem está marcado como aluno de Informática em Usuários (ou administrador).
   Os demais chegam a esta página, que apresenta o curso:
   - sem login: mostra que é exclusivo para matriculados, com contato e "Entrar";
   - com login, mas sem ser aluno: fala dos benefícios e convida a se matricular;
   - aluno: acesso liberado, com o botão para abrir a plataforma.
   Banco: supabase/07-alunos-informatica.sql (coluna profiles.informatica).
   ========================================================= */
const infoAllowed = () => !!(auth.profile?.informatica || isAdmin());
window.HC_infoAccess = () => auth.ready && infoAllowed();

// link da plataforma: o do banner marcado como "só para alunos de Informática"
const infoUrl = () => {
  const b = [...banners, ...exclusive].find((x) => x.lockInfo && bannerLink(x));
  return b ? bannerLink(b) : '';
};

// aluno (ou administrador) que toca em "Acessar" no banner vai direto para a plataforma
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-info-url]'); if (!a) return;
  if (!window.HC_infoAccess()) return; // segue para a página de apresentação (#informatica)
  e.preventDefault();
  window.open(a.dataset.infoUrl, '_blank', 'noopener');
});

const INFO_PHONE = '5598988650472'; // time comercial: (98) 98865-0472
const INFO_WA = (txt) => `https://wa.me/${INFO_PHONE}?text=${encodeURIComponent(txt)}`;
const INFO_BENEFITS = [
  ['keyboard', 'Digitação com os dez dedos', 'Lições curtas, do básico ao avançado, para você digitar sem olhar para o teclado.'],
  ['speed', 'Velocidade e precisão medidas', 'A plataforma mostra suas palavras por minuto e seus acertos, para você ver a evolução a cada aula.'],
  ['monitor', 'Fundamentos da informática', 'Computador, arquivos e pastas, internet e e-mail: o que você precisa para usar a informática no dia a dia.'],
  ['clock', 'No seu ritmo', 'Pratique quando e onde quiser, com o seu usuário e senha de aluno.'],
];
const INFO_ICONS = {
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
  speed: '<path d="M12 14l4-4"/><path d="M3.3 17a9 9 0 1 1 17.4 0"/>',
};
const infoIcon = (k) => INFO_ICONS[k]
  ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${INFO_ICONS[k]}</svg>`
  : `<i data-icon="${k}"></i>`;

const INFO_ROWS = ['QWERTYUIOP', 'ASDFGHJKLÇ', 'ZXCVBNM'];
const INFO_PHRASES = ['Aprenda a digitar sem olhar.', 'Ganhe velocidade a cada aula.', 'Domine o computador.'];

function infoCard() {
  const first = (meName() || '').split(' ')[0];
  if (!auth.user) return `
    <section class="inf-card inf-in">
      <span class="inf-card-ico"><i data-icon="lock"></i></span>
      <h2>Exclusivo para alunos matriculados.</h2>
      <p>A Plataforma de Informática está disponível só para os alunos matriculados no curso de Informática Básica do HC Instituto Educacional. Quer fazer parte? Fale com o nosso time comercial. Se você já é aluno, entre na sua conta para acessar.</p>
      <div class="inf-cta">
        <a class="btn-dark" href="${INFO_WA('Olá! Vi a Plataforma de Informática no site do HC Instituto Educacional e quero saber mais sobre o curso de Informática Básica.')}" target="_blank" rel="noopener"><i data-icon="chat"></i>Falar com o time comercial</a>
        <button class="btn-soft" type="button" data-auth="login">Já sou aluno, entrar</button>
      </div>
    </section>`;
  if (!infoAllowed()) return `
    <section class="inf-card inf-in">
      <span class="inf-card-ico gold"><i data-icon="star"></i></span>
      <h2>${first ? esc(first) + ', este' : 'Este'} conteúdo é exclusivo dos alunos de Informática.</h2>
      <p>Com o curso de Informática Básica você aprende a digitar com rapidez e segurança e ganha os conhecimentos que o mercado pede para usar o computador no trabalho e nos estudos. Faça a sua matrícula e tenha acesso liberado à plataforma.</p>
      <div class="inf-cta">
        <a class="btn-dark" href="${INFO_WA(`Olá! Sou ${meName()} e tenho cadastro no site do HC Instituto Educacional. Quero me matricular no curso de Informática Básica para ter acesso à plataforma.`)}" target="_blank" rel="noopener"><i data-icon="chat"></i>Quero me matricular</a>
        <a class="btn-soft" href="${INFO_WA(`Olá! Sou ${meName()} (${auth.user.email}), já sou aluno do curso de Informática Básica e quero liberar o meu acesso à plataforma no site.`)}" target="_blank" rel="noopener">Já sou aluno, liberar acesso</a>
      </div>
    </section>`;
  const url = infoUrl();
  return `
    <section class="inf-card inf-in ok">
      <span class="inf-card-ico ok"><i data-icon="check"></i></span>
      <h2>Acesso liberado${first ? ', ' + esc(first) : ''}!</h2>
      <p>Entre na plataforma com o seu usuário e senha de aluno e continue de onde parou.</p>
      <div class="inf-cta">
        ${url ? `<a class="btn-dark" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><i data-icon="external"></i>Abrir a plataforma</a>` : '<p class="inf-note">O link da plataforma ainda não foi cadastrado no banner.</p>'}
      </div>
    </section>`;
}

/* código que corre ao fundo do topo (linhas de código em movimento) */
const INFO_BG = [
  [['k', 'const '], ['', 'aluno = '], ['f', 'HC.matricular'], ['', '('], ['s', '"você"'], ['', ');']],
  [['k', 'for '], ['', '(dedo '], ['k', 'of '], ['', 'mãos) '], ['f', 'digitar'], ['', '(dedo);']],
  [['c', '// sem olhar para o teclado']],
  [['k', 'import '], ['', '{ teclado } '], ['k', 'from '], ['s', '"@hc/informatica"'], ['', ';']],
  [['', 'velocidade += '], ['n', '10'], ['', '; '], ['c', '// ppm']],
  [['k', 'if '], ['', '(precisao > '], ['n', '0.98'], ['', ') '], ['f', 'avancar'], ['', '();']],
  [['f', 'abrir'], ['', '('], ['s', '"arquivos/pastas"'], ['', ');']],
  [['k', 'await '], ['f', 'internet.conectar'], ['', '();']],
  [['', '01001000 01000011'], ['c', '  // HC']],
  [['k', 'while '], ['', '(praticando) nivel++;']],
];
const INFO_GLYPHS = ['</>', '{ }', '01', '=>', ';', '#', '[ ]', '()', '&&', '10'];
const infoTok = (toks) => toks.map(([c, t]) => `<span class="t-${c || 'v'}">${esc(t)}</span>`).join('');
function infoBgRows() {
  return Array.from({ length: 7 }, (_, r) => {
    const line = Array.from({ length: 5 }, (_, i) => infoTok(INFO_BG[(r * 3 + i) % INFO_BG.length])).join('<b class="inf-sep"></b>');
    return `<div class="inf-code-row" style="--r:${r}"><div>${line}<b class="inf-sep"></b>${line}<b class="inf-sep"></b></div></div>`;
  }).join('');
}

/* roteiro do terminal: cada ciclo digita um pequeno programa e termina numa frase */
const INFO_SCRIPT = [
  [
    ['type', [['p', '$ '], ['f', 'hc'], ['', ' start '], ['k', '--curso'], ['', '='], ['s', 'informatica']]],
    ['bar', 'carregando lições'],
    ['type', [['k', 'const '], ['', 'aluno = '], ['f', 'HC.matricular'], ['', '('], ['s', '"você"'], ['', ');']]],
    ['type', [['', 'aluno.'], ['f', 'treinar'], ['', '({ dedos: '], ['n', '10'], ['', ' });']]],
    ['hl', INFO_PHRASES[0]],
  ],
  [
    ['type', [['p', '$ '], ['f', 'hc'], ['', ' treino '], ['k', '--nivel'], ['', '='], ['s', 'avancado']]],
    ['count', 'medindo velocidade', 62, ' ppm'],
    ['type', [['k', 'while '], ['', '(aluno.praticando) {']]],
    ['type', [['', '  aluno.velocidade++;']]],
    ['type', [['', '}']]],
    ['hl', INFO_PHRASES[1]],
  ],
  [
    ['type', [['p', '$ '], ['f', 'hc'], ['', ' modulo '], ['k', '--fundamentos']]],
    ['out', 'arquivos · pastas · internet · e-mail'],
    ['type', [['k', 'import '], ['', '{ computador } '], ['k', 'from '], ['s', '"@hc"'], ['', ';']]],
    ['type', [['', 'aluno.'], ['f', 'dominar'], ['', '(computador);']]],
    ['hl', INFO_PHRASES[2]],
  ],
];

let infoTyping = 0;
function renderInformatica(view) {
  waitAuth(view, () => {
    view.innerHTML = `
    <div class="wrap inf">
      <section class="inf-hero">
        <div class="ref-glow" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="inf-code" aria-hidden="true">${infoBgRows()}</div>
        <div class="inf-glyphs" aria-hidden="true">${INFO_GLYPHS.map((g, k) => `<span style="--k:${k}">${esc(g)}</span>`).join('')}</div>
        <p class="ref-badge inf-badge"><span class="ref-dot"></span>Plataforma de Informática</p>
        <h1 class="inf-title"><span>Digite rápido.</span> <span class="ap-grad">Domine o computador.</span></h1>
        <p class="inf-sub">O curso de Informática Básica do HC Instituto Educacional ensina a digitar com os dez dedos e traz os conhecimentos essenciais para entender e usar a informática.</p>
        <div class="inf-term" aria-hidden="true">
          <div class="inf-term-bar"><i></i><i></i><i></i><span>aluno@hc: ~/informatica</span></div>
          <div class="inf-term-body" id="inf-term"></div>
        </div>
        <div class="inf-kb" aria-hidden="true">
          ${INFO_ROWS.map((r) => `<div class="inf-row">${[...r].map((k) => `<span class="inf-key${'FJ'.includes(k) ? ' nub' : ''}" data-k="${k}">${k}</span>`).join('')}</div>`).join('')}
          <div class="inf-row"><span class="inf-key space" data-k=" "></span></div>
        </div>
      </section>
      ${infoCard()}
      <section class="inf-grid">
        ${INFO_BENEFITS.map(([ico, t, d], k) => `
        <article class="inf-ben" style="--k:${k}">
          <span class="inf-ben-ico">${infoIcon(ico)}</span>
          <h3>${t}</h3>
          <p>${d}</p>
        </article>`).join('')}
      </section>
    </div>`;
    paintIcons(view);
    infoType(++infoTyping);
  });
}

/* terminal "hacker": o código entra sendo digitado, com as teclas acendendo no teclado,
   e cada ciclo termina com uma frase que se decifra a partir de caracteres aleatórios */
async function infoType(id) {
  const body = $('#inf-term'); if (!body) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const caret = document.createElement('i'); caret.className = 'inf-caret';
  let n = 0, cur = null;
  const line = (cls = '') => {
    const el = document.createElement('div'); el.className = 'tl ' + cls;
    el.innerHTML = `<b class="ln">${++n}</b><span class="tc"></span>`;
    body.appendChild(el); cur = el.querySelector('.tc'); cur.appendChild(caret); return cur;
  };
  const span = (cls, txt = '') => { const s = document.createElement('span'); s.className = 't-' + (cls || 'v'); s.textContent = txt; cur.insertBefore(s, caret); return s; };

  if (reduce) { // sem animação: mostra o primeiro programa pronto
    for (const [kind, a, b, c] of INFO_SCRIPT[0]) {
      line(kind === 'hl' ? 'hl' : '');
      if (kind === 'type') a.forEach(([cl, t]) => span(cl, t));
      else if (kind === 'hl') span('h', '» ' + a);
      else span('o', `▸ ${a} ✓`);
    }
    return;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const alive = () => id === infoTyping && body.isConnected;
  const press = (ch) => {
    const k = /ç/i.test(ch) ? 'Ç' : ch === ' ' ? ' ' : ch.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (!/^[A-ZÇ ]$/.test(k)) return; // só letras e espaço existem no teclado
    const key = document.querySelector(`.inf-key[data-k="${k}"]`);
    if (!key) return;
    key.classList.remove('hit'); void key.offsetWidth; key.classList.add('hit');
  };
  const GLYPH = '01<>/{}[]#$%&*=+;:ABCDEFXZ';
  const rnd = () => GLYPH[Math.random() * GLYPH.length | 0];

  await sleep(1500);
  for (let c = 0; alive(); c = (c + 1) % INFO_SCRIPT.length) {
    for (const [kind, a, b, u] of INFO_SCRIPT[c]) {
      if (!alive()) return;
      if (kind === 'type') {
        line();
        for (const [cl, t] of a) {
          const s = span(cl);
          for (const ch of t) { if (!alive()) return; s.textContent += ch; press(ch); await sleep(ch === ' ' ? 40 : 28 + Math.random() * 46); }
        }
        await sleep(260);
      } else if (kind === 'bar' || kind === 'count' || kind === 'out') {
        line('out'); span('o', `▸ ${a} `);
        if (kind === 'bar') {
          const bar = span('bar');
          for (let i = 0; i <= 12; i++) { if (!alive()) return; bar.textContent = '[' + '█'.repeat(i) + '░'.repeat(12 - i) + `] ${Math.round(i / 12 * 100)}%`; await sleep(55 + Math.random() * 70); }
        } else if (kind === 'count') {
          const num = span('n');
          for (let i = 0; i <= b; i += 2) { if (!alive()) return; num.textContent = i + u; await sleep(22); }
          num.textContent = b + u;
        }
        span('ok', ' ✓');
        await sleep(380);
      } else if (kind === 'hl') {
        line('hl'); span('p', '» '); const s = span('h');
        const total = a.length, frames = total + 14;
        for (let f = 0; f <= frames; f++) {
          if (!alive()) return;
          const done = Math.max(0, f - 14);
          s.textContent = a.slice(0, done) + [...a.slice(done, Math.min(total, f + 1))].map((ch) => ch === ' ' ? ' ' : rnd()).join('');
          if (done > 0) press(a[done - 1]);
          await sleep(38);
        }
        s.textContent = a; s.parentElement.parentElement.classList.add('lit');
        await sleep(2600);
      }
    }
    if (!alive()) return;
    body.classList.add('wipe'); await sleep(450);
    if (!alive()) return;
    body.innerHTML = ''; body.classList.remove('wipe'); n = 0;
    await sleep(250);
  }
}

window.HC_ROUTES = Object.assign(window.HC_ROUTES || {}, { informatica: renderInformatica });
