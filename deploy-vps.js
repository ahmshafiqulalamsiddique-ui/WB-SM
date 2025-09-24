#!/usr/bin/env node

/**
 * VPS Deployment Script for taleskillz.com
 * 
 * This script helps prepare your Next.js application for VPS deployment
 * with your domain taleskillz.com
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 VPS Deployment Script for taleskillz.com');
console.log('==========================================\n');

// VPS Configuration
const VPS_CONFIG = {
  ip: '72.60.101.107',
  domain: 'taleskillz.com',
  server: 'srv1024097.hstgr.cloud',
  deployPath: '/var/www/taleskillz.com'
};

console.log('📋 VPS Configuration:');
console.log(`   IP Address: ${VPS_CONFIG.ip}`);
console.log(`   Domain: ${VPS_CONFIG.domain}`);
console.log(`   Server: ${VPS_CONFIG.server}`);
console.log(`   Deploy Path: ${VPS_CONFIG.deployPath}\n`);

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
  
  console.log('\n🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
  
  // Generate deployment commands
  console.log('\n📤 VPS Deployment Commands:');
  console.log('==========================');
  console.log('\n1. SSH into your VPS:');
  console.log(`   ssh root@${VPS_CONFIG.ip}`);
  
  console.log('\n2. Install Node.js (if not already installed):');
  console.log('   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -');
  console.log('   sudo apt-get install -y nodejs');
  
  console.log('\n3. Install PM2 globally:');
  console.log('   npm install -g pm2');
  
  console.log('\n4. Create deployment directory:');
  console.log(`   mkdir -p ${VPS_CONFIG.deployPath}`);
  
  console.log('\n5. Upload your project files to the VPS:');
  console.log('   You can use SCP, SFTP, or rsync to upload files');
  console.log(`   Example: scp -r . root@${VPS_CONFIG.ip}:${VPS_CONFIG.deployPath}/`);
  
  console.log('\n6. On the VPS, install dependencies:');
  console.log(`   cd ${VPS_CONFIG.deployPath}`);
  console.log('   npm install --production');
  
  console.log('\n7. Create environment file:');
  console.log(`   nano ${VPS_CONFIG.deployPath}/.env.local`);
  console.log('   Add your MongoDB Atlas connection string and other environment variables');
  
  console.log('\n8. Start the application with PM2:');
  console.log(`   cd ${VPS_CONFIG.deployPath}`);
  console.log('   pm2 start npm --name "taleskillz" -- start');
  
  console.log('\n9. Configure PM2 to start on boot:');
  console.log('   pm2 startup');
  console.log('   pm2 save');
  
  console.log('\n10. Configure Nginx (if needed):');
  console.log('    Create nginx config for your domain');
  console.log(`    Server name: ${VPS_CONFIG.domain}`);
  console.log(`    Proxy to: http://localhost:3000`);
  
  // Count files to upload
  const files = fs.readdirSync('.', { recursive: true });
  const excludeDirs = ['node_modules', '.next', '.git', 'out'];
  const filesToUpload = files.filter(file => {
    const filePath = typeof file === 'string' ? file : file.toString();
    return !excludeDirs.some(dir => filePath.includes(dir));
  });
  
  console.log(`\n📊 Files to upload: ${filesToUpload.length} (excluding node_modules, .next, .git, out)`);
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure all dependencies are installed: npm install');
  console.log('2. Check your .env.production file');
  console.log('3. Verify your MongoDB Atlas connection string');
  console.log('4. Check the HOSTINGER_DEPLOYMENT_GUIDE.md for detailed instructions');
  process.exit(1);
}

console.log('\n🎉 Ready for VPS deployment!');
console.log('📖 See HOSTINGER_DEPLOYMENT_GUIDE.md for complete instructions.');
console.log(`🌐 Your site will be available at: https://${VPS_CONFIG.domain}`);
