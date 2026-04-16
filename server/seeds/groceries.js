// seed script  populates MongoDB with ~200 grocery products across 6 stores
// run with: node server/seeds/groceries.js
// prices are realistic UK supermarket prices as of early 2026

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product  = require('../models/Product');

const products = [

  // ─── DAIRY & EGGS ──────────────────────────────────────────────────────
  { name: 'Whole Milk 4 Pints',     category: 'dairy',    unit: '4 pints (2.27L)',
    prices: { asda: 1.45, tesco: 1.55, morrisons: 1.50, aldi: 1.35, lidl: 1.39, sainsbury: 1.50 },
    nutrition: { calories: 66, protein: 3.4, carbs: 4.7, fat: 3.9 }, tags: ['vegetarian'] },

  { name: 'Semi-Skimmed Milk 4 Pints', category: 'dairy', unit: '4 pints (2.27L)',
    prices: { asda: 1.45, tesco: 1.55, morrisons: 1.50, aldi: 1.35, lidl: 1.39, sainsbury: 1.50 },
    nutrition: { calories: 47, protein: 3.5, carbs: 4.8, fat: 1.8 }, tags: ['vegetarian'] },

  { name: 'Skimmed Milk 6 Pints',   category: 'dairy',    unit: '6 pints (3.41L)',
    prices: { asda: 1.85, tesco: 1.90, morrisons: 1.89, aldi: 1.75, lidl: 1.79, sainsbury: 1.89 },
    nutrition: { calories: 34, protein: 3.4, carbs: 4.9, fat: 0.3 }, tags: ['vegetarian'] },

  { name: 'British Free Range Eggs 6 pack', category: 'dairy', unit: '6 eggs',
    prices: { asda: 1.79, tesco: 1.85, morrisons: 1.80, aldi: 1.49, lidl: 1.55, sainsbury: 1.89 },
    nutrition: { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 }, tags: ['vegetarian', 'high-protein'] },

  { name: 'Free Range Eggs 12 pack', category: 'dairy',   unit: '12 eggs',
    prices: { asda: 2.30, tesco: 1.99, morrisons: 2.05, aldi: 2.40, lidl: 2.05, sainsbury: 2.40 },
    nutrition: { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 }, tags: ['vegetarian', 'high-protein'] },

  { name: 'Cheddar Cheese 400g',     category: 'dairy',   unit: '400g',
    prices: { asda: 2.50, tesco: 2.75, morrisons: 2.65, aldi: 2.29, lidl: 2.35, sainsbury: 2.80 },
    nutrition: { calories: 415, protein: 25, carbs: 0.1, fat: 34 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Mild Cheddar 750g',       category: 'dairy',   unit: '750g',
    prices: { asda: 4.25, tesco: 4.50, morrisons: 4.39, aldi: 3.99, lidl: 4.05, sainsbury: 4.55 },
    nutrition: { calories: 415, protein: 25, carbs: 0.1, fat: 34 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Unsalted Butter 250g',    category: 'dairy',   unit: '250g',
    prices: { asda: 1.95, tesco: 2.10, morrisons: 2.00, aldi: 1.85, lidl: 1.79, sainsbury: 2.05 },
    nutrition: { calories: 744, protein: 0.5, carbs: 0.6, fat: 82 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Greek Yoghurt 500g',      category: 'dairy',   unit: '500g',
    prices: { asda: 1.29, tesco: 1.40, morrisons: 1.35, aldi: 0.99, lidl: 1.05, sainsbury: 1.45 },
    nutrition: { calories: 97, protein: 6.4, carbs: 3.6, fat: 5.5 }, tags: ['vegetarian', 'gluten-free', 'high-protein'] },

  { name: 'Natural Yoghurt 500g',    category: 'dairy',   unit: '500g',
    prices: { asda: 0.85, tesco: 0.90, morrisons: 0.89, aldi: 0.75, lidl: 0.79, sainsbury: 0.95 },
    nutrition: { calories: 58, protein: 4.6, carbs: 5.0, fat: 1.9 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Double Cream 300ml',      category: 'dairy',   unit: '300ml',
    prices: { asda: 0.99, tesco: 1.10, morrisons: 1.05, aldi: 0.89, lidl: 0.95, sainsbury: 1.15 },
    nutrition: { calories: 455, protein: 1.7, carbs: 2.7, fat: 48 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Cottage Cheese 300g',     category: 'dairy',   unit: '300g',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.85, lidl: 0.89, sainsbury: 1.00 },
    nutrition: { calories: 98, protein: 12, carbs: 3.0, fat: 4.0 }, tags: ['vegetarian', 'gluten-free', 'high-protein'] },

  { name: 'Mozzarella 125g',         category: 'dairy',   unit: '125g',
    prices: { asda: 0.79, tesco: 0.85, morrisons: 0.80, aldi: 0.69, lidl: 0.72, sainsbury: 0.90 },
    nutrition: { calories: 280, protein: 18, carbs: 2.0, fat: 22 }, tags: ['vegetarian', 'gluten-free'] },

  // ─── BREAD & BAKERY ────────────────────────────────────────────────────
  { name: 'Wholemeal Bread 800g',    category: 'bread',   unit: '800g loaf',
    prices: { asda: 1.09, tesco: 1.25, morrisons: 1.19, aldi: 0.85, lidl: 0.89, sainsbury: 1.30 },
    nutrition: { calories: 217, protein: 9.2, carbs: 39, fat: 2.8 }, tags: ['vegan'] },

  { name: 'White Bread 800g',        category: 'bread',   unit: '800g loaf',
    prices: { asda: 0.95, tesco: 1.10, morrisons: 1.05, aldi: 0.75, lidl: 0.79, sainsbury: 1.15 },
    nutrition: { calories: 236, protein: 7.9, carbs: 47, fat: 1.6 }, tags: ['vegan'] },

  { name: 'Seeded Wholemeal Bread',  category: 'bread',   unit: '800g loaf',
    prices: { asda: 1.35, tesco: 1.50, morrisons: 1.45, aldi: 1.09, lidl: 1.15, sainsbury: 1.55 },
    nutrition: { calories: 235, protein: 9.8, carbs: 37, fat: 4.5 }, tags: ['vegan'] },

  { name: 'Wholemeal Pitta Bread 6 pack', category: 'bread', unit: '6 pittas',
    prices: { asda: 0.79, tesco: 0.89, morrisons: 0.85, aldi: 0.69, lidl: 0.72, sainsbury: 0.95 },
    nutrition: { calories: 212, protein: 8.1, carbs: 41, fat: 1.8 }, tags: ['vegan'] },

  { name: 'Flour Tortilla Wraps 8 pack', category: 'bread', unit: '8 wraps',
    prices: { asda: 1.00, tesco: 1.10, morrisons: 1.05, aldi: 0.89, lidl: 0.95, sainsbury: 1.15 },
    nutrition: { calories: 289, protein: 7.2, carbs: 50, fat: 5.9 }, tags: ['vegan'] },

  { name: 'Bagels 5 pack',           category: 'bread',   unit: '5 bagels',
    prices: { asda: 1.09, tesco: 1.25, morrisons: 1.20, aldi: 0.99, lidl: 1.00, sainsbury: 1.30 },
    nutrition: { calories: 270, protein: 9.0, carbs: 54, fat: 1.8 }, tags: ['vegan'] },

  { name: 'Sourdough Bread 400g',    category: 'bread',   unit: '400g loaf',
    prices: { asda: 1.50, tesco: 1.65, morrisons: 1.60, aldi: 1.29, lidl: 1.35, sainsbury: 1.70 },
    nutrition: { calories: 262, protein: 9.2, carbs: 52, fat: 1.2 }, tags: ['vegan'] },

  { name: 'Crumpets 6 pack',         category: 'bread',   unit: '6 crumpets',
    prices: { asda: 0.69, tesco: 0.79, morrisons: 0.75, aldi: 0.59, lidl: 0.62, sainsbury: 0.85 },
    nutrition: { calories: 180, protein: 5.9, carbs: 37, fat: 0.7 }, tags: ['vegetarian'] },

  // ─── MEAT & FISH ───────────────────────────────────────────────────────
  { name: 'Chicken Breast Fillets 600g', category: 'meat', unit: '600g',
    prices: { asda: 3.49, tesco: 3.79, morrisons: 3.65, aldi: 3.19, lidl: 3.29, sainsbury: 3.89 },
    nutrition: { calories: 165, protein: 31, carbs: 0.0, fat: 3.6 }, tags: ['gluten-free', 'high-protein', 'low-fat'] },

  { name: 'Chicken Thighs Boneless 800g', category: 'meat', unit: '800g',
    prices: { asda: 3.25, tesco: 3.50, morrisons: 3.39, aldi: 2.99, lidl: 3.05, sainsbury: 3.55 },
    nutrition: { calories: 209, protein: 26, carbs: 0.0, fat: 11 }, tags: ['gluten-free', 'high-protein'] },

  { name: 'Chicken Drumsticks 12 pack', category: 'meat', unit: '1.1kg',
    prices: { asda: 1.50, tesco: 1.50, morrisons: 1.25, aldi: 1.45, lidl: 1.25, sainsbury: 1.00 },
    nutrition: { calories: 185, protein: 23, carbs: 0.0, fat: 10 }, tags: ['gluten-free', 'high-protein'] },

  { name: 'Beef Mince 500g 20% Fat', category: 'meat',    unit: '500g',
    prices: { asda: 2.99, tesco: 3.00, morrisons: 3.60, aldi: 3.05, lidl: 3.10, sainsbury: 3.50 },
    nutrition: { calories: 277, protein: 18, carbs: 0.0, fat: 22 }, tags: ['gluten-free', 'high-protein'] },

  { name: 'Lean Beef Mince 500g 5% Fat', category: 'meat', unit: '500g',
    prices: { asda: 3.75, tesco: 3.99, morrisons: 3.89, aldi: 3.49, lidl: 3.55, sainsbury: 4.05 },
    nutrition: { calories: 172, protein: 22, carbs: 0.0, fat: 9.0 }, tags: ['gluten-free', 'high-protein', 'low-fat'] },

  { name: 'Pork Sausages 8 pack 400g', category: 'meat', unit: '400g',
    prices: { asda: 1.75, tesco: 1.89, morrisons: 1.85, aldi: 1.49, lidl: 1.55, sainsbury: 1.99 },
    nutrition: { calories: 290, protein: 13, carbs: 8.5, fat: 22 }, tags: [] },

  { name: 'Bacon Rashers Smoked 300g', category: 'meat', unit: '300g',
    prices: { asda: 1.89, tesco: 2.00, morrisons: 1.95, aldi: 1.69, lidl: 1.75, sainsbury: 2.10 },
    nutrition: { calories: 215, protein: 22, carbs: 0.5, fat: 14 }, tags: ['gluten-free', 'high-protein'] },

  { name: 'Salmon Fillets 2 pack 240g', category: 'meat', unit: '240g',
    prices: { asda: 3.50, tesco: 3.75, morrisons: 3.65, aldi: 3.29, lidl: 3.35, sainsbury: 3.85 },
    nutrition: { calories: 208, protein: 20, carbs: 0.0, fat: 13 }, tags: ['gluten-free', 'high-protein'] },

  { name: 'Cod Fillets 2 pack 250g', category: 'meat',   unit: '250g',
    prices: { asda: 3.00, tesco: 3.25, morrisons: 3.15, aldi: 2.79, lidl: 2.89, sainsbury: 3.30 },
    nutrition: { calories: 82, protein: 18, carbs: 0.0, fat: 0.9 }, tags: ['gluten-free', 'high-protein', 'low-fat'] },

  { name: 'Tuna Steak 2 pack 280g',  category: 'meat',   unit: '280g',
    prices: { asda: 3.50, tesco: 3.65, morrisons: 3.55, aldi: 3.19, lidl: 3.29, sainsbury: 3.75 },
    nutrition: { calories: 109, protein: 24, carbs: 0.0, fat: 1.0 }, tags: ['gluten-free', 'high-protein', 'low-fat'] },

  { name: 'Tinned Tuna in Brine 4 pack', category: 'meat', unit: '4 × 145g',
    prices: { asda: 2.50, tesco: 2.75, morrisons: 2.65, aldi: 2.19, lidl: 2.29, sainsbury: 2.85 },
    nutrition: { calories: 90, protein: 21, carbs: 0.0, fat: 0.8 }, tags: ['gluten-free', 'high-protein', 'low-fat'] },

  { name: 'Prawns Cooked King 180g', category: 'meat',   unit: '180g',
    prices: { asda: 2.50, tesco: 2.75, morrisons: 2.65, aldi: 2.29, lidl: 2.35, sainsbury: 2.80 },
    nutrition: { calories: 99, protein: 21, carbs: 0.0, fat: 1.0 }, tags: ['gluten-free', 'high-protein', 'low-fat'] },

  { name: 'Turkey Breast Slices 120g', category: 'meat', unit: '120g',
    prices: { asda: 1.50, tesco: 1.65, morrisons: 1.60, aldi: 1.35, lidl: 1.39, sainsbury: 1.70 },
    nutrition: { calories: 99, protein: 22, carbs: 0.3, fat: 1.0 }, tags: ['gluten-free', 'high-protein', 'low-fat'] },

  { name: 'Lamb Chops 2 pack 350g',  category: 'meat',   unit: '350g',
    prices: { asda: 4.50, tesco: 4.75, morrisons: 4.65, aldi: 4.19, lidl: 4.29, sainsbury: 4.85 },
    nutrition: { calories: 294, protein: 25, carbs: 0.0, fat: 21 }, tags: ['gluten-free', 'high-protein'] },

  // ─── FRUIT & VEGETABLES ────────────────────────────────────────────────
  { name: 'Bananas Loose per kg',    category: 'fruit-veg', unit: 'per kg',
    prices: { asda: 0.68, tesco: 0.73, morrisons: 0.70, aldi: 0.59, lidl: 0.62, sainsbury: 0.75 },
    nutrition: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Apples Bag 6 pack',       category: 'fruit-veg', unit: '6 apples (~900g)',
    prices: { asda: 1.00, tesco: 1.10, morrisons: 1.05, aldi: 0.89, lidl: 0.95, sainsbury: 1.15 },
    nutrition: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Carrots 1kg Bag',         category: 'fruit-veg', unit: '1kg',
    prices: { asda: 0.45, tesco: 0.52, morrisons: 0.49, aldi: 0.39, lidl: 0.42, sainsbury: 0.55 },
    nutrition: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Broccoli per head ~400g', category: 'fruit-veg', unit: 'per head',
    prices: { asda: 0.55, tesco: 0.65, morrisons: 0.60, aldi: 0.49, lidl: 0.52, sainsbury: 0.70 },
    nutrition: { calories: 34, protein: 2.8, carbs: 7.0, fat: 0.4 }, tags: ['vegan', 'gluten-free'] },

  { name: 'White Potatoes 2.5kg Bag', category: 'fruit-veg', unit: '2.5kg',
    prices: { asda: 1.25, tesco: 1.39, morrisons: 1.35, aldi: 1.09, lidl: 1.15, sainsbury: 1.45 },
    nutrition: { calories: 77, protein: 2.0, carbs: 17, fat: 0.1 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Baby Potatoes 1kg',       category: 'fruit-veg', unit: '1kg',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.75, lidl: 0.79, sainsbury: 1.05 },
    nutrition: { calories: 77, protein: 2.0, carbs: 17, fat: 0.1 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Onions 1kg Bag',          category: 'fruit-veg', unit: '1kg',
    prices: { asda: 0.55, tesco: 0.65, morrisons: 0.60, aldi: 0.49, lidl: 0.52, sainsbury: 0.70 },
    nutrition: { calories: 40, protein: 1.1, carbs: 9.0, fat: 0.1 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Cherry Tomatoes 400g',    category: 'fruit-veg', unit: '400g',
    prices: { asda: 1.00, tesco: 1.10, morrisons: 1.05, aldi: 0.89, lidl: 0.95, sainsbury: 1.15 },
    nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Cucumber per unit',       category: 'fruit-veg', unit: 'per cucumber',
    prices: { asda: 0.45, tesco: 0.55, morrisons: 0.50, aldi: 0.39, lidl: 0.42, sainsbury: 0.60 },
    nutrition: { calories: 15, protein: 0.6, carbs: 3.6, fat: 0.1 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Spinach Baby Leaves 200g', category: 'fruit-veg', unit: '200g',
    prices: { asda: 0.85, tesco: 0.99, morrisons: 0.95, aldi: 0.79, lidl: 0.82, sainsbury: 1.05 },
    nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Peppers Mixed 3 pack',    category: 'fruit-veg', unit: '3 peppers',
    prices: { asda: 0.99, tesco: 1.10, morrisons: 1.05, aldi: 0.85, lidl: 0.89, sainsbury: 1.15 },
    nutrition: { calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Courgettes 2 pack',       category: 'fruit-veg', unit: '2 courgettes',
    prices: { asda: 0.75, tesco: 0.85, morrisons: 0.80, aldi: 0.65, lidl: 0.69, sainsbury: 0.90 },
    nutrition: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Sweet Potatoes 1kg',      category: 'fruit-veg', unit: '1kg',
    prices: { asda: 1.25, tesco: 1.39, morrisons: 1.35, aldi: 1.09, lidl: 1.15, sainsbury: 1.45 },
    nutrition: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Avocados 2 pack',         category: 'fruit-veg', unit: '2 avocados',
    prices: { asda: 1.00, tesco: 1.10, morrisons: 1.05, aldi: 0.89, lidl: 0.95, sainsbury: 1.20 },
    nutrition: { calories: 160, protein: 2.0, carbs: 9.0, fat: 15 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Mushrooms 400g',          category: 'fruit-veg', unit: '400g',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.75, lidl: 0.79, sainsbury: 1.05 },
    nutrition: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Garlic Bulb 3 pack',      category: 'fruit-veg', unit: '3 bulbs',
    prices: { asda: 0.59, tesco: 0.69, morrisons: 0.65, aldi: 0.49, lidl: 0.52, sainsbury: 0.75 },
    nutrition: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Lemons 4 pack',           category: 'fruit-veg', unit: '4 lemons',
    prices: { asda: 0.59, tesco: 0.69, morrisons: 0.65, aldi: 0.49, lidl: 0.52, sainsbury: 0.75 },
    nutrition: { calories: 29, protein: 1.1, carbs: 9.0, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Strawberries 400g',       category: 'fruit-veg', unit: '400g punnet',
    prices: { asda: 1.75, tesco: 1.89, morrisons: 1.85, aldi: 1.49, lidl: 1.55, sainsbury: 1.99 },
    nutrition: { calories: 32, protein: 0.7, carbs: 8.0, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Blueberries 150g',        category: 'fruit-veg', unit: '150g punnet',
    prices: { asda: 1.25, tesco: 1.40, morrisons: 1.35, aldi: 1.09, lidl: 1.15, sainsbury: 1.50 },
    nutrition: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Kale 200g',               category: 'fruit-veg', unit: '200g',
    prices: { asda: 0.79, tesco: 0.89, morrisons: 0.85, aldi: 0.69, lidl: 0.72, sainsbury: 0.95 },
    nutrition: { calories: 35, protein: 2.9, carbs: 4.4, fat: 0.5 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Cauliflower per head',    category: 'fruit-veg', unit: 'per head',
    prices: { asda: 0.75, tesco: 0.89, morrisons: 0.85, aldi: 0.65, lidl: 0.69, sainsbury: 0.95 },
    nutrition: { calories: 25, protein: 2.0, carbs: 5.0, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  // ─── PANTRY & TINS ─────────────────────────────────────────────────────
  { name: 'Pasta Penne 500g',        category: 'pantry',  unit: '500g',
    prices: { asda: 0.75, tesco: 0.85, morrisons: 0.80, aldi: 0.65, lidl: 0.65, sainsbury: 0.80 },
    nutrition: { calories: 371, protein: 13, carbs: 75, fat: 1.5 }, tags: ['vegan'] },

  { name: 'Pasta Spaghetti 500g',    category: 'pantry',  unit: '500g',
    prices: { asda: 0.75, tesco: 0.85, morrisons: 0.80, aldi: 0.65, lidl: 0.65, sainsbury: 0.80 },
    nutrition: { calories: 371, protein: 13, carbs: 75, fat: 1.5 }, tags: ['vegan'] },

  { name: 'Basmati Rice 1kg',        category: 'pantry',  unit: '1kg',
    prices: { asda: 1.65, tesco: 1.80, morrisons: 1.70, aldi: 1.50, lidl: 1.45, sainsbury: 1.75 },
    nutrition: { calories: 349, protein: 7.0, carbs: 78, fat: 0.9 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Long Grain Rice 1kg',     category: 'pantry',  unit: '1kg',
    prices: { asda: 1.25, tesco: 1.40, morrisons: 1.35, aldi: 1.09, lidl: 1.15, sainsbury: 1.45 },
    nutrition: { calories: 349, protein: 7.0, carbs: 78, fat: 0.9 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Porridge Oats 1kg',       category: 'pantry',  unit: '1kg',
    prices: { asda: 1.50, tesco: 1.40, morrisons: 1.25, aldi: 1.35, lidl: 1.50, sainsbury: 1.40 },
    nutrition: { calories: 367, protein: 14, carbs: 60, fat: 7.0 }, tags: ['vegan'] },

  { name: 'Tinned Tomatoes 400g',    category: 'pantry',  unit: '400g tin',
    prices: { asda: 0.55, tesco: 0.60, morrisons: 0.55, aldi: 0.45, lidl: 0.42, sainsbury: 0.58 },
    nutrition: { calories: 24, protein: 1.4, carbs: 4.9, fat: 0.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Chopped Tomatoes 4 pack', category: 'pantry',  unit: '4 × 400g',
    prices: { asda: 1.60, tesco: 1.80, morrisons: 1.75, aldi: 1.39, lidl: 1.45, sainsbury: 1.85 },
    nutrition: { calories: 24, protein: 1.4, carbs: 4.9, fat: 0.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Baked Beans 4 pack 415g', category: 'pantry',  unit: '4 × 415g',
    prices: { asda: 1.29, tesco: 1.40, morrisons: 1.35, aldi: 1.09, lidl: 1.15, sainsbury: 1.45 },
    nutrition: { calories: 81, protein: 5.0, carbs: 14, fat: 0.4 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  { name: 'Chickpeas Tinned 400g',   category: 'pantry',  unit: '400g tin',
    prices: { asda: 0.55, tesco: 0.65, morrisons: 0.60, aldi: 0.45, lidl: 0.49, sainsbury: 0.70 },
    nutrition: { calories: 139, protein: 7.3, carbs: 23, fat: 2.6 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  { name: 'Red Kidney Beans 400g',   category: 'pantry',  unit: '400g tin',
    prices: { asda: 0.49, tesco: 0.59, morrisons: 0.55, aldi: 0.39, lidl: 0.42, sainsbury: 0.65 },
    nutrition: { calories: 127, protein: 8.7, carbs: 22, fat: 0.5 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  { name: 'Red Lentils 500g',        category: 'pantry',  unit: '500g',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.75, lidl: 0.79, sainsbury: 1.05 },
    nutrition: { calories: 353, protein: 25, carbs: 60, fat: 1.1 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  { name: 'Olive Oil Extra Virgin 500ml', category: 'pantry', unit: '500ml',
    prices: { asda: 3.10, tesco: 3.50, morrisons: 3.40, aldi: 2.99, lidl: 2.75, sainsbury: 3.25 },
    nutrition: { calories: 884, protein: 0.0, carbs: 0.0, fat: 100 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Sunflower Oil 1 litre',   category: 'pantry',  unit: '1 litre',
    prices: { asda: 1.50, tesco: 1.65, morrisons: 1.60, aldi: 1.35, lidl: 1.39, sainsbury: 1.70 },
    nutrition: { calories: 899, protein: 0.0, carbs: 0.0, fat: 99 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Plain Flour 1.5kg',       category: 'pantry',  unit: '1.5kg',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.79, lidl: 0.82, sainsbury: 1.00 },
    nutrition: { calories: 341, protein: 10, carbs: 73, fat: 1.3 }, tags: ['vegan'] },

  { name: 'Self Raising Flour 1.5kg', category: 'pantry', unit: '1.5kg',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.79, lidl: 0.82, sainsbury: 1.00 },
    nutrition: { calories: 341, protein: 10, carbs: 73, fat: 1.3 }, tags: ['vegan'] },

  { name: 'Caster Sugar 1kg',        category: 'pantry',  unit: '1kg',
    prices: { asda: 0.85, tesco: 0.95, morrisons: 0.90, aldi: 0.75, lidl: 0.79, sainsbury: 1.00 },
    nutrition: { calories: 400, protein: 0.0, carbs: 100, fat: 0.0 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Vegetable Stock Cubes 12 pack', category: 'pantry', unit: '12 cubes',
    prices: { asda: 0.65, tesco: 0.75, morrisons: 0.70, aldi: 0.55, lidl: 0.59, sainsbury: 0.79 },
    nutrition: { calories: 31, protein: 0.7, carbs: 5.0, fat: 1.0 }, tags: ['vegan'] },

  { name: 'Chicken Stock Cubes 12 pack', category: 'pantry', unit: '12 cubes',
    prices: { asda: 0.65, tesco: 0.75, morrisons: 0.70, aldi: 0.55, lidl: 0.59, sainsbury: 0.79 },
    nutrition: { calories: 31, protein: 0.7, carbs: 5.0, fat: 1.0 }, tags: [] },

  { name: 'Soy Sauce 150ml',         category: 'pantry',  unit: '150ml',
    prices: { asda: 0.85, tesco: 0.95, morrisons: 0.90, aldi: 0.79, lidl: 0.82, sainsbury: 0.99 },
    nutrition: { calories: 60, protein: 5.8, carbs: 8.3, fat: 0.1 }, tags: ['vegan'] },

  { name: 'Tomato Ketchup 570g',     category: 'pantry',  unit: '570g',
    prices: { asda: 1.25, tesco: 1.35, morrisons: 1.30, aldi: 0.99, lidl: 1.05, sainsbury: 1.40 },
    nutrition: { calories: 115, protein: 1.2, carbs: 26, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Mayonnaise 400g',         category: 'pantry',  unit: '400g',
    prices: { asda: 1.00, tesco: 1.10, morrisons: 1.05, aldi: 0.85, lidl: 0.89, sainsbury: 1.15 },
    nutrition: { calories: 691, protein: 1.3, carbs: 2.2, fat: 75 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Peanut Butter Smooth 340g', category: 'pantry', unit: '340g',
    prices: { asda: 1.39, tesco: 1.50, morrisons: 1.45, aldi: 1.19, lidl: 1.25, sainsbury: 1.55 },
    nutrition: { calories: 588, protein: 25, carbs: 20, fat: 46 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  { name: 'Honey 340g',              category: 'pantry',  unit: '340g jar',
    prices: { asda: 1.50, tesco: 1.65, morrisons: 1.60, aldi: 1.29, lidl: 1.35, sainsbury: 1.70 },
    nutrition: { calories: 304, protein: 0.3, carbs: 82, fat: 0.0 }, tags: ['gluten-free'] },

  { name: 'Coconut Milk 400ml',      category: 'pantry',  unit: '400ml tin',
    prices: { asda: 0.79, tesco: 0.89, morrisons: 0.85, aldi: 0.69, lidl: 0.72, sainsbury: 0.95 },
    nutrition: { calories: 197, protein: 2.0, carbs: 3.0, fat: 21 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Curry Paste Tikka Masala 285g', category: 'pantry', unit: '285g jar',
    prices: { asda: 1.29, tesco: 1.40, morrisons: 1.35, aldi: 1.09, lidl: 1.15, sainsbury: 1.45 },
    nutrition: { calories: 90, protein: 2.0, carbs: 8.0, fat: 5.5 }, tags: ['vegan'] },

  { name: 'Pasta Sauce Tomato & Basil 500g', category: 'pantry', unit: '500g jar',
    prices: { asda: 0.95, tesco: 1.05, morrisons: 1.00, aldi: 0.79, lidl: 0.82, sainsbury: 1.10 },
    nutrition: { calories: 59, protein: 1.7, carbs: 11, fat: 1.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Bread Crumbs 400g',       category: 'pantry',  unit: '400g',
    prices: { asda: 0.85, tesco: 0.95, morrisons: 0.90, aldi: 0.75, lidl: 0.79, sainsbury: 0.99 },
    nutrition: { calories: 354, protein: 11, carbs: 73, fat: 2.5 }, tags: ['vegan'] },

  { name: 'Cornflour 500g',          category: 'pantry',  unit: '500g',
    prices: { asda: 0.79, tesco: 0.89, morrisons: 0.85, aldi: 0.69, lidl: 0.72, sainsbury: 0.95 },
    nutrition: { calories: 354, protein: 0.6, carbs: 88, fat: 0.7 }, tags: ['vegan', 'gluten-free'] },

  { name: 'White Wine Vinegar 350ml', category: 'pantry', unit: '350ml',
    prices: { asda: 0.55, tesco: 0.65, morrisons: 0.60, aldi: 0.45, lidl: 0.49, sainsbury: 0.70 },
    nutrition: { calories: 18, protein: 0.0, carbs: 4.5, fat: 0.0 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Balsamic Vinegar 250ml',  category: 'pantry',  unit: '250ml',
    prices: { asda: 1.00, tesco: 1.15, morrisons: 1.10, aldi: 0.89, lidl: 0.95, sainsbury: 1.20 },
    nutrition: { calories: 88, protein: 0.5, carbs: 22, fat: 0.0 }, tags: ['vegan', 'gluten-free'] },

  // ─── FROZEN ────────────────────────────────────────────────────────────
  { name: 'Frozen Peas 900g',        category: 'frozen',  unit: '900g bag',
    prices: { asda: 1.19, tesco: 1.29, morrisons: 1.25, aldi: 0.99, lidl: 1.05, sainsbury: 1.35 },
    nutrition: { calories: 77, protein: 6.0, carbs: 14, fat: 0.4 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Frozen Sweetcorn 1kg',    category: 'frozen',  unit: '1kg bag',
    prices: { asda: 1.25, tesco: 1.35, morrisons: 1.30, aldi: 1.05, lidl: 1.09, sainsbury: 1.40 },
    nutrition: { calories: 86, protein: 3.2, carbs: 19, fat: 1.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Frozen Spinach 900g',     category: 'frozen',  unit: '900g bag',
    prices: { asda: 1.09, tesco: 1.19, morrisons: 1.15, aldi: 0.89, lidl: 0.95, sainsbury: 1.25 },
    nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Frozen Mixed Vegetables 1kg', category: 'frozen', unit: '1kg bag',
    prices: { asda: 1.09, tesco: 1.19, morrisons: 1.15, aldi: 0.89, lidl: 0.95, sainsbury: 1.25 },
    nutrition: { calories: 55, protein: 3.5, carbs: 10, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Frozen Broccoli 1kg',     category: 'frozen',  unit: '1kg bag',
    prices: { asda: 1.19, tesco: 1.29, morrisons: 1.25, aldi: 0.99, lidl: 1.05, sainsbury: 1.35 },
    nutrition: { calories: 34, protein: 2.8, carbs: 7.0, fat: 0.4 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Oven Chips 1.5kg',        category: 'frozen',  unit: '1.5kg bag',
    prices: { asda: 1.39, tesco: 1.50, morrisons: 1.45, aldi: 1.19, lidl: 1.25, sainsbury: 1.55 },
    nutrition: { calories: 173, protein: 2.8, carbs: 28, fat: 5.9 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Frozen Fish Fingers 36 pack', category: 'frozen', unit: '1kg',
    prices: { asda: 3.25, tesco: 3.50, morrisons: 3.39, aldi: 2.99, lidl: 3.05, sainsbury: 3.55 },
    nutrition: { calories: 232, protein: 11, carbs: 22, fat: 10 }, tags: [] },

  { name: 'Frozen Chicken Nuggets 600g', category: 'frozen', unit: '600g',
    prices: { asda: 2.50, tesco: 2.69, morrisons: 2.60, aldi: 2.19, lidl: 2.29, sainsbury: 2.75 },
    nutrition: { calories: 240, protein: 14, carbs: 21, fat: 10 }, tags: [] },

  { name: 'Frozen Berries Mixed 500g', category: 'frozen', unit: '500g bag',
    prices: { asda: 1.75, tesco: 1.89, morrisons: 1.85, aldi: 1.49, lidl: 1.55, sainsbury: 1.99 },
    nutrition: { calories: 45, protein: 0.8, carbs: 11, fat: 0.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Frozen Edamame 400g',     category: 'frozen',  unit: '400g',
    prices: { asda: 1.89, tesco: 2.00, morrisons: 1.95, aldi: 1.65, lidl: 1.69, sainsbury: 2.10 },
    nutrition: { calories: 121, protein: 11, carbs: 9.0, fat: 5.0 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  { name: 'Frozen Salmon Portions 4 pack', category: 'frozen', unit: '480g',
    prices: { asda: 4.25, tesco: 4.50, morrisons: 4.39, aldi: 3.99, lidl: 4.05, sainsbury: 4.55 },
    nutrition: { calories: 208, protein: 20, carbs: 0.0, fat: 13 }, tags: ['gluten-free', 'high-protein'] },

  { name: 'Frozen Pizza Margherita', category: 'frozen',  unit: '325g',
    prices: { asda: 1.09, tesco: 1.25, morrisons: 1.20, aldi: 0.99, lidl: 1.00, sainsbury: 1.35 },
    nutrition: { calories: 265, protein: 10, carbs: 36, fat: 9.0 }, tags: ['vegetarian'] },

  { name: 'Ice Cream Vanilla 2 litre', category: 'frozen', unit: '2 litre tub',
    prices: { asda: 2.25, tesco: 2.50, morrisons: 2.39, aldi: 1.89, lidl: 1.99, sainsbury: 2.55 },
    nutrition: { calories: 200, protein: 3.0, carbs: 25, fat: 10 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Frozen Garden Peas & Carrots 1kg', category: 'frozen', unit: '1kg',
    prices: { asda: 1.09, tesco: 1.19, morrisons: 1.15, aldi: 0.89, lidl: 0.95, sainsbury: 1.25 },
    nutrition: { calories: 60, protein: 4.0, carbs: 11, fat: 0.3 }, tags: ['vegan', 'gluten-free'] },

  // ─── SNACKS & DRINKS ───────────────────────────────────────────────────
  { name: 'Ready Salted Crisps 6 pack', category: 'snacks', unit: '6 × 25g',
    prices: { asda: 1.09, tesco: 1.19, morrisons: 1.15, aldi: 0.89, lidl: 0.95, sainsbury: 1.25 },
    nutrition: { calories: 537, protein: 6.0, carbs: 53, fat: 35 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Orange Juice 1 litre',    category: 'snacks',  unit: '1 litre',
    prices: { asda: 0.99, tesco: 1.10, morrisons: 1.05, aldi: 0.85, lidl: 0.89, sainsbury: 1.15 },
    nutrition: { calories: 45, protein: 0.7, carbs: 11, fat: 0.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Apple Juice 1 litre',     category: 'snacks',  unit: '1 litre',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.75, lidl: 0.79, sainsbury: 1.05 },
    nutrition: { calories: 46, protein: 0.1, carbs: 11, fat: 0.1 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Sparkling Water 6 × 500ml', category: 'snacks', unit: '6 × 500ml',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.75, lidl: 0.79, sainsbury: 1.05 },
    nutrition: { calories: 0, protein: 0.0, carbs: 0.0, fat: 0.0 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Coca Cola 6 × 330ml cans', category: 'snacks', unit: '6 × 330ml',
    prices: { asda: 3.49, tesco: 3.75, morrisons: 3.65, aldi: 2.99, lidl: 3.09, sainsbury: 3.85 },
    nutrition: { calories: 139, protein: 0.0, carbs: 35, fat: 0.0 }, tags: [] },

  { name: 'Ribena Blackcurrant 1 litre', category: 'snacks', unit: '1 litre',
    prices: { asda: 1.89, tesco: 2.00, morrisons: 1.95, aldi: 1.69, lidl: 1.75, sainsbury: 2.10 },
    nutrition: { calories: 50, protein: 0.2, carbs: 12, fat: 0.0 }, tags: ['vegan'] },

  { name: 'Tea Bags 80 pack',        category: 'snacks',  unit: '80 bags',
    prices: { asda: 1.49, tesco: 1.60, morrisons: 1.55, aldi: 1.25, lidl: 1.29, sainsbury: 1.65 },
    nutrition: { calories: 2, protein: 0.1, carbs: 0.4, fat: 0.0 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Instant Coffee 100g',     category: 'snacks',  unit: '100g jar',
    prices: { asda: 2.25, tesco: 2.50, morrisons: 2.39, aldi: 1.99, lidl: 2.05, sainsbury: 2.55 },
    nutrition: { calories: 2, protein: 0.1, carbs: 0.1, fat: 0.0 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Digestive Biscuits 400g', category: 'snacks',  unit: '400g pack',
    prices: { asda: 0.79, tesco: 0.89, morrisons: 0.85, aldi: 0.65, lidl: 0.69, sainsbury: 0.95 },
    nutrition: { calories: 481, protein: 6.4, carbs: 65, fat: 21 }, tags: ['vegetarian'] },

  { name: 'Chocolate Digestives 300g', category: 'snacks', unit: '300g pack',
    prices: { asda: 0.99, tesco: 1.10, morrisons: 1.05, aldi: 0.85, lidl: 0.89, sainsbury: 1.15 },
    nutrition: { calories: 493, protein: 6.2, carbs: 65, fat: 24 }, tags: ['vegetarian'] },

  { name: 'Hobnobs 300g',            category: 'snacks',  unit: '300g pack',
    prices: { asda: 1.00, tesco: 1.10, morrisons: 1.05, aldi: 0.89, lidl: 0.92, sainsbury: 1.15 },
    nutrition: { calories: 469, protein: 7.2, carbs: 62, fat: 22 }, tags: ['vegetarian'] },

  { name: 'Rice Cakes Plain 130g',   category: 'snacks',  unit: '130g',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.75, lidl: 0.79, sainsbury: 1.05 },
    nutrition: { calories: 381, protein: 7.1, carbs: 82, fat: 2.8 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Dark Chocolate 100g',     category: 'snacks',  unit: '100g bar',
    prices: { asda: 0.75, tesco: 0.85, morrisons: 0.80, aldi: 0.65, lidl: 0.69, sainsbury: 0.90 },
    nutrition: { calories: 546, protein: 5.3, carbs: 60, fat: 32 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Mixed Nuts 200g',         category: 'snacks',  unit: '200g bag',
    prices: { asda: 1.75, tesco: 1.89, morrisons: 1.85, aldi: 1.49, lidl: 1.55, sainsbury: 1.99 },
    nutrition: { calories: 607, protein: 16, carbs: 18, fat: 55 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  { name: 'Trail Mix 200g',          category: 'snacks',  unit: '200g bag',
    prices: { asda: 1.50, tesco: 1.65, morrisons: 1.60, aldi: 1.29, lidl: 1.35, sainsbury: 1.70 },
    nutrition: { calories: 450, protein: 10, carbs: 50, fat: 22 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Protein Bar Chocolate 60g', category: 'snacks', unit: 'per bar',
    prices: { asda: 1.39, tesco: 1.50, morrisons: 1.45, aldi: 1.19, lidl: 1.25, sainsbury: 1.55 },
    nutrition: { calories: 215, protein: 20, carbs: 22, fat: 7.0 }, tags: ['high-protein', 'gluten-free'] },

  { name: 'Popcorn Plain 100g',      category: 'snacks',  unit: '100g bag',
    prices: { asda: 0.75, tesco: 0.85, morrisons: 0.80, aldi: 0.65, lidl: 0.69, sainsbury: 0.90 },
    nutrition: { calories: 387, protein: 12, carbs: 68, fat: 5.5 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Fruit Squash No Added Sugar 1L', category: 'snacks', unit: '1 litre',
    prices: { asda: 0.85, tesco: 0.95, morrisons: 0.90, aldi: 0.69, lidl: 0.72, sainsbury: 0.99 },
    nutrition: { calories: 4, protein: 0.0, carbs: 1.0, fat: 0.0 }, tags: ['vegan', 'gluten-free'] },

  // ─── CONDIMENTS & SPICES ───────────────────────────────────────────────
  { name: 'Sea Salt Grinder 100g',   category: 'pantry',  unit: '100g',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.75, lidl: 0.79, sainsbury: 1.05 },
    nutrition: { calories: 0, protein: 0.0, carbs: 0.0, fat: 0.0 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Black Pepper Ground 50g', category: 'pantry',  unit: '50g',
    prices: { asda: 0.79, tesco: 0.89, morrisons: 0.85, aldi: 0.65, lidl: 0.69, sainsbury: 0.95 },
    nutrition: { calories: 251, protein: 10, carbs: 64, fat: 3.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Cumin Ground 38g',        category: 'pantry',  unit: '38g jar',
    prices: { asda: 0.85, tesco: 0.95, morrisons: 0.90, aldi: 0.75, lidl: 0.79, sainsbury: 0.99 },
    nutrition: { calories: 375, protein: 18, carbs: 44, fat: 22 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Paprika Smoked 45g',      category: 'pantry',  unit: '45g jar',
    prices: { asda: 0.85, tesco: 0.95, morrisons: 0.90, aldi: 0.75, lidl: 0.79, sainsbury: 0.99 },
    nutrition: { calories: 282, protein: 14, carbs: 54, fat: 13 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Turmeric Ground 48g',     category: 'pantry',  unit: '48g jar',
    prices: { asda: 0.85, tesco: 0.95, morrisons: 0.90, aldi: 0.75, lidl: 0.79, sainsbury: 0.99 },
    nutrition: { calories: 312, protein: 10, carbs: 68, fat: 3.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Dried Oregano 15g',       category: 'pantry',  unit: '15g jar',
    prices: { asda: 0.65, tesco: 0.75, morrisons: 0.70, aldi: 0.55, lidl: 0.59, sainsbury: 0.79 },
    nutrition: { calories: 265, protein: 9.0, carbs: 69, fat: 4.3 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Ginger Ground 36g',       category: 'pantry',  unit: '36g jar',
    prices: { asda: 0.85, tesco: 0.95, morrisons: 0.90, aldi: 0.75, lidl: 0.79, sainsbury: 0.99 },
    nutrition: { calories: 335, protein: 9.1, carbs: 71, fat: 4.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Cinnamon Ground 36g',     category: 'pantry',  unit: '36g jar',
    prices: { asda: 0.75, tesco: 0.85, morrisons: 0.80, aldi: 0.65, lidl: 0.69, sainsbury: 0.90 },
    nutrition: { calories: 247, protein: 4.0, carbs: 81, fat: 1.2 }, tags: ['vegan', 'gluten-free'] },

  // ─── PLANT-BASED / ALTERNATIVES ────────────────────────────────────────
  { name: 'Oat Milk 1 litre',        category: 'dairy',   unit: '1 litre',
    prices: { asda: 1.10, tesco: 1.20, morrisons: 1.15, aldi: 0.99, lidl: 1.00, sainsbury: 1.25 },
    nutrition: { calories: 46, protein: 1.0, carbs: 6.6, fat: 1.5 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Almond Milk 1 litre',     category: 'dairy',   unit: '1 litre',
    prices: { asda: 1.19, tesco: 1.30, morrisons: 1.25, aldi: 1.05, lidl: 1.09, sainsbury: 1.35 },
    nutrition: { calories: 24, protein: 0.6, carbs: 2.8, fat: 1.1 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Soy Milk 1 litre',        category: 'dairy',   unit: '1 litre',
    prices: { asda: 1.15, tesco: 1.25, morrisons: 1.20, aldi: 1.00, lidl: 1.05, sainsbury: 1.30 },
    nutrition: { calories: 33, protein: 3.4, carbs: 1.4, fat: 1.8 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Tofu Firm 400g',          category: 'meat',    unit: '400g block',
    prices: { asda: 1.75, tesco: 1.89, morrisons: 1.85, aldi: 1.59, lidl: 1.65, sainsbury: 1.99 },
    nutrition: { calories: 76, protein: 8.1, carbs: 1.9, fat: 4.2 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  { name: 'Vegan Mince 500g',        category: 'meat',    unit: '500g',
    prices: { asda: 2.50, tesco: 2.75, morrisons: 2.65, aldi: 2.29, lidl: 2.35, sainsbury: 2.85 },
    nutrition: { calories: 120, protein: 14, carbs: 6.0, fat: 4.0 }, tags: ['vegan', 'high-protein'] },

  { name: 'Quorn Mince 500g',        category: 'meat',    unit: '500g',
    prices: { asda: 2.75, tesco: 2.99, morrisons: 2.89, aldi: null, lidl: null, sainsbury: 3.05 },
    nutrition: { calories: 84, protein: 14, carbs: 3.0, fat: 2.0 }, tags: ['vegetarian', 'high-protein', 'low-fat'] },

  { name: 'Quorn Fillets 2 pack',    category: 'meat',    unit: '2 × 100g',
    prices: { asda: 2.50, tesco: 2.75, morrisons: 2.65, aldi: null, lidl: null, sainsbury: 2.85 },
    nutrition: { calories: 90, protein: 13, carbs: 3.5, fat: 2.5 }, tags: ['vegetarian', 'high-protein', 'low-fat'] },

  { name: 'Vegan Butter 250g',       category: 'dairy',   unit: '250g',
    prices: { asda: 1.89, tesco: 2.00, morrisons: 1.95, aldi: 1.65, lidl: 1.69, sainsbury: 2.10 },
    nutrition: { calories: 680, protein: 0.1, carbs: 0.6, fat: 75 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Vegan Cheddar Slices 200g', category: 'dairy', unit: '200g',
    prices: { asda: 2.25, tesco: 2.50, morrisons: 2.39, aldi: 1.99, lidl: 2.09, sainsbury: 2.55 },
    nutrition: { calories: 280, protein: 5.0, carbs: 8.0, fat: 25 }, tags: ['vegan', 'gluten-free'] },

  // ─── CEREALS & BREAKFAST ───────────────────────────────────────────────
  { name: 'Cornflakes 500g',         category: 'pantry',  unit: '500g box',
    prices: { asda: 0.99, tesco: 1.10, morrisons: 1.05, aldi: 0.85, lidl: 0.89, sainsbury: 1.15 },
    nutrition: { calories: 371, protein: 7.0, carbs: 84, fat: 1.0 }, tags: ['vegan'] },

  { name: 'Weetabix 24 pack',        category: 'pantry',  unit: '24 biscuits',
    prices: { asda: 1.89, tesco: 2.00, morrisons: 1.95, aldi: null, lidl: null, sainsbury: 2.10 },
    nutrition: { calories: 342, protein: 11, carbs: 68, fat: 2.0 }, tags: ['vegan'] },

  { name: 'Granola Honey & Nut 500g', category: 'pantry', unit: '500g',
    prices: { asda: 1.89, tesco: 2.00, morrisons: 1.95, aldi: 1.65, lidl: 1.69, sainsbury: 2.10 },
    nutrition: { calories: 431, protein: 9.0, carbs: 65, fat: 16 }, tags: ['vegetarian'] },

  { name: 'Shreddies 500g',          category: 'pantry',  unit: '500g box',
    prices: { asda: 1.89, tesco: 1.99, morrisons: 1.95, aldi: null, lidl: null, sainsbury: 2.05 },
    nutrition: { calories: 348, protein: 10, carbs: 74, fat: 2.0 }, tags: ['vegan'] },

  // ─── CANNED GOODS (EXTRAS) ─────────────────────────────────────────────
  { name: 'Chicken Soup 400g',       category: 'pantry',  unit: '400g tin',
    prices: { asda: 0.75, tesco: 0.85, morrisons: 0.80, aldi: 0.65, lidl: 0.69, sainsbury: 0.90 },
    nutrition: { calories: 55, protein: 3.5, carbs: 7.0, fat: 1.5 }, tags: [] },

  { name: 'Tomato Soup 400g',        category: 'pantry',  unit: '400g tin',
    prices: { asda: 0.59, tesco: 0.69, morrisons: 0.65, aldi: 0.49, lidl: 0.52, sainsbury: 0.75 },
    nutrition: { calories: 41, protein: 1.2, carbs: 8.8, fat: 0.5 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Lentil Soup 400g',        category: 'pantry',  unit: '400g tin',
    prices: { asda: 0.65, tesco: 0.75, morrisons: 0.70, aldi: 0.55, lidl: 0.59, sainsbury: 0.79 },
    nutrition: { calories: 87, protein: 5.4, carbs: 14, fat: 1.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Sardines in Tomato Sauce 120g', category: 'meat', unit: '120g tin',
    prices: { asda: 0.69, tesco: 0.79, morrisons: 0.75, aldi: 0.55, lidl: 0.59, sainsbury: 0.85 },
    nutrition: { calories: 151, protein: 17, carbs: 3.5, fat: 7.5 }, tags: ['gluten-free', 'high-protein'] },

  { name: 'Mackerel Fillets in Brine 125g', category: 'meat', unit: '125g tin',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.75, lidl: 0.79, sainsbury: 1.05 },
    nutrition: { calories: 202, protein: 22, carbs: 0.0, fat: 12 }, tags: ['gluten-free', 'high-protein'] },

  { name: 'Sweetcorn Tin 325g',      category: 'pantry',  unit: '325g tin',
    prices: { asda: 0.49, tesco: 0.59, morrisons: 0.55, aldi: 0.39, lidl: 0.42, sainsbury: 0.65 },
    nutrition: { calories: 86, protein: 3.2, carbs: 19, fat: 1.2 }, tags: ['vegan', 'gluten-free'] },

  { name: 'Butter Beans Tin 400g',   category: 'pantry',  unit: '400g tin',
    prices: { asda: 0.49, tesco: 0.59, morrisons: 0.55, aldi: 0.39, lidl: 0.42, sainsbury: 0.65 },
    nutrition: { calories: 124, protein: 8.4, carbs: 22, fat: 0.5 }, tags: ['vegan', 'gluten-free', 'high-protein'] },

  // ─── DAIRY EXTRAS ──────────────────────────────────────────────────────
  { name: 'Sour Cream 300ml',        category: 'dairy',   unit: '300ml',
    prices: { asda: 0.89, tesco: 0.99, morrisons: 0.95, aldi: 0.79, lidl: 0.82, sainsbury: 1.05 },
    nutrition: { calories: 193, protein: 2.5, carbs: 3.5, fat: 19 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Feta Cheese 200g',        category: 'dairy',   unit: '200g',
    prices: { asda: 1.25, tesco: 1.40, morrisons: 1.35, aldi: 1.09, lidl: 1.15, sainsbury: 1.45 },
    nutrition: { calories: 264, protein: 14, carbs: 4.1, fat: 21 }, tags: ['vegetarian', 'gluten-free'] },

  { name: 'Parmesan 100g',           category: 'dairy',   unit: '100g',
    prices: { asda: 1.89, tesco: 2.00, morrisons: 1.95, aldi: 1.65, lidl: 1.69, sainsbury: 2.10 },
    nutrition: { calories: 431, protein: 38, carbs: 0.0, fat: 29 }, tags: ['vegetarian', 'gluten-free', 'high-protein'] },

  { name: 'Cream Cheese 180g',       category: 'dairy',   unit: '180g',
    prices: { asda: 1.25, tesco: 1.35, morrisons: 1.30, aldi: 1.09, lidl: 1.15, sainsbury: 1.40 },
    nutrition: { calories: 296, protein: 5.4, carbs: 4.0, fat: 29 }, tags: ['vegetarian', 'gluten-free'] },

];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // wipe existing products so we don't get duplicates on re-runs
    const deleted = await Product.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing products`);

    // insert everything in one shot
    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products successfully`);

    // quick sanity check - print counts per category
    const cats = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    console.log('\nProducts per category:');
    cats.forEach((c) => console.log(`  ${c._id}: ${c.count}`));

  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDone - disconnected from MongoDB');
  }
}

seed();
