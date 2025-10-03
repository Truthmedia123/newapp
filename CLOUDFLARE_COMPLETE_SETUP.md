# Complete Cloudflare Setup Guide

This document provides a comprehensive guide for setting up the wedding platform on Cloudflare with full Directus CMS integration.

## Prerequisites

1. Cloudflare account with Workers and Pages enabled
2. GitHub account for deployment
3. Node.js 18+ installed locally
4. Wrangler CLI installed (`npm install -g wrangler`)

## Environment Configuration

### Development Environment
Create a `.env.development` file:
```bash
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your_admin_token
DATABASE_URL=your_local_database_url
SITE_URL=http://localhost:8787
```

### Production Environment
Set the following environment variables in Cloudflare:
- `DIRECTUS_URL`: Your Directus instance URL
- `DIRECTUS_TOKEN`: Admin token for Directus API access
- `SITE_URL`: Your deployed site URL

## Database Setup

### Local Development
1. Use SQLite for local development
2. Database file is located at `.db/dev.db`

### Production
1. Use Cloudflare D1 database
2. Database name: `wedding_platform_db`
3. Database ID: `eb586981-d322-4e17-a982-6397604e3fc4`

## Redirect Configuration

Configured in `client/public/_redirects`:
```
# Admin redirect to Directus
/admin  https://your-directus-instance.railway.app/admin  302

# SPA fallback - must be last
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