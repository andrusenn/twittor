// Utils
importScripts("js/sw-utils.js");
//
const STATIC_CACHE = "static-v3";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHELL = [
    // "/",
    "index.html",
    "css/style.css",
    "img/favicon.ico",
    "img/avatars/hulk.jpg",
    "img/avatars/ironman.jpg",
    "img/avatars/spiderman.jpg",
    "img/avatars/thor.jpg",
    "img/avatars/wolverine.jpg",
    "js/app.js",
    "js/sw-utils.js",
];
const APP_SHELL_INMUTABLE = [
    "https://fonts.googleapis.com/css?family=Quicksand:300,400",
    "https://fonts.googleapis.com/css?family=Lato:400,300",
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "css/animate.css",
    "js/libs/jquery.js",
];
self.addEventListener("install", (e) => {
    const install = Promise.all([
        // Static
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(APP_SHELL);
        }),
        // Inmutable
        caches.open(INMUTABLE_CACHE).then((cache) => {
            return cache.addAll(APP_SHELL_INMUTABLE);
        }),
    ]);
    e.waitUntil(install);
});

self.addEventListener("activate", (e) => {
    const activate = caches.keys().then((keys) => {
        keys.forEach((key) => {
            // Limpiar cache static
            if (key !== STATIC_CACHE && key.includes("static")) {
                return caches.delete(key);
            }
            // Limpiar cache inmutable
            if (key !== INMUTABLE_CACHE && key.includes("inmutable")) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(activate);
});

self.addEventListener("fetch", (e) => {
    // Buscar en cache y luego en la red
    const response = caches.match(e.request).then((res) => {
        if (res) {
            return res;
        } else {
            return fetch(e.request).then((newRes) => {
                return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
            });
        }
    });
    e.respondWith(response);
});
