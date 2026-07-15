import { useState } from 'react'
import { LayoutDashboard, Package, ShoppingCart, Truck, Users, BarChart3, Settings, Warehouse, MapPin, X, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { isDarkMode } = useTheme()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false, path: '/' },
    { icon: Package, label: 'Sản phẩm', active: false, path: '/products' },
    { icon: Package, label: 'Quản lý Tồn kho', active: false, path: '/inventory' },
    { icon: MapPin, label: 'Vị trí Lưu trữ', active: false, path: '/bin-location' },
    { icon: ShoppingCart, label: 'Đơn hàng', active: false, path: '/orders' },
    { icon: Truck, label: 'Nhà cung cấp', active: false, path: '/suppliers' },
    { icon: Users, label: 'Nhân viên', active: false, path: '/employees' },
    { icon: BarChart3, label: 'Báo cáo', active: false, path: '/reports' },
    { icon: User, label: 'Profile', active: false, path: '/profile' },
    { icon: Settings, label: 'Cài đặt', active: true, path: '/settings' },
  ]

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="KHO AI Logo" className="w-10 h-10" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">KHO AI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quản lý kho thông minh</p>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path || '#'}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 lg:hidden
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 shadow-md fixed h-full overflow-y-auto z-20 transition-colors custom-scrollbar">
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
