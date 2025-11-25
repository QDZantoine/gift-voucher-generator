#!/usr/bin/env node

/**
 * Script de migration de SQLite vers PostgreSQL (Prisma.io)
 * 
 * Ce script :
 * 1. Exporte les données de SQLite en utilisant better-sqlite3
 * 2. Convertit les types (booléens, dates) pour PostgreSQL
 * 3. Importe les données dans PostgreSQL via Prisma
 * 
 * Prérequis :
 * - Avoir configuré DATABASE_URL avec la connection string PostgreSQL directe de Prisma.io
 * - Avoir exécuté `npx prisma db push` pour créer les tables
 * - Installer better-sqlite3: npm install better-sqlite3
 * 
 * Usage:
 *   npm run migrate-to-postgres
 */

import { PrismaClient } from '../lib/generated/prisma/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SQLITE_DB_PATH = path.join(__dirname, '..', 'prisma', 'dev.db');
const BACKUP_DIR = path.join(__dirname, '..', 'prisma', 'backups');

// Créer le dossier de backup s'il n'existe pas
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🚀 Migration SQLite → PostgreSQL (Prisma.io)\n');

// Vérifier que le fichier SQLite existe
if (!fs.existsSync(SQLITE_DB_PATH)) {
  console.error(`❌ Erreur: Le fichier SQLite n'existe pas: ${SQLITE_DB_PATH}`);
  process.exit(1);
}

/**
 * Convertit les données SQLite en format compatible PostgreSQL/Prisma
 */
function convertSQLiteToPostgres(data, modelType) {
  const converted = { ...data };
  
  // Convertir les booléens (SQLite stocke 0/1, PostgreSQL attend true/false)
  const booleanFields = {
    User: ['emailVerified'],
    GiftCard: ['isUsed', 'createdOnline', 'emailSent'],
    ExclusionPeriod: ['isActive', 'isRecurring'],
  };
  
  if (booleanFields[modelType]) {
    for (const field of booleanFields[modelType]) {
      if (converted[field] !== null && converted[field] !== undefined) {
        converted[field] = Boolean(converted[field]);
      }
    }
  }
  
  // Convertir les dates (SQLite stocke des timestamps en millisecondes)
  const dateFields = {
    User: ['createdAt', 'updatedAt'],
    Session: ['expiresAt', 'createdAt', 'updatedAt'],
    Account: ['accessTokenExpiresAt', 'refreshTokenExpiresAt', 'createdAt', 'updatedAt'],
    Verification: ['expiresAt', 'createdAt'],
    GiftCard: ['purchaseDate', 'expiryDate', 'usedAt', 'createdAt'],
    ExclusionPeriod: ['startDate', 'endDate', 'createdAt', 'updatedAt'],
  };
  
  if (dateFields[modelType]) {
    for (const field of dateFields[modelType]) {
      if (converted[field] !== null && converted[field] !== undefined) {
        // Si c'est un nombre (timestamp), le convertir en Date
        if (typeof converted[field] === 'number') {
          converted[field] = new Date(converted[field]);
        } else if (typeof converted[field] === 'string') {
          // Si c'est une string, essayer de la parser
          const parsed = new Date(converted[field]);
          if (!isNaN(parsed.getTime())) {
            converted[field] = parsed;
          }
        }
      }
    }
  }
  
  return converted;
}

/**
 * Exporte les données depuis SQLite
 */
async function exportFromSQLite() {
  console.log('📊 Étape 1: Export des données depuis SQLite...\n');
  
  try {
    // Vérifier que better-sqlite3 est installé
    let Database;
    try {
      const betterSqlite3 = await import('better-sqlite3');
      Database = betterSqlite3.default;
    } catch (e) {
      console.error('❌ Erreur: better-sqlite3 n\'est pas installé');
      console.error('   Installez-le avec: npm install better-sqlite3');
      process.exit(1);
    }

    const db = new Database(SQLITE_DB_PATH, { readonly: true });

    // Exporter toutes les tables
    const users = db.prepare('SELECT * FROM User').all();
    const sessions = db.prepare('SELECT * FROM Session').all();
    const accounts = db.prepare('SELECT * FROM Account').all();
    const verifications = db.prepare('SELECT * FROM Verification').all();
    const giftCards = db.prepare('SELECT * FROM GiftCard').all();
    const exclusionPeriods = db.prepare('SELECT * FROM ExclusionPeriod').all();

    db.close();

    console.log(`✅ Exporté ${users.length} utilisateurs`);
    console.log(`✅ Exporté ${sessions.length} sessions`);
    console.log(`✅ Exporté ${accounts.length} comptes`);
    console.log(`✅ Exporté ${verifications.length} vérifications`);
    console.log(`✅ Exporté ${giftCards.length} bons cadeaux`);
    console.log(`✅ Exporté ${exclusionPeriods.length} périodes d'exclusion\n`);

    // Sauvegarder les données exportées
    const backupFile = path.join(BACKUP_DIR, `backup-${Date.now()}.json`);
    const backupData = {
      exportedAt: new Date().toISOString(),
      users,
      sessions,
      accounts,
      verifications,
      giftCards,
      exclusionPeriods,
    };
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`💾 Backup sauvegardé: ${backupFile}\n`);
    
    return backupData;
  } catch (error) {
    console.error('❌ Erreur lors de l\'export SQLite:', error);
    throw error;
  }
}

/**
 * Importe les données dans PostgreSQL
 */
async function importToPostgres(backupData) {
  console.log('📥 Étape 2: Import des données vers PostgreSQL...\n');
  
  // Vérifier que DATABASE_URL est configuré pour PostgreSQL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Erreur: DATABASE_URL n\'est pas défini dans les variables d\'environnement');
    console.error('   Veuillez configurer DATABASE_URL avec votre connection string PostgreSQL');
    process.exit(1);
  }

  // Nettoyer la connection string
  const cleanUrl = databaseUrl.trim().replace(/^["']|["']$/g, '');

  // Accepter les deux formats : PostgreSQL direct et Accelerate
  if (!cleanUrl.startsWith('postgresql://') && 
      !cleanUrl.startsWith('postgres://') && 
      !cleanUrl.startsWith('prisma+postgres://')) {
    console.error('❌ Erreur: DATABASE_URL doit pointer vers une base PostgreSQL');
    console.error('   Format attendu: postgresql://... ou prisma+postgres://...');
    console.error(`   Valeur actuelle commence par: ${cleanUrl.substring(0, 30)}...`);
    process.exit(1);
  }

  // Avertir si on utilise Accelerate (mais continuer quand même)
  if (cleanUrl.startsWith('prisma+postgres://')) {
    console.log('⚠️  Vous utilisez la connection Accelerate.');
    console.log('   Le script va fonctionner, mais pour de meilleures performances de migration,');
    console.log('   vous pouvez utiliser la connection PostgreSQL directe.\n');
  }

  // Créer le client Prisma
  // Si c'est Accelerate, utiliser l'extension, sinon client standard
  let postgresClient;
  
  if (cleanUrl.startsWith('prisma+postgres://')) {
    // Pour Accelerate, on doit utiliser le client standard mais avec la connection Accelerate
    // Prisma 6.19+ supporte Accelerate pour les opérations de migration
    const { withAccelerate } = await import('@prisma/extension-accelerate');
    const baseClient = new PrismaClient({
      datasources: {
        db: {
          url: cleanUrl,
        },
      },
    });
    postgresClient = baseClient.$extends(withAccelerate());
  } else {
    postgresClient = new PrismaClient({
      datasources: {
        db: {
          url: cleanUrl,
        },
      },
    });
  }

  try {
    // Tester la connexion
    await postgresClient.$connect();
    console.log('✅ Connexion à PostgreSQL établie\n');

    // Importer dans PostgreSQL (dans l'ordre des dépendances)
    if (backupData.users.length > 0) {
      console.log('Import des utilisateurs...');
      for (const user of backupData.users) {
        const convertedUser = convertSQLiteToPostgres(user, 'User');
        await postgresClient.user.upsert({
          where: { id: convertedUser.id },
          update: convertedUser,
          create: convertedUser,
        });
      }
      console.log(`✅ ${backupData.users.length} utilisateurs importés\n`);
    }

    if (backupData.accounts.length > 0) {
      console.log('Import des comptes...');
      for (const account of backupData.accounts) {
        const convertedAccount = convertSQLiteToPostgres(account, 'Account');
        await postgresClient.account.upsert({
          where: { id: convertedAccount.id },
          update: convertedAccount,
          create: convertedAccount,
        });
      }
      console.log(`✅ ${backupData.accounts.length} comptes importés\n`);
    }

    if (backupData.sessions.length > 0) {
      console.log('Import des sessions...');
      for (const session of backupData.sessions) {
        const convertedSession = convertSQLiteToPostgres(session, 'Session');
        await postgresClient.session.upsert({
          where: { id: convertedSession.id },
          update: convertedSession,
          create: convertedSession,
        });
      }
      console.log(`✅ ${backupData.sessions.length} sessions importées\n`);
    }

    if (backupData.verifications.length > 0) {
      console.log('Import des vérifications...');
      for (const verification of backupData.verifications) {
        const convertedVerification = convertSQLiteToPostgres(verification, 'Verification');
        await postgresClient.verification.upsert({
          where: {
            identifier_value: {
              identifier: convertedVerification.identifier,
              value: convertedVerification.value,
            },
          },
          update: convertedVerification,
          create: convertedVerification,
        });
      }
      console.log(`✅ ${backupData.verifications.length} vérifications importées\n`);
    }

    if (backupData.giftCards.length > 0) {
      console.log('Import des bons cadeaux...');
      for (const giftCard of backupData.giftCards) {
        const convertedGiftCard = convertSQLiteToPostgres(giftCard, 'GiftCard');
        await postgresClient.giftCard.upsert({
          where: { id: convertedGiftCard.id },
          update: convertedGiftCard,
          create: convertedGiftCard,
        });
      }
      console.log(`✅ ${backupData.giftCards.length} bons cadeaux importés\n`);
    }

    if (backupData.exclusionPeriods.length > 0) {
      console.log('Import des périodes d\'exclusion...');
      for (const exclusionPeriod of backupData.exclusionPeriods) {
        const convertedExclusionPeriod = convertSQLiteToPostgres(exclusionPeriod, 'ExclusionPeriod');
        await postgresClient.exclusionPeriod.upsert({
          where: { id: convertedExclusionPeriod.id },
          update: convertedExclusionPeriod,
          create: convertedExclusionPeriod,
        });
      }
      console.log(`✅ ${backupData.exclusionPeriods.length} périodes d'exclusion importées\n`);
    }

    await postgresClient.$disconnect();
  } catch (error) {
    console.error('❌ Erreur lors de l\'import PostgreSQL:', error);
    await postgresClient.$disconnect();
    throw error;
  }
}

// Exécuter la migration
async function migrate() {
  try {
    // Étape 1: Exporter depuis SQLite
    const backupData = await exportFromSQLite();
    
    // Étape 2: Importer vers PostgreSQL
    await importToPostgres(backupData);
    
    console.log('✨ Migration terminée avec succès!\n');
    console.log('📝 Prochaines étapes:');
    console.log('   1. Vérifiez les données dans Prisma Studio: npm run db:studio');
    console.log('   2. Testez votre application: npm run dev');
    console.log('   3. Une fois validé, vous pouvez supprimer le fichier SQLite si vous le souhaitez\n');
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

migrate();

