// handles everything to do with logging in and signing up
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// creates a JWT token with the user's id iside it expires after 30 days
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register - create a new account
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // make sure they actually sent all three fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password' });
  }

  // check if someone already has this email
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // create the user 
  // password gets hashed automatically by the pre-save hook in User.js
  const user = await User.create({ name, email, password });

  // send back their info + a token so they're instantly logged in after registering
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// POST /api/auth/login - sign into an existing account
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // keep the error vague on purpose don't tell them which one is wrong (security thing)
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

module.exports = router;
