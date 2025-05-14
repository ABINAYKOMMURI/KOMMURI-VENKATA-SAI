// sw.js - Service Worker for offline caching
var cacheName = 'emergency-response-v1';
var assetsToCache = [
  '/',
  '/index.html',
  '/ambulance.html',
  '/police.html',
  '/other.html',
  '/profile.html',
  '/login.html',
  '/signup.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/theme.js',
  '/js/auth.js'
];

// Install: cache assets
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(assetsToCache);
        })
    );
});

// Activate: clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cName) {
                    return cName !== cacheName;
                }).map(function(cName) {
                    return caches.delete(cName);
                })
            );
        })
    );
});

// Fetch: respond with cache or network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
