const express = require('express');
const { login, register } = require('../controllers/authController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', authenticateToken, authorize(['Admin']), register);

module.exports = router;