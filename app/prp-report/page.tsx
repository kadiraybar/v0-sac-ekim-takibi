"use client"

import { useState } from "react"
import { format, subDays, differenceInDays, startOfDay, endOfDay, isWithinInterval } from "date-fns"
import { tr } from "date-fns/locale"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { CalendarIcon, Download, Search, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Örnek PRP işlem verileri - gerçek uygulamada veritabanından gelecek
const prpTreatments = [
  {
    id: 1,
    patientName: "Ahmet Yılmaz",
    date: new Date(2025, 3, 1),
    sessionNumber: 1,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 2,
    patientName: "Fatma Şahin",
    date: new Date(2025, 3, 2),
    sessionNumber: 2,
    sessionCount: 3,
    price: 1500,
    discount: 10,
    totalPaid: 1350,
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 3,
    patientName: "Zeynep Aydın",
    date: new Date(2025, 3, 3),
    sessionNumber: 1,
    sessionCount: 6,
    price: 1500,
    discount: 15,
    totalPaid: 1275,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 4,
    patientName: "Burak Yılmaz",
    date: new Date(2025, 3, 5),
    sessionNumber: 3,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 5,
    patientName: "Deniz Koç",
    date: new Date(2025, 3, 7),
    sessionNumber: 1,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 6,
    patientName: "Emre Demir",
    date: new Date(2025, 3, 10),
    sessionNumber: 4,
    sessionCount: 6,
    price: 1500,
    discount: 20,
    totalPaid: 1200,
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 7,
    patientName: "Seda Yıldırım",
    date: new Date(2025, 3, 12),
    sessionNumber: 2,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 8,
    patientName: "Murat Arslan",
    date: new Date(2025, 3, 15),
    sessionNumber: 1,
    sessionCount: 3,
    price: 1500,
    discount: 5,
    totalPaid: 1425,
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 9,
    patientName: "Gizem Şen",
    date: new Date(2025, 3, 18),
    sessionNumber: 2,
    sessionCount: 6,
    price: 1500,
    discount: 15,
    totalPaid: 1275,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 10,
    patientName: "Hasan Kara",
    date: new Date(2025, 3, 20),
    sessionNumber: 3,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 11,
    patientName: "Elif Çelik",
    date: new Date(2025, 3, 22),
    sessionNumber: 1,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 12,
    patientName: "Ahmet Yılmaz",
    date: new Date(2025, 3, 25),
    sessionNumber: 2,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 13,
    patientName: "Fatma Şahin",
    date: new Date(2025, 3, 28),
    sessionNumber: 3,
    sessionCount: 3,
    price: 1500,
    discount: 10,
    totalPaid: 1350,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 14,
    patientName: "Zeynep Aydın",
    date: new Date(2025, 4, 2),
    sessionNumber: 2,
    sessionCount: 6,
    price: 1500,
    discount: 15,
    totalPaid: 1275,
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 15,
    patientName: "Burak Yılmaz",
    date: new Date(2025, 4, 5),
    sessionNumber: 2,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 16,
    patientName: "Deniz Koç",
    date: new Date(2025, 4, 8),
    sessionNumber: 2,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 17,
    patientName: "Emre Demir",
    date: new Date(2025, 4, 10),
    sessionNumber: 5,
    sessionCount: 6,
    price: 1500,
    discount: 20,
    totalPaid: 1200,
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 18,
    patientName: "Seda Yıldırım",
    date: new Date(2025, 4, 12),
    sessionNumber: 3,
    sessionCount: 3,
    price: 1500,
    discount: 0,
    totalPaid: 1500,
    doctor: "Dr. Ayşe Kaya",
  },
]

type DateRange = {
  from: Date
  to: Date
}

export default function PRPReportPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [doctorFilter, setDoctorFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("desc")

  // Tarih aralığındaki işlemleri filtrele
  const filteredTreatments = prpTreatments
    .filter((treatment) => {
      // Tarih aralığı filtresi
      const isInDateRange = isWithinInterval(treatment.date, {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to),
      })

      // Arama filtresi
      const matchesSearch =
        searchTerm === "" ||
        treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.doctor.toLowerCase().includes(searchTerm.toLowerCase())

      // Doktor filtresi
      const matchesDoctor = doctorFilter === "all" || treatment.doctor === doctorFilter

      return isInDateRange && matchesSearch && matchesDoctor
    })
    .sort((a, b) => {
      // Sıralama
      if (sortOrder === "asc") {
        return a.date.getTime() - b.date.getTime()
      } else {
        return b.date.getTime() - a.date.getTime()
      }
    })

  // Toplam kazanç
  const totalEarnings = filteredTreatments.reduce((sum, treatment) => sum + treatment.totalPaid, 0)

  // Günlük ortalama kazanç
  const daysInRange = Math.max(1, differenceInDays(dateRange.to, dateRange.from) + 1)
  const dailyAverage = totalEarnings / daysInRange

  // Haftalık ortalama kazanç
  const weeksInRange = Math.max(1, daysInRange / 7)
  const weeklyAverage = totalEarnings / weeksInRange

  // Aylık ortalama kazanç
  const monthsInRange = Math.max(1, daysInRange / 30)
  const monthlyAverage = totalEarnings / monthsInRange

  // Grafik verileri
  const prepareChartData = () => {
    const data: { date: string; earnings: number }[] = []
    const dateMap = new Map<string, number>()

    filteredTreatments.forEach((treatment) => {
      const dateStr = format(treatment.date, "dd.MM.yyyy")
      const currentAmount = dateMap.get(dateStr) || 0
      dateMap.set(dateStr, currentAmount + treatment.totalPaid)
    })

    // Tarihe göre sırala
    const sortedDates = Array.from(dateMap.keys()).sort((a, b) => {
      const dateA = new Date(a.split(".").reverse().join("-"))
      const dateB = new Date(b.split(".").reverse().join("-"))
      return dateA.getTime() - dateB.getTime()
    })

    sortedDates.forEach((date) => {
      data.push({
        date,
        earnings: dateMap.get(date) || 0,
      })
    })

    return data
  }

  const chartData = prepareChartData()

  // Doktor listesi
  const doctors = Array.from(new Set(prpTreatments.map((treatment) => treatment.doctor)))

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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">PRP Kazanç Raporu</h2>
          <div className="ml-auto mt-2 sm:mt-0">
            <Button variant="outline" onClick={() => window.print()} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Raporu İndir
            </Button>
          </div>
        </div>

        {/* Tarih Aralığı Seçici */}
        <Card>
          <CardHeader>
            <CardTitle>Tarih Aralığı</CardTitle>
            <CardDescription>Rapor için tarih aralığı seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
              <div className="grid gap-2 w-full sm:w-auto">
                <Label htmlFor="date-range">Tarih Aralığı</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant={"outline"}
                      className={cn("w-full sm:w-[300px] justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "d MMMM yyyy", { locale: tr })} -{" "}
                            {format(dateRange.to, "d MMMM yyyy", { locale: tr })}
                          </>
                        ) : (
                          format(dateRange.from, "d MMMM yyyy", { locale: tr })
                        )
                      ) : (
                        <span>Tarih aralığı seçin</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange(range as DateRange)
                        }
                      }}
                      numberOfMonths={2}
                      locale={tr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-auto"
                  onClick={() => {
                    const today = new Date()
                    setDateRange({
                      from: subDays(today, 6),
                      to: today,
                    })
                  }}
                >
                  Son 7 Gün
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-auto"
                  onClick={() => {
                    const today = new Date()
                    setDateRange({
                      from: subDays(today, 29),
                      to: today,
                    })
                  }}
                >
                  Son 30 Gün
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-auto"
                  onClick={() => {
                    const today = new Date()
                    setDateRange({
                      from: subDays(today, 89),
                      to: today,
                    })
                  }}
                >
                  Son 90 Gün
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Özet Kartları */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kazanç</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEarnings.toLocaleString("tr-TR")} ₺</div>
              <p className="text-xs text-muted-foreground">
                {format(dateRange.from, "d MMMM", { locale: tr })} -{" "}
                {format(dateRange.to, "d MMMM yyyy", { locale: tr })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Günlük Ortalama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailyAverage.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
              </div>
              <p className="text-xs text-muted-foreground">{daysInRange} gün için</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Haftalık Ortalama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyAverage.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
              </div>
              <p className="text-xs text-muted-foreground">{weeksInRange.toFixed(1)} hafta için</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aylık Ortalama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyAverage.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
              </div>
              <p className="text-xs text-muted-foreground">{monthsInRange.toFixed(1)} ay için</p>
            </CardContent>
          </Card>
        </div>

        {/* Grafik */}
        <Card>
          <CardHeader>
            <CardTitle>Kazanç Grafiği</CardTitle>
            <CardDescription>Seçilen tarih aralığındaki günlük kazançlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis width={60} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value} ₺`, "Kazanç"]} />
                    <Legend />
                    <Bar dataKey="earnings" name="Kazanç (₺)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Seçilen tarih aralığında veri bulunamadı.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* İşlem Listesi */}
        <Card>
          <CardHeader>
            <CardTitle>PRP İşlemleri</CardTitle>
            <CardDescription>Seçilen tarih aralığındaki tüm PRP işlemleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center mb-4">
              <div className="relative flex-1 min-w-[240px] w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hasta adı veya doktor ara..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <div className="space-y-1 min-w-[140px] flex-1 sm:flex-auto">
                  <Label htmlFor="doctor-filter" className="text-xs">
                    Doktor
                  </Label>
                  <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                    <SelectTrigger id="doctor-filter" className="h-9">
                      <SelectValue placeholder="Doktor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 min-w-[140px] flex-1 sm:flex-auto">
                  <Label htmlFor="sort-order" className="text-xs">
                    Sıralama
                  </Label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger id="sort-order" className="h-9">
                      <SelectValue placeholder="Sıralama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">En Yeni</SelectItem>
                      <SelectItem value="asc">En Eski</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {filteredTreatments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Seçilen tarih aralığında ve filtrelere uygun işlem bulunamadı.
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Hasta</TableHead>
                      <TableHead>Doktor</TableHead>
                      <TableHead>Seans</TableHead>
                      <TableHead>Fiyat</TableHead>
                      <TableHead>İndirim</TableHead>
                      <TableHead className="text-right">Toplam</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTreatments.map((treatment) => (
                      <TableRow key={treatment.id}>
                        <TableCell>{format(treatment.date, "dd.MM.yyyy")}</TableCell>
                        <TableCell>{treatment.patientName}</TableCell>
                        <TableCell>{treatment.doctor}</TableCell>
                        <TableCell>
                          {treatment.sessionNumber}/{treatment.sessionCount}
                        </TableCell>
                        <TableCell>{treatment.price.toLocaleString("tr-TR")} ₺</TableCell>
                        <TableCell>
                          {treatment.discount > 0 ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                              %{treatment.discount}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {treatment.totalPaid.toLocaleString("tr-TR")} ₺
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
