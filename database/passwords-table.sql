-- Password storage table for Supabase
-- This replaces the password-store.json file

CREATE TABLE user_passwords (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX idx_user_passwords_email ON user_passwords(email);

-- Insert default passwords for core users
INSERT INTO user_passwords (email, password_hash) VALUES
    ('admin@datacollect.app', 'admin123'),
    ('submitter@datacollect.app', 'Passw0rd!'),
    ('reviewer@datacollect.app', 'Passw0rd!'),
    ('approver@datacollect.app', 'Passw0rd!');

-- Enable Row Level Security
ALTER TABLE user_passwords ENABLE ROW LEVEL SECURITY;

-- Create policy for password access (restrictive for security)
CREATE POLICY "Users can only access their own password" ON user_passwords
    FOR ALL USING (email = auth.jwt() ->> 'email');

-- Note: In production, you should hash passwords with bcrypt or similar
-- For now, storing plain text passwords for development
