---
description: Hướng dẫn cài đặt và chạy dự án Nhà Bán Táo Store từ đầu
---

// turbo-all

# 🍎 Hướng Dẫn Cài Đặt Dự Án Nhà Bán Táo Store

## 📋 Yêu Cầu Hệ Thống

- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local hoặc MongoDB Atlas)
- **Git**

---

## 🚀 Bước 1: Clone Repository

```bash
git clone https://github.com/PhuocNgu47/NhaBanTaoStore.git
cd NhaBanTaoStore
```

---

## 📦 Bước 2: Cài Đặt Dependencies

### Frontend (thư mục gốc)
```bash
npm install
```

### Backend
```bash
cd backend
npm install
cd ..
```

---

## ⚙️ Bước 3: Cấu Hình Môi Trường

### Backend `.env` (tạo file `backend/.env`)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
PORT=5001
NODE_ENV=development
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176
FRONTEND_URL=http://localhost:5176
```

### Frontend `.env` (tạo file `.env` ở thư mục gốc)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🌱 Bước 4: Seed Dữ Liệu Mẫu

```bash
cd backend
npm run seed
cd ..
```

> **Lưu ý:** Lệnh này sẽ tạo:
> - 4 Users (1 Admin + 3 Customer)
> - Các sản phẩm Apple mẫu
> - 6 Mã giảm giá

---

## ▶️ Bước 5: Chạy Ứng Dụng

### Mở 2 Terminal riêng biệt:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
> Server chạy tại: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
> App chạy tại: http://localhost:5173 (hoặc port khả dụng)

---

## 🔐 Tài Khoản Test

| Vai Trò | Email | Mật Khẩu |
|---------|-------|----------|
| **Admin** | admin@applestore.vn | Admin@123 |
| **User** | user@applestore.vn | User@123 |

---

## 🔄 Cập Nhật Code Mới Nhất

Khi có thay đổi từ team, chạy các lệnh sau:

```bash
# Kéo code mới
git pull origin main

# Cập nhật dependencies nếu cần
npm install
cd backend && npm install && cd ..

# Seed lại data nếu có thay đổi schema
cd backend
node seed-manager.js --add
cd ..
```

---

## 📁 Cấu Trúc Dự Án

```
NhaBanTaoStore/
├── 📂 backend/         # API Server (Node.js + Express)
│   ├── controllers/    # Xử lý request/response
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Routes
│   ├── services/       # Business Logic
│   ├── middleware/     # Auth, Upload, etc.
│   └── seed-data/      # Dữ liệu mẫu
│
├── 📂 src/             # Frontend (React + Vite)
│   ├── components/     # React Components
│   ├── pages/          # Các trang
│   ├── features/       # Redux Slices
│   ├── services/       # API Services
│   └── hooks/          # Custom Hooks
│
├── package.json        # Frontend dependencies
└── README.md           # Tài liệu chi tiết
```

---

## 🛠️ Scripts Hữu Ích

| Lệnh | Mô Tả |
|------|-------|
| `npm run dev` | Chạy Frontend (Vite) |
| `npm run build` | Build production |
| `cd backend && npm run dev` | Chạy Backend |
| `cd backend && npm run seed` | Seed toàn bộ data |
| `cd backend && node seed-manager.js --add` | Thêm sản phẩm mới |
| `cd backend && node seed-manager.js --reset` | Reset toàn bộ sản phẩm |

---

## 📚 Tài Liệu Thêm

- [README chính](../../README.md) - Tài liệu đầy đủ về dự án
- [Backend Docs](../../backend/docs/) - API Documentation
- [Docker Guide](../../DOCKER_GUIDE.md) - Chạy với Docker
