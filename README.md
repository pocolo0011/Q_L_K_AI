# KHO AI - Warehouse Management System

## 🚀 Hướng dẫn khởi động nhanh

### Yêu cầu hệ thống
- Node.js >= 14.x
- MySQL Server (XAMPP)
- npm hoặc yarn

### Các bước khởi động

#### 1. Cấu hình Database

Đảm bảo file `backend/.env` có cấu hình đúng:
```env
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
PORT=3001
```

#### 2. Cập nhật Database Schema

```bash
cd backend
npx prisma db push
```

#### 3. Seed dữ liệu mẫu

```bash
cd backend
node src/seed.js
```

Bạn sẽ thấy:
```
✅ Tạo Warehouse: Kho Hà Nội
✅ Tạo Zone: Dãy A
✅ Tạo Shelf: Kệ A-01
...
🎉 Seed dữ liệu hoàn tất!
```

#### 4. Khởi động Backend (Terminal 1)

```bash
cd backend
npm start
```

Server sẽ chạy tại `http://localhost:3001`

#### 5. Khởi động Frontend (Terminal 2)

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## 📋 Kiểm tra hệ thống

### Test Backend API

Mở trình duyệt và truy cập:
```
http://localhost:3001/api/health
```

Kết quả mong đợi:
```json
{"status":"OK","time":"2026-01-17T19:00:00.000Z"}
```

### Test Zones API

```
http://localhost:3001/api/zones
```

Kết quả mong đợi: Danh sách các zones từ database

### Test Warehouses API

```
http://localhost:3001/api/warehouses
```

Kết quả mong đợi: Danh sách 3 warehouses (Hà Nội, Hải Phòng, Cà Mau)

## 🏗️ Cấu trúc Database

```
Warehouse (Kho)
├── Zone (Dãy)
│   └── Shelf (Kệ)
│       └── Bin (Ô lưu trữ)
│           └── Inventory (Tồn kho)
│               └── Product (Sản phẩm)
```

## 📁 Cấu trúc dự án

```
Q_L_K/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── index.js               # Backend API server
│   │   └── seed.js                # Seed data
│   ├── .env                       # Environment config
│   └── package.json
├── src/
│   ├── pages/
│   │   ├── BinLocation.jsx        # Trang quản lý vị trí
│   │   ├── Warehouses.jsx         # Trang quản lý kho
│   │   ├── Products.jsx           # Trang quản lý sản phẩm
│   │   └── ...
│   ├── services/
│   │   └── api.js                 # API service
│   ├── components/
│   │   └── Sidebar.jsx            # Navigation sidebar
│   └── App.jsx                    # Main app router
└── HUONG_DAN_*.md                 # Tài liệu hướng dẫn
```

## 🔧 API Endpoints

### Warehouses
- `GET /api/warehouses` - Danh sách kho
- `GET /api/warehouses/:id` - Chi tiết kho
- `POST /api/warehouses` - Tạo kho mới
- `PUT /api/warehouses/:id` - Cập nhật kho
- `DELETE /api/warehouses/:id` - Xóa kho

### Zones
- `GET /api/zones` - Danh sách dãy
- `GET /api/zones/:id` - Chi tiết dãy
- `POST /api/zones` - Tạo dãy mới
- `PUT /api/zones/:id` - Cập nhật dãy
- `DELETE /api/zones/:id` - Xóa dãy

### Shelves
- `GET /api/shelves` - Danh sách kệ
- `GET /api/shelves/:id` - Chi tiết kệ
- `POST /api/shelves` - Tạo kệ mới
- `POST /api/shelves/:id/bins` - Tạo bins cho kệ
- `PUT /api/shelves/:id` - Cập nhật kệ
- `DELETE /api/shelves/:id` - Xóa kệ

### Bins
- `GET /api/bins` - Danh sách ô lưu trữ
- `GET /api/bins/:id` - Chi tiết ô
- `PUT /api/bins/:id` - Cập nhật ô

### Products Search
- `GET /api/products/search?q=...` - Tìm kiếm sản phẩm có vị trí

## 🎯 Tính năng chính

### 1. Quản lý Kho (`/warehouses`)
- ✅ Xem danh sách kho
- ✅ Thêm/Sửa/Xóa kho
- ✅ Xem cấu trúc chi tiết (Dãy → Kệ → Ô)

### 2. Quản lý Vị trí Lưu trữ (`/bin-location`)
- ✅ Tree-view cấu trúc kho
- ✅ Thêm Dãy/Kệ mới với Modal
- ✅ Grid 2D hiển thị bins
- ✅ Drag & Drop sản phẩm
- ✅ Gợi ý AI vị trí tối ưu
- ✅ In nhãn kệ

### 3. Tìm kiếm sản phẩm
- ✅ Tìm kiếm toàn hệ thống
- ✅ Hiển thị vị trí đầy đủ: Kho → Dãy → Kệ → Ô
- ✅ Click để focus trực tiếp vào vị trí

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Lỗi khi tải danh sách dãy"

**Nguyên nhân**: Backend chưa chạy hoặc database chưa được seed

**Cách sửa**:
```bash
# 1. Đảm bảo MySQL đang chạy (XAMPP)
# 2. Chạy backend
cd backend
npm start

# 3. Trong terminal khác, seed data
node src/seed.js

# 4. Restart frontend
npm run dev
```

### Lỗi: "Can't reach database server"

**Cách sửa**:
1. Mở XAMPP Control Panel
2. Start MySQL
3. Kiểm tra DATABASE_URL trong `backend/.env`
4. Restart backend

### Lỗi: "Table doesn't exist"

**Cách sửa**:
```bash
cd backend
npx prisma db push
node src/seed.js
```

## 📚 Tài liệu chi tiết

- `HUONG_DAN_BIN_LOCATION.md` - Hướng dẫn chi tiết trang Quản lý Vị trí
- `HUONG_DAN_MO_RONG_HE_THONG.md` - Hướng dẫn mở rộng hệ thống
- `HUONG_DAN_SU_DUNG_TONG_HOP.md` - Hướng dẫn sử dụng tổng hợp
- `KIEM_TRA_LOI_KET_NOI.md` - Hướng dẫn kiểm tra và sửa lỗi kết nối

## 🧪 Dữ liệu mẫu

Hệ thống đã có sẵn:
- **3 Warehouses**: Hà Nội, Hải Phòng, Cà Mau
- **6 Zones**: 2 zones mỗi kho
- **6 Shelves**: 2 shelves mỗi kho
- **60 Bins**: 10 bins mỗi kệ
- **9 Bins có sản phẩm mẫu**

## 💡 Tips

1. **Khởi động đúng thứ tự**: MySQL → Backend → Frontend
2. **Seed data chỉ cần chạy 1 lần** sau khi `db push`
3. **Test API trực tiếp** trong trình duyệt để debug nhanh
4. **Xem console log** (F12) để debug frontend

## 📞 Hỗ trợ

Nếu gặp lỗi, hãy:
1. Đọc file `KIEM_TRA_LOI_KET_NOI.md`
2. Kiểm tra log terminal backend
3. Kiểm tra console log frontend (F12)
4. Test API trực tiếp trong trình duyệt

## 🎯 Tính năng mở rộng (Future)

- [ ] Tích hợp QR Code thực sự
- [ ] View 3D với Three.js
- [ ] AI gợi ý thông minh hơn
- [ ] Mobile app quét mã vạch
- [ ] Chuyển hàng giữa các kho
- [ ] Import/Export từ Excel

---

**Phiên bản**: 1.0.0  
**Cập nhật**: 2026-01-17  
**KHO AI Team**