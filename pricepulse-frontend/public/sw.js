// Simple Service Worker for PWA Installability
const CACHE_NAME = 'pricepulse-matrix-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Simple network-first approach
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
