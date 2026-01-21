/**
 * Product Controller
 * Nhận request từ Routes và gọi Product Service
 */

import * as productService from '../services/productService.js';

/**
 * Lấy danh sách products
 */
export const getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách sản phẩm'
    });
  }
};

/**
 * Lấy chi tiết một product
 */
export const getProductById = async (req, res) => {
  try {
    const result = await productService.getProductById(req.params.id);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get product error:', error);
    
    if (error.name === 'CastError' || error.message.includes('Không tìm thấy')) {
      return res.status(error.message.includes('Không tìm thấy') ? 404 : 400).json({
        success: false,
        message: error.message || 'ID sản phẩm không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin sản phẩm'
    });
  }
};

/**
 * Tạo product mới (Admin only)
 */
export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }
    
    const statusCode = error.message.includes('Vui lòng') || error.message.includes('phải') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo sản phẩm'
    });
  }
};

/**
 * Cập nhật product (Admin only)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'CastError' || error.message.includes('Không tìm thấy')) {
      return res.status(error.message.includes('Không tìm thấy') ? 404 : 400).json({
        success: false,
        message: error.message || 'ID sản phẩm không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật sản phẩm'
    });
  }
};

/**
 * Xóa product (Admin only)
 */
export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'CastError' || error.message.includes('Không tìm thấy')) {
      return res.status(error.message.includes('Không tìm thấy') ? 404 : 400).json({
        success: false,
        message: error.message || 'ID sản phẩm không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa sản phẩm'
    });
  }
};

/**
 * Thêm review cho product
 */
export const addReview = async (req, res) => {
  try {
    const result = await productService.addProductReview(
      req.params.id,
      req.user.id,
      req.body
    );
    
    res.json({
      success: true,
      message: result.isUpdate ? 'Cập nhật đánh giá thành công' : 'Thêm đánh giá thành công',
      product: result.product
    });
  } catch (error) {
    console.error('Add review error:', error);
    
    if (error.name === 'CastError' || error.message.includes('Không tìm thấy') || error.message.includes('Đánh giá')) {
      return res.status(error.message.includes('Đánh giá') ? 400 : (error.message.includes('Không tìm thấy') ? 404 : 400)).json({
        success: false,
        message: error.message || 'ID sản phẩm không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi thêm đánh giá'
    });
  }
};

/**
 * Lấy danh sách reviews của product
 */
export const getReviews = async (req, res) => {
  try {
    const result = await productService.getProductReviews(req.params.id, req.query);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy đánh giá'
    });
  }
};

/**
 * Lấy product theo slug
 */
export const getProductBySlug = async (req, res) => {
  try {
    const result = await productService.getProductBySlug(req.params.slug);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin sản phẩm'
    });
  }
};

/**
 * Lấy products theo category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const result = await productService.getProductsByCategory(req.params.category, req.query);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy sản phẩm theo danh mục'
    });
  }
};

/**
 * Tìm kiếm products
 */
export const searchProducts = async (req, res) => {
  try {
    const result = await productService.searchProducts(req.query);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tìm kiếm sản phẩm'
    });
  }
};

/**
 * Lấy featured products
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const result = await productService.getFeaturedProducts(req.query);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy sản phẩm nổi bật'
    });
  }
};

