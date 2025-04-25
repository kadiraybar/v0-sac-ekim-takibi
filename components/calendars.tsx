"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useSidebar } from "@/components/ui/sidebar"

interface CalendarsProps {
  calendars: {
    name: string
    items: string[]
  }[]
}

export function Calendars({ calendars }: CalendarsProps) {
  const { expanded } = useSidebar()
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>(
    Object.fromEntries(calendars.map((calendar) => [calendar.name, true])),
  )

  const toggleSection = (name: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  return (
    <div className="px-3 py-2">
      {expanded && <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Takvimler</h2>}
      <div className="space-y-1">
        {calendars.map((calendar) => (
          <div key={calendar.name} className="space-y-1">
            <button
              onClick={() => toggleSection(calendar.name)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <span className={expanded ? "" : "sr-only"}>{calendar.name}</span>
              {expanded ? (
                expandedSections[calendar.name] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : null}
            </button>
            {expandedSections[calendar.name] && (
              <div className="pl-4 pt-1">
                {calendar.items.map((item) => (
                  <div key={item} className="flex items-center space-x-2 rounded-md px-2 py-1">
                    <Checkbox id={`calendar-${item}`} />
                    <label htmlFor={`calendar-${item}`} className={`text-sm ${expanded ? "" : "sr-only"}`}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
