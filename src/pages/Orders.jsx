import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, ChevronDown, Eye, Printer, X, Package, Truck, User, MapPin } from 'lucide-react'

function Orders() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [searchQuery, setSearchQuery] = useState('')

  const orders = [
    {
      id: 'DH20241114001',
      customer: 'Nguyễn Văn A',
      customerPhone: '0901234567',
      customerAddress: '123 Đường ABC, Hà Nội',
      createdAt: '14/11/2024',
      totalAmount: 12500000,
      productCount: 3,
      status: 'pending',
      warehouse: 'Kho Hà Nội',
      items: [
        { name: 'iPhone 15 Pro Max', quantity: 1, price: 25000000 },
        { name: 'AirPods Pro 2', quantity: 2, price: 6500000 },
      ]
    },
    {
      id: 'DH20241114002',
      customer: 'Trần Thị B',
      customerPhone: '0912345678',
      customerAddress: '456 Đường XYZ, TP.HCM',
      createdAt: '14/11/2024',
      totalAmount: 8500000,
      productCount: 2,
      status: 'confirmed',
      warehouse: 'Kho TP.HCM',
      items: [
        { name: 'Samsung Galaxy S24', quantity: 1, price: 22000000 },
        { name: 'Sạc nhanh 25W', quantity: 1, price: 850000 },
      ]
    },
    {
      id: 'DH20241113003',
      customer: 'Lê Văn C',
      customerPhone: '0923456789',
      customerAddress: '789 Đường DEF, Đà Nẵng',
      createdAt: '13/11/2024',
      totalAmount: 32000000,
      productCount: 1,
      status: 'delivering',
      warehouse: 'Kho Hà Nội',
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: 28000000 },
      ]
    },
    {
      id: 'DH20241112004',
      customer: 'Phạm Thị D',
      customerPhone: '0934567890',
      customerAddress: '321 Đường GHI, Hà Nội',
      createdAt: '12/11/2024',
      totalAmount: 5600000,
      productCount: 4,
      status: 'completed',
      warehouse: 'Kho TP.HCM',
      items: [
        { name: 'iPad Pro 12.9"', quantity: 1, price: 32000000 },
      ]
    },
    {
      id: 'DH20241111005',
      customer: 'Hoàng Văn E',
      customerPhone: '0945678901',
      customerAddress: '654 Đường JKL, Hà Nội',
      createdAt: '11/11/2024',
      totalAmount: 4500000,
      productCount: 2,
      status: 'cancelled',
      warehouse: 'Kho Đà Nẵng',
      items: [
        { name: 'Apple Watch Ultra', quantity: 1, price: 25000000 },
      ]
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'delivering':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'delivering':
        return 'Đang giao'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Hủy'
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Đơn hàng</h1>
            
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
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
                  <option value="hanoi">Kho Hà Nội</option>
                  <option value="hcm">Kho TP.HCM</option>
                  <option value="danang">Kho Đà Nẵng</option>
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
                  placeholder="Tìm mã đơn, tên khách hàng..."
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{order.createdAt}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{order.productCount} sản phẩm</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {order.warehouse}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="In đơn">
                          <Printer className="w-4 h-4" />
                        </button>
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Hủy">
                            <X className="w-4 h-4" />
                          </button>
                        )}
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
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{orders.length}</span> của <span className="font-medium">{orders.length}</span> kết quả
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

export default Orders