// src/controllers/typeController.js
const prisma = require('../db/prisma');

// 1. ดึงประเภททั้งหมด (GET /api/type)
const getTypes = async (req, res) => {
    try {
        const types = await prisma.type.findMany();
        res.json(types);
    } catch (err) {
        console.error('Error fetching types:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// 2. ดึงประเภทตาม ID (GET /api/type/:id)
const getTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const type = await prisma.type.findUnique({
            where: { typeId: Number(id) }
        });
        if (!type) {
            return res.status(404).json({ error: 'Type not found' });
        }
        res.json(type);
    } catch (err) {
        console.error('Error fetching type:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// 3. เพิ่มประเภทใหม่ (POST /api/type)
const createType = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    try {
        const newType = await prisma.type.create({
            data: { name: name }
        });
        res.status(201).json(newType);
    } catch (err) {
        console.error('Error creating type:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    getTypes,
    getTypeById,
    createType
};