const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const telegramBot = require('./services/telegramBot');
const { sendPasswordResetEmail } = require('./services/emailService');
const stripeWebhook = require('./webhooks/stripeWebhook');
const subscriptionService = require('./services/subscriptionService');
const subscriptionRoutes = require('./routes/subscription');
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const checkoutRoutes = require('./routes/checkout');
const discordRoutes = require('./routes/discordRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tradingalerts')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// For all other routes, parse JSON
app.use(express.json());

// Use raw body parsing for Stripe webhook
app.use('/webhook/stripe', express.raw({ type: 'application/json' }));
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/alerts', alertRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/discord', discordRoutes);
app.use('/api/notifications', notificationRoutes);

// Subscription plans
const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    dailyAlertLimit: 7,
    price: 0
  },
  BASIC: {
    name: 'Basic',
    dailyAlertLimit: 30,
    price: 9.99
  },
  PRO: {
    name: 'Pro',
    dailyAlertLimit: 100,
    price: 19.99
  },
  ENTERPRISE: {
    name: 'Enterprise',
    dailyAlertLimit: 500,
    price: 49.99
  }
};

// In-memory user storage (replace with a database in production)
const users = [{
  id: 1,
  email: 'fhaleen6@gmail.com',
  password: '$2a$10$YourHashedPasswordHere',
  webhookId: 'abc123', // This would be a unique ID for the webhook
  webhookSecret: 'xyz789', // This is used to verify webhook requests
  telegramChatId: null,
  telegramEnabled: false,
  resetToken: null,
  resetTokenExpiry: null,
  subscription: 'FREE', // Default to free plan
  subscriptionExpiryDate: null,
  expiryWarningEmailSent: false
}];

const Alert = require('./models/alert');
const AlertCount = require('./models/alertCount');

// Function to get today's date as a string (YYYY-MM-DD)
function getTodayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Function to get user's daily alert count
async function getUserDailyAlertCount(userId) {
  const today = getTodayString();
  const alertCount = await AlertCount.findOne({ userId, date: today });
  return alertCount ? alertCount.count : 0;
}

// Function to increment user's daily alert count
async function incrementUserDailyAlertCount(userId) {
  const today = getTodayString();
  const alertCount = await AlertCount.findOneAndUpdate(
    { userId, date: today },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  return alertCount.count;
}

// Function to clean up old alert counts
async function cleanupOldAlertCounts() {
  const today = getTodayString();
  await AlertCount.deleteMany({ date: { $ne: today } });
}

// Clean up old alert counts every day at midnight
setInterval(cleanupOldAlertCounts, 60 * 60 * 1000); // Check every hour
cleanupOldAlertCounts(); // Initial cleanup

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET;

// Generate webhook credentials
function generateWebhookCredentials() {
  return {
    webhookId: crypto.randomBytes(16).toString('hex'),
    webhookSecret: crypto.randomBytes(32).toString('hex')
  };
}

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Check subscription expiry and send notifications
async function checkSubscriptions() {
  const now = new Date();
  
  for (const user of users) {
    if (!user.subscriptionExpiryDate) continue;
    
    const expiryDate = new Date(user.subscriptionExpiryDate);
    
    // Send expiry warning 3 days before
    if (expiryDate - now <= 3 * 24 * 60 * 60 * 1000 && !user.expiryWarningEmailSent) {
      await sendEmail(user.email, {
        template: 'subscription-expiry-warning',
        data: {
          name: user.email,
          expiryDate: expiryDate.toLocaleDateString(),
          renewUrl: `${process.env.FRONTEND_URL}/billing`
        }
      });
      user.expiryWarningEmailSent = true;
    }
    
    // Downgrade expired subscriptions
    if (expiryDate <= now && user.subscription !== 'FREE') {
      user.subscription = 'FREE';
      user.subscriptionExpiryDate = null;
      user.expiryWarningEmailSent = false;
      
      await sendEmail(user.email, {
        template: 'subscription-expired',
        data: {
          name: user.email,
          renewUrl: `${process.env.FRONTEND_URL}/billing`
        }
      });
    }
  }
}

// Check subscriptions every hour
setInterval(checkSubscriptions, 60 * 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
