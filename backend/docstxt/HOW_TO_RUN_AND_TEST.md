# 🚀 Hướng Dẫn Chạy Backend & Test API

## 📋 Mục Lục
1. [Cách 1: Chạy với Docker (Khuyên dùng)](#cách-1-chạy-với-docker)
2. [Cách 2: Chạy thủ công](#cách-2-chạy-thủ-công)
3. [Test API](#test-api)
4. [View Data trong MongoDB](#view-data-trong-mongodb)
5. [API Endpoints để Test](#api-endpoints-để-test)

---

## 🐳 Cách 1: Chạy với Docker

### Bước 1: Kiểm tra Docker đã cài đặt
```bash
docker --version
docker-compose --version
```

### Bước 2: Chạy Backend và MongoDB
```bash
cd ecommerce-project
docker-compose up --build -d
```

**Lệnh này sẽ:**
- ✅ Khởi động MongoDB (port 27017)
- ✅ Khởi động Backend API (port 5000)
- ✅ Khởi động Mongo Express (port 8081) - Web UI để xem database
- ✅ Khởi động Frontend (port 3000) - Tùy chọn

### Bước 3: Kiểm tra containers đang chạy
```bash
docker ps
```

Bạn sẽ thấy:
- `ecommerce-db` - MongoDB
- `ecommerce-api` - Backend API
- `ecommerce-mongo-express` - Mongo Express
- `ecommerce-web` - Frontend (nếu có)

### Bước 4: Seed dữ liệu mẫu
```bash
# Chờ vài giây để containers khởi động xong
docker exec ecommerce-api node seed.js
```

### Bước 5: Kiểm tra Backend đã chạy
Mở browser: http://localhost:5000/api/products

Nếu thấy JSON response, Backend đã chạy thành công! ✅

---

## 💻 Cách 2: Chạy Thủ Công

### Bước 1: Cài đặt MongoDB

#### Option A: MongoDB Local
- **Windows:** Tải từ https://www.mongodb.com/try/download/community
- **Mac:** `brew install mongodb-community`
- **Linux:** `sudo apt-get install mongodb`

#### Option B: MongoDB Atlas (Cloud - Khuyên dùng)
1. Đăng ký tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Lấy connection string

### Bước 2: Tạo file .env

Tạo file `backend/.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce
# Hoặc MongoDB Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT Configuration
JWT_SECRET=tmdt_secret_key_123456
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# SePay Payment (Optional)
SEPAY_BANK_ID=MB
SEPAY_ACCOUNT_NO=0935771670
SEPAY_ACCOUNT_NAME=NGUYEN HUU PHUOC
SEPAY_API_KEY=your-sepay-api-key-here
```

### Bước 3: Cài đặt dependencies
```bash
cd backend
npm install
```

### Bước 4: Chạy Backend
```bash
# Development mode (tự động restart khi code thay đổi)
npm run dev

# Hoặc production mode
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

### Bước 5: Seed dữ liệu mẫu
```bash
# Terminal mới
cd backend
npm run seed
```

---

## 🧪 Test API

### 1. Test bằng Browser (GET requests)

Mở browser và truy cập:

- **Health Check:** http://localhost:5000/api/products
- **Get Products:** http://localhost:5000/api/products
- **Get Product by ID:** http://localhost:5000/api/products/[PRODUCT_ID]

### 2. Test bằng cURL (Command Line)

#### Test GET Products:
```bash
curl http://localhost:5000/api/products
```

#### Test Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

#### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

#### Test với Token (sau khi login):
```bash
# Lấy token từ response login, sau đó:
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test bằng Postman (Khuyên dùng)

#### Setup Postman:
1. Tải Postman: https://www.postman.com/downloads/
2. Tạo Collection mới: "E-commerce API"

#### Import các requests:

**1. Register User**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**2. Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**3. Get Products (Public)**
```
GET http://localhost:5000/api/products
```

**4. Get Products với Filter**
```
GET http://localhost:5000/api/products?category=iPhone&minPrice=10000000&maxPrice=50000000&page=1&limit=12
```

**5. Get Orders (Cần Auth)**
```
GET http://localhost:5000/api/orders
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**6. Create Order**
```
POST http://localhost:5000/api/orders
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "items": [
    {
      "productId": "PRODUCT_ID_HERE",
      "quantity": 1,
      "price": 20000000
    }
  ],
  "shippingAddress": {
    "name": "Nguyen Van A",
    "phone": "0912345678",
    "address": "123 Đường ABC",
    "ward": "Phường 1",
    "district": "Quận 1",
    "city": "Hồ Chí Minh"
  },
  "paymentMethod": "cash_on_delivery"
}
```

### 4. Test bằng VS Code REST Client Extension

Tạo file `backend/test.http`:

```http
### Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

### Get Products
GET http://localhost:5000/api/products

### Get Products with Filter
GET http://localhost:5000/api/products?category=iPhone&minPrice=10000000&maxPrice=50000000

### Get Orders (Need Token)
GET http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📊 View Data trong MongoDB

### Cách 1: Mongo Express (Web UI) - Khuyên dùng

Nếu chạy với Docker, Mongo Express đã được cài đặt sẵn:

1. **Truy cập:** http://localhost:8081
2. **Login:**
   - Username: `admin`
   - Password: `admin`
3. **Xem database:**
   - Click vào `ecommerce` database
   - Xem các collections: `users`, `products`, `orders`, `coupons`, `addresses`

### Cách 2: MongoDB Compass (Desktop App)

1. **Tải MongoDB Compass:** https://www.mongodb.com/products/compass
2. **Kết nối:**
   - Connection String: `mongodb://localhost:27017`
   - Hoặc MongoDB Atlas connection string
3. **Xem data:**
   - Chọn database `ecommerce`
   - Browse collections

### Cách 3: MongoDB Shell (mongo/mongosh)

```bash
# Kết nối MongoDB
mongosh mongodb://localhost:27017/ecommerce

# Hoặc nếu dùng MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/ecommerce"

# Xem databases
show dbs

# Chọn database
use ecommerce

# Xem collections
show collections

# Xem documents trong collection
db.users.find().pretty()
db.products.find().pretty()
db.orders.find().pretty()

# Đếm số documents
db.users.countDocuments()
db.products.countDocuments()
db.orders.countDocuments()

# Tìm kiếm
db.products.find({ category: "iPhone" })
db.users.find({ role: "admin" })
```

### Cách 4: Docker Exec vào MongoDB Container

```bash
# Vào MongoDB shell trong container
docker exec -it ecommerce-db mongosh ecommerce

# Hoặc dùng mongo shell cũ
docker exec -it ecommerce-db mongo ecommerce
```

---

## 🔌 API Endpoints để Test

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify` - Verify token

### Products (Public)
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/products/:id/reviews` - Reviews của sản phẩm

### Products (Admin only - cần token)
- `POST /api/products` - Tạo sản phẩm
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `POST /api/products/:id/reviews` - Thêm review

### Orders (Cần token)
- `GET /api/orders` - Danh sách đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng

### Coupons
- `POST /api/coupons/validate` - Validate coupon (Public)
- `GET /api/coupons` - Danh sách coupons (Admin)
- `POST /api/coupons` - Tạo coupon (Admin)

### Users (Cần token)
- `GET /api/users/profile` - Profile của user hiện tại
- `PUT /api/users/profile` - Cập nhật profile

### Addresses (Cần token)
- `GET /api/addresses` - Danh sách địa chỉ
- `POST /api/addresses` - Tạo địa chỉ
- `PUT /api/addresses/:id` - Cập nhật địa chỉ

### Statistics (Admin only)
- `GET /api/statistics/overview` - Tổng quan
- `GET /api/statistics/revenue` - Doanh thu
- `GET /api/statistics/orders` - Thống kê đơn hàng

---

## ✅ Checklist Test

- [ ] Backend chạy thành công (port 5000)
- [ ] MongoDB kết nối được
- [ ] Seed data thành công
- [ ] Test register user
- [ ] Test login và lấy token
- [ ] Test get products (public)
- [ ] Test get orders (với token)
- [ ] Test create order (với token)
- [ ] Xem data trong Mongo Express hoặc MongoDB Compass

---

## 🐛 Troubleshooting

### Lỗi: Port 5000 already in use
```bash
# Windows: Tìm và kill process
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux: Tìm và kill process
lsof -i :5000
kill -9 [PID_NUMBER]
```

### Lỗi: MongoDB connection failed
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra `MONGODB_URI` trong `.env`
- Kiểm tra firewall/network

### Lỗi: Cannot find module
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: JWT_SECRET is required
- Đảm bảo file `.env` đã được tạo
- Kiểm tra `JWT_SECRET` có trong `.env`

---

## 📝 Tài Khoản Test

Sau khi seed data:

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | admin@example.com | admin123 |
| 👤 User | user@example.com | password123 |

---

**Chúc bạn test thành công! 🚀**

