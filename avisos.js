/* =========================================================
   AVISOS NO CELULAR (notificações)
   O aluno ativa uma vez (Meu perfil ou depois de agendar) e passa a receber
   no celular quando o polo confirma, cancela ou remarca o agendamento.
   Android: funciona pelo navegador, mesmo sem instalar.
   iPhone: só com o site instalado na tela de início (regra da Apple).
   O envio é feito pela função "avisos" do Supabase (supabase/functions/avisos).
   ========================================================= */
const PUSH_PUBLIC_KEY = 'BBIEqPLwDMGU27kEYI4a2uW_FjPDW6JFssKa1fDvdeqE3Mo1TizRyis636D5fE8qsryZVubFv3Y6-CnVYoUCMaE';

const pushSupported = () => window.isSecureContext && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const pushKeyBytes = () => { const t = PUSH_PUBLIC_KEY.replace(/-/g, '+').replace(/_/g, '/'); return Uint8Array.from(atob(t + '='.repeat((4 - (t.length % 4)) % 4)), (c) => c.charCodeAt(0)); };
const pushDevice = () => {
  const u = navigator.userAgent;
  const os = /iPhone/.test(u) ? 'iPhone' : /iPad/.test(u) ? 'iPad' : /Android/.test(u) ? 'Android' : /Windows/.test(u) ? 'Windows' : /Mac/.test(u) ? 'Mac' : /Linux/.test(u) ? 'Linux' : 'Aparelho';
  return `${os}${isStandalone() ? ' (app)' : ''}`;
};

/* o "service worker" é quem recebe o aviso com o site fechado */
let swReg = null;
function swReady() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return Promise.resolve(null);
  return (swReg ||= navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).catch((e) => { console.warn('Avisos:', e); swReg = null; return null; }));
}
if ('serviceWorker' in navigator) window.addEventListener('load', () => swReady());

async function pushSub() { const r = pushSupported() ? await swReady() : null; return r ? r.pushManager.getSubscription() : null; }

/* situação neste aparelho: 'on', 'off', 'denied' (bloqueado), 'ios-install' (iPhone sem instalar) ou 'unsupported' */
async function pushState() {
  if (!pushSupported()) return isIOS() && !isStandalone() ? 'ios-install' : 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.permission === 'granted' && (await pushSub()) ? 'on' : 'off';
}

async function pushEnable() {
  if (!auth.user) { openAuth('login'); return false; }
  if (!pushSupported()) { if (isIOS() && !isStandalone()) pushHowTo(); else toast('Este navegador não recebe avisos. No Android, use o Chrome.'); return false; }
  if (Notification.permission === 'denied') { pushBlockedHelp(); return false; }
  // o pedido de permissão vem primeiro, direto do toque (o iPhone exige isso)
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { if (perm === 'denied') pushBlockedHelp(); return false; }
  try {
    const reg = await swReady(); if (!reg) throw new Error('Não foi possível preparar os avisos.');
    let sub = await reg.pushManager.getSubscription();
    if (sub && sub.options?.applicationServerKey && b64(sub.options.applicationServerKey) !== b64(pushKeyBytes())) { await sub.unsubscribe(); sub = null; }
    sub ||= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: pushKeyBytes() });
    const j = sub.toJSON();
    const { error } = await sb.rpc('save_push_subscription', { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth, p_device: pushDevice() });
    if (error) throw error;
    toast('Avisos ativados neste aparelho.');
    return true;
  } catch (e) {
    toast(/save_push_subscription|schema cache/i.test(e?.message || '') ? 'Falta ativar os avisos no banco (script 13-avisos.sql).' : authError(e));
    return false;
  }
}
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

/* desliga neste aparelho (também ao sair da conta, para o próximo da fila não receber os avisos de outro) */
async function pushDisable(quiet) {
  const sub = await pushSub().catch(() => null); if (!sub) return;
  if (auth.user) await sb.rpc('remove_push_subscription', { p_endpoint: sub.endpoint }).catch(() => {});
  await sub.unsubscribe().catch(() => {});
  if (!quiet) toast('Avisos desativados neste aparelho.');
}

/* aviso de teste: chega só nos aparelhos de quem pediu */
async function pushTest() {
  const { data, error } = await sb.functions.invoke('avisos', { body: { teste: true } });
  if (error) {
    const msg = await error.context?.json?.().then((j) => j?.erro).catch(() => null);
    return toast(msg ? `Não foi possível enviar o teste: ${msg}` : 'A função de avisos ainda não está no ar no Supabase.');
  }
  toast(data?.enviados ? 'Aviso de teste enviado. Deve chegar em instantes.' : 'Nenhum aparelho recebeu. Desative e ative de novo.');
}

/* o polo confirmou/cancelou/remarcou: avisa o aluno (só administradores conseguem) */
async function pushNotifyAppointment(id, tipo) {
  try {
    const { data, error } = await sb.functions.invoke('avisos', { body: { id, tipo } });
    if (error) { console.warn('Avisos:', error.message); return null; }
    return data; // { enviados, aparelhos, conta }
  } catch (e) { console.warn('Avisos:', e); return null; }
}

function pushHowTo() {
  openAuth('info', {
    title: 'Instale o site no iPhone', icon: 'smartphone', tone: 'ok',
    text: `<span class="pc-steps">
      <span><b>1</b><span>Abra o site no <strong>Safari</strong>.</span></span>
      <span><b>2</b><span>Toque em <strong>Compartilhar</strong> <i class="pc-share" aria-hidden="true"></i> na barra de baixo.</span></span>
      <span><b>3</b><span>Escolha <strong>Adicionar à Tela de Início</strong> e toque em <strong>Adicionar</strong>.</span></span>
      <span><b>4</b><span>Abra o <strong>HC Instituto</strong> pelo ícone novo, entre na conta e ative os avisos em <strong>Meu perfil</strong>.</span></span>
    </span>`,
  });
}
function pushBlockedHelp() {
  openAuth('info', {
    title: 'Avisos bloqueados', icon: 'bell', tone: 'warn',
    text: isIOS()
      ? 'Abra os <strong>Ajustes</strong> do iPhone › <strong>Notificações</strong> › <strong>HC Instituto</strong> e ative <strong>Permitir Notificações</strong>. Depois volte aqui e toque em Ativar avisos.'
      : 'Toque no cadeado ao lado do endereço do site › <strong>Permissões</strong> (ou Configurações do site) › <strong>Notificações</strong> › <strong>Permitir</strong>. Depois volte aqui e toque em Ativar avisos.',
  });
}

/* cartão "Avisos no celular" (Meu perfil e tela de agendamento concluído) */
const PC_TXT = {
  on: ['Avisos ativados', 'Você recebe neste aparelho quando o polo confirmar, cancelar ou remarcar o seu agendamento.'],
  off: ['Receba avisos no celular', 'Saiba na hora quando o polo confirmar o seu agendamento, mesmo com o site fechado.'],
  'ios-install': ['Avisos no iPhone', 'No iPhone, os avisos só chegam com o site instalado na tela de início. Leva 10 segundos.'],
  denied: ['Avisos bloqueados', 'Os avisos do site estão bloqueados neste navegador. Dá para liberar nas configurações.'],
  unsupported: ['Avisos indisponíveis', 'Este navegador não recebe avisos. No Android, use o Chrome; no iPhone, instale o site pelo Safari.'],
  login: ['Receba avisos no celular', 'Entre na sua conta para receber no celular quando o polo confirmar o seu agendamento.'],
};
async function paintPushCard(el, { compact } = {}) {
  if (!el) return;
  const st = auth.user ? await pushState() : 'login';
  const [t, s] = PC_TXT[st];
  const btn = {
    on: `<button class="btn-soft" type="button" data-pc="test"><i data-icon="bell"></i>Enviar teste</button><button class="btn-soft" type="button" data-pc="off">Desativar</button>`,
    off: `<button class="btn-dark" type="button" data-pc="on"><i data-icon="bell"></i>Ativar avisos</button>`,
    'ios-install': `<button class="btn-dark" type="button" data-pc="howto"><i data-icon="smartphone"></i>Como instalar</button>`,
    denied: `<button class="btn-soft" type="button" data-pc="blocked">Como liberar</button>`,
    unsupported: '',
    login: `<button class="btn-dark" type="button" data-auth="login"><i data-icon="user"></i>Entrar</button>`,
  }[st];
  el.innerHTML = `<div class="pc s-${st} ${compact ? 'compact' : ''}">
    <span class="pc-ico"><i data-icon="bell"></i>${st === 'on' ? '<b class="pc-dot"></b>' : ''}</span>
    <span class="pc-txt"><strong>${t}</strong><span>${s}</span></span>
    ${btn ? `<span class="pc-btns">${btn}</span>` : ''}
  </div>`;
  paintIcons(el);
  el.onclick = async (e) => {
    const b = e.target.closest('[data-pc]'); if (!b) return;
    const act = b.dataset.pc;
    if (act === 'howto') return pushHowTo();
    if (act === 'blocked') return pushBlockedHelp();
    b.disabled = true;
    if (act === 'on' && await pushEnable()) pushTest();
    if (act === 'off') await pushDisable();
    if (act === 'test') await pushTest();
    b.disabled = false;
    paintPushCard(el, { compact });
  };
}
