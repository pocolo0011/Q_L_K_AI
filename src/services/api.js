// ============================================================
// KHO AI - API Service
// Centralized fetch helpers for backend communication
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Generic fetch wrapper
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }

  return res.json()
}

// ============================================================
// Products API
// ============================================================
export const productsApi = {
  // Lấy danh sách sản phẩm (hỗ trợ filter + pagination)
  getProducts: (params = {}) => {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.category && params.category !== 'all') query.append('category', params.category)
    if (params.status && params.status !== 'all') query.append('status', params.status)
    if (params.page) query.append('page', params.page)
    if (params.limit) query.append('limit', params.limit)
    
    const qs = query.toString()
    return request(`/products${qs ? `?${qs}` : ''}`)
  },

  // Lấy chi tiết sản phẩm
  getProduct: (id) => request(`/products/${id}`),

  // Tạo sản phẩm mới
  createProduct: (data) => request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Cập nhật sản phẩm
  updateProduct: (id, data) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Xóa sản phẩm
  deleteProduct: (id) => request(`/products/${id}`, {
    method: 'DELETE',
  }),

  // Tìm kiếm sản phẩm với vị trí đầy đủ
  searchProducts: (query) => request(`/products/search?q=${query}`),
}

// ============================================================
// Inventory API
// ============================================================
export const inventoryApi = {
  // Lấy danh sách tồn kho (hỗ trợ filter + pagination)
  getInventories: (params = {}) => {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.warehouse && params.warehouse !== 'all') query.append('warehouse', params.warehouse)
    if (params.category && params.category !== 'all') query.append('category', params.category)
    if (params.status && params.status !== 'all') query.append('status', params.status)
    if (params.page) query.append('page', params.page)
    if (params.limit) query.append('limit', params.limit)
    
    const qs = query.toString()
    return request(`/inventory${qs ? `?${qs}` : ''}`)
  },

  // Lấy chi tiết tồn kho
  getInventory: (id) => request(`/inventory/${id}`),

  // Cập nhật tồn kho
  updateInventory: (id, data) => request(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// ============================================================
// Warehouse APIs
// ============================================================
export const warehouseApi = {
  // Warehouses
  getWarehouses: () => request('/warehouses'),
  getWarehouse: (id) => request(`/warehouses/${id}`),
  createWarehouse: (data) => request('/warehouses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateWarehouse: (id, data) => request(`/warehouses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteWarehouse: (id) => request(`/warehouses/${id}`, {
    method: 'DELETE',
  }),

  // Zones
  getZones: () => request('/zones'),
  getZone: (id) => request(`/zones/${id}`),
  createZone: (data) => request('/zones', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateZone: (id, data) => request(`/zones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteZone: (id) => request(`/zones/${id}`, {
    method: 'DELETE',
  }),

  // Shelves
  getShelves: (params = {}) => {
    const query = new URLSearchParams()
    if (params.zoneId) query.append('zoneId', params.zoneId)
    const qs = query.toString()
    return request(`/shelves${qs ? `?${qs}` : ''}`)
  },
  getShelf: (id) => request(`/shelves/${id}`),
  createShelf: (data) => request('/shelves', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateShelf: (id, data) => request(`/shelves/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteShelf: (id) => request(`/shelves/${id}`, {
    method: 'DELETE',
  }),
  createBinsForShelf: (shelfId, count) => request(`/shelves/${shelfId}/bins`, {
    method: 'POST',
    body: JSON.stringify({ count }),
  }),

  // Bins
  getBins: (params = {}) => {
    const query = new URLSearchParams()
    if (params.shelfId) query.append('shelfId', params.shelfId)
    const qs = query.toString()
    return request(`/bins${qs ? `?${qs}` : ''}`)
  },
  getBin: (id) => request(`/bins/${id}`),
  updateBin: (id, data) => request(`/bins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// ============================================================
// Orders API
// ============================================================
export const ordersApi = {
  // Lấy danh sách đơn hàng (hỗ trợ filter + pagination)
  getOrders: (params = {}) => {
    const query = new URLSearchParams()
    if (params.status && params.status !== 'all') query.append('status', params.status)
    if (params.warehouseId && params.warehouseId !== 'all') query.append('warehouseId', params.warehouseId)
    if (params.dateRange && params.dateRange !== 'all') query.append('dateRange', params.dateRange)
    if (params.search) query.append('search', params.search)
    if (params.page) query.append('page', params.page)
    if (params.limit) query.append('limit', params.limit)
    
    const qs = query.toString()
    return request(`/orders${qs ? `?${qs}` : ''}`)
  },

  // Lấy chi tiết đơn hàng
  getOrder: (id) => request(`/orders/${id}`),

  // Tạo đơn hàng mới
  createOrder: (data) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Cập nhật đơn hàng
  updateOrder: (id, data) => request(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Xóa đơn hàng
  deleteOrder: (id) => request(`/orders/${id}`, {
    method: 'DELETE',
  }),

  // Lấy danh sách sản phẩm cho tạo đơn (với thông tin tồn kho)
  getProductsForOrder: (params = {}) => {
    const query = new URLSearchParams()
    if (params.warehouseId && params.warehouseId !== 'all') query.append('warehouseId', params.warehouseId)
    if (params.search) query.append('search', params.search)
    
    const qs = query.toString()
    return request(`/products/for-order${qs ? `?${qs}` : ''}`)
  },
}

// ============================================================
// Employees API
// ============================================================
export const employeesApi = {
  // Lấy danh sách nhân viên (hỗ trợ filter + pagination)
  getEmployees: (params = {}) => {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.role && params.role !== 'all') query.append('role', params.role)
    if (params.warehouseId && params.warehouseId !== 'all') query.append('warehouseId', params.warehouseId)
    if (params.status && params.status !== 'all') query.append('status', params.status)
    if (params.page) query.append('page', params.page)
    if (params.limit) query.append('limit', params.limit)
    
    const qs = query.toString()
    return request(`/employees${qs ? `?${qs}` : ''}`)
  },

  // Lấy chi tiết nhân viên
  getEmployee: (id) => request(`/employees/${id}`),

  // Tạo nhân viên mới
  createEmployee: (data) => request('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Cập nhật nhân viên
  updateEmployee: (id, data) => request(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Xóa nhân viên
  deleteEmployee: (id) => request(`/employees/${id}`, {
    method: 'DELETE',
  }),

  // Reset mật khẩu nhân viên
  resetPassword: (id, newPassword) => request(`/employees/${id}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify({ newPassword }),
  }),
}

// ============================================================
// Dashboard API
// ============================================================
export const dashboardApi = {
  // Lấy toàn bộ dữ liệu dashboard từ database thực
  getDashboard: () => request('/dashboard'),
}

export default { dashboardApi, productsApi, inventoryApi, warehouseApi, ordersApi, employeesApi }
