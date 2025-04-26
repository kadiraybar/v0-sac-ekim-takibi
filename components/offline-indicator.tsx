"use client"

import { useEffect, useState } from "react"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Sayfa yüklendiğinde çevrimiçi durumunu kontrol et
    if (typeof navigator !== "undefined") {
      setIsOffline(!navigator.onLine)

      // Çevrimiçi/çevrimdışı durumunu dinle
      const handleOnline = () => setIsOffline(false)
      const handleOffline = () => setIsOffline(true)

      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-1 z-50">
      Çevrimdışısınız. Bazı özellikler kullanılamayabilir.
    </div>
  )
}
