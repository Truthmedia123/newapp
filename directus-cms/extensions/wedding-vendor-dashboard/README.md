# Wedding Vendor Dashboard Module

A custom dashboard module for Directus that provides an overview of wedding vendor management metrics and quick actions.

## Features

- Vendor statistics overview
- Recent activity feed
- Quick navigation to key collections
- Top-rated vendors display
- Responsive design

## Installation

1. Place this folder in your Directus extensions directory
2. Run `npm install` in this directory
3. Build the extension with `npm run build`
4. Restart your Directus instance

## Usage

After installation, the Wedding Vendor Dashboard will appear as a new module in the Directus admin panel. It provides:

### Statistics Overview
- Total vendors count
- Featured vendors count
- Pending reviews count
- Pending bookings count

### Recent Activity
- Latest vendor additions
- Recently approved reviews
- Recently confirmed bookings

### Quick Actions
- Add new vendor
- Manage vendors
- View bookings
- Manage reviews
- Edit categories

### Top Rated Vendors
- Display of highest-rated vendors
- Average ratings
- Review counts

## Customization

You can customize this module by modifying the `module.vue` file:

1. Update the statistics calculations to match your data model
2. Modify the recent activity feed to show relevant events
3. Customize the quick actions to match your workflow
4. Adjust the styling in the `<style>` section

## API Integration

This module is designed to work with the wedding vendor schema defined in `schema/wedding-vendors.yaml`. Make sure you have imported that schema before using this module.

## Support

For issues with this extension, please refer to the main Directus documentation or contact the development team.