const CACHE = "sovetid-cache-v8";

const ASSETS = [
  "./",
  "./index.html",
  "./styles/main.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./sounds/soft_alarm.mp3",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Tid for oppvåkning";
  const body = data.body || "Barn skal vekkes nå";
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "icons/icon-192.png",
      vibrate: [200, 100, 200],
      tag: data.tag || "wake-generic",
      requireInteraction: false,
    })
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches
            .open(CACHE)
            .then((c) => c.put("./index.html", copy))
            .catch(() => {});
          return resp;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  const url = new URL(req.url);
  if (url.pathname.endsWith(".css")) {
    e.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches
            .open(CACHE)
            .then((c) => c.put(req, copy))
            .catch(() => {});
          return resp;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches
            .open(CACHE)
            .then((c) => c.put(req, copy))
            .catch(() => {});
          return resp;
        })
        .catch(() => cached);
    })
  );
});
