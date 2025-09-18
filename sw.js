const CACHE = "sovetid-cache-v10";

const ASSETS = [
  "./",
  "./index.html",
  "./styles/main.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./sounds/soft_alarm.mp3"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("push", (e) => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || "Tid for oppvåkning";
  const body = data.body || "Barn skal vekkes nå";
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "icons/icon-192.png",
      vibrate: [200, 100, 200],
      tag: data.tag || "wake-generic",
      requireInteraction: false
    })
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type === "basic") {
            caches.open(CACHE).then((c) => c.put("./index.html", resp.clone())).catch(() => {});
          }
          return resp;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  if (req.destination === "style" || new URL(req.url).pathname.endsWith(".css")) {
    e.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.status === 200 && (resp.type === "basic" || resp.type === "cors")) {
            caches.open(CACHE).then((c) => c.put(req, resp.clone())).catch(() => {});
          }
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
          if (resp && resp.status === 200 && (resp.type === "basic" || resp.type === "cors")) {
            caches.open(CACHE).then((c) => c.put(req, resp.clone())).catch(() => {});
          }
          return resp;
        })
        .catch(() => cached);
    })
  );
});
