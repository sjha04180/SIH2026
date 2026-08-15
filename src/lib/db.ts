// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Dynamically append pgbouncer=true for PostgreSQL connection strings to disable prepared statements in pooled environments
  if ((url.startsWith('postgres://') || url.startsWith('postgresql://')) && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}pgbouncer=true`;
  }
  return url;
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

