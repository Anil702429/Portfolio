const CACHE_NAME = "anil-rijal-portfolio-v1";

const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/styles.css",
    "/script.js",
    "/manifest.json",

    // PWA icons
    "/images/icon-192.png",
    "/images/icon-512.png",
    "/images/icon-512-maskable.png",

    // Portfolio profile image
    "/images/profile-photo.jpg"
];

// Install
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName !== CACHE_NAME)
                        .map((cacheName) => caches.delete(cacheName))
                )
            )
            .then(() => self.clients.claim())
    );
});

// Fetch
self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Keep a fresh copy of successful same-origin requests.
                if (
                    response &&
                    response.status === 200 &&
                    new URL(request.url).origin === self.location.origin
                ) {
                    const responseClone = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => {
                return caches.match(request)
                    .then((cachedResponse) => {
                        return cachedResponse || caches.match("/index.html");
                    });
            })
    );
});