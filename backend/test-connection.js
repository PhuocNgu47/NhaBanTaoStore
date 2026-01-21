/**
 * Test MongoDB Atlas Connection
 * 
 * Chạy file này để test kết nối đến MongoDB Atlas
 * 
 * Usage: node test-connection.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Đang kết nối đến MongoDB Atlas...\n');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI chưa được cấu hình trong .env');
      console.log('💡 Hãy tạo file .env và thêm MONGODB_URI');
      process.exit(1);
    }

    // Mask password trong connection string khi log
    const maskedUri = process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log('📡 Connection String:', maskedUri);
    console.log('');
    
    // Kết nối với options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Kết nối thành công!\n');
    console.log('📊 Thông tin kết nối:');
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port || 'N/A (Atlas)'}`);
    console.log(`   State: ${getConnectionState(conn.connection.readyState)}\n`);
    
    // List collections
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log(`📁 Collections (${collections.length}):`);
      if (collections.length > 0) {
        collections.forEach((col, index) => {
          console.log(`   ${index + 1}. ${col.name}`);
        });
      } else {
        console.log('   (Chưa có collections)');
      }
      console.log('');
    } catch (err) {
      console.log('⚠️  Không thể list collections:', err.message);
    }
    
    // Test query
    try {
      const User = mongoose.connection.collection('users');
      const userCount = await User.countDocuments();
      console.log(`👤 Users: ${userCount}`);
    } catch (err) {
      // Collection chưa tồn tại
    }
    
    try {
      const Product = mongoose.connection.collection('products');
      const productCount = await Product.countDocuments();
      console.log(`📦 Products: ${productCount}`);
    } catch (err) {
      // Collection chưa tồn tại
    }
    
    try {
      const Order = mongoose.connection.collection('orders');
      const orderCount = await Order.countDocuments();
      console.log(`🛒 Orders: ${orderCount}`);
    } catch (err) {
      // Collection chưa tồn tại
    }
    
    console.log('');
    console.log('✅ Test kết nối hoàn tất!');
    
    await mongoose.disconnect();
    console.log('✅ Đã ngắt kết nối');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi kết nối MongoDB:\n');
    console.error('Error:', error.message);
    
    // Gợi ý giải pháp
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Gợi ý:');
      console.error('   - Kiểm tra username và password trong connection string');
      console.error('   - Đảm bảo đã URL encode password nếu có ký tự đặc biệt');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Gợi ý:');
      console.error('   - Kiểm tra internet connection');
      console.error('   - Kiểm tra cluster URL trong connection string');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Gợi ý:');
      console.error('   - IP của bạn chưa được whitelist trong MongoDB Atlas');
      console.error('   - Vào Network Access và thêm IP hiện tại');
    }
    
    process.exit(1);
  }
};

function getConnectionState(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[state] || 'unknown';
}

testConnection();

