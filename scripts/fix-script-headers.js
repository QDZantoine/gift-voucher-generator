#!/usr/bin/env node

import fs from "fs";

console.log('🔧 Correction des en-têtes de scripts...\n');

// Fichiers à corriger
const scriptFiles = [
  'scripts/cleanup.js',
  'scripts/configure-resend.js',
  'scripts/init-env.js',
  'scripts/monitor-emails.js',
  'scripts/optimize-project.js',
  'scripts/preview-pdf.js',
  'scripts/test-email-best-practices.js',
  'scripts/test-final-email.js'
];

function fixScriptHeader(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Vérifier si le fichier commence par le shebang
  if (!content.startsWith('#!/usr/bin/env node')) {
    // Ajouter le shebang au début
    content = '#!/usr/bin/env node\n\n' + content;
    modified = true;
  }

  // Vérifier si "use strict" est présent et le déplacer après le shebang
  if (content.includes('"use strict"') || content.includes("'use strict'")) {
    const lines = content.split('\n');
    const shebangIndex = lines.findIndex(line => line.startsWith('#!/usr/bin/env node'));
    const strictIndex = lines.findIndex(line => line.includes('use strict'));
    
    if (shebangIndex !== -1 && strictIndex !== -1 && strictIndex < shebangIndex) {
      // Déplacer "use strict" après le shebang
      const strictLine = lines[strictIndex];
      lines.splice(strictIndex, 1);
      lines.splice(shebangIndex + 1, 0, strictLine);
      content = lines.join('\n');
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Corrigé: ${filePath}`);
  } else {
    console.log(`⏭️  Aucun changement: ${filePath}`);
  }
}

// Corriger tous les fichiers
scriptFiles.forEach(fixScriptHeader);

console.log('\n🎉 Correction des en-têtes terminée !');
