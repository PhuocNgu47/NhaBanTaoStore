/**
 * Seed Script - Thêm Banners mẫu
 * 
 * Run: node backend/scripts/seed-banners.js
 * Thêm banners với ảnh từ Unsplash cho trang chủ
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Banner Schema (simplified, inline)
const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: String,
    image: { type: String, required: true },
    link: { type: String, default: '/san-pham' },
    buttonText: { type: String, default: 'Khám phá ngay' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    saleLabel: String,
    salePercent: { type: Number, default: 0 },
}, { timestamps: true });

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

// Sample banners với ảnh từ Unsplash
const BANNERS = [
    {
        title: 'iPhone 16 Pro Max',
        subtitle: 'Chip A18 Pro mạnh mẽ nhất - Camera 48MP zoom 5x - Titanium cao cấp',
        image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=1600&h=600&fit=crop&q=80',
        link: '/danh-muc/iphone',
        buttonText: 'Mua ngay',
        isActive: true,
        displayOrder: 1,
        saleLabel: 'SẢN PHẨM MỚI',
        salePercent: 0,
    },
    {
        title: 'MacBook Air M3',
        subtitle: 'Siêu mỏng nhẹ - Hiệu năng vượt trội - Pin 18 giờ',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&h=600&fit=crop&q=80',
        link: '/danh-muc/macbook',
        buttonText: 'Khám phá',
        isActive: true,
        displayOrder: 2,
        saleLabel: '',
        salePercent: 0,
    },
    {
        title: 'iPad Pro M4',
        subtitle: 'Màn hình OLED Ultra Retina XDR - Mỏng nhất từ trước đến nay',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1600&h=600&fit=crop&q=80',
        link: '/danh-muc/ipad',
        buttonText: 'Tìm hiểu thêm',
        isActive: true,
        displayOrder: 3,
        saleLabel: '',
        salePercent: 0,
    },
    {
        title: 'Apple Watch Ultra 2',
        subtitle: 'Titanium chuẩn hàng không - Màn hình 3000 nits - GPS chính xác nhất',
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1600&h=600&fit=crop&q=80',
        link: '/danh-muc/apple-watch',
        buttonText: 'Mua ngay',
        isActive: true,
        displayOrder: 4,
        saleLabel: '',
        salePercent: 0,
    },
    {
        title: 'SALE LỚN - Openbox & CPO',
        subtitle: 'Giảm đến 30% các sản phẩm Openbox và CPO - Bảo hành như mới',
        image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1600&h=600&fit=crop&q=80',
        link: '/san-pham?type=openbox',
        buttonText: 'XEM NGAY',
        isActive: true,
        displayOrder: 5,
        saleLabel: 'GIẢM GIÁ SỐC',
        salePercent: 30,
    },
];

// Main seed function
const seedBanners = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/apple-store';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check existing banners
        const existingCount = await Banner.countDocuments();
        console.log(`📊 Banners hiện có: ${existingCount}`);

        if (existingCount > 0) {
            console.log('⚠️  Đã có banners trong database');
            console.log('   Nếu muốn thêm mới, hãy xóa banners cũ trước');
            console.log('   Hoặc chạy với flag --force để ghi đè');

            // Check for --force flag
            if (process.argv.includes('--force')) {
                console.log('🔄 Force mode: Xóa banners cũ và thêm mới...');
                await Banner.deleteMany({});
            } else {
                console.log('✋ Bỏ qua seed banners');
                await mongoose.disconnect();
                return;
            }
        }

        // Insert banners
        const result = await Banner.insertMany(BANNERS);
        console.log(`✅ Đã thêm ${result.length} banners`);

        result.forEach((banner, idx) => {
            console.log(`   ${idx + 1}. ${banner.title}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
};

// Run
seedBanners();
