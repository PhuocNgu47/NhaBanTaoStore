# 🌱 HƯỚNG DẪN SEED DATA MỚI

## ✅ ĐÃ CẬP NHẬT

File `seed.js` đã được cập nhật để phù hợp với schema mới:

### **Models mới được seed:**
- ✅ **Review** - Reviews collection riêng
- ✅ **Cart** - Giỏ hàng persistent
- ✅ **Wishlist** - Danh sách yêu thích

### **Models đã cập nhật:**
- ✅ **Product** - Có variants với giá và stock riêng
- ✅ **Order** - Có variantId, status mới, timestamps chi tiết
- ✅ **Address** - Cấu trúc mới (addressLine1, codes...)

---

## 🚀 CÁCH CHẠY SEED

```bash
cd backend
npm run seed
```

Hoặc:

```bash
node seed.js
```

---

## 📊 DỮ LIỆU ĐƯỢC TẠO

### **1. Users (10 users)**
- 2 Admin accounts
- 8 Regular users

**Test Accounts:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `password123`

### **2. Products (~50+ sản phẩm)**

**Đặc biệt:**
- **iPhone 15 Pro Max** có 3 variants:
  - 256GB Titanium - 30,000,000 VND
  - 512GB Titanium - 35,000,000 VND
  - 1TB Titanium - 40,000,000 VND

- **iPhone 15 Pro** có 2 variants:
  - 256GB Titanium - 25,000,000 VND
  - 512GB Titanium - 30,000,000 VND

**Categories:**
- iPhone (10+ sản phẩm)
- iPad (6+ sản phẩm)
- MacBook (5+ sản phẩm)
- Apple Watch (4+ sản phẩm)
- Accessories (25+ sản phẩm)

**Mỗi sản phẩm có:**
- SKU, slug (SEO-friendly)
- Price (VND)
- Variants (nếu có)
- Stock (ở variant level hoặc product level)
- Rating, reviewCount
- Status: active/inactive

### **3. Orders (5 đơn hàng mẫu)**

**Các trạng thái:**
- `pending` - Chờ xử lý (2 orders)
- `confirmed` - Đã xác nhận (1 order)
- `shipped` - Đã giao hàng (1 order)
- `delivered` - Đã nhận hàng (1 order)

**Mỗi đơn hàng có:**
- Items với variantId (nếu có variant)
- Subtotal, discountAmount, shippingFee, totalAmount
- Shipping address mới (addressLine1, codes...)
- Payment method: cod, bank_transfer, momo
- Payment status: pending, paid
- Timestamps: createdAt, confirmedAt, shippedAt, deliveredAt
- Tracking number (nếu shipped)

### **4. Reviews (3+ reviews)**

- Reviews cho sản phẩm đã delivered
- Status: approved (auto approve cho seed)
- Verified buyer: true
- Rating: 4-5 sao
- Có helpful votes

### **5. Carts (3 carts)**

- Carts cho 3 users đầu tiên
- Mỗi cart có 1 item với variant (nếu có)
- Expires sau 30 ngày

### **6. Wishlists (5 wishlist items)**

- Wishlist cho 5 users đầu tiên
- Mỗi user có 1 sản phẩm trong wishlist
- Có variantId nếu sản phẩm có variant

### **7. Addresses (5 addresses)**

- Addresses cho 5 users đầu tiên
- Cấu trúc mới: addressLine1, district, city, codes...
- 1 address mặc định cho user đầu tiên

### **8. Coupons (3 coupons)**

- WELCOME10: Giảm 10% cho khách hàng mới
- SALE20: Giảm 20% cho đơn hàng trên $500
- FIXED50: Giảm $50 cố định

---

## 🔍 KIỂM TRA DỮ LIỆU

### **1. Kiểm tra Products với Variants:**

```javascript
// Tìm product có variants
GET /api/products/:id

// Response sẽ có:
{
  "product": {
    "name": "iPhone 15 Pro Max",
    "price": 30000000, // Base price
    "variants": [
      {
        "_id": "...",
        "sku": "IP15PM-256-TIT",
        "name": "iPhone 15 Pro Max 256GB - Titanium",
        "price": 30000000,
        "stock": 10,
        "reserved": 0,
        "attributes": {
          "color": "Titanium",
          "storage": "256GB"
        }
      }
    ]
  }
}
```

### **2. Kiểm tra Reviews:**

```javascript
GET /api/reviews/product/:productId

// Response sẽ có:
{
  "reviews": [...],
  "stats": {
    "average": 4.8,
    "total": 3,
    "distribution": { "5": 2, "4": 1, "3": 0, "2": 0, "1": 0 }
  }
}
```

### **3. Kiểm tra Cart:**

```javascript
GET /api/cart
// Header: x-session-id: <session-id> (cho guest)
// Hoặc đăng nhập để lấy user cart
```

### **4. Kiểm tra Wishlist:**

```javascript
GET /api/wishlist
// Cần đăng nhập
```

### **5. Kiểm tra Orders với Variants:**

```javascript
GET /api/orders/:id

// Response sẽ có:
{
  "order": {
    "items": [
      {
        "productId": "...",
        "variantId": "...", // Nếu có variant
        "productName": "iPhone 15 Pro Max",
        "variantName": "iPhone 15 Pro Max 256GB - Titanium",
        "sku": "IP15PM-256-TIT",
        "quantity": 1,
        "price": 30000000
      }
    ]
  }
}
```

---

## ⚠️ LƯU Ý

### **1. Price Conversion:**
- Script tự động convert price từ USD sang VND
- Nếu price < 1000 → coi như USD, nhân 25000
- Nếu price >= 1000 → giữ nguyên (đã là VND)

### **2. Variants:**
- Chỉ một số sản phẩm có variants (iPhone 15 Pro Max, iPhone 15 Pro)
- Các sản phẩm khác không có variants (backward compatible)

### **3. Reviews:**
- Reviews được tạo từ orders đã delivered
- Auto approve cho seed data
- Verified buyer = true

### **4. Stock:**
- Stock ở variant level (nếu có variant)
- Stock ở product level (nếu không có variant)
- Reserved stock = 0 cho seed data

---

## 🧪 TEST CÁC TÍNH NĂNG MỚI

### **1. Test Variants:**
```bash
# Lấy product có variants
GET /api/products/:id

# Tạo order với variant
POST /api/orders
{
  "items": [
    {
      "productId": "...",
      "variantId": "...", // Variant cụ thể
      "quantity": 1,
      "price": 30000000
    }
  ],
  ...
}
```

### **2. Test Cart với Variants:**
```bash
# Thêm variant vào cart
POST /api/cart/items
{
  "productId": "...",
  "variantId": "...",
  "quantity": 1
}
```

### **3. Test Reviews:**
```bash
# Tạo review
POST /api/reviews/product/:productId
{
  "rating": 5,
  "title": "Tuyệt vời!",
  "comment": "Sản phẩm rất tốt",
  "variantId": "...",
  "orderId": "..." // Để verify buyer
}

# Admin approve review
PATCH /api/reviews/:reviewId/status
{
  "action": "approve"
}
```

### **4. Test Inventory:**
```bash
# Tạo order → stock được reserve
# Confirm order → stock được trừ
# Cancel order → stock được restore
```

---

## 📝 TÓM TẮT

**Chạy seed:**
```bash
npm run seed
```

**Dữ liệu tạo ra:**
- ✅ 10 users (2 admin + 8 users)
- ✅ 50+ products (một số có variants)
- ✅ 5 orders (với variants support)
- ✅ 3+ reviews (approved)
- ✅ 3 carts
- ✅ 5 wishlist items
- ✅ 5 addresses
- ✅ 3 coupons

**Tài khoản test:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `password123`

---

**💡 Sau khi seed, bạn có thể test tất cả tính năng mới!**

