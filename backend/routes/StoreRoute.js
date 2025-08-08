const express = require('express');
const router = express.Router();
const {
  createStore,
  getStoreByStoreId,
  getStoreByUserId,
  getMyStore,
  updateStore
} = require('../controllers/StoreController');
const { authenticateToken, requireStoreOwner } = require('../middleware/auth');

// Public route to get store by storeId (for employee registration)
router.get('/by-store-id/:storeId', getStoreByStoreId);

// Protected routes
router.post('/', authenticateToken, requireStoreOwner, createStore);
router.get('/my-store', authenticateToken, getMyStore); // Allow both store owners and employees
router.put('/', authenticateToken, requireStoreOwner, updateStore);

module.exports = router; 