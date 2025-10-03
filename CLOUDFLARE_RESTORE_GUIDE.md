# Cloudflare Restore Guide

This guide will help you restore your Cloudflare configuration for TheGoanWedding.com website after accidentally deleting your Cloudflare resources.

## Prerequisites

1. A Cloudflare account
2. Access to your domain (thegoanwedding.com)
3. Node.js and npm installed
4. Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: Authenticate with Cloudflare

First, authenticate with your Cloudflare account:

```bash
npx wrangler login
```

Follow the prompts to authenticate via your browser.

## Step 2: Recreate Cloudflare D1 Database

Your D1 database already exists with the following details:
- Name: `wedding_platform_db`
- UUID: `eb586981-d322-4e17-a982-6397604e3fc4`

The database schema has already been initialized with the tables defined in `schema.sql`.

To verify the database exists:
```bash
npx wrangler d1 list
```

## Step 3: Recreate Cloudflare Pages Project

To recreate your Cloudflare Pages project:

1. Build your project:
   ```bash
   npm run build:production
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist/public --project-name=weddingreplit --branch=main
   ```

If prompted to create a new project, select "Create a new project".

## Step 4: Configure Environment Variables

In the Cloudflare dashboard:

1. Go to Pages > weddingreplit > Settings > Environment Variables
2. Add the following environment variables:
   - `NODE_ENV` = `production`
   - `SITE_URL` = `https://weddingreplit.pages.dev`

## Step 5: Bind D1 Database to Pages Project

1. In the Cloudflare dashboard, go to Pages > weddingreplit > Settings > Functions
2. Under "D1 Database Bindings", add:
   - Variable name: `DB`
   - Database: Select `wedding_platform_db`

## Step 6: Configure Custom Domain (Optional)

To use your custom domain:

1. In the Cloudflare dashboard, go to Pages > weddingreplit > Custom Domains
2. Click "Add custom domain"
3. Enter `thegoanwedding.com`
4. Follow the DNS configuration instructions

## Step 7: Set up Redirects

The redirects are already configured in `client/public/_redirects`:
```
# Admin redirect to Directus
/admin  https://your-directus-instance.railway.app/admin  302

# SPA fallback - must be last
/*                   /index.html                200
```

These will be automatically deployed with your site.

## Step 8: Verify Deployment

1. Visit your site at: https://weddingreplit.pages.dev
2. Check that all pages load correctly
3. Test database functionality (vendor listings, wedding pages, etc.)
4. Verify admin functionality works

## Troubleshooting

### Common Issues

1. **Deployment fails**: Make sure you're authenticated with Wrangler and have the correct permissions.

2. **Database connection issues**: Verify that the D1 database binding is correctly configured in the Cloudflare dashboard.

3. **Missing environment variables**: Check that all required environment variables are set in the Pages project settings.

4. **Redirect issues**: Ensure the `_redirects` file is in the `client/public` directory and gets included in the build.

### Useful Commands

- List D1 databases: `npx wrangler d1 list`
- Execute SQL on D1 database: `npx wrangler d1 execute wedding_platform_db --file=./schema.sql`
- Deploy to Pages: `npx wrangler pages deploy dist/public --project-name=weddingreplit --branch=main`
- Check deployment status: `npx wrangler pages deployment list --project-name=weddingreplit`

## Additional Configuration

### Worker Setup (if needed)

If you need to deploy a separate Worker:

1. Build the worker:
   ```bash
   npm run build:production
   ```

2. Deploy the worker:
   ```bash
   npx wrangler deploy --env production
   ```

### Local Development

For local development with D1:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The local SQLite database will be used automatically.

## Verification Checklist

- [ ] Cloudflare Pages project is created and deployed
- [ ] D1 database is bound to the Pages project
- [ ] Environment variables are configured
- [ ] Custom domain is set up (if applicable)
- [ ] Site loads correctly at the deployment URL
- [ ] Database operations work (vendor listings, wedding pages)
- [ ] Admin functionality is accessible
- [ ] Redirects are working properly

## Support

If you continue to experience issues:

1. Check Cloudflare's documentation
2. Review the project's DEPLOYMENT.md file
3. Contact Cloudflare support for platform-specific issues