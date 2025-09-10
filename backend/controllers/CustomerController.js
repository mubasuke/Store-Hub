const Customer = require('../models/Customer');
const Sale = require('../models/Sale');

// Get all customers for a store
const getCustomers = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const customers = await Customer.find({ storeId: req.user.storeId })
      .sort({ createdAt: -1 });
    
    // Add discount eligibility information to each customer
    const customersWithEligibility = customers.map(customer => {
      const customerObj = customer.toObject();
      customerObj.discountEligibility = customer.getDiscountEligibility();
      customerObj.pointsToNextTier = customer.getPointsToNextTier();
      return customerObj;
    });
    
    res.json({ customers: customersWithEligibility });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
};

// Get a single customer by ID
const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Add discount eligibility information
    const customerObj = customer.toObject();
    customerObj.discountEligibility = customer.getDiscountEligibility();
    customerObj.pointsToNextTier = customer.getPointsToNextTier();
    
    res.json({ customer: customerObj });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Failed to fetch customer' });
  }
};

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    console.log('Creating customer with data:', { name, email, phone, address });
    console.log('User info:', { userId: req.user.userId, role: req.user.role, storeId: req.user.storeId });
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        message: 'Name, email, and phone are required fields' 
      });
    }
    
    // Check if user has a storeId
    if (!req.user.storeId) {
      console.log('No storeId found for user:', req.user.userId);
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    // Check if customer with same email already exists
    const existingCustomer = await Customer.findOne({ 
      email, 
      storeId: req.user.storeId 
    });
    
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }
    
    const customer = new Customer({
      name,
      email,
      phone,
      address: address || '',
      storeId: req.user.storeId,
      createdBy: req.user.userId
    });
    
    await customer.save();
    
    res.status(201).json({ 
      message: 'Customer created successfully', 
      customer 
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Customer with this email already exists' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error: ' + errors.join(', ') 
      });
    }
    
    res.status(500).json({ message: 'Failed to create customer' });
  }
};

// Update customer information
const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, isActive } = req.body;
    
    const customer = await Customer.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ 
        email, 
        storeId: req.user.storeId,
        _id: { $ne: req.params.id }
      });
      
      if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this email already exists' });
      }
    }
    
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.address = address !== undefined ? address : customer.address;
    customer.isActive = isActive !== undefined ? isActive : customer.isActive;
    
    await customer.save();
    
    res.json({ 
      message: 'Customer updated successfully', 
      customer 
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Failed to update customer' });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    await Customer.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Failed to delete customer' });
  }
};

// Get customer purchase history
const getCustomerHistory = async (req, res) => {
  try {
    const customer = await Customer.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const sales = await Sale.find({ 
      customerId: req.params.id,
      storeId: req.user.storeId 
    })
    .populate('items.product')
    .populate('employeeId', 'name')
    .sort({ saleDate: -1 });
    
    // Add discount eligibility information
    const customerObj = customer.toObject();
    customerObj.discountEligibility = customer.getDiscountEligibility();
    customerObj.pointsToNextTier = customer.getPointsToNextTier();
    
    res.json({ 
      customer: customerObj, 
      sales,
      totalPurchases: sales.length,
      totalSpent: customer.totalSpent,
      loyaltyPoints: customer.loyaltyPoints,
      membershipLevel: customer.membershipLevel
    });
  } catch (error) {
    console.error('Error fetching customer history:', error);
    res.status(500).json({ message: 'Failed to fetch customer history' });
  }
};

// Add loyalty points to customer
const addLoyaltyPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;
    
    const customer = await Customer.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    customer.loyaltyPoints += points;
    await customer.save();
    
    res.json({ 
      message: 'Loyalty points added successfully', 
      customer,
      pointsAdded: points,
      reason
    });
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    res.status(500).json({ message: 'Failed to add loyalty points' });
  }
};

// Redeem loyalty points
const redeemLoyaltyPoints = async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;
    
    const customer = await Customer.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    if (customer.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ message: 'Insufficient loyalty points' });
    }
    
    customer.loyaltyPoints -= pointsToRedeem;
    await customer.save();
    
    res.json({ 
      message: 'Loyalty points redeemed successfully', 
      customer,
      pointsRedeemed: pointsToRedeem
    });
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    res.status(500).json({ message: 'Failed to redeem loyalty points' });
  }
};

// Search customers
const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;
    
    const customers = await Customer.find({
      storeId: req.user.storeId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    // Add discount eligibility information to each customer
    const customersWithEligibility = customers.map(customer => {
      const customerObj = customer.toObject();
      customerObj.discountEligibility = customer.getDiscountEligibility();
      customerObj.pointsToNextTier = customer.getPointsToNextTier();
      return customerObj;
    });
    
    res.json({ customers: customersWithEligibility });
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({ message: 'Failed to search customers' });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerHistory,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  searchCustomers
};
