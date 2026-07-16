import { CalendarClock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ============================================================
// Data mặc định — fallback khi không truyền props
// ============================================================
const DEFAULT_DATA = [
  { id: '1', name: 'Sữa tươi TH True Milk 1L', lot: 'LOT2406A', expiry: '2026-07-17', daysLeft: 2, quantity: 120 },
  { id: '2', name: 'Yaourt Vinamilk 4 hũ', lot: 'LOT2406B', expiry: '2026-07-18', daysLeft: 3, quantity: 85 },
  { id: '3', name: 'Bánh quy Oreo 200g', lot: 'LOT2405C', expiry: '2026-07-20', daysLeft: 5, quantity: 64 },
  { id: '4', name: 'Nước cam Vfresh 1L', lot: 'LOT2405D', expiry: '2026-07-22', daysLeft: 7, quantity: 42 },
  { id: '5', name: 'Phô mai Con Bò Cười', lot: 'LOT2404E', expiry: '2026-07-25', daysLeft: 10, quantity: 30 },
  { id: '6', name: 'Trà xanh Không Độ 350ml', lot: 'LOT2404F', expiry: '2026-07-28', daysLeft: 13, quantity: 200 },
]

// ============================================================
// Tính toán ngày còn lại từ expiry date (nếu không có daysLeft)
// ============================================================
const calcDaysLeft = (expiry) => {
  const exp = new Date(expiry)
  const now = new Date()
  const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))
  return diff
}

// ============================================================
// Badge style theo số ngày còn lại
// ============================================================
const getBadgeStyle = (daysLeft) => {
  if (daysLeft <= 3) {
    return {
      label: `${daysLeft} ngày`,
      className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800',
    }
  }
  if (daysLeft <= 7) {
    return {
      label: `${daysLeft} ngày`,
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 ring-1 ring-orange-200 dark:ring-orange-800',
    }
  }
  return {
    label: `${daysLeft} ngày`,
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 ring-1 ring-yellow-200 dark:ring-yellow-800',
  }
}

// Format ngày hiển thị
const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function ExpiringProducts({ data: propData, onRowClick }) {
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
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
            <CalendarClock className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Sản phẩm sắp hết hạn
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
              <th className="px-2 sm:px-3 py-2 font-medium">Lô</th>
              <th className="px-2 sm:px-3 py-2 font-medium">Hạn SD</th>
              <th className="px-2 sm:px-3 py-2 font-medium text-center">Còn lại</th>
              <th className="px-2 sm:px-3 py-2 font-medium text-right">SL</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const daysLeft = item.daysLeft ?? calcDaysLeft(item.expiry)
              const badge = getBadgeStyle(daysLeft)

              return (
                <tr
                  key={item.id || item.lot}
                  onClick={() => handleRowClick(item)}
                  className="border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
                >
                  <td className="px-2 sm:px-3 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]">
                        {item.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                    {item.lot}
                  </td>
                  <td className="px-2 sm:px-3 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {formatDate(item.expiry)}
                  </td>
                  <td className="px-2 sm:px-3 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-3 text-right font-semibold text-gray-900 dark:text-white tabular-nums">
                    {item.quantity.toLocaleString('vi-VN')}
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

export default ExpiringProducts