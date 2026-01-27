import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true // One shipment per order
  },
  trackingCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  shippingProvider: {
    type: String,
    required: true,
    enum: ['ghn', 'ghtk', 'viettel_post', 'vnpost', 'jnt', 'best_express', 'other'],
    default: 'other'
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  estimatedDeliveryDate: {
    type: Date
  },
  actualDeliveryDate: {
    type: Date
  },
  shippingStatus: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned', 'cancelled'],
    default: 'pending'
  },
  // Recipient info (snapshot from order)
  recipientName: {
    type: String,
    required: true
  },
  recipientPhone: {
    type: String,
    required: true
  },
  recipientAddress: {
    addressLine1: String,
    ward: String,
    district: String,
    city: String,
    country: { type: String, default: 'Vietnam' }
  },
  note: String, // Delivery note
  // Tracking history
  trackingHistory: [{
    status: String,
    location: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  // Provider response data
  providerData: {
    type: mongoose.Schema.Types.Mixed
  },
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  cancelledAt: Date,
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Indexes
shipmentSchema.index({ orderId: 1 });
shipmentSchema.index({ trackingCode: 1 });
shipmentSchema.index({ shippingStatus: 1 });
shipmentSchema.index({ createdAt: -1 });

// Auto-update updatedAt
shipmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Shipment', shipmentSchema);
