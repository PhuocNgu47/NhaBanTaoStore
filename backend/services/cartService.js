/**
 * Cart Service
 * Logic nghiệp vụ cho giỏ hàng: CRUD items, merge cart
 */

import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Lấy giỏ hàng của user hoặc guest
 */
export const getCart = async (userId, sessionId) => {
  let cart;
  
  if (userId) {
    cart = await Cart.findOne({ userId })
      .populate('items.productId', 'name price image variants')
      .populate('items.variantId');
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId })
      .populate('items.productId', 'name price image variants')
      .populate('items.variantId');
  } else {
    throw new Error('Cần userId hoặc sessionId để lấy giỏ hàng');
  }

  if (!cart) {
    // Tạo cart mới nếu chưa có
    cart = new Cart({
      userId: userId || null,
      sessionId: sessionId || null,
      items: []
    });
    await cart.save();
  }

  return cart;
};

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export const addToCart = async (userId, sessionId, productId, variantId, quantity = 1) => {
  // Validate product và variant
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Nếu có variant, validate variant
  let variant = null;
  let price = product.price;
  let availableStock = product.stock || 0;

  if (variantId) {
    variant = product.variants.id(variantId);
    if (!variant) {
      throw new Error('Không tìm thấy biến thể sản phẩm');
    }
    if (!variant.isActive) {
      throw new Error('Biến thể sản phẩm không còn hoạt động');
    }
    price = variant.price;
    availableStock = variant.stock - variant.reserved;
  }

  // Check stock
  if (availableStock < quantity) {
    throw new Error(`Số lượng tồn kho không đủ. Còn lại: ${availableStock}`);
  }

  // Lấy hoặc tạo cart
  let cart;
  if (userId) {
    cart = await Cart.findOne({ userId });
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId });
  } else {
    throw new Error('Cần userId hoặc sessionId');
  }

  if (!cart) {
    cart = new Cart({
      userId: userId || null,
      sessionId: sessionId || null,
      items: []
    });
  }

  // Kiểm tra xem sản phẩm đã có trong cart chưa
  const existingItemIndex = cart.items.findIndex(item => {
    if (variantId) {
      return item.productId.toString() === productId.toString() && 
             item.variantId && 
             item.variantId.toString() === variantId.toString();
    }
    return item.productId.toString() === productId.toString() && !item.variantId;
  });

  if (existingItemIndex >= 0) {
    // Cập nhật quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (newQuantity > availableStock) {
      throw new Error(`Số lượng tối đa: ${availableStock}`);
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Thêm item mới
    cart.items.push({
      productId,
      variantId: variantId || null,
      quantity
    });
  }

  await cart.save();
  return await cart.populate('items.productId', 'name price image variants');
};

/**
 * Cập nhật số lượng item trong cart
 */
export const updateCartItem = async (userId, sessionId, itemId, quantity) => {
  if (quantity <= 0) {
    throw new Error('Số lượng phải lớn hơn 0');
  }

  let cart;
  if (userId) {
    cart = await Cart.findOne({ userId });
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId });
  } else {
    throw new Error('Cần userId hoặc sessionId');
  }

  if (!cart) {
    throw new Error('Không tìm thấy giỏ hàng');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
  }

  // Validate stock
  const product = await Product.findById(item.productId);
  let availableStock = product.stock || 0;

  if (item.variantId) {
    const variant = product.variants.id(item.variantId);
    if (variant) {
      availableStock = variant.stock - variant.reserved;
    }
  }

  if (quantity > availableStock) {
    throw new Error(`Số lượng tối đa: ${availableStock}`);
  }

  item.quantity = quantity;
  await cart.save();
  
  return await cart.populate('items.productId', 'name price image variants');
};

/**
 * Xóa item khỏi cart
 */
export const removeFromCart = async (userId, sessionId, itemId) => {
  let cart;
  if (userId) {
    cart = await Cart.findOne({ userId });
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId });
  } else {
    throw new Error('Cần userId hoặc sessionId');
  }

  if (!cart) {
    throw new Error('Không tìm thấy giỏ hàng');
  }

  cart.items.id(itemId).remove();
  await cart.save();
  
  return await cart.populate('items.productId', 'name price image variants');
};

/**
 * Xóa toàn bộ cart
 */
export const clearCart = async (userId, sessionId) => {
  let cart;
  if (userId) {
    cart = await Cart.findOne({ userId });
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId });
  } else {
    throw new Error('Cần userId hoặc sessionId');
  }

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  return { message: 'Đã xóa toàn bộ giỏ hàng' };
};

/**
 * Merge guest cart vào user cart khi login
 */
export const mergeCarts = async (userId, sessionId) => {
  const userCart = await Cart.findOne({ userId });
  const guestCart = await Cart.findOne({ sessionId });

  if (!guestCart || guestCart.items.length === 0) {
    return userCart || await getCart(userId, null);
  }

  if (!userCart) {
    // Chuyển guest cart thành user cart
    guestCart.userId = userId;
    guestCart.sessionId = null;
    await guestCart.save();
    return await guestCart.populate('items.productId', 'name price image variants');
  }

  // Merge items
  for (const guestItem of guestCart.items) {
    const existingItemIndex = userCart.items.findIndex(item => {
      if (guestItem.variantId) {
        return item.productId.toString() === guestItem.productId.toString() && 
               item.variantId && 
               item.variantId.toString() === guestItem.variantId.toString();
      }
      return item.productId.toString() === guestItem.productId.toString() && !item.variantId;
    });

    if (existingItemIndex >= 0) {
      // Cộng quantity
      userCart.items[existingItemIndex].quantity += guestItem.quantity;
    } else {
      // Thêm item mới
      userCart.items.push(guestItem);
    }
  }

  await userCart.save();
  await Cart.findByIdAndDelete(guestCart._id); // Xóa guest cart

  return await userCart.populate('items.productId', 'name price image variants');
};

