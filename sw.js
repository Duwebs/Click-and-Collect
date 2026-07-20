const CACHE_NAME = 'click-collect-v4';

// 1. Sirf wahi main files jo app ko start karne ke liye zaroori hain (Pre-cache)
const PRE_CACHE_ASSETS = [
  '/',
  '/index.html',
  '/avatar.html',
  '/capture.html',
  '/click-hub.html',
  '/create.html',
  '/credit.html',
  '/dashboard.html',
  '/join.html',
  '/preview-editor.html',
  '/timeline.html',
  '/style.css',
  '/script.js'
];

// Install Event: Sirf core files ko pre-cache karega
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pre-caching core files...');
      return cache.addAll(PRE_CACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Purane cache ko delete karega
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: ⚡ DYNAMIC CACHING (Asli Magic Yahan Hai!)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // A. Agar file pehle se cache mein hai, toh turant wahi se de do (Fast load)
      if (cachedResponse) {
        return cachedResponse;
      }

      // B. Agar cache mein nahi hai, toh network (internet) se fetch karo
      return fetch(event.request).then((networkResponse) => {
        
        // POST requests ya invalid responses ko cache nahi karna hai
        if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
          return networkResponse;
        }

        // Bahar ki dynamic files (jaise assets/ images/ icons) ko auto-cache karna
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
          console.log('📥 Automatically Cached:', event.request.url);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback (agar internet bhi nahi hai aur file cache mein bhi nahi thi)
      });
    })
  );
});
