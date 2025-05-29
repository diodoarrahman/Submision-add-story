importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('Workbox berhasil dimuat');
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();
} else {
  console.log('Workbox gagal dimuat');
}

workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  // { url: '/styles/styles.css', revision: '1' },
  // { url: '/scripts/app.js', revision: '1' },
  // { url: '/images/logo.png', revision: '1' },
]);

workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts',
  })
);

workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev',
  new workbox.strategies.NetworkFirst({
    cacheName: 'story-api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

workbox.routing.setCatchHandler(async ({ event }) => {
  return Response.error();
});

self.addEventListener('push', function (event) {
  let notificationData = {
    title: 'Dicoding Story',
    options: {
      body: 'Ada notifikasi baru!',
      icon: '/images/logo.png',
    },
  };

  if (event.data) {
    notificationData = event.data.json();
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData.options)
  );
});
