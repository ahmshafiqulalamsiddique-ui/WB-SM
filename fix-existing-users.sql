-- Fix existing users who were created as active but should be pending
-- and add their passwords

-- First, check current status
SELECT u.email, u.status, u.is_active, up.password_hash IS NOT NULL as has_password
FROM users u
LEFT JOIN user_passwords up ON u.email = up.email
WHERE u.email IN ('adnan1@adnan.com', 'adnan@adnan.com');

-- Set users to pending status (they should not be active until approved)
UPDATE users 
SET status = 'pending', is_active = false
WHERE email IN ('adnan1@adnan.com', 'adnan@adnan.com')
AND role = 'submitter';

-- Add passwords for these users
INSERT INTO user_passwords (email, password_hash) VALUES
    ('adnan1@adnan.com', 'password123'),
    ('adnan@adnan.com', 'password123')
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- Verify the fix
SELECT u.email, u.status, u.is_active, up.password_hash IS NOT NULL as has_password
FROM users u
LEFT JOIN user_passwords up ON u.email = up.email
WHERE u.email IN ('adnan1@adnan.com', 'adnan@adnan.com');
