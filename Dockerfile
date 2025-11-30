# ======================================================
# Dockerfile pour Next.js - Déploiement Coolify
# Image optimisée pour la production avec support Puppeteer
# ======================================================

# ======================================================
# Stage 1 — Dependencies
# ======================================================
FROM node:22.12.0 AS deps
WORKDIR /app

# Copier uniquement les fichiers de dépendances
# On ignore les scripts pour éviter d'exécuter postinstall ici
# (Prisma sera généré dans le stage builder)
COPY package.json package-lock.json* ./

# Installer les dépendances sans exécuter les scripts postinstall
RUN npm ci --ignore-scripts

# ======================================================
# Stage 2 — Builder
# ======================================================
FROM node:22.12.0 AS builder
WORKDIR /app

# Install Chromium & dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Prisma client (with engines for better compatibility)
RUN npx prisma generate

# Next.js build (standalone)
RUN npm run build

# ======================================================
# Stage 3 — Runner (production)
# ======================================================
FROM node:22.12.0 AS runner
WORKDIR /app

# Add runtime Chromium for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma generated client (custom output location)
COPY --from=builder /app/lib/generated ./lib/generated

# Copy Prisma schema and migrations (for running migrations if needed)
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/prisma/migrations ./prisma/migrations

# Permissions
RUN chown -R node:node /app
USER node

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
