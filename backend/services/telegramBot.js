require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const User = require('../models/User');

const BOT_TOKEN = '7501261332:AAH0E7cmhpR2pte49x5y0aGPQX2zY_qtEtY';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

class TelegramService {
    constructor() {
        if (!BOT_TOKEN) {
            throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
        }
        this.bot = new TelegramBot(BOT_TOKEN, { polling: true });
        this.setupListeners();
        console.log('Telegram bot initialized successfully');
    }

    setupListeners() {
        // Handle /start command
        this.bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            
            await this.bot.sendMessage(chatId, 
                `Welcome to TradingAlerts Bot! 🚀\n\n` +
                `Your Chat ID is: ${chatId}\n\n` +
                `Please go to the TradingView Setup page on our website and enter this Chat ID to start receiving alerts.`
            );
        });

        // Add error handler
        this.bot.on('error', (error) => {
            console.error('Telegram bot error:', error);
        });

        // Add polling error handler
        this.bot.on('polling_error', (error) => {
            console.error('Telegram bot polling error:', error);
        });
    }

    // Send a message to a specific chat ID
    async sendMessage(chatId, message) {
        try {
            await this.bot.sendMessage(chatId, message);
            console.log(`Message sent to chat ${chatId}`);
            return true;
        } catch (error) {
            console.error('Failed to send Telegram message:', error);
            throw error;
        }
    }

    // Send alert to a specific chat ID
    async sendAlert(chatId, alert) {
        try {
            await this.bot.sendMessage(chatId, alert.message);
            console.log(`Alert sent to chat ${chatId}`);
            return true;
        } catch (error) {
            console.error('Failed to send Telegram alert:', error);
            return false;
        }
    }
}

// Export as singleton
module.exports = new TelegramService();
