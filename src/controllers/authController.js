const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// EMERGENCY: Hard-coded secret
const JWT_SECRET = 'EMERGENCY_FIX';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    
    console.log('--- EMERGENCY LOGIN ATTEMPT ---');
    console.log('Email:', normalizedEmail);

    // EMERGENCY BYPASS: Direct check for admin credentials
    if (normalizedEmail === 'a.saeidinejad@fx.dashboard' && password === 'Password123') {
        console.log('BYPASS ACTIVATED: Admin emergency entry granted.');
        const token = jwt.sign(
            { userId: 1, email: normalizedEmail, role: 'Admin' }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        return res.json({ 
            token, 
            user: { name: 'Alireza', email: normalizedEmail, role: 'Admin' } 
        });
    }

    // Standard logic as fallback
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
    );

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const register = async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      const normalizedEmail = (email || '').toLowerCase().trim();
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: { email: normalizedEmail, password: hashedPassword, name, role: role || 'Guest' }
      });
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'User registration failed' });
    }
};

module.exports = { login, register };