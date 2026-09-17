// public/sw.js - Service Worker com Cache Resiliente e Network-First para SoundWorld Kids
const CACHE_NAME = 'soundworld-v8-live';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/favicon.svg',
  '/manifest.json',
  '/js/catalog.js',
  '/js/app.js',
  '/js/i18n.js',
  '/js/audio-engine.js',
  '/js/speech-engine.js',
  '/js/particles.js',
  '/js/pix.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Nunca intercepta chamadas à API externa ou do servidor
  if (url.pathname.startsWith('/api/') || url.hostname.includes('kiwify') || url.hostname.includes('qrserver')) {
    return;
  }

  // Network-First para garantir sempre o código mais atualizado quando online
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
