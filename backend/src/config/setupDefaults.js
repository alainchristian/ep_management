// backend/src/config/setupDefaults.js
const { Role, Permission, User } = require('../models');
const bcrypt = require('bcryptjs');

const setupDefaults = async () => {
  try {
    // Default Permissions
    const defaultPermissions = [
      { name: 'manage_users', description: 'Create, update, and delete users' },
      { name: 'manage_roles', description: 'Manage user roles and permissions' },
      { name: 'manage_students', description: 'Manage student information' },
      { name: 'manage_families', description: 'Manage family information' },
      { name: 'manage_eps', description: 'Manage EP programs' },
      { name: 'manage_rotations', description: 'Manage rotation periods' },
      { name: 'take_attendance', description: 'Record attendance' },
      { name: 'view_reports', description: 'Access reporting features' },
      { name: 'manage_center', description: 'Manage center-specific information' },
      { name: 'assign_students', description: 'Assign students to EPs' },
      { name: 'modify_attendance', description: 'Modify past attendance records' }
    ];

    // Create permissions if they don't exist
    for (const perm of defaultPermissions) {
      await Permission.findOrCreate({
        where: { name: perm.name },
        defaults: perm
      });
    }

    // Default Roles with their permissions
    const defaultRoles = [
      {
        name: 'admin',
        description: 'System administrator with full access',
        permissions: defaultPermissions.map(p => p.name)
      },
      {
        name: 'teacher',
        description: 'EP teacher with limited access',
        permissions: ['manage_eps', 'take_attendance', 'view_reports', 'assign_students']
      },
      {
        name: 'supervisor',
        description: 'Supervisor with center access',
        permissions: ['manage_center', 'view_reports', 'take_attendance']
      },
      {
        name: 'attendance_taker',
        description: 'User who can take attendance',
        permissions: ['take_attendance', 'modify_attendance']
      }
    ];

    // Create roles and assign permissions
    for (const roleData of defaultRoles) {
      const [role] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: {
          description: roleData.description,
          is_active: true
        }
      });

      // Get permission instances
      const permissions = await Permission.findAll({
        where: { name: roleData.permissions }
      });

      // Associate permissions with role
      await role.setPermissions(permissions);
    }

    // Create default admin user if it doesn't exist
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const [adminUser] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        username: 'admin',
        first_name: 'System',
        last_name: 'Administrator',
        password: await bcrypt.hash('admin123', 10),
        is_active: true
      }
    });

    // Assign admin role to admin user
    await adminUser.setRoles([adminRole]);

    console.log('Default roles, permissions, and admin user created successfully');
  } catch (error) {
    console.error('Error setting up defaults:', error);
    throw error;
  }
};

module.exports = setupDefaults;