import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp } from '@mui/icons-material';
import axios from 'axios';

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/sales/revenue');
      setRevenueData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load revenue data');
      console.error('Error fetching revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!revenueData || !revenueData.dailyData || revenueData.dailyData.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box textAlign="center" py={4}>
            <TrendingUp sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No sales data available for the last 7 days
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start making sales to see revenue trends
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = revenueData.dailyData.map(item => ({
    ...item,
    date: formatDate(item._id),
    revenue: item.totalRevenue
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Revenue Trend (Last 7 Days)
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
            {formatCurrency(revenueData.totalRevenue)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Revenue • {revenueData.totalSalesCount} Sales
          </Typography>
        </Box>

        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2e7d32" 
                strokeWidth={3}
                dot={{ fill: '#2e7d32', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2e7d32', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
