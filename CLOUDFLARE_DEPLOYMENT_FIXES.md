# Cloudflare Deployment Fixes

## Problem
The website was showing "Not Found" despite successful builds because:
1. The wrong deployment command was being used (`wrangler deploy` instead of `wrangler pages deploy`)
2. The Cloudflare Pages project configuration was conflicting with the Worker configuration
3. The static assets were not being properly deployed to Cloudflare Pages

## Solutions Implemented

### 1. Corrected Deployment Command
Changed from:
```bash
npx wrangler deploy
```

To:
```bash
npx wrangler pages deploy dist/public --project-name=weddingreplit
```

### 2. Separated Configuration Files
- Renamed the original `wrangler.toml` to `wrangler-worker.toml` during deployment
- This prevented conflicts between Worker and Pages configurations

### 3. Updated Package.json Scripts
Added new deployment scripts:
- `deploy:pages` - Deploys static assets to Cloudflare Pages
- Uses the correct command for Pages deployment

### 4. Fixed Worker Route Handling
Updated `server/worker.ts` to properly handle unmatched routes by using `app.notFound()` instead of `app.all('*', ...)` which was returning "Not Found" for all routes.

## Deployment Process

### For Cloudflare Pages (Frontend):
1. Build the project: `npm run build:production`
2. Deploy static assets: `npm run deploy:pages`

### For Cloudflare Workers (Backend API):
1. Build the project: `npm run build:production`
2. Deploy worker: `npm run deploy:production`

## Important Notes

1. **Configuration Conflicts**: Cloudflare Workers and Pages cannot share the same wrangler.toml file due to different configuration requirements.

2. **Project Names**: The project name in Cloudflare is "weddingreplit", not "thegoanwedding".

3. **Static Assets**: The frontend is served by Cloudflare Pages from the `dist/public` directory.

4. **API Routes**: The backend API routes are handled by the Cloudflare Worker.

## Custom Domain Setup

To connect your custom domain (thegoanwedding.com):
1. Go to the Cloudflare dashboard
2. Navigate to your Pages project
3. Go to "Custom domains"
4. Add your domain (thegoanwedding.com)
5. Follow the DNS configuration instructions

## Verification

After deployment, you can verify the site is working by visiting:
- Temporary URL: https://cc747563.weddingreplit.pages.dev
- Custom domain (once configured): https://thegoanwedding.com

## Future Improvements

1. Consider using GitHub Actions for automated deployments
2. Set up proper environment variables for different environments
3. Implement proper error handling for API routes
4. Add monitoring and logging for the Worker