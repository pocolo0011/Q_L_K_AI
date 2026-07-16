// ============================================================
// KHO AI - Seed Script
// Tạo dữ liệu mẫu cho toàn bộ hệ thống
// ============================================================

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// --- Helpers: ngày tương đối so với hiện tại ---
const now = new Date()
const daysAgo = (d) => new Date(now.getTime() - d * 86400000)
const daysAhead = (d) => new Date(now.getTime() + d * 86400000)
const orderCode = (d, n) =>
  `DH${daysAgo(d).toISOString().slice(0, 10).replace(/-/g, '')}${String(n).padStart(3, '0')}`

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu cho KHO AI...\n')

  // ============================================================
  // 1. Tạo Users (Nhân viên)
  // ============================================================
  console.log('📦 Đang tạo Users...')
  const hashedPassword = await bcrypt.hash('123456', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@khoai.com' },
    update: {},
    create: {
      employeeCode: 'NV001',
      fullName: 'Nguyễn Văn A',
      email: 'admin@khoai.com',
      phone: '0901234567',
      password: hashedPassword,
      role: 'ADMIN',
      address: '123 Đường ABC, Hà Nội',
      canImport: true,
      canExport: true,
      canManageInventory: true,
      canViewReports: true,
      canManageWarehouse: true,
      canManageEmployees: true,
      canManageSuppliers: true,
      canManageProducts: true,
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@khoai.com' },
    update: {},
    create: {
      employeeCode: 'NV002',
      fullName: 'Trần Thị B',
      email: 'manager@khoai.com',
      phone: '0912345678',
      password: hashedPassword,
      role: 'MANAGER',
      canImport: true,
      canExport: true,
      canManageInventory: true,
      canViewReports: true,
      canManageWarehouse: true,
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: 'staff@khoai.com' },
    update: {},
    create: {
      employeeCode: 'NV003',
      fullName: 'Lê Văn C',
      email: 'staff@khoai.com',
      phone: '0923456789',
      password: hashedPassword,
      role: 'STAFF',
      canImport: true,
      canExport: true,
      canManageInventory: true,
    },
  })

  const storekeeper = await prisma.user.upsert({
    where: { email: 'storekeeper@khoai.com' },
    update: {},
    create: {
      employeeCode: 'NV004',
      fullName: 'Phạm Thị D',
      email: 'storekeeper@khoai.com',
      phone: '0934567890',
      password: hashedPassword,
      role: 'STOREKEEPER',
      canImport: true,
      canExport: true,
      canManageInventory: true,
      canViewReports: true,
    },
  })

  console.log(`   ✅ Đã tạo 4 users (admin/manager/staff/storekeeper)`)

  // ============================================================
  // 2. Tạo Products (Sản phẩm)
  // ============================================================
  console.log('\n📦 Đang tạo Products...')

  const productsData = [
    { code: 'SP001', nameVi: 'iPhone 15 Pro Max 256GB', category: 'Điện tử', unit: 'Cái', costPrice: 22000000, sellingPrice: 25000000, barcode: '8901234567890', minStock: 10 },
    { code: 'SP002', nameVi: 'Samsung Galaxy S24 Ultra', category: 'Điện tử', unit: 'Cái', costPrice: 19000000, sellingPrice: 22000000, barcode: '8901234567891', minStock: 10 },
    { code: 'SP003', nameVi: 'MacBook Air M2', category: 'Điện tử', unit: 'Cái', costPrice: 25000000, sellingPrice: 28000000, barcode: '8901234567892', minStock: 5 },
    { code: 'SP004', nameVi: 'Sữa tươi Vinamilk 1L', category: 'Thực phẩm', unit: 'Hộp', costPrice: 28000, sellingPrice: 35000, barcode: '8901234567893', minStock: 50, lotTracking: true, defaultExpiry: 180 },
    { code: 'SP005', nameVi: 'Gạo ST25 5kg', category: 'Thực phẩm', unit: 'Túi', costPrice: 150000, sellingPrice: 180000, barcode: '8901234567894', minStock: 30 },
    { code: 'SP006', nameVi: 'Dầu gội Head & Shoulders', category: 'Mỹ phẩm', unit: 'Chai', costPrice: 65000, sellingPrice: 85000, barcode: '8901234567895', minStock: 20 },
    { code: 'SP007', nameVi: 'iPad Pro 12.9"', category: 'Điện tử', unit: 'Cái', costPrice: 28000000, sellingPrice: 32000000, barcode: '8901234567896', minStock: 5 },
    { code: 'SP008', nameVi: 'AirPods Pro 2', category: 'Điện tử', unit: 'Cái', costPrice: 5500000, sellingPrice: 6500000, barcode: '8901234567897', minStock: 15 },
    { code: 'SP009', nameVi: 'Apple Watch Ultra 2', category: 'Điện tử', unit: 'Cái', costPrice: 18000000, sellingPrice: 22000000, barcode: '8901234567898', minStock: 5 },
    { code: 'SP010', nameVi: 'Nước ngọt Coca-Cola 1.5L', category: 'Thực phẩm', unit: 'Chai', costPrice: 12000, sellingPrice: 15000, barcode: '8901234567899', minStock: 100, lotTracking: true, defaultExpiry: 365 },
    { code: 'SP011', nameVi: 'Kem chống nắng Anessa', category: 'Mỹ phẩm', unit: 'Tuýp', costPrice: 250000, sellingPrice: 350000, barcode: '8901234567900', minStock: 10, lotTracking: true, defaultExpiry: 730 },
    { code: 'SP012', nameVi: 'Bánh snack Poca vị BBQ', category: 'Thực phẩm', unit: 'Gói', costPrice: 8000, sellingPrice: 12000, barcode: '8901234567901', minStock: 200, lotTracking: true, defaultExpiry: 365 },
  ]

  const products = []
  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    })
    products.push(product)
  }
  console.log(`   ✅ Đã tạo ${products.length} sản phẩm`)

  // ============================================================
  // 3. Tạo Warehouses (Kho)
  // ============================================================
  console.log('\n📦 Đang tạo Warehouses...')

  const warehousesData = [
    { code: 'KH', name: 'Kho Hà Nội', address: '123 Đường ABC, Quận Hoàn Kiếm, Hà Nội', capacity: 10000 },
    { code: 'HCM', name: 'Kho TP.HCM', address: '456 Đường XYZ, Quận 7, TP.HCM', capacity: 15000 },
    { code: 'DN', name: 'Kho Đà Nẵng', address: '789 Đường DEF, Quận Hải Châu, Đà Nẵng', capacity: 8000 },
  ]

  const warehouses = []
  for (const w of warehousesData) {
    const warehouse = await prisma.warehouse.upsert({
      where: { code: w.code },
      update: {},
      create: w,
    })
    warehouses.push(warehouse)
  }
  console.log(`   ✅ Đã tạo ${warehouses.length} kho`)

  // ============================================================
  // 4. Tạo BinLocations (Cấu trúc cây cho Kho Hà Nội)
  // ============================================================
  console.log('\n📦 Đang tạo BinLocations...')

  const hanoiWarehouse = warehouses[0]
  const rows = ['A', 'B', 'C']
  const shelvesPerRow = 2
  const binsPerShelf = 4

  let binCount = 0
  for (const rowLabel of rows) {
    const row = await prisma.binLocation.create({
      data: {
        code: `ROW-${rowLabel}`,
        name: `Dãy ${rowLabel}`,
        type: 'ROW',
        capacity: 0,
        status: 'EMPTY',
        warehouseId: hanoiWarehouse.id,
      },
    })

    for (let s = 1; s <= shelvesPerRow; s++) {
      const shelfLabel = `${rowLabel}-${String(s).padStart(2, '0')}`
      const shelf = await prisma.binLocation.create({
        data: {
          code: `SHELF-${shelfLabel}`,
          name: `Kệ ${shelfLabel}`,
          type: 'SHELF',
          capacity: 0,
          status: 'EMPTY',
          warehouseId: hanoiWarehouse.id,
          parentId: row.id,
        },
      })

      for (let b = 1; b <= binsPerShelf; b++) {
        const binLabel = `${shelfLabel}-${String(b).padStart(2, '0')}`
        await prisma.binLocation.create({
          data: {
            code: `BIN-${binLabel}`,
            name: `Ô ${binLabel}`,
            type: 'BIN',
            capacity: 50,
            status: 'EMPTY',
            warehouseId: hanoiWarehouse.id,
            parentId: shelf.id,
          },
        })
        binCount++
      }
    }
  }
  console.log(`   ✅ Đã tạo ${rows.length} dãy, ${rows.length * shelvesPerRow} kệ, ${binCount} ô`)

  // ============================================================
  // 5. Tạo Inventory (Tồn kho)
  // ============================================================
  console.log('\n📦 Đang tạo Inventory...')

  const bins = await prisma.binLocation.findMany({
    where: { type: 'BIN', warehouseId: hanoiWarehouse.id },
    take: 9,
  })

  const inventoryItems = [
    { productCode: 'SP001', binId: bins[0].id, stock: 45, expiryDate: null, lot: null },
    { productCode: 'SP002', binId: bins[1].id, stock: 8, expiryDate: null, lot: null },
    { productCode: 'SP003', binId: bins[2].id, stock: 15, expiryDate: null, lot: null },
    { productCode: 'SP004', binId: bins[3].id, stock: 120, expiryDate: daysAhead(2), lot: 'LOT001' },
    { productCode: 'SP005', binId: bins[4].id, stock: 200, expiryDate: null, lot: null },
    { productCode: 'SP006', binId: bins[5].id, stock: 25, expiryDate: null, lot: null },
    { productCode: 'SP010', binId: bins[6].id, stock: 30, expiryDate: daysAhead(5), lot: 'LOT010' },
    { productCode: 'SP011', binId: bins[7].id, stock: 12, expiryDate: daysAhead(10), lot: 'LOT011' },
    { productCode: 'SP012', binId: bins[8].id, stock: 60, expiryDate: daysAhead(15), lot: 'LOT012' },
  ]

  for (const item of inventoryItems) {
    const product = products.find((p) => p.code === item.productCode)
    if (product) {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          binLocationId: item.binId,
          quantity: item.stock,
          availableStock: item.stock,
          reservedStock: 0,
          expiryDate: item.expiryDate,
          lotNumber: item.lot,
        },
      })

      const usagePercent = item.stock / 50
      const binStatus = usagePercent >= 1 ? 'FULL' : 'IN_USE'
      await prisma.binLocation.update({
        where: { id: item.binId },
        data: { status: binStatus },
      })
    }
  }
  console.log(`   ✅ Đã tạo ${inventoryItems.length} bản ghi tồn kho`)

  // ============================================================
  // 6. Tạo Suppliers (Nhà cung cấp)
  // ============================================================
  console.log('\n📦 Đang tạo Suppliers...')

  const suppliersData = [
    { code: 'NCC001', name: 'Apple Vietnam', contactPerson: 'Nguyễn Văn A', phone: '19001234', email: 'contact@apple.com.vn', address: 'Tầng 10, Landmark 81, Hà Nội', note: 'Nhà cung cấp chính thức Apple', deliveryCount: 45, totalValue: 2500000000 },
    { code: 'NCC002', name: 'Samsung Electronics', contactPerson: 'Trần Thị B', phone: '19005678', email: 'info@samsung.com', address: 'Quận 7, TP.HCM', note: 'Đối tác chiến lược', deliveryCount: 38, totalValue: 1800000000 },
    { code: 'NCC003', name: 'Vinamilk Corp', contactPerson: 'Lê Văn C', phone: '18001234', email: 'contact@vinamilk.com.vn', address: 'TP.HCM', note: 'Cung cấp sản phẩm thực phẩm', deliveryCount: 120, totalValue: 850000000 },
    { code: 'NCC004', name: 'Unilever Vietnam', contactPerson: 'Phạm Thị D', phone: '19009876', email: 'info@unilever.com', address: 'Hà Nội', note: 'Cung cấp mỹ phẩm', deliveryCount: 89, totalValue: 650000000, status: false },
    { code: 'NCC005', name: 'Nestle Vietnam', contactPerson: 'Hoàng Văn E', phone: '18005678', email: 'contact@nestle.com', address: 'Đà Nẵng', note: 'Nhà cung cấp thực phẩm', deliveryCount: 67, totalValue: 420000000 },
  ]

  for (const s of suppliersData) {
    await prisma.supplier.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    })
  }
  console.log(`   ✅ Đã tạo ${suppliersData.length} nhà cung cấp`)

  // ============================================================
  // 7. Tạo Orders + OrderItems (Đơn hàng)
  // ============================================================
  console.log('\n📦 Đang tạo Orders...')

  const ordersData = [
    { daysAgo: 0, customer: 'Nguyễn Văn A', phone: '0901234567', address: '123 Đường ABC, Quận Hoàn Kiếm, Hà Nội', status: 'PENDING', items: [{ code: 'SP001', qty: 1 }, { code: 'SP008', qty: 2 }] },
    { daysAgo: 0, customer: 'Mai Thị F', phone: '0956789012', address: '147 Đường MNO, Hà Nội', status: 'PENDING', items: [{ code: 'SP001', qty: 2 }, { code: 'SP008', qty: 1 }, { code: 'SP011', qty: 1 }] },
    { daysAgo: 0, customer: 'Vũ Văn G', phone: '0967890123', address: '258 Đường PQR, TP.HCM', status: 'PENDING', items: [{ code: 'SP002', qty: 1 }, { code: 'SP007', qty: 1 }] },
    { daysAgo: 1, customer: 'Trần Thị B', phone: '0912345678', address: '456 Đường XYZ, Quận 7, TP.HCM', status: 'CONFIRMED', items: [{ code: 'SP002', qty: 1 }, { code: 'SP006', qty: 3 }] },
    { daysAgo: 2, customer: 'Lê Văn C', phone: '0923456789', address: '789 Đường DEF, Hải Châu, Đà Nẵng', status: 'DELIVERING', items: [{ code: 'SP003', qty: 1 }] },
    { daysAgo: 5, customer: 'Phạm Thị D', phone: '0934567890', address: '321 Đường GHI, Hà Nội', status: 'COMPLETED', items: [{ code: 'SP007', qty: 1 }, { code: 'SP009', qty: 1 }] },
    { daysAgo: 8, customer: 'Hoàng Văn E', phone: '0945678901', address: '654 Đường JKL, Hà Nội', status: 'CANCELLED', items: [{ code: 'SP009', qty: 1 }] },
    { daysAgo: 12, customer: 'Ngô Thị H', phone: '0978901234', address: '852 Đường STU, Hà Nội', status: 'COMPLETED', items: [{ code: 'SP004', qty: 10 }, { code: 'SP005', qty: 5 }] },
    { daysAgo: 20, customer: 'Đỗ Văn I', phone: '0989012345', address: '963 Đường VWX, TP.HCM', status: 'COMPLETED', items: [{ code: 'SP008', qty: 3 }, { code: 'SP010', qty: 20 }] },
  ]

  for (const orderData of ordersData) {
    let totalAmount = 0
    const items = []
    for (const item of orderData.items) {
      const product = products.find((p) => p.code === item.code)
      if (product) {
        const subtotal = product.sellingPrice * item.qty
        totalAmount += subtotal
        items.push({
          productId: product.id,
          quantity: item.qty,
          unitPrice: product.sellingPrice,
        })
      }
    }

    await prisma.order.create({
      data: {
        orderCode: orderCode(orderData.daysAgo, ordersData.indexOf(orderData) + 1),
        customerName: orderData.customer,
        customerPhone: orderData.phone,
        customerAddress: orderData.address,
        status: orderData.status,
        totalAmount,
        createdAt: daysAgo(orderData.daysAgo),
        items: { create: items },
      },
    })
  }
  console.log(`   ✅ Đã tạo ${ordersData.length} đơn hàng`)

  // ============================================================
  // 8. Tạo StockReceipts (Phiếu nhập kho mẫu)
  // ============================================================
  console.log('\n📦 Đang tạo StockReceipts...')

  await prisma.stockReceipt.create({
    data: {
      receiptCode: 'NK-20260714-001',
      type: 'IMPORT',
      status: 'CONFIRMED',
      totalQuantity: 60,
      totalAmount: 320000000,
      notes: 'Nhập kho đợt 1 tháng 7',
      createdById: admin.id,
      details: {
        create: [
          { productId: products[0].id, quantity: 40, unitPrice: 22000000, subtotal: 880000000, location: 'A-01-01', lotNumber: 'LOT20240701' },
          { productId: products[7].id, quantity: 50, unitPrice: 5500000, subtotal: 275000000, location: 'A-01-02', lotNumber: 'LOT20240702' },
        ],
      },
    },
  })

  await prisma.stockReceipt.create({
    data: {
      receiptCode: 'NK-20260713-001',
      type: 'IMPORT',
      status: 'CONFIRMED',
      totalQuantity: 100,
      totalAmount: 18000000,
      notes: 'Nhập thực phẩm',
      createdById: manager.id,
      details: {
        create: [
          { productId: products[3].id, quantity: 200, unitPrice: 28000, subtotal: 5600000, location: 'A-01-03', lotNumber: 'LOT20240703' },
          { productId: products[4].id, quantity: 100, unitPrice: 150000, subtotal: 15000000, location: 'A-01-04' },
        ],
      },
    },
  })

  console.log(`   ✅ Đã tạo 2 phiếu nhập kho`)

  // ============================================================
  // 9. Tạo Notifications (Thông báo)
  // ============================================================
  console.log('\n📦 Đang tạo Notifications...')

  const notificationsData = [
    { type: 'INVENTORY', title: 'Cảnh báo tồn kho thấp', content: 'Sản phẩm Samsung Galaxy S24 Ultra sắp hết hàng (còn 8 sản phẩm)', userId: admin.id },
    { type: 'ORDER', title: 'Đơn hàng mới', content: 'Đơn hàng mới từ Mai Thị F', userId: admin.id },
    { type: 'EXPIRY', title: 'Sản phẩm sắp hết hạn', content: 'Sữa tươi Vinamilk LOT001 sẽ hết hạn trong 2 ngày', userId: admin.id },
    { type: 'SYSTEM', title: 'Bảo trì hệ thống', content: 'Hệ thống sẽ bảo trì vào 23:00. Thời gian dự kiến: 30 phút', userId: admin.id, isRead: true },
    { type: 'IMPORT', title: 'Nhập kho thành công', content: 'Đã nhập 60 sản phẩm iPhone 15 Pro Max vào Kho Hà Nội', userId: admin.id, isRead: true },
    { type: 'ORDER', title: 'Đơn hàng đã giao', content: 'Đơn hàng đã giao thành công', userId: admin.id, isRead: true },
    { type: 'INVENTORY', title: 'Cảnh báo tồn kho thấp', content: 'Dầu gội Head & Shoulders sắp hết hàng (còn 25 sản phẩm)', userId: manager.id },
    { type: 'ORDER', title: 'Đơn hàng mới', content: 'Đơn hàng mới từ Vũ Văn G', userId: manager.id },
  ]

  for (const notif of notificationsData) {
    await prisma.notification.create({ data: notif })
  }
  console.log(`   ✅ Đã tạo ${notificationsData.length} thông báo`)

  console.log('\n🎉 Seed dữ liệu hoàn tất!')
  console.log('\n📋 Tài khoản đăng nhập mẫu:')
  console.log('   Admin:       admin@khoai.com / 123456')
  console.log('   Manager:     manager@khoai.com / 123456')
  console.log('   Staff:       staff@khoai.com / 123456')
  console.log('   Storekeeper: storekeeper@khoai.com / 123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Lỗi seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })