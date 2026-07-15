import { AlertTriangle, Clock } from 'lucide-react'

function ExpiringProducts() {
  const expiringProducts = [
    { id: 1, name: 'Sữa tươi Vinamilk', batch: 'VL2024001', expiryDate: '20/11/2024', daysLeft: 3, quantity: 50 },
    { id: 2, name: 'Bánh mì sandwich', batch: 'BM2024023', expiryDate: '21/11/2024', daysLeft: 4, quantity: 30 },
    { id: 3, name: 'Rau cải xanh', batch: 'RC2024015', expiryDate: '22/11/2024', daysLeft: 5, quantity: 25 },
    { id: 4, name: 'Cá hồi Na Uy', batch: 'CN2024008', expiryDate: '23/11/2024', daysLeft: 6, quantity: 15 },
    { id: 5, name: 'Phô mai con bò cười', batch: 'PM2024032', expiryDate: '24/11/2024', daysLeft: 7, quantity: 40 },
    { id: 6, name: 'Trứng gà ta', batch: 'TG2024019', expiryDate: '25/11/2024', daysLeft: 8, quantity: 100 },
  ]

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 3) return 'text-red-600 bg-red-50'
    if (daysLeft <= 5) return 'text-orange-600 bg-orange-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sản phẩm sắp hết hạn</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Sản phẩm</th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Lô</th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 dark:text-gray-300">HSD</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-gray-600 dark:text-gray-300">Còn lại</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-gray-600 dark:text-gray-300">SL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {expiringProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                </td>
                <td className="py-3 px-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{product.batch}</p>
                </td>
                <td className="py-3 px-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{product.expiryDate}</p>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(product.daysLeft)}`}>
                    <Clock className="w-3 h-3" />
                    {product.daysLeft} ngày
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.quantity}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExpiringProducts