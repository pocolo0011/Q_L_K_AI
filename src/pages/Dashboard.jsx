import { useState } from 'react'
import Header from '../components/Header'
import KPICards from '../components/KPICards'
import InventoryChart from '../components/InventoryChart'
import TopProducts from '../components/TopProducts'
import ExpiringProducts from '../components/ExpiringProducts'
import LowInventory from '../components/LowInventory'

function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pt-20">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tổng quan hoạt động kho</p>
          </div>
          
          <KPICards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InventoryChart />
            </div>
            <div>
              <TopProducts />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpiringProducts />
            <LowInventory />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard