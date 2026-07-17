import { useState, useEffect } from 'react'
import { 
  ChevronRight, ChevronDown, Package, MapPin, Printer, 
  Box, Sparkles, Maximize2, GripVertical, Plus, X,
  AlertCircle, CheckCircle, Warehouse, Search
} from 'lucide-react'
import { warehouseApi, productsApi } from '../services/api'

function BinLocation() {
  const [warehouses, setWarehouses] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [bins, setBins] = useState([])
  const [activeLevel, setActiveLevel] = useState('warehouse') // 'warehouse' | 'zone' | 'shelf'
  const [viewMode, setViewMode] = useState('2d')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalMode, setModalMode] = useState('zone') // 'zone', 'shelf', or 'warehouse'
  const [toast, setToast] = useState(null)
  const [highlightedBin, setHighlightedBin] = useState(null)
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Form states
  const [warehouseForm, setWarehouseForm] = useState({ code: '', name: '', address: '', capacity: 1000 })
  const [zoneForm, setZoneForm] = useState({ code: '', name: '', description: '' })
  const [shelfForm, setShelfForm] = useState({ zoneId: '', code: '', name: '', capacity: 10 })

  // Tree view expansion state
  const [expandedNodes, setExpandedNodes] = useState({})

  // Load warehouses on mount
  useEffect(() => {
    loadWarehouses()
    loadProducts()
  }, [])

  const loadWarehouses = async () => {
    try {
      const data = await warehouseApi.getWarehouses()
      setWarehouses(data)
      
      // Auto-expand first warehouse if exists
      if (data && data.length > 0) {
        setExpandedNodes(prev => ({ ...prev, [data[0].id]: true }))
        setSelectedWarehouse(data[0])
      }
    } catch (error) {
      console.error('Error loading warehouses:', error)
      showToast('Lỗi khi tải danh sách kho: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const data = await productsApi.getProducts({ limit: 100 })
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadZones = async (warehouseId) => {
    try {
      const data = await warehouseApi.getZones()
      const filtered = data.filter(z => z.warehouseId === warehouseId)
      return filtered
    } catch (error) {
      console.error('Error loading zones:', error)
      showToast('Lỗi khi tải danh sách dãy', 'error')
      return []
    }
  }

  const loadBins = async (shelfId) => {
    try {
      const data = await warehouseApi.getBins({ shelfId })
      setBins(data)
    } catch (error) {
      console.error('Error loading bins:', error)
      showToast('Lỗi khi tải danh sách ô lưu trữ', 'error')
    }
  }

  const handleWarehouseClick = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setSelectedZone(null)
    setSelectedShelf(null)
    setBins([])
    setActiveLevel('warehouse')
  }

  const handleZoneClick = (zone) => {
    setSelectedZone(zone)
    setSelectedShelf(null)
    setBins([])
    setActiveLevel('zone')
  }

  const handleShelfClick = async (shelf) => {
    setSelectedShelf(shelf)
    setActiveLevel('shelf')
    await loadBins(shelf.id)
  }

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }))
  }

  const getBinStatus = (bin) => {
    if (!bin.productId || bin.soLuong === 0) {
      return 'empty'
    }
    
    const percentage = (bin.soLuong / bin.capacity) * 100
    if (percentage >= 90) {
      return 'full'
    }
    return 'in-use'
  }

  const getBinBorderColor = (bin) => {
    const status = getBinStatus(bin)
    switch (status) {
      case 'empty':
        return 'border-emerald-500/30'
      case 'full':
        return 'border-rose-500'
      default:
        return 'border-amber-500/40'
    }
  }

  const getProgressColor = (bin) => {
    const status = getBinStatus(bin)
    switch (status) {
      case 'empty':
        return 'bg-emerald-500'
      case 'full':
        return 'bg-rose-500'
      default:
        return 'bg-amber-500'
    }
  }

  const getStatusBadge = (bin) => {
    const status = getBinStatus(bin)
    switch (status) {
      case 'empty':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Trống
          </span>
        )
      case 'full':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Đầy
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Đang dùng
          </span>
        )
    }
  }

  const handleDragStart = (e, binId) => {
    e.dataTransfer.setData('binId', binId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, targetBinId) => {
    e.preventDefault()
    const sourceBinId = e.dataTransfer.getData('binId')
    
    if (sourceBinId === targetBinId) return

    try {
      const sourceBin = bins.find(b => b.id === sourceBinId)
      if (!sourceBin || !sourceBin.productId) {
        showToast('Ô nguồn không có sản phẩm để di chuyển', 'error')
        return
      }

      const targetBin = bins.find(b => b.id === targetBinId)
      if (!targetBin) return

      if (targetBin.productId && targetBin.soLuong > 0) {
        showToast('Ô đích đã có sản phẩm', 'error')
        return
      }

      await warehouseApi.updateBin(sourceBinId, {
        productId: null,
        soLuong: 0,
        status: 'EMPTY'
      })

      await warehouseApi.updateBin(targetBinId, {
        productId: sourceBin.productId,
        soLuong: sourceBin.soLuong,
        status: sourceBin.soLuong >= targetBin.capacity ? 'FULL' : 'IN_USE'
      })

      if (selectedShelf) {
        await loadBins(selectedShelf.id)
      }
      await loadWarehouses()

      showToast(`Di chuyển sản phẩm từ ${sourceBin.code} đến ${targetBin.code} thành công`, 'success')
    } catch (error) {
      console.error('Error moving product:', error)
      showToast('Lỗi khi di chuyển sản phẩm: ' + error.message, 'error')
    }
  }

  const handleAddWarehouse = async () => {
    try {
      await warehouseApi.createWarehouse(warehouseForm)
      showToast('Thêm kho mới thành công', 'success')
      setShowAddModal(false)
      setWarehouseForm({ code: '', name: '', address: '', capacity: 1000 })
      loadWarehouses()
    } catch (error) {
      console.error('Error creating warehouse:', error)
      showToast('Lỗi khi thêm kho: ' + error.message, 'error')
    }
  }

  const handleAddZone = async () => {
    try {
      if (!selectedWarehouse) {
        showToast('Vui lòng chọn kho trước', 'error')
        return
      }
      
      await warehouseApi.createZone({
        ...zoneForm,
        warehouseId: selectedWarehouse.id
      })
      showToast('Thêm dãy mới thành công', 'success')
      setShowAddModal(false)
      setZoneForm({ code: '', name: '', description: '' })
      loadWarehouses()
    } catch (error) {
      console.error('Error creating zone:', error)
      showToast('Lỗi khi thêm dãy: ' + error.message, 'error')
    }
  }

  const handleAddShelf = async () => {
    try {
      const shelf = await warehouseApi.createShelf(shelfForm)
      
      await warehouseApi.createBinsForShelf(shelf.id, shelfForm.capacity)
      
      showToast(`Thêm kệ ${shelf.name} với ${shelfForm.capacity} ô lưu trữ thành công`, 'success')
      setShowAddModal(false)
      setShelfForm({ zoneId: '', code: '', name: '', capacity: 10 })
      loadWarehouses()
    } catch (error) {
      console.error('Error creating shelf:', error)
      showToast('Lỗi khi thêm kệ: ' + error.message, 'error')
    }
  }

  const handleAISuggestion = async () => {
    try {
      const emptyBins = bins.filter(b => !b.productId || b.soLuong === 0)
      
      if (emptyBins.length === 0) {
        showToast('Không có ô trống nào để gợi ý', 'error')
        return
      }

      const suggestedBin = emptyBins[0]
      setHighlightedBin(suggestedBin.id)
      
      showToast(`Gợi ý: Ô ${suggestedBin.code} là vị trí phù hợp`, 'success')
      
      setTimeout(() => {
        setHighlightedBin(null)
      }, 3000)
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
      showToast('Lỗi khi gợi ý vị trí', 'error')
    }
  }

  const handlePrintLabel = () => {
    if (!selectedShelf || bins.length === 0) {
      showToast('Vui lòng chọn kệ để in nhãn', 'error')
      return
    }

    const printContent = `
      <html>
        <head>
          <title>In nhãn kệ ${selectedShelf.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .bin-label { 
              border: 2px solid #000; 
              padding: 10px; 
              margin: 10px; 
              display: inline-block;
              text-align: center;
            }
            .bin-code { font-size: 18px; font-weight: bold; }
            .bin-info { font-size: 12px; margin-top: 5px; }
            @media print {
              .bin-label { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Nhãn kệ ${selectedShelf.name}</h1>
          <p>Mã kệ: ${selectedShelf.code}</p>
          <hr/>
          ${bins.map(bin => `
            <div class="bin-label">
              <div class="bin-code">${bin.code}</div>
              <div class="bin-info">
                ${bin.productId ? `Sản phẩm: ${bin.productId}` : 'Trống'}
                <br/>
                Dung tích: ${bin.capacity}
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const handleGlobalSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      const data = await productsApi.searchProducts(searchQuery)
      setSearchResults(data.products || [])
      setShowSearchResults(true)
    } catch (error) {
      console.error('Error searching products:', error)
      showToast('Lỗi khi tìm kiếm sản phẩm', 'error')
    }
  }

  const handleSearchResultClick = async (product) => {
    if (!product.locations || product.locations.length === 0) {
      showToast('Sản phẩm này không có trong kho', 'error')
      return
    }

    // Lấy vị trí đầu tiên
    const location = product.locations[0]
    
    // Tìm warehouse
    const warehouse = warehouses.find(w => w.code === location.warehouseCode)
    if (warehouse) {
      setSelectedWarehouse(warehouse)
      setExpandedNodes(prev => ({ ...prev, [warehouse.id]: true }))
      
      // Tìm zone
      const zone = warehouse.zones?.find(z => z.code === location.zoneCode)
      if (zone) {
        setSelectedZone(zone)
        setExpandedNodes(prev => ({ ...prev, [zone.id]: true }))
        
        // Tìm shelf
        const shelf = zone.shelves?.find(s => s.code === location.shelfCode)
        if (shelf) {
          await handleShelfClick(shelf)
          setExpandedNodes(prev => ({ ...prev, [shelf.id]: true }))
          
          // Highlight bin
          setTimeout(() => {
            setHighlightedBin(location.binId)
            setTimeout(() => setHighlightedBin(null), 3000)
          }, 500)
        }
      }
    }

    setShowSearchResults(false)
    setSearchQuery('')
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b-4 border-blue-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Quản lý Vị trí Lưu trữ</h1>
            <p className="text-sm text-blue-100 mt-1 font-medium">Quản lý và theo dõi vị trí lưu trữ sản phẩm</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleAISuggestion}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              <span>Gợi ý vị trí tối ưu bằng AI</span>
            </button>
            <button 
              onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              <Maximize2 className="w-5 h-5" />
              <span>{viewMode === '2d' ? 'Chuyển sang 3D' : 'Chuyển sang 2D'}</span>
            </button>
            <button 
              onClick={handlePrintLabel}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              <Printer className="w-5 h-5 text-gray-800" />
              <span className="text-gray-900">In nhãn kệ</span>
            </button>
          </div>
        </div>

        {/* Global Search */}
        <form onSubmit={handleGlobalSearch} className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm vị trí hàng hóa toàn hệ thống..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </form>

        {/* Search Results */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Kết quả tìm kiếm</h3>
              <button onClick={() => setShowSearchResults(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {searchResults.map(product => (
                <div key={product.id} className="p-3 hover:bg-gray-50">
                  <div className="font-medium text-gray-900">{product.nameVi}</div>
                  <div className="text-sm text-gray-600">Mã: {product.code}</div>
                  {product.locations && product.locations.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {product.locations.map((loc, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleSearchResultClick(product)}
                          className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          📍 [{loc.warehouse}] - {loc.zone} - {loc.shelf} - Ô {loc.bin} (SL: {loc.quantity})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Tree View (30%) */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Cấu trúc kho</h2>
              <button
                onClick={() => {
                  setModalMode('warehouse')
                  setShowAddModal(true)
                }}
                className="p-1.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="Thêm kho/dãy/kệ"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {warehouses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Warehouse className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có kho nào</p>
                <p className="text-xs mt-1">Nhấn + để thêm kho mới</p>
              </div>
            ) : (
              <div className="space-y-2">
                {warehouses.map(warehouse => (
                  <div key={warehouse.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Warehouse */}
                    <div 
                      className={`p-3 cursor-pointer transition-all ${
                        selectedWarehouse?.id === warehouse.id 
                          ? 'bg-indigo-600/20 border-l-4 border-indigo-500' 
                          : 'bg-slate-800/60 hover:bg-slate-700/60 border-l-4 border-transparent'
                      }`}
                    >
                      <div 
                        className="flex items-center gap-2"
                        onClick={() => {
                          toggleNode(warehouse.id)
                          handleWarehouseClick(warehouse)
                        }}
                      >
                        {expandedNodes[warehouse.id] ? (
                          <ChevronDown className={`w-4 h-4 ${selectedWarehouse?.id === warehouse.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${selectedWarehouse?.id === warehouse.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                        )}
                        <Warehouse className={`w-5 h-5 ${selectedWarehouse?.id === warehouse.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                        <span className={`font-medium flex-1 ${selectedWarehouse?.id === warehouse.id ? 'text-white font-semibold' : 'text-gray-300'}`}>
                          {warehouse.name}
                        </span>
                        <span className={`text-xs ${selectedWarehouse?.id === warehouse.id ? 'text-indigo-300' : 'text-gray-500'}`}>
                          {warehouse.zones?.length || 0}
                        </span>
                      </div>
                    </div>

                              {/* Zones */}
                              {expandedNodes[warehouse.id] && (
                                <div className="ml-4 border-l-2 border-gray-700 pl-2">
                                  {warehouse.zones && warehouse.zones.length > 0 ? (
                                    warehouse.zones.map(zone => (
                                      <div key={zone.id} className="mb-1">
                                        <div 
                                          className={`p-2 rounded cursor-pointer transition-all ${
                                            selectedZone?.id === zone.id 
                                              ? 'bg-indigo-600/20 border-l-2 border-indigo-500' 
                                              : 'hover:bg-slate-700/50 border-l-2 border-transparent'
                                          }`}
                                          onClick={() => {
                                            toggleNode(zone.id)
                                            handleZoneClick(zone)
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            {expandedNodes[zone.id] ? (
                                              <ChevronDown className={`w-3 h-3 ${selectedZone?.id === zone.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                                            ) : (
                                              <ChevronRight className={`w-3 h-3 ${selectedZone?.id === zone.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                                            )}
                                            <Box className={`w-4 h-4 ${selectedZone?.id === zone.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                                            <span className={`text-sm flex-1 ${selectedZone?.id === zone.id ? 'text-white font-medium' : 'text-gray-300'}`}>
                                              {zone.name}
                                            </span>
                                            <span className={`text-xs ${selectedZone?.id === zone.id ? 'text-indigo-300' : 'text-gray-500'}`}>
                                              {zone.shelves?.length || 0}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Shelves */}
                                        {expandedNodes[zone.id] && (
                                          <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-700 pl-2">
                                            {zone.shelves && zone.shelves.length > 0 ? (
                                              zone.shelves.map(shelf => (
                                                <div 
                                                  key={shelf.id} 
                                                  className={`p-2 rounded cursor-pointer transition-all ${
                                                    selectedShelf?.id === shelf.id 
                                                      ? 'bg-indigo-600/20 border-l-2 border-indigo-500' 
                                                      : 'hover:bg-slate-700/50 border-l-2 border-transparent'
                                                  }`}
                                                  onClick={() => handleShelfClick(shelf)}
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <Package className={`w-4 h-4 ${selectedShelf?.id === shelf.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                                                    <span className={`text-sm flex-1 ${selectedShelf?.id === shelf.id ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                      {shelf.name}
                                                    </span>
                                                    <span className={`text-xs ${selectedShelf?.id === shelf.id ? 'text-indigo-300' : 'text-gray-500'}`}>
                                                      {shelf.bins?.length || 0}
                                                    </span>
                                                  </div>
                                                </div>
                                              ))
                                            ) : (
                                              <p className="text-xs text-gray-500 italic ml-5 mt-1">Chưa có kệ</p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-gray-500 italic ml-2 mt-1">Chưa có dãy</p>
                                  )}
                                </div>
                              )}
                  </div>
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-100 mb-3">Chú thích</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-800 border-2 border-emerald-500/30 rounded"></div>
                  <span className="text-xs text-gray-300">Trống {"<"} 90%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-800 border-2 border-amber-500/40 rounded"></div>
                  <span className="text-xs text-gray-300">Đang dùng {"<"} 90%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-800 border-2 border-rose-500 rounded"></div>
                  <span className="text-xs text-gray-300">Đầy {">="} 90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Dynamic View (70%) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Warehouse Level - Show Zones Overview */}
          {activeLevel === 'warehouse' && selectedWarehouse && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Tổng quan {selectedWarehouse.name} - Danh sách các Dãy
                </h2>
                <p className="text-sm text-gray-600 mt-1">Click vào dãy để xem chi tiết các kệ</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedWarehouse.zones && selectedWarehouse.zones.length > 0 ? (
                  selectedWarehouse.zones.map(zone => {
                    // Calculate zone statistics
                    const totalShelves = zone.shelves?.length || 0
                    const totalBins = zone.shelves?.reduce((sum, shelf) => sum + (shelf.bins?.length || 0), 0) || 0
                    const usedBins = zone.shelves?.reduce((sum, shelf) => {
                      return sum + (shelf.bins?.filter(bin => bin.productId && bin.soLuong > 0).length || 0)
                    }, 0) || 0
                    const fillPercentage = totalBins > 0 ? Math.round((usedBins / totalBins) * 100) : 0

                    return (
                      <div
                        key={zone.id}
                        onClick={() => handleZoneClick(zone)}
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-xl hover:border-primary transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                              <Box className="w-6 h-6 text-primary group-hover:text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                {zone.name}
                              </h3>
                              <p className="text-xs text-gray-500">Mã: {zone.code}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Số kệ:</span>
                            <span className="font-semibold text-gray-900">{totalShelves}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tổng ô:</span>
                            <span className="font-semibold text-gray-900">{totalBins}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Mức độ sử dụng:</span>
                              <span className="text-xs font-bold text-gray-900">{fillPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  fillPercentage >= 90 ? 'bg-red-500' : 
                                  fillPercentage >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${fillPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 text-center group-hover:text-primary transition-colors">
                            Click để xem chi tiết →
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Chưa có dãy nào trong kho này</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Zone Level - Show Shelves Overview */}
          {activeLevel === 'zone' && selectedZone && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Cấu trúc {selectedZone.name} - Danh sách các Kệ
                </h2>
                <p className="text-sm text-gray-600 mt-1">Click vào kệ để xem sơ đồ chi tiết</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedZone.shelves && selectedZone.shelves.length > 0 ? (
                  selectedZone.shelves.map(shelf => {
                    // Calculate shelf statistics
                    const totalBins = shelf.bins?.length || 0
                    const usedBins = shelf.bins?.filter(bin => bin.productId && bin.soLuong > 0).length || 0
                    const fillPercentage = totalBins > 0 ? Math.round((usedBins / totalBins) * 100) : 0

                    return (
                      <div
                        key={shelf.id}
                        onClick={() => handleShelfClick(shelf)}
                        className="bg-gray-800 border-2 border-gray-700 rounded-xl p-5 cursor-pointer hover:shadow-xl hover:border-primary transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-primary transition-colors">
                              <Package className="w-5 h-5 text-gray-300 group-hover:text-white" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                                {shelf.name}
                              </h3>
                              <p className="text-xs text-gray-400">Mã: {shelf.code}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Số ô:</span>
                            <span className="font-semibold text-white">{totalBins}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Đang dùng:</span>
                            <span className="font-semibold text-white">{usedBins}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-400">Tỷ lệ:</span>
                              <span className="text-xs font-bold text-white">{fillPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  fillPercentage >= 90 ? 'bg-rose-500' : 
                                  fillPercentage >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${fillPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-700">
                          <p className="text-xs text-gray-400 text-center group-hover:text-primary transition-colors">
                            Click để xem chi tiết →
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Chưa có kệ nào trong dãy này</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shelf Level - Show Bin Grid */}
          {activeLevel === 'shelf' && selectedShelf && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sơ đồ lưới 2D - {selectedShelf.name}
                </h2>
                <p className="text-sm text-gray-600">Kéo thả sản phẩm để di chuyển giữa các ô</p>
              </div>

              {/* 2D Grid */}
              {viewMode === '2d' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {bins.map(bin => {
                    const percentage = bin.capacity > 0 ? (bin.soLuong / bin.capacity) * 100 : 0
                    const isHighlighted = highlightedBin === bin.id
                    const status = getBinStatus(bin)
                    
                    return (
                      <div
                        key={bin.id}
                        draggable={!!bin.productId}
                        onDragStart={(e) => handleDragStart(e, bin.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, bin.id)}
                        className={`bg-gray-800/80 backdrop-blur-sm border-2 rounded-xl p-4 transition-all hover:shadow-xl hover:scale-105 ${
                          isHighlighted ? 'ring-4 ring-purple-500 shadow-purple-500/50' : ''
                        } ${getBinBorderColor(bin)}`}
                      >
                        {/* Header: Mã ô + Badge trạng thái */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {status === 'in-use' && <GripVertical className="w-4 h-4 text-gray-400" />}
                            <span className="text-sm font-mono font-bold text-white tracking-wide">
                              {bin.code}
                            </span>
                          </div>
                          {getStatusBadge(bin)}
                        </div>

                        {/* Nội dung chính */}
                        {bin.productId ? (
                          <>
                            {/* Icon + Thông tin sản phẩm */}
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Package className="w-4 h-4 text-gray-300" />
                                <p className="text-sm font-semibold text-gray-100 truncate flex-1">
                                  {bin.productId}
                                </p>
                              </div>
                              <p className="text-xs text-gray-400 ml-6">
                                Số lượng: <span className="text-gray-200 font-medium">{bin.soLuong}</span>
                              </p>
                            </div>
                            
                            {/* Progress bar */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-gray-400">Mức độ:</span>
                                <span className="text-xs font-bold text-white">
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden backdrop-blur-sm">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${getProgressColor(bin)}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Ô trống */
                          <div className="text-center py-6">
                            <Package className="w-10 h-10 text-gray-600 mx-auto mb-2 opacity-40" />
                            <p className="text-xs text-gray-500 font-medium">Trống</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
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
            </>
          )}
        </div>
      </div>

      {/* Add Warehouse/Zone/Shelf Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'warehouse' ? 'Thêm Kho mới' : modalMode === 'zone' ? 'Thêm Dãy mới' : 'Thêm Kệ mới'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalMode === 'warehouse' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã Kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={warehouseForm.code}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ví dụ: WH-CT, WH-DN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên Kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={warehouseForm.name}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ví dụ: Kho Cần Thơ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={warehouseForm.address}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ví dụ: Cần Thơ, Việt Nam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sức chứa
                  </label>
                  <input
                    type="number"
                    value={warehouseForm.capacity}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    min="0"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddWarehouse}
                    disabled={!warehouseForm.code || !warehouseForm.name}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Thêm Kho
                  </button>
                </div>
              </div>
            ) : modalMode === 'zone' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã Dãy <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={zoneForm.code}
                    onChange={(e) => setZoneForm({ ...zoneForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ví dụ: A, B, C"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên Dãy <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={zoneForm.name}
                    onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ví dụ: Dãy A, Dãy B"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={zoneForm.description}
                    onChange={(e) => setZoneForm({ ...zoneForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows="3"
                    placeholder="Mô tả về dãy (tùy chọn)"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddZone}
                    disabled={!zoneForm.code || !zoneForm.name}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Thêm Dãy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dãy cha <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={shelfForm.zoneId}
                    onChange={(e) => setShelfForm({ ...shelfForm, zoneId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">-- Chọn Dãy --</option>
                    {selectedWarehouse?.zones?.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã Kệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shelfForm.code}
                    onChange={(e) => setShelfForm({ ...shelfForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ví dụ: A-01, A-02"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên Kệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shelfForm.name}
                    onChange={(e) => setShelfForm({ ...shelfForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ví dụ: Kệ A-01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng Ô mặc định <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={shelfForm.capacity}
                    onChange={(e) => setShelfForm({ ...shelfForm, capacity: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Số ô lưu trữ sẽ được tạo tự động (1-100)</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddShelf}
                    disabled={!shelfForm.zoneId || !shelfForm.code || !shelfForm.name}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Thêm Kệ
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setModalMode('warehouse')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                    modalMode === 'warehouse'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Thêm Kho
                </button>
                <button
                  onClick={() => setModalMode('zone')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                    modalMode === 'zone'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Thêm Dãy
                </button>
                <button
                  onClick={() => setModalMode('shelf')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                    modalMode === 'shelf'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Thêm Kệ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default BinLocation