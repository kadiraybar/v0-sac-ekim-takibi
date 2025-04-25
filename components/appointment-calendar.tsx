"use client"

import * as React from "react"
import { addDays, format, startOfWeek } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AppointmentCalendarProps extends React.HTMLAttributes<HTMLDivElement> {}

// Sample data - in a real app this would come from a database
const appointments = [
  {
    id: 1,
    patientName: "Ahmet Yılmaz",
    date: new Date(2025, 3, 25, 10, 0),
    duration: 60,
    type: "Initial Consultation",
    status: "confirmed",
  },
  {
    id: 2,
    patientName: "Mehmet Demir",
    date: new Date(2025, 3, 25, 13, 0),
    duration: 120,
    type: "Hair Transplant",
    status: "confirmed",
  },
  {
    id: 3,
    patientName: "Ayşe Kaya",
    date: new Date(2025, 3, 26, 11, 0),
    duration: 45,
    type: "Follow-up",
    status: "pending",
  },
  {
    id: 4,
    patientName: "Fatma Şahin",
    date: new Date(2025, 3, 27, 14, 30),
    duration: 90,
    type: "Hair Transplant",
    status: "confirmed",
  },
]

const weekDays = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
const timeSlots = Array.from({ length: 9 }, (_, i) => i + 9) // 9 AM to 5 PM

export function AppointmentCalendar({ className }: AppointmentCalendarProps) {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Week starts on Monday

  const getAppointmentsForDayAndTime = (day: Date, hour: number) => {
    return appointments.filter((appointment) => {
      const appointmentDate = appointment.date
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
        return "bg-green-100 text-green-800 border-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

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
      <CardContent>
        <div className="grid grid-cols-8 gap-1 text-sm">
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
              {Array.from({ length: 7 }, (_, i) => i).map((dayIndex) => {
                const currentDay = addDays(weekStart, dayIndex)
                const dayAppointments = getAppointmentsForDayAndTime(currentDay, hour)

                return (
                  <div key={`${dayIndex}-${hour}`} className="border-t border-l min-h-[60px] p-1">
                    {dayAppointments.map((appointment) => (
                      <TooltipProvider key={appointment.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`text-xs rounded p-1 mb-1 cursor-pointer border ${getStatusColor(appointment.status)}`}
                            >
                              <div className="font-medium truncate">{appointment.patientName}</div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(appointment.date, "HH:mm")}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p className="font-bold">{appointment.patientName}</p>
                              <p>{appointment.type}</p>
                              <p className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(appointment.date, "HH:mm")} - {appointment.duration} dakika
                              </p>
                              <Badge variant="outline" className={cn("mt-1", getStatusColor(appointment.status))}>
                                {appointment.status === "confirmed"
                                  ? "Onaylandı"
                                  : appointment.status === "pending"
                                    ? "Beklemede"
                                    : "İptal Edildi"}
                              </Badge>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
