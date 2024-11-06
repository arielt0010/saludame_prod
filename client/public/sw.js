/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
  '/',
  '/pagos'
];

// Instalar el Service Worker y cachear recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones y servir recursos desde el cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;  // Devuelve el recurso desde el caché
        }
        return fetch(event.request);  // O continúa con la petición si no está en el caché
      })
  );
});

// Actualiza el caché cuando cambia el contenido de la app
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request).then(fetchedResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchedResponse.clone());
              return fetchedResponse;
            });
          });
        }).catch(() => {
            
        })
    );
  });
  
