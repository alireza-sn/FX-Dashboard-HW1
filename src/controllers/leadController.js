const prisma = require('../config/db');

const getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { id: 'desc' } });
    res.json(leads);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createLead = async (req, res) => {
  try {
    const { name, status, balance } = req.body;
    const newLead = await prisma.lead.create({ data: { name, status, balance } });
    res.status(201).json(newLead);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getLeads, createLead };