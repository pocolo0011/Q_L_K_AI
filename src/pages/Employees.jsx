import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ChevronDown, Eye, Edit2, Trash2, Phone, Mail, Shield, UserCheck, UserX } from 'lucide-react'

function Employees() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const employees = [
    {
      id: 'NV001',
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@khoai.com',
      role: 'Quản lý kho',
      warehouse: 'Kho Hà Nội',
      status: 'active',
      username: 'nguyenvana',
      permissions: ['import', 'export', 'inventory', 'reports', 'manage_warehouse']
    },
    {
      id: 'NV002',
      fullName: 'Trần Thị B',
      phone: '0912345678',
      email: 'tranthib@khoai.com',
      role: 'Nhân viên kho',
      warehouse: 'Kho TP.HCM',
      status: 'active',
      username: 'tranthib',
      permissions: ['import', 'export', 'inventory']
    },
    {
      id: 'NV003',
      fullName: 'Lê Văn C',
      phone: '0923456789',
      email: 'levanc@khoai.com',
      role: 'Thủ kho',
      warehouse: 'Kho Đà Nẵng',
      status: 'active',
      username: 'levanc',
      permissions: ['import', 'export', 'inventory', 'reports']
    },
    {
      id: 'NV004',
      fullName: 'Phạm Thị D',
      phone: '0934567890',
      email: 'phamthid@khoai.com',
      role: 'Nhân viên kho',
      warehouse: 'Kho Hà Nội',
      status: 'inactive',
      username: 'phamthid',
      permissions: ['inventory']
    },
    {
      id: 'NV005',
      fullName: 'Hoàng Văn E',
      phone: '0945678901',
      email: 'hoangvane@khoai.com',
      role: 'Quản lý kho',
      warehouse: 'Kho TP.HCM',
      status: 'active',
      username: 'hoangvane',
      permissions: ['import', 'export', 'inventory', 'reports', 'manage_warehouse', 'manage_employees']
    },
  ]

  const roles = [
    { id: 'admin', name: 'Quản trị viên', permissions: ['all'] },
    { id: 'manager', name: 'Quản lý kho', permissions: ['import', 'export', 'inventory', 'reports', 'manage_warehouse'] },
    { id: 'warehouse_staff', name: 'Nhân viên kho', permissions: ['import', 'export', 'inventory'] },
    { id: 'storekeeper', name: 'Thủ kho', permissions: ['import', 'export', 'inventory', 'reports'] },
  ]

  const allPermissions = [
    { id: 'import', name: 'Nhập kho', description: 'Tạo và xử lý phiếu nhập kho' },
    { id: 'export', name: 'Xuất kho', description: 'Tạo và xử lý phiếu xuất kho' },
    { id: 'inventory', name: 'Quản lý tồn kho', description: 'Xem và cập nhật tồn kho' },
    { id: 'reports', name: 'Xem báo cáo', description: 'Truy cập các báo cáo thống kê' },
    { id: 'manage_warehouse', name: 'Quản lý kho', description: 'Quản lý vị trí và cấu trúc kho' },
    { id: 'manage_employees', name: 'Quản lý nhân viên', description: 'Thêm, sửa, xóa nhân viên' },
    { id: 'manage_suppliers', name: 'Quản lý nhà cung cấp', description: 'Quản lý thông tin NCC' },
    { id: 'manage_products', name: 'Quản lý sản phẩm', description: 'Thêm, sửa, xóa sản phẩm' },
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
        return 'Đang làm việc'
      case 'inactive':
        return 'Đã nghỉ'
      default:
        return 'Không xác định'
    }
  }

  const openPermissionModal = (employee) => {
    setSelectedEmployee(employee)
    setShowPermissionModal(true)
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Nhân viên</h1>
            
            <Link to="/employees/create">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Thêm nhân viên</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm mã NV, họ tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vai trò</label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">Tất cả</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Warehouse Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kho phụ trách</label>
              <div className="relative">
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="hanoi">Kho Hà Nội</option>
                  <option value="hcm">Kho TP.HCM</option>
                  <option value="danang">Kho Đà Nẵng</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none">
                  <option value="all">Tất cả</option>
                  <option value="active">Đang làm việc</option>
                  <option value="inactive">Đã nghỉ</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã NV</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Họ tên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SĐT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Vai trò</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Kho phụ trách</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{employee.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {employee.fullName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{employee.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {employee.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{employee.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{employee.warehouse}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
                        {employee.status === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {getStatusText(employee.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openPermissionModal(employee)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors" 
                          title="Phân quyền"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <Link to={`/employees/${employee.id}`}>
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link to={`/employees/${employee.id}/edit`}>
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
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{employees.length}</span> của <span className="font-medium">{employees.length}</span> kết quả
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

      {/* Permission Modal */}
      {showPermissionModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Phân quyền - {selectedEmployee.fullName}</h2>
                <button 
                  onClick={() => setShowPermissionModal(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Vai trò: <span className="font-medium">{selectedEmployee.role}</span>
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quyền truy cập</h3>
              <div className="space-y-3">
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={selectedEmployee.permissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            permissions: [...selectedEmployee.permissions, permission.id]
                          })
                        } else {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            permissions: selectedEmployee.permissions.filter(p => p !== permission.id)
                          })
                        }
                      }}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary mt-0.5"
                    />
                    <div className="flex-1">
                      <label htmlFor={permission.id} className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                        {permission.name}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button 
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  alert('Đã lưu phân quyền cho ' + selectedEmployee.fullName)
                  setShowPermissionModal(false)
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Lưu phân quyền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees