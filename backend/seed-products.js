/**
 * Product Seed Data Script - EXPANDED VERSION
 * 30+ sản phẩm Apple đa dạng
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';

// Placeholder images từ Unsplash
const IMAGES = {
    iphone: 'https://images.unsplash.com/photo-1592286927505-c1f0d0e9ec2c?w=800',
    ipad: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    airpods: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
    watch: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
    cable: 'https://images.unsplash.com/photo-1591290619762-d71e6948dd4c?w=800',
    case: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
    charger: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
    keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
};

const PRODUCTS_DATA = [
    // ============ IPHONE (10 models) ============
    {
        name: 'iPhone 16 Pro Max',
        slug: 'iphone-16-pro-max',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 16 Pro Max với chip A18 Pro mạnh mẽ, camera 48MP, màn hình Super Retina XDR 6.9 inch, pin cả ngày.',
        shortDescription: 'iPhone cao cấp nhất 2024 với A18 Pro',
        price: 32990000,
        originalPrice: 35990000,
        image: IMAGES.iphone,
        images: [IMAGES.iphone],
        stock: 25,
        featured: true,
        status: 'active',
        highlights: ['Chip A18 Pro', 'Camera 48MP', 'Titanium', 'Pin 4422mAh'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP16PM-256-NT', name: '256GB Titan Tự Nhiên', type: 'nguyen-seal', attributes: { color: 'Titan Tự Nhiên', storage: '256GB' }, price: 32990000, stock: 8, isActive: true, isFeatured: true },
            { sku: 'IP16PM-512-TD', name: '512GB Titan Đen', type: 'nguyen-seal', attributes: { color: 'Titan Đen', storage: '512GB' }, price: 37990000, stock: 7, isActive: true },
            { sku: 'IP16PM-1TB-NT', name: '1TB Titan Tự Nhiên', type: 'nguyen-seal', attributes: { storage: '1TB' }, price: 44990000, stock: 5, isActive: true },
        ]
    },
    {
        name: 'iPhone 16 Pro',
        slug: 'iphone-16-pro',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 16 Pro với thiết kế Titanium, chip A18 Pro, camera 48MP chuyên nghiệp.',
        price: 28990000,
        originalPrice: 30990000,
        image: IMAGES.iphone,
        stock: 30,
        featured: true,
        status: 'active',
        highlights: ['A18 Pro', 'Titanium', 'Camera 48MP'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP16P-128-NT', name: '128GB Titan Tự Nhiên', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 28990000, stock: 12, isActive: true },
            { sku: 'IP16P-256-TD', name: '256GB Titan Đen', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 31990000, stock: 10, isActive: true },
        ]
    },
    {
        name: 'iPhone 16 Plus',
        slug: 'iphone-16-plus',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 16 Plus màn hình lớn 6.7 inch, chip A18, camera kép 48MP.',
        price: 25990000,
        originalPrice: 27990000,
        image: IMAGES.iphone,
        stock: 28,
        status: 'active',
        highlights: ['Màn hình 6.7"', 'A18', 'Camera 48MP'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP16PL-128-BL', name: '128GB Blue', type: 'nguyen-seal', attributes: { storage: '128GB', color: 'Blue' }, price: 25990000, stock: 15, isActive: true },
            { sku: 'IP16PL-256-PI', name: '256GB Pink', type: 'nguyen-seal', attributes: { storage: '256GB', color: 'Pink' }, price: 28490000, stock: 13, isActive: true },
        ]
    },
    {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, khung Titanium.',
        price: 28990000,
        originalPrice: 31990000,
        image: IMAGES.iphone,
        stock: 30,
        featured: true,
        status: 'active',
        highlights: ['A17 Pro', 'Titanium', '48MP'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP15PM-256-TT', name: '256GB Titan Trắng', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 28990000, stock: 10, isActive: true },
            { sku: 'IP15PM-512-TX', name: '512GB Titan Xanh', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 33990000, stock: 10, isActive: true },
        ]
    },
    {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 15 Pro với A17 Pro, Dynamic Island, Action Button.',
        price: 24990000,
        originalPrice: 26990000,
        image: IMAGES.iphone,
        stock: 25,
        status: 'active',
        highlights: ['A17 Pro', 'Action Button', 'Titanium'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP15P-128-TT', name: '128GB Titan Trắng', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 24990000, stock: 12, isActive: true },
            { sku: 'IP15P-256-TD', name: '256GB Titan Đen', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 27490000, stock: 13, isActive: true },
        ]
    },
    {
        name: 'iPhone 15 Plus',
        slug: 'iphone-15-plus',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 15 Plus màn hình 6.7 inch, chip A16 Bionic, Dynamic Island.',
        price: 22490000,
        originalPrice: 24990000,
        image: IMAGES.iphone,
        stock: 22,
        status: 'active',
        highlights: ['6.7 inch', 'A16 Bionic', 'Dynamic Island'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP15PL-128-BL', name: '128GB Blue', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 22490000, stock: 11, isActive: true },
            { sku: 'IP15PL-256-PI', name: '256GB Pink', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 24990000, stock: 11, isActive: true },
        ]
    },
    {
        name: 'iPhone 14 Pro Max',
        slug: 'iphone-14-pro-max',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 14 Pro Max với A16 Bionic, Dynamic Island, camera 48MP.',
        price: 26990000,
        originalPrice: 29990000,
        image: IMAGES.iphone,
        stock: 18,
        status: 'active',
        highlights: ['A16 Bionic', 'Dynamic Island', '48MP'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP14PM-256-PP', name: '256GB Deep Purple', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 26990000, stock: 9, isActive: true },
            { sku: 'IP14PM-512-SB', name: '512GB Space Black', type: 'nguyen-seal', attributes: { storage: '512GB' }, price: 30990000, stock: 9, isActive: true },
        ]
    },
    {
        name: 'iPhone 14 Plus',
        slug: 'iphone-14-plus',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 14 Plus màn hình lớn 6.7 inch, A15 Bionic, pin trâu.',
        price: 19990000,
        originalPrice: 22990000,
        image: IMAGES.iphone,
        stock: 20,
        status: 'active',
        highlights: ['6.7"', 'A15 Bionic', 'Pin lớn'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP14P-128-MN', name: '128GB Midnight', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 19990000, stock: 10, isActive: true },
            { sku: 'IP14P-256-BL', name: '256GB Blue', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 22490000, stock: 10, isActive: true },
        ]
    },
    {
        name: 'iPhone 13',
        slug: 'iphone-13',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone 13 với A15 Bionic, camera kép 12MP, giá tốt nhất.',
        price: 14990000,
        originalPrice: 17990000,
        image: IMAGES.iphone,
        stock: 35,
        status: 'active',
        highlights: ['A15 Bionic', 'Camera 12MP', 'Giá tốt'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IP13-128-ST', name: '128GB Starlight', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 14990000, stock: 18, isActive: true },
            { sku: 'IP13-256-MN', name: '256GB Midnight', type: 'nguyen-seal', attributes: { storage: '256GB' }, price: 16990000, stock: 17, isActive: true },
        ]
    },
    {
        name: 'iPhone SE 2022',
        slug: 'iphone-se-2022',
        category: 'iphone',
        brand: 'Apple',
        description: 'iPhone SE 2022 giá rẻ với A15 Bionic, Touch ID, thiết kế nhỏ gọn.',
        price: 10990000,
        originalPrice: 12990000,
        image: IMAGES.iphone,
        stock: 40,
        status: 'active',
        highlights: ['A15 Bionic', 'Touch ID', 'Giá rẻ nhất'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPSE-64-MN', name: '64GB Midnight', type: 'nguyen-seal', attributes: { storage: '64GB' }, price: 10990000, stock: 20, isActive: true },
            { sku: 'IPSE-128-ST', name: '128GB Starlight', type: 'nguyen-seal', attributes: { storage: '128GB' }, price: 12490000, stock: 20, isActive: true },
        ]
    },

    // ============ IPAD (8 models) ============
    {
        name: 'iPad Pro M4 13 inch 2024',
        slug: 'ipad-pro-m4-13-2024',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Pro M4 mạnh nhất với chip M4, màn hình OLED Tandem.',
        price: 35990000,
        originalPrice: 39990000,
        image: IMAGES.ipad,
        stock: 10,
        featured: true,
        status: 'active',
        highlights: ['M4', 'OLED Tandem', 'Thunderbolt'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPADPM4-13-256-W', name: '256GB Wifi Silver', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB' }, price: 35990000, stock: 4, isActive: true },
            { sku: 'IPADPM4-13-512-C', name: '512GB Cellular', type: 'nguyen-seal', model: 'wifi-cellular', attributes: { storage: '512GB' }, price: 44990000, stock: 3, isActive: true },
        ]
    },
    {
        name: 'iPad Pro M4 11 inch 2024',
        slug: 'ipad-pro-m4-11-2024',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Pro M4 11 inch với OLED, chip M4 mạnh mẽ.',
        price: 28990000,
        originalPrice: 31990000,
        image: IMAGES.ipad,
        stock: 15,
        featured: true,
        status: 'active',
        highlights: ['M4', 'OLED', 'Compact'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPADPM4-11-256-W', name: '256GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB' }, price: 28990000, stock: 8, isActive: true },
            { sku: 'IPADPM4-11-512-W', name: '512GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '512GB' }, price: 33990000, stock: 7, isActive: true },
        ]
    },
    {
        name: 'iPad Air M2 13 inch 2024',
        slug: 'ipad-air-m2-13-2024',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Air M2 màn hình 13 inch, chip M2, giá tốt.',
        price: 18990000,
        originalPrice: 20990000,
        image: IMAGES.ipad,
        stock: 12,
        status: 'active',
        highlights: ['M2', '13 inch', 'Giá tốt'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPADAIR-13-128-W', name: '128GB Wifi Blue', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '128GB' }, price: 18990000, stock: 6, isActive: true },
            { sku: 'IPADAIR-13-256-W', name: '256GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB' }, price: 21490000, stock: 6, isActive: true },
        ]
    },
    {
        name: 'iPad Air M2 11 inch 2024',
        slug: 'ipad-air-m2-11-2024',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Air M2 11 inch với chip M2, Apple Pencil Pro.',
        price: 16990000,
        originalPrice: 18990000,
        image: IMAGES.ipad,
        stock: 18,
        featured: true,
        status: 'active',
        highlights: ['M2', 'Apple Pencil Pro'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPADAIR-11-128-W', name: '128GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '128GB' }, price: 16990000, stock: 9, isActive: true },
            { sku: 'IPADAIR-11-256-W', name: '256GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB' }, price: 19990000, stock: 9, isActive: true },
        ]
    },
    {
        name: 'iPad Gen 10 2022',
        slug: 'ipad-gen-10-2022',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Gen 10 màn hình 10.9 inch, A14 Bionic, giá tốt.',
        price: 10490000,
        originalPrice: 11990000,
        image: IMAGES.ipad,
        stock: 35,
        status: 'active',
        highlights: ['10.9"', 'A14', 'USB-C'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPAD10-64-W', name: '64GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '64GB' }, price: 10490000, stock: 20, isActive: true },
            { sku: 'IPAD10-256-W', name: '256GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB' }, price: 13490000, stock: 15, isActive: true },
        ]
    },
    {
        name: 'iPad Gen 9 2021',
        slug: 'ipad-gen-9-2021',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad Gen 9 giá rẻ với A13 Bionic, màn hình 10.2 inch.',
        price: 8490000,
        originalPrice: 9990000,
        image: IMAGES.ipad,
        stock: 30,
        status: 'active',
        highlights: ['A13 Bionic', 'Giá rẻ nhất'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPAD9-64-W', name: '64GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '64GB' }, price: 8490000, stock: 15, isActive: true },
            { sku: 'IPAD9-256-W', name: '256GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB' }, price: 10990000, stock: 15, isActive: true },
        ]
    },
    {
        name: 'iPad mini 6 2021',
        slug: 'ipad-mini-6-2021',
        category: 'ipad',
        brand: 'Apple',
        description: 'iPad mini 6 nhỏ gọn với A15 Bionic, màn hình 8.3 inch.',
        price: 13490000,
        originalPrice: 14990000,
        image: IMAGES.ipad,
        stock: 20,
        status: 'active',
        highlights: ['8.3"', 'A15', 'Compact'],
        warranty: '12 tháng',
        variants: [
            { sku: 'IPADMINI-64-W', name: '64GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '64GB' }, price: 13490000, stock: 10, isActive: true },
            { sku: 'IPADMINI-256-W', name: '256GB Wifi', type: 'nguyen-seal', model: 'wifi', attributes: { storage: '256GB' }, price: 16990000, stock: 10, isActive: true },
        ]
    },
    {
        name: 'Apple Pencil Pro',
        slug: 'apple-pencil-pro',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Apple Pencil Pro với squeeze, barrel roll, haptic feedback.',
        price: 3490000,
        originalPrice: 3990000,
        image: IMAGES.ipad,
        stock: 50,
        status: 'active',
        highlights: ['Squeeze', 'Haptic', 'Barrel Roll'],
        warranty: '12 tháng',
        variants: [
            { sku: 'PENCIL-PRO', name: 'Apple Pencil Pro', type: 'nguyen-seal', attributes: {}, price: 3490000, stock: 50, isActive: true }
        ]
    },

    // ============ MACBOOK (6 models) ============
    {
        name: 'MacBook Air M3 15 inch 2024',
        slug: 'macbook-air-m3-15-2024',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Air M3 15 inch siêu mỏng nhẹ, pin 18 giờ.',
        price: 32990000,
        originalPrice: 35990000,
        image: IMAGES.macbook,
        stock: 12,
        featured: true,
        status: 'active',
        highlights: ['M3', '15.3"', 'Pin 18h'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MBAM3-15-256', name: '8GB/256GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '256GB' }, price: 32990000, stock: 6, isActive: true },
            { sku: 'MBAM3-15-512', name: '8GB/512GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '512GB' }, price: 37990000, stock: 6, isActive: true },
        ]
    },
    {
        name: 'MacBook Air M3 13 inch 2024',
        slug: 'macbook-air-m3-13-2024',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Air M3 13 inch với chip M3, siêu mỏng.',
        price: 27990000,
        originalPrice: 29990000,
        image: IMAGES.macbook,
        stock: 20,
        featured: true,
        status: 'active',
        highlights: ['M3', '13.6"', 'Mỏng nhẹ'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MBAM3-13-256', name: '8GB/256GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '256GB' }, price: 27990000, stock: 10, isActive: true },
            { sku: 'MBAM3-13-512', name: '16GB/512GB', type: 'nguyen-seal', attributes: { memory: '16GB', storage: '512GB' }, price: 34990000, stock: 10, isActive: true },
        ]
    },
    {
        name: 'MacBook Pro M4 14 inch 2024',
        slug: 'macbook-pro-m4-14-2024',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Pro M4 14 inch hiệu năng đỉnh cao.',
        price: 38990000,
        originalPrice: 42990000,
        image: IMAGES.macbook,
        stock: 8,
        featured: true,
        status: 'active',
        highlights: ['M4 Pro', 'XDR Display'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MBPM4-14-512', name: '18GB/512GB', type: 'nguyen-seal', attributes: { memory: '18GB', storage: '512GB' }, price: 38990000, stock: 4, isActive: true },
            { sku: 'MBPM4-14-1TB', name: '18GB/1TB', type: 'nguyen-seal', attributes: { memory: '18GB', storage: '1TB' }, price: 46990000, stock: 4, isActive: true },
        ]
    },
    {
        name: 'MacBook Pro M3 16 inch 2023',
        slug: 'macbook-pro-m3-16-2023',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Pro M3 16 inch màn hình lớn, pin lâu.',
        price: 59990000,
        originalPrice: 64990000,
        image: IMAGES.macbook,
        stock: 5,
        status: 'active',
        highlights: ['M3 Max', '16.2"', 'Pin 22h'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MBPM3-16-512', name: '36GB/512GB', type: 'nguyen-seal', attributes: { memory: '36GB', storage: '512GB' }, price: 59990000, stock: 3, isActive: true },
            { sku: 'MBPM3-16-1TB', name: '48GB/1TB', type: 'nguyen-seal', attributes: { memory: '48GB', storage: '1TB' }, price: 69990000, stock: 2, isActive: true },
        ]
    },
    {
        name: 'MacBook Air M2 15 inch 2023',
        slug: 'macbook-air-m2-15-2023',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Air M2 15 inch giá tốt hơn M3.',
        price: 29990000,
        originalPrice: 32990000,
        image: IMAGES.macbook,
        stock: 10,
        status: 'active',
        highlights: ['M2', '15.3"', 'Giá tốt'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MBAM2-15-256', name: '8GB/256GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '256GB' }, price: 29990000, stock: 5, isActive: true },
            { sku: 'MBAM2-15-512', name: '8GB/512GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '512GB' }, price: 34490000, stock: 5, isActive: true },
        ]
    },
    {
        name: 'MacBook Air M2 13 inch 2022',
        slug: 'macbook-air-m2-13-2022',
        category: 'macbook',
        brand: 'Apple',
        description: 'MacBook Air M2 13 inch giá rẻ nhất.',
        price: 24990000,
        originalPrice: 27990000,
        image: IMAGES.macbook,
        stock: 15,
        status: 'active',
        highlights: ['M2', 'Giá tốt nhất'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MBAM2-13-256', name: '8GB/256GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '256GB' }, price: 24990000, stock: 8, isActive: true },
            { sku: 'MBAM2-13-512', name: '8GB/512GB', type: 'nguyen-seal', attributes: { memory: '8GB', storage: '512GB' }, price: 28990000, stock: 7, isActive: true },
        ]
    },

    // ============ AIRPODS & AUDIO (4 models) ============
    {
        name: 'AirPods Pro 2 (USB-C)',
        slug: 'airpods-pro-2-usbc',
        category: 'airpods',
        brand: 'Apple',
        description: 'AirPods Pro 2 với H2, ANC xuất sắc, USB-C.',
        price: 5990000,
        originalPrice: 6990000,
        image: IMAGES.airpods,
        stock: 50,
        featured: true,
        status: 'active',
        highlights: ['H2', 'ANC', 'USB-C'],
        warranty: '12 tháng',
        variants: [
            { sku: 'APP2-USBC', name: 'AirPods Pro 2 USB-C', type: 'nguyen-seal', attributes: {}, price: 5990000, stock: 50, isActive: true }
        ]
    },
    {
        name: 'AirPods 3',
        slug: 'airpods-3',
        category: 'airpods',
        brand: 'Apple',
        description: 'AirPods 3 với âm thanh không gian.',
        price: 4290000,
        originalPrice: 4990000,
        image: IMAGES.airpods,
        stock: 60,
        status: 'active',
        highlights: ['Spatial Audio', 'IPX4'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AP3-LIGHT', name: 'Lightning', type: 'nguyen-seal', attributes: {}, price: 4290000, stock: 40, isActive: true },
            { sku: 'AP3-USBC', name: 'USB-C', type: 'nguyen-seal', attributes: {}, price: 4490000, stock: 20, isActive: true }
        ]
    },
    {
        name: 'AirPods 2',
        slug: 'airpods-2',
        category: 'airpods',
        brand: 'Apple',
        description: 'AirPods 2 giá rẻ nhất.',
        price: 2990000,
        originalPrice: 3490000,
        image: IMAGES.airpods,
        stock: 80,
        status: 'active',
        highlights: ['Giá rẻ', 'Chip H1'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AP2', name: 'AirPods 2', type: 'nguyen-seal', attributes: {}, price: 2990000, stock: 80, isActive: true }
        ]
    },
    {
        name: 'AirPods Max',
        slug: 'airpods-max',
        category: 'airpods',
        brand: 'Apple',
        description: 'AirPods Max tai nghe over-ear cao cấp.',
        price: 12990000,
        originalPrice: 14990000,
        image: IMAGES.airpods,
        stock: 15,
        status: 'active',
        highlights: ['Over-ear', 'ANC đỉnh cao', 'Spatial Audio'],
        warranty: '12 tháng',
        variants: [
            { sku: 'APMAX-SV', name: 'Silver', type: 'nguyen-seal', attributes: { color: 'Silver' }, price: 12990000, stock: 8, isActive: true },
            { sku: 'APMAX-SG', name: 'Space Gray', type: 'nguyen-seal', attributes: { color: 'Space Gray' }, price: 12990000, stock: 7, isActive: true }
        ]
    },

    // ============ APPLE WATCH (3 models) ============
    {
        name: 'Apple Watch Series 10 GPS 42mm',
        slug: 'apple-watch-series-10-42mm',
        category: 'apple-watch',
        brand: 'Apple',
        description: 'Apple Watch S10 màn hình lớn, chip S10.',
        price: 10990000,
        originalPrice: 11990000,
        image: IMAGES.watch,
        stock: 25,
        featured: true,
        status: 'active',
        highlights: ['S10', 'Màn hình lớn', 'WatchOS 11'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AWS10-42-AL', name: '42mm Aluminum', type: 'nguyen-seal', attributes: { size: '42mm' }, price: 10990000, stock: 13, isActive: true },
            { sku: 'AWS10-46-AL', name: '46mm Aluminum', type: 'nguyen-seal', attributes: { size: '46mm' }, price: 12490000, stock: 12, isActive: true }
        ]
    },
    {
        name: 'Apple Watch Ultra 2',
        slug: 'apple-watch-ultra-2',
        category: 'apple-watch',
        brand: 'Apple',
        description: 'Apple Watch Ultra 2 cho thể thao cực hạn.',
        price: 20990000,
        originalPrice: 22990000,
        image: IMAGES.watch,
        stock: 10,
        status: 'active',
        highlights: ['Titanium', '49mm', 'Cực hạn'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AWULTRA2', name: 'Apple Watch Ultra 2', type: 'nguyen-seal', attributes: {}, price: 20990000, stock: 10, isActive: true }
        ]
    },
    {
        name: 'Apple Watch SE 2023 GPS 40mm',
        slug: 'apple-watch-se-2023-40mm',
        category: 'apple-watch',
        brand: 'Apple',
        description: 'Apple Watch SE giá tốt nhất.',
        price: 6490000,
        originalPrice: 7490000,
        image: IMAGES.watch,
        stock: 40,
        status: 'active',
        highlights: ['Giá tốt', 'S8', 'GPS'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AWSE-40', name: '40mm', type: 'nguyen-seal', attributes: { size: '40mm' }, price: 6490000, stock: 20, isActive: true },
            { sku: 'AWSE-44', name: '44mm', type: 'nguyen-seal', attributes: { size: '44mm' }, price: 7290000, stock: 20, isActive: true }
        ]
    },

    // ============ PHỤ KIỆN (8 models) ============
    {
        name: 'Cáp USB-C to Lightning 1m',
        slug: 'cap-usbc-lightning-1m',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Cáp sạc nhanh chính hãng Apple.',
        price: 590000,
        originalPrice: 690000,
        image: IMAGES.cable,
        stock: 100,
        status: 'active',
        highlights: ['Chính hãng', 'Sạc nhanh'],
        warranty: '12 tháng',
        variants: [
            { sku: 'CABLE-USBC-LT', name: 'Cáp USB-C Lightning 1m', type: 'nguyen-seal', attributes: {}, price: 590000, stock: 100, isActive: true }
        ]
    },
    {
        name: 'Củ sạc nhanh 20W USB-C',
        slug: 'cu-sac-20w-usbc',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Củ sạc nhanh 20W chính hãng.',
        price: 490000,
        originalPrice: 590000,
        image: IMAGES.charger,
        stock: 120,
        status: 'active',
        highlights: ['20W', 'Sạc siêu nhanh'],
        warranty: '12 tháng',
        variants: [
            { sku: 'CHARGER-20W', name: 'Củ sạc 20W', type: 'nguyen-seal', attributes: {}, price: 490000, stock: 120, isActive: true }
        ]
    },
    {
        name: 'Ốp lưng Silicone iPhone 16 Pro Max',
        slug: 'op-lung-silicone-iphone-16-pro-max',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Ốp Silicone chính hãng cho iPhone 16 Pro Max.',
        price: 1190000,
        originalPrice: 1390000,
        image: IMAGES.case,
        stock: 80,
        status: 'active',
        highlights: ['Silicone', 'MagSafe'],
        warranty: '12 tháng',
        variants: [
            { sku: 'CASE-IP16PM-BL', name: 'Black', type: 'nguyen-seal', attributes: { color: 'Black' }, price: 1190000, stock: 20, isActive: true },
            { sku: 'CASE-IP16PM-BLU', name: 'Blue', type: 'nguyen-seal', attributes: { color: 'Blue' }, price: 1190000, stock: 20, isActive: true },
            { sku: 'CASE-IP16PM-WH', name: 'White', type: 'nguyen-seal', attributes: { color: 'White' }, price: 1190000, stock: 20, isActive: true }
        ]
    },
    {
        name: 'Magic Keyboard cho iPad Pro',
        slug: 'magic-keyboard-ipad-pro',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Magic Keyboard với trackpad cho iPad Pro.',
        price: 7490000,
        originalPrice: 8990000,
        image: IMAGES.keyboard,
        stock: 25,
        status: 'active',
        highlights: ['Trackpad', 'Backlit'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MK-IPADPRO-11', name: '11 inch', type: 'nguyen-seal', attributes: { size: '11 inch' }, price: 7490000, stock: 12, isActive: true },
            { sku: 'MK-IPADPRO-13', name: '13 inch', type: 'nguyen-seal', attributes: { size: '13 inch' }, price: 8990000, stock: 13, isActive: true }
        ]
    },
    {
        name: 'AirTag (1 Pack)',
        slug: 'airtag-1-pack',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'AirTag tìm kiếm vật dụng với Find My.',
        price: 790000,
        originalPrice: 890000,
        image: IMAGES.case,
        stock: 100,
        status: 'active',
        highlights: ['Find My', 'Thay pin'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AIRTAG-1', name: 'AirTag 1 Pack', type: 'nguyen-seal', attributes: {}, price: 790000, stock: 100, isActive: true }
        ]
    },
    {
        name: 'AirTag (4 Pack)',
        slug: 'airtag-4-pack',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'AirTag gói 4 cái tiết kiệm hơn.',
        price: 2490000,
        originalPrice: 2990000,
        image: IMAGES.case,
        stock: 50,
        status: 'active',
        highlights: ['4 Pack', 'Tiết kiệm'],
        warranty: '12 tháng',
        variants: [
            { sku: 'AIRTAG-4', name: 'AirTag 4 Pack', type: 'nguyen-seal', attributes: {}, price: 2490000, stock: 50, isActive: true }
        ]
    },
    {
        name: 'Dây sạc MagSafe cho Apple Watch',
        slug: 'day-sac-magsafe-watch',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Dây sạc MagSafe 1m cho Apple Watch.',
        price: 690000,
        originalPrice: 790000,
        image: IMAGES.cable,
        stock: 60,
        status: 'active',
        highlights: ['MagSafe', 'Sạc nhanh'],
        warranty: '12 tháng',
        variants: [
            { sku: 'WATCH-CHARGER', name: 'Dây sạc Watch', type: 'nguyen-seal', attributes: {}, price: 690000, stock: 60, isActive: true }
        ]
    },
    {
        name: 'Sạc MagSafe cho iPhone',
        slug: 'sac-magsafe-iphone',
        category: 'phu-kien',
        brand: 'Apple',
        description: 'Sạc không dây MagSafe 15W cho iPhone.',
        price: 1090000,
        originalPrice: 1290000,
        image: IMAGES.charger,
        stock: 70,
        status: 'active',
        highlights: ['15W', 'Không dây'],
        warranty: '12 tháng',
        variants: [
            { sku: 'MAGSAFE-CHARGER', name: 'MagSafe Charger', type: 'nguyen-seal', attributes: {}, price: 1090000, stock: 70, isActive: true }
        ]
    }
];

const seedProducts = async () => {
    try {
        console.log('🌱 Starting Product Seeding (EXPANDED)...\n');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});
        console.log('✅ Cleared existing products\n');

        console.log('📦 Inserting products...');
        const inserted = await Product.insertMany(PRODUCTS_DATA);
        console.log(`✅ Inserted ${inserted.length} products\n`);

        console.log('📊 Updating category product counts...');
        const categories = await Category.find({ level: 0 });
        for (const category of categories) {
            try {
                await Category.updateProductCount(category._id);
                console.log(`   ✓ Updated ${category.name}`);
            } catch (err) {
                console.log(`   ⚠ Warning: ${category.name}: ${err.message.substring(0, 50)}`);
            }
        }

        console.log('\n🎉 Product seeding completed!\n');
        console.log('📊 Summary:');
        console.log(`   Total products: ${inserted.length}`);
        console.log(`   Featured products: ${inserted.filter(p => p.featured).length}`);
        console.log(`   Total variants: ${inserted.reduce((sum, p) => sum + (p.variants?.length || 0), 0)}`);
        console.log(`   Total stock: ${inserted.reduce((sum, p) => sum + p.stock, 0)}`);
        console.log(`\n   📱 iPhone: ${inserted.filter(p => p.category === 'iphone').length}`);
        console.log(`   📱 iPad: ${inserted.filter(p => p.category === 'ipad').length}`);
        console.log(`   💻 MacBook: ${inserted.filter(p => p.category === 'macbook').length}`);
        console.log(`   🎧 AirPods: ${inserted.filter(p => p.category === 'airpods').length}`);
        console.log(`   ⌚ Apple Watch: ${inserted.filter(p => p.category === 'apple-watch').length}`);
        console.log(`   🔌 Phụ kiện: ${inserted.filter(p => p.category === 'phu-kien').length}`);

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedProducts();
