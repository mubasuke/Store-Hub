const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  contactPerson: { type: String },
  companyName: { type: String },
  taxId: { type: String },
  paymentTerms: { type: String, default: 'Net 30' },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
