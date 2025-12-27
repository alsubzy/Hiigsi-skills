import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: Pool;
};

// Check if we're in build phase
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('[PRISMA] DATABASE_URL is not defined in environment variables');
  if (isBuildPhase) {
    console.warn('[PRISMA] Building without DATABASE_URL - using dummy connection for build phase');
  }
}

// Create connection pool only if DATABASE_URL is available
let pool: Pool | undefined;
let adapter: PrismaPg | undefined;

if (process.env.DATABASE_URL) {
  pool = globalForPrisma.pool || new Pool({ connectionString: process.env.DATABASE_URL });
  adapter = new PrismaPg(pool);
} else if (isBuildPhase) {
  // During build phase without DATABASE_URL, create a dummy pool that won't actually connect
  // This allows the build to complete, but the app will fail at runtime if DATABASE_URL is missing
  console.warn('[PRISMA] Creating dummy adapter for build phase - ensure DATABASE_URL is set at runtime');
  pool = new Pool({
    connectionString: 'postgresql://dummy:dummy@localhost:5432/dummy',
    max: 0 // Don't actually create connections
  });
  adapter = new PrismaPg(pool);
}

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
