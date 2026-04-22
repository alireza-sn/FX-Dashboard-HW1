const prisma = require('../config/db');

const getOverview = async (req, res) => {
  try {
    const leadsCount = await prisma.lead.count();
    res.json({
      leads: leadsCount,
      conversion: '18.5%',
      payouts: '$128,450',
      trends: [
          { pair: 'EUR/USD', price: '1.0942', change: '+0.04%', up: true },
          { pair: 'GBP/USD', price: '1.2681', change: '-0.12%', up: false },
          { pair: 'BTC/USD', price: '64,210', change: '+2.41%', up: true }
      ],
      systemHealth: [98, 99, 97, 98, 99, 100, 99, 98, 97, 99, 100, 98],
      marketSignals: [45, 52, 48, 61, 55, 67, 72, 65, 58, 63, 70, 75]
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getFinances = async (req, res) => {
  try {
    const finances = await prisma.finance.findMany();
    res.json(finances);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAlerts = async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany();
    res.json(alerts);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getHealth = async (req, res) => {
  res.json({ status: 'OK', message: 'RBAC Active, Services Running' });
};

module.exports = { getOverview, getFinances, getAlerts, getHealth };