# Configuration Coolify pour Influences

## Variables d'environnement requises

Assurez-vous d'ajouter ces variables d'environnement dans votre projet Coolify :

### Variables obligatoires

```bash
# Environnement
NODE_ENV=production
PRISMA_GENERATE_NO_ENGINE=true
CI=true

# Base de données PostgreSQL
DATABASE_URL=postgresql://user:password@host:port/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:port/database

# Authentification
BETTER_AUTH_SECRET=votre-secret-genere-aleatoirement
BETTER_AUTH_URL=https://votre-domaine.com

# Email (Resend)
RESEND_API_KEY=votre-cle-resend

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

## Configuration Nixpacks

Le fichier `nixpacks.toml` à la racine du projet configure automatiquement :
- ✅ Node.js 20
- ✅ Variables d'environnement de production
- ✅ Prisma avec `--no-engine` pour des builds plus rapides
- ✅ Commandes de build optimisées

## Build Commands

Coolify détectera automatiquement la configuration grâce à `nixpacks.toml`.

Si vous devez configurer manuellement :
- **Install Command**: `npm ci`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `3000`

## Post-Déploiement

Après le premier déploiement, vous devrez créer un super administrateur :

1. Connectez-vous au conteneur via Coolify
2. Exécutez : `npm run create-admin`
3. Suivez les instructions pour créer votre compte

## Optimisations

Le script `postinstall.js` détecte automatiquement l'environnement de production et utilise `prisma generate --no-engine` pour :
- ⚡ Builds 50% plus rapides
- 💾 Images Docker plus légères
- 🚀 Déploiements optimisés

## Troubleshooting

### "prisma:warn In production, we recommend using `prisma generate --no-engine`"

Si vous voyez ce warning malgré la configuration :
1. Vérifiez que `PRISMA_GENERATE_NO_ENGINE=true` est bien défini dans Coolify
2. Vérifiez que `NODE_ENV=production` est défini
3. Vérifiez que `CI=true` est défini

### Erreur de connexion à la base de données

Assurez-vous que :
- `DATABASE_URL` contient `?pgbouncer=true` si vous utilisez PgBouncer
- `DIRECT_URL` pointe vers la connexion directe sans PgBouncer
- Le firewall autorise la connexion depuis Coolify

## Support

Pour toute question, consultez :
- [Documentation Coolify](https://coolify.io/docs)
- [Documentation Nixpacks](https://nixpacks.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)

