import React from 'react';
import { BoltIcon, ChatBubbleBottomCenterTextIcon, GlobeAltIcon, ScaleIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Real-Time Alerts',
    description: 'Receive TradingView alerts instantly on your Telegram and Discord, ensuring you never miss a trading opportunity.',
    icon: BoltIcon,
  },
  {
    name: 'Easy Integration',
    description: 'Set up in minutes with our simple webhook integration. No coding knowledge required.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Customizable Notifications',
    description: 'Customize your alert messages and format them exactly how you want them to appear.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: 'Reliable Service',
    description: '99.9% uptime guarantee. Your alerts will be delivered reliably, every time.',
    icon: ScaleIcon,
  },
];

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Trade Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for automated trading alerts
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform seamlessly connects TradingView with Telegram and Discord, providing you with instant, reliable trading alerts.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
