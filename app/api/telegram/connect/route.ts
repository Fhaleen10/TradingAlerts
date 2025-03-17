import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { TelegramBot } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 400 }
      )
    }

    const success = await TelegramBot.connectUser(code, session.user.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error connecting telegram:', error)
    return NextResponse.json(
      { error: 'Failed to connect Telegram' },
      { status: 500 }
    )
  }
}
