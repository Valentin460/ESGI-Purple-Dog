const { pool } = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌱 Starting seed process...');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    // ==========================================
    // 0. VÉRIFIER QUE LES TABLES EXISTENT
    // ==========================================
    
    console.log('🔍 Checking if tables exist...');
    const tableCheck = await client.query(`
      SELECT COUNT(*) 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    const tableCount = parseInt(tableCheck.rows[0].count);
    
    if (tableCount < 10) {
      console.error('❌ Tables do not exist!');
      console.error('❌ Please run migration first: node migrate.js');
      console.error('');
      process.exit(1);
    }
    
    console.log(`✅ Found ${tableCount} tables\n`);
    
    // Commencer une transaction
    await client.query('BEGIN');
    
    // ==========================================
    // 1. NETTOYER LES DONNÉES EXISTANTES
    // ==========================================
    
    console.log('🧹 Cleaning existing data...');
    
    // Ordre important : supprimer les tables avec foreign keys en premier
    const tablesToTruncate = [
      'bids',
      'quick_sale_offers',
      'auctions',
      'favorites',
      'item_documents',
      'item_photos',
      'items',
      'categories',
      'subscriptions',
      'subscription_plans',
      'professional_profiles',
      'individual_profiles',
      'users'
    ];
    
    for (const table of tablesToTruncate) {
      try {
        await client.query(`TRUNCATE TABLE ${table} CASCADE`);
      } catch (error) {
        console.error(`  ⚠️  Warning: Could not truncate ${table}: ${error.message}`);
      }
    }
    
    console.log('✅ Tables cleaned\n');
    
    // Réinitialiser les séquences
    try {
      await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE items_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE auctions_id_seq RESTART WITH 1');
    } catch (error) {
      console.log('  ℹ️  Info: Could not reset sequences (may not exist yet)\n');
    }
    
    // ==========================================
    // 2. SEED USERS
    // ==========================================
    
    console.log('👥 Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Admin
    const adminResult = await client.query(`
      INSERT INTO users (email, password_hash, user_type, is_verified, is_active)
      VALUES ($1, $2, $3, true, true)
      RETURNING id, email, user_type
    `, ['admin@purpledog.com', hashedPassword, 'admin']);
    const adminId = adminResult.rows[0].id;
    console.log(`   ✅ Admin: ${adminResult.rows[0].email}`);
    
    // Particulier 1
    const individual1Result = await client.query(`
      INSERT INTO users (email, password_hash, user_type, is_verified, is_active)
      VALUES ($1, $2, $3, true, true)
      RETURNING id, email, user_type
    `, ['john.doe@gmail.com', hashedPassword, 'individual']);
    const individual1Id = individual1Result.rows[0].id;
    console.log(`   ✅ Individual: ${individual1Result.rows[0].email}`);
    
    // Particulier 2
    const individual2Result = await client.query(`
      INSERT INTO users (email, password_hash, user_type, is_verified, is_active)
      VALUES ($1, $2, $3, true, true)
      RETURNING id, email, user_type
    `, ['jane.smith@gmail.com', hashedPassword, 'individual']);
    const individual2Id = individual2Result.rows[0].id;
    console.log(`   ✅ Individual: ${individual2Result.rows[0].email}`);
    
    // Professionnel 1
    const pro1Result = await client.query(`
      INSERT INTO users (email, password_hash, user_type, is_verified, is_active)
      VALUES ($1, $2, $3, true, true)
      RETURNING id, email, user_type
    `, ['pro1@antique.com', hashedPassword, 'professional']);
    const pro1Id = pro1Result.rows[0].id;
    console.log(`   ✅ Professional: ${pro1Result.rows[0].email}`);
    
    // Professionnel 2
    const pro2Result = await client.query(`
      INSERT INTO users (email, password_hash, user_type, is_verified, is_active)
      VALUES ($1, $2, $3, true, true)
      RETURNING id, email, user_type
    `, ['pro2@gallery.com', hashedPassword, 'professional']);
    const pro2Id = pro2Result.rows[0].id;
    console.log(`   ✅ Professional: ${pro2Result.rows[0].email}\n`);
    
    // ==========================================
    // 3. SEED INDIVIDUAL PROFILES
    // ==========================================
    
    console.log('📋 Seeding individual profiles...');
    await client.query(`
      INSERT INTO individual_profiles (
        user_id, first_name, last_name, display_name, postal_address,
        over_18_certified, rgpd_accepted, rgpd_accepted_at
      ) VALUES 
      ($1, 'John', 'Doe', 'John', '123 Rue de Paris, 75001 Paris', true, true, NOW()),
      ($2, 'Jane', 'Smith', 'Jane', '456 Avenue des Champs, 75008 Paris', true, true, NOW())
    `, [individual1Id, individual2Id]);
    console.log(`   ✅ 2 individual profiles created\n`);
    
    // ==========================================
    // 4. SEED PROFESSIONAL PROFILES
    // ==========================================
    
    console.log('💼 Seeding professional profiles...');
    await client.query(`
      INSERT INTO professional_profiles (
        user_id, first_name, last_name, company_name, siret_number,
        postal_address, specialties, sought_items,
        rgpd_accepted, cgv_accepted, mandate_signed, mandate_signed_at
      ) VALUES 
      ($1, 'Pierre', 'Martin', 'Antiquités Martin', '12345678901234', 
       '10 Rue des Antiquaires, 75006 Paris', 'Meubles anciens, Objets d''art',
       'Mobilier XVIIIe siècle, Sculptures', true, true, true, NOW()),
      ($2, 'Sophie', 'Dubois', 'Galerie Dubois', '98765432109876',
       '25 Boulevard Saint-Germain, 75005 Paris', 'Peintures, Sculptures',
       'Tableaux XIXe siècle, Art moderne', true, true, true, NOW())
    `, [pro1Id, pro2Id]);
    console.log(`   ✅ 2 professional profiles created\n`);
    
    // ==========================================
    // 5. SEED SUBSCRIPTION PLANS
    // ==========================================
    
    console.log('💳 Seeding subscription plans...');
    const planFreeResult = await client.query(`
      INSERT INTO subscription_plans (name, user_type, price, billing_period, features, is_active)
      VALUES ('Gratuit Particulier', 'individual', 0.00, 'forever', 
              '{"features": ["Vente uniquement", "Frais 2%", "Support email"]}', true)
      RETURNING id
    `);
    const planFreeId = planFreeResult.rows[0].id;
    
    const planProResult = await client.query(`
      INSERT INTO subscription_plans (name, user_type, price, billing_period, features, is_active)
      VALUES ('Pro Standard', 'professional', 49.00, 'monthly',
              '{"features": ["Achat + Vente", "1 mois gratuit", "Support prioritaire", "Statistiques"]}', true)
      RETURNING id
    `);
    const planProId = planProResult.rows[0].id;
    console.log(`   ✅ 2 subscription plans created\n`);
    
    // ==========================================
    // 6. SEED SUBSCRIPTIONS
    // ==========================================
    
    console.log('📅 Seeding subscriptions...');
    await client.query(`
      INSERT INTO subscriptions (user_id, plan_id, status, started_at)
      VALUES 
      ($1, $2, 'active', NOW()),
      ($3, $4, 'active', NOW()),
      ($5, $6, 'trial', NOW()),
      ($7, $8, 'active', NOW())
    `, [
      individual1Id, planFreeId,
      individual2Id, planFreeId,
      pro1Id, planProId,
      pro2Id, planProId
    ]);
    console.log(`   ✅ 4 subscriptions created\n`);
    
    // ==========================================
    // 7. SEED CATEGORIES
    // ==========================================
    
    console.log('📁 Seeding categories...');
    const categoryResults = await client.query(`
      INSERT INTO categories (name, slug, description, is_active)
      VALUES 
      ('Bijoux & Montres', 'bijoux-montres', 'Bijoux anciens et montres de collection', true),
      ('Meubles Anciens', 'meubles-anciens', 'Mobilier d''époque et antiquités', true),
      ('Objets d''Art & Tableaux', 'objets-art-tableaux', 'Peintures, sculptures et objets d''art', true),
      ('Objets de Collection', 'objets-collection', 'Pièces rares et objets de collection', true),
      ('Vins & Spiritueux', 'vins-spiritueux', 'Grands crus et spiritueux de prestige', true),
      ('Instruments de Musique', 'instruments-musique', 'Instruments anciens et de collection', true),
      ('Livres Anciens', 'livres-anciens', 'Livres rares et éditions originales', true),
      ('Mode & Accessoires de Luxe', 'mode-luxe', 'Vêtements et accessoires de luxe', true)
      RETURNING id, name
    `);
    categoryResults.rows.forEach(cat => {
      console.log(`   ✅ ${cat.name}`);
    });
    console.log('');
    
    const categoryIds = categoryResults.rows.map(r => r.id);
    
    // ==========================================
    // 8. SEED ITEMS
    // ==========================================
    
    console.log('📦 Seeding items...');
    
    // Item 1 - Enchère active
    const item1Result = await client.query(`
      INSERT INTO items (
        seller_id, category_id, name, description, dimensions, weight,
        desired_price, ai_suggested_price, sale_type, status, view_count, published_at
      ) VALUES (
        $1, $2, 'Montre Rolex Submariner Vintage 1960',
        'Magnifique Rolex Submariner de 1960 en excellent état. Cadran original, bracelet cuir.',
        '40mm diamètre', 0.15, 8500.00, 9200.00, 'auction', 'in_auction', 45, NOW()
      ) RETURNING id
    `, [individual1Id, categoryIds[0]]);
    const item1Id = item1Result.rows[0].id;
    console.log(`   ✅ Item 1: Rolex Submariner (auction)`);
    
    // Item 2 - Vente rapide
    const item2Result = await client.query(`
      INSERT INTO items (
        seller_id, category_id, name, description, dimensions,
        desired_price, sale_type, status, view_count, published_at
      ) VALUES (
        $1, $2, 'Fauteuil Louis XV',
        'Fauteuil d''époque Louis XV en noyer sculpté. Tapisserie d''origine restaurée.',
        '85cm H x 70cm L x 65cm P', 2500.00, 'quick_sale', 'published', 23, NOW()
      ) RETURNING id
    `, [individual2Id, categoryIds[1]]);
    const item2Id = item2Result.rows[0].id;
    console.log(`   ✅ Item 2: Fauteuil Louis XV (quick sale)`);
    
    // Item 3 - Tableau
    const item3Result = await client.query(`
      INSERT INTO items (
        seller_id, category_id, name, description, dimensions,
        desired_price, ai_suggested_price, sale_type, status, view_count, published_at
      ) VALUES (
        $1, $2, 'Tableau Impressionniste signé',
        'Huile sur toile signée, école impressionniste française fin XIXe.',
        '60cm x 80cm', 12000.00, 13500.00, 'auction', 'published', 67, NOW()
      ) RETURNING id
    `, [individual1Id, categoryIds[2]]);
    const item3Id = item3Result.rows[0].id;
    console.log(`   ✅ Item 3: Tableau Impressionniste (auction)\n`);
    
    // ==========================================
    // 9. SEED ITEM PHOTOS
    // ==========================================
    
    console.log('📸 Seeding item photos...');
    await client.query(`
      INSERT INTO item_photos (item_id, photo_url, photo_order, description)
      VALUES 
      ($1, '/uploads/items/rolex-1.jpg', 1, 'Vue de face'),
      ($1, '/uploads/items/rolex-2.jpg', 2, 'Vue du cadran'),
      ($2, '/uploads/items/fauteuil-1.jpg', 1, 'Vue d''ensemble'),
      ($3, '/uploads/items/tableau-1.jpg', 1, 'Vue complète du tableau')
    `, [item1Id, item2Id, item3Id]);
    console.log(`   ✅ 4 item photos created\n`);
    
    // ==========================================
    // 10. SEED ITEM DOCUMENTS (Skipped - optional)
    // ==========================================
    
    console.log('📄 Skipping item documents (optional data)...\n');
    
    // ==========================================
    // 11. SEED AUCTIONS
    // ==========================================
    
    console.log('🔨 Seeding auctions...');
    
    // Enchère pour Item 1 (active)
    const auction1Result = await client.query(`
      INSERT INTO auctions (
        item_id, starting_price, reserve_price, current_price, increment_step,
        start_time, end_time, status
      ) VALUES (
        $1, 5000.00, 7000.00, 6500.00, 200.00,
        NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', 'active'
      ) RETURNING id
    `, [item1Id]);
    const auction1Id = auction1Result.rows[0].id;
    console.log(`   ✅ Auction 1: Rolex (active, ends in 5 days)`);
    
    // Enchère pour Item 3 (pending)
    const auction2Result = await client.query(`
      INSERT INTO auctions (
        item_id, starting_price, reserve_price, current_price, increment_step,
        start_time, end_time, status
      ) VALUES (
        $1, 8000.00, 10000.00, 8000.00, 500.00,
        NOW() + INTERVAL '1 day', NOW() + INTERVAL '8 days', 'pending'
      ) RETURNING id
    `, [item3Id]);
    const auction2Id = auction2Result.rows[0].id;
    console.log(`   ✅ Auction 2: Tableau (pending, starts in 1 day)\n`);
    
    // ==========================================
    // 12. SEED BIDS
    // ==========================================
    
    console.log('💰 Seeding bids...');
    await client.query(`
      INSERT INTO bids (auction_id, bidder_id, amount, is_autobid, is_winning, bid_time)
      VALUES 
      ($1, $2, 5200.00, false, false, NOW() - INTERVAL '1 day 12 hours'),
      ($1, $3, 5700.00, false, false, NOW() - INTERVAL '1 day 6 hours'),
      ($1, $4, 6100.00, true, false, NOW() - INTERVAL '18 hours'),
      ($1, $2, 6500.00, false, true, NOW() - INTERVAL '8 hours')
    `, [auction1Id, pro1Id, pro2Id, pro1Id]);
    console.log(`   ✅ 4 bids created for Auction 1\n`);
    
    // ==========================================
    // 13. SEED QUICK SALE OFFERS
    // ==========================================
    
    console.log('💵 Seeding quick sale offers...');
    await client.query(`
      INSERT INTO quick_sale_offers (item_id, buyer_id, offered_price, status, offer_time, expires_at)
      VALUES 
      ($1, $2, 2400.00, 'pending', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '22 hours'),
      ($1, $3, 2500.00, 'rejected', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
    `, [item2Id, pro1Id, pro2Id]);
    console.log(`   ✅ 2 quick sale offers created\n`);
    
    // ==========================================
    // 14. SEED FAVORITES
    // ==========================================
    
    console.log('⭐ Seeding favorites...');
    await client.query(`
      INSERT INTO favorites (user_id, item_id)
      VALUES 
      ($1, $2),
      ($1, $3),
      ($4, $2)
    `, [pro1Id, item1Id, item3Id, pro2Id]);
    console.log(`   ✅ 3 favorites created\n`);
    
    // Valider la transaction
    await client.query('COMMIT');
    
    // ==========================================
    // RÉSUMÉ
    // ==========================================
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Seed completed successfully!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 Summary:');
    console.log(`   - Users: 5 (1 admin, 2 individuals, 2 professionals)`);
    console.log(`   - Individual Profiles: 2`);
    console.log(`   - Professional Profiles: 2`);
    console.log(`   - Subscription Plans: 2`);
    console.log(`   - Subscriptions: 4`);
    console.log(`   - Categories: 8`);
    console.log(`   - Items: 3`);
    console.log(`   - Item Photos: 4`);
    console.log(`   - Auctions: 2 (1 active, 1 pending)`);
    console.log(`   - Bids: 4`);
    console.log(`   - Quick Sale Offers: 2`);
    console.log(`   - Favorites: 3`);
    console.log('');
    console.log('🔐 Test accounts (all password: password123):');
    console.log('   Admin:');
    console.log('   - admin@purpledog.com');
    console.log('');
    console.log('   Individuals:');
    console.log('   - john.doe@gmail.com');
    console.log('   - jane.smith@gmail.com');
    console.log('');
    console.log('   Professionals:');
    console.log('   - pro1@antique.com');
    console.log('   - pro2@gallery.com');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await client.query('ROLLBACK');
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ Seed failed!');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    throw error;
    
  } finally {
    // Libérer la connexion
    client.release();
    await pool.end();
  }
}

// ==========================================
// Exécution
// ==========================================

if (require.main === module) {
  console.log('⚠️  WARNING: This will DELETE all existing data!');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  setTimeout(() => {
    seed()
      .then(() => {
        console.log('✅ Seed process finished');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Seed process failed:', error);
        process.exit(1);
      });
  }, 3000);
}

module.exports = seed;
