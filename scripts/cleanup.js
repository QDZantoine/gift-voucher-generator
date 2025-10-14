#!/usr/bin/env node

"use strict";

#!/usr/bin/env node

import fs from "fs";
import path from "path";

console.log('🧹 Nettoyage du projet...\n');

// Fichiers et dossiers à nettoyer
const cleanupItems = [
  // Cache Next.js
  '.next',
  
  // Logs
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  
  // Dependencies
  'node_modules',
  
  // OS
  '.DS_Store',
  'Thumbs.db',
  
  // IDE
  '.vscode',
  '.idea',
  
  // Temporary files
  '*.tmp',
  '*.temp',
];

// Fonction pour supprimer un fichier/dossier
function removeItem(itemPath) {
  try {
    if (fs.existsSync(itemPath)) {
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`🗂️  Dossier supprimé : ${itemPath}`);
      } else {
        fs.unlinkSync(itemPath);
        console.log(`📄 Fichier supprimé : ${itemPath}`);
      }
      return true;
    }
  } catch (error) {
    console.log(`❌ Erreur lors de la suppression de ${itemPath}: ${error.message}`);
  }
  return false;
}

// Nettoyer les éléments
let cleanedCount = 0;
const projectRoot = path.join(__dirname, '..');

cleanupItems.forEach(item => {
  const fullPath = path.join(projectRoot, item);
  if (removeItem(fullPath)) {
    cleanedCount++;
  }
});

// Nettoyer les fichiers temporaires dans public
const publicDir = path.join(projectRoot, 'public');
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  publicFiles.forEach(file => {
    if (file.endsWith('.tmp') || file.endsWith('.temp') || file.includes('test-')) {
      const filePath = path.join(publicDir, file);
      if (removeItem(filePath)) {
        cleanedCount++;
      }
    }
  });
}

console.log(`\n✅ Nettoyage terminé ! ${cleanedCount} éléments supprimés.`);
console.log('\n💡 Pour un nettoyage complet, exécutez aussi :');
console.log('   npm run build  # Pour vérifier que tout fonctionne');
console.log('   npm install   # Pour réinstaller les dépendances si nécessaire');
