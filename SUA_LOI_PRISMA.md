# Hướng dẫn sửa lỗi Prisma

## ❌ Lỗi hiện tại:
```
Unknown field 'zones' for include statement on model 'warehouse'
```

## 🔧 Nguyên nhân:
Prisma Client chưa được cập nhật sau khi thay đổi schema.prisma

## ✅ Cách sửa:

### Bước 1: Dừng Backend (nếu đang chạy)
Nhấn `Ctrl+C` trong terminal chạy backend

### Bước 2: Regenerate Prisma Client
```bash
cd backend
npx prisma generate
```

Bạn sẽ thấy:
```
✔ Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client in XXXms
```

### Bước 3: Push schema vào database
```bash
npx prisma db push
```

### Bước 4: Seed dữ liệu (nếu cần)
```bash
node src/seed.js
```

### Bước 5: Khởi động lại Backend
```bash
npm start
```

### Bước 6: Refresh trang Frontend
Nhấn `Ctrl+F5` để hard refresh trang web

## 🎯 Kiểm tra đã sửa thành công:

1. Mở trình duyệt: `http://localhost:3001/api/warehouses`
2. Bạn sẽ thấy danh sách warehouses với zones bên trong
3. Mở trang BinLocation: `http://localhost:5173/bin-location`
4. Cây thư mục bên trái sẽ hiển thị đúng cấu trúc

## 📋 Nếu vẫn lỗi:

### Lỗi: "Cannot find module '@prisma/client'"
```bash
cd backend
npm install
npx prisma generate
```

### Lỗi: "Database does not exist"
```bash
cd backend
npx prisma db push
```

### Lỗi: "Table already exists"
```bash
cd backend
# Xóa database và tạo lại (CẢNH BÁO: MẤT DỮ LIỆU)
npx prisma db push --force-reset
node src/seed.js
```

## 🔍 Debug:

### Xem Prisma Studio để kiểm tra data
```bash
cd backend
npx prisma studio
```
Mở trình duyệt tại `http://localhost:5555`

### Test API trực tiếp
```bash
# Windows PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/warehouses" -Method GET

# Hoặc mở trình duyệt
http://localhost:3001/api/warehouses
```

## 💡 Lưu ý quan trọng:

1. **Mỗi khi sửa schema.prisma**, phải chạy:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Restart backend** sau khi thay đổi schema

3. **Hard refresh frontend** (Ctrl+F5) để clear cache

## 📝 Quy trình đúng khi thay đổi schema:

```bash
# 1. Sửa file prisma/schema.prisma

# 2. Generate Prisma Client
npx prisma generate

# 3. Push schema vào DB
npx prisma db push

# 4. Seed data (nếu cần)
node src/seed.js

# 5. Restart backend
npm start

# 6. Refresh frontend
# Ctrl+F5 trên trình duyệt
```

---

**Lưu ý**: Sau khi sửa xong, nếu vẫn thấy lỗi, hãy kiểm tra:
1. Terminal backend có đang chạy không
2. MySQL đã chạy trong XAMPP chưa
3. Đã restart backend chưa
4. Đã hard refresh trang web chưa (Ctrl+F5)