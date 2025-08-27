const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all customers
router.get('/', CustomerController.getCustomers);

// Search customers
router.get('/search', CustomerController.searchCustomers);

// Get customer history
router.get('/:id/history', CustomerController.getCustomerHistory);

// Get single customer
router.get('/:id', CustomerController.getCustomer);

// Create new customer
router.post('/', CustomerController.createCustomer);

// Update customer
router.put('/:id', CustomerController.updateCustomer);

// Delete customer
router.delete('/:id', CustomerController.deleteCustomer);

// Add loyalty points
router.post('/:id/points', CustomerController.addLoyaltyPoints);

// Redeem loyalty points
router.post('/:id/redeem', CustomerController.redeemLoyaltyPoints);

module.exports = router;
