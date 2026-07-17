// ============================================================
// KHO AI - Database Seed
// Tạo dữ liệu mẫu cho Warehouse, Zone, Shelf, Bin
// ============================================================

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...\n')

  // Tạo Warehouse mặc định
  const warehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-HN' },
    update: {},
    create: {
      code: 'WH-HN',
      name: 'Kho Hà Nội',
      address: 'Hà Nội, Việt Nam',
      capacity: 1000,
      status: true,
    },
  })
  console.log('✅ Tạo Warehouse:', warehouse.name)

  // Tạo Zones
  const zoneA = await prisma.zone.upsert({
    where: { code: 'A' },
    update: {},
    create: {
      code: 'A',
      name: 'Dãy A',
      description: 'Dãy chứa sản phẩm điện tử',
      warehouseId: warehouse.id,
    },
  })
  console.log('✅ Tạo Zone:', zoneA.name)

  const zoneB = await prisma.zone.upsert({
    where: { code: 'B' },
    update: {},
    create: {
      code: 'B',
      name: 'Dãy B',
      description: 'Dãy chứa sản phẩm gia dụng',
      warehouseId: warehouse.id,
    },
  })
  console.log('✅ Tạo Zone:', zoneB.name)

  // Tạo Shelves cho Zone A
  const shelfA01 = await prisma.shelf.upsert({
    where: { code: 'A-01' },
    update: {},
    create: {
      code: 'A-01',
      name: 'Kệ A-01',
      capacity: 10,
      description: 'Kệ chứa iPhone và Samsung',
      zoneId: zoneA.id,
    },
  })
  console.log('✅ Tạo Shelf:', shelfA01.name)

  const shelfA02 = await prisma.shelf.upsert({
    where: { code: 'A-02' },
    update: {},
    create: {
      code: 'A-02',
      name: 'Kệ A-02',
      capacity: 10,
      description: 'Kệ chứa iPad và AirPods',
      zoneId: zoneA.id,
    },
  })
  console.log('✅ Tạo Shelf:', shelfA02.name)

  // Tạo Shelves cho Zone B
  const shelfB01 = await prisma.shelf.upsert({
    where: { code: 'B-01' },
    update: {},
    create: {
      code: 'B-01',
      name: 'Kệ B-01',
      capacity: 10,
      description: 'Kệ chứa Apple Watch và phụ kiện',
      zoneId: zoneB.id,
    },
  })
  console.log('✅ Tạo Shelf:', shelfB01.name)

  // Tạo Bins cho Shelf A-01
  const binsA01 = []
  for (let i = 1; i <= 10; i++) {
    const binCode = `A-01-${String(i).padStart(2, '0')}`
    const bin = await prisma.bin.upsert({
      where: { code: binCode },
      update: {},
      create: {
        code: binCode,
        name: `Ô ${binCode}`,
        capacity: 100,
        status: 'EMPTY',
        shelfId: shelfA01.id,
      },
    })
    binsA01.push(bin)
  }
  console.log(`✅ Tạo ${binsA01.length} bins cho ${shelfA01.name}`)

  // Tạo Bins cho Shelf A-02
  const binsA02 = []
  for (let i = 1; i <= 10; i++) {
    const binCode = `A-02-${String(i).padStart(2, '0')}`
    const bin = await prisma.bin.upsert({
      where: { code: binCode },
      update: {},
      create: {
        code: binCode,
        name: `Ô ${binCode}`,
        capacity: 100,
        status: 'EMPTY',
        shelfId: shelfA02.id,
      },
    })
    binsA02.push(bin)
  }
  console.log(`✅ Tạo ${binsA02.length} bins cho ${shelfA02.name}`)

  // Tạo Bins cho Shelf B-01
  const binsB01 = []
  for (let i = 1; i <= 10; i++) {
    const binCode = `B-01-${String(i).padStart(2, '0')}`
    const bin = await prisma.bin.upsert({
      where: { code: binCode },
      update: {},
      create: {
        code: binCode,
        name: `Ô ${binCode}`,
        capacity: 100,
        status: 'EMPTY',
        shelfId: shelfB01.id,
      },
    })
    binsB01.push(bin)
  }
  console.log(`✅ Tạo ${binsB01.length} bins cho ${shelfB01.name}`)

  // Cập nhật một số bins với dữ liệu mẫu
  await prisma.bin.update({
    where: { code: 'A-01-01' },
    data: {
      productId: 'SP001',
      soLuong: 45,
      status: 'IN_USE',
    },
  })
  console.log('✅ Cập nhật Bin A-01-01 với sản phẩm SP001 (45/100)')

  await prisma.bin.update({
    where: { code: 'A-01-02' },
    data: {
      productId: 'SP002',
      soLuong: 20,
      status: 'IN_USE',
    },
  })
  console.log('✅ Cập nhật Bin A-01-02 với sản phẩm SP002 (20/100)')

  await prisma.bin.update({
    where: { code: 'A-01-04' },
    data: {
      productId: 'SP003',
      soLuong: 95,
      status: 'FULL',
    },
  })
  console.log('✅ Cập nhật Bin A-01-04 với sản phẩm SP003 (95/100) - Gần đầy')

  await prisma.bin.update({
    where: { code: 'A-02-01' },
    data: {
      productId: 'SP004',
      soLuong: 15,
      status: 'IN_USE',
    },
  })
  console.log('✅ Cập nhật Bin A-02-01 với sản phẩm SP004 (15/100)')

  await prisma.bin.update({
    where: { code: 'A-02-03' },
    data: {
      productId: 'SP005',
      soLuong: 30,
      status: 'IN_USE',
    },
  })
  console.log('✅ Cập nhật Bin A-02-03 với sản phẩm SP005 (30/100)')

  await prisma.bin.update({
    where: { code: 'B-01-01' },
    data: {
      productId: 'SP006',
      soLuong: 100,
      status: 'FULL',
    },
  })
  console.log('✅ Cập nhật Bin B-01-01 với sản phẩm SP006 (100/100) - Đầy')

  await prisma.bin.update({
    where: { code: 'B-01-02' },
    data: {
      productId: 'SP007',
      soLuong: 25,
      status: 'IN_USE',
    },
  })
  console.log('✅ Cập nhật Bin B-01-02 với sản phẩm SP007 (25/100)')

  // ============================================================
  // TẠO THÊM KHO HẢI PHÒNG
  // ============================================================
  const warehouseHP = await prisma.warehouse.upsert({
    where: { code: 'WH-HP' },
    update: {},
    create: {
      code: 'WH-HP',
      name: 'Kho Hải Phòng',
      address: 'Hải Phòng, Việt Nam',
      capacity: 500,
      status: true,
    },
  })
  console.log('✅ Tạo Warehouse:', warehouseHP.name)

  const zoneA_HP = await prisma.zone.upsert({
    where: { code: 'A-HP' },
    update: {},
    create: {
      code: 'A-HP',
      name: 'Dãy A',
      description: 'Dãy chứa sản phẩm điện tử Hải Phòng',
      warehouseId: warehouseHP.id,
    },
  })
  console.log('✅ Tạo Zone:', zoneA_HP.name)

  const shelfA01_HP = await prisma.shelf.upsert({
    where: { code: 'A-HP-01' },
    update: {},
    create: {
      code: 'A-HP-01',
      name: 'Kệ A-01',
      capacity: 10,
      description: 'Kệ chứa sản phẩm Hải Phòng',
      zoneId: zoneA_HP.id,
    },
  })
  console.log('✅ Tạo Shelf:', shelfA01_HP.name)

  // Tạo bins cho Hải Phòng
  for (let i = 1; i <= 10; i++) {
    const binCode = `A-HP-01-${String(i).padStart(2, '0')}`
    await prisma.bin.upsert({
      where: { code: binCode },
      update: {},
      create: {
        code: binCode,
        name: `Ô ${binCode}`,
        capacity: 100,
        status: 'EMPTY',
        shelfId: shelfA01_HP.id,
      },
    })
  }
  console.log(`✅ Tạo 10 bins cho ${shelfA01_HP.name}`)

  // Thêm sản phẩm mẫu cho Hải Phòng
  await prisma.bin.update({
    where: { code: 'A-HP-01-01' },
    data: {
      productId: 'SP008',
      soLuong: 60,
      status: 'IN_USE',
    },
  })
  console.log('✅ Cập nhật Bin A-HP-01-01 với sản phẩm SP008 (60/100)')

  // ============================================================
  // TẠO THÊM KHO CÀ MAU
  // ============================================================
  const warehouseCM = await prisma.warehouse.upsert({
    where: { code: 'WH-CM' },
    update: {},
    create: {
      code: 'WH-CM',
      name: 'Kho Cà Mau',
      address: 'Cà Mau, Việt Nam',
      capacity: 300,
      status: true,
    },
  })
  console.log('✅ Tạo Warehouse:', warehouseCM.name)

  const zoneA_CM = await prisma.zone.upsert({
    where: { code: 'A-CM' },
    update: {},
    create: {
      code: 'A-CM',
      name: 'Dãy A',
      description: 'Dãy chứa sản phẩm nông sản Cà Mau',
      warehouseId: warehouseCM.id,
    },
  })
  console.log('✅ Tạo Zone:', zoneA_CM.name)

  const shelfA01_CM = await prisma.shelf.upsert({
    where: { code: 'A-CM-01' },
    update: {},
    create: {
      code: 'A-CM-01',
      name: 'Kệ A-01',
      capacity: 10,
      description: 'Kệ chứa nông sản',
      zoneId: zoneA_CM.id,
    },
  })
  console.log('✅ Tạo Shelf:', shelfA01_CM.name)

  // Tạo bins cho Cà Mau
  for (let i = 1; i <= 10; i++) {
    const binCode = `A-CM-01-${String(i).padStart(2, '0')}`
    await prisma.bin.upsert({
      where: { code: binCode },
      update: {},
      create: {
        code: binCode,
        name: `Ô ${binCode}`,
        capacity: 100,
        status: 'EMPTY',
        shelfId: shelfA01_CM.id,
      },
    })
  }
  console.log(`✅ Tạo 10 bins cho ${shelfA01_CM.name}`)

  // Thêm sản phẩm mẫu cho Cà Mau
  await prisma.bin.update({
    where: { code: 'A-CM-01-01' },
    data: {
      productId: 'SP009',
      soLuong: 80,
      status: 'IN_USE',
    },
  })
  console.log('✅ Cập nhật Bin A-CM-01-01 với sản phẩm SP009 (80/100)')

  // ============================================================
  // TẠO NHÂN VIÊN MẪU
  // ============================================================
  const admin = await prisma.user.upsert({
    where: { employeeCode: 'NV001' },
    update: {},
    create: {
      employeeCode: 'NV001',
      fullName: 'Nguyễn Văn Admin',
      email: 'admin@example.com',
      phone: '0901234567',
      password: '123456',
      role: 'ADMIN',
      status: 'ACTIVE',
      warehouseId: warehouse.id,
      address: 'Hà Nội',
      gender: 'male',
    },
  })
  console.log('✅ Tạo Nhân viên:', admin.fullName, '-', admin.employeeCode)

  const managerHN = await prisma.user.upsert({
    where: { employeeCode: 'NV002' },
    update: {},
    create: {
      employeeCode: 'NV002',
      fullName: 'Trần Thị Quản lý',
      email: 'manager.hn@example.com',
      phone: '0901234568',
      password: '123456',
      role: 'MANAGER',
      status: 'ACTIVE',
      warehouseId: warehouse.id,
      address: 'Hà Nội',
      gender: 'female',
    },
  })
  console.log('✅ Tạo Nhân viên:', managerHN.fullName, '-', managerHN.employeeCode)

  const staffHN = await prisma.user.upsert({
    where: { employeeCode: 'NV003' },
    update: {},
    create: {
      employeeCode: 'NV003',
      fullName: 'Lê Văn Nhân viên',
      email: 'staff.hn@example.com',
      phone: '0901234569',
      password: '123456',
      role: 'STAFF',
      status: 'ACTIVE',
      warehouseId: warehouse.id,
      address: 'Hà Nội',
      gender: 'male',
    },
  })
  console.log('✅ Tạo Nhân viên:', staffHN.fullName, '-', staffHN.employeeCode)

  const storekeeperHN = await prisma.user.upsert({
    where: { employeeCode: 'NV004' },
    update: {},
    create: {
      employeeCode: 'NV004',
      fullName: 'Phạm Thị Thủ kho',
      email: 'storekeeper.hn@example.com',
      phone: '0901234570',
      password: '123456',
      role: 'STOREKEEPER',
      status: 'ACTIVE',
      warehouseId: warehouse.id,
      address: 'Hà Nội',
      gender: 'female',
    },
  })
  console.log('✅ Tạo Nhân viên:', storekeeperHN.fullName, '-', storekeeperHN.employeeCode)

  const managerHP = await prisma.user.upsert({
    where: { employeeCode: 'NV005' },
    update: {},
    create: {
      employeeCode: 'NV005',
      fullName: 'Hoàng Văn Quản lý HP',
      email: 'manager.hp@example.com',
      phone: '0901234571',
      password: '123456',
      role: 'MANAGER',
      status: 'ACTIVE',
      warehouseId: warehouseHP.id,
      address: 'Hải Phòng',
      gender: 'male',
    },
  })
  console.log('✅ Tạo Nhân viên:', managerHP.fullName, '-', managerHP.employeeCode)

  const inactiveStaff = await prisma.user.upsert({
    where: { employeeCode: 'NV006' },
    update: {},
    create: {
      employeeCode: 'NV006',
      fullName: 'Nguyễn Thị Đã nghỉ',
      email: 'inactive@example.com',
      phone: '0901234572',
      password: '123456',
      role: 'STAFF',
      status: 'INACTIVE',
      warehouseId: warehouse.id,
      address: 'Hà Nội',
      gender: 'female',
    },
  })
  console.log('✅ Tạo Nhân viên:', inactiveStaff.fullName, '-', inactiveStaff.employeeCode, '(Đã nghỉ)')

  console.log('\n🎉 Seed dữ liệu hoàn tất!')
  console.log('\n📊 Tóm tắt:')
  console.log(`   - 3 Warehouses: Kho Hà Nội, Kho Hải Phòng, Kho Cà Mau`)
  console.log(`   - 6 Zones (2 zones mỗi kho)`)
  console.log(`   - 6 Shelves (2 shelves mỗi kho)`)
  console.log(`   - 60 Bins (10 bins mỗi kệ)`)
  console.log(`   - 9 Bins có sản phẩm mẫu`)
  console.log(`   - 6 Nhân viên mẫu (1 Admin, 2 Managers, 2 Staff, 1 Storekeeper)`)
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })