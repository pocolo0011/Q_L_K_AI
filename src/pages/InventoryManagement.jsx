import { useState, useEffect } from 'react'
import { Plus, Camera, Search, Filter, ChevronDown, Edit2, Trash2, Eye, Package, MapPin, Calendar, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { inventoryApi } from '../services/api'

function InventoryManagement() {
  const [inventories, setInventories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalInventories, setTotalInventories] = useState(0)

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'low':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'normal':
        return 'Bình thường'
      case 'low':
        return 'Thấp'
      case 'critical':
        return 'Nguy cấp'
      default:
        return 'Không xác định'
    }
  }

  const getRowColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 dark:bg-green-900/10'
      case 'low':
        return 'bg-yellow-50 dark:bg-yellow-900/10'
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/10'
      default:
        return 'bg-white dark:bg-gray-800'
    }
  }

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    return daysLeft <= 30
  }

  const toggleRowSelection = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const toggleAllRows = () => {
    if (selectedRows.length === inventories.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(inventories.map(item => item.id))
    }
  }

  // Fetch inventories từ API
  const fetchInventories = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await inventoryApi.getInventories({
        search: searchQuery,
        warehouse: selectedWarehouse,
        category: selectedCategory,
        status: selectedStatus,
        page: currentPage,
        limit: 10
      })
      setInventories(result.inventories)
      setTotalPages(result.pagination.totalPages)
      setTotalInventories(result.pagination.total)
    } catch (err) {
      console.error('Lỗi tải tồn kho:', err)
      setError(err.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  // Load inventories khi thay đổi filter hoặc page
  useEffect(() => {
    fetchInventories()
  }, [currentPage, selectedWarehouse, selectedCategory, selectedStatus])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchInventories()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Tồn kho</h1>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/inventory/create">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Nhập kho mới</span>
                </button>
              </Link>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Xuất kho mới</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-warning text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                <Package className="w-5 h-5" />
                <span className="font-medium">Kiểm kê ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Warehouse Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kho</label>
              <select 
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >
                <option value="all">Tất cả kho</option>
                <option value="hanoi">Kho Hà Nội</option>
                <option value="hcm">Kho TP.HCM</option>
                <option value="danang">Kho Đà Nẵng</option>
              </select>
              <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="dien-tu">Điện tử</option>
                <option value="thuc-pham">Thực phẩm</option>
                <option value="my-pham">Mỹ phẩm</option>
              </select>
              <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="normal">Bình thường</option>
                <option value="low">Thấp</option>
                <option value="critical">Nguy cấp</option>
              </select>
              <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm mã SP, tên sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" title="Quét mã vạch">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            <p className="text-sm font-medium">Không thể tải dữ liệu</p>
            <p className="text-xs mt-1">{error}</p>
            <button onClick={fetchInventories} className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
              Thử lại
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">Đang tải tồn kho...</p>
          </div>
        )}

        {/* Data Table - Desktop */}
        {!loading && !error && (
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === inventories.length}
                        onChange={toggleAllRows}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mã SP</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tên sản phẩm</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Kho</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Vị trí</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tồn thực tế</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tồn khả dụng</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Hạn sử dụng</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {inventories.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`${getRowColor(item.status)} hover:opacity-80 transition-opacity`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => toggleRowSelection(item.id)}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{item.product?.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/products/${item.product?.code}`} className="text-sm font-medium text-primary hover:underline text-left">
                          {item.product?.nameVi}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                          <Package className="w-4 h-4 text-gray-400" />
                          {item.binLocation?.warehouse?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {item.binLocation?.code || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.availableStock}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${isExpiringSoon(item.expiryDate) ? 'text-red-600 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                            {item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : 'N/A'}
                          </span>
                          {isExpiringSoon(item.expiryDate) && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Sửa">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Hiển thị <span className="font-medium">{inventories.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> đến <span className="font-medium">{Math.min(currentPage * 10, totalInventories)}</span> của <span className="font-medium">{totalInventories}</span> kết quả
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-3 py-1 bg-primary text-white rounded">{currentPage}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && inventories.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Không tìm thấy tồn kho nào</p>
          </div>
        )}

        {/* Card List - Mobile */}
        {!loading && !error && (
          <div className="md:hidden space-y-4">
            {inventories.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${getRowColor(item.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => toggleRowSelection(item.id)}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{item.product?.code}</span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-primary mb-3">{item.product?.nameVi}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{item.binLocation?.warehouse?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{item.binLocation?.code || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tồn thực tế:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tồn khả dụng:</span>
                    <span className="text-gray-900 dark:text-white">{item.availableStock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={isExpiringSoon(item.expiryDate) ? 'text-red-600 font-medium' : 'text-gray-700 dark:text-gray-300'}>
                      {item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : 'N/A'}
                    </span>
                    {isExpiringSoon(item.expiryDate) && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                  <button className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Xem</span>
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors">
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm">Sửa</span>
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InventoryManagement