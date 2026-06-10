importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBcmCYrNEoi-M8USYwpwuVrMkkUgLi1hDE",
  authDomain: "misk-inset-2026.firebaseapp.com",
  projectId: "misk-inset-2026",
  storageBucket: "misk-inset-2026.firebasestorage.app",
  messagingSenderId: "526853379368",
  appId: "1:526853379368:web:55e70b1c2f4866c8582c1d"
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "Misk INSET 2026", {
    body: body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "misk-inset",
    renotify: true,
    vibrate: [200, 100, 200],
  });
});
