# 🌱 Hướng Dẫn Seed Dữ Liệu Cơ Bản

Hướng dẫn nhanh để tạo dữ liệu mẫu và chạy được tất cả tính năng của dự án.

## 🎯 Mục Đích

Seed dữ liệu để test các tính năng:
- ✅ Đăng nhập/Đăng ký
- ✅ Xem sản phẩm
- ✅ Thêm vào giỏ hàng
- ✅ Tạo đơn hàng
- ✅ Quản lý địa chỉ
- ✅ Sử dụng mã giảm giá
- ✅ Admin dashboard

---

## 🚀 Cách Seed Dữ Liệu

### Bước 1: Đảm Bảo MongoDB Đã Kết Nối

```bash
cd backend
node test-connection.js
```

Nếu thấy `✅ Kết nối thành công!` → Tiếp tục bước 2.

### Bước 2: Chạy Seed

```bash
npm run seed
```

Hoặc:

```bash
node seed.js
```

### Bước 3: Kiểm Tra Kết Quả

Sau khi chạy seed, bạn sẽ thấy:

```
✅ Created 10 users
✅ Created 50+ products
✅ Created 5 sample orders
```

---

## 📊 Dữ Liệu Được Tạo

### 👤 Users (10 users)

| Email | Password | Role | Mô Tả |
|-------|----------|------|-------|
| `admin@example.com` | `admin123` | admin | Admin chính |
| `admin2@example.com` | `admin123` | admin | Admin phụ |
| `user@example.com` | `password123` | user | User test chính |
| `nguyenvanan@example.com` | `password123` | user | User test |
| ... | ... | ... | ... |

**Tổng cộng:** 2 admin + 8 users

### 📦 Products (~50+ sản phẩm)

**Categories:**
- iPhone (10+ sản phẩm)
- iPad (6+ sản phẩm)
- MacBook (5+ sản phẩm)
- Apple Watch (4+ sản phẩm)
- Accessories (25+ sản phẩm)

**Mỗi sản phẩm có:**
- Tên, mô tả, giá
- Hình ảnh (placeholder)
- Stock (số lượng tồn kho)
- Rating (đánh giá)

### 🛒 Orders (5 đơn hàng mẫu)

**Các trạng thái:**
- `pending` - Chờ xử lý
- `confirmed` - Đã xác nhận
- `shipped` - Đã giao hàng
- `delivered` - Đã nhận hàng

**Mỗi đơn hàng có:**
- Order number
- User (người đặt)
- Items (sản phẩm)
- Total amount
- Shipping address
- Payment method
- Status

---

## ✅ Checklist Sau Khi Seed

Sau khi seed xong, kiểm tra:

- [ ] **Users:** Có thể đăng nhập với `admin@example.com` / `admin123`
- [ ] **Products:** Có thể xem danh sách sản phẩm
- [ ] **Orders:** Có thể xem lịch sử đơn hàng
- [ ] **Admin:** Có thể vào admin dashboard

---

## 🔄 Seed Lại Dữ Liệu

Nếu muốn seed lại từ đầu:

```bash
npm run seed
```

**Lưu ý:** Script sẽ **XÓA TẤT CẢ** dữ liệu cũ trước khi seed mới.

---

## 🧪 Test Các Tính Năng

### 1. Test Đăng Nhập

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**User:**
- Email: `user@example.com`
- Password: `password123`

### 2. Test Xem Sản Phẩm

```bash
# API endpoint
GET http://localhost:5000/api/products

# Hoặc mở browser
http://localhost:3000
```

### 3. Test Tạo Đơn Hàng

1. Đăng nhập với user
2. Thêm sản phẩm vào giỏ hàng
3. Checkout và tạo đơn hàng

### 4. Test Admin Dashboard

1. Đăng nhập với admin
2. Vào `/admin/dashboard`
3. Xem thống kê, quản lý sản phẩm, đơn hàng

---

## ⚠️ Lưu Ý

### 1. Seed Chỉ Chạy 1 Lần

- Script sẽ xóa dữ liệu cũ trước khi seed
- Nếu chạy lại, sẽ tạo lại từ đầu

### 2. Users Có Thể Duplicate

- Nếu chạy seed nhiều lần, users có thể bị duplicate
- Email là unique, nên sẽ báo lỗi nếu trùng

### 3. Products Có Thể Seed Nhiều Lần

- Products không có unique constraint (trừ _id)
- Có thể seed nhiều lần và sẽ thêm mới

### 4. Orders Được Tạo Tự Động

- Orders được tạo từ users và products có sẵn
- Nếu không đủ users/products, orders sẽ không được tạo

---

## 🐛 Troubleshooting

### Lỗi: "MONGODB_URI chưa được cấu hình"

**Giải pháp:**
1. Kiểm tra file `.env` có tồn tại không
2. Kiểm tra có biến `MONGODB_URI` không
3. Xem `ENV_SETUP.md` để setup

### Lỗi: "Cannot connect to MongoDB"

**Giải pháp:**
1. Kiểm tra MongoDB Atlas đang hoạt động
2. Kiểm tra IP đã được whitelist chưa
3. Kiểm tra connection string đúng chưa

### Lỗi: "Email already exists"

**Giải pháp:**
- Đây là lỗi bình thường nếu đã seed trước đó
- Script sẽ tự động xóa dữ liệu cũ trước khi seed mới
- Nếu vẫn lỗi, xóa thủ công trong MongoDB

---

## 📝 Tóm Tắt

### Lệnh Seed:

```bash
cd backend
npm run seed
```

### Dữ Liệu Tạo Ra:

- ✅ 10 users (2 admin + 8 users)
- ✅ 50+ products (đầy đủ categories)
- ✅ 5 orders (các trạng thái khác nhau)
- ✅ 5 addresses (địa chỉ giao hàng)
- ✅ 3 coupons (mã giảm giá)

### Tài Khoản Test:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**User:**
- Email: `user@example.com`
- Password: `password123`

---

**💡 Sau khi seed xong, bạn có thể test tất cả tính năng của dự án!**

