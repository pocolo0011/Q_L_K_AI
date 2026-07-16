import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // ============================================================
  // 1. Khởi tạo theme từ localStorage → System preference → Light
  // ============================================================
  const getInitialTheme = () => {
    // Ưu tiên 1: localStorage đã lưu
    const stored = localStorage.getItem('kho-ai-theme')
    if (stored === 'dark') return true
    if (stored === 'light') return false

    // Ưu tiên 2: System preference (prefers-color-scheme)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true
    }

    // Mặc định: Light mode
    return false
  }

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // ============================================================
  // 2. Áp dụng class "dark" lên <html> và lưu vào localStorage
  // ============================================================
  useEffect(() => {
    const root = document.documentElement

    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('kho-ai-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('kho-ai-theme', 'light')
    }
  }, [isDarkMode])

  // ============================================================
  // 3. Lắng nghe thay đổi system preference (khi đang ở light)
  // ============================================================
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      // Chỉ tự động đổi nếu user chưa từng set manual (không có trong localStorage)
      const stored = localStorage.getItem('kho-ai-theme')
      if (!stored) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // ============================================================
  // 4. Toggle functions (dùng useCallback để tối ưu re-render)
  // ============================================================
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev)
  }, [])

  // ============================================================
  // 5. Set theme trực tiếp (light / dark / system)
  // ============================================================
  const setTheme = useCallback((theme) => {
    if (theme === 'system') {
      localStorage.removeItem('kho-ai-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    } else if (theme === 'dark') {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
    }
  }, [])

  // ============================================================
  // 6. Provider
  // ============================================================
  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isSidebarCollapsed,
        toggleSidebar,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
