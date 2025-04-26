import { NextResponse } from "next/server"
import { getPatientsBySearchTerm } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const term = searchParams.get("term")

    if (!term) {
      return NextResponse.json({ error: "Search term is required" }, { status: 400 })
    }

    const patients = await getPatientsBySearchTerm(term)
    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error searching patients:", error)
    return NextResponse.json({ error: "Failed to search patients" }, { status: 500 })
  }
}
