import TelegramBotAPI from 'node-telegram-bot-api'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export class TelegramBot {
  private static instance: TelegramBotAPI
  private static connectionCodes: Map<string, string> = new Map()

  private constructor() {}

  public static getInstance(): TelegramBotAPI {
    if (!TelegramBot.instance) {
      const token = process.env.TELEGRAM_BOT_TOKEN
      if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set')
      }

      TelegramBot.instance = new TelegramBotAPI(token, { polling: false })
    }
    return TelegramBot.instance
  }

  public static generateConnectionCode(chatId: string): string {
    const code = crypto.randomInt(100000, 999999).toString()
    this.connectionCodes.set(code, chatId)
    
    // Code expires after 5 minutes
    setTimeout(() => {
      this.connectionCodes.delete(code)
    }, 5 * 60 * 1000)
    
    return code
  }

  public static async handleStart(chatId: string): Promise<string> {
    const code = this.generateConnectionCode(chatId)
    const message = `Welcome to TradingView Alerts Bot! 🤖\n\nYour connection code is: ${code}\n\nThis code will expire in 5 minutes. Enter it in the dashboard to connect your account.`
    
    await this.getInstance().sendMessage(chatId, message)
    return code
  }

  public static async connectUser(code: string, userId: string): Promise<boolean> {
    const chatId = this.connectionCodes.get(code)
    if (!chatId) {
      return false
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          telegramChat: chatId,
          webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhook/${userId}`
        }
      })

      const message = '✅ Successfully connected to TradingView Alerts!\n\nYou will now receive alerts here when they are triggered.'
      await this.getInstance().sendMessage(chatId, message)
      
      this.connectionCodes.delete(code)
      return true
    } catch (error) {
      console.error('Error connecting user:', error)
      return false
    }
  }

  public static async handleTest(chatId: string): Promise<void> {
    // Find user by telegram chat id
    const user = await prisma.user.findFirst({
      where: { telegramChat: chatId.toString() }
    });

    if (!user) {
      await this.getInstance().sendMessage(chatId, 
        "Your Telegram account is not connected to any TradingView Alert Forwarder account. " +
        "Please connect your account first."
      );
      return;
    }

    await this.getInstance().sendMessage(chatId, 
      "✅ Test successful!\n\n" +
      "Your TradingView alerts will be delivered to this chat. " +
      "Make sure to keep this chat open to receive alerts."
    );
  }

  public static async sendMessage(chatId: string, message: string): Promise<boolean> {
    try {
      await this.getInstance().sendMessage(chatId, message);
      return true;
    } catch (error) {
      console.error('Error sending telegram message:', error);
      return false;
    }
  }

  public static async initializeBot(): Promise<void> {
    const bot = this.getInstance();

    // Handle /start command
    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleStart(chatId);
    });

    // Handle test message
    bot.onText(/\/test/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleTest(chatId);
    });
  }
}

// Initialize bot
TelegramBot.initializeBot();
