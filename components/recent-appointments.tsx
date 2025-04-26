"use client"

import type React from "react"

import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Appointment {
  id: number
  date: string
  duration: number
  status: string
  patient_first_name: string
  patient_last_name: string
  appointment_type_name: string
}

interface RecentAppointmentsProps extends React.HTMLAttributes<HTMLDivElement> {
  appointments?: Appointment[]
  isLoading?: boolean
  error?: string | null
}

export function RecentAppointments({
  className,
  appointments = [],
  isLoading = false,
  error = null,
}: RecentAppointmentsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-800">
            Onaylandı
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800">
            Beklemede
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-800">
            İptal Edildi
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800">
            Tamamlandı
          </Badge>
        )
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  // Yaklaşan randevuları filtrele ve sırala
  const upcomingAppointments = appointments
    .filter((appointment) => new Date(appointment.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const renderLoadingState = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-48 p-4">
      <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
      <p className="text-center text-muted-foreground">{error || "Randevular yüklenirken bir hata oluştu."}</p>
      <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
        Yeniden Dene
      </Button>
    </div>
  )

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>Yaklaşan Randevular</CardTitle>
        <CardDescription>Önümüzdeki 7 gün içindeki randevular</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Yaklaşan randevu bulunmamaktadır</div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {appointment.patient_first_name.charAt(0)}
                      {appointment.patient_last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {appointment.patient_first_name} {appointment.patient_last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(appointment.date), "d MMMM, EEEE", { locale: tr })}
                    </p>
                    <span className="flex items-center pt-1">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(appointment.date), "HH:mm")}
                      </span>
                    </span>
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
        )}
      </CardContent>
    </Card>
  )
}
