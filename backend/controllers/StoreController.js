const Store = require('../models/Store');
const User = require('../models/User');

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
    
    res.status(201).json({
      message: 'Store created successfully',
      store: newStore
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
  updateStore
}; 