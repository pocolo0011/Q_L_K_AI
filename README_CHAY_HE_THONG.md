# 🚀 HƯỚNG DẪN CHẠY HỆ THỐNG - ĐỌC NÀY ĐỂ CHẠY NGAY!

## ⚠️ LỖI HIỆN TẠI:
```
Unknown field 'zones' + prisma: file not found
```

## ✅ GIẢI PHÁP - COPY PASTE CÁC LỆNH DƯỚI ĐÂY:

---

## 📍 BƯỚC 1: Mở PowerShell, chạy Backend

**Copy toàn bộ dòng này và paste vào PowerShell:**
```powershell
cd f:\xampp\htdocs\Q_L_K\backend; npm install; npx prisma generate; npx prisma db push; node src/seed.js; npm start
```

**Đợi đến khi thấy dòng này:**
```
🚀 KHO AI Backend running on http://localhost:3001
```

✅ **GIỮ TERMINAL NÀY MỞ**

---

## 📍 BƯỚC 2: Mở PowerShell MỚI, chạy Frontend

**Mở PowerShell mới (Terminal 2), copy và paste:**
```powershell
cd f:\xampp\htdocs\Q_L_K; npm run dev
```

**Đợi đến khi thấy:**
```
VITE vX.X.X  ready in XXX ms
➜  Local:   http://localhost:5173/
```

✅ **GIỮ TERMINAL NÀY MỞ**

---

## 📍 BƯỚC 3: Mở Trình Duyệt

1. Mở Chrome hoặc Edge
2. Vào địa chỉ: **http://localhost:5173/bin-location**
3. Nhấn **Ctrl+F5** (hard refresh)

---

## 🎯 XONG RỒI!

Bạn sẽ thấy:
- ✅ Cây thư mục bên trái hiển thị 3 kho: Hà Nội, Hải Phòng, Cà Mau
- ✅ Click vào kho → Hiện dãy → Click vào dãy → Hiện kệ
- ✅ Click vào kệ → Hiện grid 2D với các ô màu sắc
- ✅ Tìm kiếm sản phẩm hoạt động
- ✅ Tất cả tính năng hoạt động

---

## ⚠️ LƯU Ý QUAN TRỌNG:

1. **MySQL PHẢI CHẠY** trong XAMPP (mở XAMPP → Start MySQL)
2. **KHÔNG ĐÓNG 2 TERMINALS** khi đang sử dụng
3. **Terminal 1**: Backend (npm start)
4. **Terminal 2**: Frontend (npm run dev)

---

## 🐛 NẾU VẪN LỖI:

### Lỗi: "MySQL connection failed"
→ Mở XAMPP → Start MySQL

### Lỗi: "npm: command not found"
→ Cài Node.js từ https://nodejs.org/

### Lỗi: "Access denied"
→ Kiểm tra file `backend/.env` có dòng này không:
```
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
```

---

## 📞 NẾU VẪN LỖI SAU 3 BƯỚC:

Gửi cho tôi:
1. Screenshot Terminal 1 (backend)
2. Screenshot Terminal 2 (frontend)
3. Screenshot lỗi đỏ ở góc dưới

---

## 📋 TÓM TẮT:

**Chỉ cần copy 2 dòng lệnh và chạy ở 2 terminals:**

**Terminal 1:**
```powershell
cd f:\xampp\htdocs\Q_L_K\backend; npm install; npx prisma generate; npx prisma db push; node src/seed.js; npm start
```

**Terminal 2:**
```powershell
cd f:\xampp\htdocs\Q_L_K; npm run dev
```

**Trình duyệt:**
```
http://localhost:5173/bin-location
```

**Nhấn Ctrl+F5**

---

**CHÚC BẠN THÀNH CÔNG! 🎉**