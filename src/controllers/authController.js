const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Repair 1: Normalize email (lowercase) to avoid case-sensitivity issues
    const normalizedEmail = email.toLowerCase();
    
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
    
    // Repair 2: Ensure user object returned to frontend has consistent casing
    res.json({ 
        token, 
        user: { 
            name: user.name, 
            email: user.email, 
            role: user.role 
        } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const register = async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      const normalizedEmail = email.toLowerCase();
      
      const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingUser) {
          return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: { 
            email: normalizedEmail, 
            password: hashedPassword, 
            name, 
            role: role || 'Guest' 
        }
      });
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'User registration failed' });
    }
};

module.exports = { login, register };