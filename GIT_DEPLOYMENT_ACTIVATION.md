# How to Activate Automatic Git Deployment for Cloudflare Pages

Your Cloudflare Pages project exists but is not yet connected to your Git repository for automatic deployments. Here's how to activate it:

## Current Status
- Project Name: `weddingreplit`
- Project Domain: `weddingreplit.pages.dev`
- Git Provider: **Not connected** (This is what needs to be fixed)
- Last Modified: 1 hour ago

## Steps to Activate Automatic Git Deployment

### Step 1: Access Cloudflare Dashboard
1. Log in to your Cloudflare account at https://dash.cloudflare.com
2. Navigate to the "Pages" section
3. Find and click on your project `weddingreplit`

### Step 2: Connect to Git Repository
1. In your project dashboard, click on "Settings" in the left sidebar
2. Click on "Build & deploy" tab
3. Under the "Git repository" section, click the "Connect to Git" button
4. Select "GitHub" as your Git provider

### Step 3: Authorize GitHub Access
1. You'll be redirected to GitHub to authorize Cloudflare Pages
2. Review the permissions and click "Authorize cloudflare"
3. You may need to enter your GitHub password for confirmation

### Step 4: Select Your Repository
1. Find and select `Truthmedia123/newapp` from the repository list
2. Click "Begin setup"

### Step 5: Configure Build Settings
Make sure these settings are correct:
- **Production branch**: `main`
- **Build command**: `npm run build:production`
- **Build output directory**: `dist/public`

### Step 6: Environment Variables
Add these environment variables:
- `NODE_ENV` = `production`
- `SITE_URL` = `https://weddingreplit.pages.dev`

### Step 7: D1 Database Binding
1. Go to "Settings" > "Functions"
2. Under "D1 Database Bindings", add:
   - Variable name: `DB`
   - Database: Select `wedding_platform_db`

### Step 8: Save and Deploy
1. Click "Save and Deploy"
2. Cloudflare will automatically start building your project from the latest commit

## Verification

After completing these steps, you should see:
- Git Provider: "GitHub" instead of "No"
- Automatic builds triggered when you push to your repository
- Deployment logs showing "Git" as the source

## Future Workflow

Once activated, your deployment workflow will be:
```bash
# Make changes to your code
git add .
git commit -m "Your descriptive message"
git push origin main
# Cloudflare Pages will automatically detect the push and start building
```

## Troubleshooting

If automatic deployments don't start working:

1. **Check repository permissions**: Ensure Cloudflare has access to your repository
2. **Verify branch name**: Make sure you're pushing to the correct branch (`main`)
3. **Check build settings**: Ensure build command and output directory are correct
4. **Review logs**: Check the deployment logs in Cloudflare dashboard for errors

## Support

If you continue to experience issues:
1. Check Cloudflare's documentation for Pages Git integration
2. Review the project's DEPLOYMENT.md file
3. Contact Cloudflare support for platform-specific issues