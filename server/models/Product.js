// product model  every grocery item in our comparison database
// prices object holds each store's price  null means that store doesn't stock it
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String, required: true }, // dairy, bread, meat, fruit-veg, pantry, frozen, snacks
  unit:     { type: String },                 // e.g. "4 pints", "500g", "per kg"
  imageUrl: { type: String, default: '' },
  prices: {
    asda:      { type: Number, default: null },
    tesco:     { type: Number, default: null },
    morrisons: { type: Number, default: null },
    aldi:      { type: Number, default: null },
    lidl:      { type: Number, default: null },
    sainsbury: { type: Number, default: null },
  },
  nutrition: {
    calories: { type: Number },
    protein:  { type: Number },
    carbs:    { type: Number },
    fat:      { type: Number },
  },
  tags: [{ type: String }],  // e.g. 'vegetarian', 'gluten-free', 'high-protein'
}, { timestamps: true });

// virtual returns the cheapest store and price in one call
productSchema.virtual('bestDeal').get(function () {
  const stores = ['asda', 'tesco', 'morrisons', 'aldi', 'lidl', 'sainsbury'];
  let best = null;
  let bestStore = null;
  stores.forEach((s) => {
    if (this.prices[s] != null && (best === null || this.prices[s] < best)) {
      best = this.prices[s];
      bestStore = s;
    }
  });
  return { store: bestStore, price: best };
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
