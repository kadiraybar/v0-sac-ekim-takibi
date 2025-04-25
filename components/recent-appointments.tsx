"use client"

import type React from "react"

import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecentAppointmentsProps extends React.HTMLAttributes<HTMLDivElement> {}

// Sample data - in a real app this would come from a database
const recentAppointments = [
  {
    id: 1,
    patientName: "Ahmet Yılmaz",
    date: new Date(2025, 3, 25, 10, 0),
    type: "Initial Consultation",
    status: "confirmed",
    avatar: "AY",
  },
  {
    id: 2,
    patientName: "Mehmet Demir",
    date: new Date(2025, 3, 25, 13, 0),
    type: "Hair Transplant",
    status: "confirmed",
    avatar: "MD",
  },
  {
    id: 3,
    patientName: "Ayşe Kaya",
    date: new Date(2025, 3, 26, 11, 0),
    type: "Follow-up",
    status: "pending",
    avatar: "AK",
  },
  {
    id: 4,
    patientName: "Fatma Şahin",
    date: new Date(2025, 3, 27, 14, 30),
    type: "Hair Transplant",
    status: "confirmed",
    avatar: "FŞ",
  },
  {
    id: 5,
    patientName: "Mustafa Öztürk",
    date: new Date(2025, 3, 28, 9, 0),
    type: "Initial Consultation",
    status: "pending",
    avatar: "MÖ",
  },
]

export function RecentAppointments({ className }: RecentAppointmentsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Onaylandı</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Beklemede</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-300">İptal Edildi</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>Yaklaşan Randevular</CardTitle>
        <CardDescription>Önümüzdeki 7 gün içindeki randevular</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{appointment.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{appointment.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(appointment.date, "d MMMM, EEEE", { locale: tr })}
                  </p>
                  <div className="flex items-center pt-1">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{format(appointment.date, "HH:mm")}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getStatusBadge(appointment.status)}
                {appointment.status === "pending" && (
                  <div className="flex space-x-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
