import { NextResponse } from "next/server"
import { getAppointmentById, updateAppointment } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const appointment = await getAppointmentById(id)

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await request.json()
    const updatedAppointment = await updateAppointment(id, body)

    if (!updatedAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}
