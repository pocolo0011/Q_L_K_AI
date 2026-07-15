import { useState } from 'react'
import { 
  Building2, Warehouse, Settings as SettingsIcon, Plug, Database, 
  Users, Palette, Globe, Upload, Save, Plus, 
  Edit2, Trash2, CheckCircle, XCircle, ExternalLink,
  Truck, Calculator, ShoppingBag
} from 'lucide-react'

function SettingsPage() {
  const [activeSection, setActiveSection] = useState('company')
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Công ty TNHH KHO AI',
    taxCode: '0123456789',
    address: '123 Đường ABC, Quận Hoàn Kiếm, Hà Nội',
    phone: '19001234',
    email: 'info@khoai.com',
    website: 'www.khoai.com',
    logo: null
  })

  const [warehouses, setWarehouses] = useState([
    { id: 'WH001', name: 'Kho Hà Nội', address: 'Hà Nội', capacity: 10000, used: 7500, status: 'active' },
    { id: 'WH002', name: 'Kho TP.HCM', address: 'TP.HCM', capacity: 15000, used: 12000, status: 'active' },
    { id: 'WH003', name: 'Kho Đà Nẵng', address: 'Đà Nẵng', capacity: 8000, used: 6000, status: 'active' },
  ])

  const [integrations, setIntegrations] = useState([
    { id: 'shopee', name: 'Shopee', icon: ShoppingBag, connected: true, lastSync: '2 phút trước' },
    { id: 'lazada', name: 'Lazada', icon: ShoppingBag, connected: true, lastSync: '5 phút trước' },
    { id: 'ghn', name: 'Giao Hàng Nhanh', icon: Truck, connected: true, lastSync: '1 giờ trước' },
    { id: 'ghtk', name: 'Giao Hàng Tiết Kiệm', icon: Truck, connected: false, lastSync: null },
    { id: 'accounting', name: 'Kế toán', icon: Calculator, connected: false, lastSync: null },
  ])

  const menuItems = [
    { id: 'company', label: 'Thông tin công ty', icon: Building2 },
    { id: 'warehouses', label: 'Quản lý kho', icon: Warehouse },
    { id: 'general', label: 'Cấu hình chung', icon: SettingsIcon },
    { id: 'integrations', label: 'Tích hợp hệ thống', icon: Plug },
    { id: 'backup', label: 'Sao lưu & Khôi phục', icon: Database },
    { id: 'users', label: 'Quản lý người dùng', icon: Users, link: '/employees' },
    { id: 'interface', label: 'Giao diện & Ngôn ngữ', icon: Palette },
  ]

  const toggleIntegration = (id) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, connected: !integration.connected, lastSync: !integration.connected ? 'Vừa kết nối' : null }
        : integration
    ))
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt Hệ thống</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quản lý cấu hình và tích hợp hệ thống</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Settings Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => item.link ? window.location.href = item.link : setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.link && <ExternalLink className="w-3 h-3 ml-auto" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {/* Company Information */}
            {activeSection === 'company' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Thông tin công ty</h2>
                
                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Logo công ty
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        {companyInfo.logo ? (
                          <img src={companyInfo.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tải lên logo
                      </button>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tên công ty
                      </label>
                      <input
                        type="text"
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mã số thuế
                      </label>
                      <input
                        type="text"
                        value={companyInfo.taxCode}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, taxCode: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Website
                      </label>
                      <input
                        type="text"
                        value={companyInfo.website}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <Save className="w-4 h-4" />
                      <span className="font-medium">Lưu thay đổi</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Warehouse Management */}
            {activeSection === 'warehouses' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quản lý kho</h2>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Thêm kho</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {warehouses.map((warehouse) => (
                    <div key={warehouse.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{warehouse.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{warehouse.address}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sức chứa</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{warehouse.capacity.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Đã sử dụng</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{warehouse.used.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${(warehouse.used / warehouse.capacity) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {Math.round((warehouse.used / warehouse.capacity) * 100)}% đã sử dụng
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Configuration */}
            {activeSection === 'general' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Cấu hình chung</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Tự động tạo mã sản phẩm</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tự động sinh mã SP khi thêm mới</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Cảnh báo tồn kho tự động</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Gửi thông báo khi tồn kho thấp</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Theo dõi lô sản phẩm</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Bật tính năng lot tracking mặc định</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* System Integrations */}
            {activeSection === 'integrations' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tích hợp hệ thống</h2>
                
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <integration.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                            {integration.connected ? (
                              <div className="flex items-center gap-1 mt-1">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-600">Đã kết nối • {integration.lastSync}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500 dark:text-gray-400">Chưa kết nối</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleIntegration(integration.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            integration.connected
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-primary text-white hover:bg-blue-600'
                          }`}
                        >
                          {integration.connected ? 'Ngắt kết nối' : 'Kết nối'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Backup & Restore */}
            {activeSection === 'backup' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sao lưu & Khôi phục dữ liệu</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sao lưu dữ liệu</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Tạo bản sao lưu toàn bộ dữ liệu hệ thống. Bạn có thể khôi phục từ bản sao lưu này khi cần.
                    </p>
                    <div className="flex gap-3">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Database className="w-4 h-4" />
                        <span className="font-medium">Sao lưu ngay</span>
                      </button>
                      <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Download className="w-4 h-4" />
                        <span>Tải xuống</span>
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Khôi phục dữ liệu</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Khôi phục hệ thống từ file sao lưu. Lưu ý: Dữ liệu hiện tại sẽ bị ghi đè.
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-warning text-white rounded-lg hover:bg-orange-600 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="font-medium">Chọn file sao lưu</span>
                    </button>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Lưu ý:</strong> Hệ thống tự động sao lưu hàng ngày lúc 00:00. Bản sao lưu được lưu trữ trong 30 ngày.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Interface & Language */}
            {activeSection === 'interface' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Giao diện & Ngôn ngữ</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngôn ngữ
                    </label>
                    <select className="input-field">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Màu chủ đạo
                    </label>
                    <div className="flex gap-3">
                      <button className="w-10 h-10 bg-primary rounded-lg border-2 border-white shadow-md"></button>
                      <button className="w-10 h-10 bg-green-500 rounded-lg border-2 border-transparent hover:border-gray-300"></button>
                      <button className="w-10 h-10 bg-purple-500 rounded-lg border-2 border-transparent hover:border-gray-300"></button>
                      <button className="w-10 h-10 bg-orange-500 rounded-lg border-2 border-transparent hover:border-gray-300"></button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Bật chế độ tối</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
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

export default SettingsPage
