import mysql from 'mysql2/promise';

// MySQL configuration
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'taleskillz_db',
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool;

// Create MySQL connection pool
export async function connectToMySQL() {
  if (pool) {
    return pool;
  }

  try {
    pool = mysql.createPool(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL database');
    return pool;
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    throw error;
  }
}

// Get database connection
export async function getMySQLConnection() {
  if (!pool) {
    await connectToMySQL();
  }
  return pool;
}

// Execute query
export async function executeQuery(query: string, params: any[] = []) {
  const connection = await getMySQLConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Query execution error:', error);
    throw error;
  }
}

// Close connection
export async function closeMySQLConnection() {
  if (pool) {
    await pool.end();
    console.log('🔌 MySQL connection closed');
  }
}

// Check if MySQL is configured
export const isMySQLConfigured = true;
