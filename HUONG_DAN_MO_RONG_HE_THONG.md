# Hướng dẫn mở rộng hệ thống: Nhiều kho & Tìm kiếm sản phẩm

## 📌 Phần 1: Thêm nhiều kho (Warehouse)

### Cấu trúc hiện tại đã hỗ trợ nhiều kho:

```
Warehouse (Kho)
├── Zone (Dãy)
│   └── Shelf (Kệ)
│       └── Bin (Ô lưu trữ)
│           └── Inventory (Tồn kho)
│               └── Product (Sản phẩm)
```

### Cách thêm kho mới:

#### 1. Qua API (Backend)

```javascript
// POST /api/warehouses
{
  "code": "WH-HP",
  "name": "Kho Hải Phòng",
  "address": "Hải Phòng, Việt Nam",
  "capacity": 500,
  "status": true
}
```

#### 2. Qua giao diện (Cần tạo trang quản lý kho)

Tạo trang mới `src/pages/Warehouses.jsx` với form thêm/sửa/xóa kho.

#### 3. Seed dữ liệu nhiều kho

Cập nhật file `backend/src/seed.js`:

```javascript
// Tạo Warehouse Hải Phòng
const warehouseHP = await prisma.warehouse.create({
  data: {
    code: 'WH-HP',
    name: 'Kho Hải Phòng',
    address: 'Hải Phòng, Việt Nam',
    capacity: 500,
    status: true,
  },
})

// Tạo Zones cho Hải Phòng
const zoneA_HP = await prisma.zone.create({
  data: {
    code: 'A',
    name: 'Dãy A',
    warehouseId: warehouseHP.id,
  },
})

// Tiếp tục tạo Shelves và Bins...
```

---

## 🔍 Phần 2: Tìm kiếm sản phẩm ở kho nào, kệ nào

### API Endpoint cần thêm:

#### 1. Tìm kiếm sản phẩm theo tên/mã

```javascript
// GET /api/products/search?q=iPhone
// Backend sẽ trả về:
{
  "products": [
    {
      "id": "...",
      "code": "SP001",
      "nameVi": "iPhone 15",
      "inventories": [
        {
          "binId": "...",
          "bin": {
            "code": "A-01-01",
            "shelf": {
              "name": "Kệ A-01",
              "zone": {
                "name": "Dãy A",
                "warehouse": {
                  "name": "Kho Hà Nội"
                }
              }
            }
          },
          "quantity": 45
        }
      ]
    }
  ]
}
```

#### 2. API Implementation

Thêm vào `backend/src/index.js`:

```javascript
// GET /api/products/search - Tìm kiếm sản phẩm với vị trí
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query
    
    if (!q) {
      return res.json({ products: [] })
    }

    const searchLower = q.toLowerCase()
    
    // Tìm sản phẩm
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { nameVi: { contains: searchLower } },
          { nameEn: { contains: searchLower } },
          { code: { contains: searchLower } }
        ]
      },
      include: {
        inventories: {
          include: {
            bin: {
              include: {
                shelf: {
                  include: {
                    zone: {
                      include: {
                        warehouse: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    // Format kết quả
    const results = products.map(product => ({
      id: product.id,
      code: product.code,
      nameVi: product.nameVi,
      nameEn: product.nameEn,
      category: product.category,
      locations: product.inventories
        .filter(inv => inv.quantity > 0)
        .map(inv => ({
          warehouse: inv.bin.shelf.zone.warehouse.name,
          zone: inv.bin.shelf.zone.name,
          shelf: inv.bin.shelf.name,
          bin: inv.bin.code,
          quantity: inv.quantity,
          capacity: inv.bin.capacity,
          percentage: Math.round((inv.quantity / inv.bin.capacity) * 100)
        }))
    }))

    res.json({ products: results })
  } catch (error) {
    console.error('❌ Search products error:', error)
    res.status(500).json({ error: error.message })
  }
})
```

#### 3. Thêm vào API Service (Frontend)

Cập nhật `src/services/api.js`:

```javascript
export const productsApi = {
  // ... các hàm cũ
  
  // Tìm kiếm sản phẩm với vị trí
  searchProducts: (query) => request(`/products/search?q=${query}`),
}
```

---

## 🎨 Giao diện tìm kiếm sản phẩm

### Tạo trang tìm kiếm: `src/pages/ProductSearch.jsx`

```jsx
import { useState, useEffect } from 'react'
import { Search, MapPin, Package, Warehouse, Box, MapPin as BinIcon } from 'lucide-react'
import { productsApi } from '../services/api'

function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const data = await productsApi.searchProducts(searchQuery)
      setResults(data.products || [])
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tìm kiếm sản phẩm</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên hoặc mã sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="space-y-4">
        {results.map(product => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.nameVi}</h3>
                <p className="text-sm text-gray-600">Mã: {product.code}</p>
                <p className="text-sm text-gray-500">Danh mục: {product.category}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {product.locations.length} vị trí
              </span>
            </div>

            {/* Locations */}
            {product.locations.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Vị trí lưu trữ:</h4>
                {product.locations.map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Warehouse className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{loc.warehouse}</span>
                        <span className="text-gray-400">→</span>
                        <span>{loc.zone}</span>
                        <span className="text-gray-400">→</span>
                        <span>{loc.shelf}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-mono text-primary">{loc.bin}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-600">
                          Số lượng: <span className="font-semibold">{loc.quantity}</span>
                        </span>
                        <span className="text-xs text-gray-600">
                          Dung tích: <span className="font-semibold">{loc.capacity}</span>
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              loc.percentage >= 90 ? 'bg-red-500' : 
                              loc.percentage > 0 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${loc.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{loc.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Sản phẩm này hiện không có trong kho</p>
            )}
          </div>
        ))}

        {results.length === 0 && searchQuery && !loading && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductSearch
```

### Thêm route vào App.jsx

```jsx
import ProductSearch from './pages/ProductSearch'

// Thêm vào Routes
<Route path="/products/search" element={<ProductSearch />} />
```

---

## 📊 Phần 3: Dashboard theo từng kho

### Thêm filter kho vào Dashboard

#### 1. API Endpoint

```javascript
// GET /api/dashboard?warehouseId=WH-HN
app.get('/api/dashboard', async (req, res) => {
  const { warehouseId } = req.query
  
  // Filter by warehouse nếu có
  const warehouseFilter = warehouseId ? { warehouseId } : {}
  
  // ... rest of dashboard logic
})
```

#### 2. Giao diện filter

Thêm dropdown chọn kho vào Dashboard:

```jsx
const [selectedWarehouse, setSelectedWarehouse] = useState('all')

// Load dashboard data
useEffect(() => {
  const params = selectedWarehouse !== 'all' ? `?warehouseId=${selectedWarehouse}` : ''
  dashboardApi.getDashboard(params).then(data => {
    // Update state
  })
}, [selectedWarehouse])

// Dropdown
<select 
  value={selectedWarehouse} 
  onChange={(e) => setSelectedWarehouse(e.target.value)}
  className="px-4 py-2 border border-gray-300 rounded-lg"
>
  <option value="all">Tất cả các kho</option>
  <option value="WH-HN">Kho Hà Nội</option>
  <option value="WH-HP">Kho Hải Phòng</option>
  <option value="WH-CM">Kho Cà Mau</option>
</select>
```

---

## 🔄 Phần 4: Chuyển hàng giữa các kho

### Thêm chức năng Transfer/Chuyển kho

#### 1. API Endpoint

```javascript
// POST /api/inventory/transfer
app.post('/api/inventory/transfer', async (req, res) => {
  try {
    const { productId, fromBinId, toBinId, quantity } = req.body
    
    // 1. Kiểm tra bin nguồn có đủ hàng không
    const fromBin = await prisma.bin.findUnique({
      where: { id: fromBinId },
      include: { 
        shelf: { include: { zone: { include: { warehouse: true } } } }
      }
    })
    
    if (!fromBin || fromBin.soLuong < quantity) {
      return res.status(400).json({ error: 'Không đủ hàng để chuyển' })
    }
    
    // 2. Giảm số lượng ở bin nguồn
    await prisma.bin.update({
      where: { id: fromBinId },
      data: {
        soLuong: { decrement: quantity },
        status: fromBin.soLuong - quantity === 0 ? 'EMPTY' : 'IN_USE'
      }
    })
    
    // 3. Tăng số lượng ở bin đích
    const toBin = await prisma.bin.findUnique({
      where: { id: toBinId },
      include: {
        shelf: { include: { zone: { include: { warehouse: true } } } }
      }
    })
    
    await prisma.bin.update({
      where: { id: toBinId },
      data: {
        soLuong: { increment: quantity },
        status: toBin.soLuong + quantity >= toBin.capacity ? 'FULL' : 'IN_USE'
      }
    })
    
    // 4. Tạo StockReceipt để theo dõi lịch sử
    await prisma.stockReceipt.create({
      data: {
        receiptCode: `TRF-${Date.now()}`,
        type: 'TRANSFER',
        status: 'COMPLETED',
        totalQuantity: quantity,
        notes: `Chuyển từ ${fromBin.code} (${fromBin.shelf.zone.warehouse.name}) 
                đến ${toBin.code} (${toBin.shelf.zone.warehouse.name})`,
        details: {
          create: {
            productId,
            quantity,
            unitPrice: 0,
            subtotal: 0,
            location: toBin.code
          }
        }
      }
    })
    
    res.json({ message: 'Chuyển hàng thành công' })
  } catch (error) {
    console.error('❌ Transfer error:', error)
    res.status(500).json({ error: error.message })
  }
})
```

---

## 📱 Phần 5: Mobile App - Quét mã vạch

### Tích hợp QR/Barcode Scanner

#### 1. Cài đặt thư viện

```bash
npm install react-qr-scanner
# hoặc
npm install @zxing/browser
```

#### 2. Component quét mã

```jsx
import { useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

function BarcodeScanner({ onScan }) {
  const [scanning, setScanning] = useState(false)

  const startScanning = async () => {
    setScanning(true)
    
    const codeReader = new BrowserMultiFormatReader()
    
    try {
      const videoInputDevices = await codeReader.listVideoInputDevices()
      const deviceId = videoInputDevices[0].deviceId
      
      codeReader.decodeFromVideoDevice(deviceId, 'video', (result, err) => {
        if (result) {
          onScan(result.getText())
          setScanning(false)
        }
      })
    } catch (err) {
      console.error('Error scanning:', err)
      setScanning(false)
    }
  }

  return (
    <div>
      {scanning ? (
        <video id="video" width="100%" height="300" />
      ) : (
        <button onClick={startScanning} className="btn-primary">
          Quét mã vạch
        </button>
      )}
    </div>
  )
}
```

#### 3. Sử dụng trong BinLocation

```jsx
const handleBarcodeScan = async (barcode) => {
  // Tìm bin theo mã
  const bin = await warehouseApi.getBinByCode(barcode)
  
  if (bin) {
    // Hiển thị thông tin bin
    setSelectedShelf(bin.shelf)
    loadBins(bin.shelf.id)
    
    // Highlight bin được quét
    setHighlightedBin(bin.id)
  }
}

// Trong UI
<BarcodeScanner onScan={handleBarcodeScan} />
```

---

## 🎯 Tóm tắt các bước thực hiện

### Để thêm nhiều kho:
1. ✅ Schema đã hỗ trợ (Warehouse model)
2. Tạo trang quản lý kho (Warehouses.jsx)
3. Thêm API CRUD cho Warehouse
4. Seed dữ liệu các kho mới
5. Thêm dropdown chọn kho vào các trang

### Để tìm kiếm sản phẩm:
1. ✅ Thêm API endpoint `/api/products/search`
2. ✅ Tạo trang ProductSearch.jsx
3. ✅ Thêm route vào App.jsx
4. ✅ Thêm link vào menu navigation

### Để biết mặt hàng ở đâu:
1. ✅ API đã trả về đầy đủ thông tin vị trí
2. ✅ Giao diện hiển thị: Warehouse → Zone → Shelf → Bin
3. Có thể mở rộng thêm bản đồ kho (floor plan)

---

## 🚀 Triển khai nhanh

### Bước 1: Thêm API tìm kiếm

Thêm vào `backend/src/index.js` trước phần "Start server":

```javascript
// GET /api/products/search - Tìm kiếm sản phẩm với vị trí
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query
    
    if (!q) {
      return res.json({ products: [] })
    }

    const searchLower = q.toLowerCase()
    
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { nameVi: { contains: searchLower } },
          { nameEn: { contains: searchLower } },
          { code: { contains: searchLower } }
        ]
      },
      include: {
        inventories: {
          include: {
            bin: {
              include: {
                shelf: {
                  include: {
                    zone: {
                      include: {
                        warehouse: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    const results = products.map(product => ({
      id: product.id,
      code: product.code,
      nameVi: product.nameVi,
      nameEn: product.nameEn,
      category: product.category,
      locations: product.inventories
        .filter(inv => inv.quantity > 0)
        .map(inv => ({
          warehouse: inv.bin.shelf.zone.warehouse.name,
          zone: inv.bin.shelf.zone.name,
          shelf: inv.bin.shelf.name,
          bin: inv.bin.code,
          quantity: inv.quantity,
          capacity: inv.bin.capacity,
          percentage: Math.round((inv.quantity / inv.bin.capacity) * 100)
        }))
    }))

    res.json({ products: results })
  } catch (error) {
    console.error('❌ Search products error:', error)
    res.status(500).json({ error: error.message })
  }
})
```

### Bước 2: Thêm vào API Service

Cập nhật `src/services/api.js`:

```javascript
export const productsApi = {
  // ... các hàm cũ
  
  searchProducts: (query) => request(`/products/search?q=${query}`),
}
```

### Bước 3: Tạo trang tìm kiếm

Tạo file `src/pages/ProductSearch.jsx` (như code ở trên)

### Bước 4: Thêm route

Cập nhật `src/App.jsx`:

```jsx
import ProductSearch from './pages/ProductSearch'

<Route path="/products/search" element={<ProductSearch />} />
```

### Bước 5: Thêm link vào menu

Cập nhật `src/components/Sidebar.jsx`:

```jsx
<Link to="/products/search" className="menu-item">
  <Search className="w-5 h-5" />
  <span>Tìm kiếm sản phẩm</span>
</Link>
```

---

## 📞 Hỗ trợ

Nếu cần thêm tính năng gì khác, hãy yêu cầu nhé!