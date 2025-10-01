# TheGoanWedding Directus CMS

This is the Directus CMS setup for TheGoanWedding.com, a premium wedding vendor directory website.

## Overview

Directus is an open-source headless CMS that provides a RESTful API and intuitive admin dashboard for managing content. This setup is specifically configured for wedding vendor management.

## Features

- Vendor directory management
- Wedding package listings
- Review and rating system
- Booking management
- Wedding event tracking
- Media management for vendor portfolios

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example environment file and update with your values:
   ```bash
   cp .env.example .env
   ```
   
   Update the following values in `.env`:
   - Generate random 32-character strings for `KEY` and `SECRET`
   - Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` for your admin user

3. Bootstrap the database:
   ```bash
   npm run bootstrap
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Configuration

The CMS is configured with collections specifically for wedding vendor management:

- **Vendor Categories**: Types of wedding vendors (photographers, caterers, venues, etc.)
- **Vendors**: Individual vendor listings with detailed information
- **Vendor Packages**: Service packages offered by vendors
- **Vendor Reviews**: Customer reviews and ratings
- **Vendor Bookings**: Booking management for vendor services
- **Wedding Events**: Event scheduling and management

## Access

- Admin Dashboard: http://localhost:8055/admin
- API Endpoint: http://localhost:8055/items

Default Admin Credentials:
- Email: admin@thegoanwedding.com
- Password: SecurePassword123!

## Customization

You can customize the CMS by modifying:
- `directus.config.js` - Core configuration
- Collections and fields through the admin interface
- Extensions and custom endpoints

## Deployment

### Local Development
For local development, ensure you:
1. Use a development database (SQLite)
2. Set appropriate security keys
3. Configure proper email settings

### Production Deployment
For production deployment, you have several options:

#### Railway Deployment (Recommended)
See `README-railway.md` for detailed Railway deployment instructions.

#### Docker Deployment
Use the provided Dockerfile and docker-compose.yml:

```bash
docker-compose up -d
```

#### Traditional Deployment
1. Ensure Node.js v18+ is installed
2. Set up a production database (PostgreSQL, MySQL, etc.)
3. Configure environment variables for production
4. Use a process manager (PM2, systemd, etc.)

## API Usage

The Directus API can be accessed at `/items/{collection}`:
- GET `/items/vendors` - List all vendors
- GET `/items/vendors/{id}` - Get a specific vendor
- POST `/items/vendors` - Create a new vendor (requires authentication)
- PATCH `/items/vendors/{id}` - Update a vendor (requires authentication)
- DELETE `/items/vendors/{id}` - Delete a vendor (requires authentication)

## Support

For issues with this setup, refer to:
- [Directus Documentation](https://docs.directus.io)
- Project documentation in the main repository