# 🎁 Influences - Système de Gestion de Bons Cadeaux

Application web complète pour gérer les bons cadeaux du restaurant Influences, avec paiement en ligne via Stripe et système d'administration.

---

## 📋 Table des matières

- [🚀 Démarrage rapide](#-démarrage-rapide)
- [✅ Configuration terminée](#-configuration-terminée)
- [🔐 Compte admin par défaut](#-compte-admin-par-défaut)
- [📱 Navigation du dashboard](#-navigation-du-dashboard)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Commandes utiles](#️-commandes-utiles)
- [📊 Modèles de données](#-modèles-de-données)
- [🔜 Roadmap](#-roadmap)
- [🐛 Dépannage](#-dépannage)
- [📝 Variables d'environnement](#-variables-denvironnement)

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js 18+** 
- **npm** ou **pnpm**

### Installation en 3 étapes

#### 1. Installer les dépendances

```bash
cd influences
npm install
```

#### 2. Configurer l'environnement

Créez un fichier `.env` à la racine :

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="votre-secret-aleatoire"
```

💡 **Générer un secret sécurisé** :
```bash
openssl rand -base64 32
```

Ou utiliser le script automatique :
```bash
npm run init-env
```

#### 3. Initialiser la base de données

```bash
npx prisma generate
npx prisma migrate deploy
```

#### 4. Créer votre compte admin

```bash
npm run create-admin admin@influences.com MotDePasse123 "Votre Nom"
```

#### 5. Lancer l'application

```bash
npm run dev
```

✅ **L'application est maintenant accessible sur** : [http://localhost:3000](http://localhost:3000)

---

## ✅ Configuration terminée

Votre application est configurée avec :

- ✅ **BetterAuth** - Authentification sécurisée
- ✅ **Prisma** - ORM avec base de données SQLite
- ✅ **Next.js 15** - Framework React avec App Router
- ✅ **Shadcn/UI** - Composants UI modernes
- ✅ **Tailwind CSS** - Styling utilitaire
- ✅ **TypeScript** - Typage statique

---

## 🔐 Compte admin par défaut

Si vous avez utilisé le script de création d'admin par défaut :

- **Email** : `admin@influences.com`
- **Mot de passe** : `AdminPassword123`

> ⚠️ **Important** : Changez ce mot de passe après votre première connexion !

---

## 📱 Navigation du dashboard

### Pages disponibles

| Page | Route | Status |
|------|-------|--------|
| 🏠 Vue d'ensemble | `/dashboard` | ✅ Opérationnel |
| 🎁 Bons cadeaux | `/dashboard/gift-cards` | ✅ Opérationnel |
| ✅ Validation | `/dashboard/validation` | ✅ Opérationnel |
| 📊 Historique validations | `/dashboard/validation/history` | ✅ Opérationnel |
| 📅 Périodes d'exclusion | `/dashboard/exclusion-periods` | ✅ Opérationnel |
| ⚙️ Paramètres | `/dashboard/settings` | 🔄 À venir |

### Fonctionnalités actuelles

✅ **Authentification complète**
- Inscription de nouveaux admins
- Connexion sécurisée avec email/mot de passe
- Déconnexion
- Protection automatique des routes
- Gestion des sessions (7 jours)

✅ **Dashboard administrateur**
- Interface moderne avec sidebar responsive
- Header avec menu utilisateur
- Vue d'ensemble avec statistiques
- Navigation fluide entre les pages

✅ **Gestion des bons cadeaux**
- Liste complète avec filtres et recherche
- Création de bons au restaurant
- Visualisation détaillée des bons
- Validation et suppression
- Génération de codes uniques

✅ **Périodes d'exclusion**
- Gestion CRUD complète
- Périodes ponctuelles ou récurrentes (annuelles)
- Validation de chevauchement de dates
- Détection automatique des périodes en cours

✅ **Validation de bons au restaurant**
- Recherche par code unique
- Vérification automatique de la validité
- Détection des périodes d'exclusion
- Avertissements d'expiration imminente
- Confirmation de validation sécurisée
- Historique complet des validations

---

## 🏗️ Architecture

### Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| **Framework** | Next.js 15 (App Router) |
| **UI** | Tailwind CSS + shadcn/ui |
| **Base de données** | Prisma + SQLite (dev) / PostgreSQL (prod) |
| **Authentification** | BetterAuth |
| **Paiement** | Stripe (à venir) |
| **Emails** | Resend ou SendGrid (à venir) |
| **Icônes** | Lucide React |
| **Validation** | Zod |

### Structure du projet

```
influences/
├── app/
│   ├── (auth)/                      # Pages d'authentification
│   │   ├── login/                   # Page de connexion
│   │   └── register/                # Page d'inscription
│   ├── dashboard/                   # Dashboard admin
│   │   ├── layout.tsx               # Layout avec sidebar
│   │   ├── page.tsx                 # Vue d'ensemble
│   │   ├── gift-cards/              # Gestion bons cadeaux
│   │   │   ├── page.tsx             # Liste des bons
│   │   │   └── create/page.tsx      # Création bon
│   │   ├── exclusion-periods/       # Périodes d'exclusion
│   │   │   ├── page.tsx             # Liste des périodes
│   │   │   ├── create/page.tsx      # Création période
│   │   │   └── [id]/edit/page.tsx   # Édition période
│   │   └── validation/              # Validation de bons
│   │       ├── page.tsx             # Page de validation
│   │       └── history/page.tsx     # Historique validations
│   ├── (public)/                    # Pages publiques (sans auth)
│   │   ├── layout.tsx               # Layout public
│   │   ├── order/page.tsx           # Commande en ligne
│   │   ├── success/page.tsx         # Confirmation paiement
│   │   └── cancel/page.tsx          # Annulation paiement
│   ├── api/                         # Routes API
│   │   ├── auth/[...all]/           # API BetterAuth
│   │   ├── gift-cards/              # API Bons cadeaux
│   │   │   ├── route.ts             # GET, POST
│   │   │   ├── [id]/route.ts        # GET, PATCH, DELETE
│   │   │   └── validate/route.ts    # GET (vérification)
│   │   ├── exclusion-periods/       # API Périodes
│   │   │   ├── route.ts             # GET, POST
│   │   │   └── [id]/route.ts        # GET, PATCH, DELETE
│   │   ├── checkout/                # API Stripe
│   │   │   ├── create-session/route.ts  # POST (créer session)
│   │   │   └── session/route.ts     # GET (détails session)
│   │   └── webhooks/
│   │       └── stripe/route.ts      # POST (webhook Stripe)
│   ├── layout.tsx                   # Layout principal
│   └── page.tsx                     # Redirection vers dashboard
│
├── components/
│   ├── dashboard/                   # Composants dashboard
│   │   ├── sidebar.tsx              # Navigation principale
│   │   └── header.tsx               # Header avec menu user
│   ├── gift-cards/                  # Composants bons cadeaux
│   │   ├── gift-card-table.tsx      # Tableau des bons
│   │   ├── gift-card-filters.tsx    # Filtres
│   │   ├── gift-card-create-form.tsx# Formulaire création
│   │   └── gift-card-details-dialog.tsx # Modal détails
│   ├── exclusion-periods/           # Composants périodes
│   │   ├── exclusion-period-table.tsx   # Tableau périodes
│   │   ├── exclusion-period-filters.tsx # Filtres
│   │   └── exclusion-period-form.tsx    # Formulaire
│   ├── validation/                  # Composants validation
│   │   └── gift-card-validation-card.tsx # Card validation
│   └── ui/                          # Composants shadcn/ui
│
├── lib/
│   ├── auth.ts                      # Config BetterAuth serveur
│   ├── auth-client.ts               # Client BetterAuth
│   ├── prisma.ts                    # Client Prisma singleton
│   ├── stripe.ts                    # Config Stripe + prix menus
│   ├── utils.ts                     # Utilitaires
│   ├── types/                       # Types TypeScript
│   │   ├── gift-card.ts             # Types bons cadeaux
│   │   └── exclusion-period.ts      # Types périodes
│   ├── validations/                 # Schémas Zod
│   │   ├── gift-card.ts             # Validation bons
│   │   └── exclusion-period.ts      # Validation périodes
│   └── utils/
│       └── code-generator.ts        # Génération codes uniques
│
├── prisma/
│   ├── schema.prisma                # Schéma de BDD
│   ├── migrations/                  # Migrations
│   └── dev.db                       # SQLite (dev)
│
├── scripts/
│   ├── create-admin.ts              # Créer un admin
│   ├── init-env.js                  # Init fichier .env
│   └── setup.sh                     # Setup complet
│
├── middleware.ts                    # Protection routes
├── .env                             # Variables d'env
└── package.json                     # Dépendances
```

---

## 🛠️ Commandes utiles

### Développement

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run start        # Démarrer le serveur de production
npm run lint         # Vérifier le code (ESLint)
```

### Base de données

```bash
npm run db:studio    # Interface visuelle Prisma Studio
npm run db:migrate   # Créer une nouvelle migration
npm run db:generate  # Générer le client Prisma
npm run db:push      # Synchroniser le schéma (dev uniquement)
```

### Scripts personnalisés

```bash
# Initialiser le fichier .env
npm run init-env

# Créer un nouvel administrateur
npm run create-admin <email> <password> <nom>

# Configurer Resend pour les emails
node scripts/configure-resend.js

# Tester le système d'email avec bonnes pratiques
node scripts/test-email-best-practices.js

# Test final du système d'email
node scripts/test-final-email.js

# Monitoring des emails envoyés
node scripts/monitor-emails.js

# Prévisualiser un PDF de bon cadeau
node scripts/preview-pdf.js

# Nettoyer le projet
node scripts/cleanup.js

# Exemple :
npm run create-admin chef@influences.com ChefPass123 "Chef Cuisinier"
```

---

## 🧹 Nettoyage du Projet

Le projet a été nettoyé pour ne garder que les fichiers essentiels :

### ✅ Fichiers conservés

**Scripts essentiels :**
- `configure-resend.js` - Configuration de l'API Resend
- `test-email-best-practices.js` - Tests des bonnes pratiques
- `test-final-email.js` - Test final du système
- `monitor-emails.js` - Monitoring des emails
- `preview-pdf.js` - Prévisualisation PDF
- `cleanup.js` - Nettoyage du projet
- `create-admin.ts` - Création d'admin
- `init-env.js` - Initialisation environnement

**API routes conservées :**
- `/api/email/send-gift-card/` - Envoi d'emails avec bonnes pratiques
- `/api/pdf/preview/` - Prévisualisation PDF
- Toutes les autres routes fonctionnelles

### ❌ Fichiers supprimés

- Scripts de test obsolètes (test-email.js, test-email-demo.js, etc.)
- Dossiers API de test PDF (minimal, puppeteer, simple, test)
- Documentation redondante (EMAIL_SETUP_GUIDE.md, DOMAIN_SETUP_GUIDE.md)
- Fichiers temporaires dans public/
- Dossier docs/ vide

### 🚀 Commandes de nettoyage

```bash
# Nettoyer le projet
node scripts/cleanup.js

# Vérifier que tout fonctionne
npm run build

# Réinstaller les dépendances si nécessaire
npm install
```

---

## 📧 Phase 6 : Système d'Email avec PDF

### Configuration Resend

1. **Créer un compte Resend** :
   - Allez sur [https://resend.com](https://resend.com)
   - Créez un compte gratuit (3 000 emails/mois)

2. **Générer une clé API** :
   - Dans le dashboard Resend, allez dans "API Keys"
   - Créez une nouvelle clé API
   - Copiez la clé (format : `re_...`)

3. **Configurer l'environnement** :
   ```bash
   npm run setup-email
   ```
   Puis ajoutez votre clé dans `.env` :
   ```env
   RESEND_API_KEY="re_votre_cle_ici"
   ```

### Fonctionnalités Email

- ✅ **Template HTML élégant** avec la charte graphique du restaurant
- ✅ **PDF automatique** généré avec @react-pdf/renderer
- ✅ **Envoi automatique** après paiement Stripe réussi
- ✅ **Suivi des emails** dans le dashboard admin
- ✅ **Gestion des erreurs** avec retry possible

### Test du système

```bash
# Tester l'envoi d'email
npm run test-email
```

### Structure des emails

- **Sujet** : `🎁 Votre bon cadeau Restaurant Influences - INF-XXXX-XXXX`
- **Contenu** : Template HTML responsive avec détails du bon cadeau
- **Pièce jointe** : PDF du bon cadeau (format A4, design professionnel)

---

## 📊 Modèles de données

### User (Administrateur)

```typescript
{
  id: string              // ID unique (cuid)
  email: string           // Email unique
  password: string        // Mot de passe hashé (bcrypt)
  name: string            // Nom complet
  role: "admin"           // Rôle (admin par défaut)
  emailVerified: boolean  // Email vérifié
  createdAt: DateTime     // Date de création
  updatedAt: DateTime     // Dernière mise à jour
  
  // Relations
  sessions: Session[]     // Sessions actives
  accounts: Account[]     // Comptes OAuth (futur)
  giftCards: GiftCard[]   // Bons créés au restaurant
}
```

### Session

```typescript
{
  id: string              // ID unique
  userId: string          // ID utilisateur
  token: string           // Token de session unique
  expiresAt: DateTime     // Date d'expiration
  ipAddress: string?      // IP de connexion
  userAgent: string?      // Navigateur utilisé
  createdAt: DateTime
  updatedAt: DateTime
}
```

### GiftCard (Bon Cadeau)

```typescript
{
  id: string              // ID unique
  code: string            // Code unique du bon (ex: INF-XXXX-XXXX)
  productType: string     // Type de menu (influences, dégustation, etc.)
  numberOfPeople: number  // Nombre de personnes
  recipientName: string   // Nom du destinataire
  recipientEmail: string  // Email du destinataire
  purchaserName: string   // Nom de l'acheteur
  purchaserEmail: string  // Email de l'acheteur
  amount: number          // Montant en euros
  purchaseDate: DateTime  // Date d'achat
  expiryDate: DateTime    // Date d'expiration
  isUsed: boolean         // Utilisé ou non
  usedAt: DateTime?       // Date d'utilisation
  createdBy: string?      // ID admin (si créé au restaurant)
  createdOnline: boolean  // true si acheté en ligne
  stripePaymentId: string?// ID paiement Stripe
  createdAt: DateTime
}
```

### ExclusionPeriod (Période d'Exclusion)

```typescript
{
  id: string              // ID unique
  name: string            // Nom (ex: "Noël", "Feria de Bayonne")
  description: string?    // Description optionnelle
  startDate: DateTime     // Date de début
  endDate: DateTime       // Date de fin
  isRecurring: boolean    // Période récurrente ou non
  recurringType: string?  // Type de récurrence ("yearly", "none")
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 🔜 Roadmap

### ✅ Phase 1 - Authentification Admin (TERMINÉ)

- [x] Configuration BetterAuth
- [x] Base de données Prisma (SQLite)
- [x] Pages de connexion et inscription
- [x] Dashboard admin avec sidebar
- [x] Protection des routes avec middleware
- [x] Gestion des sessions

### ✅ Phase 2 - Gestion des Bons Cadeaux (TERMINÉ)

- [x] **Page de liste des bons**
  - Tableau complet avec tous les bons
  - Filtres (actifs, utilisés, expirés)
  - Recherche par code ou email
  - Pagination
  - Actions (voir, valider, supprimer)

- [x] **Création de bons au restaurant**
  - Formulaire de création complet
  - Sélection du type de menu (4 menus disponibles)
  - Calcul automatique du montant
  - Génération de code unique (format INF-XXXX-XXXX)
  - Calcul automatique de la date d'expiration (1 an)
  - Validation avec Zod

- [x] **API Backend**
  - Routes CRUD complètes pour les bons
  - GET /api/gift-cards (liste avec filtres et pagination)
  - POST /api/gift-cards (création)
  - GET /api/gift-cards/[id] (détails)
  - PATCH /api/gift-cards/[id] (validation)
  - DELETE /api/gift-cards/[id] (suppression)
  - Validation des données (Zod)
  - Génération de codes uniques sécurisés
  - Gestion des erreurs complète

### ✅ Phase 3 - Périodes d'Exclusion (TERMINÉ)

- [x] **Page de liste des périodes**
  - Tableau complet avec toutes les périodes
  - Filtres (récurrentes, ponctuelles)
  - Recherche par nom
  - Pagination
  - Statut visuel (en cours, à venir, passée)

- [x] **Création et modification de périodes**
  - Formulaire complet de création/édition
  - Périodes ponctuelles ou récurrentes (annuelles)
  - Validation des dates (fin > début)
  - Description optionnelle

- [x] **API Backend**
  - Routes CRUD complètes pour les périodes
  - GET /api/exclusion-periods (liste avec filtres)
  - POST /api/exclusion-periods (création)
  - GET /api/exclusion-periods/[id] (détails)
  - PATCH /api/exclusion-periods/[id] (modification)
  - DELETE /api/exclusion-periods/[id] (suppression)
  - Validation anti-chevauchement de dates
  - Fonction utilitaire pour vérifier si une date est exclue

### ✅ Phase 4 - Validation de Bons (TERMINÉ)

- [x] **Page de validation**
  - Recherche manuelle par code
  - Interface de saisie claire et intuitive
  - Affichage des résultats en temps réel

- [x] **Vérification de validité**
  - Vérification si déjà utilisé
  - Vérification de la date d'expiration
  - Vérification des périodes d'exclusion
  - Avertissements pour expiration proche (< 30 jours)
  - Messages d'erreur explicites

- [x] **Processus de validation**
  - Affichage complet des détails du bon
  - Confirmation de validation sécurisée
  - Marquage comme utilisé avec date/heure
  - Feedback visuel (succès/erreur)

- [x] **Historique des validations**
  - Liste de tous les bons validés
  - Recherche et filtrage
  - Pagination
  - Détails complets de chaque validation

- [x] **API Backend**
  - GET /api/gift-cards/validate?code=XXX (vérification)
  - Intégration automatique des périodes d'exclusion
  - Validation multi-critères

### ✅ Phase 5 - Achat en Ligne avec Stripe (TERMINÉ)

- [x] **Page publique de commande** (`/order`)
  - Catalogue des 4 menus disponibles avec prix
  - Sélection du nombre de personnes (1-20)
  - Formulaire destinataire du bon
  - Formulaire acheteur (facturation)
  - Calcul automatique du montant total
  - Design responsive et attractif

- [x] **Intégration Stripe Checkout**
  - Configuration Stripe avec TypeScript
  - Création de sessions de paiement sécurisées
  - Redirection vers Stripe Checkout
  - Support carte bancaire
  - Gestion des métadonnées de commande

- [x] **Webhooks Stripe**
  - Endpoint webhook sécurisé (`/api/webhooks/stripe`)
  - Vérification de signature Stripe
  - Création automatique du bon après paiement réussi
  - Génération de code unique
  - Stockage de l'ID de paiement Stripe

- [x] **Pages de confirmation**
  - Page de succès (`/success`) avec récapitulatif
  - Page d'annulation (`/cancel`)
  - Affichage des détails de commande
  - Liens de retour et nouvelle commande

- [x] **API Backend**
  - POST /api/checkout/create-session (création session)
  - GET /api/checkout/session (récupération détails)
  - POST /api/webhooks/stripe (traitement paiement)
  - Validation complète des données (Zod)

### 📧 Phase 6 - Emails & PDF

- [ ] **Templates d'emails**
  - Email de confirmation d'achat
  - Email avec PDF du bon cadeau
  - Rappels d'expiration
  - Design professionnel

- [ ] **Génération PDF**
  - Template de bon cadeau
  - QR code pour validation
  - Informations de contact
  - Branding restaurant

---

## 🐛 Dépannage

### Le serveur ne démarre pas

**Solution** :
1. Vérifiez que le port 3000 est libre
2. Régénérez le client Prisma :
   ```bash
   npm run db:generate
   ```
3. Redémarrez le serveur :
   ```bash
   npm run dev
   ```

### Erreur de base de données

**Solution** :
```bash
# Réinitialiser la BDD (DEV uniquement !)
rm prisma/dev.db
npx prisma migrate dev
npm run create-admin
```

### Erreur d'authentification

**Causes possibles** :
1. `BETTER_AUTH_SECRET` non défini dans `.env`
2. Cookies expirés ou invalides

**Solution** :
1. Vérifiez votre fichier `.env`
2. Redémarrez le serveur après modification
3. Videz les cookies du navigateur
4. Reconnectez-vous

### Erreur "Edge Runtime"

Si vous voyez une erreur concernant Edge Runtime :
- Le middleware a été optimisé pour ne pas charger Prisma
- Redémarrez simplement le serveur

### Problème d'affichage

**Solution** :
```bash
# Vider le cache Next.js
rm -rf .next
# Redémarrer
npm run dev
```

### Erreur lors de la migration

```bash
# Réinitialiser les migrations (DEV uniquement !)
rm -rf prisma/migrations
rm prisma/dev.db
npx prisma migrate dev --name init
```

---

## 📝 Variables d'environnement

### Développement (.env)

```env
# Base de données
DATABASE_URL="file:./dev.db"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentification
BETTER_AUTH_SECRET="votre-secret-aleatoire-ici"

# Stripe (Phase 5 - Paiement en ligne)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Production (.env.production)

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Application
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"

# Authentification
BETTER_AUTH_SECRET="secret-production-tres-securise"

# Stripe (Phase 5)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Phase 6)
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASSWORD="votre-api-key"
EMAIL_FROM="noreply@influences.com"
```

---

## 🔐 Sécurité

### Mesures en place

- ✅ Authentification sécurisée avec BetterAuth
- ✅ Hashage des mots de passe avec bcrypt (10 rounds)
- ✅ Protection CSRF automatique
- ✅ Sessions sécurisées avec tokens uniques
- ✅ Middleware de protection des routes
- ✅ Validation des données avec Zod

### Pour la production

**À configurer avant le déploiement** :

1. **Base de données**
   - Migrer vers PostgreSQL
   - Configurer les backups automatiques
   - Indexer les champs de recherche

2. **Authentification**
   - Activer la vérification d'email
   - Ajouter 2FA (plugin BetterAuth disponible)
   - Configurer OAuth (Google, etc.)

3. **API**
   - Configurer CORS strictement
   - Implémenter rate limiting
   - Ajouter logging des erreurs

4. **Performance**
   - Mettre en cache les statistiques
   - Optimiser les requêtes Prisma
   - Utiliser un CDN pour les assets

---

## 📞 Support & Documentation

### Commandes d'aide

```bash
# Ouvrir Prisma Studio (interface BDD)
npm run db:studio

# Voir les logs détaillés
npm run dev -- --debug

# Vérifier le schéma Prisma
npx prisma validate
```

### Ressources utiles

- [Documentation Next.js 15](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation BetterAuth](https://better-auth.com)
- [Documentation Shadcn/ui](https://ui.shadcn.com)
- [Documentation Stripe](https://stripe.com/docs)

---

## 🎉 Félicitations !

Votre système de gestion de bons cadeaux est opérationnel ! 

### Configuration Stripe (Phase 5)

Pour activer l'achat en ligne, configurez Stripe :

1. **Créez un compte Stripe** : [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)

2. **Récupérez vos clés API** :
   - Mode test : Dashboard → Developers → API keys
   - Copiez la "Publishable key" et la "Secret key"

3. **Ajoutez les variables d'environnement** :
```bash
# .env
STRIPE_SECRET_KEY="sk_test_votre_cle_secrete"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_votre_cle_publique"
```

4. **Configurez le webhook** (pour la production) :
   - Dashboard → Developers → Webhooks
   - Ajoutez l'endpoint : `https://votre-domaine.com/api/webhooks/stripe`
   - Événements à écouter : `checkout.session.completed`
   - Copiez le "Signing secret" → `STRIPE_WEBHOOK_SECRET`

5. **Test en local avec Stripe CLI** :
```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Transférer les webhooks en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Prochaines étapes

1. ✅ Connectez-vous au dashboard : [http://localhost:3000](http://localhost:3000)
2. ✅ Explorez l'interface admin
3. ✅ Gérez les bons cadeaux et périodes d'exclusion
4. ✅ Validez les bons au restaurant
5. ✅ Testez l'achat en ligne : [http://localhost:3000/order](http://localhost:3000/order)
6. 🔄 Développez la Phase 6 : Emails & PDF

---

## 📄 Licence

**Propriétaire** - Restaurant Influences

---

<div align="center">

**Développé avec ❤️ pour le Restaurant Influences**

[Démarrer](#-démarrage-rapide) • [Architecture](#️-architecture) • [Roadmap](#-roadmap)

</div>
