#!/usr/bin/env node

"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎁 Test de création de bon cadeau avec envoi d\'email...\n');

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
console.log('⏳ Attente du serveur (5 secondes)...');
await new Promise(resolve => setTimeout(resolve, 5000));

// Données de test pour le bon cadeau
const testGiftCardData = {
  productType: "Menu Influences - Classique",
  numberOfPeople: 2,
  recipientName: "Test Recipient",
  recipientEmail: "antoine.quendez@gmail.com",
  purchaserName: "Test Purchaser",
  purchaserEmail: "antoine.quendez@gmail.com",
  amount: 90.00,
  stripePaymentId: "pi_test_" + Date.now(),
  customMessage: "Message de test pour le bon cadeau",
  templateId: "classique"
};

console.log('📋 Données du bon cadeau de test :');
console.log(`   Code produit : ${testGiftCardData.productType}`);
console.log(`   Nombre de personnes : ${testGiftCardData.numberOfPeople}`);
console.log(`   Destinataire : ${testGiftCardData.recipientName} (${testGiftCardData.recipientEmail})`);
console.log(`   Montant : ${testGiftCardData.amount} €`);
console.log(`   Message personnalisé : ${testGiftCardData.customMessage}`);
console.log('');

// Fonction pour créer un bon cadeau via l'API
async function createGiftCard() {
  try {
    console.log('🚀 Création du bon cadeau via l\'API...');
    
    const response = await fetch('http://localhost:3000/api/gift-cards/create-from-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testGiftCardData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Bon cadeau créé avec succès !');
      console.log(`   Code : ${result.giftCard.code}`);
      console.log(`   ID : ${result.giftCard.id}`);
      console.log(`   Email envoyé : ${result.giftCard.emailSent ? 'Oui' : 'Non'}`);
      console.log(`   Date de création : ${new Date(result.giftCard.purchaseDate).toLocaleString()}`);
      console.log(`   Date d'expiration : ${new Date(result.giftCard.expiryDate).toLocaleString()}`);
      
      if (result.giftCard.emailSent) {
        console.log('📧 ✅ Email envoyé automatiquement !');
      } else {
        console.log('📧 ❌ Email non envoyé - vérifiez les logs du serveur');
      }
      
      return result.giftCard;
    } else {
      console.log('❌ Erreur lors de la création du bon cadeau :');
      console.log(`   Status : ${response.status}`);
      console.log(`   Erreur : ${result.error || 'Erreur inconnue'}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Erreur de connexion :');
    console.log(`   ${error.message}`);
    console.log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)');
    return null;
  }
}

// Fonction pour vérifier le statut d'email dans la base de données
async function checkEmailStatus(giftCardCode) {
  try {
    console.log(`🔍 Vérification du statut d'email pour ${giftCardCode}...`);
    
    const response = await fetch(`http://localhost:3000/api/gift-cards?search=${giftCardCode}`);
    const result = await response.json();

    if (response.ok && result.giftCards && result.giftCards.length > 0) {
      const giftCard = result.giftCards[0];
      console.log(`📊 Statut actuel :`);
      console.log(`   Email envoyé : ${giftCard.emailSent ? '✅ Oui' : '❌ Non'}`);
      console.log(`   Créé en ligne : ${giftCard.createdOnline ? 'Oui' : 'Non'}`);
      console.log(`   Utilisé : ${giftCard.isUsed ? 'Oui' : 'Non'}`);
      return giftCard;
    } else {
      console.log('❌ Bon cadeau non trouvé dans la base de données');
      return null;
    }
  } catch (error) {
    console.log('❌ Erreur lors de la vérification :');
    console.log(`   ${error.message}`);
    return null;
  }
}

// Exécuter le test
console.log('🧪 Démarrage du test...\n');

const giftCard = await createGiftCard();

if (giftCard) {
  console.log('\n⏳ Attente de 3 secondes pour laisser le temps à l\'email d\'être envoyé...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await checkEmailStatus(giftCard.code);
  
  console.log('\n📧 Vérifiez votre boîte email pour le bon cadeau !');
  console.log('💡 Si l\'email n\'est pas reçu, vérifiez :');
  console.log('   - Les logs du serveur Next.js');
  console.log('   - La configuration Resend');
  console.log('   - Le dossier spam');
} else {
  console.log('\n❌ Test échoué - impossible de créer le bon cadeau');
}

console.log('\n🏁 Test terminé !');

