# 📮 HƯỚNG DẪN SETUP POSTMAN

## ✅ API ĐÃ HOÀN THIỆN

Tất cả các API endpoints đã được implement đầy đủ:

### ✅ **Controllers & Services:**
- ✅ Authentication (Login, Register, Verify)
- ✅ Products (CRUD, Search, Filter)
- ✅ Cart (Add, Update, Remove, Clear, Merge)
- ✅ Orders (Create, Get, Update Status, Cancel)
- ✅ Reviews (Create, Update, Delete, Moderate, Helpful)
- ✅ Wishlist (Add, Remove, Check)
- ✅ Coupons (Get, Validate, Create)
- ✅ Addresses (CRUD, Set Default)
- ✅ Users (Get Profile, Update)
- ✅ Statistics (Admin only)

---

## 🚀 CÁCH IMPORT VÀO POSTMAN

### **Bước 1: Mở Postman**

1. Mở ứng dụng Postman
2. Click **Import** (góc trên bên trái)

### **Bước 2: Import Collection**

1. Click **Upload Files**
2. Chọn file: `E-Commerce_API.postman_collection.json`
3. Click **Import**

### **Bước 3: Tạo Environment**

1. Click **Environments** (bên trái)
2. Click **+** để tạo mới
3. Đặt tên: `E-Commerce Local`
4. Thêm các variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `baseUrl` | `http://localhost:5000` | `http://localhost:5000` |
| `token` | (để trống) | (sẽ tự động set sau khi login) |
| `adminToken` | (để trống) | (sẽ tự động set sau khi login admin) |

5. Click **Save**

### **Bước 4: Chọn Environment**

1. Ở góc trên bên phải, chọn environment: **E-Commerce Local**

---

## 🧪 CÁCH TEST

### **1. Khởi Động Server**

```bash
cd backend
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

---

### **2. Test Flow Cơ Bản**

#### **Bước 1: Health Check**

1. Mở collection **E-Commerce API**
2. Mở folder **Health Check**
3. Chọn request **Health Check**
4. Click **Send**
5. ✅ Kết quả: `200 OK` với status `"ok"`

---

#### **Bước 2: Login (Admin)**

1. Mở folder **Authentication**
2. Chọn request **Login (Admin)**
3. Click **Send**
4. ✅ Kết quả: `200 OK` với `token`
5. ✅ Token sẽ tự động lưu vào variable `token` và `adminToken`

**Kiểm tra:**
- Vào **Environments** → **E-Commerce Local**
- Xem `token` và `adminToken` đã có giá trị chưa

---

#### **Bước 3: Get Products**

1. Mở folder **Products**
2. Chọn request **Get All Products**
3. Click **Send**
4. ✅ Kết quả: `200 OK` với danh sách products

**Lưu ý:** 
- Copy một `_id` của product để dùng cho các request khác
- Copy một `variantId` nếu product có variants

---

#### **Bước 4: Add to Cart**

1. Mở folder **Cart**
2. Chọn request **Add to Cart**
3. Thay `PRODUCT_ID_HERE` bằng product ID thật
4. Thay `VARIANT_ID_HERE` bằng variant ID (nếu có)
5. Click **Send**
6. ✅ Kết quả: `200 OK` với cart đã được cập nhật

---

#### **Bước 5: Get Cart**

1. Chọn request **Get Cart**
2. Click **Send**
3. ✅ Kết quả: `200 OK` với cart items

---

#### **Bước 6: Create Order**

1. Mở folder **Orders**
2. Chọn request **Create Order**
3. Thay `PRODUCT_ID_HERE` và `VARIANT_ID_HERE` bằng ID thật
4. Click **Send**
5. ✅ Kết quả: `201 Created` với order mới

**Lưu ý:** 
- Copy `orderNumber` để test các request khác
- Copy `_id` của order để test cancel/update status

---

#### **Bước 7: Get Orders**

1. Chọn request **Get Orders**
2. Click **Send**
3. ✅ Kết quả: `200 OK` với danh sách orders

---

### **3. Test Flow Nâng Cao**

#### **Test Reviews:**

1. **Create Review:**
   - Mở folder **Reviews**
   - Chọn **Create Review**
   - Điền `productId`, `variantId`, `orderId` (từ order đã tạo)
   - Click **Send**
   - ✅ Kết quả: `201 Created`

2. **Get Reviews:**
   - Chọn **Get Reviews by Product**
   - Thay `PRODUCT_ID_HERE` bằng product ID
   - Click **Send**
   - ✅ Kết quả: `200 OK` với danh sách reviews

3. **Moderate Review (Admin):**
   - Login với admin account trước
   - Chọn **Moderate Review (Admin)**
   - Thay `REVIEW_ID_HERE` bằng review ID
   - Set `status: "approved"`
   - Click **Send**
   - ✅ Kết quả: `200 OK`

---

#### **Test Wishlist:**

1. **Add to Wishlist:**
   - Mở folder **Wishlist**
   - Chọn **Add to Wishlist**
   - Thay `PRODUCT_ID_HERE` và `VARIANT_ID_HERE`
   - Click **Send**
   - ✅ Kết quả: `200 OK`

2. **Get Wishlist:**
   - Chọn **Get Wishlist**
   - Click **Send**
   - ✅ Kết quả: `200 OK` với wishlist items

---

#### **Test Coupons:**

1. **Get All Coupons:**
   - Mở folder **Coupons**
   - Chọn **Get All Coupons**
   - Click **Send**
   - ✅ Kết quả: `200 OK` với danh sách coupons

2. **Validate Coupon:**
   - Chọn **Validate Coupon**
   - Thay `USER_ID_HERE` bằng user ID
   - Set `code: "WELCOME10"`
   - Click **Send**
   - ✅ Kết quả: `200 OK` với discount info

---

## 📋 TEST ACCOUNTS (Từ Seed Data)

| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `admin123` | Admin |
| `admin2@example.com` | `admin123` | Admin |
| `user@example.com` | `password123` | User |
| `nguyenvanan@example.com` | `password123` | User |

---

## 🔧 TROUBLESHOOTING

### **Lỗi: "Cannot GET /api/..."**

**Nguyên nhân:** Server chưa chạy hoặc port sai

**Giải pháp:**
```bash
# Kiểm tra server đang chạy chưa
npm run dev

# Kiểm tra port trong .env
PORT=5000
```

---

### **Lỗi: "Unauthorized" hoặc "Token không hợp lệ"**

**Nguyên nhân:** Token chưa được set hoặc đã hết hạn

**Giải pháp:**
1. Login lại để lấy token mới
2. Kiểm tra environment variable `token` đã có giá trị chưa
3. Kiểm tra header `Authorization: Bearer {{token}}` đã đúng chưa

---

### **Lỗi: "Product not found"**

**Nguyên nhân:** Product ID không đúng hoặc chưa có data

**Giải pháp:**
1. Chạy seed data: `npm run seed`
2. Get products list để lấy ID thật
3. Copy ID từ response, không tự nhập

---

### **Lỗi: "Validation failed"**

**Nguyên nhân:** Thiếu required fields hoặc format sai

**Giải pháp:**
1. Kiểm tra body request có đầy đủ fields không
2. Xem ví dụ trong `API_TESTING_GUIDE.md`
3. Kiểm tra format JSON

---

## 📝 NOTES

### **Auto-save Token:**

Các request **Login** đã được setup để tự động lưu token vào environment variables:
- `token` - Token của user hiện tại
- `adminToken` - Token của admin (khi login admin)

Bạn không cần copy token thủ công!

---

### **Variables trong URL:**

Một số request có variables như `:id`, `:productId`:
- Thay `PRODUCT_ID_HERE` bằng ID thật từ database
- Hoặc dùng **Collection Variables** để lưu ID và dùng lại

---

### **Test với Real Data:**

1. Chạy seed: `npm run seed`
2. Get products để lấy ID thật
3. Copy ID vào các request khác
4. Test với data thật từ database

---

## 🎯 QUICK TEST CHECKLIST

- [ ] Health check works
- [ ] Login (Admin) → Token saved
- [ ] Get Products → See 51 products
- [ ] Add to Cart → Cart updated
- [ ] Get Cart → See items
- [ ] Create Order → Order created
- [ ] Get Orders → See orders
- [ ] Add to Wishlist → Added
- [ ] Get Wishlist → See items
- [ ] Create Review → Review created
- [ ] Get Reviews → See reviews
- [ ] Validate Coupon → Discount calculated
- [ ] Create Address → Address created

---

## 💡 TIPS

1. **Lưu IDs vào Collection Variables:**
   - Sau khi Get Products, copy một product ID
   - Vào Collection → Variables
   - Thêm variable `productId` với giá trị ID
   - Dùng `{{productId}}` trong các request khác

2. **Tạo Test Scripts:**
   - Mỗi request có thể có test scripts
   - Tự động kiểm tra response
   - Tự động lưu IDs vào variables

3. **Organize Requests:**
   - Tạo folders cho từng feature
   - Đặt tên request rõ ràng
   - Thêm descriptions

---

**🎉 Chúc bạn test API thành công với Postman!**

