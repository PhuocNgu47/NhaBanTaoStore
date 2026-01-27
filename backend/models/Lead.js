import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  // Unique guest ID stored in browser localStorage
  guestId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Contact information (captured from forms)
  info: {
    name: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null }
  },

  // Array of viewed products
  viewedProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  // Interest score by category (e.g., { "Laptop": 5, "Mouse": 1 })
  interestScore: {
    type: Map,
    of: Number,
    default: {}
  },

  // Top interest category
  topInterest: {
    type: String,
    default: null
  },

  // Tags (e.g., "High Spender")
  tags: [{
    type: String
  }],

  // Last active timestamp
  lastActive: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
leadSchema.index({ 'info.phone': 1 });
leadSchema.index({ 'info.email': 1 });
leadSchema.index({ lastActive: -1 });
leadSchema.index({ createdAt: -1 });

// Auto update updatedAt
leadSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Lead', leadSchema);
