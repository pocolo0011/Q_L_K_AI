import { useState } from 'react'
import { 
  Plus, Search, Trash2, Save, CheckCircle, Upload,
  Barcode, Package, MapPin, AlertTriangle, FileText,
  Camera, Calendar, Warehouse
} from 'lucide-react'

function InventoryCheck() {
  const [mode, setMode] = useState('full') // 'quick' or 'full'
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split('T')[0])
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showProductSearch, setShowProductSearch] = useState(false)

  // Sample products
  const availableProducts = [
    { id: 'SP001', name: 'iPhone 15 Pro Max', systemStock: 45, location: 'A-01-02' },
    { id: 'SP002', name: 'Samsung Galaxy S24', systemStock: 8, location: 'B-03-01' },
    { id: 'SP003', name: 'MacBook Air M2', systemStock: 15, location: 'C-02-03' },
    { id: 'SP004', name: 'iPad Pro 12.9"', systemStock: 30, location: 'A-02-01' },
    { id: 'SP005', name: 'AirPods Pro 2', systemStock: 50, location: 'B-01-04' },
  ]

  const warehouses = [
    { id: 'hanoi', name: 'Kho Hà Nội' },
    { id: 'hcm', name: 'Kho TP.HCM' },
    { id: 'danang', name: 'Kho Đà Nẵng' },
  ]

  const addProduct = (product) => {
    const exists = products.find(p => p.id === product.id)
    if (exists) {
      alert('Sản phẩm đã có trong danh sách')
      return
    }
    setProducts([...products, { 
      ...product, 
      actualStock: 0,
      notes: '',
      images: []
    }])
    setSearchQuery('')
    setShowProductSearch(false)
  }

  const updateActualStock = (id, value) => {
    const numValue = parseInt(value) || 0
    setProducts(products.map(p => 
      p.id === id ? { ...p, actualStock: numValue } : p
    ))
  }

  const updateNotes = (id, notes) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, notes } : p
    ))
  }

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const handleBarcodeScan = () => {
    const barcode = prompt('Nhập mã vạch:')
    if (barcode) {
      const product = availableProducts.find(p => p.id === barcode || p.name.toLowerCase().includes(barcode.toLowerCase()))
      if (product) {
        addProduct(product)
      } else {
        alert('Không tìm thấy sản phẩm')
      }
    }
  }

  const calculateDifference = (systemStock, actualStock) => {
    return actualStock - systemStock
  }

  const getDifferenceColor = (diff) => {
    if (diff > 0) return 'text-green-600 bg-green-50'
    if (diff < 0) return 'text-red-600 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  const handleSave = () => {
    if (products.length === 0) {
      alert('Vui lòng thêm ít nhất 1 sản phẩm')
      return
    }
    alert('Đã lưu kiểm kê thành công!')
  }

  const handleComplete = () => {
    if (products.length === 0) {
      alert('Vui lòng thêm ít nhất 1 sản phẩm')
      return
    }
    alert('Đã hoàn tất kiểm kê và tạo biên bản!')
  }

  const filteredProducts = availableProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSystemStock = products.reduce((sum, p) => sum + p.systemStock, 0)
  const totalActualStock = products.reduce((sum, p) => sum + p.actualStock, 0)
  const totalDifference = totalActualStock - totalSystemStock

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kiểm kê kho</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kiểm kê tồn kho vật lý</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBarcodeScan}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Barcode className="w-4 h-4" />
                <span className="font-medium">Quét mã vạch</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Warehouse className="w-4 h-4 inline mr-1" />
                Kho
              </label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Chọn kho</option>
                {warehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Ngày kiểm kê
              </label>
              <input
                type="date"
                value={checkDate}
                onChange={(e) => setCheckDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Mode Toggle */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chế độ kiểm kê
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('quick')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors ${
                    mode === 'quick'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Barcode className="w-4 h-4 inline mr-1" />
                  Kiểm kê nhanh
                </button>
                <button
                  onClick={() => setMode('full')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors ${
                    mode === 'full'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Package className="w-4 h-4 inline mr-1" />
                  Kiểm kê toàn bộ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Danh sách sản phẩm ({products.length})
            </h3>
            {mode === 'full' && (
              <div className="relative">
                <button
                  onClick={() => setShowProductSearch(!showProductSearch)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Thêm sản phẩm</span>
                </button>

                {/* Product Search Dropdown */}
                {showProductSearch && (
                  <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <div className="p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm mã SP hoặc tên sản phẩm..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filteredProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => addProduct(product)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                              <p className="text-xs text-gray-500">Mã: {product.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Tồn: {product.systemStock}</p>
                              <p className="text-xs text-gray-500">{product.location}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {products.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã SP</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tên sản phẩm</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tồn Hệ thống</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tồn Thực tế</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Chênh lệch</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Ghi chú</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => {
                      const difference = calculateDifference(product.systemStock, product.actualStock)
                      return (
                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3">
                            <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{product.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {product.location}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{product.systemStock}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={product.actualStock}
                              onChange={(e) => updateActualStock(product.id, e.target.value)}
                              className="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-lg ${getDifferenceColor(difference)}`}>
                              {difference > 0 ? '+' : ''}{difference}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={product.notes}
                              onChange={(e) => updateNotes(product.id, e.target.value)}
                              placeholder="Ghi chú..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="Upload ảnh">
                                <Camera className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                        Tổng cộng
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{totalSystemStock}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{totalActualStock}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-lg ${getDifferenceColor(totalDifference)}`}>
                          {totalDifference > 0 ? '+' : ''}{totalDifference}
                        </span>
                      </td>
                      <td colSpan="2" />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Summary Cards */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tồn hệ thống</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSystemStock}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tồn thực tế</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalActualStock}</p>
                  </div>
                  <div className={`rounded-lg p-4 ${totalDifference >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Chênh lệch</p>
                    <p className={`text-2xl font-bold ${totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalDifference > 0 ? '+' : ''}{totalDifference}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500 mb-4">Chưa có sản phẩm nào trong danh sách kiểm kê</p>
              {mode === 'full' && (
                <button
                  onClick={() => setShowProductSearch(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Thêm sản phẩm</span>
                </button>
              )}
              {mode === 'quick' && (
                <button
                  onClick={handleBarcodeScan}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Barcode className="w-4 h-4" />
                  <span className="font-medium">Quét mã vạch để bắt đầu</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="font-medium">Hủy</span>
          </button>
          <button
            onClick={handleSave}
            disabled={products.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span className="font-medium">Lưu kiểm kê</span>
          </button>
          <button
            onClick={handleComplete}
            disabled={products.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 bg-success text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Hoàn tất & Tạo biên bản</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InventoryCheck