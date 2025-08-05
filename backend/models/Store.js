const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  address: { 
    type: String,
    trim: true
  },
  phone: { 
    type: String,
    trim: true
  },
  email: { 
    type: String,
    trim: true,
    lowercase: true
  },
  storeId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  ownerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
storeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Store = mongoose.model('Store', storeSchema);
module.exports = Store; 