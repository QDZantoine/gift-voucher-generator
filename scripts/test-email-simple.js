#!/usr/bin/env node

import { sendEmailWithRetry, generateGiftCardEmailHTML } from '../lib/email';
import { generateGiftCardPDF } from '../lib/pdf-generator';

console.log('📧 Test simple de l\'envoi d\'email...\n');

async function testEmail() {
  try {
    // Données de test
    const testData = {
      code: 'TEST-123',
      productType: 'Menu Influences - Classique',
      numberOfPeople: 2,
      recipientName: 'Test User',
      amount: 90,
      expiryDate: '2026-10-14T21:39:34.056Z',
      purchaseDate: '2025-10-14T21:39:34.056Z',
    };

    console.log('🔧 Génération du PDF...');
    const pdfBuffer = await generateGiftCardPDF(testData);
    console.log('✅ PDF généré, taille:', pdfBuffer.length, 'bytes');

    console.log('🔧 Génération du HTML...');
    const emailHTML = generateGiftCardEmailHTML(testData);
    console.log('✅ HTML généré, taille:', emailHTML.length, 'caractères');

    console.log('🔧 Envoi de l\'email...');
    const emailData = {
      to: 'antoine.quendez@gmail.com',
      subject: `🎁 Test Email - ${testData.code}`,
      html: emailHTML,
      text: `Test email pour le bon cadeau ${testData.code}`,
      attachments: [
        {
          filename: `test-${testData.code}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
      tags: [
        { name: 'test', value: 'true' },
        { name: 'gift_card_code', value: testData.code },
      ],
    };

    const result = await sendEmailWithRetry(emailData, 3);
    
    if (result.success) {
      console.log('✅ Email envoyé avec succès !');
      console.log('📧 Email ID:', result.emailId);
      console.log('🔄 Nombre de tentatives:', result.retryCount);
    } else {
      console.log('❌ Échec de l\'envoi d\'email');
      console.log('🚨 Erreur:', result.error);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testEmail();
