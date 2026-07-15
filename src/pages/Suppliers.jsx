import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ChevronDown, Eye, Edit2, Trash2, Phone, Mail, MapPin, Package } from 'lucide-react'

function Suppliers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const suppliers = [
    {
      id: 'NCC001',
      name: 'Apple Vietnam',
      phone: '19001234',
      email: 'contact@apple.com.vn',
      address: 'Tầng 10, Tòa nhà Landmark 81, Hà Nội',
      contactPerson: 'Nguyễn Văn A',
      deliveryCount: 45,
      totalValue: 2500000000,
      status: 'active',
      note: 'Nhà cung cấp chính thức Apple'
    },
    {
      id: 'NCC002',
      name: 'Samsung Electronics',
      phone: '19005678',
      email: 'info@samsung.com',
      address: 'Quận 7, TP.HCM',
      contactPerson: 'Trần Thị B',
      deliveryCount: 38,
      totalValue: 1800000000,
      status: 'active',
      note: 'Đối tác chiến lược'
    },
    {
      id: 'NCC003',
      name: 'Vinamilk Corp',
      phone: '18001234',
      email: 'contact@vinamilk.com.vn',
      address: 'TP.HCM',
      contactPerson: 'Lê Văn C',
      deliveryCount: 120,
      totalValue: 850000000,
      status: 'active',
      note: 'Cung cấp sản phẩm thực phẩm'
    },
    {
      id: 'NCC004',
      name: 'Unilever Vietnam',
      phone: '19009876',
      email: 'info@unilever.com',
      address: 'Hà Nội',
      contactPerson: 'Phạm Thị D',
      deliveryCount: 89,
      totalValue: 650000000,
      status: 'inactive',
      note: 'Tạm ngừng hợp tác'
    },
    {
      id: 'NCC005',
      name: 'Nestle Vietnam',
      phone: '18005678',
      email: 'contact@nestle.com',
      address: 'Đà Nẵng',
      contactPerson: 'Hoàng Văn E',
      deliveryCount: 67,
      totalValue: 420000000,
      status: 'active',
      note: 'Nhà cung cấp mỹ phẩm'
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang hợp tác'
      case 'inactive':
        return 'Ngừng'
      default:
        return 'Không xác định'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Nhà cung cấp</h1>
            
            <Link to="/suppliers/create">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Thêm nhà cung cấp mới</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm mã NCC, tên nhà cung cấp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

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
                  <option value="active">Đang hợp tác</option>
                  <option value="inactive">Ngừng</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Placeholder for alignment */}
            <div className="hidden lg:block">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">&nbsp;</label>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Tổng: <span className="font-semibold text-gray-900 dark:text-white">{suppliers.length}</span> nhà cung cấp
              </div>
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã NCC</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tên nhà cung cấp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SĐT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Địa chỉ</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Số lần giao</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tổng giá trị</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{supplier.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{supplier.name}</p>
                        <p className="text-xs text-gray-500">LH: {supplier.contactPerson}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {supplier.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {supplier.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-xs">{supplier.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{supplier.deliveryCount}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(supplier.totalValue)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(supplier.status)}`}>
                        {getStatusText(supplier.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/suppliers/${supplier.id}`}>
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link to={`/suppliers/${supplier.id}/edit`}>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Sửa">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
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
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{suppliers.length}</span> của <span className="font-medium">{suppliers.length}</span> kết quả
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                Trước
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Suppliers