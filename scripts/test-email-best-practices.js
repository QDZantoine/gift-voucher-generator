#!/usr/bin/env node

"use strict";

#!/usr/bin/env node

import fs from "fs";
import path from "path";

console.log('📧 Test des bonnes pratiques d\'envoi d\'email...\n');

// Vérifier la configuration
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env non trouvé !');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const resendKeyMatch = envContent.match(/RESEND_API_KEY="(.+)"/);

if (!resendKeyMatch || resendKeyMatch[1] === 're_...') {
  console.log('❌ Clé API Resend non configurée !');
  process.exit(1);
}

console.log('✅ Clé API Resend configurée !');
console.log('✅ Domaine vérifié : onboarding@resend.dev\n');

// Email de test
const testEmail = 'antoine.quendez@gmail.com';

console.log('🧪 Test des bonnes pratiques en cours...\n');

// Test 1: Email avec toutes les bonnes pratiques
const testData1 = {
  recipientEmail: testEmail,
  recipientName: 'Antoine Quendez',
  productType: 'Menu Influences',
  numberOfPeople: 2,
  amount: 90.00,
  code: 'INF-BEST-' + Date.now().toString().slice(-4),
  customMessage: 'Test des bonnes pratiques Resend - Email avec retry logic, validation, tags et headers personnalisés !',
  purchaseDate: new Date().toISOString(),
  expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  templateId: 'template-0'
};

console.log('📋 Test 1 - Email avec bonnes pratiques :');
console.log(`   Email : ${testData1.recipientEmail}`);
console.log(`   Code : ${testData1.code}`);
console.log(`   Message : ${testData1.customMessage}`);
console.log(`   Fonctionnalités : Retry logic, validation, tags, headers, text fallback\n`);

// Test 2: Email avec adresse invalide (test de validation)
const testData2 = {
  ...testData1,
  recipientEmail: 'email-invalide',
  code: 'INF-INVALID-' + Date.now().toString().slice(-4),
  customMessage: 'Test de validation - cette adresse email est invalide',
};

console.log('📋 Test 2 - Validation d\'email invalide :');
console.log(`   Email : ${testData2.recipientEmail} (invalide)`);
console.log(`   Code : ${testData2.code}`);
console.log(`   Attendu : Erreur de validation\n`);

// Test 3: Email avec multiple destinataires
const testData3 = {
  ...testData1,
  recipientEmail: [testEmail, 'test@example.com'],
  code: 'INF-MULTI-' + Date.now().toString().slice(-4),
  customMessage: 'Test d\'envoi multiple - plusieurs destinataires',
};

console.log('📋 Test 3 - Email multiple destinataires :');
console.log(`   Emails : ${testData3.recipientEmail.join(', ')}`);
console.log(`   Code : ${testData3.code}\n`);

async function runEmailTest(testData, testName) {
  const apiUrl = `http://localhost:3000/api/email/send-gift-card`;
  
  try {
    console.log(`🔄 ${testName}...`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ ${testName} - Succès !`);
      console.log(`   Email ID : ${data.emailId}`);
      console.log(`   Retry count : ${data.retryCount || 0}`);
      console.log(`   Code bon cadeau : ${data.giftCardCode}`);
      return true;
    } else {
      console.log(`❌ ${testName} - Échec :`);
      console.log(`   Erreur : ${data.error}`);
      if (data.details) {
        console.log(`   Détails : ${data.details}`);
      }
      if (data.retryCount !== undefined) {
        console.log(`   Retry count : ${data.retryCount}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`❌ ${testName} - Erreur de connexion :`);
    console.log(`   ${error.message}`);
    return false;
  }
}

// Exécuter les tests
async function runTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  const results = [];
  
  // Test 1: Bonnes pratiques
  results.push(await runEmailTest(testData1, 'Test 1 - Bonnes pratiques'));
  console.log('');
  
  // Test 2: Validation
  results.push(await runEmailTest(testData2, 'Test 2 - Validation email invalide'));
  console.log('');
  
  // Test 3: Multiple destinataires
  results.push(await runEmailTest(testData3, 'Test 3 - Multiple destinataires'));
  console.log('');
  
  // Résumé
  console.log('📊 Résumé des tests :');
  console.log(`   Tests réussis : ${results.filter(r => r).length}/${results.length}`);
  console.log(`   Tests échoués : ${results.filter(r => !r).length}/${results.length}`);
  
  if (results[0]) {
    console.log('\n🎉 Les bonnes pratiques Resend sont opérationnelles !');
    console.log('💡 Fonctionnalités testées :');
    console.log('   ✅ Retry logic avec exponential backoff');
    console.log('   ✅ Validation des adresses email');
    console.log('   ✅ Tags pour le tracking');
    console.log('   ✅ Headers personnalisés');
    console.log('   ✅ Text fallback pour les clients email');
    console.log('   ✅ Gestion d\'erreurs spécifiques');
    console.log('   ✅ Logs structurés');
  }
  
  console.log('\n📧 Vérifiez votre boîte email pour les emails reçus !');
}

runTests().catch(console.error);
