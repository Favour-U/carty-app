// this is the main entry point for the backend - basically the brain of the whole server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');    // lets our frontend (different port) talk to this server
const morgan = require('morgan'); // logs every request to the terminal good for debugging 
require('dotenv').config();       // loads our secret keys from .env so we don't hardcode them

const app = express();

// middleware - these run on every single request before it hits a route
app.use(cors());           
app.use(express.json());   
app.use(morgan('dev'));     

// basic  check just to confirm the server is alive
app.get('/', (req, res) => res.json({ message: 'Carty API running' }));

// mount our route files - all auth stuff lives under /api/auth, user stuff under /api/users
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// connect to MongoDB first, start listening - if DB fails the server won't even start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(err));
