// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:5000";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(null); // null = Guest, หรือ object { userName, role }
  const [menus, setMenus] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminView, setAdminView] = useState('menu'); // 'menu' หรือ 'user'

  // ฟอร์มสำหรับ Admin เพิ่มเมนู
  const [newFood, setNewFood] = useState({
    name: '',
    price: '',
    isBestSeller: 'BestSeller'
  });

  const navigate = useNavigate();

  // 1. ตรวจสอบสถานะล็อกอินของผู้ใช้
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/authen/home`, {
        headers: { authorization: `Bearer ${token}` }
      });
      if (res.status === 200 && res.data.user && res.data.user.length > 0) {
        setCurrentUser(res.data.user[0]);
      } else {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    } catch (err) {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  // 2. ดึงรายการเมนูทั้งหมด
  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/menu`);
      setMenus(res.data);
    } catch (err) {
      console.error("Error fetching menus:", err);
    }
  };

  // 3. ดึงรายชื่อผู้ใช้ทั้งหมด (สำหรับ Admin)
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/users`, {
        headers: { authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ดึงข้อมูลครั้งแรกเมื่อโหลดหน้า
  useEffect(() => {
    fetchUserInfo();
    fetchMenus();
  }, []);

  // Polling ข้อมูลเมนูแบบ Real-time ทุก 5 วินาที
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMenus();
      if (currentUser && currentUser.role === 'admin' && adminView === 'user') {
        fetchUsers();
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [currentUser, adminView]);

  // ดึง Users เมื่อ Admin สลับมาแท็บ 'user'
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && adminView === 'user') {
      fetchUsers();
    }
  }, [adminView, currentUser]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  // User ให้คะแนน Rating เมนู
  const handleRatingChange = async (menuId, score) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE}/api/menu/${menuId}/rating`,
        { score },
        { headers: { authorization: `Bearer ${token}` } }
      );
      fetchMenus();
    } catch (err) {
      alert("Failed to submit rating");
    }
  };

  // Admin ลบเมนู
  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.delete(`${API_BASE}/api/menu/${menuId}`);
      fetchMenus();
    } catch (err) {
      alert("Failed to delete menu");
    }
  };

  // Admin เพิ่มเมนูใหม่
  const handleAddMenu = async (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price) return;
    try {
      await axios.post(`${API_BASE}/api/menu`, {
        name: newFood.name,
        price: parseFloat(newFood.price),
        isBestSeller: newFood.isBestSeller === 'BestSeller'
      });
      setNewFood({ name: '', price: '', isBestSeller: 'BestSeller' });
      fetchMenus();
    } catch (err) {
      alert("Failed to create menu");
    }
  };

  // Admin เปลี่ยน Role ของ User
  const handleRoleChange = async (userName, newRole) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_BASE}/api/users/${userName}/role`,
        { role: newRole },
        { headers: { authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert("Failed to change user role");
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', margin: 0, padding: 0 }}>
      {/* ===== Header Bar ===== */}
      {currentUser ? (
        <div style={{
          backgroundColor: '#faebd7',
          padding: '12px 25px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>{currentUser.userName}</span>
          <button
            onClick={handleLogout}
            style={{ padding: '3px 10px', cursor: 'pointer', background: '#f5f5f5', border: '1px solid #777' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '4px 14px', cursor: 'pointer', background: '#f0f0f0', border: '1px solid #777' }}
          >
            Login
          </button>
        </div>
      )}

      {/* ===== Main Content Area ===== */}
      <div style={{ padding: '10px 40px', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        
        {/* ปุ่มสลับโหมดสีเขียวสำหรับ Admin */}
        {currentUser && currentUser.role === 'admin' && (
          <div style={{ position: 'absolute', right: '40px', top: '15px' }}>
            <button
              onClick={() => setAdminView(adminView === 'menu' ? 'user' : 'menu')}
              style={{
                backgroundColor: '#7bfac5',
                border: 'none',
                padding: '12px 22px',
                fontSize: '16px',
                cursor: 'pointer',
                borderRadius: '2px',
                fontWeight: 500
              }}
            >
              {adminView === 'menu' ? 'user' : 'menu'}
            </button>
          </div>
        )}

        {/* ----------------- ADMIN: USER MANAGEMENT VIEW ----------------- */}
        {currentUser && currentUser.role === 'admin' && adminView === 'user' ? (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '20px 0' }}>User</h1>
            <ul style={{ lineHeight: '2.4', fontSize: '16px', listStyleType: 'disc' }}>
              {users.map(u => (
                <li key={u.userName}>
                  {u.userName} {u.email}{' '}
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.userName, e.target.value)}
                    style={{ marginLeft: '10px', padding: '2px 4px' }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          /* ----------------- MENU VIEW (Guest / User / Admin) ----------------- */
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: '20px 0 15px 0' }}>Our menu</h1>
            <ul style={{ lineHeight: '2.5', fontSize: '17px', listStyleType: 'disc' }}>
              {menus.map(item => (
                <li key={item.menuId}>
                  {/* แสดงชื่อ + เรตติ้งดาว หรือ ราคา */}
                  {currentUser && currentUser.role === 'admin' ? (
                    <span>{item.name} - {item.price} baht</span>
                  ) : (
                    <span>{item.name} (⭐{item.rating}) - {item.price} baht</span>
                  )}

                  {/* ไอคอน Best Seller */}
                  {item.isBestSeller && (
                    <span style={{ margin: '0 8px', fontSize: '18px' }} title="Best Seller">🏅</span>
                  )}

                  {/* USER MODE: กล่องให้คะแนนสีเขียวมิ้นต์ */}
                  {currentUser && currentUser.role === 'user' && (
                    <span style={{ backgroundColor: '#7bfac5', padding: '4px 8px', marginLeft: '10px', borderRadius: '3px' }}>
                      Choose rating:
                      <select
                        defaultValue="5"
                        onChange={(e) => handleRatingChange(item.menuId, e.target.value)}
                        style={{ marginLeft: '6px' }}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </span>
                  )}

                  {/* ADMIN MODE: ปุ่มลบเมนู */}
                  {currentUser && currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteMenu(item.menuId)}
                      style={{
                        marginLeft: '8px',
                        padding: '1px 8px',
                        cursor: 'pointer',
                        background: '#e9e9e9',
                        border: '1px solid #777'
                      }}
                    >
                      Del
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* ADMIN MODE: ฟอร์มเพิ่มเมนู New Food */}
            {currentUser && currentUser.role === 'admin' && (
              <div style={{ marginTop: '35px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>New Food</h2>
                <form onSubmit={handleAddMenu} style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', fontSize: '18px' }}>name :</label>
                    <input
                      type="text"
                      value={newFood.name}
                      onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                      style={{ flex: 1, padding: '3px 6px' }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', fontSize: '18px' }}>price :</label>
                    <input
                      type="number"
                      step="any"
                      value={newFood.price}
                      onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                      style={{ flex: 1, padding: '3px 6px' }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', fontSize: '18px' }}>Best Seller :</label>
                    <select
                      value={newFood.isBestSeller}
                      onChange={(e) => setNewFood({ ...newFood, isBestSeller: e.target.value })}
                      style={{ padding: '3px 6px' }}
                    >
                      <option value="BestSeller">BestSeller</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '4px 12px',
                        cursor: 'pointer',
                        background: '#e9e9e9',
                        border: '1px solid #777'
                      }}
                    >
                      Add menu
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}