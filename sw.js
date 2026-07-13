const CACHE_NAME = 'sala-chef-amadeo-v1';
const ASSETS = [
  'sala.html',
  'manifest.json'
];

// Instalar el Service Worker y guardar en caché la interfaz de la sala
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estrategia: Network First (Ir a internet para tener los datos reales de Google Sheets, si falla usa la caché)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
