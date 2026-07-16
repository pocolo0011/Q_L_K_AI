# 🚀 Hướng Dẫn Chạy Thử Ứng Dụng KHO AI

**Phiên bản:** 1.0.0  
**Ngày tạo:** 16/07/2026  
**Mục đích:** Hướng dẫn cài đặt và chạy thử ứng dụng từ đầu

---

## 📋 MỤC LỤC

1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
3. [Cài Đặt & Chạy Backend](#cài-đặt--chạy-backend)
4. [Cài Đặt & Chạy Frontend](#cài-đặt--chạy-frontend)
5. [Kiểm Tra Hoạt Động](#kiểm-tra-hoạt-động)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## 🖥️ YÊU CẦU HỆ THỐNG

### Phần mềm cần cài đặt:

| Phần mềm | Phiên bản | Mục đích | Link tải |
|-----------|-----------|----------|----------|
| **Node.js** | >= 16.x | Runtime cho frontend & backend | https://nodejs.org/ |
| **npm** | >= 8.x | Package manager | (Đi kèm Node.js) |
| **MySQL** | >= 8.0 | Database | https://dev.mysql.com/downloads/ |
| **Git** | >= 2.x | Version control | https://git-scm.com/ |
| **VS Code** (Khuyến nghị) | Latest | Code editor | https://code.visualstudio.com/ |

### Kiểm tra cài đặt:

```bash
# Mở Terminal/PowerShell và chạy các lệnh sau:

node --version    # Kỳ vọng: v16.x hoặc cao hơn
npm --version     # Kỳ vọng: 8.x hoặc cao hơn
mysql --version   # Kỳ vọng: mysql Ver 8.0.x
git --version     # Kỳ vọng: git version 2.x.x
```

---

## 📁 CẤU TRÚC DỰ ÁN

```
Q_L_K/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # 17 pages
│   │   ├── contexts/        # Theme context
│   │   ├── services/        # API service
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js + Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── src/
│   │   └── index.js         # Express server
│   └── package.json
│
├── backend_fastapi/          # Python + FastAPI (Optional)
│   ├── database.py
│   ├── models/
│   ├── schemas/
│   └── repositories/
│
├── DOCUMENTATION.md          # Tài liệu hệ thống
├── TIEN_DO_DU_AN.md         # Tiến độ dự án
├── DOCUMENTATION_MODEL.md   # Database & UI structure
└── HUONG_DAN_CHAY.md        # File này
```

---

## 🗄️ BƯỚC 1: CẤU HÌNH DATABASE

### 1.1. Tạo Database MySQL

```bash
# Cách 1: Dùng MySQL Command Line
mysql -u root -p

# Trong MySQL shell:
CREATE DATABASE warehouse_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Cách 2: Dùng MySQL Workbench (GUI)
# 1. Mở MySQL Workbench
# 2. Connect to server
# 3. Click "Create a new schema"
# 4. Name: warehouse_ai
# 5. Click "Apply"
```

### 1.2. Cấu hình Backend Environment

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo file .env (copy từ .env.example nếu có)
# Hoặc tạo mới với nội dung sau:
```

**Tạo file `backend/.env`:**
```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/warehouse_ai"

# Server
PORT=3001
NODE_ENV=development

# JWT (sẽ dùng khi implement auth)
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d
```

**Lưu ý:**
- Nếu MySQL của bạn có password, thêm vào DATABASE_URL: `mysql://root:password@localhost:3306/warehouse_ai`
- Nếu MySQL chạy trên port khác 3306, thay đổi port trong DATABASE_URL

---

## ⚙️ BƯỚC 2: CHẠY BACKEND (Node.js + Express)

### 2.1. Cài đặt dependencies

```bash
# Đảm bảo đang ở thư mục backend
cd backend

# Cài đặt node_modules
npm install

# Output mong muốn:
# added 123 packages in 5s
```

### 2.2. Setup Database với Prisma

```bash
# Tạo database tables từ schema
npm run db:push

# Output mong muốn:
# Prisma schema pushed to database in 123ms

# Hoặc dùng migration (khuyến nghị cho production)
npm run db:migrate

# Seed database với dữ liệu mẫu (nếu có)
npm run db:seed
```

### 2.3. Chạy Backend Server

```bash
# Development mode (với nodemon - auto reload)
npm run dev

# Output mong muốn:
# 🚀 KHO AI Backend running on http://localhost:3001
# ✓ Ready in 123ms

# Hoặc production mode
npm start
```

**Backend đã chạy tại:** `http://localhost:3001`

### 2.4. Test Backend

```bash
# Mở terminal mới, test health check
curl http://localhost:3001/api/health

# Hoặc mở browser:
# http://localhost:3001/api/health

# Expected response:
# {
#   "status": "OK",
#   "time": "2026-07-16T09:00:00.000Z"
# }

# Test dashboard API
curl http://localhost:3001/api/dashboard

# Expected: JSON với KPIs, charts, tables data
```

---

## 🎨 BƯỚC 3: CHẠY FRONTEND (React + Vite)

### 3.1. Cài đặt dependencies

```bash
# Quay lại thư mục gốc
cd ..

# Cài đặt node_modules
npm install

# Output mong muốn:
# added 456 packages in 10s
```

### 3.2. Cấu hình Environment (Optional)

**Tạo file `.env` ở thư mục gốc (nếu cần):**
```env
# API URL (default: http://localhost:3001/api)
VITE_API_URL=http://localhost:3001/api

# App name
VITE_APP_NAME=KHO AI
```

**Lưu ý:** File `.env` đã có trong `.gitignore`, không cần lo lắng về security.

### 3.3. Chạy Frontend Development Server

```bash
# Development mode
npm run dev

# Output mong muốn:
# VITE v5.0.0  ready in 234 ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

**Frontend đã chạy tại:** `http://localhost:5173`

### 3.4. Build cho Production (Optional)

```bash
# Build
npm run build

# Output: thư mục `dist/` chứa files đã build

# Preview production build
npm run preview
```

---

## ✅ BƯỚC 4: KIỂM TRA HOẠT ĐỘNG

### 4.1. Truy cập ứng dụng

```
1. Mở browser (Chrome, Firefox, Edge)
2. Vào: http://localhost:5173
3. Bạn sẽ thấy trang Login
```

### 4.2. Test các tính năng

#### A. Test Dashboard (Dữ liệu thực)

```bash
# Backend đã chạy, database đã có data
# Dashboard sẽ hiển thị:
# - 4 KPI cards (tổng SP, đơn hàng, doanh thu, cảnh báo)
# - Line chart: biến động tồn kho 30 ngày
# - Top 5 sản phẩm bán chạy
# - Sản phẩm sắp hết hạn
# - Tồn kho thấp
```

**Lưu ý:** Dashboard API đã kết nối database thực, nhưng cần có data mẫu để hiển thị.

#### B. Test các trang khác

Các trang khác đang dùng **mock data** (hardcoded), không cần backend:

- **Products** (`/products`): Xem danh sách 8 sản phẩm mẫu
- **Inventory** (`/inventory`): Xem 6 items tồn kho
- **Orders** (`/orders`): Xem 5 đơn hàng mẫu
- **Bin Location** (`/bin-location`): Xem cấu trúc kho + 2D grid
- **Reports** (`/reports`): Xem 6 loại báo cáo
- **Employees** (`/employees`): Xem danh sách nhân viên
- **Suppliers** (`/suppliers`): Xem danh sách NCC
- **Settings** (`/settings`): Xem 7 menu cài đặt
- **Profile** (`/profile`): Xem thông tin user
- **Notifications** (`/notifications`): Xem danh sách thông báo

#### C. Test Dark Mode

```
1. Click vào icon Moon/Sun ở Sidebar (bottom)
2. Giao diện chuyển giữa Light/Dark mode
3. Setting được lưu trong localStorage
```

#### D. Test Responsive

```
1. Resize browser window
2. Hoặc mở DevTools (F12) → Toggle device toolbar
3. Test các breakpoints:
   - Mobile: < 640px
   - Tablet: 640px - 1024px
   - Desktop: > 1024px
```

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: Port đã được sử dụng

**Triệu chứng:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Giải pháp:**
```bash
# Windows: Tìm process dùng port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9

# Hoặc đổi port trong backend/.env:
PORT=3002
```

### Lỗi 2: MySQL connection failed

**Triệu chứng:**
```
Error: Can't connect to MySQL server on 'localhost'
```

**Giải pháp:**
```bash
# 1. Kiểm tra MySQL đã chạy chưa
# Windows:
net start | findstr MySQL

# Mac:
brew services list | grep mysql

# Linux:
sudo systemctl status mysql

# 2. Start MySQL nếu chưa chạy
# Windows:
net start MySQL80

# Mac:
brew services start mysql

# Linux:
sudo systemctl start mysql

# 3. Test connection
mysql -u root -p
```

### Lỗi 3: Prisma schema push failed

**Triệu chứng:**
```
Error: P1001: Can't reach database server
```

**Giải pháp:**
```bash
# 1. Kiểm tra DATABASE_URL trong backend/.env
# Đảm bảo:
# - Database name đúng: warehouse_ai
# - Username/password đúng
# - Port đúng (mặc định 3306)

# 2. Test connection
mysql -u root -p warehouse_ai

# 3. Thử lại
cd backend
npm run db:push
```

### Lỗi 4: npm install bị lỗi

**Triệu chứng:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**Giải pháp:**
```bash
# Windows: Chạy PowerShell as Administrator
# Mac/Linux:
sudo npm install

# Hoặc fix permissions:
sudo chown -R $(whoami) ~/.npm
```

### Lỗi 5: Frontend không kết nối được Backend

**Triệu chứng:**
```
Network Error
Failed to fetch
```

**Giải pháp:**
```bash
# 1. Kiểm tra backend đã chạy chưa
curl http://localhost:3001/api/health

# 2. Kiểm tra CORS đã được cấu hình chưa
# Trong backend/src/index.js, dòng 18:
app.use(cors({ origin: '*' }))  # Đã cho phép tất cả origins

# 3. Kiểm tra VITE_API_URL
# Trong .env (root):
VITE_API_URL=http://localhost:3001/api

# 4. Restart frontend sau khi thay đổi .env
npm run dev
```

### Lỗi 6: Tailwind CSS không hoạt động

**Triệu chứng:**
```
Class không có tác dụng, giao diện hỏng
```

**Giải pháp:**
```bash
# 1. Restart dev server
# 2. Kiểm tra tailwind.config.js có đúng cấu hình không
# 3. Kiểm tra src/index.css có import Tailwind không:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# 4. Clear cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📊 BÁO CÁO TIẾN ĐỘ

### Sau khi chạy thành công:

#### ✅ Backend (Node.js)
- [x] Server chạy tại `http://localhost:3001`
- [x] Health check: `GET /api/health` ✅
- [x] Dashboard API: `GET /api/dashboard` ✅
- [ ] Authentication APIs (chưa implement)
- [ ] Products APIs (chưa implement)
- [ ] Inventory APIs (chưa implement)
- [ ] Orders APIs (chưa implement)
- [ ] Other APIs (chưa implement)

#### ✅ Frontend (React)
- [x] Dev server chạy tại `http://localhost:5173`
- [x] 17 pages đều có thể truy cập
- [x] Dark mode hoạt động
- [x] Responsive design hoạt động
- [x] Dashboard kết nối API thực ✅
- [ ] Các trang khác dùng mock data (chưa connect API)

#### ✅ Database
- [x] MySQL đã kết nối
- [x] Prisma schema đã push
- [x] Tables đã được tạo
- [ ] Seed data (chưa có script seed)

---

## 🎯 BƯỚC TIẾP THEO

### Để phát triển thêm:

1. **Thêm Seed Data**
   ```bash
   # Tạo file backend/src/seed.js
   # Thêm users, products, suppliers, orders mẫu
   npm run db:seed
   ```

2. **Implement Authentication**
   - Tạo login API
   - Tạo AuthContext trong frontend
   - Protected routes

3. **Connect Frontend với Backend**
   - Products page → GET /api/products
   - Inventory page → GET /api/inventory
   - Orders page → GET /api/orders
   - ...

4. **Testing**
   ```bash
   # Backend
   npm test

   # Frontend
   npm test
   ```

5. **Deployment**
   - Xem hướng dẫn trong DOCUMENTATION.md (section 8)

---

## 📞 HỖ TRỢ

### Nếu gặp vấn đề:

1. **Check logs:**
   - Backend logs: Xem terminal chạy `npm run dev`
   - Frontend logs: Xem terminal chạy `npm run dev`
   - Browser logs: Mở DevTools (F12) → Console tab

2. **Common issues:**
   - Port conflicts: Đổi port trong `.env`
   - Database connection: Kiểm tra MySQL đã chạy
   - CORS errors: Kiểm tra backend CORS config
   - Build errors: Xóa `node_modules` và chạy `npm install` lại

3. **Documentation:**
   - DOCUMENTATION.md - Tài liệu hệ thống
   - DOCUMENTATION_MODEL.md - Database & UI structure
   - TIEN_DO_DU_AN.md - Tiến độ dự án

---

## 🎓 VÍ DỤ: CHẠY APP TỪ ĐẦU ĐẾN CUỐI

```bash
# ============================================
# COMPLETE SETUP GUIDE - CHẠY LẦN ĐẦU
# ============================================

# 1. Clone repository (nếu chưa có)
git clone <repo-url>
cd Q_L_K

# 2. Setup Database
mysql -u root -p
CREATE DATABASE warehouse_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 3. Setup Backend
cd backend
npm install

# Tạo file .env
echo 'DATABASE_URL="mysql://root:@localhost:3306/warehouse_ai"' > .env
echo 'PORT=3001' >> .env
echo 'NODE_ENV=development' >> .env

# Push schema to database
npm run db:push

# 4. Chạy Backend (Terminal 1)
npm run dev
# Output: 🚀 KHO AI Backend running on http://localhost:3001

# 5. Setup Frontend (Terminal 2 - mới)
cd ..
npm install

# 6. Chạy Frontend (Terminal 2)
npm run dev
# Output: Local: http://localhost:5173/

# 7. Test
# Mở browser: http://localhost:5173
# Login page sẽ hiện
# Test Dashboard: http://localhost:3001/api/dashboard

# ============================================
# ✅ APP ĐÃ CHẠY THÀNH CÔNG!
# ============================================
```

---

## 📝 GHI CHÚ QUAN TRỌNG

### 1. Mock Data vs Real Data

**Hiện tại:**
- **Dashboard:** Kết nối API thực ✅
- **Các trang khác:** Dùng mock data (hardcoded trong code)

**Lý do:**
- Backend APIs chưa được implement hết
- Frontend đã sẵn sàng integrate khi backend ready

### 2. Authentication

**Hiện tại:**
- Chưa có authentication thực tế
- Tất cả pages đều có thể truy cập (không có protection)

**Khi implement:**
- Thêm AuthContext
- Protected routes
- Login/Logout functionality

### 3. Database Seeding

**Hiện tại:**
- Database trống (chỉ có tables)
- Không có data mẫu

**Cần làm:**
- Tạo script seed data
- Thêm users, products, suppliers, orders mẫu
- Run: `npm run db:seed`

### 4. Environment Variables

**Backend (.env):**
```env
DATABASE_URL=mysql://root:@localhost:3306/warehouse_ai
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=KHO AI
```

---

## 🎯 CHECKLIST TRƯỚC KHI CHẠY

### Backend:
- [ ] MySQL đã cài đặt và chạy
- [ ] Database `warehouse_ai` đã tạo
- [ ] File `backend/.env` đã tạo với DATABASE_URL đúng
- [ ] Đã chạy `npm install` trong thư mục `backend/`
- [ ] Đã chạy `npm run db:push` để tạo tables
- [ ] Backend server đã start: `npm run dev`

### Frontend:
- [ ] Đã chạy `npm install` trong thư mục gốc
- [ ] File `.env` đã tạo (optional)
- [ ] Frontend server đã start: `npm run dev`
- [ ] Truy cập được `http://localhost:5173`

### Test:
- [ ] Backend health check: `http://localhost:3001/api/health` ✅
- [ ] Dashboard API: `http://localhost:3001/api/dashboard` ✅
- [ ] Frontend: `http://localhost:5173` ✅
- [ ] Login page hiển thị ✅
- [ ] Các trang khác có thể navigate ✅

---

## 🚀 QUICK START (TL;DR)

```bash
# 1. Setup Database
mysql -u root -p -e "CREATE DATABASE warehouse_ai;"

# 2. Setup Backend
cd backend
npm install
echo 'DATABASE_URL="mysql://root:@localhost:3306/warehouse_ai"' > .env
npm run db:push
npm run dev &  # Chạy background

# 3. Setup Frontend
cd ..
npm install
npm run dev &  # Chạy background

# 4. Test
# Mở browser: http://localhost:5173
```

---

**Chúc bạn chạy thử thành công! 🎉**

**Nếu gặp vấn đề, hãy check phần Troubleshooting hoặc liên hệ team phát triển.**

---

**Cập nhật lần cuối:** 16/07/2026  
**Phiên bản:** 1.0.0  
**Tác giả:** AI Assistant