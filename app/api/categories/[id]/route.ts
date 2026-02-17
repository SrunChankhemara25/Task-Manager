// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: { id: string };
}

// PUT update category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.category_name) {
      return NextResponse.json(
        { error: "Category name required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(categories)
      .set({
        categoryName: body.category_name,
      })
      .where(eq(categories.categoryId, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const formatted = {
      id: updated[0].categoryId,
      name: updated[0].categoryName,
      user_id: updated[0].userId,
      created_at: updated[0].createdAt?.toISOString(),
    };

    console.log("✅ Category updated:", formatted.id);
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // ✅ First, unset category_id from all tasks in this category
    await db
      .update(tasks)
      .set({ categoryId: null })
      .where(eq(tasks.categoryId, id));

    // ✅ Then delete the category
    const deleted = await db
      .delete(categories)
      .where(eq(categories.categoryId, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    console.log("✅ Category deleted:", id);
    return NextResponse.json({ message: "Category deleted successfully", id });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}