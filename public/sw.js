// Название "кладовки" (кеша)
const CACHE_NAME = 'lorem-v1';

// Файлы, которые сохраняем сразу при установке
const FILES = [
  '/',
  '/about',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Событие install: кладём все файлы в кеш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
});

// Событие fetch: на каждый запрос — сначала сеть, если нет сети — кеш
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Сеть ответила — сохраняем свежую копию в кеш
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request)) // сети нет — берём из кеша
  );
});
