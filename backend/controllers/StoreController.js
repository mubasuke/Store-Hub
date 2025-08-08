const Store = require('../models/Store');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate unique store ID
const generateStoreId = () => {
  return 'STORE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create a new store
const createStore = async (req, res) => {
  try {
    const { name, description, address, phone, email } = req.body;
    
    // Generate unique store ID
    const storeId = generateStoreId();
    
    const newStore = new Store({
      name,
      description,
      address,
      phone,
      email,
      storeId,
      ownerId: req.user.userId
    });
    
    await newStore.save();
    
    // Update the user's storeId
    await User.findByIdAndUpdate(req.user.userId, {
      storeId: newStore._id
    });
    
    // Generate new JWT token with storeId
    const updatedToken = jwt.sign(
      { 
        userId: req.user.userId, 
        role: req.user.role, 
        storeId: newStore._id 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Get updated user data
    const updatedUser = await User.findById(req.user.userId).populate('storeId');
    
    res.status(201).json({
      message: 'Store created successfully',
      store: newStore,
      token: updatedToken,
      user: updatedUser.toJSON()
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get store by storeId (for employee registration)
const getStoreByStoreId = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const store = await Store.findOne({ 
      storeId: storeId,
      isActive: true 
    }).populate('ownerId', 'username email');
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({
      store: {
        _id: store._id,
        name: store.name,
        storeId: store.storeId,
        ownerName: store.ownerId.username,
        ownerEmail: store.ownerId.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get store by user ID (for store owners)
const getStoreByUserId = async (req, res) => {
  try {
    const store = await Store.findOne({ 
      ownerId: req.user.userId,
      isActive: true 
    });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({ store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's store (works for both store owners and employees)
const getMyStore = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const store = await Store.findOne({ 
      _id: req.user.storeId,
      isActive: true 
    });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({ store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update store
const updateStore = async (req, res) => {
  try {
    const { name, description, address, phone, email } = req.body;
    
    const store = await Store.findOneAndUpdate(
      { ownerId: req.user.userId },
      { 
        name, 
        description, 
        address, 
        phone, 
        email,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({
      message: 'Store updated successfully',
      store
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createStore,
  getStoreByStoreId,
  getStoreByUserId,
  getMyStore,
  updateStore
}; 