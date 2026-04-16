// product routes - serves grocery price data to the frontend
// GET /api/products          returns all products (optionally filtered)
// GET /api/products/:id      returns a single product
const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

// GET /api/products?category=dairy&tag=vegan&q=milk
router.get('/', async (req, res) => {
  try {
    const { category, tag, q } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (tag)      filter.tags = tag;          // mongoose checks if array contains this value
    if (q)        filter.name = { $regex: q, $options: 'i' }; // case-insensitive name search

    const products = await Product.find(filter).sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Failed to load products' });
  }
});

// GET /api/products/:id single product by MongoDB id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ message: 'Failed to load product' });
  }
});

module.exports = router;
