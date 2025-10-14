#!/usr/bin/env node

"use strict";

#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Configuration de Resend pour l\'envoi d\'emails...\n');

// Vérifier si le fichier .env existe
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env non trouvé !');
  console.log('💡 Exécutez d\'abord : node scripts/setup-email.js');
  process.exit(1);
}

console.log('📝 Instructions :');
console.log('1. Allez sur https://resend.com');
console.log('2. Créez un compte gratuit (3000 emails/mois)');
console.log('3. Générez une clé API dans votre dashboard');
console.log('4. Collez votre clé ci-dessous\n');

rl.question('🔑 Entrez votre clé API Resend (commence par "re_"): ', (apiKey) => {
  if (!apiKey || !apiKey.startsWith('re_')) {
    console.log('❌ Clé API invalide ! Elle doit commencer par "re_"');
    rl.close();
    return;
  }

  // Lire le fichier .env
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Remplacer la clé API
  envContent = envContent.replace(
    /RESEND_API_KEY="re_\.\.\."/,
    `RESEND_API_KEY="${apiKey}"`
  );
  
  // Écrire le fichier .env mis à jour
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Clé API Resend configurée avec succès !');
  console.log('🚀 Vous pouvez maintenant tester l\'envoi d\'emails :');
  console.log('   node scripts/test-email-with-pdf.js');
  console.log('\n💡 N\'oubliez pas de redémarrer votre serveur :');
  console.log('   npm run dev');
  
  rl.close();
});
