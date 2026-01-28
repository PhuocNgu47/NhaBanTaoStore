# 🌱 HƯỚNG DẪN SEED DATA

## Cấu Trúc Files

```
backend/
├── seed-manager.js      # ⭐ Script chính - DÙNG FILE NÀY
├── seed.js              # Seed toàn bộ database (Users, Orders, Products...)
├── seed-scripts/        # Logic seed từng model
│   ├── seedUsers.js
│   ├── seedProducts.js
│   ├── seedOrders.js
│   └── ...
├── seed-data/           # Dữ liệu mẫu JSON
├── scripts/             # Scripts tiện ích khác
└── product-data-input.md # Template thêm sản phẩm mới
```

---

## 🚀 Cách Sử Dụng

### 1. Quản lý Sản Phẩm (AN TOÀN)

```bash
# Thêm sản phẩm mới (KHÔNG xóa data cũ) - MẶC ĐỊNH
node seed-manager.js --add

# Xóa tất cả và seed lại (⚠️ NGUY HIỂM)
node seed-manager.js --reset

# Backup sản phẩm hiện tại
node seed-manager.js --backup

# Restore từ backup gần nhất
node seed-manager.js --restore
```

### 2. Seed Toàn Bộ Database

```bash
# Seed tất cả: Users, Products, Orders, Leads...
node seed.js
```

⚠️ **Lưu ý:** `seed.js` sẽ XÓA TẤT CẢ dữ liệu hiện tại!

---

## 📦 Thêm Sản Phẩm Mới

1. Mở `product-data-input.md`
2. Dán sản phẩm theo format hướng dẫn
3. Báo AI để parse và seed

---

## 📁 Backups

Backups được lưu tại: `backend/backups/`
- Format: `products-backup-{timestamp}.json`
- Có thể restore bất cứ lúc nào với `--restore`
