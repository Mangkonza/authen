// src/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const { verifyToken } = require('../middlewares/authMiddleware');

// 1. ดึงเมนูทั้งหมดพร้อมคะแนนเฉลี่ย (⭐ avgScore)
router.get('/', async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        ratings: true,
      },
    });

    // คำนวณคะแนนเฉลี่ยของแต่ละเมนู
    const formattedMenus = menus.map((m) => {
      const total = m.ratings.reduce((acc, curr) => acc + curr.score, 0);
      const avg = m.ratings.length > 0 ? (total / m.ratings.length).toFixed(1) : "0.0";
      return {
        menuId: m.menuId,
        name: m.name,
        price: Number(m.price),
        isBestSeller: m.isBestSeller,
        rating: avg,
      };
    });

    res.status(200).json(formattedMenus);
  } catch (err) {
    res.status(500).json({ message: "Error fetching menus" });
  }
});

// 2. เพิ่มเมนูใหม่ (Admin)
router.post('/', async (req, res) => {
  try {
    const { name, price, isBestSeller, typeId } = req.body;
    const newMenu = await prisma.menu.create({
      data: {
        name,
        price: parseFloat(price),
        isBestSeller: isBestSeller === true || isBestSeller === 'true' || isBestSeller === 'BestSeller',
        typeId: typeId ? parseInt(typeId) : null,
      },
    });
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(500).json({ message: "Error creating menu" });
  }
});

// 3. ลบเมนู (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.menu.delete({
      where: { menuId: parseInt(id) },
    });
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting menu" });
  }
});

// 4. ให้คะแนน Rating เมนู (สำหรับ User Mode)
router.post('/:id/rating', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    await prisma.rating.create({
      data: {
        menuId: parseInt(id),
        score: parseFloat(score),
      },
    });

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting rating" });
  }
});

module.exports = router;