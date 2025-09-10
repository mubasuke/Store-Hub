const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/ProductController');
const { authenticateToken, requireStoreOwner, requireEmployeeOrOwner } = require('../middleware/auth');

// Routes accessible by both employees and store owners
router.get('/', authenticateToken, requireEmployeeOrOwner, getProducts);
router.get('/:id', authenticateToken, requireEmployeeOrOwner, getProductById);
router.get('/alerts/low-stock', authenticateToken, requireEmployeeOrOwner, getLowStockProducts);

// Routes accessible by both employees and store owners
router.put('/:id', authenticateToken, requireEmployeeOrOwner, updateProduct);

// Routes accessible only by store owners
router.post('/', authenticateToken, requireStoreOwner, addProduct);
router.delete('/:id', authenticateToken, requireStoreOwner, deleteProduct);

module.exports = router;