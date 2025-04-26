"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, Save, ArrowLeft, Home, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Patient {
  id: number
  first_name: string
  last_name: string
  phone: string
}

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = useState<Date>()

  // Form state
  const [patientId, setPatientId] = useState<number | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [notes, setNotes] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("60")
  const [doctorId, setDoctorId] = useState("")

  // PRP price state
  const [prpPrice, setPrpPrice] = useState("1500")
  const [prpSessionCount, setPrpSessionCount] = useState("3")
  const [prpDiscount, setPrpDiscount] = useState("0")

  // Hasta arama
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // URL'den hasta bilgilerini al
  useEffect(() => {
    const patient_id = searchParams.get("patient_id")
    const first_name = searchParams.get("first_name")
    const last_name = searchParams.get("last_name")
    const phone_param = searchParams.get("phone")

    if (patient_id) setPatientId(Number.parseInt(patient_id))
    if (first_name) setFirstName(first_name)
    if (last_name) setLastName(last_name)
    if (phone_param) setPhone(phone_param)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!firstName || !lastName || !phone || !appointmentType || !date || !time || !duration || !doctorId) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun",
        variant: "destructive",
      })
      return
    }

    try {
      // Randevu tarihini oluştur
      const appointmentDate = new Date(date)
      const [hours, minutes] = time.split(":").map(Number)
      appointmentDate.setHours(hours, minutes, 0, 0)

      // Randevu verilerini hazırla
      const appointmentData = {
        patient_id: patientId,
        doctor_id: Number.parseInt(doctorId),
        appointment_type_id: Number.parseInt(appointmentType),
        date: appointmentDate.toISOString(),
        duration: Number.parseInt(duration),
        status: "pending",
        notes: notes,
        prp_details:
          appointmentType === "4"
            ? {
                price: Number.parseInt(prpPrice),
                session_count: Number.parseInt(prpSessionCount),
                discount: Number.parseInt(prpDiscount),
                total_price: calculateTotalPrice(),
              }
            : null,
      }

      // Eğer hasta ID yoksa, önce yeni hasta oluştur
      if (!patientId) {
        const patientResponse = await fetch("/api/patients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            phone: phone,
          }),
        })

        if (!patientResponse.ok) {
          throw new Error("Hasta oluşturulamadı")
        }

        const patientData = await patientResponse.json()
        appointmentData.patient_id = patientData.id
      }

      // Randevu oluştur
      const appointmentResponse = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      if (!appointmentResponse.ok) {
        throw new Error("Randevu oluşturulamadı")
      }

      toast({
        title: "Randevu oluşturuldu",
        description: `${firstName} ${lastName} için ${format(date, "PPP", { locale: tr })} tarihinde randevu oluşturuldu.`,
      })

      // Ana sayfaya yönlendir
      router.push("/")
    } catch (error) {
      console.error("Randevu oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: "Randevu oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const calculateTotalPrice = () => {
    const price = Number.parseInt(prpPrice)
    const sessions = Number.parseInt(prpSessionCount)
    const discount = Number.parseInt(prpDiscount)

    const totalBeforeDiscount = price * sessions
    const discountAmount = totalBeforeDiscount * (discount / 100)

    return totalBeforeDiscount - discountAmount
  }

  const handlePatientSearch = async () => {
    if (!searchTerm) return

    setIsSearching(true)
    try {
      // Gerçek API çağrısı
      const response = await fetch(`/api/patients/search?term=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      } else {
        // API çağrısı başarısız olursa örnek veri
        setSearchResults(
          [
            { id: 1, first_name: "Ahmet", last_name: "Yılmaz", phone: "0555 123 4567" },
            { id: 2, first_name: "Mehmet", last_name: "Demir", phone: "0532 987 6543" },
            { id: 3, first_name: "Ayşe", last_name: "Kaya", phone: "0533 456 7890" },
          ].filter(
            (p) =>
              p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.phone.includes(searchTerm),
          ),
        )
      }
    } catch (error) {
      console.error("Hasta arama hatası:", error)
      // Hata durumunda örnek veri
      setSearchResults([
        { id: 1, first_name: "Ahmet", last_name: "Yılmaz", phone: "0555 123 4567" },
        { id: 2, first_name: "Mehmet", last_name: "Demir", phone: "0532 987 6543" },
      ])
    } finally {
      setIsSearching(false)
    }
  }

  const selectPatient = (patient: Patient) => {
    setPatientId(patient.id)
    setFirstName(patient.first_name)
    setLastName(patient.last_name)
    setPhone(patient.phone)
    setSearchResults([])
    setSearchTerm("")
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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Yeni Randevu Oluştur</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Hasta Bilgileri</CardTitle>
                <CardDescription>Randevu oluşturmak için hasta bilgilerini girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="patientSearch">Hasta Ara</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="patientSearch"
                        placeholder="İsim veya telefon ile ara"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" onClick={handlePatientSearch}>
                            <Search className="h-4 w-4 mr-2" />
                            Ara
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Hasta Ara</DialogTitle>
                            <DialogDescription>Mevcut hastalar arasında arama yapın</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="İsim veya telefon ile ara"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                              />
                              <Button type="button" onClick={handlePatientSearch}>
                                <Search className="h-4 w-4 mr-2" />
                                Ara
                              </Button>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto space-y-2">
                              {isSearching ? (
                                <div className="text-center py-4">
                                  <p className="text-sm text-muted-foreground">Aranıyor...</p>
                                </div>
                              ) : searchResults.length === 0 ? (
                                <div className="text-center py-4">
                                  <p className="text-sm text-muted-foreground">Hasta bulunamadı</p>
                                </div>
                              ) : (
                                searchResults.map((patient) => (
                                  <div
                                    key={patient.id}
                                    className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/10 cursor-pointer"
                                    onClick={() => selectPatient(patient)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                          {patient.first_name.charAt(0)}
                                          {patient.last_name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">
                                          {patient.first_name} {patient.last_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{patient.phone}</p>
                                      </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="sm">
                                      Seç
                                    </Button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input
                      id="firstName"
                      placeholder="Hasta adı"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input
                      id="lastName"
                      placeholder="Hasta soyadı"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    placeholder="05XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctorId">Doktor</Label>
                  <Select value={doctorId} onValueChange={setDoctorId} required>
                    <SelectTrigger id="doctorId">
                      <SelectValue placeholder="Doktor seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dr. Mehmet Öz</SelectItem>
                      <SelectItem value="2">Dr. Ayşe Kaya</SelectItem>
                      <SelectItem value="3">Dr. Ali Yılmaz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentType">Randevu Türü</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType} required>
                    <SelectTrigger id="appointmentType">
                      <SelectValue placeholder="Randevu türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">İlk Konsültasyon</SelectItem>
                      <SelectItem value="2">Saç Ekimi</SelectItem>
                      <SelectItem value="3">Kontrol</SelectItem>
                      <SelectItem value="4">PRP</SelectItem>
                      <SelectItem value="5">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {appointmentType === "4" && (
                  <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                    <h3 className="font-medium">PRP Fiyat Bilgisi</h3>

                    <div className="space-y-2">
                      <Label htmlFor="prpPrice">Seans Fiyatı (₺)</Label>
                      <Input
                        id="prpPrice"
                        type="number"
                        placeholder="Seans fiyatı"
                        value={prpPrice}
                        onChange={(e) => setPrpPrice(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prpSessionCount">Seans Sayısı</Label>
                      <Select value={prpSessionCount} onValueChange={setPrpSessionCount}>
                        <SelectTrigger id="prpSessionCount">
                          <SelectValue placeholder="Seans sayısı seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((count) => (
                            <SelectItem key={count} value={count.toString()}>
                              {count} Seans
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prpDiscount">İndirim Oranı (%)</Label>
                      <Input
                        id="prpDiscount"
                        type="number"
                        placeholder="İndirim oranı"
                        value={prpDiscount}
                        onChange={(e) => setPrpDiscount(e.target.value)}
                      />
                    </div>

                    <div className="pt-2 border-t mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Toplam Tutar:</span>
                        <span className="font-bold text-lg">{calculateTotalPrice().toLocaleString("tr-TR")} ₺</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {prpSessionCount} seans × {Number.parseInt(prpPrice).toLocaleString("tr-TR")} ₺
                        {Number.parseInt(prpDiscount) > 0 && ` (${prpDiscount}% indirim)`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Randevu ile ilgili notlar..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle>Randevu Zamanı</CardTitle>
                <CardDescription>Randevu tarih ve saatini seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tarih</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: tr }) : <span>Tarih seçin</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={tr} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Saat</Label>
                  <Select value={time} onValueChange={setTime} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Saat seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 16 }, (_, i) => i + 9).map((hour) => (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Süre</Label>
                  <Select value={duration} onValueChange={setDuration} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Süre seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dakika</SelectItem>
                      <SelectItem value="45">45 dakika</SelectItem>
                      <SelectItem value="60">60 dakika</SelectItem>
                      <SelectItem value="90">90 dakika</SelectItem>
                      <SelectItem value="120">2 saat</SelectItem>
                      <SelectItem value="180">3 saat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between border-t p-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/")}>
                  İptal
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Randevu Oluştur
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}
