import { PrismaClient } from "./generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
  prismaBase: PrismaClient | undefined;
};

function createPrismaClient() {
  const client = new PrismaClient();

  // Utiliser Accelerate si la connection string commence par prisma+postgres://
  // Sinon, utiliser le client standard (pour les migrations avec connection directe)
  const databaseUrl = process.env.DATABASE_URL || "";

  if (databaseUrl.startsWith("prisma+postgres://")) {
    return client.$extends(withAccelerate());
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Client de base sans extension pour les requêtes avec includes complexes
// (l'extension Accelerate peut avoir des problèmes avec certains includes)
// Utiliser une connexion directe même si DATABASE_URL utilise Accelerate
function createPrismaBaseClient() {
  const databaseUrl = process.env.DATABASE_URL || "";
  
  // Si l'URL utilise Accelerate, utiliser DIRECT_URL si disponible
  // DIRECT_URL est la variable d'environnement standard pour la connexion directe avec Accelerate
  if (databaseUrl.startsWith("prisma+postgres://") || databaseUrl.startsWith("prisma://")) {
    const directUrl = process.env.DIRECT_URL;
    if (directUrl) {
      // Convertir postgres:// en postgresql:// si nécessaire (Prisma nécessite postgresql://)
      const normalizedUrl = directUrl.replace(/^postgres:\/\//, "postgresql://");
      console.log("🔧 [prismaBase] Utilisation de DIRECT_URL:", normalizedUrl.substring(0, 30) + "...");
      // Utiliser l'option datasources pour forcer l'URL directe
      return new PrismaClient({
        datasources: {
          db: {
            url: normalizedUrl,
          },
        },
      });
    } else {
      // Si DIRECT_URL n'est pas disponible, convertir l'URL Accelerate en URL PostgreSQL directe
      // Format Accelerate: prisma+postgres://user:password@host:port/database?params
      // Format PostgreSQL: postgresql://user:password@host:port/database?params
      const postgresUrl = databaseUrl.replace(/^prisma\+?/, "");
      console.warn("⚠️  DIRECT_URL n'est pas défini. Conversion de l'URL Accelerate en URL PostgreSQL directe.");
      // Utiliser l'option datasources pour forcer l'URL directe
      return new PrismaClient({
        datasources: {
          db: {
            url: postgresUrl,
          },
        },
      });
    }
  }
  
  // Sinon, utiliser l'URL telle quelle
  return new PrismaClient();
}

export const prismaBase = globalForPrisma.prismaBase ?? createPrismaBaseClient();

// Helper pour obtenir le client Prisma approprié de manière type-safe
export function getPrismaClient(): PrismaClient {
  // Si prisma a des extensions, utiliser prismaBase à la place
  const client = prisma as unknown as { $extends?: unknown };
  if (client.$extends !== undefined) {
    return prismaBase;
  }
  return prisma as unknown as PrismaClient;
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaBase = prismaBase;
}
