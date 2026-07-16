import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Edit2, Printer, Trash2, Package, MapPin, Calendar, 
  Barcode, DollarSign, Tag, FileText, Image, Upload,
  TrendingUp, TrendingDown, Clock, CheckCircle
} from 'lucide-react'

function ProductDetail() {
  const { code } = useParams()
  const [activeTab, setActiveTab] = useState('general')
  const [isEditing, setIsEditing] = useState(false)
  const [dateFilter, setDateFilter] = useState('30days')

  // Product data
  const [product, setProduct] = useState({
    code: code || 'SP001',
    name: 'iPhone 15 Pro Max 256GB',
    category: 'Điện tử',
    unit: 'Cái',
    barcode: '8901234567890',
    costPrice: 22000000,
    sellingPrice: 25000000,
    status: 'active',
    defaultExpiry: '24 tháng',
    lotTracking: true,
    image: '/api/placeholder/400/400'
  })

  // Inventory by warehouse
  const inventoryByWarehouse = [
    { warehouse: 'Kho Hà Nội', actualStock: 45, availableStock: 42, location: 'A-01-02' },
    { warehouse: 'Kho TP.HCM', actualStock: 120, availableStock: 115, location: 'B-03-01' },
    { warehouse: 'Kho Đà Nẵng', actualStock: 30, availableStock: 28, location: 'C-02-03' },
  ]

  // Transaction history
  const transactionHistory = [
    { id: 1, type: 'import', date: '14/11/2024', quantity: 50, reference: 'NK-20241114-001', warehouse: 'Kho Hà Nội' },
    { id: 2, type: 'export', date: '13/11/2024', quantity: 10, reference: 'XK-20241113-003', warehouse: 'Kho TP.HCM' },
    { id: 3, type: 'import', date: '10/11/2024', quantity: 100, reference: 'NK-20241110-002', warehouse: 'Kho TP.HCM' },
    { id: 4, type: 'export', date: '08/11/2024', quantity: 25, reference: 'XK-20241108-001', warehouse: 'Kho Hà Nội' },
    { id: 5, type: 'import', date: '05/11/2024', quantity: 30, reference: 'NK-20241105-001', warehouse: 'Kho Đà Nẵng' },
  ]

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: FileText },
    { id: 'inventory', label: 'Tồn kho theo kho', icon: Package },
    { id: 'history', label: 'Lịch sử nhập - xuất', icon: Clock },
    { id: 'documents', label: 'Hình ảnh & Tài liệu', icon: Image },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const updateProduct = (field, value) => {
    setProduct({ ...product, [field]: value })
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chi tiết Sản phẩm</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mã SP: <span className="font-mono font-semibold text-primary">{product.code}</span></p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Edit2 className="w-4 h-4" />
                <span className="font-medium">{isEditing ? 'Lưu' : 'Chỉnh sửa'}</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Printer className="w-4 h-4" />
                <span className="font-medium">In mã vạch</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Tab 1: General Information */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Image */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full rounded-lg mb-4" />
                    ) : (
                      <div className="py-12">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-500 mb-4">Chưa có hình ảnh</p>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">Tải lên</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mã sản phẩm</label>
                      <input
                        type="text"
                        value={product.code}
                        onChange={(e) => updateProduct('code', e.target.value)}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      />
                    </div>

                    {/* Product Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên sản phẩm</label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct('name', e.target.value)}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                      <select
                        value={product.category}
                        onChange={(e) => updateProduct('category', e.target.value)}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      >
                        <option value="Điện tử">Điện tử</option>
                        <option value="Thực phẩm">Thực phẩm</option>
                        <option value="Mỹ phẩm">Mỹ phẩm</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    {/* Unit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đơn vị tính</label>
                      <input
                        type="text"
                        value={product.unit}
                        onChange={(e) => updateProduct('unit', e.target.value)}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      />
                    </div>

                    {/* Barcode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Barcode/QR</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={product.barcode}
                          onChange={(e) => updateProduct('barcode', e.target.value)}
                          disabled={!isEditing}
                          className="input-field flex-1 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                        />
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Barcode className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
                      <select
                        value={product.status}
                        onChange={(e) => updateProduct('status', e.target.value)}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Cost Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá vốn</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={product.costPrice}
                          onChange={(e) => updateProduct('costPrice', parseInt(e.target.value))}
                          disabled={!isEditing}
                          className="input-field pl-10 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                        />
                      </div>
                    </div>

                    {/* Selling Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá bán</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={product.sellingPrice}
                          onChange={(e) => updateProduct('sellingPrice', parseInt(e.target.value))}
                          disabled={!isEditing}
                          className="input-field pl-10 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                        />
                      </div>
                    </div>

                    {/* Default Expiry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hạn sử dụng mặc định</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={product.defaultExpiry}
                          onChange={(e) => updateProduct('defaultExpiry', e.target.value)}
                          disabled={!isEditing}
                          className="input-field pl-10 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                        />
                      </div>
                    </div>

                    {/* Lot Tracking */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lot tracking</label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={product.lotTracking}
                          onChange={(e) => updateProduct('lotTracking', e.target.checked)}
                          disabled={!isEditing}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Bật theo dõi lot number</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Inventory by Warehouse */}
            {activeTab === 'inventory' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tồn kho theo từng kho</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Kho</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tồn thực tế</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tồn khả dụng</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Vị trí</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {inventoryByWarehouse.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.warehouse}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{item.actualStock}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item.availableStock}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {item.location}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Transaction History */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {/* Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Khoảng thời gian</label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="input-field"
                      >
                        <option value="7days">7 ngày qua</option>
                        <option value="30days">30 ngày qua</option>
                        <option value="90days">90 ngày qua</option>
                        <option value="1year">1 năm qua</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại giao dịch</label>
                      <select className="input-field">
                        <option value="all">Tất cả</option>
                        <option value="import">Nhập kho</option>
                        <option value="export">Xuất kho</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* History Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Loại</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Ngày</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Số lượng</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã phiếu</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Kho</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {transactionHistory.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {transaction.type === 'import' ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${transaction.type === 'import' ? 'text-green-600' : 'text-red-600'}`}>
                                  {transaction.type === 'import' ? 'Nhập kho' : 'Xuất kho'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {transaction.date}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{transaction.quantity}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{transaction.reference}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{transaction.warehouse}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Images & Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* Product Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hình ảnh sản phẩm</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Thêm hình ảnh</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-2">
                      <img src="/api/placeholder/200/200" alt="Product" className="w-full rounded" />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tài liệu đính kèm</h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Product_Specs.pdf</p>
                            <p className="text-xs text-gray-500">2.4 MB • Đã tải lên 10/11/2024</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-gray-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Safety_Data_Sheet.pdf</p>
                            <p className="text-xs text-gray-500">1.8 MB • Đã tải lên 05/11/2024</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-gray-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-primary hover:text-primary transition-colors w-full justify-center">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">Tải lên tài liệu</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail