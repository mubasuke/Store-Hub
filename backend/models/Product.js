const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  lowStockThreshold: { type: Number, default: 5 },
  isLowStock: { type: Boolean, default: false },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true }
});

module.exports = mongoose.model('Product', productSchema);