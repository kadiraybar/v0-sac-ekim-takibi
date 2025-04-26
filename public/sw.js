const CACHE_NAME = "sac-ekim-takibi-v1"
const urlsToCache = ["/", "/appointments/new", "/prp-report", "/offline.html", "/manifest.json", "/favicon.ico"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  // API isteklerini önbelleğe almıyoruz, sadece ağ üzerinden yapıyoruz
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: "You are offline" }), {
          headers: { "Content-Type": "application/json" },
          status: 503,
        })
      }),
    )
    return
  }

  // Diğer istekler için önce ağa bakıyoruz, sonra önbelleğe
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Başarılı yanıtı önbelleğe alıyoruz
        if (event.request.method === "GET") {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Ağ başarısız olursa önbellekten yanıt veriyoruz
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }

          // Eğer önbellekte yoksa ve HTML isteği ise offline sayfasına yönlendiriyoruz
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html")
          }

          return new Response("Offline and not cached", { status: 503 })
        })
      }),
  )
})

// Push bildirimlerini dinliyoruz
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.message,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Bildirime tıklandığında
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(clients.openWindow(event.notification.data.url))
})
