// Error handler 
// backend/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body
    });
  
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };
  
  module.exports = errorHandler;
  
//   // backend/src/app.js or index.js
//   const express = require('express');
//   const cors = require('cors');
//   const authRoutes = require('./routes/auth');
//   const errorHandler = require('./middleware/errorHandler');
//   require('dotenv').config();
  
//   const app = express();
  
//   // CORS configuration
//   app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
//   }));
  
//   // Body parser
//   app.use(express.json());
  
//   // Routes
//   app.use('/api/auth', authRoutes);
  
//   // Error handling
//   app.use(errorHandler);
  
//   const PORT = process.env.PORT || 5000;
  
//   // Test database connection before starting server
//   const sequelize = require('./config/database');
//   sequelize.authenticate()
//     .then(() => {
//       console.log('Database connection established.');
//       app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//       });
//     })
//     .catch(err => {
//       console.error('Unable to connect to database:', err);
//       process.exit(1);
//     });
  
//   module.exports = app;