# Checklist khởi động hệ thống KHO AI

## 📋 Yêu cầu trước khi bắt đầu
- [ ] Node.js >= 14.x đã cài đặt
- [ ] XAMPP đã cài đặt
- [ ] MySQL đã được cài đặt trong XAMPP

## 🚀 Quy trình khởi động

### Bước 1: Khởi động MySQL (XAMPP)
- [ ] Mở XAMPP Control Panel
- [ ] Click "Start" bên cạnh MySQL
- [ ] Đảm bảo Status hiển thị "Running" (màu xanh)

### Bước 2: Cấu hình Backend
- [ ] Mở file `backend/.env`
- [ ] Kiểm tra DATABASE_URL có đúng không:
  ```
  DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
  ```
- [ ] Nếu MySQL có password, thêm vào:
  ```
  DATABASE_URL="mysql://root:password@localhost:3306/kho_ai"
  ```

### Bước 3: Cập nhật Database Schema
- [ ] Mở Terminal 1
- [ ] Chạy lệnh:
  ```bash
  cd backend
  npx prisma db push
  ```
- [ ] Đảm bảo không có lỗi
- [ ] Lưu ý: Lệnh này tạo các bảng trong MySQL

### Bước 4: Seed dữ liệu mẫu
- [ ] Trong Terminal 1, chạy:
  ```bash
  node src/seed.js
  ```
- [ ] Kiểm tra output có hiển thị:
  ```
  ✅ Tạo Warehouse: Kho Hà Nội
  ✅ Tạo Zone: Dãy A
  ...
  🎉 Seed dữ liệu hoàn tất!
  ```
- [ ] Nếu có lỗi, đọc thông báo lỗi và sửa theo hướng dẫn

### Bước 5: Khởi động Backend Server
- [ ] Trong Terminal 1, chạy:
  ```bash
  npm start
  ```
- [ ] Kiểm tra thông báo:
  ```
  🚀 KHO AI Backend running on http://localhost:3001
  ```
- [ ] **Giữ Terminal 1 mở** và chạy tiếp Terminal 2

### Bước 6: Khởi động Frontend
- [ ] Mở Terminal 2
- [ ] Chạy lệnh:
  ```bash
  npm run dev
  ```
- [ ] Kiểm tra thông báo:
  ```
  VITE vX.X.X  ready in XXX ms
  
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ```
- [ ] **Giữ Terminal 2 mở**

### Bước 7: Test hệ thống
- [ ] Mở trình duyệt
- [ ] Truy cập: `http://localhost:5173`
- [ ] Đăng nhập (nếu có)
- [ ] Vào trang "Quản lý Kho" (`/warehouses`)
- [ ] Kiểm tra có thấy 3 kho: Hà Nội, Hải Phòng, Cà Mau
- [ ] Vào trang "Vị trí Lưu trữ" (`/bin-location`)
- [ ] Kiểm tra cây thư mục hiển thị đúng

## ✅ Kiểm tra từng phần

### Backend API Tests
- [ ] Mở trình duyệt, truy cập: `http://localhost:3001/api/health`
  - Expected: `{"status":"OK","time":"..."}`
- [ ] Truy cập: `http://localhost:3001/api/warehouses`
  - Expected: Danh sách 3 warehouses
- [ ] Truy cập: `http://localhost:3001/api/zones`
  - Expected: Danh sách zones
- [ ] Truy cập: `http://localhost:3001/api/products/search?q=iPhone`
  - Expected: Danh sách sản phẩm có tên chứa "iPhone"

### Frontend Tests
- [ ] Trang Dashboard load được
- [ ] Trang Products hiển thị danh sách sản phẩm
- [ ] Trang Warehouses hiển thị 3 kho
- [ ] Trang BinLocation:
  - [ ] Cây thư mục hiển thị zones
  - [ ] Click vào kệ hiển thị bins
  - [ ] Màu sắc bins đúng (xanh/vàng/đỏ)
  - [ ] Click "+" mở Modal
  - [ ] Có thể thêm zone mới
  - [ ] Có thể thêm shelf mới

## 🐛 Nếu gặp lỗi

### Lỗi: "Lỗi khi tải danh sách dãy"
**Nguyên nhân**: Backend chưa chạy hoặc database chưa seed

**Cách sửa**:
1. Kiểm tra Terminal 1 có đang chạy `npm start` không
2. Kiểm tra MySQL đang chạy trong XAMPP
3. Chạy lại seed: `node src/seed.js`
4. Restart backend: `Ctrl+C` rồi `npm start`

### Lỗi: "Can't reach database server"
**Cách sửa**:
1. Mở XAMPP → Start MySQL
2. Kiểm tra DATABASE_URL trong `.env`
3. Restart backend

### Lỗi: "Table doesn't exist"
**Cách sửa**:
```bash
cd backend
npx prisma db push
node src/seed.js
```

### Lỗi: "Connection refused"
**Cách sửa**:
1. Đảm bảo backend đang chạy: `npm start`
2. Kiểm tra port 3001 có bị chiếm không
3. Nếu bị chiếm, đổi PORT trong `.env`

### Lỗi: CORS hoặc fetch error
**Cách sửa**:
1. Restart backend
2. Restart frontend
3. Kiểm tra API_BASE trong `src/services/api.js`

## 📊 Dữ liệu mẫu đã có

Sau khi seed thành công, hệ thống có:
- ✅ 3 Warehouses: Hà Nội, Hải Phòng, Cà Mau
- ✅ 6 Zones (2 mỗi kho)
- ✅ 6 Shelves (2 mỗi kho)
- ✅ 60 Bins (10 mỗi kệ)
- ✅ 9 Bins có sản phẩm mẫu

## 🎯 Sau khi khởi động thành công

Bạn có thể:
1. ✅ Thêm kho mới (Cần Thơ, Đà Nẵng...)
2. ✅ Thêm dãy/kệ cho mỗi kho
3. ✅ Xem cấu trúc kho trực quan
4. ✅ Drag & Drop sản phẩm giữa các ô
5. ✅ Tìm kiếm sản phẩm toàn hệ thống
6. ✅ In nhãn kệ

## 📞 Hỗ trợ

Nếu vẫn gặp lỗi sau khi làm theo checklist:
1. Chụp screenshot lỗi (F12 → Console)
2. Chụp log Terminal 1 (backend)
3. Gửi lại để được hỗ trợ chi tiết

## 🎓 Lưu ý quan trọng

1. **Thứ tự khởi động**: MySQL → Backend → Frontend
2. **Không đóng Terminal** trong khi sử dụng hệ thống
3. **Seed data chỉ cần chạy 1 lần** sau khi `db push`
4. **Nếu thay đổi schema**, phải chạy lại:
   ```bash
   npx prisma db push
   node src/seed.js
   ```

---

**Phiên bản**: 1.0.0  
**Ngày tạo**: 2026-01-17