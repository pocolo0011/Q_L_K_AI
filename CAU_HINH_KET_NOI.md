# 📡 Cấu Hình Kết Nối Server - KHO AI

**Ngày tạo:** 16/07/2026  
**Mục đích:** Giải thích các file cấu hình kết nối server trong dự án

---

## 📋 MỤC LỤC

1. [Tổng Quan Kết Nối](#tổng-quan-kết-nối)
2. [Frontend → Backend](#frontend--backend)
3. [Backend → Database](#backend--database)
4. [Cách Thay Đổi Cấu Hình](#cách-thay-đổi-cấu-hình)
5. [Kiểm Tra Kết Nối](#kiểm-tra-kết-nối)

---

## 🔗 TỔNG QUAN KẾT NỐI

Dự án KHO AI có 2 loại kết nối:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │   Backend   │ ──────> │  Database   │
│   (React)   │  API    │  (Express)  │  Query  │   (MySQL)   │
│  Port 5173  │ ──────> │  Port 3001  │ ──────> │  Port 3306  │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │                       │
      │                       │                       │
   [File 1]               [File 2]               [File 3]
   api.js                  .env                   .env
```

---

## 1️⃣ FRONTEND → BACKEND

### File cấu hình: `src/services/api.js`

**Dòng 6:**
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
```

### Ý nghĩa:

- **`import.meta.env.VITE_API_URL`**: Đọc từ file `.env` (root directory)
- **`'http://localhost:3001/api'`**: Default value nếu không có `.env`

### Cách hoạt động:

```javascript
// Nếu có VITE_API_URL trong .env
API_BASE = "http://localhost:3001/api"

// Nếu không có
API_BASE = "http://localhost:3001/api" (default)

// Khi gọi API
request('/dashboard')
→ URL: http://localhost:3001/api/dashboard
```

### Cấu hình file `.env` (root):

```env
# File: .env (ở thư mục gốc, cùng cấp với package.json)

# API URL của Backend
VITE_API_URL=http://localhost:3001/api

# App name (optional)
VITE_APP_NAME=KHO AI
```

### Khi nào cần thay đổi?

| Trường hợp | Cần thay đổi | Giá trị mới |
|------------|--------------|-------------|
| Backend chạy port khác | ✅ Có | `http://localhost:3002/api` |
| Backend chạy trên server khác | ✅ Có | `http://192.168.1.100:3001/api` |
| Deploy production | ✅ Có | `https://api.kho-ai.com/api` |
| Backend chạy cùng domain | ❌ Không | Để nguyên `/api` |

---

## 2️⃣ BACKEND → DATABASE

### File cấu hình: `backend/.env`

**Nội dung hiện tại:**
```env
# Database connection - MySQL / MariaDB (XAMPP)
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"

# App configuration
PORT=3001
JWT_SECRET="kho-ai-secret-key-2024"
JWT_EXPIRES_IN="7d"
```

### Giải thích từng dòng:

#### 1. DATABASE_URL
```env
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
```

**Cấu trúc:**
```
mysql://[username]:[password]@[host]:[port]/[database]
```

**Chi tiết:**
- **`mysql://`** - Database type (MySQL)
- **`root`** - Username (tài khoản MySQL)
- **`:`** - Separator
- **``** - Password (để trống nếu không có password)
- **`@`** - Separator
- **`localhost`** - Host (MySQL server location)
- **`:3306`** - Port (MySQL port)
- **`/kho_ai`** - Database name

**Ví dụ khác:**
```env
# Có password
DATABASE_URL="mysql://root:123456@localhost:3306/kho_ai"

# MySQL chạy trên port khác
DATABASE_URL="mysql://root:@localhost:3307/kho_ai"

# MySQL trên server khác
DATABASE_URL="mysql://root:@192.168.1.100:3306/kho_ai"

# MariaDB
DATABASE_URL="mysql://root:@localhost:3306/kho_ai"
```

#### 2. PORT
```env
PORT=3001
```

- **Mặc định:** 3001
- **Thay đổi khi:** Port 3001 bị chiếm bởi ứng dụng khác
- **Ví dụ:** `PORT=3002`

#### 3. JWT_SECRET
```env
JWT_SECRET="kho-ai-secret-key-2024"
```

- **Mục đích:** Secret key để mã hóa JWT tokens
- **Lưu ý:** 
  - Đổi thành giá trị phức tạp hơn trong production
  - Không commit vào git
  - Giữ bí mật tuyệt đối

#### 4. JWT_EXPIRES_IN
```env
JWT_EXPIRES_IN="7d"
```

- **Mặc định:** 7 ngày
- **Có thể đổi:** `1h`, `1d`, `7d`, `30d`

---

## 3️⃣ CÁCH THAY ĐỔI CẤU HÌNH

### Scenario 1: Backend chạy trên port khác

**Ví dụ:** Backend chạy trên port 3002

**Bước 1:** Sửa `backend/.env`
```env
PORT=3002
```

**Bước 2:** Sửa `src/services/api.js` hoặc `.env` (root)
```env
# File: .env (root)
VITE_API_URL=http://localhost:3002/api
```

**Bước 3:** Restart cả 2 services
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

---

### Scenario 2: Backend chạy trên server khác

**Ví dụ:** Backend chạy trên `192.168.1.100`

**Bước 1:** Sửa `backend/.env`
```env
# Để nguyên, chỉ cần backend nghe trên tất cả interfaces
PORT=3001
HOST=0.0.0.0  # Thêm dòng này
```

**Bước 2:** Sửa `src/services/api.js` hoặc `.env` (root)
```env
# File: .env (root)
VITE_API_URL=http://192.168.1.100:3001/api
```

**Bước 3:** Start backend với host
```bash
cd backend
npm run dev
# Server sẽ chạy trên 0.0.0.0:3001
```

---

### Scenario 3: Deploy Production

**Ví dụ:** 
- Frontend: `https://kho-ai.com`
- Backend: `https://api.kho-ai.com`
- Database: MySQL trên cloud

**Backend `.env`:**
```env
DATABASE_URL="mysql://user:pass@db.example.com:3306/kho_ai_prod"
PORT=3001
NODE_ENV=production
JWT_SECRET="very-secret-key-change-this"
JWT_EXPIRES_IN="7d"
```

**Frontend `.env`:**
```env
VITE_API_URL=https://api.kho-ai.com/api
```

**Backend `src/index.js`:**
```javascript
// Thêm CORS config
app.use(cors({ 
  origin: 'https://kho-ai.com',  # Chỉ cho phép domain này
  credentials: true 
}))
```

---

## 4️⃣ KIỂM TRA KẾT NỐI

### Kiểm tra Frontend → Backend

```bash
# Cách 1: Browser
http://localhost:3001/api/health

# Cách 2: curl
curl http://localhost:3001/api/health

# Expected response:
{
  "status": "OK",
  "time": "2026-07-16T10:00:00.000Z"
}
```

### Kiểm tra Backend → Database

```bash
# Cách 1: Prisma Studio
cd backend
npm run db:studio
# Mở browser: http://localhost:5555

# Cách 2: MySQL command line
mysql -u root -p kho_ai

# Cách 3: Test trong code
# Backend sẽ log error nếu không kết nối được
```

### Kiểm tra toàn bộ flow

```bash
# 1. Start MySQL (XAMPP)
# 2. Start Backend
cd backend
npm run dev

# 3. Start Frontend (terminal mới)
npm run dev

# 4. Test
# Mở browser: http://localhost:5173
# Mở DevTools (F12) → Network tab
# Xem requests tới http://localhost:3001/api/...
```

---

## 📊 SUMMARY

### Files cấu hình kết nối:

| File | Vị trí | Mục đích | Khi nào sửa |
|------|--------|----------|-------------|
| `src/services/api.js` | Frontend | Cấu hình API URL | Backend đổi port/domain |
| `.env` (root) | Frontend | Environment variables | Backend đổi port/domain |
| `backend/.env` | Backend | Database + Server config | MySQL đổi pass/port/db |

### Quick Reference:

```bash
# Frontend → Backend
File: src/services/api.js (line 6)
Hoặc: .env (root) - VITE_API_URL

# Backend → Database
File: backend/.env (line 2)
DATABASE_URL="mysql://user:pass@host:port/db"

# Backend Port
File: backend/.env (line 5)
PORT=3001
```

---

## 🎯 CHECKLIST

### Development (Local):
- [ ] `backend/.env` - DATABASE_URL đúng (MySQL XAMPP)
- [ ] `backend/.env` - PORT=3001
- [ ] `.env` (root) - VITE_API_URL=http://localhost:3001/api
- [ ] MySQL đang chạy (XAMPP)
- [ ] Backend đang chạy (npm run dev)
- [ ] Frontend đang chạy (npm run dev)

### Production:
- [ ] `backend/.env` - DATABASE_URL đúng (production DB)
- [ ] `backend/.env` - NODE_ENV=production
- [ ] `backend/.env` - JWT_SECRET mạnh
- [ ] `.env` (root) - VITE_API_URL=https://api.domain.com/api
- [ ] Backend CORS config đúng domain
- [ ] Firewall cho phép ports 3001, 3306

---

## 🐛 COMMON ISSUES

### Lỗi 1: "Failed to fetch"

**Nguyên nhân:** Frontend không kết nối được Backend

**Kiểm tra:**
```bash
# 1. Backend đang chạy?
curl http://localhost:3001/api/health

# 2. API_URL đúng?
# Check src/services/api.js hoặc .env

# 3. CORS đã cấu hình?
# Backend/src/index.js phải có: app.use(cors({ origin: '*' }))
```

### Lỗi 2: "Database connection failed"

**Nguyên nhân:** Backend không kết nối được MySQL

**Kiểm tra:**
```bash
# 1. MySQL đang chạy?
# XAMPP Control Panel → MySQL

# 2. DATABASE_URL đúng?
cat backend/.env

# 3. Database tồn tại?
mysql -u root -p -e "SHOW DATABASES;"
```

### Lỗi 3: "Port already in use"

**Nguyên nhân:** Port bị chiếm

**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Hoặc đổi port trong backend/.env
PORT=3002
```

---

## 📚 TÀI LIỆU THAM KHẢO

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Express.js Configuration](https://expressjs.com/en/guide/using-middleware.html)
- [Prisma Database Connection](https://www.prisma.io/docs/orm/prisma-client/deployment)
- [MySQL Connection String](https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-reference-jdbc-url-format.html)

---

**Chúc bạn cấu hình thành công! 🎉**

---

**Cập nhật lần cuối:** 16/07/2026  
**Phiên bản:** 1.0.0  
**Tác giả:** AI Assistant