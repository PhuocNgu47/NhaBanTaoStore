import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true
  },
  variantId: { type: mongoose.Schema.Types.ObjectId }, // Optional
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Verify buyer
  
  // Review content
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5
  },
  title: String,
  comment: String,
  images: [String], // URLs từ cloud storage
  videos: [String], // Phase sau
  
  // Status & Moderation
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending'
  },
  rejectionReason: String,
  
  // Verified Buyer
  isVerifiedBuyer: { type: Boolean, default: false },
  
  // Helpful votes
  helpfulCount: { type: Number, default: 0 },
  helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Admin
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderatedAt: Date,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now, index: -1 },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
reviewSchema.index({ productId: 1 });
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // Prevent duplicate
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ isVerifiedBuyer: 1 });

// Auto update updatedAt
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Review', reviewSchema);

