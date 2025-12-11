FROM node:25-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads && chmod 755 uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
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
  TABLE_COUNT=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres -U $POSTGRES_USER -d $POSTGRES_DB -t -c \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';\" 2>/dev/null | xargs || echo '0') && \
  echo \"📊 Current tables in database: $TABLE_COUNT\" && \
  echo '' && \
  if [ \"$TABLE_COUNT\" -lt 10 ]; then \
    echo '🔄 Running migrations...' && \
    node migrate.js && \
    echo '✅ Migrations completed!' && \
    echo ''; \
  else \
    echo '⏭️  Tables already exist, skipping migration' && \
    echo ''; \
  fi && \
  USER_COUNT=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres -U $POSTGRES_USER -d $POSTGRES_DB -t -c 'SELECT COUNT(*) FROM users;' 2>/dev/null | xargs || echo '0') && \
  echo \"👥 Current users in database: $USER_COUNT\" && \
  echo '' && \
  if [ \"$USER_COUNT\" -lt 1 ]; then \
    echo '🌱 Running seed...' && \
    node seed.js && \
    echo '✅ Seed completed!' && \
    echo ''; \
  else \
    echo '⏭️  Data already exists, skipping seed' && \
    echo ''; \
  fi && \
  echo '════════════════════════════════════════════════════════════' && \
  echo '🚀 Starting Express Server...' && \
  echo '════════════════════════════════════════════════════════════' && \
  echo '' && \
  node index.js \
"]