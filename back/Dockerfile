FROM node:25-alpine

# Installer PostgreSQL client et bash
RUN apk add --no-cache postgresql-client bash openssl

# Créer le dossier de l'application
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le schema Prisma
COPY prisma ./prisma/

# Générer le client Prisma
RUN npx prisma generate

# Copier tous les fichiers du backend
COPY . .

# Créer le dossier uploads
RUN mkdir -p /app/uploads

# Exposer le port
EXPOSE 3000

# Script de démarrage avec migration Prisma automatique
CMD ["sh", "-c", "\
  echo '════════════════════════════════════════════════════════════' && \
  echo '🐕💜 Purple Dog Backend - Starting...' && \
  echo '════════════════════════════════════════════════════════════' && \
  echo '' && \
  echo '⏳ Waiting for PostgreSQL to be ready...' && \
  until PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres -U $POSTGRES_USER -d $POSTGRES_DB -c '\\q' 2>/dev/null; do \
    echo '   PostgreSQL is unavailable - sleeping...' && \
    sleep 2; \
  done && \
  echo '✅ PostgreSQL is ready!' && \
  echo '' && \
  echo '🔄 Running Prisma migrations...' && \
  npx prisma migrate deploy && \
  echo '✅ Migrations completed!' && \
  echo '' && \
  echo '🌱 Seeding database (if needed)...' && \
  npx prisma db seed || echo 'No seed script or seed already done' && \
  echo '' && \
  echo '════════════════════════════════════════════════════════════' && \
  echo '🚀 Starting Express Server...' && \
  echo '════════════════════════════════════════════════════════════' && \
  echo '' && \
  node index.js \
"]  