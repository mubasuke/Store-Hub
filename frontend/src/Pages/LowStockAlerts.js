import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  Warning,
  Inventory,
  Edit,
  Notifications,
  CheckCircle,
  Cancel,
  TrendingDown,
  LocalShipping
} from '@mui/icons-material';
import axios from 'axios';

const LowStockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/alerts/low-stock');
      setLowStockProducts(response.data);
      setLoading(false);
    } catch (err) {
      // Check if the error is due to no store being associated
      if (err.response?.data?.message?.includes('No store associated')) {
        setError('You need to create a store first to view low stock alerts.');
      } else {
        setError('Failed to load low stock products');
      }
      setLoading(false);
    }
  };

  const handleUpdateStock = (product) => {
    setSelectedProduct(product);
    setNewQuantity(product.quantity.toString());
    setOpenDialog(true);
  };

  const handleSubmitUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/${selectedProduct._id}`, {
        quantity: parseInt(newQuantity)
      });
      setOpenDialog(false);
      fetchLowStockProducts();
    } catch (err) {
      // Check if the error is due to no store being associated
      if (err.response?.data?.message?.includes('No store associated')) {
        setError('You need to create a store first to manage products.');
      } else {
        setError('Failed to update product stock');
      }
    }
  };

  const getAlertSeverity = (quantity, threshold) => {
    if (quantity === 0) return 'error';
    if (quantity <= threshold / 2) return 'warning';
    return 'info';
  };

  const getSeverityColor = (quantity, threshold) => {
    if (quantity === 0) return '#d32f2f';
    if (quantity <= threshold / 2) return '#ed6c02';
    return '#1976d2';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const criticalItems = lowStockProducts.filter(p => p.quantity === 0);
  const warningItems = lowStockProducts.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold / 2);
  const infoItems = lowStockProducts.filter(p => p.quantity > p.lowStockThreshold / 2);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Low Stock Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Monitor and manage products that need restocking
          </Typography>
        </Box>
        <Chip
          label={`${lowStockProducts.length} items need attention`}
          color="warning"
          icon={<Warning />}
          sx={{ 
            fontSize: '1rem',
            padding: '8px 16px',
            '& .MuiChip-icon': { fontSize: '1.2rem' }
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
            borderRadius: 3,
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Out of Stock
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {criticalItems.length}
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
            borderRadius: 3,
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Critical Low
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {warningItems.length}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
            borderRadius: 3,
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Low Stock
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {infoItems.length}
                  </Typography>
                </Box>
                <Notifications sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {lowStockProducts.length === 0 ? (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          borderRadius: 3
        }}>
          <CheckCircle sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 600, mb: 1 }}>
            All Good!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No low stock alerts! All products have sufficient inventory.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {lowStockProducts.map((product) => (
            <Grid item xs={12} md={6} lg={4} key={product._id}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: `2px solid ${getSeverityColor(product.quantity, product.lowStockThreshold)}`,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Warning 
                      sx={{ 
                        color: getSeverityColor(product.quantity, product.lowStockThreshold),
                        fontSize: 24
                      }} 
                    />
                  </Box>
                  
                  <Typography color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Current Stock
                        </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700,
                            color: getSeverityColor(product.quantity, product.lowStockThreshold)
                          }}
                        >
                          {product.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Threshold
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {product.lowStockThreshold}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Alert 
                      severity={getAlertSeverity(product.quantity, product.lowStockThreshold)}
                      sx={{ borderRadius: 2 }}
                    >
                      {product.quantity === 0 
                        ? 'Out of stock! Immediate restocking required.' 
                        : product.quantity <= product.lowStockThreshold / 2
                        ? 'Critical low stock - restock soon'
                        : 'Low stock alert - monitor closely'
                      }
                    </Alert>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleUpdateStock(product)}
                      sx={{
                        background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #0d47a1 30%, #1a237e 90%)',
                        }
                      }}
                    >
                      Update Stock
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Inventory sx={{ mr: 1, color: '#1a237e' }} />
            Update Stock Level
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedProduct && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {selectedProduct.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                {selectedProduct.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Current Stock
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                    {selectedProduct.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Threshold
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedProduct.lowStockThreshold}
                  </Typography>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="New Quantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                required
                InputProps={{ inputProps: { min: 0 } }}
                placeholder="Enter new stock quantity"
              />
              
              <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Threshold:</strong> {selectedProduct.lowStockThreshold} units
                </Typography>
                <Typography variant="body2">
                  <strong>Category:</strong> {selectedProduct.category}
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitUpdate} 
            variant="contained"
            startIcon={<LocalShipping />}
            sx={{
              background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
              }
            }}
          >
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LowStockAlerts; 