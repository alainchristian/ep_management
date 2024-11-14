-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables in correct order
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Test Users (password is 'Password@123' for all users)
INSERT INTO users (username, email, password, first_name, last_name, is_active) VALUES
('admin', 'admin@asyv.org', '$2a$12$n9r4DqdDtoi13EGkMsu4ZerJJNMhKb25F5wPg91YZ4AAAytvH3Lzi', 'Admin', 'User', true),
('teacher', 'teacher@asyv.org', '$2a$12$n9r4DqdDtoi13EGkMsu4ZerJJNMhKb25F5wPg91YZ4AAAytvH3Lzi', 'Teacher', 'User', true),
('supervisor', 'supervisor@asyv.org', '$2a$12$n9r4DqdDtoi13EGkMsu4ZerJJNMhKb25F5wPg91YZ4AAAytvH3Lzi', 'Supervisor', 'User', true),
('attendance', 'attendance@asyv.org', '$2a$12$n9r4DqdDtoi13EGkMsu4ZerJJNMhKb25F5wPg91YZ4AAAytvH3Lzi', 'Attendance', 'User', true);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;