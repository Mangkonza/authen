// src/FoodForm.jsx
import { useState } from 'react';

function FoodForm({ addItem }) {
  const [inputs, setInputs] = useState({
    name: "",
    price: "",
    isBestSeller: "true"
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs(values => ({ ...values, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (inputs.name.trim() === "" || inputs.price === "") return;

    addItem({
      name: inputs.name,
      price: Number(inputs.price),
      isBestSeller: inputs.isBestSeller === "true"
    });

    setInputs({ name: "", price: "", isBestSeller: "true" });
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', fontSize: '18px' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>New Food</h3>

      <div style={{ marginBottom: '8px' }}>
        <label>name : </label>
        <input 
          type="text" 
          name="name" 
          value={inputs.name} 
          onChange={handleChange} 
          style={{ width: '180px' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label>price : </label>
        <input 
          type="number" 
          name="price" 
          value={inputs.price} 
          onChange={handleChange} 
          style={{ width: '180px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>Best Seller : </label>
        <select 
          name="isBestSeller" 
          value={inputs.isBestSeller} 
          onChange={handleChange}
        >
          <option value="true">BestSeller</option>
          <option value="false">Normal</option>
        </select>
      </div>

      <div>
        <button type="submit" style={{ cursor: 'pointer', padding: '2px 8px' }}>
          Add menu
        </button>
      </div>
    </form>
  );
}

export default FoodForm;