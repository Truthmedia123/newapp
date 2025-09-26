# Netlify Setup Guide

This guide will help you set up your wedding website with Netlify CMS for content management.

**For a more detailed deployment guide, please see [NETLIFY_DEPLOYMENT_GUIDE.md](NETLIFY_DEPLOYMENT_GUIDE.md)**

## Prerequisites

1. A GitHub account
2. A Netlify account
3. This repository forked or cloned to your GitHub account

## Netlify Deployment Setup

### 1. Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/) and sign in or create an account
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub repositories
5. Select your wedding website repository

### 2. Configure Build Settings

Netlify should automatically detect the build settings, but if not, configure them as follows:

- **Build command**: `npm run build:production`
- **Publish directory**: `dist/public`
- **Functions directory**: `dist/functions` (if you have serverless functions)

### 3. Deploy

Click "Deploy site" to start the initial deployment.

## Netlify CMS Setup

### 1. Enable Identity

1. In your Netlify site dashboard, go to "Identity" in the navigation
2. Click "Enable Identity"
3. Under "Registration", select "Invite only" or "Open" depending on your preference
4. Add yourself as a user by entering your email and clicking "Invite"

### 2. Enable Git Gateway

1. In the same "Identity" section, scroll down to "Services"
2. Click "Enable Git Gateway"
3. You may need to provide your GitHub credentials

### 3. Configure Environment Variables

If your site requires environment variables:

1. Go to "Site settings" → "Build & deploy" → "Environment"
2. Add any required environment variables

## Accessing Netlify CMS

Once deployed, you can access the CMS at:
`https://your-site-url.com/admin`

The first time you access it, you'll need to:
1. Click "Login with Netlify Identity"
2. Check your email for an invitation (if you set registration to "Invite only")
3. Create a password
4. Log in to the CMS

## Content Management

### Collections

The CMS is configured with the following content collections:

1. **Checklists** - Wedding planning checklists
2. **Guides** - Vendor selection guides
3. **Settings** - Site configuration settings

### Creating Content

1. Navigate to the collection you want to add content to
2. Click "New [Collection Name]"
3. Fill in the required fields
4. Click "Publish" to save and deploy your changes

## Customization

### Updating the CMS Configuration

The CMS configuration is located at `client/public/admin/config.yml`. You can modify:
- Collections and their fields
- Media folders
- Preview templates
- Editorial workflow settings

### Custom Preview Styles

Preview styles are located at `client/public/admin/preview-styles.css`. Update these to match your site's styling.

## Troubleshooting

### Common Issues

1. **Authentication problems**: 
   - Ensure Git Gateway is enabled
   - Check that your email is added to the Identity service
   - Verify your site is deployed via Netlify (localhost won't work for authentication)
   - Make sure you're accessing the CMS at your actual deployed URL

2. **Content not appearing**:
   - Check that you clicked "Publish" after creating content
   - Verify the build completed successfully in Netlify
   - Check that your content files are in the correct directories

3. **Build errors**:
   - Check the Netlify build logs for specific error messages
   - Ensure all dependencies are correctly listed in package.json

### Getting Help

- [Netlify CMS Documentation](https://www.netlifycms.org/docs/intro/)
- [Netlify Documentation](https://docs.netlify.com/)
- Contact support through the Netlify dashboard

## Local Development

To run the CMS locally:

```bash
npm run dev
```

Then visit `http://localhost:8888/admin` to access the CMS.

Note: Authentication will not work locally unless you set up Netlify's local development environment.