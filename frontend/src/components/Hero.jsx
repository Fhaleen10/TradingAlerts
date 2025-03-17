import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative isolate pt-14 bg-gradient-to-b from-primary-50 to-white">
      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Automate Your Trading Alerts with Ease
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get instant notifications for your TradingView alerts through Telegram and Discord. Stay informed about market movements and never miss a trading opportunity.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-16 flow-root sm:mt-24">
        <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
          <img
            src="https://cdn.pixabay.com/photo/2021/05/27/06/01/stock-market-6287145_1280.jpg"
            alt="Trading Dashboard Screenshot"
            className="rounded-md shadow-2xl ring-1 ring-gray-900/10 w-full h-auto object-cover"
            onError={(e) => {
              e.target.src = 'https://cdn.pixabay.com/photo/2021/05/27/06/01/stock-market-6287145_1280.jpg';
            }}
          />
        </div>
      </div>
    </div>
  );
}
