import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegramChatId: '',
    notifications: {
      email: true,
      telegram: true,
      discord: true,
      priceAlerts: true,
      technicalAlerts: true,
    }
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [testingDiscord, setTestingDiscord] = useState(false);
  const [discordStatus, setDiscordStatus] = useState({ connected: false, userId: null });
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');

  useEffect(() => {
    loadUserSettings();
    checkDiscordStatus();
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      const settings = response.data;
      setFormData(prev => ({
        ...prev,
        name: settings.name || '',
        email: settings.email || '',
        telegramChatId: settings.telegramChatId || '',
        notifications: {
          ...prev.notifications,
          ...(settings.notifications || {})
        }
      }));
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to load settings', 
        type: 'error' 
      });
    }
  };

  const checkDiscordStatus = async () => {
    try {
      const response = await axios.get('/api/discord/status');
      if (response.data.success) {
        setDiscordStatus({
          connected: response.data.connected,
          userId: response.data.userId
        });
      }
    } catch (error) {
      console.error('Failed to check Discord status:', error);
    }
  };

  const connectDiscord = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/discord/connect', {
        webhookUrl: discordWebhookUrl
      });
      if (response.data.success) {
        setMessage({
          text: 'Discord webhook connected successfully!',
          type: 'success'
        });
        checkDiscordStatus();
        setDiscordWebhookUrl('');
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to connect Discord webhook',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testDiscordWebhook = async () => {
    try {
      setTestingDiscord(true);
      const response = await axios.post('/api/discord/test');
      setMessage({ text: 'Test message sent to Discord!', type: 'success' });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to send test message',
        type: 'error'
      });
    } finally {
      setTestingDiscord(false);
    }
  };

  const disconnectDiscord = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/discord/disconnect');
      if (response.data.success) {
        setMessage({
          text: 'Discord disconnected successfully',
          type: 'success'
        });
        checkDiscordStatus();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to disconnect Discord',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Update all settings at once
      const response = await axios.put('/api/users/profile', {
        name: formData.name,
        email: formData.email,
        notifications: formData.notifications
      });

      // If telegram chat ID is provided, update it separately
      if (formData.telegramChatId) {
        const telegramResponse = await axios.post('/api/auth/telegram', {
          chatId: formData.telegramChatId.toString()
        });
        
        if (!telegramResponse.data.success) {
          throw new Error(telegramResponse.data.message);
        }
      }

      // Update the user in AuthContext with the new data
      updateUser(response.data);

      setMessage({ text: 'Settings updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update settings', 
        type: 'error' 
      });
      
      // Reload settings to ensure UI is in sync with backend
      loadUserSettings();
    } finally {
      setLoading(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    try {
      const response = await axios.post('/api/auth/test-telegram');
      setMessage({ text: 'Test message sent! Check your Telegram.', type: 'success' });
    } catch (error) {
      console.error('Error sending test message:', error);
      setMessage({ 
        text: error.response?.data?.message || error.message || 'Failed to send test message', 
        type: 'error' 
      });
    } finally {
      setTestingTelegram(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-10 divide-y divide-gray-900/10">
        {/* Profile Section */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Update your account settings and preferences.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Name */}
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Telegram Chat ID */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Telegram Chat ID
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      name="telegramChatId"
                      value={formData.telegramChatId}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      disabled={!formData.telegramChatId || testingTelegram}
                      className={`rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                        !formData.telegramChatId || testingTelegram ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {testingTelegram ? 'Sending...' : 'Test Connection'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    To get your Chat ID:
                    <ol className="list-decimal ml-5 mt-1">
                      <li>Open Telegram</li>
                      <li>Search for @TradingviewToAnywhereBot</li>
                      <li>Start the bot with /start command</li>
                      <li>Copy the Chat ID provided by the bot</li>
                    </ol>
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="px-4 py-6 sm:p-8 border-t border-gray-900/10">
              <div className="max-w-2xl space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    Notification Methods
                  </legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          type="checkbox"
                          name="telegram"
                          checked={formData.notifications.telegram}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label className="font-medium text-gray-900">Telegram notifications</label>
                        <p className="text-gray-500">Get alerts via Telegram.</p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          type="checkbox"
                          name="discord"
                          checked={formData.notifications.discord}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label className="font-medium text-gray-900">Discord notifications</label>
                        <p className="text-gray-500">Get alerts via Discord.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            {/* Message display */}
            {message.text && (
              <div className={`mx-8 mb-4 rounded-md p-4 ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                type="submit"
                disabled={loading}
                className={`rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Discord Integration</h2>
        
        {discordStatus.connected ? (
          <div>
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 mr-2 rounded-full bg-green-500"></span>
                Connected
              </span>
            </div>
            
            <div className="space-x-4">
              <button
                onClick={testDiscordWebhook}
                disabled={testingDiscord}
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
              >
                {testingDiscord ? 'Sending...' : 'Test Connection'}
              </button>
              
              <button
                onClick={disconnectDiscord}
                disabled={loading}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
              >
                Disconnect Discord
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700 mb-4">
              Follow these steps to connect your Discord account:
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2 mb-4">
              <li>Create a webhook in your Discord server (Server Settings → Integrations → Webhooks)</li>
              <li>Copy the webhook URL</li>
              <li>Paste it below and click Connect</li>
            </ol>

            <div className="space-y-4">
              <div>
                <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
                  Discord Webhook URL
                </label>
                <input
                  type="text"
                  id="webhookUrl"
                  value={discordWebhookUrl}
                  onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://discord.com/api/webhooks/..."
                />
              </div>
              
              <button
                onClick={connectDiscord}
                disabled={loading || !discordWebhookUrl}
                className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Discord'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
