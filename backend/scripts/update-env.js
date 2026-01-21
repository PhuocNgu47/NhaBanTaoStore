/**
 * Script cập nhật file .env với MongoDB connection string
 * Chạy: node scripts/update-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const envPath = path.join(rootDir, '.env');

// MongoDB connection string với password phuocadmin
const mongodbUri = 'mongodb+srv://huuphuocdev:phuocadmin@web-app.yfoocsp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=web-app';

// Tạo JWT_SECRET random nếu chưa có
let jwtSecret = '';
if (fs.existsSync(envPath)) {
  const currentEnv = fs.readFileSync(envPath, 'utf8');
  const jwtMatch = currentEnv.match(/JWT_SECRET=(.+)/);
  if (jwtMatch && jwtMatch[1] && !jwtMatch[1].includes('your-super-secret')) {
    jwtSecret = jwtMatch[1].trim();
    console.log('✅ Giữ nguyên JWT_SECRET hiện tại');
  }
}

if (!jwtSecret) {
  jwtSecret = crypto.randomBytes(32).toString('base64');
  console.log('✅ Đã tạo JWT_SECRET mới');
}

// Đọc file .env hiện tại (nếu có)
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  
  // Cập nhật MONGODB_URI
  if (envContent.includes('MONGODB_URI=')) {
    envContent = envContent.replace(
      /MONGODB_URI=.*/,
      `MONGODB_URI=${mongodbUri}`
    );
    console.log('✅ Đã cập nhật MONGODB_URI');
  } else {
    envContent = `MONGODB_URI=${mongodbUri}\n${envContent}`;
    console.log('✅ Đã thêm MONGODB_URI');
  }
  
  // Cập nhật JWT_SECRET
  if (envContent.includes('JWT_SECRET=')) {
    envContent = envContent.replace(
      /JWT_SECRET=.*/,
      `JWT_SECRET=${jwtSecret}`
    );
    console.log('✅ Đã cập nhật JWT_SECRET');
  } else {
    envContent = `JWT_SECRET=${jwtSecret}\n${envContent}`;
    console.log('✅ Đã thêm JWT_SECRET');
  }
  
  // Đảm bảo có CORS_ORIGIN
  if (!envContent.includes('CORS_ORIGIN=')) {
    envContent += '\nCORS_ORIGIN=http://localhost:5173,http://localhost:3000';
    console.log('✅ Đã thêm CORS_ORIGIN');
  }
} else {
  // Tạo file mới nếu chưa có
  envContent = `# ============================================
# DATABASE CONFIGURATION
# ============================================
MONGODB_URI=${mongodbUri}

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# JWT CONFIGURATION
# ============================================
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=7d

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# ============================================
# FILE UPLOAD
# ============================================
MAX_FILE_SIZE=5
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,webp
UPLOAD_DIR=./uploads

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=info

# ============================================
# SECURITY
# ============================================
ENABLE_HELMET=true
TRUST_PROXY=false

# ============================================
# VIETNAM ADDRESS API
# ============================================
VIETNAM_ADDRESS_API_URL=https://provinces.open-api.vn/api/
`;
  console.log('✅ Đã tạo file .env mới');
}

// Ghi file
try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ ĐÃ CẬP NHẬT FILE .ENV THÀNH CÔNG!');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 Thông tin đã cấu hình:');
  console.log(`   ✅ MONGODB_URI: ${mongodbUri.substring(0, 50)}...`);
  console.log(`   ✅ JWT_SECRET: ${jwtSecret.substring(0, 20)}...`);
  console.log('   ✅ CORS_ORIGIN: http://localhost:5173,http://localhost:3000');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Test connection: npm run dev');
  console.log('   2. Seed data: npm run seed');
  console.log('');
} catch (error) {
  console.error('❌ Lỗi:', error.message);
  process.exit(1);
}

