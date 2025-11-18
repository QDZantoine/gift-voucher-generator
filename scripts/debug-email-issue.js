#!/usr/bin/env node

"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Debug de l\'envoi d\'email...\n');

// Charger les variables d'environnement
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env non trouvé !');
  process.exit(1);
}

// Lire le fichier .env
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
envLines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').replace(/^["']|["']$/g, '');
    process.env[key] = value;
  }
});

// Vérifier la configuration
console.log('🔧 Configuration :');
console.log(`   RESEND_API_KEY : ${process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Manquant'}`);
console.log(`   DATABASE_URL : ${process.env.DATABASE_URL ? '✅ Configuré' : '❌ Manquant'}`);
console.log('');

// Test 1: Vérifier la connexion à l'API
async function testAPIConnection() {
  try {
    console.log('🌐 Test de connexion à l\'API...');
    const response = await fetch('http://localhost:3000/api/gift-cards/stats');
    
    if (response.ok) {
      console.log('✅ API accessible');
      return true;
    } else {
      console.log(`❌ API non accessible - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error.message}`);
    return false;
  }
}

// Test 2: Tester l'envoi d'email directement
async function testDirectEmail() {
  try {
    console.log('📧 Test d\'envoi d\'email direct...');
    
    const emailData = {
      to: "antoine.quendez@gmail.com",
      subject: "Test direct - Bon cadeau",
      html: "<h1>Test d'envoi d'email</h1><p>Ceci est un test direct.</p>",
      text: "Test d'envoi d'email - Ceci est un test direct."
    };
    
    const response = await fetch('http://localhost:3000/api/email/send-gift-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giftCardId: "test-direct",
        testMode: true,
        emailData: emailData
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email envoyé avec succès');
      console.log(`   Résultat: ${JSON.stringify(result, null, 2)}`);
      return true;
    } else {
      console.log(`❌ Échec de l'envoi d'email - Status: ${response.status}`);
      console.log(`   Erreur: ${result.error || 'Erreur inconnue'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur lors du test d'email: ${error.message}`);
    return false;
  }
}

// Test 3: Vérifier la base de données
async function testDatabase() {
  try {
    console.log('🗄️ Test de la base de données...');
    
    const response = await fetch('http://localhost:3000/api/gift-cards?limit=5');
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Base de données accessible');
      console.log(`   Nombre de bons cadeaux: ${result.giftCards?.length || 0}`);
      if (result.giftCards && result.giftCards.length > 0) {
        const lastGiftCard = result.giftCards[0];
        console.log(`   Dernier bon cadeau: ${lastGiftCard.code} (Email: ${lastGiftCard.emailSent ? 'Envoyé' : 'Non envoyé'})`);
      }
      return true;
    } else {
      console.log(`❌ Base de données non accessible - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur de base de données: ${error.message}`);
    return false;
  }
}

// Exécuter les tests
async function runTests() {
  console.log('🧪 Démarrage des tests de debug...\n');
  
  const apiOk = await testAPIConnection();
  console.log('');
  
  if (apiOk) {
    await testDatabase();
    console.log('');
    await testDirectEmail();
  }
  
  console.log('\n🏁 Tests de debug terminés !');
}

// Attendre que le serveur soit prêt
console.log('⏳ Attente du serveur (3 secondes)...');
await new Promise(resolve => setTimeout(resolve, 3000));

await runTests();

