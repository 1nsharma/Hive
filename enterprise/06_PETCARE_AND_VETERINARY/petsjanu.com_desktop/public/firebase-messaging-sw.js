// Firebase Cloud Messaging (FCM) Web Push Service Worker for PetJanu
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForPetJanuPWAWebPush2026",
  authDomain: "petjanu-app.firebaseapp.com",
  projectId: "petjanu-app",
  storageBucket: "petjanu-app.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:abcdef1234567890"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

// Handle background notification pushes when app tab is closed
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] Received background notification:', payload);

  const title = payload.notification?.title || '🚨 Lost Pet SOS Alert | PetJanu';
  const options = {
    body: payload.notification?.body || 'A pet tag was scanned nearby. Check location updates immediately.',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'lost-pet-sos',
    data: payload.data || { url: '/' },
    vibrate: [200, 100, 200, 100, 200],
    actions: [
      { action: 'open', title: '🐾 View Location' },
      { action: 'dismiss', title: 'Close' }
    ]
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
