# Hướng dẫn sử dụng tổng hợp - Hệ thống Quản lý Kho AI

## 📋 Mục lục
1. [Cài đặt hệ thống](#cài-đặt-hệ-thống)
2. [Quản lý Kho](#quản-lý-kho)
3. [Quản lý Vị trí Lưu trữ](#quản-lý-vị-trí-lưu-trữ)
4. [Tìm kiếm sản phẩm](#tìm-kiếm-sản-phẩm)
5. [Các tính năng khác](#các-tính-năng-khác)

---

## 🚀 Cài đặt hệ thống

### Bước 1: Cập nhật Database Schema

```bash
cd backend
npx prisma db push
```

### Bước 2: Seed dữ liệu mẫu

```bash
cd backend
node src/seed.js
```

### Bước 3: Khởi động Backend

```bash
cd backend
npm start
```

### Bước 4: Khởi động Frontend

```bash
npm run dev
```

---

## 🏢 Quản lý Kho

### Truy cập trang
- URL: `http://localhost:5173/warehouses`
- Hoặc click menu "Quản lý Kho" trong Sidebar

### Chức năng

#### 1. Xem danh sách kho
- Hiển thị tất cả các kho trong hệ thống
- Mỗi kho hiển thị: tên, mã, địa chỉ, sức chứa, trạng thái, số dãy
- Click vào kho để xem chi tiết cấu trúc (Dãy → Kệ → Ô)

#### 2. Thêm kho mới
1. Click nút "Thêm Kho mới"
2. Điền thông tin:
   - **Mã Kho** (bắt buộc): Ví dụ WH-HN, WH-HP, WH-CM
   - **Tên Kho** (bắt buộc): Ví dụ Kho Hà Nội
   - **Địa chỉ**: Ví dụ Hà Nội, Việt Nam
   - **Sức chứa**: Số lượng bins tối đa
   - **Trạng thái**: Check nếu kho đang hoạt động
3. Click "Thêm mới"

#### 3. Cập nhật kho
1. Click icon ✏️ (Sửa) trên kho cần cập nhật
2. Chỉnh sửa thông tin
3. Click "Cập nhật"

#### 4. Xóa kho
1. Click icon 🗑️ (Xóa) trên kho cần xóa
2. Xác nhận "Có" để xóa

### Dữ liệu mẫu đã có
- **Kho Hà Nội** (WH-HN): 2 Dãy, 3 Kệ, 30 Bins
- **Kho Hải Phòng** (WH-HP): 1 Dãy, 1 Kệ, 10 Bins
- **Kho Cà Mau** (WH-CM): 1 Dãy, 1 Kệ, 10 Bins

---

## 📦 Quản lý Vị trí Lưu trữ

### Truy cập trang
- URL: `http://localhost:5173/bin-location`
- Hoặc click menu "Vị trí Lưu trữ" trong Sidebar

### Cấu trúc hiển thị

```
┌─────────────────────────────────────────────────────┐
│  Header: Quản lý Vị trí Lưu trữ                    │
│  [Gợi ý AI] [Chuyển 2D/3D] [In nhãn]              │
├──────────────┬──────────────────────────────────────┤
│  Cấu trúc kho│  View 2D - Kệ A-01                   │
│  (30%)       │  (70%)                               │
│              │                                      │
│  [+] Thêm    │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  Kho Hà Nội  │  │ A-01│ │ A-02│ │ A-03│ │ A-04│       │
│    ├─ Dãy A  │  │    │ │    │ │    │ │    │       │
│    │ ├─ Kệ A-01│ └────┘ └────┘ └────┘ └────┘       │
│    │ └─ Kệ A-02│  ...                               │
│    └─ Dãy B  │                                      │
│              │                                      │
│  Chú thích:  │                                      │
│  🟢 Trống    │                                      │
│  🟡 Đang dùng│                                      │
│  🔴 Đầy      │                                      │
└──────────────┴──────────────────────────────────────┘
```

### Chức năng

#### 1. Thêm Dãy mới
1. Click nút "+" ở góc trên bên trái
2. Chọn tab "Thêm Dãy"
3. Điền:
   - **Mã Dãy**: Ví dụ C, D, E
   - **Tên Dãy**: Ví dụ Dãy C, Dãy D
   - **Mô tả**: (tùy chọn)
4. Click "Thêm Dãy"

#### 2. Thêm Kệ mới
1. Click nút "+" ở góc trên bên trái
2. Chọn tab "Thêm Kệ"
3. Điền:
   - **Dãy cha**: Chọn dãy từ dropdown
   - **Mã Kệ**: Ví dụ C-01, C-02
   - **Tên Kệ**: Ví dụ Kệ C-01
   - **Số lượng Ô mặc định**: Số bins sẽ tạo (1-100)
4. Click "Thêm Kệ"
5. Hệ thống tự động tạo hàng loạt bins

#### 3. Xem chi tiết Kệ
1. Click vào tên kệ trong cây thư mục bên trái
2. Hệ thống load danh sách bins của kệ đó
3. Hiển thị grid view bên phải

#### 4. Drag & Drop sản phẩm
1. Click và giữ vào bin có sản phẩm (có icon GripVertical)
2. Kéo sang bin trống (màu xanh lá)
3. Thả để di chuyển
4. Hệ thống tự động cập nhật database

**Lưu ý:**
- Chỉ có thể kéo từ bin có sản phẩm
- Bin đích phải trống
- Sau khi di chuyển, bin nguồn sẽ trống, bin đích sẽ có sản phẩm

#### 5. Gợi ý vị trí tối ưu bằng AI
1. Click nút "Gợi ý vị trí tối ưu bằng AI" (màu tím)
2. Hệ thống sẽ:
   - Tìm các ô trống
   - Highlight ô phù hợp nhất (viền tím)
   - Hiển thị thông báo
3. Highlight tự động biến sau 3 giây

#### 6. In nhãn kệ
1. Chọn kệ cần in nhãn
2. Click nút "In nhãn kệ"
3. Hệ thống mở cửa sổ in mới
4. Chọn máy in và in

### Màu sắc biểu thị

| Màu | Trạng thái | Mô tả |
|-----|-----------|-------|
| 🟢 Xanh lá | Trống | Không có sản phẩm |
| 🟡 Vàng | Đang dùng | Có sản phẩm (< 90% dung tích) |
| 🔴 Đỏ | Đầy | Gần đầy hoặc đầy (≥ 90% dung tích) |

---

## 🔍 Tìm kiếm sản phẩm

### Cách tìm kiếm

#### Phương pháp 1: Từ trang Products
1. Vào trang "Sản phẩm"
2. Dùng ô search để tìm sản phẩm
3. Click vào sản phẩm để xem chi tiết
4. Trong chi tiết sản phẩm sẽ thấy vị trí lưu trữ

#### Phương pháp 2: Từ trang Inventory
1. Vào trang "Quản lý Tồn kho"
2. Search sản phẩm
3. Xem cột "Vị trí" để biết bin code

#### Phương pháp 3: API trực tiếp (cho developer)
```javascript
// Gọi API
GET /api/products/search?q=iPhone

// Kết quả trả về
{
  "products": [
    {
      "code": "SP001",
      "nameVi": "iPhone 15",
      "totalQuantity": 45,
      "locations": [
        {
          "warehouse": "Kho Hà Nội",
          "zone": "Dãy A",
          "shelf": "Kệ A-01",
          "bin": "A-01-01",
          "quantity": 45,
          "capacity": 100,
          "percentage": 45
        }
      ]
    }
  ]
}
```

### Hiểu kết quả tìm kiếm

Kết quả hiển thị đầy đủ đường dẫn:
```
Kho Hà Nội → Dãy A → Kệ A-01 → Ô A-01-01
```

Thông tin chi tiết:
- **Warehouse**: Tên kho
- **Zone**: Tên dãy
- **Shelf**: Tên kệ
- **Bin**: Mã ô lưu trữ
- **Quantity**: Số lượng hiện tại
- **Capacity**: Dung tích tối đa
- **Percentage**: Phần trăm sử dụng

---

## 📊 Các tính năng khác

### Dashboard
- Xem tổng quan: tổng sản phẩm, đơn hàng, doanh thu, cảnh báo
- Biểu đồ biến động tồn kho 30 ngày
- Top 5 sản phẩm bán chạy
- Sản phẩm sắp hết hạn
- Tồn kho thấp

### Quản lý Sản phẩm
- Thêm/sửa/xóa sản phẩm
- Tìm kiếm theo tên, mã, danh mục
- Quản lý giá, tồn kho tối thiểu

### Quản lý Tồn kho
- Xem danh sách tồn kho
- Cập nhật số lượng
- Theo dõi lô, hạn sử dụng

### Đơn hàng
- Tạo đơn hàng
- Theo dõi trạng thái
- Quản lý khách hàng

### Nhà cung cấp
- Quản lý thông tin NCC
- Theo dõi lịch sử giao hàng

### Nhân viên
- Quản lý tài khoản
- Phân quyền

### Báo cáo
- Báo cáo tồn kho
- Báo cáo doanh thu
- Báo cáo xuất nhập

---

## 🔧 API Endpoints

### Warehouses
```
GET    /api/warehouses          - Danh sách kho
GET    /api/warehouses/:id      - Chi tiết kho
POST   /api/warehouses          - Tạo kho mới
PUT    /api/warehouses/:id      - Cập nhật kho
DELETE /api/warehouses/:id      - Xóa kho
```

### Zones
```
GET    /api/zones               - Danh sách dãy
GET    /api/zones/:id           - Chi tiết dãy
POST   /api/zones               - Tạo dãy mới
PUT    /api/zones/:id           - Cập nhật dãy
DELETE /api/zones/:id           - Xóa dãy
```

### Shelves
```
GET    /api/shelves             - Danh sách kệ
GET    /api/shelves/:id         - Chi tiết kệ
POST   /api/shelves             - Tạo kệ mới
POST   /api/shelves/:id/bins    - Tạo bins cho kệ
PUT    /api/shelves/:id         - Cập nhật kệ
DELETE /api/shelves/:id         - Xóa kệ
```

### Bins
```
GET    /api/bins                - Danh sách ô lưu trữ
GET    /api/bins/:id            - Chi tiết ô
PUT    /api/bins/:id            - Cập nhật ô
```

### Products Search
```
GET    /api/products/search?q=...  - Tìm kiếm sản phẩm có vị trí
```

---

## 💡 Tips sử dụng

### 1. Quản lý nhiều kho
- Mỗi kho có cấu trúc độc lập: Zone → Shelf → Bin
- Mã bin tự động: `{Mã Kệ}-{Số thứ tự}` (VD: A-01-01, A-01-02)
- Có thể thêm dãy/kệ cho từng kho riêng biệt

### 2. Tìm mặt hàng nhanh
- Dùng search ở trang Products
- Xem chi tiết sản phẩm để biết vị trí
- Hoặc dùng API `/api/products/search?q={tên/mã}`

### 3. Di chuyển hàng hóa
- Chỉ cần kéo thả trong trang Bin Location
- Hệ thống tự động cập nhật số lượng
- Không cần nhập liệu thủ công

### 4. In nhãn
- Chọn kệ cần in
- Click "In nhãn kệ"
- Chọn máy in và in ra
- Dán lên kệ thực tế

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi kết nối database
```bash
# Kiểm tra MySQL đã chạy chưa
# XAMPP Control Panel → Start MySQL
```

### Lỗi Prisma
```bash
# Regenerate Prisma Client
cd backend
npx prisma generate
```

### Lỗi port đã được sử dụng
```bash
# Đổi port trong backend/.env
PORT=3002
```

### Không thấy dữ liệu mới
```bash
# Chạy lại seed
cd backend
node src/seed.js
```

---

## 📞 Hỗ trợ

Nếu có vấn đề, vui lòng kiểm tra:
1. Backend server đã chạy chưa (http://localhost:3001)
2. MySQL đã kết nối được chưa
3. Prisma schema đã push chưa
4. Seed data đã chạy chưa
5. Frontend đã chạy chưa (http://localhost:5173)

---

## 🎯 Tính năng mở rộng (Future)

- [ ] Tích hợp QR Code thực sự cho in nhãn
- [ ] View 3D với Three.js
- [ ] AI gợi ý thông minh hơn (theo danh mục, tần suất)
- [ ] Import/Export cấu trúc kho từ Excel
- [ ] Lịch sử di chuyển sản phẩm
- [ ] Thống kê mức độ sử dụng kệ
- [ ] Mobile app quét mã vạch
- [ ] Chuyển hàng giữa các kho

---

## 📝 Ghi chú

- Warehouse ID hiện tại hardcoded là 'default' trong BinLocation, cần lấy từ context thực tế
- Chức năng 3D đang phát triển
- AI suggestion hiện tại đơn giản, có thể mở rộng với machine learning
- Product ID đang dùng mã code, có thể thay bằng tên sản phẩm

---

**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2026-01-17  
**Tác giả**: KHO AI Team