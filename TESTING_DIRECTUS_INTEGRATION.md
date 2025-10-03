# Testing Directus Integration

This document provides instructions for testing the Directus integration in TheGoanWedding project.

## Prerequisites

1. Directus CMS running at `http://localhost:8055`
2. Application running at `http://localhost:5001`
3. Proper permissions configured in Directus for public access

## Test Plan

### 1. Verify Directus is Running

```bash
# Check if Directus is accessible
curl -I http://localhost:8055

# Expected response: HTTP/1.1 200 OK
```

### 2. Test Directus API Endpoints

```bash
# Test vendors endpoint
curl http://localhost:8055/items/vendors

# Test categories endpoint
curl http://localhost:8055/items/categories

# Test blog posts endpoint
curl http://localhost:8055/items/blog_posts
```

### 3. Configure Directus Permissions

1. Log in to Directus admin at `http://localhost:8055`
2. Go to "Settings" → "Roles & Permissions"
3. Edit the "Public" role
4. For each collection:
   - Set "Read" permissions to "All"
   - Save changes

### 4. Test Application Homepage

1. Start the application:
   ```bash
   npm run dev
   ```

2. Open browser to `http://localhost:5001`
3. Verify:
   - Homepage loads without errors
   - Featured vendors section displays data
   - Blog section displays data
   - No console errors related to API calls

### 5. Test API Integration

Run the provided test script:
```bash
npm run test:directus
```

Expected output:
```
Testing Directus connection...
Directus URL: http://localhost:8055
Fetching vendors...
Successfully fetched X vendors
Fetching categories...
Successfully fetched Y categories
Fetching blog posts...
Successfully fetched Z blog posts
✅ All Directus connections successful!
Directus integration is working correctly.
```

## Troubleshooting

### If API Calls Fail

1. Check browser console for errors
2. Verify Directus permissions for public access
3. Check network tab for failed API requests
4. Ensure Directus is running and accessible

### If Content Doesn't Display

1. Verify data exists in Directus collections
2. Check that collections have proper field mappings
3. Confirm React components are using correct field names

### If Authentication Errors Occur

1. Verify `DIRECTUS_TOKEN` environment variable if using token authentication
2. Check user permissions in Directus
3. Ensure proper role assignments

## Manual Testing Steps

### Homepage
1. Navigate to `http://localhost:5001`
2. Verify featured vendors load
3. Verify blog posts load
4. Check for any console errors

### Vendor Pages
1. Navigate to a vendor category page
2. Verify vendors list loads correctly
3. Check vendor detail pages

### Blog Pages
1. Navigate to `/blog`
2. Verify blog posts list
3. Check individual blog post pages

## Automated Testing

The project includes automated tests that can be run with:
```bash
npm test
```

These tests verify:
- API connectivity
- Data fetching
- Component rendering
- Error handling

## CI/CD Integration

For deployment:
1. Ensure Directus is deployed and accessible
2. Configure environment variables
3. Set up proper permissions
4. Run deployment scripts

## Monitoring

After deployment, monitor:
- API response times
- Error rates
- Content updates
- User feedback

## Rollback Plan

If issues occur:
1. Revert to previous version
2. Restore Directus database backup
3. Check permissions and configuration
4. Contact support if needed