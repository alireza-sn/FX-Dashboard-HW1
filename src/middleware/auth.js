const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        // Repair 3: Case-insensitive role comparison and robust check
        const userRole = req.user && req.user.role;
        const hasPermission = roles.some(role => 
            role.toLowerCase() === (userRole || '').toLowerCase()
        );

        if (!hasPermission) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

const ALL_ROLES = ['Admin', 'Agent', 'Guest'];

module.exports = { authenticateToken, authorize, ALL_ROLES };