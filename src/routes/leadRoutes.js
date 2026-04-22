const express = require('express');
const { getLeads, createLead } = require('../controllers/leadController');
const { authenticateToken, authorize, ALL_ROLES } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, authorize(ALL_ROLES), getLeads);
router.post('/', authenticateToken, authorize(['Admin', 'Agent']), createLead);

module.exports = router;