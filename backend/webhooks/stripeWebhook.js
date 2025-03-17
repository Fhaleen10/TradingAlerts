const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getUser, updateUser, getAllUsers } = require('../data/users');
const { sendEmail } = require('../services/emailService');

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log('Webhook received:', event.type);

        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                const subscription = event.data.object;
                const userId = parseInt(subscription.metadata.userId);
                const user = getUser(userId);
                
                if (user) {
                    updateUser(userId, {
                        subscription: subscription.metadata.planId,
                        subscriptionExpiryDate: new Date(subscription.current_period_end * 1000)
                    });
                    
                    // Send confirmation email
                    await sendEmail(user.email, {
                        template: 'subscription-updated',
                        data: {
                            name: user.email,
                            plan: subscription.metadata.planId,
                            expiryDate: new Date(subscription.current_period_end * 1000).toLocaleDateString()
                        }
                    });
                }
                break;

            case 'customer.subscription.deleted':
                const cancelledSub = event.data.object;
                const cancelledUserId = parseInt(cancelledSub.metadata.userId);
                const cancelledUser = getUser(cancelledUserId);
                
                if (cancelledUser) {
                    updateUser(cancelledUserId, {
                        subscription: 'FREE',
                        subscriptionExpiryDate: null
                    });
                    
                    // Send cancellation email
                    await sendEmail(cancelledUser.email, {
                        template: 'subscription-cancelled',
                        data: {
                            name: cancelledUser.email
                        }
                    });
                }
                break;

            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                const failedUserId = parseInt(failedInvoice.metadata.userId);
                const failedUser = getUser(failedUserId);
                
                if (failedUser) {
                    // Send payment failed email
                    await sendEmail(failedUser.email, {
                        template: 'payment-failed',
                        data: {
                            name: failedUser.email,
                            amount: (failedInvoice.amount_due / 100).toFixed(2),
                            nextAttempt: new Date(failedInvoice.next_payment_attempt * 1000).toLocaleDateString()
                        }
                    });
                }
                break;
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

router.post('/stripe', express.raw({type: 'application/json'}), handleWebhook);

module.exports = router;
