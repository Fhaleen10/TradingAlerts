# TradingView Alerts Manager

A powerful web application for managing and receiving TradingView alerts through multiple channels.

## Features

### Notification Channels
- ✅ Email notifications
- ✅ Telegram integration
  - ✅ Bot integration
  - ✅ Message formatting
  - ✅ Test connection
  - ✅ Toggle notifications
- ✅ Discord integration
  - ✅ Webhook support
  - ✅ Rich message formatting
  - ✅ Test connection
  - ✅ Toggle notifications

### Alert Management
- ✅ Custom webhook URLs
- ✅ Alert history
- ✅ Daily alert limits
- ✅ Test webhook functionality
- ✅ Alert usage tracking
- ✅ Rate limiting

### User Interface
- ✅ Modern, responsive design
- ✅ Dark/Light mode toggle
- ✅ User-friendly settings page
- ✅ Easy setup instructions
- ✅ Alert message templates
- ✅ Dashboard with usage statistics

## Roadmap

### Current Sprint
- 🔄 Enhanced error handling and validation
- 🔄 Performance optimizations
- 🔄 Improved logging system
- 🔄 User experience refinements

### Short-term Goals (1-2 months)
- 📅 Mobile-responsive design improvements
- 📅 Additional alert templates
- 📅 Custom alert sounds
- 📅 Alert categorization
- 📅 Basic analytics dashboard

### Mid-term Goals (3-6 months)
- 📅 Mobile app (iOS/Android)
- 📅 Slack integration
- 📅 SMS notifications
- 📅 Advanced alert analytics
- 📅 Webhook URL rotation
- 📅 Backup notification channels
- 📅 Custom notification schedules
- 📅 Alert priority levels

### Long-term Vision (6+ months)
- 📅 Integration with more trading platforms
- 📅 Public API for third-party integrations
- 📅 Collaborative alert sharing
- 📅 Advanced price alerts dashboard
- 📅 Technical indicator alerts
- 📅 Machine learning-based alert optimization
- 📅 Community-driven alert templates
- 📅 Multi-language support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Telegram Bot Token (for Telegram notifications)
- Discord Webhook URL (for Discord notifications)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd tradingview-alerts
   npm install
   ```
3. Set up environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
