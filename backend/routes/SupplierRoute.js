const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/SupplierController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all suppliers
router.get('/', SupplierController.getSuppliers);

// Search suppliers
router.get('/search', SupplierController.searchSuppliers);

// Get single supplier
router.get('/:id', SupplierController.getSupplier);

// Create new supplier
router.post('/', SupplierController.createSupplier);

// Update supplier
router.put('/:id', SupplierController.updateSupplier);

// Delete supplier
router.delete('/:id', SupplierController.deleteSupplier);

module.exports = router;
