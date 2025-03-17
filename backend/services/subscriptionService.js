const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendEmail } = require('./emailService');
const User = require('../models/User');

// Stripe product configuration
const STRIPE_PRICES = {
    FREE: 'price_1QYOJcBcUYf2sT1YlGVpIU9U',    // Free plan
    BASIC: 'price_1QYOMQBcUYf2sT1YJ91FjLey',   // Basic plan
    PRO: 'price_1QYOMtBcUYf2sT1YV85wYLik'      // Pro plan
};

// Plan details
const PLAN_DETAILS = {
    FREE: {
        name: 'Free',
        dailyAlertLimit: 7,
        price: 0
    },
    BASIC: {
        name: 'Basic',
        dailyAlertLimit: 100,
        price: 4
    },
    PRO: {
        name: 'Pro',
        dailyAlertLimit: 500,
        price: 20
    }
};

async function createCheckoutSession(userId, planId) {
    try {
        // Get the price ID based on the plan
        const priceId = STRIPE_PRICES[planId];
        if (!priceId) {
            throw new Error('Invalid plan selected');
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/billing?success=false`,
            metadata: {
                userId: userId.toString(),
                planId: planId
            }
        });

        return session;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}

async function handleSuccessfulPayment(sessionId) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const { userId, planId } = session.metadata;
        
        // Update user's subscription in our database
        const user = await User.findById(userId);
        if (user) {
            user.plan = planId.toLowerCase();
            user.planActivatedAt = new Date();
            user.alertsLimit = PLAN_DETAILS[planId].dailyAlertLimit;
            await user.save();
            
            // Send confirmation email
            await sendEmail(user.email, {
                template: 'subscription-activated',
                data: {
                    name: user.email.split('@')[0],
                    plan: PLAN_DETAILS[planId].name,
                    dailyAlertLimit: PLAN_DETAILS[planId].dailyAlertLimit,
                    expiryDate: new Date(user.planActivatedAt.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                }
            });
        }
    } catch (error) {
        console.error('Error handling successful payment:', error);
        throw error;
    }
}

async function getSubscriptionDetails(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const planKey = user.plan.toUpperCase();
        const plan = PLAN_DETAILS[planKey] || PLAN_DETAILS.FREE;

        return {
            currentPlan: user.plan,
            planName: plan.name,
            dailyAlertLimit: user.alertsLimit,
            alertsUsed: user.alertsUsed,
            planActivatedAt: user.planActivatedAt,
            nextBillingDate: user.plan !== 'free' ? 
                new Date(user.planActivatedAt.getTime() + 30 * 24 * 60 * 60 * 1000) : null
        };
    } catch (error) {
        console.error('Error getting subscription details:', error);
        throw error;
    }
}

function getAvailablePlans() {
    return Object.entries(PLAN_DETAILS).map(([key, plan]) => ({
        id: key,
        ...plan
    }));
}

module.exports = {
    createCheckoutSession,
    handleSuccessfulPayment,
    getSubscriptionDetails,
    getAvailablePlans,
    PLAN_DETAILS
};
