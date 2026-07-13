-- Seed script for default admin account initialization
-- This script creates the default admin user for CMS backend login

-- Insert default admin account
-- Password: admin123 (hashed with bcrypt using pgcrypto)
INSERT INTO users (username, password_hash, email, role)
VALUES (
    'admin',
    crypt('admin123', gen_salt('bf')),
    'admin@shangtech.com',
    'admin'
)
ON CONFLICT (username) DO NOTHING;