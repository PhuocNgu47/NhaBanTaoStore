# 📁 Thư Mục Config

Thư mục này chứa các file cấu hình cho ứng dụng.

## 📄 Files

### `database.js`
File cấu hình kết nối MongoDB.

**Chức năng:**
- Kết nối đến MongoDB (Atlas hoặc local)
- Xử lý các sự kiện kết nối (error, disconnect, reconnect)
- Xử lý tắt server đúng cách (graceful shutdown)
- Cung cấp các hàm tiện ích: `getConnectionStatus()`, `getConnectionInfo()`

**Sử dụng:**
```javascript
import { connectDB, getConnectionStatus } from './config/database.js';

// Kết nối database
await connectDB();

// Kiểm tra trạng thái
const status = getConnectionStatus(); // 'connected', 'disconnected', ...
```

---

## 🔧 Cách Thêm Config Mới

1. Tạo file mới trong thư mục `config/`
2. Export các hàm/config cần thiết
3. Import và sử dụng trong các file khác

**Ví dụ:**
```javascript
// config/redis.js
export const connectRedis = async () => {
  // Kết nối Redis
};

// server.js
import { connectRedis } from './config/redis.js';
```

