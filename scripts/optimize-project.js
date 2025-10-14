#!/usr/bin/env node

"use strict";

import fs from "fs";
import { execSync } from "child_process";

console.log('🚀 Optimisation du projet Next.js 15...\n');

// Fonction pour exécuter une commande
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} terminé\n`);
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    process.exit(1);
  }
}

// Fonction pour nettoyer les fichiers temporaires
function cleanTempFiles() {
  console.log('🧹 Nettoyage des fichiers temporaires...');
  
  const tempDirs = ['.next', 'node_modules/.cache', 'dist', 'out'];
  
  tempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`  - Supprimé: ${dir}`);
    }
  });
  
  console.log('✅ Nettoyage terminé\n');
}

// Fonction pour vérifier la configuration
function checkConfiguration() {
  console.log('🔍 Vérification de la configuration...');
  
  const configFiles = [
    'tsconfig.json',
    'eslint.config.mjs',
    'next.config.ts',
    '.eslintignore'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file} existe`);
    } else {
      console.log(`  ❌ ${file} manquant`);
    }
  });
  
  console.log('✅ Vérification terminée\n');
}

// Fonction pour optimiser les imports
function optimizeImports() {
  console.log('📦 Optimisation des imports...');
  
  // Vérifier si les packages sont installés
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredPackages = [
    'next',
    'react',
    'react-dom',
    'typescript',
    '@types/react',
    '@types/node',
    'eslint',
    'eslint-config-next'
  ];
  
  const missingPackages = requiredPackages.filter(pkg => !dependencies[pkg]);
  
  if (missingPackages.length > 0) {
    console.log(`⚠️  Packages manquants: ${missingPackages.join(', ')}`);
  } else {
    console.log('✅ Tous les packages requis sont installés');
  }
  
  console.log('✅ Optimisation des imports terminée\n');
}

// Fonction principale
async function main() {
  try {
    // 1. Nettoyage
    cleanTempFiles();
    
    // 2. Vérification de la configuration
    checkConfiguration();
    
    // 3. Optimisation des imports
    optimizeImports();
    
    // 4. Installation des dépendances
    runCommand('npm install', 'Installation des dépendances');
    
    // 5. Génération des types Prisma
    runCommand('npx prisma generate', 'Génération des types Prisma');
    
    // 6. Vérification TypeScript
    runCommand('npx tsc --noEmit', 'Vérification TypeScript');
    
    // 7. Vérification ESLint
    runCommand('npm run lint', 'Vérification ESLint');
    
    // 8. Build de test
    runCommand('npm run build', 'Build de test');
    
    console.log('🎉 Optimisation terminée avec succès !');
    console.log('\n📋 Résumé:');
    console.log('  ✅ Fichiers temporaires nettoyés');
    console.log('  ✅ Configuration vérifiée');
    console.log('  ✅ Dépendances installées');
    console.log('  ✅ Types Prisma générés');
    console.log('  ✅ TypeScript vérifié');
    console.log('  ✅ ESLint vérifié');
    console.log('  ✅ Build réussi');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error.message);
    process.exit(1);
  }
}

// Exécution
main();
