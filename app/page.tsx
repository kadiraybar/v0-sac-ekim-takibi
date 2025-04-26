"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, PlusCircle, Clock, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Basit veri tipleri
interface Appointment {
  id: number
  patient_name: string
  patient_initials: string
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

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Örnek veriler - gerçek uygulamada API'den gelecek
  const sampleAppointments: Appointment[] = [
    {
      id: 1,
      patient_name: "Ahmet Yılmaz",
      patient_initials: "AY",
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

  useEffect(() => {
    // Veri yükleme simülasyonu
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Gerçek API çağrısı yerine örnek verileri kullan
        // Gerçek uygulamada burada fetch kullanılacak
        setTimeout(() => {
          setAppointments(sampleAppointments)
          setPatients(samplePatients)
          setIsLoading(false)
        }, 1000)
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-lg font-semibold">İnci Saç Ekim Kliniği</h1>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
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
                          <h4 className="font-medium">{appointment.patient_name}</h4>
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
                          <h4 className="font-medium">{patient.name}</h4>
                          <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 mt-4 border-t">
                <Link href="/patients/new">
                  <Button className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Yeni Hasta Ekle
                  </Button>
                </Link>
              </div>
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
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Yaklaşan randevu bulunmamaktadır</div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{appointment.patient_initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{appointment.patient_name}</h4>
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
    </div>
  )
}
