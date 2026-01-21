/**
 * Template: Danh sách sản phẩm Apple thực tế
 * Copy các sản phẩm này vào file seed.js trong array PRODUCTS
 */

export const APPLE_PRODUCTS_TEMPLATE = [
  // ============================================
  // iPhone Series
  // ============================================
  {
    name: 'iPhone 15 Pro Max',
    description: 'Điện thoại flagship Apple với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch. Tính năng nổi bật: USB-C, Action Button, Titanium design, Night mode camera, ProRAW video',
    price: 1199,
    originalPrice: 1299,
    category: 'iPhone',
    image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max',
    stock: 25,
    rating: 5,
    specs: {
      screen: '6.7" Super Retina XDR',
      processor: 'Apple A17 Pro',
      camera: '48MP Wide + 12MP Ultra Wide + 12MP Telephoto',
      battery: '4685 mAh',
      storage: '256GB/512GB/1TB',
      color: 'Natural Titanium, Blue Titanium, White Titanium, Black Titanium'
    }
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Flagship iPhone với màn hình 6.1 inch Super Retina XDR. Chip A17 Pro siêu mạnh, camera ProMotion, thiết kế titanium bền bỉ. Hoàn hảo cho công việc & sáng tạo nội dung',
    price: 999,
    originalPrice: 1099,
    category: 'iPhone',
    image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
    stock: 35,
    rating: 5,
    specs: {
      screen: '6.1" Super Retina XDR',
      processor: 'Apple A17 Pro',
      camera: '48MP Wide + 12MP Ultra Wide + 12MP Telephoto',
      battery: '3582 mAh',
      storage: '256GB/512GB/1TB',
      color: 'Natural Titanium, Blue Titanium, White Titanium, Black Titanium'
    }
  },
  {
    name: 'iPhone 15',
    description: 'iPhone phổ thông với chip A16 Bionic mạnh mẽ. Màn hình 6.1 inch Liquid Retina, camera dual 48MP, sạc USB-C. Lựa chọn tốt cho người dùng bình thường',
    price: 799,
    originalPrice: 899,
    category: 'iPhone',
    image: 'https://via.placeholder.com/300x300?text=iPhone+15',
    stock: 45,
    rating: 4.8,
    specs: {
      screen: '6.1" Liquid Retina',
      processor: 'Apple A16 Bionic',
      camera: '48MP Wide + 12MP Ultra Wide',
      battery: '3582 mAh',
      storage: '128GB/256GB/512GB',
      color: 'Black, Pink, Yellow, Blue, Green'
    }
  },
  {
    name: 'iPhone 15 Plus',
    description: 'Phiên bản Plus với màn hình 6.7 inch Liquid Retina lớn. Camera 48MP + 12MP Ultra Wide, A16 Bionic, pin khỏe. Dành cho người thích màn hình lớn',
    price: 899,
    originalPrice: 999,
    category: 'iPhone',
    image: 'https://via.placeholder.com/300x300?text=iPhone+15+Plus',
    stock: 40,
    rating: 4.8,
    specs: {
      screen: '6.7" Liquid Retina',
      processor: 'Apple A16 Bionic',
      camera: '48MP Wide + 12MP Ultra Wide',
      battery: '4325 mAh',
      storage: '128GB/256GB/512GB',
      color: 'Black, Pink, Yellow, Blue, Green'
    }
  },
  {
    name: 'iPhone 14 Pro Max',
    description: 'iPhone Pro Max với chip A16 Bionic, camera 48MP Pro, Dynamic Island. Màn hình Super Retina XDR 6.7 inch, pin khỏe, chụp ảnh chuyên nghiệp',
    price: 1099,
    originalPrice: 1199,
    category: 'iPhone',
    image: 'https://via.placeholder.com/300x300?text=iPhone+14+Pro+Max',
    stock: 20,
    rating: 4.9,
    specs: {
      screen: '6.7" Super Retina XDR',
      processor: 'Apple A16 Bionic',
      camera: '48MP Wide + 12MP Ultra Wide + 12MP Telephoto',
      battery: '4323 mAh',
      storage: '128GB/256GB/512GB/1TB',
      color: 'Deep Purple, Gold, Silver, Space Black'
    }
  },
  {
    name: 'iPhone 14 Pro',
    description: 'iPhone Pro với Dynamic Island, chip A16 Bionic. Camera 48MP Pro, màn hình Always-On, thiết kế premium. Hiệu năng mạnh mẽ cho mọi tác vụ',
    price: 999,
    originalPrice: 1099,
    category: 'iPhone',
    image: 'https://via.placeholder.com/300x300?text=iPhone+14+Pro',
    stock: 30,
    rating: 4.9,
    specs: {
      screen: '6.1" Super Retina XDR',
      processor: 'Apple A16 Bionic',
      camera: '48MP Wide + 12MP Ultra Wide + 12MP Telephoto',
      battery: '3200 mAh',
      storage: '128GB/256GB/512GB/1TB',
      color: 'Deep Purple, Gold, Silver, Space Black'
    }
  },
  {
    name: 'iPhone 14',
    description: 'iPhone 14 với chip A15 Bionic, camera dual 12MP. Màn hình 6.1 inch Super Retina XDR, pin khỏe, giá hợp lý. Lựa chọn tốt cho người dùng phổ thông',
    price: 699,
    originalPrice: 799,
    category: 'iPhone',
    image: 'https://via.placeholder.com/300x300?text=iPhone+14',
    stock: 50,
    rating: 4.7,
    specs: {
      screen: '6.1" Super Retina XDR',
      processor: 'Apple A15 Bionic',
      camera: '12MP Wide + 12MP Ultra Wide',
      battery: '3279 mAh',
      storage: '128GB/256GB/512GB',
      color: 'Blue, Purple, Midnight, Starlight, Red'
    }
  },
  {
    name: 'iPhone SE (3rd Gen)',
    description: 'iPhone SE với chip A15 Bionic mạnh mẽ, thiết kế compact 4.7 inch. Giá rẻ, hiệu năng tốt. Phù hợp cho người thích iPhone nhỏ gọn',
    price: 429,
    originalPrice: 499,
    category: 'iPhone',
    image: 'https://via.placeholder.com/300x300?text=iPhone+SE',
    stock: 60,
    rating: 4.5,
    specs: {
      screen: '4.7" Retina HD',
      processor: 'Apple A15 Bionic',
      camera: '12MP Wide',
      battery: '2018 mAh',
      storage: '64GB/128GB/256GB',
      color: 'Midnight, Starlight, Red'
    }
  },

  // ============================================
  // MacBook Series
  // ============================================
  {
    name: 'MacBook Pro 16" (M3 Pro)',
    description: 'MacBook Pro cao cấp với chip M3 Pro, màn hình Liquid Retina XDR 16.2 inch. Hiệu năng cực mạnh cho video editing, 3D rendering. Pin 22 giờ',
    price: 2499,
    originalPrice: 2499,
    category: 'MacBook',
    image: 'https://via.placeholder.com/300x300?text=MacBook+Pro+16',
    stock: 10,
    rating: 5,
    specs: {
      screen: '16.2" Liquid Retina XDR',
      processor: 'Apple M3 Pro',
      memory: '18GB/36GB unified memory',
      storage: '512GB/1TB/2TB/4TB/8TB SSD',
      battery: 'Up to 22 hours',
      color: 'Space Black, Silver'
    }
  },
  {
    name: 'MacBook Pro 14" (M3 Pro)',
    description: 'MacBook Pro với chip M3 Pro, màn hình Liquid Retina XDR 14.2 inch. Cân bằng hoàn hảo giữa hiệu năng và portability. Pin 18 giờ',
    price: 1999,
    originalPrice: 1999,
    category: 'MacBook',
    image: 'https://via.placeholder.com/300x300?text=MacBook+Pro+14',
    stock: 15,
    rating: 5,
    specs: {
      screen: '14.2" Liquid Retina XDR',
      processor: 'Apple M3 Pro',
      memory: '18GB/36GB unified memory',
      storage: '512GB/1TB/2TB/4TB/8TB SSD',
      battery: 'Up to 18 hours',
      color: 'Space Black, Silver'
    }
  },
  {
    name: 'MacBook Pro 16" (M3)',
    description: 'MacBook Pro với chip M3, màn hình Liquid Retina XDR 16.2 inch. Hiệu năng mạnh mẽ, giá tốt hơn M3 Pro. Phù hợp cho developer, designer',
    price: 2499,
    originalPrice: 2499,
    category: 'MacBook',
    image: 'https://via.placeholder.com/300x300?text=MacBook+Pro+16+M3',
    stock: 12,
    rating: 4.9,
    specs: {
      screen: '16.2" Liquid Retina XDR',
      processor: 'Apple M3',
      memory: '8GB/16GB/24GB unified memory',
      storage: '512GB/1TB/2TB SSD',
      battery: 'Up to 22 hours',
      color: 'Space Black, Silver'
    }
  },
  {
    name: 'MacBook Air 15" (M2)',
    description: 'MacBook Air lớn với chip M2, màn hình Liquid Retina 15.3 inch. Mỏng, nhẹ, pin 18 giờ. Hoàn hảo cho công việc và giải trí',
    price: 1299,
    originalPrice: 1299,
    category: 'MacBook',
    image: 'https://via.placeholder.com/300x300?text=MacBook+Air+15',
    stock: 20,
    rating: 4.9,
    specs: {
      screen: '15.3" Liquid Retina',
      processor: 'Apple M2',
      memory: '8GB/16GB/24GB unified memory',
      storage: '256GB/512GB/1TB/2TB SSD',
      battery: 'Up to 18 hours',
      color: 'Midnight, Starlight, Space Gray, Silver'
    }
  },
  {
    name: 'MacBook Air 13" (M2)',
    description: 'MacBook Air cổ điển với chip M2, màn hình Liquid Retina 13.6 inch. Nhẹ nhất trong dòng MacBook, pin 18 giờ. Lựa chọn tốt cho sinh viên',
    price: 1199,
    originalPrice: 1199,
    category: 'MacBook',
    image: 'https://via.placeholder.com/300x300?text=MacBook+Air+13',
    stock: 25,
    rating: 4.8,
    specs: {
      screen: '13.6" Liquid Retina',
      processor: 'Apple M2',
      memory: '8GB/16GB/24GB unified memory',
      storage: '256GB/512GB/1TB/2TB SSD',
      battery: 'Up to 18 hours',
      color: 'Midnight, Starlight, Space Gray, Silver'
    }
  },
  {
    name: 'MacBook Air 13" (M1)',
    description: 'MacBook Air với chip M1, giá tốt. Màn hình Retina 13.3 inch, pin 18 giờ. Lựa chọn tiết kiệm nhưng vẫn mạnh mẽ',
    price: 999,
    originalPrice: 1099,
    category: 'MacBook',
    image: 'https://via.placeholder.com/300x300?text=MacBook+Air+M1',
    stock: 30,
    rating: 4.7,
    specs: {
      screen: '13.3" Retina',
      processor: 'Apple M1',
      memory: '8GB/16GB unified memory',
      storage: '256GB/512GB/1TB/2TB SSD',
      battery: 'Up to 18 hours',
      color: 'Gold, Silver, Space Gray'
    }
  },
  {
    name: 'iMac 24" (M3)',
    description: 'iMac All-in-One với chip M3, màn hình Retina 4.5K 24 inch. Thiết kế đẹp, màu sắc đa dạng. Hoàn hảo cho gia đình, văn phòng',
    price: 1299,
    originalPrice: 1299,
    category: 'MacBook',
    image: 'https://via.placeholder.com/300x300?text=iMac+24',
    stock: 15,
    rating: 4.8,
    specs: {
      screen: '24" Retina 4.5K',
      processor: 'Apple M3',
      memory: '8GB/16GB/24GB unified memory',
      storage: '256GB/512GB/1TB/2TB SSD',
      color: 'Blue, Green, Pink, Silver, Yellow, Orange, Purple'
    }
  },

  // ============================================
  // iPad Series
  // ============================================
  {
    name: 'iPad Pro 12.9" (M2)',
    description: 'Máy tính bảng cao cấp với chip M2, màn hình Liquid Retina XDR 12.9 inch. Hỗ trợ Apple Pencil Pro, MagicKeyboard. Hoàn hảo cho design, video editing',
    price: 1099,
    originalPrice: 1099,
    category: 'iPad',
    image: 'https://via.placeholder.com/300x300?text=iPad+Pro+12.9',
    stock: 15,
    rating: 5,
    specs: {
      screen: '12.9" Liquid Retina XDR',
      processor: 'Apple M2',
      camera: '12MP Wide + 10MP Ultra Wide',
      battery: 'Up to 10 hours',
      storage: '128GB/256GB/512GB/1TB/2TB',
      color: 'Space Gray, Silver'
    }
  },
  {
    name: 'iPad Pro 11" (M2)',
    description: 'iPad Pro với chip M2, màn hình Liquid Retina 11 inch. Nhẹ, mỏng, hiệu năng mạnh. Phù hợp cho công việc di động',
    price: 799,
    originalPrice: 799,
    category: 'iPad',
    image: 'https://via.placeholder.com/300x300?text=iPad+Pro+11',
    stock: 20,
    rating: 5,
    specs: {
      screen: '11" Liquid Retina',
      processor: 'Apple M2',
      camera: '12MP Wide + 10MP Ultra Wide',
      battery: 'Up to 10 hours',
      storage: '128GB/256GB/512GB/1TB/2TB',
      color: 'Space Gray, Silver'
    }
  },
  {
    name: 'iPad Air 11" (M1)',
    description: 'iPad Air với chip M1 mạnh mẽ, màn hình 11 inch. Nhẹ, mỏng, hỗ trợ accessories Apple. Cân bằng hoàn hảo giữa performance và giá cả',
    price: 599,
    originalPrice: 599,
    category: 'iPad',
    image: 'https://via.placeholder.com/300x300?text=iPad+Air+11',
    stock: 25,
    rating: 4.9,
    specs: {
      screen: '11" Liquid Retina',
      processor: 'Apple M1',
      camera: '12MP Wide + 8MP Ultra Wide',
      battery: 'Up to 10 hours',
      storage: '64GB/256GB/512GB',
      color: 'Space Gray, Purple, Blue, Pink, Starlight'
    }
  },
  {
    name: 'iPad Air 10.9" (M1)',
    description: 'iPad Air với chip M1, màn hình 10.9 inch. Thiết kế đẹp, màu sắc đa dạng. Giá tốt cho hiệu năng mạnh mẽ',
    price: 599,
    originalPrice: 599,
    category: 'iPad',
    image: 'https://via.placeholder.com/300x300?text=iPad+Air+10.9',
    stock: 30,
    rating: 4.8,
    specs: {
      screen: '10.9" Liquid Retina',
      processor: 'Apple M1',
      camera: '12MP Wide',
      battery: 'Up to 10 hours',
      storage: '64GB/256GB',
      color: 'Space Gray, Purple, Blue, Pink, Starlight'
    }
  },
  {
    name: 'iPad (10th Gen)',
    description: 'iPad phổ thông với chip A14 Bionic, màn hình 10.9 inch. Giá tốt, phù hợp cho học tập, giải trí',
    price: 449,
    originalPrice: 499,
    category: 'iPad',
    image: 'https://via.placeholder.com/300x300?text=iPad+10',
    stock: 40,
    rating: 4.6,
    specs: {
      screen: '10.9" Liquid Retina',
      processor: 'Apple A14 Bionic',
      camera: '12MP Wide',
      battery: 'Up to 10 hours',
      storage: '64GB/256GB',
      color: 'Blue, Pink, Yellow, Silver'
    }
  },
  {
    name: 'iPad Mini (6th Gen)',
    description: 'iPad Mini với chip A15 Bionic, màn hình 8.3 inch. Nhỏ gọn, tiện lợi mang theo. Hoàn hảo cho đọc sách, gaming',
    price: 499,
    originalPrice: 549,
    category: 'iPad',
    image: 'https://via.placeholder.com/300x300?text=iPad+Mini',
    stock: 35,
    rating: 4.7,
    specs: {
      screen: '8.3" Liquid Retina',
      processor: 'Apple A15 Bionic',
      camera: '12MP Wide',
      battery: 'Up to 10 hours',
      storage: '64GB/256GB',
      color: 'Space Gray, Pink, Purple, Starlight'
    }
  },

  // ============================================
  // Apple Watch Series
  // ============================================
  {
    name: 'Apple Watch Ultra 2',
    description: 'Smartwatch cao cấp cho thể thao, phiêu lưu. Màn hình 49mm, chống nước sâu, pin 36 giờ. Hoàn hảo cho vận động viên',
    price: 799,
    originalPrice: 799,
    category: 'Apple Watch',
    image: 'https://via.placeholder.com/300x300?text=Apple+Watch+Ultra+2',
    stock: 20,
    rating: 5,
    specs: {
      screen: '49mm Always-On Retina',
      processor: 'Apple S9',
      battery: 'Up to 36 hours',
      features: 'ECG, Blood Oxygen, Depth Gauge, Action Button, Dual-Frequency GPS',
      color: 'Titanium'
    }
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Smartwatch Apple mới nhất với chip S9, màn hình Always-On. Tính năng health: ECG, SpO2, sleep tracking. Chống nước, pin 18 giờ',
    price: 399,
    originalPrice: 399,
    category: 'Apple Watch',
    image: 'https://via.placeholder.com/300x300?text=Apple+Watch+Series+9',
    stock: 50,
    rating: 4.8,
    specs: {
      screen: '1.9" LTPO OLED',
      processor: 'Apple S9',
      battery: '~18 hours',
      features: 'ECG, Blood Oxygen, Always-On Display, Fitness Tracking',
      color: 'Silver, Midnight, Gold, Starlight, Pink, Red'
    }
  },
  {
    name: 'Apple Watch SE (2nd Gen)',
    description: 'Apple Watch giá tốt với chip S8, màn hình Retina. Đầy đủ tính năng cơ bản, pin 18 giờ. Lựa chọn tốt cho người mới bắt đầu',
    price: 249,
    originalPrice: 299,
    category: 'Apple Watch',
    image: 'https://via.placeholder.com/300x300?text=Apple+Watch+SE',
    stock: 60,
    rating: 4.6,
    specs: {
      screen: '1.78" Retina',
      processor: 'Apple S8',
      battery: '~18 hours',
      features: 'Fitness Tracking, Heart Rate, Fall Detection',
      color: 'Midnight, Starlight, Silver'
    }
  },

  // ============================================
  // Accessories
  // ============================================
  {
    name: 'AirPods Pro (2nd Gen)',
    description: 'Tai nghe AirPods Pro generation 2 với Adaptive Audio, Active Noise Cancellation. Âm thanh Spatial Audio, sạc USB-C. Pin 6 giờ đơn lẻ',
    price: 249,
    originalPrice: 249,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=AirPods+Pro',
    stock: 100,
    rating: 5,
    specs: {
      features: 'ANC, Adaptive Audio, Spatial Audio, USB-C',
      battery: '6 hours (+ 30 hours case)',
      color: 'White',
      weight: '5.3g each'
    }
  },
  {
    name: 'AirPods (3rd Gen)',
    description: 'AirPods thế hệ 3 với Spatial Audio, Adaptive EQ. Thiết kế mới, pin 6 giờ, chống nước IPX4',
    price: 179,
    originalPrice: 199,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=AirPods+3',
    stock: 80,
    rating: 4.7,
    specs: {
      features: 'Spatial Audio, Adaptive EQ',
      battery: '6 hours (+ 30 hours case)',
      color: 'White',
      weight: '4.3g each'
    }
  },
  {
    name: 'AirPods Max',
    description: 'Tai nghe over-ear cao cấp với Active Noise Cancellation, Spatial Audio. Thiết kế premium, pin 20 giờ',
    price: 549,
    originalPrice: 549,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=AirPods+Max',
    stock: 30,
    rating: 4.9,
    specs: {
      features: 'ANC, Spatial Audio, Transparency Mode',
      battery: 'Up to 20 hours',
      color: 'Space Gray, Silver, Sky Blue, Green, Pink'
    }
  },
  {
    name: 'Magic Keyboard',
    description: 'Bàn phím Magic Keyboard không dây với thiết kế mỏng, đẹp. Pin sạc, kết nối Bluetooth. Hoàn hảo cho Mac, iPad',
    price: 149,
    originalPrice: 149,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=Magic+Keyboard',
    stock: 50,
    rating: 4.8,
    specs: {
      features: 'Wireless, Rechargeable Battery, Backlit Keys',
      battery: 'Up to 1 month',
      color: 'White, Black'
    }
  },
  {
    name: 'Magic Mouse',
    description: 'Chuột Magic Mouse không dây với Multi-Touch surface. Pin sạc, thiết kế đẹp. Tích hợp tốt với macOS',
    price: 79,
    originalPrice: 79,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=Magic+Mouse',
    stock: 60,
    rating: 4.6,
    specs: {
      features: 'Wireless, Multi-Touch Surface, Rechargeable',
      battery: 'Up to 1 month',
      color: 'White, Black'
    }
  },
  {
    name: 'Apple Pencil (2nd Gen)',
    description: 'Bút Apple Pencil thế hệ 2 cho iPad Pro và iPad Air. Độ nhạy cao, sạc không dây, hỗ trợ tilt và pressure',
    price: 129,
    originalPrice: 129,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=Apple+Pencil',
    stock: 70,
    rating: 4.9,
    specs: {
      features: 'Wireless Charging, Tilt & Pressure Sensitivity',
      battery: 'Up to 12 hours',
      color: 'White'
    }
  },
  {
    name: 'HomePod Mini',
    description: 'Loa thông minh HomePod Mini với Siri. Âm thanh 360 độ, điều khiển smart home. Thiết kế nhỏ gọn, giá tốt',
    price: 99,
    originalPrice: 99,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=HomePod+Mini',
    stock: 40,
    rating: 4.7,
    specs: {
      features: 'Siri, 360° Audio, Smart Home Control',
      color: 'White, Black, Yellow, Orange, Blue'
    }
  },
  {
    name: 'HomePod (2nd Gen)',
    description: 'Loa HomePod thế hệ 2 với âm thanh cao cấp, Siri. Spatial Audio, điều khiển smart home. Hoàn hảo cho phòng khách',
    price: 299,
    originalPrice: 299,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=HomePod',
    stock: 25,
    rating: 4.8,
    specs: {
      features: 'Siri, Spatial Audio, Smart Home Control',
      color: 'White, Black'
    }
  },
  {
    name: 'Apple TV 4K (3rd Gen)',
    description: 'Apple TV 4K với chip A15 Bionic, hỗ trợ HDR10+, Dolby Vision. Streaming 4K mượt mà, điều khiển Siri',
    price: 149,
    originalPrice: 179,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=Apple+TV+4K',
    stock: 35,
    rating: 4.7,
    specs: {
      features: '4K HDR, Dolby Vision, Siri Remote, Thread Support',
      storage: '64GB/128GB',
      color: 'Black'
    }
  }
];

