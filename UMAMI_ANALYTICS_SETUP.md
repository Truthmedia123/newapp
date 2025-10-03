# Umami Analytics Setup Guide

This guide explains how to set up Umami analytics for TheGoanWedding platform on the same VPS as Directus.

## What is Umami?

Umami is a simple, fast, privacy-focused alternative to Google Analytics. It's open-source, lightweight, and doesn't use cookies or collect personal data.

## Prerequisites

1. A VPS with Docker installed (same server as Directus)
2. Domain name or subdomain for Umami (e.g., umami.yourdomain.com)
3. SSL certificate (can be obtained via Let's Encrypt)

## Installation Steps

### 1. Create Umami Database

First, create a database for Umami. If you're using the same PostgreSQL instance as Directus:

```sql
CREATE DATABASE umami;
CREATE USER umami WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE umami TO umami;
```

### 2. Create Docker Compose Configuration

Create a `docker-compose.yml` file for Umami:

```yaml
version: '3'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:your-secure-password@your-db-host:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: your-32-character-secret-string
    restart: always
    depends_on:
      - postgres
  postgres:
    image: postgres:12-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: your-secure-password
    volumes:
      - ./umami-db-data:/var/lib/postgresql/data
    restart: always
```

### 3. Generate App Secret

Generate a 32-character secret string:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
-join ((65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 4. Start Umami

```bash
docker-compose up -d
```

### 5. Access Umami Dashboard

1. Open your browser and navigate to `http://your-server-ip:3000`
2. Login with default credentials:
   - Username: admin
   - Password: umami
3. Change the default password immediately

### 6. Configure Reverse Proxy (Nginx)

If you're using Nginx as a reverse proxy, add this configuration:

```nginx
server {
    listen 80;
    server_name umami.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then obtain SSL certificate with Let's Encrypt:

```bash
sudo certbot --nginx -d umami.yourdomain.com
```

### 7. Create Website in Umami

1. Log into Umami dashboard
2. Click "Add website"
3. Enter website details:
   - Name: TheGoanWedding
   - Domain: yourdomain.com
4. Copy the generated tracking code

## Integration with TheGoanWedding SPA

### 1. Add Tracking Script

Add the Umami tracking script to `client/index.html`:

```html
<!-- Umami Analytics -->
<script async defer data-website-id="your-website-id" src="https://umami.yourdomain.com/umami.js"></script>
```

### 2. Custom Event Tracking

To track custom events in your React components:

```javascript
// Track custom events
if (typeof window !== 'undefined' && (window as any).umami) {
  (window as any).umami('vendor_page_view', { vendor_id: vendorId });
}
```

## Custom Event Configuration

### 1. Vendor Page Views

Track when users view vendor profiles:

```javascript
// In VendorProfile.tsx
useEffect(() => {
  if (vendor && typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami('vendor_page_view', { 
      vendor_id: vendor.id,
      vendor_name: vendor.name,
      vendor_category: vendor.category
    });
  }
}, [vendor]);
```

### 2. RSVP Clicks

Track when users click RSVP buttons:

```javascript
// In wedding components
const handleRsvpClick = () => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami('rsvp_click', { 
      wedding_id: weddingId,
      event_name: eventName
    });
  }
  // Original RSVP logic
};
```

### 3. Invitation Sends

Track when invitations are sent:

```javascript
// In invitation components
const handleSendInvitation = () => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami('invitation_sent', { 
      template_id: templateId,
      recipient_count: recipientCount
    });
  }
  // Original send logic
};
```

### 4. Gallery Image Opens

Track when users open gallery images:

```javascript
// In gallery components
const handleImageOpen = (imageIndex) => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami('gallery_image_open', { 
      vendor_id: vendorId,
      image_index: imageIndex
    });
  }
  // Original image open logic
};
```

### 5. Contact Vendor Clicks

Track when users click to contact vendors:

```javascript
// In vendor components
const handleContactClick = () => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami('contact_vendor_click', { 
      vendor_id: vendorId,
      vendor_name: vendorName,
      contact_method: 'whatsapp' // or 'phone' or 'email'
    });
  }
  // Original contact logic
};
```

## Dashboard Configuration

### 1. Custom Metrics

In Umami dashboard, create custom metrics for:

1. Vendor Views by Category
2. RSVP Conversion Rate
3. Invitation Send Rate
4. Popular Gallery Images
5. Contact Method Preferences

### 2. Segmentation

Set up segmentation by:

1. Vendor ID
2. Vendor Category
3. Event Type
4. User Location (if available)
5. Device Type

## Security Considerations

1. **Restrict Access**: Use firewall rules to restrict access to Umami admin panel
2. **Strong Passwords**: Use strong, unique passwords for admin accounts
3. **Regular Updates**: Keep Umami updated to latest version
4. **Backup Database**: Regularly backup Umami database
5. **SSL Only**: Always use HTTPS for Umami dashboard and tracking

## Monitoring and Maintenance

1. **Check Logs**: Regularly check Umami logs for errors
2. **Database Size**: Monitor database growth and optimize if needed
3. **Performance**: Monitor tracking script performance impact
4. **Backups**: Implement regular database backups

## Troubleshooting

### Common Issues

1. **Tracking Not Working**: 
   - Check that tracking script is loaded
   - Verify website ID is correct
   - Check browser console for errors

2. **Dashboard Access Issues**:
   - Verify reverse proxy configuration
   - Check SSL certificate validity
   - Ensure firewall allows access

3. **Database Connection Errors**:
   - Verify database credentials
   - Check database server status
   - Ensure network connectivity

### Useful Commands

```bash
# Check Umami container status
docker-compose ps

# View Umami logs
docker-compose logs umami

# Restart Umami
docker-compose restart umami

# Update Umami
docker-compose pull umami
docker-compose up -d umami
```

## Support Resources

- [Umami Documentation](https://umami.is/docs/)
- [Umami GitHub Repository](https://github.com/umami-software/umami)
- [Community Forum](https://github.com/umami-software/umami/discussions)