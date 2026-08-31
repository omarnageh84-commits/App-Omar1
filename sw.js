const CACHE='app-omar-v16-clear';
const ASSETS=[
  './',
  './index.html',
  './home.html',
  './manifest.json',
  './icon_192.png',
  './icon_512.png',
  './themes.js',
  './drive-sync.js'
];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
   .then(()=>caches.open(CACHE).then(c=>c.addAll(ASSETS)))
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(url.includes('script.google.com')||url.includes('script.googleusercontent.com')||url.includes('googleapis.com')||url.includes('drive.google.com')||url.includes('/fonts/')){
    return;
  }
  e.respondWith(
    fetch(e.request).then(res=>{
      if(e.request.method==='GET'&&res.status===200&&e.request.url.startsWith(self.location.origin)){
        caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
      }
      return res;
    }).catch(()=>caches.match(e.request))
  );
});
