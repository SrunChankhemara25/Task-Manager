import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, verificationCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Helper function to generate 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const db = drizzle(process.env.DATABASE_URL!);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create new user (email_verified defaults to false)
    const newUser = await db
      .insert(users)
      .values({
        id: userId,
        email,
        password: hashedPassword,
        full_name: fullName,
        role: 'user',
        status: 'active',
        email_verified: false, // Require email verification
      })
      .returning();

    const user = newUser[0];

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const verificationId = `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store verification code
    await db.insert(verificationCodes).values({
      id: verificationId,
      email,
      code,
      type: 'signup',
      is_used: false,
      expires_at: expiresAt,
    });

    // In a real app, you would send this code via email
    console.log(`[DEV] Signup verification code for ${email}: ${code}`);

    // Return user data and verification code
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status,
        email_verified: user.email_verified,
        created_at: user.created_at,
        message: 'User created. Verification code sent to email.',
        verificationCode: code, // Include in dev, remove in production
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
