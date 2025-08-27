import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './Components/Navbar/Navbar';
import Dashboard from './Pages/Dashboard';
import Products from './Pages/Products';
import Sales from './Pages/Sales';
import Employees from './Pages/Employees';
import LowStockAlerts from './Pages/LowStockAlerts';
import Login from './Pages/Login';
import Register from './Pages/Register';
import CreateStore from './Pages/CreateStore';
import StoreInfo from './Pages/StoreInfo';
import Customers from './Pages/Customers';
import Suppliers from './Pages/Suppliers';
import ProtectedRoute from './Components/ProtectedRoute';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import axios from 'axios';
import './App.css';

// Component that uses the theme context
const AppContent = () => {
  const { darkMode } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create dynamic theme based on dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#333333',
        secondary: darkMode ? '#b0b0b0' : '#666666',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode 
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
            boxShadow: darkMode 
              ? '0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
          },
        },
      },
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token with backend
      axios.get('http://localhost:5000/api/auth/me')
        .then(response => {
          setUser(response.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: theme.palette.background.default
        }}>
          <CssBaseline />
        </div>
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to={user?.role === 'store_owner' ? '/' : '/sales'} replace /> : 
                  <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                  <Navigate to={user?.role === 'store_owner' ? '/' : '/sales'} replace /> : 
                  <Register onLogin={handleLogin} />
              } 
            />

            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['store_owner']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products" 
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'employee']}>
                  <Products />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sales" 
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'employee']}>
                  <Sales />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute allowedRoles={['store_owner']}>
                  <Employees />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alerts" 
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'employee']}>
                  <LowStockAlerts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-store" 
              element={
                <ProtectedRoute allowedRoles={['store_owner']}>
                  <CreateStore onLogin={handleLogin} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/store-info" 
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'employee']}>
                  <StoreInfo />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'employee']}>
                  <Customers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/suppliers" 
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'employee']}>
                  <Suppliers />
                </ProtectedRoute>
              } 
            />


            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
