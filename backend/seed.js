/**
 * MongoDB Seed Data Script - Main Entry Point
 * 
 * Script này orchestrate việc seed dữ liệu mẫu
 * 
 * Cách chạy:
 *   npm run seed
 *   hoặc
 *   node seed.js
 * 
 * Cấu trúc:
 *   - seed-data/     : Chứa data mẫu (users.js, products.js, coupons.js)
 *   - seed-scripts/  : Chứa logic seed từng phần (seedUsers.js, seedProducts.js, etc.)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import Address from './models/Address.js';
import Coupon from './models/Coupon.js';
import Review from './models/Review.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';
import Lead from './models/Lead.js';

// Import seed scripts
import { seedUsers } from './seed-scripts/seedUsers.js';
import { seedProducts } from './seed-scripts/seedProducts.js';
import { seedOrders } from './seed-scripts/seedOrders.js';
import { seedAddresses } from './seed-scripts/seedAddresses.js';
import { seedCoupons } from './seed-scripts/seedCoupons.js';
import { seedReviews } from './seed-scripts/seedReviews.js';
import { seedCarts } from './seed-scripts/seedCarts.js';
import { seedWishlists } from './seed-scripts/seedWishlists.js';
import { seedLeads } from './seed-scripts/seedLeads.js';

// Import data
import { USERS } from './seed-data/users.js';

// Load biến môi trường
dotenv.config();

async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Xóa dữ liệu cũ (để seed lại từ đầu)
    console.log('🗑️  Xóa dữ liệu cũ...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Address.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Lead.deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ\n');

    // Seed Users
    const createdUsers = await seedUsers();
    const adminUsers = createdUsers.filter(u => u.role === 'admin');
    const regularUsers = createdUsers.filter(u => u.role === 'user');

    // Seed Products
    const createdProducts = await seedProducts();

    // Seed Orders
    const createdOrders = await seedOrders(regularUsers, createdProducts);
    const deliveredOrders = createdOrders.filter(o => o.status === 'delivered');

    // Seed Addresses
    const createdAddresses = await seedAddresses(regularUsers);

    // Seed Coupons
    const createdCoupons = await seedCoupons();

    // Seed Reviews
    const createdReviews = await seedReviews(deliveredOrders);

    // Seed Carts
    const createdCarts = await seedCarts(regularUsers, createdProducts);

    // Seed Wishlists
    const createdWishlists = await seedWishlists(regularUsers, createdProducts);

    // Seed Leads (needs products to reference)
    const createdLeads = await seedLeads();

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Database seeded successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 Tổng Kết:');
    console.log(`   • Users: ${createdUsers.length}`);
    console.log(`   • Products: ${createdProducts.length}`);
    console.log(`   • Orders: ${createdOrders.length}`);
    console.log(`   • Addresses: ${createdAddresses.length}`);
    console.log(`   • Coupons: ${createdCoupons.length}`);
    console.log(`   • Reviews: ${createdReviews.length}`);
    console.log(`   • Carts: ${createdCarts.length}`);
    console.log(`   • Wishlists: ${createdWishlists.length}`);
    console.log(`   • Leads: ${createdLeads.length}\n`);

    console.log('👤 Test Accounts:');
    USERS.forEach(user => {
      const roleIcon = user.role === 'admin' ? '🔑' : '👤';
      console.log(`   ${roleIcon} ${user.name}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Password: ${user.password}`);
      console.log(`      Role: ${user.role}\n`);
    });

    console.log('📦 Product Categories:');
    const categories = [...new Set(createdProducts.map(p => p.category))];
    categories.forEach(cat => {
      const count = createdProducts.filter(p => p.category === cat).length;
      console.log(`   • ${cat}: ${count} products`);
    });

    console.log('\n🎫 Coupons:');
    createdCoupons.forEach(coupon => {
      const discount = coupon.discountType === 'percentage' 
        ? `${coupon.discountValue}%` 
        : `$${coupon.discountValue}`;
      console.log(`   • ${coupon.code}: Giảm ${discount} - ${coupon.name}`);
    });

    console.log('\n💡 Bạn có thể test tất cả tính năng với dữ liệu này!');
    console.log('📚 Xem thêm: SEED_DATA_GUIDE.md\n');

    await mongoose.disconnect();
    console.log('✅ Đã ngắt kết nối MongoDB');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
