import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Billing = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionRes, statsRes] = await Promise.all([
          axios.get('/api/subscription'),
          axios.get('/api/alerts/stats')
        ]);
        console.log('Subscription response:', subscriptionRes.data);
        console.log('Stats response:', statsRes.data);
        setSubscription({
          ...subscriptionRes.data,
          remainingAlerts: statsRes.data.remainingAlerts,
          dailyLimit: statsRes.data.dailyLimit
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = async (plan) => {
    try {
      setLoading(true);
      // Get the price ID based on the plan
      const priceId = plan === 'pro' ? import.meta.env.VITE_STRIPE_PRO_PRICE_ID : import.meta.env.VITE_STRIPE_BASIC_PRICE_ID;
      
      const response = await axios.post('/api/checkout/create-checkout-session', {
        priceId
      });
      
      const { sessionId } = response.data;
      const stripe = await stripePromise;
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/subscription/downgrade-to-free');
      
      // Refresh subscription data
      const fetchData = async () => {
        try {
          const [subscriptionRes, statsRes] = await Promise.all([
            axios.get('/api/subscription'),
            axios.get('/api/alerts/stats')
          ]);
          console.log('Subscription response:', subscriptionRes.data);
          console.log('Stats response:', statsRes.data);
          setSubscription({
            ...subscriptionRes.data,
            remainingAlerts: statsRes.data.remainingAlerts,
            dailyLimit: statsRes.data.dailyLimit
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      
      // Show success message
      alert('Successfully downgraded to free plan. Your paid features will be available until the end of your current billing period.');
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      alert('Failed to downgrade subscription. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Current Subscription</h2>
          
          {subscription && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <p className="font-medium text-lg">{subscription.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-lg">
                    {subscription.price === 0 ? 'Free' : `$${subscription.price}/month`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Daily Alert Limit</p>
                  <p className="font-medium text-lg">{subscription.dailyAlertLimit} alerts</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining/Daily Limit</p>
                  <p className="font-medium text-lg">{subscription?.remainingAlerts || 0} / {subscription?.dailyLimit || subscription?.dailyAlertLimit || 0}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Billing Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Last Billing Date</p>
                    <p className="font-medium">{formatDate(subscription.lastBilling)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Billing Date</p>
                    <p className="font-medium">{formatDate(subscription.nextBilling)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Plan Features</h3>
                <ul className="space-y-2">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {subscription.planName === 'Free Plan' && (
                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => handleUpgrade('basic')}
                    className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Upgrade to Basic Plan - $4/month'}
                  </button>
                  <button
                    onClick={() => handleUpgrade('pro')}
                    className="w-full bg-primary-800 text-white px-4 py-2 rounded-md hover:bg-primary-900 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Upgrade to Pro Plan - $20/month'}
                  </button>
                </div>
              )}

              {subscription.planName === 'Basic Plan' && (
                <div className="mt-8">
                  <button
                    onClick={() => handleUpgrade('pro')}
                    className="w-full bg-primary-800 text-white px-4 py-2 rounded-md hover:bg-primary-900 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Upgrade to Pro Plan - $20/month'}
                  </button>
                  <button
                    onClick={handleDowngrade}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors mt-4"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Downgrade to Free Plan'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Your paid features will remain active until the end of your current billing period
                  </p>
                </div>
              )}

              {subscription.planName === 'Pro Plan' && (
                <div className="mt-8">
                  <button
                    onClick={handleDowngrade}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Downgrade to Free Plan'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Your paid features will remain active until the end of your current billing period
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
