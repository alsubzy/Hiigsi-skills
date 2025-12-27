import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: Pool;
};

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('[PRISMA] DATABASE_URL is not defined in environment variables');
  // During build time, we might not have the DATABASE_URL, so we'll create a client anyway
  // but log a warning
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn('[PRISMA] Building without DATABASE_URL - database operations will fail at runtime');
  }
}

// Create connection pool
const pool = globalForPrisma.pool || (process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : undefined);

// Create Prisma adapter
const adapter = pool ? new PrismaPg(pool) : undefined;

// Create Prisma client with adapter
export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  if (pool) globalForPrisma.pool = pool;
}

export default prisma;
