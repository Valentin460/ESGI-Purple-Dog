const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  
  // Options supplémentaires
  max: 20, // Nombre max de connexions dans le pool
  idleTimeoutMillis: 30000, // Temps avant fermeture d'une connexion inactive
  connectionTimeoutMillis: 2000, // Temps max pour établir une connexion
});

// ==========================================
// Test de connexion basique
// ==========================================
async function testConnection() {
  try {
    console.log('🔄 Tentative de connexion à PostgreSQL...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Port: ${process.env.DB_PORT}`);
    console.log(`   Database: ${process.env.POSTGRES_DB}`);
    console.log(`   User: ${process.env.POSTGRES_USER}`);
    console.log(`   Password: ${process.env.POSTGRES_PASSWORD}`)
    
    const client = await pool.connect();
    console.log('✅ Connexion établie avec succès!');
    
    // Test de requête simple
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('\n📊 Informations PostgreSQL:');
    console.log(`   Heure serveur: ${result.rows[0].current_time}`);
    console.log(`   Version: ${result.rows[0].pg_version.split(' ')[0]}`);
    
    // Vérifier les tables existantes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables existantes:');
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  Aucune table trouvée (base de données vide)');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    client.release();
    console.log('\n✅ Test terminé avec succès!');
    
  } catch (error) {
    console.error('\n❌ Erreur de connexion:', error.message);
    console.error('\n🔍 Vérifiez:');
    console.error('1. PostgreSQL est démarré: docker-compose ps');
    console.error('2. Les identifiants dans .env sont corrects');
    console.error('3. Le port 5432 est accessible');
    console.error('4. Le fichier .env existe et est chargé');
  } finally {
    await pool.end();
  }
}

// ==========================================
// Exécuter le test
// ==========================================
testConnection();
