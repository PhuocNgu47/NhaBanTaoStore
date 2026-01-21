import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  variantId: { type: mongoose.Schema.Types.ObjectId }, // Variant cụ thể
  quantity: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    index: true 
  }, // null nếu guest
  sessionId: String, // Cho guest cart
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date } // Tự động xóa sau 30 ngày
});

// Indexes
cartSchema.index({ userId: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Auto update updatedAt
cartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  // Set expiresAt nếu chưa có (30 ngày)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.model('Cart', cartSchema);

