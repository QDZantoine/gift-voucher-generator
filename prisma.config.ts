import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Emplacement du schéma Prisma
  schema: 'prisma/schema.prisma',
  
  // Configuration des migrations
  migrations: {
    path: 'prisma/migrations',
    // Script de seed personnalisé
    seed: 'tsx scripts/init-menu-types.ts',
  },
  
  // Configuration de la base de données
  datasource: {
    // Utilise le helper env() typé de Prisma
    // Note: dotenv doit être chargé explicitement (voir import ci-dessus)
    url: env('DATABASE_URL'),
  },
});

