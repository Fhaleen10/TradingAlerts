import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F172A] text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="block px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Users
            </Link>
            <Link
              to="/admin/subscriptions"
              className="block px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Subscriptions
            </Link>
            <Link
              to="/admin/alerts"
              className="block px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Alerts
            </Link>
            <Link
              to="/admin/settings"
              className="block px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
