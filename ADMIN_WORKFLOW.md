# Admin-Only Workflow Guide

## Overview
This wedding platform is configured for admin-only vendor management to maintain quality control and prevent spam submissions.

## Admin Access

### 1. Admin Dashboard
- **URL**: `/admin/dashboard?token=admin-secret-2024`
- **Features**: Overview, vendor management, data import, system settings
- **Security**: Token-based authentication (change the token in production)

### 2. Netlify CMS
- **URL**: `/admin`
- **Access**: Git Gateway with editorial workflow
- **Features**: Content management, vendor profiles, blog posts

## Vendor Management Workflow

### Option 1: Netlify CMS (Recommended)
1. Go to `/admin` to access Netlify CMS
2. Navigate to "Vendors" collection
3. Create new vendor profiles with all required fields
4. Use draft mode to review before publishing
5. All changes are version controlled in Git

### Option 2: CSV Import
1. Prepare CSV file using the template in `scripts/vendor-template.csv`
2. Use the admin dashboard import feature, or
3. Run command line import: `npm run import:vendors path/to/vendors.csv`

### Option 3: Direct Database (Advanced)
1. Use the database seeding script: `npm run db:seed`
2. Modify `scripts/seed-database.js` for custom data

## CSV Format
```csv
name,category,description,phone,email,whatsapp,location,address,website,instagram,facebook,services,price_range,featured,verified
"Vendor Name","photographers","Description","+91 9876543210","email@example.com","+91 9876543210","Location","Address","https://website.com","@instagram","facebook","Service1;Service2","₹25,000 - ₹50,000",true,true
```

## Security Features

### Disabled Public Endpoints
- `POST /api/business-submissions` - Commented out
- All vendor creation APIs are admin-only

### CMS Configuration
- `create: false` for vendors collection
- Editorial workflow enabled
- Git Gateway for version control

### Admin Authentication
- Token-based access to admin dashboard
- Netlify Identity for CMS access
- All changes tracked in Git

## Deployment Workflow

### Local Development
```bash
npm run pages:dev  # Start development server
npm run db:push    # Apply database migrations
```

### Production Deployment
```bash
npm run build:production  # Build for production
npm run deploy:production # Deploy to Cloudflare
```

### Database Management
```bash
wrangler d1 migrations apply wedding_platform_db --local  # Local
wrangler d1 migrations apply wedding_platform_db          # Production
```

## Content Management

### Adding Vendors
1. **CMS Method**: Use Netlify CMS interface
2. **CSV Method**: Import via admin dashboard
3. **Script Method**: Modify seed script and run

### Updating Vendors
1. Edit through Netlify CMS
2. Changes go through draft → review → publish workflow
3. All changes are version controlled

### Blog Posts
1. Create through Netlify CMS
2. Use markdown for content
3. Add featured images and metadata

## Monitoring

### Admin Dashboard Features
- Vendor count overview
- Database status monitoring
- System health checks
- Quick action buttons

### Analytics
- Google Analytics integration
- Performance monitoring
- Error tracking

## Best Practices

### Vendor Quality Control
- Verify all contact information
- Check social media links
- Ensure high-quality images
- Review service descriptions

### Content Guidelines
- Use consistent formatting
- Optimize images for web
- Write SEO-friendly descriptions
- Maintain brand consistency

### Security
- Change admin token regularly
- Use strong passwords for CMS
- Monitor for unauthorized access
- Keep dependencies updated

## Troubleshooting

### Common Issues
1. **CMS Access**: Check Netlify Identity settings
2. **Import Errors**: Verify CSV format matches template
3. **Deployment Issues**: Check Cloudflare Workers logs
4. **Database Errors**: Verify migration status

### Support
- Check Cloudflare Workers dashboard for logs
- Review Git history for content changes
- Use admin dashboard for system status
- Monitor performance metrics

## Future Enhancements
- Automated vendor verification
- Bulk import from external sources
- Advanced analytics dashboard
- Automated content moderation
- Multi-admin support with role-based access
