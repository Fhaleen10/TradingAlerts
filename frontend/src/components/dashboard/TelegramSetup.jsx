import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TelegramSetup() {
  const [chatId, setChatId] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Load current Telegram settings
    const loadSettings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/telegram-settings');
        setChatId(response.data.telegramChatId || '');
        setIsEnabled(response.data.telegramEnabled || false);
      } catch (err) {
        console.error('Failed to load Telegram settings:', err);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      const response = await axios.post('http://localhost:3001/api/user/telegram-settings', {
        chatId,
        enabled: isEnabled
      });

      if (response.data.success) {
        setStatus('Telegram settings updated successfully! Test message sent to your chat.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update Telegram settings');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4">Telegram Setup</h2>
        <p className="text-gray-600 mb-6">
          Follow these steps to receive alerts on Telegram:
        </p>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Step 1: Start the Bot</h3>
              <p className="text-gray-600 mb-4">
                Click the button below to open our Telegram bot:
              </p>
              <a
                href="https://t.me/TradingviewToAnywhereBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Open Telegram Bot
              </a>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Step 2: Get Your Chat ID</h3>
              <p className="text-gray-600 mb-4">
                1. Click "Start" in the Telegram chat<br />
                2. The bot will reply with your Chat ID<br />
                3. Copy the Chat ID and paste it below
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Step 3: Configure Settings</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="chatId" className="block text-sm font-medium text-gray-700">
                    Telegram Chat ID
                  </label>
                  <input
                    type="text"
                    id="chatId"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter your Chat ID"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                    Enable Telegram notifications
                  </label>
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                {status && (
                  <div className="text-green-600 text-sm">{status}</div>
                )}

                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
