import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(tasks.dueDate);

    const formatted = userTasks.map((task) => ({
      id: task.taskId,
      title: task.title,
      description: task.description,
      due_date: task.dueDate?.toISOString(),
      status: task.status,
      priority: task.priority,
      user_id: task.userId,
      category_id: task.categoryId,
      created_at: task.createdAt?.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.due_date || !body.user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTask = await db.insert(tasks).values({
      title: body.title,
      description: body.description || "",
      dueDate: new Date(body.due_date),
      status: body.status || "pending",
      priority: body.priority || "medium",
      userId: body.user_id,
      categoryId: body.category_id || null,
    }).returning();

    const createdTask = newTask[0];

    // Create notification
    await db.insert(notifications).values({
      message: `New task "${createdTask.title}" has been created`,
      userId: body.user_id,
      taskId: createdTask.taskId,
      status: "unread",
      sendDate: new Date(),
    });

    const formatted = {
      id: createdTask.taskId,
      title: createdTask.title,
      description: createdTask.description,
      due_date: createdTask.dueDate?.toISOString(),
      status: createdTask.status,
      priority: createdTask.priority,
      user_id: createdTask.userId,
      category_id: createdTask.categoryId,
      created_at: createdTask.createdAt?.toISOString(),
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}