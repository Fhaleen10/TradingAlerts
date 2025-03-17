const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Alert = require('../models/alert');
const crypto = require('crypto');

// Generate webhook token
function generateWebhookToken(user) {
  console.log('Generating new webhook token for user:', user._id);
  const token = crypto.randomBytes(32).toString('hex');
  console.log('Generated token:', token);
  user.webhookToken = token;
  user.save();
  return token;
}

// Format alert message
function formatAlertMessage(alertData) {
  const symbol = alertData.symbol || 'Unknown';
  const exchange = alertData.exchange || '';
  const price = alertData.price || '';
  const message = alertData.message || '';
  const timestamp = new Date().toLocaleString();

  return `🔔 Trading Alert\n\nSymbol: ${symbol}${exchange ? ` on ${exchange}` : ''}\n${price ? `Price: $${price}\n` : ''}\n📝 Message:\n${message}\n\n⏰ Triggered at: ${timestamp}`;
}

// Get all alerts for a user - only returns most recent 10 alerts
// DO NOT MODIFY THIS ROUTE - it's used for displaying recent alerts
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Always return exactly 10 most recent alerts - DO NOT MODIFY THIS QUERY
    const alerts = await Alert.find({ userId: req.user.userId })
      .sort({ triggeredAt: -1 })
      .limit(10)
      .lean();
    
    console.log('Found alerts:', alerts.length);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get alert stats
router.get('/stats', auth, async (req, res) => {
  try {
    console.log('Getting stats for user:', req.user.userId);
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', user._id);
    console.log('Current webhook token:', user.webhookToken);

    // Ensure user has a webhook token
    let webhookToken = user.webhookToken;
    if (!webhookToken) {
      console.log('No webhook token found, generating new one');
      webhookToken = generateWebhookToken(user);
      user.webhookToken = webhookToken;
      await user.save();
      console.log('New webhook token saved:', webhookToken);
    }

    // Get today's alerts count
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todayAlerts = await Alert.find({
      userId: req.user.userId,
      triggeredAt: { $gte: startOfDay }
    }).lean();

    const alertCount = todayAlerts.length;
    console.log('Today\'s alerts count:', alertCount);
    console.log('User alert limit:', user.alertsLimit);

    // Calculate remaining alerts
    const remainingAlerts = Math.max(0, user.alertsLimit - alertCount);

    // Generate webhook URL using the latest token
    const webhookUrl = `http://localhost:3001/api/webhook/${user._id}/${webhookToken}`;
    console.log('Generated webhook URL:', webhookUrl);

    const response = {
      remainingAlerts,
      dailyLimit: user.alertsLimit,
      triggeredToday: alertCount,
      failedToday: 0,
      webhookUrl
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error in /stats route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Webhook endpoint for receiving alerts
// IMPORTANT: This endpoint adds new alerts but never modifies existing ones
router.post('/webhook/:userId/:token', async (req, res) => {
  try {
    const { userId, token } = req.params;
    const alertData = req.body;

    // Find user by ID and token
    const user = await User.findOne({
      _id: userId,
      webhookToken: token
    });

    if (!user) {
      console.error(`No user found for webhook ID: ${userId}`);
      return res.status(404).json({ message: 'Invalid webhook ID or token' });
    }

    // Get today's alerts count
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    console.log('Webhook - Start of day:', startOfDay);
    
    const todayAlerts = await Alert.find({
      userId: user._id,
      triggeredAt: { $gte: startOfDay }
    }).lean();

    const alertCount = todayAlerts.length;
    console.log('Webhook - Today\'s alerts:', alertCount);
    console.log('Webhook - User limit:', user.alertsLimit);

    if (alertCount >= user.alertsLimit) {
      console.error(`Daily alert limit reached for user: ${user.email}`);
      return res.status(429).json({ message: 'Daily alert limit reached' });
    }

    // Create new alert - NEVER modify existing alerts
    const alert = await Alert.create({
      userId: user._id,
      symbol: alertData.symbol || 'Unknown',
      message: alertData.message || formatAlertMessage(alertData),
      exchange: alertData.exchange || 'Unknown',
      status: 'triggered',
      destinations: user.telegramChat ? ['Telegram'] : [],
      triggeredAt: new Date()
    });

    console.log('Created new alert:', alert._id);

    // Send to Telegram if enabled
    if (user.telegramChat) {
      await sendTelegramMessage(user.telegramChat, formatAlertMessage(alertData));
    }

    res.json({ 
      success: true, 
      message: 'Alert processed successfully',
      remainingAlerts: user.alertsLimit - (alertCount + 1)
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Error processing alert' });
  }
});

// Reset alert count for a user
router.post('/reset-count/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.resetAlertsCount();
    
    res.json({ 
      success: true, 
      message: 'Alert count reset successfully',
      alertsUsed: user.alertsUsed,
      alertsLimit: user.alertsLimit
    });
  } catch (error) {
    console.error('Error resetting alert count:', error);
    res.status(500).json({ success: false, message: 'Failed to reset alert count' });
  }
});

module.exports = router;
