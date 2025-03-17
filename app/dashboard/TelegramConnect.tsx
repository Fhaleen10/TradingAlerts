'use client'

import { useState } from 'react'

export default function TelegramConnect() {
  const [code, setCode] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    setError('')

    try {
      const response = await fetch('/api/telegram/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to connect')
      }

      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Connect Telegram
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            To receive alerts on Telegram, you need to connect your account.
            Follow these steps:
          </p>
          <ol className="mt-2 list-decimal list-inside">
            <li>Open <a href="https://t.me/your_bot_username" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">our Telegram bot</a></li>
            <li>Send the <code>/start</code> command to the bot</li>
            <li>Enter the 6-digit code you receive below</li>
          </ol>
        </div>
        <form onSubmit={handleConnect} className="mt-5">
          <div className="max-w-xs">
            <label htmlFor="code" className="sr-only">
              Connection Code
            </label>
            <input
              type="text"
              name="code"
              id="code"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              pattern="[0-9]{6}"
              required
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={isConnecting}
            className="mt-3 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  )
}
