# 🔧 FIX LỖI CHI TIẾT - THEO HÌNH ẢNH

## ❌ LỖI TRONG HÌNH:

### Lỗi 1: `Cannot find path 'C:\Users\This PC\backend'`
**Nguyên nhân**: Bạn đang ở thư mục sai

### Lỗi 2: `prisma: file not found`
**Nguyên nhân**: Chưa cài đặt node_modules

---

## ✅ GIẢI PHÁP - LÀM THEO TỪNG BƯỚC:

### Bước 1: Vào đúng thư mục dự án

Trong PowerShell, chạy:
```powershell
cd f:\xampp\htdocs\Q_L_K
```

Kiểm tra xem đã đúng chưa:
```powershell
dir
```

Bạn phải thấy các thư mục: `backend`, `src`, `node_modules`,...

---

### Bước 2: Cài đặt dependencies cho Backend

```powershell
cd backend
npm install
```

**Đợi đến khi hoàn thành** (có thể mất 1-2 phút)

---

### Bước 3: Generate Prisma Client

```powershell
npx prisma generate
```

Bạn sẽ thấy:
```
✔ Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client in XXXms
```

---

### Bước 4: Push schema vào Database

```powershell
npx prisma db push
```

---

### Bước 5: Seed dữ liệu

```powershell
node src/seed.js
```

Bạn sẽ thấy:
```
✅ Tạo Warehouse: Kho Hà Nội
✅ Tạo Zone: Dãy A
...
🎉 Seed dữ liệu hoàn tất!
```

---

### Bước 6: Khởi động Backend

```powershell
npm start
```

Đợi đến khi thấy:
```
🚀 KHO AI Backend running on http://localhost:3001
```

**GIỮ TERMINAL NÀY MỞ**

---

### Bước 7: Mở Terminal MỚI, chạy Frontend

Mở PowerShell mới:
```powershell
cd f:\xampp\htdocs\Q_L_K
npm run dev
```

Đợi đến khi thấy:
```
VITE vX.X.X  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**GIỮ TERMINAL NÀY MỞ**

---

### Bước 8: Mở Trình Duyệt

1. Mở Chrome/Edge
2. Vào: http://localhost:5173/bin-location
3. Nhấn **Ctrl+F5**

---

## 🎯 HOẶC CHẠY 1 LỆNH DUY NHẤT:

Sau khi đã `cd f:\xampp\htdocs\Q_L_K`, chạy:

```powershell
cd backend; npm install; npx prisma generate; npx prisma db push; node src/seed.js; npm start
```

---

## 📋 CHECKLIST:

- [ ] MySQL đang chạy trong XAMPP
- [ ] Đã `cd f:\xampp\htdocs\Q_L_K`
- [ ] Đã `cd backend`
- [ ] Đã `npm install` (chạy 1 lần duy nhất)
- [ ] Đã `npx prisma generate`
- [ ] Đã `npx prisma db push`
- [ ] Đã `node src/seed.js`
- [ ] Backend đang chạy (Terminal 1)
- [ ] Frontend đang chạy (Terminal 2)
- [ ] Đã refresh trang web (Ctrl+F5)

---

## 🐛 Nếu VẪN LỖI:

### Lỗi: "npm install" bị lỗi
```powershell
# Xóa node_modules và cài lại
cd backend
Remove-Item -Recurse -Force node_modules
npm install
```

### Lỗi: "MySQL connection failed"
→ Mở XAMPP → Start MySQL

### Lỗi: "Access denied"
→ Kiểm tra file `backend/.env`:
```
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
```

---

## 📞 GỬI THÔNG TIN NẾU VẪN LỖI:

Gửi cho tôi:
1. Screenshot Terminal 1 (backend)
2. Screenshot Terminal 2 (frontend)
3. Kết quả lệnh `dir` trong thư mục `f:\xampp\htdocs\Q_L_K`

---

**LƯU Ý QUAN TRỌNG:**
- Phải `cd f:\xampp\htdocs\Q_L_K` trước khi chạy các lệnh
- Phải `cd backend` trước khi chạy prisma commands
- Phải `npm install` 1 lần duy nhất trước khi chạy các lệnh khác