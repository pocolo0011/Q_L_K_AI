import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  X, Printer, Send, XCircle, CheckCircle, 
  Phone, MapPin, Calendar, CreditCard, Package,
  Truck, User, Clock, ChevronRight
} from 'lucide-react'

function OrderDetail() {
  const { id } = useParams()
  const [isModal, setIsModal] = useState(false)

  // Sample order data
  const order = {
    id: id || 'DH20241114001',
    status: 'pending',
    customer: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Quận Hoàn Kiếm, Hà Nội'
    },
    createdAt: '14/11/2024',
    expectedDelivery: '16/11/2024',
    paymentMethod: 'COD (Thanh toán khi nhận hàng)',
    warehouse: 'Kho Hà Nội',
    manager: 'Nguyễn Văn A (QL kho)',
    items: [
      { id: 'SP001', name: 'iPhone 15 Pro Max 256GB', quantity: 1, price: 25000000 },
      { id: 'SP002', name: 'AirPods Pro 2', quantity: 2, price: 6500000 },
    ],
    timeline: [
      { status: 'pending', label: 'Chờ xác nhận', time: '14/11/2024 10:30', active: true },
      { status: 'confirmed', label: 'Đã xác nhận', time: null, active: false },
      { status: 'delivering', label: 'Đang giao', time: null, active: false },
      { status: 'completed', label: 'Hoàn thành', time: null, active: false },
    ]
  }

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

  const calculateTotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const handleConfirm = () => {
    alert('Đã xác nhận đơn hàng thành công!')
  }

  const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      alert('Đã hủy đơn hàng')
    }
  }

  const handlePrint = () => {
    alert('Đang in hóa đơn...')
  }

  // Modal view
  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal content here - same as page but with close button */}
          <div className="p-6">
            {/* Order detail content */}
          </div>
        </div>
      </div>
    )
  }

  // Full page view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/orders" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chi tiết đơn hàng</h1>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Mã đơn: <span className="font-mono font-semibold text-primary">{order.id}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {order.status === 'pending' && (
                <>
                  <button
                    onClick={handleConfirm}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Xác nhận đơn</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="font-medium">Hủy đơn</span>
                  </button>
                </>
              )}
              {order.status === 'confirmed' && (
                <Link to="/inventory/out/create">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition-colors">
                    <Send className="w-4 h-4" />
                    <span className="font-medium">Xuất kho</span>
                  </button>
                </Link>
              )}
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span className="font-medium">In hóa đơn</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Order Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tên khách hàng</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Số điện thoại</p>
                  <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.customer.phone}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Địa chỉ</p>
                  <div className="flex items-start gap-1 text-sm text-gray-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    {order.customer.address}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Thông tin đơn hàng
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ngày tạo</p>
                  <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {order.createdAt}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ngày dự kiến giao</p>
                  <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                    <Truck className="w-4 h-4 text-gray-400" />
                    {order.expectedDelivery}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phương thức thanh toán</p>
                  <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    {order.paymentMethod}
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-primary" />
                Thông tin kho xuất
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Kho xuất</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.warehouse}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Người phụ trách</p>
                  <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                    <User className="w-4 h-4 text-gray-400" />
                    {order.manager}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Products & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Danh sách sản phẩm
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã SP</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tên sản phẩm</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SL</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Đơn giá</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{item.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-900 dark:text-white">{item.quantity}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-gray-900 dark:text-white">{formatCurrency(item.price)}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        Tổng cộng:
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-lg font-bold text-primary">{formatCurrency(calculateTotal())}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Lịch sử trạng thái
              </h3>
              <div className="space-y-4">
                {order.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.active 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}>
                        {item.active ? (
                          <ChevronRight className="w-5 h-5" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`text-sm font-medium ${
                        item.active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {item.label}
                      </p>
                      {item.time && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.time}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail