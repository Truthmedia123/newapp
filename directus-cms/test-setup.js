// Test script for Directus CMS setup
console.log('🔍 Testing Directus CMS Setup...');

console.log('\n📋 Checking directory structure...');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'directus.config.js',
  '.env',
  '.gitignore',
  'README.md',
  'setup.js',
  'Dockerfile',
  'docker-compose.yml'
];

const requiredDirectories = [
  'schema',
  'database',
  'uploads',
  'extensions'
];

const extensionDirectories = [
  'extensions/wedding-vendor-dashboard',
  'extensions/vendor-search'
];

let allGood = true;

// Check required files
console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check required directories
console.log('\n📂 Checking required directories:');
requiredDirectories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ❌ ${dir} - MISSING`);
    allGood = false;
  }
});

// Check extension directories
console.log('\n🔌 Checking extension directories:');
extensionDirectories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ❌ ${dir} - MISSING`);
    allGood = false;
  }
});

// Check extension files
console.log('\n📄 Checking extension files:');
const extensionFiles = [
  'extensions/wedding-vendor-dashboard/module.vue',
  'extensions/wedding-vendor-dashboard/package.json',
  'extensions/wedding-vendor-dashboard/README.md',
  'extensions/vendor-search/endpoint.js',
  'extensions/vendor-search/package.json',
  'extensions/vendor-search/README.md'
];

extensionFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check schema file
console.log('\n📋 Checking schema file:');
const schemaFile = 'schema/wedding-vendors.yaml';
const schemaPath = path.join(__dirname, schemaFile);
if (fs.existsSync(schemaPath)) {
  console.log(`  ✅ ${schemaFile}`);
} else {
  console.log(`  ❌ ${schemaFile} - MISSING`);
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 All required files and directories are present!');
  console.log('\n📝 Next steps:');
  console.log('1. Run npm install to install dependencies');
  console.log('2. Run npm run setup to initialize the CMS');
  console.log('3. Start the server with npm start');
  console.log('4. Access the admin dashboard at http://localhost:8055/admin');
} else {
  console.log('❌ Some required files or directories are missing.');
  console.log('   Please check the output above and ensure all components are present.');
}
console.log('='.repeat(50));