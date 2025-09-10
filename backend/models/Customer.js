const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  loyaltyPoints: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  membershipLevel: { 
    type: String, 
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], 
    default: 'Bronze' 
  },
  isActive: { type: Boolean, default: true },
  joinDate: { type: Date, default: Date.now },
  lastPurchaseDate: { type: Date },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Calculate membership level based on total spent
customerSchema.methods.calculateMembershipLevel = function() {
  if (this.totalSpent >= 10000) return 'Platinum';
  if (this.totalSpent >= 5000) return 'Gold';
  if (this.totalSpent >= 2000) return 'Silver';
  return 'Bronze';
};

// Calculate discount percentage based on membership level
customerSchema.methods.getDiscountPercentage = function() {
  switch (this.membershipLevel) {
    case 'Platinum': return 15;
    case 'Gold': return 12;
    case 'Silver': return 8;
    case 'Bronze': return 5;
    default: return 0;
  }
};

// Calculate points earned for a purchase amount
customerSchema.methods.calculatePointsEarned = function(purchaseAmount) {
  const pointsPerDollar = this.membershipLevel === 'Platinum' ? 2 : 
                         this.membershipLevel === 'Gold' ? 1.5 : 
                         this.membershipLevel === 'Silver' ? 1.2 : 1;
  return Math.floor(purchaseAmount * pointsPerDollar);
};

// Check if customer is eligible for discount based on points
customerSchema.methods.getDiscountEligibility = function() {
  const discountTiers = [
    { points: 100, discount: 5, description: '5% discount' },
    { points: 250, discount: 10, description: '10% discount' },
    { points: 500, discount: 15, description: '15% discount' },
    { points: 1000, discount: 20, description: '20% discount' }
  ];

  // Find the highest tier the customer qualifies for
  let eligibleTier = null;
  for (let i = discountTiers.length - 1; i >= 0; i--) {
    if (this.loyaltyPoints >= discountTiers[i].points) {
      eligibleTier = discountTiers[i];
      break;
    }
  }

  return eligibleTier;
};

// Calculate how many points are needed for next discount tier
customerSchema.methods.getPointsToNextTier = function() {
  const discountTiers = [100, 250, 500, 1000];
  
  for (const tier of discountTiers) {
    if (this.loyaltyPoints < tier) {
      return tier - this.loyaltyPoints;
    }

  }
  
  return 0; // Customer has reached the highest tier
};

// Calculate discount amount based on points redeemed
customerSchema.methods.calculateDiscountFromPoints = function(pointsToRedeem) {
  // 1 point = $0.01 discount (100 points = $1.00 discount)
  return Math.min(pointsToRedeem * 0.01, this.loyaltyPoints * 0.01);
};

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;

