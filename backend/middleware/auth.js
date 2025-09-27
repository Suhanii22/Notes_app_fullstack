

const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config();

module.exports = async function(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.json({ error: 'No token provided' });

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) return res.json({ error: 'Token missing' });


    const decoded = jwt.verify(token, process.env.JWT_SECRET); // same secret as login
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ error: 'User not found' });


    req.user = user; // attach user object to request
    next();

};
