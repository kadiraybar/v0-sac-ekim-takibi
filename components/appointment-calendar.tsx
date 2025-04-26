"use client"

import { Button } from "@/components/ui/button"

import * as React from "react"
import { addDays, format, startOfWeek } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

interface Appointment {
  id: number
  date: string
  duration: number
  status: string
  patient_first_name: string
  patient_last_name: string
  appointment_type_name: string
  appointment_type_color: string
}

interface AppointmentCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  appointments?: Appointment[]
  isLoading?: boolean
  error?: string | null
}

const weekDays = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
const timeSlots = Array.from({ length: 9 }, (_, i) => i + 9) // 9 AM to 5 PM

export function AppointmentCalendar({
  className,
  appointments = [],
  isLoading = false,
  error = null,
}: AppointmentCalendarProps) {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Week starts on Monday

  const getAppointmentsForDayAndTime = (day: Date, hour: number) => {
    if (!appointments || appointments.length === 0) return []

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return (
        appointmentDate.getDate() === day.getDate() &&
        appointmentDate.getMonth() === day.getMonth() &&
        appointmentDate.getFullYear() === day.getFullYear() &&
        appointmentDate.getHours() === hour
      )
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
    }
  }

  const renderAppointmentCell = (day: Date, hour: number) => {
    const dayAppointments = getAppointmentsForDayAndTime(day, hour)

    return (
      <div key={`${day.toISOString()}-${hour}`} className="border-t border-l min-h-[60px] p-1">
        {dayAppointments.map((appointment) => (
          <TooltipProvider key={appointment.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`text-xs rounded p-1 mb-1 cursor-pointer border touch-feedback ${getStatusColor(appointment.status)}`}
                >
                  <div className="font-medium truncate">{`${appointment.patient_first_name} ${appointment.patient_last_name}`}</div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(appointment.date), "HH:mm")}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-bold">{`${appointment.patient_first_name} ${appointment.patient_last_name}`}</p>
                  <p>{appointment.appointment_type_name}</p>
                  <p className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(appointment.date), "HH:mm")} - {appointment.duration} dakika
                  </p>
                  <Badge variant="outline" className={cn("mt-1", getStatusColor(appointment.status))}>
                    {appointment.status === "confirmed"
                      ? "Onaylandı"
                      : appointment.status === "pending"
                        ? "Beklemede"
                        : appointment.status === "completed"
                          ? "Tamamlandı"
                          : "İptal Edildi"}
                  </Badge>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    )
  }

  const renderLoadingState = () => (
    <div className="grid grid-cols-8 gap-1 text-sm">
      <div className="sticky top-0 z-10 bg-background"></div>
      {weekDays.map((day) => (
        <div key={day} className="font-medium text-center py-1">
          <div>{day}</div>
          <div className="text-xs text-muted-foreground">
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </div>
      ))}

      {timeSlots.map((hour) => (
        <React.Fragment key={hour}>
          <div className="border-t pt-2 text-right pr-2 text-muted-foreground">{hour}:00</div>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="border-t border-l min-h-[60px] p-1">
              {Math.random() > 0.7 && <Skeleton className="h-10 w-full rounded mb-1" />}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-64 p-4">
      <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
      <p className="text-center text-muted-foreground">{error || "Randevular yüklenirken bir hata oluştu."}</p>
      <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
        Yeniden Dene
      </Button>
    </div>
  )

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-0.5">
          <CardTitle>Haftalık Takvim</CardTitle>
          <CardDescription>
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              {format(weekStart, "d MMMM", { locale: tr })} -{" "}
              {format(addDays(weekStart, 6), "d MMMM yyyy", { locale: tr })}
            </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {isLoading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : (
          <div className="grid grid-cols-8 gap-1 text-sm min-w-[700px]">
            <div className="sticky top-0 z-10 bg-background"></div>
            {weekDays.map((day, i) => (
              <div key={day} className="font-medium text-center py-1">
                <div>{day}</div>
                <div className="text-xs text-muted-foreground">
                  {format(addDays(weekStart, i), "d MMM", { locale: tr })}
                </div>
              </div>
            ))}

            {timeSlots.map((hour) => (
              <React.Fragment key={hour}>
                <div className="border-t pt-2 text-right pr-2 text-muted-foreground">{hour}:00</div>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const currentDay = addDays(weekStart, dayIndex)
                  return renderAppointmentCell(currentDay, hour)
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
