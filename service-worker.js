const CACHE = 'glide-v2';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
