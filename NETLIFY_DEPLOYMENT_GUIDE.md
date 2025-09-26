# Netlify Deployment Guide

This guide will walk you through the complete process of deploying your wedding website to Netlify and setting up Netlify CMS.

## Prerequisites

1. A GitHub account (which you already have since you're using GitHub)
2. A Netlify account (free to create)

## Step-by-Step Netlify Setup

### Step 1: Create a Netlify Account

1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Click "Sign up" if you don't have an account
3. Sign up using your GitHub account for easier integration

### Step 2: Deploy Your Site from GitHub

1. In Netlify dashboard, click the "Add new site" button
2. Select "Import an existing project"
3. Choose "GitHub" as your Git provider
4. You may need to authorize Netlify to access your GitHub repositories
5. Find and select your wedding website repository (likely named something like "newapp")
6. Configure the deployment settings:
   - **Branch to deploy**: main
   - **Build command**: `npm run build:production`
   - **Publish directory**: `dist/public`
7. Click "Deploy site"

### Step 3: Wait for Initial Deployment

Netlify will now:
1. Clone your repository
2. Run the build command
3. Deploy your site

This process usually takes 1-3 minutes. You'll see the deployment status in the Netlify dashboard.

### Step 4: Access Your Deployed Site

1. Once deployment is complete, you'll see a temporary Netlify URL (something like `your-site-name.netlify.app`)
2. Click on this URL to view your live site
3. Note this URL as you'll need it for CMS configuration

### Step 5: Set up Custom Domain (Optional)

1. In your site dashboard, go to "Domain management"
2. Click "Add custom domain"
3. Enter your domain name (e.g., thegoanwedding.com)
4. Follow Netlify's DNS configuration instructions

## Setting up Identity and Git Gateway

### Step 1: Enable Identity Service

1. In your Netlify site dashboard, click on the "Identity" tab in the left sidebar
2. Click the "Enable Identity" button
3. This will create an Identity service for your site

### Step 2: Configure Registration Preferences

1. Under "Registration", choose your preference:
   - "Open" - Anyone can sign up
   - "Invite only" - Only invited users can sign up (recommended for admin access)
2. If you choose "Invite only", add yourself as a user:
   - Click "Invite users"
   - Enter your email address
   - Click "Send invite"

### Step 3: Enable Git Gateway

1. In the same "Identity" section, scroll down to "Services"
2. Click "Enable Git Gateway"
3. You may need to provide your GitHub credentials again

### Step 4: Configure CMS Access

1. Your CMS will be accessible at `https://your-site-url.com/admin`
2. The first time you access it, you'll need to:
   - Click "Login with Netlify Identity"
   - Check your email for an invitation (if you set registration to "Invite only")
   - Create a password
   - Log in to the CMS

## Troubleshooting Common Issues

### Issue: Can't Find Identity or Git Gateway Options

**Cause**: These options only appear after your site is successfully deployed to Netlify.

**Solution**:
1. Make sure you've completed the deployment process
2. Check that your site shows as "Published" in the Netlify dashboard
3. Refresh the page if options don't appear immediately

### Issue: CMS Login Not Working

**Cause**: Incorrect Identity configuration or not properly deployed.

**Solution**:
1. Verify Identity service is enabled
2. Verify Git Gateway is enabled
3. Check that your site is deployed (not just in build process)
4. Make sure you're accessing the CMS at your actual deployed URL, not localhost

### Issue: Build Failures

**Cause**: Incorrect build settings or missing dependencies.

**Solution**:
1. Verify build command is `npm run build:production`
2. Verify publish directory is `dist/public`
3. Check the deploy logs for specific error messages
4. Ensure all dependencies are in package.json

## Accessing Netlify CMS

Once everything is set up:

1. Visit `https://your-deployed-site-url.com/admin`
2. Click "Login with Netlify Identity"
3. Enter your credentials or accept your invitation
4. You should now see the Netlify CMS dashboard

## Local Development with Netlify CMS

For local development:

1. Run `npm run dev` or `npm run pages:dev`
2. Access the site at `http://localhost:8787` (or the port specified)
3. Note: Authentication will not work locally unless you set up Netlify's local development environment

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

## Need Help?

If you're still having issues:

1. Check the [Netlify Documentation](https://docs.netlify.com/)
2. Review the [Netlify CMS Documentation](https://www.netlifycms.org/docs/intro/)
3. Contact Netlify support through the dashboard