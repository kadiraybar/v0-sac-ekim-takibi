import { NextResponse } from "next/server"
import { markNotificationAsRead } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const notification = await markNotificationAsRead(id)

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
