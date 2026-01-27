# 📁 CẤU TRÚC DỰ ÁN APPLE E-COMMERCE

## 🎯 Tổng quan

Dự án **Apple E-Commerce** là một ứng dụng fullstack với:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Kiến trúc**: RESTful API, JWT Authentication, Redux State Management

---

## 📂 CẤU TRÚC THỰC TẾ CỦA DỰ ÁN

```
apple-app/
│
├── 📂 backend/                          # Backend API Server
│   ├── 📂 config/                    # Cấu hình Database
│   │   ├── database.js                  # Kết nối MongoDB
│   │   ├── databaseErrors.js            # Xử lý lỗi database
│   │   ├── databaseEvents.js            # Events database
│   │   ├── databaseOptions.js           # Options MongoDB
│   │   └── databaseUtils.js             # Utilities database
│   │++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
│   ├── 📂 controllers/                  # Xử lý Request/Response
│   │   ├── addressController.js         # Quản lý địa chỉ
│   │   ├── authController.js            # Đăng nhập, đăng ký
│   │   ├── cartController.js            # Giỏ hàng
│   │   ├── categoryController.js        # Danh mục sản phẩm
│   │   ├── couponController.js          # Mã giảm giá
│   │   ├── orderController.js           # Đơn hàng
│   │   ├── productController.js         # Sản phẩm
│   │   ├── reviewController.js          # Đánh giá
│   │   ├── statisticsController.js      # Thống kê (Admin)
│   │   ├── userController.js            # Người dùng
│   │   ├── vietnamAddressController.js  # API địa chỉ VN
│   │   └── wishlistController.js        # Danh sách yêu thích
│   │
│   ├── 📂 models/                       # Mongoose Schemas
│   │   ├── Address.js                   # Schema địa chỉ
│   │   ├── Cart.js                      # Schema giỏ hàng
│   │   ├── Category.js                  # Schema danh mục
│   │   ├── Coupon.js                    # Schema mã giảm giá
│   │   ├── Order.js                     # Schema đơn hàng
│   │   ├── Product.js                   # Schema sản phẩm
│   │   ├── Review.js                    # Schema đánh giá
│   │   ├── User.js                      # Schema người dùng
│   │   ├── VietnamAddress.js            # Schema địa chỉ VN
│   │   └── Wishlist.js                  # Schema yêu thích
│   │
│   ├── 📂 routes/                       # API Routes
│   │   ├── addresses.js                 # /api/addresses/*
│   │   ├── auth.js                      # /api/auth/*
│   │   ├── cart.js                      # /api/cart/*
│   │   ├── categories.js                # /api/categories/*
│   │   ├── coupons.js                   # /api/coupons/*
│   │   ├── orders.js                    # /api/orders/*
│   │   ├── payment.js                   # /api/payment/*
│   │   ├── products.js                  # /api/products/*
│   │   ├── reviews.js                   # /api/reviews/*
│   │   ├── statistics.js                # /api/statistics/*
│   │   ├── users.js                     # /api/users/*
│   │   ├── vietnamAddress.js            # /api/vietnam-address/*
│   │   └── wishlist.js                  # /api/wishlist/*
│   │
│   ├── 📂 services/                     # Business Logic
│   │   └── [11 files]                  # Các service xử lý logic nghiệp vụ
│   │
│   ├── 📂 middleware/                   # Middleware
│   │   ├── auth.js                      # JWT Authentication
│   │   ├── rateLimiter.js               # Rate Limiting
│   │   └── upload.js                    # File Upload (Multer)
│   │
│   ├── 📂 mappers/                      # Data Mappers
│   │   ├── index.js
│   │   ├── orderMapper.js               # Map Order data
│   │   ├── productMapper.js             # Map Product data
│   │   └── userMapper.js                # Map User data
│   │
│   ├── 📂 providers/                    # Data Providers
│   │   └── [5 files]                    # Các provider xử lý data
│   │
│   ├── 📂 routers/                      # Router Configuration
│   │   └── [3 files]                    # Cấu hình routing
│   │
│   ├── 📂 sockets/                      # WebSocket/Socket.io
│   │   └── [2 files]                    # Real-time communication
│   │
│   ├── 📂 seed-data/                    # Dữ liệu mẫu
│   │   ├── [4 JSON files]               # Dữ liệu JSON
│   │   ├── [3 JS files]                 # Script seed
│   │   └── [2 MD files]                 # Tài liệu
│   │
│   ├── 📂 seed-scripts/                 # Scripts seed dữ liệu
│   │   └── [8 JS files]                 # Các script seed
│   │
│   ├── 📂 scripts/                      # Utility Scripts
│   │   ├── [3 JS files]
│   │   ├── [1 PS1 file]                 # PowerShell script
│   │   └── [1 SH file]                  # Shell script
│   │
│   ├── 📂 docs/                         # Tài liệu Backend
│   │   ├── [15 MD files]                # Tài liệu markdown
│   │   └── [1 JS file]
│   │
│   ├── 📂 docstxt/                      # Tài liệu text
│   │   └── [15 MD files]
│   │
│   ├── 📂 examples/                      # Ví dụ code
│   │   ├── develop-relationship-example.js
│   │   └── relationship-examples.js
│   │
│   ├── 📂 images/                       # Hình ảnh
│   │   └── categories/                  # Ảnh danh mục
│   │
│   ├── 📂 uploads/                      # File uploads
│   │
│   ├── server.js                        # ⭐ Entry point - Server chính
│   ├── package.json                     # Dependencies Backend
│   ├── env.example                      # Template biến môi trường
│   ├── Dockerfile                       # Docker config
│   ├── seed.js                          # Script seed chính
│   ├── seed.apple.js                    # Script seed Apple products
│   ├── test-connection.js               # Test kết nối DB
│   └── README.md                        # Tài liệu Backend
│
├── 📂 src/                              # Frontend React App
│   ├── 📂 components/                   # React Components
│   │   ├── 📂 common/                   # Components dùng chung
│   │   │   ├── Header.jsx               # Header navigation
│   │   │   ├── Footer.jsx               # Footer
│   │   │   ├── ProductCard.jsx          # Card sản phẩm
│   │   │   ├── Loading.jsx              # Loading spinner
│   │   │   ├── SocialGallery.jsx        # Gallery mạng xã hội
│   │   │   ├── CategorySidebar.jsx      # Sidebar danh mục
│   │   │   ├── CategoryTabsSection.jsx   # Tabs danh mục
│   │   │   ├── ProductCategorySection.jsx# Section sản phẩm theo danh mục
│   │   │   └── index.js                 # Export components
│   │   │
│   │   ├── 📂 home/                     # Components trang chủ
│   │   │   ├── HeroBanner.jsx           # Banner chính
│   │   │   ├── Features.jsx             # Tính năng nổi bật
│   │   │   ├── CategorySection.jsx      # Danh mục sản phẩm
│   │   │   ├── ProductsByPrice.jsx      # Lọc theo giá
│   │   │   └── index.js                 # Export components
│   │   │
│   │   ├── ErrorBoundary.jsx            # Error boundary
│   │   └── Modal.jsx                    # Modal component
│   │
│   ├── 📂 pages/                        # Các trang (Pages)
│   │   ├── 📂 admin/                    # Trang Admin Dashboard
│   │   │   ├── DashboardPage.jsx        # Tổng quan + biểu đồ
│   │   │   ├── ProductsPage.jsx         # Quản lý sản phẩm
│   │   │   ├── CategoriesPage.jsx       # Quản lý danh mục
│   │   │   ├── OrdersPage.jsx           # Quản lý đơn hàng
│   │   │   ├── OrderDetailPage.jsx      # Chi tiết đơn hàng
│   │   │   ├── UsersPage.jsx            # Quản lý users
│   │   │   ├── CouponsPage.jsx          # Quản lý mã giảm giá
│   │   │   ├── InventoryPage.jsx        # Quản lý tồn kho
│   │   │   ├── CustomersPage.jsx        # Khách hàng VIP
│   │   │   └── SettingsPage.jsx         # Cài đặt
│   │   │
│   │   ├── 📂 auth/                     # Trang xác thực
│   │   │   ├── LoginPage.jsx             # Đăng nhập
│   │   │   ├── RegisterPage.jsx         # Đăng ký
│   │   │   └── ForgotPasswordPage.jsx   # Quên mật khẩu
│   │   │
│   │   ├── 📂 user/                     # Trang người dùng
│   │   │   ├── AccountPage.jsx          # Tài khoản
│   │   │   ├── OrdersPage.jsx           # Đơn hàng của tôi
│   │   │   └── OrderDetailPage.jsx      # Chi tiết đơn hàng
│   │   │
│   │   ├── HomePage.jsx                 # Trang chủ
│   │   ├── ProductsPage.jsx             # Danh sách sản phẩm
│   │   ├── ProductDetailPage.jsx        # Chi tiết sản phẩm
│   │   ├── CategoryPage.jsx             # Trang danh mục
│   │   ├── CartPage.jsx                 # Giỏ hàng
│   │   ├── CheckoutPage.jsx             # Thanh toán
│   │   ├── OrderSuccessPage.jsx        # Đặt hàng thành công
│   │   ├── TrackOrderPage.jsx           # Tra cứu đơn hàng
│   │   ├── SearchPage.jsx               # Tìm kiếm
│   │   ├── ContactPage.jsx              # Liên hệ
│   │   └── NotFoundPage.jsx             # 404 Not Found
│   │
│   ├── 📂 layouts/                      # Layout Components
│   │   ├── MainLayout.jsx               # Layout chính (Header + Footer)
│   │   ├── AdminLayout.jsx              # Layout admin (Sidebar)
│   │   ├── AuthLayout.jsx               # Layout auth
│   │   └── index.js                    # Export layouts
│   │
│   ├── 📂 routes/                       # Routing Configuration
│   │   ├── index.jsx                    # Route definitions
│   │   └── ProtectedRoute.jsx           # Route bảo vệ (Auth required)
│   │
│   ├── 📂 features/                     # Redux Slices
│   │   ├── store.js                     # Redux store configuration
│   │   ├── authSlice.js                 # Auth state management
│   │   ├── cartSlice.js                 # Cart state management
│   │   └── productSlice.js              # Product state management
│   │
│   ├── 📂 services/                     # API Services
│   │   ├── api.js                       # Axios instance + interceptors
│   │   ├── authService.js               # Auth API calls
│   │   ├── productService.js            # Product API calls
│   │   ├── orderService.js              # Order API calls
│   │   ├── userService.js               # User API calls
│   │   ├── categoryService.js           # Category API calls
│   │   ├── couponService.js             # Coupon API calls
│   │   └── statisticsService.js         # Statistics API calls
│   │
│   ├── 📂 hooks/                        # Custom Hooks
│   │   ├── useAuth.js                   # Auth hook
│   │   ├── useCart.js                   # Cart hook
│   │   └── index.js                     # Export hooks
│   │
│   ├── 📂 utils/                        # Utilities
│   │   └── helpers.js                   # Helper functions
│   │
│   ├── 📂 constants/                    # Constants
│   │   └── index.js                     # API_URL, ROLES, etc.
│   │
│   ├── 📂 assets/                       # Static Assets
│   │   ├── react.svg
│   │   └── imang_login.png
│   │
│   ├── App.jsx                          # ⭐ Root Component
│   ├── App.css                          # App styles
│   ├── main.jsx                         # ⭐ Entry point Frontend
│   └── index.css                        # Global styles
│
├── 📂 public/                           # Public Static Files
│   └── vite.svg
│
├── 📂 dist/                             # Build Output (Production)
│   ├── assets/
│   ├── index.html
│   └── vite.svg
│
├── package.json                         # Frontend Dependencies
├── vite.config.js                      # Vite Configuration
├── eslint.config.js                    # ESLint Configuration
├── index.html                           # HTML Template
├── Dockerfile                           # Docker config (Frontend)
├── docker-compose.yml                   # Docker Compose
├── nginx.conf                           # Nginx Configuration
├── README.md                            # Tài liệu chính
├── DOCKER_GUIDE.md                      # Hướng dẫn Docker
└── tailieu.txt                          # Tài liệu khác
```

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### **Backend Architecture (MVC Pattern)**

```
Request → Routes → Controllers → Services → Models → Database
                ↓
            Middleware (Auth, Rate Limit, Upload)
                ↓
            Response → Client
```

**Luồng xử lý:**
1. **Routes** (`/routes/*.js`) - Định nghĩa endpoints
2. **Middleware** (`/middleware/*.js`) - Xác thực, rate limit, upload
3. **Controllers** (`/controllers/*.js`) - Xử lý request/response
4. **Services** (`/services/*.js`) - Business logic
5. **Models** (`/models/*.js`) - Database schemas (Mongoose)
6. **Database** - MongoDB

### **Frontend Architecture (Component-Based)**

```
App.jsx → Routes → Pages → Components
              ↓
         Redux Store (State Management)
              ↓
         Services (API Calls)
              ↓
         Backend API
```

**Luồng dữ liệu:**
1. **Routes** (`/routes/index.jsx`) - Định nghĩa routes
2. **Pages** (`/pages/*.jsx`) - Các trang chính
3. **Components** (`/components/*.jsx`) - UI components
4. **Redux** (`/features/*.js`) - State management
5. **Services** (`/services/*.js`) - API calls (Axios)
6. **Hooks** (`/hooks/*.js`) - Custom hooks

---

## 📊 CÁC MODULE CHÍNH

### **1. Authentication Module**
- **Backend**: `routes/auth.js`, `controllers/authController.js`
- **Frontend**: `pages/auth/*.jsx`, `features/authSlice.js`
- **Chức năng**: Đăng ký, đăng nhập, JWT token, quên mật khẩu

### **2. Product Module**
- **Backend**: `routes/products.js`, `controllers/productController.js`
- **Frontend**: `pages/ProductsPage.jsx`, `pages/ProductDetailPage.jsx`
- **Chức năng**: CRUD sản phẩm, variants, tìm kiếm, lọc

### **3. Order Module**
- **Backend**: `routes/orders.js`, `controllers/orderController.js`
- **Frontend**: `pages/CartPage.jsx`, `pages/CheckoutPage.jsx`
- **Chức năng**: Giỏ hàng, thanh toán, quản lý đơn hàng

### **4. Category Module**
- **Backend**: `routes/categories.js`, `controllers/categoryController.js`
- **Frontend**: `pages/CategoryPage.jsx`, `pages/admin/CategoriesPage.jsx`
- **Chức năng**: Quản lý danh mục 3 cấp

### **5. User Module**
- **Backend**: `routes/users.js`, `controllers/userController.js`
- **Frontend**: `pages/user/AccountPage.jsx`, `pages/admin/UsersPage.jsx`
- **Chức năng**: Quản lý tài khoản, phân quyền

### **6. Coupon Module**
- **Backend**: `routes/coupons.js`, `controllers/couponController.js`
- **Frontend**: `pages/admin/CouponsPage.jsx`
- **Chức năng**: Mã giảm giá, áp dụng coupon

### **7. Review Module**
- **Backend**: `routes/reviews.js`, `controllers/reviewController.js`
- **Frontend**: Tích hợp trong `ProductDetailPage.jsx`
- **Chức năng**: Đánh giá sản phẩm, rating

### **8. Wishlist Module**
- **Backend**: `routes/wishlist.js`, `controllers/wishlistController.js`
- **Frontend**: Tích hợp trong components
- **Chức năng**: Danh sách yêu thích

### **9. Statistics Module (Admin)**
- **Backend**: `routes/statistics.js`, `controllers/statisticsController.js`
- **Frontend**: `pages/admin/DashboardPage.jsx`
- **Chức năng**: Thống kê doanh thu, đơn hàng, biểu đồ

---

## 🔌 API ENDPOINTS CHÍNH

### **Authentication**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user

### **Products**
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật (Admin)
- `DELETE /api/products/:id` - Xóa (Admin)

### **Orders**
- `GET /api/orders` - Đơn hàng của user
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái (Admin)

### **Cart**
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm vào giỏ
- `PUT /api/cart/:itemId` - Cập nhật số lượng
- `DELETE /api/cart/:itemId` - Xóa khỏi giỏ

### **Coupons**
- `GET /api/coupons` - Danh sách mã giảm giá
- `POST /api/coupons/validate` - Kiểm tra mã

### **Statistics (Admin)**
- `GET /api/statistics/dashboard` - Thống kê tổng quan
- `GET /api/statistics/revenue` - Doanh thu
- `GET /api/statistics/orders` - Thống kê đơn hàng

---

## 🗄️ DATABASE SCHEMAS

### **Collections chính:**
1. **users** - Người dùng (admin, user)
2. **products** - Sản phẩm với variants
3. **orders** - Đơn hàng
4. **carts** - Giỏ hàng
5. **categories** - Danh mục 3 cấp
6. **coupons** - Mã giảm giá
7. **reviews** - Đánh giá sản phẩm
8. **addresses** - Địa chỉ giao hàng
9. **wishlists** - Danh sách yêu thích
10. **vietnamaddresses** - Địa chỉ Việt Nam

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### **Frontend**
- React 19.x
- Vite 7.x
- Tailwind CSS 4.x
- Redux Toolkit 2.x
- React Router DOM 7.x
- Axios 1.x
- React Hook Form 7.x
- Zod 4.x

### **Backend**
- Node.js 20.x
- Express 4.x
- MongoDB 7.x
- Mongoose 8.x
- JWT 9.x
- Bcryptjs 2.x
- Multer 1.x
- Swagger (API docs)

---

## 📝 GHI CHÚ

- **Entry Points**:
  - Backend: `backend/server.js`
  - Frontend: `src/main.jsx`

- **Environment Variables**:
  - Backend: `backend/.env` (từ `env.example`)
  - Frontend: `.env` (VITE_API_URL)

- **Build Output**:
  - Frontend: `dist/` (sau khi chạy `npm run build`)

- **Docker**:
  - `Dockerfile` (root) - Frontend
  - `backend/Dockerfile` - Backend
  - `docker-compose.yml` - Multi-container

---

**📅 Cập nhật:** $(date)
**👨‍💻 Tác giả:** Apple E-Commerce Team
