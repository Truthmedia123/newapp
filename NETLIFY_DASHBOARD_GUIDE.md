# Netlify Dashboard Guide for Identity and Git Gateway Setup

Now that your site is properly linked to Netlify, you can enable Identity and Git Gateway services. This guide will walk you through the steps.

## Accessing Your Site Dashboard

Your site dashboard can be accessed at:
https://app.netlify.com/projects/thegoanwedding

Or you can:
1. Go to https://app.netlify.com/
2. Sign in to your Netlify account
3. Find "thegoanwedding" in your sites list
4. Click on it to access the dashboard

## Enabling Identity Service

1. In your site dashboard, look for the left sidebar navigation
2. Click on "Identity" (it should be visible now that your site is properly linked)
3. Click the "Enable Identity" button
4. This will create an Identity service for your site

## Configuring Registration Preferences

1. Under the "Registration" section, choose your preference:
   - "Open" - Anyone can sign up
   - "Invite only" - Only invited users can sign up (recommended for admin access)
2. If you choose "Invite only":
   - Click "Invite users"
   - Enter your email address
   - Click "Send invite"

## Enabling Git Gateway

1. In the same "Identity" section, scroll down to "Services"
2. Click "Enable Git Gateway"
3. You may need to provide your GitHub credentials again

## Verifying Setup

After enabling Identity and Git Gateway:

1. You should see "Identity" listed in the left sidebar with a green indicator
2. The "Services" section should show Git Gateway as enabled
3. You can now access your CMS at: https://thegoanwedding.netlify.app/admin

## Troubleshooting

### If You Still Can't See Identity in the Sidebar

1. Refresh the page
2. Make sure you're viewing the correct site (thegoanwedding)
3. Check that you have the proper permissions for this site
4. Try signing out and back in to Netlify

### If Git Gateway Won't Enable

1. Make sure your GitHub repository is properly connected
2. Check that you have admin permissions on the GitHub repository
3. Try disconnecting and reconnecting your GitHub account in Netlify user settings

## Accessing Netlify CMS

Once everything is set up:

1. Visit https://thegoanwedding.netlify.app/admin
2. Click "Login with Netlify Identity"
3. Enter your credentials or accept your invitation
4. You should now see the Netlify CMS dashboard

## Need Help?

If you're still having issues:

1. Check the [Netlify Documentation](https://docs.netlify.com/)
2. Review the [Netlify CMS Documentation](https://www.netlifycms.org/docs/intro/)
3. Contact Netlify support through the dashboard