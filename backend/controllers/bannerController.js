/**
 * Banner Controller
 * Xử lý request/response cho Banner API
 */

import * as bannerService from '../services/bannerService.js';
import { deleteFile } from '../middleware/upload.js';

/**
 * GET /api/banners
 * Lấy danh sách banner active (cho frontend)
 */
export const getBanners = async (req, res) => {
  try {
    const result = await bannerService.getActiveBanners();
    res.json(result);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách banner'
    });
  }
};

/**
 * GET /api/banners/admin
 * Lấy tất cả banner (cho admin)
 */
export const getAllBanners = async (req, res) => {
  try {
    const result = await bannerService.getAllBanners(req.query);
    res.json(result);
  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách banner'
    });
  }
};

/**
 * GET /api/banners/:id
 * Lấy chi tiết banner
 */
export const getBannerById = async (req, res) => {
  try {
    const result = await bannerService.getBannerById(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Get banner error:', error);
    
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin banner'
    });
  }
};

/**
 * POST /api/banners
 * Tạo banner mới (Admin only)
 */
export const createBanner = async (req, res) => {
  try {
    const bannerData = {
      ...req.body,
      // Nếu có file upload, lấy URL từ req.file
      image: req.file ? `/uploads/banners/${req.file.filename}` : req.body.image
    };
    
    const result = await bannerService.createBanner(bannerData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo banner'
    });
  }
};

/**
 * PUT /api/banners/:id
 * Cập nhật banner (Admin only)
 */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Nếu có file upload mới, cập nhật image
    if (req.file) {
      // Lấy banner cũ để xóa ảnh cũ
      const oldBanner = await bannerService.getBannerById(id);
      if (oldBanner.banner.image && !oldBanner.banner.image.startsWith('http')) {
        deleteFile(oldBanner.banner.image.replace('/uploads/banners/', ''), 'banners');
      }
      
      updateData.image = `/uploads/banners/${req.file.filename}`;
    }
    
    const result = await bannerService.updateBanner(id, updateData);
    res.json(result);
  } catch (error) {
    console.error('Update banner error:', error);
    
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật banner'
    });
  }
};

/**
 * DELETE /api/banners/:id
 * Xóa banner (Admin only)
 */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Lấy banner để xóa ảnh
    const banner = await bannerService.getBannerById(id);
    if (banner.banner.image && !banner.banner.image.startsWith('http')) {
      deleteFile(banner.banner.image.replace('/uploads/banners/', ''), 'banners');
    }
    
    const result = await bannerService.deleteBanner(id);
    res.json(result);
  } catch (error) {
    console.error('Delete banner error:', error);
    
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa banner'
    });
  }
};

/**
 * PUT /api/banners/reorder
 * Cập nhật thứ tự hiển thị (Admin only)
 */
export const reorderBanners = async (req, res) => {
  try {
    const { bannerOrders } = req.body; // [{ id, displayOrder }, ...]
    
    if (!Array.isArray(bannerOrders)) {
      return res.status(400).json({
        success: false,
        message: 'bannerOrders phải là mảng'
      });
    }
    
    const result = await bannerService.updateDisplayOrder(bannerOrders);
    res.json(result);
  } catch (error) {
    console.error('Reorder banners error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thứ tự'
    });
  }
};
