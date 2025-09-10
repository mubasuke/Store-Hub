const Supplier = require('../models/Supplier');

// Get all suppliers for a store
const getSuppliers = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const suppliers = await Supplier.find({ storeId: req.user.storeId })
      .sort({ createdAt: -1 });
    
    res.json({ suppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Failed to fetch suppliers' });
  }
};

// Get a single supplier by ID
const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json({ supplier });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Failed to fetch supplier' });
  }
};

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      contactPerson, 
      companyName, 
      taxId, 
      paymentTerms, 
      notes 
    } = req.body;
    
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const supplier = new Supplier({
      name,
      email,
      phone,
      address,
      contactPerson,
      companyName,
      taxId,
      paymentTerms,
      notes,
      storeId: req.user.storeId,
      createdBy: req.user.userId
    });
    
    await supplier.save();
    
    res.status(201).json({ 
      message: 'Supplier created successfully', 
      supplier 
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Failed to create supplier' });
  }
};

// Update supplier information
const updateSupplier = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      contactPerson, 
      companyName, 
      taxId, 
      paymentTerms, 
      notes, 
      isActive 
    } = req.body;
    
    const supplier = await Supplier.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    supplier.name = name || supplier.name;
    supplier.email = email || supplier.email;
    supplier.phone = phone || supplier.phone;
    supplier.address = address || supplier.address;
    supplier.contactPerson = contactPerson !== undefined ? contactPerson : supplier.contactPerson;
    supplier.companyName = companyName !== undefined ? companyName : supplier.companyName;
    supplier.taxId = taxId !== undefined ? taxId : supplier.taxId;
    supplier.paymentTerms = paymentTerms || supplier.paymentTerms;
    supplier.notes = notes !== undefined ? notes : supplier.notes;
    supplier.isActive = isActive !== undefined ? isActive : supplier.isActive;
    
    await supplier.save();
    
    res.json({ 
      message: 'Supplier updated successfully', 
      supplier 
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Failed to update supplier' });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    await Supplier.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Failed to delete supplier' });
  }
};

// Search suppliers
const searchSuppliers = async (req, res) => {
  try {
    const { query } = req.query;
    
    const suppliers = await Supplier.find({
      storeId: req.user.storeId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { companyName: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({ suppliers });
  } catch (error) {
    console.error('Error searching suppliers:', error);
    res.status(500).json({ message: 'Failed to search suppliers' });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  searchSuppliers
};
