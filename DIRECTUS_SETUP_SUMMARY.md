# Directus CMS Setup Summary

This document summarizes the Directus CMS setup created for TheGoanWedding.com wedding vendor directory website.

## Project Structure

```
directus-cms/
├── package.json              # Project dependencies and scripts
├── directus.config.js        # Directus configuration
├── config.production.js      # Production configuration
├── .env                      # Environment variables (generated)
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
├── setup.js                 # Setup script
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── schema/                  # Schema definitions
│   └── wedding-vendors.yaml # Wedding vendor schema
├── database/                # Database files (created on first run)
├── uploads/                 # Media uploads (created on first run)
├── extensions/              # Directus extensions
│   ├── README.md            # Extensions documentation
│   ├── wedding-vendor-dashboard/ # Custom dashboard module
│   │   ├── module.vue       # Dashboard interface
│   │   ├── package.json     # Extension manifest
│   │   └── README.md        # Extension documentation
│   └── vendor-search/       # Custom search endpoint
│       ├── endpoint.js      # API endpoint implementation
│       ├── package.json     # Extension manifest
│       └── README.md        # Extension documentation
└── extensions/              # Directus extensions (created on first run)
```

## Configuration

### Environment Variables
The following environment variables are configured in `.env`:
- `KEY` - 32-character security key (generated)
- `SECRET` - 32-character security secret (generated)
- `DB_CLIENT` - Database client (postgresql)
- `DB_HOST` - Database host
- `DB_PORT` - Database port (5432)
- `DB_DATABASE` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `ADMIN_EMAIL` - Admin user email (admin@thegoanwedding.com)
- `ADMIN_PASSWORD` - Admin user password (SecurePassword123!)
- `PUBLIC_URL` - Public URL (https://cms.thegoanwedding.com)

### Directus Configuration
The `directus.config.js` file includes:
- Database configuration for PostgreSQL
- Server configuration (port 8055)
- Storage configuration for local uploads only (no cloud storage)
- Email configuration (smtp)
- Custom collections for wedding vendor management:
  - Vendor Categories
  - Vendors
  - Vendor Packages
  - Vendor Reviews
  - Vendor Bookings
  - Wedding Events

### Production Configuration
The `config.production.js` file includes:
- Database configuration for PostgreSQL
- Cache configuration with Redis
- Storage configuration for local uploads only
- Security configuration
- CORS configuration
- Rate limiting
- Email configuration
- Websockets

## Setup Process

### Manual Setup
1. Install dependencies:
   ```bash
   cd directus-cms
   npm install
   ```

2. Initialize database:
   ```bash
   npm run bootstrap
   ```

3. Install and build extensions:
   ```bash
   cd extensions/wedding-vendor-dashboard
   npm install
   npm run build
   cd ../vendor-search
   npm install
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Automated Setup
Run the setup script:
```bash
cd directus-cms
npm run setup
```

## Access Points

- **Admin Dashboard**: https://cms.thegoanwedding.com/admin
- **API Endpoint**: https://cms.thegoanwedding.com/items
- **GraphQL Endpoint**: https://cms.thegoanwedding.com/graphql
- **Custom Vendor Search**: https://cms.thegoanwedding.com/vendor-search
- **Vendor Dashboard**: https://cms.thegoanwedding.com/admin/wedding-vendor-dashboard

## Default Admin Credentials

- **Email**: admin@thegoanwedding.com
- **Password**: SecurePassword123!

## Collections

The CMS includes the following collections optimized for wedding vendor management:

1. **Vendor Categories**
   - Name
   - Description
   - Icon
   - Color

2. **Vendors**
   - Name
   - Category
   - Description
   - Contact information
   - Location
   - Services
   - Pricing
   - Portfolio images (static URLs only)
   - Ratings

3. **Vendor Packages**
   - Vendor reference
   - Package name
   - Description
   - Price
   - Inclusions

4. **Vendor Reviews**
   - Vendor reference
   - Customer name
   - Rating
   - Review text
   - Date

5. **Vendor Bookings**
   - Vendor reference
   - Customer information
   - Event details
   - Package selection
   - Status

6. **Wedding Events**
   - Event name
   - Date
   - Time
   - Venue
   - Description

## Custom Extensions

### Wedding Vendor Dashboard Module
A custom admin dashboard that provides:
- Vendor statistics overview
- Recent activity feed
- Quick navigation to key collections
- Top-rated vendors display

### Vendor Search Endpoint
A custom API endpoint that provides:
- Full-text search across vendors
- Filtering by category, location, price range, and rating
- Vendor retrieval by slug
- Featured vendors listing
- Category-based vendor listing

## API Usage

The Directus API can be accessed at `/items/{collection}`:

- `GET /items/vendors` - List all vendors
- `GET /items/vendors/{id}` - Get a specific vendor
- `POST /items/vendors` - Create a new vendor (requires authentication)
- `PATCH /items/vendors/{id}` - Update a vendor (requires authentication)
- `DELETE /items/vendors/{id}` - Delete a vendor (requires authentication)

### Custom Endpoints

- `GET /vendor-search` - Search vendors with advanced filters
- `GET /vendor-search/slug/:slug` - Get vendor by slug
- `GET /vendor-search/featured` - Get featured vendors
- `GET /vendor-search/category/:categorySlug` - Get vendors by category

## Deployment Options

### Docker Deployment
Use the provided Dockerfile and docker-compose.yml:

```bash
docker-compose up -d
```

### Production Deployment
For production deployment:
1. Configure PostgreSQL database
2. Configure Redis for caching
3. Set up reverse proxy (Nginx) with SSL
4. Configure environment variables in `config.production.js`
5. Deploy using Docker or directly on server

## Security Considerations

1. **Admin Access**: Only administrators should have access to the CMS
2. **API Keys**: Keep API keys secure and rotate regularly
3. **Rate Limiting**: Enabled to prevent abuse
4. **CORS**: Configured to only allow requests from the main website
5. **HTTPS**: Always use HTTPS in production
6. **Regular Updates**: Keep Directus updated to the latest version

## Analytics Integration

The platform uses Umami Analytics for privacy-focused tracking:
- Vendor page views
- Contact vendor clicks
- Gallery image opens
- RSVP clicks
- Invitation sends

All analytics are self-hosted and no third-party tracking scripts are used.