import { NextResponse } from "next/server"
import { getPrpTreatments } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: any = {}

    if (searchParams.has("from_date")) {
      filters.from_date = new Date(searchParams.get("from_date") as string)
    }

    if (searchParams.has("to_date")) {
      filters.to_date = new Date(searchParams.get("to_date") as string)
    }

    if (searchParams.has("doctor_id")) {
      filters.doctor_id = Number.parseInt(searchParams.get("doctor_id") as string)
    }

    const treatments = await getPrpTreatments(filters)
    return NextResponse.json(treatments)
  } catch (error) {
    console.error("Error fetching PRP treatments:", error)
    return NextResponse.json({ error: "Failed to fetch PRP treatments" }, { status: 500 })
  }
}
