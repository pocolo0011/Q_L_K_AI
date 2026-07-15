import { Search, Bell, User, Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

function Header({ onMenuClick }) {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 fixed top-0 right-0 left-0 z-10 transition-colors" style={{ left: '250px' }}>
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, đơn hàng, nhà cung cấp..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Nguyễn Văn A</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Quản lý kho</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header