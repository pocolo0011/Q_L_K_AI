@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 FIX LỖI PRISMA CLIENT
echo ========================================
echo.

echo [1/5] Dừng backend (nếu đang chạy)...
echo Nhấn Ctrl+C trong terminal backend rồi tiếp tục...
echo.
pause

echo.
echo [2/5] Đang generate Prisma Client...
cd backend
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Lỗi khi generate Prisma Client
    pause
    exit /b 1
)

echo.
echo [3/5] Đang push schema vào database...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Lỗi khi push schema
    pause
    exit /b 1
)

echo.
echo [4/5] Đang seed dữ liệu mẫu...
call node src/seed.js
if %errorlevel% neq 0 (
    echo ❌ Lỗi khi seed data
    pause
    exit / 1
)

echo.
echo [5/5] Đang khởi động backend...
echo.
echo ========================================
echo ✅ HOÀN TẤT! Backend đang chạy...
echo ========================================
echo.
echo Bây giờ hãy:
echo 1. Mở terminal mới
echo 2. Chạy: npm run dev
echo 3. Mở trình duyệt: http://localhost:5173/bin-location
echo 4. Nhấn Ctrl+F5 để refresh
echo.
echo Nhấn Ctrl+C để dừng backend khi cần
echo.

call npm start