# 👤 Hướng Dẫn Code Giao Diện User

Tài liệu này hướng dẫn các file cần xem và sửa khi tự code lại giao diện user.

## 📋 Mục Lục

1. [Frontend - Giao Diện User](#frontend---giao-diện-user)
2. [Backend - API Endpoints](#backend---api-endpoints)
3. [Backend - Logic Xử Lý](#backend---logic-xử-lý)
4. [Xóa Link Ảnh Cũ](#xóa-link-ảnh-cũ)

---

## 🎨 Frontend - Giao Diện User

### Các File Cần Xem và Sửa:

#### 1. **Trang Profile Chính**
📄 `frontend/src/pages/ProfilePage.jsx`
- Trang chính hiển thị thông tin user
- Component chính quản lý state và gọi API

#### 2. **Form Cập Nhật Profile**
📄 `frontend/src/features/user/components/ProfileForm.jsx`
- Form để user cập nhật thông tin
- Xử lý validation và submit

#### 3. **Card Hiển Thị Profile**
📄 `frontend/src/features/user/components/ProfileCard.jsx`
- Component hiển thị thông tin user dạng card

#### 4. **User Stats**
📄 `frontend/src/features/user/components/UserStats.jsx`
- Thống kê của user (số đơn hàng, tổng tiền, etc.)

#### 5. **User Menu**
📄 `frontend/src/components/Navigation/UserMenu.jsx`
- Menu dropdown của user (trong navbar)

#### 6. **API Client**
📄 `frontend/src/api/index.js`
- Các hàm gọi API user:
  - `userAPI.getProfile()` - Lấy thông tin profile
  - `userAPI.updateProfile(data)` - Cập nhật profile
  - `userAPI.uploadAvatar(file)` - Upload avatar
  - `userAPI.changePassword(data)` - Đổi mật khẩu

---

## 🔌 Backend - API Endpoints

### Routes (Định nghĩa URL)

📄 `backend/routes/users.js`

```javascript
// Các endpoints:
GET    /api/users/profile          // Lấy thông tin profile
PUT    /api/users/profile          // Cập nhật profile
POST   /api/users/profile/avatar   // Upload avatar
PUT    /api/users/profile/password // Đổi mật khẩu
GET    /api/users                  // Lấy danh sách users (Admin)
PUT    /api/users/:id/role         // Cập nhật role (Admin)
DELETE /api/users/:id              // Xóa user (Admin)
```

### Controllers (Xử lý Request)

📄 `backend/controllers/userController.js`

Các hàm chính:
- `getProfile(req, res)` - Lấy profile
- `updateProfile(req, res)` - Cập nhật profile
- `uploadAvatar(req, res)` - Upload avatar
- `changePassword(req, res)` - Đổi mật khẩu
- `getAllUsers(req, res)` - Lấy tất cả users (Admin)
- `updateUserRole(req, res)` - Cập nhật role (Admin)
- `deleteUser(req, res)` - Xóa user (Admin)

---

## ⚙️ Backend - Logic Xử Lý

### Services (Business Logic)

📄 `backend/services/userService.js`

Các hàm chính cần xem:
- `getUserProfile(userId)` - Lấy thông tin user từ DB
- `updateUserProfile(userId, data)` - Cập nhật thông tin user
- `changeUserPassword(userId, currentPassword, newPassword)` - Đổi mật khẩu
- `uploadUserAvatar(userId, file)` - Xử lý upload avatar
- `getAllUsers()` - Lấy tất cả users (Admin)
- `updateUserRole(userId, role)` - Cập nhật role (Admin)
- `deleteUser(userId)` - Xóa user (Admin)

### Models (Database Schema)

📄 `backend/models/User.js`

Cấu trúc dữ liệu User:
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  avatar: String (URL),
  phone: String,
  address: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Middleware

📄 `backend/middleware/auth.js`
- `protect` - Kiểm tra JWT token (yêu cầu đăng nhập)
- `admin` - Kiểm tra quyền admin

📄 `backend/middleware/upload.js`
- `uploadAvatar` - Xử lý upload file avatar (Multer)

---

## 🖼️ Xóa Link Ảnh Cũ

### Các File Seed Data Cần Xóa Link Ảnh:

1. **📄 `backend/seed-data/products-iphone.js`**
   - Xóa tất cả `image: 'https://via.placeholder.com/...'`
   - Thay bằng `image: ''` hoặc `image: null`

2. **📄 `backend/seed-data/products-ipad.js`**
   - Xóa tất cả `image: 'https://via.placeholder.com/...'`

3. **📄 `backend/seed-data/products-macbook.js`**
   - Xóa tất cả `image: 'https://via.placeholder.com/...'`

4. **📄 `backend/seed-data/products-watch.js`**
   - Xóa tất cả `image: 'https://via.placeholder.com/...'`

5. **📄 `backend/seed-data/products-accessories.js`**
   - Xóa tất cả `image: 'https://via.placeholder.com/...'`

### Các File Khác Có Link Ảnh:

6. **📄 `backend/api-test.http`**
   - Xóa `"image": "https://example.com/image.jpg"`

7. **📄 `backend/test.http`**
   - Xóa `"image": "https://example.com/image.jpg"`

8. **📄 `backend/docs/API_TESTING_GUIDE.md`**
   - Xóa các ví dụ có link ảnh

9. **📄 `backend/E-Commerce_API.postman_collection.json`**
   - Xóa `"image": "https://example.com/image.jpg"` trong examples

---

## 📝 Hướng Dẫn Sửa Code

### 1. Frontend - Tạo Giao Diện Mới

**Bước 1:** Mở `frontend/src/pages/ProfilePage.jsx`
- Xem cách gọi API: `userAPI.getProfile()`
- Xem cách hiển thị data: `user.name`, `user.email`, `user.avatar`

**Bước 2:** Tạo component mới hoặc sửa component cũ
- Copy structure từ `ProfileForm.jsx`
- Tùy chỉnh UI theo ý bạn

**Bước 3:** Kết nối với API
```javascript
import { userAPI } from '../api';

// Lấy profile
const profile = await userAPI.getProfile();

// Cập nhật profile
await userAPI.updateProfile({
  name: 'Tên mới',
  phone: '0123456789'
});

// Upload avatar
const formData = new FormData();
formData.append('avatar', file);
await userAPI.uploadAvatar(file);
```

### 2. Backend - Sửa Logic (Nếu Cần)

**Nếu muốn thêm field mới:**

1. Sửa Model: `backend/models/User.js`
```javascript
const userSchema = new mongoose.Schema({
  // ... các field hiện có
  newField: String  // Thêm field mới
});
```

2. Sửa Service: `backend/services/userService.js`
```javascript
export const updateUserProfile = async (userId, data) => {
  // Thêm logic xử lý field mới
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true }
  );
  return user;
};
```

3. Controller tự động nhận field mới (không cần sửa)

### 3. Xóa Link Ảnh

**Cách 1: Xóa thủ công**
- Mở từng file seed data
- Tìm và xóa dòng `image: 'https://...'`
- Thay bằng `image: ''`

**Cách 2: Dùng Find & Replace**
- Tìm: `image: 'https://via.placeholder.com/.*'`
- Thay: `image: ''`

---

## 🔍 Ví Dụ Code

### Frontend - Gọi API User

```javascript
// frontend/src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { userAPI } from '../api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await userAPI.updateProfile(data);
      await fetchProfile(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <img src={user.avatar} alt="Avatar" />
      {/* Form cập nhật */}
    </div>
  );
}
```

### Backend - Service Logic

```javascript
// backend/services/userService.js
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select('-password') // Không trả về password
    .lean();
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    success: true,
    data: user
  };
};

export const updateUserProfile = async (userId, data) => {
  // Validate data
  const allowedFields = ['name', 'phone', 'address'];
  const updateData = {};
  
  Object.keys(data).forEach(key => {
    if (allowedFields.includes(key)) {
      updateData[key] = data[key];
    }
  });
  
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');
  
  return {
    success: true,
    data: user
  };
};
```

---

## ✅ Checklist Khi Code Giao Diện User

- [ ] Đọc `frontend/src/pages/ProfilePage.jsx` để hiểu structure
- [ ] Đọc `frontend/src/features/user/components/ProfileForm.jsx` để hiểu form
- [ ] Đọc `frontend/src/api/index.js` để biết các API functions
- [ ] Đọc `backend/routes/users.js` để biết endpoints
- [ ] Đọc `backend/controllers/userController.js` để hiểu request handling
- [ ] Đọc `backend/services/userService.js` để hiểu business logic
- [ ] Đọc `backend/models/User.js` để biết cấu trúc data
- [ ] Xóa tất cả link ảnh trong seed data files
- [ ] Test API bằng Postman hoặc browser
- [ ] Code giao diện mới
- [ ] Test tích hợp Frontend - Backend

---

## 🎯 Tóm Tắt

### Frontend Files:
1. `pages/ProfilePage.jsx` - Trang chính
2. `features/user/components/ProfileForm.jsx` - Form
3. `features/user/components/ProfileCard.jsx` - Card hiển thị
4. `api/index.js` - API functions

### Backend Files:
1. `routes/users.js` - API endpoints
2. `controllers/userController.js` - Request handling
3. `services/userService.js` - Business logic
4. `models/User.js` - Database schema
5. `middleware/auth.js` - Authentication
6. `middleware/upload.js` - File upload

### Seed Data Files (Xóa ảnh):
1. `seed-data/products-iphone.js`
2. `seed-data/products-ipad.js`
3. `seed-data/products-macbook.js`
4. `seed-data/products-watch.js`
5. `seed-data/products-accessories.js`

---

**💡 Tip:** Bắt đầu từ Frontend, xem cách gọi API, sau đó xem Backend để hiểu data flow. Sau đó tự code lại giao diện theo ý bạn!

