"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

export default function NewAppointmentPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringInterval, setRecurringInterval] = useState("weekly")
  const [recurringCount, setRecurringCount] = useState(4)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [notes, setNotes] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("60")

  // PRP price state
  const [prpPrice, setPrpPrice] = useState("1500")
  const [prpSessionCount, setPrpSessionCount] = useState("3")
  const [prpDiscount, setPrpDiscount] = useState("0")

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
        isRecurring,
        recurringDetails: isRecurring
          ? {
              interval: recurringInterval,
              count: recurringCount,
            }
          : null,
        prpDetails:
          appointmentType === "prp"
            ? {
                price: prpPrice,
                sessionCount: prpSessionCount,
                discount: prpDiscount,
                totalPrice: calculateTotalPrice(),
              }
            : null,
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

  const calculateTotalPrice = () => {
    const price = Number.parseInt(prpPrice)
    const sessions = Number.parseInt(prpSessionCount)
    const discount = Number.parseInt(prpDiscount)

    const totalBeforeDiscount = price * sessions
    const discountAmount = totalBeforeDiscount * (discount / 100)

    return totalBeforeDiscount - discountAmount
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Yeni Randevu Oluştur</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Hasta Bilgileri</CardTitle>
                <CardDescription>Randevu oluşturmak için hasta bilgilerini girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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

                {appointmentType === "prp" && (
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

            <Card className="col-span-3">
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

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recurring">Tekrarlayan Randevu</Label>
                    <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                  </div>

                  {isRecurring && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tekrarlama Aralığı</Label>
                        <Select value={recurringInterval} onValueChange={setRecurringInterval}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Günlük</SelectItem>
                            <SelectItem value="weekly">Haftalık</SelectItem>
                            <SelectItem value="biweekly">İki Haftalık</SelectItem>
                            <SelectItem value="monthly">Aylık</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tekrarlama Sayısı</Label>
                        <Select
                          value={recurringCount.toString()}
                          onValueChange={(value) => setRecurringCount(Number.parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[2, 3, 4, 5, 6, 8, 10, 12].map((count) => (
                              <SelectItem key={count} value={count.toString()}>
                                {count} kez
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="rounded-md bg-muted p-3">
                        <div className="flex items-center space-x-2">
                          <RotateCcw className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {recurringCount}{" "}
                            {recurringInterval === "daily"
                              ? "gün"
                              : recurringInterval === "weekly"
                                ? "hafta"
                                : recurringInterval === "biweekly"
                                  ? "iki hafta"
                                  : "ay"}{" "}
                            boyunca tekrarlanacak
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" onClick={() => router.push("/")}>
                  İptal
                </Button>
                <Button type="submit">
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
