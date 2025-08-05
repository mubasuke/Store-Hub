const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByRole
} = require('../controllers/EmployeeController');
const { authenticateToken, requireStoreOwner } = require('../middleware/auth');

// Protected routes - only store owners can manage employees
router.get('/', authenticateToken, requireStoreOwner, getEmployees);
router.get('/:id', authenticateToken, requireStoreOwner, getEmployeeById);
router.post('/', authenticateToken, requireStoreOwner, createEmployee);
router.put('/:id', authenticateToken, requireStoreOwner, updateEmployee);
router.delete('/:id', authenticateToken, requireStoreOwner, deleteEmployee);
router.get('/role/:role', authenticateToken, requireStoreOwner, getEmployeesByRole);

module.exports = router; 