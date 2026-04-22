const prisma = require('../config/db');

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true }
        });
        res.json(users);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getUsers };