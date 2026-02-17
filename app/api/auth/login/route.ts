// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"; 

export async function POST(request: NextRequest) {
  try {
    console.log("📡 POST /api/auth/login");
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Find user (normalize email to lowercase)
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userData = user[0];


    const isValidPassword = await bcrypt.compare(password, userData.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check status
    if (userData.status === "Blocked") {
      return NextResponse.json(
        { error: "Account is blocked" },
        { status: 403 }
      );
    }

    console.log("Login successful:", userData.email);

    return NextResponse.json({
      user: {
        id: userData.userId,
        full_name: userData.fullName,
        email: userData.email,
        role: userData.role?.toLowerCase() as "admin" | "user",
        status: userData.status?.toLowerCase() as "active" | "blocked",
        created_at: userData.createdAt?.toISOString(),
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}