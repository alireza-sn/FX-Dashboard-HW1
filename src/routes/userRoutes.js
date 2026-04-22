const express = require('express');
const { getUsers } = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, authorize(['Admin']), getUsers);

module.exports = router;