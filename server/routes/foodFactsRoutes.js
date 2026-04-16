// Open Food Facts proxy  avoids CORS issues when calling from the browser
// GET /api/food-facts/search?q=chicken breast   returns up to 10 matching products
// GET /api/food-facts/barcode/:code              returns a single product by barcode
const express = require('express');
const router  = express.Router();
const https   = require('https');

// tiny helper makes an https GET and returns parsed JSON
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CartyApp/1.0 (university project)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// GET /api/food-facts/search?q=oats
// searches Open Food Facts and returns a cleaned-up list of products
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'q query param required' });

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,nutriments,image_thumb_url,brands,quantity`;
    const data = await fetchJson(url);

    // clean up the response - only return fields we actually use
    const products = (data.products || []).map((p) => ({
      name:      p.product_name || 'Unknown',
      brand:     p.brands       || '',
      quantity:  p.quantity     || '',
      imageUrl:  p.image_thumb_url || '',
      nutrition: {
        calories: Math.round(p.nutriments?.['energy-kcal_100g'] ?? 0),
        protein:  +(p.nutriments?.proteins_100g ?? 0).toFixed(1),
        carbs:    +(p.nutriments?.carbohydrates_100g ?? 0).toFixed(1),
        fat:      +(p.nutriments?.fat_100g ?? 0).toFixed(1),
      },
    }));

    res.json({ products });
  } catch (err) {
    console.error('Food Facts search error:', err.message);
    res.status(500).json({ message: 'Failed to reach Open Food Facts' });
  }
});

// GET /api/food-facts/barcode/5000169105398
router.get('/barcode/:code', async (req, res) => {
  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${req.params.code}?fields=product_name,nutriments,image_url,brands,quantity`;
    const data = await fetchJson(url);

    if (data.status === 0) return res.status(404).json({ message: 'Product not found' });

    const p = data.product;
    res.json({
      name:      p.product_name || 'Unknown',
      brand:     p.brands       || '',
      quantity:  p.quantity     || '',
      imageUrl:  p.image_url    || '',
      nutrition: {
        calories: Math.round(p.nutriments?.['energy-kcal_100g'] ?? 0),
        protein:  +(p.nutriments?.proteins_100g ?? 0).toFixed(1),
        carbs:    +(p.nutriments?.carbohydrates_100g ?? 0).toFixed(1),
        fat:      +(p.nutriments?.fat_100g ?? 0).toFixed(1),
      },
    });
  } catch (err) {
    console.error('Food Facts barcode error:', err.message);
    res.status(500).json({ message: 'Failed to reach Open Food Facts' });
  }
});

module.exports = router;
