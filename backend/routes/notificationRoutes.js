const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const telegramBot = require('../services/telegramBot');
const discordService = require('../services/discordService');
const { sendTestEmail } = require('../services/emailService');

// Test all connected notification channels
router.post('/test-all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const results = {
      email: false,
      telegram: false,
      discord: false
    };

    // Test email if enabled
    if (user.notifications.email) {
      try {
        await sendTestEmail(user.email);
        results.email = true;
      } catch (error) {
        console.error('Error sending test email:', error);
      }
    }

    // Test Telegram if connected and enabled
    if (user.notifications.telegram && user.telegramChatId) {
      try {
        await telegramBot.sendMessage(
          user.telegramChatId,
          '🎉 Your TradingView Alerts bot is working! You will receive alerts here.'
        );
        results.telegram = true;
      } catch (error) {
        console.error('Error sending test Telegram message:', error);
      }
    }

    // Test Discord if connected and enabled
    if (user.notifications.discord && user.discordWebhookUrl) {
      try {
        await discordService.sendMessage(
          user.discordWebhookUrl,
          '🎉 Your TradingView Alerts bot is working! You will receive alerts here.'
        );
        results.discord = true;
      } catch (error) {
        console.error('Error sending test Discord message:', error);
      }
    }

    // Check if any notifications were sent
    const anySuccess = Object.values(results).some(result => result);
    if (!anySuccess) {
      return res.status(400).json({
        success: false,
        message: 'No notification channels are connected or enabled',
        results
      });
    }

    res.json({
      success: true,
      message: 'Test notifications sent successfully',
      results
    });
  } catch (error) {
    console.error('Error testing notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notifications'
    });
  }
});

module.exports = router;
