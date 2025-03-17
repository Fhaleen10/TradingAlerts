# Contributing Guidelines

## 🚫 Restricted Changes

### Performance & Scalability
- DO NOT implement resource-intensive operations on the main server (e.g., screenshot capture, image processing)
- DO NOT store large files or binary data directly in MongoDB
- DO NOT make synchronous calls that could block the event loop
- DO NOT implement features that don't scale horizontally

### Security
- DO NOT store API keys or secrets in code or environment files
- DO NOT disable authentication middleware
- DO NOT expose sensitive user data in logs or responses
- DO NOT implement custom encryption - use standard libraries
- DO NOT store passwords in plain text
- DO NOT trust user input without validation

### Architecture
- DO NOT modify the core database schema without approval
- DO NOT bypass the service layer by making direct database calls from routes
- DO NOT mix business logic with route handlers
- DO NOT implement features that create tight coupling between services

## ✅ Allowed Changes

### Features
- ADD new API endpoints following RESTful conventions
- ADD new service layer functions
- ADD new validation rules
- ADD new Telegram bot commands
- ADD new subscription features
- ADD new alert types and conditions

### Improvements
- OPTIMIZE database queries
- IMPROVE error handling
- ENHANCE logging (without sensitive data)
- UPDATE documentation
- ADD unit tests
- REFACTOR for better code organization

### Security
- ADD input validation
- IMPLEMENT rate limiting
- ENHANCE authentication checks
- ADD security headers
- IMPROVE error messages (without exposing internals)

## 📋 Development Guidelines

### Code Style
- Use ES6+ features
- Follow airbnb style guide
- Use async/await for asynchronous operations
- Implement proper error handling
- Add JSDoc comments for functions
- Use meaningful variable names

### Architecture
- Follow MVC pattern
- Maintain service layer abstraction
- Keep routes thin, logic in services
- Use dependency injection where possible
- Implement proper separation of concerns

### Testing
- Write unit tests for new features
- Update existing tests when modifying features
- Test error cases
- Add integration tests for API endpoints

### Performance
- Use database indexes appropriately
- Implement caching where beneficial
- Use connection pooling
- Optimize database queries
- Implement proper pagination

### Security
- Validate all user input
- Implement proper access control
- Use parameterized queries
- Sanitize data before storing/displaying
- Follow security best practices

## 🔄 Pull Request Process

1. Create feature branch from development
2. Follow code style guidelines
3. Add/update tests
4. Update documentation
5. Submit PR with clear description
6. Address review comments
7. Ensure CI passes

## 📝 Documentation

- Update README.md for new features
- Document API changes
- Add JSDoc comments
- Update environment variable documentation
- Document database schema changes

## 🚀 Deployment

- Test in staging environment first
- Follow zero-downtime deployment
- Update environment variables
- Run database migrations
- Monitor logs for errors

## ⚠️ Breaking Changes

When making breaking changes:
1. Document in CHANGELOG.md
2. Provide migration guide
3. Update version number
4. Notify team members
5. Plan deployment strategy

## 🔍 Code Review Checklist

- [ ] Follows code style guidelines
- [ ] Includes tests
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Error handling implemented
- [ ] Logging added appropriately
- [ ] No breaking changes without approval
