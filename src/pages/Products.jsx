import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, ChevronDown, Edit2, Trash2, Eye, Package, AlertTriangle, X } from 'lucide-react'
import { productsApi } from '../services/api'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    nameVi: '',
    nameEn: '',
    category: 'Điện tử',
    unit: 'Cái',
    barcode: '',
    costPrice: '',
    sellingPrice: '',
    minStock: 10,
    defaultExpiry: 365,
    lotTracking: false,
    status: 'ACTIVE',
    descriptionVi: '',
    descriptionEn: ''
  })
  const [submitting, setSubmitting] = useState(false)
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, productId: null, productCode: '' })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  // Fetch products từ API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await productsApi.getProducts({
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        page: currentPage,
        limit: 10
      })
      setProducts(result.products)
      setTotalPages(result.pagination.totalPages)
      setTotalProducts(result.pagination.total)
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err)
      setError(err.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  // Load products khi thay đổi filter hoặc page
  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, selectedStatus])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchProducts()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Open modal (Add mode)
  const openModal = () => {
    setIsEditMode(false)
    setEditingProductId(null)
    setIsModalOpen(true)
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      if (isEditMode && editingProductId) {
        // Update existing product
        await productsApi.updateProduct(editingProductId, formData)
        alert('Cập nhật sản phẩm thành công!')
      } else {
        // Create new product
        await productsApi.createProduct(formData)
        alert('Thêm sản phẩm thành công!')
      }
      
      // Refresh products list
      await fetchProducts()
      
      // Close modal
      closeModal()
    } catch (err) {
      console.error('Lỗi lưu sản phẩm:', err)
      alert('Không thể lưu sản phẩm: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Open edit modal
  const openEditModal = async (productId) => {
    try {
      // Fetch product detail
      const product = await productsApi.getProduct(productId)
      
      // Set form data
      setFormData({
        code: product.code,
        nameVi: product.nameVi,
        nameEn: product.nameEn || '',
        category: product.category,
        unit: product.unit,
        barcode: product.barcode || '',
        costPrice: product.costPrice.toString(),
        sellingPrice: product.sellingPrice.toString(),
        minStock: product.minStock,
        defaultExpiry: product.defaultExpiry || 365,
        lotTracking: product.lotTracking,
        status: product.status,
        descriptionVi: product.descriptionVi || '',
        descriptionEn: product.descriptionEn || ''
      })
      
      // Set edit mode
      setIsEditMode(true)
      setEditingProductId(productId)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Lỗi tải chi tiết sản phẩm:', err)
      alert('Không thể tải thông tin sản phẩm')
    }
  }

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingProductId(null)
    // Reset form
    setFormData({
      code: '',
      nameVi: '',
      nameEn: '',
      category: 'Điện tử',
      unit: 'Cái',
      barcode: '',
      costPrice: '',
      sellingPrice: '',
      minStock: 10,
      defaultExpiry: 365,
      lotTracking: false,
      status: 'ACTIVE',
      descriptionVi: '',
      descriptionEn: ''
    })
  }

  // Handle delete
  const handleDelete = async (productId, productCode) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productCode}"?\n\nHành động này không thể hoàn tác!`)) {
      return
    }

    try {
      await productsApi.deleteProduct(productId)
      alert('Xóa sản phẩm thành công!')
      
      // Refresh products list
      await fetchProducts()
    } catch (err) {
      console.error('Lỗi xóa sản phẩm:', err)
      alert('Không thể xóa sản phẩm: ' + err.message)
    }
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Sản phẩm</h1>
            
            <button 
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Thêm sản phẩm</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            <p className="text-sm font-medium">Không thể tải dữ liệu</p>
            <p className="text-xs mt-1">{error}</p>
            <button onClick={fetchProducts} className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
              Thử lại
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm mã SP, tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="Điện tử">Điện tử</option>
                  <option value="Thực phẩm">Thực phẩm</option>
                  <option value="Mỹ phẩm">Mỹ phẩm</option>
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
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DISCONTINUED">Discontinued</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">Đang tải sản phẩm...</p>
          </div>
        )}

        {/* Products Table */}
        {!loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mã SP</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tên sản phẩm</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Danh mục</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Giá bán</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tồn kho</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{product.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/products/${product.code}`} className="text-sm font-medium text-primary hover:underline">
                          {product.nameVi}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{product.category}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(product.sellingPrice)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">-</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : product.status === 'INACTIVE'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                          {product.status === 'ACTIVE' ? 'Active' : product.status === 'INACTIVE' ? 'Inactive' : 'Discontinued'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/products/${product.code}`}>
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => openEditModal(product.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id, product.code)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
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
                Hiển thị <span className="font-medium">{products.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> đến <span className="font-medium">{Math.min(currentPage * 10, totalProducts)}</span> của <span className="font-medium">{totalProducts}</span> kết quả
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-3 py-1 bg-primary text-white rounded">{currentPage}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Modal Thêm Sản phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mã sản phẩm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mã sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: SP013"
                  />
                </div>

                {/* Tên sản phẩm (VI) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên sản phẩm (VI) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameVi"
                    value={formData.nameVi}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: iPhone 15"
                  />
                </div>

                {/* Tên sản phẩm (EN) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên sản phẩm (EN)
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: iPhone 15"
                  />
                </div>

                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Điện tử">Điện tử</option>
                    <option value="Thực phẩm">Thực phẩm</option>
                    <option value="Mỹ phẩm">Mỹ phẩm</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Đơn vị */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Đơn vị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: Cái, L, Bịch"
                  />
                </div>

                {/* Giá vốn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Giá vốn (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: 20000000"
                  />
                </div>

                {/* Giá bán */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: 25000000"
                  />
                </div>

                {/* Tồn kho tối thiểu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tồn kho tối thiểu
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Số ngày hết hạn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số ngày hết hạn
                  </label>
                  <input
                    type="number"
                    name="defaultExpiry"
                    value={formData.defaultExpiry}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Trạng thái */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DISCONTINUED">Discontinued</option>
                  </select>
                </div>

                {/* Mô tả (VI) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mô tả (Tiếng Việt)
                  </label>
                  <textarea
                    name="descriptionVi"
                    value={formData.descriptionVi}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Mô tả sản phẩm..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm sản phẩm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
