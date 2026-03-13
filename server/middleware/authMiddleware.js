// middleware that protects routes - if you don't have a valid token you're not getting in
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // token should come in as "Bearer eyJhbGci..."  if missing, kick them out
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token' });
  }

  try {
    // split "Bearer <token>" and grab just the token part
    const token = authHeader.split(' ')[1];

    // verify checks the signature using our secret  if someone tampered with it this throws
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // grab the user from the DB using the id we encoded in the token
    // .select('-password') means fetch everything besides the password - no need to send that around
    req.user = await User.findById(decoded.id).select('-password');

    next(); // all good, move on to the actual route handler
  } catch {
    // token was expired, tampered with, or just wrong
    res.status(401).json({ message: 'Not authorised, token invalid' });
  }
};

module.exports = { protect };
