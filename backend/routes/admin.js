const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Alert = require('../models/Alert');
const axios = require('axios');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user plan
router.put('/users/:userId/plan', async (req, res) => {
    try {
        const { userId } = req.params;
        const { plan } = req.body;
        // This would update the user's plan in your database
        res.json({ message: `Updated user ${userId} to plan ${plan}` });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Toggle user status
router.put('/users/:userId/status', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        // This would update the user's status in your database
        res.json({ message: `Updated user ${userId} status to ${status}` });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send custom alert to webhook
router.post('/send-alert', auth, isAdmin, async (req, res) => {
    try {
        const { userId, alertText } = req.body;

        if (!userId || !alertText) {
            return res.status(400).json({ message: 'User ID and alert text are required' });
        }

        // Get user's webhook URL
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.webhookUrl) {
            return res.status(400).json({ message: 'User does not have a webhook URL configured' });
        }

        // Send the alert to the webhook
        const response = await axios.post(user.webhookUrl, {
            message: alertText
        });

        if (response.status >= 200 && response.status < 300) {
            // Log the alert
            await Alert.create({
                userId: user._id,
                type: 'custom',
                message: alertText,
                webhookUrl: user.webhookUrl,
                status: 'sent',
                sentAt: new Date()
            });

            res.json({ message: 'Alert sent successfully' });
        } else {
            res.status(400).json({ message: 'Failed to send alert to webhook' });
        }
    } catch (error) {
        console.error('Error sending alert:', error);
        res.status(500).json({ message: 'Failed to send alert' });
    }
});

module.exports = router;
