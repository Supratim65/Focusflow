const CACHE_NAME = 'focusflow-v2';

const ASSETS = [
  '/Focusflow/',
  '/Focusflow/index.html',
  '/Focusflow/manifest.json',
  '/Focusflow/focusflow_db.json',
  '/Focusflow/sw.js',
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // activate immediately
});

// Activate: clean up old caches and take control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => clients.claim()) // take control of all open tabs immediately
  );
});

// Fetch: serve from cache first, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
