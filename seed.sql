-- seed_data.sql

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables in correct order
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;

-- Create tables
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    INDEX idx_user_role (user_id, role_id),
    INDEX idx_date_range (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Permissions
INSERT INTO permissions (name, description) VALUES
-- User Management
('view_users', 'Can view list of users and their details'),
('create_user', 'Can create new users'),
('edit_user', 'Can edit existing users'),
('delete_user', 'Can delete users'),
('manage_roles', 'Can assign and manage user roles'),

-- EP Management
('view_eps', 'Can view list of EPs and their details'),
('create_ep', 'Can create new EPs'),
('edit_ep', 'Can edit existing EPs'),
('delete_ep', 'Can delete EPs'),
('assign_students', 'Can assign students to EPs'),

-- Student Management
('view_students', 'Can view list of students and their details'),
('create_student', 'Can create new student records'),
('edit_student', 'Can edit student records'),
('delete_student', 'Can delete student records'),

-- Attendance Management
('view_attendance', 'Can view attendance records'),
('take_attendance', 'Can take and modify attendance'),

-- System Management
('view_reports', 'Can view system reports'),
('manage_settings', 'Can modify system settings');

-- Insert Roles
INSERT INTO roles (name, description, is_active) VALUES
('admin', 'System administrator with full access to all features', true),
('teacher', 'EP teacher with access to EP management and attendance', true),
('supervisor', 'Supervisor with access to reports and management features', true),
('attendance_taker', 'Staff member who can record attendance', true);

-- Insert Test Users (password is 'Password@123' for all users)
INSERT INTO users (username, email, password, first_name, last_name, is_active) VALUES
('admin', 'admin@asyv.org', '$2a$12$n9r4DqdDtoi13EGkMsu4ZerJJNMhKb25F5wPg91YZ4AAAytvH3Lzi', 'Admin', 'User', true),
('teacher', 'teacher@asyv.org', '$2a$12$n9r4DqdDtoi13EGkMsu4ZerJJNMhKb25F5wPg91YZ4AAAytvH3Lzi', 'Teacher', 'User', true),
('supervisor', 'supervisor@asyv.org', '$2a$12$n9r4DqdDtoi13EGkMsu4ZerJJNMhKb25F5wPg91YZ4AAAytvH3Lzi', 'Supervisor', 'User', true),
('attendance', 'attendance@asyv.org', '$2a$12$n9r4DqdDtoi13EGkMsu4ZerJJNMhKb25F5wPg91YZ4AAAytvH3Lzi', 'Attendance', 'User', true);
-- Assign permissions to roles
-- Admin role (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    id
FROM permissions;

-- Teacher role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'teacher'),
    id
FROM permissions 
WHERE name IN (
    'view_eps',
    'edit_ep',
    'assign_students',
    'view_students',
    'view_attendance',
    'take_attendance'
);

-- Supervisor role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'supervisor'),
    id
FROM permissions 
WHERE name IN (
    'view_users',
    'view_eps',
    'view_students',
    'view_attendance',
    'view_reports',
    'manage_settings'
);

-- Attendance taker role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'attendance_taker'),
    id
FROM permissions 
WHERE name IN (
    'view_eps',
    'view_students',
    'view_attendance',
    'take_attendance'
);

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id, start_date) VALUES
-- Admin user gets admin role
((SELECT id FROM users WHERE username = 'admin'),
 (SELECT id FROM roles WHERE name = 'admin'),
 CURRENT_TIMESTAMP),

-- Teacher user gets teacher role
((SELECT id FROM users WHERE username = 'teacher'),
 (SELECT id FROM roles WHERE name = 'teacher'),
 CURRENT_TIMESTAMP),

-- Supervisor user gets supervisor role
((SELECT id FROM users WHERE username = 'supervisor'),
 (SELECT id FROM roles WHERE name = 'supervisor'),
 CURRENT_TIMESTAMP),

-- Attendance user gets attendance_taker role
((SELECT id FROM users WHERE username = 'attendance'),
 (SELECT id FROM roles WHERE name = 'attendance_taker'),
 CURRENT_TIMESTAMP);

-- Verify data insertion
SELECT 'Data insertion completed. Verification:' as '';
SELECT 'Roles count: ' as '', COUNT(*) FROM roles;
SELECT 'Permissions count: ' as '', COUNT(*) FROM permissions;
SELECT 'Users count: ' as '', COUNT(*) FROM users;
SELECT 'User-Roles count: ' as '', COUNT(*) FROM user_roles;
SELECT 'Role-Permissions count: ' as '', COUNT(*) FROM role_permissions;