// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    console.log("📡 POST /api/auth/register");
    
    const body = await request.json();
    const { email, password, full_name } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Email, password, and full name required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        fullName: full_name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "User",
        status: "Active",
      })
      .returning();

    console.log("User registered:", newUser[0].email);

    return NextResponse.json(
      {
        user: {
          id: newUser[0].userId,
          full_name: newUser[0].fullName,
          email: newUser[0].email,
          role: "user" as const,
          status: "active" as const,
          created_at: newUser[0].createdAt?.toISOString(),
        },
        message: "Registration successful",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}