/* Recebe os avisos (notificações) mesmo com o site fechado.
   Não guarda nada em cache: o site continua sempre atualizado como antes. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data?.text() || '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'HC Instituto', {
    body: d.body || '',
    icon: 'assets/icons/icon-192.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: { url: d.url || './' },
  }));
});

/* tocar no aviso abre o site (ou traz para frente a aba que já estava aberta) */
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const tab = tabs.find((c) => c.url.startsWith(self.registration.scope));
    if (tab) { await tab.focus(); return tab.navigate ? tab.navigate(url).catch(() => {}) : null; }
    return self.clients.openWindow(url);
  })());
});
