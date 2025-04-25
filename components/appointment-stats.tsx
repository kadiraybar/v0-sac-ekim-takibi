"use client"

import { CalendarClock, CheckCircle, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { AllAppointmentsModal } from "@/components/all-appointments-modal"
import { PendingAppointmentsModal } from "@/components/pending-appointments-modal"
import { CompletedTreatmentsModal } from "@/components/completed-treatments-modal"
import { NewPatientsModal } from "@/components/new-patients-modal"

export function AppointmentStats() {
  const [showAllAppointments, setShowAllAppointments] = useState(false)
  const [showPendingAppointments, setShowPendingAppointments] = useState(false)
  const [showCompletedTreatments, setShowCompletedTreatments] = useState(false)
  const [showNewPatients, setShowNewPatients] = useState(false)

  // Sample data - in a real app this would come from a database
  const stats = [
    {
      title: "Toplam Randevu",
      value: "24",
      description: "Bu hafta",
      icon: <CalendarClock className="h-4 w-4 text-muted-foreground" />,
      change: "+5%",
      changeType: "increase",
      action: () => setShowAllAppointments(true),
    },
    {
      title: "Bekleyen Randevular",
      value: "6",
      description: "Onay bekliyor",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      change: "-2%",
      changeType: "decrease",
      action: () => setShowPendingAppointments(true),
    },
    {
      title: "Tamamlanan İşlemler",
      value: "12",
      description: "Bu ay",
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      change: "+12%",
      changeType: "increase",
      action: () => setShowCompletedTreatments(true),
    },
    {
      title: "Yeni Hastalar",
      value: "8",
      description: "Bu ay",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      change: "+3%",
      changeType: "increase",
      action: () => setShowNewPatients(true),
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={stat.action}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <div className={`text-xs mt-1 ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
              {stat.change} {stat.changeType === "increase" ? "artış" : "azalış"}
            </div>
          </CardContent>
        </Card>
      ))}

      <AllAppointmentsModal open={showAllAppointments} onOpenChange={setShowAllAppointments} />
      <PendingAppointmentsModal open={showPendingAppointments} onOpenChange={setShowPendingAppointments} />
      <CompletedTreatmentsModal open={showCompletedTreatments} onOpenChange={setShowCompletedTreatments} />
      <NewPatientsModal open={showNewPatients} onOpenChange={setShowNewPatients} />
    </>
  )
}
