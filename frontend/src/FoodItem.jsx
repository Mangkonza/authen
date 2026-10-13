// src/FoodItem.jsx
function FoodItem({ item, deleteItem }) {
  return (
    <li style={{ margin: "6px 0", fontSize: "19px" }}>
      {item.name} - {item.price} baht
      {item.isBestSeller ? " 🎖️ " : " "}
      <button 
        onClick={() => deleteItem(item.menuId)}
        style={{ cursor: "pointer", padding: "1px 6px" }}
      >
        Del
      </button>
    </li>
  );
}

export default FoodItem;