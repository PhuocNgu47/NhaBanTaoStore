/**
 * Seed Leads Only
 * Script để seed chỉ leads (không seed lại toàn bộ database)
 * 
 * Cách chạy:
 *   node seed-leads-only.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';
import { seedLeads } from './seed-scripts/seedLeads.js';

// Load biến môi trường
dotenv.config();

async function seedLeadsOnly() {
  try {
    console.log('🚀 Starting leads seeding...\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Xóa leads cũ (optional - comment out nếu muốn giữ lại)
    console.log('🗑️  Xóa leads cũ...');
    await Lead.deleteMany({});
    console.log('✅ Đã xóa leads cũ\n');

    // Seed Leads
    const createdLeads = await seedLeads();

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Leads seeded successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 Tổng Kết:');
    console.log(`   • Total Leads: ${createdLeads.length}`);
    console.log(`   • With Phone: ${createdLeads.filter(l => l.info?.phone).length}`);
    console.log(`   • With Email: ${createdLeads.filter(l => l.info?.email).length}`);
    console.log(`   • High Spenders: ${createdLeads.filter(l => l.tags?.includes('High Spender')).length}`);
    console.log(`   • Anonymous: ${createdLeads.filter(l => !l.info?.phone && !l.info?.email).length}\n`);

    console.log('💡 Bạn có thể xem leads tại: /admin/leads\n');

    await mongoose.disconnect();
    console.log('✅ Đã ngắt kết nối MongoDB');
  } catch (error) {
    console.error('❌ Error seeding leads:', error);
    process.exit(1);
  }
}

seedLeadsOnly();
