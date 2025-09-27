#!/usr/bin/env node

// Script to link Netlify site
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('Creating Netlify configuration...');

// Create .netlify directory if it doesn't exist
const netlifyDir = join(process.cwd(), '.netlify');
mkdirSync(netlifyDir, { recursive: true });

// Create state.json with a placeholder site ID
const state = {
  "siteId": "thegoanwedding-site-001"
};

writeFileSync(join(netlifyDir, 'state.json'), JSON.stringify(state, null, 2));

console.log('Netlify configuration created.');

console.log('\nTo manually link your site:');
console.log('1. Go to https://app.netlify.com/');
console.log('2. Create a new site or select an existing one');
console.log('3. Get the site ID from the site settings');
console.log('4. Update the siteId in .netlify/state.json with your actual site ID');
console.log('5. Run: netlify deploy --prod --dir dist/public');