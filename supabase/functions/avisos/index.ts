// =========================================================
// HC Instituto Educacional — função "avisos" (Supabase Edge Function)
// Manda o aviso (notificação) para o celular do aluno quando o polo
// confirma, cancela ou remarca um agendamento, e o aviso de teste.
// Não usa bibliotecas de fora: a criptografia dos avisos (Web Push,
// RFC 8291 + VAPID) é feita com o Web Crypto, que já vem no Supabase.
//
// Segredos (Edge Functions > Secrets): VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY,
// VAPID_SUBJECT. SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY o Supabase já dá.
// =========================================================

const env = (k: string) => (globalThis as any).Deno?.env.get(k) || '';
const enc = new TextEncoder();
const subtle = crypto.subtle;

/* ---------- base64url ---------- */
const b64u = (buf: ArrayBuffer | Uint8Array) => {
  let s = ''; new Uint8Array(buf).forEach((b) => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const unb64u = (s: string) => {
  const t = s.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(t + '='.repeat((4 - (t.length % 4)) % 4)), (c) => c.charCodeAt(0));
};
const cat = (...parts: Uint8Array[]) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let i = 0; parts.forEach((p) => { out.set(p, i); i += p.length; });
  return out;
};
async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, len: number) {
  const key = await subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, len * 8));
}

/* ---------- criptografia do conteúdo (aes128gcm, RFC 8291) ---------- */
export async function encryptPayload(p256dh: string, authSecret: string, text: string) {
  const ua = unb64u(p256dh), secret = unb64u(authSecret);
  const uaKey = await subtle.importKey('raw', ua, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const eph = await subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']) as CryptoKeyPair;
  const asPub = new Uint8Array(await subtle.exportKey('raw', eph.publicKey));
  const shared = new Uint8Array(await subtle.deriveBits({ name: 'ECDH', public: uaKey }, eph.privateKey, 256));
  const ikm = await hkdf(secret, shared, cat(enc.encode('WebPush: info\0'), ua, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);
  const key = await subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(enc.encode(text), new Uint8Array([2]))));
  const head = new Uint8Array(16 + 4 + 1 + asPub.length);
  head.set(salt); new DataView(head.buffer).setUint32(16, 4096); head[20] = asPub.length; head.set(asPub, 21);
  return cat(head, ct);
}

/* ---------- assinatura do servidor (VAPID, RFC 8292) ---------- */
export async function vapidAuth(endpoint: string, pub: string, priv: string, subject: string) {
  const p = unb64u(pub);
  const key = await subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', x: b64u(p.slice(1, 33)), y: b64u(p.slice(33, 65)), d: priv, ext: true },
    { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const body = b64u(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: subject })));
  const sig = await subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(`${head}.${body}`));
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${pub}`;
}

async function sendPush(sub: { endpoint: string; p256dh: string; auth: string }, msg: object) {
  const body = await encryptPayload(sub.p256dh, sub.auth, JSON.stringify(msg));
  const r = await fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      Authorization: await vapidAuth(sub.endpoint, env('VAPID_PUBLIC_KEY'), env('VAPID_PRIVATE_KEY'), env('VAPID_SUBJECT') || 'https://hceducacional.app.br'),
      'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '86400', Urgency: 'high',
    },
    body,
  });
  return r.status;
}

/* ---------- banco (REST do Supabase com a chave secreta) ---------- */
// chave secreta: a nova (sb_secret_..., em SUPABASE_SECRET_KEYS) ou a antiga (service_role)
function secretKey() {
  try { const k = JSON.parse(env('SUPABASE_SECRET_KEYS') || '{}'); const v = k.default || Object.values(k)[0]; if (v) return String(v); } catch { /* segue para a antiga */ }
  return env('SUPABASE_SERVICE_ROLE_KEY');
}
const db = (path: string, init: RequestInit = {}) => fetch(`${env('SUPABASE_URL')}${path}`, {
  ...init,
  headers: { apikey: secretKey(), Authorization: `Bearer ${secretKey()}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
});
const rows = async (path: string) => { const r = await db(path); if (!r.ok) throw new Error(`banco: ${r.status} ${await r.text()}`); return r.json(); };

/* ---------- textos dos avisos ---------- */
const KIND: Record<string, string> = { prova: 'prova presencial', tutoria: 'tutoria presencial' };
const SHIFT: Record<string, string> = { manha: 'manhã, às 08h30', tarde: 'tarde, às 14h30' };
const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
function quando(a: any) {
  const [y, m, d] = a.date.split('-').map(Number);
  return `${WD[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}, ${SHIFT[a.shift]}`;
}
function message(tipo: string, a: any) {
  const k = KIND[a.kind] || 'agendamento', base = { tag: `ag-${a.id}`, url: './#agendar' };
  if (tipo === 'confirmado') return { ...base, title: 'Agendamento confirmado ✅', body: `Sua ${k} de ${quando(a)} está confirmada. Te esperamos no polo!` };
  if (tipo === 'cancelado') return { ...base, title: 'Agendamento cancelado', body: `Sua ${k} de ${quando(a)} foi cancelada. Se precisar, agende de novo pelo site.` };
  if (tipo === 'remarcado') return { ...base, title: 'Agendamento remarcado 📅', body: `Sua ${k} mudou para ${quando(a)}.` };
  return null;
}

/* ---------- a função ---------- */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (data: object, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

async function handle(req: Request) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return reply({ erro: 'Use POST.' }, 405);
  if (!env('VAPID_PRIVATE_KEY')) return reply({ erro: 'Faltam os segredos VAPID na função.' }, 500);

  // quem chamou: precisa estar logado no site
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const who = await db('/auth/v1/user', { headers: { Authorization: `Bearer ${token}` } });
  if (!who.ok) return reply({ erro: 'Entre na sua conta.' }, 401);
  const user = await who.json();
  const body = await req.json().catch(() => ({}));

  let targetUser: string, msg: any;
  if (body.teste) {
    // aviso de teste: só para os aparelhos de quem pediu
    targetUser = user.id;
    msg = { title: 'Avisos ativados 🔔', body: 'Tudo certo! Os avisos do HC Instituto vão chegar aqui.', tag: 'teste', url: './#perfil' };
  } else {
    // avisos de agendamento: só administradores mandam
    const [me] = await rows(`/rest/v1/profiles?id=eq.${user.id}&select=role,status`);
    if (!(me?.role === 'admin' && me?.status === 'approved')) return reply({ erro: 'Só administradores.' }, 403);
    if (!/^[0-9a-f-]{36}$/i.test(String(body.id || ''))) return reply({ erro: 'Agendamento inválido.' }, 400);
    const [a] = await rows(`/rest/v1/appointments?id=eq.${body.id}&select=*`);
    if (!a) return reply({ erro: 'Agendamento não encontrado.' }, 404);
    const tipo = String(body.tipo || '');
    // o aviso tem que bater com o que está no banco
    if ((tipo === 'confirmado' || tipo === 'cancelado') && a.status !== tipo) return reply({ erro: 'O status mudou.' }, 409);
    if (tipo === 'remarcado' && a.status === 'cancelado') return reply({ erro: 'Agendamento cancelado.' }, 409);
    msg = message(tipo, a);
    if (!msg) return reply({ erro: 'Tipo de aviso inválido.' }, 400);
    if (!a.user_id) return reply({ enviados: 0, aparelhos: 0, conta: false });
    targetUser = a.user_id;
  }

  const subs = await rows(`/rest/v1/push_subscriptions?user_id=eq.${targetUser}&select=endpoint,p256dh,auth`);
  let enviados = 0;
  await Promise.all(subs.map(async (s: any) => {
    try {
      const st = await sendPush(s, msg);
      if (st >= 200 && st < 300) enviados++;
      else if (st === 404 || st === 410) await db(`/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(s.endpoint)}`, { method: 'DELETE' }); // aparelho desativou
      else console.warn('aviso recusado', st, new URL(s.endpoint).host);
    } catch (e) { console.warn('falha ao enviar', String(e)); }
  }));
  return reply({ enviados, aparelhos: subs.length, conta: true });
}

(globalThis as any).Deno?.serve((req: Request) => handle(req).catch((e) => reply({ erro: String(e?.message || e) }, 500)));
