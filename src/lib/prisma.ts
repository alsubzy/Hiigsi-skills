import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL;

    // Use adapter pattern for Prisma 7
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({ adapter });
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
