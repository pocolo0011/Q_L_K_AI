import { AlertCircle, Package } from 'lucide-react'

function LowInventory() {
  const lowInventoryProducts = [
    { id: 1, name: 'iPhone 15 Pro Max', sku: 'IP15PM-256', currentStock: 5, minStock: 20, status: 'critical' },
    { id: 2, name: 'Samsung Galaxy S24', sku: 'SGS24-128', currentStock: 8, minStock: 25, status: 'critical' },
    { id: 3, name: 'MacBook Air M2', sku: 'MBA-M2-13', currentStock: 12, minStock: 15, status: 'warning' },
    { id: 4, name: 'AirPods Pro 2', sku: 'APP2-USB-C', currentStock: 15, minStock: 30, status: 'warning' },
    { id: 5, name: 'iPad Pro 12.9"', sku: 'IPADP-129', currentStock: 7, minStock: 20, status: 'critical' },
    { id: 6, name: 'Apple Watch Ultra', sku: 'AWU-49', currentStock: 10, minStock: 15, status: 'warning' },
    { id: 7, name: 'Magic Keyboard', sku: 'MK-USB-C', currentStock: 18, minStock: 25, status: 'warning' },
  ]

  const getStatusColor = (status) => {
    if (status === 'critical') return 'bg-red-100 text-red-700 border-red-300'
    return 'bg-yellow-100 text-yellow-700 border-yellow-300'
  }

  const getStockPercentage = (current, min) => {
    return Math.min((current / min) * 100, 100)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tồn kho thấp</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Sản phẩm</th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600">SKU</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-gray-600">Tồn kho</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-gray-600">Tối thiểu</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-gray-600">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
                {lowInventoryProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                    </td>
                <td className="py-3 px-2">
                  <p className="text-xs text-gray-600 font-mono">{product.sku}</p>
                </td>
                    <td className="py-3 px-2 text-center">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.currentStock}</p>
                    </td>
                <td className="py-3 px-2 text-center">
                  <p className="text-sm text-gray-600">{product.minStock}</p>
                </td>
                <td className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      <AlertCircle className="w-3 h-3" />
                      {product.status === 'critical' ? 'Nghiêm trọng' : 'Cảnh báo'}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${product.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}
                        style={{ width: `${getStockPercentage(product.currentStock, product.minStock)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LowInventory