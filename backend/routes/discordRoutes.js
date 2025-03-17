const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

// Get Discord connection status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      connected: !!user.discordWebhookUrl,
      userId: user.discordUserId
    });
  } catch (error) {
    console.error('Error getting Discord status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Discord status'
    });
  }
});

// Connect Discord webhook
router.post('/connect', auth, async (req, res) => {
  try {
    const { webhookUrl } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify webhook URL is valid
    try {
      const response = await axios.get(webhookUrl);
      if (!response.data || !response.data.id) {
        throw new Error('Invalid webhook URL');
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Discord webhook URL'
      });
    }

    user.discordWebhookUrl = webhookUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Discord webhook connected successfully'
    });
  } catch (error) {
    console.error('Error connecting Discord:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect Discord webhook'
    });
  }
});

// Test Discord webhook
router.post('/test', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.discordWebhookUrl) {
      return res.status(400).json({
        success: false,
        message: 'Discord webhook not configured'
      });
    }

    // Send test message to Discord
    await axios.post(user.discordWebhookUrl, {
      content: '🎉 Your Discord webhook is working! You will receive TradingView alerts here.',
      username: 'TradingView Alerts'
    });

    res.json({
      success: true,
      message: 'Test message sent successfully'
    });
  } catch (error) {
    console.error('Error testing Discord webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test message'
    });
  }
});

// Disconnect Discord
router.post('/disconnect', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.discordWebhookUrl = null;
    user.discordUserId = null;
    await user.save();

    res.json({
      success: true,
      message: 'Discord disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting Discord:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect Discord'
    });
  }
});

module.exports = router;
