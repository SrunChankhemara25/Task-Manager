import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.due_date !== undefined) updateData.dueDate = new Date(body.due_date);
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.category_id !== undefined) updateData.categoryId = body.category_id;

    const updated = await db.update(tasks).set(updateData).where(eq(tasks.taskId, id)).returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = updated[0];
    return NextResponse.json({
      id: task.taskId,
      title: task.title,
      description: task.description,
      due_date: task.dueDate?.toISOString(),
      status: task.status,
      priority: task.priority,
      user_id: task.userId,
      category_id: task.categoryId,
      created_at: task.createdAt?.toISOString(),
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await db.delete(tasks).where(eq(tasks.taskId, id)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully", id });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}