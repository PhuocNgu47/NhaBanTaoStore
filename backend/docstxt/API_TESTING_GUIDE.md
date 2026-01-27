# 🧪 HƯỚNG DẪN TEST API

## 📋 Mục Lục
1. [Công Cụ Test API](#công-cụ-test-api)
2. [Khởi Động Server](#khởi-động-server)
3. [Test Authentication](#test-authentication)
4. [Test Products](#test-products)
5. [Test Cart](#test-cart)
6. [Test Orders](#test-orders)
7. [Test Reviews](#test-reviews)
8. [Test Wishlist](#test-wishlist)
9. [Test Coupons](#test-coupons)
10. [Test Addresses](#test-addresses)
11. [Test với cURL](#test-với-curl)
12. [Test với Postman](#test-với-postman)

---

## 🛠️ Công Cụ Test API

### **1. Postman** (Khuyến nghị)
- ✅ Giao diện trực quan
- ✅ Lưu requests, collections
- ✅ Test tự động
- 📥 Download: https://www.postman.com/downloads/

### **2. Thunder Client** (VS Code Extension)
- ✅ Tích hợp trong VS Code
- ✅ Không cần cài app riêng
- 📥 Install: VS Code Extensions → Search "Thunder Client"

### **3. cURL** (Command Line)
- ✅ Có sẵn trên terminal
- ✅ Script automation
- ✅ Không cần cài thêm

### **4. REST Client** (VS Code Extension)
- ✅ Test API bằng file `.http`
- ✅ Tích hợp trong VS Code

---

## 🚀 Khởi Động Server

```bash
# Terminal 1: Start server
cd backend
npm run dev

# Terminal 2: Test API (nếu dùng cURL)
# Hoặc mở Postman/Thunder Client
```

**Server sẽ chạy tại:** `http://localhost:5000`

---

## 🔐 Test Authentication

### **1. Health Check (Không cần auth)**

```http
GET http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "mongodb": "connected",
  "version": "1.0.0"
}
```

---

### **2. Đăng Ký (Register)**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn Test",
  "email": "test@example.com",
  "password": "password123",
  "phone": "0901234567"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Nguyễn Văn Test",
    "email": "test@example.com",
    "role": "user"
  }
}
```

---

### **3. Đăng Nhập (Login)**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Lưu token này để dùng cho các API cần authentication!**

---

### **4. Verify Token**

```http
GET http://localhost:5000/api/auth/verify
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 📦 Test Products

### **1. Lấy Danh Sách Sản Phẩm (Không cần auth)**

```http
GET http://localhost:5000/api/products
```

**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số items mỗi trang (mặc định: 10)
- `category`: Lọc theo category (ví dụ: `iPhone`, `iPad`)
- `search`: Tìm kiếm theo tên
- `minPrice`: Giá tối thiểu
- `maxPrice`: Giá tối đa
- `sort`: Sắp xếp (`price`, `-price`, `rating`, `-rating`)

**Ví dụ:**
```http
GET http://localhost:5000/api/products?category=iPhone&page=1&limit=10&sort=-price
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "iPhone 15 Pro Max",
      "slug": "iphone-15-pro-max",
      "price": 30000000,
      "originalPrice": 35000000,
      "category": "iPhone",
      "rating": 4.5,
      "reviewCount": 10,
      "variants": [
        {
          "_id": "...",
          "sku": "IP15PM-256-TIT",
          "name": "iPhone 15 Pro Max 256GB - Titanium",
          "price": 30000000,
          "stock": 50,
          "attributes": {
            "color": "Titanium",
            "storage": "256GB"
          }
        }
      ],
      "image": "https://...",
      "images": ["https://...", "https://..."]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 51,
    "pages": 6
  }
}
```

---

### **2. Lấy Chi Tiết Sản Phẩm**

```http
GET http://localhost:5000/api/products/:id
```

**Ví dụ:**
```http
GET http://localhost:5000/api/products/507f1f77bcf86cd799439011
```

**Hoặc dùng slug:**
```http
GET http://localhost:5000/api/products/slug/iphone-15-pro-max
```

---

### **3. Tạo Sản Phẩm (Cần Admin)**

```http
POST http://localhost:5000/api/products
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "iPhone 16 Pro",
  "slug": "iphone-16-pro",
  "sku": "IP16P",
  "price": 32000000,
  "originalPrice": 35000000,
  "category": "iPhone",
  "description": "iPhone 16 Pro mới nhất",
  "image": "https://example.com/image.jpg",
  "variants": [
    {
      "sku": "IP16P-256-BLU",
      "name": "iPhone 16 Pro 256GB - Blue",
      "price": 32000000,
      "stock": 100,
      "attributes": {
        "color": "Blue",
        "storage": "256GB"
      }
    }
  ]
}
```

---

### **4. Cập Nhật Sản Phẩm (Cần Admin)**

```http
PUT http://localhost:5000/api/products/:id
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "price": 31000000,
  "stock": 80
}
```

---

### **5. Xóa Sản Phẩm (Cần Admin)**

```http
DELETE http://localhost:5000/api/products/:id
Authorization: Bearer ADMIN_TOKEN
```

---

## 🛒 Test Cart

### **1. Lấy Giỏ Hàng (Cần auth)**

```http
GET http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "cart": {
    "_id": "...",
    "userId": "...",
    "items": [
      {
        "productId": "...",
        "variantId": "...",
        "product": {
          "name": "iPhone 15 Pro Max",
          "image": "https://..."
        },
        "variant": {
          "name": "iPhone 15 Pro Max 256GB - Titanium",
          "price": 30000000,
          "stock": 50
        },
        "quantity": 2,
        "subtotal": 60000000
      }
    ],
    "total": 60000000,
    "itemCount": 2
  }
}
```

---

### **2. Thêm Sản Phẩm Vào Giỏ Hàng**

```http
POST http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "variantId": "507f1f77bcf86cd799439012",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đã thêm vào giỏ hàng",
  "cart": { ... }
}
```

---

### **3. Cập Nhật Số Lượng**

```http
PUT http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "variantId": "507f1f77bcf86cd799439012",
  "quantity": 3
}
```

---

### **4. Xóa Sản Phẩm Khỏi Giỏ Hàng**

```http
DELETE http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "variantId": "507f1f77bcf86cd799439012"
}
```

---

### **5. Xóa Toàn Bộ Giỏ Hàng**

```http
DELETE http://localhost:5000/api/cart/clear
Authorization: Bearer YOUR_TOKEN
```

---

## 📦 Test Orders

### **1. Tạo Đơn Hàng**

```http
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "variantId": "507f1f77bcf86cd799439012",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "addressLine1": "123 Đường Nguyễn Huệ",
    "ward": "Phường Bến Nghé",
    "district": "Quận 1",
    "city": "Hồ Chí Minh",
    "country": "Vietnam"
  },
  "paymentMethod": "cod",
  "couponCode": "WELCOME10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đơn hàng đã được tạo",
  "order": {
    "_id": "...",
    "orderNumber": "1735689600000",
    "status": "pending",
    "totalAmount": 27000000,
    "items": [ ... ],
    "shippingAddress": { ... }
  }
}
```

---

### **2. Lấy Danh Sách Đơn Hàng Của User**

```http
GET http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `status`: Lọc theo status (`pending`, `confirmed`, `shipped`, `delivered`)
- `page`: Số trang
- `limit`: Số items mỗi trang

**Ví dụ:**
```http
GET http://localhost:5000/api/orders?status=delivered&page=1&limit=10
```

---

### **3. Lấy Chi Tiết Đơn Hàng**

```http
GET http://localhost:5000/api/orders/:id
Authorization: Bearer YOUR_TOKEN
```

---

### **4. Hủy Đơn Hàng**

```http
PATCH http://localhost:5000/api/orders/:id/cancel
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "cancellationReason": "Không còn nhu cầu"
}
```

---

### **5. Cập Nhật Status (Admin)**

```http
PATCH http://localhost:5000/api/orders/:id/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "VN123456789",
  "shippingCompany": "Vietnam Post"
}
```

---

## ⭐ Test Reviews

### **1. Lấy Reviews Của Sản Phẩm**

```http
GET http://localhost:5000/api/reviews/product/:productId
```

**Query Parameters:**
- `status`: Lọc theo status (`approved`, `pending`)
- `rating`: Lọc theo rating (1-5)
- `page`: Số trang
- `limit`: Số items mỗi trang

**Ví dụ:**
```http
GET http://localhost:5000/api/reviews/product/507f1f77bcf86cd799439011?status=approved&rating=5
```

---

### **2. Tạo Review (Cần auth)**

```http
POST http://localhost:5000/api/reviews
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "variantId": "507f1f77bcf86cd799439012",
  "orderId": "507f1f77bcf86cd799439013",
  "rating": 5,
  "title": "Sản phẩm tuyệt vời!",
  "comment": "Rất hài lòng với sản phẩm này",
  "images": ["https://example.com/review1.jpg"]
}
```

---

### **3. Cập Nhật Review**

```http
PUT http://localhost:5000/api/reviews/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "rating": 4,
  "comment": "Sản phẩm tốt nhưng giá hơi cao"
}
```

---

### **4. Xóa Review**

```http
DELETE http://localhost:5000/api/reviews/:id
Authorization: Bearer YOUR_TOKEN
```

---

### **5. Đánh Dấu Review Hữu Ích**

```http
POST http://localhost:5000/api/reviews/:id/helpful
Authorization: Bearer YOUR_TOKEN
```

---

### **6. Moderation Review (Admin)**

```http
PATCH http://localhost:5000/api/reviews/:id/moderate
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "approved",
  "rejectionReason": null
}
```

---

## ❤️ Test Wishlist

### **1. Lấy Wishlist**

```http
GET http://localhost:5000/api/wishlist
Authorization: Bearer YOUR_TOKEN
```

---

### **2. Thêm Vào Wishlist**

```http
POST http://localhost:5000/api/wishlist
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "variantId": "507f1f77bcf86cd799439012"
}
```

---

### **3. Xóa Khỏi Wishlist**

```http
DELETE http://localhost:5000/api/wishlist
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "variantId": "507f1f77bcf86cd799439012"
}
```

---

### **4. Kiểm Tra Sản Phẩm Có Trong Wishlist**

```http
GET http://localhost:5000/api/wishlist/check/:productId/:variantId
Authorization: Bearer YOUR_TOKEN
```

---

## 🎫 Test Coupons

### **1. Lấy Danh Sách Coupons (Không cần auth)**

```http
GET http://localhost:5000/api/coupons
```

---

### **2. Validate Coupon**

```http
POST http://localhost:5000/api/coupons/validate
Content-Type: application/json

{
  "code": "WELCOME10",
  "userId": "507f1f77bcf86cd799439011",
  "totalAmount": 1000000
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "coupon": {
    "code": "WELCOME10",
    "name": "Giảm 10% cho khách hàng mới",
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 100000
  }
}
```

---

### **3. Tạo Coupon (Admin)**

```http
POST http://localhost:5000/api/coupons
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "code": "BLACKFRIDAY50",
  "name": "Black Friday 50%",
  "discountType": "percentage",
  "discountValue": 50,
  "minPurchase": 1000000,
  "maxDiscount": 500000,
  "validFrom": "2024-11-01T00:00:00.000Z",
  "validTo": "2024-11-30T23:59:59.000Z",
  "usageLimit": 100,
  "isActive": true
}
```

---

## 📍 Test Addresses

### **1. Lấy Danh Sách Địa Chỉ**

```http
GET http://localhost:5000/api/addresses
Authorization: Bearer YOUR_TOKEN
```

---

### **2. Tạo Địa Chỉ**

```http
POST http://localhost:5000/api/addresses
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "phone": "0901234567",
  "address": "123 Đường Nguyễn Huệ",
  "ward": "Phường Bến Nghé",
  "district": "Quận 1",
  "city": "Hồ Chí Minh",
  "country": "Vietnam",
  "zipCode": "700000",
  "isDefault": true,
  "label": "Nhà riêng"
}
```

---

### **3. Cập Nhật Địa Chỉ**

```http
PUT http://localhost:5000/api/addresses/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "phone": "0909876543",
  "address": "456 Đường Lê Lợi"
}
```

---

### **4. Xóa Địa Chỉ**

```http
DELETE http://localhost:5000/api/addresses/:id
Authorization: Bearer YOUR_TOKEN
```

---

### **5. Đặt Địa Chỉ Mặc Định**

```http
PATCH http://localhost:5000/api/addresses/:id/default
Authorization: Bearer YOUR_TOKEN
```

---

## 💻 Test với cURL

### **1. Health Check**

```bash
curl http://localhost:5000/api/health
```

---

### **2. Đăng Nhập**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Lưu token từ response:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### **3. Lấy Products (với token)**

```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN"
```

---

### **4. Tạo Order**

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "variantId": "507f1f77bcf86cd799439012",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "addressLine1": "123 Đường Nguyễn Huệ",
      "district": "Quận 1",
      "city": "Hồ Chí Minh"
    },
    "paymentMethod": "cod"
  }'
```

---

## 📮 Test với Postman

### **1. Setup Postman Collection**

1. Tạo Collection mới: `E-commerce API`
2. Tạo Environment: `Local Development`
3. Thêm variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: (sẽ được set sau khi login)

---

### **2. Tạo Request: Login**

1. Method: `POST`
2. URL: `{{baseUrl}}/api/auth/login`
3. Body (raw JSON):
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
4. Tests (JavaScript):
```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
}
```

---

### **3. Tạo Request: Get Products**

1. Method: `GET`
2. URL: `{{baseUrl}}/api/products`
3. Headers:
   - `Authorization`: `Bearer {{token}}`

---

### **4. Tạo Request: Add to Cart**

1. Method: `POST`
2. URL: `{{baseUrl}}/api/cart`
3. Headers:
   - `Authorization`: `Bearer {{token}}`
   - `Content-Type`: `application/json`
4. Body (raw JSON):
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "variantId": "507f1f77bcf86cd799439012",
  "quantity": 1
}
```

---

## 🧪 Test Scenarios

### **Scenario 1: User Flow Hoàn Chỉnh**

1. ✅ Register/Login
2. ✅ Browse Products
3. ✅ Add to Cart
4. ✅ Add to Wishlist
5. ✅ Create Address
6. ✅ Create Order
7. ✅ Write Review (sau khi delivered)

---

### **Scenario 2: Admin Flow**

1. ✅ Login as Admin
2. ✅ Create Product
3. ✅ Update Product
4. ✅ View Orders
5. ✅ Update Order Status
6. ✅ Moderate Reviews

---

### **Scenario 3: Cart & Checkout**

1. ✅ Add multiple items to cart
2. ✅ Update quantities
3. ✅ Remove items
4. ✅ Apply coupon
5. ✅ Create order from cart
6. ✅ Clear cart after order

---

## 🔍 Debug Tips

### **1. Kiểm Tra Token**

```bash
# Decode JWT token (không verify)
echo "YOUR_TOKEN" | cut -d. -f2 | base64 -d
```

---

### **2. Xem Logs Server**

Server sẽ log tất cả requests:
```
GET /api/products 200
POST /api/auth/login 200
POST /api/orders 201
```

---

### **3. Test với Invalid Data**

```bash
# Test validation
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'
```

---

## 📝 Test Accounts (Từ Seed Data)

| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `admin123` | Admin |
| `admin2@example.com` | `admin123` | Admin |
| `nguyenvanan@example.com` | `password123` | User |
| `tranthibinh@example.com` | `password123` | User |
| `user@example.com` | `password123` | User |

---

## 🎯 Quick Test Checklist

- [ ] Health check works
- [ ] Register new user
- [ ] Login and get token
- [ ] Get products list
- [ ] Get product details
- [ ] Add to cart
- [ ] Get cart
- [ ] Create order
- [ ] Get orders
- [ ] Add to wishlist
- [ ] Create review
- [ ] Validate coupon
- [ ] Create address

---

## 💡 Tips

1. **Lưu token vào environment variable** để dùng lại
2. **Test error cases**: invalid token, missing fields, etc.
3. **Test với variants**: Đảm bảo test với products có variants
4. **Test pagination**: Test với `page` và `limit`
5. **Test filters**: Test với `category`, `search`, `price range`

---

**🎉 Chúc bạn test API thành công!**

