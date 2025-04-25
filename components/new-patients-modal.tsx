"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarClock, Clock, Search, Users, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Sample data - in a real app this would come from a database
const newPatients = [
  {
    id: 201,
    patientName: "Ahmet Yılmaz",
    registrationDate: new Date(2025, 3, 20),
    phone: "0555 123 4567",
    avatar: "AY",
    upcomingAppointment: {
      date: new Date(2025, 3, 25, 10, 0),
      type: "İlk Konsültasyon",
    },
    source: "Web Sitesi",
  },
  {
    id: 202,
    patientName: "Mehmet Demir",
    registrationDate: new Date(2025, 3, 21),
    phone: "0532 987 6543",
    avatar: "MD",
    upcomingAppointment: {
      date: new Date(2025, 3, 25, 13, 0),
      type: "Saç Ekimi",
    },
    source: "Tavsiye",
  },
  {
    id: 203,
    patientName: "Ayşe Kaya",
    registrationDate: new Date(2025, 3, 22),
    phone: "0533 456 7890",
    avatar: "AK",
    upcomingAppointment: {
      date: new Date(2025, 3, 26, 11, 0),
      type: "Kontrol",
    },
    source: "Instagram",
  },
  {
    id: 204,
    patientName: "Fatma Şahin",
    registrationDate: new Date(2025, 3, 23),
    phone: "0542 345 6789",
    avatar: "FŞ",
    upcomingAppointment: {
      date: new Date(2025, 3, 27, 14, 30),
      type: "Saç Ekimi",
    },
    source: "Google",
  },
  {
    id: 205,
    patientName: "Mustafa Öztürk",
    registrationDate: new Date(2025, 3, 24),
    phone: "0535 678 9012",
    avatar: "MÖ",
    upcomingAppointment: {
      date: new Date(2025, 3, 28, 9, 0),
      type: "İlk Konsültasyon",
    },
    source: "Facebook",
  },
  {
    id: 206,
    patientName: "Zeynep Aydın",
    registrationDate: new Date(2025, 3, 25),
    phone: "0544 789 0123",
    avatar: "ZA",
    upcomingAppointment: {
      date: new Date(2025, 3, 29, 15, 0),
      type: "PRP",
    },
    source: "Tavsiye",
  },
  {
    id: 207,
    patientName: "Ali Yıldız",
    registrationDate: new Date(2025, 3, 26),
    phone: "0537 890 1234",
    avatar: "AY",
    upcomingAppointment: {
      date: new Date(2025, 3, 30, 10, 30),
      type: "Saç Ekimi",
    },
    source: "Web Sitesi",
  },
  {
    id: 208,
    patientName: "Selin Taş",
    registrationDate: new Date(2025, 3, 27),
    phone: "0534 345 6789",
    avatar: "ST",
    upcomingAppointment: null,
    source: "Instagram",
  },
]

interface NewPatientsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewPatientsModal({ open, onOpenChange }: NewPatientsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("desc")

  // Filter and sort patients
  const filteredPatients = newPatients
    .filter((patient) => {
      // Search filter
      const matchesSearch =
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || patient.phone.includes(searchTerm)

      // Source filter
      const matchesSource = sourceFilter === "all" || patient.source === sourceFilter

      return matchesSearch && matchesSource
    })
    .sort((a, b) => {
      // Sort by registration date
      if (sortOrder === "asc") {
        return a.registrationDate.getTime() - b.registrationDate.getTime()
      } else {
        return b.registrationDate.getTime() - a.registrationDate.getTime()
      }
    })

  // Get unique sources for filter
  const sources = Array.from(new Set(newPatients.map((patient) => patient.source)))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Yeni Hastalar
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 overflow-hidden">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hasta adı veya telefon ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="space-y-1 min-w-[140px]">
                <Label htmlFor="source-filter" className="text-xs">
                  Kaynak
                </Label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger id="source-filter" className="h-9">
                    <SelectValue placeholder="Kaynak" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
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

          {/* Patients List */}
          <div className="overflow-y-auto pr-2">
            <div className="grid gap-3">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Arama kriterlerinize uygun yeni hasta bulunamadı.
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{patient.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{patient.patientName}</h4>
                        <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="text-xs">
                            {patient.source}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
                      <div className="flex flex-col items-start">
                        <p className="text-sm font-medium">Kayıt Tarihi:</p>
                        <p className="text-sm">{format(patient.registrationDate, "d MMMM yyyy", { locale: tr })}</p>
                      </div>

                      {patient.upcomingAppointment ? (
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-medium">İlk Randevu:</p>
                          <div className="flex items-center text-sm">
                            <CalendarClock className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{format(patient.upcomingAppointment.date, "d MMMM", { locale: tr })}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(patient.upcomingAppointment.date, "HH:mm")} - {patient.upcomingAppointment.type}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-medium">İlk Randevu:</p>
                          <p className="text-sm text-muted-foreground">Henüz randevu yok</p>
                        </div>
                      )}
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
