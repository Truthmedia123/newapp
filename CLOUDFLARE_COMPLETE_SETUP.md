# Complete Cloudflare Setup for TheGoanWedding.com

This document provides a complete overview of your Cloudflare setup for TheGoanWedding.com wedding vendor directory website.

## Architecture Overview

Your application uses a modern architecture with:

1. **Cloudflare Pages** - For hosting the frontend React application
2. **Cloudflare Workers** - For backend API endpoints
3. **Cloudflare D1** - As the database layer
4. **Cloudflare Workers KV** - For caching (if used)

## Components

### 1. Cloudflare Pages (Frontend)

- **Project Name**: `weddingreplit`
- **Build Output Directory**: `dist/public`
- **Production Branch**: `main`
- **Custom Domain**: `thegoanwedding.com` (when configured)
- **Deployment URL**: `https://weddingreplit.pages.dev`

#### Environment Variables:
- `NODE_ENV` = `production`
- `SITE_URL` = `https://weddingreplit.pages.dev`

### 2. Cloudflare D1 Database

- **Database Name**: `wedding_platform_db`
- **Database UUID**: `eb586981-d322-4e17-a982-6397604e3fc4`
- **Binding Name**: `DB`

#### Tables:
1. `vendors` - Wedding vendor information
2. `weddings` - Wedding details
3. `wedding_events` - Wedding event schedules
4. `rsvp_invitations` - RSVP invitation tracking
5. `rsvps` - RSVP responses
6. `rsvp_questions` - Custom RSVP questions
7. `rsvp_responses` - RSVP question responses
8. `reviews` - Vendor reviews
9. `categories` - Vendor categories
10. `blog_posts` - Blog content
11. `business_submissions` - Business listing submissions
12. `contacts` - Contact form submissions

### 3. Cloudflare Worker (Backend API)

- **Worker Name**: `weddingreplit-worker`
- **Main File**: `dist/worker.js`
- **Binding**: Uses the same D1 database as Pages

### 4. Redirects

Configured in `client/public/_redirects`:
```
# Netlify Identity routes - must come BEFORE the SPA fallback
/.netlify/identity/*  /.netlify/identity/:splat  200
/admin/*             /admin/index.html          200
/*                   /index.html                200
```

## Deployment Process

### Frontend (Pages)
1. Build the project: `npm run build:production`
2. Deploy: `npx wrangler pages deploy dist/public --project-name=weddingreplit --branch=main`

### Backend (Worker)
1. Build the project: `npm run build:production`
2. Deploy: `npx wrangler deploy --env production`

### Database
1. Schema is already initialized in `schema.sql`
2. Apply schema: `npx wrangler d1 execute wedding_platform_db --file=./schema.sql`

## Configuration Files

### wrangler.toml (Pages Configuration)
```toml
# Configuration for Cloudflare Pages (frontend)
name = "weddingreplit"
pages_build_output_dir = "dist/public"
compatibility_date = "2025-09-03"

[[d1_databases]]
binding = "DB"
database_name = "wedding_platform_db"
database_id = "eb586981-d322-4e17-a982-6397604e3fc4"

[vars]
NODE_ENV = "production"
SITE_URL = "https://weddingreplit.pages.dev"

# Preview environment for Pages
[env.preview]
name = "weddingreplit-preview"

# Production environment for Pages
[env.production]
name = "weddingreplit"

[[env.production.d1_databases]]
binding = "DB"
database_name = "wedding_platform_db"
database_id = "eb586981-d322-4e17-a982-6397604e3fc4"

[env.production.vars]
NODE_ENV = "production"
SITE_URL = "https://weddingreplit.pages.dev"
```

### wrangler-worker.toml (Worker Configuration)
```toml
name = "weddingreplit-worker"
main = "dist/worker.js"
compatibility_date = "2025-09-03"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "wedding_platform_db"
database_id = "eb586981-d322-4e17-a982-6397604e3fc4"

[vars]
NODE_ENV = "production"
SITE_URL = "https://weddingreplit.pages.dev"
```

## Useful Commands

### Authentication
```bash
npx wrangler login
```

### Database
```bash
# List databases
npx wrangler d1 list

# Execute schema
npx wrangler d1 execute wedding_platform_db --file=./schema.sql

# Execute single command
npx wrangler d1 execute wedding_platform_db --command="SELECT * FROM vendors LIMIT 5;"
```

### Pages
```bash
# Deploy frontend
npx wrangler pages deploy dist/public --project-name=weddingreplit --branch=main

# List deployments
npx wrangler pages deployment list --project-name=weddingreplit
```

### Worker
```bash
# Deploy worker
npx wrangler deploy --env production

# View worker logs
npx wrangler tail weddingreplit-worker
```

## Environment Setup

1. **Development**: Uses local SQLite database
2. **Production**: Uses Cloudflare D1 database

The application automatically switches between databases based on the environment.

## Troubleshooting

### Common Issues

1. **Authentication**: Ensure you're logged in with `npx wrangler login`
2. **Database Connection**: Verify D1 bindings in Cloudflare dashboard
3. **Environment Variables**: Check that all required variables are set
4. **Build Issues**: Ensure all dependencies are installed with `npm install`

### Logs and Monitoring

- View Pages logs in Cloudflare dashboard
- View Worker logs with `npx wrangler tail weddingreplit-worker`
- Check D1 query performance in the Cloudflare dashboard

## Next Steps

1. Deploy the frontend: `npx wrangler pages deploy dist/public --project-name=weddingreplit --branch=main`
2. Deploy the worker: `npx wrangler deploy --env production`
3. Configure custom domain in Cloudflare dashboard
4. Test all functionality
5. Monitor logs for any issues

## Support Resources

- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)