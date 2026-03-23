const express = require('express');
const { prisma } = require('./db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    await prisma.userSession.deleteMany({
      where: { token },
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    await prisma.userSession.deleteMany({
      where: { userId: req.user.id },
    });

    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;
