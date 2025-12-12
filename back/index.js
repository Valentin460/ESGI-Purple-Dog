require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Middleware
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Routes
// ==========================================
const itemRoutes = require('./Routes/ItemsRoutes');
const userRoutes = require('./routes/UserRoutes');
const individualRoutes = require('./routes/IndividualsRoutes');
const professionalRoutes = require('./routes/ProfessionalsRoutes');
const categoryRoutes = require('./Routes/CategoryRoutes');
const auctionRoutes = require('./routes/AuctionRoutes');
const bidRoutes = require('./routes/BidRoutes');
const conversationRoutes = require('./routes/ConversationRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const reviewRoutes = require('./routes/ReviewRoutes');
const notificationRoutes = require('./routes/NotificationRoutes');
const subscriptionPlanRoutes = require('./routes/SubscriptionPlanRoutes');
const subscriptionRoutes = require('./routes/SubscriptionRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');

// Enregistre les routes avec préfixe /api
app.use('/api/items', itemRoutes);
app.use('/api/individuals', individualRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Purple Dog API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      users: '/users',
      individuals: '/individuals',
      professionals: '/professionals',
      items: '/items'
    }
  });
});

// Health check (pour Docker healthcheck)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test de connexion à la base de données
app.get('/api/db-test', async (req, res) => {
  try {
    const { pool } = require('./config/db');
    const result = await pool.query(`
      SELECT 
        NOW() as current_time, 
        version() as pg_version,
        current_database() as database_name
    `);
    
    res.json({
      success: true,
      database: {
        connected: true,
        time: result.rows[0].current_time,
        version: result.rows[0].pg_version.split(' ')[0],
        database: result.rows[0].database_name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

// ==========================================
// Import des routes API
// ==========================================

const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripe');
// Ajouter ici les futures routes :
// const categoryRoutes = require('./routes/category.routes');
// const itemRoutes = require('./routes/item.routes');

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes des utilisateurs
app.use('/api/users', userRoutes);

// Routes Stripe
app.use('/api/stripe', stripeRoutes);

// Routes futures
// app.use('/api/categories', categoryRoutes);
// app.use('/api/items', itemRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

// ==========================================
// Démarrage du serveur
// ==========================================
app.listen(PORT, () => {
  console.log(`✅ Serveur Express lancé sur http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
