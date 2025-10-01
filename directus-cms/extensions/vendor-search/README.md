# Vendor Search Endpoint

A custom API endpoint for Directus that provides advanced search capabilities for wedding vendors.

## Features

- Full-text search across vendor names, descriptions, and services
- Filtering by category, location, price range, and rating
- Vendor retrieval by slug
- Featured vendors listing
- Category-based vendor listing
- Pagination support
- Only returns published vendors

## Installation

1. Place this folder in your Directus extensions directory
2. Run `npm install` in this directory
3. Build the extension with `npm run build`
4. Restart your Directus instance

## API Endpoints

### Search Vendors
```
GET /vendor-search
```

**Query Parameters:**
- `query` - Search term for names, descriptions, and services
- `category` - Filter by category ID
- `location` - Filter by location
- `priceRange` - Filter by price range (budget, mid-range, luxury, premium)
- `rating` - Minimum rating filter
- `limit` - Number of results to return (default: 20)
- `offset` - Offset for pagination (default: 0)
- `sort` - Sort field (default: sort)

**Example:**
```
GET /vendor-search?query=photography&location=Goa&rating=4&limit=10
```

### Get Vendor by Slug
```
GET /vendor-search/slug/:slug
```

**Example:**
```
GET /vendor-search/slug/coastal-photography
```

### Get Featured Vendors
```
GET /vendor-search/featured
```

**Query Parameters:**
- `limit` - Number of results to return (default: 6)

**Example:**
```
GET /vendor-search/featured?limit=8
```

### Get Vendors by Category
```
GET /vendor-search/category/:categorySlug
```

**Query Parameters:**
- `limit` - Number of results to return (default: 20)
- `offset` - Offset for pagination (default: 0)

**Example:**
```
GET /vendor-search/category/photographers?limit=15
```

## Response Format

All endpoints return data in the following format:

```json
{
  "data": [...],
  "meta": {
    // Metadata specific to the endpoint
  }
}
```

## Usage with Frontend

This endpoint is designed to work with the wedding vendor schema defined in `schema/wedding-vendors.yaml`. It provides the search functionality that can be used by your frontend application to:

1. Implement a vendor search page
2. Create category pages
3. Display featured vendors
4. Show vendor details pages

## Customization

You can customize this endpoint by modifying the `endpoint.js` file:

1. Add new search filters
2. Modify the fields that are returned
3. Change the sorting options
4. Add new endpoints for specific use cases

## Error Handling

The endpoint includes proper error handling and will return appropriate HTTP status codes:

- 200 - Success
- 400 - Bad Request (invalid parameters)
- 403 - Forbidden (vendor not found or not published)
- 500 - Internal Server Error

## Support

For issues with this extension, please refer to the main Directus documentation or contact the development team.