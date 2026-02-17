import { migrate } from 'drizzle-orm/neon-http/migrator';
import { drizzle } from 'drizzle-orm/neon-http';

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('Running migrations...');
  
  const db = drizzle(process.env.DATABASE_URL);
  await migrate(db, { migrationsFolder: './drizzle' });

  console.log('Migrations completed successfully!');
  process.exit(0);
};

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
