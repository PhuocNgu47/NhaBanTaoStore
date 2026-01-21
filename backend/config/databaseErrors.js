/**
 * Database Error Handling
 * Xử lý và hiển thị lỗi kết nối MongoDB với gợi ý giải pháp
 */

/**
 * Xử lý lỗi kết nối MongoDB và hiển thị gợi ý
 * 
 * @param {Error} error - Lỗi kết nối
 */
export const handleConnectionError = (error) => {
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
};

/**
 * Kiểm tra và validate MongoDB URI
 * 
 * @throws {Error} Nếu MONGODB_URI chưa được cấu hình
 */
export const validateMongoURI = () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Lỗi: MONGODB_URI chưa được cấu hình trong file .env');
    console.error('💡 Hãy tạo file .env và thêm: MONGODB_URI=mongodb+srv://...');
    process.exit(1); // Dừng server nếu không có connection string
  }
};

