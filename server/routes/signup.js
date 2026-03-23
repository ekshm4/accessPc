const express = require('express');
const bcrypt = require('bcrypt');
const { prisma } = require('./db');
const { registerSchema, validate } = require('../utils/validation');

const router = express.Router();

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      const field = existingUser.username === username ? 'username' : 'email';
      return res.status(409).json({ error: `User with this ${field} already exists` });
    }

    const hashpass = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashpass,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
