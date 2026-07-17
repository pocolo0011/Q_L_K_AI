# Hướng dẫn Debug Lỗi Hệ thống

## 🐛 LỖI HIỆN TẠI:

Theo hình ảnh bạn gửi, lỗi là:
```
Lỗi khi tải danh sách dãy: Invalid 'prisma.warehouse.findMany()' invocation...
Unknown field 'zones' for include statement on model 'warehouse'
```

## 🔍 NGUYÊN NHÂN:

Prisma Client đang cũ (chưa có field 'zones'), trong khi schema.prisma đã có quan hệ này.

## ✅ GIẢI PHÁP:

### Cách 1: Sửa bằng tay (Khuyến nghị)

Mở **Terminal 1** (nơi chạy backend) và làm theo:

```bash
# 1. Nhấn Ctrl+C để dừng backend

# 2. Regenerate Prisma Client
cd backend
npx prisma generate

# 3. Push schema vào DB
npx prisma db push

# 4. Seed data
node src/seed.js

# 5. Khởi động lại
npm start
```

Sau đó mở **Terminal 2** (frontend):
```bash
npm run dev
```

### Cách 2: Nếu vẫn lỗi, kiểm tra từng bước

#### Bước 1: Kiểm tra Backend đang chạy không

Trong Terminal 1, bạn phải thấy:
```
🚀 KHO AI Backend running on http://localhost:3001
```

Nếu thấy lỗi → Đọc thông báo lỗi và sửa theo hướng dẫn bên dưới.

#### Bước 2: Test API trực tiếp

Mở trình duyệt và truy cập:
```
http://localhost:3001/api/warehouses
```

**Kết quả mong đợi:**
```json
[
  {
    "id": "...",
    "code": "WH-HN",
    "name": "Kho Hà Nội",
    "zones": [
      {
        "id": "...",
        "code": "A",
        "name": "Dãy A",
        "shelves": [...]
      }
    ]
  }
]
```

Nếu thấy lỗi → Xem log Terminal 1 để biết chi tiết.

#### Bước 3: Kiểm tra Prisma Client đã được generate chưa

```bash
cd backend
npx prisma generate
```

Bạn phải thấy:
```
✔ Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client in XXXms
```

#### Bước 4: Kiểm tra Database

Mở XAMPP → MySQL đang chạy?

Truy cập: `http://localhost/phpmyadmin`

Kiểm tra database `kho_ai` có tồn tại không?

#### Bước 5: Kiểm tra Seed Data

```bash
cd backend
node src/seed.js
```

Bạn phải thấy:
```
✅ Tạo Warehouse: Kho Hà Nội
✅ Tạo Zone: Dãy A
✅ Tạo Shelf: Kệ A-01
...
🎉 Seed dữ liệu hoàn tất!
```

## 🎯 QUY TRÌNH DEBUG TỪNG BƯỚC:

### 1. Mở Terminal 1 (Backend)
```bash
cd backend
npm start
```

**Quan sát log:**
- Nếu thấy `🚀 KHO AI Backend running on http://localhost:3001` → Backend OK
- Nếu thấy lỗi → Đọc và sửa theo thông báo

### 2. Mở Terminal 2 (Frontend)
```bash
npm run dev
```

### 3. Mở trình duyệt (F12 để mở Developer Tools)

Truy cập: `http://localhost:5173/bin-location`

**Quan sát Console (F12 → Console tab):**
- Nếu thấy lỗi màu đỏ → Đọc thông báo lỗi
- Copy lỗi và gửi cho tôi

### 4. Test API trong Console

Mở Console (F12) và paste:
```javascript
fetch('http://localhost:3001/api/warehouses')
  .then(r => r.json())
  .then(d => console.log(d))
```

Nếu thấy data → API hoạt động
Nếu thấy lỗi → Copy lỗi và gửi cho tôi

## 📋 CÁC LỖI THƯỜNG GẶP:

### Lỗi 1: "Unknown field 'zones'"
**Giải pháp:**
```bash
cd backend
npx prisma generate
npm start
```

### Lỗi 2: "Can't reach database server"
**Giải pháp:**
1. Mở XAMPP
2. Start MySQL
3. Restart backend

### Lỗi 3: "Table doesn't exist"
**Giải pháp:**
```bash
cd backend
npx prisma db push
node src/seed.js
npm start
```

### Lỗi 4: "Connection refused"
**Giải pháp:**
1. Kiểm tra backend đang chạy: `npm start`
2. Kiểm tra port 3001 có bị chiếm không
3. Nếu bị chiếm, đổi PORT trong `.env`

### Lỗi 5: CORS error
**Giải pháp:**
1. Restart backend
2. Restart frontend
3. Kiểm tra API_BASE trong `src/services/api.js`

## 🔧 CÁCH GỬI THÔNG TIN DEBUG:

Nếu vẫn lỗi sau khi làm theo hướng dẫn, hãy gửi cho tôi:

### 1. Screenshot Terminal 1 (Backend)
- Copy toàn bộ log từ lúc chạy `npm start`

### 2. Screenshot Terminal 2 (Frontend)
- Copy toàn bộ log từ lúc chạy `npm run dev`

### 3. Screenshot Console (F12)
- Mở F12 → Console tab
- Copy tất cả lỗi màu đỏ

### 4. Screenshot Network (F12)
- Mở F12 → Network tab
- Refresh trang
- Click vào request `/api/warehouses` hoặc `/api/zones`
- Copy thông tin lỗi

## 💡 MẸO DEBUG NHANH:

### 1. Test Backend API trực tiếp
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/warehouses" -Method GET

# Hoặc mở trình duyệt
http://localhost:3001/api/warehouses
```

### 2. Xem Prisma Studio
```bash
cd backend
npx prisma studio
```
Mở `http://localhost:5555` để xem data trong DB

### 3. Kiểm tra file .env
```bash
cat backend/.env
```
Phải có:
```
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
PORT=3001
```

### 4. Kiểm tra MySQL đang chạy
- Mở XAMPP Control Panel
- MySQL phải có màu xanh (Running)

## 📞 KHI GỬI THÔNG TIN HỖ TRỢ:

Hãy gửi:
1. ✅ Log Terminal 1 (backend)
2. ✅ Log Terminal 2 (frontend) 
3. ✅ Screenshot Console (F12)
4. ✅ Screenshot Network tab (F12)
5. ✅ Kết quả test API: `http://localhost:3001/api/warehouses`

Tôi sẽ giúp bạn sửa lỗi trong 5 phút!

---

## 🚀 SAU KHI SỬA XONG:

Bạn sẽ thấy:
1. ✅ Cây thư mục hiển thị 3 kho: Hà Nội, Hải Phòng, Cà Mau
2. ✅ Click vào kho → Hiện dãy
3. ✅ Click vào dãy → Hiện kệ
4. ✅ Click vào kệ → Hiện grid bins
5. ✅ Tìm kiếm sản phẩm hoạt động
6. ✅ Drag & drop hoạt động
7. ✅ AI suggestion hoạt động
8. ✅ In nhãn hoạt động

Tất cả đã được code đầy đủ, chỉ cần fix lỗi Prisma Client là chạy được!