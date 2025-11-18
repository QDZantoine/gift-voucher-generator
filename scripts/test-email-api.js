#!/usr/bin/env node

console.log('📧 Test de l\'envoi d\'email via l\'API...\n');

async function testEmailAPI() {
  try {
    const testData = {
      code: 'TEST-API-123',
      productType: 'Menu Influences - Classique',
      numberOfPeople: 2,
      recipientName: 'Test API User',
      recipientEmail: 'antoine.quendez@gmail.com',
      purchaserName: 'Test Purchaser',
      purchaserEmail: 'test@example.com',
      amount: 90,
      expiryDate: '2026-10-14T21:39:34.056Z',
      purchaseDate: '2025-10-14T21:39:34.056Z',
    };

    console.log('🚀 Envoi de la requête à l\'API...');
    
    const response = await fetch('http://localhost:3000/api/gift-cards/create-from-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('📊 Statut de la réponse:', response.status);
    console.log('📋 Réponse:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Bon cadeau créé avec succès !');
      console.log('🎫 Code:', result.giftCard.code);
      console.log('📧 Email envoyé:', result.giftCard.emailSent ? '✅ Oui' : '❌ Non');
      
      if (!result.giftCard.emailSent) {
        console.log('⚠️  L\'email n\'a pas été envoyé. Vérifiez les logs du serveur.');
      }
    } else {
      console.log('❌ Erreur lors de la création du bon cadeau');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testEmailAPI();

