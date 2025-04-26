"use client"

import type React from "react"

import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/register-sw"
import { requestNotificationPermission, subscribeToPushNotifications } from "@/lib/notifications"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Service Worker'ı kaydet
    registerServiceWorker()

    // Bildirim izinlerini iste
    const setupNotifications = async () => {
      const permissionGranted = await requestNotificationPermission()
      if (permissionGranted) {
        await subscribeToPushNotifications()
      }
    }

    setupNotifications()
  }, [])

  return <>{children}</>
}
