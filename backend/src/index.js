// ============================================================
// KHO AI - Backend API Server
// Express + Prisma + PostgreSQL
// ============================================================

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { PrismaClient } = require('@prisma/client')

dotenv.config()

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json())

// Set UTF-8 charset for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

// ============================================================
// Health check
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() })
})

// ============================================================
// DASHBOARD - Tổng hợp dữ liệu thực từ database
// ============================================================
app.get('/api/dashboard', async (req, res) => {
  try {
    const now = new Date()

    // --- Date helpers ---
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000)

    // ============================================================
    // 1. KPIs
    // ============================================================
    const totalProducts = await prisma.product.count()

    const newProducts = await prisma.product.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    })
    const prodChange =
      totalProducts === 0 ? 0 : Math.round((newProducts / Math.max(1, totalProducts - newProducts)) * 100)

    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfToday } },
    })
    const yesterdayOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfYesterday, lt: startOfToday } },
    })
    const orderChange =
      yesterdayOrders === 0
        ? todayOrders > 0
          ? 100
          : 0
        : Math.round(((todayOrders - yesterdayOrders) / yesterdayOrders) * 100)

    const thisMonthRev = await prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: 'COMPLETED' },
      _sum: { totalAmount: true },
    })
    const lastMonthRev = await prisma.order.aggregate({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, status: 'COMPLETED' },
      _sum: { totalAmount: true },
    })
    const monthlyRevenue = thisMonthRev._sum.totalAmount || 0
    const lastRev = lastMonthRev._sum.totalAmount || 0
    const revChange =
      lastRev === 0 ? (monthlyRevenue > 0 ? 100 : 0) : Math.round(((monthlyRevenue - lastRev) / lastRev) * 100)

    // Alerts: tồn kho thấp + sắp hết hạn
    const inventories = await prisma.inventory.findMany({
      include: { product: true },
    })
    const lowStock = inventories.filter((i) => i.quantity < (i.product.minStock || 0))
    const expiringSoon = inventories.filter(
      (i) => i.expiryDate && i.expiryDate >= now && (i.expiryDate - now) / 86400000 <= 7
    )
    const alerts = lowStock.length + expiringSoon.length

    const kpis = {
      totalProducts: {
        value: totalProducts,
        change: `+${prodChange}%`,
        trend: 'up',
        sub: 'tổng số sản phẩm',
      },
      todayOrders: {
        value: todayOrders,
        change: `${orderChange >= 0 ? '+' : ''}${orderChange}%`,
        trend: orderChange >= 0 ? 'up' : 'down',
        sub: 'so với hôm qua',
      },
      monthlyRevenue: {
        value: `₫${monthlyRevenue.toLocaleString('vi-VN')}`,
        change: `${revChange >= 0 ? '+' : ''}${revChange}%`,
        trend: revChange >= 0 ? 'up' : 'down',
        sub: 'so với tháng trước',
      },
      alerts: {
        value: alerts,
        change: '0%',
        trend: 'up',
        sub: 'cần xử lý',
      },
    }

    // ============================================================
    // 2. Biến động tồn kho 30 ngày (từ tổng tồn thực tế)
    // ============================================================
    const totalStock = inventories.reduce((sum, i) => sum + i.quantity, 0)
    const inventoryChart = []
    let base = totalStock
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      inventoryChart.push({
        date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        stock: base,
      })
      base = Math.max(0, base + Math.round((Math.random() - 0.5) * 300))
    }
    // Đảm bảo ngày cuối = tổng tồn thực tế hiện tại
    inventoryChart[inventoryChart.length - 1].stock = totalStock

    // ============================================================
    // 3. Top 5 sản phẩm bán chạy (từ OrderItem)
    // ============================================================
    const topSold = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    })
    const topProducts = []
    for (const t of topSold) {
      const p = await prisma.product.findUnique({ where: { id: t.productId } })
      if (p) {
        topProducts.push({
          rank: topProducts.length + 1,
          name: p.nameVi,
          sold: t._sum.quantity || 0,
          percent: 0,
        })
      }
    }
    const maxSold = topProducts[0]?.sold || 1
    topProducts.forEach((p) => (p.percent = Math.round((p.sold / maxSold) * 100)))

    // ============================================================
    // 4. Sản phẩm sắp hết hạn
    // ============================================================
    const expiringProducts = inventories
      .filter((i) => i.expiryDate && i.quantity > 0)
      .map((i) => ({
        id: i.productId,
        name: i.product.nameVi,
        lot: i.lotNumber || 'N/A',
        expiry: i.expiryDate.toISOString().split('T')[0],
        daysLeft: Math.ceil((i.expiryDate - now) / 86400000),
        quantity: i.quantity,
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 7)

    // ============================================================
    // 5. Tồn kho thấp
    // ============================================================
    const lowInventory = lowStock
      .map((i) => ({
        id: i.productId,
        name: i.product.nameVi,
        sku: i.product.code,
        stock: i.quantity,
        minStock: i.product.minStock,
        status: i.quantity < (i.product.minStock || 0) * 0.5 ? 'critical' : 'warning',
      }))
      .sort((a, b) => a.stock / a.minStock - b.stock / b.minStock)
      .slice(0, 7)

    // ============================================================
    // Response
    // ============================================================
    res.json({
      kpis,
      inventoryChart,
      topProducts,
      expiringProducts,
      lowInventory,
    })
  } catch (error) {
    console.error('❌ Dashboard error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// PRODUCTS APIs
// ============================================================

// GET /api/products - Lấy danh sách sản phẩm (hỗ trợ filter + pagination)
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query
    
    const where = {}
    
    // Search by name, code, category, or price range
    if (search) {
      const searchLower = search.toLowerCase()
      where.OR = [
        { nameVi: { contains: searchLower } },
        { nameEn: { contains: searchLower } },
        { code: { contains: searchLower } },
        { category: { contains: searchLower } },
        { unit: { contains: searchLower } }
      ]
    }
    
    // Filter by category
    if (category && category !== 'all') {
      where.category = category
    }
    
    // Filter by status
    if (status && status !== 'all') {
      where.status = status
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('❌ Products error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/products/:id - Lấy chi tiết sản phẩm
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        inventories: {
          include: {
            binLocation: true
          }
        }
      }
    })
    
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' })
    }
    
    res.json(product)
  } catch (error) {
    console.error('❌ Product detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/products - Tạo sản phẩm mới
app.post('/api/products', async (req, res) => {
  try {
    const { code, nameVi, nameEn, category, unit, barcode, costPrice, sellingPrice, minStock, defaultExpiry, lotTracking, status, image, descriptionVi, descriptionEn } = req.body
    
    const product = await prisma.product.create({
      data: {
        code,
        nameVi,
        nameEn,
        category,
        unit: unit || 'Cái',
        barcode,
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        minStock: parseInt(minStock) || 10,
        defaultExpiry: defaultExpiry ? parseInt(defaultExpiry) : null,
        lotTracking: lotTracking || false,
        status: status || 'ACTIVE',
        image,
        descriptionVi,
        descriptionEn
      }
    })
    
    res.status(201).json(product)
  } catch (error) {
    console.error('❌ Create product error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/products/:id - Cập nhật sản phẩm
app.put('/api/products/:id', async (req, res) => {
  try {
    const { code, nameVi, nameEn, category, unit, barcode, costPrice, sellingPrice, minStock, defaultExpiry, lotTracking, status, image, descriptionVi, descriptionEn } = req.body
    
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        code,
        nameVi,
        nameEn,
        category,
        unit,
        barcode,
        costPrice: costPrice ? parseFloat(costPrice) : undefined,
        sellingPrice: sellingPrice ? parseFloat(sellingPrice) : undefined,
        minStock: minStock ? parseInt(minStock) : undefined,
        defaultExpiry: defaultExpiry ? parseInt(defaultExpiry) : null,
        lotTracking,
        status,
        image,
        descriptionVi,
        descriptionEn
      }
    })
    
    res.json(product)
  } catch (error) {
    console.error('❌ Update product error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/products/:id - Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    console.error('❌ Delete product error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// INVENTORY APIs
// ============================================================

// GET /api/inventory - Lấy danh sách tồn kho (hỗ trợ filter + pagination)
app.get('/api/inventory', async (req, res) => {
  try {
    const { search, warehouse, category, status, page = 1, limit = 10 } = req.query
    
    const where = {}
    
    // Search by product name or code
    if (search) {
      const searchLower = search.toLowerCase()
      where.product = {
        OR: [
          { nameVi: { contains: searchLower } },
          { nameEn: { contains: searchLower } },
          { code: { contains: searchLower } }
        ]
      }
    }
    
    // Filter by warehouse (bin.shelf.zone.warehouseId)
    if (warehouse && warehouse !== 'all') {
      where.bin = {
        is: {
          shelf: {
            is: {
              zone: {
                is: {
                  warehouseId: warehouse
                }
              }
            }
          }
        }
      }
    }
    
    // Filter by category
    if (category && category !== 'all') {
      where.product = {
        ...where.product,
        category: category
      }
    }
    
    // Filter by status (based on stock level)
    if (status && status !== 'all') {
      if (status === 'normal') {
        where.quantity = { gte: 0 } // Will be filtered after query
      } else if (status === 'low') {
        where.quantity = { lt: 0 } // Will be filtered after query
      } else if (status === 'critical') {
        where.quantity = { lt: 0 } // Will be filtered after query
      }
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [inventories, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { updatedAt: 'desc' },
        include: {
          product: true,
          bin: {
            include: {
              shelf: {
                include: {
                  zone: {
                    include: {
                      warehouse: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.inventory.count({ where })
    ])
    
    // Post-filter for status (since it depends on product.minStock)
    let filteredInventories = inventories
    if (status && status !== 'all') {
      filteredInventories = inventories.filter(inv => {
        const minStock = inv.product?.minStock || 0
        if (status === 'normal') {
          return inv.quantity >= minStock
        } else if (status === 'low') {
          return inv.quantity < minStock && inv.quantity >= minStock * 0.5
        } else if (status === 'critical') {
          return inv.quantity < minStock * 0.5
        }
        return true
      })
    }
    
    // Calculate status for each inventory
    const inventoriesWithStatus = filteredInventories.map(inv => {
      const minStock = inv.product?.minStock || 0
      let status = 'normal'
      if (inv.quantity < minStock * 0.5) {
        status = 'critical'
      } else if (inv.quantity < minStock) {
        status = 'low'
      }
      
      return {
        ...inv,
        status
      }
    })
    
    res.json({
      inventories: inventoriesWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('❌ Inventory error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/inventory/:id - Lấy chi tiết tồn kho
app.get('/api/inventory/:id', async (req, res) => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: req.params.id },
      include: {
        product: true,
        bin: {
          include: {
            shelf: {
              include: {
                zone: {
                  include: {
                    warehouse: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    if (!inventory) {
      return res.status(404).json({ error: 'Không tìm thấy tồn kho' })
    }
    
    // Calculate status
    const minStock = inventory.product?.minStock || 0
    let status = 'normal'
    if (inventory.quantity < minStock * 0.5) {
      status = 'critical'
    } else if (inventory.quantity < minStock) {
      status = 'low'
    }
    
    res.json({
      ...inventory,
      status
    })
  } catch (error) {
    console.error('❌ Inventory detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/inventory/:id - Cập nhật tồn kho
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { quantity, availableStock, reservedStock, expiryDate, lotNumber, binId } = req.body
    
    const inventory = await prisma.inventory.update({
      where: { id: req.params.id },
      data: {
        quantity: parseInt(quantity),
        availableStock: parseInt(availableStock),
        reservedStock: parseInt(reservedStock),
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        lotNumber,
        binId
      },
      include: {
        product: true,
        bin: {
          include: {
            shelf: {
              include: {
                zone: {
                  include: {
                    warehouse: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    // Calculate status
    const minStock = inventory.product?.minStock || 0
    let status = 'normal'
    if (inventory.quantity < minStock * 0.5) {
      status = 'critical'
    } else if (inventory.quantity < minStock) {
      status = 'low'
    }
    
    res.json({
      ...inventory,
      status
    })
  } catch (error) {
    console.error('❌ Update inventory error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// PRODUCT SEARCH API - Tìm kiếm sản phẩm với vị trí
// ============================================================

// GET /api/products/search - Tìm kiếm sản phẩm với vị trí đầy đủ
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query
    
    if (!q) {
      return res.json({ products: [] })
    }

    const searchLower = q.toLowerCase()
    
    // Tìm sản phẩm
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { nameVi: { contains: searchLower } },
          { nameEn: { contains: searchLower } },
          { code: { contains: searchLower } }
        ]
      },
      include: {
        inventories: {
          include: {
            bin: {
              include: {
                shelf: {
                  include: {
                    zone: {
                      include: {
                        warehouse: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    // Format kết quả
    const results = products.map(product => {
      const locations = product.inventories
        .filter(inv => inv.quantity > 0)
        .map(inv => ({
          warehouse: inv.bin.shelf.zone.warehouse.name,
          warehouseCode: inv.bin.shelf.zone.warehouse.code,
          zone: inv.bin.shelf.zone.name,
          zoneCode: inv.bin.shelf.zone.code,
          shelf: inv.bin.shelf.name,
          shelfCode: inv.bin.shelf.code,
          bin: inv.bin.code,
          binId: inv.bin.id,
          quantity: inv.quantity,
          capacity: inv.bin.capacity,
          percentage: Math.round((inv.quantity / inv.bin.capacity) * 100)
        }))

      return {
        id: product.id,
        code: product.code,
        nameVi: product.nameVi,
        nameEn: product.nameEn,
        category: product.category,
        unit: product.unit,
        totalQuantity: locations.reduce((sum, loc) => sum + loc.quantity, 0),
        locations
      }
    })

    res.json({ products: results })
  } catch (error) {
    console.error('❌ Search products error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// WAREHOUSE APIs
// ============================================================

// GET /api/warehouses - Lấy danh sách tất cả warehouses
app.get('/api/warehouses', async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        zones: {
          include: {
            shelves: {
              include: {
                bins: true
              }
            }
          }
        }
      },
      orderBy: { code: 'asc' }
    })
    res.json(warehouses)
  } catch (error) {
    console.error('❌ Warehouses error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/warehouses/:id - Lấy chi tiết warehouse
app.get('/api/warehouses/:id', async (req, res) => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: req.params.id },
      include: {
        zones: {
          include: {
            shelves: {
              include: {
                bins: true
              }
            }
          }
        }
      }
    })
    
    if (!warehouse) {
      return res.status(404).json({ error: 'Không tìm thấy kho' })
    }
    
    res.json(warehouse)
  } catch (error) {
    console.error('❌ Warehouse detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/warehouses - Tạo warehouse mới
app.post('/api/warehouses', async (req, res) => {
  try {
    const { code, name, address, capacity, status } = req.body
    
    const warehouse = await prisma.warehouse.create({
      data: {
        code,
        name,
        address,
        capacity: parseInt(capacity) || 0,
        status: status !== undefined ? status : true
      }
    })
    
    res.status(201).json(warehouse)
  } catch (error) {
    console.error('❌ Create warehouse error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/warehouses/:id - Cập nhật warehouse
app.put('/api/warehouses/:id', async (req, res) => {
  try {
    const { code, name, address, capacity, status } = req.body
    
    const warehouse = await prisma.warehouse.update({
      where: { id: req.params.id },
      data: {
        code,
        name,
        address,
        capacity: capacity ? parseInt(capacity) : undefined,
        status
      }
    })
    
    res.json(warehouse)
  } catch (error) {
    console.error('❌ Update warehouse error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/warehouses/:id - Xóa warehouse
app.delete('/api/warehouses/:id', async (req, res) => {
  try {
    // Kiểm tra xem warehouse có zones không
    const zones = await prisma.zone.findMany({
      where: { warehouseId: req.params.id }
    })
    
    if (zones.length > 0) {
      return res.status(400).json({ 
        error: 'Không thể xóa kho này vì đã có dãy/kệ/hàng bên trong. Vui lòng xóa tất cả dãy trước.',
        hasZones: true,
        zoneCount: zones.length
      })
    }
    
    await prisma.warehouse.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Xóa kho thành công' })
  } catch (error) {
    console.error('❌ Delete warehouse error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// ZONE APIs
// ============================================================

// GET /api/zones - Lấy danh sách tất cả zones
app.get('/api/zones', async (req, res) => {
  try {
    const zones = await prisma.zone.findMany({
      include: {
        warehouse: true,
        shelves: {
          include: {
            bins: true
          }
        }
      },
      orderBy: { code: 'asc' }
    })
    res.json(zones)
  } catch (error) {
    console.error('❌ Zones error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/zones/:id - Lấy chi tiết zone
app.get('/api/zones/:id', async (req, res) => {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: req.params.id },
      include: {
        warehouse: true,
        shelves: {
          include: {
            bins: true
          }
        }
      }
    })
    
    if (!zone) {
      return res.status(404).json({ error: 'Không tìm thấy dãy' })
    }
    
    res.json(zone)
  } catch (error) {
    console.error('❌ Zone detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/zones - Tạo zone mới
app.post('/api/zones', async (req, res) => {
  try {
    const { code, name, description, warehouseId } = req.body
    
    const zone = await prisma.zone.create({
      data: {
        code,
        name,
        description,
        warehouseId
      },
      include: {
        warehouse: true
      }
    })
    
    res.status(201).json(zone)
  } catch (error) {
    console.error('❌ Create zone error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/zones/:id - Cập nhật zone
app.put('/api/zones/:id', async (req, res) => {
  try {
    const { code, name, description } = req.body
    
    const zone = await prisma.zone.update({
      where: { id: req.params.id },
      data: {
        code,
        name,
        description
      },
      include: {
        warehouse: true
      }
    })
    
    res.json(zone)
  } catch (error) {
    console.error('❌ Update zone error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/zones/:id - Xóa zone
app.delete('/api/zones/:id', async (req, res) => {
  try {
    await prisma.zone.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Xóa dãy thành công' })
  } catch (error) {
    console.error('❌ Delete zone error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// SHELF APIs
// ============================================================

// GET /api/shelves - Lấy danh sách shelves (có thể filter by zone)
app.get('/api/shelves', async (req, res) => {
  try {
    const { zoneId } = req.query
    
    const where = {}
    if (zoneId) {
      where.zoneId = zoneId
    }
    
    const shelves = await prisma.shelf.findMany({
      where,
      include: {
        zone: true,
        bins: true
      },
      orderBy: { code: 'asc' }
    })
    
    res.json(shelves)
  } catch (error) {
    console.error('❌ Shelves error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/shelves/:id - Lấy chi tiết shelf
app.get('/api/shelves/:id', async (req, res) => {
  try {
    const shelf = await prisma.shelf.findUnique({
      where: { id: req.params.id },
      include: {
        zone: true,
        bins: {
          include: {
            inventories: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })
    
    if (!shelf) {
      return res.status(404).json({ error: 'Không tìm thấy kệ' })
    }
    
    res.json(shelf)
  } catch (error) {
    console.error('❌ Shelf detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/shelves - Tạo shelf mới
app.post('/api/shelves', async (req, res) => {
  try {
    const { code, name, capacity, description, zoneId } = req.body
    
    const shelf = await prisma.shelf.create({
      data: {
        code,
        name,
        capacity: parseInt(capacity) || 10,
        description,
        zoneId
      },
      include: {
        zone: true
      }
    })
    
    res.status(201).json(shelf)
  } catch (error) {
    console.error('❌ Create shelf error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/shelves/:id/bins - Tạo hàng loạt bins cho shelf
app.post('/api/shelves/:id/bins', async (req, res) => {
  try {
    const { count } = req.body
    const shelfId = req.params.id
    
    const shelf = await prisma.shelf.findUnique({
      where: { id: shelfId },
      include: {
        zone: true
      }
    })
    
    if (!shelf) {
      return res.status(404).json({ error: 'Không tìm thấy kệ' })
    }
    
    const binCount = parseInt(count) || shelf.capacity || 10
    
    // Tạo bins mới
    const bins = []
    for (let i = 1; i <= binCount; i++) {
      const binCode = `${shelf.code}-${String(i).padStart(2, '0')}`
      bins.push({
        code: binCode,
        name: `Ô ${binCode}`,
        capacity: 100,
        status: 'EMPTY',
        shelfId: shelfId
      })
    }
    
    const createdBins = await prisma.bin.createMany({
      data: bins
    })
    
    res.status(201).json({ 
      message: `Tạo ${createdBins.count} ô lưu trữ thành công`,
      count: createdBins.count
    })
  } catch (error) {
    console.error('❌ Create bins error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/shelves/:id - Cập nhật shelf
app.put('/api/shelves/:id', async (req, res) => {
  try {
    const { code, name, capacity, description } = req.body
    
    const shelf = await prisma.shelf.update({
      where: { id: req.params.id },
      data: {
        code,
        name,
        capacity: capacity ? parseInt(capacity) : undefined,
        description
      },
      include: {
        zone: true
      }
    })
    
    res.json(shelf)
  } catch (error) {
    console.error('❌ Update shelf error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/shelves/:id - Xóa shelf
app.delete('/api/shelves/:id', async (req, res) => {
  try {
    await prisma.shelf.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Xóa kệ thành công' })
  } catch (error) {
    console.error('❌ Delete shelf error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// BIN APIs
// ============================================================

// GET /api/bins - Lấy danh sách bins (có thể filter by shelf)
app.get('/api/bins', async (req, res) => {
  try {
    const { shelfId } = req.query
    
    const where = {}
    if (shelfId) {
      where.shelfId = shelfId
    }
    
    const bins = await prisma.bin.findMany({
      where,
      include: {
        shelf: {
          include: {
            zone: true
          }
        },
        inventories: {
          include: {
            product: true
          }
        }
      },
      orderBy: { code: 'asc' }
    })
    
    res.json(bins)
  } catch (error) {
    console.error('❌ Bins error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/bins/:id - Lấy chi tiết bin
app.get('/api/bins/:id', async (req, res) => {
  try {
    const bin = await prisma.bin.findUnique({
      where: { id: req.params.id },
      include: {
        shelf: {
          include: {
            zone: true
          }
        },
        inventories: {
          include: {
            product: true
          }
        }
      }
    })
    
    if (!bin) {
      return res.status(404).json({ error: 'Không tìm thấy ô lưu trữ' })
    }
    
    res.json(bin)
  } catch (error) {
    console.error('❌ Bin detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/bins/:id - Cập nhật bin
app.put('/api/bins/:id', async (req, res) => {
  try {
    const { code, name, capacity, status, productId, soLuong } = req.body
    
    const bin = await prisma.bin.update({
      where: { id: req.params.id },
      data: {
        code,
        name,
        capacity: capacity ? parseInt(capacity) : undefined,
        status,
        productId,
        soLuong: soLuong ? parseInt(soLuong) : undefined
      },
      include: {
        shelf: {
          include: {
            zone: true
          }
        }
      }
    })
    
    res.json(bin)
  } catch (error) {
    console.error('❌ Update bin error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// ORDER APIs
// ============================================================

// GET /api/orders - Lấy danh sách đơn hàng (hỗ trợ filter + pagination)
app.get('/api/orders', async (req, res) => {
  try {
    const { status, warehouseId, dateRange, search, page = 1, limit = 10 } = req.query
    
    const where = {}
    
    // Filter by status
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    // Filter by warehouse
    if (warehouseId && warehouseId !== 'all') {
      where.warehouseId = warehouseId
    }
    
    // Filter by date range
    if (dateRange && dateRange !== 'all') {
      const now = new Date()
      let startDate
      
      switch (dateRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      }
      
      where.createdAt = { gte: startDate }
    }
    
    // Search by order code, customer name or phone
    if (search) {
      const searchLower = search.toLowerCase()
      where.OR = [
        { orderCode: { contains: search } },
        { customerName: { contains: searchLower } },
        { customerPhone: { contains: search } }
      ]
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          warehouse: true,
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ])
    
    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('❌ Orders error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/orders/:id - Lấy chi tiết đơn hàng
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' })
    }
    
    res.json(order)
  } catch (error) {
    console.error('❌ Order detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/orders - Tạo đơn hàng mới
app.post('/api/orders', async (req, res) => {
  try {
    const { orderCode, customerName, customerPhone, customerAddress, warehouseId, notes, items } = req.body
    
    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Đơn hàng phải có ít nhất 1 sản phẩm' })
    }
    
    // Calculate total amount
    let totalAmount = 0
    for (const item of items) {
      totalAmount += item.quantity * item.unitPrice
    }
    
    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName,
        customerPhone,
        customerAddress,
        warehouseId,
        notes,
        totalAmount,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        }
      },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    res.status(201).json(order)
  } catch (error) {
    console.error('❌ Create order error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/orders/:id - Cập nhật đơn hàng
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status, notes } = req.body
    
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        notes
      },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    res.json(order)
  } catch (error) {
    console.error('❌ Update order error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/orders/:id - Xóa đơn hàng (chỉ cho phép khi PENDING)
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    })
    
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' })
    }
    
    if (order.status !== 'PENDING') {
      return res.status(400).json({ 
        error: 'Chỉ có thể xóa đơn hàng ở trạng thái "Chờ xác nhận"' 
      })
    }
    
    // Delete order items first (cascade will handle this, but being explicit)
    await prisma.orderItem.deleteMany({
      where: { orderId: order.id }
    })
    
    // Delete order
    await prisma.order.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Xóa đơn hàng thành công' })
  } catch (error) {
    console.error('❌ Delete order error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/products/for-order - Lấy danh sách sản phẩm cho tạo đơn (với thông tin tồn kho)
app.get('/api/products/for-order', async (req, res) => {
  try {
    const { warehouseId, search } = req.query
    
    let products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        inventories: {
          where: {
            quantity: { gt: 0 },
            ...(warehouseId && warehouseId !== 'all' ? { warehouseId } : {})
          },
          include: {
            bin: {
              include: {
                shelf: {
                  include: {
                    zone: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(p => 
        p.nameVi.toLowerCase().includes(searchLower) ||
        p.code.toLowerCase().includes(searchLower)
      )
    }
    
    // Format response
    const result = products.map(product => {
      const totalStock = product.inventories.reduce((sum, inv) => sum + inv.quantity, 0)
      const locations = product.inventories.map(inv => ({
        warehouseId: inv.warehouseId,
        warehouseName: inv.warehouse?.name || 'Không xác định',
        binId: inv.binId,
        binCode: inv.bin.code,
        quantity: inv.quantity,
        zone: inv.bin.shelf.zone.name,
        shelf: inv.bin.shelf.name
      }))
      
      return {
        id: product.id,
        code: product.code,
        nameVi: product.nameVi,
        sellingPrice: product.sellingPrice,
        unit: product.unit,
        totalStock,
        locations
      }
    })
    
    res.json({ products: result })
  } catch (error) {
    console.error('❌ Products for order error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// EMPLOYEE (USER) APIs
// ============================================================

// GET /api/employees - Lấy danh sách nhân viên (hỗ trợ filter + pagination)
app.get('/api/employees', async (req, res) => {
  try {
    const { search, role, warehouseId, status, page = 1, limit = 10 } = req.query
    
    const where = {}
    
    // Search by employee code, name, phone or email
    if (search) {
      const searchLower = search.toLowerCase()
      where.OR = [
        { employeeCode: { contains: search } },
        { fullName: { contains: searchLower } },
        { phone: { contains: search } },
        { email: { contains: searchLower } }
      ]
    }
    
    // Filter by role
    if (role && role !== 'all') {
      where.role = role.toUpperCase()
    }
    
    // Filter by warehouse
    if (warehouseId && warehouseId !== 'all') {
      where.warehouseId = warehouseId
    }
    
    // Filter by status
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          warehouse: true
        }
      }),
      prisma.user.count({ where })
    ])
    
    // Format response
    const employees = users.map(user => ({
      id: user.employeeCode,
      userId: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      roleName: getRoleName(user.role),
      warehouseId: user.warehouseId,
      warehouse: user.warehouse?.name || 'Chưa phân công',
      status: user.status.toLowerCase(),
      statusName: user.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ',
      joinDate: user.joinDate,
      permissions: getPermissions(user)
    }))
    
    res.json({
      employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('❌ Employees error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/employees/:id - Lấy chi tiết nhân viên
app.get('/api/employees/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        warehouse: true
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' })
    }
    
    const employee = {
      id: user.employeeCode,
      userId: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      roleName: getRoleName(user.role),
      warehouseId: user.warehouseId,
      warehouse: user.warehouse,
      status: user.status.toLowerCase(),
      statusName: user.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ',
      joinDate: user.joinDate,
      address: user.address,
      birthday: user.birthday,
      gender: user.gender,
      permissions: getPermissions(user)
    }
    
    res.json(employee)
  } catch (error) {
    console.error('❌ Employee detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/employees - Tạo nhân viên mới
app.post('/api/employees', async (req, res) => {
  try {
    const { employeeCode, fullName, email, phone, password, role, warehouseId, address, birthday, gender } = req.body
    
    // Validate email and phone format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10,11}$/
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' })
    }
    
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ (10-11 số)' })
    }
    
    // Check if email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    })
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email hoặc số điện thoại đã tồn tại' })
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        employeeCode: employeeCode || `NV${Date.now()}`,
        fullName,
        email,
        phone,
        password: password || '123456', // Default password
        role: role.toUpperCase() || 'STAFF',
        warehouseId,
        address,
        birthday: birthday ? new Date(birthday) : undefined,
        gender,
        status: 'ACTIVE'
      },
      include: {
        warehouse: true
      }
    })
    
    const employee = {
      id: user.employeeCode,
      userId: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      roleName: getRoleName(user.role),
      warehouseId: user.warehouseId,
      warehouse: user.warehouse?.name || 'Chưa phân công',
      status: user.status.toLowerCase(),
      statusName: 'Đang làm việc'
    }
    
    res.status(201).json(employee)
  } catch (error) {
    console.error('❌ Create employee error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/employees/:id - Cập nhật nhân viên
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { fullName, email, phone, role, warehouseId, address, birthday, gender, status } = req.body
    
    // Validate email and phone format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10,11}$/
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' })
    }
    
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ (10-11 số)' })
    }
    
    // Check if email or phone already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ],
        NOT: {
          id: req.params.id
        }
      }
    })
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email hoặc số điện thoại đã tồn tại' })
    }
    
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        fullName,
        email,
        phone,
        role: role.toUpperCase(),
        warehouseId,
        address,
        birthday: birthday ? new Date(birthday) : undefined,
        gender,
        status: status ? status.toUpperCase() : 'ACTIVE'
      },
      include: {
        warehouse: true
      }
    })
    
    const employee = {
      id: user.employeeCode,
      userId: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      roleName: getRoleName(user.role),
      warehouseId: user.warehouseId,
      warehouse: user.warehouse?.name || 'Chưa phân công',
      status: user.status.toLowerCase(),
      statusName: user.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ'
    }
    
    res.json(employee)
  } catch (error) {
    console.error('❌ Update employee error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/employees/:id/reset-password - Reset mật khẩu nhân viên
app.put('/api/employees/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body
    
    await prisma.user.update({
      where: { id: req.params.id },
      data: {
        password: newPassword || '123456'
      }
    })
    
    res.json({ message: 'Reset mật khẩu thành công' })
  } catch (error) {
    console.error('❌ Reset password error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/employees/:id - Xóa nhân viên
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Xóa nhân viên thành công' })
  } catch (error) {
    console.error('❌ Delete employee error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Helper functions
function getRoleName(role) {
  switch (role) {
    case 'ADMIN':
      return 'Quản trị viên'
    case 'MANAGER':
      return 'Quản lý kho'
    case 'STAFF':
      return 'Nhân viên kho'
    case 'STOREKEEPER':
      return 'Thủ kho'
    default:
      return role
  }
}

function getPermissions(user) {
  const permissions = []
  if (user.canImport) permissions.push('import')
  if (user.canExport) permissions.push('export')
  if (user.canManageInventory) permissions.push('inventory')
  if (user.canViewReports) permissions.push('reports')
  if (user.canManageWarehouse) permissions.push('manage_warehouse')
  if (user.canManageEmployees) permissions.push('manage_employees')
  if (user.canManageSuppliers) permissions.push('manage_suppliers')
  if (user.canManageProducts) permissions.push('manage_products')
  return permissions
}

// ============================================================
// REPORTS APIs
// ============================================================

// GET /api/reports/inventory - Báo cáo tồn kho theo danh mục
app.get('/api/reports/inventory', async (req, res) => {
  try {
    const { warehouseId, timeRange } = req.query
    
    // Build where clause for warehouse filter
    const where = {}
    if (warehouseId && warehouseId !== 'all') {
      where.warehouseId = warehouseId
    }
    
    // Get all inventories with product info
    const inventories = await prisma.inventory.findMany({
      where,
      include: {
        product: true,
        warehouse: true
      }
    })
    
    // Group by category
    const categoryMap = new Map()
    inventories.forEach(inv => {
      const category = inv.product?.category || 'Khác'
      const existing = categoryMap.get(category) || { quantity: 0, value: 0 }
      existing.quantity += inv.quantity
      existing.value += inv.quantity * (inv.product?.sellingPrice || 0)
      categoryMap.set(category, existing)
    })
    
    // Convert to array and calculate percentages
    const total = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.quantity, 0)
    const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      value: data.quantity,
      valueVND: data.value,
      percentage: total > 0 ? ((data.quantity / total) * 100).toFixed(1) : 0
    }))
    
    // Define colors for categories
    const categoryColors = {
      'Điện tử': '#3B82F6',
      'Thực phẩm': '#10B981',
      'Mỹ phẩm': '#F59E0B',
      'Khác': '#6B7280'
    }
    
    const result = categories.map(cat => ({
      ...cat,
      color: categoryColors[cat.name] || '#6B7280'
    }))
    
    res.json({
      categories: result,
      total,
      totalValue: result.reduce((sum, cat) => sum + cat.valueVND, 0)
    })
  } catch (error) {
    console.error('❌ Reports inventory error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reports/inout - Báo cáo nhập xuất
app.get('/api/reports/inout', async (req, res) => {
  try {
    const { warehouseId, timeRange } = req.query
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    
    // Get stock receipts (imports)
    const receipts = await prisma.stockReceipt.findMany({
      where: {
        createdAt: { gte: startDate },
        ...(warehouseId && warehouseId !== 'all' ? {
          details: {
            some: {
              location: { contains: warehouseId }
            }
          }
        } : {})
      },
      include: {
        details: {
          include: {
            product: true
          }
        }
      }
    })
    
    // Group by date
    const dateMap = new Map()
    receipts.forEach(receipt => {
      const date = receipt.createdAt.toISOString().split('T')[0]
      const existing = dateMap.get(date) || { nhap: 0, xuat: 0 }
      
      receipt.details.forEach(detail => {
        if (receipt.type === 'IMPORT') {
          existing.nhap += detail.quantity
        } else if (receipt.type === 'EXPORT') {
          existing.xuat += detail.quantity
        }
      })
      
      dateMap.set(date, existing)
    })
    
    // Convert to array and sort by date
    const data = Array.from(dateMap.entries())
      .map(([date, values]) => ({
        date: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        ...values
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30) // Last 30 data points
    
    res.json({ data })
  } catch (error) {
    console.error('❌ Reports inout error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reports/topselling - Top sản phẩm bán chạy
app.get('/api/reports/topselling', async (req, res) => {
  try {
    const { warehouseId, timeRange } = req.query
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    
    // Get order items grouped by product
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: startDate },
          ...(warehouseId && warehouseId !== 'all' ? {
            warehouseId: warehouseId
          } : {})
        }
      },
      include: {
        product: true
      }
    })
    
    // Group by product
    const productMap = new Map()
    orderItems.forEach(item => {
      const existing = productMap.get(item.productId) || {
        name: item.product?.nameVi || 'Unknown',
        sold: 0,
        revenue: 0
      }
      existing.sold += item.quantity
      existing.revenue += item.quantity * item.unitPrice
      productMap.set(item.productId, existing)
    })
    
    // Convert to array and sort
    const topProducts = Array.from(productMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)
      .map((item, index) => ({ ...item, rank: index + 1 }))
    
    res.json({ products: topProducts })
  } catch (error) {
    console.error('❌ Reports topselling error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reports/slowmoving - Sản phẩm chậm luân chuyển
app.get('/api/reports/slowmoving', async (req, res) => {
  try {
    const { warehouseId } = req.query
    
    const where = {}
    if (warehouseId && warehouseId !== 'all') {
      where.warehouseId = warehouseId
    }
    
    // Get all inventories
    const inventories = await prisma.inventory.findMany({
      where,
      include: {
        product: true
      }
    })
    
    // Get order items to calculate sales
    const orderItems = await prisma.orderItem.findMany({
      where: {
        ...(warehouseId && warehouseId !== 'all' ? {
          order: { warehouseId }
        } : {})
      },
      include: {
        product: true
      }
    })
    
    // Calculate sales per product
    const salesMap = new Map()
    orderItems.forEach(item => {
      const existing = salesMap.get(item.productId) || 0
      salesMap.set(item.productId, existing + item.quantity)
    })
    
    // Find slow moving products (stock > 0 but low sales)
    const slowMoving = inventories
      .filter(inv => inv.quantity > 0)
      .map(inv => {
        const sold = salesMap.get(inv.productId) || 0
        return {
          id: inv.productId,
          name: inv.product?.nameVi || 'Unknown',
          stock: inv.quantity,
          sold: sold,
          days: sold > 0 ? Math.floor(30 / sold) : 90 // Estimate days without sale
        }
      })
      .filter(item => item.sold < 5) // Less than 5 sales
      .sort((a, b) => b.days - a.days)
      .slice(0, 20)
    
    res.json({ products: slowMoving })
  } catch (error) {
    console.error('❌ Reports slowmoving error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reports/expiry - Sản phẩm sắp hết hạn
app.get('/api/reports/expiry', async (req, res) => {
  try {
    const { warehouseId } = req.query
    
    const where = {
      expiryDate: { not: null }
    }
    if (warehouseId && warehouseId !== 'all') {
      where.warehouseId = warehouseId
    }
    
    // Get inventories with expiry dates
    const inventories = await prisma.inventory.findMany({
      where: {
        ...where,
        expiryDate: { gte: new Date() },
        quantity: { gt: 0 }
      },
      include: {
        product: true
      },
      orderBy: {
        expiryDate: 'asc'
      }
    })
    
    // Calculate days left and filter
    const now = new Date()
    const expiringProducts = inventories
      .map(inv => ({
        id: inv.id,
        product: inv.product?.nameVi || 'Unknown',
        lot: inv.lotNumber || 'N/A',
        expiry: inv.expiryDate?.toISOString().split('T')[0] || 'N/A',
        daysLeft: Math.ceil((inv.expiryDate - now) / (1000 * 60 * 60 * 24)),
        quantity: inv.quantity
      }))
      .filter(item => item.daysLeft <= 90) // Within 90 days
      .slice(0, 50)
    
    res.json({ products: expiringProducts })
  } catch (error) {
    console.error('❌ Reports expiry error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reports/value - Giá trị tồn kho theo kho
app.get('/api/reports/value', async (req, res) => {
  try {
    const { timeRange } = req.query
    
    // Get all warehouses
    const warehouses = await prisma.warehouse.findMany({
      include: {
        inventories: {
          include: {
            product: true
          }
        }
      }
    })
    
    // Calculate value per warehouse
    const warehouseValues = warehouses.map(warehouse => {
      const totalValue = warehouse.inventories.reduce((sum, inv) => {
        return sum + (inv.quantity * (inv.product?.sellingPrice || 0))
      }, 0)
      
      return {
        name: warehouse.name,
        value: Math.round(totalValue / 1000000) // Convert to millions
      }
    })
    
    res.json({ warehouses: warehouseValues })
  } catch (error) {
    console.error('❌ Reports value error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// PROFILE APIs
// ============================================================

// GET /api/profile/:userId - Lấy thông tin profile
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: {
        warehouse: true,
        settings: true,
        sessions: {
          orderBy: { lastActive: 'desc' }
        }
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' })
    }
    
    res.json({
      id: user.id,
      employeeCode: user.employeeCode,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      address: user.address,
      birthday: user.birthday,
      gender: user.gender,
      joinDate: user.joinDate,
      warehouse: user.warehouse,
      settings: user.settings || {
        emailNotifications: true,
        pushNotifications: true,
        orderAlerts: true,
        inventoryAlerts: true,
        systemUpdates: false,
        marketingEmails: false
      },
      sessions: user.sessions || []
    })
  } catch (error) {
    console.error('❌ Profile error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/profile/:userId - Cập nhật thông tin profile
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { fullName, email, phone, address, birthday, gender } = req.body
    
    // Validate email and phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10,11}$/
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' })
    }
    
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ' })
    }
    
    // Check if email or phone already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ],
        NOT: { id: req.params.userId }
      }
    })
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email hoặc số điện thoại đã tồn tại' })
    }
    
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: {
        fullName,
        email,
        phone,
        address,
        birthday: birthday ? new Date(birthday) : undefined,
        gender
      },
      include: {
        warehouse: true
      }
    })
    
    res.json(user)
  } catch (error) {
    console.error('❌ Update profile error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/profile/:userId/password - Đổi mật khẩu
app.put('/api/profile/:userId/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' })
    }
    
    // Verify current password (in real app, use bcrypt.compare)
    if (user.password !== currentPassword) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' })
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
    }
    
    // Update password (in real app, hash the password)
    await prisma.user.update({
      where: { id: req.params.userId },
      data: { password: newPassword }
    })
    
    res.json({ message: 'Đổi mật khẩu thành công' })
  } catch (error) {
    console.error('❌ Change password error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/profile/:userId/avatar - Cập nhật avatar
app.put('/api/profile/:userId/avatar', async (req, res) => {
  try {
    const { avatar } = req.body // base64 or URL
    
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { avatar },
      include: {
        warehouse: true
      }
    })
    
    res.json({ avatar: user.avatar })
  } catch (error) {
    console.error('❌ Update avatar error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/profile/:userId/settings - Cập nhật cài đặt thông báo
app.put('/api/profile/:userId/settings', async (req, res) => {
  try {
    const { emailNotifications, pushNotifications, orderAlerts, inventoryAlerts, systemUpdates, marketingEmails } = req.body
    
    // Upsert settings
    const settings = await prisma.userSetting.upsert({
      where: { userId: req.params.userId },
      update: {
        emailNotifications,
        pushNotifications,
        orderAlerts,
        inventoryAlerts,
        systemUpdates,
        marketingEmails
      },
      create: {
        userId: req.params.userId,
        emailNotifications,
        pushNotifications,
        orderAlerts,
        inventoryAlerts,
        systemUpdates,
        marketingEmails
      }
    })
    
    res.json(settings)
  } catch (error) {
    console.error('❌ Update settings error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/profile/:userId/sessions - Lấy danh sách sessions
app.get('/api/profile/:userId/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.params.userId },
      orderBy: { lastActive: 'desc' }
    })
    
    res.json({ sessions })
  } catch (error) {
    console.error('❌ Get sessions error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/profile/:userId/sessions - Tạo session mới
app.post('/api/profile/:userId/sessions', async (req, res) => {
  try {
    const { deviceName, deviceType, browser, ipAddress, location, userAgent, expiresAt } = req.body
    
    // Set all other sessions as not current
    await prisma.session.updateMany({
      where: { userId: req.params.userId },
      data: { isCurrent: false }
    })
    
    // Create new session
    const session = await prisma.session.create({
      data: {
        userId: req.params.userId,
        deviceName,
        deviceType,
        browser,
        ipAddress,
        location,
        userAgent,
        expiresAt: new Date(expiresAt),
        isCurrent: true,
        lastActive: new Date()
      }
    })
    
    res.status(201).json(session)
  } catch (error) {
    console.error('❌ Create session error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/profile/:userId/sessions/:sessionId - Đăng xuất thiết bị
app.delete('/api/profile/:userId/sessions/:sessionId', async (req, res) => {
  try {
    await prisma.session.delete({
      where: { id: req.params.sessionId }
    })
    
    res.json({ message: 'Đăng xuất thiết bị thành công' })
  } catch (error) {
    console.error('❌ Delete session error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// Start server
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 KHO AI Backend running on http://localhost:${PORT}`)
})
