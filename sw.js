const CACHE='app-omar-v18';
const ASSETS=['./','./index.html?v=14','./home.html?v=14','./daily.html?v=14','./attendance.html?v=14','./tasks.html?v=14','./themes.js?v=14','./drive-sync.js?v=14','./manifest.json?v=14','./icon_192.png?v=14','./icon_512.png?v=14'];

self.addEventListener('install',e=>{
  console.log('Installing v17 - clearing old caches');
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    }).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const url = e.request.url;
  if(url.includes('script.google.com') || url.includes('script.googleusercontent.com') || url.includes('googleapis.com') || url.includes('drive.google.com')){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r=>{
      if(r) return r;
      return fetch(e.request).then(res=>{
        if(e.request.method === 'GET' && res.status === 200 && e.request.url.startsWith(self.location.origin)){
          let clone = res.clone();
          caches.open(CACHE).then(c=>c.put(e.request, clone));
        }
        return res;
      }).catch(()=>r);
    })
  );
});
