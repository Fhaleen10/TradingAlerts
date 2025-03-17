# TradingView Alert Setup Guide

## Setting Up TradingView Alerts

### Basic Alert Setup
1. Open TradingView and navigate to your chart
2. Click the "Alerts" button (🔔) or press `Alt+A`
3. Click "Create Alert"

### Alert Message Templates

Here are some example alert message formats for different types of trading signals:

#### 1. Basic Price Alert
```json
{
    "symbol": "{{ticker}}",
    "exchange": "{{exchange}}",
    "message": "Price Alert: {{ticker}} has reached {{close}}",
    "value": "{{close}}"
}
```

#### 2. Moving Average Crossover
```json
{
    "symbol": "{{ticker}}",
    "exchange": "{{exchange}}",
    "message": "MA Crossover: {{ticker}} {{strategy.order.action}}. Fast MA: {{plot_0}}, Slow MA: {{plot_1}}",
    "value": "{{close}}",
    "condition": "MA Crossover"
}
```

#### 3. RSI Signal
```json
{
    "symbol": "{{ticker}}",
    "exchange": "{{exchange}}",
    "message": "RSI Alert: {{ticker}} is {{strategy.order.action}}. RSI: {{plot_0}}",
    "value": "{{plot_0}}",
    "condition": "RSI Signal"
}
```

#### 4. Support/Resistance Break
```json
{
    "symbol": "{{ticker}}",
    "exchange": "{{exchange}}",
    "message": "⚠️ BREAKOUT ALERT ⚠️\n{{ticker}} has broken {{strategy.order.action}} level at {{close}}",
    "value": "{{close}}",
    "condition": "Support/Resistance Break"
}
```

#### 5. Volume Spike
```json
{
    "symbol": "{{ticker}}",
    "exchange": "{{exchange}}",
    "message": "🚨 VOLUME SPIKE 🚨\n{{ticker}} volume is {{volume}} ({{volume_delta}}% above average)",
    "value": "{{volume}}",
    "condition": "Volume Alert"
}
```

### Pine Script Strategy Alert
```json
{
    "symbol": "{{ticker}}",
    "exchange": "{{exchange}}",
    "message": "🎯 TRADING SIGNAL\nSymbol: {{ticker}}\nAction: {{strategy.order.action}}\nPrice: {{strategy.order.price}}\nQuantity: {{strategy.order.contracts}}\nPosition Size: ${{strategy.position_size}}\nProfit: {{strategy.profit}}",
    "value": "{{strategy.order.price}}",
    "condition": "Strategy Signal"
}
```

## Webhook Configuration

1. In the Alert dialog, scroll to "Notifications"
2. Check "Webhook URL"
3. Paste your webhook URL:
```
http://localhost:3001/api/webhook/YOUR_USER_ID/YOUR_WEBHOOK_TOKEN
```
4. Set other conditions as needed
5. Click "Create Alert"

## Testing Your Alert

1. Click "Test" in the alert dialog to send a test notification
2. Verify that you receive the alert in Telegram
3. Check the message format and make adjustments if needed

## Variables Available in TradingView

Common variables you can use in your alert messages:
- `{{ticker}}` - Symbol name
- `{{exchange}}` - Exchange name
- `{{close}}` - Current price
- `{{volume}}` - Current volume
- `{{time}}` - Alert time
- `{{plot_0}}`, `{{plot_1}}` - Indicator values
- `{{strategy.order.action}}` - Buy/Sell signal
- `{{strategy.order.price}}` - Order price
- `{{strategy.position_size}}` - Position size
- `{{strategy.profit}}` - Strategy profit

## Best Practices

1. **Use Clear Messages**: Make your alert messages clear and informative
2. **Include Important Data**: Always include symbol, price, and reason for the alert
3. **Use Emojis**: They make messages more readable in Telegram
4. **Test First**: Always test your alerts before relying on them
5. **Check Formatting**: Ensure JSON is properly formatted
6. **Monitor Limits**: Keep track of your daily alert usage

## Troubleshooting

If alerts are not working:
1. Check webhook URL is correct
2. Verify JSON format is valid
3. Ensure you haven't reached daily alert limit
4. Check Telegram bot is properly connected
5. Look for error messages in bot responses
