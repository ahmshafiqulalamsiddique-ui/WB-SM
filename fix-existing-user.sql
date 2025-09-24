-- Fix existing user adnan@adnan.com
-- Option 1: Add password and keep active
INSERT INTO user_passwords (email, password_hash) VALUES
    ('adnan@adnan.com', 'password123')  -- Change this password
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- Option 2: Reset to pending status (uncomment if you prefer this)
-- UPDATE users 
-- SET status = 'pending', is_active = false 
-- WHERE email = 'adnan@adnan.com';

-- Check the user status
SELECT u.email, u.status, u.is_active, up.password_hash IS NOT NULL as has_password
FROM users u
LEFT JOIN user_passwords up ON u.email = up.email
WHERE u.email = 'adnan@adnan.com';
