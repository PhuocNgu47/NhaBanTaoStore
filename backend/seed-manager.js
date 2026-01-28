/**
 * 🌱 SEED DATA MANAGER - An toàn, không mất dữ liệu cũ
 * 
 * Script này quản lý việc seed dữ liệu một cách AN TOÀN.
 * Khác với các script seed cũ, script này:
 *   1. KHÔNG xóa dữ liệu cũ trừ khi bạn chọn mode '--reset'
 *   2. Chỉ THÊM sản phẩm mới (mode '--add')
 *   3. Có thể backup trước khi thay đổi (mode '--backup')
 * 
 * Cách sử dụng:
 *   node seed-manager.js --add        # Chỉ thêm sản phẩm mới, giữ nguyên cũ
 *   node seed-manager.js --reset      # Xóa tất cả và seed lại từ đầu (CẨN THẬN!)
 *   node seed-manager.js --backup     # Export dữ liệu hiện tại ra file JSON
 *   node seed-manager.js --restore    # Import dữ liệu từ file backup
 * 
 * ⚠️ LƯU Ý QUAN TRỌNG:
 *   - Mặc định là mode '--add' để an toàn
 *   - Mode '--reset' sẽ XÓA TOÀN BỘ sản phẩm, chỉ dùng khi thật sự cần
 *   - Luôn chạy '--backup' trước '--reset' nếu có dữ liệu quan trọng
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import Category from './models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ HÌNH ẢNH SẢN PHẨM - CHẤT LƯỢNG CAO ============
const IMAGES = {
    iphone17: 'https://images.unsplash.com/photo-1592286927505-c1f0d0e9ec2c?w=800',
    iphone15: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800',
    iphone14: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800',
    iphone11: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
    ipad: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    airpods: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
    watch: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
    charger: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
};

// ============ DỮ LIỆU SẢN PHẨM ĐẦY ĐỦ & CHÍNH XÁC TỪ APPLE ============
const SEED_PRODUCTS = [
    // ═══════════════════════════════════════════════════════════
    // 📱 IPHONE 17 SERIES - Ra mắt 09/2025
    // ═══════════════════════════════════════════════════════════
    {
        name: 'iPhone 17 Pro Max',
        slug: 'iphone-17-pro-max',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 17 Pro Max - Flagship đỉnh cao 2025 với chip A19 Pro mạnh mẽ nhất, màn hình Super Retina XDR OLED 6.9 inch độ sáng lên tới 3000 nits, hệ thống 3 camera 48MP với zoom quang học 8x. Khung Titanium Grade 5 sang trọng, pin 5000mAh cho thời lượng sử dụng lên tới 39 giờ xem video. Hỗ trợ Wi-Fi 7, Bluetooth 6 và iOS 26.',
        shortDescription: 'Chip A19 Pro | Màn hình 6.9" OLED 3000 nits | Camera 48MP zoom 8x | Titanium | Pin 39 giờ',
        price: 36650000,
        originalPrice: 38000000,
        image: IMAGES.iphone17,
        stock: 40,
        featured: true,
        status: 'active',
        highlights: ['Chip A19 Pro 6 lõi', 'Màn hình 6.9" Super Retina XDR', 'Camera 48MP zoom quang 8x', 'Khung Titanium Grade 5', 'Pin 39h xem video', 'Ceramic Shield 2'],
        specifications: {
            'Màn hình': '6.9 inch Super Retina XDR OLED, 2796x1290 pixels, 120Hz ProMotion',
            'Độ sáng': '1000 nits (tiêu chuẩn), 3000 nits (ngoài trời)',
            'Chip': 'A19 Pro (6-core CPU, 6-core GPU, 16-core Neural Engine)',
            'RAM': '8GB',
            'Camera sau': '48MP (Main) + 48MP (Ultra Wide) + 48MP (Telephoto 8x zoom)',
            'Camera trước': '18MP Center Stage',
            'Pin': '5000mAh, sạc nhanh 40W (50% trong 20 phút)',
            'Kết nối': 'Wi-Fi 7, Bluetooth 6, 5G, Thread',
            'Chống nước': 'IP68 (6m trong 30 phút)',
            'Hệ điều hành': 'iOS 26'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP17PM-256-VNA', name: 'iPhone 17 Pro Max 256GB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 36650000, stock: 10, isActive: true, isFeatured: true },
            { sku: 'IP17PM-512-VNA', name: 'iPhone 17 Pro Max 512GB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 42200000, stock: 10, isActive: true },
            { sku: 'IP17PM-1TB-VNA', name: 'iPhone 17 Pro Max 1TB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '1TB' }, price: 50200000, stock: 10, isActive: true },
            { sku: 'IP17PM-2TB-VNA', name: 'iPhone 17 Pro Max 2TB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '2TB' }, price: 61800000, stock: 10, isActive: true },
        ]
    },
    {
        name: 'iPhone 17 Pro',
        slug: 'iphone-17-pro',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 17 Pro - Hiệu năng chuyên nghiệp trong thiết kế nhỏ gọn. Trang bị chip A19 Pro, camera 48MP với khả năng quay video ProRes RAW. Khung Titanium Grade 5 bền bỉ, màn hình 6.3" Super Retina XDR với ProMotion 120Hz. Action Button tùy chỉnh và Camera Control cho trải nghiệm nhiếp ảnh chuyên nghiệp.',
        shortDescription: 'Chip A19 Pro | Màn hình 6.3" OLED | Camera 48MP | Titanium | ProRes RAW',
        price: 32400000,
        originalPrice: 34000000,
        image: IMAGES.iphone17,
        stock: 35,
        featured: true,
        status: 'active',
        highlights: ['Chip A19 Pro', 'Màn hình 6.3" Super Retina XDR', 'Camera 48MP', 'Khung Titanium', 'Action Button', 'Camera Control'],
        specifications: {
            'Màn hình': '6.3 inch Super Retina XDR OLED, 120Hz ProMotion',
            'Chip': 'A19 Pro (6-core CPU, 6-core GPU)',
            'RAM': '8GB',
            'Camera sau': '48MP (Main) + 48MP (Ultra Wide) + 12MP (Telephoto)',
            'Camera trước': '18MP Center Stage',
            'Pin': 'Cả ngày sử dụng, sạc nhanh 40W',
            'Kết nối': 'Wi-Fi 7, Bluetooth 6, 5G',
            'Chống nước': 'IP68'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP17P-256-VNA', name: 'iPhone 17 Pro 256GB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 32400000, stock: 15, isActive: true },
            { sku: 'IP17P-512-VNA', name: 'iPhone 17 Pro 512GB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 39600000, stock: 10, isActive: true },
            { sku: 'IP17P-1TB-VNA', name: 'iPhone 17 Pro 1TB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '1TB' }, price: 0, stock: 0, isActive: true }, // Liên hệ
        ]
    },
    {
        name: 'iPhone Air',
        slug: 'iphone-air',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone Air - Chiếc iPhone mỏng nhất lịch sử với độ dày chỉ 5.6mm. Thiết kế đột phá với khung Titanium Grade 5 đánh bóng, màn hình 6.5" Super Retina XDR 120Hz ProMotion. Chip A19 Pro mạnh mẽ, camera 48MP chất lượng cao. Nặng chỉ 165g, nhẹ nhàng và sang trọng.',
        shortDescription: 'Mỏng 5.6mm | Màn hình 6.5" OLED 120Hz | Chip A19 Pro | Camera 48MP | Titanium',
        price: 24500000,
        originalPrice: 26000000,
        image: IMAGES.iphone17,
        stock: 30,
        featured: true,
        status: 'active',
        highlights: ['Mỏng nhất: 5.6mm', 'Nhẹ: 165g', 'Chip A19 Pro', 'Màn hình 6.5" 120Hz', 'Camera 48MP', 'Titanium đánh bóng'],
        specifications: {
            'Màn hình': '6.5 inch Super Retina XDR OLED, 120Hz ProMotion, 3000 nits',
            'Độ dày': '5.6mm - Mỏng nhất trong lịch sử iPhone',
            'Trọng lượng': '165g',
            'Chip': 'A19 Pro + N1 (Wi-Fi 7, Bluetooth 6) + C1X (modem 5G Apple)',
            'RAM': '8GB',
            'Camera sau': '48MP',
            'Camera trước': '18MP Center Stage',
            'Pin': '3149mAh, pin cả ngày',
            'Kết nối': 'eSIM only, Wi-Fi 7',
            'Màu sắc': 'Space Black, Cloud White, Light Gold, Sky Blue'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IPAIR-256-VNA', name: 'iPhone Air 256GB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 24500000, stock: 20, isActive: true },
            { sku: 'IPAIR-512-VNA', name: 'iPhone Air 512GB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 29600000, stock: 10, isActive: true },
            { sku: 'IPAIR-1TB-VNA', name: 'iPhone Air 1TB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '1TB' }, price: 0, stock: 0, isActive: true },
        ]
    },
    {
        name: 'iPhone 17',
        slug: 'iphone-17',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 17 - Phiên bản tiêu chuẩn với đầy đủ sức mạnh. Chip A19 hiệu năng cao, camera kép 48MP với Photonic Engine, Dynamic Island thông minh. Màn hình 6.1" Super Retina XDR sắc nét. USB-C tiện lợi, 5G siêu tốc.',
        shortDescription: 'Chip A19 | Màn hình 6.1" OLED | Camera 48MP | Dynamic Island | USB-C',
        price: 24100000,
        originalPrice: 25500000,
        image: IMAGES.iphone17,
        stock: 50,
        status: 'active',
        highlights: ['Chip A19', 'Camera 48MP', 'Dynamic Island', 'Màn hình 6.1"', 'USB-C', '5G'],
        specifications: {
            'Màn hình': '6.1 inch Super Retina XDR OLED',
            'Chip': 'A19 Bionic',
            'Camera sau': '48MP Main + 12MP Ultra Wide',
            'Camera trước': '12MP',
            'Kết nối': 'USB-C, 5G, Wi-Fi 6E'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP17-256-VNA', name: 'iPhone 17 256GB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 24100000, stock: 30, isActive: true },
            { sku: 'IP17-512-VNA', name: 'iPhone 17 512GB - Chính hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 0, stock: 0, isActive: true },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // 📱 IPHONE 15 SERIES - Ra mắt 09/2023
    // ═══════════════════════════════════════════════════════════
    {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 15 Pro Max - Flagship hoàn hảo với chip A17 Pro 3nm đầu tiên, khung Titanium siêu bền nhẹ. Hệ thống camera 48MP với ống kính Tetraprism zoom quang 5x độc quyền. Màn hình 6.7" Super Retina XDR sáng lên tới 2000 nits, hỗ trợ HDR và Always-On Display.',
        shortDescription: 'Chip A17 Pro 3nm | Camera 48MP zoom 5x | Titanium | Màn hình 2000 nits',
        price: 0, // Liên hệ
        image: IMAGES.iphone15,
        stock: 0,
        status: 'active',
        highlights: ['Chip A17 Pro (3nm)', 'Camera 48MP zoom 5x Tetraprism', 'Khung Titanium', 'Action Button', 'Always-On Display', 'USB-C 3'],
        specifications: {
            'Màn hình': '6.7 inch Super Retina XDR OLED, 2796x1290, 460 ppi, 120Hz ProMotion',
            'Độ sáng': '1000 nits, 1600 nits HDR, 2000 nits outdoor',
            'Chip': 'A17 Pro (6-core CPU, 6-core GPU, 16-core Neural Engine)',
            'Camera sau': '48MP Main ƒ/1.78 + 12MP Ultra Wide ƒ/2.2 + 12MP Telephoto 5x ƒ/2.8',
            'Camera trước': '12MP TrueDepth ƒ/1.9',
            'Quay video': '4K 60fps, ProRes, Cinematic mode 4K 30fps',
            'Kết nối': 'USB-C 3.0, 5G, Wi-Fi 6E',
            'Chống nước': 'IP68 (6m trong 30 phút)'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP15PM-256-VNA', name: 'iPhone 15 Pro Max 256GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 0, stock: 0, isActive: true },
            { sku: 'IP15PM-512-VNA', name: 'iPhone 15 Pro Max 512GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 0, stock: 0, isActive: true },
            { sku: 'IP15PM-1TB-VNA', name: 'iPhone 15 Pro Max 1TB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '1TB' }, price: 0, stock: 0, isActive: true },
        ]
    },
    {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 15 Pro - Chip A17 Pro mạnh nhất, khung Titanium sang trọng, Action Button tiện lợi. Camera 48MP chuyên nghiệp với khả năng quay video ProRes. Màn hình 6.1" Dynamic Island thông minh, USB-C đa năng.',
        shortDescription: 'Chip A17 Pro | Camera 48MP | Titanium | Action Button',
        price: 0, // Liên hệ
        image: IMAGES.iphone15,
        stock: 0,
        status: 'active',
        highlights: ['Chip A17 Pro', 'Camera 48MP', 'Titanium', 'Action Button', 'USB-C 3'],
        specifications: {
            'Màn hình': '6.1 inch Super Retina XDR OLED, 120Hz ProMotion',
            'Chip': 'A17 Pro',
            'Camera sau': '48MP Main + 12MP Ultra Wide + 12MP Telephoto 3x',
            'Camera trước': '12MP TrueDepth',
            'Chống nước': 'IP68'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP15P-128-VNA', name: 'iPhone 15 Pro 128GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 0, stock: 0, isActive: true },
            { sku: 'IP15P-256-VNA', name: 'iPhone 15 Pro 256GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 0, stock: 0, isActive: true },
            { sku: 'IP15P-512-VNA', name: 'iPhone 15 Pro 512GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 0, stock: 0, isActive: true },
            { sku: 'IP15P-1TB-VNA', name: 'iPhone 15 Pro 1TB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '1TB' }, price: 0, stock: 0, isActive: true },
        ]
    },
    {
        name: 'iPhone 15 Plus',
        slug: 'iphone-15-plus',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 15 Plus - Màn hình lớn 6.7" Super Retina XDR cho trải nghiệm xem tuyệt vời. Chip A16 Bionic mạnh mẽ, camera 48MP với Photonic Engine. Dynamic Island thông minh, pin khủng cả ngày. USB-C tiện lợi.',
        shortDescription: 'Màn hình 6.7" | Chip A16 Bionic | Camera 48MP | Dynamic Island',
        price: 18500000,
        image: IMAGES.iphone15,
        stock: 15,
        status: 'active',
        highlights: ['Màn hình 6.7"', 'Chip A16 Bionic', 'Camera 48MP', 'Dynamic Island', 'Pin cả ngày', 'USB-C'],
        specifications: {
            'Màn hình': '6.7 inch Super Retina XDR OLED',
            'Chip': 'A16 Bionic',
            'Camera sau': '48MP Main + 12MP Ultra Wide',
            'Camera trước': '12MP',
            'Chống nước': 'IP68'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP15PL-128-VNA', name: 'iPhone 15 Plus 128GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 18500000, stock: 10, isActive: true },
            { sku: 'IP15PL-256-VNA', name: 'iPhone 15 Plus 256GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 0, stock: 0, isActive: true },
            { sku: 'IP15PL-512-VNA', name: 'iPhone 15 Plus 512GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 24300000, stock: 5, isActive: true },
        ]
    },
    {
        name: 'iPhone 15',
        slug: 'iphone-15',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 15 - Màu sắc rực rỡ, Dynamic Island thông minh. Camera 48MP lần đầu trên iPhone tiêu chuẩn với Photonic Engine. Chip A16 Bionic mạnh mẽ, USB-C tiện dụng. Ceramic Shield bảo vệ tối ưu.',
        shortDescription: 'Chip A16 Bionic | Camera 48MP | Dynamic Island | USB-C',
        price: 15800000,
        image: IMAGES.iphone15,
        stock: 20,
        status: 'active',
        highlights: ['Camera 48MP', 'Dynamic Island', 'Chip A16 Bionic', 'USB-C', 'Ceramic Shield', 'Màu sắc trẻ trung'],
        specifications: {
            'Màn hình': '6.1 inch Super Retina XDR OLED, 2556x1179, 460 ppi',
            'Chip': 'A16 Bionic',
            'Camera sau': '48MP Main ƒ/1.6 + 12MP Ultra Wide',
            'Camera trước': '12MP TrueDepth',
            'Quay video': '4K 60fps, Cinematic mode, Action mode',
            'Kết nối': 'USB-C, 5G, Wi-Fi 6',
            'Chống nước': 'IP68'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP15-128-VNA', name: 'iPhone 15 128GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 15800000, stock: 10, isActive: true },
            { sku: 'IP15-256-VNA', name: 'iPhone 15 256GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 18600000, stock: 8, isActive: true },
            { sku: 'IP15-512-VNA', name: 'iPhone 15 512GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 20800000, stock: 2, isActive: true },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // 📱 IPHONE 14 SERIES
    // ═══════════════════════════════════════════════════════════
    {
        name: 'iPhone 14 Plus',
        slug: 'iphone-14-plus',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 14 Plus - Màn hình lớn 6.7" pin cực khủng lên tới 26 giờ xem video. Chip A15 Bionic ổn định, camera 12MP với Photonic Engine nâng cao. Tính năng Crash Detection và Emergency SOS qua vệ tinh.',
        shortDescription: 'Màn hình 6.7" | Pin 26 giờ | Chip A15 Bionic | Camera 12MP',
        price: 17600000,
        image: IMAGES.iphone14,
        stock: 15,
        status: 'active',
        highlights: ['Màn hình 6.7"', 'Pin 26 giờ xem video', 'Chip A15 Bionic', 'Camera 12MP', 'Crash Detection'],
        specifications: {
            'Màn hình': '6.7 inch Super Retina XDR OLED, 2778x1284, 458 ppi',
            'Chip': 'A15 Bionic (6-core CPU, 5-core GPU)',
            'RAM': '6GB',
            'Camera sau': '12MP Main ƒ/1.5 + 12MP Ultra Wide ƒ/2.4',
            'Camera trước': '12MP ƒ/1.9 với autofocus',
            'Pin': '4325mAh, lên tới 26 giờ xem video',
            'Quay video': '4K 60fps, Cinematic mode 4K, Action mode',
            'Chống nước': 'IP68 (6m trong 30 phút)'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP14PL-128-VNA', name: 'iPhone 14 Plus 128GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 0, stock: 0, isActive: true },
            { sku: 'IP14PL-256-VNA', name: 'iPhone 14 Plus 256GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 17600000, stock: 10, isActive: true },
            { sku: 'IP14PL-512-VNA', name: 'iPhone 14 Plus 512GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 19300000, stock: 5, isActive: true },
        ]
    },
    {
        name: 'iPhone 14',
        slug: 'iphone-14',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 14 - Lựa chọn thông minh với hiệu năng A15 Bionic ổn định. Màn hình 6.1" Super Retina XDR sắc nét, camera 12MP cải tiến với Photonic Engine. Pin lên tới 20 giờ xem video. Màu sắc đa dạng: Midnight, Starlight, Blue, Purple, Yellow.',
        shortDescription: 'Chip A15 Bionic | Camera 12MP | Màn hình 6.1" | Crash Detection',
        price: 12900000,
        image: IMAGES.iphone14,
        stock: 30,
        status: 'active',
        highlights: ['Chip A15 Bionic', 'Camera 12MP', 'Màn hình 6.1"', 'Pin 20 giờ', 'Crash Detection', '5 màu sắc'],
        specifications: {
            'Màn hình': '6.1 inch Super Retina XDR OLED, 2532x1170, 460 ppi',
            'Độ sáng': 'HDR 1200 nits, Outdoor 2000 nits',
            'Chip': 'A15 Bionic (6-core CPU với 2 performance + 4 efficiency, 5-core GPU, 16-core Neural Engine)',
            'RAM': '6GB',
            'Camera sau': '12MP Main ƒ/1.5 (sensor-shift OIS) + 12MP Ultra Wide ƒ/2.4 (120°)',
            'Camera trước': '12MP ƒ/1.9',
            'Tính năng camera': 'Photonic Engine, Deep Fusion, Smart HDR 4, Night mode, Cinematic mode 4K',
            'Pin': '3279mAh, 20 giờ xem video, sạc nhanh 20W',
            'Chống nước': 'IP68 (6m trong 30 phút)',
            'Dual SIM': 'nano-SIM + eSIM'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP14-128-VNA', name: 'iPhone 14 128GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 12900000, stock: 15, isActive: true },
            { sku: 'IP14-256-VNA', name: 'iPhone 14 256GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 16000000, stock: 10, isActive: true },
            { sku: 'IP14-512-VNA', name: 'iPhone 14 512GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 16100000, stock: 5, isActive: true },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // 📱 IPHONE 11 SERIES
    // ═══════════════════════════════════════════════════════════
    {
        name: 'iPhone 11',
        slug: 'iphone-11',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 11 - Huyền thoại một thời, vẫn luôn đáng mua! Chip A13 Bionic mạnh mẽ, camera kép 12MP với Night mode ấn tượng. Màn hình Liquid Retina HD 6.1" màu sắc chuẩn. Pin bền bỉ cả ngày, chống nước IP68. Giá cực tốt cho người dùng phổ thông.',
        shortDescription: 'Chip A13 Bionic | Camera 12MP Night mode | Màn hình 6.1" | Giá tốt',
        price: 8450000,
        image: IMAGES.iphone11,
        stock: 40,
        status: 'active',
        highlights: ['Chip A13 Bionic', 'Camera 12MP Night mode', 'Màn hình 6.1" Liquid Retina', 'IP68 chống nước', 'Pin cả ngày', 'Giá rẻ nhất'],
        specifications: {
            'Màn hình': '6.1 inch Liquid Retina HD LCD, 1792x828, 326 ppi, True Tone',
            'Độ sáng': '625 nits',
            'Chip': 'A13 Bionic (6-core CPU, 4-core GPU, 8-core Neural Engine)',
            'RAM': '4GB',
            'Camera sau': '12MP Wide ƒ/1.8 (OIS) + 12MP Ultra Wide ƒ/2.4 (120°)',
            'Camera trước': '12MP TrueDepth ƒ/2.2',
            'Tính năng camera': 'Night mode, Portrait mode, Smart HDR, 4K 60fps',
            'Pin': '3110mAh, 17 giờ xem video',
            'Chống nước': 'IP68 (2m trong 30 phút)',
            'Màu sắc': 'Black, White, Green, Yellow, Purple, Red'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IP11-64-VNA', name: 'iPhone 11 64GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '64GB' }, price: 8450000, stock: 25, isActive: true },
            { sku: 'IP11-128-VNA', name: 'iPhone 11 128GB - Chính Hãng VN/A', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 10200000, stock: 15, isActive: true },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // 📱 IPAD PRO M4
    // ═══════════════════════════════════════════════════════════
    {
        name: 'iPad Pro M4 13 inch 2024',
        slug: 'ipad-pro-m4-13-2024',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Pro M4 13 inch - Siêu phẩm mỏng nhất của Apple! Chip M4 với CPU 10 lõi và GPU 10 lõi, mạnh hơn mọi laptop. Màn hình Ultra Retina XDR Tandem OLED 13" độ sáng 1600 nits HDR, màu sắc chính xác tuyệt đối. Hỗ trợ Apple Pencil Pro và Magic Keyboard.',
        shortDescription: 'Chip M4 | Màn hình OLED Tandem 13" | 1600 nits HDR | Mỏng nhất Apple',
        price: 35990000,
        originalPrice: 39990000,
        image: IMAGES.ipad,
        stock: 12,
        featured: true,
        status: 'active',
        highlights: ['Chip M4 (10-core CPU, 10-core GPU)', 'Màn hình Tandem OLED 13"', '1600 nits HDR', 'Apple Pencil Pro', 'Mỏng 5.1mm', '16-core Neural Engine'],
        specifications: {
            'Màn hình': '13 inch Ultra Retina XDR OLED, 2752x2064, 264 ppi',
            'Công nghệ': 'Tandem OLED, ProMotion 10-120Hz, Wide color P3, True Tone',
            'Độ sáng': '1000 nits SDR, 1600 nits HDR peak',
            'Chip': 'Apple M4 (10-core CPU, 10-core GPU, 16-core Neural Engine)',
            'RAM': '8GB (256/512GB) hoặc 16GB (1TB/2TB)',
            'Camera sau': '12MP Wide + LiDAR scanner',
            'Camera trước': '12MP Ultra Wide (landscape) + Center Stage',
            'Kết nối': 'Wi-Fi 6E, Bluetooth 5.3, USB-C Thunderbolt 4',
            'Pin': 'Cả ngày (10 giờ web/video)'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'IPADPM4-13-256-W', name: 'iPad Pro M4 13" 256GB Wi-Fi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB' }, price: 35990000, stock: 4, isActive: true },
            { sku: 'IPADPM4-13-512-W', name: 'iPad Pro M4 13" 512GB Wi-Fi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '512GB' }, price: 40990000, stock: 4, isActive: true },
            { sku: 'IPADPM4-13-256-C', name: 'iPad Pro M4 13" 256GB Cellular', type: 'nguyen-seal', model: 'wifi-cellular', attributes: { storage: '256GB' }, price: 39990000, stock: 4, isActive: true },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // 💻 MACBOOK AIR M3
    // ═══════════════════════════════════════════════════════════
    {
        name: 'MacBook Air M3 15 inch 2024',
        slug: 'macbook-air-m3-15-2024',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Air M3 15 inch - Laptop mỏng nhẹ nhưng mạnh mẽ! Chip Apple M3 với 8-core CPU, 10-core GPU và 16-core Neural Engine. Màn hình Liquid Retina 15.3" rộng rãi cho đa nhiệm. Pin khủng 18 giờ, chỉ nặng 1.51kg. Hoàn hảo cho sáng tạo nội dung.',
        shortDescription: 'Chip M3 8-core | Màn hình 15.3" Liquid Retina | Pin 18 giờ | 1.51kg',
        price: 32990000,
        originalPrice: 35990000,
        image: IMAGES.macbook,
        stock: 15,
        featured: true,
        status: 'active',
        highlights: ['Chip M3 (8-core CPU, 10-core GPU)', 'Màn hình 15.3" Liquid Retina', 'Pin 18 giờ', 'Nhẹ 1.51kg', 'MagSafe 3', 'Wi-Fi 6E'],
        specifications: {
            'Màn hình': '15.3 inch Liquid Retina, 2880x1864, 224 ppi, 500 nits, Wide color P3',
            'Chip': 'Apple M3 (8-core CPU: 4P+4E, 10-core GPU, 16-core Neural Engine)',
            'RAM': '8GB hoặc 16GB hoặc 24GB Unified Memory',
            'SSD': '256GB / 512GB / 1TB / 2TB',
            'Camera': '1080p FaceTime HD',
            'Âm thanh': '6 loa với Spatial Audio, 3 mic',
            'Pin': '66.5Wh, 18 giờ xem phim, 15 giờ web',
            'Cổng kết nối': '2x Thunderbolt/USB 4, MagSafe 3, 3.5mm jack',
            'Kết nối': 'Wi-Fi 6E (802.11ax), Bluetooth 5.3',
            'Trọng lượng': '1.51 kg',
            'Kích thước': '34.04 x 23.76 x 1.15 cm'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'MBAM3-15-8-256', name: 'MacBook Air M3 15" 8GB/256GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '256GB' }, price: 32990000, stock: 5, isActive: true },
            { sku: 'MBAM3-15-8-512', name: 'MacBook Air M3 15" 8GB/512GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '512GB' }, price: 37990000, stock: 5, isActive: true },
            { sku: 'MBAM3-15-16-512', name: 'MacBook Air M3 15" 16GB/512GB', type: 'nguyen-seal', attributes: { memory: '16GB', storage: '512GB' }, price: 42990000, stock: 5, isActive: true },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // 🎧 AIRPODS & WATCH
    // ═══════════════════════════════════════════════════════════
    {
        name: 'AirPods Pro 2 (USB-C)',
        slug: 'airpods-pro-2-usbc',
        category: 'airpods',
        brand: 'Apple',
        description: 'AirPods Pro 2 thế hệ mới với USB-C - Chip H2 mạnh mẽ, chống ồn ANC gấp 2 lần, Adaptive Audio thông minh. Âm thanh Spatial Audio với Personalized Profiles. Pin 6 giờ nghe nhạc, 30 giờ với case. Chống nước IPX4.',
        shortDescription: 'Chip H2 | ANC 2x | Adaptive Audio | Spatial Audio | USB-C | IPX4',
        price: 5990000,
        originalPrice: 6990000,
        image: IMAGES.airpods,
        stock: 60,
        featured: true,
        status: 'active',
        highlights: ['Chip H2', 'ANC mạnh gấp 2x', 'Adaptive Audio', 'Spatial Audio', 'USB-C', 'IPX4 chống nước'],
        specifications: {
            'Chip': 'Apple H2',
            'Chống ồn': 'Active Noise Cancellation (ANC) gấp 2 lần thế hệ 1',
            'Chế độ': 'ANC, Transparency, Adaptive Audio, Conversation Awareness',
            'Âm thanh': 'Spatial Audio với Personalized Profiles, Dolby Atmos',
            'Pin tai nghe': '6 giờ nghe nhạc (ANC on)',
            'Pin case': '30 giờ tổng cộng',
            'Sạc': 'USB-C, MagSafe, Qi wireless, Apple Watch charger',
            'Chống nước': 'IPX4',
            'Kết nối': 'Bluetooth 5.3'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'APP2-USBC', name: 'AirPods Pro 2 USB-C', type: 'nguyen-seal', attributes: {}, price: 5990000, stock: 60, isActive: true }
        ]
    },
    {
        name: 'Apple Watch Series 10 GPS',
        slug: 'apple-watch-series-10',
        category: 'apple-watch',
        brand: 'Apple',
        description: 'Apple Watch Series 10 - Màn hình lớn nhất từ trước đến nay! Chip S10 mạnh mẽ, màn hình OLED Wide Angle sáng hơn 40%. Theo dõi sức khỏe toàn diện: ECG, SpO2, nhiệt độ cơ thể. Sạc nhanh 80% trong 30 phút. WatchOS 11 với các tính năng AI mới.',
        shortDescription: 'Chip S10 | Màn hình Wide Angle | ECG + SpO2 | WatchOS 11',
        price: 10990000,
        originalPrice: 11990000,
        image: IMAGES.watch,
        stock: 30,
        featured: true,
        status: 'active',
        highlights: ['Chip S10', 'Màn hình Wide Angle lớn nhất', 'ECG + SpO2', 'WatchOS 11', 'Sạc nhanh 80% trong 30 phút'],
        specifications: {
            'Chip': 'Apple S10 SiP',
            'Màn hình': 'OLED Wide Angle, Always-On, sáng hơn 40%',
            'Kích thước': '42mm hoặc 46mm',
            'Sức khỏe': 'ECG, SpO2, Heart Rate, Temperature sensing, Sleep tracking',
            'GPS': 'GPS/GNSS độ chính xác cao',
            'Chống nước': 'WR50 (bơi 50m)',
            'Pin': '18 giờ sử dụng, sạc 80% trong 30 phút',
            'Kết nối': 'Bluetooth 5.3, Wi-Fi, NFC (Apple Pay)'
        },
        warranty: '12 tháng chính hãng Apple VN/A',
        variants: [
            { sku: 'AWS10-42-AL', name: 'Apple Watch S10 42mm Aluminum', type: 'nguyen-seal', attributes: { size: '42mm' }, price: 10990000, stock: 15, isActive: true },
            { sku: 'AWS10-46-AL', name: 'Apple Watch S10 46mm Aluminum', type: 'nguyen-seal', attributes: { size: '46mm' }, price: 12490000, stock: 15, isActive: true }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // 🔌 PHỤ KIỆN
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Củ sạc nhanh 20W USB-C Apple',
        slug: 'cu-sac-20w-usbc-apple',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Củ sạc Apple 20W USB-C chính hãng - Sạc nhanh iPhone lên 50% chỉ trong 30 phút. Công suất 20W tối ưu cho iPhone 15/14/13/12 và AirPods. Thiết kế nhỏ gọn, an toàn với hệ thống bảo vệ của Apple.',
        shortDescription: 'Sạc nhanh 20W | 50% trong 30 phút | Chính hãng Apple',
        price: 490000,
        originalPrice: 590000,
        image: IMAGES.charger,
        stock: 150,
        status: 'active',
        highlights: ['20W sạc nhanh', '50% trong 30 phút', 'USB-C', 'Chính hãng Apple', 'Bảo vệ nhiệt'],
        specifications: {
            'Công suất': '20W',
            'Cổng': 'USB-C',
            'Tương thích': 'iPhone, iPad, AirPods',
            'Chuẩn sạc': 'USB Power Delivery (USB-PD)'
        },
        warranty: '12 tháng chính hãng Apple',
        variants: [
            { sku: 'CHARGER-20W', name: 'Củ sạc 20W USB-C', type: 'nguyen-seal', attributes: {}, price: 490000, stock: 150, isActive: true }
        ]
    }
];

// ============ CÁC HÀM QUẢN LÝ ============

/**
 * MODE: --add
 * Thêm sản phẩm mới mà KHÔNG xóa dữ liệu cũ
 */
async function addProducts() {
    console.log('📦 Mode: ADD - Thêm sản phẩm mới (giữ nguyên dữ liệu cũ)\n');

    const existingSlugs = await Product.distinct('slug');
    console.log(`   📌 Đang có ${existingSlugs.length} sản phẩm trong database`);

    const newProducts = SEED_PRODUCTS.filter(p => !existingSlugs.includes(p.slug));

    if (newProducts.length === 0) {
        console.log('   ✅ Không có sản phẩm mới để thêm.');
        return [];
    }

    console.log(`   🆕 Sẽ thêm ${newProducts.length} sản phẩm mới`);

    const inserted = await Product.insertMany(newProducts);
    console.log(`   ✅ Đã thêm ${inserted.length} sản phẩm mới!`);

    return inserted;
}

/**
 * MODE: --reset
 * Xóa tất cả và seed lại
 */
async function resetProducts() {
    console.log('🔄 Mode: RESET - Xóa tất cả và seed lại\n');

    const countBefore = await Product.countDocuments();
    console.log(`   ⚠️  Sẽ xóa ${countBefore} sản phẩm hiện tại`);

    await Product.deleteMany({});
    console.log('   🗑️  Đã xóa xong');

    const inserted = await Product.insertMany(SEED_PRODUCTS);
    console.log(`   ✅ Đã thêm ${inserted.length} sản phẩm mới`);

    return inserted;
}

/**
 * MODE: --backup
 */
async function backupProducts() {
    console.log('💾 Mode: BACKUP\n');

    const products = await Product.find({}).lean();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupPath = path.join(backupDir, `products-backup-${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(products, null, 2), 'utf8');

    console.log(`   ✅ Đã backup ${products.length} sản phẩm`);
    console.log(`   📁 File: ${backupPath}`);

    return products;
}

/**
 * MODE: --restore
 */
async function restoreProducts() {
    console.log('🔄 Mode: RESTORE\n');

    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
        console.log('   ❌ Không tìm thấy thư mục backups');
        return [];
    }

    const files = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('products-backup-'))
        .sort()
        .reverse();

    if (files.length === 0) {
        console.log('   ❌ Không có file backup');
        return [];
    }

    const latestBackup = path.join(backupDir, files[0]);
    console.log(`   📁 Restore từ: ${files[0]}`);

    const products = JSON.parse(fs.readFileSync(latestBackup, 'utf8'));

    await Product.deleteMany({});

    const cleanProducts = products.map(p => {
        const { _id, __v, ...rest } = p;
        return rest;
    });

    const inserted = await Product.insertMany(cleanProducts);
    console.log(`   ✅ Đã restore ${inserted.length} sản phẩm`);

    return inserted;
}

/**
 * Cập nhật số lượng category
 */
async function updateCategoryCounts() {
    console.log('\n📊 Cập nhật danh mục...');
    const categories = await Category.find({ level: 0 });
    for (const category of categories) {
        try {
            await Category.updateProductCount(category._id);
            console.log(`   ✓ ${category.name}`);
        } catch (err) {
            console.log(`   ⚠ ${category.name}`);
        }
    }
}

// ============ MAIN ============
async function main() {
    const args = process.argv.slice(2);
    const mode = args[0] || '--add';

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌱 SEED DATA MANAGER - Dữ liệu chính xác từ Apple');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công\n');

        let result = [];

        switch (mode) {
            case '--add':
                result = await addProducts();
                break;
            case '--reset':
                result = await resetProducts();
                break;
            case '--backup':
                result = await backupProducts();
                break;
            case '--restore':
                result = await restoreProducts();
                break;
            default:
                console.log('❌ Mode không hợp lệ. Dùng: --add, --reset, --backup, --restore');
                process.exit(1);
        }

        if (mode !== '--backup') {
            await updateCategoryCounts();
        }

        // Summary
        if (mode === '--add' || mode === '--reset') {
            const total = await Product.countDocuments();
            const iphones = await Product.countDocuments({ category: 'iphone' });
            const ipads = await Product.countDocuments({ category: 'ipad' });
            const macs = await Product.countDocuments({ category: 'macbook' });

            console.log('\n📊 Thống kê:');
            console.log(`   Tổng: ${total} sản phẩm`);
            console.log(`   📱 iPhone: ${iphones}`);
            console.log(`   📱 iPad: ${ipads}`);
            console.log(`   💻 MacBook: ${macs}`);
        }

        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('✅ Hoàn thành!');
        console.log('═══════════════════════════════════════════════════════════\n');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

main();
