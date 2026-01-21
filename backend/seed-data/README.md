# 📦 Seed Data - Export vào MongoDB

Thư mục này chứa các file JSON để export trực tiếp vào MongoDB.

## 🚀 Cách Nhanh Nhất: Dùng Mongo Express

**Nếu bạn đang dùng Mongo Express** (giao diện web tại `http://localhost:8081`):

1. Mở Mongo Express
2. Chọn database `ecommerce`
3. Chọn collection (ví dụ: `products`)
4. Click nút **"Import"** (màu cam)
5. Chọn file JSON từ thư mục này
6. Click "Import"

👉 **Xem hướng dẫn chi tiết:** [EXPORT_IMPORT_GUIDE.md](./EXPORT_IMPORT_GUIDE.md)

## 📋 Các File JSON

- **`products.json`** - Dữ liệu sản phẩm
- **`users.json`** - Dữ liệu người dùng
- **`coupons.json`** - Dữ liệu mã giảm giá

## 🚀 Cách Import vào MongoDB

### Cách 1: Dùng MongoDB Compass

1. Mở MongoDB Compass
2. Kết nối đến database của bạn
3. Chọn collection (ví dụ: `products`)
4. Click "Add Data" → "Import File"
5. Chọn file JSON tương ứng
6. Click "Import"

### Cách 2: Dùng MongoDB Shell (mongosh)

```bash
# Import products
mongosh "mongodb://localhost:27017/your-database-name" --eval "db.products.insertMany($(cat seed-data/products.json))"

# Import users
mongosh "mongodb://localhost:27017/your-database-name" --eval "db.users.insertMany($(cat seed-data/users.json))"

# Import coupons
mongosh "mongodb://localhost:27017/your-database-name" --eval "db.coupons.insertMany($(cat seed-data/coupons.json))"
```

### Cách 3: Dùng mongoimport

```bash
# Import products
mongoimport --uri="mongodb://localhost:27017/your-database-name" --collection=products --file=seed-data/products.json --jsonArray

# Import users
mongoimport --uri="mongodb://localhost:27017/your-database-name" --collection=users --file=seed-data/users.json --jsonArray

# Import coupons
mongoimport --uri="mongodb://localhost:27017/your-database-name" --collection=coupons --file=seed-data/coupons.json --jsonArray
```

### Cách 4: Dùng MongoDB Atlas (Cloud)

1. Vào MongoDB Atlas Dashboard
2. Chọn cluster của bạn
3. Click "Browse Collections"
4. Chọn database và collection
5. Click "Insert Document"
6. Paste nội dung từ file JSON (đã format đúng)
7. Click "Insert"

## 📝 Lưu Ý

- **Password**: File `users.json` chứa password đã hash. Bạn cần hash password mới trước khi import.
- **Images**: Tất cả link ảnh đã được xóa. Bạn cần thêm link ảnh của riêng bạn vào field `image` và `images`.
- **Dates**: Các field date cần format ISO 8601: `"2024-01-01T00:00:00.000Z"`
- **ObjectId**: MongoDB sẽ tự động tạo `_id` khi import, không cần thêm vào JSON.

## 🔧 Tùy Chỉnh Dữ Liệu

Bạn có thể:
1. Mở file JSON trong editor
2. Thêm/sửa/xóa dữ liệu
3. Thêm link ảnh vào field `image` và `images`
4. Import lại vào MongoDB

## ⚠️ Cảnh Báo

- **Backup**: Luôn backup database trước khi import
- **Duplicate**: Kiểm tra xem collection đã có dữ liệu chưa để tránh duplicate
- **Validation**: Đảm bảo dữ liệu JSON hợp lệ trước khi import

