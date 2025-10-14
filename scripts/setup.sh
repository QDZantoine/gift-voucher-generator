#!/bin/bash

# Script d'initialisation du projet Influences

echo "🚀 Initialisation du projet Influences..."

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cat > .env << EOF
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
EOF
    echo "✅ Fichier .env créé avec un secret aléatoire"
else
    echo "⚠️  Le fichier .env existe déjà"
fi

echo "📦 Installation des dépendances..."
npm install

echo "🗄️  Génération du client Prisma..."
npx prisma generate

echo "🔄 Application des migrations..."
npx prisma migrate deploy

echo ""
echo "✨ Configuration terminée!"
echo ""
echo "Pour démarrer le serveur de développement:"
echo "  npm run dev"
echo ""
echo "Pour créer un compte admin:"
echo "  Visitez http://localhost:3000/register"
echo ""


