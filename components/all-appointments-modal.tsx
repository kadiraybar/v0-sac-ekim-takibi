"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarClock, Clock, Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Sample data - in a real app this would come from a database
const allAppointments = [
  {
    id: 1,
    patientName: "Ahmet Yılmaz",
    date: new Date(2025, 3, 25, 10, 0),
    duration: 60,
    type: "İlk Konsültasyon",
    status: "confirmed",
    avatar: "AY",
    phone: "0555 123 4567",
  },
  {
    id: 2,
    patientName: "Mehmet Demir",
    date: new Date(2025, 3, 25, 13, 0),
    duration: 120,
    type: "Saç Ekimi",
    status: "confirmed",
    avatar: "MD",
    phone: "0532 987 6543",
  },
  {
    id: 3,
    patientName: "Ayşe Kaya",
    date: new Date(2025, 3, 26, 11, 0),
    duration: 45,
    type: "Kontrol",
    status: "pending",
    avatar: "AK",
    phone: "0533 456 7890",
  },
  {
    id: 4,
    patientName: "Fatma Şahin",
    date: new Date(2025, 3, 27, 14, 30),
    duration: 90,
    type: "Saç Ekimi",
    status: "confirmed",
    avatar: "FŞ",
    phone: "0542 345 6789",
  },
  {
    id: 5,
    patientName: "Mustafa Öztürk",
    date: new Date(2025, 3, 28, 9, 0),
    duration: 60,
    type: "İlk Konsültasyon",
    status: "pending",
    avatar: "MÖ",
    phone: "0535 678 9012",
  },
  {
    id: 6,
    patientName: "Zeynep Aydın",
    date: new Date(2025, 3, 29, 15, 0),
    duration: 60,
    type: "PRP",
    status: "confirmed",
    avatar: "ZA",
    phone: "0544 789 0123",
  },
  {
    id: 7,
    patientName: "Ali Yıldız",
    date: new Date(2025, 3, 30, 10, 30),
    duration: 120,
    type: "Saç Ekimi",
    status: "confirmed",
    avatar: "AY",
    phone: "0537 890 1234",
  },
  {
    id: 8,
    patientName: "Hasan Kara",
    date: new Date(2025, 4, 2, 11, 0),
    duration: 45,
    type: "Kontrol",
    status: "confirmed",
    avatar: "HK",
    phone: "0539 012 3456",
  },
  {
    id: 9,
    patientName: "Elif Çelik",
    date: new Date(2025, 4, 3, 14, 0),
    duration: 60,
    type: "PRP",
    status: "pending",
    avatar: "EÇ",
    phone: "0538 123 4567",
  },
  {
    id: 10,
    patientName: "Murat Arslan",
    date: new Date(2025, 4, 4, 9, 30),
    duration: 60,
    type: "İlk Konsültasyon",
    status: "confirmed",
    avatar: "MA",
    phone: "0536 234 5678",
  },
  {
    id: 11,
    patientName: "Selin Taş",
    date: new Date(2025, 4, 5, 13, 0),
    duration: 90,
    type: "Saç Ekimi",
    status: "confirmed",
    avatar: "ST",
    phone: "0534 345 6789",
  },
  {
    id: 12,
    patientName: "Burak Yılmaz",
    date: new Date(2025, 4, 6, 10, 0),
    duration: 45,
    type: "Kontrol",
    status: "pending",
    avatar: "BY",
    phone: "0531 456 7890",
  },
  {
    id: 13,
    patientName: "Deniz Koç",
    date: new Date(2025, 4, 7, 15, 30),
    duration: 60,
    type: "PRP",
    status: "confirmed",
    avatar: "DK",
    phone: "0543 567 8901",
  },
  {
    id: 14,
    patientName: "Gizem Şen",
    date: new Date(2025, 4, 10, 11, 0),
    duration: 60,
    type: "İlk Konsültasyon",
    status: "confirmed",
    avatar: "GŞ",
    phone: "0545 678 9012",
  },
  {
    id: 15,
    patientName: "Emre Demir",
    date: new Date(2025, 4, 11, 14, 0),
    duration: 120,
    type: "Saç Ekimi",
    status: "pending",
    avatar: "ED",
    phone: "0546 789 0123",
  },
]

interface AllAppointmentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AllAppointmentsModal({ open, onOpenChange }: AllAppointmentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("asc")

  // Filter and sort appointments
  const filteredAppointments = allAppointments
    .filter((appointment) => {
      // Search filter
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.phone.includes(searchTerm)

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && appointment.status === "confirmed") ||
        (statusFilter === "pending" && appointment.status === "pending")

      // Type filter
      const matchesType = typeFilter === "all" || appointment.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOrder === "asc") {
        return a.date.getTime() - b.date.getTime()
      } else {
        return b.date.getTime() - a.date.getTime()
      }
    })

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] h-[90vh] sm:max-h-[80vh] sm:h-auto overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <CalendarClock className="mr-2 h-5 w-5" />
            Tüm Randevular
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 overflow-hidden">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start">
            <div className="relative flex-1 min-w-[240px] w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hasta adı veya telefon ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="space-y-1 min-w-[140px] flex-1 sm:flex-auto">
                <Label htmlFor="status-filter" className="text-xs">
                  Durum
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="h-9">
                    <SelectValue placeholder="Durum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="confirmed">Onaylandı</SelectItem>
                    <SelectItem value="pending">Beklemede</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 min-w-[140px] flex-1 sm:flex-auto">
                <Label htmlFor="type-filter" className="text-xs">
                  İşlem Türü
                </Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter" className="h-9">
                    <SelectValue placeholder="İşlem Türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="İlk Konsültasyon">İlk Konsültasyon</SelectItem>
                    <SelectItem value="Saç Ekimi">Saç Ekimi</SelectItem>
                    <SelectItem value="Kontrol">Kontrol</SelectItem>
                    <SelectItem value="PRP">PRP</SelectItem>
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
                    <SelectItem value="asc">Yakın Tarih Önce</SelectItem>
                    <SelectItem value="desc">Uzak Tarih Önce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="overflow-y-auto pr-2 flex-1">
            <div className="grid gap-3">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Arama kriterlerinize uygun randevu bulunamadı.
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{appointment.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center text-sm">
                          <CalendarClock className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, "d MMMM yyyy, EEEE", { locale: tr })}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(appointment.date, "HH:mm")} - {appointment.duration} dk
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-1">
                        <Badge variant="outline">{appointment.type}</Badge>
                        {getStatusBadge(appointment.status)}
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
