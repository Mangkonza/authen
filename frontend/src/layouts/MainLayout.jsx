// src/layouts/MainLayout.jsx
import { Outlet, Link } from "react-router-dom";

function MainLayout() {
  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "110px",
    height: "45px",
    backgroundColor: "#3ea2b8",
    color: "white",
    fontSize: "20px",
    textDecoration: "none",
    borderRadius: "8px",
    border: "1px solid #33889b",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", padding: "40px", gap: "25px", fontFamily: "serif" }}>
      {/* ฝั่งซ้าย: ปุ่มนำทาง Home และ Menu */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Link to="/" style={buttonStyle}>Home</Link>
        <Link to="/menus" style={buttonStyle}>Menu</Link>
      </nav>

      {/* ฝั่งขวา: แสดงเนื้อหาแต่ละหน้า */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;