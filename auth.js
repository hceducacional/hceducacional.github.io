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
const AVATAR_MAX = 512;
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
  if ((changed || first) && (r === 'perfil' || r === 'usuarios' || r.startsWith('config') || r.startsWith('agendar'))) route(); // a página depende de quem entrou
}
async function refreshMe() { await loadProfile(); paintUser(); }

/* ---------- Barra de cima: nome, e-mail e foto ---------- */
function paintUser() {
  document.body.classList.toggle('is-admin', isAdmin()); // mostra os itens só de administradores
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
  if (e.target.closest('.tb-me')) return toggleMenu();
  const act = e.target.closest('[data-auth]')?.dataset.auth;
  if (act === 'login') { e.preventDefault(); openAuth('login'); }
  if (act === 'signup') { e.preventDefault(); openAuth('signup'); }
  if (act === 'logout') { e.preventDefault(); signOut(); }
  if (!e.target.closest('.um') || e.target.closest('.um-item')) toggleMenu(false);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
window.addEventListener('hashchange', () => toggleMenu(false));

async function signOut() {
  await sb?.auth.signOut();
  toast('Você saiu da sua conta.');
  if (['perfil', 'usuarios'].includes(location.hash.slice(1))) location.hash = '#dashboard';
}

/* ---------- Janela de entrar / criar conta / recuperar senha ---------- */
const eyeBtn = '<button type="button" class="lk-eye" aria-label="Mostrar senha"><i data-icon="eye"></i></button>';
const AUTH_VIEWS = {
  login: () => `
    <span class="lk-icon au-ico"><i data-icon="user"></i></span>
    <h2 id="au-title">Entrar</h2>
    <p class="lk-sub">Use o e-mail e a senha do seu cadastro no HC Instituto Educacional.</p>
    <div class="au-tabs" role="tablist"><button type="button" class="on" role="tab" aria-selected="true">Entrar</button><button type="button" role="tab" aria-selected="false" data-go="signup">Criar conta</button></div>
    <label class="au-label" for="au-email">E-mail</label>
    <div class="lk-field"><input type="email" id="au-email" name="email" autocomplete="email" placeholder="seuemail@exemplo.com" required></div>
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
  wrap.className = 'lk au';
  wrap.innerHTML = '<div class="lk-backdrop"></div><form class="lk-card au-card" role="dialog" aria-modal="true" aria-labelledby="au-title" novalidate></form>';
  document.body.appendChild(wrap);
  const card = wrap.querySelector('form');
  const lastFocus = document.activeElement;
  let current = mode, ctx = data;

  const draw = (m, d = {}) => {
    const keepEmail = card.querySelector('#au-email')?.value || d.email || '';
    current = m; ctx = d;
    card.innerHTML = AUTH_VIEWS[m](d);
    card.dataset.mode = m;
    card.classList.remove('error');
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
  const close = () => {
    document.removeEventListener('keydown', onKey);
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
  card.addEventListener('input', () => { msg(''); card.classList.remove('error'); });

  card.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = (id) => card.querySelector(id)?.value.trim() || '';
    const email = v('#au-email').toLowerCase(), pass = card.querySelector('#au-pass')?.value || '';
    const needEmail = ['login', 'signup', 'forgot'].includes(current);
    if (needEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg('Digite um e-mail válido.'); return card.querySelector('#au-email').focus(); }

    if (current === 'login') {
      if (!pass) return msg('Digite a sua senha.');
      busy(true, 'Entrando…');
      const { data: res, error } = await sb.auth.signInWithPassword({ email, password: pass });
      busy(false);
      if (error) {
        msg(authError(error));
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
      if (pass.length < 8) { msg('A senha precisa ter pelo menos 8 caracteres.'); return card.querySelector('#au-pass').focus(); }
      if (!card.querySelector('#au-ok').checked) return msg('Para criar a conta, aceite a Política de Privacidade.');
      busy(true, 'Criando…');
      const { data: res, error } = await sb.auth.signUp({ email, password: pass, options: { data: { name }, emailRedirectTo: siteUrl() } });
      busy(false);
      if (error) return msg(authError(error));
      if (res.session) { await setUser(res.user); close(); return toast('Conta criada!'); }
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
  requestAnimationFrame(() => wrap.classList.add('in'));
}

/* ---------- Pop-up simples com um campo (ex.: definir senha de alguém) ---------- */
function inputDialog({ title, sub = '', placeholder = '', ok = 'Salvar', type = 'text', icon = 'key', min = 0 }) {
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
        <div class="lk-field"><input type="${type}" id="in-val" placeholder="${esc(placeholder)}" autocomplete="${type === 'password' ? 'new-password' : 'off'}">${type === 'password' ? eyeBtn : ''}</div>
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
            <label class="me-cam" title="Trocar foto"><i data-icon="image"></i><input type="file" accept="image/jpeg,image/png,image/webp" id="me-file" hidden></label>
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
          <label class="au-label" for="me-email">E-mail</label>
          <div class="lk-field"><input id="me-email" value="${esc(auth.user.email || '')}" disabled></div>
          <div class="me-foot"><button class="btn-dark" type="submit">Salvar nome</button></div>
        </form>
        <form class="me-card" id="me-pass">
          <h3>Trocar senha</h3>
          <label class="au-label" for="me-p1">Nova senha</label>
          <div class="lk-field"><input type="password" id="me-p1" minlength="8" autocomplete="new-password" placeholder="Pelo menos 8 caracteres"></div>
          <label class="au-label" for="me-p2">Repita a nova senha</label>
          <div class="lk-field"><input type="password" id="me-p2" minlength="8" autocomplete="new-password" placeholder="Digite de novo"></div>
          <div class="me-foot"><button class="btn-dark" type="submit">Trocar senha</button></div>
        </form>
      </div>
    </div>`;
    paintIcons(view);

    $('#me-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#me-name').value.trim().slice(0, 60);
      if (name.length < 2) return toast('Digite o seu nome.');
      const { error } = await sb.from('profiles').update({ name }).eq('id', auth.user.id);
      if (error) return toast(authError(error));
      await refreshMe(); toast('Nome salvo.');
    });
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
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return toast('Use uma foto em JPG, PNG ou WebP.');
      toast('Enviando foto…');
      try {
        const blob = await prepareImage(file, AVATAR_MAX);
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
const USER_FILTERS = [['all', 'Todos'], ['pending', 'Aguardando'], ['approved', 'Aprovados'], ['blocked', 'Bloqueados'], ['admin', 'Administradores']];

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
      <div class="us-bar">
        <div class="us-filters" role="tablist">${USER_FILTERS.map(([k, t]) => `<button type="button" role="tab" data-uf="${k}" class="${k === usersFilter ? 'on' : ''}">${t}<b data-uc="${k}"></b></button>`).join('')}</div>
        <label class="us-search"><i data-icon="search"></i><input type="search" id="us-q" placeholder="Buscar por nome ou e-mail" value="${esc(usersQuery)}"></label>
      </div>
      <div class="us-list" id="us-list"><p class="me-loading">Carregando usuários…</p></div>
    </div>`;
    paintIcons(view);
    view.querySelector('.us-filters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-uf]'); if (!b) return;
      usersFilter = b.dataset.uf;
      view.querySelectorAll('[data-uf]').forEach((x) => x.classList.toggle('on', x === b));
      drawUsers();
    });
    $('#us-q').addEventListener('input', (e) => { usersQuery = e.target.value; drawUsers(); });
    $('#us-list').addEventListener('click', userAction);
    await loadUsers();
  });
}
async function loadUsers() {
  const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) { $('#us-list').innerHTML = `<p class="me-loading">${esc(authError(error))}</p>`; return; }
  usersCache = data || [];
  auth.pending = usersCache.filter((u) => u.status === 'pending').length;
  paintUser();
  drawUsers();
}
function drawUsers() {
  const list = $('#us-list'); if (!list) return;
  const match = (u, f) => f === 'all' || (f === 'admin' ? u.role === 'admin' : u.status === f);
  USER_FILTERS.forEach(([k]) => { const el = document.querySelector(`[data-uc="${k}"]`); if (el) el.textContent = usersCache.filter((u) => match(u, k)).length; });
  const q = fold(usersQuery.trim());
  const rows = usersCache.filter((u) => match(u, usersFilter) && (!q || fold(`${u.name} ${u.email}`).includes(q)));
  if (!rows.length) { list.innerHTML = `<p class="us-empty">${usersCache.length ? 'Ninguém encontrado com esse filtro.' : 'Ainda não há cadastros.'}</p>`; return; }
  const me = auth.user.id;
  list.innerHTML = rows.map((u) => `
    <article class="us-row" data-id="${esc(u.id)}">
      ${userAvatar(u, 'us-avatar')}
      <div class="us-who">
        <strong>${esc(u.name || 'Sem nome')}${u.id === me ? ' <em>(você)</em>' : ''}</strong>
        <span>${esc(u.email)}</span>
        <small>Cadastro em ${new Date(u.created_at).toLocaleDateString('pt-BR')}</small>
      </div>
      <div class="us-tags">
        <span class="us-pill s-${esc(u.status)}">${esc(STATUS_TXT[u.status])}</span>
        ${u.role === 'admin' ? '<span class="us-pill admin">Administrador</span>' : ''}
      </div>
      <div class="us-actions">
        ${u.status !== 'approved' ? `<button class="btn-dark sm" type="button" data-ua="approve"><i data-icon="check"></i>Aprovar</button>` : ''}
        ${u.status !== 'blocked' && u.id !== me ? `<button class="btn-soft sm" type="button" data-ua="block"><i data-icon="lock"></i>Bloquear</button>` : ''}
        <button class="icon-btn" type="button" data-ua="reset" title="Enviar link de nova senha por e-mail"><i data-icon="mail"></i></button>
        <button class="icon-btn" type="button" data-ua="setpass" title="Definir uma senha nova"><i data-icon="key"></i></button>
        ${u.id !== me ? `<button class="icon-btn" type="button" data-ua="admin" title="${u.role === 'admin' ? 'Tirar de administrador' : 'Tornar administrador'}"><i data-icon="${u.role === 'admin' ? 'shieldOff' : 'shield'}"></i></button>
        <button class="icon-btn danger" type="button" data-ua="delete" title="Excluir conta"><i data-icon="trash"></i></button>` : ''}
      </div>
    </article>`).join('');
  paintIcons(list);
}
async function userAction(e) {
  const b = e.target.closest('[data-ua]'); if (!b) return;
  const u = usersCache.find((x) => x.id === b.closest('.us-row').dataset.id); if (!u) return;
  const who = u.name || u.email;
  const rpc = async (fn, args, okMsg) => {
    b.disabled = true;
    const { error } = await sb.rpc(fn, args);
    b.disabled = false;
    if (error) return toast(authError(error)), false;
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
      if (Array.isArray(it.gallery)) it.gallery = (await Promise.all(it.gallery.map(uploadRef))).filter(Boolean);
    }
    store.set(key, list);
    const { error } = await sb.from('site_content').upsert({ key, data: list });
    if (error) throw error;
    setPending(key, false);
    clearTimeout(pushToastTimer);
    pushToastTimer = setTimeout(() => toast('Salvo. A alteração já aparece para todos.'), 300);
  } catch (err) {
    toast('Salvo só neste computador: ' + authError(err) + ' Vamos tentar de novo.');
    setTimeout(() => queuePush(key), 15000);
  }
}
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
      if (event === 'SIGNED_OUT') { auth.user = null; auth.profile = null; auth.pending = 0; paintUser(); return; }
      if (['INITIAL_SESSION', 'SIGNED_IN', 'USER_UPDATED', 'TOKEN_REFRESHED'].includes(event)) {
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
