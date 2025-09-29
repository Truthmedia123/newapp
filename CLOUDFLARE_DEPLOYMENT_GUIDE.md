# Cloudflare Deployment Guide

## Overview
This guide explains how to manually deploy your TheGoanWedding website to Cloudflare Pages since we encountered issues with the automated deployment process.

## Prerequisites
1. A Cloudflare account
2. A domain name (thegoanwedding.com) added to Cloudflare
3. The `thegoanwedding-deployment.zip` file that was created in your project directory

## Manual Deployment Steps

### Step 1: Access Cloudflare Dashboard
1. Log in to your Cloudflare account at https://dash.cloudflare.com
2. Navigate to the "Pages" section
3. If you don't have a project named "thegoanwedding", create one

### Step 2: Create or Configure Your Project
1. Click on "Create a project" or select your existing "thegoanwedding" project
2. If creating a new project, name it "thegoanwedding"

### Step 3: Upload Your Build
1. In your project dashboard, click on "Upload assets"
2. Select the `thegoanwedding-deployment.zip` file from your project directory
3. Wait for the upload and deployment to complete

### Step 4: Configure Build Settings (if needed)
If you're setting up the project for the first time, you may need to configure:
- Build command: `npm run build:production`
- Build output directory: `dist/public`

### Step 5: Configure Environment Variables
Add these environment variables in the Cloudflare Pages dashboard:
1. Go to your project settings
2. Navigate to "Environment variables"
3. Add:
   - `NODE_ENV` = `production`
   - `SITE_URL` = `https://thegoanwedding.com`

### Step 6: Connect Your Custom Domain
1. In your project settings, go to "Custom domains"
2. Add your domain "thegoanwedding.com"
3. Follow Cloudflare's DNS configuration instructions

### Step 7: Configure D1 Database (if needed)
If your application requires database access:
1. Create a D1 database in Cloudflare if you haven't already
2. Bind the database to your Pages project in the "Functions" settings
3. Add the database binding with name "DB"

## Alternative: Using Wrangler CLI (if blake3-wasm issue is resolved)
If you manage to resolve the blake3-wasm issue, you can deploy using:

```bash
npm run pages:deploy
```

Or directly with Wrangler:

```bash
npx wrangler pages deploy dist/public --project-name=thegoanwedding
```

## Troubleshooting

### Blake3-wasm Issue
The blake3-wasm error is a known issue on Windows with certain versions of Wrangler. To resolve this:

1. Try updating Node.js to the latest LTS version
2. Clear npm cache: `npm cache clean --force`
3. Reinstall dependencies: `npm install`
4. Try using a different terminal or command prompt

### Deployment Failures
If manual deployment through the dashboard fails:
1. Ensure the zip file isn't corrupted
2. Check that all required files are included
3. Verify file permissions
4. Try creating a new zip file with a different compression tool

## Verification
After deployment:
1. Visit https://thegoanwedding.com
2. Check that all pages load correctly
3. Test forms and interactive elements
4. Verify that the site is served over HTTPS

## Support
If you continue to experience issues:
1. Check Cloudflare's documentation
2. Review the project's DEPLOYMENT.md file
3. Contact Cloudflare support for platform-specific issues

## Recent Updates

Your Cloudflare setup has been successfully restored! Here's the current status:

### Database
- ✅ D1 Database `wedding_platform_db` exists with UUID `eb586981-d322-4e17-a982-6397604e3fc4`
- ✅ Database schema has been initialized with all required tables

### Frontend
- ✅ Cloudflare Pages project `weddingreplit` created
- ✅ Frontend deployed to https://weddingreplit.pages.dev

### Backend
- ✅ Pages Functions deployed for API endpoints
- ✅ Health check and database test endpoints available

### Next Steps
1. Bind the D1 database to your Pages project in the Cloudflare dashboard
2. Set environment variables in the Cloudflare dashboard
3. Configure your custom domain (thegoanwedding.com) if needed
4. Test all functionality

For detailed instructions on completing these steps, refer to:
- `CLOUDFLARE_RESTORE_GUIDE.md` - Step-by-step restoration guide
- `CLOUDFLARE_RESTORATION_SUMMARY.md` - Complete summary of work done
- `CLOUDFLARE_COMPLETE_SETUP.md` - Full architecture overview

Your site is almost ready! Complete the manual steps in the Cloudflare dashboard and your wedding vendor directory website will be fully functional.