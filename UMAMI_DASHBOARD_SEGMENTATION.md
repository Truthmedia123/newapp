# Umami Dashboard Segmentation Guide

This guide explains how to set up dashboard segmentation in Umami Analytics for TheGoanWedding platform.

## Custom Metrics Setup

### 1. Vendor Views by Category

1. In the Umami dashboard, go to "Settings" > "Websites" and select your website
2. Click on "Custom metrics" tab
3. Click "Add metric"
4. Configure the metric:
   - Name: "Vendor Views by Category"
   - Type: "Event"
   - Event name: "vendor_page_view"
   - Property: "vendor_category"
   - Aggregation: "Count"

### 2. RSVP Conversion Rate

1. In the Umami dashboard, go to "Settings" > "Websites" and select your website
2. Click on "Custom metrics" tab
3. Click "Add metric"
4. Configure the metric:
   - Name: "RSVP Conversion Rate"
   - Type: "Event"
   - Event name: "rsvp_click"
   - Property: "status"
   - Aggregation: "Count"

### 3. Invitation Send Rate

1. In the Umami dashboard, go to "Settings" > "Websites" and select your website
2. Click on "Custom metrics" tab
3. Click "Add metric"
4. Configure the metric:
   - Name: "Invitation Send Rate"
   - Type: "Event"
   - Event name: "invitation_sent"
   - Property: "template_name"
   - Aggregation: "Count"

### 4. Popular Gallery Images

1. In the Umami dashboard, go to "Settings" > "Websites" and select your website
2. Click on "Custom metrics" tab
3. Click "Add metric"
4. Configure the metric:
   - Name: "Popular Gallery Images"
   - Type: "Event"
   - Event name: "gallery_image_open"
   - Property: "image_index"
   - Aggregation: "Count"

### 5. Contact Method Preferences

1. In the Umami dashboard, go to "Settings" > "Websites" and select your website
2. Click on "Custom metrics" tab
3. Click "Add metric"
4. Configure the metric:
   - Name: "Contact Method Preferences"
   - Type: "Event"
   - Event name: "contact_vendor_click"
   - Property: "contact_method"
   - Aggregation: "Count"

## Dashboard Segmentation

### 1. By Vendor ID

1. In the Umami dashboard, go to the main analytics page
2. Click on "Filter" button
3. Select "Event property" as the filter type
4. Choose "vendor_id" as the property
5. Enter the specific vendor ID you want to filter by

### 2. By Vendor Category

1. In the Umami dashboard, go to the main analytics page
2. Click on "Filter" button
3. Select "Event property" as the filter type
4. Choose "vendor_category" as the property
5. Enter the specific vendor category you want to filter by (e.g., "photography", "catering")

### 3. By Event Type

1. In the Umami dashboard, go to the main analytics page
2. Click on "Filter" button
3. Select "Event name" as the filter type
4. Choose the specific event you want to filter by:
   - vendor_page_view
   - contact_vendor_click
   - gallery_image_open
   - rsvp_click
   - invitation_sent

### 4. By User Location

1. In the Umami dashboard, go to the main analytics page
2. Click on "Filter" button
3. Select "Country" or "Region" as the filter type
4. Choose the specific location you want to filter by

### 5. By Device Type

1. In the Umami dashboard, go to the main analytics page
2. Click on "Filter" button
3. Select "Device" as the filter type
4. Choose the specific device type you want to filter by:
   - Desktop
   - Mobile
   - Tablet

## Creating Custom Reports

### 1. Vendor Performance Report

1. In the Umami dashboard, go to "Reports" section
2. Click "Add report"
3. Configure the report:
   - Title: "Vendor Performance Report"
   - Metrics: Vendor Views by Category, Contact Method Preferences
   - Filters: Specific date range
   - Group by: vendor_category

### 2. Engagement Metrics Report

1. In the Umami dashboard, go to "Reports" section
2. Click "Add report"
3. Configure the report:
   - Title: "Engagement Metrics Report"
   - Metrics: RSVP Conversion Rate, Invitation Send Rate, Popular Gallery Images
   - Filters: Specific date range
   - Group by: Event Type

## Best Practices

### 1. Regular Monitoring

- Check analytics daily for unusual patterns
- Monitor conversion rates for different vendor categories
- Track user engagement with different features

### 2. Data Interpretation

- Compare metrics over time to identify trends
- Look for seasonal patterns in vendor views
- Identify high-performing vendors and categories

### 3. Privacy Compliance

- Ensure all tracking complies with local privacy laws
- Regularly review data retention settings
- Document data processing activities

## Troubleshooting

### Common Issues

1. **Metrics Not Showing Data**:
   - Verify that events are being tracked correctly
   - Check that custom metrics are configured with correct event names
   - Ensure the tracking script is loading properly

2. **Filters Not Working**:
   - Verify that event properties are being sent correctly
   - Check that property names match exactly
   - Ensure there is data for the selected time period

3. **Dashboard Performance Issues**:
   - Limit the number of metrics displayed on a single dashboard
   - Use appropriate date ranges for reports
   - Regularly clean up old data if needed

## Support Resources

- [Umami Documentation](https://umami.is/docs/)
- [Umami GitHub Repository](https://github.com/umami-software/umami)
- [Community Forum](https://github.com/umami-software/umami/discussions)