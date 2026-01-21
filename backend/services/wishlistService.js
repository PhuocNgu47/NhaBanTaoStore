/**
 * Wishlist Service
 * Logic nghiệp vụ cho danh sách yêu thích
 */

import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

/**
 * Lấy wishlist của user
 */
export const getWishlist = async (userId) => {
  const wishlist = await Wishlist.find({ userId })
    .populate('productId', 'name price image variants rating reviewCount')
    .populate('variantId')
    .sort({ addedAt: -1 });

  return wishlist;
};

/**
 * Thêm sản phẩm vào wishlist
 */
export const addToWishlist = async (userId, productId, variantId = null) => {
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Validate variant nếu có
  if (variantId) {
    const variant = product.variants.id(variantId);
    if (!variant) {
      throw new Error('Không tìm thấy biến thể sản phẩm');
    }
  }

  // Kiểm tra xem đã có trong wishlist chưa
  const existing = await Wishlist.findOne({ userId, productId, variantId });
  if (existing) {
    throw new Error('Sản phẩm đã có trong danh sách yêu thích');
  }

  const wishlistItem = new Wishlist({
    userId,
    productId,
    variantId: variantId || null
  });

  await wishlistItem.save();
  return await wishlistItem.populate('productId', 'name price image variants rating reviewCount');
};

/**
 * Xóa sản phẩm khỏi wishlist
 */
export const removeFromWishlist = async (userId, productId, variantId = null) => {
  const wishlistItem = await Wishlist.findOne({ userId, productId, variantId });
  
  if (!wishlistItem) {
    throw new Error('Không tìm thấy sản phẩm trong danh sách yêu thích');
  }

  await Wishlist.findByIdAndDelete(wishlistItem._id);
  return { message: 'Đã xóa khỏi danh sách yêu thích' };
};

/**
 * Kiểm tra sản phẩm có trong wishlist không
 */
export const isInWishlist = async (userId, productId, variantId = null) => {
  const wishlistItem = await Wishlist.findOne({ userId, productId, variantId });
  return !!wishlistItem;
};

