import React from 'react';
import Navbar from './Navbar';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Privacy Policy
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
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Account information (email, username)</li>
            <li>Telegram contact information</li>
            <li>Trading preferences and alert settings</li>
            <li>Usage data and interaction with our service</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>Send notifications and alerts</li>
            <li>Improve and optimize our platform</li>
            <li>Communicate with you about service updates</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            This includes encryption, secure servers, and regular security audits.
          </p>

          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with:
          </p>
          <ul>
            <li>Service providers (e.g., hosting, analytics)</li>
            <li>When required by law</li>
            <li>With your explicit consent</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@tradingalerts.com
          </p>
        </div>
      </div>
    </div>
  );
}
