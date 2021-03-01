function limitCacheSize(cacheName, limit) {
    caches.open(cacheName).then((cache) => {
        return cache.keys().then((keys) => {
            if (keys.limit > limit) {
                caches.delete(keys[0]).then(limitCacheSize(cacheName, limit));
            }
        });
    });
}
function updateDynamicCache(dyn_name, req, res) {
    if (res.ok) {
        return caches.open(dyn_name).then((cache) => {
            cache.put(req, res.clone());
            return res.clone();
        });
    } else {
        // Fallo / no se encuantra
        return res;
    }
}
