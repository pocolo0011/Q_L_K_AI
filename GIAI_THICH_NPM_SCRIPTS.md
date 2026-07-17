# 📚 Giải Thích Các Lệnh NPM Trong Dự Án KHO AI

**Ngày tạo:** 16/07/2026  
**Mục đích:** Giải thích chi tiết các lệnh npm thường dùng trong dự án

---

## 📋 MỤC LỤC

1. [npm run dev là gì?](#npm-run-dev-là-gì)
2. [Các Scripts trong Frontend](#các-scripts-trong-frontend)
3. [Các Scripts trong Backend](#các-scripts-trong-backend)
4. [Tại sao cần 2 terminal?](#tại-sao-cần-2-terminal)
5. [So sánh các lệnh](#so-sánh-các-lệnh)

---

## 🚀 npm run dev LÀ GÌ?

### Định nghĩa đơn giản:

`npm run dev` là lệnh để **chạy ứng dụng ở chế độ development** (phát triển).

### Nó làm gì?

```
npm run dev
    ↓
Đọc file package.json
    ↓
Tìm script có tên "dev"
    ↓
Chạy lệnh được định nghĩa trong script
```

### Trong dự án này:

**Frontend:**
```json
"scripts": {
  "dev": "vite"
}
```
→ Chạy `npm run dev` = Chạy `vite` = Khởi động Vite dev server

**Backend:**
```json
"scripts": {
  "dev": "npx nodemon src/index.js"
}
```
→ Chạy `npm run dev` = Chạy `npx nodemon src/index.js` = Khởi động Express server với nodemon

---

## 🎨 CÁC SCRIPTS TRONG FRONTEND

**File:** `package.json` (root directory)

### 1. npm run dev
```json
"dev": "vite"
```

**Chức năng:**
- Khởi động Vite development server
- Hot reload khi có thay đổi code
- Source maps để debug
- Fast refresh cho React components

**Output:**
```
VITE v5.0.0  ready in 549 ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Khi nào dùng:**
- Khi đang phát triển (development)
- Muốn xem thay đổi real-time
- Debug code

**Port:** 5173 (mặc định)

---

### 2. npm run build
```json
"build": "vite build"
```

**Chức năng:**
- Build ứng dụng cho production
- Minify CSS/JS
- Optimize images
- Tạo thư mục `dist/` chứa files đã build

**Output:**
```
vite v5.0.0 building for production...
✓ 1234 modules transformed.
dist/index.html                   0.46 kB
dist/assets/index-abc123.css      45.23 kB
dist/assets/index-xyz789.js       234.56 kB
```

**Khi nào dùng:**
- Khi deploy lên server
- Khi cần test production build

**Output folder:** `dist/`

---

### 3. npm run preview
```json
"preview": "vite preview"
```

**Chức năng:**
- Preview production build
- Chạy local server để test file đã build

**Khi nào dùng:**
- Sau khi chạy `npm run build`
- Muốn test xem build có lỗi không

**Cách dùng:**
```bash
npm run build
npm run preview
# Mở browser: http://localhost:4173
```

---

## ⚙️ CÁC SCRIPTS TRONG BACKEND

**File:** `backend/package.json`

### 1. npm run dev
```json
"dev": "npx nodemon src/index.js"
```

**Chức năng:**
- Khởi động Express server
- **Tự động restart** khi có thay đổi code (nhờ nodemon)
- Load environment variables từ `.env`

**Output:**
```
[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] starting `node src/index.js`
🚀 KHO AI Backend running on http://localhost:3001
```

**Khi nào dùng:**
- Khi đang phát triển backend
- Muốn auto-reload khi thay đổi code

**Port:** 3001 (được định nghĩa trong `.env`)

**Lưu ý:** 
- `npx nodemon` = Chạy nodemon mà không cần cài đặt global
- Nodemon sẽ **tự động restart** server khi bạn lưu file `.js`

---

### 2. npm start
```json
"start": "node src/index.js"
```

**Chức năng:**
- Chạy server ở chế độ production
- **Không có auto-reload**
- Nhanh hơn `npm run dev` vì không có nodemon

**Khi nào dùng:**
- Khi deploy lên server
- Khi chạy production

**Cách dùng:**
```bash
npm start
# Server chạy tại http://localhost:3001
# Nhấn Ctrl+C để dừng
```

---

### 3. npm run db:push
```json
"db:push": "npx prisma db push"
```

**Chức năng:**
- Đẩy schema từ `schema.prisma` vào database
- Tạo tables, columns, relationships
- **Không tạo migration files**

**Khi nào dùng:**
- Khi thay đổi schema.prisma
- Khi setup database lần đầu
- Development (nhanh, không cần migration)

**Output:**
```
Prisma schema pushed to database in 123ms
```

---

### 4. npm run db:migrate
```json
"db:migrate": "npx prisma migrate dev --name init"
```

**Chức năng:**
- Tạo migration files (SQL files)
- Apply migrations vào database
- **Khuyến nghị cho production**

**Khi nào dùng:**
- Khi cần version control cho database changes
- Khi deploy lên production
- Team development (mỗi người chạy migration)

**Output:**
```
Prisma migration 'init' applied successfully
```

---

### 5. npm run db:seed
```json
"db:seed": "node src/seed.js"
```

**Chức năng:**
- Chạy file `seed.js` để insert data mẫu vào database
- Thêm users, products, suppliers, orders mẫu

**Khi nào dùng:**
- Sau khi setup database
- Muốn có data để test

**Lưu ý:** File `seed.js` chưa được tạo (cần implement)

---

### 6. npm run db:studio
```json
"db:studio": "npx prisma studio"
```

**Chức năng:**
- Mở Prisma Studio (GUI để xem/edit database)
- Chạy tại `http://localhost:5555`

**Khi nào dùng:**
- Muốn xem data trong database
- Muốn edit data trực tiếp
- Debug database

**Output:**
```
Prisma Studio is up at http://localhost:5555
```

---

## 🔄 TẠI SAO CẦN 2 TERMINAL?

### Vấn đề:

Frontend và Backend là **2 ứng dụng riêng biệt**:
- Frontend: Chạy trên port 5173 (Vite)
- Backend: Chạy trên port 3001 (Express)

### Giải pháp:

Cần **2 terminal** (hoặc 2 cửa sổ terminal):

```
Terminal 1 (Backend):
cd backend
npm run dev
→ Server chạy tại http://localhost:3001

Terminal 2 (Frontend):
cd .
npm run dev
→ Server chạy tại http://localhost:5173
```

### Tại sao không chạy chung 1 lần?

Vì:
1. **Khác port:** 5173 vs 3001
2. **Khác công nghệ:** Vite vs Express
3. **Khác thư mục:** Root vs backend/
4. **Độc lập:** Có thể chạy 1 trong 2

---

## 📊 SO SÁNH CÁC LỆNH

### Frontend:

| Lệnh | Mục đích | Port | Auto-reload | Khi nào dùng |
|------|----------|------|--------------|--------------|
| `npm run dev` | Development | 5173 | ✅ Có | Phát triển, debug |
| `npm run build` | Build production | - | ❌ | Deploy |
| `npm run preview` | Preview build | 4173 | ❌ | Test production build |

### Backend:

| Lệnh | Mục đích | Port | Auto-reload | Khi nào dùng |
|------|----------|------|--------------|--------------|
| `npm run dev` | Development | 3001 | ✅ Có (nodemon) | Phát triển |
| `npm start` | Production | 3001 | ❌ | Deploy |
| `npm run db:push` | Update schema | - | ❌ | Thay đổi DB schema |
| `npm run db:migrate` | Run migrations | - | ❌ | Production DB update |
| `npm run db:seed` | Seed data | - | ❌ | Thêm data mẫu |
| `npm run db:studio` | Open Prisma Studio | 5555 | ❌ | Xem/edit database |

---

## 🎯 WORKFLOW THƯỜNG NGÀY

### Khi phát triển (Development):

```bash
# Terminal 1: Backend
cd backend
npm run dev
# → Server chạy, auto-reload khi thay đổi code

# Terminal 2: Frontend
npm run dev
# → Vite chạy, hot reload khi thay đổi code

# Terminal 3: Database (nếu cần)
npm run db:studio
# → Xem database tại http://localhost:5555
```

### Khi deploy lên production:

```bash
# 1. Build frontend
npm run build
# → Tạo thư mục dist/

# 2. Start backend
cd backend
npm start
# → Chạy production server

# 3. Serve frontend (cần HTTP server)
# Cách 1: Dùng serve
npx serve dist/

# Cách 2: Dùng Nginx/Apache
# Copy thư mục dist/ vào web root
```

---

## 🔍 KIỂM TRA TRẠNG THÁI

### Backend đang chạy không?

```bash
# Cách 1: Check port
netstat -ano | findstr :3001

# Cách 2: Test API
curl http://localhost:3001/api/health

# Cách 3: Xem terminal
# Terminal chạy npm run dev sẽ hiện:
# 🚀 KHO AI Backend running on http://localhost:3001
```

### Frontend đang chạy không?

```bash
# Cách 1: Check port
netstat -ano | findstr :5173

# Cách 2: Mở browser
# Vào: http://localhost:5173

# Cách 3: Xem terminal
# Terminal chạy npm run dev sẽ hiện:
# VITE v5.0.0 ready in 549 ms
# ➜ Local: http://localhost:5173/
```

---

## 🐛 CÁC VẤN ĐỀ THƯỜNG GẶP

### 1. "npm: command not found"

**Nguyên nhân:** Node.js chưa cài hoặc chưa add vào PATH

**Giải pháp:**
```bash
# Kiểm tra cài đặt
node --version
npm --version

# Nếu chưa có, cài Node.js từ: https://nodejs.org/
```

---

### 2. "Cannot find package 'vite'"

**Nguyên nhân:** Chưa chạy `npm install`

**Giải pháp:**
```bash
# Root directory
npm install

# Backend
cd backend
npm install
```

---

### 3. "Port 5173 already in use"

**Nguyên nhân:** Process khác đang dùng port 5173

**Giải pháp:**
```bash
# Windows: Tìm và kill process
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Hoặc đổi port trong vite.config.js
```

---

### 4. "nodemon: command not found"

**Nguyên nhân:** nodemon chưa cài

**Giải pháp:**
```bash
cd backend
npm install
# nodemon sẽ được cài vào node_modules
```

---

### 5. "Database connection failed"

**Nguyên nhân:** MySQL chưa chạy hoặc DATABASE_URL sai

**Giải pháp:**
```bash
# 1. Start MySQL (XAMPP)
# Mở XAMPP Control Panel → Start MySQL

# 2. Check DATABASE_URL trong backend/.env
DATABASE_URL="mysql://root:@localhost:3306/warehouse_ai"

# 3. Test connection
mysql -u root -p
```

---

## 📚 TÀI LIỆU THAM KHẢO

### NPM Scripts:
- [NPM Scripts Documentation](https://docs.npmjs.com/cli/v9/using-npm/scripts)
- [NPM Run Command](https://docs.npmjs.com/cli/v9/commands/npm-run-script)

### Vite:
- [Vite Documentation](https://vitejs.dev/guide/)
- [Vite Config](https://vitejs.dev/config/)

### Nodemon:
- [Nodemon Documentation](https://nodemon.io/)
- [Nodemon Config](https://github.com/remy/nodemon#config-files)

### Prisma:
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Studio](https://www.prisma.io/docs/tools/prisma-studio)

---

## 🎓 TÓM TẮT

### npm run dev là gì?

**Đơn giản:** Lệnh để chạy ứng dụng ở chế độ phát triển với auto-reload.

**Chi tiết:**
- Đọc `package.json`
- Tìm script `"dev"`
- Chạy lệnh được định nghĩa
- **Frontend:** Chạy Vite dev server (port 5173)
- **Backend:** Chạy Express + Nodemon (port 3001)

### Tại sao cần 2 terminal?

Vì frontend và backend là 2 ứng dụng độc lập, chạy trên 2 ports khác nhau.

### Cách dùng:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev

# Truy cập: http://localhost:5173
```

---

## ✅ CHECKLIST

### Trước khi chạy:
- [ ] Đã cài Node.js (>= 16.x)
- [ ] Đã cài MySQL và đang chạy
- [ ] Đã tạo database `warehouse_ai`
- [ ] Đã cấu hình `backend/.env` với DATABASE_URL đúng
- [ ] Đã chạy `npm install` ở cả 2 thư mục (root và backend)

### Khi chạy:
- [ ] Terminal 1: Backend chạy tại port 3001
- [ ] Terminal 2: Frontend chạy tại port 5173
- [ ] Mở browser: http://localhost:5173
- [ ] Test health check: http://localhost:3001/api/health

### Sau khi chạy:
- [ ] Có thể xem Login page
- [ ] Có thể navigate các trang khác
- [ ] Dark mode hoạt động
- [ ] Responsive design hoạt động

---

**Chúc bạn hiểu rõ cách dùng npm scripts! 🎉**

**Nếu có thắc mắc, hãy tham khảo documentation của từng tool hoặc liên hệ team phát triển.**

---

**Cập nhật lần cuối:** 16/07/2026  
**Phiên bản:** 1.0.0  
**Tác giả:** AI Assistant