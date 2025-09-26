#!/usr/bin/env node

// Simple deployment script for Netlify
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

console.log('Building the project...');
try {
  execSync('npm run build:production', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

console.log('\nTo deploy to Netlify:');
console.log('1. Go to https://app.netlify.com/');
console.log('2. Click "Add new site" -> "Import an existing project"');
console.log('3. Select your GitHub repository');
console.log('4. Set the build command to: npm run build:production');
console.log('5. Set the publish directory to: dist/public');
console.log('6. Click "Deploy site"');

console.log('\nAlternatively, you can use the Netlify CLI:');
console.log('1. Run: netlify login');
console.log('2. Run: netlify sites:create');
console.log('3. Run: netlify deploy --prod');

console.log('\nAfter deployment, you can enable Identity and Git Gateway in the Netlify dashboard.');