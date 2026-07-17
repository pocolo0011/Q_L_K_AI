# 🚀 CHẠY HỆ THỐNG - CHỈ 3 BƯỚC

## ❌ LỖI HIỆN TẠI:
```
Lỗi khi tải danh sách dãy: Unknown field 'zones'
```

## ✅ GIẢI PHÁP - 3 BƯỚC:

### 📍 Bước 1: Mở PowerShell, chạy Backend

Copy DÒNG NÀY và paste vào PowerShell:
```powershell
cd backend; npx prisma generate; npx prisma db push; node src/seed.js; npm start
```

**Đợi đến khi thấy:**
```
🚀 KHO AI Backend running on http://localhost:3001
```

**GIỮ TERMINAL NÀY MỞ**

---

### 📍 Bước 2: Mở Terminal MỚI, chạy Frontend

Mở PowerShell mới (Terminal 2), chạy:
```powershell
npm run dev
```

**Đợi đến khi thấy:**
```
VITE vX.X.X  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**GIỮ TERMINAL NÀY MỞ**

---

### 📍 Bước 3: Mở Trình Duyệt

1. Mở Chrome/Edge
2. Vào: http://localhost:5173/bin-location
3. Nhấn **Ctrl+F5** (hard refresh)

---

## 🎯 XONG!

Bạn sẽ thấy:
- ✅ Cây thư mục bên trái hiển thị 3 kho
- ✅ Click vào kho → Hiện dãy → Kệ → Bins
- ✅ Tìm kiếm sản phẩm hoạt động
- ✅ Tất cả tính năng hoạt động

---

## ⚠️ LƯU Ý QUAN TRỌNG:

1. **MySQL PHẢI CHẠY** trong XAMPP trước khi làm bước 1
2. **KHÔNG ĐÓNG terminals** khi đang sử dụng
3. **Terminal 1**: Backend (npm start)
4. **Terminal 2**: Frontend (npm run dev)

---

## 🐛 Nếu VẪN LỖI:

### Lỗi: "MySQL connection failed"
→ Mở XAMPP → Start MySQL

### Lỗi: "npx: command not found"  
→ Cài Node.js từ https://nodejs.org/

### Lỗi: "Access denied"
→ Kiểm tra file `backend/.env` có dòng này không:
```
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
```

---

## 📞 Nếu vẫn lỗi sau 3 bước trên:

Gửi cho tôi:
1. Screenshot Terminal 1 (backend)
2. Screenshot Terminal 2 (frontend)
3. Screenshot lỗi đỏ ở góc dưới

Tôi sẽ giúp bạn trong 2 phút!

---

**Tóm lại: Chỉ cần chạy 2 dòng lệnh ở 2 terminals là xong!**