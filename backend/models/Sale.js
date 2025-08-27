const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const saleSchema = new Schema({
  items: [saleItemSchema],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  customerName: { type: String, default: 'Walk-in Customer' },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  loyaltyPointsEarned: { type: Number, default: 0 },
  loyaltyPointsRedeemed: { type: Number, default: 0 },
  saleDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'Cash' },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true }
});

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale; 