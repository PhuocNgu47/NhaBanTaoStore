# 🍎 Nhà Bán Táo Store

Website thương mại điện tử bán sản phẩm Apple chính hãng tại Việt Nam.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Cấu trúc Database](#cấu-trúc-database)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)

---

## 🎯 Giới thiệu

**Nhà Bán Táo Store** là dự án e-commerce fullstack với các tính năng:

- 🛒 Xem danh sách sản phẩm, lọc theo danh mục và giá
- 🔍 Tìm kiếm sản phẩm
- 🛍️ Giỏ hàng và thanh toán
- 👤 Đăng ký, đăng nhập (JWT Authentication)
- 📦 Tra cứu đơn hàng
- 🎫 Áp dụng mã giảm giá
- ⭐ Đánh giá sản phẩm
- 🔐 Admin dashboard quản lý

---

## 🛠️ Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **React** | 18.x | Thư viện UI |
| **Vite** | 7.x | Build tool |
| **Tailwind CSS** | 4.x | CSS Framework |
| **Redux Toolkit** | 2.x | State Management |
| **React Router DOM** | 6.x | Routing |
| **Axios** | 1.x | HTTP Client |
| **React Hook Form** | 7.x | Form handling |
| **Zod** | 3.x | Schema validation |
| **Swiper** | 11.x | Carousel/Slider |
| **React Toastify** | 10.x | Notifications |
| **React Icons** | 5.x | Icon library |

### Backend

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **Node.js** | 20.x | Runtime |
| **Express** | 4.x | Web Framework |
| **MongoDB** | 7.x | Database |
| **Mongoose** | 8.x | ODM |
| **JWT** | 9.x | Authentication |
| **Bcryptjs** | 2.x | Password hashing |
| **Multer** | 1.x | File upload |
| **Cors** | 2.x | Cross-origin |
| **Dotenv** | 16.x | Environment variables |

---

## 📁 Cấu trúc thư mục

```
NhaBanTaoStore/
├── 📂 backend/                    # Backend API (Node.js + Express)
│   ├── 📂 config/                 # Cấu hình database
│   │   ├── database.js            # Kết nối MongoDB
│   │   ├── databaseErrors.js      # Xử lý lỗi database
│   │   ├── databaseEvents.js      # Events database
│   │   └── databaseOptions.js     # Options MongoDB
│   │
│   ├── 📂 controllers/            # Xử lý request/response
│   │   ├── authController.js      # Đăng nhập, đăng ký
│   │   ├── productController.js   # CRUD sản phẩm
│   │   ├── orderController.js     # Quản lý đơn hàng
│   │   ├── cartController.js      # Giỏ hàng
│   │   ├── userController.js      # Quản lý user
│   │   ├── couponController.js    # Mã giảm giá
│   │   ├── reviewController.js    # Đánh giá sản phẩm
│   │   ├── addressController.js   # Địa chỉ giao hàng
│   │   └── wishlistController.js  # Sản phẩm yêu thích
│   │
│   ├── 📂 models/                 # Mongoose Schemas
│   │   ├── User.js                # Schema người dùng
│   │   ├── Product.js             # Schema sản phẩm
│   │   ├── Order.js               # Schema đơn hàng
│   │   ├── Cart.js                # Schema giỏ hàng
│   │   ├── Coupon.js              # Schema mã giảm giá
│   │   ├── Review.js              # Schema đánh giá
│   │   ├── Address.js             # Schema địa chỉ
│   │   └── Wishlist.js            # Schema yêu thích
│   │
│   ├── 📂 routes/                 # Định nghĩa routes
│   │   ├── auth.js                # /api/auth/*
│   │   ├── products.js            # /api/products/*
│   │   ├── orders.js              # /api/orders/*
│   │   ├── cart.js                # /api/cart/*
│   │   ├── users.js               # /api/users/*
│   │   ├── coupons.js             # /api/coupons/*
│   │   └── reviews.js             # /api/reviews/*
│   │
│   ├── 📂 services/               # Business logic
│   │   ├── authService.js         # Logic xác thực
│   │   ├── productService.js      # Logic sản phẩm
│   │   ├── orderService.js        # Logic đơn hàng
│   │   └── ...
│   │
│   ├── 📂 middleware/             # Middleware
│   │   ├── auth.js                # JWT verification
│   │   ├── rateLimiter.js         # Rate limiting
│   │   └── upload.js              # File upload
│   │
│   ├── 📂 seed-data/              # Dữ liệu mẫu
│   │   ├── products.json          # 13 sản phẩm Apple
│   │   ├── users.js               # 4 users (1 admin, 3 user)
│   │   └── coupons.js             # 6 mã giảm giá
│   │
│   ├── .env                       # Biến môi trường
│   └── server.js                  # Entry point
│
├── 📂 src/                        # Frontend (React + Vite)
│   ├── 📂 components/             # React Components
│   │   ├── 📂 common/             # Components dùng chung
│   │   │   ├── Header.jsx         # Header navigation
│   │   │   ├── Footer.jsx         # Footer
│   │   │   ├── ProductCard.jsx    # Card sản phẩm
│   │   │   ├── Loading.jsx        # Loading spinner
│   │   │   └── SocialGallery.jsx  # Gallery mạng xã hội
│   │   │
│   │   └── 📂 home/               # Components trang chủ
│   │       ├── HeroBanner.jsx     # Banner chính
│   │       ├── Features.jsx       # Tính năng nổi bật
│   │       ├── CategorySection.jsx# Danh mục sản phẩm
│   │       └── ProductsByPrice.jsx# Lọc theo giá
│   │
│   ├── 📂 pages/                  # Các trang
│   │   ├── HomePage.jsx           # Trang chủ
│   │   ├── ProductDetailPage.jsx  # Chi tiết sản phẩm
│   │   ├── CategoryPage.jsx       # Danh mục
│   │   ├── CartPage.jsx           # Giỏ hàng
│   │   ├── CheckoutPage.jsx       # Thanh toán
│   │   ├── OrderSuccessPage.jsx   # Đặt hàng thành công
│   │   ├── TrackOrderPage.jsx     # Tra cứu đơn hàng
│   │   ├── 📂 auth/               # Trang xác thực
│   │   │   ├── LoginPage.jsx      # Đăng nhập
│   │   │   └── RegisterPage.jsx   # Đăng ký (3 bước)
│   │   └── 📂 admin/              # Admin dashboard
│   │       ├── DashboardPage.jsx  # Tổng quan
│   │       ├── ProductsPage.jsx   # Quản lý sản phẩm
│   │       ├── OrdersPage.jsx     # Quản lý đơn hàng
│   │       └── UsersPage.jsx      # Quản lý users
│   │
│   ├── 📂 features/               # Redux slices
│   │   ├── authSlice.js           # Auth state
│   │   ├── cartSlice.js           # Cart state
│   │   ├── productSlice.js        # Product state
│   │   └── store.js               # Redux store
│   │
│   ├── 📂 services/               # API services
│   │   ├── api.js                 # Axios instance
│   │   ├── authService.js         # Auth API calls
│   │   ├── productService.js      # Product API calls
│   │   └── orderService.js        # Order API calls
│   │
│   ├── 📂 hooks/                  # Custom hooks
│   │   ├── useAuth.js             # Auth hook
│   │   └── useCart.js             # Cart hook
│   │
│   ├── 📂 layouts/                # Layout components
│   │   ├── MainLayout.jsx         # Layout chính
│   │   ├── AdminLayout.jsx        # Layout admin
│   │   └── AuthLayout.jsx         # Layout auth
│   │
│   ├── 📂 routes/                 # Routing
│   │   ├── index.jsx              # Route definitions
│   │   └── ProtectedRoute.jsx     # Route bảo vệ
│   │
│   ├── 📂 utils/                  # Utilities
│   │   └── helpers.js             # Helper functions
│   │
│   └── 📂 constants/              # Constants
│       └── index.js               # API_URL, ROLES, etc.
│
├── .env                           # Frontend env
├── package.json                   # Frontend dependencies
└── vite.config.js                 # Vite config
```

---

## 🚀 Cài đặt và chạy

### Yêu cầu

- Node.js >= 18.x
- MongoDB >= 6.x (local hoặc Atlas)
- Git

### Bước 1: Clone repository

```bash
git clone https://github.com/PhuocNgu47/NhaBanTaoStore.git
cd NhaBanTaoStore
```

### Bước 2: Cài đặt dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### Bước 3: Cấu hình môi trường

**Backend (.env):**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
PORT=5001
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176
FRONTEND_URL=http://localhost:5176
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5001/api
```

### Bước 4: Seed dữ liệu mẫu

```bash
cd backend
npm run seed
```

### Bước 5: Chạy ứng dụng

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server chạy tại http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# App chạy tại http://localhost:5173 hoặc port khả dụng
```

### Tài khoản test

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@applestore.vn | Admin@123 |
| User | user@applestore.vn | User@123 |

---

## 📊 Cấu trúc Database

### 1. User Schema

```javascript
{
  _id: ObjectId,
  name: String,                    // Họ tên
  email: String,                   // Email (unique)
  password: String,                // Hash password
  phone: String,                   // Số điện thoại
  role: "admin" | "user",          // Vai trò
  avatar: String,                  // URL ảnh đại diện
  isActive: Boolean,               // Trạng thái hoạt động
  isEmailVerified: Boolean,        // Email đã xác thực
  preferences: {
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    language: String,
    currency: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Product Schema

```javascript
{
  _id: ObjectId,
  sku: String,                     // Mã sản phẩm (unique)
  name: String,                    // Tên sản phẩm
  slug: String,                    // URL slug (unique)
  brand: String,                   // Thương hiệu (Apple)
  description: String,             // Mô tả
  category: String,                // Danh mục: ipad, macbook, am-thanh, phu-kien
  subcategory: String,             // Danh mục con: ipad-pro, ipad-air, macbook-air
  
  price: Number,                   // Giá bán (VND)
  originalPrice: Number,           // Giá gốc
  discountPercentage: Number,      // % giảm giá
  currency: "VND",
  
  variants: [{                     // Các biến thể
    sku: String,
    name: String,                  // "128GB - Xám"
    price: Number,
    originalPrice: Number,
    stock: Number,
    attributes: {
      color: String,               // Màu sắc
      storage: String              // Dung lượng
    },
    image: String,
    isActive: Boolean
  }],
  
  image: String,                   // Ảnh chính
  images: [String],                // Gallery ảnh
  
  specifications: {                // Thông số kỹ thuật
    screen: String,
    chip: String,
    ram: String,
    storage: String,
    camera: String,
    battery: String,
    weight: String,
    connectivity: String
  },
  
  tags: [String],                  // Tags tìm kiếm
  badges: [String],                // new, hot, sale, voucher
  
  stock: Number,                   // Tổng tồn kho
  rating: Number,                  // Điểm đánh giá (1-5)
  reviewCount: Number,             // Số lượt đánh giá
  
  warranty: String,                // Bảo hành
  returnPolicy: String,            // Chính sách đổi trả
  
  status: "active" | "inactive" | "draft",
  featured: Boolean,               // Sản phẩm nổi bật
  
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Order Schema

```javascript
{
  _id: ObjectId,
  orderNumber: String,             // Mã đơn hàng (unique)
  userId: ObjectId,                // Ref -> User
  
  items: [{                        // Sản phẩm trong đơn
    productId: ObjectId,
    name: String,
    image: String,
    variant: String,
    price: Number,
    quantity: Number
  }],
  
  shippingAddress: {               // Địa chỉ giao hàng
    fullName: String,
    phone: String,
    email: String,
    province: String,
    district: String,
    ward: String,
    street: String,
    note: String
  },
  
  paymentMethod: "cod" | "bank_transfer" | "credit_card",
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  
  shippingMethod: "standard" | "express",
  shippingFee: Number,
  
  subtotal: Number,                // Tổng tiền hàng
  discount: Number,                // Giảm giá
  total: Number,                   // Tổng thanh toán
  
  couponCode: String,              // Mã giảm giá đã dùng
  
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled",
  
  notes: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Cart Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Ref -> User
  items: [{
    productId: ObjectId,           // Ref -> Product
    variantId: String,
    name: String,
    image: String,
    variant: String,
    price: Number,
    quantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Coupon Schema

```javascript
{
  _id: ObjectId,
  code: String,                    // Mã giảm giá (unique)
  description: String,
  type: "percentage" | "fixed",    // Loại giảm giá
  value: Number,                   // Giá trị (% hoặc VND)
  minOrderValue: Number,           // Đơn tối thiểu
  maxDiscount: Number,             // Giảm tối đa
  usageLimit: Number,              // Giới hạn sử dụng
  usedCount: Number,               // Đã sử dụng
  validFrom: Date,                 // Ngày bắt đầu
  validUntil: Date,                // Ngày kết thúc
  isActive: Boolean,
  applicableCategories: [String],  // Danh mục áp dụng
  createdAt: Date
}
```

### 6. Review Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Ref -> User
  productId: ObjectId,             // Ref -> Product
  orderId: ObjectId,               // Ref -> Order
  rating: Number,                  // 1-5 sao
  title: String,
  comment: String,
  images: [String],                // Ảnh đánh giá
  isVerifiedPurchase: Boolean,     // Đã mua hàng
  helpful: Number,                 // Số lượt hữu ích
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Address Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Ref -> User
  fullName: String,
  phone: String,
  province: String,
  district: String,
  ward: String,
  street: String,
  isDefault: Boolean,              // Địa chỉ mặc định
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |
| POST | `/api/auth/logout` | Đăng xuất |
| POST | `/api/auth/forgot-password` | Quên mật khẩu |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu |

### Products

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Lấy danh sách sản phẩm |
| GET | `/api/products/:id` | Lấy chi tiết theo ID |
| GET | `/api/products/slug/:slug` | Lấy chi tiết theo slug |
| GET | `/api/products/category/:category` | Lấy theo danh mục |
| GET | `/api/products/search?q=keyword` | Tìm kiếm sản phẩm |
| GET | `/api/products/featured` | Sản phẩm nổi bật |
| POST | `/api/products` | Tạo sản phẩm (Admin) |
| PUT | `/api/products/:id` | Cập nhật sản phẩm (Admin) |
| DELETE | `/api/products/:id` | Xóa sản phẩm (Admin) |

**Query Parameters cho GET /api/products:**

```
?category=ipad          // Lọc theo danh mục
?minPrice=10000000      // Giá tối thiểu
?maxPrice=20000000      // Giá tối đa
?search=ipad pro        // Tìm kiếm
?sort=newest|price      // Sắp xếp
?order=asc|desc         // Thứ tự
?page=1                 // Trang
?limit=12               // Số lượng/trang
```

### Orders

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders` | Lấy đơn hàng của user |
| GET | `/api/orders/:id` | Chi tiết đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng mới |
| PUT | `/api/orders/:id/status` | Cập nhật trạng thái (Admin) |
| GET | `/api/orders/track/:orderNumber` | Tra cứu đơn hàng |

### Cart

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/cart` | Lấy giỏ hàng |
| POST | `/api/cart` | Thêm sản phẩm vào giỏ |
| PUT | `/api/cart/:itemId` | Cập nhật số lượng |
| DELETE | `/api/cart/:itemId` | Xóa sản phẩm khỏi giỏ |
| DELETE | `/api/cart` | Xóa toàn bộ giỏ hàng |

### Coupons

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/coupons` | Danh sách mã giảm giá |
| POST | `/api/coupons/validate` | Kiểm tra mã giảm giá |
| POST | `/api/coupons` | Tạo mã mới (Admin) |

### Users (Admin)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Danh sách users |
| GET | `/api/users/:id` | Chi tiết user |
| PUT | `/api/users/:id` | Cập nhật user |
| DELETE | `/api/users/:id` | Xóa user |

---

## 🎨 Frontend Components

### Common Components

| Component | File | Mô tả |
|-----------|------|-------|
| Header | `components/common/Header.jsx` | Navigation, search, cart icon |
| Footer | `components/common/Footer.jsx` | Links, contact, social |
| ProductCard | `components/common/ProductCard.jsx` | Card hiển thị sản phẩm |
| Loading | `components/common/Loading.jsx` | Loading spinner |
| SocialGallery | `components/common/SocialGallery.jsx` | Gallery mạng xã hội |

### Home Components

| Component | File | Mô tả |
|-----------|------|-------|
| HeroBanner | `components/home/HeroBanner.jsx` | Banner slider |
| Features | `components/home/Features.jsx` | 4 trust badges |
| CategorySection | `components/home/CategorySection.jsx` | Danh mục sản phẩm |
| ProductsByPrice | `components/home/ProductsByPrice.jsx` | Lọc theo tầm giá |
| ProductCategorySection | `components/common/ProductCategorySection.jsx` | Slider sản phẩm |
| CategoryTabsSection | `components/common/CategoryTabsSection.jsx` | Tabs danh mục |

### Pages

| Page | Route | Mô tả |
|------|-------|-------|
| HomePage | `/` | Trang chủ |
| CategoryPage | `/danh-muc/:category` | Trang danh mục |
| ProductDetailPage | `/san-pham/:slug` | Chi tiết sản phẩm |
| CartPage | `/gio-hang` | Giỏ hàng |
| CheckoutPage | `/thanh-toan` | Thanh toán |
| OrderSuccessPage | `/dat-hang-thanh-cong` | Đặt hàng thành công |
| TrackOrderPage | `/tra-cuu-don-hang` | Tra cứu đơn hàng |
| LoginPage | `/dang-nhap` | Đăng nhập |
| RegisterPage | `/dang-ky` | Đăng ký (3 bước) |

### Custom Hooks

| Hook | File | Mô tả |
|------|------|-------|
| useAuth | `hooks/useAuth.js` | Quản lý authentication |
| useCart | `hooks/useCart.js` | Quản lý giỏ hàng |

### Services

| Service | File | Mô tả |
|---------|------|-------|
| api | `services/api.js` | Axios instance với interceptors |
| authService | `services/authService.js` | API calls cho auth |
| productService | `services/productService.js` | API calls cho products |
| orderService | `services/orderService.js` | API calls cho orders |

---

## 📱 Responsive Design

- **Desktop**: >= 1024px
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

---

## 🔐 Authentication Flow

1. User đăng ký với email/password
2. Backend hash password với bcrypt
3. Đăng nhập -> Backend trả về JWT token
4. Frontend lưu token vào localStorage
5. Mỗi request gửi kèm `Authorization: Bearer <token>`
6. Backend verify token với middleware
7. Token hết hạn sau 7 ngày

---

## 📦 Seed Data

### Products (13 sản phẩm)

| Danh mục | Số lượng |
|----------|----------|
| iPad | 5 (Pro M4, Pro M2, Air M2, iPad 10) |
| MacBook | 4 (Air M4, Air M2, Pro M3) |
| Âm thanh | 2 (AirPods Pro 2, AirPods 3) |
| Phụ kiện | 2 (Apple Pencil, Magic Keyboard) |

### Users (4 tài khoản)

| Email | Role | Password |
|-------|------|----------|
| admin@applestore.vn | admin | Admin@123 |
| user@applestore.vn | user | User@123 |
| customer1@gmail.com | user | Customer@123 |
| customer2@gmail.com | user | Customer@123 |

### Coupons (6 mã)

| Mã | Loại | Giá trị |
|----|------|---------|
| WELCOME10 | % | Giảm 10% |
| FREESHIP | Fixed | Miễn phí ship |
| SALE20 | % | Giảm 20% |
| VIP50K | Fixed | Giảm 50,000đ |
| SUMMER15 | % | Giảm 15% |
| NEWUSER | Fixed | Giảm 100,000đ |

---

## 📝 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**Nhà Bán Táo Store Team**

- GitHub: [@PhuocNgu47](https://github.com/PhuocNgu47)

---

## 🙏 Cảm ơn

Cảm ơn bạn đã quan tâm đến dự án này!
