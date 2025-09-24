const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// MySQL configuration (without database first)
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
};

const DATABASE_NAME = process.env.MYSQL_DATABASE || 'taleskillz_db';

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL server...');
    connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL server');

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

    // Demo users removed - users will be created through registration
    console.log('📝 Demo users removed - users will be created through registration');

    // Create indexes for better performance
    console.log('📊 Creating database indexes...');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');
    console.log('✅ Database indexes created');

    console.log('🎉 MySQL database initialization completed successfully!');
    console.log('');
    console.log('📋 Admin Login:');
    console.log('   Email: admin@datacollect.app');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run initialization
initializeDatabase();