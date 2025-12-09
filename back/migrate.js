// ==========================================
// Migration Script - Purple Dog
// Créer toutes les tables dans PostgreSQL
// ==========================================

const { pool } = require('./config/db');
const fs = require('fs');
const path = require('path');

// ==========================================
// SQL de migration - Toutes les tables
// ==========================================

const migrationSQL = `
-- ==========================================
-- Purple Dog - Migrations Database
-- ==========================================

-- Supprimer les tables existantes (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS item_views CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS quick_sale_offers CASCADE;
DROP TABLE IF EXISTS bid_notifications CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS auctions CASCADE;
DROP TABLE IF EXISTS item_documents CASCADE;
DROP TABLE IF EXISTS item_photos CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS professional_profiles CASCADE;
DROP TABLE IF EXISTS individual_profiles CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Supprimer les types ENUM
DROP TYPE IF EXISTS user_type_enum CASCADE;
DROP TYPE IF EXISTS subscription_status_enum CASCADE;
DROP TYPE IF EXISTS sale_type_enum CASCADE;
DROP TYPE IF EXISTS item_status_enum CASCADE;
DROP TYPE IF EXISTS auction_status_enum CASCADE;
DROP TYPE IF EXISTS offer_status_enum CASCADE;
DROP TYPE IF EXISTS conversation_status_enum CASCADE;
DROP TYPE IF EXISTS shipment_status_enum CASCADE;
DROP TYPE IF EXISTS transaction_status_enum CASCADE;
DROP TYPE IF EXISTS notification_type_enum CASCADE;
DROP TYPE IF EXISTS bid_notification_type_enum CASCADE;

-- ==========================================
-- TYPES ENUM
-- ==========================================

-- Type d'utilisateur
CREATE TYPE user_type_enum AS ENUM ('individual', 'professional', 'admin');

-- Statut d'abonnement
CREATE TYPE subscription_status_enum AS ENUM ('trial', 'active', 'past_due', 'canceled', 'expired');

-- Type de vente
CREATE TYPE sale_type_enum AS ENUM ('auction', 'quick_sale');

-- Statut d'objet
CREATE TYPE item_status_enum AS ENUM ('draft', 'pending_validation', 'published', 'in_auction', 'sold', 'cancelled', 'expired');

-- Statut d'enchère
CREATE TYPE auction_status_enum AS ENUM ('pending', 'active', 'extended', 'completed', 'no_winner', 'cancelled');

-- Statut d'offre
CREATE TYPE offer_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'expired', 'cancelled');

-- Statut de conversation
CREATE TYPE conversation_status_enum AS ENUM ('active', 'closed', 'blocked');

-- Statut de livraison
CREATE TYPE shipment_status_enum AS ENUM ('pending', 'scheduled', 'picked_up', 'in_transit', 'delivered', 'failed');

-- Statut de transaction
CREATE TYPE transaction_status_enum AS ENUM ('pending_payment', 'payment_received', 'funds_held', 'shipped', 'delivered', 'funds_released', 'completed', 'refunded', 'cancelled');

-- Type de notification
CREATE TYPE notification_type_enum AS ENUM ('new_offer', 'new_bid', 'outbid', 'auction_won', 'auction_lost', 'item_sold', 'payment_received', 'shipment_update', 'new_message', 'account_update');

-- Type de notification d'enchère
CREATE TYPE bid_notification_type_enum AS ENUM ('outbid', 'winning', 'lost', 'auction_ending_soon');

-- ==========================================
-- TABLE: users
-- ==========================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type user_type_enum NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);

-- ==========================================
-- TABLE: subscription_plans
-- ==========================================

CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  user_type user_type_enum NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  billing_period VARCHAR(20),
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- TABLE: subscriptions
-- ==========================================

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  status subscription_status_enum NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP,
  trial_ends_at TIMESTAMP,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- TABLE: individual_profiles
-- ==========================================

CREATE TABLE individual_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100),
  profile_picture VARCHAR(255),
  postal_address TEXT NOT NULL,
  age_verified BOOLEAN DEFAULT FALSE,
  over_18_certified BOOLEAN DEFAULT FALSE,
  identity_document VARCHAR(255),
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  rgpd_accepted BOOLEAN NOT NULL,
  rgpd_accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_individual_profiles_user_id ON individual_profiles(user_id);

-- ==========================================
-- TABLE: professional_profiles
-- ==========================================

CREATE TABLE professional_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  siret_number VARCHAR(14) UNIQUE NOT NULL,
  official_document VARCHAR(255),
  postal_address TEXT NOT NULL,
  website VARCHAR(255),
  social_networks JSONB,
  specialties TEXT NOT NULL,
  sought_items TEXT NOT NULL,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  rgpd_accepted BOOLEAN NOT NULL,
  cgv_accepted BOOLEAN NOT NULL,
  mandate_signed BOOLEAN NOT NULL,
  mandate_signed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_professional_profiles_user_id ON professional_profiles(user_id);
CREATE INDEX idx_professional_profiles_siret ON professional_profiles(siret_number);

-- ==========================================
-- TABLE: categories
-- ==========================================

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- TABLE: items
-- ==========================================

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  dimensions VARCHAR(100),
  weight DECIMAL(10,2),
  desired_price DECIMAL(10,2) NOT NULL,
  ai_suggested_price DECIMAL(10,2),
  sale_type sale_type_enum NOT NULL,
  status item_status_enum NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  sold_at TIMESTAMP
);

CREATE INDEX idx_items_seller_id ON items(seller_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_status ON items(status);

-- ==========================================
-- TABLE: item_photos
-- ==========================================

CREATE TABLE item_photos (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  photo_url VARCHAR(255) NOT NULL,
  photo_order INTEGER NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- TABLE: item_documents
-- ==========================================

CREATE TABLE item_documents (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  document_url VARCHAR(255) NOT NULL,
  document_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- TABLE: auctions
-- ==========================================

CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  item_id INTEGER UNIQUE NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  starting_price DECIMAL(10,2) NOT NULL,
  reserve_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  increment_step DECIMAL(10,2) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  extended_end_time TIMESTAMP,
  winner_id INTEGER REFERENCES users(id),
  status auction_status_enum NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- TABLE: bids
-- ==========================================

CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id INTEGER NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  is_autobid BOOLEAN DEFAULT FALSE,
  max_autobid_amount DECIMAL(10,2),
  is_winning BOOLEAN DEFAULT FALSE,
  bid_time TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- TABLE: quick_sale_offers
-- ==========================================

CREATE TABLE quick_sale_offers (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  offered_price DECIMAL(10,2) NOT NULL,
  status offer_status_enum NOT NULL,
  offer_time TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- ==========================================
-- TABLE: favorites
-- ==========================================

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- ==========================================
-- TABLE: categories (déjà créée ci-dessus)
-- Autres tables à ajouter selon besoins...
-- ==========================================

-- ==========================================
-- FONCTION: Mettre à jour updated_at
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- TRIGGERS: updated_at
-- ==========================================

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_individual_profiles_updated_at 
  BEFORE UPDATE ON individual_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_profiles_updated_at 
  BEFORE UPDATE ON professional_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at 
  BEFORE UPDATE ON items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// ==========================================
// Fonction principale de migration
// ==========================================

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔄 Starting database migration...');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    // Exécuter le SQL de migration
    console.log('📝 Executing migration SQL...');
    await client.query(migrationSQL);
    
    console.log('✅ All tables created successfully!');
    console.log('');
    
    // Lister les tables créées
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('📊 Tables created:');
    tablesResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Migration completed successfully!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Run: npm run seed (to populate test data)');
    console.log('2. Test your API routes');
    console.log('3. Start developing! 🚀');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ Migration failed!');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('');
    throw error;
    
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécution
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('✅ Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = migrate;