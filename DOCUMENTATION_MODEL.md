# 📚 DOCUMENTATION MODEL - KHO AI Database & UI Structure

**Ngày tạo:** 16/07/2026  
**Phiên bản:** 1.0.0  
**Mục đích:** Tài liệu chi tiết về Database Models và cấu trúc UI từng trang

---

## 📋 MỤC LỤC

1. [Database Models](#database-models)
2. [UI Structure - Page by Page](#ui-structure---page-by-page)
3. [Component Locations](#component-locations)
4. [API Endpoints Mapping](#api-endpoints-mapping)

---

## 🗄️ DATABASE MODELS

### 1. USER (Người dùng)

**File:** `backend/prisma/schema.prisma` (lines 75-108)  
**Table:** `users`

#### Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier (CUID) |
| employeeCode | String | UNIQUE, REQUIRED | Mã nhân viên (VD: NV001) |
| fullName | String | REQUIRED | Họ tên đầy đủ |
| email | String | UNIQUE, REQUIRED | Email đăng nhập |
| phone | String | UNIQUE, REQUIRED | Số điện thoại |
| password | String | REQUIRED | Mật khẩu (hashed) |
| role | UserRole | DEFAULT: STAFF | Vai trò: ADMIN, MANAGER, STAFF, STOREKEEPER |
| status | UserStatus | DEFAULT: ACTIVE | Trạng thái: ACTIVE, INACTIVE, SUSPENDED |
| avatar | String? | NULLABLE | URL ảnh đại diện |
| address | String? | NULLABLE | Địa chỉ |
| birthday | DateTime? | NULLABLE | Ngày sinh |
| gender | String? | NULLABLE | Giới tính |
| joinDate | DateTime | DEFAULT: now | Ngày vào làm |
| canImport | Boolean | DEFAULT: false | Quyền nhập kho |
| canExport | Boolean | DEFAULT: false | Quyền xuất kho |
| canManageInventory | Boolean | DEFAULT: false | Quyền quản lý tồn kho |
| canViewReports | Boolean | DEFAULT: false | Quyền xem báo cáo |
| canManageWarehouse | Boolean | DEFAULT: false | Quyền quản lý kho |
| canManageEmployees | Boolean | DEFAULT: false | Quyền quản lý nhân viên |
| canManageSuppliers | Boolean | DEFAULT: false | Quyền quản lý NCC |
| canManageProducts | Boolean | DEFAULT: false | Quyền quản lý sản phẩm |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |
| updatedAt | DateTime | AUTO UPDATE | Ngày cập nhật |

#### Relations:
- **createdReceipts** → StockReceipt[] (CreatedBy)
- **notifications** → Notification[]

#### UI Usage:
- **Employees Page** (`src/pages/Employees.jsx`): Line 1148-1163
  - Hiển thị: Mã NV, Họ tên, SĐT, Email, Vai trò, Kho, Trạng thái
  - Avatar: `w-8 h-8 bg-primary rounded-full` với chữ cái đầu
  - Permission modal: 8 checkboxes (lines 1172-1193 trong DOCUMENTATION.md)

---

### 2. WAREHOUSE (Kho hàng)

**File:** `backend/prisma/schema.prisma` (lines 113-127)  
**Table:** `warehouses`

#### Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| code | String | UNIQUE, REQUIRED | Mã kho (VD: WH001) |
| name | String | REQUIRED | Tên kho |
| address | String | REQUIRED | Địa chỉ |
| capacity | Int | DEFAULT: 0 | Sức chứa tối đa |
| status | Boolean | DEFAULT: true | Trạng thái hoạt động |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |
| updatedAt | DateTime | AUTO UPDATE | Ngày cập nhật |

#### Relations:
- **binLocations** → BinLocation[]

#### UI Usage:
- **Inventory Management** (`src/pages/InventoryManagement.jsx`): Line 180-193
  - Dropdown filter: "Kho" (Tất cả, Hà Nội, TP.HCM, Đà Nẵng)
  - Icon: `<Package className="w-4 h-4 text-gray-400" />`
- **Orders** (`src/pages/Orders.jsx`): Line 164-180
  - Dropdown filter: "Kho" (Tất cả, Hà Nội, TP.HCM, Đà Nẵng)
- **Settings** (`src/pages/Settings.jsx`): Section 2 - Quản lý kho
  - Danh sách kho + progress bar capacity

---

### 3. BIN LOCATION (Vị trí lưu trữ)

**File:** `backend/prisma/schema.prisma` (lines 129-150)  
**Table:** `bin_locations`

#### Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| code | String | UNIQUE, REQUIRED | Mã vị trí (VD: A-01-02) |
| name | String | REQUIRED | Tên vị trí |
| type | String | REQUIRED | Loại: ROW, SHELF, BIN |
| capacity | Int | DEFAULT: 100 | Sức chứa |
| status | BinStatus | DEFAULT: EMPTY | Trạng thái: EMPTY, IN_USE, FULL, MAINTENANCE |
| warehouseId | String | FK, REQUIRED | Reference to Warehouse |
| parentId | String? | FK, NULLABLE | Self-reference (tree structure) |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |
| updatedAt | DateTime | AUTO UPDATE | Ngày cập nhật |

#### Relations:
- **warehouse** → Warehouse (many-to-one)
- **parent** → BinLocation? (self-reference)
- **children** → BinLocation[] (self-reference)
- **inventories** → Inventory[]

#### UI Usage:
- **Bin Location Page** (`src/pages/BinLocation.jsx`): Full page
  - **Tree View** (left sidebar, w-80):
    - Warehouse → Row (Dãy) → Shelf (Kệ) → Bin (Ô)
    - Expandable nodes với ChevronRight/ChevronDown icons
    - Colors: blue-50 (warehouse), white (row), gray-50 (shelf)
  - **2D Grid View** (right content, flex-1):
    - Grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`
    - Bin colors: green-100 (empty), yellow-100 (in-use), red-100 (full)
    - Progress bar: `(quantity/capacity) * 100%`
    - Drag & drop: `draggable`, `onDragStart`, `onDragOver`, `onDrop`
  - **Legend** (bottom left):
    - Trống: `bg-green-100 border-2 border-green-300`
    - Đang dùng: `bg-yellow-100 border-2 border-yellow-300`
    - Đầy: `bg-red-100 border-2 border-red-300`

---

### 4. PRODUCT (Sản phẩm)

**File:** `backend/prisma/schema.prisma` (lines 155-181)  
**Table:** `products`

#### Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| code | String | UNIQUE, REQUIRED | Mã sản phẩm (VD: SP001) |
| nameVi | String | REQUIRED | Tên tiếng Việt |
| nameEn | String? | NULLABLE | Tên tiếng Anh |
| category | String | REQUIRED | Danh mục (Điện tử, Thực phẩm, Mỹ phẩm) |
| unit | String | DEFAULT: "Cái" | Đơn vị tính |
| barcode | String? | NULLABLE | Mã vạch |
| costPrice | Float | REQUIRED | Giá nhập |
| sellingPrice | Float | REQUIRED | Giá bán |
| minStock | Int | DEFAULT: 10 | Tồn kho tối thiểu |
| defaultExpiry | Int? | NULLABLE | Số ngày hết hạn mặc định |
| lotTracking | Boolean | DEFAULT: false | Theo dõi lô |
| status | ProductStatus | DEFAULT: ACTIVE | Trạng thái: ACTIVE, INACTIVE, DISCONTINUED |
| image | String? | NULLABLE | URL ảnh sản phẩm |
| descriptionVi | String? | NULLABLE | Mô tả tiếng Việt |
| descriptionEn | String? | NULLABLE | Mô tả tiếng Anh |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |
| updatedAt | DateTime | AUTO UPDATE | Ngày cập nhật |

#### Relations:
- **inventories** → Inventory[]
- **orderItems** → OrderItem[]
- **receiptDetails** → StockReceiptDetail[]

#### UI Usage:
- **Products Page** (`src/pages/Products.jsx`): Full page
  - **Header** (line 27-38):
    - Title: "Quản lý Sản phẩm"
    - Button: "Thêm sản phẩm" (bg-primary, Plus icon)
  - **Filter Bar** (line 42-90):
    - Search input (Search icon, placeholder: "Tìm mã SP, tên sản phẩm...")
    - Category dropdown (Điện tử, Thực phẩm, Mỹ phẩm)
    - Status dropdown (Active, Inactive)
  - **Table** (line 93-168):
    - Columns: Mã SP, Tên SP, Danh mục, Giá bán, Tồn kho, Trạng thái, Thao tác
    - Mã SP: `font-mono font-medium`
    - Tên SP: Link to `/products/:code`, color: text-primary
    - Giá bán: `font-semibold`, format VND
    - Tồn kho: `font-bold text-center`
    - Trạng thái: `bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs`
    - Thao tác: Eye (view), Edit2 (edit), Trash2 (delete)
  - **Pagination** (line 154-167):
    - "Hiển thị 1 đến 8 của 8 kết quả"
    - Buttons: Trước (disabled), 1 (active), Sau

- **Product Detail Page** (`src/pages/ProductDetail.jsx`):
  - **Header** (line 579-595 trong DOCUMENTATION.md):
    - Title: "Chi tiết Sản phẩm"
    - Mã SP: `font-mono font-semibold text-primary`
    - Actions: Chỉnh sửa, In mã vạch, Xóa
  - **4 Tabs** (line 600-617):
    1. **Thông tin chung** (FileText icon):
       - Layout: `grid grid-cols-1 lg:grid-cols-3 gap-6`
       - Left (1/3): Ảnh sản phẩm + Upload button
       - Right (2/3): Form fields (grid 2 cột)
       - Fields: Tên SP, Danh mục, Giá nhập, Giá bán, Đơn vị, Mã vạch, Mô tả
    2. **Tồn kho theo kho** (Package icon):
       - Table: Kho | Tồn thực tế | Tồn khả dụng | Vị trí
    3. **Lịch sử** (Clock icon):
       - Filter: Khoảng thời gian + Loại giao dịch
       - Table: Loại (TrendingUp/TrendingDown) | Ngày | Số lượng | Mã phiếu | Kho
    4. **Tài liệu** (Image icon):
       - Grid images: `grid grid-cols-2 md:grid-cols-4 gap-4`
       - Upload placeholder: border dashed
       - Documents list: file icon + tên + kích thước + download

---

### 5. INVENTORY (Tồn kho)

**File:** `backend/prisma/schema.prisma` (lines 186-205)  
**Table:** `inventories`

#### Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| quantity | Int | DEFAULT: 0 | Tồn thực tế |
| availableStock | Int | DEFAULT: 0 | Tồn khả dụng |
| reservedStock | Int | DEFAULT: 0 | Tồn đã đặt |
| expiryDate | DateTime? | NULLABLE | Hạn sử dụng |
| lotNumber | String? | NULLABLE | Số lô |
| productId | String | FK, REQUIRED | Reference to Product |
| binLocationId | String | FK, REQUIRED | Reference to BinLocation |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |
| updatedAt | DateTime | AUTO UPDATE | Ngày cập nhật |

#### Unique Constraint:
`@@unique([productId, binLocationId, lotNumber])`

#### Relations:
- **product** → Product (many-to-one)
- **binLocation** → BinLocation (many-to-one)

#### UI Usage:
- **Inventory Management Page** (`src/pages/InventoryManagement.jsx`): Full page
  - **Header** (line 150-173):
    - Title: "Quản lý Tồn kho"
    - 3 Buttons:
      - "Nhập kho mới" (bg-primary, Link to /inventory/create)
      - "Xuất kho mới" (bg-success)
      - "Kiểm kê ngay" (bg-warning)
  - **Filter Bar** (line 177-247):
    - 4 filters: Kho, Danh mục, Trạng thái, Tìm kiếm + Camera (scan)
  - **Desktop Table** (line 250-364):
    - Columns: Checkbox, Mã SP, Tên SP, Kho, Vị trí, Tồn thực tế, Tồn khả dụng, HSD, Trạng thái, Thao tác
    - Row colors: bg-green-50 (normal), bg-yellow-50 (low), bg-red-50 (critical)
    - Checkbox: Select all / Select one
    - HSD: Red text + AlertTriangle icon if expiring soon (≤30 days)
  - **Mobile Cards** (line 367-434):
    - `md:hidden` - Only show on mobile
    - Card content: Checkbox, Code, Name, Status, Details, Actions
    - Actions: Xem, Sửa, Xóa (full-width buttons)

---

### 6. SUPPLIER (Nhà cung cấp)

**File:** `backend/prisma/schema.prisma` (lines 210-229)  
**Table:** `suppliers`

#### Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| code | String | UNIQUE, REQUIRED | Mã NCC (VD: NCC001) |
| name | String | REQUIRED | Tên nhà cung cấp |
| contactPerson | String? | NULLABLE | Người liên hệ |
| phone | String | REQUIRED | Số điện thoại |
| email | String? | NULLABLE | Email |
| address | String? | NULLABLE | Địa chỉ |
| note | String? | NULLABLE | Ghi chú |
| deliveryCount | Int | DEFAULT: 0 | Số lần giao |
| totalValue | Float | DEFAULT: 0 | Tổng giá trị giao dịch |
| status | Boolean | DEFAULT: true | Trạng thái hợp tác |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |
| updatedAt | DateTime | AUTO UPDATE | Ngày cập nhật |

#### Relations:
- **stockReceipts** → StockReceipt[] (SupplierReceipt)

#### UI Usage:
- **Suppliers Page** (`src/pages/Suppliers.jsx`):
  - **Header** (line 1051-1056 trong DOCUMENTATION.md):
    - Title: "Quản lý Nhà cung cấp"
    - Button: "Thêm nhà cung cấp mới" (Link to /suppliers/create)
  - **Filter Bar** (line 1061-1067):
    - Search input (Tìm mã NCC, tên nhà cung cấp)
    - Status dropdown
    - Total count: "Tổng: 5 nhà cung cấp"
  - **Table** (line 1070-1092):
    - 9 Columns: Mã NCC, Tên NCC, SĐT, Email, Địa chỉ, Giao, Giá trị, Status, Thao tác
    - Mã NCC: `font-mono`
    - Tên NCC: 2 dòng (Tên + Người liên hệ)
    - SĐT: Phone icon
    - Email: Mail icon
    - Địa chỉ: MapPin icon, truncate
    - Giao: `font-bold text-center`
    - Giá trị: `font-semibold text-right`, format VND
    - Status: `bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs`
    - Thao tác: Eye, Edit2, Trash2

---

### 7. ORDER (Đơn hàng)

**File:** `backend/prisma/schema.prisma` (lines 234-267)  
**Table:** `orders` + `order_items`

#### Order Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| orderCode | String | UNIQUE, REQUIRED | Mã đơn hàng (VD: DH20241114001) |
| customerName | String | REQUIRED | Tên khách hàng |
| customerPhone | String | REQUIRED | SĐT khách hàng |
| customerAddress | String | REQUIRED | Địa chỉ giao hàng |
| totalAmount | Float | DEFAULT: 0 | Tổng tiền |
| status | OrderStatus | DEFAULT: PENDING | Trạng thái: PENDING, CONFIRMED, DELIVERING, COMPLETED, CANCELLED, RETURNED |
| warehouseId | String? | FK, NULLABLE | Reference to Warehouse |
| notes | String? | NULLABLE | Ghi chú |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |
| updatedAt | DateTime | AUTO UPDATE | Ngày cập nhật |

#### OrderItem Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| quantity | Int | REQUIRED | Số lượng |
| unitPrice | Float | REQUIRED | Đơn giá |
| orderId | String | FK, REQUIRED | Reference to Order |
| productId | String | FK, REQUIRED | Reference to Product |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |

#### Relations:
- **order** → Order (many-to-one, Cascade delete)
- **product** → Product (many-to-one)

#### UI Usage:
- **Orders Page** (`src/pages/Orders.jsx`): Full page
  - **Header** (line 127-138):
    - Title: "Quản lý Đơn hàng"
    - Button: "Tạo đơn hàng mới" (bg-primary, Plus icon)
  - **Filter Bar** (line 142-214):
    - 5 filters: Trạng thái, Kho, Thời gian, Tìm kiếm (lg:col-span-2)
  - **Table** (line 217-301):
    - 8 Columns: Mã đơn, Khách hàng, Ngày tạo, Tổng tiền, Sản phẩm, Trạng thái, Kho xuất, Thao tác
    - Mã đơn: `font-mono font-medium`
    - Khách hàng: 2 dòng (Tên + SĐT)
    - Tổng tiền: `font-semibold text-right`, format VND
    - Sản phẩm: "3 sản phẩm" (text-center)
    - Trạng thái: 5 màu (pending: yellow, confirmed: blue, delivering: purple, completed: green, cancelled: red)
    - Kho xuất: MapPin icon + tên kho
    - Thao tác: Eye (view), Printer (print), X (cancel - chỉ hiện khi status != cancelled/completed)

- **Order Detail Page** (`src/pages/OrderDetail.jsx`):
  - **Header** (line 976-984 trong DOCUMENTATION.md):
    - Title: "Chi tiết Đơn hàng"
    - Mã đơn: `font-mono font-semibold text-primary`
    - Actions: Xác nhận, Xuất kho, Hoàn thành, Hủy (theo status)
  - **Customer Info** (line 985-993):
    - Tên KH, SĐT, Địa chỉ (MapPin icon)
  - **Order Items Table** (line 994-1002):
    - Columns: Mã SP, Tên SP, Số lượng, Đơn giá, Thành tiền
  - **Status Timeline** (line 1003-1011):
    - Vertical timeline với icons
    - Steps: Tạo đơn → Xác nhận → Xuất kho → Giao hàng → Hoàn thành

---

### 8. STOCK RECEIPT (Phiếu nhập/xuất/kiểm kê)

**File:** `backend/prisma/schema.prisma` (lines 272-314)  
**Table:** `stock_receipts` + `stock_receipt_details`

#### StockReceipt Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| receiptCode | String | UNIQUE, REQUIRED | Mã phiếu (VD: NK-20260714-001) |
| type | ReceiptType | REQUIRED | Loại: IMPORT, EXPORT, TRANSFER, CHECK |
| status | String | DEFAULT: "DRAFT" | Trạng thái: DRAFT, CONFIRMED, CANCELLED |
| totalQuantity | Int | DEFAULT: 0 | Tổng số lượng |
| totalAmount | Float | DEFAULT: 0 | Tổng tiền |
| notes | String? | NULLABLE | Ghi chú |
| orderId | String? | FK, NULLABLE | Reference to Order (for EXPORT) |
| supplierId | String? | FK, NULLABLE | Reference to Supplier (for IMPORT) |
| createdById | String? | FK, NULLABLE | Reference to User |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |
| updatedAt | DateTime | AUTO UPDATE | Ngày cập nhật |

#### StockReceiptDetail Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| quantity | Int | REQUIRED | Số lượng |
| unitPrice | Float | REQUIRED | Đơn giá |
| subtotal | Float | REQUIRED | Thành tiền |
| location | String? | NULLABLE | Vị trí lưu trữ |
| lotNumber | String? | NULLABLE | Số lô |
| expiryDate | DateTime? | NULLABLE | Hạn sử dụng |
| receiptId | String | FK, REQUIRED | Reference to StockReceipt |
| productId | String | FK, REQUIRED | Reference to Product |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |

#### Relations:
- **supplier** → Supplier? (many-to-one)
- **createdBy** → User? (many-to-one)
- **details** → StockReceiptDetail[] (one-to-many, Cascade delete)
- **order** → Order? (many-to-one)

#### UI Usage:
- **Create Stock In Page** (`src/pages/CreateStockIn.jsx`): Full page
  - **Header** (line 767-772 trong DOCUMENTATION.md):
    - Title: "Tạo phiếu nhập kho mới"
    - Số phiếu: `NK-20260714-001` (font-mono font-semibold text-primary)
  - **Section 1: Thông tin chung** (line 777-786):
    - Grid: `grid-cols-1 md:grid-cols-2 gap-4`
    - Fields: Ngày nhập (Calendar icon), Nhà cung cấp (User icon), Kho nhận (Warehouse icon), Người nhập (User icon, disabled), Ghi chú (FileText icon, textarea)
  - **Section 2: Chi tiết sản phẩm** (line 789-818):
    - Header: "Chi tiết sản phẩm" + 2 buttons (Quét mã, Thêm dòng)
    - Table: Mã SP, Tên SP, SL, Đơn giá, Thành tiền, Vị trí, HSD, Lot, Action
    - Dynamic rows: Add/remove functionality
  - **Section 3: Summary** (line 821-827):
    - Gradient card: `bg-gradient-to-r from-primary to-blue-600`
    - Tổng số lượng, Tổng tiền (auto-calculate)
  - **Fixed Footer** (line 831-837):
    - Position: `fixed bottom-0 left-0 right-0`
    - `margin-left: 256px` (sidebar width)
    - Buttons: Hủy (border), Lưu tạm (border-primary), Xác nhận nhập kho (bg-success)

- **Create Stock Out Page** (`src/pages/CreateStockOut.jsx`):
  - Similar structure to CreateStockIn
  - Order selection instead of supplier
  - Stock validation before export

- **Inventory Check Page** (`src/pages/InventoryCheck.jsx`):
  - Check modes: full/partial/cycle
  - Barcode scan
  - Actual vs system stock comparison
  - Discrepancy report

---

### 9. NOTIFICATION (Thông báo)

**File:** `backend/prisma/schema.prisma` (lines 319-333)  
**Table:** `notifications`

#### Fields:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, auto-generated | Unique identifier |
| type | NotificationType | REQUIRED | Loại: INVENTORY, ORDER, EXPIRY, SYSTEM, IMPORT |
| title | String | REQUIRED | Tiêu đề |
| content | String | REQUIRED | Nội dung |
| isRead | Boolean | DEFAULT: false | Đã đọc hay chưa |
| referenceId | String? | NULLABLE | Reference ID (orderId, productId, etc.) |
| userId | String? | FK, NULLABLE | Reference to User |
| createdAt | DateTime | DEFAULT: now | Ngày tạo |

#### Relations:
- **user** → User? (many-to-one)

#### UI Usage:
- **Notifications Page** (`src/pages/Notifications.jsx`):
  - **Header** (line 1273-1286 trong DOCUMENTATION.md):
    - Title: "Thông báo" (Bell icon, w-8 h-8 text-primary)
    - Unread count: "3 thông báo chưa đọc"
    - Button: "Đánh dấu tất cả đã đọc" (CheckCheck icon)
  - **Filter Tabs** (line 1291-1296):
    - 2 tabs: Tất cả (7), Chưa đọc (3)
  - **Notification List** (line 1299-1330):
    - **Unread** (border-primary, full opacity):
      - Icon container: `p-3 rounded-lg bg-red-50 text-red-600`
      - Title: `text-sm font-semibold` + red badge dot
      - Content: `text-sm text-gray-600`
      - Time: `text-xs text-gray-500`
      - Actions: Check (mark as read), X (delete)
    - **Read** (border-gray-200, opacity-75):
      - Same structure but no badge, no Check action
    - **5 Types**:
      | Type | Icon | Color | Example |
      |------|------|-------|---------|
      | inventory | AlertTriangle | 🔴 Đỏ | Tồn kho thấp |
      | order | ShoppingCart | 🔵 Xanh | Đơn hàng mới |
      | expiry | Clock | 🟠 Cam | Sắp hết hạn |
      | system | Settings | ⚫ Xám | Bảo trì hệ thống |
      | import | Package | 🟢 Xanh | Nhập kho thành công |

---

## 🎨 UI STRUCTURE - PAGE BY PAGE

### Layout Structure (Common Pattern)

**Dashboard Layout** (có Sidebar):
```jsx
<div className="flex h-screen bg-gray-50">
  <Sidebar /> {/* Fixed, w-64, full height */}
  <div className="flex-1 flex flex-col overflow-hidden ml-64">
    <Header /> {/* Fixed top, z-10 */}
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 pt-20">
      {/* Page content */}
    </main>
  </div>
</div>
```

**Auth Layout** (không có Sidebar):
```jsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
  {/* Left: Branding (hidden on mobile) */}
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700">
    {/* Logo, Slogan, Features */}
  </div>
  {/* Right: Form */}
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="w-full max-w-md">
      {/* Form card */}
    </div>
  </div>
</div>
```

---

### Page 1: LOGIN (`/login`)

**File:** `src/pages/Login.jsx`  
**Auth:** Public  
**Layout:** Auth Layout (2 cột)

#### UI Structure:
```
┌─────────────────────────────────────────────────────┐
│ ┌──────────────────┐  ┌──────────────────────────┐ │
│ │                  │  │                          │ │
│ │   BRANDING       │  │   LOGIN FORM             │ │
│ │   (50% width)    │  │   (50% width)            │ │
│ │                  │  │                          │ │
│ │  - Logo          │  │  - Title: "Đăng nhập"    │ │
│ │  - Slogan        │  │  - Subtitle              │ │
│ │  - Features      │  │  - Toggle: Email/Phone   │ │
│ │                  │  │  - Input: Email/Phone     │ │
│ │  (hidden on      │  │  - Input: Password        │ │
│ │   mobile)        │  │  - Checkbox: Remember me  │ │
│ │                  │  │  - Button: ĐĂNG NHẬP      │ │
│ │                  │  │  - Divider: "Hoặc"        │ │
│ │                  │  │  - Social: Google, Zalo   │ │
│ │                  │  │  - Link: Đăng ký          │ │
│ │                  │  │                          │ │
│ └──────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Branding Column** (line 181-203 trong DOCUMENTATION.md):
  - Background: `bg-gradient-to-br from-primary to-blue-700`
  - Logo: `w-16 h-16 bg-white rounded-xl`
  - Title: "KHO AI" (text-3xl font-bold)
  - Slogan: "Quản lý kho thông minh"
  - 3 Feature items với dots
- **Form Column** (line 206-286):
  - Card: `bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8`
  - Login Type Toggle: Email/Phone (2 buttons)
  - Email Input: `pl-10 pr-4 py-3` (Mail icon, left-3)
  - Password Input: `pl-10 pr-12 py-3` (Lock icon, Eye/EyeOff toggle)
  - Remember me: Checkbox + "Quên mật khẩu?" link
  - Submit Button: `w-full bg-primary text-white py-3 rounded-lg`
  - Social Login: 2 buttons (Google, Zalo)
  - Register Link: "Đăng ký dùng thử miễn phí"

---

### Page 2: DASHBOARD (`/`)

**File:** `src/pages/Dashboard.jsx`  
**Auth:** Required  
**Layout:** Dashboard Layout

#### UI Structure:
```
┌──────────────────────────────────────────────────────┐
│ Header: "Dashboard" + Refresh button                  │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │  ROW 1: 4 KPI Cards (grid-cols-4)                │ │
│ │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │ │
│ │  │ Tổng SP│ │Đơn hàng│ │Doanh thu│ │Cảnh báo│   │ │
│ │  │ 12,847 │ │   45   │ │2.5 tỷ  │ │   3    │   │ │
│ │  │+12.5%  │ │ +5.2%  │ │ +8.1%  │ │  0%    │   │ │
│ │  └────────┘ └────────┘ └────────┘ └────────┘   │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ ┌────────────────────────┬─────────────────────────┐ │
│ │  ROW 2: Chart (70%)    │  Top Products (30%)     │ │
│ │  ┌──────────────────┐  │  ┌──────────────────┐  │ │
│ │  │ Line Chart       │  │  │ 1. iPhone 15     │  │ │
│ │  │ 30 ngày          │  │  │    245 (85%)     │  │ │
│ │  │                  │  │  │ 2. Samsung S24   │  │ │
│ │  │                  │  │  │    180 (62%)     │  │ │
│ │  │                  │  │  │ 3. MacBook Air   │  │ │
│ │  │                  │  │  │    120 (42%)     │  │ │
│ │  └──────────────────┘  │  └──────────────────┘  │ │
│ └────────────────────────┴─────────────────────────┘ │
│                                                      │
│ ┌────────────────────────┬─────────────────────────┐ │
│ │  ROW 3: Table (50%)    │  Table (50%)            │ │
│ │  ┌──────────────────┐  │  ┌──────────────────┐  │ │
│ │  │ Sắp hết hạn      │  │  │ Tồn kho thấp     │  │ │
│ │  │ - SP001: 5 ngày  │  │  │ - SP002: 8/50    │  │ │
│ │  │ - SP003: 12 ngày │  │  │ - SP005: 15/100  │  │ │
│ │  └──────────────────┘  │  └──────────────────┘  │ │
│ └────────────────────────┴─────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Header** (line 42-59):
  - Title: "Dashboard" (text-2xl sm:text-3xl font-bold)
  - Subtitle: "Tổng quan hoạt động kho (dữ liệu thực)"
  - Refresh Button: RefreshCw icon + "Làm mới"
- **KPI Cards** (line 97):
  - Component: `<KPICards data={data.kpis} />`
  - 4 cards: Tổng SP, Đơn hàng, Doanh thu, Cảnh báo
  - Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Charts Section** (line 99-106):
  - Line Chart (70%): `<InventoryChart data={data.inventoryChart} />`
  - Top Products (30%): `<TopProducts data={data.topProducts} />`
  - Grid: `grid-cols-1 lg:grid-cols-3 gap-6`
- **Tables Section** (line 108-111):
  - Expiring Products (50%): `<ExpiringProducts data={data.expiringProducts} />`
  - Low Inventory (50%): `<LowInventory data={data.lowInventory} />`
  - Grid: `grid-cols-1 lg:grid-cols-2 gap-6`

---

### Page 3: PRODUCTS (`/products`)

**File:** `src/pages/Products.jsx`  
**Auth:** Required  
**Layout:** Dashboard Layout

#### UI Structure:
```
┌──────────────────────────────────────────────────────┐
│ Header: "Quản lý Sản phẩm" + "Thêm sản phẩm" button │
├──────────────────────────────────────────────────────┤
│ Filter Bar:                                           │
│ ┌────────────┬────────────┬────────────┐             │
│ │ Tìm kiếm   │ Danh mục   │ Trạng thái │             │
│ │ [Search]   │ [Dropdown] │ [Dropdown] │             │
│ └────────────┴────────────┴────────────┘             │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ Table                                            │ │
│ │ ┌────┬──────────┬────┬──────┬────┬────┬──────┐  │ │
│ │ │Mã  │ Tên SP   │Cat │ Giá  │Tồn │Sts │Action│  │ │
│ │ ├────┼──────────┼────┼──────┼────┼────┼──────┤  │ │
│ │ │SP01│ iPhone   │ĐT  │25tr  │ 45 │Act │👁✏️🗑│  │ │
│ │ │SP02│ Samsung  │ĐT  │22tr  │  8 │Act │👁✏️🗑│  │ │
│ │ └────┴──────────┴────┴──────┴────┴────┴──────┘  │ │
│ └──────────────────────────────────────────────────┘ │
│ Pagination: Trước | 1 | Sau                          │
└──────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Header** (line 27-38):
  - Title: "Quản lý Sản phẩm"
  - Button: "Thêm sản phẩm" (bg-primary, Plus icon)
- **Filter Bar** (line 42-90):
  - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
  - Search: Search icon, placeholder "Tìm mã SP, tên sản phẩm..."
  - Category: Select (Tất cả, Điện tử, Thực phẩm, Mỹ phẩm)
  - Status: Select (Tất cả, Active, Inactive)
- **Table** (line 93-168):
  - 7 columns: Mã SP, Tên SP, Danh mục, Giá bán, Tồn kho, Trạng thái, Thao tác
  - Hover: `hover:bg-gray-50 dark:hover:bg-gray-700`
  - Actions: Eye (blue), Edit2 (green), Trash2 (red)
- **Pagination** (line 154-167):
  - Text: "Hiển thị 1 đến 8 của 8 kết quả"
  - Buttons: Trước (disabled), 1 (active), Sau

---

### Page 4: INVENTORY MANAGEMENT (`/inventory`)

**File:** `src/pages/InventoryManagement.jsx`  
**Auth:** Required  
**Layout:** Dashboard Layout

#### UI Structure:
```
┌──────────────────────────────────────────────────────┐
│ Header: "Quản lý Tồn kho"                             │
│ [Nhập kho mới] [Xuất kho mới] [Kiểm kê ngay]         │
├──────────────────────────────────────────────────────┤
│ Filter Bar:                                           │
│ ┌────────┬────────┬────────┬──────────────────┐     │
│ │ Kho     │Cat     │Status  │ Tìm kiếm + [📷]  │     │
│ │[Select] │[Select]│[Select]│ [Search] [Camera]│     │
│ └────────┴────────┴────────┴──────────────────┘     │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ ☐ │Mã  │ Tên    │Kho │Vị trí│Thực│Khả│HSD │Sts│Act│ │
│ │ ☐ │SP01│iPhone  │HN  │A-01  │ 45 │ 42 │Date│ 🟢│👁✏️│ │
│ │ ☐ │SP02│Samsung │HCM │B-03  │  8 │  5 │Date│ 🔴│👁✏️│ │
│ └──────────────────────────────────────────────────┘ │
│ Pagination: Trước | 1 | Sau                          │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ ☐ SP001 - iPhone 15 Pro Max            [Bình thường]│
│ │ 📦 Kho Hà Nội  📍 A-01-02                         │ │
│ │ Tồn thực tế: 45  |  Tồn khả dụng: 42              │ │
│ │ HSD: 2025-06-15                                    │ │
│ │ [Xem] [Sửa] [Xóa]                                 │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Header** (line 150-173):
  - Title: "Quản lý Tồn kho"
  - 3 Buttons:
    - "Nhập kho mới" (bg-primary, Link to /inventory/create)
    - "Xuất kho mới" (bg-success)
    - "Kiểm kê ngay" (bg-warning)
- **Filter Bar** (line 177-247):
  - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
  - 4 filters: Kho, Danh mục, Trạng thái, Tìm kiếm + Camera
- **Desktop Table** (line 250-364):
  - 10 columns: Checkbox, Mã SP, Tên SP, Kho, Vị trí, Tồn thực tế, Tồn khả dụng, HSD, Trạng thái, Thao tác
  - Row colors: bg-green-50 (normal), bg-yellow-50 (low), bg-red-50 (critical)
  - Hover: `hover:opacity-80 transition-opacity`
- **Mobile Cards** (line 367-434):
  - `md:hidden` - Only on mobile
  - Card: `bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4`
  - Status badge: Top right
  - Details: Warehouse, Location, Stock, Expiry
  - Actions: 3 full-width buttons (Xem, Sửa, Xóa)

---

### Page 5: CREATE STOCK IN (`/inventory/create`)

**File:** `src/pages/CreateStockIn.jsx`  
**Auth:** Required  
**Layout:** Dashboard Layout

#### UI Structure:
```
┌──────────────────────────────────────────────────────┐
│ Header: "Tạo phiếu nhập kho mới"                      │
│ Số phiếu: NK-20260714-001                             │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ Section 1: Thông tin chung                       │ │
│ │ ┌────────────────┬────────────────┐             │ │
│ │ │ Ngày nhập      │ Nhà cung cấp  │             │ │
│ │ │ [Date picker]  │ [Select]      │             │ │
│ │ ├────────────────┼────────────────┤             │ │
│ │ │ Kho nhận       │ Người nhập    │             │ │
│ │ │ [Select]       │ [Disabled]    │             │ │
│ │ ├────────────────┴────────────────┤             │ │
│ │ │ Ghi chú                         │             │ │
│ │ │ [Textarea]                      │             │ │
│ │ └─────────────────────────────────┘             │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Section 2: Chi tiết sản phẩm                     │ │
│ │ [Quét mã] [Thêm dòng]                            │ │
│ │ ┌────┬────┬───┬──────┬──────┬────┬───┬───┬───┐  │ │
│ │ │Mã  │Tên │SL │Đơn giá│Thành │Vịtrí│HSD│Lot │🗑│  │ │
│ │ ├────┼────┼───┼──────┼──────┼────┼───┼───┼───┤  │ │
│ │ │[  ]│[  ]│[ ]│[     ]│[     ]│[  ]│[ ]│[ ]│ X │  │ │
│ │ └────┴────┴───┴──────┴──────┴────┴───┴───┴───┘  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Summary Card (Gradient)                           │ │
│ │ Tổng số lượng: 10  |  Tổng tiền: 250.000.000đ   │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
│ Fixed Footer: [Hủy] [Lưu tạm] [Xác nhận nhập kho]   │
└──────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Header** (line 767-772 trong DOCUMENTATION.md):
  - Title: "Tạo phiếu nhập kho mới"
  - Receipt Number: `NK-20260714-001` (font-mono font-semibold text-primary)
- **Section 1: Thông tin chung** (line 777-786):
  - Card: `bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border`
  - Grid: `grid-cols-1 md:grid-cols-2 gap-4`
  - Fields: Ngày nhập, Nhà cung cấp, Kho nhận, Người nhập (disabled), Ghi chú
- **Section 2: Chi tiết sản phẩm** (line 789-818):
  - Header: "Chi tiết sản phẩm" + 2 buttons
  - Table: 9 columns (Mã SP, Tên SP, SL, Đơn giá, Thành tiền, Vị trí, HSD, Lot, Action)
  - Dynamic rows: Add/remove functionality
- **Section 3: Summary** (line 821-827):
  - Gradient: `bg-gradient-to-r from-primary to-blue-600`
  - Tổng số lượng, Tổng tiền (auto-calculate)
- **Fixed Footer** (line 831-837):
  - Position: `fixed bottom-0 left-0 right-0`
  - `margin-left: 256px` (sidebar width)
  - 3 buttons: Hủy, Lưu tạm, Xác nhận nhập kho

---

### Page 6: BIN LOCATION (`/bin-location`)

**File:** `src/pages/BinLocation.jsx`  
**Auth:** Required  
**Layout:** Dashboard Layout (special - no Header component)

#### UI Structure:
```
┌──────────────────────────────────────────────────────┐
│ Header: "Quản lý Vị trí Lưu trữ"                      │
│ [Gợi ý AI] [Chuyển 3D] [In nhãn kệ]                  │
├──────────────────────────────────────────────────────┤
│ ┌──────────┬──────────────────────────────────────┐ │
│ │ Tree View│  2D Grid View                        │ │
│ │ (w-80)   │  (flex-1)                            │ │
│ │          │                                      │ │
│ │ 📦 Kho   │  ┌────┬────┬────┬────┬────┬────┐   │ │
│ │  📁 Dãy A│  │A-01│A-02│A-03│A-04│A-05│A-06│   │ │
│ │   📁 Kệ  │  │ 🟢 │ 🟡 │ 🟢 │ ⬜ │ 🟡 │ 🟢 │   │ │
│ │    📦 Ô  │  │Trống│40% │Trống│   │60% │Trống│   │ │
│ │          │  └────┴────┴────┴────┴────┴────┘   │ │
│ │ 📁 Dãy B │                                      │ │
│ │  📁 Kệ   │  Drag & Drop enabled                 │ │
│ │          │                                      │ │
│ │ ──────── │                                      │ │
│ │ Chú thích │                                      │ │
│ │ 🟢 Trống │                                      │ │
│ │ 🟡 Đang  │                                      │ │
│ │   dùng   │                                      │ │
│ │ 🔴 Đầy   │                                      │ │
│ └──────────┴──────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Header** (line 871-880):
  - Title: "Quản lý Vị trí Lưu trữ"
  - Subtitle: "Quản lý và theo dõi vị trí lưu trữ sản phẩm"
  - 3 Buttons:
    - "Gợi ý vị trí tối ưu bằng AI" (bg-gradient-to-r from-purple-500 to-purple-600, Sparkles icon)
    - "Chuyển sang 3D" (bg-primary, Maximize2 icon)
    - "In nhãn kệ" (bg-gray-100, Printer icon)
- **Tree View** (line 885-924):
  - Width: `w-80 bg-white border-r border-gray-200 overflow-y-auto`
  - Structure: Warehouse → Row → Shelf → Bin
  - Expandable: `expandedNodes` state
  - Icons: ChevronRight/ChevronDown, Warehouse, Box, Package, MapPin
  - Colors: blue-50 (warehouse), white (row), gray-50 (shelf)
- **2D Grid View** (line 927-944):
  - Grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4`
  - Bin cards: `border-2 rounded-lg p-4 cursor-move`
  - Colors: green-100 (empty), yellow-100 (in-use), red-100 (full)
  - Progress bar: `(quantity/capacity) * 100%`
  - Drag & Drop: `draggable`, `onDragStart`, `onDragOver`, `onDrop`
- **Legend** (line 915-922):
  - Background: `bg-gray-50 rounded-lg border`
  - 3 items: Trống (green), Đang dùng (yellow), Đầy (red)

---

### Page 7: REPORTS (`/reports`)

**File:** `src/pages/Reports.jsx`  
**Auth:** Required  
**Layout:** Dashboard Layout

#### UI Structure:
```
┌──────────────────────────────────────────────────────┐
│ Header: "Báo cáo & Thống kê"                          │
│ [📊 Excel] [📄 PDF]                                   │
├──────────────────────────────────────────────────────┤
│ Filter Bar:                                           │
│ ┌──────────┬──────────┬──────────┬──────────┐       │
│ │Loại BC   │ Kho      │ Thời gian│ Áp dụng  │       │
│ │[6 options]│[Select] │[Select]  │ [Button] │       │
│ └──────────┴──────────┴──────────┴──────────┘       │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ Report Content (Dynamic based on type)           │ │
│ │                                                  │ │
│ │  Type 1: Tồn kho tổng hợp                        │ │
│ │  ┌──────────────────────────────────────────┐   │ │
│ │  │ Pie Chart: Điện tử 40%                   │   │ │
│ │  │            Thực phẩm 30%                 │   │ │
│ │  │            Mỹ phẩm 20%                   │   │ │
│ │  │            Khác 10%                      │   │ │
│ │  └──────────────────────────────────────────┘   │ │
│ │                                                  │ │
│ │  Type 2: Nhập - Xuất                            │ │
│ │  ┌──────────────────────────────────────────┐   │ │
│ │  │ Line Chart: Nhập (xanh) / Xuất (đỏ)     │   │ │
│ │  │ 7 ngày                                   │   │ │
│ │  └──────────────────────────────────────────┘   │ │
│ │                                                  │ │
│ │  Type 3-6: Tables                               │ │
│ │  ┌──────────────────────────────────────────┐   │ │
│ │  │ Top 5 bán chạy / Chậm luân chuyển        │   │ │
│ │  │ / Giá trị tồn kho / Sắp hết hạn          │   │ │
│ │  └──────────────────────────────────────────┘   │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Header** (line 1447-1458 trong DOCUMENTATION.md):
  - Title: "Báo cáo & Thống kê"
  - Subtitle: "Báo cáo tồn kho tổng hợp"
  - 2 Export buttons: Excel (bg-green-600), PDF (bg-red-600)
- **Filter Bar** (line 1463-1470):
  - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
  - 4 filters: Loại báo cáo, Kho, Thời gian, Áp dụng
- **6 Report Types** (line 1473-1476):
  1. **Tồn kho tổng hợp**: Pie Chart (4 categories)
  2. **Nhập - Xuất**: Line Chart (7 days, import/export)
  3. **Top bán chạy**: Table (rank 1-5 with badges)
  4. **Chậm luân chuyển**: Table (name, stock, sold, days)
  5. **Giá trị tồn kho**: Bar Chart (4 categories, VND format)
  6. **Sắp hết hạn**: Table (product, lot, expiry, days left with badges)

---

### Page 8: EMPLOYEES (`/employees`)

**File:** `src/pages/Employees.jsx`  
**Auth:** Required (Admin/Manager)  
**Layout:** Dashboard Layout

#### UI Structure:
```
┌──────────────────────────────────────────────────────┐
│ Header: "Quản lý Nhân viên" + "Thêm nhân viên"       │
├──────────────────────────────────────────────────────┤
│ Filter Bar:                                           │
│ ┌────────┬────────┬────────┬────────┐               │
│ │Tìm kiếm │Vai trò │ Kho    │Trạng thái│            │
│ │[Search] │[Select]│[Select]│ [Select] │            │
│ └────────┴────────┴────────┴────────┘               │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ Table                                            │ │
│ │ ┌────┬──────────┬────┬──────┬────┬────┬──────┐  │ │
│ │ │Mã  │ Họ tên   │SĐT │Email │Role │Kho │Sts │Act│  │ │
│ │ ├────┼──────────┼────┼──────┼────┼────┼──────┤  │ │
│ │ │NV01│ Nguyễn Văn│0901│nv@  │QLK  │HN  │ 🟢 │🛡👁│  │ │
│ │ │    │ A (N)     │    │khoai │     │    │    │✏️🗑│  │ │
│ │ └────┴──────────┴────┴──────┴────┴────┴──────┘  │ │
│ └──────────────────────────────────────────────────┘ │
│ Pagination                                            │
└──────────────────────────────────────────────────────┘

Permission Modal (Overlay):
┌──────────────────────────────────────────────────────┐
│ Phân quyền - Nguyễn Văn A                            │
│ Vai trò: Quản lý kho                                  │
├──────────────────────────────────────────────────────┤
│ ☑ Nhập kho - Tạo và xử lý phiếu nhập kho             │
│ ☑ Xuất kho - Tạo và xử lý phiếu xuất kho             │
│ ☑ Quản lý tồn kho                                     │
│ ☐ Xem báo cáo                                         │
│ ☐ Quản lý kho                                         │
│ ☐ Quản lý nhân viên                                   │
│ ☐ Quản lý NCC                                         │
│ ☐ Quản lý sản phẩm                                    │
├──────────────────────────────────────────────────────┤
│ [Hủy] [Lưu phân quyền]                                │
└──────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Header** (line 1121-1126 trong DOCUMENTATION.md):
  - Title: "Quản lý Nhân viên"
  - Button: "Thêm nhân viên" (Link to /employees/create)
- **Filter Bar** (line 1131-1138):
  - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
  - 4 filters: Tìm kiếm, Vai trò, Kho, Trạng thái
- **Table** (line 1141-1167):
  - 8 columns: Mã NV, Họ tên, SĐT, Email, Vai trò, Kho, Trạng thái, Thao tác
  - Avatar: `w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium`
  - Họ tên: Flex row (avatar + name)
  - Trạng thái: `bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs` + UserCheck icon
  - Thao tác: Shield (permissions), Eye, Edit2, Trash2
- **Permission Modal** (line 1172-1193):
  - Overlay: `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`
  - Max width: `max-w-2xl w-full max-h-[90vh] overflow-y-auto`
  - 8 Permissions: Nhập kho, Xuất kho, Quản lý tồn kho, Xem báo cáo, Quản lý kho, Quản lý NV, Quản lý NCC, Quản lý SP

---

### Page 9: SETTINGS (`/settings`)

**File:** `src/pages/Settings.jsx`  
**Auth:** Required (Admin only)  
**Layout:** Dashboard Layout

#### UI Structure:
```
┌──────────────────────────────────────────────────────┐
│ Header: "Cài đặt Hệ thống"                            │
│ "Quản lý cấu hình và tích hợp hệ thống"               │
├──────────────────────────────────────────────────────┤
│ ┌──────────┬──────────────────────────────────────┐ │
│ │ Menu     │  Content Area                        │ │
│ │ (1/4)    │  (3/4)                               │ │
│ │          │                                      │ │
│ │ ┌──────┐ │  ┌────────────────────────────────┐ │ │
│ │ │ 🏢   │ │  │ Section Content                │ │ │
│ │ │Thông  │ │  │ (Dynamic based on selection)   │ │ │
│ │ │tin CTY│ │  │                                │ │ │
│ │ ├──────┤ │  │ 1. Thông tin công ty:           │ │ │
│ │ │ 🏭   │ │  │    - Logo upload                │ │ │
│ │ │Quản   │ │  │    - Company form               │ │ │
│ │ │lý kho │ │  │                                  │ │ │
│ │ ├──────┤ │  │ 2. Quản lý kho:                 │ │ │
│ │ │ ⚙️   │ │  │    - Warehouse list              │ │ │
│ │ │Cấu    │ │  │    - Progress bars               │ │ │
│ │ │hình   │ │  │                                  │ │ │
│ │ │chung  │ │  │ 3. Cấu hình chung:              │ │ │
│ │ ├──────┤ │  │    - 3 toggle switches           │ │ │
│ │ │ 🔌   │ │  │                                  │ │ │
│ │ │Tích   │ │  │ 4. Tích hợp hệ thống:           │ │ │
│ │ │hợp    │ │  │    - 5 integrations              │ │ │
│ │ ├──────┤ │  │    - Connect/Disconnect           │ │ │
│ │ │ 💾   │ │  │                                  │ │ │
│ │ │Sao    │ │  │ 5. Sao lưu & Khôi phục:         │ │ │
│ │ │lưu    │ │  │    - Backup button               │ │ │
│ │ ├──────┤ │  │    - Restore upload               │ │ │
│ │ │ 👥   │ │  │                                  │ │ │
│ │ │Quản   │ │  │ 6. Quản lý người dùng:          │ │ │
│ │ │lý NV  │ │  │    - Link to /employees          │ │ │
│ │ ├──────┤ │  │                                  │ │ │
│ │ │ 🎨   │ │  │ 7. Giao diện & Ngôn ngữ:        │ │ │
│ │ │Giao   │ │  │    - Language select             │ │ │
│ │ │diện   │ │  │    - Color picker                │ │ │
│ │ └──────┘ │  │    - Dark mode toggle            │ │ │
│ │          │  └────────────────────────────────┘ │ │
│ └──────────┴──────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

#### Key Elements:
- **Header** (line 1218-1221 trong DOCUMENTATION.md):
  - Title: "Cài đặt Hệ thống"
  - Subtitle: "Quản lý cấu hình và tích hợp hệ thống"
- **Layout** (line 1224-1248):
  - Grid: `grid-cols-1 lg:grid-cols-4 gap-6`
  - Left Menu (1/4): `lg:col-span-1`
  - Right Content (3/4): `lg:col-span-3`
- **7 Menu Items** (line 1229-1237):
  1. Thông tin công ty (Building2 icon)
  2. Quản lý kho (Warehouse icon)
  3. Cấu hình chung (Settings icon)
  4. Tích hợp hệ thống (Plug icon)
  5. Sao lưu & Khôi phục (HardDrive icon)
  6. Quản lý người dùng (Users icon)
  7. Giao diện & Ngôn ngữ (Palette icon)
- **Active State**: `bg-primary text-white`
- **Inactive State**: `text-gray-700 hover:bg-gray-100`

---

## 🧩 COMPONENT LOCATIONS

### Reusable Components (`src/components/`)

#### 1. Sidebar (`src/components/Sidebar.jsx`)
**Location:** Fixed left, `w-64`, full height  
**Used by:** All dashboard pages (except Login, ForgotPassword)

**Structure:**
```
┌─────────────────────┐
│ Logo: KHO AI        │
│ ─────────────────── │
│ Menu Items:         │
│  - Dashboard        │
│  - Sản phẩm         │
│  - Tồn kho          │
│  - Đơn hàng         │
│  - Nhà cung cấp     │
│  - Nhân viên        │
│  - Báo cáo          │
│  - Thông báo        │
│  - Cài đặt          │
│  - Hồ sơ            │
│ ─────────────────── │
│ User Info:          │
│  - Avatar (NV)      │
│  - Nguyễn Văn A     │
│  - Quản lý kho      │
│  - Đăng xuất button │
└─────────────────────┘
```

**Key Features:**
- Active link highlighting (bg-primary text-white)
- Mobile: Slide-in drawer (fixed overlay)
- User info section at bottom
- Logout button

---

#### 2. Header (`src/components/Header.jsx`)
**Location:** Fixed top, `z-10`, below sidebar  
**Used by:** All dashboard pages

**Structure:**
```
┌──────────────────────────────────────────────────────┐
│ [☰] Page Title              [🔔] [👤]               │
│     Subtitle                                        │
└──────────────────────────────────────────────────────┘
```

**Key Features:**
- Mobile menu toggle (hamburger icon)
- Notification bell with badge (red dot)
- User avatar (circle, bg-primary)
- Search bar (placeholder)

---

#### 3. KPICards (`src/components/KPICards.jsx`)
**Location:** Dashboard page, Row 1  
**Used by:** Dashboard

**Structure:**
```
┌────────┬────────┬────────┬────────┐
│ 📦     │ 🛒     │ 📈     │ ⚠️     │
│ Tổng SP│Đơn hàng│Doanh thu│Cảnh báo│
│ 12,847 │   45   │ 2.5 tỷ │   3    │
│ +12.5% │ +5.2%  │ +8.1%  │  0%    │
└────────┴────────┴────────┴────────┘
```

**Props:**
- `data`: Array of 4 KPI objects
  - `title`, `value`, `change`, `trend`, `sub`, `icon`, `color`

---

#### 4. InventoryChart (`src/components/InventoryChart.jsx`)
**Location:** Dashboard page, Row 2 (left, 70%)  
**Used by:** Dashboard

**Structure:**
```
┌──────────────────────────────────┐
│ Biến động tồn kho 30 ngày        │
│ ┌──────────────────────────────┐ │
│ │ Line Chart (Recharts)        │ │
│ │ - X axis: Date (30 days)     │ │
│ │ - Y axis: Stock quantity     │ │
│ │ - Tooltip on hover           │ │
│ │ - Grid lines                 │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**Props:**
- `data`: Array of `{ date, stock }` objects

---

#### 5. TopProducts (`src/components/TopProducts.jsx`)
**Location:** Dashboard page, Row 2 (right, 30%)  
**Used by:** Dashboard

**Structure:**
```
┌──────────────────────────────────┐
│ Top 5 sản phẩm bán chạy          │
│ ┌──────────────────────────────┐ │
│ │ 1. iPhone 15 Pro Max  ████░ │ │
│ │    245 (85%)                 │ │
│ │ 2. Samsung Galaxy S24  ███░░│ │
│ │    180 (62%)                 │ │
│ │ 3. MacBook Air M2    ███░░  │ │
│ │    120 (42%)                 │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**Props:**
- `data`: Array of `{ rank, name, sold, percent }` objects

---

#### 6. ExpiringProducts (`src/components/ExpiringProducts.jsx`)
**Location:** Dashboard page, Row 3 (left, 50%)  
**Used by:** Dashboard

**Structure:**
```
┌──────────────────────────────────┐
│ Sản phẩm sắp hết hạn             │
│ ┌──────────────────────────────┐ │
│ │ Mã SP │ Tên │ Lô │ HSD │ Còn │ │
│ │ SP001 │ iPhone│L01 │Date │ 5d  │ │
│ │ SP003 │ MacBook│L02│Date │12d  │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**Props:**
- `data`: Array of `{ id, name, lot, expiry, daysLeft, quantity }` objects

---

#### 7. LowInventory (`src/components/LowInventory.jsx`)
**Location:** Dashboard page, Row 3 (right, 50%)  
**Used by:** Dashboard

**Structure:**
```
┌──────────────────────────────────┐
│ Tồn kho thấp                     │
│ ┌──────────────────────────────┐ │
│ │ Mã SP │ Tên │ Tồn │ Min │ Sts │ │
│ │ SP002 │Samsung│  8 │ 10  │⚠️  │ │
│ │ SP006 │Dầu gội│ 25 │ 20  │⚠️  │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**Props:**
- `data`: Array of `{ id, name, sku, stock, minStock, status }` objects

---

## 🔌 API ENDPOINTS MAPPING

### Backend Node.js (`backend/src/index.js`)

#### Implemented APIs:
| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| GET | `/api/health` | Health check | - |
| GET | `/api/dashboard` | Dashboard data (KPIs, charts, tables) | Dashboard page |

#### Planned APIs:
| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| POST | `/api/auth/login` | User login | Login page |
| POST | `/api/auth/logout` | User logout | Header |
| GET | `/api/products` | List products (filter + pagination) | Products page |
| GET | `/api/products/:id` | Product detail | ProductDetail page |
| POST | `/api/products` | Create product | Products page |
| PUT | `/api/products/:id` | Update product | ProductDetail page |
| DELETE | `/api/products/:id` | Delete product | Products page |
| GET | `/api/inventory` | List inventory (filter) | InventoryManagement page |
| POST | `/api/inventory/import` | Create stock in | CreateStockIn page |
| POST | `/api/inventory/export` | Create stock out | CreateStockOut page |
| POST | `/api/inventory/check` | Create inventory check | InventoryCheck page |
| GET | `/api/orders` | List orders (filter + pagination) | Orders page |
| GET | `/api/orders/:id` | Order detail | OrderDetail page |
| POST | `/api/orders` | Create order | Orders page |
| PUT | `/api/orders/:id/status` | Update order status | OrderDetail page |
| DELETE | `/api/orders/:id` | Delete order | Orders page |
| GET | `/api/suppliers` | List suppliers | Suppliers page |
| GET | `/api/suppliers/:id` | Supplier detail | Suppliers page |
| POST | `/api/suppliers` | Create supplier | Suppliers page |
| PUT | `/api/suppliers/:id` | Update supplier | Suppliers page |
| DELETE | `/api/suppliers/:id` | Delete supplier | Suppliers page |
| GET | `/api/employees` | List employees | Employees page |
| GET | `/api/employees/:id` | Employee detail | Employees page |
| POST | `/api/employees` | Create employee | Employees page |
| PUT | `/api/employees/:id` | Update employee | Employees page |
| DELETE | `/api/employees/:id` | Delete employee | Employees page |
| PUT | `/api/employees/:id/permissions` | Update permissions | Employees page |
| GET | `/api/reports/inventory-summary` | Inventory summary report | Reports page |
| GET | `/api/reports/import-export` | Import/Export report | Reports page |
| GET | `/api/reports/top-selling` | Top selling products | Reports page |
| GET | `/api/reports/slow-moving` | Slow moving products | Reports page |
| GET | `/api/reports/inventory-value` | Inventory value report | Reports page |
| GET | `/api/reports/expiry` | Expiry report | Reports page |
| GET | `/api/notifications` | List notifications | Notifications page |
| PUT | `/api/notifications/:id/read` | Mark as read | Notifications page |
| PUT | `/api/notifications/read-all` | Mark all as read | Notifications page |
| DELETE | `/api/notifications/:id` | Delete notification | Notifications page |
| GET | `/api/settings/company` | Get company info | Settings page |
| PUT | `/api/settings/company` | Update company info | Settings page |
| GET | `/api/settings/warehouses` | List warehouses | Settings page |
| POST | `/api/settings/warehouses` | Create warehouse | Settings page |
| GET | `/api/settings/general` | Get general settings | Settings page |
| PUT | `/api/settings/general` | Update general settings | Settings page |

---

## 📊 SUMMARY

### Database Models: 9 models
1. **User** - Người dùng (8 quyền phân biệt)
2. **Warehouse** - Kho hàng
3. **BinLocation** - Vị trí lưu trữ (tree structure)
4. **Product** - Sản phẩm (multi-language)
5. **Inventory** - Tồn kho (unique: product + bin + lot)
6. **Supplier** - Nhà cung cấp
7. **Order** - Đơn hàng (6 trạng thái)
8. **StockReceipt** - Phiếu nhập/xuất (4 loại)
9. **Notification** - Thông báo (5 loại)

### UI Pages: 17 pages
1. **Login** - Auth, 2-column layout
2. **ForgotPassword** - Auth, 2-column layout
3. **Dashboard** - 4 KPIs, 2 charts, 2 tables
4. **Products** - Filter + Table + Pagination
5. **ProductDetail** - 4 tabs (Info, Inventory, History, Documents)
6. **InventoryManagement** - Filter + Table/Cards + Multi-select
7. **CreateStockIn** - Form + Dynamic table + Summary + Fixed footer
8. **CreateStockOut** - Similar to CreateStockIn
9. **InventoryCheck** - Check modes + Scan + Comparison
10. **BinLocation** - Tree view + 2D Grid + Drag & Drop
11. **Orders** - Filter + Table + 5 status colors
12. **OrderDetail** - Info + Items + Timeline
13. **Suppliers** - Filter + Table (9 columns)
14. **Employees** - Filter + Table + Permission modal
15. **Reports** - Filter + 6 report types
16. **Notifications** - Filter tabs + List + Actions
17. **Settings** - 7 menu sections
18. **Profile** - User info + 4 tabs

### Components: 7 reusable components
1. **Sidebar** - Navigation
2. **Header** - Top bar
3. **KPICards** - 4 KPI cards
4. **InventoryChart** - Line chart
5. **TopProducts** - Top 5 list
6. **ExpiringProducts** - Expiry table
7. **LowInventory** - Low stock table

---

**Tài liệu này cung cấp đầy đủ thông tin về:**
- ✅ Database models chi tiết (fields, types, constraints, relations)
- ✅ UI structure của từng trang (layout, elements, positions)
- ✅ Component locations và usage
- ✅ API endpoints mapping

**Cập nhật lần cuối:** 16/07/2026 07:37  
**Người tạo:** AI Assistant