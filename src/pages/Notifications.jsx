import { useState, useEffect } from 'react'
import { 
  Check, CheckCheck, AlertTriangle, ShoppingCart, 
  Clock, Settings, Package, X, Bell
} from 'lucide-react'

function Notifications() {
  const [filter, setFilter] = useState('all') // 'all' or 'unread'
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'inventory',
      icon: AlertTriangle,
      title: 'Cảnh báo tồn kho thấp',
      content: 'Sản phẩm iPhone 15 Pro Max sắp hết hàng (còn 5 sản phẩm)',
      time: '5 phút trước',
      timestamp: Date.now() - 5 * 60 * 1000,
      read: false,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: 2,
      type: 'order',
      icon: ShoppingCart,
      title: 'Đơn hàng mới',
      content: 'Đơn hàng DH20241114001 từ Nguyễn Văn A - Tổng: 32.5 triệu',
      time: '15 phút trước',
      timestamp: Date.now() - 15 * 60 * 1000,
      read: false,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 3,
      type: 'expiry',
      icon: Clock,
      title: 'Sản phẩm sắp hết hạn',
      content: 'Sữa tươi LOT001 sẽ hết hạn trong 3 ngày (20/11/2024)',
      time: '1 giờ trước',
      timestamp: Date.now() - 60 * 60 * 1000,
      read: false,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: 4,
      type: 'system',
      icon: Settings,
      title: 'Bảo trì hệ thống',
      content: 'Hệ thống sẽ bảo trì vào 23:00 ngày 15/11/2024. Thời gian dự kiến: 30 phút',
      time: '2 giờ trước',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      read: true,
      color: 'text-gray-600 bg-gray-50'
    },
    {
      id: 5,
      type: 'inventory',
      icon: Package,
      title: 'Nhập kho thành công',
      content: 'Đã nhập 50 sản phẩm iPhone 15 Pro Max vào Kho Hà Nội',
      time: '3 giờ trước',
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      read: true,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 6,
      type: 'order',
      icon: ShoppingCart,
      title: 'Đơn hàng đã giao',
      content: 'Đơn hàng DH20241113003 đã giao thành công cho Trần Thị B',
      time: '5 giờ trước',
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      read: true,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 7,
      type: 'inventory',
      icon: AlertTriangle,
      title: 'Tồn kho vượt ngưỡng',
      content: 'Samsung Galaxy S24 đã vượt ngưỡng tồn kho tối thiểu (còn 8 sản phẩm)',
      time: '1 ngày trước',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      read: true,
      color: 'text-red-600 bg-red-50'
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  // Simulate realtime notification (WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      // This would be replaced with actual WebSocket connection
      // For demo, we'll just log
      console.log('Checking for new notifications...')
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông báo</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="font-medium">Đánh dấu tất cả đã đọc</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 p-4 transition-all hover:shadow-md ${
                    notification.read 
                      ? 'border-gray-200 dark:border-gray-700 opacity-75' 
                      : 'border-primary dark:border-primary'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${notification.color} flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {notification.time}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Đánh dấu đã đọc"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">Không có thông báo nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications