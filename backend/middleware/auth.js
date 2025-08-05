const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is store owner
const requireStoreOwner = (req, res, next) => {
  if (req.user.role !== 'store_owner') {
    return res.status(403).json({ 
      message: 'Access denied. Store owner privileges required.' 
    });
  }
  next();
};

// Middleware to check if user is employee or store owner
const requireEmployeeOrOwner = (req, res, next) => {
  if (req.user.role !== 'employee' && req.user.role !== 'store_owner') {
    return res.status(403).json({ 
      message: 'Access denied. Employee or store owner privileges required.' 
    });
  }
  next();
};

// Middleware to check if user is employee only
const requireEmployee = (req, res, next) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ 
      message: 'Access denied. Employee privileges required.' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireStoreOwner,
  requireEmployeeOrOwner,
  requireEmployee
}; 