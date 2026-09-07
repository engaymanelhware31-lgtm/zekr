const CACHE_NAME = "zekr-v5";

const FILES_TO_CACHE = [

    "/zekr/",

    "/zekr/index.html",

    "/zekr/manifest.json",

    "/zekr/icon-192.png",

    "/zekr/icon-512.png",

    "/zekr/background.png"

];


self.addEventListener(
    "install",
    event => {

        self.skipWaiting();

        event.waitUntil(

            caches.open(CACHE_NAME)

                .then(cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                })

        );

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()

                .then(cacheNames => {

                    return Promise.all(

                        cacheNames.map(
                            cacheName => {

                                if (
                                    cacheName !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        cacheName
                                    );

                                }

                            }
                        )

                    );

                })

                .then(() => {

                    return self.clients.claim();

                })

        );

    }
);


self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            fetch(event.request)

                .then(response => {

                    const copy =
                        response.clone();


                    caches.open(CACHE_NAME)

                        .then(cache => {

                            cache.put(
                                event.request,
                                copy
                            );

                        });


                    return response;

                })

                .catch(() => {

                    return caches.match(
                        event.request
                    );

                })

        );

    }
);
