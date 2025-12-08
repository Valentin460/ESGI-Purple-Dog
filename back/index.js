const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ DB Error:', err.message);
  else console.log('✅ DB Connected:', res.rows[0].now);
});

app.get('/', (req, res) => {
  res.json({ message: '🐕💜 Purple Dog API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time');
    res.json({ success: true, time: result.rows[0].time });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('🐕💜 Purple Dog API - Port 3000');
});
