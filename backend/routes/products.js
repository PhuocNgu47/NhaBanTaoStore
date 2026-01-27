import express from 'express';
import * as productController from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import { activityLogger } from '../middleware/activityLogger.js';

const router = express.Router();

/**
 * GET /api/products/search
 * Tìm kiếm sản phẩm
 */
router.get('/search', productController.searchProducts);

/**
 * GET /api/products/featured
 * Lấy sản phẩm nổi bật
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * GET /api/products/category/:category
 * Lấy sản phẩm theo danh mục
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * GET /api/products/slug/:slug
 * Lấy sản phẩm theo slug
 */
router.get('/slug/:slug', productController.getProductBySlug);

/**
 * GET /api/products
 * Lấy danh sách sản phẩm (có phân trang, tìm kiếm, filter)
 */
router.get('/', productController.getProducts);

/**
 * GET /api/products/:id
 * Lấy thông tin chi tiết một sản phẩm
 */
router.get('/:id', productController.getProductById);

/**
 * POST /api/products
 * Tạo sản phẩm mới (Admin only)
 */
router.post('/', protect, admin, activityLogger, productController.createProduct);

/**
 * PUT /api/products/:id
 * Cập nhật thông tin sản phẩm (Admin only)
 */
router.put('/:id', protect, admin, activityLogger, productController.updateProduct);

/**
 * DELETE /api/products/:id
 * Xóa sản phẩm (Admin only)
 */
router.delete('/:id', protect, admin, activityLogger, productController.deleteProduct);

/**
 * POST /api/products/:id/reviews
 * Thêm đánh giá cho sản phẩm (Yêu cầu đăng nhập)
 */
router.post('/:id/reviews', protect, productController.addReview);

/**
 * GET /api/products/:id/reviews
 * Lấy danh sách reviews của sản phẩm (có phân trang)
 */
router.get('/:id/reviews', productController.getReviews);

export default router;
