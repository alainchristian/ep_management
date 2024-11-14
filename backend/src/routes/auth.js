// // backend/src/routes/auth.js
// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const { login, refreshToken } = require('../controllers/authController');
// const auth = require('../middleware/auth');

// // Validation middleware
// const loginValidation = [
//   body('email')
//     .isEmail()
//     .withMessage('Invalid email format')
//     .normalizeEmail(),
//   body('password')
//     .notEmpty()
//     .withMessage('Password is required')
// ];

// const refreshTokenValidation = [
//   body('refreshToken')
//     .notEmpty()
//     .withMessage('Refresh token is required')
// ];

// // Auth routes
// router.post('/login', loginValidation, login);
// router.post('/refresh-token', refreshTokenValidation, refreshToken);

// // Protected test route
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id, {
//       attributes: ['id', 'email', 'firstName', 'lastName', 'username'],
//       include: [{
//         model: UserRole,
//         where: { endDate: null },
//         required: false,
//         include: [{
//           model: Role,
//           where: { isActive: true },
//           required: false
//         }]
//       }]
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const { roles, permissions } = await getUserRolesAndPermissions(user.id);

//     res.json({
//       id: user.id,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       username: user.username,
//       roles,
//       permissions
//     });
//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;
// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { login } = require('../controllers/authController');

// Validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

// Login route
router.post('/login', loginValidation, handleValidationErrors, login);

module.exports = router;