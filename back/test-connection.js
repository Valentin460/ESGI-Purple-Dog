const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres'
});

console.log('🔄 Test de connexion PostgreSQL...\n');

pool.query('SELECT NOW() as time', (err, res) => {
  if (err) {
    console.error('❌ ERREUR:', err.message);
  } else {
    console.log('✅ CONNEXION RÉUSSIE!');
    console.log('📊 Heure serveur:', res.rows[0].time);
  }
  pool.end();
});
