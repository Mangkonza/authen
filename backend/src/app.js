// src/app.js
const express = require('express');
const cors = require('cors');
const typeRoutes = require('./routes/typeRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ผูก Routes ตามโจทย์ใน Todo
app.use('/api/type', typeRoutes);
app.use('/api/menu', menuRoutes);

// เส้นทางทดสอบหน้าแรก
app.get('/', (req, res) => {
    res.send('Restaurant API is running...');
});

module.exports = app;