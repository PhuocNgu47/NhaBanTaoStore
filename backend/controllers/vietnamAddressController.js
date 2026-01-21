/**
 * Vietnam Address Controller
 * API để lấy danh sách Tỉnh/Thành, Quận/Huyện, Phường/Xã
 */

import { Province, District, Ward } from '../models/VietnamAddress.js';

/**
 * Lấy danh sách tất cả tỉnh/thành
 */
export const getProvinces = async (req, res) => {
  try {
    const provinces = await Province.find().sort({ name: 1 });
    res.json({
      success: true,
      provinces
    });
  } catch (error) {
    console.error('Get provinces error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tỉnh/thành'
    });
  }
};

/**
 * Lấy danh sách quận/huyện theo tỉnh/thành
 */
export const getDistricts = async (req, res) => {
  try {
    const { provinceCode } = req.params;
    
    if (!provinceCode) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã tỉnh/thành'
      });
    }

    const districts = await District.find({ provinceCode }).sort({ name: 1 });
    
    res.json({
      success: true,
      districts
    });
  } catch (error) {
    console.error('Get districts error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách quận/huyện'
    });
  }
};

/**
 * Lấy danh sách phường/xã theo quận/huyện
 */
export const getWards = async (req, res) => {
  try {
    const { districtCode } = req.params;
    
    if (!districtCode) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã quận/huyện'
      });
    }

    const wards = await Ward.find({ districtCode }).sort({ name: 1 });
    
    res.json({
      success: true,
      wards
    });
  } catch (error) {
    console.error('Get wards error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách phường/xã'
    });
  }
};

/**
 * Lấy tất cả phường/xã theo tỉnh/thành (không cần districtCode)
 */
export const getWardsByProvince = async (req, res) => {
  try {
    const { provinceCode } = req.params;
    
    if (!provinceCode) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã tỉnh/thành'
      });
    }

    const wards = await Ward.find({ provinceCode }).sort({ name: 1 });
    
    res.json({
      success: true,
      wards
    });
  } catch (error) {
    console.error('Get wards by province error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách phường/xã'
    });
  }
};

/**
 * Tìm kiếm địa chỉ (provinces, districts, wards)
 */
export const searchAddress = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập ít nhất 2 ký tự để tìm kiếm'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    
    const [provinces, districts, wards] = await Promise.all([
      Province.find({ 
        $or: [
          { name: searchRegex },
          { fullName: searchRegex }
        ]
      }).limit(10),
      District.find({ 
        $or: [
          { name: searchRegex },
          { fullName: searchRegex }
        ]
      }).limit(10),
      Ward.find({ 
        $or: [
          { name: searchRegex },
          { fullName: searchRegex }
        ]
      }).limit(10)
    ]);

    res.json({
      success: true,
      results: {
        provinces,
        districts,
        wards
      }
    });
  } catch (error) {
    console.error('Search address error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm địa chỉ'
    });
  }
};

