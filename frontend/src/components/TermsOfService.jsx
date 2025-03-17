import React from 'react';
import Navbar from './Navbar';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Terms of Service
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Last updated: December 25, 2024
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-3xl prose prose-blue">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TradingAlerts, you agree to be bound by these Terms of Service.
            If you disagree with any part of these terms, you may not access our service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            TradingAlerts provides a platform for receiving TradingView alerts through Telegram.
            We reserve the right to modify or discontinue the service at any time.
          </p>

          <h2>3. User Responsibilities</h2>
          <ul>
            <li>Maintain the security of your account credentials</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Use the service only for its intended purpose</li>
            <li>Not attempt to circumvent any service limitations</li>
          </ul>

          <h2>4. Service Limitations</h2>
          <p>
            Alert delivery times may vary based on network conditions and third-party services.
            We do not guarantee:
          </p>
          <ul>
            <li>Uninterrupted service availability</li>
            <li>Specific alert delivery times</li>
            <li>Trading outcomes or financial results</li>
          </ul>

          <h2>5. Subscription and Payments</h2>
          <ul>
            <li>Subscription fees are billed in advance</li>
            <li>Refunds are provided according to our refund policy</li>
            <li>We reserve the right to modify pricing with notice</li>
          </ul>

          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your account for violations of these terms.
            You may cancel your subscription at any time.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is" without warranties of any kind.
            We are not responsible for any financial losses incurred through the use of our service.
          </p>

          <h2>8. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact:
            <br />
            Email: legal@tradingalerts.com
          </p>
        </div>
      </div>
    </div>
  );
}
