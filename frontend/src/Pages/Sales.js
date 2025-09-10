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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
  Tooltip,
  DialogContentText
} from '@mui/material';
import {
  Add,
  Delete,
  Receipt,
  Warning,
  CheckCircle,
  Cancel,
  LocalOffer,
  Loyalty
} from '@mui/icons-material';
import axios from 'axios';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, sale: null });
  const [saleItems, setSaleItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loyaltyPointsRedeemed, setLoyaltyPointsRedeemed] = useState(0);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, productsRes, customersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/sales'),
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/customers')
      ]);

      setSales(salesRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data.customers);
      setLoading(false);
    } catch (err) {
      // Check if the error is due to no store being associated
      if (err.response?.data?.message?.includes('No store associated')) {
        setError('You need to create a store first to access sales data.');
      } else {
        setError('Failed to load data');
      }
      setLoading(false);
    }
  };

  const handleDeleteSale = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/${deleteDialog.sale._id}`);
      setDeleteDialog({ open: false, sale: null });
      fetchData();
      setError('');
    } catch (err) {
      // Check if the error is due to no store being associated
      if (err.response?.data?.message?.includes('No store associated')) {
        setError('You need to create a store first to manage sales.');
      } else {
        setError(err.response?.data?.message || 'Failed to delete sale');
      }
    }
  };

  const handleAddItem = () => {
    setSaleItems([...saleItems, { product: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...saleItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Update price when product changes
    if (field === 'product') {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        newItems[index].price = selectedProduct.price;
      }
    }
    
    setSaleItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const pointDiscountAmount = loyaltyPointsRedeemed * 0.01; // 1 point = $0.01
    const taxAmount = ((subtotal - discountAmount - pointDiscountAmount) * tax) / 100;
    const total = subtotal - discountAmount - pointDiscountAmount + taxAmount;
    
    return { subtotal, discountAmount, pointDiscountAmount, taxAmount, total };
  };

  const handleSubmit = async () => {
    if (saleItems.length === 0) {
      setError('Please add at least one item');
      return;
    }

    try {
      const { total } = calculateTotals();
      const saleData = {
        items: saleItems,
        customerName: selectedCustomer ? customers.find(c => c._id === selectedCustomer)?.name : customerName,
        customerId: selectedCustomer || null,
        discount,
        tax,
        paymentMethod,
        loyaltyPointsRedeemed
      };

      const response = await axios.post('http://localhost:5000/api/sales', saleData);
      
      let message = 'Sale completed successfully!';
      
      if (response.data.sale.loyaltyPointsEarned > 0) {
        message += `\nCustomer earned ${response.data.sale.loyaltyPointsEarned} loyalty points!`;
      }
      
      if (loyaltyPointsRedeemed > 0) {
        message += `\nCustomer redeemed ${loyaltyPointsRedeemed} points for $${(loyaltyPointsRedeemed * 0.01).toFixed(2)} discount!`;
      }
      
      if (response.data.lowStockAlerts) {
        message += `\nLow stock alerts: ${response.data.lowStockAlerts.map(alert => alert.productName).join(', ')}`;
      }
      
      alert(message);

      setOpenDialog(false);
      resetForm();
      fetchData();
    } catch (err) {
      // Check if the error is due to no store being associated
      if (err.response?.data?.message?.includes('No store associated')) {
        setError('You need to create a store first to create sales.');
      } else {
        setError(err.response?.data?.message || 'Failed to create sale');
      }
    }
  };

  const resetForm = () => {
    setSaleItems([]);
    setCustomerName('');
    setSelectedCustomer('');
    setDiscount(0);
    setTax(0);
    setPaymentMethod('Cash');
    setLoyaltyPointsRedeemed(0);
    setSelectedCustomerData(null);
  };

  const { subtotal, discountAmount, pointDiscountAmount, taxAmount, total } = calculateTotals();

  // Handle customer selection change
  const handleCustomerChange = (customerId) => {
    setSelectedCustomer(customerId);
    setLoyaltyPointsRedeemed(0); // Reset points redemption when customer changes
    
    if (customerId) {
      const customer = customers.find(c => c._id === customerId);
      setSelectedCustomerData(customer);
    } else {
      setSelectedCustomerData(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Sales Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Manage sales transactions and view sales history
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
            boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0d47a1 30%, #1a237e 90%)',
            }
          }}
        >
          New Sale
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale._id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(sale.saleDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(sale.saleDate).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {sale.customerName}
                        </Typography>
                        {sale.customerId && (
                          <Chip 
                            label={`${sale.loyaltyPointsEarned || 0} points earned`}
                            size="small" 
                            color="success" 
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 200 }}>
                        {sale.items.map((item, index) => (
                          <Chip
                            key={index}
                            label={`${item.product?.name} x${item.quantity}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        ${sale.finalAmount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={sale.paymentMethod} 
                        size="small" 
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete Sale">
                        <IconButton 
                          onClick={() => setDeleteDialog({ open: true, sale })}
                          color="error"
                          size="small"
                        >
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, sale: null })}>
        <DialogTitle sx={{ color: '#d32f2f' }}>
          <Box display="flex" alignItems="center">
            <Warning sx={{ mr: 1 }} />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this sale? This action will:
            <ul>
              <li>Remove the sale record</li>
              <li>Restore product quantities to inventory</li>
            </ul>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, sale: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSale} 
            color="error" 
            variant="contained"
            startIcon={<Delete />}
          >
            Delete Sale
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Receipt sx={{ mr: 1, color: '#1a237e' }} />
            Create New Sale
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Customer (Loyalty Program)</InputLabel>
                <Select
                  value={selectedCustomer}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Walk-in Customer</em>
                  </MenuItem>
                  {customers.map((customer) => (
                    <MenuItem key={customer._id} value={customer._id}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {customer.name} - {customer.membershipLevel}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {customer.loyaltyPoints} points
                          {customer.discountEligibility && ` • Eligible for ${customer.discountEligibility.description}`}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name (if not in loyalty program)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                disabled={selectedCustomer !== ''}
              />
            </Grid>
            
            {/* Loyalty Points Redemption Section */}
            {selectedCustomerData && (
              <Grid item xs={12}>
                <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Loyalty sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Loyalty Points Redemption
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Available Points: <strong>{selectedCustomerData.loyaltyPoints}</strong>
                        </Typography>
                        {selectedCustomerData.discountEligibility && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                            <LocalOffer sx={{ fontSize: 16, mr: 0.5 }} />
                            Eligible for {selectedCustomerData.discountEligibility.description}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Points to Redeem"
                          type="number"
                          value={loyaltyPointsRedeemed}
                          onChange={(e) => {
                            const points = parseInt(e.target.value) || 0;
                            const maxPoints = Math.min(points, selectedCustomerData.loyaltyPoints);
                            setLoyaltyPointsRedeemed(maxPoints);
                          }}
                          InputProps={{ 
                            inputProps: { 
                              min: 0, 
                              max: selectedCustomerData.loyaltyPoints 
                            } 
                          }}
                          helperText={`1 point = $0.01 discount`}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Discount Amount: <strong>${(loyaltyPointsRedeemed * 0.01).toFixed(2)}</strong>
                        </Typography>
                        {loyaltyPointsRedeemed > 0 && (
                          <Typography variant="caption" color="success.main">
                            Customer will have {selectedCustomerData.loyaltyPoints - loyaltyPointsRedeemed} points remaining
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Discount (%)"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tax (%)"
                type="number"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Mobile Payment">Mobile Payment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                Sale Items
              </Typography>
              <Button 
                onClick={handleAddItem} 
                variant="outlined" 
                size="small"
                startIcon={<Add />}
                sx={{ borderRadius: 2 }}
              >
                Add Item
              </Button>
            </Box>

            {saleItems.map((item, index) => (
              <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Product</InputLabel>
                        <Select
                          value={item.product}
                          onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                        >
                          {products.map((product) => (
                            <MenuItem key={product._id} value={product._id}>
                              {product.name} (Stock: {product.quantity})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Tooltip title="Remove Item">
                        <IconButton onClick={() => handleRemoveItem(index)} color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            {saleItems.length > 0 && (
              <Card sx={{ mt: 3, backgroundColor: '#f8f9fa' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1a237e', fontWeight: 600 }}>
                    Sale Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Discount (%):</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>-${discountAmount.toFixed(2)}</Typography>
                    </Grid>
                    {loyaltyPointsRedeemed > 0 && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Points Discount:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>-${pointDiscountAmount.toFixed(2)}</Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>+${taxAmount.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>Total:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>${total.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
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
            onClick={handleSubmit} 
            variant="contained" 
            disabled={saleItems.length === 0}
            startIcon={<CheckCircle />}
            sx={{
              background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
              }
            }}
          >
            Complete Sale
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sales; 