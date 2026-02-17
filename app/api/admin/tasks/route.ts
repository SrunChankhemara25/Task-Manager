import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { tasks } from '@/db/schema';

const db = drizzle(process.env.DATABASE_URL!);

// GET all tasks across all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const allTasks = await db.select().from(tasks);

    return NextResponse.json(allTasks, { status: 200 });
  } catch (error) {
    console.error('Get all tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
