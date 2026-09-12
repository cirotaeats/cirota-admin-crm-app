/**
 * Cirota Admin — Service Worker
 * App shell offline caching
 */

const CACHE_NAME = 'cirota-admin-app-shell-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles/tokens.css',
  '/src/styles/base.css',
  '/src/styles/components.css',
  '/src/js/app.js',
  '/src/js/config.js',
  '/src/js/api.js',
  '/src/js/auth.js',
  '/src/js/router.js',
  '/src/js/admin/dashboard.js',
  '/src/js/admin/customers.js',
  '/src/js/admin/daily-sheet.js',
  '/src/js/admin/kitchen.js',
  '/src/js/admin/dues.js',
  '/src/js/admin/crm-new-order.js',
  '/src/js/admin/attendance-register.js',
  '/src/js/admin/live-map.js',
  '/src/js/mocks/mock-data.js',
  '/src/js/mocks/mock-delay.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(err => console.warn('Some assets could not be pre-cached:', err))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      });
    }).catch(() => {
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return caches.match('/index.html');
      }
    })
  );
});
