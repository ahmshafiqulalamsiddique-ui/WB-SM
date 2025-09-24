-- Fix the existing user adnan@adnan.com
-- First, check if they exist and their current status
SELECT u.email, u.status, u.is_active, up.password_hash IS NOT NULL as has_password
FROM users u
LEFT JOIN user_passwords up ON u.email = up.email
WHERE u.email = 'adnan@adnan.com';

-- Add password for adnan@adnan.com (change the password as needed)
INSERT INTO user_passwords (email, password_hash) VALUES
    ('adnan@adnan.com', 'password123')
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- Verify the fix
SELECT u.email, u.status, u.is_active, up.password_hash IS NOT NULL as has_password
FROM users u
LEFT JOIN user_passwords up ON u.email = up.email
WHERE u.email = 'adnan@adnan.com';
