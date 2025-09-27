# Solution: Enable Identity and Git Gateway for Netlify CMS

You're being asked for a username and password because the Identity service hasn't been enabled yet. Follow these steps to resolve this issue:

## Step 1: Access Your Site Dashboard

1. Go to: https://app.netlify.com/sites/thegoanwedding
2. Make sure you're logged into your Netlify account

## Step 2: Enable Identity Service

1. In the left sidebar of your site dashboard, look for "Identity"
2. Click on "Identity" 
3. Click the "Enable Identity" button
4. This will set up authentication for your site

## Step 3: Configure Registration Settings

1. Under the "Registration" section:
   - Select "Invite only" (recommended for security)
   - Or select "Open" if you want anyone to be able to sign up

2. If you selected "Invite only":
   - Click "Invite users"
   - Enter your email address
   - Click "Send invite"
   - Check your email for the invitation

## Step 4: Enable Git Gateway

1. Scroll down to the "Services" section
2. Click "Enable Git Gateway"
3. You may need to authorize Netlify to access your GitHub account

## Step 5: Access Your CMS

After completing the above steps:

1. Go to: https://thegoanwedding.netlify.app/admin
2. Click "Login with Netlify Identity"
3. If you invited yourself, check your email for the invitation
4. Create a password when prompted
5. Log in to your CMS

## Troubleshooting

### If You Still See Username/Password Prompt

1. Make sure you clicked "Enable Identity" in the Netlify dashboard
2. Refresh the admin page
3. Try accessing in an incognito/private browser window
4. Clear your browser cache and cookies for the site

### If Identity Doesn't Appear in Sidebar

1. Make sure you're viewing the correct site (thegoanwedding)
2. Refresh the Netlify dashboard page
3. Try signing out and back into Netlify
4. Check that you have proper permissions for this site

### If Git Gateway Won't Enable

1. Make sure your GitHub repository is properly connected
2. Check that you have admin permissions on the GitHub repository
3. Try disconnecting and reconnecting your GitHub account in Netlify user settings

## Need Help?

If you're still having issues:

1. Check the [Netlify Documentation](https://docs.netlify.com/)
2. Review the [Netlify CMS Documentation](https://www.netlifycms.org/docs/intro/)
3. Contact Netlify support through the dashboard