#!/usr/bin/env node

"use strict";

#!/usr/bin/env node

// Note: Ce script nécessite que le serveur Next.js soit en cours d'exécution
// Utilisez plutôt l'interface web : http://localhost:3000/dashboard/pdf-preview

import fs from "fs";
import path from "path";

console.log('📄 Script de prévisualisation PDF');
console.log('');
console.log('⚠️  Ce script nécessite le serveur Next.js en cours d\'exécution.');
console.log('');
console.log('🚀 Alternatives recommandées :');
console.log('1. Interface web : http://localhost:3000/dashboard/pdf-preview');
console.log('2. API directe : POST http://localhost:3000/api/pdf/preview');
console.log('');
console.log('💡 Pour utiliser l\'interface web :');
console.log('1. Démarrez le serveur : npm run dev');
console.log('2. Allez sur : http://localhost:3000/dashboard/pdf-preview');
console.log('3. Modifiez les données et cliquez sur "Prévisualiser"');
console.log('');

// Fonction de test simple
async function testPDFGeneration() {
  console.log('🧪 Test de génération PDF via API...');
  
  const testData = {
    code: 'INF-TEST-1234',
    productType: 'Menu Influences',
    numberOfPeople: 2,
    recipientName: 'Jean Dupont',
    amount: 90,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseDate: new Date().toISOString(),
  };

  try {
    const response = await fetch('http://localhost:3000/api/pdf/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const pdfBuffer = await response.arrayBuffer();
      const outputPath = path.join(process.cwd(), 'public', 'test-pdf.pdf');
      fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
      console.log('✅ PDF généré avec succès !');
      console.log(`📁 Fichier : ${outputPath}`);
      console.log(`🌐 URL : http://localhost:3000/test-pdf.pdf`);
    } else {
      console.log('❌ Erreur : Serveur non disponible ou erreur API');
      console.log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)');
    }
  } catch (error) {
    console.log('❌ Erreur de connexion :', error.message);
    console.log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)');
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testPDFGeneration();
}

module.exports = { testPDFGeneration };
