/**
 * Apple-app Seed Script (JSON-based)
 * - Đọc seed-data/*.json
 * - Xóa collections chính
 * - Seed Users / Products / Coupons (các phần còn lại có thể bổ sung sau)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Product from './models/Product.js';
import User from './models/User.js';
import Coupon from './models/Coupon.js';
import Order from './models/Order.js';
import Address from './models/Address.js';
import Review from './models/Review.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readJson(fileName) {
  const filePath = path.join(__dirname, 'seed-data', fileName);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function seedUsers() {
  const users = await readJson('users.json');
  const created = [];
  for (const u of users) {
    const doc = new User(u);
    await doc.save();
    created.push(doc);
  }
  return created;
}

async function seedProducts() {
  const products = await readJson('products.json');
  const created = [];
  for (const p of products) {
    const doc = new Product(p);
    await doc.save();
    created.push(doc);
  }
  return created;
}

async function seedCoupons() {
  const coupons = await readJson('coupons.json');
  const created = [];

  for (const c of coupons) {
    const normalized = {
      ...c,
      // normalize fields from legacy JSON
      name: c.name ?? c.code,
      validFrom: c.validFrom ?? c.startDate,
      validUntil: c.validUntil ?? c.endDate
    };

    delete normalized.startDate;
    delete normalized.endDate;

    const doc = new Coupon(normalized);
    await doc.save();
    created.push(doc);
  }

  return created;
}

async function clearDatabase() {
  await Promise.all([
    Product.deleteMany({}),
    User.deleteMany({}),
    Coupon.deleteMany({}),
    Order.deleteMany({}),
    Address.deleteMany({}),
    Review.deleteMany({}),
    Cart.deleteMany({}),
    Wishlist.deleteMany({})
  ]);
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI in .env');
    process.exit(1);
  }

  console.log('🚀 apple-app seed (JSON)');
  console.log('🔌 Connecting MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected:', mongoose.connection.name);

  console.log('🗑️  Clearing collections...');
  await clearDatabase();
  console.log('✅ Cleared');

  console.log('👤 Seeding users...');
  const users = await seedUsers();
  console.log(`✅ Users: ${users.length}`);

  console.log('📦 Seeding products...');
  const products = await seedProducts();
  console.log(`✅ Products: ${products.length}`);

  console.log('🎫 Seeding coupons...');
  const coupons = await seedCoupons();
  console.log(`✅ Coupons: ${coupons.length}`);

  await mongoose.disconnect();
  console.log('✅ Done');
}

main().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});

