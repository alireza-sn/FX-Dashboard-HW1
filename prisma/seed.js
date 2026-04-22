const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING SAMPLE LEADS ---');

  // Ensure Admin User Exists
  const adminPassword = await bcrypt.hash('Password123', 10);
  const adminEmail = 'A.saeidinejad@fx.dashboard'.toLowerCase();
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, role: 'Admin' },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Alireza',
      role: 'Admin',
    },
  });

  // Seed 5 Sample Leads
  const sampleLeads = [
    { name: 'James Wilson', status: 'Active', balance: '$12,400' },
    { name: 'Sarah Chen', status: 'Pending', balance: '$0' },
    { name: 'Michael Ross', status: 'Active', balance: '$45,200' },
    { name: 'Elena Rodriguez', status: 'Inactive', balance: '$1,200' },
    { name: 'David Smith', status: 'Active', balance: '$8,900' }
  ];

  for (const lead of sampleLeads) {
    await prisma.lead.create({ data: lead });
  }

  console.log('Successfully seeded 5 sample leads.');

  // Seed Finances
  await prisma.finance.createMany({
    data: [
      { month: 'Jan', revenue: 45000, payout: 12000 },
      { month: 'Feb', revenue: 52000, payout: 15000 },
      { month: 'Mar', revenue: 48000, payout: 11000 },
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
