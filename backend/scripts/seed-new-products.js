/**
 * Seed Script - Thêm sản phẩm iPhone, Apple Watch, Phụ kiện
 * 
 * Run: node backend/scripts/seed-new-products.js
 * Chỉ thêm sản phẩm mới, không ảnh hưởng dữ liệu hiện có
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

// Ảnh từ Apple CDN và Unsplash (đảm bảo hoạt động)
const IMAGES = {
    // iPhone images
    iphone16pro: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=800&fmt=jpeg&qlt=95',
    iphone16promax: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-finish-select-202409-6-9inch-naturaltitanium?wid=800&fmt=jpeg&qlt=95',
    iphone16: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-teal?wid=800&fmt=jpeg&qlt=95',
    iphone15: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=800&fmt=jpeg&qlt=95',

    // Apple Watch images
    watchUltra2: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-2-702702?wid=800&fmt=jpeg&qlt=95',
    watchSeries10: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s10-702702?wid=800&fmt=jpeg&qlt=95',
    watchSE: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-se-702702?wid=800&fmt=jpeg&qlt=95',

    // Accessories images
    magsafeCharger: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=800&fmt=jpeg&qlt=95',
    magsafeBattery: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MJWY3?wid=800&fmt=jpeg&qlt=95',
    airtag: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-single-select-202104?wid=800&fmt=jpeg&qlt=95',
    appleWatch_band: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MXNX3ref?wid=800&fmt=jpeg&qlt=95',

    // Additional fallback images from Unsplash (verified working)
    iphone_general: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
    watch_general: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
    accessory_general: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
};

// Sản phẩm mới cần thêm
const NEW_PRODUCTS = [
    // ============ IPHONE ============
    {
        sku: 'IPHONE-16-PRO-MAX',
        name: 'iPhone 16 Pro Max | Chính hãng Apple',
        slug: 'iphone-16-pro-max',
        brand: 'Apple',
        description: 'iPhone 16 Pro Max với chip A18 Pro mạnh mẽ nhất, camera 48MP với zoom quang 5x, màn hình Super Retina XDR 6.9 inch, viền titanium sang trọng.',
        shortDescription: 'Chip A18 Pro, Camera 48MP 5x zoom',
        category: 'iphone',
        subcategory: 'iphone-16-pro',
        image: IMAGES.iphone16promax,
        images: [
            IMAGES.iphone16promax,
            IMAGES.iphone_general,
        ],
        variants: [
            {
                sku: 'IPHONE-16-PM-NS-256-DESERT',
                name: 'Nguyên Seal 256GB - Desert Titanium',
                type: 'nguyen-seal',
                attributes: { storage: '256GB', color: 'Desert Titanium' },
                price: 34990000,
                originalPrice: 37990000,
                stock: 5,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'IPHONE-16-PM-NS-256-NATURAL',
                name: 'Nguyên Seal 256GB - Natural Titanium',
                type: 'nguyen-seal',
                attributes: { storage: '256GB', color: 'Natural Titanium' },
                price: 34990000,
                originalPrice: 37990000,
                stock: 4,
                isActive: true
            },
            {
                sku: 'IPHONE-16-PM-NS-512-DESERT',
                name: 'Nguyên Seal 512GB - Desert Titanium',
                type: 'nguyen-seal',
                attributes: { storage: '512GB', color: 'Desert Titanium' },
                price: 42990000,
                originalPrice: 46990000,
                stock: 3,
                isActive: true
            },
            {
                sku: 'IPHONE-16-PM-NS-1TB-BLACK',
                name: 'Nguyên Seal 1TB - Black Titanium',
                type: 'nguyen-seal',
                attributes: { storage: '1TB', color: 'Black Titanium' },
                price: 50990000,
                originalPrice: 54990000,
                stock: 2,
                isActive: true
            },
            {
                sku: 'IPHONE-16-PM-OB-256-NATURAL',
                name: 'Openbox 256GB - Natural Titanium',
                type: 'openbox',
                attributes: { storage: '256GB', color: 'Natural Titanium' },
                price: 29990000,
                originalPrice: 37990000,
                stock: 3,
                isActive: true
            }
        ],
        specifications: {
            'Màn hình': '6.9 inch Super Retina XDR OLED',
            'Chip': 'Apple A18 Pro',
            'RAM': '8GB',
            'Camera sau': '48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto',
            'Camera trước': '12MP TrueDepth',
            'Pin': 'Lên đến 33 giờ phát video',
            'Kết nối': '5G, WiFi 7, USB 3',
            'Chất liệu': 'Titanium'
        },
        highlights: ['Chip A18 Pro mạnh mẽ nhất', 'Camera 48MP zoom 5x', 'Titanium cao cấp', 'Action Button'],
        tags: ['iPhone', 'iPhone 16', 'Pro Max', 'Titanium'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.9,
        reviewCount: 128,
        status: 'active',
        featured: true,
        isNew: true,
        isBestSeller: true
    },
    {
        sku: 'IPHONE-16-PRO',
        name: 'iPhone 16 Pro | Chính hãng Apple',
        slug: 'iphone-16-pro',
        brand: 'Apple',
        description: 'iPhone 16 Pro với chip A18 Pro, camera 48MP với zoom quang 5x, màn hình 6.3 inch, thiết kế titanium nhẹ nhàng.',
        shortDescription: 'Gọn nhẹ với sức mạnh Pro',
        category: 'iphone',
        subcategory: 'iphone-16-pro',
        image: IMAGES.iphone16pro,
        images: [IMAGES.iphone16pro, IMAGES.iphone_general],
        variants: [
            {
                sku: 'IPHONE-16-P-NS-256-DESERT',
                name: 'Nguyên Seal 256GB - Desert Titanium',
                type: 'nguyen-seal',
                attributes: { storage: '256GB', color: 'Desert Titanium' },
                price: 28990000,
                originalPrice: 31990000,
                stock: 6,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'IPHONE-16-P-NS-256-WHITE',
                name: 'Nguyên Seal 256GB - White Titanium',
                type: 'nguyen-seal',
                attributes: { storage: '256GB', color: 'White Titanium' },
                price: 28990000,
                originalPrice: 31990000,
                stock: 4,
                isActive: true
            },
            {
                sku: 'IPHONE-16-P-OB-256-DESERT',
                name: 'Openbox 256GB - Desert Titanium',
                type: 'openbox',
                attributes: { storage: '256GB', color: 'Desert Titanium' },
                price: 24990000,
                originalPrice: 31990000,
                stock: 3,
                isActive: true
            }
        ],
        specifications: {
            'Màn hình': '6.3 inch Super Retina XDR OLED',
            'Chip': 'Apple A18 Pro',
            'Camera sau': '48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto',
            'Pin': 'Lên đến 27 giờ phát video'
        },
        tags: ['iPhone', 'iPhone 16', 'Pro'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.8,
        reviewCount: 95,
        status: 'active',
        featured: true,
        isNew: true
    },
    {
        sku: 'IPHONE-16',
        name: 'iPhone 16 | Chính hãng Apple',
        slug: 'iphone-16',
        brand: 'Apple',
        description: 'iPhone 16 với chip A18, camera 48MP cải tiến, màu sắc mới tươi trẻ, Action Button tiện lợi.',
        shortDescription: 'Màu sắc mới, chip A18',
        category: 'iphone',
        subcategory: 'iphone-16',
        image: IMAGES.iphone16,
        images: [IMAGES.iphone16, IMAGES.iphone_general],
        variants: [
            {
                sku: 'IPHONE-16-NS-128-TEAL',
                name: 'Nguyên Seal 128GB - Teal',
                type: 'nguyen-seal',
                attributes: { storage: '128GB', color: 'Teal' },
                price: 22990000,
                originalPrice: 24990000,
                stock: 8,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'IPHONE-16-NS-128-PINK',
                name: 'Nguyên Seal 128GB - Pink',
                type: 'nguyen-seal',
                attributes: { storage: '128GB', color: 'Pink' },
                price: 22990000,
                originalPrice: 24990000,
                stock: 6,
                isActive: true
            },
            {
                sku: 'IPHONE-16-NS-256-TEAL',
                name: 'Nguyên Seal 256GB - Teal',
                type: 'nguyen-seal',
                attributes: { storage: '256GB', color: 'Teal' },
                price: 25990000,
                originalPrice: 28990000,
                stock: 4,
                isActive: true
            },
            {
                sku: 'IPHONE-16-OB-128-TEAL',
                name: 'Openbox 128GB - Teal',
                type: 'openbox',
                attributes: { storage: '128GB', color: 'Teal' },
                price: 18990000,
                originalPrice: 24990000,
                stock: 5,
                isActive: true
            }
        ],
        specifications: {
            'Màn hình': '6.1 inch Super Retina XDR',
            'Chip': 'Apple A18',
            'Camera sau': '48MP Fusion + 12MP Ultra Wide',
            'Pin': 'Lên đến 22 giờ phát video'
        },
        tags: ['iPhone', 'iPhone 16'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.7,
        reviewCount: 78,
        status: 'active',
        featured: true,
        isNew: true
    },
    {
        sku: 'IPHONE-15',
        name: 'iPhone 15 | Chính hãng Apple',
        slug: 'iphone-15',
        brand: 'Apple',
        description: 'iPhone 15 với Dynamic Island, camera 48MP, cổng USB-C tiện lợi, giá tốt.',
        shortDescription: 'Dynamic Island, USB-C',
        category: 'iphone',
        subcategory: 'iphone-15',
        image: IMAGES.iphone15,
        images: [IMAGES.iphone15],
        variants: [
            {
                sku: 'IPHONE-15-NS-128-BLUE',
                name: 'Nguyên Seal 128GB - Blue',
                type: 'nguyen-seal',
                attributes: { storage: '128GB', color: 'Blue' },
                price: 18990000,
                originalPrice: 21990000,
                stock: 10,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'IPHONE-15-NS-128-PINK',
                name: 'Nguyên Seal 128GB - Pink',
                type: 'nguyen-seal',
                attributes: { storage: '128GB', color: 'Pink' },
                price: 18990000,
                originalPrice: 21990000,
                stock: 7,
                isActive: true
            },
            {
                sku: 'IPHONE-15-OB-128-BLUE',
                name: 'Openbox 128GB - Blue',
                type: 'openbox',
                attributes: { storage: '128GB', color: 'Blue' },
                price: 14990000,
                originalPrice: 21990000,
                stock: 5,
                isActive: true
            },
            {
                sku: 'IPHONE-15-CPO-128-BLACK',
                name: 'CPO 128GB - Black',
                type: 'cpo',
                attributes: { storage: '128GB', color: 'Black' },
                price: 12990000,
                originalPrice: 21990000,
                stock: 4,
                isActive: true
            }
        ],
        specifications: {
            'Màn hình': '6.1 inch Super Retina XDR',
            'Chip': 'Apple A16 Bionic',
            'Camera sau': '48MP + 12MP',
            'Cổng sạc': 'USB-C'
        },
        tags: ['iPhone', 'iPhone 15'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.6,
        reviewCount: 156,
        status: 'active',
        featured: true
    },

    // ============ APPLE WATCH ============
    {
        sku: 'APPLE-WATCH-ULTRA-2',
        name: 'Apple Watch Ultra 2 | Chính hãng Apple',
        slug: 'apple-watch-ultra-2',
        brand: 'Apple',
        description: 'Apple Watch Ultra 2 với chip S9 SiP, màn hình 3000 nits siêu sáng, vỏ titanium chuẩn hàng không, GPS dual frequency cực chính xác.',
        shortDescription: 'Titanium chuẩn quân sự, 3000 nits',
        category: 'apple-watch',
        subcategory: 'apple-watch-ultra',
        image: IMAGES.watchUltra2,
        images: [IMAGES.watchUltra2, IMAGES.watch_general],
        variants: [
            {
                sku: 'AW-ULTRA-2-NS-ORANGE',
                name: 'Nguyên Seal - Dây Alpine Orange',
                type: 'nguyen-seal',
                attributes: { size: '49mm', band: 'Alpine Orange' },
                price: 21990000,
                originalPrice: 24990000,
                stock: 4,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'AW-ULTRA-2-NS-BLACK',
                name: 'Nguyên Seal - Dây Ocean Black',
                type: 'nguyen-seal',
                attributes: { size: '49mm', band: 'Ocean Black' },
                price: 21990000,
                originalPrice: 24990000,
                stock: 3,
                isActive: true
            },
            {
                sku: 'AW-ULTRA-2-OB-ORANGE',
                name: 'Openbox - Dây Alpine Orange',
                type: 'openbox',
                attributes: { size: '49mm', band: 'Alpine Orange' },
                price: 17990000,
                originalPrice: 24990000,
                stock: 2,
                isActive: true
            }
        ],
        specifications: {
            'Kích thước': '49mm',
            'Chip': 'Apple S9 SiP',
            'Màn hình': 'LTPO OLED 3000 nits',
            'Chất liệu': 'Titanium Grade 5',
            'Kháng nước': '100m + EN13319 diving',
            'Pin': 'Lên đến 36 giờ (72 giờ Low Power)',
            'GPS': 'Dual-frequency L1/L5'
        },
        tags: ['Apple Watch', 'Ultra 2', 'Titanium', 'Diving'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.9,
        reviewCount: 62,
        status: 'active',
        featured: true,
        isNew: true
    },
    {
        sku: 'APPLE-WATCH-SERIES-10',
        name: 'Apple Watch Series 10 | Chính hãng Apple',
        slug: 'apple-watch-series-10',
        brand: 'Apple',
        description: 'Apple Watch Series 10 mỏng nhẹ nhất từ trước đến nay với màn hình Wide Angle OLED lớn hơn, chip S10, sạc nhanh hơn.',
        shortDescription: 'Mỏng nhất, màn hình lớn nhất',
        category: 'apple-watch',
        subcategory: 'apple-watch-series',
        image: IMAGES.watchSeries10,
        images: [IMAGES.watchSeries10, IMAGES.watch_general],
        variants: [
            {
                sku: 'AW-S10-NS-42-JET-BLACK',
                name: 'Nguyên Seal 42mm - Jet Black Aluminum',
                type: 'nguyen-seal',
                attributes: { size: '42mm', color: 'Jet Black' },
                price: 11990000,
                originalPrice: 13990000,
                stock: 6,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'AW-S10-NS-46-SILVER',
                name: 'Nguyên Seal 46mm - Silver Aluminum',
                type: 'nguyen-seal',
                attributes: { size: '46mm', color: 'Silver' },
                price: 12990000,
                originalPrice: 15990000,
                stock: 5,
                isActive: true
            },
            {
                sku: 'AW-S10-NS-46-GOLD-TI',
                name: 'Nguyên Seal 46mm - Gold Titanium',
                type: 'nguyen-seal',
                attributes: { size: '46mm', color: 'Gold Titanium' },
                price: 19990000,
                originalPrice: 22990000,
                stock: 3,
                isActive: true
            },
            {
                sku: 'AW-S10-OB-42-JET-BLACK',
                name: 'Openbox 42mm - Jet Black',
                type: 'openbox',
                attributes: { size: '42mm', color: 'Jet Black' },
                price: 9990000,
                originalPrice: 13990000,
                stock: 4,
                isActive: true
            }
        ],
        specifications: {
            'Kích thước': '42mm / 46mm',
            'Chip': 'Apple S10 SiP',
            'Màn hình': 'Wide Angle OLED, Always-On',
            'Kháng nước': '50m WR',
            'Pin': 'Lên đến 18 giờ'
        },
        tags: ['Apple Watch', 'Series 10'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.8,
        reviewCount: 45,
        status: 'active',
        featured: true,
        isNew: true
    },
    {
        sku: 'APPLE-WATCH-SE-2024',
        name: 'Apple Watch SE 2024 | Chính hãng Apple',
        slug: 'apple-watch-se-2024',
        brand: 'Apple',
        description: 'Apple Watch SE 2024 giá tốt với đầy đủ tính năng theo dõi sức khỏe, tập luyện, và kết nối.',
        shortDescription: 'Giá tốt, tính năng đầy đủ',
        category: 'apple-watch',
        subcategory: 'apple-watch-se',
        image: IMAGES.watchSE,
        images: [IMAGES.watchSE],
        variants: [
            {
                sku: 'AW-SE-24-NS-40-SILVER',
                name: 'Nguyên Seal 40mm - Silver',
                type: 'nguyen-seal',
                attributes: { size: '40mm', color: 'Silver' },
                price: 6290000,
                originalPrice: 7490000,
                stock: 10,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'AW-SE-24-NS-44-MIDNIGHT',
                name: 'Nguyên Seal 44mm - Midnight',
                type: 'nguyen-seal',
                attributes: { size: '44mm', color: 'Midnight' },
                price: 6990000,
                originalPrice: 8290000,
                stock: 8,
                isActive: true
            },
            {
                sku: 'AW-SE-24-OB-40-SILVER',
                name: 'Openbox 40mm - Silver',
                type: 'openbox',
                attributes: { size: '40mm', color: 'Silver' },
                price: 4990000,
                originalPrice: 7490000,
                stock: 5,
                isActive: true
            }
        ],
        specifications: {
            'Kích thước': '40mm / 44mm',
            'Chip': 'Apple S8 SiP',
            'Kháng nước': '50m WR',
            'Pin': 'Lên đến 18 giờ'
        },
        tags: ['Apple Watch', 'SE'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.5,
        reviewCount: 89,
        status: 'active',
        featured: true
    },

    // ============ PHỤ KIỆN ============
    {
        sku: 'MAGSAFE-CHARGER',
        name: 'Sạc MagSafe 15W | Chính hãng Apple',
        slug: 'sac-magsafe-15w',
        brand: 'Apple',
        description: 'Bộ sạc không dây MagSafe 15W với nam châm gắn chặt, sạc nhanh cho iPhone 12 trở lên.',
        shortDescription: 'Sạc không dây 15W, nam châm mạnh',
        category: 'phu-kien-apple',
        subcategory: 'sac-cap',
        image: IMAGES.magsafeCharger,
        images: [IMAGES.magsafeCharger, IMAGES.accessory_general],
        variants: [
            {
                sku: 'MAGSAFE-1M-NS',
                name: 'Nguyên Seal - 1m',
                type: 'nguyen-seal',
                attributes: { length: '1m' },
                price: 1090000,
                originalPrice: 1290000,
                stock: 20,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'MAGSAFE-1M-OB',
                name: 'Openbox - 1m',
                type: 'openbox',
                attributes: { length: '1m' },
                price: 890000,
                originalPrice: 1290000,
                stock: 8,
                isActive: true
            }
        ],
        specifications: {
            'Công suất': '15W',
            'Tương thích': 'iPhone 12 trở lên',
            'Chiều dài': '1m'
        },
        tags: ['MagSafe', 'Sạc', 'Phụ kiện'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.6,
        reviewCount: 234,
        status: 'active',
        featured: true
    },
    {
        sku: 'MAGSAFE-BATTERY-PACK',
        name: 'MagSafe Battery Pack | Chính hãng Apple',
        slug: 'magsafe-battery-pack',
        brand: 'Apple',
        description: 'Pin dự phòng MagSafe gắn từ tính, sạc không dây cho iPhone khi di chuyển.',
        shortDescription: 'Pin dự phòng gắn nam châm',
        category: 'phu-kien-apple',
        subcategory: 'pin-sac',
        image: IMAGES.magsafeBattery,
        images: [IMAGES.magsafeBattery],
        variants: [
            {
                sku: 'MAGSAFE-BATTERY-NS',
                name: 'Nguyên Seal',
                type: 'nguyen-seal',
                attributes: {},
                price: 2490000,
                originalPrice: 2890000,
                stock: 12,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'MAGSAFE-BATTERY-OB',
                name: 'Openbox',
                type: 'openbox',
                attributes: {},
                price: 1990000,
                originalPrice: 2890000,
                stock: 5,
                isActive: true
            }
        ],
        specifications: {
            'Dung lượng': '1460mAh',
            'Đầu ra': '5W (7.5W khi sạc iPhone)',
            'Tương thích': 'iPhone 12 trở lên'
        },
        tags: ['MagSafe', 'Pin', 'Phụ kiện'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.4,
        reviewCount: 67,
        status: 'active',
        featured: true
    },
    {
        sku: 'AIRTAG-4-PACK',
        name: 'AirTag 4 Pack | Chính hãng Apple',
        slug: 'airtag-4-pack',
        brand: 'Apple',
        description: 'Bộ 4 AirTag giúp tìm kiếm đồ vật dễ dàng với Find My network, pin lâu 1 năm, kháng nước IP67.',
        shortDescription: 'Bộ 4, Find My, IP67',
        category: 'phu-kien-apple',
        subcategory: 'airtag',
        image: IMAGES.airtag,
        images: [IMAGES.airtag, IMAGES.accessory_general],
        variants: [
            {
                sku: 'AIRTAG-4-NS',
                name: 'Nguyên Seal - Bộ 4',
                type: 'nguyen-seal',
                attributes: { quantity: '4 pack' },
                price: 2990000,
                originalPrice: 3490000,
                stock: 15,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'AIRTAG-4-OB',
                name: 'Openbox - Bộ 4',
                type: 'openbox',
                attributes: { quantity: '4 pack' },
                price: 2490000,
                originalPrice: 3490000,
                stock: 4,
                isActive: true
            }
        ],
        specifications: {
            'Số lượng': '4 cái',
            'Pin': 'CR2032 (1 năm)',
            'Kháng nước': 'IP67',
            'Kết nối': 'Bluetooth, UWB, NFC'
        },
        tags: ['AirTag', 'Find My', 'Phụ kiện'],
        warranty: '12 tháng chính hãng Apple',
        rating: 4.7,
        reviewCount: 189,
        status: 'active',
        featured: true,
        isBestSeller: true
    },
    {
        sku: 'APPLE-WATCH-SPORT-BAND',
        name: 'Dây Apple Watch Sport Band | Chính hãng Apple',
        slug: 'day-apple-watch-sport-band',
        brand: 'Apple',
        description: 'Dây đeo Sport Band chính hãng Apple với chất liệu fluoroelastomer cao cấp, thoáng khí, chống nước.',
        shortDescription: 'Dây Sport cao cấp',
        category: 'phu-kien-apple',
        subcategory: 'day-deo-watch',
        image: IMAGES.appleWatch_band,
        images: [IMAGES.appleWatch_band],
        variants: [
            {
                sku: 'SPORT-BAND-41-MIDNIGHT',
                name: '41mm - Midnight',
                type: 'nguyen-seal',
                attributes: { size: '41mm', color: 'Midnight' },
                price: 1190000,
                originalPrice: 1490000,
                stock: 12,
                isActive: true,
                isFeatured: true
            },
            {
                sku: 'SPORT-BAND-45-STARLIGHT',
                name: '45mm - Starlight',
                type: 'nguyen-seal',
                attributes: { size: '45mm', color: 'Starlight' },
                price: 1190000,
                originalPrice: 1490000,
                stock: 10,
                isActive: true
            },
            {
                sku: 'SPORT-BAND-41-STORM-BLUE',
                name: '41mm - Storm Blue',
                type: 'nguyen-seal',
                attributes: { size: '41mm', color: 'Storm Blue' },
                price: 1190000,
                originalPrice: 1490000,
                stock: 8,
                isActive: true
            }
        ],
        specifications: {
            'Chất liệu': 'Fluoroelastomer',
            'Kích thước': '41mm hoặc 45mm',
            'Tương thích': 'Apple Watch Series 4 trở lên'
        },
        tags: ['Apple Watch', 'Dây đeo', 'Sport Band'],
        warranty: '6 tháng',
        rating: 4.5,
        reviewCount: 156,
        status: 'active',
        featured: false
    }
];

// Main seed function
const seedNewProducts = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/apple-store';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check required categories exist
        const requiredCategories = ['iphone', 'apple-watch', 'phu-kien-apple'];
        const existingCategories = await Category.find({ slug: { $in: requiredCategories } });
        const existingSlugs = existingCategories.map(c => c.slug);

        const missingCategories = requiredCategories.filter(s => !existingSlugs.includes(s));
        if (missingCategories.length > 0) {
            console.log('⚠️  Thiếu categories:', missingCategories.join(', '));
            console.log('   Sẽ tự tạo categories mới...');

            // Create missing categories
            for (const slug of missingCategories) {
                const catData = {
                    'iphone': { name: 'iPhone', slug: 'iphone', icon: 'FiSmartphone', order: 1 },
                    'apple-watch': { name: 'Apple Watch', slug: 'apple-watch', icon: 'FiWatch', order: 5 },
                    'phu-kien-apple': { name: 'Phụ kiện Apple', slug: 'phu-kien-apple', icon: 'FiPackage', order: 6 }
                }[slug];

                if (catData) {
                    await Category.create({
                        ...catData,
                        isActive: true,
                        showInMenu: true,
                        level: 0
                    });
                    console.log(`   ✅ Created category: ${catData.name}`);
                }
            }
        }

        // Insert products (skip if SKU already exists)
        let insertedCount = 0;
        let skippedCount = 0;

        for (const product of NEW_PRODUCTS) {
            const exists = await Product.findOne({ sku: product.sku });
            if (exists) {
                console.log(`   ⏭️  Skip (exist): ${product.name}`);
                skippedCount++;
                continue;
            }

            // Calculate stock from variants
            const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

            // Calculate min price from variants
            const prices = product.variants.map(v => v.price).filter(p => p > 0);
            const minPrice = prices.length > 0 ? Math.min(...prices) : product.price || 0;

            await Product.create({
                ...product,
                stock: totalStock,
                price: minPrice,
                currency: 'VND'
            });

            console.log(`   ✅ Created: ${product.name}`);
            insertedCount++;
        }

        console.log('\n📊 Kết quả:');
        console.log(`   - Đã thêm: ${insertedCount} sản phẩm`);
        console.log(`   - Đã bỏ qua: ${skippedCount} sản phẩm (đã tồn tại)`);

        // Update category product counts
        console.log('\n🔄 Cập nhật productCount cho categories...');
        const allCategories = await Category.find({});
        for (const cat of allCategories) {
            await Category.updateProductCount(cat._id);
        }
        console.log('✅ Done!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
};

// Run
seedNewProducts();
