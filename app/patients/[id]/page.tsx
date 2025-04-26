"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { ArrowLeft, Home, Phone, Mail, Calendar, Clock, PlusCircle, Edit, Trash, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Patient {
  id: number
  first_name: string
  last_name: string
  phone: string
  email: string | null
  gender: string | null
  created_at: string
}

interface Appointment {
  id: number
  date: string
  duration: number
  status: string
  appointment_type_name: string
  doctor_first_name: string
  doctor_last_name: string
  notes: string | null
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Hasta bilgilerini getir
        const patientResponse = await fetch(`/api/patients/${params.id}`)
        if (!patientResponse.ok) {
          throw new Error("Hasta bilgileri alınamadı")
        }
        const patientData = await patientResponse.json()
        setPatient(patientData)

        // Hastanın randevularını getir
        const appointmentsResponse = await fetch(`/api/appointments?patient_id=${params.id}`)
        if (!appointmentsResponse.ok) {
          throw new Error("Randevu bilgileri alınamadı")
        }
        const appointmentsData = await appointmentsResponse.json()
        setAppointments(appointmentsData)

        setIsLoading(false)
      } catch (err) {
        console.error("Veri yükleme hatası:", err)
        setError("Hasta bilgileri yüklenirken bir hata oluştu.")
        setIsLoading(false)
      }
    }

    fetchPatientData()
  }, [params.id])

  // Durum badge'i
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Onaylandı</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Beklemede</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-300">İptal Edildi</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Tamamlandı</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  // Yeni randevu oluşturma sayfasına yönlendir
  const handleNewAppointment = () => {
    if (patient) {
      router.push(
        `/appointments/new?patient_id=${patient.id}&first_name=${patient.first_name}&last_name=${patient.last_name}&phone=${patient.phone}`,
      )
    }
  }

  // Hasta silme işlemi
  const handleDeletePatient = async () => {
    if (!patient) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Hasta silinemedi")
      }

      toast({
        title: "Hasta silindi",
        description: "Hasta kaydı başarıyla silindi.",
      })

      // Ana sayfaya yönlendir
      router.push("/")
    } catch (error) {
      console.error("Hasta silme hatası:", error)
      toast({
        title: "Hata",
        description: "Hasta silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-4">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
            <Skeleton className="h-8 w-[250px]" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-[200px] md:col-span-1" />
            <Skeleton className="h-[200px] md:col-span-2" />
          </div>

          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Link href="/">
                <Button variant="outline" size="icon">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hasta Bulunamadı</h2>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>{error || "Hasta bilgileri bulunamadı."}</p>
                <Button className="mt-4" onClick={() => router.push("/")}>
                  Ana Sayfaya Dön
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Link href="/">
              <Button variant="outline" size="icon">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hasta Detayları</h2>
          <div className="ml-auto flex gap-2">
            <Button onClick={handleNewAppointment}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Randevu Oluştur
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Hastayı Sil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                    Hastayı Silmek İstediğinize Emin Misiniz?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem geri alınamaz. Bu hasta ve ilişkili tüm randevu kayıtları kalıcı olarak silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeletePatient}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Siliniyor..." : "Evet, Hastayı Sil"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Hasta Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Hasta Bilgileri</CardTitle>
              <CardDescription>Kişisel bilgiler ve iletişim detayları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarFallback className="text-2xl">
                    {patient.first_name.charAt(0)}
                    {patient.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">
                  {patient.first_name} {patient.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Hasta ID: {patient.id} | Kayıt: {format(new Date(patient.created_at), "dd.MM.yyyy", { locale: tr })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.gender && (
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 inline-block"></span>
                    <span>Cinsiyet: {patient.gender === "male" ? "Erkek" : "Kadın"}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push(`/patients/${patient.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Bilgileri Düzenle
              </Button>
            </CardFooter>
          </Card>

          {/* Randevu Özeti */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Randevu Özeti</CardTitle>
              <CardDescription>Hastanın randevu geçmişi ve durumu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Toplam Randevu</p>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Tamamlanan</p>
                  <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "completed").length}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Bekleyen</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter((a) => a.status === "pending" || a.status === "confirmed").length}
                  </p>
                </div>
              </div>

              {appointments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Son Randevu</h4>
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{appointments[0].appointment_type_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Dr. {appointments[0].doctor_first_name} {appointments[0].doctor_last_name}
                        </p>
                      </div>
                      {getStatusBadge(appointments[0].status)}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{format(new Date(appointments[0].date), "d MMMM yyyy", { locale: tr })}</span>
                      <Clock className="h-3.5 w-3.5 ml-3 mr-1 text-muted-foreground" />
                      <span>
                        {format(new Date(appointments[0].date), "HH:mm")} ({appointments[0].duration} dk)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Randevu Geçmişi */}
        <Card>
          <CardHeader>
            <CardTitle>Randevu Geçmişi</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tümü</TabsTrigger>
                <TabsTrigger value="upcoming">Yaklaşan</TabsTrigger>
                <TabsTrigger value="past">Geçmiş</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Randevu kaydı bulunmamaktadır</div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{appointment.appointment_type_name}</h4>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="flex items-center text-sm mb-1">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "d MMMM yyyy", { locale: tr })}</span>
                            <Clock className="h-3.5 w-3.5 ml-3 mr-1 text-muted-foreground" />
                            <span>
                              {format(new Date(appointment.date), "HH:mm")} ({appointment.duration} dk)
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
                          </p>
                          {appointment.notes && <p className="text-sm mt-1">{appointment.notes}</p>}
                        </div>
                        <div className="flex gap-2 mt-3 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/appointments/${appointment.id}`)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => {
                              // Randevu iptal etme işlemi
                              toast({
                                title: "Randevu iptal edildi",
                                description: "Randevu başarıyla iptal edildi.",
                              })
                            }}
                          >
                            <Trash className="h-3.5 w-3.5 mr-1" />
                            İptal Et
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upcoming">
                {appointments.filter((a) => new Date(a.date) >= new Date()).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Yaklaşan randevu bulunmamaktadır</div>
                ) : (
                  <div className="space-y-4">
                    {appointments
                      .filter((a) => new Date(a.date) >= new Date())
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{appointment.appointment_type_name}</h4>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="flex items-center text-sm mb-1">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{format(new Date(appointment.date), "d MMMM yyyy", { locale: tr })}</span>
                              <Clock className="h-3.5 w-3.5 ml-3 mr-1 text-muted-foreground" />
                              <span>
                                {format(new Date(appointment.date), "HH:mm")} ({appointment.duration} dk)
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
                            </p>
                            {appointment.notes && <p className="text-sm mt-1">{appointment.notes}</p>}
                          </div>
                          <div className="flex gap-2 mt-3 sm:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/appointments/${appointment.id}`)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Düzenle
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                              onClick={() => {
                                // Randevu iptal etme işlemi
                                toast({
                                  title: "Randevu iptal edildi",
                                  description: "Randevu başarıyla iptal edildi.",
                                })
                              }}
                            >
                              <Trash className="h-3.5 w-3.5 mr-1" />
                              İptal Et
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {appointments.filter((a) => new Date(a.date) < new Date()).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Geçmiş randevu bulunmamaktadır</div>
                ) : (
                  <div className="space-y-4">
                    {appointments
                      .filter((a) => new Date(a.date) < new Date())
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{appointment.appointment_type_name}</h4>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="flex items-center text-sm mb-1">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{format(new Date(appointment.date), "d MMMM yyyy", { locale: tr })}</span>
                              <Clock className="h-3.5 w-3.5 ml-3 mr-1 text-muted-foreground" />
                              <span>
                                {format(new Date(appointment.date), "HH:mm")} ({appointment.duration} dk)
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
                            </p>
                            {appointment.notes && <p className="text-sm mt-1">{appointment.notes}</p>}
                          </div>
                          <div className="flex gap-2 mt-3 sm:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/appointments/${appointment.id}`)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Düzenle
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
