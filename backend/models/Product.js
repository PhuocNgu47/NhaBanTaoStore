import mongoose from 'mongoose';

// Variant Schema - Nâng cấp với type, model, giá và stock riêng
const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: String, // "Nguyên Seal Wifi 256GB - Xám"
  
  // Type: Nguyên Seal / Openbox / CPO
  type: { 
    type: String, 
    enum: ['nguyen-seal', 'openbox', 'cpo'],
    default: 'nguyen-seal'
  },
  
  // Model: Wifi / Wifi+Cellular (for iPad)
  model: { 
    type: String, 
    enum: ['wifi', 'wifi-cellular'],
    default: 'wifi'
  },
  
  attributes: {
    color: String,
    storage: String,
    size: String,
    memory: String, // RAM for MacBook
    chip: String,
    // Flexible - có thể thêm attributes khác
  },
  price: { type: Number, required: true }, // Giá riêng của variant
  originalPrice: Number,
  costPrice: Number, // Giá vốn
  stock: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 }, // Stock đã reserve cho orders
  lowStockThreshold: { type: Number, default: 5 },
  image: String, // Ảnh riêng của variant
  images: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false } // Variant mặc định hiển thị
}, { _id: true, timestamps: true });

const productSchema = new mongoose.Schema({
  // Basic info
  product_id: String,        // optional external id
  sku: { type: String, unique: true },
  name: { type: String, required: true },
  slug: { type: String, unique: true }, // SEO-friendly URL
  brand: String,
  description: String,
  shortDescription: String,
  category: { type: String, required: true },
  subcategory: String,
  productLine: String,

  // Pricing (tự động tính từ variants nếu có)
  price: { type: Number, default: 0 },
  maxPrice: { type: Number },
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
  highlights: [String],
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

// Auto update updatedAt and calculate price from variants
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto calculate price, maxPrice, stock from variants
  if (this.variants && this.variants.length > 0) {
    const activeVariants = this.variants.filter(v => v.isActive !== false);
    if (activeVariants.length > 0) {
      const prices = activeVariants.map(v => v.price).filter(p => p > 0);
      if (prices.length > 0) {
        this.price = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
      }
      this.stock = activeVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }
  }
  
  next();
});

export default mongoose.model('Product', productSchema);
