import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { TelegramBot } from '@/lib/telegram'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: params.userId }
    })

    if (!user || !user.telegramChat) {
      return NextResponse.json(
        { error: 'User not found or not connected to Telegram' },
        { status: 404 }
      )
    }

    // Parse the alert data
    const data = await request.json()
    
    // Format message
    const message = formatTradingViewMessage(data)

    // Send to Telegram
    const bot = TelegramBot.getInstance()
    await bot.sendMessage(user.telegramChat, message, { parse_mode: 'HTML' })

    // Log the alert
    await prisma.alert.create({
      data: {
        message: typeof data === 'string' ? data : JSON.stringify(data),
        userId: user.id,
        status: 'sent'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

function formatTradingViewMessage(data: any): string {
  // If data is a string, return it directly
  if (typeof data === 'string') {
    return data
  }

  // If data is an object, format it nicely
  const {
    exchange = '',
    symbol = '',
    side = '',
    price = '',
    strategy = '',
    interval = '',
  } = data

  return `
🔔 <b>TradingView Alert</b>

${exchange ? `📊 Exchange: ${exchange}\n` : ''}${symbol ? `🔸 Symbol: ${symbol}\n` : ''}${side ? `📍 Side: ${side}\n` : ''}${price ? `💵 Price: ${price}\n` : ''}${strategy ? `📈 Strategy: ${strategy}\n` : ''}${interval ? `⏱ Interval: ${interval}\n` : ''}
  `.trim()
}
