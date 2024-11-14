// backend/src/controllers/userController.js
const { User, Role, Permission } = require('../models');

const getUsers = async (req, res) => {
  try {
    console.log('Fetching users list - Request received');
    console.log('Authenticated user:', req.user);

    const users = await User.findAll({
      where: {
        deleted_at: null
      },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] },
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }]
      }],
      order: [['created_at', 'DESC']]
    });

    console.log(`Found ${users.length} users`);

    const transformedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      roles: user.roles.map(role => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions.map(permission => ({
          id: permission.id,
          name: permission.name
        }))
      }))
    }));

    console.log('Sending response with transformed users');
    res.json(transformedUsers);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ 
      message: 'Error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getUsers
};