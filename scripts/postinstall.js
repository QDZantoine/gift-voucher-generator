#!/usr/bin/env node

/**
 * Script postinstall pour Prisma
 * Utilise --no-engine en production (Vercel, Coolify, CI) pour accélérer les builds
 */

import { execSync } from 'child_process';

// Détecter l'environnement de production
const isProduction = 
  process.env.NODE_ENV === 'production' ||  // Environnement production standard
  process.env.CI === 'true' ||               // CI/CD pipelines (Coolify, GitHub Actions, etc.)
  process.env.DOCKER_BUILD === 'true';       // Docker builds

const useNoEngine = isProduction || process.env.PRISMA_GENERATE_NO_ENGINE === 'true';

const command = useNoEngine 
  ? 'prisma generate --no-engine'
  : 'prisma generate';

console.log(`🔧 Génération du client Prisma${useNoEngine ? ' (sans moteur, mode production)' : ''}...`);
console.log(`   Environnement détecté: ${useNoEngine ? 'PRODUCTION' : 'DÉVELOPPEMENT'}`);

try {
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Client Prisma généré avec succès');
} catch (error) {
  console.error('❌ Erreur lors de la génération du client Prisma:', error.message);
  process.exit(1);
}

