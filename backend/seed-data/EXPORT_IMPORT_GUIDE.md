# 📤📥 Hướng Dẫn Export/Import với Mongo Express

Mongo Express là giao diện web để quản lý MongoDB, bạn có thể export và import dữ liệu trực tiếp từ đây.

## 📤 Export Dữ Liệu từ Mongo Express

### Cách 1: Export toàn bộ Collection (JSON)

1. **Mở Mongo Express** tại `http://localhost:8081`
2. **Chọn database** (ví dụ: `ecommerce`)
3. **Tìm collection** bạn muốn export (ví dụ: `products`, `users`, `orders`)
4. **Click nút "Export"** (màu cam) hoặc **"[JSON]"** (màu cam)
5. File JSON sẽ được tải về máy

### Cách 2: Export từng Document

1. **Click nút "View"** (màu xanh) để xem collection
2. **Chọn document** bạn muốn export
3. **Copy JSON** của document đó
4. **Paste vào file JSON** của bạn

### Cách 3: Export nhiều Documents

1. **Click "View"** để xem collection
2. **Chọn các documents** bạn muốn export (checkbox)
3. **Copy JSON** của các documents
4. **Paste vào file JSON** (format array: `[{...}, {...}]`)

## 📥 Import Dữ Liệu vào Mongo Express

### Cách 1: Import từ File JSON

1. **Mở Mongo Express** tại `http://localhost:8081`
2. **Chọn database** (ví dụ: `ecommerce`)
3. **Tìm collection** bạn muốn import vào (hoặc tạo mới)
4. **Click nút "Import"** (màu cam)
5. **Chọn file JSON** từ máy
6. **Click "Import"**

**Lưu ý:**
- File JSON phải là array: `[{...}, {...}]`
- Nếu chỉ có 1 object, bọc trong array: `[{...}]`

### Cách 2: Import từng Document

1. **Click "View"** để xem collection
2. **Click "New Document"** hoặc icon "+"
3. **Paste JSON** vào editor
4. **Click "Save"**

## 📋 Ví Dụ File JSON để Import

### File `products.json`:
```json
[
  {
    "name": "iPhone 15 Pro Max",
    "sku": "IP15PM",
    "slug": "iphone-15-pro-max",
    "description": "Điện thoại flagship Apple",
    "price": 30000000,
    "originalPrice": 30000000,
    "category": "iPhone",
    "image": "https://your-image-url.com/iphone15.jpg",
    "images": [
      "https://your-image-url.com/iphone15-1.jpg",
      "https://your-image-url.com/iphone15-2.jpg"
    ],
    "stock": 10,
    "rating": 5,
    "reviewCount": 0,
    "status": "active"
  },
  {
    "name": "iPad Pro 12.9",
    "sku": "IPADP129",
    "slug": "ipad-pro-12-9",
    "description": "Máy tính bảng cao cấp",
    "price": 25000000,
    "originalPrice": 25000000,
    "category": "iPad",
    "image": "https://your-image-url.com/ipad.jpg",
    "images": [],
    "stock": 5,
    "rating": 4.8,
    "reviewCount": 0,
    "status": "active"
  }
]
```

### File `users.json`:
```json
[
  {
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "$2a$10$hashedPasswordHere",
    "role": "admin",
    "phone": "0123456789",
    "isEmailVerified": true,
    "isActive": true
  },
  {
    "name": "Test User",
    "email": "user@example.com",
    "password": "$2a$10$hashedPasswordHere",
    "role": "user",
    "phone": "0987654321",
    "isEmailVerified": true,
    "isActive": true
  }
]
```

## ⚠️ Lưu Ý Quan Trọng

### 1. Format JSON
- Phải là **array**: `[{...}, {...}]`
- Không được có **trailing comma**: `[{...},]` ❌
- Phải có **dấu ngoặc vuông** bao quanh: `[...]`

### 2. ObjectId
- MongoDB sẽ tự động tạo `_id` khi import
- Nếu bạn muốn giữ `_id` cũ, format như sau:
```json
{
  "_id": {"$oid": "507f1f77bcf86cd799439011"},
  "name": "Product Name"
}
```

### 3. Dates
- Format ISO 8601: `"2024-01-01T00:00:00.000Z"`
- Hoặc dùng MongoDB Date: `{"$date": "2024-01-01T00:00:00.000Z"}`

### 4. Password (Users)
- Phải hash password trước khi import
- Dùng bcrypt để hash: `$2a$10$...`
- Không được import password plain text

## 🔄 Workflow Đề Xuất

### Export dữ liệu hiện tại:
1. Mở Mongo Express
2. Export collection `products` → `products-backup.json`
3. Export collection `users` → `users-backup.json`
4. Lưu backup để phòng khi cần

### Import dữ liệu mới:
1. Chuẩn bị file JSON (đã thêm ảnh, dữ liệu của bạn)
2. Mở Mongo Express
3. Xóa collection cũ (nếu cần) - Click "Del"
4. Import file JSON mới - Click "Import"
5. Kiểm tra dữ liệu - Click "View"

## 🎯 Các Collection Cần Export/Import

Dựa trên Mongo Express của bạn, các collection quan trọng:

1. **`products`** - Sản phẩm
2. **`users`** - Người dùng
3. **`orders`** - Đơn hàng
4. **`reviews`** - Đánh giá
5. **`wishlists`** - Danh sách yêu thích
6. **`provinces`** - Tỉnh/thành (địa chỉ VN)
7. **`wards`** - Phường/xã (địa chỉ VN)

## 💡 Tips

- **Backup trước khi import**: Luôn export dữ liệu cũ trước khi import mới
- **Validate JSON**: Dùng JSON validator online để kiểm tra file trước khi import
- **Test với 1 document**: Import 1 document trước để test, sau đó import toàn bộ
- **Kiểm tra sau import**: Click "View" để xem dữ liệu đã import đúng chưa

