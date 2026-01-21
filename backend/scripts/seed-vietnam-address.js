/**
 * Seed Vietnam Address Data
 * Import dữ liệu địa chỉ Việt Nam từ API công khai
 * 
 * Dữ liệu từ: https://github.com/daohoangson/dvhcvn
 * Hoặc API: https://provinces.open-api.vn/
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Province, District, Ward } from '../models/VietnamAddress.js';

dotenv.config();

/**
 * Import data từ API công khai
 * Có thể dùng API: https://provinces.open-api.vn/api/
 */
async function seedVietnamAddress() {
  try {
    console.log('🚀 Starting Vietnam Address seeding...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Xóa dữ liệu cũ
    console.log('🗑️  Xóa dữ liệu địa chỉ cũ...');
    await Province.deleteMany({});
    await District.deleteMany({});
    await Ward.deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ\n');

    console.log('📥 Đang tải dữ liệu từ API...');
    
    // Fetch từ API công khai
    const provincesResponse = await fetch('https://provinces.open-api.vn/api/p/');
    const provincesData = await provincesResponse.json();

    console.log(`✅ Đã tải ${provincesData.length} tỉnh/thành\n`);

    // Seed Provinces
    console.log('📍 Đang seed tỉnh/thành...');
    const provinces = provincesData.map(p => ({
      code: p.code,
      name: p.name,
      nameEn: p.name_en || null,
      fullName: p.full_name || p.name,
      fullNameEn: p.full_name_en || null,
      codeName: p.codename || null,
      administrativeUnit: p.administrative_unit || null,
      administrativeRegion: p.administrative_region || null
    }));
    
    await Province.insertMany(provinces);
    console.log(`✅ Đã seed ${provinces.length} tỉnh/thành\n`);

    // Seed Districts và Wards
    let totalDistricts = 0;
    let totalWards = 0;

    for (const province of provincesData) {
      console.log(`📍 Đang seed quận/huyện và phường/xã cho: ${province.name}...`);
      
      // Fetch districts
      const districtsResponse = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
      const provinceDetail = await districtsResponse.json();
      
      if (provinceDetail.districts) {
        const districts = provinceDetail.districts.map(d => ({
          code: d.code,
          name: d.name,
          nameEn: d.name_en || null,
          fullName: d.full_name || d.name,
          fullNameEn: d.full_name_en || null,
          codeName: d.codename || null,
          administrativeUnit: d.administrative_unit || null,
          provinceCode: province.code,
          provinceName: province.name
        }));

        await District.insertMany(districts);
        totalDistricts += districts.length;

        // Fetch wards cho mỗi district
        for (const district of provinceDetail.districts) {
          if (district.wards && district.wards.length > 0) {
            const wards = district.wards.map(w => ({
              code: w.code,
              name: w.name,
              nameEn: w.name_en || null,
              fullName: w.full_name || w.name,
              fullNameEn: w.full_name_en || null,
              codeName: w.codename || null,
              administrativeUnit: w.administrative_unit || null,
              districtCode: district.code,
              districtName: district.name,
              provinceCode: province.code,
              provinceName: province.name
            }));

            await Ward.insertMany(wards);
            totalWards += wards.length;
          }
        }
      }
    }

    console.log(`✅ Đã seed ${totalDistricts} quận/huyện`);
    console.log(`✅ Đã seed ${totalWards} phường/xã\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Vietnam Address seeded successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 Tổng Kết:');
    console.log(`   • Tỉnh/Thành: ${provinces.length}`);
    console.log(`   • Quận/Huyện: ${totalDistricts}`);
    console.log(`   • Phường/Xã: ${totalWards}\n`);

    await mongoose.disconnect();
    console.log('✅ Đã ngắt kết nối MongoDB');
  } catch (error) {
    console.error('❌ Error seeding Vietnam Address:', error);
    process.exit(1);
  }
}

seedVietnamAddress();

