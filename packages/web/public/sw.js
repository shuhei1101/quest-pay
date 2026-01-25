// Service Worker for PWA
// プッシュイベントのリスナー
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || "/icon512_rounded.png",
      badge: "/icon512_maskable.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// 通知クリック時のリスナー
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.")
  event.notification.close()
  event.waitUntil(clients.openWindow("/home"))
})

// Service Workerのインストール時
self.addEventListener("install", function (event) {
  console.log("Service Worker installed")
  self.skipWaiting()
})

// Service Workerのアクティベート時
self.addEventListener("activate", function (event) {
  console.log("Service Worker activated")
  event.waitUntil(clients.claim())
})

// フェッチイベントのリスナー（キャッシュ戦略）
self.addEventListener("fetch", function (event) {
  // ナビゲーションリクエスト以外はデフォルト動作
  if (event.request.mode !== "navigate") {
    return
  }
  
  // ナビゲーションリクエストはネットワーク優先
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request)
    })
  )
})
