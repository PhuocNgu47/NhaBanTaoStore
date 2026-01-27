# 📋 HƯỚNG DẪN SETUP PROFILE & ADDRESS API

## ✅ ĐÃ HOÀN THÀNH

### **1. API Địa Chỉ Việt Nam**

#### **Models:**
- ✅ `VietnamAddress.js` - Models cho Province, District, Ward

#### **Routes:**
- ✅ `GET /api/vietnam-address/provinces` - Lấy danh sách tỉnh/thành
- ✅ `GET /api/vietnam-address/provinces/:provinceCode/districts` - Lấy quận/huyện
- ✅ `GET /api/vietnam-address/districts/:districtCode/wards` - Lấy phường/xã
- ✅ `GET /api/vietnam-address/provinces/:provinceCode/wards` - Lấy phường/xã theo tỉnh
- ✅ `GET /api/vietnam-address/search?q=...` - Tìm kiếm địa chỉ

#### **Seed Script:**
- ✅ `scripts/seed-vietnam-address.js` - Import dữ liệu từ API công khai

---

### **2. User Profile Enhancement**

#### **User Model Updated:**
- ✅ `avatar` - URL ảnh đại diện
- ✅ `dateOfBirth` - Ngày sinh
- ✅ `gender` - Giới tính
- ✅ `ward`, `wardCode`, `district`, `districtCode`, `provinceCode` - Địa chỉ chi tiết
- ✅ `bio` - Giới thiệu
- ✅ `socialLinks` - Links mạng xã hội
- ✅ `preferences` - Tùy chọn (language, currency, notifications)

#### **New Routes:**
- ✅ `POST /api/users/profile/avatar` - Upload avatar
- ✅ `PUT /api/users/profile/password` - Đổi mật khẩu
- ✅ `PUT /api/users/profile` - Cập nhật profile (đã có, đã nâng cấp)

#### **File Upload:**
- ✅ `middleware/upload.js` - Multer middleware cho upload avatar
- ✅ Serve static files: `/uploads` folder

---

### **3. Frontend Components**

#### **Pages:**
- ✅ `ProfilePage.jsx` - Trang profile đầy đủ với:
  - Upload avatar
  - Form chỉnh sửa thông tin
  - Select địa chỉ Việt Nam (tỉnh/quận/phường)
  - Bio editor
  - Date of birth, gender

#### **Components:**
- ✅ `ChangePasswordModal.jsx` - Modal đổi mật khẩu

#### **API Client:**
- ✅ `vietnamAddressAPI` - API client cho địa chỉ
- ✅ `userAPI.uploadAvatar()` - Upload avatar
- ✅ `userAPI.changePassword()` - Đổi mật khẩu

---

## 🚀 CÁCH SỬ DỤNG

### **1. Seed Địa Chỉ Việt Nam**

```bash
cd backend
node scripts/seed-vietnam-address.js
```

**Lưu ý:** Script sẽ tự động tải dữ liệu từ API công khai: `https://provinces.open-api.vn/api/`

---

### **2. Cài Multer (Nếu chưa có)**

```bash
cd backend
npm install multer
```

---

### **3. Tạo Thư Mục Uploads**

```bash
cd backend
mkdir -p uploads/avatars
```

Hoặc script sẽ tự động tạo khi chạy server.

---

### **4. Test API**

#### **Get Provinces:**
```bash
GET http://localhost:5000/api/vietnam-address/provinces
```

#### **Get Districts:**
```bash
GET http://localhost:5000/api/vietnam-address/provinces/79/districts
# 79 = Hồ Chí Minh
```

#### **Get Wards:**
```bash
GET http://localhost:5000/api/vietnam-address/districts/760/wards
# 760 = Quận 1
```

#### **Upload Avatar:**
```bash
POST http://localhost:5000/api/users/profile/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: avatar: <file>
```

#### **Update Profile:**
```bash
PUT http://localhost:5000/api/users/profile
Authorization: Bearer <token>
Content-Type: application/json
Body: {
  "name": "Nguyễn Văn A",
  "phone": "0912345678",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "provinceCode": "79",
  "districtCode": "760",
  "wardCode": "26734",
  "address": "123 Đường Nguyễn Huệ",
  "bio": "Giới thiệu về bản thân..."
}
```

---

## 📱 FRONTEND USAGE

### **1. Profile Page**

Truy cập: `/profile`

**Features:**
- ✅ Upload avatar (click vào icon camera)
- ✅ Chỉnh sửa thông tin (click "Chỉnh Sửa")
- ✅ Select địa chỉ Việt Nam (tỉnh → quận → phường)
- ✅ Đổi mật khẩu (click "Đổi Mật Khẩu")

---

### **2. Sử dụng API trong Code**

```jsx
import { vietnamAddressAPI, userAPI } from '../api';

// Get provinces
const { data } = await vietnamAddressAPI.getProvinces();
const provinces = data.provinces;

// Get districts
const { data } = await vietnamAddressAPI.getDistricts('79');

// Upload avatar
const file = e.target.files[0];
await userAPI.uploadAvatar(file);

// Update profile
await userAPI.updateProfile({
  name: 'Nguyễn Văn A',
  provinceCode: '79',
  districtCode: '760',
  // ...
});
```

---

## 🔧 CẤU HÌNH

### **File Upload Limits:**
- Max file size: 5MB
- Allowed types: JPEG, PNG, GIF, WebP
- Storage: `backend/uploads/avatars/`

### **Static Files:**
- URL: `http://localhost:5000/uploads/avatars/<filename>`
- Frontend có thể access trực tiếp

---

## 📋 CHECKLIST

- [x] Vietnam Address Models
- [x] Vietnam Address API
- [x] Seed script cho địa chỉ
- [x] User Model enhancement
- [x] Upload middleware
- [x] User service & controller updates
- [x] Frontend ProfilePage
- [x] ChangePasswordModal
- [x] API client updates
- [x] Routes configuration
- [ ] Test với real data
- [ ] Deploy static files serving

---

## 💡 LƯU Ý

1. **Seed Address Data:**
   - Chạy script seed trước khi sử dụng
   - Dữ liệu từ API công khai, có thể mất vài phút để tải

2. **File Upload:**
   - Cần cài multer: `npm install multer`
   - Tạo folder `uploads/avatars`
   - Serve static files trong server.js

3. **Production:**
   - Nên dùng cloud storage (AWS S3, Cloudinary) thay vì local storage
   - Cấu hình CORS cho static files
   - Set up CDN cho images

---

**🎉 Đã hoàn thành Profile & Address API!**

