import { NextResponse } from "next/server"
import { createNotification, getNotifications } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const userId = searchParams.has("user_id") ? Number.parseInt(searchParams.get("user_id") as string) : undefined

    const unreadOnly = searchParams.has("unread_only") ? searchParams.get("unread_only") === "true" : false

    const notifications = await getNotifications(userId, unreadOnly)
    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, title, message, type } = body

    if (!title || !message || !type) {
      return NextResponse.json({ error: "Title, message and type are required" }, { status: 400 })
    }

    const newNotification = await createNotification({
      user_id,
      title,
      message,
      type,
    })

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
