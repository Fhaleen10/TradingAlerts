import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from '../config/axios';
import { loadStripe } from '@stripe/stripe-js';

const tiers = [
  {
    name: 'Free',
    id: 'FREE',
    priceMonthly: '$0',
    description: 'Get started with basic features',
    features: [
      'Up to 7 alerts per day',
      'Basic notifications',
      'Email support',
    ],
    featured: false,
  },
  {
    name: 'Basic',
    id: 'BASIC',
    priceMonthly: '$7.99',
    description: 'Perfect for individual traders',
    features: [
      'Up to 100 alerts per day',
      'Real-time notifications',
      'Basic alert customization',
      'Email support',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'PRO',
    priceMonthly: '$11.99',
    description: 'For serious traders who need more',
    features: [
      'Up to 500 alerts per day',
      'Priority alert delivery',
      'Advanced alert customization',
      'Priority support',
      'API access',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'ENTERPRISE',
    priceMonthly: 'Custom',
    description: 'For large trading operations',
    features: [
      'Unlimited alerts',
      'Custom alert delivery',
      'Dedicated support team',
      'Custom integrations',
      'SLA guarantees',
      'White-label options',
    ],
    featured: false,
    isEnterprise: true,
  }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleUpgrade = async (planId) => {
    // Handle Enterprise plan
    if (planId === 'ENTERPRISE') {
      window.location.href = 'mailto:enterprise@tradingalerts.com?subject=Enterprise%20Plan%20Inquiry';
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/#pricing', plan: planId } });
      return;
    }

    // Handle free plan
    if (planId === 'FREE') {
      try {
        setLoading(true);
        await axios.post('/api/subscription/downgrade-to-free');
        navigate('/dashboard/billing');
      } catch (error) {
        console.error('Error downgrading to free plan:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Handle paid plans (Basic and Pro)
    try {
      setLoading(true);
      const priceId = planId === 'BASIC' 
        ? import.meta.env.VITE_STRIPE_BASIC_PRICE_ID 
        : import.meta.env.VITE_STRIPE_PRO_PRICE_ID;

      const response = await axios.post('/api/checkout/create-checkout-session', {
        priceId
      });
      
      const { sessionId } = response.data;
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      
      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start with our free plan and upgrade as you grow.
        </p>
        
        {/* Mobile Carousel Controls */}
        <div className="mt-8 flex justify-between items-center md:hidden">
          <button 
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            className="p-2 text-primary-600 disabled:opacity-50"
            disabled={activeIndex === 0}
          >
            ←
          </button>
          <span className="text-sm text-gray-500">
            {activeIndex + 1} / {tiers.length}
          </span>
          <button
            onClick={() => setActiveIndex(Math.min(tiers.length - 1, activeIndex + 1))}
            className="p-2 text-primary-600 disabled:opacity-50"
            disabled={activeIndex === tiers.length - 1}
          >
            →
          </button>
        </div>

        {/* Desktop Grid / Mobile Carousel */}
        <div className="mt-16 relative">
          <div className={classNames(
            'grid gap-8',
            'md:grid-cols-2 lg:grid-cols-4',
            'md:gap-8',
            'md:space-y-0'
          )}>
            {tiers.map((tier, index) => (
              <div
                key={tier.id}
                className={classNames(
                  'rounded-3xl p-8 h-full flex flex-col bg-white transition-all duration-300',
                  tier.featured ? 'ring-2 ring-primary-600' : 'ring-1 ring-gray-200',
                  'md:block', // Always visible on desktop
                  index === activeIndex ? 'block' : 'hidden md:block' // Toggle visibility on mobile
                )}
              >
                <div className="flex-1">
                  <h3
                    className={classNames(
                      tier.featured ? 'text-primary-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                    {!tier.isEnterprise && <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>}
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-primary-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={loading}
                  className={classNames(
                    tier.featured
                      ? 'bg-primary-600 text-white hover:bg-primary-500'
                      : 'text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300',
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {tier.isEnterprise ? 'Contact Sales' : 'Get started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
