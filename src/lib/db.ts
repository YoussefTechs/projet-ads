import { PrismaClient } from "@prisma/client";

/**
 * Client Prisma en singleton.
 * En développement, Next.js recharge les modules à chaque requête : on
 * conserve l'instance sur l'objet global pour éviter d'épuiser le pool de
 * connexions PostgreSQL.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
