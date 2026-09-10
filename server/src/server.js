const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { register, login, getProfile } = require('./controllers/authController');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 2. Security Control: Rate Limiting (Protects Login endpoint from Brute Force attacks)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes (Brute Force Protection active).'
  }
});

// 3. API Routes
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', message: 'Authentication Toolkit API is operational' });
});

// User Registration
app.post('/api/register', register);

// User Login (Protected by Rate Limiter)
app.post('/api/login', loginLimiter, login);

// Protected User Profile (Session verification)
app.get('/api/profile', authenticateToken, getProfile);

// 4. Start Server after Database Connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[SERVER] Cybersecurity Auth Toolkit Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('[SERVER] Critical: Failed to start server due to DB connection error:', err);
});
