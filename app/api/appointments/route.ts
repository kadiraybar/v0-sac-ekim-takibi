import { NextResponse } from "next/server"
import { createAppointment, getAppointments } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: any = {}

    if (searchParams.has("status")) {
      filters.status = searchParams.get("status")
    }

    if (searchParams.has("from_date")) {
      filters.from_date = searchParams.get("from_date")
    }

    if (searchParams.has("to_date")) {
      filters.to_date = searchParams.get("to_date")
    }

    if (searchParams.has("patient_id")) {
      filters.patient_id = Number.parseInt(searchParams.get("patient_id") as string)
    }

    if (searchParams.has("doctor_id")) {
      filters.doctor_id = Number.parseInt(searchParams.get("doctor_id") as string)
    }

    const appointments = await getAppointments(filters)
    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patient_id, doctor_id, appointment_type_id, date, duration, status, notes } = body

    if (!patient_id || !doctor_id || !appointment_type_id || !date || !duration || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newAppointment = await createAppointment({
      patient_id,
      doctor_id,
      appointment_type_id,
      date: new Date(date),
      duration,
      status,
      notes,
    })

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
