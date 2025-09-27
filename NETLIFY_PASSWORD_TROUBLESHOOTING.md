# Netlify Password Troubleshooting Guide

If you're having trouble setting a password for your Netlify CMS, here are the most common issues and solutions:

## Common Issues and Solutions

### 1. Invitation Not Received or Expired

**Problem**: You haven't received the invitation email or it has expired.

**Solutions**:
- Check your spam/junk folder
- Verify the email address was entered correctly
- Ask to be invited again
- Try using a different email address

**How to re-invite**:
1. Go to: https://app.netlify.com/sites/thegoanwedding/identity
2. Click on "Users" in the left sidebar
3. Click "Invite users" 
4. Enter your email address again
5. Click "Send invite"

### 2. Password Requirements Not Met

**Problem**: Your password doesn't meet security requirements.

**Solutions**:
- Use at least 8 characters
- Include both uppercase and lowercase letters
- Include at least one number
- Include at least one special character
- Don't use common passwords like "password123"

### 3. Browser Issues

**Problem**: Browser cache or extensions are interfering.

**Solutions**:
- Try in an incognito/private browsing window
- Clear your browser cache and cookies
- Try a different browser
- Disable browser extensions temporarily

### 4. Identity Service Not Properly Configured

**Problem**: Identity service may not be fully set up.

**Solutions**:
1. Go to: https://app.netlify.com/sites/thegoanwedding/identity
2. Make sure "Identity" shows as enabled (green status)
3. Verify "Git Gateway" is enabled under "Services"
4. Check that registration settings are configured

### 5. Registration Settings Issues

**Problem**: Registration settings might be preventing account creation.

**Solutions**:
1. Go to: https://app.netlify.com/sites/thegoanwedding/identity
2. Under "Registration", ensure it's set to either:
   - "Open" - Anyone can sign up
   - "Invite only" - Only invited users can sign up
3. If set to "Invite only", make sure you've been invited

## Step-by-Step Password Reset Process

### If You Already Have an Account:

1. Go to: https://thegoanwedding.netlify.app/admin
2. Click "Login with Netlify Identity"
3. Click "Forgot password?"
4. Enter your email address
5. Check your email for the password reset link
6. Click the link and set a new password

### If You Need to Create an Account:

1. Make sure you've been invited
2. Check your email for the invitation from Netlify
3. Click "Accept invitation" in the email
4. Create a strong password that meets requirements
5. Confirm your password
6. Click "Set password"

## Alternative Access Methods

### Direct Admin Access:

1. Go directly to: https://thegoanwedding.netlify.app/admin
2. Click "Login with Netlify Identity"
3. Enter your email address
4. Follow the password creation process

### Netlify Dashboard Access:

1. Go to: https://app.netlify.com/sites/thegoanwedding
2. Click on "Identity" in the left sidebar
3. Click on "Users"
4. If you see your email, click on it
5. You can resend invitation or reset password from here

## Need Help?

If you're still having issues:

1. Check the [Netlify Documentation](https://docs.netlify.com/)
2. Review the [Netlify CMS Documentation](https://www.netlifycms.org/docs/intro/)
3. Contact Netlify support through the dashboard
4. Try the Netlify community forums