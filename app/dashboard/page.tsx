'use client';

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import TelegramConnect from './TelegramConnect'

interface Alert {
  id: string
  symbol: string
  message: string
  timestamp: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null)
  const [isConnectedToTelegram, setIsConnectedToTelegram] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.user?.email) {
          return;
        }

        // Fetch user data
        const userRes = await fetch('/api/user')
        const userData = await userRes.json()
        setWebhookUrl(userData.webhookUrl)
        setIsConnectedToTelegram(!!userData.telegramChat)

        // Fetch alerts
        const alertsRes = await fetch('/api/alerts')
        const alertsData = await alertsRes.json()
        setAlerts(alertsData)
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    if (session) {
      fetchData()
    }

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(async () => {
      if (session) {
        try {
          const alertsRes = await fetch('/api/alerts')
          const alertsData = await alertsRes.json()
          setAlerts(alertsData)
        } catch (error) {
          console.error('Error refreshing alerts:', error)
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [session])

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    redirect('/api/auth/signin')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your TradingView alerts and Telegram connection.
        </p>
      </div>

      {isConnectedToTelegram ? (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Your Webhook URL
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Use this URL in your TradingView alerts to receive notifications on Telegram:
              </p>
            </div>
            <div className="mt-3">
              <input
                type="text"
                readOnly
                value={webhookUrl || ''}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
          </div>
        </div>
      ) : (
        <TelegramConnect />
      )}

      {/* Recent Alerts Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Alerts
          </h3>
          <div className="mt-4 space-y-4">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="border-b pb-4">
                  <p className="font-medium">{alert.symbol}</p>
                  <p className="text-sm text-gray-500">{alert.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
