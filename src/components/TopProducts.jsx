import { Trophy } from 'lucide-react'

function TopProducts() {
  const topProducts = [
    { rank: 1, name: 'iPhone 15 Pro Max', sales: 234, revenue: '₫1.2B', percentage: 95 },
    { rank: 2, name: 'Samsung Galaxy S24', sales: 189, revenue: '₫850M', percentage: 88 },
    { rank: 3, name: 'MacBook Air M2', sales: 156, revenue: '₫780M', percentage: 82 },
    { rank: 4, name: 'iPad Pro 12.9"', sales: 134, revenue: '₫650M', percentage: 75 },
    { rank: 5, name: 'AirPods Pro 2', sales: 112, revenue: '₫420M', percentage: 68 },
  ]

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    if (rank === 2) return 'bg-gray-100 text-gray-700 border-gray-300'
    if (rank === 3) return 'bg-orange-100 text-orange-700 border-orange-300'
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top 5 sản phẩm bán chạy</h2>
      </div>
      
      <div className="space-y-3">
        {topProducts.map((product) => (
          <div key={product.rank} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${getRankColor(product.rank)}`}>
              {product.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${product.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{product.percentage}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{product.sales}</p>
              <p className="text-xs text-gray-500">đã bán</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopProducts