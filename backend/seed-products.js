/**
 * Product Seed Data Script
 * Populates database with realistic Apple products
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';

// Placeholder image từ Unsplash (Apple products)
const IMAGES = {
    iphone: 'https://images.unsplash.com/photo-1592286927505-c1f0d0e9ec2c?w=800',
    ipad: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    airpods: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
    watch: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
    cable: 'https://images.unsplash.com/photo-1591290619762-d71e6948dd4c?w=800',
    case: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800'
};

const PRODUCTS_DATA = [
    // ============ IPHONE ============
    {
        name: 'iPhone 16 Pro Max',
        slug: 'iphone-16-pro-max',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 16 Pro Max với chip A18 Pro mạnh mẽ, camera 48MP, màn hình Super Retina XDR 6.9 inch, pin cả ngày.',
        shortDescription: 'iPhone cao cấp nhất 2024 với A18 Pro và camera 48MP',
        price: 32990000,
        originalPrice: 35990000,
        image: IMAGES.iphone,
        images: [IMAGES.iphone],
        stock: 25,
        featured: true,
        status: 'active',
        highlights: ['Chip A18 Pro', 'Camera 48MP', 'Titanium Design', 'Pin 4422mAh'],
        specifications: {
            screen: '6.9 inch Super Retina XDR',
            cpu: 'Apple A18 Pro',
            ram: '8GB',
            storage: '256GB',
            camera: '48MP + 12MP + 12MP',
            battery: '4422mAh'
        },
        warranty: '12 tháng chính hãng Apple',
        variants: [
            { sku: 'IP16PM-256-NT', name: 'iPhone 16 Pro Max 256GB - Titan Tự Nhiên', type: 'nguyen-seal', attributes: { color: 'Titan Tự Nhiên', storage: '256GB' }, price: 32990000, originalPrice: 35990000, stock: 8, isActive: true, isFeatured: true },
            { sku: 'IP16PM-256-TD', name: 'iPhone 16 Pro Max 256GB - Titan Đen', type: 'nguyen-seal', attributes: { color: 'Titan Đen', storage: '256GB' }, price: 32990000, originalPrice: 35990000, stock: 7, isActive: true },
            { sku: 'IP16PM-512-NT', name: 'iPhone 16 Pro Max 512GB - Titan Tự Nhiên', type: 'nguyen-seal', attributes: { color: 'Titan Tự Nhiên', storage: '512GB' }, price: 37990000, originalPrice: 40990000, stock: 5, isActive: true },
            { sku: 'IP16PM-1TB-TD', name: 'iPhone 16 Pro Max 1TB - Titan Đen', type: 'nguyen-seal', attributes: { color: 'Titan Đen', storage: '1TB' }, price: 44990000, originalPrice: 47990000, stock: 3, isActive: true },
        ]
    },
    {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, khung Titanium bền bỉ, màn hình 6.7 inch siêu sáng.',
        shortDescription: 'iPhone Pro Max thế hệ 2023 với Titanium cao cấp',
        price: 28990000,
        originalPrice: 31990000,
        image: IMAGES.iphone,
        images: [IMAGES.iphone],
        stock: 30,
        featured: true,
        status: 'active',
        highlights: ['Chip A17 Pro', 'Camera 48MP', 'Titanium', 'Dynamic Island'],
        warranty: '12 tháng chính hãng',
        variants: [
            { sku: 'IP15PM-256-TT', name: 'iPhone 15 Pro Max 256GB - Titan Trắng', type: 'nguyen-seal', attributes: { color: 'Titan Trắng', storage: '256GB' }, price: 28990000, stock: 10, isActive: true, isFeatured: true },
            { sku: 'IP15PM-256-TX', name: 'iPhone 15 Pro Max 256GB - Titan Xanh', type: 'nguyen-seal', attributes: { color: 'Titan Xanh', storage: '256GB' }, price: 28990000, stock: 10, isActive: true },
            { sku: 'IP15PM-512-TT', name: 'iPhone 15 Pro Max 512GB - Titan Trắng', type: 'nguyen-seal', attributes: { color: 'Titan Trắng', storage: '512GB' }, price: 33990000, stock: 6, isActive: true },
        ]
    },
    {
        name: 'iPhone 14 Plus',
        slug: 'iphone-14-plus',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 14 Plus màn hình lớn 6.7 inch, chip A15 Bionic, camera kép 12MP, pin cực trâu.',
        shortDescription: 'iPhone màn hình lớn với giá tốt nhất 2024',
        price: 19990000,
        originalPrice: 22990000,
        image: IMAGES.iphone,
        images: [IMAGES.iphone],
        stock: 20,
        status: 'active',
        highlights: ['Màn hình 6.7"', 'Pin 4323mAh', 'A15 Bionic'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP14P-128-MN', name: 'iPhone 14 Plus 128GB - Midnight', type: 'nguyen-seal', attributes: { color: 'Midnight', storage: '128GB' }, price: 19990000, stock: 8, isActive: true },
            { sku: 'IP14P-256-BL', name: 'iPhone 14 Plus 256GB - Blue', type: 'nguyen-seal', attributes: { color: 'Blue', storage: '256GB' }, price: 22990000, stock: 7, isActive: true },
        ]
    },

    // ============ IPAD ============
    {
        name: 'iPad Pro M4 13 inch 2024',
        slug: 'ipad-pro-m4-13-2024',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Pro M4 mạnh nhất từ trước đến nay với chip M4, màn hình OLED Tandem siêu sáng, mỏng nhẹ nhất.',
        shortDescription: 'iPad Pro cao cấp với chip M4 và màn hình OLED',
        price: 35990000,
        originalPrice: 39990000,
        image: IMAGES.ipad,
        images: [IMAGES.ipad],
        stock: 10,
        featured: true,
        status: 'active',
        highlights: ['Chip M4', 'Màn hình OLED Tandem', 'Siêu mỏng 5.1mm', 'Thunderbolt'],
        warranty: '12 tháng chính hãng',
        variants: [
            { sku: 'IPADPM4-256-W', name: 'iPad Pro M4 13" 256GB Wifi - Silver', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB', color: 'Silver' }, price: 35990000, stock: 4, isActive: true, isFeatured: true },
            { sku: 'IPADPM4-512-W', name: 'iPad Pro M4 13" 512GB Wifi - Space Black', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '512GB', color: 'Space Black' }, price: 41990000, stock: 3, isActive: true },
            { sku: 'IPADPM4-256-C', name: 'iPad Pro M4 13" 256GB Cellular - Silver', type: 'nguyen-seal', model: 'wifi-cellular', attributes: { storage: '256GB', color: 'Silver' }, price: 42990000, stock: 2, isActive: true },
        ]
    },
    {
        name: 'iPad Air M2 11 inch 2024',
        slug: 'ipad-air-m2-11-2024',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Air M2 11 inch với hiệu năng mạnh mẽ, thiết kế nhẹ, hỗ trợ Apple Pencil Pro và Magic Keyboard.',
        shortDescription: 'iPad Air giá tốt với chip M2',
        price: 16990000,
        originalPrice: 18990000,
        image: IMAGES.ipad,
        images: [IMAGES.ipad],
        stock: 18,
        featured: true,
        status: 'active',
        highlights: ['Chip M2', 'Màn hình Liquid Retina 11"', 'Apple Pencil Pro'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPADAIR-128-W-BL', name: 'iPad Air M2 11" 128GB Wifi - Blue', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '128GB', color: 'Blue' }, price: 16990000, stock: 6, isActive: true, isFeatured: true },
            { sku: 'IPADAIR-256-W-PU', name: 'iPad Air M2 11" 256GB Wifi - Purple', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB', color: 'Purple' }, price: 19990000, stock: 7, isActive: true },
        ]
    },
    {
        name: 'iPad Gen 10 2022',
        slug: 'ipad-gen-10-2022',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Gen 10 với màn hình Liquid Retina 10.9 inch, chip A14 Bionic, giá cực tốt cho sinh viên.',
        shortDescription: 'iPad phổ thông giá rẻ cho học tập và giải trí',
        price: 10490000,
        originalPrice: 11990000,
        image: IMAGES.ipad,
        images: [IMAGES.ipad],
        stock: 35,
        status: 'active',
        highlights: ['Màn hình 10.9"', 'Chip A14', 'USB-C', 'Giá tốt nhất'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPAD10-64-W-BL', name: 'iPad 10 64GB Wifi - Blue', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '64GB', color: 'Blue' }, price: 10490000, stock: 15, isActive: true },
            { sku: 'IPAD10-64-W-SV', name: 'iPad 10 64GB Wifi - Silver', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '64GB', color: 'Silver' }, price: 10490000, stock: 12, isActive: true },
            { sku: 'IPAD10-64-C-BL', name: 'iPad 10 64GB Cellular - Blue', type: 'nguyen-seal', model: 'wifi-cellular', attributes: { storage: '64GB', color: 'Blue' }, price: 13990000, stock: 5, isActive: true },
        ]
    },

    // ============ MACBOOK ============
    {
        name: 'MacBook Air M3 15 inch 2024',
        slug: 'macbook-air-m3-15-2024',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Air M3 15 inch siêu mỏng nhẹ, màn hình Liquid Retina 15.3 inch, pin 18 giờ, hiệu năng vượt trội.',
        shortDescription: 'MacBook Air màn hình lớn với M3',
        price: 32990000,
        originalPrice: 35990000,
        image: IMAGES.macbook,
        images: [IMAGES.macbook],
        stock: 12,
        featured: true,
        status: 'active',
        highlights: ['Chip M3', 'Màn hình 15.3"', 'Pin 18h', 'Siêu mỏng 11.5mm'],
        specifications: {
            screen: '15.3 inch Liquid Retina',
            cpu: 'Apple M3 (8-core CPU, 10-core GPU)',
            ram: '8GB',
            storage: '256GB SSD',
            battery: 'Lên đến 18 giờ'
        },
        warranty: '12 tháng chính hãng',
        variants: [
            { sku: 'MBAM3-15-256-SL', name: 'MacBook Air M3 15" 8GB/256GB - Silver', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '256GB', color: 'Silver' }, price: 32990000, stock: 4, isActive: true, isFeatured: true },
            { sku: 'MBAM3-15-512-MN', name: 'MacBook Air M3 15" 8GB/512GB - Midnight', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '512GB', color: 'Midnight' }, price: 37990000, stock: 5, isActive: true },
            { sku: 'MBAM3-15-512-SG', name: 'MacBook Air M3 15" 16GB/512GB - Space Gray', type: 'nguyen-seal', attributes: { memory: '16GB', storage: '512GB', color: 'Space Gray' }, price: 42990000, stock: 2, isActive: true },
        ]
    },
    {
        name: 'MacBook Pro M4 14 inch 2024',
        slug: 'macbook-pro-m4-14-2024',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Pro M4 14 inch với hiệu năng đỉnh cao, màn hình Liquid Retina XDR, phù hợp cho chuyên gia.',
        shortDescription: 'MacBook Pro chuyên nghiệp với M4',
        price: 38990000,
        originalPrice: 42990000,
        image: IMAGES.macbook,
        images: [IMAGES.macbook],
        stock: 8,
        featured: true,
        status: 'active',
        highlights: ['Chip M4 Pro', 'XDR Display', 'Thunderbolt 4', 'Pin 18h'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MBPM4-14-512-SG', name: 'MacBook Pro M4 14" 18GB/512GB - Space Gray', type: 'nguyen-seal', attributes: { memory: '18GB', storage: '512GB', color: 'Space Gray' }, price: 38990000, stock: 3, isActive: true, isFeatured: true },
            { sku: 'MBPM4-14-1TB-SB', name: 'MacBook Pro M4 14" 18GB/1TB - Space Black', type: 'nguyen-seal', attributes: { memory: '18GB', storage: '1TB', color: 'Space Black' }, price: 46990000, stock: 2, isActive: true },
        ]
    },

    // ============ AIRPODS ============
    {
        name: 'AirPods Pro 2 (USB-C)',
        slug: 'airpods-pro-2-usbc',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động tuyệt vời, âm thanh không gian, case USB-C.',
        shortDescription: 'Tai nghe True Wireless cao cấp nhất của Apple',
        price: 5990000,
        originalPrice: 6990000,
        image: IMAGES.airpods,
        images: [IMAGES.airpods],
        stock: 50,
        featured: true,
        status: 'active',
        highlights: ['Chip H2', 'ANC xuất sắc', 'Âm thanh không gian', 'USB-C'],
        warranty: '12 tháng',
        variants: [
            { sku: 'APP2-USBC', name: 'AirPods Pro 2 USB-C', type: 'nguyen-seal', attributes: {}, price: 5990000, stock: 50, isActive: true, isFeatured: true }
        ]
    },
    {
        name: 'AirPods 3',
        slug: 'airpods-3',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'AirPods 3 với thiết kế mới, âm thanh không gian, kháng nước IPX4.',
        shortDescription: 'AirPods giá tốt cho mọi người',
        price: 4290000,
        originalPrice: 4990000,
        image: IMAGES.airpods,
        images: [IMAGES.airpods],
        stock: 60,
        status: 'active',
        highlights: ['Âm thanh không gian', 'IPX4', 'Pin 30h'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AP3-LIGHT', name: 'AirPods 3 Lightning', type: 'nguyen-seal', attributes: {}, price: 4290000, stock: 40, isActive: true },
            { sku: 'AP3-USBC', name: 'AirPods 3 USB-C', type: 'nguyen-seal', attributes: {}, price: 4490000, stock: 20, isActive: true }
        ]
    },

    // ============ APPLE WATCH ============
    {
        name: 'Apple Watch Series 10 GPS 42mm',
        slug: 'apple-watch-series-10-gps-42mm',
        category: 'apple-watch',
        brand: 'Apple',
        description: 'Apple Watch Series 10 với màn hình lớn hơn, mỏng hơn, chip S10 nhanh hơn, cảm biến sức khỏe toàn diện.',
        shortDescription: 'Đồng hồ thông minh cao cấp nhất 2024',
        price: 10990000,
        originalPrice: 11990000,
        image: IMAGES.watch,
        images: [IMAGES.watch],
        stock: 25,
        featured: true,
        status: 'active',
        highlights: ['Chip S10', 'Màn hình lớn', 'Cảm biến sức khỏe', 'WatchOS 11'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AWS10-42-AL-BL', name: 'Apple Watch S10 42mm Aluminum - Blue', type: 'nguyen-seal', attributes: { size: '42mm', color: 'Blue' }, price: 10990000, stock: 10, isActive: true, isFeatured: true },
            { sku: 'AWS10-42-AL-SV', name: 'Apple Watch S10 42mm Aluminum - Silver', type: 'nguyen-seal', attributes: { size: '42mm', color: 'Silver' }, price: 10990000, stock: 8, isActive: true },
            { sku: 'AWS10-46-AL-BL', name: 'Apple Watch S10 46mm Aluminum - Blue', type: 'nguyen-seal', attributes: { size: '46mm', color: 'Blue' }, price: 12490000, stock: 5, isActive: true },
        ]
    },
    {
        name: 'Apple Watch SE 2023 GPS 40mm',
        slug: 'apple-watch-se-2023-gps-40mm',
        category: 'apple-watch',
        brand: 'Apple',
        description: 'Apple Watch SE giá tốt nhất, đầy đủ tính năng cơ bản, phù hợp cho người mới dùng.',
        shortDescription: 'Apple Watch giá rẻ cho người mới',
        price: 6490000,
        originalPrice: 7490000,
        image: IMAGES.watch,
        images: [IMAGES.watch],
        stock: 40,
        status: 'active',
        highlights: ['Giá tốt', 'Chip S8', 'GPS tích hợp'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AWSE-40-MN', name: 'Apple Watch SE 40mm - Midnight', type: 'nguyen-seal', attributes: { size: '40mm', color: 'Midnight' }, price: 6490000, stock: 15, isActive: true },
            { sku: 'AWSE-44-ST', name: 'Apple Watch SE 44mm - Starlight', type: 'nguyen-seal', attributes: { size: '44mm', color: 'Starlight' }, price: 7290000, stock: 15, isActive: true }
        ]
    },

    // ============ PHỤ KIỆN ============
    {
        name: 'Cáp sạc USB-C to Lightning 1m',
        slug: 'cap-usbc-lightning-1m',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Cáp sạc nhanh và truyền dữ liệu chính hãng Apple, dài 1m, hỗ trợ sạc nhanh.',
        shortDescription: 'Cáp sạc chính hãng Apple',
        price: 590000,
        originalPrice: 690000,
        image: IMAGES.cable,
        images: [IMAGES.cable],
        stock: 100,
        status: 'active',
        highlights: ['Chính hãng Apple', 'Sạc nhanh', 'Dài 1m'],
        warranty: '12 tháng',
        variants: [
            { sku: 'CABLE-USBC-LT-1M', name: 'Cáp USB-C to Lightning 1m', type: 'nguyen-seal', attributes: {}, price: 590000, stock: 100, isActive: true }
        ]
    },
    {
        name: 'Ốp lưng Silicone iPhone 16 Pro Max',
        slug: 'op-lung-silicone-iphone-16-pro-max',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Ốp lưng Silicone chính hãng Apple cho iPhone 16 Pro Max, mềm mại, bảo vệ tốt.',
        shortDescription: 'Ốp lưng Silicone chính hãng',
        price: 1190000,
        originalPrice: 1390000,
        image: IMAGES.case,
        images: [IMAGES.case],
        stock: 80,
        status: 'active',
        highlights: ['Chính hãng Apple', 'Silicone cao cấp', 'MagSafe'],
        warranty: '12 tháng',
        variants: [
            { sku: 'CASE-IP16PM-BL', name: 'Ốp Silicone iPhone 16 Pro Max - Black', type: 'nguyen-seal', attributes: { color: 'Black' }, price: 1190000, stock: 20, isActive: true },
            { sku: 'CASE-IP16PM-BLU', name: 'Ốp Silicone iPhone 16 Pro Max - Blue', type: 'nguyen-seal', attributes: { color: 'Blue' }, price: 1190000, stock: 20, isActive: true },
            { sku: 'CASE-IP16PM-WH', name: 'Ốp Silicone iPhone 16 Pro Max - White', type: 'nguyen-seal', attributes: { color: 'White' }, price: 1190000, stock: 20, isActive: true },
        ]
    },
    {
        name: 'Củ sạc nhanh 20W USB-C',
        slug: 'cu-sac-20w-usb-c',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Củ sạc nhanh chính hãng Apple 20W cổng USB-C, sạc nhanh iPhone, iPad.',
        shortDescription: 'Củ sạc nhanh 20W chính hãng',
        price: 490000,
        originalPrice: 590000,
        image: IMAGES.cable,
        images: [IMAGES.cable],
        stock: 120,
        status: 'active',
        highlights: ['20W sạc siêu nhanh', 'Chính hãng Apple', 'USB-C'],
        warranty: '12 tháng',
        variants: [
            { sku: 'CHARGER-20W-USBC', name: 'Củ sạc 20W USB-C', type: 'nguyen-seal', attributes: {}, price: 490000, stock: 120, isActive: true }
        ]
    }
];

const seedProducts = async () => {
    try {
        console.log('🌱 Starting Product Seeding...\n');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing products
        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});
        console.log('✅ Cleared existing products\n');

        // Insert products
        console.log('📦 Inserting products...');
        const inserted = await Product.insertMany(PRODUCTS_DATA);
        console.log(`✅ Inserted ${inserted.length} products\n`);

        // Update category product counts
        console.log('📊 Updating category product counts...');
        const categories = await Category.find({ level: 0 });
        for (const category of categories) {
            try {
                await Category.updateProductCount(category._id);
                console.log(`   ✓ Updated ${category.name}`);
            } catch (err) {
                console.log(`   ⚠ Warning: Could not update ${category.name}: ${err.message}`);
            }
        }
        console.log('');

        console.log('🎉 Product seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   Total products: ${inserted.length}`);
        console.log(`   Featured products: ${inserted.filter(p => p.featured).length}`);
        console.log(`   Total variants: ${inserted.reduce((sum, p) => sum + (p.variants?.length || 0), 0)}`);
        console.log(`   Total stock: ${inserted.reduce((sum, p) => sum + p.stock, 0)}`);

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
