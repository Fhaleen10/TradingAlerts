import { NextResponse } from 'next/server'
import { TelegramBot } from '@/lib/telegram'

let isInitialized = false

export async function GET() {
  if (!isInitialized) {
    try {
      const bot = TelegramBot.getInstance()

      // Set bot commands
      await bot.setMyCommands([
        { command: '/start', description: 'Start the bot and get connection code' },
        { command: '/test', description: 'Test the connection' },
        { command: '/help', description: 'Show help message' },
      ])

      // Handle /start command
      bot.onText(/\/start/, async (msg) => {
        await TelegramBot.handleStart(msg.chat.id.toString())
      })

      // Handle /test command
      bot.onText(/\/test/, async (msg) => {
        await TelegramBot.handleTest(msg.chat.id.toString())
      })

      // Handle /help command
      bot.onText(/\/help/, async (msg) => {
        const helpMessage = `
🤖 <b>TradingView Alerts Bot</b>

Available commands:
/start - Get a new connection code
/test - Test your connection
/help - Show this help message

To set up alerts:
1. Connect your account using /start
2. Copy your webhook URL from the dashboard
3. Add it to your TradingView alerts
4. Set the alert message format to JSON with:
   {
     "exchange": "BINANCE",
     "symbol": "BTCUSDT",
     "side": "BUY",
     "price": "50000",
     "strategy": "Golden Cross",
     "interval": "1h"
   }

Need help? Visit our dashboard for more information.
`
        await bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'HTML' })
      })

      isInitialized = true
      return NextResponse.json({ success: true, message: 'Bot initialized' })
    } catch (error) {
      console.error('Failed to initialize bot:', error)
      return NextResponse.json(
        { error: 'Failed to initialize bot' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ success: true, message: 'Bot already initialized' })
}
