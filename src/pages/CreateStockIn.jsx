import { useState } from 'react'
import { Plus, Camera, Trash2, Save, X, Check, Search, Calendar, Warehouse, User, FileText, MapPin } from 'lucide-react'

function CreateStockIn() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    warehouse: '',
    receiver: 'Nguyễn Văn A',
    notes: ''
  })

  const [products, setProducts] = useState([
    {
      id: 1,
      code: 'SP001',
      name: 'iPhone 15 Pro Max 256GB',
      quantity: 10,
      unitPrice: 25000000,
      location: 'A-01-02',
      expiryDate: '2025-06-15',
      lotNumber: 'LOT2024001'
    }
  ])

  const suppliers = [
    { id: 1, name: 'Apple Vietnam' },
    { id: 2, name: 'Samsung Electronics' },
    { id: 3, name: 'Vinamilk Corp' },
    { id: 4, name: 'Unilever Vietnam' },
    { id: 5, name: 'Nestle Vietnam' }
  ]

  const warehouses = [
    { id: 1, name: 'Kho Hà Nội' },
    { id: 2, name: 'Kho TP.HCM' },
    { id: 3, name: 'Kho Đà Nẵng' }
  ]

  const generateReceiptNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    return `NK-${year}${month}${day}-${random}`
  }

  const addProductRow = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
    setProducts([...products, {
      id: newId,
      code: '',
      name: '',
      quantity: 0,
      unitPrice: 0,
      location: '',
      expiryDate: '',
      lotNumber: ''
    }])
  }

  const removeProductRow = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const updateProduct = (id, field, value) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const calculateTotal = () => {
    return products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0)
  }

  const calculateTotalQuantity = () => {
    return products.reduce((sum, p) => sum + p.quantity, 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tạo phiếu nhập kho mới</h1>
              <p className="text-sm text-gray-600 mt-1">
                Số phiếu: <span className="font-mono font-semibold text-primary">{generateReceiptNumber()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* General Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin chung</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Ngày nhập
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nhà cung cấp
              </label>
              <div className="relative">
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="">Chọn nhà cung cấp</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Warehouse className="w-4 h-4 inline mr-1" />
                Kho nhận
              </label>
              <select
                value={formData.warehouse}
                onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
              >
                <option value="">Chọn kho</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
              </select>
            </div>

            {/* Receiver */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Người nhập
              </label>
              <input
                type="text"
                value={formData.receiver}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 inline mr-1" />
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                placeholder="Nhập ghi chú (nếu có)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Product Details Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chi tiết sản phẩm</h2>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Quét mã</span>
              </button>
              <button 
                onClick={addProductRow}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Thêm dòng</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã SP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Số lượng</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Đơn giá</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thành tiền</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vị trí</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hạn SD</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lot number</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={product.code}
                        onChange={(e) => updateProduct(product.id, 'code', e.target.value)}
                        placeholder="Mã SP"
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        placeholder="Tên sản phẩm"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) => updateProduct(product.id, 'unitPrice', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(product.quantity * product.unitPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <input
                          type="text"
                          value={product.location}
                          onChange={(e) => updateProduct(product.id, 'location', e.target.value)}
                          placeholder="Vị trí"
                          className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={product.expiryDate}
                        onChange={(e) => updateProduct(product.id, 'expiryDate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={product.lotNumber}
                        onChange={(e) => updateProduct(product.id, 'lotNumber', e.target.value)}
                        placeholder="Lot"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeProductRow(product.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa dòng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-blue-100 text-sm mb-1">Tổng số lượng</p>
              <p className="text-3xl font-bold">{calculateTotalQuantity()}</p>
            </div>
            <div className="h-px w-full sm:w-px sm:h-16 bg-blue-400"></div>
            <div className="text-center sm:text-left">
              <p className="text-blue-100 text-sm mb-1">Tổng tiền</p>
              <p className="text-3xl font-bold">{formatCurrency(calculateTotal())}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10" style={{ marginLeft: '256px' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-end gap-3">
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
            <span className="font-medium">Hủy</span>
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors">
            <Save className="w-5 h-5" />
            <span className="font-medium">Lưu tạm</span>
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-success text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm">
            <Check className="w-5 h-5" />
            <span className="font-medium">Xác nhận nhập kho</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateStockIn