const express = require('express');
const router = express.Router();
const {
  createStore,
  getStoreByStoreId,
  getStoreByUserId,
  updateStore
} = require('../controllers/StoreController');
const { authenticateToken, requireStoreOwner } = require('../middleware/auth');

// Public route to get store by storeId (for employee registration)
router.get('/by-store-id/:storeId', getStoreByStoreId);

// Protected routes
router.post('/', authenticateToken, requireStoreOwner, createStore);
router.get('/my-store', authenticateToken, requireStoreOwner, getStoreByUserId);
router.put('/', authenticateToken, requireStoreOwner, updateStore);

module.exports = router; 