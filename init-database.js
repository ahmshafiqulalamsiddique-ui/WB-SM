#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script creates the admin user and initializes the database
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'datacollect';

async function initializeDatabase() {
  let client;
  
  try {
    console.log('🚀 Initializing database...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    
    // Create collections
    const usersCollection = db.collection('users');
    const submissionsCollection = db.collection('submissions');
    
    // Create indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await submissionsCollection.createIndex({ userId: 1 });
    await submissionsCollection.createIndex({ status: 1 });
    
    console.log('✅ Created collections and indexes');
    
    // Check if admin user exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@datacollect.app' });
    
    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = {
        email: 'admin@datacollect.app',
        password: hashedPassword,
        role: 'admin',
        name: 'System Administrator',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(adminUser);
      console.log('✅ Created admin user: admin@datacollect.app / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
    
    // Create demo users
    const demoUsers = [
      {
        email: 'submitter@datacollect.app',
        password: await bcrypt.hash('submitter123', 10),
        role: 'submitter',
        name: 'Demo Submitter',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'reviewer@datacollect.app',
        password: await bcrypt.hash('reviewer123', 10),
        role: 'reviewer',
        name: 'Demo Reviewer',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'approver@datacollect.app',
        password: await bcrypt.hash('approver123', 10),
        role: 'approver',
        name: 'Demo Approver',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const user of demoUsers) {
      const existingUser = await usersCollection.findOne({ email: user.email });
      if (!existingUser) {
        await usersCollection.insertOne(user);
        console.log(`✅ Created ${user.role} user: ${user.email} / ${user.role}123`);
      }
    }
    
    // Create sample submissions
    const sampleSubmissions = [
      {
        userId: 'demo-submitter-1',
        title: 'Sample Data Entry 1',
        description: 'This is a sample data entry for testing purposes',
        data: {
          field1: 'Sample Value 1',
          field2: 'Sample Value 2',
          field3: 'Sample Value 3'
        },
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 'demo-submitter-2',
        title: 'Sample Data Entry 2',
        description: 'Another sample data entry for testing',
        data: {
          field1: 'Another Value 1',
          field2: 'Another Value 2',
          field3: 'Another Value 3'
        },
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const submission of sampleSubmissions) {
      const existingSubmission = await submissionsCollection.findOne({ title: submission.title });
      if (!existingSubmission) {
        await submissionsCollection.insertOne(submission);
        console.log(`✅ Created sample submission: ${submission.title}`);
      }
    }
    
    console.log('');
    console.log('🎉 Database initialization completed successfully!');
    console.log('');
    console.log('📋 Available Accounts:');
    console.log('====================');
    console.log('Admin:     admin@datacollect.app / admin123');
    console.log('Submitter: submitter@datacollect.app / submitter123');
    console.log('Reviewer:  reviewer@datacollect.app / reviewer123');
    console.log('Approver:  approver@datacollect.app / approver123');
    console.log('');
    console.log('🌐 You can now login at: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run initialization
initializeDatabase();
