const CACHE_NAME = 'file-component-cache';
const DATA_CACHE_NAME = 'data-transaction-cache';

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/js/db.js",
  "/js/index.js",
  "/manifest.webmanifest",
  "/css/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/service-worker.js"

];
//INSTALL ACTIVATE FETCH CYCLES
self.addEventListener(`install`, 
                      (evt) => {
  evt.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});


//ACT
self.addEventListener(`activate`,
                      (evt) => {
  const currentCaches = [CACHE_NAME,DATA_CACHE_NAME];
  evt.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

//FETCH
self.addEventListener(`fetch`,
                      (evt) => {
  if (evt.request.method !== `GET` || !evt.request.url.startsWith(self.location.origin)) {
    evt.respondWith(fetch(evt.request));
    return;
  }

  if (evt.request.url.includes(`/api/transaction`)) {
    evt.respondWith(caches.open(DATA_CACHE_NAME)
      .then(cache => fetch(evt.request)
        .then(response => {cache.put(evt.request, response.clone());
          return response;
        })
        .catch(() => caches.match(evt.request))
      )
    );
    return;
  }

  evt.respondWith(caches.match(evt.request)
    .then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return caches
      .open(DATA_CACHE_NAME)
      .then(cache => fetch(evt.request)
      .then(response => cache.put(evt.request, response.clone())
        .then(() => response)
      ));
  }));
});

