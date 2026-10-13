// src/routes/typeRoutes.js
const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');

// กำหนดเส้นทาง URL
router.get('/', typeController.getTypes);          // ดูทั้งหมด
router.get('/:id', typeController.getTypeById);    // ดูตาม ID
router.post('/', typeController.createType);       // เพิ่มใหม่

module.exports = router;