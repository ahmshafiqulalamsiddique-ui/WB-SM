#!/usr/bin/env node

/**
 * Quick Database Setup Script
 * This script helps you set up the database connection
 */

const fs = require('fs');
const path = require('path');

console.log('🗄️  Quick Database Setup for taleskillz.com');
console.log('=============================================');
console.log('');

// Check if .env.local exists
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local file exists');
  
  // Read the file to check MongoDB URI
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (envContent.includes('MONGODB_URI=') && !envContent.includes('mongodb://localhost')) {
    console.log('✅ MongoDB URI is configured');
    console.log('');
    console.log('🚀 Ready to initialize database!');
    console.log('Run: node init-database.js');
  } else {
    console.log('⚠️  MongoDB URI needs to be configured');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Set up MongoDB Atlas account');
    console.log('2. Get your connection string');
    console.log('3. Update .env.local with MONGODB_URI');
    console.log('4. Run: node init-database.js');
  }
} else {
  console.log('❌ .env.local file not found');
  console.log('');
  console.log('📝 Creating .env.local template...');
  
  const envTemplate = `# MongoDB Configuration
MONGODB_URI=mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
MONGODB_DB=datacollect

# Session Configuration
NEXTAUTH_SECRET=taleskillz-super-secret-key-32-chars-long-change-this
NEXTAUTH_URL=http://localhost:3000

# Public URL
NEXT_PUBLIC_APP_URL=http://localhost:3000`;

  fs.writeFileSync('.env.local', envTemplate);
  console.log('✅ Created .env.local template');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Edit .env.local with your MongoDB Atlas connection string');
  console.log('2. Run: node init-database.js');
}

console.log('');
console.log('📖 For detailed instructions, see: setup-database.md');
console.log('🌐 Your app is running at: http://localhost:3000');
console.log('');
console.log('🎯 After database setup, login with:');
console.log('   Admin: admin@datacollect.app / admin123');
