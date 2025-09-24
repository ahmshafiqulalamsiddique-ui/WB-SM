#!/usr/bin/env node

/**
 * Hostinger Deployment Script
 * 
 * This script helps prepare your Next.js application for Hostinger deployment
 * by building the static export and providing upload instructions.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Hostinger Deployment Script');
console.log('============================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from your project root.');
  process.exit(1);
}

// Check if .env.production exists
if (!fs.existsSync('.env.production')) {
  console.log('⚠️  Warning: .env.production not found.');
  console.log('   Please create .env.production with your MongoDB Atlas connection string.');
  console.log('   See HOSTINGER_DEPLOYMENT_GUIDE.md for details.\n');
}

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n🔨 Building static export...');
  execSync('npm run build:static', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
  
  // Check if out directory exists
  if (fs.existsSync('out')) {
    console.log('\n📁 Static files are ready in the "out" directory.');
    console.log('\n📤 Next steps for Hostinger upload:');
    console.log('1. Login to your Hostinger control panel');
    console.log('2. Go to File Manager');
    console.log('3. Navigate to public_html folder');
    console.log('4. Upload all files from the "out" directory');
    console.log('5. Upload the .htaccess file to public_html');
    console.log('6. Test your website!');
    
    // Count files in out directory
    const files = fs.readdirSync('out', { recursive: true });
    console.log(`\n📊 Total files to upload: ${files.length}`);
    
  } else {
    console.log('\n❌ Error: "out" directory not found after build.');
    console.log('   Please check your Next.js configuration.');
  }
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure all dependencies are installed: npm install');
  console.log('2. Check your .env.production file');
  console.log('3. Verify your MongoDB Atlas connection string');
  console.log('4. Check the HOSTINGER_DEPLOYMENT_GUIDE.md for detailed instructions');
  process.exit(1);
}

console.log('\n🎉 Ready for Hostinger deployment!');
console.log('📖 See HOSTINGER_DEPLOYMENT_GUIDE.md for complete instructions.');
