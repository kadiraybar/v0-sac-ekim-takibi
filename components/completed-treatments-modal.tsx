"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarClock, CheckCircle, Clock, Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Sample data - in a real app this would come from a database
const completedTreatments = [
  {
    id: 101,
    patientName: "Ahmet Yılmaz",
    date: new Date(2025, 3, 10, 10, 0),
    duration: 120,
    type: "Saç Ekimi",
    status: "completed",
    avatar: "AY",
    phone: "0555 123 4567",
    notes: "FUE tekniği ile 3000 greft",
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 102,
    patientName: "Fatma Şahin",
    date: new Date(2025, 3, 12, 14, 30),
    duration: 60,
    type: "PRP",
    status: "completed",
    avatar: "FŞ",
    phone: "0542 345 6789",
    notes: "3. seans tamamlandı",
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 103,
    patientName: "Mehmet Demir",
    date: new Date(2025, 3, 15, 11, 0),
    duration: 45,
    type: "Kontrol",
    status: "completed",
    avatar: "MD",
    phone: "0532 987 6543",
    notes: "Saç ekimi sonrası 3. ay kontrolü",
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 104,
    patientName: "Zeynep Aydın",
    date: new Date(2025, 3, 18, 15, 0),
    duration: 60,
    type: "PRP",
    status: "completed",
    avatar: "ZA",
    phone: "0544 789 0123",
    notes: "2. seans tamamlandı",
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 105,
    patientName: "Ali Yıldız",
    date: new Date(2025, 3, 20, 9, 30),
    duration: 120,
    type: "Saç Ekimi",
    status: "completed",
    avatar: "AY",
    phone: "0537 890 1234",
    notes: "DHI tekniği ile 2500 greft",
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 106,
    patientName: "Selin Taş",
    date: new Date(2025, 3, 22, 13, 0),
    duration: 45,
    type: "Kontrol",
    status: "completed",
    avatar: "ST",
    phone: "0534 345 6789",
    notes: "Saç ekimi sonrası 1. ay kontrolü",
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 107,
    patientName: "Burak Yılmaz",
    date: new Date(2025, 3, 25, 10, 0),
    duration: 60,
    type: "PRP",
    status: "completed",
    avatar: "BY",
    phone: "0531 456 7890",
    notes: "1. seans tamamlandı",
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 108,
    patientName: "Deniz Koç",
    date: new Date(2025, 3, 28, 14, 0),
    duration: 45,
    type: "Kontrol",
    status: "completed",
    avatar: "DK",
    phone: "0543 567 8901",
    notes: "PRP sonrası kontrol",
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 109,
    patientName: "Gizem Şen",
    date: new Date(2025, 3, 30, 11, 30),
    duration: 120,
    type: "Saç Ekimi",
    status: "completed",
    avatar: "GŞ",
    phone: "0545 678 9012",
    notes: "FUE tekniği ile 2800 greft",
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 110,
    patientName: "Emre Demir",
    date: new Date(2025, 4, 2, 9, 0),
    duration: 60,
    type: "PRP",
    status: "completed",
    avatar: "ED",
    phone: "0546 789 0123",
    notes: "4. seans tamamlandı",
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: 111,
    patientName: "Seda Yıldırım",
    date: new Date(2025, 4, 5, 13, 30),
    duration: 45,
    type: "Kontrol",
    status: "completed",
    avatar: "SY",
    phone: "0553 234 5678",
    notes: "Saç ekimi sonrası 6. ay kontrolü",
    doctor: "Dr. Mehmet Öz",
  },
  {
    id: 112,
    patientName: "Murat Arslan",
    date: new Date(2025, 4, 8, 10, 30),
    duration: 120,
    type: "Saç Ekimi",
    status: "completed",
    avatar: "MA",
    phone: "0536 234 5678",
    notes: "DHI tekniği ile 3200 greft",
    doctor: "Dr. Mehmet Öz",
  },
]

interface CompletedTreatmentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompletedTreatmentsModal({ open, onOpenChange }: CompletedTreatmentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [doctorFilter, setDoctorFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("desc")

  // Filter and sort treatments
  const filteredTreatments = completedTreatments
    .filter((treatment) => {
      // Search filter
      const matchesSearch =
        treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.phone.includes(searchTerm) ||
        treatment.notes.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const matchesType = typeFilter === "all" || treatment.type === typeFilter

      // Doctor filter
      const matchesDoctor = doctorFilter === "all" || treatment.doctor === doctorFilter

      return matchesSearch && matchesType && matchesDoctor
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOrder === "asc") {
        return a.date.getTime() - b.date.getTime()
      } else {
        return b.date.getTime() - a.date.getTime()
      }
    })

  // Get unique doctors for filter
  const doctors = Array.from(new Set(completedTreatments.map((treatment) => treatment.doctor)))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Tamamlanan İşlemler
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 overflow-hidden">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hasta adı, telefon veya not ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="space-y-1 min-w-[140px]">
                <Label htmlFor="type-filter" className="text-xs">
                  İşlem Türü
                </Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter" className="h-9">
                    <SelectValue placeholder="İşlem Türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="Saç Ekimi">Saç Ekimi</SelectItem>
                    <SelectItem value="PRP">PRP</SelectItem>
                    <SelectItem value="Kontrol">Kontrol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 min-w-[140px]">
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

              <div className="space-y-1 min-w-[140px]">
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

          {/* Treatments List */}
          <div className="overflow-y-auto pr-2">
            <div className="grid gap-3">
              {filteredTreatments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Arama kriterlerinize uygun tamamlanmış işlem bulunamadı.
                </div>
              ) : (
                filteredTreatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className="flex flex-col p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{treatment.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{treatment.patientName}</h4>
                          <p className="text-sm text-muted-foreground">{treatment.phone}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center text-sm">
                            <CalendarClock className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{format(treatment.date, "d MMMM yyyy", { locale: tr })}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(treatment.date, "HH:mm")} - {treatment.duration} dk
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                          <Badge variant="outline">{treatment.type}</Badge>
                          <Badge className="bg-green-100 text-green-800 border-green-300">Tamamlandı</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">Doktor:</p>
                          <p className="text-sm">{treatment.doctor}</p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm font-medium">Notlar:</p>
                          <p className="text-sm">{treatment.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Kapat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
