# 🔧 FIX LỖI NHANH - Chỉ 3 bước

## ❌ Lỗi hiện tại:
```
Unknown field 'zones' for include statement on model 'Warehouse'
```

## ✅ Giải pháp (3 bước):

### Bước 1: Mở Terminal và dừng Backend
Nhấn `Ctrl+C` trong terminal đang chạy `npm start`

### Bước 2: Chạy lệnh sau (copy paste):
```bash
cd backend && npx prisma generate && npx prisma db push && node src/seed.js && npm start
```

Lệnh này sẽ:
- ✅ Generate Prisma Client mới
- ✅ Push schema vào database
- ✅ Seed dữ liệu mẫu
- ✅ Khởi động backend

### Bước 3: Mở Terminal mới và chạy Frontend
```bash
npm run dev
```

### Bước 4: Refresh trang web
Nhấn `Ctrl+F5` trên trình duyệt

---

## 🎯 Xong! Kiểm tra:

1. Mở: http://localhost:5173/bin-location
2. Bạn sẽ thấy cây thư mục với 3 kho: Hà Nội, Hải Phòng, Cà Mau
3. Click vào kho để xem chi tiết

## 📝 Nếu vẫn lỗi:

Copy toàn bộ lỗi trong Terminal 1 và Terminal 2, gửi lại cho tôi.

---

**Lưu ý**: Mỗi khi sửa file `prisma/schema.prisma`, phải chạy lại:
```bash
cd backend
npx prisma generate
npm start