import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import InventoryManagement from './pages/InventoryManagement'
import CreateStockIn from './pages/CreateStockIn'
import CreateStockOut from './pages/CreateStockOut'
import InventoryCheck from './pages/InventoryCheck'
import BinLocation from './pages/BinLocation'
import Warehouses from './pages/Warehouses'
import Reports from './pages/Reports'
import ProductDetail from './pages/ProductDetail'
import OrderDetail from './pages/OrderDetail'
import Orders from './pages/Orders'
import Suppliers from './pages/Suppliers'
import Employees from './pages/Employees'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Notifications from './pages/Notifications'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden ml-64">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:code" element={<ProductDetail />} />
                  <Route path="/inventory" element={<InventoryManagement />} />
                  <Route path="/inventory/create" element={<CreateStockIn />} />
                  <Route path="/inventory/out/create" element={<CreateStockOut />} />
                  <Route path="/inventory/check" element={<InventoryCheck />} />
                  <Route path="/bin-location" element={<BinLocation />} />
                  <Route path="/warehouses" element={<Warehouses />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/notifications" element={<Notifications />} />
                </Routes>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App