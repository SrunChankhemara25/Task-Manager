// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const allCategories = await db.select().from(categories);

    // ✅ Map database fields to frontend expected fields
    const formatted = allCategories.map((cat) => ({
      id: cat.categoryId,
      name: cat.categoryName,
      user_id: cat.userId,
      created_at: cat.createdAt?.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.category_name || !body.user_id) {
      return NextResponse.json(
        { error: "Category name and user ID required" },
        { status: 400 }
      );
    }

    const newCategory = await db
      .insert(categories)
      .values({
        categoryName: body.category_name,
        userId: body.user_id,
      })
      .returning();

    const formatted = {
      id: newCategory[0].categoryId,
      name: newCategory[0].categoryName,
      user_id: newCategory[0].userId,
      created_at: newCategory[0].createdAt?.toISOString(),
    };

    console.log("✅ Category created:", formatted.id);
    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}