import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

// Function to get or create the DB instance (lazy initialization)
export const getDb = () => {
  if (!dbInstance) {
    if (!process.env.SQL_HOST) {
      console.warn('SQL_HOST missing, skipping DB initialization');
      throw new Error('Database environment variables are missing');
    }
    pool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      connectionTimeoutMillis: 15000,
    });
    
    pool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });

    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
};

// Re-export db as a proxy or just use getDb(). 
// To minimaly disrupt refactoring, we can keep the export, 
// though Drizzle's db is usually used directly as an object. 
// A Proxy or just changing import usage would work.
// Let's change this to use a proxy to keep the 'db' usage the same.

export const db = new Proxy({} as any, {
  get: (target, prop, receiver) => {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export { pool };
