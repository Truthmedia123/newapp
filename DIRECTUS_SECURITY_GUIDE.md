# Directus Security Guide

This document outlines the security measures for TheGoanWedding Directus CMS installation.

## Authentication Security

### Admin Credentials
1. Change the default admin credentials immediately after installation
2. Use a strong password with:
   - At least 12 characters
   - Mix of uppercase and lowercase letters
   - Numbers and special characters
   - No dictionary words or personal information

### Environment Variables
Ensure the following environment variables are properly configured:

```bash
# Generate strong random keys
KEY=your-32-character-random-key
SECRET=your-32-character-random-secret

# Admin credentials
ADMIN_EMAIL=secure-admin-email@yourdomain.com
ADMIN_PASSWORD=your-strong-password
```

Use the provided `generate-keys.js` script to create secure keys:
```bash
node generate-keys.js
```

## Role-Based Access Control

### Default Roles
Directus comes with three default roles:
1. **Administrator** - Full access to all content and settings
2. **Public** - Limited read-only access for frontend display
3. **Authenticated** - Access for logged-in users (if needed)

### Recommended Configuration

#### Administrator Role
- Only grant to trusted administrators
- Use for content management only
- Never expose to public users

#### Public Role
- Configure minimal read permissions for:
  - Vendors collection (read)
  - Categories collection (read)
  - Blog posts collection (read)
  - Reviews collection (read)
- Disable all write, update, and delete permissions
- Disable access to sensitive collections

#### Authenticated Role
- Not needed for TheGoanWedding use case
- Can be disabled if not required

## API Security

### Rate Limiting
Directus has built-in rate limiting enabled by default:
```javascript
rateLimiter: {
  enabled: true,
}
```

### CORS Configuration
Proper CORS settings prevent unauthorized access:
```javascript
cors: {
  enabled: true,
  origin: true, // Allow same origin requests
}
```

## Data Security

### Content Access
1. Only expose necessary data through the API
2. Use field-level permissions to hide sensitive information
3. Implement proper filtering for public access

### File Security
1. Store files outside the web root when possible
2. Use proper file type validation
3. Implement file size limits

## Network Security

### Firewall Configuration
1. Restrict Directus admin access to specific IP addresses if possible
2. Use HTTPS for all connections
3. Keep Directus updated to latest version

### Reverse Proxy
When deploying behind a reverse proxy (like Nginx):
1. Configure proper headers
2. Enable SSL termination
3. Set up proper caching

## Monitoring and Logging

### Audit Logs
1. Enable Directus activity logging
2. Regularly review access logs
3. Monitor for suspicious activity

### Health Checks
1. Implement regular health checks
2. Monitor database connections
3. Check API response times

## Deployment Security

### Production Environment
1. Never use default credentials in production
2. Use environment variables for all sensitive configuration
3. Enable HTTPS
4. Regular security updates
5. Backup database regularly

### Development Environment
1. Use separate databases for development and production
2. Disable public access to development instances
3. Use different credentials for development

## Best Practices

1. **Regular Updates**: Keep Directus updated to latest stable version
2. **Backup Strategy**: Implement regular database backups
3. **Access Review**: Periodically review user access and permissions
4. **Security Scans**: Run regular security scans on your deployment
5. **Two-Factor Authentication**: Enable 2FA for administrator accounts
6. **Session Management**: Configure appropriate session timeouts