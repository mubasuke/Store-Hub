const express = require('express');
const router = express.Router();
const {
  getSales,
  createSale,
  getSaleById,
  getLowStockProducts,
  deleteSale,
  getRevenueData
} = require('../controllers/SaleController');
const { authenticateToken, requireStoreOwner, requireEmployeeOrOwner } = require('../middleware/auth');

// Routes accessible by both employees and store owners
router.get('/', authenticateToken, requireEmployeeOrOwner, getSales);
router.get('/revenue', authenticateToken, requireEmployeeOrOwner, getRevenueData);
router.get('/:id', authenticateToken, requireEmployeeOrOwner, getSaleById);
router.get('/alerts/low-stock', authenticateToken, requireEmployeeOrOwner, getLowStockProducts);

// Routes accessible by both employees and store owners
router.post('/', authenticateToken, requireEmployeeOrOwner, createSale);

// Routes accessible only by store owners
router.delete('/:id', authenticateToken, requireStoreOwner, deleteSale);
module.exports = router; 