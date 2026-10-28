// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const { verifyToken } = require('../middlewares/authMiddleware');

// ดึงรายชื่อ User ทั้งหมด
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { userName: true, email: true, role: true },
      orderBy: { userName: 'asc' },
    });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Admin อัปเดต Role ของ User
router.put('/:userName/role', verifyToken, async (req, res) => {
  try {
    const { userName } = req.params;
    const { role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { userName: userName },
      data: { role: role },
    });

    return res.status(200).json({ message: "Role updated", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update role" });
  }
});

module.exports = router;