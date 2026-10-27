// Service Worker for The FreeLance Web Push Notifications
self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'The FreeLance', body: event.data.text() };
    }
  }

  const title = data.title || 'The FreeLance ताज़ा समाचार';
  const options = {
    body: data.body || 'ताज़ा खबर यहाँ पढ़ें',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/icon.png',
    image: data.image || undefined,
    tag: data.tag || 'tfl-news',
    data: {
      url: data.url || 'https://thefreelance.in',
    },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || 'https://thefreelance.in';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
