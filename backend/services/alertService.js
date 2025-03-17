const User = require('../models/User');
const telegramBot = require('./telegramBot');
const discordService = require('./discordService');
const { sendAlertEmail } = require('./emailService');

class AlertService {
  async processAlert(alert, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has reached their daily alert limit
      if (user.hasReachedAlertsLimit()) {
        throw new Error('Daily alert limit reached');
      }

      // Increment alerts used
      await user.incrementAlertsUsed();

      // Send notifications based on user preferences
      const notifications = [];

      // Email notification
      if (user.notifications.email) {
        notifications.push(this.sendEmailNotification(user, alert));
      }

      // Telegram notification
      if (user.notifications.telegram && user.telegramChatId) {
        notifications.push(this.sendTelegramNotification(user, alert));
      }

      // Discord notification
      if (user.notifications.discord && user.discordWebhookUrl) {
        notifications.push(this.sendDiscordNotification(user, alert));
      }

      // Wait for all notifications to be sent
      await Promise.all(notifications);

      return {
        success: true,
        message: 'Alert processed successfully'
      };
    } catch (error) {
      console.error('Error processing alert:', error);
      throw error;
    }
  }

  async sendEmailNotification(user, alert) {
    try {
      await sendAlertEmail(user.email, alert);
      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  async sendTelegramNotification(user, alert) {
    try {
      const message = this.formatAlertMessage(alert);
      await telegramBot.sendMessage(user.telegramChatId, message);
      return true;
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return false;
    }
  }

  async sendDiscordNotification(user, alert) {
    try {
      await discordService.sendAlert(user.discordWebhookUrl, alert);
      return true;
    } catch (error) {
      console.error('Error sending Discord notification:', error);
      return false;
    }
  }

  formatAlertMessage(alert) {
    return `🚨 *TradingView Alert*\n\n` +
           `*Symbol:* ${alert.symbol || 'N/A'}\n` +
           `*Price:* ${alert.price ? `$${alert.price}` : 'N/A'}\n` +
           `*Type:* ${alert.type || 'Custom'}\n\n` +
           `*Message:* ${alert.message}`;
  }
}

module.exports = new AlertService();
