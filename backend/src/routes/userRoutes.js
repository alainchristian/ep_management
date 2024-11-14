// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { User, Role, Permission } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /users route hit');
    const users = await User.findAll({
      where: { deleted_at: null },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }],
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
    });

    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;