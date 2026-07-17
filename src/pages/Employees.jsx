import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ChevronDown, Eye, Edit2, Trash2, Phone, Mail, Shield, UserCheck, UserX, X, AlertCircle } from 'lucide-react'
import { warehouseApi, employeesApi } from '../services/api'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [toast, setToast] = useState(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  // Form
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formData, setFormData] = useState({
    employeeCode: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'STAFF',
    warehouseId: '',
    address: '',
    birthday: '',
    gender: ''
  })

  const roles = [
    { id: 'ADMIN', name: 'Quản trị viên' },
    { id: 'MANAGER', name: 'Quản lý kho' },
    { id: 'STAFF', name: 'Nhân viên kho' },
    { id: 'STOREKEEPER', name: 'Thủ kho' }
  ]

  useEffect(() => {
    loadEmployees()
    loadWarehouses()
  }, [])

  useEffect(() => {
    loadEmployees()
  }, [searchQuery, selectedRole, selectedWarehouse, selectedStatus])

  const loadEmployees = async () => {
    try {
      const params = {
        search: searchQuery,
        role: selectedRole,
        warehouseId: selectedWarehouse,
        status: selectedStatus,
        limit: 100
      }
      const data = await employeesApi.getEmployees(params)
      setEmployees(data.employees || [])
    } catch (error) {
      console.error('Error loading employees:', error)
      showToast('Lỗi khi tải danh sách nhân viên', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadWarehouses = async () => {
    try {
      const data = await warehouseApi.getWarehouses()
      setWarehouses(data)
    } catch (error) {
      console.error('Error loading warehouses:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.fullName || !formData.email || !formData.phone) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
      return
    }

    try {
      if (editingEmployee) {
        await employeesApi.updateEmployee(editingEmployee.userId, formData)
        showToast('Cập nhật nhân viên thành công', 'success')
      } else {
        await employeesApi.createEmployee(formData)
        showToast('Thêm nhân viên mới thành công', 'success')
      }

      setShowModal(false)
      setEditingEmployee(null)
      setFormData({
        employeeCode: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'STAFF',
        warehouseId: '',
        address: '',
        birthday: '',
        gender: ''
      })
      loadEmployees()
    } catch (error) {
      showToast(error.message || 'Lỗi khi lưu nhân viên', 'error')
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      employeeCode: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      password: '',
      role: employee.role,
      warehouseId: employee.warehouseId || '',
      address: employee.address || '',
      birthday: employee.birthday ? new Date(employee.birthday).toISOString().split('T')[0] : '',
      gender: employee.gender || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (employee) => {
    if (!confirm(`Bạn có chắc muốn xóa nhân viên "${employee.fullName}"?\n\nHành động này không thể hoàn tác!`)) return

    try {
      await employeesApi.deleteEmployee(employee.userId)
      showToast('Xóa nhân viên thành công', 'success')
      loadEmployees()
    } catch (error) {
      showToast(error.message || 'Lỗi khi xóa nhân viên', 'error')
    }
  }

  const handleResetPassword = async (employee) => {
    if (!confirm(`Bạn có chắc muốn reset mật khẩu cho nhân viên "${employee.fullName}"?\n\nMật khẩu mặc định sẽ là: 123456`)) return

    try {
      await employeesApi.resetPassword(employee.userId, '123456')
      showToast(`Reset mật khẩu thành công cho ${employee.fullName}. Mật khẩu mới: 123456`, 'success')
    } catch (error) {
      showToast('Lỗi khi reset mật khẩu', 'error')
    }
  }

  const handleViewDetail = async (employee) => {
    try {
      const data = await employeesApi.getEmployee(employee.userId)
      setSelectedEmployee(data)
      setShowDetailModal(true)
    } catch (error) {
      console.error('Error loading employee detail:', error)
      showToast('Lỗi khi tải chi tiết nhân viên', 'error')
    }
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

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

  const getRoleName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên'
      case 'MANAGER':
        return 'Quản lý kho'
      case 'STAFF':
        return 'Nhân viên kho'
      case 'STOREKEEPER':
        return 'Thủ kho'
      default:
        return role
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Nhân viên</h1>
            <button
              onClick={() => {
                setEditingEmployee(null)
                setFormData({
                  employeeCode: '',
                  fullName: '',
                  email: '',
                  phone: '',
                  password: '',
                  role: 'STAFF',
                  warehouseId: '',
                  address: '',
                  birthday: '',
                  gender: ''
                })
                setShowModal(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Thêm nhân viên</span>
            </button>
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
                  {warehouses.map(wh => (
                    <option key={wh.id} value={wh.id}>{wh.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      Chưa có nhân viên nào
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                        <span className="text-sm text-gray-700 dark:text-gray-300">{employee.roleName}</span>
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
                            onClick={() => handleResetPassword(employee)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors" 
                            title="Reset mật khẩu"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewDetail(employee)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingEmployee ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingEmployee(null)
                    setFormData({
                      employeeCode: '',
                      fullName: '',
                      email: '',
                      phone: '',
                      password: '',
                      role: 'STAFF',
                      warehouseId: '',
                      address: '',
                      birthday: '',
                      gender: ''
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã nhân viên
                    </label>
                    <input
                      type="text"
                      value={formData.employeeCode}
                      onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Tự động nếu để trống"
                      disabled={editingEmployee}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Nhập họ tên"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="0901234567"
                      required
                    />
                  </div>

                  {!editingEmployee && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu
                      </label>
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Mặc định: 123456"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                        required
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kho phụ trách
                    </label>
                    <div className="relative">
                      <select
                        value={formData.warehouseId}
                        onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                      >
                        <option value="">-- Chọn kho --</option>
                        {warehouses.map(wh => (
                          <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <div className="relative">
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                      >
                        <option value="">-- Chọn --</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingEmployee(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết nhân viên</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedEmployee(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã nhân viên</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedEmployee.status)}`}>
                      {getStatusText(selectedEmployee.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vai trò</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.roleName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SĐT</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Kho phụ trách</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.warehouse?.name || 'Chưa phân công'}</p>
                  </div>
                  {selectedEmployee.address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium text-gray-900">{selectedEmployee.address}</p>
                    </div>
                  )}
                  {selectedEmployee.birthday && (
                    <div>
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="font-medium text-gray-900">{new Date(selectedEmployee.birthday).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}
                  {selectedEmployee.gender && (
                    <div>
                      <p className="text-sm text-gray-500">Giới tính</p>
                      <p className="font-medium text-gray-900">
                        {selectedEmployee.gender === 'male' ? 'Nam' : selectedEmployee.gender === 'female' ? 'Nữ' : 'Khác'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      setSelectedEmployee(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      setSelectedEmployee(null)
                      handleEdit(selectedEmployee)
                    }}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <UserCheck className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default Employees