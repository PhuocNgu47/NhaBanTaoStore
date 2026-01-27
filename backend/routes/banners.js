/**
 * Banner Routes
 * Định nghĩa các API endpoints cho Banner management
 */

import express from 'express';
import * as bannerController from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadBanner } from '../middleware/upload.js';

const router = express.Router();

/**
 * GET /api/banners
 * Lấy danh sách banner active (public - cho frontend)
 */
router.get('/', bannerController.getBanners);

/**
 * GET /api/banners/admin
 * Lấy tất cả banner (Admin only)
 * PHẢI ĐẶT TRƯỚC /:id để tránh conflict
 */
router.get('/admin', protect, admin, bannerController.getAllBanners);

/**
 * PUT /api/banners/reorder
 * Cập nhật thứ tự hiển thị (Admin only)
 * Body: { bannerOrders: [{ id, displayOrder }, ...] }
 * PHẢI ĐẶT TRƯỚC /:id để tránh conflict
 */
router.put('/reorder', protect, admin, bannerController.reorderBanners);

/**
 * GET /api/banners/:id
 * Lấy chi tiết banner
 */
router.get('/:id', bannerController.getBannerById);

/**
 * POST /api/banners
 * Tạo banner mới (Admin only)
 * Upload ảnh: field name = "image"
 */
router.post(
  '/',
  protect,
  admin,
  uploadBanner.single('image'),
  bannerController.createBanner
);

/**
 * PUT /api/banners/:id
 * Cập nhật banner (Admin only)
 * Upload ảnh: field name = "image"
 */
router.put(
  '/:id',
  protect,
  admin,
  uploadBanner.single('image'),
  bannerController.updateBanner
);

/**
 * DELETE /api/banners/:id
 * Xóa banner (Admin only)
 */
router.delete('/:id', protect, admin, bannerController.deleteBanner);

export default router;
