#!/usr/bin/env node

"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📧 Test détaillé de l\'envoi d\'email...\n');

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

// Données de test
const testData = {
  productType: "Menu Influences - Classique",
  numberOfPeople: 2,
  recipientName: "Test Email User",
  recipientEmail: "antoine.quendez@gmail.com",
  amount: 90.00
};

console.log('📋 Test d\'envoi d\'email détaillé :');
console.log(`   Produit: ${testData.productType}`);
console.log(`   Destinataire: ${testData.recipientName} (${testData.recipientEmail})`);
console.log(`   Montant: ${testData.amount} €`);
console.log('');

try {
  console.log('🚀 Création du bon cadeau avec envoi d\'email...');
  
  const response = await fetch('http://localhost:3000/api/gift-cards/create-from-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
  });

  const result = await response.json();

  if (response.ok) {
    console.log('✅ Bon cadeau créé avec succès !');
    console.log(`   Code: ${result.giftCard.code}`);
    console.log(`   ID: ${result.giftCard.id}`);
    console.log(`   Email envoyé: ${result.giftCard.emailSent ? '✅ Oui' : '❌ Non'}`);
    
    if (result.giftCard.emailSent) {
      console.log('🎉 Email envoyé automatiquement !');
      console.log('📧 Vérifiez votre boîte email pour le bon cadeau avec PDF joint.');
    } else {
      console.log('⚠️ Email non envoyé - vérifiez les logs du serveur pour plus de détails.');
      console.log('💡 L\'email peut être renvoyé manuellement depuis le dashboard admin.');
    }
    
    // Attendre un peu puis vérifier le statut dans la base de données
    console.log('\n⏳ Attente de 2 secondes puis vérification du statut...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Vérifier le statut via l'API (si accessible)
    try {
      const statusResponse = await fetch(`http://localhost:3000/api/gift-cards?search=${result.giftCard.code}`);
      if (statusResponse.ok) {
        const statusResult = await statusResponse.json();
        if (statusResult.giftCards && statusResult.giftCards.length > 0) {
          const giftCard = statusResult.giftCards[0];
          console.log(`📊 Statut final: Email ${giftCard.emailSent ? 'envoyé' : 'non envoyé'}`);
        }
      }
    } catch (statusError) {
      console.log('⚠️ Impossible de vérifier le statut final (API protégée)');
    }
    
  } else {
    console.log('❌ Erreur lors de la création du bon cadeau !');
    console.log(`   Status: ${response.status}`);
    console.log(`   Erreur: ${result.error || 'Erreur inconnue'}`);
  }

} catch (error) {
  console.log('❌ Erreur de connexion:');
  console.log(`   ${error.message}`);
  console.log('💡 Vérifiez que le serveur Next.js est démarré');
}

console.log('\n🏁 Test terminé !');
console.log('\n💡 Conseils :');
console.log('   - Vérifiez votre boîte email (et le dossier spam)');
console.log('   - Consultez les logs du serveur Next.js pour plus de détails');
console.log('   - Utilisez le dashboard admin pour renvoyer l\'email si nécessaire');

