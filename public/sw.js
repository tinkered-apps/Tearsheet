"use strict";

// Caches the app shell only. Form data, photos and map tiles are never stored.
// The name carries APP_VERSION from app.js; npm test checks they match.
const CACHE = "tearsheet-v1.01";
const SHELL = [
  "./",
  "privacy",
  "privacy.js",
  "styles.css",
  "theme-init.js",
  "app.js",
  "favicon.svg",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "vendor/leaflet.css",
  "vendor/leaflet.js",
  "vendor/qrcode.js",
  "vendor/html2canvas.min.js",
  "vendor/pdf-lib.min.js",
  "vendor/fonts/fonts.css",
  "vendor/fonts/inter-latin-400.woff2",
  "vendor/fonts/inter-latin-ext-400.woff2",
  "vendor/fonts/sora-latin-600.woff2",
  "vendor/fonts/sora-latin-ext-600.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Network first, so edits show up immediately; the cache is the offline fallback.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const hit = await caches.match(request, { ignoreSearch: true });
        if (hit || request.mode !== "navigate") return hit;
        // The host redirects /index.html to / and /privacy.html to /privacy, and only the final URL is cached.
        const path = new URL(request.url).pathname.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
        return caches.match(path, { ignoreSearch: true });
      })
  );
});
