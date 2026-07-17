# Hướng dẫn cài đặt và sử dụng trang Quản lý Vị trí Lưu trữ

## 📋 Yêu cầu hệ thống
- Node.js >= 14.x
- MySQL Server (XAMPP)
- npm hoặc yarn

## 🚀 Các bước cài đặt

### 1. Cập nhật Database Schema

Chạy lệnh sau để cập nhật cấu trúc database MySQL:

```bash
cd backend
npx prisma db push
```

Lệnh này sẽ tạo các bảng mới trong MySQL:
- `warehouses` - Quản lý kho
- `zones` - Quản lý dãy
- `shelves` - Quản lý kệ
- `bins` - Quản lý ô lưu trữ

### 2. Seed dữ liệu mẫu

Chạy lệnh sau để tạo dữ liệu mẫu:

```bash
cd backend
node src/seed.js
```

Kết quả sẽ tạo:
- 1 Warehouse: Kho Hà Nội
- 2 Zones: Dãy A, Dãy B
- 3 Shelves: Kệ A-01, Kệ A-02, Kệ B-01
- 30 Bins (10 bins mỗi kệ)
- 7 Bins có sản phẩm mẫu

### 3. Khởi động Backend Server

```bash
cd backend
npm start
```

Server sẽ chạy tại `http://localhost:3001`

### 4. Khởi động Frontend

Mở terminal mới:

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## ✨ Tính năng đã hoàn thiện

### 1. ✅ Cấu trúc kho (Tree-view)
- Hiển thị cây thư mục: Warehouse → Zones → Shelves
- Click vào từng mục để xem chi tiết
- Expand/collapse từng nhánh
- Load dữ liệu động từ MySQL

### 2. ✅ Thêm Dãy và Kệ mới
- Click nút "+" ở góc trên bên trái
- Modal cho phép chọn 2 chế độ:
  - **Thêm Dãy**: Nhập mã, tên, mô tả
  - **Thêm Kệ**: Chọn dãy cha, nhập mã, tên, số ô mặc định
- Tự động tạo hàng loạt bins khi tạo kệ mới
- Refresh tree-view ngay lập tức sau khi thêm

### 3. ✅ Sơ đồ lưới 2D
- Hiển thị bins dưới dạng grid cards
- Màu sắc theo trạng thái:
  - 🟢 Xanh lá: Trống (< 90%)
  - 🟡 Vàng: Đang dùng (< 90%)
  - 🔴 Đỏ: Đầy (≥ 90%)
- Progress bar hiển thị phần trăm chứa
- Click vào kệ để xem chi tiết

### 4. ✅ Tính năng Drag & Drop
- Kéo thả sản phẩm từ ô này sang ô khác
- Kiểm tra ô đích có trống không
- Cập nhật database MySQL tự động
- Hiển thị toast thông báo thành công

### 5. ✅ Gợi ý vị trí tối ưu bằng AI
- Phân tích các ô trống
- Highlight ô phù hợp với viền tím
- Tự động bỏ highlight sau 3 giây

### 6. ✅ In nhãn kệ
- Mở cửa sổ in mới
- Hiển thị tất cả bins của kệ
- Thông tin mã bin và dung tích
- Format in ấn chuyên nghiệp

## 📊 Cấu trúc Database

### Warehouse (Kho)
- id, code, name, address, capacity, status

### Zone (Dãy)
- id, code, name, description, warehouseId
- Mỗi Zone có nhiều Shelves

### Shelf (Kệ)
- id, code, name, capacity, description, zoneId
- Mỗi Shelf có nhiều Bins

### Bin (Ô lưu trữ)
- id, code, name, capacity, status
- shelfId, productId, soLuong
- Mỗi Bin thuộc về 1 Shelf

## 🔧 API Endpoints đã tạo

### Zones
- `GET /api/zones` - Lấy danh sách zones
- `GET /api/zones/:id` - Lấy chi tiết zone
- `POST /api/zones` - Tạo zone mới
- `PUT /api/zones/:id` - Cập nhật zone
- `DELETE /api/zones/:id` - Xóa zone

### Shelves
- `GET /api/shelves` - Lấy danh sách shelves
- `GET /api/shelves/:id` - Lấy chi tiết shelf
- `POST /api/shelves` - Tạo shelf mới
- `POST /api/shelves/:id/bins` - Tạo hàng loạt bins
- `PUT /api/shelves/:id` - Cập nhật shelf
- `DELETE /api/shelves/:id` - Xóa shelf

### Bins
- `GET /api/bins` - Lấy danh sách bins
- `GET /api/bins/:id` - Lấy chi tiết bin
- `PUT /api/bins/:id` - Cập nhật bin

## 🎨 Giao diện

### Header
- Nút "Gợi ý vị trí tối ưu bằng AI" (màu tím)
- Nút chuyển đổi 2D/3D
- Nút "In nhãn kệ"

### Left Panel (30%)
- Cây thư mục cấu trúc kho
- Nút "+" để thêm dãy/kệ
- Chú thích màu sắc

### Right Panel (70%)
- Grid view 2D của kệ
- Cards hiển thị thông tin bin
- Drag & drop để di chuyển sản phẩm

## 🐛 Xử lý lỗi thường gặp

### Lỗi kết nối database
```bash
# Kiểm tra MySQL đã chạy chưa
# XAMPP Control Panel → Start MySQL
```

### Lỗi Prisma
```bash
# Regenerate Prisma Client
cd backend
npx prisma generate
```

### Lỗi port đã được sử dụng
```bash
# Đổi port trong backend/.env
PORT=3002
```

## 📝 Ghi chú

- Warehouse ID hiện tại hardcoded là 'default', cần lấy từ context thực tế
- Chức năng 3D đang phát triển, sẽ tích hợp Three.js
- AI suggestion hiện tại đơn giản, có thể mở rộng với machine learning
- Product ID đang dùng mã code, có thể thay bằng tên sản phẩm

## 🎯 Tính năng mở rộng (Future)

- [ ] Tích hợp QR Code thực sự cho in nhãn
- [ ] View 3D với Three.js
- [ ] AI gợi ý thông minh hơn (theo danh mục, tần suất)
- [ ] Import/Export cấu trúc kho từ Excel
- [ ] Lịch sử di chuyển sản phẩm
- [ ] Thống kê mức độ sử dụng kệ

## 📞 Hỗ trợ

Nếu có vấn đề, vui lòng kiểm tra:
1. Backend server đã chạy chưa
2. MySQL đã kết nối được chưa
3. Prisma schema đã push chưa
4. Seed data đã chạy chưa