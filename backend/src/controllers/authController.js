// controllers/authController.js
const { User, Role, Permission } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with roles and permissions
    const user = await User.findOne({
      where: { email, is_active: true },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }, // Exclude junction table attributes
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] } // Exclude junction table attributes
        }]
      }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        roles: user.roles.map(role => role.name),
        permissions: user.roles.flatMap(role => 
          role.permissions.map(permission => permission.name)
        )
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        roles: user.roles.map(role => ({
          id: role.id,
          name: role.name,
          permissions: role.permissions.map(permission => ({
            id: permission.id,
            name: permission.name
          }))
        }))
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login
};