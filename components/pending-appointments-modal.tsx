"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarClock, CheckCircle, Clock, Search, X, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Sample data - in a real app this would come from a database
const pendingAppointments = [
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
    id: 15,
    patientName: "Emre Demir",
    date: new Date(2025, 4, 11, 14, 0),
    duration: 120,
    type: "Saç Ekimi",
    status: "pending",
    avatar: "ED",
    phone: "0546 789 0123",
  },
  {
    id: 18,
    patientName: "Seda Yıldırım",
    date: new Date(2025, 4, 15, 11, 30),
    duration: 60,
    type: "PRP",
    status: "pending",
    avatar: "SY",
    phone: "0553 234 5678",
  },
]

interface PendingAppointmentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PendingAppointmentsModal({ open, onOpenChange }: PendingAppointmentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("asc")
  const [appointments, setAppointments] = useState(pendingAppointments)

  // Filter and sort appointments
  const filteredAppointments = appointments
    .filter((appointment) => {
      // Search filter
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.phone.includes(searchTerm)

      // Type filter
      const matchesType = typeFilter === "all" || appointment.type === typeFilter

      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOrder === "asc") {
        return a.date.getTime() - b.date.getTime()
      } else {
        return b.date.getTime() - a.date.getTime()
      }
    })

  const handleApprove = (id: number) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: "confirmed" } : appointment,
      ),
    )
    toast({
      title: "Randevu onaylandı",
      description: "Randevu başarıyla onaylandı.",
    })
  }

  const handleReject = (id: number) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: "cancelled" } : appointment,
      ),
    )
    toast({
      title: "Randevu reddedildi",
      description: "Randevu başarıyla reddedildi.",
      variant: "destructive",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Bekleyen Randevular
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

              <div className="space-y-1 min-w-[140px]">
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
          <div className="overflow-y-auto pr-2">
            <div className="grid gap-3">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Bekleyen randevu bulunmamaktadır.</div>
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
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Beklemede</Badge>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleApprove(appointment.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Onayla
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleReject(appointment.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reddet
                        </Button>
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
