// src/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// กำหนดเส้นทาง CRUD
router.get('/', menuController.getMenus);          // ดูทั้งหมด / ค้นหา
router.get('/:id', menuController.getMenuById);    // ดูทีละจาน
router.post('/', menuController.createMenu);       // เพิ่มเมนู
router.put('/:id', menuController.updateMenu);     // แก้ไขเมนู
router.delete('/:id', menuController.deleteMenu);  // ลบเมนู

module.exports = router;