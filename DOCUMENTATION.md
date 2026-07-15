# Tài Liệu Hệ Thống KHO AI - Quản Lý Kho Thông Minh

## 📋 Mục Lục
1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Cấu Trúc Ứng Dụng](#cấu-trúc-ứng-dụng)
3. [Chi Tiết Từng Màn Hình](#chi-tiết-từng-màn-hình)
4. [Phân Quyền Người Dùng](#phân-quyền-người-dùng)
5. [Luồng Nghiệp Vụ Chính](#luồng-nghiệp-vụ-chính)

---

## 🎯 Tổng Quan Hệ Thống

**KHO AI** là hệ thống quản lý kho hàng thông minh, tích hợp AI để tối ưu hóa hoạt động kinh doanh. Hệ thống cung cấp các tính năng:

- ✅ Quản lý sản phẩm và tồn kho real-time
- ✅ Tối ưu vị trí lưu trữ với AI
- ✅ Quản lý đơn hàng và nhà cung cấp
- ✅ Báo cáo & phân tích chuyên sâu
- ✅ Phân quyền chi tiết theo vai trò
- ✅ Dark mode & responsive design

**Công nghệ sử dụng:**
- Frontend: React 18 + Vite
- Styling: Tailwind CSS
- Icons: Lucide React
- Routing: React Router v6
- Charts: Recharts

---

## 🏗️ Cấu Trúc Ứng Dụng

```
src/
├── components/          # Components tái sử dụng
│   ├── Header.jsx      # Header chính
│   ├── Sidebar.jsx     # Sidebar navigation
│   ├── KPICards.jsx    # KPI cards cho Dashboard
│   ├── InventoryChart.jsx  # Line chart tồn kho
│   ├── TopProducts.jsx # Top 5 sản phẩm bán chạy
│   ├── ExpiringProducts.jsx # Sản phẩm sắp hết hạn
│   └── LowInventory.jsx # Sản phẩm tồn kho thấp
├── pages/              # Các trang chính
│   ├── Login.jsx       # Trang đăng nhập
│   ├── Dashboard.jsx   # Dashboard chính
│   ├── Products.jsx    # Quản lý sản phẩm
│   ├── ProductDetail.jsx # Chi tiết sản phẩm
│   ├── InventoryManagement.jsx # Quản lý tồn kho
│   ├── CreateStockIn.jsx # Tạo phiếu nhập kho
│   ├── BinLocation.jsx # Quản lý vị trí lưu trữ
│   ├── Orders.jsx      # Quản lý đơn hàng
│   ├── Suppliers.jsx   # Quản lý nhà cung cấp
│   ├── Employees.jsx   # Quản lý nhân viên
│   ├── Profile.jsx     # Cài đặt tài khoản
│   ├── Settings.jsx    # Cài đặt hệ thống
│   └── Reports.jsx     # Báo cáo & thống kê
├── contexts/
│   └── ThemeContext.jsx # Quản lý dark mode
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

---

## 📱 Chi Tiết Từng Màn Hình

### 1. 🔐 Trang Đăng Nhập (Login)

**Route:** `/login`

**Mô tả:** Trang đăng nhập cho người dùng, hỗ trợ đăng nhập bằng email hoặc số điện thoại.

**Layout:**
- **Desktop (lg+):** 2 cột
  - Cột trái (50%): Branding với gradient xanh dương, logo, slogan, tính năng nổi bật
  - Cột phải (50%): Form đăng nhập
- **Mobile:** Chỉ hiển thị form đăng nhập

**Các thành phần:**

#### Form Đăng Nhập
```
┌─────────────────────────────────────┐
│  Đăng nhập                          │
│  Chào mừng bạn quay trở lại!        │
├─────────────────────────────────────┤
│  [Email] [Số điện thoại]  ← Toggle  │
│                                     │
│  Email/SĐT Input                    │
│  ┌─────────────────────────────┐    │
│  │ 📧 your@email.com           │    │
│  └─────────────────────────────┘    │
│                                     │
│  Mật khẩu                           │
│  ┌─────────────────────────────┐    │
│  │ 🔒 Nhập mật khẩu    👁️     │    │
│  └─────────────────────────────┘    │
│                                     │
│  ☑ Ghi nhớ đăng nhập               │
│  Quên mật khẩu?                     │
│                                     │
│  [     ĐĂNG NHẬP     ] ← Button     │
│                                     │
│  ─────── Hoặc đăng nhập với ──────  │
│                                     │
│  [Google]  [Zalo]                   │
│                                     │
│  Chưa có tài khoản?                 │
│  Đăng ký dùng thử miễn phí         │
└─────────────────────────────────────┘
```

**Các nút và chức năng:**
- **Toggle Email/Phone:** Chuyển đổi giữa đăng nhập bằng email hoặc SĐT
- **Show/Hide Password:** Hiển thị/ẩn mật khẩu (icon Eye/EyeOff)
- **Checkbox "Ghi nhớ đăng nhập":** Lưu thông tin đăng nhập
- **Link "Quên mật khẩu?":** Chuyển đến trang quên mật khẩu
- **Button "Đăng nhập":** Submit form đăng nhập
- **Button "Google":** Đăng nhập bằng Google OAuth
- **Button "Zalo":** Đăng nhập bằng Zalo OAuth
- **Link "Đăng ký dùng thử miễn phí":** Chuyển đến trang đăng ký

---

### 2. 📊 Dashboard (Trang Chủ)

**Route:** `/`

**Mô tả:** Trang tổng quan với các chỉ số KPI, biểu đồ và thông tin quan trọng.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo | Search Bar | 🔔 Badge | 👤 Avatar | 🌙   │
├──────────┬──────────────────────────────────────────────┤
│          │  Row 1: 4 KPI Cards (grid 4 cột)            │
│ Sidebar  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│ 250px    │  │ KPI│ │ KPI│ │ KPI│ │ KPI│              │
│          │  └────┘ └────┘ └────┘ └────┘              │
│ Dashboard│                                              │
│ Products │  Row 2: Chart + Top Products (70/30)        │
│ Inventory│  ┌──────────────┬─────────────┐             │
│ Bin Loc  │  │ Line Chart   │ Top 5 Sản   │             │
│ Orders   │  │ 30 ngày      │ phẩm bán    │             │
│ Suppliers│  │              │ chạy         │             │
│ Employees│  └──────────────┴─────────────┘             │
│ Reports  │                                              │
│ Profile  │  Row 3: 2 Tables (50/50)                    │
│ Settings │  ┌────────────────┬────────────────┐        │
│          │  │ Sắp hết hạn    │ Tồn kho thấp  │        │
│          │  │ (5-7 dòng)     │ (5-7 dòng)     │        │
│          │  └────────────────┴────────────────┘        │
└──────────┴──────────────────────────────────────────────┘
```

**Các thành phần chính:**

#### KPI Cards (4 cards)
1. **Tổng sản phẩm** (Package icon - xanh dương)
   - Số lượng: 12,847
   - Thay đổi: +12.5% (xanh lá)
   
2. **Đơn hàng hôm nay** (ShoppingCart icon - xanh lá)
   - Số lượng: 1,234
   - Thay đổi: +8.2% (xanh lá)
   
3. **Doanh thu tháng** (TrendingUp icon - tím)
   - Giá trị: ₫2.4B
   - Thay đổi: +23.1% (xanh lá)
   
4. **Cảnh báo tồn kho** (AlertTriangle icon - cam)
   - Số lượng: 23
   - Thay đổi: -5.3% (đỏ)

#### Line Chart
- **Tiêu đề:** "Biến động tồn kho 30 ngày"
- **Dữ liệu:** 7 điểm từ 01/11 đến 30/11
- **Màu:** Đường xanh dương (#007BFF)
- **Interactive:** Tooltip khi hover

#### Top 5 Sản phẩm bán chạy
- **Tiêu đề:** "Top 5 sản phẩm bán chạy" (Trophy icon)
- **Hiển thị:** Rank, Tên SP, % bán, Số lượng đã bán
- **Màu rank:** Vàng (1), Xám (2), Cam (3), Xanh (4-5)

#### Bảng Sản phẩm sắp hết hạn
- **Cột:** Sản phẩm | Lô | HSD | Còn lại | SL
- **Badge màu:** Đỏ (≤3 ngày), Cam (≤5 ngày), Vàng (>5 ngày)

#### Bảng Tồn kho thấp
- **Cột:** Sản phẩm | SKU | Tồn kho | Tối thiểu | Trạng thái
- **Progress bar:** Hiển thị % so với mức tối thiểu

---

### 3. 📦 Quản Lý Sản Phẩm (Products)

**Route:** `/products`

**Mô tả:** Danh sách tất cả sản phẩm với khả năng tìm kiếm, lọc và xem chi tiết.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Quản lý Sản phẩm | [+ Thêm sản phẩm]           │
├─────────────────────────────────────────────────────────┤
│ Filter Bar:                                             │
│ [Tìm kiếm...] [Danh mục ▼] [Trạng thái ▼]             │
├─────────────────────────────────────────────────────────┤
│ Table:                                                  │
│ Mã SP | Tên SP | Danh mục | Giá bán | Tồn | Status | ⚙️│
│ ─────────────────────────────────────────────────────── │
│ SP001 | iPhone  | Điện tử  | 25tr    | 45  | Active | 👁️✏️🗑│
│ SP002 | Samsung | Điện tử  | 22tr    | 8   | Low    | 👁️✏️🗑│
│ ...                                                    │
│                                                         │
│ Pagination: Trước | 1 | Sau                            │
└─────────────────────────────────────────────────────────┘
```

**Các nút và chức năng:**

#### Header
- **Button "+ Thêm sản phẩm":** Chuyển đến trang tạo sản phẩm mới

#### Filter Bar
- **Search Input:** Tìm kiếm theo mã SP hoặc tên sản phẩm
- **Dropdown "Danh mục":** Lọc theo danh mục (Điện tử, Thực phẩm, Mỹ phẩm, Khác)
- **Dropdown "Trạng thái":** Lọc theo trạng thái (Active/Inactive)

#### Table Actions (mỗi row)
- **Eye icon (Xem):** Xem chi tiết sản phẩm → `/products/:code`
- **Edit icon (Sửa):** Chỉnh sửa thông tin sản phẩm
- **Delete icon (Xóa):** Xóa sản phẩm (có confirm)

#### Click vào tên sản phẩm
- Chuyển đến trang **Product Detail**

---

### 4. 🔍 Chi Tiết Sản Phẩm (Product Detail)

**Route:** `/products/:code`

**Mô tả:** Hiển thị thông tin chi tiết sản phẩm với 4 tabs.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Chi tiết Sản phẩm | [✏️ Chỉnh sửa] [🖨️ In] [🗑️]│
│ Mã SP: SP001                                            │
├─────────────────────────────────────────────────────────┤
│ [Thông tin] [Tồn kho] [Lịch sử] [Tài liệu]             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Tab Content (thay đổi theo tab đang active)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Tab 1: Thông tin chung
**Layout 2 cột:**
- **Cột trái (1/3):** Ảnh sản phẩm + Upload button
- **Cột phải (2/3):** Form thông tin

**Form fields:**
- Mã sản phẩm (readonly)
- Tên sản phẩm (editable)
- Danh mục (dropdown)
- Đơn vị tính (input)
- Barcode/QR (input + scan button)
- Trạng thái (Active/Inactive dropdown)
- Giá vốn (input với $ icon)
- Giá bán (input với $ icon)
- Hạn sử dụng mặc định (input)
- Lot tracking (checkbox)

#### Tab 2: Tồn kho theo kho
**Bảng:**
- Kho | Tồn thực tế | Tồn khả dụng | Vị trí

#### Tab 3: Lịch sử nhập - xuất
**Filters:**
- Khoảng thời gian (7/30/90 ngày, 1 năm)
- Loại giao dịch (Tất cả/Nhập/Xuất)

**Table:**
- Loại (icon + text màu)
- Ngày
- Số lượng
- Mã phiếu
- Kho

#### Tab 4: Hình ảnh & Tài liệu
- Grid upload hình ảnh
- Danh sách tài liệu PDF với download button

**Action Buttons (Header):**
- **Chỉnh sửa:** Toggle edit mode cho form
- **In mã vạch:** In barcode/QR code
- **Xóa:** Xóa sản phẩm (màu đỏ)

---

### 5. 📥 Quản Lý Tồn Kho (Inventory Management)

**Route:** `/inventory`

**Mô tả:** Quản lý tồn kho toàn hệ thống với khả năng nhập/xuất/kiểm kê.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Quản lý Tồn kho                                 │
│ [+ Nhập kho mới] [Xuất kho mới] [Kiểm kê ngay]         │
├─────────────────────────────────────────────────────────┤
│ Filters: [Kho ▼] [Danh mục ▼] [Trạng thái ▼]          │
│         [Tìm kiếm...] [📷 Scan]                         │
├─────────────────────────────────────────────────────────┤
│ Table (Desktop) / Cards (Mobile)                        │
│ ☐ | Mã | Tên | Kho | Vị trí | Thực tế | Khả dụng | ...│
│ ─────────────────────────────────────────────────────── │
│ ☐ | SP001 | iPhone | HN | A-01-02 | 45 | 42 | ...    │
│                                                         │
│ Pagination                                              │
└─────────────────────────────────────────────────────────┘
```

**Row Colors (theo trạng thái):**
- 🟢 Xanh lá: Bình thường
- 🟡 Vàng: Thấp
- 🔴 Đỏ: Nguy cấp

**Action Buttons:**
- **Eye:** Xem chi tiết
- **Edit:** Chỉnh sửa
- **Delete:** Xóa

**Mobile Cards:**
- Hiển thị dạng card thay vì table
- Mỗi card có đầy đủ thông tin
- Action buttons ở dưới cùng

---

### 6. ➕ Tạo Phiếu Nhập Kho (Create Stock In)

**Route:** `/inventory/create`

**Mô tả:** Tạo phiếu nhập kho mới với danh sách sản phẩm.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Nhập kho mới                                   │
├─────────────────────────────────────────────────────────┤
│ Summary Cards:                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│ │ Tổng SP  │ │ Tổng SL  │ │ Tổng tiền│                 │
│ │   5      │ │  150     │ │ 50tr     │                 │
│ └──────────┘ └──────────┘ └──────────┘                 │
├─────────────────────────────────────────────────────────┤
│ Product List:                                           │
│ ┌──────────────────────────────────────────────────┐   │
│ │ + Thêm sản phẩm                                  │   │
│ ├──────────────────────────────────────────────────┤   │
│ │ SP001 | iPhone 15 | 50 | 25tr | [🗑️]            │   │
│ │ SP002 | Samsung  | 30 | 15tr | [🗑️]            │   │
│ │ ...                                              │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ [Hủy]  [Lưu nháp]  [Xác nhận nhập kho]                 │
└─────────────────────────────────────────────────────────┘
```

**Chức năng:**
- Thêm sản phẩm vào danh sách
- Nhập số lượng
- Tự động tính tổng tiền
- Validate trước khi lưu

---

### 7. 📍 Quản Lý Vị Trí Lưu Trữ (Bin Location)

**Route:** `/bin-location`

**Mô tả:** Quản lý và theo dõi vị trí lưu trữ sản phẩm trong kho.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Quản lý Vị trí Lưu trữ                         │
│ [✨ AI Gợi ý] [2D/3D] [In nhãn kệ]                     │
├──────────┬──────────────────────────────────────────────┤
│ Tree View│  Grid View (2D/3D)                           │
│          │                                              │
│ Kho HN   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│ ├─ Dãy A │  │Bin │ │Bin │ │Bin │ │Bin │              │
│ │ ├─Kệ01 │  │A-01│ │A-02│ │A-03│ │A-04│              │
│ │ │ ├─Bin│  │    │ │ 📱 │ │    │ │ 💻 │              │
│ │ │ │ ...│  └────┘ └────┘ └────┘ └────┘              │
│ │ └─Kệ02 │                                              │
│ └─ Dãy B │  Legend:                                     │
│          │  🟢 Trống | 🟡 Đang dùng | 🔴 Đầy          │
└──────────┴──────────────────────────────────────────────┘
```

**Tree View (bên trái):**
- Warehouse → Row → Shelf → Bin
- Expandable tree structure
- Click để highlight bin trong grid

**Grid View (bên phải):**
- **2D Mode:** Grid các bin với màu theo trạng thái
  - 🟢 Xanh lá: Trống
  - 🟡 Vàng: Đang dùng
  - 🔴 Đỏ: Đầy
- **3D Mode:** Placeholder (tích hợp Three.js sau)

**Drag & Drop:**
- Kéo thả sản phẩm giữa các bin

**Legend:**
- Giải thích màu sắc cho từng trạng thái

---

### 8. 🛒 Quản Lý Đơn Hàng (Orders)

**Route:** `/orders`

**Mô tả:** Quản lý đơn hàng từ tạo đến hoàn thành.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Quản lý Đơn hàng | [+ Tạo đơn hàng mới]        │
├─────────────────────────────────────────────────────────┤
│ Filters: [Trạng thái ▼] [Kho ▼] [Thời gian ▼]         │
│         [Tìm mã đơn/tên KH...]                          │
├─────────────────────────────────────────────────────────┤
│ Table:                                                  │
│ Mã đơn | Khách hàng | Ngày | Tổng tiền | SP | Status   │
│ ─────────────────────────────────────────────────────── │
│ DH001  | Nguyễn Văn A | 14/11 | 12.5tr  | 3  | 🟡 Chờ │
│ DH002  | Trần Thị B   | 14/11 | 8.5tr   | 2  | 🔵 Xác  │
│ ...                                                    │
│                                                         │
│ Pagination                                              │
└─────────────────────────────────────────────────────────┘
```

**Status Colors:**
- 🟡 Vàng: Chờ xác nhận
- 🔵 Xanh dương: Đã xác nhận
- 🟣 Tím: Đang giao
- 🟢 Xanh lá: Hoàn thành
- 🔴 Đỏ: Hủy

**Action Buttons:**
- **Eye (Xem chi tiết):** Mở modal chi tiết đơn hàng
  - Thông tin khách hàng
  - Danh sách sản phẩm + số lượng + giá
  - Thông tin vận chuyển
  - Nút "Xác nhận xuất kho" (nếu chưa xuất)
- **Printer (In đơn):** In phiếu xuất kho
- **X (Hủy):** Hủy đơn hàng (chỉ hiển thị khi chưa hoàn thành/hủy)

---

### 9. 🏭 Quản Lý Nhà Cung Cấp (Suppliers)

**Route:** `/suppliers`

**Mô tả:** Quản lý thông tin nhà cung cấp và lịch sử giao dịch.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Quản lý Nhà cung cấp | [+ Thêm NCC mới]        │
├─────────────────────────────────────────────────────────┤
│ Filters: [Tìm kiếm...] [Trạng thái ▼]                  │
│ Tổng: 5 nhà cung cấp                                   │
├─────────────────────────────────────────────────────────┤
│ Table:                                                  │
│ Mã NCC | Tên NCC | SĐT | Email | Địa chỉ | Giao | ...  │
│ ─────────────────────────────────────────────────────── │
│ NCC001 | Apple   | 1900 | @apple | Hà Nội | 45  | ... │
│ NCC002 | Samsung | 1900 | @samsung| TP.HCM | 38  | ... │
│ ...                                                    │
│                                                         │
│ Pagination                                              │
└─────────────────────────────────────────────────────────┘
```

**Table Columns:**
- Mã NCC (font monospace)
- Tên nhà cung cấp + Người liên hệ
- SĐT (icon Phone)
- Email (icon Mail)
- Địa chỉ (icon MapPin)
- Số lần giao
- Tổng giá trị (format VND)
- Trạng thái (tag màu)
- Actions: Xem, Sửa, Xóa

**Status Colors:**
- 🟢 Xanh lá: Đang hợp tác
- 🔴 Đỏ: Ngừng

---

### 10. 👥 Quản Lý Nhân Viên (Employees)

**Route:** `/employees`

**Mô tả:** Quản lý nhân viên và phân quyền chi tiết.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Quản lý Nhân viên | [+ Thêm nhân viên]         │
├─────────────────────────────────────────────────────────┤
│ Filters: [Tìm kiếm...] [Vai trò ▼] [Kho ▼] [Status ▼] │
├─────────────────────────────────────────────────────────┤
│ Table:                                                  │
│ Mã NV | Họ tên | SĐT | Email | Vai trò | Kho | Status │
│ ─────────────────────────────────────────────────────── │
│ NV001 | Nguyễn Văn A | 0901 | @email | QL kho | HN | 🟢│
│ NV002 | Trần Thị B   | 0912 | @email | NV kho | HCM| 🟢│
│ ...                                                    │
│                                                         │
│ Pagination                                              │
└─────────────────────────────────────────────────────────┘
```

**Avatar:**
- Circle với chữ cái đầu tên
- Background gradient xanh dương

**Action Buttons:**
- **Shield icon (Phân quyền):** Mở modal phân quyền
- **Eye (Xem):** Xem chi tiết nhân viên
- **Edit (Sửa):** Chỉnh sửa thông tin
- **Delete (Xóa):** Xóa nhân viên

#### Modal Phân Quyền
```
┌─────────────────────────────────────────────────────────┐
│ Phân quyền - Nguyễn Văn A                    [X]        │
│ Vai trò: Quản lý kho                                    │
├─────────────────────────────────────────────────────────┤
│ Quyền truy cập:                                         │
│ ☑ Nhập kho                                             │
│   Tạo và xử lý phiếu nhập kho                          │
│ ☑ Xuất kho                                             │
│   Tạo và xử lý phiếu xuất kho                          │
│ ☑ Quản lý tồn kho                                      │
│   Xem và cập nhật tồn kho                               │
│ ☑ Xem báo cáo                                          │
│   Truy cập các báo cáo thống kê                         │
│ ☑ Quản lý kho                                          │
│   Quản lý vị trí và cấu trúc kho                        │
│ ☐ Quản lý nhân viên                                    │
│ ☐ Quản lý nhà cung cấp                                 │
│ ☐ Quản lý sản phẩm                                     │
├─────────────────────────────────────────────────────────┤
│ [Hủy]  [Lưu phân quyền]                                 │
└─────────────────────────────────────────────────────────┘
```

**8 Permissions:**
1. Nhập kho
2. Xuất kho
3. Quản lý tồn kho
4. Xem báo cáo
5. Quản lý kho
6. Quản lý nhân viên
7. Quản lý nhà cung cấp
8. Quản lý sản phẩm

---

### 11. ⚙️ Cài Đặt (Settings)

**Route:** `/settings`

**Mô tả:** Cài đặt hệ thống dành cho Admin.

**Layout:**
```
┌──────────┬──────────────────────────────────────────────┐
│ Settings │  Content Area                                │
│ Menu     │                                              │
│          │  [Thông tin công ty]                         │
│ 🏢 Thông │  - Logo upload                              │
│   tin    │  - Tên công ty, MST, Địa chỉ, SĐT, Email    │
│ 🏭 Quản  │  - Website                                  │
│   lý kho │                                              │
│ ⚙️ Cấu   │  [Quản lý kho]                              │
│   hình   │  - Danh sách kho với progress bar           │
│ 🔌 Tích  │  - Thêm/Sửa/Xóa kho                         │
│   hợp    │                                              │
│ 💾 Sao   │  [Cấu hình chung]                           │
│   lưu    │  - Toggle switches                           │
│ 👥 Quản  │                                              │
│   lý NV  │  [Tích hợp hệ thống]                        │
│ 🎨 Giao  │  - Shopee, Lazada, GHN, GHTK, Kế toán       │
│   diện   │  - Connect/Disconnect buttons                │
│          │                                              │
│          │  [Sao lưu & Khôi phục]                      │
│          │  - Sao lưu ngay, Tải xuống                  │
│          │  - Khôi phục từ file                        │
│          │                                              │
│          │  [Giao diện & Ngôn ngữ]                     │
│          │  - Ngôn ngữ (VI/EN)                         │
│          │  - Màu chủ đạo (4 màu)                     │
│          │  - Dark Mode toggle                         │
└──────────┴──────────────────────────────────────────────┘
```

**7 Menu Items:**

1. **Thông tin công ty**
   - Upload logo
   - Tên công ty, MST, Địa chỉ, SĐT, Email, Website
   - Button "Lưu thay đổi"

2. **Quản lý kho**
   - Danh sách kho cards
   - Progress bar sức chứa
   - Thêm/Sửa/Xóa kho

3. **Cấu hình chung**
   - Toggle: Tự động tạo mã SP
   - Toggle: Cảnh báo tồn kho
   - Toggle: Lot tracking

4. **Tích hợp hệ thống**
   - Shopee (Connect/Disconnect)
   - Lazada (Connect/Disconnect)
   - GHN (Connect/Disconnect)
   - GHTK (Connect/Disconnect)
   - Kế toán (Connect/Disconnect)
   - Hiển thị trạng thái và lastSync

5. **Sao lưu & Khôi phục**
   - Sao lưu ngay
   - Tải xuống backup
   - Khôi phục từ file
   - Lưu ý: Auto backup hàng ngày 00:00

6. **Quản lý người dùng** (Link)
   - Chuyển đến `/employees`
   - Icon ExternalLink

7. **Giao diện & Ngôn ngữ**
   - Select ngôn ngữ
   - Color picker (4 màu)
   - Dark Mode toggle

---

### 12. 🔔 Thông báo (Notifications)

**Route:** `/notifications`

**Mô tả:** Trang hiển thị danh sách thông báo hệ thống.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: 🔔 Thông báo | 3 chưa đọc | [Đánh dấu tất cả]  │
├─────────────────────────────────────────────────────────┤
│ Filters: [Tất cả (7)] [Chưa đọc (3)]                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌───────────────────────────────────────────────────┐   │
│ │ 🔴 Cảnh báo tồn kho thấp                    [✓] [✕]│   │
│ │ iPhone 15 Pro Max sắp hết hàng (còn 5 SP)        │   │
│ │ 5 phút trước                                      │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ ┌───────────────────────────────────────────────────┐   │
│ │ 🔵 Đơn hàng mới                            [✓] [✕]│   │
│ │ DH20241114001 - Nguyễn Văn A - 32.5 triệu        │   │
│ │ 15 phút trước                                     │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ ┌───────────────────────────────────────────────────┐   │
│ │ 🟠 Sản phẩm sắp hết hạn                   [✓] [✕]│   │
│ │ Sữa tươi LOT001 - HSD: 20/11/2024 (3 ngày)       │   │
│ │ 1 giờ trước                                       │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Các loại thông báo:**

1. **Cảnh báo tồn kho** (AlertTriangle - Đỏ)
   - Tồn kho thấp
   - Tồn kho vượt ngưỡng
   - Hàng sắp hết

2. **Đơn hàng** (ShoppingCart - Xanh dương)
   - Đơn hàng mới
   - Đơn hàng đã giao
   - Đơn hàng đã hủy

3. **Hết hạn** (Clock - Cam)
   - Sản phẩm sắp hết hạn
   - Lô sắp hết HSD

4. **Hệ thống** (Settings - Xám)
   - Bảo trì hệ thống
   - Cập nhật phiên bản
   - Thông báo quan trọng

5. **Nhập kho** (Package - Xanh lá)
   - Nhập kho thành công
   - Kiểm kê hoàn tất

**Mỗi notification item:**
- Icon màu sắc theo loại
- Tiêu đề (bold)
- Badge đỏ nếu chưa đọc
- Nội dung ngắn
- Thời gian (relative time)
- Actions: Đánh dấu đã đọc (Check) + Xóa (X)

**Filters:**
- Tất cả (hiển thị tất cả notifications)
- Chưa đọc (chỉ hiển thị unread)

**Actions:**
- **Đánh dấu đã đọc** (Check icon): Đánh dấu 1 notification là đã đọc
- **Đánh dấu tất cả đã đọc** (CheckCheck icon): Đánh dấu tất cả notifications
- **Xóa** (X icon): Xóa notification khỏi danh sách

**Realtime Support:**
- WebSocket placeholder (check every 30s)
- Tự động cập nhật khi có thông báo mới
- Badge count trên icon Bell trong Header

---

### 13. 👤 Profile (Cài Đặt Tài Khoản)

**Route:** `/profile`

**Mô tả:** Quản lý thông tin cá nhân và bảo mật tài khoản.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Cài đặt Tài khoản | [🚪 Đăng xuất]             │
├──────────┬──────────────────────────────────────────────┤
│ Avatar   │  [Thông tin] [Mật khẩu] [Thông báo] [Thiết bị]│
│          │                                              │
│ [Avatar] │  Tab Content                                 │
│ Nguyễn Văn A                                            │
│ QL kho                                                  │
│          │  - Form chỉnh sửa thông tin                 │
│ 📧 Email │  - Đổi mật khẩu                             │
│ 🛡️ Vai trò│  - Cài đặt thông báo                      │
│ 📅 Ngày  │  - Thiết bị đăng nhập                       │
│   tham gia│                                             │
│ 📍 Kho   │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**4 Tabs:**

#### Tab 1: Thông tin cá nhân
- Họ và tên
- Email
- Số điện thoại
- Ngày sinh
- Giới tính (dropdown)
- Địa chỉ
- Button "Lưu thay đổi"

#### Tab 2: Đổi mật khẩu
- Mật khẩu hiện tại (with show/hide)
- Mật khẩu mới (with show/hide)
- Xác nhận mật khẩu (with show/hide)
- Box cảnh báo bảo mật (màu vàng)
- Button "Cập nhật mật khẩu"

#### Tab 3: Cài đặt thông báo
- Email notifications (toggle)
- Push notifications (toggle)
- Cảnh báo đơn hàng (toggle)
- Cảnh báo tồn kho (toggle)
- Button "Lưu cài đặt"

#### Tab 4: Thiết bị đăng nhập
- Danh sách thiết bị (Laptop, Mobile)
- Mỗi thiết bị: Tên, Vị trí, IP, Thời gian hoạt động
- Badge "Hiện tại" cho thiết bị đang dùng
- Button "Đăng xuất" cho thiết bị khác
- Box cảnh báo bảo mật

**Button Đăng xuất:**
- Màu đỏ (bg-red-600)
- Icon LogOut
- Ở header

---

## 🔐 Phân Quyền Người Dùng

### 4 Vai Trò Chính:

#### 1. Quản trị viên (Admin)
**Permissions:** Tất cả quyền
- ✅ Quản lý sản phẩm
- ✅ Quản lý tồn kho
- ✅ Quản lý đơn hàng
- ✅ Quản lý nhà cung cấp
- ✅ Quản lý nhân viên
- ✅ Xem báo cáo
- ✅ Quản lý kho
- ✅ Cài đặt hệ thống

#### 2. Quản lý kho (Manager)
**Permissions:**
- ✅ Nhập kho
- ✅ Xuất kho
- ✅ Quản lý tồn kho
- ✅ Xem báo cáo
- ✅ Quản lý kho
- ❌ Quản lý nhân viên
- ❌ Cài đặt hệ thống

#### 3. Nhân viên kho (Warehouse Staff)
**Permissions:**
- ✅ Nhập kho
- ✅ Xuất kho
- ✅ Quản lý tồn kho
- ❌ Xem báo cáo
- ❌ Quản lý kho

#### 4. Thủ kho (Storekeeper)
**Permissions:**
- ✅ Nhập kho
- ✅ Xuất kho
- ✅ Quản lý tồn kho
- ✅ Xem báo cáo
- ❌ Quản lý kho

---

## 🔄 Luồng Nghiệp Vụ Chính

### 1. Luồng Nhập Kho
```
1. Tạo đơn nhập kho
   ↓
2. Chọn nhà cung cấp
   ↓
3. Thêm sản phẩm + số lượng
   ↓
4. Xác nhận đơn
   ↓
5. Nhập kho (cập nhật tồn)
   ↓
6. Cập nhật vị trí lưu trữ
```

### 2. Luồng Xuất Kho
```
1. Tạo đơn xuất kho
   ↓
2. Chọn đơn hàng (từ Orders)
   ↓
3. Kiểm tra tồn kho
   ↓
4. Xác nhận xuất
   ↓
5. Cập nhật tồn kho
   ↓
6. In phiếu xuất
```

### 3. Luồng Quản Lý Sản Phẩm
```
1. Thêm sản phẩm mới
   ↓
2. Nhập thông tin + barcode
   ↓
3. Phân loại danh mục
   ↓
4. Cấu hình vị trí mặc định
   ↓
5. Theo dõi lot (nếu cần)
```

### 4. Luồng Đơn Hàng
```
1. Tạo đơn hàng mới
   ↓
2. Chọn khách hàng
   ↓
3. Thêm sản phẩm
   ↓
4. Chọn kho xuất
   ↓
5. Xác nhận đơn
   ↓
6. Xuất kho
   ↓
7. Cập nhật trạng thái
```

---

## 🎨 Design System

### Màu Sắc
- **Primary:** #007BFF (Xanh dương)
- **Success:** #28A745 (Xanh lá)
- **Warning:** #FD7E14 (Cam)
- **Danger:** #DC3545 (Đỏ)
- **Dark:** #1a1a1a (Dark mode background)

### Typography
- **Font:** Inter (Google Fonts)
- **Sizes:** text-xs (12px) → text-4xl (36px)
- **Weights:** font-normal (400) → font-bold (700)

### Spacing
- **Base unit:** 4px
- **Common:** p-4 (16px), p-6 (24px), p-8 (32px)

### Border Radius
- **Small:** rounded-lg (8px)
- **Medium:** rounded-xl (12px)
- **Large:** rounded-2xl (16px)

### Shadows
- **Small:** shadow-sm
- **Medium:** shadow-md
- **Large:** shadow-lg, shadow-xl

---

## 📱 Responsive Breakpoints

- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md/lg)
- **Desktop:** > 1024px (lg+)

**Mobile Adaptations:**
- Sidebar: Slide-in drawer
- Tables: Convert to cards
- Grids: 1 column
- Forms: Full width

---

## 🔧 Cài Đặt & Chạy Ứng Dụng

### Prerequisites
```bash
Node.js >= 16.x
npm >= 8.x
```

### Installation
```bash
# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=KHO AI
```

---

## 📝 Ghi Chú

- Tất cả các màn hình đều hỗ trợ Dark Mode
- Responsive design cho Mobile, Tablet, Desktop
- Form validation cần bổ sung thêm
- API integration cần kết nối backend
- File upload cần tích hợp cloud storage
- Real-time updates cần WebSocket

---

**Phát triển bởi:** KHO AI Team  
**Phiên bản:** 1.0.0  
**Cập nhật:** November 2024