#!/usr/bin/env node

// Script to create a Netlify site using the API
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

console.log('Creating Netlify site...');

// Create a temporary JSON file with the site data
const siteData = {
  site: {
    name: "thegoanwedding-site"
  }
};

const tempFile = join(process.cwd(), 'temp-site-data.json');
writeFileSync(tempFile, JSON.stringify(siteData, null, 2));

try {
  // Use the Netlify CLI API command with the file
  const result = execSync(`netlify api createSite --data-file ${tempFile}`, {
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('Site creation result:', result);
  
  // Clean up temp file
  execSync(`del "${tempFile}"`, { stdio: 'ignore' });
} catch (error) {
  console.error('Failed to create site:', error.message);
  
  // Clean up temp file
  try {
    execSync(`del "${tempFile}"`, { stdio: 'ignore' });
  } catch (cleanupError) {
    // Ignore cleanup errors
  }
  
  console.log('\nAlternative approach:');
  console.log('1. Go to https://app.netlify.com/');
  console.log('2. Click "Add new site" -> "Import an existing project"');
  console.log('3. Select your GitHub repository');
  console.log('4. Configure build settings:');
  console.log('   - Build command: npm run build:production');
  console.log('   - Publish directory: dist/public');
  console.log('5. Click "Deploy site"');
}