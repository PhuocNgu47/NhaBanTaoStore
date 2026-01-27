import mongoose from 'mongoose';

/**
 * Banner Schema
 * Quản lý banner slider trên trang chủ
 */
const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề banner là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tiêu đề không được vượt quá 100 ký tự']
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Mô tả không được vượt quá 200 ký tự']
    },
    image: {
      type: String,
      required: [true, 'Ảnh banner là bắt buộc']
    },
    imageAlt: {
      type: String,
      trim: true,
      default: ''
    },
    link: {
      type: String,
      default: '/san-pham',
      trim: true
    },
    buttonText: {
      type: String,
      trim: true,
      default: 'TÌM HIỂU NGAY',
      maxlength: [50, 'Button text không được vượt quá 50 ký tự']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    saleLabel: {
      type: String,
      trim: true,
      maxlength: [50, 'Nhãn sale không được vượt quá 50 ký tự']
    },
    salePercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    backgroundImage: {
      type: String,
      trim: true,
      default: ''
    },
    backgroundColor: {
      type: String,
      trim: true,
      default: '' // e.g., 'bg-slate-900' or hex '#000000'
    },
    textColor: {
      type: String,
      trim: true,
      default: 'white', // 'white' or 'black'
      enum: ['white', 'black']
    }
  },
  {
    timestamps: true // Tự động thêm createdAt, updatedAt
  }
);

// Index để tối ưu query
bannerSchema.index({ isActive: 1, displayOrder: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

// Virtual: Kiểm tra banner có đang active không (dựa trên date range)
bannerSchema.virtual('isCurrentlyActive').get(function () {
  if (!this.isActive) return false;

  const now = new Date();
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;

  return true;
});

// Method: Lấy banner active (dùng trong query)
bannerSchema.statics.getActiveBanners = function () {
  const now = new Date();
  return this.find({
    isActive: true,
    $or: [
      { startDate: { $lte: now } },
      { startDate: { $exists: false } }
    ],
    $or: [
      { endDate: { $gte: now } },
      { endDate: { $exists: false } }
    ]
  })
    .sort({ displayOrder: 1, createdAt: -1 });
};

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
