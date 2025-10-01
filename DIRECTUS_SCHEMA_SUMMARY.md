# Directus Schema Summary

This document summarizes the Directus collections and schema created for TheGoanWedding.com.

## Collections Overview

### 1. Vendors (`vendors.json`)
Primary collection for wedding vendor listings.

**Fields:**
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `category` (Many-to-One relation to categories)
- `description` (Text, Rich Text Editor)
- `price_range` (String, Options: "$", "$$", "$$$", "$$$$")
- `location` (String, Options: "North Goa", "South Goa")
- `phone` (String)
- `email` (Email)
- `website` (URL)
- `social_media` (JSON: facebook, instagram, linkedin, twitter)
- `images` (Files, Multiple)
- `featured_image` (File, Single)
- `rating` (Decimal, 1-5)
- `reviews_count` (Integer)
- `availability_calendar` (JSON)
- `status` (String, Options: "active", "inactive", "pending")
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

### 2. Categories (`categories.json`)
Vendor categories for organizing vendors.

**Fields:**
- `id` (Integer, Primary Key, Auto Increment)
- `name` (String, Required, Unique)
- `slug` (String, Unique)
- `description` (Text)
- `icon` (String, Icon selector)
- `color` (String, Color picker)
- `sort` (Integer)
- `status` (String, Options: "published", "draft", "archived")
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

### 3. Reviews (`reviews.json`)
Customer reviews for vendors.

**Fields:**
- `id` (Integer, Primary Key, Auto Increment)
- `vendor` (Many-to-One relation to vendors)
- `customer_name` (String, Required)
- `customer_email` (Email)
- `rating` (Integer, Required)
- `review` (Text, Required)
- `approved` (Boolean)
- `status` (String, Options: "published", "draft", "archived")
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

### 4. Blog Posts (`blog_posts.json`)
Wedding blog posts and articles.

**Fields:**
- `id` (Integer, Primary Key, Auto Increment)
- `title` (String, Required)
- `slug` (String, Required, Unique)
- `content` (Text, Rich Text, Required)
- `excerpt` (Text)
- `featured_image` (File, Single)
- `author` (String)
- `published_date` (Date)
- `seo_title` (String)
- `seo_description` (Text)
- `tags` (JSON, Tags)
- `status` (String, Options: "published", "draft", "archived")
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

### 5. Invitation Templates (`invitation_templates.json`)
Wedding invitation templates.

**Fields:**
- `id` (Integer, Primary Key, Auto Increment)
- `name` (String, Required)
- `description` (Text)
- `preview_image` (File, Single)
- `template_file` (JSON)
- `category` (String, Options: "traditional", "modern", "beach", "destination")
- `tags` (JSON, Tags)
- `featured` (Boolean)
- `status` (String, Options: "published", "draft", "archived")
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

### 6. Site Settings (`site_settings.json`)
Global site settings and configuration (Singleton).

**Fields:**
- `id` (Integer, Primary Key, Auto Increment)
- `site_name` (String)
- `logo` (File, Single)
- `favicon` (File, Single)
- `contact_info` (JSON: email, phone, address)
- `social_links` (JSON: facebook, instagram, twitter, linkedin)
- `google_analytics_id` (String)
- `google_ads_id` (String)
- `updated_at` (DateTime, Auto)

## Schema Export

All collections have been exported to a single `directus-schema.json` file that can be used for:
- Importing collections into a new Directus instance
- Version control of schema changes
- Migration between environments

## Import Script

An import script (`import-collections.js`) is available to:
- Automatically create collections and fields in Directus
- Handle updates to existing collections
- Provide error handling and logging

## Usage

To import the schema into Directus:
```bash
cd directus-cms
npm run import-collections
```

## Customization

You can customize any collection by modifying its JSON file in the `schema` directory and re-running the export script.

## Relationships

The schema includes the following relationships:
- Vendors → Categories (Many-to-One)
- Reviews → Vendors (Many-to-One)
- Blog Posts (standalone)
- Invitation Templates (standalone)
- Site Settings (singleton)

## Support

For issues with the schema:
- [Directus Documentation](https://docs.directus.io)
- Project documentation in the main repository