(function( $ ) {
    'use strict';

    const registerServiceWorker = async () => {
        if ("serviceWorker" in navigator) {
                                
            const registration = await navigator.serviceWorker.register(
                robolink_ajax.site_url + '../../../../../../robolink-sw.js', {
                    scope: "/",
                    type: "module",
                }
            );
            if (registration.installing) {
                console.log("Robolink service worker installing");
            } else if (registration.waiting) {
                console.log("Robolink service worker installed");
            } else if (registration.active) {
                console.log("Robolink service worker active");                
            }

            // TODO: in case we have to unregister the sw
            // navigator.serviceWorker.getRegistrations().then(function(registrations) {
            //     for (let registration of registrations) {
            //         const unregister = registration.unregister();
            //         if (unregister) {
            //             console.log("Robolink service worker unregistered");
            //         }
            //     } 
            // });
        
            navigator.serviceWorker.ready.then((registration) => {                
                if (robolinkPwa.installCache === 'true') {
                    registration.active.postMessage( { "robolinkInstallCache" : true, "robolinkAssets" : robolinkPwa.assets } );
                    // show spinner for loading
                    // $('#robolink-installing-cache').show();
                }
            });     

            navigator.serviceWorker.addEventListener("message", (event) => {
                if (event.data === 'robolink-cache-saved') {
                    // hide spinner for loading
                    // $('#robolink-installing-cache').hide();                                          
                }
            });
        } else {
            console.error(`The current browser doesn't support service workers.`);
        }
    };

    registerServiceWorker();

})( jQuery );