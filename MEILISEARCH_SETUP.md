# MeiliSearch Setup Guide

This guide explains how to set up and use MeiliSearch for vendor search functionality in your wedding website.

## Prerequisites

1. Node.js installed
2. Docker (recommended for running MeiliSearch locally)

## Installing MeiliSearch

### Option 1: Using Docker (Recommended for Development)

```bash
docker run -it --rm \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='masterKey' \
  -e MEILI_ENV='development' \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v1.8
```

### Option 2: Direct Installation

Follow the official installation guide at https://www.meilisearch.com/docs/learn/getting_started/installation

## Environment Variables

Set these environment variables in your `.env` file:

```bash
MEILI_HOST=http://localhost:7700
MEILI_KEY=masterKey
```

## Indexing Vendors

To index your vendors in MeiliSearch:

```bash
npm run index:vendors
```

This script will:
1. Create or update the vendors index
2. Configure searchable attributes
3. Fetch vendors from your database
4. Add them to the MeiliSearch index

## API Endpoints

The following API endpoint is available for searching vendors:

```
GET /api/search/vendors?q={query}
```

Example:
```
GET /api/search/vendors?q=photographer
```

## SearchBar Component

The SearchBar component now includes:
1. Real-time search suggestions
2. Debounced API calls to prevent excessive requests
3. Clickable suggestions that navigate to vendor profiles
4. Responsive design

## Customization

### Searchable Attributes

The following attributes are searchable by default:
- name
- category
- description
- location
- address
- services

### Filterable Attributes

You can filter search results by:
- category
- location

### Displayed Attributes

The following attributes are returned in search results:
- id
- name
- category
- location
- address

## Troubleshooting

### Common Issues

1. **Connection Refused**: Make sure MeiliSearch is running on the specified host and port
2. **Authentication Error**: Verify the MEILI_KEY matches your MeiliSearch master key
3. **No Results**: Ensure vendors have been indexed using `npm run index:vendors`

### Checking Index Status

You can check the status of your index by visiting:
```
http://localhost:7700/indexes/vendors
```

## Production Deployment

For production deployment:

1. Use a managed MeiliSearch service or deploy MeiliSearch on your server
2. Update the MEILI_HOST and MEILI_KEY environment variables
3. Run the indexing script to populate your index
4. Set up automatic reindexing when vendors are added/updated

## Need Help?

- [MeiliSearch Documentation](https://www.meilisearch.com/docs)
- [MeiliSearch GitHub Repository](https://github.com/meilisearch/meilisearch)