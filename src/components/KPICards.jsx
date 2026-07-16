import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react'

// ============================================================
// Format số kiểu Việt Nam: 1234567 → "1.234.567"
// Hỗ trợ cả số và chuỗi đã có định dạng (giữ nguyên nếu là tiền tệ)
// ============================================================
const formatNumber = (value) => {
  if (value === null || value === undefined) return '0'

  // Nếu là chuỗi có sẵn ký tự đặc biệt (₫, %, v.v.) → giữ nguyên
  if (typeof value === 'string') {
    if (/[₫%$]/.test(value)) return value
    // Nếu chuỗi chỉ chứa số → format
    const num = Number(value.replace(/[^\d.-]/g, ''))
    if (!isNaN(num)) return num.toLocaleString('vi-VN')
    return value
  }

  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN')
  }

  return String(value)
}

// ============================================================
// Data mặc định (fallback khi không truyền props)
// ============================================================
const DEFAULT_DATA = {
  totalProducts:  { value: 12847,  change: '+12.5%', trend: 'up',   sub: 'so với tháng trước' },
  todayOrders:    { value: 1234,   change: '+8.2%',  trend: 'up',   sub: 'so với hôm qua' },
  monthlyRevenue: { value: 2400000000, change: '+23.1%', trend: 'up', sub: 'so với tháng trước' },
  alerts:         { value: 23,     change: '-5.3%',  trend: 'down', sub: 'cần xử lý ngay' },
}

function KPICards({ data: propData }) {
  const data = propData || DEFAULT_DATA

  const kpiData = [
    {
      title: 'Tổng sản phẩm',
      value: data.totalProducts?.value ?? DEFAULT_DATA.totalProducts.value,
      change: data.totalProducts?.change ?? DEFAULT_DATA.totalProducts.change,
      trend: data.totalProducts?.trend ?? DEFAULT_DATA.totalProducts.trend,
      sub: data.totalProducts?.sub ?? DEFAULT_DATA.totalProducts.sub,
      icon: Package,
      color: 'bg-blue-500',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Đơn hàng hôm nay',
      value: data.todayOrders?.value ?? DEFAULT_DATA.todayOrders.value,
      change: data.todayOrders?.change ?? DEFAULT_DATA.todayOrders.change,
      trend: data.todayOrders?.trend ?? DEFAULT_DATA.todayOrders.trend,
      sub: data.todayOrders?.sub ?? DEFAULT_DATA.todayOrders.sub,
      icon: ShoppingCart,
      color: 'bg-green-500',
      iconBg: 'bg-green-50 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Doanh thu tháng',
      value: data.monthlyRevenue?.value ?? DEFAULT_DATA.monthlyRevenue.value,
      change: data.monthlyRevenue?.change ?? DEFAULT_DATA.monthlyRevenue.change,
      trend: data.monthlyRevenue?.trend ?? DEFAULT_DATA.monthlyRevenue.trend,
      sub: data.monthlyRevenue?.sub ?? DEFAULT_DATA.monthlyRevenue.sub,
      icon: TrendingUp,
      color: 'bg-purple-500',
      iconBg: 'bg-purple-50 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Cảnh báo tồn kho',
      value: data.alerts?.value ?? DEFAULT_DATA.alerts.value,
      change: data.alerts?.change ?? DEFAULT_DATA.alerts.change,
      trend: data.alerts?.trend ?? DEFAULT_DATA.alerts.trend,
      sub: data.alerts?.sub ?? DEFAULT_DATA.alerts.sub,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      iconBg: 'bg-orange-50 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon
        const isUp = kpi.trend === 'up'

        return (
          <div
            key={index}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">
                  {kpi.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 tabular-nums">
                  {formatNumber(kpi.value)}
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-0.5 text-sm font-semibold ${
                      isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isUp ? '▲' : '▼'} {kpi.change}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{kpi.sub}</span>
                </div>
              </div>

              {/* Right: Icon */}
              <div className={`${kpi.iconBg} ${kpi.iconColor} p-3 rounded-xl shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KPICards