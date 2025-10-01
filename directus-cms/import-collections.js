// Script to import collections into Directus using the SDK
const { Directus } = require('@directus/sdk');

// Configuration - update these values for your Directus instance
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@thegoanwedding.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SecurePassword123!';

async function importCollections() {
  console.log('Importing collections into Directus...');
  
  try {
    // Initialize Directus client
    const directus = new Directus(DIRECTUS_URL);
    
    // Authenticate as admin
    await directus.auth.login({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    console.log('_authenticated successfully');
    
    // Read the schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'directus-schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    
    console.log(`Found ${schema.collections.length} collections to import`);
    
    // Import collections
    for (const collection of schema.collections) {
      try {
        console.log(`Importing collection: ${collection.collection}`);
        
        // Check if collection already exists
        try {
          await directus.collections.readOne(collection.collection);
          console.log(`Collection ${collection.collection} already exists, updating...`);
          await directus.collections.updateOne(collection.collection, collection.meta);
        } catch (error) {
          // Collection doesn't exist, create it
          console.log(`Creating collection: ${collection.collection}`);
          await directus.collections.create({
            collection: collection.collection,
            meta: collection.meta,
            schema: collection.schema
          });
        }
      } catch (error) {
        console.error(`Error importing collection ${collection.collection}:`, error.message);
      }
    }
    
    // Import fields
    console.log(`Importing ${schema.fields.length} fields...`);
    for (const field of schema.fields) {
      try {
        console.log(`Importing field: ${field.collection}.${field.field}`);
        
        // Check if field already exists
        try {
          await directus.fields.readOne(field.collection, field.field);
          console.log(`Field ${field.collection}.${field.field} already exists, updating...`);
          await directus.fields.updateOne(field.collection, field.field, field);
        } catch (error) {
          // Field doesn't exist, create it
          console.log(`Creating field: ${field.collection}.${field.field}`);
          await directus.fields.create(field.collection, field);
        }
      } catch (error) {
        console.error(`Error importing field ${field.collection}.${field.field}:`, error.message);
      }
    }
    
    console.log('Collection import completed successfully!');
    
  } catch (error) {
    console.error('Error importing collections:', error.message);
    process.exit(1);
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  importCollections();
}

module.exports = { importCollections };