import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  variantId: { type: mongoose.Schema.Types.ObjectId }, // Optional
  addedAt: { type: Date, default: Date.now }
});

// Indexes - Prevent duplicate
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });
wishlistSchema.index({ userId: 1, addedAt: -1 });

export default mongoose.model('Wishlist', wishlistSchema);

