require('dotenv').config();
const express = require('express');
const cors = require('cors');

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
const categoryRoutes = require('./routes/CategoryRoutes');
const auctionRoutes = require('./routes/AuctionRoutes');
const bidRoutes = require('./routes/BidRoutes');
const conversationRoutes = require('./routes/ConversationRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const reviewRoutes = require('./routes/ReviewRoutes');
const notificationRoutes = require('./routes/NotificationRoutes');
const subscriptionPlanRoutes = require('./routes/SubscriptionPlanRoutes');
const subscriptionRoutes = require('./routes/SubscriptionRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');

// Enregistre les routes
app.use('/items', itemRoutes);
app.use('/users', userRoutes);
app.use('/individuals', individualRoutes);
app.use('/professionals', professionalRoutes);
app.use('/categories', categoryRoutes);
app.use('/auctions', auctionRoutes);
app.use('/bids', bidRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);
app.use('/reviews', reviewRoutes);
app.use('/notifications', notificationRoutes);
app.use('/subscription-plans', subscriptionPlanRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/transactions', transactionRoutes);

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