const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: '.env.production' });

// MySQL configuration (Hostinger)
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
};

const DATABASE_NAME = process.env.MYSQL_DATABASE || 'taleskillz_db';

async function initializeHostingerDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to Hostinger MySQL server...');
    connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to Hostinger MySQL server');

    // Create database if it doesn't exist
    console.log(`📋 Creating database: ${DATABASE_NAME}...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
    console.log(`✅ Database ${DATABASE_NAME} created/verified`);

    // Close connection and reconnect with database
    await connection.end();
    
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection({
      ...MYSQL_CONFIG,
      database: DATABASE_NAME
    });
    console.log('✅ Connected to database');

    // Create tables
    console.log('📋 Creating database tables...');
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'submitter', 'reviewer', 'approver') DEFAULT 'submitter',
        status ENUM('active', 'inactive', 'pending', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create submissions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        data JSON,
        status ENUM('pending', 'reviewed', 'approved', 'rejected') DEFAULT 'pending',
        reviewer_id INT,
        approver_id INT,
        review_notes TEXT,
        approval_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Submissions table created');

    // Create sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Sessions table created');

    // Insert default admin user
    console.log('👤 Creating default admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await connection.execute(`
      INSERT IGNORE INTO users (email, password, name, role, status) 
      VALUES (?, ?, ?, ?, ?)
    `, ['admin@datacollect.app', adminPassword, 'System Administrator', 'admin', 'active']);
    
    console.log('✅ Admin user created: admin@datacollect.app / admin123');

    // Insert demo users
    console.log('👥 Creating demo users...');
    
    const submitterPassword = await bcrypt.hash('submitter123', 10);
    await connection.execute(`
      INSERT IGNORE INTO users (email, password, name, role, status) 
      VALUES (?, ?, ?, ?, ?)
    `, ['submitter@datacollect.app', submitterPassword, 'Demo Submitter', 'submitter', 'active']);

    const reviewerPassword = await bcrypt.hash('reviewer123', 10);
    await connection.execute(`
      INSERT IGNORE INTO users (email, password, name, role, status) 
      VALUES (?, ?, ?, ?, ?)
    `, ['reviewer@datacollect.app', reviewerPassword, 'Demo Reviewer', 'reviewer', 'active']);

    const approverPassword = await bcrypt.hash('approver123', 10);
    await connection.execute(`
      INSERT IGNORE INTO users (email, password, name, role, status) 
      VALUES (?, ?, ?, ?, ?)
    `, ['approver@datacollect.app', approverPassword, 'Demo Approver', 'approver', 'active']);

    console.log('✅ Demo users created');
    console.log('   - submitter@datacollect.app / submitter123');
    console.log('   - reviewer@datacollect.app / reviewer123');
    console.log('   - approver@datacollect.app / approver123');

    // Create indexes for better performance
    console.log('📊 Creating database indexes...');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');
    console.log('✅ Database indexes created');

    console.log('🎉 Hostinger MySQL database initialization completed successfully!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('   Admin: admin@datacollect.app / admin123');
    console.log('   Submitter: submitter@datacollect.app / submitter123');
    console.log('   Reviewer: reviewer@datacollect.app / reviewer123');
    console.log('   Approver: approver@datacollect.app / approver123');
    console.log('');
    console.log('🌐 Your site is now live at: https://taleskillz.com');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check your MySQL credentials in .env.production');
    console.log('   2. Ensure MySQL database exists in Hostinger panel');
    console.log('   3. Verify database user has proper permissions');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run initialization
initializeHostingerDatabase();
