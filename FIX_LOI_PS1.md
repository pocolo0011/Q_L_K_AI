# 🔧 FIX LỖI - Chạy trực tiếp trong PowerShell

## ❌ Lỗi hiện tại:
```
The term 'fix-prisma.bat' is not recognized
```

## ✅ Giải pháp - Chạy từng lệnh trong PowerShell:

### Bước 1: Dừng Backend (nếu đang chạy)
Trong Terminal 1, nhấn `Ctrl+C`

### Bước 2: Chạy các lệnh sau (copy từng dòng):

```powershell
cd backend
npx prisma generate
npx prisma db push
node src/seed.js
npm start
```

### Bước 3: Mở Terminal mới (Terminal 2)
```powershell
npm run dev
```

### Bước 4: Refresh trình duyệt
Nhấn `Ctrl+F5` trên trang http://localhost:5173/bin-location

---

## 🎯 HOẶC chạy 1 lệnh duy nhất:

Copy toàn bộ dòng này và paste vào PowerShell:
```powershell
cd backend; npx prisma generate; npx prisma db push; node src/seed.js; npm start
```

---

## 📝 Nếu vẫn lỗi:

### Lỗi: "npx: command not found"
```powershell
# Cài Node.js lại từ https://nodejs.org/
```

### Lỗi: "MySQL connection failed"
```powershell
# Kiểm tra MySQL đang chạy trong XAMPP
```

### Lỗi: "Access denied"
```powershell
# Kiểm tra file backend/.env có đúng không:
# DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
```

---

## ✅ Kiểm tra thành công:

Sau khi chạy xong, mở trình duyệt:
```
http://localhost:3001/api/warehouses
```

Bạn sẽ thấy danh sách 3 warehouses với zones bên trong.

Sau đó mở:
```
http://localhost:5173/bin-location
```

Cây thư mục bên trái sẽ hiển thị đúng cấu trúc!

---

## 💡 Lưu ý:

- **Terminal 1**: Chạy backend (npm start)
- **Terminal 2**: Chạy frontend (npm run dev)
- **Không đóng terminals** khi đang sử dụng
- **Refresh trang web** sau khi restart backend