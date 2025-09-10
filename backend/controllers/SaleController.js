const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Employee = require('../models/Employee');
const Customer = require('../models/Customer');
// Get all sales
const getSales = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
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
  const { items, customerName, customerId, discount, tax, paymentMethod, loyaltyPointsRedeemed } = req.body;
  
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    // Use the current user's ID as the employee ID
    const employeeId = req.user.userId;

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

    // Handle customer loyalty points and point-based discounts
    let customer = null;
    let loyaltyPointsEarned = 0;
    let pointBasedDiscount = 0;
    
    if (customerId) {
      customer = await Customer.findOne({ 
        _id: customerId, 
        storeId: req.user.storeId 
      });
      
      if (customer) {
        // Handle point-based discount redemption first
        if (loyaltyPointsRedeemed && loyaltyPointsRedeemed > 0) {
          if (customer.loyaltyPoints >= loyaltyPointsRedeemed) {
            // Calculate discount amount from points (1 point = $0.01)
            pointBasedDiscount = customer.calculateDiscountFromPoints(loyaltyPointsRedeemed);
            customer.loyaltyPoints -= loyaltyPointsRedeemed;
          } else {
            return res.status(400).json({ message: 'Insufficient loyalty points for redemption' });
          }
        }
      }
    }

    // Calculate final amount after all discounts
    const finalAmount = totalAmount - discount - pointBasedDiscount + tax;

    // Calculate points earned and update customer if customer exists
    if (customer) {
      // Calculate points earned on the final amount (after discounts)
      loyaltyPointsEarned = customer.calculatePointsEarned(finalAmount);
      
      // Update customer's total spent and last purchase date
      customer.totalSpent += finalAmount;
      customer.lastPurchaseDate = new Date();
      
      // Update membership level
      const newMembershipLevel = customer.calculateMembershipLevel();
      if (newMembershipLevel !== customer.membershipLevel) {
        customer.membershipLevel = newMembershipLevel;
      }
      
      // Add loyalty points
      customer.loyaltyPoints += loyaltyPointsEarned;
      
      await customer.save();
    }

    const newSale = new Sale({
      items: updatedItems,
      totalAmount,
      discount: (discount || 0) + pointBasedDiscount, // Include point-based discount in total discount
      tax: tax || 0,
      finalAmount,
      employeeId,
      customerName: customerName || 'Walk-in Customer',
      customerId: customerId || null,
      loyaltyPointsEarned,
      loyaltyPointsRedeemed: loyaltyPointsRedeemed || 0,
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
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
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
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
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
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
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

// Get revenue data for dashboard
const getRevenueData = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    // Get sales data for the last 7 days
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get sales data grouped by date
    const sales = await Sale.aggregate([
      {
        $match: {
          storeId: req.user.storeId,
          saleDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$saleDate'
            }
          },
          totalRevenue: { $sum: '$finalAmount' },
          totalSales: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Calculate total revenue
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
    const totalSalesCount = sales.reduce((sum, sale) => sum + sale.totalSales, 0);
    
    res.json({
      totalRevenue,
      totalSalesCount,
      dailyData: sales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSales,
  createSale,
  getSaleById,
  getLowStockProducts,
  deleteSale,
  getRevenueData
}; 