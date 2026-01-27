# 🔧 Hướng Dẫn Setup Environment Variables

## 📋 Tạo File .env

1. Copy file mẫu (nếu có):
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Hoặc tạo file mới:
   ```bash
   cd backend
   touch .env
   ```

## 📝 Nội Dung File .env

Tạo file `backend/.env` với nội dung sau:

```env
# ============================================
# MongoDB Configuration
# ============================================
# MongoDB Atlas (Production - Khuyên dùng)
MONGODB_URI=mongodb+srv://huuphuocdev:YOUR_PASSWORD@web-app.yfoocsp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=web-app

# Local MongoDB (Development - nếu không dùng Atlas)
# MONGODB_URI=mongodb://localhost:27017/ecommerce

# ============================================
# JWT Configuration
# ============================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# ============================================
# Server Configuration
# ============================================
NODE_ENV=development
PORT=5000

# ============================================
# SePay Payment Configuration
# ============================================
SEPAY_BANK_ID=MB
SEPAY_ACCOUNT_NO=0935771670
SEPAY_ACCOUNT_NAME=NGUYEN HUU PHUOC
SEPAY_API_KEY=your-sepay-api-key-here

# ============================================
# Frontend URL (cho CORS)
# ============================================
FRONTEND_URL=http://localhost:3000
```

## 🔑 Quan Trọng: Thay Đổi Các Giá Trị

### 1. MONGODB_URI

**Từ MongoDB Atlas:**
```
mongodb+srv://huuphuocdev:<password>@web-app.yfoocsp.mongodb.net/?appName=web-app
```

**Cập nhật thành:**
```env
MONGODB_URI=mongodb+srv://huuphuocdev:YOUR_ACTUAL_PASSWORD@web-app.yfoocsp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=web-app
```

**Lưu ý:**
- ✅ Thay `YOUR_ACTUAL_PASSWORD` bằng password thật (không có dấu `<>`)
- ✅ Thêm tên database: `/ecommerce` (hoặc tên database bạn muốn)
- ✅ URL encode password nếu có ký tự đặc biệt:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

**Ví dụ:**
- Password: `MyP@ssw0rd#123`
- URL encoded: `MyP%40ssw0rd%23123`
- Connection string: `mongodb+srv://huuphuocdev:MyP%40ssw0rd%23123@web-app.yfoocsp.mongodb.net/ecommerce?retryWrites=true&w=majority`

### 2. JWT_SECRET

Tạo một secret key mạnh:
```bash
# Linux/Mac
openssl rand -base64 32

# Hoặc dùng online generator
# https://randomkeygen.com/
```

### 3. Các Biến Khác

- `NODE_ENV`: `development` hoặc `production`
- `PORT`: Port của backend (mặc định: 5000)
- `SEPAY_*`: Cấu hình SePay payment (nếu dùng)

## ✅ Test Configuration

Sau khi tạo file `.env`, test kết nối:

```bash
cd backend
node test-connection.js
```

Nếu thấy `✅ Kết nối thành công!` → Đã setup đúng!

## 🔒 Bảo Mật

### 1. Không Commit .env

Đảm bảo `.env` đã có trong `.gitignore`:

```gitignore
# .env files
.env
.env.local
.env.production
.env.*.local
```

### 2. Production Environment

Trong production, dùng environment variables thay vì file `.env`:

```bash
# PM2
pm2 start ecosystem.config.js --env production

# Hoặc export
export MONGODB_URI="mongodb+srv://..."
export JWT_SECRET="..."
```

## 🐛 Troubleshooting

### Lỗi: "MONGODB_URI chưa được cấu hình"

**Giải pháp:**
1. Kiểm tra file `.env` có tồn tại trong `backend/`
2. Kiểm tra tên biến: `MONGODB_URI` (không có khoảng trắng)
3. Đảm bảo không có dấu ngoặc kép thừa

### Lỗi: "authentication failed"

**Giải pháp:**
1. Kiểm tra username và password
2. URL encode password nếu có ký tự đặc biệt
3. Kiểm tra database user trong MongoDB Atlas

### Lỗi: "IP not whitelisted"

**Giải pháp:**
1. Vào MongoDB Atlas > Network Access
2. Thêm IP hiện tại của bạn
3. Đợi vài phút để apply

## 📚 Tài Liệu Thêm

- [HUONG_DAN_MONGODB_ATLAS.md](./HUONG_DAN_MONGODB_ATLAS.md) - Hướng dẫn chi tiết MongoDB Atlas
- [PRODUCTION_STACK.md](../PRODUCTION_STACK.md) - Production setup

