const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current subscription details
router.get('/current', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscription = {
      plan: user.plan,
      planName: user.plan === 'pro' ? 'Pro' : 'Free',
      price: user.plan === 'pro' ? 29 : 0,
      activatedAt: user.planActivatedAt,
      alertsUsed: user.alertsUsed,
      alertsLimit: user.alertsLimit,
      alertsUsedToday: user.alertsUsed,
      dailyAlertLimit: user.alertsLimit,
      alertsRemaining: user.alertsLimit - user.alertsUsed,
      status: 'active',
      currentPlan: user.plan.toUpperCase()
    };

    // If user has Stripe subscription, get additional details
    if (user.stripeSubscriptionId) {
      const stripeSubscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      subscription.nextBillingDate = new Date(stripeSubscription.current_period_end * 1000);
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Error fetching subscription details' });
  }
});

// Get available subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free Plan',
        price: 0,
        alertsLimit: 7,
        features: [
          'Up to 7 alerts per day',
          'Basic Telegram notifications',
          'Manual alert reset'
        ]
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        price: 9.99,
        priceId: process.env.STRIPE_PRO_PRICE_ID,
        alertsLimit: 100,
        features: [
          'Up to 100 alerts per day',
          'Priority Telegram notifications',
          'Automatic daily alert reset',
          'Premium support'
        ]
      }
    ];
    
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Error fetching subscription plans' });
  }
});

// Upgrade subscription
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If downgrading to free plan
    if (planId === 'free') {
      if (user.stripeSubscriptionId) {
        await stripe.subscriptions.del(user.stripeSubscriptionId);
      }
      await user.updatePlan('free');
      return res.json({ message: 'Successfully downgraded to free plan' });
    }

    // For pro plan, create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/billing?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ message: 'Error processing subscription upgrade' });
  }
});

// Create checkout session
router.post('/checkout', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    const user = await User.findById(req.user.id);

    let priceId;
    switch (planId) {
      case 'BASIC':
        priceId = process.env.STRIPE_BASIC_PRICE_ID;
        break;
      case 'PRO':
        priceId = process.env.STRIPE_PRO_PRICE_ID;
        break;
      default:
        return res.status(400).json({ error: 'Invalid plan' });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: user.id,
        planId: planId
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const user = await User.findOne({ stripeCustomerId: session.customer });
      if (user) {
        user.stripeSubscriptionId = session.subscription;
        await user.updatePlan('pro');
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const user = await User.findOne({ stripeSubscriptionId: subscription.id });
      if (user) {
        user.stripeSubscriptionId = null;
        await user.updatePlan('free');
      }
      break;
    }
  }

  response.json({ received: true });
});

module.exports = router;
