const { Pool } = require('pg');

// Configuration du pool de connexions
const poolConfig = {
  // Utiliser DATABASE_URL si disponible (prioritaire)
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.POSTGRES_DB || 'postgres'}`,
  
  // Options du pool
  max: 20,                      // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000,     // Fermer les connexions inactives après 30s
  connectionTimeoutMillis: 2000, // Timeout pour établir une connexion
  
  // SSL en production (optionnel)
  // ssl: process.env.NODE_ENV === 'production' ? {
  //   rejectUnauthorized: false
  // } : false
};

// Créer le pool
const pool = new Pool(poolConfig);

// Événement: Nouvelle connexion établie
pool.on('connect', (client) => {
  console.log('🔌 New database connection established');
});

// Événement: Erreur de connexion
pool.on('error', (err, client) => {
  console.error('❌ Unexpected database error on idle client:', err);
  // Ne pas quitter l'application, juste logger l'erreur
});

// Événement: Client acquis du pool
pool.on('acquire', (client) => {
  // console.log('📥 Client acquired from pool');
});

// Événement: Client libéré au pool
pool.on('remove', (client) => {
  // console.log('📤 Client removed from pool');
});

// Fonction de test de connexion
const testConnection = async () => {
  try {
    const client = await pool.connect();
    
    // Requête de test
    const result = await client.query(`
      SELECT 
        NOW() as current_time,
        version() as pg_version,
        current_database() as database_name,
        current_user as current_user
    `);
    
    const info = result.rows[0];
    
    console.log('✅ Database connected successfully');
    console.log(`   - Time: ${info.current_time}`);
    console.log(`   - PostgreSQL: ${info.pg_version.split(' ')[0]}`);
    console.log(`   - Database: ${info.database_name}`);
    console.log(`   - User: ${info.current_user}`);
    console.log('');
    
    // Libérer le client
    client.release();
    
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed');
    console.error(`Error: ${error.message}`);
    console.error('');
    console.error('🔍 Troubleshooting:');
    console.error('1. Check if PostgreSQL is running');
    console.error('2. Verify DATABASE_URL in .env or environment variables');
    console.error('3. Check credentials (user, password, database name)');
    console.error('4. Ensure PostgreSQL port is accessible');
    console.error('');
    
    return false;
  }
};

// Helper: Exécuter une requête avec retry
const queryWithRetry = async (text, params, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await pool.query(text, params);
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`⚠️  Query failed, retrying (${i + 1}/${retries})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Helper: Exécuter une transaction
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  testConnection,
  queryWithRetry,
  transaction
};
