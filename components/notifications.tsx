"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { requestNotificationPermission } from "@/lib/notifications"

// Bildirim türü
interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Bildirimleri API'den yükle
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/notifications?unread_only=false")

        if (!response.ok) {
          throw new Error("Failed to fetch notifications")
        }

        const data = await response.json()

        // API'den gelen verileri uygun formata dönüştür
        const formattedNotifications = data.map((notification: any) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          time: formatTime(new Date(notification.created_at)),
          read: notification.is_read,
        }))

        setNotifications(formattedNotifications)

        // Okunmamış bildirimleri say
        const count = formattedNotifications.filter((notification: Notification) => !notification.read).length
        setUnreadCount(count)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        // Offline durumunda örnek veriler göster
        if (!navigator.onLine) {
          setNotifications(initialNotifications)
          setUnreadCount(initialNotifications.filter((notification) => !notification.read).length)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Bildirim izinlerini iste
    requestNotificationPermission()

    // 30 saniyede bir bildirimleri güncelle
    const interval = setInterval(fetchNotifications, 30000)

    return () => clearInterval(interval)
  }, [])

  // Zaman formatını düzenle (örn: "1 saat önce", "3 gün önce")
  const formatTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "Şimdi"
    if (diffMin < 60) return `${diffMin} dakika önce`
    if (diffHour < 24) return `${diffHour} saat önce`
    return `${diffDay} gün önce`
  }

  const markAllAsRead = async () => {
    try {
      // Okunmamış tüm bildirimleri işaretle
      const unreadNotifications = notifications.filter((notification) => !notification.read)

      for (const notification of unreadNotifications) {
        await fetch(`/api/notifications/${notification.id}/read`, {
          method: "POST",
        })
      }

      // UI'ı güncelle
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)

      toast({
        title: "Bildirimler okundu",
        description: "Tüm bildirimler okundu olarak işaretlendi.",
      })
    } catch (error) {
      console.error("Error marking notifications as read:", error)
      toast({
        title: "Hata",
        description: "Bildirimler işaretlenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      // UI'ı güncelle
      setNotifications(
        notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )

      // Okunmamış sayısını güncelle
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Örnek bildirimler (offline durumunda kullanılır)
  const initialNotifications = [
    {
      id: 1,
      title: "Yaklaşan Randevu",
      message: "Ahmet Yılmaz'ın randevusu 1 saat içinde.",
      time: "1 saat önce",
      read: false,
    },
    {
      id: 2,
      title: "Randevu Onayı Gerekiyor",
      message: "Ayşe Kaya'nın randevusu onay bekliyor.",
      time: "3 saat önce",
      read: true,
    },
    {
      id: 3,
      title: "Yeni Hasta Kaydı",
      message: "Mustafa Öztürk sisteme yeni hasta olarak kaydedildi.",
      time: "1 gün önce",
      read: true,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-10 w-10 touch-target" aria-label="Bildirimler">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Bildirimler</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto text-xs px-2">
              Tümünü okundu işaretle
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="py-4 text-center">
            <div className="animate-pulse flex flex-col space-y-2 p-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Bildirim bulunmamaktadır</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start p-3 cursor-pointer touch-padding"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${!notification.read ? "font-bold" : ""}`}>{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
              </div>
              <p className="text-sm mt-1">{notification.message}</p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
