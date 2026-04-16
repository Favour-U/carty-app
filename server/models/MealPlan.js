// meal plan model  stores a saved weekly plan belonging to a user
const mongoose = require('mongoose');

// each individual meal (breakfast / lunch / dinner / snacks)
const mealSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  side:        { type: String, default: '' },
  calories:    { type: Number, default: 0 },
  type:        { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snacks'] },
  nutrition: {
    protein: { type: Number, default: 0 },
    carbs:   { type: Number, default: 0 },
    fat:     { type: Number, default: 0 },
  },
  ingredients: [{ name: String, quantity: String, price: Number, store: String }],
  steps:       [String],
}, { _id: false });

// one full day four meal slots
const daySchema = new mongoose.Schema({
  day:       { type: String, required: true }, // 'Monday', 'Tuesday'
  breakfast: mealSchema,
  lunch:     mealSchema,
  dinner:    mealSchema,
  snacks:    mealSchema,
}, { _id: false });

const mealPlanSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weeklyBudget:{ type: Number },
  days:        [daySchema],
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
