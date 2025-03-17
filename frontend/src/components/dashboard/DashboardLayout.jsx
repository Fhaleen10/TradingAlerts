import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
  { name: 'Alerts History', href: '/dashboard/alerts', icon: 'BellAlertIcon' },
  { name: 'TradingView Setup', href: '/dashboard/tradingview-setup', icon: 'WrenchScrewdriverIcon' },
  { name: 'Billing', href: '/dashboard/billing', icon: 'CreditCardIcon' },
  { name: 'Settings', href: '/dashboard/settings', icon: 'Cog6ToothIcon' },
];

export default function DashboardLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar navigation={navigation} />
      </div>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
