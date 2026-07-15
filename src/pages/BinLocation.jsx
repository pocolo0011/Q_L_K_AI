import { useState } from 'react'
import { 
  ChevronRight, ChevronDown, Package, MapPin, Printer, 
  Box, Sparkles, Maximize2, GripVertical 
} from 'lucide-react'

function BinLocation() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [viewMode, setViewMode] = useState('2d')

  // Tree structure data
  const warehouseData = {
    id: 'wh1',
    name: 'Kho Hà Nội',
    rows: [
      {
        id: 'row1',
        name: 'Dãy A',
        shelves: [
          {
            id: 'shelf1',
            name: 'Kệ A-01',
            bins: [
              { id: 'bin1', code: 'A-01-01', product: 'SP001', name: 'iPhone 15', quantity: 45, capacity: 50, status: 'full' },
              { id: 'bin2', code: 'A-01-02', product: 'SP002', name: 'Samsung S24', quantity: 20, capacity: 50, status: 'in-use' },
              { id: 'bin3', code: 'A-01-03', product: null, name: null, quantity: 0, capacity: 50, status: 'empty' },
              { id: 'bin4', code: 'A-01-04', product: 'SP003', name: 'MacBook Air', quantity: 48, capacity: 50, status: 'full' },
            ]
          },
          {
            id: 'shelf2',
            name: 'Kệ A-02',
            bins: [
              { id: 'bin5', code: 'A-02-01', product: 'SP004', name: 'iPad Pro', quantity: 15, capacity: 50, status: 'in-use' },
              { id: 'bin6', code: 'A-02-02', product: null, name: null, quantity: 0, capacity: 50, status: 'empty' },
              { id: 'bin7', code: 'A-02-03', product: 'SP005', name: 'AirPods', quantity: 30, capacity: 50, status: 'in-use' },
              { id: 'bin8', code: 'A-02-04', product: null, name: null, quantity: 0, capacity: 50, status: 'empty' },
            ]
          }
        ]
      },
      {
        id: 'row2',
        name: 'Dãy B',
        shelves: [
          {
            id: 'shelf3',
            name: 'Kệ B-01',
            bins: [
              { id: 'bin9', code: 'B-01-01', product: 'SP006', name: 'Apple Watch', quantity: 50, capacity: 50, status: 'full' },
              { id: 'bin10', code: 'B-01-02', product: 'SP007', name: 'Magic Keyboard', quantity: 25, capacity: 50, status: 'in-use' },
              { id: 'bin11', code: 'B-01-03', product: null, name: null, quantity: 0, capacity: 50, status: 'empty' },
              { id: 'bin12', code: 'B-01-04', product: null, name: null, quantity: 0, capacity: 50, status: 'empty' },
            ]
          }
        ]
      }
    ]
  }

  const [expandedNodes, setExpandedNodes] = useState({
    warehouse: true,
    row1: true,
    row2: false,
    shelf1: false,
    shelf2: false,
    shelf3: false
  })

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }))
  }

  const getBinColor = (status) => {
    switch (status) {
      case 'empty':
        return 'bg-green-100 border-green-300 hover:bg-green-200'
      case 'in-use':
        return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
      case 'full':
        return 'bg-red-100 border-red-300 hover:bg-red-200'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  const getProgressColor = (status) => {
    switch (status) {
      case 'empty':
        return 'bg-green-500'
      case 'in-use':
        return 'bg-yellow-500'
      case 'full':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleDragStart = (e, binId) => {
    e.dataTransfer.setData('binId', binId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetBinId) => {
    e.preventDefault()
    const sourceBinId = e.dataTransfer.getData('binId')
    // Here you would implement the actual drag & drop logic
    console.log(`Move from ${sourceBinId} to ${targetBinId}`)
    alert(`Di chuyển sản phẩm từ ${sourceBinId} đến ${targetBinId}`)
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Vị trí Lưu trữ</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quản lý và theo dõi vị trí lưu trữ sản phẩm</p>
          </div>
          
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Gợi ý vị trí tối ưu bằng AI</span>
            </button>
            <button 
              onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="font-medium">{viewMode === '2d' ? 'Chuyển sang 3D' : 'Chuyển sang 2D'}</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Printer className="w-4 h-4" />
              <span className="font-medium">In nhãn kệ</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Tree View (30%) */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cấu trúc kho</h2>
            
            <div className="space-y-1">
              {/* Warehouse */}
              <div className="border border-gray-200 rounded-lg p-3 bg-blue-50">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleNode('warehouse')}
                >
                  {expandedNodes.warehouse ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                  <Warehouse className="w-5 h-5 text-primary" />
                  <span className="font-medium text-gray-900">{warehouseData.name}</span>
                </div>

                {/* Rows */}
                {expandedNodes.warehouse && (
                  <div className="ml-6 mt-2 space-y-1">
                    {warehouseData.rows.map(row => (
                      <div key={row.id} className="border border-gray-200 rounded-lg p-2 bg-white">
                        <div 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => toggleNode(row.id)}
                        >
                          {expandedNodes[row.id] ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                          <Box className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">{row.name}</span>
                        </div>

                        {/* Shelves */}
                        {expandedNodes[row.id] && (
                          <div className="ml-6 mt-1 space-y-1">
                            {row.shelves.map(shelf => (
                              <div key={shelf.id} className="border border-gray-200 rounded p-2 bg-gray-50">
                                <div 
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => toggleNode(shelf.id)}
                                >
                                  {expandedNodes[shelf.id] ? (
                                    <ChevronDown className="w-3 h-3 text-gray-600" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3 text-gray-600" />
                                  )}
                                  <Package className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm text-gray-700">{shelf.name}</span>
                                </div>

                                {/* Bins */}
                                {expandedNodes[shelf.id] && (
                                  <div className="ml-6 mt-1 space-y-1">
                                    {shelf.bins.map(bin => (
                                      <div 
                                        key={bin.id} 
                                        className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 cursor-pointer"
                                      >
                                        <MapPin className="w-3 h-3 text-gray-500" />
                                        <span className="text-xs font-mono text-gray-600">{bin.code}</span>
                                        {bin.product && (
                                          <span className="text-xs text-gray-500 truncate">{bin.name}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Chú thích</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                  <span className="text-xs text-gray-700">Trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                  <span className="text-xs text-gray-700">Đang dùng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                  <span className="text-xs text-gray-700">Đầy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Grid View (70%) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {viewMode === '2d' ? 'View 2D - Kệ A-01' : 'View 3D - Kệ A-01'}
            </h2>
            <p className="text-sm text-gray-600">Kéo thả sản phẩm để di chuyển giữa các ô</p>
          </div>

          {/* 2D Grid */}
          {viewMode === '2d' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {warehouseData.rows[0].shelves[0].bins.map(bin => (
                <div
                  key={bin.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, bin.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, bin.id)}
                  className={`border-2 rounded-lg p-4 cursor-move transition-all hover:shadow-lg ${getBinColor(bin.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-mono font-semibold text-gray-700">{bin.code}</span>
                    </div>
                  </div>

                  {bin.product ? (
                    <>
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-900 truncate">{bin.product}</p>
                        <p className="text-xs text-gray-600 truncate">{bin.name}</p>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Số lượng:</span>
                          <span className="text-sm font-bold text-gray-900">{bin.quantity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getProgressColor(bin.status)}`}
                            style={{ width: `${(bin.quantity / bin.capacity) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{Math.round((bin.quantity / bin.capacity) * 100)}%</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Trống</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 3D View Placeholder */}
          {viewMode === '3d' && (
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Maximize2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">View 3D</h3>
                <p className="text-sm text-gray-500">Tính năng đang được phát triển</p>
                <p className="text-xs text-gray-400 mt-2">Sẽ tích hợp Three.js hoặc React Three Fiber</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Warehouse icon component
function Warehouse({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

export default BinLocation