import { NextRequest, NextResponse } from "next/server";
import { drizzle } from 'drizzle-orm/neon-http';
import { users, verificationCodes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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
          eq(verificationCodes.type, "signup"),
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

    // Mark user email as verified
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRecord.length > 0) {
      await db
        .update(users)
        .set({ email_verified: true })
        .where(eq(users.id, userRecord[0].id));
    }

    return NextResponse.json(
      { 
        message: "Email verified successfully. You can now log in.",
        user: userRecord[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify signup error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
