// src/FoodContainer.jsx
import { useState, useEffect } from 'react';
import { menuApi } from './services/menuApi';
import FoodList from './FoodList';
import FoodForm from './FoodForm';

const FoodContainer = () => {
  const [food, setFood] = useState([]);

  // ดึงข้อมูลจากฐานข้อมูล MySQL ผ่าน Backend
  const fetchMenus = async () => {
    try {
      const data = await menuApi.getAll();
      setFood(data);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // ฟังก์ชันลบเมนู
  const deleteItem = async (menuId) => {
    try {
      await menuApi.delete(menuId);
      setFood(prevFood => prevFood.filter(item => item.menuId !== menuId));
    } catch (error) {
      console.error("Failed to delete menu:", error);
    }
  };

  // ฟังก์ชันเพิ่มเมนู
  const addItem = async (newItem) => {
    try {
      await menuApi.create(newItem);
      await fetchMenus();
    } catch (error) {
      console.error("Failed to add menu:", error);
    }
  };

  return (
    /* กรอบสี่เหลี่ยมสีฟ้าล้อมรอบตามในรูป */
    <div style={{
      border: '2px solid #5cb3c8',
      padding: '20px 25px',
      minWidth: '340px',
      backgroundColor: '#ffffff'
    }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: '24px' }}>Our Menu</h2>
      <FoodList food={food} deleteItem={deleteItem} />
      <FoodForm addItem={addItem} />
    </div>
  );
};

export default FoodContainer;