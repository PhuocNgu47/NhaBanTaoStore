/**
 * Ví Dụ Về Quan Hệ Dữ Liệu
 * 
 * File này chứa các ví dụ code cụ thể về cách sử dụng quan hệ dữ liệu
 * trong dự án E-commerce.
 * 
 * Chạy: node examples/relationship-examples.js
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import Coupon from '../models/Coupon.js';
import dotenv from 'dotenv';

dotenv.config();

// Kết nối MongoDB
await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB\n');

// ============================================
// 1. ONE-TO-MANY: User → Orders
// ============================================

async function example1_UserToOrders() {
  console.log('📌 Ví Dụ 1: User → Orders (1:N)');
  console.log('─────────────────────────────────\n');

  // Tìm một user
  const user = await User.findOne({ email: 'user@example.com' });
  if (!user) {
    console.log('❌ Không tìm thấy user');
    return;
  }

  console.log(`👤 User: ${user.name} (${user.email})`);

  // Lấy tất cả orders của user này
  const orders = await Order.find({ userId: user._id })
    .populate('userId', 'name email')  // ← Populate User (mặc dù đã biết, nhưng để demo)
    .populate('items.productId', 'name price image')  // ← Populate Products trong items
    .sort({ createdAt: -1 });

  console.log(`\n📦 Số lượng orders: ${orders.length}\n`);

  orders.forEach((order, index) => {
    console.log(`Order ${index + 1}:`);
    console.log(`  - Order Number: ${order.orderNumber}`);
    console.log(`  - Total: $${order.totalAmount}`);
    console.log(`  - Status: ${order.status}`);
    console.log(`  - Items:`);
    
    order.items.forEach((item, itemIndex) => {
      const product = item.productId;  // ← Đã được populate
      console.log(`    ${itemIndex + 1}. ${product.name} x${item.quantity} = $${item.price * item.quantity}`);
    });
    console.log('');
  });
}

// ============================================
// 2. ONE-TO-MANY: User → Addresses
// ============================================

async function example2_UserToAddresses() {
  console.log('📌 Ví Dụ 2: User → Addresses (1:N)');
  console.log('─────────────────────────────────\n');

  const user = await User.findOne({ email: 'user@example.com' });
  if (!user) {
    console.log('❌ Không tìm thấy user');
    return;
  }

  // Lấy tất cả addresses của user
  const addresses = await Address.find({ userId: user._id })
    .populate('userId', 'name email')
    .sort({ isDefault: -1, createdAt: -1 });

  console.log(`👤 User: ${user.name}`);
  console.log(`📍 Số lượng addresses: ${addresses.length}\n`);

  addresses.forEach((addr, index) => {
    console.log(`Address ${index + 1}:`);
    console.log(`  - Label: ${addr.label} ${addr.isDefault ? '(Mặc định)' : ''}`);
    console.log(`  - Address: ${addr.address}`);
    console.log(`  - City: ${addr.city}`);
    console.log(`  - Phone: ${addr.phone}`);
    console.log('');
  });
}

// ============================================
// 3. MANY-TO-MANY: Order → Products (qua items)
// ============================================

async function example3_OrderToProducts() {
  console.log('📌 Ví Dụ 3: Order → Products (N:M qua items[])');
  console.log('─────────────────────────────────\n');

  // Lấy một order
  const order = await Order.findOne()
    .populate('userId', 'name email')
    .populate('items.productId', 'name price image category');

  if (!order) {
    console.log('❌ Không tìm thấy order');
    return;
  }

  console.log(`📦 Order Number: ${order.orderNumber}`);
  console.log(`👤 Customer: ${order.userId.name} (${order.userId.email})`);
  console.log(`💰 Total: $${order.totalAmount}`);
  console.log(`\n🛍️  Products trong order:\n`);

  order.items.forEach((item, index) => {
    const product = item.productId;  // ← Đã được populate
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   - Category: ${product.category}`);
    console.log(`   - Price: $${product.price}`);
    console.log(`   - Quantity: ${item.quantity}`);
    console.log(`   - Subtotal: $${item.price * item.quantity}`);
    console.log('');
  });
}

// ============================================
// 4. ONE-TO-MANY: Product → Reviews (embedded)
// ============================================

async function example4_ProductToReviews() {
  console.log('📌 Ví Dụ 4: Product → Reviews (1:N embedded)');
  console.log('─────────────────────────────────\n');

  // Lấy một product có reviews
  const product = await Product.findOne({ 'reviews.0': { $exists: true } })
    .populate('reviews.user', 'name email');  // ← Populate users trong reviews

  if (!product) {
    console.log('❌ Không tìm thấy product có reviews');
    return;
  }

  console.log(`📱 Product: ${product.name}`);
  console.log(`⭐ Rating: ${product.rating}`);
  console.log(`📝 Số lượng reviews: ${product.reviews.length}\n`);

  product.reviews.forEach((review, index) => {
    const user = review.user;  // ← Đã được populate
    console.log(`Review ${index + 1}:`);
    console.log(`  - User: ${user.name} (${user.email})`);
    console.log(`  - Rating: ${'⭐'.repeat(review.rating)}`);
    console.log(`  - Comment: ${review.comment || 'Không có comment'}`);
    console.log(`  - Date: ${review.createdAt}`);
    console.log('');
  });
}

// ============================================
// 5. MANY-TO-MANY: Coupon → Products
// ============================================

async function example5_CouponToProducts() {
  console.log('📌 Ví Dụ 5: Coupon → Products (N:M)');
  console.log('─────────────────────────────────\n');

  // Lấy một coupon
  const coupon = await Coupon.findOne()
    .populate('applicableProducts', 'name price category');

  if (!coupon) {
    console.log('❌ Không tìm thấy coupon');
    console.log('💡 Hãy seed coupon data trước');
    return;
  }

  console.log(`🎫 Coupon: ${coupon.code}`);
  console.log(`📝 Name: ${coupon.name}`);
  console.log(`💰 Discount: ${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '$' + coupon.discountValue}`);
  console.log(`\n🛍️  Products có thể áp dụng: ${coupon.applicableProducts.length}\n`);

  coupon.applicableProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   - Category: ${product.category}`);
    console.log(`   - Price: $${product.price}`);
    console.log('');
  });
}

// ============================================
// 6. COMPLEX QUERY: Lấy orders với đầy đủ thông tin
// ============================================

async function example6_ComplexQuery() {
  console.log('📌 Ví Dụ 6: Complex Query - Order với đầy đủ thông tin');
  console.log('─────────────────────────────────\n');

  const order = await Order.findOne()
    .populate('userId', 'name email phone')  // ← User info
    .populate('items.productId', 'name price image category')  // ← Product info
    .populate('statusHistory.updatedBy', 'name email');  // ← Người cập nhật status

  if (!order) {
    console.log('❌ Không tìm thấy order');
    return;
  }

  console.log('📦 ORDER DETAILS');
  console.log('═══════════════════════════════════════\n');
  
  console.log('👤 Customer:');
  console.log(`   Name: ${order.userId.name}`);
  console.log(`   Email: ${order.userId.email}`);
  console.log(`   Phone: ${order.userId.phone || 'N/A'}`);
  console.log('');

  console.log('📦 Order Info:');
  console.log(`   Order Number: ${order.orderNumber}`);
  console.log(`   Status: ${order.status}`);
  console.log(`   Payment Status: ${order.paymentStatus}`);
  console.log(`   Total Amount: $${order.totalAmount}`);
  console.log('');

  console.log('🛍️  Items:');
  order.items.forEach((item, index) => {
    const product = item.productId;
    console.log(`   ${index + 1}. ${product.name}`);
    console.log(`      Category: ${product.category}`);
    console.log(`      Quantity: ${item.quantity}`);
    console.log(`      Price: $${item.price}`);
    console.log(`      Subtotal: $${item.price * item.quantity}`);
    console.log('');
  });

  console.log('📍 Shipping Address:');
  console.log(`   Name: ${order.shippingAddress.name}`);
  console.log(`   Address: ${order.shippingAddress.address}`);
  console.log(`   City: ${order.shippingAddress.city}`);
  console.log('');

  if (order.statusHistory && order.statusHistory.length > 0) {
    console.log('📜 Status History:');
    order.statusHistory.forEach((history, index) => {
      const updatedBy = history.updatedBy;
      console.log(`   ${index + 1}. ${history.status}`);
      console.log(`      Updated: ${history.updatedAt}`);
      console.log(`      By: ${updatedBy ? updatedBy.name : 'System'}`);
      console.log('');
    });
  }
}

// ============================================
// 7. AGGREGATION: Thống kê orders của user
// ============================================

async function example7_Aggregation() {
  console.log('📌 Ví Dụ 7: Aggregation - Thống kê orders');
  console.log('─────────────────────────────────\n');

  const user = await User.findOne({ email: 'user@example.com' });
  if (!user) {
    console.log('❌ Không tìm thấy user');
    return;
  }

  // Sử dụng aggregation để thống kê
  const stats = await Order.aggregate([
    { $match: { userId: user._id } },  // ← Lọc orders của user
    {
      $group: {
        _id: '$status',  // ← Nhóm theo status
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  console.log(`👤 User: ${user.name}`);
  console.log(`\n📊 Thống kê orders:\n`);

  stats.forEach((stat) => {
    console.log(`Status: ${stat._id}`);
    console.log(`  - Số lượng: ${stat.count}`);
    console.log(`  - Tổng tiền: $${stat.totalAmount}`);
    console.log('');
  });
}

// ============================================
// 8. TẠO DỮ LIỆU MỚI VỚI QUAN HỆ
// ============================================

async function example8_CreateWithRelations() {
  console.log('📌 Ví Dụ 8: Tạo dữ liệu mới với quan hệ');
  console.log('─────────────────────────────────\n');

  // Bước 1: Tìm hoặc tạo user
  let user = await User.findOne({ email: 'demo@example.com' });
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      role: 'user'
    });
    console.log(`✅ Tạo user mới: ${user.name}`);
  } else {
    console.log(`👤 User đã tồn tại: ${user.name}`);
  }

  // Bước 2: Tạo address cho user
  const address = await Address.create({
    userId: user._id,  // ← Liên kết đến User
    name: user.name,
    phone: '0901234567',
    address: '123 Demo Street',
    district: 'Quận 1',
    city: 'Ho Chi Minh',
    country: 'Vietnam',
    zipCode: '700000',
    isDefault: true,
    label: 'Nhà riêng'
  });
  console.log(`✅ Tạo address: ${address.address}`);

  // Bước 3: Lấy một product
  const product = await Product.findOne();
  if (!product) {
    console.log('❌ Không tìm thấy product');
    return;
  }

  // Bước 4: Tạo order với quan hệ
  const order = await Order.create({
    userId: user._id,  // ← Liên kết đến User
    items: [
      {
        productId: product._id,  // ← Liên kết đến Product
        quantity: 2,
        price: product.price
      }
    ],
    totalAmount: product.price * 2,
    shippingAddress: {
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      country: address.country,
      zipCode: address.zipCode
    },
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    status: 'pending'
  });
  console.log(`✅ Tạo order: ${order.orderNumber}`);

  // Bước 5: Thêm review cho product
  product.reviews.push({
    user: user._id,  // ← Liên kết đến User
    rating: 5,
    comment: 'Sản phẩm tốt, giao hàng nhanh!',
    createdAt: new Date()
  });
  await product.save();
  console.log(`✅ Thêm review cho product: ${product.name}`);

  console.log('\n✅ Hoàn thành! Đã tạo dữ liệu với quan hệ.');
}

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
  try {
    console.log('🚀 BẮT ĐẦU CÁC VÍ DỤ VỀ QUAN HỆ DỮ LIỆU\n');
    console.log('═══════════════════════════════════════\n');

    // Chạy các ví dụ
    await example1_UserToOrders();
    console.log('\n');

    await example2_UserToAddresses();
    console.log('\n');

    await example3_OrderToProducts();
    console.log('\n');

    await example4_ProductToReviews();
    console.log('\n');

    await example5_CouponToProducts();
    console.log('\n');

    await example6_ComplexQuery();
    console.log('\n');

    await example7_Aggregation();
    console.log('\n');

    // Uncomment để chạy ví dụ tạo dữ liệu mới
    // await example8_CreateWithRelations();

    console.log('═══════════════════════════════════════');
    console.log('✅ HOÀN THÀNH TẤT CẢ VÍ DỤ');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Đã ngắt kết nối MongoDB');
  }
}

// Chạy main function
main();

