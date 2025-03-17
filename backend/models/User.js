const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Optional
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  telegramChatId: {
    type: String,
    default: null,
  },
  discordUserId: {
    type: String,
    default: null,
  },
  discordWebhookUrl: {
    type: String,
    default: null,
  },
  notifications: {
    email: {
      type: Boolean,
      default: true,
    },
    telegram: {
      type: Boolean,
      default: true,
    },
    discord: {
      type: Boolean,
      default: true,
    },
    priceAlerts: {
      type: Boolean,
      default: true,
    },
    technicalAlerts: {
      type: Boolean,
      default: true,
    },
  },
  telegramVerificationCode: {
    type: String,
    default: null,
  },
  telegramVerificationExpires: {
    type: Date,
    default: null,
  },
  resetToken: String,
  resetTokenExpiry: Date,
  stripeCustomerId: {
    type: String,
    default: null,
  },
  stripeSubscriptionId: {
    type: String,
    default: null,
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },
  planActivatedAt: {
    type: Date,
    default: Date.now,
  },
  alertsUsed: {
    type: Number,
    default: 0,
  },
  alertsLimit: {
    type: Number,
    default: 7,
  },
  webhookToken: String,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to generate telegram verification code
userSchema.methods.generateTelegramVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.telegramVerificationCode = code;
  this.telegramVerificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  return code;
};

// Method to verify if telegram code is valid
userSchema.methods.isTelegramCodeValid = function(code) {
  return this.telegramVerificationCode === code && 
         this.telegramVerificationExpires > new Date();
};

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to update alerts count
userSchema.methods.incrementAlertsUsed = async function() {
  this.alertsUsed += 1;
  await this.save();
};

// Method to check if user has reached alerts limit
userSchema.methods.hasReachedAlertsLimit = function() {
  return this.alertsUsed >= this.alertsLimit;
};

// Method to reset alerts count (called daily)
userSchema.methods.resetAlertsCount = async function() {
  this.alertsUsed = 0;
  await this.save();
};

// Method to update plan
userSchema.methods.updatePlan = async function(newPlan) {
  this.plan = newPlan;
  this.planActivatedAt = new Date();
  if (newPlan === 'pro') {
    this.alertsLimit = 100;
  }
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
