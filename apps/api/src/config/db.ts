import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { ENV } from './env.js';
import * as schema from '../db/schema.js';
import { prisma } from './prisma.js';

// Drizzle setup (for migrations and schema management)
const sql = neon(ENV.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Prisma setup (for queries and type-safe operations)
export { prisma };
