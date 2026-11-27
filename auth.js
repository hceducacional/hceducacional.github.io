/* =========================================================
   CONTAS DE USUÁRIO (Supabase)
   Cadastro com e-mail e senha, confirmação por e-mail, aprovação pela
   secretaria, perfil (nome e foto) e painel mestre para administradores.
   A chave abaixo é a pública: quem protege os dados são as regras do banco
   (supabase/setup.sql). A chave secreta nunca entra no site.
   ========================================================= */
const SB_URL = 'https://xeqmgwzkwzhmkpvrguln.supabase.co';
const SB_KEY = 'sb_publishable_9QJGNIIWRj1_iQ76EkBAOQ_kDY38zYC';
const sb = window.supabase?.createClient(SB_URL, SB_KEY, {
  auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const auth = { user: null, profile: null, ready: false, pending: 0 };

/* Ao abrir o site (por exemplo, logo depois de uma publicação), o Supabase renova o acesso.
   Se essa renovação falha por um instante (internet oscilando, celular voltando do segundo
   plano), ele avisa "sem sessão" mesmo com o acesso ainda guardado. Antes de mostrar
   "Entrar", tentamos de novo algumas vezes; só um acesso de fato inválido desloga. */
const SB_TOKEN_KEY = `sb-${new URL(SB_URL).hostname.split('.')[0]}-auth-token`;
const hasStoredSession = () => { try { return !!localStorage.getItem(SB_TOKEN_KEY); } catch { return false; } };
async function recoverSession() {
  for (const wait of [700, 2000, 5000]) {
    await new Promise((r) => setTimeout(r, wait));
    if (!hasStoredSession()) return null; // o Supabase recusou o acesso e o apagou: aí sim saiu
    try {
      const { data } = await sb.auth.getSession();
      if (data?.session) return data.session;
    } catch {}
  }
  return null;
}
const AVATAR_MAX = 480; // maior lado da foto de perfil (ela aparece no máximo com 128 px; 480 fica nítido até em telas 3x)

/* Foto de perfil sempre recomprimida: reduz para no máximo 480 px no maior lado e salva em
   WebP (ou JPEG, no Safari) com qualidade alta. Fica entre ~20 e 60 KB, sem perda visível. */
function compressAvatar(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const k = Math.min(1, AVATAR_MAX / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); // fundo branco se a foto tiver transparência
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((webp) => {
        if (webp && webp.type === 'image/webp') return resolve(webp);
        c.toBlob((jpg) => (jpg ? resolve(jpg) : reject(new Error('Não foi possível preparar a foto.'))), 'image/jpeg', .86);
      }, 'image/webp', .84);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Esse arquivo não é uma imagem válida.')); };
    img.src = url;
  });
}
const STATUS_TXT = { pending: 'Aguardando aprovação', approved: 'Aprovado', blocked: 'Bloqueado' };
const isAdmin = () => auth.profile?.role === 'admin' && auth.profile?.status === 'approved';
const meName = () => auth.profile?.name || auth.user?.user_metadata?.name || (auth.user?.email || '').split('@')[0];
const fold = (str = '') => [...String(str)].map((ch) => ch.normalize('NFD')[0].toLowerCase()).join('');
const siteUrl = () => location.origin + location.pathname; // volta para o site depois do link do e-mail

/* Avatar redondo de um perfil (foto com enquadramento ou iniciais) */
const userAvatar = (p, cls = '') => avatarHTML({ name: p?.name || p?.email || '?', image: p?.avatar_url || '', focus: p?.avatar_focus || '' }, cls);

/* Mensagens do Supabase em português */
function authError(err) {
  const m = String(err?.message || err || '');
  if (/invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
  if (/could not find the function public\.(login_email|username_available|admin_set_username)/i.test(m)) return 'O login com nome de usuário ainda não foi ativado no banco (script 12).';
  if (/profiles_username_key|duplicate key.*username/i.test(m)) return 'Esse nome de usuário já está em uso. Escolha outro.';
  if (/profiles_username_check/i.test(m)) return 'Nome de usuário inválido: use de 3 a 20 letras minúsculas, números, ponto ou _.';
  if (/email not confirmed/i.test(m)) return 'Confirme o seu e-mail antes de entrar. Procure o link que enviamos (veja também o spam).';
  if (/banned/i.test(m)) return 'Seu acesso está bloqueado. Fale com a secretaria do polo.';
  if (/already registered|already been registered/i.test(m)) return 'Este e-mail já tem cadastro. Use "Entrar" ou "Esqueci minha senha".';
  if (/password should be at least|at least \d+ characters/i.test(m)) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (/weak|pwned|leaked/i.test(m)) return 'Essa senha é muito fácil de adivinhar. Escolha outra.';
  if (/rate limit|too many|security purposes/i.test(m)) return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.';
  if (/valid email|invalid email|unable to validate email/i.test(m)) return 'Digite um e-mail válido.';
  if (/same password|different from the old/i.test(m)) return 'A nova senha precisa ser diferente da atual.';
  if (/expired|invalid.*(link|token|otp)|otp/i.test(m)) return 'Esse link expirou ou já foi usado. Peça um novo.';
  if (/failed to fetch|network/i.test(m)) return 'Sem conexão com o servidor. Verifique a internet e tente de novo.';
  return m || 'Algo deu errado. Tente de novo.';
}

/* ---------- Sessão ---------- */
async function loadProfile() {
  if (!auth.user) { auth.profile = null; return; }
  const { data, error } = await sb.from('profiles').select('*').eq('id', auth.user.id).maybeSingle();
  if (error) console.warn('Perfil:', error.message);
  auth.profile = data || null;
  auth.pending = 0;
  auth.links = {};
  if (isAdmin()) {
    // links restritos (ex.: Sistema Semipresencial): ficam só no banco e só administradores leem
    const { data: links } = await sb.from('admin_links').select('id, url');
    (links || []).forEach((l) => { auth.links[l.id] = l.url; });
    const { count } = await sb.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'pending');
    auth.pending = count || 0;
  }
}
async function setUser(user) {
  const changed = (user?.id || null) !== (auth.user?.id || null);
  auth.user = user || null;
  if (changed || !auth.profile) await loadProfile();
  const first = !auth.ready;
  auth.ready = true;
  paintUser();
  if (isAdmin() && pending.size) [...pending].forEach((k) => queuePush(k)); // termina envios que ficaram pendentes
  const r = (location.hash || '').slice(1);
  if ((changed || first) && (r === 'perfil' || r === 'usuarios' || r.startsWith('config') || r.startsWith('secretaria') || r.startsWith('agendar') || r.startsWith('indicar') || r.startsWith('informatica'))) route(); // a página depende de quem entrou
}
async function refreshMe() { await loadProfile(); paintUser(); }

/* ---------- Barra de cima: nome, e-mail e foto ---------- */
function paintUser() {
  document.body.classList.toggle('is-admin', isAdmin()); // mostra os itens só de administradores
  window.pdKick?.(); // aviso ao vivo do setor pedagógico (pedagogico.js)
  const box = $('#tb-user'); if (!box) return;
  if (!sb) { box.innerHTML = ''; return; }
  if (!auth.user) {
    box.innerHTML = `<button class="tb-login" type="button" data-auth="login"><i data-icon="user"></i><span>Entrar</span></button>`;
    paintIcons(box);
    return;
  }
  const p = auth.profile || { email: auth.user.email, name: meName() };
  box.innerHTML = `
    <button class="tb-me" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="um">
      <span class="tb-user-text"><strong>${esc(meName())}</strong><span>${esc(auth.user.email || '')}</span></span>
      <span class="tb-me-av">${userAvatar(p, 'tb-avatar')}${auth.pending ? `<i class="tb-badge">${auth.pending}</i>` : ''}</span>
    </button>
    <div class="um" id="um" role="menu" hidden>
      <div class="um-head">
        ${userAvatar(p, 'um-avatar')}
        <div class="um-who"><strong>${esc(meName())}</strong><span>${esc(auth.user.email || '')}</span></div>
      </div>
      ${p.status && p.status !== 'approved' ? `<p class="um-state s-${esc(p.status)}"><i></i>${esc(STATUS_TXT[p.status])}${p.status === 'pending' ? '<span>A secretaria vai liberar o seu acesso em breve.</span>' : ''}</p>` : ''}
      <a class="um-item" role="menuitem" href="#perfil"><i data-icon="user"></i>Meu perfil</a>
      ${isAdmin() ? `<a class="um-item" role="menuitem" href="#agendar/painel"><i data-icon="calendar"></i>Agendamentos</a>` : ''}
      ${isAdmin() ? `<a class="um-item" role="menuitem" href="#indicar/painel"><i data-icon="userPlus"></i>Indicações</a>` : ''}
      ${isAdmin() ? `<button class="um-item" role="menuitem" type="button" data-auth="login"><i data-icon="image"></i>Tela de entrar</button>` : ''}
      ${isAdmin() ? `<a class="um-item" role="menuitem" href="#usuarios"><i data-icon="users"></i>Usuários${auth.pending ? `<b class="um-count">${auth.pending}</b>` : ''}</a>` : ''}
      <button class="um-item danger" role="menuitem" type="button" data-auth="logout"><i data-icon="logout"></i>Sair da conta</button>
    </div>`;
  paintIcons(box);
}
function toggleMenu(open) {
  const menu = $('#um'), btn = $('.tb-me'); if (!menu || !btn) return;
  const show = open ?? menu.hidden;
  const wrap = $('#topbar-wrap');
  if (show) {
    wrap?.classList.add('menu-open'); wrap?.classList.remove('mini'); // no celular a barra se abre e o menu "cresce" dela
    menu.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('in')));
  } else {
    menu.classList.remove('in');
    setTimeout(() => { if (!menu.classList.contains('in')) { menu.hidden = true; wrap?.classList.remove('menu-open'); } }, 520);
  }
  btn.setAttribute('aria-expanded', String(show));
}
document.addEventListener('click', (e) => {
  if (e.target.closest('.tb-me')) { if ($('#um')?.hidden && window.HC_bar?.tryPeek()) return; return toggleMenu(); } // celular: 1º toque abre a barra, 2º o menu
  const act = e.target.closest('[data-auth]')?.dataset.auth;
  if (act === 'login') { e.preventDefault(); openAuth('login'); }
  if (act === 'signup') { e.preventDefault(); openAuth('signup'); }
  if (act === 'logout') { e.preventDefault(); signOut(); }
  if (!e.target.closest('.um') || e.target.closest('.um-item')) toggleMenu(false);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
window.addEventListener('hashchange', () => toggleMenu(false));

async function signOut() {
  if (typeof pushDisable === 'function') await pushDisable(true).catch(() => {}); // desliga os avisos deste aparelho antes de sair
  await sb?.auth.signOut({ scope: 'local' }); // sai só deste aparelho; os outros continuam conectados
  toast('Você saiu da sua conta.');
  if (['perfil', 'usuarios'].includes(location.hash.slice(1))) location.hash = '#dashboard';
}

/* ---------- Nome de usuário: minúsculas, números, ponto e _ (3 a 20) ---------- */
const USERNAME_RE = /^[a-z0-9][a-z0-9._]{2,19}$/;
const cleanUsername = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9._]/g, '').slice(0, 20);

/* ---------- Janela de entrar / criar conta / recuperar senha ---------- */
const eyeBtn = '<button type="button" class="lk-eye" aria-label="Mostrar senha"><i data-icon="eye"></i></button>';
const AUTH_VIEWS = {
  login: () => `
    <span class="lk-icon au-ico"><i data-icon="user"></i></span>
    <h2 id="au-title">Entrar</h2>
    <p class="lk-sub">Use o seu nome de usuário (ou e-mail) e a senha do seu cadastro no HC Instituto Educacional.</p>
    <div class="au-tabs" role="tablist"><button type="button" class="on" role="tab" aria-selected="true">Entrar</button><button type="button" role="tab" aria-selected="false" data-go="signup">Criar conta</button></div>
    <label class="au-label" for="au-email">Usuário ou e-mail</label>
    <div class="lk-field"><input type="text" id="au-email" name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="seu.usuario ou seuemail@exemplo.com" required></div>
    <label class="au-label" for="au-pass">Senha</label>
    <div class="lk-field"><input type="password" id="au-pass" name="password" autocomplete="current-password" placeholder="Sua senha" required>${eyeBtn}</div>
    <button type="button" class="au-link au-forgot" data-go="forgot">Esqueci minha senha</button>
    <p class="lk-msg" role="alert"></p>
    <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">Entrar</button></div>`,
  signup: () => `
    <span class="lk-icon au-ico"><i data-icon="userPlus"></i></span>
    <h2 id="au-title">Criar conta</h2>
    <p class="lk-sub">Depois de confirmar o e-mail, a secretaria do polo libera o seu acesso.</p>
    <div class="au-tabs" role="tablist"><button type="button" role="tab" aria-selected="false" data-go="login">Entrar</button><button type="button" class="on" role="tab" aria-selected="true">Criar conta</button></div>
    <label class="au-label" for="au-name">Nome</label>
    <div class="lk-field"><input type="text" id="au-name" name="name" autocomplete="name" maxlength="60" placeholder="Como você quer ser chamado" required></div>
    <label class="au-label" for="au-user">Nome de usuário</label>
    <div class="lk-field au-at"><input type="text" id="au-user" name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="20" placeholder="ex.: maria.silva" required></div>
    <small class="au-hint">Você poderá entrar com ele no lugar do e-mail. De 3 a 20 letras minúsculas, números, ponto ou _.</small>
    <label class="au-label" for="au-email">E-mail</label>
    <div class="lk-field"><input type="email" id="au-email" name="email" autocomplete="email" placeholder="seuemail@exemplo.com" required></div>
    <label class="au-label" for="au-pass">Senha</label>
    <div class="lk-field"><input type="password" id="au-pass" name="password" autocomplete="new-password" minlength="8" placeholder="Pelo menos 8 caracteres" required>${eyeBtn}</div>
    <label class="au-check"><input type="checkbox" id="au-ok" required><span>Li e concordo com a <a href="#privacidade" target="_blank">Política de Privacidade</a>.</span></label>
    <p class="lk-msg" role="alert"></p>
    <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">Criar conta</button></div>`,
  forgot: () => `
    <span class="lk-icon au-ico"><i data-icon="key"></i></span>
    <h2 id="au-title">Esqueci minha senha</h2>
    <p class="lk-sub">Digite o e-mail do cadastro. Enviaremos um link para você criar uma senha nova.</p>
    <label class="au-label" for="au-email">E-mail</label>
    <div class="lk-field"><input type="email" id="au-email" name="email" autocomplete="email" placeholder="seuemail@exemplo.com" required></div>
    <button type="button" class="au-link" data-go="login">Voltar para entrar</button>
    <p class="lk-msg" role="alert"></p>
    <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">Enviar link</button></div>`,
  newpass: () => `
    <span class="lk-icon au-ico"><i data-icon="key"></i></span>
    <h2 id="au-title">Criar nova senha</h2>
    <p class="lk-sub">Escolha uma senha nova para a sua conta.</p>
    <label class="au-label" for="au-pass">Nova senha</label>
    <div class="lk-field"><input type="password" id="au-pass" name="password" autocomplete="new-password" minlength="8" placeholder="Pelo menos 8 caracteres" required>${eyeBtn}</div>
    <label class="au-label" for="au-pass2">Repita a nova senha</label>
    <div class="lk-field"><input type="password" id="au-pass2" autocomplete="new-password" minlength="8" placeholder="Digite de novo" required></div>
    <p class="lk-msg" role="alert"></p>
    <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Agora não</button><button type="submit" class="btn-dark lk-go">Salvar senha</button></div>`,
  sent: ({ email, kind }) => `
    <span class="lk-icon au-ico ok"><i data-icon="mail"></i></span>
    <h2 id="au-title">${kind === 'reset' ? 'Confira o seu e-mail' : 'Falta só confirmar'}</h2>
    <p class="lk-sub">${kind === 'reset'
      ? `Se <b>${esc(email)}</b> tiver cadastro, você vai receber um link para criar uma senha nova.`
      : `Enviamos um link de confirmação para <b>${esc(email)}</b>. Abra o e-mail e toque no link. Depois, a secretaria do polo libera o seu acesso.`}
      <br><br>Não chegou? Veja a pasta de spam ou lixo eletrônico.</p>
    ${kind === 'reset' ? '' : '<button type="button" class="au-link" data-resend>Reenviar e-mail de confirmação</button>'}
    <p class="lk-msg" role="alert"></p>
    <div class="lk-actions one"><button type="button" class="btn-dark lk-cancel">Entendi</button></div>`,
  info: ({ title, text, icon = 'check', tone = 'ok' }) => `
    <span class="lk-icon au-ico ${tone}"><i data-icon="${icon}"></i></span>
    <h2 id="au-title">${esc(title)}</h2>
    <p class="lk-sub">${text}</p>
    <div class="lk-actions one"><button type="button" class="btn-dark lk-cancel">Entendi</button></div>`,
};

function openAuth(mode = 'login', data = {}) {
  if (!sb) return toast('Não foi possível carregar o sistema de contas. Verifique a internet.');
  document.querySelector('.lk.au')?.remove();
  if (document.querySelector('.lk')) return;
  const wrap = document.createElement('div');
  wrap.className = 'lk au au-login';
  wrap.innerHTML = '<div class="lk-backdrop"></div><div class="au-shell"><aside class="au-art"></aside><form class="lk-card au-card" role="dialog" aria-modal="true" aria-labelledby="au-title" novalidate></form></div>';
  document.body.appendChild(wrap);
  const card = wrap.querySelector('form');
  const art = wrap.querySelector('.au-art');
  const lastFocus = document.activeElement;
  let current = mode, ctx = data;

  /* banner do lado esquerdo (no celular, faixa no alto): a imagem escolhida pelo administrador
     — uma para o computador e outra para o celular — ou, sem ela, a marca do instituto */
  const PHONE_MQ = '(max-width: 640px)';
  let editing = 'image';
  const drawArt = () => {
    const b = loginBanner[0] || {}, desk = b.image || '', mob = b.imageMobile || '';
    const phone = matchMedia(PHONE_MQ).matches, shown = phone ? (mob || desk) : desk;
    const pic = shown // sem imagem do computador, o computador mostra a marca (a do celular é deitada)
      ? `<picture>${mob ? `<source media="${PHONE_MQ}" srcset="${esc(imgUrl(mob))}">` : ''}<img src="${esc(imgUrl(shown))}" alt="" decoding="async"></picture>`
      : `<div class="au-art-def"><span class="au-art-logo"><b>H</b><b>C</b></span><strong>HC Instituto <br>Educacional</strong><small>Explore todas as suas possibilidades de estudo.</small></div>`;
    art.innerHTML = pic + (isAdmin() ? `<div class="au-art-ed">
        <button type="button" data-art="image" title="Imagem do computador (900 × 1300, em pé)"><i data-icon="edit"></i>Computador</button>
        <button type="button" data-art="imageMobile" title="Imagem do celular (1200 × 460, deitada)"><i data-icon="edit"></i>Celular</button>
        ${shown ? `<button type="button" data-art="clear" aria-label="Remover a imagem ${phone && mob ? 'do celular' : 'do computador'}" title="Remover a imagem ${phone && mob ? 'do celular' : 'do computador'}"><i data-icon="trash"></i></button>` : ''}
        <input type="file" accept="image/*" hidden></div>
        <span class="au-art-hint">Computador: 900 × 1300 · Celular: 1200 × 460</span>` : '');
    const img = art.querySelector('img');
    if (img) { const ld = () => img.classList.add('ld'); img.complete ? ld() : img.addEventListener('load', ld); }
    paintIcons(art);
  };
  drawArt();
  const setBanner = (field, ref) => {
    const next = { id: 'login', ...(loginBanner[0] || {}) };
    if (ref) next[field] = ref; else delete next[field];
    loginBanner = next.image || next.imageMobile ? [next] : [];
    saveLoginBanner(); drawArt();
  };
  art.addEventListener('click', (e) => {
    const b = e.target.closest('[data-art]'); if (!b || !isAdmin()) return;
    if (b.dataset.art === 'clear') {
      const phone = matchMedia(PHONE_MQ).matches;
      return setBanner(phone && loginBanner[0]?.imageMobile ? 'imageMobile' : 'image', '');
    }
    editing = b.dataset.art;
    art.querySelector('input[type=file]').click();
  });
  art.addEventListener('change', async (e) => {
    const f = e.target.files?.[0]; e.target.value = ''; if (!f || !isAdmin()) return;
    art.classList.add('busy');
    try {
      setBanner(editing, await storeImage(f, 'loginBanner'));
      toast(editing === 'imageMobile' ? 'Imagem do celular salva.' : 'Imagem do computador salva.');
    }
    catch { toast('Não foi possível usar essa imagem. Tente outra.'); }
    finally { art.classList.remove('busy'); }
  });

  const draw = (m, d = {}) => {
    const typed = card.querySelector('#au-email')?.value || '';
    const keepEmail = (typed.includes('@') ? typed : '') || d.email || '';
    current = m; ctx = d;
    card.innerHTML = AUTH_VIEWS[m](d);
    card.dataset.mode = m;
    card.classList.remove('error');
    [...card.children].forEach((el, i) => el.style.setProperty('--i', i)); // entrada em cascata
    paintIcons(card);
    const em = card.querySelector('#au-email'); if (em && keepEmail) em.value = keepEmail;
    setTimeout(() => (card.querySelector('input:not([type=checkbox])') || card.querySelector('button.lk-cancel'))?.focus(), 60);
  };
  const msg = (t, ok = false) => {
    const el = card.querySelector('.lk-msg'); if (!el) return;
    el.textContent = t; el.classList.toggle('ok', ok);
    if (t && !ok) { card.classList.remove('error'); void card.offsetWidth; card.classList.add('error'); }
  };
  const busy = (on, label) => {
    const go = card.querySelector('.lk-go'); if (!go) return;
    if (on) { go.dataset.label = go.textContent; go.textContent = label; } else go.textContent = go.dataset.label || go.textContent;
    go.disabled = on;
  };
  document.documentElement.classList.add('lk-lock'); // o site do fundo não rola com a janela aberta
  const close = () => {
    document.removeEventListener('keydown', onKey);
    document.documentElement.classList.remove('lk-lock');
    wrap.classList.remove('in');
    setTimeout(() => wrap.remove(), 300);
    lastFocus?.focus?.({ preventScroll: true });
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = [...card.querySelectorAll('input, button, a')].filter((el) => !el.disabled && el.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  wrap.querySelector('.lk-backdrop').addEventListener('click', () => { if (current !== 'newpass') close(); });

  card.addEventListener('click', async (e) => {
    if (e.target.closest('.lk-cancel')) return close();
    const go = e.target.closest('[data-go]'); if (go) return draw(go.dataset.go);
    const eye = e.target.closest('.lk-eye');
    if (eye) {
      const input = eye.parentElement.querySelector('input'); const show = input.type === 'password';
      card.querySelectorAll('#au-pass, #au-pass2').forEach((i) => { i.type = show ? 'text' : 'password'; });
      eye.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      eye.innerHTML = `<i data-icon="${show ? 'eyeoff' : 'eye'}"></i>`; paintIcons(eye);
      return input.focus();
    }
    if (e.target.closest('[data-resend]')) {
      const { error } = await sb.auth.resend({ type: 'signup', email: ctx.email, options: { emailRedirectTo: siteUrl() } });
      msg(error ? authError(error) : 'E-mail reenviado.', !error);
    }
  });
  card.addEventListener('input', (e) => {
    msg(''); card.classList.remove('error');
    if (e.target.id === 'au-user') { const v = cleanUsername(e.target.value); if (v !== e.target.value) e.target.value = v; }
  });

  card.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = (id) => card.querySelector(id)?.value.trim() || '';
    const email = v('#au-email').toLowerCase(), pass = card.querySelector('#au-pass')?.value || '';
    const loginByUser = current === 'login' && !email.includes('@');
    const needEmail = ['login', 'signup', 'forgot'].includes(current) && !loginByUser;
    if (needEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg('Digite um e-mail válido.'); return card.querySelector('#au-email').focus(); }

    if (current === 'login') {
      if (loginByUser && !USERNAME_RE.test(email)) { msg('Digite o seu nome de usuário ou e-mail.'); return card.querySelector('#au-email').focus(); }
      if (!pass) return msg('Digite a sua senha.');
      busy(true, 'Entrando…');
      let mail = email;
      if (loginByUser) { // nome de usuário: o banco confere a senha e devolve o e-mail da conta
        const { data: found, error: err } = await sb.rpc('login_email', { u: email, pass });
        if (err || !found) { busy(false); return msg(err ? authError(err) : 'Usuário ou senha incorretos.'); }
        mail = found;
      }
      const { data: res, error } = await sb.auth.signInWithPassword({ email: mail, password: pass });
      busy(false);
      if (error) {
        msg(loginByUser && /invalid login/i.test(error.message) ? 'Usuário ou senha incorretos.' : authError(error));
        if (/not confirmed/i.test(error.message)) { ctx = { email }; }
        return;
      }
      await setUser(res.user);
      close();
      const st = auth.profile?.status;
      if (st === 'pending') openAuth('info', { title: 'Cadastro em análise', icon: 'clock', tone: 'wait', text: 'Seu e-mail está confirmado. Agora é só aguardar: a secretaria do polo vai liberar o seu acesso em breve.' });
      else toast(`Olá, ${meName()}!`);
    }

    if (current === 'signup') {
      const name = v('#au-name');
      if (name.length < 2) { msg('Digite o seu nome.'); return card.querySelector('#au-name').focus(); }
      const username = cleanUsername(v('#au-user'));
      if (!USERNAME_RE.test(username)) { msg('Nome de usuário: de 3 a 20 letras minúsculas, números, ponto ou _ (começando por letra ou número).'); return card.querySelector('#au-user').focus(); }
      if (pass.length < 8) { msg('A senha precisa ter pelo menos 8 caracteres.'); return card.querySelector('#au-pass').focus(); }
      if (!card.querySelector('#au-ok').checked) return msg('Para criar a conta, aceite a Política de Privacidade.');
      busy(true, 'Criando…');
      const { data: free } = await sb.rpc('username_available', { u: username });
      if (free === false) { busy(false); msg('Esse nome de usuário já está em uso. Escolha outro.'); return card.querySelector('#au-user').focus(); }
      const { data: res, error } = await sb.auth.signUp({ email, password: pass, options: { data: { name, username }, emailRedirectTo: siteUrl() } });
      busy(false);
      if (error) return msg(authError(error));
      if (res.session) {
        await setUser(res.user); close();
        if (auth.profile?.status === 'pending') return openAuth('info', { title: 'Conta criada', icon: 'clock', tone: 'wait', text: 'Pronto! Agora é só aguardar: a secretaria do polo vai liberar o seu acesso em breve.' });
        return toast('Conta criada!');
      }
      draw('sent', { email, kind: 'signup' });
    }

    if (current === 'forgot') {
      busy(true, 'Enviando…');
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: siteUrl() });
      busy(false);
      if (error) return msg(authError(error));
      draw('sent', { email, kind: 'reset' });
    }

    if (current === 'newpass') {
      if (pass.length < 8) return msg('A senha precisa ter pelo menos 8 caracteres.');
      if (pass !== (card.querySelector('#au-pass2')?.value || '')) return msg('As duas senhas não são iguais.');
      busy(true, 'Salvando…');
      const { error } = await sb.auth.updateUser({ password: pass });
      busy(false);
      if (error) return msg(authError(error));
      close(); toast('Senha alterada!');
    }
  });

  draw(mode, data);
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('in')));
}

/* ---------- Pop-up simples com um campo (ex.: definir senha de alguém) ---------- */
function inputDialog({ title, sub = '', placeholder = '', ok = 'Salvar', type = 'text', icon = 'key', min = 0, value = '' }) {
  return new Promise((resolve) => {
    if (document.querySelector('.lk')) return resolve(null);
    const wrap = document.createElement('div');
    wrap.className = 'lk au';
    wrap.innerHTML = `
      <div class="lk-backdrop"></div>
      <form class="lk-card au-card" role="dialog" aria-modal="true" aria-labelledby="in-title" novalidate>
        <span class="lk-icon au-ico"><i data-icon="${icon}"></i></span>
        <h2 id="in-title">${esc(title)}</h2>
        <p class="lk-sub">${sub}</p>
        <div class="lk-field"><input type="${type}" id="in-val" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="${type === 'password' ? 'new-password' : 'off'}">${type === 'password' ? eyeBtn : ''}</div>
        <p class="lk-msg" role="alert"></p>
        <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">${esc(ok)}</button></div>
      </form>`;
    document.body.appendChild(wrap); paintIcons(wrap);
    const card = wrap.querySelector('form'), input = wrap.querySelector('#in-val');
    const close = (val) => { document.removeEventListener('keydown', onKey); wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 300); resolve(val); };
    const onKey = (e) => { if (e.key === 'Escape') close(null); };
    document.addEventListener('keydown', onKey);
    wrap.querySelector('.lk-backdrop').addEventListener('click', () => close(null));
    wrap.querySelector('.lk-cancel').addEventListener('click', () => close(null));
    wrap.querySelector('.lk-eye')?.addEventListener('click', (e) => {
      const show = input.type === 'password'; input.type = show ? 'text' : 'password';
      e.currentTarget.innerHTML = `<i data-icon="${show ? 'eyeoff' : 'eye'}"></i>`; paintIcons(e.currentTarget);
    });
    card.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim().length < min) { card.querySelector('.lk-msg').textContent = `Use pelo menos ${min} caracteres.`; return input.focus(); }
      close(input.value);
    });
    requestAnimationFrame(() => wrap.classList.add('in'));
    setTimeout(() => input.focus(), 60);
  });
}

/* ---------- Meu perfil ---------- */
function needLogin(view, title) {
  view.innerHTML = `
  <div class="wrap">
    <section class="soon">
      ${pageHead(title, 'Entre na sua conta.', 'Para ver esta página, entre com o e-mail e a senha do seu cadastro.')}
      <div class="me-cta"><button class="btn-dark" type="button" data-auth="login">Entrar</button><button class="btn-soft" type="button" data-auth="signup">Criar conta</button></div>
    </section>
  </div>`;
}
function waitAuth(view, fn) {
  if (auth.ready) return fn();
  view.innerHTML = '<div class="wrap"><p class="me-loading">Carregando…</p></div>';
}

function renderProfile(view) {
  waitAuth(view, () => {
    if (!auth.user) return needLogin(view, 'Meu perfil');
    const p = auth.profile || { email: auth.user.email, name: meName(), status: 'pending' };
    view.innerHTML = `
    <div class="wrap me-page">
      ${pageHead('Minha conta', 'Meu perfil.', 'O nome e a foto aparecem no topo do site sempre que você entrar.')}
      <div class="me-grid">
        <section class="me-card me-id">
          <div class="me-photo">
            ${userAvatar(p, 'me-avatar')}
            <label class="me-cam" title="Trocar foto"><i data-icon="image"></i><input type="file" accept="image/*" id="me-file" hidden></label>
          </div>
          <div class="me-photo-actions">
            <label class="btn-soft" for="me-file"><i data-icon="image"></i>${p.avatar_url ? 'Trocar foto' : 'Escolher foto'}</label>
            ${p.avatar_url ? `<button class="btn-soft" type="button" data-me="focus"><i data-icon="focus"></i>Enquadrar</button><button class="btn-soft" type="button" data-me="rmphoto"><i data-icon="x"></i>Remover</button>` : ''}
          </div>
          <p class="me-status s-${esc(p.status || 'pending')}"><i></i>${esc(STATUS_TXT[p.status] || STATUS_TXT.pending)}${isAdmin() ? ' · Administrador' : ''}</p>
        </section>
        <form class="me-card" id="me-form">
          <h3>Seus dados</h3>
          <label class="au-label" for="me-name">Nome</label>
          <div class="lk-field"><input id="me-name" maxlength="60" value="${esc(p.name || '')}" placeholder="Seu nome" autocomplete="name"></div>
          <label class="au-label" for="me-user">Nome de usuário</label>
          <div class="lk-field au-at"><input id="me-user" maxlength="20" value="${esc(p.username || '')}" placeholder="ex.: maria.silva" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false"></div>
          <label class="au-label" for="me-email">E-mail</label>
          <div class="lk-field"><input id="me-email" value="${esc(auth.user.email || '')}" disabled></div>
          <p class="me-hint">Dados do curso: preenchem o agendamento de provas e tutorias sozinhos.</p>
          <label class="au-label" for="me-cpf">CPF</label>
          <div class="lk-field"><input id="me-cpf" inputmode="numeric" maxlength="14" placeholder="000.000.000-00" value="${esc(p.cpf ? cpfMask(p.cpf) : '')}" autocomplete="off"></div>
          <label class="au-label" for="me-course">Curso</label>
          <div class="lk-field"><input id="me-course" maxlength="80" placeholder="Ex.: Pedagogia" value="${esc(p.course || '')}"></div>
          <label class="au-label" for="me-college">Faculdade</label>
          <div class="lk-field"><select id="me-college" class="ag-select"><option value="">Selecione</option>${AG.colleges.map((c) => `<option ${p.college === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="me-foot"><button class="btn-dark" type="submit">Salvar dados</button></div>
        </form>
        <form class="me-card" id="me-pass">
          <h3>Trocar senha</h3>
          <label class="au-label" for="me-p1">Nova senha</label>
          <div class="lk-field"><input type="password" id="me-p1" minlength="8" autocomplete="new-password" placeholder="Pelo menos 8 caracteres"></div>
          <label class="au-label" for="me-p2">Repita a nova senha</label>
          <div class="lk-field"><input type="password" id="me-p2" minlength="8" autocomplete="new-password" placeholder="Digite de novo"></div>
          <div class="me-foot"><button class="btn-dark" type="submit">Trocar senha</button></div>
        </form>
        <section class="me-card me-push" id="me-push"><h3>Avisos no celular</h3><div id="me-push-card"></div></section>
      </div>
    </div>`;
    paintIcons(view);
    paintPushCard($('#me-push-card'));

    $('#me-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#me-name').value.trim().slice(0, 60);
      if (name.length < 2) return toast('Digite o seu nome.');
      const cpf = cpfDigits($('#me-cpf').value), course = $('#me-course').value.trim().slice(0, 80), college = $('#me-college').value;
      if (cpf && !cpfOk(cpf)) { $('#me-cpf').focus(); return toast('CPF inválido. Confira os números.'); }
      const username = cleanUsername($('#me-user').value);
      if (username && !USERNAME_RE.test(username)) { $('#me-user').focus(); return toast('Nome de usuário: de 3 a 20 letras minúsculas, números, ponto ou _.'); }
      const { error } = await sb.from('profiles').update({ name, username: username || null, cpf: cpf || null, course: course || null, college: college || null }).eq('id', auth.user.id);
      if (error) return toast(/column|schema cache/i.test(error.message) ? 'Falta atualizar o banco: rode o script 12-nome-de-usuario.sql no Supabase.' : authError(error));
      await refreshMe(); toast('Dados salvos.');
    });
    $('#me-cpf').addEventListener('input', (e) => { e.target.value = cpfMask(e.target.value); });
    $('#me-user').addEventListener('input', (e) => { const v = cleanUsername(e.target.value); if (v !== e.target.value) e.target.value = v; });
    $('#me-pass').addEventListener('submit', async (e) => {
      e.preventDefault();
      const a = $('#me-p1').value, b = $('#me-p2').value;
      if (a.length < 8) return toast('A senha precisa ter pelo menos 8 caracteres.');
      if (a !== b) return toast('As duas senhas não são iguais.');
      const { error } = await sb.auth.updateUser({ password: a });
      if (error) return toast(authError(error));
      e.target.reset(); toast('Senha alterada!');
    });
    $('#me-file').addEventListener('change', async (e) => {
      const file = e.target.files[0]; e.target.value = '';
      if (!file) return;
      if (!/^image\//.test(file.type)) return toast('Escolha um arquivo de imagem.');
      toast('Enviando foto…');
      try {
        const blob = await compressAvatar(file);
        const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg';
        const path = `${auth.user.id}/foto-${Date.now().toString(36)}.${ext}`;
        const up = await sb.storage.from('avatars').upload(path, blob, { contentType: blob.type, upsert: false });
        if (up.error) throw up.error;
        const url = sb.storage.from('avatars').getPublicUrl(path).data.publicUrl;
        const old = auth.profile?.avatar_url;
        const { error } = await sb.from('profiles').update({ avatar_url: url, avatar_focus: null }).eq('id', auth.user.id);
        if (error) throw error;
        removeAvatarFile(old);
        await refreshMe(); renderProfile(view);
        const pos = await focusEditor({ src: url, pos: '', round: true });
        if (pos) { await sb.from('profiles').update({ avatar_focus: pos }).eq('id', auth.user.id); await refreshMe(); renderProfile(view); }
        toast('Foto de perfil atualizada.');
      } catch (err) { toast(authError(err)); }
    });
    view.querySelector('[data-me="focus"]')?.addEventListener('click', async () => {
      const pos = await focusEditor({ src: auth.profile.avatar_url, pos: auth.profile.avatar_focus || '', round: true });
      if (pos == null) return;
      const { error } = await sb.from('profiles').update({ avatar_focus: pos }).eq('id', auth.user.id);
      if (error) return toast(authError(error));
      await refreshMe(); renderProfile(view); toast('Enquadramento salvo.');
    });
    view.querySelector('[data-me="rmphoto"]')?.addEventListener('click', async () => {
      if (!(await confirmDialog({ title: 'Remover foto de perfil?', sub: 'No lugar dela, aparecem as iniciais do seu nome.', image: auth.profile.avatar_url, ok: 'Remover' }))) return;
      const old = auth.profile.avatar_url;
      const { error } = await sb.from('profiles').update({ avatar_url: null, avatar_focus: null }).eq('id', auth.user.id);
      if (error) return toast(authError(error));
      removeAvatarFile(old);
      await refreshMe(); renderProfile(view); toast('Foto removida.');
    });
  });
}
function removeAvatarFile(url) {
  const mark = '/storage/v1/object/public/avatars/';
  if (!url || !url.includes(mark)) return;
  sb.storage.from('avatars').remove([decodeURIComponent(url.split(mark)[1])]).catch(() => {});
}

/* ---------- Painel mestre: usuários ---------- */
let usersCache = [], usersFilter = 'all', usersQuery = '';
let usersPage = 1; const USERS_PER_PAGE = 25; const usersOpen = new Set(); // página atual e cartões abertos
let turmasCache = null, turmaFilter = 'all'; // turmas de Informática (null = banco ainda sem a tabela)
let turmaView = 'ativos'; // 'ativos' = ainda fazendo o curso · 'concluidos' = já terminaram
const concluiu = (u) => !!u.informatica_concluido_em;
let tmAnim = 0; // direção da troca Ativos ⇄ Concluídos que ainda vai animar a entrada (1 = para concluídos, -1 = para ativos)
/* troca Ativos ⇄ Concluídos: a pílula desliza, os cards saem para um lado e os novos entram pelo outro */
function switchTurmaView(view) {
  const box = $('#us-turmas'), list = $('#us-list');
  const dir = view === 'concluidos' ? 1 : -1;
  const go = () => { turmaView = view; turmaFilter = 'all'; usersPage = 1; tmAnim = dir; drawUsers(); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return go();
  const seg = box.querySelector('.tm-seg');
  seg.dataset.v = view;
  seg.querySelectorAll('[data-tv]').forEach((b) => { const on = b.dataset.tv === view; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  box.classList.toggle('tm-done', view === 'concluidos');
  box.style.setProperty('--dx', `${-dir * 36}px`);
  box.classList.add('tm-leaving');
  list.classList.add('us-leaving');
  clearTimeout(switchTurmaView.t);
  switchTurmaView.t = setTimeout(go, 230);
}
const USER_FILTERS = [['all', 'Todos', 'users', 'cadastros no site'], ['pending', 'Aguardando', 'clock', 'esperando aprovação'], ['approved', 'Aprovados', 'check', 'com acesso liberado'], ['blocked', 'Bloqueados', 'lock', 'sem acesso'], ['admin', 'Administradores', 'shield', 'cuidam do site'], ['ped', 'Pedagógico', 'cap', 'setor pedagógico'], ['info', 'Informática', 'monitor', 'alunos do curso']];
// só a conta mestre (a do dono do site) marca quem é aluno de Informática
const OWNER_ID = '885e66d2-3920-4a3c-b7a9-3ffdeaccc7cf';
const isOwner = () => auth.user?.id === OWNER_ID;

function renderUsers(view) {
  waitAuth(view, async () => {
    if (!auth.user) return needLogin(view, 'Usuários');
    if (!isAdmin()) {
      view.innerHTML = `<div class="wrap"><section class="soon">${pageHead('Usuários', 'Acesso restrito.', 'Esta área é só para administradores do site.')}<a class="btn-dark" href="#dashboard">Voltar ao Dashboard</a></section></div>`;
      return;
    }
    view.innerHTML = `
    <div class="wrap us-page">
      ${pageHead('Painel mestre', 'Usuários.', 'Aprove novos cadastros, bloqueie acessos, ajude quem perdeu a senha e escolha quem administra o site.')}
      <div class="us-filters" role="tablist">${USER_FILTERS.map(([k, t, ic, sub]) => `<button type="button" role="tab" data-uf="${k}" class="us-w w-${k} ${k === usersFilter ? 'on' : ''}" aria-selected="${k === usersFilter}"><span class="us-w-ic"><i data-icon="${ic}"></i></span><b data-uc="${k}">–</b><strong>${t}</strong><small>${sub}</small></button>`).join('')}</div>
      <div class="us-bar">
        <label class="us-search"><i data-icon="search"></i><input type="search" id="us-q" placeholder="Buscar por nome ou e-mail" value="${esc(usersQuery)}"></label>
      </div>
      <section class="tm-wrap" id="us-turmas" hidden></section>
      <p class="us-count" id="us-count"></p>
      <div class="us-list" id="us-list"><p class="me-loading">Carregando usuários…</p></div>
      <nav class="sc-pager" id="us-pager" aria-label="Páginas da lista de usuários"></nav>
    </div>`;
    paintIcons(view);
    view.querySelector('.us-filters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-uf]'); if (!b) return;
      usersFilter = b.dataset.uf; usersPage = 1;
      view.querySelectorAll('[data-uf]').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      drawUsers();
    });
    $('#us-q').addEventListener('input', (e) => { usersQuery = e.target.value; usersPage = 1; drawUsers(); });
    $('#us-list').addEventListener('click', (e) => { if (!e.target.closest('[data-ua]') && e.target.closest('[data-ux]')) return toggleUserCard(e.target.closest('.us-row')); userAction(e); });
    $('#us-list').addEventListener('keydown', (e) => { const h = e.target.closest('[data-ux]'); if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleUserCard(h.closest('.us-row')); } });
    $('#us-pager').addEventListener('click', (e) => {
      const b = e.target.closest('[data-pg]'); if (!b || b.disabled) return;
      usersPage = +b.dataset.pg; drawUsers();
      const top = $('.us-bar').getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    });
    $('#us-turmas').addEventListener('click', (e) => {
      const ed = e.target.closest('[data-tm-edit]');
      if (ed) return turmaDialog(turmasCache.find((t) => t.id === ed.dataset.tmEdit));
      if (e.target.closest('[data-tm-new]')) return turmaDialog();
      const v = e.target.closest('[data-tv]');
      if (v) { if (turmaView !== v.dataset.tv) switchTurmaView(v.dataset.tv); return; }
      const c = e.target.closest('[data-tm]'); if (!c) return;
      turmaFilter = c.dataset.tm; usersPage = 1; drawUsers();
    });
    await loadUsers();
  });
}
async function loadUsers() {
  const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) { $('#us-list').innerHTML = `<p class="me-loading">${esc(authError(error))}</p>`; return; }
  usersCache = data || [];
  const tm = await sb.from('turmas').select('*').order('nome');
  turmasCache = tm.error ? null : tm.data || [];
  if (turmasCache && turmaFilter !== 'all' && turmaFilter !== 'none' && !turmasCache.some((t) => t.id === turmaFilter)) turmaFilter = 'all';
  auth.pending = usersCache.filter((u) => u.status === 'pending').length;
  paintUser();
  drawUsers();
}
function drawUsers() {
  const list = $('#us-list'); if (!list) return;
  const match = (u, f) => f === 'all' || (f === 'admin' ? u.role === 'admin' : f === 'info' ? !!u.informatica : f === 'ped' ? !!u.pedagogico : u.status === f);
  USER_FILTERS.forEach(([k]) => { const el = document.querySelector(`[data-uc="${k}"]`); if (!el) return; const n = usersCache.filter((u) => match(u, k)).length; el.textContent = n; el.closest('.us-w').classList.toggle('hot', k === 'pending' && n > 0); });
  drawTurmas();
  const q = fold(usersQuery.trim());
  const inTurma = (u) => usersFilter !== 'info' || ((!turmasCache || concluiu(u) === (turmaView === 'concluidos')) && (turmaFilter === 'all' || (turmaFilter === 'none' ? !u.turma_id : u.turma_id === turmaFilter)));
  const rows = usersCache.filter((u) => match(u, usersFilter) && inTurma(u) && (!q || fold(`${u.name} ${u.email} ${u.username || ''}`).includes(q)));
  const pages = Math.max(1, Math.ceil(rows.length / USERS_PER_PAGE));
  usersPage = Math.min(Math.max(1, usersPage), pages);
  const pg = usersPage, from = (pg - 1) * USERS_PER_PAGE, shown = rows.slice(from, from + USERS_PER_PAGE);
  const cnt = $('#us-count'); if (cnt) cnt.textContent = rows.length ? (pages > 1 ? `${from + 1}–${from + shown.length} de ${rows.length.toLocaleString('pt-BR')} usuários` : `${rows.length} ${rows.length === 1 ? 'usuário' : 'usuários'}`) : '';
  drawUsersPager(pg, pages);
  if (!rows.length) { list.innerHTML = `<p class="us-empty">${usersFilter === 'info' && turmaView === 'concluidos' && !q ? 'Ninguém concluiu o curso ainda. Quando um aluno terminar, use o botão "Concluiu" nele.' : usersCache.length ? 'Ninguém encontrado com esse filtro.' : 'Ainda não há cadastros.'}</p>`; list.classList.remove('us-leaving'); tmAnim = 0; return; }
  const me = auth.user.id;
  list.innerHTML = shown.map((u) => {
    const open = usersOpen.has(u.id);
    const cats = [u.role === 'admin', u.pedagogico, u.informatica, concluiu(u), u.turma_id && turmaName(u.turma_id)].filter(Boolean).length;
    return `
    <article class="us-row ${open ? 'open' : ''}" data-id="${esc(u.id)}">
      <div class="us-head" data-ux role="button" tabindex="0" aria-expanded="${open}" aria-controls="us-more-${esc(u.id)}">
        ${userAvatar(u, 'us-avatar')}
        <div class="us-who">
          <strong>${esc(u.name || 'Sem nome')}${u.id === me ? ' <em>(você)</em>' : ''}</strong>
          <span>${u.username ? `<b class="us-user">@${esc(u.username)}</b> · ` : ''}${esc(u.email)}</span>
          <small>Cadastro em ${new Date(u.created_at).toLocaleDateString('pt-BR')}</small>
        </div>
        <span class="us-pill s-${esc(u.status)}">${esc(STATUS_TXT[u.status])}</span>
        ${cats ? `<span class="us-ncat" title="${cats} ${cats === 1 ? 'categoria' : 'categorias'}">+${cats}</span>` : ''}
        <i data-icon="chevron" class="us-chev"></i>
      </div>
      <div class="us-more" id="us-more-${esc(u.id)}"${open ? '' : ' inert'}><div class="us-more-in">
        <div class="us-sec"><span class="us-lbl">Categorias</span><div class="us-tags">
        <span class="us-pill s-${esc(u.status)}">${esc(STATUS_TXT[u.status])}</span>
        ${u.role === 'admin' ? '<span class="us-pill admin">Administrador</span>' : ''}
        ${u.pedagogico ? '<span class="us-pill ped"><i data-icon="cap"></i>Setor pedagógico</span>' : ''}
        ${u.informatica ? '<span class="us-pill info"><i data-icon="monitor"></i>Aluno de Informática</span>' : ''}
        ${concluiu(u) ? `<span class="us-pill done"><i data-icon="trophy"></i>Concluiu em ${new Date(u.informatica_concluido_em).toLocaleDateString('pt-BR')}</span>` : ''}
        ${u.turma_id && turmaName(u.turma_id) ? `<span class="us-pill tm tm-c${turmaColor(u.turma_id)}"><i data-icon="cap"></i>${esc(turmaName(u.turma_id))}</span>` : ''}
        </div></div>
        <div class="us-sec"><span class="us-lbl">Ações</span>
          <div class="us-actions">
        ${u.status !== 'approved' ? `<button class="btn-dark sm" type="button" data-ua="approve"><i data-icon="check"></i>Aprovar</button>` : ''}
        ${u.status !== 'blocked' && u.id !== me ? `<button class="btn-soft sm" type="button" data-ua="block"><i data-icon="lock"></i>Bloquear</button>` : ''}
        ${isOwner() ? `<button class="btn-soft sm us-info-btn ${u.informatica ? 'on' : ''}" type="button" data-ua="info" aria-pressed="${!!u.informatica}" title="${u.informatica ? 'Tirar o acesso à Plataforma de Informática' : 'Marcar como aluno de Informática (libera a plataforma)'}"><i data-icon="monitor"></i>Informática</button>` : ''}
        ${isOwner() && u.informatica ? `<button class="btn-soft sm us-done-btn ${concluiu(u) ? 'on' : ''}" type="button" data-ua="done" aria-pressed="${concluiu(u)}" title="${concluiu(u) ? 'Voltar para os alunos ativos' : 'Marcar o curso de Informática como concluído'}"><i data-icon="trophy"></i>${concluiu(u) ? 'Concluído' : 'Concluiu'}</button>` : ''}
        <button class="btn-soft sm us-ped-btn ${u.pedagogico ? 'on' : ''}" type="button" data-ua="ped" aria-pressed="${!!u.pedagogico}" title="${u.pedagogico ? 'Tirar do setor pedagógico' : 'Marcar como setor pedagógico (vê os avisos de agendamento no computador)'}"><i data-icon="cap"></i>Pedagógico</button>
        <button class="icon-btn us-at" type="button" data-ua="username" title="${u.username ? 'Trocar' : 'Definir'} o nome de usuário">@</button>
        <button class="icon-btn" type="button" data-ua="reset" title="Enviar link de nova senha por e-mail"><i data-icon="mail"></i></button>
        <button class="icon-btn" type="button" data-ua="setpass" title="Definir uma senha nova"><i data-icon="key"></i></button>
        ${u.id !== me ? `<button class="icon-btn" type="button" data-ua="admin" title="${u.role === 'admin' ? 'Tirar de administrador' : 'Tornar administrador'}"><i data-icon="${u.role === 'admin' ? 'shieldOff' : 'shield'}"></i></button>
        <button class="icon-btn danger" type="button" data-ua="delete" title="Excluir conta"><i data-icon="trash"></i></button>` : ''}
      </div>
        </div>
      </div></div>
    </article>`;
  }).join('');
  paintIcons(list);
  list.classList.remove('us-leaving');
  if (tmAnim) {
    list.querySelectorAll('.us-row').forEach((r, i) => r.style.setProperty('--i', i));
    list.classList.remove('us-entering'); void list.offsetWidth; list.classList.add('us-entering');
    setTimeout(() => list.classList.remove('us-entering'), 900);
    tmAnim = 0;
  }
}
function toggleUserCard(row) {
  if (!row) return;
  const id = row.dataset.id, open = !usersOpen.has(id);
  open ? usersOpen.add(id) : usersOpen.delete(id);
  row.classList.toggle('open', open);
  row.querySelector('[data-ux]').setAttribute('aria-expanded', open);
  row.querySelector('.us-more').inert = !open;
}
function drawUsersPager(pg, pages) {
  const box = $('#us-pager'); if (!box) return;
  if (pages <= 1) { box.innerHTML = ''; return; }
  // sempre a 1ª e a última, e as vizinhas da atual (1 … 4 5 6 … 42)
  const nums = [...new Set([1, pg - 2, pg - 1, pg, pg + 1, pg + 2, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const btns = []; nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) btns.push('<span class="sc-pg-gap">…</span>'); btns.push(`<button type="button" data-pg="${n}" class="${n === pg ? 'on' : ''}"${n === pg ? ' aria-current="page"' : ''}>${n}</button>`); });
  box.innerHTML = `
    <button type="button" class="sc-pg-arrow" data-pg="${pg - 1}" ${pg === 1 ? 'disabled' : ''} aria-label="Página anterior"><i data-icon="left"></i></button>
    ${btns.join('')}
    <button type="button" class="sc-pg-arrow" data-pg="${pg + 1}" ${pg === pages ? 'disabled' : ''} aria-label="Próxima página"><i data-icon="right"></i></button>`;
  paintIcons(box);
}
/* ---------- Turmas de Informática (dentro do widget Informática) ---------- */
const turmaName = (id) => turmasCache?.find((t) => t.id === id)?.nome || '';
// cada turma ganha uma cor fixa (tirada do id), a mesma no card e na etiqueta do aluno
const turmaColor = (id) => [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 6;
function drawTurmas() {
  const box = $('#us-turmas'); if (!box) return;
  box.hidden = usersFilter !== 'info';
  if (box.hidden) return;
  if (!turmasCache) {
    box.innerHTML = `<p class="tm-hint"><i data-icon="users"></i>${isOwner() ? 'Para criar turmas, rode o script <b>19-turmas-informatica.sql</b> no Supabase.' : 'As turmas ainda não foram configuradas.'}</p>`;
    return paintIcons(box);
  }
  const done = turmaView === 'concluidos';
  const todos = usersCache.filter((u) => u.informatica);
  const nDone = todos.filter(concluiu).length;
  const alunos = todos.filter((u) => concluiu(u) === done);
  const members = (id) => alunos.filter((u) => (id === 'all' ? true : id === 'none' ? !u.turma_id : u.turma_id === id));
  const faces = (list) => list.length ? `<span class="tm-faces">${list.slice(0, 4).map((u) => userAvatar(u, 'tm-face')).join('')}${list.length > 4 ? `<i>+${list.length - 4}</i>` : ''}</span>` : '<span class="tm-faces tm-none">ninguém ainda</span>';
  const card = (id, nome, sub, cls, icon, extra = '') => {
    const m = members(id);
    return `
    <div class="tm-card ${cls} ${turmaFilter === id ? 'on' : ''}">
      <button type="button" class="tm-pick" data-tm="${esc(id)}" aria-pressed="${turmaFilter === id}">
        <span class="tm-ico"><i data-icon="${icon}"></i></span>
        <span class="tm-n"><b>${m.length}</b>${m.length === 1 ? 'aluno' : 'alunos'}</span>
        <strong>${esc(nome)}</strong>
        <small>${sub ? `<i data-icon="clock"></i>${esc(sub)}` : 'sem horário definido'}</small>
        ${faces(m)}
      </button>${extra}
    </div>`;
  };
  // nos concluídos aparecem só as turmas de onde alguém já se formou
  const turmas = done ? turmasCache.filter((t) => members(t.id).length) : turmasCache;
  box.classList.toggle('tm-done', done);
  box.innerHTML = `
    <header class="tm-head">
      <span class="tm-head-ic"><i data-icon="${done ? 'trophy' : 'users'}"></i></span>
      <div><h3>${done ? 'Concluídos' : 'Turmas'}</h3><p>${done ? (nDone ? `${nDone} ${nDone === 1 ? 'aluno concluiu' : 'alunos concluíram'} o curso de Informática` : 'Quem terminar o curso aparece aqui, junto da turma.') : turmasCache.length ? `${turmasCache.length} ${turmasCache.length === 1 ? 'turma' : 'turmas'} de Informática` : 'Organize os alunos de Informática em turmas.'}</p></div>
      <div class="tm-seg" role="tablist" data-v="${turmaView}"><span class="tm-seg-ind" aria-hidden="true"></span>
        <button type="button" role="tab" data-tv="ativos" aria-selected="${!done}" class="${done ? '' : 'on'}"><i data-icon="users"></i>Ativos<b>${todos.length - nDone}</b></button>
        <button type="button" role="tab" data-tv="concluidos" aria-selected="${done}" class="${done ? 'on' : ''}"><i data-icon="trophy"></i>Concluídos<b>${nDone}</b></button>
      </div>
      ${isOwner() && !done ? '<button type="button" class="tm-new" data-tm-new><i data-icon="plus"></i>Nova turma</button>' : ''}
    </header>
    <div class="tm-row">
      ${card('all', done ? 'Todos' : 'Todas', '', done ? 'tm-all tm-gold' : 'tm-all', done ? 'trophy' : 'monitor').replace('sem horário definido', done ? 'concluíram o curso' : 'alunos de Informática')}
      ${turmas.map((t) => card(t.id, t.nome, t.horario, `tm-c${turmaColor(t.id)}`, 'cap', isOwner() ? `<button type="button" class="tm-edit" data-tm-edit="${esc(t.id)}" title="Editar ${esc(t.nome)}" aria-label="Editar ${esc(t.nome)}"><i data-icon="edit"></i></button>` : '')).join('')}
      ${!done || members('none').length ? card('none', 'Sem turma', '', 'tm-free', 'userPlus').replace('sem horário definido', done ? 'concluíram sem turma' : 'ainda não designados') : ''}
    </div>`;
  paintIcons(box);
  box.classList.remove('tm-leaving');
  if (tmAnim) {
    box.style.setProperty('--dx', `${tmAnim * 44}px`);
    box.querySelectorAll('.tm-card').forEach((c, i) => c.style.setProperty('--i', i));
    box.classList.remove('tm-entering'); void box.offsetWidth; box.classList.add('tm-entering');
    clearTimeout(drawTurmas.t); drawTurmas.t = setTimeout(() => box.classList.remove('tm-entering'), 900);
  }
}

/* criar ou editar uma turma: nome, dias/horário e quem faz parte */
function turmaDialog(t = null) {
  if (!isOwner() || document.querySelector('.lk')) return;
  const alunos = usersCache.filter((u) => u.informatica && !concluiu(u)).sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'));
  // quem já concluiu continua na turma (não aparece na lista, mas não pode sair dela ao salvar)
  const formados = t ? usersCache.filter((u) => u.turma_id === t.id && concluiu(u)).map((u) => u.id) : [];
  const chosen = new Set(t ? alunos.filter((u) => u.turma_id === t.id).map((u) => u.id) : []);
  const wrap = document.createElement('div');
  wrap.className = 'lk au';
  wrap.innerHTML = `<div class="lk-backdrop"></div>
    <form class="lk-card au-card rf-dlg tm-dlg" role="dialog" aria-modal="true" aria-labelledby="tm-t" novalidate>
      <span class="lk-icon au-ico"><i data-icon="users"></i></span>
      <h2 id="tm-t">${t ? 'Editar turma' : 'Nova turma'}</h2>
      <p class="lk-sub">${t ? 'Ajuste o nome, o horário e quem faz parte.' : 'Dê um nome, o horário e escolha os alunos.'}</p>
      <label class="au-label" for="tm-n">Nome da turma</label><div class="lk-field"><input id="tm-n" maxlength="60" autocomplete="off" placeholder="Ex.: Turma A" value="${esc(t?.nome || '')}"></div>
      <label class="au-label" for="tm-h">Dias e horário <span class="tm-opt">(opcional)</span></label><div class="lk-field"><input id="tm-h" maxlength="80" autocomplete="off" placeholder="Ex.: Seg e Qua · 14h às 16h" value="${esc(t?.horario || '')}"></div>
      <div class="tm-al-head"><span class="au-label">Alunos</span><small id="tm-c"></small></div>
      ${alunos.length > 5 ? '<div class="lk-field"><input id="tm-q" type="search" autocomplete="off" placeholder="Buscar aluno"></div>' : ''}
      <div class="tm-al" id="tm-al">${alunos.length ? alunos.map((u) => {
        const other = u.turma_id && u.turma_id !== t?.id ? turmaName(u.turma_id) : '';
        return `<label class="tm-a" data-name="${esc(fold(`${u.name} ${u.email} ${u.username || ''}`))}">
          ${userAvatar(u, 'us-avatar rf-gav')}
          <span class="rf-gwho"><strong>${esc(u.name || 'Sem nome')}</strong><small>${other ? `Hoje na ${esc(other)}` : esc(u.username ? '@' + u.username : u.email)}</small></span>
          <input type="checkbox" value="${esc(u.id)}" ${chosen.has(u.id) ? 'checked' : ''}>
        </label>`;
      }).join('') : '<p class="ag-desc">Ainda não há alunos de Informática. Marque-os pelo botão "Informática" na lista.</p>'}</div>
      <p class="lk-msg" role="alert"></p>
      <div class="lk-actions">${t ? '<button type="button" class="btn-soft tm-del" title="Apagar turma"><i data-icon="trash"></i></button>' : ''}<button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">${t ? 'Salvar' : 'Criar turma'}</button></div>
    </form>`;
  document.body.appendChild(wrap); paintIcons(wrap);
  const msg = wrap.querySelector('.lk-msg'), list = wrap.querySelector('#tm-al'), cnt = wrap.querySelector('#tm-c');
  const upd = () => { const n = list.querySelectorAll('input:checked').length; cnt.textContent = n ? `${n} ${n === 1 ? 'escolhido' : 'escolhidos'}` : ''; };
  list.addEventListener('change', upd); upd();
  wrap.querySelector('#tm-q')?.addEventListener('input', (e) => {
    const f = fold(e.target.value.trim());
    list.querySelectorAll('.tm-a').forEach((el) => { el.hidden = !!f && !el.dataset.name.includes(f); });
  });
  const close = () => { wrap.classList.remove('in'); document.removeEventListener('keydown', onKey); setTimeout(() => wrap.remove(), 300); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  wrap.querySelector('.lk-backdrop').addEventListener('click', close);
  wrap.querySelector('.lk-cancel').addEventListener('click', close);
  wrap.querySelector('.tm-del')?.addEventListener('click', async () => {
    close();
    if (!(await confirmDialog({ title: `Apagar a ${t.nome}?`, sub: 'Os alunos continuam com acesso à Informática, só ficam sem turma.', ok: 'Apagar turma' }))) return;
    const { error } = await sb.rpc('owner_delete_turma', { tid: t.id });
    if (error) return toast(authError(error));
    if (turmaFilter === t.id) turmaFilter = 'all';
    toast(`${t.nome} foi apagada.`); loadUsers();
  });
  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = wrap.querySelector('#tm-n').value.trim().replace(/\s+/g, ' ');
    if (!nome) { msg.textContent = 'Dê um nome para a turma.'; return wrap.querySelector('#tm-n').focus(); }
    if (turmasCache.some((x) => x.id !== t?.id && fold(x.nome) === fold(nome))) { msg.textContent = 'Já existe uma turma com esse nome.'; return wrap.querySelector('#tm-n').focus(); }
    const go = wrap.querySelector('.lk-go'); go.disabled = true;
    const { data, error } = await sb.rpc('owner_save_turma', { tid: t?.id || null, p_nome: nome, p_horario: wrap.querySelector('#tm-h').value.trim(), alunos: [...list.querySelectorAll('input:checked')].map((i) => i.value).concat(formados) });
    go.disabled = false;
    if (error) { msg.textContent = authError(error); return; }
    close();
    if (!t && data) turmaFilter = data;
    toast(t ? `${nome} foi atualizada.` : `${nome} foi criada.`);
    loadUsers();
  });
  requestAnimationFrame(() => wrap.classList.add('in'));
  setTimeout(() => wrap.querySelector('#tm-n').focus(), 60);
}

async function userAction(e) {
  const b = e.target.closest('[data-ua]'); if (!b) return;
  const u = usersCache.find((x) => x.id === b.closest('.us-row').dataset.id); if (!u) return;
  const who = u.name || u.email;
  const rpc = async (fn, args, okMsg) => {
    b.disabled = true;
    const { error } = await sb.rpc(fn, args);
    b.disabled = false;
    if (error) return toast(/concluido/i.test(error.message || '') && !/conta mestre/i.test(error.message || '') ? 'Falta atualizar o banco: rode o script 20-informatica-concluidos.sql no Supabase.' : /informatica/i.test(error.message || '') ? 'Falta atualizar o banco: rode o script 07-alunos-informatica.sql no Supabase.' : /pedagogico/i.test(error.message || '') ? 'Falta atualizar o banco: rode o script 15-setor-pedagogico.sql no Supabase.' : authError(error)), false;
    toast(okMsg); await loadUsers(); return true;
  };
  switch (b.dataset.ua) {
    case 'approve': return rpc('admin_update_user', { target: u.id, new_status: 'approved' }, `${who} foi aprovado.`);
    case 'block':
      if (!(await confirmDialog({ title: `Bloquear ${who}?`, sub: 'A pessoa não consegue mais entrar até você aprovar de novo.', ok: 'Bloquear', icon: 'lock' }))) return;
      return rpc('admin_update_user', { target: u.id, new_status: 'blocked' }, `${who} foi bloqueado.`);
    case 'admin': {
      const make = u.role !== 'admin';
      if (!(await confirmDialog({ title: make ? `Tornar ${who} administrador?` : `Tirar ${who} de administrador?`, sub: make ? 'Administradores veem todos os cadastros e podem aprovar, bloquear e trocar senhas.' : 'A pessoa continua com a conta, mas sem acesso ao painel mestre.', ok: make ? 'Tornar administrador' : 'Tirar acesso', icon: 'shield' }))) return;
      return rpc('admin_update_user', { target: u.id, new_role: make ? 'admin' : 'user', new_status: make ? 'approved' : null }, make ? `${who} agora é administrador.` : `${who} não é mais administrador.`);
    }
    case 'info': {
      if (!isOwner()) return toast('Só a conta mestre pode marcar alunos de Informática.');
      const on = !u.informatica;
      if (!on && !(await confirmDialog({ title: `Tirar ${who} da Informática?`, sub: 'A pessoa deixa de entrar direto na Plataforma de Informática pelo banner.', ok: 'Tirar acesso', icon: 'monitor' }))) return;
      return rpc('admin_set_informatica', { target: u.id, value: on }, on ? `${who} agora tem acesso à Plataforma de Informática.` : `${who} não tem mais acesso à Plataforma de Informática.`)
        .then((ok) => { if (ok && u.id === auth.user.id) refreshMe(); });
    }
    case 'done': {
      if (!isOwner()) return;
      const on = !concluiu(u);
      if (!(await confirmDialog(on
        ? { title: `${who} concluiu o curso?`, sub: 'A pessoa sai das turmas ativas e vai para "Concluídos", junto da turma dela. O acesso à plataforma e o progresso continuam.', ok: 'Marcar como concluído', icon: 'trophy' }
        : { title: `Voltar ${who} para os ativos?`, sub: 'A marcação de curso concluído é retirada e a pessoa volta para a turma ativa.', ok: 'Voltar para ativos', icon: 'users' }))) return;
      return rpc('owner_set_concluido', { target: u.id, value: on }, on ? `${who} concluiu o curso de Informática!` : `${who} voltou para os alunos ativos.`);
    }
    case 'ped': {
      const on = !u.pedagogico;
      if (!on && !(await confirmDialog({ title: `Tirar ${who} do setor pedagógico?`, sub: 'A pessoa deixa de ver os avisos de agendamento no cabeçalho.', ok: 'Tirar', icon: 'cap' }))) return;
      return rpc('admin_set_pedagogico', { target: u.id, value: on }, on ? `${who} agora é do setor pedagógico.` : `${who} não é mais do setor pedagógico.`)
        .then((ok) => { if (ok && u.id === auth.user.id) refreshMe(); });
    }
    case 'reset': {
      b.disabled = true;
      const { error } = await sb.auth.resetPasswordForEmail(u.email, { redirectTo: siteUrl() });
      b.disabled = false;
      return toast(error ? authError(error) : `Link de nova senha enviado para ${u.email}.`);
    }
    case 'setpass': {
      const pass = await inputDialog({ title: `Nova senha para ${who}`, sub: 'Passe essa senha para a pessoa. Depois ela pode trocar em "Meu perfil".', placeholder: 'Pelo menos 8 caracteres', type: 'password', ok: 'Definir senha', min: 8 });
      if (pass == null) return;
      return rpc('admin_set_password', { target: u.id, new_password: pass }, `Senha de ${who} alterada.`);
    }
    case 'username': {
      const raw = await inputDialog({ title: `Nome de usuário de ${who}`, sub: 'Com ele a pessoa entra no site no lugar do e-mail. Deixe vazio para tirar.', placeholder: 'ex.: maria.silva', value: u.username || '', ok: 'Salvar', icon: 'user' });
      if (raw == null) return;
      const name = cleanUsername(raw);
      if (name && !USERNAME_RE.test(name)) return toast('Nome de usuário: de 3 a 20 letras minúsculas, números, ponto ou _.');
      return rpc('admin_set_username', { target: u.id, value: name }, name ? `${who} agora entra como @${name}.` : `Nome de usuário de ${who} removido.`);
    }
    case 'delete':
      if (!(await confirmDialog({ title: `Excluir a conta de ${who}?`, sub: 'O cadastro e os dados da pessoa serão apagados de vez. Não dá para desfazer.', image: u.avatar_url || '', ok: 'Excluir conta' }))) return;
      return rpc('admin_delete_user', { target: u.id }, `Conta de ${who} excluída.`);
  }
}

/* ---------- Política de Privacidade ---------- */
function renderPrivacy(view) {
  view.innerHTML = `
  <div class="wrap pv-page">
    ${pageHead('HC Instituto Educacional', 'Política de Privacidade.', 'Como cuidamos dos dados de quem tem conta no site.')}
    <article class="pv-text">
      <h3>Quais dados guardamos</h3>
      <p>Nome, e-mail, foto de perfil (se você enviar) e as informações que você mesmo adicionar nas áreas do site. A senha é guardada de forma criptografada: nem a equipe do polo consegue vê-la.</p>
      <h3>Para que usamos</h3>
      <p>Para identificar você no site, liberar o acesso às áreas de alunos e guardar o que você preencher. Não vendemos nem compartilhamos seus dados com outras empresas para propaganda.</p>
      <h3>Quem tem acesso</h3>
      <p>Só você e os administradores do HC Instituto Educacional, que podem aprovar, bloquear ou ajudar a recuperar contas. Os dados ficam em servidores do Supabase, nosso fornecedor de banco de dados.</p>
      <h3>Seus direitos</h3>
      <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você pode pedir para ver, corrigir ou apagar seus dados a qualquer momento. Nome e foto você mesmo altera em "Meu perfil"; para apagar a conta, fale com a secretaria do polo.</p>
    </article>
  </div>`;
}

/* ---------- Conteúdo do site compartilhado ----------
   Tudo o que se edita em Configurações fica na tabela site_content (todos leem, só
   administradores gravam) e as imagens no bucket público "site". Assim, uma troca feita
   por um administrador aparece para todo mundo, sem precisar publicar no GitHub. */
const CONTENT = {
  banners: [() => banners, (v) => { banners = v; }], exclusive: [() => exclusive, (v) => { exclusive = v; }],
  links: [() => links, (v) => { links = v; }], news: [() => news, (v) => { news = v; }],
  brand: [() => brandList, (v) => { brandList = v; }], connect: [() => connect, (v) => { connect = v; }],
  authors: [() => authors, (v) => { authors = v; }], radar: [() => radar, (v) => { radar = v; }],
  cursoExtra: [() => cursoExtra, (v) => { cursoExtra = v; }], cursoEdit: [() => cursoEdit, (v) => { cursoEdit = v; }],
  cursoConteudo: [() => cursoConteudo, (v) => { cursoConteudo = v; }],
  loginBanner: [() => loginBanner, (v) => { loginBanner = v; }], hubs: [() => hubs, (v) => { hubs = v; }],
};
// alterações que ainda não chegaram ao banco (sem internet, por exemplo): não são sobrescritas
const pending = new Set(store.get('pending', []));
const setPending = (key, on) => { on ? pending.add(key) : pending.delete(key); store.set('pending', [...pending]); };

async function loadRemote() {
  if (!sb) return false;
  try {
    const res = await Promise.race([
      sb.from('site_content').select('key, data'),
      new Promise((r) => setTimeout(() => r({ timeout: true }), 4000)), // sem resposta: usa o que já tem
    ]);
    if (res.timeout || res.error || !res.data) return false;
    res.data.forEach(({ key, data }) => {
      if (!CONTENT[key] || !Array.isArray(data) || pending.has(key)) return;
      CONTENT[key][1](data);
      store.set(key, data);
    });
    scheduleSweep(); // administrador abriu o site: limpa o que sobrou de trocas antigas
    return true;
  } catch { return false; }
}

const EXT_OF = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };
async function uploadRef(ref) {
  if (!ref || !ref.startsWith('idb:')) return ref; // já é um endereço (Supabase ou arquivo do site)
  const blob = await idbGet(ref.slice(4));
  if (!blob) return '';
  const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${EXT_OF[blob.type] || 'jpg'}`;
  const up = await sb.storage.from('site').upload(path, blob, { contentType: blob.type || 'image/jpeg', cacheControl: '31536000' });
  if (up.error) throw up.error;
  const url = sb.storage.from('site').getPublicUrl(path).data.publicUrl;
  if (imgCache.has(ref)) imgCache.set(url, imgCache.get(ref)); // continua exibindo sem baixar de novo
  return url;
}

const pushTimers = {}, pushChain = {};
let pushToastTimer;
function queuePush(key) {
  if (!CONTENT[key] || !isAdmin()) return;
  setPending(key, true);
  clearTimeout(pushTimers[key]);
  pushTimers[key] = setTimeout(() => { pushChain[key] = (pushChain[key] || Promise.resolve()).then(() => pushContent(key)); }, 1200);
}
async function pushContent(key) {
  if (!isAdmin()) return;
  const list = CONTENT[key][0]();
  try {
    for (const it of list) {
      if (it.image) it.image = await uploadRef(it.image);
      if (it.imageMobile) it.imageMobile = await uploadRef(it.imageMobile);
      if (it.logo) it.logo = await uploadRef(it.logo);
      if (it.avatar) it.avatar = await uploadRef(it.avatar);
      if (Array.isArray(it.gallery)) it.gallery = (await Promise.all(it.gallery.map(uploadRef))).filter(Boolean);
    }
    store.set(key, list);
    const { error } = await sb.from('site_content').upsert({ key, data: list });
    if (error) throw error;
    setPending(key, false);
    scheduleSweep();
    clearTimeout(pushToastTimer);
    pushToastTimer = setTimeout(() => toast('Salvo. A alteração já aparece para todos.'), 300);
  } catch (err) {
    toast('Salvo só neste computador: ' + authError(err) + ' Vamos tentar de novo.');
    setTimeout(() => queuePush(key), 15000);
  }
}
/* Limpeza do bucket "site": depois de salvar, apaga as imagens que não aparecem em mais
   nenhum lugar — nem no banco (todas as chaves), nem neste navegador, nem no content.js
   publicado (essas só saem depois da próxima publicação). Arquivos com menos de 1 hora
   ficam, para não apagar o envio de outro administrador que ainda está salvando. */
let sweepTimer, sweepRunning = false;
function scheduleSweep() {
  clearTimeout(sweepTimer);
  sweepTimer = setTimeout(sweepSiteImages, 8000);
}
async function sweepSiteImages() {
  if (!sb || !isAdmin() || sweepRunning || pending.size) return;
  sweepRunning = true;
  try {
    const { data: rows, error } = await sb.from('site_content').select('data');
    if (error || !rows?.length) return; // sem a lista completa, não apaga nada
    const used = JSON.stringify(rows) + JSON.stringify(window.HC_CONTENT || {})
      + JSON.stringify(Object.values(CONTENT).map(([get]) => get()));
    const bucket = sb.storage.from('site');
    const listAll = async (prefix) => {
      const out = [];
      for (let offset = 0; ; offset += 1000) {
        const { data, error: e } = await bucket.list(prefix, { limit: 1000, offset });
        if (e) throw e;
        out.push(...data);
        if (data.length < 1000) return out;
      }
    };
    const cutoff = Date.now() - 3600e3, gone = [];
    for (const dir of await listAll('')) {
      if (dir.id) continue; // só pastas (AAAA-MM) na raiz
      for (const f of await listAll(dir.name)) {
        if (!f.id || f.name.startsWith('.')) continue;
        const path = `${dir.name}/${f.name}`;
        if (new Date(f.created_at).getTime() > cutoff) continue;
        if (!used.includes(path)) gone.push(path);
      }
    }
    for (let i = 0; i < gone.length; i += 100) await bucket.remove(gone.slice(i, i + 100));
    if (gone.length) console.info(`[HC] ${gone.length} imagem(ns) sem uso apagada(s) do Supabase.`);
  } catch (err) { console.warn('[HC] limpeza de imagens:', err); }
  finally { sweepRunning = false; }
}
window.HC_sweepImages = sweepSiteImages;

// envia de uma vez todo o conteúdo atual (usado na primeira vez)
async function pushAll() { for (const k of Object.keys(CONTENT)) await pushContent(k); return 'ok'; }

window.HC_loadRemote = loadRemote;
window.HC_queuePush = queuePush;
window.HC_pushAll = pushAll;

/* ---------- Áreas só de administradores ---------- */
function adminOnly(view, title) {
  waitAuth(view, () => {
    if (!auth.user) return needLogin(view, title);
    view.innerHTML = `<div class="wrap"><section class="soon">${pageHead(esc(title), 'Acesso restrito.', 'Esta área é só para administradores do site. Se você precisa de acesso, fale com a secretaria do polo.')}<a class="btn-dark" href="#dashboard">Voltar ao Dashboard</a></section></div>`;
  });
}
const ADMIN_LINK_TITLES = { semipresencial: 'Sistema Semipresencial' };
document.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-locked]'); if (!a) return;
  e.preventDefault();
  const id = a.dataset.locked, title = ADMIN_LINK_TITLES[id] || 'Área restrita';
  if (!sb) return toast('Não foi possível verificar o acesso. Verifique a internet.');
  if (!auth.user) { toast(`${title}: entre com uma conta de administrador.`); return openAuth('login'); }
  if (!isAdmin()) return openAuth('info', { title: 'Acesso restrito', icon: 'lock', tone: 'warn', text: `O ${esc(title)} é só para administradores do site.` });
  const url = auth.links?.[id];
  if (url) return void window.open(url, '_blank', 'noopener');
  // ainda não carregou: busca e mostra um link para abrir (o navegador bloqueia abrir guia depois de esperar)
  const { data } = await sb.from('admin_links').select('url').eq('id', id).maybeSingle();
  if (!data?.url) return toast('Esse link ainda não foi cadastrado.');
  auth.links[id] = data.url;
  if (!window.open(data.url, '_blank', 'noopener')) toast('Toque de novo para abrir.');
});

window.HC_ROUTES = { perfil: renderProfile, usuarios: renderUsers, privacidade: renderPrivacy };
window.HC_isAdmin = isAdmin;
window.HC_adminOnly = adminOnly;
window.HC_signOut = signOut;

/* ---------- Início ---------- */
(() => {
  // erros que o Supabase devolve no endereço (link expirado etc.)
  const params = new URLSearchParams(location.search + '&' + location.hash.replace(/^#/, ''));
  const errDesc = params.get('error_description');
  if (errDesc) {
    history.replaceState(null, '', location.pathname + '#dashboard');
    setTimeout(() => openAuth('info', { title: 'Link inválido', icon: 'alert', tone: 'warn', text: esc(authError(errDesc)) + ' Se você já confirmou o e-mail, é só entrar.' }), 400);
  }
  const fromEmail = params.has('code');
  if (!sb) { auth.ready = true; paintUser(); return; }
  sb.auth.onAuthStateChange((event, session) => {
    setTimeout(async () => { // fora do callback do Supabase, como a documentação recomenda
      if (event === 'PASSWORD_RECOVERY') { await setUser(session?.user); return openAuth('newpass'); }
      if (event === 'SIGNED_OUT') {
        auth.user = null; auth.profile = null; auth.pending = 0; paintUser();
        if (typeof agForm !== 'undefined') Object.assign(agForm, { name: '', cpf: '', course: '', college: '' }); // não deixa dados no agendamento
        if ((location.hash || '').startsWith('#indicar')) route(); // tira da tela as indicações de quem saiu
        return;
      }
      if (['INITIAL_SESSION', 'SIGNED_IN', 'USER_UPDATED', 'TOKEN_REFRESHED'].includes(event)) {
        if (!session && hasStoredSession()) session = await recoverSession(); // falha passageira: não desloga
        await setUser(session?.user);
        if (event === 'SIGNED_IN' && fromEmail) {
          history.replaceState(null, '', location.pathname + location.hash);
          if (auth.profile?.status === 'pending') openAuth('info', { title: 'E-mail confirmado!', text: 'Obrigado! Agora a secretaria do polo vai liberar o seu acesso. Você pode continuar navegando normalmente.' });
        }
      }
    }, 0);
  });
  // confirmação aberta em outro aparelho: o e-mail já foi confirmado, só falta entrar
  if (fromEmail) setTimeout(async () => {
    if (auth.user) return;
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      history.replaceState(null, '', location.pathname + location.hash);
      openAuth('info', { title: 'E-mail confirmado!', text: 'Agora é só entrar com o seu e-mail e senha.' });
    }
  }, 2500);
})();
