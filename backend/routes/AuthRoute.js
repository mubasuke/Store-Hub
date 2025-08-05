const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router; 