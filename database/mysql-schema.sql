-- MySQL Database Schema for taleskillz.com
-- Run this SQL in your Hostinger MySQL database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'submitter', 'reviewer', 'approver') NOT NULL DEFAULT 'submitter',
  status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSON,
  status ENUM('pending', 'reviewed', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  reviewer_id INT NULL,
  approver_id INT NULL,
  review_notes TEXT,
  approval_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, name, role, status) VALUES 
('admin@datacollect.app', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin', 'active')
ON DUPLICATE KEY UPDATE email=email;

-- Insert demo users
INSERT INTO users (email, password, name, role, status) VALUES 
('submitter@datacollect.app', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo Submitter', 'submitter', 'active'),
('reviewer@datacollect.app', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo Reviewer', 'reviewer', 'active'),
('approver@datacollect.app', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo Approver', 'approver', 'active')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample submissions
INSERT INTO submissions (user_id, title, description, data, status) VALUES 
(2, 'Sample Data Entry 1', 'This is a sample data entry for testing purposes', '{"field1": "Sample Value 1", "field2": "Sample Value 2", "field3": "Sample Value 3"}', 'pending'),
(2, 'Sample Data Entry 2', 'Another sample data entry for testing', '{"field1": "Another Value 1", "field2": "Another Value 2", "field3": "Another Value 3"}', 'approved');
