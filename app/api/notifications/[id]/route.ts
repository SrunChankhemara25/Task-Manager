// app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: { id: string };
}

// PUT - Mark as read ONLY (no other updates allowed)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // ✅ Only allow status change to "read"
    if (body.status !== "read") {
      return NextResponse.json(
        { error: "Only marking as read is allowed" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(notifications)
      .set({ status: "read" })
      .where(eq(notifications.notificationId, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    const formatted = {
      id: updated[0].notificationId,
      message: updated[0].message,
      send_date: updated[0].sendDate?.toISOString(),
      status: updated[0].status,
      user_id: updated[0].userId,
      task_id: updated[0].taskId,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}

