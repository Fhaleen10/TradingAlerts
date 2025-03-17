const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, telegramUsername, notifications } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (telegramUsername) user.telegramUsername = telegramUsername;

    // Update notification settings if provided
    if (notifications) {
      user.notifications = {
        ...user.notifications,
        ...notifications
      };
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's subscription status
router.get('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('subscription');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's alert usage
router.get('/alerts/usage', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('alertsUsed alertLimit');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      used: user.alertsUsed || 0,
      limit: user.alertLimit || 0,
      remaining: (user.alertLimit || 0) - (user.alertsUsed || 0)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
