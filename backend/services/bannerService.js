/**
 * Banner Service
 * Business logic cho Banner management
 */

import Banner from '../models/Banner.js';

/**
 * Lấy danh sách banner active (cho frontend)
 */
export const getActiveBanners = async () => {
  const now = new Date();

  // Create start of today (00:00:00) for inclusive endDate check
  // This allows banners ending "today" to still be shown throughout the day
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const banners = await Banner.find({
    isActive: true,
    $and: [
      {
        $or: [
          { startDate: { $lte: now } },
          { startDate: { $exists: false } }
        ]
      },
      {
        $or: [
          { endDate: { $gte: startOfToday } }, // Changed from 'now' to 'startOfToday'
          { endDate: { $exists: false } }
        ]
      }
    ]
  })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();

  return {
    success: true,
    banners,
    count: banners.length
  };
};

/**
 * Lấy tất cả banner (cho admin)
 */
export const getAllBanners = async (filters = {}) => {
  const { isActive, search } = filters;

  const query = {};

  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { subtitle: { $regex: search, $options: 'i' } }
    ];
  }

  const banners = await Banner.find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();

  return {
    success: true,
    banners,
    count: banners.length
  };
};

/**
 * Lấy banner theo ID
 */
export const getBannerById = async (id) => {
  const banner = await Banner.findById(id);

  if (!banner) {
    throw new Error('Không tìm thấy banner');
  }

  return {
    success: true,
    banner
  };
};

/**
 * Tạo banner mới
 */
export const createBanner = async (bannerData) => {
  // Kiểm tra displayOrder, nếu không có thì tự động set
  if (!bannerData.displayOrder && bannerData.displayOrder !== 0) {
    const maxOrder = await Banner.findOne().sort({ displayOrder: -1 });
    bannerData.displayOrder = maxOrder ? maxOrder.displayOrder + 1 : 0;
  }

  const banner = await Banner.create(bannerData);

  return {
    success: true,
    banner
  };
};

/**
 * Cập nhật banner
 */
export const updateBanner = async (id, updateData) => {
  const banner = await Banner.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!banner) {
    throw new Error('Không tìm thấy banner');
  }

  return {
    success: true,
    banner
  };
};

/**
 * Xóa banner
 */
export const deleteBanner = async (id) => {
  const banner = await Banner.findByIdAndDelete(id);

  if (!banner) {
    throw new Error('Không tìm thấy banner');
  }

  return {
    success: true,
    message: 'Xóa banner thành công'
  };
};

/**
 * Cập nhật displayOrder (reorder)
 */
export const updateDisplayOrder = async (bannerOrders) => {
  const updates = bannerOrders.map(({ id, displayOrder }) =>
    Banner.findByIdAndUpdate(id, { displayOrder }, { new: true })
  );

  await Promise.all(updates);

  return {
    success: true,
    message: 'Cập nhật thứ tự thành công'
  };
};
