/**
 * Address Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as addressController from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/addresses
 * Lấy danh sách địa chỉ của user
 */
router.get('/', protect, addressController.getAddresses);

/**
 * GET /api/addresses/:id
 * Lấy chi tiết một địa chỉ
 */
router.get('/:id', protect, addressController.getAddressById);

/**
 * POST /api/addresses
 * Tạo địa chỉ mới
 */
router.post('/', protect, addressController.createAddress);

/**
 * PUT /api/addresses/:id
 * Cập nhật địa chỉ
 */
router.put('/:id', protect, addressController.updateAddress);

/**
 * DELETE /api/addresses/:id
 * Xóa địa chỉ
 */
router.delete('/:id', protect, addressController.deleteAddress);

/**
 * PATCH /api/addresses/:id/set-default
 * Đặt địa chỉ làm mặc định
 */
router.patch('/:id/set-default', protect, addressController.setDefaultAddress);

export default router;
