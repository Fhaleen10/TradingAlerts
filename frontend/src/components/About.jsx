import React from 'react';
import Navbar from './Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              About Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Empowering traders with real-time alerts and automation
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Mission</h2>
              <p className="mt-4 text-lg text-gray-600">
                At TradingAlerts, we're dedicated to helping traders stay on top of market movements and make informed decisions. 
                Our platform bridges the gap between TradingView's powerful analysis tools and instant mobile notifications, 
                ensuring you never miss an important trading opportunity.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">What We Offer</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Instant Notifications</h3>
                  <p className="mt-2 text-gray-600">
                    Receive your TradingView alerts instantly through Telegram, allowing you to react quickly to market movements.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Easy Integration</h3>
                  <p className="mt-2 text-gray-600">
                    Set up in minutes with our simple webhook integration. No complex configurations or technical knowledge required.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Reliable Service</h3>
                  <p className="mt-2 text-gray-600">
                    Built on robust infrastructure to ensure your alerts are delivered reliably and without delay.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Commitment</h2>
              <p className="mt-4 text-lg text-gray-600">
                We're committed to providing a reliable, secure, and user-friendly service that enhances your trading experience. 
                Our team continuously works to improve and expand our offerings based on user feedback and market needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
