/**
 * File Upload Middleware
 * Sử dụng multer để upload files (avatar, images)
 */

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const avatarsDir = path.join(uploadsDir, 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Cấu hình storage cho avatar
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    // Tên file: userId-timestamp.extension
    const userId = req.user?.id || 'guest';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${userId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

// Filter: chỉ chấp nhận image files
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Multer instance cho avatar
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: imageFilter
});

// Helper function để lấy URL của file
export const getFileUrl = (filename, type = 'avatar') => {
  if (!filename) return null;
  
  // Nếu đã là URL đầy đủ, trả về luôn
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Trả về relative path (frontend sẽ handle base URL)
  return `/uploads/${type}/${filename}`;
};

// Helper function để xóa file
export const deleteFile = (filename, type = 'avatar') => {
  if (!filename) return;
  
  // Không xóa nếu là external URL
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return;
  }
  
  const filePath = path.join(uploadsDir, type, filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

