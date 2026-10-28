// src/app.js
const express = require('express');
const cors = require('cors');
const typeRoutes = require('./routes/typeRoutes');
const menuRoutes = require('./routes/menuRoutes');
const authenRoutes = require('./routes/authenRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ผูก Routes
app.use('/authen', authenRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/type', typeRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Restaurant API is running...');
});

module.exports = app;