// Script to export Directus schema as a single JSON file
const fs = require('fs');
const path = require('path');

console.log('Exporting Directus schema...');

// Read all schema files
const schemaDir = path.join(__dirname, 'schema');
const schemaFiles = fs.readdirSync(schemaDir);

// Create the combined schema object
const directusSchema = {
  version: 1,
  directus: '9.0.0',
  collections: [],
  fields: []
};

// Process each schema file
schemaFiles.forEach(file => {
  if (file.endsWith('.json')) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(schemaDir, file);
    const collectionSchema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add collection to combined schema
    directusSchema.collections.push({
      collection: collectionSchema.collection,
      meta: collectionSchema.meta,
      schema: collectionSchema.schema
    });
    
    // Add fields to combined schema
    if (collectionSchema.fields) {
      collectionSchema.fields.forEach(field => {
        // Add collection reference to field
        const fieldWithCollection = {
          ...field,
          collection: collectionSchema.collection
        };
        
        // Handle nested fields (like social_media children)
        if (field.children) {
          field.children.forEach(child => {
            directusSchema.fields.push({
              ...child,
              collection: collectionSchema.collection,
              meta: {
                ...child.meta,
                group: field.field
              }
            });
          });
          // Remove children from the parent field
          delete fieldWithCollection.children;
        }
        
        directusSchema.fields.push(fieldWithCollection);
      });
    }
  }
});

// Write the combined schema to file
const outputPath = path.join(__dirname, 'directus-schema.json');
fs.writeFileSync(outputPath, JSON.stringify(directusSchema, null, 2));

console.log(`Schema exported to ${outputPath}`);
console.log('Collections exported:', directusSchema.collections.map(c => c.collection).join(', '));