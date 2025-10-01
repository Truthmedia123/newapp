# Directus CMS Setup Summary

This document summarizes the Directus CMS setup created for TheGoanWedding.com wedding vendor directory website.

## Project Structure

```
directus-cms/
├── package.json              # Project dependencies and scripts
├── directus.config.js        # Directus configuration
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
- `DB_CLIENT` - Database client (sqlite3)
- `DB_FILENAME` - Database filename (./data.db)
- `ADMIN_EMAIL` - Admin user email (admin@thegoanwedding.com)
- `ADMIN_PASSWORD` - Admin user password (SecurePassword123!)
- `PUBLIC_URL` - Public URL (http://localhost:8055)

### Directus Configuration
The `directus.config.js` file includes:
- Database configuration for SQLite
- Server configuration (port 8055)
- Storage configuration for local uploads
- Email configuration (sendmail)
- Custom collections for wedding vendor management:
  - Vendor Categories
  - Vendors
  - Vendor Packages
  - Vendor Reviews
  - Vendor Bookings
  - Wedding Events

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

- **Admin Dashboard**: http://localhost:8055/admin
- **API Endpoint**: http://localhost:8055/items
- **GraphQL Endpoint**: http://localhost:8055/graphql
- **Custom Vendor Search**: http://localhost:8055/vendor-search
- **Vendor Dashboard**: http://localhost:8055/admin/wedding-vendor-dashboard

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
   - Portfolio images
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

### Traditional Deployment
1. Ensure Node.js v18+ is installed
2. Set up a production database (PostgreSQL/MySQL recommended)
3. Configure environment variables for production
4. Run the application with a process manager (PM2, systemd, etc.)

## Security Considerations

1. **Change default credentials** immediately after first login
2. **Use strong passwords** for all user accounts
3. **Configure HTTPS** for production deployments
4. **Regular backups** of database and uploads
5. **Update Directus** regularly to latest version
6. **Restrict API access** using authentication and rate limiting

## Customization

You can customize the CMS by:
1. Modifying collections and fields through the admin interface
2. Adding custom extensions
3. Updating the directus.config.js file
4. Creating custom endpoints
5. Adding validation rules and hooks

## Troubleshooting

Common issues and solutions:

1. **Port already in use**: Change the PORT in .env
2. **Permission errors**: Ensure proper file permissions for database and uploads
3. **Database connection issues**: Verify DB_CLIENT and DB_FILENAME settings
4. **Email not working**: Configure proper email settings for your environment
5. **Extensions not loading**: Ensure extensions are built and server is restarted

## Support Resources

- [Directus Documentation](https://docs.directus.io)
- [Directus GitHub Repository](https://github.com/directus/directus)
- Project documentation in the main repository