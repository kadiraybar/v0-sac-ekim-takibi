export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push notifications are not supported")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      // VAPID public key - gerçek uygulamada bu değer bir çevre değişkeni olmalı
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

      if (!publicKey) {
        console.error("VAPID public key is missing")
        return null
      }

      const convertedKey = urlBase64ToUint8Array(publicKey)

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      })
    }

    // Sunucuya aboneliği kaydet
    await fetch("/api/push-subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    })

    return subscription
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    return null
  }
}

// Base64 URL'yi Uint8Array'e dönüştürme
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
