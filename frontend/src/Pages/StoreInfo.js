import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Button,
  Paper,
  Divider
} from '@mui/material';
import {
  Storefront,
  ContentCopy,
  Edit,
  LocationOn,
  Phone,
  Email,
  Business,
  QrCode
} from '@mui/icons-material';
import axios from 'axios';

const StoreInfo = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stores/my-store');
        setStore(response.data.store);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching store info:', err);
        if (err.response?.data?.message?.includes('No store associated')) {
          setError('No store found. Please create a store first.');
        } else {
          setError('Failed to load store information');
        }
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!store) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">No store information available.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box mb={4}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: '#1a237e',
            mb: 1
          }}
        >
          Store Information
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          View and manage your store details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Store Info Card */}
        <Grid item xs={12}>
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
                {store.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {store.description || 'No description available'}
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Store ID Section */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, background: '#f8f9fa', borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <QrCode sx={{ mr: 2, color: '#1a237e' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                        Store ID
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '1.1rem' }}>
                      <strong>{store.storeId}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Share this ID with your employees so they can register and join your store management system.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(store.storeId)}
                      sx={{ mr: 2 }}
                    >
                      Copy Store ID
                    </Button>
                  </Paper>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOn sx={{ mr: 2, color: '#2e7d32' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Address
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {store.address || 'No address provided'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Phone sx={{ mr: 2, color: '#1976d2' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Phone
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {store.phone || 'No phone provided'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Email sx={{ mr: 2, color: '#d32f2f' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Email
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {store.email || 'No email provided'}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Store Status */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, background: '#e8f5e8' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Business sx={{ mr: 2, color: '#2e7d32' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        Store Status
                      </Typography>
                    </Box>
                    <Chip 
                      label="Active" 
                      color="success" 
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Your store is currently active and operational.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box display="flex" gap={2} justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => navigate('/edit-store')}
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
                  Edit Store
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StoreInfo;
