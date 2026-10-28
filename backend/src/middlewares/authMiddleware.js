// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: "no token provide" });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === "null") {
      return res.status(403).json({ message: "no token provide" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // เก็บ payload เช่น { userName, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };