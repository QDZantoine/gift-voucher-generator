#!/usr/bin/env node

"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎁 Test simple de création de bon cadeau...\n');

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

// Attendre que le serveur soit prêt
console.log('⏳ Attente du serveur (3 secondes)...');
await new Promise(resolve => setTimeout(resolve, 3000));

// Données de test minimales
const testData = {
  productType: "Menu Influences - Classique",
  numberOfPeople: 2,
  recipientName: "Test User",
  recipientEmail: "antoine.quendez@gmail.com",
  amount: 90.00
};

console.log('📋 Test avec données minimales :');
console.log(`   Produit: ${testData.productType}`);
console.log(`   Destinataire: ${testData.recipientName} (${testData.recipientEmail})`);
console.log(`   Montant: ${testData.amount} €`);
console.log('');

try {
  console.log('🚀 Envoi de la requête...');
  
  const response = await fetch('http://localhost:3000/api/gift-cards/create-from-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
  });

  console.log(`📊 Status de la réponse: ${response.status}`);
  console.log(`📊 Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);

  const result = await response.json();
  console.log(`📊 Réponse complète: ${JSON.stringify(result, null, 2)}`);

  if (response.ok) {
    console.log('✅ Succès !');
    if (result.giftCard) {
      console.log(`   Code: ${result.giftCard.code}`);
      console.log(`   Email envoyé: ${result.giftCard.emailSent ? 'Oui' : 'Non'}`);
    }
  } else {
    console.log('❌ Erreur !');
    console.log(`   Message: ${result.error || 'Erreur inconnue'}`);
  }

} catch (error) {
  console.log('❌ Erreur de connexion:');
  console.log(`   ${error.message}`);
  console.log('💡 Vérifiez que le serveur Next.js est démarré');
}

console.log('\n🏁 Test terminé !');

