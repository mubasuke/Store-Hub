const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, enum: ['Cashier', 'Manager', 'Sales Associate', 'Store Owner'] },
  salary: { type: Number, required: true },
  hireDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  address: { type: String },
  emergencyContact: { type: String },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
