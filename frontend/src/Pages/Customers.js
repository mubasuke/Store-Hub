import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Star,
  Search,
  PersonAdd,
  Loyalty,
  LocalOffer,
  TrendingUp
} from '@mui/icons-material';
import axios from 'axios';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data.customers);
      setFilteredCustomers(response.data.customers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      if (err.response?.data?.message?.includes('No store associated')) {
        setError('You need to create a store first to manage customers. Please go to the Store Info page to create your store.');
      } else {
        setError('Failed to load customers');
      }
      setLoading(false);
    }
  };

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || ''
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Name, email, and phone are required fields');
        return;
      }

      if (editingCustomer) {
        await axios.put(`http://localhost:5000/api/customers/${editingCustomer._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/customers', formData);
      }
      fetchCustomers();
      handleCloseDialog();
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error saving customer:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save customer';
      
      // Check if the error is about missing store
      if (errorMessage.includes('No store associated')) {
        setError('You need to create a store first before adding customers. Please go to the Store Info page to create your store.');
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${customerId}`);
        fetchCustomers();
      } catch (err) {
        console.error('Error deleting customer:', err);
        setError('Failed to delete customer');
      }
    }
  };

  const getMembershipColor = (level) => {
    switch (level) {
      case 'Platinum': return 'error';
      case 'Gold': return 'warning';
      case 'Silver': return 'default';
      case 'Bronze': return 'primary';
      default: return 'default';
    }
  };

  const getDiscountEligibilityColor = (eligibility) => {
    if (!eligibility) return 'default';
    if (eligibility.discount >= 15) return 'error';
    if (eligibility.discount >= 10) return 'warning';
    if (eligibility.discount >= 5) return 'success';
    return 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main">
          Customer Loyalty Program
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your customers and their loyalty points
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            error.includes('create a store first') ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate('/create-store')}
                sx={{ ml: 2 }}
              >
                Create Store
              </Button>
            ) : null
          }
        >
          {error}
        </Alert>
      )}


      {/* Search and Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
            boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
            }
          }}
        >
          Add Customer
        </Button>
      </Box>

      {/* Customers Table */}
      <TableContainer component={Paper} sx={{ background: 'background.default', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Membership</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Loyalty Points</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Discount Eligibility</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total Spent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer._id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {customer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Joined: {new Date(customer.joinDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{customer.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.phone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={customer.membershipLevel}
                    color={getMembershipColor(customer.membershipLevel)}
                    size="small"
                    icon={<Star />}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Loyalty sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight={600}>
                      {customer.loyaltyPoints}
                    </Typography>
                  </Box>
                  {customer.pointsToNextTier > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {customer.pointsToNextTier} to next tier
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {customer.discountEligibility ? (
                    <Box>
                      <Chip
                        label={customer.discountEligibility.description}
                        color={getDiscountEligibilityColor(customer.discountEligibility)}
                        size="small"
                        icon={<LocalOffer />}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {customer.discountEligibility.points} points required
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Not eligible
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Need {100 - customer.loyaltyPoints} more points
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    ${customer.totalSpent.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={customer.isActive ? 'Active' : 'Inactive'}
                    color={customer.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Customer">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(customer)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Customer">
                      <IconButton size="small" color="error" onClick={() => handleDelete(customer._id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCustomer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Customers;
