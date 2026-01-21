/**
 * Database Event Handlers
 * Xử lý các sự kiện kết nối MongoDB
 */

import mongoose from 'mongoose';

/**
 * Thiết lập các event handlers cho MongoDB connection
 */
export const setupDatabaseEvents = () => {
  // Sự kiện: Có lỗi xảy ra
  mongoose.connection.on('error', (err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  });

  // Sự kiện: Mất kết nối
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB đã mất kết nối');
    console.warn('💡 Đang thử kết nối lại...');
  });

  // Sự kiện: Kết nối lại thành công
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB đã kết nối lại thành công');
  });

  // Sự kiện: Kết nối lần đầu
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB đã sẵn sàng');
  });
};

/**
 * Thiết lập xử lý tắt server đúng cách
 */
export const setupGracefulShutdown = () => {
  // Khi nhận tín hiệu tắt server (Ctrl+C)
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('✅ Đã đóng kết nối MongoDB');
    console.log('👋 Server đã tắt');
    process.exit(0); // Thoát với mã thành công
  });

  // Khi nhận tín hiệu tắt server (từ PM2 hoặc Docker)
  process.on('SIGTERM', async () => {
    await mongoose.connection.close();
    console.log('✅ Đã đóng kết nối MongoDB');
    process.exit(0);
  });
};

