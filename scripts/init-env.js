#!/usr/bin/env node

"use strict";

import fs from "fs";
import path from "path";
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env');

// Vérifier si le fichier .env existe déjà
if (fs.existsSync(envPath)) {
  console.log('⚠️  Le fichier .env existe déjà');
  process.exit(0);
}

// Générer un secret aléatoire
const secret = crypto.randomBytes(32).toString('base64');

// Contenu du fichier .env
const envContent = `DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="${secret}"
`;

// Écrire le fichier .env
fs.writeFileSync(envPath, envContent);
console.log('✅ Fichier .env créé avec succès!');
console.log('🔑 Secret généré automatiquement');


