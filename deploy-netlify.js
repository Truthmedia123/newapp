#!/usr/bin/env node

// Script to deploy to Netlify
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('Netlify Deployment Script');
console.log('========================');

// Check if the build directory exists
const buildDir = join(process.cwd(), 'dist', 'public');
if (!existsSync(buildDir)) {
  console.log('Build directory not found. Building the project...');
  try {
    execSync('npm run build:production', { stdio: 'inherit' });
    console.log('✓ Build completed successfully');
  } catch (error) {
    console.error('✗ Build failed:', error.message);
    process.exit(1);
  }
}

console.log('\nDeployment Instructions:');
console.log('========================');
console.log('Since we\'re having issues with the Netlify CLI, here are manual deployment options:');

console.log('\nOption 1: Deploy via Netlify Web Interface');
console.log('1. Go to https://app.netlify.com/');
console.log('2. Click "Add new site" -> "Import an existing project"');
console.log('3. Connect to your GitHub repository (Truthmedia123/newapp)');
console.log('4. Configure the deployment settings:');
console.log('   - Build command: npm run build:production');
console.log('   - Publish directory: dist/public');
console.log('5. Click "Deploy site"');

console.log('\nOption 2: Manual ZIP Deployment');
console.log('1. Create a ZIP file of the dist/public directory');
console.log('2. Go to your Netlify site dashboard');
console.log('3. Drag and drop the ZIP file to deploy');

console.log('\nOption 3: Use Netlify CLI (if issues are resolved)');
console.log('1. Make sure you have a valid site ID in .netlify/state.json');
console.log('2. Run: netlify deploy --prod --dir dist/public');

console.log('\nAfter deployment is complete:');
console.log('1. Go to your site\'s dashboard in Netlify');
console.log('2. Click on "Identity" in the left sidebar');
console.log('3. Click "Enable Identity"');
console.log('4. Scroll down to "Services" and click "Enable Git Gateway"');
console.log('5. Access your CMS at https://your-site-url.com/admin');