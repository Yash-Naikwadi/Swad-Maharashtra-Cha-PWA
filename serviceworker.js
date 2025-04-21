const CACHE_NAME = "swad-maha-cache-v1";
const FILES_TO_CACHE = [
  "/Swad-Maharashtra-Cha-PWA/index.html",
  "/Swad-Maharashtra-Cha-PWA/",
  "/Swad-Maharashtra-Cha-PWA/style.css",
  "/Swad-Maharashtra-Cha-PWA/script.js",
  "/Swad-Maharashtra-Cha-PWA/serviceworker.js",
  "/Swad-Maharashtra-Cha-PWA/manifest.json",
  "/Swad-Maharashtra-Cha-PWA/images/maharashtra-feast.webp",
  "/Swad-Maharashtra-Cha-PWA/images/cart.svg",
  "/Swad-Maharashtra-Cha-PWA/images/goda-masala.webp",
  "/Swad-Maharashtra-Cha-PWA/images/malvani-masala.webp",
  "/Swad-Maharashtra-Cha-PWA/images/kanda-lasun.webp",
  "/Swad-Maharashtra-Cha-PWA/images/puran-poli.webp",
  "/Swad-Maharashtra-Cha-PWA/images/modak.webp",
  "/Swad-Maharashtra-Cha-PWA/images/shrikhand.webp",
  "/Swad-Maharashtra-Cha-PWA/images/bhakarwadi.webp",
  "/Swad-Maharashtra-Cha-PWA/images/chivda.webp",
  "/Swad-Maharashtra-Cha-PWA/images/chakli.webp",
  "/Swad-Maharashtra-Cha-PWA/images/border-pattern.webp",
  "/Swad-Maharashtra-Cha-PWA/images/maharashtra-pattern.webp",
  "/Swad-Maharashtra-Cha-PWA/images/paithani-pattern.webp",
  "/Swad-Maharashtra-Cha-PWA/icons/icon-192x192.png",
  "/Swad-Maharashtra-Cha-PWA/icons/icon-512x512.png",
  "/Swad-Maharashtra-Cha-PWA/offline.html"
];

// Install Event
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching files");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Enhanced Fetch Event
self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetch", event.request.url);
  const requestURL = new URL(event.request.url);

  // If request is same-origin, use Cache First
  if (requestURL.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).catch(() => caches.match("offline.html"))
        );
      })
    );
  } else {
    // Else, use Network First
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((res) => {
            return res || caches.match("offline.html");
          })
        )
    );
  }
});

// Sync Event (simulation)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(
      (async () => {
        console.log("Sync event triggered: 'sync-data'");
        // Here you can sync data with server when online
      })()
    );
  }
});

// Push Event
self.addEventListener("push", function (event) {
  if (event && event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        method: "pushMessage",
        message: event.data.text(),
      };
    }

    if (data.method === "pushMessage") {
      console.log("Push notification received");

      // ✅ Check permission before showing notification
      if (Notification.permission === "granted") {
        event.waitUntil(
          self.registration.showNotification("Swad Maharashtra Cha", {
            body: data.message,
          })
        );
      } else {
        console.warn("🚫 Cannot show notification: permission not granted.");
      }
    }
  }
});

