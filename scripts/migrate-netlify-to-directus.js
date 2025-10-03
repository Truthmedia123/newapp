#!/usr/bin/env node

/**
 * Migration Script: Netlify CMS to Directus
 * 
 * This script helps migrate content from Netlify CMS to Directus.
 * It assumes you have exported your Netlify CMS content and need to import it into Directus.
 * 
 * Usage:
 * 1. Export your Netlify CMS content (typically markdown files in content/ directory)
 * 2. Run this script to transform and import the content into Directus
 */

import fs from 'fs';
import path from 'path';
import { createDirectus, rest, authentication, createItem, readItems } from '@directus/sdk';

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

// Initialize Directus client
const directus = createDirectus(DIRECTUS_URL)
  .with(authentication())
  .with(rest());

async function authenticate() {
  try {
    if (DIRECTUS_TOKEN) {
      await directus.setToken(DIRECTUS_TOKEN);
      console.log('✅ Authenticated with Directus using token');
    } else {
      // Fallback to default admin credentials for local development
      await directus.login('admin@example.com', 'd1r3ctu5');
      console.log('✅ Authenticated with Directus using default credentials');
    }
    return true;
  } catch (error) {
    console.error('❌ Failed to authenticate with Directus:', error.message);
    return false;
  }
}

// Function to read and parse markdown files from Netlify CMS
function readNetlifyContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Simple frontmatter parser (you might need a more robust solution)
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      const frontmatter = match[1];
      const body = match[2];
      
      // Parse frontmatter (simple key-value pairs)
      const metadata = {};
      const lines = frontmatter.split('\n');
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          // Remove quotes if present
          metadata[key.trim()] = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        }
      }
      
      return {
        ...metadata,
        content: body
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Function to transform Netlify CMS vendor data to Directus format
function transformVendorData(netlifyData) {
  return {
    name: netlifyData.name,
    category: netlifyData.category,
    description: netlifyData.description,
    phone: netlifyData.phone,
    email: netlifyData.email,
    whatsapp: netlifyData.whatsapp,
    location: netlifyData.location,
    address: netlifyData.address,
    website: netlifyData.website,
    instagram: netlifyData.instagram,
    youtube: netlifyData.youtube,
    facebook: netlifyData.facebook,
    profile_image: netlifyData.profileImage,
    cover_image: netlifyData.coverImage,
    gallery: netlifyData.gallery ? JSON.stringify(netlifyData.gallery) : null,
    services: netlifyData.services ? JSON.stringify(netlifyData.services) : null,
    price_range: netlifyData.priceRange,
    featured: netlifyData.featured === 'true' || netlifyData.featured === true ? 1 : 0,
    verified: netlifyData.verified === 'true' || netlifyData.verified === true ? 1 : 0,
    status: 'published'
  };
}

// Function to transform Netlify CMS blog post data to Directus format
function transformBlogPostData(netlifyData) {
  return {
    title: netlifyData.title,
    slug: netlifyData.slug || netlifyData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    excerpt: netlifyData.excerpt,
    content: netlifyData.content,
    featured_image: netlifyData.featuredImage,
    category: netlifyData.category,
    tags: netlifyData.tags ? JSON.stringify(netlifyData.tags) : null,
    published: netlifyData.published === 'true' || netlifyData.published === true ? 1 : 0,
    published_date: new Date().toISOString(),
    status: 'published'
  };
}

// Function to import vendors
async function importVendors() {
  const vendorsDir = path.join(process.cwd(), 'content', 'vendors');
  
  if (!fs.existsSync(vendorsDir)) {
    console.log('No vendors directory found, skipping vendor import');
    return;
  }
  
  const vendorFiles = fs.readdirSync(vendorsDir).filter(file => file.endsWith('.md'));
  console.log(`Found ${vendorFiles.length} vendor files to import`);
  
  for (const file of vendorFiles) {
    try {
      const filePath = path.join(vendorsDir, file);
      const netlifyData = readNetlifyContent(filePath);
      
      if (netlifyData) {
        const directusData = transformVendorData(netlifyData);
        await directus.request(createItem('vendors', directusData));
        console.log(`✅ Imported vendor: ${directusData.name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to import vendor from ${file}:`, error.message);
    }
  }
}

// Function to import blog posts
async function importBlogPosts() {
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  
  if (!fs.existsSync(blogDir)) {
    console.log('No blog directory found, skipping blog post import');
    return;
  }
  
  const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  console.log(`Found ${blogFiles.length} blog files to import`);
  
  for (const file of blogFiles) {
    try {
      const filePath = path.join(blogDir, file);
      const netlifyData = readNetlifyContent(filePath);
      
      if (netlifyData) {
        const directusData = transformBlogPostData(netlifyData);
        await directus.request(createItem('blog_posts', directusData));
        console.log(`✅ Imported blog post: ${directusData.title}`);
      }
    } catch (error) {
      console.error(`❌ Failed to import blog post from ${file}:`, error.message);
    }
  }
}

// Function to import pages
async function importPages() {
  const pagesDir = path.join(process.cwd(), 'content', 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.log('No pages directory found, skipping page import');
    return;
  }
  
  const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.md'));
  console.log(`Found ${pageFiles.length} page files to import`);
  
  // Note: Directus doesn't have a default "pages" collection, you might need to create one
  console.log('Note: You may need to create a "pages" collection in Directus first');
  
  for (const file of pageFiles) {
    try {
      const filePath = path.join(pagesDir, file);
      const netlifyData = readNetlifyContent(filePath);
      
      if (netlifyData) {
        // You'll need to define how pages should be structured in Directus
        const directusData = {
          title: netlifyData.title,
          slug: netlifyData.slug || file.replace('.md', ''),
          content: netlifyData.content,
          status: 'published'
        };
        
        // Uncomment the following line once you have a pages collection
        // await directus.request(createItem('pages', directusData));
        console.log(`📄 Would import page: ${directusData.title} (skipped - no pages collection)`);
      }
    } catch (error) {
      console.error(`❌ Failed to process page from ${file}:`, error.message);
    }
  }
}

// Main migration function
async function migrateContent() {
  console.log('🚀 Starting migration from Netlify CMS to Directus');
  
  // Authenticate with Directus
  const authenticated = await authenticate();
  if (!authenticated) {
    console.error('❌ Cannot proceed without Directus authentication');
    process.exit(1);
  }
  
  try {
    // Import different content types
    await importVendors();
    await importBlogPosts();
    await importPages();
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateContent();
}

export { migrateContent, readNetlifyContent, transformVendorData, transformBlogPostData };