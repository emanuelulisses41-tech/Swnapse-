// ===============================
// NEURAL BREACH - SERVICE WORKER
// versão: v3
// ===============================

const CACHE_NAME = "nb-cache-v3";
const FILES_TO_CACHE = [
  "./",
  "index.html",
  "manifest.json"
];

// INSTALA
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ATIVA (limpa cache antigo)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// FETCH (offline-first seguro)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        return caches.match("index.html");
      });
    })
  );
});
