import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-serverless";
import { verificationCodes } from "@/db/schema";

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
    const { email, type } = body;

    if (!email || !type) {
      return NextResponse.json(
        { error: "Email and type are required" },
        { status: 400 }
      );
    }

    if (!['signup', 'signin', 'forgot_password'].includes(type)) {
      return NextResponse.json(
        { error: "Invalid verification type" },
        { status: 400 }
      );
    }

    const db = drizzle(process.env.DATABASE_URL);

    // Generate new verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const verificationId = `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store verification code
    await db.insert(verificationCodes).values({
      id: verificationId,
      email,
      code,
      type: type as "signup" | "signin" | "forgot_password",
      is_used: false,
      expires_at: expiresAt,
    });

    // In a real app, you would send this code via email
    // For now, we'll return it in development
    console.log(`[DEV] Verification code for ${email} (${type}): ${code}`);

    return NextResponse.json(
      { 
        message: "Verification code sent to email",
        code: code // Include code in dev, remove in production
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend code error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 }
    );
  }
}
