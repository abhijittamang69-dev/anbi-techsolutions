const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { connectDB, isDBConnected } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const technicianRoutes = require('./routes/technician');
const publicRoutes = require('./routes/public');

connectDB();

const app = express();

const rootDir = path.join(__dirname, '../..');
const frontendDir = path.join(rootDir, 'frontend');
const adminDir = path.join(rootDir, 'admin-panel');
const technicianDir = path.join(rootDir, 'technician-panel');

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, please try again later.',
});
app.use('/api/auth/login', authLimiter);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
  'https://anbi-tech.onrender.com',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Serve static files (frontend, admin-panel, technician-panel)
app.use(express.static(frontendDir));
app.use('/admin', express.static(adminDir));
app.use('/technician', express.static(technicianDir));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ANBI Tech Solution API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: isDBConnected() ? 'connected' : 'disconnected',
  });
});

// DB readiness middleware — returns 503 if database is not yet connected
const dbReady = (req, res, next) => {
  if (req.path === '/api/health') return next();
  if (isDBConnected()) return next();
  res.status(503).json({
    success: false,
    message: 'Database connection is not ready. Please try again in a moment.',
  });
};
app.use('/api', dbReady);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tech', technicianRoutes);
app.use('/api', publicRoutes);

// SPA fallback routes (must be after API routes)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  if (req.path.startsWith('/admin')) {
    return res.sendFile(path.join(adminDir, 'dashboard.html'));
  }
  if (req.path.startsWith('/technician')) {
    return res.sendFile(path.join(technicianDir, 'dashboard.html'));
  }
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.use(errorHandler);

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  }
  res.status(404).send('Not found');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 ANBI Tech Solution API running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api\n`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
