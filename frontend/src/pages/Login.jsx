// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

export default function Login() {
  const [inputs, setInputs] = useState({
    userName: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/authen/login', inputs);
      if (response.status === 200) {
        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert(err.response.data.message);
      } else {
        alert("Login failed");
      }
    }
    setInputs({ userName: '', password: '' });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={inputs.userName}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>
          <div className="auth-input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="auth-btn">ส่ง</button>
        </form>

        <div className="auth-footer">
          No Account ? <Link to="/register" className="auth-link">Register Here</Link>
        </div>
      </div>
    </div>
  );
}