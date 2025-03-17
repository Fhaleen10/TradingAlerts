import React, { useState, useEffect } from 'react';
import { ClipboardDocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TradingViewSetup() {
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWebhookUrl = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/api/alerts/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Response:', response.data);
        if (response.data && response.data.webhookUrl) {
          console.log('Setting webhook URL:', response.data.webhookUrl);
          setWebhookUrl(response.data.webhookUrl);
        } else {
          console.error('No webhook URL in response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching webhook URL:', error);
      }
    };

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      console.log('Token found in storage');
      fetchWebhookUrl();
    } else {
      console.log('No token found in storage');
    }
  }, []);

  const copyToClipboard = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validateWebhook = async () => {
    setIsValidating(true);
    setTestResults(null);
    try {
      // First, test all notification channels
      const notificationResponse = await axios.post('/api/notifications/test-all');
      setTestResults(notificationResponse.data.results);

      // Then send a test alert through the webhook
      const webhookResponse = await axios.post(webhookUrl, {
        test: true,
        symbol: "TEST/USDT",
        exchange: "TEST",
        message: "🔧 Webhook Test\n\nThis is a test alert to verify your webhook configuration.",
        value: "0.00"
      });
      
      if (webhookResponse.data.success) {
        setValidationStatus('success');
      } else {
        setValidationStatus('error');
      }
    } catch (error) {
      setValidationStatus('error');
      console.error('Webhook validation error:', error);
    }
    setIsValidating(false);
    setTimeout(() => {
      setValidationStatus(null);
      setTestResults(null);
    }, 5000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">TradingView Setup</h1>
          <p className="mt-2 text-sm text-gray-700">
            Connect your TradingView account to receive alerts through our platform.
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-3xl">
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Your Webhook URL</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Copy this webhook URL and paste it into your TradingView alert settings to start receiving alerts.
              </p>
            </div>
            <div className="mt-5">
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl || 'Loading...'}
                  className="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={validateWebhook}
                  disabled={isValidating || !webhookUrl}
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                >
                  {isValidating ? 'Testing...' : 'Test Webhook'}
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
                >
                  <ClipboardDocumentIcon className="-ml-0.5 h-5 w-5 text-white mr-1" aria-hidden="true" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {validationStatus && (
                <div className={`mt-3 flex items-center ${
                  validationStatus === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {validationStatus === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 mr-2" />
                  )}
                  <span>
                    {validationStatus === 'success' 
                      ? 'Webhook is working correctly!' 
                      : 'Failed to validate webhook. Please check the URL and try again.'}
                  </span>
                </div>
              )}

              {testResults && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notification Test Results:</h4>
                  <ul className="space-y-1 text-sm">
                    {testResults.email !== undefined && (
                      <li className="flex items-center">
                        {testResults.email ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-red-600 mr-2" />
                        )}
                        Email: {testResults.email ? 'Sent' : 'Failed'}
                      </li>
                    )}
                    {testResults.telegram !== undefined && (
                      <li className="flex items-center">
                        {testResults.telegram ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-red-600 mr-2" />
                        )}
                        Telegram: {testResults.telegram ? 'Sent' : 'Failed'}
                      </li>
                    )}
                    {testResults.discord !== undefined && (
                      <li className="flex items-center">
                        {testResults.discord ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-red-600 mr-2" />
                        )}
                        Discord: {testResults.discord ? 'Sent' : 'Failed'}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Setup Instructions</h3>
              <div className="mt-4 space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 text-primary-600">
                      1
                    </span>
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900">Go to TradingView</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Open TradingView and navigate to the chart you want to set alerts for.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 text-primary-600">
                      2
                    </span>
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900">Create a New Alert</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Click the "Alerts" button on the right toolbar or press Alt+A to open the Alert dialog.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 text-primary-600">
                      3
                    </span>
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900">Configure Webhook</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      In the "Notifications" section of the alert settings:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                      <li>Check "Webhook"</li>
                      <li>Paste your webhook URL</li>
                      <li>Set your alert conditions</li>
                      <li>Click "Create Alert"</li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 text-primary-600">
                      4
                    </span>
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900">Test Your Alert</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Click the "Test Webhook" button above to verify your webhook is working correctly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Make sure your TradingView account has webhook alerts enabled. This feature is available on TradingView Premium plans.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Alert Message Examples</h3>
              <div className="mt-4 space-y-6">
                <div className="rounded-md bg-gray-50 p-4">
                  <h4 className="text-md font-medium text-gray-900">Basic Alert Format</h4>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                    {`{
  "exchange": "{{exchange}}",
  "symbol": "{{ticker}}",
  "message": "💡 {{strategy.order.action}} Alert\\n\\nPrice: {{close}}\\nTime: {{time}}"
}`}
                  </pre>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <h4 className="text-md font-medium text-gray-900">Strategy Alert Example</h4>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                    {`{
  "exchange": "BINANCE",
  "symbol": "BTCUSDT",
  "message": "🚨 {{strategy.order.action}} Signal\\n\\nSymbol: {{ticker}}\\nPrice: {{close}}\\nPosition Size: {{strategy.position_size}}\\nTime: {{time}}\\n\\n💰 Performance:\\nNet Profit: {{strategy.netprofit}}\\nWin Rate: {{strategy.winrate}}"
}`}
                  </pre>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <h4 className="text-md font-medium text-gray-900">Indicator Alert Example</h4>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                    {`{
  "exchange": "BINANCE",
  "symbol": "ETHUSDT",
  "message": "📊 Indicator Alert\\n\\nSymbol: {{ticker}}\\nPrice: {{close}}\\nRSI: {{plot('RSI')}}\\nMACD: {{plot('MACD')}}\\nTime: {{time}}"
}`}
                  </pre>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p><strong>Note:</strong> Replace placeholders (e.g., {'{{ticker}}'}, {'{{close}}'}) with actual TradingView variables. The examples above are templates - customize them based on your strategy's needs.</p>
                  <p className="mt-2">Available TradingView variables include:</p>
                  <ul className="mt-1 list-disc pl-5">
                    <li>{'{{ticker}}'} - Current symbol</li>
                    <li>{'{{exchange}}'} - Exchange name</li>
                    <li>{'{{close}}'} - Current price</li>
                    <li>{'{{time}}'} - Alert time</li>
                    <li>{"{{plot('indicator')}}"} - Indicator values</li>
                    <li>{'{{strategy.order.action}}'} - Strategy action (buy/sell)</li>
                    <li>{'{{strategy.position_size}}'} - Position size</li>
                    <li>{'{{strategy.netprofit}}'} - Strategy net profit</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
