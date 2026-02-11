import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, verificationCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper function to generate 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const db = drizzle(process.env.DATABASE_URL);

    // Check if user exists
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0) {
      // For security, don't reveal if email exists
      return NextResponse.json(
        { message: "If email exists, you'll receive a verification code" },
        { status: 200 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const verificationId = `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store verification code
    await db.insert(verificationCodes).values({
      id: verificationId,
      email,
      code,
      type: "forgot_password",
      is_used: false,
      expires_at: expiresAt,
    });

    // In a real app, you would send this code via email
    // For now, we'll return it in development
    console.log(`[DEV] Verification code for ${email}: ${code}`);

    return NextResponse.json(
      { message: "Verification code sent to email", code: code }, // Include code in dev, remove in production
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process forgot password request" },
      { status: 500 }
    );
  }
}
