import { useState, useEffect } from 'react'
import { 
  Plus, Search, Filter, ChevronDown, Eye, Printer, X, Package, 
  Truck, User, MapPin, AlertCircle, CheckCircle, Loader2 
} from 'lucide-react'
import { warehouseApi, productsApi, ordersApi } from '../services/api'

function Orders() {
  const [orders, setOrders] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [toast, setToast] = useState(null)
  
  // Filters
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Form
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    warehouseId: '',
    notes: '',
    items: []
  })
  
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [stockWarning, setStockWarning] = useState('')

  useEffect(() => {
    loadOrders()
    loadWarehouses()
  }, [])

  const loadOrders = async () => {
    try {
      const params = {
        status: selectedStatus,
        warehouseId: selectedWarehouse,
        dateRange: dateRange,
        search: searchQuery,
        limit: 100
      }
      const data = await ordersApi.getOrders(params)
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error loading orders:', error)
      showToast('Lỗi khi tải danh sách đơn hàng', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadWarehouses = async () => {
    try {
      const data = await warehouseApi.getWarehouses()
      setWarehouses(data)
    } catch (error) {
      console.error('Error loading warehouses:', error)
    }
  }

  const loadProductsForOrder = async () => {
    try {
      const params = {
        warehouseId: formData.warehouseId,
        search: selectedProduct
      }
      const data = await productsApi.getProducts({ search: selectedProduct, limit: 50 })
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  useEffect(() => {
    if (showModal) {
      loadProductsForOrder()
    }
  }, [showModal, selectedProduct, formData.warehouseId])

  useEffect(() => {
    loadOrders()
  }, [selectedStatus, selectedWarehouse, dateRange, searchQuery])

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) {
      showToast('Vui lòng chọn sản phẩm và nhập số lượng', 'error')
      return
    }

    const product = products.find(p => p.id === selectedProduct)
    if (!product) return

    if (quantity > product.totalStock) {
      showToast(`Số lượng vượt quá tồn kho (${product.totalStock})`, 'error')
      return
    }

    const existingItem = formData.items.find(item => item.productId === selectedProduct)
    if (existingItem) {
      showToast('Sản phẩm đã có trong đơn hàng', 'error')
      return
    }

    setFormData({
      ...formData,
      items: [...formData.items, {
        productId: product.id,
        productName: product.nameVi,
        productCode: product.code,
        quantity: quantity,
        unitPrice: product.sellingPrice,
        unit: product.unit
      }]
    })

    setSelectedProduct('')
    setQuantity(1)
    setStockWarning('')
  }

  const handleRemoveItem = (productId) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.productId !== productId)
    })
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.customerName || !formData.customerPhone || !formData.warehouseId) {
      showToast('Vui lòng điền đầy đủ thông tin khách hàng và chọn kho', 'error')
      return
    }
    
    if (formData.items.length === 0) {
      showToast('Đơn hàng phải có ít nhất 1 sản phẩm', 'error')
      return
    }

    try {
      const orderCode = `DH${Date.now()}`
      
      await ordersApi.createOrder({
        ...formData,
        orderCode
      })

      showToast('Tạo đơn hàng thành công!', 'success')
      setShowModal(false)
      setFormData({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        warehouseId: '',
        notes: '',
        items: []
      })
      loadOrders()
    } catch (error) {
      showToast(error.message || 'Lỗi khi tạo đơn hàng', 'error')
    }
  }

  const handleViewDetail = async (order) => {
    try {
      const data = await ordersApi.getOrder(order.id)
      setSelectedOrder(data)
      setShowDetailModal(true)
    } catch (error) {
      console.error('Error loading order detail:', error)
      showToast('Lỗi khi tải chi tiết đơn hàng', 'error')
    }
  }

  const handleCancelOrder = async (order) => {
    if (!confirm(`Bạn có chắc muốn hủy đơn hàng ${order.orderCode}?`)) return

    try {
      await ordersApi.updateOrder(order.id, { status: 'CANCELLED' })
      showToast('Hủy đơn hàng thành công', 'success')
      loadOrders()
    } catch (error) {
      showToast('Lỗi khi hủy đơn hàng', 'error')
    }
  }

  const handlePrintInvoice = (order) => {
    const printContent = `
      <html>
        <head>
          <title>Hóa đơn ${order.orderCode}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .info { margin-bottom: 20px; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items th { background-color: #f2f2f2; }
            .total { text-align: right; font-size: 18px; font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>HÓA ĐƠN BÁN HÀNG</h1>
              <p>${order.orderCode}</p>
            </div>
            <div class="info">
              <p><strong>Khách hàng:</strong> ${order.customerName}</p>
              <p><strong>SĐT:</strong> ${order.customerPhone}</p>
              <p><strong>Địa chỉ:</strong> ${order.customerAddress}</p>
              <p><strong>Kho xuất:</strong> ${order.warehouse?.name || 'N/A'}</p>
              <p><strong>Ngày tạo:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            </div>
            <table class="items">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.product.nameVi}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toLocaleString('vi-VN')}đ</td>
                    <td>${(item.quantity * item.unitPrice).toLocaleString('vi-VN')}đ</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              <p>Tổng tiền: ${order.totalAmount.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'DELIVERING':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'CONFIRMED':
        return 'Đã xác nhận'
      case 'DELIVERING':
        return 'Đang giao'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'CANCELLED':
        return 'Hủy'
      default:
        return 'Không xác định'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 border-b-2 border-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Đơn hàng</h1>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Tạo đơn hàng mới</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="delivering">Đang giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Hủy</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Warehouse Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kho</label>
              <div className="relative">
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">Tất cả kho</option>
                  {warehouses.map(wh => (
                    <option key={wh.id} value={wh.id}>{wh.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thời gian</label>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                  <option value="90days">90 ngày qua</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm mã đơn, tên khách hàng, SĐT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã đơn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Ngày tạo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tổng tiền</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Sản phẩm</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Kho xuất</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{order.orderCode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{order.items?.length || 0} sản phẩm</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {order.warehouse?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(order)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                            title="In hóa đơn"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancelOrder(order)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Hủy đơn"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tạo đơn hàng mới</h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setFormData({
                      customerName: '',
                      customerPhone: '',
                      customerAddress: '',
                      warehouseId: '',
                      notes: '',
                      items: []
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên khách hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Nhập tên khách hàng"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Nhập SĐT"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ giao hàng
                    </label>
                    <input
                      type="text"
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Nhập địa chỉ giao hàng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kho xuất <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.warehouseId}
                      onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">-- Chọn kho --</option>
                      {warehouses.map(wh => (
                        <option key={wh.id} value={wh.id}>{wh.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Ghi chú (tùy chọn)"
                    />
                  </div>
                </div>

                {/* Add Products */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Thêm sản phẩm</h4>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.nameVi} ({product.code}) - Tồn: {product.totalStock}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="SL"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                    >
                      Thêm
                    </button>
                  </div>
                  {stockWarning && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
                      <AlertCircle className="w-4 h-4" />
                      {stockWarning}
                    </div>
                  )}
                </div>

                {/* Items List */}
                {formData.items.length > 0 && (
                  <div className="border-t pt-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Danh sách sản phẩm</h4>
                    <div className="space-y-2">
                      {formData.items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} x {formatCurrency(item.unitPrice)} = {formatCurrency(item.quantity * item.unitPrice)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Tổng tiền: {formatCurrency(calculateTotal())}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setFormData({
                        customerName: '',
                        customerPhone: '',
                        customerAddress: '',
                        warehouseId: '',
                        notes: '',
                        items: []
                      })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={formData.items.length === 0}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Tạo đơn hàng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết đơn hàng</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedOrder(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn</p>
                    <p className="font-medium text-gray-900">{selectedOrder.orderCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Khách hàng</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SĐT</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customerPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customerAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kho xuất</p>
                    <p className="font-medium text-gray-900">{selectedOrder.warehouse?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="font-medium text-gray-900">{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Sản phẩm</h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.product.nameVi}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Ghi chú</p>
                    <p className="text-sm text-gray-900">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      setSelectedOrder(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => handlePrintInvoice(selectedOrder)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    In hóa đơn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default Orders