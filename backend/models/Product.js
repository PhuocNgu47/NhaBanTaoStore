import mongoose from 'mongoose';

// Variant Schema - Nâng cấp với giá và stock riêng
const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: String, // "iPhone 15 Pro Max 256GB - Titanium"
  attributes: {
    color: String,
    storage: String,
    size: String,
    // Flexible - có thể thêm attributes khác
  },
  price: { type: Number, required: true }, // Giá riêng của variant
  originalPrice: Number,
  stock: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 }, // Stock đã reserve cho orders
  image: String, // Ảnh riêng của variant
  isActive: { type: Boolean, default: true }
}, { _id: true });

const productSchema = new mongoose.Schema({
  // Basic info
  product_id: String,        // optional external id
  sku: { type: String, unique: true },
  name: { type: String, required: true },
  slug: { type: String, unique: true }, // SEO-friendly URL
  brand: String,
  description: String,
  category: { type: String, required: true },
  subcategory: String,

  // Pricing (base price, variants có thể override)
  price: { type: Number, required: true },
  originalPrice: Number,
  discountPercentage: Number,
  currency: { type: String, default: 'VND' },
  
  // Variants - NÂNG CẤP
  variants: [variantSchema],

  // Media
  image: String,          // main image / thumbnail
  thumbnail: String,      // explicit thumbnail if provided
  images: [String],

  // Product details
  specifications: mongoose.Schema.Types.Mixed,
  tags: [String],
  warranty: String,
  returnPolicy: String,

  // Inventory (simple product-level stock)
  // Note: Variants can still be used; if variants are not used, `stock` will be used.
  stock: { type: Number, default: 0 },

  // Ratings & Reviews (moved to separate collection)
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  
  // Analytics
  viewCount: { type: Number, default: 0 },

  // Relations
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status
  status: { 
    type: String, 
    enum: ['draft', 'active', 'inactive'], 
    default: 'active'
  },
  featured: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Indexes
productSchema.index({ sku: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'variants.sku': 1 });
productSchema.index({ rating: -1, reviewCount: -1 });
productSchema.index({ status: 1 });

// Auto update updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Product', productSchema);
