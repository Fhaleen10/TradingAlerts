# User Data Handling Documentation

Last updated: December 27, 2023

## Data Collection

### What We Collect
1. Account Information
   - Email address
   - Password (hashed)
   - Account creation date
   - Subscription status

2. Alert Data
   - Alert content
   - Timestamp
   - Delivery status
   - Channel preferences (Discord, Telegram, Email)

3. Integration Settings
   - Discord webhook URLs
   - Telegram chat IDs
   - Notification preferences

4. Usage Data
   - Number of alerts sent
   - Daily usage statistics
   - Last login date
   - IP address

## Data Storage

### Security Measures
- All data is stored in encrypted format
- Passwords are hashed using bcrypt
- Regular security audits
- Access logs are maintained

### Data Retention
- Account data: Retained while account is active
- Alert history: Stored for 30 days
- Usage logs: Kept for 90 days
- Payment information: Stored by Stripe, not in our database

## Data Processing

### Purpose of Processing
- Delivering alert notifications
- Managing user subscriptions
- Maintaining service quality
- Preventing abuse

### Third-Party Processing
- Stripe: Payment processing
- MongoDB Atlas: Database hosting
- SendGrid: Email delivery
- Telegram API: Message delivery

## Data Access & Control

### User Rights
- Download personal data
- Request data deletion
- Modify notification preferences
- Update personal information

### Data Deletion
When an account is deleted:
- Personal information is immediately removed
- Alert history is deleted
- Integration settings are purged
- Usage data is anonymized

## Security Measures

### Infrastructure Security
- Regular security updates
- DDoS protection
- Rate limiting
- SSL/TLS encryption

### Access Control
- Role-based access control
- Two-factor authentication for admin access
- Regular access audits
- Secure API endpoints

## Compliance

### GDPR Compliance
- Data minimization
- Purpose limitation
- Storage limitation
- Data subject rights

### Data Breach Protocol
- Immediate assessment
- User notification within 72 hours
- Security patch implementation
- Incident documentation
