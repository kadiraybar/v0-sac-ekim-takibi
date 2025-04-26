"use client"

import { useEffect, useState } from "react"
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, isSameMonth, isSameDay } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, PlusCircle, Clock, Calendar, CheckCircle, Users, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTheme } from "next-themes"

// Basit veri tipleri
interface Appointment {
  id: number
  patient_name: string
  patient_initials: string
  patient_id: number
  date: string
  time: string
  duration: number
  type: string
  status: string
}

interface Patient {
  id: number
  name: string
  initials: string
  phone: string
}

interface AnalyticsData {
  totalAppointments: number
  totalPatients: number
  completedAppointments: number
  pendingAppointments: number
}

interface Event {
  id: number
  title: string
  date: string
  type: "appointment" | "meeting" | "reminder"
}

export default function Dashboard() {
  const { setTheme } = useTheme()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal durumları
  const [showTotalAppointmentsModal, setShowTotalAppointmentsModal] = useState(false)
  const [showTotalPatientsModal, setShowTotalPatientsModal] = useState(false)
  const [showCompletedAppointmentsModal, setShowCompletedAppointmentsModal] = useState(false)
  const [showPendingAppointmentsModal, setShowPendingAppointmentsModal] = useState(false)

  // Örnek veriler - gerçek uygulamada API'den gelecek
  const sampleAppointments: Appointment[] = [
    {
      id: 1,
      patient_name: "Ahmet Yılmaz",
      patient_initials: "AY",
      patient_id: 1,
      date: "2025-04-26",
      time: "10:00",
      duration: 60,
      type: "İlk Konsültasyon",
      status: "confirmed",
    },
    {
      id: 2,
      patient_name: "Mehmet Demir",
      patient_initials: "MD",
      patient_id: 2,
      date: "2025-04-26",
      time: "13:00",
      duration: 120,
      type: "Saç Ekimi",
      status: "confirmed",
    },
    {
      id: 3,
      patient_name: "Ayşe Kaya",
      patient_initials: "AK",
      patient_id: 3,
      date: "2025-04-27",
      time: "11:00",
      duration: 45,
      type: "Kontrol",
      status: "pending",
    },
    {
      id: 4,
      patient_name: "Fatma Şahin",
      patient_initials: "FŞ",
      patient_id: 4,
      date: "2025-04-28",
      time: "14:30",
      duration: 90,
      type: "Saç Ekimi",
      status: "confirmed",
    },
    {
      id: 5,
      patient_name: "Mustafa Öztürk",
      patient_initials: "MÖ",
      patient_id: 5,
      date: "2025-04-29",
      time: "09:00",
      duration: 60,
      type: "İlk Konsültasyon",
      status: "pending",
    },
  ]

  const samplePatients: Patient[] = [
    { id: 1, name: "Ahmet Yılmaz", initials: "AY", phone: "0555 123 4567" },
    { id: 2, name: "Mehmet Demir", initials: "MD", phone: "0532 987 6543" },
    { id: 3, name: "Ayşe Kaya", initials: "AK", phone: "0533 456 7890" },
    { id: 4, name: "Fatma Şahin", initials: "FŞ", phone: "0542 345 6789" },
    { id: 5, name: "Mustafa Öztürk", initials: "MÖ", phone: "0535 678 9012" },
    { id: 6, name: "Zeynep Aydın", initials: "ZA", phone: "0544 789 0123" },
    { id: 7, name: "Ali Yıldız", initials: "AY", phone: "0537 890 1234" },
    { id: 8, name: "Hasan Kara", initials: "HK", phone: "0539 012 3456" },
  ]

  const sampleAnalytics: AnalyticsData = {
    totalAppointments: 24,
    totalPatients: 18,
    completedAppointments: 12,
    pendingAppointments: 6,
  }

  const sampleEvents: Event[] = [
    {
      id: 1,
      title: "Ahmet Yılmaz - Saç Ekimi",
      date: "2025-04-26T10:00:00",
      type: "appointment",
    },
    {
      id: 2,
      title: "Ekip Toplantısı",
      date: "2025-04-27T09:00:00",
      type: "meeting",
    },
    {
      id: 3,
      title: "Ayşe Kaya - Kontrol",
      date: "2025-04-27T11:00:00",
      type: "appointment",
    },
    {
      id: 4,
      title: "Malzeme Siparişi",
      date: "2025-04-28T14:00:00",
      type: "reminder",
    },
    {
      id: 5,
      title: "Fatma Şahin - Saç Ekimi",
      date: "2025-04-28T14:30:00",
      type: "appointment",
    },
    {
      id: 6,
      title: "Doktor Eğitimi",
      date: "2025-04-29T13:00:00",
      type: "meeting",
    },
    {
      id: 7,
      title: "Ali Yıldız - PRP",
      date: "2025-05-05T10:00:00",
      type: "appointment",
    },
    {
      id: 8,
      title: "Zeynep Aydın - Kontrol",
      date: "2025-05-07T14:00:00",
      type: "appointment",
    },
    {
      id: 9,
      title: "Hasan Kara - Saç Ekimi",
      date: "2025-05-10T09:00:00",
      type: "appointment",
    },
    {
      id: 10,
      title: "Aylık Değerlendirme",
      date: "2025-05-15T13:00:00",
      type: "meeting",
    },
  ]

  useEffect(() => {
    // Veri yükleme fonksiyonu
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Gerçek API çağrıları
        // Gerçek uygulamada veritabanından veri çekilecek
        try {
          // Hastaları getir
          const patientsResponse = await fetch("/api/patients")
          if (patientsResponse.ok) {
            const patientsData = await patientsResponse.json()
            setPatients(
              patientsData.map((p: any) => ({
                id: p.id,
                name: `${p.first_name} ${p.last_name}`,
                initials: `${p.first_name.charAt(0)}${p.last_name.charAt(0)}`,
                phone: p.phone,
              })),
            )
          } else {
            // API çağrısı başarısız olursa örnek verileri kullan
            setPatients(samplePatients)
          }

          // Randevuları getir
          const appointmentsResponse = await fetch("/api/appointments")
          if (appointmentsResponse.ok) {
            const appointmentsData = await appointmentsResponse.json()
            setAppointments(
              appointmentsData.map((a: any) => ({
                id: a.id,
                patient_name: `${a.patient_first_name} ${a.patient_last_name}`,
                patient_initials: `${a.patient_first_name.charAt(0)}${a.patient_last_name.charAt(0)}`,
                patient_id: a.patient_id,
                date: a.date.split("T")[0],
                time: format(new Date(a.date), "HH:mm"),
                duration: a.duration,
                type: a.appointment_type_name,
                status: a.status,
              })),
            )
          } else {
            // API çağrısı başarısız olursa örnek verileri kullan
            setAppointments(sampleAppointments)
          }

          // Analitik verileri ve etkinlikleri örnek verilerden al
          setAnalytics(sampleAnalytics)
          setEvents(sampleEvents)
        } catch (err) {
          console.error("API çağrısı hatası:", err)
          // API çağrısı başarısız olursa örnek verileri kullan
          setPatients(samplePatients)
          setAppointments(sampleAppointments)
          setAnalytics(sampleAnalytics)
          setEvents(sampleEvents)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Veri yükleme hatası:", err)
        setError("Veriler yüklenirken bir hata oluştu.")
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Bugünkü randevuları filtrele (örnek amaçlı)
  const todayAppointments = appointments.slice(0, 3)

  // Yaklaşan 7 gün içindeki randevuları filtrele
  const next7DaysAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      const today = new Date()
      const next7Days = addDays(today, 7)
      return appointmentDate >= today && appointmentDate <= next7Days
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Durum badge'i
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

  // Etkinlik türüne göre renk
  const getEventColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "meeting":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "reminder":
        return "bg-amber-100 text-amber-800 border-amber-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Haftalık takvim oluşturma
  const renderWeeklyCalendar = () => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Pazartesi başlangıç
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium mb-1">{format(day, "EEE", { locale: tr })}</div>
            <div className="text-sm font-bold mb-2">{format(day, "d", { locale: tr })}</div>
            <div className="space-y-1">
              {events
                .filter((event) => format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))
                .map((event) => (
                  <TooltipProvider key={event.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`text-xs p-1 rounded truncate ${getEventColor(event.type)}`}
                          style={{ maxWidth: "100%" }}
                        >
                          {format(new Date(event.date), "HH:mm")}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs">{format(new Date(event.date), "d MMMM, HH:mm", { locale: tr })}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Aylık takvim oluşturma
  const renderMonthlyCalendar = () => {
    const today = new Date()
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })

    // Takvim haftalarını oluştur
    const weeks = []
    let day = startDate

    while (day <= monthEnd) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(day)
        day = addDays(day, 1)
      }
      weeks.push(week)
    }

    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((dayName, i) => (
            <div key={i} className="text-center text-xs font-medium">
              {dayName}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => {
                const isToday = isSameDay(day, today)
                const isCurrentMonth = isSameMonth(day, today)
                const dayEvents = events.filter(
                  (event) => format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
                )

                return (
                  <div
                    key={dayIndex}
                    className={`text-center p-1 rounded-md ${isToday ? "bg-primary/10 font-bold" : ""} ${
                      !isCurrentMonth ? "text-muted-foreground" : ""
                    }`}
                  >
                    <div className="text-sm">{format(day, "d")}</div>
                    {dayEvents.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="mt-1 flex justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              {dayEvents.map((event) => (
                                <p key={event.id} className="text-xs">
                                  {format(new Date(event.date), "HH:mm")} - {event.title}
                                </p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-lg font-semibold">İnci Saç Ekim Kliniği</h1>
          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme("light")}
              aria-label="Aydınlık Tema"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme("dark")}
              aria-label="Karanlık Tema"
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hasta Takip Ajandası</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Button variant={"outline"} className="w-full sm:w-auto justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(new Date(), "d MMMM yyyy", { locale: tr })}
            </Button>
            <Link href="/appointments/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Yeni Randevu</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Analiz Kartları */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-[140px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-[60px]" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card
                className="cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => setShowTotalAppointmentsModal(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Randevu</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">Bu ay</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => setShowTotalPatientsModal(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Hasta</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalPatients}</div>
                  <p className="text-xs text-muted-foreground">Aktif kayıt</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => setShowCompletedAppointmentsModal(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.completedAppointments}</div>
                  <p className="text-xs text-muted-foreground">Bu ay</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => setShowPendingAppointmentsModal(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.pendingAppointments}</div>
                  <p className="text-xs text-muted-foreground">Onay bekliyor</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Haftalık Takvim */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Haftalık Etkinlik Takvimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : (
              renderWeeklyCalendar()
            )}
          </CardContent>
        </Card>

        {/* Aylık Takvim */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Aylık Etkinlik Takvimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : (
              renderMonthlyCalendar()
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Bugünkü Randevular</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">{error}</div>
              ) : todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Bugün için randevu bulunmamaktadır</div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{appointment.patient_initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link href={`/patients/${appointment.patient_id}`} className="font-medium hover:underline">
                            {appointment.patient_name}
                          </Link>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-sm">
                              {appointment.time} ({appointment.duration} dk)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 mt-3 sm:mt-0">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{appointment.type}</Badge>
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Son Eklenen Hastalar</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">{error}</div>
              ) : patients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Kayıtlı hasta bulunmamaktadır</div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {patients.slice(0, 5).map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{patient.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link href={`/patients/${patient.id}`} className="font-medium hover:underline">
                            {patient.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Yaklaşan Randevular</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">{error}</div>
            ) : next7DaysAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Yaklaşan 7 gün içinde randevu bulunmamaktadır
              </div>
            ) : (
              <div className="space-y-4">
                {next7DaysAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{appointment.patient_initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/patients/${appointment.patient_id}`} className="font-medium hover:underline">
                          {appointment.patient_name}
                        </Link>
                        <p className="text-sm">{format(new Date(appointment.date), "d MMMM yyyy", { locale: tr })}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="text-sm">
                            {appointment.time} ({appointment.duration} dk)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 mt-3 sm:mt-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{appointment.type}</Badge>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Toplam Randevu Modalı */}
      <Dialog open={showTotalAppointmentsModal} onOpenChange={setShowTotalAppointmentsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Toplam Randevu Bilgisi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Bu ay toplam:</span>
              <span className="text-xl font-bold">{analytics?.totalAppointments} randevu</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Onaylanmış:</span>
                <span className="font-medium">
                  {appointments.filter((a) => a.status === "confirmed").length} randevu
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bekleyen:</span>
                <span className="font-medium">{appointments.filter((a) => a.status === "pending").length} randevu</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>İptal Edilen:</span>
                <span className="font-medium">
                  {appointments.filter((a) => a.status === "cancelled").length} randevu
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tamamlanan:</span>
                <span className="font-medium">
                  {appointments.filter((a) => a.status === "completed").length} randevu
                </span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Geçen aya göre:</span>
                <Badge className="bg-green-100 text-green-800 border-green-300">%12 artış</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toplam Hasta Modalı */}
      <Dialog open={showTotalPatientsModal} onOpenChange={setShowTotalPatientsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Toplam Hasta Bilgisi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Aktif kayıtlı hasta:</span>
              <span className="text-xl font-bold">{analytics?.totalPatients} hasta</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Bu ay yeni kayıt:</span>
                <span className="font-medium">5 hasta</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tedavisi devam eden:</span>
                <span className="font-medium">12 hasta</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tedavisi tamamlanan:</span>
                <span className="font-medium">6 hasta</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Geçen aya göre:</span>
                <Badge className="bg-green-100 text-green-800 border-green-300">%8 artış</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tamamlanan Randevu Modalı */}
      <Dialog open={showCompletedAppointmentsModal} onOpenChange={setShowCompletedAppointmentsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Tamamlanan Randevu Bilgisi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Bu ay tamamlanan:</span>
              <span className="text-xl font-bold">{analytics?.completedAppointments} randevu</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Saç Ekimi:</span>
                <span className="font-medium">4 işlem</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>PRP:</span>
                <span className="font-medium">5 işlem</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Kontrol:</span>
                <span className="font-medium">3 işlem</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Geçen aya göre:</span>
                <Badge className="bg-green-100 text-green-800 border-green-300">%15 artış</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bekleyen Randevu Modalı */}
      <Dialog open={showPendingAppointmentsModal} onOpenChange={setShowPendingAppointmentsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Bekleyen Randevu Bilgisi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Onay bekleyen:</span>
              <span className="text-xl font-bold">{analytics?.pendingAppointments} randevu</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Saç Ekimi:</span>
                <span className="font-medium">2 işlem</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>PRP:</span>
                <span className="font-medium">1 işlem</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>İlk Konsültasyon:</span>
                <span className="font-medium">3 işlem</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">En yakın randevu:</span>
                <span className="font-medium">Bugün, 14:30</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
