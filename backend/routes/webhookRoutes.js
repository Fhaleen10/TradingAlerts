const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Alert = require('../models/alert');
const telegramBot = require('../services/telegramBot');
const discordService = require('../services/discordService');

// Handle incoming webhook from TradingView
router.post('/:userId/:token', async (req, res) => {
    try {
        console.log('Received webhook:', {
            userId: req.params.userId,
            body: req.body
        });

        // Find user and validate token
        const user = await User.findById(req.params.userId);
        if (!user || user.webhookToken !== req.params.token) {
            console.error('Invalid webhook token or user not found');
            return res.status(403).json({ success: false, message: 'Invalid webhook token' });
        }

        // Handle test requests
        if (req.body.test) {
            console.log('Processing test webhook');
            let notifications = [];
            
            if (user.notifications?.telegram && user.telegramChatId) {
                const telegramSent = await telegramBot.sendMessage(
                    user.telegramChatId,
                    '✅ Webhook Test Successful!\n\nYour TradingView alerts are properly configured and will be delivered to this chat.'
                );
                notifications.push({ channel: 'telegram', delivered: telegramSent });
            }

            if (user.notifications?.discord && user.discordWebhookUrl) {
                const discordSent = await discordService.sendMessage(
                    user.discordWebhookUrl,
                    '✅ Webhook Test Successful!\n\nYour TradingView alerts are properly configured and will be delivered to this channel.'
                );
                notifications.push({ channel: 'discord', delivered: discordSent });
            }

            return res.json({ 
                success: true, 
                message: 'Test successful',
                notifications
            });
        }

        // Parse alert data from TradingView
        const alertData = {
            userId: user._id,
            symbol: req.body.symbol || 'Unknown',
            exchange: req.body.exchange || 'Unknown',
            message: req.body.message || req.body.text || 'No message provided',
            status: 'triggered',
            triggeredAt: new Date()
        };

        // Create and save alert to database
        const alert = new Alert(alertData);
        await alert.save();
        console.log('Alert saved to database:', alert._id);

        // Send notifications based on user preferences
        const notifications = [];

        // Send alert to Telegram if enabled and configured
        if (user.notifications?.telegram && user.telegramChatId) {
            try {
                const telegramSent = await telegramBot.sendAlert(user.telegramChatId, alertData);
                notifications.push({ channel: 'telegram', delivered: telegramSent });
                console.log('Alert sent to Telegram successfully');
            } catch (error) {
                console.error('Failed to send Telegram alert:', error);
                notifications.push({ channel: 'telegram', delivered: false, error: error.message });
            }
        }

        // Send alert to Discord if enabled and configured
        if (user.notifications?.discord && user.discordWebhookUrl) {
            try {
                const discordSent = await discordService.sendAlert(user.discordWebhookUrl, alertData);
                notifications.push({ channel: 'discord', delivered: discordSent });
                console.log('Alert sent to Discord successfully');
            } catch (error) {
                console.error('Failed to send Discord alert:', error);
                notifications.push({ channel: 'discord', delivered: false, error: error.message });
            }
        }

        // Increment alerts used
        await user.incrementAlertsUsed();

        res.json({ 
            success: true, 
            message: 'Alert processed successfully',
            remainingAlerts: user.alertsLimit - user.alertsUsed,
            notifications
        });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to process alert' 
        });
    }
});

module.exports = router;
