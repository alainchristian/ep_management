// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    console.log('\n=== Auth Middleware ===');
    console.log('Headers:', req.headers);

    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token found:', token.substring(0, 20) + '...');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Token decoded successfully:', {
        userId: decoded.id,
        email: decoded.email,
        roles: decoded.roles
      });

      req.user = decoded;
      console.log('=== Auth Middleware End ===\n');
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({ message: 'Token is invalid' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = auth;