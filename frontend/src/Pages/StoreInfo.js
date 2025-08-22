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
  Divider,
  TextField
} from '@mui/material';
import {
  Storefront,
  ContentCopy,
  Edit,
  LocationOn,
  Phone,
  Email,
  Business,
  QrCode,
  Save,
  Cancel
} from '@mui/icons-material';
import axios from 'axios';

const StoreInfo = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }

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

    fetchData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setFormData({
      name: store.name || '',
      description: store.description || '',
      address: store.address || '',
      phone: store.phone || '',
      email: store.email || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      setError('Store name is required');
      return;
    }
    
    if (!formData.address.trim()) {
      setError('Store address is required');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('Store phone is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Store email is required');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      await axios.put('http://localhost:5000/api/stores', formData);
      // Update local store data
      setStore(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
      alert('Store information updated successfully!');
    } catch (err) {
      console.error('Store update error:', err);
      setError(err.response?.data?.message || 'Failed to update store information');
    } finally {
      setSaving(false);
    }
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
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Box mb={4}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
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
               {isEditing ? (
                 <Box sx={{ mb: 2 }}>
                   <TextField
                     fullWidth
                     name="name"
                     value={formData.name}
                     onChange={handleInputChange}
                     required
                     placeholder="Store name"
                     sx={{
                       '& .MuiOutlinedInput-root': {
                         color: 'white',
                         '& fieldset': {
                           borderColor: 'rgba(255, 255, 255, 0.3)',
                         },
                         '&:hover fieldset': {
                           borderColor: 'rgba(255, 255, 255, 0.5)',
                         },
                         '&.Mui-focused fieldset': {
                           borderColor: 'white',
                         },
                       },
                       '& .MuiInputLabel-root': {
                         color: 'rgba(255, 255, 255, 0.7)',
                       },
                       '& .MuiInputBase-input': {
                         color: 'white',
                         fontSize: '2rem',
                         fontWeight: 700,
                         textAlign: 'center',
                       },
                     }}
                   />
                   <TextField
                     fullWidth
                     name="description"
                     value={formData.description}
                     onChange={handleInputChange}
                     multiline
                     rows={2}
                     placeholder="Store description"
                     sx={{
                       mt: 1,
                       '& .MuiOutlinedInput-root': {
                         color: 'white',
                         '& fieldset': {
                           borderColor: 'rgba(255, 255, 255, 0.3)',
                         },
                         '&:hover fieldset': {
                           borderColor: 'rgba(255, 255, 255, 0.5)',
                         },
                         '&.Mui-focused fieldset': {
                           borderColor: 'white',
                         },
                       },
                       '& .MuiInputLabel-root': {
                         color: 'rgba(255, 255, 255, 0.7)',
                       },
                       '& .MuiInputBase-input': {
                         color: 'white',
                         opacity: 0.9,
                         textAlign: 'center',
                       },
                     }}
                   />
                 </Box>
               ) : (
                 <>
                   <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                     {store.name}
                   </Typography>
                   <Typography variant="body1" sx={{ opacity: 0.9 }}>
                     {store.description || 'No description available'}
                   </Typography>
                 </>
               )}
             </Box>

                     <CardContent sx={{ p: 4 }}>
           {error && (
             <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
               {error}
             </Alert>
           )}
           <Grid container spacing={3}>
                {/* Store ID Section */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, background: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <QrCode sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Store ID
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '1.1rem', color: 'text.primary' }}>
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
                  <Paper sx={{ p: 3, height: '100%', background: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOn sx={{ mr: 2, color: 'success.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Address
                      </Typography>
                    </Box>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Store address"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1">
                        {store.address || 'No address provided'}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%', background: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Phone sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Phone
                      </Typography>
                    </Box>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Store phone number"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1">
                        {store.phone || 'No phone provided'}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 3, background: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Email sx={{ mr: 2, color: 'error.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Email
                      </Typography>
                    </Box>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Store email"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1">
                        {store.email || 'No email provided'}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Store Status */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, background: 'success.light', border: '1px solid', borderColor: 'success.main' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Business sx={{ mr: 2, color: 'success.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
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
                {!isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/')}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Back to Dashboard
                    </Button>
                    {user?.role === 'store_owner' && (
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
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
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      startIcon={<Cancel />}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleSave}
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
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StoreInfo;
