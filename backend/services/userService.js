/**
 * User Service
 * Chứa logic nghiệp vụ cho users: CRUD, profile management
 */

import User from '../models/User.js';

/**
 * Lấy user profile
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }
  return user;
};

/**
 * Lấy danh sách tất cả users (Admin only)
 */
export const getAllUsers = async () => {
  const users = await User.find().select('-password');
  return users;
};

/**
 * Cập nhật user profile
 */
export const updateUserProfile = async (userId, updateData) => {
  const {
    name,
    phone,
    avatar,
    dateOfBirth,
    gender,
    address,
    ward,
    wardCode,
    district,
    districtCode,
    city,
    provinceCode,
    country,
    zipCode,
    bio,
    socialLinks,
    preferences
  } = updateData;

  // Build update object (chỉ update các field được cung cấp)
  const updateFields = {};
  
  if (name !== undefined) updateFields.name = name.trim();
  if (phone !== undefined) updateFields.phone = phone?.trim() || null;
  if (avatar !== undefined) updateFields.avatar = avatar;
  if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
  if (gender !== undefined) updateFields.gender = gender || null;
  
  // Address fields
  if (address !== undefined) updateFields.address = address?.trim() || null;
  if (ward !== undefined) updateFields.ward = ward?.trim() || null;
  if (wardCode !== undefined) updateFields.wardCode = wardCode || null;
  if (district !== undefined) updateFields.district = district?.trim() || null;
  if (districtCode !== undefined) updateFields.districtCode = districtCode || null;
  if (city !== undefined) updateFields.city = city?.trim() || null;
  if (provinceCode !== undefined) updateFields.provinceCode = provinceCode || null;
  if (country !== undefined) updateFields.country = country?.trim() || 'Vietnam';
  if (zipCode !== undefined) updateFields.zipCode = zipCode?.trim() || null;
  
  // Additional info
  if (bio !== undefined) updateFields.bio = bio?.trim() || null;
  if (socialLinks !== undefined) updateFields.socialLinks = socialLinks || {};
  if (preferences !== undefined) {
    updateFields.preferences = {
      ...updateFields.preferences,
      ...preferences
    };
  }

  // Update updatedAt
  updateFields.updatedAt = new Date();

  const user = await User.findByIdAndUpdate(
    userId,
    updateFields,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (userId, avatarPath) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  // Xóa avatar cũ nếu có (trừ khi là external URL)
  if (user.avatar && !user.avatar.startsWith('http')) {
    const { deleteFile } = await import('../middleware/upload.js');
    deleteFile(user.avatar, 'avatar');
  }

  // Cập nhật avatar mới
  user.avatar = avatarPath;
  user.updatedAt = new Date();
  await user.save();

  // Return user without password
  return await User.findById(userId).select('-password');
};

/**
 * Đổi mật khẩu
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error('Mật khẩu hiện tại không đúng');
  }

  // Validate new password
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  // Update password
  user.password = newPassword;
  user.updatedAt = new Date();
  await user.save();

  return { message: 'Đổi mật khẩu thành công' };
};

/**
 * Cập nhật user role (Admin only)
 */
export const updateUserRole = async (userId, role) => {
  if (!['user', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

/**
 * Xóa user (Admin only)
 */
export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }
  return user;
};

/**
 * Lấy thống kê khách hàng
 */
export const getCustomerStats = async () => {
  const users = await User.find({ role: 'user' });
  
  const totalCustomers = users.length;
  const activeCustomers = users.filter(u => u.isActive).length;
  
  // Tier distribution
  const tierDistribution = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    diamond: 0
  };
  
  let totalPoints = 0;
  let totalSpent = 0;
  
  users.forEach(user => {
    tierDistribution[user.tier || 'bronze']++;
    totalPoints += user.loyaltyPoints || 0;
    totalSpent += user.totalSpent || 0;
  });

  // Top customers by spending
  const topCustomers = users
    .filter(u => u.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10)
    .map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      totalSpent: u.totalSpent,
      orderCount: u.orderCount,
      tier: u.tier
    }));

  return {
    totalCustomers,
    activeCustomers,
    tierDistribution,
    totalPoints,
    totalSpent,
    topCustomers
  };
};

/**
 * Cập nhật điểm loyalty
 */
export const updateLoyaltyPoints = async (userId, amount, type, description) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  const pointsChange = type === 'earn' || type === 'bonus' ? amount : -amount;
  
  if (type === 'redeem' && user.loyaltyPoints < amount) {
    throw new Error('Không đủ điểm để trừ');
  }

  // Update points
  user.loyaltyPoints = Math.max(0, (user.loyaltyPoints || 0) + pointsChange);
  
  // Add to history
  if (!user.pointsHistory) user.pointsHistory = [];
  user.pointsHistory.push({
    amount: Math.abs(amount),
    type,
    description: description || (type === 'earn' ? 'Cộng điểm' : type === 'redeem' ? 'Đổi điểm' : 'Điểm thưởng'),
    createdAt: new Date()
  });

  // Auto update tier based on total spent
  user.tier = calculateTier(user.totalSpent || 0);

  await user.save();
  
  return await User.findById(userId).select('-password');
};

/**
 * Cập nhật tier khách hàng
 */
export const updateCustomerTier = async (userId, tier) => {
  const validTiers = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  
  if (!validTiers.includes(tier)) {
    throw new Error('Hạng thành viên không hợp lệ');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { tier },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

/**
 * Calculate customer tier based on total spent
 */
const calculateTier = (totalSpent) => {
  if (totalSpent >= 100000000) return 'diamond';     // 100M+
  if (totalSpent >= 50000000) return 'platinum';     // 50M+
  if (totalSpent >= 20000000) return 'gold';         // 20M+
  if (totalSpent >= 10000000) return 'silver';       // 10M+
  return 'bronze';
};

/**
 * Update user stats after order (call from order service)
 */
export const updateUserOrderStats = async (userId, orderTotal) => {
  const user = await User.findById(userId);
  
  if (!user) return;

  // Update stats
  user.totalSpent = (user.totalSpent || 0) + orderTotal;
  user.orderCount = (user.orderCount || 0) + 1;
  
  // Calculate and add loyalty points (1 point per 10,000 VND)
  const pointsEarned = Math.floor(orderTotal / 10000);
  user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsEarned;
  
  // Update tier
  user.tier = calculateTier(user.totalSpent);
  
  // Add to points history
  if (!user.pointsHistory) user.pointsHistory = [];
  user.pointsHistory.push({
    amount: pointsEarned,
    type: 'earn',
    description: `Tích điểm từ đơn hàng`,
    createdAt: new Date()
  });

  await user.save();
  
  return user;
};
