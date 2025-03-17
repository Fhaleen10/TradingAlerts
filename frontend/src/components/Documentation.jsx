import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Documentation
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Learn how to use TradingAlerts to maximize your trading potential. Find detailed guides, tutorials, and best practices.
            </p>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                TradingAlerts Documentation
              </h1>

              {/* Getting Started Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
                <div className="prose prose-blue max-w-none">
                  <h3 className="text-lg font-semibold mb-2">1. Create an Account</h3>
                  <p className="mb-4">
                    Start by <Link to="/register" className="text-primary-600 hover:text-primary-500">creating an account</Link>. 
                    Choose between our Free and Pro plans based on your needs.
                  </p>

                  <h3 className="text-lg font-semibold mb-2">2. Set Up Notifications</h3>
                  <p className="mb-4">
                    Configure your notification preferences in the <Link to="/dashboard/settings" className="text-primary-600 hover:text-primary-500">Settings</Link> page:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Connect your Telegram account for instant alerts</li>
                    <li>Verify your email for important notifications</li>
                    <li>Customize alert preferences</li>
                  </ul>
                </div>
              </section>

              {/* TradingView Integration Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">TradingView Integration</h2>
                <div className="prose prose-blue max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Setting Up Alerts</h3>
                  <ol className="list-decimal pl-6 mb-4">
                    <li className="mb-2">Go to TradingView and create a new alert</li>
                    <li className="mb-2">In the alert dialog, select "Webhook" as the notification method</li>
                    <li className="mb-2">Copy your unique webhook URL from the <Link to="/dashboard/tradingview-setup" className="text-primary-600 hover:text-primary-500">TradingView Setup</Link> page</li>
                    <li className="mb-2">Paste the webhook URL into TradingView's webhook field</li>
                    <li>Test the connection using the "Test" button</li>
                  </ol>

                  <h3 className="text-lg font-semibold mb-2">Alert Message Format</h3>
                  <p className="mb-4">
                    Your alert message can include:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Symbol (e.g., BTCUSDT)</li>
                    <li>Exchange name</li>
                    <li>Custom message</li>
                    <li>Price levels or technical indicators</li>
                  </ul>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="font-mono text-sm">
                      Example: 🚀 {'{{symbol}}'} Alert: Price above {'{{close}}'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Managing Alerts Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Alerts</h2>
                <div className="prose prose-blue max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
                  <p className="mb-4">
                    The <Link to="/dashboard" className="text-primary-600 hover:text-primary-500">Dashboard</Link> provides:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Real-time alert status</li>
                    <li>Daily alert usage statistics</li>
                    <li>Recent alert history</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-2">Alert History</h3>
                  <p className="mb-4">
                    View your complete alert history in the <Link to="/dashboard/alerts" className="text-primary-600 hover:text-primary-500">Alerts History</Link> page:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Filter alerts by symbol or date</li>
                    <li>View alert details and status</li>
                    <li>Track delivery status across all channels</li>
                  </ul>
                </div>
              </section>

              {/* Subscription & Limits Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription & Limits</h2>
                <div className="prose prose-blue max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Up to 7 alerts per day</li>
                    <li>Basic notifications</li>
                    <li>Email support</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-2">Basic Plan - $4/month</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Up to 100 alerts per day</li>
                    <li>Real-time notifications</li>
                    <li>Basic alert customization</li>
                    <li>Email support</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-2">Pro Plan - $20/month</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Up to 500 alerts per day</li>
                    <li>Priority alert delivery</li>
                    <li>Advanced alert customization</li>
                    <li>Multiple Telegram channels</li>
                    <li>Priority support</li>
                    <li>API access</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-2">Enterprise Plan - Custom Pricing</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Unlimited alerts</li>
                    <li>Custom alert delivery</li>
                    <li>Dedicated support team</li>
                    <li>Custom integrations</li>
                    <li>SLA guarantees</li>
                    <li>White-label options</li>
                  </ul>
                  <p className="text-sm text-gray-600 mb-4">
                    For Enterprise plans, please <a href="mailto:enterprise@tradingalerts.com" className="text-primary-600 hover:text-primary-500">contact our sales team</a> to discuss your specific needs.
                  </p>

                  <p className="mb-4">
                    Manage your subscription in the <Link to="/dashboard/billing" className="text-primary-600 hover:text-primary-500">Billing</Link> page.
                  </p>
                </div>
              </section>

              {/* Support Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Support</h2>
                <div className="prose prose-blue max-w-none">
                  <p className="mb-4">
                    Need help? Contact our support team:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Email: support@tradingalerts.com</li>
                    <li>Telegram: @TradingAlertsSupport</li>
                    <li>Response time: Within 24 hours (Pro users: 4 hours)</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
