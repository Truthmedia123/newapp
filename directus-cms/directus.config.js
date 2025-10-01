import { defineConfig } from 'directus';

export default defineConfig({
  // Database configuration
  db: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: {
      filename: process.env.DB_FILENAME || './data.db',
    },
  },

  // Server configuration
  port: process.env.PORT || 8055,
  host: '0.0.0.0',
  public_url: process.env.PUBLIC_URL || 'http://localhost:8055',

  // Authentication configuration
  auth: {
    providers: [],
  },

  // Storage configuration for vendor images and documents
  storage: {
    locations: [
      {
        name: 'local',
        driver: 'local',
        root: './uploads',
      },
    ],
  },

  // Email configuration for vendor communications
  email: {
    transport: {
      driver: 'sendmail',
      options: {
        path: '/usr/sbin/sendmail',
        args: ['-t', '-i'],
      },
    },
  },

  // Caching configuration
  cache: {
    enabled: false,
  },

  // Rate limiting
  rateLimiter: {
    enabled: true,
  },

  // File handling - allow larger files for vendor portfolios
  files: {
    maxSize: '100mb',
  },

  // CORS configuration
  cors: {
    enabled: true,
    origin: true,
  },

  // Extensions
  extensions: {
    autoReload: true,
  },

  // Custom collections configuration for wedding vendor management
  collections: {
    // Vendor categories
    vendor_categories: {
      singleton: false,
      sort: 'order',
      archive_app_filter: true,
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'published',
    },
    
    // Vendors
    vendors: {
      singleton: false,
      sort: 'name',
      archive_app_filter: true,
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'published',
    },
    
    // Wedding packages
    vendor_packages: {
      singleton: false,
      sort: 'order',
      archive_app_filter: true,
    },
    
    // Reviews
    vendor_reviews: {
      singleton: false,
      sort: 'date_created',
    },
    
    // Bookings
    vendor_bookings: {
      singleton: false,
      sort: 'event_date',
    },
    
    // Wedding events
    wedding_events: {
      singleton: false,
      sort: 'date',
    }
  },

  // Custom fields configuration
  fields: {
    // Common fields for vendors
    vendor_fields: {
      // Rating system
      rating: {
        type: 'integer',
        special: ['rating'],
      },
      
      // Price range
      price_range: {
        type: 'string',
        special: ['dropdown'],
        options: {
          choices: [
            { value: 'budget', text: 'Budget' },
            { value: 'mid-range', text: 'Mid-Range' },
            { value: 'luxury', text: 'Luxury' },
            { value: 'premium', text: 'Premium' }
          ]
        }
      },
      
      // Service areas
      service_areas: {
        type: 'json',
        special: ['tags'],
      }
    }
  }
});