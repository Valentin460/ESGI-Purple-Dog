require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser - Parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple pour le développement
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: '🐕💜 Purple Dog API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      dbTest: '/api/db-test',
      auth: '/api/auth',
      users: '/api/users'
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
const userRoutes = require('./routes/user');
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
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    });
  }
  
  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  // Erreur générique
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🐕💜 Purple Dog Backend API - Starting...');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    // 1. Tester la connexion à la base de données
    console.log('📊 Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('⚠️  Database connection failed');
      console.warn('⚠️  Server will start but database features will not work');
      console.log('');
    }
    
    // 2. Démarrer le serveur HTTP
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('✅ Server started successfully!');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
      console.log(`🌐 Server Information:`);
      console.log(`   - Port: ${PORT}`);
      console.log(`   - Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   - Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`   - URL: http://localhost:${PORT}`);
      console.log('');
      console.log(`📍 Available Routes:`);
      console.log(`   - GET  /                      → API info`);
      console.log(`   - GET  /api/health            → Health check`);
      console.log(`   - GET  /api/db-test           → Database test`);
      console.log('');
      console.log(`🔐 Authentication Routes:`);
      console.log(`   - POST /api/auth/register     → Register`);
      console.log(`   - POST /api/auth/login        → Login`);
      console.log(`   - POST /api/auth/refresh      → Refresh token`);
      console.log(`   - GET  /api/auth/me           → Current user (protected)`);
      console.log(`   - POST /api/auth/logout       → Logout (protected)`);
      console.log('');
      console.log(`👥 User Routes:`);
      console.log(`   - POST /api/users             → Create user`);
      console.log(`   - GET  /api/users             → Get all users`);
      console.log(`   - GET  /api/users/:id         → Get user by ID`);
      console.log(`   - PUT  /api/users/:id         → Update user`);
      console.log(`   - DELETE /api/users/:id       → Delete user`);
      console.log('');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🚀 Ready to accept connections!');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
    });
    
    // 3. Gestion propre de l'arrêt
    const gracefulShutdown = async (signal) => {
      console.log('');
      console.log(`📡 ${signal} signal received: closing HTTP server...`);
      
      server.close(async () => {
        console.log('✅ HTTP server closed');
        
        // Fermer le pool de connexions DB
        try {
          const { pool } = require('./config/db');
          await pool.end();
          console.log('✅ Database pool closed');
        } catch (error) {
          console.error('❌ Error closing database pool:', error.message);
        }
        
        console.log('👋 Goodbye!');
        process.exit(0);
      });
      
      // Forcer la fermeture après 10 secondes
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Écouter les signaux d'arrêt
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ Failed to start server');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('═══════════════════════════════════════════════════════════');
    process.exit(1);
  }
};

// Démarrage
if (require.main === module) {
  startServer();
}

// Export pour les tests
module.exports = app;
