# 🔧 KILL PROCESS CŨ VÀ CHẠY LẠI HỆ THỐNG

## ❌ LỖI HIỆN TẠI (theo hình):

### Lỗi 1: Prisma Schema
```
Error: Error validating field 'inventories' in model 'Warehouse':
The relation field 'inventories' on model 'Warehouse' is missing an opposite relation field
```
**ĐÃ SỬA** ✅

### Lỗi 2: EADDRINUSE (Port đã được sử dụng)
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Nguyên nhân**: Backend cũ vẫn đang chạy ở port 3001

---

## ✅ CÁCH SỬA - LÀM THEO TỪNG BƯỚC:

### Bước 1: Kill tất cả processes cũ

Trong PowerShell, chạy lệnh này:

```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
```

Hoặc nếu lệnh trên không hoạt động, dùng:

```powershell
taskkill /F /IM node.exe
```

Bạn sẽ thấy:
```
SUCCESS: The process "node.exe" with PID XXXX has been terminated.
```

---

### Bước 2: Verify đã kill hết chưa

```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue
```

Nếu không thấy output → Đã kill thành công ✅

---

### Bước 3: Chạy Backend mới

```powershell
cd f:\xampp\htdocs\Q_L_K\backend; npx prisma generate; npx prisma db push; node src/seed.js; npm start
```

**Đợi đến khi thấy:**
```
🚀 KHO AI Backend running on http://localhost:3001
```

✅ **GIỮ TERMINAL NÀY MỞ**

---

### Bước 4: Mở Terminal MỚI, chạy Frontend

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

### Bước 5: Mở Trình Duyệt

1. Mở Chrome/Edge
2. Vào: http://localhost:5173/bin-location
3. Nhấn **Ctrl+F5**

---

## 🎯 HOẶC CHẠY 1 LỆNH DUY NHẤT:

```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force; cd f:\xampp\htdocs\Q_L_K\backend; npx prisma generate; npx prisma db push; node src/seed.js; npm start
```

---

## 📋 CHECKLIST:

- [ ] Đã kill process cũ: `Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force`
- [ ] Backend đang chạy: `npm start`
- [ ] Frontend đang chạy: `npm run dev`
- [ ] MySQL đang chạy trong XAMPP
- [ ] Đã refresh trang web: Ctrl+F5

---

## 🐛 NẾU VẪN LỖI:

### Lỗi: "Port still in use"
```powershell
# Kiểm tra port 3001 đang bị chiếm bởi process nào
netstat -ano | findstr :3001

# Kill process đó (thay XXXXX bằng PID)
taskkill /F /PID XXXXX
```

### Lỗi: "MySQL connection failed"
→ Mở XAMPP → Start MySQL

### Lỗi: "Access denied"
→ Kiểm tra file `backend/.env`:
```
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
```

---

## 📞 NẾU VẪN LỖI:

Gửi cho tôi:
1. Screenshot Terminal 1 (backend)
2. Screenshot Terminal 2 (frontend)
3. Kết quả lệnh: `Get-Process -Name "node" -ErrorAction SilentlyContinue`

---

**TÓM TẮT:**
1. Kill process cũ: `Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force`
2. Chạy backend: `cd f:\xampp\htdocs\Q_L_K\backend; npx prisma generate; npx prisma db push; node src/seed.js; npm start`
3. Chạy frontend: `cd f:\xampp\htdocs\Q_L_K; npm run dev`
4. Refresh trang: Ctrl+F5