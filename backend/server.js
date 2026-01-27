/**
 * Server chính của ứng dụng E-commerce
 * 
 * File này khởi tạo:
 * - Express server (API server)
 * - Kết nối MongoDB (database)
 * - Cấu hình routes (API endpoints)
 * - Xử lý lỗi
 */


import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Import cấu hình database (file riêng để dễ quản lý)
import { connectDB, getConnectionStatus } from './config/database.js';

// Import các routes (API endpoints)
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payment.js';
import statisticsRoutes from './routes/statistics.js';
import addressRoutes from './routes/addresses.js';
import couponRoutes from './routes/coupons.js';


// ============================================
// KHỞI TẠO EXPRESS APP
// ============================================

// Tạo Express application
const app = express();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Apple E-commerce API',
      version: '1.0.0',
      description: 'API documentation for Apple E-commerce backend',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local',
      },
      {
        url: 'https://YOUR-BACKEND.onrender.com/api',
        description: 'Production',
      },
    ],

  },
  // apis: ['./routes/*.js', './models/*.js'],
  apis: ['./routes/**/*.js', './models/**/*.js'],

};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================
// MIDDLEWARE (XỬ LÝ TRƯỚC KHI ĐẾN ROUTES)
// ============================================

// CORS: Cho phép frontend (React) kết nối từ domain khác
// Ví dụ: Frontend chạy ở localhost:3000, Backend ở localhost:5000
app.use(cors());

// Parse JSON: Chuyển đổi JSON trong request body thành JavaScript object
// Ví dụ: { "name": "iPhone" } → req.body.name = "iPhone"
app.use(express.json());

// Parse URL-encoded: Chuyển đổi form data thành JavaScript object
// Ví dụ: name=iPhone&price=999 → req.body.name = "iPhone"
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads folder)
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// KẾT NỐI DATABASE
// ============================================

// Kết nối đến MongoDB (Atlas hoặc local)
// Hàm connectDB() được định nghĩa trong file config/database.js
connectDB();

// ============================================
// ROUTES (API ENDPOINTS)
// ============================================

/**
 * Health Check - Kiểm tra server và database có hoạt động không
 * 
 * GET /api/health
 * 
 * Dùng để:
 * - Monitoring tools kiểm tra server
 * - Docker health check
 * - Load balancer kiểm tra
 */
app.get('/api/health', (req, res) => {
  // Lấy trạng thái kết nối database
  const dbStatus = getConnectionStatus();

  // Trả về thông tin trạng thái
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    version: '1.0.0'
  });
});

/**
 * API Info - Thông tin về API
 * 
 * GET /api
 * 
 * Trả về danh sách các endpoints có sẵn
 */
app.get('/api', (req, res) => {
  res.json({
    message: 'E-commerce API - Apple Store',
    version: '1.0.0',
    description: 'API cho website thương mại điện tử bán sản phẩm Apple',
    endpoints: [
      '/api/auth - Đăng nhập, đăng ký',
      '/api/products - Quản lý sản phẩm',
      '/api/orders - Quản lý đơn hàng',
      '/api/users - Quản lý người dùng',
      '/api/payment - Thanh toán',
      '/api/statistics - Thống kê (Admin)',
      '/api/addresses - Quản lý địa chỉ',
      '/api/coupons - Mã giảm giá',
      '/api/cart - Giỏ hàng',
      '/api/wishlist - Danh sách yêu thích',
      '/api/reviews - Đánh giá sản phẩm',
      '/api/vietnam-address - API địa chỉ Việt Nam',
      '/api/banners - Quản lý banner slider',
      '/api/track - Customer behavior tracking',
      '/api/admin/leads - Quản lý leads (Admin)',
      '/api/health - Kiểm tra trạng thái'
    ]
  });
});

// ============================================
// ĐĂNG KÝ CÁC ROUTES (API ENDPOINTS)
// ============================================

// Tất cả routes bắt đầu với /api/...

// Authentication: Đăng nhập, đăng ký, lấy thông tin user
app.use('/api/auth', authRoutes);

// Products: Xem, tạo, sửa, xóa sản phẩm
app.use('/api/products', productRoutes);

// Orders: Tạo đơn hàng, xem lịch sử đơn hàng
app.use('/api/orders', orderRoutes);

// Users: Quản lý thông tin người dùng
app.use('/api/users', userRoutes);

// Payment: Xử lý thanh toán (COD, QR chuyển khoản)
app.use('/api/payment', paymentRoutes);

// Statistics: Thống kê (chỉ Admin)
app.use('/api/statistics', statisticsRoutes);

// Addresses: Quản lý địa chỉ giao hàng
app.use('/api/addresses', addressRoutes);

// Coupons: Quản lý mã giảm giá
app.use('/api/coupons', couponRoutes);

// Vietnam Address: API địa chỉ Việt Nam
import vietnamAddressRoutes from './routes/vietnamAddress.js';
app.use('/api/vietnam-address', vietnamAddressRoutes);

// Cart: Quản lý giỏ hàng
import cartRoutes from './routes/cart.js';
app.use('/api/cart', cartRoutes);

// Wishlist: Danh sách yêu thích
import wishlistRoutes from './routes/wishlist.js';
app.use('/api/wishlist', wishlistRoutes);

// Reviews: Đánh giá sản phẩm
import reviewRoutes from './routes/reviews.js';
app.use('/api/reviews', reviewRoutes);

// Categories: Quản lý danh mục 3 cấp
import categoryRoutes from './routes/categories.js';
app.use('/api/categories', categoryRoutes);

// Banners: Quản lý banner slider
import bannerRoutes from './routes/banners.js';
app.use('/api/banners', bannerRoutes);

// Tracking: Customer behavior tracking (public)
import trackingRoutes from './routes/tracking.js';
app.use('/api/track', trackingRoutes);

// Leads: Admin leads management
import leadsRoutes from './routes/leads.js';
app.use('/api/admin/leads', leadsRoutes);

// Activity Logs: Admin activity tracking
import activityLogRoutes from './routes/activityLogs.js';
app.use('/api/activity-logs', activityLogRoutes);

// AI Insights: AI-Driven Customer Insights (Predictive Lead Scoring)
import aiInsightRoutes from './routes/aiInsights.js';
app.use('/api/admin/ai-insights', aiInsightRoutes);

// Chat: Customer chat with AI and Admin
import chatRoutes from './routes/chat.js';
app.use('/api/chat', chatRoutes);

// Settings: Cài đặt hệ thống
import settingsRoutes from './routes/settings.js';
app.use('/api/settings', settingsRoutes);

// ============================================
// XỬ LÝ LỖI (ERROR HANDLING)
// ============================================

/**
 * Middleware xử lý lỗi toàn cục
 * 
 * Bắt tất cả các lỗi không được xử lý trong routes
 * Trả về response lỗi cho client
 */
app.use((err, req, res, next) => {
  // Log lỗi ra console để debug (chỉ trong development)
  console.error('❌ Server Error:', {
    message: err.message,
    path: req.path,
    method: req.method,
    // Chỉ hiển thị stack trace trong development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Lấy mã lỗi (mặc định: 500 - Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Lấy thông báo lỗi (mặc định: Lỗi máy chủ)
  const message = err.message || 'Lỗi máy chủ nội bộ';

  // Trả về lỗi cho client
  res.status(statusCode).json({
    success: false,
    message: message,
    // Chỉ trả về stack trace trong development (để debug)
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * Xử lý route không tồn tại (404)
 * 
 * Nếu client gọi API không tồn tại, trả về lỗi 404
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} không tồn tại`,
    availableEndpoints: [
      '/api',
      '/api/health',
      '/api/auth',
      '/api/products',
      '/api/orders',
      '/api/users',
      '/api/payment',
      '/api/statistics',
      '/api/addresses',
      '/api/coupons',
      '/api/cart',
      '/api/wishlist',
      '/api/reviews',
      '/api/banners'
    ]
  });
});

// ============================================
// KHỞI ĐỘNG SERVER
// ============================================

// Lấy port từ biến môi trường hoặc dùng mặc định 5000
// PORT có thể được set trong file .env hoặc khi deploy (Heroku, Railway, ...)
const PORT = process.env.PORT || 5000;

// Khởi động server và lắng nghe trên port
const server = app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('🚀 SERVER ĐÃ KHỞI ĐỘNG');
  console.log('═══════════════════════════════════════');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
  console.log(`📋 Info: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════════');
  console.log('');
});

// Xử lý lỗi khi khởi động server
// Ví dụ: Port đã được sử dụng bởi ứng dụng khác
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Lỗi: Port ${PORT} đã được sử dụng`);
    console.error('💡 Giải pháp:');
    console.error(`   - Đổi port khác trong file .env: PORT=5001`);
    console.error(`   - Hoặc tắt ứng dụng đang dùng port ${PORT}`);
  } else {
    console.error('❌ Lỗi khi khởi động server:', err.message);
  }
  process.exit(1);
});
