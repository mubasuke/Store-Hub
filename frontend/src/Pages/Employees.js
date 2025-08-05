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
  IconButton,
  Alert,
  Box,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  People,
  CheckCircle,
  Cancel,
  Work,
  AttachMoney
} from '@mui/icons-material';
import axios from 'axios';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    salary: '',
    address: '',
    emergencyContact: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load employees');
      setLoading(false);
    }
  };

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        salary: employee.salary.toString(),
        address: employee.address || '',
        emergencyContact: employee.emergencyContact || ''
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        salary: '',
        address: '',
        emergencyContact: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async () => {
    try {
      const employeeData = {
        ...formData,
        salary: parseFloat(formData.salary)
      };

      if (editingEmployee) {
        await axios.put(`http://localhost:5000/api/employees/${editingEmployee._id}`, employeeData);
      } else {
        await axios.post('http://localhost:5000/api/employees', employeeData);
      }

      fetchEmployees();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Store Owner':
        return 'error';
      case 'Manager':
        return 'warning';
      case 'Cashier':
        return 'info';
      case 'Sales Associate':
        return 'success';
      default:
        return 'default';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const activeEmployees = employees.filter(emp => emp.isActive);
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e' }}>
            Employee Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Manage your team members and their information
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
            boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0d47a1 30%, #1a237e 90%)',
            }
          }}
        >
          Add Employee
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Total Employees
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {employees.length}
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: 3,
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Active Employees
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {activeEmployees.length}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            borderRadius: 3,
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Total Salary
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    ${totalSalary.toLocaleString()}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Salary</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Hire Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee._id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: getRoleColor(employee.role) + '.main',
                            width: 40,
                            height: 40
                          }}
                        >
                          {getInitials(employee.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {employee.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.role}
                        color={getRoleColor(employee.role)}
                        size="small"
                        icon={<Work />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        ${employee.salary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.isActive ? 'Active' : 'Inactive'}
                        color={employee.isActive ? 'success' : 'default'}
                        size="small"
                        icon={employee.isActive ? <CheckCircle /> : <Person />}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit Employee">
                        <IconButton onClick={() => handleOpenDialog(employee)} color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Employee">
                        <IconButton onClick={() => handleDelete(employee._id)} color="error">
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Person sx={{ mr: 1, color: '#1a237e' }} />
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter employee's full name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="employee@company.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="(555) 123-4567"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <MenuItem value="Cashier">Cashier</MenuItem>
                  <MenuItem value="Sales Associate">Sales Associate</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Store Owner">Store Owner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
                InputProps={{ 
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
                placeholder="0.00"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                multiline
                rows={2}
                placeholder="Enter employee's address"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="Name and phone number"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
              }
            }}
          >
            {editingEmployee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employees; 