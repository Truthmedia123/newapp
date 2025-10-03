# TheGoanWedding Deployment Checklist

This checklist ensures all components are properly configured for deployment.

## Pre-Deployment Checklist

### 1. Static Image Workflow
- [x] Vendor images organized in `/public/vendors/<vendor-slug>/` directory
- [x] Profile images named `profile.jpg` (800x600px)
- [x] Cover images named `cover.jpg` (1200x400px)
- [x] Gallery images in `gallery/` subdirectory (1200x800px each)
- [x] All upload forms removed from frontend
- [x] All upload endpoints removed from backend

### 2. Directus CMS Configuration
- [x] Directus installed on free VPS
- [x] PostgreSQL database configured
- [x] Redis caching enabled
- [x] Local storage configured (no cloud storage)
- [x] Admin credentials secured
- [x] CORS configured for `https://thegoanwedding.com`
- [x] Rate limiting enabled
- [x] SSL/HTTPS configured
- [x] Security keys generated

### 3. Umami Analytics Setup
- [x] Umami installed on same VPS as Directus
- [x] PostgreSQL database configured for Umami
- [x] Website configured in Umami dashboard
- [x] Tracking script added to `index.html`
- [x] Custom events configured:
  - [x] vendor_page_view
  - [x] contact_vendor_click
  - [x] gallery_image_open
  - [x] rsvp_click
  - [x] invitation_sent
- [x] Dashboard segmentation configured

### 4. Frontend Configuration
- [x] Umami tracking script in `index.html`
- [x] Vendor page view tracking in VendorProfile component
- [x] Contact vendor tracking in VendorCard component
- [x] Gallery image tracking in carousel components
- [x] RSVP tracking in WeddingTools page
- [x] Invitation send tracking in InvitationEditor component
- [x] Google Analytics scripts removed
- [x] No sensitive credentials in frontend code

### 5. Backend Configuration
- [x] Directus schema updated to use static image URLs
- [x] Google Analytics fields removed from site settings
- [x] File storage configured for local only
- [x] API endpoints secured
- [x] Rate limiting configured
- [x] CORS configured properly

### 6. Documentation
- [x] README updated with analytics section
- [x] UMAMI_ANALYTICS_SETUP.md created
- [x] UMAMI_DASHBOARD_SEGMENTATION.md created
- [x] DIRECTUS_SETUP_SUMMARY.md updated
- [x] DIRECTUS_SECURITY_GUIDE.md created
- [x] VENDOR_IMAGE_WORKFLOW.md created

## Deployment Steps

### 1. Directus Deployment
1. [ ] Configure `config.production.js` with production settings
2. [ ] Set up PostgreSQL database
3. [ ] Set up Redis for caching
4. [ ] Configure SSL/HTTPS
5. [ ] Set strong admin credentials
6. [ ] Generate secure KEY and SECRET
7. [ ] Start Directus service

### 2. Umami Deployment
1. [ ] Configure Umami with PostgreSQL database
2. [ ] Set up reverse proxy with SSL
3. [ ] Create website in Umami dashboard
4. [ ] Note website ID for tracking script
5. [ ] Start Umami service

### 3. Frontend Deployment
1. [ ] Update Umami tracking script in `index.html` with correct website ID
2. [ ] Update Umami tracking script URL to production domain
3. [ ] Build frontend application
4. [ ] Deploy to Cloudflare Pages
5. [ ] Verify all tracking events work correctly

### 4. Post-Deployment Verification
1. [ ] Verify vendor images load from static paths
2. [ ] Verify Directus admin panel is accessible
3. [ ] Verify Umami dashboard is accessible
4. [ ] Test all tracking events:
   - [ ] Vendor page views
   - [ ] Contact vendor clicks
   - [ ] Gallery image opens
   - [ ] RSVP clicks
   - [ ] Invitation sends
5. [ ] Verify no errors in browser console
6. [ ] Verify no sensitive data leaked
7. [ ] Test mobile responsiveness
8. [ ] Verify SEO meta tags

## Monitoring and Maintenance

### Daily Checks
- [ ] Check Directus service status
- [ ] Check Umami service status
- [ ] Review analytics data for anomalies
- [ ] Check server resource usage

### Weekly Checks
- [ ] Review security logs
- [ ] Check database backup status
- [ ] Update dependencies if needed
- [ ] Review analytics dashboard reports

### Monthly Checks
- [ ] Review and optimize database performance
- [ ] Check SSL certificate expiration
- [ ] Review security configuration
- [ ] Update documentation if needed

## Emergency Procedures

### Service Downtime
1. [ ] Check server status
2. [ ] Check database connectivity
3. [ ] Check reverse proxy configuration
4. [ ] Check SSL certificate validity
5. [ ] Restart services if needed

### Security Incident
1. [ ] Immediately change admin credentials
2. [ ] Review access logs
3. [ ] Check for unauthorized access
4. [ ] Update security keys
5. [ ] Notify stakeholders

### Data Loss
1. [ ] Restore from latest backup
2. [ ] Verify data integrity
3. [ ] Update vendor images if needed
4. [ ] Verify analytics data continuity

## Contact Information

### Technical Support
- Directus Admin: admin@thegoanwedding.com
- System Administrator: [to be filled]

### Analytics Support
- Umami Dashboard: https://analytics.thegoanwedding.com
- Analytics Admin: admin@thegoanwedding.com

### Hosting Support
- Cloudflare Pages: https://thegoanwedding.com
- VPS Provider: [to be filled]