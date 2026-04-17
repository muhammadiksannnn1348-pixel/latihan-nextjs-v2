const CACHE_NAME = 'next-pwa-cache-v1';
const DYNAMIC_CACHE = 'next-pwa-dynamic-v1';

const urlToCache = [
    '/',
    '/global.css',
    '/manifest.json',
    '/favicon.ico',
    '/icon-192x192.png',  // ✅ konsisten tanpa folder /icons/
    '/icon-512x512.png',
];

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlToCache);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.destination === 'document') {
                        return caches.match('/');
                    }
                });
            })
    );
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notification';
    const options = {
        body: data.body || 'You have a new notification.',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: { url: data.url || '/' },
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Close' },
        ]
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// ✅ Satu handler saja, nama lowercase
self.addEventListener('notificationclick', (event) => {
    console.log('On notification click:', event.notification.tag);
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';  // ✅ fix

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                const client = clientList[0];
                return client.focus().then(() => client.navigate(urlToOpen));
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
            return Promise.resolve();
        })
    );
});

// ✅ Fix: pakai 'sync' bukan 'install'
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    console.log('Syncing data with server...');
}