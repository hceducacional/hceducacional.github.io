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

let infoTyping = 0;
function renderInformatica(view) {
  waitAuth(view, () => {
    view.innerHTML = `
    <div class="wrap inf">
      <section class="inf-hero">
        <div class="ref-glow" aria-hidden="true"><span></span><span></span><span></span></div>
        <p class="ref-badge inf-badge"><span class="ref-dot"></span>Plataforma de Informática</p>
        <h1 class="inf-title"><span>Digite rápido.</span> <span class="ap-grad">Domine o computador.</span></h1>
        <p class="inf-sub">O curso de Informática Básica do HC Instituto Educacional ensina a digitar com os dez dedos e traz os conhecimentos essenciais para entender e usar a informática.</p>
        <div class="inf-type" aria-hidden="true"><span id="inf-text"></span><i class="inf-caret"></i></div>
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

/* frases sendo digitadas, com as teclas acendendo no teclado */
async function infoType(id) {
  const text = $('#inf-text'); if (!text) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { text.textContent = INFO_PHRASES[0]; return; }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const alive = () => id === infoTyping && text.isConnected;
  const press = (ch) => {
    const k = ch === ' ' ? ' ' : ch.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const key = document.querySelector(`.inf-key[data-k="${k === 'C' && /ç/i.test(ch) ? 'Ç' : k}"]`);
    if (!key) return;
    key.classList.remove('hit'); void key.offsetWidth; key.classList.add('hit');
  };
  await sleep(900);
  for (let p = 0; alive(); p = (p + 1) % INFO_PHRASES.length) {
    const s = INFO_PHRASES[p];
    for (const ch of s) { if (!alive()) return; text.textContent += ch; press(ch); await sleep(ch === ' ' ? 120 : 70 + Math.random() * 60); }
    await sleep(1800);
    while (text.textContent && alive()) { text.textContent = text.textContent.slice(0, -1); await sleep(28); }
    await sleep(400);
  }
}

window.HC_ROUTES = Object.assign(window.HC_ROUTES || {}, { informatica: renderInformatica });
