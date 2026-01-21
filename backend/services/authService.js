/**
 * Auth Service
 * Chứa logic nghiệp vụ cho authentication: register, login, verify token
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Đăng ký user mới
 */
export const registerUser = async (userData) => {
  const { name, email, password, confirmPassword } = userData;

  // Validation: Kiểm tra các trường bắt buộc
  if (!name || !email || !password) {
    throw new Error('Vui lòng nhập đủ họ tên, email và mật khẩu');
  }

  // Validation: Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  // Validation: Kiểm tra mật khẩu xác nhận
  if (password !== confirmPassword) {
    throw new Error('Mật khẩu xác nhận không khớp');
  }

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingUser) {
    throw new Error('Email này đã được sử dụng. Vui lòng dùng email khác.');
  }

  // Tạo user mới (password sẽ tự động được hash trong User model pre-save hook)
  const user = new User({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password
  });

  await user.save();

  // Tạo JWT token
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

/**
 * Đăng nhập user
 */
export const loginUser = async (email, password) => {
  // Tìm user theo email
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  // So sánh mật khẩu (đã được hash)
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  // Tạo JWT token
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      valid: true,
      user: decoded
    };
  } catch (error) {
    return {
      valid: false,
      error: error.name === 'TokenExpiredError' 
        ? 'Token đã hết hạn' 
        : 'Token không hợp lệ'
    };
  }
};

export const getCurrentUser = async (userId) => {
  if (!userId) {
    throw new Error('Thiếu thông tin người dùng');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  return user;
};

export const updateProfile = async (userId, payload) => {
  if (!userId) {
    throw new Error('Thiếu thông tin người dùng');
  }

  const allowed = [
    'name',
    'phone',
    'avatar',
    'dateOfBirth',
    'gender',
    'address',
    'ward',
    'wardCode',
    'district',
    'districtCode',
    'city',
    'provinceCode',
    'country',
    'zipCode',
    'bio',
    'socialLinks',
    'preferences'
  ];

  const update = {};
  for (const k of allowed) {
    if (payload?.[k] !== undefined) update[k] = payload[k];
  }

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  if (!userId) {
    throw new Error('Thiếu thông tin người dùng');
  }
  if (!currentPassword || !newPassword) {
    throw new Error('Vui lòng nhập đủ mật khẩu hiện tại và mật khẩu mới');
  }
  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error('Mật khẩu hiện tại không chính xác');
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

