import { useState, useEffect } from 'react'
import { 
  Plus, Edit2, Trash2, Warehouse, MapPin, 
  ChevronRight, ChevronDown, Package, AlertCircle, CheckCircle 
} from 'lucide-react'
import { warehouseApi } from '../services/api'

function Warehouses() {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [expandedWarehouse, setExpandedWarehouse] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    capacity: 1000,
    status: true
  })

  useEffect(() => {
    loadWarehouses()
  }, [])

  const loadWarehouses = async () => {
    try {
      const data = await warehouseApi.getWarehouses()
      setWarehouses(data)
    } catch (error) {
      console.error('Error loading warehouses:', error)
      showToast('Lỗi khi tải danh sách kho', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingWarehouse) {
        await warehouseApi.updateWarehouse(editingWarehouse.id, formData)
        showToast('Cập nhật kho thành công', 'success')
      } else {
        await warehouseApi.createWarehouse(formData)
        showToast('Thêm kho mới thành công', 'success')
      }
      
      setShowModal(false)
      setEditingWarehouse(null)
      setFormData({ code: '', name: '', address: '', capacity: 1000, status: true })
      loadWarehouses()
    } catch (error) {
      console.error('Error saving warehouse:', error)
      showToast('Lỗi khi lưu kho', 'error')
    }
  }

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse)
    setFormData({
      code: warehouse.code,
      name: warehouse.name,
      address: warehouse.address || '',
      capacity: warehouse.capacity || 1000,
      status: warehouse.status
    })
    setShowModal(true)
  }

  const handleDelete = async (warehouse) => {
    const zoneCount = warehouse.zones?.length || 0
    
    if (zoneCount > 0) {
      showToast(`Không thể xóa kho "${warehouse.name}" vì đã có ${zoneCount} dãy/kệ/hàng bên trong. Vui lòng xóa tất cả dãy trước.`, 'error')
      return
    }
    
    if (!confirm(`Bạn có chắc muốn xóa kho "${warehouse.name}"?\n\nHành động này không thể hoàn tác!`)) return
    
    try {
      await warehouseApi.deleteWarehouse(warehouse.id)
      showToast('Xóa kho thành công', 'success')
      loadWarehouses()
    } catch (error) {
      console.error('Error deleting warehouse:', error)
      showToast(error.message || 'Lỗi khi xóa kho', 'error')
    }
  }

  const toggleExpand = (warehouseId) => {
    setExpandedWarehouse(expandedWarehouse === warehouseId ? null : warehouseId)
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Kho</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý các kho hàng trong hệ thống</p>
        </div>
        <button
          onClick={() => {
            setEditingWarehouse(null)
            setFormData({ code: '', name: '', address: '', capacity: 1000, status: true })
            setShowModal(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Thêm Kho mới</span>
        </button>
      </div>

      {/* Warehouses List */}
      {warehouses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Warehouse className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có kho nào</h3>
          <p className="text-sm text-gray-500">Nhấn nút "Thêm Kho mới" để tạo kho đầu tiên</p>
        </div>
      ) : (
        <div className="space-y-4">
          {warehouses.map(warehouse => (
            <div key={warehouse.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Warehouse Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExpand(warehouse.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {expandedWarehouse === warehouse.id ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <Warehouse className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                      <p className="text-sm text-gray-600">Mã: {warehouse.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(warehouse)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(warehouse)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Warehouse Details */}
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Địa chỉ</p>
                      <p className="text-sm font-medium text-gray-900">{warehouse.address || 'Chưa có'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sức chứa</p>
                    <p className="text-sm font-medium text-gray-900">{warehouse.capacity} bins</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Trạng thái</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      warehouse.status 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {warehouse.status ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          Ngừng hoạt động
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Số dãy</p>
                    <p className="text-sm font-medium text-gray-900">{warehouse.zones?.length || 0} dãy</p>
                  </div>
                </div>

                {/* Zones List */}
                {expandedWarehouse === warehouse.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Cấu trúc kho:</h4>
                    {warehouse.zones && warehouse.zones.length > 0 ? (
                      <div className="space-y-2">
                        {warehouse.zones.map(zone => (
                          <div key={zone.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                              <Box className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-gray-900">{zone.name}</span>
                              <span className="text-xs text-gray-500">({zone.code})</span>
                            </div>
                            <div className="ml-6 space-y-1">
                              {zone.shelves && zone.shelves.length > 0 ? (
                                zone.shelves.map(shelf => (
                                  <div key={shelf.id} className="flex items-center gap-2 text-sm">
                                    <Package className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-700">{shelf.name}</span>
                                    <span className="text-xs text-gray-500">
                                      ({shelf.bins?.length || 0} ô)
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-gray-500 italic ml-5">Chưa có kệ nào</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Chưa có dãy nào trong kho này</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingWarehouse ? 'Cập nhật Kho' : 'Thêm Kho mới'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingWarehouse(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã Kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ví dụ: WH-HN, WH-HP"
                  disabled={editingWarehouse}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ví dụ: Kho Hà Nội"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ví dụ: Hà Nội, Việt Nam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sức chứa (số bins tối đa)
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="status" className="text-sm text-gray-700">
                  Kho đang hoạt động
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingWarehouse(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!formData.code || !formData.name}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingWarehouse ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

// Box icon component
function Box({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

export default Warehouses