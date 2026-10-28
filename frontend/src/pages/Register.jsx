// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

export default function Register() {
  const [inputs, setInputs] = useState({
    userName: '',
    email: '',
    password: '',
    cpassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.password !== inputs.cpassword) {
      alert("Password mismatch");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/authen/register', {
        userName: inputs.userName,
        email: inputs.email,
        password: inputs.password
      });

      if (response.status === 201) {
        alert(response.data.message);
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Register</h1>
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
              type="email"
              name="email"
              placeholder="Email"
              value={inputs.email}
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
          <div className="auth-input-group">
            <input
              type="password"
              name="cpassword"
              placeholder="Confirm Password"
              value={inputs.cpassword}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <div className="auth-footer">
          Have an Account ? <Link to="/login" className="auth-link">Login Here</Link>
        </div>
      </div>
    </div>
  );
}