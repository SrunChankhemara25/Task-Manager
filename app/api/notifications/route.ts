// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET - Fetch notifications (READ ONLY)
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userNotifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.sendDate));

    const formatted = userNotifs.map((n) => ({
      id: n.notificationId,
      message: n.message,
      send_date: n.sendDate?.toISOString(),
      status: n.status as "read" | "unread",
      user_id: n.userId,
      task_id: n.taskId,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}