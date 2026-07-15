import { useState } from 'react'
import { 
  Plus, Search, Trash2, Save, Send, X, 
  Package, MapPin, AlertTriangle, Barcode,
  FileText, User, Truck
} from 'lucide-react'

function CreateStockOut() {
  const [formData, setFormData] = useState({
    warehouse: '',
    orderId: '',
    reason: '',
    receiver: '',
    notes: ''
  })

  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showProductSearch, setShowProductSearch] = useState(false)

  // Sample products for search
  const availableProducts = [
    { id: 'SP001', name: 'iPhone 15 Pro Max', stock: 45, price: 25000000, location: 'A-01-02' },
    { id: 'SP002', name: 'Samsung Galaxy S24', stock: 8, price: 22000000, location: 'B-03-01' },
    { id: 'SP003', name: 'MacBook Air M2', stock: 15, price: 28000000, location: 'C-02-03' },
    { id: 'SP004', name: 'iPad Pro 12.9"', stock: 30, price: 32000000, location: 'A-02-01' },
    { id: 'SP005', name: 'AirPods Pro 2', stock: 50, price: 6500000, location: 'B-01-04' },
  ]

  const orders = [
    { id: 'DH20241114001', customer: 'Nguyễn Văn A' },
    { id: 'DH20241114002', customer: 'Trần Thị B' },
    { id: 'DH20241113003', customer: 'Lê Văn C' },
  ]

  const warehouses = [
    { id: 'hanoi', name: 'Kho Hà Nội' },
    { id: 'hcm', name: 'Kho TP.HCM' },
    { id: 'danang', name: 'Kho Đà Nẵng' },
  ]

  const reasons = [
    'Xuất bán',
    'Chuyển kho',
    'Khuyến mãi',
    'Hàng hỏng',
    'Hàng mẫu',
    'Khác'
  ]

  const addProduct = (product) => {
    const exists = products.find(p => p.id === product.id)
    if (exists) {
      alert('Sản phẩm đã có trong danh sách')
      return
    }
    setProducts([...products, { ...product, quantity: 1 }])
    setSearchQuery('')
    setShowProductSearch(false)
  }

  const updateQuantity = (id, quantity) => {
    const product = products.find(p => p.id === id)
    if (product && quantity > product.stock) {
      alert('Số lượng xuất không được vượt quá tồn kho')
      return
    }
    if (quantity < 1) {
      removeProduct(id)
      return
    }
    setProducts(products.map(p => 
      p.id === id ? { ...p, quantity } : p
    ))
  }

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const handleBarcodeScan = () => {
    // Simulate barcode scan
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

  const calculateTotal = () => {
    return products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  }

  const calculateTotalQuantity = () => {
    return products.reduce((sum, p) => sum + p.quantity, 0)
  }

  const handleSubmit = (type) => {
    if (products.length === 0) {
      alert('Vui lòng thêm ít nhất 1 sản phẩm')
      return
    }
    
    // Validate
    const invalidProduct = products.find(p => p.quantity > p.stock)
    if (invalidProduct) {
      alert(`Sản phẩm ${invalidProduct.name} vượt quá tồn kho`)
      return
    }

    if (type === 'confirm') {
      alert('Đã xác nhận xuất kho thành công!')
    } else {
      alert('Đã lưu nháp')
    }
  }

  const filteredProducts = availableProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tạo phiếu xuất kho mới</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Số phiếu: <span className="font-mono font-semibold text-primary">XK-20260714-001</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleBarcodeScan}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Barcode className="w-4 h-4" />
                <span className="font-medium">Quét mã vạch</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Warehouse Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin xuất kho</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kho xuất hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.warehouse}
                      onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Chọn kho</option>
                      {warehouses.map(wh => (
                        <option key={wh.id} value={wh.id}>{wh.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Đơn hàng liên kết
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Chọn đơn hàng (nếu có)</option>
                      {orders.map(order => (
                        <option key={order.id} value={order.id}>
                          {order.id} - {order.customer}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lý do xuất kho <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Chọn lý do</option>
                      {reasons.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Người nhận / Khách hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.receiver}
                      onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                      placeholder="Nhập tên người nhận"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ghi chú thêm..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Products Table */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Danh sách sản phẩm</h3>
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
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Tồn: {product.stock}</p>
                                <p className="text-xs text-gray-500">{product.location}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Table */}
              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã SP</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tên sản phẩm</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tồn hiện tại</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SL xuất</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Vị trí lấy</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thành tiền</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3">
                            <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{product.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              min="1"
                              max={product.stock}
                              value={product.quantity}
                              onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                              className={`w-20 px-2 py-1 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                product.quantity > product.stock 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                              }`}
                            />
                            {product.quantity > product.stock && (
                              <p className="text-xs text-red-600 mt-1">Vượt tồn kho</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {product.location}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {(product.price * product.quantity).toLocaleString('vi-VN')}đ
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
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
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">Chưa có sản phẩm nào</p>
                  <button
                    onClick={() => setShowProductSearch(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Thêm sản phẩm</span>
                  </button>
                </div>
              )}

              {/* Summary */}
              {products.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng số lượng xuất</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateTotalQuantity()}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng giá trị xuất</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {calculateTotal().toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
            onClick={() => handleSubmit('draft')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="font-medium">Lưu nháp</span>
          </button>
          <button
            onClick={() => handleSubmit('confirm')}
            disabled={products.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 bg-success text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="font-medium">Xác nhận xuất kho</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateStockOut