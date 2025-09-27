# Netlify Deployment - Complete Guide

This document provides a complete guide for deploying your wedding website to Netlify, including troubleshooting steps for common issues.

## Prerequisites

1. A GitHub account with your repository (Truthmedia123/newapp)
2. A Netlify account
3. Node.js and npm installed
4. Netlify CLI installed (`npm install -g netlify-cli`)

## Deployment Options

### Option 1: Deploy from GitHub (Recommended)

1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub repositories
5. Select your wedding website repository (Truthmedia123/newapp)
6. Configure build settings:
   - Build command: `npm run build:production`
   - Publish directory: `dist/public`
7. Click "Deploy site"

### Option 2: Manual ZIP Deployment

A ZIP file has already been created for you:
- File: `thegoanwedding-deployment.zip`
- Location: Project root directory

To deploy using this ZIP file:
1. Go to your Netlify site dashboard
2. Drag and drop the ZIP file onto the deployment area
3. Or click "Deploy manually" and upload the ZIP file

### Option 3: Netlify CLI Deployment

If you want to use the Netlify CLI:

1. Make sure you're logged in:
   ```bash
   netlify login
   ```

2. Link your project to a Netlify site:
   ```bash
   netlify link
   ```

3. Deploy to production:
   ```bash
   netlify deploy --prod --dir dist/public
   ```

## Setting up Identity and Git Gateway

**IMPORTANT**: These options will ONLY appear AFTER your site is successfully deployed.

1. In your Netlify site dashboard, click on the "Identity" tab
2. Click "Enable Identity"
3. Under "Registration", select "Invite only" (recommended)
4. Add yourself as a user by entering your email
5. Scroll down to "Services" and click "Enable Git Gateway"

## Accessing Netlify CMS

Once deployment is complete and Identity/Git Gateway are enabled:

1. Visit `https://your-deployed-site-url.com/admin`
2. Click "Login with Netlify Identity"
3. Check your email for an invitation
4. Create a password and log in

## Troubleshooting Common Issues

### Issue: Netlify CLI Deployment Fails

If you're having issues with the Netlify CLI:

1. Try reinstalling the Netlify CLI:
   ```bash
   npm uninstall -g netlify-cli
   npm install -g netlify-cli
   ```

2. Make sure you're logged in:
   ```bash
   netlify login
   ```

3. Check your site is properly linked:
   ```bash
   netlify status
   ```

### Issue: Identity/Git Gateway Options Not Visible

**Cause**: These features are only available after successful deployment to Netlify.

**Solution**:
1. Complete the deployment process first
2. Wait for the site to be published
3. Refresh the Netlify dashboard
4. The "Identity" tab should now be visible

### Issue: CMS Login Not Working

**Solution**:
1. Verify Identity service is enabled
2. Verify Git Gateway is enabled
3. Make sure you're accessing the CMS at your actual deployed URL
4. Check that you've accepted the invitation email

## Content Management

### Collections

Your CMS is configured with:

1. **Checklists** - Wedding planning checklists
2. **Guides** - Vendor selection guides
3. **Settings** - Site configuration settings

### Creating Content

1. Navigate to the collection you want to add content to
2. Click "New [Collection Name]"
3. Fill in the required fields
4. Click "Publish" to save and deploy your changes

## Local Development

For local development:

```bash
npm run dev
```

Then visit `http://localhost:8787/admin` to access the CMS locally.

Note: Authentication will not work locally unless you set up Netlify's local development environment.

## Need Help?

If you're still having issues:

1. Check the [Netlify Documentation](https://docs.netlify.com/)
2. Review the [Netlify CMS Documentation](https://www.netlifycms.org/docs/intro/)
3. Contact Netlify support through the dashboard