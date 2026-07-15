import { useState } from 'react'
import { 
  User, Mail, Calendar, Shield, Bell, Monitor, 
  Camera, Save, Lock, Eye, EyeOff, LogOut,
  Smartphone, Laptop, MapPin, AlertTriangle
} from 'lucide-react'

function Profile() {
  const [activeTab, setActiveTab] = useState('personal')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // User data
  const user = {
    name: 'Nguyễn Văn A',
    role: 'Quản lý kho',
    email: 'nguyenvana@khoai.com',
    phone: '0901234567',
    joinDate: '15/01/2023',
    avatar: null,
    department: 'Kho Hà Nội'
  }

  // Personal info form
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user.name,
    email: user.email,
    phone: user.phone,
    address: '123 Đường ABC, Hà Nội',
    birthday: '15/05/1990',
    gender: 'male'
  })

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderAlerts: true,
    inventoryAlerts: true,
    systemUpdates: false,
    marketingEmails: false
  })

  // Login devices
  const devices = [
    {
      id: 1,
      type: 'laptop',
      name: 'MacBook Pro - Chrome',
      location: 'Hà Nội, Việt Nam',
      ip: '192.168.1.100',
      lastActive: 'Đang hoạt động',
      current: true
    },
    {
      id: 2,
      type: 'mobile',
      name: 'iPhone 15 Pro - Safari',
      location: 'Hà Nội, Việt Nam',
      ip: '192.168.1.101',
      lastActive: '2 giờ trước',
      current: false
    },
    {
      id: 3,
      type: 'laptop',
      name: 'Windows PC - Edge',
      location: 'TP.HCM, Việt Nam',
      ip: '192.168.2.50',
      lastActive: '3 ngày trước',
      current: false
    }
  ]

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: User },
    { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
    { id: 'notifications', label: 'Cài đặt thông báo', icon: Bell },
    { id: 'devices', label: 'Thiết bị đăng nhập', icon: Monitor },
  ]

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo({ ...personalInfo, [field]: value })
  }

  const handlePasswordChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value })
  }

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const getDeviceIcon = (type) => {
    if (type === 'mobile') return <Smartphone className="w-5 h-5" />
    return <Laptop className="w-5 h-5" />
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt Tài khoản</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quản lý thông tin và bảo mật tài khoản</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Vai trò</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ngày tham gia</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.joinDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Kho phụ trách</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.department}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tabs */}
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
                {/* Tab 1: Personal Information */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin cá nhân</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          value={personalInfo.fullName}
                          onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ngày sinh
                        </label>
                        <input
                          type="text"
                          value={personalInfo.birthday}
                          onChange={(e) => handlePersonalInfoChange('birthday', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Giới tính
                        </label>
                        <select
                          value={personalInfo.gender}
                          onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                          className="input-field"
                        >
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          value={personalInfo.address}
                          onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
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
                )}

                {/* Tab 2: Change Password */}
                {activeTab === 'password' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đổi mật khẩu</h3>
                    
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            className="input-field pl-10 pr-12"
                            placeholder="Nhập mật khẩu hiện tại"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            className="input-field pl-10 pr-12"
                            placeholder="Nhập mật khẩu mới"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                            className="input-field pl-10 pr-12"
                            placeholder="Nhập lại mật khẩu mới"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div className="text-sm text-yellow-800 dark:text-yellow-200">
                            <p className="font-medium mb-1">Lưu ý bảo mật:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Mật khẩu phải có ít nhất 8 ký tự</li>
                              <li>Nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                              <li>Không chia sẻ mật khẩu với người khác</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <Save className="w-4 h-4" />
                          <span className="font-medium">Cập nhật mật khẩu</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cài đặt thông báo</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Thông báo qua Email</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Nhận thông báo qua địa chỉ email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={() => handleNotificationChange('emailNotifications')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Thông báo đẩy</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Nhận thông báo trên trình duyệt</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.pushNotifications}
                            onChange={() => handleNotificationChange('pushNotifications')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Cảnh báo đơn hàng</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Thông báo khi có đơn hàng mới</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.orderAlerts}
                            onChange={() => handleNotificationChange('orderAlerts')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Cảnh báo tồn kho</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Thông báo khi tồn kho thấp</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.inventoryAlerts}
                            onChange={() => handleNotificationChange('inventoryAlerts')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Save className="w-4 h-4" />
                        <span className="font-medium">Lưu cài đặt</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 4: Login Devices */}
                {activeTab === 'devices' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thiết bị đăng nhập</h3>
                    
                    <div className="space-y-4">
                      {devices.map((device) => (
                        <div key={device.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="p-3 bg-white dark:bg-gray-600 rounded-lg">
                            {getDeviceIcon(device.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</h4>
                              {device.current && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 border border-green-300 rounded-full">
                                  Hiện tại
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {device.location}
                              </div>
                              <div>IP: {device.ip}</div>
                              <div>Hoạt động: {device.lastActive}</div>
                            </div>
                          </div>

                          {!device.current && (
                            <button className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                              Đăng xuất
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Lưu ý:</strong> Nếu thấy thiết bị lạ, hãy đăng xuất ngay và đổi mật khẩu để bảo mật tài khoản.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile