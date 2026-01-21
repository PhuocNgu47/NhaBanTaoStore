/**
 * Address Controller
 * Nhận request từ Routes và gọi Address Service
 */

import * as addressService from '../services/addressService.js';

/**
 * Lấy danh sách addresses của user
 */
export const getAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getUserAddresses(req.user.id);
    res.json({
      success: true,
      addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách địa chỉ'
    });
  }
};

/**
 * Lấy chi tiết một address
 */
export const getAddressById = async (req, res) => {
  try {
    const address = await addressService.getAddressById(req.params.id, req.user.id);
    res.json({
      success: true,
      address
    });
  } catch (error) {
    console.error('Get address error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi lấy địa chỉ'
    });
  }
};

/**
 * Tạo address mới
 */
export const createAddress = async (req, res) => {
  try {
    const address = await addressService.createAddress(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      address
    });
  } catch (error) {
    console.error('Create address error:', error);
    
    const statusCode = error.message.includes('Vui lòng') ||
                      error.message.includes('không hợp lệ') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo địa chỉ'
    });
  }
};

/**
 * Cập nhật address
 */
export const updateAddress = async (req, res) => {
  try {
    const address = await addressService.updateAddress(
      req.params.id,
      req.user.id,
      req.body
    );
    
    res.json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      address
    });
  } catch (error) {
    console.error('Update address error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('không hợp lệ') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật địa chỉ'
    });
  }
};

/**
 * Xóa address
 */
export const deleteAddress = async (req, res) => {
  try {
    await addressService.deleteAddress(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Xóa địa chỉ thành công'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi xóa địa chỉ'
    });
  }
};

/**
 * Đặt address làm mặc định
 */
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await addressService.setDefaultAddress(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Đã đặt làm địa chỉ mặc định',
      address
    });
  } catch (error) {
    console.error('Set default address error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi đặt địa chỉ mặc định'
    });
  }
};

