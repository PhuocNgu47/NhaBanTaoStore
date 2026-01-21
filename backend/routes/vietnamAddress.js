/**
 * Vietnam Address Routes
 * API endpoints cho địa chỉ Việt Nam
 */

import express from 'express';
import * as addressController from '../controllers/vietnamAddressController.js';

const router = express.Router();

/**
 * GET /api/vietnam-address/provinces
 * Lấy danh sách tất cả tỉnh/thành
 */
router.get('/provinces', addressController.getProvinces);

/**
 * GET /api/vietnam-address/provinces/:provinceCode/districts
 * Lấy danh sách quận/huyện theo tỉnh/thành
 */
router.get('/provinces/:provinceCode/districts', addressController.getDistricts);

/**
 * GET /api/vietnam-address/districts/:districtCode/wards
 * Lấy danh sách phường/xã theo quận/huyện
 */
router.get('/districts/:districtCode/wards', addressController.getWards);

/**
 * GET /api/vietnam-address/provinces/:provinceCode/wards
 * Lấy tất cả phường/xã theo tỉnh/thành
 */
router.get('/provinces/:provinceCode/wards', addressController.getWardsByProvince);

/**
 * GET /api/vietnam-address/search?q=...
 * Tìm kiếm địa chỉ
 */
router.get('/search', addressController.searchAddress);

export default router;

