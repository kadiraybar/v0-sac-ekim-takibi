import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { AppointmentCalendar } from "@/components/appointment-calendar"
import { AppointmentStats } from "@/components/appointment-stats"
import { RecentAppointments } from "@/components/recent-appointments"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Saç Ekim Kliniği Kontrol Paneli</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Link href="/appointments/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Kayıt / Randevu
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AppointmentStats />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <AppointmentCalendar className="col-span-4" />
          <RecentAppointments className="col-span-3" />
        </div>
      </div>
    </div>
  )
}
