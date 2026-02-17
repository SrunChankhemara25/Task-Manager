// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, tasks, categories, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: { id: string };
}

// PUT - Update User Profile
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log("📡 PUT /api/users/" + id, body);

    if (!id) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (body.full_name !== undefined) updateData.fullName = body.full_name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.password !== undefined) updateData.password = body.password;
    if (body.status !== undefined) updateData.status = body.status;

    const updated = await db
      .update(users)
      .set(updateData)
      .where(eq(users.userId, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = updated[0];
    const formatted = {
      id: user.userId,
      full_name: user.fullName,
      email: user.email,
      role: user.role?.toLowerCase() as "admin" | "user",
      status: user.status?.toLowerCase() as "active" | "blocked",
      created_at: user.createdAt?.toISOString(),
    };

    console.log("✅ User updated:", formatted.id);
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete User Account
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    console.log("📡 DELETE /api/users/" + id);

    if (!id) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Cascade delete will handle related records due to foreign key constraints
    // But we'll explicitly delete for clarity
    await db.delete(notifications).where(eq(notifications.userId, id));
    await db.delete(tasks).where(eq(tasks.userId, id));
    await db.delete(categories).where(eq(categories.userId, id));

    const deleted = await db
      .delete(users)
      .where(eq(users.userId, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("✅ User deleted:", id);
    return NextResponse.json({ message: "Account deleted successfully", id });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete account", details: String(error) },
      { status: 500 }
    );
  }
}