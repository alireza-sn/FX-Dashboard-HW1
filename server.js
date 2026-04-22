const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (index.html, styles.css, script.js)

// API Endpoints using Prisma

// Overview API
app.get('/api/overview', async (req, res) => {
  try {
    // Aggregating some data for overview
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leads API
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { id: 'desc' } });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { name, status, balance } = req.body;
    const newLead = await prisma.lead.create({
      data: { name, status, balance }
    });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users API
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Finances API
app.get('/api/finances', async (req, res) => {
  try {
    const finances = await prisma.finance.findMany();
    res.json(finances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alerts API
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', message: 'Database connected via Prisma' });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
