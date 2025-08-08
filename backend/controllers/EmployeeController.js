const Employee = require('../models/Employee');

// Get all employees
const getEmployees = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const employees = await Employee.find({ storeId: req.user.storeId }).sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const employee = await Employee.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  const { name, email, phone, role, salary, address, emergencyContact } = req.body;
  
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const newEmployee = new Employee({
      name,
      email,
      phone,
      role,
      salary,
      address,
      emergencyContact,
      storeId: req.user.storeId
    });
    
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const employee = await Employee.findOne({ 
      _id: id, 
      storeId: req.user.storeId 
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const employee = await Employee.findOneAndDelete({ 
      _id: id, 
      storeId: req.user.storeId 
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employees by role
const getEmployeesByRole = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const { role } = req.params;
    const employees = await Employee.find({ 
      role, 
      storeId: req.user.storeId 
    }).sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByRole
}; 