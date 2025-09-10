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
  paymentTerms: { 
    type: String, 
    enum: ['Net 30', 'Net 60', 'Net 90', 'Cash on Delivery', 'Advance Payment', '2/10 Net 30', '1/15 Net 45', 'Due on Receipt'],
    default: 'Net 30' 
  },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
