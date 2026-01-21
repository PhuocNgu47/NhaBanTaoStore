/**
 * Coupon Service
 * Chứa logic nghiệp vụ cho coupons: validate, tính discount, CRUD
 */

import Coupon from '../models/Coupon.js';

/**
 * Validate coupon và tính discount
 */
export const validateCoupon = async (code, subtotal) => {
  if (!code) {
    throw new Error('Vui lòng nhập mã giảm giá');
  }

  if (!subtotal || subtotal <= 0) {
    throw new Error('Tổng tiền không hợp lệ');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

  if (!coupon) {
    throw new Error('Mã giảm giá không tồn tại');
  }

  // Validate coupon
  if (!coupon.isValid()) {
    const now = new Date();
    if (!coupon.isActive) {
      throw new Error('Mã giảm giá đã bị vô hiệu hóa');
    }
    if (coupon.validFrom > now) {
      throw new Error(`Mã giảm giá chưa có hiệu lực. Có hiệu lực từ ${coupon.validFrom.toLocaleDateString('vi-VN')}`);
    }
    if (coupon.validUntil < now) {
      throw new Error('Mã giảm giá đã hết hạn');
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error('Mã giảm giá đã hết lượt sử dụng');
    }
  }

  if (subtotal < coupon.minPurchaseAmount) {
    throw new Error(`Đơn hàng tối thiểu ${coupon.minPurchaseAmount.toLocaleString('vi-VN')}đ để sử dụng mã này`);
  }

  const discount = coupon.calculateDiscount(subtotal);

  return {
    coupon: {
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    },
    discount,
    subtotal,
    finalAmount: subtotal - discount
  };
};

/**
 * Lấy danh sách coupons (Admin only)
 */
export const getCoupons = async () => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return coupons;
};

/**
 * Tạo coupon mới (Admin only)
 */
export const createCoupon = async (couponData) => {
  const {
    code,
    name,
    description,
    discountType,
    discountValue,
    minPurchaseAmount,
    maxDiscountAmount,
    usageLimit,
    validFrom,
    validUntil,
    applicableCategories,
    applicableProducts
  } = couponData;

  // Validation
  if (!code || !name || !discountType || !discountValue) {
    throw new Error('Vui lòng điền đầy đủ thông tin: code, name, discountType, discountValue');
  }

  if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
    throw new Error('Phần trăm giảm giá phải từ 0 đến 100');
  }

  if (discountType === 'fixed' && discountValue <= 0) {
    throw new Error('Số tiền giảm giá phải lớn hơn 0');
  }

  const coupon = new Coupon({
    code: code.toUpperCase().trim(),
    name: name.trim(),
    description: description?.trim() || '',
    discountType,
    discountValue: Number(discountValue),
    minPurchaseAmount: Number(minPurchaseAmount) || 0,
    maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
    usageLimit: usageLimit ? Number(usageLimit) : null,
    validFrom: validFrom ? new Date(validFrom) : new Date(),
    validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
    applicableCategories: applicableCategories || [],
    applicableProducts: applicableProducts || []
  });

  await coupon.save();

  return coupon;
};

/**
 * Cập nhật coupon (Admin only)
 */
export const updateCoupon = async (couponId, updateData) => {
  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!coupon) {
    throw new Error('Không tìm thấy mã giảm giá');
  }

  return coupon;
};

/**
 * Xóa coupon (Admin only)
 */
export const deleteCoupon = async (couponId) => {
  const coupon = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new Error('Không tìm thấy mã giảm giá');
  }

  return coupon;
};

