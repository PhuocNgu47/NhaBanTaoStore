/**
 * Cấu hình kết nối MongoDB
 * 
 * File này chứa tất cả logic kết nối database
 * Tách riêng để dễ quản lý và tái sử dụng
 */

import mongoose from 'mongoose';

/**
 * Kết nối đến MongoDB
 * 
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    // Kiểm tra xem đã có connection string chưa
    if (!process.env.MONGODB_URI) {
      console.error('❌ Lỗi: MONGODB_URI chưa được cấu hình trong file .env');
      console.error('💡 Hãy tạo file .env và thêm: MONGODB_URI=mongodb+srv://...');
      process.exit(1); // Dừng server nếu không có connection string
    }

    // Các tùy chọn kết nối MongoDB
    const options = {
      // Số lượng kết nối tối đa trong pool (mặc định: 10)
      // Pool là nhóm các kết nối được tái sử dụng để tăng hiệu suất
      maxPoolSize: 10,

      // Thời gian chờ khi chọn server (5 giây)
      // Nếu không tìm được server trong 5 giây thì báo lỗi
      serverSelectionTimeoutMS: 5000,

      // Thời gian chờ khi không có hoạt động (45 giây)
      // Nếu không có request nào trong 45 giây thì đóng kết nối
      socketTimeoutMS: 45000,

      // Tự động tạo indexes khi khởi tạo
      // Index giúp query nhanh hơn
      autoIndex: true,

      // Buffer commands nếu chưa kết nối được
      // Nếu chưa kết nối, các lệnh sẽ được lưu lại và thực thi sau
      bufferCommands: true,
    };

    // Thực hiện kết nối
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    // Hiển thị thông tin kết nối thành công
    console.log('✅ MongoDB đã kết nối thành công');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);

    // ============================================
    // XỬ LÝ CÁC SỰ KIỆN KẾT NỐI
    // ============================================

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

    // ============================================
    // XỬ LÝ TẮT SERVER ĐÚNG CÁCH
    // ============================================

    // Khi nhận tín hiệu tắt server (Ctrl+C)
    process.on('SIGINT', async () => {
      // Đóng kết nối database trước khi tắt server
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

  } catch (error) {
    // Xử lý lỗi kết nối
    console.error('❌ Không thể kết nối MongoDB:', error.message);
    console.error('');

    // Gợi ý giải pháp dựa trên loại lỗi
    if (error.message.includes('authentication failed')) {
      console.error('💡 Lỗi xác thực:');
      console.error('   - Kiểm tra username và password trong MONGODB_URI');
      console.error('   - Đảm bảo đã URL encode password nếu có ký tự đặc biệt');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('💡 Lỗi IP:');
      console.error('   - IP của bạn chưa được whitelist trong MongoDB Atlas');
      console.error('   - Vào MongoDB Atlas > Network Access > Add IP Address');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Lỗi kết nối mạng:');
      console.error('   - Kiểm tra internet connection');
      console.error('   - Kiểm tra connection string có đúng không');
    } else {
      console.error('💡 Kiểm tra:');
      console.error('   - Connection string trong file .env');
      console.error('   - MongoDB Atlas đang hoạt động');
      console.error('   - Firewall không chặn kết nối');
    }

    console.error('');
    process.exit(1); // Thoát với mã lỗi
  }
};

/**
 * Ngắt kết nối MongoDB
 * 
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Đã ngắt kết nối MongoDB');
  } catch (error) {
    console.error('❌ Lỗi khi ngắt kết nối:', error.message);
  }
};

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

