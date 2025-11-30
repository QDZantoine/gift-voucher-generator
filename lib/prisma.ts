import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import pg from "pg";

const { Pool } = pg;

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
  prismaBase: PrismaClient | undefined;
  pool: pg.Pool | undefined;
  basePool: pg.Pool | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL || "";

  // Créer un pool de connexions PostgreSQL
  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: databaseUrl.replace(/^prisma\+?/, ""), // Retirer le préfixe prisma+ si présent
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  if (!globalForPrisma.pool) {
    globalForPrisma.pool = pool;
  }

  // Créer l'adapter PostgreSQL
  const adapter = new PrismaPg(pool);

  // Créer le client Prisma avec l'adapter
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  // Utiliser Accelerate si la connection string commence par prisma+postgres://
  if (databaseUrl.startsWith("prisma+postgres://") || databaseUrl.startsWith("prisma://")) {
    return client.$extends(withAccelerate());
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Client de base sans extension pour les requêtes avec includes complexes
// (l'extension Accelerate peut avoir des problèmes avec certains includes)
function createPrismaBaseClient() {
  const databaseUrl = process.env.DATABASE_URL || "";

  // Déterminer l'URL de connexion directe
  let connectionUrl = databaseUrl;

  // Si l'URL utilise Accelerate, utiliser DIRECT_URL si disponible
  if (
    databaseUrl.startsWith("prisma+postgres://") ||
    databaseUrl.startsWith("prisma://")
  ) {
    const directUrl = process.env.DIRECT_URL;
    if (directUrl) {
      // Convertir postgres:// en postgresql:// si nécessaire
      connectionUrl = directUrl.replace(/^postgres:\/\//, "postgresql://");
    } else {
      // Convertir l'URL Accelerate en URL PostgreSQL directe
      connectionUrl = databaseUrl.replace(/^prisma\+?/, "");
      console.warn(
        "⚠️  DIRECT_URL n'est pas défini. Utilisation de l'URL Accelerate convertie."
      );
    }
  }

  // Créer un pool de connexions PostgreSQL séparé pour le client de base
  const basePool = globalForPrisma.basePool ?? new Pool({
    connectionString: connectionUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  if (!globalForPrisma.basePool) {
    globalForPrisma.basePool = basePool;
  }

  // Créer l'adapter PostgreSQL
  const adapter = new PrismaPg(basePool);

  // Créer le client Prisma avec l'adapter
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prismaBase =
  globalForPrisma.prismaBase ?? createPrismaBaseClient();

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
