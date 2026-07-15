import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, ChevronDown, Edit2, Trash2, Eye, Package, AlertTriangle } from 'lucide-react'

function Products() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const products = [
    { id: 1, code: 'SP001', name: 'iPhone 15 Pro Max 256GB', category: 'Điện tử', price: 25000000, stock: 45, status: 'active' },
    { id: 2, code: 'SP002', name: 'Samsung Galaxy S24 Ultra', category: 'Điện tử', price: 22000000, stock: 8, status: 'active' },
    { id: 3, code: 'SP003', name: 'MacBook Air M2', category: 'Điện tử', price: 28000000, stock: 15, status: 'active' },
    { id: 4, code: 'SP004', name: 'Sữa tươi Vinamilk 1L', category: 'Thực phẩm', price: 35000, stock: 120, status: 'active' },
    { id: 5, code: 'SP005', name: 'Gạo ST25 5kg', category: 'Thực phẩm', price: 180000, stock: 200, status: 'active' },
    { id: 6, code: 'SP006', name: 'Dầu gội Head & Shoulders', category: 'Mỹ phẩm', price: 85000, stock: 25, status: 'active' },
    { id: 7, code: 'SP007', name: 'iPad Pro 12.9"', category: 'Điện tử', price: 32000000, stock: 30, status: 'active' },
    { id: 8, code: 'SP008', name: 'AirPods Pro 2', category: 'Điện tử', price: 6500000, stock: 50, status: 'active' },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Sản phẩm</h1>
            
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Thêm sản phẩm</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
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
                  <option value="dien-tu">Điện tử</option>
                  <option value="thuc-pham">Thực phẩm</option>
                  <option value="my-pham">Mỹ phẩm</option>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
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
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{product.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-300">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/products/${product.code}`}>
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Sửa">
                          <Edit2 className="w-4 h-4" />
                        </button>
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
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{products.length}</span> của <span className="font-medium">{products.length}</span> kết quả
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
    </div>
  )
}

export default Products