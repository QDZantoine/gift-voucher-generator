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
  if (databaseUrl.startsWith("prisma+postgres://")) {
    const directUrl = process.env.DIRECT_URL;
    if (directUrl) {
      // Utiliser DIRECT_URL pour la connexion directe
      return new PrismaClient({
        datasources: {
          db: {
            url: directUrl,
          },
        },
      });
    } else {
      // Si DIRECT_URL n'est pas disponible, utiliser la même URL mais sans extension Accelerate
      // Note: Cela peut ne pas fonctionner si le client Prisma est configuré pour Accelerate uniquement
      console.warn("⚠️  DIRECT_URL n'est pas défini. prismaBase utilisera DATABASE_URL sans extension Accelerate.");
      return new PrismaClient();
    }
  }
  
  // Sinon, utiliser l'URL telle quelle
  return new PrismaClient();
}

export const prismaBase = globalForPrisma.prismaBase ?? createPrismaBaseClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaBase = prismaBase;
}
