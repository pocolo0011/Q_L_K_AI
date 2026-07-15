import { useState } from 'react'
import { 
  Download, FileSpreadsheet, FileText, Filter,
  Package, TrendingUp, TrendingDown, AlertTriangle,
  Calendar, Warehouse, BarChart3
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Reports() {
  const [reportType, setReportType] = useState('inventory')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [timeRange, setTimeRange] = useState('30days')

  const reportTypes = [
    { id: 'inventory', label: 'Tồn kho tổng hợp', icon: Package },
    { id: 'inout', label: 'Nhập - Xuất', icon: TrendingUp },
    { id: 'topselling', label: 'Sản phẩm bán chạy', icon: BarChart3 },
    { id: 'slowmoving', label: 'Chậm luân chuyển', icon: TrendingDown },
    { id: 'value', label: 'Giá trị tồn kho', icon: Package },
    { id: 'expiry', label: 'Hết hạn', icon: AlertTriangle },
  ]

  const warehouses = [
    { id: 'all', name: 'Tất cả kho' },
    { id: 'hanoi', name: 'Kho Hà Nội' },
    { id: 'hcm', name: 'Kho TP.HCM' },
    { id: 'danang', name: 'Kho Đà Nẵng' },
  ]

  const timeRanges = [
    { id: 'today', label: 'Hôm nay' },
    { id: '7days', label: '7 ngày' },
    { id: '30days', label: '30 ngày' },
    { id: 'quarter', label: 'Quý' },
    { id: 'year', label: 'Năm' },
  ]

  // Sample data for different reports
  const inventoryData = [
    { name: 'Điện tử', value: 4500, color: '#007BFF' },
    { name: 'Thực phẩm', value: 3200, color: '#28A745' },
    { name: 'Mỹ phẩm', value: 2100, color: '#FD7E14' },
    { name: 'Khác', value: 1500, color: '#6C757D' },
  ]

  const inOutData = [
    { date: '01/11', nhap: 120, xuat: 80 },
    { date: '05/11', nhap: 150, xuat: 100 },
    { date: '10/11', nhap: 180, xuat: 120 },
    { date: '15/11', nhap: 140, xuat: 90 },
    { date: '20/11', nhap: 160, xuat: 110 },
    { date: '25/11', nhap: 200, xuat: 130 },
    { date: '30/11', nhap: 170, xuat: 105 },
  ]

  const topSellingData = [
    { rank: 1, name: 'iPhone 15 Pro Max', sold: 245, revenue: 6125000000 },
    { rank: 2, name: 'Samsung Galaxy S24', sold: 189, revenue: 4158000000 },
    { rank: 3, name: 'MacBook Air M2', sold: 156, revenue: 4368000000 },
    { rank: 4, name: 'iPad Pro 12.9"', sold: 134, revenue: 4288000000 },
    { rank: 5, name: 'AirPods Pro 2', sold: 312, revenue: 2028000000 },
  ]

  const slowMovingData = [
    { name: 'Sản phẩm A', stock: 50, sold: 2, days: 90 },
    { name: 'Sản phẩm B', stock: 35, sold: 1, days: 75 },
    { name: 'Sản phẩm C', stock: 28, sold: 3, days: 60 },
  ]

  const expiryData = [
    { product: 'Sữa tươi', lot: 'LOT001', expiry: '20/11/2024', daysLeft: 3, quantity: 50 },
    { product: 'Bánh snack', lot: 'LOT002', expiry: '25/11/2024', daysLeft: 8, quantity: 100 },
    { product: 'Nước ngọt', lot: 'LOT003', expiry: '30/11/2024', daysLeft: 13, quantity: 200 },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleExportExcel = () => {
    alert('Đang xuất Excel...')
  }

  const handleExportPDF = () => {
    alert('Đang xuất PDF...')
  }

  const getReportTitle = () => {
    switch (reportType) {
      case 'inventory': return 'Báo cáo tồn kho tổng hợp'
      case 'inout': return 'Báo cáo nhập - xuất'
      case 'topselling': return 'Top sản phẩm bán chạy'
      case 'slowmoving': return 'Sản phẩm chậm luân chuyển'
      case 'value': return 'Báo cáo giá trị tồn kho'
      case 'expiry': return 'Báo cáo sản phẩm sắp hết hạn'
      default: return 'Báo cáo'
    }
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Báo cáo & Thống kê</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getReportTitle()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="font-medium">Excel</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Loại báo cáo
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Warehouse className="w-4 h-4 inline mr-1" />
                Kho
              </label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {warehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Thời gian
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {timeRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                <Filter className="w-4 h-4 inline mr-1" />
                Áp dụng
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {/* Inventory Report */}
          {reportType === 'inventory' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tồn kho theo danh mục</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chi tiết tồn kho</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Danh mục</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Số lượng</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tỷ lệ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {inventoryData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm text-gray-900 dark:text-white">{item.value.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {((item.value / inventoryData.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* In-Out Report */}
          {reportType === 'inout' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Biến động nhập - xuất</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={inOutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="nhap" stroke="#28A745" name="Nhập kho" strokeWidth={2} />
                  <Line type="monotone" dataKey="xuat" stroke="#DC3545" name="Xuất kho" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Selling Products */}
          {reportType === 'topselling' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 sản phẩm bán chạy</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Sản phẩm</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Đã bán</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topSellingData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            item.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                            item.rank === 2 ? 'bg-gray-100 text-gray-700' :
                            item.rank === 3 ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {item.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-900 dark:text-white">{item.sold}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.revenue)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Slow Moving Products */}
          {reportType === 'slowmoving' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sản phẩm chậm luân chuyển</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Sản phẩm</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tồn kho</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Đã bán</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Ngày không bán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {slowMovingData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-900 dark:text-white">{item.stock}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-900 dark:text-white">{item.sold}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-lg bg-red-50 text-red-600">
                            {item.days} ngày
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Expiry Report */}
          {reportType === 'expiry' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sản phẩm sắp hết hạn</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Sản phẩm</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Lô</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">HSD</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Còn lại</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {expiryData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.product}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.lot}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-900 dark:text-white">{item.expiry}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-lg ${
                            item.daysLeft <= 3 ? 'bg-red-50 text-red-600' :
                            item.daysLeft <= 7 ? 'bg-orange-50 text-orange-600' :
                            'bg-yellow-50 text-yellow-600'
                          }`}>
                            {item.daysLeft} ngày
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-900 dark:text-white">{item.quantity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Value Report */}
          {reportType === 'value' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Giá trị tồn kho theo kho</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value * 1000000)} />
                  <Legend />
                  <Bar dataKey="value" fill="#007BFF" name="Giá trị (triệu VND)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports