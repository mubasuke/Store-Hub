const express = require('express');
const router = express.Router();
const {
  getSales,
  createSale,
  getSaleById,
  getLowStockProducts,
  deleteSale
} = require('../controllers/SaleController');
const { authenticateToken, requireStoreOwner, requireEmployeeOrOwner } = require('../middleware/auth');

// Routes accessible by both employees and store owners
router.get('/', authenticateToken, requireEmployeeOrOwner, getSales);
router.get('/:id', authenticateToken, requireEmployeeOrOwner, getSaleById);
router.get('/alerts/low-stock', authenticateToken, requireEmployeeOrOwner, getLowStockProducts);

// Routes accessible only by store owners
router.post('/', authenticateToken, requireStoreOwner, createSale);
router.delete('/:id', authenticateToken, requireStoreOwner, deleteSale);

module.exports = router; 