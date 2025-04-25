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

// Sample notifications - in a real app these would come from a database
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

export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Count unread notifications
    const count = notifications.filter((notification) => !notification.read).length
    setUnreadCount(count)

    // Set up browser notifications
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }

    // Simulate receiving a new notification after 10 seconds
    const timer = setTimeout(() => {
      const newNotification = {
        id: notifications.length + 1,
        title: "Hatırlatma",
        message: "Yarın 3 randevunuz bulunmaktadır.",
        time: "Şimdi",
        read: false,
      }

      setNotifications((prev) => [newNotification, ...prev])

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification("Saç Ekim Kliniği", {
          body: newNotification.message,
          icon: "/placeholder.svg?height=128&width=128",
        })
      }

      // Show toast notification
      toast({
        title: newNotification.title,
        description: newNotification.message,
      })
    }, 10000)

    return () => clearTimeout(timer)
  }, [notifications])

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
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
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Bildirim bulunmamaktadır</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start p-3 cursor-pointer"
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
