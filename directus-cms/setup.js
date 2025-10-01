// Setup script for Directus CMS
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up TheGoanWedding Directus CMS...');

try {
  // Check if .env file exists
  if (!fs.existsSync('.env')) {
    console.log('\n⚠️  .env file not found. Creating from .env.example...');
    if (fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env');
      console.log('✅ .env file created. Please update it with your configuration.');
    } else {
      console.log('⚠️  .env.example not found. Please create .env file manually.');
    }
  } else {
    console.log('\n✅ .env file already exists.');
  }

  console.log('\n📋 Step 1: Installing dependencies...');
  console.log('Running: npm install');
  execSync('npm install', { stdio: 'inherit' });
  console.log('\n✅ Dependencies installed successfully!');

  console.log('\n📋 Step 2: Initializing database...');
  console.log('Running: npm run bootstrap');
  execSync('npm run bootstrap', { stdio: 'inherit' });
  console.log('\n✅ Database initialized successfully!');

  console.log('\n🎉 Setup process completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Run npm start to start the server');
  console.log('2. Access http://localhost:8055/admin');
  console.log('3. Log in with default credentials:');
  console.log('   Email: admin@thegoanwedding.com');
  console.log('   Password: SecurePassword123!');
  console.log('4. Configure collections and fields as needed');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Ensure Node.js is installed');
  console.log('2. Check your internet connection');
  console.log('3. Verify npm is working correctly');
  console.log('4. Check the error message above for details');
}