# 🐳 Déploiement Docker sur Coolify

Ce guide explique comment déployer l'application Influences sur votre VPS avec Coolify en utilisant le Dockerfile fourni.

## 📋 Prérequis

- Un VPS avec Coolify installé
- Une base de données PostgreSQL configurée
- Les variables d'environnement configurées dans Coolify

## 🚀 Configuration dans Coolify

### 1. Créer un nouveau projet

1. Connectez-vous à votre instance Coolify
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Ajoutez une nouvelle ressource de type "Application"

### 2. Configuration du déploiement

#### Source du code
- **Type** : Git Repository
- **Repository** : URL de votre dépôt Git
- **Branch** : `main` (ou votre branche de production)

#### Build Pack
- **Type** : Dockerfile
- Coolify détectera automatiquement le `Dockerfile` à la racine

### 3. Variables d'environnement

Ajoutez toutes les variables nécessaires dans l'onglet "Environment Variables" :

```env
# Environnement
NODE_ENV=production
CI=true
PRISMA_GENERATE_NO_ENGINE=true

# Base de données PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://user:password@host:5432/database

# Authentification
BETTER_AUTH_SECRET=votre_secret_aleatoire_minimum_32_caracteres
BETTER_AUTH_URL=https://votre-domaine.com
NEXT_PUBLIC_APP_URL=https://votre-domaine.com

# Email (Resend)
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
EMAIL_FROM=Restaurant Influences <noreply@votre-domaine.com>
EMAIL_REPLY_TO=contact@votre-domaine.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Commandes de build (optionnel)

Si vous devez exécuter des migrations Prisma au démarrage, vous pouvez ajouter une commande de build dans Coolify :

```bash
npx prisma migrate deploy
```

**Note** : Cette commande peut être exécutée dans l'onglet "Build Commands" de Coolify, ou via un script de démarrage personnalisé.

### 5. Port et santé

- **Port** : `3000` (défini dans le Dockerfile)
- **Health Check** : Coolify peut vérifier automatiquement `/api/health` si vous avez un endpoint de santé

## 🔧 Caractéristiques du Dockerfile

### Architecture multi-stage

Le Dockerfile utilise une architecture en 3 étapes pour optimiser la taille de l'image :

1. **deps** : Installation des dépendances npm
2. **builder** : Build de l'application Next.js avec génération du client Prisma
3. **runner** : Image finale optimisée pour la production

### Optimisations

- ✅ **Standalone output** : Next.js génère une version standalone minimale
- ✅ **Puppeteer support** : Chromium installé pour la génération de PDF
- ✅ **Sécurité** : Utilisateur non-root (`nextjs`)
- ✅ **Cache optimisé** : Utilisation de `npm ci` pour des builds reproductibles
- ✅ **Taille réduite** : Image Alpine Linux (~150MB)

### Support Puppeteer

Le Dockerfile inclut Chromium et toutes les dépendances nécessaires pour Puppeteer, permettant la génération de PDF des bons cadeaux.

## 📝 Notes importantes

### Migrations Prisma

Les migrations Prisma doivent être exécutées **avant** le premier démarrage de l'application. Vous pouvez :

1. **Option 1** : Exécuter manuellement via Coolify
   ```bash
   npx prisma migrate deploy
   ```

2. **Option 2** : Ajouter un script de démarrage dans Coolify qui exécute les migrations

3. **Option 3** : Utiliser un service séparé pour les migrations

### Base de données

Assurez-vous que :
- PostgreSQL est accessible depuis le conteneur Docker
- Les variables `DATABASE_URL` et `DIRECT_URL` sont correctement configurées
- Le pool de connexions est configuré (PgBouncer recommandé)

### Premier déploiement

1. Déployez l'application
2. Exécutez les migrations Prisma
3. Créez un compte admin :
   ```bash
   npm run create-admin admin@example.com MotDePasse123 "Nom Admin"
   ```

## 🐛 Dépannage

### L'application ne démarre pas

- Vérifiez les logs dans Coolify
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez la connexion à la base de données

### Erreur Prisma

- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que les migrations ont été exécutées
- Vérifiez que le client Prisma est généré (fait automatiquement dans le build)

### Erreur Puppeteer

- Vérifiez que Chromium est installé (inclus dans le Dockerfile)
- Vérifiez les variables d'environnement `PUPPETEER_EXECUTABLE_PATH`

### Build échoue

- Vérifiez que Node.js 22 est disponible (défini dans le Dockerfile)
- Vérifiez les logs de build dans Coolify
- Vérifiez que toutes les dépendances sont dans `package.json`

## 📚 Ressources

- [Documentation Coolify](https://coolify.io/docs)
- [Documentation Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
- [Documentation Prisma](https://www.prisma.io/docs)

