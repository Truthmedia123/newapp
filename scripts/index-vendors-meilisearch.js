#!/usr/bin/env node

// Script to index vendors in MeiliSearch
import { MeiliSearch } from 'meilisearch';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../shared/schema.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

async function indexVendors() {
  try {
    // Initialize MeiliSearch client
    const client = new MeiliSearch({
      host: process.env.MEILI_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILI_KEY || 'masterKey',
    });

    // Create or get the vendors index
    let index;
    try {
      index = await client.getIndex('vendors');
    } catch (error) {
      // Index doesn't exist, create it
      await client.createIndex('vendors', { primaryKey: 'id' });
      index = await client.getIndex('vendors');
    }

    // Set searchable attributes
    await index.updateSearchableAttributes([
      'name',
      'category',
      'description',
      'location',
      'address',
      'services'
    ]);

    // Set displayed attributes
    await index.updateDisplayedAttributes([
      'id',
      'name',
      'category',
      'location',
      'address'
    ]);

    // Set filterable attributes
    await index.updateFilterableAttributes([
      'category',
      'location'
    ]);

    console.log('MeiliSearch index configuration updated successfully');

    // Initialize database connection for development
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const dbPath = join(__dirname, '../.db/dev.db');
    const sqlite = new Database(dbPath);
    const db = drizzle(sqlite, { schema });

    // Fetch all vendors from the database
    console.log('Fetching vendors from database...');
    const vendors = await db.select().from(schema.vendors).all();
    
    console.log(`Found ${vendors.length} vendors to index`);

    // Transform vendors for indexing (ensure proper data format)
    const vendorsForIndexing = vendors.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      category: vendor.category,
      description: vendor.description,
      location: vendor.location,
      address: vendor.address || '',
      services: typeof vendor.services === 'string' ? vendor.services : JSON.stringify(vendor.services || [])
    }));

    // Add vendors to the index
    if (vendorsForIndexing.length > 0) {
      console.log('Adding vendors to MeiliSearch index...');
      const response = await index.addDocuments(vendorsForIndexing);
      console.log(`Indexing task enqueued with UID: ${response.taskUid}`);
      
      // Wait for indexing to complete
      await client.waitForTask(response.taskUid);
      console.log('Vendors indexed successfully!');
    } else {
      console.log('No vendors to index');
    }

    // Get index stats
    const stats = await index.getStats();
    console.log('Index stats:', stats);

  } catch (error) {
    console.error('Error setting up MeiliSearch index:', error);
    process.exit(1);
  }
}

// Run the indexing function
indexVendors();