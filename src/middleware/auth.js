const jwt = require('jsonwebtoken');

// EMERGENCY: Hard-coded secret
const JWT_SECRET = 'EMERGENCY_FIX';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.role;
        const hasPermission = roles.some(role => 
            role.toLowerCase() === (userRole || '').toLowerCase()
        );

        if (!hasPermission) return res.status(403).json({ error: 'Forbidden' });
        next();
    };
};

const ALL_ROLES = ['Admin', 'Agent', 'Guest'];

module.exports = { authenticateToken, authorize, ALL_ROLES };