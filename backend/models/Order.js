import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true }, // unique: true tự động tạo index
  // Customer
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestEmail: String,
  guestPhone: String,
  // Items - CẬP NHẬT để hỗ trợ variants
  items: [{
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
  }],
  // Pricing
  subtotal: Number,
  discountAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalAmount: {
    type: Number,
    required: true
  },
  // Shipping Address - CẬP NHẬT
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
    enum: ['cod', 'bank_transfer', 'momo', 'zalopay', 'vnpay', 'stripe', 'qr_code'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'cod', 'failed', 'refunded'], // Updated per spec: unpaid, paid, cod
    default: 'unpaid'
  },
  // New payment fields for SePay integration
  paidAt: {
    type: Date
  },
  paymentDetails: {
    method: String,
    gateway: String,
    transactionId: String,
    referenceCode: String,
    amount: Number,
    content: String,
    paidAt: Date
  },
  paymentNote: {
    type: String
  },
  // Coupon
  couponCode: String,
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },

  // Order Status - Updated per spec
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'shipping_ready', 'shipping_created', 'delivering', 'completed', 'cancelled', 'returned',
      // Backward compatibility for old statuses
      'processing', 'shipped', 'delivered', 'refunded'
    ],
    default: 'pending'
  },

  // Status History
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    trackingNumber: String // Khi shipped
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

// Auto-generate order number (số dễ nhớ cho chuyển khoản)
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    // Format: timestamp cuối (dễ copy vào nội dung chuyển khoản)
    this.orderNumber = `${Date.now()}`;
  }

  // Track status changes
  // Note: Only auto-add to statusHistory if not already added by service layer
  // Service layer will handle statusHistory updates with proper adminId
  if (this.isModified('status')) {
    // Only auto-add if statusHistory is empty or last entry is different status
    // This prevents duplicate entries when service layer handles it
    const shouldAutoAdd = !this.statusHistory ||
      this.statusHistory.length === 0 ||
      (this.statusHistory.length > 0 &&
        this.statusHistory[this.statusHistory.length - 1].status !== this.status);

    if (shouldAutoAdd) {
      if (!this.statusHistory) {
        this.statusHistory = [];
      }
      this.statusHistory.push({
        status: this.status,
        updatedAt: new Date(),
        updatedBy: this.userId || null
      });
    }

    // Set timestamps based on status
    const now = new Date();
    if (this.status === 'confirmed' && !this.confirmedAt) {
      this.confirmedAt = now;
    }
    if (this.status === 'shipping_ready' && !this.processingAt) {
      this.processingAt = now;
    }
    if (this.status === 'shipping_created' && !this.shippedAt) {
      this.shippedAt = now;
    }
    if (this.status === 'delivering' && !this.shippedAt) {
      this.shippedAt = now;
    }
    if (this.status === 'completed' && !this.deliveredAt) {
      this.deliveredAt = now;
    }
    if (this.status === 'cancelled' && !this.cancelledAt) {
      this.cancelledAt = now;
    }
    // Backward compatibility for old statuses
    if (this.status === 'processing' && !this.processingAt) {
      this.processingAt = now;
    }
    if (this.status === 'shipped' && !this.shippedAt) {
      this.shippedAt = now;
    }
    if (this.status === 'delivered' && !this.deliveredAt) {
      this.deliveredAt = now;
    }
  }

  this.updatedAt = new Date();
  next();
});

// Indexes
// Lưu ý: orderNumber đã có unique: true nên không cần index riêng
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'items.productId': 1 });

export default mongoose.model('Order', orderSchema);
