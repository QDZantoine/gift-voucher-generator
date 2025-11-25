#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Correction des imports require() vers ES6...\n');

// Fichiers à corriger
const filesToFix = [
  'scripts/cleanup.js',
  'scripts/configure-resend.js',
  'scripts/init-env.js',
  'scripts/monitor-emails.js',
  'scripts/optimize-project.js',
  'scripts/preview-pdf.js',
  'scripts/test-email-best-practices.js',
  'scripts/test-final-email.js'
];

// Mappings des imports
const importMappings = {
  'fs': 'import fs from "fs";',
  'path': 'import path from "path";',
  'child_process': 'import { execSync } from "child_process";',
  'readline': 'import readline from "readline";'
};

function fixImports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remplacer les require() par des imports ES6
  const requireRegex = /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\);/g;
  
  content = content.replace(requireRegex, (match, variable, module) => {
    if (importMappings[module]) {
      modified = true;
      return importMappings[module];
    }
    return match;
  });

  // Ajouter "use strict" en haut si nécessaire
  if (modified && !content.includes('"use strict"') && !content.includes("'use strict'")) {
    content = '"use strict";\n\n' + content;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Corrigé: ${filePath}`);
  } else {
    console.log(`⏭️  Aucun changement: ${filePath}`);
  }
}

// Corriger tous les fichiers
filesToFix.forEach(fixImports);

console.log('\n🎉 Correction des imports terminée !');

