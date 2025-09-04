# Migration to Cloudflare Workers + D1 Database

This document outlines the migration from Supabase/Neon to Cloudflare Workers with D1 database.

## ✅ Completed Steps

1. **Dependencies Updated**
   - Removed `@supabase/supabase-js` and `@neondatabase/serverless`
   - Installed `@cloudflare/workers-types`, `drizzle-orm`, and `hono`
   - Added `@cloudflare/workers-types` to devDependencies

2. **Environment Configuration**
   - Created `.env.example` with required variables
   - Created `.env.production` for production deployment

3. **Cloudflare Wrangler Setup**
   - Created `wrangler.toml` configuration
   - Configured D1 database binding

4. **Database Schema Migration**
   - Converted schema from PostgreSQL to SQLite for D1
   - Updated `drizzle.config.ts` for D1 driver
   - Changed `pgTable` to `sqliteTable`
   - Adjusted data types (arrays → JSON strings, timestamps → integers)

5. **Backend Code Refactor**
   - Replaced Express with Hono framework
   - Updated `server/db.ts` for D1 compatibility
   - Converted all routes to use Hono syntax
   - Updated database queries to use Drizzle ORM with D1

6. **Netlify CMS Integration**
   - Installed Netlify CMS packages
   - Created admin configuration at `public/admin/config.yml`
   - Set up content collections for vendors, blog posts, and pages
   - Created admin entry point at `public/admin/index.html`

7. **Build & Deployment**
   - Updated package.json scripts
   - Added `build:production` command
   - Created SPA routing with `_redirects` file

8. **Testing Setup**
   - Installed Jest and ts-jest
   - Created Jest configuration
   - Added basic test file

## 🚀 Next Steps for Production

### 1. Set up Cloudflare D1 Database
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create wedding_platform_db

# Copy the database ID to your .env.production file
```

### 2. Update Environment Variables
```bash
# Edit .env.production with your actual values
D1_DATABASE_ID=your-actual-d1-database-id
SITE_URL=https://your-actual-domain.com
```

### 3. Run Database Migrations
```bash
# Generate and run migrations
npm run db:push
```

### 4. Deploy to Cloudflare
```bash
# Build and deploy
npm run build:production
```

### 5. Set up Netlify CMS
- Configure Git Gateway in your Netlify dashboard
- Set up authentication for the admin panel
- Access CMS at `/admin`

## 🔧 Development Commands

```bash
# Local development
npm run dev

# Build for production
npm run build:production

# Run tests
npm test

# Database operations
npm run db:push
```

## 📁 File Structure Changes

```
├── server/
│   ├── worker.ts          # New Cloudflare Workers entry point
│   ├── db.ts             # Updated for D1
│   └── routes.ts         # Converted to Hono
├── shared/
│   └── schema.ts         # Converted to SQLite
├── public/
│   └── admin/            # Netlify CMS
├── content/              # CMS content directories
├── wrangler.toml         # Cloudflare configuration
├── drizzle.config.ts     # Updated for D1
└── _redirects            # SPA routing
```

## ⚠️ Important Notes

1. **Array Fields**: PostgreSQL arrays are now stored as JSON strings in SQLite
2. **Timestamps**: Changed from PostgreSQL timestamps to SQLite integers
3. **Boolean Fields**: Converted to SQLite integers with boolean mode
4. **Database Queries**: All queries now use Drizzle ORM with D1 syntax

## 🐛 Troubleshooting

### Common Issues:
- **Type Errors**: Ensure all schema references use imported table names
- **Build Errors**: Check that `server/worker.ts` is properly configured
- **Database Errors**: Verify D1 database ID and permissions

### Testing:
```bash
# Run tests to verify setup
npm test

# Check build process
npm run build
```

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [D1 Database Guide](https://developers.cloudflare.com/d1/)
- [Hono Framework](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Netlify CMS](https://www.netlifycms.org/)

