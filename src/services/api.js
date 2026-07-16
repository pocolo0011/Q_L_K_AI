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
// Dashboard API
// ============================================================
export const dashboardApi = {
  // Lấy toàn bộ dữ liệu dashboard từ database thực
  getDashboard: () => request('/dashboard'),
}

export default { dashboardApi }