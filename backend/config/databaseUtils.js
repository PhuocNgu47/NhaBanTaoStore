/**
 * Database Utility Functions
 * Các hàm tiện ích để kiểm tra và lấy thông tin kết nối
 */

import mongoose from 'mongoose';

/**
 * Kiểm tra trạng thái kết nối
 * 
 * @returns {string} Trạng thái: 'connected', 'disconnected', 'connecting', 'disconnecting'
 */
export const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',  // Chưa kết nối
    1: 'connected',     // Đã kết nối
    2: 'connecting',    // Đang kết nối
    3: 'disconnecting'  // Đang ngắt kết nối
  };
  
  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Lấy thông tin kết nối
 * 
 * @returns {Object} Thông tin database
 */
export const getConnectionInfo = () => {
  return {
    name: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    state: getConnectionStatus()
  };
};

/**
 * Kiểm tra xem đã kết nối chưa
 * 
 * @returns {boolean}
 */
export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

