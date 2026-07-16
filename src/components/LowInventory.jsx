import { PackageX, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ============================================================
// Data mặc định — fallback khi không truyền props
// ============================================================
const DEFAULT_DATA = [
  { id: '1', name: 'Bột giặt OMO 1.8kg', sku: 'SP001', stock: 12, minStock: 50, status: 'critical' },
  { id: '2', name: 'Nước rửa chén Sunlight 500ml', sku: 'SP002', stock: 28, minStock: 60, status: 'warning' },
  { id: '3', name: 'Dầu gội Pantene 400ml', sku: 'SP003', stock: 8, minStock: 40, status: 'critical' },
  { id: '4', name: 'Sữa tắm Dove 500ml', sku: 'SP004', stock: 35, minStock: 45, status: 'warning' },
  { id: '5', name: 'Bánh snack Poca 100g', sku: 'SP005', stock: 5, minStock: 30, status: 'critical' },
  { id: '6', name: 'Nước lọc Lavie 19L', sku: 'SP006', stock: 42, minStock: 50, status: 'warning' },
]

// ============================================================
// Tính % tồn kho so với mức tối thiểu
// ============================================================
const calcPercent = (stock, minStock) => {
  if (!minStock) return 0
  return Math.round((stock / minStock) * 100)
}

// ============================================================
// Style cho progress bar + status badge
// ============================================================
const getStatusStyle = (status, percent) => {
  // Ưu tiên status truyền vào, nếu không thì tính theo percent
  const isCritical = status === 'critical' || (status === undefined && percent <= 30)

  if (isCritical) {
    return {
      bar: 'bg-red-500',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800',
      label: 'Cần nhập',
    }
  }
  return {
    bar: 'bg-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 ring-1 ring-yellow-200 dark:ring-yellow-800',
    label: 'Sắp hết',
  }
}

function LowInventory({ data: propData, onRowClick }) {
  const navigate = useNavigate()
  const data = propData || DEFAULT_DATA

  const handleRowClick = (item) => {
    if (onRowClick) {
      onRowClick(item)
    } else if (item.id) {
      navigate(`/products/${item.id}`)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30">
            <PackageX className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Tồn kho thấp
          </h2>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {data.length} mặt hàng
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <th className="px-2 sm:px-3 py-2 font-medium">Sản phẩm</th>
              <th className="px-2 sm:px-3 py-2 font-medium">SKU</th>
              <th className="px-2 sm:px-3 py-2 font-medium text-right">Tồn</th>
              <th className="px-2 sm:px-3 py-2 font-medium text-right">Min</th>
              <th className="px-2 sm:px-3 py-2 font-medium w-[120px]">%</th>
              <th className="px-2 sm:px-3 py-2 font-medium text-center">TT</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const percent = calcPercent(item.stock, item.minStock)
              const style = getStatusStyle(item.status, percent)

              return (
                <tr
                  key={item.id || item.sku}
                  onClick={() => handleRowClick(item)}
                  className="border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
                >
                  {/* Sản phẩm */}
                  <td className="px-2 sm:px-3 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[130px] sm:max-w-[180px]">
                        {item.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-2 sm:px-3 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                    {item.sku}
                  </td>

                  {/* Tồn kho */}
                  <td className="px-2 sm:px-3 py-3 text-right font-semibold text-gray-900 dark:text-white tabular-nums">
                    {item.stock.toLocaleString('vi-VN')}
                  </td>

                  {/* Mức tối thiểu */}
                  <td className="px-2 sm:px-3 py-3 text-right text-gray-500 dark:text-gray-400 tabular-nums">
                    {item.minStock.toLocaleString('vi-VN')}
                  </td>

                  {/* Progress bar % */}
                  <td className="px-2 sm:px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                          style={{ width: `${Math.min(100, Math.max(4, percent))}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 w-9 text-right tabular-nums">
                        {percent}%
                      </span>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-2 sm:px-3 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
                      {style.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LowInventory