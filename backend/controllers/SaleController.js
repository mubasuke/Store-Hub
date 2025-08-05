const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Employee = require('../models/Employee');

// Get all sales
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ storeId: req.user.storeId })
      .populate('items.product', 'name price')
      .populate('employeeId', 'name role')
      .sort({ saleDate: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new sale
const createSale = async (req, res) => {
  const { items, employeeId, customerName, discount, tax, paymentMethod } = req.body;
  
  try {
    // Validate employee exists and belongs to this store
    const employee = await Employee.findOne({ 
      _id: employeeId, 
      storeId: req.user.storeId 
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate totals and validate stock
    let totalAmount = 0;
    const updatedItems = [];
    const lowStockAlerts = [];

    for (const item of items) {
      const product = await Product.findOne({ 
        _id: item.product, 
        storeId: req.user.storeId 
      });
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const subtotal = item.price * item.quantity;
      totalAmount += subtotal;
      updatedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        subtotal: subtotal
      });

      // Update product quantity
      const newQuantity = product.quantity - item.quantity;
      await Product.findByIdAndUpdate(item.product, { 
        quantity: newQuantity,
        isLowStock: newQuantity <= product.lowStockThreshold
      });

      // Check for low stock alert
      if (newQuantity <= product.lowStockThreshold) {
        lowStockAlerts.push({
          productId: item.product,
          productName: product.name,
          currentStock: newQuantity,
          threshold: product.lowStockThreshold
        });
      }
    }

    const finalAmount = totalAmount - discount + tax;

    const newSale = new Sale({
      items: updatedItems,
      totalAmount,
      discount: discount || 0,
      tax: tax || 0,
      finalAmount,
      employeeId,
      customerName: customerName || 'Walk-in Customer',
      paymentMethod: paymentMethod || 'Cash',
      storeId: req.user.storeId
    });

    await newSale.save();

    res.status(201).json({
      sale: newSale,
      lowStockAlerts: lowStockAlerts.length > 0 ? lowStockAlerts : null
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get sale by ID
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    })
      .populate('items.product', 'name price')
      .populate('employeeId', 'name role');
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ 
      isLowStock: true, 
      storeId: req.user.storeId 
    }).sort({ quantity: 1 });
    res.json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a sale and restore product quantities
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Restore product quantities
    for (const item of sale.items) {
      const product = await Product.findOne({ 
        _id: item.product, 
        storeId: req.user.storeId 
      });
      if (product) {
        const newQuantity = product.quantity + item.quantity;
        await Product.findByIdAndUpdate(item.product, {
          quantity: newQuantity,
          isLowStock: newQuantity <= product.lowStockThreshold
        });
      }
    }

    // Delete the sale
    await Sale.findByIdAndDelete(req.params.id);

    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSales,
  createSale,
  getSaleById,
  getLowStockProducts,
  deleteSale
}; 