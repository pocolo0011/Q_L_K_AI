import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function InventoryChart() {
  const data = [
    { date: '01/11', value: 4000 },
    { date: '05/11', value: 3000 },
    { date: '10/11', value: 5000 },
    { date: '15/11', value: 4500 },
    { date: '20/11', value: 6000 },
    { date: '25/11', value: 5500 },
    { date: '30/11', value: 7000 },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Biến động tồn kho 30 ngày</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#007BFF" 
            strokeWidth={3}
            dot={{ fill: '#007BFF', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default InventoryChart