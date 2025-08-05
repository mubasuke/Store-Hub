const User = require('../models/User');
const Store = require('../models/Store');
const jwt = require('jsonwebtoken');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, role, storeId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    let userStoreId = null;

    if (role === 'store_owner') {
      // For store owners, we'll create the store after user creation
      // The storeId will be set later
    } else if (role === 'employee') {
      // For employees, validate that the storeId exists
      if (!storeId) {
        return res.status(400).json({ 
          message: 'Store ID is required for employee registration' 
        });
      }
      
      const store = await Store.findOne({ 
        storeId: storeId, 
        isActive: true 
      });
      
      if (!store) {
        return res.status(400).json({ 
          message: 'Invalid store ID. Please check with your store owner.' 
        });
      }
      
      userStoreId = store._id;
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || 'employee',
      storeId: userStoreId
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, storeId: userStoreId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token,
      needsStoreCreation: role === 'store_owner'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).populate('storeId');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role, 
        storeId: user.storeId ? user.storeId._id : null 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('storeId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
}; 