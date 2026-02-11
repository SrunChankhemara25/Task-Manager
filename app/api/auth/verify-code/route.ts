import { NextRequest, NextResponse } from "next/server";
import { drizzle } from 'drizzle-orm/neon-http';
import { verificationCodes, passwordResetTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Helper function to generate reset token
function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
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
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    const db = drizzle(process.env.DATABASE_URL);

    // Find verification code
    const verification = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          eq(verificationCodes.code, code),
          eq(verificationCodes.type, "forgot_password"),
          eq(verificationCodes.is_used, false)
        )
      )
      .limit(1);

    if (verification.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    const verif = verification[0];

    // Check if code has expired
    if (new Date() > verif.expires_at) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Mark code as used
    await db
      .update(verificationCodes)
      .set({ is_used: true })
      .where(eq(verificationCodes.id, verif.id));

    // Generate password reset token
    const resetToken = generateResetToken();
    const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const tokenId = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get user ID from email first
    const { users } = await import("@/db/schema");
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = userRecord[0].id;

    // Store password reset token
    await db.insert(passwordResetTokens).values({
      id: tokenId,
      user_id: userId,
      token: resetToken,
      is_used: false,
      expires_at: tokenExpiresAt,
    });

    return NextResponse.json(
      { 
        message: "Code verified successfully",
        resetToken: resetToken, // Client will use this to reset password
        email: email
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
