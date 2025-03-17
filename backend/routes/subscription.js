const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const auth = require('../middleware/auth');

// Define plan details
const PLAN_DETAILS = {
  FREE: {
    name: 'Free Plan',
    price: 0,
    dailyAlertLimit: 7,
    features: [
      'Up to 7 alerts per day',
      'Basic notifications',
      'Email support'
    ]
  },
  BASIC: {
    name: 'Basic Plan',
    price: 4,
    dailyAlertLimit: 100,
    features: [
      'Up to 100 alerts per day',
      'Real-time notifications',
      'Basic alert customization',
      'Email support'
    ]
  },
  PRO: {
    name: 'Pro Plan',
    price: 20,
    dailyAlertLimit: 500,
    features: [
      'Up to 500 alerts per day',
      'Priority alert delivery',
      'Advanced alert customization',
      'Multiple Telegram channels',
      'Priority support',
      'API access'
    ]
  }
};

// Get subscription details
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get today's alert count
    const today = new Date().toISOString().split('T')[0];
    const alertsUsedToday = user.alertsUsed || 0;

    if (!user.stripeSubscriptionId) {
      const freePlan = PLAN_DETAILS.FREE;
      return res.json({
        status: 'active',
        planName: freePlan.name,
        price: freePlan.price,
        dailyAlertLimit: freePlan.dailyAlertLimit,
        alertsUsedToday: alertsUsedToday,
        features: freePlan.features,
        billingPeriod: 'N/A',
        lastBilling: null,
        nextBilling: null
      });
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
      {
        expand: ['items.data.price.product']
      }
    );

    const product = subscription.items.data[0].price.product;
    const planType = product.name.toUpperCase().includes('PRO') ? 'PRO' : 'BASIC';
    const planDetails = PLAN_DETAILS[planType];

    return res.json({
      status: subscription.status,
      planName: planDetails.name,
      price: planDetails.price,
      dailyAlertLimit: planDetails.dailyAlertLimit,
      alertsUsedToday: alertsUsedToday,
      features: planDetails.features,
      billingPeriod: subscription.items.data[0].price.recurring?.interval,
      lastBilling: subscription.current_period_start * 1000, // Convert to milliseconds
      nextBilling: subscription.current_period_end * 1000,   // Convert to milliseconds
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true
      }
    );

    res.json({
      message: 'Subscription will be cancelled at the end of the billing period',
      cancelDate: new Date(subscription.current_period_end * 1000)
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Immediate cancellation and downgrade to free
router.post('/downgrade-to-free', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Cancel the subscription immediately
    await stripe.subscriptions.cancel(user.stripeSubscriptionId);

    // Update user's subscription status
    user.stripeSubscriptionId = null;
    user.subscriptionStatus = 'inactive';
    await user.save();

    res.json({
      message: 'Successfully downgraded to free plan',
      plan: PLAN_DETAILS.FREE
    });
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    res.status(500).json({ error: 'Failed to downgrade subscription' });
  }
});

module.exports = router;
