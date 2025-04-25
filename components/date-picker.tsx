"use client"

import * as React from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function DatePicker() {
  const [date, setDate] = React.useState<Date>(new Date())
  const { expanded } = useSidebar()

  return (
    <div className="px-3 py-4">
      {expanded && <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Takvim</h2>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
              !expanded && "w-10 p-0 justify-center",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {expanded ? date ? format(date, "PPP", { locale: tr }) : <span>Tarih Seç</span> : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus locale={tr} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
