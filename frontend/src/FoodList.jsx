// src/FoodList.jsx
import FoodItem from './FoodItem';

function FoodList({ food, deleteItem, mode }) {
  return (
    <div>
      <ul>
        {food.map((item) => (
          <FoodItem 
            key={item.menuId} 
            item={item} 
            deleteItem={deleteItem}
            mode={mode}
          />
        ))}
      </ul>
    </div>
  );
}

export default FoodList;