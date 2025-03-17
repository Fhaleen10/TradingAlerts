const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const sendPasswordResetEmail = require('../services/sendPasswordResetEmail');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ 
        success: false,
        message: 'Account with this email already exists' 
      });
    }

    // Create new user
    user = new User({
      email,
      password,
      name: name || email.split('@')[0], // Use name if provided, otherwise use email prefix
      plan: 'free',
      planActivatedAt: new Date(),
      alertsLimit: 7,
      alertsUsed: 0
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        alertsLimit: user.alertsLimit,
        alertsUsed: user.alertsUsed
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(200).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        alertsLimit: user.alertsLimit,
        alertsUsed: user.alertsUsed
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error in get user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get user settings
router.get('/settings', auth, async (req, res) => {
  try {
    console.log('Getting settings for user ID:', req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    console.log('Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({
      success: true,
      settings: {
        name: user.name,
        email: user.email,
        telegramChatId: user.telegramChatId,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching settings' 
    });
  }
});

// Update user settings
router.post('/settings', auth, async (req, res) => {
  try {
    console.log('Updating settings for user ID:', req.user.userId);
    console.log('Update data:', req.body);
    
    const { email, currentPassword, newPassword, name } = req.body;
    const user = await User.findById(req.user.userId);
    console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Update email if provided
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(200).json({ 
          success: false,
          message: 'Email already in use' 
        });
      }
      user.email = email;
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(200).json({ 
          success: false,
          message: 'Current password is incorrect' 
        });
      }
      user.password = newPassword;
    }

    console.log('Saving user updates...');
    await user.save();
    console.log('User updates saved successfully');

    res.json({ 
      success: true,
      message: 'Settings updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        alertsLimit: user.alertsLimit,
        alertsUsed: user.alertsUsed
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Update Telegram chat ID
// IMPORTANT: This code has been carefully designed to handle Telegram chat ID assignments.
// DO NOT modify this logic unless explicitly requested. The current implementation:
// 1. Ensures only one user can have a specific chat ID
// 2. Allows users to reuse their previous chat IDs
// 3. Properly handles chat ID transfers between users
// Last updated: 2024-12-27 - Fixed issue with reusing previous chat IDs
router.post('/telegram', auth, async (req, res) => {
  try {
    const { chatId } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // First, find and remove this chat ID from any user that might have it
    await User.updateMany(
      { telegramChatId: chatId.toString() },
      { $set: { telegramChatId: null } }
    );

    // Now set it for the current user
    user.telegramChatId = chatId.toString();
    await user.save();

    res.json({ 
      success: true,
      message: 'Telegram chat ID updated successfully',
      telegramChatId: user.telegramChatId
    });
  } catch (error) {
    console.error('Error updating Telegram chat ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating Telegram chat ID' 
    });
  }
});

// Test Telegram connection
router.post('/test-telegram', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (!user.telegramChatId) {
      return res.status(400).json({ 
        success: false,
        message: 'Please set up your Telegram chat ID first' 
      });
    }

    const telegramBot = require('../services/telegramBot');
    await telegramBot.sendMessage(
      user.telegramChatId,
      `🔔 Test Message\n\nYour Telegram notifications are working correctly!\n\nAccount: ${user.email}`
    );

    res.json({ 
      success: true,
      message: 'Test message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending test message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send test message' 
    });
  }
});

// Forgot Password endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Attempting password reset for email:', email);

    // List all users in database for debugging
    const allUsers = await User.find({});
    console.log('All users in database:', allUsers.map(u => u.email));

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      // Don't reveal whether a user exists
      console.log('No user found with email:', email);
      return res.status(200).json({
        message: 'If an account exists with this email, you will receive password reset instructions.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    console.log('Reset token generated for user:', email);

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log('Reset email sent successfully to:', email);
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      if (emailError.response) {
        console.error('SendGrid Error Details:', emailError.response.body);
      }
      throw emailError;
    }

    res.status(200).json({
      message: 'If an account exists with this email, you will receive password reset instructions.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// Reset Password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log('Attempting to reset password with token');

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      console.log('No user found with valid token');
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    console.log('Found user:', user.email);

    // Update user's password
    user.password = password; // Mongoose will hash this automatically via the pre-save hook
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    console.log('Password updated successfully for user:', user.email);

    res.status(200).json({ message: 'Password successfully reset.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

module.exports = router;
