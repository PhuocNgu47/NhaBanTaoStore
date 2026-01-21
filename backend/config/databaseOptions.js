/**
 * Database Connection Options
 * Cấu hình các tùy chọn kết nối MongoDB
 */

/**
 * Lấy các tùy chọn kết nối MongoDB
 * 
 * @returns {Object} Mongoose connection options
 */
export const getConnectionOptions = () => {
  return {
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
};

