#!/usr/bin/env node

// Comprehensive Netlify setup script
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('Netlify Setup Script');
console.log('====================');

// Check if Netlify CLI is installed
try {
  const version = execSync('netlify --version', { encoding: 'utf8' });
  console.log('✓ Netlify CLI is installed:', version.trim());
} catch (error) {
  console.log('✗ Netlify CLI is not installed. Installing...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✓ Netlify CLI installed successfully');
  } catch (installError) {
    console.error('✗ Failed to install Netlify CLI:', installError.message);
    process.exit(1);
  }
}

// Check if logged in
try {
  const status = execSync('netlify status', { encoding: 'utf8' });
  console.log('✓ Already logged into Netlify');
} catch (error) {
  console.log('ℹ Not logged into Netlify. Please run: netlify login');
  process.exit(1);
}

// Create .netlify directory
const netlifyDir = join(process.cwd(), '.netlify');
mkdirSync(netlifyDir, { recursive: true });

// Check if already linked
let siteId = null;
const stateFile = join(netlifyDir, 'state.json');

if (existsSync(stateFile)) {
  try {
    const state = JSON.parse(readFileSync(stateFile, 'utf8'));
    siteId = state.siteId;
    console.log('ℹ Project already linked to site:', siteId);
  } catch (error) {
    console.log('ℹ Could not read existing state file');
  }
}

// If not linked, create configuration
if (!siteId) {
  console.log('Creating Netlify configuration...');
  
  // Generate a unique site name
  const timestamp = Date.now().toString().slice(-6);
  const siteName = `thegoanwedding-${timestamp}`;
  
  const state = {
    "siteId": siteName
  };
  
  writeFileSync(stateFile, JSON.stringify(state, null, 2));
  console.log('✓ Created Netlify configuration with site ID:', siteName);
  
  console.log('\nNext steps:');
  console.log('1. Go to https://app.netlify.com/');
  console.log('2. Create a new site with the name:', siteName);
  console.log('3. Get the actual site ID from the site settings');
  console.log('4. Update .netlify/state.json with the real site ID');
  console.log('5. Run: netlify deploy --prod --dir dist/public');
}

console.log('\nDeployment instructions:');
console.log('To deploy your site, run:');
console.log('  netlify deploy --prod --dir dist/public');
console.log('');
console.log('To deploy without production flag (creates a preview):');
console.log('  netlify deploy --dir dist/public');
console.log('');
console.log('Note: You must have a valid site ID in .netlify/state.json');
console.log('and be logged into Netlify for deployment to work.');