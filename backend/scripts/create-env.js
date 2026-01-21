/**
 * Script tạo file .env tự động
 * Chạy: node scripts/create-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Tạo JWT_SECRET random
const jwtSecret = crypto.randomBytes(32).toString('base64');

// MongoDB connection string với password
const mongodbUri = 'mongodb+srv://huuphuocdev:phuocadmin@web-app.yfoocsp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=web-app';

// Nội dung file .env
const envContent = `# ============================================
# DATABASE CONFIGURATION
# ============================================
# MongoDB Connection String - ĐÃ ĐƯỢC CẤU HÌNH
# Connection string từ MongoDB Atlas với password: phuocadmin
MONGODB_URI=${mongodbUri}

# ============================================
# SERVER CONFIGURATION
# ============================================
# Port để chạy server
PORT=5000

# Environment: development, production, test
NODE_ENV=development

# ============================================
# JWT CONFIGURATION
# ============================================
# Secret key để sign JWT tokens
# ⚠️ ĐÃ TẠO RANDOM - Giữ bí mật!
JWT_SECRET=${jwtSecret}

# JWT token expiration time
JWT_EXPIRE=7d

# ============================================
# CORS CONFIGURATION
# ============================================
# Allowed origins - Thêm frontend URL của bạn
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# ============================================
# EMAIL CONFIGURATION (Optional)
# ============================================
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173

# ============================================
# PAYMENT CONFIGURATION (SePay) - Optional
# ============================================
SEPAY_BANK_ID=MB
SEPAY_ACCOUNT_NO=0935771670
SEPAY_ACCOUNT_NAME=NGUYEN HUU PHUOC
SEPAY_API_KEY=your-sepay-api-key-here

# ============================================
# FILE UPLOAD CONFIGURATION
# ============================================
MAX_FILE_SIZE=5
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,webp
UPLOAD_DIR=./uploads

# ============================================
# LOGGING CONFIGURATION
# ============================================
LOG_LEVEL=info

# ============================================
# RATE LIMITING CONFIGURATION
# ============================================
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=15

# ============================================
# CACHE CONFIGURATION
# ============================================
CACHE_TTL=3600

# ============================================
# SOCKET.IO CONFIGURATION (Optional)
# ============================================
SOCKET_CORS_ORIGIN=http://localhost:5173

# ============================================
# SECURITY CONFIGURATION
# ============================================
ENABLE_HELMET=true
TRUST_PROXY=false

# ============================================
# VIETNAM ADDRESS API CONFIGURATION
# ============================================
VIETNAM_ADDRESS_API_URL=https://provinces.open-api.vn/api/
`;

// Đường dẫn file .env
const envPath = path.join(rootDir, '.env');

// Kiểm tra file .env đã tồn tại chưa
if (fs.existsSync(envPath)) {
  console.log('⚠️  File .env đã tồn tại!');
  console.log('📝 Bạn có muốn ghi đè? (y/n)');
  console.log('   Hoặc xóa file .env cũ và chạy lại script này.');
  process.exit(1);
}

// Ghi file .env
try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Đã tạo file .env thành công!');
  console.log('');
  console.log('📋 Thông tin đã cấu hình:');
  console.log('   ✅ MONGODB_URI: Đã cấu hình với password phuocadmin');
  console.log(`   ✅ JWT_SECRET: Đã tạo random key (${jwtSecret.substring(0, 20)}...)`);
  console.log('   ✅ PORT: 5000');
  console.log('   ✅ CORS_ORIGIN: http://localhost:5173,http://localhost:3000');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Kiểm tra file .env: cat .env (hoặc mở file)');
  console.log('   2. Chạy: npm run seed (để seed data)');
  console.log('   3. Chạy: npm run dev (để start server)');
  console.log('');
} catch (error) {
  console.error('❌ Lỗi khi tạo file .env:', error.message);
  process.exit(1);
}

