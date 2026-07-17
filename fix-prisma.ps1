# Fix Prisma Client Script
# Chạy trong PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔧 FIX LỖI PRISMA CLIENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Bước 1: Dừng backend
Write-Host "[1/5] Dừng backend (nếu đang chạy)..." -ForegroundColor Yellow
Write-Host "Nhấn Ctrl+C trong terminal backend nếu đang chạy" -ForegroundColor Gray
Write-Host ""

# Bước 2: Generate Prisma Client
Write-Host "[2/5] Đang generate Prisma Client..." -ForegroundColor Yellow
Set-Location backend
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Lỗi khi generate Prisma Client" -ForegroundColor Red
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

# Bước 3: Push schema
Write-Host ""
Write-Host "[3/5] Đang push schema vào database..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Lỗi khi push schema" -ForegroundColor Red
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

# Bước 4: Seed data
Write-Host ""
Write-Host "[4/5] Đang seed dữ liệu mẫu..." -ForegroundColor Yellow
node src/seed.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Lỗi khi seed data" -ForegroundColor Red
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

# Bước 5: Start backend
Write-Host ""
Write-Host "[5/5] Đang khởi động backend..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ HOÀN TẤT! Backend đang chạy..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Bây giờ hãy:" -ForegroundColor Cyan
Write-Host "1. Mở terminal mới (Terminal 2)" -ForegroundColor White
Write-Host "2. Chạy: npm run dev" -ForegroundColor White
Write-Host "3. Mở trình duyệt: http://localhost:5173/bin-location" -ForegroundColor White
Write-Host "4. Nhấn Ctrl+F5 để refresh" -ForegroundColor White
Write-Host ""
Write-Host "Nhấn Ctrl+C để dừng backend khi cần" -ForegroundColor Gray
Write-Host ""

# Start backend
npm start