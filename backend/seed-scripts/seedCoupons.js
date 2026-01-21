/**
 * Seed Coupons
 * Tạo coupons mẫu
 */

import Coupon from '../models/Coupon.js';
import { COUPONS } from '../seed-data/coupons.js';

export const seedCoupons = async () => {
  console.log('🎫 Creating sample coupons...');
  const createdCoupons = await Coupon.insertMany(COUPONS);
  console.log(`✅ Created ${createdCoupons.length} coupons\n`);
  return createdCoupons;
};

