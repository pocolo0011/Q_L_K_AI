# Hướng dẫn kiểm tra và sửa lỗi kết nối

## 🔍 Bước 1: Kiểm tra Backend có chạy không

Mở terminal và chạy:

```bash
cd backend
npm start
```

Bạn sẽ thấy thông báo:
```
🚀 KHO AI Backend running on http://localhost:3001
```

Nếu thấy lỗi, hãy đọc thông báo lỗi và sửa theo hướng dẫn bên dưới.

## 🔍 Bước 2: Test API trực tiếp

Mở trình duyệt và truy cập:
```
http://localhost:3001/api/health
```

Bạn sẽ thấy:
```json
{"status":"OK","time":"2026-01-17T19:00:00.000Z"}
```

Nếu không truy cập được → Backend chưa chạy.

## 🔍 Bước 3: Test API Zones

Truy cập:
```
http://localhost:3001/api/zones
```

Nếu thấy danh sách zones → API hoạt động bình thường.
Nếu thấy lỗi → Xem log terminal để biết lỗi chi tiết.

## 🔍 Bước 4: Kiểm tra MySQL

1. Mở XAMPP Control Panel
2. Đảm bảo MySQL đang chạy (Status: Running)
3. Click "Admin" để mở phpMyAdmin
4. Kiểm tra database `kho_ai` có tồn tại không
5. Kiểm tra các bảng: warehouses, zones, shelves, bins

## 🔍 Bước 5: Kiểm tra DATABASE_URL

File `backend/.env` phải có:
```
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
```

Nếu MySQL có password, thêm vào:
```
DATABASE_URL="mysql://root:password@localhost:3306/kho_ai"
```

## 🔧 Các lỗi thường gặp và cách sửa

### Lỗi 1: "Can't reach database server"

**Nguyên nhân**: MySQL chưa chạy hoặc DATABASE_URL sai

**Cách sửa**:
1. Mở XAMPP → Start MySQL
2. Kiểm tra DATABASE_URL trong file `.env`
3. Restart backend: `npm start`

### Lỗi 2: "Database 'kho_ai' doesn't exist"

**Cách sửa**:
```bash
cd backend
npx prisma db push
```

### Lỗi 3: "Table 'kho_ai.zones' doesn't exist"

**Cách sửa**:
```bash
cd backend
npx prisma db push
node src/seed.js
```

### Lỗi 4: "Connection refused" hoặc "ECONNREFUSED"

**Nguyên nhân**: Backend chưa chạy hoặc port bị chiếm

**Cách sửa**:
1. Kiểm tra backend đang chạy: `npm start`
2. Nếu port 3001 bị chiếm, đổi trong `.env`:
   ```
   PORT=3002
   ```

### Lỗi 5: "CORS policy" hoặc lỗi fetch

**Nguyên nhân**: Frontend không kết nối được với Backend

**Cách sửa**:
1. Đảm bảo backend chạy ở port 3001
2. Kiểm tra file `src/services/api.js` có đúng URL không:
   ```javascript
   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
   ```
3. Restart cả backend và frontend

## 🚀 Quy trình khởi động đúng

### Terminal 1 - Backend:
```bash
cd backend
npm start
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

### Terminal 3 - Test (nếu cần):
```bash
# Test API
curl http://localhost:3001/api/zones

# Hoặc mở trình duyệt
http://localhost:3001/api/zones
```

## 📋 Checklist kiểm tra

- [ ] MySQL đang chạy trong XAMPP
- [ ] Database `kho_ai` đã được tạo
- [ ] File `.env` có DATABASE_URL đúng
- [ ] Đã chạy `npx prisma db push`
- [ ] Đã chạy `node src/seed.js`
- [ ] Backend đang chạy ở port 3001
- [ ] Frontend đang chạy ở port 5173
- [ ] API `/api/zones` trả về dữ liệu (test trong trình duyệt)

## 🐛 Debug nếu vẫn lỗi

### 1. Xem log backend
Terminal chạy `npm start` sẽ hiển thị lỗi chi tiết.

### 2. Test trực tiếp với curl
```bash
curl http://localhost:3001/api/zones
```

### 3. Kiểm tra Prisma Studio
```bash
cd backend
npx prisma studio
```
Mở trình duyệt tại `http://localhost:5555` để xem dữ liệu trong DB.

### 4. Kiểm tra console log Frontend
Mở Developer Tools (F12) → Console tab để xem lỗi chi tiết.

## 💡 Lưu ý quan trọng

1. **Backend phải chạy TRƯỚC** khi mở Frontend
2. **MySQL phải chạy** trước khi khởi động Backend
3. **Seed data** chỉ cần chạy 1 lần sau khi `db push`
4. Nếu thay đổi schema, chạy lại:
   ```bash
   npx prisma db push
   node src/seed.js
   ```

## 📞 Nếu vẫn lỗi

Hãy gửi cho tôi:
1. Screenshot lỗi trong console log (F12)
2. Screenshot log terminal backend
3. Thông báo lỗi chi tiết

Tôi sẽ giúp bạn sửa lỗi cụ thể!