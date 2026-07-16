import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useTheme } from '../contexts/ThemeContext'

// ============================================================
// Data mặc định (30 ngày) — fallback khi không truyền props
// ============================================================
const generateDefaultData = () => {
  const data = []
  const today = new Date()
  let base = 8500
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    // Random walk để tạo biến động tự nhiên
    base += Math.round((Math.random() - 0.45) * 400)
    base = Math.max(6000, Math.min(12000, base))
    data.push({
      date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      stock: base,
    })
  }
  return data
}

const DEFAULT_DATA = generateDefaultData()

// ============================================================
// Custom Tooltip (hỗ trợ dark mode)
// ============================================================
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        Tồn kho:{' '}
        <span className="text-[#007BFF]">{payload[0].value.toLocaleString('vi-VN')}</span>
      </p>
    </div>
  )
}

function InventoryChart({ data: propData }) {
  const { isDarkMode } = useTheme()
  const data = propData || DEFAULT_DATA

  // Màu sắc theo theme
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB'
  const axisColor = isDarkMode ? '#9CA3AF' : '#6B7280'
  const lineColor = '#007BFF'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Biến động tồn kho 30 ngày
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Số lượng tồn kho thực tế theo từng ngày
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-[#007BFF]"></span>
          <span className="text-gray-600 dark:text-gray-300">Tồn kho</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

            <XAxis
              dataKey="date"
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              interval="preserveStartEnd"
              minTickGap={24}
            />

            <YAxis
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString('vi-VN')}
              width={60}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />

            <Line
              type="monotone"
              dataKey="stock"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: lineColor, stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default InventoryChart