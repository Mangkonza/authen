// src/routes/authenRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const { verifyToken } = require('../middlewares/authMiddleware');

// 1. Register (สไลด์หน้า 28)
router.post('/register', async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // ตรวจสอบว่า userName หรือ email ซ้ำหรือไม่
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ userName: userName }, { email: email }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Duplicate Username or Email" });
    }

    // เข้ารหัส Password
    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        userName,
        email,
        password: hashPassword,
        role: 'user', // ค่าเริ่มต้น
      },
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// 2. Login (สไลด์หน้า 32, 39)
router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    const getUser = await prisma.user.findUnique({
      where: { userName: userName },
    });

    if (!getUser) {
      return res.status(404).json({ message: "Unknown Username" });
    }

    const isMatch = await bcrypt.compare(password, getUser.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Password Incorrect" });
    }

    // ออก JWT Token โดยบรรจุ userName และ role
    const token = jwt.sign(
      { userName: getUser.userName, role: getUser.role },
      process.env.JWT_KEY,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: "Login Success",
      token: token,
      user: {
        userName: getUser.userName,
        email: getUser.email,
        role: getUser.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// 3. ตรวจสอบข้อมูลผู้ใช้ปัจจุบัน (สไลด์หน้า 42)
router.get('/home', verifyToken, async (req, res) => {
  try {
    const getUser = await prisma.user.findUnique({
      where: { userName: req.user.userName },
      select: { userName: true, email: true, role: true },
    });

    if (!getUser) {
      return res.status(404).json({ message: "User not exist" });
    }

    return res.status(200).json({ user: [getUser] });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;