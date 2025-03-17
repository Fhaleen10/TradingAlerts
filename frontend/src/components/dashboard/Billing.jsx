import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';  // Import configured axios instance
import { useAuth } from '../../context/AuthContext';

export default function Billing() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      console.log('Fetching subscription details...');
      const response = await axios.get('/api/subscription/current');
      console.log('Subscription data:', response.data);
      setSubscription(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Current Plan Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Plan Name</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">{subscription?.planName || 'Loading...'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscription?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subscription?.status ? (subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)) : 'Loading...'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Monthly Price</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">${subscription?.price || 0}/month</dd>
                </div>
              </dl>
            </div>
            <div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Plan Started</dt>
                  <dd className="mt-1 text-gray-900">{subscription?.activatedAt ? formatDate(subscription.activatedAt) : 'Loading...'}</dd>
                </div>
                {subscription?.nextBillingDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
                    <dd className="mt-1 text-gray-900">{formatDate(subscription.nextBillingDate)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Usage Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Daily Alerts</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Used Today</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {subscription?.alertsUsedToday || 0} / {subscription?.dailyAlertLimit || 0}
                  </dd>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${subscription ? (subscription.alertsUsedToday / subscription.dailyAlertLimit) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Alerts Remaining</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Available Alerts</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {subscription?.alertsRemaining || 0}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Upgrade/Downgrade Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan Options</h2>
          <div className="space-y-4">
            {subscription?.plan === 'free' ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Upgrade to Pro</h3>
                  <p className="text-sm text-gray-500">Get unlimited daily alerts and priority support</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Upgrade Now
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Cancel Pro Plan</h3>
                  <p className="text-sm text-gray-500">Revert to Free plan at the end of billing period</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
