import { Trophy } from 'lucide-react'

// ============================================================
// Data mặc định (Top 5) — fallback khi không truyền props
// ============================================================
const DEFAULT_DATA = [
  { rank: 1, name: 'iPhone 15 Pro Max 256GB', sold: 1240, percent: 100 },
  { rank: 2, name: 'Samsung Galaxy S24 Ultra', sold: 980, percent: 79 },
  { rank: 3, name: 'MacBook Air M3 13 inch', sold: 760, percent: 61 },
  { rank: 4, name: 'AirPods Pro 2 USB-C', sold: 640, percent: 52 },
  { rank: 5, name: 'iPad Pro M4 11 inch', sold: 520, percent: 42 },
]

// Màu huy chương theo rank
const RANK_STYLES = {
  1: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-600 dark:text-yellow-400', ring: 'ring-yellow-400' },
  2: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500 dark:text-gray-300', ring: 'ring-gray-400' },
  3: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-400' },
}

function TopProducts({ data: propData }) {
  const data = propData || DEFAULT_DATA

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
          <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Top 5 sản phẩm bán chạy
        </h2>
      </div>

      {/* List */}
      <div className="space-y-4 flex-1">
        {data.map((item) => {
          const rankStyle = RANK_STYLES[item.rank] || {
            bg: 'bg-blue-50 dark:bg-blue-900/30',
            text: 'text-blue-600 dark:text-blue-400',
            ring: 'ring-blue-400',
          }

          return (
            <div key={item.rank} className="group">
              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankStyle.bg} ${rankStyle.text} ring-2 ${rankStyle.ring}`}
                >
                  {item.rank}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 shrink-0 tabular-nums">
                      {item.sold.toLocaleString('vi-VN')}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-1.5 w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.rank === 1
                          ? 'bg-yellow-500'
                          : item.rank === 2
                          ? 'bg-gray-400'
                          : item.rank === 3
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(8, item.percent))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Đơn vị: sản phẩm đã bán (30 ngày qua)
        </p>
      </div>
    </div>
  )
}

export default TopProducts