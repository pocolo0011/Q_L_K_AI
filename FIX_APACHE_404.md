# 🔧 Fix Lỗi 404 Khi Chạy Trên Apache/XAMPP

**Vấn đề:** Apache trả về 404 khi truy cập http://localhost/kho-ai/

**Nguyên nhân:** 
1. mod_rewrite chưa được bật
2. Apache chưa được cấu hình cho phép .htaccess

---

## 🎯 GIẢI PHÁP 1: Dùng Vite Dev Server (Đơn giản nhất)

```bash
# Frontend đang chạy ở port 5173
# Truy cập: http://localhost:5173

# Không cần config gì thêm, đã hoạt động!
```

**Ưu điểm:**
- ✅ Không cần build lại
- ✅ Hot reload
- ✅ Không cần config Apache
- ✅ Dễ debug

---

## 🎯 GIẢI PHÁP 2: Fix Apache (Nếu muốn dùng port 80)

### Bước 1: Mở XAMPP Control Panel

```
1. Click "Config" bên cạnh Apache
2. Click "httpd.conf"
3. File Notepad sẽ mở
```

### Bước 2: Bật mod_rewrite

Trong file `httpd.conf`, tìm dòng:

```apache
#LoadModule rewrite_module modules/mod_rewrite.so
```

**Bỏ dấu #** để thành:

```apache
LoadModule rewrite_module modules/mod_rewrite.so
```

### Bước 3: Cấu hình AllowOverride

Tìm đoạn này trong `httpd.conf`:

```apache
<Directory "C:/xampp/htdocs">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

**Thay đổi** `AllowOverride None` thành `AllowOverride All`:

```apache
<Directory "C:/xampp/htdocs">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

### Bước 4: Lưu và Restart Apache

```
1. Lưu file httpd.conf (Ctrl+S)
2. Quay lại XAMPP Control Panel
3. Click "Stop" bên cạnh Apache
4. Click "Start" để khởi động lại
```

### Bước 5: Test lại

```
Mở browser: http://localhost/kho-ai/
```

---

## 🎯 GIẢI PHÁP 3: Kiểm tra file .htaccess

### Cách 1: Dùng file .htaccess đơn giản (không có RewriteBase)

Tạo file mới `C:\xampp\htdocs\kho-ai\.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /kho-ai/index.html [L]
</IfModule>
```

### Cách 2: Hoặc bỏ qua .htaccess, dùng index.html trực tiếp

```
Truy cập: http://localhost/kho-ai/index.html
```

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: "Forbidden" hoặc "Permission denied"

**Nguyên nhân:** Apache không có quyền đọc thư mục

**Giải pháp:**
```bash
# Right-click folder C:\xampp\htdocs\kho-ai
# Properties → Security
# Đảm bảo Users có quyền Read & Execute
```

### Lỗi 2: "Internal Server Error 500"

**Nguyên nhân:** .htaccess có lỗi cú pháp

**Giải pháp:**
```bash
# Rename .htaccess thành .htaccess.backup
# Restart Apache
# Nếu hết lỗi 500, thì .htaccess có vấn đề
# Kiểm tra lại cú pháp
```

### Lỗi 3: Vẫn 404 sau khi fix

**Kiểm tra:**
```bash
# 1. Apache error log
# XAMPP Control Panel → Apache → Logs → error.log

# 2. Test file tồn tại
# Mở browser: http://localhost/kho-ai/index.html
# Nếu thấy trang trắng → File tồn tại, .htaccess có vấn đề
# Nếu vẫn 404 → File chưa copy đúng chỗ
```

---

## ✅ KHUYẾN NGHỊ

### Development:
```bash
# Dùng Vite Dev Server (port 5173)
npm run dev
# → http://localhost:5173
```

### Production/Test:
```bash
# Dùng Apache (port 80)
# 1. Build: npm run build
# 2. Copy: Copy-Item dist C:\xampp\htdocs\kho-ai -Recurse -Force
# 3. Start Apache
# 4. Truy cập: http://localhost/kho-ai/
```

---

## 🚀 QUICK FIX

### Cách nhanh nhất để chạy ngay:

```bash
# 1. Đảm bảo backend đang chạy
cd backend
npm run dev
# → http://localhost:3001

# 2. Mở terminal mới, chạy frontend
npm run dev
# → http://localhost:5173

# 3. Truy cập
# http://localhost:5173
# Hoặc
# http://localhost:5173/products
# http://localhost:5173/orders
# etc.
```

---

**Lưu ý:** Vite Dev Server (port 5173) là cách đơn giản nhất và nên dùng cho development. Chỉ cần dùng Apache khi cần test production build.

---

**Cập nhật:** 16/07/2026