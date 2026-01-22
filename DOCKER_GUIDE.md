# 🐳 Hướng dẫn chạy với Docker + MongoDB Atlas Free

## 📋 Yêu cầu

- Docker Desktop
- Tài khoản MongoDB Atlas (miễn phí)

---

## 🗄️ Bước 1: Tạo MongoDB Atlas Free

### 1.1 Đăng ký tài khoản

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Try Free** → Đăng ký bằng Google/Email
3. Chọn **FREE** tier (M0 Sandbox)

### 1.2 Tạo Cluster

1. Chọn **Shared** (FREE)
2. Chọn Provider: **AWS** hoặc **Google Cloud**
3. Region: **Singapore** (gần Việt Nam)
4. Cluster Name: `nhabantao-cluster`
5. Click **Create Cluster** (chờ 3-5 phút)

### 1.3 Cấu hình Database Access

1. Vào **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username: `nhabantao-admin`
4. Password: **Auto Generate** (copy lưu lại!)
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

### 1.4 Cấu hình Network Access

1. Vào **Network Access** → **Add IP Address**
2. Chọn **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ Chỉ dùng cho development. Production nên giới hạn IP
3. Click **Confirm**

### 1.5 Lấy Connection String

1. Vào **Database** → Click **Connect**
2. Chọn **Connect your application**
3. Driver: **Node.js** | Version: **5.5 or later**
4. Copy connection string:

```
mongodb+srv://nhabantao-admin:<password>@nhabantao-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. Thay `<password>` bằng password đã tạo
6. Thêm tên database vào sau `.net/`:

```
mongodb+srv://nhabantao-admin:YOUR_PASSWORD@nhabantao-cluster.xxxxx.mongodb.net/nhabantao?retryWrites=true&w=majority
```

---

## 🔧 Bước 2: Cấu hình Docker

### 2.1 Tạo file .env

```bash
# Copy file mẫu
cp .env.docker .env
```

### 2.2 Chỉnh sửa .env

```env
# Paste connection string từ MongoDB Atlas
MONGODB_URI=mongodb+srv://nhabantao-admin:YOUR_PASSWORD@nhabantao-cluster.xxxxx.mongodb.net/nhabantao?retryWrites=true&w=majority

# Tạo JWT secret (random string)
JWT_SECRET=my-super-secret-key-12345
```

---

## 🚀 Bước 3: Build và Run

### 3.1 Build images

```bash
docker-compose build
```

### 3.2 Chạy containers

```bash
docker-compose up -d
```

### 3.3 Kiểm tra logs

```bash
# Xem tất cả logs
docker-compose logs -f

# Xem logs backend
docker-compose logs -f backend

# Xem logs frontend
docker-compose logs -f frontend
```

### 3.4 Kiểm tra containers

```bash
docker-compose ps
```

---

## 🌱 Bước 4: Seed dữ liệu

### 4.1 Vào container backend

```bash
docker-compose exec backend sh
```

### 4.2 Chạy seed script

```bash
node seed.js
```

### 4.3 Thoát container

```bash
exit
```

---

## ✅ Bước 5: Truy cập ứng dụng

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:5001/api |
| **Health Check** | http://localhost:5001/api/health |

### Tài khoản test

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@applestore.vn | Admin@123 |
| User | user@applestore.vn | User@123 |

---

## 🛑 Dừng ứng dụng

```bash
# Dừng containers
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

---

## 🔄 Rebuild khi có thay đổi

```bash
# Rebuild và restart
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB

```bash
# Kiểm tra logs backend
docker-compose logs backend

# Kiểm tra connection string
docker-compose exec backend sh -c 'echo $MONGODB_URI'
```

### Lỗi CORS

- Kiểm tra `CORS_ORIGIN` trong docker-compose.yml
- Đảm bảo frontend URL đúng

### Container không start

```bash
# Xem chi tiết lỗi
docker-compose logs -f

# Restart container
docker-compose restart backend
```

---

## 📁 File structure

```
NhaBanTaoStore/
├── docker-compose.yml      # Docker Compose config
├── Dockerfile              # Frontend Dockerfile
├── nginx.conf              # Nginx config cho frontend
├── .env                    # Environment variables
├── .env.docker             # Template env
└── backend/
    └── Dockerfile          # Backend Dockerfile
```

---

## 💰 MongoDB Atlas Free Tier Limits

| Resource | Limit |
|----------|-------|
| Storage | 512 MB |
| RAM | Shared |
| Connections | 500 |
| Database | Unlimited |
| Collections | Unlimited |

✅ Đủ cho development và demo!

---

## 🚀 Deploy lên Production

Để deploy lên cloud, có thể sử dụng:

- **Railway.app** - Miễn phí $5/tháng
- **Render.com** - Free tier có sẵn
- **Fly.io** - Free tier generous
- **DigitalOcean App Platform** - $5/tháng

Xem thêm tại `backend/README.md` về cấu hình deploy.
