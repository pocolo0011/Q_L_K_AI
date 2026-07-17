import { useState, useEffect } from 'react'
import { 
  Download, FileSpreadsheet, FileText, Filter,
  Package, TrendingUp, TrendingDown, AlertTriangle,
  Calendar, Warehouse, BarChart3, Loader2
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { warehouseApi } from '../services/api'

function Reports() {
  const [reportType, setReportType] = useState('inventory')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [timeRange, setTimeRange] = useState('30days')
  const [loading, setLoading] = useState(false)
  const [warehouses, setWarehouses] = useState([])
  
  // Data states
  const [inventoryData, setInventoryData] = useState([])
  const [inOutData, setInOutData] = useState([])
  const [topSellingData, setTopSellingData] = useState([])
  const [slowMovingData, setSlowMovingData] = useState([])
  const [expiryData, setExpiryData] = useState([])
  const [valueData, setValueData] = useState([])

  const reportTypes = [
    { id: 'inventory', label: 'Tồn kho tổng hợp', icon: Package },
    { id: 'inout', label: 'Nhập - Xuất', icon: TrendingUp },
    { id: 'topselling', label: 'Sản phẩm bán chạy', icon: BarChart3 },
    { id: 'slowmoving', label: 'Chậm luân chuyển', icon: TrendingDown },
    { id: 'value', label: 'Giá trị tồn kho', icon: Package },
    { id: 'expiry', label: 'Hết hạn', icon: AlertTriangle },
  ]

  const timeRanges = [
    { id: '7days', label: '7 ngày' },
    { id: '30days', label: '30 ngày' },
    { id: 'quarter', label: 'Quý' },
    { id: 'year', label: 'Năm' },
  ]

  useEffect(() => {
    loadWarehouses()
  }, [])

  useEffect(() => {
    loadReportData()
  }, [reportType, selectedWarehouse, timeRange])

  const loadWarehouses = async () => {
    try {
      const data = await warehouseApi.getWarehouses()
      setWarehouses([
        { id: 'all', name: 'Tất cả kho' },
        ...data.map(wh => ({ id: wh.id, name: wh.name }))
      ])
    } catch (error) {
      console.error('Error loading warehouses:', error)
    }
  }

  const loadReportData = async () => {
    setLoading(true)
    try {
      switch (reportType) {
        case 'inventory':
          await loadInventoryReport()
          break
        case 'inout':
          await loadInOutReport()
          break
        case 'topselling':
          await loadTopSellingReport()
          break
        case 'slowmoving':
          await loadSlowMovingReport()
          break
        case 'expiry':
          await loadExpiryReport()
          break
        case 'value':
          await loadValueReport()
          break
      }
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadInventoryReport = async () => {
    const params = {
      warehouseId: selectedWarehouse,
      timeRange: timeRange
    }
    const response = await fetch(`http://localhost:3001/api/reports/inventory?${new URLSearchParams(params)}`)
    const data = await response.json()
    setInventoryData(data.categories || [])
  }

  const loadInOutReport = async () => {
    const params = {
      warehouseId: selectedWarehouse,
      timeRange: timeRange
    }
    const response = await fetch(`http://localhost:3001/api/reports/inout?${new URLSearchParams(params)}`)
    const data = await response.json()
    setInOutData(data.data || [])
  }

  const loadTopSellingReport = async () => {
    const params = {
      warehouseId: selectedWarehouse,
      timeRange: timeRange
    }
    const response = await fetch(`http://localhost:3001/api/reports/topselling?${new URLSearchParams(params)}`)
    const data = await response.json()
    setTopSellingData(data.products || [])
  }

  const loadSlowMovingReport = async () => {
    const params = {
      warehouseId: selectedWarehouse
    }
    const response = await fetch(`http://localhost:3001/api/reports/slowmoving?${new URLSearchParams(params)}`)
    const data = await response.json()
    setSlowMovingData(data.products || [])
  }

  const loadExpiryReport = async () => {
    const params = {
      warehouseId: selectedWarehouse
    }
    const response = await fetch(`http://localhost:3001/api/reports/expiry?${new URLSearchParams(params)}`)
    const data = await response.json()
    setExpiryData(data.products || [])
  }

  const loadValueReport = async () => {
    const response = await fetch(`http://localhost:3001/api/reports/value?timeRange=${timeRange}`)
    const data = await response.json()
    setValueData(data.warehouses || [])
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleExportExcel = () => {
    try {
      let dataToExport = []
      let fileName = ''

      switch (reportType) {
        case 'inventory':
          dataToExport = inventoryData.map(item => ({
            'Danh mục': item.name,
            'Số lượng': item.value,
            'Tỷ lệ (%)': item.percentage,
            'Giá trị (VND)': item.valueVND
          }))
          fileName = 'bao-cao-ton-kho'
          break
        case 'topselling':
          dataToExport = topSellingData.map(item => ({
            'Rank': item.rank,
            'Sản phẩm': item.name,
            'Đã bán': item.sold,
            'Doanh thu': item.revenue
          }))
          fileName = 'top-san-pham-ban-chay'
          break
        case 'slowmoving':
          dataToExport = slowMovingData.map(item => ({
            'Sản phẩm': item.name,
            'Tồn kho': item.stock,
            'Đã bán': item.sold,
            'Ngày không bán': item.days
          }))
          fileName = 'san-pham-cham-luan-chuyen'
          break
        case 'expiry':
          dataToExport = expiryData.map(item => ({
            'Sản phẩm': item.product,
            'Lô': item.lot,
            'HSD': item.expiry,
            'Còn lại (ngày)': item.daysLeft,
            'Số lượng': item.quantity
          }))
          fileName = 'san-pham-sap-het-han'
          break
        default:
          alert('Chức năng xuất Excel đang được phát triển cho loại báo cáo này')
          return
      }

      const ws = XLSX.utils.json_to_sheet(dataToExport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo')
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('Error exporting Excel:', error)
      alert('Lỗi khi xuất Excel')
    }
  }

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('report-content')
      if (!element) {
        alert('Không tìm thấy nội dung báo cáo')
        return
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`bao-cao_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Lỗi khi xuất PDF')
    }
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 border-b-2 border-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
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
              <button 
                onClick={loadReportData}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <Filter className="w-4 h-4 inline mr-1" />
                Áp dụng
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div id="report-content" className="space-y-6">
          {/* Inventory Report */}
          {reportType === 'inventory' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tồn kho theo danh mục</h3>
                {inventoryData.length > 0 ? (
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
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          color: '#fff'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">Không có dữ liệu</p>
                )}
              </div>

              <div className="bg-slate-900 dark:bg-slate-900 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Chi tiết tồn kho</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800 border-b border-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Danh mục</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Số lượng</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">Tỷ lệ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {inventoryData.length > 0 ? (
                        inventoryData.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-800">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm font-medium text-white">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-sm text-white">{item.value.toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm text-white">
                                {item.percentage}%
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-gray-400">
                            Không có dữ liệu
                          </td>
                        </tr>
                      )}
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
              {inOutData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={inOutData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="nhap" stroke="#10B981" name="Nhập kho" strokeWidth={2} />
                    <Line type="monotone" dataKey="xuat" stroke="#EF4444" name="Xuất kho" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">Không có dữ liệu</p>
              )}
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
                    {topSellingData.length > 0 ? (
                      topSellingData.map((item, index) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
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
                    {slowMovingData.length > 0 ? (
                      slowMovingData.map((item, index) => (
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
                            <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-lg bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-200">
                              {item.days} ngày
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
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
                    {expiryData.length > 0 ? (
                      expiryData.map((item, index) => (
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
                              item.daysLeft <= 3 ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-200' :
                              item.daysLeft <= 7 ? 'bg-orange-50 text-orange-600 dark:bg-orange-900 dark:text-orange-200' :
                              'bg-yellow-50 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {item.daysLeft} ngày
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm text-gray-900 dark:text-white">{item.quantity}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Value Report */}
          {reportType === 'value' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Giá trị tồn kho theo kho</h3>
              {valueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={valueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        color: '#fff'
                      }}
                      formatter={(value) => [`${value} triệu VND`, 'Giá trị']}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" name="Giá trị (triệu VND)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">Không có dữ liệu</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports