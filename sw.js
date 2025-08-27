const CACHE = 'sovetid-cache-v4';
const ASSETS = [
  './',
  './index.html',
  './styles/main.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './sounds/soft_alarm.mp3'
];



self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached=>{
      return cached || fetch(req).then(resp=>{
        const copy = resp.clone();
        caches.open(CACHE).then(c=>c.put(req, copy));
        return resp;
      }).catch(()=>cached);
    })
  );
});

self.addEventListener('message', (event)=>{
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
