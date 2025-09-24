-- CRITICAL: Fix all users who were incorrectly created as ACTIVE
-- This script sets ALL submitter users to PENDING status

-- First, check current status of all users
SELECT 
    u.email, 
    u.role, 
    u.status, 
    u.is_active,
    CASE WHEN up.password_hash IS NOT NULL THEN 'YES' ELSE 'NO' END as has_password
FROM users u
LEFT JOIN user_passwords up ON u.email = up.email
ORDER BY u.created_at;

-- Set ALL submitter users to pending status (they should not be active until approved)
UPDATE users 
SET status = 'pending', is_active = false
WHERE role = 'submitter' 
AND email != 'admin@datacollect.app';  -- Keep admin active

-- Add missing passwords for users who don't have them
INSERT INTO user_passwords (email, password_hash) VALUES
    ('adnan1@adnan.com', 'password123'),
    ('adnan@adnan.com', 'password123'),
    ('test@test.com', 'password123')
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- Verify the fix - ALL submitter users should now be PENDING
SELECT 
    u.email, 
    u.role, 
    u.status, 
    u.is_active,
    CASE WHEN up.password_hash IS NOT NULL THEN 'YES' ELSE 'NO' END as has_password
FROM users u
LEFT JOIN user_passwords up ON u.email = up.email
ORDER BY u.created_at;
