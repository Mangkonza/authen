// src/controllers/menuController.js
const prisma = require('../db/prisma');

// 1. ดึงเมนูทั้งหมด หรือ ค้นหาด้วย keyword (?keyword=xxx)
const getMenus = async (req, res) => {
    const { keyword } = req.query;
    try {
        let menus;
        if (keyword) {
            menus = await prisma.menu.findMany({
                where: {
                    name: { contains: keyword }
                },
                include: { type: true } // ดึงข้อมูลชนิด (Type) มาด้วย
            });
        } else {
            menus = await prisma.menu.findMany({
                include: { type: true } // ดึงข้อมูลชนิด (Type) มาด้วย
            });
        }
        res.json(menus);
    } catch (err) {
        console.error('Error fetching menus:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// 2. ดึงเมนูตาม ID (GET /api/menu/:id)
const getMenuById = async (req, res) => {
    const { id } = req.params;
    try {
        const menu = await prisma.menu.findUnique({
            where: { menuId: Number(id) },
            include: { type: true }
        });
        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        res.json(menu);
    } catch (err) {
        console.error('Error fetching menu:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// 3. เพิ่มเมนูใหม่ (POST /api/menu)
const createMenu = async (req, res) => {
    const { name, price, isBestSeller, typeId } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    try {
        const newMenu = await prisma.menu.create({
            data: {
                name: name,
                price: parseFloat(price),
                isBestSeller: Boolean(isBestSeller),
                typeId: typeId ? Number(typeId) : null
            }
        });
        res.status(201).json(newMenu);
    } catch (err) {
        console.error('Error creating menu:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// 4. แก้ไขเมนู (PUT /api/menu/:id)
const updateMenu = async (req, res) => {
    const { id } = req.params;
    const { name, price, isBestSeller, typeId } = req.body;
    try {
        const updatedMenu = await prisma.menu.update({
            where: { menuId: Number(id) },
            data: {
                name: name,
                price: price !== undefined ? parseFloat(price) : undefined,
                isBestSeller: isBestSeller !== undefined ? Boolean(isBestSeller) : undefined,
                typeId: typeId !== undefined ? Number(typeId) : undefined
            }
        });
        res.json(updatedMenu);
    } catch (err) {
        console.error('Error updating menu:', err);
        res.status(404).json({ error: 'Menu not found or update error' });
    }
};

// 5. ลบเมนู (DELETE /api/menu/:id)
const deleteMenu = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.menu.delete({
            where: { menuId: Number(id) }
        });
        res.json({ message: 'Menu deleted successfully', menuId: Number(id) });
    } catch (err) {
        console.error('Error deleting menu:', err);
        res.status(404).json({ error: 'Menu not found' });
    }
};

module.exports = {
    getMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu
};