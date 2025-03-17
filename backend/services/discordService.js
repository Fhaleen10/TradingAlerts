const axios = require('axios');

class DiscordService {
  constructor() {
    this.defaultUsername = 'TradingView Alerts';
    this.defaultAvatar = 'https://s3.tradingview.com/userpics/6171439-HGYm_big.png'; // TradingView logo
  }

  async sendMessage(webhookUrl, content, options = {}) {
    try {
      const payload = {
        content,
        username: options.username || this.defaultUsername,
        avatar_url: options.avatar || this.defaultAvatar,
        embeds: options.embeds || []
      };

      await axios.post(webhookUrl, payload);
      return true;
    } catch (error) {
      console.error('Error sending Discord message:', error);
      return false;
    }
  }

  async sendAlert(webhookUrl, alert) {
    try {
      const embed = {
        title: '📊 TradingView Alert',
        color: 0x00ff00, // Green color
        fields: [
          {
            name: 'Symbol',
            value: alert.symbol || 'N/A',
            inline: true
          },
          {
            name: 'Price',
            value: alert.price ? `$${alert.price}` : 'N/A',
            inline: true
          },
          {
            name: 'Alert Type',
            value: alert.type || 'Custom',
            inline: true
          }
        ],
        description: alert.message,
        timestamp: new Date().toISOString(),
        footer: {
          text: 'TradingView Alerts Bot',
          icon_url: this.defaultAvatar
        }
      };

      return await this.sendMessage(webhookUrl, '', {
        embeds: [embed]
      });
    } catch (error) {
      console.error('Error sending Discord alert:', error);
      return false;
    }
  }

  async validateWebhook(webhookUrl) {
    try {
      const response = await axios.get(webhookUrl);
      return response.data && response.data.id;
    } catch (error) {
      console.error('Error validating Discord webhook:', error);
      return false;
    }
  }
}

module.exports = new DiscordService();
