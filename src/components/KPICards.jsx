import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react'

function KPICards() {
  const kpiData = [
    {
      title: 'Tổng sản phẩm',
      value: '12,847',
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: 'Doanh thu tháng',
      value: '₫2.4B',
      change: '+23.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Cảnh báo tồn kho',
      value: '23',
      change: '-5.3%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{kpi.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{kpi.value}</h3>
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">so với tháng trước</span>
              </div>
            </div>
            <div className={`${kpi.color} p-3 rounded-lg`}>
              <kpi.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default KPICards