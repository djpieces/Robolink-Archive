import {
    excludeUrls,
    networkOnlyUrls,
    cacheName,
    assets,
} from "./robolink-sw-assets.js";

const robolinkServiceWorkerVersion = "1.4.0";

const putInCache = async (request, response) => {
    try {
        if (request.method == "GET") {
            const cache = await caches.open(cacheName);
            if (response.status != 206) {
                await cache.put(request, response);
            }
        }
    } catch (error) {
        if (!(error instanceof Error)) {
            error = new Error(error);
        }
        console.log(error.message + ": " + request.url);
    }
};

const cacheFirst = async ({ request, fallbackUrl }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    try {
        const responseFromNetwork = await fetch(request);
        await putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
};

const networkFirst = async ({ request, fallbackUrl }) => {
    try {
        const responseFromNetwork = await fetch(request);
        await putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        const responseFromCache = await caches.match(request);
        if (responseFromCache) {
            return responseFromCache;
        }
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
};

const networkOnly = async ({ request, fallbackUrl }) => {
    try {
        const responseFromNetwork = await fetch(request);
        return responseFromNetwork;
    } catch (error) {
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
};

self.addEventListener("fetch", (event) => {
    if (event.request.method == "POST") {
        return;
    }
    let includeUrl = true;
    excludeUrls.forEach((excludeUrl) => {
        if (event.request.url.includes(excludeUrl)) {
            includeUrl = false;
        }
    });
    if (includeUrl) {
        let cacheControl = true;
        networkOnlyUrls.forEach((networkOnlyUrl) => {
            if (event.request.url.includes(networkOnlyUrl)) {
                cacheControl = false;
            }
        });
        if (cacheControl) {
            let nf = false;
            if (event.request.destination == "document") {
                nf = true;
            }
            if (
                (event.request.url.includes("robolink-pwa.js") || event.request.url.includes("robolink-sw-assets.js"))
                &&
                event.request.destination == "script"
            ) {
                nf = true;
            }
            if (nf) {
                event.respondWith(
                    networkFirst({ request: event.request, fallbackUrl: "/" })
                );
            } else {
                event.respondWith(
                    cacheFirst({ request: event.request, fallbackUrl: "/" })
                );
            }
        } else {
            event.respondWith(
                networkOnly({ request: event.request, fallbackUrl: "/" })
            );
        }
    }
});

self.addEventListener("message", async (event) => {
    const {robolinkInstallCache, robolinkAssets} = event.data
    if (robolinkInstallCache === true) {
        console.log("Start cache saving");
        console.time("cache_download_time");
        const cache = await caches.open(cacheName);
        const assetsToCache = assets[robolinkAssets];
        if (assetsToCache.length > 0) {        
            for (let i = 0; i < assetsToCache.length; i++) {
                try {
                    const assetMatch = await caches.match(assetsToCache[i]);
                    if (!assetMatch) {
                        await cache.add(assetsToCache[i]);                
                    }                
                } catch (error) {
                    
                }
            }
        }
        console.log("End cache save");
        console.timeEnd("cache_download_time");
        event.source.postMessage("robolink-cache-saved");
    }
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== cacheName)
                    .map((key) => caches.delete(key))
            );
        })
    );
});