import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error fetching data:', error);
    return Promise.reject(error);
  }
);

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const formatDate = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, 'MMM d, yyyy HH:mm:ss');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token found');
        }

        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch alerts and stats in parallel
        const [alertsResponse, statsResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/alerts', { headers }),
          axios.get('http://localhost:3001/api/alerts/stats', { headers })
        ]);

        if (alertsResponse.data) {
          setRecentAlerts(alertsResponse.data);
        }
        
        if (statsResponse.data) {
          setStats(statsResponse.data);
        }

        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 2 seconds for more responsive updates
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading dashboard: {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats_display = [
    {
      name: 'Remaining/Daily Limit',
      stat: `${stats.remainingAlerts}/${stats.dailyLimit}`,
      change: stats.remainingAlerts,
      changeType: 'positive',
      icon: CheckCircleIcon,
    },
    {
      name: 'Triggered Today',
      stat: stats.triggeredToday,
      change: stats.triggeredToday,
      changeType: 'positive',
      icon: CheckCircleIcon,
    },
    {
      name: 'Failed Today',
      stat: stats.failedToday,
      change: stats.failedToday,
      changeType: 'negative',
      icon: XCircleIcon,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back, {user?.name || (user?.email ? user.email.split('@')[0] : 'User')}
          </h2>
        </div>
      </div>

      <h3 className="text-base font-semibold leading-6 text-gray-900">Last 24 hours</h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats_display.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={classNames(
                  item.changeType === 'positive' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {item.changeType === 'positive' ? (
                  <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                )}
                <span className="sr-only">{item.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      {/* Recent Alerts Table */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold leading-6 text-gray-900">Recent Alerts</h2>
            <p className="mt-2 text-sm text-gray-700">
              Your 10 most recent alerts from TradingView
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0">
            <Link
              to="/dashboard/alerts"
              className="text-sm font-semibold leading-6 text-primary-600 hover:text-primary-500"
            >
              View all alerts <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Symbol
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Exchange
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Destination
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Message
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentAlerts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-sm text-gray-500">
                          No alerts received yet
                        </td>
                      </tr>
                    ) : (
                      recentAlerts.map((alert) => (
                        <tr key={alert._id || `${alert.symbol}-${alert.triggeredAt}`}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {alert.symbol}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {alert.exchange || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={classNames(
                                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                                alert.status === 'triggered'
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-red-50 text-red-700'
                              )}
                            >
                              {alert.status === 'triggered' ? (
                                <CheckCircleIcon className="mr-1 h-4 w-4 text-green-400" />
                              ) : (
                                <XCircleIcon className="mr-1 h-4 w-4 text-red-400" />
                              )}
                              {alert.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {alert.destinations?.join(', ') || 'Webhook Only'}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {alert.message}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(alert.triggeredAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
