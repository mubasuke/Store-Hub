import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Divider,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Store,
  PersonAdd,
  Business,
  ContentCopy,
  Storefront
} from '@mui/icons-material';
import axios from 'axios';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    storeId: ''
  });
  const [storeFormData, setStoreFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedStoreId, setGeneratedStoreId] = useState('');
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [storeValidation, setStoreValidation] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStoreChange = (e) => {
    setStoreFormData({
      ...storeFormData,
      [e.target.name]: e.target.value
    });
  };

  const validateStoreId = async (storeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stores/by-store-id/${storeId}`);
      setStoreValidation({
        valid: true,
        store: response.data.store
      });
    } catch (err) {
      setStoreValidation({
        valid: false,
        message: 'Invalid store ID. Please check with your store owner.'
      });
    }
  };

  const handleStoreIdChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      storeId: value
    });
    
    // Clear validation when user starts typing
    setStoreValidation(null);
    
    // Validate store ID if it's long enough
    if (value.length >= 10) {
      validateStoreId(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Validate storeId for employees
    if (formData.role === 'employee' && !formData.storeId.trim()) {
      setError('Store ID is required for employee registration');
      setLoading(false);
      return;
    }

    // Validate storeId for employees
    if (formData.role === 'employee' && storeValidation && !storeValidation.valid) {
      setError('Invalid store ID. Please check with your store owner.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        storeId: formData.role === 'employee' ? formData.storeId : undefined
      });
      
      // Use the onLogin prop to handle authentication
      onLogin(response.data.user, response.data.token);
      
      // Show store creation dialog for store owners
      if (response.data.user.role === 'store_owner') {
        setShowStoreDialog(true);
      } else {
        navigate('/sales'); // Employees start at sales page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/stores', storeFormData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setGeneratedStoreId(response.data.store.storeId);
      setShowStoreDialog(false);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
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
          <Store sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Create Account
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Join the store management system
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {generatedStoreId && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🎉 Store Created Successfully!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your Store ID: <strong>{generatedStoreId}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Share this ID with your employees so they can register and join your store.
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
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Choose a username"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your email"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Account Type"
                    startAdornment={
                      <InputAdornment position="start">
                        <Business color="action" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="employee">
                      <Box display="flex" alignItems="center">
                        <Person sx={{ mr: 1 }} />
                        Employee
                      </Box>
                    </MenuItem>
                    <MenuItem value="store_owner">
                      <Box display="flex" alignItems="center">
                        <Store sx={{ mr: 1 }} />
                        Store Owner
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.role === 'employee' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Store ID"
                    name="storeId"
                    value={formData.storeId}
                    onChange={handleStoreIdChange}
                    required
                    helperText="Enter the Store ID provided by your store owner"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Store color="action" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Enter your store ID"
                  />
                  {storeValidation && (
                    <Box sx={{ mt: 1 }}>
                      {storeValidation.valid ? (
                        <Chip
                          icon={<Storefront />}
                          label={`Valid Store: ${storeValidation.store.name}`}
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label={storeValidation.message}
                          color="error"
                          size="small"
                        />
                      )}
                    </Box>
                  )}
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Create a password"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Confirm your password"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Already have an account?
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Store Creation Dialog */}
      <Dialog open={showStoreDialog} onClose={() => setShowStoreDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Storefront sx={{ mr: 1 }} />
            Create Your Store
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Please provide your store information to complete the registration.
          </Typography>
          <Grid container spacing={2}>
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
                rows={2}
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
                placeholder="Store email"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStoreDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateStore} 
            variant="contained"
            startIcon={<Storefront />}
          >
            Create Store
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register; 