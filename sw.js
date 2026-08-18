// O.D.I.N. — Service Worker v1.0
// Unico scopo: ricevere push e mostrare la notifica anche ad app chiusa.
// Nessuna cache, nessun intercept di rete — resta minimale apposta.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = { title: 'O.D.I.N.', body: '' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }
  const title = data.title || 'O.D.I.N.';
  const options = {
    body: data.body || '',
    tag: data.tag || 'odin-reminder',
    icon: undefined,
    badge: undefined,
    requireInteraction: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
