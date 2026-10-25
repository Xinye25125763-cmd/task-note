self.addEventListener('push', event => {
  event.waitUntil(self.registration.showNotification('TaskNote', {
    body: '有一项待办即将到期。',
    data: { url: '/' }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const targetUrl = new URL('/', self.location.origin).href;
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = clients.find(client => {
      try { return new URL(client.url).origin === self.location.origin; }
      catch (_) { return false; }
    });
    if (existing) {
      await existing.focus();
      return;
    }
    await self.clients.openWindow(targetUrl);
  })());
});
