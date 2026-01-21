import mongoose from 'mongoose';

/**
 * Address Model
 * Lưu địa chỉ giao hàng của người dùng
 */
const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  ward: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: 'Vietnam',
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    trim: true,
    default: 'Nhà riêng' // Nhà riêng, Công ty, Khác
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

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

