#!/usr/bin/env node

"use strict";

#!/usr/bin/env node

import fs from "fs";
import path from "path";

console.log('📊 Monitoring des emails Resend...\n');

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

const RESEND_API_KEY = resendKeyMatch[1];

async function listEmails(limit = 10) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des emails:', error.message);
    return null;
  }
}

async function getEmailDetails(emailId) {
  try {
    const response = await fetch(`https://api.resend.com/emails/${emailId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'email ${emailId}:`, error.message);
    return null;
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getStatusEmoji(status) {
  switch (status) {
    case 'delivered': return '✅';
    case 'sent': return '📤';
    case 'bounced': return '❌';
    case 'complained': return '⚠️';
    case 'opened': return '👁️';
    case 'clicked': return '🖱️';
    default: return '❓';
  }
}

async function monitorEmails() {
  console.log('🔍 Récupération des emails récents...\n');
  
  const emailsData = await listEmails(20);
  
  if (!emailsData || !emailsData.data) {
    console.log('❌ Impossible de récupérer les emails');
    return;
  }

  const emails = emailsData.data;
  
  if (emails.length === 0) {
    console.log('📭 Aucun email trouvé');
    return;
  }

  console.log(`📧 ${emails.length} emails trouvés\n`);

  // Statistiques générales
  const stats = {
    total: emails.length,
    delivered: 0,
    sent: 0,
    bounced: 0,
    complained: 0,
    opened: 0,
    clicked: 0,
    giftCards: 0,
  };

  // Analyser les emails
  for (const email of emails) {
    const status = email.last_event || 'unknown';
    stats[status] = (stats[status] || 0) + 1;
    
    if (email.subject && email.subject.includes('bon cadeau')) {
      stats.giftCards++;
    }
  }

  // Afficher les statistiques
  console.log('📊 Statistiques :');
  console.log(`   Total : ${stats.total}`);
  console.log(`   Bons cadeaux : ${stats.giftCards}`);
  console.log(`   Livrés : ${stats.delivered} ${getStatusEmoji('delivered')}`);
  console.log(`   Envoyés : ${stats.sent} ${getStatusEmoji('sent')}`);
  console.log(`   Ouverts : ${stats.opened} ${getStatusEmoji('opened')}`);
  console.log(`   Cliqués : ${stats.clicked} ${getStatusEmoji('clicked')}`);
  console.log(`   Rejetés : ${stats.bounced} ${getStatusEmoji('bounced')}`);
  console.log(`   Plaintes : ${stats.complained} ${getStatusEmoji('complained')}\n`);

  // Afficher les détails des emails récents
  console.log('📋 Emails récents :');
  console.log('─'.repeat(80));
  
  for (let i = 0; i < Math.min(10, emails.length); i++) {
    const email = emails[i];
    const status = email.last_event || 'unknown';
    const isGiftCard = email.subject && email.subject.includes('bon cadeau');
    
    console.log(`${getStatusEmoji(status)} ${email.id}`);
    console.log(`   Sujet : ${email.subject || 'N/A'}`);
    console.log(`   Destinataire : ${email.to || 'N/A'}`);
    console.log(`   Statut : ${status}`);
    console.log(`   Date : ${formatDate(email.created_at)}`);
    if (isGiftCard) {
      console.log(`   🎁 Bon cadeau`);
    }
    console.log('');
  }

  // Détails d'un email spécifique si demandé
  if (process.argv[2] === '--details' && process.argv[3]) {
    const emailId = process.argv[3];
    console.log(`🔍 Détails de l'email ${emailId} :`);
    console.log('─'.repeat(50));
    
    const emailDetails = await getEmailDetails(emailId);
    if (emailDetails) {
      console.log(`ID : ${emailDetails.id}`);
      console.log(`Sujet : ${emailDetails.subject}`);
      console.log(`De : ${emailDetails.from}`);
      console.log(`À : ${emailDetails.to}`);
      console.log(`Statut : ${emailDetails.last_event}`);
      console.log(`Créé : ${formatDate(emailDetails.created_at)}`);
      if (emailDetails.tags && emailDetails.tags.length > 0) {
        console.log(`Tags : ${emailDetails.tags.map(t => `${t.name}=${t.value}`).join(', ')}`);
      }
    }
  }
}

// Aide
if (process.argv[2] === '--help') {
  console.log('📊 Script de monitoring des emails Resend\n');
  console.log('Usage :');
  console.log('  node scripts/monitor-emails.js                    # Afficher les statistiques');
  console.log('  node scripts/monitor-emails.js --details <id>     # Détails d\'un email');
  console.log('  node scripts/monitor-emails.js --help             # Afficher cette aide\n');
  console.log('Exemples :');
  console.log('  node scripts/monitor-emails.js');
  console.log('  node scripts/monitor-emails.js --details af4d8d6d-fe59-45ad-b8aa-9bf6a5b29105');
  process.exit(0);
}

monitorEmails().catch(console.error);
