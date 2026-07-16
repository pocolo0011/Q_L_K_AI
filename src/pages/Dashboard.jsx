import { useState, useEffect } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import Header from '../components/Header'
import KPICards from '../components/KPICards'
import InventoryChart from '../components/InventoryChart'
import TopProducts from '../components/TopProducts'
import ExpiringProducts from '../components/ExpiringProducts'
import LowInventory from '../components/LowInventory'
import { dashboardApi } from '../services/api'

function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await dashboardApi.getDashboard()
      setData(result)
    } catch (err) {
      console.error('Lỗi tải dashboard:', err)
      setError(err.message || 'Không thể tải dữ liệu từ server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pt-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Title + Refresh */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tổng quan hoạt động kho (dữ liệu thực)
              </p>
            </div>
            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Không thể kết nối đến server</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
              <button
                onClick={fetchDashboard}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !data && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              </div>
            </div>
          )}

          {/* Data loaded */}
          {data && (
            <>
              <KPICards data={data.kpis} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <InventoryChart data={data.inventoryChart} />
                </div>
                <div>
                  <TopProducts data={data.topProducts} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpiringProducts data={data.expiringProducts} />
                <LowInventory data={data.lowInventory} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard