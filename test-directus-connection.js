import { createDirectus, rest, readItems } from '@directus/sdk';

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

// Initialize Directus client
const directus = createDirectus(DIRECTUS_URL)
  .with(rest());

async function testDirectusConnection() {
  try {
    console.log('Testing Directus connection...');
    console.log(`Directus URL: ${DIRECTUS_URL}`);
    
    // Test fetching vendors (public endpoint)
    console.log('Fetching vendors...');
    // For public access, we might need to adjust the query or check if collections are public
    const vendors = await directus.request(readItems('vendors'));
    console.log(`Successfully fetched ${vendors.length} vendors`);
    
    // Test fetching categories
    console.log('Fetching categories...');
    const categories = await directus.request(readItems('categories'));
    console.log(`Successfully fetched ${categories.length} categories`);
    
    // Test fetching blog posts
    console.log('Fetching blog posts...');
    const blogPosts = await directus.request(readItems('blog_posts'));
    console.log(`Successfully fetched ${blogPosts.length} blog posts`);
    
    console.log('✅ All Directus connections successful!');
    return true;
  } catch (error) {
    console.error('❌ Directus connection failed:', error.message);
    // Let's also try a simple fetch to see what we get
    try {
      console.log('Trying simple fetch...');
      const response = await fetch(`${DIRECTUS_URL}/items/vendors`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Simple fetch successful, items count:', data.data?.length || 0);
        return true;
      } else {
        console.error('Simple fetch failed with status:', response.status);
        const text = await response.text();
        console.error('Response text:', text);
      }
    } catch (fetchError) {
      console.error('Simple fetch error:', fetchError.message);
    }
    return false;
  }
}

// Run the test
testDirectusConnection().then(success => {
  if (success) {
    console.log('Directus integration is working correctly.');
  } else {
    console.log('Please check your Directus configuration.');
  }
});