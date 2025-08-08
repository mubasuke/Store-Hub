import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Storefront,
  ContentCopy
} from '@mui/icons-material';
import axios from 'axios';

const CreateStore = ({ onLogin }) => {
  const navigate = useNavigate();
  const [storeFormData, setStoreFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedStoreId, setGeneratedStoreId] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleStoreChange = (e) => {
    console.log('Store form field changed:', e.target.name, e.target.value);
    setStoreFormData({
      ...storeFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateStore = async () => {
    console.log('Create Store button clicked');
    console.log('Store form data:', storeFormData);
    console.log('Token:', localStorage.getItem('token'));
    
    // Validate required fields
    if (!storeFormData.name.trim()) {
      setError('Store name is required');
      return;
    }
    
    if (!storeFormData.address.trim()) {
      setError('Store address is required');
      return;
    }
    
    if (!storeFormData.phone.trim()) {
      setError('Store phone is required');
      return;
    }
    
    if (!storeFormData.email.trim()) {
      setError('Store email is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Sending request to create store...');
      const response = await axios.post('http://localhost:5000/api/stores', storeFormData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Store creation response:', response.data);
      
      // Update the token with the new one that includes storeId
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Update the user context with new token and user data
        if (response.data.user) {
          onLogin(response.data.user, response.data.token);
        }
      }
      
      setGeneratedStoreId(response.data.store.storeId);
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Store creation error:', err);
      setError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          p: 4,
          textAlign: 'center',
          color: 'white'
        }}>
          <Storefront sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Create Your Store
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Set up your store to start managing your business
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h6" sx={{ mb: 3 }}>
            Store Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Store Name"
                name="name"
                value={storeFormData.name}
                onChange={handleStoreChange}
                required
                placeholder="Enter your store name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={storeFormData.description}
                onChange={handleStoreChange}
                multiline
                rows={3}
                placeholder="Brief description of your store"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={storeFormData.address}
                onChange={handleStoreChange}
                required
                placeholder="Store address"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={storeFormData.phone}
                onChange={handleStoreChange}
                required
                placeholder="Store phone number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={storeFormData.email}
                onChange={handleStoreChange}
                required
                placeholder="Store email"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ px: 4, py: 1.5 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Storefront />}
              onClick={handleCreateStore}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
                }
              }}
            >
              {loading ? 'Creating Store...' : 'Create Store'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Storefront sx={{ mr: 1 }} />
            Store Created Successfully!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              🎉 Your store has been created!
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your Store ID: <strong>{generatedStoreId}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Share this ID with your employees so they can register and join your store management system.
            </Typography>
            <Button
              size="small"
              startIcon={<ContentCopy />}
              onClick={() => copyToClipboard(generatedStoreId)}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Copy Store ID
            </Button>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateStore;
