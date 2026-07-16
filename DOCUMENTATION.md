# Tài Liệu Hệ Thống KHO AI - Quản Lý Kho Thông Minh

## 📋 Mục Lục
1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Cấu Trúc Ứng Dụng](#cấu-trúc-ứng-dụng)
3. [Cấu Trúc Layout Chung](#cấu-trúc-layout-chung)
4. [Chi Tiết Từng Màn Hình](#chi-tiết-từng-màn-hình)
5. [Phân Quyền Người Dùng](#phân-quyền-người-dùng)
6. [Luồng Nghiệp Vụ Chính](#luồng-nghiệp-vụ-chính)
7. [Design System](#design-system)
8. [Cài Đặt & Chạy](#cài-đặt--chạy-ứng-dụng)

---

## 🎯 Tổng Quan Hệ Thống

**KHO AI** là hệ thống quản lý kho hàng thông minh, tích hợp AI để tối ưu hóa hoạt động kinh doanh.

**Tính năng chính:**
- ✅ Quản lý sản phẩm và tồn kho real-time
- ✅ Tối ưu vị trí lưu trữ với AI
- ✅ Quản lý đơn hàng và nhà cung cấp
- ✅ Báo cáo & phân tích chuyên sâu (6 loại báo cáo)
- ✅ Phân quyền chi tiết theo vai trò (4 vai trò)
- ✅ Dark mode & responsive design
- ✅ Import/Export dữ liệu (Excel, PDF)
- ✅ Quét mã vạch, Kiểm kê kho
- ✅ Thông báo realtime

**Công nghệ sử dụng:**
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 18 | Frontend framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| Lucide React | - | Icons |
| React Router | v6 | Routing |
| Recharts | 2 | Charts (Line, Bar, Pie) |

---

## 🏗️ Cấu Trúc Ứng Dụng

```
kho-ai/
├── public/
│   └── logo.svg                    # Logo ứng dụng
├── src/
│   ├── components/                 # Components tái sử dụng
│   │   ├── Sidebar.jsx             # Sidebar navigation (250px)
│   │   └── Header.jsx              # Header chính (nếu có)
│   ├── pages/                      # 17 trang chính
│   │   ├── Login.jsx               # Auth: Đăng nhập
│   │   ├── ForgotPassword.jsx      # Auth: Quên mật khẩu
│   │   ├── Dashboard.jsx           # Trang chủ: KPIs + Charts
│   │   ├── Products.jsx            # CRUD: Sản phẩm
│   │   ├── ProductDetail.jsx       # CRUD: Chi tiết SP (4 tabs)
│   │   ├── InventoryManagement.jsx # Kho: Quản lý tồn kho
│   │   ├── CreateStockIn.jsx       # Kho: Nhập kho
│   │   ├── CreateStockOut.jsx      # Kho: Xuất kho
│   │   ├── InventoryCheck.jsx      # Kho: Kiểm kê
│   │   ├── BinLocation.jsx         # Kho: Vị trí lưu trữ (2D/3D)
│   │   ├── Orders.jsx              # Đơn hàng: Danh sách
│   │   ├── OrderDetail.jsx         # Đơn hàng: Chi tiết
│   │   ├── Suppliers.jsx           # NCC: Danh sách
│   │   ├── Employees.jsx           # NV: Danh sách + phân quyền
│   │   ├── Reports.jsx             # Báo cáo: 6 loại biểu đồ
│   │   ├── Profile.jsx             # Cá nhân: 4 tabs cài đặt
│   │   ├── Settings.jsx            # Hệ thống: 7 menu cấu hình
│   │   └── Notifications.jsx       # Thông báo: Real-time
│   ├── contexts/
│   │   └── ThemeContext.jsx         # Dark mode context
│   ├── App.jsx                     # Root: Routes + Layout
│   ├── index.css                   # Global styles + Scrollbar
│   └── main.jsx                    # Entry point
├── tailwind.config.js              # Tailwind config
├── vite.config.js                  # Vite config
├── package.json                    # Dependencies
└── DOCUMENTATION.md                # Tài liệu này
```

---

## 🏛️ Cấu Trúc Layout Chung

### 1. Layout Auth Pages (Login, ForgotPassword)

```
App.jsx: <Router>
  └── Route path="/login" → Login.jsx
  └── Route path="/forgot-password" → ForgotPassword.jsx
```

**Cấu trúc CSS:**
```html
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
  <!-- Cột trái: Branding (hidden on mobile) -->
  <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700 ...">
    <!-- Gradient xanh dương, Logo, Slogan -->
  </div>
  
  <!-- Cột phải: Form -->
  <div class="flex-1 flex items-center justify-center p-8">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl ...">
        <!-- Form content -->
      </div>
    </div>
  </div>
</div>
```

**Scroll behavior:** `min-h-screen` (full viewport, body scroll)

---

### 2. Layout Dashboard Pages (có Sidebar)

**App.jsx cấu trúc root:**
```html
<div class="flex h-screen bg-gray-50">
  <!-- Sidebar: Fixed, Full height -->
  <Sidebar />
  
  <!-- Content Wrapper: Flex, overflow-hidden -->
  <div class="flex-1 flex flex-col overflow-hidden ml-64">
    <Routes>
      <!-- Mỗi page tự quản lý scroll -->
      <Route path="/" element={<Dashboard />} />
      ...
    </Routes>
  </div>
</div>
```

**Mỗi page có cấu trúc:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- Header: Fixed top, không scroll -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold">Page Title</h1>
      <p class="text-sm text-gray-600">Subtitle</p>
    </div>
  </div>
  
  <!-- Content: Scroll được, có padding-bottom 24px (pb-6) -->
  <div class="p-6">
    ...
    <!-- Tables, Cards, Forms -->
    ...
  </div>
</div>
```

**Giải thích CSS classes:**
| Class | Mục đích |
|-------|----------|
| `flex flex-col` | Flex container dọc, header cố định, content scroll |
| `overflow-y-auto` | Chỉ content được scroll, không scroll body |
| `pb-6` | Padding bottom 24px để tránh bị Taskbar che |
| `ml-64` | Margin left 256px (bằng width sidebar) |

---

## 📱 Chi Tiết Từng Màn Hình

### 1. 🔐 Trang Đăng Nhập (Login)

**Route:** `/login`
**Auth:** Public (không cần đăng nhập)

**File:** `src/pages/Login.jsx`
**Layout:** Auth Layout (2 cột, không sidebar)

**Cấu trúc HTML:**
```html
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
  
  <!-- LEFT: Branding Column (50%) - Desktop only -->
  <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700 text-white p-12 flex-col justify-between relative overflow-hidden">
    <!-- Background circles decoration -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
    </div>
    
    <!-- Logo area -->
    <div class="relative z-10">
      <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
        <Lock class="w-10 h-10 text-primary" />
      </div>
      <h1 class="text-3xl font-bold">KHO AI</h1>
      <p class="text-blue-100 text-sm">Quản lý kho thông minh</p>
    </div>
    
    <!-- Features list -->
    <div class="relative z-10 flex-1 flex flex-col justify-center">
      <h2 class="text-4xl font-bold mb-4">Quản lý kho thông minh</h2>
      <p class="text-blue-100 text-lg mb-8">Giải pháp quản lý kho hàng toàn diện</p>
      <!-- 3 feature items with dots -->
    </div>
  </div>

  <!-- RIGHT: Form Column (50%) -->
  <div class="flex-1 flex items-center justify-center p-8">
    <div class="w-full max-w-md">
      <!-- Mobile Logo (hidden on desktop) -->
      <div class="lg:hidden flex items-center justify-center gap-3 mb-8">...</div>
      
      <!-- Form Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 class="text-3xl font-bold mb-2">Đăng nhập</h2>
        <p class="text-sm text-gray-600 mb-8">Chào mừng bạn quay trở lại!</p>
        
        <form class="space-y-6">
          <!-- Login Type Toggle (Email/Phone) -->
          <div class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button class="flex-1 py-2 px-4 rounded-md text-sm font-medium ...">
              <Mail class="w-4 h-4 inline mr-1" /> Email
            </button>
            <button class="flex-1 py-2 px-4 rounded-md text-sm font-medium ...">
              <Phone class="w-4 h-4 inline mr-1" /> Số điện thoại
            </button>
          </div>
          
          <!-- Email/Phone Input with icon -->
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" class="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          
          <!-- Password Input with show/hide -->
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" class="w-full pl-10 pr-12 py-3 border rounded-lg ..." />
            <button class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Eye/EyeOff class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Remember me + Forgot password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="w-4 h-4 text-primary rounded" />
              <span class="text-sm text-gray-700">Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password" class="text-sm text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          
          <!-- Submit button -->
          <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 font-medium text-lg">
            ĐĂNG NHẬP
          </button>
          
          <!-- Social login divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>
          
          <!-- Social buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button class="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <svg class="w-5 h-5" /> Google
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              Zalo
            </button>
          </div>
        </form>
        
        <!-- Register link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?
          <a href="#" class="text-primary font-medium hover:underline">Đăng ký dùng thử miễn phí</a>
        </p>
      </div>
    </div>
  </div>
</div>
```

**States:**
| State | UI |
|-------|-----|
| Default | Form trống, tất cả inputs enabled |
| Loading | Button "Đăng nhập" → spinner/disabled, inputs disabled |
| Error | Alert đỏ + error message |
| Success | Redirect to Dashboard |

**CSS Classes chi tiết:**
- Container: `min-h-screen bg-gray-50 dark:bg-gray-900 flex`
- Branding: `hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700`
- Form card: `bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200`
- Input: `w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary`
- Button primary: `w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 font-medium text-lg shadow-sm`

---

### 2. 📊 Dashboard (Trang Chủ)

**Route:** `/`
**Auth:** Required

**File:** `src/pages/Dashboard.jsx`
**Layout:** Dashboard Layout (có sidebar)

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div class="flex items-center gap-4">
          <!-- Notification icon with badge -->
          <button class="relative">
            <Bell class="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
          <!-- Avatar -->
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">NV</div>
        </div>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6 space-y-6">
    
    <!-- ROW 1: 4 KPI Cards (grid 4 cột) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1: Tổng sản phẩm -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Package class="w-6 h-6 text-primary" />
          </div>
        </div>
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng sản phẩm</h3>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">12,847</p>
        <div class="flex items-center gap-1 mt-2">
          <TrendingUp class="w-4 h-4 text-green-600" />
          <span class="text-sm font-medium text-green-600">+12.5%</span>
          <span class="text-sm text-gray-500">vs tháng trước</span>
        </div>
      </div>
      
      <!-- Card 2: Đơn hàng hôm nay (bg-green-100, icon ShoppingCart) -->
      <!-- Card 3: Doanh thu tháng (bg-purple-100, icon TrendingUp) -->
      <!-- Card 4: Cảnh báo tồn kho (bg-orange-100, icon AlertTriangle) -->
    </div>

    <!-- ROW 2: Chart (70%) + Top Products (30%) -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Line Chart (70% = col-span-3) -->
      <div class="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold mb-4">Biến động tồn kho 30 ngày</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="stock" stroke="#007BFF" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <!-- Top 5 Products (30% = col-span-2) -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold mb-4">Top 5 sản phẩm bán chạy</h3>
        <div class="space-y-4">
          <!-- Product item x5 -->
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm">1</span>
            <div class="flex-1">
              <p class="text-sm font-medium">iPhone 15 Pro Max</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div class="bg-primary h-2 rounded-full" style="width: 85%"></div>
              </div>
            </div>
            <span class="text-sm font-semibold text-gray-900">245</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 3: 2 Tables (50/50) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Table 1: Sản phẩm sắp hết hạn -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="font-semibold">Sản phẩm sắp hết hạn</h3>
        </div>
        <table class="w-full">...</table>
      </div>
      
      <!-- Table 2: Tồn kho thấp -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="font-semibold">Tồn kho thấp</h3>
        </div>
        <table class="w-full">...</table>
      </div>
    </div>

  </div>
</div>
```

**Components:**
| Component | Props | Mô tả |
|-----------|-------|-------|
| KPI Cards | title, value, change, icon, color | 4 card chỉ số |
| Line Chart | data, height | Biến động tồn kho 30 ngày |
| Top Products | items: {name, sold, percent} | Top 5 bán chạy |
| Expiring Table | items: {name, lot, expiry, daysLeft, qty} | Sắp hết hạn |
| Low Inventory | items: {name, sku, stock, min, status} | Tồn kho thấp |

**Grid system:**
- Row 1: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (4 KPI cards)
- Row 2: `grid-cols-1 lg:grid-cols-5` (Chart 3/5 + Top 2/5)
- Row 3: `grid-cols-1 lg:grid-cols-2` (2 tables)

---

### 3. 📦 Quản Lý Sản Phẩm (Products)

**Route:** `/products`
**Auth:** Required

**File:** `src/pages/Products.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER với button "Thêm sản phẩm" -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Quản lý Sản phẩm</h1>
      <button class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
        <Plus class="w-5 h-5" />
        <span>Thêm sản phẩm</span>
      </button>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6">
    <!-- Filter Bar -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border ...">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Search Input -->
        <div>
          <label>Tìm kiếm</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Tìm mã SP, tên sản phẩm..." class="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
        </div>
        <!-- Category Dropdown -->
        <div>
          <label>Danh mục</label>
          <div class="relative">
            <select class="w-full px-3 py-2 border rounded-lg appearance-none">
              <option>Tất cả danh mục</option>
              <option>Điện tử</option>
              <option>Thực phẩm</option>
              <option>Mỹ phẩm</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 text-gray-400" />
          </div>
        </div>
        <!-- Status Dropdown -->
        ...
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700 border-b">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Mã SP</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Tên sản phẩm</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Danh mục</th>
              <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Giá bán</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Tồn kho</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Trạng thái</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Dynamic rows -->
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3"><span class="font-mono font-medium">SP001</span></td>
              <td class="px-4 py-3">
                <Link to="/products/SP001" class="text-primary hover:underline">iPhone 15 Pro Max</Link>
              </td>
              <td class="px-4 py-3"><span>Điện tử</span></td>
              <td class="px-4 py-3 text-right"><span class="font-semibold">25.000.000đ</span></td>
              <td class="px-4 py-3 text-center"><span class="font-bold">45</span></td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-300">Active</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-center gap-2">
                  <button class="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye class="w-4 h-4" /></button>
                  <button class="p-1 text-green-600 hover:bg-green-50 rounded"><Edit2 class="w-4 h-4" /></button>
                  <button class="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 class="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-4 py-3 border-t flex justify-between items-center">
        <span class="text-sm text-gray-700">Hiển thị 1 đến 8 của 8 kết quả</span>
        <div class="flex gap-2">
          <button class="px-3 py-1 border rounded disabled:opacity-50" disabled>Trước</button>
          <button class="px-3 py-1 bg-primary text-white rounded">1</button>
          <button class="px-3 py-1 border rounded hover:bg-gray-50">Sau</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Data Flow:**
```javascript
// State management
const [searchQuery, setSearchQuery] = useState('')
const [selectedCategory, setSelectedCategory] = useState('all')

// Sample data
const products = [
  { id, code, name, category, price, stock, status },
  ...
]

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}
```

**CSS Classes chi tiết:**
- Table head: `bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600`
- Table row: `hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`
- Table cell: `px-4 py-3 text-sm`
- Status badge: `inline-flex px-2 py-1 text-xs font-medium rounded-full border`

---

### 4. 🔍 Chi Tiết Sản Phẩm (Product Detail)

**Route:** `/products/:code`
**Auth:** Required

**File:** `src/pages/ProductDetail.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER với 3 actions buttons -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left: Title + Product Code -->
        <div>
          <h1 class="text-2xl font-bold">Chi tiết Sản phẩm</h1>
          <p class="text-sm text-gray-600">Mã SP: <span class="font-mono font-semibold text-primary">SP001</span></p>
        </div>
        <!-- Right: Action Buttons -->
        <div class="flex gap-2">
          <button class="bg-primary text-white px-4 py-2 rounded-lg"><Edit2 /> Chỉnh sửa</button>
          <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"><Printer /> In mã vạch</button>
          <button class="bg-red-600 text-white px-4 py-2 rounded-lg"><Trash2 /> Xóa</button>
        </div>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6">
    <!-- TABS Navigation -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border ... mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px overflow-x-auto">
          <button class="flex items-center gap-2 px-6 py-4 border-b-2 border-primary text-primary font-medium">
            <FileText class="w-4 h-4" /> Thông tin chung
          </button>
          <button class="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-gray-500">
            <Package class="w-4 h-4" /> Tồn kho theo kho
          </button>
          <button class="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-gray-500">
            <Clock class="w-4 h-4" /> Lịch sử
          </button>
          <button class="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-gray-500">
            <Image class="w-4 h-4" /> Tài liệu
          </button>
        </nav>
      </div>
    </div>
  </div>
</div>
```

**4 Tabs chi tiết:**

**Tab 1: Thông tin chung**
- Layout 2 cột: `grid grid-cols-1 lg:grid-cols-3 gap-6`
- Cột trái (1/3): `lg:col-span-1` - Ảnh sản phẩm + Upload
- Cột phải (2/3): `lg:col-span-2` - Form fields (grid 2 cột)
- Mỗi field có label + input/select với icon
- Input disabled khi không ở edit mode

**Tab 2: Tồn kho theo kho**
- Bảng đơn giản: Kho | Tồn thực tế | Tồn khả dụng | Vị trí
- Dữ liệu từ `inventoryByWarehouse` array

**Tab 3: Lịch sử nhập-xuất**
- Filter: Khoảng thời gian + Loại giao dịch
- Bảng: Loại (icon) | Ngày | Số lượng | Mã phiếu | Kho
- Import: icon `TrendingUp` màu xanh lá
- Export: icon `TrendingDown` màu đỏ

**Tab 4: Hình ảnh & Tài liệu**
- Grid images: `grid grid-cols-2 md:grid-cols-4 gap-4`
- Upload placeholder: border dashed
- Documents list: file icon + tên + kích thước + download button

**Edit Mode:**
- Button "Chỉnh sửa" toggle `isEditing` state
- Edit mode: inputs enabled, có thể thay đổi
- View mode: inputs disabled (class `disabled:bg-gray-100`)

---

### 5. 📥 Quản Lý Tồn Kho (Inventory Management)

**Route:** `/inventory`
**Auth:** Required

**File:** `src/pages/InventoryManagement.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER với 3 action buttons -->
  <div class="bg-white ...">
    <div class="px-6 py-4">
      <div class="flex justify-between">
        <h1>Quản lý Tồn kho</h1>
        <div class="flex gap-3">
          <Link to="/inventory/create"><button class="bg-primary text-white px-4 py-2 rounded-lg"><Plus /> Nhập kho mới</button></Link>
          <button class="bg-success text-white px-4 py-2 rounded-lg"><Plus /> Xuất kho mới</button>
          <button class="bg-warning text-white px-4 py-2 rounded-lg"><Package /> Kiểm kê ngay</button>
        </div>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6">
    <!-- Filter Bar: 4 dropdowns (Kho, Danh mục, Trạng thái, Tìm kiếm + Scan) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border ...">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Kho dropdown -->
        <!-- Danh mục dropdown -->
        <!-- Trạng thái dropdown -->
        <!-- Search input + Scan button -->
      </div>
    </div>

    <!-- TABLE Desktop: hidden md:block -->
    <div class="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border ...">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>  <!-- Select all -->
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Kho</th>
              <th>Vị trí</th>
              <th>Tồn thực tế</th>
              <th>Tồn khả dụng</th>
              <th>Hạn sử dụng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <!-- Row with status color: normal(green) / low(yellow) / critical(red) -->
            <tr class="bg-green-50 hover:opacity-80 transition-opacity">
              <td><input type="checkbox" /></td>
              <td class="font-mono">SP001</td>
              <td><Link to="/products/SP001">iPhone 15 Pro Max</Link></td>
              <td><Package /> Kho Hà Nội</td>
              <td><MapPin /> A-01-02</td>
              <td class="font-bold text-center">45</td>
              <td class="text-center">42</td>
              <td><Calendar /> 2025-06-15</td>
              <td><span class="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs">Bình thường</span></td>
              <td><Eye /> <Edit2 /> <Trash2 /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
    </div>

    <!-- CARDS Mobile: md:hidden -->
    <div class="md:hidden space-y-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 bg-green-50">
        <!-- Card content: checkbox, code, name, status, details, actions -->
      </div>
    </div>
  </div>
</div>
```

**Row Status Colors:**
| Status | Class | Ý nghĩa |
|--------|-------|---------|
| normal | `bg-green-50` | Tồn kho bình thường |
| low | `bg-yellow-50` | Tồn kho thấp |
| critical | `bg-red-50` | Tồn kho nguy cấp |

**Multi-select:**
- Checkbox trong thead: toggle all
- Checkbox mỗi row: toggle 1 item
- State: `selectedRows` (array of ids)

**Mobile/Desktop Responsive:**
- Desktop (>=768px): `hidden md:block` table
- Mobile (<768px): `md:hidden` cards
- Mỗi card có: Code, Name, Warehouse, Location, Stock, Expiry, Actions

---

### 6. ➕ Tạo Phiếu Nhập Kho (Create Stock In)

**Route:** `/inventory/create`
**Auth:** Required

**File:** `src/pages/CreateStockIn.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-24">
  <!-- HEADER + Receipt Number -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4">
      <h1>Tạo phiếu nhập kho mới</h1>
      <p>Số phiếu: <span class="font-mono font-semibold text-primary">NK-20260714-001</span></p>
    </div>
  </div>

  <!-- CONTENT: max-w-7xl mx-auto -->
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Section 1: Thông tin chung (grid 2 cột) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border ...">
      <h2 class="text-lg font-semibold mb-4">Thông tin chung</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label><Calendar /> Ngày nhập</label><input type="date" /></div>
        <div><label><User /> Nhà cung cấp</label><select>...</select></div>
        <div><label><Warehouse /> Kho nhận</label><select>...</select></div>
        <div><label><User /> Người nhập</label><input disabled /></div>
        <div class="md:col-span-2"><label><FileText /> Ghi chú</label><textarea rows="3" /></div>
      </div>
    </div>

    <!-- Section 2: Chi tiết sản phẩm (Table) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border ...">
      <div class="px-6 py-4 border-b flex justify-between">
        <h2>Chi tiết sản phẩm</h2>
        <div class="flex gap-2">
          <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"><Camera /> Quét mã</button>
          <button class="bg-primary text-white px-4 py-2 rounded-lg"><Plus /> Thêm dòng</button>
        </div>
      </div>
      <!-- Dynamic table with input fields -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr><th>Mã SP</th><th>Tên SP</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th><th>Vị trí</th><th>HSD</th><th>Lot</th><th></th></tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" placeholder="Mã SP" /></td>
              <td><input type="text" placeholder="Tên SP" /></td>
              <td><input type="number" min="0" class="w-20 text-center" /></td>
              <td><input type="number" min="0" class="w-32 text-right" /></td>
              <td class="text-right font-semibold">250.000.000đ</td>
              <td><MapPin /><input placeholder="Vị trí" /></td>
              <td><input type="date" /></td>
              <td><input placeholder="Lot" /></td>
              <td><button class="text-red-600"><Trash2 /></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 3: Summary (Gradient card) -->
    <div class="bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-md p-6 text-white">
      <div class="flex justify-between items-center">
        <div><p class="text-blue-100 text-sm">Tổng số lượng</p><p class="text-3xl font-bold">10</p></div>
        <div class="h-16 w-px bg-blue-400"></div>
        <div><p class="text-blue-100 text-sm">Tổng tiền</p><p class="text-3xl font-bold">250.000.000đ</p></div>
      </div>
    </div>
  </div>

  <!-- FIXED FOOTER: Actions (Hủy, Lưu tạm, Xác nhận) -->
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 shadow-lg z-10" style="margin-left: 256px">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-end gap-3">
      <button class="border px-6 py-3 rounded-lg"><X /> Hủy</button>
      <button class="border border-primary text-primary px-6 py-3 rounded-lg"><Save /> Lưu tạm</button>
      <button class="bg-success text-white px-6 py-3 rounded-lg"><Check /> Xác nhận nhập kho</button>
    </div>
  </div>
</div>
```

**Dynamic Product Rows:**
- State: `products` array
- `addProductRow()`: thêm row mới với default values
- `removeProductRow(id)`: xóa row theo id
- `updateProduct(id, field, value)`: cập nhật field trong row
- `calculateTotal()`: sum of (quantity * unitPrice)

**Summary Card:**
- Background: `bg-gradient-to-r from-primary to-blue-600`
- Hiển thị tổng số lượng và tổng tiền
- Auto-calculate khi thay đổi products

**Fixed Footer:**
- Position: `fixed bottom-0`
- Width adjusted: `margin-left: 256px` (sidebar width)
- Z-index: `z-10` để luôn trên cùng

---

### 7. 📍 Quản Lý Vị Trí Lưu Trữ (Bin Location)

**Route:** `/bin-location`
**Auth:** Required

**File:** `src/pages/BinLocation.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER với AI và View mode buttons -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b px-6 py-4">
    <div class="flex items-center justify-between">
      <div><h1>Quản lý Vị trí Lưu trữ</h1><p class="text-sm text-gray-600">Quản lý và theo dõi vị trí lưu trữ sản phẩm</p></div>
      <div class="flex gap-3">
        <button class="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg"><Sparkles /> Gợi ý vị trí tối ưu bằng AI</button>
        <button class="bg-primary text-white px-4 py-2 rounded-lg"><Maximize2 /> Chuyển sang 3D</button>
        <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"><Printer /> In nhãn kệ</button>
      </div>
    </div>
  </div>

  <!-- MAIN CONTENT: flex-1 flex -->
  <div class="flex-1 flex overflow-hidden">
    <!-- LEFT: Tree View (w-80) -->
    <div class="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div class="p-4">
        <h2>Cấu trúc kho</h2>
        <!-- Warehouse > Rows > Shelves > Bins -->
        <div class="space-y-1">
          <div class="border rounded-lg p-3 bg-blue-50">
            <div class="flex items-center gap-2 cursor-pointer" onClick={toggleNode('warehouse')}>
              <ChevronDown/> <Warehouse/> <span>Kho Hà Nội</span>
            </div>
            <!-- Expandable rows -->
            <div class="ml-6 mt-2">
              <div class="border rounded-lg p-2 bg-white">
                <div onClick={toggleNode('row1')}><ChevronRight/> <Box/> Dãy A</div>
                <div class="ml-6 mt-1">
                  <div class="border rounded p-2 bg-gray-50">
                    <div onClick={toggleNode('shelf1')}><ChevronDown/> <Package/> Kệ A-01</div>
                    <div class="ml-6 mt-1">
                      <div class="flex items-center gap-2 p-1 rounded hover:bg-gray-100 cursor-pointer">
                        <MapPin/> <span class="text-xs font-mono">A-01-01</span>
                        <span class="text-xs truncate">iPhone 15</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Legend -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h3>Chú thích</h3>
          <div class="space-y-2">
            <div class="flex items-center gap-2"><div class="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div> Trống</div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div> Đang dùng</div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div> Đầy</div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT: Grid View (flex-1) -->
    <div class="flex-1 overflow-y-auto p-6">
      <h2>View 2D - Kệ A-01</h2>
      <!-- 2D Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <div class="border-2 rounded-lg p-4 cursor-move bg-green-100 border-green-300" draggable>
          <GripVertical /> A-01-03
          <Package /> Trống
        </div>
        <div class="border-2 rounded-lg p-4 cursor-move bg-yellow-100 border-yellow-300" draggable>
          <GripVertical /> A-01-02
          <p>Samsung S24</p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-yellow-500 h-2 rounded-full" style="width: 40%"></div>
          </div>
          <p>20/50 (40%)</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Tree View:**
- Expandable: `expandedNodes` state
- Toggle: `ChevronRight`/`ChevronDown` icons
- Structure: Warehouse → Row (Dãy) → Shelf (Kệ) → Bin (Ô)
- Mỗi level có background color khác nhau

**2D Grid:**
- Responsive grid: `grid-cols-2` đến `grid-cols-6`
- Drag & Drop: `draggable`, `onDragStart`, `onDragOver`, `onDrop`
- Bin colors: green (empty), yellow (in-use), red (full)
- Progress bar: `(quantity/capacity) * 100%`

**3D View:**
- Placeholder với border dashed
- Text: "Tính năng đang được phát triển"

---

### 8. 🛒 Quản Lý Đơn Hàng (Orders)

**Route:** `/orders`
**Auth:** Required

**File:** `src/pages/Orders.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER + "Tạo đơn hàng mới" button -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4 flex justify-between">
      <h1>Quản lý Đơn hàng</h1>
      <button class="bg-primary text-white px-4 py-2 rounded-lg"><Plus /> Tạo đơn hàng mới</button>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6">
    <!-- Filter Bar: 5 filters (grid 5 cột) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border ...">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div><label>Trạng thái</label><select>...</select></div>
        <div><label>Kho</label><select>...</select></div>
        <div><label>Thời gian</label><select>...</select></div>
        <div class="lg:col-span-2"><label>Tìm kiếm</label><input placeholder="Tìm mã đơn, tên KH..." /></div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr><th>Mã đơn</th><th>Khách hàng</th><th>Ngày tạo</th><th>Tổng tiền</th><th>SP</th><th>Trạng thái</th><th>Kho xuất</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono">DH20241114001</td>
              <td><p class="font-medium">Nguyễn Văn A</p><p class="text-xs text-gray-500">0901234567</p></td>
              <td>14/11/2024</td>
              <td class="text-right font-semibold">12.500.000đ</td>
              <td class="text-center">3 SP</td>
              <td><span class="bg-yellow-100 text-yellow-700 rounded-full px-2 py-1 text-xs">Chờ xác nhận</span></td>
              <td><MapPin /> Kho Hà Nội</td>
              <td><Eye /> <Printer /> <X /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
    </div>
  </div>
</div>
```

**5 Status Colors:**
| Trạng thái | Màu | Class |
|------------|-----|-------|
| Chờ xác nhận | 🟡 Vàng | `bg-yellow-100 text-yellow-700 border-yellow-300` |
| Đã xác nhận | 🔵 Xanh dương | `bg-blue-100 text-blue-700 border-blue-300` |
| Đang giao | 🟣 Tím | `bg-purple-100 text-purple-700 border-purple-300` |
| Hoàn thành | 🟢 Xanh lá | `bg-green-100 text-green-700 border-green-300` |
| Hủy | 🔴 Đỏ | `bg-red-100 text-red-700 border-red-300` |

**Action Buttons (mỗi row):**
- `Eye` → Link to `/orders/:id` (OrderDetail)
- `Printer` → In đơn (console.log)
- `X` (Xóa) → Chỉ hiển thị khi status != 'cancelled' và status != 'completed'

---

### 9. 🏭 Quản Lý Nhà Cung Cấp (Suppliers)

**Route:** `/suppliers`
**Auth:** Required

**File:** `src/pages/Suppliers.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER + "Thêm nhà cung cấp mới" -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4 flex justify-between">
      <h1>Quản lý Nhà cung cấp</h1>
      <Link to="/suppliers/create"><button class="bg-primary text-white px-4 py-2 rounded-lg"><Plus /> Thêm nhà cung cấp mới</button></Link>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6">
    <!-- Filter: Search + Status + Total -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border ...">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><input placeholder="Tìm mã NCC, tên nhà cung cấp..." /></div>
        <div><select>...</select></div>
        <div class="hidden lg:block"><p>Tổng: 5 nhà cung cấp</p></div>
      </div>
    </div>

    <!-- Suppliers Table (9 columns) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr><th>Mã NCC</th><th>Tên NCC</th><th>SĐT</th><th>Email</th><th>Địa chỉ</th><th>Giao</th><th>Giá trị</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono">NCC001</td>
              <td><p class="font-medium">Apple Vietnam</p><p class="text-xs">LH: Nguyễn Văn A</p></td>
              <td><Phone /> 19001234</td>
              <td><Mail /> contact@apple.com.vn</td>
              <td><MapPin /> Hà Nội</td>
              <td class="text-center font-bold">45</td>
              <td class="text-right font-semibold">2.500.000.000đ</td>
              <td><span class="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs">Đang hợp tác</span></td>
              <td><Eye /> <Edit2 /> <Trash2 /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
    </div>
  </div>
</div>
```

**Table Columns:**
1. Mã NCC (font-mono, font-medium)
2. Tên NCC + Người liên hệ (2 dòng)
3. SĐT (Phone icon)
4. Email (Mail icon)
5. Địa chỉ (MapPin icon, truncate)
6. Số lần giao (font-bold, text-center)
7. Tổng giá trị (font-semibold, text-right, format VND)
8. Trạng thái (rounded-full badge)
9. Actions (Eye, Edit2, Trash2 icons)

---

### 10. 👥 Quản Lý Nhân Viên (Employees)

**Route:** `/employees`
**Auth:** Required (Admin/Manager)

**File:** `src/pages/Employees.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER + "Thêm nhân viên" -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4 flex justify-between">
      <h1>Quản lý Nhân viên</h1>
      <Link to="/employees/create"><button class="bg-primary text-white px-4 py-2 rounded-lg"><Plus /> Thêm nhân viên</button></Link>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6">
    <!-- Filter: 4 filters (grid 4) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border ...">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><Search /> <input placeholder="Tìm mã NV, họ tên..." /></div>
        <div><select>Vai trò</select></div>
        <div><select>Kho</select></div>
        <div><select>Trạng thái</select></div>
      </div>
    </div>

    <!-- Employees Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr><th>Mã NV</th><th>Họ tên</th><th>SĐT</th><th>Email</th><th>Vai trò</th><th>Kho</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono">NV001</td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">N</div>
                  <span>Nguyễn Văn A</span>
                </div>
              </td>
              <td><Phone /> 0901234567</td>
              <td><Mail /> nguyenvana@khoai.com</td>
              <td>Quản lý kho</td>
              <td>Kho Hà Nội</td>
              <td><span class="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs"><UserCheck /> Đang làm việc</span></td>
              <td><Shield /> <Eye /> <Edit2 /> <Trash2 /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
    </div>
  </div>
</div>
```

**Permission Modal (overlay):**
```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <!-- Header: Title + Employee Name + Close -->
    <div class="p-6 border-b"><h2>Phân quyền - Nguyễn Văn A</h2><p>Vai trò: Quản lý kho</p></div>
    <!-- Permissions List -->
    <div class="p-6 space-y-3">
      <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <input type="checkbox" class="w-4 h-4 text-primary rounded" checked />
        <div><label>Nhập kho</label><p class="text-xs text-gray-500">Tạo và xử lý phiếu nhập kho</p></div>
      </div>
      <!-- 7 more permissions -->
    </div>
    <!-- Footer: Hủy + Lưu -->
    <div class="p-6 border-t flex justify-end gap-3">
      <button class="border px-4 py-2 rounded-lg">Hủy</button>
      <button class="bg-primary text-white px-4 py-2 rounded-lg">Lưu phân quyền</button>
    </div>
  </div>
</div>
```

**8 Permissions:**
1. Nhập kho (`import`)
2. Xuất kho (`export`)
3. Quản lý tồn kho (`inventory`)
4. Xem báo cáo (`reports`)
5. Quản lý kho (`manage_warehouse`)
6. Quản lý nhân viên (`manage_employees`)
7. Quản lý nhà cung cấp (`manage_suppliers`)
8. Quản lý sản phẩm (`manage_products`)

---

### 11. ⚙️ Cài Đặt Hệ Thống (Settings)

**Route:** `/settings`
**Auth:** Required (Admin only)

**File:** `src/pages/Settings.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b px-6 py-4">
    <h1>Cài đặt Hệ thống</h1>
    <p>Quản lý cấu hình và tích hợp hệ thống</p>
  </div>

  <!-- CONTENT: 2 columns (Menu + Content) -->
  <div class="p-6">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- LEFT: Settings Menu (1/4) -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4">
          <nav class="space-y-1">
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white">
              <Building2 /> Thông tin công ty
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
              <Warehouse /> Quản lý kho
            </button>
            <!-- 5 more menu items -->
          </nav>
        </div>
      </div>

      <!-- RIGHT: Content Area (3/4) -->
      <div class="lg:col-span-3">
        <!-- Dynamic content based on activeSection -->
        <!-- 7 sections: company, warehouses, general, integrations, backup, users, interface -->
      </div>
    </div>
  </div>
</div>
```

**7 Menu Items:**
1. **Thông tin công ty** (`company`): Logo upload, form company details
2. **Quản lý kho** (`warehouses`): Danh sách kho + progress bar
3. **Cấu hình chung** (`general`): 3 toggle switches
4. **Tích hợp hệ thống** (`integrations`): 5 integrations với Connect/Disconnect
5. **Sao lưu & Khôi phục** (`backup`): Backup button + Restore upload
6. **Quản lý người dùng** (`users`): Link to `/employees` với ExternalLink icon
7. **Giao diện & Ngôn ngữ** (`interface`): Language select, Color picker, Dark mode

---

### 12. 🔔 Thông Báo (Notifications)

**Route:** `/notifications`
**Auth:** Required

**File:** `src/pages/Notifications.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER: Title + Unread count + "Đánh dấu tất cả" -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Bell class="w-8 h-8 text-primary" />
          <div>
            <h1>Thông báo</h1>
            <p class="text-sm text-gray-600">3 thông báo chưa đọc</p>
          </div>
        </div>
        <button class="bg-primary text-white px-4 py-2 rounded-lg"><CheckCheck /> Đánh dấu tất cả đã đọc</button>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6">
    <!-- FILTERS -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border ...">
      <div class="flex gap-2">
        <button class="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-medium">Tất cả (7)</button>
        <button class="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium">Chưa đọc (3)</button>
      </div>
    </div>

    <!-- NOTIFICATIONS LIST -->
    <div class="space-y-3">
      <!-- Unread notification (border-primary) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-primary p-4 transition-all hover:shadow-md">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-lg bg-red-50 text-red-600">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <h3 class="text-sm font-semibold">
                  Cảnh báo tồn kho thấp
                  <span class="ml-2 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                </h3>
                <p class="text-sm text-gray-600 mb-2">iPhone 15 Pro Max sắp hết hàng (còn 5 sản phẩm)</p>
                <p class="text-xs text-gray-500">5 phút trước</p>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Check class="w-4 h-4" /></button>
                <button class="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X class="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Read notification (border-gray-200, opacity-75) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-gray-200 p-4 opacity-75">
        <!-- Similar structure but without red badge and with opacity -->
      </div>
    </div>
  </div>
</div>
```

**5 Notification Types:**
| Type | Icon | Color | Ví dụ |
|------|------|-------|-------|
| inventory | AlertTriangle | 🔴 Đỏ | Tồn kho thấp, vượt ngưỡng |
| order | ShoppingCart | 🔵 Xanh dương | Đơn hàng mới, đã giao |
| expiry | Clock | 🟠 Cam | Sản phẩm sắp hết hạn |
| system | Settings | ⚫ Xám | Bảo trì hệ thống |
| import | Package | 🟢 Xanh lá | Nhập kho thành công |

**States:**
| State | UI |
|-------|-----|
| Unread | `border-primary`, full opacity, red badge dot, Check action visible |
| Read | `border-gray-200`, `opacity-75`, no badge, no Check action |
| Empty | Bell icon lớn + text "Không có thông báo nào" |

**Realtime:**
- SetInterval 30s (placeholder for WebSocket)
- Console log: "Checking for new notifications..."

---

### 13. 👤 Profile (Cài Đặt Tài Khoản)

**Route:** `/profile`
**Auth:** Required

**File:** `src/pages/Profile.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER + "Đăng xuất" button -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4 flex justify-between">
      <div>
        <h1>Cài đặt Tài khoản</h1>
        <p>Quản lý thông tin và bảo mật tài khoản</p>
      </div>
      <button class="bg-red-600 text-white px-4 py-2 rounded-lg"><LogOut /> Đăng xuất</button>
    </div>
  </div>

  <!-- CONTENT: 2 columns -->
  <div class="p-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- LEFT: User Info Card (1/3) -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
          <!-- Avatar -->
          <div class="flex flex-col items-center mb-6">
            <div class="relative">
              <div class="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">N</div>
              <button class="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border"><Camera class="w-4 h-4" /></button>
            </div>
            <h2>Nguyễn Văn A</h2>
            <p>Quản lý kho</p>
          </div>
          <!-- User details: Email, Role, Join Date, Department -->
          <div class="space-y-4">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail class="w-5 h-5 text-gray-400" />
              <div><p class="text-xs text-gray-500">Email</p><p class="text-sm font-medium">nguyenvana@khoai.com</p></div>
            </div>
            <!-- 3 more items -->
          </div>
        </div>
      </div>

      <!-- RIGHT: Tabs Content (2/3) -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
          <!-- TABS -->
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px overflow-x-auto">
              <button class="flex items-center gap-2 px-6 py-4 border-b-2 border-primary text-primary"><User /> Thông tin</button>
              <button class="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-gray-500"><Lock /> Mật khẩu</button>
              <button class="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-gray-500"><Bell /> Thông báo</button>
              <button class="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-gray-500"><Monitor /> Thiết bị</button>
            </nav>
          </div>
          <!-- Tab Content -->
          <div class="p-6">
            <!-- 4 tabs with conditional rendering -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

**4 Tabs:**
| Tab | Content | Actions |
|-----|---------|---------|
| Thông tin | Form: Họ tên, Email, SĐT, Ngày sinh, Giới tính, Địa chỉ | Lưu thay đổi |
| Mật khẩu | 3 password inputs + Security warning box | Cập nhật mật khẩu |
| Thông báo | 4 toggle switches: Email, Push, Order, Inventory | Lưu cài đặt |
| Thiết bị | Danh sách thiết bị đăng nhập | Đăng xuất từng thiết bị |

---

### 14. 📊 Reports (Báo Cáo & Thống Kê)

**Route:** `/reports`
**Auth:** Required

**File:** `src/pages/Reports.jsx`

**Cấu trúc HTML:**
```html
<div class="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
  <!-- HEADER + Export buttons -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b ...">
    <div class="px-6 py-4 flex justify-between">
      <div>
        <h1>Báo cáo & Thống kê</h1>
        <p>Báo cáo tồn kho tổng hợp</p>
      </div>
      <div class="flex gap-2">
        <button class="bg-green-600 text-white px-4 py-2 rounded-lg"><FileSpreadsheet /> Excel</button>
        <button class="bg-red-600 text-white px-4 py-2 rounded-lg"><FileText /> PDF</button>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="p-6">
    <!-- Filters: Report Type, Warehouse, Time Range, Apply -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border ...">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label><BarChart3 /> Loại báo cáo</label><select>6 options</select></div>
        <div><label><Warehouse /> Kho</label><select>4 options</select></div>
        <div><label><Calendar /> Thời gian</label><select>5 options</select></div>
        <div class="flex items-end"><button class="w-full bg-primary text-white px-4 py-2 rounded-lg"><Filter /> Áp dụng</button></div>
      </div>
    </div>

    <!-- Dynamic Report Content (based on reportType) -->
    <div class="space-y-6">
      <!-- 6 different report types -->
    </div>
  </div>
</div>
```

**6 Report Types:**

| # | Type | Chart | Data |
|---|------|-------|------|
| 1 | Tồn kho tổng hợp | Pie Chart | 4 danh mục: Điện tử, Thực phẩm, Mỹ phẩm, Khác |
| 2 | Nhập - Xuất | Line Chart | 7 ngày: nhập (xanh lá), xuất (đỏ) |
| 3 | Top bán chạy | Table | Rank 1-5 với badge màu |
| 4 | Chậm luân chuyển | Table | Tên SP, Tồn kho, Đã bán, Ngày không bán |
| 5 | Giá trị tồn kho | Bar Chart | 4 danh mục, format VND |
| 6 | Sắp hết hạn | Table | Sản phẩm, Lô, HSD, Còn lại (badge đỏ/cam/vàng) |

---

## 🔐 Phân Quyền Người Dùng

### 4 Vai Trò Chính:

| Permission | Admin | Manager | Staff | Storekeeper |
|------------|-------|---------|-------|-------------|
| Nhập kho | ✅ | ✅ | ✅ | ✅ |
| Xuất kho | ✅ | ✅ | ✅ | ✅ |
| Quản lý tồn kho | ✅ | ✅ | ✅ | ✅ |
| Xem báo cáo | ✅ | ✅ | ❌ | ✅ |
| Quản lý kho | ✅ | ✅ | ❌ | ❌ |
| Quản lý nhân viên | ✅ | ❌ | ❌ | ❌ |
| Quản lý NCC | ✅ | ❌ | ❌ | ❌ |
| Quản lý SP | ✅ | ❌ | ❌ | ❌ |
| Cài đặt hệ thống | ✅ | ❌ | ❌ | ❌ |

---

## 🔄 Luồng Nghiệp Vụ Chính

### 1. Luồng Nhập Kho
```
CreateStockIn → Chọn NCC → Thêm SP → Xác nhận → Cập nhật tồn → Cập nhật vị trí
```

### 2. Luồng Xuất Kho
```
CreateStockOut → Chọn đơn hàng → Kiểm tra tồn → Xác nhận xuất → Cập nhật tồn → In phiếu
```

### 3. Luồng Kiểm Kê
```
InventoryCheck → Chọn chế độ → Quét/Thêm SP → Nhập tồn thực tế → So sánh → Tạo biên bản
```

### 4. Luồng Đơn Hàng
```
Orders → Tạo đơn → Xác nhận → Xuất kho → Giao hàng → Hoàn thành
```

---

## 🎨 Design System

### Màu Sắc
| Màu | Hex | Class | Sử dụng |
|-----|-----|-------|---------|
| Primary | #007BFF | `bg-primary` | Buttons, Active menu |
| Success | #28A745 | `bg-success` | KPI positive, Confirm |
| Warning | #FD7E14 | `bg-warning` | Low stock warning |
| Danger | #DC3545 | `bg-danger` | Delete, Critical stock |
| Dark | #1a1a1a | `dark:bg-gray-900` | Dark mode background |

### Typography
- Font: Inter (Google Fonts)
- Sizes: `text-xs` (12px) → `text-4xl` (36px)
- Weights: `font-normal` (400) → `font-bold` (700)

### Spacing
- Base unit: 4px
- Common: `p-4` (16px), `p-6` (24px), `p-8` (32px)

### Border Radius
- Small: `rounded-lg` (8px)
- Medium: `rounded-xl` (12px)
- Large: `rounded-2xl` (16px)

### Shadows
- Card: `shadow-sm`
- Hover: `shadow-md`
- Modal: `shadow-xl`

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Adaptations |
|------------|-------|-------------|
| Mobile | < 640px (sm) | Tables → Cards, 1 column grids |
| Tablet | 640px - 1024px (md/lg) | 2-3 column grids, sidebar drawer |
| Desktop | > 1024px (lg+) | Full layout, 4 column grids |

**Mobile Adaptations:**
- Sidebar: Slide-in drawer (fixed overlay)
- Tables: Convert to cards with all info
- Grids: Single column
- Forms: Full width inputs

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
- 17 pages, 15 pages có sidebar (auth pages không có)
- Layout dùng `flex flex-col overflow-y-auto pb-6` cho tất cả pages có sidebar
- Auth pages dùng `min-h-screen` (không có sidebar)
- Scrollbar tùy chỉnh với `custom-scrollbar` class
- Form validation cần bổ sung thêm
- API integration cần kết nối backend
- File upload cần tích hợp cloud storage
- Real-time updates cần WebSocket

---

**Phát triển bởi:** KHO AI Team  
**Phiên bản:** 1.0.0  
**Cập nhật:** November 2024


📋 Tài khoản đăng nhập mẫu:
   Admin:       admin@khoai.com / 123456
   Manager:     manager@khoai.com / 123456
   Staff:       staff@khoai.com / 123456
   Storekeeper: storekeeper@khoai.com / 123456