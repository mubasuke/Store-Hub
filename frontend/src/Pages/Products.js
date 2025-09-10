import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Box,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Warning,
  Inventory,
  CheckCircle,
  Cancel,
  Search
} from '@mui/icons-material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    supplier: '',
    lowStockThreshold: '5'
  });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      // Check if the error is due to no store being associated
      if (err.response?.data?.message?.includes('No store associated')) {
        setError('You need to create a store first to manage products.');
      } else {
        setError('Failed to load products');
      }
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data.suppliers);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
      // Don't show error for suppliers as it's optional for products
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        category: product.category,
        supplier: product.supplier || '',
        lowStockThreshold: product.lowStockThreshold.toString()
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        supplier: '',
        lowStockThreshold: '5'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold)
      };

      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, productData);
      } else {
        await axios.post('http://localhost:5000/api/products', productData);
      }

      fetchProducts();
      handleCloseDialog();
    } catch (err) {
      // Check if the error is due to no store being associated
      if (err.response?.data?.message?.includes('No store associated')) {
        setError('You need to create a store first to add products.');
      } else {
        setError('Failed to save product');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        // Check if the error is due to no store being associated
        if (err.response?.data?.message?.includes('No store associated')) {
          setError('You need to create a store first to manage products.');
        } else {
          setError('Failed to delete product');
        }
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const lowStockProducts = products.filter(p => p.isLowStock);
  const inStockProducts = products.filter(p => !p.isLowStock);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Products Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Manage your inventory and product catalog
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
            boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0d47a1 30%, #1a237e 90%)',
            }
          }}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <Box display="flex" gap={2}>
          <Chip
            label={`Total: ${products.length}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Low Stock: ${lowStockProducts.length}`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`In Stock: ${inStockProducts.length}`}
            color="success"
            variant="outlined"
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.quantity}
                        </Typography>
                        {product.isLowStock && (
                          <Warning color="warning" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {product.supplier ? (
                        <Chip 
                          label={suppliers.find(s => s._id === product.supplier)?.name || 'Unknown'} 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No supplier
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.isLowStock ? (
                        <Chip 
                          label="Low Stock" 
                          color="warning" 
                          size="small"
                          icon={<Warning />}
                        />
                      ) : (
                        <Chip 
                          label="In Stock" 
                          color="success" 
                          size="small"
                          icon={<CheckCircle />}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit Product">
                        <IconButton onClick={() => handleOpenDialog(product)} color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product">
                        <IconButton onClick={() => handleDelete(product._id)} color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Inventory sx={{ mr: 1, color: '#1a237e' }} />
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter product name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
                placeholder="Enter product description"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                InputProps={{ 
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
                placeholder="0.00"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                InputProps={{ inputProps: { min: 0 } }}
                placeholder="0"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="e.g., Electronics, Clothing"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Supplier</InputLabel>
                <Select
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  label="Supplier"
                >
                  <MenuItem value="">
                    <em>No supplier</em>
                  </MenuItem>
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier._id} value={supplier._id}>
                      {supplier.name} - {supplier.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Low Stock Threshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                InputProps={{ inputProps: { min: 1 } }}
                helperText="Alert when stock falls below this number"
                placeholder="5"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
              }
            }}
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products; 