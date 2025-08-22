import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Button
} from '@mui/material';
import {
  Inventory,
  ShoppingCart,
  People,
  Warning,
  Notifications,
  Storefront
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalEmployees: 0,
    lowStockCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasStore, setHasStore] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, salesRes, employeesRes, lowStockRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/sales'),
          axios.get('http://localhost:5000/api/employees'),
          axios.get('http://localhost:5000/api/products/alerts/low-stock')
        ]);

        setStats({
          totalProducts: productsRes.data.length,
          totalSales: salesRes.data.length,
          totalEmployees: employeesRes.data.length,
          lowStockCount: lowStockRes.data.length
        });
        setLoading(false);
      } catch (err) {
        // Check if the error is due to no store being associated
        if (err.response?.data?.message?.includes('No store associated')) {
          setHasStore(false);
          setError('You need to create a store first to access the dashboard.');
        } else {
          setError('Failed to load dashboard data');
        }
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!hasStore) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Storefront sx={{ fontSize: 80, mb: 2, opacity: 0.8 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Welcome to Store Management!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            You need to create your store first to start managing your business.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            Once you create your store, you'll get a unique Store ID that you can share with your employees 
            so they can register and join your store management system.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Storefront />}
            onClick={() => navigate('/create-store')}
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
                border: '2px solid rgba(255,255,255,0.5)'
              }
            }}
          >
            Create Your Store
          </Button>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const StatCard = ({ title, value, icon, color, gradient, subtitle }) => (
    <Card 
      sx={{ 
        height: '100%',
        background: gradient,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              color="white" 
              gutterBottom 
              variant="h6"
              sx={{ fontWeight: 500, opacity: 0.9 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              component="div"
              sx={{ fontWeight: 700, color: 'white' }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ color: 'white', opacity: 0.8, mt: 1 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: 'white', opacity: 0.9 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );



  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box mb={4}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            mb: 1
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          Welcome to your store management system. Here's what's happening today.
        </Typography>
      </Box>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<Inventory sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            subtitle="Items in inventory"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={stats.totalSales}
            icon={<ShoppingCart sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            subtitle="Transactions completed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Employees"
            value={stats.totalEmployees}
            icon={<People sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            subtitle="Active staff members"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount}
            icon={<Warning sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            subtitle="Need restocking"
          />
        </Grid>
      </Grid>

      {stats.lowStockCount > 0 && (
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4,
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            borderRadius: 3,
            border: '1px solid #ff9800'
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Notifications sx={{ color: '#e65100', mr: 2, fontSize: 28 }} />
            <Typography variant="h6" sx={{ color: '#e65100', fontWeight: 600 }}>
              Low Stock Alert
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: '#bf360c' }}>
            {stats.lowStockCount} product(s) are running low on stock and need immediate attention. 
            Check the Alerts page for detailed information and take action to restock these items.
          </Typography>
        </Paper>
      )}


    </Container>
  );
};

export default Dashboard; 