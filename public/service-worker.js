const CACHE_NAME = 'zoyblocks-pwa-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/static/img/icon-192.png',
  '/static/img/icon-512.png',
  '/static/css/style.css',
  '/static/css/components/menu_bar.css',
  '/static/lib/bootstrap/bootstrap.min.css',
  '/static/lib/blockly/blockly.min.js',
  '/static/lib/blockly/python_compressed.js',
  // NOVOS ARQUIVOS PARA O JOGO
  '/zoy_jogos.html',
  '/zoy_jogos.js',
  '/zoy_quiz.html',
  '/zoy_quiz.js'

];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});