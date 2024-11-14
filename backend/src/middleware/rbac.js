// backend/src/middleware/rbac.js
const { User, Role, Permission, UserRole, RolePermission } = require('../models');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get user's active roles
      const userRoles = await UserRole.findAll({
        where: {
          userId,
          endDate: null, // Only active role assignments
        },
        include: [{
          model: Role,
          where: { isActive: true },
          include: [{
            model: RolePermission,
            include: [Permission]
          }]
        }]
      });

      // Flatten permissions from all roles
      const permissions = userRoles.flatMap(userRole => 
        userRole.Role.RolePermissions.map(rp => rp.Permission.name)
      );

      // Check if user has the required permission
      if (permissions.includes(requiredPermission)) {
        next();
      } else {
        res.status(403).json({ message: 'Permission denied' });
      }
    } catch (error) {
      console.error('RBAC Error:', error);
      res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Get user's active roles
      const userRoles = await UserRole.findAll({
        where: {
          userId,
          endDate: null,
        },
        include: [{
          model: Role,
          where: { isActive: true }
        }]
      });

      const userRoleNames = userRoles.map(ur => ur.Role.name);
      
      // Check if user has any of the required roles
      if (roles.some(role => userRoleNames.includes(role))) {
        next();
      } else {
        res.status(403).json({ message: 'Insufficient role permissions' });
      }
    } catch (error) {
      console.error('Role Check Error:', error);
      res.status(500).json({ message: 'Error checking role' });
    }
  };
};

module.exports = {
  checkPermission,
  requireRole
};