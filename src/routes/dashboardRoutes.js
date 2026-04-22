const express = require('express');
const { getOverview, getFinances, getAlerts, getHealth } = require('../controllers/dashboardController');
const { authenticateToken, authorize, ALL_ROLES } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', authenticateToken, authorize(ALL_ROLES), getOverview);
router.get('/finances', authenticateToken, authorize(ALL_ROLES), getFinances);
router.get('/alerts', authenticateToken, authorize(ALL_ROLES), getAlerts);
router.get('/health', getHealth);

module.exports = router;