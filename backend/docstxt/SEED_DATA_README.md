# 📁 Seed Data Structure

Cấu trúc thư mục seed data đã được tách nhỏ để dễ quản lý.

## 📂 Cấu Trúc

```
seed-data/
├── users.js                    # Users data (10 users)
├── coupons.js                  # Coupons data (3 coupons)
├── products.js                 # Main file - import tất cả products
├── products-iphone.js          # iPhone products (9 sản phẩm)
├── products-ipad.js           # iPad products (8 sản phẩm)
├── products-macbook.js        # MacBook products (9 sản phẩm)
├── products-watch.js          # Apple Watch products (4 sản phẩm)
└── products-accessories.js    # Accessories products (20 sản phẩm)

seed-scripts/
├── seedUsers.js               # Logic seed users
├── seedProducts.js            # Logic seed products
├── seedOrders.js             # Logic seed orders
├── seedAddresses.js         # Logic seed addresses
├── seedCoupons.js           # Logic seed coupons
├── seedReviews.js           # Logic seed reviews
├── seedCarts.js             # Logic seed carts
└── seedWishlists.js         # Logic seed wishlists

seed.js                        # Main entry point - orchestrate tất cả
```

## 🔧 Cách Sử Dụng

### **Chạy seed:**
```bash
npm run seed
```

### **Thêm sản phẩm mới:**
1. Thêm vào file tương ứng trong `seed-data/` (ví dụ: `products-iphone.js`)
2. Hoặc tạo file mới nếu category mới
3. Import vào `products.js` nếu cần

### **Thêm logic seed mới:**
1. Tạo file mới trong `seed-scripts/` (ví dụ: `seedNewFeature.js`)
2. Export function seed
3. Import và gọi trong `seed.js`

## 📝 Lưu Ý

- **products.js** là file chính, import tất cả products từ các file riêng
- Mỗi file seed script độc lập, có thể test riêng
- Data và logic tách biệt để dễ maintain

