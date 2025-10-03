# Migration from Netlify CMS to Directus

This document outlines the migration process from Netlify CMS to Directus as the sole CMS for TheGoanWedding project.

## Overview

TheGoanWedding project previously supported two CMS systems:
1. Netlify CMS - File-based CMS using Git
2. Directus - Database-based CMS with API

As part of our effort to streamline the project and improve maintainability, we have removed Netlify CMS and consolidated on Directus as the single source of truth for all content management.

## Changes Made

### 1. Removed Netlify CMS Components

- Deleted Netlify CMS configuration files (`public/admin/config.yml`, `public/admin/index.html`)
- Removed Netlify functions (`functions/api/` directory)
- Deleted Netlify-related documentation files:
  - `MANUAL_NETLIFY_DEPLOYMENT.md`
  - `NETLIFY_DASHBOARD_GUIDE.md`
  - `NETLIFY_DEPLOYMENT_COMPLETE.md`
  - `NETLIFY_DEPLOYMENT_GUIDE.md`
  - `NETLIFY_PASSWORD_TROUBLESHOOTING.md`
  - `NETLIFY_SETUP.md`
  - `NETLIFY_USER_INVITATION_GUIDE.md`
- Removed Netlify configuration files (`netlify.toml`)
- Deleted Netlify-related scripts:
  - `create-netlify-site.js`
  - `deploy-netlify.js`
  - `deploy-to-netlify.js`
  - `link-netlify.js`
  - `netlify-setup.js`

### 2. Updated Client-Side Implementation

- Modified React Query configuration in `client/src/lib/queryClient.ts` to use Directus SDK
- Updated API calls in components to use Directus endpoints exclusively
- Removed custom API routes that duplicated Directus functionality

### 3. Updated Documentation

- Removed all references to Netlify CMS in `README.md`
- Updated development workflow documentation
- Updated environment variable configuration in `.env.example`

### 4. Configuration Updates

- Simplified `.env.example` to include only Directus configuration
- Removed Netlify-specific environment variables

## Directus Collections

The following collections are now managed exclusively through Directus:

1. **Vendors** - Wedding vendor listings
2. **Categories** - Vendor categories
3. **Blog Posts** - Wedding blog articles
4. **Reviews** - Customer reviews for vendors
5. **Invitation Templates** - Wedding invitation templates
6. **Site Settings** - Global site configuration

## API Endpoints

All API calls now use the Directus REST API:

- Vendors: `/items/vendors`
- Categories: `/items/categories`
- Blog Posts: `/items/blog_posts`
- Reviews: `/items/reviews`
- Invitation Templates: `/items/invitation_templates`
- Site Settings: `/items/site_settings`

## Development Workflow

### Starting the Development Environment

1. Start Directus CMS:
   ```bash
   npm run dev:directus
   ```

2. Start the main application:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5001`

### Accessing Directus Admin

The Directus admin panel is available at `http://localhost:8055` with the default credentials:
- Email: `admin@example.com`
- Password: `d1r3ctu5`

## Directus Configuration

### Setting Up Public Access

For the frontend to access content without authentication, you need to configure permissions in Directus:

1. Log in to the Directus admin panel at `http://localhost:8055`
2. Go to "Settings" → "Roles & Permissions"
3. Edit the "Public" role
4. For each collection (vendors, categories, blog_posts, etc.):
   - Set "Read" permissions to "All" or "Custom" as needed
   - For custom permissions, you can set filters to limit what public users can see
5. Save the changes

### Setting Up Authentication (Optional)

For authenticated access, you can use:
1. Static tokens configured in Directus
2. User accounts with specific roles
3. Environment variables in your application

## Migration Considerations

### For Existing Netlify CMS Content

If you have existing content in Netlify CMS, you'll need to migrate it to Directus:

1. Export content from Netlify CMS (if using Git backend)
2. Transform the content to match Directus collection schemas
3. Import the content into Directus using the Admin UI or API

### For Developers

- All new content should be managed through Directus
- API calls should use the Directus SDK or REST API
- Custom endpoints should be added to Directus as extensions if needed

## Benefits of Migration

1. **Single Source of Truth**: All content is now managed in one place
2. **Improved Performance**: Directus provides better API performance than file-based CMS
3. **Enhanced Features**: Directus offers more advanced content management features
4. **Simplified Maintenance**: Reduced codebase complexity with one CMS
5. **Better Scalability**: Directus is designed for modern web applications

## Troubleshooting

### Common Issues

1. **Directus Connection Issues**
   - Ensure Directus is running on port 8055
   - Check `DIRECTUS_URL` in environment variables
   - Verify Directus API token is valid

2. **Content Not Loading**
   - Check that content exists in Directus collections
   - Verify collection permissions in Directus (see "Setting Up Public Access")
   - Ensure API endpoints are correctly configured

3. **Authentication Errors**
   - Confirm `DIRECTUS_TOKEN` is set correctly
   - Check user permissions in Directus admin panel

### Testing Directus Connection

You can test your Directus connection with:
```bash
npm run test:directus
```

This script will:
1. Try to connect to Directus
2. Attempt to fetch data from vendors, categories, and blog_posts collections
3. Report success or failure

### Getting Help

For issues related to the migration or Directus configuration, please refer to:
- [Directus Documentation](https://docs.directus.io)
- Project maintainers