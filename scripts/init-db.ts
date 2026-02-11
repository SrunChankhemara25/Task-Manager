import { drizzle } from 'drizzle-orm/neon-http';
import { users, categories, tasks, notifications } from '../db/schema';

const initializeDatabase = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const db = drizzle(process.env.DATABASE_URL);

    console.log('[v0] Starting database initialization...');

    // Create sample categories
    const defaultCategories = [
      { name: 'Work', color: '#3b82f6' },
      { name: 'Personal', color: '#ef4444' },
      { name: 'Shopping', color: '#10b981' },
    ];

    console.log('[v0] Creating default categories...');
    for (const category of defaultCategories) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }

    console.log('[v0] Database initialization complete!');
  } catch (error) {
    console.error('[v0] Database initialization error:', error);
    process.exit(1);
  }
};

initializeDatabase();
