"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, Save, ArrowLeft, Home } from "lucide-react"
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

export default function NewAppointmentPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [notes, setNotes] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("60")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!firstName || !lastName || !phone || !appointmentType || !date || !time || !duration) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to a database
    const appointmentData = {
      patient: {
        firstName,
        lastName,
        phone,
      },
      appointment: {
        type: appointmentType,
        date,
        time,
        duration,
        notes,
      },
    }

    console.log("Randevu verileri:", appointmentData)

    toast({
      title: "Randevu oluşturuldu",
      description: `${firstName} ${lastName} için ${format(date, "PPP", { locale: tr })} tarihinde randevu oluşturuldu.`,
    })

    // Redirect back to dashboard
    router.push("/")
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
                  <Label htmlFor="appointmentType">Randevu Türü</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger id="appointmentType">
                      <SelectValue placeholder="Randevu türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">İlk Konsültasyon</SelectItem>
                      <SelectItem value="transplant">Saç Ekimi</SelectItem>
                      <SelectItem value="followup">Kontrol</SelectItem>
                      <SelectItem value="prp">PRP</SelectItem>
                      <SelectItem value="other">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                  <Select value={time} onValueChange={setTime}>
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
                  <Select value={duration} onValueChange={setDuration}>
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
