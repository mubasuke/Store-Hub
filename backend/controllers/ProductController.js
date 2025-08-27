const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    // Filter products by store
    const products = await Product.find({ storeId: req.user.storeId }).sort({ name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const product = await Product.findOne({ 
      _id: req.params.id, 
      storeId: req.user.storeId 
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addProduct = async (req, res) => {
  const { name, description, price, quantity, category, supplier, lowStockThreshold } = req.body;
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const newProduct = new Product({ 
      name, 
      description, 
      price, 
      quantity, 
      category,
      supplier,
      lowStockThreshold: lowStockThreshold || 5,
      isLowStock: quantity <= (lowStockThreshold || 5),
      storeId: req.user.storeId
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const product = await Product.findOne({ 
      _id: id, 
      storeId: req.user.storeId 
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedData = { ...req.body };
    if (updatedData.quantity !== undefined) {
      updatedData.isLowStock = updatedData.quantity <= (updatedData.lowStockThreshold || product.lowStockThreshold);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user has a storeId
    if (!req.user.storeId) {
      return res.status(400).json({ 
        message: 'No store associated with this account. Please create a store first.' 
      });
    }
    
    const product = await Product.findOneAndDelete({ 
      _id: id, 
      storeId: req.user.storeId 
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};