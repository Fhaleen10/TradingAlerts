import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendTelegramMessage } from '@/lib/telegram';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { userId: string; token: string } }
) {
  try {
    const { userId, token } = params;
    const alertData = await request.json();

    // Find user by webhook ID and token
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        webhookUrl: {
          endsWith: `${userId}/${token}`
        }
      }
    });

    if (!user) {
      console.error(`No user found for webhook ID: ${userId}`);
      return NextResponse.json({ success: false, message: 'Invalid webhook ID' }, { status: 404 });
    }

    // Format the alert message
    const message = `🔔 Trading Alert\n\nSymbol: ${alertData.symbol}\nExchange: ${alertData.exchange}\n\n\n📝 Message:\n${alertData.message}\n\n⏰ Triggered at: ${new Date().toLocaleString()}`;

    // If Telegram is enabled, send to Telegram
    if (user.telegramChat) {
      await sendTelegramMessage(user.telegramChat, message);
      console.log(`Alert sent to Telegram for user: ${user.email}`);
    }

    // Save alert to database
    await prisma.alert.create({
      data: {
        userId: user.id,
        symbol: alertData.symbol || 'Unknown',
        message: alertData.message,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Alert processed successfully'
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process alert' },
      { status: 500 }
    );
  }
}
