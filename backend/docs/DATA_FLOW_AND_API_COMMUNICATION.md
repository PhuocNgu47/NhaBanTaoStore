# 🔄 Luồng Dữ Liệu và Giao Tiếp API - Backend

Tài liệu này mô tả chi tiết cách Backend xử lý dữ liệu và giao tiếp với Frontend.

## 📋 Mục Lục

1. [Kiến Trúc Tổng Quan](#kiến-trúc-tổng-quan)
2. [Luồng Request từ Frontend đến Backend](#luồng-request-từ-frontend-đến-backend)
3. [Luồng Xử Lý Dữ Liệu](#luồng-xử-lý-dữ-liệu)
4. [Giao Tiếp API](#giao-tiếp-api)
5. [Ví Dụ Cụ Thể](#ví-dụ-cụ-thể)

---

## 🏗️ Kiến Trúc Tổng Quan

### Layered Architecture (Kiến Trúc Phân Tầng)

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React)                    │
│  - UI Components                                │
│  - API Calls (axios)                            │
│  - State Management (Zustand)                    │
└──────────────────┬──────────────────────────────┘
                   │ HTTP Request (JSON)
                   │ Authorization: Bearer <token>
                   ▼
┌─────────────────────────────────────────────────┐
│              BACKEND (Express.js)                │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  1. ROUTES (routes/)                      │  │
│  │     - Định nghĩa URL endpoints           │  │
│  │     - Áp dụng middleware                 │  │
│  │     - Gọi Controller                      │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │  2. MIDDLEWARE (middleware/)              │  │
│  │     - auth.js: Xác thực JWT token         │  │
│  │     - rateLimiter.js: Giới hạn request    │  │
│  │     - upload.js: Xử lý file upload        │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │  3. CONTROLLERS (controllers/)            │  │
│  │     - Nhận request từ Routes               │  │
│  │     - Extract data (req.body, req.params) │  │
│  │     - Validate input                      │  │
│  │     - Gọi Service                         │  │
│  │     - Trả response cho client             │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │  4. SERVICES (services/)                  │  │
│  │     - Business Logic (logic nghiệp vụ)    │  │
│  │     - Xử lý dữ liệu                        │  │
│  │     - Gọi Model để truy vấn DB             │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │  5. MODELS (models/)                     │  │
│  │     - Mongoose Schema                     │  │
│  │     - Định nghĩa cấu trúc dữ liệu          │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
└─────────────────┼───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│          MONGODB DATABASE                        │
│  - Collections (products, users, orders, ...)    │
│  - Documents (dữ liệu thực tế)                   │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Luồng Request từ Frontend đến Backend

### 1. Frontend Gửi Request

**Ví dụ: Lấy danh sách sản phẩm**

```javascript
// Frontend: src/api/index.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const productAPI = {
  getAll: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        category: params.category,
        search: params.search,
        page: params.page || 1,
        limit: params.limit || 12
      }
    });
    return response.data;
  }
};

// Frontend: src/pages/Home.jsx
const products = await productAPI.getAll({ category: 'iPhone' });
```

**Request được gửi:**
```
GET http://localhost:5000/api/products?category=iPhone&page=1&limit=12
Headers:
  Content-Type: application/json
  (Nếu cần auth: Authorization: Bearer <jwt_token>)
```

### 2. Backend Nhận Request

**File: `server.js`**

```javascript
// 1. Express nhận request
app.use(express.json());  // Parse JSON body
app.use(cors());          // Cho phép CORS từ frontend

// 2. Route đến đúng endpoint
app.use('/api/products', productRoutes);
```

**File: `routes/products.js`**

```javascript
// 3. Route định nghĩa URL và gọi Controller
router.get('/', productController.getProducts);
// GET /api/products → gọi getProducts controller
```

### 3. Middleware Xử Lý (Nếu Cần)

**Ví dụ: Route yêu cầu đăng nhập**

```javascript
// routes/products.js
router.post('/', protect, admin, productController.createProduct);
//              ↑        ↑
//              │        └─ Kiểm tra quyền Admin
//              └─ Kiểm tra JWT token
```

**File: `middleware/auth.js`**

```javascript
export const protect = (req, res, next) => {
  // 1. Lấy token từ header
  const token = req.headers.authorization?.split(' ')[1];
  
  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // 3. Gắn user vào request
  req.user = decoded;
  
  // 4. Cho phép tiếp tục
  next();
};
```

### 4. Controller Xử Lý Request

**File: `controllers/productController.js`**

```javascript
export const getProducts = async (req, res) => {
  try {
    // 1. Extract query parameters từ URL
    const { category, search, page, limit } = req.query;
    
    // 2. Gọi Service để xử lý logic
    const result = await productService.getProducts({
      category,
      search,
      page,
      limit
    });
    
    // 3. Trả response về Frontend
    res.json({
      success: true,
      products: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    // 4. Xử lý lỗi
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### 5. Service Xử Lý Business Logic

**File: `services/productService.js`**

```javascript
export const getProducts = async (filters) => {
  // 1. Xây dựng MongoDB query
  const query = {};
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.search) {
    query.name = { $regex: filters.search, $options: 'i' };
  }
  
  // 2. Tính toán pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 12;
  const skip = (page - 1) * limit;
  
  // 3. Truy vấn Database
  const products = await Product.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  
  // 4. Đếm tổng số
  const total = await Product.countDocuments(query);
  
  // 5. Trả về kết quả
  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
```

### 6. Model Truy Vấn Database

**File: `models/Product.js`**

```javascript
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  // ... các field khác
});

export default mongoose.model('Product', productSchema);
```

**Mongoose tự động:**
- Kết nối MongoDB
- Validate dữ liệu theo schema
- Thực hiện query
- Trả về JavaScript objects

### 7. Response Trả Về Frontend

**Response JSON:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 15 Pro",
      "category": "iPhone",
      "price": 25000000,
      "image": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "pages": 5
  }
}
```

---

## 📊 Luồng Xử Lý Dữ Liệu

### A. Đọc Dữ Liệu (GET Request)

```
Frontend Request
    ↓
Routes (routes/products.js)
    ↓
Controller (controllers/productController.js)
    ↓ Extract req.query, req.params
    ↓
Service (services/productService.js)
    ↓ Build query, business logic
    ↓
Model (models/Product.js)
    ↓ Mongoose query
    ↓
MongoDB Database
    ↓ Return documents
    ↓
Model → Service → Controller → Response JSON
    ↓
Frontend nhận data
```

### B. Tạo Dữ Liệu (POST Request)

**Ví dụ: Tạo đơn hàng mới**

```
Frontend: POST /api/orders
Body: {
  items: [...],
  shippingAddress: {...},
  paymentMethod: "qr_transfer"
}
    ↓
Routes: routes/orders.js
    ↓ protect middleware (kiểm tra đăng nhập)
    ↓
Controller: controllers/orderController.js
    ↓ Extract req.body, req.user
    ↓ Validate input
    ↓
Service: services/orderService.js
    ↓ Validate stock
    ↓ Calculate total
    ↓ Create order
    ↓ Update product stock
    ↓
Model: models/Order.js
    ↓ Save to MongoDB
    ↓
MongoDB: Insert document
    ↓ Return saved order
    ↓
Service → Controller → Response
    ↓
Frontend nhận order ID
```

### C. Cập Nhật Dữ Liệu (PUT/PATCH Request)

**Ví dụ: Cập nhật thông tin sản phẩm**

```
Frontend: PUT /api/products/:id
Body: { name: "iPhone 15 Pro Max", price: 30000000 }
    ↓
Routes: routes/products.js
    ↓ protect, admin middleware
    ↓
Controller: controllers/productController.js
    ↓ Extract req.params.id, req.body
    ↓
Service: services/productService.js
    ↓ Find product by ID
    ↓ Update fields
    ↓ Validate business rules
    ↓
Model: models/Product.js
    ↓ findByIdAndUpdate()
    ↓
MongoDB: Update document
    ↓ Return updated product
    ↓
Service → Controller → Response
```

### D. Xóa Dữ Liệu (DELETE Request)

```
Frontend: DELETE /api/products/:id
    ↓
Routes: routes/products.js
    ↓ protect, admin middleware
    ↓
Controller: controllers/productController.js
    ↓ Extract req.params.id
    ↓
Service: services/productService.js
    ↓ Check if product exists
    ↓ Check if can delete (business rules)
    ↓
Model: models/Product.js
    ↓ findByIdAndDelete()
    ↓
MongoDB: Delete document
    ↓
Service → Controller → Response
```

---

## 🌐 Giao Tiếp API

### 1. API Base URL

**Development:**
```
Frontend: http://localhost:5173 (Vite)
Backend:  http://localhost:5000
API Base: http://localhost:5000/api
```

**Production:**
```
Frontend: https://yourdomain.com
Backend:  https://api.yourdomain.com
API Base: https://api.yourdomain.com/api
```

### 2. Request Format

**GET Request (Lấy dữ liệu):**
```javascript
// Frontend
GET /api/products?category=iPhone&page=1&limit=12

// Headers
Content-Type: application/json
```

**POST Request (Tạo mới):**
```javascript
// Frontend
POST /api/orders
Content-Type: application/json
Authorization: Bearer <jwt_token>

// Body
{
  "items": [
    { "productId": "123", "quantity": 2, "variantId": "456" }
  ],
  "shippingAddress": {
    "name": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC"
  },
  "paymentMethod": "qr_transfer"
}
```

**PUT Request (Cập nhật):**
```javascript
// Frontend
PUT /api/products/123
Content-Type: application/json
Authorization: Bearer <jwt_token>

// Body
{
  "name": "iPhone 15 Pro Max",
  "price": 30000000
}
```

**DELETE Request (Xóa):**
```javascript
// Frontend
DELETE /api/products/123
Authorization: Bearer <jwt_token>
```

### 3. Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Thành công"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Lỗi xảy ra",
  "error": "Chi tiết lỗi"
}
```

### 4. Authentication

**JWT Token Flow:**
```
1. User đăng nhập
   POST /api/auth/login
   Body: { email, password }
   
2. Backend verify và trả token
   Response: { token: "eyJhbGc...", user: {...} }
   
3. Frontend lưu token (localStorage)
   
4. Frontend gửi token trong mọi request
   Headers: Authorization: Bearer <token>
   
5. Backend verify token (middleware/auth.js)
   - Nếu hợp lệ → cho phép truy cập
   - Nếu không → trả 401 Unauthorized
```

### 5. Error Handling

**HTTP Status Codes:**
- `200 OK` - Thành công
- `201 Created` - Tạo mới thành công
- `400 Bad Request` - Dữ liệu không hợp lệ
- `401 Unauthorized` - Chưa đăng nhập
- `403 Forbidden` - Không có quyền
- `404 Not Found` - Không tìm thấy
- `500 Internal Server Error` - Lỗi server

**Error Response Example:**
```json
{
  "success": false,
  "message": "Sản phẩm không tồn tại",
  "statusCode": 404
}
```

---

## 💡 Ví Dụ Cụ Thể

### Ví Dụ 1: Lấy Danh Sách Sản Phẩm

**Frontend:**
```javascript
// src/pages/Home.jsx
const fetchProducts = async () => {
  const response = await productAPI.getAll({
    category: 'iPhone',
    page: 1,
    limit: 12
  });
  setProducts(response.data.products);
};
```

**Request:**
```
GET http://localhost:5000/api/products?category=iPhone&page=1&limit=12
```

**Backend Flow:**
1. `server.js` → nhận request
2. `routes/products.js` → route `/` → gọi `getProducts`
3. `controllers/productController.js` → extract `req.query`
4. `services/productService.js` → build query, truy vấn DB
5. `models/Product.js` → Mongoose query MongoDB
6. MongoDB → trả về documents
7. Response → Frontend nhận data

### Ví Dụ 2: Tạo Đơn Hàng

**Frontend:**
```javascript
// src/pages/Checkout.jsx
const createOrder = async () => {
  const response = await orderAPI.create({
    items: cartItems,
    shippingAddress: address,
    paymentMethod: 'qr_transfer'
  });
  navigate(`/orders/${response.data.order._id}`);
};
```

**Request:**
```
POST http://localhost:5000/api/orders
Headers:
  Authorization: Bearer eyJhbGc...
  Content-Type: application/json
Body:
{
  "items": [...],
  "shippingAddress": {...},
  "paymentMethod": "qr_transfer"
}
```

**Backend Flow:**
1. `server.js` → nhận request
2. `routes/orders.js` → route `/` → `protect` middleware
3. `middleware/auth.js` → verify JWT token → `req.user`
4. `controllers/orderController.js` → extract `req.body`, `req.user`
5. `services/orderService.js` → 
   - Validate stock
   - Calculate total
   - Create order
   - Update product stock
6. `models/Order.js` → save to MongoDB
7. Response → Frontend nhận order ID

### Ví Dụ 3: Cập Nhật Sản Phẩm (Admin)

**Frontend:**
```javascript
// src/pages/AdminProducts.jsx
const updateProduct = async (id, data) => {
  const response = await productAPI.update(id, {
    name: "iPhone 15 Pro Max",
    price: 30000000
  });
};
```

**Request:**
```
PUT http://localhost:5000/api/products/123
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json
Body:
{
  "name": "iPhone 15 Pro Max",
  "price": 30000000
}
```

**Backend Flow:**
1. `server.js` → nhận request
2. `routes/products.js` → route `/:id` → `protect`, `admin` middleware
3. `middleware/auth.js` → verify token + check role = 'admin'
4. `controllers/productController.js` → extract `req.params.id`, `req.body`
5. `services/productService.js` → find product, update fields
6. `models/Product.js` → `findByIdAndUpdate()`
7. MongoDB → update document
8. Response → Frontend nhận updated product

---

## 🔐 Bảo Mật

### 1. Authentication (Xác Thực)
- JWT Token trong header `Authorization: Bearer <token>`
- Token có thời hạn (expires)
- Middleware `protect` kiểm tra token

### 2. Authorization (Phân Quyền)
- Middleware `admin` kiểm tra role
- Chỉ Admin mới có thể tạo/sửa/xóa sản phẩm

### 3. Input Validation
- Validate dữ liệu ở Controller
- Mongoose Schema validation
- Sanitize input để tránh injection

### 4. CORS
- Chỉ cho phép frontend domain kết nối
- Cấu hình trong `server.js`: `app.use(cors())`

---

## 📝 Tóm Tắt

### Luồng Dữ Liệu Tổng Quan:

```
FRONTEND (React)
    ↓ HTTP Request (JSON)
    ↓ Headers: Authorization, Content-Type
BACKEND (Express)
    ↓ Routes → Middleware → Controller
    ↓ Service (Business Logic)
    ↓ Model (Mongoose)
    ↓ MongoDB Database
    ↓ Response (JSON)
    ↓
FRONTEND nhận data và render UI
```

### Các Layer Chính:

1. **Routes** - Định nghĩa URL endpoints
2. **Middleware** - Xác thực, phân quyền, rate limiting
3. **Controllers** - Nhận request, gọi service, trả response
4. **Services** - Business logic, xử lý dữ liệu
5. **Models** - Mongoose schema, truy vấn database
6. **Database** - MongoDB lưu trữ dữ liệu

### Giao Tiếp API:

- **Protocol:** HTTP/HTTPS
- **Format:** JSON
- **Authentication:** JWT Bearer Token
- **Base URL:** `http://localhost:5000/api` (dev)
- **Methods:** GET, POST, PUT, DELETE, PATCH

---

**💡 Tip:** Để hiểu rõ hơn, hãy xem code trong các file:
- `server.js` - Entry point
- `routes/products.js` - Route definition
- `controllers/productController.js` - Request handling
- `services/productService.js` - Business logic
- `models/Product.js` - Database schema

