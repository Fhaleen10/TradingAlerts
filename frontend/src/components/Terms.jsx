import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="text-primary-600 hover:text-primary-500 mb-8 inline-block">
            ← Back to home
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: December 19, 2023
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to TradingAlerts. By accessing our website and using our services, you agree to these terms of service. Please read them carefully.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Use of Service</h2>
            <p className="text-gray-600 mb-4">
              Our service provides automated trading alerts through Telegram. You must be at least 18 years old to use our services. You are responsible for maintaining the security of your account credentials.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Subscription and Payments</h2>
            <p className="text-gray-600 mb-4">
              We offer various subscription plans. Payments are processed securely through our payment providers. Subscriptions will automatically renew unless cancelled before the renewal date.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              Trading alerts are provided for informational purposes only. We are not financial advisors, and our service should not be considered financial advice. Trading involves risk, and you should trade responsibly.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Service Availability</h2>
            <p className="text-gray-600 mb-4">
              While we strive for 100% uptime, we cannot guarantee uninterrupted service. We are not responsible for delays or failures in delivering alerts due to technical issues beyond our control.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Termination</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion. You may cancel your subscription at any time.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We may modify these terms at any time. Continued use of our service after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Contact</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these terms, please contact us at support@tradingalerts.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
