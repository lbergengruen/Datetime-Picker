import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper to check if database is available (for build-time checks)
export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL && 
    process.env.DATABASE_URL !== 'postgresql://placeholder' &&
    !process.env.DATABASE_URL.includes('placeholder');
}
