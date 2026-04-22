const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Admin User
  const adminPassword = await bcrypt.hash('Password123', 10);
  const adminEmail = 'a.saeidinejad@fx.dashboard'.toLowerCase();
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'Admin' }, // Ensure role is correct if user already exists
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin User',
      role: 'Admin',
    },
  });
  console.log('Admin user successfully created/verified:', admin.email);

  // 2. Guest User
  const guestPassword = await bcrypt.hash('Guest123', 10);
  const guestEmail = 'guest@fx.dashboard'.toLowerCase();
  const guest = await prisma.user.upsert({
    where: { email: guestEmail },
    update: { role: 'Guest' },
    create: {
      email: guestEmail,
      password: guestPassword,
      name: 'Guest User',
      role: 'Guest',
    },
  });
  console.log('Guest user successfully created/verified:', guest.email);

  console.log('Seeding other dashboard data...');

  // Leads
  await prisma.lead.createMany({
    data: [
      { id: 1, name: 'James Wilson', status: 'Active', balance: '$12,400' },
      { id: 2, name: 'Sarah Chen', status: 'Pending', balance: '$0' },
      { id: 3, name: 'Michael Ross', status: 'Active', balance: '$45,200' },
      { id: 4, name: 'Elena Rodriguez', status: 'Inactive', balance: '$1,200' },
    ],
    skipDuplicates: true,
  });

  // Finances
  await prisma.finance.createMany({
    data: [
      { month: 'Jan', revenue: 45000, payout: 12000 },
      { month: 'Feb', revenue: 52000, payout: 15000 },
      { month: 'Mar', revenue: 48000, payout: 11000 },
      { month: 'Apr', revenue: 61000, payout: 18000 },
      { month: 'May', revenue: 55000, payout: 14000 },
      { month: 'Jun', revenue: 67000, payout: 21000 },
    ],
    skipDuplicates: true,
  });

  // Alerts
  await prisma.alert.createMany({
    data: [
      { time: '10:24 AM', type: 'Critical', message: 'High Volatility Detected: BTC/USD' },
      { time: '09:15 AM', type: 'Info', message: 'Pending Withdrawal Request: #8821' },
      { time: '08:42 AM', type: 'Warning', message: 'API Latency Above Threshold' },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
