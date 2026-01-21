# 📐 THIẾT KẾ SCHEMA MONGODB - CODE REFERENCE

File này chứa code schema MongoDB chi tiết để implement trực tiếp.

---

## 📦 1. PRODUCT MODEL (Updated)

```javascript
// models/Product.js
import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: String, // "iPhone 15 Pro Max 256GB - Titanium"
  attributes: {
    color: String,
    storage: String,
    size: String,
    // Flexible - có thể thêm attributes khác
  },
  price: { type: Number, required: true },
  originalPrice: Number,
  stock: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 }, // Stock đã reserve
  image: String, // Ảnh riêng của variant
  isActive: { type: Boolean, default: true }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  sku: { type: String, unique: true, index: true },
  brand: String,
  description: String,
  category: { type: String, required: true, index: true },
  subcategory: String,
  
  // Pricing (base price, variants có thể override)
  price: { type: Number, required: true },
  originalPrice: Number,
  discountPercentage: Number,
  currency: { type: String, default: 'VND' },
  
  // Variants - NÂNG CẤP
  variants: [variantSchema],
  
  // Media
  image: String,
  thumbnail: String,
  images: [String],
  
  // Product details
  specifications: mongoose.Schema.Types.Mixed,
  tags: [String],
  warranty: String,
  returnPolicy: String,
  
  // Ratings & Reviews (moved to separate collection)
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  
  // Analytics
  viewCount: { type: Number, default: 0 },
  
  // Relations
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Status
  status: { 
    type: String, 
    enum: ['draft', 'active', 'inactive'], 
    default: 'active',
    index: true
  },
  featured: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Indexes
productSchema.index({ category: 1, status: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ 'variants.sku': 1 });
productSchema.index({ rating: -1, reviewCount: -1 });

// Auto update updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Product', productSchema);
```

---

## 💬 2. REVIEW MODEL (New)

```javascript
// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true, 
    index: true 
  },
  variantId: { type: mongoose.Schema.Types.ObjectId }, // Optional
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Verify buyer
  
  // Review content
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5, 
    index: true 
  },
  title: String,
  comment: String,
  images: [String], // URLs từ cloud storage
  videos: [String], // Phase sau
  
  // Status & Moderation
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending',
    index: true
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
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // Prevent duplicate
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerifiedBuyer: 1 });

// Auto update updatedAt
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Review', reviewSchema);
```

---

## 🛒 3. CART MODEL (New)

```javascript
// models/Cart.js
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
```

---

## ❤️ 4. WISHLIST MODEL (New)

```javascript
// models/Wishlist.js
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
```

---

## 📦 5. ORDER MODEL (Updated)

```javascript
// models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  variantId: { type: mongoose.Schema.Types.ObjectId }, // Variant cụ thể
  productName: String, // Snapshot
  variantName: String, // Snapshot
  sku: String, // Snapshot
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price tại thời điểm order
  subtotal: Number
}, { _id: true });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, index: true },
  
  // Customer
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  guestEmail: String,
  guestPhone: String,
  
  // Items - CẬP NHẬT để hỗ trợ variants
  items: [orderItemSchema],
  
  // Pricing
  subtotal: Number,
  discountAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Coupon
  couponCode: String,
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  
  // Shipping Address
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    ward: String,
    wardCode: String,
    district: { type: String, required: true },
    districtCode: String,
    city: { type: String, required: true },
    cityCode: String,
    country: { type: String, default: 'Vietnam' },
    zipCode: String,
    coordinates: { lat: Number, lng: Number }
  },
  
  // Payment
  paymentMethod: { 
    type: String, 
    enum: ['cod', 'bank_transfer', 'momo', 'zalopay', 'vnpay', 'stripe'],
    default: 'cod'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentDetails: {
    gateway: String,
    transactionId: String,
    referenceCode: String,
    amount: Number,
    content: String,
    paidAt: Date
  },
  paidAt: Date,
  
  // Order Status - MỞ RỘNG
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending',
    index: true
  },
  
  // Status History
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    trackingNumber: String
  }],
  
  // Cancellation
  cancellationReason: String,
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancelledAt: Date,
  
  // Shipping
  trackingNumber: String,
  shippingCompany: String,
  shippedAt: Date,
  deliveredAt: Date,
  
  // Return/Refund
  returnReason: String,
  returnRequestedAt: Date,
  refundAmount: Number,
  refundedAt: Date,
  
  // Notes
  notes: [{
    note: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false } // Admin-only
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now, index: -1 },
  updatedAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  processingAt: Date
});

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'items.productId': 1 });

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `${Date.now()}`;
  }
  
  // Track status changes
  if (this.isModified('status')) {
    if (!this.statusHistory) {
      this.statusHistory = [];
    }
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
      updatedBy: this.userId
    });
    
    // Set timestamps based on status
    const now = new Date();
    if (this.status === 'confirmed' && !this.confirmedAt) {
      this.confirmedAt = now;
    }
    if (this.status === 'processing' && !this.processingAt) {
      this.processingAt = now;
    }
    if (this.status === 'shipped' && !this.shippedAt) {
      this.shippedAt = now;
    }
    if (this.status === 'delivered' && !this.deliveredAt) {
      this.deliveredAt = now;
    }
    if (this.status === 'cancelled' && !this.cancelledAt) {
      this.cancelledAt = now;
    }
    if (this.status === 'refunded' && !this.refundedAt) {
      this.refundedAt = now;
    }
  }
  
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Order', orderSchema);
```

---

## 🎟️ 6. COUPON MODEL (Updated)

```javascript
// models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    unique: true, 
    uppercase: true, 
    trim: true,
    index: true
  },
  name: { type: String, required: true, trim: true },
  description: String,
  
  // Discount
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountValue: { type: Number, required: true, min: 0 },
  minPurchaseAmount: { type: Number, default: 0, min: 0 },
  maxDiscountAmount: Number, // null = no limit
  
  // Usage
  usageLimit: Number, // null = unlimited
  usedCount: { type: Number, default: 0 },
  usagePerUser: { type: Number, default: 1 }, // Mỗi user dùng tối đa
  
  // Applicability - NÂNG CẤP
  applicableUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isForNewCustomersOnly: { type: Boolean, default: false },
  applicableCategories: [String],
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  // Validity
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true, index: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    this.validFrom <= now &&
    this.validUntil >= now &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(subtotal) {
  if (!this.isValid() || subtotal < this.minPurchaseAmount) {
    return 0;
  }

  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (subtotal * this.discountValue) / 100;
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    discount = this.discountValue;
    if (discount > subtotal) {
      discount = subtotal;
    }
  }

  return Math.round(discount * 100) / 100;
};

couponSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Coupon', couponSchema);
```

---

## 🎫 7. COUPON USAGE MODEL (New)

```javascript
// models/CouponUsage.js
import mongoose from 'mongoose';

const couponUsageSchema = new mongoose.Schema({
  couponId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Coupon', 
    required: true, 
    index: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    index: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  discountAmount: Number,
  usedAt: { type: Date, default: Date.now, index: -1 }
});

// Indexes
couponUsageSchema.index({ couponId: 1, userId: 1 });
couponUsageSchema.index({ orderId: 1 });
couponUsageSchema.index({ userId: 1, usedAt: -1 });

export default mongoose.model('CouponUsage', couponUsageSchema);
```

---

## 👤 8. USER MODEL (Updated)

```javascript
// models/User.js
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    lowercase: true, 
    index: true,
    required: true
  },
  password: { type: String, required: true },
  phone: String,
  
  // Profile - NÂNG CẤP
  avatar: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  
  // Address (legacy - giữ để backward compatible)
  address: String,
  city: String,
  country: String,
  
  // Role & Permissions
  role: { 
    type: String, 
    enum: ['customer', 'staff', 'admin'], 
    default: 'customer',
    index: true
  },
  
  // Loyalty - MỚI
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyLevel: { 
    type: String, 
    enum: ['bronze', 'silver', 'gold', 'platinum'], 
    default: 'bronze' 
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifiedAt: Date,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now, index: -1 },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: Date
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ loyaltyPoints: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Auto update updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('User', userSchema);
```

---

## 📍 9. ADDRESS MODEL (Updated)

```javascript
// models/Address.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  
  // Address structure - CẬP NHẬT
  addressLine1: { type: String, required: true, trim: true },
  ward: String,
  wardCode: String, // Mã phường/xã chuẩn
  district: { type: String, required: true, trim: true },
  districtCode: String, // Mã quận/huyện chuẩn
  city: { type: String, required: true, trim: true },
  cityCode: String, // Mã tỉnh/thành chuẩn
  country: { type: String, default: 'Vietnam', trim: true },
  zipCode: String,
  
  // Coordinates (optional)
  coordinates: { lat: Number, lng: Number },
  
  // Metadata
  label: { type: String, default: 'Nhà riêng' }, // Nhà riêng, Công ty, Khác
  isDefault: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
addressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.index({ userId: 1 });

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await mongoose.model('Address').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Address', addressSchema);
```

---

## 👁️ 10. PRODUCT VIEW MODEL (New)

```javascript
// models/ProductView.js
import mongoose from 'mongoose';

const productViewSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true, 
    index: true 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null nếu guest
  sessionId: String, // Cho guest tracking
  ip: String,
  userAgent: String,
  viewedAt: { type: Date, default: Date.now, index: -1 }
});

// Indexes
productViewSchema.index({ productId: 1, viewedAt: -1 });
productViewSchema.index({ userId: 1, viewedAt: -1 });
productViewSchema.index({ viewedAt: -1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // TTL 90 days

export default mongoose.model('ProductView', productViewSchema);
```

---

## 💳 11. PAYMENT TRANSACTION MODEL (New)

```javascript
// models/PaymentTransaction.js
import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true, 
    index: true 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  
  // Payment info
  gateway: { 
    type: String, 
    enum: ['momo', 'zalopay', 'vnpay', 'stripe', 'bank_transfer'], 
    required: true 
  },
  method: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'VND' },
  
  // Transaction details
  transactionId: String, // Gateway transaction ID
  referenceCode: String,
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  
  // Gateway response
  rawResponse: mongoose.Schema.Types.Mixed, // Full response
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date,
  failedAt: Date
});

// Indexes
paymentTransactionSchema.index({ orderId: 1 });
paymentTransactionSchema.index({ transactionId: 1 });
paymentTransactionSchema.index({ gateway: 1, status: 1 });
paymentTransactionSchema.index({ userId: 1, createdAt: -1 });

paymentTransactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('PaymentTransaction', paymentTransactionSchema);
```

---

## 🎁 12. LOYALTY TRANSACTION MODEL (New)

```javascript
// models/LoyaltyTransaction.js
import mongoose from 'mongoose';

const loyaltyTransactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  
  type: { 
    type: String, 
    enum: ['earn', 'spend', 'expire', 'adjust'], 
    required: true 
  },
  points: { type: Number, required: true }, // Positive for earn, negative for spend
  balance: Number, // Balance sau transaction
  
  description: String,
  expiresAt: Date, // Nếu có expiry
  
  createdAt: { type: Date, default: Date.now, index: -1 }
});

// Indexes
loyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });
loyaltyTransactionSchema.index({ orderId: 1 });

export default mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
```

---

## 🔐 13. REFRESH TOKEN MODEL (New - Phase 3)

```javascript
// models/RefreshToken.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  tokenHash: { type: String, required: true, unique: true },
  deviceInfo: String,
  ip: String,
  expiresAt: { type: Date, required: true, index: true },
  revokedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Indexes
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ tokenHash: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL

export default mongoose.model('RefreshToken', refreshTokenSchema);
```

---

## 📝 14. AUDIT LOG MODEL (New - Phase 3)

```javascript
// models/AuditLog.js
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  action: { type: String, required: true }, // 'create', 'update', 'delete', 'login', etc.
  entityType: { type: String, required: true }, // 'product', 'order', 'user', etc.
  entityId: mongoose.Schema.Types.ObjectId,
  metadata: mongoose.Schema.Types.Mixed, // Old value, new value, changes
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now, index: -1 }
});

// Indexes
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
```

---

## 📍 15. PROVINCE/DISTRICT/WARD MODELS (New - Reference Data)

```javascript
// models/Province.js
import mongoose from 'mongoose';

const provinceSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  nameEn: String,
  type: { type: String, enum: ['province', 'city'] }
});

provinceSchema.index({ code: 1 });

export default mongoose.model('Province', provinceSchema);

// models/District.js
const districtSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  nameEn: String,
  provinceCode: { type: String, required: true, index: true },
  type: { type: String, enum: ['district', 'city', 'town'] }
});

districtSchema.index({ code: 1 });
districtSchema.index({ provinceCode: 1 });

export default mongoose.model('District', districtSchema);

// models/Ward.js
const wardSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  nameEn: String,
  districtCode: { type: String, required: true, index: true },
  type: { type: String, enum: ['ward', 'commune'] }
});

wardSchema.index({ code: 1 });
wardSchema.index({ districtCode: 1 });

export default mongoose.model('Ward', wardSchema);
```

---

## 📌 LƯU Ý KHI IMPLEMENT

1. **Migration Scripts**: Tạo migration scripts để update data hiện có
2. **Indexes**: Đảm bảo tất cả indexes được tạo
3. **Validation**: Thêm validation logic trong services
4. **Hooks**: Sử dụng pre/post hooks để auto-update fields
5. **References**: Đảm bảo populate đúng khi query

---

**Cập nhật:** Khi có thay đổi schema, cập nhật file này và migration scripts.

