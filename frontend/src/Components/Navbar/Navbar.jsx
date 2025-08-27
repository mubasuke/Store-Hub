import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  Warning,
  Store,
  Notifications,
  Logout,
  AccountCircle,
  Person,
  Storefront,
  Loyalty,
  Business
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import DarkModeToggle from '../DarkModeToggle';
import axios from 'axios';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [lowStockCount, setLowStockCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/alerts/low-stock');
        setLowStockCount(response.data.length);
      } catch (err) {
        console.error('Failed to fetch low stock count');
      }
    };

    fetchLowStockCount();
    const interval = setInterval(fetchLowStockCount, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
    navigate('/login');
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: '/sales', label: 'Sales', icon: <ShoppingCart /> },
      { path: '/products', label: 'Products', icon: <Inventory /> },
      { 
        path: '/alerts', 
        label: 'Alerts', 
        icon: <Warning />,
        badge: lowStockCount > 0 ? lowStockCount : null
      },
      { path: '/customers', label: 'Customers', icon: <Loyalty /> },
      { path: '/suppliers', label: 'Suppliers', icon: <Business /> },
      { path: '/store-info', label: 'Store Info', icon: <Storefront /> }
    ];

    // Add store owner specific items
    if (user?.role === 'store_owner') {
      return [
        { path: '/', label: 'Dashboard', icon: <Dashboard /> },
        ...baseItems,
        { path: '/employees', label: 'Employees', icon: <People /> }
      ];
    }

    // Employee sees sales, products, alerts, customers, suppliers, purchase orders, and store info
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: darkMode 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 0, mr: 4 }}>
          <Avatar 
            sx={{ 
              mr: 2, 
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 40,
              height: 40
            }}
          >
            <Store />
          </Avatar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Store Management
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: 'white',
                backgroundColor: location.pathname === item.path 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'transparent',
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: location.pathname === item.path ? 600 : 400,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                },
                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.badge ? (
                <Badge 
                  badgeContent={item.badge} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#f44336',
                      color: 'white',
                      fontWeight: 600
                    }
                  }}
                >
                  {item.label}
                </Badge>
              ) : (
                item.label
              )}
            </Button>
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {/* Dark Mode Toggle */}
          <DarkModeToggle 
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          />

          {lowStockCount > 0 && (
            <Chip
              icon={<Notifications />}
              label={`${lowStockCount} alerts`}
              color="warning"
              variant="filled"
              sx={{
                backgroundColor: '#ff9800',
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          )}

          <IconButton
            onClick={handleMenuOpen}
            sx={{ color: 'white' }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'rgba(255,255,255,0.2)'
              }}
            >
              {user?.role === 'store_owner' ? <Store /> : <Person />}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <Logout sx={{ mr: 2, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
