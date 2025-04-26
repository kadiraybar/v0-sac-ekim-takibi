import { NextResponse } from "next/server"
import { createPatient, getPatients } from "@/lib/db"

export async function GET() {
  try {
    const patients = await getPatients()
    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { first_name, last_name, phone, email, gender } = body

    if (!first_name || !last_name || !phone) {
      return NextResponse.json({ error: "First name, last name and phone are required" }, { status: 400 })
    }

    const newPatient = await createPatient({ first_name, last_name, phone, email, gender })
    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
