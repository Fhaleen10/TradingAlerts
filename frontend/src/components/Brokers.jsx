import React from 'react';
import Navbar from './Navbar';

const brokers = [
  // Crypto Exchanges
  {
    name: 'Binance',
    category: 'Crypto Exchange',
    description: 'World\'s largest crypto exchange with extensive features and deep liquidity.',
    features: [
      'Lowest trading fees',
      'Highest liquidity',
      'Advanced trading tools',
      'Futures trading'
    ],
    link: 'https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00HFYNMVR3',
    bgColor: 'from-[#F3BA2F]/70 to-[#332600]/90' // Binance yellow to dark brown
  },
  {
    name: 'Bybit',
    category: 'Crypto Exchange',
    description: 'Leading crypto derivatives exchange with user-friendly interface.',
    features: [
      'High leverage trading',
      'Low trading fees',
      'USDT perpetuals',
      'Spot trading'
    ],
    link: 'https://www.bybit.com/invite?ref=PX561',
    bgColor: 'from-[#1A1E3D]/70 to-[#0072FF]/90' // Bybit dark blue to light blue
  },
  // Trading Tools
  {
    name: 'TradingView',
    category: 'Trading Tool',
    description: 'The most powerful and user-friendly charting platform for traders.',
    features: [
      'Advanced charting tools',
      'Custom indicators',
      'Trading community',
      'Multi-timeframe analysis'
    ],
    link: 'https://www.tradingview.com/pricing/?share_your_love=cautiousDinosa55426',
    bgColor: 'from-[#2962FF]/70 to-[#1E3A8A]/90' // TradingView blue to dark blue
  },
  {
    name: 'Probability Calculator',
    category: 'Trading Tool',
    description: 'Advanced trading probability calculator for risk management and position sizing.',
    features: [
      'Position size calculator',
      'Risk/reward analysis',
      'Win rate probability',
      'Expected value calculations'
    ],
    link: 'https://probabilitycalculator.pro/',
    bgColor: 'from-[#6366F1]/70 to-[#2D3748]/90' // Indigo to slate
  },
  // Forex Services
  {
    name: 'PaybackFX',
    category: 'Forex Service',
    description: 'Get cashback on your forex trades with the leading rebate provider.',
    features: [
      'High rebate rates',
      'Multiple broker support',
      'Fast payouts',
      'Transparent tracking'
    ],
    link: 'https://paybackfx.com/?ref=your-affiliate-id',
    bgColor: 'from-[#FF6B6B]/70 to-[#2D3436]/90' // Bright red to dark gray
  }
];

export default function Brokers() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Trading Platforms
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our recommended cryptocurrency exchanges, forex brokers, and trading tools that work seamlessly with TradingAlerts.
            </p>
          </div>
        </div>
      </div>

      {/* Category Headers and Broker Cards */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {/* Crypto Exchanges Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
            Cryptocurrency Exchanges
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {brokers
              .filter(broker => broker.category === 'Crypto Exchange')
              .map((broker) => (
                <BrokerCard key={broker.name} broker={broker} />
              ))}
          </div>
        </div>

        {/* Trading Tools Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
            Trading Tools
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {brokers
              .filter(broker => broker.category === 'Trading Tool')
              .map((broker) => (
                <BrokerCard key={broker.name} broker={broker} />
              ))}
          </div>
        </div>

        {/* Forex Services Section */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
            Forex Services
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {brokers
              .filter(broker => broker.category === 'Forex Service')
              .map((broker) => (
                <BrokerCard key={broker.name} broker={broker} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrokerCard({ broker }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${broker.bgColor}`}>
      <div className="relative z-10">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-black/30 rounded-full mb-4">
          {broker.category}
        </span>
        
        {/* Broker Name */}
        <h3 className="text-2xl font-bold text-white mb-4">
          {broker.name}
        </h3>

        {/* Description */}
        <p className="text-gray-100 mb-6">
          {broker.description}
        </p>

        {/* Features List */}
        <ul className="space-y-2 mb-8">
          {broker.features.map((feature) => (
            <li key={feature} className="flex items-center text-gray-100">
              <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href={broker.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-center text-white transition-all duration-200 bg-white/10 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Start Trading
          <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
